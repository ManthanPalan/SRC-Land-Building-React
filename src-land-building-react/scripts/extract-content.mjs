import fs from 'node:fs';
import {parseDocument} from 'htmlparser2';
import {findAll,textContent} from 'domutils';
const site=JSON.parse(fs.readFileSync('src/site-data.json','utf8'));
const clean=n=>textContent(n).replace(/\s+/g,' ').trim();
const nodes=findAll(n=>['h1','h2','h5','p','img'].includes(n.name),parseDocument(site.pages['/meet-our-team/'].html).children);
const team=[];let image='',group='Development & construction';
for(let i=0;i<nodes.length;i++){
 const n=nodes[i];if(n.name==='h1'&&clean(n)==='Finance & HR')group='Finance & people';
 if(n.name==='img')image=n.attribs.src;
 if(n.name==='h2'&&nodes[i+1]?.name==='h5'){
 const name=clean(n);if(!team.some(t=>t.name===name||t.image===image))team.push({name,role:clean(nodes[i+1]),bio:nodes[i+2]?.name==='p'?clean(nodes[i+2]):'',image,group});
 }
}
const anchors=findAll(n=>n.name==='a'&&n.attribs.href?.includes('loopnet')&&!clean(n).includes('View Project'),parseDocument(site.pages['/properties/'].html).children);
const names=['Stone Oak','Research Park','Georgetown','Mesquite','Saginaw','Schertz','Culebra Land','Fate Land','Rockwall','St. Paul'];
const cities=['San Antonio','San Antonio','Georgetown','Mesquite','Saginaw','Schertz','San Antonio','Fate','Rockwall','Wylie'];
const addresses=['626 E Borgfeld Dr','FM 1957 Potranco & Blue Lurkspur Rd','2451 TX-29','705 State Hwy 352','Parkview Hills Ln','5576 FM 1103','14748 Culebra Rd','1001 Hwy 66','900 E Ralph Hall Pkwy','2931 Parker Rd'];
const properties=anchors.slice(0,10).map((a,i)=>({id:names[i].toLowerCase().replaceAll(' ','-'),name:names[i],city:cities[i],address:addresses[i],url:a.attribs.href}));
fs.writeFileSync('src/content.json',JSON.stringify({team,properties},null,2)+'\n');
console.log(`Extracted ${team.length} team members and ${properties.length} source listings.`);
