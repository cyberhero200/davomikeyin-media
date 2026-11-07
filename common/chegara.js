// Chegaradagi Hujjat S1E2 "847". Pure function of time.
import { W, H, E, prog, lerp, clamp, bump, font, fill, rrect, hash01, noise1, TAU, D, UI, YEL, RED,
  B, at, sp, pf, keys, envAt, vignette, label, bigText, shakeCam, hud, clock, phone, titleCard, choiceCard, ctaCard, run } from './kit.js';
const NAMES = ['room', 'corridor', 'door', 'bed', 'lift', 'stairs', 'archive', 'lobby', 'desk', 'window', 'guard', 'crowd', 'mirror', 'folder', 'archivist', 'gate', 'screens']; const IM = {};
await Promise.all(NAMES.map((n) => new Promise((res) => { const i = new Image(); i.onload = () => { IM[n] = i; res(); }; i.src = `bg/${n}.jpg`; })));

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
function folder(ctx, x, y, s, name = '0-FAYL') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#050608'; rrect(ctx, -210, -130, 420, 270, 12); ctx.fill(); rrect(ctx, -210, -162, 150, 50, 10); ctx.fill();
  ctx.strokeStyle = '#2A3438'; ctx.lineWidth = 4; rrect(ctx, -210, -130, 420, 270, 12); ctx.stroke();
  ctx.fillStyle = 'rgba(200,210,210,0.75)'; ctx.font = font(44, 900, D); ctx.textAlign = 'center'; ctx.fillText(name, 0, 18); ctx.textAlign = 'left';
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
  plate(ctx, t, null, 'desk', { z0: 1.03, z1: 1.03 }); ctx.fillStyle = `rgba(0,0,0,${0.15 + 0.3 * (1 - k)})`; ctx.fillRect(0, 0, W, H);
}
function miniRoom(c, x, y, w, h, t, shadow) {
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.drawImage(IM.room, 0, 300, 1296, 1296, x, y, w, h); if (shadow > 0) { c.globalAlpha = shadow; c.fillStyle = '#020507'; c.beginPath(); c.ellipse(x + w * 0.42, y + h * 0.12, w * 0.05, h * 0.06, 0, 0, TAU); c.fill(); c.fillRect(x + w * 0.36, y + h * 0.17, w * 0.12, h * 0.26); c.globalAlpha = 1; } c.restore(); return;
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
  desk(ctx, t, 0.7); ctx.save(); ctx.translate(W / 2, 800); ctx.rotate(-0.025); ctx.scale(1.22 + 0.1 * pf(t, b), 1.22 + 0.1 * pf(t, b)); ctx.fillStyle = '#D7D1BF'; rrect(ctx, -300, -350, 600, 710, 10); ctx.fill(); ctx.drawImage(IM.bed, 0, 800, 1296, 1296, -260, -310, 520, 520);
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


function bed(ctx, t, eyes = 0) { ctx.fillStyle = '#060A0C'; ctx.fillRect(-40, -40, W + 80, H + 80); ctx.fillStyle = '#26363C'; rrect(ctx, 80, 560, 920, 300, 20); ctx.fill(); ctx.fillStyle = '#C7D2CF'; rrect(ctx, 110, 590, 240, 110, 30); ctx.fill(); ctx.fillStyle = '#16233F'; rrect(ctx, 370, 590, 600, 170, 40); ctx.fill(); ctx.fillStyle = '#020405'; ctx.fillRect(80, 860, 920, 420); ctx.fillStyle = '#1C2A2E'; ctx.fillRect(80, 860, 30, 420); ctx.fillRect(970, 860, 30, 420); ctx.fillStyle = '#0F171A'; ctx.fillRect(-40, 1280, W + 80, 800);
  if (eyes > 0) { ctx.globalAlpha = eyes; ctx.fillStyle = '#EAF6F8'; const bl = Math.sin(t * 1.3) > 0.97 ? 0.1 : 1; [470, 610].forEach((x) => { ctx.beginPath(); ctx.ellipse(x, 1080, 34, 20 * bl, 0, 0, TAU); ctx.fill(); }); ctx.fillStyle = '#000'; [470, 610].forEach((x) => { ctx.beginPath(); ctx.arc(x, 1080, 11 * bl, 0, TAU); ctx.fill(); }); ctx.globalAlpha = 1; } vignette(ctx, 0.6); }
function plan(ctx, t, b, d) { fill(ctx, '#0B2233'); ctx.strokeStyle = 'rgba(160,210,235,0.14)'; ctx.lineWidth = 2; for (let i = 0; i < 28; i++) { ctx.beginPath(); ctx.moveTo(i * 44, 0); ctx.lineTo(i * 44, H); ctx.moveTo(0, i * 74); ctx.lineTo(W, i * 74); ctx.stroke(); } ctx.strokeStyle = '#BFE3F2'; ctx.lineWidth = 12; ctx.strokeRect(190, 380, 700, 880); ctx.lineWidth = 8; ctx.strokeRect(240, 900, 300, 300); ctx.strokeRect(620, 430, 220, 150); ctx.beginPath(); ctx.moveTo(190, 700); ctx.lineTo(310, 700); ctx.stroke(); handLine(ctx, d.title || 'XONA 914', W / 2, 330, 58, '#BFE3F2'); const k = 1 + 0.25 * Math.sin(t * 6); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(d.x || 390, d.y || 1050, 34 * k * sp(t, b.start + b.dur * 0.3), 0, TAU); ctx.fill(); }
function lift(ctx, t, b, d) { fill(ctx, '#11181B'); ctx.fillStyle = '#5A6468'; rrect(ctx, 250, 300, 580, 1080, 18); ctx.fill(); ctx.strokeStyle = '#1B2326'; ctx.lineWidth = 12; ctx.stroke(); const fl = d.floors || ['8', '7', '6', '5', '4', '3', '2', '1']; fl.forEach((f, i) => { const col = fl.length === 1 ? 0.5 : i % 2, y = fl.length === 1 ? 840 : 420 + Math.floor(i / 2) * 190, x = 420 + col * 240; ctx.fillStyle = '#20282B'; ctx.beginPath(); ctx.arc(x, y, 72, 0, TAU); ctx.fill(); ctx.strokeStyle = '#99A6AA'; ctx.lineWidth = 5; ctx.stroke(); handLine(ctx, f, x, y + 24, 70, '#F2F5F6'); }); vignette(ctx, 0.55); }
function corridor(ctx, t, d) { fill(ctx, '#071014'); const n = d.num || '914'; [0, 1, 2].forEach((i) => { const k = 1 - i * 0.28, w = 170 * k, h = 500 * k, y = 860 - h / 2, off = 420 * k + 10; [-1, 1].forEach((s) => { const x = W / 2 + s * off - w / 2; ctx.fillStyle = `rgba(35,58,65,${k})`; ctx.fillRect(x, y, w, h); ctx.strokeStyle = '#020506'; ctx.lineWidth = 7; ctx.strokeRect(x, y, w, h); ctx.fillStyle = YEL; ctx.font = font(54 * k, 900, D); ctx.textAlign = 'center'; ctx.fillText(n, x + w / 2, y + 90 * k); ctx.textAlign = 'left'; }); }); ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 6; ctx.fillStyle = BLUE; ctx.globalAlpha = 0.5 * flick(t); ctx.fillRect(W / 2 - 110, 420, 220, 12); ctx.globalAlpha = 1; ctx.fillStyle = '#0B1417'; ctx.fillRect(0, 1190, W, 800); vignette(ctx, 0.7); }
function mirror(ctx, t, d) { fill(ctx, '#080D10'); ctx.fillStyle = '#20343A'; rrect(ctx, 220, 300, 640, 1050, 320); ctx.fill(); ctx.strokeStyle = '#5A4A2E'; ctx.lineWidth = 22; ctx.stroke(); ctx.save(); rrect(ctx, 232, 312, 616, 1026, 310); ctx.clip(); const g = ctx.createLinearGradient(220, 300, 860, 1350); g.addColorStop(0, 'rgba(160,210,220,0.25)'); g.addColorStop(1, 'rgba(0,0,0,0.25)'); ctx.fillStyle = g; ctx.fillRect(220, 300, 640, 1050); student(ctx, W / 2 + (d.off || 0), 880, 1.5); if (d.eyes) { ctx.fillStyle = '#EAF6F8'; [W / 2 - 38, W / 2 + 38].forEach((x) => { ctx.beginPath(); ctx.arc(x + (d.off || 0), 850, 11, 0, TAU); ctx.fill(); }); } ctx.restore(); vignette(ctx, 0.55); }
function stairs(ctx, t) { fill(ctx, '#060C0E'); for (let i = 0; i < 9; i++) { const k = i / 8, w = lerp(860, 170, k), y = lerp(1320, 420, k), h = lerp(120, 20, k); ctx.fillStyle = `rgba(${40 - i * 3},${62 - i * 5},${70 - i * 6},1)`; ctx.fillRect(W / 2 - w / 2, y, w, h); ctx.fillStyle = '#020506'; ctx.fillRect(W / 2 - w / 2, y + h, w, h * 0.45); } ctx.fillStyle = BLUE; ctx.globalAlpha = 0.5 * flick(t); ctx.fillRect(W / 2 - 80, 340, 160, 10); ctx.globalAlpha = 1; vignette(ctx, 0.72); }
function shelves(ctx, t, b, d) { fill(ctx, '#0A0806'); const cols = 7; for (let r = 0; r < 7; r++) { ctx.fillStyle = '#2B1C12'; ctx.fillRect(40, 340 + r * 150 + 120, W - 80, 16); for (let c = 0; c < cols; c++) { const x = 60 + c * 139; ctx.fillStyle = hash01(r, c) > 0.5 ? '#050608' : '#101416'; ctx.fillRect(x, 340 + r * 150, 122, 120); ctx.fillStyle = '#B9B19A'; ctx.fillRect(x + 22, 365 + r * 150, 78, 30); ctx.fillStyle = '#20170F'; ctx.font = font(22, 800, D); ctx.textAlign = 'center'; ctx.fillText(String(d.base ? d.base - r * 7 - c : 846 - r * 7 - c), x + 61, 388 + r * 150); ctx.textAlign = 'left'; } } vignette(ctx, 0.62); }
function monitor(ctx, t, b, d) { fill(ctx, '#05080A'); ctx.fillStyle = '#10181B'; rrect(ctx, 70, 410, 940, 780, 26); ctx.fill(); ctx.fillStyle = '#04120D'; rrect(ctx, 105, 445, 870, 710, 12); ctx.fill(); (d.lines || []).forEach((l, i) => { ctx.globalAlpha = clamp((pf(t, b) - i * 0.18) / 0.08); ctx.fillStyle = l.startsWith('!') ? RED : '#6EF2A8'; let f = 50; const s = l.replace(/^!/, ''); ctx.font = font(f, 800, D); while (ctx.measureText(s).width > 800) { f -= 2; ctx.font = font(f, 800, D); } ctx.fillText(s, 135, 540 + i * 100); ctx.globalAlpha = 1; }); for (let y = 450; y < 1150; y += 8) { ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(105, y, 870, 3); } vignette(ctx, 0.5); }
function crowd(ctx, t) { fill(ctx, '#060A0C'); ctx.fillStyle = '#123038'; ctx.fillRect(0, 300, W, 620); for (let r = 0; r < 4; r++) for (let c = 0; c < 8 - r; c++) { student(ctx, 90 + c * 150 + r * 75 + noise1(c, r) * 12, 660 + r * 170, 0.5 + r * 0.22); } vignette(ctx, 0.7); }
const paper = (ctx, t, b, d) => { desk(ctx, t); ctx.fillStyle = '#CFC6AD'; rrect(ctx, 130, 350, 820, 880, 8); ctx.fill(); handLine(ctx, d.title || '0-FAYL', W / 2, 480, 72, '#5B1710'); const rs = d.rows || [], step = Math.min(200, 660 / Math.max(1, rs.length)); rs.forEach(([a, c, red], i) => { ctx.globalAlpha = clamp((pf(t, b) - (i / rs.length) * 0.7) / 0.1); const y = 590 + i * step; if (a) handLine(ctx, a, W / 2, y, 42, '#6A5D45'); let f = 62; ctx.font = font(f, 800, D); while (ctx.measureText(c).width > 720) { f -= 2; ctx.font = font(f, 800, D); } handLine(ctx, c, W / 2, y + (a ? 70 : 0), f, red ? RED : '#20170F'); ctx.globalAlpha = 1; }); };
const hookS = (ctx, t, b, d) => { fill(ctx, '#050809'); if (d.bg && d.bg !== 'hook') SETS[d.bg](ctx, t, b, d); dim(ctx, d.bg ? 0.22 : 0); if (!d.bg) { const g = ctx.createRadialGradient(W / 2, 800, 40, W / 2, 800, 760); g.addColorStop(0, 'rgba(150,20,20,0.5)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); } const l = t - b.start; shakeCam(ctx, t, l > 0.3 ? 14 * Math.exp(-(l - 0.3) * 6) : 0); label(ctx, `CHEGARADAGI HUJJAT · ${d.ep}-QISM`, W / 2, 200, { size: 36, border: BLUE }); bigText(ctx, d.big, d.y || 720, t, b.start - 1, { size: d.size || 130, cols: d.cols || [RED, '#FFF', YEL] }); label(ctx, d.pill || 'OXIRIDA YANA SEN TANLAYSAN', W / 2, 1640, { size: 42, border: RED, bg: 'rgba(160,20,20,0.88)' }); };
export const SETS = {
  hook: hookS, room: (c, t, b, d) => room(c, t, { shadow: d.shadow || 0, chair: d.chair === 0 ? 0 : 1 }), door: (c, t, b, d) => door(c, t, { glow: 0.5 + 0.3 * Math.sin(t * 3) ** 2, feet: d.feet === 0 ? 0 : 1 }), opendoor: (c, t) => openDoor(c, t), prints,
  window: (c, t, b, d) => { c.fillStyle = '#050B0E'; c.fillRect(-40, -40, W + 80, H + 80); windowPane(c, 110, 420, 860, 980, t, d.shadow || 0); vignette(c, 0.62); }, palm: (c, t, b) => nearWindow(c, t, prog(t, b.start, b.start + b.dur * 0.5)),
  photo: (c, t, b, d) => { desk(c, t, 0.7); const k = E.inOutCubic(pf(t, b)); polaroid(c, W / 2, lerp(800, 900, k), lerp(1.2, 1.38, k), -0.02, t, d.shadow || 0); }, sleep: sleepPhoto, paper,
  phone: (c, t, b, d) => ringPhone(c, t, b, d.name || 'SEN', d.sub || 'O‘z raqaming'), stamp: (c, t, b, d) => { desk(c, t, 0.8); c.fillStyle = '#CFC6AD'; rrect(c, 150, 350, 780, 900, 8); c.fill(); c.save(); c.translate(W / 2, 800); c.rotate(-0.1); c.strokeStyle = RED; c.lineWidth = 14; c.font = font(d.size || 120, 900, D); const w = c.measureText(d.word).width + 80; rrect(c, -w / 2, -115, w, 230, 18); c.stroke(); c.fillStyle = RED; c.textAlign = 'center'; c.fillText(d.word, 0, 45); c.restore(); c.textAlign = 'left'; },
  big: (c, t, b, d) => { fill(c, d.red ? '#1A0506' : '#060A0C'); vignette(c, 0.6); bigText(c, d.lines, d.y || 780, t, b.start, { size: d.size || 120, cols: d.cols || ['#FFF', YEL, RED] }); },
  clock: (c, t, b, d) => { fill(c, '#070506'); c.fillStyle = 'rgba(90,0,0,0.42)'; c.fillRect(0, 0, W, H); const l = pf(t, b); c.textAlign = 'center'; c.font = font(250, 900, D); c.fillStyle = l > 0.55 ? RED : '#FFF'; c.fillText(l > 0.55 ? d.b : d.a, W / 2, 880); c.textAlign = 'left'; vignette(c, 0.6); },
  folder: (c, t, b, d) => { desk(c, t); folder(c, W / 2, 860, 1.75, d.name); }, plan, bed: (c, t, b, d) => bed(c, t, d.eyes ? prog(t, b.start, b.start + 1) : 0), lift, corridor: (c, t, b, d) => corridor(c, t, d), mirror: (c, t, b, d) => mirror(c, t, d), stairs: (c, t) => stairs(c, t), shelves, monitor, crowd: (c, t) => crowd(c, t),
  split: (c, t, b, d) => { const o = 18; [[d.l, 270, 0, W / 2 - o / 2], [d.r, 810, W / 2 + o / 2, W / 2]].forEach(([s, cx, x0, w]) => { c.save(); c.beginPath(); c.rect(x0, 0, w, H); c.clip(); c.fillStyle = '#060A0C'; c.fillRect(x0, 0, w, H); c.translate(cx, 800); c.scale(0.5, 0.5); c.translate(-540, -800); SETS[s.t](c, t, b, s); c.restore(); }); c.fillStyle = RED; c.fillRect(W / 2 - o / 2, 0, o, H); label(c, d.ll, 270, 1280, { k: sp(t, b.start + 0.2), size: 46, border: BLUE }); label(c, d.rl, 810, 1280, { k: sp(t, b.start + 0.6), size: 46, border: RED }); },
};

// ---------------------------------------------------------------- v2: painted plates, motion, ads
const AD = { room: [[832, 472], [988, 388], [832, 760]], corridor: [[252, 400], [472, 400], [252, 528]], door: [[860, 560], [968, 556], [868, 748]], lift: [[848, 600], [984, 400], [848, 920]], stairs: [[240, 352], [392, 352], [244, 652]], lobby: [[48, 72], [432, 110], [48, 400]] };
function plate(c, t, b, name, { z0 = 1.04, z1 = 1.13, fx = 540, fy = 960, ad = 1, over } = {}) {
  const p = b ? E.inOutCubic(pf(t, b)) : 0, z = lerp(z0, z1, p), hx = noise1(t * 0.35, 1) * 9, hy = noise1(t * 0.3, 2) * 9;
  c.save(); c.translate(W / 2 + hx, H / 2 + hy); c.scale(z, z); c.translate(-fx, -fy); c.drawImage(IM[name], 0, 0, W, H);
  if (over) over(c); if (ad && AD[name]) adSlot(c, t, AD[name]); c.restore();
}
function adSlot(c, t, [p0, p1, p3]) {
  const w = 400, h = 300; c.save(); c.transform((p1[0] - p0[0]) / w, (p1[1] - p0[1]) / w, (p3[0] - p0[0]) / h, (p3[1] - p0[1]) / h, p0[0], p0[1]);
  c.fillStyle = '#C9C2A8'; c.fillRect(0, 0, w, h); c.fillStyle = '#16110C'; c.textAlign = 'center'; c.font = font(44, 900, D); c.fillText('REKLAMANGIZ', w / 2, 100); c.font = font(40, 800, D); c.fillText('SHU YERDA', w / 2, 158); c.font = font(30, 800, D); c.fillText('BO‘LISHI MUMKIN', w / 2, 214); c.fillStyle = '#7A1810'; c.font = font(24, 800, D); c.fillText('@davomikeyin', w / 2, 262); c.textAlign = 'left';
  c.fillStyle = `rgba(6,14,16,${0.4 + 0.1 * (1 - flick(t))})`; c.fillRect(0, 0, w, h); c.restore();
}
function glow(c, x, y, r, col, a) { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); c.restore(); }
const grainTile = (() => { const g = document.createElement('canvas'); g.width = g.height = 256; const x = g.getContext('2d'), d = x.createImageData(256, 256); for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 13; } x.putImageData(d, 0, 0); return g; })();
function atmos(c, t, b, fog = 1) {
  for (let i = 0; i < 3 * fog; i++) { const x = ((t * (14 + i * 9) + i * 400) % 1600) - 300, y = 500 + i * 380 + Math.sin(t * 0.4 + i) * 50, g = c.createRadialGradient(x, y, 0, x, y, 560); g.addColorStop(0, 'rgba(150,200,205,0.055)'); g.addColorStop(1, 'rgba(150,200,205,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }
  for (let i = 0; i < 46; i++) { const sp2 = 8 + hash01(i, 8) * 20, x = (hash01(i, 1) * W + noise1(t * 0.2, i) * 90 + t * sp2) % W, y = (hash01(i, 2) * H - t * sp2 * 0.7 + H * 40) % H, a = 0.12 + 0.3 * hash01(i, 3) * (0.5 + 0.5 * Math.sin(t * 1.4 + i)); c.fillStyle = `rgba(230,225,200,${a})`; c.beginPath(); c.arc(x, y, 1 + hash01(i, 4) * 2.4, 0, TAU); c.fill(); }
  const fr = Math.floor(t * 24); c.save(); c.translate(-(hash01(fr, 5) * 256), -(hash01(fr, 6) * 256)); c.fillStyle = c.createPattern(grainTile, 'repeat'); c.fillRect(0, 0, W + 256, H + 256); c.restore();
  vignette(c, 0.55); const l = t - b.start; if (l < 0.16) { c.fillStyle = `rgba(0,0,0,${1 - l / 0.16})`; c.fillRect(0, 0, W, H); }
}
function eyes(c, t, x, y, s, a) { if (a <= 0) return; const bl = Math.sin(t * 1.3) > 0.975 ? 0.08 : 1; c.save(); c.globalAlpha = a; [-1, 1].forEach((d) => { glow(c, x + d * 52 * s, y, 40 * s, '200,235,240', 0.25); c.fillStyle = '#DDEBEC'; c.beginPath(); c.ellipse(x + d * 52 * s, y, 26 * s, 14 * s * bl, d * -0.12, 0, TAU); c.fill(); c.fillStyle = '#050505'; c.beginPath(); c.arc(x + d * 52 * s + noise1(t * 0.5, 3) * 8 * s, y, 8 * s * bl, 0, TAU); c.fill(); }); c.restore(); }
const seated = (c, t, x, y, s) => { c.save(); c.translate(x, y); const br = 1 + 0.012 * Math.sin(t * 1.5); c.scale(s, s * br); c.fillStyle = '#05080B'; c.beginPath(); c.moveTo(-150, 280); c.quadraticCurveTo(-150, 40, 0, 26); c.quadraticCurveTo(150, 40, 150, 280); c.closePath(); c.fill(); c.beginPath(); c.ellipse(noise1(t * 0.3, 7) * 8, -30, 76, 90, 0, 0, TAU); c.fill(); c.strokeStyle = 'rgba(255,180,100,0.5)'; c.lineWidth = 4; c.beginPath(); c.arc(0, -30, 80, -0.5, 0.7); c.stroke(); c.restore(); };
const person = (c, x, y, s, a = 1) => { c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(s, s); c.fillStyle = '#02050 6'.replace(' ', ''); c.beginPath(); c.ellipse(0, -270, 50, 62, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(-105, 290); c.lineTo(-92, -170); c.quadraticCurveTo(0, -222, 92, -170); c.lineTo(105, 290); c.fill(); c.restore(); };
const V2 = {
  room: (c, t, b, d) => plate(c, t, b, 'room', { over: (o) => { glow(o, 860, 930, 340, '255,170,90', 0.26 * flick(t)); if (d.shadow) { person(o, 556, 830, 0.95, d.shadow); } if (d.chair !== 0) seated(o, t, 700, 1050, 0.62); } }),
  lobby: (c, t, b, d) => plate(c, t, b, 'lobby', { over: (o) => { glow(o, 460, 1100, 320, '255,190,110', 0.22 * flick(t)); if (d.guard !== 0) seated(o, t, 200, 1010, 0.6); } }),
  window: (c, t, b, d) => plate(c, t, b, 'room', { z0: 1.7, z1: 1.95, fx: 556, fy: 660, ad: 0, over: (o) => { if (d.shadow) person(o, 556, 830, 0.95, d.shadow); } }),
  palm: (c, t, b) => { const l = t - b.start, z = 1.05 + 0.1 * pf(t, b) + 0.05 * Math.exp(-Math.max(0, l - 0.3) * 6); plate(c, t, b, 'window', { z0: z, z1: z, ad: 0 }); glow(c, 540, 860, 620, '90,200,210', 0.1 + 0.08 * Math.sin(t * 7)); },
  door: (c, t, b, d) => plate(c, t, b, 'door', { over: (o) => { glow(o, 500, 1490, 330, '110,210,235', 0.22 + 0.2 * Math.sin(t * 3) ** 2); glow(o, 742, 1000, 300, '110,210,235', 0.1); if (d.feet !== 0) { const dx = noise1(t * 0.5, 9) * 34; o.fillStyle = '#020405'; [340, 540].forEach((x) => { o.fillRect(x + dx, 1472, 90, 22); o.beginPath(); o.moveTo(x + dx, 1494); o.lineTo(x + dx + 90, 1494); o.lineTo(x + dx + 150, 1800); o.lineTo(x + dx - 70, 1800); o.fill(); }); } } }),
  opendoor: (c, t, b) => plate(c, t, b, 'corridor', { z0: 1.02, z1: 1.42, fy: 900, over: (o) => { glow(o, 505, 390, 300, '255,225,160', 0.32 * flick(t)); } }),
  corridor: (c, t, b, d) => plate(c, t, b, 'corridor', { z0: 1.04, z1: 1.2, fy: 900, over: (o) => { glow(o, 505, 390, 300, '255,225,160', 0.3 * flick(t)); const n = d.num || '914'; [[250, 700, 1.1], [395, 860, 0.55], [860, 760, 1.1], [738, 880, 0.55]].forEach(([x, y, s]) => { o.fillStyle = '#B7A36F'; o.fillRect(x - 58 * s, y - 28 * s, 116 * s, 56 * s); o.fillStyle = '#16110C'; o.textAlign = 'center'; o.font = font(42 * s, 900, D); o.fillText(n, x, y + 15 * s); o.textAlign = 'left'; }); } }),
  prints: (c, t, b) => plate(c, t, b, 'corridor', { z0: 1.05, z1: 1.05, fy: 960, over: (o) => { const n = 9, sh = pf(t, b) * n * 1.15; for (let i = 0; i < n; i++) { const a = clamp(sh - i); if (a <= 0) continue; const q = i / (n - 1), s = lerp(0.22, 1.25, q * q), x = 505 + (i % 2 ? 1 : -1) * 72 * s, y = lerp(1120, 1780, q * q); o.save(); o.translate(x, y); o.scale(s, s); o.globalAlpha = a * 0.7; o.fillStyle = '#9FE0EC'; o.beginPath(); o.ellipse(0, 0, 34, 62, 0, 0, TAU); o.fill(); o.beginPath(); o.ellipse(0, -94, 30, 22, 0, 0, TAU); o.fill(); o.restore(); } } }),
  bed: (c, t, b, d) => plate(c, t, b, 'bed', { z0: 1.04, z1: 1.22, fx: 660, fy: 1040, over: (o) => { eyes(o, t, 700, 1020, 1.1, d.eyes ? prog(t, b.start + 0.2, b.start + 1.3) : 0); } }),
  lift: (c, t, b, d) => plate(c, t, b, 'lift', { z0: 1.04, z1: 1.18, fx: 546, fy: 900, over: (o) => { glow(o, 546, 170, 420, '190,235,160', 0.2 * flick(t)); const fl = d.floors || ['8', '7', '6', '5', '4', '3', '2', '1']; fl.forEach((f2, i) => { const one = fl.length === 1, x = one ? 546 : 490 + (i % 2) * 112, y = one ? 900 : 700 + Math.floor(i / 2) * 104; const lit = one || f2 === '-1'; o.fillStyle = '#14181A'; o.beginPath(); o.arc(x, y, 44, 0, TAU); o.fill(); o.strokeStyle = lit ? RED : '#9AA6A8'; o.lineWidth = 5; o.stroke(); if (lit) glow(o, x, y, 90, '255,70,60', 0.35 + 0.15 * Math.sin(t * 5)); o.fillStyle = lit ? '#FFB8B0' : '#E9EEEE'; o.textAlign = 'center'; o.font = font(44, 900, D); o.fillText(f2, x, y + 16); o.textAlign = 'left'; }); } }),
  stairs: (c, t, b) => plate(c, t, b, 'stairs', { z0: 1.04, z1: 1.3, fy: 1120, over: (o) => { glow(o, 345, 790, 240, '255,190,110', 0.34 * flick(t)); } }),
  shelves: (c, t, b) => plate(c, t, b, 'archive', { z0: 1.02, z1: 1.3, fy: 1000, over: (o) => { [[232, 345], [290, 500]].forEach(([y, r], i) => glow(o, 490 + i * 10, y * 1.2, r, '255,180,90', 0.26 * flick(t + i))); } }),
  crowd: (c, t, b) => { plate(c, t, b, 'corridor', { z0: 1.1, z1: 1.16, ad: 0 }); c.fillStyle = 'rgba(0,0,0,0.3)'; c.fillRect(0, 0, W, H); [[0.38, 5, 860], [0.56, 4, 980], [0.8, 4, 1120], [1.15, 3, 1320]].forEach(([s, n, y], r) => { for (let i = 0; i < n; i++) { const x = W / 2 + (i - (n - 1) / 2) * (720 / n) * (0.7 + r * 0.25) + noise1(t * 0.25, r * 10 + i) * 16; person(c, x, y, s); eyes(c, t + i, x, y - 270 * s, s * 0.34, r < 3 ? 0.9 : 1); } }); },
  big: (c, t, b, d) => { plate(c, t, b, d.plate || 'corridor', { z0: 1.12, z1: 1.2, ad: 0 }); c.fillStyle = d.red ? 'rgba(45,0,0,0.72)' : 'rgba(0,0,0,0.68)'; c.fillRect(0, 0, W, H); bigText(c, d.lines, d.y || 780, t, b.start, { size: d.size || 120, cols: d.cols || ['#FFF', YEL, RED] }); },
  clock: (c, t, b, d) => { plate(c, t, b, 'door', { z0: 1.1, z1: 1.14, ad: 0 }); c.fillStyle = 'rgba(70,0,0,0.62)'; c.fillRect(0, 0, W, H); const l = pf(t, b); c.textAlign = 'center'; c.font = font(250, 900, D); c.lineWidth = 26; c.strokeStyle = 'rgba(0,0,0,0.85)'; const s = l > 0.55 ? d.b : d.a; c.strokeText(s, W / 2, 880); c.fillStyle = l > 0.55 ? RED : '#FFF'; c.fillText(s, W / 2, 880); c.textAlign = 'left'; },
  mirror: (c, t, b, d) => { plate(c, t, b, 'room', { z0: 1.5, z1: 1.55, ad: 0, fx: 400, fy: 1100 }); c.fillStyle = 'rgba(0,0,0,0.55)'; c.fillRect(0, 0, W, H); c.fillStyle = '#16282D'; rrect(c, 230, 300, 620, 1040, 310); c.fill(); c.strokeStyle = '#6A5433'; c.lineWidth = 22; c.stroke(); c.save(); rrect(c, 242, 312, 596, 1016, 300); c.clip(); seated(c, t, W / 2 + noise1(t * 0.4, 5) * 12, 840, 1.55); eyes(c, t, W / 2, 790, 0.72, d.eyes ? 1 : 0); c.restore(); glow(c, 400, 480, 380, '180,225,235', 0.14); },
  split: (c, t, b, d) => { const o = 18; [[d.l, 270, 0, W / 2 - o / 2], [d.r, 810, W / 2 + o / 2, W / 2]].forEach(([s, cx, x0, w]) => { c.save(); c.beginPath(); c.rect(x0, 0, w, H); c.clip(); c.translate(cx, 960); c.scale(0.62, 0.62); c.translate(-540, -960); c.fillStyle = '#05080A'; c.fillRect(-400, -400, W + 800, H + 800); SETS[s.t](c, t, b, s); c.restore(); }); c.fillStyle = RED; c.fillRect(W / 2 - o / 2, 0, o, H); label(c, d.ll, 270, 1300, { k: sp(t, b.start + 0.2), size: 46, border: BLUE }); label(c, d.rl, 810, 1300, { k: sp(t, b.start + 0.6), size: 46, border: RED }); },
};

Object.assign(V2, {
  crowd: (c, t, b) => { plate(c, t, b, 'crowd', { z0: 1.03, z1: 1.2, fy: 900, ad: 0, over: (o) => { glow(o, 575, 300, 360, '180,235,235', 0.28 * flick(t)); } }); c.fillStyle = `rgba(0,0,0,${0.16 * (1 - flick(t))})`; c.fillRect(0, 0, W, H); },
  mirror: (c, t, b) => plate(c, t, b, 'mirror', { z0: 1.03, z1: 1.26, fx: 690, fy: 820, ad: 0, over: (o) => { glow(o, 690, 900, 520, '110,220,225', 0.16 + 0.06 * Math.sin(t * 3)); glow(o, 220, 830, 240, '255,170,90', 0.22 * flick(t)); } }),
  folder: (c, t, b, d) => plate(c, t, b, 'folder', { z0: 1.03, z1: 1.2, fy: 880, ad: 0, over: (o) => { glow(o, 80, 150, 500, '255,190,110', 0.2 * flick(t)); o.save(); o.translate(578, 790); o.rotate(0.012); o.fillStyle = '#20170F'; o.textAlign = 'center'; o.font = font(d.name && d.name.length > 4 ? 72 : 110, 900, D); o.fillText(d.name || '0-FAYL', 0, 38); o.restore(); o.textAlign = 'left'; } }),
  guard: (c, t, b, d) => plate(c, t, b, 'guard', { z0: d.badge ? 1.5 : 1.03, z1: d.badge ? 1.9 : 1.2, fx: d.badge ? 500 : 520, fy: d.badge ? 1120 : 800, ad: 0, over: (o) => { glow(o, 800, 1020, 340, '110,230,150', 0.2 * flick(t)); if (d.badge) { o.save(); o.translate(665, 1015); o.fillStyle = '#B7BDB5'; o.fillRect(-46, -24, 92, 48); o.fillStyle = '#16110C'; o.textAlign = 'center'; o.font = font(36, 900, D); o.fillText('001', 0, 13); o.restore(); o.textAlign = 'left'; } } }),
  lobby: (c, t, b, d) => plate(c, t, b, 'lobby', { over: (o) => { glow(o, 460, 1100, 320, '255,190,110', 0.22 * flick(t)); if (d.guard) seated(o, t, 170, 1020, 0.6); } }),
  plan: (c, t, b, d) => { desk(c, t, 0.7); c.save(); c.translate(W / 2, 800); c.rotate(0.015); c.translate(-W / 2, -800); c.beginPath(); c.rect(120, 250, 840, 1120); c.clip(); plan(c, t, b, d); c.restore(); },
  paper: (c, t, b, d) => { paper(c, t, b, d); [[220, 420, 70], [840, 1120, 110], [780, 480, 44]].forEach(([x, y, r]) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(80,50,20,0.16)'); g.addColorStop(1, 'rgba(80,50,20,0)'); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }); },
});

Object.assign(V2, {
  archivist: (c, t, b, d) => plate(c, t, b, 'archivist', { z0: 1.03, z1: d.close ? 1.6 : 1.2, fx: 520, fy: d.close ? 700 : 960, ad: 0, over: (o) => { const f = 0.75 + 0.25 * Math.sin(t * 9) * Math.sin(t * 3.3); glow(o, 270, 1180, 380, '255,170,80', 0.42 * f); glow(o, 470, 640, 60, '200,235,240', d.eyes ? 0.5 : 0.12); } }),
  gate: (c, t, b, d) => plate(c, t, b, 'gate', { z0: 1.03, z1: 1.25, fy: 900, ad: 0, over: (o) => { const p = 0.35 + 0.25 * Math.sin(t * 2.2); glow(o, 540, 1000, 560, '220,240,255', p * 0.4); o.fillStyle = '#9EA3A0'; o.fillRect(410, 300, 260, 70); o.fillStyle = '#16110C'; o.textAlign = 'center'; o.font = font(46, 900, D); o.fillText('CHEGARA', 540, 352); o.textAlign = 'left'; } }),
  screens: (c, t, b, d) => plate(c, t, b, 'screens', { z0: 1.03, z1: 1.2, fy: 820, ad: 0, over: (o) => { for (let i = 0; i < 40; i++) { const x = 130 + (i % 8) * 108, y = 230 + Math.floor(i / 8) * 102; o.fillStyle = `rgba(160,220,240,${0.06 + 0.14 * hash01(i, Math.floor(t * 8))})`; o.fillRect(x, y, 92, 70); } if (d.ab) ['A', 'B', 'A', 'A', 'B', 'A', 'B', 'B'].forEach((s, i) => { const x = 190 + (i % 4) * 230, y = 330 + Math.floor(i / 4) * 210; o.globalAlpha = clamp((pf(t, b) - i * 0.07) / 0.1); o.fillStyle = s === 'A' ? RED : '#3DDC84'; o.font = font(90, 900, D); o.textAlign = 'center'; o.fillText(s, x, y); o.globalAlpha = 1; o.textAlign = 'left'; }); glow(o, 1000, 1120, 180, '255,180,90', 0.3 * flick(t)); } }),
});
Object.assign(SETS, V2);
export function episode(ep) {
  const S = {}; ep.scenes.forEach((d, i) => { S[`s${ep.n}_n_${i}`] = (c, t, b) => { SETS[d.t](c, t, b, { ...d, ep: ep.n }); atmos(c, t, b, d.t === 'hook' || d.t === 'paper' || d.t === 'stamp' || d.t === 'phone' ? 0 : 1); if (d.tag) label(c, d.tag, W / 2, 330, { k: sp(t, b.start), size: 50, border: d.tag.startsWith('A') ? RED : '#3DDC84' }); if (d.label) label(c, d.label, W / 2, 1320, { k: sp(t, b.start + b.dur * 0.5), size: 46, border: RED }); }; });
  S.choice1 = (c, t, b) => choiceCard(c, t, b, (cc, tt) => desk(cc, tt, 0.6), ep.choice.q, [ep.choice.a, ep.choice.b]); S.cta1 = (c, t, b) => ctaCard(c, t, b, `${ep.n + 1}-QISM ERTAGA`, 'A YOKI B?');
  const hudFn = (c, t) => { const m = keys(t, [[0, ep.hud[0]], [at('cta1'), ep.hud[1]]]); hud(c, t, { ...clock(m), day: 1, batt: ep.batt || 20, pills: [{ txt: ep.pill || 'URINISH 847', col: RED, pulse: 1 }] }); };
  run({ scenes: S, fallback: (c, t) => desk(c, t), hudFn, hot: new RegExp(ep.hot, 'i'), noHud: [`s${ep.n}_n_0`] });
}
