/* まいにちSPI AIにお任せ教育モード
   設計：全体設計書「AIにお任せ教育モード」の章。
   - 習得5段階 m：0未学習 1理解 2正確 3速い 4定着
   - 次の1問：診断の続き > 初回診断 > 指標チェック > 復習の期限 > 弱点 > 新規（直近10問で 新規5・弱点3・復習2 を目安）
   - 不正解のときは3ステップ診断（内訳・図・計算）で、つまずいた所に戻す
   - タイマー：m0 なし／m1 目安バー（時間切れなし）／m2以上 本番と同じ（0で時間切れ） */
(function(){
var X=window.SPI, AKEY='mainichi-spi-ai-v1', DAY=864e5, IV=[1,5,14], A=null, Q={}, tick=null;
var STEP_Q=['この問題の内訳はどれか。','この問題を解く図・表はどれか。','空白を埋める計算はどれか。'];

/* ===== 記録 ===== */
function load(){try{A=JSON.parse(localStorage.getItem(AKEY)||'null');}catch(e){A=null;}
  if(!A||!A.f)A={level:firstLevel(),diagDone:false,diagQ:null,f:{},hist:[],check:null};}
function save(){try{localStorage.setItem(AKEY,JSON.stringify(A));}catch(e){}}
function fields(l){return (CURRICULUM[l]||[]).filter(function(f){return BANK[f]&&BANK[f][l];});}
function firstLevel(){for(var i=0;i<LEVELS.length;i++)if(fields(LEVELS[i]).length)return LEVELS[i];return 3;}
function nextLevel(l){for(var i=0;i<LEVELS.length;i++)if(LEVELS[i]>l&&fields(LEVELS[i]).length)return LEVELS[i];return null;}
function st(f,l){var k=f+'|'+l;return A.f[k]||(A.f[k]={st:1,sk:0,wr:0,m:0,fs:0,due:0,iv:0,weak:0});}
function pool(f,l,key){return (BANK[f]&&BANK[f][l]&&BANK[f][l][key])||[];}
function pickQ(f,l,key){var p=pool(f,l,key);if(!p.length)return null;var last=Q.lastQ,c=p.filter(function(x){return x!==last;});c=c.length?c:p;var pk=c[Math.floor(Math.random()*c.length)];return X.inst(pk);}
function count(t){return A.hist.slice(-10).filter(function(x){return x===t;}).length;}

/* ===== 次の1問 ===== */
function make(type,f,l,stIdx,timer){var key=STAGES[stIdx].key,it=pickQ(f,l,key);if(!it)return null;
  return {type:type,f:f,l:l,stIdx:stIdx,key:key,it:it,timer:timer};}
function timerFor(s){return s.m>=2?'strict':s.m===1?'soft':'none';}
function next(){
  if(Q.drill&&Q.drill.n>0){Q.drill.n--;var d=Q.drill,s0=st(d.f,d.l);return make('weak',d.f,d.l,d.stIdx,timerFor(s0));}
  var l=A.level,fs=fields(l),now=Date.now();
  if(!A.diagDone){
    if(!A.diagQ)A.diagQ=fs.slice();
    var df=A.diagQ.shift();if(!A.diagQ.length)A.diagDone=true;save();
    if(df)return make('diag0',df,l,STAGES.length-1,'strict');
  }
  if(A.check){var c=A.check;return {type:'check',f:c.items[c.i].f,l:c.l,stIdx:STAGES.length-1,key:'real',it:c.items[c.i].it,timer:'strict',ci:c.i+1,cn:c.items.length};}
  var due=[],weak=[],nw=null;
  LEVELS.forEach(function(lv){if(lv>l)return;fields(lv).forEach(function(f){var s=st(f,lv);if(s.m>=3&&s.due<=now)due.push([f,lv]);});});
  fs.forEach(function(f){var s=st(f,l);if(s.weak&&s.m>=1)weak.push(f);if(!nw&&s.m<3)nw=f;});
  if(due.length&&(count('review')<2||!nw)){var r=due[0];return make('review',r[0],r[1],STAGES.length-1,'strict');}
  if(weak.length&&(count('weak')<3||!nw)){var wf=weak[Math.floor(Math.random()*weak.length)],ws=st(wf,l);return make('weak',wf,l,ws.st,timerFor(ws));}
  if(nw){var s=st(nw,l);
    if(!X.cleared(nw,l,'lesson'))return {type:'lesson',f:nw,l:l};
    return make('new',nw,l,s.st,timerFor(s));}
  if(fs.length&&fs.every(function(f){return st(f,l).m>=3;})&&!A.passed){startCheck(l);return next();}
  /* やることがないときは、習得の浅い分野の実践を出す */
  var lo=fs.slice().sort(function(a,b){return st(a,l).due-st(b,l).due;})[0];
  return lo?make('extra',lo,l,STAGES.length-1,'strict'):null;
}
function startCheck(l){var fs=fields(l),items=[];
  for(var i=0;i<10;i++){var f=fs[i%fs.length];items.push({f:f,it:pickQ(f,l,'real')});}
  A.check={l:l,items:X.shuffle(items),i:0,ok:0,wrong:[]};save();}

/* ===== 結果の反映 ===== */
function update(item,r){var s=st(item.f,item.l),now=Date.now(),ok=(r==='fast'||r==='slow');
  A.hist.push(item.type);if(A.hist.length>30)A.hist=A.hist.slice(-30);
  if(item.type==='check'){var c=A.check;if(ok&&r==='fast')c.ok++;else{c.wrong.push(item.f);}c.i++;
    if(c.i>=c.items.length){Q.checkResult={l:c.l,ok:c.ok,n:c.items.length};
      if(c.ok>=8){A.passed=c.l;var nl=nextLevel(c.l);if(nl){A.level=nl;A.passed=0;A.diagDone=false;A.diagQ=null;}}
      else c.wrong.forEach(function(f){var x=st(f,c.l);x.weak=1;x.m=Math.min(x.m,2);x.fs=0;});
      A.check=null;}
    save();return;}
  if(item.type==='diag0'){if(r==='fast'){s.st=STAGES.length-1;s.m=Math.max(s.m,2);
      STAGES.forEach(function(g){X.markCleared(item.f,item.l,g.key);});}
    save();return;}
  if(item.type==='review'||item.type==='extra'){
    if(r==='fast'){if(item.type==='review'){s.iv=Math.min(s.iv+1,IV.length-1);s.m=4;}s.due=now+IV[s.iv]*DAY;}
    else{s.iv=0;s.due=now+DAY;s.weak=1;s.m=Math.min(s.m,2);s.fs=0;}
    save();return;}
  /* new / weak */
  var need=STAGES[item.stIdx].need||3,last=STAGES.length-1;
  if(ok){s.wr=0;
    if(item.stIdx===s.st){s.sk++;
      if(s.sk>=need){s.sk=0;X.markCleared(item.f,item.l,item.key);
        if(item.stIdx===1)s.m=Math.max(s.m,1);
        if(item.stIdx<last)s.st++;else s.m=Math.max(s.m,2);}}
    if(r==='slow'&&s.m>=1)s.weak=1;
    if(item.stIdx===last&&s.m>=2&&r==='fast'){s.fs++;s.weak=0;
      if(s.fs>=3&&s.m<3){s.m=3;s.iv=0;s.due=now+DAY;}}
    else if(r!=='fast')s.fs=0;
    if(r==='fast'&&item.type==='weak'&&s.m<2)s.weak=0;
  }else{s.sk=0;s.fs=0;s.wr++;s.weak=1;
    if(s.wr>=2&&s.st>1){s.st--;s.wr=0;}
    if(r==='timeout'&&s.st>1){s.st--;s.wr=0;Q.reLesson=item;}}
  save();
}

/* ===== 3ステップ診断（既存の問題から小問を作る） ===== */
function uniq(a){var o=[];a.forEach(function(x){if(x&&o.indexOf(x)<0)o.push(x);});return o;}
function allItems(f,l){var o=[];STAGES.forEach(function(g){if(!g.lesson)o=o.concat(pool(f,l,g.key).map(X.inst).filter(function(x){return x;}));});return o;}
function buildDiag(item){var it=item.it,f=item.f,l=item.l,steps=[];
  var own=X.inwText(it,f),others=[];
  Object.keys(BANK).forEach(function(g){if(g===f)return;Object.keys(BANK[g]).forEach(function(lv){allItems(g,+lv).slice(0,3).forEach(function(x){others.push(X.inwText(x,g));});});});
  others=X.shuffle(uniq(others).filter(function(x){return x!==own;})).slice(0,3);
  if(own&&others.length>=2)steps.push(mk(0,own,others));
  var mine=JSON.stringify(it.fig),figs=[];
  allItems(f,l).forEach(function(x){var j=JSON.stringify(x.fig);if(x.fig&&j!==mine&&figs.indexOf(j)<0)figs.push(j);});
  figs=X.shuffle(figs).slice(0,2).map(function(j){return JSON.parse(j);});
  if(it.fig&&figs.length>=2)steps.push(mk(1,it.fig,figs));
  var calcs=uniq(allItems(f,l).map(function(x){return x.calc;})).filter(function(x){return x!==it.calc;});
  calcs=X.shuffle(calcs).slice(0,3);
  if(it.calc&&calcs.length>=2)steps.push(mk(2,it.calc,calcs));
  return steps;
  function mk(k,right,wrong){var c=X.shuffle([right].concat(wrong));return {k:k,c:c,a:c.indexOf(right)};}
}
function diagResult(step,ok){var item=Q.diag.item,s=st(item.f,item.l);
  X.logAnswer({t:Date.now(),f:item.f,l:item.l,s:'diag'+(step.k+1),q:X.qid(item.it),r:ok?'fast':'wrong',sec:0,tg:0,pick:Q.diag.pick});
  if(ok)return;
  /* つまずいた所に戻す：内訳・図 → 概念か練習、計算 → 実践（単純な数値） */
  var back=step.k<2?Math.min(s.st,2):Math.min(s.st,3);
  if(back<1)back=1;s.st=back;s.sk=0;s.wr=0;
  Q.drill={f:item.f,l:item.l,stIdx:back,n:2};save();}

/* ===== 画面 ===== */
function stopTimer(){if(tick){clearInterval(tick);tick=null;}}
function startTimer(){stopTimer();Q.t0=Date.now();var item=Q.item;if(!item||item.timer==='none')return;
  var lim=X.targetOf(item.it,item.l)*1000;
  tick=setInterval(function(){var S=X.state();if(S.view!=='ai'||Q.picked!=null){stopTimer();return;}
    var b=document.getElementById('aibar'),left=1-(Date.now()-Q.t0)/lim;
    if(b){b.style.width=Math.max(0,left*100)+'%';b.className=left>0.5?'':left>0.2?'warn':'end';}
    if(left<=0&&item.timer==='strict'){stopTimer();answer(-1,true);}},200);}
function header(item){return X.bar(item.type==='check'?'指標'+item.l+'チェック '+item.ci+'/'+item.cn:item.f+'・'+STAGES[item.stIdx].name);}
function viewAI(){var item=Q.item,h;
  if(Q.diag&&Q.diagShow)return viewDiag();
  if(!item)return X.bar('AIにお任せ教育モード')+'<div class="clear"><div class="clear-badge">'+X.icon('big')+'</div></div>';
  var it=item.it;
  h=header(item)+(Q.picked==null&&item.timer!=='none'?'<div class="timer" role="img" aria-label="制限時間"><i id="aibar"></i></div>':'')+'<div class="q">'+it.q+'</div>'+X.choicesHtml(it,Q.picked,Q.sel,'aipick','aisubmit');
  if(Q.picked!=null){var ok=X.isRight(it,Q.picked);
    h+='<div class="result"><div class="verdict '+(ok?'ok':'ng')+'">'+(ok?X.icon('ok')+'正解':X.icon('ng')+(Q.timeout?'時間切れ':'不正解'))+'<span class="sec'+(Q.r==='slow'?' over':'')+'">'+Q.sec+'秒</span></div>';
    if(item.type!=='check'||!ok)h+='<div class="calc"><b>'+X.inwHead(it,item.f)+'</b>　'+X.inwText(it,item.f)+'</div>'+(it.fig?X.figHtml(it.fig):'')+'<div class="calc">'+(it.calc||'')+'</div><div class="calc"><b>答え</b>　'+X.ansText(it)+'</div>';
    h+='<button class="next" data-act="ainext">次へ</button></div>';}
  return h;
}
function viewDiag(){var d=Q.diag,step=d.steps[d.i],item=d.item,h=X.bar('診断 '+(d.i+1)+'/'+d.steps.length);
  h+='<div class="q">'+item.it.q+'</div><div class="q">'+STEP_Q[step.k]+'</div><div class="choices">';
  step.c.forEach(function(c,i){var cls='';if(d.pick!=null){if(i===step.a)cls=' correct';else if(i===d.pick)cls=' wrong';}
    var body=step.k===1?X.figHtml(c):c;
    h+='<button class="choice'+(step.k===1?' fig-choice':'')+cls+'" data-act="aidiag" data-i="'+i+'"'+(d.pick!=null?' disabled':'')+'><span class="lt">'+'ABCDE'[i]+'</span><span class="cbody">'+body+'</span></button>';});
  h+='</div>';
  if(d.pick!=null)h+='<button class="next" data-act="aidiagnext">次へ</button>';
  return h;
}
function viewLesson(){var item=Q.item;return X.bar(item.f+'・指標'+item.l)+X.lessonHtml(item.f,item.l)+'<button class="next" data-act="ailessondone">次へ</button>';}
function viewCheck(){var c=Q.checkResult,pass=c.ok>=8;
  return X.bar('指標'+c.l+'チェック')+'<div class="clear"><div class="clear-badge'+(pass?'':' ng')+'">'+X.icon(pass?'big':'ng')+'</div><div class="clear-text">'+c.ok+' / '+c.n+'<br>'+(pass?'合格':'不合格')+'</div><button class="next" data-act="ainext">次へ</button></div>';}
X.views.ai=viewAI;X.views.ailesson=viewLesson;X.views.aicheck=viewCheck;

function show(){Q.picked=null;Q.sel=[];Q.timeout=false;Q.diagShow=false;
  if(Q.checkResult){X.go('aicheck');return;}
  if(Q.reLesson){var rl=Q.reLesson;Q.reLesson=null;Q.item={type:'lesson',f:rl.f,l:rl.l};X.go('ailesson');return;}
  Q.item=next();
  if(Q.item&&Q.item.type==='lesson'){X.go('ailesson');return;}
  if(Q.item)Q.lastQ=Q.item.it.src||Q.item.it;
  X.go('ai');startTimer();}
function answer(i,to){stopTimer();var item=Q.item,it=item.it,ok=!to&&X.isRight(it,i),sec=Math.round((Date.now()-Q.t0)/1000),tg=X.targetOf(it,item.l);
  Q.picked=i;Q.timeout=!!to;Q.sec=sec;Q.r=X.classify(ok,sec,tg,to);
  /* 本番タイマーでないときは「遅い」で弱点にしすぎないよう、目安を超えたら slow とだけ記録する */
  X.logAnswer({t:Date.now(),f:item.f,l:item.l,s:item.key,q:X.qid(it),r:Q.r,sec:sec,tg:tg,pick:i,ai:item.type});
  update(item,Q.r);
  /* 診断は実践の問題で間違えたときだけ（概念・練習は解説で足りる） */
  if(Q.r==='wrong'&&item.type!=='check'&&item.type!=='diag0'&&item.stIdx>=3){var steps=buildDiag(item);if(steps.length)Q.diag={item:item,steps:steps,i:0,pick:null,pending:true};}
  X.render();var r=X.inner().querySelector('.result');if(r)r.scrollIntoView({block:'nearest',behavior:'smooth'});}

X.acts.ai=function(){load();Q={};show();};
X.acts.aipick=function(b){var i=+b.dataset.i;if(X.isMulti(Q.item.it)){X.toggleSel(Q.sel,i);X.render();}else answer(i,false);};
X.acts.aisubmit=function(){answer(Q.sel.slice(),false);};
X.acts.ainext=function(){if(Q.checkResult&&X.state().view==='aicheck'){Q.checkResult=null;}
  if(Q.diag&&Q.diag.pending){Q.diag.pending=false;Q.picked=null;Q.diagShow=true;X.go('ai');return;}
  Q.diag=null;show();};
X.acts.aidiag=function(b){var d=Q.diag,step=d.steps[d.i];d.pick=+b.dataset.i;var ok=d.pick===step.a;
  diagResult(step,ok);if(!ok)d.failed=true;X.render();};
X.acts.aidiagnext=function(){var d=Q.diag;
  if(d.failed||d.i+1>=d.steps.length){Q.diag=null;show();return;}
  d.i++;d.pick=null;X.render();};
X.acts.ailessondone=function(){var item=Q.item;X.markCleared(item.f,item.l,'lesson');show();};
})();
