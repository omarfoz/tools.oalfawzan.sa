(() => {
  'use strict';
  const THEME_KEY='tools-theme', LEGACY_THEME='tools_theme', LANG_KEY='tools-language', LEGACY_LANG='tools_lang';
  const ICONS={sun:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.41M17.66 6.34l1.41-1.41"/></svg>',moon:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z"/></svg>'};
  const DATA={ar:{title:'أدوات عمر الفوزان — أدوات عملية سريعة',eyebrow:'TOOLS.OALFAWZAN.SA',h1a:'أدوات عملية،',h1b:'بدون تعقيد.',desc:'مجموعة أدوات مركّزة تساعدك على المقارنة والحساب والتحليل وإنجاز المهام اليومية مباشرة من المتصفح.',manifestoKicker:'الفكرة بسيطة',manifestoTitle:'افتح الأداة. أنجز المهمة. وارجع لشيء أهم.',manifestoDesc:'لا حسابات، لا تتبع، ولا خطوات زائدة. كل أداة مصممة لتؤدي وظيفة واضحة داخل المتصفح.',directory:'دليل الأدوات',sub:'اختر الأداة المناسبة أو ابحث بالاسم.',searchLabel:'البحث في الأدوات',search:'ابحث عن أداة…',all:'الكل',career:'العمل والمال',developer:'للمطورين',productivity:'الإنتاجية',market:'الأسواق',launch:'فتح الأداة',none:'لا توجد أدوات مطابقة للبحث.',profile:'الملف الشخصي',github:'GitHub'},en:{title:'Omar Alfawzan Tools — focused browser utilities',eyebrow:'TOOLS.OALFAWZAN.SA',h1a:'Useful tools,',h1b:'without the overhead.',desc:'Focused browser utilities for comparing, calculating, analyzing, and getting everyday tasks done quickly.',manifestoKicker:'THE IDEA IS SIMPLE',manifestoTitle:'Open the tool. Finish the task. Get back to what matters.',manifestoDesc:'No accounts, no tracking, no unnecessary steps. Every tool is designed to do one clear job in your browser.',directory:'Tool directory',sub:'Choose a tool or search by name.',searchLabel:'Search tools',search:'Search tools…',all:'All',career:'Career & finance',developer:'Developer',productivity:'Productivity',market:'Markets',launch:'Open tool',none:'No tools match your search.',profile:'Profile',github:'GitHub'}};

  const cards=[...document.querySelectorAll('.tool-card')];
  const filters=[...document.querySelectorAll('.filter')];
  const search=document.getElementById('toolSearch');
  const empty=document.getElementById('emptyTools');
  const themeBtn=document.getElementById('themeBtn');
  const langBtn=document.getElementById('langBtn');
  let category='all';

  const validTheme=v=>v==='light'||v==='dark';
  const validLang=v=>v==='ar'||v==='en';
  function getTheme(){const saved=localStorage.getItem(THEME_KEY)||localStorage.getItem(LEGACY_THEME);return validTheme(saved)?saved:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark')}
  function applyTheme(theme,persist=true){theme=validTheme(theme)?theme:'dark';document.documentElement.dataset.theme=theme;const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=theme==='light'?'#f8fafc':'#09090b';if(persist){localStorage.setItem(THEME_KEY,theme);localStorage.setItem(LEGACY_THEME,theme)}themeBtn.innerHTML=theme==='light'?ICONS.moon:ICONS.sun;themeBtn.setAttribute('aria-label',theme==='light'?'Dark mode':'Light mode');themeBtn.title=theme==='light'?'Dark mode':'Light mode'}
  function getLang(){const saved=localStorage.getItem(LANG_KEY)||localStorage.getItem(LEGACY_LANG);return validLang(saved)?saved:'ar'}

  function applyFilter(){const q=search.value.trim().toLocaleLowerCase();let shown=0;cards.forEach(card=>{const visible=(category==='all'||card.dataset.category===category)&&(!q||card.textContent.toLocaleLowerCase().includes(q));card.hidden=!visible;if(visible)shown++});empty.style.display=shown?'none':'block'}
  function setLang(lang,persist=true){lang=validLang(lang)?lang:'ar';const s=DATA[lang];document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';if(persist){localStorage.setItem(LANG_KEY,lang);localStorage.setItem(LEGACY_LANG,lang)}document.title=s.title;langBtn.textContent=lang==='ar'?'EN':'ع';langBtn.setAttribute('aria-label',lang==='ar'?'Switch to English':'التبديل إلى العربية');langBtn.title=lang==='ar'?'English':'العربية';document.getElementById('heroTitle').innerHTML=`<span>${s.h1a}</span><span>${s.h1b}</span>`;const map={eyebrow:'eyebrow',heroDesc:'desc',manifestoKicker:'manifestoKicker',manifestoTitle:'manifestoTitle',manifestoDesc:'manifestoDesc',directoryTitle:'directory',directorySub:'sub',searchLabel:'searchLabel',profileLink:'profile',githubLink:'github',emptyTools:'none'};Object.entries(map).forEach(([id,key])=>{const el=document.getElementById(id);if(el)el.textContent=s[key]});search.placeholder=s.search;filters.forEach(filter=>{filter.textContent=s[filter.dataset.i18n]});document.querySelectorAll('.launch').forEach(el=>{el.textContent=s.launch})}

  search.addEventListener('input',applyFilter,{passive:true});
  filters.forEach(filter=>filter.addEventListener('click',()=>{category=filter.dataset.category;filters.forEach(item=>item.setAttribute('aria-pressed',String(item===filter)));applyFilter()}));
  langBtn.addEventListener('click',()=>setLang(document.documentElement.lang==='ar'?'en':'ar'));
  themeBtn.addEventListener('click',()=>applyTheme(document.documentElement.dataset.theme==='light'?'dark':'light'));

  applyTheme(getTheme(),false);
  setLang(getLang(),false);
})();
