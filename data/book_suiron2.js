/* 問題集（推論 問45〜87）の収録：担当B（book_suiron2.js）。
   問題文は問題集のまま、数値だけを変える。bk＝問題集の番号-小問（小問なしは番号だけ）。元の数値も候補に入れてあり、元の数値では別冊の正解になる。
   make は条件を満たす場合をすべて書き出して答えを出す。verify は別の数え上げ（人ごとに候補を絞ってから組み合わせる・式で求める等）で解き直す。
   問64・65は写真がないため未収録。 */
(function(){
var B=BANK['推論'];
function add(lv,o){B[lv].real=B[lv].real||[];B[lv].real.push(o);}
function tp(lv,id,bk,make,verify){add(lv,{id:'bk'+id,bk:bk,make:make,verify:verify});}
function rg(a,b,s){s=s||1;var r=[];for(var i=a;i<=b;i+=s)r.push(i);return r;}
function T(h,r){return {table:{head:h,rows:r.slice(0,8)}};}
var RM=['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ'];
function cd(a,st){st=st||0;return a.map(function(s,i){return RM[i+st]+'　'+s;}).join('<br>');}
function has(a,x){return a.indexOf(x)>=0;}
function uq(a){var r=[];a.forEach(function(x){if(r.indexOf(x)<0)r.push(x);});return r.sort(function(x,y){return typeof x==='number'?x-y:(x<y?-1:x>y?1:0);});}
function same(a,b){return a.length===b.length&&a.every(function(x,i){return x===b[i];});}
function prod(doms,f){var n=doms.length,a=[];(function rec(i){if(i===n){f(a.slice());return;}doms[i].forEach(function(x){a[i]=x;rec(i+1);});})(0);}
function perms(arr){var out=[];(function rec(a,rest){if(!rest.length){out.push(a);return;}rest.forEach(function(x,i){rec(a.concat([x]),rest.slice(0,i).concat(rest.slice(i+1)));});})([],arr);return out;}
function combs(arr,k){var out=[];(function rec(s,a){if(a.length===k){out.push(a);return;}for(var i=s;i<arr.length;i++)rec(i+1,a.concat([arr[i]]));})(0,[]);return out;}
function memo(f){var c={};return function(k){var s=JSON.stringify(k);return c.hasOwnProperty(s)?c[s]:(c[s]=f(k));};}
function lazy(f){var v=null;return function(){return v||(v=f());};}
/* 選択肢と答え（文字列の配列＝すべて選ぶ、文字列＝1つ選ぶ）から問題を作る */
function O(bk,q,c,ans,x){
  var a=Array.isArray(ans)?c.map(function(s,i){return has(ans,s)?i:-1;}).filter(function(i){return i>=0;}):c.indexOf(ans);
  return {bk:bk,q:q,c:c,a:a,inwh:'条件',inw:x.inw,fig:x.fig,calc:x.calc,v:x.v};}
/* ア・イ・ウの組み合わせ8択 */
function KUMI(m,last){return [m[0]+'だけ',m[1]+'だけ',m[2]+'だけ',m[0]+'と'+m[1],m[0]+'と'+m[2],m[1]+'と'+m[2],m[0]+'と'+m[1]+'と'+m[2],last];}
function kumiAns(m,ok,last){var s=m.filter(function(x,i){return ok[i];});return !s.length?last:s.length===1?s[0]+'だけ':s.join('と');}
/* 2つの推論の正誤9択 */
var J3=['正しい','どちらともいえない','誤り'];
function NINE(a,b){var o=[];[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]].forEach(function(p){o.push(nineTxt(a,b,p[0],p[1]));});return o;}
function nineTxt(a,b,x,y){if(x===y)return a+'も'+b+'も'+J3[x];return a+'は'+['正しいが','どちらともいえないが','誤りだが'][x]+b+'は'+J3[y];}
/* 「最も少ない情報で確定する」：base の解のうち、情報の組を足すと key が1通りに決まる最小の組（1つだけのとき）を返す。決まらなければ []、最小の組が2つ以上なら null */
function minInfo(sols,infos,key){var n=infos.length,best=null,cnt=0;
  for(var sz=1;sz<=n&&best===null;sz++){combs(rg(0,n-1),sz).forEach(function(cb){
    var s=sols.filter(function(x){return cb.every(function(i){return infos[i](x);});});
    if(s.length&&uq(s.map(key)).length===1){cnt++;if(best===null)best=cb;}});
    if(best!==null&&cnt>1)return null;}
  return best===null?[]:best;}
function keyS(x){return JSON.stringify(x);}
/* ===== 問45 スキーとゴルフ ===== */
var PS4=['P','Q','R','S'];
function s45(k,g){var out=[];prod([[0,1],[0,1],[0,1],[0,1],[0,1],[0,1],[0,1],[0,1]],function(x){
  var sk=[x[0],x[2],x[4],x[6]],go=[x[1],x[3],x[5],x[7]];
  if(sk[0]!==1||sk[1]+go[1]!==1||sk[2]!==go[2])return;
  if(sk[0]+sk[1]+sk[2]+sk[3]!==k)return;if(g!=null&&go[0]+go[1]+go[2]+go[3]!==g)return;out.push({sk:sk,go:go});});return out;}
function v45(k,g){/* 人ごとに候補を絞ってから組み合わせる */var cand=[[[1,0],[1,1]],[[1,0],[0,1]],[[0,0],[1,1]],[[0,0],[0,1],[1,0],[1,1]]],out=[];
  prod(cand,function(x){var ks=0,gs=0;x.forEach(function(y){ks+=y[0];gs+=y[1];});if(ks===k&&(g==null||gs===g))out.push(x);});return out;}
function q45(k,g){return 'P、Q、R、Sのスキーとゴルフの経験について、次のことがわかった。<br>'+cd(['Pはスキー経験がある','Qはどちらか一方だけ経験がある','Rはどちらも経験があるか、もしくはどちらも経験がない','スキーの経験があるのは'+k+'人である'])+'<br><br>';}
function f45(s){return T(['','P','Q','R','S'],s.map(function(x,i){return [String(i+1)].concat(x.sk.map(function(a,j){var t=(a?'ス':'')+(x.go[j]?'ゴ':'');return t||'－';}));}));}
tp(6,'45-1','45-1',function(R){var k=R.pick([1,2,3,2]),s=s45(k),ans=PS4.filter(function(p,i){return s.some(function(x){return x.go[i];});});
  return O('45-1',q45(k)+'ゴルフ経験がある可能性のある人は誰か。当てはまるものをすべて選びなさい。',PS4,ans,{inw:'P：スキー○<br>Q：どちらか一方だけ<br>R：両方○か両方×<br>スキー○は'+k+'人',fig:f45(s),calc:'表（ス＝スキー、ゴ＝ゴルフ）の'+s.length+'通りのどこかでゴルフ○になる人を選ぶ → '+ans.join('、'),v:{k:k}});},
  function(v){var s=v45(v.k);return PS4.filter(function(p,i){return s.some(function(x){return x[i][1];});});});
var P45b=lazy(function(){var r=[];[1,2,3].forEach(function(k){[1,2,3].forEach(function(g){var s=s45(k,g);if(!s.length)return;var a=PS4.filter(function(p,i){return s.every(function(x){return !x.sk[i];});});if(a.length)r.push([k,g]);});});return r;});
tp(6,'45-2','45-2',function(R){var p=R.pick(P45b().concat([[2,1],[2,1]])),k=p[0],g=p[1],s=s45(k,g),ans=PS4.filter(function(p,i){return s.every(function(x){return !x.sk[i];});});
  return O('45-2',q45(k)+'Ⅰ〜Ⅳの条件に「Ⅴ　ゴルフ経験があるのは'+g+'人だけである」という条件を加えたとき、確実にスキーの経験がない人は誰か。当てはまるものをすべて選びなさい。',PS4,ans,{inw:'Ⅰ〜Ⅳに加えて ゴルフ○は'+g+'人',fig:f45(s),calc:'条件に合うのは'+s.length+'通り。どの場合でもスキー×の人 → '+ans.join('、'),v:{k:k,g:g}});},
  function(v){var s=v45(v.k,v.g);return PS4.filter(function(p,i){return s.every(function(x){return !x[i][0];});});});

/* ===== 問46 3階建て6戸の世帯人数 ===== */
var C46=rg(3,10).map(function(x){return x+'人';});
function a46(N){var r=[];for(var p=2;p<=N;p++)for(var s=2;s<=N;s++){var u=N-9-p-s;if(u<2)continue;[[p,s],[p,u],[s,u],[3,p],[3,s],[3,u]].forEach(function(x){r.push(x[0]+x[1]);});}return uq(r);}
var P46=lazy(function(){return rg(13,21).filter(function(N){var a=a46(N);return a.length&&a.length<8&&a.every(function(x){return x>=3&&x<=10;});});});
tp(6,'46','46',function(R){var N=R.pick(P46().concat([17,17])),a=a46(N),rest=N-9;
  return O('46','各階に2戸ずつ、計6戸ある3階建ての建物の各戸に、P、Q、R、S、T、Uの6世帯が1世帯ずつ住んでいる。これについて、次のことがわかっている。<br>'+cd(['単身世帯はない','6世帯の合計人数は'+N+'人である','Q、R、Tはいずれも3人世帯である','QとRは1階に住んでいる'])+'<br><br>2階には何人住んでいるか。当てはまるものをすべて選びなさい。',C46,a.map(function(x){return x+'人';}),
   {inw:'1階はQとR。2階はP、S、T、Uのうち2世帯<br>P＋S＋U ＝ '+N+' − 9 ＝ '+rest+'（それぞれ2人以上）',
    fig:T(['2階の組','人数'],[['Tと（P・S・U）','3 ＋ 2〜'+(rest-4)],['P・S・Uの2つ','4〜'+(rest-2)]]),
    calc:'P、S、Uは2人以上で合計'+rest+'人なので、1世帯は2〜'+(rest-4)+'人、2世帯の和は4〜'+(rest-2)+'人<br>2階は '+a.join('、')+'人',v:{N:N}});},
  function(v){var r=[];/* 部屋の割り当てを総当たり（0・1が1階） */var pe=perms([0,1,2,3,4,5]);
    for(var p=2;p<=v.N;p++)for(var s=2;s<=v.N;s++)for(var u=2;u<=v.N;u++){if(p+s+u+9!==v.N)continue;var sz=[p,3,3,s,3,u];
      pe.forEach(function(rm){if(Math.floor(rm[1]/2)!==0||Math.floor(rm[2]/2)!==0)return;var t=0;for(var i=0;i<6;i++)if(Math.floor(rm[i]/2)===1)t+=sz[i];r.push(t);});}
    return uq(r).map(function(x){return x+'人';});});

/* ===== 問47 菓子30個 ===== */
var C47=rg(6,13).map(function(x){return x+'個';});
var P47=lazy(function(){var r=[];rg(16,44,2).forEach(function(t){rg(1,6).forEach(function(d){if((t/2+d)%2)return;var y=(t/2+d)/2,z=y-d;if(z>=1&&y>=6&&y<=13)r.push([t,d]);});});return r;});
tp(6,'47','47',function(R){var p=R.pick(P47().concat([[30,3],[30,3]])),t=p[0],d=p[1],h=t/2,y=(h+d)/2,z=y-d,x=y+z;
  return O('47',t+'個の菓子をX、Y、Zの3人で分けた。分けられた菓子の個数について、次のことがわかっている。<br>'+cd(['菓子の数は、多い順にX、Y、Zである','XとYの個数の差は、Zの個数と同じである','YとZの個数の差は'+d+'個である'])+'<br><br>このとき、Yは何個だったか。',C47,y+'個',
   {inw:'Ⅱ X − Y ＝ Z なので X ＝ Y ＋ Z<br>合計 X＋Y＋Z ＝ 2 ×（Y＋Z）＝ '+t,fig:T(['','Y＋Z','Y − Z','Y','Z','X'],[['個数',String(h),String(d),String(y),String(z),String(x)]]),
    calc:'Y ＋ Z ＝ '+t+' ÷ 2 ＝ '+h+'<br>Y − Z ＝ '+d+'<br>Y ＝ （'+h+' ＋ '+d+'）÷ 2 ＝ '+y+'個',v:{t:t,d:d}});},
  function(v){var r=null;for(var x=1;x<v.t;x++)for(var y=1;y<x;y++){var z=v.t-x-y;if(z>=1&&z<y&&x-y===z&&y-z===v.d)r=y+'個';}return r;});

/* ===== 問48 ペット ===== */
var C48=rg(1,5).map(function(x){return x+'匹';});
function s48(S){var o=[];prod([rg(1,S),rg(1,S),rg(1,S),rg(1,S)],function(x){if(x[0]+x[1]+x[2]+x[3]!==S)return;
  function tw(i){return x.some(function(y,j){return j!==i&&y===x[i];});}if(tw(0)&&tw(1))o.push(x);});return o;}
function v48(S){var o=[];for(var p=1;p<S;p++)for(var q=1;q<S;q++)for(var r=1;r<S;r++){var s=S-p-q-r;if(s<1)continue;var x=[p,q,r,s];
  var cP=x.filter(function(y){return y===p;}).length,cQ=x.filter(function(y){return y===q;}).length;if(cP>=2&&cQ>=2)o.push(x);}return o;}
function f48(s){return T(['','P','Q','R','S'],s.map(function(x,i){return [String(i+1)].concat(x.map(String));}));}
function q48(S){return 'P、Q、R、Sの4人がペットを飼っている。ペットの数について、次のことがわかっている。<br>'+cd(['4人合わせて'+S+'匹のペットを飼っている','Pと同じ数のペットを飼っている人がいる','Qと同じ数のペットを飼っている人がいる'])+'<br><br>';}
var P48a=lazy(function(){var o=[];rg(6,11).forEach(function(S){rg(1,5).forEach(function(r){var a=uq(s48(S).filter(function(x){return x[2]===r;}).map(function(x){return x[3];}));if(a.length&&a.length<5&&a.every(function(y){return y<=5;}))o.push([S,r]);});});return o;});
var P48b=lazy(function(){return rg(6,11).filter(function(S){var a=uq(s48(S).filter(function(x){return x.filter(function(y){return y===x[3];}).length>=2;}).map(function(x){return x[2];}));return a.length&&a.length<5&&a.every(function(y){return y<=5;});});});
tp(6,'48-1','48-1',function(R){var p=R.pick(P48a().concat([[8,3],[8,3]])),S=p[0],r=p[1],s=s48(S).filter(function(x){return x[2]===r;}),a=uq(s.map(function(x){return x[3];}));
  return O('48-1',q48(S)+'Rが'+r+'匹のペットを飼っているとき、Sは何匹のペットを飼っているか。当てはまるものをすべて選びなさい。',C48,a.map(function(x){return x+'匹';}),
   {inw:'PもQも「同じ数の人」がいる → 4人の数は「2人ずつ同じ」か「3人以上同じ」<br>R ＝ '+r,fig:f48(s),calc:'合計'+S+'匹、R ＝ '+r+'で書き出すと'+s.length+'通り。Sは '+a.join('、')+'匹',v:{S:S,r:r}});},
  function(v){return uq(v48(v.S).filter(function(x){return x[2]===v.r;}).map(function(x){return x[3];})).map(function(x){return x+'匹';});});
tp(6,'48-2','48-2',function(R){var S=R.pick(P48b().concat([8,8])),s=s48(S).filter(function(x){return x.filter(function(y){return y===x[3];}).length>=2;}),a=uq(s.map(function(x){return x[2];}));
  return O('48-2',q48(S)+'Sと同じ数のペットを飼っている人がいるとき、Rは何匹のペットを飼っているか。当てはまるものをすべて選びなさい。',C48,a.map(function(x){return x+'匹';}),
   {inw:'P、Q、Sの3人に「同じ数の人」がいる<br>→ 4人が「2人ずつ同じ」か「3人以上同じ」',fig:f48(s),calc:'合計'+S+'匹で書き出すと'+s.length+'通り。Rは '+a.join('、')+'匹',v:{S:S}});},
  function(v){return uq(v48(v.S).filter(function(x){return x.indexOf(x[3])!==3||x.lastIndexOf(x[3])!==3;}).map(function(x){return x[2];})).map(function(x){return x+'匹';});});
/* 数値の選択肢（最後が「いずれでもない」）。ときどき正解を選択肢から外して「いずれでもない」を正解にする */
function NC(R,ans,offs,unit,none){var vs=[ans].concat(offs.map(function(o){return ans+o;}));
  if(R.int(1,6)===1){vs[0]=ans+R.pick([-15,-10,10,15,20].filter(function(o){return vs.indexOf(ans+o)<0;}));}
  vs=uq(vs);if(vs.length<offs.length+1||vs.some(function(x){return x<0;}))return null;
  var c=vs.map(function(x){return fm(x)+unit;});c.push(none);return {c:c,ans:vs.indexOf(ans)>=0?fm(ans)+unit:none};}
function VC(o,val,unit){var t=fm(val)+unit;return o.c.indexOf(t)>=0?t:o.c[o.c.length-1];}
function fm(x){return x<0?'−'+(-x):String(x);}
/* ===== 問49 身長500人 ===== */
var P49=lazy(function(){var o=[];[400,500,600].forEach(function(N){rg(100,200,10).forEach(function(c){rg(150,250,10).forEach(function(b){var u=N-c-b;if(u<60||u>250)return;
  rg(c-50,c-10,10).forEach(function(m){rg(m+20,m+u-5,10).forEach(function(a){var a2=u-(a-m);if(a2>=5&&a2<=u-5)o.push([N,a,b,c,m]);});});});});});return o;});
function q49(p){return 'ある大学の学生'+p[0]+'人の身長について、以下のことがわかっている。<br>'+cd(['身長が160cm以上の男子学生は'+p[1]+'人いる','身長が170cm未満の女子学生は'+p[2]+'人いる','身長が170cm以上の学生は'+p[3]+'人いる'])+'<br><br>';}
function T49(p,u,ask){return T(['','170cm以上','170cm未満','計'],[['男子','',ask===1?'!?':String(u),''],['女子','',String(p[2]),''],['計',String(p[3]),String(p[0]-p[3]),String(p[0])]]);}
tp(6,'49-1','49-1',function(R){var p=R.pick(P49().concat([[500,270,190,150,140]])),u=p[0]-p[3]-p[2],x=NC(R,u,[-55,-40,-30,-25],'人','AからEのいずれでもない');if(!x)return null;
  return O('49-1',q49(p)+'身長が170cm未満の男子学生は何人いるか。',x.c,x.ans,{inw:'男女 × 170cm以上・未満のカルノー表<br>Ⅰの「160cm以上」は❶では使わない',fig:T49(p,u,1),
    calc:'170cm未満の学生 ＝ '+p[0]+' − '+p[3]+' ＝ '+(p[0]-p[3])+'<br>170cm未満の男子 ＝ '+(p[0]-p[3])+' − '+p[2]+' ＝ '+u+'人',v:{p:p}});},
  function(v,o){var p=v.p,u=0;/* 170cm以上の男子を仮に置いて、男子全体から引く（どの値でも同じになる） */for(var m1=0;m1<=p[3];m1++){var men=p[0]-p[2]-(p[3]-m1);u=men-m1;}return VC(o,u,'人');});
tp(6,'49-2','49-2',function(R){var p=R.pick(P49().concat([[500,270,190,150,140]])),u=p[0]-p[3]-p[2],a2=u-(p[1]-p[4]),x=NC(R,a2,[-2,-1,1,60],'人','AからEのいずれでもない');if(!x)return null;
  return O('49-2',q49(p)+'身長が170cm以上の男子学生が'+p[4]+'人以下ならば、身長が160cm未満の男子学生は最も多くて何人か。',x.c,x.ans,
   {inw:'男子を「160cm未満・160〜170cm・170cm以上」の3つに分ける<br>160cm以上の男子 ＝ 160〜170cm ＋ 170cm以上 ＝ '+p[1],
    fig:T(['男子','160cm未満','160〜170cm','170cm以上'],[['人数','!?',String(p[1]-p[4]),String(p[4])],['合計',String(u)+'（170cm未満）','',String(p[1])+'（160cm以上）']]),
    calc:'170cm未満の男子 ＝ '+p[0]+' − '+p[3]+' − '+p[2]+' ＝ '+u+'<br>160cm未満を最も多くするには、160〜170cmを最も少なく → 170cm以上を最も多い'+p[4]+'人にする<br>160〜170cm ＝ '+p[1]+' − '+p[4]+' ＝ '+(p[1]-p[4])+'<br>160cm未満 ＝ '+u+' − '+(p[1]-p[4])+' ＝ '+a2+'人',v:{p:p}});},
  function(v,o){var p=v.p,best=-1;for(var X=0;X<=Math.min(p[4],p[3]);X++){var y=p[1]-X,u=p[0]-p[3]-p[2];if(y<0||y>u)continue;best=Math.max(best,u-y);}return VC(o,best,'人');});
/* ===== 問50 1〜9の数字を5人 ===== */
var ALL50=lazy(function(){var o=[];(function rec(a){if(a.length===5){o.push(a.slice());return;}for(var x=1;x<=9;x++)if(a.indexOf(x)<0){a.push(x);rec(a);a.pop();}})([]);return o;});
function inf50(s,d){return [function(x){return x[2]===Math.max.apply(null,x);},function(x){return x[3]===s;},function(x){return x[2]===x[4]+d;},
  function(x){return x[0]%2&&x[3]%2&&!(x[1]%2)&&!(x[2]%2)&&!(x[4]%2);}];}
var C50L=['A','B','C','D'];
function t50(s,d){return ['Rの数が最大だった','Sの数は'+s+'だった','Rの数はTの数より'+d+'大きかった','奇数はPとSだけだった'];}
var S50=memo(function(k){var s=k[0],d=k[1],inf=inf50(s,d),all=ALL50().filter(function(x){return inf.every(function(f){return f(x);});});
  var mi=minInfo(ALL50(),inf,function(x){return x[2];});
  var add=all.filter(function(x){var r=x.slice().sort(function(a,b){return b-a;});return x[0]===r[2]&&x[1]===r[4];});
  return {mi:mi,all:all,add:add};});
var P50a=lazy(function(){var o=[];rg(1,9).forEach(function(s){rg(1,8).forEach(function(d){var r=S50([s,d]);if(r.mi&&r.all.length)o.push([s,d]);});});return o;});
var P50b=lazy(function(){return P50a().filter(function(p){return S50(p).add.length;});});
var Q50='P、Q、R、S、Tの5人に1から9までの数字を1つずつ書いてもらった。同じ数字を書いた人はいなかった。<br><br>';
function c50(s,d){var t=t50(s,d);return t.concat(['AからDのすべての情報が加わっても確定できない']);}
tp(6,'50-1','50-1',function(R){var p=R.pick(P50a().concat([[7,4],[7,4]])),s=p[0],d=p[1],r=S50(p),c=c50(s,d),ans=r.mi.length?r.mi.map(function(i){return c[i];}):[c[4]];
  var inf=inf50(s,d),rows=[];[[0],[1],[2],[3]].concat(r.mi.length>1?[r.mi]:[]).forEach(function(cb){var v=uq(ALL50().filter(function(x){return cb.every(function(i){return inf[i](x);});}).map(function(x){return x[2];}));rows.push([cb.map(function(i){return C50L[i];}).join('＋'),v.join('、')]);});
  return O('50-1',Q50+'最も少ない情報でRの数字を確定するには、次のどれがわかればよいか。必要な情報をすべて選びなさい。',c,ans,
   {inw:'1つずつ足して、Rの候補が1つに絞れるかを見る<br>Dなら Q・R・T は偶数（2、4、6、8）',fig:T(['情報','Rの候補'],rows),
    calc:r.mi.length?r.mi.map(function(i){return C50L[i];}).join('と')+'で、Rは '+uq(r.all.map(function(x){return x[2];})).join('')+' に決まる。それより少ない組では決まらない':'AからDを全部使ってもRは1つに決まらない',v:{s:s,d:d}});},
  function(v,o){var inf=inf50(v.s,v.d),hit=[];/* 小さい組から順に、Rの値が1つになる組を探す */
    var subs=[];for(var m=1;m<16;m++){var cb=[0,1,2,3].filter(function(i){return m>>i&1;});subs.push(cb);}
    subs.sort(function(a,b){return a.length-b.length;});var best=null;
    subs.forEach(function(cb){if(best&&cb.length>best.length)return;var rs={};var n=0;ALL50().forEach(function(x){if(cb.every(function(i){return inf[i](x);})){rs[x[2]]=1;n++;}});if(n&&Object.keys(rs).length===1&&!best)best=cb;});
    return best?best.map(function(i){return o.c[i];}):[o.c[4]];});
tp(6,'50-2','50-2',function(R){var p=R.pick(P50b().concat([[7,4],[7,4]])),s=p[0],d=p[1],r=S50(p),c=['P','Q','R','S','T','5人の数はすべて確定できる'];
  var und=['P','Q','R','S','T'].filter(function(x,i){return uq(r.add.map(function(y){return y[i];})).length>1;});
  return O('50-2',Q50+'次のAからDの情報がある。<br>'+t50(s,d).map(function(x,i){return C50L[i]+'　'+x;}).join('<br>')+'<br>AからDの情報に加えて、次のⅠ、Ⅱの情報も正しいとわかったとき、数字が確定しない人は誰か。当てはまるものをすべて選びなさい。<br>'+cd(['Pの数は3番目に大きかった','Qの数は最小だった']),
   c,und.length?und:[c[5]],{inw:'AからD、Ⅰ、Ⅱをすべて満たす数の組を書き出す',fig:T(['','P','Q','R','S','T'],r.add.map(function(x,i){return [String(i+1)].concat(x.map(String));})),
    calc:'条件に合うのは'+r.add.length+'通り。'+(und.length?'2通り以上の数になる人は '+und.join('、'):'全員の数が1つに決まる'),v:{s:s,d:d}});},
  function(v,o){var inf=inf50(v.s,v.d),seen=[{},{},{},{},{}];ALL50().forEach(function(x){if(!inf.every(function(f){return f(x);}))return;
     var bigger=function(i){return x.filter(function(y){return y>x[i];}).length;};if(bigger(0)!==2||bigger(1)!==4)return;x.forEach(function(y,i){seen[i][y]=1;});});
    var u=['P','Q','R','S','T'].filter(function(n,i){return Object.keys(seen[i]).length>1;});return u.length?u:[o.c[5]];});

/* ===== 問51 トランプ1〜9を3人に ===== */
var S51=memo(function(k){var s=k[0],q=k[1],p=k[2],o=[];combs(rg(1,9),3).forEach(function(P){if(P[0]+P[1]+P[2]!==s||has(P,q))return;
  combs(rg(1,9).filter(function(x){return !has(P,x);}),3).forEach(function(Rr){if(Rr[0]*Rr[1]*Rr[2]!==p||has(Rr,q))return;o.push({P:P,R:Rr,Q:rg(1,9).filter(function(x){return !has(P,x)&&!has(Rr,x);})});});});return o;});
var P51=lazy(function(){var o=[];rg(10,22).forEach(function(s){rg(1,9).forEach(function(q){[6,8,10,12,15,18,20,24,30].forEach(function(p){var r=S51([s,q,p]);if(!r.length)return;
  var must=rg(1,9).filter(function(x){return r.every(function(y){return has(y.P,x);});}),qq=uq([].concat.apply([],r.map(function(y){return y.Q;}))).filter(function(x){return x!==q;});
  o.push([s,q,p,must.length>0,qq.length>0&&qq.length<8]);});});});return o;});
function q51(s,q,p){return '1組のトランプからハートの1から9までのカードを取り出して、P、Q、Rの3人に3枚ずつ配った。カードの数について、次のことがわかっている。<br>'+cd(['Pのカードの3つの数字の和は'+s+'である','Qには'+q+'のカードが配られた','Rのカードの3つの数字の積は'+p+'である'])+'<br><br>';}
function f51(r){return T(['','P','Q','R'],r.map(function(y,i){return [String(i+1),y.P.join('・'),y.Q.join('・'),y.R.join('・')];}));}
tp(6,'51-1','51-1',function(R){var p=R.pick(P51().filter(function(x){return x[3];}).concat([[20,8,12,1],[20,8,12,1]])),r=S51([p[0],p[1],p[2]]);
  var must=rg(1,9).filter(function(x){return r.every(function(y){return has(y.P,x);});});
  return O('51-1',q51(p[0],p[1],p[2])+'Pが必ず持っている数字をすべて選びなさい。',rg(1,9).map(String),must.map(String),
   {inw:'積が'+p[2]+'になる3枚（R）は少ない → Rから書き出す<br>Pは和が'+p[0]+'、Qは'+p[1]+'を持つ',fig:f51(r),calc:'あり得る配り方は'+r.length+'通り。どの場合もPが持つのは '+must.join('、'),v:{s:p[0],q:p[1],p:p[2]}});},
  function(v){var cnt={},n=0;/* Rの3枚から決める */combs(rg(1,9),3).forEach(function(Rr){if(Rr[0]*Rr[1]*Rr[2]!==v.p||has(Rr,v.q))return;var rest=rg(1,9).filter(function(x){return !has(Rr,x)&&x!==v.q;});
     combs(rest,3).forEach(function(P){if(P[0]+P[1]+P[2]===v.s){n++;P.forEach(function(x){cnt[x]=(cnt[x]||0)+1;});}});});
    return Object.keys(cnt).filter(function(x){return cnt[x]===n;}).map(String);});
tp(6,'51-2','51-2',function(R){var p=R.pick(P51().filter(function(x){return x[4];}).concat([[20,8,12,1,1],[20,8,12,1,1]])),r=S51([p[0],p[1],p[2]]),q=p[1];
  var qq=uq([].concat.apply([],r.map(function(y){return y.Q;}))).filter(function(x){return x!==q;}),c=rg(1,9).filter(function(x){return x!==q;}).map(String);
  return O('51-2',q51(p[0],p[1],p[2])+'Qが'+q+'以外に持っている可能性のある数字をすべて選びなさい。',c,qq.map(String),
   {inw:'Rの3枚（積'+p[2]+'）とPの3枚（和'+p[0]+'）を決めると、残りがQ',fig:f51(r),calc:'あり得る配り方は'+r.length+'通り。Qの'+q+'以外のカードは '+qq.join('、'),v:{s:p[0],q:q,p:p[2]}});},
  function(v){var got={};combs(rg(1,9),3).forEach(function(Rr){if(Rr[0]*Rr[1]*Rr[2]!==v.p||has(Rr,v.q))return;var rest=rg(1,9).filter(function(x){return !has(Rr,x)&&x!==v.q;});
     combs(rest,3).forEach(function(P){if(P[0]+P[1]+P[2]===v.s)rest.forEach(function(x){if(!has(P,x))got[x]=1;});});});return Object.keys(got).map(String);});

/* ===== 問52 −3〜3の得点 ===== */
var C52=rg(-3,3).map(fm);
function s52(d,s){var o=[];prod([rg(-3,3),rg(-3,3),rg(-3,3),rg(-3,3)],function(x){if(uq(x).length<4||x[0]!==x[1]+d||x[2]+x[3]!==s)return;o.push(x);});return o;}
function v52(d,s,f){var o=[];for(var b=-3;b<=3;b++)for(var c=-3;c<=3;c++){var a=b+d,dd=s-c;if(a>3||dd<-3||dd>3)continue;var x=[a,b,c,dd];if(uq(x).length===4&&f(x))o.push(dd);}return uq(o).map(fm);}
function q52(d,s){return 'A、B、C、Dの4人がゲームをしたところ、各自の得点は−3、−2、−1、0、1、2、3のいずれかになった。これについて、次のことがわかっている。<br>'+cd(['同じ得点の人はいない','AはBより'+d+'点高い','CとDの得点をたすと'+fm(s)+'点になる'])+'<br><br>';}
function f52(r){return T(['','A','B','C','D'],r.map(function(x,i){return [String(i+1)].concat(x.map(fm));}));}
var P52a=lazy(function(){var o=[];rg(1,4).forEach(function(d){rg(-3,3).forEach(function(s){rg(-3,3).forEach(function(k){var a=uq(s52(d,s).filter(function(x){return has(x,k);}).map(function(x){return x[3];}));if(a.length>=2&&a.length<7)o.push([d,s,k]);});});});return o;});
var P52b=lazy(function(){var o=[];rg(1,4).forEach(function(d){rg(-3,3).forEach(function(s){[1,2].forEach(function(e){var a=uq(s52(d,s).filter(function(x){return x[2]===x[1]+e;}).map(function(x){return x[3];}));if(a.length>=2&&a.length<7)o.push([d,s,e]);});});});return o;});
tp(6,'52-1','52-1',function(R){var p=R.pick(P52a().concat([[3,-1,3],[3,-1,3]])),r=s52(p[0],p[1]).filter(function(x){return has(x,p[2]);}),a=uq(r.map(function(x){return x[3];}));
  return O('52-1',q52(p[0],p[1])+fm(p[2])+'点の人がいるとき、Dが取り得る得点はどれか。当てはまるものをすべて選びなさい。',C52,a.map(fm),
   {inw:'A ＝ B ＋ '+p[0]+'（AとBは'+p[0]+'点差のペア）<br>C ＋ D ＝ '+fm(p[1])+'<br>'+fm(p[2])+'点の人がいる',fig:f52(r),calc:'4人の得点を書き出すと'+r.length+'通り。Dは '+a.map(fm).join('、')+'点',v:{d:p[0],s:p[1],k:p[2]}});},
  function(v){return v52(v.d,v.s,function(x){return has(x,v.k);});});
tp(6,'52-2','52-2',function(R){var p=R.pick(P52b().concat([[3,-1,1],[3,-1,1]])),r=s52(p[0],p[1]).filter(function(x){return x[2]===x[1]+p[2];}),a=uq(r.map(function(x){return x[3];}));
  return O('52-2',q52(p[0],p[1])+'CがBより'+p[2]+'点高いとき、Dが取り得る得点はどれか。当てはまるものをすべて選びなさい。',C52,a.map(fm),
   {inw:'A ＝ B ＋ '+p[0]+'、C ＝ B ＋ '+p[2]+'、D ＝ '+fm(p[1])+' − C<br>Bを決めると全員が決まる',fig:f52(r),calc:'Bを−3から順に入れて、全員が−3〜3で重ならない場合は'+r.length+'通り。Dは '+a.map(fm).join('、')+'点',v:{d:p[0],s:p[1],e:p[2]}});},
  function(v){return v52(v.d,v.s,function(x){return x[2]===x[1]+v.e;});});
/* ===== 問53 5冊の本の並び ===== */
var PR53=[[300,400,500],[200,300,400],[300,500,700],[100,300,500],[400,500,600],[200,400,600]];
var BK5=['A','B','C','D','E'],POS5=rg(1,5).map(function(x){return x+'番目';});
function pr53(pr){return [pr[0],pr[1],pr[1],pr[2],pr[2]];}
var PM5=lazy(function(){return perms([0,1,2,3,4]);});/* 並び（左から何の本か） */
function q53(pr){return 'A、B、C、D、Eの5冊の本を本棚に横一列に並べた。Aの本は'+pr[0]+'円、BとCの本は各'+pr[1]+'円、DとEの本は各'+pr[2]+'円である。<br><br>';}
function f53(r,pr){var p=pr53(pr);return T(['','1','2','3','4','5'],r.map(function(x,i){return [String(i+1)].concat(x.map(function(b){return BK5[b]+'（'+p[b]+'）';}));}));}
function c53a(pr,s,d){return PM5().filter(function(x){var p=pr53(pr);return p[x[0]]+p[x[2]]===s&&Math.abs(p[x[2]]-p[x[4]])===d;});}
function c53b(pr,m4,m2){return PM5().filter(function(x){var p=pr53(pr);return p[x[0]]+p[x[1]]+p[x[3]]+p[x[4]]===m4*4&&p[x[1]]+p[x[3]]===m2*2;});}
tp(6,'53-1','53-1',function(R){var orig=R.int(1,5)===1,pr=orig?PR53[0]:R.pick(PR53),p=pr53(pr),x=orig?[1,0,3,2,4]:R.pick(PM5()),s=p[x[0]]+p[x[2]],d=Math.abs(p[x[2]]-p[x[4]]);
  if(orig){s=800;d=200;}var r=c53a(pr,s,d),a=uq(r.map(function(y){return y.indexOf(1)+1;}));if(!r.length||a.length>=5)return null;
  return O('53-1',q53(pr)+'左から1番目と3番目の値段の和が'+s+'円、3番目と5番目の差が'+d+'円であった。このとき、Bの位置として考えられる位置は左から何番目か。当てはまる位置をすべて選びなさい。',POS5,a.map(function(y){return y+'番目';}),
   {inw:'値段は'+pr[0]+'円が1冊、'+pr[1]+'円が2冊、'+pr[2]+'円が2冊<br>1番目＋3番目 ＝ '+s+'、3番目と5番目の差 ＝ '+d,fig:f53(r,pr),
    calc:'和が'+s+'になる2冊の値段の組から3番目を決め、5番目は3番目と'+d+'円差。あり得る並びは'+r.length+'通り。Bは '+a.join('、')+'番目',v:{pr:pr,s:s,d:d}});},
  function(v){var o={};/* 値段の並びを先に決めてから本を当てはめる */prod([v.pr,v.pr,v.pr,v.pr,v.pr],function(pp){var cnt=[0,0,0];pp.forEach(function(y){cnt[v.pr.indexOf(y)]++;});if(cnt[0]!==1||cnt[1]!==2||cnt[2]!==2)return;
     if(pp[0]+pp[2]!==v.s||Math.abs(pp[2]-pp[4])!==v.d)return;pp.forEach(function(y,i){if(y===v.pr[1])o[i+1]=1;});});return Object.keys(o).map(function(k){return k+'番目';});});
tp(6,'53-2','53-2',function(R){var orig=R.int(1,5)===1,pr=orig?PR53[0]:R.pick(PR53),p=pr53(pr),x=R.pick(PM5()),t4=p[x[0]]+p[x[1]]+p[x[3]]+p[x[4]],t2=p[x[1]]+p[x[3]];
  if(orig){t4=1700;t2=800;}if(t4%4||t2%2)return null;var m4=t4/4,m2=t2/2,r=c53b(pr,m4,m2),a=uq(r.map(function(y){return y.indexOf(2)+1;}));if(!r.length||a.length>=5)return null;
  return O('53-2',q53(pr)+'左から3番目以外の本の平均が'+m4+'円、2番目と4番目の平均が'+m2+'円であった。このとき、Cの位置として考えられる位置は左から何番目か。当てはまる位置をすべて選びなさい。',POS5,a.map(function(y){return y+'番目';}),
   {inw:'平均 × 冊数 ＝ 合計<br>5冊の合計 ＝ '+(pr[0]+2*pr[1]+2*pr[2]),fig:f53(r,pr),
    calc:'3番目 ＝ '+(pr[0]+2*pr[1]+2*pr[2])+' − '+m4+' × 4 ＝ '+(pr[0]+2*pr[1]+2*pr[2]-t4)+'円<br>2番目＋4番目 ＝ '+m2+' × 2 ＝ '+t2+'円、1番目＋5番目 ＝ '+(t4-t2)+'円<br>あり得る並びは'+r.length+'通り。Cは '+a.join('、')+'番目',v:{pr:pr,m4:m4,m2:m2}});},
  function(v){var o={},tot=v.pr[0]+2*v.pr[1]+2*v.pr[2],p3=tot-v.m4*4;prod([v.pr,v.pr,v.pr,v.pr,v.pr],function(pp){var cnt=[0,0,0];pp.forEach(function(y){cnt[v.pr.indexOf(y)]++;});if(cnt[0]!==1||cnt[1]!==2||cnt[2]!==2)return;
     if(pp[2]!==p3||pp[1]+pp[3]!==v.m2*2)return;pp.forEach(function(y,i){if(y===v.pr[1])o[i+1]=1;});});return Object.keys(o).map(function(k){return k+'番目';});});

/* ===== 問54 本12冊 ===== */
function s54(N){var o=[];prod([rg(1,N),rg(1,N),rg(1,N),rg(1,N)],function(x){if(x[0]+x[1]+x[2]+x[3]===N&&x[0]===2*x[1]&&x[2]>x[3])o.push(x);});return o;}
function v54(N){var o=[];for(var q=1;3*q<N;q++)for(var s=1;s<N;s++){var r=N-3*q-s;if(r>s)o.push([2*q,q,r,s]);}return o;}
var C54a=['PはRと同じ冊数を借りた','PはSと同じ冊数を借りた','QはRと同じ冊数を借りた'];
function ok54a(x){return [x[0]===x[2],x[0]===x[3],x[1]===x[2]];}
function inf54(m){return [function(x){return has(x,m);},function(x){return x[1]>x[3];},function(x){return uq(x).length===4;}];}
function q54(N){return 'P、Q、R、Sの4人が、図書館で合わせて'+N+'冊の本を借りた。これについて、次のことがわかっている。ただし、1人1冊以上借りたものとする。<br>'+cd(['PはQの2倍の冊数の本を借りた','RはSより多く借りた'])+'<br><br>';}
function f54(r){return T(['','P','Q','R','S'],r.map(function(x,i){return [String(i+1)].concat(x.map(String));}));}
var P54a=lazy(function(){return rg(8,16).filter(function(N){var r=s54(N);return r.length&&[0,1,2].some(function(i){return r.some(function(x){return ok54a(x)[i];});});});});
var P54b=lazy(function(){var o=[];rg(8,16).forEach(function(N){rg(1,8).forEach(function(m){var mi=minInfo(s54(N),inf54(m),keyS);if(mi&&mi.length)o.push([N,m]);});});return o;});
tp(6,'54-1','54-1',function(R){var N=R.pick(P54a().concat([12,12])),r=s54(N),ok=[0,1,2].filter(function(i){return r.some(function(x){return ok54a(x)[i];});});
  return O('54-1',q54(N)+'必ずしも誤りとはいえない推論をすべて選びなさい。',C54a,ok.map(function(i){return C54a[i];}),
   {inw:'P ＝ 2 × Q、R ＞ S<br>Qを1から順に決め、残りをRとSに分ける<br>「必ずしも誤りとはいえない」＝ 1通りでも成り立てばよい',fig:f54(r),calc:'あり得る組は'+r.length+'通り。表の中に1つでも当てはまる行がある推論を選ぶ',v:{N:N}});},
  function(v){var r=v54(v.N);return C54a.filter(function(t,i){return r.some(function(x){return ok54a(x)[i];});});});
tp(6,'54-2','54-2',function(R){var p=R.pick(P54b().concat([[12,5],[12,5]])),N=p[0],m=p[1],r=s54(N),mi=minInfo(r,inf54(m),keyS),c=[m+'冊借りた人がいた','QはSより多く借りた','同じ冊数を借りた人はいなかった'];
  var fin=r.filter(function(x){return mi.every(function(i){return inf54(m)[i](x);});});
  return O('54-2',q54(N)+'最も少ない情報で4人が借りた冊数をすべて確定するには、Ⅰ、Ⅱのほか、次のうちどれが加わればよいか。必要な情報をすべて選びなさい。',c,mi.map(function(i){return c[i];}),
   {inw:'Ⅰ、Ⅱだけのときの組を書き出し、情報を足して1通りに絞る',fig:T(['','P','Q','R','S','A','B','C'],r.map(function(x,i){var f=inf54(m);return [String(i+1)].concat(x.map(String)).concat([f[0](x)?'○':'×',f[1](x)?'○':'×',f[2](x)?'○':'×']);})),
    calc:'Ⅰ、Ⅱだけでは'+r.length+'通り。'+mi.map(function(i){return 'ABC'[i];}).join('と')+'の両方が○の行は P '+fin[0][0]+'、Q '+fin[0][1]+'、R '+fin[0][2]+'、S '+fin[0][3]+' だけ',v:{N:N,m:m}});},
  function(v,o){var r=v54(v.N),f=inf54(v.m),best=null;[[0],[1],[2],[0,1],[0,2],[1,2],[0,1,2]].forEach(function(cb){if(best&&cb.length>best.length)return;var s=r.filter(function(x){return cb.every(function(i){return f[i](x);});});if(s.length===1&&!best)best=cb;});
    return best.map(function(i){return o.c[i];});});

/* ===== 問55 4世帯の子供 ===== */
function s55(p){var o=[];for(var q=1;q<p;q++)for(var r=1;r<p;r++)for(var s=1;s<Math.min(q,r);s++)if((p+q+r+s)%2===0)o.push([p,q,r,s]);return o;}
function q55(p){return '子供がいる4世帯、P、Q、R、Sについて、次のことがわかっている。<br>'+cd(['Pの子供の数は'+p+'人で、他の3つの世帯よりも多い','Sの子供の数は他の3つの世帯よりも少ない','4世帯の子供を合わせると、男子と女子の数は同数である'])+'<br><br>';}
tp(6,'55-1','55-1',function(R){var p=R.pick([4,5,4]),r=s55(p),a=uq(r.map(function(x){return x[0]+x[1]+x[2]+x[3];})),c=rg(2*p,2*p+7).map(function(x){return x+'人';});
  return O('55-1',q55(p)+'4世帯の子供を合わせた人数として考えられるのは何人か。当てはまるものをすべて選びなさい。',c,a.map(function(x){return x+'人';}),
   {inw:'P ＝ '+p+'、QとRは'+(p-1)+'人以下、SはQ・Rより少ない<br>男子と女子が同数 → 合計は偶数',fig:T(['','P','Q','R','S','合計'],r.map(function(x,i){return [String(i+1)].concat(x.map(String)).concat([String(x[0]+x[1]+x[2]+x[3])]);})),
    calc:'Q、R、Sを書き出し、合計が偶数になるものだけ残すと '+a.join('、')+'人',v:{p:p}});},
  function(v){var o={};prod([rg(1,9),rg(1,9),rg(1,9)],function(x){var q=x[0],r=x[1],s=x[2];if(q<v.p&&r<v.p&&s<q&&s<r&&(v.p+q+r+s)%2===0)o[v.p+q+r+s]=1;});return Object.keys(o).map(function(k){return k+'人';});});
function g55(p){var o={};s55(p).forEach(function(x){var h=(x[0]+x[1]+x[2]+x[3])/2;/* Qは全員女子。P・R・Sの男子の数 */for(var bp=0;bp<=x[0];bp++)for(var br=0;br<=x[2];br++){var bs=h-bp-br;if(bs>=0&&bs<=x[3])o[x[0]-bp]=1;}});return Object.keys(o).map(Number);}
tp(6,'55-2','55-2',function(R){var p=R.pick([4,5,4]),a=g55(p),r=s55(p);
  return O('55-2',q55(p)+'Qの子供がすべて女子であるとき、Pの子供のうち女子の人数として考えられるのは何人か。当てはまるものをすべて選びなさい。',rg(0,7).map(function(x){return x+'人';}),a.map(function(x){return x+'人';}),
   {inw:'男子 ＝ 女子 ＝ 合計 ÷ 2<br>Qは全員女子なので、男子はP・R・Sだけ',fig:T(['','P','Q','R','S','男子の数'],r.map(function(x,i){return [String(i+1)].concat(x.map(String)).concat([String((x[0]+x[1]+x[2]+x[3])/2)]);})),
    calc:'男子（合計の半分）をP・R・Sで分ける。Pの男子が多いほどPの女子は少ない<br>Pの女子は '+a.join('、')+'人',v:{p:p}});},
  function(v){var o={};/* 4世帯の男子・女子を総当たり */prod([rg(0,v.p),rg(0,v.p),rg(0,v.p),rg(0,v.p),rg(0,v.p),rg(0,v.p)],function(x){var P=v.p,bP=x[0],q=x[1],r=x[2]+x[3],bR=x[2],s=x[4]+x[5],bS=x[4];
     if(bP>P||q<1||r<1||s<1||q>=P||r>=P||s>=q||s>=r)return;if(bP+bR+bS!==(P-bP)+q+x[3]+x[5])return;o[P-bP]=1;});return Object.keys(o).map(function(k){return k+'人';});});

/* ===== 問56 食品店の重なり ===== */
var P56=lazy(function(){var o=[];[20,25,30].forEach(function(N){rg(5,N-1).forEach(function(a){rg(a,N-1).forEach(function(b){rg(b,N-1).forEach(function(c){var x=a+b-N,y=a+b+c-2*N;if(x>=1&&x<=7&&y>=0&&y<=7&&(a%5===0||b%5===0))o.push([N,a,b,c]);});});});});return o;});
var C56=rg(0,7).map(function(x){return x+'店';});
function q56(p){return 'ある町には'+p[0]+'店の食品店がある。そのうち'+p[1]+'店では果物、'+p[2]+'店ではアイス、'+p[3]+'店では酒を売っている。<br><br>';}
tp(6,'56-1','56-1',function(R){var p=R.pick(P56().concat([[20,10,15,16]])),x=p[1]+p[2]-p[0];
  return O('56-1',q56(p)+p[0]+'店のうち、果物とアイスの両方を売っている店は少なくとも何店あるか。',C56,x+'店',
   {inw:'両方を最も少なくする → 果物だけ・アイスだけの店で'+p[0]+'店をうめる',fig:T(['','果物','アイス','両方'],[['店数',String(p[1]),String(p[2]),'!?']]),calc:p[1]+' ＋ '+p[2]+' − '+p[0]+' ＝ '+x+'店',v:{p:p}});},
  function(v){var p=v.p;for(var x=0;x<=Math.min(p[1],p[2]);x++)if(p[1]+p[2]-x<=p[0])return x+'店';});
tp(6,'56-2','56-2',function(R){var p=R.pick(P56().concat([[20,10,15,16]])),y=p[1]+p[2]+p[3]-2*p[0],n=[p[0]-p[1],p[0]-p[2],p[0]-p[3]];
  return O('56-2',q56(p)+p[0]+'店のうち、果物、アイス、酒のすべてを売っている店は少なくとも何店あるか。',C56,Math.max(0,y)+'店',
   {inw:'「売っていない店」で考える<br>果物なし '+n[0]+'店、アイスなし '+n[1]+'店、酒なし '+n[2]+'店',fig:T(['','果物なし','アイスなし','酒なし','計'],[['店数',String(n[0]),String(n[1]),String(n[2]),String(n[0]+n[1]+n[2])]]),
    calc:'「なし」が重ならないとき、どれか1つでもない店は最も多くて '+(n[0]+n[1]+n[2])+'店<br>すべてを売る店 ＝ '+p[0]+' − '+(n[0]+n[1]+n[2])+' ＝ '+Math.max(0,y)+'店',v:{p:p}});},
  function(v){var p=v.p,miss=(p[0]-p[1])+(p[0]-p[2])+(p[0]-p[3]);return Math.max(0,p[0]-miss)+'店';});

/* ===== 問57 ジェットコースター ===== */
var C57=['1両目','2両目','3両目','4両目','5両目','確実にわかる車両はない'];
function s57(lo,hi,N){var o=[];prod([rg(lo,hi),rg(lo,hi),rg(lo,hi),rg(lo,hi),rg(lo,hi)],function(x){if(x[2]>x[3]&&x[0]===x[4]&&x[0]+x[1]+x[2]+x[3]+x[4]===N)o.push(x);});return o;}
var P57=lazy(function(){var o=[];[[4,6],[3,5],[3,6],[4,7],[5,7]].forEach(function(h){rg(5*h[0],5*h[1]).forEach(function(N){if(s57(h[0],h[1],N).length>=2)o.push([h[0],h[1],N]);});});return o;});
function a57(r){var d=[0,1,2,3,4].filter(function(i){return uq(r.map(function(x){return x[i];})).length===1;});return d.length?d.map(function(i){return C57[i];}):[C57[5]];}
function m57(id,bk,orig){tp(6,id,bk,function(R){var p=R.pick(P57().concat([orig,orig])),r=s57(p[0],p[1],p[2]),a=a57(r);
  return O(bk,'あるジェットコースターは1両目から5両目までの全5両ある。このジェットコースターの乗車人数について、次のことがわかっている。<br>'+cd(['1両に'+p[1]+'人まで乗車できる。また、1両につき最低'+p[0]+'人は乗車する','3両目の乗車人数は4両目の乗車人数より多い','1両目と5両目の乗車人数は同じである'])+'<br><br>'+p[2]+'人で乗るとき、乗車人数が確実にわかるのは何両目か。当てはまるものをすべて選びなさい。',C57,a,
   {inw:'1両目 ＝ 5両目、3両目 ＞ 4両目<br>各両 '+p[0]+'〜'+p[1]+'人、合計 '+p[2]+'人',fig:T(['','1','2','3','4','5'],r.map(function(x,i){return [String(i+1)].concat(x.map(String));})),
    calc:'あり得る乗り方は'+r.length+'通り（表は8通りまで）。どの行でも同じ人数の車両は '+(a[0]===C57[5]?'ない':a.join('、')),v:{lo:p[0],hi:p[1],N:p[2]}});},
  function(v){var seen=[{},{},{},{},{}];for(var a=v.lo;a<=v.hi;a++)for(var b=v.lo;b<=v.hi;b++)for(var d=v.lo;d<=v.hi;d++){var c=v.N-2*a-b-d;if(c>d&&c>=v.lo&&c<=v.hi)[a,b,c,d,a].forEach(function(y,i){seen[i][y]=1;});}
    var r=[0,1,2,3,4].filter(function(i){return Object.keys(seen[i]).length===1;});return r.length?r.map(function(i){return C57[i];}):[C57[5]];});}
m57('57-1','57-1',[4,6,23]);m57('57-2','57-2',[4,6,28]);
/* ===== 問58 契約数 ===== */
var C58=rg(1,8).map(function(x){return x+'件';});
function hv58(x,i){return x.some(function(y,j){return j!==i&&y===2*x[i];})&&x.some(function(y,j){return j!==i&&2*y===x[i];});}
function s58(N){var o=[];prod([rg(1,N),rg(1,N),rg(1,N),rg(1,N)],function(x){if(x[0]+x[1]+x[2]+x[3]===N&&hv58(x,1)&&hv58(x,3))o.push(x);});return o;}
function v58(N){var o=[];/* Qを基準に 2Q と Q/2 の人を置く */for(var q=2;q<=N;q+=2)for(var s=2;s<=N;s+=2){var p=N-q-s;for(var r=1;r<p;r++){var x=[p-r,q,r,s];if(x[0]<1)continue;
  var okQ=x.some(function(y,j){return j!==1&&y===2*q;})&&x.some(function(y,j){return j!==1&&y*2===q;}),okS=x.some(function(y,j){return j!==3&&y===2*s;})&&x.some(function(y,j){return j!==3&&y*2===s;});if(okQ&&okS)o.push(x);}}return o;}
function q58(N){return 'ある会社の営業部では、P、Q、R、Sの4人で'+N+'件の契約を取ってきた。4人の契約数について、次のことがわかっている。<br>'+cd(['Qの2倍の人と1/2の人がいる','Sの2倍の人と1/2の人がいる','全員が1件以上の契約を取ってきた'])+'<br><br>';}
function f58(r){return T(['','P','Q','R','S'],r.map(function(x,i){return [String(i+1)].concat(x.map(String));}));}
var P58a=lazy(function(){return rg(9,24).filter(function(N){var a=uq(s58(N).map(function(x){return x[0];}));return a.length&&a.every(function(y){return y<=8;});});});
var P58b=lazy(function(){return rg(9,24).filter(function(N){var a=uq(s58(N).filter(function(x){return x[2]===2*x[1];}).map(function(x){return x[3];}));return a.length&&a.length<8&&a.every(function(y){return y<=8;});});});
tp(6,'58-1','58-1',function(R){var N=R.pick(P58a().concat([15,15])),r=s58(N),a=uq(r.map(function(x){return x[0];}));
  return O('58-1',q58(N)+'Pの契約数は何件か。可能性のあるものをすべて選びなさい。',C58,a.map(function(x){return x+'件';}),
   {inw:'Qの2倍・1/2の人がいる → Qは偶数で、Q/2・Q・2Q の3人がいる<br>Sも同じ → 4人は「Q/2・Q・2Q」と「S/2・S・2S」が重なる形',fig:f58(r),calc:'1・2・4・8 のように2倍ずつ並ぶ形しかない。合計'+N+'になる組は'+r.length+'通りで、Pは '+a.join('、')+'件',v:{N:N}});},
  function(v){return uq(v58(v.N).map(function(x){return x[0];})).map(function(x){return x+'件';});});
tp(6,'58-2','58-2',function(R){var N=R.pick(P58b().concat([15,15])),r=s58(N).filter(function(x){return x[2]===2*x[1];}),a=uq(r.map(function(x){return x[3];}));
  return O('58-2',q58(N)+'Rの契約数がQの2倍であるとき、Sの契約数として考えられるのは何件か。当てはまるものをすべて選びなさい。',C58,a.map(function(x){return x+'件';}),
   {inw:'R ＝ 2 × Q を加える',fig:f58(r),calc:'条件に合う組は'+r.length+'通りで、Sは '+a.join('、')+'件',v:{N:N}});},
  function(v){return uq(v58(v.N).filter(function(x){return x[2]===2*x[1];}).map(function(x){return x[3];})).map(function(x){return x+'件';});});

/* ===== 問59 3回のゲーム ===== */
var PM4=lazy(function(){return perms([0,1,2,3]);});/* 1位から順に、だれか（0P 1Q 2R 3S） */
function pt59(rk,p1,p2){var s=[0,0,0,0];s[rk[0]]+=p1;s[rk[1]]+=p2;return s;}
function s59(p1,p2){var o=[];PM4().forEach(function(a){if(a[0]!==0)return;PM4().forEach(function(b){var x=pt59(a,p1,p2),y=pt59(b,p1,p2),t=x.map(function(v,i){return v+y[i];});
  if(t.every(function(v,i){return i===2||v<t[2];}))o.push([a,b]);});});return o;}
var C59a=['1回目では、Q、Sのどちらかが2位だった','1回目では、Rが3位だった','2回目では、Q、Sのどちらかが2位だった'];
function tr59(g){var a=g[0],b=g[1];return [a[1]===1||a[1]===3,a[2]===2,b[1]===1||b[1]===3];}
var NM4=['P','Q','R','S'];
function q59(p1,p2){return 'P、Q、R、Sの4人が、1位が'+p1+'点、2位が'+p2+'点、3位と4位が0点のゲームを計3回行って合計点を競い合った。これについて、次のことがわかっている。なお、各回において同順位はなかったものとする（合計点においては同順位の場合もある）。<br>'+cd(['1回目は、Pが1位だった','2回目が終わった時点の合計点は、Rが単独で1位だった'])+'<br><br>';}
function f59(r){var seen={},rows=[];r.forEach(function(g){var k=NM4[g[0][0]]+'・'+NM4[g[0][1]]+'|'+NM4[g[1][0]]+'・'+NM4[g[1][1]];if(seen[k])return;seen[k]=1;var s=k.split('|');rows.push([String(rows.length+1),s[0],s[1]]);});return T(['','1回目 1位・2位','2回目 1位・2位'],rows);}
var P59=[[2,1],[3,1],[3,2],[4,1],[5,2],[4,3]];
tp(6,'59-1','59-1',function(R){var p=R.pick(P59.concat([[2,1]])),r=s59(p[0],p[1]),t=[0,1,2].filter(function(i){return r.every(function(g){return tr59(g)[i];});});if(t.length!==1)return null;
  return O('59-1',q59(p[0],p[1])+'必ず正しいといえるものを1つ選びなさい。',C59a,C59a[t[0]],
   {inw:'2回目までの合計でRが単独1位 → RはPより多い<br>Pは1回目で'+p[0]+'点',fig:f59(r),calc:'1・2位の組を書き出すと'+r.length+'通り。すべての行で成り立つのは「'+C59a[t[0]]+'」',v:{p1:p[0],p2:p[1]}});},
  function(v,o){var ok=[true,true,true];/* 1回目・2回目の点数の配り方を総当たり */PM4().forEach(function(a){PM4().forEach(function(b){if(a[0]!==0)return;var t=[0,0,0,0];[a,b].forEach(function(k){t[k[0]]+=v.p1;t[k[1]]+=v.p2;});
     if(!(t[2]>t[0]&&t[2]>t[1]&&t[2]>t[3]))return;var tt=tr59([a,b]);tt.forEach(function(x,i){if(!x)ok[i]=false;});});});return o.c[ok.indexOf(true)];});
function a59b(p1,p2){var o={};s59(p1,p2).forEach(function(g){PM4().forEach(function(c){if(c[1]!==1)return;var t=pt59(g[0],p1,p2)[2]+pt59(g[1],p1,p2)[2]+pt59(c,p1,p2)[2];o[t]=1;});});return Object.keys(o).map(Number).sort(function(a,b){return a-b;});}
tp(6,'59-2','59-2',function(R){var p=R.pick(P59.concat([[2,1],[2,1]])),a=a59b(p[0],p[1]);if(!a.length)return null;var lo=Math.max(0,a[a.length-1]-5),c=rg(lo,lo+5).map(function(x){return x+'点';});
  if(a[0]<lo)return null;var r=s59(p[0],p[1]),r2=uq(r.map(function(g){return pt59(g[0],p[0],p[1])[2]+pt59(g[1],p[0],p[1])[2];}));
  return O('59-2',q59(p[0],p[1])+'3回目はQが2位だった。3回目が終わった時点で、Rの合計点はいくつか。当てはまるものをすべて選びなさい。',c,a.map(function(x){return x+'点';}),
   {inw:'2回目までのRの合計を先に決める<br>3回目はQが2位 → Rは1位（'+p[0]+'点）か3・4位（0点）',fig:f59(r),
    calc:'2回目までのRは '+r2.join('、')+'点<br>3回目に '+p[0]+'点 か 0点 を足して '+a.join('、')+'点',v:{p1:p[0],p2:p[1]}});},
  function(v){var o={};PM4().forEach(function(a){if(a[0]!==0)return;PM4().forEach(function(b){var t=[0,0,0,0];[a,b].forEach(function(k){t[k[0]]+=v.p1;t[k[1]]+=v.p2;});if(!(t[2]>t[0]&&t[2]>t[1]&&t[2]>t[3]))return;
     [v.p1,0].forEach(function(add){o[t[2]+add]=1;});});});return Object.keys(o).map(function(k){return k+'点';});});

/* ===== 問60 ツアーの年代 ===== */
var C60=rg(2,9).map(function(x){return x+'人';}),AG=['20代','30代','40代','50代','60代'];
function s60(N){var o=[];for(var f=1;f<=4;f++){var fo=2*f;if(fo<2||fo>9||f<2)continue;for(var tw=fo+1;tw<=9;tw++)for(var si=tw+1;si<=9;si++){var th=N-tw-fo-f-si;if(th>=2&&th<=9)o.push([tw,th,fo,f,si]);}}return o;}
function v60(N){var o=[];prod([rg(1,15),rg(1,15),rg(1,15),rg(1,15),rg(1,15)],function(x){if(x[0]+x[1]+x[2]+x[3]+x[4]!==N)return;if(x.some(function(y){return y===1||y>=10;}))return;if(x[2]<x[0]&&x[0]<x[4]&&x[2]===2*x[3])o.push(x);});return o;}
function q60(N){return '旅行ツアーの参加者が'+N+'人いた。参加者の年代と人数について、次のことがわかっている。<br>'+cd(['20代、30代、40代、50代、60代という5つの年代の参加者がいた','1人の年代および10人以上の年代はなかった','40代より20代が多く、20代より60代が多かった','40代の人数は、50代の人数の2倍だった'])+'<br><br>';}
function f60(r){return T(['','20代','30代','40代','50代','60代'],r.map(function(x,i){return [String(i+1)].concat(x.map(String));}));}
var P60a=lazy(function(){var o=[];rg(24,36).forEach(function(N){rg(5,9).forEach(function(k){var a=uq(s60(N).filter(function(x){return x[4]===k;}).map(function(x){return x[2];}));if(a.length>=2)o.push([N,k]);});});return o;});
var P60b=lazy(function(){var o=[];rg(24,36).forEach(function(N){rg(5,8).forEach(function(k){var a=uq(s60(N).filter(function(x){return x[0]>=k;}).map(function(x){return x[1];}));if(a.length>=2&&a.length<8)o.push([N,k]);});});return o;});
tp(6,'60-1','60-1',function(R){var p=R.pick(P60a().concat([[30,9],[30,9]])),r=s60(p[0]).filter(function(x){return x[4]===p[1];}),a=uq(r.map(function(x){return x[2];}));
  return O('60-1',q60(p[0])+'60代が'+p[1]+'人の場合、40代は何人か。当てはまるものをすべて選びなさい。',C60,a.map(function(x){return x+'人';}),
   {inw:'どの年代も2〜9人<br>40代 ＝ 50代 × 2 → 40代は4、6、8人<br>40代 ＜ 20代 ＜ 60代 ＝ '+p[1],fig:f60(r),calc:'50代から決めて書き出すと'+r.length+'通り。40代は '+a.join('、')+'人',v:{N:p[0],k:p[1]}});},
  function(v){return uq(v60(v.N).filter(function(x){return x[4]===v.k;}).map(function(x){return x[2];})).map(function(x){return x+'人';});});
tp(6,'60-2','60-2',function(R){var p=R.pick(P60b().concat([[30,8],[30,8]])),r=s60(p[0]).filter(function(x){return x[0]>=p[1];}),a=uq(r.map(function(x){return x[1];}));
  return O('60-2',q60(p[0])+'20代が'+p[1]+'人以上の場合、30代は何人か。当てはまるものをすべて選びなさい。',C60,a.map(function(x){return x+'人';}),
   {inw:'20代 ＜ 60代 ≦ 9 → 20代は'+p[1]+'〜8人<br>40代 ＝ 50代 × 2',fig:f60(r),calc:'20代・60代・50代・40代を決め、30代 ＝ '+p[0]+' − 残りの合計。'+r.length+'通りで、30代は '+a.join('、')+'人',v:{N:p[0],k:p[1]}});},
  function(v){return uq(v60(v.N).filter(function(x){return x[0]>=v.k;}).map(function(x){return x[1];})).map(function(x){return x+'人';});});

/* ===== 問61 水槽の金魚 ===== */
function s61(N,d){var o=[];for(var r=3;r<=N;r++){var q=r+d;for(var s=3;s<=N;s++){var p=N-q-r-s;if(p>q&&p>r&&p>s&&uq([p,q,r,s]).length===4)o.push([p,q,r,s]);}}return o;}
function v61(N,d){var o=[];prod([rg(3,N),rg(3,N),rg(3,N)],function(x){var p=x[0],q=x[1],r=x[2],s=N-p-q-r;if(s<3||q!==r+d)return;if(Math.max(q,r,s)>=p||uq([p,q,r,s]).length<4)return;o.push([p,q,r,s]);});return o;}
function q61(N,d){return 'P、Q、R、Sという4つの水槽に、合計で'+N+'匹の金魚が入っている。これについて、次のことがわかっている。<br>'+cd(['同じ数の金魚が入っている水槽はない','どの水槽にも3匹以上入っている','Pの金魚の数が一番多い','QはRより'+d+'匹多い'])+'<br><br>';}
function f61(r){return T(['','P','Q','R','S'],r.map(function(x,i){return [String(i+1)].concat(x.map(String));}));}
var P61a=lazy(function(){var o=[];rg(20,30).forEach(function(N){[1,2,3].forEach(function(d){rg(6,15).forEach(function(p){var a=uq(s61(N,d).filter(function(x){return x[0]===p;}).map(function(x){return x[3];}));if(a.length>=2&&a.length<8&&a[a.length-1]<=10)o.push([N,d,p]);});});});return o;});
var P61b=lazy(function(){var o=[];rg(20,30).forEach(function(N){[1,2,3].forEach(function(d){var a=uq(s61(N,d).filter(function(x){return x[3]<x[1];}).map(function(x){return x[0];}));if(a.length>=2&&a[a.length-1]-a[0]<=7)o.push([N,d]);});});return o;});
tp(6,'61-1','61-1',function(R){var p=R.pick(P61a().concat([[25,2,10],[25,2,10]])),r=s61(p[0],p[1]).filter(function(x){return x[0]===p[2];}),a=uq(r.map(function(x){return x[3];}));
  return O('61-1',q61(p[0],p[1])+'Pが'+p[2]+'匹の場合、Sは何匹か。当てはまるものをすべて選びなさい。',rg(3,10).map(function(x){return x+'匹';}),a.map(function(x){return x+'匹';}),
   {inw:'Q、R、Sの合計 ＝ '+p[0]+' − '+p[2]+' ＝ '+(p[0]-p[2])+'<br>Q ＝ R ＋ '+p[1]+'、どれも3匹以上で'+p[2]+'匹より少ない',fig:f61(r),calc:'Rを3から順に決めると'+r.length+'通り。Sは '+a.join('、')+'匹',v:{N:p[0],d:p[1],p:p[2]}});},
  function(v){return uq(v61(v.N,v.d).filter(function(x){return x[0]===v.p;}).map(function(x){return x[3];})).map(function(x){return x+'匹';});});
tp(6,'61-2','61-2',function(R){var p=R.pick(P61b().concat([[25,2],[25,2]])),r=s61(p[0],p[1]).filter(function(x){return x[3]<x[1];}),a=uq(r.map(function(x){return x[0];})),lo=Math.min(8,a[0]);if(a[a.length-1]>lo+7)lo=a[a.length-1]-7;
  return O('61-2',q61(p[0],p[1])+'SよりQが多い場合、Pは何匹か。当てはまるものをすべて選びなさい。',rg(lo,lo+7).map(function(x){return x+'匹';}),a.map(function(x){return x+'匹';}),
   {inw:'Q ＝ R ＋ '+p[1]+'、S ＜ Q、Pが一番多い',fig:f61(r),calc:'R・Sを3から順に決め、P ＝ '+p[0]+' − Q − R − S。'+r.length+'通りで、Pは '+a.join('、')+'匹',v:{N:p[0],d:p[1]}});},
  function(v){return uq(v61(v.N,v.d).filter(function(x){return x[3]<x[1];}).map(function(x){return x[0];})).map(function(x){return x+'匹';});});
/* ===== 問62 チューリップ ===== */
function s62(N,m,d){var o=[];for(var r=m;r<=N;r++)for(var y=1;y<=N;y++){var w=N-r-y;if(w>=1&&Math.abs(y-w)===d)o.push([r,y,w]);}return o;}
function v62(N,m,d){var o=[];prod([rg(1,N),rg(1,N),rg(1,N)],function(x){if(x[0]+x[1]+x[2]===N&&x[0]>=m&&(x[1]-x[2]===d||x[2]-x[1]===d))o.push(x);});return o;}
function q62(N,m,d){return '赤、黄色、白のチューリップを各1本以上、全部で'+N+'本買った。これについて、次のことがわかっている。<br>'+cd(['赤を'+m+'本以上買った','黄色と白の差は'+d+'本だった'])+'<br><br>';}
function f62(r){return T(['','赤','黄色','白'],r.map(function(x,i){return [String(i+1)].concat(x.map(String));}));}
var P62a=lazy(function(){var o=[];rg(12,18).forEach(function(N){rg(3,7).forEach(function(m){rg(1,4).forEach(function(d){var a=uq(s62(N,m,d).map(function(x){return Math.abs(x[0]-x[1]);}));if(a.length>=2&&a.length<11&&a[a.length-1]<=10)o.push([N,m,d]);});});});return o;});
var P62b=lazy(function(){var o=[];rg(12,18).forEach(function(N){rg(3,7).forEach(function(m){rg(1,4).forEach(function(d){var a=uq(s62(N,m,d).filter(function(x){return x[0]>x[2]&&x[2]>x[1];}).map(function(x){return x[2];}));if(a.length&&a.length<10&&a[a.length-1]<=10)o.push([N,m,d]);});});});return o;});
tp(6,'62-1','62-1',function(R){var p=R.pick(P62a().concat([[15,5,3],[15,5,3]])),r=s62(p[0],p[1],p[2]),a=uq(r.map(function(x){return Math.abs(x[0]-x[1]);}));
  return O('62-1',q62(p[0],p[1],p[2])+'赤と黄色の本数の差は何本か。当てはまるものをすべて選びなさい。',rg(0,10).map(function(x){return x+'本';}),a.map(function(x){return x+'本';}),
   {inw:'黄色と白は'+p[2]+'本差 → 黄色＋白は、小さい方 × 2 ＋ '+p[2]+'<br>赤 ＝ '+p[0]+' −（黄色＋白）、赤は'+p[1]+'本以上',fig:f62(r),calc:'書き出すと'+r.length+'通り。赤と黄色の差は '+a.join('、')+'本',v:{N:p[0],m:p[1],d:p[2]}});},
  function(v){return uq(v62(v.N,v.m,v.d).map(function(x){return Math.abs(x[0]-x[1]);})).map(function(x){return x+'本';});});
tp(6,'62-2','62-2',function(R){var p=R.pick(P62b().concat([[15,5,3],[15,5,3]])),r=s62(p[0],p[1],p[2]).filter(function(x){return x[0]>x[2]&&x[2]>x[1];}),a=uq(r.map(function(x){return x[2];}));
  return O('62-2',q62(p[0],p[1],p[2])+'赤、白、黄色の順で本数が多い場合、白は何本か。当てはまるものをすべて選びなさい。',rg(1,10).map(function(x){return x+'本';}),a.map(function(x){return x+'本';}),
   {inw:'赤 ＞ 白 ＞ 黄色 → 白 ＝ 黄色 ＋ '+p[2],fig:f62(r),calc:'黄色を1から順に決めると'+r.length+'通り。白は '+a.join('、')+'本',v:{N:p[0],m:p[1],d:p[2]}});},
  function(v){return uq(v62(v.N,v.m,v.d).filter(function(x){return x[0]>x[2]&&x[2]>x[1];}).map(function(x){return x[2];})).map(function(x){return x+'本';});});

/* ===== 問63 水槽の水の出し入れ ===== */
var NM5=['P','Q','R','S','T'],PM5b=lazy(function(){return perms([0,1,2,3,4]);});
function ch63(a){return [-a[0],a[1],-a[2],a[3],a[4]];}
function s63(cap,st,a,f){var o=[],c=ch63(a);PM5b().forEach(function(od){if(!f(od))return;var w=st,lv=[];for(var i=0;i<5;i++){w+=c[od[i]];if(w<0||w>cap)return;lv.push(w);}o.push({od:od,lv:lv});});return o;}
function q63(cap,st,a){return cap+'Lの水が入る水槽に'+st+'Lの水が入っている。この水槽に各人が時間を空けて次の作業を行った。ただし、作業の順序は、次の通りに行われたものとは限らない。<br>・Pは'+a[0]+'Lの水を出した　・Qは'+a[1]+'Lの水を入れた　・Rは'+a[2]+'Lの水を出した<br>・Sは'+a[3]+'Lの水を入れた　・Tは'+a[4]+'Lの水を入れた<br><br>';}
var C63=rg(1,14).map(function(x){return x+'L';});
function f2(od){return od.order||od;}
function n63(od,lv){return od.map(function(i){return NM5[i];}).join('→');}
var A63=[[2,2,3,1,1],[1,2,3,1,2],[2,3,1,1,2],[3,2,2,1,1],[2,1,3,2,1]];
function f63b(od){return od[1]===1&&od.indexOf(3)>od.indexOf(2);}
var P63a=lazy(function(){var o=[];A63.forEach(function(a){rg(6,12).forEach(function(st){[15,14,12].forEach(function(cap){var v=uq(s63(cap,st,a,function(){return true;}).map(function(x){return x.lv[3];}));if(v.length>=2&&v[0]>=1&&v[v.length-1]<=14)o.push([cap,st,a]);});});});return o;});
var P63b=lazy(function(){var o=[];A63.forEach(function(a){rg(6,12).forEach(function(st){[15,14,12].forEach(function(cap){var v=uq(s63(cap,st,a,f63b).map(function(x){return x.lv[2];}));if(v.length>=2&&v[0]>=1&&v[v.length-1]<=14)o.push([cap,st,a]);});});});return o;});
tp(6,'63-1','63-1',function(R){var p=R.pick(P63a().concat([[15,10,A63[0]],[15,10,A63[0]]])),r=s63(p[0],p[1],p[2],function(){return true;}),a=uq(r.map(function(x){return x.lv[3];})),tot=ch63(p[2]).reduce(function(s,x){return s+x;},0);
  return O('63-1',q63(p[0],p[1],p[2])+'4人目の作業が終了した時点で、水槽には何Lの水が残っているか。当てはまるものをすべて選びなさい。',C63,a.map(function(x){return x+'L';}),
   {inw:'5人全員の作業のあとは '+p[1]+(tot<0?' − '+(-tot):' ＋ '+tot)+' ＝ '+(p[1]+tot)+'L<br>4人目のあと ＝ 最後の水 − 5人目の作業',
    fig:T(['5人目','P','Q','R','S','T'],[['作業'].concat(ch63(p[2]).map(fm)),['4人目のあと'].concat(ch63(p[2]).map(function(x){return String(p[1]+tot-x);}))]),
    calc:'5人目がだれかで決まる。途中で0L未満・'+p[0]+'L超えにならない順番だけ残すと '+a.join('、')+'L',v:{cap:p[0],st:p[1],a:p[2]}});},
  function(v){var o={},c=ch63(v.a);/* 先に4人目までを選び、途中の水量を確かめる */prod([[0,1,2,3,4],[0,1,2,3,4],[0,1,2,3,4],[0,1,2,3,4]],function(x){if(uq(x).length<4)return;var last=[0,1,2,3,4].filter(function(i){return !has(x,i);})[0],w=v.st,ok=true;
     x.concat([last]).forEach(function(i){w+=c[i];if(w<0||w>v.cap)ok=false;});if(ok)o[w-c[last]]=1;});return Object.keys(o).map(function(k){return k+'L';});});
tp(6,'63-2','63-2',function(R){var p=R.pick(P63b().concat([[15,10,A63[0]],[15,10,A63[0]]])),r=s63(p[0],p[1],p[2],f63b),a=uq(r.map(function(x){return x.lv[2];}));
  return O('63-2',q63(p[0],p[1],p[2])+'Qが2人目で、Rより後にSが作業を行った。3人目の作業が終了した時点で、水槽には何Lの水が残っているか。当てはまるものをすべて選びなさい。',C63,a.map(function(x){return x+'L';}),
   {inw:'2人目はQ。SはRより後',fig:T(['順番','3人目のあと'],r.map(function(x){return [n63(x.od),x.lv[2]+'L'];})),calc:'順番を書き出して3人目のあとの水を計算すると '+a.join('、')+'L',v:{cap:p[0],st:p[1],a:p[2]}});},
  function(v){var o={},c=ch63(v.a);prod([[0,2,3,4],[0,2,3,4],[0,2,3,4],[0,2,3,4]],function(x){if(uq(x).length<4)return;var od=[x[0],1,x[1],x[2],x[3]];if(od.indexOf(3)<od.indexOf(2))return;var w=v.st,ok=true,l3=0;
     od.forEach(function(i,k){w+=c[i];if(w<0||w>v.cap)ok=false;if(k===2)l3=w;});if(ok)o[l3]=1;});return Object.keys(o).map(function(k){return k+'L';});});

/* ===== 問64 チョコレート ===== */
function s64(N,d){var o=[];for(var q=2;q<=N;q++)for(var s=2;s<=N;s++){var e=2*q+d+3*s;if(e<N)o.push([q+d,q,2*s,s,N-e]);}return o;}
function q64(N,d){return 'P、Q、R、Sの4人が、'+N+'個あるチョコレートのうち何個かを食べた。これについて、次のことがわかっている。<br>'+cd([N+'個全部は食べ切らずに、残ったチョコレートがあった','各自が2個以上食べた','PはQより'+d+'個多く食べた','RはSの2倍の個数を食べた'])+'<br><br>';}
function f64(r){return T(['','P','Q','R','S','残り'],r.map(function(x,i){return [String(i+1)].concat(x.map(String));}));}
var C64=rg(2,7).map(function(x){return x+'個';});
var P64a=lazy(function(){var o=[];rg(16,24).forEach(function(N){[1,2,3,4].forEach(function(d){rg(1,3).forEach(function(k){var a=uq(s64(N,d).filter(function(x){return x[4]===k;}).map(function(x){return x[1];}));if(a.length>=2&&a.every(function(y){return y<=7;}))o.push([N,d,k]);});});});return o;});
var P64b=lazy(function(){var o=[];rg(16,24).forEach(function(N){[1,2,3,4].forEach(function(d){rg(4,8).forEach(function(k){var a=uq(s64(N,d).filter(function(x){return has(x.slice(0,4),k);}).map(function(x){return x[4];}));if(a.length>=2&&a.length<6&&a[0]>=2&&a[a.length-1]<=7)o.push([N,d,k]);});});});return o;});
tp(6,'64-1','64-1',function(R){var p=R.pick(P64a().concat([[20,3,1],[20,3,1]])),r=s64(p[0],p[1]).filter(function(x){return x[4]===p[2];}),a=uq(r.map(function(x){return x[1];}));
  return O('64-1',q64(p[0],p[1])+'チョコレートが'+p[2]+'個だけ残っていた場合、Qは何個食べたか。当てはまるものをすべて選びなさい。',C64,a.map(function(x){return x+'個';}),
   {inw:'食べた数 ＝ '+p[0]+' − '+p[2]+' ＝ '+(p[0]-p[2])+'<br>P＋Q ＝ 2 × Q ＋ '+p[1]+'、R＋S ＝ 3 × S',fig:f64(r),calc:'2 × Q ＋ 3 × S ＝ '+(p[0]-p[2]-p[1])+'（Q、Sは2以上）を満たすのは'+r.length+'通り。Qは '+a.join('、')+'個',v:{N:p[0],d:p[1],k:p[2]}});},
  function(v){var o={};prod([rg(2,v.N),rg(2,v.N),rg(2,v.N),rg(2,v.N)],function(x){if(x[0]!==x[1]+v.d||x[2]!==2*x[3])return;if(v.N-(x[0]+x[1]+x[2]+x[3])===v.k)o[x[1]]=1;});return Object.keys(o).map(function(k){return k+'個';});});
tp(6,'64-2','64-2',function(R){var p=R.pick(P64b().concat([[20,3,6],[20,3,6]])),r=s64(p[0],p[1]).filter(function(x){return has(x.slice(0,4),p[2]);}),a=uq(r.map(function(x){return x[4];}));
  return O('64-2',q64(p[0],p[1])+p[2]+'個食べた人がいる場合、最後に残っていた個数は何個か。当てはまるものをすべて選びなさい。',C64,a.map(function(x){return x+'個';}),
   {inw:p[2]+'個食べたのが P、Q、R、S のだれかで場合分け<br>P ＝ Q ＋ '+p[1]+'、R ＝ S × 2',fig:f64(r),calc:'残りが1個以上になる組は'+r.length+'通り。残りは '+a.join('、')+'個',v:{N:p[0],d:p[1],k:p[2]}});},
  function(v){var o={};prod([rg(2,v.N),rg(2,v.N),rg(2,v.N),rg(2,v.N)],function(x){if(x[0]!==x[1]+v.d||x[2]!==2*x[3]||!has(x,v.k))return;var l=v.N-(x[0]+x[1]+x[2]+x[3]);if(l>=1)o[l]=1;});return Object.keys(o).map(function(k){return k+'個';});});

/* ===== 問65 マンション100世帯 ===== */
var P65=lazy(function(){var o=[];[100,120,200].forEach(function(H){rg(10,40,5).forEach(function(a){rg(a+5,H/2,5).forEach(function(e){[25,50,75].forEach(function(r){if(a*r%100)return;var s1=a*r/100;if(H-a-e-5<=20)return;o.push([H,a,e,r]);});});});});return o;});
function q65(p){return 'あるマンションに入居する'+p[0]+'世帯について、次の情報が得られた。<br>'+cd(['独居世帯は'+p[1]+'世帯である','高齢者（65歳以上）がいる世帯は'+p[2]+'世帯である'])+'<br><br>';}
function K65(p,cells){return T(['','高齢者あり','高齢者なし','計'],[['独居',cells[0],cells[1],String(p[1])],['2人以上',cells[2],cells[3],String(p[0]-p[1])],['計',String(p[2]),String(p[0]-p[2]),String(p[0])]]);}
var NG='AからFのいずれでもない';
tp(6,'65-1','65-1',function(R){var p=R.pick(P65().concat([[100,20,35,75]])),x=p[2]-p[1],n=NC(R,x,[-10,-5,5,10,15],'世帯',NG);if(!n)return null;
  return O('65-1',q65(p)+'2人以上の世帯のうち、高齢者がいる世帯は最低で何世帯あるか。',n.c,n.ans,{inw:'独居 × 高齢者のカルノー表<br>2人以上で高齢者ありを少なくする → 独居を全部「高齢者あり」にする',fig:K65(p,[String(p[1]),'0','!?','']),
    calc:p[2]+' − '+p[1]+' ＝ '+x+'世帯',v:{p:p}});},
  function(v,o){var p=v.p,m=1e9;for(var s=0;s<=p[1];s++){var t=p[2]-s;if(t>=0&&t<=p[0]-p[1])m=Math.min(m,t);}return VC(o,m,'世帯');});
tp(6,'65-2','65-2',function(R){var p=R.pick(P65().concat([[100,20,35,75]])),x=p[0]-p[1]-p[2],n=NC(R,x,[-20,-15,-10,-5,5],'世帯',NG);if(!n)return null;
  return O('65-2',q65(p)+'2人以上の世帯のうち、高齢者がいない世帯は最低で何世帯あるか。',n.c,n.ans,{inw:'2人以上で高齢者なしを少なくする → 高齢者ありを全部2人以上の世帯にする',fig:K65(p,['0',String(p[1]),String(p[2]),'!?']),
    calc:'2人以上 ＝ '+p[0]+' − '+p[1]+' ＝ '+(p[0]-p[1])+'<br>'+(p[0]-p[1])+' − '+p[2]+' ＝ '+x+'世帯',v:{p:p}});},
  function(v,o){var p=v.p,m=1e9;for(var s=0;s<=p[1];s++){var t=p[2]-s;if(t<0||t>p[0]-p[1])continue;m=Math.min(m,p[0]-p[1]-t);}return VC(o,m,'世帯');});
tp(6,'65-3','65-3',function(R){var p=R.pick(P65().concat([[100,20,35,75]])),s1=p[1]*p[3]/100,t=p[2]-s1,x=p[0]-p[1]-t,n=NC(R,x,[-20,-15,-10,-5,5],'世帯',NG);if(!n||t<0)return null;
  return O('65-3',q65(p)+'実際には、独居世帯の'+p[3]+'%が高齢者がいる世帯だということがわかった。2人以上の世帯のうち、高齢者がいない世帯は何世帯あるか。',n.c,n.ans,
   {inw:'独居で高齢者あり ＝ '+p[1]+' × '+p[3]/100+' ＝ '+s1,fig:K65(p,[String(s1),String(p[1]-s1),String(t),'!?']),
    calc:'独居で高齢者あり ＝ '+p[1]+' × '+p[3]/100+' ＝ '+s1+'<br>2人以上で高齢者あり ＝ '+p[2]+' − '+s1+' ＝ '+t+'<br>2人以上で高齢者なし ＝ '+(p[0]-p[1])+' − '+t+' ＝ '+x+'世帯',v:{p:p}});},
  function(v,o){var p=v.p,noOld=p[0]-p[2],singleNo=p[1]-p[1]*p[3]/100;return VC(o,noOld-singleNo,'世帯');});
/* ===== 問66 リンゴ50個 ===== */
var NM5P=['P','Q','R','S','T'];
function s66(N,m,e,f){var o=[];for(var q=1;q<=N;q++){var pr=3*m-q;if((pr-e)%2||pr-e<2)continue;var lo=(pr-e)/2,hi=lo+e;[[hi,lo],[lo,hi]].forEach(function(pq){[[q-f,q+f],[q+f,q-f]].forEach(function(st){var x=[pq[0],q,pq[1],st[0],st[1]];
  if(x.some(function(y){return y<1;})||uq(x).length<5||x[0]+x[1]+x[2]+x[3]+x[4]!==N)return;o.push(x);});});}return o;}
var P66=lazy(function(){var o=[];rg(40,60).forEach(function(N){rg(8,14).forEach(function(m){rg(5,13).forEach(function(e){rg(2,5).forEach(function(f){var r=s66(N,m,e,f);if(!r.length)return;
  uq([].concat.apply([],r)).forEach(function(k){var who=NM5P.filter(function(n,i){return r.some(function(x){return x[i]===k;});});if(who.length>=1&&who.length<5)o.push([N,m,e,f,k]);});});});});});return o;});
tp(6,'66','66',function(R){var p=R.pick(P66().concat([[50,12,11,3,10],[50,12,11,3,10]])),r=s66(p[0],p[1],p[2],p[3]),k=p[4],who=NM5P.filter(function(n,i){return r.some(function(x){return x[i]===k;});}),q=(p[0]-3*p[1])/2;
  return O('66',p[0]+'個のリンゴをP、Q、R、S、Tという5人に配った。配られた個数について、次のことがわかっている。<br>'+cd(['同じ個数の人はいない','P、Q、Rの平均は'+p[1]+'個である','PとRは'+p[2]+'個差である','QとS、QとTはそれぞれ'+p[3]+'個差である'])+'<br><br>'+k+'個配られた人はだれか。当てはまるものをすべて選びなさい。',NM5P,who,
   {inw:'平均 × 人数 ＝ 合計 → P＋Q＋R ＝ '+p[1]+' × 3 ＝ '+3*p[1]+'<br>SとTはQより'+p[3]+'個多いか少ない（同じ個数はない）→ S＋T ＝ 2 × Q',
    fig:T(['','P','Q','R','S','T'],r.map(function(x,i){return [String(i+1)].concat(x.map(String));})),
    calc:'S＋T ＝ '+p[0]+' − '+3*p[1]+' ＝ '+(p[0]-3*p[1])+' ＝ 2 × Q → Q ＝ '+q+'<br>S、Tは '+(q-p[3])+' と '+(q+p[3])+'、P＋R ＝ '+(3*p[1]-q)+'、差'+p[2]+' → '+(3*p[1]-q-p[2])/2+' と '+(3*p[1]-q+p[2])/2+'<br>'+k+'個は '+who.join('、'),v:{p:p}});},
  function(v){var p=v.p,who={};prod([rg(1,p[0]),rg(1,p[0]),rg(1,p[0])],function(x){var P=x[0],Q=x[1],S=x[2],Rr=3*p[1]-P-Q,Tt=p[0]-P-Q-Rr-S;var y=[P,Q,Rr,S,Tt];
     if(Rr<1||Tt<1||uq(y).length<5||Math.abs(P-Rr)!==p[2]||Math.abs(Q-S)!==p[3]||Math.abs(Q-Tt)!==p[3])return;y.forEach(function(z,i){if(z===p[4])who[NM5P[i]]=1;});});return Object.keys(who);});

/* ===== 問67 英語と数学 ===== */
var Q67='P、Q、R、Sの4人が英語と数学のテストを受けた。各テストは100点満点で、4人のうちで同点の者はいなかった。また、4人の英語の得点について、次のことがわかっている。<br>'+cd(['Sの得点はQよりも低い','Pの得点は、RとSの平均に等しい','Rの得点はQよりも低い'])+'<br><br>';
function e67(n){var o=[];prod([rg(0,n),rg(0,n),rg(0,n)],function(x){var q=x[0],r=x[1],s=x[2];if((r+s)%2)return;var p=(r+s)/2,y=[p,q,r,s];if(uq(y).length<4||!(s<q)||!(r<q))return;o.push(y);});return o;}
var C67a=['Sの得点はPよりも低い','Pの得点はQよりも低い','Rの得点はPよりも低い'];
function t67(y){return [y[3]<y[0],y[0]<y[1],y[2]<y[0]];}
tp(6,'67-1','67-1',function(R){var r=e67(12),ok=C67a.filter(function(t,i){return r.every(function(y){return t67(y)[i];});});
  return O('67-1',Q67+'英語の得点についての次の推論のうち、必ず正しいといえるものはどれか。当てはまるものをすべて選びなさい。',C67a,ok,
   {inw:'Ⅰ・Ⅲ → Qが最も高い<br>Ⅱ → PはRとSのちょうど真ん中',fig:T(['','高い','','','低い'],[['①','Q','R','P','S'],['②','Q','S','P','R']]),calc:'Pは常にRとSの間なので、Sより低いか、Rより低いかは決まらない<br>Qより低いことだけは必ず言える',v:{}});},
  function(v){var ok=[true,true,true];/* 順位だけで考える：RとSの間にPが入る並びを総当たり */perms([0,1,2,3]).forEach(function(o){var pos=[];o.forEach(function(who,i){pos[who]=i;});/* pos：小さいほど高い */
     if(!(pos[3]>pos[1]&&pos[2]>pos[1]))return;if(!((pos[2]<pos[0]&&pos[0]<pos[3])||(pos[3]<pos[0]&&pos[0]<pos[2])))return;[pos[3]>pos[0],pos[0]>pos[1],pos[2]>pos[0]].forEach(function(b,i){if(!b)ok[i]=false;});});
    return C67a.filter(function(t,i){return ok[i];});});
var A67b=lazy(function(){var rk={};e67(10).forEach(function(y){/* 数学の点（0〜10）を総当たり */prod([rg(0,10),rg(0,10),rg(0,10),rg(0,10)],function(m){if(uq(m).length<4)return;var srt=m.slice().sort(function(a,b){return a-b;});if(m[3]!==srt[0]||m[1]!==srt[1])return;
   var av=y.map(function(e,i){return e+m[i];});if(!(av[0]<av[1]&&av[0]<av[2]&&av[0]<av[3]))return;rk[m.filter(function(z){return z>m[0];}).length+1]=1;});});return Object.keys(rk);});
tp(6,'67-2','67-2',function(R){var a=A67b();if(a.length!==1)return null;
  return O('67-2',Q67+'Ⅰ〜Ⅲのほか、次のことがわかった。このとき、Pの数学の順位は何位か。<br>'+cd(['数学のテストはSの得点が最も低く、Qが2番目に低い','英語と数学の平均点は、Pが最も低い'],3),['1位','2位','3位','4位'],a[0]+'位',
   {inw:'英語：Qが1位、PはRとSの間<br>数学：Sが4位、Qが3位 → PとRが1位か2位',fig:T(['英語の並び','Pの数学','Ⅴ（Pが平均最下位）'],[['Q R P S','1位','英語・数学ともSより上 → ×'],['Q R P S','2位','英語・数学ともSより上 → ×'],['Q S P R','1位','英語・数学ともRより上 → ×'],['Q S P R','2位','英語はRより上、数学はRより下 → ○']]),
    calc:'英語でSより上だと、数学もSより上なので平均がSより高くなる → 英語は Q S P R<br>Rには英語で勝つので、数学でRに負ける → Pの数学は2位',v:{}});},
  function(v){/* 順位だけで調べる：Pの平均が最も低くなりうる並びの数学の順位 */var res={};[['Q','R','P','S'],['Q','S','P','R']].forEach(function(e){[['P','R'],['R','P']].forEach(function(mt){var m=mt.concat(['Q','S']);
     var beatS=e.indexOf('P')<e.indexOf('S')&&m.indexOf('P')<m.indexOf('S'),beatR=e.indexOf('P')<e.indexOf('R')&&m.indexOf('P')<m.indexOf('R'),beatQ=m.indexOf('P')<m.indexOf('Q')&&e.indexOf('P')<e.indexOf('Q');
     if(!beatS&&!beatR&&!beatQ)res[m.indexOf('P')+1]=1;});});return Object.keys(res).map(function(k){return k+'位';})[0];});

/* ===== 問68 英単語テスト ===== */
var Q68=function(d){return 'K、L、M、Nの4人が英単語のテストを受けた。このときの得点について、次のことがわかっている。<br>'+cd(['LとMの得点は同じ','KとLの平均は、MとNの平均より'+d+'点多い'])+'<br><br>';};
tp(6,'68-1','68-1',function(R){var d=R.pick([3,4,6,8,10,5,5]),c=['KとNの点差は'+2*d+'点である','MとNの得点は等しい','Lの得点はKの得点より低い'];
  return O('68-1',Q68(d)+'次の推論について、必ず正しいといえるものはどれか。当てはまるものをすべて選びなさい。',c,[c[0]],
   {inw:'平均 × 2 ＝ 合計<br>K＋L ＝ M＋N ＋ '+2*d+'、L ＝ M',fig:T(['','式'],[['Ⅱ','K＋L ＝ M＋N ＋ '+2*d],['Ⅰ（L＝M）を入れる','K ＝ N ＋ '+2*d]]),calc:'LとMを両辺から消すと K − N ＝ '+2*d+'<br>MとN、LとKの関係は決まらない',v:{d:d}});},
  function(v,o){var ok=[true,true,true];for(var l=0;l<=40;l++)for(var n=0;n<=40;n++){var k=n+2*v.d;/* (K+L)/2 ＝ (M+N)/2 ＋ d を確かめる */if((k+l)/2!==(l+n)/2+v.d)continue;[Math.abs(k-n)===2*v.d,l===n,l<k].forEach(function(b,i){if(!b)ok[i]=false;});}
    return o.c.filter(function(t,i){return ok[i];});});
function inf68(m){return [function(x){return x[2]===m;},function(x){return x[1]+x[2]<x[3]+x[0];},function(x){return 2*x[0]===x[2]+x[3];}];}
var S68=memo(function(k){var d=k[0],m=k[1],o=[];for(var l=0;l<=100;l++)for(var n=0;n<=100;n++){var kk=n+2*d;if(kk<=100)o.push([kk,l,l,n]);}return minInfo(o,inf68(m),keyS);});
var P68=lazy(function(){var o=[];[3,4,5,6].forEach(function(d){rg(20,60,5).forEach(function(m){var mi=S68([d,m]);if(mi&&mi.length)o.push([d,m]);});});return o;});
tp(6,'68-2','68-2',function(R){var p=R.pick(P68().concat([[5,30],[5,30]])),d=p[0],m=p[1],mi=S68(p),c=['Mは'+m+'点だった','LとMの得点の和はNとKの得点の和より低い','Kの得点はMとNの平均と同じ'],n=m-4*d;
  return O('68-2',Q68(d)+'最も少ない情報で4人の得点を確定するには、Ⅰ、Ⅱのほか、次のうちどれが加わればよいか。当てはまるものをすべて選びなさい。',c,mi.map(function(i){return c[i];}),
   {inw:'Ⅰ・Ⅱから L ＝ M、K ＝ N ＋ '+2*d+'<br>決まっていないのは「LとM」「N」の2つ → 式が2つ要る',fig:T(['情報','わかること'],[['A','M ＝ L ＝ '+m],['B','不等式なので値は決まらない'],['C','2 × K ＝ M ＋ N → M ＝ N ＋ '+4*d]]),
    calc:'AとCで M ＝ '+m+'、N ＝ '+m+' − '+4*d+' ＝ '+n+'、K ＝ '+n+' ＋ '+2*d+' ＝ '+(n+2*d)+'、L ＝ '+m,v:{d:d,m:m}});},
  function(v,o){var f=inf68(v.m),best=null;/* 0〜100点の組で、情報の組ごとに残る組の数を数える */[[0],[1],[2],[0,1],[0,2],[1,2],[0,1,2]].forEach(function(cb){if(best&&cb.length>best.length)return;var seen={},n=0;
     for(var m=0;m<=100;m++)for(var nn=0;nn<=100;nn++){var x=[nn+2*v.d,m,m,nn];if(x[0]>100)continue;if(cb.every(function(i){return f[i](x);})){seen[x.join()]=1;n++;}}if(n&&Object.keys(seen).length===1&&!best)best=cb;});
    return best.map(function(i){return o.c[i];});});

/* ===== 問69 5店舗の評価 ===== */
var C69=rg(1,5).map(function(x){return x+'点';});
function s69(t){var o=[];prod([rg(1,5),rg(1,5),rg(1,5),rg(1,5),rg(1,5)],function(x){if(x[0]+x[1]+x[2]+x[3]+x[4]!==t)return;var c=x.filter(function(y){return y===x[3];}).length;if(c!==3)return;var ot=x.filter(function(y){return y!==x[3];});if(ot[0]===ot[1])return;o.push(x);});return o;}
function q69(t){return 'P、Q、R、S、Tという5店舗に、1点から5点まで、5段階で点数がつけられた。点数について、次のことがわかっている。<br>'+cd(['Sを含めた3店舗が同じ点数で、他の2店舗は違う点数である','5店舗の平均点は'+(t/5).toFixed(1)+'点である'])+'<br><br>';}
function f69(r){return T(['','P','Q','R','S','T'],r.map(function(x,i){return [String(i+1)].concat(x.map(String));}));}
var P69a=lazy(function(){var o=[];rg(10,22).forEach(function(t){rg(2,4).forEach(function(b){var a=uq(s69(t).filter(function(x){return x[0]+x[1]+x[2]===3*b;}).map(function(x){return x[4];}));if(a.length>=1&&a.length<5)o.push([t,b]);});});return o;});
var P69b=lazy(function(){var o=[];rg(10,22).forEach(function(t){rg(1,5).forEach(function(v){var a=uq(s69(t).filter(function(x){return x.filter(function(y){return y===v;}).length===1;}).map(function(x){return x[3];}));if(a.length>=1&&a.length<5)o.push([t,v]);});});return o;});
tp(6,'69-1','69-1',function(R){var p=R.pick(P69a().concat([[18,4],[18,4]])),r=s69(p[0]).filter(function(x){return x[0]+x[1]+x[2]===3*p[1];}),a=uq(r.map(function(x){return x[4];}));
  return O('69-1',q69(p[0])+'P、Q、Rの平均が'+p[1]+'点のとき、Tの点数として考えられるのは何点か。当てはまるものをすべて選びなさい。',C69,a.map(function(x){return x+'点';}),
   {inw:'平均 × 店舗数 ＝ 合計<br>5店舗の合計 ＝ '+(p[0]/5).toFixed(1)+' × 5 ＝ '+p[0]+'、P＋Q＋R ＝ '+p[1]+' × 3 ＝ '+3*p[1]+'<br>S＋T ＝ '+(p[0]-3*p[1]),fig:f69(r),
    calc:'Sと同じ点の店が2つある形で書き出すと'+r.length+'通り。Tは '+a.join('、')+'点',v:{t:p[0],b:p[1]}});},
  function(v){var o={};/* 3店舗の同じ点 s と、残り2店舗の点を決めてから並べる */for(var s=1;s<=5;s++)for(var a=1;a<=5;a++)for(var b=a+1;b<=5;b++){if(a===s||b===s||3*s+a+b!==v.t)continue;
     perms([s,s,a,b]).forEach(function(x){/* x＝P、Q、R、T（そのうち2つがs） */var y=[x[0],x[1],x[2],s,x[3]];if(y[0]+y[1]+y[2]===3*v.b)o[y[4]]=1;});}return Object.keys(o).map(function(k){return k+'点';});});
tp(6,'69-2','69-2',function(R){var p=R.pick(P69b().concat([[18,1],[18,1]])),r=s69(p[0]).filter(function(x){return x.filter(function(y){return y===p[1];}).length===1;}),a=uq(r.map(function(x){return x[3];}));
  return O('69-2',q69(p[0])+'1店舗だけ'+p[1]+'点だったとき、Sの点数として考えられるのは何点か。当てはまるものをすべて選びなさい。',C69,a.map(function(x){return x+'点';}),
   {inw:'合計 ＝ '+(p[0]/5).toFixed(1)+' × 5 ＝ '+p[0]+'<br>同じ点の3店舗（S）× 3 ＋ 違う2店舗 ＝ '+p[0]+'。'+p[1]+'点は違う2店舗の1つ',fig:f69(r),
    calc:'Sの点を1から順に入れて、残りの1店舗が1〜5点で他と違う点になるか確かめる。Sは '+a.join('、')+'点',v:{t:p[0],v:p[1]}});},
  function(v){var o={};for(var s=1;s<=5;s++){if(s===v.v)continue;var other=v.t-3*s-v.v;if(other>=1&&other<=5&&other!==s&&other!==v.v)o[s]=1;}return Object.keys(o).map(function(k){return k+'点';});});
/* ===== 問70 ゴルフ練習場 ===== */
function d1(x){return x.toFixed(1);}
var P70=lazy(function(){var o=[];rg(36,44).forEach(function(a2){rg(a2*3/2+1,a2*3/2+6).forEach(function(b2){/* a2＝甲の平均×2、b2＝乙の平均×2（0.5円きざみ） */var a=a2/2,b=b2/2,R=3*b-2*a;if(R%1||4*a<=3*b)return;
  rg(2,5).forEach(function(dc){var c=b+dc;rg(-4,4).forEach(function(k){var P=Math.floor(a)-3+k,e=(P+R)/2;if(P<5||P>=2*a-3)return;o.push([a,b,c,e]);});});});});return o;});
function q70(p){return 'P、Q、Rの3カ所のゴルフ練習場で、1球あたりのボール使用料について、次のことがわかった。<br>甲　P、Qの2カ所の平日のボール使用料の平均は'+d1(p[0])+'円である<br>乙　P、Q、Rの3カ所の平日のボール使用料の平均は'+d1(p[1])+'円である<br>丙　P、Q、Rの3カ所とも平日より日曜日の方がボール使用料が高く、3カ所の日曜日のボール使用料の平均は'+d1(p[2])+'円である<br><br>';}
tp(6,'70-1','70-1',function(R){var p=R.pick(P70().concat([[19,20,24,19.5]])),a=p[0],b=p[1],c=p[2],Rr=3*b-2*a,D=3*(c-b),cc=['平日のRのボール使用料は3カ所のうちで最高である','平日より日曜日の方が3カ所ともそれぞれ'+(c-b)+'円高い','平日より日曜日の方が'+D+'円以上高い練習場はない'];
  return O('70-1',q70(p)+'1球あたりのボール使用料について、必ず正しいといえるものはどれか。当てはまるものをすべて選びなさい。',cc,[cc[2]],
   {inw:'平均 × カ所数 ＝ 合計<br>平日 P＋Q ＝ '+2*a+'、P＋Q＋R ＝ '+3*b+' → R ＝ '+Rr+'<br>日曜日の合計 ＝ '+3*c+' → 日曜日の方が3カ所合わせて '+D+'円高い',
    fig:T(['','平日の合計','日曜日の合計','差'],[['P＋Q＋R',String(3*b),String(3*c),String(D)]]),
    calc:'A：P＋Q ＝ '+2*a+' なので、Pが'+Rr+'円より高いこともある → 必ずとはいえない<br>B：差の合計'+D+'円の分け方は決まらない<br>C：3カ所とも差は0より大きく、合計'+D+'円なので、1カ所で'+D+'円以上にはならない → 正しい',v:{p:p}});},
  function(v,o){var a=v.p[0],b=v.p[1],c=v.p[2],Rr=3*b-2*a,D=3*(c-b),ok=[true,true,true];/* 0.5円きざみで総当たり */
    for(var P=0.5;P<2*a;P+=0.5){var Q=2*a-P;for(var x=0.5;x<D;x+=0.5)for(var y=0.5;x+y<D;y+=0.5){var z=D-x-y;if(z<=0)continue;
      if(!(Rr>P&&Rr>Q))ok[0]=false;if(!(x===c-b&&y===c-b&&z===c-b))ok[1]=false;if(Math.max(x,y,z)>=D)ok[2]=false;}}
    return o.c.filter(function(t,i){return ok[i];});});
tp(6,'70-2','70-2',function(R){var p=R.pick(P70().concat([[19,20,24,19.5],[19,20,24,19.5]])),a=p[0],b=p[1],e=p[3],Rr=3*b-2*a,P=2*e-Rr,st=P-R.int(0,3),out=R.int(1,6)===1;if(out)st=R.pick([P+1,P-4]);
  var c=rg(st,st+3).map(function(x){return x+'円';}).concat(['AからDのいずれでもない']);
  return O('70-2',q70(p)+'PとRの2カ所の平日のボール使用料の平均が'+d1(e)+'円であったとすると、Pの平日のボール使用料はいくらか。',c,out?c[4]:P+'円',
   {inw:'平均 × カ所数 ＝ 合計<br>P＋Q＋R ＝ '+3*b+'、P＋Q ＝ '+2*a+'、P＋R ＝ '+2*e,fig:T(['','式','合計'],[['乙','P＋Q＋R',String(3*b)],['甲','P＋Q',String(2*a)],['','R',String(Rr)],['問題','P＋R',String(2*e)]]),
    calc:'R ＝ '+3*b+' − '+2*a+' ＝ '+Rr+'<br>P ＝ '+2*e+' − '+Rr+' ＝ '+P+'円',v:{p:p}});},
  function(v,o){var a=v.p[0],b=v.p[1],e=v.p[3],P=2*a+2*e-3*b,t=P+'円';return o.c.indexOf(t)>=0?t:o.c[4];});

/* ===== 問71 4人の身長 ===== */
var C71=rg(155,180).map(function(x){return x+'cm';});
function q71(d,a,b){return 'P、Q、R、Sの4人の身長について、次のことがわかっている。<br>'+cd(['PとSの差は'+d+'cm','PとQの平均は'+a+'cm','RとSの平均は'+b+'cm'])+'<br><br>';}
function s71(d,a,b){var o=[];for(var P=120;P<=220;P++)[P-d,P+d].forEach(function(S){o.push([P,2*a-P,2*b-S,S]);});return o;}
function f71(r){return T(['','P','Q','R','S'],r.map(function(x,i){return [String(i+1)].concat(x.map(String));}));}
var P71a=lazy(function(){var o=[];rg(3,8).forEach(function(d){rg(162,172).forEach(function(a){rg(162,172).forEach(function(b){rg(158,180).forEach(function(r){var s=s71(d,a,b).filter(function(x){return x[2]===r;}),q=uq(s.map(function(x){return x[1];}));if(q.length===2&&q.every(function(y){return y>=155&&y<=180;}))o.push([d,a,b,r]);});});});});return o;});
var P71b=lazy(function(){var o=[];rg(3,8).forEach(function(d){rg(162,172).forEach(function(a){rg(162,172).forEach(function(b){var M=180,s=s71(d,a,b).filter(function(x){return Math.max.apply(null,x)===M;}),q=uq(s.map(function(x){return x[0];}));if(q.length>=3&&q.every(function(y){return y>=155&&y<=180;}))o.push([d,a,b]);});});});return o;});
tp(6,'71-1','71-1',function(R){var p=R.pick(P71a().concat([[5,168,170,175],[5,168,170,175]])),r=s71(p[0],p[1],p[2]).filter(function(x){return x[2]===p[3];}),a=uq(r.map(function(x){return x[1];}));
  return O('71-1',q71(p[0],p[1],p[2])+'Rの身長が'+p[3]+'cmの場合、Qの身長は何cmか。当てはまるものをすべて選びなさい。',C71,a.map(function(x){return x+'cm';}),
   {inw:'平均 × 2 ＝ 合計<br>P＋Q ＝ '+2*p[1]+'、R＋S ＝ '+2*p[2],fig:f71(r),calc:'S ＝ '+2*p[2]+' − '+p[3]+' ＝ '+(2*p[2]-p[3])+'<br>P ＝ S ± '+p[0]+' ＝ '+uq(r.map(function(x){return x[0];})).join('、')+'<br>Q ＝ '+2*p[1]+' − P ＝ '+a.join('、')+'cm',v:{p:p}});},
  function(v){var p=v.p,S=2*p[2]-p[3];return uq([S-p[0],S+p[0]].map(function(P){return 2*p[1]-P;})).map(function(x){return x+'cm';});});
tp(6,'71-2','71-2',function(R){var p=R.pick(P71b().concat([[5,168,170],[5,168,170]])),M=180,r=s71(p[0],p[1],p[2]).filter(function(x){return Math.max.apply(null,x)===M;}),a=uq(r.map(function(x){return x[0];}));
  return O('71-2',q71(p[0],p[1],p[2])+'最も身長が高い人が'+M+'cmの場合、Pの身長は何cmか。当てはまるものをすべて選びなさい。',C71,a.map(function(x){return x+'cm';}),
   {inw:'P＋Q ＝ '+2*p[1]+'、R＋S ＝ '+2*p[2]+'、PとSは'+p[0]+'cm差<br>'+M+'cmがP、Q、R、Sのだれかで場合分け',fig:f71(r),calc:'4通りの場合分けで、ほかの人が'+M+'cmを超えないものを残すと、Pは '+a.join('、')+'cm',v:{p:p}});},
  function(v){var p=v.p,M=180,o={};/* 180cmの人ごとに決める */
    [0,1,2,3].forEach(function(w){[-1,1].forEach(function(sg){var P,Q,Rr,S;if(w===0)P=M;else if(w===1)P=2*p[1]-M;else if(w===3)P=M-sg*p[0];else P=(2*p[2]-M)+sg*p[0];
      S=P+sg*p[0];if(w===3)S=M;if(w===2)S=2*p[2]-M;if(Math.abs(P-S)!==p[0])return;Q=2*p[1]-P;Rr=2*p[2]-S;if(Math.max(P,Q,Rr,S)===M)o[P]=1;});});return Object.keys(o).map(function(k){return k+'cm';});});
/* ===== 問72 得点分布表 ===== */
function h2(x){return (x/100).toFixed(2);}
function rnd2(num,den){return Math.floor(num*100/den+0.5);}/* 小数第3位を四捨五入した値×100 */
function dist(R,n,need,mx){for(var t=0;t<200;t++){var c=[0,0,0,0,0,0],left=n;for(var i=0;i<6;i++){c[i]=i===5?left:R.int(0,Math.min(left,Math.ceil(n/3)));left-=c[i];}
  if(left<0||c[5]<0)continue;c=R.shuffle?c:c;if(mx&&c[5]<1)continue;var s=c.reduce(function(a,x,i){return a+x*i;},0);if((s*100)%n===0&&need(c,s))return {c:c,s:s};}return null;}
function tb72(rows){var h='<div class="tbl-wrap"><table class="tbl"><tr><th>科目（人）＼得点</th>'+rg(0,5).map(function(x){return '<th>'+x+'点</th>';}).join('')+'<th>平均（点）</th></tr>';
  rows.forEach(function(r){h+='<tr><th>'+r[0]+'</th>'+r[1].map(function(x){return '<td>'+x+'</td>';}).join('')+'<td>'+r[2]+'</td></tr>';});return h+'</table></div>';}
function make72(R){var orig=R.int(1,4)===1;var K,M,S;
  if(orig){K={c:[0,1,3,10,1,5],s:66};M={c:[2,0,4,6,2,1],s:39};S={c:[4,8,2,2,1,1],s:27};}
  else{K=dist(R,20,function(c){return c[3]>=1&&c[5]>=1;});M=dist(R,15,function(){return true;});S=dist(R,18,function(c,s){return s<=45;},1);if(!K||!M||!S)return null;}
  var q='1問1点、5点満点で、国語、算数、社会の3科目のテストを行った。次の表は得点結果の一部である。<br>'+tb72([['国語（20）',K.c.map(function(x,i){return i===3||i===5?'（　）':x+'人';}),h2(K.s*100/20)],['算数（15）',M.c.map(function(x){return x+'人';}),h2(M.s*100/15)],['社会（18）',S.c.map(function(x){return x+'人';}),h2(S.s*100/18)]])+'<br>';
  return {K:K,M:M,S:S,q:q,orig:orig};}
function N72(R,ans,offs,none){var vs=[ans].concat(offs.map(function(o){return ans+o;}));if(R.int(1,6)===1)vs[0]=ans+R.pick([-20,20,25]);vs=uq(vs);if(vs.some(function(x){return x<0;})||vs.length<5)return null;
  return {c:vs.map(function(x){return h2(x)+'点';}).concat([none]),ans:vs.indexOf(ans)>=0?h2(ans)+'点':none};}
var NG72='AからEのいずれでもない';
tp(6,'72-1','72-1',function(R){var t=make72(R);if(!t)return null;var K=t.K,x=K.c[5],st=t.orig?1:Math.max(1,x-R.int(0,4)),out=!t.orig&&R.int(1,6)===1;if(out)st=x+1;
  var c=rg(st,st+4).map(function(y){return y+'人';}).concat([NG72]),known=K.c[0]+K.c[1]+K.c[2]+K.c[4],ks=K.c[1]+2*K.c[2]+4*K.c[4];
  return O('72-1',t.q+'国語で5点満点を取ったのは何人か。',c,out?NG72:x+'人',
   {inw:'平均 × 人数 ＝ 合計点<br>国語の合計点 ＝ '+h2(K.s*5)+' × 20 ＝ '+K.s,fig:T(['','3点','5点','計'],[['人数','□','!?',String(20-known)],['点数','3 × □','5 × ?',String(K.s-ks)]]),
    calc:'3点と5点の人数 ＝ 20 − '+known+' ＝ '+(20-known)+'<br>3点と5点の合計点 ＝ '+K.s+' − '+ks+' ＝ '+(K.s-ks)+'<br>全員3点なら '+3*(20-known)+'点。1人を5点にすると2点増える → 5点 ＝ （'+(K.s-ks)+' − '+3*(20-known)+'）÷ 2 ＝ '+x+'人',v:{c:K.c,s:K.s}});},
  function(v,o){var r=null;for(var a=0;a<=20;a++)for(var b=0;b<=20;b++){var c=v.c.slice();c[3]=a;c[5]=b;if(c.reduce(function(s,x){return s+x;},0)===20&&c.reduce(function(s,x,i){return s+x*i;},0)===v.s)r=b;}var t=r+'人';return o.c.indexOf(t)>=0?t:NG72;});
tp(6,'72-2','72-2',function(R){var t=make72(R);if(!t)return null;var tot=t.K.s+t.M.s,ans=rnd2(tot,35),n=N72(R,ans,[-15,-10,-5,10],NG72);if(!n)return null;
  return O('72-2',t.q+'国語と算数、2科目での平均点はいくつか（必要なときは、最後に小数第3位を四捨五入すること）。',n.c,n.ans,
   {inw:'平均 × 人数 ＝ 合計点。2科目の合計点 ÷ 2科目の人数',fig:T(['','人数','平均','合計点'],[['国語','20',h2(t.K.s*5),String(t.K.s)],['算数','15',h2(t.M.s*100/15),String(t.M.s)],['計','35','!?',String(tot)]]),
    calc:'国語 '+h2(t.K.s*5)+' × 20 ＝ '+t.K.s+'、算数 '+h2(t.M.s*100/15)+' × 15 ＝ '+t.M.s+'<br>（'+t.K.s+' ＋ '+t.M.s+'）÷ 35 ＝ '+h2(ans)+'点',v:{k:t.K.c,m:t.M.c}});},
  function(v,o){var s=0;v.k.forEach(function(x,i){s+=x*i;});v.m.forEach(function(x,i){s+=x*i;});var t=h2(Math.round(s/35*100+1e-9))+'点';return o.c.indexOf(t)>=0?t:NG72;});
tp(6,'72-3','72-3',function(R){var t=make72(R);if(!t)return null;var S=t.S,k=t.orig?1:R.pick([1,1,2]);if(S.s+18*k>18*4)return null;var T2=S.s/18+k,mx=5+k,ans=rnd2((S.s+18*k)*5,18*mx),n=N72(R,ans,[-8,-3,2,17],NG72);if(!n)return null;
  return O('72-3',t.q+'社会の平均点が'+(T2.toFixed(1))+'点になるように、社会を受けた18人に同じ点数を上乗せしたところ、最高点が'+mx+'点になった。そこで、最高点が5点になるように、上乗せした点数にさらに数値xを掛けて補正を行った。補正後の社会の平均点はいくつになったか（必要なときは、最後に小数第3位を四捨五入すること）。',n.c,n.ans,
   {inw:'全員に同じ点を足すと平均も同じだけ増える<br>全員にxを掛けると平均もx倍になる',fig:T(['','平均','最高点'],[['元',h2(S.s*100/18),'5'],['上乗せ後（＋'+k+'）',T2.toFixed(2),String(mx)],['補正後（× x）','!?','5']]),
    calc:'上乗せ ＝ '+T2.toFixed(1)+' − '+h2(S.s*100/18)+' ＝ '+k+'点<br>x ＝ 5 ÷ '+mx+'<br>補正後の平均 ＝ '+T2.toFixed(1)+' × 5 ÷ '+mx+' ＝ '+h2(ans)+'点',v:{c:S.c,k:k}});},
  function(v,o){var sum=0,n=0,mx=0;v.c.forEach(function(x,i){if(x)mx=Math.max(mx,i+v.k);});v.c.forEach(function(x,i){sum+=x*(i+v.k)*5/mx;n+=x;});var t=h2(Math.round(sum/n*100+1e-9))+'点';return o.c.indexOf(t)>=0?t:NG72;});
/* ===== 問73 ジャンケン ===== */
var HD=['グー','チョキ','パー'];function beats(a,b){return (a===0&&b===1)||(a===1&&b===2)||(a===2&&b===0);}
function rjk(h){var u=uq(h);if(u.length!==2)return null;var w=beats(u[0],u[1])?u[0]:u[1];return h.map(function(x){return x===w;});}
var K73=['ア','イ','ウ'];
function s73(){var o=[];prod([[0,1,2],[0,1,2],[0,1,2],[0,1,2],[0,1,2],[0,1,2]],function(x){var r1=[x[0],x[1],x[2]],r2=[x[3],x[4],x[5]];if(rjk(r1))return;var w=rjk(r2);if(!w||w.filter(Boolean).length!==2)return;
  if(x[1]!==1||x[4]!==1)return;if((x[2]===2)+(x[5]===2)!==1)return;if(x[3]!==1)return;o.push(x);});return o;}
tp(6,'73','73',function(R){var r=s73(),ok=[r.some(function(x){return x[0]===2;}),r.some(function(x){return x[2]===1;}),r.some(function(x){return x[2]===2;})],last='必ずしも誤りとはいえない推論はない';
  return O('73','P、Q、Rの3人がジャンケンをした。1回目は勝負がつかず、2回目は2人が勝った。このとき、次のことがわかっている。なお、3人が同じものを出したか、3人とも違うものを出した場合は勝負がつかないものとする。<br>'+cd(['Qは2回ともチョキを出した','Rは1回だけパーを出した','2回目にPはチョキを出した'])+'<br><br>1回目のジャンケンについて、必ずしも誤りとはいえない推論はどれか。AからHの中から1つ選びなさい。<br>ア　Pはパーを出した<br>イ　Rはチョキを出した<br>ウ　Rはパーを出した',
   KUMI(K73,last),kumiAns(K73,ok,last),{inw:'2回目：P・Qがチョキで2人勝ち → Rはパーで負け<br>Ⅱ → Rの1回目はパーではない',
    fig:T(['','1回目 P','Q','R','2回目 P','Q','R'],r.map(function(x){return x.map(function(y){return HD[y];});}).map(function(x,i){return x;})),
    calc:'1回目はQがチョキで勝負なし → 3人ともチョキ か 3人とも違う（Rはパー以外なのでグー、Pはパー）<br>ア：あり得る　イ：あり得る　ウ：誤り',v:{}});},
  function(v,o){/* 1回目のPとRだけを総当たり（2回目は P・Q チョキ、R パーに決まる） */var ok=[false,false,false];[0,1,2].forEach(function(p){[0,1].forEach(function(r){var h=[p,1,r];if(uq(h).length===2)return;ok[0]=ok[0]||p===2;ok[1]=ok[1]||r===1;ok[2]=ok[2]||r===2;});});
    return kumiAns(K73,ok,o.c[7]);});

/* ===== 問74 5人の面識 ===== */
var E5=combs([0,1,2,3,4],2);/* 0P 1Q 2R 3S 4T */
function deg(g,i){return E5.filter(function(e,k){return g[k]&&(e[0]===i||e[1]===i);}).length;}
function eg(g,a,b){var k=-1;E5.forEach(function(e,j){if(e[0]===Math.min(a,b)&&e[1]===Math.max(a,b))k=j;});return g[k];}
var G74=lazy(function(){var o=[];for(var m=0;m<1024;m++){var g=E5.map(function(e,k){return m>>k&1;});if(deg(g,3)===3&&deg(g,4)===1&&eg(g,4,0))o.push(g);}return o;});
var I74=[function(g){return [0,1,2,4].filter(function(i){return deg(g,i)===3;}).length===1;},function(g){return eg(g,1,2);},function(g){return eg(g,0,2);}];
tp(6,'74','74',function(R){var r=G74(),mi=minInfo(r,I74,keyS),last='ア、イ、ウのすべてが加わっても確定できない',ok=[0,1,2].map(function(i){return mi&&has(mi,i);});if(mi===null)return null;
  var fin=r.filter(function(g){return mi.every(function(i){return I74[i](g);});});var NMa=['P','Q','R','S','T'];
  return O('74','P、Q、R、S、Tの5氏の面識について、次のことがわかった。<br>'+cd(['S氏は3人とだけ会ったことがある','T氏はP氏とだけ会ったことがある'])+'<br><br>最も少ない情報で5人全員の面識の有無を確定するには、Ⅰ、Ⅱのほか、次のア、イ、ウのうちどれが加わればよいか。AからHの中から1つ選びなさい。<br>ア　3人とだけ会ったことがある人物はS氏のほかに1人だけいる<br>イ　Q氏とR氏は会ったことがある<br>ウ　P氏とR氏は会ったことがある',
   KUMI(K73,last),mi.length?kumiAns(K73,ok,last):last,{inw:'面識表（○会った ×会っていない）<br>TはPとだけ → SはTと会っていない → SはP・Q・Rの3人と会った',
    fig:T(['','P','Q','R','S','T'],[0,1,2,3,4].map(function(i){return [NMa[i]].concat([0,1,2,3,4].map(function(j){return i===j?'－':(fin.length&&uq(fin.map(function(g){return eg(g,i,j);})).length===1?(eg(fin[0],i,j)?'○':'×'):'?');}));})),
    calc:'決まっていないのは P−Q、P−R、Q−R の3つ<br>ウで P−R が○。アで「3人と会った人」はS以外に1人 → P（S・T・R と会った）なら P−Q は×で、Q・Rは3人にならないよう Q−R も×<br>アとウで全部決まる',v:{}});},
  function(v,o){/* 決まっていない P−Q、P−R、Q−R の3本だけを総当たり */var base=[];prod([[0,1],[0,1],[0,1]],function(x){base.push(x);});
    function d(x){var pq=x[0],pr=x[1],qr=x[2];return {P:2+pq+pr,Q:1+pq+qr,R:1+pr+qr};}/* P：S・Tと会っている。Q・R：Sと会っている */
    var f=[function(x){var dd=d(x);return [dd.P,dd.Q,dd.R,1].filter(function(y){return y===3;}).length===1;},function(x){return x[2]===1;},function(x){return x[1]===1;}],best=null;
    [[0],[1],[2],[0,1],[0,2],[1,2],[0,1,2]].forEach(function(cb){if(best&&cb.length>best.length)return;var s=base.filter(function(x){return cb.every(function(i){return f[i](x);});});if(s.length===1&&!best)best=cb;});
    return best?kumiAns(K73,[0,1,2].map(function(i){return has(best,i);}),o.c[7]):o.c[7];});

/* ===== 問75 8人トーナメント ===== */
var NM8=['P','Q','R','S','T','U','V','W'];
var S75=lazy(function(){var res={};perms([1,2,3,4,5,6,7]).forEach(function(rest){var pos=[0].concat(rest);/* 枠0〜7に入る人 */
  var opp=function(a,b){return a===b;};/* Pは枠0。1回戦の相手は枠1、2回戦は枠2・3の勝者、決勝は枠4〜7の勝者 */
  var p1=pos[1];[pos[2],pos[3]].forEach(function(p2){[pos[4],pos[5],pos[6],pos[7]].forEach(function(p3){var s=[p1,p2,p3].sort().join();if(s!==[3,4,6].join())return;
    /* Wの枠 */var w=pos.indexOf(7),mate=pos[w^1],nb=[pos[(w^2)&~1],pos[((w^2)&~1)+1]].sort().join();if(nb!==[2,4].join())return;res[mate]=1;});});});return Object.keys(res).map(Number);});
tp(6,'75','75',function(R){var a=S75();
  return O('75','P、Q、R、S、T、U、V、Wの8人が、シードのないトーナメント戦で戦った。これについて、次のことがわかっている。<br>甲　Pは順不同でS、T、Vと戦った<br>乙　Wは2回戦でR、Tと戦う可能性があった<br><br>Wが1回戦で対戦したのは誰か。当てはまるものをすべて選びなさい。',NM8.slice(0,7),a.map(function(i){return NM8[i];}),
   {inw:'甲 → Pは3回戦った（決勝まで進んだ）。1回戦・2回戦・決勝の相手がS、T、V<br>乙 → 1回戦で R と T が対戦し、その勝者がWの2回戦の相手',
    fig:T(['','1回戦','2回戦','決勝'],[['Pの相手','S か V','T（R−Tの勝者）','残り'],['Wの山','W − ?','R−T の勝者','']]),
    calc:'TはPと2回戦で戦う → PとWは同じ山。Pの1回戦の相手はSかV、決勝の相手はもう一方<br>Wの1回戦の相手は、残りの Q か U',v:{}});},
  function(v,o){var res={};/* Wを枠0に置いて総当たり。Pの1回戦・2回戦・決勝の相手がS、T、Vになり得るか */perms([0,1,2,3,4,5,6]).forEach(function(rest){var pos=[7].concat(rest);if([pos[2],pos[3]].sort().join()!=='2,4')return;
     var p=pos.indexOf(0),o1=pos[p^1],pr=((p>>1)^1)*2,r2=[pos[pr],pos[pr+1]],fin=p<4?pos.slice(4):pos.slice(0,4),ok=false;
     r2.forEach(function(s2){fin.forEach(function(f){if([o1,s2,f].sort().join()==='3,4,6')ok=true;});});if(ok)res[NM8[pos[1]]]=1;});
    return Object.keys(res);});

/* ===== 問76 トーナメント表ⅠかⅡ ===== */
var SVG76='<div style="display:flex;gap:12px;flex-wrap:wrap"><svg width="150" height="70" viewBox="0 0 150 70" fill="none" stroke="currentColor" stroke-width="1.5" role="img" aria-label="表Ⅰ"><text x="2" y="12" fill="currentColor" stroke="none" font-size="11">表Ⅰ</text><path d="M75 8V20M40 20H110M40 20V38M110 20V38M25 38H55M95 38H125M25 38V62M55 38V62M95 38V62M125 38V62"/></svg>'+
  '<svg width="150" height="70" viewBox="0 0 150 70" fill="none" stroke="currentColor" stroke-width="1.5" role="img" aria-label="表Ⅱ"><text x="2" y="12" fill="currentColor" stroke="none" font-size="11">表Ⅱ</text><path d="M110 8V18M80 18H130M130 18V62M80 18V30M55 30H95M95 30V62M55 30V42M25 42H75M25 42V62M75 42V62"/></svg></div>';
function s76(){var o=[];[0,1].forEach(function(tb){perms([0,1,2,3]).forEach(function(sl){prod([[0,1],[0,1],[0,1]],function(w){/* 試合を [a,b,勝者] で記録（0P 1Q 2R 3S） */var m=[];
  if(tb===0){var a=w[0]?sl[0]:sl[1],b=w[1]?sl[2]:sl[3];m.push([sl[0],sl[1],a],[sl[2],sl[3],b]);m.push([a,b,w[2]?a:b]);}
  else{var x=w[0]?sl[0]:sl[1];m.push([sl[0],sl[1],x]);var y=w[1]?x:sl[2];m.push([x,sl[2],y]);m.push([y,sl[3],w[2]?y:sl[3]]);}
  var has1=m.some(function(g){return (g[0]===0&&g[1]===1||g[0]===1&&g[1]===0)&&g[2]===0;}),has2=m.some(function(g){return (g[0]===1&&g[1]===2||g[0]===2&&g[1]===1)&&g[2]===1;});
  if(has1&&has2)o.push({tb:tb,sl:sl,m:m});});});});return o;}
var K76=['ア','イ','ウ'];
function t76(x){var champ=x.m[2][2],sGames=x.m.filter(function(g){return g[0]===3||g[1]===3;}).length;return [champ===0,sGames===1,x.tb===1?x.sl.indexOf(3)>=2:true];}
tp(6,'76','76',function(R){var r=s76(),ok=[0,1,2].map(function(i){return r.every(function(x){return t76(x)[i];});}),last='正しい推論はない';
  return O('76','P、Q、R、Sの4人が、ⅠまたはⅡのトーナメント表で戦い、甲と乙の情報を得た。<br>甲　QはPに負けた<br>乙　QはRに勝った<br>'+SVG76+'次のア、イ、ウのうち、必ず正しいといえるものはどれか。AからHの中で1つ選びなさい。<br>ア　優勝したのはPである<br>イ　Sは一度しか戦っていない<br>ウ　トーナメント表Ⅱのとき、Sは2回戦以降に出場する',
   KUMI(K76,last),kumiAns(K76,ok,last),{inw:'Qは2試合した（Rに勝ち、Pに負け）→ QはRに勝ったあとPに負けた',
    fig:T(['表','試合の流れ','S'],[['Ⅰ','Q−R（Q勝ち）、P−S、決勝 Q−P（P勝ち）','1試合（Pに負け）'],['Ⅱ','Q−R、Q−P（P勝ち）、P−S','1試合'],['Ⅱ','Q−R、Q−P（P勝ち）… Sが最初の試合','Sが1回戦に出る並びもある']]),
    calc:'ア：Ⅱで最後にSがPに勝つこともある → 必ずとはいえない<br>イ：QがR・Pと2試合するので、Sの試合は1つだけ → 正しい<br>ウ：Ⅱの決勝の枠がPで、Sが1回戦に出ることもある → 必ずとはいえない',v:{}});},
  function(v,o){var ok=[true,true,true];s76().forEach(function(x){var t=t76(x);t.forEach(function(b,i){if(!b)ok[i]=false;});});return kumiAns(K76,ok,o.c[7]);});
/* ===== 問77 3つの容器の食塩水 ===== */
var C77=NINE('ア','イ');
var P77=lazy(function(){var o=[];rg(5,40,5).forEach(function(a){rg(5,50,5).forEach(function(b){rg(5,50,5).forEach(function(c){if(uq([a,b,c]).length<3)return;o.push([a,b,c]);});});});return o;});
function j77(p){return [(p[0]+2*p[2])/3===p[1]?0:2,2*p[0]===p[1]?0:2];}
tp(6,'77','77',function(R){var all=P77(),pool=[];[[0,0],[0,2],[2,0],[2,2]].forEach(function(t){var f=all.filter(function(p){var j=j77(p);return j[0]===t[0]&&j[1]===t[1];});if(f.length)pool.push(R.pick(f));});pool.push([10,20,30]);var p=R.pick(pool),j=j77(p);
  return O('77','甲、乙、丙3つの容器に入れた食塩水の濃度を次の表に示している。甲と乙は同じ重さであり、丙は甲の2倍の重さである。次の推論の正誤について、正しいものをAからIの中で1つ選びなさい。<br>'+
   '<div class="tbl-wrap"><table class="tbl"><tr><th></th><th>濃度</th></tr><tr><th>甲</th><td>'+p[0]+'%</td></tr><tr><th>乙</th><td>'+p[1]+'%</td></tr><tr><th>丙</th><td>'+p[2]+'%</td></tr></table></div>'+
   'ア　甲と丙の食塩水を混ぜると、乙と同じ濃度になる<br>イ　水を蒸発させて甲の食塩水を半分の重さにすると、乙と同じ濃度になる',C77,nineTxt('ア','イ',j[0],j[1]),
   {inw:'食塩水の重さ × 濃度 ＝ 食塩の重さ<br>甲・乙を100g、丙を200gと置く',fig:T(['','食塩水','濃度','食塩'],[['甲','100',p[0]+'%',String(p[0])],['乙','100',p[1]+'%',String(p[1])],['丙','200',p[2]+'%',String(2*p[2])]]),
    calc:'ア：甲＋丙 ＝ 300gに食塩 '+p[0]+' ＋ '+2*p[2]+' ＝ '+(p[0]+2*p[2])+'g → '+(Math.round((p[0]+2*p[2])/3*10)/10)+'%（乙は'+p[1]+'%）→ '+J3[j[0]]+'<br>イ：甲を50gにすると食塩'+p[0]+'g → '+2*p[0]+'%（乙は'+p[1]+'%）→ '+J3[j[1]],v:{p:p}});},
  function(v){var p=v.p,w=60;/* 甲・乙を60g、丙を120gとして食塩の量で比べる */var sa=w*p[0]/100,sc=2*w*p[2]/100,mix=(sa+sc)/(3*w)*100,ev=sa/(w/2)*100;
    return nineTxt('ア','イ',Math.abs(mix-p[1])<1e-9?0:2,Math.abs(ev-p[1])<1e-9?0:2);});

/* ===== 問78 3市の人口密度 ===== */
var P78=lazy(function(){var o=[];rg(200,400,10).forEach(function(p){rg(150,400,10).forEach(function(q){rg(150,350,10).forEach(function(r){if(uq([p,q,r]).length===3&&(3*p+2*q)%5===0)o.push([p,q,r]);});});});return o;});
function q78(p){return 'P、Q、Rという3つの市の人口密度（人/km²：面積1km²あたりの人口）を次の表に示している。P市とR市の面積は等しく、Q市の面積はP市の面積の3分の2である。<br>'+
  '<div class="tbl-wrap"><table class="tbl"><tr><th></th><th>人口密度</th></tr><tr><th>P市</th><td>'+p[0]+'</td></tr><tr><th>Q市</th><td>'+p[1]+'</td></tr><tr><th>R市</th><td>'+p[2]+'</td></tr></table></div>';}
function F78(p){return T(['','面積','人口密度','人口'],[['P市','3',String(p[0]),String(3*p[0])],['Q市','2',String(p[1]),String(2*p[1])],['R市','3',String(p[2]),String(3*p[2])]]);}
var I78='面積 × 人口密度 ＝ 人口<br>P市・R市の面積を3、Q市を2と置く';
tp(6,'78-1','78-1',function(R){var p=R.pick(P78().concat([[310,330,210]])),k=R.pick([1.2,2,1.5,1.5]);if(p[0]===k*p[2])return null;var j=p[0]>k*p[2]?0:2;
  return O('78-1',q78(p)+'次の推論の正誤を答えなさい。<br>ア　P市の人口はR市の'+k+'倍より多い',J3,J3[j],{inw:I78,fig:F78(p),calc:'面積が同じなので人口の比 ＝ 人口密度の比<br>'+p[2]+' × '+k+' ＝ '+Math.round(p[2]*k*10)/10+' と '+p[0]+' を比べる → '+J3[j],v:{p:p,k:k}});},
  function(v){var P=v.p[0]*7,Rr=v.p[2]*7;/* 面積を7km²として人口で比べる */return J3[P>Rr*v.k?0:2];});
tp(6,'78-2a','78-2',function(R){var p=R.pick(P78().concat([[310,330,210]])),S=(3*p[0]+2*p[1])/5,t=R.pick([Math.round(S/10)*10+10,Math.round(S/10)*10-10,320]);if(t===S)return null;var j=S>t?0:2;
  return O('78-2',q78(p)+'P市とQ市が合併し、新しいS市ができる場合と、P市とR市が合併し、新しいT市ができる場合、次の推論の正誤を答えなさい。<br>イ　S市の人口密度は'+t+'人/km²より大きくなる',J3,J3[j],
   {inw:I78+'<br>合併後の人口密度 ＝ 人口の合計 ÷ 面積の合計',fig:F78(p),calc:'S市 ＝ （'+3*p[0]+' ＋ '+2*p[1]+'）÷ 5 ＝ '+S+'人/km² → '+t+'より'+(j?'大きくない':'大きい')+' → '+J3[j],v:{p:p,t:t}});},
  function(v){var S=(v.p[0]*1.5+v.p[1]*1)/2.5;return J3[S>v.t?0:2];});
tp(6,'78-2b','78-2',function(R){var p=R.pick(P78().concat([[310,330,210]])),Tm=(p[0]+p[2])/2,t=R.pick([Math.round(Tm/10)*10+10,Math.round(Tm/10)*10-10,250]);if(t===Tm)return null;var j=Tm>t?0:2;
  return O('78-2',q78(p)+'P市とQ市が合併し、新しいS市ができる場合と、P市とR市が合併し、新しいT市ができる場合、次の推論の正誤を答えなさい。<br>ウ　T市の人口密度は'+t+'人/km²より大きくなる',J3,J3[j],
   {inw:I78+'<br>面積が同じ市の合併は、人口密度の平均',fig:F78(p),calc:'T市 ＝ （'+p[0]+' ＋ '+p[2]+'）÷ 2 ＝ '+Tm+'人/km² → '+t+'より'+(j?'大きくない':'大きい')+' → '+J3[j],v:{p:p,t:t}});},
  function(v){var T2=(v.p[0]*4+v.p[2]*4)/8;return J3[T2>v.t?0:2];});

/* ===== 問79 濃度の定義が2通り ===== */
function II(x){return x/(100+x);}/* Ⅰの濃度x%の液のⅡでの濃度（割合） */
function rel(lo,hi,t){/* 2液を混ぜた濃度（lo〜hiの間、両端は含まない。lo＝hiならその値）と t の関係 */if(Math.abs(lo-hi)<1e-12)return Math.abs(lo-t)<1e-12?0:2;var a=Math.min(lo,hi),b=Math.max(lo,hi);return t>a+1e-12&&t<b-1e-12?1:2;}
var P79=lazy(function(){var o=[];[5,10,15,20,25,30,40,50].forEach(function(x){[5,10,15,20,25,30,40,50].forEach(function(y){if(y<x)return;[5,10,15,20,25,30,40,50].forEach(function(z){o.push([x,y,z]);});});});return o;});
function j79(p){return [rel(p[0],p[1],p[2]),rel(II(p[0]),II(p[1]),II(p[2])/2)];}
var C79=NINE('ア','イ');
tp(7,'79-1','79-1',function(R){var all=P79(),pool=[];[[1,2],[2,1],[1,1],[0,2],[2,2]].forEach(function(t){var f=all.filter(function(p){var j=j79(p);return j[0]===t[0]&&j[1]===t[1];});if(f.length)pool.push(R.pick(f));});pool.push([10,10,20]);
  var p=R.pick(pool),j=j79(p);
  return O('79-1','ある物質Kを溶かした赤い水溶液の濃度を次の2つの方法で調べた。<br>Ⅰ　濃度＝物質の質量÷水の質量×100<br>Ⅱ　濃度＝物質の質量÷（水の質量＋物質の質量）×100<br><br>次の表は、Ⅰで調べたときの赤い水溶液X、Y、Zの濃度を示したものである。なお、X、Y、Zの重さは等しいとは限らない。次の推論の正誤について、正しいものをAからIの中で1つ選びなさい。<br>'+
   '<div class="tbl-wrap"><table class="tbl"><tr><th></th><th>濃度</th></tr><tr><th>X</th><td>'+p[0]+'%</td></tr><tr><th>Y</th><td>'+p[1]+'%</td></tr><tr><th>Z</th><td>'+p[2]+'%</td></tr></table></div>'+
   'ア　Ⅰで調べるとき、XとYを混ぜるとZと同じ濃度になる<br>イ　Ⅱで調べるとき、XとYを混ぜるとZの2分の1の濃度になる',C79,nineTxt('ア','イ',j[0],j[1]),
   {inw:'水を100と置くと、Ⅰの濃度x%の液は 物質x・水100<br>2つの液を混ぜた濃度は、元の2つの濃度の間（重さで変わる）',
    fig:T(['','物質','水','Ⅰの濃度','Ⅱの濃度'],[p[0],p[1],p[2]].map(function(x,i){return [['X','Y','Z'][i],String(x),'100',x+'%',(Math.round(II(x)*1000)/10)+'%'];})),
    calc:'ア：混ぜた液のⅠの濃度は'+(p[0]===p[1]?p[0]+'%':p[0]+'%と'+p[1]+'%の間')+'。Zは'+p[2]+'% → '+J3[j[0]]+'<br>イ：混ぜた液のⅡの濃度は'+(p[0]===p[1]?'約'+Math.round(II(p[0])*1000)/10+'%':'約'+Math.round(II(p[0])*1000)/10+'%と約'+Math.round(II(p[1])*1000)/10+'%の間')+'。Zの半分は約'+Math.round(II(p[2])*500)/10+'% → '+J3[j[1]],v:{p:p}});},
  function(v){var p=v.p,res=[[],[]];/* 水の量をいろいろ変えて混ぜ、目標の濃度より上・同じ・下が出るかを見る */
    [1,2,3,5,10,30,100,1000,10000].forEach(function(wx){[1,2,3,5,10,30,100,1000,10000].forEach(function(wy){var kx=wx*p[0],ky=wy*p[1],W=(wx+wy)*100,m1=(kx+ky)/W,m2=(kx+ky)/(W+kx+ky),t1=p[2]/100,t2=p[2]/(100+p[2])/2;
      res[0].push(Math.abs(m1-t1)<1e-12?0:m1>t1?1:-1);res[1].push(Math.abs(m2-t2)<1e-12?0:m2>t2?1:-1);});});
    var jj=res.map(function(a){var u=uq(a);return u.length===1?(u[0]===0?0:2):(has(u,1)&&has(u,-1)?1:2);});return nineTxt('ア','イ',jj[0],jj[1]);});
tp(7,'79-2','79-2',function(R){var n=R.pick([3,4,2,2]),c=NINE('カ','キ');
  return O('79-2','ある物質Kを溶かした赤い水溶液の濃度を次の2つの方法で調べた。<br>Ⅰ　濃度＝物質の質量÷水の質量×100<br>Ⅱ　濃度＝物質の質量÷（水の質量＋物質の質量）×100<br><br>物質Kを溶かした赤い水溶液Wがある。ここに'+(n===2?'同じ質量の':'')+'物質Kを入れてWの中のKの質量が'+n+'倍になるようにした。このとき、次の推論の正誤について、正しいものをAからIの中で1つ選びなさい。<br>カ　Ⅰで調べるとき、濃度は元の水溶液Wの'+n+'倍になる。<br>キ　Ⅱで調べるとき、濃度は元の水溶液Wの'+n+'倍になる。',c,nineTxt('カ','キ',0,2),
   {inw:'水は変わらず、物質だけが'+n+'倍になる',fig:T(['','物質','水','Ⅰ','Ⅱ'],[['元','10','100','10%','約9.1%'],['後',String(10*n),'100',10*n+'%','約'+Math.round(1000*n/(100+10*n))/10+'%']]),
    calc:'カ：分母の水は同じなので'+n+'倍 → 正しい<br>キ：分母に物質も入り、分母も増える → '+n+'倍にならない → 誤り',v:{n:n}});},
  function(v){var k=7,w=50,i1=k/w,i2=v.n*k/w,j1=k/(w+k),j2=v.n*k/(w+v.n*k);return nineTxt('カ','キ',Math.abs(i2-v.n*i1)<1e-12?0:2,Math.abs(j2-v.n*j1)<1e-12?0:2);});
/* ===== 問80 通りの店（距離） ===== */
var C80=['西から1番目','西から2番目','西から3番目','東から3番目','東から2番目','東から1番目'],X80=[-3,-2,-1,1,2,3];
function s80(d1,d2){var o=[];prod([X80,X80,X80,X80],function(x){var P=x[0],Q=x[1],Rr=x[2],S=x[3];if(uq(x).length<4)return;if(Math.abs(P)!==d1||Math.abs(P-Q)!==d1||Math.abs(Rr-P)!==d2||Math.abs(Rr-S)!==d2)return;o.push(x);});return o;}
function a80(r){var o={};r.forEach(function(x){X80.forEach(function(t){if(!has(x,t))o[t]=1;});});return X80.filter(function(t){return o[t];});}
var P80=lazy(function(){var o=[];[1,2].forEach(function(d1){[1,2,3].forEach(function(d2){var r=s80(d1,d2);if(!r.length)return;var a=a80(r);if(a.length&&a.length<6)o.push([d1,d2]);});});return o;});
tp(6,'80','80',function(R){var p=R.pick(P80().concat([[1,2],[1,2]])),r=s80(p[0],p[1]),a=a80(r);
  return O('80','東西に延びる60mの通りに、駅を真ん中にして10m間隔で駅と店が並んでいる。P、Q、R、Sという4店について、次のことがわかっている。<br>'+cd(['Pは駅からもQからも'+10*p[0]+'m離れている','RはPからもSからも'+10*p[1]+'m離れている'])+'<br><br>4店のある場所ではない位置に、Tという店があることがわかった。Tはどこにあるか。当てはまる□をすべて選びなさい。<br>西← □ □ □ 駅 □ □ □ →東',
   C80,a.map(function(t){return C80[X80.indexOf(t)];}),{inw:'10m ＝ 1マス。Pは駅から'+p[0]+'マス、QはPから'+p[0]+'マス<br>RはPとSのちょうど真ん中（PとSは'+2*p[1]+'マス離れる）',
    fig:T(['','西1','西2','西3','駅','東3','東2','東1'],r.map(function(x,i){var row=[String(i+1)];[-3,-2,-1,0,1,2,3].forEach(function(t){row.push(t===0?'駅':(x.indexOf(t)>=0?['P','Q','R','S'][x.indexOf(t)]:'T?'));});return row;})),
    calc:'Pの位置（駅の西か東）で場合分けして書き出すと'+r.length+'通り。空いている□がTの候補 → '+a.map(function(t){return C80[X80.indexOf(t)];}).join('、'),v:{d1:p[0],d2:p[1]}});},
  function(v){var o={};/* Pの位置から順に決める */[-v.d1,v.d1].forEach(function(P){[P-v.d1,P+v.d1].forEach(function(Q){[P-v.d2,P+v.d2].forEach(function(Rr){[Rr-v.d2,Rr+v.d2].forEach(function(S){var x=[P,Q,Rr,S];if(x.some(function(y){return y===0||Math.abs(y)>3;})||uq(x).length<4)return;X80.forEach(function(t){if(!has(x,t))o[t]=1;});});});});});
    return X80.filter(function(t){return o[t];}).map(function(t){return C80[X80.indexOf(t)];});});

/* ===== 問81 皿の並び ===== */
function s81(n,r){var o=[];prod(rg(1,n).map(function(){return [0,1,2];}),function(x){/* 0赤 1緑 2青 */if(x.filter(function(y){return y===0;}).length!==r||!has(x,1)||!has(x,2))return;
  for(var i=0;i+1<n;i++){var a=x[i],b=x[i+1];if(a===0&&b===0||a===0&&b===2||a===2&&b===0)return;}o.push(x);});return o;}
var P81=lazy(function(){var o=[];[5,6,7].forEach(function(n){[2,3].forEach(function(r){var s=s81(n,r);if(!s.length)return;var a=uq([].concat.apply([],s.map(function(x){return rg(0,n-1).filter(function(i){return x[i]===2;});})));if(a.length<n)o.push([n,r]);});});return o;});
tp(6,'81','81',function(R){var p=R.pick(P81().concat([[5,2],[5,2]])),n=p[0],r=s81(n,p[1]),a=uq([].concat.apply([],r.map(function(x){return rg(0,n-1).filter(function(i){return x[i]===2;});}))),c=rg(1,n).map(function(i){return '左から'+i+'番目';});
  return O('81','赤、緑、青の皿が全部で'+n+'枚ある。これらを次の条件で横一列に並べた。<br>'+cd(['赤い皿は'+p[1]+'枚あり、赤い皿同士は隣り合わない','青い皿と赤い皿は隣り合わない'])+'<br><br>このとき青い皿の位置としてあり得るものはどこか。当てはまる□をすべて選びなさい。<br>左← '+rg(1,n).map(function(){return '□';}).join(' ')+' →右',
   c,a.map(function(i){return c[i];}),{inw:'赤の両隣は緑（青も赤も来ない）<br>赤○ 緑 赤 のように、赤と赤の間には緑が入る',fig:T([''].concat(rg(1,n).map(String)),r.map(function(x,i){return [String(i+1)].concat(x.map(function(y){return ['赤','緑','青'][y];}));})),
    calc:'赤の置き方を決めて、赤の隣を緑でうめ、残りに青を置く。青になり得るのは '+a.map(function(i){return i+1;}).join('、')+'番目',v:{n:n,r:p[1]}});},
  function(v){var o={};/* 赤の位置の組を選んでから残りを決める */combs(rg(0,v.n-1),v.r).forEach(function(rd){if(rd.some(function(x,i){return i&&x-rd[i-1]===1;}))return;var free=rg(0,v.n-1).filter(function(i){return !has(rd,i);}),adj=free.filter(function(i){return has(rd,i-1)||has(rd,i+1);}),blueOK=free.filter(function(i){return !has(adj,i);});
     /* 隣が赤の席は緑。青は残りの席から1枚以上、緑も1枚以上 */if(!blueOK.length)return;if(adj.length===0&&blueOK.length<2)return;blueOK.forEach(function(i){o[i]=1;});});return Object.keys(o).map(function(i){return '左から'+(+i+1)+'番目';});});

/* ===== 問82 家と駅の間の店 ===== */
var C82=rg(1,5).map(function(i){return '家から'+i+'番目';});
var S82=lazy(function(){return perms([0,1,2,3,4]).map(function(od){var pos=[];od.forEach(function(w,i){pos[w]=i+1;});return pos;}).filter(function(x){return x[1]>x[0]&&x[4]>x[3]&&x[2]===x[0]+1;});});/* pos：0P 1Q 2R 3S 4T、家から何番目 */
function f82(r){return T(['','1','2','3','4','5'],r.map(function(x,i){var row=[String(i+1)];rg(1,5).forEach(function(k){row.push(['P','Q','R','S','T'][x.indexOf(k)]);});return row;}));}
var Q82='家から駅までの道に等間隔で商店P、Q、R、S、Tがある。5店の並び方について、次のことがわかっている。<br>'+cd(['家から見てQはPより遠い','駅から見てTはSより近い','家から見てPの次にRがある'])+'<br><br>';
tp(6,'82-1','82-1',function(R){var r=S82(),a=uq(r.map(function(x){return x[4];}));
  return O('82-1',Q82+'Tはどこにあるか。当てはまる□をすべて選びなさい。<br>家← □ □ □ □ □ →駅',C82,a.map(function(i){return C82[i-1];}),{inw:'家に近い方を左に書く<br>「PR」はセット、QはPより右、TはSより右',fig:f82(r),calc:'「PR」の置き場所で場合分けして書き出すと'+r.length+'通り。Tは '+a.join('、')+'番目',v:{}});},
  function(v){var o={};prod([[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5]],function(x){var P=x[0],Q=x[1],S=x[2],Rr=P+1;var used=[P,Q,Rr,S];if(Rr>5||uq(used).length<4||Q<=P)return;var T2=15-P-Q-Rr-S;if(T2<1||T2>5||has(used,T2)||T2<=S)return;o[T2]=1;});return Object.keys(o).map(function(i){return C82[i-1];});});
tp(6,'82-2','82-2',function(R){var r=S82().filter(function(x){return Math.abs(x[1]-x[3])>Math.abs(x[1]-x[4]);}),a=uq(r.map(function(x){return x[3];}));
  return O('82-2',Q82+'QとSの間隔はQとTの間隔より広い。Sはどこにあるか。当てはまる□をすべて選びなさい。<br>家← □ □ □ □ □ →駅',C82,a.map(function(i){return C82[i-1];}),{inw:'❶の並びのうち、QからSまでの方がQからTまでより遠いものを残す',fig:f82(r),calc:'残る並びは'+r.length+'通り。Sは '+a.join('、')+'番目',v:{}});},
  function(v){var o={};perms([1,2,3,4,5]).forEach(function(x){var P=x[0],Q=x[1],Rr=x[2],S=x[3],T2=x[4];if(Q>P&&T2>S&&Rr===P+1&&Math.abs(Q-S)>Math.abs(Q-T2))o[S]=1;});return Object.keys(o).map(function(i){return C82[i-1];});});

/* ===== 問83 男女6人の並び ===== */
var C83=rg(1,6).map(function(i){return '西から'+i+'番目';});
var S83=lazy(function(){return perms([0,1,2,3,4,5]).map(function(od){var pos=[];od.forEach(function(w,i){pos[w]=i+1;});return pos;}).filter(function(x){/* 0P 1Q 2R 男、3S 4T 5U 女 */
  var at=function(k){return x.indexOf(k);};if(!(x[0]<x[3]))return false;if(at(1)<3||at(6)<3)return false;var q=x[1];return [q-1,q+1].every(function(k){var w=at(k);return w<0||w>=3;});});});
function f83(r){return T(['','1','2','3','4','5','6'],r.map(function(x,i){var row=[String(i+1)];rg(1,6).forEach(function(k){row.push(['P','Q','R','S','T','U'][x.indexOf(k)]);});return row;}));}
var Q83='3人の男性P、Q、Rと3人の女性S、T、Uの計6人が、横一列に並んで写真撮影をする。並び方について、次の条件がある。<br>'+cd(['PはSよりも西にする','両端は女性にする','Qの両隣は男性ではない'])+'<br><br>';
var ROW6='<br>西← □ □ □ □ □ □ →東';
tp(6,'83-1','83-1',function(R){var r=S83().filter(function(x){return x[4]===x[1]+1;}),a=uq(r.map(function(x){return x[3];}));
  return O('83-1',Q83+'QがTの1つ西になるとき、Sはどこになるか。当てはまる□をすべて選びなさい。'+ROW6,C83,a.map(function(i){return C83[i-1];}),{inw:'「QT」がセット。Qの西隣も女性<br>両端は女性',fig:f83(r),calc:'「QT」の置き場所で場合分けすると'+r.length+'通り。Sは '+a.join('、')+'番目',v:{}});},
  function(v){var o={};perms(['P','Q','R','S','T','U']).forEach(function(l){var i=function(c){return l.indexOf(c);},man=function(k){return k>=0&&k<6&&'PQR'.indexOf(l[k])>=0;};
     if(i('P')>i('S')||man(0)||man(5)||man(i('Q')-1)||man(i('Q')+1)||i('T')!==i('Q')+1)return;o[i('S')+1]=1;});return Object.keys(o).map(function(k){return C83[k-1];});});
tp(6,'83-2','83-2',function(R){var r=S83().filter(function(x){return Math.abs(x[0]-x[4])!==1&&Math.abs(x[0]-x[5])!==1;}),a=uq(r.map(function(x){return x[2];}));
  return O('83-2',Q83+'Pが、T・Uと隣にならないとき、Rはどこになるか。当てはまる□をすべて選びなさい。'+ROW6,C83,a.map(function(i){return C83[i-1];}),{inw:'Pの隣は男性（Q・R）かS<br>Qの両隣は女性 → Pの隣はRかS',fig:f83(r),calc:'書き出すと'+r.length+'通り。Rは '+a.join('、')+'番目',v:{}});},
  function(v){var o={};perms(['P','Q','R','S','T','U']).forEach(function(l){var i=function(c){return l.indexOf(c);},man=function(k){return k>=0&&k<6&&'PQR'.indexOf(l[k])>=0;};
     if(i('P')>i('S')||man(0)||man(5)||man(i('Q')-1)||man(i('Q')+1))return;if(Math.abs(i('P')-i('T'))===1||Math.abs(i('P')-i('U'))===1)return;o[i('R')+1]=1;});return Object.keys(o).map(function(k){return C83[k-1];});});

/* ===== 問84 絵画の間隔 ===== */
var NM6=['A','B','C','D','E','F'];
function s84(k1,k2,k3){return perms([1,2,3,4,5,6]).filter(function(x){return x[4]>x[3]&&Math.abs(x[0]-x[1])===k1&&Math.abs(x[2]-x[3])===k2&&Math.abs(x[0]-x[2])===k3;});}
function f84(r){return T(['','1','2','3','4','5','6'],r.map(function(x,i){var row=[String(i+1)];rg(1,6).forEach(function(k){row.push(NM6[x.indexOf(k)]);});return row;}));}
var P84=lazy(function(){var o=[];[2,3,4,5].forEach(function(s){[1,2].forEach(function(k1){[1,2,3].forEach(function(k2){rg(1,5).forEach(function(k3){var r=s84(k1,k2,k3);if(!r.length)return;var a=uq(r.map(function(x){return x[0];})),d=uq(r.map(function(x){return x[3];}));o.push([s,k1,k2,k3,a.length<6,d.length<6]);});});});});return o;});
function q84(s,k1,k2){return 'A、B、C、D、E、Fという横幅1mの6枚の絵画が、壁に横一列に並んでいる。隣り合う絵画の中心同士の距離は'+s+'mである。絵の並び方について、次のことがわかっている。なお、距離とは絵画の中心同士の距離を指す。<br>'+cd(['EはDより東にある','AとBの距離は'+k1*s+'mである','CとDの距離は'+k2*s+'mである'])+'<br><br>';}
function m84(id,i,orig,who){tp(6,id,id,function(R){var p=R.pick(P84().filter(function(x){return x[4+i];}).concat([orig,orig])),r=s84(p[1],p[2],p[3]),a=uq(r.map(function(x){return x[who];}));
  return O(id,q84(p[0],p[1],p[2])+'AとCの距離が'+p[3]*p[0]+'mのとき、'+NM6[who]+'の位置はどこか。当てはまる□をすべて選びなさい。'+ROW6,C83,a.map(function(k){return C83[k-1];}),
   {inw:'距離を「何枚分離れているか」に直す（'+p[0]+'m ＝ 1つ）<br>AとB：'+p[1]+'つ、CとD：'+p[2]+'つ、AとC：'+p[3]+'つ',fig:f84(r),calc:'Aの位置で場合分けして書き出すと'+r.length+'通り。'+NM6[who]+'は '+a.join('、')+'番目',v:{k:[p[1],p[2],p[3]],w:who}});},
  function(v){var o={},k=v.k;/* AとCを先に置いてから B・D・E を置く */for(var A=1;A<=6;A++)[A-k[2],A+k[2]].forEach(function(C){if(C<1||C>6)return;[A-k[0],A+k[0]].forEach(function(Bb){[C-k[1],C+k[1]].forEach(function(D){var u=[A,Bb,C,D];if(u.some(function(y){return y<1||y>6;})||uq(u).length<4)return;
      rg(D+1,6).forEach(function(E){if(has(u,E))return;var x=[A,Bb,C,D,E];o[x[v.w]]=1;});});});});return Object.keys(o).map(function(i){return C83[i-1];});});}
m84('84-1',0,[5,1,2,1,1,1],0);m84('84-2',1,[5,1,2,4,1,1],3);
/* ===== 問85 2階建てアパート ===== */
var RM8=['101','102','103','104','201','202','203','204'],NM7=['P','Q','R','S','T','U','V'];
function nb(a,b){return Math.floor(a/4)===Math.floor(b/4)&&Math.abs(a-b)===1;}
var S85=memo(function(e){var o=[];perms(rg(0,7).filter(function(x){return x!==e;})).forEach(function(x){/* x[i]＝NM7[i]の部屋 */if(!nb(x[0],x[5]))return;if(x[1]!==x[2]+4)return;if(x[6]!==x[5]+4)return;o.push(x);});return o;});
function I85(e){return [function(x){return nb(x[5],e);},function(x){return nb(x[3],x[6]);},function(x){return x[4]%4===0||x[4]%4===3;}];}
var K85a=['ア','イ','ウ'],K85b=['カ','キ','ク'];
function q85(e){var g='<div class="tbl-wrap"><table class="tbl"><tr>'+[4,5,6,7].map(function(i){return '<td>'+RM8[i]+'</td>';}).join('')+'</tr><tr>'+[0,1,2,3].map(function(i){return '<td>'+RM8[i]+'</td>';}).join('')+'</tr></table></div>';
  return 'P、Q、R、S、T、U、Vの7人が、アパートの各部屋に1人ずつ住んでいる。アパートは図のような2階建てで、次のことがわかっている。<br>'+g+cd([RM8[e]+'号室は空き室である','PはUの隣に住んでいる','Qの部屋の真下がRの部屋である','VはUの真上に住んでいる'])+'<br><br>';}
function f85(r){return T(['','101','102','103','104','201','202','203','204'],r.map(function(x,i){var row=[String(i+1)];rg(0,7).forEach(function(k){var w=x.indexOf(k);row.push(w<0?'空':NM7[w]);});return row;}));}
var P85a=lazy(function(){return rg(0,7).filter(function(e){return S85(e).length;});});
var P85b=lazy(function(){return rg(0,7).filter(function(e){return S85(e).length&&minInfo(S85(e),I85(e),keyS)!==null;});});
function t85(x){return [x[1]===5,x[3]===6,x[6]===5];}
tp(7,'85-1','85',function(R){var e=R.pick(P85a().concat([2,2])),r=S85(e),ok=[0,1,2].map(function(i){return r.some(function(x){return t85(x)[i];});}),last='必ずしも誤りとはいえない推論はない';
  return O('85',q85(e)+'次のうち、必ずしも誤りとはいえない推論はどれか。<br>ア　Qは202号室に住んでいる<br>イ　Sは203号室に住んでいる<br>ウ　Vは202号室に住んでいる',KUMI(K85a,last),kumiAns(K85a,ok,last),
   {inw:'縦のセット「Q／R」「V／U」と、横のセット「PU」（UPでもよい）を置く<br>'+RM8[e]+'号室は空き室',fig:f85(r),calc:'「V／U」の縦の列を決めると、Pは1階のUの隣。残りの縦の列に「Q／R」。書き出すと'+r.length+'通り（表は8通りまで）。1つでも当てはまる行がある推論を選ぶ',v:{e:e}});},
  function(v,o){var ok=[false,false,false];/* Uの部屋から順に決める */rg(0,3).forEach(function(U){if(U===v.e||U+4===v.e)return;var V=U+4;[U-1,U+1].forEach(function(P){if(P<0||P>3||P===v.e)return;rg(0,3).forEach(function(Rr){var Q=Rr+4;var used=[U,V,P,Rr,Q];if(uq(used).length<5||has(used,v.e))return;
      var rest=rg(0,7).filter(function(k){return !has(used,k)&&k!==v.e;});[[rest[0],rest[1]],[rest[1],rest[0]]].forEach(function(st){if(Q===5)ok[0]=true;if(st[0]===6)ok[1]=true;if(V===5)ok[2]=true;});});});});return kumiAns(K85a,ok,o.c[7]);});
tp(7,'85-2','85',function(R){var e=R.pick(P85b().concat([2,2])),r=S85(e),mi=minInfo(r,I85(e),keyS),last='カ、キ、クのすべてが加わってもわからない',ans=mi.length?kumiAns(K85b,[0,1,2].map(function(i){return has(mi,i);}),last):last;
  return O('85',q85(e)+'最も少ない情報で7人の住んでいる部屋を確定するためには、ⅠからⅣまでの情報のほかに、次のカ、キ、クのうち、どれが加わればよいか。<br>カ　Uは空き室の隣に住んでいる<br>キ　SはVの隣に住んでいる<br>ク　Tは端の部屋に住んでいる',KUMI(K85b,last),ans,
   {inw:'Ⅰ〜Ⅳだけの並びを書き出し、情報を足して1通りに絞る',fig:f85(r),calc:'Ⅰ〜Ⅳだけでは'+r.length+'通り。'+(mi.length?mi.map(function(i){return K85b[i];}).join('と')+'を足すと1通りに決まる':'どの組み合わせでも1通りにならない'),v:{e:e}});},
  function(v,o){var r=[];/* 部屋を総当たり（S85と別に作り直す） */perms([0,1,2,3,4,5,6,7]).forEach(function(x){if(x[7]!==v.e)return;var y=x.slice(0,7);if(!nb(y[0],y[5])||y[1]-y[2]!==4||y[6]-y[5]!==4)return;r.push(y);});
    var f=I85(v.e),best=null;[[0],[1],[2],[0,1],[0,2],[1,2],[0,1,2]].forEach(function(cb){if(best&&cb.length>best.length)return;var s=r.filter(function(x){return cb.every(function(i){return f[i](x);});});if(s.length===1&&!best)best=cb;});
    return best?kumiAns(K85b,[0,1,2].map(function(i){return has(best,i);}),o.c[7]):o.c[7];});

/* ===== 問86 カップの入れかえ ===== */
function sw(x,i,j){return x===i?j:x===j?i:x;}
function run86(n,a,b,c,x){var m=(n+1)/2,o=[];[m-a,m+a].forEach(function(t1){if(t1<1||t1>n)return;var y=sw(x,m,t1),k=n-b+1;[k-c,k+c].forEach(function(t2){if(t2<1||t2>n)return;var z=sw(y,k,t2);o.push(sw(z,1,n));});});return uq(o);}
var P86=lazy(function(){var o=[];[5,7,9].forEach(function(n){rg(1,3).forEach(function(a){rg(2,3).forEach(function(b){rg(1,2).forEach(function(c){var m=(n+1)/2;if(m-a<1||n-b+1-c<1)return;var a1=run86(n,a,b,c,m),a2=rg(1,n).filter(function(s){return has(run86(n,a,b,c,s),1);});
  if(a1.length>=2&&a2.length>=2&&a2.length<n)o.push([n,a,b,c]);});});});});return o;});
function q86(p){return p[0]+'個のカップを横一列に並べて、そのうちの1個にサイコロを隠してから、カップを次の順番で並びかえた。<br>左　'+rg(1,p[0]).join('　')+'　右<br>'+cd(['真ん中を'+p[1]+'つ隣と入れかえる','次に右から'+p[2]+'つ目を'+p[3]+'つ隣と入れかえる','次に両端を入れかえる'])+'<br><br>';}
function v86(p,start){/* カップ全体の並びを動かして確かめる */var n=p[0],m=(n+1)/2,k=n-p[2]+1,o={};[m-p[1],m+p[1]].forEach(function(t1){if(t1<1||t1>n)return;[k-p[3],k+p[3]].forEach(function(t2){if(t2<1||t2>n)return;var c=rg(1,n).map(function(i){return i===start;});
  var s=function(i,j){var t=c[i-1];c[i-1]=c[j-1];c[j-1]=t;};s(m,t1);s(k,t2);s(1,n);o[c.indexOf(true)+1]=1;});});return Object.keys(o).map(Number);}
tp(6,'86-1','86',function(R){var p=R.pick(P86().concat([[7,2,2,1],[7,2,2,1]])),m=(p[0]+1)/2,a=run86(p[0],p[1],p[2],p[3],m);
  return O('86',q86(p)+'最初に真ん中（'+m+'）のカップにサイコロが入っていた場合、最後にサイコロが入っているカップの位置はどれか。当てはまるものをすべて選びなさい。',rg(1,p[0]).map(String),a.map(String),
   {inw:'サイコロの位置だけを追う。「○つ隣」は左右の2通り<br>Ⅱの「右から'+p[2]+'つ目」は左から'+(p[0]-p[2]+1),fig:T(['','Ⅰ','Ⅱ','Ⅲ'],[['入れかえる位置',m+' と '+(m-p[1])+'／'+(m+p[1]),(p[0]-p[2]+1)+' と '+(p[0]-p[2]+1-p[3])+'／'+(p[0]-p[2]+1+p[3]),'1 と '+p[0]]]),
    calc:m+' から始めて、Ⅰ・Ⅱの左右2通りずつを追うと、最後は '+a.join('、'),v:{p:p}});},
  function(v){var m=(v.p[0]+1)/2;return v86(v.p,m).map(String);});
tp(6,'86-2','86',function(R){var p=R.pick(P86().concat([[7,2,2,1],[7,2,2,1]])),a=rg(1,p[0]).filter(function(s){return has(run86(p[0],p[1],p[2],p[3],s),1);});
  return O('86',q86(p)+'最後に左端（1）のカップにサイコロが入っていた場合、最初にサイコロが入っていたカップの位置はどれか。当てはまるものをすべて選びなさい。',rg(1,p[0]).map(String),a.map(String),
   {inw:'最後から逆にたどる。Ⅲの前は右端（'+p[0]+'）',fig:T(['','Ⅲ','Ⅱ','Ⅰ'],[['逆にたどる','1 ← '+p[0],(p[0]-p[2]+1)+' と '+(p[0]-p[2]+1-p[3])+'／'+(p[0]-p[2]+1+p[3]),((p[0]+1)/2)+' と '+((p[0]+1)/2-p[1])+'／'+((p[0]+1)/2+p[1])]]),
    calc:'左端1 ← Ⅲの前は'+p[0]+'。そこからⅡ・Ⅰを逆にたどると、最初は '+a.join('、'),v:{p:p}});},
  function(v){return rg(1,v.p[0]).filter(function(s){return has(v86(v.p,s),1);}).map(String);});

/* ===== 問87 円卓6席 ===== */
var SE=['①','②','③','④','⑤','⑥'];
var S87=lazy(function(){return perms([0,1,2,3,4,5]).filter(function(x){/* x[i]＝NM5P…の席（0P 1Q 2R 3S 4T 5U） */var d=Math.abs(x[2]-x[3]);return (x[0]+3)%6===x[1]&&(d===1||d===5);});});
function f87(r){return T(['','①','②','③','④','⑤','⑥'],r.map(function(x,i){var row=[String(i+1)];rg(0,5).forEach(function(k){row.push('PQRSTU'[x.indexOf(k)]);});return row;}));}
var Q87='P、Q、R、S、T、Uの6人が、円いテーブル席①〜⑥に座っている。各自の席の位置について、次のことがわかっている。<br>'+cd(['PとQは向かい合わせである','RとSは隣り合っている'])+'<br>（席は①〜⑥の順に円く並んでいる）<br>※向かい合わせの席は①と④、②と⑤、③と⑥<br><br>';
function v87(fix,fv,ask){var o={};/* Pの席から決めて、Qは向かい、残り4席にR・S・T・Uを置く */for(var P=0;P<6;P++){var Q=(P+3)%6,rest=rg(0,5).filter(function(k){return k!==P&&k!==Q;});
  perms(rest).forEach(function(z){var x=[P,Q,z[0],z[1],z[2],z[3]];if((x[2]-x[3]+6)%6!==1&&(x[3]-x[2]+6)%6!==1)return;if(x[fix]!==fv)return;o[x[ask]]=1;});}return Object.keys(o).map(function(k){return SE[k];});}
function m87(id,fix,ask,orig){tp(6,id,'87',function(R){var s=R.pick([0,1,2,3,4,5,orig,orig]),r=S87().filter(function(x){return x[fix]===s;}),a=uq(r.map(function(x){return x[ask];})),c=SE.filter(function(z,i){return i!==s;}),N='PQRSTU';
  if(a.length>=5)return null;
  return O('87',Q87+N[fix]+'が'+SE[s]+'の席のとき、'+N[ask]+'はどの席か。当てはまるものをすべて選びなさい。',c,a.map(function(i){return SE[i];}),
   {inw:'「PとQ」は向かい合わせのセット、「RS」は隣のセット<br>'+N[fix]+' ＝ '+SE[s],fig:f87(r),calc:'向かい合わせの3組（①④、②⑤、③⑥）のどれがPとQかで場合分けして書き出すと'+r.length+'通り（表は8通りまで）。'+N[ask]+'は '+a.map(function(i){return SE[i];}).join(''),v:{f:fix,s:s,a:ask}});},
  function(v){return v87(v.f,v.s,v.a);});}
m87('87-1',3,0,1);m87('87-2',5,2,5);
/* ===== 解き方（新しい型）：推論 指標6に追加 ===== */
var LS=(LESSON['推論']=LESSON['推論']||{});LS[6]=LS[6]||[];
[
 {h:'例題（整数：合計から決まっている数を引く）',q:'赤、黄色、白のチューリップを各1本以上、全部で<mark>15本</mark>買った。これについて、次のことがわかっている。<br>Ⅰ　赤を<mark>5本以上</mark>買った<br>Ⅱ　黄色と白の差は<mark>3本</mark>だった<br><br>赤、白、黄色の順で本数が多い場合、白は何本か。当てはまるものをすべて選びなさい。'},
 {h:'ステップ1 条件を式に直す',p:'「全部で<mark>15本</mark>」は 赤＋黄＋白 ＝ 15。<br>Ⅱと「白が黄色より多い」から 白 ＝ 黄 ＋ <mark>3</mark>。<br>Ⅰは 赤 ≧ <mark>5</mark>、問いの条件は 赤 ＞ 白。',fig:T(['式','意味'],[['赤＋黄＋白 ＝ 15','合計'],['白 ＝ 黄 ＋ 3','差'],['赤 ≧ 5、赤 ＞ 白','大小']])},
 {h:'ステップ2 いちばん少ない数から表に書き出す',p:'黄を1から順に入れる。白 ＝ 黄＋3、赤 ＝ 15 −（黄＋白）＝ 15 − 2 × 黄 − 3。',fig:T(['黄','白 ＝ 黄＋3','赤 ＝ 12 − 2×黄','赤 ＞ 白'],[['1','4','10','○'],['2','5','8','○'],['3','6','6','×'],['4','7','4','×']])},
 {h:'ステップ3 条件で消して残りを見る',p:'赤 ＞ 白 と 赤 ≧ 5 を満たすのは 黄1・黄2 の2行。白は 4本 と 5本。'},
 {h:'答え',p:'4本、5本'},
 {h:'例題（平均：平均 × 個数 ＝ 合計）',q:'<mark>50個</mark>のリンゴをP、Q、R、S、Tという5人に配った。配られた個数について、次のことがわかっている。<br>Ⅰ　同じ個数の人はいない<br>Ⅱ　P、Q、Rの平均は<mark>12個</mark>である<br>Ⅲ　PとRは<mark>11個</mark>差である<br>Ⅳ　QとS、QとTはそれぞれ<mark>3個</mark>差である<br><br>10個配られた人はだれか。当てはまるものをすべて選びなさい。'},
 {h:'ステップ1 平均を合計に直す',p:'平均の図は ①平均 × ②個数 ＝ ③合計。<br>「P、Q、Rの平均は<mark>12個</mark>」→ ③ ＝ 12 × 3 ＝ 36。',fig:T(['','①平均','②個数','③合計 ＝ ①×②'],[['P・Q・R','12','3','!36'],['5人','10','5','50']])},
 {h:'ステップ2 差の条件を式にする',p:'SとTはQより3個多いか少ない。同じ個数はないので、片方が Q−3、もう片方が Q＋3 → S＋T ＝ 2 × Q。<br>S＋T ＝ 50 − 36 ＝ 14 なので Q ＝ 7、SとTは 4 と 10。'},
 {h:'ステップ3 空白を埋める',p:'P＋R ＝ 36 − 7 ＝ 29、差は11 → 少ない方 ＝（29 − 11）÷ 2 ＝ 9、多い方 ＝ 20。<br>10個はSかT（どちらかは決まらない）。',fig:T(['','P・R','Q','S・T'],[['個数','9と20','7','!4と10']])},
 {h:'答え',p:'S、T'},
 {h:'例題（%：仮の数を置く）',q:'甲、乙、丙3つの容器に入れた食塩水の濃度は、甲<mark>10%</mark>、乙<mark>20%</mark>、丙<mark>30%</mark>である。甲と乙は同じ重さであり、丙は甲の<mark>2倍</mark>の重さである。<br>ア　甲と丙の食塩水を混ぜると、乙と同じ濃度になる'},
 {h:'ステップ1 重さを仮の数で置く',p:'重さがわからないときは、甲・乙を<b>100g</b>、丙を<b>200g</b>と置く（人口密度なら面積を1や3と置く）。'},
 {h:'ステップ2 表に入れる',p:'①食塩水 × ②濃度 ＝ ③食塩。割合の図と同じ「③ ＝ ① × ②」。',fig:T(['','①食塩水','②濃度','③食塩 ＝ ①×②'],[['甲','100','0.1','10'],['丙','200','0.3','60'],['甲＋丙','300','!?','70']])},
 {h:'ステップ3 空白を埋める',p:'② ＝ ③ ÷ ① ＝ 70 ÷ 300 ＝ 約23.3% → 乙の20%と違う。数値が決まるので「誤り」（重さが不明で答えが変わるときだけ「どちらともいえない」）。'},
 {h:'答え',p:'アは誤り'},
 {h:'例題（位置関係：距離をマスに直す）',q:'A〜Fの6枚の絵画が横一列に並び、隣り合う絵画の中心同士の距離は<mark>5m</mark>である。<br>Ⅰ　EはDより東にある<br>Ⅱ　AとBの距離は<mark>5m</mark>である<br>Ⅲ　CとDの距離は<mark>10m</mark>である<br>AとCの距離が<mark>20m</mark>のとき、Dの位置はどこか。'},
 {h:'ステップ1 mを「何マス離れているか」に直す',p:'5m ＝ 1マス。AとB：1マス、CとD：2マス、AとC：4マス。'},
 {h:'ステップ2 いちばん離れたセットから置く',p:'AとCは4マス差 → (1,5)(2,6)(5,1)(6,2) の4通り。Bは Aの隣、Dは Cから2マス、EはDより東。',fig:T(['','1','2','3','4','5','6'],[['①','A','B','D','E','C',''],['②','B','A','','D','E','C'],['③','C','','D','E','A','B'],['④','','C','','D','B','A']])},
 {h:'ステップ3 条件で消す',p:'④はDの東にEが置けないので消す。残りの①〜③で、Dは 3番目 か 4番目。'},
 {h:'答え',p:'西から3番目、4番目'},
 {h:'まとめ（問題集の推論の型）',p:'整数：合計から決まった数を引き、少ない数から表に書き出す。平均：①平均 × ②個数 ＝ ③合計 に直す。%：わからない重さ・面積は100や1と置き、③ ＝ ① × ② の表で比べる。位置関係：セットを作り、距離はマスに直して、いちばん動きの少ないものから置く。'}
].forEach(function(x){LS[6].push(x);});
})();
