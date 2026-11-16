/* まいにちSPI 型チェック（AIモードで実践の問題を間違えたあとに出す3ステップの小問）
   2026-11-16 ユーザー指示：選択肢に他の分野・他の問題の内訳や図を混ぜると、日本語や数字を見るだけで選べてしまう。
   誤答は「同じ問題・同じ言葉・同じ数字」のまま型だけを崩して作る。
   - 内訳：問題に出てくる言葉（全体・内訳の名前）を2つ入れ替える（何を何に分けるか、どれをさらに分けるかが変わる）
   - 図・表：図の中の数字・割合・?・名前を2か所入れ替える（数字の位置がずれる）
   - 計算：式の × と ÷（＋ と −）を入れ替える、または問題文の別の数字を入れて、その後の計算をやり直す */
window.KATA=(function(){
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function uniq(a){var o=[];a.forEach(function(x){if(x!=null&&x!==''&&o.indexOf(x)<0)o.push(x);});return o;}
function esc(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
var SKIP=['その他','他','計','全体','合計',''];

/* ===== 内訳 ===== */
function nounsOf(text,fig,f){var n=[];
  var m=f==='推論'?null:text.match(/^([^を「、。（]{1,12})を/);if(m&&m[1]!=='合計')n.push(m[1]);
  (text.match(/「[^」]+」/g)||[]).forEach(function(g){g.slice(1,-1).split('・').forEach(function(x){n.push(x);});});
  figNames(fig).forEach(function(x){n.push(x);});
  if(f==='推論')(text.match(/[A-Z]/g)||[]).forEach(function(x){n.push(x);});
  n=uniq(n).filter(function(x){return (SKIP.indexOf(x)<0||(m&&x===m[1]))&&text.indexOf(x)>=0&&!/^[\d.]+/.test(x);});
  /* 「豚肉」と「豚肉300g」のように重なる言葉は長いほうだけ使う */
  return n.filter(function(x){return !n.some(function(y){return y!==x&&y.indexOf(x)>=0;});});}
function figNames(fig){var o=[];if(!fig)return o;
  if(fig.whole&&fig.whole.n)o.push(fig.whole.n);
  (fig.parts||[]).forEach(function(p){if(p.n)o.push(p.n);});
  (fig.rows||[]).forEach(function(r){r.forEach(function(c){if(c&&c.n)o.push(c.n);});});
  return o;}
function swapWords(text,a,b){if(a.indexOf(b)>=0||b.indexOf(a)>=0)return null;
  var re=new RegExp(esc(a.length>=b.length?a:b)+'|'+esc(a.length>=b.length?b:a),'g');
  return text.replace(re,function(x){return x===a?b:a;});}
function inwText(it,f){if(it.inw)return it.inw;var g=it.fig;
  if(g&&g.parts){var ns=g.parts.filter(function(p){return p.n;}).map(function(p){return p.n;});
    if(ns.length)return ((g.whole&&g.whole.n)||'全体')+'を「'+ns.join('・')+'」に分ける';}
  return '';}
/* 「…」の並び順が変わっただけ（意味が同じ）のものは誤答にしない */
function sameGroups(a,b){function k(t){var g=[];var o=t.replace(/「([^」]+)」/g,function(x,y){g.push(y.split('・').sort().join('・'));return '「」';});return o+'|'+g.sort().join('|');}return k(a)===k(b);}
function inwStep(it,f){var t=inwText(it,f);if(!t)return null;var ns=nounsOf(t,it.fig,f),c=[];
  for(var i=0;i<ns.length;i++)for(var j=i+1;j<ns.length;j++){var s=swapWords(t,ns[i],ns[j]);if(s&&s!==t&&!sameGroups(s,t))c.push(s);}
  return mk(0,t,c);}

/* ===== 図・表 ===== */
function kind(v){v=String(v).replace(/^!/,'');if(/^[A-Z]$/.test(v))return 'L';if(/^[+−\-]?[\d.,\/]+(人|円|個|枚|通り|本|回|%)?$/.test(v))return 'n';if(/\d+[CP]\d+/.test(v))return 'f';return 't';}
function figStep(it){var g=it.fig;if(!g)return null;var base=JSON.stringify(g),c=[];
  var cells=[];/* 入れ替えの候補：[参照, キー] */
  if(g.table){g.table.rows.forEach(function(r,ri){r.forEach(function(x,ci){if(ci>0&&x!==''&&!/^計$/.test(r[0]+''))cells.push(['t',ri,ci]);});});}
  else{var list=[];if(g.whole)list.push(['w']);(g.parts||[]).forEach(function(p,i){list.push(['p',i]);});
    (g.rows||[]).forEach(function(r,ri){r.forEach(function(x,ci){if(x&&(x.n||x.v||x.r))list.push(['r',ri,ci]);});});
    list.forEach(function(L){['v','r','n'].forEach(function(k){cells.push(L.concat([k]));});});}
  function get(o,L){if(L[0]==='t')return o.table.rows[L[1]][L[2]];var n=L[0]==='w'?o.whole:L[0]==='p'?o.parts[L[1]]:o.rows[L[1]][L[2]];return n;}
  for(var i=0;i<cells.length;i++)for(var j=i+1;j<cells.length;j++){var A=cells[i],B=cells[j];
    if(A[0]!=='t'&&A[A.length-1]!==B[B.length-1])continue;/* 量は量と、割合は割合と、名前は名前と入れ替える */
    var o=JSON.parse(base);
    if(A[0]==='t'){var a=o.table.rows[A[1]][A[2]],b=o.table.rows[B[1]][B[2]];if(!a||!b||a===b)continue;
      /* 同じ行か同じ列の、同じ種類（数・式・言葉）どうしだけ入れ替える。推論の並び表は同じ行の中だけ */
      var ka=kind(a),kb=kind(b);if(ka!==kb)continue;
      if(ka==='L'?A[1]!==B[1]:(A[1]!==B[1]&&A[2]!==B[2]))continue;if(ka==='t'&&A[2]!==B[2])continue;
      o.table.rows[A[1]][A[2]]=b;o.table.rows[B[1]][B[2]]=a;}
    else{var k=A[A.length-1],na=get(o,A),nb=get(o,B);if(!na||!nb)continue;var va=na[k]||'',vb=nb[k]||'';
      if(va===vb||(!va&&!vb))continue;if(k==='n'&&(!va||!vb||SKIP.indexOf(va)>=0||SKIP.indexOf(vb)>=0))continue;
      if(k==='r'&&(va==='1'||vb==='1')&&!(va&&vb))continue;
      na[k]=vb;nb[k]=va;
      if(k==='v'&&(va==='?'||vb==='?')){var aa=na.ask;na.ask=nb.ask;nb.ask=aa;}}
    var s=JSON.stringify(o);if(s!==base)c.push(s);}
  /* 表：順番の「あり・なし」、公式の P・C を取り違える */
  if(g.table)g.table.rows.forEach(function(r,ri){r.forEach(function(x,ci){var y=null;
    if(x==='あり')y='なし';else if(x==='なし')y='あり';else if(/\d[PC]\d/.test(x))y=x.replace(/(\d)([PC])(\d)/g,function(m,a,b,d){return a+(b==='P'?'C':'P')+d;});
    if(y){var o=JSON.parse(base);o.table.rows[ri][ci]=y;c.push(JSON.stringify(o));}});});
  c=uniq(c);var st=mk(1,base,c);if(!st)return null;
  st.c=st.c.map(function(s){return JSON.parse(s);});return st;}

/* ===== 計算 ===== */
var NUM='\\d+(?:\\.\\d+)?(?:\\/\\d+)?';
var SEG=new RegExp('(^|[^\\w.\\/])((?:[(（]?\\s*'+NUM+'\\s*[)）]?\\s*[×÷＋−]\\s*)*[(（]?\\s*'+NUM+'\\s*[)）]?)\\s*＝\\s*('+NUM+'%?)(?![\\w.\\/])','g');
function toJs(e){return e.replace(/×/g,'*').replace(/÷/g,'/').replace(/＋/g,'+').replace(/−/g,'-').replace(/（/g,'(').replace(/）/g,')');}
function evalE(e){var j=toJs(e);if(!/^[\d.\/ ()*+\-]+$/.test(j)||!/\d/.test(j))return null;try{var v=Function('return ('+j+');')();return isFinite(v)?v:null;}catch(x){return null;}}
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=a%b;a=b;b=t;}return a||1;}
function valOf(r){var p=r.replace(/%$/,''),v=evalE(p);return v==null?null:(/%$/.test(r)?v/100:v);}
function fmtLike(v,r){if(/%$/.test(r))v=v*100;
  if(/\//.test(r)){for(var d=1;d<=5000;d++){var n=v*d;if(Math.abs(n-Math.round(n))<1e-7){var g=gcd(Math.round(n),d);return (Math.round(n)/g)+(d/g===1?'':'/'+(d/g));}}return null;}
  var s=String(Math.round(v*1e4)/1e4);if(/e/.test(s))return null;return s+(/%$/.test(r)?'%':'');}
/* 誤答が負の数や、整数のはずが小数になると、計算しなくても見分けがつくので使わない */
function okVal(v,r){if(v<0)return false;var o=valOf(r);if(!/[\/%]/.test(r)&&!/\./.test(r)&&Math.abs(o-Math.round(o))<1e-9&&Math.abs(v-Math.round(v))>1e-9)return false;return true;}
/* 「式 ＝ 結果」をすべて見つける（「0.156 ＝ 15.6%」のように続くものも） */
function segs(text){var o=[],m;SEG.lastIndex=0;
  while((m=SEG.exec(text))){var i=m.index+m[1].length,e=m[2],r=m[3],v=evalE(e),rv=valOf(r);
    o.push({i:i,s:m[0].slice(m[1].length),e:e,r:r,v:v,ok:v!=null&&rv!=null&&Math.abs(v-rv)<1e-6*Math.max(1,Math.abs(v)),op:/[×÷＋−]/.test(e)});
    SEG.lastIndex=m.index+m[0].length-r.length-1;}
  return o;}
function repSeg(text,sg,e,r){return text.slice(0,sg.i)+sg.s.replace(sg.e,e).replace(new RegExp('＝\\s*'+esc(sg.r)+'$'),'＝ '+r)+text.slice(sg.i+sg.s.length);}
function repNum(text,from,to,start){var head=text.slice(0,start),tail=text.slice(start);
  return head+tail.replace(new RegExp('(^|[^\\w.\\/])'+esc(from)+'(?![\\w.\\/])','g'),function(x,p){return p+to;});}
/* 1つの式を e2 に変え、その結果を使うあとの計算をやり直した全文を返す（元の計算で合っていた式だけ直す） */
function redo(text,k,e2){var ss=segs(text),sg=ss[k],v=evalE(e2);if(v==null||!okVal(v,sg.r))return null;
  var r2=fmtLike(v,sg.r);if(r2==null||r2===sg.r)return null;
  var okIdx=ss.map(function(x){return x.ok;});
  text=repSeg(text,sg,e2,r2);
  text=repNum(text,sg.r.replace(/%$/,''),r2.replace(/%$/,''),sg.i+sg.s.length-sg.e.length+e2.length-sg.r.length+r2.length);
  for(var n=0;n<12;n++){var s2=segs(text),fix=-1;
    for(var j=k+1;j<s2.length;j++){if(okIdx[j]&&!s2[j].ok){fix=j;break;}}
    if(fix<0)break;var g=s2[fix];if(g.v==null||!okVal(g.v,g.r))return null;var rr=fmtLike(g.v,g.r);if(rr==null)return null;
    text=repSeg(text,g,g.e,rr);
    text=repNum(text,g.r.replace(/%$/,''),rr.replace(/%$/,''),g.i+g.s.length-g.r.length+rr.length);}
  return text;}
function numKind(x){return /\//.test(x)?'f':/\./.test(x)?'d':'i';}
function calcStep(it){var t=it.calc;if(!t)return null;var ss=segs(t),c=[];
  /* 入れ替えに使う数：問題文の数（%は小数に直す）と図の中の数 */
  var src=(it.q||'').replace(/<[^>]+>/g,' ');
  var cand=(src.match(/\d+(?:\.\d+)?(?:\/\d+)?/g)||[]).concat((src.match(/\d+(?:\.\d+)?(?=%)/g)||[]).map(function(x){return String(Math.round(x*1e4/100)/1e4);}));
  var fj=JSON.stringify(it.fig||{});cand=cand.concat(fj.match(/\d+(?:\.\d+)?(?:\/\d+)?/g)||[]);
  cand=uniq(cand).filter(function(x){return x!=='0'&&x!=='1';});
  ss.forEach(function(sg,k){if(!sg.ok||!sg.op)return;
    var ops=sg.e.match(/[×÷＋−]/g)||[];
    ops.forEach(function(op,q){var sw={'×':'÷','÷':'×','＋':'−','−':'＋'}[op],n=-1;
      var e2=sg.e.replace(/[×÷＋−]/g,function(x){n++;return n===q?sw:x;});var r=redo(t,k,e2);if(r)c.push(r);});
    var nums=sg.e.match(new RegExp(NUM,'g'))||[];
    nums.forEach(function(nm,q){cand.forEach(function(x){if(x===nm||nums.indexOf(x)>=0||numKind(x)!==numKind(nm))return;
      var n=-1,e2=sg.e.replace(new RegExp(NUM,'g'),function(y){n++;return n===q?x:y;});var r=redo(t,k,e2);if(r)c.push(r);});});
  });
  return mk(2,t,c);}

function mk(k,right,wrong){wrong=uniq(wrong).filter(function(x){return x!==right;});if(wrong.length<2)return null;
  var c=shuffle([right].concat(shuffle(wrong).slice(0,3)));return {k:k,c:c,a:c.indexOf(right)};}
function steps(it,f){return [inwStep(it,f),figStep(it),calcStep(it)].filter(function(x){return x;});}
return {steps:steps,_inw:inwStep,_fig:figStep,_calc:calcStep};
})();
