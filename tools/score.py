#!/usr/bin/env python3
"""Synthesized score + SFX for the mountain story, keyed to film/timeline.json beats.
Mixes with film/audio/vo.wav (ducked) and masters to -14 LUFS → film/audio/mix.wav."""
import json, os, subprocess, wave
import numpy as np
from scipy.signal import lfilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
import sys
STORY = sys.argv[1]
FILM = os.path.join(ROOT, STORY, 'film'); SR = 48000
CFG = json.load(open(os.path.join(ROOT, STORY, 'story.json'))).get('score', {})
TL = json.load(open(os.path.join(FILM, 'timeline.json')))
B = {b['key']: b for b in TL['beats']}
DUR = TL['duration']; N = int(DUR * SR) + SR
rng = np.random.default_rng(3)
L = np.zeros(N); R = np.zeros(N)


def st(k, f=0.0): return B[k]['start'] + B[k]['dur'] * f
def en(k): return B[k]['start'] + B[k]['dur']
def midi(n): return 440 * 2 ** ((n - 69) / 12)
def lp(x, fc, n=2):
    a = np.exp(-2 * np.pi * fc / SR)
    for _ in range(n): x = lfilter([1 - a], [1, -a], x)
    return x
def hp(x, fc): return x - lp(x, fc, 1)
def noise(n): return rng.uniform(-1, 1, n)
def sine(f, n, ph=0): return np.sin(2 * np.pi * f * np.arange(n) / SR + ph)
def saw(f, n, det=0.004):
    t = np.arange(n) / SR
    return sum(2 * ((t * f * (1 + d) + o) % 1) - 1 for d, o in [(-det, 0), (0, .3), (det, .6)]) / 3
def env(n, a=0.01, r=0.2):
    t = np.arange(n) / SR; T = n / SR
    return np.clip(t / max(a, 1e-4), 0, 1) * np.clip((T - t) / max(r, 1e-4), 0, 1)
def add(sig, t0, g=1.0, pan=0.0):
    i = int(t0 * SR)
    if i < 0: sig = sig[-i:]; i = 0
    if i >= N: return
    sig = sig[:N - i]
    L[i:i + len(sig)] += sig * g * np.sqrt(0.5 * (1 - pan)); R[i:i + len(sig)] += sig * g * np.sqrt(0.5 * (1 + pan))
def span(a, b): return max(1, int((b - a) * SR))

# ---------------------------------------------------------------- generic beds
P = TL['parts']; KEYS = [b['key'] for b in TL['beats']]
def st2(k, f=0.0): return st(k, f) if k in B else 0
def pad(a, b, notes, g, fc=900):
    m = span(a, b); x = sum(lp(saw(midi(nn), m), fc) for nn in notes) / len(notes); add(x * env(m, 1.0, 1.0), a, g)
def sub(a, b, nt, g):
    m = span(a, b); add(sine(midi(nt), m) * env(m, 0.8, 0.8), a, g)
root = CFG.get('root', 45)
# room tone / air
n = int(DUR * SR); add(lp(noise(n), 300, 2) * 0.35, 0, 0.35)
warm = st2(CFG['warm_from']) if CFG.get('warm_from') else DUR
for part in [p for p in ['1', '2', '3'] if p in P]:
    a, b = P[part]
    a2 = a + 2.0
    end = min(b, warm) if part == '3' else b
    pad(a2, end, [root, root + 7, root + 12, root + 15], 0.18, 650)
    sub(a2, end, root - 12, 0.22)
    # pulse: low tick every beat, speeds up toward choice
    tt = a2
    while tt < end - 0.3:
        m = int(0.12 * SR); add(sine(55, m) * np.exp(-np.arange(m) / SR * 30), tt, 0.35)
        tt += 0.75 if (end - tt) > 12 else 0.5
if warm < DUR:
    pad(warm, DUR, [root + 3, root + 10, root + 15, root + 19], 0.2, 1800)
def heart(a, b, bpm, g):
    t = a
    while t < b:
        for d, amp in [(0, 1), (0.16, 0.7)]:
            m = int(0.18 * SR); tt = np.arange(m) / SR
            add(np.sin(2 * np.pi * (50 + 30 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 18) * amp, t + d, g)
        t += 60 / bpm
for k, bpm in CFG.get('heart', []):
    if k in B: heart(st(k), en(k), bpm, 0.55)
def riser(t_end, dur, g):
    m = int(dur * SR); add(lp(hp(noise(m), 800) * np.linspace(0, 1, m) ** 2, 6000, 1), t_end - dur, g)
def boom(t0, g):
    m = int(2.2 * SR); tt = np.arange(m) / SR
    add(np.sin(2 * np.pi * (36 + 70 * np.exp(-tt * 7)) * tt) * np.exp(-tt * 2.2) + lp(noise(m), 250) * np.exp(-tt * 5) * 0.8, t0, g)
for k in ['choice1', 'choice2']:
    if k in B: riser(st(k), 1.6, 0.35); boom(st(k), 0.9)
for k in ['title1', 'title2', 'title3'] + CFG.get('boom', []):
    if k in B: boom(st(k), 0.7)
def whoosh(t0, d=0.45, g=0.4):
    m = int(d * SR); add(lp(noise(m), 3500) * np.hanning(m), t0 - d * 0.6, g)
for b in TL['beats']: whoosh(b['start'], 0.35, 0.16)
def click(t0, g=0.6):
    m = int(0.06 * SR); add(noise(m) * np.exp(-np.arange(m) / SR * 90), t0, g)
def ding(t0, note=84, g=0.3):
    m = int(0.35 * SR); add((sine(midi(note), m) + 0.4 * sine(midi(note + 12), m)) * np.exp(-np.arange(m) / SR * 9), t0, g)
def vibrate(t0, reps=3, g=0.35):
    for i in range(reps):
        m = int(0.35 * SR); add(sine(160, m) * (0.5 + 0.5 * np.sign(sine(30, m))) * env(m, 0.01, 0.05), t0 + 0.2 + i * 1.0, g)
def ring(a, b, g=0.22):
    t = a
    while t < b - 0.5:
        for j in range(8):
            m = int(0.05 * SR); add((sine(1300, m) + sine(1700, m)) * env(m, 0.003, 0.01), t + j * 0.06, g)
        t += 2.0
def knock(t0, n=3, g=0.7):
    for i in range(n):
        m = int(0.12 * SR); tt = np.arange(m) / SR; add(lp(noise(m), 700) * np.exp(-tt * 40) + np.sin(2 * np.pi * 110 * tt) * np.exp(-tt * 30), t0 + i * 0.28, g)
def steps(a, b, g=0.5):
    t = a
    while t < b: knock(t, 1, g * 0.6); t += 0.7
def lock(t0, g=0.6):
    for d in [0, 0.18, 0.33]:
        m = int(0.07 * SR); add(hp(noise(m), 2500) * np.exp(-np.arange(m) / SR * 60), t0 + d, g)
FX = {'click': click, 'ding': ding, 'vibrate': vibrate, 'knock': knock, 'lock': lock}
for name, k, f in CFG.get('fx', []):
    if k in B: FX[name](st(k, f))
for k in CFG.get('ring', []):
    if k in B: ring(st(k), en(k))
for k in CFG.get('steps', []):
    if k in B: steps(st(k), en(k))
for k in ['cta1', 'cta2', 'cta3']:
    if k in B: ding(st(k) + 1.5, 84, 0.3); click(st(k) + 1.5, 0.4)

# ---------------------------------------------------------------- mix
music = np.stack([L, R], 1)[: int(DUR * SR)]
with wave.open(os.path.join(FILM, 'audio', 'vo.wav')) as wf:
    vo = np.frombuffer(wf.readframes(wf.getnframes()), '<i2').astype(np.float64) / 32768
vo = np.pad(vo, (0, max(0, len(music) - len(vo))))[: len(music)]
# radio line through a band-pass
for k in CFG.get('phone_voice', []):
    if k in B:
        rb = B[k]; i0, i1 = int(rb['start'] * SR), int((rb['start'] + rb['dur']) * SR)
        vo[i0:i1] = hp(lp(vo[i0:i1], 3400, 2), 350) * 2.0
lev = np.sqrt(np.convolve(vo ** 2, np.ones(2400) / 2400, mode='same'))
duck = lp(1 - 0.55 * np.clip(lev / 0.04, 0, 1), 5, 1)
music *= duck[:, None]
music *= 10 ** (-24 / 20) / (np.sqrt((music ** 2).mean()) + 1e-9)
vv = vo[np.abs(vo) > 0.01]
mix = music + np.stack([vo, vo], 1) * ((10 ** (-17 / 20) / (np.sqrt((vv ** 2).mean()) + 1e-9)) if len(vv) else 1.0)
mix /= max(1.0, np.abs(mix).max() / 0.98)
tmp = os.path.join(FILM, 'audio', 'premix.wav')
with wave.open(tmp, 'wb') as wf:
    wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes((np.clip(mix, -1, 1) * 32767).astype('<i2').tobytes())
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1:LRA=11', '-ar', str(SR), os.path.join(FILM, 'audio', 'mix.wav')], check=True)
print('mix.wav', round(DUR, 2), 's')
