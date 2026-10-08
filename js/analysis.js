"use strict";
/* Reads PGN files, replays each game and counts the figures behind the style axes and the skill radar.
   Also fetches games from Lichess and Chess.com when the page is hosted on the web. */
function parsePGN(text){
  const out=[];
  for(const c of text.replace(/\r/g,"").split(/\n(?=\[Event\s)/)){
    const h={};c.replace(/^\[(\w+)\s+"(.*)"\]\s*$/gm,(_,k,v)=>{h[k]=v;return""});
    if(!h.White||!h.Black)continue;
    if((h.Variant&&!/^standard$/i.test(h.Variant))||h.FEN)continue;
    const body=c.replace(/^\[.*\]\s*$/gm,""),moves=[];
    const re=/\{([^}]*)\}|\([^)]*\)|\$\d+|([^\s{}()]+)/g;let m;
    while((m=re.exec(body))){
      if(m[1]!==undefined){const k=/%clk\s+([\d:.]+)/.exec(m[1]);if(k&&moves.length)moves[moves.length-1].clk=k[1].split(":").reduce((a,x)=>a*60+parseFloat(x),0)}
      else if(m[2]){const t=m[2].replace(/^\d+\.+/,"").replace(/[!?]+$/,"");if(t&&!/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t))moves.push({san:t,clk:null})}
    }
    if(moves.length>=10)out.push({h,moves});
  }
  return out;
}
function whoAmI(games,hint){
  const n={};games.forEach(g=>[g.h.White,g.h.Black].forEach(p=>{const k=p.toLowerCase();n[k]=(n[k]||0)+1}));
  if(hint&&n[hint.toLowerCase()])return hint.toLowerCase();
  return Object.keys(n).sort((a,b)=>n[b]-n[a])[0];
}
const VAL={p:1,n:3,b:3,r:5,q:9};
const TCS=[["bullet","Bullet"],["blitz","Blitz"],["rapid","Rapid"],["classical","Classical"],["daily","Daily"]];
function tcClass(tc){
  if(!tc||tc==="-"||tc.includes("/"))return"daily";
  const m=/^(\d+)(?:\+(\d+))?$/.exec(tc);if(!m)return"daily";
  const e=+m[1]+40*(+m[2]||0);return e<180?"bullet":e<480?"blitz":e<1500?"rapid":"classical";
}
const gameDate=h=>(h.UTCDate||h.Date||"")+" "+(h.UTCTime||h.EndTime||h.StartTime||"");
// Every counter is kept for both players, so each figure can be compared with the opponents actually faced.
function analyseGame(g,me){
  const white=g.h.White.toLowerCase()===me; if(!white&&g.h.Black.toLowerCase()!==me)return null;
  const my=white?"w":"b",op=white?"b":"w",r=g.h.Result;
  if(!/^(1-0|0-1|1\/2-1\/2)$/.test(r))return null;
  const s=r==="1/2-1/2"?.5:(r==="1-0")===white?1:0;
  const eMe=+g.h[white?"WhiteElo":"BlackElo"]||null,eOp=+g.h[white?"BlackElo":"WhiteElo"]||null;
  const exp=eMe&&eOp?1/(1+10**((eOp-eMe)/400)):null;
  const side=()=>({checks:0,storm:0,pawnX:0,init:0,qInit:0,gambit:false,clk:null,first:null,run:0});
  const ch=new Chess(),mat={w:39,b:39},npm={w:31,b:31},q={w:1,b:1},P={w:side(),b:side()};
  const o={white,s,exp,eMe,eOp,diff:exp===null?null:eOp-eMe,endgame:false,ahead:false,behind:false,b30:null,b70:null};
  const sans=[];let ra=0,rb=0,rd=0,ru=0,ply=0,lastCap=null,qDone=false,bal=0;
  for(const mv of g.moves){
    const m=ch.move(mv.san,{sloppy:true}); if(!m)break; ply++; sans.push(m.san);
    const c=P[m.color],ot=m.color==="w"?"b":"w";
    if(m.captured){mat[ot]-=VAL[m.captured];if(m.captured!=="p")npm[ot]-=VAL[m.captured];if(m.captured==="q")q[ot]--;
      if(ply<=30&&m.piece==="p"&&m.captured==="p")c.pawnX++;
      if(ply<=60&&lastCap!==m.to)c.init++;
      if(m.piece==="q"&&m.captured==="q"&&!qDone&&ply<=60){c.qInit=1;qDone=true}}
    lastCap=m.captured?m.to:null;
    if(m.promotion){mat[m.color]+=VAL[m.promotion]-1;npm[m.color]+=VAL[m.promotion];if(m.promotion==="q")q[m.color]++}
    if(/[+#]/.test(m.san))c.checks++;
    if(m.piece==="p"&&ply<=50&&/[gh]/.test(m.to[0])&&(m.color==="w"?+m.to[1]>=4:+m.to[1]<=5))c.storm++;
    if(mv.clk!==null)c.clk=mv.clk;
    if(c.first===null)c.first=m.san;
    for(const k of["w","b"]){const d=mat[k]-mat[k==="w"?"b":"w"];P[k].run=(d<=-1&&d>=-2&&ply<=40)?P[k].run+1:0;if(P[k].run>=8)P[k].gambit=true}
    bal=mat[my]-mat[op];
    ra=bal>=3?ra+1:0; rb=bal<=-3?rb+1:0; if(ra>=4)o.ahead=true; if(rb>=4)o.behind=true;
    rd=bal<=-1&&bal>=-2?rd+1:0; ru=bal>=1&&bal<=2?ru+1:0; if(rd>=8)o.down=true; if(ru>=8)o.up=true;
    if(!o.endgame&&npm.w<=13&&npm.b<=13){o.endgame=true;o.egPly=ply}
    if(ply===30)o.b30=bal; if(ply===70)o.b70=bal;
  }
  if(ply<10)return null;
  o.me=P[my];o.op=P[op];o.plies=ply;o.moves=Math.ceil(ply/2);o.mate=/#$/.test(g.moves[ply-1].san);
  if(o.b70===null&&o.b30!==null)o.b70=bal;
  o.onTime=/time/i.test(g.h.Termination||"")&&s!==.5;
  const tc=/^(\d+)(?:\+(\d+))?$/.exec(g.h.TimeControl||"");
  o.base=tc?+tc[1]:null;o.eco=g.h.ECO||null;o.tc=tcClass(g.h.TimeControl);o.san=sans.join(" ");delete P.w.run;delete P.b.run;
  return o;
}
function summarise(G){
  const n=G.length,pg=f=>avg(G.map(f)),sc=(x,scale)=>clamp(x/scale,-1,1),mix=a=>{a=a.filter(x=>x!==null);return a.length?avg(a):null};
  const share=(list,f)=>list.length?list.filter(f).length/list.length:null;
  const W=G.filter(g=>g.white),B=G.filter(g=>!g.white);
  const conc=list=>{if(list.length<5)return null;const c={};list.forEach(g=>{if(g.eco)c[g.eco]=(c[g.eco]||0)+1});return Object.values(c).sort((a,b)=>b-a).slice(0,3).reduce((a,b)=>a+b,0)/list.length};
  const clk=G.filter(g=>g.base&&g.me.clk!==null&&g.op.clk!==null);
  const cc=mix([conc(W),conc(B)]);
  // style: you minus your opponents in the same games (the e-file is your own repertoire, so it has no opponent figure)
  const style=[
    mix([sc(pg(g=>g.me.checks-g.op.checks),1.5),sc(pg(g=>(g.me.storm>0)-(g.op.storm>0)),.2)]),
    sc(pg(g=>g.me.init-g.op.init),1.2),
    sc(pg(g=>g.me.gambit-g.op.gambit),.12),
    mix([sc(pg(g=>g.me.pawnX-g.op.pawnX),.5),W.length>=5&&B.length>=5?sc(share(W,g=>g.me.first==="e4")-share(B,g=>g.op.first==="e4"),.4):null]),
    cc===null?null:clamp((cc-.45)/.3,-1,1),
    -sc(pg(g=>g.me.qInit-g.op.qInit),.12),
    clk.length>=5?sc(avg(clk.map(g=>(g.me.clk-g.op.clk)/g.base)),.15):null,
    null];
  const pc=x=>Math.round(100*x)+"%",pw=x=>(x>0?"+":x<0?"−":"")+Math.abs(x).toFixed(2),rows=[];
  const add=(key,what,you,opp,score,basis,minN,oppLabel)=>rows.push({key,what,you,opp,basis,low:minN<15,oppLabel:oppLabel||"Opponents",score:Math.round(clamp(score,5,97))});
  const miss=(key,what,need)=>rows.push({key,what,need,score:null});
  const perf=(key,what,list,need)=>{const r=list.filter(g=>g.exp!==null);if(r.length<5)return miss(key,what,need);const a=avg(r.map(g=>g.s)),e=avg(r.map(g=>g.exp));add(key,what,pc(a),pc(e),50+170*(a-e),r.length+" games",r.length,"Expected from ratings")};
  const o30=G.filter(g=>g.b30!==null),mid=G.filter(g=>g.plies>=40&&g.b30!==null),wins=G.filter(g=>g.s===1),losses=G.filter(g=>g.s===0),timed=G.filter(g=>g.base);
  const E=G.filter(g=>g.e),useEng=E.length>=5,eb="Engine, "+E.length+" games";
  let eng=null,w;
  // accuracy in one phase, you against your opponents, from engine evaluations
  const phase=(key,k,label,fallback)=>{
    const t=[0,0,0,0];E.forEach(g=>g.e.ph[k].forEach((x,i)=>t[i]+=x));
    if(!useEng||t[1]<40||t[3]<40)return fallback();
    const a=t[0]/t[1],b=t[2]/t[3];add(key,"Move accuracy, "+label,a.toFixed(1)+"%",b.toFixed(1)+"%",50+5*(a-b),eb+", "+t[1]+" moves",t[1]/4);
  };
  phase("opening","o","moves 1 to 15",()=>{w="Material after 15 moves, in pawns";
    if(o30.length>=5){const b=avg(o30.map(g=>g.b30));add("opening",w,pw(b),pw(-b),50+20*b,o30.length+" games",o30.length)}else miss("opening",w,"5 games of 15 moves or more")});
  phase("middle","m","move 16 to the endgame",()=>{w="Material won or lost, moves 15 to 35";
    if(mid.length>=5){const b=avg(mid.map(g=>g.b70-g.b30));add("middle",w,pw(b),pw(-b),50+14*b,mid.length+" games",mid.length)}else miss("middle",w,"5 games of 20 moves or more")});
  phase("endgame","e","in the endgame",()=>perf("endgame","Score in games that reached an endgame",G.filter(g=>g.endgame),"5 rated games that reached an endgame"));
  w="Wins by checkmate or inside 30 moves";
  if(wins.length>=5&&losses.length>=5){const f=g=>g.mate||g.moves<=30,a=share(wins,f),b=share(losses,f);add("attack",w,pc(a),pc(b),50+100*(a-b),wins.length+" wins, "+losses.length+" losses",Math.min(wins.length,losses.length))}else miss("attack",w,"5 wins and 5 losses");
  // defending and converting: engine positions when enough games have them, otherwise material
  const pair=(key,wEng,wMat,fe1,fe2,fm1,fm2,val1,val2,need)=>{
    let A=E.filter(fe1),B=E.filter(fe2),what=wEng,src="Engine, ";
    if(!useEng||A.length<4||B.length<4){A=G.filter(fm1);B=G.filter(fm2);what=wMat;src="";if(A.length<5||B.length<5)return miss(key,what,need)}
    const a=avg(A.map(val1)),b=avg(B.map(val2));add(key,what,pc(a),pc(b),50+120*(a-b),src+A.length+" yours, "+B.length+" theirs",Math.min(A.length,B.length));
  };
  pair("defence","Points scored from worse positions (engine −1 to −3)","Points scored after falling 1 or 2 points of material behind",g=>g.e.f.down,g=>g.e.f.up,g=>g.down,g=>g.up,g=>g.s,g=>1-g.s,"5 games where you fell behind and 5 where your opponent did");
  pair("convert","Wins from winning positions (engine +3 or better)","Wins after getting 3+ points of material ahead",g=>g.e.f.ahead,g=>g.e.f.behind,g=>g.ahead,g=>g.behind,g=>+(g.s===1),g=>+(g.s===0),"5 games where you got well ahead and 5 where your opponent did");
  w="Games lost on time";
  if(timed.length>=5){const a=share(timed,g=>g.onTime&&g.s===0),b=share(timed,g=>g.onTime&&g.s===1);add("clock",w,pc(a),pc(b),50+400*(b-a),timed.length+" games",timed.length)}else miss("clock",w,"5 games played with a clock");
  perf("upsets","Score against higher-rated players",G.filter(g=>g.diff!==null&&g.diff>=25),"5 rated games against players 25+ points above you");
  if(E.length){const t=[0,0,0,0];E.forEach(g=>["o","m","e"].forEach(k=>g.e.ph[k].forEach((x,i)=>t[i]+=x)));
    eng={n:E.length,acc:[t[1]?t[0]/t[1]:0,t[3]?t[2]/t[3]:0],bl:[avg(E.map(g=>g.e.bl[0])),avg(E.map(g=>g.e.bl[1]))]}}
  const skills={};rows.forEach(r=>skills[r.key]=r.score);
  const rated=G.filter(g=>g.eMe&&g.eOp);
  return{n,style,skills,rows,eng,rating:rated.length?[Math.round(avg(rated.map(g=>g.eMe))),Math.round(avg(rated.map(g=>g.eOp)))]:null};
}
function pickGames(data){
  const counts={};data.G.forEach(g=>counts[g.tc]=(counts[g.tc]||0)+1);
  let tc=S.tc||"all";if(tc!=="all"&&(counts[tc]||0)<10)tc="all";
  return{tc,counts,list:tc==="all"?data.G:data.G.filter(g=>g.tc===tc)};
}
function analysePGN(text,hint,onProgress){
  return new Promise((res,rej)=>{
    if(typeof Chess==="undefined")return rej(new Error("The chess library did not load. Check your connection and reload the page."));
    const all=parsePGN(text);if(!all.length)return rej(new Error("No standard games found in that file. Export your games as PGN and try again."));
    const me=whoAmI(all,hint),G=[];let i=0;
    // newest first, so the 150-game limit keeps the most recent games
    const games=all.filter(g=>g.h.White.toLowerCase()===me||g.h.Black.toLowerCase()===me).sort((a,b)=>gameDate(b.h).localeCompare(gameDate(a.h))).slice(0,150);
    (function step(){
      const t=Date.now();
      while(i<games.length&&Date.now()-t<40){const a=analyseGame(games[i++],me);if(a)G.push(a)}
      onProgress(i/games.length);
      if(i<games.length)return setTimeout(step,0);
      if(G.length<10)return rej(new Error("Only "+G.length+" usable games found for "+me+". At least 10 are needed."));
      res({v:4,player:me,G});
    })();
  });
}

async function fetchGames(platform,user){
  if(platform==="lichess"){
    const r=await fetch("https://lichess.org/api/games/user/"+encodeURIComponent(user)+"?max=150&rated=true&clocks=true&opening=true&perfType=bullet,blitz,rapid,classical",{headers:{Accept:"application/x-chess-pgn"}});
    if(!r.ok)throw new Error(r.status===404?"No Lichess account called "+user+".":"Lichess returned an error ("+r.status+").");
    return r.text();
  }
  const a=await fetch("https://api.chess.com/pub/player/"+encodeURIComponent(user.toLowerCase())+"/games/archives");
  if(!a.ok)throw new Error(a.status===404?"No Chess.com account called "+user+".":"Chess.com returned an error ("+a.status+").");
  const urls=((await a.json()).archives||[]).slice(-3).reverse();let out="";
  for(const u of urls){const r=await fetch(u+"/pgn");if(r.ok)out+=(await r.text())+"\n\n"}
  return out;
}
function parseAccount(v){
  v=v.trim();let m;
  if((m=/lichess\.org\/(?:@\/)?([\w-]+)/i.exec(v)))return{platform:"lichess",user:m[1]};
  if((m=/chess\.com\/(?:[a-z]{2}\/)?(?:member|players|stats\/[\w-]+(?:\/[\w-]+)?)\/([\w-]+)/i.exec(v)))return{platform:"chesscom",user:m[1]};
  if(/^[\w-]{2,30}$/.test(v))return{platform:S.platform,user:v};
  return null;
}
