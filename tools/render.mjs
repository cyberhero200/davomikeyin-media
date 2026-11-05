// node tools/render.mjs out.mp4 [fps] [workers] → renders film frames with Playwright, muxes film/audio/mix.wav
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';

const root = path.resolve('film');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.wav': 'audio/wav' };
const srv = http.createServer((q, r) => {
  const p = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); r.end(d); });
}).listen(0);
const port = srv.address().port;
const out = process.argv[2] || 'out/film.mp4';
const fps = Number(process.argv[3] || 30);
const workers = Number(process.argv[4] || 2);
const dur = JSON.parse(fs.readFileSync(path.join(root, 'film.json'))).duration;
const total = Math.ceil(dur * fps);
const tmp = fs.mkdtempSync('/tmp/claude-0/frames-');

const b = await chromium.launch();
async function work(w) {
  const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', (e) => console.log('pageerror:', e.message));
  await pg.goto(`http://localhost:${port}/index.html?format=9x16&render=1&blur=${process.env.BLUR || 0}&fps=${fps}`);
  await pg.waitForFunction(() => window.filmReady === true, null, { timeout: 30000 });
  for (let i = w; i < total; i += workers) {
    const data = await pg.evaluate((t) => { window.seek(t); return document.getElementById('film').toDataURL('image/jpeg', 0.93); }, i / fps);
    fs.writeFileSync(path.join(tmp, `${String(i).padStart(5, '0')}.jpg`), Buffer.from(data.split(',')[1], 'base64'));
    if (i % 300 === 0) console.log('frame', i, '/', total);
  }
}
await Promise.all([...Array(workers).keys()].map(work));
await b.close(); srv.close();
const audio = path.join(root, 'audio', 'mix.wav');
const args = ['-v', 'error', '-y', '-framerate', String(fps), '-i', path.join(tmp, '%05d.jpg')];
if (fs.existsSync(audio)) args.push('-i', audio);
args.push('-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart');
if (fs.existsSync(audio)) args.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
args.push(out);
execFileSync('ffmpeg', args, { stdio: 'inherit' });
fs.rmSync(tmp, { recursive: true });
console.log('wrote', out);
