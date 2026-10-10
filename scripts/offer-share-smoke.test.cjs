// Smoke test: share-link round trip + timeProfile integration through vm-extracted functions
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const OfferModel = require('../assets/js/pages/offer-model.js');
const source = fs.readFileSync('assets/js/pages/offer.js', 'utf8');
const element = () => ({ value: '', textContent: '', style: {}, hidden: false, classList: { add(){}, remove(){}, toggle(){} }, addEventListener(){}, setAttribute(){} });
const context = vm.createContext({
  state: {}, OfferModel,
  $: id => element(), t: key => key, fmtNum: n => String(Math.round(n)),
  setOfferStatus: () => {}, computeSide: () => ({ net: 10000 }),
  localStorage: { getItem: () => null, setItem(){}, removeItem(){} },
  location: { href: 'https://tools.oalfawzan.sa/offer/?mode=detailed' },
  history: { replaceState(){} }, URL, TextEncoder, TextDecoder, atob, btoa,
  navigator: {}, migrateCompensation: () => {}, updateLabels: () => {}, updateTabLabels: () => {},
  renderFields: () => {}, renderFactors: () => {}, renderCompensationSettings: () => {}, restoreTimeInputs: () => {}
});
// Extract share-link functions
vm.runInContext(source.slice(source.indexOf('function encodeShareState'), source.indexOf('async function copyShareLink')), context);
const sample = { coA: 'Acme', coB: 'Globex', vacA: 21, hoursA: 8, commuteB: 45 };
context.state = sample;
const encoded = context.encodeShareState();
assert.equal(typeof encoded, 'string');
assert.ok(!/[+/=]/.test(encoded), 'base64url must not contain +, /, =');
const decoded = context.decodeShareState(encoded);
assert.deepEqual({ coA: decoded.coA, coB: decoded.coB, vacA: decoded.vacA, hoursA: decoded.hoursA, commuteB: decoded.commuteB }, sample);
assert.equal(context.decodeShareState('!!!invalid!!!'), null);
// timeProfile integration: net 10000, 8h/day, 60min commute
const tp = OfferModel.timeProfile({ net: 10000 }, { dailyHours: 8, commuteMinutes: 60 });
assert.equal(tp.totalHours, 198);
assert.equal(tp.trueHourlyValue, 50.51);
assert.equal(tp.commuteTimeCost, 15000);
console.log('Share-link round trip and time-profile smoke checks passed. Encoded length for sample state:', encoded.length, 'chars');
