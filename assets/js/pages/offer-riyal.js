(() => {
  'use strict';
  const RIYAL = '⃁';
  const replaceCurrencyText = value => String(value ?? '')
    .replace(/\bSAR\b/g, RIYAL)
    .replace(/ر\.س/g, RIYAL)
    .replace(/ريال سعودي/g, RIYAL)
    .replace(/ريال/g, RIYAL);

  const normalizeNode = node => {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const next = replaceCurrencyText(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches('script,style,textarea,input,select,option')) return;
    node.childNodes.forEach(normalizeNode);
    ['title','aria-label','placeholder'].forEach(attr => {
      if (!node.hasAttribute?.(attr)) return;
      const current = node.getAttribute(attr);
      const next = replaceCurrencyText(current);
      if (next !== current) node.setAttribute(attr, next);
    });
  };

  const apply = () => normalizeNode(document.body);
  let scheduled = false;
  const scheduleApply = () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => { scheduled = false; apply(); });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once:true });
  else apply();

  new MutationObserver(scheduleApply).observe(document.documentElement, {
    subtree:true,
    childList:true,
    characterData:true
  });

  window.addEventListener('tools:languagechange', scheduleApply);
  document.addEventListener('click', scheduleApply, true);
  document.addEventListener('change', scheduleApply, true);
})();