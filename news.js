import {news} from './data/news.js?v=1';
import {balloonArt,terrainFallback} from './news-balloon-art.js?v=4';
const categories=[['papers','论文发表'],['projects','项目进展'],['talks','学术交流'],['team','团队动态']];
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const palette=['#c6a4a0','#a9bfa1','#9fbcc7','#d3bd86'];
const briefByDate={'2026-09-25':'PCFBench · NeurIPS 2026','2026-03-03':'短时强降水项目顺利结题','2025-05-09':'数值预报应用大会口头报告','2026-10-01':'4 位伙伴确定研究方向'};
export function initNews(root,onHome){
 const label=id=>categories.find(c=>c[0]===id)?.[1]||id;
 const years=[...new Set(news.map(n=>n.date.slice(0,4)))].sort().reverse();
 const ordered=[...news].sort((a,b)=>b.date.localeCompare(a.date));
 const main=categories.map(([id,name],i)=>{const latest=ordered.find(n=>n.category===id),brief=briefByDate[latest?.date]||latest?.title||'期待新的故事';return `<div class="balloon-flight balloon-main balloon-main-${i}" style="--flight-x:${[14,38,62,86][i]}%;--duration:${[87,97,83,101][i]}s;--delay:${[-42,-47,-31,-45][i]}s;--rest-y:${[65,130,45,155][i]}px;--sway-delay:-${i*2}s"><button class="news-balloon" type="button" data-news-category="${id}" aria-label="${name}：${escape(brief)}。查看全部${name}"><span class="balloon-envelope">${balloonArt('news-main-'+id,palette[i])}</span><span class="balloon-basket"><strong>${name}</strong><span>${escape(brief)}</span></span></button></div>`;}).join('');
 const words=['AI','天气','ML','降水','DL','多云','AI','晴','Weather','ML','风','DL','天气','AI','多云','降水'];
 const background=words.map((word,i)=>`<div class="balloon-flight balloon-small" aria-hidden="true" style="--flight-x:${4+(i*23%93)}%;--balloon-size:${32+(i*17%44)}px;--duration:${55+i*5}s;--delay:-${(i*19+21)%(55+i*5)}s;--direction:${i%2?'reverse':'normal'};--rest-y:${15+(i*79%430)}px;--sway-delay:-${i}s"><div class="small-balloon"><span class="balloon-envelope">${balloonArt('news-small-'+i,palette[(i+2)%4])}</span><span class="balloon-mini-basket">${word}</span></div></div>`).join('');
 root.innerHTML=`<div class="news-wrap"><h1 id="news-title" class="sr-only">团队动态</h1><section class="news-balloon-world" aria-label="热气球里的团队动态"><div class="news-sky" aria-hidden="true"><i class="sky-cloud cloud-one"></i><i class="sky-cloud cloud-two"></i><i class="sky-cloud cloud-three"></i></div><div class="news-balloon-flights">${background}${main}</div><div class="news-terrain" aria-hidden="true">${terrainFallback}</div><div class="balloon-world-footer"><span>把新的故事，带上天空。</span><button type="button" class="balloon-motion" aria-pressed="false">暂停漂浮</button></div></section><section class="news-records" id="news-records" aria-labelledby="news-list-title"><header class="news-list-heading"><h2 id="news-list-title">全部动态</h2><span>每一小步，都在这里。</span></header><div class="news-tools"><label>类型<select id="news-category"><option value="all">全部类型</option>${categories.map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select></label><label>年份<select id="news-year"><option value="all">所有年份</option>${years.map(y=>`<option value="${y}">${y}</option>`).join('')}</select></label><label>排列<select id="news-sort"><option value="time">按时间</option><option value="type">按类型</option></select></label><label>时间顺序<select id="news-order"><option value="desc">最新在前</option><option value="asc">最早在前</option></select></label></div><p class="news-status" role="status"></p><div id="news-archive"></div></section><footer class="news-end"><span>未完，待续…</span><button type="button" data-news-home>回到小小地球 ↗</button></footer></div>`;
 const q=s=>root.querySelector(s);
 function row(n){return `<article class="news-row" data-record-date="${n.date}" tabindex="-1"><div class="news-row-meta"><time datetime="${n.date}">${n.date.replaceAll('-','.')}</time><span>${label(n.category)}</span></div><div class="news-row-copy"><h3>${escape(n.title)}</h3><p>${escape(n.text)}</p>${n.work?`<blockquote${n.category==='papers'?' lang="en"':''}>${escape(n.work)}</blockquote>`:''}</div></article>`;}
 function renderEntries(){
  const category=q('#news-category').value,filterYear=q('#news-year').value,ascending=q('#news-order').value==='asc',group=q('#news-sort').value==='type';
  const entries=news.filter(n=>(filterYear==='all'||n.date.startsWith(filterYear))&&(category==='all'||n.category===category)).sort((a,b)=>ascending?a.date.localeCompare(b.date):b.date.localeCompare(a.date));
  q('.news-status').textContent=`${entries.length} 条动态 · ${group?'按类型排列 · ':''}${ascending?'最早在前':'最新在前'}`;
  q('#news-archive').innerHTML=!entries.length?'<p class="news-empty">这个筛选条件下，还没有记录。</p>':group?categories.filter(([id])=>entries.some(n=>n.category===id)).map(([id,name])=>`<section class="news-group"><h3>${name}</h3>${entries.filter(n=>n.category===id).map(row).join('')}</section>`).join(''):entries.map(row).join('');
 }
 const world=q('.news-balloon-world'),motion=q('.balloon-motion'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reduced.matches;
 function updateMotion(){world.classList.toggle('motion-paused',paused);motion.setAttribute('aria-pressed',String(paused));motion.textContent=paused?'继续漂浮':'暂停漂浮';}
 motion.addEventListener('click',()=>{paused=!paused;updateMotion();});
 reduced.addEventListener('change',e=>{paused=e.matches;updateMotion();});
 root.querySelectorAll('[data-news-category]').forEach(button=>button.addEventListener('click',()=>{
  q('#news-category').value=button.dataset.newsCategory;q('#news-year').value='all';q('#news-sort').value='time';q('#news-order').value='desc';renderEntries();
  const records=q('#news-records');records.tabIndex=-1;records.focus({preventScroll:true});records.scrollIntoView({behavior:'instant',block:'start'});
 }));
 root.querySelectorAll('.news-tools select').forEach(s=>s.addEventListener('change',renderEntries));
 q('[data-news-home]').addEventListener('click',onHome);

 updateMotion();renderEntries();
}
