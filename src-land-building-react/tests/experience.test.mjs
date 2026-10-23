import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
const dom=new JSDOM('<!doctype html><html><head></head><body><div id="root"></div></body></html>',{url:'http://localhost/'});
for(const name of ['window','document','HTMLElement','HTMLInputElement','HTMLTextAreaElement','HTMLSelectElement','Event','MouseEvent','FormData','localStorage','history','location'])globalThis[name]=dom.window[name];
Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
globalThis.requestAnimationFrame=cb=>setTimeout(cb,0);globalThis.cancelAnimationFrame=clearTimeout;
window.scrollTo=()=>{};HTMLElement.prototype.scrollIntoView=()=>{};
dom.window.HTMLDialogElement.prototype.showModal=function(){this.open=true};
dom.window.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new Event('close'))};
const compiled=await build({entryPoints:['src/main.jsx'],bundle:true,platform:'node',format:'esm',external:['react','react-dom/client'],loader:{'.css':'empty'},write:false});
const file=new URL('../scripts/.experience-test-runtime.mjs',import.meta.url);await fs.writeFile(file,compiled.outputFiles[0].text);
const {act}=await import('react');
await act(async()=>{await import(file.href);await new Promise(r=>setTimeout(r,20))});await fs.unlink(file);
const tick=async action=>act(async()=>{action();await new Promise(r=>setTimeout(r,15))});
const click=el=>{assert.ok(el,'Expected control exists');return tick(()=>el.dispatchEvent(new MouseEvent('click',{bubbles:true,button:0})))};
async function go(path){const a=document.createElement('a');a.href=path;document.body.append(a);await click(a);a.remove();assert.equal(document.querySelectorAll('header').length,1,'One shared header after navigation');assert.equal(document.querySelectorAll('main').length,1)}
async function input(el,value){assert.ok(el);const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;await tick(()=>{Object.getOwnPropertyDescriptor(proto,'value').set.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))})}
async function select(el,value){await tick(()=>{el.value=value;el.dispatchEvent(new Event('change',{bubbles:true}))})}
const button=text=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===text);
test('all eleven routes render a unique main heading and shared navigation',async()=>{
 for(const path of ['/','/about-us/','/services/','/projects/','/properties/','/lots-for-sale/','/meet-our-team/','/contact/','/career/','/privacy-policy/','/terms-and-conditions/']){await go(path);assert.equal(document.querySelectorAll('main h1').length,1,path);assert.match(document.title,/SRC Land Building/)}
});
test('property search, location filtering, empty state, and list view',async()=>{
 await go('/properties/');assert.equal(document.querySelectorAll('.property-card').length,10);
 await input(document.querySelector('input[type=search]'),'San Antonio');assert.equal(document.querySelectorAll('.property-card').length,3);
 await input(document.querySelector('input[type=search]'),'');await select(document.querySelector('.location-filter select'),'Georgetown');assert.equal(document.querySelectorAll('.property-card').length,1);
 await input(document.querySelector('input[type=search]'),'does-not-exist');assert.ok(document.querySelector('.empty-state'));
 await click(button('Explore all locations'));assert.equal(document.querySelectorAll('.property-card').length,10);
 await click(button('List'));assert.ok(document.querySelector('.property-list'));
});
test('shortlist persists between pages and carries selected names into an inquiry',async()=>{
 await go('/properties/');await click(document.querySelector('button[aria-label="Save Stone Oak to shortlist"]'));assert.deepEqual(JSON.parse(localStorage.getItem('src-shortlist')),['stone-oak']);
 await go('/about-us/');await go('/properties/');assert.ok(document.querySelector('button[aria-label="Remove Stone Oak from shortlist"]'));
 await click(document.querySelector('.shortlist-toggle'));assert.equal(document.querySelectorAll('.property-card').length,1);
 await click(document.querySelector('.property-help a'));assert.match(location.search,/Stone%20Oak/);assert.match(document.querySelector('.inquiry-context').textContent,/Stone Oak/);
 await go('/properties/');await click(document.querySelector('button[aria-label="Remove Stone Oak from shortlist"]'));assert.deepEqual(JSON.parse(localStorage.getItem('src-shortlist')),[]);
});
test('contact embeds the SRC form and loads its script on each visit',async()=>{
 await go('/contact/?interest=Retail%20leasing&property=Stone%20Oak');
 const frame=document.querySelector('.contact-form-embed iframe');
 assert.ok(frame);
 assert.equal(frame.src,'https://links.legacyleadflow.co/widget/form/n9IEQhv0A4VLxincaDjw');
 assert.equal(frame.title,'SRC');
 assert.equal(frame.dataset.formId,'n9IEQhv0A4VLxincaDjw');
 assert.equal(frame.dataset.cookieConsent,'true');
 assert.equal(frame.style.height,'1273px');
 assert.match(document.querySelector('.inquiry-context').textContent,/Stone Oak/);
 assert.equal(document.querySelector('main form'),null);
 const script=document.querySelector('script[src="https://links.legacyleadflow.co/js/form_embed.js"]');
 assert.ok(script);
 await go('/about-us/');assert.equal(script.isConnected,false);
 await go('/contact/');
 assert.equal(document.querySelectorAll('.contact-form-embed iframe').length,1);
 assert.equal(document.querySelectorAll('script[src="https://links.legacyleadflow.co/js/form_embed.js"]').length,1);
});
test('team departments, project dialog, and sector filtering work',async()=>{
 await go('/meet-our-team/');assert.equal(document.querySelectorAll('.team-card').length,13);await click(button('Finance & people'));assert.equal(document.querySelectorAll('.team-card').length,3);
 await go('/projects/');await click(document.querySelector('.project-photo'));assert.equal(document.querySelector('dialog').open,true);assert.match(document.querySelector('#project-dialog-title').textContent,/Georgetown/);await click(document.querySelector('.dialog-close'));assert.equal(document.querySelector('dialog'),null);
 await click(button('Retail'));assert.equal(document.querySelectorAll('.sector-grid article').length,1);
 await go('/projects/#fate');assert.match(document.querySelector('#project-dialog-title').textContent,/Fate/);
});
test('career introduction requires a selected area and prepares a reviewable draft',async()=>{
 await go('/career/');await input(document.querySelector('[name=name]'),'Preview Tester');await input(document.querySelector('[name=email]'),'preview@example.com');await input(document.querySelector('[name=message]'),'Interested in joining the planning team.');assert.equal(document.querySelector('form').checkValidity(),false);
 await select(document.querySelector('form select'),'Planning & design');assert.equal(document.querySelector('form').checkValidity(),true);await tick(()=>document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));assert.match(document.querySelector('.draft-review a').getAttribute('href'),/^mailto:info@srclandbuilding.com/);
});

test('legal footer links navigate and privacy controls clear only the shortlist',async()=>{
 await go('/');await click(document.querySelector('.footer-legal a[href="/privacy-policy/"]'));assert.match(document.querySelector('main h1').textContent,/Privacy Policy/);assert.equal(document.querySelectorAll('.legal-article>section').length,7);
 localStorage.setItem('src-shortlist',JSON.stringify(['stone-oak']));localStorage.setItem('unrelated-setting','keep');await click(button('Clear saved properties'));assert.equal(localStorage.getItem('src-shortlist'),null);assert.equal(localStorage.getItem('unrelated-setting'),'keep');assert.match(document.querySelector('.privacy-storage-control [role=status]').textContent,/cleared/);
 await click(document.querySelector('.legal-related a'));assert.match(document.querySelector('main h1').textContent,/Terms & Conditions/);assert.equal(document.querySelectorAll('.legal-article>section').length,9);
});


test('project cards, sector filters, and dialogs reference actual image files',async()=>{
 async function verifyImages(selector){
  for(const img of document.querySelectorAll(selector)){
   const src=img.getAttribute('src');
   assert.ok(src.startsWith('/assets/'),src);
   const bytes=await fs.readFile(new URL('../public'+src,import.meta.url));
   const valid=bytes.subarray(0,3).equals(Buffer.from([0xff,0xd8,0xff]))
    || bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
    || /^<svg[\s>]/.test(bytes.toString('utf8'));
   assert.ok(valid,`${src} must contain an image, not an HTML error or redirect`);
  }
 }
 await go('/projects/');
 assert.equal(document.querySelectorAll('main img').length,9);
 await verifyImages('main img');
 for(const name of ['Childcare','Retail','Office','Franchise','Storage']){
  await click(button(name));
  assert.equal(document.querySelectorAll('.sector-grid img').length,1);
  await verifyImages('.sector-grid img');
 }
 for(const card of [...document.querySelectorAll('.project-photo')]){
  await click(card);await verifyImages('dialog img');await click(document.querySelector('.dialog-close'));
 }
});
