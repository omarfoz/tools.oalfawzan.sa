import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';
const outDir = process.env.QA_OUT_DIR || 'ui-audit';
const routes = [
  ['homepage', '/'],
  ['404', '/404.html'],
  ['job-offer', '/offer/'],
  ['loan-calculator', '/loan-calculator/'],
  ['time-toolkit', '/time/'],
  ['wheel-of-names', '/wheel-of-names/'],
  ['json-formatter', '/json-formatter/'],
  ['qr-generator', '/qr-generator/'],
  ['stock-analysis', '/stock-analysis-dashboard/'],
];
const viewports = [
  ['desktop-1440x900', { width: 1440, height: 900 }],
  ['laptop-1280x800', { width: 1280, height: 800 }],
  ['tablet-768x1024', { width: 768, height: 1024 }],
  ['mobile-390x844', { width: 390, height: 844 }],
  ['mobile-375x667', { width: 375, height: 667 }],
];

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = { generatedAt: new Date().toISOString(), routes: {}, functional: {}, failures: [] };

function fail(message) {
  report.failures.push(message);
  console.error('QA FAIL:', message);
}

function serializeViolation(v) {
  return {
    id: v.id,
    impact: v.impact,
    help: v.help,
    nodes: v.nodes.map(node => ({
      target: node.target,
      html: node.html,
      failureSummary: node.failureSummary,
    })),
  };
}

for (const [routeName, route] of routes) {
  report.routes[routeName] = {};
  for (const [viewportName, viewport] of viewports) {
    const context = await browser.newContext({ viewport, colorScheme: 'dark', locale: 'ar-SA' });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', error => pageErrors.push(String(error)));

    let status = null;
    try {
      const response = await page.goto(`${baseURL}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      status = response?.status() ?? null;
      await page.waitForTimeout(routeName === 'stock-analysis' ? 1800 : 500);
      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        title: document.title,
        h1: document.querySelector('h1')?.textContent?.trim() || '',
      }));
      if (metrics.scrollWidth > metrics.clientWidth + 2) {
        fail(`${routeName} ${viewportName}: horizontal overflow ${metrics.scrollWidth}px > ${metrics.clientWidth}px`);
      }
      if (!metrics.title) fail(`${routeName} ${viewportName}: missing document title`);
      if (!metrics.h1 && routeName !== '404') fail(`${routeName} ${viewportName}: missing H1`);

      const axe = await new AxeBuilder({ page }).analyze();
      const serious = axe.violations.filter(v => ['critical', 'serious'].includes(v.impact));
      if (serious.length) {
        fail(`${routeName} ${viewportName}: ${serious.length} critical/serious axe violations: ${serious.map(v => `${v.id}(${v.nodes.length})`).join(', ')}`);
      }

      const dir = path.join(outDir, routeName);
      await fs.mkdir(dir, { recursive: true });
      await page.screenshot({ path: path.join(dir, `${viewportName}.png`), fullPage: true });
      report.routes[routeName][viewportName] = {
        status, metrics, consoleErrors, pageErrors,
        axe: axe.violations.map(serializeViolation),
      };

      // External services may legitimately fail in CI, but application exceptions must not.
      if (pageErrors.length) fail(`${routeName} ${viewportName}: page errors: ${pageErrors.join(' | ')}`);
    } catch (error) {
      report.routes[routeName][viewportName] = { status, error: String(error), consoleErrors, pageErrors };
      fail(`${routeName} ${viewportName}: ${error}`);
    } finally {
      await context.close();
    }
  }
}

async function functional(name, route, fn) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: 'dark', locale: 'ar-SA' });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  try {
    await page.goto(`${baseURL}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(300);
    const detail = await fn(page);
    if (pageErrors.length) throw new Error(pageErrors.join(' | '));
    report.functional[name] = { pass: true, detail };
    console.log(`FUNCTION PASS: ${name}`);
  } catch (error) {
    report.functional[name] = { pass: false, error: String(error) };
    fail(`${name}: ${error}`);
  } finally {
    await context.close();
  }
}

await functional('json-format-minify-invalid-clear', '/json-formatter/', async page => {
  await page.locator('#inputJson').fill('{"hello":"world","n":1}');
  await page.locator('#formatBtn').click();
  const formatted = await page.locator('#outputJson').inputValue();
  if (!formatted.includes('\n') || !formatted.includes('"hello"')) throw new Error('format did not produce formatted JSON');
  await page.locator('#minifyBtn').click();
  const minified = await page.locator('#outputJson').inputValue();
  if (minified !== '{"hello":"world","n":1}') throw new Error(`unexpected minified output: ${minified}`);
  await page.locator('#inputJson').fill('{bad');
  await page.locator('#formatBtn').click();
  if ((await page.locator('#outputJson').inputValue()) !== '') throw new Error('invalid input left stale output');
  return { formattedLength: formatted.length };
});

await functional('qr-generate-current-value', '/qr-generator/', async page => {
  await page.locator('#qrText').fill('https://tools.oalfawzan.sa/qa-one');
  await page.locator('#generateBtn').click();
  const first = await page.locator('#qrCanvas').evaluate(c => c.toDataURL());
  await page.locator('#qrText').fill('https://tools.oalfawzan.sa/qa-two');
  await page.locator('#generateBtn').click();
  const second = await page.locator('#qrCanvas').evaluate(c => c.toDataURL());
  if (first === second) throw new Error('QR canvas did not update for changed value');
  return { canvasUpdated: true };
});

await functional('wheel-input-reset', '/wheel-of-names/', async page => {
  await page.locator('#namesInput').fill('Alpha\nBeta\nGamma');
  await page.locator('#resetBtn').click();
  const value = await page.locator('#namesInput').inputValue();
  const result = (await page.locator('#resultText').textContent()) || '';
  if (value !== '') throw new Error(`reset did not clear the names input: ${JSON.stringify(value)}`);
  if (result.trim() !== '') throw new Error('reset did not clear the result state');
  return { cleared: true };
});

await functional('time-convert-and-calculate', '/time/', async page => {
  await page.locator('#convertTimeBtn').click();
  await page.locator('#calcDaysBtn').click();
  await page.locator('#durationBtn').click();
  for (const id of ['#tzResult', '#daysResult', '#durationResult']) {
    const text = (await page.locator(id).textContent())?.trim();
    if (!text) throw new Error(`${id} did not render a result`);
  }
  return { resultPanels: 3 };
});

await functional('loan-calculate', '/loan-calculator/', async page => {
  await page.getByRole('button', { name: 'حساب شامل' }).click();
  await page.waitForTimeout(200);
  if (await page.locator('#results').evaluate(el => el.classList.contains('hidden'))) throw new Error('results remained hidden');
  const amount = (await page.locator('#amountNeeded').textContent())?.trim();
  if (!amount || amount === '-') throw new Error('amountNeeded was not calculated');
  return { amountNeeded: amount };
});

await functional('offer-mode-switch-and-compare', '/offer/', async page => {
  await page.locator('#modeSimpleBtn').click();
  await page.locator('#coNameA').fill('Current Co');
  await page.locator('#coNameB').fill('New Co');
  const calc = page.locator('.inline-compare .calc-btn');
  await calc.click();
  await page.waitForTimeout(150);
  return { simpleResultVisible: await page.locator('#simpleResult').isVisible() };
});

await functional('stock-ui-local', '/stock-analysis-dashboard/', async page => {
  await page.locator('#tickerInput').fill('7202');
  await page.locator('#saveFavBtn').click();
  const favorites = (await page.locator('#favoritesList').textContent()) || '';
  if (!favorites.includes('7202')) throw new Error('favorite ticker was not reflected in list');
  return { favoriteSaved: true };
});

await browser.close();
await fs.writeFile(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));
console.log(`QA report written to ${path.join(outDir, 'report.json')}`);
if (report.failures.length) {
  console.error(`QA completed with ${report.failures.length} failure(s).`);
  process.exitCode = 1;
} else {
  console.log('QA completed with no blocking failures.');
}
