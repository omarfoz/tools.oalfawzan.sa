
const $ = id => document.getElementById(id);
const deepClone = o => JSON.parse(JSON.stringify(o));

// ── Field / Factor name translation map ──────────────────────────
const FIELD_NAMES = {
  a2:'field_basic', a3:'field_housing', a4:'field_transport', a5:'field_special',
  a6:'field_gosi',  a7:'field_annual_bonus', a8:'field_education',
  a9:'field_medical_ins', a10:'field_flight_ticket',
  b1:'field_basic', b2:'field_housing', b3:'field_transport', b4:'field_social',
  b5:'field_mobile', b6:'field_gosi', b7:'field_perf_bonus', b8:'field_education',
  b9:'field_phone_bill', b10:'field_medical_ins', b11:'field_flight_ticket',
  f1:'factor_health', f2:'factor_remote', f3:'factor_career_growth',
  f4:'factor_management', f5:'factor_role_scope', f6:'factor_commute',
  f7:'factor_wlb', f8:'factor_job_security', f9:'factor_brand',
};
function tFieldName(f) {
  const key = FIELD_NAMES[f.id];
  return (key && STRINGS[currentLang] && STRINGS[currentLang][key]) ? STRINGS[currentLang][key] : f.name;
}
function tFactorName(f) {
  const key = FIELD_NAMES[f.id];
  return (key && STRINGS[currentLang] && STRINGS[currentLang][key]) ? STRINGS[currentLang][key] : f.name;
}

// ── Defaults ──────────────────────────────────────────────────────
const DEFAULTS = {
  coA: '',
  coB: '',
  A: [
    { id:'a2', name:'Basic Salary',        value:13793, isPct:false, pct:0,    pctRef:'',  isDeduction:false, isAnnual:false, enabled:true },
    { id:'a3', name:'Housing Allowance',   value:0,     isPct:true,  pct:25,   pctRef:'a2',isDeduction:false, isAnnual:false, enabled:true },
    { id:'a4', name:'Transport Allowance', value:0,     isPct:true,  pct:6.9,  pctRef:'a2',isDeduction:false, isAnnual:false, enabled:true },
    { id:'a5', name:'Special Allowance',   value:0,     isPct:true,  pct:15,   pctRef:'a2',isDeduction:false, isAnnual:false, enabled:true },
    { id:'a6', name:'GOSI',                value:0,     isPct:true,  pct:9.75, pctRef:'a2', pctRef2:'a3', isDeduction:true,  isAnnual:false, enabled:true, isGosi:true },
    { id:'a7', name:'Annual Bonus',        value:0,     isPct:true,  pct:200,  pctRef:'a2',isDeduction:false, isAnnual:true,  enabled:true, isMonths:true },
    { id:'a8', name:'Education Allowance', value:15000, isPct:false, pct:0,    pctRef:'',  isDeduction:false, isAnnual:true,  enabled:true },
    { id:'a9', name:'Medical Insurance',   value:5000,  isPct:false, pct:0,    pctRef:'',  isDeduction:false, isAnnual:true,  enabled:false },
    { id:'a10',name:'Annual Flight Ticket',value:3000,  isPct:false, pct:0,    pctRef:'',  isDeduction:false, isAnnual:true,  enabled:false },
  ],
  B: [
    { id:'b1', name:'Basic Salary',        value:14500, isPct:false, pct:0,    pctRef:'',  isDeduction:false, isAnnual:false, enabled:true },
    { id:'b2', name:'Housing Allowance',   value:0,     isPct:true,  pct:25,   pctRef:'b1',isDeduction:false, isAnnual:false, enabled:true },
    { id:'b3', name:'Transport Allowance', value:0,     isPct:true,  pct:10,   pctRef:'b1',isDeduction:false, isAnnual:false, enabled:true },
    { id:'b4', name:'Social Allowance',    value:0,     isPct:true,  pct:12.5, pctRef:'b1',isDeduction:false, isAnnual:false, enabled:true },
    { id:'b5', name:'Mobile Allowance',    value:400,   isPct:false, pct:0,    pctRef:'',  isDeduction:false, isAnnual:false, enabled:true },
    { id:'b6', name:'GOSI',                value:0,     isPct:true,  pct:9.75, pctRef:'b1', pctRef2:'b2', isDeduction:true,  isAnnual:false, enabled:true, isGosi:true },
    { id:'b7', name:'Performance Bonus',   value:0,     isPct:true,  pct:200,  pctRef:'b1',isDeduction:false, isAnnual:true,  enabled:true, isMonths:true },
    { id:'b8', name:'Education Allowance', value:15000, isPct:false, pct:0,    pctRef:'',  isDeduction:false, isAnnual:true,  enabled:true },
    { id:'b9', name:'Phone Bill',          value:4800,  isPct:false, pct:0,    pctRef:'',  isDeduction:false, isAnnual:true,  enabled:true },
    { id:'b10',name:'Medical Insurance',   value:5000,  isPct:false, pct:0,    pctRef:'',  isDeduction:false, isAnnual:true,  enabled:false },
    { id:'b11',name:'Annual Flight Ticket',value:3000,  isPct:false, pct:0,    pctRef:'',  isDeduction:false, isAnnual:true,  enabled:false },
  ]
};

let state = deepClone(DEFAULTS);
let popupSide = null, popupEditId = null;

function ensureSingleCompareRowOnMobile() {
  // Guard against merge regressions where inline CTA misses `inline-compare` class.
  const rows = document.querySelectorAll('.action-row');
  if (rows.length >= 2 && !rows[0].classList.contains('inline-compare')) {
    rows[0].classList.add('inline-compare');
  }
}

// ── Init ──────────────────────────────────────────────────────────
function init() {
  const savedLang = localStorage.getItem('offer_lang') || 'ar';
  applyTheme(currentTheme);
  ensureSingleCompareRowOnMobile();

  try {
    const saved = localStorage.getItem('offer_v31');
    if (saved) state = JSON.parse(saved);
  } catch {}

  if (state.nationality && typeof state.nationality === 'object') {
    nationality.A = state.nationality.A || nationality.A;
    nationality.B = state.nationality.B || nationality.B;
  }

  applyLang(savedLang);
  $('coNameA').value = state.coA;
  $('coNameB').value = state.coB;
  $('coNameA').addEventListener('input', e => { state.coA = e.target.value; updateLabels(); updateTabLabels(); autosave(); liveUpdate(); });
  $('coNameB').addEventListener('input', e => { state.coB = e.target.value; updateLabels(); updateTabLabels(); autosave(); liveUpdate(); });
  updateLabels();
  renderFields('A');
  renderFields('B');

  // Restore vacation/notice fields
  if (state.vacA != null) $('vacA').value  = state.vacA;
  if (state.vacB != null) $('vacB').value  = state.vacB;
  if (state.noticeA != null) $('noticeA').value = state.noticeA;
  if (state.noticeB != null) $('noticeB').value = state.noticeB;
  updateVacDiff();

  // Restore nationality buttons from saved state, falling back to GOSI state
  ['A','B'].forEach(side => {
    const gosiId = side === 'A' ? 'a6' : 'b6';
    const gosi = state[side] && state[side].find(x => x.id === gosiId);
    const inferredNat = (!gosi || gosi.enabled !== false) ? 'saudi' : 'nonsaudi';
    const nat = (state.nationality && state.nationality[side]) || nationality[side] || inferredNat;
    nationality[side] = nat;
    state.nationality = state.nationality || {};
    state.nationality[side] = nat;
    const sa = $('nat' + side + '_saudi'), ns = $('nat' + side + '_nonsaudi');
    if (sa) sa.classList.toggle('active', nat === 'saudi');
    if (ns) ns.classList.toggle('active', nat === 'nonsaudi');
    const note = $('natNote' + side);
    if (note) note.textContent = nat === 'saudi' ? t('gosi_note_saudi') : t('gosi_note_non');
  });

  $('vacA').addEventListener('input', e => { state.vacA = +e.target.value || null; autosave(); updateVacDiff(); });
  $('vacB').addEventListener('input', e => { state.vacB = +e.target.value || null; autosave(); updateVacDiff(); });
  $('noticeA').addEventListener('input', e => { state.noticeA = +e.target.value || null; autosave(); });
  $('noticeB').addEventListener('input', e => { state.noticeB = +e.target.value || null; autosave(); });

  // Restore mode
  try { const m = localStorage.getItem('offer_mode'); if (m === 'detailed') { setMode('detailed'); } else { setMode('simple'); } } catch { setMode('simple'); }
}

function updateVacDiff() {
  const va = +$('vacA').value || 0, vb = +$('vacB').value || 0;
  const el = $('vacDiff');
  if (!va && !vb) { el.textContent = '—'; el.style.color = 'var(--muted)'; return; }
  const diff = vb - va;
  if (diff > 0) { el.textContent = '+' + diff + ' days'; el.style.color = 'var(--current)'; }
  else if (diff < 0) { el.textContent = diff + ' days'; el.style.color = 'var(--danger)'; }
  else { el.textContent = '= same'; el.style.color = 'var(--muted)'; }
}

// ── Mode (Simple / Detailed) ──────────────────────────────────────
let currentMode = 'simple';

function setMode(mode) {
  currentMode = mode;
  document.body.classList.remove('mode-simple', 'mode-detailed');
  document.body.classList.add('mode-' + mode);
  $('modeSimpleBtn').className   = 'mode-btn' + (mode === 'simple'   ? ' active-simple'   : '');
  $('modeDetailedBtn').className = 'mode-btn' + (mode === 'detailed' ? ' active-detailed' : '');
  // hide any stale results when switching modes
  $('simpleResult').style.display = 'none';
  if ($('resultsWrap')) { $('resultsWrap').style.display = 'none'; $('resultsWrap').classList.remove('fadein'); }
  if ($('totalsBar'))   $('totalsBar').style.display   = 'none';
  // persist
  try { localStorage.setItem('offer_mode', mode); } catch {}
  // update compare button label
  updateModeLabels();
}

function updateModeLabels() {
  // button labels already handled by data-i18n; just refresh the sub-text
  const sBtns = document.querySelectorAll('[data-i18n="mode_simple_sub"],[data-i18n="mode_detailed_sub"]');
  sBtns.forEach(el => {
    const key = el.dataset.i18n;
    if (STRINGS[currentLang] && STRINGS[currentLang][key]) el.textContent = STRINGS[currentLang][key];
  });
}

function updateLabels() {
  $('labelA').textContent = state.coA || t('current_company');
  $('labelB').textContent = state.coB || t('new_company');
  const nla = $('natLabelA'), nlb = $('natLabelB');
  if (nla) nla.textContent = state.coA || t('current');
  if (nlb) nlb.textContent = state.coB || t('new_offer');
}

// ── Render ────────────────────────────────────────────────────────
function renderFields(side) {
  const con = $('fields' + side);
  con.innerHTML = '';
  const monthly = state[side].filter(f => !f.isAnnual);
  const annual  = state[side].filter(f =>  f.isAnnual);

  if (monthly.length) {
    const additions   = monthly.filter(f => !f.isDeduction);
    const deductions  = monthly.filter(f =>  f.isDeduction);
    con.appendChild(makeSection('Monthly', 'monthly_section'));
    additions.forEach(f => con.appendChild(makeRow(f, side)));
    if (!deductions.length) {
      const addDedBtn = document.createElement('div');
      addDedBtn.style.cssText = 'padding:6px 16px 10px;border-top:1px dashed var(--border);margin-top:4px';
      addDedBtn.innerHTML = `<button type="button" class="add-field-btn" style="font-size:.65rem" onclick="openAddDeduction('${side}')">${t('add_deduction')}</button>`;
      con.appendChild(addDedBtn);
    }
    if (deductions.length) {
      const dedHdr = document.createElement('div');
      dedHdr.style.cssText = 'padding:8px 16px 4px;border-top:1px dashed rgba(192,57,43,.2);margin-top:4px;display:flex;align-items:center;justify-content:space-between';
      dedHdr.innerHTML = `
        <div class="section-label" style="color:var(--danger);opacity:.7;margin-bottom:0">${t('deductions_section')}</div>
        <button type="button" class="add-field-btn" style="border-color:rgba(255,107,107,.55);color:var(--danger);font-weight:700" onclick="openAddDeduction('${side}')">${t('add_deduction')}</button>
      `;
      con.appendChild(dedHdr);
      deductions.forEach(f => con.appendChild(makeRow(f, side)));
    }

    // Gross = sum of all enabled non-deduction monthly fields
    const grossVal = monthly.filter(f => f.enabled && !f.isDeduction)
      .reduce((sum, f) => sum + resolveValue(f, state[side]), 0);
    const deductVal = monthly.filter(f => f.enabled && f.isDeduction)
      .reduce((sum, f) => sum + resolveValue(f, state[side]), 0);
    const netVal = grossVal - deductVal;
    const color = side === 'A' ? 'var(--current)' : 'var(--new)';

    const summaryRow = document.createElement('div');
    summaryRow.style.cssText = 'border-top:1px solid var(--border);margin-top:2px';
    summaryRow.innerHTML = `
      <div class="summary-gross">
        <span class="summary-label">${t('gross_monthly')}</span>
        <span class="summary-value" style="color:${color}">SAR ${Math.round(grossVal).toLocaleString('en-SA')}</span>
      </div>
      <div class="summary-net">
        <span class="summary-label">${t('net_monthly_salary')}</span>
        <span class="summary-value" style="color:${color}">SAR ${Math.round(netVal).toLocaleString('en-SA')}</span>
      </div>
    `;
    con.appendChild(summaryRow);
  }
  if (annual.length) {
    const hr = document.createElement('hr');
    hr.className = 'divider';
    con.appendChild(hr);
    const annualHeader = document.createElement('div');
    annualHeader.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:12px 16px 2px';
    annualHeader.innerHTML = `
      <div class="section-label" style="margin-bottom:0">${t('annual_section')}</div>
      <button type="button" class="add-field-btn" onclick="openAddFieldAnnual('${side}')">${t('add_field')}</button>
    `;
    con.appendChild(annualHeader);
    annual.forEach(f => con.appendChild(makeRow(f, side)));
  }
  const pad = document.createElement('div');
  pad.style.height = '12px';
  con.appendChild(pad);
  setTimeout(liveUpdate, 0);
}

function makeSection(label, key) {
  const d = document.createElement('div');
  d.className = 'section';
  d.innerHTML = `<div class="section-label">${key ? t(key) : label}</div>`;
  return d;
}

function makeRow(f, side) {
  const val = resolveValue(f, state[side]);
  const display = val;
  const isReadonly = f.isPct;
  const toggleClass = f.enabled ? (side === 'A' ? 'on' : 'on-new') : '';
  const fieldAccessibleName = tFieldName(f);
  const toggleLabel = currentLang === 'ar'
    ? `${f.enabled ? 'تعطيل' : 'تفعيل'} ${fieldAccessibleName}`
    : `${f.enabled ? 'Disable' : 'Enable'} ${fieldAccessibleName}`;
  const nameInputLabel = currentLang === 'ar' ? `اسم الحقل: ${fieldAccessibleName}` : `Field name: ${fieldAccessibleName}`;
  const amountInputLabel = currentLang === 'ar' ? `قيمة ${fieldAccessibleName}` : `${fieldAccessibleName} amount`;
  const row = document.createElement('div');
  row.className = 'field-row' + (f.enabled ? '' : ' disabled');
  row.dataset.id = f.id;

  row.innerHTML = `
    <button type="button" class="toggle ${toggleClass}" onclick="toggleField('${side}','${f.id}')" aria-label="${esc(toggleLabel)}" aria-pressed="${f.enabled ? 'true' : 'false'}"></button>
    <div class="field-name">
      <input class="field-name-input" value="${esc(tFieldName(f))}" aria-label="${esc(nameInputLabel)}"
        onchange="renameField('${side}','${f.id}',this.value)"
        ${!f.enabled ? 'disabled' : ''}>
    </div>
    ${f.isPct ? `<span class="pct-badge">${f.isMonths ? (f.pct/100).toFixed(2).replace(/\.?0+$/,'')+'×' : f.pct+'%'} ${f.pctRef2 ? '(+2 fields)' : ''}</span>` : ''}
    ${f.isAnnual ? `<span class="pct-badge">${t('yearly_input_badge')}</span>` : ''}
    <div class="field-amount">
      ${f.isMonths
        ? `<div style="display:flex;align-items:center;gap:4px">
            <input class="amount-input" type="number" step="0.5" min="0" aria-label="${esc(amountInputLabel)}"
              value="${(f.pct/100).toFixed(2).replace(/\.?0+$/, '')}"
              style="width:60px;text-align:center"
              onchange="updateMultiplier('${side}','${f.id}',this.value)"
              ${!f.enabled ? 'disabled' : ''}>
            <span style="font-size:.72rem;color:var(--muted);font-weight:500">× basic</span>
           </div>`
        : `<input class="amount-input ${isReadonly ? 'readonly' : ''} ${f.isDeduction ? 'is-deduction' : ''}"
            type="number" value="${display.toFixed(0)}" aria-label="${esc(amountInputLabel)}"
            ${isReadonly ? 'readonly' : ''}
            onchange="updateFieldValue('${side}','${f.id}',this.value)"
            ${!f.enabled ? 'disabled' : ''}>`
      }
    </div>
    <button type="button" class="type-btn ${f.isDeduction ? 'deduction' : ''}"
      title="${f.isDeduction ? t('deduction_toggle') : t('addition_toggle')}"
      onclick="toggleDeduction('${side}','${f.id}')">${f.isDeduction ? '−' : '+'}</button>
    <button type="button" class="del-btn" onclick="deleteField('${side}','${f.id}')" title="Remove field">✕</button>
  `;

  // Double-click to edit in popup
  row.addEventListener('dblclick', e => {
    if (['INPUT','BUTTON'].includes(e.target.tagName)) return;
    openEditField(side, f.id);
  });

  return row;
}

function esc(s) { return String(s).replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

// ── Value resolution ──────────────────────────────────────────────
function resolveValue(f, fields) {
  if (!f.enabled) return 0;
  if (f.isPct && f.pctRef) {
    const ref  = fields.find(x => x.id === f.pctRef);
    const ref2 = f.pctRef2 ? fields.find(x => x.id === f.pctRef2) : null;
    let base = (ref ? resolveValue(ref, fields) : 0) + (ref2 ? resolveValue(ref2, fields) : 0);
    // GOSI cap: max base is SAR 45,000
    if (f.isGosi) base = Math.min(base, 45000);
    return (f.pct / 100) * base;
  }
  return f.value || 0;
}

// ── Mutations ─────────────────────────────────────────────────────
function toggleField(side, id) {
  const f = state[side].find(x => x.id === id);
  if (f) { f.enabled = !f.enabled; renderFields(side); autosave(); }
}
function renameField(side, id, name) {
  const f = state[side].find(x => x.id === id);
  if (f) { f.name = name; autosave(); }
}
function updateFieldValue(side, id, val) {
  const f = state[side].find(x => x.id === id);
  if (f) { f.value = parseFloat(val) || 0; renderFields(side); autosave(); }
}
function updateMultiplier(side, id, val) {
  const f = state[side].find(x => x.id === id);
  if (f) { f.pct = (parseFloat(val) || 0) * 100; renderFields(side); autosave(); }
}
function toggleDeduction(side, id) {
  const f = state[side].find(x => x.id === id);
  if (f) { f.isDeduction = !f.isDeduction; renderFields(side); autosave(); }
}
function deleteField(side, id) {
  state[side] = state[side].filter(x => x.id !== id);
  renderFields(side); autosave();
}

// ── Popup ─────────────────────────────────────────────────────────
function openAddField(side) {
  popupSide = side; popupEditId = null;
  $('popupTitle').textContent = t('add_field_title');
  $('popupConfirmBtn').textContent = t('add_field_btn');
  $('pName').value = ''; $('pValue').value = ''; $('pPct').value = '';
  $('pIsPct').checked = false; $('pIsDeduction').checked = false; $('pIsAnnual').checked = false;
  populatePctRef(side, null, null);
  $('pHasRef2').checked = false;
  $('pRef2Wrap').style.display = 'none';
  populatePctRef2(side, null, null);
  if ($('pIsMonths')) $('pIsMonths').checked = false;
  togglePctMode();
  $('popupOverlay').classList.add('open');
  setTimeout(() => $('pName').focus(), 80);
}

function openAddFieldAnnual(side) {
  openAddField(side);
  $('pIsAnnual').checked = true;
}

function openAddDeduction(side) {
  openAddField(side);
  $('pIsDeduction').checked = true;
}

function openEditField(side, id) {
  const f = state[side].find(x => x.id === id);
  if (!f) return;
  popupSide = side; popupEditId = id;
  $('popupTitle').textContent = t('edit_field_title');
  $('popupConfirmBtn').textContent = t('save_btn');
  $('pName').value = f.name;
  $('pValue').value = f.value;
  // isMonths stores pct as months*100 (e.g. 2 months → pct=200). Show the real multiplier.
  $('pPct').value = f.isMonths ? (f.pct / 100) : (f.pct || '');
  $('pIsPct').checked = f.isPct;
  $('pIsDeduction').checked = f.isDeduction;
  $('pIsAnnual').checked = f.isAnnual;
  populatePctRef(side, f.pctRef, id);
  const hasRef2 = !!(f.pctRef2);
  $('pHasRef2').checked = hasRef2;
  $('pRef2Wrap').style.display = hasRef2 ? 'block' : 'none';
  populatePctRef2(side, f.pctRef2, id);
  if ($('pIsMonths')) $('pIsMonths').checked = !!(f.isMonths);
  togglePctMode();
  $('popupOverlay').classList.add('open');
}

function populatePctRef(side, selected, excludeId) {
  const sel = $('pPctRef');
  sel.innerHTML = '';
  state[side].forEach(f => {
    if (f.id === excludeId) return;
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = f.name;
    if (f.id === selected) opt.selected = true;
    sel.appendChild(opt);
  });
}

function populatePctRef2(side, selected, excludeId) {
  const sel = $('pPctRef2');
  sel.innerHTML = '<option value="">— none —</option>';
  state[side].forEach(f => {
    if (f.id === excludeId) return;
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = f.name;
    if (f.id === selected) opt.selected = true;
    sel.appendChild(opt);
  });
}

function togglePctMode() {
  const on = $('pIsPct').checked;
  $('pPctWrap').style.display    = on ? 'block' : 'none';
  $('pValueWrap').style.display  = on ? 'none'  : 'block';
  if ($('pIsMonthsRow')) $('pIsMonthsRow').style.display = on ? 'flex' : 'none';
  toggleMonthsMode();
}

function toggleMonthsMode() {
  const isMonths = $('pIsMonths') && $('pIsMonths').checked;
  if ($('pPctLabel'))  $('pPctLabel').textContent  = isMonths ? t('multiplier_lbl') : t('pct_lbl');
  if ($('pPctUnit'))   $('pPctUnit').textContent   = isMonths ? t('multiplier_unit') : t('pct_unit');
  if ($('pPct'))       $('pPct').placeholder       = isMonths ? '2.5' : '25';
}

function toggleRef2() {
  const on = $('pHasRef2').checked;
  $('pRef2Wrap').style.display = on ? 'block' : 'none';
}

function confirmField() {
  const name        = $('pName').value.trim();
  const value       = parseFloat($('pValue').value) || 0;
  const isPct       = $('pIsPct').checked;
  const pct         = parseFloat($('pPct').value) || 0;
  const pctRef      = $('pPctRef').value || '';
  const pctRef2     = $('pHasRef2').checked ? ($('pPctRef2').value || '') : '';
  const isMonths    = $('pIsPct') && $('pIsPct').checked && $('pIsMonths') && $('pIsMonths').checked;
  // If months mode, store pct as months*100 so resolveValue returns months*basicVal
  const finalPct    = isMonths ? (parseFloat($('pPct').value)||0) * 100 : (parseFloat($('pPct').value)||0);
  const isDeduction = $('pIsDeduction').checked;
  const isAnnual    = $('pIsAnnual').checked;
  if (!name) { $('pName').focus(); return; }
  if (isPct && !pctRef) { $('pPctRef').focus(); return; }

  if (popupEditId) {
    const f = state[popupSide].find(x => x.id === popupEditId);
    if (f) Object.assign(f, { name, value, isPct, pct: finalPct, pctRef, pctRef2, isDeduction, isAnnual, isMonths });
  } else {
    state[popupSide].push({
      id: popupSide.toLowerCase() + Date.now(),
      name, value, isPct, pct: finalPct, pctRef, pctRef2, isDeduction, isAnnual, isMonths, enabled: true
    });
  }
  renderFields(popupSide);
  autosave();
  closePopup();
}

function closePopup() { $('popupOverlay').classList.remove('open'); }
$('popupOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closePopup(); });

// ── Calculate ─────────────────────────────────────────────────────
function liveUpdate() {
  try {
    const a = computeSide('A');
    const b = computeSide('B');
    const fmtK = n => 'SAR ' + Math.round(n).toLocaleString('en-SA');
    // Detailed mode: update overall card
    if ($('oYearA') && currentMode === 'detailed') {
      $('oYearA').textContent  = fmtK(a.yearBenefits);
      $('oYearB').textContent  = fmtK(b.yearBenefits);
      $('oMonthA').textContent = fmtK(a.overallBen);
      $('oMonthB').textContent = fmtK(b.overallBen);
      const py = a.yearBenefits ? (b.yearBenefits - a.yearBenefits) / a.yearBenefits : 0;
      const bg  = py > 0.005 ? 'rgba(0,200,150,.15)' : py < -0.005 ? 'rgba(255,71,87,.15)' : 'rgba(255,255,255,.06)';
      const col = py > 0.005 ? 'var(--current)'      : py < -0.005 ? 'var(--danger)'        : 'var(--muted)';
      const txt = py > 0.005 ? '+' + (py*100).toFixed(1)+'%' : py < -0.005 ? (py*100).toFixed(1)+'%' : '≈';
      const badgeStyle = `background:${bg};color:${col}`;
      $('oYearBadge').textContent  = txt; $('oYearBadge').style.cssText  = `${badgeStyle};font-size:.65rem;font-weight:700;padding:2px 8px;border-radius:10px`;
      $('oMonthBadge').textContent = txt; $('oMonthBadge').style.cssText = `${badgeStyle};font-size:.65rem;font-weight:700;padding:2px 8px;border-radius:10px`;
    }
  } catch(e) {}
}

function computeSide(side) {
  const fields = state[side];
  let gross = 0, deductions = 0, bonusMonthly = 0, annualBenefits = 0;

  fields.forEach(f => {
    if (!f.enabled) return;
    const v = resolveValue(f, fields);
    if (f.isAnnual) {
      if (f.isMonths) bonusMonthly += v;            // bonus months × basic → yearly
      else if (f.isDeduction) annualBenefits -= v;  // annual deductions reduce total
      else annualBenefits += v;                     // fixed annual benefits
    } else {
      if (f.isDeduction) deductions += v;
      else gross += v;
    }
  });

  const net         = gross - deductions;           // Net Monthly Salary
  const year1       = net * 12;                     // 1 Year (net × 12)
  const yearBonus   = year1 + bonusMonthly;         // 1 Year + Bonuses
  const overallSal  = yearBonus / 12;               // Overall Salary (monthly)
  const yearBenefits= yearBonus + annualBenefits;   // Overall with Benefits (year)
  const overallBen  = yearBenefits / 12;            // Overall with Benefits (monthly)

  return {
    gross, deductions, net,
    year1, bonusMonthly, annualBenefits,
    yearBonus, overallSal,
    yearBenefits, overallBen,
    yearly: yearBenefits   // used for % comparison
  };

}

function buildWinnerReason(a, b, py, pn) {
  const coA = state.coA || t('current');
  const coB = state.coB || t('new_offer');
  const reasons = [];
  if (Math.abs(py) > 0.005) reasons.push(t('reason_package_lead').replace('{leader}', py > 0 ? coB : coA));
  if (Math.abs(pn) > 0.005) reasons.push(t('reason_net_lead').replace('{leader}', pn > 0 ? coB : coA));
  const vacDiff = (state.vacB || 0) - (state.vacA || 0);
  if (Math.abs(py) <= 0.03 && vacDiff !== 0) reasons.push(t('reason_vacation_lead').replace('{leader}', vacDiff > 0 ? coB : coA));
  return reasons.length ? reasons.join(' · ') : t('summary_close');
}

function updateDecisionSummary(a, b, py, pn) {
  const coA = state.coA || t('current');
  const coB = state.coB || t('new_offer');
  const parts = [];
  if (Math.abs(py) <= 0.03) parts.push(t('summary_close'));
  else parts.push(t('summary_financial_lead').replace('{leader}', py > 0 ? coB : coA));
  if (Math.abs(pn) > 0.005) parts.push(t('summary_net_lead').replace('{leader}', pn > 0 ? coB : coA));
  const factors = state.factors || [];
  const hasCustomScores = factors.some(f => f.scoreA !== 5 || f.scoreB !== 5);
  parts.push(hasCustomScores ? t('summary_qual_used') : t('summary_qual_unused'));
  parts.push(t('summary_assumption'));
  if ($('decisionSummaryText')) $('decisionSummaryText').textContent = parts.join(' ');
}

function calculate() {
  const a = computeSide('A'), b = computeSide('B');
  const pg = a.gross   ? (b.gross   - a.gross)   / a.gross   : 0;
  const pn = a.net     ? (b.net     - a.net)     / a.net     : 0;
  const py = a.yearly  ? (b.yearly  - a.yearly)  / a.yearly  : 0;
  const fmtK = n => 'SAR ' + Math.round(n).toLocaleString('en-SA');

  // ── SIMPLE MODE ──────────────────────────────────────────────────
  if (currentMode === 'simple') {
    const coA = state.coA || t('current');
    const coB = state.coB || t('new_offer');
    const card = $('winnerCard');
    const pctStr = p => (p >= 0 ? '+' : '') + (p * 100).toFixed(1) + '%';
    const smBadge = (p, el) => {
      const bg  = p > 0.005 ? 'rgba(0,200,150,.15)' : p < -0.005 ? 'rgba(255,71,87,.15)' : 'rgba(255,255,255,.06)';
      const col = p > 0.005 ? 'var(--current)'      : p < -0.005 ? 'var(--danger)'        : 'var(--muted)';
      const txt = Math.abs(p) > 0.005 ? pctStr(p) : '≈';
      el.textContent = txt; el.style.cssText = `background:${bg};color:${col};font-size:.6rem;font-weight:700;padding:2px 6px;border-radius:8px`;
    };
    // winner
    card.className = 'winner-card';
    $('winnerName').style.color = ''; // reset any inline tie-color
    if (py > 0.005) {
      card.classList.add('winner-b');
      $('winnerLabel').textContent = t('winner_label');
      $('winnerName').textContent  = coB;
      $('winnerName').className    = 'winner-name wc-b';
      $('winnerUplift').textContent = '+' + (py*100).toFixed(1) + '% ' + t('winner_higher');
      $('winnerReason').textContent = t('winner_reason').replace('{reason}', buildWinnerReason(a, b, py, pn));
    } else if (py < -0.005) {
      card.classList.add('winner-a');
      $('winnerLabel').textContent = t('winner_label');
      $('winnerName').textContent  = coA;
      $('winnerName').className    = 'winner-name wc-a';
      $('winnerUplift').textContent = Math.abs(py*100).toFixed(1) + '% ' + t('winner_higher');
      $('winnerReason').textContent = t('winner_reason').replace('{reason}', buildWinnerReason(a, b, py, pn));
    } else {
      card.classList.add('winner-tie');
      $('winnerLabel').textContent = t('winner_tied_label');
      $('winnerName').textContent  = t('winner_tied');
      $('winnerName').className    = 'winner-name';
      $('winnerName').style.color  = 'var(--muted2)';
      $('winnerUplift').textContent = t('winner_tied_sub');
      $('winnerReason').textContent = t('winner_reason').replace('{reason}', buildWinnerReason(a, b, py, pn));
    }
    $('smNetA').textContent  = fmtK(a.net);
    $('smNetB').textContent  = fmtK(b.net);
    smBadge(pn, $('smNetBadge'));
    $('smYearA').textContent = fmtK(a.yearBenefits);
    $('smYearB').textContent = fmtK(b.yearBenefits);
    smBadge(py, $('smYearBadge'));
    // vacation — always reset first
    $('smVacCell').style.display    = 'none';
    $('smNoticeCell').style.display = 'none';
    const va = state.vacA, vb = state.vacB;
    if (va || vb) {
      $('smVacCell').style.display = '';
      $('smVacA').textContent = va ? va + ' d' : '—';
      $('smVacB').textContent = vb ? vb + ' d' : '—';
      const vacDiff = (vb || 0) - (va || 0);
      const vacEl = $('smVacBadge');
      vacEl.textContent = vacDiff > 0 ? '+' + vacDiff + ' d' : vacDiff < 0 ? vacDiff + ' d' : '≈';
      vacEl.style.cssText = `background:${vacDiff > 0 ? 'rgba(0,200,150,.15)' : vacDiff < 0 ? 'rgba(255,71,87,.15)' : 'rgba(255,255,255,.06)'};color:${vacDiff > 0 ? 'var(--current)' : vacDiff < 0 ? 'var(--danger)' : 'var(--muted)'};font-size:.6rem;font-weight:700;padding:2px 6px;border-radius:8px`;
    }
    // notice
    const na = state.noticeA, nb = state.noticeB;
    if (na || nb) {
      $('smNoticeCell').style.display = '';
      $('smNoticeA').textContent = na ? na + ' mo' : '—';
      $('smNoticeB').textContent = nb ? nb + ' mo' : '—';
    }
    $('simpleResult').style.display = 'block';
    $('simpleResult').classList.add('fadein');
    $('simpleResult').scrollIntoView({ behavior:'smooth', block:'start' });
    updateDecisionSummary(a, b, py, pn);
    getAI(a, b, pg, pn, py);
    $('resultsWrap').style.display = 'block';
    $('resultsWrap').classList.add('fadein');
    return;
  }

  // ── DETAILED MODE ────────────────────────────────────────────────
  const pctStr = p => (p >= 0 ? '+' : '') + (p * 100).toFixed(1) + '%';
  const badgeHtml = (p) => {
    const txt = p > 0.005 ? pctStr(p) : p < -0.005 ? pctStr(p) : '≈';
    const bg  = p > 0.005 ? 'rgba(0,200,150,.15)' : p < -0.005 ? 'rgba(255,71,87,.15)' : 'rgba(255,255,255,.06)';
    const col = p > 0.005 ? 'var(--current)' : p < -0.005 ? 'var(--danger)' : 'var(--muted)';
    return `<span class="total-badge" style="background:${bg};color:${col}">${txt}</span>`;
  };
  $('tNetA').textContent  = fmtK(a.net);
  $('tNetB').textContent  = fmtK(b.net);
  $('tNetBadge').outerHTML = badgeHtml(pn).replace('class="total-badge"', 'id="tNetBadge" class="total-badge"');
  $('tYearA').textContent  = fmtK(a.yearBenefits);
  $('tYearB').textContent  = fmtK(b.yearBenefits);
  $('tYearBadge').outerHTML = badgeHtml(py).replace('class="total-badge"', 'id="tYearBadge" class="total-badge"');
  $('tEffA').textContent   = fmtK(a.overallBen);
  $('tEffB').textContent   = fmtK(b.overallBen);
  $('tEffBadge').outerHTML = badgeHtml(py).replace('class="total-badge"', 'id="tEffBadge" class="total-badge"');
  $('totalsBar').style.display = 'block';

  // Overall salary with benefits
  const oYearA  = a.yearBenefits;
  const oYearB  = b.yearBenefits;
  const oMonthA = a.overallBen;
  const oMonthB = b.overallBen;
  const poYear  = oYearA ? (oYearB - oYearA) / oYearA : 0;

  $('oYearA').textContent  = fmtK(oYearA);
  $('oYearB').textContent  = fmtK(oYearB);
  $('oYearBadge').outerHTML  = badgeHtml(poYear).replace('class="total-badge"', 'id="oYearBadge" class="total-badge"');
  $('oMonthA').textContent = fmtK(oMonthA);
  $('oMonthB').textContent = fmtK(oMonthB);
  $('oMonthBadge').outerHTML = badgeHtml(poYear).replace('class="total-badge"', 'id="oMonthBadge" class="total-badge"');


  const fmt = n => Math.round(n).toLocaleString('en-SA');
  const pf  = p => (p >= 0 ? '+' : '') + (p * 100).toFixed(1) + '%';
  const bdg = p => p > 0.005 ? `<span class="badge badge-up">${pf(p)}</span>` : p < -0.005 ? `<span class="badge badge-dn">${pf(p)}</span>` : `<span class="badge badge-eq">≈</span>`;

  const br = STRINGS[currentLang].breakdown_rows;
  const rows = [
    { l: br.gross,    a: a.gross,          b: b.gross        },
    { l: br.gosi,     a: a.deductions,     b: b.deductions   },
    { l: br.net,      a: a.net,            b: b.net          },
    { l: br.year1,    a: a.year1,          b: b.year1        },
    { l: br.year_bonus,a: a.yearBonus,     b: b.yearBonus    },
    { l: br.overall_sal,a: a.overallSal,   b: b.overallSal   },
    { l: br.annual_ben, a: a.annualBenefits,b:b.annualBenefits},
    { l: br.annual_ben_month, a: a.annualBenefits / 12, b: b.annualBenefits / 12 },
    { l: br.year_ben,  a: a.yearBenefits,  b: b.yearBenefits },
    { l: br.month_ben, a: a.overallBen,    b: b.overallBen   },
  ];

  const coA = state.coA || t('current');
  const coB = state.coB || t('new_offer');

  $('breakdownRows').innerHTML =
    `<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:10px;margin-bottom:14px;padding:0 4px">
      <span style="font-size:.72rem;color:var(--current);font-weight:700">${coA}</span>
      <span></span>
      <span style="font-size:.72rem;color:var(--new);font-weight:700;text-align:right">${coB}</span>
    </div>` +
    rows.map(r => {
      const p = r.a ? (r.b - r.a) / Math.abs(r.a) : 0;
      return `<div class="cmp-row">
        <div class="cmp-lbl">${r.l}</div>
        <div class="cmp-val cv">SAR ${fmt(r.a)}</div>
        <div class="cmp-mid">vs<br>${bdg(p)}</div>
        <div class="cmp-val nv">SAR ${fmt(r.b)}</div>
      </div>`;
    }).join('');

  $('resultsWrap').style.display = 'block';
  $('resultsWrap').classList.add('fadein');
  $('resultsWrap').scrollIntoView({ behavior: 'smooth', block: 'start' });

  updateDecisionSummary(a, b, py, pn);
  getAI(a, b, pg, pn, py);
}



// ── AI ────────────────────────────────────────────────────────────
async function getAI(a, b, pg, pn, py) {

  $('aiText').innerHTML =
    '<div class="dot-pulse"><span></span><span></span><span></span></div>';

  const fmt = n => Math.round(n).toLocaleString('en-SA');
  const coA = state.coA || t('current_company');
  const coB = state.coB || t('new_company');

  // ── Build qualitative factors summary ──
  const factors = state.factors || [];
  let qualSection = '';

  // Only include factors in prompt when in detailed mode OR when user actually scored them
  const hasCustomScores = factors.some(f => f.scoreA !== 5 || f.scoreB !== 5);
  if (factors.length && (currentMode === 'detailed' || hasCustomScores)) {

    const totalWeight =
      factors.reduce((s, f) => s + (f.weight || 0), 0) || 1;

    const scoreA =
      factors.reduce((s, f) => s + (f.scoreA * f.weight / totalWeight), 0);

    const scoreB =
      factors.reduce((s, f) => s + (f.scoreB * f.weight / totalWeight), 0);

    // Only list factors that were actually customised to keep prompt concise
    const scoredFactors = currentMode === 'detailed'
      ? factors
      : factors.filter(f => f.scoreA !== 5 || f.scoreB !== 5);

    const rows = scoredFactors.map(f =>
      `  - ${tFactorName(f)}: ${coA}=${f.scoreA}/10, ${coB}=${f.scoreB}/10 (weight ${f.weight}%)`
    ).join('\n');

    qualSection =
`\n\nQualitative Factors (weighted scores — ${coA}: ${scoreA.toFixed(1)}/10, ${coB}: ${scoreB.toFixed(1)}/10):
${rows}`;

  }

  const annualGap = b.yearBenefits - a.yearBenefits;
  const netGap = b.net - a.net;
  const effGap = b.overallBen - a.overallBen;
  const financialLeader = py > 0.03 ? coB : py < -0.03 ? coA : 'close';
  const netLeader = pn > 0.03 ? coB : pn < -0.03 ? coA : 'close';

  const prompt = `You are a senior HR, compensation, and career decision advisor specializing in the Saudi Arabian job market.

Your task is to compare two job offers and give a practical recommendation for a professional deciding whether to stay or move.

Decision rules:
1. Prioritize the total annual package.
2. Use net monthly salary as the second most important factor.
3. Use effective monthly value only to make the package easier to understand.
4. Use qualitative factors, vacation days, and notice period as modifiers, not as replacements for a material financial gap.
5. If the annual package difference is about 3% or less, say the offers are financially close and explain which qualitative factors should decide.
6. Be direct, specific, and practical.
7. End with a clear recommendation: choose ${coA}, choose ${coB}, or either is reasonable depending on priorities.

Offer 1 — ${coA}
- Gross monthly salary: SAR ${fmt(a.gross)}
- Net monthly salary: SAR ${fmt(a.net)}
- Total annual package: SAR ${fmt(a.yearBenefits)}
- Effective monthly value: SAR ${fmt(a.overallBen)}${state.vacA ? `
- Vacation days per year: ${state.vacA}` : ''}${state.noticeA ? `
- Notice period: ${state.noticeA} month(s)` : ''}

Offer 2 — ${coB}
- Gross monthly salary: SAR ${fmt(b.gross)}
- Net monthly salary: SAR ${fmt(b.net)}
- Total annual package: SAR ${fmt(b.yearBenefits)}
- Effective monthly value: SAR ${fmt(b.overallBen)}${state.vacB ? `
- Vacation days per year: ${state.vacB}` : ''}${state.noticeB ? `
- Notice period: ${state.noticeB} month(s)` : ''}

Financial comparison:
- Gross monthly change: ${(pg*100).toFixed(1)}%
- Net monthly change: ${(pn*100).toFixed(1)}%
- Total annual package change: ${(py*100).toFixed(1)}%
- Annual package gap: SAR ${fmt(Math.abs(annualGap))}
- Net monthly gap: SAR ${fmt(Math.abs(netGap))}
- Effective monthly gap: SAR ${fmt(Math.abs(effGap))}
- Preliminary calculator signal: financial lead = ${financialLeader}, net monthly lead = ${netLeader}
${qualSection}

${t('ai_lang_instruction')}
${t('ai_prompt_suffix')}

Write 4–6 sentences in a confident advisory tone. No bullet points.`;

  try {

    const res = await fetch(
      "https://tools.niug502.workers.dev",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      }
    );

    const data = await res.json();

    const text =
      data?.text ||
      t('ai_unavailable');

    $('aiText').textContent = text;

  } catch (err) {

    $('aiText').textContent = t('ai_unavailable');

  }

}

// ── Persist ───────────────────────────────────────────────────────
function autosave() { localStorage.setItem('offer_v31', JSON.stringify(state)); }

// ── i18n ──────────────────────────────────────────────────────────
const STRINGS = {
  en: {
    tool_tag:'// TOOL_01', hero_h1_line1:'Job Offer', hero_h1_line2:'Comparator',
    hero_p:'Fully customizable. Rename any field, toggle it on/off, add your own, set a field as % of another. Auto-saves to your browser.',
    current_company:'Current Company', new_company:'New Company',
    nationality:'Nationality', saudi:'🇸🇦 Saudi', non_saudi:'🌍 Non-Saudi',
    current:'Current', new_offer:'New Offer',
    add_field:'+ Add Field', add_deduction:'+ Add Deduction',
    qualitative_factors:'// Qualitative Factors',
    factors_hint:'Rate each factor 1–10 · weight what matters most · used mainly when offers are close',
    add_factor:'+ Add Factor', compare_btn:'Compare Offers',
    net_monthly:'NET MONTHLY', yearly_total:'YEARLY TOTAL', eff_monthly:'EFFECTIVE MONTHLY VALUE',
    overall_year:'TOTAL ANNUAL PACKAGE',
    overall_month:'EFFECTIVE MONTHLY VALUE',
    full_breakdown:'// Full Breakdown', ai_title:'AI Recommendation',
    add_field_title:'Add Field', field_name_lbl:'FIELD NAME',
    amount_lbl:'AMOUNT (SAR/MONTH)', pct_lbl:'% OF FIELD',
    calc_pct:'Calculate as % of another field',
    annual_amt:'Annual amount (enter full yearly value)',
    yearly_input_badge:'yearly',
    add_field_btn:'Add Field', cancel_btn:'Cancel', edit_field_title:'Edit Field', deduction_lbl:'Deduction (subtracted from total)',
    ref2_hint:'Add a second field (e.g. GOSI = Basic + Housing)',
    monthly_section:'Monthly', annual_section:'Annual Benefits',
    deductions_section:'Deductions', gross_monthly:'GROSS MONTHLY SALARY',
    net_monthly_salary:'NET MONTHLY SALARY', qualitative_score:'QUALITATIVE SCORE',
    reset_btn:'↺ Reset', save_btn:'Save', portfolio_btn:'← Portfolio',
    reset_confirm:'Reset everything to defaults?', saved_txt:'✓ Saved',
    gosi_note_saudi:'',
    gosi_note_non:'Non-Saudi: no GOSI deduction from employee salary',
    deduction_toggle:'Deduction — click to toggle', addition_toggle:'Addition — click to mark as deduction',
    weight_lbl:'WEIGHT %', remove_factor:'✕ Remove',
    ai_unavailable:'AI unavailable. The breakdown above tells the full story.',
    breakdown_rows: {
      gross:'GROSS MONTHLY SALARY', gosi:'GOSI / DEDUCTIONS', net:'NET MONTHLY SALARY',
      year1:'1 YEAR (NET × 12)', year_bonus:'1 YEAR + BONUSES', overall_sal:'OVERALL SALARY (÷12)',
      annual_ben:'OTHER ANNUAL BENEFITS', annual_ben_month:'OTHER ANNUAL BENEFITS (÷12)', year_ben:'OVERALL SALARY WITH BENEFITS/YEAR',
      month_ben:'OVERALL SALARY WITH BENEFITS/MONTH'
    },
    ai_prompt_suffix:'Use overall annual package as the main decision factor, net monthly as the second factor, and qualitative factors mainly when the offers are close. Give a direct recommendation with exact numbers. No bullet points.',
    ai_lang_instruction:'Respond in English.',
    new_factor:'New Factor',
    export_btn:'⬇ Export Excel',
    saudi_short:'Saudi', non_saudi_short:'Non-Saudi',
    multiplier_lbl:'SALARY MULTIPLIER', multiplier_unit:'× basic salaries of',
    pct_unit:'% of',
    built_by:'Built by', figures_note:'Figures are estimates',
    mode_simple_label:'Quick Compare', mode_simple_sub:'Job Seeker · Fast answer',
    mode_detailed_label:'Full Analysis', mode_detailed_sub:'HR / Finance · Every detail',
    winner_label:'WINNER', winner_higher:'higher total package', winner_reason:'Why: {reason}',
    winner_tied_label:'RESULT', winner_tied:'Roughly Equal', winner_tied_sub:'Both offers are very close financially',
    field_basic:'Basic Salary', field_housing:'Housing Allowance',
    field_transport:'Transport Allowance', field_special:'Special Allowance',
    field_gosi:'GOSI', field_annual_bonus:'Annual Bonus',
    field_education:'Education Allowance', field_social:'Social Allowance',
    field_mobile:'Mobile Allowance', field_perf_bonus:'Performance Bonus',
    field_phone_bill:'Phone Bill',
    field_medical_ins:'Medical Insurance', field_flight_ticket:'Annual Flight Ticket',
    factor_health:'Benefits Quality', factor_remote:'Remote Work / Flexibility',
    factor_career_growth:'Career Growth & Learning', factor_management:'Management Quality',
    factor_commute:'Commute & Location', factor_wlb:'Work-Life Balance',
    factor_job_security:'Job Security & Stability', factor_brand:'Company Brand & Reputation', factor_role_scope:'Role Scope & Seniority',
    hr_context_label:'Role & Context (optional)',
    hr_context_placeholder:'e.g. Senior Engineer, 8 yrs exp, Riyadh',
    vacation_lbl:'Vacation Days / Year', notice_lbl:'Notice Period (months)',
    hr_context_hint:'Helps the AI give a more tailored recommendation',
    vac_diff_lbl:'VACATION DIFF',
    package_helper:'Total annual package includes enabled annual bonus and annual benefits. Effective monthly value = total annual package ÷ 12.',
    decision_summary:'// Decision Summary',
    summary_close:'The offers are financially close, so qualitative factors should decide.',
    summary_financial_lead:'Financially, {leader} leads on total annual package.',
    summary_net_lead:'Take-home cash: {leader} leads on net monthly salary.',
    summary_qual_used:'Qualitative scoring is active and is being used as a tie-breaker, not a replacement for a material financial gap.',
    summary_qual_unused:'No meaningful qualitative scoring was applied yet.',
    summary_assumption:'Enabled annual bonus and annual benefit fields are treated as included in the package calculation.',
    reason_package_lead:'{leader} leads on total annual package',
    reason_net_lead:'{leader} leads on net monthly pay',
    reason_vacation_lead:'{leader} offers more vacation'
  },
  ar: {
    tool_tag:'// الأداة_01', hero_h1_line1:'مقارنة', hero_h1_line2:'العروض الوظيفية',
    hero_p:'قابل للتخصيص الكامل. عدّل أي حقل، فعّله أو أوقفه، أضف حقولك الخاصة، احسب كنسبة من حقل آخر. يحفظ تلقائياً في متصفحك.',
    current_company:'الشركة الحالية', new_company:'العرض الجديد',
    nationality:'الجنسية', saudi:'🇸🇦 سعودي', non_saudi:'🌍 غير سعودي',
    current:'الحالي', new_offer:'العرض الجديد',
    add_field:'+ إضافة حقل', add_deduction:'+ إضافة خصم',
    qualitative_factors:'// العوامل النوعية',
    factors_hint:'قيّم كل عامل من 1–10 · أعطِ وزناً لما يهمك أكثر · ويُستخدم غالباً عند تقارب العروض',
    add_factor:'+ إضافة عامل', compare_btn:'قارن العروض',
    net_monthly:'صافي الشهري', yearly_total:'الإجمالي السنوي', eff_monthly:'القيمة الشهرية الفعلية',
    overall_year:'إجمالي الحزمة السنوية',
    overall_month:'القيمة الشهرية الفعلية',
    full_breakdown:'// التفاصيل الكاملة', ai_title:'توصية الذكاء الاصطناعي',
    add_field_title:'إضافة حقل', field_name_lbl:'اسم الحقل',
    amount_lbl:'المبلغ (ريال/شهر)', pct_lbl:'% من حقل',
    calc_pct:'احسب كنسبة مئوية من حقل آخر',
    annual_amt:'مبلغ سنوي (أدخل القيمة السنوية كاملة)',
    yearly_input_badge:'سنوي',
    add_field_btn:'إضافة', cancel_btn:'إلغاء',
    monthly_section:'الراتب الشهري', annual_section:'المزايا السنوية',
    deductions_section:'الاستقطاعات', gross_monthly:'إجمالي الراتب الشهري',
    net_monthly_salary:'صافي الراتب الشهري', qualitative_score:'النتيجة النوعية',
    reset_btn:'↺ إعادة تعيين', save_btn:'حفظ', portfolio_btn:'← المعرض',
    reset_confirm:'إعادة تعيين كل شيء إلى الإعدادات الافتراضية؟', saved_txt:'✓ تم الحفظ',
    gosi_note_saudi:'',
    gosi_note_non:'غير سعودي: لا يوجد اشتراك تأمينات على الموظف',
    deduction_toggle:'خصم — انقر للتبديل', addition_toggle:'إضافة — انقر للتعيين كخصم',
    weight_lbl:'الوزن %', remove_factor:'✕ حذف',
    ai_unavailable:'الذكاء الاصطناعي غير متاح. التفاصيل أعلاه تكفي.',
    breakdown_rows: {
      gross:'إجمالي الراتب الشهري', gosi:'التأمينات / الاستقطاعات', net:'صافي الراتب الشهري',
      year1:'سنة كاملة (صافي × 12)', year_bonus:'سنة + المكافآت', overall_sal:'الراتب الإجمالي (÷12)',
      annual_ben:'مزايا سنوية أخرى', annual_ben_month:'مزايا سنوية أخرى (÷12)', year_ben:'إجمالي الراتب مع المزايا/سنة',
      month_ben:'إجمالي الراتب مع المزايا/شهر'
    },
    edit_field_title:'تعديل الحقل', deduction_lbl:'خصم (يُطرح من الإجمالي)',
    ref2_hint:'أضف حقلاً ثانياً (مثلاً: التأمينات = الأساسي + السكن)',
    ai_prompt_suffix:'اجعل إجمالي الحزمة السنوية هو العامل الرئيسي، ثم صافي الراتب الشهري، واستخدم العوامل النوعية غالباً عند تقارب العروض. قدّم توصية مباشرة مع أرقام واضحة. بدون نقاط.',
    ai_lang_instruction:'أجب باللغة العربية.',
    new_factor:'عامل جديد',
    export_btn:'⬇ تصدير Excel',
    saudi_short:'سعودي', non_saudi_short:'غير سعودي',
    multiplier_lbl:'مضاعف الراتب', multiplier_unit:'× أشهر من',
    pct_unit:'% من',
    built_by:'من تطوير', figures_note:'الأرقام تقديرية',
    mode_simple_label:'مقارنة سريعة', mode_simple_sub:'الباحث عن عمل · جواب فوري',
    mode_detailed_label:'تحليل شامل', mode_detailed_sub:'HR / المالية · كل التفاصيل',
    winner_label:'الفائز', winner_higher:'أعلى في الحزمة الإجمالية', winner_reason:'السبب: {reason}',
    winner_tied_label:'النتيجة', winner_tied:'متقاربان', winner_tied_sub:'كلا العرضين متقاربان مالياً',
    field_basic:'الراتب الأساسي', field_housing:'بدل السكن',
    field_transport:'بدل المواصلات', field_special:'البدل الخاص',
    field_gosi:'التأمينات الاجتماعية', field_annual_bonus:'المكافأة السنوية',
    field_education:'بدل التعليم', field_social:'البدل الاجتماعي',
    field_mobile:'بدل الاتصالات', field_perf_bonus:'مكافأة الأداء',
    field_phone_bill:'فاتورة الهاتف',
    field_medical_ins:'التأمين الطبي', field_flight_ticket:'تذكرة السفر السنوية',
    factor_health:'جودة المزايا', factor_remote:'العمل عن بُعد / المرونة',
    factor_career_growth:'النمو الوظيفي والتعلم', factor_management:'جودة الإدارة',
    factor_commute:'التنقل والموقع', factor_wlb:'التوازن بين العمل والحياة',
    factor_job_security:'الاستقرار الوظيفي', factor_brand:'سمعة الشركة وعلامتها', factor_role_scope:'نطاق الدور والمرتبة',
    hr_context_label:'المسمى الوظيفي والسياق (اختياري)',
    hr_context_placeholder:'مثال: مهندس أول، 8 سنوات خبرة، الرياض',
    vacation_lbl:'أيام الإجازة / سنة', notice_lbl:'فترة الإشعار (أشهر)',
    hr_context_hint:'يساعد الذكاء الاصطناعي على تقديم توصية أكثر دقة',
    vac_diff_lbl:'فرق الإجازة',
    package_helper:'إجمالي الحزمة السنوية يشمل المكافآت السنوية والمزايا السنوية المفعّلة. والقيمة الشهرية الفعلية = إجمالي الحزمة السنوية ÷ 12.',
    decision_summary:'// ملخص القرار',
    summary_close:'العرضان متقاربان مالياً، لذا يفترض أن تحسم العوامل النوعية القرار.',
    summary_financial_lead:'مالياً، يتفوق {leader} في إجمالي الحزمة السنوية.',
    summary_net_lead:'من ناحية صافي الاستلام الشهري، يتفوق {leader}.',
    summary_qual_used:'تم تفعيل التقييم النوعي ويُستخدم كعامل ترجيح عند التقارب، وليس بديلاً عن فارق مالي جوهري.',
    summary_qual_unused:'لم يتم تطبيق تقييم نوعي مؤثر حتى الآن.',
    summary_assumption:'يتم احتساب أي مكافأة سنوية أو مزايا سنوية مفعّلة ضمن إجمالي الحزمة.',
    reason_package_lead:'{leader} يتفوق في إجمالي الحزمة السنوية',
    reason_net_lead:'{leader} يتفوق في صافي الراتب الشهري',
    reason_vacation_lead:'{leader} يمنح إجازة أكثر'
  }
};

let currentLang = 'ar';
let currentTheme = localStorage.getItem('tools_theme') || 'dark';

function t(key) {
  return (STRINGS[currentLang][key] || STRINGS.en[key] || key);
}

function applyLang(lang) {
  currentLang = lang;
  const isAr = lang === 'ar';
  document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', isAr ? 'ar' : 'en');

  // Static data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const str = STRINGS[lang][key] || STRINGS.en[key];
    if (str !== undefined) el.textContent = str;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    const str = STRINGS[lang][key] || STRINGS.en[key];
    if (str !== undefined) el.placeholder = str;
  });

  // Lang button
  const btn = $('langBtn');
  if (btn) {
    btn.textContent = isAr ? 'EN' : 'عربي';
    btn.classList.toggle('ar-active', isAr);
  }
  const themeBtn = $('themeBtn');
  if (themeBtn) themeBtn.textContent = currentTheme === 'light' ? '🌙' : '☀️';

  // Header buttons
  const btnReset = $('btnReset');
  if (btnReset) btnReset.textContent = t('reset_btn');
  const btnSave = $('saveBtn');
  if (btnSave && !btnSave.classList.contains('btn-saved')) btnSave.textContent = t('save_btn');
  const btnPort = $('btnPortfolio');
  if (btnPort) btnPort.textContent = t('portfolio_btn');

  // Nationality buttons
  ['A','B'].forEach(s => {
    const sa = $('nat'+s+'_saudi'), ns = $('nat'+s+'_nonsaudi');
    if (sa) sa.textContent = t('saudi');
    if (ns) ns.textContent = t('non_saudi');
  });

  // Nationality notes (re-apply based on current nat)
  ['A','B'].forEach(s => {
    const nat = nationality[s];
    const note = $('natNote'+s);
    if (note) note.textContent = nat === 'saudi' ? t('gosi_note_saudi') : t('gosi_note_non');
  });
  // Also update placeholder
  const phA = $('coNameA'), phB = $('coNameB');
  if (phA) phA.placeholder = t('current_company');
  if (phB) phB.placeholder = t('new_company');

  // Re-render fields and factors (they use t() internally)
  renderFields('A');
  renderFields('B');
  renderFactors();
  updateTabLabels();
  updateModeLabels();

  // Persist lang
  localStorage.setItem('offer_lang', lang);
}

function toggleLang() {
  applyLang(currentLang === 'en' ? 'ar' : 'en');
}
function applyTheme(theme) {
  currentTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('tools_theme', currentTheme);
  const themeBtn = $('themeBtn');
  if (themeBtn) themeBtn.textContent = currentTheme === 'light' ? '🌙' : '☀️';
}
function toggleTheme() {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

function saveData() {
  autosave();
  const btn = $('saveBtn');
  btn.textContent = t('saved_txt');
  btn.classList.add('btn-saved');
  setTimeout(() => { btn.textContent = t('save_btn'); btn.classList.remove('btn-saved'); }, 1800);
}

function resetAll() {
  if (!confirm(t('reset_confirm'))) return;
  localStorage.removeItem('offer_v31');
  state = deepClone(DEFAULTS);
  state.factors = deepClone(DEFAULT_FACTORS);
  state.nationality = { A: 'saudi', B: 'saudi' };
  nationality.A = 'saudi';
  nationality.B = 'saudi';
  $('coNameA').value = state.coA;
  $('coNameB').value = state.coB;
  // Clear HR context fields in both state and UI
  state.vacA = null; state.vacB = null;
  state.noticeA = null; state.noticeB = null;
  $('vacA').value = ''; $('vacB').value = '';
  $('noticeA').value = ''; $('noticeB').value = '';
  updateLabels();
  setNationality('A', 'saudi');
  setNationality('B', 'saudi');
  renderFields('A');
  renderFields('B');
  renderFactors();
  $('resultsWrap').style.display = 'none';
  $('simpleResult').style.display = 'none';
  $('totalsBar').style.display = 'none';
  $('oYearA').textContent = '—'; $('oYearB').textContent = '—';
  $('oMonthA').textContent = '—'; $('oMonthB').textContent = '—';
  $('oYearBadge').textContent = ''; $('oMonthBadge').textContent = '';
  updateVacDiff();
  closePopup();
  autosave();
}

// ── Nationality ───────────────────────────────────────────────────
const nationality = { A: 'saudi', B: 'saudi' };

function setNationality(side, nat) {
  nationality[side] = nat;
  if (!state.nationality) state.nationality = {};
  state.nationality[side] = nat;
  // Update buttons
  $('nat' + side + '_saudi').classList.toggle('active', nat === 'saudi');
  $('nat' + side + '_nonsaudi').classList.toggle('active', nat === 'nonsaudi');
  // Update GOSI pct — 0% for non-Saudi employees
  const gosiId = side === 'A' ? 'a6' : 'b6';
  const gosi = state[side].find(x => x.id === gosiId);
  if (gosi) {
    gosi.pct = nat === 'saudi' ? 9.75 : 0;
    gosi.enabled = nat === 'saudi';
  }
  // Update note
  $('natNote' + side).textContent = nat === 'saudi' ? t('gosi_note_saudi') : t('gosi_note_non');
  renderFields(side);
  autosave();
}

// ── Qualitative Factors ──────────────────────────────────────────
const DEFAULT_FACTORS = [
  { id:'f1', name:'Benefits Quality',            scoreA:5, scoreB:5, weight:15 },
  { id:'f2', name:'Remote Work / Flexibility',   scoreA:5, scoreB:5, weight:10 },
  { id:'f3', name:'Career Growth & Learning',    scoreA:5, scoreB:5, weight:15 },
  { id:'f4', name:'Management Quality',          scoreA:5, scoreB:5, weight:12 },
  { id:'f5', name:'Role Scope & Seniority',      scoreA:5, scoreB:5, weight:12 },
  { id:'f6', name:'Commute & Location',          scoreA:5, scoreB:5, weight:8  },
  { id:'f7', name:'Work-Life Balance',           scoreA:5, scoreB:5, weight:10 },
  { id:'f8', name:'Job Security & Stability',    scoreA:5, scoreB:5, weight:10 },
  { id:'f9', name:'Company Brand & Reputation',  scoreA:5, scoreB:5, weight:8  },
];



function renderFactors() {
  const factors = state.factors || DEFAULT_FACTORS;
  const con = $('factorsContainer');
  con.innerHTML = '';
  factors.forEach(f => con.appendChild(makeFactorRow(f)));
  updateFactorScore();
}

function makeFactorRow(f) {
  const row = document.createElement('div');
  row.className = 'factor-row';
  row.dataset.id = f.id;
  row.innerHTML = `
    <div class="factor-name-wrap">
      <input class="factor-name-input" value="${esc(tFactorName(f))}"
        onchange="updateFactor('${f.id}','name',this.value)">
      <button type="button" class="factor-del-btn show-mobile" onclick="deleteFactor('${f.id}')">${t('remove_factor')}</button>
    </div>
    <div class="factor-sliders-row">
      <div class="factor-slider-wrap">
        <div class="factor-slider-label">
          <span style="color:var(--current)">${state.coA||t('current')}</span>
          <span style="color:var(--current);font-weight:700" id="sa_${f.id}">${f.scoreA}/10</span>
        </div>
        <input type="range" min="1" max="10" value="${f.scoreA}"
          class="factor-slider slider-a"
          style="--pct:${(f.scoreA-1)/9*100}%"
          oninput="updateFactor('${f.id}','scoreA',+this.value);this.style.setProperty('--pct',(+this.value-1)/9*100+'%');document.getElementById('sa_${f.id}').textContent=this.value+'/10'">
      </div>
      <div class="factor-slider-wrap">
        <div class="factor-slider-label">
          <span style="color:var(--new)">${state.coB||t('new_offer')}</span>
          <span style="color:var(--new);font-weight:700" id="sb_${f.id}">${f.scoreB}/10</span>
        </div>
        <input type="range" min="1" max="10" value="${f.scoreB}"
          class="factor-slider slider-b"
          style="--pct:${(f.scoreB-1)/9*100}%"
          oninput="updateFactor('${f.id}','scoreB',+this.value);this.style.setProperty('--pct',(+this.value-1)/9*100+'%');document.getElementById('sb_${f.id}').textContent=this.value+'/10'">
      </div>
    </div>
    <div class="factor-bottom-row">
      <div class="factor-weight-wrap">
        <div class="factor-weight-label">${t('weight_lbl')}</div>
        <input type="number" class="factor-weight-input" value="${f.weight}" min="0" max="100"
          onchange="updateFactor('${f.id}','weight',+this.value)">
      </div>
      <button type="button" class="factor-del-btn hide-mobile" onclick="deleteFactor('${f.id}')">✕</button>
    </div>
  `;
  return row;
}

function updateFactor(id, key, val) {
  if (!state.factors) state.factors = deepClone(DEFAULT_FACTORS);
  const f = state.factors.find(x => x.id === id);
  if (f) { f[key] = val; updateFactorScore(); autosave(); }
}

function deleteFactor(id) {
  if (!state.factors) state.factors = deepClone(DEFAULT_FACTORS);
  state.factors = state.factors.filter(x => x.id !== id);
  renderFactors();
  autosave();
}

function addFactor() {
  if (!state.factors) state.factors = deepClone(DEFAULT_FACTORS);
  state.factors.push({ id:'f'+Date.now(), name:t('new_factor'), scoreA:5, scoreB:5, weight:5 });
  renderFactors();
  autosave();
}

function updateFactorScore() {
  const factors = state.factors || DEFAULT_FACTORS;
  if (!factors.length) { $('factorScoreBar').style.display='none'; return; }
  const totalWeight = factors.reduce((s,f) => s + (f.weight||0), 0);
  if (!totalWeight) { $('factorScoreBar').style.display='none'; return; }
  const scoreA = factors.reduce((s,f) => s + (f.scoreA * f.weight), 0) / totalWeight;
  const scoreB = factors.reduce((s,f) => s + (f.scoreB * f.weight), 0) / totalWeight;
  $('fScoreA').textContent = scoreA.toFixed(1) + '/10';
  $('fScoreB').textContent = scoreB.toFixed(1) + '/10';
  const diff = scoreA ? (scoreB - scoreA) / scoreA : 0;
  const bg  = diff > 0.02 ? 'rgba(0,200,150,.15)' : diff < -0.02 ? 'rgba(255,71,87,.15)' : 'rgba(255,255,255,.06)';
  const col = diff > 0.02 ? 'var(--current)'      : diff < -0.02 ? 'var(--danger)'        : 'var(--muted)';
  const txt = diff > 0.02 ? `▲ ${state.coB||t('new_offer')}` : diff < -0.02 ? `▼ ${state.coA||t('current')}` : '≈';
  $('fScoreBadge').textContent = txt;
  $('fScoreBadge').style.cssText = `background:${bg};color:${col};font-size:.65rem;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:4px`;
  $('factorScoreBar').style.display = 'flex';
}

// ── Header menu ──────────────────────────────────────────────────
function toggleMenu() {
  const m = $('headerMenu');
  if (m) m.classList.toggle('open');
}
document.addEventListener('click', e => {
  const m = $('headerMenu'), btn = $('menuBtn');
  if (m && m.classList.contains('open') && !m.contains(e.target) && e.target !== btn) {
    m.classList.remove('open');
  }
});

// ── Card tab switcher ────────────────────────────────────────────
function switchCard(side) {
  ['A','B'].forEach(s => {
    const card = $('card'+s);
    const tab  = $('tab'+s);
    if (!card || !tab) return;
    if (s === side) {
      card.classList.add('active-card');
      tab.className = 'card-tab active-tab-' + s.toLowerCase();
      tab.textContent = s === 'A' ? (state.coA || t('current')) : (state.coB || t('new_offer'));
    } else {
      card.classList.remove('active-card');
      tab.className = 'card-tab';
      tab.textContent = s === 'A' ? (state.coA || t('current')) : (state.coB || t('new_offer'));
    }
  });
}
function updateTabLabels() {
  const tabA = $('tabA'), tabB = $('tabB');
  if (tabA) tabA.textContent = state.coA || t('current');
  if (tabB) tabB.textContent = state.coB || t('new_offer');
}

// ── Keyboard ──────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    if (!$('popupOverlay').classList.contains('open')) calculate();
  }
  if (e.key === 'Escape') closePopup();
});

init();

// ── Export to Excel ───────────────────────────────────────────────
let xlsxLibraryPromise;
function ensureXlsxLibrary() {
  if (window.XLSX) return Promise.resolve(window.XLSX);
  if (!xlsxLibraryPromise) {
    xlsxLibraryPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      script.async = true;
      script.onload = () => resolve(window.XLSX);
      script.onerror = () => reject(new Error('Failed to load Excel export library'));
      document.head.appendChild(script);
    });
  }
  return xlsxLibraryPromise;
}
async function exportExcel() {
  try { await ensureXlsxLibrary(); }
  catch (_) { alert(currentLang === 'ar' ? 'تعذر تحميل مكتبة تصدير Excel.' : 'Could not load the Excel export library.'); return; }
  const wb = XLSX.utils.book_new();
  const coA = state.coA || 'Current Company';
  const coB = state.coB || 'New Company';
  const a = computeSide('A');
  const b = computeSide('B');
  const fmt = n => Math.round(n);

  // ── Colors ──
  const GREEN  = { fgColor: { rgb: '0A8A5F' } };
  const BLUE   = { fgColor: { rgb: '1A5CDB' } };
  const LIGHT_GREEN = { fgColor: { rgb: 'E8F5F0' } };
  const LIGHT_BLUE  = { fgColor: { rgb: 'EEF3FF' } };
  const GRAY   = { fgColor: { rgb: 'F2F2EF' } };
  const DARK   = { fgColor: { rgb: '1A1A1A' } };
  const WHITE  = { fgColor: { rgb: 'FFFFFF' } };

  const hdrFont  = { bold: true, sz: 11 };
  const monoFont = { name: 'Courier New', sz: 10 };
  const bodyFont = { name: 'Arial', sz: 10 };
  const titleFont= { bold: true, sz: 13, color: { rgb: 'FFFFFF' } };
  const subFont  = { bold: true, sz: 10 };

  const center = { horizontal: 'center', vertical: 'center', wrapText: true };
  const right  = { horizontal: 'right',  vertical: 'center' };
  const left   = { horizontal: 'left',   vertical: 'center' };

  const sarFmt  = '#,##0 "SAR"';
  const pctFmt  = '+0.0%;-0.0%;"-"';

  function cell(v, opts = {}) {
    return {
      v,
      t: opts.t || (typeof v === 'number' ? 'n' : 's'),
      z: opts.z,
      s: {
        font:      opts.font  || bodyFont,
        fill:      opts.fill  ? { patternType: 'solid', fgColor: opts.fill } : undefined,
        alignment: opts.align || left,
        border:    opts.border || {
          bottom: { style: 'thin', color: { rgb: 'E5E5E0' } }
        }
      }
    };
  }

  function hdr(v, fill, color) {
    return cell(v, {
      font:  { ...hdrFont, color: color || { rgb: 'FFFFFF' } },
      fill:  fill || { rgb: '1A1A1A' },
      align: center
    });
  }

  function num(v, fill) {
    return cell(v, { t: 'n', z: sarFmt, font: monoFont, fill: fill, align: right });
  }

  function pct(v, isPositive) {
    const color = v > 0.005 ? { rgb: '0A8A5F' } : v < -0.005 ? { rgb: 'C0392B' } : { rgb: '888880' };
    return cell(v, { t: 'n', z: pctFmt, font: { ...monoFont, bold: true, color }, align: center });
  }

  function lbl(v, bold) {
    return cell(v, { font: bold ? { ...bodyFont, bold: true } : bodyFont, fill: { rgb: 'F7F7F5' } });
  }

  // ════════════════════════════════════════════════════════════════
  // SHEET 1 — SUMMARY
  // ════════════════════════════════════════════════════════════════
  const summaryData = [];

  // Title row
  summaryData.push([
    hdr('JOB OFFER COMPARISON', { rgb: '1A1A1A' }),
    cell(''), cell(''), cell('')
  ]);
  summaryData.push([
    cell('Generated by tools.oalfawzan.sa', { font: { ...bodyFont, color: { rgb: '888880' } } }),
    cell(''), cell(''), cell('')
  ]);
  summaryData.push([cell(''), cell(''), cell(''), cell('')]);

  // Column headers
  summaryData.push([
    hdr('METRIC', { rgb: '333333' }),
    hdr(coA,      { rgb: '0A8A5F' }),
    hdr(coB,      { rgb: '1A5CDB' }),
    hdr('CHANGE', { rgb: '333333' })
  ]);

  const py = a.yearBenefits ? (b.yearBenefits - a.yearBenefits) / a.yearBenefits : 0;
  const pn = a.net     ? (b.net     - a.net)     / a.net     : 0;
  const pg = a.gross   ? (b.gross   - a.gross)   / a.gross   : 0;

  const summaryRows = [
    ['Gross Monthly Salary',               a.gross,          b.gross,          pg],
    ['GOSI / Deductions',                  a.deductions,     b.deductions,     a.deductions?(b.deductions-a.deductions)/a.deductions:0],
    ['Net Monthly Salary',                 a.net,            b.net,            pn],
    ['Net Annual (×12)',                   a.year1,          b.year1,          a.year1?(b.year1-a.year1)/a.year1:0],
    ['Net Annual + Bonuses',               a.yearBonus,      b.yearBonus,      a.yearBonus?(b.yearBonus-a.yearBonus)/a.yearBonus:0],
    ['Overall Monthly Salary',             a.overallSal,     b.overallSal,     a.overallSal?(b.overallSal-a.overallSal)/a.overallSal:0],
    ['Other Annual Benefits',              a.annualBenefits, b.annualBenefits, a.annualBenefits?(b.annualBenefits-a.annualBenefits)/a.annualBenefits:0],
    ['Overall with Benefits / Year',       a.yearBenefits,   b.yearBenefits,   py],
    ['Overall with Benefits / Month',      a.overallBen,     b.overallBen,     py],
  ];

  summaryRows.forEach((r, i) => {
    const isKey = i === 7 || i === 8;
    const fill = isKey ? { rgb: 'FFF9E6' } : undefined;
    summaryData.push([
      cell(r[0], { font: isKey ? { ...bodyFont, bold: true } : bodyFont, fill: fill }),
      num(fmt(r[1]), fill),
      num(fmt(r[2]), fill),
      pct(r[3])
    ]);
  });

  const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
  ws1['!cols'] = [{ wch: 34 }, { wch: 18 }, { wch: 18 }, { wch: 12 }];
  ws1['!rows'] = [{ hpt: 28 }, { hpt: 16 }, { hpt: 8 }, { hpt: 22 }];
  ws1['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
  ];
  XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

  // ════════════════════════════════════════════════════════════════
  // SHEET 2 — FIELD BREAKDOWN
  // ════════════════════════════════════════════════════════════════
  const fieldsData = [];
  fieldsData.push([
    hdr('FIELD BREAKDOWN', { rgb: '1A1A1A' }), cell(''), cell(''), cell(''), cell('')
  ]);
  fieldsData.push([cell(''), cell(''), cell(''), cell(''), cell('')]);
  fieldsData.push([
    hdr('Field',     { rgb: '333333' }),
    hdr('Type',      { rgb: '333333' }),
    hdr(coA + ' (SAR)', { rgb: '0A8A5F' }),
    hdr(coB + ' (SAR)', { rgb: '1A5CDB' }),
    hdr('Diff',      { rgb: '333333' })
  ]);

  const allFields = new Set([
    ...state.A.map(f => tFieldName(f)),
    ...state.B.map(f => tFieldName(f))
  ]);

  // Monthly fields
  fieldsData.push([
    cell('── MONTHLY ──', { font: { ...bodyFont, bold: true, color:{ rgb:'888880' } }, fill: { rgb:'F2F2EF' } }),
    cell('', { fill: { rgb:'F2F2EF' } }), cell('', { fill: { rgb:'F2F2EF' } }),
    cell('', { fill: { rgb:'F2F2EF' } }), cell('', { fill: { rgb:'F2F2EF' } })
  ]);

  const monthlyA = state.A.filter(f => !f.isAnnual);
  const monthlyB = state.B.filter(f => !f.isAnnual);
  const allMonthly = [...new Set([...monthlyA.map(f => tFieldName(f)), ...monthlyB.map(f => tFieldName(f))])];

  allMonthly.forEach(name => {
    const fa = monthlyA.find(f => tFieldName(f) === name);
    const fb = monthlyB.find(f => tFieldName(f) === name);
    const va = fa && fa.enabled ? resolveValueExport(fa, state.A) : 0;
    const vb = fb && fb.enabled ? resolveValueExport(fb, state.B) : 0;
    const isDeduction = (fa && fa.isDeduction) || (fb && fb.isDeduction);
    const diff = vb - va;
    fieldsData.push([
      cell(name, { font: isDeduction ? { ...bodyFont, color:{ rgb:'C0392B' } } : bodyFont }),
      cell(isDeduction ? 'Deduction' : 'Monthly', { font: { ...bodyFont, color:{ rgb:'888880' } }, align: center }),
      fa ? num(fmt(va)) : cell('—', { align: center }),
      fb ? num(fmt(vb)) : cell('—', { align: center }),
      diff !== 0 ? num(fmt(diff), diff > 0 ? { rgb:'E8F5F0' } : { rgb:'FEE9E7' }) : cell('—', { align: center })
    ]);
  });

  // Annual fields
  fieldsData.push([
    cell('── ANNUAL ──', { font: { ...bodyFont, bold: true, color:{ rgb:'888880' } }, fill: { rgb:'F2F2EF' } }),
    cell('', { fill: { rgb:'F2F2EF' } }), cell('', { fill: { rgb:'F2F2EF' } }),
    cell('', { fill: { rgb:'F2F2EF' } }), cell('', { fill: { rgb:'F2F2EF' } })
  ]);

  const annualA = state.A.filter(f => f.isAnnual);
  const annualB = state.B.filter(f => f.isAnnual);
  const allAnnual = [...new Set([...annualA.map(f => tFieldName(f)), ...annualB.map(f => tFieldName(f))])];

  allAnnual.forEach(name => {
    const fa = annualA.find(f => tFieldName(f) === name);
    const fb = annualB.find(f => tFieldName(f) === name);
    const va = fa && fa.enabled ? resolveValueExport(fa, state.A) : 0;
    const vb = fb && fb.enabled ? resolveValueExport(fb, state.B) : 0;
    const diff = vb - va;
    fieldsData.push([
      cell(name),
      cell('Annual', { font: { ...bodyFont, color:{ rgb:'888880' } }, align: center }),
      fa ? num(fmt(va)) : cell('—', { align: center }),
      fb ? num(fmt(vb)) : cell('—', { align: center }),
      diff !== 0 ? num(fmt(diff), diff > 0 ? { rgb:'E8F5F0' } : { rgb:'FEE9E7' }) : cell('—', { align: center })
    ]);
  });

  const ws2 = XLSX.utils.aoa_to_sheet(fieldsData);
  ws2['!cols'] = [{ wch: 28 }, { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 14 }];
  ws2['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Field Breakdown');

  // ════════════════════════════════════════════════════════════════
  // SHEET 3 — QUALITATIVE FACTORS
  // ════════════════════════════════════════════════════════════════
  const factors = state.factors || [];
  if (factors.length) {
    const qualData = [];
    qualData.push([hdr('QUALITATIVE FACTORS', { rgb: '1A1A1A' }), cell(''), cell(''), cell(''), cell('')]);
    qualData.push([cell(''), cell(''), cell(''), cell(''), cell('')]);
    qualData.push([
      hdr('Factor',      { rgb: '333333' }),
      hdr('Weight %',    { rgb: '333333' }),
      hdr(coA + ' /10',  { rgb: '0A8A5F' }),
      hdr(coB + ' /10',  { rgb: '1A5CDB' }),
      hdr('Edge',        { rgb: '333333' })
    ]);

    const totalWeight = factors.reduce((s, f) => s + (f.weight || 0), 0) || 1;
    let wScoreA = 0, wScoreB = 0;

    factors.forEach(f => {
      const edge = f.scoreB > f.scoreA ? coB : f.scoreA > f.scoreB ? coA : 'Tied';
      const edgeFill = f.scoreB > f.scoreA ? { rgb: 'EEF3FF' } : f.scoreA > f.scoreB ? { rgb: 'E8F5F0' } : undefined;
      qualData.push([
        cell(tFactorName(f)),
        cell(f.weight / 100, { t: 'n', z: '0%', align: center }),
        cell(f.scoreA,       { t: 'n', z: '0.0', font: { ...monoFont, bold: true, color:{ rgb:'0A8A5F' } }, align: center }),
        cell(f.scoreB,       { t: 'n', z: '0.0', font: { ...monoFont, bold: true, color:{ rgb:'1A5CDB' } }, align: center }),
        cell(edge,           { font: { ...bodyFont, bold: edge !== 'Tied' }, fill: edgeFill, align: center })
      ]);
      wScoreA += (f.scoreA * f.weight / totalWeight);
      wScoreB += (f.scoreB * f.weight / totalWeight);
    });

    qualData.push([cell(''), cell(''), cell(''), cell(''), cell('')]);
    const winnerFill = wScoreB > wScoreA ? { rgb: 'EEF3FF' } : { rgb: 'E8F5F0' };
    qualData.push([
      cell('Weighted Total Score', { font: { ...bodyFont, bold: true }, fill: winnerFill }),
      cell('', { fill: winnerFill }),
      cell(parseFloat(wScoreA.toFixed(1)), { t: 'n', z: '0.0"/10"', font: { ...monoFont, bold: true, color:{ rgb:'0A8A5F' } }, fill: winnerFill, align: center }),
      cell(parseFloat(wScoreB.toFixed(1)), { t: 'n', z: '0.0"/10"', font: { ...monoFont, bold: true, color:{ rgb:'1A5CDB' } }, fill: winnerFill, align: center }),
      cell(wScoreB > wScoreA ? coB + ' leads' : wScoreA > wScoreB ? coA + ' leads' : 'Tied', { font: { ...bodyFont, bold: true }, fill: winnerFill, align: center })
    ]);

    const ws3 = XLSX.utils.aoa_to_sheet(qualData);
    ws3['!cols'] = [{ wch: 28 }, { wch: 10 }, { wch: 16 }, { wch: 16 }, { wch: 18 }];
    ws3['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];
    XLSX.utils.book_append_sheet(wb, ws3, 'Qualitative Factors');
  }

  // Download
  const fname = `offer-comparison-${new Date().toISOString().slice(0,10)}.xlsx`;
  XLSX.writeFile(wb, fname);
}

function resolveValueExport(f, fields) {
  if (!f.enabled) return 0;
  if (f.isPct && f.pctRef) {
    const ref  = fields.find(x => x.id === f.pctRef);
    const ref2 = f.pctRef2 ? fields.find(x => x.id === f.pctRef2) : null;
    let base = (ref ? resolveValueExport(ref, fields) : 0) + (ref2 ? resolveValueExport(ref2, fields) : 0);
    if (f.isGosi) base = Math.min(base, 45000);
    return (f.pct / 100) * base;
  }
  return f.value || 0;
}

// ── Close dropdown when tapping outside (mobile fix) ────────────
document.addEventListener('click', function(e) {
  if (!e.target.closest('.menu-wrap')) {
    const menu = document.getElementById('headerMenu');
    if (menu) menu.classList.remove('open');
  }
});
document.addEventListener('touchstart', function(e) {
  if (!e.target.closest('.menu-wrap')) {
    const menu = document.getElementById('headerMenu');
    if (menu) menu.classList.remove('open');
  }
}, { passive: true });
