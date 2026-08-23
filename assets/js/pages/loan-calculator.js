(() => {
    'use strict';

    const COPY = {
        ar: {
            title:'مقارن القروض الشامل', subtitle:'حاسبة القروض مع جميع التفاصيل والتقييدات التنظيمية السعودية', basicData:'البيانات الأساسية',
            propertyPrice:'سعر العقار (ريال سعودي)', propertyHint:'السعر الإجمالي للعقار (فوق 1 مليون تطبق ضريبة)', interestRate:'معدل الفائدة السنوي (%)', loanTerm:'مدة القرض (سنوات)',
            salary:'الراتب الشهري (ريال سعودي)', salaryHint:'لحساب نسبة الدين إلى الدخل (DTI)', additionalCosts:'التكاليف الإضافية', salesCommission:'عمولة المبيعات (ريال)', bankFees:'رسوم البنك (ريال)',
            taxAmount:'الضريبة (للعقارات فوق 1 مليون ريال)', taxHint:'تُحسب تلقائيًا إذا كان السعر > 1,000,000 ريال', additionalFees:'رسوم أخرى (ريال)', maritalSection:'الحالة الاجتماعية', maritalStatus:'الحالة الاجتماعية',
            single:'أعزب', married:'متزوج (يحصل على دعم إسكان تلقائيًا)', calculate:'حساب شامل', clear:'مسح البيانات', resultsTitle:'النتائج والمقارنة', noResults:'أدخل البيانات واضغط "حساب شامل" لعرض النتائج',
            downPaymentLabel:'الدفعة الأولى (10% + 10,000 ريال)', totalFeesLabel:'إجمالي التكاليف (بدون دعم إسكان)', amountNeededLabel:'المبلغ النهائي المطلوب', withSupportLabel:'بعد خصم دعم إسكان', compareOptions:'مقارنة الخيارات',
            item:'البند', option1:'الخيار 1: دفعة كاش', option2:'الخيار 2: قرض شخصي', difference:'الفرق', riskAssessment:'تقييم المخاطر', recommendations:'التوصيات', scheduleTitle:'جدول السداد الشهري (120 شهر)', month:'الشهر',
            monthlyPayment:'القسط الشهري', principal:'أصل القرض', interest:'الفوائد', balance:'الرصيد', loanAmount:'مبلغ القرض', totalInterest:'إجمالي الفوائد', totalAmount:'إجمالي المبلغ المدفوع', debtRatio:'نسبة الدين إلى الدخل (DTI)',
            eskanSupport:'دعم إسكان المخصص', netSalary:'صافي الراتب الشهري', personalLoanAmount:'مبلغ القرض الشخصي', personalLoanPayment:'قسط القرض الشخصي', combinedPayment:'القسط المجمع (5 سنوات)', totalPayments:'إجمالي المدفوعات', monthsCount:'عدد الأشهر',
            compliant:'متوافق', nonCompliant:'يخالف اللوائح', riskLow:'مخاطر منخفضة', riskMedium:'مخاطر متوسطة', riskHigh:'مخاطر عالية', riskReject:'مرفوض', requiredFields:'الرجاء إدخال جميع الحقول المطلوبة',
            showingMonths:(shown,total)=>`عرض ${shown} من ${total} شهر`, netSalaryPrefix:'صافي الراتب', dtiFiveYears:'DTI (5 سنوات)', recommendationLow:'مستوى الدين ضمن النطاق المريح نسبيًا.', recommendationMedium:'راجع هامش الأمان الشهري قبل الالتزام.', recommendationHigh:'نسبة الالتزام مرتفعة. يفضّل تخفيض مبلغ التمويل أو زيادة الدفعة الأولى.', recommendationReject:'نسبة الالتزام تتجاوز الحد المقبول.'
        },
        en: {
            title:'Comprehensive Loan Comparator', subtitle:'Compare housing loan scenarios with Saudi financing constraints and full repayment details.', basicData:'Basic Information',
            propertyPrice:'Property Price (SAR)', propertyHint:'Total property price. Tax is applied when the price exceeds SAR 1,000,000.', interestRate:'Annual Interest Rate (%)', loanTerm:'Loan Term (Years)',
            salary:'Monthly Salary (SAR)', salaryHint:'Used to calculate the debt-to-income ratio (DTI).', additionalCosts:'Additional Costs', salesCommission:'Sales Commission (SAR)', bankFees:'Bank Fees (SAR)',
            taxAmount:'Tax (properties above SAR 1,000,000)', taxHint:'Calculated automatically when the property price exceeds SAR 1,000,000.', additionalFees:'Other Fees (SAR)', maritalSection:'Marital Status', maritalStatus:'Marital Status',
            single:'Single', married:'Married (Eskan support applied automatically)', calculate:'Calculate', clear:'Clear', resultsTitle:'Results and Comparison', noResults:'Enter the details and select "Calculate" to view the results.',
            downPaymentLabel:'Down Payment (10% + SAR 10,000)', totalFeesLabel:'Total Costs (before Eskan support)', amountNeededLabel:'Total Amount Required', withSupportLabel:'After Eskan Support', compareOptions:'Option Comparison',
            item:'Item', option1:'Option 1: Cash Down Payment', option2:'Option 2: Personal Loan', difference:'Difference', riskAssessment:'Risk Assessment', recommendations:'Recommendations', scheduleTitle:'Monthly Repayment Schedule (120 Months)', month:'Month',
            monthlyPayment:'Monthly Payment', principal:'Principal', interest:'Interest', balance:'Balance', loanAmount:'Loan Amount', totalInterest:'Total Interest', totalAmount:'Total Amount Paid', debtRatio:'Debt-to-Income Ratio (DTI)',
            eskanSupport:'Allocated Eskan Support', netSalary:'Monthly Net Salary', personalLoanAmount:'Personal Loan Amount', personalLoanPayment:'Personal Loan Payment', combinedPayment:'Combined Payment (5 Years)', totalPayments:'Total Payments', monthsCount:'Number of Months',
            compliant:'Compliant', nonCompliant:'Non-compliant', riskLow:'Low Risk', riskMedium:'Medium Risk', riskHigh:'High Risk', riskReject:'Rejected', requiredFields:'Please enter all required fields.',
            showingMonths:(shown,total)=>`Showing ${shown} of ${total} months`, netSalaryPrefix:'Net Salary', dtiFiveYears:'DTI (5 years)', recommendationLow:'Debt level is within a relatively comfortable range.', recommendationMedium:'Review your monthly safety margin before committing.', recommendationHigh:'Debt commitment is high. Consider reducing the financing amount or increasing the down payment.', recommendationReject:'Debt commitment exceeds the acceptable limit.'
        }
    };

    const ESKAN_SUPPORT_AMOUNT = 111750;
    const NUMBER_LOCALE = 'en-US';
    const MONEY_INPUT_IDS = ['propertyPrice','salary','salesCommission','bankFees','taxAmount','additionalFees'];
    let option1Data = null;
    let option2Data = null;
    let activeSchedule = 'option1';
    let currentLang = 'ar';

    const t = key => COPY[currentLang][key] ?? COPY.ar[key] ?? key;
    const toEnglishDigits = value => String(value ?? '').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
    const parseFormattedNumber = value => { const n = Number.parseFloat(toEnglishDigits(value).replace(/,/g,'').replace(/\s/g,'')); return Number.isFinite(n) ? n : 0; };
    const formatNumber = (value, maximumFractionDigits=0) => new Intl.NumberFormat(NUMBER_LOCALE,{maximumFractionDigits,minimumFractionDigits:0,useGrouping:true}).format(Number(value)||0);
    const formatCurrency = amount => `${formatNumber(Math.round(amount))} ${currentLang==='ar'?'ر.س':'SAR'}`;
    const formatPercent = value => `${new Intl.NumberFormat(NUMBER_LOCALE,{minimumFractionDigits:2,maximumFractionDigits:2,useGrouping:true}).format(value*100)}%`;

    function formatMoneyInput(input){ if(!input)return; input.value=formatNumber(parseFormattedNumber(input.value)); }
    function formatLoanInputs(){ MONEY_INPUT_IDS.forEach(id=>formatMoneyInput(document.getElementById(id))); }

    function applyLoanLanguage(lang){
        currentLang = lang === 'en' ? 'en' : 'ar';
        document.querySelectorAll('[data-loan-i18n]').forEach(el=>{
            const key=el.dataset.loanI18n;
            if(typeof COPY[currentLang][key]==='string') el.textContent=COPY[currentLang][key];
        });
        document.title = currentLang==='en' ? 'Comprehensive Loan Comparator - tools.oalfawzan.sa' : 'مقارن القروض الشامل - tools.oalfawzan.sa';
        if(option1Data && option2Data){
            populateComparisonTable(option1Data,option2Data);
            populateRiskAssessment(option1Data,option2Data);
            showSchedule(activeSchedule);
        }
    }

    function calculateMRC(principal,annualRate,years){
        const monthlyRate=annualRate/12, numPayments=years*12;
        if(monthlyRate===0) return principal/numPayments;
        return principal*monthlyRate*Math.pow(1+monthlyRate,numPayments)/(Math.pow(1+monthlyRate,numPayments)-1);
    }

    function generateAmortizationTable(principal,annualRate,years,monthlyPayment){
        const monthlyRate=annualRate/12, numPayments=years*12, table=[]; let balance=principal;
        for(let month=1;month<=numPayments;month++){
            const interestPayment=balance*monthlyRate, principalPayment=monthlyPayment-interestPayment;
            balance-=principalPayment;
            table.push({month,payment:monthlyPayment,principal:principalPayment,interest:interestPayment,balance:Math.max(0,balance)});
        }
        return table;
    }

    function assessRisk(debtRatio){
        if(debtRatio>0.65) return {level:'reject',text:t('riskReject')};
        if(debtRatio>0.50) return {level:'high',text:t('riskHigh')};
        if(debtRatio>0.35) return {level:'medium',text:t('riskMedium')};
        return {level:'low',text:t('riskLow')};
    }

    function recommendationFor(level){
        if(level==='reject') return t('recommendationReject');
        if(level==='high') return t('recommendationHigh');
        if(level==='medium') return t('recommendationMedium');
        return t('recommendationLow');
    }

    function calculateComprehensive(){
        const propertyPrice=parseFormattedNumber(document.getElementById('propertyPrice').value);
        const interestRate=parseFormattedNumber(document.getElementById('interestRate').value);
        const loanTerm=Math.trunc(parseFormattedNumber(document.getElementById('loanTerm').value));
        const salary=parseFormattedNumber(document.getElementById('salary').value);
        const salesCommission=parseFormattedNumber(document.getElementById('salesCommission').value);
        const bankFees=parseFormattedNumber(document.getElementById('bankFees').value);
        const taxAmount=parseFormattedNumber(document.getElementById('taxAmount').value);
        const additionalFees=parseFormattedNumber(document.getElementById('additionalFees').value);
        const maritalStatus=document.querySelector('input[name="maritalStatus"]:checked').value;
        if(!propertyPrice||!interestRate||!loanTerm||!salary){ alert(t('requiredFields')); return; }

        const totalDownPayment=propertyPrice*0.10+10000;
        const totalFeesBeforeSupport=salesCommission+bankFees+taxAmount+additionalFees;
        const eskanSupport=maritalStatus==='married'?ESKAN_SUPPORT_AMOUNT:0;
        const amountNeededBeforeSupport=totalDownPayment+totalFeesBeforeSupport;
        const finalAmountNeeded=Math.max(0,amountNeededBeforeSupport-eskanSupport);

        document.getElementById('downPayment').textContent=formatCurrency(totalDownPayment);
        document.getElementById('totalFees').textContent=formatCurrency(totalFeesBeforeSupport);
        document.getElementById('amountNeeded').textContent=formatCurrency(amountNeededBeforeSupport);
        document.getElementById('amountNeededWithSupport').textContent=formatCurrency(finalAmountNeeded);

        const option1LoanAmount=propertyPrice-totalDownPayment;
        const option1MRC=calculateMRC(option1LoanAmount,interestRate/100,loanTerm);
        const option1Total=option1MRC*loanTerm*12;
        option1Data={loanAmount:option1LoanAmount,mrc:option1MRC,totalInterest:option1Total-option1LoanAmount,totalAmount:option1Total,dti:option1MRC/salary,netSalary:salary-option1MRC,eskanSupport,amortization:generateAmortizationTable(option1LoanAmount,interestRate/100,loanTerm,option1MRC)};

        const personalLoanYears=5, personalLoanRate=0.028;
        const personalLoanAmount=Math.min(finalAmountNeeded,(salary/3)*personalLoanYears*12);
        const personalLoanMRC=calculateMRC(personalLoanAmount,personalLoanRate,personalLoanYears);
        const houseLoanAmount=propertyPrice-totalDownPayment;
        const houseMRC=calculateMRC(houseLoanAmount,interestRate/100,loanTerm);
        option2Data={personalLoanAmount,personalMRC:personalLoanMRC,houseLoanAmount,houseMRC,combinedMRC:personalLoanMRC+houseMRC,dti:(personalLoanMRC+houseMRC)/salary,netSalary:salary-(personalLoanMRC+houseMRC),eskanSupport,houseAmortization:generateAmortizationTable(houseLoanAmount,interestRate/100,loanTerm,houseMRC)};

        populateComparisonTable(option1Data,option2Data);
        populateRiskAssessment(option1Data,option2Data);
        document.getElementById('noResults').classList.add('hidden');
        document.getElementById('results').classList.remove('hidden');
        document.getElementById('scheduleSection').classList.remove('hidden');
        showSchedule('option1');
        formatLoanInputs();
    }

    function populateComparisonTable(option1,option2){
        const rows=[
            {key:'loanAmount',val1:option1.loanAmount,val2:option2.houseLoanAmount},
            {key:'monthlyPayment',val1:option1.mrc,val2:option2.houseMRC},
            {key:'totalInterest',val1:option1.totalInterest,val2:option2.houseMRC*20*12-option2.houseLoanAmount},
            {key:'totalAmount',val1:option1.totalAmount,val2:option2.houseMRC*20*12},
            {key:'debtRatio',val1:option1.dti,val2:option2.dti,isPercent:true},
            {key:'eskanSupport',val1:option1.eskanSupport,val2:option2.eskanSupport},
            {key:'netSalary',val1:option1.netSalary,val2:option2.netSalary},
            {key:'personalLoanAmount',val1:0,val2:option2.personalLoanAmount},
            {key:'personalLoanPayment',val1:0,val2:option2.personalMRC},
            {key:'combinedPayment',val1:option1.mrc,val2:option2.combinedMRC}
        ];
        const tbody=document.getElementById('comparisonBody'); tbody.innerHTML='';
        rows.forEach(row=>{
            const diff=row.isPercent?formatPercent(row.val2-row.val1):formatCurrency(row.val2-row.val1);
            const tr=document.createElement('tr');
            tr.innerHTML=`<td><strong>${t(row.key)}</strong></td><td>${row.isPercent?formatPercent(row.val1):formatCurrency(row.val1)}</td><td>${row.isPercent?formatPercent(row.val2):formatCurrency(row.val2)}</td><td>${diff}</td>`;
            tbody.appendChild(tr);
        });
    }

    function populateRiskAssessment(option1,option2){
        const risk1=assessRisk(option1.dti), risk2=assessRisk(option2.dti);
        const badge=(ok)=>`<span class="compliance-badge ${ok?'compliant':'non-compliant'}">${ok?t('compliant'):t('nonCompliant')}</span>`;
        document.getElementById('option1Risk').innerHTML=`<div style="margin-bottom:15px"><strong>${t('option1')}</strong><br>DTI: ${formatPercent(option1.dti)} <span class="risk-indicator risk-${risk1.level}">${risk1.text}</span> ${badge(option1.dti<=0.65)}<br>${t('netSalaryPrefix')}: ${formatCurrency(option1.netSalary)}</div>`;
        document.getElementById('option2Risk').innerHTML=`<div style="margin-bottom:15px"><strong>${t('option2')}</strong><br>${t('dtiFiveYears')}: ${formatPercent(option2.dti)} <span class="risk-indicator risk-${risk2.level}">${risk2.text}</span> ${badge(option2.dti<=0.65)}<br>${t('netSalaryPrefix')}: ${formatCurrency(option2.netSalary)}</div>`;
        const worst=['low','medium','high','reject'][Math.max(['low','medium','high','reject'].indexOf(risk1.level),['low','medium','high','reject'].indexOf(risk2.level))];
        document.getElementById('recommendationText').textContent=recommendationFor(worst);
    }

    function showSchedule(option){
        activeSchedule=option;
        document.querySelectorAll('#scheduleTabs button').forEach((btn,index)=>btn.classList.toggle('active',(option==='option1'&&index===0)||(option==='option2'&&index===1)));
        const data=option==='option1'?option1Data:option2Data;
        if(!data) return;
        const table=option==='option1'?data.amortization:data.houseAmortization;
        const tbody=document.getElementById('scheduleBody'); tbody.innerHTML='';
        const shown=Math.min(60,table.length);
        for(let i=0;i<shown;i++){
            const row=table[i], tr=document.createElement('tr');
            tr.innerHTML=`<td>${formatNumber(row.month)}</td><td>${formatCurrency(row.payment)}</td><td>${formatCurrency(row.principal)}</td><td>${formatCurrency(row.interest)}</td><td>${formatCurrency(row.balance)}</td>`;
            tbody.appendChild(tr);
        }
        if(table.length>shown){
            const tr=document.createElement('tr');
            tr.innerHTML=`<td colspan="5" style="text-align:center;color:var(--text-muted);padding:15px">${COPY[currentLang].showingMonths(formatNumber(shown),formatNumber(table.length))}</td>`;
            tbody.appendChild(tr);
        }
        updateScheduleSummary(option);
        document.getElementById('riskAssessment').classList.remove('hidden');
        document.getElementById('recommendations').classList.remove('hidden');
    }

    function updateScheduleSummary(option){
        const data=option==='option1'?option1Data:option2Data;
        const loanAmount=data.loanAmount||data.houseLoanAmount, monthly=data.mrc||data.houseMRC, totalPaid=monthly*20*12;
        document.getElementById('scheduleSummary').innerHTML=`
            <div class="summary-card"><div class="value">${formatCurrency(loanAmount)}</div><div class="label">${t('loanAmount')}</div></div>
            <div class="summary-card"><div class="value">${formatCurrency(monthly)}</div><div class="label">${t('monthlyPayment')}</div></div>
            <div class="summary-card"><div class="value">${formatCurrency(totalPaid)}</div><div class="label">${t('totalPayments')}</div></div>
            <div class="summary-card"><div class="value">${formatNumber(240)}</div><div class="label">${t('monthsCount')}</div></div>`;
    }

    function clearForm(){
        const defaults={propertyPrice:'1450000',interestRate:'3.89',loanTerm:'20',salary:'30000',salesCommission:'36250',bankFees:'8000',taxAmount:'211750',additionalFees:'0'};
        Object.entries(defaults).forEach(([id,value])=>document.getElementById(id).value=value);
        document.getElementById('single').checked=true;
        document.getElementById('noResults').classList.remove('hidden');
        document.getElementById('results').classList.add('hidden');
        document.getElementById('scheduleSection').classList.add('hidden');
        option1Data=null; option2Data=null; formatLoanInputs();
    }

    window.calculateComprehensive=calculateComprehensive;
    window.showSchedule=showSchedule;
    window.clearForm=clearForm;

    window.addEventListener('tools:languagechange',event=>applyLoanLanguage(event.detail?.lang));

    document.addEventListener('DOMContentLoaded',()=>{
        MONEY_INPUT_IDS.forEach(id=>{
            const input=document.getElementById(id); if(!input)return;
            input.type='text'; input.inputMode='decimal'; input.dir='ltr'; input.autocomplete='off';
            input.addEventListener('focus',function(){this.value=toEnglishDigits(this.value).replace(/,/g,'');});
            input.addEventListener('blur',function(){formatMoneyInput(this);});
        });
        ['interestRate','loanTerm'].forEach(id=>{const input=document.getElementById(id);if(input)input.dir='ltr';});
        document.getElementById('propertyPrice').addEventListener('input',function(){
            const price=parseFormattedNumber(this.value), tax=document.getElementById('taxAmount');
            tax.value=price>1000000?formatNumber(Math.round((price-1000000)*0.146)):'0';
        });
        applyLoanLanguage(document.documentElement.lang);
        formatLoanInputs();
    });
})();