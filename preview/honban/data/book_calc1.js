/* 問題集 問127〜164（割合と比・損益算・料金割引・仕事算・分割払い・代金精算）。担当D（2026-11-17）
   小問ごとにテンプレート1個。問題文は問題集の文のまま数値だけ変える。各変数の候補の最初が問題集の数値で、
   そのときは問題集と同じ選択肢（同じ順・同じ数）を出す。bk は問題番号（小問は '136-1'）。
   図の補助（WS・W2・SE3・TN4・TP・SS3・BK）は wariai_4・soneki_3・tanni_4・seisan_3・bunkatsu_4 のものを使う。 */
(function(){
function gc(a,b){return b?gc(b,a%b):a;}
function rd(x){return Math.round(x*1e6)/1e6;}
function isI(x){return Math.abs(x-Math.round(x))<1e-7;}
function ri(x){return Math.round(rd(x));}
function D(x){return String(rd(x));}
function F(n,d){var k=gc(Math.abs(n),Math.abs(d));n/=k;d/=k;return d===1?String(n):n+'/'+d;}
function FR(x){for(var d=1;d<=20000;d++){var n=Math.round(x*d);if(Math.abs(n/d-x)<1e-9)return F(n,d);}return D(x);}
function WR(p){var w=Math.floor(p/10),b=p%10;return (w?w+'割':'')+(b?b+'分':'');}
function HM(h){var t=Math.round(h*60),a=Math.floor(t/60),b=t%60;return (a?a+'時間':'')+(b?b+'分':'');}
function RL(fd,lv){BANK[fd]=BANK[fd]||{};var B=BANK[fd][lv]=BANK[fd][lv]||{};['concept','practice','applied','real'].forEach(function(k){B[k]=B[k]||[];});return B.real;}
/* 数の選択肢：正解 ans ＋ 候補 cand（正の数・重複なし）＋足りなければ ans±step。小さい順 */
function NC(ans,cand,n,fmt,step){var v=[ans],k=1;function add(x){x=rd(x);if(v.length<n&&x>0&&v.map(fmt).indexOf(fmt(x))<0)v.push(x);}
 cand.forEach(add);while(v.length<n&&k<50){add(ans+step*k);add(ans-step*k);k++;}
 v.sort(function(a,b){return a-b;});var c=v.map(fmt);return {c:c,a:c.indexOf(fmt(ans))};}
/* 等間隔の選択肢（ans を含む n 個、step おき、0より大きい） */
function SP(ans,n,step,R,fmt,min){var s=rd(ans-step*R.int(0,n-1));while(s<=(min===undefined?0:min-1e-9))s=rd(s+step);var c=[];for(var i=0;i<n;i++)c.push(fmt(rd(s+step*i)));return {c:c,a:c.indexOf(fmt(ans))};}
function m(x){return '<mark>'+x+'</mark>';}
var NONE5='AからEのいずれでもない',NONE6='AからFのいずれでもない';
/* T(分野,指標,bk,{P:{変数:[問題集の値,候補…]}, ok(v), f(v,R)→{q,c,a,inw,fig,calc}, V(v)→正解の文字列（別の方法で計算）, BC:問題集の選択肢, BA:問題集の正解番号, NONE:'いずれでもない'の文字列}) */
var DEFS={};
function T(fd,lv,bk,d){DEFS[bk]={fd:fd,lv:lv,d:d};RL(fd,lv).push(MK(bk,d,d.P,d.BC,''));}
function MK(bk,d,P,BC,suf){var nm=Object.keys(P);
 return {id:'book-'+bk+suf,bk:bk,verify:function(v,o){var r=d.V(v);if(d.NONE&&o.c.indexOf(r)<0)return d.NONE;return r;},make:function(R){
  for(var t=0;t<3000;t++){var v={};nm.forEach(function(k){v[k]=R.pick(P[k]);});
   if(d.ok&&!d.ok(v))continue;var o=d.f(v,R);if(!o)continue;
   if(BC&&nm.every(function(k){return v[k]===P[k][0];})){o.c=BC.slice();o.a=d.BA;}
   if(!(o.a>=0)||o.c.some(function(x,i){return o.c.indexOf(x)!==i;}))continue;
   o.fig=SF(o.fig);o.v=v;o.bk=bk;o.id='book-'+bk+suf;return o;}
  return null;}};}
/* 単純な数値版（実践①＝applied）。P の一部の変数だけを切りのよい数に差し替える */
function TS(bk,S){var x=DEFS[bk],P={};for(var k in x.d.P)P[k]=S[k]||x.d.P[k];BANK[x.fd][x.lv].applied.push(MK(bk,x.d,P,null,'s'));}
/* いずれでもない形式：pairs（正解を含む表示文字列の配列）に NONE を付ける。8回に1回は正解を外して「いずれでもない」が正解 */
function NOPT(list,ans,none,R,alt){var c=list.slice(),a=c.indexOf(ans);
 if(R.int(0,7)===0&&alt&&c.indexOf(alt)<0){c[a]=alt;c.push(none);return {c:c,a:c.length-1};}
 c.push(none);return {c:c,a:a};}
/* 図の数値を文字列にそろえる（描画は文字列を前提にしている） */
function SF(f){if(!f)return f;if(f.table){f.table.head=f.table.head.map(String);f.table.rows=f.table.rows.map(function(r){return r.map(String);});}
 if(f.rows)f.rows.forEach(function(r){r.forEach(function(p){['n','r','v'].forEach(function(k){if(typeof p[k]==='number')p[k]=String(p[k]);});});});return f;}
function TBL(head,rows){var s='<div class="tbl-wrap"><table class="tbl"><tr>';head.forEach(function(x){s+='<th>'+x+'</th>';});s+='</tr>';
 rows.forEach(function(r){s+='<tr>';r.forEach(function(x,i){s+=(i===0?'<th>':'<td>')+x+(i===0?'</th>':'</td>');});s+='</tr>';});return s+'</table></div>';}
function pc(x){return x+'%';}
function yen(x){return x+'円';}
var ROUND1='（必要なときは、最後に小数第1位を四捨五入すること）';

/* ================= 割合と比 問127〜140 ================= */
T('割合',4,'127',{P:{a:[20,10,15,25,30,40,50],b:[15,5,10,20,25,30]},
 ok:function(v){return (100+v.a)*(100-v.b)-10000>=50;},
 f:function(v,R){var r=((100+v.a)*(100-v.b)-10000)/100,ans=Math.round(r*10)/10,A=D(1+v.a/100),B=D(1-v.b/100),S=D(A*B);
  var ch=SP(ans,4,0.5,R,function(x){return x.toFixed(1)+'%';});
  return {q:'ある遊園地で入場料金を'+v.a+'%アップしたら入場者数が'+v.b+'%減った。このとき入場料金の売上額は何%増加したか（必要なときは、最後に小数第2位を四捨五入すること）。',c:ch.c,a:ch.a,
   inw:'売上額 ＝ 1人あたりの料金 × 入場者数。前と後に分け、前の料金と入場者数をどちらも1とする',
   fig:TN4([TP('前','入場者 1','売上 1','1人',1,.5),TP('後','入場者 '+B,'売上 ?','1人',A,.5,'v')]),
   calc:'後の売上 ＝ ② × ① ＝ '+A+' × '+B+' ＝ '+S+'<br>'+S+' − 1 ＝ '+D(S-1)+' → '+ans.toFixed(1)+'%増加'};},
 V:function(v){var before=100*1000,after=(100+v.a)*(1000*(100-v.b)/100);return (Math.round((after-before)/before*1000)/10).toFixed(1)+'%';},
 BC:['1.0%','1.5%','2.0%','2.5%'],BA:2});

T('割合',4,'128',{P:{k:[1.2,1.25,1.5,1.4,1.6],p:[42,30,36,40,45,48,35]},
 ok:function(v){var d2=v.p/v.k;return 100-v.p-d2>=8&&Math.abs((100-v.p-d2)%1-0.5)>0.01;},
 f:function(v,R){var d2=rd(v.p/v.k),d1=rd(100-v.p-d2),ans=ri(d1),ch=SP(ans,4,2,R,pc);
  return {q:'ある動物園で3連休の客数を調査したところ、連休3日目は2日目の客数の'+v.k+'倍で、3日間合計の'+v.p+'%に相当した。1日目の客数は3日間合計の何%か'+ROUND1+'。',c:ch.c,a:ch.a,
   inw:'3日間合計を1として、1日目・2日目・3日目に分ける（内訳の割合の合計は1）',
   fig:{rows:[[{n:'3日間合計',r:'1',w:1}],[{n:'1日目',r:'?',w:.28,ask:1},{n:'2日目',r:D(d2/100),w:.32},{n:'3日目',r:D(v.p/100),w:.4}]]},
   calc:'2日目 ＝ 3日目 ÷ '+v.k+' ＝ '+D(v.p/100)+' ÷ '+v.k+' ＝ '+D(d2/100)+'<br>1日目 ＝ 1 − '+D(v.p/100)+' − '+D(d2/100)+' ＝ '+D(d1/100)+' → '+ans+'%'};},
 V:function(v){var d3=10*v.p,d2=d3/v.k,d1=1000-d3-d2;return Math.round(d1/10)+'%';},
 BC:['21%','23%','25%','27%'],BA:1});

T('割合',4,'129',{P:{M:[50,40,45,55,60],W:[35,25,30,40,45],n:[20,15,25,30],p:[40,30,35,45,50]},
 ok:function(v){var t=v.M+v.W+v.n,fw=t*v.p/100;return isI(fw)&&fw-v.W>0&&fw-v.W<v.n;},
 f:function(v,R){var t=v.M+v.W+v.n,fw=t*v.p/100,nw=fw-v.W,ans=ri(nw/v.n*100),ch=SP(ans,4,5,R,pc);
  return {q:'サークルXには男性'+v.M+'人、女性'+v.W+'人がいた。新たに'+v.n+'人が入り、女性の割合がX全体の'+v.p+'%になった。新たに入った人のうち、女性の割合は何%だったか'+ROUND1+'。',c:ch.c,a:ch.a,
   inw:'図を2つ描く。①入ったあとのX全体を女性・男性に分ける ②新たに入った人を女性・男性に分ける',
   fig:{rows:[[{n:'入ったあとのX',r:'1',v:t+'人',w:1}],[{n:'女性',r:D(v.p/100),v:fw+'人',w:.4},{n:'男性',w:.6}],[{n:'新たに入った人',r:'1',v:v.n+'人',w:1}],[{n:'女性',r:'?',v:nw+'人',w:.4,ask:1},{n:'男性',w:.6}]]},
   calc:'X全体 '+v.M+' ＋ '+v.W+' ＋ '+v.n+' ＝ '+t+'<br>女性 ＝ ① × ② ＝ '+t+' × '+D(v.p/100)+' ＝ '+fw+'<br>新たに入った女性 '+fw+' − '+v.W+' ＝ '+nw+'<br>② ＝ ③ ÷ ① ＝ '+nw+' ÷ '+v.n+' ＝ '+D(nw/v.n)+' → '+ans+'%'};},
 V:function(v){var t=v.M+v.W+v.n;for(var k=0;k<=v.n;k++)if((v.W+k)*100===t*v.p)return Math.round(k/v.n*100)+'%';return '?';},
 BC:['20%','25%','30%','35%'],BA:3});

T('割合',5,'130',{P:{T:[600,400,500,800,1000],a:[5,10,15],b:[25,15,20,30,40],c:[7,3,5,9,10]},
 ok:function(v){var x=(v.c+v.a)*v.T/(v.a+v.b);return v.c<v.b&&isI(x)&&x>0&&x<v.T&&isI((100+v.b)*x/100)&&isI((100-v.a)*(v.T-x)/100)&&isI(v.T*(100+v.c)/100);},
 f:function(v,R){var x=(v.c+v.a)*v.T/(v.a+v.b),ans=(100+v.b)*x/100,A=D(1-v.a/100),B=D(1+v.b/100),T2=v.T*(100+v.c)/100,ch=NC(ans,[x,ans-20,v.T-x],4,function(z){return z+'人';},20);
  return {q:'ある美術館では、先週の土日の合計来場者数が'+v.T+'人だった。今週の土曜日は先週の土曜日の'+v.a+'%減だったが、今週の日曜日は快晴で、先週の日曜日の'+v.b+'%増となり、結局土日の合計では'+v.c+'%増となった。今週の日曜日の来場者は何人だったか。',c:ch.c,a:ch.a,
   inw:'先週と今週の図を描き、それぞれ土曜日・日曜日に分ける。先週の日曜日を x 人と置く',
   fig:{rows:[[{n:'先週',v:v.T+'人',w:1}],[{n:'土',v:v.T+' − x',w:.6},{n:'日',v:'x',w:.4}],[{n:'今週',r:D(1+v.c/100),v:T2+'人',w:1}],[{n:'土',v:A+'('+v.T+' − x)',w:.55},{n:'日',v:B+'x',w:.45,ask:1}]]},
   calc:'今週の合計 '+v.T+' × '+D(1+v.c/100)+' ＝ '+T2+'<br>'+A+'('+v.T+' − x) ＋ '+B+'x ＝ '+T2+'<br>'+D(B-A)+'x ＝ '+D(T2-A*v.T)+' → x ＝ '+x+'<br>今週の日曜日 '+x+' × '+B+' ＝ '+ans};},
 V:function(v){for(var x=0;x<=v.T;x++)if((100-v.a)*(v.T-x)+(100+v.b)*x===(100+v.c)*v.T)return (100+v.b)*x/100+'人';return '?';},
 BC:['80人','240人','280人','300人'],BA:3});

T('割合',4,'131',{P:{N:[270,180,360,450,240,300,540],f:['4/15','1/5','1/3','2/9','1/6','2/5'],s:['2/9','1/4','1/3','2/7','1/6'],k:[3,2,4,5]},
 ok:function(v){var f=v.f.split('/').map(Number),s=v.s.split('/').map(Number),fr=v.N*f[0]/f[1],r1=v.N-fr,sa=r1*s[0]/s[1],r2=r1-sa,r=v.N*v.k/10;return isI(fr)&&isI(sa)&&isI(r)&&r2-r>=10;},
 f:function(v,R){var f=v.f.split('/').map(Number),s=v.s.split('/').map(Number),fr=v.N*f[0]/f[1],r1=v.N-fr,sa=r1*s[0]/s[1],r2=r1-sa,r=v.N*v.k/10,sun=r2-r;
  var satF=F((f[1]-f[0])*s[0],f[1]*s[1]),remF=F((f[1]-f[0])*(s[1]-s[0]),f[1]*s[1]);
  var ch=NC(v.k,[v.k+1,v.k-1.5,v.k+0.6],4,function(z){return D(z)+'割';},0.5);
  return {q:'週末に読書をした。金曜日に全体の'+v.f+'を読んだ。土曜日は、残ったうちの'+v.s+'を読んだ。日曜日には、'+sun+'ページ読んで'+r+'ページ残った。残りのページは、全体の何割か。',c:ch.c,a:ch.a,
   inw:'全体を1として、金曜日・土曜日・それ以外（日曜日＋残り）に分ける',
   fig:{rows:[[{n:'全体',r:'1',v:'?',w:1}],[{n:'金',r:v.f,w:.27},{n:'土',r:satF,w:.18},{n:'日曜日＋残り',r:remF,v:(sun+r)+'ページ',w:.55}]]},
   calc:'土曜日 (1 − '+v.f+') × '+v.s+' ＝ '+satF+'<br>日曜日＋残り 1 − '+v.f+' − '+satF+' ＝ '+remF+'<br>全体 ＝ ③ ÷ ② ＝ ('+sun+' ＋ '+r+') ÷ '+remF+' ＝ '+v.N+'<br>'+r+' ÷ '+v.N+' ＝ '+D(r/v.N)+' → '+v.k+'割'};},
 V:function(v){var f=v.f.split('/').map(Number),s=v.s.split('/').map(Number),r=v.N*v.k/10,fr=v.N*f[0]/f[1],sr=(v.N-fr)-(v.N-fr)*s[0]/s[1];
  for(var n=1;n<=5000;n++)if(n*(f[1]-f[0])*(s[1]-s[0])===sr*f[1]*s[1])return D(r/n*10)+'割';return '?';},
 BC:['1.5割','3割','3.6割','4割'],BA:1});

T('割合',5,'132',{P:{k:[5,2,3,4,6,7,8,9,10,12],p2:[42,30,32,34,35,36,38,40,44,45,46,48,50],dd:[2,1,3,4,5],mm:[2,3],p1:[48,40,44,45,50,52,54,55,56,60]},
 ok:function(v){var p3=v.p2-v.dd,x=v.k*(100-p3)/v.dd,P=x/(1+v.mm),mR=v.p2*x/100,mP=v.p1*P/100;return v.p1>v.p2&&isI(x)&&isI(P)&&isI(mR)&&isI(mP)&&mR-mP>0&&mR-mP<v.mm*P&&P<=300&&P>=20;},
 f:function(v,R){var p3=v.p2-v.dd,x=v.k*(100-p3)/v.dd,ans=x/(1+v.mm),ch=NC(ans,[ans-10,ans-1,x/v.mm],4,function(z){return z+'人';},5);
  return {q:'劇団Pは'+(v.mm===2?'Pの倍':'Pの'+v.mm+'倍')+'の人数の劇団Qと合併して劇団Rとなった。劇団Pのときには'+v.p1+'%だった男性の割合は、劇団Rになって'+v.p2+'%に減った。さらに、'+v.k+'人の男性が劇団をやめたため、男性の割合が'+p3+'%に減った。合併前の劇団Pの人数は何人だったか。',c:ch.c,a:ch.a,
   inw:'劇団Rの人数を x 人と置き、やめる前とやめた後の図を描く（Pの'+v.p1+'%は使わない）。R ＝ P ＋ Q で、P：Q ＝ 1：'+v.mm,
   fig:{rows:[[{n:'劇団R',r:'1',v:'x',w:1}],[{n:'男性',r:D(v.p2/100),v:D(v.p2/100)+'x',w:.42},{n:'女性',w:.58}],[{n:'やめた後',r:'1',v:'x − '+v.k,w:.96},{w:.04}],[{n:'男性',r:D(p3/100),v:D(v.p2/100)+'x − '+v.k,w:.4},{n:'女性',w:.56},{w:.04}]]},
   calc:D(v.p2/100)+'x − '+v.k+' ＝ '+D(p3/100)+'(x − '+v.k+')<br>'+D(v.dd/100)+'x ＝ '+D(v.k*(100-p3)/100)+' → x ＝ '+x+'<br>P ＝ '+x+' ÷ '+(1+v.mm)+' ＝ '+ans};},
 V:function(v){var p3=v.p2-v.dd;for(var x=1;x<=20000;x++)if(v.p2*x-100*v.k===p3*(x-v.k))return x/(1+v.mm)+'人';return '?';},
 BC:['40人','49人','50人','83人'],BA:2});

T('割合',4,'133',{P:{n1:[850,600,700,750,800,900],n2:[650,400,500,550,600,700],p:[27,20,22,24,25,30,32],q:[40,30,32,35,36,45]},
 ok:function(v){var t=v.n1+v.n2,all=t*v.p/100,e=v.n1*v.q/100,w=all-e;return v.q>v.p&&isI(all)&&isI(e)&&w>0&&w/v.n2*100>=2&&Math.abs((w/v.n2*100)%1-0.5)>0.01;},
 f:function(v,R){var t=v.n1+v.n2,all=t*v.p/100,e=v.n1*v.q/100,w=all-e,ans=ri(w/v.n2*100),ch=NC(ans,[ans+12,ans+42,ri(all/v.n2*100),2*v.p-v.q],4,pc,5);
  return {q:'ある製品に関するアンケート調査を行ったところ、東日本で'+v.n1+'人、西日本で'+v.n2+'人から回答を得た。回答者のうち、この製品の購入者の割合は、全体で'+v.p+'%、東日本では'+v.q+'%だったが、西日本では何%だったか'+ROUND1+'。',c:ch.c,a:ch.a,
   inw:'全体・東日本・西日本の3つの図を描き、それぞれ購入者とそれ以外に分ける',
   fig:{rows:[[{n:'全体',r:'1',v:t+'人',w:1}],[{n:'購入者',r:D(v.p/100),v:all+'人',w:.3},{w:.7}],[{n:'東日本',r:'1',v:v.n1+'人',w:.57},{n:'西日本',r:'1',v:v.n2+'人',w:.43}],[{n:'購入者',r:D(v.q/100),v:e+'人',w:.23},{w:.34},{n:'購入者',r:'?',v:w+'人',w:.12,ask:1},{w:.31}]]},
   calc:'全体の購入者 ＝ ① × ② ＝ '+t+' × '+D(v.p/100)+' ＝ '+all+'<br>東日本の購入者 '+v.n1+' × '+D(v.q/100)+' ＝ '+e+'<br>西日本の購入者 '+all+' − '+e+' ＝ '+w+'<br>② ＝ ③ ÷ ① ＝ '+w+' ÷ '+v.n2+' ＝ '+D(w/v.n2)+' → '+ans+'%'};},
 V:function(v){var t=v.n1+v.n2,e=v.n1*v.q/100;for(var k=0;k<=v.n2;k++)if((e+k)*100===v.p*t)return Math.round(k/v.n2*100)+'%';return '?';},
 BC:['10%','22%','52%','62%'],BA:0});

T('割合',3,'134',{P:{N:[300,200,400,500,250],p:[60,40,50,70,80],a:[25,20,30,40,50]},
 ok:function(v){var s=v.N*v.p/100;return isI(s)&&Math.abs(((s+v.a)/(v.N+v.a)*100)%1-0.5)>0.01;},
 f:function(v,R){var s=v.N*v.p/100,ans=ri((s+v.a)/(v.N+v.a)*100),ch=NC(ans,[ri((s+v.a)/v.N*100),ans+7,ans+11],4,pc,3);
  return {q:'ある会社の従業員数は'+v.N+'人であり、そのうちの'+v.p+'%は正社員である。新規雇用で正社員を今より'+v.a+'人増やした場合、正社員は従業員数の何%になるか'+ROUND1+'。',c:ch.c,a:ch.a,
   inw:'増やした後の従業員を正社員とそれ以外に分ける（従業員数も'+v.a+'人増える）',
   fig:{rows:[[{n:'増やした後',r:'1',v:(v.N+v.a)+'人',w:1}],[{n:'正社員',r:'?',v:(s+v.a)+'人',w:.63,ask:1},{n:'その他',v:(v.N-s)+'人',w:.37}]]},
   calc:'今の正社員 '+v.N+' × '+D(v.p/100)+' ＝ '+s+'<br>増やした後 正社員 '+(s+v.a)+'、従業員 '+(v.N+v.a)+'<br>② ＝ ③ ÷ ① ＝ '+(s+v.a)+' ÷ '+(v.N+v.a)+' ＝ '+D(Math.round((s+v.a)/(v.N+v.a)*1000)/1000)+'… → '+ans+'%'};},
 V:function(v){var o=v.N*(100-v.p)/100;return Math.round(100-o/(v.N+v.a)*100)+'%';},
 BC:['63%','68%','70%','74%'],BA:0});

T('割合',4,'135',{P:{N:[150,100,200,250,300],mr:[2,1,3],wr:[3,2,4,5],a:[30,20,25,40],b:[40,30,35,50,60]},
 ok:function(v){var men=v.N*v.mr/(v.mr+v.wr),wo=v.N-men,mem=men*v.a/100+wo*v.b/100;return v.wr>v.mr&&gc(v.mr,v.wr)===1&&isI(men)&&isI(men*v.a/100)&&isI(wo*v.b/100)&&Math.abs((mem/v.N*100)%1-0.5)>0.01&&v.a!==v.b;},
 f:function(v,R){var men=v.N*v.mr/(v.mr+v.wr),wo=v.N-men,ma=men*v.a/100,wb=wo*v.b/100,mem=ma+wb,ans=ri(mem/v.N*100),ch=SP(ans,4,2,R,pc);
  var fm=F(v.mr,v.mr+v.wr),fw=F(v.wr,v.mr+v.wr);
  return {q:'あるスポーツクラブの利用者数は'+v.N+'人である。利用者の男女比は'+v.mr+'：'+v.wr+'で、女性の方が多い。また利用者のうち、男性の'+v.a+'%、女性の'+v.b+'%が会員になっている。このとき、会員数は利用者数の何%にあたるか'+ROUND1+'。',c:ch.c,a:ch.a,
   inw:'利用者を男性・女性に分け（男女比から割合を出す）、それぞれを会員とそれ以外に分ける',
   fig:{rows:[[{n:'利用者',r:'1',v:v.N+'人',w:1}],[{n:'男性',r:fm,v:men+'人',w:.4},{n:'女性',r:fw,v:wo+'人',w:.6}],[{n:'会員',r:D(v.a/100),v:ma+'人',w:.15},{w:.25},{n:'会員',r:D(v.b/100),v:wb+'人',w:.25},{w:.35}]]},
   calc:'男性 '+v.N+' × '+fm+' ＝ '+men+'、女性 '+wo+'<br>会員 '+men+' × '+D(v.a/100)+' ＋ '+wo+' × '+D(v.b/100)+' ＝ '+ma+' ＋ '+wb+' ＝ '+mem+'<br>② ＝ ③ ÷ ① ＝ '+mem+' ÷ '+v.N+' ＝ '+D(Math.round(mem/v.N*1000)/1000)+' → '+ans+'%'};},
 V:function(v){return Math.round((v.a*v.mr+v.b*v.wr)/(v.mr+v.wr))+'%';},
 BC:['32%','34%','36%','38%'],BA:2});

var Q136='ある会社の今年の従業員数は、昨年より';
T('割合',4,'136-1',{P:{L:[800,600,700,900,1000,1200],p:[35,20,25,30,40]},
 ok:function(v){return isI(v.L*(100-v.p)/100);},
 f:function(v,R){var n=v.L*(100-v.p)/100,ch=NC(v.L,[ri(n*(100+v.p)/100),v.L-50,isI(n*3/4)?n*3/4:0],4,function(z){return z+'人';},50);
  return {q:Q136+v.p+'%減って、'+n+'人になった。昨年の従業員数は何人か。',c:ch.c,a:ch.a,
   inw:'昨年を1として、今年（'+D(1-v.p/100)+'）と減った分（'+D(v.p/100)+'）に分ける',
   fig:{rows:[[{n:'昨年',r:'1',v:'?',w:1,ask:1}],[{n:'今年',r:D(1-v.p/100),v:n+'人',w:.65},{n:'減った分',r:D(v.p/100),w:.35}]]},
   calc:'① ＝ ③ ÷ ② ＝ '+n+' ÷ '+D(1-v.p/100)+' ＝ '+v.L};},
 V:function(v){var n=v.L*(100-v.p)/100;for(var L=1;L<=5000;L++)if(L*(100-v.p)===n*100)return L+'人';return '?';},
 BC:['390人','702人','750人','800人'],BA:3});

T('割合',5,'136-2',{P:{L:[800,600,700,900,1000,1200],p:[35,20,25,30,40],a:[40,30,45,50],b:[30,20,25,10,15]},
 ok:function(v){var n=v.L*(100-v.p)/100,x=(100*n-(100-v.b)*v.L)/(v.b-v.a);return isI(n)&&((v.a>v.p&&v.p>v.b)||(v.a<v.p&&v.p<v.b))&&isI(x)&&x>0&&x<v.L&&isI((100-v.a)*x/100)&&isI((100-v.b)*(v.L-x)/100);},
 f:function(v,R){var n=v.L*(100-v.p)/100,x=(100*n-(100-v.b)*v.L)/(v.b-v.a),ans=(100-v.a)*x/100,A=D(1-v.a/100),B=D(1-v.b/100),ch=NC(ans,[x,ans-10,ans-20],4,function(z){return z+'人';},10);
  return {q:Q136+v.p+'%減って、'+n+'人になった。男女別では、女性が昨年より'+v.a+'%減り、男性が昨年より'+v.b+'%減った。今年の女性従業員は何人か。',c:ch.c,a:ch.a,
   inw:'昨年と今年の図を描き、それぞれ女性・男性に分ける。昨年の女性を x 人と置く',
   fig:{rows:[[{n:'昨年',v:v.L+'人',w:1}],[{n:'女性',v:'x',w:.5},{n:'男性',v:v.L+' − x',w:.5}],[{n:'今年',v:n+'人',w:.65},{w:.35}],[{n:'女性',v:A+'x',w:.3,ask:1},{n:'男性',v:B+'('+v.L+' − x)',w:.35},{w:.35}]]},
   calc:'昨年 '+n+' ÷ '+D(1-v.p/100)+' ＝ '+v.L+'<br>'+A+'x ＋ '+B+'('+v.L+' − x) ＝ '+n+'<br>'+D(A-B)+'x ＝ '+D(n-B*v.L)+' → x ＝ '+x+'<br>今年の女性 '+x+' × '+A+' ＝ '+ans};},
 V:function(v){var n=v.L*(100-v.p)/100;for(var x=0;x<=v.L;x++)if((100-v.a)*x+(100-v.b)*(v.L-x)===100*n)return (100-v.a)*x/100+'人';return '?';},
 BC:['220人','230人','240人','400人'],BA:2});

function Q137(v){return 'ある図書館で1週間の利用状況を調べたところ、図書館を利用した人は'+v.U+'人で、貸出冊数は'+D(v.b*v.k)+'冊だった。また、1冊以上本を借りた人の貸出冊数の平均は'+v.k+'冊だった。';}
var P137={U:[1450,1200,1300,1500,1600,1250],b:[464,400,420,480,500,520,450],k:[1.5,1.2,1.25,2,1.6]};
T('割合',4,'137-1',{P:P137,
 ok:function(v){var r=(v.U-v.b)/v.U*100;return isI(v.b*v.k)&&Math.abs(r%1-0.5)>0.01;},
 f:function(v,R){var B=D(v.b*v.k),ans=ri((v.U-v.b)/v.U*100),ch=NC(ans,[100-ans,ans-4,100-ans-5],4,pc,3);
  return {q:Q137(v)+'この1週間に図書館を利用した人のうち、1冊も本を借りなかった人は何%だったか'+ROUND1+'。',c:ch.c,a:ch.a,
   inw:'利用した人を「借りた人」と「借りなかった人」に分ける。借りた人は1人あたり'+v.k+'冊（単位あたりの大きさ）',
   fig:{rows:[[{n:'利用した人',r:'1',v:v.U+'人',w:1}],[{n:'借りた人',r:B+'冊',v:v.b+'人',w:.35},{n:'借りなかった人',r:'?',w:.65,ask:1}],[{r:'1人',v:v.k+'冊',w:.2},{w:.8}]]},
   calc:'借りた人 '+B+' ÷ '+v.k+' ＝ '+v.b+'<br>借りなかった人 '+v.U+' − '+v.b+' ＝ '+(v.U-v.b)+'<br>'+(v.U-v.b)+' ÷ '+v.U+' ＝ '+D(Math.round((v.U-v.b)/v.U*1000)/1000)+' → '+ans+'%'};},
 V:function(v){var B=v.b*v.k;for(var n=1;n<=v.U;n++)if(Math.abs(n*v.k-B)<1e-7)return Math.round((1-n/v.U)*100)+'%';return '?';},
 BC:['27%','32%','64%','68%'],BA:3});

T('割合',5,'137-2',{P:{U:P137.U,b:P137.b,k:P137.k,c:[25,10,20,30,40],b2:[600,450,500,550,650]},
 ok:function(v){var B=v.b*v.k,nB=B*(100+v.c)/100,ch=(nB/v.b2-v.k)/v.k*100;return isI(B)&&isI(nB)&&Math.abs(ch)>=1&&Math.abs(Math.abs(ch)%1-0.5)>0.01;},
 f:function(v,R){var B=v.b*v.k,nB=B*(100+v.c)/100,av=nB/v.b2,chg=(av-v.k)/v.k*100,d=ri(Math.abs(chg)),e=d>2&&R.int(0,1)?d-2:d+2,lo=Math.min(d,e),hi=Math.max(d,e);
  var ans=d+'%'+(chg>0?'増加':'減少'),c=[lo+'%増加',hi+'%増加',lo+'%減少',hi+'%減少'];
  return {q:Q137(v)+'次の週についても利用状況を調べたところ、1週間の貸出冊数は'+v.c+'%増加していた。また、1冊以上本を借りた人は'+v.b2+'人だった。このとき、1冊以上借りた人の貸出冊数の平均は、前の週に比べて何%増加または減少したか'+ROUND1+'。',c:c,a:c.indexOf(ans),
   inw:'次の週の「借りた人1人あたりの冊数」を出して、前の週の'+v.k+'冊と比べる',
   fig:TN4([TP('前の週',v.b+'人',D(B)+'冊','1人',v.k+'冊',.5),TP('次の週',v.b2+'人',D(nB)+'冊','1人','?',.5,'u')]),
   calc:'次の週の冊数 '+D(B)+' × '+D(1+v.c/100)+' ＝ '+D(nB)+'<br>② ＝ ③ ÷ ① ＝ '+D(nB)+' ÷ '+v.b2+' ＝ '+D(Math.round(av*1000)/1000)+'<br>('+D(Math.round(av*1000)/1000)+' − '+v.k+') ÷ '+v.k+' ＝ '+D(Math.round((av-v.k)/v.k*1000)/1000)+'… → '+ans};},
 V:function(v){var nB=v.b*v.k*(100+v.c),base=v.k*v.b2*100,diff=nB-base;return Math.round(Math.abs(diff)/base*100)+'%'+(diff>0?'増加':'減少');},
 BC:['3%増加','5%増加','3%減少','5%減少'],BA:2});

function Q138(v){return '赤ワインPと白ワインQを'+v.a+'：'+v.b+'で混ぜたロゼワインXと、赤ワインPと白ワインRを'+v.c+'：'+v.d+'で混ぜたロゼワインYがある。ロゼワインXとロゼワインYを'+v.m+'：'+v.n+'で混ぜて、ロゼワインZを作った。';}
T('割合',5,'138-1',{P:{a:[2,1,3],b:[3,4,2],c:[3,1,2],d:[7,4,3,9],m:[2,1,3],n:[1,2]},
 ok:function(v){var num=v.m*v.a*(v.c+v.d)+v.n*v.c*(v.a+v.b),den=(v.m+v.n)*(v.a+v.b)*(v.c+v.d),r=num/den*100;return gc(v.a,v.b)===1&&gc(v.c,v.d)===1&&gc(v.m,v.n)===1&&v.a*(v.c+v.d)!==v.c*(v.a+v.b)&&Math.abs(r%1-0.5)>0.01;},
 f:function(v,R){var num=v.m*v.a*(v.c+v.d)+v.n*v.c*(v.a+v.b),den=(v.m+v.n)*(v.a+v.b)*(v.c+v.d),ans=ri(num/den*100),ch=NC(ans,[ans-27,ans-10,ans+5],4,pc,5);
  var fx=F(v.m,v.m+v.n),fy=F(v.n,v.m+v.n),px=F(v.a,v.a+v.b),py=F(v.c,v.c+v.d);
  return {q:Q138(v)+'Zに含まれる赤ワインPの割合はどれだけか'+ROUND1+'。',c:ch.c,a:ch.a,
   inw:'Zを1として、XとYに分け（'+v.m+'：'+v.n+'）、XとYをそれぞれ赤ワインPとそれ以外に分ける',
   fig:{rows:[[{n:'ロゼワインZ',r:'1',w:1}],[{n:'X',r:fx,w:.6},{n:'Y',r:fy,w:.4}],[{n:'P',r:px,w:.25},{w:.35},{n:'P',r:py,w:.15},{w:.25}]]},
   calc:'ZのP ＝ '+fx+' × '+px+' ＋ '+fy+' × '+py+' ＝ '+F(num,den)+' ＝ '+D(Math.round(num/den*1000)/1000)+'… → '+ans+'%'};},
 V:function(v){var X=v.m*(v.a+v.b)*(v.c+v.d),Y=v.n*(v.a+v.b)*(v.c+v.d),pX=X/(v.a+v.b)*v.a,pY=Y/(v.c+v.d)*v.c;return Math.round((pX+pY)/(X+Y)*100)+'%';},
 BC:['10%','27%','37%','42%'],BA:2});

T('割合',5,'138-2',{P:{n:[7,5,6,8,9],e:[20,10,15,25,30]},
 f:function(v,R){var n=v.n,ans=v.e*n*(n-1),ch=NC(ans,[ans/2,ans-120,ans-80],4,function(z){return z+'cc';},v.e*5);
  return {q:'赤ワインPと白ワインQを2：3で混ぜたロゼワインXと、赤ワインPと白ワインRを3：7で混ぜたロゼワインYがある。ロゼワインXとロゼワインYを2：1で混ぜて、ロゼワインZを作った。ロゼワインZの試飲を'+n+'人で行うので用意したワインを'+n+'等分したが、直前で1人が欠席になったため、ワインを'+(n-1)+'等分した。'+(n-1)+'等分した量は'+n+'等分した量より1杯あたり'+v.e+'cc多くなった。用意したワインの量はどれだけか。',c:ch.c,a:ch.a,
   inw:'用意したワインを1とすると、1杯は'+(n-1)+'等分なら 1/'+(n-1)+'、'+n+'等分なら 1/'+n+'。その差が'+v.e+'cc',
   fig:{rows:[[{n:'用意したワイン',r:'1',v:'?',w:1,ask:1}],[{n:(n-1)+'等分の1杯',r:'1/'+(n-1),w:.4},{w:.6}],[{n:n+'等分の1杯',r:'1/'+n,w:.32},{n:'差',r:'1/'+(n*(n-1)),v:v.e+'cc',w:.08},{w:.6}]]},
   calc:'差の割合 1/'+(n-1)+' − 1/'+n+' ＝ 1/'+(n*(n-1))+'<br>① ＝ ③ ÷ ② ＝ '+v.e+' ÷ 1/'+(n*(n-1))+' ＝ '+ans};},
 V:function(v){for(var T=1;T<=100000;T++)if(T*v.n-T*(v.n-1)===v.e*v.n*(v.n-1))return T+'cc';return '?';},
 BC:['420cc','720cc','760cc','840cc'],BA:3});

function Q139(s,r){return 'ある英文中に含まれる単語の数とアルファベットの数を調べたところ、アルファベットのsが'+s+'字、rが'+r+'字含まれていた。';}
T('割合',4,'139-1',{P:{W:[110,80,90,100,120,150],p:[20,10,15,25,30,40],r:[150,120,135,160]},
 ok:function(v){return isI(v.W*(100+v.p)/100);},
 f:function(v,R){var S=v.W*(100+v.p)/100,u=D(1+v.p/100),ch=NC(v.W,[v.W-4,v.W+12,v.W+15],4,String,3);
  return {q:Q139(S,v.r)+'sを含む単語のうち、'+v.p+'%にはsが2字含まれており、残りの単語にはsが1字しか含まれていなかった。sを含む単語の数はいくつあるか。',c:ch.c,a:ch.a,
   inw:'sを含む単語を「sが2字」「sが1字」に分け、1語あたりのsの数（単位あたりの大きさ）を出す',
   fig:TN4([TP('2字の単語',D(v.p/100),'','1語','2字',.4),TP('1字の単語',D(1-v.p/100),'','1語','1字',.6)],{r:'?',v:S+'字',ask:1,u:'1語',uv:u+'字'}),
   calc:'1語あたりのs ＝ '+D(v.p/100)+' × 2 ＋ '+D(1-v.p/100)+' × 1 ＝ '+u+'<br>① ＝ ③ ÷ ② ＝ '+S+' ÷ '+u+' ＝ '+v.W};},
 V:function(v){var S=v.W*(100+v.p)/100;for(var w=1;w<=1000;w++)if(w*(100+v.p)===S*100)return String(w);return '?';},
 BC:['106','110','122','125'],BA:1});

T('割合',4,'139-2',{P:{W:[120,100,140,160,80],a:[5,10],b:[15,10,20,25],s:[132,110,121,144]},
 ok:function(v){return isI(v.W*(100+2*v.a+v.b)/100)&&isI(v.W*v.a/100)&&isI(v.W*v.b/100);},
 f:function(v,R){var Rc=v.W*(100+2*v.a+v.b)/100,u=D(1+(2*v.a+v.b)/100),c1=D(1-(v.a+v.b)/100),ch=NC(v.W,[v.W-10,v.W-8,v.W+18],4,String,3);
  return {q:Q139(v.s,Rc)+'rを含む単語のうち'+v.a+'%にはrが3字、'+v.b+'%にはrが2字含まれており、残りの単語にはrが1字しか含まれていなかった。rを含む単語の数はいくつあるか。',c:ch.c,a:ch.a,
   inw:'rを含む単語を「3字」「2字」「1字」に分け、1語あたりのrの数（単位あたりの大きさ）を出す',
   fig:TN4([TP('3字',D(v.a/100),'','1語','3字',.3),TP('2字',D(v.b/100),'','1語','2字',.3),TP('1字',c1,'','1語','1字',.4)],{r:'?',v:Rc+'字',ask:1,u:'1語',uv:u+'字'}),
   calc:'1語あたりのr ＝ '+D(v.a/100)+' × 3 ＋ '+D(v.b/100)+' × 2 ＋ '+c1+' × 1 ＝ '+u+'<br>① ＝ ③ ÷ ② ＝ '+Rc+' ÷ '+u+' ＝ '+v.W};},
 V:function(v){var Rc=v.W*(100+2*v.a+v.b)/100;for(var w=1;w<=1000;w++)if(w*(100+2*v.a+v.b)===Rc*100)return String(w);return '?';},
 BC:['110','112','120','138'],BA:2});

/* 問140：4×4の表。s=0 が問題集の表。g[後期][前期]（0卓球 1テニス 2サッカー 3野球） */
function G140(s){if(s===0)return [[8,17,12,11],[15,12,14,15],[12,16,12,10],[15,12,10,9]];
 var x=s*7919+13,sm=s>=1000;function r(a,b){x=(x*48271)%2147483647;return a+x%(b-a+1);}
 for(var t=0;t<2000;t++){var g=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];for(var i=0;i<4;i++)for(var j=0;j<4;j++)g[i][j]=sm?5*r(1,4):r(5,20);
  var S=g[0][0]+g[1][0]+g[2][0];if(S%7)continue;g[3][0]=3*S/7;var sum=0;for(i=0;i<4;i++)for(j=0;j<4;j++)if(!(i===3&&j===1))sum+=g[i][j];
  g[3][1]=200-sum;if(g[3][1]>=5&&g[3][1]<=(sm?60:25))return g;}
 return null;}
function C140(g){var rt=g.map(function(r){return r[0]+r[1]+r[2]+r[3];}),ct=[0,1,2,3].map(function(j){return g[0][j]+g[1][j]+g[2][j]+g[3][j];});return {rt:rt,ct:ct};}
var N140=['卓球','テニス','サッカー','野球'];
function Q140(g){var t=C140(g),e='（　）';
 return 'ある大学ではスポーツ実習として、前期と後期に、卓球、テニス、サッカー、野球の中から1種目ずつを自由に選択する。下表は、ある学科の学生200人の選択状況を示したものの一部である。例えば、前期に野球を選択、後期に卓球を選択した者は'+g[0][3]+'人いることがわかる。'+
  TBL(['後期＼前期'].concat(N140,['合計']),[['卓球',g[0][0],g[0][1],g[0][2],g[0][3],t.rt[0]],['テニス',g[1][0],g[1][1],g[1][2],e,t.rt[1]],['サッカー',g[2][0],g[2][1],g[2][2],e,t.rt[2]],['野球',e,e,g[3][2],e,e],['合計',e,e,t.ct[2],t.ct[3],200]]);}
var S140=[];for(var i140=0;i140<120;i140++)S140.push(i140);
T('割合',5,'140-1',{P:{s:S140},ok:function(v){var g=G140(v.s);if(!g)return false;var t=C140(g),u=(t.ct[2]+t.rt[2]-g[2][2])/2;return Math.abs(u%1-0.5)>0.01;},
 f:function(v,R){var g=G140(v.s),t=C140(g),u=t.ct[2]+t.rt[2]-g[2][2],ans=ri(u/2),ch=NC(ans,[ri(g[2][2]/2),ri(t.ct[2]/2),ans-5],4,pc,4);
  return {q:Q140(g)+'前期か後期に少なくとも1度はサッカーを選択した学生は、全体の何%か'+ROUND1+'。',c:ch.c,a:ch.a,inwh:'整理',
   inw:'4×4の表を「サッカーを選んだか（○×）」の2×2のカルノー表に縮める',
   fig:{table:{head:['','前期サッカー○','前期サッカー×','計'],rows:[['後期サッカー○',String(g[2][2]),'',String(t.rt[2])],['後期サッカー×','','',String(200-t.rt[2])],['計',String(t.ct[2]),String(200-t.ct[2]),'200']]}},
   calc:'少なくとも1度 ＝ 前期○ ＋ 後期○ − 両方○<br>'+t.ct[2]+' ＋ '+t.rt[2]+' − '+g[2][2]+' ＝ '+u+'<br>'+u+' ÷ 200 ＝ '+D(u/200)+' → '+ans+'%'};},
 V:function(v){var g=G140(v.s),n=0;for(var i=0;i<4;i++)for(var j=0;j<4;j++)if(i===2||j===2)n+=g[i][j];return Math.round(n/2)+'%';},
 BC:['6%','24%','38%','43%'],BA:3});
T('割合',5,'140-2',{P:{s:S140},ok:function(v){return !!G140(v.s);},
 f:function(v,R){var g=G140(v.s),S=g[0][0]+g[1][0]+g[2][0],x=10*S/7,ans=g[3][0],ch=NC(ans,[ans-5,ans+2,ans+5],4,function(z){return z+'人';},3);
  return {q:Q140(g)+'前期に卓球を選んだ学生のうちの30%が後期に野球を選択した。その人数は何人か。',c:ch.c,a:ch.a,
   inw:'前期卓球の列だけを見る。前期卓球の合計を x 人と置くと、後期野球は 0.3x 人',
   fig:{table:{head:['前期卓球','後期卓球','後期テニス','後期サッカー','後期野球','合計'],rows:[['人数',String(g[0][0]),String(g[1][0]),String(g[2][0]),'!0.3x','x']]}},
   calc:g[0][0]+' ＋ '+g[1][0]+' ＋ '+g[2][0]+' ＋ 0.3x ＝ x<br>0.7x ＝ '+S+' → x ＝ '+x+'<br>0.3 × '+x+' ＝ '+ans};},
 V:function(v){var g=G140(v.s),k=g[0][0]+g[1][0]+g[2][0];for(var x=1;x<=200;x++)if(10*k+3*x===10*x)return (3*x/10)+'人';return '?';},
 BC:['10人','15人','17人','20人'],BA:1});
T('割合',5,'140-3',{P:{s:S140},ok:function(v){return !!G140(v.s);},
 f:function(v,R){var g=G140(v.s),t=C140(g),k=g[2][2]+g[2][3]+g[3][2]+g[3][3],ans=(200-k)/2,f1=function(z){return z.toFixed(1)+'%';},ch=NC(ans,[ans-10,ans-4.3,ans+1],4,f1,2.5);
  var t23=t.rt[1]-g[1][0]-g[1][1]-g[1][2],s23=t.rt[2]-g[2][0]-g[2][1]-g[2][2];
  return {q:Q140(g)+'前期に卓球を選んだ学生のうちの30%が後期に野球を選択した。このとき、前後期で少なくとも1度は卓球かテニスを選択した学生は全体の何%か（必要なときは、最後に小数第2位を四捨五入すること）。',c:ch.c,a:ch.a,inwh:'整理',
   inw:'「少なくとも1度は卓球かテニス」の反対は「前期も後期もサッカーか野球」。表の右下の4マスを求めて200から引く',
   fig:{table:{head:['後期＼前期','サッカー','野球'],rows:[['サッカー',String(g[2][2]),String(s23)],['野球',String(g[3][2]),String(g[3][3])]]}},
   calc:'後期サッカー・前期野球 '+t.rt[2]+' − '+g[2][0]+' − '+g[2][1]+' − '+g[2][2]+' ＝ '+s23+'<br>後期テニス・前期野球 '+t.rt[1]+' − '+g[1][0]+' − '+g[1][1]+' − '+g[1][2]+' ＝ '+t23+'<br>後期野球・前期野球 '+t.ct[3]+' − '+g[0][3]+' − '+t23+' − '+s23+' ＝ '+g[3][3]+'<br>サッカーか野球だけ '+g[2][2]+' ＋ '+s23+' ＋ '+g[3][2]+' ＋ '+g[3][3]+' ＝ '+k+'<br>('+'200 − '+k+') ÷ 200 ＝ '+D((200-k)/200)+' → '+ans.toFixed(1)+'%'};},
 V:function(v){var g=G140(v.s),n=0;for(var i=0;i<4;i++)for(var j=0;j<4;j++)if(i<2||j<2)n+=g[i][j];return (n/2).toFixed(1)+'%';},
 BC:['69.5%','75.2%','79.5%','80.5%'],BA:2});

/* ================= 損益算 問141〜149 ================= */
T('損益',5,'141',{P:{c:[500,400,600,800],N:[300,200,400],r1:[3,2,4],d1:[10,20],d2:[20,30],x:[1100,900,1000,1200,1500,1600]},
 ok:function(v){var n1=v.N/v.r1,n2=v.N-n1,rev=v.x*(n1*(100-v.d1)+n2*(100-v.d2))/100;return isI(n1)&&v.d2>v.d1&&isI(rev)&&rev-v.c*v.N>0;},
 f:function(v,R){var n1=v.N/v.r1,n2=v.N-n1,cf=n1*(100-v.d1)/100+n2*(100-v.d2)/100,rev=v.x*cf,cost=v.c*v.N,P=rev-cost,ch=NC(v.x,[v.x+100,v.x-500,v.x-650],4,yen,100);
  return {q:'原価'+v.c+'円の商品が'+v.N+'個ある。'+n1+'個を'+WR(v.d1)+'引、'+n2+'個を'+WR(v.d2)+'引で売ったときに利益を合計'+P+'円にしたい。定価はいくらにすればよいか。',c:ch.c,a:ch.a,
   inw:'全体の販売額を仕入れと利益に分ける。販売額は「定価の'+D(1-v.d1/100)+'倍×'+n1+'個」と「定価の'+D(1-v.d2/100)+'倍×'+n2+'個」の和',
   fig:{rows:[[{n:'販売額',v:rev+'円',w:1}],[{n:'仕入れ',v:cost+'円',w:.55},{n:'利益',v:P+'円',w:.45}]]},
   calc:'仕入れ '+v.c+' × '+v.N+' ＝ '+cost+'<br>販売額 '+cost+' ＋ '+P+' ＝ '+rev+'<br>定価を x とする<br>'+D(1-v.d1/100)+'x × '+n1+' ＋ '+D(1-v.d2/100)+'x × '+n2+' ＝ '+rev+'<br>'+D(cf)+'x ＝ '+rev+' → x ＝ '+v.x};},
 V:function(v){var n1=v.N/v.r1,n2=v.N-n1,P=v.x*(n1*(100-v.d1)+n2*(100-v.d2))/100-v.c*v.N;for(var x=1;x<=20000;x++)if(x*(n1*(100-v.d1)+n2*(100-v.d2))===(P+v.c*v.N)*100)return x+'円';return '?';},
 BC:['450円','600円','1100円','1200円'],BA:2});

T('損益',5,'142',{P:{c:[100,80,120,150,200],n:[400,200,300,500],b:[10,5,20],p:[10,20,15,25]},
 ok:function(v){var req=v.c*v.n*(100+v.p)/100,sell=v.n*(100-v.b)/100;return isI(req)&&isI(sell)&&!isI(req/sell);},
 f:function(v,R){var req=v.c*v.n*(100+v.p)/100,sell=v.n*(100-v.b)/100,q=req/sell,ans=Math.ceil(q-1e-9),fl=Math.floor(q),ch=NC(ans,[fl,ri(v.c*(100+v.p)/100),ri(v.c*(100+v.p)*(100-v.b)/10000)],4,yen,2);
  return {q:'コーヒーカップを1個'+v.c+'円で'+v.n+'個仕入れた。このうちの'+WR(v.b)+'が割れたとしても、全体で'+WR(v.p)+'以上の利益が出るようにしたい。1個の定価をいくら以上に設定すればよいか。',c:ch.c,a:ch.a,
   inw:'必要な販売額（仕入れ＋利益）を、売れる個数で割って1個あたりの定価を出す（単位あたりの大きさ）',
   fig:TN4([TP('売れる個数',sell+'個',req+'円以上','1個','?',1,'u')],{n:'仕入れ＋利益',r:'',v:(v.c*v.n)+' × '+D(1+v.p/100)}),
   calc:'必要な販売額 '+v.c+' × '+v.n+' × '+D(1+v.p/100)+' ＝ '+req+'<br>売れる個数 '+v.n+' × '+D(1-v.b/100)+' ＝ '+sell+'<br>② ＝ ③ ÷ ① ＝ '+req+' ÷ '+sell+' ＝ '+D(Math.floor(q*10)/10)+'…<br>端数を切り上げて '+ans+'円以上'};},
 V:function(v){var req=v.c*v.n*(100+v.p),sell=v.n*(100-v.b);for(var x=1;x<=100000;x++)if(x*sell>=req)return x+'円';return '?';},
 BC:['99円','110円','122円','123円'],BA:3});

T('損益',4,'143',{P:{c:[400,300,500,600,800],N:[150,100,200,120],mk:[25,20,30,40],k:[80,60,50,90,100],d:[10,20]},
 ok:function(v){var L=v.c*(100+v.mk)/100,s=L*(100-v.d)/100;return isI(L)&&isI(s)&&s>v.c&&v.k<v.N;},
 f:function(v,R){var L=v.c*(100+v.mk)/100,s=L*(100-v.d)/100,p1=L-v.c,p2=s-v.c,r=v.N-v.k,ans=v.k*p1+r*p2,ch=NC(ans,[ans-1000,ans-3000,ans-4000],4,yen,500);
  return {q:'1個の原価が'+v.c+'円の品物を'+v.N+'個仕入れ、原価の'+WR(v.mk)+'の利益を見込んで定価をつけたが'+v.k+'個しか売れなかった。そこで、残りは定価の'+WR(v.d)+'引にして売りつくした。利益は全部でいくらか。',c:ch.c,a:ch.a,
   inw:'定価で売った'+v.k+'個と、値引して売った'+r+'個に分け、1個あたりの利益を出す（図は値引して売った1個）',
   fig:SE3(L+'円',s+'円',(L-s)+'円',v.c+'円',p2+'円','p'),
   calc:'定価 '+v.c+' × '+D(1+v.mk/100)+' ＝ '+L+'<br>定価で売った1個の利益 '+L+' − '+v.c+' ＝ '+p1+' → × '+v.k+' ＝ '+(v.k*p1)+'<br>値引後の売値 '+L+' × '+D(1-v.d/100)+' ＝ '+s+'、利益 '+s+' − '+v.c+' ＝ '+p2+' → × '+r+' ＝ '+(r*p2)+'<br>合計 '+(v.k*p1)+' ＋ '+(r*p2)+' ＝ '+ans};},
 V:function(v){var L=v.c*(100+v.mk)/100;return (v.k*L+(v.N-v.k)*L*(100-v.d)/100-v.c*v.N)+'円';},
 BC:['7500円','8500円','10500円','11500円'],BA:3});

T('損益',5,'144',{P:{n:[10,5,20],p:[600,500,400,800,1000],q:[1200,1000,1500,900,600],a:[20,10,25,30],b:[40,30,50,20]},
 ok:function(v){return v.a!==v.b&&v.p!==v.q&&isI(v.p*(100+v.a)/100)&&isI(v.q*(100+v.b)/100);},
 f:function(v,R){var T1=v.n*(v.p+v.q),u=v.p+v.q,lp=v.p*(100+v.a)/100,lq=v.q*(100+v.b)/100,S=v.n*(lp+lq),A=D(1+v.a/100),B=D(1+v.b/100),ch=NC(lp,[v.p,lq,lp+280],4,yen,100);
  return {q:'品物Pと品物Qをそれぞれ'+v.n+'個ずつ仕入れたところ、'+T1+'円かかった。品物Pは原価の'+WR(v.a)+'、品物Qは原価の'+WR(v.b)+'の利益を見込んで販売したところ、完売して売上総額が'+S+'円になった。品物Pの定価はいくらか。',c:ch.c,a:ch.a,
   inw:'PとQを1個ずつの組で考える。Pの原価を p と置くと、Qの原価は '+u+' − p',
   fig:{rows:[[{n:'1組の原価',v:u+'円',w:1}],[{n:'P',v:'p',w:.35},{n:'Q',v:u+' − p',w:.65}],[{n:'1組の定価',v:(S/v.n)+'円',w:1}],[{n:'P',v:A+'p',w:.35,ask:1},{n:'Q',v:B+'('+u+' − p)',w:.65}]]},
   calc:'1組の原価 '+T1+' ÷ '+v.n+' ＝ '+u+'、1組の売上 '+S+' ÷ '+v.n+' ＝ '+(S/v.n)+'<br>'+A+'p ＋ '+B+'('+u+' − p) ＝ '+(S/v.n)+'<br>'+D(B-A)+'p ＝ '+D(B*u-S/v.n)+' → p ＝ '+v.p+'<br>Pの定価 '+v.p+' × '+A+' ＝ '+lp};},
 V:function(v){var u=v.p+v.q,S=(v.p*(100+v.a)+v.q*(100+v.b))/100;for(var p=1;p<u;p++)if(p*(100+v.a)+(u-p)*(100+v.b)===S*100)return p*(100+v.a)/100+'円';return '?';},
 BC:['600円','720円','1000円','1680円'],BA:1});

T('損益',3,'145',{P:{c:[250,200,300,400,500],a:[20,10,30,40,25],d:[10,20,30]},
 ok:function(v){var L=v.c*(100+v.a)/100,s=L*(100-v.d)/100;return isI(L)&&isI(s)&&s>v.c;},
 f:function(v,R){var L=v.c*(100+v.a)/100,s=L*(100-v.d)/100,ans=s-v.c,ch=NC(ans,[ans-10,ans+10,ans+20],4,yen,10);
  return {q:'1個'+v.c+'円で仕入れた品に'+WR(v.a)+'の利益を見込んで定価をつけたが、売れないので、定価の'+WR(v.d)+'引にして売った。1個あたりの利益はいくらか。',c:ch.c,a:ch.a,inw:SE3I,
   fig:SE3(L+'円',s+'円',(L-s)+'円',v.c+'円','?','p'),
   calc:'定価 '+v.c+' × '+D(1+v.a/100)+' ＝ '+L+'<br>売値 '+L+' × '+D(1-v.d/100)+' ＝ '+s+'<br>利益 '+s+' − '+v.c+' ＝ '+ans};},
 V:function(v){return (v.c*(100+v.a)*(100-v.d)/10000-v.c)+'円';},
 BC:['10円','20円','30円','40円'],BA:1});

T('損益',4,'146',{P:{L:[600,500,750,800,900,1000,1200],d:[10,20],a:[20,25,10,50]},
 ok:function(v){return isI(v.L*(100-v.d)/(100+v.a))&&isI(v.L*(100-v.d)/100);},
 f:function(v,R){var s=v.L*(100-v.d)/100,c=s*100/(100+v.a),ch=NC(c,[s,v.L*(100-v.d-v.a)/100,v.L*100/(100+v.a)],4,yen,20);
  return {q:'ある店では、定価の'+WR(v.d)+'引で売っても原価の'+WR(v.a)+'の利益が出るように定価を設定している。定価が'+v.L+'円の品物の原価はいくらか。',c:ch.c,a:ch.a,inw:SE3I+'。売値は原価の '+D(1+v.a/100)+' 倍',
   fig:SE3(v.L+'円',s+'円',(v.L-s)+'円','?',D(v.a/100)+'（原価を1）','c'),
   calc:'売値 '+v.L+' × '+D(1-v.d/100)+' ＝ '+s+'<br>原価を1とすると売値は '+D(1+v.a/100)+'<br>① ＝ ③ ÷ ② ＝ '+s+' ÷ '+D(1+v.a/100)+' ＝ '+c};},
 V:function(v){for(var c=1;c<=v.L;c++)if(c*(100+v.a)===v.L*(100-v.d))return c+'円';return '?';},
 BC:['450円','480円','500円','540円'],BA:0});

T('損益',5,'147',{P:{S:[100,120,150,200,240,300],u:[15,10,20,25,5],r:[10,20,30]},
 ok:function(v){var x=v.r*v.S/(v.u+v.r);return isI(x)&&isI(x*(100+v.u)/100)&&v.S-x*(100+v.u)/100>0;},
 f:function(v,R){var x=v.r*v.S/(v.u+v.r),U=D(1+v.u/100),Rr=D(1-v.r/100),ch=NC(x,[x-5,x-4,x+5],4,yen,2);
  return {q:'売値が'+v.S+'円の商品Pの仕入れ値が'+v.u+'%上がったために、利益が'+WR(v.r)+'減った。元の仕入れ値はいくらだったか。',c:ch.c,a:ch.a,
   inw:'前と後の売値'+v.S+'円をそれぞれ仕入れ値と利益に分ける。元の仕入れ値を x と置く',
   fig:{rows:[[{n:'前の売値',v:v.S+'円',w:1}],[{n:'仕入れ',v:'x',w:.4,ask:1},{n:'利益',v:v.S+' − x',w:.6}],[{n:'後の売値',v:v.S+'円',w:1}],[{n:'仕入れ',v:U+'x',w:.46},{n:'利益',v:Rr+'('+v.S+' − x)',w:.54}]]},
   calc:v.S+' − '+U+'x ＝ '+Rr+'('+v.S+' − x)<br>'+v.S+' − '+U+'x ＝ '+D(Rr*v.S)+' − '+Rr+'x<br>'+D(U-Rr)+'x ＝ '+D(v.S-Rr*v.S)+' → x ＝ '+x};},
 V:function(v){for(var x=1;x<v.S;x++)if((v.S*100-(100+v.u)*x)*100===(100-v.r)*(v.S-x)*100)return x+'円';return '?';},
 BC:['35円','36円','40円','45円'],BA:2});

function Q148(v){return 'ある店では、定価の'+WR(v.d)+'引で販売したときに'+v.p+'円の利益が出るように定価を設定してある。';}
T('損益',4,'148-1',{P:{d:[30,20,40],p:[200,100,150,250,300],c:[850,600,700,900,1000,1200]},
 ok:function(v){return isI((v.c+v.p)*100/(100-v.d));},
 f:function(v,R){var L=(v.c+v.p)*100/(100-v.d),ans=L-v.c,ch=NC(ans,[v.p,v.c+v.p,ans-300],4,yen,50);
  return {q:Q148(v)+'仕入れ値'+v.c+'円の品物Pを定価で売ったときの利益はいくらか。',c:ch.c,a:ch.a,inw:SE3I+'。'+WR(v.d)+'引の売値 ＝ 仕入れ ＋ '+v.p,
   fig:SE3('?',(v.c+v.p)+'円','',v.c+'円',v.p+'円','t'),
   calc:WR(v.d)+'引の売値 '+v.c+' ＋ '+v.p+' ＝ '+(v.c+v.p)+'<br>定価 ＝ ③ ÷ ② ＝ '+(v.c+v.p)+' ÷ '+D(1-v.d/100)+' ＝ '+L+'<br>定価で売った利益 '+L+' − '+v.c+' ＝ '+ans};},
 V:function(v){for(var L=1;L<=20000;L++)if(L*(100-v.d)===(v.c+v.p)*100)return (L-v.c)+'円';return '?';},
 BC:['200円','350円','650円','1050円'],BA:2});

T('損益',5,'148-2',{P:{d:[30,20,40],p:[200,100,150,250,300],e:[10,20],L:[1800,1000,1200,1500,2000,2400]},
 ok:function(v){var c=v.L*(100-v.d)/100-v.p;return v.e<v.d&&isI(v.L*(100-v.d)/100)&&c>0;},
 f:function(v,R){var P2=v.p+v.L*(v.d-v.e)/100,ch=NC(v.L,[v.L-200,v.L-740,v.L-1040],4,yen,100);
  return {q:Q148(v)+'品物Qは、定価の'+WR(v.e)+'引きで売ると'+P2+'円の利益がある。品物Qの定価はいくらか。',c:ch.c,a:ch.a,
   inw:'同じ品物を'+WR(v.e)+'引と'+WR(v.d)+'引で売ったときの利益の差は、値引の差（定価の'+D((v.d-v.e)/100)+'）',
   fig:{rows:[[{n:'定価',r:'1',v:'?',w:1,ask:1}],[{n:WR(v.e)+'引の売値',r:D(1-v.e/100),w:.9},{w:.1}],[{n:WR(v.d)+'引の売値',r:D(1-v.d/100),w:.7},{n:'差',r:D((v.d-v.e)/100),v:(P2-v.p)+'円',w:.2},{w:.1}]]},
   calc:'利益の差 '+P2+' − '+v.p+' ＝ '+(P2-v.p)+'<br>① ＝ ③ ÷ ② ＝ '+(P2-v.p)+' ÷ '+D((v.d-v.e)/100)+' ＝ '+v.L};},
 V:function(v){var P2=v.p+v.L*(v.d-v.e)/100;for(var L=1;L<=50000;L++)if(L*(100-v.e)-L*(100-v.d)===(P2-v.p)*100)return L+'円';return '?';},
 BC:['760円','1060円','1600円','1800円'],BA:3});

function Q149(v){return '仕入れ値'+v.cp+'円のPを'+v.np+'個仕入れて、仕入れ値の'+WR(v.a)+'の利益が出るように定価をつけた。また、仕入れ値'+v.cq+'円のQを'+v.nq+'個仕入れて、仕入れ値の'+WR(v.b)+'の利益が出る定価をつけて売った。';}
var P149={cp:[350,300,400,250,500],np:[40,30,50,60],a:[30,20,40],cq:[280,200,300,250,320],nq:[80,60,100,50],b:[40,30,50,20]};
T('損益',4,'149-1',{P:P149,
 ok:function(v){return isI(v.cp*v.a/100)&&isI(v.cq*v.b/100);},
 f:function(v,R){var pp=v.cp*v.a/100,pq=v.cq*v.b/100,P1=pp*v.np,P2=pq*v.nq,ans=P1+P2,rev=(v.cp+pp)*v.np+(v.cq+pq)*v.nq,ch=NC(ans,[rev,(v.cq+pq)*v.nq,P1],4,yen,1000);
  return {q:Q149(v)+'PとQが全部売れたときの利益はいくらか。',c:ch.c,a:ch.a,inw:'PとQそれぞれ、1個あたりの利益 × 個数',
   fig:TN4([TP('P',v.np+'個',P1+'円','1個',pp+'円',.4),TP('Q',v.nq+'個',P2+'円','1個',pq+'円',.6)],{r:'',v:'?',ask:1}),
   calc:'Pの1個の利益 '+v.cp+' × '+D(v.a/100)+' ＝ '+pp+' → × '+v.np+' ＝ '+P1+'<br>Qの1個の利益 '+v.cq+' × '+D(v.b/100)+' ＝ '+pq+' → × '+v.nq+' ＝ '+P2+'<br>合計 '+P1+' ＋ '+P2+' ＝ '+ans};},
 V:function(v){return ((v.cp*(100+v.a)/100-v.cp)*v.np+(v.cq*(100+v.b)/100-v.cq)*v.nq)+'円';},
 BC:['4760円','13160円','31360円','49560円'],BA:1});

T('損益',5,'149-2',{P:{cp:P149.cp,np:P149.np,a:P149.a,cq:P149.cq,nq:P149.nq,b:P149.b,k:[20,10,30,40]},
 ok:function(v){var pp=v.cp*v.a/100,pq=v.cq*v.b/100;if(!isI(pp)||!isI(pq)||v.k>=v.nq)return false;var x=v.cq+Math.ceil((pp*v.np-(v.nq-v.k)*pq)/v.k-1e-9);return x>0&&x<v.cq+pq;},
 f:function(v,R){var pp=v.cp*v.a/100,pq=v.cq*v.b/100,P1=pp*v.np,sold=(v.nq-v.k)*pq,ans=v.cq+Math.ceil((P1-sold)/v.k-1e-9),ch=NC(ans,[ans+28,ans+49,ans+84],4,yen,10);
  return {q:Q149(v)+'Pは全部売れて、Qは'+v.k+'個売れ残った。Q全部の利益が、P全部の利益以上になるように、売れ残った'+v.k+'個のQを値下げするとき、Qの売値は何円まで値下げできるか。',c:ch.c,a:ch.a,
   inw:'Qの利益を「定価で売れた'+(v.nq-v.k)+'個」と「値下げした'+v.k+'個」に分ける。値下げ後の売値を x と置く',
   fig:{rows:[[{n:'Q全部の利益（P全部の利益 '+P1+'円以上）',w:1}],[{n:'売れた'+(v.nq-v.k)+'個',v:sold+'円',w:.6},{n:'値下げした'+v.k+'個',v:v.k+'(x − '+v.cq+')',w:.4,ask:1}]]},
   calc:'P全部の利益 '+v.cp+' × '+D(v.a/100)+' × '+v.np+' ＝ '+P1+'<br>Qの売れた分の利益 '+pq+' × '+(v.nq-v.k)+' ＝ '+sold+'<br>'+sold+' ＋ '+v.k+'(x − '+v.cq+') ≧ '+P1+'<br>x ≧ '+D(v.cq+(P1-sold)/v.k)+' → '+ans+'円'};},
 V:function(v){var P1=v.cp*v.a/100*v.np,sold=(v.nq-v.k)*v.cq*v.b/100;for(var x=1;x<=10000;x++)if(sold+v.k*(x-v.cq)>=P1)return x+'円';return '?';},
 BC:['154円','182円','203円','238円'],BA:0});

/* ================= 料金割引 問150〜156（単位あたりの大きさ） ================= */
T('単位あたりの大きさ',4,'150',{P:{B:[1,2,3],m1:[4,3,5,6],m2:[13,10,12],N:[18,15,20,24],d1:[10,20],d2:[20,30,40]},
 ok:function(v){return v.d2>v.d1&&v.m2>v.m1+2&&v.N>=v.m2+2;},
 f:function(v,R){var a=v.m1-1,b=v.m2-v.m1,c=v.N-v.m2+1,ua=v.B,ub=rd(v.B*(100-v.d1)/100),uc=rd(v.B*(100-v.d2)/100),va=rd(a*ua),vb=rd(b*ub),vc=rd(c*uc),ans=rd(va+vb+vc),f1=function(z){return z.toFixed(1)+'万円';};
  var ch=NC(ans,[ans-1.5*v.B,ans-0.1*v.B,ans+0.3*v.B],4,f1,0.2*v.B);
  return {q:'ある空気清浄機のリース料は1か月'+v.B+'万円が基本料金となっている。ただし、'+v.m1+'か月以上リースをすると、'+v.m1+'か月目以降のリース料が基本料金の'+v.d1+'%引き、また'+v.m2+'か月目以降のリース料は基本料金の'+v.d2+'%引きになる。'+v.N+'か月リースをすると、リース料金は合計いくらか。',c:ch.c,a:ch.a,
   inw:v.N+'か月を「1〜'+a+'か月目」「'+v.m1+'〜'+(v.m2-1)+'か月目」「'+v.m2+'〜'+v.N+'か月目」に分け、それぞれ1か月あたりの料金を掛ける',
   fig:TN4([TP('1〜'+a,a+'か月',D(va)+'万円','1か月',D(ua)+'万円',.25),TP(v.m1+'〜'+(v.m2-1),b+'か月',D(vb)+'万円','1か月',D(ub)+'万円',.45),TP(v.m2+'〜'+v.N,c+'か月',D(vc)+'万円','1か月',D(uc)+'万円',.3)],{r:v.N+'か月',v:'?',ask:1}),
   calc:'③ ＝ ② × ①<br>'+D(ua)+' × '+a+' ＝ '+D(va)+'<br>'+D(ub)+' × '+b+' ＝ '+D(vb)+'<br>'+D(uc)+' × '+c+' ＝ '+D(vc)+'<br>合計 '+ans.toFixed(1)+'万円'};},
 V:function(v){var t=0;for(var i=1;i<=v.N;i++)t+=v.B*1000*(i>=v.m2?100-v.d2:i>=v.m1?100-v.d1:100);return (t/100000).toFixed(1)+'万円';},
 BC:['14.4万円','15.8万円','15.9万円','16.2万円'],BA:2});

T('単位あたりの大きさ',4,'151',{P:{B:[5,3,4,6,8],m1:[6,4,5],d1:[20,10],d2:[40,30,50],N:[20,15,18,24]},
 ok:function(v){var t=v.B*((v.m1-1)+(12-v.m1)*(100-v.d1)/100+(v.N-11)*(100-v.d2)/100);return v.d2>v.d1&&isI(t)&&isI(v.B*(100-v.d1)/100);},
 f:function(v,R){var a=v.m1-1,b=12-v.m1,c=v.N-11,ub=v.B*(100-v.d1)/100,uc=rd(v.B*(100-v.d2)/100),ans=rd(a*v.B+b*ub+c*uc),ch=SP(ans,4,2,R,function(z){return z+'万円';});
  return {q:'あるコピー機のリース料は1か月'+v.B+'万円が基本料金となっている。ただし、'+v.m1+'か月以上リースをすると、'+v.m1+'か月目以降のリース料が基本料金の'+v.d1+'%引き、また、1年以上リースをすると、12か月目以降のリース料が基本料金の'+v.d2+'%引きになる。'+v.N+'か月リースをすると、リース料金は合計いくらか。',c:ch.c,a:ch.a,
   inw:v.N+'か月を「1〜'+a+'か月目」「'+v.m1+'〜11か月目」「12〜'+v.N+'か月目」に分ける',
   fig:TN4([TP('1〜'+a,a+'か月',D(a*v.B)+'万円','1か月',v.B+'万円',.25),TP(v.m1+'〜11',b+'か月',D(b*ub)+'万円','1か月',D(ub)+'万円',.35),TP('12〜'+v.N,c+'か月',D(c*uc)+'万円','1か月',D(uc)+'万円',.4)],{r:v.N+'か月',v:'?',ask:1}),
   calc:'③ ＝ ② × ①<br>'+v.B+' × '+a+' ＋ '+D(ub)+' × '+b+' ＋ '+D(uc)+' × '+c+' ＝ '+D(a*v.B)+' ＋ '+D(b*ub)+' ＋ '+D(c*uc)+' ＝ '+ans+'万円'};},
 V:function(v){var t=0;for(var i=1;i<=v.N;i++)t+=v.B*(i>=12?100-v.d2:i>=v.m1?100-v.d1:100);return D(t/100)+'万円';},
 BC:['74万円','76万円','78万円','80万円'],BA:1});

var RS152=[[10,20,25,30],[5,10,15,20],[10,15,20,25]],SP152=[[2,5],[3,4],[2,6],[3,5]];
function dis152(r,n){var t=0;for(var i=0;i<n;i++)t+=r[Math.min(i,3)];return t;}
T('単位あたりの大きさ',5,'152',{P:{p:[9000,6000,8000,10000,12000],ri:[0,1,2],si:[0,1,2,3]},
 ok:function(v){var r=RS152[v.ri];return r.every(function(x){return isI(v.p*x/100);});},
 f:function(v,R){var r=RS152[v.ri],a=SP152[v.si][0],b=SP152[v.si][1],n=a+b,sn=dis152(r,n),sa=dis152(r,a),sb=dis152(r,b),df=sn-sa-sb,ans=v.p*df/100,ch=NC(ans,[ans-1500,ans+900,ans*2],4,yen,300);
  function row(k){var x=[];for(var i=0;i<k;i++)x.push(r[Math.min(i,3)]+'%');return x.join('・');}
  return {q:'ある旅館では2泊以上泊まると料金が1泊目'+r[0]+'%、2泊目'+r[1]+'%、3泊目'+r[2]+'%、4泊目以降'+r[3]+'%引きとなる。1泊1人'+v.p+'円の部屋に1人で'+n+'泊したい。「'+n+'連泊」する場合と、「'+a+'連泊・'+b+'連泊」に分ける場合では、料金の差はいくらになるか。',c:ch.c,a:ch.a,inwh:'整理',
   inw:'1泊ごとの割引率を並べ、割引率の合計の差を出す（1泊の料金'+v.p+'円 × 割引率の差）',
   fig:{table:{head:['泊まり方','1泊ごとの割引','合計'],rows:[[n+'連泊',row(n),sn+'%'],[a+'連泊',row(a),sa+'%'],[b+'連泊',row(b),sb+'%']]}},
   calc:'割引率の合計 '+n+'連泊 '+sn+'%、分けると '+sa+' ＋ '+sb+' ＝ '+(sa+sb)+'%<br>差 '+sn+' − '+(sa+sb)+' ＝ '+df+'%<br>'+v.p+' × '+D(df/100)+' ＝ '+ans};},
 V:function(v){var r=RS152[v.ri],a=SP152[v.si][0],b=SP152[v.si][1];function cost(k){var t=0;for(var i=0;i<k;i++)t+=v.p*(100-r[Math.min(i,3)]);return t/100;}return Math.abs(cost(a)+cost(b)-cost(a+b))+'円';},
 BC:['1200円','2700円','3600円','5400円'],BA:1});

T('単位あたりの大きさ',5,'153',{P:{A:[880,780,980,800],Bp:[1050,1000,1150,1200],d:[200,150,250],e:[300,250,350],N:[9,8,10],n1:[3,2,4],n2:[2,1,3],x:[2,1,3,4,5],k:[4,2,3,5]},
 ok:function(v){var n3=v.N-v.n1-v.n2;return n3>=1&&v.k<=v.n1+n3&&v.x<v.N;},
 f:function(v,R){var n3=v.N-v.n1-v.n2,ex=v.d*(v.n1+n3)+v.e*(v.n2+n3)-v.d*v.k,Tt=v.A*v.x+v.Bp*(v.N-v.x)+ex,main=Tt-ex,st=Math.max(1,v.x-R.int(0,3)),c=[],i;
  for(i=0;i<4;i++)c.push((st+i)+'人');
  return {q:'ある飲食店のメニューは、パスタが'+v.A+'円、ランチプレートが'+v.Bp+'円で、どちらも'+v.d+'円をたせば飲み物を、'+v.e+'円をたせばデザートを追加することができる。またクーポンを利用すると、1枚につき飲み物1杯が無料になる。'+v.N+'人の客がそれぞれパスタ、ランチプレートのいずれかを注文し、追加で'+v.n1+'人は飲み物だけ、'+v.n2+'人はデザートだけ、'+n3+'人は飲み物とデザートを注文した。クーポン'+v.k+'枚を利用して、合計金額が'+Tt+'円だったとき、パスタを頼んだのは何人か。',c:c,a:c.indexOf(v.x+'人'),
   inw:'合計金額から追加分（飲み物・デザート・クーポン）を引き、残りを「パスタ x 人」と「プレート'+v.N+' − x 人」に分ける',
   fig:TN4([TP('パスタ','x人',v.A+'x','1人',v.A+'円',.45,'r'),TP('プレート',(v.N)+' − x人',v.Bp+'('+v.N+' − x)','1人',v.Bp+'円',.55)],{r:v.N+'人',v:main+'円'}),
   calc:'飲み物 '+(v.n1+n3)+'杯 × '+v.d+' ＋ デザート '+(v.n2+n3)+'個 × '+v.e+' − クーポン '+v.k+' × '+v.d+' ＝ '+ex+'<br>料理だけ '+Tt+' − '+ex+' ＝ '+main+'<br>'+v.A+'x ＋ '+v.Bp+'('+v.N+' − x) ＝ '+main+'<br>'+(v.Bp-v.A)+'x ＝ '+(v.Bp*v.N-main)+' → x ＝ '+v.x};},
 V:function(v){var n3=v.N-v.n1-v.n2,ex=v.d*(v.n1+n3)+v.e*(v.n2+n3)-v.d*v.k,Tt=v.A*v.x+v.Bp*(v.N-v.x)+ex;for(var x=0;x<=v.N;x++)if(v.A*x+v.Bp*(v.N-x)+ex===Tt)return x+'人';return '?';},
 BC:['1人','2人','3人','4人'],BA:1});

function tot154(v,n){var t=0;for(var i=1;i<=n;i++)t+=v.u*(i>=v.n2?100-v.d2:i>=v.n1?100-v.d1:100)/100;return rd(t);}
function Q154(v){return '1個'+v.u+'円の植木ポットがある。'+v.n1+'個目からは1個について'+WR(v.d1)+'引に、'+v.n2+'個目からは1個について'+WR(v.d2)+'引になる。';}
function F154(v,n){var a=v.n1-1,b=v.n2-v.n1,c=n-v.n2+1,ub=rd(v.u*(100-v.d1)/100),uc=rd(v.u*(100-v.d2)/100);
 return TN4([TP('1〜'+a+'個',a+'個',D(a*v.u)+'円','1個',v.u+'円',.3),TP(v.n1+'〜'+(v.n2-1)+'個',b+'個',D(b*ub)+'円','1個',ub+'円',.4),TP(v.n2+'個〜',c>0?c+'個':'',c>0?D(c*uc)+'円':'','1個',uc+'円',.3)],{r:n+'個',v:'?',ask:1});}
var P154={u:[120,100,150,200,80],n1:[11,6,21],n2:[31,21,41],d1:[10,20],d2:[30,40,25],K:[35,40,45,50,30]};
T('単位あたりの大きさ',4,'154-1',{P:P154,
 ok:function(v){return v.n2>v.n1+4&&v.K>v.n2&&v.d2>v.d1&&isI(v.u*(100-v.d1)/100)&&isI(v.u*(100-v.d2)/100);},
 f:function(v,R){var ans=tot154(v,v.K),lo=v.u*(100-v.d2)/100*v.K,ch=NC(ans,[v.u*v.K,lo,(ans+lo)/2],4,yen,100);
  var a=v.n1-1,b=v.n2-v.n1,c=v.K-v.n2+1,ub=v.u*(100-v.d1)/100,uc=v.u*(100-v.d2)/100;
  return {q:Q154(v)+v.K+'個買ったときの代金は、全部でいくらか。',c:ch.c,a:ch.a,inw:v.K+'個を「1〜'+a+'個目」「'+v.n1+'〜'+(v.n2-1)+'個目」「'+v.n2+'〜'+v.K+'個目」に分ける',
   fig:F154(v,v.K),calc:'③ ＝ ② × ①<br>'+v.u+' × '+a+' ＋ '+ub+' × '+b+' ＋ '+uc+' × '+c+' ＝ '+(v.u*a)+' ＋ '+(ub*b)+' ＋ '+(uc*c)+' ＝ '+ans};},
 V:function(v){var t=0;for(var i=1;i<=v.K;i++)t+=v.u*(i<v.n1?100:i<v.n2?100-v.d1:100-v.d2);return t/100+'円';},
 BC:['2940円','3360円','3780円','4200円'],BA:2});

T('単位あたりの大きさ',5,'154-2',{P:{u:P154.u,n1:P154.n1,n2:P154.n2,d1:P154.d1,d2:P154.d2,C:[24,15,20,25,28,35,40,45]},
 ok:function(v){return v.n2>v.n1+4&&v.d2>v.d1&&v.C>v.n1&&isI(v.u*(100-v.d1)/100)&&isI(v.u*(100-v.d2)/100)&&isI(tot154(v,v.C)/v.C);},
 f:function(v,R){var av=tot154(v,v.C)/v.C,ch=NC(v.C,[v.C-4,v.n2-1,v.C+11],4,function(z){return z+'個';},2),a=v.n1-1,ub=v.u*(100-v.d1)/100,uc=v.u*(100-v.d2)/100;
  var inMid=v.C<v.n2,calc;
  if(inMid)calc='合計で n 個とすると（'+v.n1+'〜'+(v.n2-1)+'個の範囲）<br>'+v.u+' × '+a+' ＋ '+ub+'(n − '+a+') ＝ '+av+'n<br>'+(av-ub)+'n ＝ '+(v.u*a-ub*a)+' → n ＝ '+v.C;
  else calc='合計で n 個とすると（'+v.n2+'個以上）<br>'+v.u+' × '+a+' ＋ '+ub+' × '+(v.n2-v.n1)+' ＋ '+uc+'(n − '+(v.n2-1)+') ＝ '+av+'n<br>'+D(av-uc)+'n ＝ '+D(v.u*a+ub*(v.n2-v.n1)-uc*(v.n2-1))+' → n ＝ '+v.C;
  return {q:Q154(v)+'平均購入価格が1個あたり'+av+'円になった。このとき、植木ポットを合計で何個買ったか。',c:ch.c,a:ch.a,
   inw:'まず'+(v.n2-1)+'個買ったときの平均を出して、平均'+av+'円がどの範囲か調べる。個数を n と置いて「合計 ＝ 平均 × 個数」',
   fig:F154(v,v.C),calc:(v.n2-1)+'個の平均 '+tot154(v,v.n2-1)+' ÷ '+(v.n2-1)+' ＝ '+D(Math.round(tot154(v,v.n2-1)/(v.n2-1)*10)/10)+'<br>'+calc};},
 V:function(v){var av=tot154(v,v.C)/v.C;for(var n=1;n<=300;n++)if(Math.abs(tot154(v,n)-av*n)<1e-6)return n+'個';return '?';},
 BC:['20個','24個','30個','35個'],BA:1});

function cost155(m,k,N){var best=1e9;for(var b=0;b<=Math.ceil(N/m);b++)best=Math.min(best,b*k+Math.max(0,N-b*m));return best;}
function Q155(v){return 'ある博物館の入場券はx円である。また、切り離して使用できる'+v.m+'枚つづりの入場回数券を'+v.k+'x円で販売している。ただし、余った回数券の払い戻しはしないものとする。';}
function W155(m,k,N){var b=Math.floor(N/m),r=N-b*m,s1=b*k+r,s2=(b+1)*k;return '回数券'+b+'冊とバラ'+r+'枚 '+b+' × '+k+'x ＋ '+r+'x ＝ '+s1+'x、回数券'+(b+1)+'冊 '+(b+1)+' × '+k+'x ＝ '+s2+'x → 安いのは '+Math.min(s1,s2)+'x';}
T('単位あたりの大きさ',5,'155-1',{P:{m:[20,10,12],k:[15,8,9,7,10],N:[50,45,56,30,70,65,38]},
 ok:function(v){return v.k<v.m&&v.N>v.m&&v.N%v.m!==0;},
 f:function(v,R){var ans=cost155(v.m,v.k,v.N),ch=NC(ans,[ans-10,ans-5,ans+5],4,function(z){return z+'x円';},3);
  return {q:Q155(v)+v.N+'人で入場したい。最も安くすむ場合の総額はいくらになるか。',c:ch.c,a:ch.a,
   inw:'回数券は1冊で'+v.m+'人分。端数の人数を「バラで買う」か「もう1冊買う」か比べる',
   fig:TN4([TP('回数券',Math.floor(v.N/v.m)*v.m+'人',Math.floor(v.N/v.m)*v.k+'x','1冊',v.k+'x',.65),TP('端数',(v.N%v.m)+'人','?','1人','x',.35,'v')],{r:v.N+'人',v:'?',ask:1}),
   calc:W155(v.m,v.k,v.N)};},
 V:function(v){var best=1e9;for(var b=0;b<=10;b++)for(var s=0;s<=v.N;s++)if(b*v.m+s>=v.N)best=Math.min(best,b*v.k+s);return best+'x円';},
 BC:['30x円','35x円','40x円','45x円'],BA:2});

T('単位あたりの大きさ',5,'155-2',{P:{m:[20,10,12],k:[15,8,9,7,10],G1:[45,40,35,50,42],G2:[56,58,57,59,54,38]},
 ok:function(v){if(v.k>=v.m||v.G1===v.G2)return false;var c1=cost155(v.m,v.k,v.G1),c2=cost155(v.m,v.k,v.G2);return c1*v.G2!==c2*v.G1&&v.G1>v.m&&v.G2>v.m;},
 f:function(v,R){var c1=cost155(v.m,v.k,v.G1),c2=cost155(v.m,v.k,v.G2),num=Math.abs(c1*v.G2-c2*v.G1),den=v.G1*v.G2,ans=num/den;
  var fm=function(z){return FR(z)+' × x円';},w1=Math.ceil(v.G1/v.m)*v.k,w2=Math.ceil(v.G2/v.m)*v.k;
  var ch=NC(ans,[Math.abs(w1/v.G1-c2/v.G2),Math.abs(c1/v.G1-(v.G2)/v.G2),Math.abs(v.G1/v.G1-c2/v.G2),Math.abs(c1/v.G1-v.k/v.m)],4,fm,1/den);
  return {q:Q155(v)+v.G1+'人で入場する団体Pと、'+v.G2+'人で入場する団体Qがある。最も安くすむ場合、PとQの1人あたりの差額はいくらか。',c:ch.c,a:ch.a,
   inw:'P・Qそれぞれ最も安い総額を出し、人数で割って1人あたりを比べる',
   fig:TN4([TP('P',v.G1+'人',c1+'x','1人','?',.5,'u'),TP('Q',v.G2+'人',c2+'x','1人','?',.5,'u')]),
   calc:'P：'+W155(v.m,v.k,v.G1)+'<br>Q：'+W155(v.m,v.k,v.G2)+'<br>1人あたり P '+F(c1,v.G1)+'x、Q '+F(c2,v.G2)+'x<br>差 '+F(num,den)+'x'};},
 V:function(v){function best(N){var b=1e9;for(var i=0;i<=10;i++)for(var s=0;s<=N;s++)if(i*v.m+s>=N)b=Math.min(b,i*v.k+s);return b;}
  var a=best(v.G1),b=best(v.G2);return F(Math.abs(a*v.G2-b*v.G1),v.G1*v.G2)+' × x円';},
 BC:['13/504 × x円','7/252 × x円','11/252 × x円','1/2 × x円'],BA:0});

var DS156=[[20,15,10],[30,20,10],[20,10,5]];
function rate156(v,h){var d=DS156[v.di];return v.H*(100-(h<12?d[0]:h<15?d[1]:h<17?d[2]:0))/100;}
function cost156(v,s,L){var t=0;for(var h=s;h<s+L;h++)t+=rate156(v,h);return t;}
function Q156(v){var d=DS156[v.di];return 'ある体育館は、基本使用料が1時間あたり'+v.H+'円で9時から24時まで使用できる。ただし、使用する時間帯によって割引があり、9時から12時までは'+d[0]+'%引き、12時から15時までは'+d[1]+'%引き、15時から17時までは'+d[2]+'%引きとなっている。';}
function F156(v){return {table:{head:['時間帯','9〜12時','12〜15時','15〜17時','17〜24時'],rows:[['1時間あたり',String(rate156(v,9)),String(rate156(v,12)),String(rate156(v,15)),String(rate156(v,17))]]}};}
T('単位あたりの大きさ',5,'156-1',{P:{H:[25000,20000,30000,40000],di:[0,1,2],s:[13,10,11,14,15,16],L:[4,3,2,5]},
 ok:function(v){return v.s+v.L<=24;},
 f:function(v,R){var ans=cost156(v,v.s,v.L),k=v.H/10,ch=NC(ans,[ans-k,ans-k/2,ans+k],4,yen,k/2),parts=[];for(var h=v.s;h<v.s+v.L;h++)parts.push(rate156(v,h));
  return {q:Q156(v)+v.s+'時から'+v.L+'時間使用するとき、使用料はいくらか。',c:ch.c,a:ch.a,inwh:'整理',inw:'時間帯ごとの1時間あたりの料金を出し、使う時間ごとに足す',
   fig:F156(v),calc:v.s+'時〜'+(v.s+v.L)+'時：'+parts.join(' ＋ ')+' ＝ '+ans};},
 V:function(v){var d=DS156[v.di],t=0;for(var mnt=v.s*60;mnt<(v.s+v.L)*60;mnt+=60){var h=mnt/60;t+=v.H-v.H*(h<12?d[0]:h<15?d[1]:h<17?d[2]:0)/100;}return t+'円';},
 BC:['85000円','86250円','87500円','90000円'],BA:2});

T('単位あたりの大きさ',5,'156-2',{P:{H:[25000,20000,30000,40000],di:[0,1,2],L2:[6,5,4],s2:[11,9,10,12,13]},
 ok:function(v){if(v.s2+v.L2>24)return false;var c=cost156(v,v.s2,v.L2),n=0;for(var s=9;s+v.L2<=24;s++)if(cost156(v,s,v.L2)===c)n++;return n===1;},
 f:function(v,R){var C=cost156(v,v.s2,v.L2),mx=24-v.L2-3,st=Math.min(mx,Math.max(9,v.s2-R.int(0,3))),c=[],i;for(i=0;i<4;i++)c.push((st+i)+'〜'+(st+i+v.L2)+'時');
  var av=Math.round(C/v.L2);
  return {q:Q156(v)+'この体育館を連続して'+v.L2+'時間使用したところ使用料は'+C+'円であった。何時から何時まで借りていたか。',c:c,a:c.indexOf(v.s2+'〜'+(v.s2+v.L2)+'時'),inwh:'整理',
   inw:'1時間あたりの平均（'+C+' ÷ '+v.L2+'）から、どの時間帯をまたぐか見当をつけ、選択肢の時間帯で確かめる',
   fig:F156(v),calc:'1時間あたりの平均 '+C+' ÷ '+v.L2+' ≒ '+av+'<br>'+v.s2+'〜'+(v.s2+v.L2)+'時：'+(function(){var p=[];for(var h=v.s2;h<v.s2+v.L2;h++)p.push(rate156(v,h));return p.join(' ＋ ');})()+' ＝ '+C};},
 V:function(v){var C=cost156(v,v.s2,v.L2);for(var s=9;s+v.L2<=24;s++){var d=DS156[v.di],t=0;for(var h=s;h<s+v.L2;h++)t+=v.H-v.H*(h<12?d[0]:h<15?d[1]:h<17?d[2]:0)/100;if(t===C)return s+'〜'+(s+v.L2)+'時';}return '?';},
 BC:['9〜15時','10〜16時','11〜17時','12〜18時'],BA:2});

/* ================= 仕事算 問157〜159（単位あたりの大きさ）・分割払い 問160 ================= */
function Q157(v){var T1=v.X*v.Y/(v.X+v.Y),b=(1-v.a/v.X)*v.Y;return 'あるデータをパソコンに入力する作業に、XとYの2人では'+HM(T1)+'かかる。X1人で'+HM(v.a)+'作業をしたところ、残りの入力にY1人で'+HM(b)+'かかった。';}
function ok157(v){var T1=v.X*v.Y/(v.X+v.Y),b=(1-v.a/v.X)*v.Y;return v.X!==v.Y&&isI(T1*4)&&isI(b*4)&&v.a<T1&&b>v.a;}
function C157(v){var T1=v.X*v.Y/(v.X+v.Y),b=(1-v.a/v.X)*v.Y;
 return '全体の仕事量を1、1時間あたりの仕事量を X：x、Y：y とする<br>x ＋ y ＝ '+FR(1/T1)+'（2人で'+HM(T1)+'）<br>'+D(v.a)+'x ＋ '+D(b)+'y ＝ 1<br>上の式を'+D(v.a)+'倍して引くと '+D(b-v.a)+'y ＝ 1 − '+FR(v.a/T1)+' ＝ '+FR(1-v.a/T1)+'<br>y ＝ '+FR(1/v.Y)+' → Y1人で '+HM(v.Y)+'<br>x ＝ '+FR(1/T1)+' − '+FR(1/v.Y)+' ＝ '+FR(1/v.X)+' → X1人で '+HM(v.X);}
function F157(v){var b=(1-v.a/v.X)*v.Y;return TN4([TP('X',HM(v.a),'','1時間','x',.35),TP('Y',HM(b),'','1時間','y',.65)],{r:'',v:'仕事全体 1'});}
var P157={X:[15,10,12,18,20,24,30],Y:[22.5,15,18,20,24,30,36,45],a:[3,2,4,5,6]};
function V157(v,who){var T1=v.X*v.Y/(v.X+v.Y),b=(1-v.a/v.X)*v.Y;for(var mm=1;mm<=6000;mm++){var y=60/mm,x=1/T1-y;if(Math.abs(v.a*x+b*y-1)<1e-9)return HM((who==='Y'?mm:60/x)/60);}return '?';}
T('単位あたりの大きさ',5,'157-1',{P:P157,ok:ok157,
 f:function(v,R){var ch=NC(v.Y,[v.Y-12,v.Y-7,v.Y-4,v.Y-2],5,HM,1);
  return {q:Q157(v)+'このデータ入力をY1人で行うと、どれくらいかかるか。',c:ch.c,a:ch.a,inw:'全体の仕事を1として、1時間あたりの仕事量（単位あたりの大きさ）を x・y と置く',fig:F157(v),calc:C157(v)};},
 V:function(v){return V157(v,'Y');},
 BC:['10時間30分','15時間30分','18時間30分','20時間30分','22時間30分'],BA:4});
T('単位あたりの大きさ',5,'157-2',{P:P157,ok:ok157,
 f:function(v,R){var ch=NC(v.X,[v.X-5,v.X-3,v.X-1,v.X+1],5,HM,1);
  return {q:Q157(v)+'このデータ入力をX1人で行うと、どれくらいかかるか。',c:ch.c,a:ch.a,inw:'全体の仕事を1として、1時間あたりの仕事量（単位あたりの大きさ）を x・y と置く',fig:F157(v),calc:C157(v)};},
 V:function(v){return V157(v,'X');},
 BC:['10時間','12時間','14時間','15時間','16時間'],BA:3});

var Q158='ある図書館で1階と2階の書庫に収納する本を整理する作業を行うことになった。';
T('単位あたりの大きさ',5,'158-1',{P:{X:[30,20,24,36,40,60],Y:[20,15,12,30,18],Dd:[25,16,18,20,22,24,28,30,35]},
 ok:function(v){var d=v.X*(v.Y-v.Dd)/(v.Y-v.X);return v.X!==v.Y&&v.Dd>Math.min(v.X,v.Y)&&v.Dd<Math.max(v.X,v.Y)&&isI(d)&&d>0&&d<v.Dd;},
 f:function(v,R){var d=v.X*(v.Y-v.Dd)/(v.Y-v.X),L=v.X*v.Y/gc(v.X,v.Y),ch=NC(d,[d-7,d-5,d-3,d+5],5,function(z){return z+'日';},2);
  return {q:Q158+'1階書庫での作業は、Xが1人で行うと'+v.X+'日かかり、Yが1人で行うと'+v.Y+'日かかる。Xが作業を始め、途中からYに交代して作業を進めたところ、Xの作業開始からちょうど'+v.Dd+'日で完了した。このとき、Xの働いた日数はどれだけか。',c:ch.c,a:ch.a,
   inw:'全体の仕事を1として、Xが働いた d 日と、Yが働いた '+v.Dd+' − d 日に分ける。1日あたりの仕事量は X '+FR(1/v.X)+'、Y '+FR(1/v.Y),
   fig:TN4([TP('X','d日','','1日',FR(1/v.X),.5,'r'),TP('Y',v.Dd+' − d日','','1日',FR(1/v.Y),.5)],{r:v.Dd+'日',v:'仕事全体 1'}),
   calc:'d/'+v.X+' ＋ ('+v.Dd+' − d)/'+v.Y+' ＝ 1<br>両辺を'+L+'倍：'+(L/v.X)+'d ＋ '+(L/v.Y)+'('+v.Dd+' − d) ＝ '+L+'<br>'+(L/v.X-L/v.Y)+'d ＝ '+(L-L/v.Y*v.Dd)+' → d ＝ '+d};},
 V:function(v){for(var d=0;d<=v.Dd;d++)if(d*v.Y+(v.Dd-d)*v.X===v.X*v.Y)return d+'日';return '?';},
 BC:['8日','10日','12日','15日','20日'],BA:3});
T('単位あたりの大きさ',5,'158-2',{P:{t:[4,3,5,6,2],p:[10,12,15,20,8],q:[15,12,20,30,24,10]},
 ok:function(v){var den=v.p*v.q-v.t*v.q-v.t*v.p;if(den<=0||v.p===v.q)return false;var r=v.t*v.p*v.q/den;return isI(r)&&r>v.t;},
 f:function(v,R){var r=v.t*v.p*v.q/(v.p*v.q-v.t*v.q-v.t*v.p),ch=NC(r,[r-4,r-2,r+3,r+8],5,function(z){return z+'日';},2);
  return {q:Q158+'2階書庫での作業は、P、Q、Rの3人で行うと'+v.t+'日かかり、Pが1人で行うと'+v.p+'日かかり、Qが1人で行うと'+v.q+'日かかる。このとき、Rが1人で行うと何日かかるか。',c:ch.c,a:ch.a,
   inw:'全体の仕事を1として、3人の1日あたりの仕事量 '+FR(1/v.t)+' を、P・Q・Rに分ける',
   fig:{rows:[[{n:'3人の1日分',r:FR(1/v.t),w:1}],[{n:'P',r:FR(1/v.p),w:.4},{n:'Q',r:FR(1/v.q),w:.27},{n:'R',r:'?',w:.33,ask:1}]]},
   calc:'Rの1日分 ＝ '+FR(1/v.t)+' − '+FR(1/v.p)+' − '+FR(1/v.q)+' ＝ '+FR(1/r)+'<br>R1人で 1 ÷ '+FR(1/r)+' ＝ '+r+'日'};},
 V:function(v){for(var r=1;r<=1000;r++)if(v.p*v.q*r===v.t*(v.q*r+v.p*r+v.p*v.q))return r+'日';return '?';},
 BC:['8日','10日','12日','15日','20日'],BA:2});

function Q159(v){return '空の水槽を満たすのに、P管では'+v.p+'時間、Q管では'+v.q+'時間かかる。また、満水の水槽から水を流し出して空にするのに、R管では'+v.r+'時間、S管では'+v.s+'時間かかる。';}
var P159={p:[3,2,4,6],q:[5,3,4,6,12],r:[6,4,8,12],s:[10,12,15,20],a:[1,2]};
T('単位あたりの大きさ',5,'159-1',{P:P159,
 ok:function(v){var t=v.a+(1-v.a/v.p)/(1/v.p+1/v.q);return v.a<v.p&&isI(t*12)&&v.p!==v.q;},
 f:function(v,R){var rest=(1-v.a/v.p)/(1/v.p+1/v.q),t=v.a+rest,ch=NC(t,[t-1,t-0.75,t-0.25,t+1/12],5,HM,0.25);
  return {q:Q159(v)+'空の水槽にP管で'+v.a+'時間注水し、その後、P管とQ管で同時に注水する。このとき、空の水槽を満水にするまでにどれだけかかるか。',c:ch.c,a:ch.a,
   inw:'満水を1として、P管だけの'+v.a+'時間と、P管とQ管の時間に分ける。1時間あたりの注水量は P '+FR(1/v.p)+'、Q '+FR(1/v.q),
   fig:TN4([TP('Pだけ',v.a+'時間',FR(v.a/v.p),'1時間',FR(1/v.p),.4),TP('P＋Q','?',FR(1-v.a/v.p),'1時間',FR(1/v.p+1/v.q),.6,'r')],{r:'',v:'満水 1'}),
   calc:'Pだけで入る量 '+FR(1/v.p)+' × '+v.a+' ＝ '+FR(v.a/v.p)+'、残り '+FR(1-v.a/v.p)+'<br>P＋Q の1時間 '+FR(1/v.p)+' ＋ '+FR(1/v.q)+' ＝ '+FR(1/v.p+1/v.q)+'<br>① ＝ ③ ÷ ② ＝ '+FR(1-v.a/v.p)+' ÷ '+FR(1/v.p+1/v.q)+' ＝ '+FR(rest)+'時間<br>合計 '+v.a+' ＋ '+FR(rest)+' ＝ '+HM(t)};},
 V:function(v){var L=v.p*v.q*60,vol=v.a*60*v.q;for(var mm=0;mm<=100000;mm++){if(vol>=L)return HM((v.a*60+mm)/60);vol+=v.q+v.p;}return '?';},
 BC:['1時間15分','1時間30分','2時間','2時間15分','2時間20分'],BA:3});
T('単位あたりの大きさ',5,'159-2',{P:P159,
 ok:function(v){var rt=1/v.p+1/v.q-1/v.r-1/v.s;if(rt<=0)return false;var t=1/rt;return isI(t*12)&&t>=1.75&&t<=12&&v.p!==v.q;},
 f:function(v,R){var rt=1/v.p+1/v.q-1/v.r-1/v.s,t=1/rt,ch=NC(t,[t-1.5,t-1.25,t-0.75,t-0.5],5,HM,0.25);
  return {q:Q159(v)+'空の水槽にP管とQ管で注水しながら、同時にR管とS管で排水すると、満水にするまでにどれだけかかるか。',c:ch.c,a:ch.a,
   inw:'満水を1として、1時間あたりの量を「入る（P・Q）」と「出る（R・S）」に分け、差がたまる量',
   fig:TN4([TP('P＋Q − R − S','?','満水 1','1時間',FR(rt),1,'r')]),
   calc:'1時間にたまる量 '+FR(1/v.p)+' ＋ '+FR(1/v.q)+' − '+FR(1/v.r)+' − '+FR(1/v.s)+' ＝ '+FR(rt)+'<br>① ＝ ③ ÷ ② ＝ 1 ÷ '+FR(rt)+' ＝ '+FR(t)+'時間 ＝ '+HM(t)};},
 V:function(v){var L=v.p*v.q*v.r*v.s,per=(v.q*v.r*v.s+v.p*v.r*v.s-v.p*v.q*v.s-v.p*v.q*v.r);for(var mm=1;mm<=100000;mm++)if(per*mm>=L*60)return HM(mm/60);return '?';},
 BC:['2時間15分','2時間30分','3時間','3時間15分','3時間45分'],BA:4});

function Q160(v){return 'ある商品を分割払いで購入したい。購入時に頭金としていくらか支払い、次の支払いからは、購入価格から頭金を引いた残額を'+v.n+'回均等払いで支払う。その際は、購入時の残額の'+v.i+'%の利子がつき、それを残額に加えた額を'+v.n+'等分して支払うことになる。';}
T('分割払い',4,'160-1',{P:{d:[25,20,10,40,50],i:[10,5,20,25],n:[11,9,10,12,6]},
 f:function(v,R){var per=(100-v.d)*(100+v.i)/10000/v.n,fm=function(z){return FR(z);};
  var ch=NC(per,[1/v.n,(100-v.d)/100/v.n,v.d*(100+v.i)/10000,(100-v.d)*(100+v.i)/10000/(v.n-1)],5,fm,1/(v.n*40));
  var rem=FR((100-v.d)/100),tot=FR((100-v.d)*(100+v.i)/10000);
  return {q:Q160(v)+'頭金として購入価格の'+v.d+'%を支払うものとすると、分割払いの1回分の支払額は購入金額のどれだけにあたるか。',c:ch.c,a:ch.a,
   inw:'購入価格を1として頭金と残額に分け、残額に利子を足した額を'+v.n+'回に分ける',
   fig:BK('',[['頭金',FR(v.d/100),'',.2],['残額',rem,'',.5],['利子',FR((100-v.d)*v.i/10000),'',.24]],2,v.n,['?',''],1,1),
   calc:'残額 1 − '+FR(v.d/100)+' ＝ '+rem+'<br>利子を足す '+rem+' × '+D(1+v.i/100)+' ＝ '+tot+'<br>1回分 '+tot+' ÷ '+v.n+' ＝ '+FR(per)};},
 V:function(v){var price=1200000,rest=price*(100-v.d)/100,pay=rest*(100+v.i)/100/v.n;return FR(pay/price);},
 BC:['1/20','3/40','1/11','1/8','11/40'],BA:1});
var FL160=[1/8,1/6,1/5,1/4,1/3,2/5,1/2,3/5,2/3,3/4];
T('分割払い',4,'160-2',{P:{f:[20,25,30,16,40,15,24,12],i:[10,5,20,25],n:[11,9,10,12,6]},
 ok:function(v){var d=1-100*v.n/(v.f*(100+v.i));return d>0.05&&d<0.9&&FR(d).length<=4;},
 f:function(v,R){var d=1-100*v.n/(v.f*(100+v.i)),ch=NC(d,FL160.slice().sort(function(a,b){return Math.abs(a-d)-Math.abs(b-d);}),5,FR,0.05);
  var tot=FR(v.n/v.f),rem=FR(1-d);
  return {q:Q160(v)+'分割払いの1回分の支払額を購入価格の1/'+v.f+'にするためには、頭金として購入価格のどれだけを支払えばよいか。',c:ch.c,a:ch.a,
   inw:'購入価格を1として、1回分 1/'+v.f+' の'+v.n+'回分が「残額＋利子」。残額を出して1から引く',
   fig:BK('',[['頭金','?','',.25],['残額',rem,'',.5],['利子','残額×'+D(v.i/100),'',.24]],2,v.n,['1/'+v.f,''],0,1),
   calc:'残額＋利子 1/'+v.f+' × '+v.n+' ＝ '+tot+'<br>残額 ＝ ③ ÷ ② ＝ '+tot+' ÷ '+D(1+v.i/100)+' ＝ '+rem+'<br>頭金 1 − '+rem+' ＝ '+FR(d)};},
 V:function(v){for(var k=1;k<1000;k++)for(var j=1;j<k;j++)if(gc(j,k)===1&&(k-j)*(100+v.i)*v.f===100*v.n*k)return F(j,k);return '?';},
 BC:['1/8','1/5','1/4','1/3','1/2'],BA:4});

/* ================= 代金精算 問161〜164 ================= */
T('精算',4,'161',{P:{M:[12000,9000,15000,18000],a:[10000,6000,8000,12000],C:[900,600,1200,1500]},
 ok:function(v){var sh=(v.M+v.C)/3;return v.a<v.M&&isI(sh)&&sh%100===0&&sh-(v.M-v.a)>0&&sh-v.C>0;},
 f:function(v,R){var sh=(v.M+v.C)/3,y=sh-(v.M-v.a),z=sh-v.C,P=function(a,b){return 'Yは'+a+'円、Zは'+b+'円';};
  var cand=[[y+700,z+1000],[y,z-1000],[y+200,z+100],[y-900,z-1000],[y+100,z-2100],[y+300,z-500],[y-200,z+600]].filter(function(p){return p[0]>0&&p[1]>0;}).map(function(p){return P(p[0],p[1]);});
  var ans=P(y,z),list=R.shuffle(cand.slice(0,5).concat([ans]));if(list.length<6)return null;var o=NOPT(list,ans,NONE6,R,P(y-300,z+300));
  return {q:'X、Y、Zの3人で食事をした。食事代は'+v.M+'円だったが、その場でXが'+v.a+'円、Yが'+(v.M-v.a)+'円を支払った。その後、喫茶店に入り、ここではコーヒー代'+v.C+'円をZがまとめて支払った。3人が同額ずつ負担するためには、YとZはXにそれぞれいくら支払えばよいか。',c:o.c,a:o.a,inw:SS3I,
   fig:SS3([['X',String(v.a),String(sh),'+'+(v.a-sh)],['Y',String(v.M-v.a),String(sh),'!−'+y],['Z',String(v.C),String(sh),'!−'+z]],[String(v.M+v.C),String(v.M+v.C),'0']),
   calc:'1人の負担額 ('+v.M+' ＋ '+v.C+') ÷ 3 ＝ '+sh+'<br>Y '+sh+' − '+(v.M-v.a)+' ＝ '+y+'<br>Z '+sh+' − '+v.C+' ＝ '+z};},
 V:function(v){var sh=(v.M+v.C)/3;return 'Yは'+(sh-(v.M-v.a))+'円、Zは'+(sh-v.C)+'円';},NONE:NONE6,
 BC:['Yは3000円、Zは4400円','Yは2300円、Zは2400円','Yは2500円、Zは3500円','Yは1400円、Zは2400円','Yは2300円、Zは3400円','Yは2400円、Zは1300円',NONE6],BA:4});

function Q162(v){return 'SとTの2人が、半分ずつお金を出し合って、レストランで友人の送別会を開くことになった。店から出るときに、SはTから'+v.Dp+'円を預かって支払いに向かったが、支払いは'+v.C+'円だったので、Sが'+(v.C-v.Dp)+'円を上乗せして支払いをすませた。この後で、TはSにもともと'+v.L+'円の借金があったことがわかった。';}
var P162={C:[13000,12000,14000,16000,10000],Dp:[10000,8000,9000,12000],L:[6000,4000,5000,8000]};
function ok162(v){var df=(v.Dp-v.L)-(v.C-v.Dp);return v.C>v.Dp&&df>0&&df%200===0&&v.C/2-v.Dp+v.L>0&&isI(v.C/2);}
function F162(v){var sh=v.C/2;return {table:{head:['','支払額','負担額','貸し借り','精算額'],rows:[['S',String(v.C-v.Dp),String(sh),'+'+v.L,'+'+(v.C-v.Dp-sh+v.L)],['T',String(v.Dp),String(sh),'−'+v.L,'!−'+(sh-v.Dp+v.L)],['計',String(v.C),String(v.C),'0','0']]}};}
T('精算',5,'162-1',{P:P162,ok:ok162,
 f:function(v,R){var df=(v.Dp-v.L)-(v.C-v.Dp),h=df/2,ok2=v.C/2-v.Dp+v.L,loss=v.L/2,st=Math.max(500,loss-500*R.int(0,3)),c=[h+'円得をする'],i;for(i=0;i<4;i++)c.push((st+500*i)+'円損をする');
  if(c.slice(1).indexOf(h+'円損をする')>=0&&false)return null;
  var o=NOPT(c,loss+'円損をする',NONE5,R,(st+2000)+'円損をする');
  return {q:Q162(v)+'精算のとき、SがTに「あなたから'+v.Dp+'円を預かっていたが、もともと'+v.L+'円貸していたので、'+(v.Dp-v.L)+'円をもらったことになる。支払いでは私が'+(v.C-v.Dp)+'円出したので、差額の'+df+'円を折半して'+h+'円をあなたに払えば精算できるね」と言った。このように精算すると、Sはいくら得をするか、または損をするか？',c:o.c,a:o.a,inw:'精算表で正しい精算額を出し、Sの言う精算と比べる',
   fig:F162(v),calc:'1人の負担額 '+v.C+' ÷ 2 ＝ '+(v.C/2)+'<br>正しくは TがSに '+(v.C/2)+' − '+v.Dp+' ＋ '+v.L+' ＝ '+ok2+'円払う<br>Sの言う精算では SがTに'+h+'円払う<br>Sは '+ok2+' ＋ '+h+' ＝ '+loss+'円損をする'};},
 V:function(v){var sBal=(v.C-v.Dp)+v.L-v.C/2,wrong=((v.Dp-v.L)-(v.C-v.Dp))/2,diff=sBal+wrong;return diff>0?diff+'円損をする':(-diff)+'円得をする';},NONE:NONE5,
 BC:['500円得をする','1500円損をする','2000円損をする','2500円損をする','3000円損をする',NONE5],BA:4});
T('精算',5,'162-2',{P:P162,ok:ok162,
 f:function(v,R){var h=((v.Dp-v.L)-(v.C-v.Dp))/2,ans=v.C/2-v.Dp+v.L,st=Math.max(500,ans-500*R.int(0,2)),c=['SがTに'+h+'円払う','TがSに'+h+'円払う'],i,x;
  for(i=0;c.length<5&&i<10;i++){x='TがSに'+(st+500*i)+'円払う';if(c.indexOf(x)<0)c.push(x);}
  var o=NOPT(c,'TがSに'+ans+'円払う',NONE5,R,'TがSに'+(ans+1500)+'円払う');if(o.c.indexOf('TがSに'+ans+'円払う')<0&&o.a!==o.c.length-1)return null;
  return {q:Q162(v)+'本当はどのように精算をすれば、貸し借りがなくなるか。',c:o.c,a:o.a,inw:SS3I+'（Tの借金も入れる）',
   fig:F162(v),calc:'1人の負担額 '+v.C+' ÷ 2 ＝ '+(v.C/2)+'<br>Tが出した額 '+v.Dp+'、借金 '+v.L+'<br>Tの精算額 '+(v.C/2)+' − '+v.Dp+' ＋ '+v.L+' ＝ '+ans+' → TがSに'+ans+'円払う'};},
 V:function(v){var t=v.Dp-v.C/2-v.L;return t<0?'TがSに'+(-t)+'円払う':'SがTに'+t+'円払う';},NONE:NONE5,
 BC:['SがTに500円払う','TがSに500円払う','TがSに1500円払う','TがSに2000円払う','TがSに2500円払う',NONE5],BA:4});

T('精算',5,'163',{P:{Dp:[5000,4000,6000,7000,8000],b:[3500,3000,4000,2500,4500],g:[3000,2500,3500,2000,4000],L:[4000,1000,2000,3000,5000]},
 ok:function(v){var a=v.b-v.Dp+v.L;return v.b!==v.g&&a!==0&&Math.abs(a)>=500;},
 f:function(v,R){var a=v.b-v.Dp+v.L,mg=Math.abs(a),st=Math.max(500,mg-1000*R.int(0,2)),ms=[st,st+1000,st+2000],c=[],ans=(a>0?'YがXに':'XがYに')+mg+'円払う';
  ms.forEach(function(x){c.push('XがYに'+x+'円払う');});ms.forEach(function(x){c.push('YがXに'+x+'円払う');});
  var o=NOPT(c,ans,NONE6,R,(a>0?'YがXに':'XがYに')+(st+3000)+'円払う');
  return {q:'XがYから'+v.Dp+'円を預かって、Yのネクタイを1本買うことになった。Xは'+v.b+'円の青のネクタイ1本と'+v.g+'円のグレーのネクタイ1本を買い、Yが選ばなかった方を自分のものにすることにした。もともとYはXから'+v.L+'円の借りがあった。Yが青のネクタイを選んだとき、これまでの貸し借りもなくなるように精算するには、どのようにすればよいか。',c:o.c,a:o.a,
   inw:'Yだけに注目する。Yの負担は青のネクタイ'+v.b+'円。Yが出した（預けた）のは'+v.Dp+'円、借りは'+v.L+'円',
   fig:{table:{head:['Y','金額'],rows:[['負担額（青）',String(v.b)],['預けた額',String(v.Dp)],['Xからの借り',String(v.L)],['精算額',a>0?'!−'+mg:'!+'+mg]]}},
   calc:'Yの精算額 '+v.b+' − '+v.Dp+' ＋ '+v.L+' ＝ '+a+'<br>'+(a>0?'YがXに'+mg+'円払う':'XがYに'+mg+'円払う')};},
 V:function(v){var y=v.Dp-v.L-v.b;return y<0?'YがXに'+(-y)+'円払う':'XがYに'+y+'円払う';},NONE:NONE6,
 BC:['XがYに1500円払う','XがYに2500円払う','XがYに3500円払う','YがXに1500円払う','YがXに2500円払う','YがXに3500円払う',NONE6],BA:4});

function Q164(v){return 'L、M、Nの3人が同額ずつお金を出し合って友人にプレゼントをすることにした。3人には、もともと次のような貸し借りがあった。LはMに'+v.l1+'円を貸していた。NはMに'+v.l2+'円を貸していた。プレゼントはMが買いに行くことになっていたが、病気で行けなかったため、NがMから'+v.Dm+'円を預かって買いに行った。';}
function B164(v,G){var s=G/3;return {L:v.l1-s,M:v.Dm-v.l1-v.l2-s,N:(G-v.Dm)+v.l2-s};}
function F164(v,G){var b=B164(v,G),s=G/3;function sg(x){return (x>0?'+':x<0?'−':'')+Math.abs(x);}
 return {table:{head:['','出した額','負担額','貸し借り','精算額'],rows:[['L','0',String(s),sg(v.l1),sg(b.L)],['M',String(v.Dm),String(s),sg(-v.l1-v.l2),sg(b.M)],['N',sg(G-v.Dm),String(s),sg(v.l2),sg(b.N)]]}};}
var P164={l1:[1500,1000,2000,2500,3000],l2:[2000,1000,1500,2500,3000],Dm:[10000,9000,12000]};
T('精算',5,'164-1',{P:{l1:P164.l1,l2:P164.l2,Dm:P164.Dm,dG:[1000,1500,2000,3000,500]},
 ok:function(v){var G=v.Dm-v.dG;return G%300===0&&B164(v,G).N<0;},
 f:function(v,R){var G=v.Dm-v.dG,b=B164(v,G),ans=-b.N,st=Math.max(500,ans-500*R.int(0,4)),c=[],i;for(i=0;i<5;i++)c.push((st+500*i)+'円');
  var o=NOPT(c,ans+'円',NONE5,R,(st+2500)+'円');
  return {q:Q164(v)+'Nが'+G+'円でプレゼントを買ってお釣りは自分でもらった場合、後で全員の貸し借りがなくなるように精算するためには、Nはいくら払えばよいか。',c:o.c,a:o.a,
   inw:'Nだけに注目する。Nが出した額は「'+G+'円の支払い − 預かった'+v.Dm+'円」（お釣り'+(v.Dm-G)+'円をもらったので −'+(v.Dm-G)+'円）',
   fig:F164(v,G),calc:'1人の負担額 '+G+' ÷ 3 ＝ '+(G/3)+'<br>Nが出した額 '+G+' − '+v.Dm+' ＝ −'+(v.Dm-G)+'、Mへの貸し ＋'+v.l2+'<br>Nの精算額 −'+(v.Dm-G)+' ＋ '+v.l2+' − '+(G/3)+' ＝ −'+ans+' → '+ans+'円払う'};},
 V:function(v){var G=v.Dm-v.dG,n=(G-v.Dm)+v.l2-G/3;return (-n)+'円';},NONE:NONE5,
 BC:['1000円','1500円','2000円','2500円','3000円',NONE5],BA:2});
T('精算',5,'164-2',{P:{l1:P164.l1,l2:P164.l2,Dm:P164.Dm,G:[13500,12000,10500,15000,16500,12600,11400,13200]},
 ok:function(v){if(v.G<=v.Dm||v.G%300!==0)return false;var b=B164(v,v.G);return b.L<0&&b.M>0&&b.N>0;},
 f:function(v,R){var b=B164(v,v.G),st=Math.max(1000,v.G-500*R.int(0,5)),c=[],i;for(i=0;i<6;i++)c.push((st+500*i)+'円');
  var o=NOPT(c,v.G+'円',NONE6,R,(st+3000)+'円');
  return {q:Q164(v)+'Nがいくらかを上乗せして'+v.Dm+'円以上のプレゼントを買ったところ、精算時にはLがMに'+b.M+'円、Nに'+b.N+'円を支払うことになった。この場合、プレゼントの値段はいくらだったか。',c:o.c,a:o.a,
   inw:'Lだけに注目する。Lは出した額0円、Mへの貸し'+v.l1+'円で、払う額の合計は'+(b.M+b.N)+'円。負担額 ＝ 貸し ＋ 払う額',
   fig:F164(v,v.G),calc:'Lが払う額 '+b.M+' ＋ '+b.N+' ＝ '+(b.M+b.N)+'<br>Lの負担額 '+v.l1+' ＋ '+(b.M+b.N)+' ＝ '+(v.G/3)+'<br>プレゼント '+(v.G/3)+' × 3 ＝ '+v.G};},
 V:function(v){var b=B164(v,v.G);for(var G=3;G<=60000;G+=3)if(G/3===v.l1+b.M+b.N)return G+'円';return '?';},NONE:NONE6,
 BC:['11500円','12000円','12500円','13000円','13500円','14500円',NONE6],BA:4});

/* ================= 単純な数値版（実践①） 2026-11-17 ================= */
var SM140=[];for(var j140=1000;j140<1060;j140++)SM140.push(j140);
TS('127',{a:[20,25,50,100],b:[10,20,50]});
TS('128',{k:[2,3,1.5],p:[40,30,60,20,24]});
TS('129',{M:[10,20,30],W:[10,20],n:[10,20],p:[50,40,25]});
TS('130',{T:[100,200,400,1000],a:[10,20],b:[10,20,50],c:[10,20,5]});
TS('131',{N:[60,90,120,180,240],f:['1/3','1/2','1/4','1/5'],s:['1/2','1/3','1/4'],k:[2,3,4,5]});
TS('132',{k:[2,5,10,4,6],p2:[40,30,50,45,35],dd:[5,10,2],mm:[2,3],p1:[50,60,45,55,40,70]});
TS('133',{n1:[100,200,300],n2:[100,200,300],p:[20,30,40,25],q:[40,50,60,30]});
TS('134',{N:[100,200],p:[50,40,60,20],a:[50,100,20,25]});
TS('135',{N:[100,200,50],mr:[1,2],wr:[3,4,2],a:[10,20,50],b:[20,40,50,30]});
TS('136-1',{L:[100,200,400,500,1000],p:[10,20,25,50]});
TS('136-2',{L:[100,200,400,1000],p:[20,25,30],a:[50,40,30],b:[10,20]});
TS('137-1',{U:[100,200,500],b:[20,40,50,100],k:[2,1.5,3]});
TS('137-2',{U:[100,200,500],b:[20,40,50,100],k:[2,1.5,3],c:[10,20,50],b2:[20,40,50,100]});
TS('138-1',{a:[1],b:[1,3,4],c:[1],d:[1,3,4],m:[1],n:[1,3,2]});
TS('138-2',{n:[3,4,5,6],e:[10,20,50]});
TS('139-1',{W:[50,100,200],p:[10,20,50],r:[100,50,60]});
TS('139-2',{W:[100,200,300],a:[10],b:[10,20],s:[100,50]});
TS('140-1',{s:SM140});TS('140-2',{s:SM140});TS('140-3',{s:SM140});
TS('141',{c:[100,200,500],N:[100,200],r1:[2,4],d1:[10,20],d2:[20,50],x:[200,300,500,1000]});
TS('142',{c:[100,200],n:[100,200],b:[10,20,50],p:[10,20,50]});
TS('143',{c:[100,200,500],N:[100,50,20],mk:[20,50],k:[50,10,20,30],d:[10,20]});
TS('144',{n:[10],p:[100,200,300],q:[200,500,100],a:[10,20,50],b:[20,50,10]});
TS('145',{c:[100,200,500],a:[20,50],d:[10,20]});
TS('146',{L:[100,200,300,500,600],d:[10,20],a:[20,50,25]});
TS('147',{S:[100,200],u:[10,20,25,50],r:[10,20,50]});
TS('148-1',{d:[20,50,30],p:[100,200],c:[100,200,300,400,500]});
TS('148-2',{d:[30,50,20],p:[100,200],e:[10,20],L:[1000,2000,500]});
TS('149-1',{cp:[100,200,500],np:[10,20],a:[10,20,50],cq:[100,200],nq:[10,20,50],b:[20,50,10]});
TS('149-2',{cp:[100,200,500],np:[10,20],a:[10,20,50],cq:[100,200],nq:[10,20,50],b:[20,50,10],k:[10,5]});
TS('150',{B:[1,2],m1:[3,4,6],m2:[10,12,13],N:[12,15,20],d1:[10,20],d2:[20,50]});
TS('151',{B:[10,5,2],m1:[6,4],d1:[10,20,50],d2:[50,40],N:[15,20,24]});
TS('152',{p:[10000,1000,2000,5000]});
TS('153',{A:[500,1000],Bp:[1500,2000],d:[100,200],e:[100,200,300],N:[5,6,10],n1:[1,2],n2:[1,2],x:[1,2,3],k:[1,2]});
TS('154-1',{u:[100,200],n1:[11,6],n2:[21,31],d1:[10,20],d2:[20,50],K:[30,40,50]});
TS('154-2',{u:[100,200],n1:[11,6],n2:[21,31],d1:[10,20],d2:[20,50],C:[20,25,30,40,50,15]});
TS('155-1',{m:[10,20],k:[5,8,10,15],N:[25,35,45,55]});
TS('155-2',{m:[10],k:[5,8],G1:[25,15,35],G2:[12,24,45]});
TS('156-1',{H:[10000,20000]});
TS('156-2',{H:[10000,20000]});
TS('157-1',{X:[10,20,30,12],Y:[20,30,15,60],a:[2,5,3,4,6]});
TS('157-2',{X:[10,20,30,12],Y:[20,30,15,60],a:[2,5,3,4,6]});
TS('158-1',{X:[30,20,60,10],Y:[20,10,30,15],Dd:[12,15,16,18,20,24,25,40,45,50]});
TS('158-2',{t:[2,3,4,5],p:[6,10,12,20],q:[6,10,12,20,15]});
TS('159-1',{p:[2,3,4],q:[2,3,4,6],r:[4,6,12],s:[4,6,12],a:[1]});
TS('159-2',{p:[2,3,4],q:[2,3,4,6],r:[4,6,12],s:[4,6,12],a:[1]});
TS('160-1',{d:[20,50,25],i:[10,20,50],n:[5,6,10,12,3]});
TS('160-2',{f:[10,20,5,4,8],i:[25,50,20],n:[3,5,4,2]});
TS('161',{M:[3000,6000,9000,12000,4500],a:[1000,2000,3000,4000,5000,6000],C:[300,600,900,1200,1500,3000]});
TS('162-1',{C:[6000,8000,10000,12000,5000],Dp:[5000,6000,8000,10000,4000],L:[3000,4000,5000,6000,2000]});
TS('162-2',{C:[6000,8000,10000,12000,5000],Dp:[5000,6000,8000,10000,4000],L:[3000,4000,5000,6000,2000]});
TS('163',{Dp:[5000,3000,2000,4000],b:[3000,2000,1000],g:[2000,1000,3000],L:[1000,2000,3000]});
TS('164-1',{l1:[1000,2000],l2:[1000,2000],Dm:[6000,3000,9000],dG:[3000,1500,600,900]});
TS('164-2',{l1:[1000,2000],l2:[1000,2000,3000],Dm:[6000,9000],G:[7500,9000,10500,12000,15000]});

/* ================= 解き方（新しい型）：既存の LESSON の配列に足す ================= */
function LP(fd,lv,items){LESSON[fd]=LESSON[fd]||{};LESSON[fd][lv]=LESSON[fd][lv]||[];items.forEach(function(x){if(x.fig)SF(x.fig);LESSON[fd][lv].push(x);});}
LP('割合',4,[
 {h:'例題（増やす・減らすを掛け合わせる）',q:'ある遊園地で入場料金を'+m('20%')+'アップしたら入場者数が'+m('15%')+'減った。このとき入場料金の売上額は何%増加したか。'},
 {h:'ステップ1 内訳を探す',p:'売上額 ＝ 1人あたりの料金 × 入場者数（単位あたりの大きさ）。料金も人数もわからないので、前の料金と人数をどちらも<b>1</b>と置く。'},
 {h:'ステップ2 図に数字を入れる',p:'「'+m('20%')+'アップ」で料金は 1.2、「'+m('15%')+'減った」で人数は 0.85。',fig:TN4([TP('前','入場者 1','売上 1','1人',1,.5),TP('後','入場者 0.85','売上 ?','1人','1.2',.5,'v')])},
 {h:'ステップ3 計算',p:'③ ＝ ② × ①（1人あたり × 人数）',p2:'1.2 × 0.85 ＝ 1.02 → 1.02 − 1 ＝ 0.02 → <b>2.0%増加</b>'}]);
LP('割合',5,[
 {h:'例題（わからない人数を x と置く）',q:'ある美術館では、先週の土日の合計来場者数が'+m('600人')+'だった。今週の土曜日は先週の土曜日の'+m('5%')+'減だったが、今週の日曜日は先週の日曜日の'+m('25%')+'増となり、結局土日の合計では'+m('7%')+'増となった。今週の日曜日の来場者は何人だったか。'},
 {h:'ステップ1 内訳を探す',p:'先週・今週の合計を、それぞれ土曜日と日曜日に分ける。先週の日曜日がわからないので <b>x</b> と置くと、先週の土曜日は 600 − x。'},
 {h:'ステップ2 図に数字を入れる',p:'今週の合計は 600 × 1.07 ＝ 642。今週の土曜日は 0.95(600 − x)、日曜日は 1.25x。',fig:{rows:[[{n:'先週',v:'600人',w:1}],[{n:'土',v:'600 − x',w:.6},{n:'日',v:'x',w:.4}],[{n:'今週',r:'1.07',v:'642人',w:1}],[{n:'土',v:'0.95(600 − x)',w:.55},{n:'日',v:'1.25x',w:.45,ask:1}]]}},
 {h:'ステップ3 計算',p:'今週の土曜日＋日曜日 ＝ 今週の合計 の式を解く。',p2:'0.95(600 − x) ＋ 1.25x ＝ 642 → 0.3x ＝ 72 → x ＝ 240<br>今週の日曜日 240 × 1.25 ＝ <b>300人</b>'}]);
LP('損益',5,[
 {h:'例題（仕入れ値を x と置く）',q:'売値が'+m('100円')+'の商品Pの仕入れ値が'+m('15%')+'上がったために、利益が'+m('1割')+'減った。元の仕入れ値はいくらだったか。'},
 {h:'ステップ1 内訳を探す',p:'前と後の売値100円を、それぞれ仕入れ値と利益に分ける。元の仕入れ値を <b>x</b> と置く。'},
 {h:'ステップ2 図に数字を入れる',p:'前：仕入れ x、利益 100 − x。後：仕入れ 1.15x、利益は前の 0.9 倍で 0.9(100 − x)。',fig:{rows:[[{n:'前の売値',v:'100円',w:1}],[{n:'仕入れ',v:'x',w:.4,ask:1},{n:'利益',v:'100 − x',w:.6}],[{n:'後の売値',v:'100円',w:1}],[{n:'仕入れ',v:'1.15x',w:.46},{n:'利益',v:'0.9(100 − x)',w:.54}]]}},
 {h:'ステップ3 計算',p:'後の図で「売値 − 仕入れ ＝ 利益」。',p2:'100 − 1.15x ＝ 0.9(100 − x) → 0.25x ＝ 10 → x ＝ <b>40円</b>'},
 {h:'例題（割れる・売れ残る分がある）',q:'コーヒーカップを1個'+m('100円')+'で'+m('400個')+'仕入れた。このうちの'+m('1割')+'が割れたとしても、全体で'+m('1割')+'以上の利益が出るようにしたい。1個の定価をいくら以上に設定すればよいか。'},
 {h:'解き方',p:'必要な販売額（仕入れ＋利益）を、実際に売れる個数で割る（単位あたりの大きさ ② ＝ ③ ÷ ①）。割り切れないときは<b>切り上げる</b>。',
  fig:TN4([TP('売れる個数','360個','44000円以上','1個','?',1,'u')]),p2:'必要な販売額 40000 × 1.1 ＝ 44000、売れる個数 400 × 0.9 ＝ 360<br>44000 ÷ 360 ＝ 122.2… → <b>123円</b>以上'}]);
LP('単位あたりの大きさ',5,[
 {h:'例題（連泊の分け方で比べる）',q:'ある旅館では2泊以上泊まると料金が1泊目'+m('10%')+'、2泊目'+m('20%')+'、3泊目'+m('25%')+'、4泊目以降'+m('30%')+'引きとなる。1泊1人'+m('9000円')+'の部屋に1人で7泊したい。「7連泊」する場合と、「2連泊・5連泊」に分ける場合では、料金の差はいくらになるか。'},
 {h:'解き方',p:'料金を全部計算せず、1泊ごとの割引率を並べて<b>割引率の合計の差</b>だけを出す。',fig:{table:{head:['泊まり方','1泊ごとの割引','合計'],rows:[['7連泊','10・20・25・30・30・30・30','175%'],['2連泊','10・20','30%'],['5連泊','10・20・25・30・30','115%']]}},
  p2:'差 175 − (30 ＋ 115) ＝ 30% → 9000 × 0.3 ＝ <b>2700円</b>'},
 {h:'例題（回数券）',q:'入場券は x 円で、'+m('20枚')+'つづりの回数券が'+m('15x円')+'（余りは払い戻しなし）。'+m('50人')+'で入場するときの最も安い総額は。'},
 {h:'解き方',p:'回数券で入れる人数を先に使い、端数の人数は「バラで買う」と「もう1冊買う」を比べる。',p2:'回数券2冊（40人）30x ＋ バラ10人 10x ＝ 40x<br>回数券3冊 45x → 安いのは <b>40x円</b>'},
 {h:'例題（時間帯の料金から時刻を探す）',q:'1時間'+m('25000円')+'、9〜12時は20%引き、12〜15時は15%引き、15〜17時は10%引き。連続6時間で'+m('128750円')+'だった。何時から何時までか。'},
 {h:'解き方',p:'時間帯ごとの1時間あたりの料金を表にし、平均（合計 ÷ 時間）から当たりをつけて、選択肢を1つずつ確かめる。',fig:{table:{head:['時間帯','9〜12時','12〜15時','15〜17時','17〜24時'],rows:[['1時間あたり','20000','21250','22500','25000']]}},
  p2:'平均 128750 ÷ 6 ≒ 21458 → 12〜15時をまたぐ<br>11〜17時：20000 ＋ 21250 × 3 ＋ 22500 × 2 ＝ 128750 → <b>11〜17時</b>'},
 {h:'例題（仕事算：1時間あたりの仕事量を x・y と置く）',q:'XとYの2人では'+m('9時間')+'かかる作業を、X1人で'+m('3時間')+'したところ、残りにY1人で'+m('18時間')+'かかった。Y1人では何時間かかるか。'},
 {h:'解き方',p:'全体の仕事を1として、1時間あたりの仕事量を X：x、Y：y と置く（単位あたりの大きさ）。2つの式をつくり、x をそろえて消す。',fig:TN4([TP('X','3時間','','1時間','x',.35),TP('Y','18時間','','1時間','y',.65)],{r:'',v:'仕事全体 1'}),
  p2:'x ＋ y ＝ 1/9、3x ＋ 18y ＝ 1<br>上の式を3倍して引く 15y ＝ 1 − 3/9 ＝ 2/3 → y ＝ 2/45 → Y1人で 45/2 ＝ <b>22時間30分</b>'}]);
LP('精算',5,[
 {h:'例題（預かったお金があるとき）',q:'XがYから'+m('5000円')+'を預かって、Yのネクタイを1本買うことになった。Xは'+m('3500円')+'の青と'+m('3000円')+'のグレーを買い、Yが選ばなかった方を自分のものにする。もともとYはXから'+m('4000円')+'の借りがあった。Yが青を選んだとき、どのように精算すればよいか。'},
 {h:'解き方',p:'全員の表を作らず、<b>1人だけ</b>（ここではY）に注目する。預けたお金は「出した額」、借りはマイナス。',fig:{table:{head:['Y','金額'],rows:[['負担額（青）','3500'],['預けた額','5000'],['Xからの借り','4000'],['精算額','!−2500']]}},
  p2:'Yの精算額 3500 − 5000 ＋ 4000 ＝ 2500 → <b>YがXに2500円払う</b><br>間違った精算の損得を問われたら、正しい精算額と言われた精算額の差を出す'}]);
})();
