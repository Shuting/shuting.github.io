// Original conceptual illustrations; no observed weather or model output is used.
const palette=['#9dbec7','#aecbc8','#c5d6bd','#dce0b9','#e9dfb1','#e6cda4','#d8b29b','#c79b91'];
export function syntheticTemperature(x,y,corrected=false){
  const local=24+3*x+1.5*Math.sin(x*5+y*3)-5*Math.exp(-((x-.67)**2/.035+(y-.38)**2/.055));
  return local+(corrected?0:2);
}
function color(value){return palette[Math.max(0,Math.min(palette.length-1,Math.floor((value-19)/1.5)))];}
function tileCells(n,corrected,project){
 let cells='';for(let j=0;j<n;j++)for(let i=0;i<n;i++){
  const pts=[[i/n,j/n],[(i+1)/n,j/n],[(i+1)/n,(j+1)/n],[i/n,(j+1)/n]].map(([u,v])=>project(u,v).join(',')).join(' ');
  cells+=`<polygon points="${pts}" fill="${color(syntheticTemperature((i+.5)/n,(j+.5)/n,corrected))}" stroke="#f9f7ec" stroke-width="${n>10?.35:.65}" stroke-opacity=".55"/>`;
 }return cells;
}
export function temperatureMap(fine=false,corrected=false){
 const n=fine?24:6;
 return `<svg viewBox="0 0 420 300" role="img" aria-label="合成温度场，${fine?'细网格':'粗网格'}，${corrected?'移除预设暖偏差':'带有预设暖偏差'}"><defs><clipPath id="nw-temp-clip"><rect x="22" y="18" width="376" height="250" rx="9"/></clipPath></defs><g clip-path="url(#nw-temp-clip)">${tileCells(n,corrected,(u,v)=>[22+376*u,18+250*v])}<path d="M22 150C85 160 99 108 137 124S167 184 197 199S186 246 241 268H22Z" fill="#c9e0e2" fill-opacity=".55"/><path d="M22 150C85 160 99 108 137 124S167 184 197 199S186 246 241 268" fill="none" stroke="#faf8e9" stroke-width="2"/><path d="M214 91C240 51 302 52 338 88M224 100C250 69 290 69 322 97M235 111C261 87 278 91 301 110" fill="none" stroke="#f7f5e6" stroke-width="1" opacity=".6"/></g><path d="M375 38v24m-5-17 5-7 5 7" stroke="#617f7e" fill="none"/><text x="375" y="33" text-anchor="middle" fill="#617f7e" font-family="Georgia,serif" font-size="8">N</text><text x="24" y="288" fill="#7e9387" font-family="Georgia,serif" font-size="9" letter-spacing="1.5">SYNTHETIC TEMPERATURE FIELD</text><text x="397" y="288" text-anchor="end" fill="#8c9d8b" font-family="Georgia,serif" font-size="9">${n} × ${n}</text></svg>`;
}
function cloud(x,y,s=1){return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-95 16C-123 10-120-26-91-31C-93-72-40-88-14-53C16-91 76-70 76-31C115-38 133 12 96 25C54 37-51 33-95 16Z" fill="url(#nw-cloud)"/><path d="M-79-22C-76-41-57-45-44-34M-6-47C16-64 39-55 47-39" fill="none" stroke="#fffef8" stroke-width="3" stroke-linecap="round" opacity=".8"/></g>`;}
const plane=(z,extra='')=>{
 let lines='';for(let i=1;i<6;i++){const t=i/6;lines+=`<path d="M${240+320*t} ${340-120*t-z}L${570+320*t} ${480-130*t-z}M${240+330*t} ${340+140*t-z}L${560+330*t} ${220+130*t-z}"/>`;}
 return `<g class="nw-grid-plane ${extra}" fill="none" stroke="#91afb4" stroke-width=".85"><path d="M240 ${340-z}L560 ${220-z}L890 ${350-z}L570 ${480-z}Z" fill="#d6e7e5" fill-opacity=".055"/>${lines}</g>`;
};
export function modelWorld(){
 return `<svg class="nw-world-art" viewBox="0 0 1200 600" aria-hidden="true"><defs><linearGradient id="nw-cloud" x2=".2" y2="1"><stop stop-color="#fffef8"/><stop offset=".55" stop-color="#f0f3e8"/><stop offset="1" stop-color="#c0d6dc"/></linearGradient><linearGradient id="nw-ocean" x2=".4" y2="1"><stop stop-color="#d2e5e2"/><stop offset="1" stop-color="#a2c5ce"/></linearGradient><linearGradient id="nw-ground" x2=".4" y2="1"><stop stop-color="#e0e5c9"/><stop offset="1" stop-color="#b4c7a3"/></linearGradient><linearGradient id="nw-cut" x2="0" y2="1"><stop stop-color="#d1d4bc"/><stop offset="1" stop-color="#ece8da"/></linearGradient><filter id="nw-shadow"><feGaussianBlur stdDeviation="12"/></filter></defs>
 <ellipse cx="595" cy="520" rx="320" ry="29" fill="#8ba58d" opacity=".13" filter="url(#nw-shadow)"/>
 <g class="nw-atmosphere-back" stroke="#aec5c5" stroke-width=".9" fill="none" opacity=".6"><path d="M240 340V120L560 0L890 130V350M560 0V220" stroke-dasharray="4 6"/>${plane(220)}</g>
 <path d="M240 340L570 480L890 350V382L570 512L240 372Z" fill="url(#nw-cut)"/><path d="M240 340L560 220L890 350L570 480Z" fill="url(#nw-ground)"/>
 <path d="M240 340L452 260C475 299 515 293 493 330S531 375 550 394S540 441 570 480Z" fill="url(#nw-ocean)"/><path d="M452 260C475 299 515 293 493 330S531 375 550 394S540 441 570 480" fill="none" stroke="#f0f0d9" stroke-width="3"/>
 <path d="M530 339L635 239L702 321L753 244L850 350L718 405Z" fill="#afc5a6"/><path d="M635 239L702 321L665 345L634 271L599 304Z" fill="#d5dfbd"/><path d="M753 244L850 350L809 361L759 281L740 301L715 322Z" fill="#cad7b5"/><path d="M635 239L611 275L629 270L636 278L644 267L654 274Z" fill="#eeefdc"/>
 <path d="M719 353C676 384 647 357 626 386S587 392 550 418" fill="none" stroke="#cce0db" stroke-width="7"/><path d="M719 353C676 384 647 357 626 386S587 392 550 418" fill="none" stroke="#91b9c2" stroke-width="4"/>
 <g fill="none" stroke="#e5eee7" stroke-width="1.2" opacity=".8"><path d="M313 349l35 15m14-38 42 18m3 27 42 17m22 25 31 14"/></g>
 <g class="nw-mid-grid">${plane(70)}${plane(140)}</g>
 <g class="nw-cloud-layer"><g class="nw-cloud-drift">${cloud(517,223,1.05)}${cloud(700,206,.58)}</g>
 <g class="nw-particles" fill="#8cabb6" opacity=".65">${Array.from({length:13},(_,i)=>`<circle cx="${445+i%5*28}" cy="${258+Math.floor(i/5)*22}" r="${i%3?2:3}" style="--d:${i*.17}s"/>`).join('')}</g>
 <g stroke="#9dbbc4" stroke-width="1.3" stroke-linecap="round" opacity=".8"><path d="M657 157v14m-6-11 12 8m-12 0 12-8M612 145v10m-4-8 8 6m-8 0 8-6"/></g></g>
 <g class="nw-front-grid" fill="none" stroke="#9ebbbd" stroke-width=".9" opacity=".62"><path d="M240 120V340M570 260V480M890 130V350M240 120L570 260L890 130M240 193L570 333L890 203M240 267L570 407L890 277"/>${Array.from({length:5},(_,i)=>{const t=(i+1)/6;return `<path d="M${240+330*t} ${120+140*t}v220M${570+320*t} ${260-130*t}v220"/>`;}).join('')}</g>
 <g class="nw-learned-cell"><path d="M405 263L460 286V359L405 336Z" fill="#ebd8a4" fill-opacity=".28" stroke="#c4a572" stroke-width="1.5"/><g stroke="#bd9c6a" stroke-width="1" fill="#f3e6c3"><path d="M417 283L446 310L419 323M417 283L419 323L446 338L446 310" fill="none"/><circle cx="417" cy="283" r="3.5"/><circle cx="446" cy="310" r="4"/><circle cx="419" cy="323" r="3.5"/><circle cx="446" cy="338" r="3"/></g></g>
 <g class="nw-output-sheet"><path d="M889 398L1041 343L1171 398L1019 457V471L889 412Z" fill="#d8dfca" opacity=".8"/>${tileCells(6,false,(u,v)=>[889+152*u+130*v,398-55*u+55*v])}<path d="M923 394C955 385 959 412 995 404S1033 418 1071 410" stroke="#f7f5e7" stroke-width="1.5" fill="none"/><text x="1030" y="485" text-anchor="middle" font-family="Georgia,serif" font-size="9" letter-spacing="2" fill="#9aa48b">NWP OUTPUT</text></g>
 <path class="nw-output-flow" d="M828 396C857 430 863 430 899 431" stroke="#acbba6" stroke-width="1.3" stroke-dasharray="4 6" fill="none"/>
 <g class="nw-hero-leaders" fill="none" stroke="#b49870" stroke-width="1.2"><path d="M214 222H291L417 283M1040 320V347"/><circle cx="417" cy="283" r="4" fill="#c2a274" stroke="#f6f5ef" stroke-width="2"/><circle cx="1040" cy="347" r="4" fill="#c2a274" stroke="#f6f5ef" stroke-width="2"/></g>
 <text x="370" y="480" fill="#94a69b" font-family="Georgia,serif" font-size="9" letter-spacing="3" transform="rotate(23 370 480)">A LITTLE PIECE OF THE ATMOSPHERE</text>
 </svg>`;
}
export function columnArt(){return `<svg viewBox="0 0 260 360" aria-hidden="true"><defs><linearGradient id="nw-column" x2="0" y2="1"><stop stop-color="#d3e4e7" stop-opacity=".25"/><stop offset="1" stop-color="#ccdcc8" stop-opacity=".65"/></linearGradient></defs><path d="M75 49L131 28L191 52V282L133 306L75 280Z" fill="url(#nw-column)" stroke="#b4c9c6"/>${[0,1,2,3,4].map((n)=>`<path d="M75 ${49+n*46}L133 ${72+n*46}L191 ${52+n*46}" fill="none" stroke="#bbceca"/><text x="55" y="${70+n*46}" fill="#9cafa3" font-family="Georgia,serif" font-size="9">z${5-n}</text>`).join('')}<path d="M133 72V306" stroke="#bfd1ca"/><g fill="#9ab8c3"><circle cx="119" cy="118" r="4"/><circle cx="147" cy="133" r="3"/><circle cx="115" cy="172" r="5"/><circle cx="157" cy="182" r="4"/><circle cx="130" cy="224" r="6"/></g><g fill="none" stroke="#8baebd" stroke-width="1.5"><path d="M117 81v14m-6-11 12 8m-12 0 12-8M150 90v12m-5-9 10 6m-10 0 10-6"/></g><path d="M132 245c-15 21-15 25 0 27c14-2 14-7 0-27Z" fill="#96b9c4"/><path d="M207 60V279m-4-7 4 7 4-7" stroke="#b5bfa8" fill="none"/><text x="132" y="342" text-anchor="middle" fill="#829a90" font-family="Georgia,serif" font-size="9" letter-spacing="2">A VERTICAL COLUMN</text></svg>`;}
