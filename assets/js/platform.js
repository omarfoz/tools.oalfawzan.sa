(() => {
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
