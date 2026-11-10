(() => {
  'use strict';
  const KEY = 'tools-offer-clean-v1';
  const $ = id => document.getElementById(id);
  const Model = window.OfferModel;
  const keys = ['company','tenure','basic','housing','housingUnit','housingRent','transport','transportUnit','other','deduction','gosi','gosiCustom','dependents','annualGuaranteed','bonus','bonusChance','nonCash','signOn','switchCost','vacation','hours','commute'];
  const initialOffer = () => ({
    company:'',tenure:'',basic:'',housing:'',housingUnit:'sar',housingRent:'',transport:'',transportUnit:'sar',
    other:'',deduction:'',gosi:'legacy',gosiCustom:'',dependents:'',annualGuaranteed:'',bonus:'',bonusChance:'50',
    nonCash:'',signOn:'',switchCost:'',vacation:'',hours:'8',commute:'0'
  });
  const initialSettings = () => ({stayYears:'5',exitType:'resign',eosBasis:'actual'});
  const initialCriteria = () => ({weights:{},a:{},b:{}});
  let state = {a:initialOffer(),b:initialOffer(),settings:initialSettings(),criteria:initialCriteria()};
  let lang = 'ar';
  let theme = 'light';
  let toastHandle;
  const words = {
    ar:{
      page_title:'مقارنة عروض العمل',brand_sub:'أداة مقارنة الرواتب',lang:'English',theme:'تغيير المظهر',
      eyebrow:'قرارك الوظيفي، بالأرقام',hero:'قارن عرضك الوظيفي بوضوح',
      hero_desc:'أدخل تفاصيل وظيفتك الحالية والعرض الجديد، وشاهد الفرق في الراتب الشهري والقيمة السنوية بدون تعقيد.',
      sample:'تجربة بأرقام افتراضية',reset:'مسح البيانات',restore_old:'استرجاع بياناتي السابقة',restored_old:'استرجعت بيانات المقارنة السابقة. راجع البدلات المجمّعة.',restore_confirm:'بنسترجع بياناتك من النسخة السابقة، وقد تُجمع بعض البدلات في حقل واحد. تبي تكمل؟',first_step:'بيانات العرضين',
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
      compare_label:'المقارنة المالية',
      tenure:'سنوات خدمتك في هذه الجهة',years_unit:'سنة',tenure_hint:'تُستخدم لحساب مكافأة نهاية الخدمة عند البقاء أو الانتقال.',
      housing_company:'مؤمّن',housing_type:'نوع بدل السكن',housing_rent:'إيجار سكن مماثل سنويًا',
      housing_rent_hint:'السكن المؤمّن لا يدخل في صافي الراتب، وقيمته تُضاف للقيمة السنوية الكاملة. للتأمينات ونهاية الخدمة يُحتسب بأجر شهرين أساسي سنويًا.',
      housing_inkind:'قيمة عينية للتأمينات',
      expat:'غير سعودي (بدون استقطاع)',dependents:'عدد المرافقين على حسابك',
      dependents_hint:'رسوم المرافقين 400 ر.س شهريًا لكل مرافق تُخصم من صافيك. أدخل 0 إذا كانت الجهة تتحملها.',
      dependents_fee:'رسوم المرافقين',
      low_basic:'الأساسي يمثل {p}% فقط من الإجمالي. الأساسي المنخفض يقلل مكافأة نهاية الخدمة والتأمينات، فاطلب رفعه قبل التوقيع.',
      eos_title:'نهاية الخدمة وإجمالي المدة',eos_desc:'قارن البقاء في وظيفتك الحالية بالانتقال الآن، على نفس عدد السنوات.',
      stay_years:'كم سنة تتوقع أن تبقى؟',exit_type:'طريقة انتهاء العلاقة لاحقًا',exit_resign:'استقالة',exit_end:'انتهاء العقد أو إنهاء من الجهة',
      eos_basis:'أجر احتساب المكافأة',basis_actual:'الأجر الفعلي (الإجمالي)',basis_basic_housing:'الأساسي + السكن',basis_basic:'الأساسي فقط',
      eos_award:'مكافأة نهاية الخدمة',period_total:'إجمالي النقد خلال المدة',
      stay_label:'البقاء في الحالية',switch_label:'الانتقال للعرض الجديد',switch_diff:'الفرق (الانتقال − البقاء)',
      eos_switch_explain:'إذا انتقلت الآن (مدة خدمتك {t} سنة) تستحق {s} مكافأة نهاية الخدمة من جهتك الحالية: {v}.',
      eos_switch_none:'إذا انتقلت الآن (مدة خدمتك {t} سنة) لا تستحق مكافأة نهاية خدمة من جهتك الحالية، لأن الاستقالة قبل سنتين لا تُستحق عنها مكافأة.',
      eos_no_tenure:'أدخل سنوات خدمتك في الوظيفة الحالية لحساب ما تستحقه عند الانتقال الآن.',
      share_third:'ثلث',share_two:'ثلثي',share_full:'كامل',
      eos_rules:'نصف شهر عن كل سنة من أول خمس سنوات وشهر عن كل سنة بعدها. عند الاستقالة: لا شيء قبل سنتين، الثلث من 2 إلى 5 سنوات، الثلثان من 5 إلى 10، وكاملة بعد 10. الحساب بدون زيادات سنوية، فتأكد من عقدك ونظام العمل.',
      total_value:'القيمة السنوية الكاملة (نقد + مزايا + سكن)',
      eos_leave_now:'مستحقات الحالية عند الانتقال الآن',eos_stay_row:'نهاية الخدمة عند البقاء',eos_new_row:'نهاية الخدمة من الجهة الجديدة',
      criteria_step:'قيّم ما لا تقيسه الأرقام',criteria_hint:'قيّم كل معيار من 0 إلى 10 لكل وظيفة، وعدّل الأوزان حسب أولوياتك.',
      criteria_kicker:'المقارنة الشاملة بالمعايير',advantage_label:'أفضلية العرض الجديد',
      criteria_empty:'قيّم معيارًا واحدًا على الأقل في الوظيفتين لعرض النتيجة.',
      criteria_b:'العرض الجديد أفضل حسب أولوياتك',criteria_a:'الوظيفة الحالية أفضل حسب أولوياتك',criteria_tie:'الوظيفتان متساويتان حسب أولوياتك',
      criteria_meta:'{n} من {m} معيارًا مقيّمًا',weight:'الوزن',weight_total:'مجموع الأوزان: {w}',
      reset_weights:'استعادة الأوزان الافتراضية',clear_ratings:'مسح التقييمات',not_rated:'غير مقيّم',
      criteria_note:'النتيجة = مجموع (الوزن × التقييم) مقسومًا على أعلى مجموع ممكن. المعيار يدخل في الحساب فقط إذا قيّمته في الوظيفتين. الأوزان نسبية ولا يلزم أن يكون مجموعها 100.',
      score_aria:'النتيجة: الحالية {a}%، الجديدة {b}%',rate_of:'{v} من 10',
      criteria_score:'نتيجة المعايير',
      crit_salary:'الراتب الأساسي والمزايا المالية',crit_stability:'استقرار الشركة وسمعتها',crit_growth:'النمو والمسار الوظيفي',
      crit_culture:'بيئة العمل والثقافة',crit_bonus:'المكافآت والحوافز السنوية',crit_training:'التدريب والتطوير',
      crit_flexibility:'مرونة العمل والعمل عن بُعد',crit_balance:'التوازن بين العمل والحياة',crit_title:'المسمى الوظيفي والمسؤوليات',
      crit_size:'حجم الشركة',crit_international:'فروع دولية وفرص الانتقال',crit_location:'الموقع وسهولة الوصول',
      crit_medical:'التأمين الطبي والبدلات',crit_hours:'ساعات العمل الفعلية',crit_rotation:'التدوير الوظيفي والمشاريع',
      crit_travel:'السفر والخبرة الدولية'
    },
    en:{
      page_title:'Job Offer Comparison',brand_sub:'Salary comparison tool',lang:'عربي',theme:'Switch appearance',
      eyebrow:'Make a clearer career decision',hero:'Compare job offers with clarity',
      hero_desc:'Enter your current compensation and the new offer to see monthly and yearly differences without unnecessary complexity.',
      sample:'Try an example',reset:'Clear data',restore_old:'Restore previous data',restored_old:'Previous comparison restored. Review grouped allowances.',restore_confirm:'Restore your saved comparison? Some old allowance fields may be combined.',first_step:'Enter both offers',
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
      compare_label:'Financial comparison',
      tenure:'Years of service with this employer',years_unit:'yrs',tenure_hint:'Used to estimate end-of-service pay if you stay or switch.',
      housing_company:'Provided',housing_type:'Housing allowance type',housing_rent:'Annual rent of similar housing',
      housing_rent_hint:'Provided housing is not part of take-home pay; its value is added to the full annual value. For GOSI and end of service it counts as two months of base pay per year.',
      housing_inkind:'In-kind value for GOSI',
      expat:'Non-Saudi (no deduction)',dependents:'Dependents on your iqama',
      dependents_hint:'The dependent levy is SAR 400 per dependent per month and is deducted from your take-home. Enter 0 if the employer pays it.',
      dependents_fee:'Dependent levy',
      low_basic:'Base pay is only {p}% of the package. A low base reduces end-of-service pay and social insurance, so ask for a higher base before signing.',
      eos_title:'End of service and multi-year total',eos_desc:'Compare staying in your current job with switching now, over the same number of years.',
      stay_years:'How many years do you expect to stay?',exit_type:'How the job would end',exit_resign:'Resignation',exit_end:'Contract end or employer termination',
      eos_basis:'Wage used for the award',basis_actual:'Actual wage (total)',basis_basic_housing:'Base + housing',basis_basic:'Base only',
      eos_award:'End-of-service award',period_total:'Total cash over the period',
      stay_label:'Stay in current job',switch_label:'Switch to new offer',switch_diff:'Difference (switch − stay)',
      eos_switch_explain:'If you switch now after {t} years of service, you receive {s} of your current end-of-service award: {v}.',
      eos_switch_none:'If you switch now after {t} years of service, you receive no end-of-service award from your current employer, because resigning before 2 years earns none.',
      eos_no_tenure:'Enter your years of service in the current job to see what you would receive if you switch now.',
      share_third:'one third',share_two:'two thirds',share_full:'the full amount',
      eos_rules:'Half a month per year for the first five years and a full month per year after. On resignation: nothing before 2 years, one third for 2 to 5 years, two thirds for 5 to 10, and the full amount after 10. No annual raises are assumed; confirm against your contract and the Labor Law.',
      total_value:'Full annual value (cash + benefits + housing)',
      eos_leave_now:'Current-job award if you switch now',eos_stay_row:'End of service if you stay',eos_new_row:'End of service from new employer',
      criteria_step:'Rate what numbers miss',criteria_hint:'Rate each criterion from 0 to 10 for both jobs, and adjust the weights to your priorities.',
      criteria_kicker:'Weighted criteria comparison',advantage_label:'New offer advantage',
      criteria_empty:'Rate at least one criterion for both jobs to see the result.',
      criteria_b:'The new offer fits your priorities better',criteria_a:'Your current job fits your priorities better',criteria_tie:'Both jobs fit your priorities equally',
      criteria_meta:'{n} of {m} criteria rated',weight:'Weight',weight_total:'Total weight: {w}',
      reset_weights:'Reset default weights',clear_ratings:'Clear ratings',not_rated:'Not rated',
      criteria_note:'Score = sum of (weight × rating) divided by the highest possible sum. A criterion counts only when both jobs are rated. Weights are relative and do not need to add up to 100.',
      score_aria:'Score: current {a}%, new {b}%',rate_of:'{v} of 10',
      criteria_score:'Criteria score',
      crit_salary:'Base salary & financial benefits',crit_stability:'Company stability & reputation',crit_growth:'Career growth & path',
      crit_culture:'Work environment & culture',crit_bonus:'Bonuses & annual incentives',crit_training:'Training & development',
      crit_flexibility:'Flexibility & remote work',crit_balance:'Work-life balance',crit_title:'Job title & responsibilities',
      crit_size:'Company size',crit_international:'International branches / relocation',crit_location:'Location & accessibility',
      crit_medical:'Medical insurance & allowances',crit_hours:'Actual working hours',crit_rotation:'Job rotation & projects',
      crit_travel:'Travel & global exposure'
    }
  };
  const t = key => (words[lang] && words[lang][key]) || words.ar[key] || key;
  const tf = (key, vars) => t(key).replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '');
  const num = v => {const n = Number(v); return Number.isFinite(n) ? Math.max(0,n) : 0;};
  const money = n => {const value=Number.isFinite(n)?n:0;const decimals=Math.abs(value-Math.round(value))>0.00001?2:0;return new Intl.NumberFormat(lang==='ar'?'en-SA':'en-US',{maximumFractionDigits:2,minimumFractionDigits:decimals}).format(value);};
  const signed = n => (n>0?'+':n<0?'−':'') + money(Math.abs(n));
  const pair = (n,withUnit=true) => money(n) + (withUnit?' '+t('riyal'):'');
  const clean = v => (v==null?'':String(v)).slice(0,120);
  const parseOffer = input => {
    const obj = initialOffer();
    if(input && typeof input==='object'){
      keys.forEach(k=>{if(Object.prototype.hasOwnProperty.call(input,k)) obj[k]=clean(input[k]);});
      if(!['sar','pct','company'].includes(obj.housingUnit))obj.housingUnit='sar';
      if(!['sar','pct'].includes(obj.transportUnit))obj.transportUnit='sar';
      if(!['legacy','newcomer','none','expat','custom'].includes(obj.gosi))obj.gosi='legacy';
    }
    return obj;
  };
  const parseSettings = input => {
    const obj = initialSettings();
    if(input && typeof input==='object'){
      if(Number(input.stayYears)>0)obj.stayYears=clean(input.stayYears);
      if(['resign','end'].includes(input.exitType))obj.exitType=input.exitType;
      if(['actual','basic_housing','basic'].includes(input.eosBasis))obj.eosBasis=input.eosBasis;
    }
    return obj;
  };
  const parseCriteria = input => {
    const out = initialCriteria();
    if(!input || typeof input!=='object')return out;
    Model.CRITERIA.forEach(({id})=>{
      ['weights','a','b'].forEach(group=>{
        const v=input[group]&&input[group][id];
        if(v!==undefined && v!=='' && Number.isFinite(Number(v)))out[group][id]=String(Math.min(group==='weights'?100:Model.RATING_MAX,Math.max(0,Number(v))));
      });
    });
    return out;
  };
  const parseState = input => ({a:parseOffer(input&&input.a),b:parseOffer(input&&input.b),settings:parseSettings(input&&input.settings),criteria:parseCriteria(input&&input.criteria)});
  function save(){
    try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){}
  }
  const compute = o => Model.computeOffer(o,{eosBasis:state.settings.eosBasis});
  const horizon = (a,b) => Model.compareHorizon(a,b,{...state.settings,tenure:state.a.tenure});
  function ready(){return num(state.a.basic)>0 && num(state.b.basic)>0;}
  function fill(){
    document.querySelectorAll('[data-side][data-key]').forEach(el=>{
      const v=state[el.dataset.side][el.dataset.key];
      if(el.value!==v) el.value=v;
    });
    document.querySelectorAll('[data-setting]').forEach(el=>{
      const v=state.settings[el.dataset.setting];
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
    document.querySelectorAll('[data-choice-new]').forEach(el=>{el.textContent=t('newcomer')+' ('+money(Model.newcomerRate())+'%)';});
    render();
    buildCriteria();
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
      $(side+'DependentsWrap').hidden=o.gosi!=='expat';
      const company=o.housingUnit==='company';
      $(side+'HousingRentWrap').hidden=!company;
      $(side+'housingInput').disabled=company;
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
    [a,b].forEach(n=>{const c=document.createElement('td');c.textContent=n==null?'—':pair(n);tr.append(c);});
    body.append(tr);
  }
  function render() {
    const a=compute(state.a),b=compute(state.b);
    ['a','b'].forEach(side=>{
      const r=side==='a'?a:b;
      $(side+'Preview').textContent=pair(r.net);
      $(side+'HousingEffective').textContent=r.companyHousing ? t('housing_inkind')+': '+pair(r.housingInKind) : pair(r.housing);
      $(side+'TransportEffective').textContent=pair(r.transport);
      $(side+'GosiInfo').textContent=money(r.rate)+'% × '+pair(r.gosiBase)+' = '+pair(r.gosi);
      $(side+'DependentsInfo').textContent=t('dependents_fee')+': '+pair(r.dependentsFee);
      const warn=$(side+'BasicWarning');
      warn.hidden=!r.lowBasic;
      warn.textContent=r.lowBasic?tf('low_basic',{p:Math.round(r.basicShare*100)}):'';
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
    metric('totalValue',a.totalValue,b.totalValue);
    const h=horizon(a,b);
    $('eosStay').textContent=pair(h.stayEos);
    $('eosSwitch').textContent=pair(h.switchEos);
    setDelta('eosD',h.switchEos-h.stayEos);
    $('periodStay').textContent=pair(h.stayTotal);
    $('periodSwitch').textContent=pair(h.switchTotal);
    setDelta('periodD',h.switchTotal-h.stayTotal);
    const shareKey=h.leaveNowShare<.5?'share_third':h.leaveNowShare<1?'share_two':'share_full';
    const tenureText=new Intl.NumberFormat('en-US',{maximumFractionDigits:1}).format(h.tenure);
    $('eosExplain').textContent=h.tenure<=0 ? t('eos_no_tenure')
      : h.leaveNowShare===0 ? tf('eos_switch_none',{t:tenureText})
      : tf('eos_switch_explain',{t:tenureText,s:t(shareKey),v:pair(h.leaveNowEos)});
    $('vacationDiff').textContent=signed(b.vacation-a.vacation)+' '+(lang==='ar'?'يوم':'days');
    $('hourlyA').textContent=pair(a.hourly)+' / '+(lang==='ar'?'ساعة':'hr');
    $('hourlyB').textContent=pair(b.hourly)+' / '+(lang==='ar'?'ساعة':'hr');
    const body=$('breakdownBody');body.replaceChildren();
    [
      ['basic',a.base,b.base],['housing',a.housing,b.housing],['transport',a.transport,b.transport],['total_other',a.other,b.other],
      ['gross',a.gross,b.gross,'emphasis'],['social',a.gosi,b.gosi],['dependents_fee',a.dependentsFee,b.dependentsFee],
      ['other_deductions',a.deduction,b.deduction],
      ['monthly_net',a.net,b.net,'emphasis'],['guaranteed',num(state.a.annualGuaranteed),num(state.b.annualGuaranteed)],
      ['annual_bonus',a.expectedBonus,b.expectedBonus],['guaranteed_cash',a.guaranteed,b.guaranteed],
      ['expected_cash',a.expected,b.expected,'emphasis'],['first_year',a.firstYear,b.firstYear],
      ['benefits',a.benefits,b.benefits],['total_value',a.totalValue,b.totalValue,'emphasis'],
      ['eos_stay_row',h.stayEos,null],['eos_leave_now',null,h.leaveNowEos],['eos_new_row',null,h.newEos],
      ['period_total',h.stayTotal,h.switchTotal,'emphasis']
    ].forEach(([k,x,y,cls])=>breakdownRow(body,k,x,y,cls));
    $('breakdownA').textContent=state.a.company||t('old');
    $('breakdownB').textContent=state.b.company||t('new');
  }
  function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!=null)node.textContent=text;return node;}
  // Builds one row per criterion: name, weight, two 0-10 ratings and a paired bar.
  function buildCriteria(){
    const list=$('criteriaList');
    list.replaceChildren();
    Model.CRITERIA.forEach(({id,weight})=>{
      const name=t('crit_'+id);
      const row=el('div','crit-row');row.dataset.crit=id;
      const head=el('div','crit-head');
      const title=el('span','crit-name',name);title.id='crit-'+id+'-name';
      const wLabel=el('label','crit-weight');
      wLabel.append(el('span',null,t('weight')));
      const wInput=el('input','weight-input');
      Object.assign(wInput,{type:'number',min:'0',max:'100',step:'1',inputMode:'numeric',placeholder:String(weight)});
      wInput.dataset.weight=id;
      wInput.setAttribute('aria-label',t('weight')+': '+name);
      wInput.value=state.criteria.weights[id]??'';
      wLabel.append(wInput);
      head.append(title,wLabel);
      // One line per job: label, 0-10 rating, and its bar, so a row stays short on phones.
      const lines=el('div','crit-lines');
      ['a','b'].forEach(side=>{
        const line=el('div','crit-bar-line');line.dataset.side=side;
        const tag=el('span','rate-label');
        tag.append(el('i','swatch series-'+side),el('span',null,t(side==='a'?'current_label':'new_label')));
        const select=el('select','select-input rate-select');
        select.dataset.rateSide=side;select.dataset.critId=id;
        select.setAttribute('aria-label',name+': '+t(side==='a'?'old':'new'));
        select.append(el('option',null,'—'));select.options[0].value='';
        for(let v=0;v<=Model.RATING_MAX;v++){const o=el('option',null,String(v));o.value=String(v);select.append(o);}
        select.value=state.criteria[side][id]??'';
        const track=el('div','crit-track');
        track.append(el('div','crit-fill series-'+side));
        line.append(tag,select,track);
        lines.append(line);
      });
      row.append(head,lines);
      list.append(row);
    });
    renderCriteria();
  }
  function renderCriteria(){
    const s=Model.scoreCriteria(state.criteria.weights,state.criteria.a,state.criteria.b);
    s.rows.forEach(r=>{
      const row=document.querySelector('.crit-row[data-crit="'+r.id+'"]');
      if(!row)return;
      row.classList.toggle('is-muted',!r.rated);
      ['a','b'].forEach(side=>{
        const v=r[side];
        const line=row.querySelector('.crit-bar-line[data-side="'+side+'"]');
        line.querySelector('.crit-fill').style.width=(v==null?0:v/Model.RATING_MAX*100)+'%';
        line.querySelector('.crit-track').title=(side==='a'?t('current_label'):t('new_label'))+': '+(v==null?t('not_rated'):tf('rate_of',{v}))+' · '+t('weight')+' '+money(r.weight);
      });
    });
    $('weightTotal').textContent=tf('weight_total',{w:money(s.totalWeight)});
    const has=s.ratedCount>0;
    $('criteriaVerdict').textContent=has?t(s.winner==='tie'?'criteria_tie':s.winner==='b'?'criteria_b':'criteria_a'):t('criteria_empty');
    $('criteriaMeta').textContent=tf('criteria_meta',{n:s.ratedCount,m:Model.CRITERIA.length});
    const adv=$('criteriaAdvantage');
    adv.textContent=has?signed(s.advantage)+'%':'—';
    adv.className='number '+(has?deltaClass(s.advantage):'neutral');
    const pct=n=>new Intl.NumberFormat('en-US',{maximumFractionDigits:1}).format(n);
    adv.textContent=has?(s.advantage>0?'+':s.advantage<0?'−':'')+pct(Math.abs(s.advantage))+'%':'—';
    [['A',s.scoreA],['B',s.scoreB]].forEach(([k,v])=>{
      $('scoreFill'+k).style.width=(has?v:0)+'%';
      $('score'+k).textContent=has?pct(v)+'%':'—';
    });
    $('scoreBars').setAttribute('aria-label',has?tf('score_aria',{a:pct(s.scoreA),b:pct(s.scoreB)}):t('criteria_empty'));
    return s;
  }
  function hasData(){
    const rated=['a','b','weights'].some(g=>Object.keys(state.criteria[g]).length>0);
    return rated || ['a','b'].some(side=>['company','tenure','basic','housing','housingRent','transport','other','deduction','dependents','annualGuaranteed','bonus','nonCash','signOn','switchCost'].some(k=>state[side][k]!==''));
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
    const a=compute(state.a),b=compute(state.b),h=horizon(a,b);
    const lines=[[t('item'),state.a.company||t('old'),state.b.company||t('new')],
      [t('basic'),a.base,b.base],[t('housing'),a.housing,b.housing],[t('housing_rent'),a.housingRent,b.housingRent],
      [t('transport'),a.transport,b.transport],
      [t('other'),a.other,b.other],[t('gross'),a.gross,b.gross],
      [t('social'),a.gosi,b.gosi],[t('dependents_fee'),a.dependentsFee,b.dependentsFee],[t('other_deductions'),a.deduction,b.deduction],
      [t('monthly_net'),a.net,b.net],[t('guaranteed_cash'),a.guaranteed,b.guaranteed],
      [t('annual_bonus'),a.expectedBonus,b.expectedBonus],[t('expected_cash'),a.expected,b.expected],
      [t('first_year'),a.firstYear,b.firstYear],[t('benefits'),a.benefits,b.benefits],
      [t('vacation'),a.vacation,b.vacation],[t('hourly'),a.hourly,b.hourly],
      [t('total_value'),a.totalValue,b.totalValue],[t('stay_years'),h.years,h.years],
      [t('eos_stay_row'),h.stayEos,''],[t('eos_leave_now'),'',h.leaveNowEos],[t('eos_new_row'),'',h.newEos],
      [t('period_total'),h.stayTotal,h.switchTotal]];
    const s=Model.scoreCriteria(state.criteria.weights,state.criteria.a,state.criteria.b);
    s.rows.forEach(r=>lines.push([t('crit_'+r.id)+' ('+t('weight')+' '+r.weight+')',r.a??'',r.b??'']));
    lines.push([t('criteria_score')+' %',Math.round(s.scoreA*10)/10,Math.round(s.scoreB*10)/10]);
    const csv='\uFEFFsep=,\r\n'+lines.map(row=>row.map(x=>'"'+String(x).replaceAll('"','""')+'"').join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    const aTag=document.createElement('a');aTag.href=url;aTag.download='job-offer-comparison.csv';document.body.append(aTag);aTag.click();aTag.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function loadInitial(){
    try{const raw=localStorage.getItem(KEY);if(raw)state=parseState(JSON.parse(raw));}catch(_){}
    try{
      const encoded=new URL(location.href).searchParams.get('data');
      if(encoded && encoded.length<16000){
        state=parseState(fromBase64url(encoded));
        history.replaceState(null,'',location.pathname+location.hash);
        save();
        setTimeout(()=>message(t('alert_import')),150);
      }
    }catch(_){}
    try{lang=localStorage.getItem('tools-offer-clean-lang')==='en'?'en':'ar';}catch(_){}
    try{theme=localStorage.getItem('tools-offer-clean-theme')==='dark'?'dark':'light';}catch(_){}
  }

  // Opt-in migration, leaves the previous version untouched for recovery.
  function migrateLegacy(){
    try{
      const raw=localStorage.getItem('offer_v31');
      if(!raw)return false;
      const old=JSON.parse(raw);
      if(!old || !Array.isArray(old.A) || !Array.isArray(old.B))return false;
      if(!confirm(t('restore_confirm')))return false;
      const restored={};
      for(const [side,oldSide] of [['a','A'],['b','B']]){
        const all=old[oldSide],out=initialOffer();
        out.company=clean(side==='a'?old.coA:old.coB);
        const resolve=(f,seen=new Set())=>{
          if(!f || f.enabled===false || seen.has(f.id))return 0;
          if(!f.isPct)return num(f.value);
          seen.add(f.id);
          const total=[f.pctRef,f.pctRef2].filter(Boolean).reduce((sum,id)=>sum+resolve(all.find(x=>x.id===id),seen),0);
          seen.delete(f.id);
          return total*num(f.pct)/100;
        };
        const active=all.filter(f=>f && f.enabled!==false);
        const byName=(name)=>active.find(f=>String(f.name||'').toLowerCase().includes(name));
        const base=byName('basic salary')||active.find(f=>/basic/i.test(f.name||'')&&!f.isDeduction);
        out.basic=base?String(resolve(base)):'';
        const allowanceTo=(name,key)=>{
          const f=byName(name);
          if(!f)return;
          if(f.isPct && f.pctRef===base?.id && !f.pctRef2){out[key]=String(num(f.pct));out[key+'Unit']='pct';}
          else {out[key]=String(resolve(f));out[key+'Unit']='sar';}
        };
        allowanceTo('housing','housing');
        allowanceTo('transport','transport');
        let other=0,deductions=0,guaranteed=0,benefits=0,bonusTarget=0,bonusExpected=0;
        for(const f of active){
          if([base?.id,byName('housing')?.id,byName('transport')?.id].includes(f.id))continue;
          if(f.isGosi || /^gosi$/i.test(f.name||''))continue;
          const v=resolve(f);
          if(f.isDeduction){if(!f.isAnnual)deductions+=v;continue;}
          const category=String(f.category||'').toLowerCase();
          if(f.isAnnual){
            if(category==='variable'||/bonus/i.test(f.name||'')){
              bonusTarget+=v;bonusExpected+=v*Math.min(100,num(f.payout==null?50:f.payout))/100;
            }else if(category==='reimbursement'||category==='noncash'||/insurance|education|ticket|phone bill/i.test(f.name||'')){
              benefits+=v*Math.min(100,num(f.usage==null?100:f.usage))/100;
            }else guaranteed+=v;
          }else other+=v;
        }
        out.other=other?String(other):'';
        out.deduction=deductions?String(deductions):'';
        out.annualGuaranteed=guaranteed?String(guaranteed):'';
        out.nonCash=benefits?String(benefits):'';
        out.bonus=bonusTarget?String(bonusTarget):'';
        out.bonusChance=bonusTarget?String(Math.round(bonusExpected/bonusTarget*10000)/100):'50';
        const payroll=old.payroll?.[oldSide];
        if(old.nationality?.[oldSide]==='nonsaudi')out.gosi='expat';
        else if(payroll?.coverage==='none')out.gosi='none';
        else if(payroll?.override!=='' && payroll?.override!=null){out.gosi='custom';out.gosiCustom=String(num(payroll.override));}
        else if(payroll?.coverage==='new')out.gosi='newcomer';
        const transition=old.transition?.[oldSide]||{};
        out.signOn=transition.signOn?String(num(transition.signOn)):'';
        const cost=num(transition.relocation)+num(transition.lostBonus)+num(transition.repayment)+num(transition.unpaidGap);
        out.switchCost=cost?String(cost):'';
        const vac=old[side==='a'?'vacA':'vacB'];
        if(vac!=null)out.vacation=String(num(vac));
        const hours=old[side==='a'?'hoursA':'hoursB'];
        if(hours!=null)out.hours=String(num(hours));
        const commute=old[side==='a'?'commuteA':'commuteB'];
        if(commute!=null)out.commute=String(num(commute));
        restored[side]=out;
      }
      state={...restored,settings:state.settings||initialSettings(),criteria:state.criteria||initialCriteria()};fill();render();save();$('legacyBtn').hidden=true;
      message(t('restored_old'));return true;
    }catch(_){return false;}
  }

  function sample(){
    if(hasData() && !confirm(t('confirm_sample')))return;
    state={
      a:{...initialOffer(),company:lang==='ar'?'الوظيفة الحالية':'Current job',tenure:'4',basic:'15000',housing:'25',housingUnit:'pct',transport:'1000',other:'500',bonus:'20000',bonusChance:'75',vacation:'25',commute:'60'},
      b:{...initialOffer(),company:lang==='ar'?'العرض الجديد':'New offer',basic:'19000',housing:'25',housingUnit:'pct',transport:'1500',other:'250',bonus:'35000',bonusChance:'50',signOn:'10000',switchCost:'5000',vacation:'30',commute:'35'},
      settings:initialSettings(),
      // Sample ratings from the criteria sheet, rescaled to 0-10.
      criteria:{weights:{},
        a:{salary:'10',stability:'2',growth:'6',culture:'10',bonus:'8',training:'10',flexibility:'10',balance:'2',title:'6',size:'6',international:'2',location:'10',medical:'10',hours:'10',rotation:'8',travel:'8'},
        b:{salary:'10',stability:'9',growth:'9',culture:'9',bonus:'10',training:'10',flexibility:'10',balance:'10',title:'10',size:'10',international:'8',location:'8',medical:'10',hours:'0',rotation:'8',travel:'8'}}
    };
    fill();render();buildCriteria();save();message(t('alert_sample'));
  }
  function reset(){
    if(hasData() && !confirm(t('confirm_reset')))return;
    state={a:initialOffer(),b:initialOffer(),settings:initialSettings(),criteria:initialCriteria()};
    fill();render();buildCriteria();
    try{localStorage.removeItem(KEY);}catch(_){}
    message(t('alert_reset'));
  }
  function init(){
    loadInitial();fill();
    setTheme(theme);setLanguage(lang);
    try{$('legacyBtn').hidden=!localStorage.getItem('offer_v31');}catch(_){}
    const setCriteria=(group,id,value)=>{
      if(value==='')delete state.criteria[group][id];
      else state.criteria[group][id]=value;
      renderCriteria();save();
    };
    document.addEventListener('input',event=>{
      const el=event.target;
      if(el.matches('[data-weight]')){setCriteria('weights',el.dataset.weight,el.value);return;}
      if(el.matches('[data-setting]') && el.tagName!=='SELECT'){state.settings[el.dataset.setting]=el.value;render();save();return;}
      if(!el.matches('[data-side][data-key]') || el.tagName==='SELECT')return;
      const {side,key}=el.dataset;
      state[side][key]=el.value;
      render();save();
    });
    document.addEventListener('change',event=>{
      const el=event.target;
      if(el.matches('[data-rate-side]')){setCriteria(el.dataset.rateSide,el.dataset.critId,el.value);return;}
      if(el.matches('[data-weight]'))return;
      if(el.matches('[data-setting]')){state.settings[el.dataset.setting]=el.value;render();save();return;}
      if(!el.matches('[data-side][data-key]'))return;
      const {side,key}=el.dataset;
      state[side][key]=el.value;
      if(['gosi','housingUnit','transportUnit'].includes(key)){updateGosiControls();}
      render();save();
    });
    $('langBtn').addEventListener('click',()=>setLanguage(lang==='ar'?'en':'ar'));
    $('themeBtn').addEventListener('click',()=>setTheme(theme==='light'?'dark':'light'));
    $('sampleBtn').addEventListener('click',sample);
    $('legacyBtn').addEventListener('click',migrateLegacy);
    $('resetBtn').addEventListener('click',reset);
    $('shareBtn').addEventListener('click',copyShare);
    $('exportBtn').addEventListener('click',downloadCSV);
    $('printBtn').addEventListener('click',()=>window.print());
    $('resetWeightsBtn').addEventListener('click',()=>{state.criteria.weights={};buildCriteria();save();});
    $('clearRatingsBtn').addEventListener('click',()=>{state.criteria.a={};state.criteria.b={};buildCriteria();save();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
