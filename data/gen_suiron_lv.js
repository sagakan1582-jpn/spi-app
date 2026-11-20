/* 推論：指標6・7を分けて作る組問（2026-11-20）。
   問題集の推論の文の形（配達の順番＝問26・スピーチ＝問9・曜日の当番＝問21・弁当3種類＝問38）をそのまま使い、
   人・条件の組み合わせを毎回変える。答えはすべて総当たりで決める。
   難しさは「条件の数」と「条件を満たす場合（並び・組）の数」で決める（ユーザーの本番の体感：難しい推論は条件が少なく、絞り込みが難しい）。
     指標6：5人（曜日は4人）、条件4つ、残る場合 3〜7通り
     指標7：6人（曜日・弁当は5人）、条件3つ、残る場合 8〜16通り（問題集の難問：問30は8通り）
   どの条件も、外すと場合が増える（むだな条件はない）。
   問い方は問題集と同じ4つ：すべて選ぶ（あり得る順番・曜日・人）／必ずしも誤りとはいえない推論／確実に間違っている推論／確定に必要な情報（ア〜ウの8択）。
   SETS['推論'][6・7] に組問（共通の文章＋小問2つ）として入れる（setcore の t.lvgen）。BANK['推論'][6・7].real にも1問ずつのテンプレートとして入れる。
   verify は条件をデータから読み直し、別の数え上げ（1人ずつ決める深さ優先）で解き直す。 */
(function(){
var NM=['P','Q','R','S','T','U'],KN=['和食','洋食','中華'],DY=['月','火','水','木','金','土','日'],RN=['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ'],CI='①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳'.split('');
var ADD=['アだけ','イだけ','ウだけ','アとイ','アとウ','イとウ','アとイとウ','ア、イ、ウのすべてが加わってもわからない'],SUBS=[[0],[1],[2],[0,1],[0,2],[1,2],[0,1,2]];
function rnd(n){return Math.floor(Math.random()*n);}
function pk(a){return a[rnd(a.length)];}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=rnd(i+1),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function two(n){var a=rnd(n),b=rnd(n-1);if(b>=a)b++;return [a,b];}
/* ---------- 場面（問題集の文の形） ---------- */
var FR={
 deliv:{k:'ord',
  stem:function(n){return NM.slice(0,n).join('、')+'の'+n+'軒に品物を配達した。配達した順番について、次のことがわかっている。';},
  c:{before:function(a,b){return a+'には'+b+'より先に配達した';},next:function(a,b){return b+'には'+a+'の次に配達した';},gap:function(a,b,m){return a+'と'+b+'の間に'+m+'軒配達した';},
     noadj:function(a,b){return a+'と'+b+'には続けて配達しなかった';},pos:function(a,k){return a+'には'+k+'番目に配達した';},
     nfirst:function(a){return '最初に配達された家は'+a+'ではない';},nlast:function(a){return '最後に配達された家は'+a+'ではない';}},
  st:{pos:function(a,k){return a+'には'+k+'番目に配達した';},before:function(a,b){return b+'より先に'+a+'に配達した';}},
  cb:function(a){return a+'に配達した順番として考えられるものをすべて選びなさい。';},
  all:function(n){return n+'軒に配達した順番';}},
 speech:{k:'ord',
  stem:function(n){return 'あるイベントで'+NM.slice(0,n).join('、')+'の'+n+'人がスピーチをした。スピーチの順番について、次のことがわかっている。';},
  c:{before:function(a,b){return b+'は'+a+'よりあとにスピーチをした';},next:function(a,b){return b+'は'+a+'の次にスピーチをした';},gap:function(a,b,m){return a+'と'+b+'の間に'+m+'人がスピーチをした';},
     noadj:function(a,b){return a+'と'+b+'は続けてスピーチをしなかった';},pos:function(a,k){return a+'は'+k+'番目にスピーチをした';},
     nfirst:function(a){return '最初にスピーチをしたのは'+a+'ではない';},nlast:function(a){return '最後にスピーチをしたのは'+a+'ではない';}},
  st:{pos:function(a,k){return a+'は'+k+'番目にスピーチをした';},before:function(a,b){return a+'は'+b+'より先にスピーチをした';}},
  cb:function(a){return a+'のスピーチは何番目か。可能性があるものをすべて選びなさい。';},
  all:function(n){return n+'人のスピーチの順番';}},
 week:{k:'wk',
  stem:function(n,m){return NM.slice(0,n).join('、')+'の'+n+'人は、月曜日から'+DY[m-1]+'曜日までのうち、週に1日ずつ当番をする。'+n+'人はそれぞれ、別の曜日に当番をする。当番をする曜日について、次のことがわかっている。';},
  c:{after:function(a,b,d){return a+'の'+d+'日後に'+b+'が当番をする';},before:function(a,b){return a+'は'+b+'より前の曜日に当番をする';},noadj:function(a,b){return a+'と'+b+'は続いた曜日に当番をしない';},
     day:function(a,k){return a+'は'+DY[k]+'曜日に当番をする';},nday:function(a,k){return a+'は'+DY[k]+'曜日には当番をしない';}},
  st:{day:function(a,k){return a+'は'+DY[k]+'曜日に当番をする';},before:function(a,b){return a+'は'+b+'より前の曜日に当番をする';}},
  cb:function(a){return a+'が当番をする可能性のある曜日をすべて選びなさい。';},
  all:function(n){return n+'人が当番をする曜日';}},
 bento:{k:'grp',
  stem:function(n){return NM.slice(0,n).join('、')+'の'+n+'人が、和食、洋食、中華の3種類の弁当から1個ずつ選んだ。どの種類も1人以上が選んだ。これについて、次のことがわかっている。';},
  c:{same:function(a,b){return a+'と'+b+'は同じ種類を選んだ';},diff:function(a,b){return a+'は'+b+'と違う種類を選んだ';},is:function(a,k){return a+'は'+KN[k]+'を選んだ';},
     isnot:function(a,k){return a+'は'+KN[k]+'を選ばなかった';},cnt:function(k,c){return KN[k]+'を選んだのは'+c+'人だけだった';},more:function(k,j){return KN[k]+'を選んだ人は'+KN[j]+'を選んだ人より多かった';}},
  st:{is:function(a,k){return a+'は'+KN[k]+'を選んだ';},cnt:function(k,c){return KN[k]+'を選んだのは'+c+'人だった';}},
  cb:function(k){return KN[k]+'を選んだ可能性がある人をすべて選びなさい。';},
  all:function(n){return n+'人が選んだ弁当の種類';}}
};
/* ---------- 条件の意味（x[人]＝順番(0から)・曜日(0=月)・種類(0=和)） ---------- */
function ev(c,x){var a=c[1],b=c[2];switch(c[0]){
 case 'before':return x[a]<x[b];case 'next':return x[b]===x[a]+1;case 'gap':return Math.abs(x[a]-x[b])===c[3]+1;case 'noadj':return Math.abs(x[a]-x[b])!==1;
 case 'pos':return x[a]===b;case 'nfirst':return x[a]!==0;case 'nlast':return x[a]!==x.length-1;
 case 'after':return x[b]===x[a]+c[3];case 'day':return x[a]===b;case 'nday':return x[a]!==b;
 case 'same':return x[a]===x[b];case 'diff':return x[a]!==x[b];case 'is':return x[a]===b;case 'isnot':return x[a]!==b;
 case 'cnt':return x.filter(function(v){return v===a;}).length===b;
 case 'more':return x.filter(function(v){return v===a;}).length>x.filter(function(v){return v===b;}).length;}
 return false;}
/* 推論の文（statement）の意味 */
function evs(s,x){var a=s[1],b=s[2];switch(s[0]){case 'pos':case 'day':case 'is':return x[a]===b;case 'before':return x[a]<x[b];case 'cnt':return x.filter(function(v){return v===a;}).length===b;}return false;}
/* ---------- すべての場合（make 用：前から全部作って条件で消す） ---------- */
var CA={};
function all(k,n,m){var key=k+n+'_'+m;if(CA[key])return CA[key];var out=[];
 (function rec(a){if(a.length===n){if(k!=='grp'||[0,1,2].every(function(t){return a.indexOf(t)>=0;}))out.push(a.slice());return;}
   for(var v=0;v<m;v++){if(k!=='grp'&&a.indexOf(v)>=0)continue;a.push(v);rec(a);a.pop();}})([]);
 return CA[key]=out;}
function sol(k,n,m,cs){return all(k,n,m).filter(function(x){return cs.every(function(c){return ev(c,x);});});}
/* ---------- 条件をランダムに作る ---------- */
function rcond(k,n,m){var p=two(n),a=p[0],b=p[1],t;
 if(k==='ord'){t=pk(['before','before','next','gap','gap','noadj','pos','nfirst','nlast']);
   if(t==='gap')return [t,Math.min(a,b),Math.max(a,b),pk([1,1,2])];if(t==='pos')return [t,a,rnd(n)];if(t==='nfirst'||t==='nlast')return [t,a];if(t==='noadj')return [t,Math.min(a,b),Math.max(a,b)];return [t,a,b];}
 if(k==='wk'){t=pk(['after','after','before','noadj','day','nday','nday']);
   if(t==='after')return [t,a,b,pk([1,2,2,3])];if(t==='day'||t==='nday')return [t,a,rnd(m)];if(t==='noadj')return [t,Math.min(a,b),Math.max(a,b)];return [t,a,b];}
 t=pk(['same','diff','diff','is','isnot','cnt','more']);
 if(t==='same'||t==='diff')return [t,Math.min(a,b),Math.max(a,b)];if(t==='is'||t==='isnot')return [t,a,rnd(3)];if(t==='cnt')return [t,rnd(3),pk([1,1,2])];var q=two(3);return [t,q[0],q[1]];}
function ctext(F,c){var f=F.c[c[0]];if(c[0]==='cnt'||c[0]==='more')return c[0]==='cnt'?f(c[1],c[2]):f(c[1],c[2]);
 return f(NM[c[1]],typeof c[2]==='number'&&(c[0]==='pos')?c[2]+1:(c[0]==='day'||c[0]==='nday'||c[0]==='is'||c[0]==='isnot')?c[2]:NM[c[2]],c[3]);}
/* 記号（解説の「記号」の欄） */
function csym(F,c){var A=NM[c[1]],B=NM[c[2]];switch(c[0]){
 case 'before':return A+' → '+B+'（'+A+'が先）';case 'next':return A+B+'（続けて）';case 'gap':return A+'□'.repeat(c[3])+B+' か '+B+'□'.repeat(c[3])+A;case 'noadj':return A+'と'+B+'は隣り合わない';
 case 'pos':return A+'＝'+(c[2]+1);case 'nfirst':return A+'≠1';case 'nlast':return A+'≠最後';
 case 'after':return B+'＝'+A+'＋'+c[3];case 'day':return A+'＝'+DY[c[2]];case 'nday':return A+'≠'+DY[c[2]];
 case 'same':return A+'＝'+B;case 'diff':return A+'≠'+B;case 'is':return A+'＝'+KN[c[2]].charAt(0);case 'isnot':return A+'≠'+KN[c[2]].charAt(0);
 case 'cnt':return KN[c[1]].charAt(0)+'は'+c[2]+'人';case 'more':return KN[c[1]].charAt(0)+' ＞ '+KN[c[2]].charAt(0)+'（人数）';}return '';}
function stext(F,s){var f=F.st[s[0]];if(s[0]==='cnt')return f(s[1],s[2]);if(s[0]==='pos')return f(NM[s[1]],s[2]+1);if(s[0]==='before')return f(NM[s[1]],NM[s[2]]);return f(NM[s[1]],s[2]);}
/* 推論の文の候補 */
function stPool(k,n,m){var o=[],a,b,v;for(a=0;a<n;a++){
  if(k==='ord')for(v=0;v<n;v++)o.push(['pos',a,v]);if(k==='wk')for(v=0;v<m;v++)o.push(['day',a,v]);if(k==='grp')for(v=0;v<3;v++)o.push(['is',a,v]);
  if(k!=='grp')for(b=0;b<n;b++)if(b!==a)o.push(['before',a,b]);}
 if(k==='grp')for(a=0;a<3;a++)for(v=1;v<=3;v++)o.push(['cnt',a,v]);return o;}
/* ---------- 難しさ ---------- */
var LV={6:{n:5,nw:4,ng:5,nc:4,lo:3,hi:7},7:{n:6,nw:5,ng:5,nc:3,lo:8,hi:16}};
/* ---------- 解説の表 ---------- */
function table(fr,F,n,m,xs,mark){var k=F.k,head,rows;
 if(k==='ord'){head=[''].concat(NM.slice(0,n).map(function(_,i){return (i+1)+'番目';}));
   rows=xs.map(function(x,i){var r=[CI[i]||String(i+1)];for(var p=0;p<n;p++){var w=x.indexOf(p);r.push((mark&&mark(w,x)?'!':'')+NM[w]);}return r;});}
 else if(k==='wk'){head=[''].concat(DY.slice(0,m));
   rows=xs.map(function(x,i){var r=[CI[i]||String(i+1)];for(var d=0;d<m;d++){var w=x.indexOf(d);r.push(w<0?'－':(mark&&mark(w,x)?'!':'')+NM[w]);}return r;});}
 else{head=[''].concat(NM.slice(0,n));rows=xs.map(function(x,i){return [CI[i]||String(i+1)].concat(x.map(function(v,w){return (mark&&mark(w,x)?'!':'')+KN[v].charAt(0);}));});}
 return {table:{head:head,rows:rows}};}
function lab(k){return k==='grp'?'組':'並び';}
/* ---------- 小問 ---------- */
function qCb(fr,F,n,m,cs,xs){var k=F.k;
 if(k==='grp'){var ks=shuf([0,1,2]);for(var i=0;i<3;i++){var K=ks[i],ans=[];for(var w=0;w<n;w++)if(xs.some(function(x){return x[w]===K;}))ans.push(w);
     if(ans.length>=2&&ans.length<=n-1)return {q:F.cb(K),c:NM.slice(0,n),a:ans,d:['cb',K],
       fig:table(fr,F,n,m,xs,function(w,x){return x[w]===K;}),calc:'あり得る'+lab(k)+'は'+xs.length+'通り（表）<br>'+KN[K]+'を選んだことがあるのは '+ans.map(function(w){return NM[w];}).join('・')};}
   return null;}
 var ps=shuf(NM.slice(0,n).map(function(_,i){return i;}));
 for(var j=0;j<ps.length;j++){var a=ps[j],vs=[];xs.forEach(function(x){if(vs.indexOf(x[a])<0)vs.push(x[a]);});vs.sort(function(p,q){return p-q;});
   var nc=k==='ord'?n:m;if(vs.length<2||vs.length>nc-1)continue;
   if(cs.some(function(c){return (c[0]==='pos'||c[0]==='day')&&c[1]===a;}))continue;
   var ch=[];for(var v=0;v<nc;v++)ch.push(k==='ord'?(v+1)+'番目':DY[v]);
   return {q:F.cb(NM[a]),c:ch,a:vs,d:['cb',a],fig:table(fr,F,n,m,xs,function(w){return w===a;}),
     calc:'あり得る'+lab(k)+'は'+xs.length+'通り（表）<br>'+NM[a]+'は '+vs.map(function(v){return ch[v];}).join('・')};}
 return null;}
/* 条件と同じ文、条件で値が決まっている人についての文は使わない（条件を読むだけで判定できてしまう） */
function sameAsCond(cs,s){return cs.some(function(c){return JSON.stringify(c.slice(0,3))===JSON.stringify(s)||((c[0]==='is'||c[0]==='pos'||c[0]==='day')&&(s[0]==='is'||s[0]==='pos'||s[0]==='day')&&c[1]===s[1]);});}
function qJudge(fr,F,n,m,cs,xs,neg){var k=F.k,pool=shuf(stPool(k,n,m)).filter(function(s){return !sameAsCond(cs,s);});
 for(var t=0;t<60;t++){var three=[],used={};
   for(var i=0;i<pool.length&&three.length<3;i++){var s=pool[(i+t*7)%pool.length],key=JSON.stringify(s);if(used[key])continue;used[key]=1;three.push(s);}
   if(three.length<3)return null;
   var poss=three.map(function(s){return xs.filter(function(x){return evs(s,x);}).length;});
   var ans=[];poss.forEach(function(p,i){if(neg?p===0:p>0)ans.push(i);});
   if(ans.length<1||ans.length>2)continue;
   if(!poss.some(function(p){return p>0&&p<xs.length;}))continue;
   pool=shuf(pool);
   var calc='あり得る'+lab(k)+'は'+xs.length+'通り（表）<br>'+three.map(function(s,i){var hit=[];xs.forEach(function(x,j){if(evs(s,x))hit.push(CI[j]||j+1);});
     return 'ABC'.charAt(i)+'　'+(hit.length?'成り立つ'+lab(k)+'がある（'+hit.join('')+'）':'どの'+lab(k)+'でも成り立たない'+(neg?'　→　確実に間違い':''));}).join('<br>');
   return {q:neg?'次のうち、確実に間違っている推論をすべて選びなさい。':'次のうち、必ずしも誤りとはいえない推論をすべて選びなさい。',
     c:three.map(function(s){return stext(F,s);}),a:ans,d:[neg?'neg':'pos'].concat([three]),fig:table(fr,F,n,m,xs),calc:calc};}
 return null;}
function minSub(xs,three){var ok=SUBS.map(function(s){return xs.filter(function(x){return s.every(function(i){return evs(three[i],x);});}).length===1;});
 for(var sz=1;sz<=3;sz++){var hit=[];SUBS.forEach(function(s,i){if(s.length===sz&&ok[i])hit.push(i);});if(hit.length)return hit;}return [7];}
function qAdd(fr,F,n,m,cs,xs,lv,rn){var k=F.k;
 for(var t=0;t<80;t++){var tg=pk(xs),pool=shuf(stPool(k,n,m).filter(function(s){if(s[0]==='before'||s[0]==='cnt')return false;var c=xs.filter(function(x){return evs(s,x);}).length;return evs(s,tg)&&c<xs.length;}));
   pool=pool.filter(function(s){return !sameAsCond(cs,s);});
   /* ア・イ・ウは成り立つ場合の集まりがすべて違うものにする（同じ意味の情報を並べない） */
   var three=[],sig={};for(var i=0;i<pool.length&&three.length<3;i++){var g=xs.map(function(x){return evs(pool[i],x)?1:0;}).join('');if(sig[g])continue;sig[g]=1;three.push(pool[i]);}
   if(three.length<3)continue;var h=minSub(xs,three);
   if(h.length!==1)continue;if(lv===7&&SUBS[h[0]]&&SUBS[h[0]].length<2)continue;if(h[0]===6)continue;if(h[0]===7&&Math.random()<0.8)continue;
   var lines=['ア','イ','ウ'].map(function(mk,i){return mk+'　'+stext(F,three[i]);});
   var calc='あり得る'+lab(k)+'は'+xs.length+'通り（表）<br>'+['ア','イ','ウ'].map(function(mk,i){var hit=[];xs.forEach(function(x,j){if(evs(three[i],x))hit.push(CI[j]||j+1);});return mk+'が成り立つ'+lab(k)+'：'+hit.join('');}).join('<br>')+
     '<br>'+(h[0]===7?'ア、イ、ウをすべて加えても1通りに決まらない':ADD[h[0]].replace('だけ','')+'で1通りに決まる');
   return {q:'最も少ない情報で、'+F.all(n)+'を確定するには、'+rn+'のほか、次のア、イ、ウのうちどれが加わればよいか。AからHの中で1つ選びなさい。<br>'+lines.join('<br>'),
     c:ADD.slice(),a:h[0],d:['add',three],fig:table(fr,F,n,m,xs),calc:calc};}
 return null;}
var QF={cb:qCb,pos:function(a,b,c,d,e,f){return qJudge(a,b,c,d,e,f,false);},neg:function(a,b,c,d,e,f){return qJudge(a,b,c,d,e,f,true);},add:qAdd};
/* ---------- 組を1つ作る ---------- */
function build(fr,lv,qs){var F=FR[fr],L=LV[lv],k=F.k,n=k==='wk'?L.nw:k==='grp'?L.ng:L.n,m=k==='wk'?n+(lv===7?2:1):k==='ord'?n:3;
 for(var t=0;t<400;t++){var cs=[],keys={};
   while(cs.length<L.nc){var c=rcond(k,n,m),key=JSON.stringify(c.slice(0,3));if(keys[key])continue;keys[key]=1;cs.push(c);}
   var xs=sol(k,n,m,cs);if(xs.length<L.lo||xs.length>L.hi)continue;
   /* むだな条件がない：どれを外しても場合が増える */
   if(cs.some(function(c,i){return sol(k,n,m,cs.filter(function(_,j){return j!==i;})).length===xs.length;}))continue;
   /* 名前の出てこない人は1人まで */
   var men={};cs.forEach(function(c){if(c[0]!=='cnt'&&c[0]!=='more'){men[c[1]]=1;if(c[0]!=='pos'&&c[0]!=='day'&&c[0]!=='nday'&&c[0]!=='is'&&c[0]!=='isnot')men[c[2]]=1;}});
   if(Object.keys(men).length<n-1)continue;
   var rn='Ⅰ〜'+RN[cs.length-1],subs=[],ok=true;
   for(var i=0;i<qs.length&&ok;i++){var o=QF[qs[i]](fr,F,n,m,cs,xs,lv,rn);if(!o)ok=false;else{o.l=lv;o.lv=lv;subs.push(o);}}
   if(!ok)continue;
   var stem=F.stem(n,m)+'<br>'+cs.map(function(c,i){return RN[i]+'　'+ctext(F,c);}).join('<br>')+'<br>';
   var inw=cs.map(function(c,i){return RN[i]+'　'+csym(F,c);}).join('<br>');
   subs.forEach(function(o){o.inwh='記号';o.inw=inw;o.v={fr:fr,lv:lv,n:n,m:m,cs:cs,d:o.d};delete o.d;});
   return {stem:stem,subs:subs};}
 return null;}
/* ---------- verify：条件をデータから読み直し、1人ずつ決める深さ優先で数え直して答えの文字列を返す ---------- */
function verify(v,o){var k=FR[v.fr].k,n=v.n,m=v.m,xs=[];
 (function dfs(x){if(x.length===n){if(k==='grp'&&!(x.indexOf(0)>=0&&x.indexOf(1)>=0&&x.indexOf(2)>=0))return;if(v.cs.every(function(c){return ev(c,x);}))xs.push(x.slice());return;}
   for(var val=m-1;val>=0;val--){if(k!=='grp'&&x.indexOf(val)>=0)continue;x.push(val);dfs(x);x.pop();}})([]);
 var d=v.d,F=FR[v.fr];
 if(d[0]==='cb'){if(k==='grp'){var r=[];for(var w=0;w<n;w++)if(xs.some(function(x){return x[w]===d[1];}))r.push(NM[w]);return r;}
   var s={};xs.forEach(function(x){s[x[d[1]]]=1;});return Object.keys(s).map(function(v2){return k==='ord'?(+v2+1)+'番目':DY[+v2];});}
 if(d[0]==='pos'||d[0]==='neg')return d[1].filter(function(st){var p=xs.some(function(x){return evs(st,x);});return d[0]==='pos'?p:!p;}).map(function(st){return stext(F,st);});
 if(d[0]==='add'){var best=null;for(var i=0;i<SUBS.length;i++){var c=0;xs.forEach(function(x){if(SUBS[i].every(function(j){return evs(d[1][j],x);}))c++;});if(c===1&&(best===null||SUBS[i].length<SUBS[best].length))best=i;}return ADD[best===null?7:best];}
 return null;}
/* ---------- 登録 ---------- */
var PAIRS=[['cb','add'],['pos','add'],['neg','cb'],['cb','pos'],['pos','cb'],['neg','add']];
var B=BANK['推論']=BANK['推論']||{},S=window.SETS=window.SETS||{};S['推論']=S['推論']||{};
[6,7].forEach(function(lv){B[lv]=B[lv]||{};B[lv].real=B[lv].real||[];S['推論'][lv]=S['推論'][lv]||[];
 Object.keys(FR).forEach(function(fr){PAIRS.forEach(function(qs,pi){
   var id='set-gen'+lv+'-'+fr+'-'+pi;
   S['推論'][lv].push({id:id,lvgen:function(){return build(fr,lv,qs);}});
   /* 1問ずつ（分野別・AIの実践）：共通の文章＋1問目 */
   B[lv].real.push({id:'g2-sui'+lv+'-'+fr+'-'+pi,make:function(){var g=build(fr,lv,[qs[0]]);if(!g)return null;var o=g.subs[0];o.q=g.stem+o.q;return o;},verify:verify});});});});
window.SUIRON_LV={build:build,verify:verify,FR:FR};
})();
