(() => {
  'use strict';
  const KEY = 'tools-offer-clean-v1';
  const $ = id => document.getElementById(id);
  const keys = ['company','basic','housing','housingUnit','transport','transportUnit','other','deduction','gosi','gosiCustom','annualGuaranteed','bonus','bonusChance','nonCash','signOn','switchCost','vacation','hours','commute'];
  const initialOffer = () => ({
    company:'',basic:'',housing:'',housingUnit:'sar',transport:'',transportUnit:'sar',
    other:'',deduction:'',gosi:'legacy',gosiCustom:'',annualGuaranteed:'',bonus:'',bonusChance:'50',
    nonCash:'',signOn:'',switchCost:'',vacation:'',hours:'8',commute:'0'
  });
  let state = {a:initialOffer(),b:initialOffer()};
  let lang = 'ar';
  let theme = 'light';
  let toastHandle;
  const words = {
    ar:{
      page_title:'مقارنة عروض العمل',brand_sub:'أداة مقارنة الرواتب',lang:'English',theme:'تغيير المظهر',
      eyebrow:'قرارك الوظيفي، بالأرقام',hero:'قارن عرضك الوظيفي بوضوح',
      hero_desc:'أدخل تفاصيل وظيفتك الحالية والعرض الجديد، وشاهد الفرق في الراتب الشهري والقيمة السنوية بدون تعقيد.',
      sample:'تجربة بأرقام افتراضية',reset:'مسح البيانات',first_step:'بيانات العرضين',
      first_hint:'ابدأ بالأساسي والبدلات. المجاميع تتحدث تلقائيًا.',
      old:'الوظيفة الحالية',new:'العرض الجديد',old_tag:'الحالي',new_tag:'المقترح',
      company:'اسم الجهة (اختياري)',company_old:'مثال: جهة عملي الحالية',company_new:'مثال: الشركة الجديدة',
      salary:'الراتب الشهري',basic:'الراتب الأساسي',housing:'بدل السكن',transport:'بدل النقل',
      amount:'مبلغ',percent:'نسبة',other:'بدلات أخرى شهرية',deductions:'استقطاعات أخرى شهرية',
      gosi:'التأمينات الاجتماعية',legacy:'سعودي، النظام السابق (9.75%)',
      newcomer:'سعودي، النظام الجديد',none:'لا يوجد استقطاع موظف',custom:'نسبة مخصصة',
      custom_rate:'نسبة الاستقطاع %',gosi_base:'على الأساسي + السكن، بحد أقصى 45,000 ريال',
      effective:'المبلغ المحتسب',net:'صافي الاستلام الشهري',riyal:'ر.س',
      advanced:'تفاصيل اختيارية',advanced_hint:'المكافآت، المزايا، تكاليف الانتقال، ووقت العمل',
      bonus_title:'مكافآت ومزايا سنوية',bonus:'مكافأة سنوية مستهدفة',chance:'نسبة الصرف المتوقعة %',
      guaranteed:'مبالغ نقدية سنوية مضمونة',noncash:'مزايا غير نقدية / تعويض مصروفات سنويًا',
      extras:'الانتقال ونمط العمل',signon:'مكافأة الانضمام لمرة واحدة',
      switch_cost:'تكاليف انتقال أو مكافآت مفقودة',vacation:'أيام الإجازة السنوية',
      hours:'ساعات العمل يوميًا',commute:'دقائق المشوار يوميًا (ذهاب وعودة)',
      bonus_note:'المكافأة السنوية ليست راتبًا مضمونًا. أدخل نسبة الصرف التي تتوقعها.',
      second_step:'نتيجة المقارنة',second_hint:'الأرقام بالريال السعودي. المزايا غير النقدية لا تدخل في صافي الراتب.',
      empty_title:'جاهز للمقارنة',empty_text:'أدخل الراتب الأساسي في العرضين لعرض نتيجة واقعية، أو جرّب المثال الافتراضي.',
      monthly:'صافي الراتب الشهري',annual_guaranteed:'النقد السنوي المضمون',
      annual_expected:'النقد السنوي المتوقع',difference:'الفرق (الجديد − الحالي)',
      current_label:'الحالي',new_label:'الجديد',
      headline_b:'العرض الجديد أعلى ماليًا',headline_a:'الوظيفة الحالية أعلى ماليًا',
      headline_equal:'العرضان متساويان في صافي الاستلام الشهري',
      headline_near:'الفرق الشهري بين العرضين طفيف',
      verdict_basis:'المقارنة هنا على صافي الراتب الشهري؛ المكافآت والمزايا معروضة بشكل منفصل.',
      verdict_extra:'هذه مقارنة مالية وليست توصية نهائية لقبول الوظيفة.',
      annually_first:'صافي النقد المتوقع في السنة الأولى',
      noncash_value:'قيمة المزايا غير النقدية السنوية',
      vacation_delta:'فرق أيام الإجازة (الجديد − الحالي)',
      hourly:'القيمة الفعلية للساعة، تشمل وقت المشوار',
      full_breakdown:'شاهد تفاصيل طريقة الحساب',item:'البند',gross:'إجمالي الراتب الشهري',
      social:'استقطاع التأمينات',annual_bonus:'مكافأة سنوية متوقعة',monthly_net:'الصافي الشهري',
      total_other:'البدلات الإضافية',other_deductions:'الاستقطاعات الأخرى',
      guaranteed_cash:'النقد السنوي المضمون',expected_cash:'النقد السنوي المتوقع',
      first_year:'السنة الأولى بعد التكاليف',benefits:'المزايا غير النقدية السنوية',
      caution:'الحسابات تقديرية بناءً على بياناتك. تأكد من تفاصيل العقد وقواعد التأمينات.',
      copy_link:'نسخ رابط المقارنة',export:'تصدير Excel (CSV)',print:'طباعة / PDF',
      privacy:'تُحفظ بياناتك في هذا المتصفح فقط. عند مشاركة الرابط ستُضمّن بيانات الرواتب داخله.',
      official:'المرجع الرسمي للتأمينات',home:'العودة للأدوات',by:'صنع بواسطة',
      alert_copied:'تم نسخ الرابط، يحتوي على بيانات العرضين',alert_fail:'تعذر نسخ الرابط تلقائيًا',
      alert_reset:'تم مسح البيانات',alert_sample:'تم تحميل المثال الافتراضي',
      alert_saved:'تم حفظ البيانات على جهازك',alert_import:'تم فتح مقارنة مشتركة',
      confirm_reset:'سيتم مسح بيانات المقارنة المحفوظة. هل تريد المتابعة؟',
      confirm_sample:'سيتم استبدال البيانات الحالية بالمثال الافتراضي. هل تريد المتابعة؟',
      expected_hint:'الحساب السنوي المتوقع يشمل نسبة المكافأة التي أدخلتها. لا يساوي الراتب الشهري الفعلي.',
      share_error:'لا يمكن إنشاء رابط المشاركة لهذه البيانات',export_error:'أدخل الراتب الأساسي للعرضين أولًا',
      compare_label:'المقارنة المالية'
    },
    en:{
      page_title:'Job Offer Comparison',brand_sub:'Salary comparison tool',lang:'عربي',theme:'Switch appearance',
      eyebrow:'Make a clearer career decision',hero:'Compare job offers with clarity',
      hero_desc:'Enter your current compensation and the new offer to see monthly and yearly differences without unnecessary complexity.',
      sample:'Try an example',reset:'Clear data',first_step:'Enter both offers',
      first_hint:'Start with base pay and allowances. Totals update automatically.',
      old:'Current job',new:'New offer',old_tag:'Current',new_tag:'Proposed',
      company:'Employer name (optional)',company_old:'e.g. Current employer',company_new:'e.g. New employer',
      salary:'Monthly compensation',basic:'Base salary',housing:'Housing allowance',transport:'Transport allowance',
      amount:'Amount',percent:'Percent',other:'Other monthly allowances',deductions:'Other monthly deductions',
      gosi:'Social insurance',legacy:'Saudi, existing system (9.75%)',
      newcomer:'Saudi, new system',none:'No employee deduction',custom:'Custom rate',
      custom_rate:'Deduction rate %',gosi_base:'Calculated on base + housing, capped at SAR 45,000',
      effective:'Calculated amount',net:'Monthly take-home pay',riyal:'SAR',
      advanced:'Optional details',advanced_hint:'Bonuses, benefits, switching costs and working time',
      bonus_title:'Annual bonus and benefits',bonus:'Target annual bonus',chance:'Expected payout %',
      guaranteed:'Guaranteed annual cash',noncash:'Non-cash benefits / reimbursements per year',
      extras:'Switching and working time',signon:'One-time joining bonus',
      switch_cost:'Switching costs or lost bonus',vacation:'Annual leave days',
      hours:'Daily working hours',commute:'Daily round-trip commute (minutes)',
      bonus_note:'Annual bonuses are not guaranteed salary. Choose the payout percentage you expect.',
      second_step:'Comparison results',second_hint:'All figures are in SAR. Non-cash benefits are separate from take-home pay.',
      empty_title:'Ready to compare',empty_text:'Enter the base salary for both offers to see your results, or try the sample.',
      monthly:'Monthly take-home',annual_guaranteed:'Guaranteed annual cash',annual_expected:'Expected annual cash',
      difference:'Difference (new − current)',current_label:'Current',new_label:'New',
      headline_b:'The new offer pays more monthly',headline_a:'The current job pays more monthly',
      headline_equal:'Both offers have the same monthly take-home',
      headline_near:'The monthly difference is small',
      verdict_basis:'The headline compares monthly take-home. Bonuses and benefits are shown separately.',
      verdict_extra:'This is a financial comparison, not a final recommendation to accept a job.',
      annually_first:'Expected first-year cash',noncash_value:'Annual non-cash benefits',
      vacation_delta:'Annual leave difference (new − current)',
      hourly:'Effective hourly value, including commute',
      full_breakdown:'View the calculation breakdown',item:'Item',gross:'Gross monthly pay',
      social:'Social insurance deduction',annual_bonus:'Expected annual bonus',monthly_net:'Monthly take-home',
      total_other:'Other allowances',other_deductions:'Other deductions',
      guaranteed_cash:'Guaranteed annual cash',expected_cash:'Expected annual cash',
      first_year:'First year after switching costs',benefits:'Annual non-cash benefits',
      caution:'Figures are estimates based on your inputs. Confirm contract terms and applicable GOSI rules.',
      copy_link:'Copy comparison link',export:'Export for Excel (CSV)',print:'Print / PDF',
      privacy:'Data is saved only in this browser. A shared link contains your offer and salary details.',
      official:'Official GOSI guidance',home:'Back to tools',by:'Created by',
      alert_copied:'Link copied; it contains both offers',alert_fail:'Unable to copy the link automatically',
      alert_reset:'Comparison cleared',alert_sample:'Example loaded',
      alert_saved:'Saved in this browser',alert_import:'Shared comparison loaded',
      confirm_reset:'Clear the locally saved comparison?',confirm_sample:'Replace your current data with the sample?',
      expected_hint:'Expected annual cash includes the selected bonus payout probability. It is not your actual monthly salary.',
      share_error:'Unable to create a link for this data',export_error:'Enter base pay for both offers first',
      compare_label:'Financial comparison'
    }
  };
  const t = key => (words[lang] && words[lang][key]) || words.ar[key] || key;
  const num = v => {const n = Number(v); return Number.isFinite(n) ? Math.max(0,n) : 0;};
  const money = n => new Intl.NumberFormat(lang==='ar'?'en-SA':'en-US',{maximumFractionDigits:2,minimumFractionDigits:0}).format(Number.isFinite(n)?n:0);
  const signed = n => (n>0?'+':n<0?'−':'') + money(Math.abs(n));
  const pair = (n,withUnit=true) => money(n) + (withUnit?' '+t('riyal'):'');
  const clean = v => (v==null?'':String(v)).slice(0,120);
  const parseOffer = input => {
    const obj = initialOffer();
    if(input && typeof input==='object'){
      keys.forEach(k=>{if(Object.prototype.hasOwnProperty.call(input,k)) obj[k]=clean(input[k]);});
      if(!['sar','pct'].includes(obj.housingUnit))obj.housingUnit='sar';
      if(!['sar','pct'].includes(obj.transportUnit))obj.transportUnit='sar';
      if(!['legacy','newcomer','none','custom'].includes(obj.gosi))obj.gosi='legacy';
    }
    return obj;
  };
  function save(){
    try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){}
  }
  function rateNew(){
    const date = new Date();
    const year = date.getFullYear(), month = date.getMonth();
    const steps = Math.max(0,Math.min(4,year-2024-(month<6?1:0)));
    return 9.75 + steps*.5;
  }
  function compute(o) {
    const base=num(o.basic);
    const allowance = (v,unit) => unit==='pct' ? base*num(v)/100 : num(v);
    const housing=allowance(o.housing,o.housingUnit);
    const transport=allowance(o.transport,o.transportUnit);
    const other=num(o.other);
    const gross=base+housing+transport+other;
    const rate=o.gosi==='none'?0:o.gosi==='legacy'?9.75:o.gosi==='newcomer'?rateNew():Math.min(100,num(o.gosiCustom));
    const gosi = Math.min(45000,base+housing)*rate/100;
    const deduction=num(o.deduction);
    const net=gross-gosi-deduction;
    const guaranteed=net*12+num(o.annualGuaranteed);
    const expectedBonus=num(o.bonus)*Math.min(100,num(o.bonusChance))/100;
    const expected=guaranteed+expectedBonus;
    const firstYear=expected+num(o.signOn)-num(o.switchCost);
    const benefits=num(o.nonCash);
    const hours=num(o.hours)||8;
    const commute=num(o.commute);
    const hourly=net/(22*(hours+commute/60));
    return {base,housing,transport,other,gross,rate,gosi,deduction,net,guaranteed,expectedBonus,expected,firstYear,benefits,signOn:num(o.signOn),switchCost:num(o.switchCost),vacation:num(o.vacation),hourly};
  }
  function ready(){return num(state.a.basic)>0 && num(state.b.basic)>0;}
  function fill(){
    document.querySelectorAll('[data-side][data-key]').forEach(el=>{
      const v=state[el.dataset.side][el.dataset.key];
      if(el.value!==v) el.value=v;
    });
    updateGosiControls();
  }
  function setLanguage(next) {
    lang=next==='en'?'en':'ar';
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    document.title=t('page_title')+' | tools.oalfawzan.sa';
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{el.placeholder=t(el.dataset.i18nPlaceholder);});
    $('langBtn').textContent=t('lang');
    $('themeBtn').setAttribute('aria-label',t('theme'));
    $('themeBtn').title=t('theme');
    document.querySelectorAll('[data-i18n-aria]').forEach(el=>{el.setAttribute('aria-label',t(el.dataset.i18nAria));});
    document.querySelectorAll('[data-choice-new]').forEach(el=>{el.textContent=t('newcomer')+' ('+money(rateNew())+'%)';});
    render();
    try{localStorage.setItem('tools-offer-clean-lang',lang);}catch(_){}
  }
  function setTheme(next){
    theme=next==='dark'?'dark':'light';
    document.documentElement.dataset.theme=theme;
    $('themeIcon').innerHTML= theme==='dark'
      ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.41M17.66 6.34l1.41-1.41"/>'
      : '<path d="M20.5 14.6A9 9 0 0 1 9.4 3.5 9 9 0 1 0 20.5 14.6Z"/>';
    try{localStorage.setItem('tools-offer-clean-theme',theme);}catch(_){}
  }
  function updateGosiControls(){
    ['a','b'].forEach(side=>{
      const o=state[side];
      $(side+'GosiCustomWrap').hidden=o.gosi!=='custom';
    });
  }
  function deltaClass(n){return n>0.005?'positive':n<-.005?'negative':'neutral';}
  function setDelta(id,n){
    const el=$(id);
    el.textContent=signed(n)+' '+t('riyal');
    el.classList.remove('positive','negative','neutral');
    el.classList.add(deltaClass(n));
  }
  function metric(prefix,a,b) {
    $(prefix+'A').textContent=pair(a);
    $(prefix+'B').textContent=pair(b);
    setDelta(prefix+'D',b-a);
  }
  function breakdownRow(body,label,a,b,cls) {
    const tr=document.createElement('tr');
    if(cls) tr.className=cls;
    const l=document.createElement('td');l.textContent=t(label);tr.append(l);
    [a,b].forEach(n=>{const c=document.createElement('td');c.textContent=pair(n);tr.append(c);});
    body.append(tr);
  }
  function render() {
    const a=compute(state.a),b=compute(state.b);
    ['a','b'].forEach(side=>{
      const o=state[side],r=side==='a'?a:b;
      $(side+'Preview').textContent=pair(r.net);
      $(side+'HousingEffective').textContent=pair(r.housing);
      $(side+'TransportEffective').textContent=pair(r.transport);
      $(side+'GosiInfo').textContent=money(r.rate)+'% × '+pair(Math.min(45000,r.base+r.housing))+' = '+pair(r.gosi);
    });
    const ok=ready();
    $('resultEmpty').hidden=ok;
    $('resultContent').hidden=!ok;
    $('exportBtn').disabled=!ok;
    $('printBtn').disabled=!ok;
    if(!ok) return;
    const diff=b.net-a.net;
    const percent=Math.abs(a.net)>0.001 ? diff/Math.abs(a.net)*100 : 0;
    const nearly=Math.abs(diff)<=Math.max(50,Math.max(Math.abs(a.net),Math.abs(b.net))*.005);
    let headline=Math.abs(diff)<.005?'headline_equal':nearly?'headline_near':diff>0?'headline_b':'headline_a';
    $('verdictTitle').textContent=t(headline);
    $('verdictDelta').textContent=signed(diff)+' '+t('riyal');
    $('verdictDelta').className='number '+deltaClass(diff);
    $('verdictPct').textContent=(a.net!==0?signed(percent)+'%':'—')+' · '+t('difference');
    metric('net',a.net,b.net);
    metric('guar',a.guaranteed,b.guaranteed);
    metric('expect',a.expected,b.expected);
    metric('yearOne',a.firstYear,b.firstYear);
    metric('noncash',a.benefits,b.benefits);
    $('vacationDiff').textContent=signed(b.vacation-a.vacation)+' '+(lang==='ar'?'يوم':'days');
    $('hourlyA').textContent=pair(a.hourly)+' / '+(lang==='ar'?'ساعة':'hr');
    $('hourlyB').textContent=pair(b.hourly)+' / '+(lang==='ar'?'ساعة':'hr');
    const body=$('breakdownBody');body.replaceChildren();
    [
      ['basic',a.base,b.base],['housing',a.housing,b.housing],['transport',a.transport,b.transport],['total_other',a.other,b.other],
      ['gross',a.gross,b.gross,'emphasis'],['social',a.gosi,b.gosi],['other_deductions',a.deduction,b.deduction],
      ['monthly_net',a.net,b.net,'emphasis'],['guaranteed',num(state.a.annualGuaranteed),num(state.b.annualGuaranteed)],
      ['annual_bonus',a.expectedBonus,b.expectedBonus],['guaranteed_cash',a.guaranteed,b.guaranteed],
      ['expected_cash',a.expected,b.expected,'emphasis'],['first_year',a.firstYear,b.firstYear],
      ['benefits',a.benefits,b.benefits]
    ].forEach(([k,x,y,cls])=>breakdownRow(body,k,x,y,cls));
    $('breakdownA').textContent=state.a.company||t('old');
    $('breakdownB').textContent=state.b.company||t('new');
  }
  function hasData(){
    return ['a','b'].some(side=>['company','basic','housing','transport','other','deduction','annualGuaranteed','bonus','nonCash','signOn','switchCost'].some(k=>state[side][k]!==''));
  }
  function message(text){
    const el=$('toast');
    el.textContent=text;
    el.hidden=false;
    window.clearTimeout(toastHandle);
    toastHandle=window.setTimeout(()=>{el.hidden=true;},3400);
  }
  function base64url(data){
    const bytes=new TextEncoder().encode(JSON.stringify(data));
    let binary='';for(const byte of bytes)binary+=String.fromCharCode(byte);
    return btoa(binary).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
  }
  function fromBase64url(value){
    const text=atob(value.replaceAll('-','+').replaceAll('_','/'));
    const bytes=Uint8Array.from(text,c=>c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  async function copyShare(){
    try{
      const url=new URL(location.href);
      url.searchParams.set('data',base64url(state));
      if(url.toString().length>8000)throw Error('URL too long');
      if(navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(url.toString());
      else {
        const input=document.createElement('textarea');input.value=url.toString();input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();
        if(!document.execCommand('copy'))throw Error('copy failed');
        input.remove();
      }
      message(t('alert_copied'));
    }catch(_){message(t('share_error'));}
  }
  function downloadCSV(){
    if(!ready()){message(t('export_error'));return;}
    const a=compute(state.a),b=compute(state.b);
    const lines=[[t('item'),state.a.company||t('old'),state.b.company||t('new')],
      [t('basic'),a.base,b.base],[t('housing'),a.housing,b.housing],[t('transport'),a.transport,b.transport],
      [t('other'),a.other,b.other],[t('gross'),a.gross,b.gross],
      [t('social'),a.gosi,b.gosi],[t('other_deductions'),a.deduction,b.deduction],
      [t('monthly_net'),a.net,b.net],[t('guaranteed_cash'),a.guaranteed,b.guaranteed],
      [t('annual_bonus'),a.expectedBonus,b.expectedBonus],[t('expected_cash'),a.expected,b.expected],
      [t('first_year'),a.firstYear,b.firstYear],[t('benefits'),a.benefits,b.benefits],
      [t('vacation'),a.vacation,b.vacation],[t('hourly'),a.hourly,b.hourly]];
    const csv='\uFEFFsep=,\r\n'+lines.map(row=>row.map(x=>'"'+String(x).replaceAll('"','""')+'"').join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    const aTag=document.createElement('a');aTag.href=url;aTag.download='job-offer-comparison.csv';document.body.append(aTag);aTag.click();aTag.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function loadInitial(){
    try{const raw=localStorage.getItem(KEY);if(raw){const obj=JSON.parse(raw);state={a:parseOffer(obj.a),b:parseOffer(obj.b)};}}catch(_){}
    try{
      const encoded=new URL(location.href).searchParams.get('data');
      if(encoded && encoded.length<16000){
        const shared=fromBase64url(encoded);
        state={a:parseOffer(shared.a),b:parseOffer(shared.b)};
        history.replaceState(null,'',location.pathname+location.hash);
        save();
        setTimeout(()=>message(t('alert_import')),150);
      }
    }catch(_){}
    try{lang=localStorage.getItem('tools-offer-clean-lang')==='en'?'en':'ar';}catch(_){}
    try{theme=localStorage.getItem('tools-offer-clean-theme')==='dark'?'dark':'light';}catch(_){}
  }
  function sample(){
    if(hasData() && !confirm(t('confirm_sample')))return;
    state={
      a:{...initialOffer(),company:lang==='ar'?'الوظيفة الحالية':'Current job',basic:'15000',housing:'25',housingUnit:'pct',transport:'1000',other:'500',bonus:'20000',bonusChance:'75',vacation:'25',commute:'60'},
      b:{...initialOffer(),company:lang==='ar'?'العرض الجديد':'New offer',basic:'19000',housing:'25',housingUnit:'pct',transport:'1500',other:'250',bonus:'35000',bonusChance:'50',signOn:'10000',switchCost:'5000',vacation:'30',commute:'35'}
    };
    fill();render();save();message(t('alert_sample'));
  }
  function reset(){
    if(hasData() && !confirm(t('confirm_reset')))return;
    state={a:initialOffer(),b:initialOffer()};
    fill();render();
    try{localStorage.removeItem(KEY);}catch(_){}
    message(t('alert_reset'));
  }
  function init(){
    loadInitial();fill();
    setTheme(theme);setLanguage(lang);
    document.addEventListener('input',event=>{
      const el=event.target;
      if(!el.matches('[data-side][data-key]') || el.tagName==='SELECT')return;
      const {side,key}=el.dataset;
      state[side][key]=el.value;
      render();save();
    });
    document.addEventListener('change',event=>{
      const el=event.target;
      if(!el.matches('[data-side][data-key]'))return;
      const {side,key}=el.dataset;
      state[side][key]=el.value;
      if(['gosi','housingUnit','transportUnit'].includes(key)){updateGosiControls();}
      render();save();
    });
    $('langBtn').addEventListener('click',()=>setLanguage(lang==='ar'?'en':'ar'));
    $('themeBtn').addEventListener('click',()=>setTheme(theme==='light'?'dark':'light'));
    $('sampleBtn').addEventListener('click',sample);
    $('resetBtn').addEventListener('click',reset);
    $('shareBtn').addEventListener('click',copyShare);
    $('exportBtn').addEventListener('click',downloadCSV);
    $('printBtn').addEventListener('click',()=>window.print());
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
