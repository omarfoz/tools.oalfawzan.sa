(() => {
  'use strict';
  const API = {};
  const ready = (fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, {once:true}) : fn();

  const ICONS = {
    sun:'<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></svg>',
    moon:'<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z"/></svg>',
    bolt:'<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"/></svg>',
    chart:'<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19V9M10 19V5M16 19v-7M22 19V3"/></svg>',
    user:'<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 21c.7-4 3-6 7-6s6.3 2 7 6"/></svg>',
    globe:'<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.5 3.5 5.5 3.5 9S14.4 18.5 12 21M12 3C9.6 5.5 8.5 8.5 8.5 12S9.6 18.5 12 21"/></svg>',
    download:'<svg class="ui-icon ui-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/></svg>',
    more:'<svg class="ui-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>',
    reset:'<svg class="ui-icon ui-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4v6h6M5.5 16.5A8 8 0 1 0 6 7"/></svg>',
    spark:'<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 1.5 4.3L18 9l-4.5 1.7L12 15l-1.5-4.3L6 9l4.5-1.7L12 3ZM19 15l.7 2.1L22 18l-2.3.9L19 21l-.7-2.1L16 18l2.3-.9L19 15Z"/></svg>'
  };
  API.icon = (name) => ICONS[name] || '';
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

  // Keep old and new preference keys synchronized while pages migrate gradually.
  try {
    const nativeSet = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      nativeSet.call(this, key, value);
      if (this !== localStorage) return;
      const pair = {'tools-theme':'tools_theme','tools_theme':'tools-theme','tools-language':'tools_lang','tools_lang':'tools-language'}[key];
      if (pair && localStorage.getItem(pair) !== String(value)) nativeSet.call(this, pair, value);
    };
    [['tools-theme','tools_theme'],['tools-language','tools_lang']].forEach(([a,b]) => {
      const v = localStorage.getItem(a) ?? localStorage.getItem(b);
      if (v != null) { nativeSet.call(localStorage,a,v); nativeSet.call(localStorage,b,v); }
    });
  } catch (_) {}

  function pageSlug() {
    const p = location.pathname.replace(/^\/+|\/+$/g,'');
    if (!p) return 'home';
    if (p === '404.html') return '404';
    return p.split('/')[0];
  }

  function renderThemeButton() {
    const btn = document.getElementById('themeBtn');
    if (!btn) return;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const label = document.documentElement.lang === 'ar' ? (isLight ? 'استخدام المظهر الداكن' : 'استخدام المظهر الفاتح') : (isLight ? 'Use dark theme' : 'Use light theme');
    btn.innerHTML = isLight ? ICONS.moon : ICONS.sun;
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
    btn.classList.add('icon-only');
  }

  let normalizing = false;
  function normalizeKnownIcons() {
    if (normalizing) return;
    normalizing = true;
    try {
      renderThemeButton();
      if (pageSlug() === 'offer') {
        const simple = document.querySelector('#modeSimpleBtn .mode-icon'); if (simple) simple.innerHTML = ICONS.bolt;
        const detailed = document.querySelector('#modeDetailedBtn .mode-icon'); if (detailed) detailed.innerHTML = ICONS.chart;
        [['#natA_saudi','user'],['#natB_saudi','user'],['#natA_nonsaudi','globe'],['#natB_nonsaudi','globe']].forEach(([sel,name]) => {
          const el=document.querySelector(sel); if(!el) return;
          [...el.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).forEach(n=>n.textContent=n.textContent.replace(/[\p{Extended_Pictographic}\u2600-\u27BF]/gu,'').trimStart());
          if(!el.querySelector('svg')) el.insertAdjacentHTML('afterbegin', ICONS[name]);
        });
        document.querySelectorAll('#exportBtn,.sticky-compare .export-btn').forEach(btn => {
          const span=btn.querySelector('span'); if(span) span.textContent=span.textContent.replace(/^\s*[⬇↓]\s*/u,'');
          if(!btn.querySelector('svg')) btn.insertAdjacentHTML('afterbegin',ICONS.download);
          btn.style.gap='6px';
        });
        const menu=document.getElementById('menuBtn'); if(menu){menu.innerHTML=ICONS.more;menu.classList.add('icon-only');menu.setAttribute('aria-label',document.documentElement.lang==='ar'?'المزيد':'More options');}
        const reset=document.getElementById('btnReset'); if(reset){reset.textContent=reset.textContent.replace(/^\s*[↺⟳]\s*/u,'');if(!reset.querySelector('svg'))reset.insertAdjacentHTML('afterbegin',ICONS.reset);reset.style.gap='6px';}
        const ai=document.querySelector('.ai-icon'); if(ai) ai.innerHTML=ICONS.spark;
      }
    } finally { normalizing = false; }
  }

  function setupOfferDialog() {
    const overlay=document.getElementById('popupOverlay'); const dialog=overlay?.querySelector('.popup');
    if(!overlay||!dialog) return;
    dialog.setAttribute('role','dialog'); dialog.setAttribute('aria-modal','true');
    dialog.setAttribute('aria-labelledby','popupTitle');
    const focusables=()=>[...dialog.querySelectorAll('button,input,select,textarea,[href],[tabindex]:not([tabindex="-1"])')].filter(el=>!el.disabled&&getComputedStyle(el).display!=='none');
    document.addEventListener('keydown',(e)=>{
      if(getComputedStyle(overlay).display==='none'||getComputedStyle(overlay).visibility==='hidden') return;
      if(e.key==='Escape'&&typeof window.closePopup==='function'){e.preventDefault();window.closePopup();return;}
      if(e.key!=='Tab') return;
      const list=focusables(); if(!list.length)return; const first=list[0],last=list.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    });
  }

  function injectLoanToolbar() {
    if(pageSlug()!=='loan-calculator'||document.querySelector('.platform-toolbar')) return;
    const container=document.querySelector('.container'); if(!container) return;
    const bar=document.createElement('nav'); bar.className='platform-toolbar'; bar.setAttribute('aria-label','Tool navigation');
    bar.innerHTML='<a class="platform-brand" href="/"><span class="platform-brand-mark" aria-hidden="true">OF</span><span>tools.oalfawzan.sa</span></a><a class="platform-back" href="/">'+(document.documentElement.lang==='ar'?'العودة إلى جميع الأدوات':'Back to all tools')+' <span aria-hidden="true">←</span></a>';
    container.prepend(bar);
  }

  ready(() => {
    document.documentElement.dataset.toolPage = pageSlug();
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
    injectLoanToolbar(); setupOfferDialog(); normalizeKnownIcons();
    // Existing pages update theme labels with text; normalize those mutations back to SVG.
    const observer=new MutationObserver(()=>queueMicrotask(normalizeKnownIcons));
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
    window.alert=(message)=>API.notify(message,'warning',4200);
  });
})();
