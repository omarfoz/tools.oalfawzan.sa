(() => {
'use strict';
const ENDPOINT='https://tools.niug502.workers.dev';
const $=id=>document.getElementById(id);
const num=id=>Number(String($(id)?.value||'0').replace(/,/g,''))||0;
const money=n=>`⃁ ${Math.round(n).toLocaleString('en-US')}`;
const lang=()=>document.documentElement.lang==='en'?'en':'ar';
const copy={
 ar:{title:'توصية الذكاء الاصطناعي',loading:'جاري تحليل قدرتك المالية والخيارات…',error:'تعذر الحصول على توصية الذكاء الاصطناعي حالياً. يمكنك الاعتماد على المقارنة وتقييم المخاطر أعلاه.',note:'تحليل إرشادي مبني على الأرقام المدخلة، وليس نصيحة مالية أو موافقة ائتمانية.'},
 en:{title:'AI Recommendation',loading:'Analyzing affordability, risk, and financing options…',error:'AI recommendation is currently unavailable. You can still use the comparison and risk assessment above.',note:'Guidance based on the figures entered; not financial advice or credit approval.'}
};
const PROMPTS={
 ar:`أنت مستشار تمويل شخصي وعقاري خبير في السوق السعودي. حلّل بيانات المستخدم كمستشار مستقل هدفه حماية السيولة وتقليل المخاطر والتكلفة، وليس تشجيعه على الاقتراض. قارن بوضوح بين خيار الدفعة النقدية وخيار استخدام قرض شخصي مع التمويل العقاري. ركّز على: نسبة الالتزامات إلى الدخل DTI، القسط الشهري، صافي الراتب المتبقي بعد الأقساط، إجمالي تكلفة التمويل والفوائد، ضغط أول خمس سنوات عند تداخل القرض الشخصي والعقاري، حجم الدفعة الأولى والرسوم، وأثر دعم إسكان إن وُجد. قيّم هامش الأمان المالي: هل المتبقي الشهري معقول لمصاريف المعيشة والطوارئ؟ لا تفترض مصاريف أو مدخرات غير موجودة في البيانات، واذكر بوضوح عندما تحتاج معلومة إضافية. لا تعتبر الحد التنظيمي هدفاً آمناً؛ فرّق بين "ممكن نظامياً" و"مريح مالياً". اكتشف أي أرقام أو افتراضات تبدو غير منطقية ونبّه لها. اقترح تحسينات عملية مثل زيادة الدفعة، تخفيض سعر العقار، تقليل مبلغ القرض الشخصي، تقصير/تعديل المدة أو الاحتفاظ باحتياطي نقدي، لكن فقط عندما تدعمها الأرقام. ابدأ بحكم واضح من سطر واحد: مريح / مقبول بحذر / مرتفع المخاطر / غير مناسب. ثم اشرح في 4–6 جمل قصيرة أهم الأسباب بالأرقام. اختم بتوصية صريحة بالخيار الأفضل ولماذا، ثم اذكر أهم سؤال واحد يجب على المستخدم الإجابة عنه قبل اتخاذ القرار. استخدم رمز الريال السعودي ⃁، واكتب بالعربية الطبيعية الواضحة. لا تخترع أنظمة أو نسباً تنظيمية غير موجودة في البيانات ولا تدّعي ضمان موافقة البنك.`,
 en:`You are an independent personal-finance and mortgage advisor with strong knowledge of the Saudi market. Analyze the user's figures with one goal: protect liquidity, reduce risk, and minimize unnecessary financing cost—not encourage borrowing. Clearly compare the cash-down-payment option with the personal-loan-plus-mortgage option. Focus on debt-to-income (DTI), monthly installments, salary remaining after debt service, total financing/interest cost, the first-five-year payment burden while personal and mortgage loans overlap, upfront cash and fees, and Eskan support when applicable. Assess the financial safety margin: is the remaining monthly income reasonably resilient for living costs and emergencies? Never invent expenses, savings, regulations, or eligibility criteria; explicitly flag missing information that could change the decision. Do not treat a regulatory maximum as a comfortable target; distinguish between potentially permissible and financially comfortable. Detect suspicious or inconsistent inputs and call them out. Suggest practical improvements—larger down payment, lower property price, smaller personal loan, different term, or preserving an emergency reserve—only when supported by the numbers. Start with a one-line verdict: Comfortable / Acceptable with caution / High risk / Not advisable. Then give 4–6 concise sentences explaining the decisive factors with exact figures. End with a clear recommendation on which option is financially stronger and why, followed by the single most important question the user should answer before committing. Use the Saudi Riyal symbol ⃁. Do not claim bank approval or invent Saudi regulatory thresholds not supplied in the data.`
};
function calc(){
 const property=num('propertyPrice'),rate=num('interestRate'),years=num('loanTerm'),salary=num('salary');
 const commission=num('salesCommission'),bank=num('bankFees'),tax=num('taxAmount'),other=num('additionalFees');
 const married=document.querySelector('input[name="maritalStatus"]:checked')?.value==='married';
 const support=married?111750:0,down=property*.10+10000,fees=commission+bank+tax+other,needed=Math.max(0,down+fees-support);
 const payment=(p,r,y)=>{const m=r/12,n=y*12;return !p?0:(!m?p/n:p*m*Math.pow(1+m,n)/(Math.pow(1+m,n)-1));};
 const mortgage=property-down,mortgagePmt=payment(mortgage,rate/100,years);
 const personal=Math.min(needed,(salary/3)*60),personalPmt=payment(personal,.028,5),combined=mortgagePmt+personalPmt;
 const mortgageTotal=mortgagePmt*years*12,personalTotal=personalPmt*60;
 return {propertyPrice:money(property),annualRate:`${rate}%`,termYears:years,monthlySalary:money(salary),maritalStatus:married?'married':'single',upfrontDownPayment:money(down),additionalFees:money(fees),eskanSupport:money(support),cashNeededAfterSupport:money(needed),cashOption:{mortgageAmount:money(mortgage),monthlyMortgage:money(mortgagePmt),dti:`${salary?(mortgagePmt/salary*100).toFixed(1):0}%`,salaryAfterDebt:money(salary-mortgagePmt),estimatedMortgageInterest:money(mortgageTotal-mortgage)},personalLoanOption:{personalLoanAmount:money(personal),personalLoanPayment:money(personalPmt),mortgagePayment:money(mortgagePmt),combinedFirstFiveYears:money(combined),dtiFirstFiveYears:`${salary?(combined/salary*100).toFixed(1):0}%`,salaryAfterDebtFirstFiveYears:money(salary-combined),estimatedPersonalLoanCost:money(personalTotal-personal)}};
}
async function recommend(){
 const box=$('loanAiText'); if(!box)return; const l=lang(); box.textContent=copy[l].loading; $('loanAiCard')?.classList.remove('hidden');
 const payload=calc();
 const prompt=`${PROMPTS[l]}\n\nCALCULATOR DATA (treat these as user-provided/calculated estimates):\n${JSON.stringify(payload,null,2)}`;
 try{const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt})});if(!r.ok)throw new Error(String(r.status));const d=await r.json();box.textContent=d?.text||copy[l].error;}catch(e){box.textContent=copy[l].error;}
 const title=$('loanAiTitle'),note=$('loanAiNote');if(title)title.textContent=copy[l].title;if(note)note.textContent=copy[l].note;
}
function sync(){const l=lang();if($('loanAiTitle'))$('loanAiTitle').textContent=copy[l].title;if($('loanAiNote'))$('loanAiNote').textContent=copy[l].note;}
document.addEventListener('DOMContentLoaded',()=>{sync();const btn=document.querySelector('[onclick="calculateComprehensive()"]');if(btn)btn.addEventListener('click',()=>setTimeout(()=>{if(!$('results')?.classList.contains('hidden'))recommend();},0));window.addEventListener('tools:languagechange',()=>setTimeout(sync,0));});
})();