"use strict";
/* Turns test answers and game figures into axis positions, a style name and grandmaster matches. */
function quizScores(){
  if(S.answers.every(a=>a===null))return null;
  const sum=Array(8).fill(0),n=Array(8).fill(0);
  QS.forEach(([ax,dir],i)=>{if(S.answers[i]!==null){sum[ax]+=S.answers[i]*dir;n[ax]++}});
  return sum.map((s,i)=>n[i]?s/(2*n[i]):0);
}
function combined(q,gs){
  const g=gs&&gs.style;
  return AXES.map((_,i)=>{const a=q?q[i]:null,b=g?g[i]:null;return a!==null&&b!==null?(a+b)/2:a!==null?a:b!==null?b:0});
}
function matchGMs(v){
  return GRANDMASTERS.map(g=>{const d=Math.sqrt(avg(AXES.map((a,i)=>(g.style[a.f]-v[i])**2)));return{name:g.name,era:g.title,blurb:g.blurb,study:g.study,pct:Math.round(clamp(100*(1-d/1.7),1,99))}}).sort((a,b)=>b.pct-a.pct);
}
function archetype(v){
  const o=v.map((x,i)=>[Math.abs(x),i,x]).sort((a,b)=>b[0]-a[0]);
  if(o[0][0]<.15)return"Universal player";
  const p=x=>x>0?0:1;
  return AXES[o[1][1]].adj[p(o[1][2])]+" "+AXES[o[0][1]].noun[p(o[0][2])];
}
