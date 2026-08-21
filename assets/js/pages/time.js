
const STRINGS={
  ar:{lang:'ar',dir:'rtl',title:'عدة الوقت والتقويم — tools.oalfawzan.sa',meta:'تحويل الوقت بين المناطق الزمنية، حساب الفترات بين الأوقات، وجمع الساعات بسرعة.',tag:'// أداة وقت',heading:'عدة الوقت والتقويم',desc:'حوّل الوقت بين المدن، احسب فرق الوقت بين ساعتين، وأضف ساعات إلى أي وقت بسرعة.',tzHeading:'تحويل الوقت بين المناطق',date:'التاريخ',time:'الوقت',from:'من منطقة',to:'إلى منطقة',convertTime:'تحويل الوقت',daysHeading:'حاسبة الأيام',start:'من تاريخ',end:'إلى تاريخ',calcDays:'احسب الفرق',durationHeading:'المدة بين وقتين',durationStart:'من وقت',durationEnd:'إلى وقت',calcDuration:'احسب المدة',addHoursHeading:'إضافة ساعات إلى وقت',baseTime:'الوقت الحالي',hoursToAdd:'عدد الساعات',calcAddHours:'احسب الوقت الجديد',h2gHeading:'تحويل هجري → ميلادي',hy:'سنة هجرية',hm:'شهر هجري',hd:'يوم هجري',h2g:'حوّل لميلادي',g2hHeading:'تحويل ميلادي → هجري',gDate:'التاريخ الميلادي',g2h:'حوّل لهجري',back:'← الرجوع لكل الأدوات',builtBy:'من تطوير',langBtn:'EN',themeDark:'🌙',themeLight:'☀️',badInput:'تحقق من المدخلات أولًا.',emptyResult:'النتيجة ستظهر هنا بعد تنفيذ العملية.',datePlaceholder:'اختر تاريخًا',timePlaceholder:'اختر وقتًا',daysResult:'الفرق: {days} يوم (حوالي {weeks} أسبوع و {rest} يوم).',durationResult:'الفرق بين {start} و {end}: {hours} ساعة و {minutes} دقيقة.',addHoursResult:'بعد {hours} ساعة من {start} سيكون الوقت: {time}.',tzResult:'{date} — الوقت في {to}: {time}',h2gResult:'التاريخ الميلادي: {date}',g2hResult:'التاريخ الهجري: {date}'},
  en:{lang:'en',dir:'ltr',title:'Time Toolkit — tools.oalfawzan.sa',meta:'Convert time zones, calculate time durations, and quickly add hours to any time.',tag:'// TIME TOOL',heading:'Time Toolkit',desc:'Convert time between cities, calculate durations between times, and add hours instantly.',tzHeading:'Time Zone Converter',date:'Date',time:'Time',from:'From Zone',to:'To Zone',convertTime:'Convert Time',daysHeading:'Days Calculator',start:'Start Date',end:'End Date',calcDays:'Calculate',durationHeading:'Duration Between Two Times',durationStart:'Start Time',durationEnd:'End Time',calcDuration:'Calculate Duration',addHoursHeading:'Add Hours to Time',baseTime:'Current Time',hoursToAdd:'Hours to Add',calcAddHours:'Calculate New Time',h2gHeading:'Hijri → Gregorian',hy:'Hijri Year',hm:'Hijri Month',hd:'Hijri Day',h2g:'Convert to Gregorian',g2hHeading:'Gregorian → Hijri',gDate:'Gregorian Date',g2h:'Convert to Hijri',back:'← Back to all tools',builtBy:'Built by',langBtn:'عربي',themeDark:'🌙',themeLight:'☀️',badInput:'Please check your inputs first.',emptyResult:'Your result will appear here after calculation.',datePlaceholder:'Select a date',timePlaceholder:'Select a time',daysResult:'Difference: {days} days (about {weeks} weeks and {rest} days).',durationResult:'Difference between {start} and {end}: {hours}h {minutes}m.',addHoursResult:'After {hours} hour(s) from {start}, the time will be: {time}.',tzResult:'{date} — time in {to}: {time}',h2gResult:'Gregorian date: {date}',g2hResult:'Hijri date: {date}'}
};

const ZONES=[
  {value:'Asia/Riyadh',ar:'الرياض',en:'Riyadh'},
  {value:'Asia/Dubai',ar:'دبي',en:'Dubai'},
  {value:'Asia/Qatar',ar:'الدوحة',en:'Doha'},
  {value:'Asia/Kuwait',ar:'الكويت',en:'Kuwait'},
  {value:'Asia/Bahrain',ar:'البحرين',en:'Bahrain'},
  {value:'Africa/Cairo',ar:'القاهرة',en:'Cairo'},
  {value:'Europe/London',ar:'لندن',en:'London'},
  {value:'Europe/Paris',ar:'باريس',en:'Paris'},
  {value:'America/New_York',ar:'نيويورك',en:'New York'},
  {value:'America/Los_Angeles',ar:'لوس أنجلوس',en:'Los Angeles'},
  {value:'Asia/Tokyo',ar:'طوكيو',en:'Tokyo'},
  {value:'UTC',ar:'التوقيت العالمي UTC',en:'UTC'}
];

let currentLang=localStorage.getItem('tools_lang')||'ar';
let currentTheme=localStorage.getItem('tools_theme')||'dark';
const tzDate=document.getElementById('tzDate');
const tzTime=document.getElementById('tzTime');
const fromZone=document.getElementById('fromZone');
const toZone=document.getElementById('toZone');

function populateZones(){
  const opts=ZONES.map((z)=>{
    const city=currentLang==='ar'?z.ar:z.en;
    return `<option value="${z.value}">${city} — \u2066${z.value}\u2069</option>`;
  }).join('');
  const fromValue=fromZone.value||'Asia/Riyadh';
  const toValue=toZone.value||'UTC';
  fromZone.innerHTML=opts;toZone.innerHTML=opts;
  fromZone.value=fromValue;toZone.value=toValue;
}

function formatInZone(ms,tz,lang){
  return new Intl.DateTimeFormat(lang==='ar'?'ar-SA':'en-GB',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(ms));
}
function zoneOffsetMinutes(ms,tz){
  const p=new Intl.DateTimeFormat('en-GB',{timeZone:tz,hour12:false,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'}).formatToParts(new Date(ms));
  const g=t=>+p.find(x=>x.type===t).value;
  const asUTC=Date.UTC(g('year'),g('month')-1,g('day'),g('hour'),g('minute'),g('second'));
  return (asUTC-ms)/60000;
}
function zonedToUtcMs(dateStr,timeStr,tz){
  const [y,m,d]=dateStr.split('-').map(Number);
  const [hh,mm]=timeStr.split(':').map(Number);
  let ms=Date.UTC(y,m-1,d,hh,mm,0);
  for(let i=0;i<4;i++){ms=Date.UTC(y,m-1,d,hh,mm,0)-zoneOffsetMinutes(ms,tz)*60000}
  return ms;
}

function formatDateForDisplay(value){
  if(!value) return STRINGS[currentLang].datePlaceholder;
  const locale=currentLang==='ar'?'ar-SA':'en-GB';
  const dt=new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat(locale,{day:'numeric',month:'long',year:'numeric'}).format(dt);
}

function formatTimeForDisplay(value){
  if(!value) return STRINGS[currentLang].timePlaceholder;
  const [h,m]=value.split(':').map(Number);
  const dt=new Date(Date.UTC(2000,0,1,h,m));
  const locale=currentLang==='ar'?'ar-SA':'en-GB';
  return new Intl.DateTimeFormat(locale,{hour:'2-digit',minute:'2-digit',hour12:currentLang==='ar'}).format(dt);
}

function refreshPickerDisplay(input){
  const display=document.querySelector(`.picker-value[data-for="${input.id}"]`);
  if(!display) return;
  const isDate=input.type==='date';
  const text=isDate?formatDateForDisplay(input.value):formatTimeForDisplay(input.value);
  display.textContent=text;
  display.classList.toggle('is-placeholder',!input.value);
}

function refreshAllPickerDisplays(){
  document.querySelectorAll('.picker-field input').forEach(refreshPickerDisplay);
}

function setResult(id,msg,isError=false){
  const el=document.getElementById(id);
  el.classList.toggle('error',isError);
  el.dataset.empty=msg? 'false':'true';
  el.textContent=msg;
}

function convertTime(){
  if(!tzDate.value||!tzTime.value){setResult('tzResult',STRINGS[currentLang].badInput,true);return;}
  try{
    const utcMs=zonedToUtcMs(tzDate.value,tzTime.value,fromZone.value);
    const target=formatInZone(utcMs,toZone.value,currentLang);
    const zoneName=toZone.options[toZone.selectedIndex]?.textContent||toZone.value;
    setResult('tzResult',STRINGS[currentLang].tzResult.replace('{date}',`${tzDate.value} ${tzTime.value}`).replace('{to}',zoneName).replace('{time}',target));
  }catch(e){setResult('tzResult',STRINGS[currentLang].badInput,true)}
}

function calcDays(){
  const a=document.getElementById('startDate').value;
  const b=document.getElementById('endDate').value;
  if(!a||!b){setResult('daysResult',STRINGS[currentLang].badInput,true);return;}
  const d1=new Date(`${a}T00:00:00Z`);
  const d2=new Date(`${b}T00:00:00Z`);
  const days=Math.abs(Math.round((d2-d1)/86400000));
  const weeks=Math.floor(days/7);
  setResult('daysResult',STRINGS[currentLang].daysResult.replace('{days}',days).replace('{weeks}',weeks).replace('{rest}',days%7));
}

function parseMinutes(timeValue){
  const [hours,minutes]=timeValue.split(':').map(Number);
  return hours*60+minutes;
}

function formatMinutes(totalMinutes){
  const wrapped=((totalMinutes%1440)+1440)%1440;
  const hours=Math.floor(wrapped/60);
  const minutes=wrapped%60;
  return `${pad(hours)}:${pad(minutes)}`;
}

function calcDuration(){
  const start=document.getElementById('durationStart').value;
  const end=document.getElementById('durationEnd').value;
  if(!start||!end){setResult('durationResult',STRINGS[currentLang].badInput,true);return;}
  let diff=parseMinutes(end)-parseMinutes(start);
  if(diff<0){diff+=1440;}
  const hours=Math.floor(diff/60);
  const minutes=diff%60;
  setResult('durationResult',STRINGS[currentLang].durationResult.replace('{start}',start).replace('{end}',end).replace('{hours}',hours).replace('{minutes}',minutes));
}

function calcAddedHours(){
  const start=document.getElementById('baseTime').value;
  const hoursToAdd=Number(document.getElementById('hoursToAdd').value);
  if(!start||!Number.isFinite(hoursToAdd)){setResult('addHoursResult',STRINGS[currentLang].badInput,true);return;}
  const resultTime=formatMinutes(parseMinutes(start)+hoursToAdd*60);
  setResult('addHoursResult',STRINGS[currentLang].addHoursResult.replace('{hours}',hoursToAdd).replace('{start}',start).replace('{time}',resultTime));
}

function islamicToJD(y,m,d){return d+Math.ceil(29.5*(m-1))+(y-1)*354+Math.floor((3+11*y)/30)+1948439.5-1}
function jdToGregorian(jd){const z=Math.floor(jd+0.5);let a=z;const alpha=Math.floor((a-1867216.25)/36524.25);a+=1+alpha-Math.floor(alpha/4);const b=a+1524;const c=Math.floor((b-122.1)/365.25);const d=Math.floor(365.25*c);const e=Math.floor((b-d)/30.6001);return {day:b-d-Math.floor(30.6001*e),month:e<14?e-1:e-13,year:(e<14?e-1:e-13)>2?c-4716:c-4715}}
function gregorianToJD(y,m,d){const a=Math.floor((14-m)/12);const y2=y+4800-a;const m2=m+12*a-3;return d+Math.floor((153*m2+2)/5)+365*y2+Math.floor(y2/4)-Math.floor(y2/100)+Math.floor(y2/400)-32045}
function jdToIslamic(jd){jd=Math.floor(jd)+0.5;const year=Math.floor((30*(jd-1948439.5)+10646)/10631);const month=Math.min(12,Math.ceil((jd-(29+islamicToJD(year,1,1)))/29.5)+1);return {year,month,day:Math.floor(jd-islamicToJD(year,month,1)+1)}}
function pad(n){return String(n).padStart(2,'0')}

function convertH2G(){
  const y=+document.getElementById('hYear').value,m=+document.getElementById('hMonth').value,d=+document.getElementById('hDay').value;
  if(!y||m<1||m>12||d<1||d>30){setResult('h2gResult',STRINGS[currentLang].badInput,true);return;}
  const g=jdToGregorian(islamicToJD(y,m,d));
  setResult('h2gResult',STRINGS[currentLang].h2gResult.replace('{date}',`${g.year}-${pad(g.month)}-${pad(g.day)}`));
}
function convertG2H(){
  const gd=document.getElementById('gDate').value;
  if(!gd){setResult('g2hResult',STRINGS[currentLang].badInput,true);return;}
  const [y,m,d]=gd.split('-').map(Number);
  const h=jdToIslamic(gregorianToJD(y,m,d)-0.5);
  setResult('g2hResult',STRINGS[currentLang].g2hResult.replace('{date}',`${h.year}-${pad(h.month)}-${pad(h.day)}`));
}

function applyLang(lang){
  const s=STRINGS[lang]||STRINGS.ar;currentLang=lang;
  document.documentElement.lang=s.lang;document.documentElement.dir=s.dir;document.title=s.title;
  document.querySelector('meta[name="description"]').setAttribute('content',s.meta);
  document.getElementById('tag').textContent=s.tag;document.getElementById('title').textContent=s.heading;document.getElementById('desc').textContent=s.desc;
  document.getElementById('tzHeading').textContent=s.tzHeading;document.getElementById('dateLabel').textContent=s.date;document.getElementById('timeLabel').textContent=s.time;
  document.getElementById('fromLabel').textContent=s.from;document.getElementById('toLabel').textContent=s.to;document.getElementById('convertTimeBtn').textContent=s.convertTime;
  document.getElementById('daysHeading').textContent=s.daysHeading;document.getElementById('startLabel').textContent=s.start;document.getElementById('endLabel').textContent=s.end;document.getElementById('calcDaysBtn').textContent=s.calcDays;document.getElementById('durationHeading').textContent=s.durationHeading;document.getElementById('durationStartLabel').textContent=s.durationStart;document.getElementById('durationEndLabel').textContent=s.durationEnd;document.getElementById('durationBtn').textContent=s.calcDuration;document.getElementById('addHoursHeading').textContent=s.addHoursHeading;document.getElementById('baseTimeLabel').textContent=s.baseTime;document.getElementById('hoursToAddLabel').textContent=s.hoursToAdd;document.getElementById('addHoursBtn').textContent=s.calcAddHours;
  document.getElementById('h2gHeading').textContent=s.h2gHeading;document.getElementById('hyLabel').textContent=s.hy;document.getElementById('hmLabel').textContent=s.hm;document.getElementById('hdLabel').textContent=s.hd;document.getElementById('h2gBtn').textContent=s.h2g;
  document.getElementById('g2hHeading').textContent=s.g2hHeading;document.getElementById('gDateLabel').textContent=s.gDate;document.getElementById('g2hBtn').textContent=s.g2h;
  document.getElementById('backLink').textContent=s.back;document.getElementById('builtBy').textContent=s.builtBy;
  document.getElementById('langBtn').textContent=s.langBtn;document.getElementById('themeBtn').textContent=(currentTheme==='light'?s.themeDark:s.themeLight);
  populateZones();
  initResultPlaceholders();
  refreshAllPickerDisplays();
  localStorage.setItem('tools_lang',lang);
}
function applyTheme(theme){currentTheme=theme==='light'?'light':'dark';document.documentElement.setAttribute('data-theme',currentTheme);localStorage.setItem('tools_theme',currentTheme);document.getElementById('themeBtn').textContent=(currentTheme==='light'?STRINGS[currentLang].themeDark:STRINGS[currentLang].themeLight)}

function initResultPlaceholders(){
  const placeholder=STRINGS[currentLang].emptyResult;
  document.querySelectorAll('.result').forEach((el)=>{
    if(!el.textContent.trim()){
      el.textContent=placeholder;
      el.dataset.empty='true';
    }
  });
}

document.querySelectorAll('.picker-field input').forEach((input)=>{
  input.addEventListener('input',()=>refreshPickerDisplay(input));
  input.addEventListener('change',()=>refreshPickerDisplay(input));
});

document.getElementById('convertTimeBtn').addEventListener('click',convertTime);
document.getElementById('calcDaysBtn').addEventListener('click',calcDays);
document.getElementById('durationBtn').addEventListener('click',calcDuration);
document.getElementById('addHoursBtn').addEventListener('click',calcAddedHours);
document.getElementById('h2gBtn').addEventListener('click',convertH2G);
document.getElementById('g2hBtn').addEventListener('click',convertG2H);
document.getElementById('langBtn').addEventListener('click',()=>applyLang(currentLang==='ar'?'en':'ar'));
document.getElementById('themeBtn').addEventListener('click',()=>applyTheme(currentTheme==='dark'?'light':'dark'));

const today=new Date().toISOString().slice(0,10);
tzDate.value=today;document.getElementById('gDate').value=today;
applyTheme(currentTheme);
applyLang(currentLang);
refreshAllPickerDisplays();
