// Chegaradagi Hujjat S1E1 "Birinchi qoida". Pure function of time.
import { W, H, E, prog, lerp, clamp, bump, font, fill, rrect, hash01, noise1, TAU, D, UI, YEL, RED,
  B, at, sp, pf, keys, envAt, vignette, label, bigText, shakeCam, hud, clock, titleCard, choiceCard, ctaCard, run } from './common/kit.js';

const HOT = /(qora|sen|soya|to‘qqizinchi|ovozing|ovozingni|javob|ikki|boshqasini|eshikni|derazani)/i;
const TEAL = '#0B1C22', BLUE = '#7FD6E8', LAMP = '#FFB65C';
const flick = (t) => (noise1(t * 11, 7) > 0.62 ? 0.72 : 1);

function windowPane(ctx, x, y, w, h, t, shadow = 0) {
  ctx.fillStyle = '#16323A'; rrect(ctx, x, y, w, h, 8); ctx.fill();
  for (let i = 0; i < 5; i++) { ctx.fillStyle = `rgba(150,190,195,${0.06 + 0.03 * i / 5})`; ctx.beginPath(); ctx.ellipse(x + w * (0.2 + 0.15 * i) + noise1(t * 0.3, i) * 30, y + h * (0.25 + 0.14 * i), w * 0.42, h * 0.09, 0, 0, TAU); ctx.fill(); }
  if (shadow > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.globalAlpha = shadow; ctx.fillStyle = '#020507';
    const cx = x + w / 2, top = y + h * 0.22; ctx.beginPath(); ctx.ellipse(cx, top, w * 0.13, h * 0.11, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx - w * 0.28, y + h); ctx.quadraticCurveTo(cx - w * 0.24, top + h * 0.1, cx, top + h * 0.08); ctx.quadraticCurveTo(cx + w * 0.24, top + h * 0.1, cx + w * 0.28, y + h); ctx.fill(); ctx.restore(); }
  ctx.strokeStyle = '#05090B'; ctx.lineWidth = Math.max(4, w * 0.03); rrect(ctx, x, y, w, h, 8); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2, y + h); ctx.moveTo(x, y + h * 0.45); ctx.lineTo(x + w, y + h * 0.45); ctx.lineWidth = Math.max(3, w * 0.018); ctx.stroke();
}
function student(ctx, x, y, s) { // hooded silhouette seen from behind
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#16233F';
  ctx.beginPath(); ctx.moveTo(-150, 260); ctx.quadraticCurveTo(-150, 40, 0, 30); ctx.quadraticCurveTo(150, 40, 150, 260); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#0A0D12'; ctx.beginPath(); ctx.ellipse(0, -20, 70, 78, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,182,92,0.32)'; ctx.beginPath(); ctx.ellipse(-52, 0, 16, 50, 0.2, 0, TAU); ctx.fill(); ctx.restore();
}
function lamp(ctx, x, y, k) {
  const g = ctx.createRadialGradient(x, y + 60, 10, x, y + 60, 620); g.addColorStop(0, `rgba(255,182,92,${0.5 * k})`); g.addColorStop(1, 'rgba(255,182,92,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#050709'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x + 70, y + 170); ctx.lineTo(x + 70, y + 30); ctx.lineTo(x, y); ctx.stroke();
  ctx.fillStyle = '#050709'; ctx.beginPath(); ctx.moveTo(x - 70, y + 40); ctx.lineTo(x + 40, y + 40); ctx.lineTo(x + 10, y - 30); ctx.lineTo(x - 40, y - 30); ctx.fill();
}
function folder(ctx, x, y, s, open = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#050608'; rrect(ctx, -210, -130, 420, 270, 12); ctx.fill(); rrect(ctx, -210, -162, 150, 50, 10); ctx.fill();
  ctx.strokeStyle = '#2A3438'; ctx.lineWidth = 4; rrect(ctx, -210, -130, 420, 270, 12); ctx.stroke();
  ctx.fillStyle = 'rgba(200,210,210,0.75)'; ctx.font = font(44, 900, D); ctx.textAlign = 'center'; ctx.fillText('0-FAYL', 0, 18); ctx.textAlign = 'left';
  for (let i = 0; i < 26; i++) { ctx.fillStyle = `rgba(160,170,170,${0.05 + hash01(i, 3) * 0.1})`; ctx.fillRect(-200 + hash01(i, 1) * 390, -120 + hash01(i, 2) * 250, 4, 3); }
  ctx.restore();
}
function room(ctx, t, { shadow = 0, chair = 1, showFolder = 0, k = 1 } = {}) {
  const f = flick(t) * k; ctx.fillStyle = TEAL; ctx.fillRect(-40, -40, W + 80, H + 80);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 3; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(i * 135, 0); ctx.lineTo(i * 135, 1200); ctx.stroke(); }
  windowPane(ctx, 300, 330, 480, 560, t, shadow);
  ctx.fillStyle = '#2B1C12'; ctx.fillRect(-40, 1180, W + 80, 50); ctx.fillStyle = '#17100A'; ctx.fillRect(-40, 1230, W + 80, 800);
  if (showFolder) folder(ctx, 760, 1130, 0.34 * showFolder);
  lamp(ctx, 190, 950, f);
  if (chair) student(ctx, W / 2, 1020, 1);
  ctx.fillStyle = `rgba(0,0,0,${0.28 * (1 - f)})`; ctx.fillRect(0, 0, W, H); vignette(ctx, 0.72);
}
function desk(ctx, t, k = 1) {
  ctx.fillStyle = '#20150D'; ctx.fillRect(-40, -40, W + 80, H + 80);
  ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 4; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(0, 140 + i * 250 + noise1(i, 4) * 40); ctx.bezierCurveTo(300, 110 + i * 250, 700, 190 + i * 250, W, 140 + i * 250); ctx.stroke(); }
  const g = ctx.createRadialGradient(W * 0.4, 700, 60, W * 0.4, 700, 950); g.addColorStop(0, `rgba(255,182,92,${0.38 * flick(t) * k})`); g.addColorStop(1, 'rgba(0,0,0,0.7)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function miniRoom(c, x, y, w, h, t, shadow) {
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.fillStyle = TEAL; c.fillRect(x, y, w, h);
  windowPane(c, x + w * 0.27, y + h * 0.08, w * 0.46, h * 0.5, t, shadow);
  c.fillStyle = '#2B1C12'; c.fillRect(x, y + h * 0.72, w, h * 0.04); c.fillStyle = '#17100A'; c.fillRect(x, y + h * 0.76, w, h);
  student(c, x + w / 2, y + h * 0.6, w / 1000);
  const g = c.createRadialGradient(x + w * 0.16, y + h * 0.65, 2, x + w * 0.16, y + h * 0.65, w * 0.5); g.addColorStop(0, 'rgba(255,182,92,0.45)'); g.addColorStop(1, 'rgba(255,182,92,0)'); c.fillStyle = g; c.fillRect(x, y, w, h);
  c.restore();
}
function polaroid(ctx, x, y, s, rot, t, shadow = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.fillStyle = 'rgba(0,0,0,0.5)'; rrect(ctx, -292, -342, 600, 710, 10); ctx.fill();
  ctx.fillStyle = '#D7D1BF'; rrect(ctx, -300, -350, 600, 710, 10); ctx.fill(); miniRoom(ctx, -260, -310, 520, 520, t, shadow); ctx.restore();
}
function door(ctx, t, { glow = 0.8, feet = 1 } = {}) {
  ctx.fillStyle = '#081318'; ctx.fillRect(-40, -40, W + 80, H + 80);
  ctx.fillStyle = '#16262B'; rrect(ctx, 210, 240, 660, 1180, 6); ctx.fill(); ctx.strokeStyle = '#050A0C'; ctx.lineWidth = 16; ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 8; rrect(ctx, 290, 330, 500, 400, 6); ctx.stroke(); rrect(ctx, 290, 830, 500, 480, 6); ctx.stroke();
  ctx.fillStyle = '#8C7B55'; ctx.beginPath(); ctx.arc(790, 800, 22, 0, TAU); ctx.fill(); ctx.fillStyle = '#0F171A'; ctx.fillRect(-40, 1420, W + 80, 700);
  ctx.fillStyle = BLUE; ctx.globalAlpha = glow; ctx.fillRect(218, 1408, 644, 12); const g = ctx.createLinearGradient(0, 1420, 0, 1780); g.addColorStop(0, `rgba(127,214,232,${0.42 * glow})`); g.addColorStop(1, 'rgba(127,214,232,0)'); ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(218, 1420); ctx.lineTo(862, 1420); ctx.lineTo(1000, 1790); ctx.lineTo(80, 1790); ctx.fill();
  if (feet) { ctx.fillStyle = '#020405'; ctx.fillRect(400, 1406, 95, 16); ctx.fillRect(580, 1406, 95, 16); ctx.beginPath(); ctx.moveTo(400, 1420); ctx.lineTo(495, 1420); ctx.lineTo(450, 1720); ctx.lineTo(310, 1720); ctx.fill(); ctx.beginPath(); ctx.moveTo(580, 1420); ctx.lineTo(675, 1420); ctx.lineTo(770, 1720); ctx.lineTo(630, 1720); ctx.fill(); }
  vignette(ctx, 0.6);
}
function nearWindow(ctx, t, k) {
  ctx.fillStyle = '#050B0E'; ctx.fillRect(-40, -40, W + 80, H + 80); windowPane(ctx, 110, 260, 860, 1130, t, 0.95);
  ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = '#010203'; const x = 540, y = 800; ctx.beginPath(); ctx.ellipse(x, y + 90, 105, 125, 0, 0, TAU); ctx.fill();
  [-92, -48, 0, 48, 92].forEach((o, i) => { ctx.save(); ctx.translate(x + o, y + 20); ctx.rotate(o / 300); rrect(ctx, -19, -170 + Math.abs(o) * 0.5, 38, 190, 19); ctx.fill(); ctx.strokeStyle = 'rgba(127,214,232,0.75)'; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); }); ctx.beginPath(); ctx.ellipse(x, y + 90, 105, 125, 0, 0.1, Math.PI - 0.1); ctx.strokeStyle = 'rgba(127,214,232,0.75)'; ctx.lineWidth = 5; ctx.stroke(); ctx.restore(); vignette(ctx, 0.65);
}
const dim = (ctx, k) => { ctx.fillStyle = `rgba(0,0,0,${k})`; ctx.fillRect(0, 0, W, H); };
const handLine = (ctx, s, x, y, size, col = '#20170F') => { ctx.fillStyle = col; ctx.font = font(size, 800, D); ctx.textAlign = 'center'; ctx.fillText(s, x, y); ctx.textAlign = 'left'; };

const roomBg = (c, tt) => room(c, tt, { shadow: 0.7 });
const S = {
  s1_n1_4: (ctx, t, b) => { const l = t - b.start; shakeCam(ctx, t, 16 * Math.exp(-Math.max(0, l - 0.35) * 5) * (l > 0.35 ? 1 : 0)); nearWindow(ctx, t, l < 0.35 ? 0 : 1);
    dim(ctx, 0.12 + 0.5 * bump(t, b.start + 0.35, 0.1)); label(ctx, 'CHEGARADAGI HUJJAT · 1-QISM', W / 2, 200, { size: 36, border: BLUE });
    bigText(ctx, ['9-QAVAT.'], 400, t, b.start - 1, { size: 130, cols: [YEL] }); bigText(ctx, ['KIM TURIBDI?'], 1260, t, b.start - 1, { size: 104, cols: ['#FFF'] });
    label(ctx, 'OXIRIDA SEN TANLAYSAN', W / 2, 1640, { k: 1, size: 44, border: RED, bg: 'rgba(160,20,20,0.88)' }); },
  s1_n1_0: (ctx, t) => room(ctx, t),
  s1_n1_1: (ctx, t, b) => { desk(ctx, t); const k = t > b.start + b.dur * 0.45; if (k) folder(ctx, W / 2, 860, 1.75 * (1 + 0.02 * pf(t, b))); else { label(ctx, 'BO‘SH STOL', W / 2, 860, { size: 44, k: sp(t, b.start), border: BLUE }); } const fl = bump(t, b.start + b.dur * 0.45, 0.14); dim(ctx, fl * 0.9); },
  s1_n1_2: (ctx, t, b) => { desk(ctx, t); const k = E.outCubic(prog(t, b.start, b.start + b.dur * 0.75)); folder(ctx, W / 2, lerp(860, 1180, k), 1.5); polaroid(ctx, W / 2, lerp(1120, 680, k), lerp(0.6, 0.95, k), -0.05, t); },
  s1_n1_3: (ctx, t, b) => { desk(ctx, t, 0.7); const k = E.inOutCubic(pf(t, b)); polaroid(ctx, W / 2, lerp(800, 960, k), lerp(1.3, 1.75, k), -0.02, t, prog(t, b.start + b.dur * 0.45, b.start + b.dur)); },
  s1_n1_5: (ctx, t, b) => { desk(ctx, t); ctx.save(); ctx.translate(W / 2, 800); ctx.rotate(0.012); ctx.fillStyle = '#CFC6AD'; rrect(ctx, -410, -430, 820, 860, 8); ctx.fill(); ctx.restore();
    handLine(ctx, 'QOIDALAR', W / 2, 500, 74, '#5B1710');
    const r = (lines, y, f) => { const a = clamp((pf(t, b) - f) / 0.08); ctx.globalAlpha = a; lines.forEach((l, i) => handLine(ctx, l, W / 2, y + i * 70, 54)); ctx.globalAlpha = 1; };
    r(['1. O‘z ovozingni', 'eshitsang,', 'javob berma.'], 620, 0.2); r(['2. Soat 03:00 gacha', 'bu xonada ikki kishi', 'bo‘lishi shart.'], 930, 0.5); },
  s1_n1_6: (ctx, t) => door(ctx, t, { glow: 0.5 + 0.3 * Math.sin(t * 3) ** 2 }),
  p1_ovoz: (ctx, t, b) => { shakeCam(ctx, t, envAt(b, t) * 7); door(ctx, t, { glow: 0.45 + envAt(b, t) * 0.55 }); },
  s1_n1_7: (ctx, t, b) => { door(ctx, t, { glow: 0.35 }); ctx.fillStyle = 'rgba(70,0,0,0.5)'; ctx.fillRect(0, 0, W, H); bigText(ctx, ['BU — SENING', 'OVOZING'], 760, t, b.start, { size: 118, cols: ['#FFF', RED] }); },
  s1_n1_8: (ctx, t, b) => { shakeCam(ctx, t, 2); nearWindow(ctx, t, E.outCubic(prog(t, b.start + b.dur * 0.2, b.start + b.dur * 0.8))); },
  s1_n1_9: (ctx, t, b) => { desk(ctx, t); const fl = E.inOutCubic(prog(t, b.start, b.start + 0.7)), sx = Math.abs(1 - 2 * fl); ctx.save(); ctx.translate(W / 2, 800); ctx.scale(sx, 1); ctx.translate(-W / 2, -800); if (fl < 0.5) polaroid(ctx, W / 2, 800, 1.3, 0, t, 1); else { ctx.fillStyle = '#D7D1BF'; rrect(ctx, W / 2 - 390, 345, 780, 920, 10); ctx.fill(); } ctx.restore();
    if (fl >= 1) { const a = clamp((pf(t, b) - 0.4) / 0.15); ctx.globalAlpha = a; ['Bu safar', 'boshqasini', 'tanla.'].forEach((l, i) => handLine(ctx, l, W / 2, 720 + i * 110, 92, '#16110C')); ctx.globalAlpha = 1; } },
  s1_n1_10: (ctx, t, b) => { const o = 18; ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W / 2 - o / 2, H); ctx.clip(); ctx.translate(-270, 0); door(ctx, t, { glow: 0.8 }); ctx.restore(); ctx.save(); ctx.beginPath(); ctx.rect(W / 2 + o / 2, 0, W / 2, H); ctx.clip(); ctx.translate(270, 0); nearWindow(ctx, t, 0.9); ctx.restore(); ctx.fillStyle = RED; ctx.fillRect(W / 2 - o / 2, 0, o, H); label(ctx, 'ESHIK', 270, 1240, { k: sp(t, b.start + 0.2), size: 54, border: BLUE }); label(ctx, 'DERAZA', 810, 1240, { k: sp(t, b.start + 0.6), size: 54, border: RED }); },
  choice1: (ctx, t, b) => choiceCard(ctx, t, b, roomBg, 'KIMNI KIRITASAN?', ['A: ESHIKNI OCHAMAN', 'B: DERAZANI OCHAMAN']),
  cta1: (ctx, t, b) => ctaCard(ctx, t, b, '2-QISM TEZ KUNDA', 'A YOKI B?'),
};
function hudFn(ctx, t) {
  const m = keys(t, [[0, 165], [at('s1_n1_5'), 166], [at('s1_n1_10'), 168]]);
  const left = 180 - Math.floor(m);
  hud(ctx, t, { ...clock(m), day: 1, batt: 28, pills: [{ txt: `03:00 GACHA ${left} DAQ`, col: RED, pulse: 1 }] });
}
run({ scenes: S, fallback: (ctx, t) => room(ctx, t), hudFn, hot: HOT, noHud: ['s1_n1_4'] });
