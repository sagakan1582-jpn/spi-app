/* 本番形式（2タブの組問）：順列・組合せ、確率。担当C（2026-11-17）。
   ① 問題集の本物の組（問92〜126）：data/book_junkaku.js の小問の作り方（window.BOOKJK）に、小問どうし同じ数値を入れて作る。
      R.pick の最初の何回かだけ、決めた値を返す（queue）。共通の文章は小問の問題文の共通部分（js/setcore.js）。
   ② 実践の問題（jn・kk の real と、問題集の単問）：1問目と同じ数値 v から2問目を作る。two(v,o1) の返り値は set_wariai.js と同じ。
   ③ 1問目の問いのあとに「ただし、〜」が続く問題は、共通の文章で切れないので W() で組にする（1問目の問いの前までが共通の文章）。 */
(function(){
var FJ='順列・組合せ',FK='確率',S=window.SETS=window.SETS||{};S[FJ]=S[FJ]||{};S[FK]=S[FK]||{};
var J=window.BOOKJK||{},D=window.BOOKDEFS=window.BOOKDEFS||{};
function pk(a){return a[Math.floor(Math.random()*a.length)];}
function fa(n){return n<=1?1:n*fa(n-1);}
function P(n,r){var x=1;for(var i=0;i<r;i++)x*=n-i;return x;}
function C(n,r){return r<0||r>n?0:Math.round(P(n,r)/fa(r));}
function gcd(a,b){return b?gcd(b,a%b):a;}
function lcm(a,b){return a*b/gcd(a,b);}
function fr(n,d){var g=gcd(n,d)||1;return [n/g,d/g];}
function fs(f){return f[1]===1?String(f[0]):f[0]+'/'+f[1];}
function fm(a,b){return fr(a[0]*b[0],a[1]*b[1]);}
function fp(a,b){return fr(a[0]*b[1]+b[0]*a[1],a[1]*b[1]);}
function f1(a){return fr(a[1]-a[0],a[1]);}
function fpw(a,k){var r=[1,1];for(var i=0;i<k;i++)r=fm(r,a);return r;}
function isInt(x){return Math.abs(x-Math.round(x))<1e-9;}
function r1(x){return Math.round(x*10+1e-9)/10;}
function Ps(n,r){if(r===0)return n+'P0 ＝ 1';var a=[];for(var i=0;i<r;i++)a.push(n-i);return n+'P'+r+' ＝ '+(r>1?a.join(' × ')+' ＝ ':'')+P(n,r);}
function Cs(n,r){if(r===0||r===n)return n+'C'+r+' ＝ 1';if(r===1)return n+'C1 ＝ '+n;var a=[],b=[];for(var i=0;i<r;i++){a.push(n-i);b.push(r-i);}return n+'C'+r+' ＝ ('+a.join(' × ')+') ÷ ('+b.join(' × ')+') ＝ '+C(n,r);}
function lvOf(F,id){var B=BANK[F];for(var l in B){var xs=B[l].real||[];for(var i=0;i<xs.length;i++)if(xs[i].id===id)return {it:xs[i],l:+l};}return null;}
function push(F,l,t){(S[F][l]=S[F][l]||[]).push(t);}

/* ===== 答えの形 ===== */
/* 整数（〜通り） */
function N(q,ans,wr,l,calc,u){if(!(ans>0)||!isInt(ans))return null;return {q:q,ans:ans,wr:wr.filter(function(w){return w>0&&isInt(w)&&w!==ans;}),u:u||'通り',l:l,calc:calc};}
/* 確率：分数（どれだけか）または%（何%か）。f＝[分子,分母]、wr＝誤答の分数 */
function FR(q,f,wr,l,calc,pct){f=fr(f[0],f[1]);if(!(f[0]>0&&f[0]<f[1]))return null;
 if(pct){var x=f[0]*100/f[1];if(!isInt(x*10))return null;var d=isInt(x)?0:1,W=[];
  function pu(y){y=r1(y);if(W.length<4&&y>0&&y<100&&(d||isInt(y))&&y!==r1(x)&&W.indexOf(y)<0)W.push(y);}
  wr.forEach(function(w){if(w)pu(w[0]*100/w[1]);});[100-x,x/2,x+10,x-10,x+5,x-5,x+20,x-20].forEach(pu);
  return {q:q,ans:r1(x),d:d||undefined,u:'%',wr:W,l:l,calc:calc+' → '+r1(x)+'%'};}
 var a=fs(f),W=[];function put(w){w=fr(w[0],w[1]);var s=fs(w);if(W.length<4&&w[0]>0&&w[0]<w[1]&&s!==a&&W.indexOf(s)<0)W.push(s);}
 wr.forEach(function(w){if(w)put(w);});for(var k=1;W.length<4&&k<40;k++){put([f[0]+k,f[1]]);if(f[0]>k)put([f[0]-k,f[1]]);}for(k=1;W.length<4&&k<40;k++)put([f[0],f[1]+k]);
 return {q:q,ans:a,str:1,u:'',wr:W,l:l,calc:calc};}
var DEC=0;/* %で答える問題の解説は小数で書く */
function dec(f){return String(Math.round(f[0]/f[1]*1e6)/1e6);}
function F$(f){return DEC?dec(f):fs(fr(f[0],f[1]));}
function Q$(n,d){var s=n+'/'+d,t=fs(fr(n,d));return s===t?s:s+' ＝ '+t;}

/* ===== ① 問題集の本物の組 ===== */
function cart(){var r=[[]];for(var i=0;i<arguments.length;i++){var n=[];var a=arguments[i];r.forEach(function(x){a.forEach(function(y){n.push(x.concat([y]));});});r=n;}return r;}
function G(F,n,subs,Z,qf){var ks=[],lv=0;qf=qf||function(z){return z;};
 subs.forEach(function(b,i){var it=J[b];if(!it)return;lv=Math.max(lv,it.l);var k='jk'+b;ks.push(k);
  D[k]={fd:F,lv:it.l,d:{P:{z:Z},f:function(v,R){var q=qf(v.z,i).slice(),RR={pick:function(a){return q.length?q.shift():R.pick(a);},int:R.int,shuffle:R.shuffle};return it.make(RR);}}};});
 if(ks.length===subs.length)push(F,lv,{id:'set-book-'+n,book:ks});}
G(FJ,92,['92-1','92-2'],cart([5,6,4],[4,3,5]));
G(FJ,93,['93-1','93-2'],[[3],[4],[5]]);
G(FJ,94,['94-1','94-2'],[[[6,2],[3,2,1]],[[9,3],[4,3,2]],[[9,3],[5,3,1]]],function(z,i){return [z[i]];});
G(FJ,95,['95-1','95-2','95-3'],[[4],[3],[5]]);
G(FJ,96,['96-1','96-2','96-3','96-4'],[[6],[5]]);
G(FJ,97,['97-1','97-2'],[[3],[4]],function(z,i){return i?[z[0],1]:[z[0],1,1];});
G(FJ,98,['98-1','98-2'],[[[4,2]],[[2,2]],[[6,2]]]);
G(FJ,99,['99-1','99-2'],[[5],[6]]);
G(FJ,100,['100-1','100-2','100-3'],cart([6,5,7],[4,3,5]),function(z,i){return i===2?[z[0]]:z;});
G(FJ,101,['101-1','101-2'],[[5],[6],[4]]);
G(FJ,102,['102-1','102-2'],[[7],[6],[8],[5]]);
G(FJ,103,['103-1','103-2','103-3'],[[4]]);
G(FJ,104,['104-1','104-2','104-3'],cart([3,4,2],[3,4,2],[2,3]));
G(FJ,107,['107-1','107-2','107-3'],[[10],[8],[12],[9]]);
G(FJ,108,['108-1','108-2','108-3'],[[6],[4]]);
G(FJ,111,['111-1','111-2','111-3'],[[3],[4],[2]],function(z,i){return i<2?[[z[0],z[0]]]:[z[0]];});
G(FJ,112,['112-1','112-2'],[[3],[4]]);
G(FJ,113,['113-1','113-2','113-3'],cart([5,4,6],[3,4,2]));
G(FK,116,['116-1','116-2','116-3'],[[]]);
G(FK,117,['117-1','117-2'],[[3],[2],[4]]);
G(FK,118,['118-1','118-2'],cart([6,5,7],[2,3]));
G(FK,119,['119-1','119-2'],[[5],[4],[6],[3],[7]]);
G(FK,120,['120-1','120-2','120-3'],[[4],[3],[5],[6],[13]]);
G(FK,122,['122-1','122-2','122-3','122-4'],cart([2,3,1,4],[4,5,3,6]));
G(FK,123,['123-1','123-2'],[[10],[8],[6]]);
G(FK,124,['124-1','124-2'],cart([4,3,5],[3,4]));
(function(){var Z=[[1]];cart([3,2,4,1],[2,3,1,4],[20,30,10,40,25],[10,5,20,15]).forEach(function(x){if(gcd(x[0],x[1])===1)Z.push([0].concat(x));});G(FK,125,['125-1','125-2'],Z);
 var A=[[[1,2],[1,4],[1,4]],[[1,4],[1,2],[1,4]],[[1,4],[1,4],[1,2]]],Z2=[[1]];A.forEach(function(x){A.forEach(function(y){Z2.push([0,x,y]);});});G(FK,126,['126-1','126-2'],Z2);})();

/* ===== ② 実践の問題：1問目と同じ数値で2問目 ===== */
function same(r,o){if(!r||!o||!o.c)return false;var a=r.str?String(r.ans):(r.d?Number(r.ans).toFixed(r.d):String(r.ans))+r.u;return a===o.c[o.a];}
function T2(two){return function(v,o){DEC=0;var r;try{r=two(v,o);}finally{DEC=0;}return same(r,o)?null:r;};}
function A(F,id,two){var s=lvOf(F,id);if(!s)return;push(F,s.l,{id:'set-'+id,src:id,two:T2(two)});}
/* ③ 1問目の問いのあとに文が続く問題：共通の文章＝1問目の問いの文の前まで */
function stemOf(q){var i=q.search(/[^。]*(何通り|どれだけ|何%|何試合)[^。]*か。/);return i>0?q.slice(0,i):null;}
function chs(r){function fmt(x){return r.str?String(x):(r.d?Number(x).toFixed(r.d):String(x))+r.u;}var a=fmt(r.ans),out=[a],c=r.wr.slice();
 if(!r.str){var k=r.d?Math.pow(10,r.d):1;[0.8,1.2,0.9,1.1,0.5,1.5].forEach(function(m){c.push(Math.round(r.ans*m*k)/k);});[1,-1,2,-2].forEach(function(s){c.push(Math.round((r.ans+s*(r.d?0.1:1))*k)/k);});}
 c.forEach(function(x){if(out.length>=5)return;if(!r.str&&!(isFinite(x)&&x>0))return;var s=fmt(x);if(out.indexOf(s)<0)out.push(s);});
 if(out.length<4)return null;for(var i=out.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=out[i];out[i]=out[j];out[j]=t;}return {c:out,a:out.indexOf(a)};}
function W(F,id,two){var s=lvOf(F,id);if(!s)return;var k='jx-'+id;two=T2(two);
 D[k+'-1']={fd:F,lv:s.l,d:{P:{},f:function(v,R){var o=s.it.make(R);if(!o||!o.v)return null;var st=stemOf(o.q);if(!st)return null;v._o=o;v._s=st;return o;}}};
 D[k+'-2']={fd:F,lv:s.l,d:{P:{},f:function(v){var o=v._o;if(!o)return null;var r=two(o.v,o);if(!r)return null;var ch=chs(r);if(!ch)return null;return {q:v._s+r.q,c:ch.c,a:ch.a,calc:r.calc};}}};
 push(F,s.l,{id:'set-'+id,book:[k+'-1',k+'-2']});}

/* --- 順列・組合せ 指標3 --- */
A(FJ,'jn3r-g1',function(v){var n=v.n,r=v.r,x=P(n-1,r-1);return N('特定の1人が部長に選ばれる場合、選び方は何通りあるか。',x,[P(n,r-1),C(n-1,r-1),P(n-1,r),P(n,r)-x],3,'部長を特定の1人に決め、残りの'+(n-1)+'人から副部長と会計を選んで並べる<br>'+Ps(n-1,r-1));});
A(FJ,'jn3r-g2',function(v){var n=v.n,r=v.r,x=C(n-1,r-1);return N('特定の1人が必ず代表に選ばれる選び方は何通りあるか。',x,[C(n,r-1),P(n-1,r-1),C(n-1,r),C(n,r)-x],3,'特定の1人を先に入れ、残りの'+(n-1)+'人から'+(r-1)+'人を選ぶ<br>'+Cs(n-1,r-1));});
A(FJ,'jn3r-g3',function(v){var n=v.n,x=2*fa(n-1);return N('特定の2人が隣り合う並び方は何通りあるか。',x,[fa(n-1),fa(n)-x,2*fa(n-2),fa(n)/2],4,'隣り合う2人をひとまとまりにして'+(n-1)+'人分を並べ、まとまりの中の並び方2通りを掛ける<br>'+Ps(n-1,n-1)+'<br>'+fa(n-1)+' × 2 ＝ '+x);});
A(FJ,'jn3r-g4',function(v){var n=v.n,r=v.r,x=C(n,r)-C(n-2,r);return N('特定の2人のうち、少なくとも1人が委員に選ばれる選び方は何通りあるか。',x,[C(n-2,r),C(n,r),2*C(n-1,r-1),C(n-2,r-2)],4,'全ての選び方から、2人とも選ばれない選び方を引く<br>'+Cs(n,r)+'<br>'+Cs(n-2,r)+'<br>'+C(n,r)+' − '+C(n-2,r)+' ＝ '+x);});
A(FJ,'jn3r-g5',function(v){var a=v.a,b=v.b,x=C(a-1,v.ra-1)*C(b,v.rb);return N('特定の男子1人が必ず選ばれる選び方は何通りあるか。',x,[C(a-1,v.ra-1),C(a,v.ra)*C(b,v.rb)-x,C(a-1,v.ra)*C(b,v.rb),(a-1)*C(b,v.rb)],3,'特定の男子を先に入れ、残りの男子'+(a-1)+'人から'+(v.ra-1)+'人、女子'+b+'人から'+v.rb+'人を選ぶ<br>'+Cs(a-1,v.ra-1)+'<br>'+Cs(b,v.rb)+'<br>'+C(a-1,v.ra-1)+' × '+C(b,v.rb)+' ＝ '+x);});
A(FJ,'jn3r-g6',function(v){var n=v.n,x=C(n-1,2);return N('特定の1人が議長に選ばれる選び方は何通りあるか。',x,[P(n-1,2),C(n,2),n-1,C(n-1,3)],3,'議長を特定の1人に決め、残りの'+(n-1)+'人から書記2人を選ぶ（書記どうしの順番はない）<br>'+Cs(n-1,2));});
A(FJ,'jn3r-g7',function(v){var n=v.n,r=v.r,o=Math.ceil(n/2),x=o*P(n-1,r-1),od=[];for(var i=1;i<=n;i+=2)od.push(i);
 return N('このうち、奇数は何通りできるか。',x,[P(n,r)/2,o*P(n,r-1),P(n-1,r-1),(n-o)*P(n-1,r-1)],4,'一の位を奇数（'+od.join('、')+'の'+o+'枚）から先に決め、残りの'+(n-1)+'枚で残りの位を並べる<br>'+o+' × '+(n-1)+'P'+(r-1)+' ＝ '+o+' × '+P(n-1,r-1)+' ＝ '+x);});
A(FJ,'jn3r-g8',function(v){var n=v.n;if(n%2)return null;var h=n/2,x=2*C(h,2);return N(n+'チームを'+h+'チームずつの2つのグループに分け、それぞれのグループの中だけで総当たり戦を行う場合、試合は全部で何試合あるか。',x,[C(h,2),C(n,2)-x,C(n,2)/2,h*h],3,'1つのグループの試合 '+Cs(h,2)+'<br>2グループで '+C(h,2)+' × 2 ＝ '+x,'試合');});
A(FJ,'jn3r-g9',function(v){var n=v.n,r=v.r,x=P(n-1,r-1);return N('Aが第1走者になる場合、選び方は何通りあるか。',x,[P(n,r-1),C(n-1,r-1),P(n-1,r),P(n,r)/n],3,'第1走者をAに決め、残りの'+(n-1)+'人から第2〜第'+r+'走者を選んで並べる<br>'+Ps(n-1,r-1));});
A(FJ,'jn3r-g10',function(v){var n=v.n,r=v.r,x=C(n,r)-C(n-2,r);return N('赤と青のうち、少なくとも一方を含む選び方は何通りあるか。',x,[C(n-2,r),C(n-1,r-1),2*C(n-1,r-1),C(n,r)-(n-2)],4,'全ての選び方から、赤も青も含まない選び方を引く<br>'+Cs(n,r)+'<br>'+Cs(n-2,r)+'<br>'+C(n,r)+' − '+C(n-2,r)+' ＝ '+x);});
/* --- 順列・組合せ 指標4 --- */
A(FJ,'jn4r-g1',function(v,o){var n=v.n,m=v.m,k=v.k;if(o.q.indexOf('女子'+m+'人')<0||k<2)return null;var x=C(n,k)-C(n-m,k)-C(m,k);
 return N('男子と女子がそれぞれ少なくとも1人選ばれる選び方は何通りあるか。',x,[C(n,k)-C(m,k),C(n,k)-C(n-m,k),C(n,k),(n-m)*m],4,'全ての選び方から、男子だけ・女子だけの選び方を引く<br>'+Cs(n,k)+'<br>男子だけ '+Cs(n-m,k)+'<br>女子だけ '+(k>m?'0（'+m+'人しかいない）':Cs(m,k))+'<br>'+C(n,k)+' − '+C(n-m,k)+' − '+C(m,k)+' ＝ '+x);});
A(FJ,'jn4r-g2',function(v){var n=v.n,x=2*fa(n-1);return N('AとBが隣り合う並び方は何通りあるか。',x,[fa(n-1),2*fa(n-2),fa(n)-x,fa(n)/2],4,'AとBをひとまとまりにして'+(n-1)+'人分を並べ、AとBの並び方2通りを掛ける<br>'+Ps(n-1,n-1)+'<br>'+fa(n-1)+' × 2 ＝ '+x);});
function digEven(v){var lo=v.lo,hi=v.hi,r=v.r;
 if(lo===1){var n=hi,e=Math.floor(n/2),x=e*P(n-1,r-1);return N('このうち、偶数は何通りできるか。',x,[P(n,r)/2,e*P(n,r-1),P(n-1,r-1),(n-e)*P(n-1,r-1)],4,'一の位を偶数（'+e+'枚）から先に決め、残りの'+(n-1)+'枚で残りの位を並べる<br>'+e+' × '+(n-1)+'P'+(r-1)+' ＝ '+e+' × '+P(n-1,r-1)+' ＝ '+x);}
 var m=hi,e2=Math.floor(m/2),z=P(m,r-1),w=e2*(m-1)*P(m-1,r-2),x2=z+w;
 return N('このうち、偶数は何通りできるか。',x2,[z,w,(e2+1)*P(m,r-1),(e2+1)*(m-1)*P(m-1,r-2)],4,'一の位が0のとき：残りの'+m+'枚で残りの位を並べる　'+Ps(m,r-1)+'<br>一の位が0以外の偶数（'+e2+'枚）のとき：一番上の位は0と一の位以外の'+(m-1)+'枚、間の位は残りの'+(m-1)+'枚から並べる　'+e2+' × '+(m-1)+' × '+(m-1)+'P'+(r-2)+' ＝ '+w+'<br>'+z+' ＋ '+w+' ＝ '+x2);}
A(FJ,'jn4r-g3',digEven);A(FJ,'jn4r-g4',digEven);A(FJ,'jn4r-g7',digEven);
A(FJ,'jn4r-g5',function(v){var n=v.n,k=v.k,x=0,L=[];for(var j=k;j<=n;j++){x+=C(n,j);L.push(n+'C'+j);}return N('表が'+k+'回以上出る出方は何通りあるか。',x,[C(n,k),Math.pow(2,n)-x,x-1,C(n,k)*2],4,'表が'+k+'回、'+(k+1)+'回、…、'+n+'回の場合を足す<br>'+L.join(' ＋ ')+' ＝ '+x);});
A(FJ,'jn4r-g6',function(v){var n=v.n,k=v.k,x=C(n-1,k);return N('Pを入れないとき、選び方は何通りあるか。',x,[C(n,k),C(n-1,k-1),P(n-1,k),C(n,k)-x+1],3,'Pを除いた'+(n-1)+'種類から'+k+'種類を選ぶ<br>'+Cs(n-1,k));});
A(FJ,'jn4r-g8',function(v,o){var n=v.n,m=v.m,w=n-m;if(o.q.indexOf('男子'+m+'人')<0)return null;var x=P(m,2)+P(w,2);
 return N('委員長と副委員長が、2人とも男子か2人とも女子になる選び方は何通りあるか。',x,[C(m,2)+C(w,2),m*w,P(n,2)-x+1,2*m*w],4,'2人とも男子 '+Ps(m,2)+'<br>2人とも女子 '+Ps(w,2)+'<br>'+P(m,2)+' ＋ '+P(w,2)+' ＝ '+x);});
A(FJ,'jn4r-g9',function(v){var n=v.n,x=2*fa(n-1);return N('Aが月曜日か火曜日に当番をする割り当て方は何通りあるか。',x,[fa(n-1),fa(n)-x,2*fa(n-2),fa(n)],4,'Aの曜日 2通り（月・火）<br>残りの'+(n-1)+'人を残りの'+(n-1)+'日に並べる　'+Ps(n-1,n-1)+'<br>2 × '+fa(n-1)+' ＝ '+x);});
A(FJ,'jn4r-g10',function(v){var DY='月火水木金土日',x=0,L=[];v.E.forEach(function(e){var k=v.S.filter(function(s){return DY.indexOf(s)>DY.indexOf(e);});x+=k.length;if(k.length)L.push('英会話'+e+'曜日：水泳は'+k.join('・')+'の'+k.length+'通り');});
 return N('英会話が水泳より早い曜日になる選び方は何通りあるか。ただし、1週間は月曜日から始まるものとする。',x,[9-x,9,x+1,x-1],4,'英会話の曜日で場合分けし、それより後の水泳の曜日を数える<br>'+L.join('<br>')+'<br>合計 '+x);});
/* --- 順列・組合せ 指標5 --- */
W(FJ,'jn5r-g1',function(v){var n=v.n,x=2*fa(n-2);return N(n+'人のうち、特定の2人が隣り合う座り方は何通りあるか。ただし、回転して同じになる座り方は1通りと数える。',x,[fa(n-1),fa(n-2),fa(n-1)-x,4*fa(n-2)],5,'隣り合う2人をひとまとまりにして'+(n-1)+'人分を円形に並べる　('+(n-1)+' − 1)! ＝ '+fa(n-2)+'<br>まとまりの中の並び方2通りを掛ける　'+fa(n-2)+' × 2 ＝ '+x);});
W(FJ,'jn5r-g2',function(v,o){var n=v.n;if(o.q.indexOf('女性2人')<0)return null;
 if(n%2===0){var x=fa(n-2);return N('女性2人が向かい合って座る座り方は何通りあるか。ただし、回転して同じになる座り方は1通りと数える。',x,[2*fa(n-2),fa(n-1),fa(n-1)-2*fa(n-2),fa(n-3)],5,'女性1人の席を決めると、もう1人の女性は向かいの席に決まる<br>残りの男性'+(n-2)+'人を残りの席に並べる　'+Ps(n-2,n-2));}
 var y=2*fa(n-2);return N('女性2人が隣り合う座り方は何通りあるか。ただし、回転して同じになる座り方は1通りと数える。',y,[fa(n-2),fa(n-1),fa(n-1)-y,4*fa(n-2)],5,'女性2人をひとまとまりにして'+(n-1)+'人分を円形に並べる　('+(n-1)+' − 1)! ＝ '+fa(n-2)+'<br>× 2 ＝ '+y);});
function OB(q,k,s,m,word){var r=k-m*s;if(r<0)return null;var x=C(r+s-1,s-1);return N(q,x,[C(r+s,s-1),C(r+s-1,s),C(k+s-1,s-1),C(r+s-2,s-1)],5,'先に'+s+'種類に'+m+word+'ずつ入れ、残りの'+r+word+'を○、種類の区切りを｜'+(s-1)+'本として並べる<br>'+(r+s-1)+'C'+(s-1)+' ＝ '+x);}
A(FJ,'jn5r-g3',function(v){return OB('どの種類のパンも少なくとも1個は選ぶ場合、選び方は何通りあるか。',v.k,v.s,1,'個');});
A(FJ,'jn5r-g4',function(v){return OB('どの種類も少なくとも2本は入れる場合、選び方は何通りあるか。',v.k,v.s,2,'本');});
A(FJ,'jn5r-g10',function(v){return OB('1人に少なくとも1本は分ける場合、分け方は何通りあるか。',v.k,v.s,1,'本');});
function msN(c){var n=0;c.forEach(function(x){n+=x;});var d=1;c.forEach(function(x){d*=fa(x);});return fa(n)/d;}
A(FJ,'jn5r-g5',function(v,o){var c=v.c,CL=['赤い','青い','白い'],x=0,L=[];if(o.q.indexOf('赤い旗'+c[0]+'本')<0)return null;
 c.forEach(function(k,i){if(k<2)return;var d=c.slice();d[i]-=2;var y=msN(d);x+=y;L.push('両端が'+CL[i]+'旗：残り'+d.join('・')+'本を並べる '+y+'通り');});
 return N('両端が同じ色の旗になる並べ方は何通りあるか。',x,[msN(c)-x,x*2,Math.round(x/2),c.length*x],5,'両端の色で場合分けし、真ん中の旗を並べる（同じ色は区別しない）<br>'+L.join('<br>')+'<br>合計 '+x);});
function parts(n,s){return fa(n)/(Math.pow(fa(s),n/s)*fa(n/s));}
A(FJ,'jn5r-g6',function(v){var s=v.s,k=v.k,n=s*k,a=C(n-2,s-2),b=parts(n-s,s),x=a*b;
 return N('特定の2人が同じ組になる分け方は何通りあるか。',x,[a*b*fa(k-1),parts(n,s)-x,a,b],5,(s===2?'特定の2人で1組になる　1通り':'特定の2人の組の残り'+(s-2)+'人を'+(n-2)+'人から選ぶ　'+Cs(n-2,s-2))+(k===2?'<br>残りの'+(n-s)+'人はもう1つの組になる　1通り':'<br>残りの'+(n-s)+'人を'+s+'人ずつ'+(k-1)+'組に分ける　'+b+'通り')+'<br>'+a+' × '+b+' ＝ '+x);});
A(FJ,'jn5r-g7',function(v){var n=v.n,x=2*fa(n-1);return N('AとBが隣り合う並び方は何通りあるか。',x,[fa(n-1),fa(n)-x,2*fa(n-2),fa(n)/2],4,'AとBをひとまとまりにして'+(n-1)+'人分を並べ、AとBの並び方2通りを掛ける<br>'+Ps(n-1,n-1)+'<br>'+fa(n-1)+' × 2 ＝ '+x);});
A(FJ,'jn5r-g8',function(v){var n=v.n,x=Math.pow(2,n-1);return N('特定の1冊を必ず借りる選び方は何通りあるか。',x,[x-1,Math.pow(2,n)-1,C(n,2),n],5,'特定の1冊は借りると決め、残りの'+(n-1)+'冊はそれぞれ「借りる・借りない」の2通り<br>2<sup>'+(n-1)+'</sup> ＝ '+x);});
A(FJ,'jn5r-g9',function(v){var a=v.a,b=v.b,k=v.k,x=C(a-1,k-1)*P(b,k);return N('特定の男子1人が必ずペアに入るつくり方は何通りあるか。',x,[P(b,k),C(a-1,k-1)*C(b,k),C(a,k)*P(b,k)-x,P(a-1,k-1)*P(b,k)],5,'特定の男子を入れ、残りの男子'+(a-1)+'人から'+(k-1)+'人を選ぶ　'+Cs(a-1,k-1)+'<br>選んだ男子'+k+'人の相手の女子を並べる　'+Ps(b,k)+'<br>'+C(a-1,k-1)+' × '+P(b,k)+' ＝ '+x);});
/* --- 順列・組合せ 問題集の単問 --- */
A(FJ,'bk88',function(v){var n=v.n,y=2*fa(n-1),x=fa(n)-y;return N('PとQが連続する曜日に出演しない場合、'+n+'人それぞれが出演する曜日の組み合わせは何通りあるか。',x,[y,fa(n),fa(n)-fa(n-1),x/2],4,'全ての組み合わせから、PとQが連続する組み合わせを引く<br>全て '+Ps(n,n)+'<br>連続する：PとQをひとまとまりにして'+(n-1)+'人分を並べ、PとQの順番2通りを掛ける　'+fa(n-1)+' × 2 ＝ '+y+'<br>'+fa(n)+' − '+y+' ＝ '+x);});
A(FJ,'bk89',function(v){var a=v.A.length,b=v.B.length,x=a*C(b,2);return N('同じ曜日に2つの習い事が重なってもよい場合、通う組み合わせは何通りあるか。',x,[a*P(b,2),a*b,C(a+b,3),x-a],3,'料理教室の曜日 '+a+'通り<br>テニスの2日 '+Cs(b,2)+'<br>'+a+' × '+C(b,2)+' ＝ '+x);});
A(FJ,'bk90',function(v){var n=v.n,k=v.k,x=C(n-2,k-2);return N('オランダとフランスの両方を入れる選び方は何通りあるか。',x,[C(n-1,k-1),C(n-2,k),P(n-2,k-2),C(n,k)-C(n-2,k)],3,'オランダとフランスを先に入れ、残りの'+(n-2)+'カ国から'+(k-2)+'カ国を選ぶ<br>'+Cs(n-2,k-2));});
W(FJ,'bk91',function(v){var a=v.a,b=v.b,k=v.k,c=[];for(var j=1;j<k;j++)if(j<=a&&k-j<=b)c.push(j);if(!c.length)return null;var j=pk(c),x=C(a,j)*C(b,k-j);
 return N('日本史を'+j+'問、世界史を'+(k-j)+'問選ぶ場合、選び方は何通りあるか。ただし、出題する順番は考えないものとする。',x,[C(a+b,k),C(a,j)+C(b,k-j),P(a,j)*P(b,k-j),C(a+b,k)-x],4,'日本史 '+Cs(a,j)+'<br>世界史 '+Cs(b,k-j)+'<br>'+C(a,j)+' × '+C(b,k-j)+' ＝ '+x);});
W(FJ,'bk105',function(v){var n=v.n,k=v.k,x=C(n+k-1,k-1);return N('選ばない種類があってもよい場合、選び方の組み合わせは何通りあるか。',x,[C(n-1,k-1),C(n+k,k-1),Math.pow(k,n),C(n+k-1,k)+1],5,'切手'+n+'枚を○、種類の区切りを｜'+(k-1)+'本として並べる<br>'+Cs(n+k-1,k-1));});
A(FJ,'bk106',function(v){var r=v.r,k=v.k;if(r<k)return null;var x=C(r-1,k-1);return N('ここから'+r+'本を選ぶとき、どの色も少なくとも1本は選ぶ色の組み合わせは何通りあるか。',x,[C(r+k-1,k-1),C(r,k-1),C(r-1,k),x+k],5,'先に各色1本ずつ選び、残りの'+(r-k)+'本を○、色の区切りを｜'+(k-1)+'本として並べる<br>'+Cs(r-1,k-1));});
W(FJ,'bk110',function(v,o){var p=v.p,CL=['赤','白','青'],x=0,L=[];if(o.q.indexOf('飾りたい。皿の並べ方は')<0)return null;
 p.forEach(function(k,i){if(k<2)return;var d=p.slice();d[i]-=2;var y=msN(d);x+=y;L.push('両端が'+CL[i]+'皿：残り'+d.join('・')+'枚を並べる '+y+'通り');});if(!x)return null;
 var q=o.q.slice(o.q.indexOf('これを'));q=q.slice(0,q.indexOf('飾りたい。'))+'飾り、両端に同じ色の皿を置きたい。皿の並べ方は何通りあるか。ただし、同色の皿に区別はないものとする。';
 return N(q,x,[msN(p)-x,x*2,Math.round(x/2),x+1],5,'両端の色で場合分けし、真ん中の皿を並べる<br>'+L.join('<br>')+'<br>合計 '+x);});

/* --- 確率 --- */
function V(o){return /合格/.test(o.q)?['合格する','不合格になる']:['正解する','不正解になる'];}
function ASK(p){return p?'何%か。':'どれだけか。';}
/* 2人（P・Q）が独立に起こる確率 */
function IND(v,o){DEC=v.p?1:0;var a=v.a,b=v.b,na=f1(a),nb=f1(b),vb=V(o),pc=v.p,
 both=fm(a,b),ex=fp(fm(a,nb),fm(na,b)),none=fm(na,nb),al=f1(none),K={both:'ex',al:'none',ex:'al',none:'both'}[v.k];
 if(!K||o.q.indexOf('PとQ')<0)return null;
 var t={both:['PとQの2人とも'+vb[0],both,'P '+F$(a)+' × Q '+F$(b)+' ＝ '+F$(both)],
  ex:['PとQのどちらか1人だけが'+vb[0],ex,'Pだけ '+F$(a)+' × '+F$(nb)+' ＝ '+F$(fm(a,nb))+'<br>Qだけ '+F$(na)+' × '+F$(b)+' ＝ '+F$(fm(na,b))+'<br>足して '+F$(ex)],
  al:['PとQの少なくともどちらか1人が'+vb[0],al,'2人とも'+vb[1]+' '+F$(na)+' × '+F$(nb)+' ＝ '+F$(none)+'<br>1 − '+F$(none)+' ＝ '+F$(al)],
  none:['PとQの2人とも'+vb[1],none,'P '+F$(na)+' × Q '+F$(nb)+' ＝ '+F$(none)]}[K];
 return FR(t[0]+'確率は'+ASK(pc),t[1],[both,ex,none,al].filter(function(z){return F$(z)!==F$(t[1]);}),K==='both'||K==='none'?3:4,t[2],pc);}
['kk3r-g3','kk3r-g4','kk3r-g5','kk3r-g6','kk4r-g1','kk4r-g2'].forEach(function(id){A(FK,id,IND);});
A(FK,'kk3r-g10',function(v,o){DEC=1;if(o.q.indexOf('Aが勝つ')<0)return null;var a=v.a,na=f1(a),x=fm([2,1],fm(a,na));
 return FR('2回試合をするとき、Aがちょうど1回勝つ確率は何%か。',x,[fm(a,na),fm(a,a),fm(na,na)],4,'1回目だけ勝つ '+F$(a)+' × '+F$(na)+' ＝ '+F$(fm(a,na))+'<br>2回目だけ勝つ '+F$(na)+' × '+F$(a)+' ＝ '+F$(fm(a,na))+'<br>足して '+F$(x),1);});
A(FK,'kk3r-g1',function(v){var c=v.c,n=0,s=0,s2=0;c.forEach(function(x){n+=x;s+=x*x;s2+=x*(x-1);});
 return FR('取り出した玉を袋に戻し、もう一度玉を1個取り出す。2回とも同じ色の玉が出る確率はどれだけか。',[s,n*n],[[s2,n*(n-1)],[c[0]*c[0],n*n],[1,3]],4,'色ごとに「1回目 × 2回目」を出して足す<br>('+c.map(function(x){return x+'×'+x;}).join(' ＋ ')+') ÷ ('+n+'×'+n+') ＝ '+s+'/'+(n*n)+' ＝ '+F$([s,n*n]));});
function SUM(v){var X=pk([8,9,10,11]),k=0,L=[];for(var s=X;s<=12;s++){var w=6-Math.abs(s-7);k+=w;L.push('和'+s+'：'+w+'通り');}
 return FR('出た目の和が'+X+'以上になる確率はどれだけか。',[k,36],[[k,6*6*2],[6-Math.abs(X-7),36],[k+1,36]],3,'目の出方は全部で 6 × 6 ＝ 36通り<br>'+L.join('、')+'<br>'+Q$(k,36));}
A(FK,'kk3r-g2',SUM);A(FK,'kk4r-g3',SUM);
function LOT(v,o){var n=v.n,k=v.k,d=n*(n-1),both=[k*(k-1),d],one=[k*(n-k),d],none=[(n-k)*(n-k-1),d],al=f1(none);if(o.q.indexOf('A')<0||o.q.indexOf('B')<0)return null;
 var K={both:'aonly',b:'both',none:'bonly',al:'both'}[v.w],t={
  aonly:['Aだけが当たりを引く',one,'Aが当たり '+k+'/'+n+'、Bがはずれ '+(n-k)+'/'+(n-1)+'<br>'+k+'/'+n+' × '+(n-k)+'/'+(n-1)+' ＝ '+F$(one)],
  bonly:['Bだけが当たりを引く',one,'Aがはずれ '+(n-k)+'/'+n+'、Bが当たり '+k+'/'+(n-1)+'<br>'+(n-k)+'/'+n+' × '+k+'/'+(n-1)+' ＝ '+F$(one)],
  both:['2人とも当たりを引く',both,'Aが当たり '+k+'/'+n+'、Bも当たり '+(k-1)+'/'+(n-1)+'<br>'+k+'/'+n+' × '+(k-1)+'/'+(n-1)+' ＝ '+F$(both)]}[K];
 if(!t)return null;return FR((K==='both'?'AとBの':'')+t[0]+'確率はどれだけか。',t[1],[[k*k,n*n],[k,n],both,one,none],4,t[2]);}
['kk3r-g7','kk3r-g8','kk5r-g1','kk5r-g2'].forEach(function(id){A(FK,id,LOT);});
A(FK,'kk3r-g9',function(v){var n=v.n,x=[C(n,2),Math.pow(2,n)];return FR('表がちょうど2回出る確率はどれだけか。',x,[[1,4],[2,Math.pow(2,n)],[C(n,2),n*n]],4,'2回表が出る回の選び方 '+Cs(n,2)+'<br>1つの出方の確率 (1/2)<sup>'+n+'</sup> ＝ 1/'+Math.pow(2,n)+'<br>'+C(n,2)+' × 1/'+Math.pow(2,n)+' ＝ '+F$(x));});
A(FK,'kk4r-g4',function(v){var n=v.n,k=v.ks[v.ks.length-1],s=0,L=[];for(var j=k;j<=n;j++){s+=C(n,j);L.push(n+'C'+j);}var x=[s,Math.pow(2,n)];
 return FR('表が'+k+'回以上出る確率はどれだけか。',x,[[C(n,k),Math.pow(2,n)],[s,n*n],[n-k+1,n+1]],4,'表が'+k+'〜'+n+'回の出方 '+L.join(' ＋ ')+' ＝ '+s+'通り<br>全部で 2<sup>'+n+'</sup> ＝ '+Math.pow(2,n)+'通り<br>'+Q$(s,Math.pow(2,n)));});
A(FK,'kk4r-g5',function(v){var n=v.n,k=v.k,x=[C(k,2),C(n,2)];return FR('2本とも当たりである確率はどれだけか。',x,[[k*k,n*n],[k,n],[C(n-k,2),C(n,2)]],4,'当たり'+k+'本から2本 '+Cs(k,2)+'<br>全部で '+Cs(n,2)+'<br>'+Q$(C(k,2),C(n,2)));});
A(FK,'kk4r-g6',function(v){var N0=v.N,a=v.a,b=v.b,L=lcm(a,b),x=[Math.floor(N0/a)-Math.floor(N0/L),N0];
 return FR('引いたカードの数字が'+a+'の倍数であり、'+b+'の倍数ではない確率はどれだけか。',x,[[Math.floor(N0/a),N0],[Math.floor(N0/a)-Math.floor(N0/b),N0],[Math.floor(N0/L),N0]],4,a+'の倍数 '+N0+' ÷ '+a+' → '+Math.floor(N0/a)+'枚<br>'+a+'と'+b+'の両方の倍数（'+L+'の倍数） '+Math.floor(N0/L)+'枚<br>'+Math.floor(N0/a)+' − '+Math.floor(N0/L)+' ＝ '+x[0]+'枚　'+Q$(x[0],N0));});
function RWO(v,o){var a=v.a,b=v.b,n=a+b;if(!new RegExp('赤玉(が)?'+a+'個').test(o.q)||!new RegExp('白玉(が)?'+b+'個').test(o.q))return null;var x=[C(b,2),C(n,2)];
 return FR('2個とも白玉である確率はどれだけか。',x,[[b*b,n*n],[C(a,2),C(n,2)],[b,n]],4,'白玉'+b+'個から2個 '+Cs(b,2)+'<br>全部で '+Cs(n,2)+'<br>'+Q$(C(b,2),C(n,2)));}
A(FK,'kk4r-g7',RWO);A(FK,'kk5r-g10',RWO);
A(FK,'kk4r-g8',function(v){var d=v.d,k=0,L=[];for(var e=d;e<=5;e++){k+=2*(6-e);L.push('差'+e+'：'+(6-e)+' × 2 ＝ '+2*(6-e)+'通り');}
 return FR('Pの出した目とQの出した目の差が'+d+'以上になる確率はどれだけか。',[k,36],[[k/2,36],[k,6],[k+2,36]],4,'Pが大きい場合とQが大きい場合があるので2倍する<br>'+L.join('<br>')+'<br>'+Q$(k,36));});
function THREE(v,o){DEC=v.p?1:0;var ps=v.ps,np=ps.map(f1),vb=V(o),pc=v.p;if(o.q.indexOf('P、Q、R')<0)return null;
 var NM=['P','Q','R'],q,x,L=[];
 if(v.k==='al'){x=[0,1];[0,1,2].forEach(function(i){var t=[1,1];[0,1,2].forEach(function(j){t=fm(t,j===i?np[j]:ps[j]);});x=fp(x,t);L.push(NM[i]+'だけ'+vb[1]+' '+F$(t));});q='3人のうちちょうど2人が'+vb[0]+'確率は';}
 else{var z=fm(fm(np[0],np[1]),np[2]);x=f1(z);L.push('3人とも'+vb[1]+' '+F$(np[0])+' × '+F$(np[1])+' × '+F$(np[2])+' ＝ '+F$(z));L.push('1 − '+F$(z));q='3人のうち少なくとも1人が'+vb[0]+'確率は';}
 return FR(q+ASK(pc),x,[fm(fm(ps[0],ps[1]),ps[2]),f1(x),fm(ps[0],ps[1])],5,L.join('<br>')+'<br>'+(v.k==='al'?'足して ':'')+F$(x),pc);}
A(FK,'kk4r-g9',THREE);A(FK,'kk5r-g5',THREE);A(FK,'kk5r-g6',THREE);
A(FK,'kk4r-g10',function(v){var n=v.n,k=v.k,x=[n*Math.pow(5,n-1),Math.pow(6,n)];return FR(k+'の目がちょうど1回出る確率はどれだけか。',x,[[Math.pow(5,n-1),Math.pow(6,n)],[1,6],[n,6]],4,k+'の目が出る回の選び方 '+n+'通り<br>1つの出方 1/6 × (5/6)<sup>'+(n-1)+'</sup> ＝ '+Math.pow(5,n-1)+'/'+Math.pow(6,n)+'<br>'+n+' × '+Math.pow(5,n-1)+'/'+Math.pow(6,n)+' ＝ '+F$(x));});
A(FK,'kk5r-g3',function(v,o){DEC=v.p?1:0;var n=v.n,p=v.pr,z=fpw(f1(p),n),x=f1(z);if(o.q.indexOf('Pが')<0)return null;
 return FR('Pが少なくとも1回勝つ確率は'+ASK(v.p),x,[z,fpw(p,n),fm([n,1],p)],5,'Pが'+n+'回とも負ける '+(DEC?dec(f1(p))+'<sup>'+n+'</sup>':'('+F$(f1(p))+')<sup>'+n+'</sup>')+' ＝ '+F$(z)+'<br>1 − '+F$(z)+' ＝ '+F$(x),v.p);});
A(FK,'kk5r-g4',function(v){var n=v.n,k=v.k;if(n<2)return null;var x=[C(n,2)*Math.pow(5,n-2),Math.pow(6,n)];
 return FR(k+'の目がちょうど2回出る確率はどれだけか。',x,[[Math.pow(5,n-2),Math.pow(6,n)],[C(n,2),36],[n*Math.pow(5,n-1),Math.pow(6,n)]],5,k+'の目が出る2回の選び方 '+Cs(n,2)+'<br>1つの出方 (1/6)<sup>2</sup> × (5/6)<sup>'+(n-2)+'</sup> ＝ '+Math.pow(5,n-2)+'/'+Math.pow(6,n)+'<br>'+C(n,2)+' × '+Math.pow(5,n-2)+'/'+Math.pow(6,n)+' ＝ '+F$(x));});
A(FK,'kk5r-g7',function(v,o){var a=v.a,b=v.b,n=a+b;if(o.q.indexOf('赤玉なら袋に戻し、白玉なら戻さずに')<0)return null;var x=fm([b,n],[b-1,n-1]);
 return FR('2回とも白玉を取り出す確率はどれだけか。',x,[[b*b,n*n],[b*(b-1),n*n],[a*a,n*n]],5,'1回目に白玉 '+b+'/'+n+'（袋に戻さない）<br>2回目に白玉 '+(b-1)+'/'+(n-1)+'<br>'+b+'/'+n+' × '+(b-1)+'/'+(n-1)+' ＝ '+F$(x));});
A(FK,'kk5r-g8',function(v){var n=v.n,k=v.k,m=n-k;if(m<3)return null;var x=fr(m*(m-1)*(m-2),n*(n-1)*(n-2));
 return FR('3人ともはずれを引く確率はどれだけか。',x,[[m*m*m,n*n*n],[m,n],[C(m,3)*6,n*n*n]],4,'A '+m+'/'+n+' × B '+(m-1)+'/'+(n-1)+' × C '+(m-2)+'/'+(n-2)+' ＝ '+F$(x));});
A(FK,'kk5r-g9',function(v){DEC=1;var p=v.p,q=v.q,x=fp(fm(q,p),fm(f1(q),q));
 return FR('今日が晴れでないとき、あさってが晴れる確率は何%か。',x,[fm(q,q),fm(q,p),fp(fm(p,p),fm(f1(p),q))],5,'明日が晴れ → あさって晴れ '+F$(q)+' × '+F$(p)+' ＝ '+F$(fm(q,p))+'<br>明日が晴れでない → あさって晴れ '+F$(f1(q))+' × '+F$(q)+' ＝ '+F$(fm(f1(q),q))+'<br>足して '+F$(x),1);});
A(FK,'bk114',function(v){var a=v.p1,z=fm(f1(a),f1(a)),x=f1(z);return FR('PとQの少なくともどちらか一方が大吉を引く確率はどれだけか。',x,[fm([2,1],a),z,fm(a,a)],4,'2人とも大吉ではない '+F$(f1(a))+' × '+F$(f1(a))+' ＝ '+F$(z)+'<br>1 − '+F$(z)+' ＝ '+F$(x));});
A(FK,'bk115',function(v){var a=v.a,b=v.b,vals=[],n=a+b;for(var i=0;i<a;i++)vals.push(50);for(var j=0;j<b;j++)vals.push(100);var tot=50*a+100*b,c=[];for(var t=50;t<tot;t+=50)if(t!==v.S)c.push(t);var T=pk(c),k=0;
 for(var m=0;m<(1<<n);m++){var s=0;for(var i2=0;i2<n;i2++)if(m>>i2&1)s+=vals[i2];if(s>=T)k++;}var x=[k,1<<n];
 return FR('この'+n+'枚を同時に投げて、表が出たものの金額の合計が'+T+'円以上になる確率はどれだけか。',x,[[k-1,1<<n],[k+1,1<<n],[k,(1<<n)*2]],4,'表裏の出方は全部で 2<sup>'+n+'</sup> ＝ '+(1<<n)+'通り<br>合計が'+T+'円以上になる出方を、100円玉の表の枚数で場合分けして数える → '+k+'通り<br>'+Q$(k,1<<n));});
A(FK,'bk121',function(v){var B=v.B,x=fm([v.x,B],[B-v.y,B]);return FR('この福袋を1袋購入するとき、商品PとYが入っている確率はどれだけか。',x,[fm([v.x,B],[v.y,B]),fm([B-v.x,B],[B-v.y,B]),[v.x+B-v.y,2*B]],5,'Pが入っている '+v.x+'/'+B+'、Yが入っている '+(B-v.y)+'/'+B+'<br>'+F$([v.x,B])+' × '+F$([B-v.y,B])+' ＝ '+F$(x));});
})();
