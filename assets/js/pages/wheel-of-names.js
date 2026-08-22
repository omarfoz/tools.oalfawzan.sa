const STRINGS={
  ar:{lang:'ar',dir:'rtl',title:'Wheel of Names — tools.oalfawzan.sa',descMeta:'عجلة أسماء بسيطة لاختيار اسم عشوائي بسرعة.',tag:'// أداة',heading:'Wheel of Names',desc:'أدخل الأسماء (كل اسم في سطر) ثم لف العجلة لاختيار اسم عشوائي.',label:'الأسماء',placeholder:'أحمد\nسارة\nليلى',spin:'لف العجلة',reset:'إعادة تعيين',back:'← الرجوع لكل الأدوات',builtBy:'من تطوير',langBtn:'EN',themeLabel:'تبديل المظهر',winner:'الاسم المختار: ',empty:'أدخل اسمًا واحدًا على الأقل قبل لف العجلة.'},
  en:{lang:'en',dir:'ltr',title:'Wheel of Names — tools.oalfawzan.sa',descMeta:'Simple random name picker wheel.',tag:'// TOOL',heading:'Wheel of Names',desc:'Add names (one per line), spin the wheel, and get a random winner.',label:'Names',placeholder:'Alex\nSara\nLina',spin:'Spin',reset:'Reset',back:'← Back to all tools',builtBy:'Built by',langBtn:'عربي',themeLabel:'Toggle theme',winner:'Selected name: ',empty:'Add at least one name before spinning.'}
};
const canvas=document.getElementById('wheelCanvas');
const ctx=canvas.getContext('2d');
const namesInput=document.getElementById('namesInput');
const resultText=document.getElementById('resultText');
const spinBtn=document.getElementById('spinBtn');
let rotation=0, spinning=false, currentLang=window.ToolsPlatform?.getLanguage('ar')||'ar', currentTheme=window.ToolsPlatform?.getTheme()||'dark';
const colors=['#007AFF','#00c896','#7f5af0','#ff8a00','#1f9d9d','#d95f5f','#5aa9ff','#9f86ff'];

function getNames(){return namesInput.value.split('\n').map(v=>v.trim()).filter(Boolean).slice(0,20)}
function drawWheel(){
  const names=getNames();
  const list=names.length?names:[''];
  const n=list.length; const cx=230, cy=230, r=210;
  ctx.clearRect(0,0,460,460);
  ctx.save();ctx.translate(cx,cy);ctx.rotate(rotation);
  for(let i=0;i<n;i++){
    const a1=(i/n)*Math.PI*2;const a2=((i+1)/n)*Math.PI*2;
    ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r,a1,a2);ctx.closePath();
    ctx.fillStyle=colors[i%colors.length];ctx.fill();
    ctx.save();ctx.rotate((a1+a2)/2);ctx.textAlign='right';ctx.fillStyle='#fff';ctx.font='600 16px sans-serif';
    ctx.fillText(list[i],r-18,6,130);ctx.restore();
  }
  ctx.beginPath();ctx.arc(0,0,40,0,Math.PI*2);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--wheel-center').trim()||'#111118';ctx.fill();
  ctx.restore();
}

function pickWinner(){
  const names=getNames();
  if(names.length<1){resultText.classList.add('error');resultText.textContent=STRINGS[currentLang].empty;namesInput.focus();return}
  if(spinning) return;
  spinning=true;resultText.classList.remove('error');resultText.textContent='';
  window.ToolsPlatform?.setBusy(spinBtn,true);
  const extra=(Math.random()*Math.PI*2)+(Math.PI*10);
  const start=rotation;const end=rotation+extra;
  const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const duration=reduceMotion?120:3600;const t0=performance.now();
  function animate(t){
    const p=Math.min((t-t0)/duration,1); const ease=1-Math.pow(1-p,4);
    rotation=start+(end-start)*ease; drawWheel();
    if(p<1) requestAnimationFrame(animate); else{
      spinning=false;window.ToolsPlatform?.setBusy(spinBtn,false);
      const normalized=((Math.PI*1.5-(rotation%(Math.PI*2)))%(Math.PI*2)+(Math.PI*2))%(Math.PI*2);
      const slice=(Math.PI*2)/names.length;
      const idx=Math.floor(normalized/slice)%names.length;
      resultText.textContent=STRINGS[currentLang].winner+names[idx];
    }
  }
  requestAnimationFrame(animate);
}

function resetAll(){rotation=0;spinning=false;window.ToolsPlatform?.setBusy(spinBtn,false);namesInput.value='';resultText.textContent='';resultText.classList.remove('error');drawWheel();namesInput.focus()}
function applyLang(lang){
  const s=STRINGS[lang]||STRINGS.ar; currentLang=lang;
  document.documentElement.lang=s.lang;document.documentElement.dir=s.dir;document.title=s.title;
  document.querySelector('meta[name="description"]').setAttribute('content',s.descMeta);
  document.getElementById('tag').textContent=s.tag;document.getElementById('title').textContent=s.heading;
  document.getElementById('desc').textContent=s.desc;document.getElementById('namesLabel').textContent=s.label;namesInput.placeholder=s.placeholder;
  document.getElementById('spinBtn').textContent=s.spin;document.getElementById('resetBtn').textContent=s.reset;
  document.getElementById('backLink').textContent=s.back;document.getElementById('builtBy').textContent=s.builtBy;
  document.getElementById('langBtn').textContent=s.langBtn;document.getElementById('themeBtn').setAttribute('aria-label',s.themeLabel);window.ToolsPlatform?.setLanguagePreference(lang);
}
function applyTheme(theme){
  currentTheme=window.ToolsPlatform?.setTheme(theme)||(theme==='light'?'light':'dark');
  if(!window.ToolsPlatform){document.documentElement.setAttribute('data-theme',currentTheme);localStorage.setItem('tools-theme',currentTheme)}
  drawWheel();
}

document.getElementById('spinBtn').addEventListener('click',pickWinner);
document.getElementById('resetBtn').addEventListener('click',resetAll);
document.getElementById('langBtn').addEventListener('click',()=>applyLang(currentLang==='ar'?'en':'ar'));
document.getElementById('themeBtn').addEventListener('click',()=>applyTheme(currentTheme==='dark'?'light':'dark'));
namesInput.addEventListener('input',()=>{resultText.classList.remove('error');drawWheel()});
applyTheme(currentTheme);
applyLang(currentLang);
namesInput.value='';drawWheel();
