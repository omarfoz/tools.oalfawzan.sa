/* SVG Studio — view, edit, optimize and generate SVGs. Local-first; AI generation reuses
   the site's existing worker endpoint (same as offer.js / stock-analysis-dashboard.js). */
(() => {
  'use strict';

  /* ── i18n (same STRINGS ar/en pattern as qr-generator.js) ─────────── */
  const STRINGS = {
    ar: {
      lang: 'ar', dir: 'rtl',
      title: 'استوديو SVG — tools.oalfawzan.sa',
      meta: 'اعرض وحرّر وحسّن وولّد صور SVG بالذكاء الاصطناعي مباشرة من المتصفح.',
      tag: '// أداة', heading: 'استوديو SVG',
      desc: 'اعرض وحرّر وحسّن وولّد صور SVG بالذكاء الاصطناعي — كل شيء يعمل داخل متصفحك.',
      back: '← الرجوع لكل الأدوات', builtBy: 'من تطوير',
      editorTitle: 'محرر SVG',
      lblUpload: 'رفع ملف', lblUndo: 'تراجع', lblRedo: 'إعادة', lblCopy: 'نسخ', lblClear: 'مسح',
      qaTransform: 'تنسيق وضغط', qaExport: 'تصدير ومشاركة',
      lblBeautify: 'تنسيق', lblMinify: 'ضغط', lblOptimize: 'تحسين', lblRemoveMeta: 'إزالة البيانات الوصفية', lblRemoveComments: 'إزالة التعليقات',
      lblDownloadSvg: 'تنزيل SVG', lblExportPng: 'تصدير PNG', lblCopyDataUri: 'نسخ Data URI', lblCopyBase64: 'نسخ Base64',
      previewTitle: 'المعاينة',
      dropHint: 'أفلت ملف SVG هنا أو الصق الكود في المحرر',
      zoomTip: 'عجلة الفأرة للتكبير · اسحب للتحريك · نقرة مزدوجة للملاءمة',
      statSize: 'الحجم', statDims: 'الأبعاد', statViewBox: 'viewBox', statPaths: 'مسارات', statGroups: 'مجموعات', statShapes: 'أشكال', statTexts: 'نصوص',
      privacyNote: '🔒 ملف SVG يبقى في متصفحك — لا يُرسل أي شيء إلا عند استخدام توليد AI.',
      aiTitle: 'توليد SVG بالذكاء الاصطناعي',
      aiPromptLabel: 'صف الرسمة المطلوبة',
      aiPlaceholder: 'مثال: أنشئ أيقونة حوسبة سحابية بسيطة بثلاثة خوادم وسحابة بخطوط دائرية نظيفة.',
      lblStyle: 'النمط', lblAspect: 'الأبعاد', lblDetail: 'التفاصيل',
      styleOptions: ['بسيط', 'خطوط', 'مملوء', 'مسطح', 'هندسي', 'فني', 'توضيحي'],
      aspectOptions: ['مربع', 'أفقي', 'عمودي', 'تلقائي'],
      detailOptions: ['بسيط', 'متوسط', 'مفصّل'],
      lblGenerate: 'توليد SVG',
      lblModify: 'تعديل على النتيجة',
      modifyPlaceholder: 'مثال: اجعل الخطوط أنحف · أضف خادمًا آخر · اجعلها متماثلة',
      lblApply: 'تحديث الرسمة',
      aiIterateHelp: 'سيُرسل الطلب مع نسخة الـ SVG الحالية ليعيد النموذج الرسمة كاملة بعد التعديل.',
      statusCopied: 'تم النسخ إلى الحافظة.', statusDownloaded: 'تم التنزيل.',
      statusCleared: 'تم مسح المحرر.', statusEmpty: 'الصق كود SVG أو ارفع ملفًا للبدء.',
      statusBeautified: 'تم التنسيق.', statusMinified: 'تم الضغط.', statusOptimized: 'تم التحسين.',
      statusMetaRemoved: 'تمت إزالة البيانات الوصفية.', statusCommentsRemoved: 'تمت إزالة التعليقات.',
      statusPngReady: 'تم تصدير PNG.', statusUndo: 'تراجع.', statusRedo: 'إعادة.',
      statusNoContent: 'لا يوجد محتوى SVG.', statusNothingToUndo: 'لا يوجد شيء للتراجع عنه.',
      errParse: 'SVG غير صالح: تعذر تحليل الكود.',
      errEmptySvg: 'SVG غير صالح: لم يُعثر على عنصر <svg>.',
      errSanitize: 'SVG غير صالح أو غير آمن: تم رفض محتوى خطير.',
      errAiParse: 'تعذر استخراج SVG من رد الذكاء الاصطناعي.',
      errAi: 'تعذر الاتصال بخدمة الذكاء الاصطناعي. أعد المحاولة.',
      errPng: 'تعذر تصدير PNG.', errRead: 'تعذر قراءة الملف.',
      errCopy: 'تعذر النسخ إلى الحافظة. انسخ الكود يدويًا من المحرر.',
      aiWorking: 'جارٍ التوليد…', aiDone: 'تم توليد الرسمة وعرضها في المحرر والمعاينة.',
      aiModifying: 'جارٍ التعديل…', aiModDone: 'تم تحديث الرسمة بالتعديلات المطلوبة.',
      errAiEmpty: 'يرجى كتابة وصف للرسمة أولًا.',
      errModifyEmpty: 'اكتب تعليمات التعديل أولًا.',
      errNoSvgToModify: 'لا توجد رسمة لتعديلها — ولّد SVG أولًا أو ضع كودك في المحرر.',
      statsNone: '—',
      zoomFit: 'ملاءمة',
      canvasLabel: 'لوحة معاينة SVG — الأسهم للتحريك، وزرا + و− للتكبير',
      bgSwitcherLabel: 'خلفية المعاينة',
      bgChecker: 'خلفية رقعة الشطرنج', bgWhite: 'خلفية بيضاء', bgBlack: 'خلفية سوداء', bgTransparent: 'خلفية شفافة',
      bgCheckerTitle: 'رقعة الشطرنج', bgWhiteTitle: 'أبيض', bgBlackTitle: 'أسود', bgTransparentTitle: 'شفاف',
      sourceLabel: 'كود SVG المصدر',
      uploadLabel: 'رفع ملف SVG'
    },
    en: {
      lang: 'en', dir: 'ltr',
      title: 'SVG Studio — tools.oalfawzan.sa',
      meta: 'View, edit, optimize and generate SVG graphics with AI directly in your browser.',
      tag: '// TOOL', heading: 'SVG Studio',
      desc: 'View, edit, optimize and generate SVGs with AI — everything runs in your browser.',
      back: '← Back to all tools', builtBy: 'Built by',
      editorTitle: 'SVG Editor',
      lblUpload: 'Upload', lblUndo: 'Undo', lblRedo: 'Redo', lblCopy: 'Copy', lblClear: 'Clear',
      qaTransform: 'Format & compress', qaExport: 'Export & share',
      lblBeautify: 'Beautify', lblMinify: 'Minify', lblOptimize: 'Optimize', lblRemoveMeta: 'Remove metadata', lblRemoveComments: 'Remove comments',
      lblDownloadSvg: 'Download SVG', lblExportPng: 'Export PNG', lblCopyDataUri: 'Copy Data URI', lblCopyBase64: 'Copy Base64',
      previewTitle: 'Preview',
      dropHint: 'Drop an SVG file here or paste code in the editor',
      zoomTip: 'Mouse wheel to zoom · drag to pan · double-click to fit',
      statSize: 'Size', statDims: 'Dims', statViewBox: 'viewBox', statPaths: 'Paths', statGroups: 'Groups', statShapes: 'Shapes', statTexts: 'Texts',
      privacyNote: '🔒 Your SVG stays in your browser — nothing is sent except when using AI generation.',
      aiTitle: 'Generate SVG with AI',
      aiPromptLabel: 'Describe the SVG you want',
      aiPlaceholder: 'Example: create a minimal cloud-computing icon with three servers and a cloud, using clean rounded strokes.',
      lblStyle: 'Style', lblAspect: 'Aspect', lblDetail: 'Detail',
      styleOptions: ['Minimal', 'Line Art', 'Filled', 'Flat', 'Geometric', 'Technical', 'Illustration'],
      aspectOptions: ['Square', 'Landscape', 'Portrait', 'Auto'],
      detailOptions: ['Simple', 'Medium', 'Detailed'],
      lblGenerate: 'Generate SVG',
      lblModify: 'Modify the result',
      modifyPlaceholder: 'Example: thinner lines · add another server · make it symmetrical',
      lblApply: 'Update SVG',
      aiIterateHelp: 'Your request is sent together with the current SVG so the model returns the complete updated drawing.',
      statusCopied: 'Copied to clipboard.', statusDownloaded: 'Downloaded.',
      statusCleared: 'Editor cleared.', statusEmpty: 'Paste SVG code or upload a file to start.',
      statusBeautified: 'Beautified.', statusMinified: 'Minified.', statusOptimized: 'Optimized.',
      statusMetaRemoved: 'Metadata removed.', statusCommentsRemoved: 'Comments removed.',
      statusPngReady: 'PNG exported.', statusUndo: 'Undone.', statusRedo: 'Redone.',
      statusNoContent: 'No SVG content.', statusNothingToUndo: 'Nothing to undo.',
      errParse: 'Invalid SVG: could not parse the markup.',
      errEmptySvg: 'Invalid SVG: no <svg> element found.',
      errSanitize: 'Invalid or unsafe SVG: dangerous content was rejected.',
      errAiParse: 'Could not extract SVG from the AI response.',
      errAi: 'Could not reach the AI service. Try again.',
      errPng: 'PNG export failed.', errRead: 'Could not read the file.',
      errCopy: 'Could not copy to the clipboard. Copy the code manually from the editor.',
      aiWorking: 'Generating…', aiDone: 'SVG generated and loaded into the editor and preview.',
      aiModifying: 'Modifying…', aiModDone: 'SVG updated with your changes.',
      errAiEmpty: 'Describe the SVG you want first.',
      errModifyEmpty: 'Write your modification instructions first.',
      errNoSvgToModify: 'No SVG to modify — generate one first or put your code in the editor.',
      statsNone: '—',
      zoomFit: 'Fit',
      canvasLabel: 'SVG preview canvas — arrow keys pan, plus and minus zoom',
      bgSwitcherLabel: 'Preview background',
      bgChecker: 'Checkerboard background', bgWhite: 'White background', bgBlack: 'Black background', bgTransparent: 'Transparent background',
      bgCheckerTitle: 'Checkerboard', bgWhiteTitle: 'White', bgBlackTitle: 'Black', bgTransparentTitle: 'Transparent',
      sourceLabel: 'SVG source code',
      uploadLabel: 'Upload SVG file'
    }
  };

  /* ── Shared AI endpoint — same as offer.js & stock-analysis-dashboard.js ── */
  const AI_ENDPOINT = 'https://tools.niug502.workers.dev';

  const $ = id => document.getElementById(id);
  const svgSource = $('svgSource');
  const codeHighlight = $('codeHighlight');
  const lineGutter = $('lineGutter');
  const codeShell = document.querySelector('.code-shell');
  const canvasStage = $('canvasStage');
  const svgHolder = $('svgHolder');
  const stageEmpty = $('stageEmpty');
  const zoomHud = $('zoomHud');
  const statusEl = $('status');
  const aiStatus = $('aiStatus');
  const fileInput = $('fileInput');

  let currentLang = localStorage.getItem('tools-language') || localStorage.getItem('tools_lang') || 'ar';
  const t = () => STRINGS[currentLang] || STRINGS.ar;

  /* ── Editor state ──────────────────────────────────────────────────── */
  let history = [];
  let hIndex = -1;
  let zoom = 1, panX = 0, panY = 0, fitMode = true;

  function pushHistory(code) {
    if (history[hIndex] === code) return;
    history = history.slice(0, hIndex + 1);
    history.push(code);
    if (history.length > 60) history.shift();
    hIndex = history.length - 1;
  }

  function setStatus(msg, isError) {
    statusEl.textContent = msg || '';
    statusEl.classList.toggle('error', Boolean(isError));
  }
  function setAiStatus(msg, isError) {
    aiStatus.textContent = msg || '';
    aiStatus.classList.toggle('error', Boolean(isError));
  }

  /* ── SVG Sanitizer (DOMParser + allow-list) ────────────────────────── */
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const ALLOWED_TAGS = new Set([
    'svg', 'g', 'defs', 'symbol', 'use', 'title', 'desc', 'metadata', 'clipPath', 'mask', 'marker', 'pattern',
    'linearGradient', 'radialGradient', 'stop', 'filter', 'switch',
    'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'tspan', 'textPath',
    'a'
  ]);
  const ALLOWED_ATTRS = new Set([
    'id', 'class', 'lang', 'xml:space',
    'xmlns', 'xmlns:xlink', 'version',
    'd', 'r', 'rx', 'ry', 'cx', 'cy', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'width', 'height', 'points',
    'transform', 'gradientUnits', 'gradientTransform', 'spreadMethod', 'offset', 'stop-opacity', 'stop-color',
    'clip-path', 'clipPathUnits', 'mask', 'filter', 'marker-end', 'marker-start', 'marker-mid',
    'markerWidth', 'markerHeight', 'refX', 'refY', 'orient', 'markerUnits', 'viewBox', 'preserveAspectRatio',
    'fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-linecap',
    'stroke-linejoin', 'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset',
    'opacity', 'color', 'style', 'paint-order',
    'font-family', 'font-size', 'font-style', 'font-variant', 'font-weight', 'text-anchor',
    'text-decoration', 'text-rendering', 'letter-spacing', 'word-spacing', 'direction',
    'dominant-baseline', 'dy', 'dx', 'lengthAdjust', 'textLength', 'rotate', 'startOffset', 'method', 'spacing',
    'fx', 'fy', 'fr', 'patternUnits', 'patternContentUnits', 'patternTransform',
    'xlink:href', 'href', 'target', 'xlink:title',
    'in', 'in2', 'result', 'stdDeviation', 'values', 'type', 'mode', 'operator', 'tableValues',
    'slope', 'intercept', 'amplitude', 'exponent', 'k1', 'k2', 'k3', 'k4', 'scale', 'divisor', 'bias',
    'preserveAlpha', 'primitiveUnits', 'xChannelSelector', 'yChannelSelector', 'edgeMode',
    'dx', 'dy', 'surfaceScale', 'specularConstant', 'specularExponent', 'baseFrequency',
    'numOctaves', 'seed', 'stitchTiles',
    'image-rendering', 'overflow', 'unicode-bidi', 'baseline-shift'
  ]);
  const URL_ATTRS = new Set(['href', 'xlink:href']);
  const SAFE_URL_RE = /^(?:(?:https?|data):(?:[^\s"']*)|#[A-Za-z_][-\w:.]*|)$/;

  /* ── Tolerant XML/SVG parsing (DOMParser is strict; real-world files are not) ── */
  function parseSvgDoc(source) {
    let text = String(source).replace(/^\uFEFF/, '');
    // XML declarations are only legal at byte 0; tolerate stray ones.
    const decl = text.indexOf('<?xml');
    if (decl > 0) text = text.replace(/<\?xml[^>]*\?>/g, '');
    const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
    if (!doc.querySelector('parsererror')) return doc;
    // Retry without comments / processing instructions before giving up.
    const stripped = text.replace(/<!--[\s\S]*?-->/g, '').replace(/<\?[\s\S]*?\?>/g, '');
    const retry = new DOMParser().parseFromString(stripped, 'image/svg+xml');
    if (retry.querySelector('parsererror')) throw new Error('parse');
    return retry;
  }

  function sanitizeSvg(source) {
    const doc = parseSvgDoc(source);
    const svg = doc.documentElement;
    if (!svg || svg.localName.toLowerCase() !== 'svg') throw new Error('no-svg');
    const walk = (node) => {
      [...node.children].forEach(child => {
        if (!ALLOWED_TAGS.has(child.localName)) { child.remove(); return; }
        [...child.attributes].forEach(attr => {
          const aName = attr.localName;
          if (/^on/i.test(aName)) { child.removeAttribute(attr.name); return; }
          if (!ALLOWED_ATTRS.has(aName) && !ALLOWED_ATTRS.has(attr.name)) { child.removeAttribute(attr.name); return; }
          if (URL_ATTRS.has(aName) && !SAFE_URL_RE.test(attr.value.trim())) { child.removeAttribute(attr.name); return; }
          if (aName === 'style' && /javascript\s*:|expression\s*\(|\burl\s*\(\s*['"]?\s*(?!data:|https?:|#)/i.test(attr.value)) {
            child.removeAttribute(attr.name);
          }
        });
        walk(child);
      });
    };
    walk(svg);
    let out = new XMLSerializer().serializeToString(svg);
    if (!/xmlns=/.test(out)) out = out.replace(/<svg\b/i, m => m + ' xmlns="' + SVG_NS + '"');
    return out;
  }

  /* ── Extract first <svg>…</svg> from arbitrary AI text ─────────────── */
  function extractSvgFromText(text) {
    if (!text) return null;
    let s = String(text).trim();
    const start = s.search(/<svg\b/i);
    if (start === -1) return null;
    const end = s.toLowerCase().lastIndexOf('</svg>');
    if (end === -1) return null;
    return s.slice(start, end + 6);
  }

  /* ── Stats + preview render ────────────────────────────────────────── */
  function formatBytes(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + '\u00A0KB';
    return (n / 1024 / 1024).toFixed(2) + '\u00A0MB';
  }

  function clearStats() {
    ['statDims', 'statViewBox', 'statPaths', 'statGroups', 'statShapes', 'statTexts'].forEach(k => { $(k).textContent = t().statsNone; });
  }

  function showStageError(msg) {
    svgHolder.hidden = true;
    svgHolder.innerHTML = '';
    stageEmpty.hidden = false;
    $('dropHint').hidden = true;
    const errSpan = $('stageError');
    if (errSpan) { errSpan.textContent = msg; errSpan.hidden = false; }
    zoomHud.hidden = true;
  }

  function renderPreview() {
    const src = svgSource.value;
    $('statSize').textContent = src.trim() ? formatBytes(new Blob([src]).size) : t().statsNone;
    const errSpan = $('stageError');
    if (errSpan) { errSpan.hidden = true; }
    if (!src.trim()) {
      svgHolder.hidden = true;
      svgHolder.innerHTML = '';
      stageEmpty.hidden = false;
      $('dropHint').hidden = false;
      zoomHud.hidden = true;
      clearStats();
      return;
    }
    try {
      const clean = sanitizeSvg(src);
      svgHolder.innerHTML = clean;
      svgHolder.hidden = false;
      $('dropHint').hidden = true;
      const live = svgHolder.querySelector('svg');
      if (live) {
        const attr = n => live.getAttribute(n);
        $('statDims').textContent = (attr('width') && attr('height')) ? attr('width') + '×' + attr('height') : t().statsNone;
        $('statViewBox').textContent = attr('viewBox') || t().statsNone;
        $('statPaths').textContent = live.querySelectorAll('path').length;
        $('statGroups').textContent = live.querySelectorAll('g').length;
        $('statShapes').textContent = live.querySelectorAll('rect,circle,ellipse,line,polyline,polygon').length;
        $('statTexts').textContent = live.querySelectorAll('text,tspan,textPath').length;
      }
      if (fitMode) fitToScreen(); else applyZoom();
    } catch (err) {
      showStageError(err.message === 'parse' ? t().errParse : (err.message === 'no-svg' ? t().errEmptySvg : t().errSanitize));
      clearStats();
    }
  }

  /* ── Zoom / fit / pan ──────────────────────────────────────────────── */
  function fitToScreen() {
    const live = svgHolder.querySelector('svg');
    if (!live) return;
    fitMode = true;
    zoom = 1; panX = 0; panY = 0;
    live.style.width = '100%';
    live.style.height = 'auto';
    live.style.maxHeight = '100%';
    live.style.transform = '';
    zoomHud.textContent = t().zoomFit;
    zoomHud.hidden = svgHolder.hidden;
  }

  function applyZoom() {
    const live = svgHolder.querySelector('svg');
    if (!live) return;
    fitMode = false;
    zoom = Math.min(8, Math.max(0.1, zoom));
    live.style.width = '';
    live.style.height = '';
    live.style.maxHeight = '';
    live.style.transform = 'translate(' + panX + 'px,' + panY + 'px) scale(' + zoom + ')';
    zoomHud.textContent = Math.round(zoom * 100) + '%';
    zoomHud.hidden = svgHolder.hidden;
  }

  $('btnZoomIn').addEventListener('click', () => { zoom *= 1.25; applyZoom(); });
  $('btnZoomOut').addEventListener('click', () => { zoom /= 1.25; applyZoom(); });
  $('btnZoomFit').addEventListener('click', fitToScreen);
  $('btnZoomReset').addEventListener('click', () => { zoom = 1; panX = 0; panY = 0; applyZoom(); });
  canvasStage.addEventListener('wheel', e => {
    if (svgHolder.hidden) return;
    e.preventDefault();
    zoom *= e.deltaY < 0 ? 1.12 : (1 / 1.12);
    applyZoom();
  }, { passive: false });

  let dragging = false, lastX = 0, lastY = 0;
  canvasStage.addEventListener('pointerdown', e => {
    if (svgHolder.hidden) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    canvasStage.classList.add('is-dragging');
    canvasStage.setPointerCapture(e.pointerId);
  });
  canvasStage.addEventListener('pointermove', e => {
    if (!dragging) return;
    panX += e.clientX - lastX;
    panY += e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    applyZoom();
  });
  ['pointerup', 'pointercancel'].forEach(ev => canvasStage.addEventListener(ev, () => { dragging = false; canvasStage.classList.remove('is-dragging'); }));
  canvasStage.addEventListener('dblclick', fitToScreen);
  /* Keyboard alternative for pan (arrow keys) when the stage is focused */
  canvasStage.addEventListener('keydown', e => {
    if (svgHolder.hidden) return;
    const step = e.shiftKey ? 40 : 16;
    if (e.key === 'ArrowLeft') { panX -= step; }
    else if (e.key === 'ArrowRight') { panX += step; }
    else if (e.key === 'ArrowUp') { panY -= step; }
    else if (e.key === 'ArrowDown') { panY += step; }
    else if (e.key === '+' || e.key === '=') { zoom *= 1.25; }
    else if (e.key === '-' || e.key === '_') { zoom /= 1.25; }
    else return;
    e.preventDefault();
    applyZoom();
  });

  /* ── Background switcher ───────────────────────────────────────────── */
  $('bgSwitcher').addEventListener('click', e => {
    const btn = e.target.closest('.bg-btn');
    if (!btn) return;
    canvasStage.className = 'canvas-stage stage-' + btn.dataset.bg;
    [...$('bgSwitcher').children].forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
  });

  /* ── Syntax highlight + gutter ─────────────────────────────────────── */
  const escHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function highlight(code) {
    const TOKEN_RE = /<!--[\s\S]*?-->|<\/?[A-Za-z][\w:.-]*|"[^"]*"|'[^']*'|[A-Za-z_][\w:.-]*=|[A-Za-z_][\w:.-]*|&amp;|&lt;|&gt;/g;
    let out = '';
    let idx = 0;
    let m;
    while ((m = TOKEN_RE.exec(code)) !== null) {
      const tok = m[0];
      const before = code.slice(idx, m.index);
      out += escHtml(before);
      if (tok.startsWith('<!--')) out += '<span class="tk-comment">' + escHtml(tok) + '</span>';
      else if (tok.startsWith('</') || tok.startsWith('<')) {
        out += '<span class="tk-punc">' + escHtml(tok.slice(0, tok[1] === '/' ? 2 : 1)) + '</span><span class="tk-name">' + escHtml(tok.slice(tok[1] === '/' ? 2 : 1)) + '</span>';
      } else if (tok.startsWith('"') || tok.startsWith("'")) out += '<span class="tk-str">' + escHtml(tok) + '</span>';
      else if (tok.endsWith('=')) out += '<span class="tk-attr">' + escHtml(tok.slice(0, -1)) + '</span><span class="tk-punc">=</span>';
      else if (tok.startsWith('&')) out += '<span class="tk-ent">' + escHtml(tok) + '</span>';
      else out += '<span class="tk-attr">' + escHtml(tok) + '</span>';
      idx = m.index + tok.length;
    }
    out += escHtml(code.slice(idx));
    return out;
  }

  function refreshHighlight() {
    const code = svgSource.value;
    if (!code) {
      codeHighlight.innerHTML = '';
      lineGutter.textContent = '1';
      return;
    }
    codeHighlight.innerHTML = highlight(code);
    const lines = code.split('\n').length;
    if (lines <= 400) {
      const rows = [];
      for (let i = 1; i <= lines; i++) rows.push(i);
      lineGutter.textContent = rows.join('\n');
    } else {
      lineGutter.textContent = '1';
    }
  }

  function syncScroll() {
    codeHighlight.scrollLeft = svgSource.scrollLeft;
    codeHighlight.scrollTop = svgSource.scrollTop;
    lineGutter.scrollTop = svgSource.scrollTop;
  }
  svgSource.addEventListener('scroll', syncScroll, { passive: true });

  /* Tab indentation + undo/redo shortcuts (native textarea undo preserved for typing) */
  svgSource.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertAtCursor('  ');
    }
  });
  function insertAtCursor(text) {
    const s = svgSource.selectionStart, e2 = svgSource.selectionEnd;
    svgSource.value = svgSource.value.slice(0, s) + text + svgSource.value.slice(e2);
    svgSource.setSelectionRange(s + text.length, s + text.length);
    pushHistory(svgSource.value);
    refreshHighlight();
    renderPreview();
  }

  /* ── Undo / redo (app-level, for programmatic transforms) ─────────── */
  function undo() {
    if (hIndex <= 0) { setStatus(t().statusNothingToUndo); return; }
    hIndex--;
    svgSource.value = history[hIndex];
    refreshHighlight(); renderPreview(); setStatus(t().statusUndo);
  }
  function redo() {
    if (hIndex >= history.length - 1) return;
    hIndex++;
    svgSource.value = history[hIndex];
    refreshHighlight(); renderPreview(); setStatus(t().statusRedo);
  }
  $('btnUndo').addEventListener('click', undo);
  $('btnRedo').addEventListener('click', redo);

  /* ── Transformations ───────────────────────────────────────────────── */
  function parseXml(src) {
    return parseSvgDoc(src);
  }
  const escAttr = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function xmlBeautify(node, depth) {
    const pad = '  '.repeat(depth);
    if (node.nodeType === 8) return pad + '<!--' + node.data + '-->';
    if (node.nodeType === 3) {
      const txt = node.nodeValue.trim();
      return txt ? pad + txt : '';
    }
    if (node.nodeType !== 1) return '';
    const children = [...node.childNodes].filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.nodeValue.trim()));
    const attrs = [...node.attributes].map(a => a.name + '="' + escAttr(a.value) + '"').join(' ');
    const open = '<' + node.localName + (attrs ? ' ' + attrs : '');
    if (!children.length) return pad + open + '/>';
    if (children.length === 1 && children[0].nodeType === 3 && children[0].nodeValue.trim().length < 60) {
      return pad + open + '>' + escHtml(children[0].nodeValue.trim()) + '</' + node.localName + '>';
    }
    const inner = children.map(c => xmlBeautify(c, depth + 1)).filter(Boolean).join('\n');
    return pad + open + '>\n' + inner + '\n' + pad + '</' + node.localName + '>';
  }

  function beautifySvg(src) { return xmlBeautify(parseXml(src).documentElement, 0); }

  function minifySvg(src) {
    const doc = parseXml(src);
    const walker = n => { [...n.childNodes].forEach(c => { if (c.nodeType === 3 && !c.nodeValue.trim()) c.remove(); else if (c.nodeType === 8) c.remove(); else walker(c); }); };
    walker(doc);
    let out = new XMLSerializer().serializeToString(doc.documentElement);
    out = out.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim();
    return out;
  }

  function removeMetadata(src) {
    const doc = parseXml(src);
    doc.querySelectorAll('metadata,title,desc').forEach(n => n.remove());
    const KEEP_ID = new Set(['clipPath', 'mask', 'marker', 'pattern', 'linearGradient', 'radialGradient', 'filter', 'symbol', 'use']);
    const root = doc.documentElement;
    [...root.attributes].forEach(a => {
      // xmlns:* declarations for editor namespaces are removed with their attrs below.
      if (/^xmlns:(sodipodi|inkscape|adobe|illustrator|sketch|figma|xmp)/i.test(a.name)) root.removeAttribute(a.name);
    });
    [...doc.querySelectorAll('*')].forEach(n => {
      [...n.attributes].forEach(a => {
        if (/^(sodipodi|inkscape|adobe|illustrator|sketch|figma|xmp|i:|graph)/i.test(a.name)) n.removeAttribute(a.name);
        else if (a.name === 'id' && !KEEP_ID.has(n.localName)) n.removeAttribute(a.name);
      });
    });
    return new XMLSerializer().serializeToString(root);
  }

  function removeCommentsFn(src) { return src.replace(/<!--[\s\S]*?-->/g, ''); }

  function optimizeSvg(src) {
    let out = removeMetadata(src);
    out = removeCommentsFn(out);
    out = out.replace(/\s*<\?xml[^>]*\?>\s*/g, '');
    out = out.replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim();
    return out;
  }

  function withContent(fn, okMsg) {
    const src = svgSource.value;
    if (!src.trim()) { setStatus(t().statusNoContent, true); return; }
    try {
      const out = fn(src);
      svgSource.value = out;
      pushHistory(out); refreshHighlight(); renderPreview(); setStatus(okMsg);
    } catch (err) {
      setStatus(t().errParse, true);
    }
  }

  $('btnBeautify').addEventListener('click', () => withContent(beautifySvg, t().statusBeautified));
  $('btnMinify').addEventListener('click', () => withContent(minifySvg, t().statusMinified));
  $('btnOptimize').addEventListener('click', () => withContent(optimizeSvg, t().statusOptimized));
  $('btnRemoveMeta').addEventListener('click', () => withContent(removeMetadata, t().statusMetaRemoved));
  $('btnRemoveComments').addEventListener('click', () => withContent(removeCommentsFn, t().statusCommentsRemoved));

  /* ── File upload / drag&drop ───────────────────────────────────────── */
  function loadFile(file) {
    if (!file) return;
    if (file.type && file.type !== 'image/svg+xml' && !/\.svg$/i.test(file.name)) {
      setStatus(t().errRead, true); return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      svgSource.value = String(reader.result || '');
      pushHistory(svgSource.value);
      refreshHighlight(); renderPreview();
    };
    reader.onerror = () => setStatus(t().errRead, true);
    reader.readAsText(file);
  }
  $('btnUpload').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', e => { loadFile(e.target.files[0]); e.target.value = ''; });
  ['dragenter', 'dragover'].forEach(ev => canvasStage.addEventListener(ev, e => { e.preventDefault(); canvasStage.classList.add('dragging'); }));
  ['dragleave', 'drop'].forEach(ev => canvasStage.addEventListener(ev, e => { e.preventDefault(); canvasStage.classList.remove('dragging'); }));
  canvasStage.addEventListener('drop', e => {
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) loadFile(file);
  });

  /* ── Clipboard / download / export ────────────────────────────────── */
  async function copyTextRaw(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try { await navigator.clipboard.writeText(text); return true; } catch (_) { /* fall through */ }
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.append(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
    ta.remove();
    return ok;
  }

  function downloadBlob(content, filename, type) {
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  $('btnCopy').addEventListener('click', async () => {
    if (!svgSource.value.trim()) { setStatus(t().statusNoContent, true); return; }
    if (await copyTextRaw(svgSource.value)) setStatus(t().statusCopied);
    else setStatus(t().errCopy, true);
  });
  $('btnDownloadSvg').addEventListener('click', () => {
    if (!svgSource.value.trim()) { setStatus(t().statusNoContent, true); return; }
    downloadBlob(svgSource.value, 'svg-' + Date.now() + '.svg', 'image/svg+xml');
    setStatus(t().statusDownloaded);
  });
  $('btnCopyDataUri').addEventListener('click', async () => {
    if (!svgSource.value.trim()) { setStatus(t().statusNoContent, true); return; }
    const uri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgSource.value);
    if (await copyTextRaw(uri)) setStatus(t().statusCopied);
    else setStatus(t().errCopy, true);
  });
  $('btnCopyBase64').addEventListener('click', async () => {
    if (!svgSource.value.trim()) { setStatus(t().statusNoContent, true); return; }
    try {
      const b64 = btoa(unescape(encodeURIComponent(svgSource.value)));
      if (await copyTextRaw(b64)) setStatus(t().statusCopied);
      else setStatus(t().errCopy, true);
    } catch (_) { setStatus(t().errRead, true); }
  });

  /* ── PNG export (local canvas) ────────────────────────────────────── */
  function parseViewBoxDims(source) {
    const m = /<svg\b[^>]*>/i.exec(source);
    if (!m) return { w: 512, h: 512 };
    const tag = m[0];
    const vb = /viewBox\s*=\s*"([^"]+)"/.exec(tag);
    if (vb) {
      const parts = vb[1].trim().split(/[\s,]+/).map(Number);
      if (parts.length === 4 && parts.every(Number.isFinite) && parts[2] > 0 && parts[3] > 0) {
        return { w: parts[2], h: parts[3] };
      }
    }
    const wA = /width\s*=\s*"([^"]+)"/.exec(tag);
    const hA = /height\s*=\s*"([^"]+)"/.exec(tag);
    if (wA && hA) {
      const w = parseFloat(wA[1]), h = parseFloat(hA[1]);
      if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) return { w, h };
    }
    return { w: 512, h: 512 };
  }

  async function exportPng() {
    const src = svgSource.value;
    if (!src.trim()) { setStatus(t().statusNoContent, true); return; }
    try {
      const clean = sanitizeSvg(src);
      const dims = parseViewBoxDims(clean);
      const scale = 1024 / Math.max(dims.w, dims.h);
      const blob = new Blob([clean], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(dims.w * scale));
      canvas.height = Math.max(1, Math.round(dims.h * scale));
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(b => {
        if (!b) { setStatus(t().errPng, true); return; }
        downloadBlob(b, 'svg-' + Date.now() + '.png', 'image/png');
        setStatus(t().statusPngReady);
      }, 'image/png');
    } catch (_) {
      setStatus(t().errPng, true);
    }
  }
  $('btnExportPng').addEventListener('click', exportPng);

  $('btnClear').addEventListener('click', () => {
    svgSource.value = '';
    pushHistory('');
    refreshHighlight(); renderPreview();
    setStatus(t().statusCleared);
  });

  /* ── AI generation (reuses the site's existing worker endpoint) ────── */
  const SYS = 'You are an expert SVG designer.\n\nReturn ONLY valid SVG markup.\n\nDo not return Markdown.\nDo not use ```svg code fences.\nDo not explain the SVG.\nDo not include text before or after the SVG.\n\nThe output must start with <svg and end with </svg>.\n\nCreate clean, optimized, standards-compliant SVG.\n\nPrefer:\n- viewBox\n- vector paths\n- groups\n- SVG-native gradients\n- SVG-native shapes\n\nAvoid:\n- external images\n- external URLs\n- JavaScript\n- iframe\n- foreignObject\n- embedded HTML\n- external fonts\n- unsafe SVG content.\n\nThe SVG must work completely standalone.';

  async function callAi(prompt) {
    const res = await fetch(AI_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
    const data = await res.json();
    return String((data && data.text) || '');
  }

  function selectedText(sel, fallbackList) {
    const s = t();
    const opts = fallbackList === 'style' ? s.styleOptions : (fallbackList === 'aspect' ? s.aspectOptions : s.detailOptions);
    const i = sel.selectedIndex;
    return (i >= 0 && i < opts.length) ? opts[i] : opts[0];
  }

  function buildGenerationPrompt() {
    return SYS +
      '\n\nStyle: ' + selectedText($('aiStyle'), 'style') + '.' +
      '\nAspect ratio: ' + selectedText($('aiAspect'), 'aspect') + '.' +
      '\nDetail level: ' + selectedText($('aiDetail'), 'detail') + '.' +
      '\n\nUser request: ' + $('aiPrompt').value.trim();
  }

  function buildModificationPrompt() {
    return SYS +
      '\n\nYou will receive an existing SVG and a modification instruction. Return the COMPLETE updated SVG only.' +
      '\nStyle guidance: ' + selectedText($('aiStyle'), 'style') + '.' +
      '\n\nCurrent SVG:\n' + svgSource.value.trim() +
      '\n\nModification instruction: ' + $('aiModify').value.trim();
  }

  function aiBusy(on) {
    $('btnGenerate').disabled = on;
    $('btnApply').disabled = on;
    $('btnGenerate').setAttribute('aria-busy', String(on));
  }

  function acceptAiSvg(text) {
    const raw = extractSvgFromText(text);
    if (!raw) throw new Error('extract');
    const clean = sanitizeSvg(raw);
    svgSource.value = clean;
    pushHistory(clean);
    refreshHighlight();
    renderPreview();
  }

  async function generateSvg() {
    if (!$('aiPrompt').value.trim()) { setAiStatus(t().errAiEmpty, true); return; }
    aiBusy(true);
    setAiStatus(t().aiWorking);
    try {
      const text = await callAi(buildGenerationPrompt());
      acceptAiSvg(text);
      $('aiIterate').hidden = false;
      setAiStatus(t().aiDone);
    } catch (err) {
      setAiStatus(err.message === 'extract' ? t().errAiParse : t().errAi, true);
    } finally {
      aiBusy(false);
    }
  }

  async function modifySvg() {
    if (!$('aiModify').value.trim()) { setAiStatus(t().errModifyEmpty, true); return; }
    if (!svgSource.value.trim()) { setAiStatus(t().errNoSvgToModify, true); return; }
    aiBusy(true);
    setAiStatus(t().aiModifying);
    try {
      const text = await callAi(buildModificationPrompt());
      acceptAiSvg(text);
      setAiStatus(t().aiModDone);
    } catch (err) {
      setAiStatus(err.message === 'extract' ? t().errAiParse : t().errAi, true);
    } finally {
      aiBusy(false);
    }
  }

  $('btnGenerate').addEventListener('click', generateSvg);
  $('btnApply').addEventListener('click', modifySvg);
  $('aiPrompt').addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); generateSvg(); }
  });
  $('aiModify').addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); modifySvg(); }
  });

  /* Live re-render on typing (debounced) */
  let liveTimer;
  svgSource.addEventListener('input', () => {
    clearTimeout(liveTimer);
    liveTimer = setTimeout(() => {
      pushHistory(svgSource.value);
      refreshHighlight();
      renderPreview();
    }, 220);
  });

  /* ── Language / theme (same pattern as qr-generator.js) ───────────── */
  function applyLang(lang, persist) {
    const s = STRINGS[lang] || STRINGS.ar;
    currentLang = s.lang;
    document.documentElement.lang = s.lang;
    document.documentElement.dir = s.dir;
    document.title = s.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', s.meta);
    /* Accessible names follow the UI language */
    $('canvasStage').setAttribute('aria-label', s.canvasLabel);
    $('bgChecker').setAttribute('aria-label', s.bgChecker);
    $('bgWhite').setAttribute('aria-label', s.bgWhite);
    $('bgBlack').setAttribute('aria-label', s.bgBlack);
    $('bgTransparent').setAttribute('aria-label', s.bgTransparent);
    $('bgSwitcher').setAttribute('aria-label', s.bgSwitcherLabel);
    $('svgSource').setAttribute('aria-label', s.sourceLabel);
    $('aiPrompt').setAttribute('aria-label', s.aiPromptLabel);
    $('aiModify').setAttribute('aria-label', s.lblModify);
    $('fileInput').setAttribute('aria-label', s.uploadLabel);
    $('bgChecker').setAttribute('title', s.bgCheckerTitle);
    $('bgWhite').setAttribute('title', s.bgWhiteTitle);
    $('bgBlack').setAttribute('title', s.bgBlackTitle);
    $('bgTransparent').setAttribute('title', s.bgTransparentTitle);
    $('tag').textContent = s.tag;
    $('title').textContent = s.heading;
    $('desc').textContent = s.desc;
    $('backLink').textContent = s.back;
    $('builtBy').textContent = s.builtBy;
    $('editorTitle').textContent = s.editorTitle;
    $('lblUpload').textContent = s.lblUpload;
    $('lblUndo').textContent = s.lblUndo;
    $('lblRedo').textContent = s.lblRedo;
    $('lblCopy').textContent = s.lblCopy;
    $('lblClear').textContent = s.lblClear;
    $('qaLabelTransform').textContent = s.qaTransform;
    $('lblBeautify').textContent = s.lblBeautify;
    $('lblMinify').textContent = s.lblMinify;
    $('lblOptimize').textContent = s.lblOptimize;
    $('lblRemoveMeta').textContent = s.lblRemoveMeta;
    $('lblRemoveComments').textContent = s.lblRemoveComments;
    $('qaLabelExport').textContent = s.qaExport;
    $('lblDownloadSvg').textContent = s.lblDownloadSvg;
    $('lblExportPng').textContent = s.lblExportPng;
    $('lblCopyDataUri').textContent = s.lblCopyDataUri;
    $('lblCopyBase64').textContent = s.lblCopyBase64;
    $('previewTitle').textContent = s.previewTitle;
    $('dropHint').textContent = s.dropHint;
    $('zoomTip').textContent = s.zoomTip;
    $('privacyNote').textContent = s.privacyNote;
    $('aiTitle').textContent = s.aiTitle;
    $('aiPromptLabel').textContent = s.aiPromptLabel;
    $('aiPrompt').placeholder = s.aiPlaceholder;
    $('lblStyle').textContent = s.lblStyle;
    $('lblAspect').textContent = s.lblAspect;
    $('lblDetail').textContent = s.lblDetail;
    $('lblGenerate').textContent = s.lblGenerate;
    $('lblModify').textContent = s.lblModify;
    $('aiModify').placeholder = s.modifyPlaceholder;
    $('lblApply').textContent = s.lblApply;
    $('aiIterateHelp').textContent = s.aiIterateHelp;
    $('lblStatSize').textContent = s.statSize;
    $('lblStatDims').textContent = s.statDims;
    $('lblStatViewBox').textContent = s.statViewBox;
    $('lblStatPaths').textContent = s.statPaths;
    $('lblStatGroups').textContent = s.statGroups;
    $('lblStatShapes').textContent = s.statShapes;
    $('lblStatTexts').textContent = s.statTexts;
    rebuildSelects(s);
    $('langBtn').textContent = s.lang === 'ar' ? 'EN' : 'ع';
    $('langBtn').setAttribute('aria-label', s.lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    if (persist) {
      localStorage.setItem('tools-language', lang);
      localStorage.setItem('tools_lang', lang);
    }
  }

  function rebuildSelects(s) {
    const triples = [
      [$('aiStyle'), s.styleOptions, 'svg-studio-style'],
      [$('aiAspect'), s.aspectOptions, 'svg-studio-aspect'],
      [$('aiDetail'), s.detailOptions, 'svg-studio-detail']
    ];
    triples.forEach(([sel, opts, key]) => {
      const saved = localStorage.getItem(key);
      sel.innerHTML = opts.map(o => '<option value="' + escAttr(o) + '">' + escAttr(o) + '</option>').join('');
      const idx = Math.max(0, opts.indexOf(saved));
      sel.selectedIndex = idx;
      sel.onchange = () => localStorage.setItem(key, opts[sel.selectedIndex] || opts[0]);
    });
  }

  const THEME_ICONS = {
    sun: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.41M17.66 6.34l1.41-1.41"/></svg>',
    moon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"/></svg>'
  };

  function applyTheme(theme, persist) {
    const th = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = th;
    if (persist) {
      localStorage.setItem('tools-theme', th);
      localStorage.setItem('tools_theme', th);
    }
    const b = $('themeBtn');
    if (b) {
      b.innerHTML = th === 'light' ? THEME_ICONS.moon : THEME_ICONS.sun;
      b.setAttribute('aria-label', th === 'light' ? 'تبديل المظهر' : 'Toggle theme');
    }
  }

  $('langBtn').addEventListener('click', () => applyLang(currentLang === 'ar' ? 'en' : 'ar', true));
  $('themeBtn').addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light', true));

  window.addEventListener('tools:themechange', e => applyTheme(e.detail.theme, false));
  window.addEventListener('tools:languagechange', e => applyLang(e.detail.lang, false));

  /* ── Init ──────────────────────────────────────────────────────────── */
  applyTheme(localStorage.getItem('tools-theme') || localStorage.getItem('tools_theme') || 'dark', false);
  applyLang(localStorage.getItem('tools-language') || localStorage.getItem('tools_lang') || 'ar', false);
  refreshHighlight();
  renderPreview();
})();
