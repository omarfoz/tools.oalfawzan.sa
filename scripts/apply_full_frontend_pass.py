#!/usr/bin/env python3
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]

def read(p): return (ROOT/p).read_text(encoding='utf-8')
def write(p,s): (ROOT/p).write_text(s,encoding='utf-8')
def append_once(p,marker,content):
    s=read(p)
    if marker not in s: write(p,s.rstrip()+"\n\n"+content.strip()+"\n")

def replace(p,old,new):
    s=read(p)
    if old in s: write(p,s.replace(old,new))

# Remove source-level emoji used as interface chrome. Platform JS renders SVGs at runtime.
html_pages=['json-formatter/index.html','qr-generator/index.html','wheel-of-names/index.html','time/index.html','stock-analysis-dashboard/index.html','offer/index.html']
for p in html_pages:
    s=read(p)
    s=s.replace('>☀️</button>',' aria-label="Toggle theme"></button>')
    # Offer-only interface glyphs; keep normal prose untouched.
    if p=='offer/index.html':
        s=s.replace('<span class="mode-icon">⚡</span>','<span class="mode-icon" aria-hidden="true"></span>')
        s=s.replace('<span class="mode-icon">📊</span>','<span class="mode-icon" aria-hidden="true"></span>')
        s=s.replace('>🇸🇦 <span','><span')
        s=s.replace('>🌍 <span','><span')
        s=s.replace('>⬇ Export Excel<','>Export Excel<').replace('>⬇ Excel<','>Excel<')
        s=s.replace('<div class="ai-icon">✦</div>','<div class="ai-icon" aria-hidden="true"></div>')
        s=s.replace('>⋯</button>',' aria-label="More options"></button>')
        s=s.replace('>↺ Reset</button>','>Reset</button>')
    write(p,s)

# Page JS theme strings should not reinsert emoji; shared platform observer supplies SVGs.
for p in ['assets/js/pages/json-formatter.js','assets/js/pages/qr-generator.js','assets/js/pages/wheel-of-names.js','assets/js/pages/time.js','assets/js/pages/stock-analysis-dashboard.js']:
    s=read(p).replace("themeDark:'🌙'","themeDark:''").replace("themeLight:'☀️'","themeLight:''").replace("themeDark: '🌙'","themeDark: ''").replace("themeLight: '☀️'","themeLight: ''")
    write(p,s)

# Avoid known browser CORS noise: direct Yahoo requests cannot succeed cross-origin.
p='assets/js/pages/stock-analysis-dashboard.js'
s=read(p)
s=s.replace("const YAHOO_PROXIES = [\n  (url) => url,\n  (url) => `https://r.jina.ai/http://${url.replace(/^https?:\\/\\//,'')}`,\n  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`\n];", "const YAHOO_PROXIES = [\n  (url) => `https://r.jina.ai/http://${url.replace(/^https?:\\/\\//,'')}`,\n  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`\n];")
write(p,s)

# Wheel: empty interaction needs directional feedback, not silence.
p='assets/js/pages/wheel-of-names.js'; s=read(p)
s=s.replace("winner:'الاسم المختار: ',themeDark", "winner:'الاسم المختار: ',empty:'أدخل اسمًا واحدًا على الأقل قبل لف العجلة.',themeDark")
s=s.replace("winner:'Selected name: ',themeDark", "winner:'Selected name: ',empty:'Add at least one name before spinning the wheel.',themeDark")
s=s.replace("if(names.length<1){resultText.textContent=''; return}", "if(names.length<1){resultText.textContent=STRINGS[currentLang].empty;resultText.setAttribute('role','alert');namesInput.focus();return}")
s=s.replace("resultText.textContent=STRINGS[currentLang].winner+names[idx];", "resultText.removeAttribute('role');resultText.textContent=STRINGS[currentLang].winner+names[idx];")
write(p,s)

# Offer: dynamically generated field controls need programmatic names and 44px hit areas.
p='assets/js/pages/offer.js'
offer_a11y=r'''

/* FULL_FRONTEND_PASS: accessibility for dynamically rendered comparison fields. */
(() => {
  const applyDynamicA11y = () => {
    document.querySelectorAll('.field-row').forEach((row, index) => {
      const nameInput=row.querySelector('.field-name-input');
      const label=(nameInput?.value || nameInput?.getAttribute('value') || `Field ${index+1}`).trim();
      if(nameInput) nameInput.setAttribute('aria-label', `Field name: ${label}`);
      const amount=row.querySelector('.amount-input');
      if(amount) amount.setAttribute('aria-label', `Amount for ${label}`);
      const toggle=row.querySelector('.toggle');
      if(toggle) toggle.setAttribute('aria-label', `Include ${label}`);
      const type=row.querySelector('.type-btn');
      if(type) type.setAttribute('aria-label', `Change field type for ${label}`);
      const del=row.querySelector('.del-btn');
      if(del) del.setAttribute('aria-label', `Delete ${label}`);
    });
    document.querySelectorAll('.factor-row').forEach((row,index)=>{
      const name=row.querySelector('input[type="text"]');
      const label=(name?.value||`Factor ${index+1}`).trim();
      row.querySelectorAll('input,select,button').forEach((el,i)=>{if(!el.labels?.length&&!el.getAttribute('aria-label'))el.setAttribute('aria-label',`${label} control ${i+1}`)});
    });
  };
  applyDynamicA11y();
  new MutationObserver(applyDynamicA11y).observe(document.body,{childList:true,subtree:true});
})();
'''
append_once(p,'FULL_FRONTEND_PASS: accessibility for dynamically rendered',offer_a11y)
# Remove the delete emoji-like glyph in generated controls; CSS supplies an SVG mask.
s=read(p).replace('✕','')
write(p,s)

# Loan: typography, copy, and shared product identity.
p='loan-calculator/index.html'; s=read(p)
if 'fonts.googleapis.com/css2?family=IBM+Plex+Sans' not in s:
    s=s.replace('<title>مقارن القروض الشامل - Comprehensive Loan Comparator</title>', '<title>مقارن القروض الشامل - Comprehensive Loan Comparator</title>\n    <link rel="preconnect" href="https://fonts.googleapis.com">\n    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800&display=swap" rel="stylesheet">')
s=s.replace('أدخل البيانات والاضغط "حساب شامل" لعرض النتائج','أدخل البيانات واضغط «حساب شامل» لعرض النتائج')
write(p,s)

# Homepage: remove decorative index markers that did not encode useful sequence.
p='index.html'; s=read(p)
s=re.sub(r'<span class="stat-index">\d+</span>','',s)
s=re.sub(r'<span class="section-index">.*?</span>','',s)
s=re.sub(r'<span class="tool-index">\d+</span>','',s)
write(p,s)

# 404 gets the same restrained product shell.
write('404.html','''<!doctype html>
<html lang="ar" dir="rtl" data-theme="dark">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><meta name="theme-color" content="#0d1522">
<link rel="icon" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="/assets/css/platform.css"><link rel="stylesheet" href="/assets/css/pages/404.css"><title>الصفحة غير موجودة — tools.oalfawzan.sa</title>
</head><body><main class="error-shell" id="main-content"><a class="platform-brand" href="/"><span class="platform-brand-mark" aria-hidden="true">OF</span><span>tools.oalfawzan.sa</span></a><div class="error-code">404 / NOT FOUND</div><h1>الصفحة غير موجودة</h1><p>الرابط الذي فتحته غير موجود أو تم نقله. ارجع إلى دليل الأدوات واختر الأداة المطلوبة.</p><a class="error-back" href="/">العودة إلى جميع الأدوات <span aria-hidden="true">←</span></a></main><script src="/assets/js/platform.js"></script></body></html>''')

# Shared overrides driven by screenshot/a11y findings.
append_once('assets/css/platform.css','FULL_FRONTEND_PASS_OVERRIDES',r'''
/* FULL_FRONTEND_PASS_OVERRIDES */
.skip-link{min-height:44px;display:inline-flex;align-items:center}
html[data-tool-page]:not([data-tool-page="home"]) .logo,
html[data-tool-page]:not([data-tool-page="home"]) footer a{min-height:44px;display:inline-flex;align-items:center}
.lang-btn,.btn-ghost,.control-btn{min-height:44px!important}
html[data-tool-page="home"] .icon-btn,
html[data-tool-page="home"] .link-btn,
html[data-tool-page="home"] .filter{min-height:44px!important}
html[data-tool-page="home"] .site-footer a{display:inline-flex;align-items:center;min-height:44px}
html[data-tool-page="home"] .stat{grid-template-columns:1fr auto!important}
html[data-tool-page="home"] .tool-top{justify-content:flex-end!important}

/* Offer: actual 44px hit areas and accessible icon controls. */
html[data-tool-page="offer"] .field-name-input,
html[data-tool-page="offer"] .amount-input{min-height:44px!important}
html[data-tool-page="offer"] .type-btn,
html[data-tool-page="offer"] .del-btn{min-width:44px!important;min-height:44px!important}
html[data-tool-page="offer"] .toggle{width:44px!important;height:44px!important;background:transparent!important;border-radius:0!important;position:relative}
html[data-tool-page="offer"] .toggle::before{content:"";position:absolute;width:32px;height:18px;border-radius:9px;background:var(--border2);inset:13px 6px;transition:background .2s}
html[data-tool-page="offer"] .toggle::after{top:16px!important;left:9px!important}
html[data-tool-page="offer"] .toggle.on::before{background:var(--current)}
html[data-tool-page="offer"] .toggle.on-new::before{background:var(--new)}
html[data-tool-page="offer"] .del-btn::before{content:"";width:16px;height:16px;background:currentColor;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M5 5l14 14M19 5 5 19' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") center/contain no-repeat;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M5 5l14 14M19 5 5 19' stroke='black' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") center/contain no-repeat}
html[data-tool-page="offer"] .popup-overlay{padding:16px}
html[data-tool-page="offer"] .popup{max-height:min(760px,calc(100dvh - 32px));overflow:auto}

/* Time: phone layout is a sequential toolkit, not two squeezed desktop columns. */
@media(max-width:700px){html[data-tool-page="time"] .grid{grid-template-columns:1fr!important}html[data-tool-page="time"] .panel{padding:14px!important}}

/* Stock: compact utility header; primary search actions may remain full-width on phone. */
@media(max-width:600px){html[data-tool-page="stock-analysis-dashboard"] .top-actions{display:grid!important;grid-template-columns:44px 44px 1fr!important;align-items:center}html[data-tool-page="stock-analysis-dashboard"] .top-actions .control-btn{width:44px!important;min-width:44px!important}html[data-tool-page="stock-analysis-dashboard"] .top-actions .logo{width:auto!important;justify-self:end;min-height:44px;display:inline-flex;align-items:center}html[data-tool-page="stock-analysis-dashboard"] .chart-wrap{height:340px!important}}

/* Loan form density and table readability. */
html[data-tool-page="loan-calculator"] input,html[data-tool-page="loan-calculator"] select{min-height:46px}
html[data-tool-page="loan-calculator"] .comparison-table th,html[data-tool-page="loan-calculator"] .comparison-table td{min-width:130px}
@media(max-width:768px){html[data-tool-page="loan-calculator"] .summary-cards{grid-template-columns:1fr 1fr!important;gap:10px!important}html[data-tool-page="loan-calculator"] .summary-card{padding:14px!important}}
@media(max-width:430px){html[data-tool-page="loan-calculator"] .summary-cards{grid-template-columns:1fr!important}}
''')

# Homepage page stylesheet adjustments after removing indices.
append_once('assets/css/pages/home.css','FULL_FRONTEND_PASS_HOME',r'''
/* FULL_FRONTEND_PASS_HOME */
.stat{grid-template-columns:1fr auto}.tool-top{justify-content:flex-end}.tool-card{min-height:232px}.tool-card h3{margin-top:20px}
''')

# Dedicated 404 stylesheet.
css404=ROOT/'assets/css/pages/404.css'; css404.parent.mkdir(parents=True,exist_ok=True)
css404.write_text('''*{box-sizing:border-box}body{margin:0;min-height:100dvh;display:grid;place-items:center;padding:24px;background:var(--ds-bg);color:var(--ds-text);font-family:\'IBM Plex Sans\',system-ui,sans-serif}html[lang="ar"] body{font-family:\'IBM Plex Sans Arabic\',\'IBM Plex Sans\',system-ui,sans-serif}.error-shell{width:min(680px,100%);border-top:1px solid var(--ds-border);border-bottom:1px solid var(--ds-border);padding:28px 0 32px}.error-code{margin-top:64px;color:var(--ds-primary);font:700 .72rem/1.2 \'IBM Plex Sans\',sans-serif;letter-spacing:.12em}.error-shell h1{font-size:clamp(2.25rem,8vw,4.75rem);line-height:1;margin:14px 0 18px;letter-spacing:-.05em}.error-shell p{max-width:540px;color:var(--ds-muted);font-size:1rem;line-height:1.8;margin:0}.error-back{display:inline-flex;align-items:center;gap:8px;min-height:44px;margin-top:28px;color:#fff;background:var(--ds-primary);padding:0 16px;border-radius:var(--ds-radius-sm);text-decoration:none;font-weight:700}@media(max-width:520px){body{padding:18px}.error-code{margin-top:44px}}''',encoding='utf-8')

# Audit any remaining UI emoji candidates so CI logs make them visible.
emoji=re.compile(r'[☀🌙⚡📊🌍🇸🇦⬇✅❌⚙📁📤🔍🚀💾📋]')
remaining=[]
for p in ROOT.rglob('*'):
    if p.suffix.lower() not in {'.html','.js','.css'} or '.git' in p.parts: continue
    text=p.read_text(encoding='utf-8',errors='ignore')
    if emoji.search(text): remaining.append(str(p.relative_to(ROOT)))
print('Frontend pass applied. Remaining UI-emoji candidate files:',remaining)
