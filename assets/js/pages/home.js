(() => {
  const DATA={ar:{lang:'ar',dir:'rtl',title:'أدوات عمر الفوزان — أدوات عملية سريعة',eyebrow:'TOOLS.OALFAWZAN.SA',h1a:'أدوات عملية،',h1b:'بدون تعقيد.',desc:'مجموعة أدوات مركّزة تساعدك على المقارنة والحساب والتحليل وإنجاز المهام اليومية مباشرة من المتصفح.',manifestoKicker:'الفكرة بسيطة',manifestoTitle:'افتح الأداة. أنجز المهمة. وارجع لشيء أهم.',manifestoDesc:'لا حسابات، لا تتبع، ولا خطوات زائدة. كل أداة مصممة لتؤدي وظيفة واضحة داخل المتصفح.',directory:'دليل الأدوات',sub:'اختر الأداة المناسبة أو ابحث بالاسم.',searchLabel:'البحث في الأدوات',search:'ابحث عن أداة…',all:'الكل',career:'العمل والمال',developer:'للمطورين',productivity:'الإنتاجية',market:'الأسواق',launch:'فتح الأداة',none:'لا توجد أدوات مطابقة للبحث.',profile:'الملف الشخصي',github:'GitHub'},en:{lang:'en',dir:'ltr',title:'Omar Alfawzan Tools — focused browser utilities',eyebrow:'TOOLS.OALFAWZAN.SA',h1a:'Useful tools,',h1b:'without the overhead.',desc:'Focused browser utilities for comparing, calculating, analyzing, and getting everyday tasks done quickly.',manifestoKicker:'THE IDEA IS SIMPLE',manifestoTitle:'Open the tool. Finish the task. Get back to what matters.',manifestoDesc:'No accounts, no tracking, no unnecessary steps. Every tool is designed to do one clear job in your browser.',directory:'Tool directory',sub:'Choose a tool or search by name.',searchLabel:'Search tools',search:'Search tools…',all:'All',career:'Career & finance',developer:'Developer',productivity:'Productivity',market:'Markets',launch:'Open tool',none:'No tools match your search.',profile:'Profile',github:'GitHub'}};
  const cards=[...document.querySelectorAll('.tool-card')];
  const filters=[...document.querySelectorAll('.filter')];
  const search=document.getElementById('toolSearch');
  const empty=document.getElementById('emptyTools');
  let category='all';

  function applyFilter(){
    const q=search.value.trim().toLocaleLowerCase();
    let shown=0;
    cards.forEach(card=>{
      const visible=(category==='all'||card.dataset.category===category)&&(!q||card.textContent.toLocaleLowerCase().includes(q));
      card.hidden=!visible;
      if(visible)shown++;
    });
    empty.style.display=shown?'none':'block';
  }

  function setHeroTitle(strings){
    const el=document.getElementById('heroTitle');
    if(el)el.innerHTML=`<span>${strings.h1a}</span><span>${strings.h1b}</span>`;
  }

  function setLang(lang,persist=true){
    const strings=DATA[lang]||DATA.ar;
    if(window.ToolsPlatform)ToolsPlatform.applyLanguage(lang,persist);
    else{
      document.documentElement.lang=strings.lang;
      document.documentElement.dir=strings.dir;
      if(persist)localStorage.setItem('tools-language',lang);
    }
    document.title=strings.title;
    setHeroTitle(strings);
    const map={eyebrow:'eyebrow',heroDesc:'desc',manifestoKicker:'manifestoKicker',manifestoTitle:'manifestoTitle',manifestoDesc:'manifestoDesc',directoryTitle:'directory',directorySub:'sub',searchLabel:'searchLabel',profileLink:'profile',githubLink:'github',emptyTools:'none'};
    Object.entries(map).forEach(([id,key])=>{const el=document.getElementById(id);if(el)el.textContent=strings[key]});
    search.placeholder=strings.search;
    filters.forEach(filter=>{filter.textContent=strings[filter.dataset.i18n]});
    document.querySelectorAll('.launch').forEach(el=>{el.textContent=strings.launch});
  }

  function setTheme(theme){
    if(window.ToolsPlatform)ToolsPlatform.applyTheme(theme);
    else{
      document.documentElement.dataset.theme=theme;
      localStorage.setItem('tools-theme',theme);
    }
  }

  search.addEventListener('input',applyFilter);
  filters.forEach(filter=>filter.addEventListener('click',()=>{
    category=filter.dataset.category;
    filters.forEach(item=>item.setAttribute('aria-pressed',String(item===filter)));
    applyFilter();
  }));
  document.getElementById('langBtn').addEventListener('click',()=>setLang(document.documentElement.lang==='ar'?'en':'ar'));
  document.getElementById('themeBtn').addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='light'?'dark':'light'));

  setTheme(window.ToolsPlatform?ToolsPlatform.getTheme():(localStorage.getItem('tools-theme')||'dark'));
  setLang(window.ToolsPlatform?ToolsPlatform.getLanguage():(localStorage.getItem('tools-language')||'ar'),false);
})();
