import {initNews} from './news.js?v=softbook2';
import {initAbout} from './about.js?v=visual-first1';
import {initMachineLearning} from './machine-learning.js?v=visual4';
import {initPrecipitation} from './precipitation.js?v=visual3';
import {initNumericalModeling} from './numerical-modeling.js?v=visual3';
import {initMultimodal} from './multimodal-weather.js?v=visual3';
import {initTeaching} from './teaching.js?v=paper1';
import {initJoin} from './join-maze.js?v=visual-first1';
import {initCollaboration} from './collaboration-network.js?v=islands1';
const topics = [
  {id:'precipitation',title:'降水与临近预报',en:'Precipitation & Nowcasting',short:'PRECIPITATION',color:'#b57c50',description:'从雷达观测中捕捉天气的变化，用时空学习与物理约束探索更准确的降水估计和临近预报，让快速演变的降水过程更可理解。',tags:['雷达回波外推','定量降水估计','物理约束'],papers:[{title:'Physics-Constrained Deep Learning with Adaptive ZR Relationship for Accurate and Interpretable Quantitative Precipitation Estimation',year:'2026',venue:'Remote Sensing'},{title:'TempEE: Temporal–Spatial Parallel Transformer for Radar Echo Extrapolation Beyond Autoregression',year:'2023',venue:'IEEE Transactions on Geoscience and Remote Sensing'}]},
  {id:'clouds',title:'AI与数值模式融合',en:'AI × Numerical Weather Prediction',short:'AI × Numerical Weather Prediction',color:'#789389',description:'连接数据驱动学习与数值天气模式，探索物理知识和人工智能的协同。从云微物理参数化到预报降尺度与偏差订正，研究更准确、可解释的天气模拟与预测方法。',tags:['云微物理参数化','数值天气模式','降尺度与偏差订正'],papers:[{title:'Spatiotemporal Dual-Stream Transformers for Cloud Microphysical Parameterization',year:'2026',venue:'EGUsphere · 预印本'},{title:'Deep learning based cloud microphysics parameterization scheme for numerical weather prediction with 1DD-CNN',year:'2024',venue:'ICAIBD'},{title:'Machine learning-based spatial downscaling and bias-correction framework for high-resolution temperature forecasting',year:'2024',venue:'Applied Intelligence'}]},
  {id:'multimodal',title:'多模态与区域天气预测',en:'Multimodal & Regional Weather Forecasting',short:'MULTIMODAL & REGIONAL WEATHER',color:'#7e8baf',description:'把数值、图像和文本放到同一幅天气图景中，研究多模态模型如何对齐不同来源的信息，帮助理解天气并预测区域天气变化，并开展区域预报 AI 模型研究。',tags:['多模态基础模型','跨模态对齐','区域天气预测'],papers:[{title:'LoRA-Enhanced Cross-Modal Alignment: Adapting Multimodal Foundation Models for Short-Term Regional Weather Forecasting by Fusing Numerical, Image, and Text Modalities',year:'2026',venue:'AIIPCC 2025'},{title:'MASK-CNN-Transformer for real-time multi-label weather recognition',year:'2023',venue:'Knowledge-Based Systems'}]},
  {id:'learning',title:'机器学习',en:'Machine Learning',short:'MACHINE LEARNING',color:'#b78969',description:'围绕数据的异构、不完整与分布差异，研究多视图学习、联邦学习与多模态方法，探索有效的数据表示、信息融合与协同学习。',tags:['多视图学习','联邦学习','表示与聚类'],papers:[{title:'Unified Grassmann Manifold-Based Completion and Alignment for Incomplete Multi-View Clustering',year:'2026',venue:'IEEE Transactions on Consumer Electronics'},{title:'Free lunch for federated remote sensing target fine-grained classification: A parameter-efficient framework',year:'2024',venue:'Knowledge-Based Systems'}]}
];
const $ = id => document.getElementById(id);
const universe = $('universe'), home = $('home'), detail = $('research-page');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let paused = reducedMotion.matches, hovered = -1, busy = false, currentTopic = null, world = null;
let transitionToken = 0, returnFocus = null, teachingActive = false, joinActive = false, collaborationActive = false, aboutActive = false, newsActive = false;
const labels = [], researchButtons = [];
const machineLearning=initMachineLearning($('ml-page'),()=>goHome());
const precipitation=initPrecipitation($('precipitation-page'),()=>goHome());
const numericalModeling=initNumericalModeling($('numerical-page'),()=>goHome());
const multimodal=initMultimodal($('multimodal-page'),()=>goHome());
const teaching=initTeaching($('teaching-page'),()=>goHome());
const joinPage=initJoin($('join-page'),()=>goHome());
const collaborationPage=initCollaboration($('collaboration-page'),()=>goHome());
const aboutPage=initAbout($('about-page'),()=>goHome());
initNews($('news-page'),()=>goHome());
document.getElementById('year').textContent = new Date().getFullYear();
const researchSwitcher=$('research-switcher');
function closeResearchSwitcher(restoreFocus=false){
  researchSwitcher.open=false;
  if(restoreFocus)researchSwitcher.querySelector('summary').focus({preventScroll:true});
}
researchSwitcher.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&researchSwitcher.open){e.preventDefault();e.stopPropagation();closeResearchSwitcher(true);}
});
researchSwitcher.addEventListener('click',e=>{
  if(e.target.closest('a'))closeResearchSwitcher(true);
});
document.addEventListener('pointerdown',e=>{
  if(researchSwitcher.open&&!researchSwitcher.contains(e.target))closeResearchSwitcher();
});
researchSwitcher.addEventListener('focusout',e=>{
  if(e.relatedTarget&&!researchSwitcher.contains(e.relatedTarget))closeResearchSwitcher();
});


topics.forEach((topic,i) => {
  const number = String(i+1).padStart(2,'0');
  const label = document.createElement('button');
  label.type='button'; label.className='satellite-label'; label.style.setProperty('--accent',topic.color);
  label.innerHTML=`<span class="label-number">${number}</span><span>${topic.title}</span><span class="label-arrow">↗</span>`;
  label.setAttribute('aria-label',`乘坐 ${number} 号卫星，探索${topic.title}`);
  label.addEventListener('click',()=>launch(i));
  label.addEventListener('pointerenter',()=>setHovered(i));
  label.addEventListener('pointerleave',()=>setHovered(-1));
  label.addEventListener('focus',()=>setHovered(i));
  label.addEventListener('blur',()=>setHovered(-1));
  $('satellite-labels').append(label); labels.push(label);
  const link=document.createElement('button'); link.type='button'; link.className='research-link'; link.style.setProperty('--accent',topic.color);
  link.innerHTML=`<span class="research-number">${number}</span><span><strong>${topic.title}</strong><small>${topic.short}</small></span><span class="arrow">↗</span>`;
  link.addEventListener('click',()=>launch(i));
  link.addEventListener('pointerenter',()=>setHovered(i)); link.addEventListener('pointerleave',()=>setHovered(-1));
  link.addEventListener('focus',()=>setHovered(i)); link.addEventListener('blur',()=>setHovered(-1));
  $('research-links').append(link); researchButtons.push(link);
});

function setHovered(i){hovered=i;labels.forEach((label,n)=>label.classList.toggle('is-active',i===n));}
function updateMotion(){
  const button=$('motion-toggle');button.setAttribute('aria-pressed',String(paused));
  button.setAttribute('aria-label',paused?'继续地球自转与卫星公转':'暂停地球自转与卫星公转');
  button.querySelector('.pause-symbol').textContent=paused?'▷':'Ⅱ';
  button.querySelector('.motion-text').textContent=paused?'继续运行':'暂停运行';
}
$('motion-toggle').addEventListener('click',()=>{paused=!paused;updateMotion();});updateMotion();
reducedMotion.addEventListener('change',e=>{paused=e.matches;updateMotion();});
document.querySelector('.identity').addEventListener('click',e=>{e.preventDefault();goHome();});
document.querySelectorAll('a[href="#research-list"]').forEach(a=>a.addEventListener('click',e=>{
  e.preventDefault();if(currentTopic!==null||busy||teachingActive||joinActive||collaborationActive||aboutActive||newsActive)goHome(false);$('research-list').scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'center'});researchButtons[0].focus({preventScroll:true});
}));
const personalSections=['news','about','teaching','collaboration','join'];
function openSection(id,updateHistory=true,smooth=true){
  if(!personalSections.includes(id))return;
  if(id==='news'){openNews(updateHistory);return;}
  if(id==='about'){openAbout(updateHistory);return;}
  if(id==='teaching'){openTeaching(updateHistory);return;}
  if(id==='join'){openJoin(updateHistory);return;}
  if(id==='collaboration'){openCollaboration(updateHistory);return;}
  if(currentTopic!==null||busy||teachingActive||joinActive||collaborationActive||aboutActive||newsActive)goHome(false,false);
  if(updateHistory&&location.hash!==`#${id}`)history.pushState({},'',`#${id}`);
  document.querySelectorAll('[data-section-link]').forEach(link=>{if(link.hash===`#${id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  const section=$(id);section.scrollIntoView({behavior:smooth&&!reducedMotion.matches?'smooth':'instant',block:'start'});section.focus({preventScroll:true});
}
function openNews(updateHistory=true){
  goHome(false,false);newsActive=true;home.hidden=true;$('news-page').hidden=false;
  if(updateHistory&&location.hash!=='#news')history.pushState({},'','#news');
  document.querySelectorAll('[data-section-link]').forEach(link=>{if(link.hash==='#news')link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  document.title='团队动态 · 舒婷 Ting Shu';window.scrollTo({top:0,behavior:'instant'});$('news-page').focus({preventScroll:true});$('announcement').textContent='已进入团队手帐，切换年份和季度，查看红圈日期连接的手写动态。';
}
function openAbout(updateHistory=true){
  goHome(false,false);aboutActive=true;home.hidden=true;$('about-page').hidden=false;aboutPage.setActive(true);
  if(updateHistory&&location.hash!=='#about')history.pushState({},'','#about');
  document.querySelectorAll('[data-section-link]').forEach(link=>{if(link.hash==='#about')link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  document.title='关于我 · 舒婷 Ting Shu';window.scrollTo({top:0,behavior:'instant'});$('about-page').focus({preventScroll:true});$('announcement').textContent='已进入关于我，转动多面体认识不同的我。';
}
function openTeaching(updateHistory=true){
  goHome(false,false);teachingActive=true;home.hidden=true;$('teaching-page').hidden=false;teaching.setActive(true);
  if(updateHistory&&location.hash!=='#teaching')history.pushState({},'','#teaching');
  document.querySelectorAll('[data-section-link]').forEach(link=>{if(link.hash==='#teaching')link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  document.title='教学 · 舒婷 Ting Shu';window.scrollTo({top:0,behavior:'instant'});$('teaching-page').focus({preventScroll:true});$('announcement').textContent='已进入教学电路板，点击元件查看课程。';
}
function openJoin(updateHistory=true){
  goHome(false,false);joinActive=true;home.hidden=true;$('join-page').hidden=false;joinPage.setActive(true);
  if(updateHistory&&location.hash!=='#join')history.pushState({},'','#join');
  document.querySelectorAll('[data-section-link]').forEach(link=>{if(link.hash==='#join')link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  document.title='加入我们 · 舒婷 Ting Shu';window.scrollTo({top:0,behavior:'instant'});$('join-page').focus({preventScroll:true});$('announcement').textContent='已进入加入我们页面，沿着迷宫路标探索，或直接联系。';
}
function openCollaboration(updateHistory=true){
  goHome(false,false);collaborationActive=true;home.hidden=true;$('collaboration-page').hidden=false;collaborationPage.setActive(true);
  if(updateHistory&&location.hash!=='#collaboration')history.pushState({},'','#collaboration');
  document.querySelectorAll('[data-section-link]').forEach(link=>{if(link.hash==='#collaboration')link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  document.title='合作网络 · 舒婷 Ting Shu';window.scrollTo({top:0,behavior:'instant'});$('collaboration-page').focus({preventScroll:true});$('announcement').textContent='已进入合作网络，点击小岛查看合作单位名单。';
}
document.querySelectorAll('[data-section-link]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();openSection(link.hash.slice(1));if(link.dataset.courseIndex!==undefined)teaching.selectCourse(Number(link.dataset.courseIndex));}));
document.querySelectorAll('[data-email]').forEach(link=>{
  const join=link.dataset.email==='join';
  const subject=join?'研究学习交流｜姓名｜感兴趣的方向':'合作交流｜研究主题';
  const body=join?'舒老师您好，\n\n我的姓名与背景：\n感兴趣的研究方向：\n相关课程或项目经历：\n代码或作品链接（如有）：\n\n附件：个人简历\n':'舒老师您好，\n\n我的姓名与单位：\n希望交流的研究问题：\n可能的合作切入点：\n相关工作或资料链接：\n';
  link.href=`mailto:tingshu@szu.edu.cn?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
$('back-home').addEventListener('click',()=>goHome());
$('next-research').addEventListener('click',()=>{const next=(currentTopic+1)%topics.length;goHome(false);launch(next);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(busy||currentTopic!==null||teachingActive||joinActive||collaborationActive||aboutActive||newsActive))goHome();});

function fillTopic(i){
  closeResearchSwitcher();
  newsActive=false;$('news-page').hidden=true;
  aboutActive=false;$('about-page').hidden=true;aboutPage.setActive(false);
  collaborationActive=false;$('collaboration-page').hidden=true;collaborationPage.setActive(false);
  joinActive=false;$('join-page').hidden=true;joinPage.setActive(false);
  teachingActive=false;$('teaching-page').hidden=true;teaching.setActive(false);
  document.querySelectorAll('[data-section-link]').forEach(link=>link.removeAttribute('aria-current'));
  const topic=topics[i];currentTopic=i;
  $('research-cloud-current').textContent=topic.title;
  researchSwitcher.querySelector('summary').setAttribute('aria-label',`当前方向：${topic.title}，查看其他方向`);
  document.querySelector('.nav-research').setAttribute('aria-current','location');
  document.querySelectorAll('.research-subnav a').forEach(link=>{
    if(link.hash===`#research/${topic.id}`)link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  const isLearning=topic.id==='learning',isPrecipitation=topic.id==='precipitation',isNumerical=topic.id==='clouds',isMultimodal=topic.id==='multimodal';
  detail.classList.toggle('is-learning',isLearning);$('ml-page').hidden=!isLearning;machineLearning.setActive(isLearning);
  detail.classList.toggle('is-precipitation',isPrecipitation);$('precipitation-page').hidden=!isPrecipitation;precipitation.setActive(isPrecipitation);
  detail.classList.toggle('is-numerical',isNumerical);$('numerical-page').hidden=!isNumerical;numericalModeling.setActive(isNumerical);
  detail.classList.toggle('is-multimodal',isMultimodal);$('multimodal-page').hidden=!isMultimodal;multimodal.setActive(isMultimodal);
  if(isLearning){document.title='机器学习 · 舒婷 Ting Shu';return;}
  if(isPrecipitation){document.title='降水与临近预报 · 舒婷 Ting Shu';return;}
  if(isNumerical){document.title='AI与数值模式融合 · 舒婷 Ting Shu';return;}
  if(isMultimodal){document.title='多模态与区域天气预测 · 舒婷 Ting Shu';return;}
  $('destination-number').textContent=`RESEARCH ORBIT / ${String(i+1).padStart(2,'0')}`;
  $('destination-title').textContent=topic.title;$('destination-english').textContent=topic.en;
  $('destination-description').textContent=topic.description;
  $('topic-tags').replaceChildren(...topic.tags.map(text=>{const s=document.createElement('span');s.textContent=text;return s;}));
  $('paper-list').replaceChildren(...topic.papers.map(paper=>{
    const row=document.createElement('article');row.className='paper-row';
    const year=document.createElement('span');year.className='paper-year';year.textContent=paper.year;
    const text=document.createElement('div'),title=document.createElement('h3'),venue=document.createElement('span');
    title.className='paper-title';title.textContent=paper.title;venue.className='paper-venue';venue.textContent=paper.venue;text.append(title,venue);
    const link=document.createElement('a');link.className='paper-link';link.textContent='检索论文 ↗';link.href='https://scholar.google.com/scholar?q='+encodeURIComponent(paper.title);link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',`在 Google Scholar 检索：${paper.title}`);
    row.append(year,text,link);return row;
  }));
  document.title=`${topic.title} · 舒婷 Ting Shu`;
}
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function launch(i){
  if(busy||currentTopic!==null)return;
  busy=true;const token=++transitionToken;returnFocus=document.activeElement;
  home.classList.add('is-traveling');universe.dataset.state='traveling';
  document.querySelector('.hero').scrollIntoView({behavior:'instant',block:'start'});
  $('flight-text').textContent=`正在着陆 · ${topics[i].title}`;
  $('announcement').textContent=`正在前往${topics[i].title}。按 Escape 可返回。`;
  const overlay=$('flight-overlay');overlay.classList.add('active');
  if(world&&!reducedMotion.matches)world.startFlight(i);
  await sleep(reducedMotion.matches?0:950);if(token!==transitionToken)return;
  overlay.classList.add('covered');
  await sleep(reducedMotion.matches?60:850);if(token!==transitionToken)return;
  fillTopic(i);home.hidden=true;detail.hidden=false;world?.stopFlight();
  history.pushState({topic:i},'',`#research/${topics[i].id}`);window.scrollTo(0,0);
  await sleep(reducedMotion.matches?0:250);if(token!==transitionToken)return;
  overlay.classList.remove('covered');
  await sleep(reducedMotion.matches?0:750);if(token!==transitionToken)return;
  overlay.classList.remove('active');home.classList.remove('is-traveling');busy=false;
  universe.dataset.state=world?'ready':'fallback';detail.focus({preventScroll:true});$('announcement').textContent=`已进入${topics[i].title}`;
}
function goHome(focus=true,replace=true){
  closeResearchSwitcher();
  newsActive=false;$('news-page').hidden=true;
  aboutActive=false;$('about-page').hidden=true;aboutPage.setActive(false);
  collaborationActive=false;$('collaboration-page').hidden=true;collaborationPage.setActive(false);
  joinActive=false;$('join-page').hidden=true;joinPage.setActive(false);
  teachingActive=false;$('teaching-page').hidden=true;teaching.setActive(false);
  ++transitionToken;busy=false;currentTopic=null;detail.hidden=true;home.hidden=false;machineLearning.setActive(false);precipitation.setActive(false);numericalModeling.setActive(false);multimodal.setActive(false);
  $('flight-overlay').classList.remove('active','covered');home.classList.remove('is-traveling');setHovered(-1);
  world?.reset();universe.dataset.state=world?'ready':'fallback';$('announcement').textContent='已返回地球与研究轨道。';
  document.querySelectorAll('[data-section-link]').forEach(link=>link.removeAttribute('aria-current'));
  document.querySelector('.nav-research').removeAttribute('aria-current');
  document.title='舒婷 Ting Shu · AI × Weather';if(replace)history.pushState({},'',location.pathname+location.search);
  if(focus){window.scrollTo({top:0,behavior:'instant'});(returnFocus?.isConnected?returnFocus:document.querySelector('.identity')).focus({preventScroll:true});}
}
function readRoute(){const section=location.hash.slice(1);if(personalSections.includes(section)){openSection(section,false,false);return;}const match=location.hash.match(/^#research\/([a-z]+)$/);const i=match?topics.findIndex(t=>t.id===match[1]):-1;if(i>=0){++transitionToken;busy=false;$('flight-overlay').classList.remove('active','covered');fillTopic(i);home.hidden=true;detail.hidden=false;world?.stopFlight();window.scrollTo({top:0,behavior:'instant'});$('announcement').textContent=`已进入${topics[i].title}`;}else if(currentTopic!==null||busy||teachingActive||joinActive||collaborationActive||aboutActive||newsActive)goHome(false,false);}
window.addEventListener('popstate',readRoute);window.addEventListener('hashchange',readRoute);readRoute();

function fallback(message){
  $('scene-loading').hidden=true;universe.classList.add('is-fallback');universe.querySelector('.fallback-planet').hidden=false;
  universe.dataset.state='fallback';$('scene-hint').textContent=message||'点击研究方向，开始探索';$('motion-toggle').hidden=true;
}

async function initScene(){
  const THREE=await import('./vendor/three.module.min.js');
  const mount=$('scene');const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(40,1,.1,80);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;mount.appendChild(renderer.domElement);
  const ambient=new THREE.HemisphereLight(0xfffcf1,0x768d82,2.5);scene.add(ambient);
  const sun=new THREE.DirectionalLight(0xfff7e7,3.1);sun.position.set(-4,6,6);scene.add(sun);
  const rim=new THREE.DirectionalLight(0xa9d8df,1.1);rim.position.set(4,1,-3);scene.add(rim);
  const planet=new THREE.Group();planet.rotation.z=-.13;scene.add(planet);
  const globe=new THREE.Group();globe.rotation.y=-3.4;planet.add(globe);
  const ocean=new THREE.MeshStandardMaterial({color:0x88bfc9,roughness:.88,metalness:0});
  const earth=new THREE.Mesh(new THREE.SphereGeometry(1.7,96,64),ocean);globe.add(earth);
  const textureCanvas=document.createElement('canvas');textureCanvas.width=2048;textureCanvas.height=1024;
  const ctx=textureCanvas.getContext('2d');ctx.fillStyle='#83bac9';ctx.fillRect(0,0,2048,1024);
  try{
    const response=await fetch('./data/land.geojson');if(!response.ok)throw new Error('Land data unavailable');const data=await response.json();
    ctx.fillStyle='#c2d3a1';
    for(const feature of data.features){
      const polygons=feature.geometry.type==='MultiPolygon'?feature.geometry.coordinates:[feature.geometry.coordinates];
      for(const polygon of polygons){ctx.beginPath();for(const ring of polygon){ring.forEach(([lon,lat],i)=>{const x=(lon+180)/360*2048,y=(90-lat)/180*1024;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.closePath();}ctx.fill('evenodd');}
    }
    ctx.strokeStyle='rgba(246,249,232,.13)';ctx.lineWidth=1;
    for(let lon=0;lon<=360;lon+=30){ctx.beginPath();ctx.moveTo(lon/360*2048,0);ctx.lineTo(lon/360*2048,1024);ctx.stroke();}
    for(let lat=30;lat<180;lat+=30){ctx.beginPath();ctx.moveTo(0,lat/180*1024);ctx.lineTo(2048,lat/180*1024);ctx.stroke();}
    const texture=new THREE.CanvasTexture(textureCanvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    ocean.map=texture;ocean.color.set(0xffffff);ocean.needsUpdate=true;
  }catch(error){console.warn('Land outlines unavailable; using ocean globe.',error);}

  const air=new THREE.Mesh(new THREE.SphereGeometry(1.76,64,48),new THREE.ShaderMaterial({uniforms:{airColor:{value:new THREE.Color('#a9d3d2')}},vertexShader:'varying vec3 vNormal; varying vec3 vView; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.0);vNormal=normalize(normalMatrix*normal);vView=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',fragmentShader:'uniform vec3 airColor;varying vec3 vNormal;varying vec3 vView;void main(){float f=pow(1.0-max(dot(normalize(vNormal),normalize(vView)),0.0),3.0);gl_FragColor=vec4(airColor,f*0.19);}',transparent:true,depthWrite:false}));planet.add(air);
  const cloudMaterial=new THREE.MeshStandardMaterial({color:0xfffdf0,roughness:1});
  const clouds=new THREE.Group();globe.add(clouds);
  function spherical(lon,lat,r){const a=lon*Math.PI/180,b=lat*Math.PI/180;return new THREE.Vector3(r*Math.cos(b)*Math.cos(a),r*Math.sin(b),r*Math.cos(b)*Math.sin(a));}
  const cloudLocations=[[-25,38,.85],[47,6,.65],[110,45,1],[165,-22,.8],[-100,-36,.9],[-135,26,.6],[20,-55,.8],[81,-28,.7]];
  for(const [lon,lat,scale] of cloudLocations){const cloud=new THREE.Group();cloud.position.copy(spherical(lon,lat,1.73));cloud.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),cloud.position.clone().normalize());
    [[-.14,0,.14],[0,.025,.19],[.15,0,.13],[.035,-.05,.14]].forEach(([x,y,size])=>{const puff=new THREE.Mesh(new THREE.SphereGeometry(size,16,12),cloudMaterial);puff.position.set(x,y,.025);puff.scale.set(1,.6,.48);cloud.add(puff);});cloud.scale.setScalar(scale);clouds.add(cloud);}

  // The inclined orbit is a genuine 3D curve. The planet naturally occludes its far side.
  function orbitPoint(angle,radius=1){const x=3.13*Math.cos(angle)*radius,y=2.35*Math.sin(angle)*radius,z=1.6*Math.sin(angle)*radius;const tilt=-.27;return new THREE.Vector3(x*Math.cos(tilt)-y*Math.sin(tilt),x*Math.sin(tilt)+y*Math.cos(tilt),z);}
  const orbitCurve=new THREE.CatmullRomCurve3(Array.from({length:128},(_,i)=>orbitPoint(i/128*Math.PI*2)),true);
  const orbit=new THREE.Mesh(new THREE.TubeGeometry(orbitCurve,180,.008,5,true),new THREE.MeshBasicMaterial({color:0xb6bc9e,transparent:true,opacity:.75}));scene.add(orbit);
  const trailCurve=new THREE.CatmullRomCurve3(Array.from({length:65},(_,i)=>orbitPoint(i/64*Math.PI*2,1.08)),true);
  const points=trailCurve.getPoints(160);const dots=new THREE.Points(new THREE.BufferGeometry().setFromPoints(points),new THREE.PointsMaterial({color:0xbdc4b3,size:.021,sizeAttenuation:true,transparent:true,opacity:.55}));scene.add(dots);

  const gold=new THREE.MeshStandardMaterial({color:0xe2b665,roughness:.55,metalness:.18});
  const silver=new THREE.MeshStandardMaterial({color:0xf1eede,roughness:.65,metalness:.1});
  const panelFrame=new THREE.MeshStandardMaterial({color:0x8b9b99,roughness:.6,metalness:.2});
  const panelCanvas=document.createElement('canvas');panelCanvas.width=256;panelCanvas.height=160;
  const pc=panelCanvas.getContext('2d');pc.fillStyle='#3c6278';pc.fillRect(0,0,256,160);pc.strokeStyle='#9eb4bc';pc.lineWidth=2;
  for(let x=0;x<=256;x+=43){pc.beginPath();pc.moveTo(x,0);pc.lineTo(x,160);pc.stroke();}for(let y=0;y<=160;y+=40){pc.beginPath();pc.moveTo(0,y);pc.lineTo(256,y);pc.stroke();}
  const panelTexture=new THREE.CanvasTexture(panelCanvas);panelTexture.colorSpace=THREE.SRGBColorSpace;
  const bluePanel=new THREE.MeshStandardMaterial({map:panelTexture,roughness:.65,metalness:.15});
  function box(w,h,d,material,x=0,y=0,z=0){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);return mesh;}
  function buildSatellite(i){
    const sat=new THREE.Group();sat.add(box(.3,.32,.29,gold));sat.add(box(.32,.06,.31,silver,0,.18));sat.add(box(.32,.06,.31,silver,0,-.18));
    const band=box(.305,.035,.3,new THREE.MeshStandardMaterial({color:topics[i].color,roughness:.7}));sat.add(band);
    for(const side of [-1,1]){sat.add(box(.2,.035,.035,silver,side*.25,0));sat.add(box(.44,.32,.045,panelFrame,side*.56,0));sat.add(box(.405,.286,.012,bluePanel,side*.56,0,.03));sat.add(box(.405,.286,.012,bluePanel,side*.56,0,-.03));}
    const neck=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.2,8),silver);neck.position.y=.3;sat.add(neck);
    const dish=new THREE.Mesh(new THREE.SphereGeometry(.145,20,12,0,Math.PI*2,0,Math.PI*.42),silver);dish.rotation.z=Math.PI;dish.position.y=.41;sat.add(dish);
    const tip=new THREE.Mesh(new THREE.SphereGeometry(.028,10,8),gold);tip.position.y=.43;sat.add(tip);
    const sensor=new THREE.Mesh(new THREE.CylinderGeometry(.055,.07,.075,14),bluePanel);sensor.rotation.x=Math.PI/2;sensor.position.z=.185;sat.add(sensor);
    sat.scale.setScalar(.77);sat.userData.topic=i;sat.traverse(obj=>{obj.userData.topic=i;});return sat;
  }
  const satellites=topics.map((_,i)=>{const satellite=buildSatellite(i);scene.add(satellite);return satellite;});
  const focusHalo=new THREE.Mesh(new THREE.TorusGeometry(.6,.012,8,64),new THREE.MeshBasicMaterial({color:0xd4a269,transparent:true,opacity:.7,depthTest:false}));focusHalo.visible=false;scene.add(focusHalo);
  let width=0,height=0,orbitTime=.32,lastTime=0,dragging=false,pointerStart=null,dragTotal=0,flight=null,dragVelocity=0;
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),basePosition=new THREE.Vector3();
  const lookTarget=new THREE.Vector3(0,0,0);let aspect=1;
  function resize(){width=mount.clientWidth;height=mount.clientHeight;if(!width||!height)return;aspect=width/height;camera.aspect=aspect;
    const distance=Math.max(9.2,8.0/(2*Math.tan(THREE.MathUtils.degToRad(20))*aspect));basePosition.set(0,.7,distance);if(!flight)camera.position.copy(basePosition);camera.lookAt(lookTarget);camera.updateProjectionMatrix();renderer.setSize(width,height);}
  const observer=new ResizeObserver(resize);observer.observe(mount);resize();
  let sceneInView=true;
  const visibilityObserver=new IntersectionObserver(entries=>{sceneInView=entries[0].isIntersecting;});visibilityObserver.observe(mount);
  function getHit(e){const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects([...satellites,earth],true);if(!hits.length)return -1;return hits[0].object.userData.topic??-1;}
  mount.addEventListener('pointerdown',e=>{if(busy||currentTopic!==null||e.button!==0)return;pointerStart={x:e.clientX,y:e.clientY,hit:getHit(e)};dragTotal=0;dragging=true;mount.setPointerCapture(e.pointerId);});
  mount.addEventListener('pointermove',e=>{if(busy)return;if(dragging&&pointerStart){const dx=e.clientX-pointerStart.x,dy=e.clientY-pointerStart.y;dragTotal+=Math.abs(dx)+Math.abs(dy);if(Math.abs(dx)>0){globe.rotation.y+=dx*.007;dragVelocity=dx*.0007;}planet.rotation.x=THREE.MathUtils.clamp(planet.rotation.x+dy*.002,-.4,.4);pointerStart.x=e.clientX;pointerStart.y=e.clientY;}else{const hit=getHit(e);setHovered(hit);mount.style.cursor=hit>=0?'pointer':'grab';}});
  mount.addEventListener('pointerup',e=>{const hit=pointerStart?.hit;dragging=false;pointerStart=null;if(mount.hasPointerCapture(e.pointerId))mount.releasePointerCapture(e.pointerId);if(dragTotal<9&&hit>=0)launch(hit);});
  mount.addEventListener('pointercancel',()=>{dragging=false;pointerStart=null;});mount.addEventListener('pointerleave',()=>{if(!dragging)setHovered(-1);});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback('3D 暂时不可用，请点击研究方向继续');});
  renderer.domElement.addEventListener('webglcontextrestored',()=>location.reload());
  const projected=new THREE.Vector3();
  function positionLabels(){
    for(let i=0;i<satellites.length;i++){
      const sat=satellites[i];projected.copy(sat.position);projected.y-=.38;projected.project(camera);
      const label=labels[i],lw=label.offsetWidth||150,lh=label.offsetHeight||32;
      let x=(projected.x*.5+.5)*width-lw/2,y=(-projected.y*.5+.5)*height;
      x=Math.max(8,Math.min(width-lw-8,x));y=Math.max(55,Math.min(height-86-lh,y));
      label.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
    }
  }
  function smooth(t){return t*t*(3-2*t);}
  function frame(time){
    const dt=Math.min((time-lastTime)/1000||0,.05);lastTime=time;
    if(document.hidden||home.hidden||!sceneInView)return;
    if(!paused&&!busy&&!dragging){if(hovered<0)orbitTime+=dt*.045;globe.rotation.y+=dt*.045;clouds.rotation.y+=dt*.006;}
    if(!dragging&&!paused&&!busy){globe.rotation.y+=dragVelocity;dragVelocity*=.92;}
    for(let i=0;i<satellites.length;i++){
      const sat=satellites[i],angle=orbitTime+i*Math.PI/2;
      sat.position.copy(orbitPoint(angle));sat.rotation.set(.13,Math.sin(angle)*.15,-.2+Math.cos(angle)*.15);
      if(!paused&&!reducedMotion.matches)sat.position.y+=Math.sin(time*.0012+i)*.035;
      const scale=hovered===i?.88:.77;sat.scale.lerp(new THREE.Vector3(scale,scale,scale),.12);
    }
    focusHalo.visible=hovered>=0&&!busy;if(focusHalo.visible){focusHalo.position.copy(satellites[hovered].position);focusHalo.quaternion.copy(camera.quaternion);}
    if(flight){
      const t=Math.min((time-flight.started)/1800,1),s=smooth(t);
      const satellite=satellites[flight.index];satellite.position.lerpVectors(flight.start,flight.target,s);satellite.rotation.z+=s*.7;satellite.scale.setScalar(.77*(1-.45*s));
      const desired=flight.target.clone().normalize().multiplyScalar(2.25).add(new THREE.Vector3(0,.3,1.1));
      camera.position.lerpVectors(basePosition,desired,s);camera.lookAt(flight.target.clone().multiplyScalar(s*.75));
    }else{camera.lookAt(lookTarget);}
    scene.updateMatrixWorld();camera.updateMatrixWorld();if(!busy)positionLabels();renderer.render(scene,camera);
  }
  renderer.setAnimationLoop(frame);
  world={
    startFlight(i){const start=satellites[i].position.clone();const normal=new THREE.Vector3(start.x*.35,start.y*.3,1.3).normalize();flight={index:i,start,target:normal.multiplyScalar(1.72),started:performance.now()};},
    stopFlight(){flight=null;},
    reset(){flight=null;camera.position.copy(basePosition);camera.lookAt(lookTarget);resize();},
  };
  $('scene-loading').hidden=true;universe.dataset.state='ready';
}
initScene().catch(error=>{console.error('Unable to initialize the 3D scene.',error);fallback('点击研究方向，开始探索');});
