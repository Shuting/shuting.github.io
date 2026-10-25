import {news} from './data/news.js?v=1';
const categories=[['papers','论文发表'],['projects','项目进展'],['talks','学术交流'],['team','团队动态']];
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const months=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const stickers=`<div class="journal-stickers" aria-hidden="true"><svg class="journal-earth-stamp" viewBox="0 0 110 135"><path d="M8 8h94v119H8Z" fill="#eff3e8" stroke="#fff" stroke-width="9" stroke-dasharray="5 5"/><rect x="17" y="17" width="76" height="101" fill="none" stroke="#b5c4b2"/><circle cx="55" cy="57" r="27" fill="#b7cfd2"/><path d="m37 35 16-4 10 10-7 12-15 3-9-8Zm22 27 18-5 4 9-15 15-8-7Z" fill="#8faa8b"/><text x="55" y="101" text-anchor="middle" font-size="9" fill="#849780" font-family="Arial" letter-spacing="2">EARTH</text></svg><svg class="journal-cloud" viewBox="0 0 160 110"><path d="M28 72C4 71 3 35 28 35c-1-27 39-34 52-10 24-16 49-2 45 22 28-1 32 27 8 28Z" fill="#dfe9dc" stroke="#fffdf2" stroke-width="6"/><path d="m48 85-5 9m30-9-5 9m30-9-5 9" stroke="#8cabb1" stroke-width="3" stroke-linecap="round"/><path d="M54 51v3m24-3v3m-24 9q13 8 24-1" fill="none" stroke="#82967f" stroke-width="2" stroke-linecap="round"/></svg><span class="journal-pencil"></span><span class="journal-spark spark-a">✧</span></div>`;
export function initNews(root,onHome){
 const now=new Date();
 let year=now.getFullYear(),quarter=Math.floor(now.getMonth()/3);
 const label=id=>categories.find(c=>c[0]===id)?.[1]||id;
 const years=[...new Set(news.map(n=>n.date.slice(0,4)))].sort().reverse();
 root.innerHTML=`<div class="news-wrap"><h1 id="news-title" class="sr-only">团队动态</h1><svg width="0" height="0" aria-hidden="true" class="book-shape-def"><defs><clipPath id="notebook-paper-shape" clipPathUnits="objectBoundingBox"><path d="M0 .018 Q.23 -.006 .47 .012 Q.5 .023 .53 .012 Q.77 -.006 1 .018 L1 .982 Q.77 .968 .53 .986 Q.5 .997 .47 .986 Q.23 .968 0 .982Z"/></clipPath></defs></svg><div class="notebook-viewport"><div class="journal-notebook"><section class="news-journal" aria-label="季度手帐">${stickers}<div class="quarter-scene"><div class="calendar-postcard"><div class="calendar-backing" aria-hidden="true"><span class="journal-tape tape-left"></span><span class="journal-tape tape-right"></span></div><header class="calendar-heading"><div class="calendar-year-nav"><button type="button" data-year-step="-1" aria-label="上一年">‹</button><h2 id="calendar-year"></h2><button type="button" data-year-step="1" aria-label="下一年">›</button></div><div class="calendar-quarter-nav" aria-label="选择季度">${['一季度','二季度','三季度','四季度'].map((name,i)=>`<button type="button" data-quarter="${i}" aria-pressed="false">${name}</button>`).join('')}</div><p id="quarter-label" class="quarter-label" role="status"></p></header><div class="calendar-months"></div></div><div class="quarter-left-note"></div><div class="quarter-content"></div><svg class="journal-connections" aria-hidden="true"></svg></div><p class="journal-caption">用红笔，圈住一起走过的日子。</p></section></div></div><p class="notebook-mobile-hint">左右滑动，看看摊开的两页</p><section class="news-records" id="news-records" aria-labelledby="news-list-title"><header class="news-list-heading"><h2 id="news-list-title">全部动态</h2><span>每一小步，都在这里。</span></header><div class="news-tools"><label>类型<select id="news-category"><option value="all">全部类型</option>${categories.map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select></label><label>年份<select id="news-year"><option value="all">所有年份</option>${years.map(y=>`<option value="${y}">${y}</option>`).join('')}</select></label><label>排列<select id="news-sort"><option value="time">按时间</option><option value="type">按类型</option></select></label><label>时间顺序<select id="news-order"><option value="desc">最新在前</option><option value="asc">最早在前</option></select></label></div><p class="news-status" role="status"></p><div id="news-archive"></div></section><footer class="news-end"><span>未完，待续…</span><button type="button" data-news-home>回到小小地球 ↗</button></footer></div>`;
 const q=s=>root.querySelector(s);
 function row(n){return `<article class="news-row" data-record-date="${n.date}" tabindex="-1"><div class="news-row-meta"><time datetime="${n.date}">${n.date.replaceAll('-','.')}</time><span>${label(n.category)}</span></div><div class="news-row-copy"><h3>${escape(n.title)}</h3><p>${escape(n.text)}</p>${n.work?`<blockquote${n.category==='papers'?' lang="en"':''}>${escape(n.work)}</blockquote>`:''}</div></article>`;}
 function renderEntries(){
  const category=q('#news-category').value,filterYear=q('#news-year').value,ascending=q('#news-order').value==='asc',group=q('#news-sort').value==='type';
  const entries=news.filter(n=>(filterYear==='all'||n.date.startsWith(filterYear))&&(category==='all'||n.category===category)).sort((a,b)=>ascending?a.date.localeCompare(b.date):b.date.localeCompare(a.date));
  q('.news-status').textContent=`${entries.length} 条动态 · ${group?'按类型排列 · ':''}${ascending?'最早在前':'最新在前'}`;
  q('#news-archive').innerHTML=!entries.length?'<p class="news-empty">这个筛选条件下，还没有记录。</p>':group?categories.filter(([id])=>entries.some(n=>n.category===id)).map(([id,name])=>`<section class="news-group"><h3>${name}</h3>${entries.filter(n=>n.category===id).map(row).join('')}</section>`).join(''):entries.map(row).join('');
 }
 function calendar(m){
  const offset=(new Date(year,m,1).getDay()+6)%7,days=new Date(year,m+1,0).getDate();
  const cells=Array.from({length:offset},()=>'<span aria-hidden="true"></span>');
  for(let d=1;d<=days;d++){
   const date=`${year}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`,items=news.filter(n=>n.date===date);
   cells.push(items.length?`<button type="button" class="calendar-event" data-event-date="${date}" aria-label="${m+1}月${d}日，${items.map(n=>escape(n.title)).join('；')}，查看手写动态">${d}</button>`:`<span>${d}</span>`);
  }
  return `<section class="calendar-month" aria-label="${year}年${m+1}月"><h3><span>${String(m+1).padStart(2,'0')}</span><span>${m+1}月 <small>${months[m]}</small></span></h3><div class="calendar-weekdays" aria-hidden="true">${['一','二','三','四','五','六','日'].map(d=>`<span>${d}</span>`).join('')}</div><div class="calendar-days">${cells.join('')}</div></section>`;
 }
 function note(n,side){return `<article class="journal-note note-${side}" data-note-date="${n.date}" tabindex="-1"><time datetime="${n.date}">${Number(n.date.slice(5,7))}月${Number(n.date.slice(8))}日</time><h3>${escape(n.title)}</h3>${n.category==='team'?`<p>${escape(n.text)}</p>`:''}<button type="button" data-read-date="${n.date}">读完整记录 ↗</button></article>`;}
 let frame=0;
 function drawConnections(){
  cancelAnimationFrame(frame);
  frame=requestAnimationFrame(()=>{
   const scene=q('.quarter-scene'),bounds=scene.getBoundingClientRect(),svg=q('.journal-connections');
   if(!bounds.width)return;
   svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
   svg.innerHTML=[...scene.querySelectorAll('.journal-note')].map(note=>{
    const day=[...scene.querySelectorAll('.calendar-event')].find(d=>d.dataset.eventDate===note.dataset.noteDate);
    if(!day)return '';
    const a=day.getBoundingClientRect(),b=note.getBoundingClientRect(),card=q('.calendar-postcard').getBoundingClientRect();
    const x1=a.left+a.width/2-bounds.left,y1=a.top+a.height/2-bounds.top;
    let x2,y2,path;
    if(b.top>=card.bottom-10){
     x2=b.left+Math.min(42,b.width/3)-bounds.left;y2=b.top-bounds.top-7;
     const exit=card.bottom-bounds.top+16;
     path=`M ${x1} ${y1+13} C ${x1+8} ${exit}, ${x2-20} ${exit+10}, ${x2} ${y2}`;
    }else{
     x2=b.left-bounds.left-10;y2=b.top+30-bounds.top;
     path=`M ${x1+13} ${y1} C ${card.right-bounds.left+22} ${y1+16}, ${x2-38} ${y2+26}, ${x2} ${y2}`;
    }
    return `<path d="${path}"/><circle cx="${x2}" cy="${y2}" r="2"/>`;
   }).join('');
  });
 }
 function renderQuarter(){
  q('#calendar-year').textContent=String(year);
  q('[data-year-step="-1"]').disabled=year<=1900;q('[data-year-step="1"]').disabled=year>=2100;
  q('.calendar-quarter-nav').querySelectorAll('[data-quarter]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.quarter)===quarter?'true':'false'));
  q('#quarter-label').textContent=`${year} · ${quarter*3+1}—${quarter*3+3} 月`;
  q('.calendar-months').innerHTML=Array.from({length:3},(_,i)=>calendar(quarter*3+i)).join('');
  const entries=news.filter(n=>Number(n.date.slice(0,4))===year&&Math.floor((Number(n.date.slice(5,7))-1)/3)===quarter).sort((a,b)=>a.date.localeCompare(b.date));
  q('.quarter-scene').dataset.count=String(entries.length);
  q('.quarter-left-note').innerHTML=entries.length>1?note(entries[0],'0'):'';
  const right=entries.length>1?entries.slice(1):entries;
  q('.quarter-content').innerHTML=right.length?right.map((n,i)=>note(n,String(i+1))).join(''):'<p class="journal-blank">留一点空白，等新的故事。</p>';
  drawConnections();
 }
 let turning=false,pendingTurn=null;
 async function turnTo(nextYear,nextQuarter){
  if(turning){pendingTurn=[nextYear,nextQuarter];return;}
  if(nextYear===year&&nextQuarter===quarter)return;
  const forward=nextYear*4+nextQuarter>year*4+quarter;
  const book=q('.journal-notebook'),page=q('.news-journal');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){year=nextYear;quarter=nextQuarter;renderQuarter();return;}
  turning=true;book.classList.add('is-turning');
  const oldHeight=page.offsetHeight,width=page.offsetWidth,half=width/2,left=page.offsetLeft,top=page.offsetTop;
  const snapshot=()=>{
   const copy=page.cloneNode(true);copy.classList.add('book-page-copy');copy.inert=true;copy.setAttribute('aria-hidden','true');copy.removeAttribute('aria-label');
   copy.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));copy.style.width=`${width}px`;return copy;
  };
  const oldCopy=snapshot();
  year=nextYear;quarter=nextQuarter;renderQuarter();
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const height=Math.max(oldHeight,page.offsetHeight),newCopy=snapshot();
  book.style.minHeight=`${height+top+16}px`;
  const makeFace=(copy,side,className)=>{
   const face=document.createElement('div');face.className=className;face.inert=true;face.setAttribute('aria-hidden','true');
   Object.assign(face.style,{width:`${half}px`,height:`${height}px`});
   copy.style.left=side==='right'?`-${half}px`:'0px';copy.style.height=`${height}px`;face.append(copy);return face;
  };
  const fixed=makeFace(oldCopy.cloneNode(true),forward?'left':'right','book-fixed-half');
  Object.assign(fixed.style,{left:`${left+(forward?0:half)}px`,top:`${top}px`});book.append(fixed);
  const leaf=document.createElement('div');leaf.className='book-curl';leaf.dataset.direction=forward?'forward':'backward';leaf.inert=true;leaf.setAttribute('aria-hidden','true');
  Object.assign(leaf.style,{left:`${left+half}px`,top:`${top}px`,height:`${height}px`});
  const count=24,stripWidth=half/count,sign=forward?1:-1,strips=[];
  for(let i=0;i<count;i++){
   const strip=document.createElement('div');strip.className='book-curl-strip';
   Object.assign(strip.style,{width:`${stripWidth+.6}px`,height:`${height}px`});
   const front=document.createElement('div'),back=document.createElement('div');
   front.className='book-curl-face';back.className='book-curl-face book-curl-back';
   const frontCopy=oldCopy.cloneNode(true),backCopy=newCopy.cloneNode(true);
   const u=i*stripWidth;
   frontCopy.style.left=`-${forward?half+u:half-u-stripWidth}px`;
   backCopy.style.left=`-${forward?half-u-stripWidth:half+u}px`;
   frontCopy.style.height=backCopy.style.height=`${height}px`;
   front.append(frontCopy);back.append(backCopy);strip.append(front,back);leaf.append(strip);strips.push(strip);
  }
  book.append(leaf);
  try{
   await new Promise(resolve=>{
    let started;
    function curl(time){
     started??=time;
     const t=Math.min(1,(time-started)/1250),progress=t*t*(3-2*t),wave=Math.sin(Math.PI*progress);
     let x=0,z=0;
     strips.forEach((strip,i)=>{
      const u=(i+.5)/count;
      // The edge leads the spine, forming a continuous, softly curled sheet.
      const angle=Math.PI*progress+.9*wave*(u-.28),dx=stripWidth*Math.cos(angle),dz=stripWidth*Math.sin(angle);
      const px=forward?x:-(x+dx),pz=forward?z:z+dz;
      strip.style.transform=`translate3d(${px}px,${-9*wave*u*u}px,${pz}px) rotateY(${-sign*angle}rad)`;
      const shade=1-.07*wave*Math.sin(Math.PI*u);
      for(const face of strip.children)face.style.filter=`brightness(${shade})`;
      x+=dx;z+=dz;
     });
     leaf.dataset.progress=progress.toFixed(3);
     if(t<1)requestAnimationFrame(curl);else resolve();
    }
    requestAnimationFrame(curl);
   });
  }catch{/* Always settle on the requested spread if an animation is cancelled. */}
  finally{
   leaf.remove();fixed.remove();book.classList.remove('is-turning');book.style.minHeight='';turning=false;drawConnections();
   if(pendingTurn){const target=pendingTurn;pendingTurn=null;turnTo(...target);}
  }
 }
 root.addEventListener('click',e=>{
  const step=e.target.closest('[data-year-step]'),tab=e.target.closest('[data-quarter]'),day=e.target.closest('[data-event-date]'),read=e.target.closest('[data-read-date]');
  if(step){const target=pendingTurn||[year,quarter];turnTo(Math.min(2100,Math.max(1900,target[0]+Number(step.dataset.yearStep))),target[1]);}
  if(tab){turnTo((pendingTurn||[year])[0],Number(tab.dataset.quarter));}
  if(day){const note=[...root.querySelectorAll('.journal-note')].find(n=>n.dataset.noteDate===day.dataset.eventDate);root.querySelectorAll('.note-selected').forEach(n=>n.classList.remove('note-selected'));if(note){note.classList.add('note-selected');note.focus({preventScroll:true});note.scrollIntoView({behavior:'instant',block:'nearest'});}}
  if(read){q('#news-category').value='all';q('#news-year').value='all';renderEntries();const entry=[...root.querySelectorAll('.news-row')].find(n=>n.dataset.recordDate===read.dataset.readDate);if(entry){entry.classList.add('news-selected');entry.focus({preventScroll:true});entry.scrollIntoView({behavior:'instant',block:'center'});}}
 });
 root.querySelectorAll('.news-tools select').forEach(s=>s.addEventListener('change',renderEntries));
 q('[data-news-home]').addEventListener('click',onHome);
 const observer=new ResizeObserver(drawConnections);observer.observe(q('.quarter-scene'));
 document.fonts.ready.then(drawConnections);
 renderQuarter();renderEntries();
}
