const STRINGS={
  ar:{lang:'ar',dir:'rtl',title:'QR Generator — tools.oalfawzan.sa',meta:'مولد QR للنصوص والروابط وبطاقات vCard.',tag:'// أداة',heading:'QR Code Generator',desc:'أنشئ رمز QR للرابط أو النص أو بطاقة vCard قابلة للحفظ كجهة اتصال.',textTab:'نص / رابط',contactTab:'vCard',textLabel:'النص أو الرابط',placeholder:'https://tools.oalfawzan.sa',helper:'يدعم الروابط والنصوص العادية.',contactIntro:'أنشئ بطاقة vCard قياسية. عند مسح الرمز يمكن للهاتف عرض جهة الاتصال وحفظها مباشرة.',firstName:'الاسم الأول *',lastName:'اسم العائلة',company:'الشركة',job:'المسمى الوظيفي',mobile:'الجوال',workPhone:'هاتف العمل',email:'البريد الإلكتروني',website:'الموقع',address:'العنوان',note:'ملاحظات',version:'إصدار vCard',vcardHelp:'vCard 4.0 يتبع RFC 6350. استخدم 3.0 فقط إذا كان جهاز أو قارئ قديم لا يتعرف على 4.0.',generate:'إنشاء QR',download:'تنزيل PNG',preview:'معاينة',previewHelp:'امسح الرمز بكاميرا الجوال للتجربة قبل التنزيل.',back:'← الرجوع لكل الأدوات',builtBy:'من تطوير',empty:'يرجى إدخال نص أو رابط أولًا.',contactEmpty:'يرجى إدخال الاسم الأول على الأقل.',ok:'تم إنشاء الرمز بنجاح.',contactOk:'تم إنشاء بطاقة vCard بنجاح.',downloaded:'تم تجهيز ملف PNG.',libraryFail:'تعذر تحميل مكتبة QR. تحقق من الاتصال ثم أعد تحميل الصفحة.'},
  en:{lang:'en',dir:'ltr',title:'QR Generator — tools.oalfawzan.sa',meta:'QR generator for text, URLs, and vCard contacts.',tag:'// TOOL',heading:'QR Code Generator',desc:'Create QR codes for URLs, text, or a vCard contact that can be saved directly.',textTab:'Text / URL',contactTab:'vCard',textLabel:'Text or URL',placeholder:'https://tools.oalfawzan.sa',helper:'Supports both plain text and URLs.',contactIntro:'Create a standards-based vCard. Scanning the QR can display the contact and let the user save it directly.',firstName:'First name *',lastName:'Last name',company:'Company',job:'Job title',mobile:'Mobile',workPhone:'Work phone',email:'Email',website:'Website',address:'Address',note:'Notes',version:'vCard version',vcardHelp:'vCard 4.0 follows RFC 6350. Use 3.0 only for compatibility with older devices or scanners.',generate:'Generate QR',download:'Download PNG',preview:'Preview',previewHelp:'Scan with your phone camera to test it before downloading.',back:'← Back to all tools',builtBy:'Built by',empty:'Please enter text or URL first.',contactEmpty:'Please enter at least the first name.',ok:'QR code generated successfully.',contactOk:'vCard QR created successfully.',downloaded:'PNG is ready.',libraryFail:'The QR library failed to load. Check your connection and reload the page.'}
};
const $=id=>document.getElementById(id);
const qrText=$('qrText'),statusEl=$('status'),canvas=$('qrCanvas');
let qr=null,currentMode='text';
let currentLang=localStorage.getItem('tools-language')||localStorage.getItem('tools_lang')||'ar';
let currentTheme=localStorage.getItem('tools-theme')||localStorage.getItem('tools_theme')||'dark';
function ensureQr(){if(qr)return true;if(typeof QRious!=='function'){statusEl.textContent=STRINGS[currentLang].libraryFail;statusEl.classList.add('error');return false}qr=new QRious({element:canvas,size:320,value:'https://tools.oalfawzan.sa',background:'white',foreground:'black',level:'M'});return true}
function textEscape(v=''){return String(v).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,')}
function normalizeUrl(v=''){const s=v.trim();if(!s)return'';return /^[a-z][a-z0-9+.-]*:/i.test(s)?s:`https://${s}`}
function normalizeTel(v=''){return v.trim().replace(/[^+0-9*#,;pwPW]/g,'')}
function splitAddress(value=''){const raw=value.trim();return raw?raw:''}
function buildVCard(){
  const first=$('contactFirstName').value.trim();
  const last=$('contactLastName').value.trim();
  if(!first)return null;
  const company=$('contactCompany').value.trim(),job=$('contactJob').value.trim(),mobile=normalizeTel($('contactMobile').value),workPhone=normalizeTel($('contactWorkPhone').value),email=$('contactEmail').value.trim(),website=normalizeUrl($('contactWebsite').value),address=splitAddress($('contactAddress').value),note=$('contactNote').value.trim(),version=$('vcardVersion').value==='3.0'?'3.0':'4.0';
  const fullName=[first,last].filter(Boolean).join(' ');
  const lines=['BEGIN:VCARD',`VERSION:${version}`,`FN:${textEscape(fullName)}`,`N:${textEscape(last)};${textEscape(first)};;;`];
  if(company)lines.push(`ORG:${textEscape(company)}`);
  if(job)lines.push(`TITLE:${textEscape(job)}`);
  if(version==='4.0'){
    if(mobile)lines.push(`TEL;VALUE=uri;TYPE="cell,voice,text":tel:${mobile}`);
    if(workPhone)lines.push(`TEL;VALUE=uri;TYPE="work,voice":tel:${workPhone}`);
    if(email)lines.push(`EMAIL;TYPE=work:${textEscape(email)}`);
    if(website)lines.push(`URL:${website}`);
    if(address)lines.push(`ADR;TYPE=work:;;${textEscape(address)};;;;`);
  }else{
    if(mobile)lines.push(`TEL;TYPE=CELL:${textEscape(mobile)}`);
    if(workPhone)lines.push(`TEL;TYPE=WORK,VOICE:${textEscape(workPhone)}`);
    if(email)lines.push(`EMAIL;TYPE=INTERNET,WORK:${textEscape(email)}`);
    if(website)lines.push(`URL:${website}`);
    if(address)lines.push(`ADR;TYPE=WORK:;;${textEscape(address)};;;;`);
  }
  if(note)lines.push(`NOTE:${textEscape(note)}`);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}
function getPayload(){if(currentMode==='contact')return buildVCard();return qrText.value.trim()||null}
function renderValue(showSuccess=true){statusEl.classList.remove('error');const value=getPayload();if(!value){statusEl.textContent=currentMode==='contact'?STRINGS[currentLang].contactEmpty:STRINGS[currentLang].empty;statusEl.classList.add('error');return false}if(!ensureQr())return false;qr.value=value;if(showSuccess)statusEl.textContent=currentMode==='contact'?STRINGS[currentLang].contactOk:STRINGS[currentLang].ok;return true}
function generate(){renderValue(true)}
function download(){if(!renderValue(false))return;const a=document.createElement('a');a.href=qr.toDataURL('image/png');const stamp=new Date().toISOString().slice(0,10),suffix=currentMode==='contact'?'vcard':'qr';a.download=`${suffix}-${stamp}.png`;document.body.append(a);a.click();a.remove();statusEl.textContent=STRINGS[currentLang].downloaded}
function switchMode(mode){currentMode=mode==='contact'?'contact':'text';$('textMode').hidden=currentMode!=='text';$('contactMode').hidden=currentMode!=='contact';document.querySelectorAll('.mode-tab').forEach(btn=>{const active=btn.dataset.mode===currentMode;btn.classList.toggle('active',active);btn.setAttribute('aria-selected',String(active))});$('previewType').textContent=currentMode==='contact'?`VCARD ${$('vcardVersion').value}`:'URL / TEXT';statusEl.textContent='';statusEl.classList.remove('error');if(currentMode==='contact'&&$('contactFirstName').value.trim())renderValue(false);else if(currentMode==='text'&&qrText.value.trim())renderValue(false)}
function applyLang(lang){const s=STRINGS[lang]||STRINGS.ar;currentLang=lang;document.documentElement.lang=s.lang;document.documentElement.dir=s.dir;document.title=s.title;document.querySelector('meta[name="description"]').setAttribute('content',s.meta);$('tag').textContent=s.tag;$('title').textContent=s.heading;$('desc').textContent=s.desc;$('textTab').textContent=s.textTab;$('contactTab').textContent=s.contactTab;$('textLabel').textContent=s.textLabel;qrText.placeholder=s.placeholder;$('helper').textContent=s.helper;$('contactIntro').textContent=s.contactIntro;$('firstNameLabel').textContent=s.firstName;$('lastNameLabel').textContent=s.lastName;$('companyLabel').textContent=s.company;$('jobLabel').textContent=s.job;$('mobileLabel').textContent=s.mobile;$('workPhoneLabel').textContent=s.workPhone;$('emailLabel').textContent=s.email;$('websiteLabel').textContent=s.website;$('addressLabel').textContent=s.address;$('noteLabel').textContent=s.note;$('vcardVersionLabel').textContent=s.version;$('vcardHelp').textContent=s.vcardHelp;$('generateBtn').textContent=s.generate;$('downloadBtn').textContent=s.download;$('previewLabel').textContent=s.preview;$('previewHelp').textContent=s.previewHelp;$('backLink').textContent=s.back;$('builtBy').textContent=s.builtBy;statusEl.textContent='';statusEl.classList.remove('error');localStorage.setItem('tools-language',lang);localStorage.setItem('tools_lang',lang)}
$('generateBtn').addEventListener('click',generate);$('downloadBtn').addEventListener('click',download);document.querySelectorAll('.mode-tab').forEach(btn=>btn.addEventListener('click',()=>switchMode(btn.dataset.mode)));qrText.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();generate()}});$('langBtn').addEventListener('click',()=>applyLang(currentLang==='ar'?'en':'ar'));
['contactFirstName','contactLastName','contactCompany','contactJob','contactMobile','contactWorkPhone','contactEmail','contactWebsite','contactAddress','contactNote','vcardVersion'].forEach(id=>$(id).addEventListener('input',()=>{if(currentMode==='contact'){$('previewType').textContent=`VCARD ${$('vcardVersion').value}`;if($('contactFirstName').value.trim())renderValue(false)}}));
$('vcardVersion').addEventListener('change',()=>{if(currentMode==='contact'){$('previewType').textContent=`VCARD ${$('vcardVersion').value}`;if($('contactFirstName').value.trim())renderValue(false)}});
function applyTheme(theme){currentTheme=theme==='light'?'light':'dark';document.documentElement.setAttribute('data-theme',currentTheme);localStorage.setItem('tools-theme',currentTheme);localStorage.setItem('tools_theme',currentTheme)}
$('themeBtn').addEventListener('click',()=>applyTheme(currentTheme==='dark'?'light':'dark'));ensureQr();applyTheme(currentTheme);applyLang(currentLang);switchMode('text');
