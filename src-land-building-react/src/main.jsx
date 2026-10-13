import React, {useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import parse from 'html-react-parser';
import site from './site-data.json';
import './styles.css';
for(const href of site.styles){const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link)}
function Header(){return parse(site.header)}
function Footer(){return parse(site.footer)}
function Page({page}){return <main id="content">{parse(page.html)}</main>}
function App(){
 const [path,setPath]=useState(window.location.pathname.replace(/\/?$/,'/'));
 useEffect(()=>{const change=()=>setPath(location.pathname.replace(/\/?$/,'/'));window.addEventListener('popstate',change);return()=>window.removeEventListener('popstate',change)},[]);
 const page=site.pages[path];
 useEffect(()=>{
 document.title=page?.title||'Page not found | SRC Land Building';
 const timers=[];
 document.querySelectorAll('[data-react-slides]').forEach(el=>{const slides=JSON.parse(el.dataset.reactSlides);let i=0;if(slides.length>1&&!matchMedia('(prefers-reduced-motion: reduce)').matches)timers.push(setInterval(()=>{i=(i+1)%slides.length;el.style.backgroundImage=`url("${slides[i]}")`},4000))});
 document.querySelectorAll('.elementor-tab-title,.elementskit-faq-title').forEach(el=>{el.tabIndex=0;el.setAttribute('role','button')});
 const click=e=>{
  const toggle=e.target.closest('.elementor-menu-toggle');
  if(toggle){const on=toggle.classList.toggle('elementor-active');toggle.setAttribute('aria-expanded',String(on));const menu=toggle.closest('.elementor-widget-container')?.querySelector('.elementor-nav-menu--dropdown');if(menu){menu.style.display=on?'block':'none';menu.querySelectorAll('[tabindex="-1"]').forEach(x=>x.tabIndex=0)}return}
  const title=e.target.closest('.elementor-tab-title,.elementskit-faq-title');
  if(title){const panel=title.nextElementSibling;if(panel){const open=title.getAttribute('aria-expanded')!=='true';title.setAttribute('aria-expanded',String(open));title.classList.toggle('elementor-active',open);panel.style.display=open?'block':'none'}return}
  const a=e.target.closest('a[href]');if(!a||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
  const url=new URL(a.href,location.href);if(url.origin===location.origin&&site.pages[url.pathname.replace(/\/?$/,'/')]){e.preventDefault();history.pushState({},'',url.pathname+url.hash);setPath(url.pathname.replace(/\/?$/,'/'));window.scrollTo({top:0});}
 };
 const key=e=>{if(['Enter',' '].includes(e.key)&&e.target.matches('.elementor-menu-toggle,.elementor-tab-title,.elementskit-faq-title')){e.preventDefault();e.target.click()}};
 const submit=e=>{if(e.target.matches('[data-react-form]')){e.preventDefault();if(!e.target.reportValidity())return;let notice=e.target.querySelector('.form-notice');if(!notice){notice=document.createElement('p');notice.className='form-notice';notice.setAttribute('role','status');e.target.appendChild(notice)}notice.textContent='Online submission is not connected in this copy. Please call SRC at (469) 501-9361 to send your inquiry or application.'}};
 document.addEventListener('click',click);document.addEventListener('keydown',key);document.addEventListener('submit',submit);
 return()=>{timers.forEach(clearInterval);document.removeEventListener('click',click);document.removeEventListener('keydown',key);document.removeEventListener('submit',submit)}
 },[path,page]);
 return <><a className="react-skip" href="#content">Skip to content</a><Header/>{page?<Page key={path} page={page}/>:<main className="not-found"><h1>Page not found</h1><a href="/">Return home</a></main>}<Footer/></>
}
createRoot(document.getElementById('root')).render(<App/>);
