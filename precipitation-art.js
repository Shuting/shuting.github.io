// Original vector illustration. Physical processes are schematic, not weather observations.
export function waterCycleArt(){
 const cloud=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="25" rx="111" ry="20" fill="#678896" opacity=".10" filter="url(#wc-soft)"/><path d="M-93 17C-123 16-125-22-95-29C-99-70-42-85-17-53C11-96 79-77 77-32C118-41 135 10 99 23C52 36-42 29-93 17Z" fill="url(#wc-cloud)"/><path d="M-87-14C-89-35-65-45-51-31M-10-43C9-65 40-57 49-37" stroke="#fffef7" fill="none" stroke-width="4" opacity=".8" stroke-linecap="round"/></g>`;
 const tree=(x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="4" cy="8" rx="16" ry="5" fill="#5d786b" opacity=".1"/><path d="M0-28V7" stroke="#8f9877" stroke-width="3"/><path d="M0-52C-13-40-25-10-18-5C-6 3 15 0 19-5C23-14 10-43 0-52Z" fill="#92af8c"/><path d="M0-52V-4C9-1 15-3 19-5C23-14 10-43 0-52Z" fill="#a9bf95"/></g>`;
 return `<svg class="wc-landscape" viewBox="0 0 1200 560" aria-hidden="true"><defs>
 <linearGradient id="wc-sea" x2="0" y2="1"><stop stop-color="#c0dde0"/><stop offset="1" stop-color="#91c1cd"/></linearGradient><linearGradient id="wc-soil" x2="0" y2="1"><stop stop-color="#dddac4"/><stop offset="1" stop-color="#ede9dc"/></linearGradient><linearGradient id="wc-land" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#dfe5c6"/><stop offset="1" stop-color="#b8cbaa"/></linearGradient><linearGradient id="wc-cloud" x2=".2" y2="1"><stop stop-color="#fffef8"/><stop offset=".5" stop-color="#f4f6ed"/><stop offset="1" stop-color="#cbdde0"/></linearGradient><radialGradient id="wc-sun"><stop stop-color="#f4e2a5"/><stop offset=".7" stop-color="#e7ce87"/><stop offset="1" stop-color="#ebdba8" stop-opacity=".15"/></radialGradient><linearGradient id="wc-scan"><stop stop-color="#7eacb6" stop-opacity=".02"/><stop offset="1" stop-color="#7eacb6" stop-opacity=".2"/></linearGradient><filter id="wc-soft"><feGaussianBlur stdDeviation="9"/></filter><marker id="wc-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M1 1L6 4L1 7" fill="none" stroke="#a6b5aa" stroke-width="1"/></marker>
 <clipPath id="wc-rain-mask"><rect x="680" y="180" width="280" height="175"/></clipPath>
 <path id="wc-vapor-path" d="M245 363C215 309 256 287 248 238S278 172 330 158"/>
 <path id="wc-wind-path" d="M425 112C507 61 613 75 691 111"/>
 <path id="wc-river-path" d="M910 329C857 363 797 338 791 372S703 393 663 415S548 414 497 439"/>
 </defs>
 <ellipse cx="616" cy="479" rx="500" ry="34" fill="#a7b7a5" opacity=".12" filter="url(#wc-soft)"/>
 <g class="wc-stage-art wc-evap-art"><circle cx="159" cy="121" r="61" fill="#edd99a" opacity=".13"/><circle cx="159" cy="121" r="35" fill="url(#wc-sun)"/>${Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return `<path d="M${159+49*Math.cos(a)} ${121+49*Math.sin(a)}l${8*Math.cos(a)} ${8*Math.sin(a)}" stroke="#dec88b" stroke-width="1.2" stroke-linecap="round"/>`;}).join('')}</g>
 <path d="M88 377C170 347 341 323 517 343L592 419L500 463C315 479 154 455 88 427Z" fill="#80acba" opacity=".43"/>
 <path d="M88 358C221 325 376 312 532 337L602 404L497 443C315 462 154 438 88 409Z" fill="url(#wc-sea)"/>
 <path d="M497 443L602 404L1118 363L1118 404C991 473 731 505 497 479Z" fill="url(#wc-soil)"/>
 <path d="M497 443C540 414 565 365 642 344C731 317 752 320 816 301L1012 296L1118 363C991 426 731 469 497 443Z" fill="url(#wc-land)"/>
 <path d="M668 350L802 221L887 322L954 190L1076 336L1118 363C938 399 802 388 668 350Z" fill="#b7c9b2"/>
 <path d="M802 221L887 322L847 340L805 269L769 310Z" fill="#ced9bd"/><path d="M954 190L1076 336L1029 342L969 260L951 222L918 262Z" fill="#dce2c7"/><path d="M954 190L918 262L939 249L951 254L962 241L973 251Z" fill="#f2f1de"/><path d="M802 221L769 266L788 260L800 270L810 254L824 263Z" fill="#e8ebd4"/>
 <path d="M634 360C765 386 864 408 1023 359" fill="none" stroke="#e4e7cd" stroke-width="1.5"/>
 <g class="wc-stage-art wc-runoff-art"><use href="#wc-river-path" fill="none" stroke="#ecf1de" stroke-width="13"/><use href="#wc-river-path" fill="none" stroke="#8fbdc7" stroke-width="9"/><use href="#wc-river-path" class="wc-river-flow" fill="none" stroke="#c7e1e1" stroke-width="2" stroke-dasharray="14 18"/>
 <path d="M936 413L928 440M981 405L971 435M858 430L852 454" stroke="#b1bfa9" stroke-width="1.5" stroke-dasharray="3 5" marker-end="url(#wc-arrow)"/><path d="M939 462C814 493 697 477 567 466" fill="none" stroke="#a3bdb9" stroke-width="1.5" stroke-dasharray="5 8" marker-end="url(#wc-arrow)"/></g>
 ${[[672,352,.8],[693,345,.6],[719,356,.75],[1042,348,.8],[1070,351,.65],[1005,355,.55],[760,392,.65],[740,388,.8],[608,396,.55]].map(t=>tree(...t)).join('')}
 <g class="wc-sea-waves" fill="none" stroke="#d9ebea" stroke-linecap="round" opacity=".8"><path d="M139 375q28 10 56 0m32-14q27 9 54 0m38 20q37 11 73 0m-240 26q25 8 51 0m99 10q29 7 58-1m51-64q22 7 47 0"/><path d="M247 395q21 7 46 0m98 28q29 7 54-1m-251-59q12 3 26 0"/></g>
 <g class="wc-stage-art wc-evap-art"><use href="#wc-vapor-path" fill="none" stroke="#9ebdc1" stroke-width="2" stroke-dasharray="5 8" marker-end="url(#wc-arrow)"/><path class="wc-vapor" d="M300 340C275 312 322 297 302 273M199 349C173 323 217 299 198 276" fill="none" stroke="#a2c5ca" stroke-width="2" stroke-linecap="round"/>${Array.from({length:5},(_,i)=>`<circle r="${3+i%2}" fill="#93bbc7" opacity=".65"><animateMotion dur="8s" begin="-${i*1.6}s" repeatCount="indefinite"><mpath href="#wc-vapor-path"/></animateMotion></circle>`).join('')}</g>
 <g class="wc-stage-art wc-cloud-art"><use href="#wc-wind-path" fill="none" stroke="#b4c0b2" stroke-width="1.5" stroke-dasharray="4 7" marker-end="url(#wc-arrow)"/><g class="wc-drifting-cloud">${cloud(374,169,.8)}</g><path d="M486 171C522 151 564 155 606 173M528 192C548 185 583 187 601 194" fill="none" stroke="#d2dcd0" stroke-width="1.5" stroke-linecap="round"/></g>
 <g class="wc-stage-art wc-rain-art"><g clip-path="url(#wc-rain-mask)"><g class="wc-falling-rain">${Array.from({length:36},(_,i)=>{const x=710+i%9*26,y=155+Math.floor(i/9)*53;return `<path d="M${x} ${y}l-9 21" stroke="${i%3?'#9dbfc9':'#81aab9'}" stroke-width="${i%3?1.5:2}" opacity="${.3+i%4*.14}" stroke-linecap="round"/>`;}).join('')}</g></g>${cloud(796,175,1.12)}</g>
 <g class="wc-radar-art" transform="translate(650 375)"><ellipse rx="92" ry="32" fill="none" stroke="#799eab" opacity=".25"/><ellipse rx="60" ry="21" fill="none" stroke="#799eab" opacity=".32"/><path class="wc-radar-sweep" d="M0 0L-70-22A92 32 0 0 1 84-13Z" fill="url(#wc-scan)"/><path d="M0-5V-37M-12-5h24M-10-26l10 21 10-21" stroke="#7a9396" fill="none" stroke-width="2"/><path d="M-16-43Q0-23 16-43Q0-47-16-43Z" fill="#e5e9dc" stroke="#8aa1a1" stroke-width="1.5"/><circle cy="-45" r="3" fill="#c7a875"/></g>
 <text x="259" y="446" text-anchor="middle" fill="#719ca7" font-family="Georgia,serif" font-size="10" letter-spacing="3">OCEAN</text>
 <text x="969" y="458" text-anchor="middle" fill="#a3ad95" font-family="Georgia,serif" font-size="9" letter-spacing="2">LAND & GROUNDWATER</text>
 </svg>`;
}

export function radarFrame(frame=0,prefix='radar'){
 const cells=[];
 for(let y=0;y<21;y++)for(let x=0;x<27;x++){
  const shift=frame*1.5;
  const a=Math.exp(-((x-7-shift)**2/15+(y-10+frame*.35)**2/25));
  const b=.7*Math.exp(-((x-16-shift*.5)**2/11+(y-6-frame*.3)**2/13));
  const c=.45*Math.exp(-((x-10-shift)**2/35+(y-16)**2/4));
  const value=a+b+c;
  if(value>.1){const palette=['#dce7d2','#bdd2b5','#90b9ab','#6d9ea7','#deb978'];const level=Math.min(4,Math.floor(value*4.4));cells.push(`<rect x="${18+x*9}" y="${15+y*9}" width="8.6" height="8.6" rx="1.5" fill="${palette[level]}" opacity=".88"/>`);}
 }
 return `<svg viewBox="0 0 280 220" aria-hidden="true"><defs><pattern id="${prefix}-grid" width="27" height="27" patternUnits="userSpaceOnUse"><path d="M27 0H0V27" fill="none" stroke="#bbcdd0" stroke-width=".5"/></pattern><clipPath id="${prefix}-clip"><rect x="10" y="8" width="260" height="204" rx="7"/></clipPath></defs><rect x="10" y="8" width="260" height="204" rx="7" fill="#edf1e9"/><rect x="10" y="8" width="260" height="204" rx="7" fill="url(#${prefix}-grid)" opacity=".5"/><g clip-path="url(#${prefix}-clip)">${cells.join('')}<path d="M49 20C70 64 34 78 71 122S135 142 118 213" fill="none" stroke="#eff5eb" stroke-width="2" opacity=".6"/></g><path d="M245 31v20m-5-14 5-6 5 6" stroke="#a4b5b2" fill="none" stroke-width="1"/></svg>`;
}
