/* 本番形式：表の解釈の4タブの組（模擬テストの1問目用）。担当B（2026-11-18 作り直し）
   本番どおり「表1（4×4か4×3）」と「表2（4×3か4×1の補助の表）」の2つを使う。4問のうち2問以上は2つの表を組み合わせないと解けない。
   題材と言い回しは問題集の表問題（182〜189）に寄せ、ほかは同じ文体の定番の題材（売上・不良品・栄養・収穫量など）。
   theme(id, 指標, gen)：gen(R) は {stem, qs:[4問]} を返す。各問は {q, ans, wr, u, d, str, l, calc, x(別の計算の答え。検査用)}。作れないときは null。
   登録は set_shugo_hyo.js の tb と同じく BOOKDEFS 方式（setcore の makeBook が4問の共通部分＝表までを stem にする）。 */
(function(){
var S=window.SETS=window.SETS||{},BD=window.BOOKDEFS=window.BOOKDEFS||{};
var R={int:function(a,b){return a+Math.floor(Math.random()*(b-a+1));},pick:function(x){return x[Math.floor(Math.random()*x.length)];},
 shuffle:function(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}};
function pk(a){return R.pick(a);}function ri(a,b){return R.int(a,b);}
function isInt(x){return Math.abs(x-Math.round(x))<1e-7;}
function rk(x,k){var m=Math.pow(10,k),y=x*m;if(!isFinite(y)||Math.abs(y-Math.floor(y)-0.5)<1e-6)return NaN;return Math.round(y+1e-9)/m;}
function nb(x){return Math.round(x*1e6)/1e6;}
function f1(x){return (Math.round(x*10)/10).toFixed(1);}
function sum(a){return a.reduce(function(s,x){return s+x;},0);}
var PR={0:'（必要なときは、最後に小数第1位を四捨五入すること）',1:'（必要なときは、最後に小数第2位を四捨五入すること）',2:'（必要なときは、最後に小数第3位を四捨五入すること）'};
function fmt(x,r){return r.str?String(x):(r.d?Number(x).toFixed(r.d):String(x))+r.u;}
function CH(r){if(!r.str&&!(isFinite(r.ans)&&r.ans>0))return null;var a=fmt(r.ans,r),out=[a],c=r.wr.slice();
 if(!r.str){var k=r.d?Math.pow(10,r.d):1;[0.8,1.2,0.9,1.1,0.5,1.5].forEach(function(m){c.push(Math.round(r.ans*m*k)/k);});[1,-1,2,-2].forEach(function(s){c.push(Math.round((r.ans+s*(r.d?Math.pow(10,-r.d):1))*k)/k);});}
 c.forEach(function(x){if(out.length>=5)return;if(!r.str&&!(isFinite(x)&&x>0))return;if(!r.str&&!r.d&&!isInt(x))return;var s=fmt(x,r);if(out.indexOf(s)<0)out.push(s);});
 if(out.length<4)return null;var sh=R.shuffle(out);return {c:sh,a:sh.indexOf(a)};}
function same(r){if(r.x===undefined)return true;return r.str?String(r.x)===String(r.ans):fmt(nb(r.x),r)===fmt(nb(r.ans),r);}
function TB(head,rows){return '<div class="tbl-wrap"><table class="tbl"><tr>'+head.map(function(h){return '<th>'+h+'</th>';}).join('')+'</tr>'+
 rows.map(function(r){return '<tr>'+r.map(function(c,i){return i?'<td>'+c+'</td>':'<th>'+c+'</th>';}).join('')+'</tr>';}).join('')+'</table></div>';}
var HY='表の解釈';
function theme(id,L,gen){var ks=[1,2,3,4].map(function(i){return 'T4-'+id+'#'+i;}),LV=[L,L,L,L];
 BD[ks[0]]={fd:HY,lv:L,d:{P:{_:[0]},ok:function(v){for(var n=0;n<300;n++){var g=null;try{g=gen();}catch(e){g=null;}if(!g||g.qs.length!==4)continue;var os=[],bad=false;
   g.qs.forEach(function(r){if(bad)return;var ch=CH(r);if(!ch||!same(r)){bad=true;return;}os.push({q:g.stem+r.q,c:ch.c,a:ch.a,calc:r.calc});});if(bad)continue;v._o=os;v._g=g;return true;}return false;},f:function(v){return v._o[0];}}};
 for(var i=1;i<4;i++)(function(i){BD[ks[i]]={fd:HY,lv:L,d:{P:{_:[0]},ok:function(v){return !!v._o;},f:function(v){return v._o[i];}}};})(i);
 S[HY]=S[HY]||{};(S[HY][L]=S[HY][L]||[]).push({id:'set4-'+id,book:ks,tb:1,tabs:4,gen:gen});}
/* 名前（記号）だけを選ぶ問いの選択肢 */
function nm(ans,all){return all.filter(function(s){return s!==ans;});}
function argmax(a){var m=0;a.forEach(function(x,i){if(x>a[m])m=i;});return m;}
function uniqMax(a){var s=a.slice().sort(function(x,y){return y-x;});return s[0]-s[1]>Math.abs(s[0])*0.02+1e-9;}

/* ===== 1 列車の下車人数と距離別運賃（問題集187） ===== */
var FB=[10,30,50,80,110],FY=[140,400,600,800,1000];
function fare(d){for(var i=0;i<FB.length;i++)if(d<=FB[i])return FY[i];return NaN;}
theme('train',4,function(){var dQ=ri(15,40),dR=dQ+ri(12,30),dS=dR+ri(15,40);if(dS>110)return null;
 var n={PQ:ri(10,40),PR:ri(10,40),PS:ri(10,40),QR:ri(10,40),QS:ri(10,40),RS:ri(10,40)};var D={P:0,Q:dQ,R:dR,S:dS};
 var stem='ある列車Aは、始発駅のP駅を出発した後、順にQ駅、R駅の2駅に停車して、終点のS駅に到着する。表1は、P駅からQ駅、R駅、S駅までの距離と、乗車駅別にみた各駅での下車人数を示したものである。また、表2は、乗車駅からの距離別の運賃を示している。'+
  '<br>【表1】各駅での下車人数'+TB(['P駅からの距離','下車＼乗車','P駅','Q駅','R駅'],[[dQ+'km','Q駅',n.PQ+'人','—','—'],[dR+'km','R駅',n.PR+'人',n.QR+'人','—'],[dS+'km','S駅',n.PS+'人',n.QS+'人',n.RS+'人']])+
  '【表2】距離別運賃'+TB(['距離','10kmまで','30kmまで','50kmまで','80kmまで','110kmまで'],[['運賃','140円','400円','600円','800円','1000円']]);
 var qr=n.PR+n.PS+n.QR+n.QS,sS=n.PS*fare(dS)+n.QS*fare(dS-dQ)+n.RS*fare(dS-dR),sQ=n.QR*fare(dR-dQ)+n.QS*fare(dS-dQ),pr=rk(n.PR/(n.PR+n.QR)*100,0);
 var bf=function(o,dst){var s=0;['P','Q','R','S'].forEach(function(a){['P','Q','R','S'].forEach(function(b){var k=a+b;if(n[k]&&(o?a===o:true)&&(dst?b===dst:true))s+=n[k]*fare(D[b]-D[a]);});});return s;};
 return {stem:stem,qs:[
  {q:'Q駅からR駅の間、列車Aに乗っている人は何人か。',ans:qr,wr:[n.PR+n.PS,n.QR+n.QS,qr+n.PQ,n.PR+n.QR+n.RS],u:'人',x:(n.PQ+n.PR+n.PS+n.QR+n.QS)-n.PQ,calc:'P駅から乗ってQ駅より先まで '+n.PR+' ＋ '+n.PS+'<br>Q駅から乗った人 '+n.QR+' ＋ '+n.QS+'<br>合計 '+qr},
  {q:'S駅で下車した人の乗車運賃の合計はどれだけか。',ans:sS,wr:[(n.PS+n.QS+n.RS)*fare(dS),sS-n.QS*fare(dS-dQ)+n.QS*fare(dS),sS+10*n.RS,sS-20*n.PS],u:'円',x:bf(null,'S'),
   calc:'P駅から '+dS+'km → '+fare(dS)+'円 × '+n.PS+'<br>Q駅から '+(dS-dQ)+'km → '+fare(dS-dQ)+'円 × '+n.QS+'<br>R駅から '+(dS-dR)+'km → '+fare(dS-dR)+'円 × '+n.RS+'<br>合計 '+sS+'円'},
  {q:'R駅で下車した人のうち、P駅から乗車した人の割合は何%か'+PR[0]+'。',ans:pr,wr:[rk(n.QR/(n.PR+n.QR)*100,0),rk(n.PR/(n.PQ+n.PR+n.PS)*100,0),rk(n.PR/qr*100,0)],u:'%',x:rk(100-n.QR/(n.PR+n.QR)*100,0),calc:n.PR+' ÷ ('+n.PR+' ＋ '+n.QR+') ≒ '+pr+'%'},
  {q:'Q駅で乗車した人の乗車運賃の合計はどれだけか。',ans:sQ,wr:[(n.QR+n.QS)*fare(dS-dQ),(n.QR+n.QS)*fare(dR-dQ),n.QR*fare(dR)+n.QS*fare(dS),sQ+1000],u:'円',x:bf('Q',null),
   calc:'R駅まで '+(dR-dQ)+'km → '+fare(dR-dQ)+'円 × '+n.QR+'<br>S駅まで '+(dS-dQ)+'km → '+fare(dS-dQ)+'円 × '+n.QS+'<br>合計 '+sQ+'円'}]};});

/* ===== 2 有機化合物の原子個数比と重量比（問題集182） ===== */
var EL=['水素','炭素','酸素','窒素'],EW=[1,12,16,14];
theme('atom',5,function(){var rows=[0,1,2].map(function(){var h=ri(550,650)/10,c=ri(150,220)/10,nn=ri(10,40)/10,ot=ri(5,25)/10,o=nb(100-h-c-nn-ot);return o>=10&&o<=25?[h,c,o,nn,ot]:null;});
 if(rows.some(function(x){return !x;}))return null;var CP=['P','Q','R'],ws=rows.map(function(r){return r.slice(0,4).map(function(p,i){return p*EW[i];});});
 var stem='ある有機化合物P、Q、Rは、水素、炭素、酸素、窒素、その他の元素で構成されている。P、Q、Rの1分子中の各元素の原子個数比は表1の通りである。また、各元素の原子1個の重量比は、水素を1としたとき表2の通りである。'+
  '<br>【表1】原子個数比（%）'+TB(['','水素','炭素','酸素','窒素','その他','合計'],rows.map(function(r,i){return [CP[i]].concat(r.map(f1)).concat(['100']);}))+
  '【表2】原子1個の重量比'+TB(['元素','水素','炭素','酸素','窒素'],[['重量比','1','12','16','14']]);
 if(!uniqMax(ws[0]))return null;var m0=argmax(ws[0]),fr=pk([['1/2',0.5],['2/3',2/3],['3/4',0.75]]);
 var b=rk(ws[1][1]/ws[1][0],1),c=rk(rows[2][1]/rows[1][1]*fr[1]*rows[1][3]/rows[2][3],2),d=rk(ws[0][2]/sum(ws[0])*100,0);
 return {stem:stem,qs:[
  {q:'化合物P1分子中に占める水素、炭素、酸素、窒素の各元素のうちで、重量が最大のものはどれか。',ans:EL[m0],str:1,wr:nm(EL[m0],EL),x:EL[ws[0].indexOf(Math.max.apply(null,ws[0]))],calc:EL.map(function(e,i){return e+' '+f1(rows[0][i])+' × '+EW[i]+' ＝ '+nb(ws[0][i]);}).join('<br>')+'<br>最大は '+EL[m0]},
  {q:'化合物Q1分子中の炭素の重量は、水素の重量の何倍か'+PR[1]+'。',ans:b,d:1,wr:[rk(rows[1][1]/rows[1][0],1),rk(ws[1][0]/ws[1][1]*10,1),rk(rows[1][1]*16/rows[1][0],1),rk(b+0.5,1)],u:'倍',x:rk(12*rows[1][1]/rows[1][0],1),calc:'炭素 '+f1(rows[1][1])+' × 12 ＝ '+nb(ws[1][1])+'、水素 '+f1(rows[1][0])+' × 1<br>'+nb(ws[1][1])+' ÷ '+f1(rows[1][0])+' ≒ '+b+' 倍'},
  {q:'化合物R1分子中の窒素の原子の個数が、化合物Qのそれの'+fr[0]+'であるとき、化合物R1分子中の炭素の原子の個数は、化合物Qのそれの何倍か'+PR[2]+'。',ans:c,d:2,wr:[rk(rows[2][1]/rows[1][1],2),rk(rows[2][1]/rows[1][1]/fr[1],2),rk(rows[1][1]/rows[2][1]*fr[1],2),rk(c+0.1,2)],u:'倍',x:rk((rows[2][1]/rows[2][3])/(rows[1][1]/rows[1][3])*fr[1],2),
   calc:'Rの原子の総数を y、Qを x とすると '+f1(rows[2][3])+'y ＝ '+fr[0]+' × '+f1(rows[1][3])+'x<br>炭素の比 '+f1(rows[2][1])+'y ÷ '+f1(rows[1][1])+'x ≒ '+c+' 倍'},
  {q:'化合物P1分子中で、酸素の重量は、水素、炭素、酸素、窒素の重量の合計の何%か'+PR[0]+'。',ans:d,wr:[rk(rows[0][2],0),rk(rows[0][2]*16/100,0),rk(ws[0][2]/(sum(ws[0])+rows[0][4])*50,0),d+5],u:'%',x:rk(100/(sum(ws[0])/ws[0][2]),0),calc:'重量の合計 '+ws[0].map(nb).join(' ＋ ')+' ＝ '+nb(sum(ws[0]))+'<br>酸素 '+nb(ws[0][2])+' ÷ '+nb(sum(ws[0]))+' ≒ '+d+'%'}]};});

/* ===== 3 水溶液の重量百分率と在庫量（問題集183） ===== */
theme('sol',5,function(){var SL=['水溶液X','水溶液Y','水溶液Z'],DR=['薬品a','薬品b','薬品c','薬品d'];var z=pk([[1,1],[1,2],[2,1],[1,3],[3,1],[2,3],[3,2]]),dX=ri(6,14)/10,dY=dX+ri(5,15)/10*(z[0]+z[1]);dY=nb(dY);
 var dZ=nb((z[0]*dX+z[1]*dY)/(z[0]+z[1]));if(!isInt(dZ*10))return null;
 var T=[[ri(20,30)/10,ri(40,60)/10,ri(4,10)/10,dX],[ri(20,30)/10,ri(40,60)/10,ri(4,10)/10,dY],[ri(25,35)/10,ri(30,45)/10,ri(15,25)/10,dZ]],W=[pk([200,300,400,500]),pk([250,300,400,600]),pk([200,300,500])];
 var stem='3種類の水溶液X、Y、Zに含まれる薬品a、b、c、dの重量百分率（%）は、表1の通りである。また、表2は各水溶液の在庫量を示したものである。'+
  '<br>【表1】重量百分率（%）'+TB(['','薬品a','薬品b','薬品c','薬品d'],T.map(function(r,i){return [SL[i]].concat(r.map(f1));}))+'【表2】在庫量'+TB(['','水溶液X','水溶液Y','水溶液Z'],[['在庫量'].concat(W.map(function(w){return w+'g';}))]);
 var g=pk([10,15,20,25,30]),a=rk(g*T[0][1]/T[0][0],0),c=rk(W[1]*T[1][2]/100,1),d=rk((W[0]*T[0][0]+W[2]*T[2][0])/(W[0]+W[2]),1);
 return {stem:stem,qs:[
  {q:'ある一定量の水溶液Xに含まれる薬品aの重さが'+g+'gのとき、同水溶液に含まれる薬品bの重さは何gか'+PR[0]+'。',ans:a,wr:[rk(g*T[0][0]/T[0][1],0),rk(g*T[0][1]/10,0),rk(g*100/T[0][0]*T[1][1]/100,0),a+3],u:'g',x:rk(g/(T[0][0]/100)*(T[0][1]/100),0),calc:'水溶液X '+g+' ÷ '+nb(T[0][0]/100)+'<br>× '+nb(T[0][1]/100)+' ≒ '+a+'g'},
  {q:'水溶液XとYを混合してできる新しい水溶液に含まれる薬品dの重量百分率を、水溶液Zのそれと等しくしたい。水溶液XとYを、どのような割合で混ぜればよいか。',ans:z[0]+'：'+z[1],str:1,wr:nm(z[0]+'：'+z[1],['1：1','1：2','2：1','1：3','3：1','2：3','3：2']).slice(0,4),x:(function(){var p=(dY-dZ),q=(dZ-dX),g2=function(a,b){return b<1e-9?a:g2(b,a%b);},k=g2(Math.round(p*10),Math.round(q*10));return Math.round(p*10)/k+'：'+Math.round(q*10)/k;})(),
   calc:'X を x、Y を y とすると '+f1(dX)+'x ＋ '+f1(dY)+'y ＝ '+f1(dZ)+'(x ＋ y)<br>'+nb(dZ-dX)+'x ＝ '+nb(dY-dZ)+'y → x：y ＝ '+z[0]+'：'+z[1]},
  {q:'在庫の水溶液Yをすべて使うとき、含まれる薬品cの重さは何gか'+PR[1]+'。',ans:c,d:1,wr:[rk(W[1]*T[1][1]/100,1),rk(W[1]*T[0][2]/100,1),rk(W[1]*T[1][2]/10,1),rk(c+1,1)],u:'g',x:rk(T[1][2]*W[1]/100,1),calc:W[1]+' × '+nb(T[1][2]/100)+' ＝ '+c+'g'},
  {q:'在庫の水溶液XとZをすべて混ぜ合わせたとき、できる水溶液に含まれる薬品aの重量百分率は何%か'+PR[1]+'。',ans:d,d:1,wr:[rk((T[0][0]+T[2][0])/2,1),rk((W[0]*T[2][0]+W[2]*T[0][0])/(W[0]+W[2]),1),rk(T[0][0]+T[2][0],1)],u:'%',x:rk(T[0][0]+(T[2][0]-T[0][0])*W[2]/(W[0]+W[2]),1),
   calc:'薬品a '+W[0]+' × '+nb(T[0][0]/100)+' ＋ '+W[2]+' × '+nb(T[2][0]/100)+' ＝ '+nb((W[0]*T[0][0]+W[2]*T[2][0])/100)+'g<br>÷ '+(W[0]+W[2])+' ≒ '+d+'%'}]};});

/* ===== 4 混合気体の体積比率と比重（問題集184） ===== */
var GS=['メタン','エタン','プロパン','ブタン','ペンタン'],SG=[1.0,1.8,2.8,3.6,4.5];
theme('gas',5,function(){var C=[0,1,2].map(function(){var e=ri(30,90)/10,p=ri(20,50)/10,b=ri(0,30)/10,pe=ri(10,30)/10,ot=ri(0,6)/10,m=nb(100-e-p-b-pe-ot);return m>=80?[m,e,p,b,pe,ot]:null;});if(C.some(function(x){return !x;}))return null;
 var stem='混合気体X、Y、Zがそれぞれ封入されている3つの容器がある。各容器に含まれる気体の構成体積比率（%）は、表1の通りである。また、表2はメタンを1としたときの各気体の比重を示したものである。'+
  '<br>【表1】構成体積比率（%）'+TB(['','X','Y','Z'],GS.concat(['その他']).map(function(g,i){return [g].concat(C.map(function(c){return f1(c[i]);}));}))+'【表2】比重'+TB(['気体'].concat(GS),[['比重'].concat(SG.map(function(s){return s.toFixed(1);}))]);
 var w=C.map(function(c){return GS.map(function(g,i){return c[i]*SG[i];});}),M=pk([60,70,75,80,90]),a=rk(M*w[0][1]/w[0][0],2);
 var zw=w[2].slice(1);if(!uniqMax(zw))return null;var zi=argmax(zw)+1,c=rk(C[1][2]/C[0][2],2),G=pk([40,50,60,80]),s=sum(w[1].slice(1)),d=rk(G*w[1][4]/s,1);
 return {stem:stem,qs:[
  {q:'混合気体Xに含まれるメタンの重量は'+M+'gだった。混合気体Xに含まれるエタンの重量はどれだけか'+PR[2]+'。',ans:a,d:2,wr:[rk(M*C[0][1]/C[0][0],2),rk(M*C[0][1]/100*1.8,2),rk(M*w[0][1]/100,2),rk(a+1,2)],u:'g',x:rk(M/(C[0][0]*1)*C[0][1]*1.8,2),calc:'メタン '+f1(C[0][0])+' × 1.0、エタン '+f1(C[0][1])+' × 1.8 ＝ '+nb(w[0][1])+'<br>'+M+' × '+nb(w[0][1])+' ÷ '+f1(C[0][0])+' ≒ '+a+'g'},
  {q:'メタンを除いて、混合気体Zに含まれる重量が最も大きい気体はどれか。',ans:GS[zi],str:1,wr:nm(GS[zi],GS.slice(1)).concat(['メタン']),x:GS[1+zw.indexOf(Math.max.apply(null,zw))],calc:GS.slice(1).map(function(g,i){return g+' '+f1(C[2][i+1])+' × '+SG[i+1]+' ＝ '+nb(w[2][i+1]);}).join('<br>')+'<br>最大は '+GS[zi]},
  {q:'混合気体XとYの体積が等しいとき、混合気体Yに含まれるプロパンの体積は、混合気体Xに含まれるプロパンの体積の何倍か'+PR[2]+'。',ans:c,d:2,wr:[rk(C[0][2]/C[1][2],2),rk(C[1][2]*2.8/C[0][2]/2,2),rk(c+0.2,2)],u:'倍',x:rk(1/(C[0][2]/C[1][2]),2),calc:f1(C[1][2])+' ÷ '+f1(C[0][2])+' ≒ '+c+' 倍'},
  {q:'混合気体Yからメタンを除いたときの重量は'+G+'gだった。混合気体Yのペンタンの重量はどれだけか'+PR[1]+'。',ans:d,d:1,wr:[rk(G*C[1][4]/(100-C[1][0]),1),rk(G*w[1][4]/sum(w[1]),1),rk(G*C[1][4]/100*4.5,1),rk(d+1,1)],u:'g',x:rk(G/(s/w[1][4]),1),
   calc:'メタン以外の重量の比 '+w[1].slice(1).map(nb).join(' ＋ ')+' ＝ '+nb(s)+'<br>ペンタン '+G+' × '+nb(w[1][4])+' ÷ '+nb(s)+' ≒ '+d+'g'}]};});

/* ===== 5 4県の年代別人口割合と県の人数の割合（問題集185） ===== */
var AG=['① 0〜14歳','② 15〜39歳','③ 40〜64歳','④ 65歳以上'],KN=['W県','X県','Y県','Z県'];
theme('pref',5,function(){var cols=[0,1,2,3].map(function(){var a=ri(2,4)*5,e=ri(3,5)*5,b=ri(5,8)*5,c=100-a-b-e;return c<15?null:[a,b,c,e];});if(cols.some(function(x){return !x;}))return null;var w=R.shuffle([10,20,30,40]);
 var stem='W、X、Y、Zの4県における年代別の人口割合を百分率（%）で示したものが表1である（2020年調べ）。また、表2は各県の人数が全4県の人数に対して占める百分率である。'+
  '<br>【表1】年代別の人口割合（%）'+TB(['','W県','X県','Y県','Z県'],AG.map(function(g,j){return [g].concat(cols.map(function(c){return c[j];}));}))+'【表2】県の人数の割合（%）'+TB(['','W県','X県','Y県','Z県'],[['県／全4県'].concat(w)]);
 var a=rk(sum(cols.map(function(c,k){return c[0]*w[k];}))/100,1),b=rk(cols[1][3]*w[1]/100,1),cc=rk(cols[0][3]*w[0]/(cols[3][3]*w[3]),2);
 var DEC=pk([['3/4',3,4],['4/5',4,5],['2/3',2,3]]),INC=pk([['2倍',2],['1.5倍',1.5],['1.25倍',1.25]]),Y=cols[2],a0=Y[0]*DEC[2]/DEC[1],e0=Y[3]/INC[1],d=rk(e0/(a0+Y[1]+Y[2]+e0)*100,1);
 return {stem:stem,qs:[
  {q:'全4県の人口のうち、0〜14歳の人口が占める割合は何%か'+PR[1]+'。',ans:a,d:1,wr:[rk(sum(cols.map(function(c){return c[0];}))/4,1),rk(cols[0][0]*w[0]/100,1),rk(a+2,1),rk(a-1.5,1)],u:'%',x:rk(cols.reduce(function(s,c,k){return s+c[0]/100*w[k];},0),1),calc:cols.map(function(c,k){return c[0]+' × '+nb(w[k]/100);}).join(' ＋ ')+' ＝ '+a+'%'},
  {q:'X県の65歳以上の人口は、全4県の人口の何%か'+PR[1]+'。',ans:b,d:1,wr:[cols[1][3],w[1],rk(cols[1][3]/w[1]*10,1),rk(b+1,1)],u:'%',x:rk(w[1]*cols[1][3]/100,1),calc:cols[1][3]+'% × '+nb(w[1]/100)+' ＝ '+b+'%'},
  {q:'W県の65歳以上の人口は、Z県の65歳以上の人口の何倍か'+PR[2]+'。',ans:cc,d:2,wr:[rk(cols[0][3]/cols[3][3],2),rk(w[0]/w[3],2),rk(cols[3][3]*w[3]/(cols[0][3]*w[0]),2),rk(cc+0.1,2)],u:'倍',x:rk((cols[0][3]/cols[3][3])*(w[0]/w[3]),2),calc:'W '+cols[0][3]+' × '+w[0]+' ＝ '+cols[0][3]*w[0]+'、Z '+cols[3][3]+' × '+w[3]+' ＝ '+cols[3][3]*w[3]+'<br>'+cols[0][3]*w[0]+' ÷ '+cols[3][3]*w[3]+' ≒ '+cc+' 倍'},
  {q:'Y県では10年前に比べて、0〜14歳の人口が'+DEC[0]+'に減り、65歳以上の人口が'+INC[0]+'に増え、そのほかの人口は横ばいだった。10年前の時点で、Y県の人口に対して65歳以上の人口が占める比率は何%であったか'+PR[1]+'。',ans:d,d:1,wr:[Y[3],rk(e0,1),rk(Y[3]*INC[1]/(100)*100/1.1,1),rk(d+1.5,1)],u:'%',x:rk(100/((a0+Y[1]+Y[2]+e0)/e0),1),
   calc:'今のY県を100とすると、10年前の0〜14歳 '+Y[0]+' ÷ '+DEC[0]+' ＝ '+nb(a0)+'、65歳以上 '+Y[3]+' ÷ '+INC[1]+' ＝ '+nb(e0)+'<br>10年前の計 '+nb(a0+Y[1]+Y[2]+e0)+'<br>'+nb(e0)+' ÷ '+nb(a0+Y[1]+Y[2]+e0)+' ≒ '+d+'%'}]};});

/* ===== 6 2日間のイベントの入場者と入場券（問題集186） ===== */
theme('event',5,function(){var p=[pk([50,55,60,65]),pk([45,50,55,60]),pk([50,55,60])],L=ri(20,40)*100,A=L*(100-p[1])/(100-p[0]);if(!isInt(A))return null;
 var t1=ri(4,9)*100,i1=L-2*t1;if(i1<=0)return null;var u=pk([80,90,70]),U=ri(5,12)*100,o2=ri(10,20)*100,N=o2+U*(1+u/100);if(!isInt(N))return null;var o0=ri(10,20)*100,t0=ri(3,8)*100;
 var stem='ある施設では、毎年2日連続で開催されるイベントがある。表1は、過去3年間のイベントの延べ入場者数とその内訳を示したものである。表2は、イベントで発売された「1日入場券」と「2日入場券」の購入者数を示したものである。なお、「2日入場券」を購入しても2日間とも入場したとは限らないが、入場券を購入して1日も入場しなかった人はいなかったものとする。'+
  '<br>【表1】過去3年間の延べ入場者数とその内訳'+TB(['','一昨年','昨年','今年'],[['延べ入場者数','ア',L+'人',N+'人'],['1日目',p[0]+'%',p[1]+'%',p[2]+'%'],['2日目',(100-p[0])+'%',(100-p[1])+'%',(100-p[2])+'%'],['計','100%','100%','100%']])+
  '【表2】入場券の購入者数'+TB(['','一昨年','昨年','今年'],[['1日入場券',o0+'人','イ',o2+'人'],['2日入場券',t0+'人',t1+'人','ウ']]);
 var d=N*p[2]/100;if(!isInt(d))return null;
 return {stem:stem,qs:[
  {q:'一昨年の2日目の入場者数は、昨年の2日目の入場者数と同じだった。一昨年の延べ入場者数アは何人か。',ans:A,wr:[L,r(L*(100-p[0])/(100-p[1])),r(L*p[1]/p[0]),A+200],u:'人',x:(L-L*p[1]/100)/((100-p[0])/100),calc:'昨年の2日目 '+L+' × '+nb((100-p[1])/100)+' ＝ '+L*(100-p[1])/100+'<br>ア ＝ '+L*(100-p[1])/100+' ÷ '+nb((100-p[0])/100)+' ＝ '+A},
  {q:'昨年の「2日入場券」購入者は、全員2日間とも入場した。昨年の「1日入場券」購入者数イは何人か。',ans:i1,wr:[L-t1,r(L/2)-t1,L-3*t1>0?L-3*t1:i1+t1,i1+100],u:'人',x:L-t1-t1,calc:'2日入場券の延べ '+t1+' × 2 ＝ '+2*t1+'<br>イ ＝ '+L+' − '+2*t1+' ＝ '+i1},
  {q:'今年の「2日入場券」購入者のうち、'+u+'%が2日間とも入場した。今年の「2日入場券」購入者ウは何人か。',ans:U,wr:[r((N-o2)/2),N-o2,r((N-o2)*u/100),U+100],u:'人',x:(N-o2)/(2*u/100+(100-u)/100),calc:'ウを x とすると '+o2+' ＋ '+nb(u/100)+'x × 2 ＋ '+nb((100-u)/100)+'x ＝ '+N+'<br>'+nb(1+u/100)+'x ＝ '+(N-o2)+' → x ＝ '+U},
  {q:'今年の1日目の入場者数は何人か。',ans:d,wr:[N*(100-p[2])/100,o2,r(N/2),d+100],u:'人',x:N-N*(100-p[2])/100,calc:N+' × '+nb(p[2]/100)+' ＝ '+d}]};});
function r(x){return Math.round(x);}

/* ===== 7 クラス別・科目別の受験者数と平均点（問題集188） ===== */
var SU=['物理','化学','生物'],CL=['P','Q','R','S'];
theme('class',5,function(){var n=CL.map(function(){var a=ri(5,18),b=ri(5,18),c=40-a-b;return c>=5?[a,b,c]:null;});if(n.some(function(x){return !x;}))return null;var av=CL.map(function(){return [ri(590,740)/10,ri(590,740)/10,ri(590,740)/10];});
 var Rn=n[2],Ra,Rt,ok=false;for(var t=0;t<300&&!ok;t++){av[2]=[ri(590,740)/10,ri(590,740)/10,ri(590,740)/10];Ra=av[2];Rt=Rn[0]*Ra[0]+Rn[1]*Ra[1]+Rn[2]*Ra[2];ok=Ra[1]!==Ra[2]&&isInt(nb(Rt/40*10));}if(!ok)return null;var RG=nb(Rt/40);
 var stem='ある学校の3年生は1クラス40人で、P、Q、R、Sの4クラスがあり、各クラスの全員が物理、化学、生物のいずれかの科目を選択して受験している。下表は各科目の受験者数と平均点を表したものの一部である。'+
  '<br>【表1】各クラス・各科目別受験者数　1クラスは40人'+TB(['','Pクラス','Qクラス','Rクラス','Sクラス'],SU.map(function(s,j){return [s].concat(n.map(function(x,i){return i===2&&j===1?'（　　）':i===2&&j===2?'（ ア ）':x[j]+'人';}));}))+
  '【表2】各クラス・各科目別平均点'+TB(['','Pクラス','Qクラス','Rクラス','Sクラス'],SU.map(function(s,j){return [s].concat(av.map(function(x){return f1(x[j])+'点';}));}));
 var a=rk((n[0][0]*av[0][0]+n[0][1]*av[0][1]+n[0][2]*av[0][2])/40,1),pn=sum(n.map(function(x){return x[0];})),b=rk(sum(n.map(function(x,i){return x[0]*av[i][0];}))/pn,1),c=Rn[2],d=rk(n[3][1]/n[3][0],2);
 return {stem:stem,qs:[
  {q:'Pクラスの3科目を合わせた平均点はいくつか'+PR[1]+'。',ans:a,d:1,wr:[rk(sum(av[0])/3,1),rk(a+0.4,1),rk(a-0.6,1),rk(a+1.1,1)],u:'点',x:rk(sum(n[0].map(function(k,j){return k*av[0][j];}))/sum(n[0]),1),calc:n[0].map(function(k,j){return k+' × '+f1(av[0][j]);}).join(' ＋ ')+' ＝ '+nb(a*40)+'<br>÷ 40 ≒ '+a+'点'},
  {q:'物理の全クラスの平均点はいくつか'+PR[1]+'。',ans:b,d:1,wr:[rk(sum(av.map(function(x){return x[0];}))/4,1),rk(b+0.8,1),rk(b-1.2,1),rk(b+2,1)],u:'点',x:rk(n.reduce(function(s,x,i){return s+x[0]*av[i][0];},0)/(n[0][0]+n[1][0]+n[2][0]+n[3][0]),1),calc:'物理の合計点 ÷ 物理の受験者数 '+pn+'人 ≒ '+b+'点'},
  {q:'Rクラスの3科目を合わせた平均点が'+RG+'点のとき、Rクラスの生物の受験者数（ア）は何人か。',ans:c,wr:[Rn[1],40-Rn[0],c+1,c-1],u:'人',x:(function(){for(var y=0;y<=40-Rn[0];y++)if(Math.abs(Rn[0]*Ra[0]+(40-Rn[0]-y)*Ra[1]+y*Ra[2]-RG*40)<1e-6)return y;})(),
   calc:'生物を x 人とすると '+Rn[0]+' × '+f1(Ra[0])+' ＋ '+f1(Ra[1])+'('+(40-Rn[0])+' − x) ＋ '+f1(Ra[2])+'x ＝ '+RG+' × 40<br>x ＝ '+c},
  {q:'Sクラスで、化学の受験者数は物理の受験者数の何倍か'+PR[2]+'。',ans:d,d:2,wr:[rk(n[3][0]/n[3][1],2),rk(n[3][1]/40,2),rk(d+0.1,2)],u:'倍',x:rk(1/(n[3][0]/n[3][1]),2),calc:n[3][1]+' ÷ '+n[3][0]+' ≒ '+d+' 倍'}]};});

/* ===== 8 4つのスキー場の交通手段（問題集189） ===== */
var TM=['乗用車','バス','電車','その他'],SK=['W','X','Y','Z'];
theme('ski',5,function(){var w=R.shuffle([10,20,30,40]);var P=SK.map(function(){var a=ri(1,6)*10,b=ri(1,5)*10,o=ri(1,2)*10,c=100-a-b-o;return c>=10?[a,b,c,o]:null;});if(P.some(function(x){return !x;}))return null;
 var tot=TM.map(function(t,j){return sum(P.map(function(p,k){return p[j]*w[k];}))/100;});
 var stem='ある町の4つのスキー場W、X、Y、Zで調査を行い、主に利用した交通手段を1つだけ挙げてもらった。表1は、回答結果にもとづいて、スキー場ごとに利用した交通手段の割合を示したものである。また表2は、スキー場ごとの回答者数が回答者数全体に占める割合を示している。'+
  '<br>【表1】利用した交通手段'+TB(['交通手段＼スキー場','W','X','Y','Z','合計'],TM.map(function(t,j){return [t].concat(P.map(function(p,k){return (k===0&&(j===0||j===2))?'（　）':p[j]+'%';})).concat([j===0||j===3?nb(tot[j])+'%':'（　）']);}).concat([['合計','100%','100%','100%','100%','100%']]))+
  '【表2】スキー場ごとの回答者数の割合'+TB(['','W','X','Y','Z','合計'],[['回答者の割合'].concat(w.map(function(x){return x+'%';})).concat(['100%'])]);
 var a=rk(P[1][2]*w[1]/100,0),b=rk(P[3][1]*w[3]/(P[1][1]*w[1]),1),c=nb((tot[0]*100-sum([1,2,3].map(function(k){return P[k][0]*w[k];})))/w[0]),Nn=pk([36,45,54,60,72,90,108]),Yo=P[2][3]*w[2]/10000,N=Nn/Yo;if(!isInt(N)||!isInt(c))return null;
 return {stem:stem,qs:[
  {q:'スキー場Xで「電車」と答えた人は、4つのスキー場での回答者数全体の何%か'+PR[0]+'。',ans:a,wr:[P[1][2],w[1],rk(P[1][2]/w[1],0)||a+3,a+5],u:'%',x:rk(w[1]*P[1][2]/100,0),calc:P[1][2]+'% × '+nb(w[1]/100)+' ≒ '+a+'%'},
  {q:'スキー場Zで「バス」と答えた人は、スキー場Xで「バス」と答えた人の何倍か'+PR[1]+'。',ans:b,d:1,wr:[rk(P[3][1]/P[1][1],1),rk(w[3]/w[1],1),rk(P[1][1]*w[1]/(P[3][1]*w[3]),1),rk(b+0.5,1)],u:'倍',x:rk((P[3][1]/P[1][1])*(w[3]/w[1]),1),calc:'Z '+P[3][1]+' × '+w[3]+' ＝ '+P[3][1]*w[3]+'、X '+P[1][1]+' × '+w[1]+' ＝ '+P[1][1]*w[1]+'<br>'+P[3][1]*w[3]+' ÷ '+P[1][1]*w[1]+' ≒ '+b+' 倍'},
  {q:'スキー場Wで「乗用車」と答えた人は、スキー場Wでの回答者数の何%か'+PR[0]+'。',ans:c,wr:[rk(tot[0],0),rk(c*w[0]/100,0)||c+10,c+10,Math.abs(c-10)||c+20],u:'%',x:P[0][0],calc:'全体の乗用車 '+nb(tot[0])+'% のうち、X・Y・Zの分 '+[1,2,3].map(function(k){return P[k][0]+' × '+nb(w[k]/100);}).join(' ＋ ')+'<br>Wの分 ÷ '+nb(w[0]/100)+' ＝ '+c+'%'},
  {q:'スキー場Yで「その他」と答えた人は'+Nn+'人であった。4つのスキー場での回答者数の合計は何人か。',ans:N,wr:[Nn*100/P[2][3],Nn*100/w[2],r(N*1.5),N*2],u:'人',x:Nn/(w[2]/100)/(P[2][3]/100),calc:'Yの「その他」は全体の '+nb(w[2]/100)+' × '+nb(P[2][3]/100)+' ＝ '+nb(Yo)+'<br>'+Nn+' ÷ '+nb(Yo)+' ＝ '+N}]};});

/* ===== 9 4店舗の商品別販売個数と価格 ===== */
var GD=['ケーキ','クッキー','プリン'],ST=['P店','Q店','R店','S店'];
theme('shop',4,function(){var n=ST.map(function(){return [ri(20,60),ri(30,90),ri(20,70)];}),pr=[pk([300,350,400,450]),pk([120,150,180,200]),pk([200,220,250,280])];if(pr[0]===pr[2])return null;
 var stem='ある菓子店チェーンのP店、Q店、R店、S店の4店舗における、ある日の商品別の販売個数を表1に、各商品の1個あたりの価格を表2に示す。'+
  '<br>【表1】販売個数（個）'+TB(['','ケーキ','クッキー','プリン'],ST.map(function(s,i){return [s].concat(n[i]);}))+'【表2】価格'+TB(['','ケーキ','クッキー','プリン'],[['1個あたりの価格'].concat(pr.map(function(p){return p+'円';}))]);
 var tt=n.map(function(x){return sum(x);}),i=pk([1,2,3]);if(tt[i]===tt[0])return null;var a=Math.abs(tt[i]-tt[0]),more=tt[i]>tt[0];
 var sR=sum(n[2].map(function(k,j){return k*pr[j];})),all=sum(n.map(function(x){return sum(x.map(function(k,j){return k*pr[j];}));})),ck=sum(n.map(function(x){return x[1];}))*pr[1],c=rk(ck/all*100,1);
 var up=pk([10,20]),dn=pk([5,8,10]);if(n[3][2]-dn<=0)return null;var d=pr[2]*(100+up)/100*(n[3][2]-dn);if(!isInt(d))return null;
 return {stem:stem,qs:[
  {q:ST[i]+'の販売個数の合計は、P店の販売個数の合計より何個'+(more?'多い':'少ない')+'か。',ans:a,wr:[Math.abs(n[i][0]-n[0][0])||a+5,Math.abs(n[i][1]-n[0][1])||a+7,tt[i],a+10],u:'個',x:Math.abs(sum(n[i])-sum(n[0])),calc:ST[i]+' '+n[i].join(' ＋ ')+' ＝ '+tt[i]+'、P店 '+n[0].join(' ＋ ')+' ＝ '+tt[0]+'<br>差 '+a},
  {q:'R店の売上金額の合計はいくらか。',ans:sR,wr:[tt[2]*pr[1],sum(n[2])*r(sum(pr)/3),sR+pr[0]*5,sR-pr[2]*5],u:'円',x:n[2][0]*pr[0]+n[2][1]*pr[1]+n[2][2]*pr[2],calc:n[2].map(function(k,j){return k+' × '+pr[j];}).join(' ＋ ')+' ＝ '+sR+'円'},
  {q:'4店舗のクッキーの売上金額の合計は、4店舗の全商品の売上金額の合計の何%か'+PR[1]+'。',ans:c,d:1,wr:[rk(sum(n.map(function(x){return x[1];}))/sum(tt)*100,1),rk(pr[1]/sum(pr)*100,1),rk(c+5,1),rk(c-3,1)],u:'%',x:rk(100/(all/ck),1),calc:'クッキー '+sum(n.map(function(x){return x[1];}))+' × '+pr[1]+' ＝ '+ck+'<br>全商品 '+all+'<br>'+ck+' ÷ '+all+' ≒ '+c+'%'},
  {q:'翌日、S店ではプリンの価格を'+up+'%値上げしたところ、プリンの販売個数は前日より'+dn+'個減った。翌日のS店のプリンの売上金額はいくらか。',ans:d,wr:[pr[2]*n[3][2],pr[2]*(100+up)/100*n[3][2],pr[2]*(n[3][2]-dn),d+pr[2]],u:'円',x:(pr[2]+pr[2]*up/100)*(n[3][2]-dn),calc:'価格 '+pr[2]+' × '+nb(1+up/100)+' ＝ '+pr[2]*(100+up)/100+'円、個数 '+n[3][2]+' − '+dn+' ＝ '+(n[3][2]-dn)+'<br>'+pr[2]*(100+up)/100+' × '+(n[3][2]-dn)+' ＝ '+d+'円'}]};});

/* ===== 10 4工場の製品別生産個数と不良品の発生率 ===== */
var PD=['製品A','製品B','製品C'],FC=['工場P','工場Q','工場R','工場S'];
theme('factory',4,function(){var n=FC.map(function(){return [ri(8,30)*100,ri(8,30)*100,ri(8,30)*100];}),rt=[pk([1.5,2,2.5]),pk([1,3,3.5]),pk([0.5,1.2,4])],tt=n.map(sum);if(!uniqMax(tt))return null;
 var stem='ある会社のP、Q、R、Sの4つの工場では、製品A、B、Cを生産している。表1は先月の各工場の製品別の生産個数を、表2は製品別の不良品の発生率を示したものである。'+
  '<br>【表1】生産個数（個）'+TB(['','製品A','製品B','製品C'],FC.map(function(f,i){return [f].concat(n[i]);}))+'【表2】不良品の発生率'+TB(['','製品A','製品B','製品C'],[['発生率'].concat(rt.map(function(x){return x+'%';}))]);
 var m=argmax(tt),b=n[1][1]*rt[1]/100,c=nb(sum(n[2].map(function(k,j){return k*rt[j]/100;}))),d=rk(sum(n.map(function(x){return x[0];}))/sum(n.map(function(x){return x[2];})),2);if(!isInt(b)||!isInt(c))return null;
 return {stem:stem,qs:[
  {q:'先月、生産個数の合計が最も多い工場はどれか。',ans:FC[m],str:1,wr:nm(FC[m],FC),x:FC[tt.indexOf(Math.max.apply(null,tt))],calc:FC.map(function(f,i){return f+' '+tt[i];}).join('、')+'<br>最も多いのは '+FC[m]},
  {q:'工場Qで生産された製品Bの不良品は何個か。',ans:b,wr:[n[1][1]*rt[0]/100,n[1][0]*rt[1]/100,n[1][1]*rt[1]/10,b+10],u:'個',x:rt[1]*n[1][1]/100,calc:n[1][1]+' × '+nb(rt[1]/100)+' ＝ '+b},
  {q:'工場Rで生産された製品の不良品は、合わせて何個か。',ans:c,wr:[r(tt[2]*sum(rt)/300),r(tt[2]*rt[0]/100),c+20,r(c*1.3)],u:'個',x:n[2][0]*rt[0]/100+n[2][1]*rt[1]/100+n[2][2]*rt[2]/100,calc:n[2].map(function(k,j){return k+' × '+nb(rt[j]/100);}).join(' ＋ ')+' ＝ '+c},
  {q:'4つの工場で生産された製品Aの生産個数の合計は、製品Cの生産個数の合計の何倍か'+PR[2]+'。',ans:d,d:2,wr:[rk(1/d,2),rk(d*rt[0]/rt[2],2),rk(d+0.1,2)],u:'倍',x:rk(1/(sum(n.map(function(x){return x[2];}))/sum(n.map(function(x){return x[0];}))),2),calc:'製品A '+sum(n.map(function(x){return x[0];}))+' ÷ 製品C '+sum(n.map(function(x){return x[2];}))+' ≒ '+d+' 倍'}]};});

/* ===== 11 食品の栄養素の量と1gあたりのエネルギー ===== */
var NU=['たんぱく質','脂質','炭水化物'],NK=[4,9,4],FD=['食品P','食品Q','食品R','食品S'];
theme('food',4,function(){var g=FD.map(function(){return [ri(10,250)/10,ri(5,300)/10,ri(50,600)/10];}),pt=g.map(function(x){return x[0];});if(!uniqMax(pt))return null;
 var stem='表1は、食品P、Q、R、Sの100gあたりに含まれる栄養素の量を、表2は各栄養素1gあたりのエネルギーを示したものである。'+
  '<br>【表1】100gあたりの栄養素の量（g）'+TB(['','たんぱく質','脂質','炭水化物'],FD.map(function(f,i){return [f].concat(g[i].map(f1));}))+'【表2】1gあたりのエネルギー'+TB(['','たんぱく質','脂質','炭水化物'],[['エネルギー'].concat(NK.map(function(k){return k+'kcal';}))]);
 var m=argmax(pt),E=function(x){return x[0]*4+x[1]*9+x[2]*4;},b=rk(E(g[1]),0),W=pk([150,200,250,300]),c=rk(g[2][1]*9*W/100,0),d=rk(g[0][2]*4/E(g[0])*100,0);
 return {stem:stem,qs:[
  {q:'100gあたりに含まれるたんぱく質が最も多い食品はどれか。',ans:FD[m],str:1,wr:nm(FD[m],FD),x:FD[pt.indexOf(Math.max.apply(null,pt))],calc:FD.map(function(f,i){return f+' '+f1(pt[i])+'g';}).join('、')+'<br>最も多いのは '+FD[m]},
  {q:'食品Q 100gのエネルギーは何kcalか'+PR[0]+'。',ans:b,wr:[rk(sum(g[1])*4,0),rk(sum(g[1])*17/3,0),rk(g[1][0]*4+g[1][1]*4+g[1][2]*9,0),b+20],u:'kcal',x:rk(g[1][0]*NK[0]+g[1][1]*NK[1]+g[1][2]*NK[2],0),calc:g[1].map(function(x,j){return f1(x)+' × '+NK[j];}).join(' ＋ ')+' ≒ '+b+'kcal'},
  {q:'食品R '+W+'gに含まれる脂質から得られるエネルギーは何kcalか'+PR[0]+'。',ans:c,wr:[rk(g[2][1]*9,0),rk(g[2][1]*W/100*4,0),rk(E(g[2])*W/100,0),c+30],u:'kcal',x:rk(W/100*g[2][1]*9,0),calc:'脂質 '+f1(g[2][1])+' × '+nb(W/100)+' ＝ '+nb(g[2][1]*W/100)+'g<br>× 9 ≒ '+c+'kcal'},
  {q:'食品Pのエネルギーのうち、炭水化物から得られるエネルギーの割合は何%か'+PR[0]+'。',ans:d,wr:[rk(g[0][2]/sum(g[0])*100,0),rk(g[0][2]*4/100,0),rk(100-d,0),d+5],u:'%',x:rk(100-(g[0][0]*4+g[0][1]*9)/E(g[0])*100,0),calc:'エネルギー '+g[0].map(function(x,j){return f1(x)+' × '+NK[j];}).join(' ＋ ')+' ＝ '+nb(E(g[0]))+'<br>炭水化物 '+nb(g[0][2]*4)+' ÷ '+nb(E(g[0]))+' ≒ '+d+'%'}]};});

/* ===== 12 県別の収穫量の推移と作付面積 ===== */
var KK=['W県','X県','Y県','Z県'];
theme('crop',4,function(){var t=KK.map(function(){var a=ri(30,90)*100;return [a,a+ri(-8,10)*100,a+ri(-5,15)*100];}),ar=KK.map(function(){return ri(12,40)*10;});if(t[2][2]<=t[2][0])return null;
 var per=t.map(function(x,i){return x[2]/ar[i];});if(!uniqMax(per))return null;
 var stem='表1は、ある農作物のW、X、Y、Zの4県における収穫量の推移を、表2は各県の2023年の作付面積を示したものである。'+
  '<br>【表1】収穫量（t）'+TB(['','2021年','2022年','2023年'],KK.map(function(k,i){return [k].concat(t[i]);}))+'【表2】2023年の作付面積（ha）'+TB(['','W県','X県','Y県','Z県'],[['作付面積'].concat(ar)]);
 var a=rk((t[2][2]-t[2][0])/t[2][0]*100,1),m=argmax(per),c=rk(per[1],1),up=pk([5,10,20]),d=rk(t[3][2]*(100+up)/100/ar[3],1);
 return {stem:stem,qs:[
  {q:'Y県の2023年の収穫量は、2021年に比べて何%増加したか'+PR[1]+'。',ans:a,d:1,wr:[rk((t[2][2]-t[2][0])/t[2][2]*100,1),rk(t[2][2]/t[2][0]*100,1),rk(a+2,1),rk((t[2][2]-t[2][1])/t[2][1]*100,1)],u:'%',x:rk(t[2][2]/t[2][0]*100-100,1),calc:'('+t[2][2]+' − '+t[2][0]+') ÷ '+t[2][0]+' ≒ '+a+'%'},
  {q:'2023年の作付面積1haあたりの収穫量が最も多い県はどれか。',ans:KK[m],str:1,wr:nm(KK[m],KK),x:KK[per.indexOf(Math.max.apply(null,per))],calc:KK.map(function(k,i){return k+' '+t[i][2]+' ÷ '+ar[i]+' ≒ '+Math.round(per[i]*100)/100;}).join('<br>')+'<br>最も多いのは '+KK[m]},
  {q:'2023年のX県の作付面積1haあたりの収穫量は何tか'+PR[1]+'。',ans:c,d:1,wr:[rk(t[1][0]/ar[1],1),rk(ar[1]/t[1][2]*100,1),rk(sum(t[1])/3/ar[1],1),rk(c+2,1)],u:'t',x:rk(1/(ar[1]/t[1][2]),1),calc:t[1][2]+' ÷ '+ar[1]+' ≒ '+c+'t'},
  {q:'2024年のZ県の収穫量が2023年の'+(100+up)+'%になり、作付面積は2023年と変わらなかったとすると、2024年のZ県の作付面積1haあたりの収穫量は何tか'+PR[1]+'。',ans:d,d:1,wr:[rk(t[3][2]/ar[3],1),rk(t[3][2]*(100-up)/100/ar[3],1),rk(t[3][2]*up/100/ar[3],1),rk(d+1,1)],u:'t',x:rk(t[3][2]/ar[3]*(1+up/100),1),calc:t[3][2]+' × '+nb(1+up/100)+' ＝ '+nb(t[3][2]*(100+up)/100)+'<br>÷ '+ar[3]+' ≒ '+d+'t'}]};});

/* ===== 13 部署別の社員数と資格の保有率 ===== */
var DP=['営業部','開発部','総務部','製造部'];
theme('dept',4,function(){var m=DP.map(function(){return ri(2,12)*10;}),w=DP.map(function(){return ri(1,10)*10;}),rt=DP.map(function(){return ri(2,14)*5;});
 var stem='表1は、ある会社の4つの部署における男女別の社員数を、表2は部署ごとの社員に占める資格保有者の割合を示したものである。'+
  '<br>【表1】社員数（人）'+TB(['','男性','女性','計'],DP.map(function(d,i){return [d,m[i],w[i],m[i]+w[i]];}))+'【表2】資格保有者の割合'+TB(['','営業部','開発部','総務部','製造部'],[['割合'].concat(rt.map(function(x){return x+'%';}))]);
 var a=rk(w[0]/(m[0]+w[0])*100,1),hold=DP.map(function(d,i){return (m[i]+w[i])*rt[i]/100;});if(hold.some(function(h){return !isInt(h);})||!uniqMax(hold))return null;var hm=argmax(hold),c=sum(hold),k=pk([10,20]),d=rk((w[1]+k)/(m[1]+w[1]+2*k)*100,1);
 return {stem:stem,qs:[
  {q:'営業部の社員のうち、女性の割合は何%か'+PR[1]+'。',ans:a,d:1,wr:[rk(w[0]/m[0]*100,1),rk(m[0]/(m[0]+w[0])*100,1),rk(w[0]/sum(w)*100,1),rk(a+2,1)],u:'%',x:rk(100-m[0]/(m[0]+w[0])*100,1),calc:w[0]+' ÷ '+(m[0]+w[0])+' ≒ '+a+'%'},
  {q:'資格を持っている社員が最も多い部署はどれか。',ans:DP[hm],str:1,wr:nm(DP[hm],DP),x:DP[hold.indexOf(Math.max.apply(null,hold))],calc:DP.map(function(d,i){return d+' '+(m[i]+w[i])+' × '+nb(rt[i]/100)+' ＝ '+hold[i];}).join('<br>')+'<br>最も多いのは '+DP[hm]},
  {q:'4つの部署全体で、資格を持っている社員は何人か。',ans:c,wr:[r(sum(m.concat(w))*sum(rt)/400),c+10,c-10>0?c-10:c+20,r(c*1.2)],u:'人',x:hold[0]+hold[1]+hold[2]+hold[3],calc:hold.join(' ＋ ')+' ＝ '+c},
  {q:'来年、開発部の社員を男女とも'+k+'人ずつ増やすと、開発部の社員のうち女性の割合は何%になるか'+PR[1]+'。',ans:d,d:1,wr:[rk(w[1]/(m[1]+w[1])*100,1),rk((w[1]+k)/(m[1]+w[1]+k)*100,1),rk((w[1]+k)/(m[1]+k)*100,1),rk(d+3,1)],u:'%',x:rk(100-(m[1]+k)/(m[1]+w[1]+2*k)*100,1),calc:'女性 '+w[1]+' ＋ '+k+' ＝ '+(w[1]+k)+'、計 '+(m[1]+w[1])+' ＋ '+2*k+' ＝ '+(m[1]+w[1]+2*k)+'<br>'+(w[1]+k)+' ÷ '+(m[1]+w[1]+2*k)+' ≒ '+d+'%'}]};});

/* ===== 14 ホテルの季節別料金と人数別の割引率 ===== */
var HT=['ホテルP','ホテルQ','ホテルR','ホテルS'],SE=['通常期','繁忙期','閑散期'],PP=['2人','3人','4人'];
theme('hotel',4,function(){var p=HT.map(function(){var b=ri(8,16)*1000;return [b,b+ri(2,8)*1000,b-ri(1,4)*1000];}),dc=[pk([5,10]),pk([10,15]),pk([15,20])];var up=p.map(function(x){return (x[1]-x[0])/x[0];});if(!uniqMax(up))return null;
 var stem='表1は、4つのホテルの季節別の1人1泊あたりの料金を、表2は同じ部屋に泊まる人数ごとの割引率を示したものである。割引は1人1泊あたりの料金に適用される。'+
  '<br>【表1】1人1泊あたりの料金（円）'+TB(['','通常期','繁忙期','閑散期'],HT.map(function(h,i){return [h].concat(p[i]);}))+'【表2】人数別の割引率'+TB(['','2人','3人','4人'],[['割引率'].concat(dc.map(function(x){return x+'%';}))]);
 var m=argmax(up),b=p[1][0]*(100-dc[1])/100*3,c=p[2][2]*(100-dc[2])/100*4*2,d=rk(p[0][2]/p[0][0]*100,1);if(!isInt(b)||!isInt(c))return null;
 return {stem:stem,qs:[
  {q:'繁忙期の料金が、通常期の料金に比べて最も高い割合で上がるホテルはどれか。',ans:HT[m],str:1,wr:nm(HT[m],HT),x:HT[up.indexOf(Math.max.apply(null,up))],calc:HT.map(function(h,i){return h+' '+p[i][1]+' ÷ '+p[i][0]+' ≒ '+Math.round(p[i][1]/p[i][0]*1000)/1000;}).join('<br>')+'<br>最も高いのは '+HT[m]},
  {q:'ホテルQに通常期に3人で1泊するとき、3人分の料金の合計はいくらか。',ans:b,wr:[p[1][0]*3,p[1][0]*(100-dc[0])/100*3,p[1][1]*(100-dc[1])/100*3,b+1000],u:'円',x:3*(p[1][0]-p[1][0]*dc[1]/100),calc:p[1][0]+' × '+nb(1-dc[1]/100)+' × 3 ＝ '+b+'円'},
  {q:'ホテルRに閑散期に4人で2泊するとき、4人分の料金の合計はいくらか。',ans:c,wr:[p[2][2]*8,c/2,p[2][0]*(100-dc[2])/100*8,c+2000],u:'円',x:8*(p[2][2]-p[2][2]*dc[2]/100),calc:p[2][2]+' × '+nb(1-dc[2]/100)+' × 4 × 2 ＝ '+c+'円'},
  {q:'ホテルPの閑散期の料金は、通常期の料金の何%か'+PR[1]+'。',ans:d,d:1,wr:[rk(p[0][0]/p[0][2]*100,1),rk((p[0][0]-p[0][2])/p[0][0]*100,1),rk(p[0][2]/p[0][1]*100,1),rk(d+2,1)],u:'%',x:rk(100-(p[0][0]-p[0][2])/p[0][0]*100,1),calc:p[0][2]+' ÷ '+p[0][0]+' ≒ '+d+'%'}]};});

/* ===== 15 図書館の分野別貸出冊数と蔵書数 ===== */
var LB=['図書館P','図書館Q','図書館R','図書館S'],BK=['小説','実用書','児童書'];
theme('lib',4,function(){var n=LB.map(function(){return [ri(80,300)*10,ri(50,200)*10,ri(40,250)*10];}),st=LB.map(function(){return ri(20,60)*1000;}),tt=n.map(sum);if(!uniqMax(tt))return null;
 var stem='表1は、ある市の4つの図書館における先月の分野別の貸出冊数を、表2は各図書館の蔵書数を示したものである。'+
  '<br>【表1】貸出冊数（冊）'+TB(['','小説','実用書','児童書'],LB.map(function(l,i){return [l].concat(n[i]);}))+'【表2】蔵書数（冊）'+TB(['','図書館P','図書館Q','図書館R','図書館S'],[['蔵書数'].concat(st)]);
 var m=argmax(tt),b=rk(tt[1]/st[1]*100,1),cs=sum(n.map(function(x){return x[0];})),c=rk(cs/sum(tt)*100,1),z=pk([10,20]),tg=pk([20,25,30]),need=st[2]*(100+z)/100*tg/100-tt[2];if(!isInt(need)||need<=0)return null;
 return {stem:stem,qs:[
  {q:'先月の貸出冊数の合計が最も多い図書館はどれか。',ans:LB[m],str:1,wr:nm(LB[m],LB),x:LB[tt.indexOf(Math.max.apply(null,tt))],calc:LB.map(function(l,i){return l+' '+tt[i];}).join('、')+'<br>最も多いのは '+LB[m]},
  {q:'図書館Qの先月の貸出冊数の合計は、蔵書数の何%か'+PR[1]+'。',ans:b,d:1,wr:[rk(n[1][0]/st[1]*100,1),rk(st[1]/tt[1],1),rk(tt[1]/sum(st)*100,1),rk(b+3,1)],u:'%',x:rk(100/(st[1]/tt[1]),1),calc:tt[1]+' ÷ '+st[1]+' ≒ '+b+'%'},
  {q:'4つの図書館の小説の貸出冊数の合計は、4つの図書館の貸出冊数の合計の何%か'+PR[1]+'。',ans:c,d:1,wr:[rk(n[0][0]/tt[0]*100,1),rk(cs/sum(st)*100,1),rk(100-c,1),rk(c+4,1)],u:'%',x:rk(100-(sum(tt)-cs)/sum(tt)*100,1),calc:'小説 '+cs+' ÷ 全体 '+sum(tt)+' ≒ '+c+'%'},
  {q:'図書館Rの蔵書数を'+z+'%増やし、1か月の貸出冊数の合計を増やした後の蔵書数の'+tg+'%にしたい。貸出冊数の合計を先月より何冊増やせばよいか。',ans:need,wr:[st[2]*tg/100-tt[2]>0?st[2]*tg/100-tt[2]:need+500,st[2]*(100+z)/100*tg/100,r(need*1.2),need+100],u:'冊',x:(st[2]+st[2]*z/100)*(tg/100)-tt[2],
   calc:'増やした後の蔵書数 '+st[2]+' × '+nb(1+z/100)+' ＝ '+nb(st[2]*(100+z)/100)+'<br>目標の貸出 × '+nb(tg/100)+' ＝ '+nb(st[2]*(100+z)/100*tg/100)+'<br>'+nb(st[2]*(100+z)/100*tg/100)+' − '+tt[2]+' ＝ '+need+'冊'}]};});
})();
