/* Offer inputs and result presentation shared by quick and detailed comparison. */
let inputRevision = 0;
let aiRequestId = 0;
let lastCalculatedRevision = -1;
const COMPENSATION_LABELS = {
  en: {
    start_empty: 'Start with your data', use_example: 'Use example',
    example_notice: 'Example data — replace these amounts with your offers.',
    personal_notice: 'Your comparison · changes are saved in this browser.',
    replace_confirm: 'Replace your current inputs? Your saved comparison will be overwritten.',
    field_settings: 'Field settings', months_basic: '× monthly basic salary',
    amount_unit: 'SAR', payroll_edit: 'Review payroll settings', breakdown: 'Full financial breakdown', other_benefits: 'Other annual benefits',
    hero_p: 'Enter both offers to compare monthly take-home pay and annual cash. Your data is saved in this browser.',
    mode_detailed_sub: 'Bonuses, benefits and career priorities',
    missing_salary: 'Enter a positive monthly cash amount for both offers before comparing.', financial_close_title: 'The offers are financially close',
    cash: 'Recurring cash', guaranteed: 'Guaranteed cash / bonus', variable: 'Variable bonus', reimbursement: 'Reimbursement', noncash: 'Noncash benefit', deduction: 'Deduction',
    classification: 'Compensation type', payout: 'Expected payout %', usage: 'Expected usage / value %', edit: 'Edit field',
    assumptions_title: 'Payroll and comparison assumptions', payroll_date: 'Calculation date', coverage: 'GOSI coverage', legacy: 'Existing system', new: 'New system (no contributions before 3 July 2024)', none: 'No employee GOSI', override: 'Employee rate override % (blank = automatic)',
    gosi_details: 'GOSI base / cap / employee rate', threshold: 'Financial closeness threshold %', migration_note: 'Review inferred field types, bonus payout and benefit usage. Legacy values remain saved; bonus payout starts at 50% unless previously specified.',
    transition_title: 'First-year adjustments (SAR)', transition_hint: 'Optional totals for each offer. Enter an unpaid gap as lost cash in SAR. Departure settlements are shown separately and excluded from salary.',
    signOn: 'Sign-on payment', relocation: 'Relocation cost', lostBonus: 'Lost bonus', repayment: 'Repayment / clawback', unpaidGap: 'Unpaid gap (SAR)', departureSettlement: 'Departure settlement (separate)',
    leave_basis: 'Leave day basis', calendar: 'Calendar days', working: 'Working days', not_comparable: 'Not comparable yet', days_unit: 'days',
    results_title: 'Cash, benefits and first-year comparison', metric: 'Metric', difference: 'New − current', guaranteed_cash: 'Guaranteed annual cash', expected_cash: 'Expected annual cash', target_cash: 'Annual cash at full bonus payout', benefits_value: 'Estimated annual benefits value (not cash)', first_year: 'Expected first-year cash', settlement: 'Departure settlement (excluded)', expected_monthly: 'Expected cash / month (annual ÷ 12)',
    weight_pct: 'Relative weight %', recovery: 'Months to recover switching costs', no_recovery: 'Not recovered at this recurring cash difference', no_upfront: 'No net upfront cost', career_scores: 'Career-factor scores (separate from cash)', unscored: 'No weighted scores', stale: 'Inputs changed. Compare again to refresh results.',
    winner_label: 'HIGHER EXPECTED CASH', winner_higher: 'higher expected annual cash', yearly_total: 'EXPECTED ANNUAL CASH', overall_year: 'EXPECTED ANNUAL CASH', overall_month: 'EXPECTED CASH / MONTH', eff_monthly: 'EXPECTED CASH / MONTH',
    package_helper: 'Expected cash includes guaranteed cash plus variable bonus × expected payout. Benefits are valued separately; monthly annualized cash is not your monthly paycheck.',
    summary_qual_used: 'Career-factor scores are shown separately and do not change the financial leader.', summary_close: 'Expected annual cash is financially close under your selected threshold. Consider guarantees and career priorities.',
    summary_assumption: 'Variable bonuses use the entered payout assumptions. Reimbursements and noncash benefits are excluded from cash.', reason_package_lead: '{leader} has higher expected annual cash', summary_financial_lead: '{leader} has higher expected annual cash.',
    ai_prompt_suffix: 'Explain guaranteed and expected cash, benefits and first-year costs separately. Use the calculator signal and entered assumptions. Career scores do not alter the financial leader. Do not invent career advantages, costs, or recovery periods. Identify missing information. No bullet points.', gosi_note_saudi: 'Employee GOSI is based on selected coverage, date and rate override.', benefit_warning: 'Benefit valuations and bonus payouts are estimates, not guaranteed cash.'
  },
  ar: {
    start_empty: 'ابدأ ببياناتك', use_example: 'استخدم المثال',
    example_notice: 'بيانات توضيحية — استبدل هذه المبالغ بعروضك.',
    personal_notice: 'مقارنتك · تُحفظ التغييرات في هذا المتصفح.',
    replace_confirm: 'استبدال المدخلات الحالية؟ ستُستبدل المقارنة المحفوظة.',
    field_settings: 'إعدادات الحقل', months_basic: '× الراتب الأساسي الشهري',
    amount_unit: 'ريال', payroll_edit: 'راجع إعدادات التأمينات', breakdown: 'التفاصيل المالية الكاملة', other_benefits: 'المزايا السنوية الأخرى',
    hero_p: 'أدخل العرضين لمقارنة صافي الراتب الشهري والنقد السنوي. تُحفظ بياناتك في هذا المتصفح.',
    mode_detailed_sub: 'المكافآت والمزايا والأولويات المهنية',
    missing_salary: 'أدخل مبلغاً نقدياً شهرياً أكبر من صفر للعرضين قبل المقارنة.', financial_close_title: 'العرضان متقاربان مالياً',
    cash: 'نقد دوري', guaranteed: 'نقد / مكافأة مضمونة', variable: 'مكافأة متغيرة', reimbursement: 'تعويض مصروفات', noncash: 'ميزة غير نقدية', deduction: 'استقطاع',
    classification: 'نوع التعويض', payout: 'نسبة الصرف المتوقعة %', usage: 'نسبة الاستخدام / القيمة المتوقعة %', edit: 'تعديل الحقل',
    assumptions_title: 'افتراضات الرواتب والمقارنة', payroll_date: 'تاريخ الحساب', coverage: 'نظام التأمينات', legacy: 'النظام السابق', new: 'النظام الجديد (دون اشتراك قبل 3 يوليو 2024)', none: 'دون استقطاع تأمينات للموظف', override: 'تخصيص نسبة الموظف % (فارغ = تلقائي)',
    gosi_details: 'وعاء التأمينات / الحد الأعلى / نسبة الموظف', threshold: 'حد التقارب المالي %', migration_note: 'راجع أنواع الحقول المستنتجة ونسب صرف المكافآت واستخدام المزايا. القيم السابقة محفوظة؛ تبدأ نسبة صرف المكافأة من 50% ما لم تحدد سابقاً.',
    transition_title: 'تعديلات السنة الأولى (ريال)', transition_hint: 'مبالغ اختيارية لكل عرض. أدخل فجوة العمل كقيمة النقد المفقود بالريال. مستحقات المغادرة منفصلة ولا تدخل في الراتب.',
    signOn: 'مكافأة الانضمام', relocation: 'تكلفة الانتقال', lostBonus: 'مكافأة مفقودة', repayment: 'مبالغ واجبة الرد', unpaidGap: 'فجوة دون راتب (ريال)', departureSettlement: 'مستحقات المغادرة (منفصلة)',
    leave_basis: 'أساس أيام الإجازة', calendar: 'أيام تقويمية', working: 'أيام عمل', not_comparable: 'غير قابل للمقارنة بعد', days_unit: 'يوم',
    results_title: 'مقارنة النقد والمزايا والسنة الأولى', metric: 'المقياس', difference: 'الجديد − الحالي', guaranteed_cash: 'النقد السنوي المضمون', expected_cash: 'النقد السنوي المتوقع', target_cash: 'النقد السنوي عند صرف المكافأة كاملة', benefits_value: 'قيمة المزايا السنوية التقديرية (غير نقدية)', first_year: 'النقد المتوقع للسنة الأولى', settlement: 'مستحقات المغادرة (مستبعدة)', expected_monthly: 'النقد المتوقع شهرياً (السنوي ÷ 12)',
    weight_pct: 'الوزن النسبي %', recovery: 'أشهر استرداد تكاليف الانتقال', no_recovery: 'لا تُسترد وفق فارق النقد الدوري', no_upfront: 'دون تكلفة أولية صافية', career_scores: 'درجات العوامل المهنية (منفصلة عن النقد)', unscored: 'دون درجات موزونة', stale: 'تغيرت المدخلات. أعد المقارنة لتحديث النتائج.',
    winner_label: 'النقد المتوقع الأعلى', winner_higher: 'زيادة في النقد السنوي المتوقع', yearly_total: 'النقد السنوي المتوقع', overall_year: 'النقد السنوي المتوقع', overall_month: 'النقد المتوقع شهرياً', eff_monthly: 'النقد المتوقع شهرياً',
    package_helper: 'النقد المتوقع يشمل النقد المضمون والمكافآت المتغيرة × نسبة الصرف المتوقعة. المزايا منفصلة؛ المتوسط الشهري السنوي لا يمثل راتبك الشهري.',
    summary_qual_used: 'تُعرض درجات العوامل المهنية منفصلة ولا تغير صاحب القيمة المالية الأعلى.', summary_close: 'النقد السنوي المتوقع متقارب وفق الحد المختار. راجع الضمانات والأولويات المهنية.',
    summary_assumption: 'تستخدم المكافآت المتغيرة نسب الصرف المدخلة. تعويض المصروفات والمزايا غير النقدية مستبعدة من النقد.', reason_package_lead: '{leader} يقدم نقداً سنوياً متوقعاً أعلى', summary_financial_lead: '{leader} يقدم نقداً سنوياً متوقعاً أعلى.',
    ai_prompt_suffix: 'اشرح النقد المضمون والمتوقع والمزايا وتكاليف السنة الأولى منفصلة. التزم بنتيجة الحاسبة والافتراضات المدخلة. لا تغير الدرجات المهنية صاحب القيمة المالية الأعلى. لا تفترض مزايا مهنية أو تكاليف أو فترات استرداد غير مدخلة. وضّح المعلومات الناقصة. دون نقاط.', gosi_note_saudi: 'استقطاع الموظف وفق النظام والتاريخ والنسبة المخصصة.', benefit_warning: 'قيم المزايا ونسب صرف المكافآت تقديرية وليست نقداً مضموناً.'
  }
};
function migrateCompensation() {
  Object.keys(COMPENSATION_LABELS).forEach(lang => Object.assign(STRINGS[lang], COMPENSATION_LABELS[lang]));
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  state.payroll = state.payroll || {};
  state.transition = state.transition || {};
  state.factors = state.factors || deepClone(DEFAULT_FACTORS);
  state.closeThreshold = state.closeThreshold == null ? 3 : OfferModel.percent(state.closeThreshold);
  ['A', 'B'].forEach(side => {
    if (!Array.isArray(state[side])) state[side] = deepClone(DEFAULTS[side]);
    state[side].forEach(f => {
      if (!f.category) { f.category = OfferModel.category(f); f.assumptionReview = true; }
      if (f.payout == null) f.payout = 50;
      if (f.usage == null) f.usage = 100;
    });
    const gosi = state[side].find(f => f.isGosi);
    state.payroll[side] = state.payroll[side] || { coverage: gosi && gosi.enabled ? 'legacy' : 'none', date: today, override: gosi && gosi.enabled && gosi.pct !== 9.75 ? gosi.pct : '' };
    state.transition[side] = state.transition[side] || {};
    state['leaveBasis' + side] = state['leaveBasis' + side] || 'calendar';
    if (gosi) gosi.pct = OfferModel.rate(state.payroll[side]);
  });
  state.schemaVersion = 4;
}
function invalidateComparison() {
  document.body.classList.remove('offer-has-results');
  inputRevision++;
  if (lastCalculatedRevision < 0) return;
  ['compensationResults', 'resultsWrap', 'simpleResult', 'totalsBar'].forEach(id => {
    const el = $(id);
    if (el) { el.hidden = true; el.style.display = 'none'; }
  });
  $('comparisonStatus').textContent = t('stale');
}
function labeledControl(parent, text, control) {
  const label = document.createElement('label');
  label.className = 'offer-control';
  const span = document.createElement('span');
  span.textContent = text;
  label.append(span, control);
  parent.append(label);
  return control;
}
function numberControl(value, onChange, max) {
  const input = document.createElement('input');
  input.type = 'number'; input.min = '0'; input.step = 'any';
  if (max != null) input.max = String(max);
  input.value = value == null ? '' : value;
  input.addEventListener('input', () => {
    const n = OfferModel.number(input.value);
    const v = max == null ? n : Math.min(max, n);
    onChange(v);
  });
  input.addEventListener('change', () => {
    if (input.value !== '') input.value = max == null ? OfferModel.number(input.value) : Math.min(max, OfferModel.number(input.value));
  });
  return input;
}
function selectControl(value, keys, onChange) {
  const select = document.createElement('select');
  keys.forEach(key => {
    const option = document.createElement('option');
    option.value = key; option.textContent = t(key); select.append(option);
  });
  select.value = value;
  select.addEventListener('change', () => onChange(select.value));
  return select;
}
function makeCompensationControls(field, side) {
  const controls = document.createElement('div');
  controls.className = 'offer-field-controls';
  const settings = document.createElement('details');
  settings.className = 'offer-field-settings';
  const summary = document.createElement('summary');
  summary.textContent = t('field_settings');
  settings.append(summary);
  controls.append(settings);
  const content = document.createElement('div');
  content.className = 'offer-settings-content';
  settings.append(content);
  const edit = document.createElement('button');
  edit.type = 'button'; edit.textContent = t('edit');
  edit.setAttribute('aria-label', t('edit') + ': ' + tFieldName(field));
  edit.addEventListener('click', () => openEditField(side, field.id));
  content.append(edit);
  if (!field.isGosi) {
    const remove = document.createElement('button');
    remove.type = 'button'; remove.textContent = t('remove_field');
    remove.addEventListener('click', () => deleteField(side, field.id));
    content.append(remove);
  }
  if (!field.isDeduction) {
    const change = (key, value) => { field[key] = value; field.assumptionReview = false; if (key === 'category') renderFields(side); autosave(); liveUpdate(); };
    labeledControl(content, t('classification'), selectControl(OfferModel.category(field), ['cash', 'guaranteed', 'variable', 'reimbursement', 'noncash'], value => change('category', value)));
    if (OfferModel.category(field) === 'variable') labeledControl(controls, t('payout'), numberControl(field.payout, value => change('payout', value), 100));
    if (['reimbursement', 'noncash'].includes(OfferModel.category(field))) labeledControl(controls, t('usage'), numberControl(field.usage, value => change('usage', value), 100));
  }
  controls.querySelectorAll('input, select').forEach(control => { control.disabled = !field.enabled; });
  return controls;
}
function renderCompensationSettings() {
  if (!state.payroll) return;
  const parent = $('offerAssumptions');
  parent.replaceChildren();
  if (['A', 'B'].some(side => state[side].some(f => f.assumptionReview))) {
    const note = document.createElement('p'); note.className = 'helper-note'; note.textContent = t('migration_note'); parent.append(note);
  }
  labeledControl(parent, t('threshold'), numberControl(state.closeThreshold, value => { state.closeThreshold = value; autosave(); }, 100));
  const grid = document.createElement('div'); grid.className = 'offer-settings-grid'; parent.append(grid);
  ['A', 'B'].forEach(side => {
    const col = document.createElement('div'); grid.append(col);
    const name = document.createElement('h3'); name.textContent = state['co' + side] || t(side === 'A' ? 'current' : 'new_offer'); col.append(name);
    const payroll = state.payroll[side];
    const sync = () => {
      const gosi = state[side].find(f => f.isGosi);
      if (gosi) { gosi.pct = OfferModel.rate(payroll); gosi.enabled = payroll.coverage !== 'none'; }
      const nat = payroll.coverage === 'none' ? 'nonsaudi' : 'saudi';
      nationality[side] = nat; state.nationality = state.nationality || {}; state.nationality[side] = nat;
      $('nat' + side + '_saudi').classList.toggle('active', nat === 'saudi');
      $('nat' + side + '_nonsaudi').classList.toggle('active', nat !== 'saudi');
      $('natNote' + side).textContent = t(nat === 'saudi' ? 'gosi_note_saudi' : 'gosi_note_non');
      const active = document.activeElement;
      const index = [...parent.querySelectorAll('input, select')].indexOf(active);
      renderFields(side); autosave(); renderCompensationSettings();
      parent.querySelectorAll('input, select')[index]?.focus();
    };
    labeledControl(col, t('coverage'), selectControl(payroll.coverage, ['legacy', 'new', 'none'], value => { payroll.coverage = value; sync(); }));
    const date = document.createElement('input'); date.type = 'date'; date.value = payroll.date;
    date.addEventListener('change', () => { if (date.value) { payroll.date = date.value; sync(); } else date.value = payroll.date; });
    labeledControl(col, t('payroll_date'), date);
    const override = document.createElement('input'); override.type = 'number'; override.min = '0'; override.max = '100'; override.step = '0.01'; override.value = payroll.override;
    override.addEventListener('change', () => { payroll.override = override.value === '' ? '' : OfferModel.percent(override.value); sync(); });
    labeledControl(col, t('override'), override);
    labeledControl(col, t('leave_basis'), selectControl(state['leaveBasis' + side], ['calendar', 'working'], value => { state['leaveBasis' + side] = value; updateVacDiff(); autosave(); }));
    const info = document.createElement('p'); info.id = 'payrollInfo' + side; info.className = 'helper-note'; col.append(info);
  });
  const source = document.createElement('a'); source.href = 'https://awareness.gosi.gov.sa/businessJourney.html'; source.textContent = currentLang === 'ar' ? 'مرجع التأمينات الرسمي' : 'Official GOSI guidance'; parent.append(source);
  const transition = $('transitionSettings'); transition.replaceChildren();
  const details = document.createElement('details'); transition.append(details);
  const summary = document.createElement('summary'); summary.textContent = t('transition_title'); details.append(summary);
  const hint = document.createElement('p'); hint.className = 'helper-note'; hint.textContent = t('transition_hint'); details.append(hint);
  const costsGrid = document.createElement('div'); costsGrid.className = 'offer-settings-grid'; details.append(costsGrid);
  ['A', 'B'].forEach(side => {
    const col = document.createElement('div'); costsGrid.append(col);
    const name = document.createElement('h3'); name.textContent = state['co' + side] || t(side === 'A' ? 'current' : 'new_offer'); col.append(name);
    ['signOn', 'relocation', 'lostBonus', 'repayment', 'unpaidGap', 'departureSettlement'].forEach(key => labeledControl(col, t(key), numberControl(state.transition[side][key] || 0, value => { state.transition[side][key] = value; autosave(); })));
  });
  updatePayrollNotes();
}
function updatePayrollNotes() {
  if (!state.payroll) return;
  ['A', 'B'].forEach(side => {
    const gosi = state[side].find(f => f.isGosi);
    let base = 0;
    if (gosi) base = [...new Set([gosi.pctRef, gosi.pctRef2].filter(Boolean))].reduce((sum, id) => sum + resolveValue(state[side].find(f => f.id === id), state[side]), 0);
    const note = $('payrollInfo' + side);
    if (note) note.textContent = t('gosi_details') + ': SAR ' + fmtNum(Math.min(base, 45000)) + ' / SAR 45,000 / ' + OfferModel.rate(state.payroll[side]) + '%' + (gosi && gosi.enabled ? '' : ' · ' + t('none'));
  });
  $('payrollSummary').textContent = ['A', 'B'].map(side =>
    (state['co' + side] || t(side === 'A' ? 'current' : 'new_offer')) + ': ' +
    (state.payroll[side].coverage === 'none' ? t('none') : OfferModel.rate(state.payroll[side]) + '%')
  ).join(' · ');
}
function renderCompensationResults(a, b) {
  const parent = $('compensationResults'); parent.replaceChildren(); parent.hidden = false; parent.style.display = 'block';
  const comparison = OfferModel.compare(a, b, state.closeThreshold);
  const headline = document.createElement('h2');
  headline.textContent = comparison.close ? t('financial_close_title') : t('summary_financial_lead').replace('{leader}',
    b.expectedCash > a.expectedCash ? (state.coB || t('new_offer')) : (state.coA || t('current')));
  parent.append(headline);
  headline.tabIndex = -1;
  headline.focus({ preventScroll: true });
  const metrics = document.createElement('div'); metrics.className = 'offer-result-metrics'; parent.append(metrics);
  [['net_monthly', 'net'], ['guaranteed_cash', 'guaranteedCash'], ['expected_cash', 'expectedCash']].forEach(([label, key]) => {
    const card = document.createElement('div'); card.className = 'offer-metric';
    const heading = document.createElement('h3'); heading.textContent = t(label); card.append(heading);
    [a[key], b[key], b[key] - a[key]].forEach((value, index) => {
      const row = document.createElement('div');
      const name = document.createElement('span');
      name.textContent = index === 0 ? (state.coA || t('current')) : index === 1 ? (state.coB || t('new_offer')) : t('difference');
      const amount = document.createElement('bdi'); amount.textContent = (index === 2 && value > 0 ? '+' : '') + fmtNum(value) + ' ' + t('amount_unit');
      row.append(name, amount); card.append(row);
    });
    metrics.append(card);
  });
  const assumptions = document.createElement('p'); assumptions.className = 'helper-note'; assumptions.textContent = t('summary_assumption'); parent.append(assumptions);
  const details = document.createElement('details'); parent.append(details);
  const title = document.createElement('summary'); title.textContent = t('breakdown'); details.append(title);
  const scroll = document.createElement('div'); scroll.className = 'offer-table-scroll'; details.append(scroll);
  const table = document.createElement('table'); table.className = 'offer-result-table'; scroll.append(table);
  const head = table.createTHead().insertRow();
  [t('metric'), state.coA || t('current'), state.coB || t('new_offer'), t('difference')].forEach(text => { const th = document.createElement('th'); th.scope = 'col'; th.textContent = text; head.append(th); });
  const body = table.createTBody();
  [['net_monthly', 'net'], ['guaranteed_cash', 'guaranteedCash'], ['expected_cash', 'expectedCash'], ['target_cash', 'targetCash'], ['benefits_value', 'benefitsValue'], ['first_year', 'firstYearCash'], ['settlement', 'departureSettlement']].forEach(([label, key]) => {
    const row = body.insertRow(); const th = document.createElement('th'); th.scope = 'row'; th.textContent = t(label); row.append(th);
    [a[key], b[key], b[key] - a[key]].forEach((value, index) => {
      const cell = row.insertCell();
      cell.dataset.label = index === 0 ? (state.coA || t('current')) : index === 1 ? (state.coB || t('new_offer')) : t('difference');
      const amount = document.createElement('bdi');
      amount.textContent = (index === 2 && value > 0 ? '+' : '') + fmtNum(value) + ' ' + t('amount_unit');
      cell.append(amount);
    });
  });
  const recovery = document.createElement('p'); recovery.textContent = t('recovery') + ': ' + (comparison.recoveryMonths == null ? t('no_recovery') : comparison.recoveryMonths === 0 ? t('no_upfront') : comparison.recoveryMonths.toFixed(1)); parent.append(recovery);
  const assessed = (state.factors || []).some(f => f.weight > 0 && (f.scoreA !== 5 || f.scoreB !== 5));
  const scores = OfferModel.qualitative(state.factors);
  const career = document.createElement('p'); career.textContent = t('career_scores') + ': ' + (assessed && scores.weight ? scores.scoreA.toFixed(1) + '/10 → ' + scores.scoreB.toFixed(1) + '/10' : t('unscored')); parent.append(career);
  const note = document.createElement('p'); note.className = 'helper-note'; note.textContent = t('benefit_warning'); parent.append(note);
}

function updateOfferDataNotice() {
  const notice = $('offerDataNotice');
  if (notice) notice.textContent = t(state.isExample ? 'example_notice' : 'personal_notice');
  $('coNameA').setAttribute('aria-label', t('current_company'));
  $('coNameB').setAttribute('aria-label', t('new_company'));
}

function openPayrollSettings() {
  $('payrollDetails').open = true;
  $('payrollDetails').querySelector('summary').focus();
  $('payrollDetails').scrollIntoView({ block: 'start', behavior: 'smooth' });
}

function alignOfferSections(container) {
  // Share section tracks across desktop cards, even when one offer has extra fields.
  const nodes = [...container.children];
  const groups = {};
  ['monthly', 'deductions', 'totals', 'annual'].forEach(section => {
    const group = document.createElement('div');
    group.className = 'offer-editor-section'; group.dataset.section = section;
    groups[section] = group;
    container.append(group);
  });
  let section = 'monthly';
  nodes.forEach(node => {
    if (node.querySelector('.section-label')?.textContent === t('deductions_section')) section = 'deductions';
    if (node.querySelector('.summary-net')) section = 'totals';
    if (node.tagName === 'HR') section = 'annual';
    groups[section].append(node);
  });
}

function replaceOfferData(example) {
  if (!state.isExample && !confirm(t('replace_confirm'))) return;
  state = deepClone(DEFAULTS);
  state.isExample = example;
  state.factors = deepClone(DEFAULT_FACTORS);
  if (!example) {
    ['A', 'B'].forEach(side => state[side].forEach(field => {
      field.value = 0;
      if (!field.isGosi) { field.isPct = false; field.isMonths = false; field.pct = 0; }
      if (field.isAnnual) field.enabled = false;
    }));
  }
  migrateCompensation();
  ['A', 'B'].forEach(side => {
    $('coName' + side).value = '';
    $('vac' + side).value = ''; $('notice' + side).value = '';
    const hours = $('hours' + side), commute = $('commute' + side);
    if (hours) hours.value = '';
    if (commute) commute.value = '';
    state['hours' + side] = null; state['commute' + side] = null;
    renderFields(side);
  });
  renderCompensationSettings(); renderFactors();
  updateLabels(); updateVacDiff(); updateOfferDataNotice();
  switchCard('A'); autosave();
  $('coNameA').focus();
}

function initOfferUX() {
  // The headline precedes supporting calculations in both modes.
  $('simpleResult').after($('compensationResults'));
  $('startEmptyBtn').addEventListener('click', () => replaceOfferData(false));
  $('useExampleBtn').addEventListener('click', () => replaceOfferData(true));
  const media = matchMedia('(max-width: 640px)');
  const syncPanels = () => {
    ['A', 'B'].forEach(side => {
      const card = $('card' + side);
      if (media.matches) {
        card.setAttribute('role', 'tabpanel');
        card.setAttribute('aria-labelledby', 'tab' + side);
      } else {
        card.removeAttribute('role'); card.setAttribute('aria-labelledby', 'label' + side);
      }
    });
  };
  media.addEventListener('change', syncPanels); syncPanels();
  switchCard('A');
  document.querySelector('.card-tabs').addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const current = $('tabA').getAttribute('aria-selected') === 'true' ? 'A' : 'B';
    const side = event.key === 'Home' ? 'A' : event.key === 'End' ? 'B' : current === 'A' ? 'B' : 'A';
    switchCard(side); $('tab' + side).focus();
  });
  // Avoid covering the active field when a mobile keyboard reduces the viewport.
  const syncKeyboard = () => {
    const editing = document.activeElement?.matches('input, textarea, select');
    document.body.classList.toggle('offer-keyboard-open', Boolean(editing && window.visualViewport &&
      window.visualViewport.height < window.innerHeight * .75));
  };
  window.visualViewport?.addEventListener('resize', syncKeyboard);
  document.addEventListener('focusin', syncKeyboard);
  document.addEventListener('focusout', syncKeyboard);
  updateOfferDataNotice();
}
