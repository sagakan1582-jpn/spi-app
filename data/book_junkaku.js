/* 問題集（テストセンター対策本）順列・組合せ 問88〜113、確率 問114〜126。担当C（2026-11-17）。
   問題文は問題集の文のまま、数値だけを変えるテンプレート。R.pick の先頭（または orig フラグ）が元の数値。
   bk:'92-1' のように問題集の番号を付ける。選択肢の数・形式は問題集どおり（4択・6択・「AからDのいずれでもない」つき5択）。 */
(function(){
var FJ='順列・組合せ',FK='確率';if(!BANK[FJ]||!BANK[FK])return;
var NONE='AからDのいずれでもない';
function fa(n){return n<=1?1:n*fa(n-1);}
function P(n,r){var x=1;for(var i=0;i<r;i++)x*=n-i;return x;}
function C(n,r){return r<0||r>n?0:Math.round(P(n,r)/fa(r));}
function H(n,r){return C(n+r-1,r);}
function T(h,r){return {table:{head:h,rows:r}};}
var JH=['','全体','選ぶ数','順番','公式'];
function Ps(n,r){if(r===0)return n+'P0 ＝ 1';var a=[];for(var i=0;i<r;i++)a.push(n-i);return n+'P'+r+' ＝ '+(r>1?a.join(' × ')+' ＝ ':'')+P(n,r);}
function Cs(n,r){if(r===0||r===n)return n+'C'+r+' ＝ 1';if(r===1)return n+'C1 ＝ '+n;var a=[],b=[];for(var i=0;i<r;i++){a.push(n-i);b.push(r-i);}return n+'C'+r+' ＝ ('+a.join(' × ')+') ÷ ('+b.join(' × ')+') ＝ '+C(n,r);}
function num(x,y){return x-y;}
function rng(a,b){var x=[];for(var i=a;i<=b;i++)x.push(i);return x;}
function cut(R,a,k){return R.shuffle(a).slice(0,k).sort(num);}
/* 整数の選択肢。n=4・6は数だけ、n=5は4つの数＋「AからDのいずれでもない」（ときどき正解がE） */
function uq(ans,wr,k){var s=[ans];wr.forEach(function(w){if(w>0&&w%1===0&&s.indexOf(w)<0&&s.length<k)s.push(w);});var d=Math.max(1,Math.round(ans/6)),i=1;while(s.length<k){[ans+d*i,ans-d*i].forEach(function(w){if(w>0&&s.indexOf(w)<0&&s.length<k)s.push(w);});i++;}return s;}
function chI(R,ans,wr,n,u,fmt){fmt=fmt||function(v){return v+u;};var s,c;
 if(n===5){s=uq(ans,wr,5);var e=R.pick([0,0,0,0,1]);s=e?s.slice(1):s.slice(0,4);s.sort(num);c=s.map(fmt);c.push(NONE);return {c:c,a:e?4:c.indexOf(fmt(ans))};}
 s=uq(ans,wr,n);s.sort(num);c=s.map(fmt);return {c:c,a:c.indexOf(fmt(ans))};}
/* 分数 */
function gc(a,b){return b?gc(b,a%b):a;}
function fr(n,d){var g=gc(n,d)||1;return [n/g,d/g];}
function fm(){var n=1,d=1;for(var i=0;i<arguments.length;i++){n*=arguments[i][0];d*=arguments[i][1];}return fr(n,d);}
function fp(){var n=0,d=1;for(var i=0;i<arguments.length;i++){var x=arguments[i];n=n*x[1]+x[0]*d;d*=x[1];var g=gc(n,d)||1;n/=g;d/=g;}return [n,d];}
function f1(a){return fr(a[1]-a[0],a[1]);}
function fpw(a,k){var r=[1,1];for(var i=0;i<k;i++)r=fm(r,a);return r;}
function fs(f){return f[1]===1?String(f[0]):f[0]+'/'+f[1];}
function chF(R,ans,wr,n){var L=[ans],seen={};seen[fs(ans)]=1;
 function put(f){if(L.length>=n||!f||!(f[0]>0)||!(f[1]>0)||f[0]%1||f[1]%1||f[0]>=f[1])return;f=fr(f[0],f[1]);if(seen[fs(f)])return;seen[fs(f)]=1;L.push(f);}
 wr.forEach(put);var k=1;while(L.length<n&&k<60){put([ans[0]*(k+1),ans[1]]);put([ans[0],ans[1]*(k+1)]);put([ans[0]+k,ans[1]]);put([ans[0],ans[1]+k]);put([ans[0]*k+1,ans[1]*k]);k++;}
 L.sort(function(x,y){return x[0]/x[1]-y[0]/y[1];});var c=L.map(fs);return {c:c,a:c.indexOf(fs(ans))};}
/* 問題集の選択肢（正解が問題集と同じ値になったときは、問題集と同じ選択肢を出す）。[選択肢, 正解] */
var BO={};(function(){var t={'88':'12 24 48 96|48','89':'11 12 22 24|12','90':'8 9 10 11|9','91':'14 34 35 68|34','92-1':'14 105 120 126|120','92-2':'16 60 120 2400|120',
 '93-1':'5 6 10 84|10','93-2':'5 6 18 36|6','94-1':'5 15 20 30|15','94-2':'20 30 45 60|60','95-1':'10 18 20 30|30','95-2':'20 35 40 120|20','95-3':'2 4 6 10|4',
 '96-1':'36 48 144 288|288','96-2':'24 36 72 144|24','96-3':'24 36 72 144|144','96-4':'24 132 264 528|528','97-1':'3 4 6 12|6','97-2':'4 6 12 24|24',
 '98-1':'6 24 48 144|48','98-2':'6 24 48 144|144','99-1':'6 12 24 48|12','99-2':'10 14 20 24|20','100-1':'15 60 180 360|360','100-2':'15 60 180 360|60','100-3':'6 36 180 216|216',
 '101-1':'6 12 24 48|24','101-2':'300 301 600 601|601','102-1':'24 35 70 840|35','102-2':'21 22 28 29|29','103-1':'15 28 36 56|15','103-2':'15 28 36 56|15','103-3':'15 28 36 56|36',
 '104-1':'6 7 10 11 12 15|10','104-2':'4 5 6 12 20 24|5','104-3':'140 280 560 650 720 800|560','105':'6 10 12 14 15 20|6','106':'6 10 12 14 15 20|15',
 '107-1':'11 22 24 27 30 33|27','107-2':'6 10 12 15 18 20|15','107-3':'12 18 20 24 30 36|36','108-1':'6! 7! 8! 9! 10! 11!|7!','108-2':'360 720 1080 1250 1360 1440|720','108-3':'360 720 1080 1250 1360 1440|1440',
 '109':'14 28 36 44 56 68|28','110':'10 15 28 30 45 56|30','111-1':'72 144 154 178 288 312|72','111-2':'72 144 154 178 288 312|144','111-3':'2 6 8 10 12 15|12',
 '112-1':'3 6 7 8 9 12|7','112-2':'3 7 9 12 15 42|15','113-1':'12 14 15 28 30 56|56','113-2':'15 30 45 60 81 90|45','113-3':'28 56 125 350 700 1400|350',
 '114':'1/50 1/25 1/10 3/10|1/25','115':'1/16 1/8 3/16 1/4|3/16','116-2':'1/6 5/12 1/3 1/2|1/6','116-3':'1/12 1/6 5/12 1/3|1/12','117-1':'4/27 4/9 1/2 2/3|4/9','117-2':'1/6 8/27 19/27 8/9|19/27',
 '118-1':'1/36 1/15 1/9 4/9|1/15','118-2':'1/36 4/15 1/2 8/15|8/15','119-1':'1/36 1/12 1/10 1/6|1/12','119-2':'1/36 1/12 1/9 5/36|5/36','120-1':'1/20 1/16 1/8 1/2|1/20',
 '120-2':'1/4 9/16 5/11 11/20|11/20','120-3':'1/4 9/20 9/16 11/20|9/20','121':'1/4 11/25 14/25 47/50|14/25','122-1':'1/9 1/5 1/4 1/3|1/5','122-2':'1/5 1/2 3/5 4/5|4/5',
 '122-3':'1/9 4/27 8/27 4/9|4/9','122-4':'1/9 4/27 8/27 4/9|8/27','123-1':'1/5 1/7 1/10 3/200|1/10','123-2':'9/500 3/200 2/125 3/500|2/125','124-1':'1/8 1/4 1/2 2/3|1/2',
 '124-2':'1/8 1/3 2/9 5/8|2/9','125-1':'6 12 15 20|12','125-2':'3 60 71 84|71','126-1':'7/32 15/64 49/64 25/32|15/64','126-2':'3/8 25/64 39/64 25/32|39/64'};
 for(var k in t){var x=t[k].split('|');BO[k]=[x[0].split(' '),x[1]];}})();
function bookOpts(ch,bk){var B=BO[bk];if(!B)return;var hasN=ch.c.indexOf(NONE)>=0;if(hasN&&ch.a===ch.c.indexOf(NONE))return;var val=ch.c[ch.a];if(val.indexOf(B[1])!==0)return;var u=val.slice(B[1].length);if(/^[0-9\/!]/.test(u))return;
 var c=B[0].map(function(x){return x+u;});if(hasN)c.push(NONE);ch.c=c;ch.a=c.indexOf(val);}
function mk(ch,q,inw,fig,calc,bk,v){bookOpts(ch,bk);ch.q=q;ch.inw=inw;ch.fig=fig;ch.calc=calc;ch.bk=bk;ch.v=v;return ch;}
function vs(o,s){return o.c.indexOf(s)>=0?s:(o.c.indexOf(NONE)>=0?NONE:s);}
function add(F,l,bk,make,verify){if(BANK[F]&&BANK[F][l])BANK[F][l].real.push({id:'bk'+bk,bk:bk,make:make,verify:verify});}
/* 総当たり用 */
function perms(n,cb){var a=rng(0,n-1),u=[];(function g(t){if(t.length===n){cb(t);return;}for(var i=0;i<n;i++)if(!u[i]){u[i]=1;t.push(i);g(t);t.pop();u[i]=0;}})([]);}
function seqs(len,k,cb){var t=[];(function g(){if(t.length===len){cb(t);return;}for(var i=0;i<k;i++){t.push(i);g();t.pop();}})();}
function inj(n,s,cb){var t=[],u=[];(function g(){if(t.length===n){cb(t);return;}for(var i=0;i<s;i++)if(!u[i]){u[i]=1;t.push(i);g();t.pop();u[i]=0;}})();}
function subs(n,k,cb){var t=[];(function g(st){if(t.length===k){cb(t);return;}for(var i=st;i<n;i++){t.push(i);g(i+1);t.pop();}})(0);}
var DAY=['月','火','水','木','金','土','日'],NM='PQRSTUVWXYZ';
function names(s,n){return s.slice(0,n).split('').join('、');}

/* ===================== 順列・組合せ ===================== */
/* 問88 */
add(FJ,4,'88',function(R){var n=R.pick([5,6,7]),pr=[[0,n-1]];for(var i=0;i<n;i++)for(var j=i+1;j<n;j++)if(!(i===0&&j===n-1))pr.push([i,j]);var p=R.pick([1,0])?pr[0]:R.pick(pr);
 var ans=2*fa(n-1),ch=chI(R,ans,[ans/4,ans/2,ans*2,fa(n),fa(n-1)],4,'通り');
 return mk(ch,DAY[0]+'曜日から'+DAY[n-1]+'曜日の'+n+'日間のイベントに'+names(NM,n)+'の'+n+'人のゲストが日替わりで1人ずつ出演する。Pが'+DAY[p[0]]+'曜日か'+DAY[p[1]]+'曜日どちらかのゲストである場合、'+n+'人それぞれが出演する曜日の組み合わせは何通りあるか。',
  'Pの曜日を先に決め、残りの'+(n-1)+'人を残りの'+(n-1)+'日に並べる',T(JH,[['P','2日','1日','','2'],['残り',(n-1)+'日',(n-1)+'人','あり',(n-1)+'P'+(n-1)],['計','','','','!2 × '+(n-1)+'P'+(n-1)]]),
  'Pの曜日 2通り（'+DAY[p[0]]+'・'+DAY[p[1]]+'）<br>'+Ps(n-1,n-1)+'<br>2 × '+fa(n-1)+' ＝ '+ans,'88',{n:n,p:p});
},function(v,o){var c=0;perms(v.n,function(t){if(t[0]===v.p[0]||t[0]===v.p[1])c++;});return vs(o,c+'通り');});

/* 問89 */
add(FJ,4,'89',function(R){var A,B;if(R.pick([1,0])){A=[0,2,4];B=[1,2,3,4];}else{var m=R.pick([5,6]);A=cut(R,rng(0,m-1),R.pick([2,3]));B=cut(R,rng(0,m-1),R.pick([4,5]));}
 var rows=[],L=[],ans=0;A.forEach(function(a){var b=B.filter(function(x){return x!==a;}).length,k=C(b,2);ans+=k;rows.push(['料理'+DAY[a],b+'日','2日','なし',b+'C2']);L.push('料理が'+DAY[a]+'曜日：テニスは'+B.filter(function(x){return x!==a;}).map(function(x){return DAY[x];}).join('・')+'から2日　'+Cs(b,2));});
 if(!(ans>0))return null;rows.push(['計','','','','!'+rows.map(function(r){return r[4];}).join(' ＋ ')]);
 var ch=chI(R,ans,[ans-1,ans*2,A.length*C(B.length,2),ans+2],4,'通り');
 return mk(ch,'料理教室には'+A.map(function(x){return DAY[x];}).join('、')+'のいずれかで週1回、テニススクールには'+B.map(function(x){return DAY[x];}).join('、')+'のいずれかで週2回行きたい。同じ曜日に2つの習い事が重ならないように通う組み合わせは何通りあるか。',
  '料理教室の曜日で場合分けし、残りの曜日からテニスの2日を選ぶ',T(JH,rows),L.join('<br>')+'<br>合計 '+ans,'89',{A:A,B:B});
},function(v,o){var c=0;v.A.forEach(function(a){subs(v.B.length,2,function(t){if(v.B[t[0]]!==a&&v.B[t[1]]!==a)c++;});});return vs(o,c+'通り');});

/* 問90 */
var CN=['オランダ','フランス','イタリア','スペイン','ドイツ','イギリス','ポルトガル'];
add(FJ,4,'90',function(R){var n=R.pick([5,6,7]),k=R.pick([3,2,4]);if(k>n-2)return null;var ans=C(n,k)-C(n-2,k);
 var ch=chI(R,ans,[ans-1,ans+1,ans+2,C(n,k)],4,'通り');
 return mk(ch,CN.slice(0,n).join('、')+'の'+n+'カ国のうちから'+k+'カ国を選んで旅行したい。少なくともオランダかフランスのどちらかを入れる選び方は何通りあるか。',
  '「少なくとも」は、全ての選び方から「どちらも入れない」選び方を引く（余事象）',T(JH,[['全体',n+'カ国',k+'カ国','なし',n+'C'+k],['どちらも入れない',(n-2)+'カ国',k+'カ国','なし',(n-2)+'C'+k],['計','','','','!'+n+'C'+k+' − '+(n-2)+'C'+k]]),
  Cs(n,k)+'<br>'+Cs(n-2,k)+'<br>'+C(n,k)+' − '+C(n-2,k)+' ＝ '+ans,'90',{n:n,k:k});
},function(v,o){var c=0;subs(v.n,v.k,function(t){if(t[0]<2)c++;});return vs(o,c+'通り');});

/* 問91 */
add(FJ,4,'91',function(R){var a=R.pick([4,5,3,6]),b=R.pick([3,4,2]),k=R.pick([4,3,5]);if(k>a+b-1)return null;var ans=C(a+b,k)-C(a,k)-C(b,k);
 var ch=chI(R,ans,[C(a+b,k),ans*2,a*b,ans-1],4,'通り');
 return mk(ch,'日本史'+a+'問、世界史'+b+'問から、'+k+'問を選んでテストに出題する。日本史と世界史のどちらも少なくとも1問は選ぶ場合、選び方は何通りあるか。ただし、出題する順番は考えないものとする。',
  '全ての選び方から、日本史だけ・世界史だけの選び方を引く',T(JH,[['全体',(a+b)+'問',k+'問','なし',(a+b)+'C'+k],['日本史だけ',a+'問',k+'問','なし',a+'C'+k],['世界史だけ',b+'問',k+'問','なし',b+'C'+k],['計','','','','!'+(a+b)+'C'+k+' − '+a+'C'+k+' − '+b+'C'+k]]),
  Cs(a+b,k)+'<br>日本史だけ '+(k>a?'0（'+a+'問しかない）':Cs(a,k))+'<br>世界史だけ '+(k>b?'0（'+b+'問しかない）':Cs(b,k))+'<br>'+C(a+b,k)+' − '+C(a,k)+' − '+C(b,k)+' ＝ '+ans,'91',{a:a,b:b,k:k});
},function(v,o){var c=0;subs(v.a+v.b,v.k,function(t){var j=t.filter(function(x){return x<v.a;}).length;if(j>0&&j<v.k)c++;});return vs(o,c+'通り');});

/* 問92 */
add(FJ,5,'92-1',function(R){var m=R.pick([5,6,4]),w=R.pick([4,3,5]),k=R.pick([5,4]);var rows=[],L=[],ans=0;
 for(var i=2;i<=Math.min(m,k-1);i++){var j=k-i;if(j<1||j>w)continue;var x=C(m,i)*C(w,j);ans+=x;rows.push(['男性'+i+'人・女性'+j+'人',m+'人・'+w+'人','','なし',m+'C'+i+' × '+w+'C'+j]);L.push('男性'+i+'人・女性'+j+'人　'+C(m,i)+' × '+C(w,j)+' ＝ '+x);}
 if(!(ans>0))return null;rows.push(['計','','','','!'+L.length+'つの場合の和']);
 var ch=chI(R,ans,[C(m+w,k),ans-15,C(m+w,k)-1,ans/2],4,'通り');
 return mk(ch,'男性'+m+'人、女性'+w+'人がいる。少なくとも男性2人と女性1人が含まれるように'+k+'人を選びたい。選び方は何通りあるか。',
  '男性・女性の人数の組み合わせで場合分けし、それぞれ男性の選び方 × 女性の選び方',T(JH,rows),L.join('<br>')+'<br>合計 '+ans,'92-1',{m:m,w:w,k:k});
},function(v,o){var c=0;subs(v.m+v.w,v.k,function(t){var x=t.filter(function(i){return i<v.m;}).length;if(x>=2&&v.k-x>=1)c++;});return vs(o,c+'通り');});
add(FJ,5,'92-2',function(R){var m=R.pick([5,6,4,3]),w=R.pick([4,3,5,6]);var ans=C(m,2)*C(w,2)*2;
 var ch=chI(R,ans,[ans/2,ans*20,m*w,C(m,2)*C(w,2)*4],4,'通り');
 return mk(ch,'男性'+m+'人、女性'+w+'人がいる。男女のペアを同時に2組選びたい。選び方は何通りあるか。',
  '男性2人と女性2人を選び、だれとだれを組にするか（2通り）を掛ける',T(JH,[['男性',m+'人','2人','なし',m+'C2'],['女性',w+'人','2人','なし',w+'C2'],['組み方','','','','2'],['計','','','','!'+m+'C2 × '+w+'C2 × 2']]),
  Cs(m,2)+'<br>'+Cs(w,2)+'<br>'+C(m,2)+' × '+C(w,2)+' × 2 ＝ '+ans,'92-2',{m:m,w:w});
},function(v,o){var pr=[];for(var i=0;i<v.m;i++)for(var j=0;j<v.w;j++)pr.push([i,j]);var c=0;subs(pr.length,2,function(t){var a=pr[t[0]],b=pr[t[1]];if(a[0]!==b[0]&&a[1]!==b[1])c++;});return vs(o,c+'通り');});

/* 問93 */
function q93(c){return '赤玉'+c+'個、白玉'+c+'個、黒玉'+c+'個、計'+(3*c)+'個の玉がある。ただし、同じ色の'+c+'個には区別はないものとする。';}
function cnt3(t,c){var n=0;for(var x=0;x<=c;x++)for(var y=0;y<=c;y++){var z=t-x-y;if(z>=0&&z<=c)n++;}return n;}
add(FJ,5,'93-1',function(R){var c=R.pick([3,4,5]),r=R.pick([3,2,4,5]);if(r>c)return null;var ans=H(3,r);
 var ch=chI(R,ans,[C(3*c,r),ans-4,ans*2,ans+8,C(r+3,3)],4,'通り');
 return mk(ch,q93(c)+r+'個を取り出すとき、'+r+'個の色の組み合わせは何通りあるか。','玉'+r+'個を○、色の区切りを｜2本として並べる（重複組み合わせ）',
  T(['','○','｜','並ぶ場所','公式'],[['',r+'個','2本',(r+2)+'か所','!'+(r+2)+'C2']]),Cs(r+2,2),'93-1',{c:c,r:r});
},function(v,o){return vs(o,cnt3(v.r,v.c)+'通り');});
add(FJ,5,'93-2',function(R){var c=R.pick([3,4,5]),L=R.pick([2,1,3,4]);if(L>c)return null;var t=3*c-L,ans=H(3,L);
 var ch=chI(R,ans,[ans-1,H(3,t),ans*3,ans*6],4,'通り');
 return mk(ch,q93(c)+t+'個を取り出すとき、'+t+'個の色の組み合わせは何通りあるか。','各色'+c+'個までなので、取り出す'+t+'個ではなく、<b>取り出さずに残る'+L+'個</b>の色の組み合わせを数える（残る'+L+'個が決まれば取り出す'+t+'個も決まる）',
  T(['','○','｜','並ぶ場所','公式'],[['残る玉',L+'個','2本',(L+2)+'か所','!'+(L+2)+'C2']]),'残る玉 '+(3*c)+' − '+t+' ＝ '+L+'個（各色'+c+'個以下なので制限なし）<br>'+Cs(L+2,2),'93-2',{c:c,t:t});
},function(v,o){return vs(o,cnt3(v.t,v.c)+'通り');});

/* 問94 */
function parts(n,s){/* n人をs人ずつの組（区別なし）に分ける数を総当たり */if(n===0)return 1;var c=0;subs(n-1,s-1,function(){c++;});return c*parts(n-s,s);}
add(FJ,5,'94-1',function(R){var p=R.pick([[6,2],[4,2],[8,2],[6,3],[8,4],[9,3]]),n=p[0],s=p[1],g=n/s,ans=fa(n)/(Math.pow(fa(s),g)*fa(g));
 var rows=[],k=n,pr=[];for(var i=0;i<g;i++){rows.push([i+1+'つ目',k+'人',s+'人','なし',k+'C'+s]);pr.push(C(k,s));k-=s;}rows.push(['組の区別なし','','','','÷ '+g+'!']);rows.push(['計','','','','!'+rows.slice(0,g).map(function(r){return r[4];}).join(' × ')+' ÷ '+g+'!']);
 var ch=chI(R,ans,[ans*fa(g),ans*2,ans/fa(g-1)*2,ans+5],4,'通り');
 return mk(ch,n+'人の社員を'+g+'つのグループに分ける。'+s+'人ずつに分ける場合、その組み合わせは何通りあるか。ただし、グループの区別（1組、2組、3組やA、B、Cなど）はしないものとする。',
  s+'人ずつ順に選び、グループに区別がないので'+g+'!で割る',T(JH,rows),pr.join(' × ')+' ＝ '+(ans*fa(g))+'<br>'+(ans*fa(g))+' ÷ '+fa(g)+' ＝ '+ans,'94-1',{n:n,s:s});
},function(v,o){return vs(o,parts(v.n,v.s)+'通り');});
add(FJ,5,'94-2',function(R){var p=R.pick([[3,2,1],[4,2,1],[4,3,1],[5,2,1],[4,3,2],[5,3,1]]),n=p[0]+p[1]+p[2],ans=C(n,p[0])*C(n-p[0],p[1]);
 var ch=chI(R,ans,[ans/2,ans/6,ans*2,C(n,p[0])],4,'通り');
 return mk(ch,n+'人の社員を3つのグループに分ける。'+p[0]+'人と'+p[1]+'人と'+p[2]+'人に分ける場合、その組み合わせは何通りあるか。',
  '人数が違うグループは区別がつくので、割る必要はない。'+p[0]+'人を選び、残りから'+p[1]+'人を選ぶと、残りが'+p[2]+'人のグループ',
  T(JH,[[p[0]+'人のグループ',n+'人',p[0]+'人','なし',n+'C'+p[0]],[p[1]+'人のグループ',(n-p[0])+'人',p[1]+'人','なし',(n-p[0])+'C'+p[1]],[p[2]+'人のグループ','残り','','','1'],['計','','','','!'+n+'C'+p[0]+' × '+(n-p[0])+'C'+p[1]]]),
  Cs(n,p[0])+'<br>'+Cs(n-p[0],p[1])+'<br>'+C(n,p[0])+' × '+C(n-p[0],p[1])+' ＝ '+ans,'94-2',{p:p});
},function(v,o){var n=v.p[0]+v.p[1]+v.p[2],c=0;seqs(n,3,function(t){var k=[0,0,0];t.forEach(function(x){k[x]++;});if(k[0]===v.p[0]&&k[1]===v.p[1])c++;});return vs(o,c+'通り');});

/* 問95 */
function q95(w){return 'P氏とQ氏が将棋で対戦し、先に'+w+'勝した方がタイトルを獲得する。なお、引き分け（千日手、持将棋）はないものとする。';}
function games(p,q){/* Pがあとp勝、Qがあとq勝で決着。決着までの勝ち負けの並びを総当たりで数え、[決着局数ごとの数] を返す */var res={};(function g(a,b,k){if(a===p||b===q){res[k]=(res[k]||0)+1;return;}g(a+1,b,k+1);g(a,b+1,k+1);})(0,0,0);return res;}
add(FJ,5,'95-1',function(R){var w=R.pick([4,3,5]),g=R.pick([6,5,4,7,8]);if(g<w+1||g>2*w-2)return null;var L=[],ans=0;
 for(var k=w;k<=g;k++){var x=2*C(k-1,w-1);ans+=x;L.push(k+'局目で決着：最後の'+k+'局目に勝った方が'+w+'勝目。前の'+(k-1)+'局で'+(w-1)+'勝 → 2 × '+(k-1)+'C'+(w-1)+' ＝ '+x);}
 var ch=chI(R,ans,[ans-10,ans-12,ans/2,ans*2],4,'通り');
 return mk(ch,q95(w)+g+'局目終了までに決着がつく場合、考えられるパターンは何通りあるか。','決着がつく局で場合分けする。最後の局は勝った方の'+w+'勝目に決まっているので、それより前の局で'+(w-1)+'勝する局を選ぶ。どちらが勝つかで×2',
  T(['決着の局','前の局数','選ぶ勝ち数','公式'],rng(w,g).map(function(k){return [k+'局目',(k-1)+'局',(w-1)+'勝','2 × '+(k-1)+'C'+(w-1)];}).concat([['計','','','!和']])),L.join('<br>')+'<br>合計 '+ans,'95-1',{w:w,g:g});
},function(v,o){var r=games(v.w,v.w),c=0;for(var k in r)if(+k<=v.g)c+=r[k];return vs(o,c+'通り');});
add(FJ,5,'95-2',function(R){var w=R.pick([4,3,5]),k=R.pick([7,6,5,8,9]);if(k<w+1||k>2*w-1)return null;var ans=C(k-1,w-1);
 var ch=chI(R,ans,[2*ans,C(k,w),ans+15,C(k-1,w)],4,'通り');
 return mk(ch,q95(w)+k+'局目に決着がつき、P氏が勝った。考えられるパターンは何通りあるか。','最後の'+k+'局目はP氏の'+w+'勝目に決まっている。前の'+(k-1)+'局のうち、P氏が勝つ'+(w-1)+'局を選ぶ',
  T(JH,[['前の局',(k-1)+'局',(w-1)+'局','なし','!'+(k-1)+'C'+(w-1)]]),Cs(k-1,w-1),'95-2',{w:w,k:k});
},function(v,o){var c=0;seqs(v.k,2,function(t){var a=0,b=0,end=0;for(var i=0;i<t.length;i++){if(t[i])a++;else b++;if(a===v.w||b===v.w){end=i+1;break;}}if(end===v.k&&a===v.w)c++;});return vs(o,c+'通り');});
add(FJ,5,'95-3',function(R){var w=R.pick([4,3,5]),a=R.pick([3,2,1,4]),b=R.pick([1,2,0,3]);if(a>=w||b>=w||(a===0&&b===0))return null;var p=w-a,q=w-b,ans=C(p+q,p),L=[];
 for(var j=0;j<q;j++)L.push('P氏が'+(p+j)+'局目で勝つ（その間にQ氏が'+j+'勝）：'+(p+j-1)+'C'+j+' ＝ '+C(p+j-1,j));for(j=0;j<p;j++)L.push('Q氏が'+(q+j)+'局目で勝つ（その間にP氏が'+j+'勝）：'+(q+j-1)+'C'+j+' ＝ '+C(q+j-1,j));
 var ch=chI(R,ans,[ans-2,ans+2,ans*2,p+q,ans-1],4,'通り');
 return mk(ch,q95(w)+'今までにP氏が'+a+'勝、Q氏が'+b+'勝している。ここから、今後決着がつくまでのパターンは何通りあるか。','P氏はあと'+p+'勝、Q氏はあと'+q+'勝で決着。どちらが何局目で勝つかで場合分けし、最後の局の前の勝ち負けの並びを数える',
  T(['','あと何勝','',''],[['P氏',p+'勝','',''],['Q氏',q+'勝','','']]),L.join('<br>')+'<br>合計 '+ans,'95-3',{p:p,q:q});
},function(v,o){var r=games(v.p,v.q),c=0;for(var k in r)c+=r[k];return vs(o,c+'通り');});

/* 問96 */
var SV96='<svg viewBox="0 0 300 140" width="300" style="display:block;max-width:100%;margin:8px 0" font-size="15" text-anchor="middle" fill="currentColor"><circle cx="70" cy="70" r="36" fill="none" stroke="currentColor"/><text x="70" y="75">ア</text>'+
 [['①',70,22],['②',27,48],['③',27,102],['④',70,128],['⑤',113,102],['⑥',113,48]].map(function(a){return '<text x="'+a[1]+'" y="'+a[2]+'">'+a[0]+'</text>';}).join('')+
 '<rect x="205" y="15" width="50" height="110" rx="6" fill="none" stroke="currentColor"/><text x="230" y="75">イ</text>'+
 [['①',188,35],['③',188,75],['⑤',188,115],['②',272,35],['④',272,75],['⑥',272,115]].map(function(a){return '<text x="'+a[1]+'" y="'+a[2]+'">'+a[0]+'</text>';}).join('')+'</svg>';
var CIR=['①','②','③','④','⑤','⑥'];
function q96(n){return names(NM,n)+'の'+n+'人で、下図のアまたはイ、どちらかのテーブルにまとまって座りたい。ただし、各テーブルの席には①から⑥までの番号がつけられていて、区別するものとする。'+SV96;}
function pq(R,n){return R.pick([1,0])?[0,1]:cut(R,rng(0,n-1),2);}
var ADJA=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]],ADJI=[[0,2],[2,4],[1,3],[3,5]],OPA=[[0,3],[1,4],[2,5]],OPI=[[0,1],[2,3],[4,5]];
function isp(L,a,b){return L.some(function(e){return (e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a);});}
add(FJ,5,'96-1',function(R){var n=R.pick([6,5,4]),x=pq(R,n),X=NM[x[0]],Y=NM[x[1]],r=P(4,n-2),ans=12*r;
 var ch=chI(R,ans,[ans/8,ans/6,ans/2,ans*2],4,'通り');
 return mk(ch,q96(n)+'アのテーブルで、'+X+'と'+Y+'が隣同士になるように'+n+'人が座る座り方は何通りか。','席に番号があるので円順列（回転して同じを1通り）ではない。隣り合う2席の選び方（①②、②③…⑥①の6通り）× 2人の座り方 × 残り'+(n-2)+'人の座り方',
  T(JH,[['隣の2席','6組','1組','','6'],[X+'・'+Y,'2人','2人','あり','2P2'],['残り','4席',(n-2)+'人','あり','4P'+(n-2)],['計','','','','!6 × 2 × 4P'+(n-2)]]),'6 × 2 × '+r+' ＝ '+ans,'96-1',{n:n,x:x});
},function(v,o){var c=0;inj(v.n,6,function(t){if(isp(ADJA,t[v.x[0]],t[v.x[1]]))c++;});return vs(o,c+'通り');});
add(FJ,5,'96-2',function(R){var n=R.pick([6,5]),s=R.pick([1,0,2,3,4,5]),k=R.pick([1,0])?[0,1,2]:R.shuffle(rng(0,n-1)).slice(0,3);var X=NM[k[0]],Y=NM[k[1]],Z=NM[k[2]],r=P(3,n-3),ans=4*r;
 var ch=chI(R,ans,[ans*1.5,ans*3,ans*6,ans/2],4,'通り');
 return mk(ch,q96(n)+'アのテーブルで、'+CIR[s]+'に'+X+'が座った。このとき'+Y+'と'+Z+'の2人が向かい合うように'+n+'人が座る座り方は何通りか。なお、「向かい合う」とは、①と④、②と⑤、③と⑥の位置関係である。',
  CIR[s]+'と'+CIR[(s+3)%6]+'は'+X+'の席とその向かいなので使えない。残る向かい合わせの席の組は2組',T(JH,[['向かい合う席','2組','1組','','2'],[Y+'・'+Z,'2人','2人','あり','2P2'],['残り','3席',(n-3)+'人','あり','3P'+(n-3)],['計','','','','!2 × 2 × 3P'+(n-3)]]),'2 × 2 × '+r+' ＝ '+ans,'96-2',{n:n,s:s,k:k});
},function(v,o){var c=0;inj(v.n,6,function(t){if(t[v.k[0]]===v.s&&isp(OPA,t[v.k[1]],t[v.k[2]]))c++;});return vs(o,c+'通り');});
add(FJ,5,'96-3',function(R){var n=R.pick([6,5,4]),x=pq(R,n),X=NM[x[0]],Y=NM[x[1]],r=P(4,n-2),ans=6*r;
 var ch=chI(R,ans,[ans/6,ans/4,ans/2,ans*2],4,'通り');
 return mk(ch,q96(n)+'イのテーブルで、'+X+'と'+Y+'が向かい合うように'+n+'人が座る座り方は何通りか。なお、「向かい合う」とは、①と②、③と④、⑤と⑥の位置関係である。','向かい合う席の組（3組）× 2人の座り方 × 残り'+(n-2)+'人の座り方',
  T(JH,[['向かい合う席','3組','1組','','3'],[X+'・'+Y,'2人','2人','あり','2P2'],['残り','4席',(n-2)+'人','あり','4P'+(n-2)],['計','','','','!3 × 2 × 4P'+(n-2)]]),'3 × 2 × '+r+' ＝ '+ans,'96-3',{n:n,x:x});
},function(v,o){var c=0;inj(v.n,6,function(t){if(isp(OPI,t[v.x[0]],t[v.x[1]]))c++;});return vs(o,c+'通り');});
add(FJ,5,'96-4',function(R){var n=R.pick([6,5,4]),x=pq(R,n),X=NM[x[0]],Y=NM[x[1]],r=P(4,n-2),all=P(6,n),ad=8*r,ans=all-ad;
 var ch=chI(R,ans,[ad/8,ad,ans/2,all-6*r*2],4,'通り');
 return mk(ch,q96(n)+'イのテーブルで、'+X+'と'+Y+'が隣同士にならないように'+n+'人が座る座り方は何通りか。','全ての座り方から、隣同士になる座り方を引く。イで隣同士になる席は①③、③⑤、②④、④⑥の4組（向かい合う席は隣ではない）',
  T(JH,[['全体','6席',n+'人','あり','6P'+n],['隣同士','4組×2人','','あり','4 × 2 × 4P'+(n-2)],['計','','','','!6P'+n+' − 4 × 2 × 4P'+(n-2)]]),Ps(6,n)+'<br>隣同士 4 × 2 × '+r+' ＝ '+ad+'<br>'+all+' − '+ad+' ＝ '+ans,'96-4',{n:n,x:x});
},function(v,o){var c=0;inj(v.n,6,function(t){if(!isp(ADJI,t[v.x[0]],t[v.x[1]]))c++;});return vs(o,c+'通り');});

/* 問97 */
var SV97='<svg viewBox="0 0 300 130" width="300" style="display:block;max-width:100%;margin:8px 0" font-size="14" text-anchor="middle" fill="none" stroke="currentColor"><text x="20" y="14" fill="currentColor" stroke="none">ア</text><path d="M15 122 L15 75 Q15 20 70 20 L125 20 L125 122 Z"/><circle cx="72" cy="72" r="34"/><line x1="48" y1="48" x2="96" y2="96"/><line x1="96" y1="48" x2="48" y2="96"/>'+
 '<text x="215" y="14" fill="currentColor" stroke="none">イ</text><path d="M230 18 L170 122 L290 122 Z"/><circle cx="230" cy="88" r="24"/><line x1="230" y1="64" x2="230" y2="112"/></svg>';
var COL=['赤','青','黄','緑','白','黒'];
function q97(){return '下の図形アと図形イの線で囲まれた領域すべてに色を塗りたい。'+SV97;}
add(FJ,5,'97-1',function(R){var k=R.pick([3,4]),cs=R.pick([1,0])?COL.slice(0,k):cut(R,rng(0,5),k).map(function(i){return COL[i];});if(R.pick([1,0])===0&&k===3)cs=R.shuffle(cs);
 var m=k-1,cyc=Math.pow(m-1,4)+(m-1),ans=k*cyc;var ch=chI(R,ans,[ans/2,ans*2,ans/3*2,k*Math.pow(m,4)],4,'通り');
 return mk(ch,q97()+'図形アに色を塗りたい。'+cs.join('、')+'の'+k+'色が使えるとき、色の塗り方は何通りか。ただし、線で隣り合う領域には同じ色が使えないものとする。',
  '外側の領域は円の中の4つの領域すべてと隣り合う。外側の色を先に決め、円の中の4つ（輪のように隣り合う）を残りの'+m+'色で塗る。向かい合う2つ（点で接するだけ）は同じ色でもよい',
  T(['領域','使える色','塗り方'],[['外側',k+'色',k],['円の中4つ',m+'色',m===2?'2（交互の2通り）':'場合分け '+cyc],['計','','!'+k+' × '+cyc]]),
  m===2?'外側 '+k+'通り。円の中は残り2色を交互に塗るしかなく2通り<br>'+k+' × 2 ＝ '+ans:'外側 '+k+'通り。円の中：向かい合う2組がどちらも同じ色 '+m+' × '+(m-1)+' ＝ '+m*(m-1)+'、片方だけ同じ色 2 × '+m+' × '+(m-1)+' × '+(m-2)+' ＝ '+2*m*(m-1)*(m-2)+'、どちらも違う色 '+Ps(m,4).split(' ＝ ').pop()+'<br>合計 '+cyc+'<br>'+k+' × '+cyc+' ＝ '+ans,'97-1',{k:k});
},function(v,o){var c=0;seqs(5,v.k,function(t){/* t[0]外側、t[1]〜t[4]円の中（輪） */for(var i=1;i<=4;i++){if(t[i]===t[0])return;if(t[i]===t[i%4+1])return;}c++;});return vs(o,c+'通り');});
add(FJ,5,'97-2',function(R){var k=R.pick([4,3,5,6]),cs=R.pick([1,0])?COL.slice(0,k):cut(R,rng(0,5),k).map(function(i){return COL[i];});var ans=k*(k-1)*(k-2);
 var ch=chI(R,ans,[ans/2,ans/4,ans/6,k*(k-1)*(k-1)],4,'通り');
 return mk(ch,q97()+'図形イに色を塗りたい。'+cs.join('、')+'の'+k+'色が使えるとき、色の塗り方は何通りか。ただし、線で隣り合う領域には同じ色が使えないものとする。',
  '外側・円の左・円の右の3つはどれも互いに隣り合うので、すべて違う色。'+k+'色から3色を選んで並べる順列',T(JH,[['3つの領域',k+'色','3色','あり','!'+k+'P3']]),Ps(k,3),'97-2',{k:k});
},function(v,o){var c=0;seqs(3,v.k,function(t){if(t[0]!==t[1]&&t[1]!==t[2]&&t[0]!==t[2])c++;});return vs(o,c+'通り');});

/* 問98 */
function q98(m,w){return '男性'+m+'人、女性'+w+'人が並んで写真を撮ることになった。';}
add(FJ,4,'98-1',function(R){var p=R.pick([[4,2],[2,2],[6,2],[4,3],[2,3],[4,1]]),m=p[0],w=p[1],n=m+w,ans=fa(w)*fa(m);
 var ch=chI(R,ans,[fa(m),ans*2,ans*3,ans/2],4,'通り');
 return mk(ch,q98(m,w)+n+'人が横一列になって、女性'+w+'人が真ん中に入る並び方は何通りあるか。','真ん中の'+w+'席に女性'+w+'人、残りの'+m+'席に男性'+m+'人を並べる',
  T(JH,[['真ん中',w+'席',w+'人','あり',w+'P'+w],['残り',m+'席',m+'人','あり',m+'P'+m],['計','','','','!'+w+'P'+w+' × '+m+'P'+m]]),Ps(w,w)+'<br>'+Ps(m,m)+'<br>'+fa(w)+' × '+fa(m)+' ＝ '+ans,'98-1',{m:m,w:w});
},function(v,o){var n=v.m+v.w,lo=(n-v.w)/2,c=0;perms(n,function(t){for(var i=0;i<n;i++){var wom=t[i]<v.w,mid=i>=lo&&i<lo+v.w;if(wom!==mid)return;}c++;});return vs(o,c+'通り');});
add(FJ,4,'98-2',function(R){var p=R.pick([[4,2],[2,2],[6,2],[5,3],[3,3],[4,4],[3,1]]),m=p[0],w=p[1],n=m+w,k=n/2,ans=P(k,w)*fa(n-w);
 var ch=chI(R,ans,[ans/6,ans/3,fa(n)/2,ans*2],4,'通り');
 return mk(ch,q98(m,w)+'前列'+k+'人、後列'+k+'人で並び、女性'+w+'人を前列にする並び方は何通りあるか。','前列の'+k+'席に女性'+w+'人を並べ、残りの'+(n-w)+'席に男性'+m+'人を並べる',
  T(JH,[['女性','前列'+k+'席',w+'人','あり',k+'P'+w],['男性',(n-w)+'席',m+'人','あり',m+'P'+m],['計','','','','!'+k+'P'+w+' × '+m+'P'+m]]),Ps(k,w)+'<br>'+Ps(m,m)+'<br>'+P(k,w)+' × '+fa(m)+' ＝ '+ans,'98-2',{m:m,w:w});
},function(v,o){var n=v.m+v.w,k=n/2,c=0;perms(n,function(t){for(var i=0;i<n;i++)if(t[i]<v.w&&i>=k)return;c++;});return vs(o,c+'通り');});

/* 問99 */
function q99(n){var s=n===5?'VWXYZ':n===6?'UVWXYZ':'WXYZ';return [s,names(s,n)+'の'+n+'人を縦一列に並ぶ'+n+'席に座らせる。'];}
add(FJ,5,'99-1',function(R){var n=R.pick([5,6]),p=R.pick([3,2,4,5]);if(p>n-1)return null;var Q=q99(n),s=Q[0],x=R.pick([1,0])?['V','Z']:R.shuffle(s.split('')).slice(0,2),ans=(n-p)*fa(n-2);
 var ch=chI(R,ans,[ans/2,ans*2,ans*4,fa(n-1)],4,'通り');
 return mk(ch,Q[1]+x[0]+'が前から'+p+'番目に入り、'+x[0]+'より前に'+x[1]+'がいない並べ方は何通りあるか。',x[0]+'の席は決まっている。'+x[1]+'は'+x[0]+'より後ろの'+(n-p)+'席のどれか。残り'+(n-2)+'人は残りの席に並べる',
  T(JH,[[x[1],(n-p)+'席','1人','',String(n-p)],['残り',(n-2)+'席',(n-2)+'人','あり',(n-2)+'P'+(n-2)],['計','','','','!'+(n-p)+' × '+(n-2)+'P'+(n-2)]]),(n-p)+' × '+fa(n-2)+' ＝ '+ans,'99-1',{n:n,p:p,x:x,s:s});
},function(v,o){var c=0;perms(v.n,function(t){var a=t[v.s.indexOf(v.x[0])],b=t[v.s.indexOf(v.x[1])];if(a===v.p-1&&b>a)c++;});return vs(o,c+'通り');});
add(FJ,5,'99-2',function(R){var n=R.pick([5,6,4]),Q=q99(n),s=Q[0],x=R.pick([1,0])&&n===5?['Y','W','X']:R.shuffle(s.split('')).slice(0,3),ans=fa(n)/6;
 var ch=chI(R,ans,[ans/2,ans*1.2,ans*1.4,ans*2],4,'通り');
 return mk(ch,Q[1]+x[0]+'より前に'+x[1]+'がいて、'+x[0]+'より後ろに'+x[2]+'がいる並べ方は何通りあるか。',x[1]+'・'+x[0]+'・'+x[2]+'の3人の前後の順番は1通りに決まっている。全ての並べ方のうち、この3人の並び順（3P3 ＝ 6通り）のうちの1つだけを数えるので6で割る',
  T(JH,[['全体',n+'席',n+'人','あり',n+'P'+n],['3人の順','','','','÷ 3P3'],['計','','','','!'+n+'P'+n+' ÷ 6']]),Ps(n,n)+'<br>'+fa(n)+' ÷ 6 ＝ '+ans,'99-2',{n:n,x:x,s:s});
},function(v,o){var c=0;perms(v.n,function(t){var y=t[v.s.indexOf(v.x[0])],w=t[v.s.indexOf(v.x[1])],x=t[v.s.indexOf(v.x[2])];if(w<y&&x>y)c++;});return vs(o,c+'通り');});

/* 問100 */
function q100(d){return rng(1,d).join('、')+'の数字を使って整数を作りたい。';}
add(FJ,4,'100-1',function(R){var d=R.pick([6,5,7]),L=R.pick([4,3,5]);if(L>d)return null;var ans=P(d,L);
 var ch=chI(R,ans,[C(d,L),ans/2,ans/6,ans*2,Math.pow(d,L)],5,'個');
 return mk(ch,q100(d)+'各位の数字が異なる'+L+'けたの整数の個数はいくつか。',d+'個の数字から'+L+'個を選んで並べる順列',T(JH,[['数字',d+'個',L+'個','あり','!'+d+'P'+L]]),Ps(d,L),'100-1',{d:d,L:L});
},function(v,o){var c=0;seqs(v.L,v.d,function(t){if(new Set(t).size===v.L)c++;});return vs(o,c+'個');});
add(FJ,4,'100-2',function(R){var d=R.pick([6,5,7]),L=R.pick([4,3,5]);if(L>d)return null;var ans=P(d-1,L-1);
 var ch=chI(R,ans,[C(d-1,L-1),ans/4,ans*3,ans*6,P(d,L)],5,'個');
 return mk(ch,q100(d)+'各位の数字が異なる'+L+'けたの5の倍数の個数はいくつか。','5の倍数は一の位が0か5。0はないので一の位は5に決まる。残りの'+(L-1)+'けたを5以外の'+(d-1)+'個から並べる',
  T(['','全体','選ぶ数','順番','公式'],[['一の位','','5','','1'],['残り',(d-1)+'個',(L-1)+'個','あり',(d-1)+'P'+(L-1)],['計','','','','!'+(d-1)+'P'+(L-1)]]),Ps(d-1,L-1),'100-2',{d:d,L:L});
},function(v,o){var c=0;seqs(v.L,v.d,function(t){if(new Set(t).size===v.L&&t[v.L-1]===4)c++;});return vs(o,c+'個');});
add(FJ,4,'100-3',function(R){var d=R.pick([6,5,7]),L=R.pick([6,5,7]),f=L-3,ans=Math.pow(d,f);
 var ch=chI(R,ans,[P(d,f),C(d+f-1,f),ans/6,Math.pow(d,f+1)/2,ans*2],5,'個');
 return mk(ch,q100(d)+'末尾が111である'+L+'けたの整数の個数はいくつか。ただし、同じ数字を何回使ってもよいものとする。','下3けたは111に決まっている。残りの'+f+'けたはそれぞれ'+d+'通り（同じ数字を何回使ってもよい＝重複順列）',
  T(['','上の'+f+'けた','各けた','公式'],[['','!'+f+'けた',d+'通り','!'+d+'<sup>'+f+'</sup>']]),rng(1,f).map(function(){return d;}).join(' × ')+' ＝ '+ans,'100-3',{d:d,f:f});
},function(v,o){var c=0;seqs(v.f,v.d,function(){c++;});return vs(o,c+'個');});

/* 問101 */
function q101(m){return rng(0,m).join('、')+'のカードが1枚ずつ、計'+(m+1)+'枚ある。このうち何枚かを1列に並べて数を作る。ただし、0を一番上の位に使うことはできない。';}
add(FJ,4,'101-1',function(R){var m=R.pick([5,6,4]),x=R.pick([3,1,2,4,5,6]),L=R.pick([3,2]);if(x>m)return null;var ans=P(m-1,L);
 var ch=chI(R,ans,[ans/2,ans*2,P(m,L),P(m-1,L-1)*(m-1)-ans/2,ans/4],5,'通り');
 return mk(ch,q101(m)+'0と'+x+'がどの位にも入っていない'+L+'けたの自然数は何通り作れるか。','0と'+x+'を除いた'+(m-1)+'枚から'+L+'枚を選んで並べる（0がないので一番上の位の制限もない）',T(JH,[['カード',(m-1)+'枚',L+'枚','あり','!'+(m-1)+'P'+L]]),Ps(m-1,L),'101-1',{m:m,x:x,L:L});
},function(v,o){var c=0;seqs(v.L,v.m+1,function(t){if(new Set(t).size===v.L&&t[0]!==0&&t.indexOf(0)<0&&t.indexOf(v.x)<0)c++;});return vs(o,c+'通り');});
add(FJ,4,'101-2',function(R){var m=R.pick([5,4,6]),D;if(R.pick([1,0])&&m===5)D=[5,4,3,2,0];else D=[m].concat(R.shuffle(rng(0,m-1)).slice(0,m-1));
 var N=+D.join(''),full=m*fa(m),u=[],sm=0,L=[];
 for(var i=0;i<m;i++){var g=0;for(var dd=D[i]+1;dd<=m;dd++)if(u.indexOf(dd)<0)g++;var rest=P(m+1-(i+1),m-(i+1));if(g){sm+=g*rest;L.push('上から'+(i+1)+'けた目まで'+D.slice(0,i).join('')+'が同じで、'+(i+1)+'けた目が'+D[i]+'より大きい（'+g+'通り）：'+g+' × '+rest+' ＝ '+g*rest);}u.push(D[i]);}
 var ans=full+sm,ch=chI(R,ans,[full,ans-1,full/2+sm,full/2,ans+1],5,'通り');
 return mk(ch,q101(m)+N+'より大きな自然数は何通り作れるか。',(m+1)+'けたの数（'+(m+1)+'枚全部を使う）はすべて'+N+'より大きい。'+m+'けたの数は、上の位から'+N+'と比べて大きくなるものを数える',
  T(['','一番上','残り','公式'],[[(m+1)+'けた',m+'通り',m+'枚を並べる','!'+m+' × '+m+'P'+m],[m+'けた','','','!上の位から比べる']]),
  (m+1)+'けた：'+m+' × '+fa(m)+' ＝ '+full+'<br>'+m+'けた：'+(L.length?L.join('<br>'):'なし')+'（計'+sm+'）<br>'+full+' ＋ '+sm+' ＝ '+ans,'101-2',{m:m,N:N});
},function(v,o){var c=0;for(var len=1;len<=v.m+1;len++)seqs(len,v.m+1,function(t){if(new Set(t).size===len&&!(t[0]===0&&len>1)&&+t.join('')>v.N)c++;});return vs(o,c+'通り');});

/* 問102 */
function q102(n){return '裏表のあるコインを'+n+'回投げた。';}
add(FJ,4,'102-1',function(R){var n=R.pick([7,6,8,5]),k=R.pick([4,3,2,5]);if(k>=n)return null;var ans=C(n,k);
 var ch=chI(R,ans,[P(n,k)/fa(k-1),ans*2,P(n,k),ans-11,ans+5],5,'通り');
 return mk(ch,q102(n)+'表が'+k+'回だけ出るような表裏の出方は何通りあるか。',n+'回のうち、表が出る'+k+'回を選ぶ組み合わせ',T(JH,[['回',n+'回',k+'回','なし','!'+n+'C'+k]]),Cs(n,k),'102-1',{n:n,k:k});
},function(v,o){var c=0;seqs(v.n,2,function(t){if(t.filter(Boolean).length===v.k)c++;});return vs(o,c+'通り');});
add(FJ,4,'102-2',function(R){var n=R.pick([7,6,8,5]),j=R.pick([5,4,6,3]);if(j>=n||j<n/2)return null;var L=[],ans=0;for(var k=j;k<=n;k++){ans+=C(n,k);L.push(Cs(n,k));}
 var ch=chI(R,ans,[ans-8,ans-7,ans-1,C(n,j),ans+1],5,'通り');
 return mk(ch,q102(n)+'裏が'+j+'回以上出るような表裏の出方は何通りあるか。','裏が'+j+'回、'+(j+1)+'回…'+n+'回の場合をそれぞれ数えてたす',
  T(JH,rng(j,n).map(function(k){return ['裏'+k+'回',n+'回',k+'回','なし',n+'C'+k];}).concat([['計','','','','!和']])),L.join('<br>')+'<br>合計 '+ans,'102-2',{n:n,j:j});
},function(v,o){var c=0;seqs(v.n,2,function(t){if(t.filter(Boolean).length>=v.j)c++;});return vs(o,c+'通り');});

/* 問103 */
function q103(n){var s=names(NM,n);return [s,s+'という'+n+'つのサイコロがある。'+s+'の順に1回ずつ振ったとき、次の各問いに答えなさい。'];}
add(FJ,5,'103-1',function(R){var n=R.pick([4,3,5]),Q=q103(n),i=R.pick([1,0])?0:R.int(0,n-1),X=NM[i],ot=NM.slice(0,n).split('').filter(function(c){return c!==X;}),ans=15;
 var ch=chI(R,ans,[28,36,56,6,30],5,'通り');
 return mk(ch,Q[1]+X+'がほかの'+(n-1)+'つのサイコロよりも大きい目、'+ot.join('、')+'が同じ目となるような組み合わせは何通りあるか。',ot.join('、')+'は同じ目なので、使う目は「'+X+'の目」と「ほかの目」の2種類。1〜6から異なる2つの目を選べば、大きい方が'+X+'に決まる',
  T(JH,[['目','6通り','2つ','なし','!6C2']]),Cs(6,2),'103-1',{n:n,i:i});
},function(v,o){var c=0;seqs(v.n,6,function(t){var x=t[v.i],ot=t.filter(function(_,j){return j!==v.i;});if(ot.every(function(y){return y===ot[0]&&y<x;}))c++;});return vs(o,c+'通り');});
add(FJ,5,'103-2',function(R){var n=R.pick([4,3,5]),Q=q103(n),ord=R.pick([1,0])?rng(0,n-1):R.shuffle(rng(0,n-1)),ans=C(6,n);
 var ch=chI(R,ans,[P(6,n)/2,36,56,28,C(6,n)*2],5,'通り');
 return mk(ch,Q[1]+ord.map(function(i){return NM[i];}).join('、')+'の順に小さくなっていくような組み合わせは何通りあるか。','1〜6から異なる'+n+'つの目を選べば、大きい順に'+ord.map(function(i){return NM[i];}).join('、')+'に当てはめる並びは1通りに決まる',
  T(JH,[['目','6通り',n+'つ','なし','!6C'+n]]),Cs(6,n),'103-2',{n:n,ord:ord});
},function(v,o){var c=0;seqs(v.n,6,function(t){for(var i=1;i<v.n;i++)if(!(t[v.ord[i-1]]>t[v.ord[i]]))return;c++;});return vs(o,c+'通り');});
add(FJ,5,'103-3',function(R){var n=R.pick([4,6]),Q=q103(n),pr=R.pick([1,0])?rng(0,n-1):R.shuffle(rng(0,n-1)),k=n/2,ans=Math.pow(6,k),ps=[];for(var i=0;i<k;i++)ps.push(NM[pr[2*i]]+'と'+NM[pr[2*i+1]]);
 var ch=chI(R,ans,[15,28,56,ans/2,C(6,k)],5,'通り');
 return mk(ch,Q[1]+ps.join('、')+'がそれぞれ同じ目となる組み合わせは何通りあるか。ただし、すべてのサイコロの目が同じであってもよい。','同じ目の組を1つのサイコロと考える。'+k+'組それぞれ6通り',
  T(['','組','各組','公式'],[['',k+'組','6通り','!6<sup>'+k+'</sup>']]),rng(1,k).map(function(){return 6;}).join(' × ')+' ＝ '+ans,'103-3',{n:n,pr:pr});
},function(v,o){var c=0;seqs(v.n,6,function(t){for(var i=0;i<v.n;i+=2)if(t[v.pr[i]]!==t[v.pr[i+1]])return;c++;});return vs(o,c+'通り');});

/* 問104 */
function q104(a,b,c){return 'リンゴ'+a+'個、ミカン'+b+'個、カキ'+c+'個がある。ただし、リンゴ、ミカン、カキの中で区別はないものとする。';}
function bnd(t,A,B,Cc){/* x≤A,y≤B,z≤Cc, x+y+z=t の数を、カキの個数で場合分け */var L=[],s=0;for(var z=0;z<=Math.min(Cc,t);z++){var k=0;for(var x=0;x<=A;x++){var y=t-z-x;if(y>=0&&y<=B)k++;}if(k){L.push([z,k]);s+=k;}}return [s,L];}
add(FJ,5,'104-1',function(R){var a=R.pick([3,4,2]),b=R.pick([3,4,2]),c=R.pick([2,3]),r=R.pick([4,3,5]),T0=a+b+c;if(r>T0-1)return null;var bb=bnd(r,a,b,c),ans=bb[0];
 var ch=chI(R,ans,[H(3,r),ans-4,ans+1,ans-3,ans+2],6,'通り');
 return mk(ch,q104(a,b,c)+'ここから'+r+'個を取り出したい。選び方は何通りあるか。','個数に上限があるので、カキの個数で場合分けし、残りのリンゴ・ミカンの分け方を数える',
  T(['カキ','リンゴ＋ミカン','分け方'],bb[1].map(function(e){return [e[0]+'個',(r-e[0])+'個',e[1]+'通り'];}).concat([['計','','!'+ans+'通り']])),
  bb[1].map(function(e){return 'カキ'+e[0]+'個：リンゴ＋ミカン'+(r-e[0])+'個（リンゴ'+a+'個まで・ミカン'+b+'個まで）'+e[1]+'通り';}).join('<br>')+'<br>合計 '+ans,'104-1',{a:a,b:b,c:c,t:r});
},function(v,o){var n=0;for(var x=0;x<=v.a;x++)for(var y=0;y<=v.b;y++)for(var z=0;z<=v.c;z++)if(x+y+z===v.t&&(!v.one||(x&&y&&z)))n++;return vs(o,n+'通り');});
add(FJ,5,'104-2',function(R){var a=R.pick([3,4,2]),b=R.pick([3,4,2]),c=R.pick([2,3]),s=R.pick([5,4,6,7]),T0=a+b+c;if(s>T0-1||s<4)return null;var bb=bnd(s-3,a-1,b-1,c-1),ans=bb[0];if(!ans)return null;
 var ch=chI(R,ans,[H(3,s-3),ans+1,ans*4,ans*2,ans+7],6,'通り');
 return mk(ch,q104(a,b,c)+'ここから'+s+'個を取り出したい。選び方は何通りあるか。ただし、各種類最低1個は選ぶものとする。','先に1個ずつ選んだと考え、残り'+(s-3)+'個をリンゴ'+(a-1)+'個まで・ミカン'+(b-1)+'個まで・カキ'+(c-1)+'個までで分ける',
  T(['カキ（追加）','リンゴ＋ミカン（追加）','分け方'],bb[1].map(function(e){return [e[0]+'個',(s-3-e[0])+'個',e[1]+'通り'];}).concat([['計','','!'+ans+'通り']])),
  '残り '+s+' − 3 ＝ '+(s-3)+'個<br>'+bb[1].map(function(e){return 'カキに'+e[0]+'個追加：'+e[1]+'通り';}).join('<br>')+'<br>合計 '+ans,'104-2',{a:a,b:b,c:c,t:s,one:1});
},function(v,o){var n=0;for(var x=1;x<=v.a;x++)for(var y=1;y<=v.b;y++)for(var z=1;z<=v.c;z++)if(x+y+z===v.t)n++;return vs(o,n+'通り');});
add(FJ,5,'104-3',function(R){var a=R.pick([3,4,2]),b=R.pick([3,4,2]),c=R.pick([2,3,1]),n=a+b+c,ans=fa(n)/(fa(a)*fa(b)*fa(c));if(n>9)return null;
 var ch=chI(R,ans,[ans/2,ans/4,ans+90,ans+160,ans+240,ans*2],6,'通り');
 return mk(ch,q104(a,b,c)+'全部を横一列に並べたい。並べ方は何通りあるか。','全部区別して並べ、同じ果物どうしの入れ替えで割る（同じものを含む順列）',
  T(JH,[['全体',n+'個',n+'個','あり',n+'P'+n],['同じもの','','','','÷ ('+a+'! × '+b+'! × '+c+'!)'],['計','','','','!'+n+'! ÷ ('+a+'! × '+b+'! × '+c+'!)']]),fa(n)+' ÷ ('+fa(a)+' × '+fa(b)+' × '+fa(c)+') ＝ '+ans,'104-3',{a:a,b:b,c:c});
},function(v,o){var n=v.a+v.b+v.c,c=0;seqs(n,3,function(t){var k=[0,0,0];t.forEach(function(x){k[x]++;});if(k[0]===v.a&&k[1]===v.b)c++;});return vs(o,c+'通り');});

/* 問105〜107 重複組み合わせ */
function OB(L,b,place,f){return T(['','○','｜','並ぶ場所','公式'],[[L,b[0],b[1],place,'!'+f]]);}
function hcount(t,k,lo){var c=0;seqs(k,t+1,function(x){if(x.reduce(function(s,y){return s+y;},0)===t&&x.every(function(y){return y>=lo;}))c++;});return c;}
var STM=['10円','20円','80円','50円'];
add(FJ,5,'105',function(R){var k=R.pick([3,4]),n=R.pick([5,6,7,8,4]);if(n<=k)return null;var st=k===3?STM.slice(0,3):['10円','20円','50円','80円'],r=n-k,ans=H(k,r);
 var ch=chI(R,ans,[ans+4,ans+6,ans+8,ans*2,H(k,n)],6,'通り');
 return mk(ch,st.join('、')+'の'+k+'種類の切手がたくさんある。ここから'+n+'枚を取り出して切手のセットを作りたい。選び方の組み合わせは何通りあるか。ただし、各種類最低1枚は選ぶものとする。',
  '先に1枚ずつ選んだと考え、残り'+r+'枚を○、種類の区切りを｜'+(k-1)+'本として並べる',OB('残り',[r+'枚',(k-1)+'本'],(r+k-1)+'か所',(r+k-1)+'C'+(k-1)),n+' − '+k+' ＝ '+r+'（枚）<br>'+Cs(r+k-1,k-1),'105',{n:n,k:k});
},function(v,o){return vs(o,hcount(v.n,v.k,1)+'通り');});
var PEN=['赤','黒','青','緑'];
add(FJ,5,'106',function(R){var k=R.pick([3,4]),r=R.pick([4,3,5,6]),ans=H(k,r);
 var ch=chI(R,ans,[ans-9,ans-5,ans-3,ans+5,Math.pow(k,r)],6,'通り');
 return mk(ch,PEN.slice(0,k).join('、')+'のボールペンが各1ダースずつある。ここから'+r+'本を選ぶときの色の組み合わせは何通りあるか。','ペン'+r+'本を○、色の区切りを｜'+(k-1)+'本として並べる（重複組み合わせ）',OB('',[r+'本',(k-1)+'本'],(r+k-1)+'か所',(r+k-1)+'C'+(k-1)),Cs(r+k-1,k-1),'106',{r:r,k:k});
},function(v,o){return vs(o,hcount(v.r,v.k,0)+'通り');});
function q107(N){return '赤、白、ピンクのバラが'+N+'本ずつある。ここから'+N+'本を選んで花束を作りたい。';}
add(FJ,5,'107-1',function(R){var N=R.pick([10,8,12,9,6]),ans=3*(N-1);
 var ch=chI(R,ans,[(N+1),2*(N+1),3*(N-2)-3,3*(N+1),3*(N),3*(N+1)+6],6,'通り');
 return mk(ch,q107(N)+'2色で作るとき、'+N+'本の色の組み合わせは何通りあるか。','使う2色を選び（3C2）、その2色に'+N+'本を「どちらも1本以上」で分ける（'+(N-1)+'通り）',
  T(['','全体','選ぶ数','順番','公式'],[['色','3色','2色','なし','3C2'],['分け方',N+'本','各1本以上','','1〜'+(N-1)+'本の'+(N-1)+'通り'],['計','','','','!3C2 × '+(N-1)]]),'3C2 ＝ 3<br>3 × '+(N-1)+' ＝ '+ans,'107-1',{N:N});
},function(v,o){var c=0;for(var x=0;x<=v.N;x++)for(var y=0;y<=v.N;y++){var z=v.N-x-y;if(z<0)continue;if([x,y,z].filter(Boolean).length===2)c++;}return vs(o,c+'通り');});
add(FJ,5,'107-2',function(R){var N=R.pick([10,8,12,9,11]),m=R.pick([2,3]),r=N-3*m;if(r<1)return null;var ans=H(3,r);
 var ch=chI(R,ans,[ans-9,ans-5,ans-3,ans+3,ans+5],6,'通り');
 return mk(ch,q107(N)+'3色をそれぞれ少なくとも'+m+'本ずつ使うとき、'+N+'本の色の組み合わせは何通りあるか。','先に各色'+m+'本ずつ入れたと考え、残り'+r+'本を○、色の区切りを｜2本として並べる',OB('残り',[r+'本','2本'],(r+2)+'か所',(r+2)+'C2'),N+' − '+m+' × 3 ＝ '+r+'（本）<br>'+Cs(r+2,2),'107-2',{N:N,m:m});
},function(v,o){var c=0;for(var x=v.m;x<=v.N;x++)for(var y=v.m;y<=v.N;y++){var z=v.N-x-y;if(z>=v.m)c++;}return vs(o,c+'通り');});
add(FJ,5,'107-3',function(R){var N=R.pick([10,8,12,9]),r0=R.pick([3,2,4,5]),r=N-r0,ans=H(3,r);
 var ch=chI(R,ans,[ans-24,ans-18,ans-16,ans-12,ans-6,H(3,N)],6,'通り');
 return mk(ch,q107(N)+'少なくとも赤を'+r0+'本は入れるとき、'+N+'本の色の組み合わせは何通りあるか。','先に赤を'+r0+'本入れたと考え、残り'+r+'本を○、色の区切りを｜2本として並べる',OB('残り',[r+'本','2本'],(r+2)+'か所',(r+2)+'C2'),N+' − '+r0+' ＝ '+r+'（本）<br>'+Cs(r+2,2),'107-3',{N:N,r0:r0});
},function(v,o){var c=0;for(var x=v.r0;x<=v.N;x++)for(var y=0;y<=v.N;y++){var z=v.N-x-y;if(z>=0)c++;}return vs(o,c+'通り');});

/* 問108 円順列 */
function q108(c){return '大人2人と子供'+c+'人が手をつないで、輪になりたい。';}
function circ(n,cb){/* 0番を固定して残りを並べる（回転で同じものを1通り） */perms(n-1,function(t){cb([0].concat(t.map(function(x){return x+1;})));});}
add(FJ,5,'108-1',function(R){var c=R.pick([6,4,5,3,2]),n=c+2,ans=n-1;
 var ch=chI(R,ans,[n-2,n,n+1,n+2,n+3],6,'',function(v){return v+'! 通り';});
 return mk(ch,q108(c)+n+'人の並び方は全部で何通りあるか。','円順列。1人を固定して、残りの'+(n-1)+'人を並べる',T(JH,[['残り',(n-1)+'人',(n-1)+'人','あり','!'+(n-1)+'!']]),'('+n+' − 1)! ＝ '+(n-1)+'! 通り','108-1',{n:n});
},function(v,o){var c=0;circ(v.n,function(){c++;});for(var k=1;k<=12;k++)if(fa(k)===c)return vs(o,k+'! 通り');return '';});
add(FJ,5,'108-2',function(R){var c=R.pick([6,4,2]),n=c+2,ans=fa(n-2);
 var ch=chI(R,ans,[ans/2,ans*1.5,ans*2,ans+640,ans+720],6,'通り');
 return mk(ch,q108(c)+'大人2人が向かい合うように、'+n+'人で輪になりたい。並び方は何通りあるか。','大人1人を固定すると、もう1人の大人の場所（真向かい）は1か所に決まる。残りの'+c+'か所に子供'+c+'人を並べる',
  T(JH,[['大人','','','','1（固定と真向かい）'],['子供',c+'か所',c+'人','あり','!'+c+'P'+c]]),Ps(c,c),'108-2',{n:n});
},function(v,o){var c=0;circ(v.n,function(t){if(Math.abs(t.indexOf(0)-t.indexOf(1))===v.n/2)c++;});return vs(o,c+'通り');});
add(FJ,5,'108-3',function(R){var c=R.pick([6,4,5,3]),n=c+2,ans=2*fa(n-2);
 var ch=chI(R,ans,[ans/4,ans/2,ans*3/4,ans*0.5+fa(n-2)/4,ans-80],6,'通り');
 return mk(ch,q108(c)+'大人2人が手をつなぐように、'+n+'人で輪になりたい。並び方は何通りあるか。','手をつなぐ大人2人を1人分にまとめ、'+(n-1)+'人分の円順列。まとめた2人の並びで×2',
  T(JH,[['まとまり＋子供',(n-1)+'人分',(n-1)+'人分','あり','('+(n-1)+' − 1)!'],['大人2人','2人','2人','あり','2P2'],['計','','','','!'+(n-2)+'! × 2']]),(n-2)+'! ＝ '+fa(n-2)+'<br>'+fa(n-2)+' × 2 ＝ '+ans,'108-3',{n:n});
},function(v,o){var c=0;circ(v.n,function(t){var d=Math.abs(t.indexOf(0)-t.indexOf(1));if(d===1||d===v.n-1)c++;});return vs(o,c+'通り');});

/* 問109・110 */
add(FJ,5,'109',function(R){var k=R.pick([3,4]),n=R.pick([6,5,7,8,4]),bx=k===3?'X、Y、Z':'W、X、Y、Z',ans=H(k,n);
 var ch=chI(R,ans,[ans/2,ans-14,ans+8,ans+16,ans+28,ans+40],6,'通り');
 return mk(ch,bx+'という'+k+'つの箱に'+n+'個のミカン全部を入れる場合、入れ方のパターンは何通りあるか。ただし、使わない箱があってもよい。','ミカン'+n+'個を○、箱の区切りを｜'+(k-1)+'本として並べる（重複組み合わせ）',OB('',[n+'個',(k-1)+'本'],(n+k-1)+'か所',(n+k-1)+'C'+(k-1)),Cs(n+k-1,k-1),'109',{n:n,k:k});
},function(v,o){return vs(o,hcount(v.n,v.k,0)+'通り');});
add(FJ,5,'110',function(R){var p=R.pick([[2,2,1],[3,1,1],[2,1,1],[3,2,1],[2,2,2],[3,2,2]]),n=p[0]+p[1]+p[2],ans=fa(n)/(fa(p[0])*fa(p[1])*fa(p[2]));var sh='ABCDEFG'.slice(0,n).split('').join('、');
 var ch=chI(R,ans,[ans/2,ans/3,ans*1.5,ans*2,fa(n)],6,'通り');
 return mk(ch,'赤皿'+p[0]+'枚、白皿'+p[1]+'枚、青皿'+p[2]+'枚がある。これを'+sh+'の'+n+'つに区切られた陳列棚に1枚ずつ飾りたい。皿の並べ方は何通りあるか。ただし、同色の皿に区別はないものとする。',
  n+'つの場所から赤皿を置く'+p[0]+'か所を選び、残りから白皿の'+p[1]+'か所を選ぶ（残りが青皿）',T(JH,[['赤皿',n+'か所',p[0]+'か所','なし',n+'C'+p[0]],['白皿',(n-p[0])+'か所',p[1]+'か所','なし',(n-p[0])+'C'+p[1]],['計','','','','!'+n+'C'+p[0]+' × '+(n-p[0])+'C'+p[1]]]),
  Cs(n,p[0])+'<br>'+Cs(n-p[0],p[1])+'<br>'+C(n,p[0])+' × '+C(n-p[0],p[1])+' ＝ '+ans,'110',{p:p});
},function(v,o){var n=v.p[0]+v.p[1]+v.p[2],c=0;seqs(n,3,function(t){var k=[0,0,0];t.forEach(function(x){k[x]++;});if(k[0]===v.p[0]&&k[1]===v.p[1])c++;});return vs(o,c+'通り');});

/* 問111 */
function q111(m,w){return '男性'+m+'人と女性'+w+'人がいる。';}
add(FJ,5,'111-1',function(R){var p=R.pick([[3,3],[4,4],[2,2],[4,3],[3,2],[5,4]]),m=p[0],w=p[1],two=m===w?2:1,ans=two*fa(m)*fa(w);
 var ch=chI(R,ans,[ans*2,ans+82,ans+106,ans*4,ans+240],6,'通り');
 return mk(ch,q111(m,w)+'男女が交互になるように、一列に並びたい。並び方は何通りあるか。',m===w?'先頭が男性か女性かで2通り。男性の席に男性'+m+'人、女性の席に女性'+w+'人を並べる':'男性が1人多いので、両端が男性の「男女男…男」の1通り。男性の席・女性の席にそれぞれ並べる',
  T(JH,[['男女の並び','','','',String(two)],['男性',m+'席',m+'人','あり',m+'P'+m],['女性',w+'席',w+'人','あり',w+'P'+w],['計','','','','!'+two+' × '+m+'P'+m+' × '+w+'P'+w]]),two+' × '+fa(m)+' × '+fa(w)+' ＝ '+ans,'111-1',{m:m,w:w});
},function(v,o){var n=v.m+v.w,c=0;perms(n,function(t){for(var i=1;i<n;i++)if((t[i]<v.m)===(t[i-1]<v.m))return;c++;});return vs(o,c+'通り');});
add(FJ,5,'111-2',function(R){var p=R.pick([[3,3],[3,2],[2,3],[3,4],[4,3],[2,4]]),m=p[0],w=p[1],ans=fa(w+1)*fa(m);
 var ch=chI(R,ans,[ans/2,ans*2,ans+10,ans+34,ans+168],6,'通り');
 return mk(ch,q111(m,w)+'男性'+m+'人が隣り合うように、一列に並びたい。並び方は何通りあるか。','男性'+m+'人を1人分にまとめ、女性'+w+'人と合わせて'+(w+1)+'人分を並べる。まとめた中の男性の並びを掛ける',
  T(JH,[['まとまり＋女性',(w+1)+'人分',(w+1)+'人分','あり',(w+1)+'P'+(w+1)],['男性',m+'人',m+'人','あり',m+'P'+m],['計','','','','!'+(w+1)+'P'+(w+1)+' × '+m+'P'+m]]),fa(w+1)+' × '+fa(m)+' ＝ '+ans,'111-2',{m:m,w:w});
},function(v,o){var n=v.m+v.w,c=0;perms(n,function(t){var ps=[];t.forEach(function(x,i){if(x<v.m)ps.push(i);});if(ps[ps.length-1]-ps[0]===v.m-1)c++;});return vs(o,c+'通り');});
add(FJ,5,'111-3',function(R){var m=R.pick([3,4,2,5]),ans=fa(m-1)*fa(m),n=2*m;if(n>8)return null;
 var ch=chI(R,ans,[ans/6,ans/2,ans*2/3,ans*2/3+ans/6+ans/6+2,ans+3,ans/4],6,'通り');
 return mk(ch,q111(m,m)+'男女が交互になるように、'+n+'人で輪になりたい。並び方は何通りあるか。','男性'+m+'人を先に輪に並べ（円順列 ('+m+' − 1)!）、男性の間の'+m+'か所に女性'+m+'人を並べる（場所が区別できるので普通の順列）',
  T(JH,[['男性（輪）',m+'人',m+'人','あり','('+m+' − 1)!'],['女性',m+'か所',m+'人','あり',m+'P'+m],['計','','','','!'+(m-1)+'! × '+m+'P'+m]]),fa(m-1)+' × '+fa(m)+' ＝ '+ans,'111-3',{m:m});
},function(v,o){var c=0;circ(2*v.m,function(t){for(var i=0;i<t.length;i++)if((t[i]<v.m)===(t[(i+1)%t.length]<v.m))return;c++;});return vs(o,c+'通り');});

/* 問112 */
function q112(t){return t+'種類のワインが用意されている試飲会があった。1種類について1人1回ずつ、'+t+'種類なので計'+t+'回まで試飲することができる。';}
add(FJ,5,'112-1',function(R){var t=R.pick([3,4,5,6,2]),ans=Math.pow(2,t)-1;
 var ch=chI(R,ans,[t,ans-1,ans+1,ans+2,ans*2-1,fa(t)],6,'通り');
 return mk(ch,q112(t)+'P1人が試飲するとき、ワインの種類の選び方は何通りあるか。ただし、最低1回は試飲するものとする。','1種類ごとに「飲む」「飲まない」の2通り。全部飲まない1通りを引く',
  T(['','種類','各種類','公式'],[['','!'+t+'種類','2通り','!2<sup>'+t+'</sup> − 1']]),'2<sup>'+t+'</sup> ＝ '+(ans+1)+'<br>'+(ans+1)+' − 1 ＝ '+ans,'112-1',{t:t});
},function(v,o){var c=0;seqs(v.t,2,function(x){if(x.some(Boolean))c++;});return vs(o,c+'通り');});
add(FJ,5,'112-2',function(R){var t=R.pick([3,4]),k=R.pick([4,3,2,5]);if(k>=2*t)return null;var ans=C(2*t,k);
 var ch=chI(R,ans,[C(t,k)+1,ans/2,ans-3,ans+27,C(t+k-1,k),ans-6],6,'通り');
 return mk(ch,q112(t)+'PとQが2人であわせて'+k+'回試飲するとき、だれがどのワインを試飲したのか、考えられる組み合わせは何通りあるか。','「Pが1種類目」「Qが1種類目」…のように、2人 × '+t+'種類 ＝ '+(2*t)+'通りの「試飲の枠」がある。その中から'+k+'つを選ぶ組み合わせ',
  T(JH,[['試飲の枠',(2*t)+'つ',k+'つ','なし','!'+(2*t)+'C'+k]]),'2 × '+t+' ＝ '+(2*t)+'（枠）<br>'+Cs(2*t,k),'112-2',{t:t,k:k});
},function(v,o){var c=0;seqs(2*v.t,2,function(x){if(x.filter(Boolean).length===v.k)c++;});return vs(o,c+'通り');});

/* 問113 */
function q113(a,b){return '洋菓子が'+a+'種類、和菓子が'+b+'種類ある。ここから何個か選んで、1箱に詰め合わせたい。';}
add(FJ,5,'113-1',function(R){var a=R.pick([5,4,6]),b=R.pick([3,4,2]),p=R.pick([4,3,2,5]),k=R.pick([3,2,4]),ans=C(a+b,k),T0=p*k;
 var ch=chI(R,ans,[ans/4,ans/4+2,ans/4+3,ans/2,ans/2+2,P(a+b,k)],6,'通り');
 return mk(ch,q113(a,b)+'1種類を'+p+'個ずつ、合計'+T0+'個を詰めるときの選び方は何通りあるか。',T0+' ÷ '+p+' ＝ '+k+'（種類）。全'+(a+b)+'種類から'+k+'種類を選ぶ組み合わせ',
  T(JH,[['種類',(a+b)+'種類',k+'種類','なし','!'+(a+b)+'C'+k]]),T0+' ÷ '+p+' ＝ '+k+'<br>'+Cs(a+b,k),'113-1',{a:a,b:b,k:k});
},function(v,o){var c=0;subs(v.a+v.b,v.k,function(){c++;});return vs(o,c+'通り');});
add(FJ,5,'113-2',function(R){var a=R.pick([5,4,6]),b=R.pick([3,4,2]),x=R.pick([8,6,4,12]),L=[],rows=[],ans=0;
 for(var k=1;k<=Math.min(a,b);k++)if(x%k===0){var y=C(a,k)*C(b,k);ans+=y;rows.push([k+'種類ずつ（1種類'+(x/k)+'個）',a+'C'+k+' × '+b+'C'+k,y+'通り']);L.push(k+'種類ずつ：'+C(a,k)+' × '+C(b,k)+' ＝ '+y);}
 var ch=chI(R,ans,[ans/3,ans*2/3,ans/3*4,ans*1.8,ans*2,C(a+b,2)],6,'通り');
 return mk(ch,q113(a,b)+'洋菓子と和菓子を'+x+'個ずつ、合計'+(2*x)+'個を詰めるとき、どの種類も同じ数ずつになるようにする選び方は何通りあるか。','どの種類も同じ数なので、洋菓子と和菓子で選ぶ種類の数は同じ（k種類ずつ）。kは'+x+'を割り切れて、和菓子の'+b+'種類以下。kで場合分けする',
  T(['場合','公式','通り'],rows.concat([['計','','!'+ans+'通り']])),L.join('<br>')+'<br>合計 '+ans,'113-2',{a:a,b:b,x:x});
},function(v,o){var c=0;seqs(v.a,v.x+1,function(s){var u=s.filter(Boolean);if(u.reduce(function(p,q){return p+q;},0)!==v.x||u.some(function(q){return q!==u[0];}))return;seqs(v.b,v.x+1,function(t){var w=t.filter(Boolean);if(w.reduce(function(p,q){return p+q;},0)===v.x&&w.every(function(q){return q===u[0];}))c++;});});return vs(o,c+'通り');});
add(FJ,5,'113-3',function(R){var a=R.pick([5,4,6]),b=R.pick([3,4,2]),y=R.pick([3,2,4]),x1=H(a,y),x2=H(b,y),ans=x1*x2;
 var ch=chI(R,ans,[x1*x2/2,x1+x2,ans/2+175,ans*2,ans*4,x1*x2+350],6,'通り');
 return mk(ch,q113(a,b)+'洋菓子と和菓子を'+y+'個ずつ、合計'+(2*y)+'個を詰めるときの選び方は何通りあるか。','同じ種類を何個選んでもよい（重複組み合わせ）。洋菓子'+y+'個の選び方 × 和菓子'+y+'個の選び方',
  T(['','○','｜','並ぶ場所','公式'],[['洋菓子',y+'個',(a-1)+'本',(y+a-1)+'か所',(y+a-1)+'C'+(a-1)],['和菓子',y+'個',(b-1)+'本',(y+b-1)+'か所',(y+b-1)+'C'+(b-1)],['計','','','','!'+x1+' × '+x2]]),Cs(y+a-1,a-1)+'<br>'+Cs(y+b-1,b-1)+'<br>'+x1+' × '+x2+' ＝ '+ans,'113-3',{a:a,b:b,y:y});
},function(v,o){return vs(o,hcount(v.y,v.a,0)*hcount(v.y,v.b,0)+'通り');});

/* ===================== 確率 ===================== */
function KH(h,r){return T(h,r);}
function FR(R){return R.pick.apply(R,arguments.length>1?[arguments[1]]:[]);}
/* 問114 */
add(FK,4,'114',function(R){var o=R.pick([1,0]),p1=o?[1,10]:R.pick([[1,10],[1,5],[1,20],[1,4],[3,10]]),p2=o?[1,5]:R.pick([[1,5],[1,4],[1,10],[3,10],[2,5]]);if(p1[0]/p1[1]+p2[0]/p2[1]>1)return null;
 var a=fm(p1,p2),ans=fm([2,1],a),ch=chF(R,ans,[a,p1,fp(p1,p2),p2],4);
 return mk(ch,'PとQの2人が、大吉が出る確率が'+fs(p1)+'、小吉が出る確率が'+fs(p2)+'というおみくじを1回ずつ引く。PとQの一方が大吉で、もう一方が小吉を引く確率はどれだけか。',
  '「Pが大吉かつQが小吉」と「Pが小吉かつQが大吉」の2つの場合がある（×2を忘れない）',KH(['P','Q','確率'],[['大吉','小吉',fs(p1)+' × '+fs(p2)],['小吉','大吉',fs(p2)+' × '+fs(p1)],['計','','!'+fs(a)+' × 2']]),
  fs(p1)+' × '+fs(p2)+' ＝ '+fs(a)+'<br>'+fs(a)+' × 2 ＝ '+fs(ans),'114',{p1:p1,p2:p2});
},function(v,o){var w=[[v.p1,0],[v.p2,1],[f1(fp(v.p1,v.p2)),2]],s=[0,1];w.forEach(function(x){w.forEach(function(y){if(x[1]+y[1]===1&&x[1]!==y[1])s=fp(s,fm(x[0],y[0]));});});return fs(s);});
/* 問115 */
add(FK,4,'115',function(R){var a=R.pick([2,3]),b=R.pick([2,3]),o=R.pick([1,0]);if(o){a=2;b=2;}var Ss=[];for(var s=50;s<=50*a+100*b;s+=50)Ss.push(s);var S=o?200:R.pick(Ss),L=[],cnt=0,cs=0;
 for(var j=0;j<=b;j++){var i=(S-100*j)/50;if(i>=0&&i<=a&&i%1===0){var k=C(a,i)*C(b,j);cnt+=k;cs++;L.push('100円玉'+j+'枚・50円玉'+i+'枚：'+b+'C'+j+' × '+a+'C'+i+' ＝ '+k+'通り');}}
 var n=a+b,tot=Math.pow(2,n),ans=fr(cnt,tot);if(cnt===tot)return null;var ch=chF(R,ans,[fr(cs,tot),[1,tot],[1,4],fr(cnt+1,tot),fr(cnt-1,tot)],4);
 return mk(ch,'50円玉が'+a+'枚、100円玉が'+b+'枚ある。この'+n+'枚を同時に投げて、表が出たものの金額の合計が'+S+'円になる確率はどれだけか。',
  '全ての表裏の出方は 2<sup>'+n+'</sup> ＝ '+tot+'通り。合計'+S+'円になる表の組み合わせで場合分けし、どの硬貨が表かも区別して数える',KH(['100円玉の表','50円玉の表','通り'],L.map(function(x){var m=x.match(/100円玉(\d)枚・50円玉(\d)枚：.*＝ (\d+)通り/);return [m[1]+'枚',m[2]+'枚',m[3]];}).concat([['計','','!'+cnt+' ÷ '+tot]])),
  L.join('<br>')+'<br>'+cnt+'/'+tot+' ＝ '+fs(ans),'115',{a:a,b:b,S:S});
},function(v,o){var c=0,n=v.a+v.b;for(var m=0;m<(1<<n);m++){var s=0;for(var i=0;i<n;i++)if(m>>i&1)s+=i<v.a?50:100;if(s===v.S)c++;}return fs(fr(c,1<<n));});
/* 問116 */
var Q116='PとQがサイコロを振って出た目の数が大きい方が勝つゲームをする。ただし、同じ数の目が出たら引き分けとする。';
BANK[FK][4].real.push({id:'bk116-1',bk:'116-1',q:Q116+'PがQに勝つ確率はどれだけか。',c:['1/6','5/12','1/3','1/2'],a:1,inw:'全ての目の出方は 6 × 6 ＝ 36通り。引き分けの6通りを除いた30通りの半分がPの勝ち',
 fig:KH(['','通り'],[['全体','36'],['引き分け','6'],['Pの勝ち','!(36 − 6) ÷ 2']]),calc:'(36 − 6) ÷ 2 ＝ 15<br>15/36 ＝ 5/12'});
add(FK,4,'116-2',function(R){var t=R.pick([3,2,4,5]),L=[],c=0;for(var p=t;p<=6;p++){c+=6-p;if(6-p)L.push('Pが'+p+'：Qは'+(p+1)+'〜6の'+(6-p)+'通り');}var ans=fr(c,36);
 var ch=chF(R,ans,[[5,12],[1,3],[1,2],fr(c+3,36),fr(c-3,36)],4);
 return mk(ch,Q116+'Pが'+t+'以上の目でQに負ける確率はどれだけか。','全ての目の出方は36通り。Pの目で場合分けし、Qがそれより大きい目を数える',KH(['Pの目','Qの目','通り'],L.map(function(x){var m=x.match(/Pが(\d)：Qは(.*)の(\d)通り/);return [m[1],m[2],m[3]];}).concat([['計','','!'+c]])),
  L.join('<br>')+'<br>'+c+'/36 ＝ '+fs(ans),'116-2',{t:t});
},function(v,o){var c=0;seqs(2,6,function(x){if(x[0]+1>=v.t&&x[1]>x[0])c++;});return fs(fr(c,36));});
add(FK,4,'116-3',function(R){var k=R.pick([4,3,2,5]),L=[],c=0;for(var d=k;d<=5;d++){c+=6-d;L.push('差が'+d+'：'+(6-d)+'通り');}var ans=fr(c,36);
 var ch=chF(R,ans,[[1,6],[5,12],[1,3],fr(c*2,36),fr(c+1,36)],4);
 return mk(ch,Q116+'Pが'+k+'以上の差でQに勝つ確率はどれだけか。','全ての目の出方は36通り。差が'+k+'、'+(k+1)+'…5になる（Pの目,Qの目）を書き出す',KH(['差','通り'],L.map(function(x){var m=x.match(/差が(\d)：(\d)通り/);return [m[1],m[2]];}).concat([['計','!'+c]])),
  L.join('<br>')+'<br>'+c+'/36 ＝ '+fs(ans),'116-3',{k:k});
},function(v,o){var c=0;seqs(2,6,function(x){if(x[0]-x[1]>=v.k)c++;});return fs(fr(c,36));});
/* 問117 */
var Q117=function(n){return '甲と乙がジャンケンを'+n+'回する。グー、チョキ、パーはそれぞれ1/3の確率とし、同じものを出したとき（アイコ）も1回と数える。';};
function jw(cb,n){/* 9^n 通り。勝ち：甲(x)が乙(y)に勝つ (x+1)%3===y（0グー1チョキ2パー） */seqs(2*n,3,function(t){var w=0;for(var i=0;i<n;i++)if((t[2*i]+1)%3===t[2*i+1])w++;cb(w);});}
add(FK,5,'117-1',function(R){var n=R.pick([3,2,4]),k=R.pick([1,2,3]);if(k>=n)return null;var one=fm(fpw([1,3],k),fpw([2,3],n-k)),ans=fm([C(n,k),1],one);
 var ch=chF(R,ans,[one,[1,3],[1,2],fm([2,1],ans)],4);
 return mk(ch,Q117(n)+'甲が'+k+'回だけ勝つ確率はどれだけか。','1回で甲が勝つ確率は1/3（勝たない確率2/3）。'+n+'回のうち勝つ'+k+'回を選ぶ'+n+'C'+k+'通りの場合がある',
  KH(['','確率','回数'],[['勝つ','1/3',k+'回'],['勝たない','2/3',(n-k)+'回'],['並び','',n+'C'+k+'通り'],['計','','!'+C(n,k)+' × '+fs(one)]]),'(1/3)<sup>'+k+'</sup> × (2/3)<sup>'+(n-k)+'</sup> ＝ '+fs(one)+'<br>'+fs(one)+' × '+C(n,k)+' ＝ '+fs(ans),'117-1',{n:n,k:k});
},function(v,o){var c=0,t=0;jw(function(w){t++;if(w===v.k)c++;},v.n);return fs(fr(c,t));});
add(FK,5,'117-2',function(R){var n=R.pick([3,2,4,5]),z=fpw([2,3],n),ans=f1(z);
 var ch=chF(R,ans,[[1,6],z,fm([n,1],[1,3]),[8,9]],4);
 return mk(ch,Q117(n)+'甲が少なくとも1回は勝つ確率はどれだけか。','「少なくとも」は、1から「'+n+'回とも勝たない」確率を引く（余事象）',KH(['','確率'],[[n+'回とも勝たない','(2/3)<sup>'+n+'</sup>'],['少なくとも1回勝つ','!1 − '+fs(z)]]),'(2/3)<sup>'+n+'</sup> ＝ '+fs(z)+'<br>1 − '+fs(z)+' ＝ '+fs(ans),'117-2',{n:n});
},function(v,o){var c=0,t=0;jw(function(w){t++;if(w>0)c++;},v.n);return fs(fr(c,t));});
/* 問118 */
function q118(N,w){var s=names(NM,N);return s+'の'+N+'人が最初にゲームをする'+w+'人をくじで決めることにした。'+N+'本のくじのうち、'+w+'本が当たりくじで、'+s+'の順にくじを引く。ただし、一度引いたくじは戻さないものとする。';}
function two(R,N,o){return o?o:cut(R,rng(0,N-1),2);}
add(FK,5,'118-1',function(R){var N=R.pick([6,5,7]),w=R.pick([2,3]),x=two(R,N,R.pick([1,0])?[0,3]:null);if(w>=N-1)return null;var ans=fr(C(N-2,w-2),C(N,w));
 var ch=chF(R,ans,[fm(fr(w,N),fr(w,N)),fr(1,N*(N-1)),fr(w,N),fr(2*C(N-2,w-2),C(N,w))],4);
 return mk(ch,q118(N,w)+NM[x[0]]+'と'+NM[x[1]]+'が当たりを引く確率はどれだけか。','引く順番に関係なく、だれが当たるかは「'+N+'人から当たりの'+w+'人を選ぶ」'+N+'C'+w+'通りが同じ確率。そのうち'+NM[x[0]]+'と'+NM[x[1]]+'がどちらも入る選び方を数える',
  KH(['','全体','選ぶ数','公式'],[['全て',N+'人',w+'人',N+'C'+w],['2人とも当たり',(N-2)+'人',(w-2)+'人',(N-2)+'C'+(w-2)],['確率','','','!'+(N-2)+'C'+(w-2)+' ÷ '+N+'C'+w]]),Cs(N,w)+'<br>残り'+(w-2)+'人の選び方 '+C(N-2,w-2)+'<br>'+C(N-2,w-2)+'/'+C(N,w)+' ＝ '+fs(ans),'118-1',{N:N,w:w,x:x});
},function(v,o){var c=0,t=0;perms(v.N,function(p){t++;if(p[v.x[0]]<v.w&&p[v.x[1]]<v.w)c++;});return fs(fr(c,t));});
add(FK,5,'118-2',function(R){var N=R.pick([6,5,7]),w=R.pick([2,3]),x=two(R,N,R.pick([1,0])?[0,2]:null);if(w>=N-1)return null;var k=C(N-2,w-1),ans=fr(2*k,C(N,w));
 var ch=chF(R,ans,[fr(k,C(N,w)),[1,36],[1,2],[4,15],fr(C(N-2,w-2),C(N,w))],4);
 return mk(ch,q118(N,w)+NM[x[0]]+'と'+NM[x[1]]+'のうちどちらか1人だけが当たりを引く確率はどれだけか。','当たりの'+w+'人の選び方'+N+'C'+w+'通りのうち、'+NM[x[0]]+'だけ（または'+NM[x[1]]+'だけ）が入り、残りの当たりはほかの'+(N-2)+'人から選ぶ',
  KH(['','全体','選ぶ数','公式'],[['全て',N+'人',w+'人',N+'C'+w],[NM[x[0]]+'だけ',(N-2)+'人',(w-1)+'人',(N-2)+'C'+(w-1)],[NM[x[1]]+'だけ',(N-2)+'人',(w-1)+'人',(N-2)+'C'+(w-1)],['確率','','','!'+k+' × 2 ÷ '+C(N,w)]]),Cs(N,w)+'<br>'+NM[x[0]]+'だけ '+k+'、'+NM[x[1]]+'だけ '+k+'<br>'+(2*k)+'/'+C(N,w)+' ＝ '+fs(ans),'118-2',{N:N,w:w,x:x});
},function(v,o){var c=0,t=0;perms(v.N,function(p){t++;if((p[v.x[0]]<v.w)!==(p[v.x[1]]<v.w))c++;});return fs(fr(c,t));});
/* 問119 */
function q119(r){return '赤玉と白玉が'+r+'個ずつ入った箱がある。ここから1個ずつ3個を取り出す。';}
add(FK,5,'119-1',function(R){var r=R.pick([5,4,6,3,7]),n=2*r,ans=fm(fr(r,n),fr(r-1,n-1),fr(r-2,n-2));
 var ch=chF(R,ans,[[1,36],fpw([1,2],3),fm(fr(r,n),fr(r,n),fr(r-1,n-1)),[1,6]],4);
 return mk(ch,q119(r)+'3個とも赤玉が出る確率はどれだけか。ただし、1度取り出した玉は箱に戻さないものとする。','戻さないので、1個目・2個目・3個目で赤玉の数と全体の数が1つずつ減る',
  KH(['','赤玉','全体','確率'],[['1個目',r,n,r+'/'+n],['2個目',r-1,n-1,(r-1)+'/'+(n-1)],['3個目',r-2,n-2,(r-2)+'/'+(n-2)],['計','','','!掛ける']]),r+'/'+n+' × '+(r-1)+'/'+(n-1)+' × '+(r-2)+'/'+(n-2)+' ＝ '+fs(ans),'119-1',{r:r});
},function(v,o){var c=0,t=0;inj(3,2*v.r,function(p){t++;if(p.every(function(x){return x<v.r;}))c++;});return fs(fr(c,t));});
add(FK,5,'119-2',function(R){var r=R.pick([5,4,6,3,7]),n=2*r,ans=fm(fr(r,n),fr(r,n),fr(r,n-1));
 var ch=chF(R,ans,[[1,36],[1,12],[1,9],fpw([1,2],3),fm(fr(r,n),fr(r-1,n-1),fr(r-1,n-2))],4);
 return mk(ch,q119(r)+'赤・白・赤の順に出る確率はどれだけか。ただし、赤玉であれば箱に戻し、白玉であれば戻さないものとする。','1個目の赤は戻すので2個目も全体'+n+'個。2個目の白は戻さないので、3個目は全体'+(n-1)+'個（赤は'+r+'個のまま）',
  KH(['','色','全体','確率'],[['1個目','赤',n,r+'/'+n],['2個目','白',n,r+'/'+n],['3個目','赤',n-1,r+'/'+(n-1)],['計','','','!掛ける']]),r+'/'+n+' × '+r+'/'+n+' × '+r+'/'+(n-1)+' ＝ '+fs(ans),'119-2',{r:r});
},function(v,o){/* 玉に番号をつけて総当たり：1個目赤（戻す）→2個目白（戻さない）→3個目赤 */var n=2*v.r,s=[0,1];for(var i=0;i<v.r;i++)for(var j=v.r;j<n;j++)for(var k=0;k<v.r;k++)s=fp(s,[1,n*n*(n-1)]);return fs(s);});
/* 問120 */
function q120(k){return 'スペード、ハート、ダイヤ、クラブの4種類のカードが'+k+'枚ずつ、計'+(4*k)+'枚ある。ここから甲と乙が同時に1枚ずつカードを引く。';}
function c120(k,f){var c=0,t=0;inj(2,4*k,function(p){t++;if(f(Math.floor(p[0]/k),Math.floor(p[1]/k)))c++;});return fs(fr(c,t));}
add(FK,5,'120-1',function(R){var k=R.pick([4,3,5,6,13]),n=4*k,ans=fm(fr(k,n),fr(k-1,n-1));
 var ch=chF(R,ans,[[1,16],[1,8],[1,2],fm(fr(k,n),fr(k,n))],4);
 return mk(ch,q120(k)+'2人ともハートを引く確率はどれだけか。','同時に引くのは、順に戻さず引くのと同じ。甲がハート、乙も残りからハート',KH(['','ハート','全体','確率'],[['甲',k,n,k+'/'+n],['乙',k-1,n-1,(k-1)+'/'+(n-1)],['計','','','!掛ける']]),k+'/'+n+' × '+(k-1)+'/'+(n-1)+' ＝ '+fs(ans),'120-1',{k:k});
},function(v,o){return c120(v.k,function(a,b){return a===1&&b===1;});});
add(FK,5,'120-2',function(R){var k=R.pick([4,3,5,6,13]),n=4*k,ans=fm(fr(3*k,n),fr(3*k-1,n-1));
 var ch=chF(R,ans,[[1,4],fm(fr(3*k,n),fr(3*k,n)),fr(5,11),f1(ans)],4);
 return mk(ch,q120(k)+'2人ともダイヤを引かない確率はどれだけか。','ダイヤ以外は'+(3*k)+'枚。甲がダイヤ以外、乙も残りからダイヤ以外',KH(['','ダイヤ以外','全体','確率'],[['甲',3*k,n,(3*k)+'/'+n],['乙',3*k-1,n-1,(3*k-1)+'/'+(n-1)],['計','','','!掛ける']]),(3*k)+'/'+n+' × '+(3*k-1)+'/'+(n-1)+' ＝ '+fs(ans),'120-2',{k:k});
},function(v,o){return c120(v.k,function(a,b){return a!==2&&b!==2;});});
add(FK,5,'120-3',function(R){var k=R.pick([4,3,5,6,13]),n=4*k,z=fm(fr(3*k,n),fr(3*k-1,n-1)),ans=f1(z);
 var ch=chF(R,ans,[[1,4],z,f1(fm(fr(3*k,n),fr(3*k,n))),fr(2*k,n)],4);
 return mk(ch,q120(k)+'2人のうち、少なくとも1人がクラブを引く確率はどれだけか。','「少なくとも」は、1から「2人ともクラブを引かない」確率を引く',KH(['','確率'],[['2人ともクラブ以外',(3*k)+'/'+n+' × '+(3*k-1)+'/'+(n-1)],['少なくとも1人','!1 − '+fs(z)]]),(3*k)+'/'+n+' × '+(3*k-1)+'/'+(n-1)+' ＝ '+fs(z)+'<br>1 − '+fs(z)+' ＝ '+fs(ans),'120-3',{k:k});
},function(v,o){return c120(v.k,function(a,b){return a===3||b===3;});});
/* 問121 */
add(FK,5,'121',function(R){var o=R.pick([1,0]),B=o?100:R.pick([100,50,200]),x=o?80:R.pick([60,70,80,90,40])*B/100,y=o?70:R.pick([30,40,60,70,80])*B/100,px=fr(x,B),py=fr(y,B),ans=fm(px,py);
 var ch=chF(R,ans,[fr(B-x,B),fm(f1(px),f1(py)),f1(fm(f1(px),f1(py))),fr(x+y-B,B)],4);
 return mk(ch,'1袋の中に商品PまたはQが1つと、商品XまたはYが1つの合計2個が入っている福袋が'+B+'袋ある。すべての福袋に入っている商品の個数を合わせると、P'+x+'個、Q'+(B-x)+'個、X'+y+'個、Y'+(B-y)+'個で計'+(2*B)+'個になる。この福袋を1袋購入するとき、商品QもYも入っていない確率はどれだけか。',
  'QもYも入っていない ＝ 「Pが入っている」かつ「Xが入っている」。Pが入っている確率と、Xが入っている確率を掛ける',KH(['','個数','確率'],[['P',x,x+'/'+B],['X',y,y+'/'+B],['PかつX','','!掛ける']]),x+'/'+B+' × '+y+'/'+B+' ＝ '+fs(ans),'121',{B:B,x:x,y:y});
},function(v,o){var pq=fr(v.B-v.x,v.B),py=fr(v.B-v.y,v.B);/* 1 − P(Q) − P(Y) + P(Q)P(Y) */var s=fp([1,1],fm(pq,py));s=fr(s[0]*pq[1]*py[1]-s[1]*(pq[0]*py[1]+py[0]*pq[1]),s[1]*pq[1]*py[1]);return fs(s);});
/* 問122 */
function q122(a,b){return '白い碁石が'+a+'個、黒い碁石が'+b+'個入っている袋がある。';}
function c122(a,b,f){var c=0,t=0;subs(a+b,3,function(s){t++;if(f(s.filter(function(i){return i>=a;}).length))c++;});return fs(fr(c,t));}
add(FK,5,'122-1',function(R){var a=R.pick([2,3,1,4]),b=R.pick([4,5,3,6]),n=a+b,ans=fr(C(b,3),C(n,3));
 var ch=chF(R,ans,[fpw(fr(b,n),3),[1,9],[1,4],[1,3]],4);
 return mk(ch,q122(a,b)+'同時に3個を取り出すとき、黒い碁石が3個になる確率はどれだけか。','全ての取り出し方は '+n+'C3、黒'+b+'個から3個は '+b+'C3',KH(['','全体','選ぶ数','公式'],[['全て',n+'個','3個',n+'C3'],['黒3個',b+'個','3個',b+'C3'],['確率','','','!'+b+'C3 ÷ '+n+'C3']]),Cs(n,3)+'<br>'+Cs(b,3)+'<br>'+C(b,3)+'/'+C(n,3)+' ＝ '+fs(ans),'122-1',{a:a,b:b});
},function(v,o){return c122(v.a,v.b,function(k){return k===3;});});
add(FK,5,'122-2',function(R){var a=R.pick([2,3,1,4]),b=R.pick([4,5,3,6]),n=a+b,k2=C(b,2)*C(a,1),k3=C(b,3),ans=fr(k2+k3,C(n,3));if(ans[0]===ans[1])return null;
 var ch=chF(R,ans,[[1,5],[1,2],fr(k2,C(n,3)),f1(ans)],4);
 return mk(ch,q122(a,b)+'同時に3個を取り出すとき、黒い碁石が2個以上になる確率はどれだけか。','「黒2個・白1個」と「黒3個」に分けて数える',KH(['','公式','通り'],[['黒2・白1',b+'C2 × '+a+'C1',k2],['黒3',b+'C3',k3],['全て',n+'C3',C(n,3)],['確率','','!'+(k2+k3)+' ÷ '+C(n,3)]]),
  '黒2・白1 '+C(b,2)+' × '+a+' ＝ '+k2+'<br>黒3 '+k3+'<br>'+(k2+k3)+'/'+C(n,3)+' ＝ '+fs(ans),'122-2',{a:a,b:b});
},function(v,o){return c122(v.a,v.b,function(k){return k>=2;});});
add(FK,5,'122-3',function(R){var a=R.pick([2,3,1,4]),b=R.pick([4,5,3,6]),k=R.pick([3,2,4]),n=a+b,pw=fr(a,n),pb=fr(b,n),one=fm(pw,fpw(pb,k-1)),ans=fm([k,1],one);
 var ch=chF(R,ans,[[1,9],one,fm([k,1],fm(pb,fpw(pw,k-1))),pw],4);
 return mk(ch,q122(a,b)+'1個を取り出したら、色を確認して袋に戻すことにする。これを'+k+'回繰り返したとき、白い碁石が1度だけ出る確率はどれだけか。','戻すので毎回、白'+fs(pw)+'・黒'+fs(pb)+'。白が出るのが何回目かで'+k+'通り',
  KH(['','確率','回数'],[['白',fs(pw),'1回'],['黒',fs(pb),(k-1)+'回'],['何回目が白','',k+'C1 ＝ '+k],['計','','!'+k+' × '+fs(one)]]),fs(pw)+' × ('+fs(pb)+')<sup>'+(k-1)+'</sup> ＝ '+fs(one)+'<br>'+fs(one)+' × '+k+' ＝ '+fs(ans),'122-3',{a:a,b:b,k:k});
},function(v,o){var n=v.a+v.b,c=0,t=0;seqs(v.k,n,function(x){t++;if(x.filter(function(i){return i<v.a;}).length===1)c++;});return fs(fr(c,t));});
add(FK,5,'122-4',function(R){var a=R.pick([2,3,1,4]),b=R.pick([4,5,3,6]),m=R.pick([4,3,5]),j=R.pick([3,2,4]);if(j>m||j<2||j===m&&m>3)return null;var n=a+b,pw=fr(a,n),pb=fr(b,n),
 before=fm([C(m-1,j-1),1],fm(fpw(pb,j-1),fpw(pw,m-j))),ans=fm(before,pb);if(j===m)return null;
 var ch=chF(R,ans,[[1,9],before,fm(fpw(pb,j),fpw(pw,m-j)),[4,9]],4);
 return mk(ch,q122(a,b)+'1個を取り出したら、色を確認して袋に戻すことにする。これを'+m+'回繰り返したとき、最後の'+m+'回目で'+j+'度目の黒い碁石が出る確率はどれだけか。',
  m+'回目は黒に決まっている。その前の'+(m-1)+'回で黒がちょうど'+(j-1)+'回（どの回かで'+(m-1)+'C'+(j-1)+'通り）',KH(['','確率'],[[(m-1)+'回目まで',(m-1)+'C'+(j-1)+' × ('+fs(pb)+')<sup>'+(j-1)+'</sup> × ('+fs(pw)+')<sup>'+(m-j)+'</sup>'],[m+'回目',fs(pb)],['計','!掛ける']]),
  (m-1)+'C'+(j-1)+' × ('+fs(pb)+')<sup>'+(j-1)+'</sup> × ('+fs(pw)+')<sup>'+(m-j)+'</sup> ＝ '+fs(before)+'<br>'+fs(before)+' × '+fs(pb)+' ＝ '+fs(ans),'122-4',{a:a,b:b,m:m,j:j});
},function(v,o){var n=v.a+v.b,c=0,t=0;seqs(v.m,n,function(x){t++;var bl=0,ok=0;x.forEach(function(i,q){if(i>=v.a){bl++;if(bl===v.j&&q===v.m-1)ok=1;}});if(ok)c++;});return fs(fr(c,t));});
/* 問123 */
function q123(N){return 'あるゲームでは0から'+(N-1)+'までのいずれかの数字を指すルーレットを回し、指した数字の数だけコマを進める。ただし、ルーレットが0を指した場合はスタート地点に戻る。';}
function rou(N,k,f){var c=0,t=0;seqs(k,N,function(x){t++;var p=0;x.forEach(function(d){p=d===0?0:p+d;});if(f(p))c++;});return fs(fr(c,t));}
add(FK,5,'123-1',function(R){var N=R.pick([10,8,6,12]),k=R.pick([3,2,4]),ans=[1,N];
 var ch=chF(R,ans,[[1,5],[1,7],[3,200],[k,N],fpw([1,N],k)],4);
 return mk(ch,q123(N)+k+'回ルーレットを回した結果、スタート地点にコマがある確率はどれだけか。',k+'回目までにどこにいても、'+k+'回目に0を指せばスタート地点。0以外を指すと必ず1つ以上進むので、スタート地点にいるのは'+k+'回目が0のときだけ',
  KH(['','確率'],[[k+'回目が0','!1/'+N]]),'1/'+N,'123-1',{N:N,k:k});
},function(v,o){return rou(v.N,v.k,function(p){return p===0;});});
add(FK,5,'123-2',function(R){var N=R.pick([10,8,6]),d=R.pick([4,3,5,2,6]);if(d>N-1)return null;var a1=C(d-1,2),a2=d-1,a3=N,c=a1+a2+a3,tot=N*N*N,ans=fr(c,tot);
 var ch=chF(R,ans,[fr(a1,tot),fr(a1+a2,tot),fr(c,N*N),fr(3,200)],4);
 return mk(ch,q123(N)+'3回ルーレットを回した結果、スタート地点から'+d+'つ進んだ位置にコマがある確率はどれだけか。','全ての出方は '+N+'<sup>3</sup> ＝ '+tot+'通り。最後に0が出たのが何回目かで場合分けする（0のあとに出た数の合計が'+d+'）',
  KH(['場合','合計'+d+'になる数','通り'],[['0なし','1回目〜3回目（各1以上）',a1],['1回目が0','2回目・3回目（各1以上）',a2],['2回目が0','3回目が'+d+'（1回目は何でもよい）',N+' × 1'],['計','','!'+c]]),
  '0なし：3つの数の和が'+d+' → '+(d-1)+'C2 ＝ '+a1+'<br>1回目が0：2つの数の和が'+d+' → '+a2+'<br>2回目が0：1回目は'+N+'通り、3回目は'+d+' → '+a3+'<br>'+c+'/'+tot+' ＝ '+fs(ans),'123-2',{N:N,d:d});
},function(v,o){return rou(v.N,3,function(p){return p===v.d;});});
/* 問124 */
var OD=[1,3,5,7,9],EV=[2,4,6,8];
function q124(a,b){return 'Pが'+OD.slice(0,a).join('、')+'という'+a+'枚のカード、Qが'+EV.slice(0,b).join('、')+'という'+b+'枚のカードを持っている。';}
add(FK,5,'124-1',function(R){var a=R.pick([4,3,5]),b=R.pick([3,2,4]),L=[],c=0;OD.slice(0,a).forEach(function(x){var k=EV.slice(0,b).filter(function(y){return y<x;}).length;c+=k;L.push(['Pが'+x,k]);});var ans=fr(c,a*b);if(!c||c===a*b)return null;
 var ch=chF(R,ans,[[1,8],[1,4],[2,3],f1(ans),fr(c+1,a*b)],4);
 return mk(ch,q124(a,b)+'2人が自分のカードを1枚ずつ出すとき、Pの方が大きい数字を出す確率はどれだけか。','全ての出し方は '+a+' × '+b+' ＝ '+(a*b)+'通り。Pのカードで場合分けし、それより小さいQのカードを数える',KH(['Pのカード','Qが小さい','通り'],L.map(function(e){return [e[0].slice(2),'',e[1]];}).concat([['計','','!'+c]])),
  L.map(function(e){return e[0]+'：'+e[1]+'通り';}).join('<br>')+'<br>'+c+'/'+(a*b)+' ＝ '+fs(ans),'124-1',{a:a,b:b});
},function(v,o){var c=0;seqs(2,Math.max(v.a,v.b),function(x){if(x[0]<v.a&&x[1]<v.b&&OD[x[0]]>EV[x[1]])c++;});return fs(fr(c,v.a*v.b));});
add(FK,5,'124-2',function(R){var a=R.pick([4,3,5]),b=R.pick([3,4]),ps={},qs={};subs(a,2,function(t){var s=OD[t[0]]+OD[t[1]];ps[s]=(ps[s]||0)+1;});subs(b,2,function(t){var s=EV[t[0]]+EV[t[1]];qs[s]=(qs[s]||0)+1;});
 var c=0,L=[];for(var s in ps)if(qs[s]){c+=ps[s]*qs[s];L.push(['和'+s,ps[s],qs[s]]);}var tot=C(a,2)*C(b,2),ans=fr(c,tot);if(!c)return null;
 var ch=chF(R,ans,[[1,8],[1,3],[5,8],fr(L.length,tot),fr(c+1,tot)],4);
 return mk(ch,q124(a,b)+'2人が自分のカードを2枚ずつ出すとき、互いの出した数字の和が等しくなる確率はどれだけか。','全ての出し方は '+a+'C2 × '+b+'C2 ＝ '+tot+'通り。2人の和の一覧を作り、同じ和の組を数える',
  KH(['和','Pの出し方','Qの出し方'],L.map(function(e){return [e[0].slice(1),e[1],e[2]];}).concat([['計','','!'+c+'通り']])),'P：'+Object.keys(ps).join('、')+'<br>Q：'+Object.keys(qs).join('、')+'<br>'+L.map(function(e){return e[0]+'：'+e[1]+' × '+e[2];}).join('<br>')+'<br>'+c+'/'+tot+' ＝ '+fs(ans),'124-2',{a:a,b:b});
},function(v,o){var c=0,t=0;subs(v.a,2,function(p){subs(v.b,2,function(q){t++;if(OD[p[0]]+OD[p[1]]===EV[q[0]]+EV[q[1]])c++;});});return fs(fr(c,t));});
/* 問125 */
function q125(r,w,hr,hw){return '赤玉と白玉が'+r+'：'+w+'の比率で入っている抽選器がある。赤玉の'+hr+'%、白玉の'+hw+'%には当たりマークがある。1回の抽選で1個ずつ玉が出て、そのつど玉は抽選器の中に戻す。これについて、次の質問に答えなさい（必要なときは、最後に小数第1位を四捨五入すること）。';}
function rp(f){return Math.round(f[0]*100/f[1]);}
function chP(R,ans,wr){var L=[ans];wr.forEach(function(x){if(x>0&&x<100&&L.indexOf(x)<0&&L.length<4)L.push(x);});var k=1;while(L.length<4){[ans+3*k,ans-3*k].forEach(function(x){if(x>0&&x<100&&L.indexOf(x)<0&&L.length<4)L.push(x);});k++;}L.sort(num);var c=L.map(function(x){return x+'%';});return {c:c,a:c.indexOf(ans+'%')};}
function p125(R){var o=R.pick([1,0]);return o?[3,2,20,10]:[R.pick([3,2,4,1,3]),R.pick([2,3,1,1,4]),R.pick([20,30,10,40,25]),R.pick([10,5,20,15])];}
add(FK,5,'125-1',function(R){var p=p125(R),r=p[0],w=p[1],hr=p[2],hw=p[3];if(gc(r,w)!==1)return null;var f=fm(fr(r,r+w),fr(hr,100)),ans=rp(f);
 var ch=chP(R,ans,[hr,Math.round(hr*hw/10)||6,rp(fp(f,fm(fr(w,r+w),fr(hw,100)))),Math.round(ans/2)]);
 return mk(ch,q125(r,w,hr,hw)+'1回抽選をしたとき、当たりマークがある赤玉が出る確率はどれだけか。','割合の図：全体（1）→ 赤玉 '+r+'/'+(r+w)+' → そのうち当たり '+hr+'%。2段の割合を掛ける',
  {rows:[[{n:'全体',r:'1',w:1}],[{n:'赤玉',r:fs(fr(r,r+w)),w:.5},{n:'白玉',r:fs(fr(w,r+w)),w:.5}],[{n:'赤・当たり',r:String(hr/100),v:'!',w:.25,ask:1},{n:'赤・なし',r:String(1-hr/100),w:.25},{n:'',r:'',w:.5}]]},
  r+'/'+(r+w)+' × '+(hr/100)+' ＝ '+(f[0]/f[1])+'<br>→ '+ans+'%','125-1',{p:p});
},function(v,o){var r=v.p[0],w=v.p[1],c=0,t=0;for(var i=0;i<(r+w)*100;i++){t++;if(i<r*100&&i%100<v.p[2])c++;}return Math.round(c*100/t)+'%';});
add(FK,5,'125-2',function(R){var p=p125(R),r=p[0],w=p[1],hr=p[2],hw=p[3];if(gc(r,w)!==1)return null;var h=fp(fm(fr(r,r+w),fr(hr,100)),fm(fr(w,r+w),fr(hw,100))),nh=f1(h),f=fm(nh,nh),ans=rp(f);
 var ch=chP(R,ans,[rp(nh),rp(fm(h,h)),Math.round(rp(nh)*0.7),rp(f1(fm(h,h)))]);
 return mk(ch,q125(r,w,hr,hw)+'2回抽選をして2回とも当たりマークがない玉が出る確率はどれだけか。','1回で当たりが出る確率 ＝ 赤の当たり ＋ 白の当たり。1回で当たりがない確率はその残り。戻すので2回は掛ける',
  KH(['','確率'],[['赤の当たり',fs(fr(r,r+w))+' × '+(hr/100)],['白の当たり',fs(fr(w,r+w))+' × '+(hw/100)],['1回で当たりなし','1 − 当たり'],['2回とも','!2乗']]),
  '当たり '+(h[0]/h[1])+'<br>当たりなし 1 − '+(h[0]/h[1])+' ＝ '+(nh[0]/nh[1])+'<br>'+(nh[0]/nh[1])+' × '+(nh[0]/nh[1])+' ＝ '+(Math.round(f[0]/f[1]*1e6)/1e6)+'<br>→ '+ans+'%','125-2',{p:p});
},function(v,o){var r=v.p[0],w=v.p[1],n=(r+w)*100,miss=0;for(var i=0;i<n;i++){var red=i<r*100,k=i%100;if(!(red?k<v.p[2]:k<v.p[3]))miss++;}return Math.round(miss*miss*100/(n*n))+'%';});
/* 問126 */
var HN=['グー','チョキ','パー'];
function q126(p,q){return 'PとQがジャンケンをする。Pは'+HN.map(function(h,i){return h+'を'+fs(p[i]);}).join('、')+'の確率で出す。Qは'+HN.map(function(h,i){return h+'を'+fs(q[i]);}).join('、')+'の確率で出す。1回のジャンケンで、勝ち、負け、アイコの結果がある。';}
function d126(R){var A=[[[1,2],[1,4],[1,4]],[[1,4],[1,2],[1,4]],[[1,4],[1,4],[1,2]]];if(R.pick([1,0]))return [A[0],A[2]];return [R.pick(A),R.pick(A)];}
function g126(p,q,n,f){/* 1回で条件を満たす確率 x を出し、n回で少なくとも1回 */var x=[0,1];for(var i=0;i<3;i++)for(var j=0;j<3;j++)if(f(i,j))x=fp(x,fm(p[i],q[j]));return [x,f1(fpw(f1(x),n))];}
add(FK,5,'126-1',function(R){var d=d126(R),p=d[0],q=d[1],h=R.pick([1,0])?0:R.int(0,2),n=R.pick([2,3]),g=g126(p,q,n,function(i,j){return i===h&&(i+1)%3===j;}),x=g[0],ans=g[1];if(!x[0])return null;
 var ch=chF(R,ans,[fpw(x,n),fm([n,1],x),f1(ans),[7,32],[25,32]],4);
 return mk(ch,q126(p,q)+n+'回ジャンケンしたとき、少なくとも1回はPが'+HN[h]+'で勝つ確率はどれだけか。','Pが'+HN[h]+'で勝つのは、Qが'+HN[(h+1)%3]+'のとき。1回で起こる確率を出し、「'+n+'回とも起こらない」を1から引く',
  KH(['','確率'],[['1回でPが'+HN[h]+'で勝つ',fs(p[h])+' × '+fs(q[(h+1)%3])+' ＝ '+fs(x)],['1回で起こらない',fs(f1(x))],[n+'回とも起こらない','('+fs(f1(x))+')<sup>'+n+'</sup>'],['少なくとも1回','!1 − ('+fs(f1(x))+')<sup>'+n+'</sup>']]),
  fs(p[h])+' × '+fs(q[(h+1)%3])+' ＝ '+fs(x)+'<br>1 − ('+fs(f1(x))+')<sup>'+n+'</sup> ＝ '+fs(ans),'126-1',{p:p,q:q,h:h,n:n});
},function(v,o){var c=0,t=0;var W=[[4],[4],[4]];/* 確率を重みに直して総当たり（分母4） */var pw=v.p.map(function(f){return f[0]*4/f[1];}),qw=v.q.map(function(f){return f[0]*4/f[1];});
 seqs(2*v.n,3,function(x){var w=1,ok=0;for(var i=0;i<v.n;i++){w*=pw[x[2*i]]*qw[x[2*i+1]];if(x[2*i]===v.h&&(v.h+1)%3===x[2*i+1])ok=1;}t+=w;if(ok)c+=w;});return fs(fr(c,t));});
add(FK,5,'126-2',function(R){var d=d126(R),p=d[0],q=d[1],ex=R.pick([1,0])?0:R.int(0,2),n=R.pick([2,3]),u=[0,1,2].filter(function(i){return i!==ex;}),g=g126(p,q,n,function(i,j){return i!==ex&&((i+1)%3===j||i===j);}),x=g[0],ans=g[1];if(!x[0])return null;
 var ch=chF(R,ans,[x,[25,64],fpw(x,n),[25,32],f1(ans)],4);
 var rows=u.map(function(i){return ['Pが'+HN[i],'勝ち：Q'+HN[(i+1)%3]+'、アイコ：Q'+HN[i],fs(p[i])+' × ('+fs(q[(i+1)%3])+' ＋ '+fs(q[i])+')'];});
 return mk(ch,q126(p,q)+n+'回ジャンケンしたとき、少なくとも1回はPが'+HN[u[0]]+'か'+HN[u[1]]+'を出して、勝つかアイコになる確率はどれだけか。','Pが'+HN[u[0]]+'・'+HN[u[1]]+'それぞれで「勝つかアイコ」になるQの手を考え、1回の確率を出す。'+n+'回とも起こらない確率を1から引く',
  KH(['Pの手','Qの手','確率'],rows.concat([['1回で起こる','','!'+fs(x)],['少なくとも1回','','!1 − ('+fs(f1(x))+')<sup>'+n+'</sup>']])),rows.map(function(r){return r[2];}).join(' ＋ ')+' ＝ '+fs(x)+'<br>1 − ('+fs(f1(x))+')<sup>'+n+'</sup> ＝ '+fs(ans),'126-2',{p:p,q:q,ex:ex,n:n});
},function(v,o){var c=0,t=0,pw=v.p.map(function(f){return f[0]*4/f[1];}),qw=v.q.map(function(f){return f[0]*4/f[1];});
 seqs(2*v.n,3,function(x){var w=1,ok=0;for(var i=0;i<v.n;i++){var a=x[2*i],b=x[2*i+1];w*=pw[a]*qw[b];if(a!==v.ex&&((a+1)%3===b||a===b))ok=1;}t+=w;if(ok)c+=w;});return fs(fr(c,t));});

/* ===================== 解き方（問題集で新しく出た型の例題） ===================== */
function m(x){return '<mark>'+x+'</mark>';}
function LS(F,l,h,q,s1,fig,calc,ans){var A=(LESSON[F]=LESSON[F]||{});A[l]=A[l]||[];A[l].push({h:'例題（'+h+'）',q:q},{h:'ステップ1 条件を見つける',p:s1},{h:'ステップ2 表に書いて計算する',fig:fig,p2:'<div class="formula">'+calc.join('</div><div class="formula">')+'</div>'},{h:'答え',p:ans});}
LS(FJ,4,'同じ数字を何回使ってもよい','1、2、3、4、5、6の数字を使って、末尾が'+m('111')+'である'+m('6けた')+'の整数を作る。同じ数字を何回使ってもよい。何個できるか。',
 '「同じ数字を何回使ってもよい」は<b>重複順列</b>。1けたごとに使える数字の数を掛ける。末尾の'+m('111')+'は決まっているので、残りは'+m('6けた')+' − 3 ＝ 3けた。',
 T(['','上の3けた','各けた','公式'],[['','3けた','6通り','!6 × 6 × 6']]),['6 × 6 × 6 ＝ 216'],'216個');
LS(FJ,4,'○○より大きい数','0、1、2、3、4、5のカードが1枚ずつある。何枚かを並べて数を作る（0は一番上に使えない）。'+m('54320')+'より大きい数は何通りか。',
 'けた数で分ける。6枚全部の'+m('6けた')+'は、どれも5けたの54320より大きい。'+m('5けた')+'は上の位から54320と比べ、同じ数字が続いたあと大きくなるものだけを数える。',
 T(['','一番上','残り','公式'],[['6けた','5通り（0以外）','5枚を並べる','!5 × 5P5'],['5けた','5','4・3・2…と比べる','!54321 の1通り']]),['5 × 120 ＝ 600','5けた：543□□で54320より大きいのは 54321 だけ → 1','600 ＋ 1 ＝ 601'],'601通り');
LS(FJ,5,'先に4勝で決着','PとQが対戦し、先に'+m('4勝')+'した方が勝ち。'+m('7局目')+'に決着がつき、Pが勝った。パターンは何通りか。',
 '決着の局（'+m('7局目')+'）は、勝った方の'+m('4勝')+'目に<b>決まっている</b>。だから、その前の 7 − 1 ＝ 6局のうち、Pが勝つ 4 − 1 ＝ 3局を選ぶ組み合わせ。',
 T(JH,[['前の局','6局','3局','なし','!6C3']]),['6C3 ＝ (6 × 5 × 4) ÷ (3 × 2 × 1) ＝ 20'],'20通り。「○局目までに決着」は、4局目・5局目…ごとにこれを出し、どちらが勝つかで×2してたす');
LS(FJ,5,'番号のついた席','6人が①〜⑥の'+m('番号がついた')+'円形の席に座る。PとQが'+m('隣同士')+'になる座り方は何通りか。',
 '席に番号があるので、回転すると別の座り方になる。<b>円順列（÷人数）は使わない</b>。隣り合う2席の組（①②、②③、…、⑥①の6組）を選び、2人の座り方と残り4人の座り方を掛ける。',
 T(JH,[['隣の2席','6組','1組','','6'],['P・Q','2人','2人','あり','2P2'],['残り','4席','4人','あり','4P4'],['計','','','','!6 × 2 × 24']]),['6 × 2 × 24 ＝ 288'],'288通り。「隣同士にならない」は全体 6P6 から引く');
LS(FJ,5,'塗り分け','外側の領域と、円の中を左右に分けた2つの領域の、計3つの領域を'+m('4色')+'で塗る。線で隣り合う領域は同じ色にしない。塗り方は何通りか。',
 'まず<b>どの領域とどの領域が線で隣り合うか</b>を見る。3つとも互いに隣り合うので、3つとも違う色。'+m('4色')+'から3色を選んで並べる順列。隣り合わない領域があれば同じ色でもよいので場合分けする。',
 T(JH,[['3つの領域','4色','3色','あり','!4P3']]),['4 × 3 × 2 ＝ 24'],'24通り');
LS(FJ,5,'個数に上限がある','赤玉'+m('3個')+'、白玉'+m('3個')+'、黒玉'+m('3個')+'（同じ色は区別しない）から'+m('7個')+'を取り出す。色の組み合わせは何通りか。',
 '各色3個までなので、○と｜の並べ方はそのまま使えない。<b>取り出さずに残る方</b>を数える。残る玉は 9 − 7 ＝ 2個。2個なら各色3個以下なので上限を気にしなくてよい。残る方が大きいときは、1色の個数で場合分けする。',
 T(['','○','｜','並ぶ場所','公式'],[['残る玉','2個','2本','4か所','!4C2']]),['4C2 ＝ 6'],'6通り');
LS(FJ,5,'男女が交互','男性'+m('3人')+'と女性'+m('3人')+'が交互になるように一列に並ぶ。並び方は何通りか。',
 '男女の並びの形は「男女男女男女」と「女男女男女男」の2通り。形が決まれば、男性の席に男性3人、女性の席に女性3人を並べる。<b>輪</b>なら、男性を先に輪に並べ（(3 − 1)!）、間の3か所に女性を並べる（3!）。',
 T(JH,[['形','','','','2'],['男性','3席','3人','あり','3P3'],['女性','3席','3人','あり','3P3'],['計','','','','!2 × 6 × 6']]),['2 × 6 × 6 ＝ 72','輪なら 2 × 6 ＝ 12'],'72通り（輪は12通り）');
LS(FJ,5,'どの種類も同じ数ずつ','洋菓子'+m('5種類')+'、和菓子'+m('3種類')+'から、それぞれ'+m('8個')+'ずつ詰める。どの種類も同じ数ずつになる選び方は何通りか。',
 '「どの種類も同じ数」なので、洋菓子と和菓子で選ぶ<b>種類の数が同じ</b>。k種類ずつ選ぶとき、8 ÷ k が整数で、kは和菓子の3種類以下 → k ＝ 1、2 で場合分け。',
 T(['k','洋菓子','和菓子','通り'],[['1種類ずつ','5C1','3C1','15'],['2種類ずつ','5C2','3C2','30'],['計','','','!45']]),['5 × 3 ＝ 15','10 × 3 ＝ 30','15 ＋ 30 ＝ 45'],'45通り');
LS(FJ,5,'サイコロの目の大小','4つのサイコロP、Q、R、Sを振る。'+m('P、Q、R、Sの順に小さく')+'なる目の出方は何通りか。',
 '大小がすべて決まっているときは、<b>使う目を選ぶだけ</b>。1〜6から異なる4つの目を選べば、大きい順にP、Q、R、Sに当てはめる方法は1通り。',
 T(JH,[['目','6通り','4つ','なし','!6C4']]),['6C4 ＝ 6C2 ＝ 15'],'15通り');
LS(FJ,5,'2人で合わせて何回','3種類のワインを、PとQが1種類につき1人1回まで試飲する。2人で合わせて'+m('4回')+'試飲するとき、だれがどれを飲んだかの組み合わせは何通りか。',
 '「Pが1種類目」「Qが1種類目」…のように、<b>2人 × 3種類 ＝ 6つの枠</b>があると考える。その中から飲む'+m('4つ')+'を選ぶ組み合わせ。',
 T(JH,[['枠','6つ','4つ','なし','!6C4']]),['6C4 ＝ 15'],'15通り');
LS(FK,4,'硬貨の金額の合計','50円玉'+m('2枚')+'と100円玉'+m('2枚')+'を同時に投げる。表の金額の合計が'+m('200円')+'になる確率はどれだけか。',
 '全ての出方は 2<sup>4</sup> ＝ 16通り（硬貨はすべて区別する）。合計200円になる表の組み合わせを書き出し、どの硬貨が表かも数える。',
 T(['100円の表','50円の表','通り'],[['2枚','0枚','2C2 × 2C0 ＝ 1'],['1枚','2枚','2C1 × 2C2 ＝ 2'],['計','','!3']]),['3/16'],'3/16');
LS(FK,4,'○以上の差で勝つ','PとQがサイコロを1回ずつ振る。Pが'+m('4以上の差')+'でQに勝つ確率はどれだけか。',
 '全ての出方は36通り。差が4・5になる（P,Q）を書き出す。差4：(5,1)(6,2)、差5：(6,1)。',T(['差','通り'],[['4','2'],['5','1'],['計','!3']]),['3/36 ＝ 1/12'],'1/12');
LS(FK,5,'n回目でj度目','白'+m('2個')+'・黒'+m('4個')+'の袋から1個取り出して戻すことを'+m('4回')+'くり返す。'+m('4回目')+'に'+m('3度目')+'の黒が出る確率はどれだけか。',
 '最後の4回目は黒に<b>決まっている</b>。その前の3回で黒がちょうど2回（どの回かで3C2通り）。黒4/6 ＝ 2/3、白 1/3。',
 T(['','確率'],[['3回目まで','3C2 × (2/3)<sup>2</sup> × 1/3'],['4回目','2/3'],['計','!掛ける']]),['3 × 4/9 × 1/3 ＝ 4/9','4/9 × 2/3 ＝ 8/27'],'8/27');
LS(FK,5,'0で戻るルーレット','0〜9のルーレットを'+m('3回')+'回し、出た数だけ進む（0ならスタートに戻る）。'+m('4つ')+'進んだ位置にいる確率はどれだけか。',
 '全ての出方は 10<sup>3</sup> ＝ 1000通り。<b>最後に0が出たのが何回目か</b>で場合分けする。0のあとに出た数の合計が4になればよい。',
 T(['場合','合計4になる数','通り'],[['0なし','3つ（各1以上）','3C2 ＝ 3'],['1回目が0','2つ（各1以上）','3'],['2回目が0','3回目が4（1回目は何でも）','10'],['計','','!16']]),['16/1000 ＝ 2/125'],'2/125');
LS(FK,5,'カードの和が等しい','Pが1、3、5、7の4枚、Qが2、4、6の3枚を持つ。2人が'+m('2枚ずつ')+'出したとき、和が等しくなる確率はどれだけか。',
 '全ての出し方は 4C2 × 3C2 ＝ 18通り。2人の和の一覧を作る。P：4、6、8、8、10、12。Q：6、8、10。同じ和の組を数える。',
 T(['和','P','Q'],[['6','1','1'],['8','2','1'],['10','1','1'],['計','','!4通り']]),['4/18 ＝ 2/9'],'2/9');
LS(FK,5,'比率と割合（割合の図）','赤玉と白玉が'+m('3：2')+'の比率で入っている。赤玉の'+m('20%')+'、白玉の'+m('10%')+'に当たりマークがある。当たりマークのある赤玉が出る確率は何%か。',
 '確率も<b>割合の図</b>で考える。全体1 → 赤玉 3/5 → そのうち当たり 0.2。③ ＝ ① × ② を2段くり返す。',
 {rows:[[{n:'全体',r:'1',w:1}],[{n:'赤玉',r:'3/5',w:.6},{n:'白玉',r:'2/5',w:.4}],[{n:'赤・当たり',r:'0.2',v:'!',w:.3,ask:1},{n:'赤・なし',r:'0.8',w:.3},{n:'',r:'',w:.4}]]},['3/5 × 0.2 ＝ 0.12'],'12%');
LS(FK,5,'確率が違うジャンケン','Pはグーを'+m('1/2')+'、チョキ・パーを1/4ずつ、Qはパーを'+m('1/2')+'、グー・チョキを1/4ずつの確率で出す。'+m('2回')+'のうち少なくとも1回、Pがグーで勝つ確率は？',
 'Pがグーで勝つのはQがチョキのとき。1回の確率は 1/2 × 1/4 ＝ 1/8。「少なくとも」は「2回とも起こらない」を1から引く。',
 T(['','確率'],[['1回で起こる','1/2 × 1/4 ＝ 1/8'],['2回とも起こらない','(7/8)<sup>2</sup> ＝ 49/64'],['少なくとも1回','!1 − 49/64']]),['1 − 49/64 ＝ 15/64'],'15/64');

})();
