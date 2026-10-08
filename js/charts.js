"use strict";
/* Draws the skill radar and the study lists. */
function radar(items){
  const cx=210,cy=165,R=105,n=items.length,pt=(i,r)=>{const a=-Math.PI/2+i*2*Math.PI/n;return[cx+r*Math.cos(a),cy+r*Math.sin(a)]};
  let s='<svg class="radar" viewBox="0 0 420 330" role="img" aria-label="Skill radar: '+items.map(i=>esc(i.label)+" "+(i.value===null?"no data":i.value)).join(", ")+'">';
  for(const k of[25,50,75,100])s+='<polygon class="ring" points="'+items.map((_,i)=>pt(i,R*k/100).map(x=>x.toFixed(1)).join(",")).join(" ")+'"/>';
  items.forEach((_,i)=>{const p=pt(i,R);s+='<line class="spoke" x1="'+cx+'" y1="'+cy+'" x2="'+p[0].toFixed(1)+'" y2="'+p[1].toFixed(1)+'"/>'});
  s+='<polygon class="shape" points="'+items.map((it,i)=>it.value===null?null:pt(i,R*it.value/100).map(x=>x.toFixed(1)).join(",")).filter(Boolean).join(" ")+'"/>';
  items.forEach((it,i)=>{
    const d=pt(i,R*(it.value||0)/100),l=pt(i,R+16),c=Math.cos(-Math.PI/2+i*2*Math.PI/n),sn=Math.sin(-Math.PI/2+i*2*Math.PI/n);
    const anchor=c>.3?"start":c<-.3?"end":"middle",dy=sn<-.5?-12:sn>.5?10:-2;
    if(it.value!==null)s+='<circle class="dot" cx="'+d[0].toFixed(1)+'" cy="'+d[1].toFixed(1)+'" r="4"/>';
    s+='<text x="'+l[0].toFixed(1)+'" y="'+(l[1]+dy).toFixed(1)+'" text-anchor="'+anchor+'">'+esc(it.label)+'</text>';
    s+='<text class="v" x="'+l[0].toFixed(1)+'" y="'+(l[1]+dy+14).toFixed(1)+'" text-anchor="'+anchor+'">'+(it.value===null?"too few games":it.value)+'</text>';
  });
  return s+"</svg>";
}
// up to three studies carrying this tag, as a short list
function studyList(tag){
  const l=STUDIES.filter(s=>s.tags.includes(tag)).slice(0,3);
  return l.length?'<ul class="study">'+l.map(s=>'<li><span class="kind">'+esc(s.type)+'</span><span><strong>'+esc(s.title)+'</strong>'+(s.note?". "+esc(s.note):"")+'</span></li>').join("")+'</ul>':"";
}
const skillItems=sk=>Object.keys(SKILLS).map(k=>({key:k,label:SKILLS[k][0],value:sk[k]===undefined?null:sk[k]}));
