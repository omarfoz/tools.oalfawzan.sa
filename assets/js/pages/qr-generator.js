const STRINGS={
  ar:{lang:'ar',dir:'rtl',title:'QR Generator — tools.oalfawzan.sa',meta:'مولد QR سريع مع خيار تنزيل الصورة.',tag:'// أداة',heading:'QR Code Generator',desc:'اكتب نصًا أو رابطًا، ثم أنشئ رمز QR قابلًا للتنزيل.',label:'النص أو الرابط',placeholder:'https://tools.oalfawzan.sa',helper:'يدعم الروابط والنصوص العادية.',generate:'إنشاء QR',download:'تنزيل PNG',back:'← الرجوع لكل الأدوات',builtBy:'من تطوير',langBtn:'EN',themeLabel:'تبديل المظهر',empty:'يرجى إدخال نص أو رابط أولًا.',ok:'تم إنشاء الرمز بنجاح.',downloaded:'تم تجهيز ملف PNG.',libraryFail:'تعذر تحميل مكتبة QR. تحقق من الاتصال ثم أعد تحميل الصفحة.'},
  en:{lang:'en',dir:'ltr',title:'QR Generator — tools.oalfawzan.sa',meta:'Fast QR generator with downloadable image.',tag:'// TOOL',heading:'QR Code Generator',desc:'Enter text or URL, generate a QR code, then download it.',label:'Text or URL',placeholder:'https://tools.oalfawzan.sa',helper:'Supports both plain text and URLs.',generate:'Generate QR',download:'Download PNG',back:'← Back to all tools',builtBy:'Built by',langBtn:'عربي',themeLabel:'Toggle theme',empty:'Please enter text or URL first.',ok:'QR code generated successfully.',downloaded:'PNG is ready.',libraryFail:'The QR library failed to load. Check your connection and reload the page.'}
};
const qrText=document.getElementById('qrText');
const statusEl=document.getElementById('status');
const canvas=document.getElementById('qrCanvas');
let qr=null;
let currentLang=window.ToolsPlatform?.getLanguage('ar')||'ar';
let currentTheme=window.ToolsPlatform?.getTheme()||'dark';
function ensureQr(){
  if(qr) return true;
  if(typeof QRious!=='function'){statusEl.textContent=STRINGS[currentLang].libraryFail;statusEl.classList.add('error');return false}
  qr=new QRious({element:canvas,size:260,value:'https://tools.oalfawzan.sa',background:'white',foreground:'black'});
  return true;
}
function renderValue(showSuccess=true){
  const value=qrText.value.trim();
  statusEl.classList.remove('error');
  if(!value){statusEl.textContent=STRINGS[currentLang].empty;statusEl.classList.add('error');qrText.focus();return false}
  if(!ensureQr()) return false;
  qr.value=value;
  if(showSuccess) statusEl.textContent=STRINGS[currentLang].ok;
  return true;
}
function generate(){renderValue(true)}
function download(){
  if(!renderValue(false)) return;
  const a=document.createElement('a');
  a.href=qr.toDataURL('image/png');
  const stamp=new Date().toISOString().slice(0,10);
  a.download=`qr-code-${stamp}.png`;
  document.body.append(a);a.click();a.remove();
  statusEl.textContent=STRINGS[currentLang].downloaded;
}
function applyLang(lang){
  const s=STRINGS[lang]||STRINGS.ar; currentLang=lang;
  document.documentElement.lang=s.lang;document.documentElement.dir=s.dir;document.title=s.title;
  document.querySelector('meta[name="description"]').setAttribute('content',s.meta);
  document.getElementById('tag').textContent=s.tag;document.getElementById('title').textContent=s.heading;
  document.getElementById('desc').textContent=s.desc;document.getElementById('qrTextLabel').textContent=s.label;qrText.placeholder=s.placeholder;
  document.getElementById('helper').textContent=s.helper;document.getElementById('generateBtn').textContent=s.generate;
  document.getElementById('downloadBtn').textContent=s.download;document.getElementById('backLink').textContent=s.back;
  document.getElementById('builtBy').textContent=s.builtBy;document.getElementById('langBtn').textContent=s.langBtn;
  document.getElementById('themeBtn').setAttribute('aria-label',s.themeLabel);
  statusEl.textContent='';statusEl.classList.remove('error');window.ToolsPlatform?.setLanguagePreference(lang);
}
function applyTheme(theme){
  currentTheme=window.ToolsPlatform?.setTheme(theme)||(theme==='light'?'light':'dark');
  if(!window.ToolsPlatform){document.documentElement.setAttribute('data-theme',currentTheme);localStorage.setItem('tools-theme',currentTheme)}
}
document.getElementById('generateBtn').addEventListener('click',generate);
document.getElementById('downloadBtn').addEventListener('click',download);
qrText.addEventListener('keydown',(event)=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();generate()}});
document.getElementById('langBtn').addEventListener('click',()=>applyLang(currentLang==='ar'?'en':'ar'));
document.getElementById('themeBtn').addEventListener('click',()=>applyTheme(currentTheme==='dark'?'light':'dark'));
ensureQr();
applyTheme(currentTheme);
applyLang(currentLang);
