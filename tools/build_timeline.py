#!/usr/bin/env python3
"""Assemble the 3-part story timeline from the VO clips.

Narrator clips are split into phrases at their K-1 longest silences (K = phrases in the script,
split on [pause]/[long pause]). Each phrase becomes a beat; cards (titles, choices, CTAs) and
character lines are slotted between. Writes film/timeline.json, film/audio/vo.wav, film.json.
"""
import json, os, re, subprocess, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
import sys
STORY = sys.argv[1] if len(sys.argv) > 1 else 's8'
VO = os.path.join(ROOT, 'vo'); FILM = os.path.join(ROOT, STORY, 'film')
SR = 48000; HZ = 60
PLAN = json.load(open(os.path.join(ROOT, 'plan.json')))
PROMPT = {l['file'].split('.')[0]: l['prompt'] for l in PLAN['lines']}


def clean(s):
    s = re.sub(r'\[[^\]]*\]', ' ', s)
    s = s.replace("'", '‘')
    return re.sub(r'\s+', ' ', s).strip()


def phrases(key):
    parts = re.split(r'\[(?:long )?pause\]', PROMPT[key])
    return [clean(p) for p in parts if clean(p)]


def load(key):
    p = os.path.join(VO, key + '.mp3')
    if not os.path.exists(p):
        return None
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32).astype(np.float64)
    a = np.abs(x); idx = np.where(a > 0.01)[0]
    return x[max(0, idx[0] - 1200): idx[-1] + 4000] if len(idx) else x


def env_of(x):
    hop = SR // HZ; n = len(x) // hop
    r = np.sqrt((x[:n * hop].reshape(n, hop) ** 2).mean(1) + 1e-12)
    return np.clip(r / (np.percentile(r, 97) + 1e-9), 0, 1.2)


def split_phrases(x, texts):
    """Pick phrase boundaries among silences so phrase lengths track their text length (DP)."""
    k = len(texts); e = env_of(x); voiced = e > 0.08; n = len(voiced); hop = SR // HZ
    gaps = []; i = 0
    while i < n:
        if not voiced[i]:
            j = i
            while j < n and not voiced[j]: j += 1
            if i > 0 and j < n and j - i >= 10: gaps.append(((i + j) / 2, (j - i) / HZ))
            i = j
        else: i += 1
    w = np.array([len(t) + 6 * t.count('...') + 4 for t in texts], float)
    total = n; exp = w / w.sum() * total
    pos = [0.0] + [g[0] for g in gaps] + [float(n)]; glen = [0.0] + [g[1] for g in gaps] + [0.0]
    G = len(pos); INF = 1e18
    dp = np.full((k + 1, G), INF); bk = np.zeros((k + 1, G), int); dp[0][0] = 0
    for m in range(1, k + 1):
        for j in range(1, G):
            for i in range(j):
                if dp[m - 1][i] >= INF: continue
                d = pos[j] - pos[i]
                c = dp[m - 1][i] + np.log(max(d, 1) / exp[m - 1]) ** 2 - (0.8 * glen[j] if j < G - 1 else 0)
                if c < dp[m][j]: dp[m][j] = c; bk[m][j] = i
    idx = [G - 1]
    for m in range(k, 0, -1): idx.append(bk[m][idx[-1]])
    idx = idx[::-1]
    out = []
    for a, b in zip(idx[:-1], idx[1:]):
        s0, s1 = int(pos[a]), int(pos[b]); seg = voiced[s0:s1]; v = np.where(seg)[0]
        s = s0 + (v[0] if len(v) else 0); t = s0 + (v[-1] + 1 if len(v) else s1 - s0)
        out.append((max(0, s * hop - 1500), min(len(x), t * hop + 3000)))
    return out


def words_for(text, env):
    """Word timings: spread voiced time by syllables, then snap each word edge to the nearest energy dip."""
    words = text.split(); voiced = env > 0.08
    vt = np.cumsum(voiced) / HZ; total = vt[-1] if len(vt) else len(env) / HZ
    def syl(s):
        v = len(re.findall(r'[aeiouAEIOU]', s)); return max(1, v)
    w = np.array([syl(s) * 3.0 + 0.8 + (2.0 if re.search(r'[.!?…:]$', s) else 0.9 if s.endswith((',', '—')) else 0) for s in words])
    cum = np.concatenate([[0], np.cumsum(w)]) / w.sum() * total
    def v2t(v): return min(int(np.searchsorted(vt, v)), len(vt) - 1)
    edges = [v2t(c) for c in cum]; sm = np.convolve(env, np.ones(5) / 5, mode='same')
    for i in range(1, len(edges) - 1):
        a, z = max(edges[i] - 9, edges[i - 1] + 3), min(edges[i] + 9, len(sm) - 1)
        if z > a: edges[i] = a + int(np.argmin(sm[a:z]))
    return [{'w': s, 's': round(edges[i] / HZ, 3), 'e': round(edges[i + 1] / HZ, 3)} for i, s in enumerate(words)]


def est_clip(text):
    n = len(text.split()); d = n / 2.3 + 0.3
    return np.zeros(int(d * SR))


# ---------------------------------------------------------------- sequence
SEQ = [tuple(x) for x in json.load(open(os.path.join(ROOT, STORY, 'story.json')))['seq']]
GAP = 0.32   # breath between phrases


def main():
    t = 0.0; beats = []; track = np.zeros(int(400 * SR)); cache = {}; parts = {}
    for item in SEQ:
        kind = item[0]
        if kind == 'card':
            _, key, dur, part = item
            beats.append({'key': key, 'start': round(t, 3), 'dur': dur, 'part': part, 'who': None})
            t += dur
            continue
        if kind == 'c':
            _, key, bkey, part = item
            x = load(key); real = x is not None
            if not real: x = est_clip(clean(PROMPT[key]))
            env = env_of(x) if real else np.full(int(len(x) / SR * HZ), 0.6)
            i0 = int(t * SR); track[i0:i0 + len(x)] += x
            dur = len(x) / SR
            beats.append({'key': bkey, 'start': round(t, 3), 'dur': round(dur, 3), 'part': part, 'who': key, 'real': real,
                          'text': clean(PROMPT[key]), 'words': words_for(clean(PROMPT[key]), env), 'env': [round(float(v), 3) for v in env]})
            t += dur + GAP
            continue
        _, key, idxs, part = item
        ph = phrases(key)
        if key not in cache:
            x = load(key)
            if x is None:
                cache[key] = (None, None)
            else:
                cache[key] = (x, split_phrases(x, ph))
        x, rng = cache[key]
        for i in idxs:
            if x is None:
                seg = est_clip(ph[i]); env = np.full(int(len(seg) / SR * HZ), 0.6); real = False
            else:
                a, b = rng[i]; seg = x[a:b]; env = env_of(seg); real = True
            i0 = int(t * SR); track[i0:i0 + len(seg)] += seg
            dur = len(seg) / SR
            beats.append({'key': f'{key}_{i}', 'start': round(t, 3), 'dur': round(dur, 3), 'part': part, 'who': 'narrator', 'real': real,
                          'text': ph[i], 'words': words_for(ph[i], env), 'env': [round(float(v), 3) for v in env]})
            t += dur + GAP
    total = round(t, 2)
    for b in beats:
        parts.setdefault(b['part'], [b['start'], 0]); parts[b['part']][1] = round(b['start'] + b['dur'], 3)
    json.dump({'duration': total, 'beats': beats, 'parts': parts}, open(os.path.join(FILM, 'timeline.json'), 'w'), ensure_ascii=False)
    fj = json.load(open(os.path.join(FILM, 'film.json'))); fj['duration'] = total
    json.dump(fj, open(os.path.join(FILM, 'film.json'), 'w'), indent=1)
    pcm = (np.clip(track[:int(total * SR)], -1, 1) * 32767).astype('<i2')
    with wave.open(os.path.join(FILM, 'audio', 'vo.wav'), 'wb') as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes(pcm.tobytes())
    for b in beats:
        print(f"{b['key']:12s} {b['start']:7.2f} +{b['dur']:5.2f} {'' if b.get('real', True) else 'est'}  {b.get('text', '')[:50]}")
    print('parts', parts, 'total', total)


if __name__ == '__main__' and len(sys.argv) > 1:
    main()
