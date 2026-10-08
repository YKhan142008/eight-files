"use strict";
/* Page state and the four screens: home, test, add games, results. */
const S={answers:Array(QS.length).fill(null),idx:0,games:null,platform:"lichess"};
try{const s=JSON.parse(localStorage.getItem("eight-files")||"null");if(s&&s.answers&&s.answers.length===QS.length)Object.assign(S,s)}catch(e){}
if(S.games&&S.games.v!==4)S.games=null;
const save=()=>{try{localStorage.setItem("eight-files",JSON.stringify(S))}catch(e){}};
const view=$("#view");

/* ---------- views ---------- */
function home(){
  const answered=S.answers.filter(a=>a!==null).length;
  view.innerHTML=`
  <div class="stack" style="gap:44px">
    <section class="hero">
      <div class="stack">
        <h1>Find out how you really play chess.</h1>
        <p class="lede">Answer 24 statements about how you like to play, then add your Lichess or Chess.com games. You get your position on eight style axes, a skill radar that compares you with the opponents you actually faced, and the grandmaster whose style is closest to yours.</p>
        <div class="row">
          <button class="btn" id="start" type="button">${answered&&answered<QS.length?"Continue the test":"Start the test"}</button>
          <button class="btn ghost" id="skip" type="button">Analyse my games only</button>
          ${answered===QS.length||S.games?'<button class="btn ghost" id="toRes" type="button">See my results</button>':""}
        </div>
        <p class="small muted">About 4 minutes. Nothing leaves your browser.</p>
      </div>
      <div class="panel stack">
        <span class="badge">Example result</span>
        ${radar(skillItems(EXAMPLE.skills))}
        <div><p class="eyebrow">Closest grandmaster</p><p class="gm-name" style="font-size:26px">${EXAMPLE.gm} <span class="pct muted">${EXAMPLE.pct}%</span></p></div>
      </div>
    </section>
    <section class="stack">
      <h2>The eight files</h2>
      <p class="muted">Each file of the board, a to h, is one axis with two poles. Your answers and your games place you between them.</p>
      <div class="files">${AXES.map(a=>`<div><span class="f">${a.f}-file</span><strong>${a.A} / ${a.B}</strong><span class="small muted">${a.desc}</span></div>`).join("")}</div>
    </section>
  </div>`;
  $("#start").onclick=()=>{S.mode="both";if(S.answers.every(a=>a!==null))S.idx=0;quiz()};
  $("#skip").onclick=()=>{S.mode="games";save();S.games?showResults():account()};
  if($("#toRes"))$("#toRes").onclick=showResults;
}
function quiz(){
  const i=clamp(S.idx,0,QS.length-1),[ax,,text]=QS[i],a=AXES[ax];
  view.innerHTML=`
  <section class="quiz stack" id="quizView" style="gap:22px">
    <div class="row" style="justify-content:space-between;align-items:flex-end">
      <div>
        <div class="board" aria-hidden="true">${QS.map((_,k)=>`<span class="${(k+Math.floor(k/8))%2?"d":""} ${S.answers[k]!==null?"done":""} ${k===i?"cur":""}"></span>`).join("")}</div>
        <div class="filelabels" aria-hidden="true">${AXES.map(x=>`<span>${x.f}</span>`).join("")}</div>
      </div>
      <p class="mono muted">${i+1} / ${QS.length}</p>
    </div>
    <p class="eyebrow">${a.f}-file · ${a.A} / ${a.B}</p>
    <p class="statement" id="stmt">${esc(text)}</p>
    <div class="answers" role="group" aria-labelledby="stmt">${ANS.map(([l,v],k)=>`<button type="button" data-v="${v}" class="${S.answers[i]===v?"sel":""}"><span>${l}</span><kbd>${k+1}</kbd></button>`).join("")}</div>
    <div class="row" style="justify-content:space-between">
      <button class="btn ghost" id="back" type="button" ${i===0?"disabled":""}>Back</button>
      <span class="small muted">Press 1 to 5 to answer</span>
    </div>
  </section>`;
  view.querySelectorAll(".answers button").forEach(b=>b.onclick=()=>answer(+b.dataset.v));
  $("#back").onclick=()=>{S.idx=i-1;save();quiz()};
}
function answer(v){
  S.answers[S.idx]=v;
  if(S.idx<QS.length-1){S.idx++;save();quiz()}else{save();S.games?showResults():account()}
}
document.addEventListener("keydown",e=>{if($("#quizView")&&!/^(INPUT|TEXTAREA)$/.test(e.target.tagName)&&/^[1-5]$/.test(e.key)&&!e.metaKey&&!e.ctrlKey)answer(ANS[+e.key-1][1])});

function account(msg){
  const done=S.answers.some(a=>a!==null);
  view.innerHTML=`
  <section class="quiz stack" style="gap:22px">
    <p class="eyebrow">${done?"Step 2 of 2":"Your games"}</p>
    <h2>Add your games</h2>
    <p class="muted">Paste your profile link or username. Up to 150 recent rated games are checked for how you actually play: checks, sacrifices, queen trades, clock use and results at each stage. Afterwards you can run an optional chess engine over them, which makes the profile more accurate.</p>
    <form id="accForm" class="stack">
      <div class="seg" role="radiogroup" aria-label="Site">
        <label><input type="radio" name="pf" id="pfLichess" value="lichess" ${S.platform==="lichess"?"checked":""}><span>Lichess</span></label>
        <label><input type="radio" name="pf" id="pfChesscom" value="chesscom" ${S.platform==="chesscom"?"checked":""}><span>Chess.com</span></label>
      </div>
      <div class="field">
        <input type="text" id="acc" autocomplete="off" spellcheck="false" placeholder="lichess.org/@/yourname or chess.com/member/yourname" aria-label="Profile link or username">
        <button class="btn" type="submit">Analyse games</button>
      </div>
    </form>
    <div id="status" class="stack">${msg?`<p class="err">${esc(msg)}</p>`:""}</div>
    <div id="manual" class="stack" hidden></div>
    ${done?'<div><button class="btn ghost" id="noGames" type="button">Skip, show results from my answers</button></div>':""}
  </section>`;
  view.querySelectorAll("[name=pf]").forEach(r=>r.onchange=()=>{S.platform=r.value;save()});
  if($("#noGames"))$("#noGames").onclick=showResults;
  $("#accForm").onsubmit=async e=>{
    e.preventDefault();
    const acc=parseAccount($("#acc").value),st=$("#status");
    if(!acc){st.innerHTML='<p class="err">Enter a profile link such as lichess.org/@/name, or a username.</p>';return}
    S.platform=acc.platform;$(acc.platform==="lichess"?"#pfLichess":"#pfChesscom").checked=true;
    st.innerHTML='<p>Fetching games for <strong>'+esc(acc.user)+'</strong>…</p>';
    let pgn;
    try{pgn=await fetchGames(acc.platform,acc.user)}
    catch(err){
      if(/account called|returned an error/.test(err.message)){st.innerHTML='<p class="err">'+esc(err.message)+'</p>';return}
      st.innerHTML="";return manual(acc);
    }
    run(pgn,acc.user);
  };
}
function manual(acc){
  const d=new Date(),ym=x=>x.getUTCFullYear()+"/"+String(x.getUTCMonth()+1).padStart(2,"0"),prev=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()-1,1));
  const u=encodeURIComponent(acc.user);
  const links=acc.platform==="lichess"
    ?`<a href="https://lichess.org/api/games/user/${u}?max=150&rated=true&clocks=true&opening=true&perfType=bullet,blitz,rapid,classical" target="_blank" rel="noopener">Download ${esc(acc.user)}'s last 150 games from Lichess</a>`
    :`<a href="https://api.chess.com/pub/player/${u.toLowerCase()}/games/${ym(d)}/pgn" target="_blank" rel="noopener">Download this month's games</a> and, for a bigger sample, <a href="https://api.chess.com/pub/player/${u.toLowerCase()}/games/${ym(prev)}/pgn" target="_blank" rel="noopener">last month's</a>`;
  const m=$("#manual");m.hidden=false;
  m.innerHTML=`
    <p class="note">This page cannot contact ${acc.platform==="lichess"?"Lichess":"Chess.com"} directly from here, so the games need one extra step. ${links}, then drop the file below.</p>
    <div class="drop" id="drop"><p style="margin-inline:auto"><label for="file" style="cursor:pointer;text-decoration:underline">Choose the PGN file</label> or drop it here.</p><input type="file" id="file" accept=".pgn,.txt" multiple hidden></div>
    <textarea id="paste" placeholder="Or paste PGN text here" aria-label="Paste PGN text"></textarea>
    <div><button class="btn" id="usePaste" type="button">Analyse pasted games</button></div>`;
  const read=async files=>{let t="";for(const f of files)t+=(await f.text())+"\n\n";run(t,acc.user)};
  $("#file").onchange=e=>read(e.target.files);
  const dz=$("#drop");
  dz.ondragover=e=>{e.preventDefault();dz.classList.add("over")};dz.ondragleave=()=>dz.classList.remove("over");
  dz.ondrop=e=>{e.preventDefault();dz.classList.remove("over");read(e.dataTransfer.files)};
  $("#usePaste").onclick=()=>run($("#paste").value,acc.user);
}
function run(pgn,user){
  const st=$("#status");st.innerHTML='<p>Replaying your games…</p><progress id="prog" max="1" value="0"></progress>';
  analysePGN(pgn,user,p=>{const el=$("#prog");if(el)el.value=p})
    .then(r=>{if(RUN)RUN.stop=true;S.games=r;S.tc="all";save();results();window.scrollTo(0,0)})
    .catch(err=>{st.innerHTML='<p class="err">'+esc(err.message)+'</p>'});
}

const showResults=()=>{results();window.scrollTo(0,0)};
function results(){
  const Q=quizScores(),data=S.games,GS=data?pickGames(data):null,g=GS?Object.assign(summarise(GS.list),{player:data.player}):null,both=!!(Q&&g),mode=both?(S.mode||"both"):"both",q=mode==="games"?null:Q,gs=mode==="quiz"?null:g,v=combined(q,gs),gms=matchGMs(v),top=gms[0],share=x=>Math.round((x+1)*50);
  const items=g?skillItems(g.skills):[],have=items.filter(i=>i.value!==null);
  const sorted=[...have].sort((a,b)=>b.value-a.value);
  const strengths=sorted.filter(i=>i.value>=56).slice(0,2),weak=sorted.filter(i=>i.value<=44).reverse().slice(0,3);
  const styleTips=v.map((x,i)=>[Math.abs(x),i,x]).filter(t=>t[0]>=.3).sort((a,b)=>b[0]-a[0]).slice(0,weak.length?2:3);
  const gaps=q&&gs?AXES.map((a,i)=>gs.style[i]===null?null:{a,d:q[i]-gs.style[i]}).filter(x=>x&&Math.abs(x.d)>=.6).sort((x,y)=>Math.abs(y.d)-Math.abs(x.d)).slice(0,2):[];
  const name=archetype(v);
  view.innerHTML=`
  <div class="stack" style="gap:40px">
    <section class="stack">
      <p class="eyebrow">Your style${g?" · "+esc(g.player)+" · "+g.n+" games":""}</p>
      <h1>${esc(name)}</h1>
      <div class="row">
        <button class="btn ghost" id="copy" type="button">Copy summary</button>
        <button class="btn ghost" id="addGames" type="button">${g?"Use different games":"Add my games"}</button>
        <button class="btn ghost" id="retake" type="button">${Q?"Retake the test":"Take the test"}</button>
      </div>
      ${both?`<div class="row"><span class="small muted">Style and grandmaster match based on</span><div class="seg" role="radiogroup" aria-label="Result source">${[["both","Answers and games"],["games","Games only"],["quiz","Answers only"]].map(([k,l])=>`<label><input type="radio" name="src" id="src-${k}" value="${k}" ${mode===k?"checked":""}><span>${l}</span></label>`).join("")}</div></div>`:""}
      ${GS?`<div class="row"><span class="small muted">Games used</span><div class="seg" role="radiogroup" aria-label="Time control">${[["all","All",data.G.length]].concat(TCS.filter(t=>GS.counts[t[0]]).map(t=>[t[0],t[1],GS.counts[t[0]]])).map(([k,l,c])=>`<label ${c<10?'class="off" title="Needs 10 games"':""}><input type="radio" name="tc" id="tc-${k}" value="${k}" ${GS.tc===k?"checked":""} ${c<10?"disabled":""}><span>${l} <span class="mono small">${c}</span></span></label>`).join("")}</div></div>`:""}
    </section>

    <section class="res-grid">
      <div class="panel stack">
        <p class="eyebrow">Closest grandmaster</p>
        <p class="gm-name">${esc(top.name)}</p>
        <p class="pct">${top.pct}% match · <span class="muted">${esc(top.era)}</span></p>
        <p>${esc(top.blurb)}</p>
        <p class="small muted">Game to study: ${esc(top.study)}</p>
        <ul class="runners">
          ${gms.slice(1,4).map(x=>`<li><span>${esc(x.name)}</span><span class="pct">${x.pct}%</span></li>`).join("")}
          <li><span class="muted">Least like you: ${esc(gms[gms.length-1].name)}</span><span class="pct muted">${gms[gms.length-1].pct}%</span></li>
        </ul>
      </div>
      <div class="panel stack">
        <p class="eyebrow">Skill radar</p>
        ${have.length>=3?radar(items)+`<p class="small muted">50 means level with the opponents you played in these ${g.n} games${g.rating?" (your average rating "+g.rating[0]+", theirs "+g.rating[1]+")":""}. The radar always shows the same eight skills; one marked "too few games" has no point. The table below shows the figures behind each score.</p>${g.eng?"":`<p class="small note">Estimated without the engine. Run the optional engine analysis below for a more accurate profile.</p>`}`
          :`<p>The radar is drawn from your real games. Add your Lichess or Chess.com account to see which parts of your game score above and below your rating.</p><div><button class="btn" id="addGames2" type="button">Add my games</button></div>`}
      </div>
    </section>

    ${g?`<section class="panel stack" id="engBox">
      <p class="eyebrow">Engine analysis · ${g.eng?"on":"optional"}</p>
      ${RUN&&RUN.error?`<p class="err">The engine could not load here. Check your connection and try again.</p>`:""}
      ${RUN&&!RUN.error?`<p>Stockfish is replaying your games. Keep this tab open.</p><progress id="engProg" max="1" value="${RUN.p}"></progress><div><button class="btn ghost" id="engStop" type="button">Stop</button></div>`
       :`${g.eng?`<div class="stats"><div><span class="eyebrow">Your accuracy</span><strong>${g.eng.acc[0].toFixed(1)}%</strong></div><div><span class="eyebrow">Opponents' accuracy</span><strong>${g.eng.acc[1].toFixed(1)}%</strong></div><div><span class="eyebrow">Your blunders per game</span><strong>${g.eng.bl[0].toFixed(1)}</strong></div><div><span class="eyebrow">Their blunders per game</span><strong>${g.eng.bl[1].toFixed(1)}</strong></div></div><p class="small muted">From ${g.eng.n} games, Stockfish 10 at depth ${DEPTH}. A blunder is a move that drops the winning chance by 30 points or more. This depth is shallow, so read the figures as a comparison between you and your opponents and not as exact accuracy.</p>`
         :`<h3>Your profile is more accurate with the engine</h3><p>This step is optional. Without it, Opening, Middlegame, Endgame, Defending and Converting are estimated from material and results, which cannot tell a good move from a bad one. With it, Stockfish replays your newest games move by move and those five skills use real move accuracy for you and your opponents.</p>`}
        ${(n=>n?`<div class="row"><button class="btn${g.eng?" ghost":""}" id="engRun" type="button">${g.eng?"Analyse "+n+" more games":"Run the engine on your "+n+" newest games"}</button><span class="small muted">Runs in your browser. Allow roughly ${Math.max(1,Math.round(n/30))} to ${Math.max(2,Math.round(n/8))} minutes.</span></div>`:"")(Math.min(BATCH,GS.list.filter(x=>!x.e).length))}`}
    </section>`:""}

    ${have.length>=3?`<section class="stack">
      <h2>How the radar is worked out</h2>
      <p class="muted">Each skill is one figure from your games, set against the same figure for your opponents in those games, or against the score your ratings predict. ${g.eng?"Rows marked Engine use Stockfish evaluations; the others count results and material.":"Until you run the engine, these count results and material, not move quality."}</p>
      <div class="tablewrap"><table>
        <thead><tr><th>Skill</th><th>What is counted</th><th class="num">You</th><th class="num">Compared with</th><th>Based on</th><th class="num">Score</th></tr></thead>
        <tbody>${g.rows.map(r=>`<tr><td><strong>${SKILLS[r.key][0]}</strong></td><td>${r.what}</td>${r.score===null?`<td class="muted" colspan="4">Not counted. Needs ${r.need}.</td>`:`<td class="num">${r.you}</td><td class="num">${r.opp}<span class="small muted"> ${r.oppLabel.toLowerCase()}</span></td><td class="small">${r.basis}${r.low?' <span class="err">· small sample</span>':""}</td><td class="num"><strong>${r.score}</strong></td>`}</tr>`).join("")}</tbody>
      </table></div>
    </section>`:""}

    <section class="stack">
      <h2>Your eight files</h2>
      ${q&&gs?'<div class="legend"><span><i></i>What you said</span><span><i class="g"></i>What your games show, against your opponents</span></div>':`<p class="small muted">${q?"Based on your answers.":"Based on your games, measured against your opponents in them. The e-file uses your own opening repertoire and the h-file needs the test."}</p>`}
      <div>${AXES.map((a,i)=>{const p=share(v[i]);return`
        <div class="axis"><span class="f">${a.f}</span>
          <div class="poles"><span>${a.A}<em>${p}%</em></span><span><em>${100-p}%</em>${a.B}</span></div>
          <div class="bar"><div class="fa" style="width:${p}%"></div>${q&&gs&&gs.style[i]!==null?`<span class="mk" style="left:${share(q[i])}%" title="Your answers"></span><span class="mk g" style="left:${share(gs.style[i])}%" title="Your games"></span>`:""}</div>
        </div>`}).join("")}</div>
    </section>

    <section class="stack">
      <h2>What to work on</h2>
      <ul class="list">
        ${weak.map(w=>`<li><span class="tag down">${w.label} ${w.value}</span><h3>Below your opponents</h3><p>${SKILLS[w.key][1]}</p>${studyList(w.key)}</li>`).join("")}
        ${gaps.map(x=>`<li><span class="tag style">${x.a.f}-file</span><h3>You see yourself differently from your games</h3><p>Your answers lean ${x.d>0?x.a.A:x.a.B}, but your games lean ${x.d>0?x.a.B:x.a.A}. Look at a few recent games and decide which one you want to be true.</p></li>`).join("")}
        ${styleTips.map(t=>`<li><span class="tag style">${t[2]>0?AXES[t[1]].A:AXES[t[1]].B}</span><h3>Blind spot of your style</h3><p>${AXES[t[1]].tip[t[2]>0?0:1]}</p>${studyList("style:"+(t[2]>0?AXES[t[1]].A:AXES[t[1]].B).toLowerCase())}</li>`).join("")}
        ${strengths.map(w=>`<li><span class="tag up">${w.label} ${w.value}</span><h3>Strength</h3><p>You do better than your opponents here. Steer games towards it.</p></li>`).join("")}
        ${!weak.length&&!styleTips.length&&!gaps.length&&!strengths.length?'<li><span class="tag style">Balanced</span><h3>No strong lean</h3><p>Your profile is close to the middle on every file. Add your games to find concrete weak spots.</p></li>':""}
      </ul>
      <p class="small muted">Grandmaster profiles are widely held descriptions of their styles, placed on the eight files by hand.</p>
    </section>
  </div>`;
  view.querySelectorAll("[name=src]").forEach(r=>r.onchange=()=>{S.mode=r.value;save();const y=window.scrollY;results();window.scrollTo(0,y);const el=$("#src-"+r.value);if(el)el.focus()});
  view.querySelectorAll("[name=tc]").forEach(r=>r.onchange=()=>{S.tc=r.value;save();const y=window.scrollY;results();window.scrollTo(0,y);const el=$("#tc-"+r.value);if(el)el.focus()});
  if($("#engRun"))$("#engRun").onclick=()=>runEngine(GS.list.filter(x=>!x.e).slice(0,BATCH));
  if($("#engStop"))$("#engStop").onclick=()=>{RUN.stop=true};
  $("#addGames").onclick=()=>account(); if($("#addGames2"))$("#addGames2").onclick=()=>account();
  $("#retake").onclick=()=>{S.mode="both";S.answers.fill(null);S.idx=0;save();quiz()};
  $("#copy").onclick=e=>{
    const t="Eight Files: "+name+". Closest grandmaster: "+top.name+" ("+top.pct+"%). "+AXES.map((a,i)=>{const p=share(v[i]);return p>=50?a.A+" "+p+"%":a.B+" "+(100-p)+"%"}).join(", ")+".";
    const b=e.currentTarget;
    (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{b.textContent="Copied"},()=>{b.textContent=t});
  };
}
$("#homeBtn").onclick=home;
home();
