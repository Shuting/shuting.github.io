// Authored isometric garden; its traversable graph is also used for the animation.
export const COLS=9,ROWS=7,CELL=62;
export const mainRoute=[[0,6],[1,6],[1,5],[2,5],[3,5],[3,4],[2,4],[2,3],[1,3],[1,2],[2,2],[3,2],[3,1],[4,1],[5,1],[5,2],[5,3],[4,3],[4,4],[5,4],[6,4],[6,5],[7,5],[7,4],[7,3],[7,2],[6,2],[6,1],[7,1],[8,1],[8,0]];
const key=([x,y])=>`${x},${y}`;
export const project=(x,y,z=0)=>({x:430+(x-y)*.86,y:66+(x+y)*.43-z});
export const cellPoint=([x,y])=>project((x+.5)*CELL,(y+.5)*CELL);
export function createMaze(){
 const graph=new Map(Array.from({length:COLS*ROWS},(_,i)=>[`${i%COLS},${Math.floor(i/COLS)}`,[]]));
 const connect=(a,b)=>{graph.get(key(a)).push(key(b));graph.get(key(b)).push(key(a));};
 const visited=new Set(mainRoute.map(key));mainRoute.slice(1).forEach((p,i)=>connect(mainRoute[i],p));
 let seed=47;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 // Grow branches from the deliberately composed main path without introducing loops.
 while(visited.size<COLS*ROWS){
  const choices=[];
  for(const a of visited){const [x,y]=a.split(',').map(Number);for(const b of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]])if(b[0]>=0&&b[0]<COLS&&b[1]>=0&&b[1]<ROWS&&!visited.has(key(b)))choices.push([[x,y],b]);}
  const [a,b]=choices[Math.floor(random()*choices.length)];connect(a,b);visited.add(key(b));
 }
 function route(from,to){
  const a=key(from),b=key(to),queue=[a],parents=new Map([[a,null]]);
  for(let i=0;i<queue.length;i++){const v=queue[i];if(v===b)break;for(const n of graph.get(v))if(!parents.has(n)){parents.set(n,v);queue.push(n);}}
  const result=[];for(let v=b;v!==null;v=parents.get(v))result.push(v.split(',').map(Number));return result.reverse();
 }
 return {graph,route};
}
const polygon=points=>points.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
export const pathData=cells=>cells.map((c,i)=>{const p=cellPoint(c);return `${i?'L':'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;}).join(' ');
function hedge(x0,y0,x1,y1){
 const h=16,a=project(x0,y0,h),b=project(x1,y0,h),c=project(x1,y1,h),d=project(x0,y1,h);
 return `<g><polygon points="${polygon([d,c,project(x1,y1),project(x0,y1)])}" fill="#6e936a"/><polygon points="${polygon([b,c,project(x1,y1),project(x1,y0)])}" fill="#87a67a"/><polygon points="${polygon([a,b,c,d])}" fill="#bdd29d" stroke="#9eb884" stroke-width=".6"/><path d="M${a.x+2} ${a.y}L${b.x-1} ${b.y}" stroke="#dce7bf" stroke-width="1" opacity=".8"/></g>`;
}
function tree(x,y,s=1){return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="5" rx="20" ry="7" fill="#8da378" opacity=".15"/><path d="M0 0V-24" stroke="#a39166" stroke-width="4"/><circle cy="-34" r="17" fill="#b2c995"/><circle cx="-7" cy="-30" r="12" fill="#a2be85"/><circle cx="5" cy="-38" r="10" fill="#c8d9ac"/></g>`;}
export function mazeArt(maze){
 const walls=[];
 for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
  const neighbors=maze.graph.get(`${x},${y}`);
  if((y===0||!neighbors.includes(`${x},${y-1}`))&&!(x===8&&y===0))walls.push([x*CELL-4,y*CELL-4,(x+1)*CELL+4,y*CELL+4]);
  if((x===0||!neighbors.includes(`${x-1},${y}`))&&!(x===0&&y===6))walls.push([x*CELL-4,y*CELL-4,x*CELL+4,(y+1)*CELL+4]);
  if(x===COLS-1)walls.push([(x+1)*CELL-4,y*CELL-4,(x+1)*CELL+4,(y+1)*CELL+4]);
  if(y===ROWS-1)walls.push([x*CELL-4,(y+1)*CELL-4,(x+1)*CELL+4,(y+1)*CELL+4]);
 }
 walls.sort((a,b)=>(a[0]+a[1]+a[2]+a[3])-(b[0]+b[1]+b[2]+b[3]));
 const corners=[[-18,-18],[COLS*CELL+18,-18],[COLS*CELL+18,ROWS*CELL+18],[-18,ROWS*CELL+18]];
 const floor=corners.map(p=>project(...p));
 const end=cellPoint(mainRoute.at(-1));
 return `<svg class="jm-maze-svg" viewBox="0 0 1050 590" role="img" aria-label="有入口、分岔小径和研究室终点的立体绿篱迷宫"><defs><radialGradient id="jm-ground"><stop stop-color="#e6ebd6"/><stop offset="1" stop-color="#f6f5ef" stop-opacity="0"/></radialGradient></defs><ellipse cx="520" cy="333" rx="510" ry="238" fill="url(#jm-ground)"/><polygon points="${polygon([floor[3],floor[2],project(...corners[2],-14),project(...corners[3],-14)])}" fill="#c7cba8"/><polygon points="${polygon([floor[1],floor[2],project(...corners[2],-14),project(...corners[1],-14)])}" fill="#b8c5a4"/><polygon points="${polygon(floor)}" fill="#ede8d0" stroke="#cbd0ae" stroke-width="1.2"/>
 <path id="jm-full-path" d="${pathData(mainRoute)}" fill="none" stroke="#bfa467" stroke-width="6" stroke-dasharray="1 10" stroke-linecap="round" opacity="0"/>
 <path id="jm-visited-path" d="${pathData([mainRoute[0]])}" fill="none" stroke="#c39b53" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
 ${walls.map(w=>hedge(...w)).join('')}
 <path d="M${end.x} ${end.y}l32-16 32-16" fill="none" stroke="#c7b88d" stroke-width="9" stroke-dasharray="2 6"/>
 <g transform="translate(928 258)"><ellipse cy="42" rx="48" ry="13" fill="#6d8b7820"/><path d="M-34 0L0 17V48L-34 32Z" fill="#eae0bc" stroke="#c1b58e"/><path d="M0 17L34 0V32L0 48Z" fill="#d0d8bd" stroke="#a5b598"/><path d="M-42 0L-8-35L35-17L0 22Z" fill="#80a299" stroke="#66877f"/><path d="M0 22L35-17L42 0L0 22Z" fill="#547c76"/><path d="M10 43V24L22 18V37" fill="#608c8a"/><path d="M-25 10L-12 16V28L-25 22Z" fill="#7fa8ac" stroke="#f8f0d6" stroke-width="2"/><path d="M-8-35V-60" stroke="#947f56" stroke-width="2"/><path d="M-7-59L15-51L-7-45Z" fill="#d3ad66"/><text x="4" y="72" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="#537462" letter-spacing="1">HELLO, TOGETHER.</text></g>
 ${tree(377,57,.7)}${tree(300,87,.5)}${tree(163,364,.65)}${tree(764,477,.65)}${tree(691,512,.5)}
 <g fill="#b9a05e">${[[218,383],[247,395],[681,528],[793,462]].map(([x,y])=>`<path d="M${x} ${y-4}v8m-4-4h8" stroke="#b9a05e" stroke-width="1.6"/>`).join('')}</g>
 <g id="jm-traveler" transform="translate(${cellPoint(mainRoute[0]).x} ${cellPoint(mainRoute[0]).y})"><ellipse cy="4" rx="11" ry="5" fill="#7a75434d"/><circle cy="-6" r="11" fill="#e5b762" stroke="#fff9e9" stroke-width="2.5"/><path d="M-4-6h8m-4-4v8" stroke="#7c663e" stroke-width="1.3"/></g>
 <text x="250" y="550" font-family="Georgia,serif" font-size="9" letter-spacing="3" fill="#7d8d6c">A LITTLE MAZE OF POSSIBILITIES</text></svg>`;
}
