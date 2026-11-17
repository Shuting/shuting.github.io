const $=s=>document.querySelector(s);
const categories={papers:'论文发表',projects:'项目进展',talks:'学术交流',team:'团队动态'};
const colors={papers:'#bc9997',projects:'#9bb38d',talks:'#91b2c0',team:'#c4aa72'};
const fields=['category','date','title','text','work','brief'];
const key='ting-shu-news-draft-v1';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let items=[],base=[],sha='',token='',selected=null,filter='all',busy=false,formDirty=false;
const copy=v=>structuredClone(v);
function notice(message,error=false){$('#notice').textContent=message;$('#notice').classList.toggle('error',error);}
async function api(path,body){
 const response=await fetch('/api/'+path,{cache:'no-store',method:body?'POST':'GET',headers:body?{'Content-Type':'application/json','X-Editor-Token':token}:{},body:body?JSON.stringify(body):undefined});
 let data;try{data=await response.json();}catch{throw Error('请双击「打开动态管理.command」启动本机后台，再从自动打开的页面编辑。');}
 if(!response.ok)throw Error(data.error||'操作失败，请重试。');return data;
}
function diff(){
 const old=new Map(base.map(n=>[n.id,n])),current=new Map(items.map(n=>[n.id,n]));
 return [...items.filter(n=>!old.has(n.id)).map(n=>({kind:'新增',n})),...items.filter(n=>old.has(n.id)&&JSON.stringify(n)!==JSON.stringify(old.get(n.id))).map(n=>({kind:'修改',n})),...base.filter(n=>!current.has(n.id)).map(n=>({kind:'删除',n}))];
}
function currentForm(){return Object.fromEntries(fields.map(f=>[f,$('#'+f).value]));}
function persist(){
 try{localStorage.setItem(key,JSON.stringify({items,base,sha,selected,form:currentForm(),formDirty}));$('#draft-status').textContent='草稿已自动保存在此浏览器';}
 catch{$('#draft-status').textContent='浏览器无法保存草稿，请及时导出';}
 $('#changes').textContent=diff().length?`${diff().length} 条待发布${formDirty?' · 表单未保存':''}`:formDirty?'表单未保存':'与已读取版本一致';
 $('#publish').disabled=busy||(!diff().length&&!formDirty);
}
function render(){
 const search=$('#search').value.trim().toLowerCase();
 const entries=items.filter(n=>(filter==='all'||n.category===filter)&&[n.title,n.text,n.work].join(' ').toLowerCase().includes(search)).sort((a,b)=>b.date.localeCompare(a.date));
 $('#count').textContent=`${items.length} 条`;
 $('#filters').innerHTML=Object.entries({all:'全部',...categories}).map(([id,label])=>`<button type="button" data-filter="${id}" aria-pressed="${id===filter}">${label}</button>`).join('');
 $('#entries').innerHTML=entries.length?entries.map(n=>`<button class="entry ${n.id===selected?'selected':''}" data-id="${esc(n.id)}" aria-pressed="${n.id===selected}"><span class="entry-meta"><span><i class="dot" style="--dot:${colors[n.category]}"></i>${categories[n.category]}</span><time>${esc(n.date)}</time></span><span class="entry-title">${esc(n.title)}</span></button>`).join(''):'<p class="empty">这里还没有消息，写下第一条吧。</p>';
 persist();
}
function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function select(id){
 selected=id;formDirty=false;
 const n=items.find(n=>n.id===id)||{category:filter==='all'?'papers':filter,date:today()};
 fields.forEach(f=>$('#'+f).value=n[f]||'');
 $('#form-title').textContent=id?'编辑动态':'写一条新动态';$('#delete').hidden=!id;$('#form-status').textContent='';render();
}
function save(){
 if(!$('#form').reportValidity())return false;
 const n={...items.find(n=>n.id===selected),id:selected||crypto.randomUUID(),...Object.fromEntries(fields.map(f=>[f,$('#'+f).value.trim()]))};
 if(!n.title||!n.text){notice('标题和正文不能只包含空格。',true);return false;}
 const index=items.findIndex(v=>v.id===n.id);if(index<0)items.push(n);else items[index]=n;
 selected=n.id;formDirty=false;$('#form-title').textContent='编辑动态';$('#delete').hidden=false;render();$('#form-status').textContent='已保存到草稿';return true;
}
function canLeave(){return !formDirty||save();}
function validateImport(value){
 if(!Array.isArray(value)||value.length>3000)throw Error('请选择本编辑器导出的 JSON 草稿。');
 const ids=new Set(),limits={id:80,date:10,category:20,title:160,text:3000,work:1000,brief:40,stamp:100,note:100};
 for(const n of value){
  if(!n||typeof n!=='object'||Array.isArray(n)||Object.keys(n).some(k=>!(k in limits))||Object.entries(limits).some(([k,l])=>typeof(n[k]??'')!=='string'||(n[k]??'').length>l)||!/^[a-zA-Z0-9_-]{1,80}$/.test(n.id)||ids.has(n.id)||!(n.category in categories)||!n.title?.trim()||!n.text?.trim()||!/^\d{4}-\d{2}-\d{2}$/.test(n.date)||!Number.isFinite(Date.parse(n.date))||new Date(n.date).toISOString().slice(0,10)!==n.date)throw Error('草稿中存在无效或重复的动态，请检查文件。');
  ids.add(n.id);
 }return value;
}
function setBusy(value){busy=value;$('#workspace').inert=value;$('#toolbar').inert=value;$('#confirm-publish').disabled=value;$('#cancel-publish').disabled=value;$('#confirm-publish').textContent=value?'正在提交…':'确认发布';}
$('#form').addEventListener('input',()=>{formDirty=true;$('#form-status').textContent='';persist();});
$('#form').addEventListener('submit',e=>{e.preventDefault();save();});
$('#cancel-edit').onclick=()=>{if(!formDirty||confirm('放弃这条表单中尚未保存的修改？'))select(selected||[...items].sort((a,b)=>b.date.localeCompare(a.date))[0]?.id||null);};
$('#add').onclick=()=>{if(canLeave()){select(null);$('#title').focus();}};
$('#entries').onclick=e=>{const b=e.target.closest('[data-id]');if(b&&canLeave())select(b.dataset.id);};
$('#filters').onclick=e=>{const b=e.target.closest('[data-filter]');if(b){filter=b.dataset.filter;render();}};
$('#search').oninput=render;
$('#delete').onclick=()=>{const n=items.find(n=>n.id===selected);if(n&&confirm(`删除「${n.title}」？发布后才会从线上移除。`)){items=items.filter(n=>n.id!==selected);select([...items].sort((a,b)=>b.date.localeCompare(a.date))[0]?.id||null);}};
$('#export').onclick=()=>{if(!canLeave())return;const url=URL.createObjectURL(new Blob([JSON.stringify(items,null,2)+'\n'],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`团队动态草稿-${today()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notice('草稿已导出。可以用「导入草稿」恢复这些消息。');};
$('#import').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>2_000_000)throw Error('文件过大。');const value=validateImport(JSON.parse(await file.text()));if(confirm(`用导入的 ${value.length} 条动态替换当前草稿？线上内容暂不改变。`)){items=value;select(items[0]?.id||null);notice('已导入草稿，请预览检查后再发布。');}}catch(error){notice(error.message,true);}finally{e.target.value='';}};
$('#sync').onclick=async()=>{
 if(!confirm('重新读取线上版本会替换当前全部草稿和未保存表单。需要保留的内容请先导出。继续吗？'))return;
 setBusy(true);notice('正在读取 GitHub 上的最新版本…');
 try{const data=await api('sync',{});items=data.items;base=copy(items);sha=data.sha;select(items[0]?.id||null);notice('已读取线上最新版本。');}catch(error){notice(error.message,true);}finally{setBusy(false);persist();}
};
$('#preview').onclick=async()=>{
 if(!canLeave())return;setBusy(true);
 // A same-origin preview tab opened during the click avoids popup blocking after fetch.
 const tab=window.open('preview.html','news-editor-preview');
 try{await api('preview',{items});if(tab)tab.location.href='preview.html?ready='+Date.now();else notice('浏览器阻止了预览窗口，请允许此页面打开弹出窗口后重试。',true);}catch(error){tab?.close();notice(error.message,true);}finally{setBusy(false);persist();}
};
$('#publish').onclick=()=>{if(!canLeave())return;const changes=diff();if(!changes.length){notice('没有待发布的修改。');return;}$('#review-summary').textContent=`本次共 ${changes.length} 条变更，发布后共有 ${items.length} 条动态。`;$('#review-list').innerHTML=changes.map(({kind,n})=>`<div class="review-item">${kind} · ${esc(n.date)} · ${esc(n.title)}</div>`).join('');$('#review').showModal();};
$('#cancel-publish').onclick=()=>$('#review').close();
$('#review').addEventListener('cancel',e=>{if(busy)e.preventDefault();});
$('#confirm-publish').onclick=async()=>{
 setBusy(true);notice('正在提交到 GitHub，请稍候…');
 try{const result=await api('publish',{items,sha});sha=result.sha;base=copy(items);formDirty=false;$('#review').close();notice(result.unchanged?'线上内容已一致，无需重复提交。':result.warning||'已提交到 GitHub。请等待 GitHub Pages 部署完成，再查看线上网站。');if(result.actions){const a=document.createElement('a');a.href=result.actions;a.target='_blank';a.rel='noopener';a.textContent=' 查看部署进度 ↗';$('#notice').append(a);}}
 catch(error){$('#review').close();notice(error.message+' 草稿已保留。',true);}
 finally{setBusy(false);persist();}
};
window.addEventListener('beforeunload',e=>{if(busy){e.preventDefault();e.returnValue='';}});
async function start(){
 try{
  const data=await api('state');items=data.items;base=copy(items);sha=data.sha;token=data.token;
  let saved;try{saved=JSON.parse(localStorage.getItem(key));}catch{}
  let restored=false;
  if(saved){try{validateImport(saved.items);validateImport(saved.base);if(typeof saved.sha==='string'&&(JSON.stringify(saved.items)!==JSON.stringify(saved.base)||saved.formDirty)){items=saved.items;base=saved.base;sha=saved.sha;restored=true;}}catch{notice('旧草稿格式无法识别，已加载本地已发布副本。',true);}}
  $('#workspace').hidden=false;$('#toolbar').hidden=false;select(restored?saved.selected:([...items].sort((a,b)=>b.date.localeCompare(a.date))[0]?.id||null));
  if(restored&&saved.formDirty&&saved.form){fields.forEach(f=>$('#'+f).value=typeof saved.form[f]==='string'?saved.form[f]:'');formDirty=true;persist();}
  notice(restored?'已恢复上次草稿。尚未发布的修改也在这里。':'已打开本地副本。编辑只保存在草稿中，点击发布才会更新网站。');
 }catch(error){notice(error.message,true);}
}
start();
