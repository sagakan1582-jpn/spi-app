/* 問題集 問165〜201（速度算・集合・表の解釈・特殊算・情報の読み取り）担当E
   問題文は問題集のまま、数値だけを変える。各小問 = テンプレート1個（make/verify）。bk:'165-1' のように問題集の番号を付ける。
   gen（数値を選ぶ）→ build（問題・選択肢・解説を作る）。_orig に問題集の元の数値を入れてあり、build(_orig) が別冊の正解になることを検査で確かめる。 */
(function(){
function k(x,d){x=Math.round(x*1e9)/1e9;var m=Math.pow(10,d==null?6:d);return Math.round(x*m)/m;}
function fx(x,d){return k(x,d).toFixed(d);}
function m(x){return '<mark>'+x+'</mark>';}
function TB(head,rows){var t='<div class="tbl-wrap"><table class="tbl"><tr>';
 head.forEach(function(x){t+='<th>'+x+'</th>';});t+='</tr>';
 rows.forEach(function(r){t+='<tr>';r.forEach(function(x,i){t+=(i===0?'<th>':'<td>')+x+(i===0?'</th>':'</td>');});t+='</tr>';});
 return t+'</table></div>';}
var NONE={5:'AからDのいずれでもない',6:'AからEのいずれでもない',10:'AからIのいずれでもない'};
/* 数値の選択肢：正解＋よくある間違い＋足りなければ正解±step。小さい順。none=true なら最後に「いずれでもない」（ときどき正解をはずしてそれを正解にする） */
function CH(R,ans,ws,fmt,n,none,step){var S=fmt(ans),vs=[ans],seen={};seen[S]=1;
 function add(w){if(vs.length>n||!(w>0)||!isFinite(w))return;var t=fmt(w);if(seen[t])return;seen[t]=1;vs.push(w);}
 ws.forEach(add);for(var i=1;vs.length<=n&&i<200;i++){add(ans+i*step);add(ans-i*step);}
 var noA=none&&R.int(1,6)===1;if(noA)vs.shift();else vs=vs.slice(0,n);
 vs.sort(function(a,b){return a-b;});var c=vs.map(fmt),a=noA?n:c.indexOf(S);if(none)c.push(NONE[n+1]);return {c:c,a:a};}
/* 文字の選択肢（固定の並び）。答えが無ければ「いずれでもない」 */
function FIX(list,ans,noneKey){var c=list.slice();if(noneKey)c.push(NONE[noneKey]);var a=c.indexOf(ans);if(a<0)a=c.length-1;return {c:c,a:a};}
function VF(fn){return function(v,o){var s=fn(v),L=o.c[o.c.length-1];if(/いずれでもない$/.test(L)&&o.c.indexOf(s)<0)return L;return s;};}
function T(f,l,bk,gen,build,ver,orig){BANK[f]=BANK[f]||{};BANK[f][l]=BANK[f][l]||{};var B=BANK[f][l];['concept','practice','applied','real'].forEach(function(s){B[s]=B[s]||[];});
 B.real.push({id:'bk'+bk,bk:bk,_orig:orig,_build:build,
  make:function(R){var v=null;for(var i=0;i<400&&!v;i++)v=gen(R);if(!v)return null;var o=build(v,R);o.v=v;o.bk=bk;return o;},
  verify:VF(ver)});}
function LS(f,l,steps){LESSON[f]=LESSON[f]||{};LESSON[f][l]=LESSON[f][l]||[];steps.forEach(function(s){LESSON[f][l].push(s);});}
function hm(t){return Math.floor(t/60)+':'+('0'+t%60).slice(-2);}
function hmj(t){return Math.floor(t/60)+'時'+(t%60)+'分';}
function KAR(a,b,r1,r2,r3){return {table:{head:['',b+'○',b+'×','計'],rows:[[a+'○'].concat(r1),[a+'×'].concat(r2),['計'].concat(r3)]}};}
function SPD(rows){return {table:{head:['','速さ（km/時）','時間','距離（km）'],rows:rows}};}
var F1=function(u){return function(x){return fx(x,1)+u;};},I=function(u){return function(x){return k(x,0)+u;};};
var SP='単位あたりの大きさ',SG='集合',HY='表の解釈',TK='特殊算',JO='情報の読み取り';

/* ===================== 速度算 問165〜169 ===================== */
function g165(R){var d1=R.pick([5,5.5,6,6.5,7]),d2=R.pick([4,4.5,5,5.5,6]),d3=R.pick([5,5.5,6,6.5,7]);
 var t1=R.int(18,26),t2=R.pick([10,12,15,18,20]),t3=R.int(18,26),t4=R.pick([18,20,24,25,30]);
 var v2=d2*60/t2,v4=d1*60/t4;if(k(v2,1)!==k(v2,6)||v2<12||v2>30||k(v4,1)!==k(v4,6))return null;
 return {d:[d1,d2,d3,d1],t:[t1,t2,t3],v4:k(v4,1),s:R.pick([570,600,615,630])};}
function q165(v){var d=v.d,s=v.s,t=v.t;
 return '4人で駅伝の区間を走った。第1区と第4区はそれぞれ'+d[0]+'km、第2区は'+d[1]+'km、第3区は'+d[2]+'kmである。各区間での通過時間は次の通りだった。'+
  TB(['','スタート','第1区','第2区','第3区','第4区'],[['通過時刻',hm(s),hm(s+t[0]),hm(s+t[0]+t[1]),hm(s+t[0]+t[1]+t[2]),'（　）'],['距離','',d[0]+'km',d[1]+'km',d[2]+'km',d[3]+'km']]);}
var o165={d:[6.5,5,6,6.5],t:[22,15,23],v4:19.5,s:615};
T(SP,4,'165-1',g165,function(v,R){var d=v.d,t=v.t,a=d[1]*60/t[1];var ch=CH(R,a,[d[1]/t[1],d[0]*60/t[0],d[2]*60/t[2],(d[0]+d[1]+d[2])*60/(t[0]+t[1]+t[2]),a+1],F1('km/時'),5,true,1);
 return {q:q165(v)+'第2区の走者の平均時速はいくらか（必要なときは、最後に小数第2位を四捨五入すること）。',c:ch.c,a:ch.a,
  inw:'第2区の「時間」と「距離」から速さを出す（時刻の差が時間）',fig:SPD([['第2区','!?',t[1]+'分 ＝ '+t[1]+'/60時間',d[1]]]),
  calc:'時間 '+hm(v.s+t[0]+t[1])+' − '+hm(v.s+t[0])+' ＝ '+t[1]+'分<br>速さ ＝ 距離 ÷ 時間 ＝ '+d[1]+' ÷ '+t[1]+'/60 ＝ '+d[1]+' × 60 ÷ '+t[1]+' ＝ '+fx(a,1)};},
 function(v){return fx(v.d[1]/(v.t[1]/60),1)+'km/時';},o165);
T(SP,5,'165-2',g165,function(v,R){var d=v.d,t=v.t,t4=d[3]*60/v.v4,D=d[0]+d[1]+d[2]+d[3],TT=t[0]+t[1]+t[2]+t4,a=D*60/TT;
 var sp=d.map(function(x,i){return i<3?x*60/t[i]:v.v4;});
 var ch=CH(R,a,[(sp[0]+sp[1]+sp[2]+sp[3])/4,D*60/(t[0]+t[1]+t[2]),D/TT,a+0.5,a-1],F1('km/時'),5,true,0.5);
 return {q:q165(v)+'第4区の走者は平均時速'+v.v4+'km/時で走った。このとき、全区間の平均時速はいくらか（必要なときは、最後に小数第2位を四捨五入すること）。',c:ch.c,a:ch.a,
  inw:'全体を4つの区間に分ける。平均時速＝全体の距離 ÷ 全体の時間（区間の速さの平均ではない）',
  fig:SPD([['第1〜3区','',(t[0]+t[1]+t[2])+'分',d[0]+d[1]+d[2]],['第4区',v.v4,'?',d[3]],['全体','!?',k(TT,2)+'分',D]]),
  calc:'第4区の時間 '+d[3]+' ÷ '+v.v4+' ＝ '+k(t4/60,4)+'時間 ＝ '+k(t4,2)+'分<br>全体の時間 '+(t[0]+t[1]+t[2])+' ＋ '+k(t4,2)+' ＝ '+k(TT,2)+'分<br>全体の距離 '+D+'km<br>平均時速 '+D+' ÷ '+k(TT,2)+'/60 ＝ '+fx(a,1)};},
 function(v){var h=0;v.d.forEach(function(x,i){h+=i<3?v.t[i]/60:x/v.v4;});return fx((v.d[0]+v.d[1]+v.d[2]+v.d[3])/h,1)+'km/時';},o165);

/* 166 池の周り（速さは m/分 で持つ。表示は km/時） */
function q166(v){return '1周'+k(v.L/1000,3)+'kmの池の周りをPは時速'+k(v.a*0.06,2)+'km、Qは時速'+k(v.b*0.06,2)+'kmで歩く。今、PとQは池の周りの同じ地点にいて、2人の速度はそれぞれ常に一定とする。';}
function g166(R,two){var a=R.pick([60,70,75,80,90,100,105,120]),b=R.pick([40,45,50,55,60,65,70,75,80]),L=R.pick([900,1000,1200,1500,1800,2000,2400]),t0=R.int(5,12);
 if(b>=a)return null;if(!two&&L%(a+b))return null;if(two&&(a*t0>=L||(L-a*t0)%(a-b)))return null;return {a:a,b:b,L:L,t0:t0};}
var o166={a:90,b:60,L:1500,t0:9};
T(SP,4,'166-1',function(R){return g166(R,0);},function(v,R){var x=v.L/(v.a+v.b);
 var ch=CH(R,x,[v.L/(v.a-v.b),v.L/v.a,v.L/v.b,x+2],I('分'),5,true,1);
 return {q:q166(v)+'池の周りを同時に反対方向に歩き出すと、2人が再び出会うまでにかかる時間は何分か。',c:ch.c,a:ch.a,
  inw:'反対方向なので、2人が歩いた距離の合計が1周になる（速さを足す）',fig:SPD([['P',k(v.a*0.06,2),'?',''],['Q',k(v.b*0.06,2),'?',''],['2人の合計',k((v.a+v.b)*0.06,2),'!?',k(v.L/1000,3)]]),
  calc:'速さの合計 '+k(v.a*0.06,2)+' ＋ '+k(v.b*0.06,2)+' ＝ '+k((v.a+v.b)*0.06,2)+'km/時<br>時間 '+k(v.L/1000,3)+' ÷ '+k((v.a+v.b)*0.06,2)+' ＝ '+k(x/60,4)+'時間 ＝ '+x+'分'};},
 function(v){for(var t=1;t<2000;t++)if((v.a+v.b)*t===v.L)return t+'分';return '';},o166);
T(SP,5,'166-2',function(R){return g166(R,1);},function(v,R){var lead=v.a*v.t0,x=v.t0+(v.L-lead)/(v.a-v.b);
 var ch=CH(R,x,[(v.L-lead)/(v.a-v.b),v.L/(v.a-v.b),x+v.t0,x-4],I('分後'),5,true,1);
 return {q:q166(v)+'Pが出発してから'+v.t0+'分後に、QがPと同じ方向に歩き出すと、Pが最初にQに追いつくのは、Pが歩き出してから何分後か。',c:ch.c,a:ch.a,
  inw:'Qが歩き出すまでにPが進んだ分を除くと、PはQより「1周 − その分」多く歩けば追いつく（速さの差）',
  fig:SPD([['P（先に'+v.t0+'分）',k(v.a*0.06,2),v.t0+'分',k(lead/1000,3)],['差をつめる',k((v.a-v.b)*0.06,2),'!?',k((v.L-lead)/1000,3)]]),
  calc:'先に歩いた距離 '+k(v.a*0.06,2)+' × '+v.t0+'/60 ＝ '+k(lead/1000,3)+'km<br>つめる距離 '+k(v.L/1000,3)+' − '+k(lead/1000,3)+' ＝ '+k((v.L-lead)/1000,3)+'km<br>速さの差 '+k((v.a-v.b)*0.06,2)+'km/時 → 時間 '+((v.L-lead)/(v.a-v.b))+'分<br>'+v.t0+' ＋ '+((v.L-lead)/(v.a-v.b))+' ＝ '+x+'分後'};},
 function(v){for(var t=v.t0;t<3000;t++)if(v.a*t-v.b*(t-v.t0)===v.L)return t+'分後';return '';},o166);

/* 167 出発時刻が違う2台のすれ違い */
var o167={D:50,x:50,d:10,s:605};
T(SP,5,'167',function(R){var D=R.pick([40,50,60,80,90,100,120]),x=R.pick([40,45,48,50,60,72,75,80,90,100,120]),d=R.pick([5,10,15,20]);
 var tx=D*30/x;if(tx%1||d>=tx)return null;var y=D*30/(tx-d);if(y%1||y>240)return null;return {D:D,x:x,d:d,s:R.int(108,137)*5};},
 function(v,R){var tx=v.D*30/v.x,y=v.D*30/(tx-v.d);var ch=CH(R,y,[v.x,v.D*60/(tx+v.d),v.D*30/v.d,y-5,y+10],I('km/時'),5,true,5);
 return {q:'R駅とS駅の間は'+v.D+'kmである。'+v.x+'km/時で走行する電車XがR駅を'+hmj(v.s)+'に出発して、RS間の中間地点でS駅を'+hmj(v.s+v.d)+'に出発した電車Yとすれ違った。Yの速度は何km/時か。各電車の速度は常に一定とする。',c:ch.c,a:ch.a,
  inw:'中間地点まで（'+(v.D/2)+'km）をXとYがそれぞれ走る。Yは'+v.d+'分遅れて出発したので、走った時間はXより'+v.d+'分短い',
  fig:SPD([['X',v.x,tx+'分',v.D/2],['Y','!?',(tx-v.d)+'分',v.D/2]]),
  calc:'Xの時間 '+(v.D/2)+' ÷ '+v.x+' ＝ '+k(tx/60,4)+'時間 ＝ '+tx+'分（'+hmj(v.s+tx)+'にすれ違う）<br>Yの時間 '+tx+' − '+v.d+' ＝ '+(tx-v.d)+'分<br>Yの速さ '+(v.D/2)+' ÷ '+(tx-v.d)+'/60 ＝ '+y};},
 function(v){var tx=v.D*30/v.x;for(var y=1;y<=300;y++)if(v.x*tx+y*(tx-v.d)===v.D*60)return y+'km/時';return '';},o167);

/* 168 動く歩道 */
var o168={w:3,s:2.4,T:40};
T(SP,4,'168',function(R){var w=R.pick([1.8,2.4,3,3.6,4.2,4.8]),s=R.pick([1.8,2.4,3,3.6,4.2,4.8,5.4]),T=R.pick([30,36,40,45,48,50,60,72,80,90]);
 var L=(Math.round(w*10)+Math.round(s*10))*T/36;if(L%1||w===s)return null;return {w:w,s:s,T:T};},
 function(v,R){var L=(v.w+v.s)*1000/3600*v.T;var ch=CH(R,L,[Math.abs(v.w-v.s)*1000/3600*v.T,v.w*1000/3600*v.T,v.s*1000/3600*v.T,L+10],I('m'),5,true,10);
 return {q:'時速'+v.w+'kmで進む動く歩道の上を時速'+v.s+'kmで歩いたら、動く歩道に乗ってから'+v.T+'秒で降りることになった。この動く歩道は、何mあったか。',c:ch.c,a:ch.a,
  inw:'動く歩道の上を歩くと、速さは「歩道の速さ ＋ 歩く速さ」になる。単位を m/秒 にそろえる',
  fig:SPD([['歩道＋歩き',k(v.w+v.s,2)+'（＝'+k((v.w+v.s)/3.6,4)+'m/秒）',v.T+'秒','!?']]),
  calc:'速さ '+v.w+' ＋ '+v.s+' ＝ '+k(v.w+v.s,2)+'km/時 ＝ '+k((v.w+v.s)*1000,0)+'m ÷ 3600秒<br>距離 '+k((v.w+v.s)*1000,0)+' × '+v.T+' ÷ 3600 ＝ '+L+'m'};},
 function(v){var mpm=(v.w+v.s)*1000/60;return k(mpm*v.T/60,4)+'m';},o168);

/* 169 時刻表のすれ違い */
function q169(v){return '次の表は、PR間を並行に走行する路線の列車甲と列車乙の時刻表である。甲はP駅を出発し、Q駅に停車した後、R駅に着く。乙はR駅を出発し、Q駅に停車した後、P駅に着く。なお、PQ間は'+v.a+'km、QR間は'+v.b+'kmで、列車の速度は常に一定とする。'+
 TB(['','甲','乙',''],[['P駅発',hm(v.pd),hm(v.za),'着'],['Q駅着<br>　　発','（　　）<br>'+hm(v.tq),'（　　）<br>（　　）','発<br>着'],['R駅着','（　　）',hm(v.tr),'発']]);}
var o169a={a:50,b:20,v:48,tr:670,tq:675,pd:610,za:760},o169b={a:50,b:20,f:1.5,tr:670,tq:675,M:680,pd:610,za:760};
T(SP,5,'169-1',function(R){var a=R.pick([40,45,50,55,60]),b=R.pick([15,18,20,24,25,30,36]),v=R.pick([36,40,45,48,50,60,72]);
 if((b*60)%v)return null;var Lb=b*60/v,g=R.int(2,10);if(Lb-g<=0||(Lb-g)%2)return null;var tr=R.int(630,700),tq=tr+g;
 return {a:a,b:b,v:v,tr:tr,tq:tq,pd:tq-Math.ceil(a*60/v)-R.int(2,5),za:tr+Lb+R.int(2,5)+Math.ceil(a*60/v)};},
 function(v,R){var Lb=v.b*60/v.v,g=v.tq-v.tr,mm=(Lb-g)/2,x=v.tq+mm;var ch=CH(R,x,[v.tq+Lb/2,v.tr+Lb/2,x+g,x+5],hmj,5,true,5);
 return {q:q169(v)+'甲と乙がともに'+v.v+'km/時で走行するとき、甲は何時何分にQR間で乙とすれ違うか。',c:ch.c,a:ch.a,
  inw:'甲がQ駅を出る'+hm(v.tq)+'の時点で、乙はすでに'+g+'分走っている。そこから先は2人で残りの距離をつめる（速さを足す）',
  fig:SPD([['乙（先に'+g+'分）',v.v,g+'分',k(v.v*g/60,3)],['2人で残りをつめる',v.v*2,'!?',k(v.b-v.v*g/60,3)]]),
  calc:'乙が先に走った距離 '+v.v+' × '+g+'/60 ＝ '+k(v.v*g/60,3)+'km<br>残り '+v.b+' − '+k(v.v*g/60,3)+' ＝ '+k(v.b-v.v*g/60,3)+'km<br>'+k(v.b-v.v*g/60,3)+' ÷ '+(v.v*2)+' ＝ '+k(mm/60,4)+'時間 ＝ '+mm+'分<br>'+hm(v.tq)+' ＋ '+mm+'分 ＝ '+hmj(x)};},
 function(v){for(var t=0;t<600;t++)if(v.v*t+v.v*(t+v.tq-v.tr)===60*v.b)return hmj(v.tq+t);return '';},o169a);
T(SP,5,'169-2',function(R){var a=R.pick([40,45,50,55,60]),b=R.pick([15,18,20,24,25,30,36]),f=R.pick([1.5,1.5,2]),g=R.int(3,15),mm=R.int(2,15);
 var vk=60*b/(mm+f*(mm+g));if(vk%1||(f*vk)%1||vk<30)return null;var tr=R.int(126,140)*5,tq=tr+g;
 return {a:a,b:b,f:f,tr:tr,tq:tq,M:tq+mm,pd:tq-Math.ceil(a*60/vk)-R.int(2,5),za:tr+Math.ceil((a+b)*60/(f*vk))+R.int(2,5)};},
 function(v,R){var g=v.tq-v.tr,mm=v.M-v.tq,vk=60*v.b/(mm+v.f*(mm+g)),y=v.f*vk;
 var ch=CH(R,y,[vk,60*v.b/(v.M-v.tr),y+15,y-15,y*1.2],I('km/時'),5,true,5);
 return {q:q169(v)+'乙が甲の'+v.f+'倍の速度で走行するとき、'+hmj(v.M)+'にQR間で甲と乙がすれ違った。乙の速度は何km/時か。',c:ch.c,a:ch.a,
  inw:'すれ違うまでに甲は'+mm+'分、乙は'+(mm+g)+'分走り、2人の距離の合計がQR間の'+v.b+'km。甲の速さを1とすると乙は'+v.f,
  fig:SPD([['甲','1',mm+'分',mm],['乙',v.f,(mm+g)+'分',k(v.f*(mm+g),2)],['合計','','',v.b+'km ＝ '+k(mm+v.f*(mm+g),2)]]),
  calc:'甲の速さを1とした距離：甲 1 × '+mm+' ＝ '+mm+'、乙 '+v.f+' × '+(mm+g)+' ＝ '+k(v.f*(mm+g),2)+'（合計 '+k(mm+v.f*(mm+g),2)+'）<br>'+k(mm+v.f*(mm+g),2)+' が '+v.b+'km → 甲の速さ '+v.b+' ÷ '+k(mm+v.f*(mm+g),2)+' × 60 ＝ '+vk+'km/時<br>乙 '+vk+' × '+v.f+' ＝ '+y+'km/時'};},
 function(v){var g=v.tq-v.tr,mm=v.M-v.tq;for(var x=1;x<=400;x++)if(Math.abs(x*mm+v.f*x*(mm+g)-60*v.b)<1e-9)return k(v.f*x,4)+'km/時';return '';},o169b);

/* ===================== 集合 問170〜181 ===================== */
var P=I('人');
/* 2×2 の表を総当たりで解く：両方○の人数 z を 0〜N で動かし、条件 ok(z) を満たすものを返す */
function Z(N,ok){var r=[];for(var z=0;z<=N;z++)if(ok(z))r.push(z);return r;}
T(SG,4,'170',function(R){var x=R.int(20,60),y=R.int(5,20);return {A:x+2*y,B:x+y};},
 function(v,R){var x=2*v.B-v.A,y=v.B-x;var ch=CH(R,x,[v.A-v.B,v.B,v.A,y,2*y],P,5,false,5);
 return {q:'成人式の式典に'+v.A+'人、その後の同窓会に'+v.B+'人が参加した。式典のみに参加した人が、同窓会のみに参加した人の2倍の人数だったとき、式典と同窓会の両方に参加した人は何人か。',c:ch.c,a:ch.a,
  inw:'参加者を「式典○・×」と「同窓会○・×」で分ける。式典のみ ＝ 2 × 同窓会のみ',
  fig:KAR('式典','同窓会',['!?','2 × 同窓会のみ',v.A],['同窓会のみ','',''],[v.B,'','']),
  calc:'式典のみ ＝ '+v.A+' − 両方、同窓会のみ ＝ '+v.B+' − 両方<br>'+v.A+' − 両方 ＝ 2 ×（'+v.B+' − 両方）<br>両方 ＝ 2 × '+v.B+' − '+v.A+' ＝ '+x};},
 function(v){var r=Z(v.B,function(z){return v.A-z===2*(v.B-z);});return r.length===1?r[0]+'人':'';},{A:85,B:70});
T(SG,5,'171',function(R){var N=R.pick([40,50,60,80,100]),f=R.pick([2,3,3,4]),n=R.int(2,8),x=f*n,t=R.int(x+3,N-n-3),b=N-n+x-t;
 if(b<x||b>N-n||t>N-n||b===t)return null;return {N:N,f:f,n:n,t:t,b:b};},
 function(v,R){var x=v.f*v.n;var ch=CH(R,x,[v.n,v.t+v.b-v.N,x+2,x-2,v.n*2],P,5,false,2);
 return {q:'ある高校の1年生'+v.N+'人に、通学時における電車とバスの利用状況について調査した。電車を利用する人は'+v.t+'人、バスを利用する人は'+v.b+'人で、電車とバスの両方を利用する人はどちらも利用しない人の'+v.f+'倍だった。電車とバスの両方を利用する人は何人か。',c:ch.c,a:ch.a,
  inw:'1年生を「電車○・×」と「バス○・×」で分ける。どちらも利用しない人を1とすると両方は'+v.f,
  fig:KAR('電車','バス',['!'+v.f+'','',v.t],['','1',''],[v.b,'',v.N]),
  calc:'電車 ＋ バス ＝ '+v.t+' ＋ '+v.b+' ＝ '+(v.t+v.b)+'（両方を2回数えている）<br>'+(v.t+v.b)+' − 両方 ＋ どちらもなし ＝ '+v.N+' → 両方 − どちらもなし ＝ '+(v.t+v.b-v.N)+'<br>'+v.f+' − 1 ＝ '+(v.f-1)+' が '+(v.t+v.b-v.N)+'人 → 1 ＝ '+v.n+'人<br>両方 ＝ '+v.f+' × '+v.n+' ＝ '+x};},
 function(v){var r=Z(v.N,function(z){return z%v.f===0&&v.t+v.b-z+z/v.f===v.N;});return r.length===1?r[0]+'人':'';},{N:60,f:3,n:6,t:27,b:45});
T(SG,4,'172',function(R){var x=R.int(5,20),s=R.int(3,15),d=R.int(5,20),n=R.int(20,50);return {x:x,s:s,d:d,n:n,N:x+s+d+s+n};},
 function(v,R){var Zt=v.N-v.s-v.n,x=Zt-v.d-v.s;var ch=CH(R,x,[x-1,x+1,x-2,x+2],P,5,false,1);
 return {q:'ある学校の生徒'+v.N+'人のうち、夏休みに動物園に行った人は水族館に行った人よりも'+v.d+'人多かった。動物園には行かなかったが水族館には行った人が'+v.s+'人、どちらにも行かなかった人が'+v.n+'人だとすると、動物園と水族館の両方に行った人は何人か。',c:ch.c,a:ch.a,
  inw:'生徒を「動物園○・×」と「水族館○・×」で分ける',
  fig:KAR('動物園','水族館',['!?','',Zt],[v.s,v.n,v.s+v.n],[Zt-v.d,'',v.N]),
  calc:'動物園に行った人 '+v.N+' − （'+v.s+' ＋ '+v.n+'） ＝ '+Zt+'<br>水族館に行った人 '+Zt+' − '+v.d+' ＝ '+(Zt-v.d)+'<br>両方 '+(Zt-v.d)+' − '+v.s+' ＝ '+x};},
 function(v){var r=Z(v.N,function(z){var zoo=z+v.d+v.s;return zoo+v.s+v.n===v.N;});return r.length===1?r[0]+'人':'';},{x:11,s:8,d:15,n:43,N:85});
T(SG,4,'173',function(R){var N=R.pick([40,50,60,80]),n=R.int(2,6),a=R.int(Math.round(N*0.6),N-n-1),b=R.int(Math.round(N*0.6),N-n-1);if(a===b)return null;return {N:N,n:n,a:a,b:b};},
 function(v,R){var x=v.a+v.b-(v.N-v.n);var ch=CH(R,x,[v.a+v.b-v.N,v.a,v.N-v.n,x-2,x+9],P,5,false,3);
 return {q:v.N+'人が20問のテストを2回受けた。10問以上正解した人は1回目が'+v.a+'人、2回目が'+v.b+'人だった。1回目も2回目も正解が10問未満だった人が'+v.n+'人だったとき、1回目も2回目も10問以上正解した人は何人か。',c:ch.c,a:ch.a,
  inw:'受けた人を「1回目10問以上○・×」と「2回目10問以上○・×」で分ける',
  fig:KAR('1回目','2回目',['!?','',v.a],['',v.n,v.N-v.a],[v.b,v.N-v.b,v.N]),
  calc:'少なくとも1回10問以上 '+v.N+' − '+v.n+' ＝ '+(v.N-v.n)+'<br>両方 ＝ '+v.a+' ＋ '+v.b+' − '+(v.N-v.n)+' ＝ '+x};},
 function(v){var r=Z(v.N,function(z){return (v.a-z)>=0&&(v.b-z)>=0&&z+(v.a-z)+(v.b-z)+v.n===v.N;});return r.length===1?r[0]+'人':'';},{N:50,n:3,a:42,b:43});
T(SG,4,'174',function(R){var N=R.pick([100,120,150,200,250]),p=R.pick([40,50,60,70,80]),q=R.pick([20,25,30,40,50,60]),Rr=N*p/100,b=Rr*q/100,mm=R.int(10,40);
 if(Rr%1||b%1||N-Rr-mm<5)return null;return {N:N,p:p,q:q,mm:mm};},
 function(v,R){var Rr=v.N*v.p/100,b=Rr*v.q/100,ho=v.N-Rr-v.mm,h=ho+b;var ch=CH(R,h,[ho,v.N-Rr,Rr,v.N-v.mm-b,h+9],P,5,false,5);
 return {q:'60代の男性'+v.N+'人を対象に旅行の宿泊施設の好みについてアンケートをとった。旅館が好きな人は全体の'+v.p+'%で、そのうちの'+v.q+'%はホテルも好きであった。また、旅館・ホテルのいずれも好きではない人が'+v.mm+'人いた。このとき、ホテルが好きな人は何人か。',c:ch.c,a:ch.a,
  inw:'全体を「旅館○・×」と「ホテル○・×」で分ける',
  fig:KAR('旅館','ホテル',[b,Rr-b,Rr],[ho,v.mm,v.N-Rr],['!?','',v.N]),
  calc:'旅館が好き '+v.N+' × '+v.p/100+' ＝ '+Rr+'<br>両方 '+Rr+' × '+v.q/100+' ＝ '+b+'<br>ホテルだけ '+v.N+' − '+Rr+' − '+v.mm+' ＝ '+ho+'<br>ホテルが好き '+b+' ＋ '+ho+' ＝ '+h};},
 function(v){var Rr=v.N*v.p/100,b=Rr*v.q/100;var r=Z(v.N,function(h){return Rr+h-b+v.mm===v.N;});return r.length===1?r[0]+'人':'';},{N:150,p:60,q:40,mm:25});
T(SG,4,'175',function(R){var N=R.pick([100,150,200,250,300,400,500]),y=R.int(40,70),p=R.int(25,50),n=R.int(5,25),b=y+p+n-100;
 if(b<4||b>=p||(N*b)%100||(N*y)%100||(N*p)%100||(N*n)%100)return null;return {N:N,y:y,p:p,n:n};},
 function(v,R){var b=v.y+v.p+v.n-100,B=v.N*b/100;var ch=CH(R,v.N,[Math.round(B*100/(v.y+v.p-100+v.n+5)),Math.round(v.N*1.1),Math.round(v.N*0.92),Math.round(v.N*1.21),Math.round(v.N*0.555)],P,5,false,20);
 return {q:'あるスポーツクラブの利用者にヨガとピラティスを体験したことがあるかどうかを尋ねた。ヨガを体験したことがある人は'+v.y+'%、ピラティスを体験したことがある人は'+v.p+'%、ヨガ、ピラティスのどちらも体験したことがない人は'+v.n+'%だった。ヨガとピラティスの両方を体験したことのある人が'+B+'人だったとき、このスポーツクラブの利用者は何人か。',c:ch.c,a:ch.a,
  inw:'利用者を「ヨガ○・×」と「ピラティス○・×」で分ける。まず%で表を埋める',
  fig:KAR('ヨガ','ピラティス',[b+'%＝'+B+'人','',v.y+'%'],['',v.n+'%',''],[v.p+'%','','100%＝?']),
  calc:'両方 ＝ '+v.y+' ＋ '+v.p+' − （100 − '+v.n+'） ＝ '+b+'%<br>'+b+'% が '+B+'人 → 全体 '+B+' ÷ '+b/100+' ＝ '+v.N};},
 function(v){var b=v.y+v.p+v.n-100,B=v.N*b/100;for(var N=1;N<=3000;N++)if(N*b===B*100)return N+'人';return '';},{N:200,y:57,p:38,n:16});
function q176(v){return '会員'+v.N+'人のうち、土曜日の集会の参加者は'+v.s+'人、不参加者は'+(v.N-v.s)+'人である。また、日曜日の集会の参加者は'+v.u+'人、不参加者は'+(v.N-v.u)+'人である。';}
function g176(R){var N=R.pick([80,100,120,150]),s=R.int(Math.round(N*0.4),Math.round(N*0.7)),u=R.int(Math.round(N*0.5),Math.round(N*0.8));if(s===u||N-s===N-u)return null;return {N:N,s:s,u:u,c:R.int(5,Math.min(u,N-s)-3)};}
T(SG,5,'176-1',g176,function(v,R){var a=v.N-v.s,b=v.N-v.u,x=Math.min(a,b);var ch=CH(R,x,[Math.abs(a-b),Math.max(a,b),a+b,v.N-Math.max(v.s,v.u)+Math.abs(a-b)],P,5,false,3);
 return {q:q176(v)+'土曜日も日曜日も不参加の人は最も多くて何人か。',c:ch.c,a:ch.a,
  inw:'会員を「土曜参加○・×」と「日曜参加○・×」で分ける。両日不参加が最も多いのは、少ない方の不参加者が全員もう一方も不参加のとき',
  fig:KAR('土曜','日曜',['','',v.s],['','!?',a],[v.u,b,v.N]),
  calc:'土曜不参加 '+a+'人、日曜不参加 '+b+'人<br>両日不参加は、少ない方の'+x+'人を超えられない → 最大 '+x+'人'};},
 function(v){var best=-1;for(var z=0;z<=v.N;z++){var so=v.s-z,uo=v.u-z,no=v.N-v.s-v.u+z;if(so>=0&&uo>=0&&no>=0&&no>best)best=no;}return best+'人';},{N:100,s:56,u:69,c:13});
T(SG,4,'176-2',g176,function(v,R){var x=v.u-v.c;var ch=CH(R,x,[v.N-v.s-v.c,v.s-v.c,v.u-(v.N-v.s),v.s+v.c],P,5,false,6);
 return {q:q176(v)+'土曜日は不参加で、日曜日が参加の人が'+v.c+'人のとき、土曜日も日曜日も参加の人は何人か。',c:ch.c,a:ch.a,
  inw:'会員を「土曜参加○・×」と「日曜参加○・×」で分ける',
  fig:KAR('土曜','日曜',['!?','',v.s],[v.c,'',v.N-v.s],[v.u,v.N-v.u,v.N]),
  calc:'日曜参加 '+v.u+' − 土曜不参加・日曜参加 '+v.c+' ＝ '+x};},
 function(v){var r=Z(v.N,function(z){return z+v.c===v.u;});return r[0]+'人';},{N:100,s:56,u:69,c:13});
function q177(v){return '全校生徒'+v.N+'人の学校で、1人が体育会系クラブと文化系クラブのそれぞれに1つずつ所属できる。体育会系のクラブのみに所属している生徒は'+v.T1+'人で、文化系のクラブに所属している生徒の'+v.r+'割は体育会系のクラブにも所属している。また、どのクラブにも所属していない生徒が'+v.n+'人いる。';}
var FR=[['1/2',1,2],['2/3',2,3],['3/4',3,4],['1/3',1,3]];
function g177(R){var N=R.pick([80,90,100,120]),n=R.int(2,6),r=R.int(2,6),C=R.int(3,9)*10;if(r%2===0&&C%5===0)C=C;var T1=N-n-C,both=C*r/10;
 if(both%1||T1<20)return null;var Tt=T1+both,s=R.int(1,4),f=R.int(0,3),B=Tt*s/10;if(B%1||(B*FR[f][1])%FR[f][2])return null;var bc=B*FR[f][1]/FR[f][2];if(bc>both||B-bc>=T1)return null;
 return {N:N,n:n,r:r,T1:T1,s:s,f:f};}
T(SG,4,'177-1',g177,function(v,R){var C=v.N-v.n-v.T1,both=C*v.r/10,x=C-both;var ch=CH(R,x,[both,C,v.T1-C,x+7,x-7],P,5,false,7);
 return {q:q177(v)+'文化系のクラブのみに所属している生徒は何人いるか。',c:ch.c,a:ch.a,
  inw:'生徒を「体育会系○・×」と「文化系○・×」で分ける',
  fig:KAR('体育会系','文化系',[both,v.T1,''],['!?',v.n,''],[C+'（'+v.r+'割が両方）','',v.N]),
  calc:'文化系に所属 '+v.N+' − '+v.T1+' − '+v.n+' ＝ '+C+'<br>文化系のみ '+C+' × '+(10-v.r)/10+' ＝ '+x};},
 function(v){var C=v.N-v.n-v.T1;for(var x=0;x<=C;x++)if(x*10===C*(10-v.r))return x+'人';return '';},{N:90,n:3,r:4,T1:42,s:2,f:1});
T(SG,5,'177-2',g177,function(v,R){var C=v.N-v.n-v.T1,both=C*v.r/10,Tt=v.T1+both,B=Tt*v.s/10,fr=FR[v.f],bc=B*fr[1]/fr[2],bo=B-bc,x=v.T1-bo;
 var ch=CH(R,x,[v.T1-B,v.T1-bc,B,v.T1,x+10],P,5,false,9);
 return {q:q177(v)+'体育会系のクラブに所属している生徒のうちの'+v.s+'割が、体育会系の中にある球技系クラブに所属している。また、球技系のクラブの生徒の'+fr[0]+'は、文化系のクラブにも所属している。体育会系のクラブのみに所属していて、球技系以外のクラブに所属している生徒は何人いるか。',c:ch.c,a:ch.a,
  inw:'体育会系のみの'+v.T1+'人を「球技系」と「球技系以外」に分ける。球技系のうち文化系にも所属していない人が、体育会系のみの球技系',
  fig:{table:{head:['','文化系○','文化系×','計'],rows:[['球技系',bc,bo,B],['球技系以外','','!?',''],['体育会系の計',both,v.T1,Tt]]}},
  calc:'文化系 '+C+'、両方 '+C+' × '+v.r/10+' ＝ '+both+'<br>体育会系 '+v.T1+' ＋ '+both+' ＝ '+Tt+'<br>球技系 '+Tt+' × '+v.s/10+' ＝ '+B+'、そのうち文化系にも '+B+' × '+fr[0]+' ＝ '+bc+'<br>体育会系のみの球技系 '+B+' − '+bc+' ＝ '+bo+'<br>答え '+v.T1+' − '+bo+' ＝ '+x};},
 function(v){var C=v.N-v.n-v.T1,Tt=v.T1+C*v.r/10,B=Tt*v.s/10,fr=FR[v.f];for(var x=0;x<=v.T1;x++)if((v.T1-x)*fr[2]===B*(fr[2]-fr[1]))return x+'人';return '';},{N:90,n:3,r:4,T1:42,s:2,f:1});
function q178(v){return '社内の'+v.N+'人のうち、P新聞を読む人は'+v.P+'人、Q新聞を読む人は'+v.Q+'人、R新聞を読む人は'+v.R+'人で、どれも読まないという人はいなかった。';}
function g178(R){var N=R.pick([40,50,60]),P=R.int(Math.round(N*0.4),Math.round(N*0.65)),Q=R.int(Math.round(N*0.3),Math.round(N*0.5)),Rr=R.int(Math.round(N*0.2),Math.round(N*0.35)),x=R.int(4,Math.min(P,Q)-3),t=R.int(1,3);
 var ro=N-(P+Q-x);if(ro<3||ro>=Rr-1||t>x||t>Rr-ro||(P-x)+(Q-x)<Rr-ro-t)return null;return {N:N,P:P,Q:Q,R:Rr,x:x,t:t};}
T(SG,4,'178-1',g178,function(v,R){var ro=v.N-(v.P+v.Q-v.x);var ch=CH(R,ro,[ro-1,ro+1,ro-2,ro+2],P,5,false,1);
 return {q:q178(v)+'P新聞もQ新聞も読む人は'+v.x+'人だった。R新聞だけ読む人は何人か。',c:ch.c,a:ch.a,
  inw:'全員を「P・Qの少なくとも一方を読む人」と「R新聞だけ読む人」に分ける（どれも読まない人は0人）',
  fig:KAR('P新聞','Q新聞',[v.x,v.P-v.x,v.P],[v.Q-v.x,'!?（Rだけ）',''],[v.Q,'',v.N]),
  calc:'PかQを読む人 '+v.P+' ＋ '+v.Q+' − '+v.x+' ＝ '+(v.P+v.Q-v.x)+'<br>Rだけ '+v.N+' − '+(v.P+v.Q-v.x)+' ＝ '+ro};},
 function(v){for(var r=0;r<=v.N;r++)if(v.P+v.Q-v.x+r===v.N)return r+'人';return '';},{N:50,P:28,Q:20,R:14,x:8,t:1});
T(SG,5,'178-2',g178,function(v,R){var ro=v.N-(v.P+v.Q-v.x),x2=v.x+v.R-ro-v.t;var ch=CH(R,x2,[x2-1,x2+1,v.x+v.R-ro,x2-4,x2-7],P,5,false,1);
 return {q:q178(v)+'P新聞もQ新聞も読む人は'+v.x+'人だった。この条件に加えて、3紙全部を読む人が'+v.t+'人だけいた。2紙以上を読む人は何人か。',c:ch.c,a:ch.a,
  inw:'3紙の人数の合計は「1紙だけの人」を1回、「2紙だけの人」を2回、「3紙の人」を3回数えている',
  fig:{table:{head:['','人数','数えた回数'],rows:[['1紙だけ','',1],['2紙だけ','',2],['3紙全部',v.t,3],['合計',v.N,v.P+v.Q+v.R]]}},
  calc:'3紙の合計 '+v.P+' ＋ '+v.Q+' ＋ '+v.R+' ＝ '+(v.P+v.Q+v.R)+'<br>多く数えた分 '+(v.P+v.Q+v.R)+' − '+v.N+' ＝ '+(v.P+v.Q+v.R-v.N)+' ＝ 2紙だけ × 1 ＋ 3紙 × 2<br>2紙だけ '+(v.P+v.Q+v.R-v.N)+' − '+v.t+' × 2 ＝ '+(x2-v.t)+'<br>2紙以上 '+(x2-v.t)+' ＋ '+v.t+' ＝ '+x2};},
 function(v){return (v.P+v.Q+v.R-v.N-v.t)+'人';},{N:50,P:28,Q:20,R:14,x:8,t:1});
function q179(v){return '食品Pと食品Qについて、'+v.N+'人を対象にモニター調査を行った。'+TB(['食品','項目','満足','不満足'],[['P','味',v.s[0]+'人',(v.N-v.s[0])+'人'],['P','価格',v.s[1]+'人',(v.N-v.s[1])+'人'],['Q','味',v.s[2]+'人',(v.N-v.s[2])+'人'],['Q','価格',v.s[3]+'人',(v.N-v.s[3])+'人']]);}
function g179(R){var N=R.pick([150,200,250,300]),s=[0,1,2,3].map(function(){return R.int(Math.round(N*0.45),Math.round(N*0.8));});return {N:N,s:s,k:R.int(10,Math.min(s[0],N-s[1])-5),mm:R.int(5,30),j:R.int(10,Math.min(s[0],N-s[2])-5)};}
T(SG,4,'179-1',function(R){var v=g179(R);var b=v.s[0]-v.k;if(v.k<5||b>v.s[1]||b<5||v.N-v.s[0]-v.s[1]+b<0)return null;return v;},
 function(v,R){var x=v.s[0]-v.k;var ch=CH(R,x,[v.s[1]-v.k,v.N-v.s[0]-v.k+ (v.N-v.s[1]-v.k>0?0:0),v.k-(v.N-v.s[0]),x+7,x-24],P,5,false,7);
 return {q:q179(v)+'食品Pについて味には「満足」だが、価格には「不満足」と回答した人が'+v.k+'人のとき、食品Pについて味にも価格にも「満足」と回答した人は何人か。',c:ch.c,a:ch.a,
  inw:'食品Pの回答者を「味 満足・不満足」と「価格 満足・不満足」で分ける',fig:KAR('P味','P価格',['!?',v.k,v.s[0]],['','',v.N-v.s[0]],[v.s[1],v.N-v.s[1],v.N]),
  calc:'味に満足 '+v.s[0]+' − 価格に不満足 '+v.k+' ＝ '+x};},
 function(v){var r=Z(v.N,function(z){return z+v.k===v.s[0];});return r[0]+'人';},{N:200,s:[139,102,113,152],k:74,mm:23,j:42});
T(SG,4,'179-2',function(R){var v=g179(R);var b=v.s[2]+v.s[3]-(v.N-v.mm);if(b<5||b>Math.min(v.s[2],v.s[3])||v.mm>Math.min(v.N-v.s[2],v.N-v.s[3]))return null;return v;},
 function(v,R){var x=v.s[2]+v.s[3]-(v.N-v.mm);var ch=CH(R,x,[v.s[2]+v.s[3]-v.N,x+4,x-24,x+24,v.N-v.mm-v.s[2]],P,5,false,10);
 return {q:q179(v)+'食品Qについて味にも価格にも「不満足」と回答した人が'+v.mm+'人のとき、食品Qについて味にも価格にも「満足」と回答した人は何人か。',c:ch.c,a:ch.a,
  inw:'食品Qの回答者を「味 満足・不満足」と「価格 満足・不満足」で分ける',fig:KAR('Q味','Q価格',['!?','',v.s[2]],['',v.mm,v.N-v.s[2]],[v.s[3],v.N-v.s[3],v.N]),
  calc:'少なくとも一方に満足 '+v.N+' − '+v.mm+' ＝ '+(v.N-v.mm)+'<br>両方に満足 '+v.s[2]+' ＋ '+v.s[3]+' − '+(v.N-v.mm)+' ＝ '+x};},
 function(v){var r=Z(v.N,function(z){return v.s[2]-z>=0&&v.s[3]-z>=0&&z+(v.s[2]-z)+(v.s[3]-z)+v.mm===v.N;});return r.length===1?r[0]+'人':'';},{N:200,s:[139,102,113,152],k:74,mm:23,j:42});
T(SG,4,'179-3',function(R){var v=g179(R);var x=v.N-v.s[2]-v.j;if(x<3||x>v.N-v.s[0])return null;return v;},
 function(v,R){var x=v.N-v.s[2]-v.j;var ch=CH(R,x,[v.N-v.s[0]-v.j,v.N-v.s[0]+v.j-(v.N-v.s[2]),v.s[0]-v.j,v.N-v.s[0]+v.j,x+20],P,5,false,10);
 return {q:q179(v)+'食品Pの味には「満足」だが、食品Qの味には「不満足」と回答した人が'+v.j+'人のとき、食品P、Qともに味に「不満足」と回答した人は何人か。',c:ch.c,a:ch.a,
  inw:'回答者を「Pの味 満足・不満足」と「Qの味 満足・不満足」で分ける',fig:KAR('P味満足','Q味満足',['','',v.s[0]],[v.j,'',v.N-v.s[0]].reverse().reverse(),[v.s[2],v.N-v.s[2],v.N]),
  calc:'Qの味に不満足 '+(v.N-v.s[2])+'人のうち、Pの味に満足が'+v.j+'人<br>ともに不満足 '+(v.N-v.s[2])+' − '+v.j+' ＝ '+x};},
 function(v){for(var z=0;z<=v.N;z++)if(z+v.j===v.N-v.s[2])return z+'人';return '';},{N:200,s:[139,102,113,152],k:74,mm:23,j:42});
function q180(v){return 'ある家電量販店で来店客'+v.N+'名を対象に、満足度の調査を行った。下表は調査項目と集計結果の一部である。'+TB(['','満足','不満足'],[['商品',v.s[0],v.N-v.s[0]],['販売員',v.s[1],v.N-v.s[1]],['配送員',v.s[2],v.N-v.s[2]]])+'（人）<br>';}
function g180(R){var N=R.pick([200,240,300]),s=[R.int(Math.round(N*0.7),Math.round(N*0.9)),R.int(Math.round(N*0.6),Math.round(N*0.85)),R.int(Math.round(N*0.55),Math.round(N*0.75))];return {N:N,s:s,x:R.int(Math.max(s[1]+s[2]-N,0)+5,Math.min(s[1],s[2])-5),y:R.int(5,Math.min(s[0],N-s[1])-3)};}
T(SG,4,'180-1',g180,function(v,R){var a=v.s[1]-v.x;var ch=CH(R,a,[v.s[2]-v.x,v.N-v.s[2],v.N-v.s[1]-(v.s[2]-v.x)+40,a+20,a-25],P,5,false,15);
 return {q:q180(v)+'販売員にも配送員にも「満足」と答えた人が'+v.x+'人いた。販売員に「満足」で配送員に「不満足」と答えた人は何人か。',c:ch.c,a:ch.a,
  inw:'来店客を「販売員 満足・不満足」と「配送員 満足・不満足」で分ける',fig:KAR('販売員満足','配送員満足',[v.x,'!?',v.s[1]],['','',v.N-v.s[1]],[v.s[2],v.N-v.s[2],v.N]),
  calc:'販売員に満足 '+v.s[1]+' − 両方満足 '+v.x+' ＝ '+a};},
 function(v){for(var z=0;z<=v.N;z++)if(z+v.x===v.s[1])return z+'人';return '';},{N:240,s:[200,185,160],x:140,y:30});
T(SG,4,'180-2',function(R){var v=g180(R);if(v.N-v.s[1]-v.y<5)return null;return v;},function(v,R){var a=v.N-v.s[1]-v.y;var ch=CH(R,a,[a-5,a+5,a-10,a+10],P,5,false,5);
 return {q:q180(v)+'商品に「満足」、販売員に「不満足」と答えた人が'+v.y+'人いた。商品にも販売員にも「不満足」と答えた人は何人か。',c:ch.c,a:ch.a,
  inw:'来店客を「商品 満足・不満足」と「販売員 満足・不満足」で分ける',fig:KAR('商品満足','販売員満足',['',v.y,v.s[0]],['','!?',v.N-v.s[0]],[v.s[1],v.N-v.s[1],v.N]),
  calc:'販売員に不満足 '+(v.N-v.s[1])+' − 商品に満足・販売員に不満足 '+v.y+' ＝ '+a};},
 function(v){for(var z=0;z<=v.N;z++)if(z+v.y===v.N-v.s[1])return z+'人';return '';},{N:240,s:[200,185,160],x:140,y:30});
/* 181 3つの分類 */
function q181(v){return v.N+'冊の本を分類したところ、心理学に分類できる本が'+v.H+'冊、教育学に分類できる本が'+v.E+'冊、社会学に分類できる本が'+v.S+'冊あった。';}
function g181(R){var mm=R.int(1,3),x=3*mm,ce=R.int(x+3,x+15),H=R.int(ce+mm+20,ce+mm+50),E=R.int(ce+6*mm+3,ce+6*mm+20),Sd=R.int(15,40),n=R.int(8,30);
 return {N:H+E-ce+Sd+n,H:H,E:E,S:Sd+10*mm,ce:ce,Sd:Sd,mm:mm};}
var o181={N:150,H:70,E:40,S:64,ce:15,Sd:34,mm:3},B=I('冊');
T(SG,4,'181-1',g181,function(v,R){var a=v.E-v.ce;var ch=CH(R,a,[v.ce,v.H-v.ce,v.E,v.H-v.E,a-20],B,5,false,5);
 return {q:q181(v)+'心理学と教育学の両方に分類できる本が'+v.ce+'冊あった。心理学には分類できないが教育学に分類できる本は何冊か。',c:ch.c,a:ch.a,
  inw:'本を「心理学○・×」と「教育学○・×」で分ける（社会学の数字は使わない）',fig:KAR('心理学','教育学',[v.ce,'',v.H],['!?','',v.N-v.H],[v.E,'',v.N]),
  calc:'教育学 '+v.E+' − 両方 '+v.ce+' ＝ '+a};},
 function(v){for(var z=0;z<=v.N;z++)if(z+v.ce===v.E)return z+'冊';return '';},o181);
T(SG,4,'181-2',g181,function(v,R){var u=v.H+v.E-v.ce,a=v.N-u-v.Sd;var ch=CH(R,a,[v.N-v.H-v.E-v.Sd+v.ce*0+ (v.ce>0?0:0) + 0 + (v.N-v.H-v.E-v.Sd>0?0:100),a+15,v.N-u,v.Sd-a,a-15],B,5,false,10);
 return {q:q181(v)+'心理学と教育学の両方に分類できる本が'+v.ce+'冊あった。この条件に加えて、社会学だけに分類できる本は'+v.Sd+'冊あった。心理学、教育学、社会学のいずれにも分類できない本は何冊か。',c:ch.c,a:ch.a,
  inw:'本を「心理学か教育学に分類できる本」「社会学だけの本」「どれでもない本」に分ける',
  fig:{table:{head:['','冊数'],rows:[['心理学か教育学',v.H+' ＋ '+v.E+' − '+v.ce+' ＝ '+u],['社会学だけ',v.Sd],['どれでもない','!?'],['計',v.N]]}},
  calc:'心理学か教育学 '+v.H+' ＋ '+v.E+' − '+v.ce+' ＝ '+u+'<br>どれでもない '+v.N+' − '+u+' − '+v.Sd+' ＝ '+a};},
 function(v){for(var z=0;z<=v.N;z++)if(v.H+v.E-v.ce+v.Sd+z===v.N)return z+'冊';return '';},o181);
T(SG,5,'181-3',g181,function(v,R){var x=3*v.mm;var ch=CH(R,x,[x-1,x+1,x-2,x+2],B,5,false,1);
 return {q:q181(v)+'心理学と教育学の両方に分類できる本が'+v.ce+'冊あった。また、社会学だけに分類できる本は'+v.Sd+'冊あった。これらの条件に加えて、心理学、教育学、社会学のすべてに分類できる本は、心理学と社会学だけに分類できる本の3倍、教育学と社会学だけに分類できる本の半分であった。すべてに分類できる本は何冊か。',c:ch.c,a:ch.a,
  inw:'社会学の本を「社会学だけ」「心理学と社会学だけ」「教育学と社会学だけ」「すべて」の4つに分ける。心理学と社会学だけを1とすると、すべて＝3、教育学と社会学だけ＝6',
  fig:{table:{head:['社会学の内訳','比','冊数'],rows:[['社会学だけ','',v.Sd],['心理学と社会学だけ','1',''],['教育学と社会学だけ','6',''],['すべて','3','!?'],['社会学の計','',v.S]]}},
  calc:'社会学だけ以外 '+v.S+' − '+v.Sd+' ＝ '+(v.S-v.Sd)+'<br>比の合計 1 ＋ 6 ＋ 3 ＝ 10 → 1 ＝ '+(v.S-v.Sd)/10+'<br>すべて '+(v.S-v.Sd)/10+' × 3 ＝ '+x};},
 function(v){for(var x=0;x<=v.S;x+=3)if(v.Sd+x/3+2*x+x===v.S)return x+'冊';return '';},o181);

/* ===================== 表の解釈 問182〜189 ===================== */
function pc(x){return fx(x/10,1)+'%';}  /* 0.1%単位の整数 → 表示 */
/* 182 原子の個数比（0.1%単位の整数で持つ） */
var EL=['水素','炭素','酸素','窒素'],WT=[1,12,16,14];
function row182(R){var h=R.int(550,650),c=R.int(120,260),o=R.int(80,220),n=R.int(10,50),ot=1000-h-c-o-n;if(ot<5||ot>25)return null;return [h,c,o,n,ot];}
function g182(R){var r=[row182(R),row182(R),row182(R)];if(!r[0]||!r[1]||!r[2])return null;return {r:r,f:R.int(0,3)};}
function q182(v){return 'ある有機化合物P、Q、Rは、水素、炭素、酸素、窒素、その他の元素で構成されている。P、Q、Rの1分子中の各元素の原子個数比は下表の通りである。なお、各元素の重量比は、水素を1としたとき、炭素は12、酸素は16、窒素は14であるとする。'+
 TB(['','水素','炭素','酸素','窒素','その他','合計'],['P','Q','R'].map(function(nm,i){return [nm].concat(v.r[i].map(pc)).concat(['100%']);}));}
var o182={r:[[623,221,108,35,13],[609,246,121,16,8],[589,250,115,40,6]],f:0};
T(HY,4,'182-1',function(R){var v=g182(R);if(!v)return null;var w=v.r[0].slice(0,4).map(function(x,i){return x*WT[i];}).sort(function(a,b){return b-a;});return w[0]===w[1]?null:v;},
 function(v,R){var w=v.r[0].slice(0,4).map(function(x,i){return x*WT[i];}),mx=0;w.forEach(function(x,i){if(x>w[mx])mx=i;});var ch=FIX(EL.concat(['上の表からは決まらない']),EL[mx]);
 return {q:q182(v)+'化合物P1分子中に占める水素、炭素、酸素、窒素の各元素のうちで、重量が最大のものはどれか。',c:ch.c,a:ch.a,
  inw:'各元素の重量 ＝ 個数の割合 × 重量比',fig:{table:{head:['元素','個数の割合','重量比','重量'],rows:EL.map(function(e,i){return [e,pc(v.r[0][i]),WT[i],fx(v.r[0][i]*WT[i]/10,1)+(i===mx?'（最大）':'')];})}},
  calc:EL.map(function(e,i){return e+' '+fx(v.r[0][i]/10,1)+' × '+WT[i]+' ＝ '+fx(v.r[0][i]*WT[i]/10,1);}).join('<br>')};},
 function(v){var best=null,bw=-1;for(var i=0;i<4;i++){var w=v.r[0][i]*WT[i];if(w>bw){bw=w;best=EL[i];}}return best;},o182);
var FR2=[['1/2',1,2],['1/3',1,3],['1/4',1,4],['2/3',2,3]];
T(HY,5,'182-2',g182,function(v,R){var Q=v.r[1],Rr=v.r[2],f=FR2[v.f],nr=f[1]/f[2]*Q[3]/Rr[3],a=Rr[1]/Q[1]*nr,fm=function(x){return fx(x,2)+'倍';};
 var ch=CH(R,a,[Rr[1]/Q[1],nr,Rr[1]/Q[1]*f[1]/f[2],a*2,a+0.02],fm,4,true,0.03);
 return {q:q182(v)+'化合物R1分子中の窒素の原子の個数が、化合物Qのそれの'+f[0]+'であるとき、化合物R1分子中の炭素の原子の個数は、化合物Qのそれの何倍か（必要なときは、最後に小数第3位を四捨五入すること）。',c:ch.c,a:ch.a,
  inw:'まず窒素の個数から「Rの原子の総数はQの何倍か」を出し、それに炭素の割合をかける',
  fig:{table:{head:['','窒素の割合','原子の総数','炭素の割合','炭素の個数'],rows:[['Q',pc(Q[3]),'1',pc(Q[1]),fx(Q[1]/1000,3)],['R',pc(Rr[3]),fx(nr,4),pc(Rr[1]),'!?']]}},
  calc:'Qの総数を1とすると、Rの窒素 ＝ '+fx(Q[3]/1000,3)+' × '+f[0]+'<br>Rの総数 ＝ '+fx(Q[3]/1000,3)+' × '+f[0]+' ÷ '+fx(Rr[3]/1000,3)+' ＝ '+fx(nr,4)+'<br>炭素 R ÷ Q ＝ '+fx(nr,4)+' × '+fx(Rr[1]/1000,3)+' ÷ '+fx(Q[1]/1000,3)+' ＝ '+fx(a,2)};},
 function(v){var Q=v.r[1],Rr=v.r[2],f=FR2[v.f];var qn=1000*Q[3],rn=qn*f[1]/f[2],rt=rn/Rr[3],rc=rt*Rr[1],qc=1000*Q[1];return fx(rc/qc,2)+'倍';},o182);
/* 183 水溶液の重量百分率（0.1%単位の整数） */
var DR=['a','b','c','d'];
function g183(R){var t=[0,1,2].map(function(){return [R.int(10,40),R.int(10,90),R.int(5,30),R.int(5,25)];});return {t:t,g:R.pick([10,12,15,18,20,24,25,30]),x:R.int(1,6)*100,y:R.int(1,6)*100};}
function q183(v){return '3種類の水溶液X、Y、Zに含まれる薬品a、b、c、dの重量百分率（%）は、下表の通りである。'+TB(['','薬品a','薬品b','薬品c','薬品d'],['水溶液X','水溶液Y','水溶液Z'].map(function(nm,i){return [nm].concat(v.t[i].map(function(x){return fx(x/10,1);}));}));}
var o183={t:[[30,18,25,8],[20,85,10,18],[15,42,14,12]],g:20,x:200,y:400};
T(HY,4,'183-1',function(R){var v=g183(R);var b=v.g*v.t[0][1]/v.t[0][0];return Math.abs(b-Math.floor(b)-0.5)<0.01?null:v;},
 function(v,R){var X=v.t[0],b=v.g*X[1]/X[0];var ch=CH(R,b,[v.g*X[0]/X[1],v.g*X[1]/10,v.g-X[1]/10*2,b+4,b+6],I('g'),4,true,2);
 return {q:q183(v)+'ある一定量の水溶液Xに含まれる薬品aの重さが'+v.g+'gのとき、同水溶液に含まれる薬品bの重さは何gか（必要なときは、最後に小数第1位を四捨五入すること）。',c:ch.c,a:ch.a,
  inw:'同じ水溶液の中では、重さの比 ＝ 百分率の比',fig:{table:{head:['水溶液X','百分率','重さ'],rows:[['薬品a',fx(X[0]/10,1)+'%',v.g+'g'],['薬品b',fx(X[1]/10,1)+'%','!?']]}},
  calc:v.g+' × '+fx(X[1]/10,1)+' ÷ '+fx(X[0]/10,1)+' ＝ '+k(b,2)+' → '+k(b,0)+'g'};},
 function(v){var X=v.t[0],tot=v.g/(X[0]/1000);return Math.round(tot*X[1]/1000)+'g';},o183);
var RT=['1:2','2:1','1:3','3:1','2:3','3:2','3:4','4:3','1:4','4:1','2:5','5:2','3:5','5:3','1:1'];
function gcd(a,b){return b?gcd(b,a%b):a;}
T(HY,5,'183-2',function(R){var v=g183(R),X=v.t[0][3],Y=v.t[1][3],Zd=v.t[2][3];if(!((X<Zd&&Zd<Y)||(Y<Zd&&Zd<X)))return null;var p=Math.abs(Y-Zd),q=Math.abs(Zd-X),g=gcd(p,q);if(p/g>5||q/g>5)return null;return v;},
 function(v,R){var X=v.t[0][3],Y=v.t[1][3],Zd=v.t[2][3],p=Math.abs(Y-Zd),q=Math.abs(Zd-X),g=gcd(p,q),ans=(p/g)+':'+(q/g),rev=(q/g)+':'+(p/g);
 var pool=RT.filter(function(s){return s!==ans&&s!==rev;});var list=[ans];if(rev!==ans)list.push(rev);while(list.length<4){var s=R.pick(pool);if(list.indexOf(s)<0)list.push(s);}
 if(R.int(1,6)===1)list[0]=R.pick(pool.filter(function(s){return list.indexOf(s)<0;}));
 list.sort(function(a,b){var A=a.split(':'),B=b.split(':');return A[0]/A[1]-B[0]/B[1];});var ch=FIX(list.map(function(s){return s.replace(':','：');}),ans.replace(':','：'),5);
 return {q:q183(v)+'水溶液XとYを混合してできる新しい水溶液に含まれる薬品dの重量百分率を、水溶液Zのそれと等しくしたい。水溶液XとYを、どのような割合で混ぜればよいか。',c:ch.c,a:ch.a,
  inw:'混ぜた後の'+fx(Zd/10,1)+'%との差が、Xは'+fx(q/10,1)+'、Yは'+fx(p/10,1)+'。重さの比は差の逆の比になる（てんびん）',
  fig:{table:{head:['','薬品dの%','Zとの差','混ぜる比'],rows:[['X',fx(X/10,1),fx(q/10,1),'!'+(p/g)],['Y',fx(Y/10,1),fx(p/10,1),'!'+(q/g)],['Z',fx(Zd/10,1),'','']]}},
  calc:'X：Y ＝ Yとの差：Xとの差 ＝ '+fx(p/10,1)+'：'+fx(q/10,1)+' ＝ '+ans.replace(':','：')+'<br>確かめ：('+fx(X/10,1)+' × '+(p/g)+' ＋ '+fx(Y/10,1)+' × '+(q/g)+') ÷ '+(p/g+q/g)+' ＝ '+fx(Zd/10,1)};},
 function(v){var X=v.t[0][3],Y=v.t[1][3],Zd=v.t[2][3];for(var a=1;a<=5;a++)for(var b=1;b<=5;b++)if(gcd(a,b)===1&&X*a+Y*b===Zd*(a+b))return a+'：'+b;return '';},o183);
T(HY,5,'183-3',function(R){var v=g183(R),X=v.t[0],Y=v.t[1];if(X[0]*Y[2]-Y[0]*X[2]===0||v.x===v.y)return null;return v;},
 function(v,R){var X=v.t[0],Y=v.t[1],A=k((X[0]*v.x+Y[0]*v.y)/1000,1),C=k((X[2]*v.x+Y[2]*v.y)/1000,1);var ch=CH(R,v.x,[v.y,v.x+100,v.x-100,v.x+200],I('g'),4,true,100);
 return {q:q183(v)+'水溶液XとYを混合して水溶液Pを作った。水溶液Pに含まれる薬品aは'+A+'g、薬品cは'+C+'gであったとき、水溶液Xは何g混合したか（必要なときは、最後に小数第1位を四捨五入すること）。',c:ch.c,a:ch.a,
  inw:'Xを x g、Yを y g とおき、薬品aと薬品cの重さで式を2本たてる',fig:{table:{head:['','X（x g）','Y（y g）','P'],rows:[['薬品a',fx(X[0]/10,1)+'%',fx(Y[0]/10,1)+'%',A+'g'],['薬品c',fx(X[2]/10,1)+'%',fx(Y[2]/10,1)+'%',C+'g'],['重さ','!?','','']]}},
  calc:fx(X[0]/1000,3)+'x ＋ '+fx(Y[0]/1000,3)+'y ＝ '+A+'<br>'+fx(X[2]/1000,3)+'x ＋ '+fx(Y[2]/1000,3)+'y ＝ '+C+'<br>yを消して x ＝ '+v.x+'（y ＝ '+v.y+'）'};},
 function(v){var X=v.t[0],Y=v.t[1],A=(X[0]*v.x+Y[0]*v.y),C=(X[2]*v.x+Y[2]*v.y),D=X[0]*Y[2]-Y[0]*X[2];return Math.round((A*Y[2]-Y[0]*C)/D)+'g';},o183);
/* 184 混合気体（0.01%単位の整数で持つ） */
var GS=['メタン','エタン','プロパン','ブタン','ペンタン','その他'],GW=[1.0,1.8,2.8,3.6,4.5];
function col184(R,zero){var e=R.int(30,110)*10,p=R.int(20,50)*10,b=zero&&R.int(0,1)?0:R.int(0,30)*10,pe=R.int(2,25)*10,ot=zero?0:R.pick([0,5,10,15,20,25])*R.int(1,8);var mth=10000-e-p-b-pe-ot;if(mth<7500||mth>9000)return null;return [mth,e,p,b,pe,ot];}
function g184(R){var c=[col184(R),col184(R,1),col184(R)];if(!c[0]||!c[1]||!c[2])return null;return {c:c,w:R.int(40,90),u:R.pick([2,2.5,3,4])};}
function q184(v){return '混合気体X、Y、Zがそれぞれ封入されている3つの容器がある。各容器に含まれる気体の構成体積比率（%）は、下表の通りである。なお、メタンを1としたときの比重は（　）内の通りとする。'+
 TB(['','X','Y','Z'],GS.map(function(g,i){return [g+(i<5?'（'+fx(GW[i],1)+'）':'')].concat(v.c.map(function(c){return String(k(c[i]/100,2));}));}).concat([['合計','100','100','100']]));}
var o184={c:[[8000,1000,380,260,220,140],[9000,550,350,0,100,0],[8400,600,480,290,25,205]],w:56,u:3};
T(HY,4,'184-1',g184,function(v,R){var X=v.c[0],a=v.w*X[1]*1.8/X[0];var ch=CH(R,a,[v.w/X[0]*100,v.w*X[1]/X[0],v.w*1.8/X[0]*100,a*1.5,a+1],function(x){return fx(x,2)+'g';},4,true,0.5);
 return {q:q184(v)+'混合気体Xに含まれるメタンの重量は'+v.w+'gだった。混合気体Xに含まれるエタンの重量はどれだけか（必要があれば、最後に小数第3位を四捨五入すること）。',c:ch.c,a:ch.a,
  inw:'重量 ＝ 体積の割合 × 比重。メタンの重量から「体積1%あたり・比重1あたりの重さ」を出す',
  fig:{table:{head:['','体積%','比重','重量'],rows:[['メタン',k(X[0]/100,2),'1.0',v.w+'g'],['エタン',k(X[1]/100,2),'1.8','!?']]}},
  calc:'1%あたり '+v.w+' ÷ '+k(X[0]/100,2)+' ＝ '+k(v.w*100/X[0],4)+'g<br>エタン '+k(v.w*100/X[0],4)+' × '+k(X[1]/100,2)+' × 1.8 ＝ '+fx(a,2)+'g'};},
 function(v){var X=v.c[0],tot=v.w/(X[0]*1.0)*(X[0]+0);return fx(tot*X[1]*1.8/X[0]*X[0]/X[0],2)+'g';},o184);
T(HY,5,'184-2',function(R){var v=g184(R);if(!v)return null;var Y=v.c[1],s=0;for(var i=1;i<5;i++)s+=Y[i]/100*GW[i];var W=v.u*s;return k(W,1)===k(W,6)?v:null;},
 function(v,R){var Y=v.c[1],s=0;for(var i=1;i<5;i++)s+=Y[i]/100*GW[i];var W=k(v.u*s,1),a=v.u*Y[4]/100*4.5;
 var ch=CH(R,a,[v.u*Y[4]/100,W*Y[4]/(10000-Y[0]),W*Y[4]/(10000-Y[0])*4.5,a+3],F1('g'),4,true,1);
 return {q:q184(v)+'混合気体Yからメタンを除いたときの重量は'+W+'gだった。混合気体Yのペンタンの重量はどれだけか（必要があれば、最後に小数第2位を四捨五入すること）。',c:ch.c,a:ch.a,
  inw:'メタン以外の気体の「体積% × 比重」を合計し、'+W+'gと比べて1あたりの重さを出す',
  fig:{table:{head:['Y','体積%','比重','% × 比重'],rows:[1,2,3,4].map(function(i){return [GS[i],k(Y[i]/100,2),fx(GW[i],1),k(Y[i]/100*GW[i],4)];}).concat([['合計','','',k(s,4)+' → '+W+'g']])}},
  calc:'メタン以外の合計 '+k(s,4)+' が '+W+'g → 1あたり '+W+' ÷ '+k(s,4)+' ＝ '+v.u+'g<br>ペンタン '+k(Y[4]/100,2)+' × 4.5 × '+v.u+' ＝ '+fx(a,1)+'g'};},
 function(v){var Y=v.c[1],s=0;for(var i=1;i<5;i++)s+=Y[i]/100*GW[i];var W=k(v.u*s,1);return fx(W*(Y[4]/100*4.5)/s,1)+'g';},o184);
/* 185 4県の人口割合 */
var AG=['① 0〜14歳','② 15〜39歳','③ 40〜64歳','④ 65歳以上'],KN=['W県','X県','Y県','Z県'];
function g185(R){var cols=[0,1,2,3].map(function(){var a=R.int(2,4)*5,e=R.int(3,5)*5,b=R.int(5,8)*5,c=100-a-b-e;return c<15?null:[a,b,c,e];});if(cols.some(function(x){return !x;}))return null;
 var w=R.shuffle([10,20,30,40]);return {cols:cols,w:w};}
function q185(v){var t=0;v.cols.forEach(function(c,i){t+=c[0]*v.w[i]/100;});
 return '下表は、W、X、Y、Zの4県における年代別の人口割合を百分率（%）で示したものである（2020年調べ）。ただし、最下欄の数字は、各県の人数が全4県の人数に対して占める百分率である。'+
 TB(['','W県','X県','Y県','Z県','全4県'],AG.map(function(g,j){return [g].concat(v.cols.map(function(c){return c[j];})).concat([j===0?fx(t,1):'□']);}).concat([['県／全4県（W+X+Y+Z）'].concat(v.w).concat([100])]));}
var DEC=[['3/4',3,4],['4/5',4,5],['2/3',2,3]],INC=[['2倍',2],['1.5倍',1.5],['1.25倍',1.25]];
var o185a={cols:[[15,30,40,15],[10,30,35,25],[15,35,30,20],[20,40,20,20]],w:[40,20,30,10],d:0,i:0};
T(HY,5,'185-1',function(R){var v=g185(R);if(!v)return null;v.d=R.int(0,2);v.i=R.int(0,2);var Y=v.cols[2];if((Y[0]*DEC[v.d][2])%DEC[v.d][1])return null;return v;},
 function(v,R){var Y=v.cols[2],d=DEC[v.d],i=INC[v.i],a0=Y[0]*d[2]/d[1],e0=Y[3]/i[1],T0=a0+Y[1]+Y[2]+e0,a=e0/T0*100;
 var ch=CH(R,a,[e0,Y[3],Y[3]/T0*100*0.8,e0/(100)*100*1.2,a+1.5],F1('%'),4,true,1);
 return {q:q185(v)+'Y県では10年前に比べて、0〜14歳の人口が'+d[0]+'に減り、65歳以上の人口が'+i[0]+'に増え、そのほかの人口は横ばいだった。10年前の時点で、Y県の人口に対して65歳以上の人口が占める比率は何%であったか（必要があれば、最後に小数第2位を四捨五入すること）。',c:ch.c,a:ch.a,
  inw:'今のY県を100とし、各年代の10年前の人数を逆算する（'+d[0]+'に減った → ÷'+d[0]+'、'+i[0]+'に増えた → ÷'+i[1]+'）',
  fig:{table:{head:['Y県','今','10年前'],rows:[['0〜14歳',Y[0],k(a0,3)],['15〜64歳',Y[1]+Y[2],Y[1]+Y[2]],['65歳以上',Y[3],k(e0,3)],['計',100,k(T0,3)]]}},
  calc:'0〜14歳 '+Y[0]+' ÷ '+d[0]+' ＝ '+k(a0,3)+'、65歳以上 '+Y[3]+' ÷ '+i[1]+' ＝ '+k(e0,3)+'<br>10年前の計 '+k(a0,3)+' ＋ '+(Y[1]+Y[2])+' ＋ '+k(e0,3)+' ＝ '+k(T0,3)+'<br>'+k(e0,3)+' ÷ '+k(T0,3)+' ＝ '+fx(a,1)+'%'};},
 function(v){var Y=v.cols[2],d=DEC[v.d],i=INC[v.i];var pop=[Y[0]/(d[1]/d[2]),Y[1],Y[2],Y[3]/i[1]];var s=pop[0]+pop[1]+pop[2]+pop[3];return fx(pop[3]*100/s,1)+'%';},o185a);
var ORD=['①、②、③、④','①、②、④、③','①、③、②、④','②、③、④、①','②、④、③、①','③、②、①、④','③、②、④、①','④、②、③、①','④、③、②、①'];
function svg185(ix){var W=300,H=190,x=[60,160,260],y=function(t){return 10+(130-t)*2;},st=['#000','#999','#000','#000'],da=['','','6,4','2,3'];
 var s='<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-width:360px" role="img" aria-label="指数のグラフ">';
 for(var t=50;t<=130;t+=10)s+='<line x1="35" x2="290" y1="'+y(t)+'" y2="'+y(t)+'" stroke="#ccc"/><text x="30" y="'+(y(t)+4)+'" font-size="10" text-anchor="end">'+t+'</text>';
 ['2000','2010','2020年'].forEach(function(l,i){s+='<text x="'+x[i]+'" y="'+(H-2)+'" font-size="10" text-anchor="middle">'+l+'</text>';});
 var lab=['0〜14歳','15〜39歳','40〜64歳','65歳以上'];
 ix.forEach(function(p,j){var pts=[p[0],p[1],100];s+='<polyline fill="none" stroke="'+st[j]+'" stroke-width="1.5"'+(da[j]?' stroke-dasharray="'+da[j]+'"':'')+' points="'+pts.map(function(t,i){return x[i]+','+y(t);}).join(' ')+'"/>';
  pts.forEach(function(t,i){s+='<circle cx="'+x[i]+'" cy="'+y(t)+'" r="3"/>';});s+='<text x="'+(x[0]+8)+'" y="'+(y(p[0])+(j%2?-6:14))+'" font-size="10">'+lab[j]+'</text>';});
 return s+'</svg>';}
var o185b={cols:o185a.cols,w:o185a.w,ix:[[110,120],[120,110],[80,90],[60,80]]};
T(HY,4,'185-2',function(R){var v=g185(R);if(!v)return null;var X=v.cols[1];v.ix=[0,1,2,3].map(function(){return [R.int(5,13)*10,R.int(5,13)*10];});
 var p=X.map(function(c,j){return c*v.ix[j][0];});for(var i=0;i<4;i++)for(var j=i+1;j<4;j++)if(p[i]===p[j]||v.ix[i][0]===v.ix[j][0])return null;return v;},
 function(v,R){var X=v.cols[1],p=X.map(function(c,j){return c*v.ix[j][0];}),od=[0,1,2,3].sort(function(a,b){return p[b]-p[a];}),ans=od.map(function(j){return '①②③④'.charAt(j);}).join('、');
 var ch=FIX(ORD,ans,10);
 return {q:q185(v)+'次の図は2000年、2010年、2020年のX県の各年代別人口の推移を2020年を100とした指数で示したものである。2000年におけるX県の各年代別人口を多い順に並べた結果を、AからJまでの中で選びなさい。ただし、①は0〜14歳、②は15〜39歳、③は40〜64歳、④は65歳以上とする。'+svg185(v.ix),c:ch.c,a:ch.a,
  inw:'2000年の人数 ∝ 2020年の割合（表のX県）× 2000年の指数',
  fig:{table:{head:['X県','2020年の割合','2000年の指数','2000年（割合×指数）'],rows:[0,1,2,3].map(function(j){return [AG[j],X[j],v.ix[j][0],k(X[j]*v.ix[j][0]/100,2)];})}},
  calc:[0,1,2,3].map(function(j){return '①②③④'.charAt(j)+' '+X[j]+' × '+fx(v.ix[j][0]/100,1)+' ＝ '+k(X[j]*v.ix[j][0]/100,2);}).join('<br>')+'<br>多い順 '+ans};},
 function(v){var X=v.cols[1],r=[];for(var j=0;j<4;j++){var c=0;for(var i=0;i<4;i++)if(X[i]*v.ix[i][0]>X[j]*v.ix[j][0])c++;r[c]='①②③④'.charAt(j);}return r.join('、');},o185b);
/* 186 2日間のイベント */
function q186(v){return 'ある施設では、毎年2日連続で開催されるイベントがある。表1は、過去3年間のイベントの延べ入場者数とその内訳を示したものである。表2は、イベントで発売された「1日入場券」と「2日入場券」の購入者数を示したものである。なお、「2日入場券」を購入しても2日間とも入場したとは限らないが、入場券を購入して1日も入場しなかった人はいなかったものとする。'+
 '<br>【表1】過去3年間の延べ入場者数とその内訳'+TB(['','一昨年','昨年','今年'],[['延べ入場者数','ア',v.L+'人',v.N+'人'],['1日目',v.p[0]+'%',v.p[1]+'%',v.p[2]+'%'],['2日目',(100-v.p[0])+'%',(100-v.p[1])+'%',(100-v.p[2])+'%'],['計','100%','100%','100%']])+
 '【表2】入場券の購入者数'+TB(['','一昨年','昨年','今年'],[['「1日入場券」購入者',v.o1+'人','イ',v.n1+'人'],['「2日入場券」購入者',v.o2+'人',v.l2+'人','ウ']]);}
function g186(R){var L=R.int(20,40)*100,p=[R.int(3,7)*10,R.int(4,7)*10,R.int(45,60)],u=R.int(8,15)*100,r=R.pick([80,90,90,70]),n1=R.int(9,15)*100,N=n1+u*(100+r)/100;
 return {L:L,N:N,p:p,o1:R.int(4,8)*100,o2:R.int(6,10)*100,l2:R.int(8,12)*100,n1:n1,u:u,r:r};}
var o186={L:2800,N:3200,p:[30,60,52],o1:500,o2:800,l2:1000,n1:1300,u:1000,r:90};
T(HY,4,'186-1',function(R){var v=g186(R);var a=v.L*(100-v.p[1])/(100-v.p[0]);return a%1?null:v;},
 function(v,R){var d2=v.L*(100-v.p[1])/100,a=d2*100/(100-v.p[0]);var ch=CH(R,a,[d2,d2*100/v.p[0],v.L*2,a*1.5],P,4,true,200);
 return {q:q186(v)+'一昨年の2日目の入場者数は、昨年の2日目の入場者数と同じだった。一昨年の延べ入場者数アは何人か。',c:ch.c,a:ch.a,
  inw:'昨年の2日目の人数を出し、それが一昨年の延べ入場者数の'+(100-v.p[0])+'%にあたる',
  fig:{table:{head:['','延べ','2日目の割合','2日目の人数'],rows:[['昨年',v.L,(100-v.p[1])+'%',d2],['一昨年','!?',(100-v.p[0])+'%',d2]]}},
  calc:'昨年の2日目 '+v.L+' × '+(100-v.p[1])/100+' ＝ '+d2+'<br>ア ＝ '+d2+' ÷ '+(100-v.p[0])/100+' ＝ '+a};},
 function(v){for(var a=1;a<=20000;a++)if(a*(100-v.p[0])===v.L*(100-v.p[1]))return a+'人';return '';},o186);
T(HY,5,'186-2',function(R){var v=g186(R);return v.L-2*v.l2>=100?v:null;},
 function(v,R){var a=v.L-2*v.l2;var ch=CH(R,a,[v.L-v.l2,v.L*v.p[1]/100-v.l2,v.L*(100-v.p[1])/100-v.l2,(v.L-v.l2)/2-v.l2/2+ (a>0?120:0)],P,4,true,120);
 return {q:q186(v)+'昨年の「2日入場券」購入者は、全員2日間とも入場した。昨年の「1日入場券」購入者数イは何人か。',c:ch.c,a:ch.a,
  inw:'延べ入場者数を「2日入場券の人（1人で2回）」と「1日入場券の人（1人で1回）」に分ける',
  fig:{table:{head:['昨年','人数','入場回数','延べ'],rows:[['2日入場券',v.l2,2,2*v.l2],['1日入場券','!?',1,''],['計','','',v.L]]}},
  calc:'2日入場券の延べ '+v.l2+' × 2 ＝ '+(2*v.l2)+'<br>イ ＝ '+v.L+' − '+(2*v.l2)+' ＝ '+a};},
 function(v){for(var a=0;a<=v.L;a++)if(a+2*v.l2===v.L)return a+'人';return '';},o186);
T(HY,5,'186-3',g186,function(v,R){var u=(v.N-v.n1)*100/(100+v.r);var ch=CH(R,u,[(v.N-v.n1)/2,(v.N-v.n1)*v.r/100,v.N-v.n1,(v.N-v.n1)*100/(200-v.r)],P,4,true,100);
 return {q:q186(v)+'今年の「2日入場券」購入者のうち、'+v.r+'%が2日間とも入場した。今年の「2日入場券」購入者ウは何人か。',c:ch.c,a:ch.a,
  inw:'2日入場券の人を1とすると、延べの入場は「'+v.r+'%は2回、残りは1回」で 1 ＋ '+v.r/100+' ＝ '+(100+v.r)/100,
  fig:{table:{head:['今年','人数','延べ'],rows:[['1日入場券',v.n1,v.n1],['2日入場券','!?',(v.N-v.n1)+'（＝ウ × '+(100+v.r)/100+'）'],['計','',v.N]]}},
  calc:'2日入場券の延べ '+v.N+' − '+v.n1+' ＝ '+(v.N-v.n1)+'<br>ウ ＝ '+(v.N-v.n1)+' ÷ '+(100+v.r)/100+' ＝ '+k(u,2)};},
 function(v){for(var u=0;u<=v.N;u++)if(u*2*v.r+u*(100-v.r)===(v.N-v.n1)*100)return u+'人';return '';},o186);
/* 187 列車の下車人数と運賃 */
function fare(d){return d<=10?140:d<=30?400:d<=50?600:d<=80?800:1000;}
function g187(R){var q=R.int(20,45),r=q+R.int(15,30),s=r+R.int(30,50);if(s>110)return null;return {q:q,r:r,s:s,n:[R.int(10,35),R.int(10,35),R.int(10,35),R.int(10,35),R.int(10,35),R.int(10,35)],cap:R.pick([100,100,80,120])};}
function q187(v){var n=v.n;return 'ある列車Aは、始発駅のP駅を出発した後、順にQ駅、R駅の2駅に停車して、終点のS駅に到着する。表1は、P駅からQ駅、R駅、S駅までの距離と、乗車駅別にみた各駅での下車人数を示したものである。また、表2は、乗車駅からの距離別の運賃を示している。'+
 '<br>【表1】各駅での下車人数'+TB(['P駅からの距離','下車＼乗車','P駅','Q駅','R駅'],[[v.q+'km','Q駅',n[0]+'人','—','—'],[v.r+'km','R駅',n[1]+'人',n[3]+'人','—'],[v.s+'km','S駅',n[2]+'人',n[4]+'人',n[5]+'人']])+
 '【表2】距離別運賃'+TB(['距離','10kmまで','30kmまで','50kmまで','80kmまで','110kmまで'],[['運賃','140円','400円','600円','800円','1000円']]);}
var o187={q:38,r:60,s:108,n:[28,18,32,20,15,23],cap:100};
T(HY,4,'187-1',g187,function(v,R){var n=v.n,a=n[1]+n[2]+n[3]+n[4];var ch=CH(R,a,[n[3],n[1]+n[3],n[2]+n[4]+n[5],a-15],P,4,true,10);
 return {q:q187(v)+'Q駅からR駅の間、列車Aに乗っている人は何人か。',c:ch.c,a:ch.a,
  inw:'Q〜R間に乗っているのは「Q駅より前で乗り、R駅より後で降りる人」',
  fig:{table:{head:['乗車＼下車','R駅','S駅'],rows:[['P駅',n[1],n[2]],['Q駅',n[3],n[4]]]}},
  calc:n[1]+' ＋ '+n[2]+' ＋ '+n[3]+' ＋ '+n[4]+' ＝ '+a};},
 function(v){var n=v.n,on=n[0]+n[1]+n[2];on=on-n[0]+n[3]+n[4];return on+'人';},o187);
T(HY,4,'187-2',g187,function(v,R){var n=v.n,f=[fare(v.s),fare(v.s-v.q),fare(v.s-v.r)],a=f[0]*n[2]+f[1]*n[4]+f[2]*n[5];
 var ch=CH(R,a,[f[0]*(n[2]+n[4]+n[5]),f[0]*n[2]+fare(v.s)*n[4]+fare(v.r)*n[5],a-3400,a-9400],I('円'),4,true,1000);
 return {q:q187(v)+'S駅で下車した人の乗車運賃の合計はどれだけか。',c:ch.c,a:ch.a,
  inw:'S駅で降りた人を乗車駅で3つに分け、乗った距離から運賃を表2で読む',
  fig:{table:{head:['乗車駅','距離','運賃','人数','合計'],rows:[['P駅',v.s+'km',f[0],n[2],f[0]*n[2]],['Q駅',(v.s-v.q)+'km',f[1],n[4],f[1]*n[4]],['R駅',(v.s-v.r)+'km',f[2],n[5],f[2]*n[5]],['計','','','','!'+a]]}},
  calc:f[0]+' × '+n[2]+' ＋ '+f[1]+' × '+n[4]+' ＋ '+f[2]+' × '+n[5]+' ＝ '+a+'円'};},
 function(v){var n=v.n,t=0;[[v.s,n[2]],[v.s-v.q,n[4]],[v.s-v.r,n[5]]].forEach(function(p){var y=[10,30,50,80,110].findIndex(function(b){return p[0]<=b;});t+=[140,400,600,800,1000][y]*p[1];});return t+'円';},o187);
T(HY,4,'187-3',g187,function(v,R){var n=v.n,l=[n[0]+n[1]+n[2],n[1]+n[2]+n[3]+n[4],n[2]+n[4]+n[5]],a=(l[0]+l[1]+l[2])/3/v.cap*100;
 var ch=CH(R,a,[(l[0]+l[1]+l[2])/v.cap*100,(l[0]+l[1]+l[2])/3/v.cap*100*0.583,(l[0]*v.q+l[1]*(v.r-v.q)+l[2]*(v.s-v.r))/v.s/v.cap*100,a*0.9],F1('%'),4,true,3);
 return {q:q187(v)+'列車Aの乗車定員数を'+v.cap+'人としたとき、P駅からS駅までの3区間の乗車率（乗車人数÷乗車定員数）の平均はどれだけか（必要なときは、最後に小数第2位を四捨五入すること）。',c:ch.c,a:ch.a,
  inw:'3区間それぞれの乗車人数を出し、乗車率の平均（＝乗車人数の平均 ÷ 定員）',
  fig:{table:{head:['区間','乗車人数','乗車率'],rows:[['P〜Q',l[0],k(l[0]/v.cap*100,2)+'%'],['Q〜R',l[1],k(l[1]/v.cap*100,2)+'%'],['R〜S',l[2],k(l[2]/v.cap*100,2)+'%'],['平均','','!?']]}},
  calc:'P〜Q '+l[0]+'、Q〜R '+l[1]+'、R〜S '+l[2]+'<br>（'+l[0]+' ＋ '+l[1]+' ＋ '+l[2]+'）÷ 3 ÷ '+v.cap+' ＝ '+fx(a,1)+'%'};},
 function(v){var n=v.n,t=0;t+=n[0]+n[1]+n[2];t+=n[1]+n[2]+n[3]+n[4];t+=n[2]+n[4]+n[5];return fx(t*100/(3*v.cap),1)+'%';},o187);
/* 188 平均点（平均は0.1点単位の整数で持つ） */
var SU=['物理','化学','生物'],CL=['P','Q','R','S'];
function g188(R){var n=[0,1,2,3].map(function(){var a=R.int(6,18),b=R.int(8,22);return 40-a-b<6?null:[a,b,40-a-b];});if(n.some(function(x){return !x;}))return null;
 var av=[0,1,2,3].map(function(){return [R.int(580,740),R.int(580,740),R.int(580,740)];});return {n:n,av:av};}
function q188(v){return 'ある学校の3年生は1クラス40人で、P、Q、R、Sの4クラスがあり、各クラスの全員が物理、化学、生物のいずれかの科目を選択して受験している。下表は各科目の受験者数と平均点を表したものの一部である。'+
 '<br>【表1】各クラス・各科目別受験者数　1クラスは40人'+TB(['','Pクラス','Qクラス','Rクラス','Sクラス'],SU.map(function(s,j){return [s].concat(v.n.map(function(c,i){return i===2&&j===1?'（　　）':i===2&&j===2?'（ ア ）':c[j]+'人';}));}))+
 '【表2】各クラス・各科目別平均点'+TB(['','Pクラス','Qクラス','Rクラス','Sクラス'],SU.map(function(s,j){return [s].concat(v.av.map(function(c){return fx(c[j]/10,1)+'点';}));}));}
var o188={n:[[8,20,12],[16,12,12],[10,20,10],[11,15,14]],av:[[720,707,695],[645,695,700],[650,700,630],[640,722,595]]};
T(HY,4,'188-1',function(R){var v=g188(R);if(!v)return null;var n=v.n[0],a=v.av[0],t=(n[0]*a[0]+n[1]*a[1]+n[2]*a[2])/400;return Math.abs(t*10-Math.floor(t*10)-0.5)<1e-6?null:v;},function(v,R){var n=v.n[0],a=v.av[0],t=(n[0]*a[0]+n[1]*a[1]+n[2]*a[2])/400;
 var ch=CH(R,t,[(a[0]+a[1]+a[2])/30,t+0.1,t-0.6,t-0.4],F1('点'),4,true,0.2);
 return {q:q188(v)+'Pクラスの3科目を合わせた平均点はいくつか（必要なときは、最後に小数第2位を四捨五入すること）。',c:ch.c,a:ch.a,
  inw:'合計点 ＝ 人数 × 平均点 を科目ごとに出して足し、40人で割る（3つの平均点の平均ではない）',
  fig:{table:{head:['Pクラス','人数','平均点','合計点'],rows:SU.map(function(s,j){return [s,n[j],fx(a[j]/10,1),k(n[j]*a[j]/10,1)];}).concat([['計',40,'!?',k(t*40,1)]])}},
  calc:SU.map(function(s,j){return n[j]+' × '+fx(a[j]/10,1);}).join(' ＋ ')+' ＝ '+k(t*40,1)+'<br>'+k(t*40,1)+' ÷ 40 ＝ '+k(t,3)+' → '+fx(t,1)+'点'};},
 function(v){var s=0,c=0;for(var j=0;j<3;j++){s+=v.n[0][j]*v.av[0][j];c+=v.n[0][j];}return fx(s/c/10,1)+'点';},o188);
T(HY,4,'188-2',function(R){var v=g188(R);if(!v)return null;var s=0,c=0;for(var i=0;i<4;i++){s+=v.n[i][0]*v.av[i][0];c+=v.n[i][0];}var t=s/c/10;return Math.abs(t*10-Math.floor(t*10)-0.5)<1e-6?null:v;},
 function(v,R){var s=0,c=0;for(var i=0;i<4;i++){s+=v.n[i][0]*v.av[i][0];c+=v.n[i][0];}var t=s/c/10;var ch=CH(R,t,[(v.av[0][0]+v.av[1][0]+v.av[2][0]+v.av[3][0])/40,t+1.8,t+4.4,t+6.1],F1('点'),4,true,0.4);
 return {q:q188(v)+'物理の全クラスの平均点はいくつか（必要なときは、最後に小数第2位を四捨五入すること）。',c:ch.c,a:ch.a,
  inw:'物理の合計点 ÷ 物理の受験者数（クラスの平均点の平均ではない）',
  fig:{table:{head:['物理','人数','平均点','合計点'],rows:CL.map(function(cl,i){return [cl+'クラス',v.n[i][0],fx(v.av[i][0]/10,1),k(v.n[i][0]*v.av[i][0]/10,1)];}).concat([['計',c,'!?',k(s/10,1)]])}},
  calc:'合計点 '+k(s/10,1)+'、人数 '+c+'<br>'+k(s/10,1)+' ÷ '+c+' ＝ '+k(t,3)+' → '+fx(t,1)+'点'};},
 function(v){var s=0,c=0;v.n.forEach(function(r,i){s+=r[0]*v.av[i][0];c+=r[0];});return fx(s/c/10,1)+'点';},o188);
T(HY,5,'188-3',function(R){var v=g188(R);if(!v)return null;var n=v.n[2],a=v.av[2];if(a[1]===a[2])return null;var tot=n[0]*a[0]+n[1]*a[1]+n[2]*a[2];if(tot%40)return null;v.G=tot/40;return v;},
 function(v,R){var x=v.n[2][2];var ch=CH(R,x,[x-1,x+1,x-2,x+2],P,4,true,1);
 return {q:q188(v)+'Rクラスの3科目を合わせた平均点が'+fx(v.G/10,1)+'点のとき、Rクラスの生物の受験者数（ア）は何人か。',c:ch.c,a:ch.a,
  inw:'生物の人数を x とすると、化学は '+(40-v.n[2][0])+' − x。合計点で式を1本たてる',
  fig:{table:{head:['Rクラス','人数','平均点'],rows:[['物理',v.n[2][0],fx(v.av[2][0]/10,1)],['化学',(40-v.n[2][0])+' − x',fx(v.av[2][1]/10,1)],['生物','!x',fx(v.av[2][2]/10,1)],['計',40,fx(v.G/10,1)]]}},
  calc:fx(v.av[2][0]/10,1)+' × '+v.n[2][0]+' ＋ '+fx(v.av[2][1]/10,1)+' ×（'+(40-v.n[2][0])+' − x）＋ '+fx(v.av[2][2]/10,1)+'x ＝ '+fx(v.G/10,1)+' × 40<br>x ＝ '+x};},
 function(v){var n=v.n[2],a=v.av[2];for(var x=0;x<=40-n[0];x++)if(n[0]*a[0]+(40-n[0]-x)*a[1]+x*a[2]===v.G*40)return x+'人';return '';},(function(){var o=JSON.parse(JSON.stringify(o188));o.G=670;return o;})());
/* 189 スキー場の交通手段 */
var MD=['乗用車','バス','電車','その他'],SK=['W','X','Y','Z'];
function g189(R){var s=null;for(var t=0;t<50&&!s;t++){var a=[R.int(2,8)*5,R.int(2,8)*5,R.int(2,8)*5];var z=100-a[0]-a[1]-a[2];if(z>=10&&z<=40)s=a.concat([z]);}if(!s)return null;
 var m=[0,1,2,3].map(function(){var a=R.int(1,6)*10,b=R.int(1,6)*10,c=R.int(1,3)*10,d=100-a-b-c;return d<10?null:[a,b,d,c];});if(m.some(function(x){return !x;}))return null;
 var car=0,ot=0;for(var i=0;i<4;i++){car+=s[i]*m[i][0]/100;ot+=s[i]*m[i][3]/100;}if(car%1||ot%1)return null;return {s:s,m:m,K:0};}
function q189(v){var car=0,ot=0;for(var i=0;i<4;i++){car+=v.s[i]*v.m[i][0]/100;ot+=v.s[i]*v.m[i][3]/100;}
 return 'ある町の4つのスキー場W、X、Y、Zで調査を行い、主に利用した交通手段を1つだけ挙げてもらった。表1は、回答結果にもとづいて、スキー場ごとに利用した交通手段の割合を示したものである。また表2は、スキー場ごとの回答者数が回答者数全体に占める割合を示している。'+
 '<br>【表1】利用した交通手段'+TB(['交通手段＼スキー場','W','X','Y','Z','合計'],MD.map(function(md,j){return [md].concat(v.m.map(function(c,i){return i===0&&(j===0||j===2)?'（　）':c[j]+'%';})).concat([j===0?car+'%':j===3?ot+'%':'（　）']);}).concat([['合計','100%','100%','100%','100%','100%']]))+
 '【表2】スキー場ごとの回答者数の割合'+TB(['','W','X','Y','Z','合計'],[['回答者の割合'].concat(v.s.map(function(x){return x+'%';})).concat(['100%'])]);}
var o189={s:[25,30,30,15],m:[[40,30,20,10],[50,20,20,10],[20,30,30,20],[20,60,10,10]],K:84};
T(HY,4,'189-1',function(R){var v=g189(R);if(!v)return null;var a=v.s[1]*v.m[1][2]/100;return Math.abs(a-Math.floor(a)-0.5)<1e-6?null:v;},
 function(v,R){var a=v.s[1]*v.m[1][2]/100;var ch=CH(R,a,[a/2,a*1.5,a*2,v.m[1][2]],I('%'),4,false,3);
 return {q:q189(v)+'スキー場Xで「電車」と答えた人は、4つのスキー場での回答者数全体の何%か（必要なときは、最後に小数第1位を四捨五入すること）。',c:ch.c,a:ch.a,
  inw:'全体 → スキー場X（'+v.s[1]+'%）→ そのうち電車（'+v.m[1][2]+'%）の2段の割合',fig:{rows:[[{n:'全体',r:'1',v:'',w:1}],[{n:'X',r:fx(v.s[1]/100,2),v:'',w:v.s[1]/100},{n:'',r:'',v:'',w:1-v.s[1]/100}],[{n:'Xの電車',r:fx(v.m[1][2]/100,2),v:'?',ask:1,w:v.s[1]/100*v.m[1][2]/100},{n:'',r:'',v:'',w:1-v.s[1]/100*v.m[1][2]/100}]]},
  calc:fx(v.s[1]/100,2)+' × '+fx(v.m[1][2]/100,2)+' ＝ '+k(a/100,4)+' → '+k(a,0)+'%'};},
 function(v){return Math.round(v.s[1]*v.m[1][2]/100)+'%';},o189);
T(HY,4,'189-2',function(R){var v=g189(R);if(!v)return null;var a=(v.s[3]*v.m[3][1])/(v.s[1]*v.m[1][1]);return Math.abs(a*10-Math.floor(a*10)-0.5)<1e-6||k(a,1)===k(v.m[3][1]/v.m[1][1],1)?null:v;},
 function(v,R){var a=(v.s[3]*v.m[3][1])/(v.s[1]*v.m[1][1]);var ch=CH(R,a,[v.m[3][1]/v.m[1][1],v.s[3]/v.s[1],v.s[1]/v.s[3],a+0.2],F1('倍'),4,false,0.4);
 return {q:q189(v)+'スキー場Zで「バス」と答えた人は、スキー場Xで「バス」と答えた人の何倍か（必要なときは、最後に小数第2位を四捨五入すること）。',c:ch.c,a:ch.a,
  inw:'全体を1として、Zのバス ＝ Zの割合 × バスの割合、Xのバスも同じように出して比べる',
  fig:{table:{head:['','回答者の割合','バスの割合','全体に対するバス'],rows:[['Z',v.s[3]+'%',v.m[3][1]+'%',k(v.s[3]*v.m[3][1]/100,2)+'%'],['X',v.s[1]+'%',v.m[1][1]+'%',k(v.s[1]*v.m[1][1]/100,2)+'%']]}},
  calc:k(v.s[3]*v.m[3][1]/100,2)+' ÷ '+k(v.s[1]*v.m[1][1]/100,2)+' ＝ '+fx(a,1)+'倍'};},
 function(v){return fx((v.s[3]/100*v.m[3][1]/100)/(v.s[1]/100*v.m[1][1]/100),1)+'倍';},o189);
T(HY,5,'189-3',function(R){return g189(R);},
 function(v,R){var car=0;for(var i=0;i<4;i++)car+=v.s[i]*v.m[i][0]/100;var oth=car-v.s[0]*v.m[0][0]/100,a=v.m[0][0];var ch=CH(R,a,[(car-oth),a*0.6,a*0.4,a+10],I('%'),4,false,8);
 return {q:q189(v)+'スキー場Wで「乗用車」と答えた人は、スキー場Wでの回答者数の何%か（必要なときは、最後に小数第1位を四捨五入すること）。',c:ch.c,a:ch.a,
  inw:'全体の乗用車'+car+'%から、X・Y・Zの乗用車（全体に対する割合）を引くと、Wの乗用車（全体に対する割合）が残る',
  fig:{table:{head:['','回答者の割合','乗用車の割合','全体に対する乗用車'],rows:[1,2,3].map(function(i){return [SK[i],v.s[i]+'%',v.m[i][0]+'%',k(v.s[i]*v.m[i][0]/100,2)+'%'];}).concat([['W',v.s[0]+'%','!?',k(car-oth,2)+'%'],['合計','','',car+'%']])}},
  calc:'X・Y・Zの乗用車 '+k(oth,2)+'%<br>Wの乗用車 '+car+' − '+k(oth,2)+' ＝ '+k(car-oth,2)+'%<br>'+k(car-oth,2)+' ÷ '+v.s[0]/100+' ＝ '+a+'%'};},
 function(v){var car=0;for(var i=0;i<4;i++)car+=v.s[i]*v.m[i][0];for(var a=0;a<=100;a++)if(car-v.s[0]*v.m[0][0]+v.s[0]*a===car)return a+'%';return '';},o189);
T(HY,4,'189-4',function(R){var v=g189(R);if(!v)return null;var N=R.int(8,40)*100,K=N*v.s[2]*v.m[2][3]/10000;if(K%1)return null;v.K=K;return v;},
 function(v,R){var N=v.K*10000/(v.s[2]*v.m[2][3]);var ch=CH(R,N,[v.K*100/v.m[2][3],v.K*100/v.s[2],N*2,N*0.3],P,4,false,200);
 return {q:q189(v)+'スキー場Yで「その他」と答えた人は'+v.K+'人であった。4つのスキー場での回答者数の合計は何人か。',c:ch.c,a:ch.a,
  inw:'全体 → スキー場Y（'+v.s[2]+'%）→ そのうちその他（'+v.m[2][3]+'%）が'+v.K+'人',
  fig:{rows:[[{n:'全体',r:'1',v:'?',ask:1,w:1}],[{n:'Y',r:fx(v.s[2]/100,2),v:'',w:v.s[2]/100},{n:'',r:'',v:'',w:1-v.s[2]/100}],[{n:'Yのその他',r:fx(v.s[2]*v.m[2][3]/10000,4),v:v.K+'人',w:v.s[2]*v.m[2][3]/10000},{n:'',r:'',v:'',w:1-v.s[2]*v.m[2][3]/10000}]]},
  calc:'全体に対する割合 '+fx(v.s[2]/100,2)+' × '+fx(v.m[2][3]/100,2)+' ＝ '+k(v.s[2]*v.m[2][3]/10000,4)+'<br>'+v.K+' ÷ '+k(v.s[2]*v.m[2][3]/10000,4)+' ＝ '+N+'人'};},
 function(v){for(var N=1;N<=20000;N++)if(N*v.s[2]*v.m[2][3]===v.K*10000)return N+'人';return '';},o189);

/* ===================== 特殊算 問190〜199 ===================== */
var KO=I('個');
function cons(R,ans,n,u,step,lo){step=step||1;var s=Math.max(lo==null?1:lo,ans-step*R.int(0,n-1)),c=[];for(var i=0;i<n;i++)c.push((s+i*step)+u);return {c:c,a:c.indexOf(ans+u)};}
T(TK,4,'190',function(R){var a=R.int(5,12)*10,b=a+R.int(1,5)*10,n=R.int(8,15),B=R.int(8,20)*100,x=Math.floor((B-a*n)/(b-a));if(x<2||x>n-1)return null;return {a:a,b:b,n:n,B:B};},
 function(v,R){var x=Math.floor((v.B-v.a*v.n)/(v.b-v.a));var ch=CH(R,x,[v.n-x,Math.floor(v.B/v.b),x+1,x-2,x+2],KO,5,false,1);
 return {q:v.a+'円の菓子と'+v.b+'円の菓子を買って、'+v.B+'円以内におさめたい。'+v.b+'円の菓子をできるだけたくさん買って、合計で'+v.n+'個にするとき、'+v.b+'円の菓子はいくつ買えるか。',c:ch.c,a:ch.a,
  inw:'まず全部'+v.a+'円の菓子だとして、残りのお金で何個を'+v.b+'円に替えられるかを見る（鶴亀算）',
  fig:{table:{head:['','1個','個数','代金'],rows:[['全部'+v.a+'円',v.a,v.n,v.a*v.n],['1個替えると','+'+(v.b-v.a),'!?',(v.B-v.a*v.n)+'円まで']]}},
  calc:'全部'+v.a+'円 '+v.a+' × '+v.n+' ＝ '+(v.a*v.n)+'<br>残り '+v.B+' − '+(v.a*v.n)+' ＝ '+(v.B-v.a*v.n)+'<br>'+(v.B-v.a*v.n)+' ÷ '+(v.b-v.a)+' ＝ '+k((v.B-v.a*v.n)/(v.b-v.a),2)+' → '+x+'個'};},
 function(v){for(var x=v.n;x>=0;x--)if(v.a*(v.n-x)+v.b*x<=v.B)return x+'個';return '';},{a:70,b:90,n:12,B:1000});
var CN=[500,100,50,10];
function sol191(n,S){var r=[];for(var a=1;a*500<S;a++)for(var b=1;b<n;b++)for(var c=1;c<n;c++){var d=n-a-b-c;if(d>=1&&500*a+100*b+50*c+10*d===S)r.push([a,b,c,d]);}return r;}
T(TK,4,'191',function(R){var x=[R.int(1,3),R.int(1,6),R.int(1,6),R.int(1,8)],n=x[0]+x[1]+x[2]+x[3],S=500*x[0]+100*x[1]+50*x[2]+10*x[3],s=sol191(n,S);
 if(!s.every(function(y){return y[1]===s[0][1];}))return null;return {n:n,S:S};},
 function(v,R){var s=sol191(v.n,v.S)[0];var ch=cons(R,s[1],5,'枚');
 return {q:'500円玉、100円玉、50円玉、10円玉を全種類組み合わせて、合計'+v.n+'枚で'+v.S+'円を作るとき、100円玉は何枚必要か。',c:ch.c,a:ch.a,
  inw:'大きい硬貨から枚数を決める。10円玉の枚数は一の位（十円の位）から、500円玉は残りの金額から決まる',
  fig:{table:{head:['硬貨','500円','100円','50円','10円','計'],rows:[['枚数',s[0],'!'+s[1],s[2],s[3],v.n],['金額',500*s[0],100*s[1],50*s[2],10*s[3],v.S]]}},
  calc:'各1枚ずつ使うと 660円・4枚。残り '+(v.S-660)+'円を'+(v.n-4)+'枚で作る<br>500円玉の枚数を決めると、残りを100円・50円・10円で作る式が1通りに決まる<br>500円 '+s[0]+'枚、100円 '+s[1]+'枚、50円 '+s[2]+'枚、10円 '+s[3]+'枚'};},
 function(v){for(var d=v.n;d>=1;d--)for(var c=1;c<=v.n;c++)for(var b=1;b<=v.n;b++){var a=v.n-b-c-d;if(a>=1&&a*500+b*100+c*50+d*10===v.S)return b+'枚';}return '';},{n:13,S:1450});
var PZ=[800,1200,1600,1800];
function best192(v){var best=-1,bx=null;for(var d=v.m;d*1800<=v.T;d++)for(var c=2;c*1600+d*1800<=v.T;c++)for(var b=2;b*1200+c*1600+d*1800<=v.T;b++){var rest=v.T-b*1200-c*1600-d*1800;if(rest%800)continue;var a=rest/800;if(a<2)continue;if(a+b+c+d>best){best=a+b+c+d;bx=[a,b,c,d];}}return {n:best,x:bx};}
T(TK,4,'192',function(R){var v={T:R.int(80,150)*200,m:R.int(4,7)};return best192(v).n>0?v:null;},
 function(v,R){var b=best192(v),x=b.x;var ch=CH(R,b.n,[b.n-2,b.n+4,b.n-4,b.n+6],KO,5,false,2);
 return {q:'800円、1200円、1600円、1800円のぬいぐるみがある。これらをちょうど'+v.T+'円になるように買いたい。1800円のぬいぐるみは'+v.m+'個以上、その他はすべて2個以上は買うとき、全部で最大何個買えるか。',c:ch.c,a:ch.a,
  inw:'まず最低限の個数を買い、残りのお金を一番安い800円でできるだけ多く買う（ちょうどにならなければ1200円などで調整）',
  fig:{table:{head:['','800円','1200円','1600円','1800円','計'],rows:[['最低限',2,2,2,v.m,2*800+2*1200+2*1600+v.m*1800],['答え',x[0],x[1],x[2],x[3],'!'+b.n]]}},
  calc:'最低限 '+(2*800+2*1200+2*1600+v.m*1800)+'円、残り '+(v.T-(2*800+2*1200+2*1600+v.m*1800))+'円<br>安いものを多くしてちょうどにする → 800円 '+x[0]+'個、1200円 '+x[1]+'個、1600円 '+x[2]+'個、1800円 '+x[3]+'個<br>合計 '+b.n+'個'};},
 function(v){var base=2*800+2*1200+2*1600+v.m*1800,rest=(v.T-base)/200;if(rest<0||rest%1)return '';var dp=[0];for(var s=1;s<=rest;s++){dp[s]=-1e9;[4,6,8,9].forEach(function(p){if(s>=p&&dp[s-p]+1>dp[s])dp[s]=dp[s-p]+1;});}return dp[rest]<0?'':(dp[rest]+6+v.m)+'個';},{T:20000,m:6});
T(TK,4,'193',function(R){var c1=R.int(8,20)*10,d=R.int(2,6)*5,N=R.int(5,20)*1000,n1=R.int(1,N/1000-1)*1000,av=(c1*n1+(c1+d)*(N-n1))/N;if(av%1)return null;return {c1:c1,c2:c1+d,N:N,av:av};},
 function(v,R){var n1=v.N*(v.c2-v.av)/(v.c2-v.c1);var ch=CH(R,n1,[v.N-n1,n1+1000,n1-1000,n1+2000],KO,4,false,1000);
 return {q:'ある製品の原価は6月には1個あたり'+v.c1+'円だったが、7月には'+v.c2+'円に値上がりした。この2か月間の生産個数は'+v.N+'個で平均原価は'+v.av+'円だった。6月の生産個数はいくつか。',c:ch.c,a:ch.a,
  inw:'全部7月の原価だとした合計と、実際の合計の差から6月の個数を出す（鶴亀算）',
  fig:{table:{head:['','原価','個数','合計'],rows:[['6月',v.c1,'!?',''],['7月',v.c2,'',''],['計','平均 '+v.av,v.N,v.av*v.N]]}},
  calc:'全部'+v.c2+'円なら '+v.c2+' × '+v.N+' ＝ '+(v.c2*v.N)+'<br>実際 '+v.av+' × '+v.N+' ＝ '+(v.av*v.N)+'、差 '+((v.c2-v.av)*v.N)+'<br>6月 '+((v.c2-v.av)*v.N)+' ÷ （'+v.c2+' − '+v.c1+'）＝ '+n1+'個'};},
 function(v){for(var n=0;n<=v.N;n+=10)if(v.c1*n+v.c2*(v.N-n)===v.av*v.N)return n+'個';return '';},{c1:100,c2:115,N:10000,av:109});
T(TK,4,'194',function(R){var f=R.int(30,50),a=R.int(8,18),b=R.int(3,a-1);if(f-a-b<5||f-a-b>25)return null;return {f:f,a:a,b:b};},
 function(v,R){var x=v.f-v.a-v.b+1;var ch=cons(R,x,5,'年後');
 return {q:'父親は現在'+v.f+'歳で、'+v.a+'歳と'+v.b+'歳の子供がいる。子供の年齢の合計が父親の年齢を超えるのは何年後か。',c:ch.c,a:ch.a,
  inw:'1年たつと、子供2人の合計は2歳、父親は1歳増える。差が1年に1ずつ縮む（年齢算）',
  fig:{table:{head:['','今','1年で増える'],rows:[['父親',v.f,1],['子供の合計',v.a+v.b,2],['差',v.f-v.a-v.b,'1ずつ縮む']]}},
  calc:'差 '+v.f+' − '+(v.a+v.b)+' ＝ '+(v.f-v.a-v.b)+'<br>'+(v.f-v.a-v.b)+'年後に等しくなり、それを超えるのは '+x+'年後'};},
 function(v){for(var t=0;t<100;t++)if(v.a+v.b+2*t>v.f+t)return t+'年後';return '';},{f:40,a:16,b:12});
T(TK,4,'195',function(R){var T0=R.int(25,49)*2+1,d=R.int(1,7)*2+1,e=R.int(1,9),F1v=(T0-d)/2,F2=(T0+d)/2,F=F1v%2===e%2?F1v:F2;if(F<=e+4)return null;return {T:T0,d:d,e:e};},
 function(v,R){var F1v=(v.T-v.d)/2,F=F1v%2===v.e%2?F1v:(v.T+v.d)/2,M=v.T-F;var ch=CH(R,M,[F,M+3,(v.T+1)/2,M-7],P,5,true,2);
 return {q:'X社とY社が合同で社員旅行をしたところ、合わせて'+v.T+'人が参加した。次のことがわかっているとき、参加した男性の人数は何人か。<br>Ⅰ　男性と女性の参加者数の差は'+v.d+'人だった<br>Ⅱ　女性の参加者数はX社がY社より'+v.e+'人多かった',c:ch.c,a:ch.a,
  inw:'Ⅰから女性は2通り（男性が多い場合・女性が多い場合）。Ⅱから女性の人数は「Y社 × 2 ＋ '+v.e+'」なので'+(v.e%2?'奇数':'偶数'),
  fig:{table:{head:['','男性','女性','女性は'+(v.e%2?'奇数':'偶数')+'か'],rows:[['男性が多い',(v.T+v.d)/2,(v.T-v.d)/2,((v.T-v.d)/2)%2===v.e%2?'○':'×'],['女性が多い',(v.T-v.d)/2,(v.T+v.d)/2,((v.T+v.d)/2)%2===v.e%2?'○':'×']]}},
  calc:'女性 ＝ ('+v.T+' ± '+v.d+') ÷ 2 ＝ '+(v.T-v.d)/2+' または '+(v.T+v.d)/2+'<br>'+(v.e%2?'奇数':'偶数')+'なのは '+F+' → 男性 '+v.T+' − '+F+' ＝ '+M+'人'};},
 function(v){for(var M=0;M<=v.T;M++){var F=v.T-M;if(Math.abs(M-F)===v.d&&(F-v.e)%2===0&&F>=v.e)return M+'人';}return '';},{T:75,d:9,e:3});
T(TK,4,'196',function(R){var d=R.pick([2,4,5,6,8,10]),n=R.int(20,60);return {L:d*n,d:d};},
 function(v,R){var n=v.L/v.d;var ch=cons(R,n,5,'本',1,Math.max(1,n-4));
 return {q:'池の周りを歩く1周'+v.L+'mの遊歩道がある。この道にそって、'+v.d+'m間隔で木を植えたい。木は何本必要か。',c:ch.c,a:ch.a,
  inw:'池の周り（輪）は、木の数 ＝ 間の数（両端がつながるので1本足さない）',
  fig:{table:{head:['','1周','間隔','間の数','木の数'],rows:[['池の周り',v.L+'m',v.d+'m',n,'!'+n]]}},
  calc:'間の数 '+v.L+' ÷ '+v.d+' ＝ '+n+'<br>輪なので木の数 ＝ 間の数 ＝ '+n+'本'};},
 function(v){var c=0;for(var p=0;p<v.L;p+=v.d)c++;return c+'本';},{L:200,d:5});
function q197(v){return '修学旅行で'+v.N+'人の生徒が、4人部屋、5人部屋、6人部屋の3種類の部屋、合計'+v.Rm+'室に分かれて泊まった。ただし、どの部屋にも定員ちょうどの人数で泊まったものとする。';}
T(TK,4,'197-1',function(R){var a=R.int(3,10),b=R.int(1,10),c=R.int(10,25);return {N:4*a+5*b+6*c,Rm:a+b+c,c:c};},
 function(v,R){var r=v.Rm-v.c,p=v.N-6*v.c,a=5*r-p;var ch=cons(R,a,5,'室');
 return {q:q197(v)+'6人部屋が'+v.c+'室の場合、4人部屋は何室か。',c:ch.c,a:ch.a,
  inw:'6人部屋の分を除くと、残りの部屋は4人部屋と5人部屋だけ（鶴亀算）',
  fig:{table:{head:['','部屋','人数'],rows:[['6人部屋',v.c,6*v.c],['4人・5人部屋',r,p],['全部5人部屋なら',r,5*r]]}},
  calc:'残り '+r+'室・'+p+'人<br>全部5人部屋なら '+(5*r)+'人、差 '+(5*r)+' − '+p+' ＝ '+a+'<br>4人部屋 '+a+' ÷ 1 ＝ '+a+'室'};},
 function(v){for(var a=0;a<=v.Rm-v.c;a++)if(4*a+5*(v.Rm-v.c-a)+6*v.c===v.N)return a+'室';return '';},{N:165,Rm:30,c:22});
T(TK,4,'197-2',function(R){var x=R.int(2,8),c=R.int(10,25);return {N:9*x+6*c,Rm:2*x+c,c:c};},
 function(v,R){var x=(6*v.Rm-v.N)/3,c=v.Rm-2*x;var ch=cons(R,c,5,'室',2,2);
 return {q:q197(v)+'4人部屋と5人部屋の数が同じ場合、6人部屋は何室か。',c:ch.c,a:ch.a,
  inw:'4人部屋と5人部屋を1室ずつ組にすると、2室で9人（1室平均4.5人）',
  fig:{table:{head:['','部屋','人数'],rows:[['4人＋5人の組','2x','9x'],['6人部屋','!?','6 ×（'+v.Rm+' − 2x）'],['計',v.Rm,v.N]]}},
  calc:'9x ＋ 6（'+v.Rm+' − 2x）＝ '+v.N+'<br>'+(6*v.Rm)+' − 3x ＝ '+v.N+' → x ＝ '+x+'<br>6人部屋 '+v.Rm+' − '+(2*x)+' ＝ '+c+'室'};},
 function(v){for(var c=0;c<=v.Rm;c++){var r=v.Rm-c;if(r%2)continue;if(4*r/2+5*r/2+6*c===v.N)return c+'室';}return '';},{N:165,Rm:30,c:20});
var ST=[80,30,10,4];
function mx198(T){var best=-1;for(var a=2;a*80<=T;a++)for(var b=2;a*80+b*30<=T;b++)for(var c=2;a*80+b*30+c*10<=T;c++){var r=T-a*80-b*30-c*10;if(r%4||r/4<2)continue;if(a+b+c+r/4>best)best=a+b+c+r/4;}return best;}
function mn198(T){var best=1e9;for(var a=0;a*80<=T;a++)for(var b=0;a*80+b*30<=T;b++)for(var c=0;a*80+b*30+c*10<=T;c++){var r=T-a*80-b*30-c*10;if(r%4)continue;if(a+b+c+r/4<best)best=a+b+c+r/4;}return best;}
T(TK,4,'198-1',function(R){var T0=R.int(150,300)*2;return mx198(T0)>0?{T:T0}:null;},
 function(v,R){var x=mx198(v.T);var ch=CH(R,x,[x-11,x-22,x-35,x+6],I('枚'),5,false,3);
 return {q:'80円、30円、10円、4円の4種類の切手を購入する。全種類の切手をそれぞれ2枚以上購入して、ちょうど'+v.T+'円にしたい。このとき購入できる最大枚数は何枚か。',c:ch.c,a:ch.a,
  inw:'まず各2枚（'+2*124+'円）を買い、残りをできるだけ安い4円切手にする。4円で割り切れなければ10円・30円で調整',
  fig:{table:{head:['','80円','30円','10円','4円'],rows:[['最低限',2,2,2,2],['残り '+(v.T-248)+'円','','','','できるだけ多く']]}},
  calc:'残り '+v.T+' − 248 ＝ '+(v.T-248)+'円<br>4円でできるだけ多く（割り切れないときは10円を1枚ずつ足して調整）<br>最大 '+x+'枚'};},
 function(v){var r=v.T-248;if(r<0)return '';var dp=[0];for(var s=1;s<=r;s++){dp[s]=-1e9;ST.forEach(function(p){if(s>=p&&dp[s-p]+1>dp[s])dp[s]=dp[s-p]+1;});}return dp[r]<0?'':(dp[r]+8)+'枚';},{T:400});
T(TK,4,'198-2',function(R){var T0=R.int(150,300)*2;return mn198(T0)<1e9?{T:T0}:null;},
 function(v,R){var x=mn198(v.T);var ch=cons(R,x,5,'枚');
 return {q:'80円、30円、10円、4円の4種類の切手を購入する。ちょうど'+v.T+'円にするときの最小枚数は何枚か。ただし、購入しない種類の切手があってもよいものとする。',c:ch.c,a:ch.a,
  inw:'高い80円切手をできるだけ多く使い、残りを30円・10円・4円で少ない枚数にする。80円を1枚減らした場合も確かめる',
  fig:{table:{head:['80円の枚数','残り','残りの最少枚数','計'],rows:[Math.floor(v.T/80),Math.floor(v.T/80)-1].filter(function(a){return a>=0;}).map(function(a){var r=v.T-80*a,b=mn198(r);return [a,r,b<1e9?b:'作れない',b<1e9?a+b:'—'];})}},
  calc:'80円を多く使う順に確かめ、合計が最も少ないのは '+x+'枚'};},
 function(v){var dp=[0];for(var s=1;s<=v.T;s++){dp[s]=1e9;ST.forEach(function(p){if(s>=p&&dp[s-p]+1<dp[s])dp[s]=dp[s-p]+1;});}return dp[v.T]+'枚';},{T:442});
function q199(v){return 'あるコンビニエンスストアのアルバイトの時給には、働き始めてn年後の時給 f(n) と、その前の年の時給 f(n−1) との間に、次のような関係がある。<br>　n＝0のとき、f(n)＝a（aは最初の時給）<br>　n＞0でnは自然数のとき、f(n)＝f(n−1)＋'+v.p+'n＋'+v.q;}
function inc199(v,n){var s=0;for(var i=1;i<=n;i++)s+=v.p*i+v.q;return s;}
function g199(R){return {p:R.pick([5,10,10,15,20]),q:R.pick([10,20,20,30]),a:R.int(60,100)*10,n:R.int(2,5)};}
T(TK,4,'199-1',g199,function(v,R){var x=v.a+inc199(v,v.n);var ch=CH(R,x,[v.a+v.n*(v.p+v.q),v.a+v.p*v.n+v.q,v.a+inc199(v,v.n-1),x+20],I('円'),5,true,10);
 return {q:q199(v)+'<br>最初の時給が'+v.a+'円の人の、'+v.n+'年後の時給はいくらになるか。',c:ch.c,a:ch.a,
  inw:'1年ごとの増え方（'+v.p+'n＋'+v.q+'）を n＝1 から順に書き出して足す',
  fig:{table:{head:['n'].concat([1,2,3,4,5].slice(0,v.n)),rows:[['増える額'].concat([1,2,3,4,5].slice(0,v.n).map(function(i){return v.p*i+v.q;}))]}},
  calc:'増える額の合計 '+[1,2,3,4,5].slice(0,v.n).map(function(i){return v.p*i+v.q;}).join(' ＋ ')+' ＝ '+inc199(v,v.n)+'<br>'+v.a+' ＋ '+inc199(v,v.n)+' ＝ '+x+'円'};},
 function(v){return (v.a+v.p*v.n*(v.n+1)/2+v.q*v.n)+'円';},{p:10,q:20,a:700,n:3});
T(TK,4,'199-2',g199,function(v,R){var V=v.a+inc199(v,v.n),x=v.a;var ch=CH(R,x,[V-v.n*(v.p+v.q),V-(v.p*v.n+v.q),V-inc199(v,v.n-1),x-30],I('円'),5,true,30);
 return {q:q199(v)+'<br>'+v.n+'年後の時給が'+V+'円だった人の、最初の時給はいくらであったか。',c:ch.c,a:ch.a,
  inw:'n＝1〜'+v.n+'で増えた額を書き出して足し、'+V+'円から引く',
  fig:{table:{head:['n'].concat([1,2,3,4,5].slice(0,v.n)),rows:[['増える額'].concat([1,2,3,4,5].slice(0,v.n).map(function(i){return v.p*i+v.q;}))]}},
  calc:'増えた額 '+[1,2,3,4,5].slice(0,v.n).map(function(i){return v.p*i+v.q;}).join(' ＋ ')+' ＝ '+inc199(v,v.n)+'<br>'+V+' − '+inc199(v,v.n)+' ＝ '+x+'円'};},
 function(v){var V=v.a+inc199(v,v.n);return (V-v.p*v.n*(v.n+1)/2-v.q*v.n)+'円';},{p:10,q:20,a:720,n:4});

/* ===================== 情報の読み取り 問200〜201 ===================== */
var AN=['アだけ','イだけ','ウだけ','アとイ','アとウ','イとウ'];
function lab(t){var s=['ア','イ','ウ'].filter(function(x,i){return t[i];});return s.length===1?s[0]+'だけ':s.length===2?s[0]+'と'+s[1]:'';}
/* 入館料：make は「全員団体／全員個別（夫婦割引あり）／回数券1冊で全員」の最小。verify は回数券を使う人の組合せを総当たり */
function price(v,t){return t==='c'?v.r5:t==='s'?v.r3:1;}
function cost200(v,ps,cp){var n=ps.length,ind=0;ps.forEach(function(t){ind+=price(v,t);});
 if(cp&&(ps[cp[0]]==='o'||ps[cp[1]]==='o'))ind=ind-price(v,ps[cp[0]])-price(v,ps[cp[1]])+Math.min(2*v.r2,price(v,ps[cp[0]])+price(v,ps[cp[1]]));
 var o={ind:k(ind,4),grp:n>=5?k(n*v.r4,4):1e9,tk:n<=10?k(10*v.r1,4):1e9};o.best=Math.min(o.ind,o.grp,o.tk);return o;}
function brute200(v,ps,cp,ng){var n=ps.length,best=!ng&&n>=5?n*v.r4:1e9;
 for(var m=0;m<(1<<n);m++){var t=0,c=0;for(var i=0;i<n;i++)if(m>>i&1)t++;c=t?Math.ceil(t/10)*10*v.r1:0;
  var both=cp&&!(m>>cp[0]&1)&&!(m>>cp[1]&1)&&(ps[cp[0]]==='o'||ps[cp[1]]==='o');
  for(var j=0;j<n;j++)if(!(m>>j&1)){if(both&&(j===cp[0]||j===cp[1]))c+=Math.min(v.r2,price(v,ps[j]));else c+=price(v,ps[j]);}
  if(c<best)best=c;}return k(best,4);}
function rp(n,t){var a=[];for(var i=0;i<n;i++)a.push(t);return a;}
function tbl200(v){return '次の資料を用いて、各問いに答えなさい。<br>【入館料一覧（入館料＝a円）】'+TB(['','1人あたりの料金（円）'],[['回数券（10枚つづり）',v.r1+'a'],['夫婦50割引',v.r2+'a'],['学生割引',v.r3+'a'],['団体割引',v.r4+'a']])+
 '●小学生以下は子供料金（'+v.r5+'a円）を適用（他の割引と併用不可）。<br>●学生割引は中学・高校生が対象（他の割引と併用不可）。<br>●回数券は、複数人での使用も可。ただし、残余券払い戻しは不可。<br>●夫婦50割引は、同伴の男女どちらかが50歳以上なら2人に適用。<br>●団体割引は5人以上で利用の場合、全員に適用（他の割引と併用不可）。<br><br>';}
function rates(R){return {r1:R.pick([0.6,0.65,0.7,0.75,0.8]),r2:R.pick([0.6,0.7,0.8]),r3:R.pick([0.7,0.75,0.8,0.85,0.9]),r4:R.pick([0.7,0.75,0.8,0.85]),r5:R.pick([0.4,0.5,0.6])};}
function truth200a(v,C){var a=C(v,rp(v.n1,'s')),b=C(v,['c','s','u']),f=C(v,[v.fa>=50?'o':'u',v.mo>=50?'o':'u','c','s','u'],[0,1],true),g=k(5*v.r4,4);
 return [k((1-a/v.n1)*100,4)===v.X1,k(b,4)===v.T1,g<f-1e-9];}
function g200a(R){var v=rates(R);v.n1=R.int(5,8);v.fa=R.int(44,52);v.mo=R.int(46,54);var best=cost200(v,rp(v.n1,'s')).best,tx=k((1-best/v.n1)*100,4);if(tx%1)return null;
 v.X1=R.int(0,1)?tx:R.pick([k((1-v.r3)*100,0),k((1-v.r4)*100,0),k((1-v.r1)*100,0)]);var tb=cost200(v,['c','s','u']).best;v.T1=R.int(0,1)?tb:k(v.r5+2*v.r3,4);
 var t=[k((1-best/v.n1)*100,4)===v.X1,k(tb,4)===v.T1,(function(){var o=cost200(v,[v.fa>=50?'o':'u',v.mo>=50?'o':'u','c','s','u'],[0,1]);return o.grp<Math.min(o.ind,o.tk);})()];
 var c=t.filter(Boolean).length;return c===1||c===2?v:null;}
T(JO,4,'200-1',g200a,function(v,R){var o1=cost200(v,rp(v.n1,'s')),o2=cost200(v,['c','s','u']),o3=cost200(v,[v.fa>=50?'o':'u',v.mo>=50?'o':'u','c','s','u'],[0,1]);
 var t=[k((1-o1.best/v.n1)*100,4)===v.X1,k(o2.best,4)===v.T1,o3.grp<Math.min(o3.ind,o3.tk)],ch=FIX(AN,lab(t));
 return {q:tbl200(v)+'資料の内容と一致するものは、ア、イ、ウのうちどれか。<br>ア　高校生'+v.n1+'人が一緒に入館する場合、'+v.n1+'人分の料金が'+v.X1+'%引きになる。<br>イ　小学生1人と中学生1人、大学生1人が一緒に入館する場合、総額は'+v.T1+'a円になる。<br>ウ　'+v.fa+'歳の父と'+v.mo+'歳の母と小学生1人、中学生1人、大学生1人の家族が入館する場合、団体割引を利用した入館が最も割安になる。',c:ch.c,a:ch.a,
  inw:'ア〜ウそれぞれで、使える割引（団体・個別・回数券）の総額を出して比べる。大学生は学生割引の対象外',
  fig:{table:{head:['','団体','個別の合計','回数券1冊','一致'],rows:[['ア',o1.grp<1e9?o1.grp+'a':'—',o1.ind+'a',o1.tk+'a',t[0]?'○':'×'],['イ',o2.grp<1e9?o2.grp+'a':'—',o2.ind+'a',o2.tk+'a',t[1]?'○':'×'],['ウ',o3.grp+'a',o3.ind+'a',o3.tk+'a',t[2]?'○':'×']]}},
  calc:'ア 最も安いのは '+o1.best+'a → 1人 '+k(o1.best/v.n1,4)+'a ＝ '+k((1-o1.best/v.n1)*100,2)+'%引き<br>イ '+v.r5+'a ＋ '+v.r3+'a ＋ 1a ＝ '+o2.best+'a<br>ウ 団体 '+o3.grp+'a、個別（夫婦割引など）'+o3.ind+'a'};},
 function(v){return lab(truth200a(v,function(v,ps,cp,ng){return brute200(v,ps,cp,ng);}));},{r1:0.7,r2:0.7,r3:0.8,r4:0.75,r5:0.5,n1:5,fa:48,mo:51,X1:25,T1:2.3});
function truth200b(v,C){var a=C(v,rp(v.n2,'s')),b=C(v,rp(v.n3,'u')),u=true;for(var m=v.n4;m<=10;m++){var tk=10*v.r1,ot=Math.min(m,m>=5?m*v.r4:1e9);if(!(tk<ot-1e-9))u=false;}
 return [k((1-a/v.n2)*100,4)===v.X2,k(b,4)===v.T2,u];}
function g200b(R){var v=rates(R);v.n2=R.int(5,10);v.n3=R.int(5,10);v.n4=R.int(6,9);var a=cost200(v,rp(v.n2,'s')).best,tx=k((1-a/v.n2)*100,4);if(tx%1)return null;
 v.X2=R.int(0,1)?tx:R.pick([k((1-v.r3)*100,0),k((1-v.r4)*100,0),k((1-v.r1)*100,0)]);var b=cost200(v,rp(v.n3,'u')).best;v.T2=R.int(0,1)?b:k(v.n3*v.r1,4);
 var t=truth200b(v,function(v,ps){return cost200(v,ps).best;});if(t[2])return null;var c=t.filter(Boolean).length;return c===1||c===2?v:null;}
T(JO,4,'200-2',g200b,function(v,R){var t=truth200b(v,function(v,ps){return cost200(v,ps).best;}),o1=cost200(v,rp(v.n2,'s')),o2=cost200(v,rp(v.n3,'u')),ch=FIX(AN,lab(t));
 return {q:tbl200(v)+'資料の内容と一致するものは、ア、イ、ウのうちどれか。<br>ア　中学生'+v.n2+'人で入館する場合、料金は'+v.X2+'%引きになる。<br>イ　50歳未満の大人'+v.n3+'人で入館する場合、総額'+v.T2+'a円になる。<br>ウ　50歳未満の大人'+v.n4+'人以上は、回数券を購入した方が割安である。',c:ch.c,a:ch.a,
  inw:'ア〜ウそれぞれで、団体・個別・回数券（10枚で'+k(10*v.r1,2)+'a、余っても払い戻しなし）の総額を比べる',
  fig:{table:{head:['','団体','個別の合計','回数券1冊','一致'],rows:[['ア',o1.grp<1e9?o1.grp+'a':'—',o1.ind+'a',o1.tk+'a',t[0]?'○':'×'],['イ',o2.grp<1e9?o2.grp+'a':'—',o2.ind+'a',o2.tk+'a',t[1]?'○':'×'],['ウ（'+v.n4+'人）',k(v.n4*v.r4,4)+'a',v.n4+'a',k(10*v.r1,4)+'a',t[2]?'○':'×']]}},
  calc:'ア 最も安いのは '+o1.best+'a → '+k((1-o1.best/v.n2)*100,2)+'%引き<br>イ 最も安いのは '+o2.best+'a<br>ウ '+v.n4+'人では団体 '+k(v.n4*v.r4,4)+'a と回数券 '+k(10*v.r1,4)+'a を比べると、回数券が割安とはいえない人数がある'};},
 function(v){return lab(truth200b(v,function(v,ps){return brute200(v,ps);}));},{r1:0.7,r2:0.7,r3:0.8,r4:0.75,r5:0.5,n2:10,n3:9,n4:8,X2:30,T2:6.3});
/* 201 長文（数値は兆円・%などを0.1単位で持つ） */
function q201(v){return '次の文を読んで、各問いに答えなさい。<br><br>　日本の輸入金額に占める原油輸入の割合は、2007年度で'+v.s07+'%、前年度は'+v.s06+'%を占めている。また、同じ鉱物性燃料である天然ガスの割合も2007年度は'+v.g07+'%、前年度は'+v.g06+'%と上位を占めている。<br>　近年では、両者の価格高騰により、輸入金額の増加という形で海外への所得移転が生じている。例えば原油の輸入量は、2007年度には'+v.o07+'百万kL（キロリットル）で、前年度の'+v.o06+'百万kLと比べてほぼ横ばいだが、2006年度、2007年度の支払金額では、それぞれ'+v.p06+'兆円、'+v.p07+'兆円と拡大しており、1997年度の'+v.p97+'兆円と比べると激増している。天然ガスも同様で、2006年度は'+v.n06+'百万トン、2007年度は'+v.n07+'百万トンと微増だが、支払金額はそれぞれ'+v.q06+'兆円、'+v.q07+'兆円と拡大している。<br><br>';}
function g201(R){var v={s07:k(R.int(160,200)/10,1),s06:k(R.int(140,170)/10,1),g07:k(R.int(40,55)/10,1),g06:k(R.int(32,42)/10,1),n06:R.int(55,70),p06:k(R.int(100,130)/10,1),p97:k(R.int(30,50)/10,1),q06:k(R.int(20,30)/10,1),tg:R.pick([0,1,3])};
 v.n07=v.n06+R.int(2,8);v.p07=k(v.p06+R.int(15,30)/10,1);v.q07=k(v.q06*R.pick([1.2,1.3,1.4])+R.int(-1,1)/10,1);v.o06=k(R.int(2400,2500)/10,1);
 var dn=R.int(1,9)/10;v.o07=k(v.tg===1?v.o06+dn:v.o06-dn,1);var ra=v.p07/v.q07,K=Math.round(ra);if(Math.abs(ra-K)>0.2||K<2)return null;v.K=v.tg===0?K:K+R.pick([1,2]);
 var df=v.p07-v.p97,M=Math.ceil(df+1e-9);if(M-df<0.1||M-df>0.5)return null;v.M=v.tg===3?M:M+R.pick([2,3]);var x=k(v.q07/v.q06,1);if(Math.abs(v.q07/v.q06-x)>0.03)return null;v.X=x;return v;}
function c201(v){return ['2007年度の輸入支払金額は、天然ガスの輸入支払金額の約'+v.K+'倍だった。','2006年度から2007年度にかけて、輸入量は増加している。','2006年度の輸入支払金額は、原油より天然ガスの方が多かった。','2007年度の輸入支払金額は、10年前に比べて'+v.M+'兆円近く増加している。'];}
var o201={s07:18.3,s06:16.6,g07:4.6,g06:4.0,o07:243.1,o06:243.6,p06:11.4,p07:13.7,p97:3.9,n06:63,n07:68,q06:2.7,q07:3.5,tg:3,K:5,M:10,X:1.3};
T(JO,4,'201-1',g201,function(v,R){var c=c201(v),ch=FIX(c,c[v.tg]);
 return {q:q201(v)+'日本が輸入する原油について、文中で述べられていることと一致するものは次のうちどれか。',c:ch.c,a:ch.a,
  inw:'選択肢ごとに、文中の数値を探して確かめる（倍は割り算、増加は引き算）',
  fig:{table:{head:['','確かめる数値','一致'],rows:[['A',v.p07+' ÷ '+v.q07+' ＝ '+k(v.p07/v.q07,2)+'倍',v.tg===0?'○':'×'],['B',v.o06+' → '+v.o07+'百万kL',v.tg===1?'○':'×'],['C','原油'+v.p06+'兆円、天然ガス'+v.q06+'兆円','×'],['D',v.p07+' − '+v.p97+' ＝ '+k(v.p07-v.p97,1)+'兆円',v.tg===3?'○':'×']]}},
  calc:'A '+v.p07+' ÷ '+v.q07+' ＝ '+k(v.p07/v.q07,2)+'倍<br>B '+v.o06+' → '+v.o07+'<br>C 原油 '+v.p06+' ＞ 天然ガス '+v.q06+'<br>D '+v.p07+' − '+v.p97+' ＝ '+k(v.p07-v.p97,1)};},
 function(v){var c=c201(v),ra=v.p07/v.q07,df=v.p07-v.p97,ok=[Math.abs(ra-v.K)<0.25,v.o07>v.o06,v.q06>v.p06,v.M-df>0&&v.M-df<=0.5];for(var i=0;i<4;i++)if(ok[i])return c[i];return '';},o201);
T(JO,4,'201-2',g201,function(v,R){var c=['海外から輸入する鉱物性燃料の中で首位になった。','約'+v.X+'倍に増えた。','海外から輸入する鉱物性燃料の約30%を占めるようになった。','原油の輸入支払金額を抜いた。'],ch=FIX(c,c[1]);
 return {q:q201(v)+'日本が輸入する天然ガスの輸入支払金額は、2006年度から2007年度の間にどう変化したか。',c:ch.c,a:ch.a,
  inw:'天然ガスの支払金額（'+v.q06+'兆円 → '+v.q07+'兆円）を文中から探し、原油と比べる',
  fig:{table:{head:['','2006年度','2007年度'],rows:[['天然ガス',v.q06+'兆円',v.q07+'兆円'],['原油',v.p06+'兆円',v.p07+'兆円']]}},
  calc:v.q07+' ÷ '+v.q06+' ＝ '+k(v.q07/v.q06,3)+' → 約'+v.X+'倍<br>原油（'+v.p07+'兆円）の方が多いので、A・Dは誤り。Cは文中にない'};},
 function(v){return Math.abs(v.q07/v.q06-v.X)<0.05&&v.q07<v.p07?'約'+v.X+'倍に増えた。':'';},o201);

/* ===================== 新しい型の解き方（LESSON） ===================== */
LS(SP,4,[
 {h:'例題（区間の時刻から速さ）',q:'4人で駅伝の区間を走った。第2区は'+m('5km')+'で、第2区の始まりの通過時刻は'+m('10:37')+'、終わりは'+m('10:52')+'だった。第2区の走者の平均時速はいくらか。'},
 {h:'ステップ1 内訳を探す',p:'時刻の差が「時間」。速さの図は「速さ × 時間 ＝ 距離」の①×②＝③の形。',fig:SPD([['第2区','①','②','③']])},
 {h:'ステップ2 図に数字を入れる',p:m('10:52')+' − '+m('10:37')+' ＝ 15分 ＝ 15/60時間を②に、'+m('5km')+'を③に入れる。',fig:SPD([['第2区','!?','15/60時間',5]])},
 {h:'ステップ3 空白を埋める',p:'①は ③ ÷ ②。5 ÷ 15/60 ＝ 5 × 60 ÷ 15 ＝ 20',fig:SPD([['第2区',20,'15/60時間',5]])},
 {h:'答え',p:'20.0km/時。全区間の平均時速は「全体の距離 ÷ 全体の時間」で、区間の速さを平均してはいけない。'},
 {h:'例題（動く歩道）',q:'時速'+m('3km')+'で進む動く歩道の上を時速'+m('2.4km')+'で歩いたら、'+m('40秒')+'で降りた。この動く歩道は何mあったか。'},
 {h:'ステップ1〜3',p:'歩道の上を歩くと速さは足し算：3 ＋ 2.4 ＝ 5.4km/時 ＝ 5400m ÷ 3600秒 ＝ 1.5m/秒。①×②＝③ で 1.5 × 40 ＝ 60',fig:SPD([['歩道＋歩き','5.4（＝1.5m/秒）','40秒','60m']])},
 {h:'まとめ',p:'時刻は引き算して時間に、同じ向きに進むものは速さを足す。どちらも ①速さ × ②時間 ＝ ③距離 の位置に入れて埋める。'}]);
LS(SP,5,[
 {h:'例題（出発時刻がずれたすれ違い）',q:'R駅とS駅の間は'+m('50km')+'である。'+m('50km/時')+'で走行する電車XがR駅を'+m('10時5分')+'に出発して、RS間の中間地点でS駅を'+m('10時15分')+'に出発した電車Yとすれ違った。Yの速度は何km/時か。'},
 {h:'ステップ1 内訳を探す',p:'中間地点までの'+m('25km')+'を、XとYがそれぞれ走る。Yは'+m('10分')+'遅れて出発したので、走った時間が10分短い。'},
 {h:'ステップ2 図に数字を入れる',fig:SPD([['X',50,'?',25],['Y','!?','?',25]])},
 {h:'ステップ3 空白を埋める',p:'Xの時間 25 ÷ 50 ＝ 0.5時間 ＝ 30分 → Yは 30 − 10 ＝ 20分。Yの速さ 25 ÷ 20/60 ＝ 75',fig:SPD([['X',50,'30分',25],['Y',75,'20分',25]])},
 {h:'答え',p:'75km/時。時刻表の問題も、先に走った分の距離を引いてから「2人で残りをつめる（速さを足す）」で解く。'}]);
LS(SG,5,[
 {h:'例題（最も多くて何人か）',q:'会員'+m('100人')+'のうち、土曜日の不参加者は'+m('44人')+'、日曜日の不参加者は'+m('31人')+'である。土曜日も日曜日も不参加の人は最も多くて何人か。'},
 {h:'ステップ1〜2 表を描く',fig:KAR('土曜','日曜',['','',56],['','!?',44],[69,31,100])},
 {h:'ステップ3 空白を埋める',p:'両日不参加は「日曜不参加の31人」を超えられない。31人全員が土曜も不参加なら、表の他のマスも0以上でおさまる。'},
 {h:'答え',p:'31人。最大は「少ない方の人数」、最小は「合計 − 全体」（負なら0）。'},
 {h:'例題（3つの集合と比）',q:'社会学の本'+m('64冊')+'のうち、社会学だけの本が'+m('34冊')+'。すべてに分類できる本は、心理学と社会学だけの本の'+m('3倍')+'、教育学と社会学だけの本の'+m('半分')+'。すべてに分類できる本は何冊か。'},
 {h:'ステップ1〜3',p:'社会学の64冊を4つに分ける。心理学と社会学だけを1とすると、すべて＝3、教育学と社会学だけ＝6。64 − 34 ＝ 30 が 1 ＋ 3 ＋ 6 ＝ 10 → 1 ＝ 3 → すべて ＝ 9',
  fig:{table:{head:['社会学の内訳','比','冊数'],rows:[['社会学だけ','',34],['心理学と社会学だけ',1,3],['教育学と社会学だけ',6,18],['すべて',3,9],['計','',64]]}}},
 {h:'まとめ',p:'3つの集合は、聞かれている集合1つを内訳に分け、比を「1」に置いてそろえる。'}]);
LS(TK,4,[
 {h:'例題（硬貨・切手の枚数）',q:'500円玉、100円玉、50円玉、10円玉を全種類組み合わせて、合計'+m('13枚')+'で'+m('1450円')+'を作るとき、100円玉は何枚必要か。'},
 {h:'ステップ1 内訳を探す',p:'「全種類」なので各1枚（660円・4枚）を先に除く。残り 790円・9枚。'},
 {h:'ステップ2 表を描く',p:'大きい硬貨から決める。500円玉を足さないと、790円を9枚の100円・50円・10円では作れない（100円9枚でも900円で、50円を混ぜると枚数が足りない）。500円玉を1枚足すと残り290円・8枚。',fig:{table:{head:['','500円','100円','50円','10円'],rows:[['各1枚',1,1,1,1],['もう1枚',1,'?','?','?']]}}},
 {h:'ステップ3 空白を埋める',p:'290円・8枚を100円・50円・10円で作る。全部10円なら80円で、差210円。100円1枚で＋90円、50円1枚で＋40円 → 90 ＋ 40 × 3 ＝ 210 なので 100円1枚・50円3枚・10円4枚。',fig:{table:{head:['','500円','100円','50円','10円','計'],rows:[['枚数',2,2,4,5,13],['金額',1000,200,200,50,1450]]}}},
 {h:'答え',p:'2枚。最大の枚数は「安いものを多く」、最小の枚数は「高いものを多く」使い、ちょうどにならなければ1枚ずつ入れ替えて調整する。'},
 {h:'例題（f(n) の時給）',q:'f(n)＝f(n−1)＋'+m('10n')+'＋'+m('20')+'、最初の時給 a ＝ '+m('700円')+'。3年後の時給 f(3) はいくらか。'},
 {h:'ステップ1〜3',p:'増える額を n ＝ 1, 2, 3 で書き出して足す。',fig:{table:{head:['n',1,2,3],rows:[['増える額',30,40,50]]}},p2:'700 ＋ 30 ＋ 40 ＋ 50 ＝ 820'},
 {h:'まとめ',p:'f(n) は式を変形せず、表に書き出して足す（逆算は引く）。'}]);
LS(JO,4,[
 {h:'例題（長文の照合）',q:'原油の支払金額は2007年度'+m('13.7兆円')+'、1997年度'+m('3.9兆円')+'。天然ガスは2007年度'+m('3.5兆円')+'。「2007年度の輸入支払金額は、10年前に比べて10兆円近く増加している」は正しいか。'},
 {h:'ステップ1 内訳を探す',p:'選択肢の主語（原油か天然ガスか）と年度を決め、文中の数字に印をつける。'},
 {h:'ステップ2 表に書き出す',fig:{table:{head:['','1997年度','2006年度','2007年度'],rows:[['原油','3.9兆円','11.4兆円','13.7兆円'],['天然ガス','','2.7兆円','3.5兆円']]}}},
 {h:'ステップ3 確かめる',p:'13.7 − 3.9 ＝ 9.8兆円 → 10兆円近く ○。「約5倍」なら 13.7 ÷ 3.5 ＝ 3.9倍で ×。'},
 {h:'まとめ',p:'長文は計算より照合。数字を表に書き出し、選択肢ごとに割り算・引き算を1回するだけ。文中にないことは誤り。'}]);
})();
