const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('assets/js/pages/offer.js', 'utf8');
const OfferModel = require('../assets/js/pages/offer-model.js');
const context = vm.createContext({ state: {}, OfferModel, t: key => key });
vm.runInContext(source.slice(source.indexOf('function nonNegativeNumber'), source.indexOf('// ── Mutations')), context);
vm.runInContext(source.slice(source.indexOf('function computeSide'), source.indexOf('function buildWinnerReason')), context);
vm.runInContext(source.slice(source.indexOf('function resolveValueExport'), source.indexOf('// ── Close dropdown')), context);
const field = (id, value, extra = {}) => ({ id, value, enabled: true, ...extra });
const basic = field('basic', 10000);
const housing = field('housing', 0, { isPct: true, pct: 25, pctRef: 'basic' });
const gosi = field('gosi', 0, { isPct: true, pct: 9.75, pctRef: 'basic', pctRef2: 'housing', isGosi: true, isDeduction: true });
context.state.A = [basic, housing, gosi, field('bonus', 0, { category: 'guaranteed', isAnnual: true, isMonths: true, isPct: true, pct: 200, pctRef: 'basic' }), field('annualDed', 0, { isAnnual: true, isMonths: true, isPct: true, pct: 100, pctRef: 'basic', isDeduction: true }), field('benefit', 5000, { category: 'noncash', isAnnual: true })];
const result = context.computeSide('A');
assert.equal(result.net, 11281.25);
assert.equal(result.bonusMonthly, 20000);
assert.equal(result.annualBenefits, 5000);
assert.equal(result.annualDeductions, 10000);
assert.equal(result.yearBenefits, 150375);
assert.equal(result.overallBen * 12, result.yearBenefits);
assert.equal(context.resolveValueExport(gosi, context.state.A), context.resolveValue(gosi, context.state.A));
basic.value = 100000;
assert.equal(context.resolveValue(gosi, context.state.A), 4387.5);
basic.enabled = false;
assert.equal(context.resolveValue(housing, context.state.A), 0);
assert.equal(context.relativeChange(0, 100), Infinity);
assert.equal(context.relativeChange(0, 0), 0);
assert.equal(context.relativeChange(-100, -50), 0.5);
assert.equal(context.relativeChange(80, 100), 0.25);
const cycle = [field('a', 0, { isPct: true, pct: 100, pctRef: 'b' }), field('b', 0, { isPct: true, pct: 100, pctRef: 'a' })];
assert.equal(context.hasReferenceCycle(cycle), true);
assert.equal(context.resolveValue(cycle[0], cycle), 0);
assert.equal(context.hasReferenceCycle(context.state.A), false);
assert.equal(context.resolveValue(field('invalid', Infinity), []), 0);
assert.equal(context.resolveValue(field('negative', -5), []), 0);
assert.equal(context.resolveValue(field('dup', 0, { isPct: true, pct: 100, pctRef: 'base', pctRef2: 'base' }), [field('base', 10)]), 10);
console.log('Offer calculation regression checks passed.');

// Guaranteed cash, variable bonus probability, and medical value are separate.
const acceptance = OfferModel.compute([
  field('salary', 15000, { category: 'cash' }),
  field('target', 30000, { category: 'variable', isAnnual: true, payout: 50 }),
  field('medical', 10000, { category: 'noncash', isAnnual: true, usage: 100 })
], context.resolveValue);
assert.equal(acceptance.guaranteedCash, 180000);
assert.equal(acceptance.expectedCash, 195000);
assert.equal(acceptance.targetCash, 210000);
assert.equal(acceptance.benefitsValue, 10000);
assert.equal(acceptance.net, 15000);
const reimbursement = OfferModel.compute([field('school', 15000, { category: 'reimbursement', isAnnual: true, usage: 40 })], context.resolveValue);
assert.equal(reimbursement.benefitsValue, 6000);
assert.equal(reimbursement.expectedCash, 0);
for (const [date, expected] of [['2025-06-30', 9.75], ['2025-07-01', 10.25], ['2026-07-01', 10.75], ['2027-07-01', 11.25], ['2028-07-01', 11.75]]) {
  assert.equal(OfferModel.rate({ coverage: 'new', date, override: '' }), expected);
}
assert.equal(OfferModel.rate({ coverage: 'legacy', date: '2026-10-10', override: '' }), 9.75);
assert.equal(OfferModel.rate({ coverage: 'none', override: 20 }), 0);
assert.equal(OfferModel.rate({ coverage: 'new', override: 10.5 }), 10.5);
const moved = OfferModel.compute([field('salary', 17000)], context.resolveValue, { signOn: 10000, relocation: 20000, lostBonus: 10000, repayment: 5000, unpaidGap: 5000, departureSettlement: 50000 });
assert.equal(moved.expectedCash, 204000);
assert.equal(moved.firstYearCash, 174000);
assert.equal(moved.departureSettlement, 50000);
const stay = OfferModel.compute([field('salary', 15000)], context.resolveValue);
const comparison = OfferModel.compare(stay, moved, 3);
assert.equal(comparison.firstYearGap, -6000);
assert.equal(comparison.recoveryMonths, 15);
assert.equal(comparison.leader, 'B');
assert.equal(OfferModel.compare(stay, { ...moved, expectedCash: 181000 }, 3).leader, 'close');
assert.equal(OfferModel.compare(stay, { ...stay, costs: 10000, signOn: 0 }, 3).recoveryMonths, null);
assert.equal(OfferModel.qualitative([{ scoreA: 8, scoreB: 6, weight: 20 }, { scoreA: 2, scoreB: 10, weight: 80 }]).scoreA, 3.2);
assert.equal(OfferModel.qualitative([{ scoreA: 8, scoreB: 6, weight: 0 }]).scoreA, null);
context.state.payroll = { A: { coverage: 'new', date: '2026-10-10', override: '' } };
basic.enabled = true; basic.value = 10000;
assert.equal(context.resolveValue(gosi, context.state.A), 1343.75);
console.log('Compensation categories, GOSI dates, transitions and career checks passed.');

const enhancements = fs.readFileSync('assets/js/pages/offer-enhancements.js', 'utf8');
const migrationContext = vm.createContext({
  state: { A: [field('old', 12345, { name: 'Annual Bonus', isAnnual: true }), field('gosi', 0, { name: 'GOSI', isGosi: true, enabled: false, pct: 0 })], B: [], factors: [] },
  OfferModel, STRINGS: { en: {}, ar: {} }, COMPENSATION_LABELS: { en: {}, ar: {} }, DEFAULTS: { A: [], B: [] }, DEFAULT_FACTORS: [], deepClone: value => JSON.parse(JSON.stringify(value))
});
vm.runInContext(enhancements.slice(enhancements.indexOf('function migrateCompensation'), enhancements.indexOf('function invalidateComparison')), migrationContext);
migrationContext.migrateCompensation();
assert.equal(migrationContext.state.A[0].value, 12345);
assert.equal(migrationContext.state.A[0].category, 'variable');
assert.equal(migrationContext.state.A[0].payout, 50);
assert.equal(migrationContext.state.A[0].assumptionReview, true);
assert.equal(migrationContext.state.payroll.A.coverage, 'none');
assert.equal(migrationContext.state.payroll.A.override, '');
migrationContext.state.A[0].payout = 0;
migrationContext.migrateCompensation();
assert.equal(migrationContext.state.A[0].payout, 0);
assert.equal(migrationContext.state.factors.length, 0);
console.log('Saved-offer migration and repeat-load checks passed.');
