#!/usr/bin/env python3
"""Split the full render into one mp4 per part using timeline.json "parts".
usage: python3 tools/split.py sX out/sX_full.mp4 out/Name   → out/Name_1-qism.mp4 ...
"""
import json, os, subprocess, sys
story, full, prefix = sys.argv[1], sys.argv[2], sys.argv[3]
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
parts = json.load(open(os.path.join(root, story, 'film', 'timeline.json')))['parts']
for k in sorted(parts, key=int):
    a, b = parts[k]
    out = f'{prefix}_{k}-qism.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{a:.3f}', '-to', f'{b + 0.35:.3f}', '-i', full,
                    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out], check=True)
    print('wrote', out)
