(() => {
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
