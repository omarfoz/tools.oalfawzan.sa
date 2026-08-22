(() => {
  'use strict';

  const EMOJI_RE = /(?:\p{Regional_Indicator}{2}|[#*0-9]\uFE0F?\u20E3|\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?(?:\p{Emoji_Modifier})?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?(?:\p{Emoji_Modifier})?)*)/gu;
  const SKIP = 'script,style,textarea,pre,code,.svg-emoji,[contenteditable="true"]';
  const iconStyle = 'display:inline-flex;width:1em;height:1em;vertical-align:-.14em;flex:0 0 auto;color:currentColor;line-height:1';

  const icons = {
    sun: '<circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.41M17.66 6.34l1.41-1.41"/>',
    moon: '<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"/>',
    bolt: '<path d="M13 2 4.8 13h6.1L10 22l8.2-11h-6.1L13 2Z"/>',
    chart: '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
    flag: '<path d="M5 21V4m0 1c5-3 8 3 14 0v10c-6 3-9-3-14 0"/>',
    download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/>',
    upload: '<path d="M12 21V9m0 0 4 4m-4-4-4 4M5 3h14"/>',
    save: '<path d="M4 3h13l3 3v15H4V3Z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5h6V2H9v2.5ZM8 10h8M8 14h8M8 18h5"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    alert: '<path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5M12 17.5h.01"/>',
    star: '<path d="m12 2.7 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5-4.7-4.6 6.5-.9L12 2.7Z"/>',
    heart: '<path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.2 1.2M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.2-1.2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    sparkles: '<path d="M12 2l1.3 3.7L17 7l-3.7 1.3L12 12l-1.3-3.7L7 7l3.7-1.3L12 2ZM5 13l.9 2.1L8 16l-2.1.9L5 19l-.9-2.1L2 16l2.1-.9L5 13ZM18.5 13l1.1 2.4L22 16.5l-2.4 1.1-1.1 2.4-1.1-2.4-2.4-1.1 2.4-1.1 1.1-2.4Z"/>',
    dice: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="9" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="15" r="1" fill="currentColor" stroke="none"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    money: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M7 9H5v2M17 15h2v-2"/>',
    home: '<path d="m3 11 9-8 9 8v10h-6v-6H9v6H3V11Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    bot: '<rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 3v4M8 12h.01M16 12h.01M8 16h8"/>',
    generic: '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>'
  };

  const aliases = new Map([
    ['☀','sun'],['☀️','sun'],['🌞','sun'],['🌙','moon'],['🌜','moon'],
    ['⚡','bolt'],['📊','chart'],['📈','chart'],['📉','chart'],
    ['🌍','globe'],['🌎','globe'],['🌏','globe'],['🌐','globe'],['🇸🇦','flag'],
    ['⬇','download'],['⬇️','download'],['📥','download'],['🔽','download'],['📤','upload'],['⬆','upload'],['⬆️','upload'],
    ['💾','save'],['📋','clipboard'],['🗑','trash'],['🗑️','trash'],
    ['✅','check'],['☑️','check'],['✔️','check'],['❌','x'],['✖️','x'],['⚠','alert'],['⚠️','alert'],
    ['⭐','star'],['🌟','star'],['❤️','heart'],['❤','heart'],['🔍','search'],['🔎','search'],['🔗','link'],
    ['🎯','target'],['✨','sparkles'],['🎉','sparkles'],['🎲','dice'],['🕒','clock'],['⏱️','clock'],['⏰','clock'],['📅','calendar'],['🗓️','calendar'],
    ['💰','money'],['💵','money'],['🏠','home'],['🏡','home'],['👤','user'],['👥','user'],['🤖','bot']
  ]);

  const labels = {sun:'Theme',moon:'Theme',bolt:'Quick action',chart:'Analytics',globe:'Global',flag:'Saudi',download:'Download',upload:'Upload',save:'Save',clipboard:'Clipboard',trash:'Delete',check:'Success',x:'Close',alert:'Warning',star:'Favorite',heart:'Favorite',search:'Search',link:'Link',target:'Target',sparkles:'Highlight',dice:'Random',clock:'Time',calendar:'Calendar',money:'Finance',home:'Home',user:'User',bot:'AI',generic:'Icon'};

  function svgFor(emoji) {
    const key = aliases.get(emoji) || 'generic';
    const span = document.createElement('span');
    span.className = 'svg-emoji';
    span.dataset.emoji = emoji;
    span.setAttribute('aria-hidden', 'true');
    span.style.cssText = iconStyle;
    span.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" style="width:100%;height:100%">${icons[key]}</svg>`;
    return {node: span, key};
  }

  function replaceTextNode(node) {
    if (!node?.nodeValue || !EMOJI_RE.test(node.nodeValue)) return;
    EMOJI_RE.lastIndex = 0;
    const text = node.nodeValue;
    const parent = node.parentElement;
    if (!parent || parent.closest(SKIP)) return;
    const matches = [...text.matchAll(EMOJI_RE)];
    if (!matches.length) return;

    if ((parent.matches('button,a,[role="button"]')) && !parent.getAttribute('aria-label') && text.trim() === matches.map(m => m[0]).join('')) {
      const key = aliases.get(matches[0][0]) || 'generic';
      parent.setAttribute('aria-label', labels[key] || 'Icon action');
    }

    const frag = document.createDocumentFragment();
    let cursor = 0;
    for (const match of matches) {
      const index = match.index ?? 0;
      if (index > cursor) frag.append(document.createTextNode(text.slice(cursor, index)));
      frag.append(svgFor(match[0]).node);
      cursor = index + match[0].length;
    }
    if (cursor < text.length) frag.append(document.createTextNode(text.slice(cursor)));
    node.replaceWith(frag);
  }

  function process(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) return replaceTextNode(root);
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE && root.matches(SKIP)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(replaceTextNode);
  }

  const start = () => {
    process(document.body);
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') replaceTextNode(mutation.target);
        mutation.addedNodes.forEach(process);
      }
    });
    observer.observe(document.body, {subtree:true, childList:true, characterData:true});
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
