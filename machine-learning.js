import {papers} from './data/ml-papers.js';

export const themes = [
  {id:'representation',zh:'表示学习与分类',en:'Representation Learning & Classification',short:'表示与分类',hint:'特征选择 · 稀疏表示 · 不均衡分类',color:'blue',x:9,y:28},
  {id:'multiview',zh:'多视图学习',en:'Multi-View Learning',short:'多视图',hint:'视图补全 · 图学习 · 子空间聚类',color:'sage',x:23,y:69},
  {id:'federated',zh:'联邦学习',en:'Federated Learning',short:'联邦学习',hint:'异构数据 · 参数高效适配 · 协同学习',color:'gold',x:37,y:46},
  {id:'unlearning',zh:'机器遗忘',en:'Machine Unlearning',short:'机器遗忘',hint:'数据删除 · 联邦遗忘 · 评测基准',color:'blue',x:51,y:70},
  {id:'multimodal',zh:'多模态与大模型',en:'Multimodal Learning & Foundation Models',short:'多模态与大模型',hint:'跨模态对齐 · 视觉语言模型 · 科学理解',color:'sage',x:65,y:27},
  {id:'agents',zh:'强化学习与智能体',en:'Reinforcement Learning & Agents',short:'强化学习与智能体',hint:'安全决策 · 技能记忆 · 仿真反馈',color:'gold',x:78,y:76},
  {id:'applications',zh:'医学与科学应用',en:'Medical & Scientific Applications',short:'医学与科学应用',hint:'医学影像 · 生物信息 · 能源与光子学',color:'blue',x:91,y:44}
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const themeById=id=>themes.find(t=>t.id===id);

// Small conceptual diagrams, not experimental figures or reported results.
function diagram(p){
 const id=p.id,kind=p.topics[0];
 const circle=(x,y,r,c='b')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id}-${c})" stroke="#fffaf1" stroke-width="1.5"/>`;
 const line=(x,y,a,b)=>`<path d="M${x} ${y}L${a} ${b}" fill="none" stroke="#9caeae" stroke-width="1.2"/>`;
 let shapes='';
 if(kind==='multiview'){
  for(let k=2;k>=0;k--){const y=32+k*42;shapes+=`<path d="M24 ${y+24}L148 ${y}L237 ${y+29}L115 ${y+59}Z" fill="${['#cfe1eb','#e4dfc9','#d6e3cd'][k]}" fill-opacity=".48" stroke="#aebdb3" stroke-width=".8"/>`;for(let i=0;i<13;i++){let x=65+(i*29%125),cy=y+19+(i*13%22);shapes+=circle(x,cy,2.4,k%2?'g':'b');}}
 }else if(kind==='federated'||kind==='unlearning'){
  const points=[[57,49],[168,25],[218,93],[171,156],[55,145],[31,93]];
  points.forEach(([x,y],i)=>{shapes+=line(128,90,x,y);shapes+=`<g opacity="${kind==='unlearning'&&i===2?'.23':'1'}">${circle(x,y,12,i%2?'s':'b')}</g>`;});shapes+=circle(128,90,23,'g');if(kind==='unlearning')shapes+='<path d="M204 81l27 25m-27 0l27-25" stroke="#ad8b65" stroke-width="1.4" stroke-dasharray="3 3"/>';
 }else if(kind==='agents'){
  shapes='<path d="M55 78C48 10 215 9 210 82M211 111C211 177 47 175 52 110" fill="none" stroke="#9daea5" stroke-width="1.4"/><path d="M202 74l8 10 7-12M61 119l-9-11-8 11" fill="none" stroke="#b4976a"/>';
  shapes+=`<rect x="14" y="73" width="77" height="42" rx="13" fill="#e1e7d8"/><text x="52" y="99" text-anchor="middle">记忆</text><rect x="171" y="73" width="77" height="42" rx="13" fill="#dce7ed"/><text x="210" y="99" text-anchor="middle">反馈</text>`+circle(132,92,18,'g');
 }else if(kind==='multimodal'){
  for(let i=0;i<3;i++){shapes+=line(62,35+i*54,146,90);shapes+=`<rect x="28" y="${19+i*54}" width="49" height="32" rx="6" fill="${['#dce8ed','#e4e7d4','#ebe0cf'][i]}" stroke="#b6c6c1"/>`;shapes+=`<path d="M38 ${29+i*54}h29m-29 7h19m-19 7h24" stroke="#a6b4ae" fill="none"/>`;}
  shapes+=circle(151,90,24,'b');shapes+=line(175,90,218,90)+circle(226,90,12,'s');
 }else if(kind==='representation'){
  for(let i=0;i<26;i++)shapes+=circle(25+i*19%82,38+i*31%113,2.8,i%3?'b':'g');shapes+='<path d="M117 94h37m-7-6 7 6-7 6" fill="none" stroke="#bba379"/>';for(let i=0;i<18;i++){const k=i%3;shapes+=circle(181+k*23+(i*7%14),47+k*30+(i*11%24),3.5,['b','s','g'][k]);}
 }else{
  shapes=`<circle cx="132" cy="91" r="64" fill="none" stroke="#bac7b6" stroke-dasharray="3 8"/>`;
  for(let i=0;i<6;i++){let a=i*Math.PI/3;shapes+=line(132,91,132+55*Math.cos(a),91+55*Math.sin(a));shapes+=circle(132+55*Math.cos(a),91+55*Math.sin(a),9,i%2?'s':'b');}shapes+=circle(132,91,22,'g');
 }
 return `<svg viewBox="0 0 264 186" aria-hidden="true"><defs>${[['b','#c1d9e7','#8caebe'],['s','#e1e8c9','#a5b694'],['g','#f2e2bb','#cbb283']].map(([k,a,b])=>`<radialGradient id="${id}-${k}" cx="30%" cy="22%" r="80%"><stop stop-color="#fffef9"/><stop offset=".35" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`).join('')}</defs><ellipse cx="133" cy="171" rx="79" ry="5" fill="#aebdac" opacity=".11"/>${shapes}</svg>`;
}
function orbitArt(){
 const paths=['M-20 75C120-65 245 195 422 139S630 28 813 122 1080 90 1260 14','M-20 175C148 278 254 79 425 144S664 255 851 145 1121 245 1255 80','M-30 104C179 24 262 256 496 191S723-20 929 78 1201 169 1250 25'];
 return `<svg class="ml-streams" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="stream-blue"><stop stop-color="#b1d6e5" stop-opacity=".05"/><stop offset=".5" stop-color="#add2e1" stop-opacity=".38"/><stop offset="1" stop-color="#e1e6cf" stop-opacity=".1"/></linearGradient><linearGradient id="stream-sage"><stop stop-color="#e8e5d2" stop-opacity=".1"/><stop offset=".6" stop-color="#c6d6ae" stop-opacity=".35"/><stop offset="1" stop-color="#bbdce2" stop-opacity=".12"/></linearGradient></defs>${paths.map((d,i)=>`<path d="${d}" fill="none" stroke="url(#stream-${i%2?'sage':'blue'})" stroke-width="${17+i*7}"/><path id="ml-path-${i}" d="${d}" fill="none" stroke="${i%2?'#c2cdad':'#bdd8df'}" stroke-width=".8" opacity=".65"/>`).join('')}${Array.from({length:18},(_,i)=>`<circle r="${i%3===0?2:1.2}" fill="#c3a373" opacity=".65"><animateMotion dur="${28+i%5*7}s" begin="-${i*4}s" repeatCount="indefinite"><mpath href="#ml-path-${i%3}"/></animateMotion></circle>`).join('')}</svg>`;
}
export function initMachineLearning(root,onHome){
 let selected='all',search='',order='newest',expanded=false,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
 root.innerHTML=`<section class="ml-hero" aria-labelledby="ml-title"><h1 id="ml-title" class="sr-only">机器学习</h1>
 <div class="ml-constellation"><div class="ml-stream-container">${orbitArt()}</div><div class="ml-nodes" aria-label="选择机器学习研究主题">${themes.map(t=>`<button type="button" class="ml-node ${t.color}" data-theme="${t.id}" style="--x:${t.x}%;--y:${t.y}%" aria-pressed="false"><span class="ml-pearl" aria-hidden="true"></span><span class="ml-node-label"><strong>${t.zh}</strong><span lang="en">${t.en}</span></span><span class="ml-node-hint">${t.hint}</span></button>`).join('')}</div></div>
 <div class="ml-earth"><img src="./assets/ml/south-china.svg" alt="华南海岸线示意：广西与广东沿海、雷州半岛、琼州海峡及海南岛" width="1440" height="440" fetchpriority="high"><div class="ml-earth-caption"><span></span>华南 · SOUTH CHINA<span></span></div></div>
 <div class="ml-hero-bottom"><span>点亮一个研究节点，探索相关论文 <span aria-hidden="true">↓</span></span><button type="button" id="ml-motion" aria-pressed="${paused}"></button></div>
 </section>
 <section class="ml-publications" id="ml-publications" aria-labelledby="ml-papers-title" tabindex="-1">
 <header class="ml-papers-heading"><h2 id="ml-papers-title">论文与研究</h2><p>PAPERS & IDEAS</p><span class="ml-gold-line"></span></header>
 <div class="ml-filters" aria-label="论文主题筛选"><button type="button" data-filter="all" aria-pressed="true">全部</button>${themes.map(t=>`<button type="button" data-filter="${t.id}" aria-pressed="false">${t.short}</button>`).join('')}</div>
 <div class="ml-tools"><p id="ml-results" role="status" aria-live="polite"></p><div class="ml-search-tools"><label class="ml-search"><span aria-hidden="true">⌕</span><span class="sr-only">搜索论文标题、作者或关键词</span><input type="search" id="ml-search" placeholder="搜索论文、作者、关键词" autocomplete="off"></label><label class="ml-sort"><span class="sr-only">论文排序</span><select id="ml-sort"><option value="newest">最新在前</option><option value="oldest">最早在前</option></select></label></div></div>
 <div id="ml-paper-list"></div><div class="ml-empty" hidden><p>没有找到相关论文</p><button type="button" id="ml-reset" class="text-button">清除筛选与搜索 ↗</button></div><div class="ml-more"><button id="ml-show-more" type="button">展开全部论文 <span>↓</span></button></div>
 <footer class="ml-paper-footer"><p>同一篇论文可关联多个研究主题。插图为方法概念示意。</p><a href="./data/machine-learning.bib" download>下载全部 BibTeX ↓</a></footer>
 </section><div class="ml-end"><button type="button" data-ml-home>← 返回地球，继续探索</button><span>以好奇为引力，以科学为航向。</span><a href="mailto:tingshu@szu.edu.cn">交流与合作 ↗</a></div>
 <dialog id="ml-citation-dialog" aria-labelledby="ml-citation-title"><button type="button" class="ml-close" aria-label="关闭引用">×</button><p class="eyebrow">CITE THIS WORK</p><h2 id="ml-citation-title">引用这篇论文</h2><p id="ml-citation-paper"></p><label for="ml-citation-text" class="sr-only">BibTeX 引用文本</label><textarea id="ml-citation-text" readonly spellcheck="false"></textarea><div class="ml-citation-actions"><button type="button" id="ml-copy">复制 BibTeX</button><a id="ml-download-citation">下载 .bib ↓</a><span id="ml-copy-status" role="status"></span></div></dialog>`;
 const q=s=>root.querySelector(s),list=q('#ml-paper-list'),status=q('#ml-results'),dialog=q('#ml-citation-dialog');
 let citationUrl;
 function updateMotion(){q('#ml-motion').textContent=paused?'▷ 继续流动':'Ⅱ 暂停流动';q('#ml-motion').setAttribute('aria-pressed',String(paused));root.classList.toggle('ml-paused',paused||!active||!heroVisible||document.hidden);const svg=q('.ml-streams');if(paused||!active||!heroVisible||document.hidden)svg.pauseAnimations?.();else svg.unpauseAnimations?.();}
 let active=false,heroVisible=true;
 new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;updateMotion();}).observe(q('.ml-hero'));
 q('#ml-motion').addEventListener('click',()=>{paused=!paused;updateMotion();});motionQuery.addEventListener('change',e=>{paused=e.matches;updateMotion();});document.addEventListener('visibilitychange',updateMotion);updateMotion();
 function render(){
  const needle=search.trim().toLocaleLowerCase();
  let filtered=papers.filter(p=>(selected==='all'||p.topics.includes(selected))&&(!needle||[p.title,p.zh,p.summary,p.authors,p.venue,String(p.year),...p.topics.map(t=>themeById(t).zh+' '+themeById(t).en)].join(' ').toLocaleLowerCase().includes(needle)));
  filtered=filtered.slice().sort((a,b)=>order==='newest'?b.year-a.year:a.year-b.year);
  const shown=expanded?filtered:filtered.slice(0,8);
  status.textContent=`${selected==='all'?'全部研究':themeById(selected).zh} · ${filtered.length} 项工作${filtered.length>shown.length?`，当前展示 ${shown.length} 项`:''}`;
  list.innerHTML=shown.map(p=>`<article class="ml-paper" id="paper-${p.id}"><div class="ml-diagram">${diagram(p)}</div><div class="ml-paper-body"><div class="ml-paper-meta"><time>${p.year}</time><span>·</span><span>${esc(p.venue)}</span>${p.preprint?'<span class="ml-preprint">预印本</span>':''}</div><h3>${esc(p.zh)}</h3><p class="ml-paper-english" lang="en">${esc(p.title)}</p><p class="ml-paper-summary">${esc(p.summary)}</p><div class="ml-paper-tags">${p.topics.map(t=>`<button type="button" data-tag="${t}" aria-label="筛选${themeById(t).zh}">${themeById(t).zh}</button>`).join('')}</div><details class="ml-paper-details"><summary>作者与出版信息</summary><p>${esc(p.authors).replace(/Ting Shu/g,'<strong>Ting Shu</strong>')}</p>${p.versionNote?`<p>${esc(p.versionNote)}</p>`:''}<p>${esc(p.venue)} · ${p.year}${p.preprint?' · 预印本':''}</p></details></div><div class="ml-paper-actions"><a href="${esc(p.url||'https://scholar.google.com/scholar?q='+encodeURIComponent(p.title))}" target="_blank" rel="noopener noreferrer" aria-label="${esc(p.url?'查看论文：':'在 Google Scholar 检索：')+esc(p.title)}">${p.url?(p.linkLabel||'论文 ↗'):'检索论文 ↗'}</a><button type="button" data-cite="${p.id}" aria-label="获取 ${esc(p.title)} 的 BibTeX">BibTeX</button></div></article>`).join('');
  q('.ml-empty').hidden=filtered.length>0;q('.ml-more').hidden=shown.length===filtered.length;
  q('#ml-show-more').innerHTML=`展开其余 ${Math.max(0,filtered.length-shown.length)} 项研究 <span>↓</span>`;
  root.querySelectorAll('[data-theme]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.theme===selected)));
  root.querySelectorAll('[data-filter]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.filter===selected)));
 }
 function filter(id,scroll=false){selected=id;expanded=false;render();if(scroll){q('#ml-publications').scrollIntoView({behavior:motionQuery.matches?'instant':'smooth',block:'start'});q('#ml-publications').focus({preventScroll:true});}}
 root.addEventListener('click',e=>{const target=e.target.closest('button');if(!target)return;if(target.hasAttribute('data-ml-home'))onHome();else if(target.dataset.theme)filter(target.dataset.theme,true);else if(target.dataset.filter)filter(target.dataset.filter);else if(target.dataset.tag)filter(target.dataset.tag,true);else if(target.dataset.cite){const p=papers.find(p=>p.id===target.dataset.cite);q('#ml-citation-paper').textContent=p.title;q('#ml-citation-text').value=p.bibtex;q('#ml-copy-status').textContent='';if(citationUrl)URL.revokeObjectURL(citationUrl);citationUrl=URL.createObjectURL(new Blob([p.bibtex+'\n'],{type:'application/x-bibtex'}));q('#ml-download-citation').href=citationUrl;q('#ml-download-citation').download=p.id+'.bib';dialog.showModal();}});
 q('#ml-search').addEventListener('input',e=>{search=e.target.value;expanded=false;render();});q('#ml-sort').addEventListener('change',e=>{order=e.target.value;render();});q('#ml-reset').addEventListener('click',()=>{search='';q('#ml-search').value='';filter('all');});q('#ml-show-more').addEventListener('click',()=>{const previousCount=list.children.length;expanded=true;render();const next=list.children[previousCount];if(next){next.setAttribute('tabindex','-1');next.focus({preventScroll:true});next.scrollIntoView({behavior:motionQuery.matches?'instant':'smooth',block:'start'});}});
 dialog.querySelector('.ml-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('keydown',e=>{if(e.key==='Escape')e.stopPropagation();});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 q('#ml-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(q('#ml-citation-text').value);q('#ml-copy-status').textContent='已复制';}catch{q('#ml-citation-text').focus();q('#ml-citation-text').select();q('#ml-copy-status').textContent='请复制选中的引用文本';}});
 render();
 return {setActive(value){active=value;updateMotion();if(!value&&dialog.open)dialog.close();},reset(){search='';selected='all';expanded=false;q('#ml-search').value='';render();}};
}
