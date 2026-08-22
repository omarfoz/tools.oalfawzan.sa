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
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  API.copyText = async (text) => {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(String(text ?? ''));
    API.notify(document.documentElement.lang === 'ar' ? 'تم النسخ' : 'Copied', 'success');
  };

  const isHome = () => {
    const path = location.pathname.replace(/\/+$/, '') || '/';
    return path === '/' || path === '/index.html';
  };
  const isOffer = () => /^\/offer(?:\/|$)/.test(location.pathname);

  const brandMarkup = () => '<span class="brand-mark" aria-hidden="true">OF</span><span class="brand-text"><strong>tools.</strong>oalfawzan.sa</span>';

  const ensureHomeParityStyles = () => {
    if (isHome() || document.querySelector('link[data-home-parity]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/home-parity.css?v=20260822b';
    link.dataset.homeParity = 'true';
    document.head.append(link);
  };

  const ensureOfferMobileStyles = () => {
    if (!isOffer() || document.querySelector('link[data-offer-mobile]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/offer-mobile.css?v=20260822a';
    link.dataset.offerMobile = 'true';
    document.head.append(link);
  };

  const ensureEmojiSvgScript = () => {
    if (document.querySelector('script[data-emoji-svg]')) return;
    const script = document.createElement('script');
    script.src = '/assets/js/emoji-svg.js?v=20260822';
    script.defer = true;
    script.dataset.emojiSvg = 'true';
    document.head.append(script);
  };

  /* The Offer AI endpoint has returned several payload shapes over time
     (custom {text}, OpenAI/LiteLLM choices, {response}, {content}).
     Normalize only this endpoint so the legacy Offer code can keep reading data.text. */
  const normalizeAIProxyFetch = () => {
    if (window.__toolsAiFetchNormalized || typeof window.fetch !== 'function') return;
    window.__toolsAiFetchNormalized = true;
    const nativeFetch = window.fetch.bind(window);
    const getText = data => {
      if (!data || typeof data !== 'object') return '';
      const candidates = [
        data.text,
        data.response,
        data.content,
        data.output_text,
        data.message?.content,
        data.result?.text,
        data.result?.content,
        data.data?.text,
        data.data?.content,
        data.choices?.[0]?.message?.content,
        data.choices?.[0]?.text,
        data.output?.[0]?.content?.[0]?.text
      ];
      return candidates.find(v => typeof v === 'string' && v.trim() && v.trim().toLowerCase() !== 'no response')?.trim() || '';
    };
    window.fetch = async (...args) => {
      const res = await nativeFetch(...args);
      const target = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
      if (!target.includes('tools.niug502.workers.dev')) return res;
      try {
        const data = await res.clone().json();
        const normalized = getText(data);
        if (!normalized) return res;
        const current = typeof data?.text === 'string' ? data.text.trim().toLowerCase() : '';
        if (current && current !== 'no response') return res;
        const headers = new Headers(res.headers);
        headers.set('content-type', 'application/json; charset=utf-8');
        return new Response(JSON.stringify({...data, text: normalized}), {
          status: res.status,
          statusText: res.statusText,
          headers
        });
      } catch {
        return res;
      }
    };
  };

  const normalizeToolChrome = () => {
    if (isHome()) return;
    document.body.classList.add('tool-page');
    const shell = document.querySelector('.wrap, .container, .app, body > div');
    if (!shell) return;
    let header = shell.querySelector(':scope > header') || document.querySelector('header');
    if (!header) { header = document.createElement('header'); shell.prepend(header); }
    header.classList.add('site-header', 'tool-site-header');
    const legacyTitle = header.querySelector(':scope > h1');
    if (legacyTitle) {
      const hero = document.createElement('section');
      hero.className = 'tool-hero';
      const subtitle = header.querySelector(':scope > .subtitle, :scope > p');
      hero.append(legacyTitle);
      if (subtitle) hero.append(subtitle);
      header.after(hero);
    }
    let brand = header.querySelector('.brand');
    if (!brand) {
      const oldLogo = header.querySelector('.logo');
      if (oldLogo) {
        brand = oldLogo;
        brand.className = 'brand';
        brand.href = '/';
        brand.setAttribute('aria-label', 'tools.oalfawzan.sa home');
        brand.innerHTML = brandMarkup();
      } else {
        brand = document.createElement('a');
        brand.className = 'brand';
        brand.href = '/';
        brand.setAttribute('aria-label', 'tools.oalfawzan.sa home');
        brand.innerHTML = brandMarkup();
        header.prepend(brand);
      }
    } else if (!brand.querySelector('.brand-mark')) {
      brand.innerHTML = brandMarkup();
      brand.href = '/';
    }
    let actions = header.querySelector('.header-actions, .top-actions');
    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'header-actions';
      const allTools = document.createElement('a');
      allTools.className = 'link-btn';
      allTools.href = '/';
      allTools.textContent = document.documentElement.lang === 'ar' ? 'كل الأدوات' : 'All tools';
      const profile = document.createElement('a');
      profile.className = 'link-btn';
      profile.href = 'https://oalfawzan.sa';
      profile.textContent = document.documentElement.lang === 'ar' ? 'الملف الشخصي' : 'Profile';
      actions.append(allTools, profile);
      header.append(actions);
    } else actions.classList.add('header-actions');
  };

  window.ToolsPlatform = API;
  normalizeAIProxyFetch();
  ensureHomeParityStyles();
  ensureOfferMobileStyles();
  ensureEmojiSvgScript();

  ready(() => {
    normalizeToolChrome();
    if (!document.querySelector('.skip-link')) {
      const skip = document.createElement('a');
      skip.className = 'skip-link';
      skip.href = '#main-content';
      skip.textContent = document.documentElement.lang === 'ar' ? 'تجاوز إلى المحتوى' : 'Skip to content';
      document.body.prepend(skip);
    }
    let main = document.querySelector('main, [role="main"]');
    if (!main) {
      main = document.querySelector('.wrap, .container, .app, body > div');
      if (main) { main.id ||= 'main-content'; main.setAttribute('role','main'); }
    } else main.id ||= 'main-content';
    document.querySelectorAll('a[target="_blank"]').forEach(a => {
      const rel = new Set((a.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener'); rel.add('noreferrer'); a.setAttribute('rel', [...rel].join(' '));
    });
    document.querySelectorAll('button:not([type])').forEach(b => b.type='button');
    document.querySelectorAll('input,select,textarea').forEach(el => {
      if (el.matches('[type="hidden"],[type="submit"],[type="button"],[type="reset"]')) return;
      if (el.labels?.length || el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')) return;
      const hint = el.getAttribute('placeholder') || el.getAttribute('name') || el.id;
      if (hint) el.setAttribute('aria-label', hint);
    });
    document.querySelectorAll('table').forEach(table => {
      const p = table.parentElement;
      if (p && !p.classList.contains('platform-table-scroll')) p.classList.add('platform-table-scroll');
    });
  });
})();
