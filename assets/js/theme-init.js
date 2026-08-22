(() => {
  'use strict';
  try {
    const theme = localStorage.getItem('tools-theme');
    const lang = localStorage.getItem('tools-language');
    document.documentElement.dataset.theme = theme === 'light' || theme === 'dark'
      ? theme
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    if (lang === 'ar' || lang === 'en') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  } catch (_) {}
})();
