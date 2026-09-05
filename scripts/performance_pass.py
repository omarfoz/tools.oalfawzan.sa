from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
TOOL_PAGES = [
    Path('json-formatter/index.html'),
    Path('loan-calculator/index.html'),
    Path('offer/index.html'),
    Path('qr-generator/index.html'),
    Path('stock-analysis-dashboard/index.html'),
    Path('time/index.html'),
    Path('wheel-of-names/index.html'),
]

THEME_INIT = """<script>try{const t=localStorage.getItem('tools-theme')||localStorage.getItem('tools_theme');const l=localStorage.getItem('tools-language')||localStorage.getItem('tools_lang')||localStorage.getItem('offer_lang');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;if(l==='ar'||l==='en'){document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr'}}catch(e){}</script>"""

BASE_SHARED_CSS = [
    '/assets/css/platform.css',
    '/assets/css/home-parity.css',
    '/assets/css/design-system.css',
    '/assets/css/design-taste.css',
]

LEAN_PLATFORM = r"""(() => {
  'use strict';
  const API = {};
  const THEME_KEY='tools-theme', LANG_KEY='tools-language', LEGACY_THEME='tools_theme', LEGACY_LANG='tools_lang', OFFER_LANG='offer_lang';
  const ICONS={sun:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.41M17.66 6.34l1.41-1.41"/></svg>',moon:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z"/></svg>'};
  const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
  const validTheme=v=>v==='light'||v==='dark';
  const validLang=v=>v==='ar'||v==='en';
  API.getTheme=()=>{const a=localStorage.getItem(THEME_KEY),b=localStorage.getItem(LEGACY_THEME);return validTheme(a)?a:(validTheme(b)?b:(matchMedia?.('(prefers-color-scheme: light)').matches?'light':'dark'))};
  API.getLanguage=()=>{const a=localStorage.getItem(LANG_KEY),b=localStorage.getItem(LEGACY_LANG),c=localStorage.getItem(OFFER_LANG);return validLang(a)?a:(validLang(b)?b:(validLang(c)?c:(document.documentElement.lang==='en'?'en':'ar')))};
  API.applyTheme=(theme,persist=true)=>{theme=validTheme(theme)?theme:'dark';document.documentElement.dataset.theme=theme;const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=theme==='light'?'#f8fafc':'#09090b';if(persist){localStorage.setItem(THEME_KEY,theme);localStorage.setItem(LEGACY_THEME,theme)}document.querySelectorAll('[data-platform-theme]').forEach(b=>{b.innerHTML=theme==='light'?ICONS.moon:ICONS.sun;b.setAttribute('aria-label',theme==='light'?'Dark mode':'Light mode')});window.dispatchEvent(new CustomEvent('tools:themechange',{detail:{theme}}));return theme};
  API.applyLanguage=(lang,persist=true)=>{lang=validLang(lang)?lang:'ar';document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';if(persist){localStorage.setItem(LANG_KEY,lang);localStorage.setItem(LEGACY_LANG,lang);localStorage.setItem(OFFER_LANG,lang)}document.querySelectorAll('[data-platform-language]').forEach(b=>{b.textContent=lang==='ar'?'EN':'ع';b.setAttribute('aria-label',lang==='ar'?'Switch to English':'التبديل إلى العربية')});window.dispatchEvent(new CustomEvent('tools:languagechange',{detail:{lang}}));return lang};
  API.notify=(message,tone='info',timeout=2400)=>{if(!message)return;let region=document.querySelector('.platform-toast-region');if(!region){region=document.createElement('div');region.className='platform-toast-region';region.setAttribute('aria-live','polite');document.body.append(region)}const toast=document.createElement('div');toast.className='platform-toast';toast.dataset.tone=tone;toast.textContent=String(message);region.append(toast);setTimeout(()=>toast.remove(),timeout)};
  API.setBusy=(el,busy=true)=>{if(!el)return;el.setAttribute('aria-busy',String(Boolean(busy)));if('disabled' in el)el.disabled=Boolean(busy)};
  API.downloadText=(text,filename,type='text/plain;charset=utf-8')=>{const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)};
  API.copyText=async text=>{if(!navigator.clipboard?.writeText)throw new Error('Clipboard API unavailable');await navigator.clipboard.writeText(String(text??''));API.notify(document.documentElement.lang==='ar'?'تم النسخ':'Copied','success')};
  window.ToolsPlatform=API;
  API.applyTheme(API.getTheme(),false);
  ready(()=>{
    const langButtons=[...document.querySelectorAll('[data-platform-language]')];
    const themeButtons=[...document.querySelectorAll('[data-platform-theme]')];
    if(langButtons.length) API.applyLanguage(API.getLanguage(),false);
    themeButtons.forEach(b=>b.addEventListener('click',()=>API.applyTheme(document.documentElement.dataset.theme==='light'?'dark':'light')));
    langButtons.forEach(b=>b.addEventListener('click',()=>API.applyLanguage(document.documentElement.lang==='ar'?'en':'ar')));
    document.querySelectorAll('a[target="_blank"]').forEach(a=>{const rel=new Set((a.rel||'').split(/\s+/).filter(Boolean));rel.add('noopener');rel.add('noreferrer');a.rel=[...rel].join(' ')});
    document.querySelectorAll('button:not([type])').forEach(b=>b.type='button');
    document.querySelectorAll('input,select,textarea').forEach(el=>{if(el.matches('[type="hidden"],[type="submit"],[type="button"],[type="reset"]')||el.labels?.length||el.hasAttribute('aria-label')||el.hasAttribute('aria-labelledby'))return;const hint=el.getAttribute('placeholder')||el.getAttribute('name')||el.id;if(hint)el.setAttribute('aria-label',hint)});
  });
})();
"""


def remove_google_fonts(html: str) -> str:
    html = re.sub(r'\s*<link\s+rel=["\']preconnect["\']\s+href=["\']https://fonts\.googleapis\.com["\']\s*/?>', '', html, flags=re.I)
    html = re.sub(r'\s*<link\s+href=["\']https://fonts\.googleapis\.com/[^"\']+["\']\s+rel=["\']stylesheet["\']\s*/?>', '', html, flags=re.I)
    return html


def add_body_class(html: str) -> str:
    m = re.search(r'<body([^>]*)>', html, flags=re.I)
    if not m:
        return html
    attrs = m.group(1)
    cm = re.search(r'class=["\']([^"\']*)["\']', attrs, flags=re.I)
    if cm:
        classes = cm.group(1).split()
        if 'tool-page' not in classes:
            classes.append('tool-page')
        attrs = attrs[:cm.start()] + f'class="{" ".join(classes)}"' + attrs[cm.end():]
    else:
        attrs = ' class="tool-page"' + attrs
    return html[:m.start()] + '<body' + attrs + '>' + html[m.end():]


def add_main_target(html: str) -> str:
    if 'id="main-content"' in html or "id='main-content'" in html:
        return html
    return re.sub(r'<div class=["\'](wrap|container|app)["\']>', r'<div class="\1" id="main-content" role="main">', html, count=1, flags=re.I)


def make_legacy_header_static(html: str) -> str:
    html = re.sub(r'<header(?![^>]*class=)>', '<header class="site-header tool-site-header">', html, count=1, flags=re.I)
    brand = '<a href="/" class="brand" aria-label="tools.oalfawzan.sa home"><span class="brand-mark" aria-hidden="true">OF</span><span class="brand-text"><strong>tools.</strong>oalfawzan.sa</span></a>'
    html = re.sub(r'<a href=["\'](?:/|https://tools\.oalfawzan\.sa)["\'] class=["\']logo["\']>tools\.<span>oalfawzan\.sa</span></a>', brand, html, count=1, flags=re.I)
    return html


def static_loan_header(html: str) -> str:
    m = re.search(r'<header>(.*?)</header>', html, flags=re.I | re.S)
    if not m:
        return html
    hero = m.group(1)
    shared = '''<header class="site-header tool-site-header"><a href="/" class="brand" aria-label="tools.oalfawzan.sa home"><span class="brand-mark" aria-hidden="true">OF</span><span class="brand-text"><strong>tools.</strong>oalfawzan.sa</span></a><div class="header-actions"><button class="icon-btn platform-control" data-platform-language type="button">EN</button><button class="icon-btn platform-control" data-platform-theme type="button" aria-label="تبديل المظهر">☀️</button></div></header>\n    <section class="tool-hero">''' + hero + '</section>'
    return html[:m.start()] + shared + html[m.end():]


def add_shared_css(html: str, rel: Path) -> str:
    shared = list(BASE_SHARED_CSS)
    if rel.as_posix() == 'offer/index.html':
        shared.insert(2, '/assets/css/offer-mobile.css')
    for href in shared:
        html = re.sub(rf'\s*<link[^>]+href=["\']{re.escape(href)}(?:\?[^"\']*)?["\'][^>]*>', '', html, flags=re.I)
    block = '\n'.join(f'<link rel="stylesheet" href="{href}">' for href in shared)
    return html.replace('</head>', block + '\n</head>', 1)


def add_theme_init(html: str) -> str:
    if "const t=localStorage.getItem('tools-theme')" in html:
        return html
    return html.replace('</title>', '</title>\n' + THEME_INIT, 1) if '</title>' in html else html.replace('</head>', THEME_INIT + '\n</head>', 1)


def defer_external_scripts(html: str) -> str:
    return re.sub(r'<script(?![^>]*\bdefer\b)([^>]*\bsrc=["\'][^"\']+["\'][^>]*)>', r'<script defer\1>', html, flags=re.I)


def offer_riyal(html: str) -> str:
    if '/assets/js/pages/offer-riyal.js' in html:
        return html
    marker = '<script defer src="/assets/js/platform.js"></script>'
    extra = '<script defer src="/assets/js/pages/offer-riyal.js?v=20260823a"></script>'
    if marker in html:
        return html.replace(marker, marker + '\n' + extra, 1)
    return html.replace('</body>', extra + '\n</body>', 1)


def transform_page(rel: Path) -> None:
    path = ROOT / rel
    html = path.read_text(encoding='utf-8')
    html = remove_google_fonts(html)
    html = add_theme_init(html)
    html = add_body_class(html)
    html = add_main_target(html)
    if rel.as_posix() == 'loan-calculator/index.html':
        html = static_loan_header(html)
    else:
        html = make_legacy_header_static(html)
    if rel.as_posix() == 'stock-analysis-dashboard/index.html':
        html = html.replace(' data-platform-language', '').replace(' data-platform-theme', '')
    html = add_shared_css(html, rel)
    html = defer_external_scripts(html)
    if rel.as_posix() == 'offer/index.html':
        html = offer_riyal(html)
    path.write_text(html, encoding='utf-8')


for rel in TOOL_PAGES:
    transform_page(rel)

# 404 is intentionally tiny: keep CSS, remove the shared JS runtime.
not_found = ROOT / '404.html'
html = not_found.read_text(encoding='utf-8')
html = re.sub(r'<script[^>]+src=["\']/assets/js/platform\.js["\'][^>]*></script>', '', html, flags=re.I)
not_found.write_text(html, encoding='utf-8')

(ROOT / 'assets/js/platform.js').write_text(LEAN_PLATFORM, encoding='utf-8')

print('Performance pass updated:', *(str(p) for p in TOOL_PAGES), '404.html', 'assets/js/platform.js', sep='\n- ')
