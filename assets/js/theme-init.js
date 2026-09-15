(() => {
  'use strict';
  try {
    const t = localStorage.getItem('tools-theme') || localStorage.getItem('tools_theme');
    const l = localStorage.getItem('tools-language') || localStorage.getItem('tools_lang') || localStorage.getItem('offer_lang');
    document.documentElement.dataset.theme = t === 'light' || t === 'dark'
      ? t
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    if (l === 'ar' || l === 'en') {
      document.documentElement.lang = l;
      document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    }
  } catch (_) {}
})();
