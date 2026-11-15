/* まいにちSPI 模擬テスト
   設計：全体設計書「模擬テスト」の章。
   - 20問・全体23分。1問ごとに本番と同じタイマー（青→黄→赤、0で次へ）。戻れない。解説は終わってから。
   - 計算と推論を1本のはしごで上下する（IRTをまねた簡易版。詳しくは下）。
   - 問題は 実践（単純な数値）と実践（実際の数値）を共用する。 */
(function(){
var X=window.SPI, MKEY='mainichi-spi-mock-v1', N=20, TOTAL=23*60*1000, T=null, tick=null;
function hist(){try{return JSON.parse(localStorage.getItem(MKEY)||'[]')||[];}catch(e){return [];}}
function saveHist(h){try{localStorage.setItem(MKEY,JSON.stringify(h.slice(-30)));}catch(e){}}
function fields(l){return (CURRICULUM[l]||[]).filter(function(f){return BANK[f]&&BANK[f][l];});}
function levels(){return LEVELS.filter(function(l){return fields(l).length;});}

/* 本番（テストセンター）の流れをまねた1本のはしご：計算3 → 計算4 → 計算5 → 易しい推論（指標6・1つ選ぶ）→ すべて選ぶ推論（指標6）→ すべて選ぶ推論（指標7）。
   - 計算4から始める。2問続けて時間内に正解で1つ上、2問続けて間違い・時間切れで1つ下（推論から計算へも戻る）。
   - 計算から推論へ上がれるのは8問目以降（本番の高得点者は計算8〜10問のあと推論へ進む）。
   - 易しい推論は4問以上解いてから上へ（本番は易しい推論4問 → すべて選ぶ）。
   - 推定の段階：すべて選ぶ推論の正解4問以上で6、さらに指標7で3問以上・6割以上で7。それ以外は計算の結果（最大5）。 */
var MINC=8,MINE=4;
function start(){var steps=[];
  [3,4,5].forEach(function(l){if(fields(l).length)steps.push({l:l,w:null,k:'c'});});
  if(fields(6).length){steps.push({l:6,w:false,k:'e'});steps.push({l:6,w:true,k:'m'});}
  if(fields(7).length)steps.push({l:7,w:true,k:'m'});
  var i0=0;steps.forEach(function(x,i){if(x.l===4&&x.k==='c')i0=i;});
  T={steps:steps,li:i0,up:0,dn:0,dwell:0,i:0,ans:[],used:[],t0:Date.now(),fi:{}};nextQ();}
function pickItem(l,want){var fs=fields(l),k=T.fi[l]||0,tries=0;
  while(tries<fs.length*2){var f=fs[k%fs.length];k++;tries++;
    var p=X.shuffle([].concat((BANK[f][l].real||[]),(BANK[f][l].applied||[])).filter(function(x){return T.used.indexOf(x)<0;}));
    var keep=null;
    for(var j=0;j<p.length&&j<40;j++){var x=X.inst(p[j]);if(!x)continue;
      if(want==null||X.isMulti(x)===want){T.fi[l]=k;T.used.push(p[j]);return {f:f,l:l,it:x};}
      if(!keep)keep={src:p[j],it:x};}
    if(keep){T.fi[l]=k;T.used.push(keep.src);return {f:f,l:l,it:keep.it};}}
  return null;}
function nextQ(){if(T.i>=N||Date.now()-T.t0>=TOTAL){finish();return;}
  var st=T.steps[T.li];T.cur=pickItem(st.l,st.w);if(!T.cur){finish();return;}
  T.cur.k=st.k;T.qt0=Date.now();T.sel=[];X.go('mockq');run();}
function stop(){if(tick){clearInterval(tick);tick=null;}}
function run(){stop();var lim=X.targetOf(T.cur.it,T.cur.l)*1000;
  tick=setInterval(function(){if(X.state().view!=='mockq'){stop();return;}
    var now=Date.now(),left=1-(now-T.qt0)/lim,b=document.getElementById('mbar'),g=document.getElementById('mall');
    if(b){b.style.width=Math.max(0,left*100)+'%';b.className=left>0.5?'':left>0.2?'warn':'end';}
    if(g)g.style.width=Math.max(0,100-(now-T.t0)/TOTAL*100)+'%';
    if(left<=0||now-T.t0>=TOTAL)answer(-1,true);},200);}
function canUp(){var st=T.steps[T.li],nx=T.steps[T.li+1];if(!nx)return false;
  if(st.k==='c'&&nx.k!=='c'&&T.i+1<MINC)return false;
  if(st.k==='e'&&T.dwell<MINE)return false;return true;}
function answer(i,to){stop();var c=T.cur,ok=!to&&X.isRight(c.it,i),sec=Math.round((Date.now()-T.qt0)/1000),tg=X.targetOf(c.it,c.l),r=X.classify(ok,sec,tg,to);
  T.ans.push({f:c.f,l:c.l,k:c.k,it:c.it,pick:i,r:r,sec:sec});
  X.logAnswer({t:Date.now(),f:c.f,l:c.l,s:'mock',q:X.qid(c.it),r:r,sec:sec,tg:tg,pick:i,ai:'mock'});
  T.dwell++;
  if(ok){T.up++;T.dn=0;if(T.up>=2&&canUp()){T.li++;T.up=0;T.dwell=0;}}
  else{T.dn++;T.up=0;if(T.dn>=2&&T.li>0){T.li--;T.dn=0;T.dwell=0;}}
  T.i++;nextQ();}
function okOf(x){return x.r==='fast'||x.r==='slow';}
function okRate(xs){return xs.length?xs.filter(okOf).length/xs.length:0;}
function estimate(){var all=T.ans;if(!all.length)return null;
  var a=all.filter(function(x){return x.k==='c';}),est;
  if(a.length){var last=a.slice(-8),avg=0;last.forEach(function(x){avg+=x.l;});est=Math.round(avg/last.length);if(okRate(last)<0.4)est--;}
  else est=4;
  var e=all.filter(function(x){return x.k==='e';}),m=all.filter(function(x){return x.k==='m';}),m7=m.filter(function(x){return x.l===7;});
  if(e.length>=MINE&&okRate(e)>=0.6)est=Math.max(est,5);
  if(m.filter(okOf).length>=4){est=6;if(m7.length>=3&&okRate(m7)>=0.6)est=7;}
  return Math.max(2,Math.min(est>5&&m.filter(okOf).length<4?5:est,7));}
function finish(){stop();var est=estimate(),ok=T.ans.filter(okOf).length;
  T.res={est:est,ok:ok,n:T.ans.length};var h=hist();h.push({t:Date.now(),est:est,ok:ok,n:T.ans.length});saveHist(h);
  T.open=-1;X.go('mockres');}

/* ===== 画面 ===== */
function d2(n){return (n<10?'0':'')+n;}
function fmt(t){var d=new Date(t);return (d.getMonth()+1)+'/'+d.getDate()+' '+d.getHours()+':'+d2(d.getMinutes());}
function viewTop(){var h=X.bar('模擬テスト')+'<button class="next" data-act="mockstart">開始</button>',hs=hist().slice(-5).reverse();
  if(hs.length){h+='<div class="tbl-wrap mock-hist"><table class="tbl"><tr><th>日時</th><th>推定段階</th><th>正解</th></tr>';
    hs.forEach(function(x){h+='<tr><td>'+fmt(x.t)+'</td><td>'+(x.est==null?'-':x.est)+'</td><td>'+x.ok+' / '+x.n+'</td></tr>';});h+='</table></div>';}
  return h;}
function viewQ(){var c=T.cur,h=X.bar((T.i+1)+' / '+N);
  h+='<div class="timer mock-all" role="img" aria-label="全体の残り時間"><i id="mall"></i></div><div class="timer" role="img" aria-label="制限時間"><i id="mbar"></i></div>';
  h+='<div class="q">'+c.it.q+'</div>'+X.choicesHtml(c.it,null,T.sel,'mockpick','mocksubmit');
  return h;}
function viewRes(){var r=T.res,h=X.bar('模擬テスト');
  h+='<div class="mock-est"><div class="mock-est-l">推定段階</div><div class="mock-est-n">'+(r.est==null?'-':r.est)+'</div><div class="mock-est-l">'+r.ok+' / '+r.n+'</div></div>';
  var by={};T.ans.forEach(function(x){var b=by[x.f]||(by[x.f]={n:0,ok:0});b.n++;if(x.r==='fast'||x.r==='slow')b.ok++;});
  h+='<div class="tbl-wrap"><table class="tbl"><tr><th>分野</th><th>正解</th></tr>';
  Object.keys(by).forEach(function(f){h+='<tr><th>'+f+'</th><td>'+by[f].ok+' / '+by[f].n+'</td></tr>';});h+='</table></div><div class="choices">';
  T.ans.forEach(function(x,i){var ok=x.r==='fast'||x.r==='slow';
    h+='<button class="item compact mock-row" data-act="mockopen" data-i="'+i+'"><span class="num'+(ok?' ok':' ng')+'">'+(i+1)+'</span><span class="name">'+x.f+'・指標'+x.l+'</span><span class="sec">'+(x.r==='timeout'?'時間切れ':x.sec+'秒')+'</span></button>';
    if(T.open===i){var it=x.it;
      h+='<div class="result"><div class="q">'+it.q+'</div>'+(X.pickText(it,x.pick)?'<div class="calc"><b>選んだ答え</b>　'+X.pickText(it,x.pick)+'</div>':'')+
        '<div class="calc"><b>'+X.inwHead(it,x.f)+'</b>　'+X.inwText(it,x.f)+'</div>'+(it.fig?X.figHtml(it.fig):'')+'<div class="calc">'+(it.calc||'')+'</div><div class="calc"><b>答え</b>　'+(X.isMulti(it)?X.ansText(it):'ABCDE'[it.a]+'　'+it.c[it.a])+'</div></div>';}});
  return h+'</div><button class="next" data-act="mocktop">もどる</button>';}
X.mockT=function(){return T;};
X.views.mock=viewTop;X.views.mockq=viewQ;X.views.mockres=viewRes;
X.acts.mock=function(){X.go('mock');};
X.acts.mockstart=function(){start();};
X.acts.mockpick=function(b){var i=+b.dataset.i;if(X.isMulti(T.cur.it)){X.toggleSel(T.sel,i);X.render();}else answer(i,false);};
X.acts.mocksubmit=function(){answer(T.sel.slice(),false);};
X.acts.mockopen=function(b){var i=+b.dataset.i;T.open=T.open===i?-1:i;X.render();};
X.acts.mocktop=function(){X.go('mock');};
})();
