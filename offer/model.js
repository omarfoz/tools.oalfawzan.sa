/* Offer comparison model. Pure functions, shared by the page (window.OfferModel) and Node tests. */
(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.OfferModel = api;
})(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const GOSI_CAP = 45000;            // Monthly contributory wage cap (basic + housing).
  const DEPENDENT_FEE = 400;         // Monthly expat dependent levy per dependent.
  const BASIC_SHARE_WARNING = 0.6;   // Warn when basic is under 60% of the monthly package.
  const IN_KIND_HOUSING_MONTHS = 2;  // GOSI values provided housing at two months' basic per year.

  const num = v => { const n = Number(v); return Number.isFinite(n) ? Math.max(0, n) : 0; };
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  // GOSI new-system employee rate: 9.75% rising 0.5 points each July from 2025 to 2028.
  function newcomerRate(date = new Date()) {
    const year = date.getFullYear(), month = date.getMonth();
    const steps = clamp(year - 2024 - (month < 6 ? 1 : 0), 0, 4);
    return 9.75 + steps * 0.5;
  }

  function gosiRate(offer, date) {
    switch (offer.gosi) {
      case 'none':
      case 'expat': return 0;
      case 'newcomer': return newcomerRate(date);
      case 'custom': return Math.min(100, num(offer.gosiCustom));
      default: return 9.75;
    }
  }

  // Full end-of-service award (Labor Law art. 84): half a month per year for the
  // first five years, a full month per year after that, on the last wage.
  function eosFull(monthlyWage, years) {
    const wage = num(monthlyWage), y = num(years);
    return Math.min(y, 5) * wage / 2 + Math.max(0, y - 5) * wage;
  }

  // Share of the award on resignation (art. 85): none under 2 years, one third
  // for 2-5 years, two thirds for 5-10 years, full from 10 years.
  function resignationShare(years) {
    const y = num(years);
    if (y < 2) return 0;
    if (y < 5) return 1 / 3;
    if (y < 10) return 2 / 3;
    return 1;
  }

  function eosPayout(monthlyWage, years, exitType) {
    const full = eosFull(monthlyWage, years);
    return exitType === 'end' ? full : full * resignationShare(years);
  }

  function eosWage(r, basis) {
    if (basis === 'basic') return r.base;
    if (basis === 'basic_housing') return r.base + r.housing + r.housingInKind;
    return r.gross + r.housingInKind;
  }

  function computeOffer(o, options = {}) {
    const base = num(o.basic);
    const allowance = (v, unit) => unit === 'pct' ? base * num(v) / 100 : num(v);
    const companyHousing = o.housingUnit === 'company';
    const housing = companyHousing ? 0 : allowance(o.housing, o.housingUnit);
    const housingInKind = companyHousing ? base * IN_KIND_HOUSING_MONTHS / 12 : 0;
    const housingRent = companyHousing ? num(o.housingRent) : 0;
    const transport = allowance(o.transport, o.transportUnit);
    const other = num(o.other);
    const gross = base + housing + transport + other;
    const rate = gosiRate(o, options.date);
    const gosiBase = Math.min(GOSI_CAP, base + housing + housingInKind);
    const gosi = gosiBase * rate / 100;
    const dependentsFee = o.gosi === 'expat' ? Math.floor(num(o.dependents)) * DEPENDENT_FEE : 0;
    const deduction = num(o.deduction);
    const net = gross - gosi - deduction - dependentsFee;
    const guaranteed = net * 12 + num(o.annualGuaranteed);
    const expectedBonus = num(o.bonus) * Math.min(100, num(o.bonusChance)) / 100;
    const expected = guaranteed + expectedBonus;
    const signOn = num(o.signOn), switchCost = num(o.switchCost);
    const firstYear = expected + signOn - switchCost;
    const benefits = num(o.nonCash) + housingRent;
    const totalValue = expected + benefits;
    const hours = num(o.hours) || 8;
    const commute = num(o.commute);
    const hourly = net / (22 * (hours + commute / 60));
    const packageTotal = gross + housingInKind;
    const basicShare = packageTotal > 0 ? base / packageTotal : 1;
    const result = {
      base, housing, housingInKind, housingRent, companyHousing, transport, other, gross,
      rate, gosiBase, gosi, dependentsFee, deduction, net, guaranteed, expectedBonus, expected,
      signOn, switchCost, firstYear, benefits, totalValue, vacation: num(o.vacation), hourly,
      basicShare, lowBasic: base > 0 && basicShare < BASIC_SHARE_WARNING
    };
    result.eosWage = eosWage(result, options.eosBasis);
    return result;
  }

  // Compare staying in the current job for N more years with switching now.
  // Switching means resigning from the current job today, so its award uses the resignation share.
  function compareHorizon(a, b, settings = {}) {
    const years = clamp(num(settings.stayYears) || 5, 0.5, 40);
    const tenure = clamp(num(settings.tenure), 0, 60);
    const exitType = settings.exitType === 'end' ? 'end' : 'resign';
    const stayEos = eosPayout(a.eosWage, tenure + years, exitType);
    const leaveNowEos = eosPayout(a.eosWage, tenure, 'resign');
    const newEos = eosPayout(b.eosWage, years, exitType);
    const switchEos = leaveNowEos + newEos;
    const stayTotal = a.expected * years + a.signOn - a.switchCost + stayEos;
    const switchTotal = b.expected * years + b.signOn - b.switchCost + switchEos;
    return {
      years, tenure, exitType, stayEos, leaveNowEos, newEos, switchEos, stayTotal, switchTotal,
      leaveNowShare: resignationShare(tenure)
    };
  }

  return {
    GOSI_CAP, DEPENDENT_FEE, BASIC_SHARE_WARNING, IN_KIND_HOUSING_MONTHS,
    num, newcomerRate, gosiRate, eosFull, resignationShare, eosPayout, computeOffer, compareHorizon
  };
});
