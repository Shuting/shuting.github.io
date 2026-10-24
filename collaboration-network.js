import {partners} from './data/collaboration-partners.js';
import {islandArt,islandRoutes} from './collaboration-art.js?v=islands1';
const groups=[
 {id:'australia',name:'澳大利亚',en:'AUSTRALIA',region:'澳大利亚'},
 {id:'hongkong',name:'香港与澳门',en:'HONG KONG & MACAU',region:'香港与澳门'},
 {id:'mainland',name:'内地高校',en:'MAINLAND CHINA',region:'内地高校'},
 {id:'weather',name:'气象合作单位',en:'METEOROLOGICAL PARTNERS',region:null}
];
export function initCollaboration(root,onHome){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const inGroup=g=>partners.filter(p=>g.region?p.region===g.region:p.type==='weather');
 const academia=partners.filter(p=>p.type==='academia'),weather=partners.filter(p=>p.type==='weather');
 root.innerHTML=`<div class="cn-wrap">
 <section class="cn-islands" aria-labelledby="cn-title"><h1 id="cn-title" class="sr-only">合作群岛 · Collaborations</h1>${islandRoutes()}${groups.map((g,i)=>`<button type="button" class="cn-island cn-island-${g.id}" data-cn-island="${g.id}" aria-haspopup="dialog" aria-controls="cn-island-dialog" aria-label="${g.name}，${inGroup(g).length}家合作单位，查看名单">${islandArt(g.id,i)}<span class="cn-island-label"><strong>${g.name}</strong><small lang="en">${g.en}</small></span><span class="cn-island-hint" aria-hidden="true">${inGroup(g).length} 家伙伴 ↗</span></button>`).join('')}</section>
 <div class="cn-directories"><section class="cn-directory" id="cn-academia" tabindex="-1" aria-labelledby="cn-academia-title"><header class="cn-section-heading"><h2 id="cn-academia-title">合作高校<span>${academia.length}</span></h2><p class="cn-eyebrow">ACADEMIC PARTNERS</p></header><div class="cn-university-list">${groups.filter(g=>g.region).map(g=>`<section class="cn-region" id="cn-group-${g.id}" tabindex="-1" aria-labelledby="cn-region-${g.id}"><h3 id="cn-region-${g.id}">${g.name}</h3><ul>${inGroup(g).map(p=>`<li data-cn-partner="${p.id}">${p.name}</li>`).join('')}</ul></section>`).join('')}</div></section>
 <section class="cn-directory cn-weather" id="cn-group-weather" tabindex="-1" aria-labelledby="cn-weather-title"><header class="cn-section-heading"><h2 id="cn-weather-title">气象项目合作<span>${weather.length}</span></h2><p class="cn-eyebrow">PROJECT COLLABORATIONS</p></header><p class="cn-weather-intro">以项目合作连接气象科研与预报业务，<br>让数据、方法与实际问题持续对话。</p><ul class="cn-weather-list">${weather.map((p,i)=>`<li data-cn-partner="${p.id}"><span class="cn-partner-number">${String(i+1).padStart(2,'0')}</span><div><h3>${p.name}</h3><span class="cn-project-badge">项目合作</span></div></li>`).join('')}</ul></section></div>
 <section class="cn-new-connection"><div><p class="cn-eyebrow">OPEN TO NEW CONNECTIONS</p><h2>期待下一次，一起探索。</h2><p>欢迎高校、科研机构与业务单位，交流人工智能与气象领域的合作想法。</p></div><a href="mailto:tingshu@szu.edu.cn?subject=${encodeURIComponent('合作交流｜单位｜研究主题')}&body=${encodeURIComponent('舒老师您好，\n\n我的姓名与单位：\n希望交流的研究问题：\n可能的合作方向：\n相关工作或资料链接：\n')}">聊聊合作 <span aria-hidden="true">↗</span></a></section>
 <footer class="cn-end"><span>AI × Weather · Collaborations</span><button type="button" data-cn-home>返回地球主页 ↗</button></footer>
 <dialog id="cn-island-dialog" aria-labelledby="cn-dialog-title"><button class="cn-dialog-close" type="button" aria-label="关闭合作单位名单">×</button><p class="cn-eyebrow" id="cn-dialog-en"></p><h2 id="cn-dialog-title"></h2><p id="cn-dialog-description"></p><ul id="cn-dialog-list"></ul><button type="button" class="cn-dialog-directory">在完整名单中查看 <span aria-hidden="true">↓</span></button></dialog></div>`;
 const dialog=root.querySelector('#cn-island-dialog');let selectedGroup='australia';
 root.querySelectorAll('[data-cn-island]').forEach(button=>button.addEventListener('click',()=>{
  selectedGroup=button.dataset.cnIsland;const g=groups.find(g=>g.id===selectedGroup);
  root.querySelector('#cn-dialog-title').textContent=g.name;
  root.querySelector('#cn-dialog-en').textContent=g.en;
  root.querySelector('#cn-dialog-description').textContent=g.region?`${inGroup(g).length} 所合作高校 · 学术交流与共同探索`:'5 家气象单位 · 均有项目合作支撑';
  root.querySelector('#cn-dialog-list').innerHTML=inGroup(g).map(p=>`<li>${p.name}</li>`).join('');
  dialog.showModal();
 }));
 root.querySelector('.cn-dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('keydown',e=>{if(e.key==='Escape')e.stopPropagation();});
 root.querySelector('.cn-dialog-directory').addEventListener('click',()=>{
  dialog.close();const target=root.querySelector(`#cn-group-${selectedGroup}`);
  target.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});target.focus({preventScroll:true});
 });
 root.querySelector('[data-cn-home]').addEventListener('click',onHome);
 return {setActive(active){if(!active&&dialog.open)dialog.close();}};
}
