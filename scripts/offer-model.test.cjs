// Regression checks for the offer comparison model (offer/model.js).
// Run: node scripts/offer-model.test.cjs
const assert = require('node:assert/strict');
const M = require('../offer/model.js');

const near = (actual, expected, label) =>
  assert.ok(Math.abs(actual - expected) < 0.01, `${label}: expected ${expected}, got ${actual}`);

const offer = over => ({
  basic: '', housing: '', housingUnit: 'sar', housingRent: '', transport: '', transportUnit: 'sar',
  other: '', deduction: '', gosi: 'legacy', gosiCustom: '', dependents: '', annualGuaranteed: '',
  bonus: '', bonusChance: '50', nonCash: '', signOn: '', switchCost: '', vacation: '', hours: '8', commute: '0',
  ...over
});

// GOSI new-system rate steps each July.
near(M.newcomerRate(new Date(2025, 5, 30)), 9.75, 'newcomer before July 2025');
near(M.newcomerRate(new Date(2025, 6, 1)), 10.25, 'newcomer July 2025');
near(M.newcomerRate(new Date(2026, 10, 10)), 10.75, 'newcomer Nov 2026');
near(M.newcomerRate(new Date(2032, 0, 1)), 11.75, 'newcomer capped after 2028');

// Existing behaviour: net pay with percentage housing and the 45,000 cap.
const sample = M.computeOffer(offer({ basic: '15000', housing: '25', housingUnit: 'pct', transport: '1000', other: '500' }));
near(sample.gosi, 1828.125, 'legacy GOSI on basic + housing');
near(sample.net, 18421.875, 'sample net');
const capped = M.computeOffer(offer({ basic: '60000', housing: '15000' }));
near(capped.gosiBase, 45000, 'GOSI base capped');

// End-of-service award: half month for first 5 years, full month after.
near(M.eosFull(10000, 3), 15000, 'EOS 3 years');
near(M.eosFull(10000, 5), 25000, 'EOS 5 years');
near(M.eosFull(10000, 8), 55000, 'EOS 8 years');
near(M.eosFull(10000, 2.5), 12500, 'EOS fractional year');

// Resignation shares.
near(M.eosPayout(10000, 1.9, 'resign'), 0, 'resign under 2 years');
near(M.eosPayout(10000, 3, 'resign'), 5000, 'resign 3 years = one third');
near(M.eosPayout(10000, 6, 'resign'), 35000 * 2 / 3, 'resign 6 years = two thirds of 35000');
near(M.eosPayout(10000, 10, 'resign'), 75000, 'resign 10 years = full');
near(M.eosPayout(10000, 3, 'end'), 15000, 'contract end = full');

// EOS wage basis options.
const parts = M.computeOffer(offer({ basic: '10000', housing: '2500', transport: '1000', other: '500' }), { eosBasis: 'basic' });
near(parts.eosWage, 10000, 'basis basic');
near(M.computeOffer(offer({ basic: '10000', housing: '2500', transport: '1000' }), { eosBasis: 'basic_housing' }).eosWage, 12500, 'basis basic + housing');
near(M.computeOffer(offer({ basic: '10000', housing: '2500', transport: '1000', other: '500' })).eosWage, 14000, 'basis actual wage');

// Provided housing: no cash, GOSI counts two months of basic per year, rent value added to benefits.
const provided = M.computeOffer(offer({ basic: '12000', housingUnit: 'company', housing: '9999', housingRent: '48000', nonCash: '2000' }));
near(provided.housing, 0, 'provided housing adds no cash');
near(provided.housingInKind, 2000, 'in-kind housing = basic / 6');
near(provided.gosiBase, 14000, 'GOSI base includes in-kind housing');
near(provided.benefits, 50000, 'benefits include rent value');
near(provided.totalValue, provided.expected + 50000, 'total value');

// Expat: no employee GOSI, dependent levy reduces net.
const expat = M.computeOffer(offer({ basic: '10000', housing: '2500', gosi: 'expat', dependents: '3' }));
near(expat.gosi, 0, 'expat GOSI');
near(expat.dependentsFee, 1200, 'dependent levy 3 x 400');
near(expat.net, 11300, 'expat net after levy');
near(M.computeOffer(offer({ basic: '10000', gosi: 'legacy', dependents: '3' })).dependentsFee, 0, 'levy only for expat profile');

// Low basic share warning.
assert.equal(M.computeOffer(offer({ basic: '6000', housing: '1500', other: '4000' })).lowBasic, true, 'low basic flagged');
assert.equal(sample.lowBasic, false, 'normal structure not flagged');

// Horizon: staying vs switching now.
const a = M.computeOffer(offer({ basic: '10000' }));
const b = M.computeOffer(offer({ basic: '12000', signOn: '5000', switchCost: '1000' }));
const h = M.compareHorizon(a, b, { stayYears: 5, tenure: 4, exitType: 'resign' });
near(h.leaveNowEos, 20000 / 3, 'resigning now after 4 years = one third');
near(h.stayEos, 65000 * 2 / 3, 'staying to 9 years then resigning = two thirds of 65000');
near(h.newEos, 30000 * 2 / 3, 'new job 5 years then resigning = two thirds of 30000');
near(h.stayTotal, a.expected * 5 + h.stayEos, 'stay total');
near(h.switchTotal, b.expected * 5 + 5000 - 1000 + h.switchEos, 'switch total');
assert.equal(M.compareHorizon(a, b, {}).years, 5, 'default horizon 5 years');

// Weighted criteria.
assert.equal(M.CRITERIA.length, 16, '16 criteria');
assert.equal(M.CRITERIA.reduce((s, c) => s + c.weight, 0), 95, 'sheet default weights total 95');
const none = M.scoreCriteria({}, {}, {});
assert.equal(none.winner, null, 'no ratings, no winner');
assert.equal(none.ratedCount, 0);
const two = M.scoreCriteria({}, { salary: '10', stability: '2' }, { salary: '8', stability: '9' });
// weights 15 and 10: A = (150 + 20) / 250, B = (120 + 90) / 250
near(two.scoreA, 68, 'score A');
near(two.scoreB, 84, 'score B');
assert.equal(two.winner, 'b');
near(two.advantage, (84 - 68) / 76 * 100, 'advantage over average');
const oneSided = M.scoreCriteria({}, { salary: '10', growth: '5' }, { salary: '10' });
assert.equal(oneSided.ratedCount, 1, 'criterion rated on one side only is skipped');
const zeroWeight = M.scoreCriteria({ salary: '0' }, { salary: '10', stability: '5' }, { salary: '0', stability: '5' });
assert.equal(zeroWeight.winner, 'tie', 'zero weight removes the criterion');
near(M.scoreCriteria({}, { salary: '15' }, { salary: '-3' }).scoreA, 100, 'ratings clamp to 0-10');
assert.equal(M.scoreCriteria({}, { salary: '0' }, { salary: '0' }).winner, 'tie', 'zero ratings still count');

console.log('offer model: all checks passed');
