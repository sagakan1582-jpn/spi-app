/* まいにちSPI AIにお任せ教育モード
   設計：全体設計書「AIにお任せ教育モード」の章。
   - 習得5段階 m：0未学習 1理解 2正確 3速い 4定着
   - 次の1問：診断の続き > 初回診断 > 指標チェック > 復習の期限 > 弱点 > 新規（直近10問で 新規5・弱点3・復習2 を目安）
   - 不正解のときは3ステップ診断（内訳・図・計算）で、つまずいた所に戻す
   - タイマー：m0 なし／m1 目安バー（時間切れなし）／m2以上 本番と同じ（0で時間切れ） */
/* ゲーム型（2026-11-15 ユーザー要望）：
   ホーム（指標レベル・進捗・苦手分野）→ 最初の実力診断（分野ごとに指標4 → 正解なら5／不正解なら3）→ 苦手から順に強化（解き方から、
   何を学ぶかをAIサポーターが説明）→ 全分野が習得（m≥3）になると昇格試験（10問中8問）→ 合格で指標レベルが上がる。 */
(function(){
var X=window.SPI, AKEY='mainichi-spi-ai-v1', DAY=864e5, IV=[1,5,14], A=null, Q={}, tick=null;
var STEP_Q=['この問題の内訳はどれか。','この問題を解く図・表はどれか。','空白を埋める計算はどれか。'];

/* ===== 記録 ===== */
function load(){try{A=JSON.parse(localStorage.getItem(AKEY)||'null');}catch(e){A=null;}
  if(!A||!A.f)A={level:firstLevel(),diagDone:false,diagQ:null,f:{},hist:[],check:null,placed:false};}
/* 1問ごとに保存する（2026-11-16 ユーザー指示：区切りまで行かなくても途中経過を残す）。
   問題のテンプレート（src）は関数を含むので保存しない。容量が足りないときは解答の記録を減らしてもう一度保存する */
function save(){var j;try{j=JSON.stringify(A,function(k,v){return k==='src'?undefined:v;});}catch(e){return;}
  try{localStorage.setItem(AKEY,j);}catch(e){try{var lg=JSON.parse(localStorage.getItem('mainichi-spi-log-v1')||'[]');localStorage.setItem('mainichi-spi-log-v1',JSON.stringify(lg.slice(-500)));localStorage.setItem(AKEY,j);}catch(e2){}}}
function fields(l){return (CURRICULUM[l]||[]).filter(function(f){return BANK[f]&&BANK[f][l];});}
function firstLevel(){for(var i=0;i<LEVELS.length;i++)if(fields(LEVELS[i]).length)return LEVELS[i];return 3;}
function nextLevel(l){for(var i=0;i<LEVELS.length;i++)if(LEVELS[i]>l&&fields(LEVELS[i]).length)return LEVELS[i];return null;}
function st(f,l){var k=f+'|'+l;return A.f[k]||(A.f[k]={st:1,h:[],wr:0,m:0,fh:[],due:0,iv:0,weak:0});}
function pool(f,l,key){return (BANK[f]&&BANK[f][l]&&BANK[f][l][key])||[];}
function pickQ(f,l,key){var p=pool(f,l,key);if(!p.length)return null;var last=Q.lastQ,c=p.filter(function(x){return x!==last;});c=c.length?c:p;var pk=c[Math.floor(Math.random()*c.length)];return X.inst(pk);}
function count(t){return A.hist.slice(-10).filter(function(x){return x===t;}).length;}

/* ===== 次の1問 ===== */
function make(type,f,l,stIdx,timer){var key=STAGES[stIdx].key,it=pickQ(f,l,key);if(!it)return null;
  return {type:type,f:f,l:l,stIdx:stIdx,key:key,it:it,timer:timer};}
function timerFor(s){return s.m>=2?'strict':s.m===1?'soft':'none';}
/* ===== 実力診断（最初の1回）：計算の各分野で 指標4 → 時間内に正解なら5、だめなら3 ===== */
var PLV=[3,4,5];
function placeFields(){var o=[];PLV.forEach(function(l){fields(l).forEach(function(f){if(o.indexOf(f)<0)o.push(f);});});return o;}
function startPlace(){var fs=placeFields();A.pl={fs:fs,i:0,l:null,res:{},n:0};save();}
function placeItem(){var p=A.pl;if(p.i>=p.fs.length)return null;var f=p.fs[p.i];
  if(p.l==null){p.l=(BANK[f][4]?4:BANK[f][3]?3:5);}
  var it=pickQ(f,p.l,'real')||pickQ(f,p.l,'applied');if(!it){p.i++;p.l=null;return placeItem();}
  p.n++;return {type:'place',f:f,l:p.l,stIdx:STAGES.length-1,key:'real',it:it,timer:'strict',pn:p.n,pt:p.fs.length*2};}
function placeUpdate(item,r){var p=A.pl,f=item.f,ok=r==='fast',res=p.res[f];
  if(ok){res=Math.max(res||0,item.l);var up=item.l+1;if(up<=5&&BANK[f][up]&&item.l>=4){p.l=up;p.res[f]=res;return;}}
  else{var dn=item.l-1;if(item.l===4&&BANK[f][3]&&res==null){p.res[f]=2;p.l=dn;return;}if(res==null)res=item.l-1;}
  p.res[f]=res;p.i++;p.l=null;
  if(p.i>=p.fs.length)finishPlace();}
function finishPlace(){var p=A.pl;
  Object.keys(p.res).forEach(function(f){var pl=p.res[f];PLV.forEach(function(l){if(l<=pl&&BANK[f][l]){var s=st(f,l);s.st=STAGES.length-1;s.m=Math.max(s.m,2);
    STAGES.forEach(function(g){X.markCleared(f,l,g.key);});}});});
  var lv=null;LEVELS.forEach(function(l){if(lv!=null)return;if(fields(l).some(function(f){return l>5||(p.res[f]==null?true:p.res[f]<l);}))lv=l;});
  A.level=lv||LEVELS[LEVELS.length-1];A.placed=true;A.diagDone=true;A.diagQ=null;A.placeRes=p.res;A.pl=null;save();Q.placeDone=true;}
/* 強化する順：診断で解けなかった分野（苦手）を先に、あとは講座の順 */
function order(l){var fs=fields(l),r=A.placeRes||{};
  return fs.slice().sort(function(a,b){var wa=(r[a]!=null&&r[a]<l)?0:1,wb=(r[b]!=null&&r[b]<l)?0:1;return wa-wb||fs.indexOf(a)-fs.indexOf(b);});}
function weakList(l){return order(l).filter(function(f){var s=st(f,l),r=A.placeRes||{};return s.m<3&&(s.weak||(r[f]!=null&&r[f]<l));});}
function ready(l){var fs=fields(l);return fs.length&&fs.every(function(f){return st(f,l).m>=3;})&&!A.check&&A.passed!==l;}
function next(){
  if(A.pl)return placeItem();
  if(A.drill&&A.drill.n>0){A.drill.n--;var d=A.drill,s0=st(d.f,d.l);return make('weak',d.f,d.l,d.stIdx,timerFor(s0));}
  var l=A.level,fs=fields(l),now=Date.now();
  if(!A.diagDone){
    if(!A.diagQ)A.diagQ=fs.slice();
    var df=A.diagQ.shift();if(!A.diagQ.length)A.diagDone=true;save();
    if(df)return make('diag0',df,l,STAGES.length-1,'strict');
  }
  if(A.check){var c=A.check;return {type:'check',f:c.items[c.i].f,l:c.l,stIdx:STAGES.length-1,key:'real',it:c.items[c.i].it,timer:'strict',ci:c.i+1,cn:c.items.length};}
  var due=[],weak=[],nw=null;
  LEVELS.forEach(function(lv){if(lv>l)return;fields(lv).forEach(function(f){var s=st(f,lv);if(s.m>=3&&s.due<=now)due.push([f,lv]);});});
  fs.forEach(function(f){var s=st(f,l);if(s.weak&&s.m>=1)weak.push(f);});order(l).forEach(function(f){if(!nw&&st(f,l).m<3)nw=f;});
  if(due.length&&(count('review')<2||!nw)){var r=due[0];return make('review',r[0],r[1],STAGES.length-1,'strict');}
  if(weak.length&&(count('weak')<3||!nw)){var wf=weak[Math.floor(Math.random()*weak.length)],ws=st(wf,l);return make('weak',wf,l,ws.st,timerFor(ws));}
  if(nw){var s=st(nw,l);
    if(!X.cleared(nw,l,'lesson'))return {type:'lesson',f:nw,l:l};
    return make('new',nw,l,s.st,timerFor(s));}
  /* やることがないときは、習得の浅い分野の実践を出す */
  var lo=fs.slice().sort(function(a,b){return st(a,l).due-st(b,l).due;})[0];
  return lo?make('extra',lo,l,STAGES.length-1,'strict'):null;
}
function startCheck(l){var fs=fields(l),items=[];
  for(var i=0;i<10;i++){var f=fs[i%fs.length];items.push({f:f,it:pickQ(f,l,'real')});}
  A.check={l:l,items:X.shuffle(items),i:0,ok:0,wrong:[]};save();}

/* ===== 結果の反映 ===== */
function update(item,r){if(item.type==='place'){placeUpdate(item,r);save();return;}
  var s=st(item.f,item.l),now=Date.now(),ok=(r==='fast'||r==='slow'),m0=s.m;
  A.hist.push(item.type);if(A.hist.length>30)A.hist=A.hist.slice(-30);
  if(item.type==='check'){var c=A.check;if(ok&&r==='fast')c.ok++;else{c.wrong.push(item.f);}c.i++;
    if(c.i>=c.items.length){Q.checkResult={l:c.l,ok:c.ok,n:c.items.length};
      if(c.ok>=8){A.passed=c.l;Q.checkResult.up=nextLevel(c.l);var nl=Q.checkResult.up;if(nl){A.level=nl;A.passed=0;A.diagDone=true;A.diagQ=null;A.focus=null;}}
      else{c.wrong.forEach(function(f){var x=st(f,c.l);x.weak=1;x.m=Math.min(x.m,2);x.fh=[];});Q.checkResult.wrong=uniq(c.wrong);}
      A.check=null;}
    save();return;}
  if(item.type==='diag0'){if(r==='fast'){s.st=STAGES.length-1;s.m=Math.max(s.m,2);
      STAGES.forEach(function(g){X.markCleared(item.f,item.l,g.key);});}
    save();return;}
  if(item.type==='review'||item.type==='extra'){
    if(r==='fast'){if(item.type==='review'){s.iv=Math.min(s.iv+1,IV.length-1);s.m=4;}s.due=now+IV[s.iv]*DAY;}
    else{s.iv=0;s.due=now+DAY;s.weak=1;s.m=Math.min(s.m,2);s.fh=[];}
    save();return;}
  /* new / weak */
  var g=STAGES[item.stIdx],last=STAGES.length-1;
  if(item.stIdx===s.st)s.h=(s.h||[]).concat([ok]).slice(-g.win);
  if(ok){s.wr=0;
    if(item.stIdx===s.st){
      if(stagePassed(s.h,g)){Q.passH=s.h;s.h=[];X.markCleared(item.f,item.l,item.key);
        Q.msg='「'+STAGES[item.stIdx].name+'」合格！'+(item.stIdx<last?'次は「'+STAGES[item.stIdx+1].name+'」。'+STAGES[item.stIdx+1].win+'問中'+STAGES[item.stIdx+1].need+'問正解で合格。':'');
        if(item.stIdx===1)s.m=Math.max(s.m,1);
        /* 実践②に合格したら習得（速さを上げる段階はなし。2026-11-17 ユーザー指示） */
        if(item.stIdx<last)s.st++;else if(s.m<3){s.m=3;s.iv=0;s.due=now+DAY;s.weak=0;Q.msg='「'+item.f+'」指標'+item.l+'を習得！';}}}
    if(r==='slow'&&s.m>=1)s.weak=1;
    if(r==='fast'&&item.type==='weak'&&s.m<2)s.weak=0;
  }else{s.wr++;s.weak=1;
    if(s.wr>=2&&s.st>1){s.st--;s.wr=0;s.h=[];}
    if(r==='timeout'&&s.st>1){s.st--;s.wr=0;s.h=[];Q.reLesson=item;}
    if(s.wr===0&&!Q.reLesson)Q.msg='2回続けて間違えたので、ひとつ前の「'+STAGES[s.st].name+'」に戻って練習しよう。';}
  save();
}

/* ===== 3ステップ診断（既存の問題から小問を作る） ===== */
function uniq(a){var o=[];a.forEach(function(x){if(x&&o.indexOf(x)<0)o.push(x);});return o;}
/* 型チェックは削除（2026-11-17）。buildDiag は空を返す */
function buildDiag(item){return window.KATA?KATA.steps(item.it,item.f):[];}
function diagResult(step,ok){var item=Q.diag.item,s=st(item.f,item.l);
  X.logAnswer({t:Date.now(),f:item.f,l:item.l,s:'diag'+(step.k+1),q:X.qid(item.it),r:ok?'fast':'wrong',sec:0,tg:0,pick:Q.diag.pick});
  if(ok)return;
  /* つまずいた所に戻す：内訳・図 → 概念か練習、計算 → 実践（単純な数値） */
  var back=step.k<2?Math.min(s.st,2):Math.min(s.st,3);
  if(back<1)back=1;s.st=back;s.h=[];s.wr=0;
  A.drill={f:item.f,l:item.l,stIdx:back,n:2};save();}

/* ===== 画面 ===== */
function stopTimer(){if(tick){clearInterval(tick);tick=null;}}
function startTimer(){stopTimer();Q.t0=Date.now();var item=Q.item;if(!item||item.timer==='none')return;
  var lim=X.targetOf(item.it,item.l)*1000;
  tick=setInterval(function(){var S=X.state();if(S.view!=='ai'||Q.picked!=null){stopTimer();return;}
    var b=document.getElementById('aibar'),left=1-(Date.now()-Q.t0)/lim;
    if(b){b.style.width=Math.max(0,left*100)+'%';b.className=left>0.5?'':left>0.2?'warn':'end';}
    if(left<=0&&item.timer==='strict'){stopTimer();answer(-1,true);}},200);}
/* 段階制の問題（new/weak）は B案のヘッダー：段階番号・分野・段階名・連続正解 */
var ST_SHORT=['解き方','概念','練習','実践①','実践②'];
function staged(item){return item&&(item.type==='new'||item.type==='weak')&&item.stIdx>0;}
function streakOf(item){var s=st(item.f,item.l),last=STAGES.length-1,g=STAGES[item.stIdx],fin=false,
  h=fin?(s.fh||[]):(item.stIdx===s.st?(s.h||[]):[]);
  if(Q.picked!=null&&Q.full)h=Q.passH||h;/* 合格した直後は合格したときの記録を見せる */
  return {h:h.slice(-g.win),g:fin?{win:6,need:4}:g};}
function boxes(h,g,big){var n=stageOk(h,g),x='<span class="cp-boxes'+(big?' big':'')+'" role="img" aria-label="正解 '+n+' / '+g.need+'">';
  for(var i=0;i<g.win;i++)x+='<i class="'+(i<h.length?(h[i]?'on':'ng'):'')+'"></i>';return x+'</span><span class="cp-cnt">'+n+' / '+g.need+'</span>';}
function stageHead(item){var k=streakOf(item);
  return '<div class="bar"><button class="back" data-act="back" aria-label="もどる">'+X.icon('back')+'</button><span class="cp-num">'+(item.stIdx+1)+'</span><span class="cp-name"><span>'+item.f+'</span><b>'+STAGES[item.stIdx].name+'</b></span></div>'+
    '<div class="cp-streak"><b>正解</b>'+boxes(k.h,k.g)+'</div>';}
function header(item){if(staged(item))return stageHead(item);return X.bar(item.type==='check'?'昇格試験 '+item.ci+'/'+item.cn:item.type==='place'?'実力診断 '+item.pn:item.f+'・'+STAGES[item.stIdx].name);}
var SUP_IC='<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z"/><path d="M19 15l.8 1.7 1.7.8-1.7.8L19 20l-.8-1.7-1.7-.8 1.7-.8z"/></svg>';
function sup(t){return '<div class="sup"><span class="sup-ic" aria-hidden="true">'+SUP_IC+'</span><div class="sup-b">'+t+'</div></div>';}
function stName(f,l){var s=st(f,l);return s.m>=3?'習得':s.m===2?'最終確認':s.st>1||s.m>=1?'学習中':'未学習';}
function viewHome(){var l=A.level,fs=order(l),done=fs.filter(function(f){return st(f,l).m>=3;}).length,wk=weakList(l),h=X.bar('AIにお任せ教育モード'),msg,btn;
  if(!A.placed){msg='はじめまして！まずは<b>あなたの実力を測ります</b>。分野ごとに本番と同じ形の問題を出すので、時間内に解いてね。';btn='実力診断を始める';}
  else if(ready(l)){msg='指標'+l+'の分野をすべて習得したね！<b>昇格試験</b>に合格すると、指標'+(nextLevel(l)||l)+'に上がれるよ。';btn='昇格試験を受ける';}
  else{var nf=fs.filter(function(f){return st(f,l).m<3;})[0];msg=nf?'今日は<b>「'+nf+'」</b>の強化から始めよう！':'今日も続けよう！';btn='学習を始める';}
  h+=sup(msg);
  if(A.placed){h+='<div class="ai-lv"><div class="ai-lv-l">指標レベル</div><div class="ai-lv-n">'+l+'</div></div>';
    h+='<div class="ai-prog-l"><span>指標'+l+'の習得</span><span>'+done+' / '+fs.length+' 分野</span></div><div class="ai-prog"><i style="width:'+(fs.length?done/fs.length*100:0)+'%"></i></div>';
    h+='<div class="tbl-wrap"><table class="tbl ai-tbl">';fs.forEach(function(f){var n=stName(f,l),w=wk.indexOf(f)>=0&&n!=='習得';
      h+='<tr><th>'+f+'</th><td class="'+(n==='習得'?'ai-ok':w?'ai-ng':'')+'">'+(w?'苦手':n)+'</td></tr>';});h+='</table></div>';}
  return h+'<button class="next" data-act="aigo">'+btn+'</button>';}
function viewPlace(){var l=A.level,wk=weakList(l),h=X.bar('実力診断の結果');
  h+=sup('診断おつかれさま！あなたは<b>指標'+l+'</b>からスタート。'+(wk.length?'苦手な分野から、解き方を学んで順に習得していこう。':'この指標の分野を、速く正確に解けるようにしていこう。'));
  h+='<div class="ai-lv"><div class="ai-lv-l">指標レベル</div><div class="ai-lv-n">'+l+'</div></div>';
  if(wk.length){h+='<div class="tbl-wrap"><table class="tbl ai-tbl"><tr><th colspan="2">苦手な分野</th></tr>';wk.forEach(function(f,i){h+='<tr><th>'+(i+1)+'</th><td class="ai-ng">'+f+'</td></tr>';});h+='</table></div>';}
  return h+'<button class="next" data-act="aigo">学習を始める</button>';}
function viewIntro(){var it=Q.pending,k=it.type==='lesson'?0:it.stIdx,h=X.bar(it.f+'・指標'+it.l);
  h+='<div class="cp"><div class="cp-big"><span class="cp-n">'+(k+1)+'</span><span class="cp-of">/ '+STAGES.length+'</span></div><div class="cp-title">'+STAGES[k].name+'</div>';
  h+='<div class="cp-bar">'+STAGES.map(function(g,i){return '<div class="'+(i<k?'done':i===k?'now':'')+'"><i></i><span>'+ST_SHORT[i]+'</span></div>';}).join('')+'</div>';
  if(STAGES[k].need)h+='<div class="cp-streak big"><b>正解</b>'+boxes([],STAGES[k],true)+'</div>';
  return h+'</div><button class="next" data-act="aiintrogo">はじめる</button>';}
function viewExam(){var l=A.level,h=X.bar('昇格試験');
  h+=sup('指標'+l+'の全分野から<b>10問</b>出すよ。本番と同じタイマーで、<b>8問以上</b>時間内に正解すれば合格。合格すると指標'+(nextLevel(l)||l)+'に上がる！');
  return h+'<button class="next" data-act="aiexamgo">試験を始める</button>';}
function viewAI(){var item=Q.item,h,m=Q.showMsg;
  if(Q.diag&&Q.diagShow)return viewDiag();
  if(!item)return X.bar('AIにお任せ教育モード')+'<div class="clear"><div class="clear-badge">'+X.icon('big')+'</div></div>';
  var it=item.it;
  h=header(item)+(m&&Q.picked==null?sup(m):'')+(Q.picked==null&&item.timer!=='none'?'<div class="timer" role="img" aria-label="制限時間"><i id="aibar"></i></div>':'')+'<div class="q">'+it.q+'</div>'+X.choicesHtml(it,Q.picked,Q.sel,'aipick','aisubmit',true);
  if(Q.picked!=null){var ok=X.isRight(it,Q.picked);
    h+='<div class="result"><div class="verdict '+(ok?'ok':'ng')+'">'+(ok?X.icon('ok')+'正解':X.icon('ng')+(Q.timeout?'時間切れ':'不正解'))+'<span class="sec'+(Q.r==='slow'?' over':'')+'">'+Q.sec+'秒</span></div>';
    if(item.type!=='check'||!ok)h+='<div class="calc"><b>'+X.inwHead(it,item.f)+'</b>　'+X.inwText(it,item.f)+'</div>'+(it.fig?X.figHtml(it.fig):'')+'<div class="calc">'+(it.calc||'')+'</div><div class="calc"><b>答え</b>　'+X.ansText(it)+'</div>';
    h+='<button class="next" data-act="ainext">次へ</button></div>';}
  return h;
}
function viewDiag(){var d=Q.diag,step=d.steps[d.i],item=d.item,h=X.bar('型チェック '+(d.i+1)+'/'+d.steps.length);
  h+='<div class="q">'+item.it.q+'</div><div class="q">'+STEP_Q[step.k]+'</div><div class="choices">';
  step.c.forEach(function(c,i){var cls='';if(d.pick!=null){if(i===step.a)cls=' correct';else if(i===d.pick)cls=' wrong';}
    var body=step.k===1?X.figHtml(c):c;
    h+='<button class="choice'+(step.k===1?' fig-choice':'')+cls+'" data-act="aidiag" data-i="'+i+'"'+(d.pick!=null?' disabled':'')+'><span class="lt">'+'ABCDE'[i]+'</span><span class="cbody">'+body+'</span></button>';});
  h+=X.dkHtml('aidiag',d.pick)+'</div>';
  if(d.pick!=null)h+='<button class="next" data-act="aidiagnext">次へ</button>';
  return h;
}
function viewLesson(){var item=Q.item;return X.bar(item.f+'・指標'+item.l)+X.lessonHtml(item.f,item.l)+'<button class="next" data-act="ailessondone">次へ</button>';}
function viewCheck(){var c=Q.checkResult,pass=c.ok>=8;
  return X.bar('昇格試験')+'<div class="clear"><div class="clear-badge'+(pass?'':' ng')+'">'+X.icon(pass?'big':'ng')+'</div><div class="clear-text">'+c.ok+' / '+c.n+'<br>'+(pass?'合格':'不合格')+'</div>'+
    sup(pass?(c.up?'昇格！<b>指標'+c.l+' → 指標'+c.up+'</b>。次の指標の分野に挑戦しよう！':'最高の指標'+c.l+'に合格！あとは復習で実力を保とう。'):'あと'+(8-c.ok)+'問！間違えた分野（'+(c.wrong||[]).join('、')+'）をもう一度強化してから、再挑戦しよう。')+
    '<button class="next" data-act="aihomego">ホームへ</button></div>';}
X.views.ai=viewAI;X.views.ailesson=viewLesson;X.views.aicheck=viewCheck;X.views.aihome=viewHome;X.views.aiplace=viewPlace;X.views.aiintro=viewIntro;X.views.aiexam=viewExam;

function show(){Q.picked=null;Q.sel=[];Q.timeout=false;Q.diagShow=false;Q.showMsg=Q.msg;Q.msg=null;
  if(Q.checkResult){X.go('aicheck');return;}
  if(Q.placeDone){Q.placeDone=false;X.go('aiplace');return;}
  if(Q.reLesson){var rl=Q.reLesson;Q.reLesson=null;Q.item={type:'lesson',f:rl.f,l:rl.l};X.go('ailesson');return;}
  /* 前回の続き：型チェックの途中、または答える前の問題 */
  if(A.diag){A.diag=null;Q.diag=null;save();}
  if(A.cur){Q.item=A.cur;present();return;}
  if(!A.pl&&!A.drill&&ready(A.level)){X.go('aiexam');return;}
  Q.item=next();
  /* 新しい分野に入るときは、何を学ぶかを先に説明する */
  /* 段階が変わるたびに区切り画面（B案）を出す。分野に入るとき・合格して次の段階へ進むとき・戻るとき */
  if(Q.item&&(Q.item.type==='lesson'||Q.item.type==='new'||Q.item.type==='weak'&&A.focus===Q.item.f+'|'+Q.item.l)){var ck=Q.item.f+'|'+Q.item.l+'|'+(Q.item.type==='lesson'?0:Q.item.stIdx);
    if(A.cp!==ck){A.cp=ck;A.focus=Q.item.f+'|'+Q.item.l;save();if(Q.showMsg&&Q.showMsg.indexOf('合格！')>=0)Q.showMsg=null;Q.pending=Q.item;X.go('aiintro');return;}}
  if(Q.item&&Q.item.type==='lesson'){X.go('ailesson');return;}
  present();}
function present(){if(Q.item){Q.lastQ=Q.item.it.src||Q.item.it;A.cur=Q.item;save();}X.go('ai');startTimer();}
function answer(i,to){stopTimer();var item=Q.item,it=item.it,ok=!to&&X.isRight(it,i),sec=Math.round((Date.now()-Q.t0)/1000),tg=X.targetOf(it,item.l);
  Q.picked=i;Q.timeout=!!to;Q.sec=sec;Q.r=X.classify(ok,sec,tg,to);
  /* 本番タイマーでないときは「遅い」で弱点にしすぎないよう、目安を超えたら slow とだけ記録する */
  X.logAnswer({t:Date.now(),f:item.f,l:item.l,s:item.key,q:X.qid(it),r:Q.r,sec:sec,tg:tg,pick:i,ai:item.type});
  A.cur=null;
  var s0=item.f?st(item.f,item.l):null,st0=s0&&s0.st,m0=s0&&s0.m;
  update(item,Q.r);
  Q.full=!!(s0&&ok&&staged(item)&&(s0.st>st0||(item.stIdx===STAGES.length-1&&m0<3&&s0.m>=3)));
  /* 型チェックは出さない（2026-11-17 ユーザー指示で削除） */

  save();
  X.render();var r=X.inner().querySelector('.result');if(r)r.scrollIntoView({block:'nearest',behavior:'smooth'});}

X.aiQ=function(){return Q;};
X.acts.ai=function(){load();Q={};X.go('aihome');};
X.acts.aigo=function(){if(!A.placed&&!A.pl)startPlace();show();};
X.acts.aihomego=function(){Q.checkResult=null;X.go('aihome');};
X.acts.aiintrogo=function(){var it=Q.pending;Q.pending=null;Q.item=it;if(it.type==='lesson'){X.go('ailesson');return;}present();};
X.acts.aiexamgo=function(){startCheck(A.level);show();};
X.acts.aipick=function(b){if(b.dataset.i==='dk'){answer('dk',false);return;}var i=+b.dataset.i;if(X.isMulti(Q.item.it)){X.toggleSel(Q.sel,i);X.render();}else answer(i,false);};
X.acts.aisubmit=function(){answer(Q.sel.slice(),false);};
X.acts.ainext=function(){if(Q.checkResult&&X.state().view==='aicheck'){Q.checkResult=null;}
  if(Q.diag&&Q.diag.pending){Q.diag.pending=false;Q.picked=null;Q.diagShow=true;X.go('ai');return;}
  Q.diag=null;A.diag=null;save();show();};
X.acts.aidiag=function(b){var d=Q.diag,step=d.steps[d.i];d.pick=b.dataset.i==='dk'?'dk':+b.dataset.i;var ok=d.pick===step.a;
  diagResult(step,ok);if(!ok)d.failed=true;save();X.render();};
X.acts.aidiagnext=function(){var d=Q.diag;
  if(d.failed||d.i+1>=d.steps.length){Q.diag=null;A.diag=null;save();show();return;}
  d.i++;d.pick=null;save();X.render();};
X.acts.ailessondone=function(){var item=Q.item;X.markCleared(item.f,item.l,'lesson');show();};
})();
