/* まいにちSPI 画面と進み具合 */
(function(){
/* ===== 進み具合（この端末にだけ保存） ===== */
var KEY='mainichi-spi-progress-v1', P={};
try{P=JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(e){P={};}
function save(){try{localStorage.setItem(KEY,JSON.stringify(P));}catch(e){}}
/* ===== 解答の記録（AIモードで弱点を見つけるのに使う） ===== */
var LOGKEY='mainichi-spi-log-v1', LOG=[];
try{LOG=JSON.parse(localStorage.getItem(LOGKEY)||'[]')||[];}catch(e){LOG=[];}
function qid(it){var s=it.id||it.q,h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return it.id||('q'+(h>>>0).toString(36));}
function logAnswer(rec){LOG.push(rec);if(LOG.length>3000)LOG=LOG.slice(-3000);try{localStorage.setItem(LOGKEY,JSON.stringify(LOG));}catch(e){}}
/* 結果の4分類：fast 正解・時間内／slow 正解・時間超過／wrong 不正解／timeout 時間切れ */
function classify(ok,sec,target,to){return to?'timeout':!ok?'wrong':sec<=target?'fast':'slow';}
/* ===== 数値を変える問題（テンプレート） =====
   {id:'…', make:function(R){ return {q,c,a,inw,fig,calc,sec?}; }} の形。出すたびに make を呼び、新しい数値の問題を作る。
   R は乱数の道具：R.int(min,max), R.pick(配列), R.shuffle(配列)。 */
var RND={int:function(a,b){return a+Math.floor(Math.random()*(b-a+1));},pick:function(x){return x[Math.floor(Math.random()*x.length)];},shuffle:function(x){return shuffle(x);}};
function inst(it){if(!it||!it.make)return it;for(var k=0;k<30;k++){try{var o=it.make(RND);if(o&&o.q){o.id=o.id||it.id;o.src=it;return o;}}catch(e){}}return null;}
/* ===== 選択肢（単一選択と「すべて選ぶ」） ===== */
var LT='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function isMulti(it){return Array.isArray(it.a);}
function isRight(it,p){if(!isMulti(it))return p===it.a;if(!Array.isArray(p))return false;var a=it.a.slice().sort(),b=p.slice().sort();return a.length===b.length&&a.every(function(x,i){return x===b[i];});}
function inAns(it,i){return isMulti(it)?it.a.indexOf(i)>=0:i===it.a;}
function inPick(p,i){return Array.isArray(p)?p.indexOf(i)>=0:p===i;}
function ansText(it){return isMulti(it)?it.a.map(function(i){return LT[i];}).join('・'):it.c[it.a];}
function pickText(it,p){if(p==null||p===-1||(Array.isArray(p)&&!p.length))return '';if(p==='dk')return 'わからない';return Array.isArray(p)?p.map(function(i){return LT[i];}).join('・'):LT[p]+'　'+it.c[p];}
/* 「わからない」：選ぶと不正解（当てずっぽうの正解を防ぐ。模擬テストにはつけない） */
function dkHtml(act,picked){return '<button class="choice dk'+(picked==='dk'?' wrong':'')+'" data-act="'+act+'" data-i="dk"'+(picked!=null?' disabled':'')+'><span class="lt"></span>わからない</button>';}
function choicesHtml(it,picked,sel,act,sub,dk){var h='<div class="choices">';
  it.c.forEach(function(c,i){var cls='';
    if(picked!=null){if(inAns(it,i))cls=' correct';else if(inPick(picked,i))cls=' wrong';}
    else if(sel&&sel.indexOf(i)>=0)cls=' sel';
    h+='<button class="choice'+cls+'" data-act="'+act+'" data-i="'+i+'"'+(picked!=null?' disabled':'')+(isMulti(it)&&picked==null?' aria-pressed="'+(cls===' sel')+'"':'')+'><span class="lt">'+LT[i]+'</span>'+c+'</button>';});
  if(dk)h+=dkHtml(act,picked);
  h+='</div>';
  if(isMulti(it)&&picked==null)h+='<button class="next" data-act="'+sub+'">決定</button>';
  return h;}
function toggleSel(sel,i){var k=sel.indexOf(i);if(k>=0)sel.splice(k,1);else sel.push(i);}
/* ===== 本番形式（2タブの組問）：実践②のあとの段階。組があるときだけ出す ===== */
var SETST={key:'set',name:'本番形式',win:3,need:2,set:true};
function stl(f,l){return (window.SETCORE&&SETCORE.list(f,l).length)?STAGES.concat([SETST]):STAGES;}
function CS(){return stl(S.field,S.level)[S.stage];}
function targetOf(it,l){return it.sec||TARGET_SEC[l]||90;}
function strictTimer(){return (CS().key===TIMER.stage||CS().set)&&S.level>=TIMER.fromLevel;}
function cleared(f,l,s){return !!P[f+'|'+l+'|'+s];}
function stagesCleared(f,l){var n=0;stl(f,l).forEach(function(s){if(cleared(f,l,s.key))n++;});return n;}
function hasContent(f,l){return !!(BANK[f]&&BANK[f][l]);}
function fieldDone(f,l){return stagesCleared(f,l)===stl(f,l).length;}
function levelHas(l){return CURRICULUM[l].some(function(f){return hasContent(f,l);});}
function levelDone(l){return CURRICULUM[l].every(function(f){return !hasContent(f,l)||fieldDone(f,l);});}
/* ロックはしない。中身があれば開ける。講座の順で次にやるものを「推奨」として目立たせる */
function levelOpen(l){return levelHas(l);}
function fieldOpen(f,l){return hasContent(f,l);}
function stageOpen(f,l,i){return true;}
function recLevel(){for(var k=0;k<LEVELS.length;k++)if(levelHas(LEVELS[k])&&!levelDone(LEVELS[k]))return LEVELS[k];return null;}
function recField(l){var fs=CURRICULUM[l];for(var k=0;k<fs.length;k++)if(hasContent(fs[k],l)&&!fieldDone(fs[k],l))return fs[k];return null;}
function recStage(f,l){var g=stl(f,l);for(var k=0;k<g.length;k++)if(!cleared(f,l,g[k].key))return k;return -1;}

/* ===== 画面 ===== */
var titleV=document.getElementById('title'), appV=document.getElementById('app'), inner=document.getElementById('inner');
var S={view:'menu'};
var PARENT={about:'menu',levels:'menu',fields:'levels',stages:'fields',quiz:'stages',clear:'stages',lesson:'stages',ai:'aihome',reset:'menu',howto:'menu',ailesson:'aihome',aicheck:'aihome',aihome:'menu',aiplace:'aihome',aiintro:'aihome',aiexam:'aihome',mock:'menu',mockq:'mock',mockres:'mock'};
/* AIモード（js/ai.js）が使う共通の部品 */
var SPI=window.SPI={barAttr:barAttr,barReset:barReset,views:{},acts:{},state:function(){return S;},go:function(v){go(v);},render:function(){render();},
  inner:function(){return inner;},logAnswer:function(r){logAnswer(r);},classify:classify,targetOf:targetOf,qid:qid,
  shuffle:function(x){return shuffle(x);},cleared:function(f,l,k){return cleared(f,l,k);},
  markCleared:function(f,l,k){P[f+'|'+l+'|'+k]=1;save();},
  inwText:function(it,f){return it.inw||(it.fig&&it.fig.parts?it.fig.parts.filter(function(x){return x.n;}).map(function(x){return x.n;}).join('・'):'');},
  inwHead:function(it,f){return it.inwh||(f==='順列・組合せ'?'整理':'内訳');},
  figHtml:function(f){return figHtml(f);},inst:inst,isMulti:isMulti,isRight:isRight,ansText:ansText,pickText:pickText,choicesHtml:choicesHtml,dkHtml:dkHtml,toggleSel:toggleSel,bar:function(n){return bar(n);},icon:function(k){return ICON[k];},
  lessonHtml:function(f,l){return lessonHtml(f,l);}};
var ICON={
 back:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
 chev:'<svg class="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',
 rec:'<svg class="rec-ic" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="推奨"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/></svg>',
 lock:'<svg class="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="ロック中"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
 check:'<svg class="done-mark" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="クリア"><path d="M5 12l5 5 9-10"/></svg>',
 ok:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><circle cx="12" cy="12" r="8"/></svg>',
 ng:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 big:'<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>'
};
function bar(name,logo){
  return '<div class="bar"><button class="back" data-act="back" aria-label="もどる">'+ICON.back+'</button>'+
    (logo?'<span class="mini-logo" aria-hidden="true">SPI</span>':'')+'<span class="bar-name">'+name+'</span>'+(S.view==='quiz'?streakHtml():'')+'</div>';
}
function streakHtml(){var g=CS(),r=(S.hist||[]).slice(-g.win),n=stageOk(r,g),h='<span class="streak" role="img" aria-label="正解 '+n+' / '+g.need+'">';for(var i=0;i<g.win;i++)h+='<i class="'+(i<r.length?(r[i]?'on':'ng'):'')+'"></i>';return h+'<b>'+n+'/'+g.need+'</b></span>';}
function progHtml(n,t){t=t||STAGES.length;var h='<span class="prog" role="img" aria-label="'+n+' / '+t+'">';for(var i=0;i<t;i++)h+='<i class="'+(i<n?'on':'')+'"></i>';return h+'</span>';}
function cellHtml(x,tag,cls){var c=cls||'';x=x==null?'':String(x);if(x&&x.charAt(0)==='!'){x=x.slice(1);c+=' ask';}else if(x==='?')c+=' ask';return '<'+tag+(c?' class="'+c.trim()+'"':'')+'>'+(x||'')+'</'+tag+'>';}
function figHtml(f){
  if(!f)return '';
  if(f.table){var t='<div class="tbl-wrap"><table class="tbl"><tr>';
    f.table.head.forEach(function(x){t+=cellHtml(x,'th');});t+='</tr>';
    f.table.rows.forEach(function(r){t+='<tr>';r.forEach(function(x,i){t+=cellHtml(x,i===0?'th':'td',r[0]==='計'||i===r.length-1&&f.table.head[i]==='計'?'sum':'');});t+='</tr>';});
    return t+'</table></div>';}
  var rows=f.rows||[[{n:f.whole.n||'全体',r:f.whole.r,v:f.whole.v,ask:f.whole.ask,w:1}],f.parts];
  var w='<div class="fig" role="img" aria-label="図">';
  rows.forEach(function(row){w+='<div class="row">';row.forEach(function(p){
    var top=p.n?(p.n+(p.r?'：'+p.r:'')):(p.r||''),bot=p.v||'';var sp=!p.n&&!p.r&&!p.v;
    w+='<div class="seg'+(p.ask?' ask':'')+(sp?' sp':'')+'" style="flex:'+p.w+'"><span class="t'+(top.indexOf('?')>=0?' ask-v':'')+'">'+(top||'&nbsp;')+'</span><span class="arr"></span><span class="v'+(bot.indexOf('?')>=0?' ask-v':'')+'">'+(bot||'&nbsp;')+'</span></div>';});
    w+='</div>';});
  return w+'</div>';
}

function render(){
  var h='';
  if(S.view==='menu'){
    h=bar('まいにちSPI',true)+
    '<button class="item primary" data-act="ai"><span class="ic" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z"/><path d="M19 15l.8 1.7 1.7.8-1.7.8L19 20l-.8-1.7-1.7-.8 1.7-.8z"/></svg></span><span class="name">AIにお任せ教育モード</span>'+ICON.chev+'</button>'+
    '<button class="item" data-act="fields"><span class="ic blue" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg></span><span class="name">分野別勉強モード</span>'+ICON.chev+'</button>'+
    '<button class="item" data-act="mock"><span class="ic orange" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2"/><path d="M9 2h6"/></svg></span><span class="name">模擬テスト</span>'+ICON.chev+'</button>'+
    '<button class="item compact about" data-act="about"><span class="name">SPIとは</span>'+ICON.chev+'</button>'+
    '<button class="item compact howto" data-act="howto"><span class="name">使い方</span>'+ICON.chev+'</button>'+
    '<div class="reset-row"><button class="reset-btn" data-act="reset">リセット</button></div>';
  } else if(S.view==='howto'){
    h=bar('使い方');
    HOWTO.forEach(function(sec){h+='<section class="lesson"><h2>'+sec.h+'</h2>'+(sec.p?'<div class="lp">'+sec.p+'</div>':'')+(sec.fig?figHtml(sec.fig):'')+'</section>';});
  } else if(S.view==='reset'){
    h=bar('リセット')+'<div class="q">この端末のすべての記録を消しますか。</div>'+
      '<button class="next danger" data-act="resetdo">消す</button><button class="next ghost" data-act="back">もどる</button>';
  } else if(S.view==='levels'){
    h=bar('分野別勉強モード');
    LEVELS.forEach(function(l){var has=levelHas(l),open=levelOpen(l);
      h+='<button class="item compact'+(l===recLevel()?' rec':'')+'" data-act="level" data-l="'+l+'"'+(open?'':' disabled')+'>'+(l===recLevel()?ICON.rec:'')+'<span class="num">'+l+'</span><span class="name">指標'+l+'</span>'+
        (has&&levelDone(l)?ICON.check:'')+(open?ICON.chev:'')+'</button>';});
  } else if(S.view==='fields'){
    h=bar('指標'+S.level);
    CURRICULUM[S.level].forEach(function(f){var has=hasContent(f,S.level),open=fieldOpen(f,S.level),n=stagesCleared(f,S.level);
      h+='<button class="item compact'+(f===recField(S.level)?' rec':'')+'" data-act="field" data-f="'+f+'"'+(open?'':' disabled')+'>'+(f===recField(S.level)?ICON.rec:'')+'<span class="name">'+f+'</span>'+
        (has?(n===stl(f,S.level).length?ICON.check:progHtml(n,stl(f,S.level).length)):'')+(open?ICON.chev:'')+'</button>';});
  } else if(S.view==='stages'){
    h=bar(S.field+'・指標'+S.level);
    stl(S.field,S.level).forEach(function(s,i){var open=stageOpen(S.field,S.level,i),done=cleared(S.field,S.level,s.key);
      h+='<button class="item compact'+(i===recStage(S.field,S.level)?' rec':'')+'" data-act="stage" data-i="'+i+'"'+(open?'':' disabled')+'>'+(i===recStage(S.field,S.level)?ICON.rec:'')+'<span class="num">'+(i+1)+'</span><span class="name">'+s.name+'</span>'+(done?ICON.check:'')+ICON.chev+'</button>';});
  } else if(S.view==='quiz'&&CS().set){h=setHtml();
  } else if(S.view==='quiz'){
    var it=S.pool[S.idx];
    h=bar(CS().name)+(S.picked==null&&strictTimer()?'<div class="timer" role="img" aria-label="制限時間"><i id="tbar"'+barAttr(S.t0,targetOf(it,S.level)*1000)+'></i></div>':'')+'<div class="q">'+it.q+'</div>'+choicesHtml(it,S.picked,S.sel,'pick','submit',true);
    if(S.picked!=null){var ok=isRight(it,S.picked);
      h+='<div class="result"><div class="verdict '+(ok?'ok':'ng')+'">'+(ok?ICON.ok+'正解':ICON.ng+(S.timeout?'時間切れ':'不正解'))+'<span class="sec'+(S.lastR==='slow'?' over':'')+'">'+S.lastSec+'秒</span></div>'+'<div class="calc"><b>'+(it.inwh||(S.field==='順列・組合せ'?'整理':'内訳'))+'</b>　'+SPI.inwText(it)+'</div>'+figHtml(it.fig)+'<div class="calc">'+it.calc+'</div><div class="calc"><b>答え</b>　'+ansText(it)+'</div>'+
        '<button class="next" data-act="next">次へ</button></div>';}
  } else if(S.view==='about'){
    h=bar('SPIとは');
    ABOUT.forEach(function(sec){h+='<section class="lesson"><h2>'+sec.h+'</h2>'+(sec.p?'<div class="lp">'+sec.p+'</div>':'')+(sec.fig?figHtml(sec.fig):'')+(sec.p2?'<div class="lp">'+sec.p2+'</div>':'')+'</section>';});
  } else if(S.view==='lesson'){
    h=bar(S.field+'・指標'+S.level);
    h+=lessonHtml(S.field,S.level);
    h+='<button class="next" data-act="lessondone">'+STAGES[1].name+'へ</button>';
  } else if(S.view==='clear'){
    var nx=S.stage+1<stl(S.field,S.level).length;
    h=bar('')+'<div class="clear"><div class="clear-badge">'+ICON.big+'</div><div class="clear-text">'+CS().name+'<br>クリア</div>'+
      '<button class="next" data-act="'+(nx?'nextstage':'tostages')+'">'+(nx?stl(S.field,S.level)[S.stage+1].name+'へ':'もどる')+'</button></div>';
  }
  else if(SPI.views[S.view]){h=SPI.views[S.view]();}
  inner.innerHTML=h;
  if(S.view==='quiz'&&CS().set&&!S.graded)fitSet();
}
function lessonHtml(f,l){var h='';((typeof ESSENCE!=='undefined'&&ESSENCE[f])||[]).concat(LESSON[f]&&LESSON[f][l]||[]).forEach(function(sec){
  h+='<section class="lesson"><h2>'+sec.h+'</h2>'+(sec.q?'<div class="q ex">'+sec.q+'</div>':'')+(sec.p?'<div class="lp">'+sec.p+'</div>':'')+(sec.fig?figHtml(sec.fig):'')+(sec.p2?'<div class="lp">'+sec.p2+'</div>':'')+'</section>';});return h;}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function instPool(p){return p.map(inst).filter(function(x){return x;});}
function startStage(i){if(stl(S.field,S.level)[i].set){S.stage=i;S.hist=[];S.slist=setOrder();S.sk=0;newSet();S.view='quiz';return;}
  S.stage=i;S.hist=[];S.base=BANK[S.field][S.level][STAGES[i].key];S.pool=instPool(shuffle(S.base));S.idx=0;S.picked=null;S.view='quiz';}
var tick=null;
/* タイマーのバーは描き直すたびに残り時間の幅で作る（選択で描き直したときに一瞬満タンに戻らないように） */
/* 新しい問題を始めた直後は、前の問題の時刻で描かれたバーをアニメーションなしで満タンに戻す */
function barReset(id){var b=document.getElementById(id);if(!b)return;b.style.transition='none';b.style.width='100%';b.className='';void b.offsetWidth;b.style.transition='';}
function barAttr(t0,lim){var left=Math.max(0,1-(Date.now()-t0)/lim);return ' class="'+(left>0.5?'':left>0.2?'warn':'end')+'" style="width:'+(left*100)+'%"';}
function stopTimer(){if(tick){clearInterval(tick);tick=null;}}
function startQuestion(){stopTimer();S.t0=Date.now();S.timeout=false;S.sel=[];
  if(!strictTimer())return;barReset('tbar');var lim=curLim();
  tick=setInterval(function(){var b=document.getElementById('tbar');var left=1-(Date.now()-S.t0)/lim;
    if(b){b.style.width=Math.max(0,left*100)+'%';b.className=left>0.5?'':left>0.2?'warn':'end';}
    if(left<=0){stopTimer();if(CS().set)gradeSet(true);else answer(-1,true);}},200);}
function answer(i,to){stopTimer();var it=S.pool[S.idx],ok=!to&&isRight(it,i),sec=Math.round((Date.now()-S.t0)/1000),tg=targetOf(it,S.level);
  S.picked=i;S.timeout=!!to;S.lastSec=sec;S.lastR=classify(ok,sec,tg,to);S.hist=(S.hist||[]).concat([ok]).slice(-CS().win);
  logAnswer({t:Date.now(),f:S.field,l:S.level,s:CS().key,q:qid(it),r:S.lastR,sec:sec,tg:tg,pick:i});
  render();var r=inner.querySelector('.result');if(r)r.scrollIntoView({block:'nearest',behavior:'smooth'});}
function curLim(){if(CS().set)return S.cs.subs.reduce(function(t,u){return t+targetOf(u,S.level);},0)*1000;return targetOf(S.pool[S.idx],S.level)*1000;}
function go(v){if(v!=='quiz')stopTimer();S.view=v;render();appV.scrollTop=0;if(v==='quiz'&&S.picked==null&&!(CS().set&&S.graded))startQuestion();}
/* ===== 本番形式の画面：共通の文章・タブ・問い。全部のタブを解いて最後の「次へ」でまとめて正誤を出す ===== */
/* 問題集の本物の組を先に、作った組をそのあとに出す */
function setOrder(){var xs=SETCORE.list(S.field,S.level);return shuffle(xs.filter(function(t){return t.book;})).concat(shuffle(xs.filter(function(t){return !t.book;})));}
function newSet(){var t=null,n=0;while(!t&&n<S.slist.length*2){if(S.sk>=S.slist.length){S.slist=setOrder();S.sk=0;}t=SETCORE.make(S.field,S.slist[S.sk++]);n++;}
  S.cs=t;S.ti=0;S.sa=t?t.subs.map(function(u){return isMulti(u)?[]:null;}):[];S.graded=false;S.picked=null;S.fs=15;S.fitting=true;}
function setTabsHtml(){return '<div class="tabs" role="tablist">'+S.cs.subs.map(function(u,i){var d=S.sa[i],done=d!=null&&(!Array.isArray(d)||d.length);
  return '<button class="tab'+(i===S.ti?' on':'')+'" role="tab" aria-selected="'+(i===S.ti)+'" data-act="stab" data-i="'+i+'">'+(i+1)+(done?'<i class="d"></i>':'')+'</button>';}).join('')+'</div>';}
function setHtml(){var c=S.cs,h;
  if(!c)return bar(CS().name)+'<div class="q">問題を作れませんでした。</div>';
  if(!S.graded){var u=c.subs[S.ti],a=S.sa[S.ti];
    h='<div class="kq" id="kq">'+bar(CS().name)+(strictTimer()?'<div class="timer" role="img" aria-label="制限時間"><i id="tbar"'+barAttr(S.t0,curLim())+'></i></div>':'');
    h+='<div class="q stem">'+c.stem+'</div>'+setTabsHtml()+'<div class="q sub">'+u.q+'</div><div class="choices">';
    u.c.forEach(function(x,i){var on=isMulti(u)?(a||[]).indexOf(i)>=0:a===i;h+='<button class="choice'+(on?' sel':'')+'" data-act="spick" data-i="'+i+'">'+'<span class="lt">'+LT[i]+'</span>'+x+'</button>';});
    h+='<button class="choice dk'+(a==='dk'?' sel':'')+'" data-act="spick" data-i="dk"><span class="lt"></span>わからない</button></div>';
    h+='<div class="navs">'+(S.ti>0?'<button class="next ghost" data-act="stab" data-i="'+(S.ti-1)+'">前へ</button>':'')+'<button class="next" data-act="snext">次へ</button></div></div>';
    return h;}
  h=bar(CS().name)+'<div class="q">'+c.stem+'</div>';
  c.subs.forEach(function(u,i){var p=S.sa[i],ok=isRight(u,p);
    h+='<div class="set-res"><div class="verdict '+(ok?'ok':'ng')+'">'+(ok?ICON.ok:ICON.ng)+(i+1)+'　'+(ok?'正解':S.timeout&&(p==null||(Array.isArray(p)&&!p.length))?'時間切れ':'不正解')+'</div><div class="q">'+u.q+'</div>'+choicesHtml(u,p==null?[]:p,null,'none','none',false)+
      '<div class="result">'+(u.inw?'<div class="calc"><b>'+(u.inwh||'内訳')+'</b>　'+u.inw+'</div>':'')+figHtml(u.fig)+'<div class="calc">'+(u.calc||'')+'</div></div></div>';});
  return h+'<button class="next" data-act="snextset">次へ</button>';}
/* 一画面に収まる大きさ（上限15px、下限9px）。組の中では一番小さい値にそろえる */
function fitSet(){var k=document.getElementById('kq');if(!k)return;var fs=S.fs||15;k.style.setProperty('--fs',fs+'px');
  var over=function(){var r=k.getBoundingClientRect();return r.top+k.scrollHeight>window.innerHeight-4||k.scrollWidth>k.clientWidth+1;};
  while(fs>9&&over()){fs-=0.25;k.style.setProperty('--fs',fs+'px');}S.fs=fs;
  if(S.fitting){S.fitting=false;var t=S.ti;for(var i=S.cs.subs.length-1;i>=0;i--){S.ti=i;render();}S.ti=t;render();}}
function gradeSet(to){stopTimer();var c=S.cs,sec=Math.round((Date.now()-S.t0)/1000),all=true;S.timeout=!!to;
  c.subs.forEach(function(u,i){var p=S.sa[i],ok=isRight(u,p);if(!ok)all=false;
    logAnswer({t:Date.now(),f:S.field,l:S.level,s:'set',q:c.id+'-'+(i+1),r:classify(ok,sec,curLim()/1000,to&&!ok),sec:sec,tg:Math.round(curLim()/1000),pick:p});});
  S.hist=(S.hist||[]).concat([all]).slice(-SETST.win);S.graded=true;S.picked=0;render();appV.scrollTop=0;}

inner.addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b||b.disabled)return;var a=b.dataset.act;
  if(a==='back'){if(S.view==='menu'){location.hash='';showTitle();}else go(PARENT[S.view]);}
  else if(a==='fields'){go('levels');}
  else if(a==='about'){go('about');}
  else if(a==='field'){S.field=b.dataset.f;go('stages');}
  else if(a==='level'){S.level=+b.dataset.l;go('fields');}
  else if(a==='stage'){var si=+b.dataset.i;if(stl(S.field,S.level)[si].lesson){S.stage=si;go('lesson');}else{startStage(si);go('quiz');}}
  else if(a==='lessondone'){P[S.field+'|'+S.level+'|lesson']=1;save();startStage(1);go('quiz');}
  else if(a==='pick'&&b.dataset.i==='dk'){answer('dk',false);}
  else if(a==='pick'){var pi=+b.dataset.i;if(isMulti(S.pool[S.idx])){toggleSel(S.sel,pi);render();}else answer(pi,false);}
  else if(a==='submit'){answer(S.sel.slice(),false);}
  else if(a==='next'){
    if(stagePassed(S.hist,CS())){P[S.field+'|'+S.level+'|'+CS().key]=1;save();go('clear');return;}
    S.idx++;S.picked=null;
    if(S.idx>=S.pool.length){var last=S.pool[S.pool.length-1].src||S.pool[S.pool.length-1],nb=shuffle(S.base);if(nb.length>1&&nb[0]===last)nb.push(nb.shift());S.pool=instPool(nb);S.idx=0;}
    go('quiz');
  }
  else if(a==='spick'){var u=S.cs.subs[S.ti],v=b.dataset.i;if(v==='dk')S.sa[S.ti]=S.sa[S.ti]==='dk'?(isMulti(u)?[]:null):'dk';else{v=+v;if(isMulti(u)){var x=Array.isArray(S.sa[S.ti])?S.sa[S.ti].slice():[];toggleSel(x,v);S.sa[S.ti]=x;}else S.sa[S.ti]=v;}render();}
  else if(a==='stab'){S.ti=+b.dataset.i;render();}
  else if(a==='snext'){if(S.ti<S.cs.subs.length-1){S.ti++;render();}else gradeSet(false);}
  else if(a==='snextset'){if(stagePassed(S.hist,SETST)){P[S.field+'|'+S.level+'|set']=1;save();go('clear');return;}newSet();go('quiz');}
  else if(a==='nextstage'){startStage(S.stage+1);go('quiz');}
  else if(a==='tostages'){go('stages');}
  else if(a==='reset'){go('reset');}
  else if(a==='howto'){go('howto');}
  else if(a==='resetdo'){try{Object.keys(localStorage).forEach(function(k){if(k.indexOf('mainichi-spi-')===0)localStorage.removeItem(k);});}catch(e){}
    location.hash='menu';location.reload();}
  else if(SPI.acts[a]){SPI.acts[a](b);}
});

function showTitle(){titleV.hidden=false;appV.hidden=true;}
function showApp(){titleV.hidden=true;appV.hidden=false;S={view:'menu'};render();}
document.getElementById('start').addEventListener('click',function(){location.hash='menu';showApp();});
window.addEventListener('hashchange',function(){if(location.hash==='#menu'){if(appV.hidden)showApp();}else showTitle();});
if(location.hash==='#menu')showApp();
})();
