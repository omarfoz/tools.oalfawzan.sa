#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    ROOT / 'offer/index.html',
    ROOT / 'wheel-of-names/index.html',
    ROOT / 'qr-generator/index.html',
    ROOT / 'json-formatter/index.html',
    ROOT / 'time/index.html',
    ROOT / 'stock-analysis-dashboard/index.html',
    ROOT / 'loan-calculator/index.html',
]

PLATFORM_CSS = r'''/* Shared platform foundation: accessibility, resilient controls, and cross-tool consistency. */
:root {
  --ds-bg: #0a0a0f;
  --ds-surface: #111118;
  --ds-surface-2: #171722;
  --ds-text: #f3f4f8;
  --ds-muted: #8b8ba1;
  --ds-border: rgba(255,255,255,.10);
  --ds-primary: #2f8cff;
  --ds-primary-hover: #5aa4ff;
  --ds-success: #18c998;
  --ds-warning: #f5b942;
  --ds-danger: #ff7070;
  --ds-radius-sm: 8px;
  --ds-radius-md: 12px;
  --ds-radius-lg: 18px;
  --ds-shadow-sm: 0 1px 2px rgba(0,0,0,.18);
  --ds-shadow-md: 0 12px 32px rgba(0,0,0,.18);
  --ds-space-1: .25rem;
  --ds-space-2: .5rem;
  --ds-space-3: .75rem;
  --ds-space-4: 1rem;
  --ds-space-5: 1.5rem;
  --ds-space-6: 2rem;
}
:root[data-theme="light"] {
  --ds-bg: #f7f8fc;
  --ds-surface: #fff;
  --ds-surface-2: #f2f4f8;
  --ds-text: #111827;
  --ds-muted: #667085;
  --ds-border: rgba(16,24,40,.14);
  --ds-primary: #075fc7;
  --ds-primary-hover: #004da8;
  --ds-success: #087f5b;
  --ds-warning: #9a6700;
  --ds-danger: #c43232;
  --ds-shadow-md: 0 12px 32px rgba(15,23,42,.08);
}
html { color-scheme: dark; scroll-behavior: smooth; }
html[data-theme="light"] { color-scheme: light; }
body { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
button, input, select, textarea { font: inherit; }
button, [role="button"], input, select { min-height: 44px; }
button:disabled, input:disabled, select:disabled, textarea:disabled { cursor: not-allowed; opacity: .58; }
a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]) { outline: none; }
a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, [tabindex]:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ds-primary) 36%, transparent) !important;
  outline: 2px solid transparent;
}
.skip-link {
  position: fixed; inset-inline-start: 12px; top: 10px; z-index: 99999;
  transform: translateY(-180%); padding: 10px 14px; border-radius: var(--ds-radius-sm);
  color: #fff; background: #075fc7; text-decoration: none; font-weight: 700;
}
.skip-link:focus { transform: translateY(0); }
.platform-toast-region { position: fixed; inset-inline-end: 16px; bottom: 16px; z-index: 9999; display: grid; gap: 8px; width: min(360px, calc(100vw - 32px)); pointer-events: none; }
.platform-toast { background: var(--ds-surface); color: var(--ds-text); border: 1px solid var(--ds-border); border-radius: var(--ds-radius-md); box-shadow: var(--ds-shadow-md); padding: 12px 14px; line-height: 1.55; pointer-events: auto; }
.platform-toast[data-tone="success"] { border-inline-start: 3px solid var(--ds-success); }
.platform-toast[data-tone="error"] { border-inline-start: 3px solid var(--ds-danger); }
.platform-toast[data-tone="warning"] { border-inline-start: 3px solid var(--ds-warning); }
.platform-field-error { color: var(--ds-danger); font-size: .8rem; margin-top: 6px; }
.platform-empty { border: 1px dashed var(--ds-border); border-radius: var(--ds-radius-md); padding: 18px; color: var(--ds-muted); text-align: center; }
.platform-table-scroll { max-width: 100%; overflow-x: auto; overscroll-behavior-inline: contain; -webkit-overflow-scrolling: touch; }
img, canvas, svg { max-width: 100%; }
pre, code, textarea { overflow-wrap: anywhere; }
[hidden] { display: none !important; }
::selection { background: color-mix(in srgb, var(--ds-primary) 32%, transparent); }
@media (max-width: 430px) {
  body { min-width: 0; }
  .wrap { width: 100%; padding-inline: 12px !important; }
  .card { max-width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
'''

PLATFORM_JS = r'''(() => {
  'use strict';
  const API = {};
  const ready = (fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, {once:true}) : fn();
  API.notify = (message, tone='info', timeout=2600) => {
    if (!message) return;
    let region = document.querySelector('.platform-toast-region');
    if (!region) {
      region = document.createElement('div');
      region.className = 'platform-toast-region';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      document.body.append(region);
    }
    const toast = document.createElement('div');
    toast.className = 'platform-toast';
    toast.dataset.tone = tone;
    toast.setAttribute('role', tone === 'error' ? 'alert' : 'status');
    toast.textContent = String(message);
    region.append(toast);
    window.setTimeout(() => toast.remove(), timeout);
  };
  API.setBusy = (element, busy=true) => {
    if (!element) return;
    element.setAttribute('aria-busy', String(Boolean(busy)));
    if ('disabled' in element) element.disabled = Boolean(busy);
  };
  API.downloadText = (text, filename, type='text/plain;charset=utf-8') => {
    const blob = new Blob([text], {type});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=filename; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  API.copyText = async (text) => {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(String(text ?? ''));
    API.notify(document.documentElement.lang === 'ar' ? 'تم النسخ' : 'Copied', 'success');
  };
  window.ToolsPlatform = API;
  ready(() => {
    if (!document.querySelector('.skip-link')) {
      const skip = document.createElement('a'); skip.className='skip-link'; skip.href='#main-content';
      skip.textContent = document.documentElement.lang === 'ar' ? 'تجاوز إلى المحتوى' : 'Skip to content';
      document.body.prepend(skip);
    }
    let main = document.querySelector('main, [role="main"]');
    if (!main) {
      main = document.querySelector('.wrap, .container, .app, body > div');
      if (main) { main.id ||= 'main-content'; main.setAttribute('role','main'); }
    } else main.id ||= 'main-content';
    document.querySelectorAll('a[target="_blank"]').forEach(a => {
      const rel = new Set((a.getAttribute('rel') || '').split(/\s+/).filter(Boolean)); rel.add('noopener'); rel.add('noreferrer'); a.setAttribute('rel', [...rel].join(' '));
    });
    document.querySelectorAll('button:not([type])').forEach(b => b.type='button');
    document.querySelectorAll('input,select,textarea').forEach(el => {
      if (el.matches('[type="hidden"],[type="submit"],[type="button"],[type="reset"]')) return;
      if (el.labels?.length || el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')) return;
      const hint = el.getAttribute('placeholder') || el.getAttribute('name') || el.id;
      if (hint) el.setAttribute('aria-label', hint);
    });
    document.querySelectorAll('table').forEach(table => {
      const p=table.parentElement; if (p && !p.classList.contains('platform-table-scroll')) p.classList.add('platform-table-scroll');
    });
  });
})();
'''

HOME_CSS = r'''*{box-sizing:border-box}body{margin:0;background:var(--ds-bg);color:var(--ds-text);font-family:'IBM Plex Sans',sans-serif;min-height:100vh}html[lang="ar"] body{font-family:'IBM Plex Sans Arabic','IBM Plex Sans',sans-serif}.home{max-width:1120px;margin:auto;padding:24px}.site-header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:4px 0 34px}.brand{color:var(--ds-text);text-decoration:none;font-weight:800;letter-spacing:-.02em}.brand span{color:var(--ds-primary)}.header-actions{display:flex;gap:8px;align-items:center}.icon-btn,.link-btn{min-height:44px;border:1px solid var(--ds-border);background:var(--ds-surface);color:var(--ds-text);border-radius:10px;padding:0 13px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font-weight:700}.hero{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(260px,.7fr);gap:28px;align-items:end;padding:18px 0 32px;border-bottom:1px solid var(--ds-border)}.eyebrow{color:var(--ds-success);font-size:.78rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase}.hero h1{font-size:clamp(2.1rem,6vw,4.5rem);line-height:1.02;letter-spacing:-.055em;margin:.55rem 0 1rem;max-width:780px}.hero p{color:var(--ds-muted);font-size:1rem;line-height:1.8;margin:0;max-width:700px}.hero-meta{display:grid;grid-template-columns:1fr 1fr;gap:10px}.stat{padding:16px;border:1px solid var(--ds-border);background:var(--ds-surface);border-radius:14px}.stat strong{display:block;font-size:1.5rem}.stat span{color:var(--ds-muted);font-size:.78rem}.directory{padding:30px 0 20px}.directory-head{display:flex;gap:16px;justify-content:space-between;align-items:end;margin-bottom:18px}.directory-head h2{margin:0 0 5px;font-size:1.35rem}.directory-head p{margin:0;color:var(--ds-muted);font-size:.88rem}.search-wrap{min-width:min(360px,100%)}.search-wrap label{display:block;color:var(--ds-muted);font-size:.78rem;margin-bottom:7px}.search-wrap input{width:100%;border:1px solid var(--ds-border);background:var(--ds-surface);color:var(--ds-text);border-radius:11px;padding:0 13px}.filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}.filter{border:1px solid var(--ds-border);background:transparent;color:var(--ds-muted);border-radius:999px;padding:0 14px;cursor:pointer;font-weight:700}.filter[aria-pressed="true"]{background:var(--ds-primary);border-color:var(--ds-primary);color:white}.tools-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.tool-card{border:1px solid var(--ds-border);background:var(--ds-surface);border-radius:16px;padding:19px;color:var(--ds-text);text-decoration:none;display:flex;flex-direction:column;min-height:210px;transition:transform .16s ease,border-color .16s ease}.tool-card:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--ds-primary) 55%,var(--ds-border))}.tool-top{display:flex;align-items:center;justify-content:space-between;gap:10px}.tool-icon{font-size:1.45rem}.category{font-size:.7rem;color:var(--ds-muted);border:1px solid var(--ds-border);border-radius:999px;padding:4px 8px}.tool-card h3{font-size:1.03rem;margin:18px 0 8px}.tool-card p{color:var(--ds-muted);line-height:1.65;font-size:.85rem;margin:0 0 18px}.launch{margin-top:auto;color:var(--ds-primary);font-size:.82rem;font-weight:800}.empty-tools{display:none;padding:24px;border:1px dashed var(--ds-border);border-radius:14px;color:var(--ds-muted);text-align:center}.site-footer{border-top:1px solid var(--ds-border);margin-top:30px;padding:22px 0;color:var(--ds-muted);font-size:.78rem;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}.site-footer a{color:inherit}.tool-card[hidden]{display:none!important}@media(max-width:900px){.hero{grid-template-columns:1fr}.tools-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.directory-head{align-items:stretch;flex-direction:column}.search-wrap{width:100%}}@media(max-width:600px){.home{padding:16px}.site-header{padding-bottom:20px}.header-actions .link-btn{display:none}.tools-grid{grid-template-columns:1fr}.hero{padding-top:8px}.hero-meta{grid-template-columns:1fr 1fr}.tool-card{min-height:180px}}'''

HOME_JS = r'''(() => {
const DATA={ar:{lang:'ar',dir:'rtl',title:'أدوات عمر الفوزان — أدوات عملية سريعة',eyebrow:'TOOLS.OALFAWZAN.SA',h1:'أدوات عملية، بدون تعقيد.',desc:'مجموعة أدوات مركّزة تساعدك على المقارنة والحساب والتحليل وإنجاز المهام اليومية مباشرة من المتصفح.',directory:'دليل الأدوات',sub:'اختر الأداة المناسبة أو ابحث بالاسم.',searchLabel:'البحث في الأدوات',search:'ابحث عن أداة…',all:'الكل',career:'العمل والمال',developer:'للمطورين',productivity:'الإنتاجية',market:'الأسواق',launch:'فتح الأداة ←',none:'لا توجد أدوات مطابقة للبحث.',profile:'الملف الشخصي',github:'GitHub',theme:'تبديل المظهر'},en:{lang:'en',dir:'ltr',title:'Omar Alfawzan Tools — focused browser utilities',eyebrow:'TOOLS.OALFAWZAN.SA',h1:'Useful tools, without the overhead.',desc:'Focused browser utilities for comparing, calculating, analyzing, and getting everyday tasks done quickly.',directory:'Tool directory',sub:'Choose a tool or search by name.',searchLabel:'Search tools',search:'Search tools…',all:'All',career:'Career & finance',developer:'Developer',productivity:'Productivity',market:'Markets',launch:'Open tool →',none:'No tools match your search.',profile:'Profile',github:'GitHub',theme:'Toggle theme'}};
const cards=[...document.querySelectorAll('.tool-card')],filters=[...document.querySelectorAll('.filter')]; let category='all';
function apply(){const q=document.getElementById('toolSearch').value.trim().toLocaleLowerCase();let shown=0;cards.forEach(c=>{const okCat=category==='all'||c.dataset.category===category;const okQ=!q||c.textContent.toLocaleLowerCase().includes(q);c.hidden=!(okCat&&okQ);if(!c.hidden)shown++});document.getElementById('emptyTools').style.display=shown?'none':'block'}
function setLang(lang){const s=DATA[lang]||DATA.ar;document.documentElement.lang=s.lang;document.documentElement.dir=s.dir;document.title=s.title;for(const [id,key] of Object.entries({eyebrow:'eyebrow',heroTitle:'h1',heroDesc:'desc',directoryTitle:'directory',directorySub:'sub',searchLabel:'searchLabel',profileLink:'profile',githubLink:'github',emptyTools:'none'})){const el=document.getElementById(id);if(el)el.textContent=s[key]}const inp=document.getElementById('toolSearch');inp.placeholder=s.search;document.getElementById('langBtn').textContent=lang==='ar'?'EN':'ع';document.getElementById('themeBtn').setAttribute('aria-label',s.theme);filters.forEach(f=>f.textContent=s[f.dataset.i18n]);document.querySelectorAll('.launch').forEach(e=>e.textContent=s.launch);localStorage.setItem('tools-language',lang)}
function setTheme(theme){document.documentElement.dataset.theme=theme;document.getElementById('themeBtn').textContent=theme==='light'?'🌙':'☀️';localStorage.setItem('tools-theme',theme)}
document.getElementById('toolSearch').addEventListener('input',apply);filters.forEach(f=>f.addEventListener('click',()=>{category=f.dataset.category;filters.forEach(x=>x.setAttribute('aria-pressed',String(x===f)));apply()}));document.getElementById('langBtn').addEventListener('click',()=>setLang(document.documentElement.lang==='ar'?'en':'ar'));document.getElementById('themeBtn').addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='light'?'dark':'light'));setTheme(localStorage.getItem('tools-theme')||'dark');setLang(localStorage.getItem('tools-language')||'ar');
})();'''

HOME_HTML = '''<!doctype html>
<html lang="ar" dir="rtl" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0a0a0f">
  <meta name="description" content="مجموعة أدوات عملية للمقارنة والحساب والتحليل، تعمل مباشرة من المتصفح.">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/platform.css">
  <link rel="stylesheet" href="/assets/css/pages/home.css">
  <title>أدوات عمر الفوزان — أدوات عملية سريعة</title>
</head>
<body>
<a class="skip-link" href="#main-content">تجاوز إلى المحتوى</a>
<div class="home" id="main-content" role="main">
<header class="site-header"><a class="brand" href="/"><span>tools.</span>oalfawzan.sa</a><div class="header-actions"><a id="githubLink" class="link-btn" href="https://github.com/omarfoz/tools.oalfawzan.sa" target="_blank" rel="noopener noreferrer">GitHub</a><a id="profileLink" class="link-btn" href="https://oalfawzan.sa">الملف الشخصي</a><button class="icon-btn" id="langBtn" type="button">EN</button><button class="icon-btn" id="themeBtn" type="button" aria-label="تبديل المظهر">☀️</button></div></header>
<section class="hero" aria-labelledby="heroTitle"><div><div class="eyebrow" id="eyebrow">TOOLS.OALFAWZAN.SA</div><h1 id="heroTitle">أدوات عملية، بدون تعقيد.</h1><p id="heroDesc">مجموعة أدوات مركّزة تساعدك على المقارنة والحساب والتحليل وإنجاز المهام اليومية مباشرة من المتصفح.</p></div><div class="hero-meta"><div class="stat"><strong>7</strong><span>Tools</span></div><div class="stat"><strong>100%</strong><span>Browser-first</span></div></div></section>
<section class="directory" aria-labelledby="directoryTitle"><div class="directory-head"><div><h2 id="directoryTitle">دليل الأدوات</h2><p id="directorySub">اختر الأداة المناسبة أو ابحث بالاسم.</p></div><div class="search-wrap"><label id="searchLabel" for="toolSearch">البحث في الأدوات</label><input id="toolSearch" type="search" autocomplete="off" placeholder="ابحث عن أداة…"></div></div><div class="filters" aria-label="Tool categories"><button class="filter" data-category="all" data-i18n="all" aria-pressed="true">الكل</button><button class="filter" data-category="career" data-i18n="career" aria-pressed="false">العمل والمال</button><button class="filter" data-category="developer" data-i18n="developer" aria-pressed="false">للمطورين</button><button class="filter" data-category="productivity" data-i18n="productivity" aria-pressed="false">الإنتاجية</button><button class="filter" data-category="market" data-i18n="market" aria-pressed="false">الأسواق</button></div>
<div class="tools-grid" id="toolsGrid">
<a class="tool-card" data-category="career" href="/offer/"><div class="tool-top"><span class="tool-icon">⚖️</span><span class="category">Career</span></div><h3>مقارن عروض العمل · Job Offer Comparator</h3><p>قارن صافي الدخل والمزايا والقيمة السنوية بين عروض العمل.</p><span class="launch">فتح الأداة ←</span></a>
<a class="tool-card" data-category="career" href="/loan-calculator/"><div class="tool-top"><span class="tool-icon">🏦</span><span class="category">Finance</span></div><h3>مقارن القروض · Loan Comparator</h3><p>قارن تمويل السكن ونسب الاستقطاع والتكلفة وجدول السداد.</p><span class="launch">فتح الأداة ←</span></a>
<a class="tool-card" data-category="productivity" href="/time/"><div class="tool-top"><span class="tool-icon">⏱️</span><span class="category">Productivity</span></div><h3>عدة الوقت والتقويم · Time Toolkit</h3><p>تحويل مناطق زمنية وفروق تواريخ ومدد وتحويل هجري وميلادي.</p><span class="launch">فتح الأداة ←</span></a>
<a class="tool-card" data-category="productivity" href="/wheel-of-names/"><div class="tool-top"><span class="tool-icon">🎡</span><span class="category">Productivity</span></div><h3>عجلة الأسماء · Wheel of Names</h3><p>اختيار عشوائي واضح وسريع من قائمة أسماء.</p><span class="launch">فتح الأداة ←</span></a>
<a class="tool-card" data-category="developer" href="/json-formatter/"><div class="tool-top"><span class="tool-icon">{ }</span><span class="category">Developer</span></div><h3>منسق JSON · JSON Formatter</h3><p>تحقق ونسّق وصغّر JSON مع نسخ الناتج فوراً.</p><span class="launch">فتح الأداة ←</span></a>
<a class="tool-card" data-category="developer" href="/qr-generator/"><div class="tool-top"><span class="tool-icon">▦</span><span class="category">Utility</span></div><h3>مولد QR · QR Generator</h3><p>أنشئ رمز QR للنص أو الرابط ثم نزّله كصورة.</p><span class="launch">فتح الأداة ←</span></a>
<a class="tool-card" data-category="market" href="/stock-analysis-dashboard/"><div class="tool-top"><span class="tool-icon">📈</span><span class="category">Market</span></div><h3>تحليل الأسهم السعودية · Saudi Stock Analysis</h3><p>مؤشرات فنية ومفضلة ولوحة تحليل لأسهم تداول.</p><span class="launch">فتح الأداة ←</span></a>
</div><div class="empty-tools" id="emptyTools" role="status">لا توجد أدوات مطابقة للبحث.</div></section>
<footer class="site-footer"><span>tools.oalfawzan.sa</span><span>Built by <a href="https://oalfawzan.sa">Omar Alfawzan</a></span></footer>
</div>
<script src="/assets/js/platform.js"></script><script src="/assets/js/pages/home.js"></script>
</body></html>'''

LABELS = {
'json-formatter/index.html': {'inputJson':'JSON input','outputJson':'Formatted JSON output'},
'qr-generator/index.html': {'qrText':'Text or URL to encode'},
'wheel-of-names/index.html': {'namesInput':'Names, one per line'},
'stock-analysis-dashboard/index.html': {'tickerInput':'Saudi stock ticker'},
'time/index.html': {'tzDate':'Date','tzTime':'Time','fromZone':'Source time zone','toZone':'Destination time zone','startDate':'Start date','endDate':'End date','durationStart':'Start date and time','durationEnd':'End date and time','baseTime':'Base time','hoursToAdd':'Hours to add','hYear':'Hijri year','hMonth':'Hijri month','hDay':'Hijri day','gDate':'Gregorian date'},
'offer/index.html': {'coNameA':'First company name','coNameB':'Second company name','vacA':'First offer vacation days','vacB':'Second offer vacation days','noticeA':'First offer notice period','noticeB':'Second offer notice period','pName':'Custom benefit name','pValue':'Custom benefit value','pPct':'Custom benefit percentage','pPctRef':'Percentage reference','pHasRef2':'Enable second reference','pPctRef2':'Second percentage reference'}
}

ANTI_ZOOM = re.compile(r'<script>\s*\(\(\)\s*=>\s*\{.*?(?:gestureend|lastTouchEnd).*?</script>\s*', re.S|re.I)
STYLE_BLOCK = re.compile(r'<style(?:\s[^>]*)?>(.*?)</style>', re.S|re.I)
INLINE_SCRIPT = re.compile(r'<script(?![^>]*\bsrc=)([^>]*)>(.*?)</script>', re.S|re.I)

def ensure_dir(p: Path): p.parent.mkdir(parents=True, exist_ok=True)
def write(p: Path, content: str): ensure_dir(p); p.write_text(content.rstrip()+"\n", encoding='utf-8')

def add_attr_to_id(text: str, element_id: str, name: str, value: str) -> str:
    pat = re.compile(r'(<(?:input|select|textarea)\b(?=[^>]*\bid=["\']'+re.escape(element_id)+r'["\'])[^>]*)(>)', re.I)
    def repl(m):
        if re.search(r'\b'+re.escape(name)+r'\s*=', m.group(1), re.I): return m.group(0)
        return f'{m.group(1)} {name}="{value}"{m.group(2)}'
    return pat.sub(repl, text, count=1)

def modernize_page(path: Path):
    rel=str(path.relative_to(ROOT)).replace('\\','/')
    text=path.read_text(encoding='utf-8')
    text=ANTI_ZOOM.sub('', text)
    text=re.sub(r'<meta\s+name=["\']viewport["\']\s+content=["\'][^"\']*["\']\s*/?>', '<meta name="viewport" content="width=device-width, initial-scale=1">', text, count=1, flags=re.I)
    if 'name="theme-color"' not in text: text=text.replace('</title>', '</title>\n<meta name="theme-color" content="#0a0a0f">',1)
    if '/assets/css/platform.css' not in text: text=text.replace('</head>', '<link rel="stylesheet" href="/assets/css/platform.css">\n</head>',1)
    if '/assets/js/platform.js' not in text: text=text.replace('</body>', '<script src="/assets/js/platform.js"></script>\n</body>',1)
    if 'class="skip-link"' not in text: text=text.replace('<body>', '<body>\n<a class="skip-link" href="#main-content">تجاوز إلى المحتوى</a>',1)
    # Safe, static accessibility improvements.
    text=re.sub(r'<button(?![^>]*\btype=)([^>]*)>', r'<button type="button"\1>', text, flags=re.I)
    text=re.sub(r'<a([^>]*\btarget=["\']_blank["\'][^>]*)(?<!rel=["\']noopener)(>)', lambda m: m.group(0) if re.search(r'\brel=',m.group(1),re.I) else '<a'+m.group(1)+' rel="noopener noreferrer"'+m.group(2), text, flags=re.I)
    for iid,label in LABELS.get(rel,{}).items(): text=add_attr_to_id(text,iid,'aria-label',label)
    # Mark common dynamic result regions for assistive tech.
    for rid in ('outputJson','result','results','aiText','favoritesList','trendingList','winner','status','message'):
        text=re.sub(r'(<[^>]+\bid=["\']'+rid+r'["\'])(?![^>]*\baria-live=)([^>]*>)', r'\1 aria-live="polite"\2', text, count=1, flags=re.I)
    # Externalize monolithic inline CSS and JS without changing execution order.
    slug = 'home' if rel=='index.html' else rel.split('/')[0]
    styles=[]
    def style_repl(m):
        idx=len(styles)+1; styles.append(m.group(1)); href=f'/assets/css/pages/{slug}.css' if idx==1 else f'/assets/css/pages/{slug}-{idx}.css'; return f'<link rel="stylesheet" href="{href}">'
    text=STYLE_BLOCK.sub(style_repl,text)
    scripts=[]
    def script_repl(m):
        body=m.group(2)
        if not body.strip(): return m.group(0)
        idx=len(scripts)+1; scripts.append(body); src=f'/assets/js/pages/{slug}.js' if idx==1 else f'/assets/js/pages/{slug}-{idx}.js'; return f'<script src="{src}"></script>'
    text=INLINE_SCRIPT.sub(script_repl,text)
    for i,css in enumerate(styles,1): write(ROOT/f'assets/css/pages/{slug}{"" if i==1 else "-"+str(i)}.css',css)
    for i,js in enumerate(scripts,1): write(ROOT/f'assets/js/pages/{slug}{"" if i==1 else "-"+str(i)}.js',js)
    path.write_text(text,encoding='utf-8')

def write_404():
    write(ROOT/'404.html', '''<!doctype html><html lang="ar" dir="rtl" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><meta name="theme-color" content="#0a0a0f"><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/assets/css/platform.css"><title>الصفحة غير موجودة — tools.oalfawzan.sa</title><style>body{margin:0;background:var(--ds-bg);color:var(--ds-text);font-family:system-ui;display:grid;place-items:center;min-height:100vh;padding:20px}.box{max-width:560px;border:1px solid var(--ds-border);background:var(--ds-surface);border-radius:18px;padding:28px}.code{color:var(--ds-primary);font-weight:800}h1{margin:.5rem 0}p{color:var(--ds-muted);line-height:1.7}.back{display:inline-flex;margin-top:12px;min-height:44px;align-items:center;padding:0 14px;border-radius:10px;background:var(--ds-primary);color:#fff;text-decoration:none;font-weight:700}</style></head><body><main class="box" id="main-content"><div class="code">404</div><h1>الصفحة غير موجودة</h1><p>الرابط الذي فتحته غير موجود أو تم نقله. ارجع إلى دليل الأدوات لاختيار الأداة المطلوبة.</p><a class="back" href="/">العودة إلى جميع الأدوات</a></main><script src="/assets/js/platform.js"></script></body></html>''')

def update_readme():
    readme='''# tools.oalfawzan.sa\n\nA focused collection of browser-first utilities deployed as a static GitHub Pages site. The primary interface is Arabic (RTL) with English support where available.\n\n**Live site:** https://tools.oalfawzan.sa\n\n## Tools\n\n1. **Job Offer Comparator** (`/offer/`) — compare compensation, benefits, annual value, and offer trade-offs.\n2. **Loan Comparator** (`/loan-calculator/`) — compare housing-finance scenarios, DTI, cost, and amortization.\n3. **Time Toolkit** (`/time/`) — time-zone, date-duration, and Hijri/Gregorian utilities.\n4. **Wheel of Names** (`/wheel-of-names/`) — random selection from a list of names.\n5. **JSON Formatter** (`/json-formatter/`) — validate, format, minify, and copy JSON.\n6. **QR Generator** (`/qr-generator/`) — create downloadable QR codes from text or URLs.\n7. **Saudi Stock Analysis** (`/stock-analysis-dashboard/`) — technical indicators, favorites, market data, and a simplified analysis summary.\n\n## Architecture\n\n- Static HTML/CSS/JavaScript; no application server is required for GitHub Pages.\n- Shared platform foundation lives under `assets/css` and `assets/js`.\n- Tool-specific CSS/JavaScript lives under `assets/*/pages` to keep individual pages maintainable.\n- User preferences may be stored in `localStorage`.\n- Most processing is local in the browser. Some tools intentionally request third-party data/services (for example stock-market data and optional analysis services), so those features depend on external availability and privacy policies.\n\n## Development and deployment\n\nGitHub Pages serves the `main` branch from the repository root using the custom domain in `CNAME`. There is no build step. Changes should pass the Modernization Audit workflow before merging.\n\n## Quality goals\n\n- Responsive from small phones through desktop.\n- Keyboard-visible focus and browser zoom support.\n- Clear labels and status feedback for interactive controls.\n- No secrets or credentials in client-side code.\n- Third-party dependencies kept explicit and limited.\n\n## Data files\n\n`loan/Loan.csv` and `loan/Loan.xlsx` are source/reference analysis files for the loan calculator. They are not runtime dependencies of the page.\n\n## License\n\nSee repository licensing information before reuse or redistribution.\n'''
    write(ROOT/'README.md',readme)

def main():
    write(ROOT/'assets/css/platform.css',PLATFORM_CSS)
    write(ROOT/'assets/js/platform.js',PLATFORM_JS)
    write(ROOT/'assets/css/pages/home.css',HOME_CSS)
    write(ROOT/'assets/js/pages/home.js',HOME_JS)
    write(ROOT/'index.html',HOME_HTML)
    for p in PAGES: modernize_page(p)
    write_404(); update_readme()
    print('Modernization applied to homepage and', len(PAGES), 'tool pages.')

if __name__=='__main__': main()
