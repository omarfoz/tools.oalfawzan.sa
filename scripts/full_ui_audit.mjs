import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, '.ui-audit');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const viewports = [
  ['desktop-1440x900', 1440, 900],
  ['laptop-1280x800', 1280, 800],
  ['tablet-768x1024', 768, 1024],
  ['mobile-390x844', 390, 844],
  ['mobile-375x667', 375, 667],
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (['.git', 'node_modules', '.ui-audit'].includes(entry.name)) return [];
    const p = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(p) : [p];
  });
}

const htmlFiles = walk(root).filter((p) => p.endsWith('.html'));
const routes = htmlFiles.map((file) => {
  const rel = path.relative(root, file).replaceAll(path.sep, '/');
  if (rel === 'index.html') return { route: '/', file: rel, slug: 'homepage' };
  if (rel.endsWith('/index.html')) return { route: `/${rel.slice(0, -10)}`, file: rel, slug: rel.slice(0, -11).replaceAll('/', '__') };
  return { route: `/${rel}`, file: rel, slug: rel.replaceAll('/', '__').replace(/\.html$/, '') };
}).sort((a,b) => a.route.localeCompare(b.route));

const browser = await chromium.launch({ headless: true });
const report = { generatedAt: new Date().toISOString(), routes, viewports: viewports.map(v => v[0]), pages: {} };
const baseURL = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';

const emojiRx = /[\p{Extended_Pictographic}\u2600-\u27BF]/u;

for (const item of routes) {
  report.pages[item.route] = { file: item.file, captures: {}, functional: [] };
  const pageDir = path.join(out, item.slug || 'root');
  fs.mkdirSync(pageDir, { recursive: true });

  for (const [label, width, height] of viewports) {
    const context = await browser.newContext({ viewport: { width, height }, colorScheme: 'dark', locale: 'ar-SA' });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', (err) => pageErrors.push(err.message));

    const response = await page.goto(baseURL + item.route, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(900);

    const metrics = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const visible = (el) => {
        const s = getComputedStyle(el); const r = el.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
      };
      const controls = [...document.querySelectorAll('button,a,input,select,textarea,[role="button"]')].filter(visible);
      const tinyTargets = controls.map((el) => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName, id: el.id || '', text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0,60), width: Math.round(r.width), height: Math.round(r.height) };
      }).filter(x => x.width < 44 || x.height < 44);
      const unlabeled = [...document.querySelectorAll('input,select,textarea')].filter(visible).filter((el) => {
        const id = el.id; return !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !(id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) && !el.closest('label');
      }).map(el => ({tag:el.tagName,id:el.id,type:el.type||''}));
      return {
        title: document.title,
        lang: doc.lang,
        dir: doc.dir,
        scrollWidth: Math.max(doc.scrollWidth, body?.scrollWidth || 0),
        clientWidth: doc.clientWidth,
        horizontalOverflow: Math.max(doc.scrollWidth, body?.scrollWidth || 0) > doc.clientWidth + 1,
        tinyTargets,
        unlabeled,
        headings: [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(visible).map(h => ({level:Number(h.tagName[1]), text:h.textContent.trim().slice(0,100)})),
      };
    });

    const interactiveEmoji = await page.locator('button,a,[role="button"],.tool-icon').evaluateAll((els) => els.map(el => ({ text:(el.textContent||'').trim(), aria:el.getAttribute('aria-label')||'' })).filter(x => /[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/u.test(x.text)));
    const axe = await new AxeBuilder({ page }).analyze();
    const seriousA11y = axe.violations.filter(v => ['serious','critical'].includes(v.impact || ''));

    let brokenLocalLinks = [];
    if (label === 'desktop-1440x900') {
      const hrefs = await page.locator('a[href]').evaluateAll(as => [...new Set(as.map(a => a.getAttribute('href')).filter(Boolean))]);
      for (const href of hrefs) {
        if (!href.startsWith('/') || href.startsWith('//')) continue;
        try {
          const r = await page.request.get(baseURL + href, { timeout: 10000 });
          if (!r.ok()) brokenLocalLinks.push({ href, status: r.status() });
        } catch (e) { brokenLocalLinks.push({ href, error: e.message }); }
      }
    }

    const screenshot = path.join(pageDir, `${label}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    report.pages[item.route].captures[label] = {
      httpStatus: response?.status() ?? null,
      screenshot: path.relative(root, screenshot).replaceAll(path.sep,'/'),
      metrics,
      consoleErrors,
      pageErrors,
      interactiveEmoji,
      seriousA11y: seriousA11y.map(v => ({ id:v.id, impact:v.impact, help:v.help, nodes:v.nodes.length })),
      brokenLocalLinks,
    };
    await context.close();
  }
}

// Route-specific functional smoke checks.
async function smoke(route, fn) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: 'dark' });
  const page = await context.newPage();
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  try {
    await page.goto(baseURL + route, { waitUntil:'domcontentloaded', timeout:30000 }); await page.waitForTimeout(700);
    const detail = await fn(page);
    report.pages[route]?.functional.push({ ok:true, detail, errors });
  } catch (e) { report.pages[route]?.functional.push({ ok:false, error:e.message, errors }); }
  await context.close();
}

await smoke('/json-formatter/', async page => {
  await page.locator('#inputJson').fill('{"hello":"world","n":2}');
  await page.locator('#formatBtn').click();
  const out = await page.locator('#outputJson').inputValue();
  if (!out.includes('\n') || !out.includes('"hello"')) throw new Error('Formatted JSON output not produced');
  await page.locator('#inputJson').fill('{bad'); await page.locator('#formatBtn').click();
  if ((await page.locator('#outputJson').inputValue()) !== '') throw new Error('Stale output remains after invalid JSON');
  return 'format + invalid-input clearing';
});
await smoke('/qr-generator/', async page => {
  await page.locator('#qrText').fill('https://example.com/qa'); await page.locator('#generateBtn').click();
  const dims = await page.locator('#qrCanvas').evaluate(c => ({w:c.width,h:c.height}));
  if (!dims.w || !dims.h) throw new Error('QR canvas not rendered'); return 'generate QR canvas';
});
await smoke('/wheel-of-names/', async page => {
  await page.locator('#namesInput').fill('Alpha\nBeta\nGamma'); await page.locator('#spinBtn').click();
  await page.waitForTimeout(250); if (!(await page.locator('#wheelCanvas').isVisible())) throw new Error('Wheel missing'); return 'populate + spin start';
});

await browser.close();

fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
let md = `# Full UI audit\n\nGenerated: ${report.generatedAt}\n\n| Route | Desktop | Laptop | Tablet | Mobile 390 | Mobile 375 | Functional smoke |\n|---|---|---|---|---|---|---|\n`;
for (const r of routes) {
  const p=report.pages[r.route];
  const mark=(label)=>{const c=p.captures[label]; return c && c.httpStatus < 400 && !c.metrics.horizontalOverflow && c.pageErrors.length===0 ? 'PASS' : 'CHECK'};
  const func=p.functional.length ? (p.functional.every(x=>x.ok)?'PASS':'CHECK') : 'N/A';
  md += `| ${r.route} | ${mark('desktop-1440x900')} | ${mark('laptop-1280x800')} | ${mark('tablet-768x1024')} | ${mark('mobile-390x844')} | ${mark('mobile-375x667')} | ${func} |\n`;
}
fs.writeFileSync(path.join(out, 'REPORT.md'), md);
console.log(md);
