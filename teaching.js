import {component,circuitBoard} from './teaching-art.js?v=paper1';
const courses=[
 {id:'python',name:'Python 程序设计',en:'Python Programming',part:'可编程芯片',code:'U1 / PROGRAMMING',lead:'让想法，成为可以运行的代码。',intro:'从程序逻辑、数据结构到实际问题求解，建立编程与计算思维的基础。用代码拆解问题，也在调试中理解自己的思考。',topics:[['程序与逻辑','理解变量、流程控制与函数，把问题表达成清晰的步骤。'],['数据与组织','认识常用数据结构，思考如何组织、处理和使用数据。'],['实现与调试','从小程序出发，通过运行、检查与修改，逐步完成问题求解。']],keywords:['计算思维','程序设计','问题求解'],question:'如果把一个日常问题交给计算机，你会怎样描述它？'},
 {id:'architecture',name:'计算机体系结构',en:'Computer Architecture',part:'中央处理器',code:'U2 / COMPUTER SYSTEMS',lead:'越过代码，看见计算如何发生。',intro:'理解指令、处理器与存储系统如何协同，探索程序背后的硬件世界。从软硬件的联系出发，认识计算机系统的组织与运行。',topics:[['指令与执行','连接程序和指令，理解计算任务如何被处理器执行。'],['处理器与存储','认识处理器与存储层次，理解数据在系统中的流动。'],['系统与性能','从整体系统观察效率，思考结构设计与性能之间的关系。']],keywords:['计算机系统','软硬件协同','性能分析'],question:'同一段程序，为什么会在不同的系统上表现不同？'},
 {id:'game',name:'计算机游戏开发',en:'Computer Game Development',part:'图形处理模块',code:'U3 / GAME DEVELOPMENT',lead:'把逻辑与创意，变成可交互的世界。',intro:'围绕计算机游戏的交互与实现，连接程序设计、场景表达和玩法逻辑。让抽象的规则成为可感知、可操作的体验。',topics:[['规则与机制','把玩法想法转化为明确的状态、规则与行为。'],['场景与交互','理解输入、反馈与场景之间的联系，组织游戏中的交互。'],['实现与迭代','通过原型构建与体验检查，逐步完善游戏的运行逻辑。']],keywords:['交互设计','游戏逻辑','创意实践'],question:'一个简单的规则，可以创造出怎样的游戏体验？'},
 {id:'writing',name:'研究方法与论文写作指导',en:'Research Methods & Academic Writing',part:'知识存储模块',code:'U4 / RESEARCH & WRITING',level:'研究生课程',lead:'从一个好问题，到一篇清楚的论文。',intro:'面向研究生，连接研究问题的提出、方法的选择与学术表达。梳理从阅读文献到组织论证的过程，让研究思路与论文叙述相互支撑。',topics:[['阅读与提问','在文献阅读中辨认已有工作、证据与尚待回答的问题。'],['方法与论证','围绕研究问题组织方法与证据，检查结论的适用边界。'],['结构与表达','建立清晰的论文结构，练习准确表述、规范引用与修改。']],keywords:['研究方法','学术写作','批判性思考'],question:'你的研究回答了什么问题，证据又如何支持这个回答？'}
];
export function initTeaching(root,onHome){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let active=false,visible=true,paused=reduced.matches,selected=0;
 root.innerHTML=`<div class="tc-wrap"><h1 id="tc-title" class="sr-only">教学</h1>
 <section class="tc-board-section" aria-label="交互课程电路板"><div class="tc-board" data-selected="0">${circuitBoard()}<div class="tc-hub" aria-hidden="true"><span>✳</span><small>保持好奇</small><i>CURIOSITY</i></div><div class="tc-components" role="group" aria-label="选择课程">${courses.map((c,i)=>`<button type="button" class="tc-component tc-${c.id}" data-course="${i}" aria-pressed="${i===0}" aria-controls="tc-course-detail"><span class="tc-component-code"><i></i>${c.code}</span>${component(c.id)}<span class="tc-component-name">${c.id==='writing'?'<span class="tc-name-half">研究方法与</span><span>论文写作指导</span>':c.name}<b>↗</b></span><span class="tc-component-en" lang="en">${c.en}</span><span class="tc-component-part">${c.part}${c.level?' · 研究生课程':''}</span></button>`).join('')}</div><div class="tc-board-footer"><span>点击元件，查看课程。</span></div></div><div class="tc-controls"><p id="tc-status" role="status">已接通：Python 程序设计 · 下方查看课程介绍</p><button type="button" id="tc-motion"></button></div></section>
 <section id="tc-course-detail" class="tc-detail" tabindex="-1" aria-labelledby="tc-course-name"><div class="tc-detail-heading"><span class="tc-eyebrow">CONNECTED COURSE / <b id="tc-counter">01</b></span><div class="tc-course-switch"><button type="button" data-tc-prev aria-label="上一门课程">←</button><button type="button" data-tc-next aria-label="下一门课程">→</button></div></div><div id="tc-course-content"></div></section>
 <footer class="tc-end"><p>把好奇带进课堂，<span>把思考带向更远的地方。</span></p><div><a href="mailto:tingshu@szu.edu.cn?subject=${encodeURIComponent('课程交流')}">课程交流 ↗</a><button type="button" data-tc-home>返回地球主页 ↗</button></div></footer></div>`;
 const q=s=>root.querySelector(s),board=q('.tc-board');
 const updateMotion=()=>{root.classList.toggle('tc-still',paused||!active||!visible||document.hidden);q('#tc-motion').textContent=paused?'▷ 继续电路动画':'Ⅱ 暂停电路动画';q('#tc-motion').setAttribute('aria-pressed',String(paused));};
 function select(i,scroll=false){
  selected=(i+courses.length)%courses.length;const c=courses[selected];
  board.dataset.selected=String(selected);
  root.querySelectorAll('[data-course]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.course)===selected)));
  q('#tc-counter').textContent=String(selected+1).padStart(2,'0');q('#tc-status').textContent=`已接通：${c.name} · 下方查看课程介绍`;
  q('#tc-course-content').innerHTML=`<div class="tc-course-summary"><p class="tc-course-kind">${c.code}${c.level?`<span>${c.level}</span>`:''}</p><h2 id="tc-course-name">${c.name}</h2><p class="tc-detail-en" lang="en">${c.en}</p><h3>${c.lead}</h3><p class="tc-description">${c.intro}</p><div class="tc-keywords">${c.keywords.map(k=>`<span>${k}</span>`).join('')}</div></div><div class="tc-topics"><p class="tc-topics-label">COURSE FOCUS / 课程关注</p>${c.topics.map((t,n)=>`<div class="tc-topic"><span>${String(n+1).padStart(2,'0')}</span><div><h4>${t[0]}</h4><p>${t[1]}</p></div></div>`).join('')}</div><div class="tc-question"><span>带着一个问题出发 <small>A QUESTION TO START WITH</small></span><p>${c.question}</p><i aria-hidden="true">?</i></div>`;
  if(scroll){q('#tc-course-detail').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});q('#tc-course-detail').focus({preventScroll:true});}
 }
 root.querySelectorAll('[data-course]').forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.course),true)));
 q('[data-tc-prev]').addEventListener('click',()=>select(selected-1));q('[data-tc-next]').addEventListener('click',()=>select(selected+1));
 root.querySelectorAll('[data-tc-home]').forEach(b=>b.addEventListener('click',onHome));
 q('#tc-motion').addEventListener('click',()=>{paused=!paused;updateMotion();});reduced.addEventListener('change',e=>{paused=e.matches;updateMotion();});document.addEventListener('visibilitychange',updateMotion);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;updateMotion();},{threshold:0});observer.observe(board);
 select(0);updateMotion();
 return {setActive(value){active=value;updateMotion();},selectCourse(i){select(i);}};
}
