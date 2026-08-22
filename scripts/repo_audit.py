#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
IGNORE = {'.git', '.github', 'scripts', 'node_modules', '.audit-js', 'ui-audit'}

class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids=[]; self.forms=0; self.buttons=[]; self.inputs=[]; self.labels_for=[]
        self.links=[]; self.images=[]; self.headings=[]; self.inline_handlers=[]
        self.scripts=[]; self.stylesheets=[]; self.meta=[]; self.lang=None; self.dir=None
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='html': self.lang=a.get('lang'); self.dir=a.get('dir')
        if 'id' in a: self.ids.append(a['id'])
        if tag=='form': self.forms+=1
        if tag=='button': self.buttons.append(a)
        if tag in {'input','select','textarea'}: self.inputs.append((tag,a))
        if tag=='label' and a.get('for'): self.labels_for.append(a['for'])
        if tag=='a': self.links.append(a)
        if tag=='img': self.images.append(a)
        if tag in {'h1','h2','h3','h4','h5','h6'}: self.headings.append(tag)
        if tag=='script' and a.get('src'): self.scripts.append(a.get('src'))
        if tag=='link' and a.get('rel')=='stylesheet': self.stylesheets.append(a.get('href'))
        if tag=='meta': self.meta.append(a)
        for k,v in attrs:
            if k and k.lower().startswith('on'):
                self.inline_handlers.append((tag,k,v))

def visible_files():
    for p in sorted(ROOT.rglob('*')):
        if not p.is_file(): continue
        rel=p.relative_to(ROOT)
        if any(part in IGNORE for part in rel.parts): continue
        yield rel,p

def page_info(rel: Path, p: Path):
    text=p.read_text(encoding='utf-8', errors='replace')
    parser=AuditParser(); parser.feed(text)
    ids=Counter(parser.ids)
    duplicate_ids=[k for k,v in ids.items() if v>1]
    unlabeled=[]
    for tag,a in parser.inputs:
        if tag=='input' and a.get('type') in {'hidden','button','submit','reset'}: continue
        iid=a.get('id')
        if iid and iid in parser.labels_for: continue
        if a.get('aria-label') or a.get('aria-labelledby'): continue
        unlabeled.append(iid or a.get('name') or f'<{tag}>')
    blank_rel=[a.get('href') for a in parser.links if a.get('target')=='_blank' and 'noopener' not in (a.get('rel') or '')]
    missing_alt=[a.get('src','<inline>') for a in parser.images if 'alt' not in a]
    external=sorted({u for u in re.findall(r'https?://[^\s\"\'<>]+', text) if 'tools.oalfawzan.sa' not in u and 'oalfawzan.sa' not in u})
    risky={
        'innerHTML': len(re.findall(r'\.innerHTML\s*=', text)),
        'insertAdjacentHTML': len(re.findall(r'insertAdjacentHTML\s*\(', text)),
        'document.write': len(re.findall(r'document\.write\s*\(', text)),
        'eval': len(re.findall(r'\beval\s*\(', text)),
        'localStorage': len(re.findall(r'\blocalStorage\b', text)),
        'fetch': len(re.findall(r'\bfetch\s*\(', text)),
        'alert': len(re.findall(r'\balert\s*\(', text)),
        'confirm': len(re.findall(r'\bconfirm\s*\(', text)),
    }
    viewport=next((m.get('content','') for m in parser.meta if m.get('name')=='viewport'), '')
    return {
        'file': str(rel), 'bytes': p.stat().st_size, 'lines': text.count('\n')+1,
        'lang': parser.lang, 'dir': parser.dir, 'forms': parser.forms,
        'inputs': len(parser.inputs), 'buttons': len(parser.buttons), 'headings': parser.headings,
        'external_scripts': parser.scripts, 'stylesheets': parser.stylesheets,
        'duplicate_ids': duplicate_ids, 'unlabeled_controls': unlabeled,
        'blank_links_without_noopener': blank_rel, 'images_missing_alt': missing_alt,
        'inline_handlers': len(parser.inline_handlers), 'risky': risky,
        'viewport': viewport, 'zoom_disabled': ('user-scalable=no' in viewport or 'maximum-scale=1' in viewport),
        'inline_style_blocks': len(re.findall(r'<style\b', text, re.I)),
        'inline_script_blocks': len(re.findall(r'<script(?![^>]*\bsrc=)[^>]*>', text, re.I)),
        'style_attributes': len(re.findall(r'\sstyle\s*=', text, re.I)),
        'external_urls': external[:30],
    }

def extract_inline_js(rel: Path, p: Path):
    text=p.read_text(encoding='utf-8', errors='replace')
    blocks=re.findall(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', text, re.I|re.S)
    out=[]
    for i,b in enumerate(blocks,1):
        target=ROOT/'.audit-js'/f"{str(rel).replace('/','__')}__{i}.js"
        target.parent.mkdir(exist_ok=True)
        target.write_text(b,encoding='utf-8')
        out.append(str(target.relative_to(ROOT)))
    return out

def main():
    files=list(visible_files())
    html=[(r,p) for r,p in files if p.suffix.lower()=='.html']
    print('=== REPOSITORY TREE ===')
    for r,p in files: print(f'{r}\t{p.stat().st_size} bytes')
    print(f'\nFiles: {len(files)} | HTML pages: {len(html)}')
    reports=[]; js=[]
    for rel,p in html:
        info=page_info(rel,p); reports.append(info); js.extend(extract_inline_js(rel,p))
        print('\n=== PAGE', rel, '===')
        print(json.dumps(info,ensure_ascii=False,indent=2))
    print('\n=== INLINE JS EXTRACTS ===')
    for x in js: print(x)
    (ROOT/'audit-report.json').write_text(json.dumps({'pages':reports},ensure_ascii=False,indent=2),encoding='utf-8')

if __name__=='__main__': main()
