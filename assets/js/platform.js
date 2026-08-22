(() => {
  'use strict';
  const API = {};
  const ready = (fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, {once:true}) : fn();

  const svg = (body, viewBox='0 0 24 24') => `<svg class="platform-icon" viewBox="${viewBox}" aria-hidden="true" focusable="false">${body}</svg>`;
  const ICONS = {
    sun: svg('<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"></path>'),
    moon: svg('<path d="M20.5 14.1A8.5 8.5 0 0 1 9.9 3.5 8.5 8.5 0 1 0 20.5 14.1Z"></path>'),
    scale: svg('<path d="M12 3v18M6 6h12M5 6l-3 6h6L5 6Zm14 0-3 6h6l-3-6ZM8 21h8"></path>'),
    bank: svg('<path d="m3 10 9-6 9 6M4 10h16M5 10v8M9 10v8M15 10v8M19 10v8M3 18h18M2 21h20"></path>'),
    clock: svg('<circle cx="12" cy="13" r="8"></circle><path d="M12 9v5l3 2M9 2h6M12 2v3"></path>'),
    wheel: svg('<circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="2"></circle><path d="M12 4v6M20 12h-6M12 20v-6M4 12h6M6.3 6.3l4.2 4.2M17.7 6.3l-4.2 4.2M17.7 17.7l-4.2-4.2M6.3 17.7l4.2-4.2"></path>'),
    code: svg('<path d="M8 3H6a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h2M16 3h2a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-2"></path>'),
    qr: svg('<rect x="3" y="3" width="6" height="6" rx="1"></rect><rect x="15" y="3" width="6" height="6" rx="1"></rect><rect x="3" y="15" width="6" height="6" rx="1"></rect><path d="M15 15h2v2h-2zM19 15h2v4h-2zM15 19h4v2h-4zM11 3v4M11 11h4M11 15v6M15 11h6M21 11v2"></path>'),
    chart: svg('<path d="M4 19V9M10 19V5M16 19v-7M22 19V3M2 19h22"></path>'),
    bolt: svg('<path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"></path>'),
    globe: svg('<circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"></path>'),
    download: svg('<path d="M12 3v12M7 10l5 5 5-5M4 21h16"></path>'),
    reset: svg('<path d="M4 4v6h6M5.5 15a8 8 0 1 0 .7-7.7L4 10"></path>'),
    more: svg('<circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle>'),
    flagSaudi: svg('<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M8 10h8M9 14h6"></path>'),
  };

  API.icon = (name) => ICONS[name] || '';
  API.renderIcon = (element, name) => {
    if (!element || !ICONS[name]) return;
    element.innerHTML = ICONS[name];
  };
  API.getTheme = () => localStorage.getItem('tools-theme') || localStorage.getItem('tools_theme') || 'dark';
  API.setTheme = (theme) => {
    const next = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('tools-theme', next);
    localStorage.setItem('tools_theme', next);
    document.querySelectorAll('#themeBtn,[data-platform-theme-toggle]').forEach(btn => API.renderIcon(btn, next === 'light' ? 'moon' : 'sun'));
    return next;
  };
  API.getLanguage = (fallback='ar') => localStorage.getItem('tools-language') || localStorage.getItem('tools_lang') || fallback;
  API.setLanguagePreference = (lang) => {
    localStorage.setItem('tools-language', lang);
    localStorage.setItem('tools_lang', lang);
  };

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
    document.querySelectorAll('[data-icon]').forEach(el => API.renderIcon(el, el.dataset.icon));
    document.querySelectorAll('#themeBtn,[data-platform-theme-toggle]').forEach(btn => API.renderIcon(btn, API.getTheme() === 'light' ? 'moon' : 'sun'));
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
