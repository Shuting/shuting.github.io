// Transparent illustrations generated for this site; keep their natural basket colors.
export function balloonArt(id,color){
 const asset={'#c6a4a0':'rose','#a9bfa1':'sage','#9fbcc7':'blue','#d3bd86':'gold'}[color]||'sage';
 return `<img class="balloon-illustration" src="./assets/news/balloons/balloon-${asset}.png?v=ropes2" alt="" width="1024" height="1536" draggable="false">`;
}
export const terrainFallback='<img class="news-valley-illustration" src="./assets/news/balloons/river-valley.png" alt="" width="2172" height="724" draggable="false">';
