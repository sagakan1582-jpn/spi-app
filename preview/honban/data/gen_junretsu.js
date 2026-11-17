/* 順列・組合せ：数値を変える問題（テンプレート）。元の問題の文・構造・難易度はそのままで、数値だけ毎回変える。
   図の関数（JT・JT4・DT4・JT5・OB5）は junretsu_3〜5.js のものを使う。 */
(function(){
var F='順列・組合せ';if(!BANK[F])return;
function fa(n){return n<=1?1:n*fa(n-1);}
function P(n,r){var x=1;for(var i=0;i<r;i++)x*=n-i;return x;}
function C(n,r){return r<0||r>n?0:P(n,r)/fa(r);}
function Ps(n,r){var a=[];for(var i=0;i<r;i++)a.push(n-i);return n+'P'+r+' ＝ '+(r>1?a.join(' × ')+' ＝ ':'')+P(n,r);}
function Cs(n,r){if(r===0||r===n)return n+'C'+r+' ＝ 1';if(r===1)return n+'C1 ＝ '+n;var a=[],b=[];for(var i=0;i<r;i++){a.push(n-i);b.push(r-i);}return n+'C'+r+' ＝ ('+a.join(' × ')+') ÷ ('+b.join(' × ')+') ＝ '+C(n,r);}
function ch(ans,wr,u){var s=[ans];wr.forEach(function(w){if(w>0&&w%1===0&&s.indexOf(w)<0&&s.length<5)s.push(w);});
 var d=Math.max(1,Math.round(ans/5)),k=1;while(s.length<5){[ans+d*k,ans-d*k].forEach(function(w){if(w>0&&s.indexOf(w)<0&&s.length<5)s.push(w);});k++;}
 s.sort(function(x,y){return x-y;});return {c:s.map(function(v){return v+u;}),a:s.indexOf(ans)};}
var CUR=null;function VV(v){CUR=v;}
function out(q,ans,wr,u,inw,fig,calc,ex){var o=ch(ans,wr,u);o.v=CUR;CUR=null;o.q=q;o.inw=inw;o.fig=fig;o.calc=calc;if(ex)for(var k in ex)o[k]=ex[k];return o;}
function nm(n){return 'ABCDEFGHIJ'.slice(0,n).split('').join('、');}
function dl(a,b){var x=[];for(var i=a;i<=b;i++)x.push(i);return x.join('、');}
function add(l,st,id,mk){if(BANK[F][l])BANK[F][l][st].push({id:id,make:mk,verify:VJ});}
function two(n){var a=[];for(var i=0;i<n;i++)a.push(2);return a.join(' × ');}

/* ===== 指標3 ===== */
function sP(q,n,r,u,inw){VV({t:'P',n:n,r:r});return out(q,P(n,r),[C(n,r),n*r,Math.pow(n,r),P(n,r-1),P(n+1,r)],'通り',inw,JT([[n+u,r+u,'あり','!'+n+'P'+r]]),Ps(n,r));}
function sC(q,n,r,u,inw,un){VV({t:'C',n:n,r:r,u:un});return out(q,C(n,r),[P(n,r),n*r,C(n,r)*2,C(n+1,r),C(n,r-1)],un||'通り',inw,JT([[n+u,r+u,'なし','!'+n+'C'+r]]),Cs(n,r));}
function sF(q,n,u,inw){VV({t:'P',n:n,r:n});return out(q,fa(n),[n*(n-1),n*n,fa(n-1),fa(n)/2,fa(n)*2],'通り',inw,JT([[n+u,n+u,'あり','!'+n+'P'+n]]),Ps(n,n));}
function sMF(q,a,ra,b,rb){var x=C(a,ra),y=C(b,rb),ans=x*y;
 VV({t:'CC',a:a,ra:ra,b:b,rb:rb});return out(q,ans,[x+y,C(a+b,ra+rb),P(a,ra)*P(b,rb),a*b,C(a+b,2)],'通り','男子からの選び方と女子からの選び方を掛け合わせる',
  JT([['男子'+a+'人',ra+'人','なし',a+'C'+ra],['女子'+b+'人',rb+'人','なし',b+'C'+rb],['計','','','!'+(ra===1&&rb===1?a+' × '+b:x+' × '+y)]]),
  ra===1&&rb===1?a+'C1 × '+b+'C1 ＝ '+a+' × '+b+' ＝ '+ans:Cs(a,ra)+'<br>'+Cs(b,rb)+'<br>'+x+' × '+y+' ＝ '+ans);}
var S3={
 concept:[
  function(R){var n=R.int(4,6);return sP(nm(n)+'の'+n+'人の中から、委員長と副委員長を1人ずつ選ぶ。選び方は何通りあるか。',n,2,'人',n+'人から2人を選び、委員長・副委員長の順番をつける');},
  function(R){var n=R.int(4,6);return sC(nm(n)+'の'+n+'人の中から、掃除当番を2人選ぶ。選び方は何通りあるか。',n,2,'人',n+'人から2人を選ぶだけで、順番はない');},
  function(R){var n=R.int(3,4);return sF(nm(n)+'の'+n+'人が横一列に並ぶ。並び方は何通りあるか。',n,'人',n+'人全員を選んで並べる');}
 ],
 practice:[
  function(R){var n=R.int(4,7);return sP(n+'人の中から、リレーの第1走者、第2走者、第3走者を1人ずつ選ぶ。選び方は何通りあるか。',n,3,'人',n+'人から3人を選び、走る順番をつける');},
  function(R){var n=R.int(5,8);return sC(n+'人の中から、代表を3人選ぶ。選び方は何通りあるか。',n,3,'人',n+'人から3人を選ぶだけで、順番はない');},
  function(R){var n=R.int(4,6);return sF('異なる'+n+'冊の本を、本棚に横一列に並べる。並べ方は何通りあるか。',n,'冊',n+'冊全部を選んで並べる');},
  function(R){var n=R.int(5,9);return sP(n+'人の中から、議長と書記を1人ずつ選ぶ。選び方は何通りあるか。',n,2,'人',n+'人から2人を選び、議長・書記の順番をつける');},
  function(R){var n=R.int(5,9);return sC(n+'種類のケーキの中から、異なる2種類を選んで買う。選び方は何通りあるか。',n,2,'種類',n+'種類から2種類を選ぶだけで、順番はない');},
  function(R){var a=R.int(2,6),b=R.int(2,6);return sMF('男子'+a+'人、女子'+b+'人の中から、男子1人と女子1人を選ぶ。選び方は何通りあるか。',a,1,b,1);}
 ],
 applied:[
  function(R){var n=R.int(5,8);return sP(n+'人の中から、会長、副会長、会計を1人ずつ選ぶ。選び方は何通りあるか。',n,3,'人',n+'人から3人を選び、役職の順番をつける');},
  function(R){var n=R.int(6,12);return sC(n+'人の中から、委員を2人選ぶ。選び方は何通りあるか。',n,2,'人',n+'人から2人を選ぶだけで、順番はない');},
  function(R){var n=R.int(4,6);return sF(n+'人が横一列に並んで写真を撮る。並び方は何通りあるか。',n,'人',n+'人全員を選んで並べる');},
  function(R){var n=R.int(6,9);return sC(n+'人の中から、清掃当番を3人選ぶ。選び方は何通りあるか。',n,3,'人',n+'人から3人を選ぶだけで、順番はない');},
  function(R){var n=R.int(6,12);return sP(n+'チームが参加する大会で、1位と2位が決まった。1位と2位の決まり方は何通りあるか。ただし、同じ順位のチームはないものとする。',n,2,'チーム',n+'チームから2チームを選び、1位・2位の順番をつける');},
  function(R){var n=R.int(6,12);return sC(n+'チームが総当たり戦（どのチームとも1回ずつ対戦する）を行う。試合は全部で何試合あるか。',n,2,'チーム','1試合は'+n+'チームから対戦する2チームを選ぶこと。順番はない','試合');},
  function(R){var a=R.int(4,6),b=R.int(3,6);return sMF('男子'+a+'人、女子'+b+'人の中から、男子2人と女子1人を選ぶ。選び方は何通りあるか。',a,2,b,1);},
  function(R){var n=R.int(4,7);return sP(dl(1,n)+'の数字が1つずつ書かれた'+n+'枚のカードから3枚を選んで並べ、3桁の整数をつくる。整数は何通りできるか。',n,3,'枚',n+'枚から3枚を選び、百の位・十の位・一の位の順番をつける');}
 ],
 real:[
  function(R){var n=R.int(7,10);return sP(n+'人の中から、部長、副部長、会計を1人ずつ選ぶ。選び方は何通りあるか。',n,3,'人',n+'人から3人を選び、役職の順番をつける');},
  function(R){var n=R.int(9,14);return sC(n+'人の中から、代表を3人選ぶ。選び方は何通りあるか。',n,3,'人',n+'人から3人を選ぶだけで、順番はない');},
  function(R){var n=R.int(5,7);return sF(n+'人が横一列に並ぶ。並び方は何通りあるか。',n,'人',n+'人全員を選んで並べる');},
  function(R){var n=R.int(8,11);return sC(n+'人の中から、委員を4人選ぶ。選び方は何通りあるか。',n,4,'人',n+'人から4人を選ぶだけで、順番はない');},
  function(R){var a=R.int(4,7),b=R.int(4,6);return sMF('男子'+a+'人、女子'+b+'人の中から、男子2人と女子2人を選ぶ。選び方は何通りあるか。',a,2,b,2);},
  function(R){var n=R.int(6,10),x=C(n-1,2),ans=n*x;
   VV({t:'chair',n:n});return out(n+'人の中から、議長を1人と書記を2人選ぶ。選び方は何通りあるか。',ans,[P(n,3),C(n,3),n*P(n-1,2),n*(n-1),C(n,3)*2],'通り','先に議長を選び、残りの人から書記を選ぶ。2つの選び方を掛け合わせる',
    JT([[n+'人','議長1人','なし',n+'C1'],['残り'+(n-1)+'人','書記2人','なし',(n-1)+'C2'],['計','','','!'+n+' × '+x]]),n+'C1 ＝ '+n+'<br>'+Cs(n-1,2)+'<br>'+n+' × '+x+' ＝ '+ans);},
  function(R){var n=R.int(6,9);return sP('1から'+n+'までの数字が1つずつ書かれた'+n+'枚のカードから3枚を選んで並べ、3桁の整数をつくる。整数は何通りできるか。',n,3,'枚',n+'枚から3枚を選び、百の位・十の位・一の位の順番をつける');},
  function(R){var n=R.int(10,20);return sC(n+'チームが総当たり戦（どのチームとも1回ずつ対戦する）を行う。試合は全部で何試合あるか。',n,2,'チーム','1試合は'+n+'チームから対戦する2チームを選ぶこと。順番はない','試合');},
  function(R){var n=R.int(5,7);return sP(nm(n)+'の'+n+'人の中からリレーの走者を4人選び、走る順番も決める。選び方は何通りあるか。',n,4,'人',n+'人から4人を選び、走る順番をつける');},
  function(R){var n=R.int(5,8),cl=['赤','青','黄','緑','白','黒','茶','紫'].slice(0,n).join('、');return sC(cl+'の'+n+'色の中から、異なる3色を選ぶ。選び方は何通りあるか。',n,3,'色',n+'色から3色を選ぶだけで、順番はない');}
 ]};

/* ===== 指標4 ===== */
function sEx(q,n,m,k,lbN,lbM,inw,u){var useP=u==='P',f=useP?P:C,L=useP?'P':'C',a=f(n,k),b=f(m,k),ans=a-b;
 VV({t:'EX',n:n,m:m,k:k,o:useP});return out(q,ans,[a,b,a+b,useP?C(n,k)-C(m,k):a-b-1,useP?P(n,k)-P(n-m,k):C(n-m,k)],'通り',inw,
  JT4([[lbN,k+lbN.replace(/^.*?\d+/,''),useP?'あり':'なし',n+L+k],[lbM,k+lbN.replace(/^.*?\d+/,''),useP?'あり':'なし',m+L+k],['計','','','!'+n+L+k+' − '+m+L+k]]),
  n+L+k+' ＝ '+a+'、'+m+L+k+' ＝ '+b+'<br>'+a+' − '+b+' ＝ '+ans);}
function sSex(R,a,b,k,need){var n=a+b,ot=need==='女子'?'男子':'女子',m=need==='女子'?a:b;
 return sEx('男子'+a+'人、女子'+b+'人の'+n+'人の中から、'+k+'人を選ぶ。少なくとも1人は'+need+'が選ばれる選び方は何通りあるか。',n,m,k,n+'人',ot+m+'人',
  '全ての選び方から、'+need+'が1人も選ばれない（'+ot+'だけの）選び方を引く');}
function sCoin(n,k){var ans=C(n,k);VV({t:'coin',n:n,k:k});return out('1枚の硬貨を'+n+'回投げる。表がちょうど'+k+'回出る出方は何通りあるか。',ans,[P(n,k),Math.pow(2,n),n*k,C(n,k-1),2*ans],'通り',n+'回のうち、表が出る'+k+'回を選ぶ',
  JT4([[n+'回',k+'回','なし','!'+n+'C'+k]]),k>n-k?n+'C'+k+' ＝ '+Cs(n,n-k):Cs(n,k));}
function sZero3(m){var ans=m*m*(m-1);VV({t:'dig',lo:0,hi:m,r:3,c:'any'});return out(dl(0,m)+'の'+(m+1)+'枚のカードから3枚を選んで並べ、3桁の整数をつくる。3桁の整数は何通りできるか。',ans,[P(m+1,3),P(m,3),m*m*m,(m+1)*m*(m-1)-m,m*(m-1)*(m-1)],'通り','百の位には0を使えないので、百の位から決める',
  DT4(['','百の位','十の位','一の位','計'],[['入るカード','0以外の'+m+'枚','残り'+m+'枚','残り'+(m-1)+'枚','!'+m+' × '+m+' × '+(m-1)]]),m+' × '+m+' × '+(m-1)+' ＝ '+ans);}
function sFive(n,d){var r=d-1,ans=P(n-1,r),pl=d===3?'百の位・十の位':'千の位・百の位・十の位';
 VV({t:'dig',lo:1,hi:n,r:d,c:'m5'});return out(dl(1,n)+'の'+n+'枚のカードから'+d+'枚を選んで並べ、'+d+'桁の整数をつくる。5の倍数は何通りできるか。',ans,[P(n,d),C(n-1,r),P(n,r),Math.pow(n-1,r),P(n-1,r-1)],'通り','一の位を5に決め、残りの'+(n-1)+'枚で'+pl.replace(/・(?=[^・]*$)/,'と')+'を決める',
  DT4(['','一の位',pl,'計'],[['入るカード','5','残り'+(n-1)+'枚から'+r+'枚','!1 × '+(n-1)+'P'+r]]),Ps(n-1,r));}
function sAB(q,n,k,u,other,inw){var a=C(n,k),b=C(n-2,k),ans=a-b;
 VV({t:'AB',n:n,k:k});return out(q,ans,[a,b,C(n-2,k-1),2*C(n-1,k-1),C(n-1,k-1)],'通り',inw,
  JT4([[n+u,k+u,'なし',n+'C'+k],[other+(n-2)+u,k+u,'なし',(n-2)+'C'+k],['計','','','!'+n+'C'+k+' − '+(n-2)+'C'+k]]),n+'C'+k+' ＝ '+a+'、'+(n-2)+'C'+k+' ＝ '+b+'<br>'+a+' − '+b+' ＝ '+ans);}
function sEnds(n){var ans=2*fa(n-2);VV({t:'ends',n:n});return out('A、Bを含む'+n+'人が横一列に並ぶ。AとBが両端に並ぶ並び方は何通りあるか。',ans,[fa(n),fa(n-2),fa(n-1),2*fa(n-1),fa(n-2)*(n-1)],'通り','AとBを両端に固定し（並び方2通り）、残りの'+(n-2)+'人を間に並べる',
  JT4([['A、B','2人','あり','2P2'],['残り'+(n-2)+'人',(n-2)+'人','あり',(n-2)+'P'+(n-2)],['計','','','!2P2 × '+(n-2)+'P'+(n-2)]]),'2 × '+fa(n-2)+' ＝ '+ans);}
function sFix(q,n,pos){var ans=fa(n-1);VV({t:'fix',n:n,p:pos==='左端'?1:+pos.match(/\d+/)[0]});return out(q,ans,[fa(n),fa(n-2),fa(n)/2,(n-1)*(n-1),n*fa(n-2)],'通り','Aを'+pos+'に固定し、残りの'+(n-1)+'人を並べる',
  JT4([['A','1人',pos,'1'],['残り'+(n-1)+'人',(n-1)+'人','あり',(n-1)+'P'+(n-1)],['計','','','!1 × '+(n-1)+'P'+(n-1)]]),Ps(n-1,n-1));}
var S4={
 concept:[
  function(R){return sSex(R,R.int(3,5),R.int(2,3),2,'女子');},
  function(R){var n=R.int(4,5);return sFix(nm(n)+'の'+n+'人が横一列に並ぶ。Aが左端に並ぶ並び方は何通りあるか。',n,'左端');},
  function(R){var n=R.int(4,6),e=Math.floor(n/2),ev=[];for(var i=2;i<=n;i+=2)ev.push(i);var ans=e*(n-1);
   VV({t:'dig',lo:1,hi:n,r:2,c:'even'});return out(dl(1,n)+'の'+n+'枚のカードから2枚を選んで並べ、2桁の整数をつくる。偶数は何通りできるか。',ans,[P(n,2),e*n,e*e,(n-e)*(n-1),P(n,2)/2],'通り','一の位を先に決め、残りのカードで十の位を決める',
    DT4(['','一の位','十の位','計'],[['入るカード',ev.join('、'),'残り'+(n-1)+'枚','!'+e+' × '+(n-1)]]),'一の位 '+e+'通り、十の位 '+(n-1)+'通り<br>'+e+' × '+(n-1)+' ＝ '+ans);}
 ],
 practice:[
  function(R){var n=R.int(4,6);return sCoin(n,R.int(2,n-2));},
  function(R){return sZero3(R.int(3,5));},
  function(R){var n=R.int(5,7),k=R.int(2,3);return sAB('A、Bを含む'+n+'人の中から、'+k+'人の委員を選ぶ。AとBのうち少なくとも1人が選ばれる選び方は何通りあるか。',n,k,'人','A、B以外の','全ての選び方から、AもBも選ばれない選び方を引く');},
  function(R){return sEnds(R.int(4,6));},
  function(R){var a=R.int(3,6),b=R.int(3,5);if(a===b)a++;var x=C(a,2),y=C(b,2),ans=x+y;
   VV({t:'either',a:a,b:b});return out('ある店では、ケーキが'+a+'種類、プリンが'+b+'種類売られている。異なるケーキを2種類買うか、異なるプリンを2種類買うかのどちらかにする。選び方は何通りあるか。',ans,[x*y,C(a+b,2),a*b,P(a,2)+P(b,2),a+b],'通り','「ケーキを2種類」と「プリンを2種類」に場合分けし、足す',
    JT4([['ケーキ'+a+'種類','2種類','なし',a+'C2'],['プリン'+b+'種類','2種類','なし',b+'C2'],['計','','','!'+a+'C2 ＋ '+b+'C2']]),a+'C2 ＝ '+x+'、'+b+'C2 ＝ '+y+'<br>どちらか一方なので足す　'+x+' ＋ '+y+' ＝ '+ans);},
  function(R){return sFive(R.int(5,7),3);}
 ],
 applied:[
  function(R){return sSex(R,R.int(4,5),R.int(2,4),3,'女子');},
  function(R){var n=R.int(5,7),j=R.int(2,3);return sFix('Aを含む'+n+'人が横一列に並ぶ。Aが左から'+j+'番目に並ぶ並び方は何通りあるか。',n,'左から'+j+'番目');},
  function(R){var m=R.int(4,6),e=Math.floor(m/2),z=m*(m-1),w=e*(m-1)*(m-1),ans=z+w,el=e===2?'2か4':'2、4か6';
   VV({t:'dig',lo:0,hi:m,r:3,c:'even'});return out(dl(0,m)+'の'+(m+1)+'枚のカードから3枚を選んで並べ、3桁の整数をつくる。偶数は何通りできるか。',ans,[(e+1)*m*(m-1),(e+1)*(m-1)*(m-1),z,w,m*m*(m-1)-ans],'通り','一の位が0のときと、'+el+'のときに場合分けし、足す',
    DT4(['一の位','百の位','十の位','通り'],[['0','残り'+m+'枚','残り'+(m-1)+'枚',m+' × '+(m-1)+' ＝ '+z],[el+'（'+e+'通り）','0以外の残り'+(m-1)+'枚','残り'+(m-1)+'枚',e+' × '+(m-1)+' × '+(m-1)+' ＝ '+w],['計','','','!'+z+' ＋ '+w]]),
    '一の位0　'+m+' × '+(m-1)+' ＝ '+z+'<br>一の位'+el+'　'+e+' × '+(m-1)+' × '+(m-1)+' ＝ '+w+'<br>'+z+' ＋ '+w+' ＝ '+ans);},
  function(R){var n=R.int(5,6);return sCoin(n,3);},
  function(R){var n=R.int(5,7);return sAB('P国、Q国を含む'+n+'か国の中から、旅行先を3か国選ぶ。P国とQ国のうち少なくとも一方を選ぶ選び方は何通りあるか。',n,3,'か国','P、Q以外の','全ての選び方から、P国もQ国も選ばない選び方を引く');},
  function(R){var a=R.int(4,5),b=R.int(2,3),k=R.int(b+1,a),t=C(a+b,k),x=C(a,k),ans=t-x;
   VV({t:'both',a:a,b:b,k:k});return out('計算問題が'+a+'問、文章問題が'+b+'問ある。この'+(a+b)+'問の中から'+k+'問を選んで解く。計算問題と文章問題を、それぞれ1問以上選ぶ選び方は何通りあるか。',ans,[t,x,t-2,a*b*C(a+b-2,k-2),C(a,k-1)*b],'通り','全ての選び方から、計算問題だけの選び方を引く（文章問題だけで'+k+'問は選べない）',
    JT4([[(a+b)+'問',k+'問','なし',(a+b)+'C'+k],['計算問題'+a+'問',k+'問','なし',a+'C'+k],['計','','','!'+(a+b)+'C'+k+' − '+a+'C'+k]]),(a+b)+'C'+k+' ＝ '+t+'、'+a+'C'+k+' ＝ '+x+'<br>'+t+' − '+x+' ＝ '+ans);},
  function(R){var n=R.int(4,6),ans=2*fa(n-1);
   VV({t:'adj',n:n});return out('A、Bを含む'+n+'人が横一列に並ぶ。AとBが隣り合う並び方は何通りあるか。',ans,[fa(n),fa(n-1),fa(n)-ans,2*fa(n-2),fa(n)/2],'通り','AとBをひとまとまりにして'+(n-1)+'つを並べ、まとまりの中のAとBの並び方を掛ける',
    JT4([['AB＋'+(n-2)+'人',(n-1)+'つ','あり',(n-1)+'P'+(n-1)],['AとB','2人','あり','2P2'],['計','','','!'+(n-1)+'P'+(n-1)+' × 2P2']]),(n-1)+'P'+(n-1)+' ＝ '+fa(n-1)+'、2P2 ＝ 2<br>'+fa(n-1)+' × 2 ＝ '+ans);},
  function(R){var n=R.int(5,6),t=R.int(2,4),h=n-t+1,ans=h*P(n-1,2);
   VV({t:'dig',lo:1,hi:n,r:3,c:'gt',g:t*100});return out(dl(1,n)+'の'+n+'枚のカードから3枚を選んで並べ、3桁の整数をつくる。'+(t*100)+'より大きい整数は何通りできるか。',ans,[P(n,3),(h-1)*P(n-1,2),h*C(n-1,2),h*(n-1)*(n-1),P(n,3)-ans],'通り','百の位を'+dl(t,n)+'のどれかに決め、残りの'+(n-1)+'枚で十の位と一の位を決める',
    DT4(['','百の位','十の位・一の位','計'],[['入るカード',dl(t,n),'残り'+(n-1)+'枚から2枚','!'+h+' × '+(n-1)+'P2']]),h+' × '+(n-1)+'P2 ＝ '+h+' × '+P(n-1,2)+' ＝ '+ans);}
 ],
 real:[
  function(R){var b=R.int(4,5),k=R.int(3,b);return sSex(R,R.int(4,6),b,k,'男子');},
  function(R){return sEnds(R.int(6,8));},
  function(R){return sZero3(R.int(5,7));},
  function(R){return sFive(R.int(5,7),4);},
  function(R){return sCoin(R.int(6,7),R.int(2,3));},
  function(R){var n=R.int(7,10),k=R.int(3,4),ans=C(n-1,k-1);
   VV({t:'must',n:n,k:k});return out('Pを含む'+n+'種類の花の中から、異なる'+k+'種類を選んで花束をつくる。Pを必ず入れるとき、選び方は何通りあるか。',ans,[C(n,k),C(n-1,k),P(n-1,k-1),C(n,k-1),ans*k],'通り','Pを先に入れ、残りの'+(n-1)+'種類から'+(k-1)+'種類を選ぶ',
    JT4([['P','1種類','なし','1'],['残り'+(n-1)+'種類',(k-1)+'種類','なし',(n-1)+'C'+(k-1)],['計','','','!1 × '+(n-1)+'C'+(k-1)]]),Cs(n-1,k-1));},
  function(R){var m=R.int(5,7),z=P(m,3),w=(m-1)*P(m-1,2),ans=z+w;
   VV({t:'dig',lo:0,hi:m,r:4,c:'m5'});return out(dl(0,m)+'の'+(m+1)+'枚のカードから4枚を選んで並べ、4桁の整数をつくる。5の倍数は何通りできるか。',ans,[2*z,2*w,z,w,m*m*(m-1)*(m-2)],'通り','一の位が0のときと5のときに場合分けし、足す',
    DT4(['一の位','千の位','百の位・十の位','通り'],[['0','残り'+m+'枚','残り'+(m-1)+'枚から2枚',m+' × '+(m-1)+'P2 ＝ '+z],['5','0と5以外の'+(m-1)+'枚','残り'+(m-1)+'枚から2枚',(m-1)+' × '+(m-1)+'P2 ＝ '+w],['計','','','!'+z+' ＋ '+w]]),
    '一の位0　'+m+' × '+(m-1)+' × '+(m-2)+' ＝ '+z+'<br>一の位5　'+(m-1)+' × '+(m-1)+' × '+(m-2)+' ＝ '+w+'<br>'+z+' ＋ '+w+' ＝ '+ans);},
  function(R){var a=R.int(3,5),b=R.int(3,5),n=a+b,x=P(n,2),y=P(a,2),ans=x-y;
   VV({t:'EX',n:n,m:a,k:2,o:true});return out('男子'+a+'人、女子'+b+'人の'+n+'人の中から、委員長と副委員長を1人ずつ選ぶ。少なくとも一方に女子が選ばれる選び方は何通りあるか。',ans,[x,C(n,2)-C(a,2),a*b,x-P(b,2),y],'通り','全ての選び方から、2人とも男子の選び方を引く',
    JT4([[n+'人','2人','あり',n+'P2'],['男子'+a+'人','2人','あり',a+'P2'],['計','','','!'+n+'P2 − '+a+'P2']]),n+'P2 ＝ '+x+'、'+a+'P2 ＝ '+y+'<br>'+x+' − '+y+' ＝ '+ans);},
  function(R){var n=R.int(4,6),e=['木','金','土'][n-4],x=fa(n),y=fa(n-1),ans=x-y;
   VV({t:'day',n:n});return out('月曜日から'+e+'曜日までの'+n+'日間に、Aを含む'+n+'人が1日に1人ずつ当番をする。Aが月曜日以外の日に当番をする割り当て方は何通りあるか。',ans,[x,y,x-1,x/2,(n-1)*(n-1)],'通り','全ての割り当て方から、Aが月曜日の割り当て方を引く',
    JT4([[n+'人',n+'人','あり',n+'P'+n],['Aを月曜日に固定',(n-1)+'人','あり',(n-1)+'P'+(n-1)],['計','','','!'+n+'P'+n+' − '+(n-1)+'P'+(n-1)]]),n+'P'+n+' ＝ '+x+'、'+(n-1)+'P'+(n-1)+' ＝ '+y+'<br>'+x+' − '+y+' ＝ '+ans);},
  function(R){var W=['月','火','水','木','金'],o=R.int(1,2),s=R.shuffle(W),cm=s.slice(0,o),E=cm.concat(s.slice(o,3)),S=cm.concat(s.slice(3,3+3-o));
   function od(a){return a.slice().sort(function(x,y){return W.indexOf(x)-W.indexOf(y);});}
   E=od(E);S=od(S);cm=od(cm);var ans=9-o,dy=function(a){return a.map(function(d){return d+'曜日';});};
   VV({t:'es',E:E,S:S});return out('Pさんは、英会話と水泳の教室に週1回ずつ通う。英会話は'+dy(E).join('、')+'のいずれか、水泳は'+dy(S).join('、')+'のいずれかを選ぶ。2つの教室が同じ曜日にならない選び方は何通りあるか。',ans,[9,6,9-2*o,o===1?7:8,5],'通り','全ての選び方から、同じ曜日になる選び方（'+dy(cm).join('・')+'）を引く',
    DT4(['','英会話','水泳','通り'],[['全て',E.join('・'),S.join('・'),'3 × 3 ＝ 9'],['同じ曜日',cm.join('か'),'英会話と同じ日',String(o)],['計','','','!9 − '+o]]),'全て 3 × 3 ＝ 9<br>同じ曜日は'+dy(cm).join('・')+'の'+o+'通り<br>9 − '+o+' ＝ '+ans);}
 ]};

/* ===== 指標5 ===== */
function sCir(q,n){var ans=fa(n-1);VV({t:'cir',n:n});return out(q,ans,[fa(n),fa(n)/2,fa(n-2),ans/2,n*n],'通り','まず一列に並べ、回転して同じになる'+n+'通りを1通りにする',
  JT5([[n+'人',n+'人','あり',n+'P'+n],['回転で同じ','','','÷ '+n],['計','','','!'+n+'P'+n+' ÷ '+n]]),n+'P'+n+' ＝ '+fa(n)+'<br>'+fa(n)+' ÷ '+n+' ＝ '+ans);}
/* ○と｜：k個をt種類に、1種類に少なくともm個 */
function sOB(q,k,t,m,u,uw,inw){var r=k-m*t,pl=r+t-1,ans=C(pl,t-1);
 VV({t:'ob',k:k,s:t,m:m});return out(q,ans,[C(pl-1,t-1),C(pl+1,t-1),C(pl,t),Math.pow(t,Math.min(r,6)),t*k],'通り',inw,
  OB5([[m?'残り':'',r+u,(t-1)+'本',pl+'か所','!'+pl+'C'+(t-1)]]),
  (m?k+' − '+(m>1?m+' × '+t:t)+' ＝ '+r+'（'+u+'）<br>':pl+'か所から｜の場所'+(t-1)+'か所を選ぶ<br>')+pl+'C'+(t-1)+' ＝ '+ans);}
function sGrp(q,s,k,inw){var n=s*k,rows=[],v=[],e=[],pr=1;for(var i=0;i<k;i++){var rm=n-s*i;rows.push([(i?'残り':'')+rm+'人',s+'人','なし',rm+'C'+s]);v.push(C(rm,s));e.push(rm+'C'+s);pr*=C(rm,s);}
 var ans=pr/fa(k);rows.push(['組の区別なし','','','÷ '+k+'!']);rows.push(['計','','','!'+e.join(' × ')+' ÷ '+k+'!']);
 VV({t:'part',s:s,k:k});return out(q,ans,[pr,pr/k,ans*2,C(n,s),ans+v[0]],'通り',inw,JT5(rows),v.join(' × ')+' ＝ '+pr+'<br>'+pr+' ÷ '+fa(k)+' ＝ '+ans);}
function sSame(q,n,a,b,la,u,inw){var d=fa(a)*fa(b),ans=fa(n)/d;
 VV({t:'ms',c:[a,b,n-a-b]});return out(q,ans,[fa(n),fa(n)/fa(a),fa(n)/fa(b),ans*2,ans/2],'通り',inw,
  JT5([[n+u,n+u,'あり',n+'P'+n],[la,'','','÷ ('+a+'P'+a+' × '+b+'P'+b+')'],['計','','','!'+n+'P'+n+' ÷ '+d]]),fa(n)+' ÷ ('+fa(a)+' × '+fa(b)+') ＝ '+ans);}
function sPair(a,b,k){var x=P(a,k),y=P(b,k),pr=x*y,ans=pr/fa(k);
 VV({t:'pair',a:a,b:b,k:k});return out('男子'+a+'人、女子'+b+'人の中から、男子1人と女子1人のペアを'+k+'組つくる。つくり方は何通りあるか。',ans,[pr,C(a,k)*C(b,k),pr/2,a*b,ans*2],'通り','男子を'+k+'人並べ、それぞれの相手の女子を並べる。'+k+'組に区別がないので'+k+'!で割る',
  JT5([['男子'+a+'人',k+'人','あり',a+'P'+k],['女子'+b+'人',k+'人','あり',b+'P'+k],['組の区別なし','','','÷ '+k+'!'],['計','','','!'+a+'P'+k+' × '+b+'P'+k+' ÷ '+k+'!']]),x+' × '+y+' ＝ '+pr+'<br>'+pr+' ÷ '+fa(k)+' ＝ '+ans);}
function sSub(q,n,u,each,none,inw){var t=Math.pow(2,n),ans=t-1;
 VV({t:'sub',n:n});return out(q,ans,[t,n,n*n,fa(n),2*n],'通り',inw,JT5([[n+u,'各2通り','',two(n)],[none,'','','− 1'],['計','','','!2<sup>'+n+'</sup> − 1']]),t+' − 1 ＝ '+ans);}
function sOrd(q,n,j,inw,lab){var d=fa(j),ans=fa(n)/d;
 VV({t:'ord',n:n,j:j});return out(q,ans,[fa(n),fa(n)/2,fa(n)/3,fa(n-1),fa(n-2)].filter(function(x){return x!==ans;}),'通り',inw,
  JT5([[n+'人',n+'人','あり',n+'P'+n],[lab,'','',j===2?'÷ 2':'÷ '+j+'P'+j],['計','','','!'+n+'P'+n+' ÷ '+d]]),n+'P'+n+' ＝ '+fa(n)+'<br>'+fa(n)+' ÷ '+d+' ＝ '+ans);}
var S5={
 concept:[
  function(R){var n=R.int(4,5);return sCir(nm(n)+'の'+n+'人が、円形のテーブルに等間隔に座る。座り方は何通りあるか。ただし、回転して同じになる座り方は1通りと数える。',n);},
  function(R){var k=R.int(3,5);return sOB('リンゴ、ミカン、カキの3種類の果物の中から、合わせて'+k+'個を選ぶ。同じ種類の果物を何個選んでもよく、選ばない種類があってもよい。選び方は何通りあるか。',k,3,0,'個','','果物'+k+'個を○、種類の区切りを｜2本として並べる。左からリンゴ・ミカン・カキ');},
  function(R){var s=R.int(2,3);return sGrp(nm(2*s)+'の'+(2*s)+'人を、'+s+'人ずつの2組に分ける。分け方は何通りあるか。',s,2,'1組目を選ぶと残りが2組目になる。組に区別がないので2!で割る');}
 ],
 practice:[
  function(R){var n=R.int(5,7);return sCir(n+'人が、円形のテーブルに等間隔に座る。座り方は何通りあるか。ただし、回転して同じになる座り方は1通りと数える。',n);},
  function(R){var c=R.int(3,5),u=c+1,ans=fa(c)*2;
   VV({t:'cadj',n:c+2,adj:1});return out('大人2人と子ども'+c+'人の'+(c+2)+'人が、手をつないで輪になる。大人2人が隣り合う並び方は何通りあるか。ただし、回転して同じになる並び方は1通りと数える。',ans,[fa(u)*2,fa(c),fa(u),fa(c+1)-ans,fa(c+2)/(c+2)],'通り','大人2人をひとまとまりにして'+u+'人分を輪に並べ、まとまりの中の並び方を掛ける',
    JT5([['まとまり＋子ども'+c+'人',u+'人','あり',u+'P'+u+' ÷ '+u],['大人2人','2人','あり','2P2'],['計','','','!('+u+'P'+u+' ÷ '+u+') × 2P2']]),u+'P'+u+' ÷ '+u+' ＝ '+fa(u)+' ÷ '+u+' ＝ '+fa(c)+'<br>'+fa(c)+' × 2 ＝ '+ans);},
  function(R){var k=R.int(6,10);return sOB('パン、おにぎり、サンドイッチの3種類の中から、合わせて'+k+'個を買う。どの種類も少なくとも1個は買うものとする。買い方は何通りあるか。',k,3,1,'個','','先に1個ずつ買うと決め、残りの'+(k-3)+'個を○、区切りを｜2本として並べる');},
  function(R){var a=R.int(2,4),b=R.int(2,3),n=a+b,ans=C(n,b);
   VV({t:'ms',c:[a,b]});return out('赤玉'+a+'個と白玉'+b+'個を、横一列に並べる。同じ色の玉は区別しない。並べ方は何通りあるか。',ans,[P(n,b),fa(n),a*b,n,2*ans],'通り',n+'か所から白玉を置く'+b+'か所を選ぶ（残りが赤玉）',
    JT5([[n+'か所',b+'か所','なし',n+'C'+b],['計','','','!'+n+'C'+b]]),n+'C'+b+' ＝ '+ans+'<br>（'+n+'P'+n+' ÷ ('+a+'P'+a+' × '+b+'P'+b+') ＝ '+fa(n)+' ÷ '+(fa(a)*fa(b))+' ＝ '+ans+' でもよい）');},
  function(R){var k=R.int(3,4);return sGrp((2*k)+'人を、2人ずつの'+k+'組に分ける。分け方は何通りあるか。',2,k,'2人ずつ順に選び、組に区別がないので'+k+'!で割る');},
  function(R){var n=R.int(4,6);return sOrd(nm(n)+'の'+n+'人が、縦一列に並ぶ。AがBより前に並ぶ並び方は何通りあるか。',n,2,'全ての並び方のうち、AとBの前後は「Aが前」「Bが前」の2通りが同じ数ずつある','A、Bの前後');}
 ],
 applied:[
  function(R){var n=R.int(5,6);return sCir(n+'人が、円形のテーブルに等間隔に座る。座り方は何通りあるか。ただし、回転して同じになる座り方は1通りと数える。',n);},
  function(R){var t=R.int(3,5),k=R.int(3,5);return sOB(t+'種類のジュースの中から、合わせて'+k+'本を選ぶ。同じ種類のジュースを何本選んでもよく、選ばない種類があってもよい。選び方は何通りあるか。',k,t,0,'本','','ジュース'+k+'本を○、種類の区切りを｜'+(t-1)+'本として並べる');},
  function(R){var k=R.int(5,8);return sOB('同じミカン'+k+'個を、P、Q、Rの3つの箱に分けて入れる。空の箱があってもよい。入れ方は何通りあるか。',k,3,0,'個','','ミカン'+k+'個を○、箱の区切りを｜2本として並べる。左からP・Q・R');},
  function(R){var a=R.int(2,3),b=R.int(2,3),n=a+b+1,L=[];for(var i=0;i<a;i++)L.push('A');for(i=0;i<b;i++)L.push('B');L.push('C');
   return sSame(L.join('、')+'の'+n+'枚のカードを、横一列に並べる。同じ文字のカードは区別しない。並べ方は何通りあるか。',n,a,b,'Aどうし・Bどうし','枚',n+'枚を全て区別して並べ、Aどうし・Bどうしの入れ替えで割る');},
  function(R){return sPair(R.int(3,5),R.int(3,5),2);},
  function(R){var s=R.int(3,4);return sGrp((2*s)+'人を、'+s+'人ずつの2組に分ける。分け方は何通りあるか。',s,2,'1組目の'+s+'人を選ぶと残りが2組目になる。組に区別がないので2!で割る');},
  function(R){var n=R.int(4,7);return sSub(n+'種類のワインの中から、好きなものを試飲する。少なくとも1種類は試飲するものとする。試飲するワインの選び方は何通りあるか。',n,'種類','','全部飲まない','1種類ごとに「飲む」「飲まない」の2通り。全部飲まない1通りを引く');},
  function(R){var a=R.int(4,6),b=R.int(3,5),x=C(a,2),y=C(b,2),ans=x*y;
   VV({t:'CC',a:a,ra:2,b:b,rb:2});return out('洋菓子'+a+'種類の中から2種類、和菓子'+b+'種類の中から2種類を選んで、1つの箱に詰める。選び方は何通りあるか。',ans,[x+y,C(a+b,4),a*b,x*y*2,P(a,2)*y],'通り','洋菓子の選び方と和菓子の選び方を続けて決めるので掛ける',
    JT5([['洋菓子'+a+'種類','2種類','なし',a+'C2'],['和菓子'+b+'種類','2種類','なし',b+'C2'],['計','','','!'+a+'C2 × '+b+'C2']]),x+' × '+y+' ＝ '+ans);}
 ],
 real:[
  function(R){var n=R.int(6,8);return sCir(n+'人が、円形のテーブルに等間隔に座る。座り方は何通りあるか。ただし、回転して同じになる座り方は1通りと数える。',n);},
  function(R){var a=R.int(4,6),n=a+2,al=fa(n-1),adj=fa(n-2)*2,ans=al-adj;
   VV({t:'cadj',n:n,adj:0});return out('男性'+a+'人と女性2人の'+n+'人が、円形のテーブルに等間隔に座る。女性2人が隣り合わない座り方は何通りあるか。ただし、回転して同じになる座り方は1通りと数える。',ans,[al,adj,fa(n)-2*fa(n-1),al-fa(n-2),ans*2],'通り','全ての座り方から、女性2人が隣り合う座り方を引く',
    JT5([[n+'人',n+'人','あり',n+'P'+n+' ÷ '+n],['隣り合う',(n-1)+'人分','あり','('+(n-1)+'P'+(n-1)+' ÷ '+(n-1)+') × 2P2'],['計','','','!'+al+' − '+adj]]),'全て '+fa(n)+' ÷ '+n+' ＝ '+al+'<br>隣り合う '+fa(n-2)+' × 2 ＝ '+adj+'<br>'+al+' − '+adj+' ＝ '+ans,{sec:90});},
  function(R){var k=R.int(7,12);return sOB('3種類のパンの中から、合わせて'+k+'個を選ぶ。同じ種類のパンを何個選んでもよく、選ばない種類があってもよい。選び方は何通りあるか。',k,3,0,'個','','パン'+k+'個を○、種類の区切りを｜2本として並べる');},
  function(R){var t=R.int(3,4),k=R.int(7,10);return sOB(t+'種類の花の中から、合わせて'+k+'本を選んで花束をつくる。どの種類も少なくとも1本は入れるものとする。選び方は何通りあるか。',k,t,1,'本','','先に1本ずつ入れると決め、残りの'+(k-t)+'本を○、区切りを｜'+(t-1)+'本として並べる');},
  function(R){var a=R.int(2,4),b=R.int(2,3),n=a+b+1;
   return sSame('赤い旗'+a+'本、青い旗'+b+'本、白い旗1本を、横一列に並べる。同じ色の旗は区別しない。並べ方は何通りあるか。',n,a,b,'赤どうし・青どうし','本',n+'本を全て区別して並べ、同じ色どうしの入れ替えで割る');},
  function(R){var g=R.pick([[3,3],[2,4],[2,5],[4,2],[5,2]]),s=g[0],k=g[1];return sGrp((s*k)+'人を、'+s+'人ずつの'+k+'組に分ける。分け方は何通りあるか。',s,k,s+'人ずつ順に選び、組に区別がないので'+k+'!で割る');},
  function(R){var n=R.int(5,7);return sOrd('A、B、Cを含む'+n+'人が、縦一列に並ぶ。AがBより前に並び、BがCより前に並ぶ並び方は何通りあるか。',n,3,'A、B、Cの3人の前後は 3P3 ＝ 6通りが同じ数ずつあり、そのうち1通りだけが当てはまる','A、B、Cの前後');},
  function(R){var n=R.int(5,8);return sSub(n+'冊の異なる本の中から、何冊かを借りる。少なくとも1冊は借りるものとする。借りる本の選び方は何通りあるか。',n,'冊','','全部借りない','1冊ごとに「借りる」「借りない」の2通り。全部借りない1通りを引く');},
  function(R){return sPair(R.int(4,6),R.int(4,5),3);},
  function(R){var T=R.int(9,13);return sOB('同じ鉛筆'+T+'本を、P、Q、R、Sの4人に分ける。1人に少なくとも2本は分けるものとする。分け方は何通りあるか。',T,4,2,'本','','先に2本ずつ分けると決め、残りの'+(T-8)+'本を○、人の区切りを｜3本として並べる');}
 ]};

/* ===== 別の方法で解く（verify）：実際に並べ方・選び方を全部書き出して数える ===== */
function perms(n,r,f){var used=[],t=[];(function g(){if(t.length===r){f(t);return;}for(var i=0;i<n;i++)if(!used[i]){used[i]=1;t.push(i);g();t.pop();used[i]=0;}})();}
function cnt(n,r,pred,key){var S={},c=0;perms(n,r,function(t){if(pred&&!pred(t))return;var k=key?key(t):t.join(',');if(!S[k]){S[k]=1;c++;}});return c;}
function srt(t){return t.slice().sort(function(a,b){return a-b;}).join(',');}
function rot(t){var i=t.indexOf(0);return t.slice(i).concat(t.slice(0,i)).join(',');}
function part(rem,s){if(!rem.length)return 1;var f=rem[0],rest=rem.slice(1),tot=0;(function g(st,pick){if(pick.length===s-1){tot+=part(rest.filter(function(x){return pick.indexOf(x)<0;}),s);return;}for(var i=st;i<rest.length;i++){pick.push(rest[i]);g(i+1,pick);pick.pop();}})(0,[]);return tot;}
function VJ(v){var x=0,i,n=v.n;switch(v.t){
 case 'P':x=cnt(n,v.r);break;
 case 'C':x=cnt(n,v.r,null,srt);break;
 case 'chair':x=cnt(n,3,null,function(t){return t[0]+'|'+srt(t.slice(1));});break;
 case 'CC':x=cnt(v.a+v.b,v.ra+v.rb,function(t){return t.filter(function(i){return i<v.a;}).length===v.ra;},srt);break;
 case 'EX':x=cnt(n,v.k,function(t){return t.some(function(i){return i>=v.m;});},v.o?null:srt);break;
 case 'coin':for(i=0;i<(1<<n);i++){var c=0;for(var j=0;j<n;j++)if(i>>j&1)c++;if(c===v.k)x++;}break;
 case 'dig':x=cnt(v.hi-v.lo+1,v.r,function(t){var d=t.map(function(i){return i+v.lo;});if(d[0]===0)return false;var val=+d.join(''),last=d[d.length-1];
   return v.c==='any'||(v.c==='even'&&last%2===0)||(v.c==='m5'&&val%5===0)||(v.c==='gt'&&val>v.g);});break;
 case 'AB':x=cnt(n,v.k,function(t){return t.indexOf(0)>=0||t.indexOf(1)>=0;},srt);break;
 case 'ends':x=cnt(n,n,function(t){return t[0]+t[n-1]===1&&t[0]*t[n-1]===0;});break;
 case 'fix':x=cnt(n,n,function(t){return t[v.p-1]===0;});break;
 case 'either':x=cnt(v.a+v.b,2,function(t){return (t[0]<v.a)===(t[1]<v.a);},srt);break;
 case 'both':x=cnt(v.a+v.b,v.k,function(t){return t.some(function(i){return i<v.a;})&&t.some(function(i){return i>=v.a;});},srt);break;
 case 'adj':x=cnt(n,n,function(t){return Math.abs(t.indexOf(0)-t.indexOf(1))===1;});break;
 case 'must':x=cnt(n,v.k,function(t){return t.indexOf(0)>=0;},srt);break;
 case 'day':x=cnt(n,n,function(t){return t[0]!==0;});break;
 case 'es':v.E.forEach(function(e){v.S.forEach(function(s){if(e!==s)x++;});});break;
 case 'cir':x=cnt(n,n,null,rot);break;
 case 'cadj':x=cnt(n,n,function(t){var d=Math.abs(t.indexOf(0)-t.indexOf(1));return (d===1||d===n-1)===!!v.adj;},rot);break;
 case 'ob':(function g(k,left,acc){if(k===1){if(left>=v.m)x++;return;}for(var a=v.m;a<=left;a++)g(k-1,left-a);})(v.s,v.k);break;
 case 'part':var all=[];for(i=0;i<v.s*v.k;i++)all.push(i);x=part(all,v.s);break;
 case 'ms':var lab=[];v.c.forEach(function(c,j){for(var q=0;q<c;q++)lab.push(j);});x=cnt(lab.length,lab.length,null,function(t){return t.map(function(i){return lab[i];}).join('');});break;
 case 'pair':var S={};perms(v.a,v.k,function(b){perms(v.b,v.k,function(g){var k=b.map(function(bi,j){return bi+'-'+g[j];}).sort().join(',');S[k]=1;});});x=Object.keys(S).length;break;
 case 'sub':for(i=1;i<(1<<n);i++)x++;break;
 case 'ord':x=cnt(n,n,function(t){for(var j=1;j<v.j;j++)if(t.indexOf(j-1)>t.indexOf(j))return false;return true;});break;
 }
 return x+(v.u||'通り');}

[[3,S3,'jn3'],[4,S4,'jn4'],[5,S5,'jn5']].forEach(function(L){for(var st in L[1])L[1][st].forEach(function(mk,i){add(L[0],st,L[2]+st.charAt(0)+'-g'+(i+1),mk);});});
})();
