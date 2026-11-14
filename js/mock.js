/* まいにちSPI 模擬テスト
   設計：全体設計書「模擬テスト」の章。
   - 20問・全体23分。1問ごとに本番と同じタイマー（青→黄→赤、0で次へ）。戻れない。解説は終わってから。
   - 指標4から始め、2問続けて時間内に正解で1つ上、2問続けて間違えで1つ下（IRTをまねた簡易版）。
   - 推定の段階：最後の10問で出た指標の平均。いちばん上の指標で8割以上なら+1（それより上は測れないため）。
   - 問題は 実践（単純な数値）と実践（実際の数値）を共用する。 */
(function(){
var X=window.SPI, MKEY='mainichi-spi-mock-v1', N=20, TOTAL=23*60*1000, T=null, tick=null;
function hist(){try{return JSON.parse(localStorage.getItem(MKEY)||'[]')||[];}catch(e){return [];}}
function saveHist(h){try{localStorage.setItem(MKEY,JSON.stringify(h.slice(-30)));}catch(e){}}
function fields(l){return (CURRICULUM[l]||[]).filter(function(f){return BANK[f]&&BANK[f][l];});}
function levels(){return LEVELS.filter(function(l){return fields(l).length;});}

/* 計算（指標5まで）を先に、推論（指標6・7）があれば後半に出す（本番の流れ：計算8〜10問のあと推論） */
var NC=10;
function start(){var all=levels(),comp=all.filter(function(l){return l<=5;}),inf=all.filter(function(l){return l>=6;});
  if(!comp.length){comp=inf;inf=[];}
  var l0=comp.indexOf(4)>=0?4:comp[0];
  T={ls:comp,inf:inf,comp:comp,li:comp.indexOf(l0),up:0,dn:0,i:0,ans:[],used:[],t0:Date.now(),fi:{}};nextQ();}
function pickItem(l){var fs=fields(l),k=T.fi[l]||0,tries=0;
  while(tries<fs.length*2){var f=fs[k%fs.length];k++;tries++;
    var p=[].concat((BANK[f][l].real||[]),(BANK[f][l].applied||[])).filter(function(x){return T.used.indexOf(x)<0;});
    if(p.length){T.fi[l]=k;var it=p[Math.floor(Math.random()*p.length)];T.used.push(it);return {f:f,l:l,it:it};}}
  return null;}
function nextQ(){if(T.i>=N||Date.now()-T.t0>=TOTAL){finish();return;}
  if(T.inf.length&&T.i===NC&&T.ls!==T.inf){T.ls=T.inf;T.li=0;T.up=0;T.dn=0;}
  var l=T.ls[T.li];T.cur=pickItem(l);if(!T.cur){finish();return;}
  T.qt0=Date.now();T.sel=[];X.go('mockq');run();}
function stop(){if(tick){clearInterval(tick);tick=null;}}
function run(){stop();var lim=X.targetOf(T.cur.it,T.cur.l)*1000;
  tick=setInterval(function(){if(X.state().view!=='mockq'){stop();return;}
    var now=Date.now(),left=1-(now-T.qt0)/lim,b=document.getElementById('mbar'),g=document.getElementById('mall');
    if(b){b.style.width=Math.max(0,left*100)+'%';b.className=left>0.5?'':left>0.2?'warn':'end';}
    if(g)g.style.width=Math.max(0,100-(now-T.t0)/TOTAL*100)+'%';
    if(left<=0||now-T.t0>=TOTAL)answer(-1,true);},200);}
function answer(i,to){stop();var c=T.cur,ok=!to&&X.isRight(c.it,i),sec=Math.round((Date.now()-T.qt0)/1000),tg=X.targetOf(c.it,c.l),r=X.classify(ok,sec,tg,to);
  T.ans.push({f:c.f,l:c.l,it:c.it,pick:i,r:r,sec:sec});
  X.logAnswer({t:Date.now(),f:c.f,l:c.l,s:'mock',q:X.qid(c.it),r:r,sec:sec,tg:tg,pick:i,ai:'mock'});
  if(ok){T.up++;T.dn=0;if(T.up>=2&&T.li<T.ls.length-1){T.li++;T.up=0;}}
  else{T.dn++;T.up=0;if(T.dn>=2&&T.li>0){T.li--;T.dn=0;}}
  T.i++;nextQ();}
function okRate(xs){return xs.length?xs.filter(function(x){return x.r==='fast'||x.r==='slow';}).length/xs.length:0;}
function estimate(){var all=T.ans,a=all.filter(function(x){return T.comp.indexOf(x.l)>=0;});if(!a.length)return null;var last=a.slice(-10),avg=0;
  last.forEach(function(x){avg+=x.l;});avg/=last.length;var est=Math.round(avg);
  var top=T.comp[T.comp.length-1],atTop=a.filter(function(x){return x.l===top;});
  var okTop=atTop.filter(function(x){return x.r==='fast'||x.r==='slow';}).length;
  if(atTop.length>=5&&okTop/atTop.length>=0.8)est=top+1;
  var okAll=a.filter(function(x){return x.r==='fast'||x.r==='slow';}).length;
  if(okAll/a.length<0.4)est--;
  /* 推論：計算で5以上のとき、指標6の推論が6割以上で6、さらに指標7を3問以上解き6割以上で7 */
  var i6=all.filter(function(x){return x.l===6;}),i7=all.filter(function(x){return x.l===7;});
  if(est>=5&&i6.length&&okRate(i6)>=0.6){est=6;if(i7.length>=3&&okRate(i7)>=0.6)est=7;}
  else if(est>5&&T.inf.length)est=5;
  return Math.max(2,Math.min(7,est));}
function finish(){stop();var est=estimate(),ok=T.ans.filter(function(x){return x.r==='fast'||x.r==='slow';}).length;
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
X.views.mock=viewTop;X.views.mockq=viewQ;X.views.mockres=viewRes;
X.acts.mock=function(){X.go('mock');};
X.acts.mockstart=function(){start();};
X.acts.mockpick=function(b){var i=+b.dataset.i;if(X.isMulti(T.cur.it)){X.toggleSel(T.sel,i);X.render();}else answer(i,false);};
X.acts.mocksubmit=function(){answer(T.sel.slice(),false);};
X.acts.mockopen=function(b){var i=+b.dataset.i;T.open=T.open===i?-1:i;X.render();};
X.acts.mocktop=function(){X.go('mock');};
})();
