
const STRINGS={
  ar:{lang:'ar',dir:'rtl',title:'JSON Formatter — tools.oalfawzan.sa',meta:'منسق JSON سريع للنسخ والتحقق.',tag:'// أداة',heading:'JSON Formatter',desc:'ألصق JSON، ثم نسّقه أو صغّره وتحقق من صحته فورًا.',format:'تنسيق',minify:'تصغير',copy:'نسخ الناتج',clear:'مسح',back:'← الرجوع لكل الأدوات',builtBy:'من تطوير',langBtn:'EN',themeDark:'🌙',themeLight:'☀️',placeholder:'{"project":"tools"}',ok:'JSON صالح.',copyOk:'تم النسخ.',empty:'لا يوجد JSON للإخراج.',invalid:'JSON غير صالح: '},
  en:{lang:'en',dir:'ltr',title:'JSON Formatter — tools.oalfawzan.sa',meta:'Fast JSON formatter and validator.',tag:'// TOOL',heading:'JSON Formatter',desc:'Paste JSON, then format, minify, and validate instantly.',format:'Format',minify:'Minify',copy:'Copy Output',clear:'Clear',back:'← Back to all tools',builtBy:'Built by',langBtn:'عربي',themeDark:'🌙',themeLight:'☀️',placeholder:'{"project":"tools"}',ok:'Valid JSON.',copyOk:'Copied.',empty:'No output to copy.',invalid:'Invalid JSON: '}
};
let currentLang=localStorage.getItem('tools_lang')||'ar';
let currentTheme=localStorage.getItem('tools_theme')||'dark';
const input=document.getElementById('inputJson');const output=document.getElementById('outputJson');const status=document.getElementById('status');
function parseJSON(){const raw=input.value.trim();if(!raw) throw new Error('empty');return JSON.parse(raw)}
function setStatus(msg,isError=false){status.classList.toggle('error',isError);status.textContent=msg}
function formatJSON(){try{output.value=JSON.stringify(parseJSON(),null,2);setStatus(STRINGS[currentLang].ok)}catch(e){setStatus(e.message==='empty'?'':STRINGS[currentLang].invalid+e.message,true)}}
function minifyJSON(){try{output.value=JSON.stringify(parseJSON());setStatus(STRINGS[currentLang].ok)}catch(e){setStatus(e.message==='empty'?'':STRINGS[currentLang].invalid+e.message,true)}}
async function copyOut(){if(!output.value.trim()){setStatus(STRINGS[currentLang].empty,true);return}await navigator.clipboard.writeText(output.value);setStatus(STRINGS[currentLang].copyOk)}
function clearAll(){input.value='';output.value='';setStatus('')}
function applyLang(lang){
  const s=STRINGS[lang]||STRINGS.ar;currentLang=lang;
  document.documentElement.lang=s.lang;document.documentElement.dir=s.dir;document.title=s.title;
  document.querySelector('meta[name="description"]').setAttribute('content',s.meta);
  document.getElementById('tag').textContent=s.tag;document.getElementById('title').textContent=s.heading;
  document.getElementById('desc').textContent=s.desc;document.getElementById('formatBtn').textContent=s.format;
  document.getElementById('minifyBtn').textContent=s.minify;document.getElementById('copyBtn').textContent=s.copy;
  document.getElementById('clearBtn').textContent=s.clear;document.getElementById('backLink').textContent=s.back;
  document.getElementById('builtBy').textContent=s.builtBy;document.getElementById('langBtn').textContent=s.langBtn;
  document.getElementById('themeBtn').textContent=(currentTheme==='light'?s.themeDark:s.themeLight);
  input.placeholder=s.placeholder;setStatus('');localStorage.setItem('tools_lang',lang);
}
document.getElementById('formatBtn').addEventListener('click',formatJSON);
document.getElementById('minifyBtn').addEventListener('click',minifyJSON);
document.getElementById('copyBtn').addEventListener('click',copyOut);
document.getElementById('clearBtn').addEventListener('click',clearAll);
document.getElementById('langBtn').addEventListener('click',()=>applyLang(currentLang==='ar'?'en':'ar'));
function applyTheme(theme){currentTheme=theme==='light'?'light':'dark';document.documentElement.setAttribute('data-theme',currentTheme);localStorage.setItem('tools_theme',currentTheme);document.getElementById('themeBtn').textContent=(currentTheme==='light'?STRINGS[currentLang].themeDark:STRINGS[currentLang].themeLight)}
document.getElementById('themeBtn').addEventListener('click',()=>applyTheme(currentTheme==='dark'?'light':'dark'));
applyTheme(currentTheme);
applyLang(currentLang);
