// node tools/shot.mjs out.png t1 t2 ...  → contact sheet of frames (via a local static server)
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve('film');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.wav': 'audio/wav', '.png': 'image/png' };
const srv = http.createServer((q, r) => {
  const p = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); r.end(d); });
}).listen(0);
const port = srv.address().port;
const [out, ...ts] = process.argv.slice(2);
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
pg.on('console', (m) => { if (m.type() === 'error') console.log('console:', m.text()); });
pg.on('pageerror', (e) => console.log('pageerror:', e.message));
await pg.goto(`http://localhost:${port}/index.html?format=9x16&render=1&blur=0`);
await pg.waitForFunction(() => window.filmReady === true, null, { timeout: 20000 });
const dir = fs.mkdtempSync('/tmp/claude-0/shot-');
const files = [];
for (const [i, t] of ts.entries()) {
  const data = await pg.evaluate((tt) => { window.seek(Number(tt)); return document.getElementById('film').toDataURL('image/jpeg', 0.85); }, t);
  const f = path.join(dir, `${String(i).padStart(3, '0')}.jpg`);
  fs.writeFileSync(f, Buffer.from(data.split(',')[1], 'base64'));
  files.push(f);
}
const cues = await pg.evaluate(() => window.CUES); fs.writeFileSync(path.join(root, 'cues.json'), JSON.stringify(cues)); console.log(JSON.stringify(cues));
await b.close(); srv.close();
const cols = Math.min(6, files.length);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', '1', '-i', path.join(dir, '%03d.jpg'), '-vf', `scale=360:-1,drawtext=text='%{n}':x=8:y=8:fontsize=28:fontcolor=yellow,tile=${cols}x${Math.ceil(files.length / cols)}`, '-frames:v', '1', out]);
console.log('wrote', out);
