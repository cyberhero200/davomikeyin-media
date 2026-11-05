// Shared kit for the "Tasavvur qil" story series: timeline access, captions, cards, HUD, phone.
import * as M from './motion.js';
export const { W, H, E, prog, lerp, clamp, spring, SPRING, bump, font, fill, rrect, hash01, noise1, TAU } = M;
export { M };

export const TL = await fetch('timeline.json').then((r) => r.json());
export const BEATS = TL.beats;
export const B = Object.fromEntries(BEATS.map((b) => [b.key, b]));
export const END = (b) => b.start + b.dur;
export const D = 'Display', UI = 'UI';
export const INK = '#0C0F1A', YEL = '#FFD54A', RED = '#FF4A3D', GRN = '#3DDC84', BLU = '#3A8DFF';
export const sp = (t, t0, cfg = SPRING.bouncy) => (t < t0 ? 0 : spring(t - t0, cfg));
export const beatAt = (t) => { let cur = BEATS[0]; for (const b of BEATS) if (t >= b.start - 0.001) cur = b; return cur; };
export const at = (key, f = 0) => (B[key] ? B[key].start + B[key].dur * f : 0);
export const lt = (t, b) => t - b.start;
export const pf = (t, b) => clamp((t - b.start) / b.dur);   // progress through beat

export function keys(t, list) {
  if (t <= list[0][0]) return list[0][1];
  for (let i = 1; i < list.length; i++) if (t < list[i][0]) {
    const [a, va] = list[i - 1], [b, vb] = list[i];
    return lerp(va, vb, E.inOutCubic((t - a) / Math.max(1e-6, b - a)));
  }
  return list[list.length - 1][1];
}
export const stepKeys = (t, list) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export function mixc(a, b, k) { const A = hex(a), Bc = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, Bc[i], k))).join(',')})`; }
export const envAt = (b, t) => (b && b.env ? b.env[Math.max(0, Math.min(b.env.length - 1, Math.floor((t - b.start) * 60)))] || 0 : 0);

export function vignette(ctx, k = 0.6, col = '0,0,0') {
  const g = ctx.createRadialGradient(W / 2, H * 0.48, H * 0.25, W / 2, H * 0.5, H * 0.75);
  g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${k})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
export function label(ctx, txt, x, y, { size = 44, col = '#FFF', bg = 'rgba(8,10,20,0.82)', border = YEL, k = 1 } = {}) {
  if (k <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.font = font(size, 900, D);
  const w = ctx.measureText(txt).width + size * 1.1, h = size * 1.6;
  ctx.fillStyle = bg; ctx.strokeStyle = border; ctx.lineWidth = 4; rrect(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.fillText(txt, 0, size * 0.36);
  ctx.restore();
}
export function bigText(ctx, lines, y, t, t0, { size = 110, cols = [] } = {}) {
  ctx.save(); ctx.textAlign = 'center'; ctx.lineJoin = 'round';
  lines.forEach((ln, i) => {
    const k = sp(t, t0 + i * 0.12); if (k <= 0) return;
    ctx.save(); ctx.translate(W / 2, y + i * size * 1.05); ctx.scale(k, k);
    let f = size; ctx.font = font(f, 900, D); while (ctx.measureText(ln).width > W - 100) { f -= 4; ctx.font = font(f, 900, D); }
    ctx.lineWidth = f * 0.16; ctx.strokeStyle = 'rgba(0,0,0,0.85)'; ctx.strokeText(ln, 0, 0);
    ctx.fillStyle = cols[i] || '#FFFFFF'; ctx.fillText(ln, 0, 0); ctx.restore();
  });
  ctx.restore();
}
export function shakeCam(ctx, t, amp) { if (amp > 0) ctx.translate(noise1(t * 14, 1) * amp, noise1(t * 14, 2) * amp); }

// phone with a screen callback (screen coords 0..600 × 0..1200)
export function phone(ctx, x, y, s, draw) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-300, -600);
  ctx.fillStyle = '#0A0A0E'; rrect(ctx, -24, -24, 648, 1248, 90); ctx.fill(); ctx.strokeStyle = '#2C2C34'; ctx.lineWidth = 6; ctx.stroke();
  ctx.save(); rrect(ctx, 0, 0, 600, 1200, 72); ctx.clip(); draw(ctx); ctx.restore();
  ctx.fillStyle = '#000'; rrect(ctx, 210, 22, 180, 46, 23); ctx.fill();
  ctx.restore();
}

// karaoke captions, chunked
export function captions(ctx, t, { y = 1470, hot = /$^/ } = {}) {
  const b = beatAt(t); if (!b.words) return;
  const l = t - b.start; if (l > b.dur + 0.15) return;
  const ws = b.words; let ci = -1; ws.forEach((w, i) => { if (l >= w.s - 0.02) ci = i; }); if (ci < 0) return;
  const chunks = []; let cur = [];
  ws.forEach((w, i) => { cur.push(i); if (cur.length >= 4 || /[.!?…:,—"]$/.test(w.w)) { chunks.push(cur); cur = []; } }); if (cur.length) chunks.push(cur);
  const ch = chunks.find((c) => c.includes(ci));
  const k0 = ws[ch[0]].s + b.start;
  ctx.save(); ctx.textAlign = 'left'; ctx.lineJoin = 'round';
  let f = 66; ctx.font = font(f, 900, D);
  const txt = ch.map((i) => ws[i].w);
  const width = () => txt.reduce((a, s) => a + ctx.measureText(s + ' ').width, 0);
  while (width() > W - 120 && f > 40) { f -= 3; ctx.font = font(f, 900, D); }
  const pop = sp(t, k0 - 0.02, SPRING.bouncy);
  let x = W / 2 - width() / 2; ctx.translate(0, (1 - pop) * 20);
  ch.forEach((i, j) => {
    const on = i === ci, said = i <= ci;
    ctx.lineWidth = f * 0.22; ctx.strokeStyle = 'rgba(0,0,0,0.92)'; ctx.strokeText(txt[j], x, y);
    ctx.fillStyle = on ? (hot.test(txt[j]) ? RED : YEL) : said ? '#FFFFFF' : 'rgba(255,255,255,0.55)';
    ctx.fillText(txt[j], x, y); x += ctx.measureText(txt[j] + ' ').width;
  });
  ctx.restore();
}

// HUD: left clock box with day + battery; right pills [{txt, col}]
export function hud(ctx, t, { hh, mi, day = 1, batt = 50, pills = [] }) {
  const blink = Math.floor(t * 2) % 2 === 0;
  ctx.save();
  ctx.fillStyle = 'rgba(8,10,20,0.72)'; ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 3;
  rrect(ctx, 40, 150, 330, 92, 18); ctx.fill(); ctx.stroke();
  ctx.font = font(60, 900, D); ctx.fillStyle = batt <= 10 ? RED : '#FFFFFF'; ctx.fillText(`${hh}${blink ? ':' : ' '}${mi}`, 62, 218);
  ctx.font = font(26, 900, D); ctx.fillStyle = '#FFFFFF'; ctx.fillText(`${day}-KUN`, 250, 190);
  const bc = batt <= 10 ? RED : batt <= 20 ? YEL : GRN;
  ctx.strokeStyle = bc; ctx.lineWidth = 3; rrect(ctx, 250, 204, 46, 22, 5); ctx.stroke(); ctx.fillStyle = bc; ctx.fillRect(297, 210, 4, 10);
  ctx.fillRect(254, 208, 38 * batt / 100, 14); ctx.font = font(22, 800, D); ctx.fillText(`${batt}%`, 306, 224);
  pills.forEach(({ txt, col, pulse = 0 }, i) => {
    const y = 150 + i * 64; ctx.font = font(30, 900, D); const w = ctx.measureText(txt).width + 44;
    const s = 1 + pulse * 0.06 * Math.sin(t * 10);
    ctx.save(); ctx.translate(W - 40 - w / 2, y + 27); ctx.scale(s, s); ctx.translate(-(W - 40 - w / 2), -(y + 27));
    ctx.fillStyle = 'rgba(8,10,20,0.72)'; ctx.strokeStyle = col; ctx.lineWidth = 3; rrect(ctx, W - 40 - w, y, w, 54, 27); ctx.fill(); ctx.stroke();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(W - 40 - w + 22, y + 27, 7, 0, TAU); ctx.fill();
    ctx.fillStyle = '#FFF'; ctx.fillText(txt, W - 40 - w + 36, y + 38); ctx.restore();
  });
  ctx.restore();
}
export const clock = (m) => ({ hh: String(Math.floor((m % 1440) / 60)).padStart(2, '0'), mi: String(Math.floor(m % 60)).padStart(2, '0'), day: m >= 1440 ? 2 : 1 });

// ---------------------------------------------------------------- cards
export function titleCard(ctx, t, b, bg, tag, lines, hook) {
  bg(ctx, t); vignette(ctx, 0.8);
  label(ctx, tag, W / 2, 640, { k: sp(t, b.start), size: 46, border: RED });
  bigText(ctx, lines, 820, t, b.start + 0.1, { size: 140, cols: ['#FFF', YEL, YEL] });
  if (hook) label(ctx, hook, W / 2, 820 + lines.length * 147 + 60, { k: sp(t, b.start + 0.7), size: 40, border: RED, bg: 'rgba(160,20,20,0.88)' });
}
export function choiceCard(ctx, t, b, bg, q, opts) {
  bg(ctx, t); ctx.fillStyle = 'rgba(40,0,0,0.55)'; ctx.fillRect(0, 0, W, H); vignette(ctx, 0.9);
  const lines = q.split(' ').reduce((acc, w) => { const l = acc[acc.length - 1]; if (l && (l + ' ' + w).length <= 13) acc[acc.length - 1] = l + ' ' + w; else acc.push(w); return acc; }, []);
  bigText(ctx, lines, 640, t, b.start, { size: 96, cols: ['#FFF', '#FFF', YEL, YEL] });
  opts.forEach((o, i) => {
    const k = sp(t, b.start + 0.6 + i * 0.25); if (k <= 0) return;
    const y = 1080 + i * 180, col = i === 0 ? RED : GRN, pulse = 1 + 0.03 * Math.sin(t * 6 + i * 3);
    ctx.save(); ctx.translate(W / 2, y + 65); ctx.scale(k * pulse, k * pulse);
    ctx.fillStyle = col; rrect(ctx, -400, -65, 800, 130, 65); ctx.fill();
    let f = 52; ctx.font = font(f, 900, D); while (ctx.measureText(o).width > 720) { f -= 3; ctx.font = font(f, 900, D); }
    ctx.fillStyle = '#FFF'; ctx.textAlign = 'center'; ctx.fillText(o, 0, f * 0.35); ctx.restore();
  });
}
export function ctaCard(ctx, t, b, next, top = 'JAVOBINGNI') {
  fill(ctx, '#07090F');
  const g = ctx.createRadialGradient(W / 2, 900, 50, W / 2, 900, 900); g.addColorStop(0, 'rgba(120,20,20,0.6)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  bigText(ctx, [top, 'IZOHDA YOZ'], 600, t, b.start, { size: 100, cols: ['#FFF', YEL] });
  const ay = 820 + Math.abs(Math.sin(t * 4)) * 26;
  ctx.strokeStyle = YEL; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(W / 2, ay); ctx.lineTo(W / 2, ay + 110); ctx.moveTo(W / 2 - 44, ay + 70); ctx.lineTo(W / 2, ay + 114); ctx.lineTo(W / 2 + 44, ay + 70); ctx.stroke();
  const k = sp(t, b.start + 0.6), tapped = t > b.start + 1.5, sq = 1 - 0.08 * bump(t, b.start + 1.5, 0.12);
  ctx.save(); ctx.translate(W / 2, 1150); ctx.scale(k * sq, k * sq);
  ctx.fillStyle = tapped ? '#2A2E3A' : RED; rrect(ctx, -330, -80, 660, 160, 80); ctx.fill();
  ctx.fillStyle = '#FFF'; ctx.font = font(60, 900, D); ctx.textAlign = 'center'; ctx.fillText(tapped ? 'OBUNA BO‘LDING' : 'OBUNA BO‘L', 0, 22); ctx.restore();
  const hk = prog(t, b.start + 0.9, b.start + 1.5);
  if (hk > 0 && t < b.start + 2.4) { ctx.save(); ctx.translate(lerp(W + 100, W / 2 + 120, E.outCubic(hk)), lerp(1500, 1190, E.outCubic(hk))); ctx.fillStyle = '#F2C9A0'; ctx.strokeStyle = INK; ctx.lineWidth = 6; rrect(ctx, -30, -10, 60, 150, 28); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(10, 160, 70, 80, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore(); }
  label(ctx, next, W / 2, 1420, { k: sp(t, b.start + 1.1), size: 50, border: YEL });
}
export function pollCard(ctx, t, b, bg, rows, comments = []) {
  bg(ctx, t); ctx.fillStyle = 'rgba(4,6,14,0.72)'; ctx.fillRect(0, 0, W, H);
  bigText(ctx, ['SIZ TANLADINGIZ:'], 560, t, b.start, { size: 64 });
  const g = E.outCubic(prog(t, b.start + 0.3, b.start + 1.6));
  rows.forEach(([n, pv, col], i) => {
    const y = 700 + i * 200;
    ctx.fillStyle = 'rgba(20,24,40,0.95)'; rrect(ctx, 110, y, 860, 140, 30); ctx.fill();
    ctx.fillStyle = col; rrect(ctx, 110, y, Math.max(60, 860 * pv / 100 * g), 140, 30); ctx.fill();
    ctx.fillStyle = '#FFF'; ctx.font = font(44, 900, D); ctx.fillText(n, 150, y + 86);
    ctx.textAlign = 'right'; ctx.fillText(`${Math.round(pv * g)}%`, 940, y + 86); ctx.textAlign = 'left';
  });
  comments.slice(0, 2).forEach((txt, i) => {
    const k = sp(t, b.start + 0.6 + i * 0.5); if (k <= 0) return;
    ctx.save(); ctx.translate(200 + i * 140, 1110 + i * 100); ctx.scale(k, k); ctx.font = font(34, 600, UI);
    const w = ctx.measureText(txt).width + 120; ctx.fillStyle = 'rgba(255,255,255,0.95)'; rrect(ctx, 0, 0, w, 76, 38); ctx.fill();
    ctx.fillStyle = ['#FF7A59', '#59A5FF'][i]; ctx.beginPath(); ctx.arc(38, 38, 24, 0, TAU); ctx.fill();
    ctx.fillStyle = '#111'; ctx.fillText(txt, 76, 50); ctx.restore();
  });
}
export function rulesCard(ctx, t, b, bg, rules) {
  bg(ctx, t); ctx.fillStyle = 'rgba(5,8,18,0.75)'; ctx.fillRect(0, 0, W, H);
  bigText(ctx, ['ESINGDA TUT'], 470, t, b.start, { size: 80, cols: [YEL] });
  rules.forEach((r, i) => {
    const k = sp(t, b.start + b.dur * (0.12 + i * 0.2)); if (k <= 0) return;
    const y = 600 + i * 170;
    ctx.save(); ctx.translate(W / 2, y + 60); ctx.scale(k, k); ctx.translate(-W / 2, -(y + 60));
    ctx.fillStyle = 'rgba(14,18,32,0.95)'; ctx.strokeStyle = GRN; ctx.lineWidth = 5; rrect(ctx, 90, y, 900, 124, 30); ctx.fill(); ctx.stroke();
    ctx.fillStyle = GRN; ctx.beginPath(); ctx.arc(160, y + 62, 38, 0, TAU); ctx.fill(); ctx.fillStyle = INK; ctx.font = font(44, 900, D); ctx.textAlign = 'center'; ctx.fillText(String(i + 1), 160, y + 78);
    ctx.textAlign = 'left'; ctx.fillStyle = '#FFF'; let f = 42; ctx.font = font(f, 900, D); while (ctx.measureText(r).width > 740) { f -= 2; ctx.font = font(f, 900, D); } ctx.fillText(r, 222, y + 76);
    ctx.restore();
  });
}

// run: scenes map + bg default + hud fn
export function run({ scenes, fallback, hudFn, hot, noHud = [] }) {
  const NO = new Set(noHud);
  M.film({
    fonts: [font(100, 900, D), font(80, 800, D), font(40, 600, UI)], samples: 4,
    draw(ctx, u, t) {
      const b = beatAt(t); const fn = scenes[b.key];
      ctx.save(); const z = 1 + 0.035 * Math.exp(-(t - b.start) * 9);
      ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
      if (fn) fn(ctx, t, b); else fallback(ctx, t, b);
      ctx.restore();
      if (!NO.has(b.key) && !/^(title|cta|choice)/.test(b.key)) hudFn(ctx, t);
      captions(ctx, t, { hot });
    },
  });
  window.CUES = { beats: BEATS.map((b) => ({ key: b.key, start: b.start, dur: b.dur })), parts: TL.parts };
}
