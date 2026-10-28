const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const BASE = process.env.OFFER_TEST_URL || 'http://127.0.0.1:4173/offer/';
fs.mkdirSync('test-output',{recursive:true});
const expectText=async(locator,part)=>assert.ok((await locator.textContent()).includes(part),'Expected '+part+' in '+await locator.textContent());
async function main(){
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const configs=[{name:'desktop-ar',width:1280,height:900},{name:'mobile-ar',width:390,height:844},{name:'small-mobile',width:320,height:740}];
  for(const cfg of configs){
   const context=await browser.newContext({viewport:{width:cfg.width,height:cfg.height},locale:'ar-SA'});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text());});
   const res=await page.goto(BASE,{waitUntil:'networkidle'});
   assert.equal(res.status(),200,'Page must load');
   await page.locator('#abasicInput').fill('10000');
   await page.locator('#bbasicInput').fill('12000');
   await page.locator('#ahousingInput').fill('25');
   await page.locator('[data-side="a"][data-key="housingUnit"]').selectOption('pct');
   await page.locator('#bhousingInput').fill('3000');
   await expectText(page.locator('#aPreview'),'11,281.25');
   await expectText(page.locator('#bPreview'),'13,537.50');
   await expectText(page.locator('#verdictDelta'),'+2,256.25');
   assert.equal(await page.locator('#resultContent').isVisible(),true,'Result auto-shows');
   for(const el of await page.locator('.number-input').all()){
    if(!(await el.isVisible()))continue;
    const box=await el.boundingBox();
    if(box)assert.ok(box.width >= (cfg.width<=340?75:cfg.width<=420?100:80),'Input is too narrow: '+await el.getAttribute('id')+' '+box.width);
   }
   const dimensions=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
   const offenders=await page.evaluate(()=>[...document.querySelectorAll('*')].map(el=>{const b=el.getBoundingClientRect();return {tag:el.tagName,id:el.id,cls:String(el.className).slice(0,80),x:Math.round(b.x),right:Math.round(b.right),width:Math.round(b.width)}}).filter(el=>el.x < -1 || el.right > innerWidth+1).slice(0,22));
   assert.ok(dimensions.scroll<=dimensions.width+1,'Horizontal overflow: '+JSON.stringify(dimensions)+' Offenders: '+JSON.stringify(offenders));
   await page.screenshot({path:'test-output/'+cfg.name+'.png',fullPage:true,animations:'disabled'});
   await page.locator('#langBtn').click();
   assert.equal(await page.locator('html').getAttribute('lang'),'en','Language switches');
   await expectText(page.locator('#verdictTitle'),'new offer');
   await page.locator('#themeBtn').click();
   assert.equal(await page.locator('html').getAttribute('data-theme'),'dark','Dark mode works');
   await page.locator('#advanced').evaluate(el=>el.open=true);
   await page.locator('#bbonusInput').fill('20000');
   await page.locator('#bbonusChanceInput').fill('75');
   assert.notEqual(await page.locator('#expectB').textContent(),await page.locator('#guarB').textContent(),'Bonus changes expected cash');
   const downloadPromise=page.waitForEvent('download');
   await page.locator('#exportBtn').click();
   const download=await downloadPromise;
   assert.match(download.suggestedFilename(),/\.csv$/i);
   assert.equal(errors.length,0,'Browser errors: '+errors.join('; '));
   await context.close();
   console.log('PASS '+cfg.name+' calculations, layout, language, bonus, theme, export');
  }
  const legacy=await browser.newContext({viewport:{width:390,height:844}});
  await legacy.addInitScript(()=>{
   localStorage.setItem('offer_v31',JSON.stringify({coA:'Old employer',coB:'New employer',
    A:[{id:'a2',name:'Basic Salary',value:10000,enabled:true},{id:'a3',name:'Housing Allowance',isPct:true,pct:25,pctRef:'a2',enabled:true}],
    B:[{id:'b1',name:'Basic Salary',value:13000,enabled:true}]}));
  });
  const p=await legacy.newPage();p.on('dialog',d=>d.accept());await p.goto(BASE);
  assert.equal(await p.locator('#legacyBtn').isVisible(),true,'Legacy restore offered');
  await p.locator('#legacyBtn').click();
  assert.equal(await p.locator('#abasicInput').inputValue(),'10000');
  assert.equal(await p.locator('#bbasicInput').inputValue(),'13000');
  assert.equal(await p.locator('#ahousingInput').inputValue(),'25');
  assert.equal(await p.locator('[data-side="a"][data-key="housingUnit"]').inputValue(),'pct');
  console.log('PASS legacy recovery');
  await legacy.close();
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
