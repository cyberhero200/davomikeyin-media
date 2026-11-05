#!/usr/bin/env python3
"""Prepare an episode from episodes.json: python3 tools/ep.py N → sN/ folder, story.json, ep.json, plan line; prints the VO prompt."""
import json,os,shutil,sys
n=int(sys.argv[1]); R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ep=[e for e in json.load(open(f'{R}/episodes.json')) if e['n']==n][0]
d=f'{R}/s{n}'; f=f'{d}/film'; os.makedirs(f'{f}/audio',exist_ok=True); os.makedirs(f'{d}/out',exist_ok=True)
for x in ['index.html','film.json','beats.json']: shutil.copy(f'{R}/s2/film/{x}',f)
if not os.path.exists(f'{f}/fonts'): shutil.copytree(f'{R}/s2/film/fonts',f'{f}/fonts')
for l,t in [(f'{f}/bg','../../bg'),(f'{f}/common','../../common'),(f'{d}/node_modules','/opt/npm-tools/node_modules')]:
    if not os.path.lexists(l): os.symlink(t,l)
json.dump(ep,open(f'{f}/ep.json','w'),ensure_ascii=False)
open(f'{f}/film.js','w').write("import { episode } from './common/chegara.js';\nepisode(await fetch('ep.json').then((r) => r.json()));\n")
k=len(ep['scenes']); key=f's{n}_n'; b=lambda i:f'{key}_{i}'
prompt=' [pause] '.join(s['vo'] for s in ep['scenes'])
json.dump({"seq":[["n",key,list(range(k)),1],["card","choice1",4.2,1],["card","cta1",3.6,1]],"score":{"root":34+(n%5),"heart":[[b(k//4),84],[b(k//2),96],[b(k-2),116]],"boom":[b(0)]+[b(i) for i,s in enumerate(ep['scenes']) if s.get('boom')],"ring":[b(i) for i,s in enumerate(ep['scenes']) if s['t']=='phone'],"sfx":[[{'door':'knock3','bed':'breath','stairs':'steps','corridor':'steps','opendoor':'creak','prints':'wet','lift':'hum','crowd':'whisper','shelves':'hum','paper':'paper','stamp':'paper','window':'wind','palm':'wind','room':'wind'}.get(s['t'],'wind'),b(i)] for i,s in enumerate(ep['scenes'])]}},open(f'{d}/story.json','w'),ensure_ascii=False)
p=json.load(open(f'{R}/plan.json')); p['lines']=[l for l in p['lines'] if l['file']!=f'{key}.mp3']+[{"file":f'{key}.mp3',"voice":"rwtcHtZgYU6HN2zLNBlf","prompt":prompt}]; json.dump(p,open(f'{R}/plan.json','w'),ensure_ascii=False,indent=1)
print(prompt); print(len(prompt),'chars')
