// Chegaradagi Hujjat S1E2 "847". Pure function of time.
import { W, H, E, prog, lerp, clamp, bump, font, fill, rrect, hash01, noise1, TAU, D, UI, YEL, RED,
  B, at, sp, pf, keys, envAt, vignette, label, bigText, shakeCam, hud, clock, phone, titleCard, choiceCard, ctaCard, run } from './common/kit.js';

const HOT = /(sakkiz|ho‘l|orqangda|ichidan|uch|yo‘qolgan|raqamingdan|ochma|javob)/i;
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



const tag = (ctx, t, b, txt, col) => label(ctx, txt, W / 2, 330, { k: sp(t, b.start), size: 50, border: col });
function openDoor(ctx, t) {
  ctx.fillStyle = '#081318'; ctx.fillRect(-40, -40, W + 80, H + 80); ctx.fillStyle = '#9FE6F2'; ctx.globalAlpha = 0.16; ctx.fillRect(210, 420, 660, 1000); ctx.globalAlpha = 1;
  const g = ctx.createLinearGradient(0, 420, 0, 1420); g.addColorStop(0, '#0E2A32'); g.addColorStop(1, '#3E8C9C'); ctx.fillStyle = g; ctx.fillRect(210, 420, 660, 1000);
  ctx.strokeStyle = '#061014'; ctx.lineWidth = 5; [[210, 420], [870, 420], [210, 1420], [870, 1420]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(540, 860); ctx.stroke(); });
  ctx.fillStyle = '#04090C'; ctx.fillRect(490, 780, 100, 150); ctx.fillStyle = BLUE; ctx.globalAlpha = 0.5 + 0.4 * flick(t); ctx.fillRect(480, 590, 120, 12); ctx.globalAlpha = 1;
  ctx.fillStyle = '#16262B'; ctx.beginPath(); ctx.moveTo(210, 420); ctx.lineTo(70, 330); ctx.lineTo(70, 1540); ctx.lineTo(210, 1420); ctx.fill(); ctx.strokeStyle = '#050A0C'; ctx.lineWidth = 16; ctx.strokeRect(210, 420, 660, 1000); ctx.fillStyle = '#0F171A'; ctx.fillRect(-40, 1420, W + 80, 700); vignette(ctx, 0.62);
}
function prints(ctx, t, b) {
  ctx.fillStyle = '#10181B'; ctx.fillRect(-40, -40, W + 80, H + 80); ctx.fillStyle = '#080E10'; ctx.fillRect(-40, -40, W + 80, 420);
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 4; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(i * 180 - 540, H); ctx.lineTo(540, 380); ctx.stroke(); }
  const n = 8, shown = pf(t, b) * n * 1.15;
  for (let i = 0; i < n; i++) { const a = clamp(shown - i); if (a <= 0) continue; const f = i / (n - 1), s = lerp(0.35, 1.6, f * f), x = W / 2 + (i % 2 ? 1 : -1) * 90 * s, y = lerp(470, 1320, f * f); ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = a * 0.85; ctx.fillStyle = BLUE; ctx.beginPath(); ctx.ellipse(0, 0, 34, 60, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, -92, 30, 22, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  vignette(ctx, 0.62);
}
function sleepPhoto(ctx, t, b) {
  desk(ctx, t, 0.7); ctx.save(); ctx.translate(W / 2, 800); ctx.rotate(-0.025); ctx.scale(1.22 + 0.1 * pf(t, b), 1.22 + 0.1 * pf(t, b)); ctx.fillStyle = '#D7D1BF'; rrect(ctx, -300, -350, 600, 710, 10); ctx.fill(); ctx.fillStyle = '#081318'; ctx.fillRect(-260, -310, 520, 520);
  ctx.fillStyle = '#26363C'; rrect(ctx, -220, 10, 440, 160, 18); ctx.fill(); ctx.fillStyle = '#C7D2CF'; rrect(ctx, -205, 20, 120, 70, 24); ctx.fill(); ctx.fillStyle = '#0A0D12'; ctx.beginPath(); ctx.ellipse(-145, 42, 48, 38, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#16233F'; rrect(ctx, -95, 22, 300, 110, 50); ctx.fill();
  const g = ctx.createRadialGradient(0, 80, 20, 0, 80, 420); g.addColorStop(0, 'rgba(180,210,215,0.28)'); g.addColorStop(1, 'rgba(0,0,0,0.7)'); ctx.fillStyle = g; ctx.fillRect(-260, -310, 520, 520); ctx.restore();
}
function callScreen(c, t, name, sub, ring = 1) {
  const g = c.createLinearGradient(0, 0, 0, 1200); g.addColorStop(0, '#1A2E36'); g.addColorStop(1, '#05090B'); c.fillStyle = g; c.fillRect(0, 0, 600, 1200);
  c.fillStyle = '#16233F'; c.beginPath(); c.arc(300, 300, 96, 0, TAU); c.fill(); c.fillStyle = '#0A0D12'; c.beginPath(); c.arc(300, 270, 44, 0, TAU); c.fill(); c.beginPath(); c.ellipse(300, 375, 72, 52, 0, Math.PI, 0); c.fill();
  if (ring) for (let i = 0; i < 3; i++) { const p = (t * 0.9 + i / 3) % 1; c.strokeStyle = `rgba(127,214,232,${0.5 * (1 - p)})`; c.lineWidth = 4; c.beginPath(); c.arc(300, 300, 96 + p * 120, 0, TAU); c.stroke(); }
  c.textAlign = 'center'; c.fillStyle = '#FFF'; c.font = font(44, 900, D); c.fillText(name, 300, 500); c.fillStyle = '#9FB2B8'; c.font = font(28, 600, UI); c.fillText(sub, 300, 550); c.fillStyle = RED; c.beginPath(); c.arc(170, 1000, 60, 0, TAU); c.fill(); c.fillStyle = '#3DDC84'; c.beginPath(); c.arc(430, 1000 + Math.sin(t * 12) * 6, 60, 0, TAU); c.fill(); c.textAlign = 'left';
}
function lastPage(ctx, t) { desk(ctx, t, 0.8); ctx.save(); ctx.translate(W / 2, 800); ctx.rotate(0.012); ctx.fillStyle = '#CFC6AD'; rrect(ctx, -390, -450, 780, 900, 8); ctx.fill(); ctx.restore(); ctx.save(); ctx.translate(W / 2, 800); ctx.rotate(-0.1); ctx.strokeStyle = RED; ctx.lineWidth = 14; rrect(ctx, -280, -115, 560, 230, 18); ctx.stroke(); ctx.fillStyle = RED; ctx.font = font(136, 900, D); ctx.textAlign = 'center'; ctx.fillText('OCHMA', 0, 50); ctx.restore(); ctx.textAlign = 'left'; }
const ringPhone = (ctx, t, b, name, sub) => { desk(ctx, t, 0.5); dim(ctx, 0.35); const v = Math.sin(t * 70) * 6 * bump((t - b.start) % 1, 0.4, 0.4); phone(ctx, W / 2 + v, 830, 0.78, (c) => callScreen(c, t, name, sub)); };

const S = {
  s2_n_0: (ctx, t, b) => { fill(ctx, '#050809'); const g = ctx.createRadialGradient(W / 2, 800, 40, W / 2, 800, 760); g.addColorStop(0, 'rgba(150,20,20,0.5)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); const l = t - b.start, v = l < 0.7 ? 760 + Math.floor(E.outCubic(l / 0.7) * 87) : 847; shakeCam(ctx, t, l > 0.7 ? 14 * Math.exp(-(l - 0.7) * 6) : 0);
    label(ctx, 'CHEGARADAGI HUJJAT · 2-QISM', W / 2, 200, { size: 36, border: BLUE }); ctx.textAlign = 'center'; ctx.font = font(340, 900, D); ctx.lineWidth = 34; ctx.strokeStyle = 'rgba(0,0,0,0.9)'; ctx.strokeText(String(v), W / 2, 850); ctx.fillStyle = l < 0.7 ? '#FFF' : RED; ctx.fillText(String(v), W / 2, 850); ctx.font = font(72, 900, D); ctx.fillStyle = '#FFF'; ctx.fillText('MARTA YASHAGANSAN', W / 2, 1010); ctx.textAlign = 'left'; label(ctx, 'OXIRIDA YANA SEN TANLAYSAN', W / 2, 1640, { size: 42, border: RED, bg: 'rgba(160,20,20,0.88)' }); },
  s2_n_1: (ctx, t, b) => { openDoor(ctx, t); tag(ctx, t, b, 'A: ESHIKNI OCHGANLAR', RED); },
  s2_n_2: (ctx, t, b) => prints(ctx, t, b),
  s2_n_3: (ctx, t, b) => { ctx.fillStyle = '#050B0E'; ctx.fillRect(-40, -40, W + 80, H + 80); windowPane(ctx, 110, 420, 860, 980, t, 0); vignette(ctx, 0.62); tag(ctx, t, b, 'B: DERAZANI OCHGANLAR', '#3DDC84'); },
  s2_n_4: (ctx, t, b) => { sleepPhoto(ctx, t, b); label(ctx, 'XONA ICHIDAN OLINGAN', W / 2, 1320, { k: sp(t, b.start + b.dur * 0.7), size: 46, border: RED }); },
  s2_n_5: (ctx, t, b) => { fill(ctx, '#070506'); ctx.fillStyle = 'rgba(90,0,0,0.42)'; ctx.fillRect(0, 0, W, H); const l = pf(t, b); ctx.textAlign = 'center'; ctx.font = font(250, 900, D); ctx.fillStyle = l > 0.55 ? RED : '#FFF'; ctx.fillText(l > 0.55 ? '03:00' : '02:59', W / 2, 880); ctx.textAlign = 'left'; vignette(ctx, 0.6); },
  s2_n_6: (ctx, t, b) => { desk(ctx, t); ctx.fillStyle = '#CFC6AD'; rrect(ctx, 130, 350, 820, 880, 8); ctx.fill(); handLine(ctx, '0-FAYL', W / 2, 480, 76, '#5B1710'); const r = (a, c, y, f, col = '#20170F') => { ctx.globalAlpha = clamp((pf(t, b) - f) / 0.1); handLine(ctx, a, W / 2, y, 44, '#6A5D45'); handLine(ctx, c, W / 2, y + 72, 66, col); ctx.globalAlpha = 1; }; r('XONA', '914', 590, 0.1); r('URINISH', '847', 790, 0.35); r('OLDINGI NATIJA', 'YO‘QOLGAN', 990, 0.65, RED); },
  s2_n_7: (ctx, t, b) => ringPhone(ctx, t, b, 'Qo‘ng‘iroq', 'Kiruvchi...'),
  s2_n_8: (ctx, t, b) => ringPhone(ctx, t, b, 'SEN', 'O‘z raqaming'),
  s2_n_9: (ctx, t, b) => { lastPage(ctx, t); ctx.globalAlpha = 1 - clamp((pf(t, b) - 0.5) / 0.08); ctx.fillStyle = '#CFC6AD'; rrect(ctx, 150, 350, 780, 900, 8); ctx.fill(); handLine(ctx, '1-QOIDA', W / 2, 620, 70, '#5B1710'); ['O‘z ovozingni', 'eshitsang,', 'javob berma.'].forEach((s, i) => handLine(ctx, s, W / 2, 760 + i * 84, 60)); ctx.globalAlpha = 1; },
  s2_n_10: (ctx, t, b) => { const o = 18; ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W / 2 - o / 2, H); ctx.clip(); ctx.translate(-270, 0); ringPhone(ctx, t, b, 'SEN', 'O‘z raqaming'); ctx.restore(); ctx.save(); ctx.beginPath(); ctx.rect(W / 2 + o / 2, 0, W / 2, H); ctx.clip(); ctx.translate(810, 800); ctx.scale(0.62, 0.62); ctx.translate(-540, -800); ctx.fillStyle = '#20150D'; ctx.fillRect(-400, -600, 1900, 3200); lastPage(ctx, t); ctx.restore(); ctx.fillStyle = RED; ctx.fillRect(W / 2 - o / 2, 0, o, H); label(ctx, 'TELEFON', 270, 1280, { k: sp(t, b.start + 0.2), size: 50, border: BLUE }); label(ctx, 'SAHIFA', 810, 1280, { k: sp(t, b.start + 0.6), size: 50, border: RED }); },
  choice1: (ctx, t, b) => choiceCard(ctx, t, b, (c, tt) => desk(c, tt, 0.6), 'QAYSI BIRI?', ['A: JAVOB BERAMAN', 'B: SAHIFANI OCHAMAN']),
  cta1: (ctx, t, b) => ctaCard(ctx, t, b, '3-QISM ERTAGA', 'A YOKI B?'),
};
function hudFn(ctx, t) { const m = keys(t, [[0, 168], [at('s2_n_5', 0.55), 179.99], [at('s2_n_5', 0.56), 180], [at('s2_n_10'), 181]]); hud(ctx, t, { ...clock(m), day: 1, batt: 22, pills: [{ txt: 'URINISH 847', col: RED, pulse: 1 }] }); }
run({ scenes: S, fallback: (ctx, t) => desk(ctx, t), hudFn, hot: HOT, noHud: ['s2_n_0'] });
