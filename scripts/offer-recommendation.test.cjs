const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const OfferModel = require('../assets/js/pages/offer-model.js');
const source = fs.readFileSync('assets/js/pages/offer.js', 'utf8');
const element = { innerHTML: '', textContent: '' };
let captured;
const context = vm.createContext({
  state: { coA: 'Offer A', coB: 'Offer B', closeThreshold: 3, leaveBasisA: 'calendar', leaveBasisB: 'working', factors: [{ name: 'Stability', weight: 100, scoreA: 5, scoreB: 5 }] },
  OfferModel, inputRevision: 0, aiRequestId: 0, currentMode: 'detailed',
  $: () => element, fmtNum: n => String(Math.round(n)), t: key => key, tFactorName: f => f.name,
  fetch: async (url, options) => { captured = JSON.parse(options.body).prompt; return { ok: true, json: async () => ({ text: 'Test recommendation' }) }; }
});
vm.runInContext(source.slice(source.indexOf('function nonNegativeNumber'), source.indexOf('// ── Mutations')), context);
vm.runInContext(source.slice(source.indexOf('async function getAI'), source.indexOf('// ── Persist')), context);
const offer = annual => OfferModel.compute([{ id: 'salary', enabled: true, value: annual / 12, category: 'cash' }], f => f.value);
(async () => {
  await context.getAI(offer(200000), offer(180000), -0.1, -0.1, -0.1);
  assert.ok(captured.includes('Signed expected annual cash difference (Offer 2 minus Offer 1): SAR -20000'));
  assert.ok(captured.includes('Career assessment: not assessed'));
  assert.ok(!captured.includes('Stability:'));
  assert.ok(captured.includes('Offer 1 = unknown; Offer 2 = unknown'));
  assert.ok(captured.includes('Leave comparison allowed: no'));
  assert.ok(captured.includes('not applicable: no net upfront cost'));
  assert.ok(captured.includes('Never invent growth'));
  assert.equal(element.textContent, 'Test recommendation');
  context.state.vacA = 21; context.state.vacB = 30;
  context.state.noticeA = 0;
  context.state.factors[0].scoreB = 8;
  const move = { ...offer(224000), costs: 20000, signOn: 0, firstYearCash: 204000 };
  await context.getAI(offer(200000), move, 0.12, 0.12, 0.12);
  assert.ok(captured.includes('Stability: Offer A=5/10, Offer B=8/10'));
  assert.ok(captured.includes('Leave comparison allowed: no'));
  assert.ok(captured.includes('Notice inputs (months): Offer 1 = 0; Offer 2 = unknown'));
  assert.ok(captured.includes('Recovery estimate: 10 months'));
  context.state.leaveBasisB = 'calendar';
  await context.getAI(offer(200000), move, 0.12, 0.12, 0.12);
  assert.ok(captured.includes('Leave comparison allowed: yes'));
  console.log('AI prompt facts, missing inputs, directional differences and recovery checks passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
