import {news} from './data/news.js?v=1';
const categories=[['all','全部消息'],['papers','论文发表'],['projects','项目进展'],['talks','学术交流'],['team','团队动态']];
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const marks={
 papers:'<path d="M19 12h22v32H19zM25 20h10M25 26h10M25 32h6"/><path d="m36 38 4 4 8-10"/>',
 projects:'<path d="M30 44V26M30 33C17 33 15 26 16 20c10-1 15 4 14 13ZM30 27c0-11 7-16 15-15 1 9-4 15-15 15ZM20 45h20"/>',
 talks:'<path d="M13 15h34v23H30l-9 8v-8h-8zM20 23h20M20 29h13"/>',
 team:'<circle cx="22" cy="22" r="7"/><circle cx="41" cy="24" r="6"/><path d="M10 43c1-15 23-15 24 0M34 33c8-3 16 2 16 10M20 22h.1M24 22h.1"/>'
};
export function initNews(root,onHome){
 const ordered=[...news].sort((a,b)=>b.date.localeCompare(a.date));
 const years=[...new Set(ordered.map(n=>n.date.slice(0,4)))];
 root.innerHTML=`<div class="news-wrap"><header class="news-masthead"><div class="news-kicker"><span>FIELD NOTES FROM OUR LITTLE LAB</span><span>AI × WEATHER</span></div><div class="news-name"><span class="news-spark" aria-hidden="true">✳</span><h1 id="news-title">实验室小报<small>最新消息 · LAB NOTES</small></h1><div class="news-edition"><span>最近一笔</span><time datetime="${ordered[0].date}">${ordered[0].date.replaceAll('-',' / ')}</time></div></div></header><div class="news-tools"><div class="news-filters" role="group" aria-label="消息类别">${categories.map(([id,label])=>`<button type="button" data-news-category="${id}" aria-pressed="${id==='all'}" aria-controls="news-archive">${label}<span>${id==='all'?news.length:news.filter(n=>n.category===id).length}</span></button>`).join('')}</div><label class="news-year">年份 <select id="news-year" aria-controls="news-archive"><option value="all">所有年份</option>${years.map(y=>`<option value="${y}">${y}</option>`).join('')}</select></label></div><p id="news-status" class="news-status" role="status"></p><div id="news-archive"></div><footer class="news-end"><span>把每一小步，记下来。</span><button type="button" data-news-home>返回地球主页 ↗</button></footer></div>`;
 let category='all',year='all';
 function render(){
  const list=ordered.filter(n=>(category==='all'||n.category===category)&&(year==='all'||n.date.startsWith(year)));
  root.querySelector('#news-status').textContent=`${categories.find(c=>c[0]===category)[1]} · ${list.length} 则记录`;
  root.querySelector('#news-archive').innerHTML=list.length?[...new Set(list.map(n=>n.date.slice(0,4)))].map(y=>`<section class="news-year-section" aria-labelledby="news-year-${y}"><h2 id="news-year-${y}"><span>${y}</span><small>这一年的记录</small></h2><div class="news-grid">${list.filter(n=>n.date.startsWith(y)).map(n=>`<article class="news-card news-${n.category}"><div class="news-card-top"><time datetime="${n.date}">${n.date.replaceAll('-','.')}</time><span>${categories.find(c=>c[0]===n.category)[1]}</span></div><div class="news-stamp" aria-hidden="true"><svg viewBox="0 0 60 58">${marks[n.category]}</svg><small>${escape(n.stamp)}</small></div><div class="news-card-copy"><h3>${escape(n.title)}</h3><p>${escape(n.text)}</p>${n.work?`<blockquote${n.category==='papers'?' lang="en"':''}>${escape(n.work)}</blockquote>`:''}</div><span class="news-card-note" aria-hidden="true">${escape(n.note)}</span></article>`).join('')}</div></section>`).join(''):'<div class="news-empty"><span aria-hidden="true">✧</span><p>这一格，暂时还没有记录。</p><button type="button" data-news-reset>查看全部消息 ↗</button></div>';
 }
 root.querySelectorAll('[data-news-category]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.newsCategory;root.querySelectorAll('[data-news-category]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();}));
 root.querySelector('#news-year').addEventListener('change',e=>{year=e.target.value;render();});
 root.addEventListener('click',e=>{if(e.target.closest('[data-news-reset]')){category='all';year='all';root.querySelector('#news-year').value='all';root.querySelectorAll('[data-news-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.newsCategory==='all')));render();root.querySelector('[data-news-category="all"]').focus();}});
 root.querySelector('[data-news-home]').addEventListener('click',onHome);
 render();
}
