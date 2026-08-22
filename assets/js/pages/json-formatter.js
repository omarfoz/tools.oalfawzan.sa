const STRINGS={
  ar:{lang:'ar',dir:'rtl',title:'JSON Formatter — tools.oalfawzan.sa',meta:'منسق JSON سريع للنسخ والتحقق.',tag:'// أداة',heading:'JSON Formatter',desc:'ألصق JSON، ثم نسّقه أو صغّره وتحقق من صحته فورًا.',format:'تنسيق',minify:'تصغير',copy:'نسخ الناتج',clear:'مسح',back:'← الرجوع لكل الأدوات',builtBy:'من تطوير',langBtn:'EN',themeLabel:'تبديل المظهر',placeholder:'{"project":"tools"}',ok:'JSON صالح.',copyOk:'تم النسخ.',copyFail:'تعذر النسخ. اسمح بالوصول إلى الحافظة أو انسخ النص يدويًا.',empty:'أدخل JSON أولًا.',noOutput:'لا يوجد JSON للإخراج.',invalid:'JSON غير صالح: '},
  en:{lang:'en',dir:'ltr',title:'JSON Formatter — tools.oalfawzan.sa',meta:'Fast JSON formatter and validator.',tag:'// TOOL',heading:'JSON Formatter',desc:'Paste JSON, then format, minify, and validate instantly.',format:'Format',minify:'Minify',copy:'Copy Output',clear:'Clear',back:'← Back to all tools',builtBy:'Built by',langBtn:'عربي',themeLabel:'Toggle theme',placeholder:'{"project":"tools"}',ok:'Valid JSON.',copyOk:'Copied.',copyFail:'Unable to copy. Allow clipboard access or copy the output manually.',empty:'Enter JSON first.',noOutput:'No output to copy.',invalid:'Invalid JSON: '}
};
let currentLang=window.ToolsPlatform?.getLanguage('ar')||'ar';
let currentTheme=window.ToolsPlatform?.getTheme()||'dark';
const input=document.getElementById('inputJson');
const output=document.getElementById('outputJson');
const status=document.getElementById('status');
function setStatus(msg,isError=false){status.classList.toggle('error',isError);status.textContent=msg}
function parseJSON(){const raw=input.value.trim();if(!raw) throw new Error('empty');return JSON.parse(raw)}
function transform(mode){
  try{
    const value=parseJSON();
    output.value=JSON.stringify(value,null,mode==='format'?2:0);
    setStatus(STRINGS[currentLang].ok);
  }catch(e){
    output.value='';
    const s=STRINGS[currentLang];
    setStatus(e.message==='empty'?s.empty:s.invalid+e.message,true);
  }
}
function formatJSON(){transform('format')}
function minifyJSON(){transform('minify')}
async function copyOut(){
  const s=STRINGS[currentLang];
  if(!output.value.trim()){setStatus(s.noOutput,true);return}
  try{
    if(window.ToolsPlatform?.copyText){await window.ToolsPlatform.copyText(output.value)}
    else await navigator.clipboard.writeText(output.value);
    setStatus(s.copyOk);
  }catch(_){setStatus(s.copyFail,true)}
}
function clearAll(){input.value='';output.value='';setStatus('');input.focus()}
function applyLang(lang){
  const s=STRINGS[lang]||STRINGS.ar;currentLang=lang;
  document.documentElement.lang=s.lang;document.documentElement.dir=s.dir;document.title=s.title;
  document.querySelector('meta[name="description"]').setAttribute('content',s.meta);
  document.getElementById('tag').textContent=s.tag;document.getElementById('title').textContent=s.heading;
  document.getElementById('desc').textContent=s.desc;document.getElementById('formatBtn').textContent=s.format;
  document.getElementById('minifyBtn').textContent=s.minify;document.getElementById('copyBtn').textContent=s.copy;
  document.getElementById('clearBtn').textContent=s.clear;document.getElementById('backLink').textContent=s.back;
  document.getElementById('builtBy').textContent=s.builtBy;document.getElementById('langBtn').textContent=s.langBtn;
  document.getElementById('themeBtn').setAttribute('aria-label',s.themeLabel);
  input.placeholder=s.placeholder;setStatus('');window.ToolsPlatform?.setLanguagePreference(lang);
}
function applyTheme(theme){
  currentTheme=window.ToolsPlatform?.setTheme(theme)||(theme==='light'?'light':'dark');
  if(!window.ToolsPlatform){document.documentElement.setAttribute('data-theme',currentTheme);localStorage.setItem('tools-theme',currentTheme)}
}
document.getElementById('formatBtn').addEventListener('click',formatJSON);
document.getElementById('minifyBtn').addEventListener('click',minifyJSON);
document.getElementById('copyBtn').addEventListener('click',copyOut);
document.getElementById('clearBtn').addEventListener('click',clearAll);
document.getElementById('langBtn').addEventListener('click',()=>applyLang(currentLang==='ar'?'en':'ar'));
input.addEventListener('keydown',(event)=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();formatJSON()}});
document.getElementById('themeBtn').addEventListener('click',()=>applyTheme(currentTheme==='dark'?'light':'dark'));
applyTheme(currentTheme);
applyLang(currentLang);
