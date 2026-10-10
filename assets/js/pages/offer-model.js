/* Compensation model: amounts are SAR; annual totals are net of entered deductions. */
(function(root) {
  'use strict';
  const number = value => Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
  const percent = value => Math.min(100, number(value));
  const categories = ['cash', 'guaranteed', 'variable', 'reimbursement', 'noncash'];
  function category(field) {
    if (categories.includes(field.category)) return field.category;
    if (/Medical Insurance/i.test(field.name)) return 'noncash';
    if (/Education|Phone Bill|Flight Ticket/i.test(field.name)) return 'reimbursement';
    if (field.isAnnual && /Bonus/i.test(field.name)) return 'variable';
    return 'cash';
  }
  function rate(payroll) {
    if (payroll.coverage === 'none') return 0;
    if (payroll.override !== '' && payroll.override != null) return percent(payroll.override);
    if (payroll.coverage !== 'new') return 9.75;
    // GOSI's first increase is 1 July 2025; subsequent increases are annual.
    const date = /^\d{4}-\d{2}-\d{2}$/.test(payroll.date || '') ? payroll.date : '2024-07-03';
    let increases = 0;
    for (let year = 2025; year <= 2028; year++) if (date >= year + '-07-01') increases++;
    return 9.75 + increases * 0.5;
  }
  function compute(fields, resolve, transition = {}) {
    let gross = 0, deductions = 0, annualDeductions = 0, guaranteedBonus = 0;
    let targetBonus = 0, expectedBonus = 0, benefitsValue = 0;
    const details = fields.map(field => {
      const value = resolve(field, fields);
      const annual = value * (field.isAnnual ? 1 : 12);
      const kind = category(field);
      const payout = percent(field.payout == null ? 50 : field.payout);
      const usage = percent(field.usage == null ? 100 : field.usage);
      let expected = annual;
      if (field.isDeduction) {
        if (field.isAnnual) annualDeductions += annual;
        else deductions += value;
      } else if (kind === 'variable') {
        targetBonus += annual;
        expected = annual * payout / 100;
        expectedBonus += expected;
      } else if (kind === 'noncash' || kind === 'reimbursement') {
        expected = annual * usage / 100;
        benefitsValue += expected;
      } else if (field.isAnnual) guaranteedBonus += annual;
      else gross += value;
      return { id: field.id, category: field.isDeduction ? 'deduction' : kind, amount: value, annual, expected, payout, usage };
    });
    const net = gross - deductions;
    const year1 = net * 12;
    const guaranteedCash = year1 + guaranteedBonus - annualDeductions;
    const expectedCash = guaranteedCash + expectedBonus;
    const targetCash = guaranteedCash + targetBonus;
    const signOn = number(transition.signOn);
    const costs = number(transition.relocation) + number(transition.lostBonus) + number(transition.repayment) + number(transition.unpaidGap);
    const firstYearCash = expectedCash + signOn - costs;
    return {
      gross, deductions, net, year1, guaranteedCash, expectedCash, targetCash,
      guaranteedBonus, targetBonus, expectedBonus, annualDeductions, benefitsValue,
      bonusMonthly: guaranteedBonus + expectedBonus,
      yearBonus: expectedCash, overallSal: expectedCash / 12,
      annualBenefits: benefitsValue, yearBenefits: expectedCash + benefitsValue,
      overallBen: (expectedCash + benefitsValue) / 12,
      yearly: expectedCash, firstYearCash, signOn, costs,
      departureSettlement: number(transition.departureSettlement), details
    };
  }
  function compare(a, b, threshold = 3) {
    const gap = b.expectedCash - a.expectedCash;
    const scale = Math.max(Math.abs(a.expectedCash), Math.abs(b.expectedCash));
    const close = scale === 0 || Math.abs(gap) / scale <= percent(threshold) / 100;
    const monthlyGain = gap / 12;
    const upfront = (b.costs - b.signOn) - (a.costs - a.signOn);
    return { gap, close, leader: close ? 'close' : gap > 0 ? 'B' : 'A',
      firstYearGap: b.firstYearCash - a.firstYearCash,
      recoveryMonths: upfront <= 0 ? 0 : monthlyGain > 0 ? upfront / monthlyGain : null };
  }
  function qualitative(factors) {
    let weight = 0, scoreA = 0, scoreB = 0;
    (factors || []).forEach(factor => {
      const w = percent(factor.weight);
      weight += w;
      scoreA += Math.min(10, Math.max(1, number(factor.scoreA))) * w;
      scoreB += Math.min(10, Math.max(1, number(factor.scoreB))) * w;
    });
    return { weight, scoreA: weight ? scoreA / weight : null, scoreB: weight ? scoreB / weight : null };
  }
  /* Time and commute analysis: net monthly cash spread over invested hours.
     Reference model: 22 paid working days per month; commute is unpaid time. */
  function timeProfile(result, time) {
    const dailyHours = number(time.dailyHours) || 8;
    const commuteMinutes = number(time.commuteMinutes);
    const workingDays = 22;
    const workHours = dailyHours * workingDays;
    const commuteHours = commuteMinutes / 60 * workingDays;
    const totalHours = workHours + commuteHours;
    const hourlyRate = dailyHours > 0 ? result.net / (workingDays * dailyHours) : 0;
    const commuteTimeCost = hourlyRate * commuteHours * 12;
    return {
      workHours: round2(workHours), commuteHours: round2(commuteHours), totalHours: round2(totalHours),
      hourlyRate: round2(hourlyRate), commuteTimeCost: round2(commuteTimeCost),
      trueHourlyValue: totalHours > 0 ? round2(result.net / totalHours) : 0
    };
  }
  function round2(value) { return Math.round(value * 100) / 100; }
  const model = { number, percent, category, rate, compute, compare, qualitative, timeProfile };
  if (typeof module !== 'undefined' && module.exports) module.exports = model;
  else root.OfferModel = model;
})(typeof globalThis !== 'undefined' ? globalThis : this);
