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
 ar:`أنت مستشار تمويل شخصي وعقاري مستقل وخبير في السوق السعودي. المطلوب قرار مالي مختصر وسهل القراءة على شاشة الجوال. لا تكتب مقالاً، لا تكرر البيانات، لا تستخدم Markdown، ولا تخلط العربية بالإنجليزية إلا DTI عند الحاجة.

حلّل خيارين: (1) دفع المبلغ المطلوب نقداً + تمويل عقاري فقط، و(2) قرض شخصي لتغطية المبلغ المطلوب + التمويل العقاري. أعطِ الأولوية للسيولة، DTI، المتبقي من الراتب، ضغط أول 5 سنوات، وإجمالي تكلفة الاقتراض. لا تخترع مصاريف أو مدخرات أو أنظمة أو حدوداً تنظيمية. إذا كانت معلومة حاسمة غير موجودة فاذكرها في السؤال الأخير فقط.

يجب أن يكون الرد بهذا الشكل حرفياً وبنفس العناوين، وبحد أقصى 120 كلمة:

الحكم: [🟢 مريح | 🟡 مقبول بحذر | 🟠 مرتفع المخاطر | 🔴 غير مناسب]

الخيار الأفضل: [الدفع النقدي | القرض الشخصي]
[سبب واحد مباشر في سطر واحد]

الأرقام المهمة:
• القسط الشهري: ⃁ X
• نسبة DTI: X%
• المتبقي من الراتب: ⃁ X
• النقد المطلوب الآن: ⃁ X

لماذا؟
• [سبب قصير جداً]
• [سبب قصير جداً]
• [سبب قصير جداً عند الحاجة فقط]

التوصية:
[جملة واحدة عملية ومباشرة]

قبل القرار:
[سؤال واحد فقط عن أهم معلومة ناقصة]

قواعد صارمة: استخدم الأرقام الفعلية من البيانات. لا تعرض الحسابات خطوة بخطوة. لا تكرر نفس الرقم في أكثر من قسم إلا إذا كان ضرورياً. لا تستخدم ** أو # أو جداول أو فقرات طويلة. اجعل كل نقطة سطراً مستقلاً. استخدم رمز الريال ⃁ فقط.`,
 en:`You are an independent personal-finance and mortgage advisor familiar with the Saudi market. Produce a short decision card that is effortless to scan on a mobile screen. Do not write an essay, repeat the dataset, use Markdown formatting, or add unnecessary explanations.

Compare: (1) paying the required upfront amount in cash plus mortgage only, and (2) using a personal loan for the required upfront amount plus the mortgage. Prioritize liquidity, DTI, salary remaining after debt, the first-five-year burden, and borrowing cost. Never invent expenses, savings, regulations, or regulatory thresholds. Put the single most important missing fact only in the final question.

Your response MUST follow exactly this structure and stay under 120 words:

Verdict: [🟢 Comfortable | 🟡 Acceptable with caution | 🟠 High risk | 🔴 Not advisable]

Best option: [Cash payment | Personal loan]
[One-line reason]

Key numbers:
• Monthly payment: ⃁ X
• DTI: X%
• Salary remaining: ⃁ X
• Cash needed now: ⃁ X

Why:
• [very short reason]
• [very short reason]
• [third reason only if necessary]

Recommendation:
[one practical, direct sentence]

Before deciding:
[one question only about the most important missing information]

Strict rules: use exact figures from the supplied data; do not show calculations; avoid repeating figures across sections unless essential; no **, #, tables, or long paragraphs; one point per line; use only the ⃁ symbol for SAR.`
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
function clean(text){
 return String(text||'').replace(/\*\*/g,'').replace(/^#{1,6}\s*/gm,'').replace(/```[\s\S]*?```/g,'').replace(/\n{3,}/g,'\n\n').trim();
}
async function recommend(){
 const box=$('loanAiText'); if(!box)return; const l=lang(); box.textContent=copy[l].loading; $('loanAiCard')?.classList.remove('hidden');
 const payload=calc();
 const prompt=`${PROMPTS[l]}\n\nCALCULATOR DATA (treat these as user-provided/calculated estimates):\n${JSON.stringify(payload,null,2)}`;
 try{const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt})});if(!r.ok)throw new Error(String(r.status));const d=await r.json();box.textContent=clean(d?.text)||copy[l].error;}catch(e){box.textContent=copy[l].error;}
 const title=$('loanAiTitle'),note=$('loanAiNote');if(title)title.textContent=copy[l].title;if(note)note.textContent=copy[l].note;
}
function sync(){const l=lang();if($('loanAiTitle'))$('loanAiTitle').textContent=copy[l].title;if($('loanAiNote'))$('loanAiNote').textContent=copy[l].note;}
document.addEventListener('DOMContentLoaded',()=>{sync();const btn=document.querySelector('[onclick="calculateComprehensive()"]');if(btn)btn.addEventListener('click',()=>setTimeout(()=>{if(!$('results')?.classList.contains('hidden'))recommend();},0));window.addEventListener('tools:languagechange',()=>setTimeout(sync,0));});
})();