/* まいにちSPI 模擬テスト
   設計：全体設計書「模擬テスト」の章。
   - 全体23分（回答数は人によって違う）。1問ごとに本番と同じタイマー（青→黄→赤、0で次へ）。戻れない。解説は終わってから。
   - 計算と推論を1本のはしごで上下する（IRTをまねた簡易版。詳しくは下）。
   - 問題は 実践（単純な数値）と実践（実際の数値）を共用する。 */
(function(){
var X=window.SPI, MKEY='mainichi-spi-mock-v1', TOTAL=23*60*1000, T=null, tick=null;
/* 自己ベスト：推定段階 → 実力の推定値 → 正解数 の順で比べ、いちばん良い1回を別に残す（履歴の30件とは別） */
var BKEY='mainichi-spi-mock-best-v1';
function best(){try{var b=JSON.parse(localStorage.getItem(BKEY)||'null');if(b)return b;}catch(e){}
  var hs=hist().filter(function(x){return x.est!=null;});var m=null;hs.forEach(function(x){if(better(x,m))m=x;});return m;}
function better(a,b){if(!b)return true;if(a.est!==b.est)return a.est>b.est;if((a.th||0)!==(b.th||0))return (a.th||0)>(b.th||0);return a.ok>b.ok;}
function hist(){try{return JSON.parse(localStorage.getItem(MKEY)||'[]')||[];}catch(e){return [];}}
function saveHist(h){try{localStorage.setItem(MKEY,JSON.stringify(h.slice(-30)));}catch(e){}}
function fields(l){return (CURRICULUM[l]||[]).filter(function(f){return BANK[f]&&BANK[f][l];});}
function levels(){return LEVELS.filter(function(l){return fields(l).length;});}

/* 本番（テストセンター）の非言語をまねる。根拠は README「模擬テスト」（受検者の報告・ガイダンス資料）。
   しくみ（IRTの考え方）：
   - 能力 θ を、これまでの全回答から推定する（各問題に難しさ b を付け、正解率 1/(1+e^(−1.7(θ−b))) とおいたときの事後平均）。
     難しい問題に正解すると大きく上がり、易しい問題を間違えると大きく下がる。
     b：計算＝その指標（3〜5）、1つ選ぶ推論＝5.5、すべて選ぶ（指標6）＝6.3、すべて選ぶ（指標7）＝7。
     目標時間より遅い正解は「b−slow の問題に正解した」とみなす（ぎりぎりの正解では上の段階の証拠にならない）。時間切れは不正解。
   - 次の問題は θ に合わせる：計算は θ を四捨五入した指標3〜5（分野は指標ごとにランダムな位置から順に回す）。
     推論の割合は θ に応じた目標（rateOf）に合わせ、足りなければ推論、足りていれば計算を出す（計算も最後まで出続ける）。
     推論は問題集の問題だけ（組問と組でない問題）。「すべて選ぶ」を含む画面は θ に応じた上限（cbCap）まで、間に1つ選ぶ画面を cd 問はさむ。
   - 全体23分、時間切れまで。1問目は表の読み取り（指標4）。
   - 1問の制限時間（本番の推定）：計算 指標3・4は90秒、指標5と表は120秒、1つ選ぶ推論120秒、すべて選ぶ180秒（1小問あたり）。
   - 推定段階＝最後の θ に sh（0.3）を足した整数部分（1〜7）。「すべて選ぶ」の回数は判定には使わない。結果として受検者報告の目安
     （7＝cb×3以上／6・5＝cb×2／4＝cb×1／3＝なし）に合うよう c1〜c3 を推定段階の境目に置いた（app-tools/sim_population_set.js）。 */
var P=window.MOCK_P||{c1:3.7,c2:4.7,c3:6.7,slow:0.7,cd:1,sh:0.3,n7:12},SL=1.7,TBL=['表の解釈','情報の読み取り'];
/* 推論の1問（小問）の制限時間。2026-11-20 ユーザー指示で変えない（問題を難しくすると時間は自然に足りなくなる） */
var LIM={one:120,cb:180};
/* 推論の割合の目標（受検者報告：4＝5割未満／5＝4割／6・7＝5割以上）。θ の間は直線でつなぐ。推定段階6（θ≥5.7）で5割を超えるようにする。割合は画面（組問1つ＝1問）で数える */
var RT=[[3,0.15],[4,0.25],[5,0.35],[5.7,0.55],[7,0.65]];
function rateOf(th){if(th<=RT[0][0])return RT[0][1];for(var i=1;i<RT.length;i++)if(th<=RT[i][0]){var a=RT[i-1],b=RT[i];return a[1]+(b[1]-a[1])*(th-a[0])/(b[0]-a[0]);}return RT[RT.length-1][1];}
/* 「すべて選ぶ」を含む画面の上限（受検者報告：7＝cb×3／6・5＝cb×2／4＝cb×1）。しきい値は推定段階の境目（θ+0.3 の整数部分）に合わせた */
function cbCap(th){return th>=P.c3?3:th>=P.c2?2:th>=P.c1?1:0;}
function start(){T={th:4,cd:0,i:0,ans:[],used:[],uinf:[],scr:[],t0:Date.now(),fi:{},cb:0,inf:0,n:0};nextQ();}
function limOf(c){return c.k==='m'?LIM.cb:c.k==='e'?LIM.one:(c.l>=5||TBL.indexOf(c.f)>=0)?120:90;}
/* 推論の難しさ b（2026-11-20）：形式と選択肢の数で決める（すべて選ぶ・選択肢が多いほど難しい） */
function bInf(it){var n=(it&&it.c||[]).length,b=X.isMulti(it)?(n>=8?7:n>=6?6.6:6.3):(n>=6?6:5.5);return it&&it.lv===7?Math.max(b,6.8):b;}
function bOf(x){return x.k==='c'?x.l:bInf(x.it);}
/* 推論の出題候補：問題集の組問（set_suiron.js）、組でない問題集の問題（book_suiron*.js の bk〜）、問題集の文の形で指標6・7を分けて作る組（gen_suiron_lv.js、SETS に入る）。
   易しい自作の推論（suiron_6/7.js・gen_suiron.js）は使わない */
var INF=null;
function infPool(){if(INF)return INF;var s=[],inSet={},B=BANK['推論']||{};
  [6,7].forEach(function(l){if(!window.SETCORE)return;SETCORE.list('推論',l).forEach(function(t){s.push({id:t.id,set:t,l:l});(t.ids||[]).forEach(function(i){[].concat(i).forEach(function(j){inSet['bk'+j]=1;});});});});
  [6,7].forEach(function(l){((B[l]||{}).real||[]).forEach(function(x){if(/^bk/.test(x.id||'')&&!inSet[x.id])s.push({id:x.id,src:x,l:l});});});
  return INF=s;}
function hasCb(cs){return cs.subs.some(function(u){return X.isMulti(u);});}
/* 生成した指標7の組（gen_suiron_lv.js）は θ≥5.7（推定段階6以上の力）になってから出す */
function infOk(o){return !(o.l===7&&/^set-gen/.test(o.id)&&T.th<5.7);}
function pickInf(want){var p=X.shuffle(infPool().filter(function(o){return T.uinf.indexOf(o.id)<0&&infOk(o);})),keep=null;
  if(!p.length){T.uinf=[];p=X.shuffle(infPool().filter(infOk));}
  for(var j=0;j<p.length&&j<40;j++){var o=p[j],cs=null;
    if(o.set){for(var n=0;n<4&&!cs;n++)cs=SETCORE.make('推論',o.set);}
    else{var it=X.inst(o.src);if(it)cs={stem:'',subs:[it],single:1};}
    if(!cs)continue;var r={o:o,cs:cs};if(want==null||hasCb(cs)===want){T.uinf.push(o.id);return r;}if(!keep)keep=r;}
  if(keep)T.uinf.push(keep.o.id);return keep;}
function estTheta(){var num=0,den=0;
  for(var t=0;t<=8.5;t+=0.05){var w=Math.exp(-Math.pow(t-4.5,2)/(2*1.25*1.25));
    T.ans.forEach(function(x){var b=bOf(x)-(x.r==='slow'?P.slow:0),p=1/(1+Math.exp(-SL*(t-b)));w*=okOf(x)?p:1-p;});
    num+=w*t;den+=w;}
  return den?num/den:4;}
function clamp(x,lo,hi){return Math.max(lo,Math.min(hi,x));}
function pickItem(l,want,only){var fs=fields(l).filter(function(f){return !only||only.indexOf(f)>=0;});if(!fs.length)fs=fields(l);var k=T.fi[l]!=null?T.fi[l]:Math.floor(Math.random()*fs.length),tries=0;
  while(tries<fs.length*2){var f=fs[k%fs.length];k++;tries++;
    var p=X.shuffle([].concat((BANK[f][l].real||[]),(BANK[f][l].applied||[])).filter(function(x){return T.used.indexOf(x)<0;}));
    var keep=null;
    for(var j=0;j<p.length&&j<40;j++){var x=X.inst(p[j]);if(!x)continue;
      if(want==null||X.isMulti(x)===want){T.fi[l]=k;T.used.push(p[j]);return {f:f,l:l,it:x};}
      if(!keep)keep={src:p[j],it:x};}
    if(keep){T.fi[l]=k;T.used.push(keep.src);return {f:f,l:l,it:keep.it};}}
  return null;}
function nextQ(){if(T.i>=60||Date.now()-T.t0>=TOTAL){finish();return;}
  /* 推論を出すのは、これまでの推論の数が「目標の割合×(これまでの問題数+1)」に届いていないとき。足りていれば計算 */
  var l,w=null,k,only=null,slot=T.i===0?'t':(!infPool().length?'c':T.inf<rateOf(T.th)*(T.n+1)?'i':'c');
  if(slot==='i'){var want=T.cd<=0&&T.cb<cbCap(T.th),r=pickInf(want);if(!r){finish();return;}
    var cb=hasCb(r.cs);if(cb)T.cd=P.cd;else T.cd--;T.inf++;
    if(r.cs.single){var it=r.cs.subs[0];T.cur={f:'推論',l:r.o.l,it:it,k:X.isMulti(it)?'m':'e'};T.scr.push({k:'i',cb:cb});if(cb)T.cb++;T.qt0=Date.now();T.sel=[];X.go('mockq');run();return;}
    startSet('推論',r.o.l,r.cs,'e');return;}
  k='c';l=clamp(Math.round(T.th),3,5);while(l>3&&!fields(l).length)l--;if(slot==='t'){only=TBL;l=4;}
  T.cur=pickItem(l,w,only);if(!T.cur){finish();return;}
  /* 本番形式：計算はその分野に組問（2タブ）があれば組で出す（本番は表の初回以外すべて2タブ） */
  /* 最初の表は本番どおりタブの多い組（4タブを優先） */
  if(slot==='t'&&window.SETCORE){var tc=[];[4,5].forEach(function(l2){SETCORE.list(TBL[0],l2).forEach(function(t){if(t.tabs===4)tc.push({l:l2,t:t});});});var best=null;
    for(var n2=0;n2<12&&tc.length;n2++){var o=tc[Math.floor(Math.random()*tc.length)],m=SETCORE.make(TBL[0],o.t);if(m&&(!best||m.subs.length>best.m.subs.length))best={l:o.l,m:m};if(best&&best.m.subs.length>=4)break;}
    if(best){T.cur={f:TBL[0],l:best.l,it:best.m.subs[0]};startSet(TBL[0],best.l,best.m,'c');return;}}
  if(window.SETCORE&&SETCORE.list(T.cur.f,l).length){var cs=null,ts=SETCORE.list(T.cur.f,l).filter(function(t){return !t.tabs;});for(var n=0;n<6&&!cs&&ts.length;n++)cs=SETCORE.make(T.cur.f,ts[Math.floor(Math.random()*ts.length)]);
    if(cs){startSet(T.cur.f,l,cs,'c');return;}}
  T.cur.k='c';var cb0=X.isMulti(T.cur.it);T.scr.push({k:'c',cb:cb0});if(cb0)T.cb++;
  T.qt0=Date.now();T.sel=[];X.go('mockq');run();}
/* 小問ごとの形式：推論は 1つ選ぶ＝e・すべて選ぶ＝m、計算・表は c */
function subK(k,u){return k==='c'?'c':X.isMulti(u)?'m':'e';}
function startSet(f,l,cs,k){k=k||'c';T.cur={f:f,l:l,k:k,set:cs};T.qt0=Date.now();var cb=hasCb(cs);T.scr.push({k:k==='c'?'c':'i',cb:cb});if(cb)T.cb++;
  var lim=cs.subs.reduce(function(t,u){return t+limOf({k:subK(k,u),l:u.l||l,f:f});},0)*1000;
  X.setUse({level:l,lim:lim,silent:true,nodk:true,strict:function(){return true;},
    head:function(){return X.bar((T.n+1)+'問目')+'<div class="timer mock-all" role="img" aria-label="全体の残り時間"><i id="mall" style="width:'+Math.max(0,100-(Date.now()-T.t0)/TOTAL*100)+'%"></i></div>';},
    onGraded:function(all,sec,to){var z=X.setState();
      if(to&&Date.now()-T.t0>=TOTAL){finish();return;}
      cs.subs.forEach(function(u,i){var p=z.sa[i],ok=X.isRight(u,p),r=X.classify(ok,Math.round(sec/cs.subs.length),X.targetOf(u,u.l||l),to&&!ok),it={};for(var k2 in u)it[k2]=u[k2];it.q=cs.stem+'<br>'+u.q;
        T.ans.push({f:f,l:u.l||l,k:subK(k,u),it:it,pick:p,r:r,sec:Math.round(sec/cs.subs.length)});});
      T.th=estTheta();T.i+=cs.subs.length;T.n++;nextQ();}},cs);
  X.go('mockset');X.setStart();stop();
  tick=setInterval(function(){var v=X.state().view;if(v!=='mockset'){stop();return;}var g=document.getElementById('mall');if(g)g.style.width=Math.max(0,100-(Date.now()-T.t0)/TOTAL*100)+'%';
    if(Date.now()-T.t0>=TOTAL){X.stopTimer();finish();}},200);}
function stop(){if(tick){clearInterval(tick);tick=null;}}
function run(){stop();var lim=limOf(T.cur)*1000;
  tick=setInterval(function(){if(X.state().view!=='mockq'){stop();return;}
    var now=Date.now(),left=1-(now-T.qt0)/lim,b=document.getElementById('mbar'),g=document.getElementById('mall');
    if(b){b.style.width=Math.max(0,left*100)+'%';b.className=left>0.5?'':left>0.2?'warn':'end';}
    if(g)g.style.width=Math.max(0,100-(now-T.t0)/TOTAL*100)+'%';
    if(left<=0||now-T.t0>=TOTAL)answer(-1,true);},200);}
function answer(i,to){stop();
  /* 全体の時間切れで打ち切られた最後の1問は、答えていないので数えない */
  if(to&&Date.now()-T.t0>=TOTAL&&Date.now()-T.qt0<limOf(T.cur)*1000){finish();return;}
  var c=T.cur,ok=!to&&X.isRight(c.it,i),sec=Math.round((Date.now()-T.qt0)/1000),tg=X.targetOf(c.it,c.l),r=X.classify(ok,sec,tg,to);
  T.ans.push({f:c.f,l:c.l,k:c.k,it:c.it,pick:i,r:r,sec:sec});
  X.logAnswer({t:Date.now(),f:c.f,l:c.l,s:'mock',q:X.qid(c.it),r:r,sec:sec,tg:tg,pick:i,ai:'mock'});
  T.th=estTheta();
  T.i++;T.n++;nextQ();}
function okOf(x){return x.r==='fast'||x.r==='slow';}
function okRate(xs){return xs.length?xs.filter(okOf).length/xs.length:0;}
/* 回答数・推論の割合・cb は画面（組問1つ＝1問）で数える（受検者報告の数え方）。全体の時間切れで答えていない最後の画面は数えない */
function stats(){var s=T.scr.slice(0,T.n),n=s.length,inf=s.filter(function(x){return x.k==='i';}).length;
  return {n:n,inf:inf,r:n?inf/n:0,cb:s.filter(function(x){return x.cb;}).length};}
/* 推定は平均に引き寄せられて低めに出るので、+sh してから切り捨てる（仮想受検者1000人で、高めと低めのずれが同数になる値） */
/* 段階7は回答数（組問1つ＝1問）が12以上のときだけ（2026-11-20 ユーザー指示：段階7の問題を解けただけではダメ）。届かなければ6 */
function estimate(){if(!T.ans.length)return null;var e=clamp(Math.floor(T.th+P.sh),1,7);if(e===7&&stats().n<P.n7)e=6;return e;}
function finish(){stop();if(X.state().view==='mockset')X.stopTimer();var est=estimate(),ok=T.ans.filter(okOf).length;
  var st=stats();T.res={est:est,ok:ok,n:st.n,st:st};var rec={t:Date.now(),est:est,ok:ok,n:st.n,th:Math.round(T.th*100)/100},pb0=best(),h=hist();h.push(rec);saveHist(h);
  T.res.pb=est!=null&&better(rec,pb0);if(T.res.pb){try{localStorage.setItem(BKEY,JSON.stringify(rec));}catch(e){}}
  T.open=-1;X.go('mockres');}

/* ===== 画面 ===== */
function d2(n){return (n<10?'0':'')+n;}
function fmt(t){var d=new Date(t);return (d.getMonth()+1)+'/'+d.getDate()+' '+d.getHours()+':'+d2(d.getMinutes());}
var GUIDE=[
 {h:'時間',p:'全体23分。時間が終わるまで解き続ける（問題数は決まっていない）。<br>上のバーが全体の残り時間、下のバーがその問題の残り時間。青 → 黄 → 赤と変わり、0になると次の問題へ進む。'},
 {h:'使っていいもの',p:'紙とペン（本番は会場で配られるメモ用紙と筆記用具）。<br>電卓・スマホの計算機は使わない。本番は電卓が使えない。'},
 {h:'進め方',p:'選択肢を選ぶと次の問題へ進む。前の問題には戻れない。<br>「すべて選ぶ」問題は、当てはまるものを全部選んでから「決定」を押す。全部合っていないと正解にならない。<br>解説は終わってから見られる。'},
 {h:'環境と注意',p:'静かな場所で、23分続けて時間をとる。スマホの通知は切っておく。<br>途中で戻ったりアプリを閉じたりすると、そのテストは記録されない。'}
];
function viewTop(){var h=X.bar('模擬テスト'),hs=hist().slice(-5).reverse();
  var b=best();if(b)h+='<div class="tbl-wrap mock-best"><table class="tbl"><tr><th>自己ベスト</th><th>推定段階</th><th>正解</th></tr><tr><td>'+fmt(b.t)+'</td><td>'+b.est+'</td><td>'+b.ok+' / '+b.n+'</td></tr></table></div>';
  GUIDE.forEach(function(g){h+='<section class="lesson"><h2>'+g.h+'</h2><div class="lp">'+g.p+'</div></section>';});
  h+='<button class="next" data-act="mockstart">開始</button>';
  if(hs.length){h+='<div class="tbl-wrap mock-hist"><table class="tbl"><tr><th>日時</th><th>推定段階</th><th>正解</th></tr>';
    hs.forEach(function(x){h+='<tr><td>'+fmt(x.t)+'</td><td>'+(x.est==null?'-':x.est)+'</td><td>'+x.ok+' / '+x.n+'</td></tr>';});h+='</table></div>';}
  return h;}
function viewQ(){var c=T.cur,h=X.bar((T.n+1)+'問目');
  h+='<div class="timer mock-all" role="img" aria-label="全体の残り時間"><i id="mall" style="width:'+Math.max(0,100-(Date.now()-T.t0)/TOTAL*100)+'%"></i></div><div class="timer" role="img" aria-label="制限時間"><i id="mbar"'+X.barAttr(T.qt0,limOf(c)*1000)+'></i></div>';
  h+='<div class="q">'+c.it.q+'</div>'+X.choicesHtml(c.it,null,T.sel,'mockpick','mocksubmit');
  return h;}
function viewRes(){var r=T.res,h=X.bar('模擬テスト');
  h+='<div class="mock-est"><div class="mock-est-l">推定段階</div><div class="mock-est-n">'+(r.est==null?'-':r.est)+'</div><div class="mock-est-l">'+r.ok+' / '+r.n+'</div>'+(r.pb?'<div class="mock-pb">自己ベスト</div>':'')+'</div>'+
    '<div class="tbl-wrap"><table class="tbl"><tr><th>回答数</th><td>'+r.st.n+'</td></tr><tr><th>推論の割合</th><td>'+Math.round(r.st.r*100)+'%</td></tr><tr><th>すべて選ぶ</th><td>'+r.st.cb+'回</td></tr></table></div>';
  var by={};T.ans.forEach(function(x){var b=by[x.f]||(by[x.f]={n:0,ok:0});b.n++;if(x.r==='fast'||x.r==='slow')b.ok++;});
  h+='<div class="tbl-wrap"><table class="tbl"><tr><th>分野</th><th>正解</th></tr>';
  Object.keys(by).forEach(function(f){h+='<tr><th>'+f+'</th><td>'+by[f].ok+' / '+by[f].n+'</td></tr>';});h+='</table></div><div class="choices">';
  T.ans.forEach(function(x,i){var ok=x.r==='fast'||x.r==='slow';
    h+='<button class="item compact mock-row" data-act="mockopen" data-i="'+i+'"><span class="num'+(ok?' ok':' ng')+'">'+(i+1)+'</span><span class="name">'+x.f+'・指標'+x.l+'</span><span class="sec">'+(x.r==='timeout'?'時間切れ':x.sec+'秒')+'</span></button>';
    if(T.open===i){var it=x.it;
      h+='<div class="result"><div class="q">'+it.q+'</div>'+(X.pickText(it,x.pick)?'<div class="calc"><b>選んだ答え</b>　'+X.pickText(it,x.pick)+'</div>':'')+
        '<div class="calc"><b>'+X.inwHead(it,x.f)+'</b>　'+X.inwText(it,x.f)+'</div>'+(it.fig?X.figHtml(it.fig):'')+'<div class="calc">'+(it.calc||'')+'</div><div class="calc"><b>答え</b>　'+(X.isMulti(it)?X.ansText(it):'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[it.a]+'　'+it.c[it.a])+'</div></div>';}});
  return h+'</div><button class="next" data-act="mocktop">もどる</button>';}
X.mockT=function(){return T;};X.mockB=bInf;X.mockAns=function(i,to){answer(i,to);};X.mockLim=function(){return limOf(T.cur);};
X.views.mock=viewTop;X.views.mockq=viewQ;X.views.mockres=viewRes;
X.acts.mock=function(){X.go('mock');};
X.acts.mockstart=function(){start();};
X.acts.mockpick=function(b){var i=+b.dataset.i;if(X.isMulti(T.cur.it)){X.toggleSel(T.sel,i);X.render();}else answer(i,false);};
X.acts.mocksubmit=function(){answer(T.sel.slice(),false);};
X.acts.mockopen=function(b){var i=+b.dataset.i;T.open=T.open===i?-1:i;X.render();};
X.acts.mocktop=function(){X.go('mock');};
})();
