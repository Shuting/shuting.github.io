import {createMaze,mazeArt,cellPoint,pathData,mainRoute} from './join-maze-art.js?v=1';
const stops=[
 {cell:[0,6],name:'好奇出发',en:'Stay Curious',title:'带着好奇，走进来。',text:'如果你对机器学习、天气预测或 AI 与数值模式融合感兴趣，欢迎从一个想研究的问题开始，和我们聊聊。',action:'看看研究方向',target:'jm-interests'},
 {cell:[3,1],name:'研究兴趣',en:'Find Your Question',title:'找到想继续追问的事。',text:'从方法到应用，从数据到物理，研究可以有不同的入口。看看我们的研究方向，寻找与你的兴趣相遇的地方。',action:'探索四个研究方向',target:'jm-interests'},
 {cell:[6,5],name:'介绍自己',en:'Share Your Story',title:'让我们认识你的探索。',text:'简要介绍你的背景、研究兴趣，以及相关课程或项目经历。已有代码、作品或研究成果，也欢迎一起分享。',action:'查看来信建议',target:'jm-prepare'},
 {cell:[8,0],name:'在这里相遇',en:'Say Hello',title:'期待与你，一起探索。',text:'用一封邮件开启交流。说说你感兴趣的问题、希望探索的方向，以及你的学习或研究计划。',action:'写一封介绍邮件',target:'jm-contact'}
];
const email='tingshu@szu.edu.cn';
const mailto=`mailto:${email}?subject=${encodeURIComponent('研究学习交流｜姓名｜感兴趣的方向')}&body=${encodeURIComponent('舒老师您好，\n\n我的姓名与背景：\n感兴趣的研究方向或问题：\n相关课程、项目或研究经历：\n代码或作品链接（如有）：\n希望探索的学习或研究计划：\n\n附件：个人简历（如有）\n')}`;
export function initJoin(root,onHome){
 const maze=createMaze(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let selected=0,active=false,frame=0,animationSerial=0,copyTimer=0;
 const directions=[['learning','机器学习','Machine Learning','表示、融合与协同学习'],['precipitation','降水与临近预报','Precipitation & Nowcasting','从雷达观测到降水预测'],['clouds','AI与数值模式融合','AI × Numerical Weather Prediction','连接物理过程与数据驱动学习'],['multimodal','多模态与区域天气预测','Multimodal & Regional Weather Forecasting','多源信息与区域天气建模']];
 root.innerHTML=`<div class="jm-wrap"><h1 id="jm-title" class="sr-only">加入我们</h1>
 <section class="jm-exploration" aria-label="加入我们探索迷宫"><div class="jm-scene"><div class="jm-scene-caption"><span>THE GARDEN OF QUESTIONS</span><button type="button" data-jm-scroll="jm-contact">直接联系 ↗</button></div>${mazeArt(maze)}<div class="jm-markers" role="group" aria-label="迷宫路标">${stops.map((s,i)=>{const p=cellPoint(s.cell);return `<button type="button" class="jm-marker jm-marker-${i}" style="left:${p.x/10.5}%;top:${(p.y-28)/5.9}%" data-jm-stop="${i}" aria-pressed="${i===0}" aria-label="${i+1} ${s.name}" aria-controls="jm-note"><span>${String(i+1).padStart(2,'0')}</span><small>${s.name}</small></button>`;}).join('')}</div><div class="jm-map-controls"><p id="jm-journey-status" role="status">从好奇出发 · 点选路标，让小光点带路</p><button type="button" id="jm-show-route" aria-pressed="false">显示完整路线</button></div></div>
 <aside class="jm-notebook" aria-label="探索手札"><p class="jm-eyebrow">FIELD NOTES / 探索手札</p><div class="jm-step-list" role="group" aria-label="选择探索阶段">${stops.map((s,i)=>`<button type="button" data-jm-stop="${i}" aria-pressed="${i===0}" aria-controls="jm-note"><span>${String(i+1).padStart(2,'0')}</span><div><strong>${s.name}</strong><small lang="en">${s.en}</small></div><i aria-hidden="true">↗</i></button>`).join('')}</div><div id="jm-note" aria-live="polite"></div><button type="button" class="jm-reset" id="jm-reset">↶ 回到起点</button></aside></section>
 <section class="jm-interests" id="jm-interests" tabindex="-1" aria-labelledby="jm-interests-title"><div class="jm-section-heading"><div><p class="jm-eyebrow">01 / QUESTIONS WE EXPLORE</p><h2 id="jm-interests-title">你想探索哪一个问题？</h2></div><p>不同的兴趣，可以在这里找到交汇。</p></div><div class="jm-directions">${directions.map(([id,name,en,desc],i)=>`<a href="#research/${id}" class="jm-direction"><span class="jm-direction-number">${String(i+1).padStart(2,'0')}</span><div><h3>${name}</h3><p lang="en">${en}</p><span>${desc}</span></div><i aria-hidden="true">↗</i></a>`).join('')}</div></section>
 <section class="jm-meeting" id="jm-prepare" tabindex="-1" aria-labelledby="jm-prepare-title"><div class="jm-preparation"><p class="jm-eyebrow">02 / A NOTE ABOUT YOU</p><h2 id="jm-prepare-title">让第一封信，<br>成为探索的开始。</h2><p class="jm-prepare-intro">欢迎介绍你的研究兴趣与学习计划，<br>也让我们了解你已经走过的路。</p><ol><li><span>01</span><div><h3>你感兴趣的问题</h3><p>想探索哪个方向？是什么让你对它产生了好奇？</p></div></li><li><span>02</span><div><h3>你的背景与经历</h3><p>简要介绍学习背景，以及相关课程、项目或研究经历。</p></div></li><li><span>03</span><div><h3>可以分享的材料</h3><p>可附个人简历；已有代码、作品或研究成果，也欢迎提供链接。</p></div></li></ol></div>
 <div class="jm-contact" id="jm-contact" tabindex="-1"><div class="jm-envelope" aria-hidden="true"><span></span><i>✳</i></div><p class="jm-eyebrow">LET’S SAY HELLO</p><h2>在这里相遇。</h2><p>舒婷 Ting Shu<br><span>深圳大学 · 人工智能学院</span></p><a class="jm-email" href="${mailto}">${email}</a><a class="jm-write" href="${mailto}">介绍一下你自己 <span>↗</span></a><div class="jm-copy-row"><button type="button" id="jm-copy-email">复制邮箱</button><span id="jm-copy-status" role="status"></span></div><small>点击写信将打开邮件应用，可编辑后发送。</small></div></section>
 <footer class="jm-end"><p>有些路，<span>一起走会看见更多。</span></p><button type="button" data-jm-home>返回地球主页 ↗</button></footer></div>`;
 const q=s=>root.querySelector(s);
 const marker=q('#jm-traveler');
 const setPosition=p=>marker.setAttribute('transform',`translate(${p.x} ${p.y})`);
 function stopAnimation(){cancelAnimationFrame(frame);frame=0;animationSerial++;setPosition(cellPoint(stops[selected].cell));}
 function travel(from,to){
  stopAnimation();const points=maze.route(from,to).map(cellPoint);
  if(reduced.matches||!active||document.hidden||points.length<2){setPosition(points.at(-1));return;}
  const serial=animationSerial,duration=Math.min(2300,(points.length-1)*110);let start;
  const step=time=>{if(serial!==animationSerial)return;if(start===undefined)start=time;const progress=Math.min((time-start)/duration,1)*(points.length-1),i=Math.min(Math.floor(progress),points.length-2),f=progress-i;setPosition({x:points[i].x+(points[i+1].x-points[i].x)*f,y:points[i].y+(points[i+1].y-points[i].y)*f});if(progress<points.length-1)frame=requestAnimationFrame(step);else frame=0;};frame=requestAnimationFrame(step);
 }
 function select(index,animate=true){
  const previous=stops[selected].cell;selected=index;const s=stops[index];
  root.querySelectorAll('[data-jm-stop]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.jmStop)===index)));
  q('#jm-visited-path').setAttribute('d',pathData(maze.route(mainRoute[0],s.cell)));
  q('#jm-note').innerHTML=`<span class="jm-note-number">${String(index+1).padStart(2,'0')} / 04</span><h3>${s.title}</h3><p>${s.text}</p><button type="button" data-jm-scroll="${s.target}">${s.action} ↗</button>`;
  q('#jm-journey-status').textContent=`${s.name} · ${s.en}`;
  if(animate)travel(previous,s.cell);else stopAnimation();
 }
 root.addEventListener('click',e=>{const stop=e.target.closest('[data-jm-stop]');if(stop){select(Number(stop.dataset.jmStop));return;}const jump=e.target.closest('[data-jm-scroll]');if(jump){const target=q(`#${jump.dataset.jmScroll}`);target.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});target.focus({preventScroll:true});}});
 q('#jm-show-route').addEventListener('click',e=>{const button=e.currentTarget,show=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(show));button.textContent=show?'收起完整路线':'显示完整路线';q('#jm-full-path').setAttribute('opacity',show?'1':'0');});
 q('#jm-reset').addEventListener('click',()=>{select(0,false);q('#jm-full-path').setAttribute('opacity','0');q('#jm-show-route').setAttribute('aria-pressed','false');q('#jm-show-route').textContent='显示完整路线';});
 q('#jm-copy-email').addEventListener('click',async()=>{clearTimeout(copyTimer);try{await navigator.clipboard.writeText(email);q('#jm-copy-status').textContent='邮箱已复制';}catch{q('#jm-copy-status').textContent='请选中上方邮箱复制';}copyTimer=setTimeout(()=>{q('#jm-copy-status').textContent='';},3500);});
 root.querySelectorAll('[data-jm-home]').forEach(b=>b.addEventListener('click',onHome));
 reduced.addEventListener('change',()=>{if(reduced.matches)stopAnimation();});document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAnimation();});
 select(0,false);
 return {setActive(value){active=value;if(!active)stopAnimation();}};
}
