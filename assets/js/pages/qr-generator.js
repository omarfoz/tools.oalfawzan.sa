
const STRINGS={
  ar:{lang:'ar',dir:'rtl',title:'QR Generator — tools.oalfawzan.sa',meta:'مولد QR سريع مع خيار تنزيل الصورة.',tag:'// أداة',heading:'QR Code Generator',desc:'اكتب نصًا أو رابطًا، ثم أنشئ رمز QR قابلًا للتنزيل.',placeholder:'https://tools.oalfawzan.sa',helper:'يدعم الروابط والنصوص العادية.',generate:'إنشاء QR',download:'تنزيل PNG',back:'← الرجوع لكل الأدوات',builtBy:'من تطوير',langBtn:'EN',themeDark:'🌙',themeLight:'☀️',empty:'يرجى إدخال نص أو رابط أولًا.',ok:'تم إنشاء الرمز بنجاح.'},
  en:{lang:'en',dir:'ltr',title:'QR Generator — tools.oalfawzan.sa',meta:'Fast QR generator with downloadable image.',tag:'// TOOL',heading:'QR Code Generator',desc:'Enter text or URL, generate a QR code, then download it.',placeholder:'https://tools.oalfawzan.sa',helper:'Supports both plain text and URLs.',generate:'Generate QR',download:'Download PNG',back:'← Back to all tools',builtBy:'Built by',langBtn:'عربي',themeDark:'🌙',themeLight:'☀️',empty:'Please enter text or URL first.',ok:'QR code generated successfully.'}
};
const qrText=document.getElementById('qrText');
const statusEl=document.getElementById('status');
const qr=new QRious({element:document.getElementById('qrCanvas'),size:260,value:'https://tools.oalfawzan.sa',background:'white',foreground:'black'});
let currentLang=localStorage.getItem('tools_lang')||'ar';
let currentTheme=localStorage.getItem('tools_theme')||'dark';
function generate(){
  const value=qrText.value.trim();
  if(!value){statusEl.textContent=STRINGS[currentLang].empty;return}
  qr.value=value;statusEl.textContent=STRINGS[currentLang].ok;
}
function download(){
  const value=qrText.value.trim();if(!value){statusEl.textContent=STRINGS[currentLang].empty;return}
  const a=document.createElement('a');a.href=qr.toDataURL('image/png');a.download='qr-code.png';a.click();
}
function applyLang(lang){
  const s=STRINGS[lang]||STRINGS.ar; currentLang=lang;
  document.documentElement.lang=s.lang;document.documentElement.dir=s.dir;document.title=s.title;
  document.querySelector('meta[name="description"]').setAttribute('content',s.meta);
  document.getElementById('tag').textContent=s.tag;document.getElementById('title').textContent=s.heading;
  document.getElementById('desc').textContent=s.desc;qrText.placeholder=s.placeholder;
  document.getElementById('helper').textContent=s.helper;document.getElementById('generateBtn').textContent=s.generate;
  document.getElementById('downloadBtn').textContent=s.download;document.getElementById('backLink').textContent=s.back;
  document.getElementById('builtBy').textContent=s.builtBy;document.getElementById('langBtn').textContent=s.langBtn;
  document.getElementById('themeBtn').textContent=(currentTheme==='light'?s.themeDark:s.themeLight);
  statusEl.textContent='';localStorage.setItem('tools_lang',lang);
}
document.getElementById('generateBtn').addEventListener('click',generate);
document.getElementById('downloadBtn').addEventListener('click',download);
document.getElementById('langBtn').addEventListener('click',()=>applyLang(currentLang==='ar'?'en':'ar'));
function applyTheme(theme){currentTheme=theme==='light'?'light':'dark';document.documentElement.setAttribute('data-theme',currentTheme);localStorage.setItem('tools_theme',currentTheme);document.getElementById('themeBtn').textContent=(currentTheme==='light'?STRINGS[currentLang].themeDark:STRINGS[currentLang].themeLight)}
document.getElementById('themeBtn').addEventListener('click',()=>applyTheme(currentTheme==='dark'?'light':'dark'));
applyTheme(currentTheme);
applyLang(currentLang);
