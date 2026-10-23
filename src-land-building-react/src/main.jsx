import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Header,Footer,Home} from './Experience.jsx';
import {About,Services,Projects,Properties,Team,Contact,Career} from './Pages.jsx';
import {PrivacyPolicy,TermsAndConditions} from './Legal.jsx';
const routes={
 '/':[Home,'Texas Real Estate & Development'],
 '/about-us/':[About,'About SRC'],
 '/services/':[Services,'Our Expertise'],
 '/projects/':[Projects,'Our Projects'],
 '/properties/':[Properties,'Property Explorer'],
 '/lots-for-sale/':[()=> <Properties lots/>,'Land Opportunities'],
 '/meet-our-team/':[Team,'Meet Our Team'],
 '/contact/':[Contact,'Contact Our Team'],
 '/career/':[Career,'Careers'],
 '/privacy-policy/':[PrivacyPolicy,'Privacy Policy'],
 '/terms-and-conditions/':[TermsAndConditions,'Terms & Conditions']
};
const normalize=path=>path.replace(/\/?$/,'/');
function App(){
 const [url,setUrl]=useState(()=>new URL(location.href));
 const path=normalize(url.pathname);const route=routes[path];const Page=route?.[0];
 useEffect(()=>{const pop=()=>setUrl(new URL(location.href));const click=e=>{if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const a=e.target.closest('a[href]');if(!a||a.hasAttribute('download')||(a.target&&a.target!=='_self'))return;const next=new URL(a.href,location.href);if(next.origin!==location.origin||!routes[normalize(next.pathname)])return;e.preventDefault();history.pushState({},'',next.pathname+next.search+next.hash);if(normalize(next.pathname)===normalize(location.pathname)&&next.pathname===url.pathname&&next.search===url.search&&next.hash&&document.getElementById(next.hash.slice(1))){const target=document.getElementById(next.hash.slice(1));target.scrollIntoView();if(target.hasAttribute('tabindex'))target.focus({preventScroll:true});return}setUrl(next)};window.addEventListener('popstate',pop);document.addEventListener('click',click);return()=>{window.removeEventListener('popstate',pop);document.removeEventListener('click',click)}},[url]);
 useEffect(()=>{document.title=(route?.[1]||'Page not found')+' | SRC Land Building';const frame=requestAnimationFrame(()=>{if(url.hash&&document.getElementById(url.hash.slice(1)))document.getElementById(url.hash.slice(1)).scrollIntoView();else window.scrollTo({top:0,behavior:'instant'});document.querySelector('main')?.focus({preventScroll:true})});return()=>cancelAnimationFrame(frame)},[url]);
 return <><a className="react-skip" href="#content">Skip to content</a><Header path={path}/>{Page?<Page key={url.pathname+url.search+url.hash}/>:<main id="content" className="not-found section-wrap" tabIndex="-1"><p className="eyebrow">404 / A NEW DIRECTION</p><h1>Let’s find your way back.</h1><a className="src-button src-button-dark" href="/">Return home</a></main>}<Footer/></>
}
createRoot(document.getElementById('root')).render(<App/>);
