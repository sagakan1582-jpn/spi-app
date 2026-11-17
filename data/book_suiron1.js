/* 問題集（オフィス海）推論 問1〜44（正誤・順序・内訳）をそのまま収録する。担当A。
   各小問＝テンプレート1個。問題文は問題集のまま、数値（差・時刻・人数・選んだ人など）だけを変える。
   答えは毎回、条件に合う場合を総当たりで全部書き出して決める（make）。verify は v（表示した数値）だけから
   場合を作り直して答えを出し直す。元の数値（O）を入れると別冊の正解になることは app-tools の照合で確認済み。
   bk は問題集の番号（小問は '18-1'）。 */
(function(){
var BKS=BANK['推論']=BANK['推論']||{};
function put(lv,o){var b=BKS[lv]=BKS[lv]||{concept:[],practice:[],applied:[],real:[]};(b.real=b.real||[]).push(o);}
var AL='ABCDEFGHIJKLMNOPQRSTUVWXYZ',SP='　',RN=['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ'],KA=['ア','イ','ウ'],CI='①②③④⑤⑥⑦⑧⑨⑩⑪⑫'.split('');
function rg(a,b){var r=[];for(var i=a;i<=b;i++)r.push(i);return r;}
function perms(a){if(a.length<2)return [a.slice()];var o=[];a.forEach(function(x,i){var r=a.slice(0,i).concat(a.slice(i+1));perms(r).forEach(function(p){o.push([x].concat(p));});});return o;}
function prod(ls){var o=[[]];ls.forEach(function(l){var n=[];o.forEach(function(p){l.forEach(function(x){n.push(p.concat([x]));});});o=n;});return o;}
function uniq(a){var s={},o=[];a.forEach(function(x){var k=JSON.stringify(x);if(!s[k]){s[k]=1;o.push(x);}});return o;}
function conds(a){return a.map(function(t,i){return RN[i]+SP+t;}).join('<br>');}
function kas(a){return a.map(function(t,i){return KA[i]+SP+t;}).join('<br>');}
function tbl(h,rows){return {table:{head:h,rows:rows.slice(0,8)}};}
function nrow(ws,f){return ws.slice(0,8).map(function(w,i){return [CI[i]].concat(f(w));});}
/* すべて選ぶ：labels と、正解の値の集合（vals と同じ並びの値）から {c,a} */
function MS(labels,vals,set){var a=[];vals.forEach(function(x,i){if(set.indexOf(x)>=0)a.push(i);});return a.length&&a.length<labels.length?{c:labels,a:a}:null;}
/* ア〜ウの組合せ（8択・6択） */
var C8=['アだけ','イだけ','ウだけ','アとイ','アとウ','イとウ','アとイとウ'];
function K8(t,h){var k=(t[0]?'ア':'')+(t[1]?'イ':'')+(t[2]?'ウ':'');var m={'ア':0,'イ':1,'ウ':2,'アイ':3,'アウ':4,'イウ':5,'アイウ':6,'':7};return {c:C8.concat([h]),a:m[k]};}
function K6(t){var r=K8(t,'');return r.a<6?{c:C8.slice(0,6),a:r.a}:null;}
function ox(b){return b?'○':'×';}
/* 追加情報：facts（世界→真偽）の部分集合のうち、残る世界の key がすべて同じになる最小のもの。最小が1つに決まらなければ null */
function minInfo(ws,facts,key){var n=facts.length,best=null,cnt=0;
 for(var sz=0;sz<=n&&!best;sz++){for(var m=0;m<(1<<n);m++){var bits=[];for(var i=0;i<n;i++)if(m>>i&1)bits.push(i);if(bits.length!==sz)continue;
   var r=ws.filter(function(w){return bits.every(function(i){return facts[i](w);});});if(!r.length)continue;
   var ks=uniq(r.map(key));if(ks.length===1){if(!best){best=bits;cnt=1;}else cnt++;}}}
 return best?(cnt===1?best:null):'none';}
function T(lv,bk,O,gen,build){
 var t={id:'bk'+bk,bk:bk,orig:O,_b:build,_g:gen,
  make:function(R){var v,o;for(var n=0;n<100&&!o;n++){v=gen(R);o=v&&build(v);}if(!o)return null;o.v=v;o.bk=bk;o.id=t.id+'-'+JSON.stringify(v).replace(/\W/g,'');return o;},
  verify:function(v){var o=build(v);return Array.isArray(o.a)?o.a.map(function(i){return o.c[i];}):o.c[o.a];}};
 put(lv,t);return t;}
/* ===== 推論【正誤】問1〜6：発言P・Q・Rの包含。発言の割り当て（どの発言がP・Q・Rか）を変える ===== */
function PQR(bk,lv,head,kind,S,W,desc,pairs){
 var PR=pairs||[[0,1],[1,2],[2,0]],L='PQR';
 function build(v){var st=v.p.map(function(k){return S[k];});
  var tv=W.map(function(w){return v.p.map(function(k){return !!S[k].f(w);});});
  var imp=PR.map(function(pr){return tv.every(function(t){return !t[pr[0]]||t[pr[1]];});});
  if(imp.filter(Boolean).length!==1)return null;var a=imp.indexOf(true);
  var q=head+'<br>'+st.map(function(s,i){return L[i]+SP+s.t;}).join('<br>')+'<br>以上の'+kind+'は、必ずしもすべてが信頼できるとは限らない。そこで、さまざまな場合を想定して推論がなされた。次のうち正しいものを1つ選びなさい。';
  var c=PR.map(function(pr){return L[pr[0]]+'が正しければ'+L[pr[1]]+'は必ず正しい';});
  /* 代表の場合（P・Q・Rの○×の組ごとに1つ） */
  var seen={},rows=[];W.forEach(function(w,i){var k=tv[i].join();if(!seen[k]){seen[k]=1;rows.push([desc(w)].concat(tv[i].map(ox)));}});
  var calc=PR.map(function(pr,j){var x=L[pr[0]],y=L[pr[1]];
    if(imp[j])return AL[j]+SP+x+'が○の行は、どれも'+y+'も○　→　正しい';
    var k=tv.findIndex(function(t){return t[pr[0]]&&!t[pr[1]];});return AL[j]+SP+x+'が○で'+y+'が×の場合がある（'+desc(W[k])+'）　→　誤り';}).join('<br>');
  return {q:q,c:c,a:a,inwh:'包含',inw:'「甲が正しければ乙は必ず正しい」＝ 甲が○の行は、必ず乙も○<br>'+st.map(function(s,i){return L[i]+'：'+s.t;}).join('<br>'),
   fig:tbl(['場合','P','Q','R'],rows),calc:calc};}
 return T(lv,bk,{p:[0,1,2]},function(R){return {p:R.shuffle([0,1,2])};},build);}

PQR('1',6,'P、Q、Rが、同じ料理を試食して、次のように発言した。','発言',
 [{t:'この料理にはワインが入っている',f:function(w){return w[0];}},{t:'この料理には大さじ1杯の日本酒が入っている',f:function(w){return w[1]===1;}},{t:'この料理には少なくともワインと日本酒のどちらかが入っている',f:function(w){return w[0]||w[1];}}],
 prod([[0,1],[0,1,2]]),function(w){return 'ワイン'+(w[0]?'あり':'なし')+'・日本酒'+['なし','大さじ1','大さじ2'][w[1]];});
PQR('2',6,'XとYが2回ずつ走り幅跳びをした。これについて次の報告があった。','報告',
 [{t:'少なくともどちらか1回は、Xの跳んだ距離の方が長かった',f:function(w){return w[0]>w[2]||w[1]>w[3];}},{t:'1回目と2回目に跳んだ距離の合計はXの方が長かった',f:function(w){return w[0]+w[1]>w[2]+w[3];}},{t:'1回目も2回目もXの跳んだ距離の方が長かった',f:function(w){return w[0]>w[2]&&w[1]>w[3];}}],
 prod([[4,5,6],[4,5,6],[4,5,6],[4,5,6]]),function(w){return 'X '+w[0]+'m・'+w[1]+'m、Y '+w[2]+'m・'+w[3]+'m';});
function sib(w){var m=0,f=0,n=['長','次','三','四'];var s=w.map(function(g){return g?n[m++]+'男':n[f++]+'女';});return s.join('・')+'・'+n[f]+'女(X)';}
PQR('3',6,'Xは、4人きょうだいの末っ子で女性である。このきょうだいについて、P、Q、Rから、次のような3通りの発言があった。','発言',
 [{t:'末っ子は三女ではない',f:function(w){return w.filter(function(g){return !g;}).length!==2;}},{t:'末っ子には兄が2人いる',f:function(w){return w.filter(Boolean).length===2;}},{t:'3番目の年長者は次男である',f:function(w){return w[2]===1&&w[0]+w[1]===1;}}],
 prod([[0,1],[0,1],[0,1]]),sib);
var G4=[];prod([rg(1,9),rg(1,9),rg(1,9),rg(1,9)]).forEach(function(g){if(g[0]<=g[1]&&g[1]<=g[2]&&g[2]<=g[3]&&g[0]+g[1]+g[2]+g[3]===12)G4.push(g);});
PQR('4',6,'4組、計12人の予約について、次のような3通りの発言があった。','発言',
 [{t:'すべての組の人数はばらばらである',f:function(w){return uniq(w).length===4;}},{t:'1人の組と6人の組がある',f:function(w){return w.indexOf(1)>=0&&w.indexOf(6)>=0;}},{t:'偶数人の組は2組である',f:function(w){return w.filter(function(x){return x%2===0;}).length===2;}}],
 G4,function(w){return w.join('・')+'人';});
PQR('5',6,'サッカーチームXとYが試合をし、前半を終えた時点でYが1点リードしていたことがわかっている。また最後まで試合を見た人から次の情報を得た。','情報',
 [{t:'Xは試合に負けなかった',f:function(w){return w[0]-w[1]-1>=0;}},{t:'Xは後半に得点した',f:function(w){return w[0]>=1;}},{t:'Yは後半に得点しなかった',f:function(w){return w[1]===0;}}],
 prod([[0,1,2,3],[0,1,2,3]]),function(w){return '後半 X'+w[0]+'点・Y'+w[1]+'点';},[[0,1],[1,0],[2,0]]);
var RR=[];prod([[0,1],[0,1],[0,1],[0,1],[0,1],[0,1]]).forEach(function(b){var wn=[0,0,0,0],k=0;for(var i=0;i<4;i++)for(var j=i+1;j<4;j++){wn[b[k++]?i:j]++;}RR.push(wn);});
PQR('6',6,'4つのチームW、X、Y、Zが、引き分けのない総当たり戦を行った。これについて、次のような3通りの発言があった。','発言',
 [{t:'全敗したチームがある',f:function(w){return w.indexOf(0)>=0;}},{t:'全勝したチームはない',f:function(w){return w.indexOf(3)<0;}},{t:'勝ち数が同じチームがある',f:function(w){return uniq(w).length<4;}}],
 uniq(RR.map(function(w){return w.slice().sort().reverse();})),function(w){return '勝ち数 '+w.join('・');});
/* ===== 推論【順序】問7〜30 ===== */
var NUM=['1','2','3','4','5','6','7','8','9'];
function ordLab(n,u){return rg(1,n).map(function(i){return i+u;});}
function posOf(o){var p={};o.forEach(function(x,i){p[x]=i;});return p;}
var Q7O=['YWVZX','XWVZY','YWVXZ','YZVXW','YWZVX','YWZXV','XYWZV'];
function s7(k){return perms(['V','W','X','Y','Z']).filter(function(o){var p=posOf(o);return p.W<p.Z&&p.W!==0&&((p.W<p.Z&&p.Z<p.X)||(p.X<p.Z&&p.Z<p.W))&&p.V===k-1;});}
T(6,'7',{k:3,o:Q7O},function(R){var k=R.int(1,5),ws=s7(k),ok=ws.length===1?ws[0].join(''):null;
  var pool=R.shuffle(perms(['V','W','X','Y','Z']).map(function(o){return o.join('');}).filter(function(s){return s!==ok&&(s[k-1]==='V'||s.indexOf('W')<s.indexOf('Z'));}));
  var o=pool.slice(0,ok?6:7);if(ok)o.splice(R.int(0,6),0,ok);return {k:k,o:o};},
 function(v){var ws=s7(v.k),ok=ws.length===1?ws[0].join(''):null,c=v.o.concat(['ア、イ、ウだけではわからない']);
  return {q:'V、W、X、Y、Zの5チームでレースを行った。同着はなく、次のことがわかっているとき、1位からの順位を左から順に表したものはどれか。<br>'+kas(['WはZより早くゴールしたが、1位ではない','ZのタイムはWとXのタイムの平均と同じである','Vは'+v.k+'位である']),
   c:c,a:ok?c.indexOf(ok):7,inwh:'記号',inw:'ア　W → Z、Wは1位でない<br>イ　平均と同じ ＝ ZはWとXのちょうど間（W → Z → X か X → Z → W）<br>　アと合わせて W → Z → X<br>ウ　V＝'+v.k+'位',
   fig:tbl(['','1位','2位','3位','4位','5位'],nrow(ws,function(w){return w;})),calc:'W → Z → X の3つを、V（'+v.k+'位）以外の場所に順に入れる（Wは1位以外）<br>'+(ok?'当てはまる並びは1通り：'+ok:'当てはまる並びが'+ws.length+'通り　→　ア、イ、ウだけではわからない')};});

function s8(v){var o=[];rg(v.mn,v.mx).forEach(function(S){var P=S*2;if(P>v.mx)return;rg(v.mn,v.mx-v.d).forEach(function(Rr){var Tt=Rr+v.d;rg(v.mn,v.mx).forEach(function(Q){var a=[P,Q,Rr,S,Tt];if(uniq(a).length<5)return;if(Math.max.apply(0,a)!==v.mx||Math.min.apply(0,a)!==v.mn)return;o.push(a);});});});return o;}
T(6,'8',{d:3,mx:9,mn:3},function(R){var m=R.pick([[3,9],[2,8],[3,10],[2,9],[4,10],[1,7],[2,7],[3,8]]);return {d:R.int(2,4),mn:m[0],mx:m[1]};},
 function(v){var ws=s8(v);if(!ws.length)return null;var vals=rg(v.mn,v.mx),set=uniq(ws.map(function(w){return w[1];}));var r=MS(vals.map(function(x){return x+'点';}),vals,set);if(!r)return null;
  return {q:'P、Q、R、S、Tという5店のレストランに、10点満点で点数をつけた。各店の点数について、次のことがわかっている。同じ点数の店がないとき、Qの点数として可能性があるものをすべて選びなさい。<br>'+conds(['Pの点数はSの点数の2倍だった','Tの点数はRの点数より'+v.d+'点高かった','5店のうち、最高点は'+v.mx+'点、最低点は'+v.mn+'点だった']),
   c:r.c,a:r.a,inwh:'記号',inw:'Ⅰ　P＝S×2<br>Ⅱ　T＝R＋'+v.d+'<br>Ⅲ　最高'+v.mx+'点・最低'+v.mn+'点（どちらもだれかの点数）',
   fig:tbl(['','P','Q','R','S','T'],nrow(ws,function(w){return w.map(String);})),calc:'P＝S×2 の組と T＝R＋'+v.d+' の組を'+v.mn+'〜'+v.mx+'点で書き出し、最高'+v.mx+'点・最低'+v.mn+'点がそろうようにQを入れる<br>Qになり得るのは '+set.sort(function(a,b){return a-b;}).join('点、')+'点'};});

function s9(){return perms(['P','Q','R','S']).filter(function(o){var p=posOf(o);return Math.abs(p.Q-p.R)!==1&&p.P===p.R+1&&p.S>p.Q;});}
T(6,'9',{t:'Q'},function(R){return {t:R.pick(['P','Q','R','S'])};},
 function(v){var ws=s9(),set=uniq(ws.map(function(o){return o.indexOf(v.t)+1;}));var r=MS(ordLab(4,'番目'),[1,2,3,4],set);if(!r)return null;
  return {q:'あるイベントでP、Q、R、Sの4人がスピーチをした。スピーチの順番について、次のことがわかっている。'+v.t+'のスピーチは何番目か。可能性があるものをすべて選びなさい。<br>'+conds(['QとRは続けてスピーチをしなかった','PはRの次にスピーチをした','SはQよりあとにスピーチをした']),
   c:r.c,a:r.a,inwh:'記号',inw:'Ⅰ　QR・RQ と続けない<br>Ⅱ　R → P（続けて）<br>Ⅲ　Q → … → S',
   fig:tbl(['','1番目','2番目','3番目','4番目'],nrow(ws,function(w){return w;})),calc:'「RP」のかたまりを置き、Qが続かない・SがQよりあとになる並びを書き出す<br>'+v.t+'は '+set.sort().join('番目、')+'番目'};});

var C10={};function s10(f,s){var k=f+''+s;if(C10[k])return C10[k];var out={};
 var vals=rg(1,8),L=[];(function rec(a){if(a.length===4){L.push(a.slice());return;}vals.forEach(function(x){if(a.indexOf(x)<0){a.push(x);rec(a);a.pop();}});})([]);
 L=L.filter(function(l){return Math.min.apply(0,l)===l[f]&&Math.max.apply(0,l)===l[s];});
 prod([[1,2,3],[1,2,3],[1,2,3]]).forEach(function(g){var st=[0,g[0],g[0]+g[1],g[0]+g[1]+g[2]];L.forEach(function(l){var fin=st.map(function(x,i){return x+l[i];});if(uniq(fin).length<4)return;
  var o=[0,1,2,3].sort(function(a,b){return fin[a]-fin[b];}).map(function(i){return 'PQRS'[i];}).join('');out[o]=1;});});
 return C10[k]=Object.keys(out).map(function(x){return x.split('');});}
T(6,'10',{f:2,s:1},function(R){var a=R.shuffle([0,1,2,3]);return {f:a[0],s:a[1]};},
 function(v){var ws=s10(v.f,v.s),F=[function(o){return o.indexOf('S')<o.indexOf('Q');},function(o){return o.indexOf('S')===2;},function(o){return o[0]==='R';}];
  var b=minInfo(ws,F,function(o){return o.join('');});if(!b||b==='none'||!b.length)return null;
  var fin=ws.filter(function(o){return b.every(function(i){return F[i](o);});})[0];
  return {q:'P、Q、R、Sの4チームで駅伝を行った。最終区間について、次のことがわかっている。<br>'+conds(['最終区間では、P、Q、R、Sの順にたすきを渡されてスタートした','最終区間だけのタイムは、'+'PQRS'[v.f]+'が最も速く、'+'PQRS'[v.s]+'が最も遅かった','同着はなかった'])+'<br>最も少ない情報で4チームの最終順位がわかるためには、Ⅰ〜Ⅲのほか、どれが加わればよいか。必要な情報をすべて選びなさい。',
   c:['QはSに抜かれた','Sは1つ順位をあげてゴールした','Rは1位でゴールした'],a:b,inwh:'記号',inw:'スタート順 P → Q → R → S<br>最も速い'+'PQRS'[v.f]+'は前の走者を抜けるが抜かれない／最も遅い'+'PQRS'[v.s]+'は抜かれるが抜けない',
   fig:tbl(['','1位','2位','3位','4位'],nrow(ws,function(w){return w;})),calc:'あり得る最終順位を書き出す（'+ws.length+'通り）<br>情報を1つずつ、次に2つずつ加え、1通りに決まる最も少ない組を探す<br>'+b.map(function(i){return AL[i];}).join('と')+'で '+fin.join('')+' の1通りに決まる'};});

function s11(v){return perms(['P','Q','R','S','T','U']).filter(function(o){var p=posOf(o);return p.S<v.k&&p.R===p.P+1&&p.U===p.Q+v.g;});}
T(6,'11',{k:3,g:3},function(R){return {k:R.int(2,4),g:R.int(2,4)};},
 function(v){var ws=s11(v),set=uniq(ws.map(function(o){return o.indexOf('T')+1;}));var r=MS(ordLab(6,'位'),[1,2,3,4,5,6],set);if(!r)return null;
  return {q:'P、Q、R、S、T、Uの6人が徒競走をした。同着はなく、次のことがわかっているとき、Tの順位として可能性があるものをすべて選びなさい。<br>'+conds(['Sは'+v.k+'位以内に入った','PはRの1つ上の順位だった','QはUより'+v.g+'つ上の順位だった']),
   c:r.c,a:r.a,inwh:'記号',inw:'Ⅰ　S＝1〜'+v.k+'位<br>Ⅱ　PR（続けて）<br>Ⅲ　Q○'+(v.g>2?'○'.repeat(v.g-2):'')+'U（QとUの順位の差'+v.g+'）',
   fig:tbl(['','1位','2位','3位','4位','5位','6位'],nrow(ws,function(w){return w;})),calc:'Q〜Uの組（差'+v.g+'）の位置を決め、PRとSを入れ、残りにTを入れる<br>Tは '+set.sort().join('位、')+'位'};});

var CL=['赤','白','青','黄'];
function st12(s){return s.l.map(function(i){return CL[i]+'玉';}).join('と')+(s.l.length>1?'の和は':'は')+s.r.map(function(i){return CL[i]+'玉';}).join('と')+(s.r.length>1?'の和':'')+'より'+(s.g?'重い':'軽い');}
var W12=[];prod([rg(1,12),rg(1,12),rg(1,12)]).forEach(function(x){var r=x[0],w=x[1],y=x[2],b=r+w;if(w>y&&uniq([r,w,b,y]).length===4)W12.push([r,w,b,y]);});
function ev12(s,w){var a=0,b=0;s.l.forEach(function(i){a+=w[i];});s.r.forEach(function(i){b+=w[i];});return s.g?a>b:a<b;}
T(6,'12',{s:[{l:[0,3],r:[1],g:1},{l:[0,3],r:[2],g:0},{l:[0,1,3],r:[2],g:1}]},function(R){var s=[];for(var t=0;t<40&&s.length<3;t++){var c=R.shuffle([0,1,2,3]),n=R.int(1,3),l=c.slice(0,n).sort(),r=[c[n]],x={l:l,r:r,g:R.int(0,1)};if(!s.some(function(y){return JSON.stringify(y)===JSON.stringify(x);}))s.push(x);}return s.length===3?{s:s}:null;},
 function(v){var mt=v.s.map(function(s){return W12.every(function(w){return ev12(s,w);});}),r=K6(mt);if(!r)return null;
  return {q:'赤、白、青、黄に色分けされた、重さの異なる4個の玉がある。赤玉と白玉の重さの和は青玉の重さに等しく、白玉は黄玉より重い。次の推論の正誤について、必ず正しいものをAからFの中で1つ選びなさい。<br>'+kas(v.s.map(st12)),
   c:r.c,a:r.a,inwh:'式',inw:'赤＋白＝青<br>白 ＞ 黄',calc:v.s.map(function(s,i){var bad=W12.find(function(w){return !ev12(s,w);});return KA[i]+SP+(mt[i]?'青＝赤＋白、白＞黄 を使うと必ず成り立つ　→　正しい':'成り立たない例がある（赤'+bad[0]+'・白'+bad[1]+'・青'+bad[2]+'・黄'+bad[3]+'）');}).join('<br>'),
   fig:tbl(['例','赤','白','青','黄'],[['①'].concat(W12[0].map(String)),['②'].concat(W12[W12.length-1].map(String))])};});

function s13(v){var o=[];[v.c+v.e,v.c-v.e].forEach(function(Y){[Y+v.a,Y-v.a].forEach(function(X){[X+v.b,X-v.b].forEach(function(Z){var t=[0,v.c,X,Y,Z];if(t.slice(1).some(function(x){return x<=0||x>v.T;}))return;if(Math.max.apply(0,t)!==v.T)return;o.push(t);});});});return uniq(o);}
function f13(t){var X=t[2],W=t[1],rk=1+t.filter(function(x){return x<X;}).length,nx=Math.min.apply(0,t.filter(function(x){return x>W;}));return [rk===2,t[3]===t[4],X>W&&nx===X];}
T(6,'13',{a:4,b:4,c:12,e:6,T:18},function(R){var c=R.int(6,14),e=R.int(2,8),a=R.int(2,6),b=R.int(2,6);return {a:a,b:b,c:c,e:e,T:R.int(c+2,c+e+a+b)};},
 function(v){var ws=s13(v);if(!ws.length)return null;var ev=ws.map(f13),must=[0,1,2].filter(function(i){return ev.every(function(e){return e[i];});});if(!must.length||must.length===3)return null;
  return {q:'V、W、X、Y、Zの5人が徒競走をした。その結果、Vが1位で、1位と最下位の差は'+v.T+'秒だった。また、XとYは'+v.a+'秒差、XとZは'+v.b+'秒差、VとWは'+v.c+'秒差、WとYは'+v.e+'秒差だった。次の推論の正誤について、必ず正しいものをすべて選びなさい。',
   c:['Xは2位である','YとZは同着である','Wの次にゴールしたのはXである'],a:must,inwh:'数直線',inw:'Vを0秒とし、遅れた秒数で書く<br>W＝'+v.c+'、Y＝W±'+v.e+'、X＝Y±'+v.a+'、Z＝X±'+v.b+'<br>いちばん遅い人がちょうど'+v.T+'秒',
   fig:tbl(['','V','W','X','Y','Z'],nrow(ws,function(w){return w.map(String);})),calc:'Wから順に±をたどり、0秒より遅く'+v.T+'秒以内で、最下位が'+v.T+'秒になる場合だけ残す（'+ws.length+'通り）<br>'+['A','B','C'].map(function(x,i){return x+SP+(must.indexOf(i)>=0?'どの場合も成り立つ':'成り立たない場合がある');}).join('<br>')};});

function s14(v){var d=v.dir==='右'?1:-1,out=[];perms([0,1,2]).forEach(function(o){var cur=[4],lists=[[]];
  var paths=[[4]];o.forEach(function(k){var np=[];paths.forEach(function(p){var x=p[p.length-1],c=k===0?[x+v.n1,x-v.n1]:k===1?[x+v.n2,x-v.n2]:[x+d*v.n3];c.forEach(function(y){if(y>=1&&y<=7&&p.indexOf(y)<0)np.push(p.concat([y]));});});paths=np;});
  paths.forEach(function(p){out.push(p);});});return out;}
T(6,'14',{n1:4,n2:1,n3:2,dir:'右'},function(R){var n=R.shuffle([1,2,3,4,5]);return {n1:R.pick([3,4,5]),n2:R.pick([1,2]),n3:R.pick([1,2,3]),dir:R.pick(['右','左'])};},
 function(v){if(uniq([v.n1,v.n2,v.n3]).length<3)return null;var ws=s14(v),set=uniq(ws.map(function(p){return p[3];}));var r=MS(rg(1,7).map(function(i){return '左から'+i+'番目';}),rg(1,7),set);if(!r)return null;
  return {q:'横一列に7個並んでいるロッカーのボックスの中を検査した。最初に真ん中のボックスを調べた。その後に調べた順番について、次のことがわかっている。ただし、ア、イ、ウを調べた順番は不明である。このとき、最後（4番目）に調べた可能性があるボックスはどれか。当てはまるものをすべて選びなさい。なお、調べたボックスはすべて異なる位置のものである。<br>'+kas(['次に、'+v.n1+'つ隣を調べた','次に、'+v.n2+'つ隣を調べた','次に、'+v.n3+'つ'+v.dir+'を調べた']),
   c:r.c,a:r.a,inwh:'記号',inw:'左から1〜7番目とし、真ん中＝4<br>ア　±'+v.n1+'　イ　±'+v.n2+'　ウ　'+(v.dir==='右'?'＋':'−')+v.n3,
   fig:tbl(['','1回目','2回目','3回目','4回目'],nrow(ws,function(p){return p.map(String);})),calc:'ア・イ・ウの順番6通りそれぞれで、1〜7からはみ出さず、同じ箱に戻らない動き方を書き出す<br>4回目は 左から'+set.sort().join('・')+'番目'};});

function s15(v){var o=[];rg(2,20).forEach(function(X){var Y=X-1;rg(1,25).forEach(function(W){rg(1,25).forEach(function(Z){var a=[W,X,Y,Z];if(uniq(a).length<4)return;if(a.some(function(t){return Math.abs(t-X)>=v.k;}))return;if(!(Math.abs(X-W)>Math.abs(Y-Z)))return;if(Math.abs(W-Z)!==v.m)return;o.push(a);});});});return o;}
T(6,'15',{k:4,m:5},function(R){var k=R.int(3,5);return {k:k,m:R.int(3,2*k-2)};},
 function(v){var ws=s15(v);if(!ws.length)return null;var set=uniq(ws.map(function(a){return 1+a.filter(function(x){return x>a[3];}).length;}));var r=MS(ordLab(4,'番目'),[1,2,3,4],set);if(!r)return null;
  var rel=uniq(ws.map(function(a){return a.map(function(x){return x-a[1];});}));
  return {q:'W、X、Y、Zの4人が1人1冊以上の本を持ち寄った。本の冊数について、次のことがわかっている。同数はないとき、Zが持ってきた本の数は多い方から何番目か。可能性があるものをすべて選びなさい。<br>'+conds(['XはYより1冊多く、Xと'+v.k+'冊以上の差がある人はいない','XとWの差は、YとZの差よりも大きい','WとZは'+v.m+'冊の差がある']),
   c:r.c,a:r.a,inwh:'数直線',inw:'Xを0とすると Y＝−1、ほかの人は −'+(v.k-1)+'〜＋'+(v.k-1)+'<br>|W−Z|＝'+v.m+'、|X−W| ＞ |Y−Z|',
   fig:tbl(['','W','X','Y','Z'],nrow(rel,function(a){return a.map(function(x){return (x>0?'+':'')+x;});})),calc:'Xを0とした数直線で、差が'+v.m+'のWとZの組を書き出し、Ⅱで消す<br>Zは多い方から '+set.sort().join('番目、')+'番目'};});

function s16(v){return perms(['P','Q','R','S','T','U']).filter(function(o){var p=posOf(o);return Math.abs(p.P-p.Q)===v.g1+1&&Math.abs(p.S-p.T)===v.g2+1&&p.U===(v.u==='右端'?5:0);});}
T(6,'16',{g1:1,g2:3,u:'右端',k:3},function(R){return {g1:R.int(1,3),g2:R.int(1,4),u:R.pick(['右端','左端']),k:R.int(1,6)};},
 function(v){var ws=s16(v);if(!ws.length)return null;var set=uniq(ws.map(function(o){return o[v.k-1];}));if(set.indexOf('U')>=0)return null;var r=MS(['P','Q','R','S','T'],['P','Q','R','S','T'],set);if(!r)return null;
  return {q:'P、Q、R、S、T、Uの6人が横一列に並んでいる。並び方について、次のことがわかっている。<br>'+conds(['PとQの間には'+v.g1+'人いる','SとTの間には'+v.g2+'人いる'])+'<br>Uが'+v.u+'の場合、左から'+v.k+'番目の可能性がある人をすべて選びなさい。',
   c:r.c,a:r.a,inwh:'記号',inw:'Ⅰ　P'+'○'.repeat(v.g1)+'Q（逆も）<br>Ⅱ　S'+'○'.repeat(v.g2)+'T（逆も）<br>U＝'+v.u,
   fig:tbl(['','1','2','3','4','5','6'],nrow(ws,function(w){return w;})),calc:'Uを'+v.u+'に置き、長いかたまり（S〜T）から置ける場所を決め、残りにP〜Qを入れる<br>左から'+v.k+'番目は '+set.sort().join('・')};});

/* 問17：数値のない問題なので固定（答えは総当たりで決める） */
(function(){var L=['P','Q','R','S','T'],sums={},ex=[];perms([1,2,3,4,5]).forEach(function(s){perms([1,2,3,4,5]).forEach(function(f){var S={},F={};L.forEach(function(x,i){S[x]=s[i];F[x]=f[i];});
  if(L.some(function(x){return S[x]===F[x];}))return;if(S.S!==1||F.S!==5)return;if(!(S.P>S.R&&F.P>F.R))return;if(F.Q!==S.Q-1||S.Q<4)return;if(!(S.R<S.Q&&F.R<F.Q))return;
  if(!(F.T<S.T&&F.T!==1))return;if(L.some(function(x){return S[x]>S.T&&F[x]<F.T;}))return;if(!(S.P<S.Q&&S.R<S.Q))return;if(S.T<S.Q&&(F.T>F.Q||F.P<F.T||F.R<F.T))return;if(['P','R'].filter(function(x){return F[x]<F.Q;}).length+(S.T>S.Q&&F.T<F.Q?1:0)!==2)return;sums[F.R+S.T]=1;ex.push([S,F]);});});
 var set=Object.keys(sums).map(Number),r=MS(['3','4','5','6','7','8'],[3,4,5,6,7,8],set);
 put(7,{bk:'17',id:'bk17',q:'5チームでバトンの受け渡しによるリレーを行った。5チームの最終ランナーは、それぞれP、Q、R、S、Tであった。各人の自分に関する次の発言が正しいとき、Rの最終順位とTがバトンを受けたときの順位の和として考えられるものはどれか。可能性があるものをすべて選びなさい。ただし、バトンを受け取ったときの順位と最終順位が同順位の者はいないものとする。<br>P'+SP+'ずっとRの後方を走っていた<br>Q'+SP+'他のランナー3人を抜いた後で、2人に抜かれた<br>R'+SP+'Qに1回抜かれたが、Qを1回抜き返した<br>S'+SP+'先頭でバトンを渡されたが、転んで一気に最下位になったままゴールした<br>T'+SP+'誰にも1回も抜かれなかったが、先頭でゴールしなかった',
  c:r.c,a:r.a,inwh:'2つの順位',inw:'受けた順位→最終順位 を人ごとに書く<br>S：1位→5位<br>Q：3人抜いて2人に抜かれた → 1つ上がる（受けた順位は4位以下）<br>R：Qより前で受け、Qより前でゴール<br>P：受けたときもゴールもRより後ろ<br>T：だれにも抜かれない → 後ろから来た人はTより後ろ。最終は2位以下',
  fig:tbl(['','受けた順位','最終順位'],ex.slice(0,1).map(function(e){return ['例',L.map(function(x){return x+e[0][x];}).join(' '),L.map(function(x){return x+e[1][x];}).join(' ')];})),
  calc:'Sが1位→5位なので、ほかの4人は受けた順位から1つずつ上がる候補を考える<br>Qが抜いた3人はP・R・S（Tはだれにも抜かれない）→ P・RはQより前で受けた<br>Qを抜いたのはR（抜き返し）ともう1人。QがTより後ろで受けると、Qに抜かれたRがTより前に戻れない（Tは抜かれない）→ QはTより前で受けた<br>Rの最終順位＋Tの受けた順位 ＝ '+set.join('、')});})();

function s18(v){var H=rg(18,23),o=[];prod([H,H,H,H,H]).forEach(function(t){if(uniq(t).length<5)return;if(Math.abs(t[0]-t[1])!==v.a||t[2]!==t[3]-v.b)return;o.push(t);});return o;}
var Q18=function(v){return 'P、Q、R、S、Tという5店は、18時、19時、20時、21時、22時、23時のうち、それぞれ違う時間に閉店する。閉店時間について、次のことがわかっている。<br>'+conds(['PとQは、'+v.a+'時間差で閉店する','RはSより'+v.b+'時間早く閉店する']);};
var G18=function(R){return {a:R.int(1,3),b:R.int(2,4),c:R.int(1,3)};},HL=rg(18,23).map(function(h){return h+'時';});
T(6,'18-1',{a:2,b:4,c:2},G18,function(v){var ws=s18(v),set=uniq(ws.map(function(t){return t[2];})),r=MS(HL,rg(18,23),set);if(!r)return null;
  return {q:Q18(v)+'<br>Rの閉店時間は何時か。当てはまるものをすべて選びなさい。',c:r.c,a:r.a,inwh:'記号',inw:'Ⅰ　|P−Q|＝'+v.a+'時間<br>Ⅱ　R＋'+v.b+'＝S',
   fig:tbl(['R','S'],uniq(ws.map(function(t){return [t[2]+'時',t[3]+'時'];}))),calc:'R〜S（'+v.b+'時間差）を置き、残りの時間にP〜Q（'+v.a+'時間差）が置けるかを調べる<br>Rは '+set.sort().join('時、')+'時'};});
T(6,'18-2',{a:2,b:4,c:2},G18,function(v){var ws=s18(v).filter(function(t){return Math.abs(t[1]-t[4])===v.c;}),set=uniq(ws.map(function(t){return t[0];})),r=MS(HL,rg(18,23),set);if(!r)return null;
  return {q:Q18(v)+'<br>QとTが'+v.c+'時間差で閉店する場合、Pの閉店時間は何時か。当てはまるものをすべて選びなさい。',c:r.c,a:r.a,inwh:'記号',inw:'Ⅰ　|P−Q|＝'+v.a+'時間<br>Ⅱ　R＋'+v.b+'＝S<br>追加　|Q−T|＝'+v.c+'時間',
   fig:tbl(['','P','Q','R','S','T'],nrow(ws,function(t){return t.map(String);})),calc:'Qを中心に P（±'+v.a+'）と T（±'+v.c+'）を置き、残りに R〜S（'+v.b+'時間差）が入るか調べる<br>Pは '+set.sort().join('時、')+'時'};});

function s19(v){return perms([0,1,2,3,4]).filter(function(s){return Math.abs(s[2]-s[3])===v.d1&&Math.abs(s[0]-s[1])===v.d2;});}
var Q19=function(v){return 'P、Q、R、S、Tの靴の大きさについて、次のことがわかっている。<br>'+conds(['5人は1cmずつ大きさが異なり、同じ大きさの人はいない','RとSの差は'+v.d1+'cmである','PとQの差は'+v.d2+'cmである']);};
var G19=function(R){var d=R.shuffle([1,2,3]);return {d1:d[0],d2:d[1],ps:R.int(24,26)};};
T(6,'19-1',{d1:1,d2:2,ps:25},G19,function(v){var ws=s19(v),set=uniq(ws.map(function(s){return 5-s[4];})),r=MS(ordLab(5,'番目'),[1,2,3,4,5],set);if(!r)return null;
  return {q:Q19(v)+'<br>靴を大きい順に並べたとき、Tは5人の中で何番目か。可能性がある順番をすべて選びなさい。',c:r.c,a:r.a,inwh:'記号',inw:'大きさを1〜5（1cmずつ）の5つの席と考える<br>R・Sは'+v.d1+'つ離れた席、P・Qは'+v.d2+'つ離れた席',
   fig:tbl(['','大','','','','小'],nrow(ws,function(s){var o=[];'PQRST'.split('').forEach(function(x,i){o[4-s[i]]=x;});return o;})),calc:'R〜Sの組とP〜Qの組を5つの席に置き、残った席がT<br>Tは大きい方から '+set.sort().join('番目、')+'番目'};});
T(6,'19-2',{d1:1,d2:2,ps:25},G19,function(v){var ws=s19(v).filter(function(s){return s[0]>s[2];}),set=uniq(ws.map(function(s){return v.ps+s[3]-s[0];})),vals=rg(v.ps-5,v.ps+3),r=MS(vals.map(function(x){return x+'cm';}),vals,set);if(!r||!ws.length)return null;
  return {q:Q19(v)+'<br>Pの靴のサイズが'+v.ps+'cmでRより大きいとき、Sの靴のサイズとして可能性があるものをすべて選びなさい。',c:r.c,a:r.a,inwh:'記号',inw:'5人は連続した5つのサイズ<br>R・Sは'+v.d1+'cm差、P・Qは'+v.d2+'cm差、P＞R、P＝'+v.ps+'cm',
   fig:tbl(['','P','Q','R','S','T'],nrow(ws,function(s){return s.map(function(x){return (v.ps+x-s[0])+'';});})),calc:'Pを'+v.ps+'cmとして並びを書き出し、P＞R の場合だけ残す<br>Sは '+set.sort().join('cm、')+'cm'};});

function s20(v){return perms(['P','Q','R','S','T']).filter(function(o){var p=posOf(o);return Math.abs(p.Q-p.S)===v.g+1&&p.S===p.T+1;});}
var Q20=function(v){return 'P、Q、R、S、Tの5人が5時に待ち合わせをした。このときの状況について、次のことがわかっている。<br>'+conds(['QとSの間に'+v.g+'人到着した','SはTの次に到着した','5時に間に合ったのは'+v.k+'人だった']);};
var G20=function(R){return {g:R.int(1,2),k:R.int(2,3),e:R.pick([5,10]),l:R.pick([5,10])};};
function b20(early){return function(v){var ws=s20(v).filter(function(o){return early?o.indexOf('P')<v.k:o.indexOf('P')>=v.k;}),set=uniq(ws.map(function(o){return o.indexOf('R')+1;})),r=MS(ordLab(5,'番目'),[1,2,3,4,5],set);if(!r)return null;
  return {q:Q20(v)+'<br>Pが'+(early?'4時'+(60-v.e):'5時'+v.l)+'分に到着した場合、Rは早い順で何番目に到着したか。当てはまるものをすべて選びなさい。',c:r.c,a:r.a,inwh:'記号',inw:'Ⅰ　Q'+'○'.repeat(v.g)+'S（逆も）<br>Ⅱ　TS（続けて）<br>Ⅲ　1〜'+v.k+'番目が間に合った　→　Pは'+(early?'1〜'+v.k:(v.k+1)+'〜5')+'番目',
   fig:tbl(['','1','2','3','4','5'],nrow(ws,function(w){return w;})),calc:'TSのかたまりとQの位置を決め、Pを'+(early?'間に合った':'遅れた')+'側に入れ、残りにR<br>Rは '+set.sort().join('番目、')+'番目'};};}
T(6,'20-1',{g:2,k:2,e:10,l:10},G20,b20(true));T(6,'20-2',{g:2,k:2,e:10,l:10},G20,b20(false));

var DW=['月','火','水','木','金','土','日'];
function s21(v){var o=[];rg(0,6).forEach(function(P){var Q=(P+v.q)%7,R=(P+v.r)%7;if(uniq([P,Q,R,v.sd]).length<4)return;o.push([P,Q,R,v.sd]);});return o;}
var Q21=function(v){return 'P、Q、R、S、Tの5人は、週に1度ずつジョギングをする。ジョギングをする曜日について、次のことがわかっている。<br>'+conds(['Sは'+DW[v.sd]+'曜日にジョギングをする','Pの'+v.r+'日後にRがジョギングをする','5人はそれぞれ、別の曜日にジョギングをする']);};
var G21=function(R){var r=R.int(2,5),q=R.int(1,3);return q===r?null:{sd:R.int(0,6),r:r,q:q};};
function b21(ask,qn){return function(v){var ws=s21(v),set=uniq(ws.map(function(w){return w[ask];})),r=MS(DW,rg(0,6),set);if(!r)return null;
  return {q:Q21(v)+'<br>Pの'+(v.q===1?'翌日':v.q+'日後')+'にQがジョギングをするとき、'+'PQR'[ask]+'が走る可能性のある曜日をすべて選びなさい。',c:r.c,a:r.a,inwh:'記号',inw:'曜日は月→日→月…と1週間でひと回り<br>S＝'+DW[v.sd]+'、R＝P＋'+v.r+'日、Q＝P＋'+v.q+'日',
   fig:tbl(['','P','Q','R','S'],nrow(ws,function(w){return w.map(function(x){return DW[x];});})),calc:'Pを月〜日の7通り置き、Q・Rを数えて、Sの'+DW[v.sd]+'曜日や互いに重なるものを消す<br>'+'PQR'[ask]+'は '+set.map(function(x){return DW[x];}).join('・')};};}
T(6,'21-1',{sd:2,r:4,q:1},G21,b21(0));T(6,'21-2',{sd:2,r:4,q:2},G21,b21(2));

var HS=['P','Q','R','S','T','U'];
function s22(v){var o=[];(function rec(p){if(p.length===5){o.push(p.slice());return;}rg(0,5).forEach(function(x){if(p.indexOf(x)>=0)return;if(p.length&&Math.abs(x-p[p.length-1])!==v.pat[p.length-1])return;p.push(x);rec(p);p.pop();});})([]);return o;}
function g22t(n,g){return n+'番目に配達した家と'+(n+1)+'番目に配達した家'+(g===1?'は隣同士である':'の間には'+(g-1)+'軒ある');}
var Q22=function(v){return 'ある通りには、P、Q、R、S、T、Uの順で6軒の家が並んでいる。このうちの5軒に1つずつ荷物を配達した。このとき、次のことがわかっている。<br>'+v.pat.map(function(g,i){return RN[i]+SP+g22t(i+1,g);}).join('<br>');};
var G22=function(R){return {pat:[R.int(1,3),R.int(1,2),R.int(1,3),R.int(1,2)],h:R.int(0,5)};};
function b22(fix,ask){return function(v){var ws=s22(v).filter(function(p){return p[fix]===v.h;});if(!ws.length)return null;
  var set=uniq(ws.map(function(p){return ask==='no'?rg(0,5).filter(function(x){return p.indexOf(x)<0;})[0]:p[0];})),r=MS(HS,rg(0,5),set);if(!r)return null;
  return {q:Q22(v)+'<br>'+(fix===0?'1番目に':'最後に')+HS[v.h]+'に配達したとき、'+(ask==='no'?'配達されなかった':'1番目に配達した')+'可能性がある家をすべて選びなさい。',c:r.c,a:r.a,inwh:'記号',inw:'家を左から P＝1 … U＝6 とする<br>'+v.pat.map(function(g,i){return (i+1)+'番目→'+(i+2)+'番目：'+g+'つ移動';}).join('<br>'),
   fig:tbl(['','1番目','2番目','3番目','4番目','5番目'],nrow(ws,function(p){return p.map(function(x){return HS[x];});})),calc:(fix===0?'1番目':'5番目')+'の'+HS[v.h]+'から、'+(fix===0?'前':'後ろ')+'から順に移動の数だけずらして書き出す<br>答え：'+set.map(function(x){return HS[x];}).sort().join('・')};};}
T(6,'22-1',{pat:[2,1,2,1],h:0},G22,b22(0,'no'));T(6,'22-2',{pat:[2,1,2,1],h:1},G22,b22(4,'first'));T(6,'22-3',{pat:[2,1,2,1],h:5},G22,b22(4,'no'));
function s23(v,lo,hi){var o=[];rg(lo,hi).forEach(function(P){[v.a,-v.a].forEach(function(da){var Q=P+da;[v.b,-v.b].forEach(function(db){var S=P+db;[v.c,-v.c].forEach(function(dc){var Rr=Q+dc;[v.e,-v.e].forEach(function(de){var Tt=Q+de;o.push([P,Q,Rr,S,Tt]);});});});});});return uniq(o);}
var Q23=function(v){return 'P、Q、R、S、Tの5人の身長について、次のことがわかっている。<br>'+conds(['PはQと'+v.a+'cm差、Sと'+v.b+'cm差である','QはRと'+v.c+'cm差、Tと'+v.e+'cm差である']);};
var G23=function(R){var lo=R.int(160,168);return {a:R.int(1,4),b:R.int(1,3),c:R.int(2,4),e:R.int(1,3),ph:R.int(168,175),lo:lo,hi:lo+R.int(5,7)};};
var I23=function(v){return 'Pを基準に数直線に置く<br>Q＝P±'+v.a+'、S＝P±'+v.b+'<br>R＝Q±'+v.c+'、T＝Q±'+v.e;};
T(6,'23-1',{a:2,b:1,c:3,e:1,ph:170,lo:166,hi:172},G23,function(v){var ws=s23(v,v.ph,v.ph).filter(function(h){return h.slice(1).every(function(x){return x<v.ph;});});if(!ws.length)return null;
  var set=uniq(ws.map(function(h){return h[4];})),vals=rg(v.ph-7,v.ph),r=MS(vals.map(function(x){return x+'cm';}),vals,set);if(!r)return null;
  return {q:Q23(v)+'<br>一番背が高い人が'+v.ph+'cmのPであったとき、Tの身長として可能性があるものはどれか。当てはまるものをすべて選びなさい。',c:r.c,a:r.a,inwh:'数直線',inw:I23(v)+'<br>P＝'+v.ph+'cmが一番高い → ほかは全員'+v.ph+'cmより低い',
   fig:tbl(['','P','Q','R','S','T'],nrow(ws,function(h){return h.map(String);})),calc:'Pより高くならないように、Q＝'+(v.ph-v.a)+'cm から R・S・T を置く<br>Tは '+set.sort().join('cm、')+'cm'};});
T(6,'23-2',{a:2,b:1,c:3,e:1,ph:170,lo:166,hi:172},G23,function(v){var ws=s23(v,v.lo-10,v.hi+10).filter(function(h){return Math.min.apply(0,h)===v.lo&&Math.max.apply(0,h)===v.hi;});if(!ws.length)return null;
  var set=uniq(ws.map(function(h){return h[0];})),vals=rg(v.lo-1,v.hi),r=MS(vals.map(function(x){return x+'cm';}),vals,set);if(!r)return null;
  return {q:Q23(v)+'<br>一番背が低い人が'+v.lo+'cm、一番背が高い人が'+v.hi+'cmであったとき、Pの身長として可能性があるものはどれか。当てはまるものをすべて選びなさい。',c:r.c,a:r.a,inwh:'数直線',inw:I23(v)+'<br>いちばん低い'+v.lo+'cmといちばん高い'+v.hi+'cmの差は'+(v.hi-v.lo)+'cm',
   fig:tbl(['','P','Q','R','S','T'],nrow(ws,function(h){return h.map(String);})),calc:'P・Q・R・S・Tの位置関係を書き出し、高い人と低い人の差がちょうど'+(v.hi-v.lo)+'cmになる場合だけ残す<br>Pは '+set.sort().join('cm、')+'cm'};});

function s24(v){var o=[];[1,-1].forEach(function(x){[1,-1].forEach(function(y){[1,-1].forEach(function(z){var K=v.K||0,L=K+x*v.a,N=K+y*v.b,M=N+z*v.c;o.push([K,L,M,N]);});});});return o;}
var Q24=function(v){return 'K、L、M、Nという4つの商品の値段について、次のことがわかっている。<br>'+conds(['KとLの差は'+v.a+'円','KとNの差は'+v.b+'円','MとNの差は'+v.c+'円']);};
var I24=function(v){return 'Kを基準に数直線に置く<br>L＝K±'+v.a+'、N＝K±'+v.b+'、M＝N±'+v.c;};
var KL=['K','L','M','N'];
T(6,'24-1',{a:100,b:50,c:150,d:200,K:1000},function(R){var a=R.pick([50,100,150,200]),b=R.pick([50,100,150]),c=R.pick([100,150,200,250]);var ds=uniq(s24({a:a,b:b,c:c}).map(function(w){return Math.abs(w[2]);})).filter(function(d){return d>0;});return a===b?null:{a:a,b:b,c:c,d:R.pick(ds),K:1000};},
 function(v){var ws=s24({a:v.a,b:v.b,c:v.c}).filter(function(w){return Math.abs(w[2])===v.d;});if(!ws.length)return null;
  var set=uniq([].concat.apply([],ws.map(function(w){var m=Math.max.apply(0,w);return KL.filter(function(x,i){return w[i]===m;});}))),r=MS(KL,KL,set);if(!r)return null;
  return {q:Q24(v)+'<br>KとMの差が'+v.d+'円の場合、一番高い商品はどれか。当てはまるものをすべて選びなさい。',c:r.c,a:r.a,inwh:'数直線',inw:I24(v)+'<br>追加　|K−M|＝'+v.d,
   fig:tbl(['K基準','K','L','M','N'],nrow(ws,function(w){return w.map(function(x){return (x>0?'+':'')+x;});})),calc:'Nの2通り×Mの2通りから |K−M|＝'+v.d+' になるものを残し、Lの2通りと組み合わせる<br>一番高いのは '+set.join('・')};});
T(6,'24-2',{a:100,b:50,c:150,d:200,K:1000},function(R){var a=R.pick([50,100,150,200]),b=R.pick([50,100,150]),c=R.pick([100,150,200,250]);return a===b?null:{a:a,b:b,c:c,K:R.pick([800,1000,1200])};},
 function(v){var ws=s24(v),F=[function(w){return w[0]>w[3];},function(w){return w[1]<w[2];},function(w){return w[3]<w[2];}];
  if(uniq(ws.map(String)).length<ws.length)return null;var b=minInfo(ws,F,function(w){return w.join();});if(b===null||(b!=='none'&&!b.length))return null;
  var r=K8([0,1,2].map(function(i){return b!=='none'&&b.indexOf(i)>=0;}),'ア、イ、ウだけではわからない');
  return {q:Q24(v)+'<br>Kが'+v.K+'円の場合、最も少ない情報ですべての商品の値段を明確にするためには、次のア、イ、ウのうち、どれが加わればよいか。AからHの中で1つ選びなさい。<br>'+kas(['KはNより高い','LはMより安い','NはMより安い']),
   c:r.c,a:r.a,inwh:'数直線',inw:I24(v)+'<br>L・N・Mの向き（＋か−か）が2×2×2＝8通り',
   fig:tbl(['','K','L','M','N'],nrow(ws,function(w){return w.map(String);})),calc:'8通りを書き出し、ア・イ・ウで消して1通りに決まる最も少ない組を探す<br>'+(b==='none'?'ア・イ・ウを全部加えても1通りに決まらない':b.map(function(i){return KA[i];}).join('と')+'で1通りに決まる')};});

var D6=['月','火','水','木','金','土'],P6=['P','Q','R','S','T','U'];
function s25(x){return perms(P6).filter(function(o){var p=posOf(o);return p.Q===p.P+1&&p.S===p.R+1&&p.T!==x&&p.U!==x;});}
var Q25=function(v){return '月曜日から土曜日まで行われるイベントに、P、Q、R、S、T、Uの6人が1日1人ずつゲストとしてやってくる。これについて、次のことがわかっている。<br>'+conds(['Pの次の日にQが来る','Rの次の日にSが来る','TとUは'+D6[v.x]+'曜日には来ない']);};
var G25=function(R){var a=R.shuffle(rg(0,5));return {x:a[0],y:a[1],z:R.int(0,5)};};
var I25=function(v){return 'Ⅰ　PQ（続けて）<br>Ⅱ　RS（続けて）<br>Ⅲ　'+D6[v.x]+'はT・U以外 → PQかRSのどちらかが'+D6[v.x]+'にかかる';};
T(6,'25-1',{x:2,y:5,z:1},G25,function(v){var ws=s25(v.x),set=uniq(ws.map(function(o){return o.indexOf('U');})),r=MS(D6,rg(0,5),set);if(!r)return null;
  return {q:Q25(v)+'<br>Uは何曜日に来るか。当てはまるものをすべて選びなさい。',c:r.c,a:r.a,inwh:'記号',inw:I25(v),fig:tbl(['','月','火','水','木','金','土'],nrow(ws,function(w){return w;})),calc:'PQ・RSの2つのかたまりを置き、空いた2日にT・Uを入れる（'+D6[v.x]+'は不可）<br>Uは '+set.map(function(x){return D6[x];}).join('・')};});
T(6,'25-2',{x:2,y:5,z:1},G25,function(v){var ws=s25(v.x).filter(function(o){return o[v.y]!=='T'&&o[v.y]!=='U';}),set=uniq(ws.map(function(o){return o[v.z];})),r=MS(P6,P6,set);if(!r)return null;
  return {q:Q25(v)+'<br>TとUが'+D6[v.y]+'曜日に来ない場合、'+D6[v.z]+'曜日に来るのは誰か。当てはまるものをすべて選びなさい。',c:r.c,a:r.a,inwh:'記号',inw:I25(v)+'<br>追加　'+D6[v.y]+'もT・U以外',fig:tbl(['','月','火','水','木','金','土'],nrow(ws,function(w){return w;})),calc:D6[v.x]+'と'+D6[v.y]+'にPQ・RSがかかる並びを書き出す<br>'+D6[v.z]+'曜日は '+set.sort().join('・')};});

var P5=['P','Q','R','S','T'];
function s26(k){return perms(P5).filter(function(o){var p=posOf(o);return p.Q===k-1&&p.P<p.R&&p.P<p.T&&o[4]!=='T';});}
var Q26=function(v){return 'P、Q、R、S、Tの5軒に品物を配達した。配達した順番について、次のことがわかっている。<br>'+conds(['Qには'+v.k+'番目に配達した','PにはR、Tより先に配達した','最後に配達された家はTではない']);};
var I26=function(v){return 'Ⅰ　Q＝'+v.k+'番目<br>Ⅱ　P → R、P → T<br>Ⅲ　5番目はTでない';};
T(6,'26-1',{k:3,m:4},function(R){return {k:R.int(2,4),m:R.int(1,5)};},function(v){var ws=s26(v.k);if(!ws.length)return null;var F=[function(o){return o.indexOf('Q')<o.indexOf('P');},function(o){return o.indexOf('T')>o.indexOf('Q');},function(o){return o[v.m-1]==='S';}];
  var pos=[0,1,2].filter(function(i){return ws.some(F[i]);});if(!pos.length||pos.length===3)return null;
  return {q:Q26(v)+'<br>次のうち、必ずしも誤りとはいえない推論をすべて選びなさい。',c:['Pより先にQに配達した','Tより先にQに配達した','Sには'+v.m+'番目に配達した'],a:pos,inwh:'記号',inw:I26(v)+'<br>「必ずしも誤りとはいえない」＝ 成り立つ場合が1つでもある',
   fig:tbl(['','1','2','3','4','5'],nrow(ws,function(w){return w;})),calc:'並びを全部書き出し、各推論が成り立つ並びが1つでもあるかを見る<br>'+[0,1,2].map(function(i){return AL[i]+SP+(pos.indexOf(i)>=0?'成り立つ並びがある':'どの並びでも成り立たない');}).join('<br>')};});
T(6,'26-2',{k:3,f:[['T',2],['R',4],['S',5]]},function(R){var k=R.int(2,4),f=R.shuffle(['P','R','S','T']).slice(0,3).map(function(x){return [x,R.int(1,5)];});return {k:k,f:f};},
 function(v){var ws=s26(v.k);if(!ws.length)return null;var F=v.f.map(function(f){return function(o){return o[f[1]-1]===f[0];};});if(F.some(function(f){return !ws.some(f);}))return null;
  var b=minInfo(ws,F,function(o){return o.join('');});if(!b||b==='none'||!b.length)return null;
  return {q:Q26(v)+'<br>最も少ない情報で、配達した順番すべてを確定するためには、次のうちどの情報が加わればよいか。必要な情報をすべて選びなさい。',c:v.f.map(function(f){return f[0]+'には'+f[1]+'番目に配達した';}),a:b,inwh:'記号',inw:I26(v),
   fig:tbl(['','1','2','3','4','5'],nrow(ws,function(w){return w;})),calc:'あり得る並び'+ws.length+'通りを書き出し、情報を1つ、2つと加えて1通りに決まる最も少ない組を探す<br>'+b.map(function(i){return AL[i];}).join('と')+'で1通り'};});

function s27(k){var o=[];perms([0,1,2,3]).forEach(function(ln){if(ln[3]!==3)return;perms([1,2,3,4]).forEach(function(rk){var who=[];ln.forEach(function(l,i){who[l]=i;});
  if(rk[1]!==rk[who[0]]+k)return;var rl=ln[2],nb=[rl-1,rl+1].filter(function(x){return x>=0&&x<=3;});if(!nb.some(function(x){return rk[who[x]]===1;}))return;o.push([ln,rk]);});});return o;}
var Q27=function(v){return 'P、Q、R、Sの4人がそれぞれ第1、第2、第3、第4のいずれかのレーンを走って100m競走をした。同着はなく、以下のことがわかっている。<br>'+conds(['Qの順位は第1レーンの走者の順位の'+v.k+'つ下','Rの隣のレーンの走者は1位','Sは第4レーンを走った']);};
var I27=function(v){return 'レーンと順位の表を作る<br>Ⅰ　Q＝（第1レーンの人）＋'+v.k+'位　→　Qは第1レーンではない<br>Ⅱ　Rの隣のレーンに1位<br>Ⅲ　S＝第4レーン';};
function f27(ws){return nrow(ws,function(w){var o=[];w[0].forEach(function(l,i){o[l]='PQRS'[i]+w[1][i];});return o;});}
var G27=function(R){return {k:R.int(1,2),r1:R.int(1,3),q:R.int(2,4)};};
T(6,'27-1',{k:2,r1:1,q:3},G27,function(v){var ws=s27(v.k).filter(function(w){return w[0][2]===v.r1-1;}),set=uniq(ws.map(function(w){return w[1][3];})),r=MS(ordLab(4,'位'),[1,2,3,4],set);if(!r||!ws.length)return null;
  return {q:Q27(v)+'<br>Rが第'+v.r1+'レーンを走ったとき、Sの順位として可能性があるものをすべて選びなさい。',c:r.c,a:r.a,inwh:'表',inw:I27(v),fig:tbl(['','第1','第2','第3','第4'],f27(ws)),calc:'Rを第'+v.r1+'レーン、Sを第4レーンに置き、残りのレーンにP・Q（Qは第1以外）を入れて順位を当てはめる<br>Sは '+set.sort().join('位、')+'位'};});
T(6,'27-2',{k:2,r1:1,q:3},G27,function(v){var ws=s27(v.k).filter(function(w){return w[1][1]===v.q;}),set=uniq(ws.map(function(w){return w[1][2];})),r=MS(ordLab(4,'位'),[1,2,3,4],set);if(!r||!ws.length)return null;
  return {q:Q27(v)+'<br>Qが'+v.q+'位のとき、Rの順位として可能性があるものをすべて選びなさい。',c:r.c,a:r.a,inwh:'表',inw:I27(v),fig:tbl(['','第1','第2','第3','第4'],f27(ws)),calc:'Q＝'+v.q+'位なので第1レーンの人は'+(v.q-v.k)+'位。Rの隣に1位が来るようにレーンを決める<br>Rは '+set.sort().join('位、')+'位'};});

var W28=prod([[1,2,3],[1,2,3],[1,2,3],[1,2,3]]).filter(function(g){return g[0]>g[1]&&g[2]>g[3]&&g[0]!==g[2];});
function cnt28(g,y){return g.filter(function(x){return x===y;}).length;}
function ev28(s,g){if(s[0]==='gt')return cnt28(g,s[1])>cnt28(g,s[2]);return [1,2,3].every(function(y){return y===s[1]||cnt28(g,s[1])>cnt28(g,y);});}
function tx28(s){return '4人のうち、'+(s[0]==='gt'?s[1]+'年生は'+s[2]+'年生'+(s[2]===2&&s[1]===3?'よりも':'より')+'人数が多い':s[1]+'年生は最も人数が多い');}
var Q28='P、Q、R、Sの4人が同じ中学校に通っている。4人の学年について、以下のことがわかっている。<br>'+conds(['PはQよりも上の学年である','RはSよりも上の学年である','PとRは同じ学年ではない']);
var I28='学年を1〜3とする<br>Ⅰ　P ＞ Q<br>Ⅱ　R ＞ S<br>Ⅲ　P ≠ R　→　PとRは2年と3年（どちらかが3年）';
T(6,'28-1',{s:[['gt',1,2],['max',2],['gt',3,2]]},function(R){var pool=[];[1,2,3].forEach(function(a){[1,2,3].forEach(function(b){if(a!==b)pool.push(['gt',a,b]);});pool.push(['max',a]);});return {s:R.shuffle(pool).slice(0,3)};},
 function(v){var nf=[0,1,2].filter(function(i){return !W28.some(function(g){return ev28(v.s[i],g);});});if(!nf.length||nf.length===3)return null;
  return {q:Q28+'<br>次のうち、確実に間違っている推論をすべて選びなさい。',c:v.s.map(tx28),a:nf,inwh:'表',inw:I28+'<br>「確実に間違っている」＝ 成り立つ場合が1つもない',fig:tbl(['','P','Q','R','S'],nrow(W28,function(g){return g.map(String);})),
   calc:'あり得る学年の組'+W28.length+'通りを書き出し、各推論が成り立つ組があるかを見る<br>'+[0,1,2].map(function(i){return AL[i]+SP+(nf.indexOf(i)>=0?'成り立つ組がない　→　確実に間違い':'成り立つ組がある');}).join('<br>')};});
T(6,'28-2',{f:[['P',2],['Q',2],['S',1]]},function(R){return {f:R.shuffle(['P','Q','R','S']).slice(0,3).map(function(x){return [x,R.int(1,3)];})};},
 function(v){var F=v.f.map(function(f){return function(g){return g['PQRS'.indexOf(f[0])]===f[1];};});if(F.some(function(f){return !W28.some(f);}))return null;
  var b=minInfo(W28,F,function(g){return g.join();});if(b===null||(b!=='none'&&!b.length))return null;var a=b==='none'?[3]:b;
  return {q:Q28+'<br>最も少ない情報で4人の学年を確定するには、Ⅰ〜Ⅲのほか、次のどの情報が加わればよいか。必要な情報をすべて選びなさい。',c:v.f.map(function(f){return f[0]+'は'+f[1]+'年生である';}).concat(['A、B、Cのどの情報が加わっても確定できない']),a:a,inwh:'表',inw:I28,
   fig:tbl(['','P','Q','R','S'],nrow(W28,function(g){return g.map(String);})),calc:'あり得る組'+W28.length+'通りに、情報を1つ、2つと加えて1通りに決まるかを見る<br>'+(b==='none'?'どれを加えても1通りに決まらない':b.map(function(i){return AL[i];}).join('と')+'で1通りに決まる')};});

var W29=[];perms([0,1,2,3]).forEach(function(h){perms([0,1,2,3]).forEach(function(a){var P=0,Q=1,Rr=2,S=3;if(!(h[P]<h[S]))return;if(!(a[S]<a[Rr]&&a[Rr]<a[Q]))return;var t=h.indexOf(0);if(a[t]!==3)return;W29.push([h,a]);});});
var Q29='身長も年齢も異なるP、Q、R、Sの4人について次のことがわかっている。<br>'+conds(['PはSよりも身長が高い','SはRよりも年上で、RはQよりも年上である','4人の中で、身長が最も高い者が最年少である']);
var I29='身長の順と年齢の順を2本書く<br>Ⅰ　身長 P → S（高い方を左）<br>Ⅱ　年齢 S → R → Q（年上を左）<br>Ⅲ　身長1位＝最年少';
var HN=['最も高い','2番目に高い','2番目に低い','最も低い'];
function f29(ws){return nrow(ws,function(w){var hs=[],as=[];w[0].forEach(function(x,i){hs[x]='PQRS'[i];});w[1].forEach(function(x,i){as[x]='PQRS'[i];});return [hs.join(''),as.join('')];});}
T(6,'29-1',{x:'R',k:3},function(R){return {x:R.pick(['Q','R']),k:R.int(2,3)};},function(v){var xi='PQRS'.indexOf(v.x),ws=W29.filter(function(w){return w[1][0]<w[1][xi];}),set=uniq(ws.map(function(w){return 'PQRS'[w[0].indexOf(v.k)];})),r=MS(['P','Q','R','S'],['P','Q','R','S'],set);if(!r)return null;
  return {q:Q29+'<br>Pが'+v.x+'より年上のとき、身長が'+HN[v.k]+'人は誰か。当てはまるものをすべて選びなさい。',c:r.c,a:r.a,inwh:'2つの順序',inw:I29+'<br>追加　年齢 P → '+v.x,fig:tbl(['','身長（高→低）','年齢（上→下）'],f29(ws)),calc:'最年少（年齢の右端）が身長1位。年齢の並びを決めてから身長を当てはめる<br>身長が'+HN[v.k]+'のは '+set.sort().join('・')};});
T(6,'29-2',{k:1},function(R){return {k:R.int(1,2)};},function(v){var ws=W29.filter(function(w){return w[1][w[0].indexOf(3)]===0;}),set=uniq(ws.map(function(w){return 'PQRS'[w[0].indexOf(v.k)];})),r=MS(['P','Q','R','S'],['P','Q','R','S'],set);if(!r)return null;
  return {q:Q29+'<br>身長が最も低い者が最年長のとき、'+(v.k+1)+'番目に身長が高い人は誰か。当てはまるものをすべて選びなさい。',c:r.c,a:r.a,inwh:'2つの順序',inw:I29+'<br>追加　身長4位＝最年長',fig:tbl(['','身長（高→低）','年齢（上→下）'],f29(ws)),calc:'身長の1位（最年少）と4位（最年長）を決め、残りの2人を間に入れる<br>'+(v.k+1)+'番目は '+set.sort().join('・')};});

var W30=perms(P5).filter(function(o){var p=posOf(o);return p.P===1&&p.Q<p.T&&p.T%2===0;});
function hit30(o,x){return o.indexOf(x)%2===1;}
function ev30(s,o){if(s[0]==='pos')return o[s[2]-1]===s[1];return hit30(o,s[1])===!!s[2];}
function tx30(s){return s[0]==='pos'?s[1]+'は'+(s[3]?'最後':s[2]+'番目')+'に引いた':s[1]+'は'+(s[2]?'当たり':'はずれ')+'だった';}
var Q30='P、Q、R、S、Tの5人が、1回ずつくじを引いた。くじは当たり2本とはずれ3本で、当たり・はずれと引いた順番について、次のことがわかっている。なお、引いたくじは戻さないものとする。<br>'+conds(['はずれは連続しない','最初に当たりを引いたのはPだった','QはTよりも先に引き、Tははずれだった']);
var I30='Ⅰ　はずれ3本が続かない　→　×○×○× の1通り<br>Ⅱ　最初の当たり（2番目）＝P<br>Ⅲ　Q → T、Tは×（1・3・5番目）';
T(6,'30-1',{s:[['pos','R',2],['hit','S',0],['pos','T',4]]},function(R){var s=R.shuffle(['Q','R','S','T']).slice(0,3).map(function(x){return R.int(0,1)?['pos',x,R.int(1,5)]:['hit',x,R.int(0,1)];});return {s:s};},
 function(v){var ok=[0,1,2].filter(function(i){return W30.some(function(o){return ev30(v.s[i],o);});});if(!ok.length||ok.length===3)return null;
  return {q:Q30+'<br>次のうち、必ずしも誤りとはいえない推論をすべて選びなさい。',c:v.s.map(tx30),a:ok,inwh:'記号',inw:I30,fig:tbl(['','1×','2○','3×','4○','5×'],nrow(W30,function(o){return o;})),
   calc:'あり得る並び'+W30.length+'通りを書き出す<br>'+[0,1,2].map(function(i){return AL[i]+SP+(ok.indexOf(i)>=0?'成り立つ並びがある':'どの並びでも成り立たない');}).join('<br>')};});
T(6,'30-2',{f:[['pos','Q',1],['pos','T',5,1],['pos','S',5]]},function(R){return {f:R.shuffle(['Q','R','S','T']).slice(0,3).map(function(x){var n=R.int(1,5);return ['pos',x,n,n===5&&R.int(0,1)?1:0];})};},
 function(v){var F=v.f.map(function(s){return function(o){return ev30(s,o);};});if(F.some(function(f){return !W30.some(f);}))return null;var b=minInfo(W30,F,function(o){return o.join('');});if(b===null||(b!=='none'&&!b.length))return null;
  var r=K8([0,1,2].map(function(i){return b!=='none'&&b.indexOf(i)>=0;}),'ア、イ、ウのすべてが加わってもわからない');
  return {q:Q30+'<br>最も少ない情報で、全員のくじを引いた順番と当たりはずれを確定するには、Ⅰ〜Ⅲのほか、次のア、イ、ウのうちどれが加わればよいか。AからHの中で1つ選びなさい。<br>'+kas(v.f.map(tx30)),c:r.c,a:r.a,inwh:'記号',inw:I30,
   fig:tbl(['','1×','2○','3×','4○','5×'],nrow(W30,function(o){return o;})),calc:'あり得る並び'+W30.length+'通りに、ア・イ・ウを1つ、2つと加えて1通りに決まるかを見る<br>'+(b==='none'?'全部加えても決まらない':b.map(function(i){return KA[i];}).join('と')+'で1通りに決まる')};});
/* ===== 推論【内訳】問31〜44 ===== */
var DS=['京都','北海道','アメリカ','イタリア','フランス'];
var W31=[];prod([[0,1],[0,1],[0,1],[0,1],[0,1]]).forEach(function(g){if(g[0]+g[1]+g[2]+g[3]+g[4]!==3)return;perms([0,1,2,3,4]).forEach(function(d){
 if(d[0]>1||d[1]>1)return;if(d[2]<3)return;if([0,1,2,3,4].filter(function(i){return g[i]&&d[i]>=2;}).length!==2)return;W31.push([g,d]);});});
T(6,'31',{g:0,d:4},function(R){return {g:R.int(0,1),d:R.int(2,4)};},function(v){var ws=W31.filter(function(w){return w[0][3]===v.g&&w[1][3]===v.d;});if(!ws.length)return null;
  var F=[function(w){return w[0][0]===1;},function(w){return w[0][2]===1;},function(w){return w[1][4]===2;}],must=[0,1,2].filter(function(i){return ws.every(F[i]);});if(!must.length||must.length===3)return null;
  return {q:'男性3人、女性2人からなるP、Q、R、S、Tの日本人5人が、それぞれ京都、北海道、アメリカ、イタリア、フランスの5カ所に旅行した。これについて、次のことがわかっている。<br>'+conds(['男性のうち2人が海外旅行をした','P、Qは国内旅行をした','Rはヨーロッパへ行った'])+'<br>Sは'+(v.g?'男性':'女性')+'で'+DS[v.d]+'へ行ったとき、次の推論のうち、必ず正しいといえるものをすべて選びなさい。',
   c:['Pは男性である','Rは男性である','Tはアメリカへ行った'],a:must,inwh:'表',inw:'Ⅱ　P・Qが国内（京都・北海道）→ R・S・Tが海外<br>Ⅰ　海外の3人のうち男性は2人<br>Ⅲ　R＝イタリアかフランス',
   fig:tbl(['','P','Q','R','S','T'],nrow(ws,function(w){return w[0].map(function(g,i){return (g?'男':'女')+DS[w[1][i]].slice(0,2);});})),calc:'R・S・Tの海外3人のうち男性2人、Sの性別と行き先を入れて書き出す<br>'+[0,1,2].map(function(i){return AL[i]+SP+(must.indexOf(i)>=0?'どの場合も成り立つ':'成り立たない場合がある');}).join('<br>')};});

function W32(N,m){var o=[];for(var S=m;S<N;S++)for(var Rr=S+1;Rr<N;Rr++)for(var Q=Rr+1;Q<N;Q++){var P=N-Q-Rr-S;if(P<=Q)break;o.push([P,Q,Rr,S]);}return o;}
var C32={};function w32(N,m){var k=N+'_'+m;return C32[k]||(C32[k]=W32(N,m));}
T(6,'32',{N:160,m:10,s:[[0,70,3,30],[1,60,2,29],[2,49,3,10]]},function(R){var N=R.pick([100,120,140,160,180]),m=R.pick([5,10]),ws=w32(N,m),s=[];
  for(var t=0;t<3;t++){var xy=R.shuffle([0,1,2,3]).slice(0,2).sort(),w=R.pick(ws),a=w[xy[0]],b=w[xy[1]]+(R.int(0,1)?0:R.pick([-1,1,-2,2]));s.push([xy[0],a,xy[1],b]);}return {N:N,m:m,s:s};},
 function(v){var ws=w32(v.N,v.m),pos=v.s.map(function(s){return ws.some(function(w){return w[s[0]]===s[1]&&w[s[2]]===s[3];});});
  if(v.s.some(function(s){return !ws.some(function(w){return w[s[0]]===s[1];});}))return null;var r=K8(pos,'ア、イ、ウのいずれも必ず誤り');
  return {q:'アンケートで、'+v.N+'人の学生にサッカー選手P、Q、R、Sの4人の中で最も好きな選手1名に投票してもらったところ、次の結果となった。<br>'+conds(['投票数は、多い順にP、Q、R、Sという結果になった','どの選手にも'+v.m+'票以上入り、無回答はなかった'])+'<br>必ずしも誤りとはいえない推論はどれか。AからHの中から1つ選びなさい。<br>'+kas(v.s.map(function(s){return 'PQRS'[s[0]]+'選手への投票数が'+s[1]+'票のとき、'+'PQRS'[s[2]]+'選手への投票数は'+s[3]+'票である';})),
   c:r.c,a:r.a,inwh:'式',inw:'P ＞ Q ＞ R ＞ S ≧ '+v.m+'<br>P＋Q＋R＋S＝'+v.N+'<br>「必ずしも誤りとはいえない」＝ 成り立つ例が1つでもある',
   calc:v.s.map(function(s,i){var ex=ws.find(function(w){return w[s[0]]===s[1]&&w[s[2]]===s[3];});return KA[i]+SP+(ex?'例 P'+ex[0]+'・Q'+ex[1]+'・R'+ex[2]+'・S'+ex[3]+' で成り立つ':'残りの票を大小の順に分けられない　→　必ず誤り');}).join('<br>')};});

function W33(v){var o=[];for(var r=1;r<=v.N;r++)for(var w=1;w<=v.N;w++)for(var y=1;y<=v.N;y++){var g=v.N-r-w-y;if(g<1)continue;var a=[r,w,y,g];if(uniq(a).length<4)continue;
 if(r<v.r)continue;if(!(r>w&&r>y&&r>g))continue;if(!(w<y&&w<g))continue;if([w,y,g].filter(function(x){return x>=v.k;}).length<2)continue;o.push(a);}return o;}
T(6,'33',{N:20,k:3,r:7,a:1,b:10,c:2,d:3},function(R){var v={N:R.int(18,23),k:R.int(2,3),r:R.int(6,8)};var ws=W33(v);if(!ws.length)return null;var w=R.pick(ws);v.a=R.int(1,3);v.b=w[0];v.c=R.int(0,1)?w[1]:w[1]+1;v.d=R.int(1,4);return v;},
 function(v){var ws=W33(v);if(!ws.length)return null;var A=[function(w){return w.every(function(x){return x%2;});},function(w){return w[0]===v.b;},function(){return true;}],C=[function(w){return w[1]===v.a;},function(w){return w[1]===v.c;},function(w){return w[1]<=v.d;}];
  if(A.some(function(f){return !ws.some(f);}))return null;var mt=[0,1,2].map(function(i){return ws.every(function(w){return !A[i](w)||C[i](w);});}),r=K8(mt,'ア、イ、ウのいずれも必ず正しいとはいえない');
  return {q:'赤、白、黄、緑の4種類の玉が合わせて'+v.N+'個ある。これについて、次のことがわかっている。なお、4種類の玉はすべて違う個数で、0個のものはないものとする。<br>'+conds(['最初に'+2*v.k+'個取り出したところ、赤玉以外の2色の玉が'+v.k+'個ずつ取れた','続けて'+v.r+'個取り出したところ、すべて赤玉だった','一番多い玉の色は赤、一番少ない玉の色は白だった'])+'<br>必ず正しいといえるものはどれか。AからHの中から1つ選びなさい。<br>'+kas(['すべてが奇数個のとき、白玉は'+v.a+'個である','赤玉が'+v.b+'個ならば、白玉は'+v.c+'個である','白玉は'+v.d+'個以下である']),
   c:r.c,a:r.a,inwh:'表',inw:'赤 ≧ '+v.r+'、白以外の2色（黄・緑）は'+v.k+'個以上<br>赤 ＞ 黄・緑 ＞ 白、合計'+v.N+'個、すべて違う個数',
   fig:tbl(['','赤','白','黄','緑'],nrow(ws,function(w){return w.map(String);})),calc:'赤の個数を'+v.r+'個から順に決め、残りを白＜黄・緑で分けて書き出す<br>'+[0,1,2].map(function(i){return KA[i]+SP+(mt[i]?'当てはまる場合はすべて成り立つ':'成り立たない場合がある');}).join('<br>')};});

var LG=['フランス語','ドイツ語','中国語','スペイン語'];
function mn34(v,s){var t=0;s.forEach(function(i){t+=v.n[i];});return Math.max(0,t-(s.length-1)*v.N);}
T(7,'34',{N:40,n:[32,29,20,18],s:[[[1,3],7],[[0,2,3],1],[[0,1,2],1]]},function(R){var N=R.pick([30,40,50]),n=[0,1,2,3].map(function(){return R.int(Math.round(N*0.4),N-2);});var v={N:N,n:n,s:[]};
  var subs=R.shuffle([[0,1],[0,2],[0,3],[1,2],[1,3],[2,3],[0,1,2],[0,1,3],[0,2,3],[1,2,3]]).slice(0,3).map(function(s){return s.sort();});subs.forEach(function(s){var m=mn34(v,s);v.s.push([s,Math.max(1,m+R.pick([0,0,1]))]);});return v;},
 function(v){var mt=v.s.map(function(s){return mn34(v,s[0])>=s[1];}),r=K8(mt,'ア、イ、ウのいずれも必ず正しいとはいえない');
  return {q:'ある空港で'+v.N+'人にアンケート調査を行ったところ、'+LG.map(function(l,i){return l+'を話せる人は'+v.n[i]+'人';}).join('、')+'という結果が出た。ア、イ、ウのうち、必ず正しいといえるものはどれか。AからHの中で1つ選びなさい。<br>'+kas(v.s.map(function(s){return s[0].map(function(i){return LG[i].replace('語','');}).join('語と')+'語の'+s[0].length+'カ国語を話せる人は、少なくとも'+s[1]+'人いる';})),
   c:r.c,a:r.a,inwh:'式',inw:'重なりがいちばん少なくなるのは、話せない人をできるだけ別々の人にしたとき<br>k個の言語を全部話せる人の最少人数 ＝ 人数の合計 −（k−1）×'+v.N,
   calc:v.s.map(function(s,i){var t=0;s[0].forEach(function(j){t+=v.n[j];});return KA[i]+SP+s[0].map(function(j){return v.n[j];}).join('＋')+' − '+(s[0].length-1)+'×'+v.N+' ＝ '+(t-(s[0].length-1)*v.N)+'　→　最少'+mn34(v,s[0])+'人　'+(mt[i]?'正しい':'必ずとはいえない');}).join('<br>')};});

var B35=[1,2,3,4,1,2,3,4],W35=[];(function rec(st,p){if(p.length===4){W35.push(p.slice());return;}for(var i=st;i<8;i++){p.push(i);rec(i+1,p);p.pop();}})(0,[]);
function sm(a){return a.reduce(function(t,x){return t+x;},0);}
var X35=W35.map(function(p){var P=p.map(function(i){return B35[i];}),Q=[0,1,2,3,4,5,6,7].filter(function(i){return p.indexOf(i)<0;}).map(function(i){return B35[i];});return [P,Q];});
T(6,'35',{a:10,b:9,c:7},function(R){return {a:R.int(8,12),b:R.int(7,10),c:R.int(6,9)};},function(v){var A=[function(x){return x[0].indexOf(4)<0;},function(x){return sm(x[0])<=v.b;},function(x){return sm(x[0])<=v.c;}],C=[function(x){return sm(x[1])>v.a;},function(x){return x[0].filter(function(n){return n===1;}).length===2;},function(x){return x[1].filter(function(n){return n===4;}).length===2;}];
  var mt=[0,1,2].map(function(i){return X35.every(function(x){return !A[i](x)||C[i](x);});}),r=K8(mt,'ア、イ、ウのいずれも必ず正しいとはいえない');
  return {q:'1、2、3、4の番号がついた赤玉と、同じく1、2、3、4の番号がついた白玉の合計8個の玉がある。これをよくまぜて、4個ずつ2つの袋PとQに分けた。必ず正しいといえるものはどれか。AからHの中から1つ選びなさい。<br>'+kas(['Pに4が入っていないとき、Qの玉の番号の合計は'+v.a+'より大きい','Pの玉の番号の合計が'+v.b+'以下のとき、Pの中には1が2個入っている','Pの玉の番号の合計が'+v.c+'以下のとき、Qの中には4が2個入っている']),
   c:r.c,a:r.a,inwh:'式',inw:'8個の合計は (1＋2＋3＋4)×2＝20<br>Qの合計 ＝ 20 − Pの合計',
   calc:[0,1,2].map(function(i){var bad=X35.find(function(x){return A[i](x)&&!C[i](x);});return KA[i]+SP+(mt[i]?'当てはまる分け方はすべて成り立つ':'反例 P＝'+bad[0].join('・')+'（Q＝'+bad[1].join('・')+'）');}).join('<br>')};});

var TC=['黄色','白','赤'],CB=[[0,0],[1,1],[2,2],[0,1],[0,2],[1,2]],CBL=['黄色2本','白2本','赤2本','黄色と白','黄色と赤','白と赤'];
function t36(n){var i4=n.indexOf(4),o=[0,1,2].filter(function(i){return i!==i4;});return TC[i4]+'が4本、'+TC[o[0]]+'と'+TC[o[1]]+'がそれぞれ3本ずつ';}
T(6,'36',{n:[4,3,3],s:3},function(R){return {n:R.shuffle([4,3,3]),s:R.int(0,5)};},function(v){var set=[];prod([rg(0,5),rg(0,5),rg(0,5)]).forEach(function(x){var P=x[0],Rr=x[1],Tt=x[2];if(Rr>2)return;var use=[0,0,0];[P,P,Rr,v.s,Tt].forEach(function(k){use[CB[k][0]]++;use[CB[k][1]]++;});if(use.join()===v.n.join())set.push(Tt);});
  set=uniq(set);var r=MS(CBL,rg(0,5),set);if(!r)return null;
  return {q:t36(v.n)+'、計10本あるチューリップをP、Q、R、S、Tの5人で1人2本ずつ分けた。PとQの色の組み合わせは同じで、Rは2本とも同じ色だった。Sのチューリップが'+CBL[v.s]+'だったとき、Tが持っている2本の色は何か。当てはまるものをすべて選びなさい。',
   c:r.c,a:r.a,inwh:'表',inw:'P＝Q（同じ組）なので、P・Qで同じ色が2本ずつ使われる<br>R＝同じ色2本<br>S＝'+CBL[v.s],calc:'Sの分を引くと残りは '+TC.map(function(t,i){return t+(v.n[i]-CB[v.s].filter(function(k){return k===i;}).length)+'本';}).join('・')+'<br>P・Q（同じ組×2）とR（同じ色2本）を引いて、残りの2本がT<br>Tは '+set.map(function(k){return CBL[k];}).join('、')};});

function o37(R,ans,n){var s=[ans];for(var t=0;t<50&&s.length<n;t++){var x=ans+R.pick([-10,-8,-6,-5,-4,-2,-1,1,2,4,5,8,10,15]);if(x>0&&s.indexOf(x)<0)s.push(x);}return s.sort(function(a,b){return a-b;});}
var Q37=function(v){return '参加定員'+v.c+'人ずつのセミナーPとセミナーQを別の日に開いたところ、両方とも満席となった。各セミナーの参加者の名簿を名寄せ（同じ人をまとめて集計）すると合計'+v.u+'名で、そのうち女性は'+v.w+'名だった。';};
var G37=function(R){var c=R.pick([30,40,50,60]),u=c+R.int(2,8)*5,ex=u-c,w=R.int(Math.round(u*0.4),Math.round(u*0.7)),wp=w-R.int(Math.max(1,ex-14),ex-1);if(wp<1||wp>c)return null;var v={c:c,u:u,w:w,wp:wp};v.o1=o37(R,ex,6);v.o2=o37(R,ex-(w-wp),6);return v;};
T(6,'37-1',{c:50,u:70,w:42,wp:28,o1:[5,10,15,20,30,35],o2:[4,5,6,8,10,14]},G37,function(v){var ans=v.u-v.c;if(v.o1.indexOf(ans)<0)return null;
  return {q:Q37(v)+'<br>セミナーPだけに参加した人は何人いたか。',c:v.o1.map(function(x){return x+'人';}),a:v.o1.indexOf(ans),inwh:'表',inw:'P'+v.c+'人＋Q'+v.c+'人＝'+2*v.c+'人分の名前のうち、両方に出た人は2回数えられている',
   fig:tbl(['','Pだけ','両方','Qだけ','計'],[['人数','!?',(2*v.c-v.u)+'',(v.u-v.c)+'',v.u+'']]),calc:'両方 ＝ '+v.c+'＋'+v.c+'−'+v.u+' ＝ '+(2*v.c-v.u)+'人<br>Pだけ ＝ '+v.c+'−'+(2*v.c-v.u)+' ＝ '+ans+'人'};});
T(6,'37-2',{c:50,u:70,w:42,wp:28,o1:[5,10,15,20,30,35],o2:[4,5,6,8,10,14]},G37,function(v){var qo=v.u-v.c,wq=v.w-v.wp,ans=qo-wq;if(ans<1||v.o2.indexOf(ans)<0)return null;
  return {q:Q37(v)+'<br>女性のうち'+v.wp+'人がセミナーPに参加していた。セミナーQだけに参加した男性の数は何人か。',c:v.o2.map(function(x){return x+'人';}),a:v.o2.indexOf(ans),inwh:'表',inw:'Pに出なかった人 ＝ Qだけ<br>Qだけの女性 ＝ 女性全体 − Pに出た女性',
   fig:tbl(['','Pに参加','Qだけ','計'],[['全体',v.c+'',qo+'',v.u+''],['女性',v.wp+'',wq+'',v.w+''],['男性','','!?','']]),calc:'Qだけ ＝ '+v.u+'−'+v.c+' ＝ '+qo+'人<br>Qだけの女性 ＝ '+v.w+'−'+v.wp+' ＝ '+wq+'人<br>Qだけの男性 ＝ '+qo+'−'+wq+' ＝ '+ans+'人'};});

var BT=['和食','洋食','中華'],P6L=['P','Q','R','S','T','U'];
var W38=prod([[0,1,2],[0,1,2],[0,1,2],[0,1,2],[0,1,2],[0,1,2]]).filter(function(b){for(var i=1;i<6;i++)if(b[i]===b[i-1])return false;return true;});
var Q38=function(v){return 'P、Q、R、S、T、Uの順番で、6人が弁当を1個ずつ買った。弁当には、和食、洋食、中華の3種類があり、次のことがわかっている。<br>'+conds(['Q、R、S、T、Uは、直前の人と同じ種類の弁当は買わなかった',P6L[v.x[0]]+'と'+P6L[v.x[1]]+'は異なる種類の弁当を買った']);};
var G38=function(R){var x=R.pick([[3,5],[2,4],[1,3],[0,2],[2,5],[1,4]]),y=R.pick([[2,4],[1,3],[3,5],[0,2],[1,4]]);return JSON.stringify(x)===JSON.stringify(y)?null:{x:x,t0:R.int(0,2),t1:R.int(0,2),y:y,z:R.int(0,2)};};
T(6,'38-1',{x:[3,5],t0:0,t1:1,y:[2,4],z:1},G38,function(v){var ws=W38.filter(function(b){return b[v.x[0]]!==b[v.x[1]]&&b[0]===v.t0;}),set=uniq(ws.map(function(b){return b.filter(function(t){return t===v.t1;}).length;})),r=MS(ordLab(5,'人'),[1,2,3,4,5],set);if(!r)return null;
  return {q:Q38(v)+'<br>Pが'+BT[v.t0]+'の場合、'+BT[v.t1]+'は何人か。当てはまるものをすべて選びなさい。',c:r.c,a:r.a,inwh:'表',inw:'となり同士は違う種類<br>'+P6L[v.x[0]]+'≠'+P6L[v.x[1]]+'<br>P＝'+BT[v.t0],
   fig:tbl(['','P','Q','R','S','T','U'],nrow(ws,function(b){return b.map(function(t){return BT[t].slice(0,1);});})),calc:'Pから順に、直前と違う種類を選んで書き出す（'+ws.length+'通り）<br>'+BT[v.t1]+'の人数は '+set.sort().join('人、')+'人'};});
T(6,'38-2',{x:[3,5],t0:0,t1:1,y:[2,4],z:1},G38,function(v){var ws=W38.filter(function(b){return b[v.x[0]]!==b[v.x[1]]&&b[v.y[0]]!==b[v.y[1]];});var others=rg(0,5).filter(function(i){return i!==v.z;});
  var set=uniq([].concat.apply([],ws.map(function(b){return others.filter(function(i){return b[i]===b[v.z];});}))),r=MS(others.map(function(i){return P6L[i];}),others,set);if(!r)return null;
  return {q:Q38(v)+'<br>'+P6L[v.y[0]]+'と'+P6L[v.y[1]]+'が異なる種類の弁当を買った場合、'+P6L[v.z]+'と同じ種類の弁当を買ったのは誰か。当てはまるものをすべて選びなさい。',c:r.c,a:r.a,inwh:'表',inw:'となり同士は違う種類<br>'+P6L[v.x[0]]+'≠'+P6L[v.x[1]]+'、'+P6L[v.y[0]]+'≠'+P6L[v.y[1]],
   fig:tbl(['','P','Q','R','S','T','U'],nrow(ws.filter(function(b){return b[0]===0;}),function(b){return b.map(function(t){return BT[t].slice(0,1);});})),calc:'種類の名前は入れかえても同じなので、Pを和食として書き出す<br>'+P6L[v.z]+'と同じになり得るのは '+set.map(function(i){return P6L[i];}).join('・')};});

T(6,'39',{T:15,m:2,n:12},function(R){var t=R.int(11,16);return {T:t,m:R.int(1,3),n:R.int(4,t-2)};},function(v){var ws=prod([[1,2,3],[v.m],[1,2,3],[1,2,3],[1,2,3],[1,2,3]]).filter(function(a){return sm(a)===v.T;});if(!ws.length)return null;
  var set=uniq(ws.map(function(a){var c=0;for(var i=0;i<6;i++){c+=a[i];if(c>=v.n)return i;}})),r=MS(rg(4,9).map(function(m){return m+'月';}),rg(0,5),set);if(!r)return null;
  return {q:'ある公民館では、4月から9月にかけて毎月1回は講演会がある。ある年の講演会について、次のことがわかっている。<br>'+conds(['5月には'+v.m+'回講演会があった','講演会は1か月に3回までしか行われなかった','講演会は全部で'+v.T+'回あった'])+'<br>'+v.n+'回目の講演会が行われたのは何月か。当てはまるものをすべて選びなさい。',
   c:r.c,a:r.a,inwh:'表',inw:'各月1〜3回、5月＝'+v.m+'回、合計'+v.T+'回<br>'+v.n+'回目がいちばん早い月：前の月にできるだけ多く／いちばん遅い月：前の月をできるだけ少なく',
   fig:tbl(['','4月','5月','6月','7月','8月','9月'],[['多く先に'].concat([3,v.m,3,3,3,3].map(String)),['少なく先に'].concat([1,v.m,1,1,1,1].map(String))]),calc:v.n+'回目が入り得る月は '+set.map(function(i){return (i+4)+'月';}).join('、')};});

var DR=['紅茶','コーヒー','ジュース'],W40=uniq(perms([0,0,1,1,2]));
var Q40='P、Q、R、S、Tの5人が喫茶店で、紅茶2杯、コーヒー2杯、ジュース1杯を注文した。PとQは違うもの、またQとRも違うものを注文した。1人が1杯ずつ注文したとき、次の各問いに答えなさい。';
function f40(ws){return nrow(ws,function(w){return w.map(function(d){return DR[d].slice(0,1);});});}
T(6,'40-1',{p:[0,2]},function(R){return {p:R.pick([[0,2],[0,3],[1,3],[2,4],[3,4],[0,4],[1,4]])};},function(v){var ws=W40.filter(function(w){return w[0]!==w[1]&&w[1]!==w[2]&&w[v.p[0]]!==w[v.p[1]];}),set=uniq(ws.map(function(w){return w.indexOf(2);})),r=MS(P5,rg(0,4),set);if(!r)return null;
  return {q:Q40+'<br>'+P5[v.p[0]]+'と'+P5[v.p[1]]+'が違うものを注文したとき、ジュースを注文した可能性のある人をすべて選びなさい。',c:r.c,a:r.a,inwh:'表',inw:'P≠Q、Q≠R、'+P5[v.p[0]]+'≠'+P5[v.p[1]]+'<br>同じものは2杯まで（ジュースは1杯）',fig:tbl(['','P','Q','R','S','T'],f40(ws)),calc:'ジュースの人を1人ずつ決め、紅茶2・コーヒー2を条件に合うように分けられるかを見る<br>ジュースは '+set.map(function(i){return P5[i];}).join('・')};});
T(6,'40-2',{x:0,y:0},function(R){return {x:R.int(0,1),y:R.int(0,1)};},function(v){var ws=W40.filter(function(w){return w[0]!==w[1]&&w[1]!==w[2]&&w[1]===v.x&&w[4]!==v.y;}),set=uniq(ws.map(function(w){return w.indexOf(2);})),r=MS(P5,rg(0,4),set);if(!r||!ws.length)return null;
  return {q:Q40+'<br>Qが'+DR[v.x]+'、Tが'+DR[v.y]+'以外を注文したとき、ジュースを注文した可能性のある人をすべて選びなさい。',c:r.c,a:r.a,inwh:'表',inw:'Q＝'+DR[v.x]+'　→　P・Rは'+DR[v.x]+'以外<br>Tは'+DR[v.y]+'以外',fig:tbl(['','P','Q','R','S','T'],f40(ws)),calc:'Qを'+DR[v.x]+'にして、残りの4杯をP・R・S・Tに条件どおり分ける<br>ジュースは '+set.map(function(i){return P5[i];}).join('・')};});

var LN={P:2,Q:3,R:4,S:5};
T(6,'41',{f:'S',e:1,x:'P'},function(R){var f=R.pick(['P','Q','R','S']),x=R.pick(['P','Q','R','S'].filter(function(y){return y!==f;}));return {f:f,e:R.int(0,1),x:x};},function(v){
  var ws=perms(['P','Q','R','S']).filter(function(o){return v.e?o[3]===v.f:o[0]===v.f;}),st=ws.map(function(o){var d=1,s={};o.forEach(function(t){s[t]=d;d+=LN[t];});return s;});
  var lo=v.e?1:1+LN[v.f],hi=(v.e?14-LN[v.f]:14)-LN[v.x]+1,vals=rg(lo,hi),set=uniq(st.map(function(s){return s[v.x];})),r=MS(vals.map(function(d){return d+'日目';}),vals,set);if(!r)return null;
  var fd=v.e?(15-LN[v.f])+'日目〜14日目':'1日目〜'+LN[v.f]+'日目';
  return {q:'P、Q、R、Sの4チームが交代で14日間グラウンドを使用した。これについて、次のことがわかっている。'+v.f+'が'+fd+'に使用したとき、'+v.x+'が使用した初日はいつか。当てはまるものをすべて選びなさい。<br>'+conds(['Pは連続2日、Qは連続3日、Rは連続4日、Sは連続5日利用した','同時に使用した団体はなかった']),
   c:r.c,a:r.a,inwh:'表',inw:'2＋3＋4＋5＝14日なので、すき間なく4つのかたまりが並ぶ<br>'+v.f+'＝'+fd+'、残り3チームの並べ方は6通り',fig:tbl(['','1番目','2番目','3番目','4番目'],nrow(ws,function(o){return o.map(function(t,i){return t+st[ws.indexOf(o)][t]+'〜';});})),
   calc:'残り3チームの並べ方6通りで、'+v.x+'の初日＝前にあるチームの日数の合計＋1<br>'+v.x+'の初日は '+set.sort(function(a,b){return a-b;}).join('日目、')+'日目'};});

(function(){var W=[];prod([[0,1],[0,1],[0,1],[0,1],[0,1],[0,1]]).forEach(function(g){if(sm(g)!==3)return;if(g[0]===g[1]||g[2]!==g[3])return;
  var M=[0,1,2,3,4,5].filter(function(i){return g[i];}),F=[0,1,2,3,4,5].filter(function(i){return !g[i];});perms(F).forEach(function(pf){var pr={};M.forEach(function(m,k){pr[m]=pf[k];pr[pf[k]]=m;});if(pr[2]===4||pr[3]===4)return;W.push([g,pr]);});});
 var Q42='男性3人、女性3人のP、Q、R、S、T、Uがいる。この6人が異性同士でペアになって社交ダンスをする。これについて、次のことがわかっている。<br>'+conds(['PとQは異性','RとSは同性で、どちらもTとペアではない']);
 var I42='Ⅰ　P・Qは男女1人ずつ<br>Ⅱ　R・Sは同性、どちらもTの相手ではない<br>→ 残りのT・Uは、R・Sと反対の性別とは限らないので場合分け';
 var set1=uniq(W.map(function(w){return w[1][5];})),r1=MS(['P','Q','R','S','T'],[0,1,2,3,4],set1);
 put(6,{bk:'42-1',id:'bk42-1',q:Q42+'<br>Uとペアになり得るのは誰か。当てはまるものをすべて選びなさい。',c:r1.c,a:r1.a,inwh:'表',inw:I42,fig:tbl(['','P','Q','R','S','T','U'],nrow(W,function(w){return w[0].map(function(g,i){return (g?'男':'女')+'-'+P6L[w[1][i]];});})),calc:'R・Sを同性（男2人か女2人）にして、男女3人ずつになるようにP・Q・T・Uを決め、Tの相手がR・S以外になるペアを書き出す<br>Uの相手は '+set1.map(function(i){return P6L[i];}).join('・')});
 var who=[0,1,2,3,5].filter(function(i){return [0,1].every(function(tg){var ws=W.filter(function(w){return w[0][4]===tg;});return uniq(ws.map(function(w){return w[0][i];})).length===1;});}),r2=MS(['P','Q','R','S','U'],[0,1,2,3,5],who);
 put(6,{bk:'42-2',id:'bk42-2',q:Q42+'<br>Tの性別がわかると、性別がわかる人は誰か。当てはまるものをすべて選びなさい。',c:r2.c,a:r2.a,inwh:'表',inw:I42,fig:tbl(['','P','Q','R','S','T','U'],nrow(W,function(w){return w[0].map(function(g){return g?'男':'女';});})),calc:'Tの相手はR・S以外で異性 → R・SはTと同性。P・Qは男女1人ずつなので、R・S・Tの3人が同性なら残るUは反対の性別<br>わかるのは '+who.map(function(i){return P6L[i];}).join('・')});})();

var PL=['教室','廊下','階段'];
var W43=prod([[0,1,2],[0,1,2],[0,1,2],[0,1,2],[0,1,2],[0,1,2]]).filter(function(a){var c=[0,0,0];a.forEach(function(x){c[x]++;});return c[0]&&c[1]&&c[2]&&a[0]===a[1]&&c[a[2]]===1&&c[2]===2;});
var Q43='P、Q、R、S、T、Uの6人が教室、廊下、階段の3カ所を手分けして掃除した。このとき、次のことがわかっている。<br>'+conds(['PとQは同じ場所を掃除した','Rは1人で1カ所を掃除した','階段は2人で掃除した']);
var I43='Ⅰ　P＝Q<br>Ⅱ　Rは1人だけの場所<br>Ⅲ　階段＝2人　→　6人は 1人・2人・3人 に分かれる（階段が2人）';
function t43(s){return s[0]==='at'?P6L[s[1]]+'は'+PL[s[2]]+'を掃除した':s[0]==='eq'?P6L[s[1]]+'と'+P6L[s[2]]+'は同じ場所を掃除した':P6L[s[1]]+'と同じ場所を掃除した人はいない';}
function e43(s,a){var c=[0,0,0];a.forEach(function(x){c[x]++;});return s[0]==='at'?a[s[1]]===s[2]:s[0]==='eq'?a[s[1]]===a[s[2]]:c[a[s[1]]]===1;}
function f43(ws){return nrow(ws,function(a){return a.map(function(x){return PL[x].slice(0,1);});});}
T(6,'43-1',{s:[['at',2,0],['eq',3,4],['al',5]]},function(R){var s=[];for(var i=0;i<3;i++){var k=R.int(0,2),p=R.shuffle(rg(0,5));s.push(k===0?['at',p[0],R.int(0,2)]:k===1?['eq'].concat([p[0],p[1]].sort()):['al',p[0]]);}return {s:s};},
 function(v){var ok=[0,1,2].filter(function(i){return W43.some(function(a){return e43(v.s[i],a);});});if(!ok.length||ok.length===3||uniq(v.s.map(String)).length<3)return null;
  return {q:Q43+'<br>次のうち、必ずしも間違いとはいえないものをすべて選びなさい。',c:v.s.map(t43),a:ok,inwh:'表',inw:I43,fig:tbl(['','P','Q','R','S','T','U'],f43(W43)),calc:'あり得る分け方'+W43.length+'通りを書き出し、成り立つものが1つでもあるかを見る<br>'+[0,1,2].map(function(i){return AL[i]+SP+(ok.indexOf(i)>=0?'成り立つ分け方がある':'どの分け方でも成り立たない');}).join('<br>')};});
T(6,'43-2',{f:[[2,1],[3,0],[4,2]]},function(R){var p=R.shuffle(rg(0,5)).slice(0,3);return {f:p.map(function(x){return [x,R.int(0,2)];})};},
 function(v){var F=v.f.map(function(f){return function(a){return a[f[0]]===f[1];};});if(F.some(function(f){return !W43.some(f);}))return null;var b=minInfo(W43,F,function(a){return a.join();});if(!b||b==='none'||!b.length)return null;
  return {q:Q43+'<br>Ⅰ〜Ⅲの条件のほかに、少なくともどの条件が加われば、全員の掃除場所が決まるか。必要な条件をすべて選びなさい。',c:v.f.map(function(f){return P6L[f[0]]+'は'+PL[f[1]];}),a:b,inwh:'表',inw:I43,fig:tbl(['','P','Q','R','S','T','U'],f43(W43)),
   calc:'あり得る分け方'+W43.length+'通りに、条件を1つ、2つと加えて1通りに決まるかを見る<br>'+b.map(function(i){return AL[i];}).join('と')+'で1通りに決まる'};});

var IC=['抹茶','あずき','ミルク'],IS=[[0],[1],[2],[0,1],[0,2],[1,2]],ISL=['抹茶だけ','あずきだけ','ミルクだけ','抹茶とあずき','抹茶とミルク','あずきとミルク'];
var W44=prod([rg(0,5),rg(0,5),rg(0,5),rg(0,5)]).filter(function(x){var c=[0,0,0];x.forEach(function(k){IS[k].forEach(function(t){c[t]++;});});if(c.join()!=='1,2,3')return false;
 var P=IS[x[0]],Q=IS[x[1]],Rr=IS[x[2]],S=IS[x[3]];return P.some(function(t){return Q.indexOf(t)>=0;})&&!Rr.some(function(t){return S.indexOf(t)>=0;});});
var Q44='P、Q、R、Sの4人で、抹茶1本、あずき2本、ミルク3本、計6本のアイスを食べた。これについて、次のことがわかっている。<br>'+conds(['1人が食べた本数は、1本または2本だった','1人で同じ種類のアイスを2本食べた人はいなかった','PとQは少なくとも1本は同じ種類のアイスを食べた','RとSは同じ種類のアイスを食べなかった']);
var I44='4人の本数の合計6本 → 2本・2本・1本・1本 か 2本・2本・2本・0本（0本はない）→ 2人が2本、2人が1本<br>Ⅲ　PとQに共通の種類がある<br>Ⅳ　RとSに共通の種類はない';
function f44(ws){return nrow(ws,function(x){return x.map(function(k){return IS[k].map(function(t){return IC[t].slice(0,1);}).join('');});});}
T(6,'44-1',{t:1},function(R){return {t:R.int(0,2)};},function(v){var ws=W44.filter(function(x){return IS[x[0]].indexOf(v.t)>=0;}),set=uniq(ws.map(function(x){return x[1];})),r=MS(ISL,rg(0,5),set);if(!r)return null;
  return {q:Q44+'<br>Pが少なくとも'+IC[v.t]+'1本を食べたとき、Qが食べた可能性があるものをすべて選びなさい。',c:r.c,a:r.a,inwh:'表',inw:I44,fig:tbl(['','P','Q','R','S'],f44(ws)),calc:'Pに'+IC[v.t]+'を入れ、抹茶1・あずき2・ミルク3を条件どおり分ける<br>Qは '+set.map(function(k){return ISL[k];}).join('、')};});
T(6,'44-2',{p:2,n:2},function(R){return {p:R.int(2,3),n:R.int(1,2)};},function(v){var ws=W44.filter(function(x){return IS[x[v.p]].length===v.n;}),set=uniq(ws.map(function(x){return x[1];})),r=MS(ISL,rg(0,5),set);if(!r)return null;
  return {q:Q44+'<br>'+'PQRS'[v.p]+'が'+v.n+'本食べたとき、Qが食べた可能性があるものをすべて選びなさい。',c:r.c,a:r.a,inwh:'表',inw:I44,fig:tbl(['','P','Q','R','S'],f44(ws)),calc:'PQRS'[v.p]+'を'+v.n+'本にして、残りを条件どおり分ける<br>Qは '+set.map(function(k){return ISL[k];}).join('、')};});
/* ===== 解き方（問題集で新しく出てきた形式）===== */
var LS=(LESSON['推論']=LESSON['推論']||{});LS[6]=LS[6]||[];LS[7]=LS[7]||[];
function SRT(h,r){return {table:{head:h,rows:r}};}
LS[6].push(
 {h:'例題（発言の正誤 P・Q・R）',q:'P、Q、Rが、同じ料理を試食して、次のように発言した。<br>P　この料理には<mark>ワイン</mark>が入っている<br>Q　この料理には<mark>大さじ1杯の日本酒</mark>が入っている<br>R　この料理には<mark>少なくともワインと日本酒のどちらか</mark>が入っている<br>以上の発言は、必ずしもすべてが信頼できるとは限らない。そこで、さまざまな場合を想定して推論がなされた。次のうち正しいものを1つ選びなさい。<br>A　Pが正しければQは必ず正しい<br>B　Qが正しければRは必ず正しい<br>C　Rが正しければPは必ず正しい'},
 {h:'ステップ1 「正しければ必ず正しい」を表の形に直す',p:'「PならQ」は、<mark>Pが○の場合は全部Qも○</mark>という意味。<br>Pが○でQが×の場合が1つでもあれば誤り。'},
 {h:'ステップ2 場合を書き出して○×をつける',p:'ワイン（あり・なし）と日本酒（なし・大さじ1・それ以外）を組み合わせ、P・Q・Rの○×が違う行だけ残す。',
  fig:SRT(['場合','P','Q','R'],[['ワインだけ','○','×','○'],['日本酒大さじ1だけ','×','○','○'],['日本酒大さじ2だけ','×','×','○'],['どちらもなし','×','×','×']])},
 {h:'ステップ3 反例を探す',p:'A：「ワインだけ」でPが○・Qが×　→　誤り<br>B：Qが○の行（日本酒大さじ1）はRも○　→　正しい<br>C：「日本酒大さじ1だけ」でRが○・Pが×　→　誤り'},
 {h:'答え',p:'B'},
 {h:'例題（最も少ない情報で確定する）',q:'P、Q、R、S、Tの5軒に品物を配達した。配達した順番について、次のことがわかっている。<br>Ⅰ　Qには<mark>3番目</mark>に配達した<br>Ⅱ　Pには<mark>R、Tより先</mark>に配達した<br>Ⅲ　最後に配達された家は<mark>Tではない</mark><br>最も少ない情報で、配達した順番すべてを確定するためには、次のうちどの情報が加わればよいか。必要な情報をすべて選びなさい。<br>A　Tには2番目に配達した<br>B　Rには4番目に配達した<br>C　Sには5番目に配達した'},
 {h:'ステップ1 条件を記号に直す',p:'Ⅰ Q＝3　Ⅱ P → R、P → T　Ⅲ 5番目≠T'},
 {h:'ステップ2 あり得る並びを全部書き出す',p:'Pは1番目か2番目。Tは5番目でないので2番目か4番目。',
  fig:SRT(['','1','2','3','4','5'],[['①','P','R','Q','T','S'],['②','P','S','Q','T','R'],['③','P','T','Q','R','S'],['④','P','T','Q','S','R'],['⑤','S','P','Q','T','R']])},
 {h:'ステップ3 情報を1つずつ加えて、1行だけ残るものを探す',p:'A（T＝2）：③④が残る　→　決まらない<br>B（R＝4）：<mark>③だけ</mark>が残る　→　決まる<br>C（S＝5）：①③が残る　→　決まらない<br>1つで決まるBがいちばん少ない情報'},
 {h:'答え',p:'Bだけ'},
 {h:'例題（必ずしも誤りとはいえない／確実に誤り）',q:'P、Q、R、S、Tの5人が、1回ずつくじを引いた。くじは当たり2本とはずれ3本で、次のことがわかっている。<br>Ⅰ　はずれは<mark>連続しない</mark><br>Ⅱ　最初に当たりを引いたのは<mark>P</mark>だった<br>Ⅲ　Qは<mark>Tよりも先</mark>に引き、Tは<mark>はずれ</mark>だった<br>次のうち、必ずしも誤りとはいえない推論をすべて選びなさい。<br>A　Rは2番目に引いた<br>B　Sははずれだった<br>C　Tは4番目に引いた'},
 {h:'ステップ1 ことばの意味を決める',p:'必ず正しい ＝ 書き出した<mark>全部の行</mark>で成り立つ<br>必ずしも誤りとはいえない ＝ 成り立つ行が<mark>1つでもある</mark><br>確実に誤り ＝ 成り立つ行が<mark>1つもない</mark>'},
 {h:'ステップ2 全部書き出す',p:'はずれ3本が続かないのは「×○×○×」だけ。2番目（最初の当たり）がP。Tは×の1・3・5番目でQより後。',
  fig:SRT(['','1×','2○','3×','4○','5×'],[['①','Q','P','R','S','T'],['②','Q','P','S','R','T'],['③','Q','P','T','R','S'],['④','Q','P','T','S','R'],['⑤','R','P','Q','S','T'],['⑥','R','P','S','Q','T'],['⑦','S','P','Q','R','T'],['⑧','S','P','R','Q','T']])},
 {h:'ステップ3 1つでも成り立つ行があるか',p:'A：2番目は必ずP　→　成り立つ行なし<br>B：③の行でSは5番目（はずれ）　→　成り立つ<br>C：4番目は当たりなのでTは入らない　→　成り立つ行なし'},
 {h:'答え',p:'Bだけ（ア〜ウの組合せで答える問題も、ア・イ・ウを1つずつこの方法で判定してから組合せを選ぶ）'}
);
LS[7].push(
 {h:'例題（重なりの最少人数）',q:'ある空港で<mark>40人</mark>にアンケート調査を行ったところ、フランス語を話せる人は<mark>32人</mark>、ドイツ語を話せる人は<mark>29人</mark>、中国語を話せる人は<mark>20人</mark>、スペイン語を話せる人は<mark>18人</mark>という結果が出た。<br>ドイツ語とスペイン語の2カ国語を話せる人は、少なくとも何人いるか。'},
 {h:'ステップ1 「話せない人」で考える',p:'重なりがいちばん少なくなるのは、話せない人をできるだけ別々の人にしたとき。<br>ドイツ語を話せない人 40−<mark>29</mark>＝11人、スペイン語を話せない人 40−<mark>18</mark>＝22人。'},
 {h:'ステップ2 図に置く',fig:SRT(['','人数'],[['全体','40'],['ドイツ語を話せない','11'],['スペイン語を話せない','22'],['どちらも話せる（最少）','!?']])},
 {h:'ステップ3 空白を埋める',p:'両方話せる人の最少 ＝ 40 − 11 − 22 ＝ <mark>7人</mark><br>形で覚える：<mark>k個を全部話せる人の最少 ＝ 人数の合計 −（k−1）×全体</mark><br>2カ国語：29＋18−1×40＝7　／　3カ国語（仏・独・中）：32＋29＋20−2×40＝1',p2:'答えが0以下なら「少なくとも1人いる」とはいえない'},
 {h:'答え',p:'7人'}
);
/* ===== 実践（単純な数値）：real と同じ問題文・同じ形式で、数を小さく・切りのよい数にした版（id は real の id＋'s'） ===== */
function ev(a){return a.filter(function(x){return x%2===0;});}
var SG={
 '13':function(R){var c=R.pick([6,8,10,12]),e=R.pick([2,4]),a=R.pick([2,4]),b=R.pick([2,4]);return {a:a,b:b,c:c,e:e,T:R.pick(ev(rg(c+2,c+e+a+b)))};},
 '23-1':function(R){return {a:R.int(1,3),b:R.int(1,2),c:R.int(2,3),e:R.int(1,2),ph:R.pick([160,170,180]),lo:160,hi:166};},
 '23-2':function(R){var lo=R.pick([160,170]);return {a:R.int(1,3),b:R.int(1,2),c:R.int(2,3),e:R.int(1,2),ph:170,lo:lo,hi:lo+R.pick([5,6])};},
 '24-1':function(R){var a=R.pick([100,200,300]),b=R.pick([100,200]),c=R.pick([100,200,300]);var ds=uniq(s24({a:a,b:b,c:c}).map(function(w){return Math.abs(w[2]);})).filter(function(d){return d>0;});return a===b?null:{a:a,b:b,c:c,d:R.pick(ds),K:1000};},
 '24-2':function(R){var a=R.pick([100,200,300]),b=R.pick([100,200]),c=R.pick([100,200,300]);return a===b?null:{a:a,b:b,c:c,K:1000};},
 '32':function(R){var N=R.pick([100,200]),m=10,ws=w32(N,m).filter(function(w){return w.every(function(x){return x%10===0;});}),s=[];if(!ws.length)return null;
  for(var t=0;t<3;t++){var xy=R.shuffle([0,1,2,3]).slice(0,2).sort(),w=R.pick(ws);s.push([xy[0],w[xy[0]],xy[1],w[xy[1]]+(R.int(0,1)?0:R.pick([-10,10]))]);}return {N:N,m:m,s:s};},
 '34':function(R){var N=R.pick([10,20]),n=[0,1,2,3].map(function(){return R.int(N/2,N-1);}),v={N:N,n:n,s:[]};
  R.shuffle([[0,1],[0,2],[0,3],[1,2],[1,3],[2,3],[0,1,2],[0,1,3],[0,2,3],[1,2,3]]).slice(0,3).forEach(function(x){x.sort();v.s.push([x,Math.max(1,mn34(v,x)+R.pick([0,0,1]))]);});return v;},
 '37-1':G37s,'37-2':G37s};
function G37s(R){var c=R.pick([20,50,100]),ex=R.pick([10,20]),u=c+ex,w=R.pick([10,20,30,40,50,60].filter(function(x){return x<u&&x>ex;})),k=R.pick([2,4,5,6,8].filter(function(x){return x<ex;}));if(!w)return null;var wp=w-k;if(wp<1||wp>c)return null;
 var v={c:c,u:u,w:w,wp:wp};v.o1=o37(R,ex,6);v.o2=o37(R,ex-k,6);return v;}
[6,7].forEach(function(lv){var b=BKS[lv];b.applied=b.applied||[];b.real.filter(function(t){return /^bk/.test(t.id||'')&&t.bk&&parseInt(t.bk)<=44&&(t._b||/^bk(17|42-)/.test(t.id));}).forEach(function(t){
 if(!t.make){var o={};for(var k in t)o[k]=t[k];o.id=t.id+'s';b.applied.push(o);return;}
 var g=SG[t.bk]||t._g,bd=t._b,s={id:t.id+'s',bk:t.bk,orig:t.orig,_b:bd,_g:g,
  make:function(R){var v,o;for(var n=0;n<100&&!o;n++){v=g(R);o=v&&bd(v);}if(!o)return null;o.v=v;o.bk=t.bk;o.id=s.id+'-'+JSON.stringify(v).replace(/\W/g,'');return o;},verify:t.verify};
 b.applied.push(s);});});
})();
