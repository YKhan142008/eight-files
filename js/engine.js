"use strict";
/* Optional Stockfish analysis. Runs in a web worker in the visitor's browser. */
const SF=["https://cdn.jsdelivr.net/npm/stockfish@10.0.2/src/stockfish.asm.js","https://unpkg.com/stockfish@10.0.2/src/stockfish.asm.js"],DEPTH=8,MAXPLY=120,BATCH=30;
let RUN=null; // {p, stop, error}
function startEngine(){
  return new Promise((res,rej)=>{
    let w;try{w=new Worker(URL.createObjectURL(new Blob(['try{importScripts("'+SF[0]+'")}catch(e){importScripts("'+SF[1]+'")}'],{type:"text/javascript"})))}catch(e){return rej(e)}
    const t=setTimeout(()=>{w.terminate();rej(new Error("timeout"))},45000);
    w.onerror=()=>{clearTimeout(t);w.terminate();rej(new Error("load"))};
    w.onmessage=e=>{if(String(e.data).startsWith("uciok")){clearTimeout(t);res(w)}};
    w.postMessage("uci");
  });
}
function evalFen(w,fen){
  return new Promise(res=>{let cp=0;
    w.onmessage=e=>{const l=String(e.data),m=/score (cp|mate) (-?\d+)/.exec(l);
      if(m)cp=m[1]==="cp"?clamp(+m[2],-1000,1000):(+m[2]>0?1000:-1000);
      else if(l.startsWith("bestmove"))res(cp)};
    w.postMessage("position fen "+fen);w.postMessage("go depth "+DEPTH)});
}
// win chance and per-move accuracy use the formulas Lichess publishes
const winPct=cp=>50+50*(2/(1+Math.exp(-0.00368208*cp))-1);
function scoreEvals(g,E){
  const sgn=g.white?1:-1,ph={o:[0,0,0,0],m:[0,0,0,0],e:[0,0,0,0]},bl=[0,0],f={};let ra=0,rb=0,rd=0,ru=0;
  for(let i=1;i<E.length;i++){
    const wm=i%2===1,mine=wm===g.white,s=wm?1:-1;
    const drop=Math.max(0,winPct(s*E[i-1])-winPct(s*E[i])),acc=clamp(103.1668*Math.exp(-0.04354*drop)-3.1669,0,100);
    const p=ph[g.egPly&&i>g.egPly?"e":i<=30?"o":"m"],k=mine?0:2;p[k]+=acc;p[k+1]++;
    if(drop>=30)bl[mine?0:1]++;
    const v=sgn*E[i];
    ra=v>=300?ra+1:0;rb=v<=-300?rb+1:0;rd=v<=-100&&v>-300?rd+1:0;ru=v>=100&&v<300?ru+1:0;
    if(ra>=4)f.ahead=1;if(rb>=4)f.behind=1;if(rd>=6)f.down=1;if(ru>=6)f.up=1;
  }
  for(const k in ph)ph[k]=ph[k].map(x=>Math.round(x*10)/10);
  return{ph,bl,f};
}
async function runEngine(list){
  RUN={p:0,stop:false};paintEngine();
  let w;try{w=await startEngine()}catch(e){RUN={error:true};return paintEngine(true)}
  const total=list.reduce((a,g)=>a+Math.min(g.plies,MAXPLY)+1,0);let done=0;
  for(const g of list){
    const ch=new Chess(),sans=g.san.split(" ").slice(0,MAXPLY),E=[];
    for(let i=0;i<=sans.length;i++){
      if(RUN.stop)break;
      if(i>0&&!ch.move(sans[i-1]))break;
      const cp=ch.in_checkmate()?-1000:ch.game_over()?0:await evalFen(w,ch.fen());
      E.push(ch.turn()==="w"?cp:-cp);RUN.p=++done/total;paintEngine();
    }
    if(RUN.stop)break;
    g.e=scoreEvals(g,E);
  }
  w.terminate();RUN=null;save();paintEngine(true);
}
// update the progress bar in place; redraw the results once the run ends
function paintEngine(finished){
  if(!$("#engBox"))return;
  if(finished){const y=window.scrollY;results();window.scrollTo(0,y);return}
  const el=$("#engProg");if(el)el.value=RUN.p;else{const y=window.scrollY;results();window.scrollTo(0,y)}
}
