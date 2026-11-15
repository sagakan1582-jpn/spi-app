/* まいにちSPI 模擬テスト
   設計：全体設計書「模擬テスト」の章。
   - 全体23分（回答数は人によって違う）。1問ごとに本番と同じタイマー（青→黄→赤、0で次へ）。戻れない。解説は終わってから。
   - 計算と推論を1本のはしごで上下する（IRTをまねた簡易版。詳しくは下）。
   - 問題は 実践（単純な数値）と実践（実際の数値）を共用する。 */
(function(){
var X=window.SPI, MKEY='mainichi-spi-mock-v1', TOTAL=23*60*1000, T=null, tick=null;
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
   - 次の問題は θ に合わせる：計算は θ を四捨五入した指標3〜5。推論は θ≥gc で「すべて選ぶ」（θ≥g7 なら指標7）、それ以外は1つ選ぶ推論（θ≥g7 なら指標7）。
     「すべて選ぶ」のあとは推論 cd 問（θ≥g7 なら cd7 問）を1つ選ぶ形式にする（cbは毎回ではなく、ときどき出る）。
   - 全体23分、時間切れまで。1問目は表の読み取り（指標4）。以降は 推論→計算→計算→推論→計算→計算→推論→計算→推論→計算 をくり返し、
     θ≥5.5 のときは推論が続く（受検記録：高得点者は前半2〜3問の計算のあと推論ばかり）。推論は正誤に関係なく必ず出る。
   - 1問の制限時間（本番の推定）：計算 指標3・4は90秒、指標5と表は120秒、1つ選ぶ推論120秒、すべて選ぶ180秒。
   - 推定段階＝最後の θ の整数部分（1〜7）。「すべて選ぶ」の回数は判定には使わない。結果として受検者報告の目安
     （7＝cb×3以上／6・5＝cb×2／4＝cb×1／3＝なし）に合うよう gc・g7 を仮想受検者で調整した（app-tools/sim_population.js）。 */
var P=window.MOCK_P||{gc:5.0,g7:6.3,slow:0.7,cd:3,cd7:2},SL=1.7,PAT=['i','c','c','i','c','c','i','c','i','c'],TBL=['表の解釈','情報の読み取り'];
function start(){T={th:4,cd:0,i:0,ans:[],used:[],t0:Date.now(),fi:{},cb:0};nextQ();}
function limOf(c){return c.k==='m'?180:c.k==='e'?120:(c.l>=5||TBL.indexOf(c.f)>=0)?120:90;}
function bOf(x){return x.k==='m'?(x.l===7?7:6.3):x.k==='e'?(x.l===7?6.3:5.5):x.l;}
function estTheta(){var num=0,den=0;
  for(var t=0;t<=8.5;t+=0.05){var w=Math.exp(-Math.pow(t-4.5,2)/(2*1.25*1.25));
    T.ans.forEach(function(x){var b=bOf(x)-(x.r==='slow'?P.slow:0),p=1/(1+Math.exp(-SL*(t-b)));w*=okOf(x)?p:1-p;});
    num+=w*t;den+=w;}
  return den?num/den:4;}
function clamp(x,lo,hi){return Math.max(lo,Math.min(hi,x));}
function pickItem(l,want,only){var fs=fields(l).filter(function(f){return !only||only.indexOf(f)>=0;});if(!fs.length)fs=fields(l);var k=T.fi[l]||0,tries=0;
  while(tries<fs.length*2){var f=fs[k%fs.length];k++;tries++;
    var p=X.shuffle([].concat((BANK[f][l].real||[]),(BANK[f][l].applied||[])).filter(function(x){return T.used.indexOf(x)<0;}));
    var keep=null;
    for(var j=0;j<p.length&&j<40;j++){var x=X.inst(p[j]);if(!x)continue;
      if(want==null||X.isMulti(x)===want){T.fi[l]=k;T.used.push(p[j]);return {f:f,l:l,it:x};}
      if(!keep)keep={src:p[j],it:x};}
    if(keep){T.fi[l]=k;T.used.push(keep.src);return {f:f,l:l,it:keep.it};}}
  return null;}
function nextQ(){if(T.i>=60||Date.now()-T.t0>=TOTAL){finish();return;}
  var l,w=null,k,only=null,slot=T.i===0?'t':(!fields(6).length?'c':T.th>=5.5&&T.i>=3?'i':PAT[(T.i-1)%PAT.length]);
  if(slot!=='i'){k='c';l=clamp(Math.round(T.th),3,5);while(l>3&&!fields(l).length)l--;if(slot==='t'){only=TBL;l=4;}}
  else if(T.th>=P.gc&&T.cd<=0){k='m';w=true;l=T.th>=P.g7&&fields(7).length?7:6;T.cd=T.th>=P.g7?P.cd7:P.cd;}
  else{k='e';w=false;l=T.th>=P.g7&&fields(7).length?7:6;T.cd--;}
  T.cur=pickItem(l,w,only);if(!T.cur){finish();return;}
  T.cur.k=X.isMulti(T.cur.it)?'m':(k==='m'?'e':k);if(T.cur.k==='m')T.cb++;
  T.qt0=Date.now();T.sel=[];X.go('mockq');run();}
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
  T.i++;nextQ();}
function okOf(x){return x.r==='fast'||x.r==='slow';}
function okRate(xs){return xs.length?xs.filter(okOf).length/xs.length:0;}
function stats(){var n=T.ans.length,inf=T.ans.filter(function(x){return x.k!=='c';}).length;
  return {n:n,inf:inf,r:n?inf/n:0,cb:T.ans.filter(function(x){return x.k==='m';}).length,c7:T.ans.filter(function(x){return x.k==='m'&&x.l===7;}).length};}
function estimate(){if(!T.ans.length)return null;return clamp(Math.floor(T.th),1,7);}
function finish(){stop();var est=estimate(),ok=T.ans.filter(okOf).length;
  var st=stats();T.res={est:est,ok:ok,n:st.n,st:st};var h=hist();h.push({t:Date.now(),est:est,ok:ok,n:st.n});saveHist(h);
  T.open=-1;X.go('mockres');}

/* ===== 画面 ===== */
function d2(n){return (n<10?'0':'')+n;}
function fmt(t){var d=new Date(t);return (d.getMonth()+1)+'/'+d.getDate()+' '+d.getHours()+':'+d2(d.getMinutes());}
function viewTop(){var h=X.bar('模擬テスト')+'<button class="next" data-act="mockstart">開始</button>',hs=hist().slice(-5).reverse();
  if(hs.length){h+='<div class="tbl-wrap mock-hist"><table class="tbl"><tr><th>日時</th><th>推定段階</th><th>正解</th></tr>';
    hs.forEach(function(x){h+='<tr><td>'+fmt(x.t)+'</td><td>'+(x.est==null?'-':x.est)+'</td><td>'+x.ok+' / '+x.n+'</td></tr>';});h+='</table></div>';}
  return h;}
function viewQ(){var c=T.cur,h=X.bar((T.i+1)+'問目');
  h+='<div class="timer mock-all" role="img" aria-label="全体の残り時間"><i id="mall"></i></div><div class="timer" role="img" aria-label="制限時間"><i id="mbar"></i></div>';
  h+='<div class="q">'+c.it.q+'</div>'+X.choicesHtml(c.it,null,T.sel,'mockpick','mocksubmit');
  return h;}
function viewRes(){var r=T.res,h=X.bar('模擬テスト');
  h+='<div class="mock-est"><div class="mock-est-l">推定段階</div><div class="mock-est-n">'+(r.est==null?'-':r.est)+'</div><div class="mock-est-l">'+r.ok+' / '+r.n+'</div></div>'+
    '<div class="tbl-wrap"><table class="tbl"><tr><th>回答数</th><td>'+r.st.n+'</td></tr><tr><th>推論の割合</th><td>'+Math.round(r.st.r*100)+'%</td></tr><tr><th>すべて選ぶ</th><td>'+r.st.cb+'回</td></tr></table></div>';
  var by={};T.ans.forEach(function(x){var b=by[x.f]||(by[x.f]={n:0,ok:0});b.n++;if(x.r==='fast'||x.r==='slow')b.ok++;});
  h+='<div class="tbl-wrap"><table class="tbl"><tr><th>分野</th><th>正解</th></tr>';
  Object.keys(by).forEach(function(f){h+='<tr><th>'+f+'</th><td>'+by[f].ok+' / '+by[f].n+'</td></tr>';});h+='</table></div><div class="choices">';
  T.ans.forEach(function(x,i){var ok=x.r==='fast'||x.r==='slow';
    h+='<button class="item compact mock-row" data-act="mockopen" data-i="'+i+'"><span class="num'+(ok?' ok':' ng')+'">'+(i+1)+'</span><span class="name">'+x.f+'・指標'+x.l+'</span><span class="sec">'+(x.r==='timeout'?'時間切れ':x.sec+'秒')+'</span></button>';
    if(T.open===i){var it=x.it;
      h+='<div class="result"><div class="q">'+it.q+'</div>'+(X.pickText(it,x.pick)?'<div class="calc"><b>選んだ答え</b>　'+X.pickText(it,x.pick)+'</div>':'')+
        '<div class="calc"><b>'+X.inwHead(it,x.f)+'</b>　'+X.inwText(it,x.f)+'</div>'+(it.fig?X.figHtml(it.fig):'')+'<div class="calc">'+(it.calc||'')+'</div><div class="calc"><b>答え</b>　'+(X.isMulti(it)?X.ansText(it):'ABCDE'[it.a]+'　'+it.c[it.a])+'</div></div>';}});
  return h+'</div><button class="next" data-act="mocktop">もどる</button>';}
X.mockT=function(){return T;};X.mockAns=function(i,to){answer(i,to);};X.mockLim=function(){return limOf(T.cur);};
X.views.mock=viewTop;X.views.mockq=viewQ;X.views.mockres=viewRes;
X.acts.mock=function(){X.go('mock');};
X.acts.mockstart=function(){start();};
X.acts.mockpick=function(b){var i=+b.dataset.i;if(X.isMulti(T.cur.it)){X.toggleSel(T.sel,i);X.render();}else answer(i,false);};
X.acts.mocksubmit=function(){answer(T.sel.slice(),false);};
X.acts.mockopen=function(b){var i=+b.dataset.i;T.open=T.open===i?-1:i;X.render();};
X.acts.mocktop=function(){X.go('mock');};
})();
