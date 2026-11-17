/* 表の解釈：数値を変える問題（テンプレート）。既存の問題（hyo_4.js・hyo_5.js）の文と構造はそのまま、数値だけ毎回変える。
   答え・選択肢・図・解説は数値から計算する。元の問題は残す。 */
(function(){
var H=BANK['表の解釈'],LV=null;
function k(x,d){var m=Math.pow(10,d==null?6:d);return Math.round(x*m)/m;}
function s(x){return String(k(x));}
function f1(x){return k(x,1).toFixed(1);}
function TB(head,rows){var t='<div class="tbl-wrap"><table class="tbl"><tr>';
 head.forEach(function(x){t+='<th>'+x+'</th>';});t+='</tr>';
 rows.forEach(function(r){t+='<tr>';r.forEach(function(x,i){t+=(i===0?'<th>':'<td>')+x+(i===0?'</th>':'</td>');});t+='</tr>';});
 return t+'</table></div>';}
/* 数値の選択肢：正解＋よくある間違い＋足りなければ正解±step。小さい順 */
function CH(ans,ws,fmt,step,d){d=d==null?6:d;ans=k(ans,d);var v=[ans];
 ws.forEach(function(w){w=k(w,d);if(v.length<5&&w>0&&v.indexOf(w)<0&&isFinite(w))v.push(w);});
 for(var i=1;v.length<5;i++)[ans+i*step,ans-i*step].forEach(function(w){w=k(w,d);if(v.length<5&&w>0&&v.indexOf(w)<0)v.push(w);});
 v.sort(function(a,b){return a-b;});return {c:v.map(fmt),a:v.indexOf(ans)};}
/* n個の整数（各m以上、合計N） */
function PART(R,n,N,m){var a=[],r=N;for(var i=0;i<n-1;i++){var v=R.int(m,r-m*(n-1-i));a.push(v);r-=v;}a.push(r);return R.shuffle(a);}
function PC(R,n,step,m){return PART(R,n,Math.round(100/step),Math.round(m/step)).map(function(x){return k(x*step,2);});}
function W(a){var t=a.reduce(function(x,y){return x+y;},0);return a.map(function(x){return k(x/t,3);});}
function HALF(x,d){var m=x*Math.pow(10,d);return Math.abs(Math.abs(m-Math.floor(m))-0.5)<1e-6;}
function Q(o,ch){o.c=ch.c;o.a=ch.a;return o;}
var IW={wari:'表の全体を、表の項目ごとに分ける（割合の図）',tan:'全体を表の項目ごとに分け、それぞれ「数 × 1あたりの大きさ」を出す（単位あたりの大きさの図）',
 kaj:'全体をグループごとに分け、それぞれ「人数 × 平均」で合計を出す（加重平均）',idx:'基準の年を1として、ほかの年を指数 ÷ 100 で表す（割合の図）',
 two:'全体を表の項目で分け（1回目）、その項目をさらに分ける（2回目）。割合の図を2段にする',diag:'昨年と一昨年の延べ入場者数を、それぞれ1日目と2日目に分ける（図が2本）。2日目でつなぐ'};
var RD2='（必要なときは、最後に小数点以下第2位を四捨五入すること）',RD3='（必要なときは、最後に小数点以下第3位を四捨五入すること）';

/* ---------- 指標4の型 ---------- */
/* 割合 × 全体（通学手段） */
function tShare(R){var T=R.pick([200,300,400,500,600]),p=PC(R,3,5,10),nm=['徒歩','自転車','バス'],x=T*p[1]/100;
 LV={k:'share',T:T,p:p[1]};
 return Q({q:'次の表は、ある学校の生徒'+T+'人の通学手段の割合を示したものである。'+TB(['通学手段','割合'],nm.map(function(n,i){return [n,p[i]+'%'];}))+'自転車で通学している生徒は何人か。',
  inw:IW.wari,fig:{rows:[[{n:'生徒',r:'1',v:T+'人',w:1}],nm.map(function(n,i){return {n:n,r:s(p[i]/100),v:i===1?'?':'',w:p[i]/100,ask:i===1?1:0};})]},
  calc:'自転車 ＝ '+T+' × '+s(p[1]/100)+' ＝ '+s(x)},CH(x,[p[1],T*p[0]/100,T*p[2]/100,x*2,T-x],function(v){return s(v)+'人';},10));}
/* 数 × 1あたり の合計 */
function tUnit(R,o){for(;;){var u=o.u(R),n=o.n(R),t=0,parts=[];u.forEach(function(x,i){t+=x*n[i];});if(o.ok&&!o.ok(t))continue;
 var w=W(u.map(function(x,i){return x*n[i];}));
 LV={k:'unit',u:u,n:n,uu:o.uu};
 return Q({q:o.q(u,n),inw:IW.tan,fig:{rows:[[{n:o.top(n),r:'',v:'?',w:1,ask:1}],o.nm.map(function(m,i){return {n:m,r:n[i]+o.nu+'×'+u[i]+o.uu,v:(u[i]*n[i])+o.uu,w:w[i]};})]},
  calc:o.nm.map(function(m,i){return m+' '+n[i]+' × '+u[i]+' ＝ '+u[i]*n[i];}).join('、')+'<br>合計 '+u.map(function(x,i){return x*n[i];}).join(' ＋ ')+' ＝ '+t},
  CH(t,[t-u[0]*n[0]+u[0],t+o.step*3],function(v){return v+o.uu;},o.step));}}
/* 加重平均（2〜3グループ） */
function tWavg(R,o){for(;;){var n=o.n(R),a=o.a(R),sum=0,N=0;n.forEach(function(x,i){sum+=x*a[i];N+=x;});var av=sum/N;
 if(o.d===0&&av!==Math.round(av))continue;if(o.d===1&&o.exact&&k(av*2,6)!==Math.round(av*2))continue;
 if(o.d===1&&HALF(av,1))continue;var ans=o.d===0?av:k(av,1),simple=a.reduce(function(x,y){return x+y;},0)/a.length,fm=o.d===0?function(v){return s(v)+o.u;}:function(v){return f1(v)+o.u;};
 if(o.d===1&&k(simple,1)===ans)continue;
 var w=W(n);
 LV={k:'wavg',n:n,a:a,d:o.d,u:o.u};
 return Q({q:o.q(n,a),inw:IW.kaj,fig:{rows:[[{n:'全体 '+N+'人',r:'平均?',v:k(sum,4)+o.u,w:1,ask:1}],o.nm.map(function(m,i){return {n:m,r:n[i]+'人×'+(o.fa?o.fa(a[i]):a[i]),v:k(n[i]*a[i],4)+o.u,w:w[i]};})]},
  calc:o.nm.map(function(m,i){return m+' '+n[i]+' × '+(o.fa?o.fa(a[i]):a[i])+' ＝ '+k(n[i]*a[i],4);}).join('、')+'<br>('+n.map(function(x,i){return k(x*a[i],4);}).join(' ＋ ')+') ÷ '+N+' ＝ '+(o.d===0||k(av,6)===ans?s(ans):k(av,3)+'… → '+f1(ans))},
  CH(ans,[simple,ans+o.st*2],fm,o.st,o.d===0?0:1));}}
/* 割合の逆算：A が x のとき B は（部署・水溶液） */
function tInv(R,o){for(;;){var p=o.p(R),g=o.g(R,p),T=g*100/p[o.gi],x=T*p[o.ai]/100;if(!o.okT(T)||!o.okX(x)||o.d&&HALF(x,1))continue;
 LV={k:'inv',p:p,g:g,gi:o.gi,ai:o.ai,d:o.d,u:o.u};
 return Q({q:o.q(p,g),inw:IW.wari,fig:{rows:[[{n:o.top,r:'1',v:s(T)+o.u,w:1}],o.nm.map(function(m,i){return {n:m,r:s(p[i]/100),v:i===o.gi?g+o.u:i===o.ai?'?':'',w:k(0.6/o.nm.length,2),ask:i===o.ai?1:0};}).concat(o.other?[{n:'その他',r:'',v:'',w:0.3}]:[])]},
  calc:o.top+' ＝ '+g+' ÷ '+s(p[o.gi]/100)+' ＝ '+s(T)+'<br>'+o.nm[o.ai]+' ＝ '+s(T)+' × '+s(p[o.ai]/100)+' ＝ '+(o.d?f1(x):s(x))},
  CH(x,[g*p[o.gi]/p[o.ai],T*(o.wi!=null?p[o.wi]:p[o.ai]*2)/100,x*2],function(v){return (o.d?f1(v):s(v))+o.u;},o.st,o.d?1:0));}}
/* 指数の年 */
function tIdx(R){var b=R.pick([200,300,400,500,600]),ix=R.shuffle([80,90,110,120,130,140,150,160]).slice(0,3),x=b*ix[1]/100;
 LV={k:'idx',b:b,i:ix[1]};
 return Q({q:'次の表は、ある商品の年ごとの売上個数を、2020年を100とした指数で示したものである。'+TB(['年','2020年','2021年','2022年','2023年'],[['指数','100'].concat(ix.map(String))])+'2020年の売上個数が'+b+'個のとき、2022年の売上個数は何個か。',
  inw:IW.idx,fig:{rows:[[{n:'2020年',r:'1',v:b+'個',w:1}],[{n:'2022年',r:s(ix[1]/100),v:'?',w:1,ask:1}]]},calc:'2022年 ＝ '+b+' × '+s(ix[1]/100)+' ＝ '+s(x)},
  CH(x,[b*ix[0]/100,b*ix[2]/100,b+ix[1],b*100/ix[1]],function(v){return s(v)+'個';},50,0));}
/* 2段の割合（北地区の65歳以上） */
function tTwoPct(R){for(;;){var pN=R.pick([20,30,40,60,70]),pa=R.pick([10,15,20,25,30,35]),pb=R.pick([10,15,20,25,30]),x=pN*pa/100;if(x!==Math.round(x)||pa===pb)continue;
 LV={k:'tp',pN:pN,pa:pa};
 return Q({q:'次の表は、ある市の住民の地区別の割合と、各地区の住民に占める65歳以上の人の割合を示したものである。'+TB(['地区','住民の割合','65歳以上の割合'],[['北地区',pN+'%',pa+'%'],['南地区',(100-pN)+'%',pb+'%']])+'北地区の65歳以上の人は、市の住民全体の何%か。',
  inw:'全体を表の項目で分け（1回目）、その項目をさらに分ける（2回目）。割合の図を2段にする',
  fig:{rows:[[{n:'住民',r:'1',v:'',w:1}],[{n:'北地区',r:s(pN/100),v:'',w:pN/100},{n:'南地区',r:s(1-pN/100),v:'',w:1-pN/100}],[{n:'65歳以上',r:s(pa/100),v:'?',w:k(pN*pa/10000,3),ask:1},{n:'その他',r:s(1-pa/100),v:'',w:k(pN/100-pN*pa/10000,3)},{n:'',r:'',v:'',w:1-pN/100}]]},
  calc:s(pN/100)+' × '+s(pa/100)+' ＝ '+s(x/100)+' ＝ '+s(x)+'%'},CH(x,[pa,pN,(100-pN)*pb/100,pa+pb],function(v){return s(v)+'%';},2,1));}}
/* 原子の重量の大きさ */
function tAtom(R,o){var nm=o.nm,wt=o.wt;for(;;){var p=o.p(R),v=p.map(function(x,i){return k(x*wt[i],2);}),srt=v.slice().sort(function(a,b){return b-a;});
 if(new Set(v).size<v.length)continue;var ai=v.indexOf(srt[o.rank]);
 LV={k:'atom',p:p,wt:wt,rank:o.rank,nm:nm};
 return {q:'次の表は、ある化合物Pに含まれる原子の個数の割合を示したものである。'+TB(['原子'].concat(nm),[['個数の割合'].concat(p.map(function(x){return (o.d1?x.toFixed(1):x)+'%';}))])+'化合物Pに含まれる原子のうち、重量の合計が'+o.ask+'ものはどれか。ただし、原子1個の重量の比は、'+nm.join('：')+'＝'+wt.join('：')+'とする。',
  c:o.c,a:ai,inw:IW.tan,fig:{rows:[[{n:'化合物P',r:'100個',v:'',w:1}],nm.map(function(m,i){return {n:m,r:p[i]+(o.ge?'個':'')+'×'+wt[i],v:s(v[i]),w:k(1/nm.length,2),ask:i===ai?1:0};})]},
  calc:'原子を100個とする<br>'+nm.map(function(m,i){return m+' '+(wt[i]===1?s(v[i]):p[i]+' × '+wt[i]+' ＝ '+s(v[i]));}).join('、')+'<br>'+o.ask2+'は'+nm[ai]};}}
/* 指数で並べかえ */
var MARK=['①','②','③','④'];
function tRank(R,o){for(;;){var p=o.p(R),ix=o.ix(R),v=p.map(function(x,i){return k(x*ix[i]/100,4);});if(new Set(v).size<4)continue;
 var ord=function(arr){return [0,1,2,3].sort(function(a,b){return arr[b]-arr[a];}).map(function(i){return MARK[i];}).join('');};
 var ans=ord(v),cand=[ans,ord(p),ord(ix)];if(new Set(p).size<4||new Set(ix).size<4)continue;
 var sw=function(i){var a=ans.split('');var t=a[i];a[i]=a[i+1];a[i+1]=t;return a.join('');};cand.push(sw(0),sw(1),sw(2),sw(0).split('').reverse().join(''));
 var c=[];cand.forEach(function(x){if(c.length<5&&c.indexOf(x)<0)c.push(x);});if(c.length<5)continue;c=R.shuffle(c);
 LV={k:'rank',p:p,ix:ix};
 return {q:'次の表は、X県の2020年の年齢層別の人口の割合と、2000年の各年齢層の人口を2020年を100とした指数で示したものである。'+TB(['年齢層','2020年の割合','2000年の指数'],o.ag.map(function(a,i){return [a,p[i]+'%',String(ix[i])];}))+'2000年のX県の人口を、年齢層の多い順に並べたものはどれか。',
  c:c,a:c.indexOf(ans),inw:IW.idx,fig:{table:{head:['年齢層','2020年','×指数','2000年'],rows:p.map(function(x,i){return [MARK[i],String(x),s(ix[i]/100),(MARK[i]===ans[0]?'!':'')+s(v[i])];})}},
  calc:'2020年の総人口を100とする<br>'+p.map(function(x,i){return MARK[i]+' '+x+' × '+s(ix[i]/100)+' ＝ '+s(v[i]);}).join('、')+'<br>多い順に '+ans};}}
var AG=['①0〜14歳','②15〜39歳','③40〜64歳','④65歳以上'];
/* 図が2本（イベントの2日目） */
function tDiag(R,o){for(;;){var T=o.T(R),p=o.p(R),q=o.q(R);if(p===q)continue;var d2=T*p/100,x=d2*100/q;if(d2!==Math.round(d2)||x!==Math.round(x)||x===T)continue;
 LV={k:'diag',T:T,p:p,q:q};
 return Q({q:'次の表は、2日間開かれるあるイベントの入場者数について、延べ入場者数と、1日目・2日目の割合を示したものである。'+TB(['','延べ入場者数','1日目','2日目'],[['昨年',T+'人',(100-p)+'%',p+'%'],['一昨年','ア',(100-q)+'%',q+'%']])+'一昨年の2日目の入場者数は、昨年の2日目の入場者数と同じであった。アに当てはまる数はいくつか。',
  inw:IW.diag,sec:90,fig:{rows:[[{n:'昨年',r:'1',v:T+'人',w:1},{n:'一昨年',r:'1',v:'?',w:1,ask:1}],[{n:'1日目',r:s(1-p/100),v:'',w:1-p/100},{n:'2日目',r:s(p/100),v:d2+'人',w:p/100},{n:'1日目',r:s(1-q/100),v:'',w:1-q/100},{n:'2日目',r:s(q/100),v:d2+'人',w:q/100}]]},
  calc:'昨年の2日目 '+T+' × '+s(p/100)+' ＝ '+d2+'<br>一昨年の2日目も'+d2+'人<br>ア ＝ '+d2+' ÷ '+s(q/100)+' ＝ '+x},
  CH(x,[T*q/100,d2*100/(100-q),T*(100-p)/(100-q),d2],function(v){return s(v)+'人';},o.st,0));}}
/* 混合気体（比重） */
function tGas(R,o){for(;;){var p=o.p(R),sg=o.sg(R),g=o.g(R),wt=p.map(function(x,i){return k(x*sg[i],4);}),ti=p.length-1,x=g*wt[ti]/wt[0];
 if(k(x,1)!==k(x,6)&&!o.r)continue;if(HALF(x,1))continue;if(new Set(sg).size<sg.length)continue;var ans=k(x,1);
 LV={k:'gas',p:p,sg:sg,g:g,r:o.r};
 return Q({q:'次の表は、混合気体Xに含まれる気体の体積百分率と、各気体の比重（同じ体積の重量の比）を示したものである。'+TB(['気体','体積百分率','比重'],o.nm.map(function(m,i){return [m,p[i]+'%',sg[i].toFixed(1)];}))+'混合気体Xに含まれるメタンの重量が'+g+'gのとき、'+o.nm[ti]+'の重量は何gか。'+(o.r?RD2:''),
  inw:IW.tan,fig:{rows:[[{n:'混合気体X',r:'体積100',v:'',w:1}],o.nm.map(function(m,i){return {n:m,r:p[i]+'×'+sg[i].toFixed(1),v:i===0?s(wt[0])+' → '+g+'g':i===ti?s(wt[ti])+' → ?':s(wt[i]),w:p[i]/100,ask:i===ti?1:0};})]},
  calc:'重量の比 メタン：'+o.nm[ti]+' ＝ '+p[0]+' × 1.0：'+p[ti]+' × '+sg[ti].toFixed(1)+' ＝ '+s(wt[0])+'：'+s(wt[ti])+'<br>'+o.nm[ti]+' ＝ '+g+' × '+s(wt[ti])+'/'+s(wt[0])+' ＝ '+(o.r?f1(ans):s(ans))},
  CH(ans,[g*p[ti]/p[0],g*sg[ti],g*wt[0]/wt[ti],ans*2],function(v){return (o.r?f1(v):s(v))+'g';},o.st,1));}}
/* 2段の割合の逆算（旅行アンケート） */
function tTwoInv(R,o){for(;;){var p=o.p(R),di=o.di,t=o.t(R),cnt=o.cnt(R),r=k(p[di]*t[o.ti]/10000,6),T=cnt/r;if(T!==Math.round(T)||T%10!==0)continue;
 LV={k:'ti',p:p[di],t:t[o.ti],cnt:cnt};
 return Q({q:'次の表は、ある旅行のアンケートで、行き先と、行き先'+o.dn[di]+'を選んだ人の交通手段を調べたものである。'+o.tb1(p)+TB([o.dn[di]+'の交通手段'].concat(o.tn),[['割合'].concat(t.map(function(x){return x+'%';}))])+o.dn[di]+'を選んで「'+o.tn[o.ti]+'」と答えた人が'+cnt+'人のとき、回答者全体は何人か。',
  inw:IW.two,fig:{rows:[[{n:'回答者',r:'1',v:'?',w:1,ask:1}],[{n:'ほか',r:s(1-p[di]/100),v:'',w:1-p[di]/100},{n:o.dn[di],r:s(p[di]/100),v:'',w:p[di]/100}],[{n:'',r:'',v:'',w:1-p[di]/100},{n:o.tn[o.ti],r:s(t[o.ti]/100),v:cnt+'人',w:p[di]/100}]]},
  calc:o.tn[o.ti]+'は全体の '+s(p[di]/100)+' × '+s(t[o.ti]/100)+' ＝ '+s(r)+'<br>回答者全体 ＝ '+cnt+' ÷ '+s(r)+' ＝ '+T},
  CH(T,[cnt*100/t[o.ti],cnt*100/p[di],T*2,T/2],function(v){return s(v)+'人';},o.st,0));}}
function tb1(dn){return function(p){return o1(dn,p);};}
function o1(dn,p){return TB(['行き先'].concat(dn),[['回答者の割合'].concat(p.map(function(x){return x+'%';}))]);}

/* ---------- 指標4 ---------- */
var B4=H[4];
B4.concept.push({id:'g-hyo4-c0',make:tShare});
B4.concept.push({id:'g-hyo4-c1',make:function(R){return tUnit(R,{u:function(R){return R.shuffle([10,20,30,40,50]).slice(0,3);},n:function(R){return [R.int(2,10),R.int(2,10),R.int(2,10)];},
 nm:['P','Q','R'],nu:'個',uu:'g',step:50,top:function(){return '合計';},
 q:function(u,n){return '次の表は、ある店で売っている商品P、Q、Rの1個あたりの重さを示したものである。'+TB(['商品','1個あたりの重さ'],[['P',u[0]+'g'],['Q',u[1]+'g'],['R',u[2]+'g']])+'Pを'+n[0]+'個、Qを'+n[1]+'個、Rを'+n[2]+'個買ったとき、重さの合計は何gか。';}});}});
B4.concept.push({id:'g-hyo4-c2',make:function(R){return tWavg(R,{n:function(R){return R.shuffle([10,20,30,40]).slice(0,2);},a:function(R){return R.shuffle([50,55,60,65,70,75,80]).slice(0,2);},d:0,u:'点',st:1,nm:['P','Q'],
 q:function(n,a){return '次の表は、ある試験のPクラスとQクラスの受験者数と平均点を示したものである。'+TB(['クラス','受験者数','平均点'],[['P',n[0]+'人',a[0]+'点'],['Q',n[1]+'人',a[1]+'点']])+'PクラスとQクラスを合わせた平均点は何点か。';}});}});
B4.practice.push({id:'g-hyo4-p0',make:function(R){return tInv(R,{p:function(R){return PC(R,3,5,10);},g:function(R,p){return R.pick([100,200,300,400,500,600])*p[1]/100;},gi:1,ai:0,wi:2,top:'社員',nm:['営業部','開発部','総務部'],u:'人',st:10,
 okT:function(T){return T===Math.round(T);},okX:function(x){return x===Math.round(x);},
 q:function(p,g){return '次の表は、ある会社の社員の部署別の割合を示したものである。'+TB(['部署','割合'],[['営業部',p[0]+'%'],['開発部',p[1]+'%'],['総務部',p[2]+'%']])+'開発部の社員が'+g+'人のとき、営業部の社員は何人か。';}});}});
B4.practice.push({id:'g-hyo4-p1',make:tIdx});
B4.practice.push({id:'g-hyo4-p2',make:tTwoPct});
B4.practice.push({id:'g-hyo4-p3',make:function(R){return tUnit(R,{u:function(R){return R.shuffle([100,200,300,400,500,600]).slice(0,3);},n:function(R){return [R.pick([10,15,20,25,30]),R.pick([10,15,20,25,30]),R.pick([10,15,20,25,30])];},
 nm:['P','Q','R'],nu:'人',uu:'円',step:1000,top:function(n){return '合計 '+(n[0]+n[1]+n[2])+'人';},
 q:function(u,n){return '次の表は、ある路線でS駅で降りた人の乗車駅別の人数と、各駅からS駅までの運賃を示したものである。'+TB(['乗車駅','人数','S駅までの運賃'],[['P駅',n[0]+'人',u[0]+'円'],['Q駅',n[1]+'人',u[1]+'円'],['R駅',n[2]+'人',u[2]+'円']])+'S駅で降りた人が支払った運賃の合計は何円か。';}});}});
B4.practice.push({id:'g-hyo4-p4',make:function(R){return tWavg(R,{n:function(R){return [R.pick([10,20,30]),R.pick([10,20,30]),R.pick([10,20,30])];},a:function(R){return R.shuffle([28,30,32,34,36,38,40,42,44]).slice(0,3);},d:1,exact:1,u:'歳',st:0.5,nm:['A','B','C'],
 q:function(n,a){return '次の表は、ある会社のA、B、Cの3つの部署の社員数と平均年齢を示したものである。'+TB(['部署','社員数','平均年齢'],[['A',n[0]+'人',a[0]+'歳'],['B',n[1]+'人',a[1]+'歳'],['C',n[2]+'人',a[2]+'歳']])+'3つの部署を合わせた社員の平均年齢は何歳か。'+RD2;}});}});
B4.practice.push({id:'g-hyo4-p5',make:function(R){return tInv(R,{p:function(R){return R.shuffle([1,2,3,4,5,6,8]).slice(0,3);},g:function(R,p){return p[0]*R.int(3,10);},gi:0,ai:1,wi:2,top:'水溶液X',nm:['a','b','c'],other:1,u:'g',st:2,
 okT:function(){return true;},okX:function(x){return x===Math.round(x);},
 q:function(p,g){return '次の表は、水溶液Xに含まれる薬品a、b、cの重量百分率を示したものである。'+TB(['薬品','a','b','c'],[['重量百分率',p[0]+'%',p[1]+'%',p[2]+'%']])+'水溶液Xに含まれる薬品aが'+g+'gのとき、薬品bは何gか。';}});}});
B4.applied.push({id:'g-hyo4-a0',make:function(R){for(;;){var T=R.pick([400,500,600,800]),p=PC(R,4,5,10);if(p[0]<=p[3])continue;var a=T*p[0]/100,b=T*p[3]/100,x=a-b;LV={k:'diff',T:T,a:p[0],b:p[3]};
 return Q({q:'次の表は、ある会社の4つの支店P、Q、R、Sの社員数の割合を示したものである。'+TB(['支店','P','Q','R','S'],[['割合'].concat(p.map(function(v){return v+'%';}))])+'全社員が'+T+'人のとき、P支店の社員はS支店の社員より何人多いか。',
  inw:IW.wari,fig:{rows:[[{n:'全社員',r:'1',v:T+'人',w:1}],['P','Q','R','S'].map(function(m,i){return {n:m,r:s(p[i]/100),v:i===0?a+'人':i===3?b+'人':'',w:p[i]/100};})]},
  calc:'P '+T+' × '+s(p[0]/100)+' ＝ '+a+'、S '+T+' × '+s(p[3]/100)+' ＝ '+b+'<br>'+a+' − '+b+' ＝ '+x},CH(x,[a,b,p[0]-p[3],a+b],function(v){return s(v)+'人';},30,0));}}});
var ATC=['水素','炭素','酸素','水素と炭素が同じ','炭素と酸素が同じ'];
B4.applied.push({id:'g-hyo4-a1',make:function(R){return tAtom(R,{nm:['水素','炭素','酸素'],wt:[1,12,16],rank:0,ask:'最も大きい',ask2:'最も大きいの',c:ATC,ge:1,p:function(R){return PC(R,3,5,10);}});}});
B4.applied.push({id:'g-hyo4-a2',make:function(R){return tRank(R,{ag:AG,p:function(R){return PC(R,4,5,10);},ix:function(R){return R.shuffle([50,60,75,80,90,110,120,125,130,140,150]).slice(0,4);}});}});
B4.applied.push({id:'g-hyo4-a3',make:function(R){return tDiag(R,{T:function(R){return R.pick([1600,2000,2400,3000,3200]);},p:function(R){return R.pick([30,40,50,60]);},q:function(R){return R.pick([40,50,60,80]);},st:200});}});
B4.applied.push({id:'g-hyo4-a4',make:function(R){return tWavg(R,{n:function(R){return [R.pick([10,20,30]),R.pick([10,20,30]),R.pick([10,20,30])];},a:function(R){return R.shuffle([56,58,60,62,64,66,68,70,72]).slice(0,3);},d:1,exact:1,u:'点',st:0.5,nm:['P','Q','R'],fa:function(x){return x;},
 q:function(n,a){return '次の表は、ある試験の物理のクラス別の受験者数と平均点を示したものである。'+TB(['クラス','受験者数','平均点'],[['P',n[0]+'人',f1(a[0])+'点'],['Q',n[1]+'人',f1(a[1])+'点'],['R',n[2]+'人',f1(a[2])+'点']])+'物理の3クラス全体の平均点は何点か。'+RD2;}});}});
B4.applied.push({id:'g-hyo4-a5',make:function(R){return tGas(R,{nm:['メタン','エタン'],p:function(R){var m=R.pick([60,70,75,80]);return [m,100-m];},sg:function(R){return [1.0,R.pick([1.5,2.0,2.5,3.0])];},g:function(R){return R.pick([20,30,40,45,60]);},st:5});}});
B4.applied.push({id:'g-hyo4-a6',make:function(R){return tTwoInv(R,{dn:['W','X','Y'],di:1,tn:['車','バス','電車'],ti:2,st:100,tb1:function(p){return TB(['行き先','回答者の割合'],[['W',p[0]+'%'],['X',p[1]+'%'],['Y',p[2]+'%']]);},
 p:function(R){return PC(R,3,10,10);},t:function(R){return PC(R,3,10,10);},cnt:function(R){return R.pick([20,30,40,50,60,80]);}});}});
B4.applied.push({id:'g-hyo4-a7',make:function(R){for(;;){var n=[R.int(4,10)*10,R.int(4,10)*10,R.int(4,10)*10],sm=n[0]+n[1]+n[2];if(sm%3)continue;var x=sm/3,sec=['P→Q','Q→R','R→S'];LV={k:'ravg',n:n};
 return Q({q:'次の表は、ある路線の電車1両の区間ごとの乗車人数を示したものである。'+TB(['区間'].concat(sec),[['乗車人数'].concat(n.map(function(v){return v+'人';}))])+'この電車1両の定員を100人とするとき、3つの区間の乗車率の平均は何%か。なお、乗車率は乗車人数を定員で割ったものとする。',
  inw:'区間ごとに「乗車人数 ÷ 定員」で乗車率を出す（割合の図）',fig:{table:{head:['区間','乗車人数','÷定員','乗車率'],rows:sec.map(function(m,i){return [m,String(n[i]),'100',s(n[i]/100)];}).concat([['平均','','','!'+s(x/100)]])}},
  calc:sec.map(function(m,i){return m+' '+s(n[i]/100);}).join('、')+'<br>('+n.map(function(v){return s(v/100);}).join(' ＋ ')+') ÷ 3 ＝ '+s(x/100)+' ＝ '+s(x)+'%'},
  CH(x,[Math.max.apply(null,n),Math.min.apply(null,n),sm/2],function(v){return s(v)+'%';},5,0));}}});
/* 実践（実際の数値） */
B4.real.push({id:'g-hyo4-r0',make:function(R){return tAtom(R,{nm:['水素','炭素','酸素','窒素'],wt:[1,12,16,14],rank:1,ask:'2番目に大きい',ask2:'2番目',c:['水素','炭素','酸素','窒素','水素と酸素が同じ'],d1:1,
 p:function(R){var h=R.int(550,650),c=R.int(180,260),o=R.int(80,150),n=1000-h-c-o;if(n<20)n=20,o=1000-h-c-n;return [h,c,o,n].map(function(x){return k(x/10,1);});}});}});
B4.real.push({id:'g-hyo4-r1',make:function(R){return tInv(R,{p:function(R){return [R.pick([1.5,2,2.5,3,3.5]),R.pick([1.2,1.5,1.8]),R.pick([0.4,0.6,0.8,1.2])];},g:function(R,p){return R.pick([15,20,24,30,36,45]);},gi:0,ai:2,wi:1,top:'水溶液Y',nm:['a','b','c'],other:1,u:'g',st:1.2,d:1,
 okT:function(T){return T===Math.round(T);},okX:function(){return true;},
 q:function(p,g){return '次の表は、水溶液Yに含まれる薬品a、b、cの重量百分率を示したものである。'+TB(['薬品','a','b','c'],[['重量百分率',p[0]+'%',p[1]+'%',p[2]+'%']])+'水溶液Yに含まれる薬品aが'+g+'gのとき、薬品cは何gか。'+RD2;}});}});
B4.real.push({id:'g-hyo4-r2',make:function(R){return tRank(R,{ag:AG,p:function(R){return PC(R,4,1,12);},ix:function(R){return R.shuffle([55,60,65,70,80,85,90,95,105,110,115,120,125,130]).slice(0,4);}});}});
B4.real.push({id:'g-hyo4-r3',make:function(R){return tWavg(R,{n:function(R){return [R.int(8,20),R.int(8,20),R.int(8,20)];},a:function(R){return R.shuffle([64.5,65.5,66.0,67.5,68.5,70.0,71.5,72.0,73.5]).slice(0,3);},d:1,u:'点',st:0.4,nm:['物理','化学','生物'],fa:f1,
 q:function(n,a){return '次の表は、ある試験のQクラスの科目別の受験者数と平均点を示したものである。なお、受験者は3科目のうち1科目だけを受験した。'+TB(['科目','受験者数','平均点'],[['物理',n[0]+'人',f1(a[0])+'点'],['化学',n[1]+'人',f1(a[1])+'点'],['生物',n[2]+'人',f1(a[2])+'点']])+'Qクラスの3科目を合わせた平均点は何点か。'+RD2;}});}});
B4.real.push({id:'g-hyo4-r4',make:function(R){return tDiag(R,{T:function(R){return R.int(12,20)*200;},p:function(R){return R.pick([35,40,45,55,60]);},q:function(R){return R.pick([40,45,48,50,60,64]);},st:240});}});
B4.real.push({id:'g-hyo4-r5',make:function(R){return tUnit(R,{u:function(R){return R.shuffle([240,360,480,600,720,840,960]).slice(0,3);},n:function(R){return [R.int(12,35),R.int(12,35),R.int(12,35)];},
 nm:['P','Q','R'],nu:'人',uu:'円',step:2400,top:function(n){return '合計 '+(n[0]+n[1]+n[2])+'人';},
 q:function(u,n){return '次の表は、ある路線でS駅で降りた人の乗車駅別の人数と、各駅からS駅までの運賃を示したものである。'+TB(['乗車駅','人数','S駅までの運賃'],[['P駅',n[0]+'人',u[0]+'円'],['Q駅',n[1]+'人',u[1]+'円'],['R駅',n[2]+'人',u[2]+'円']])+'S駅で降りた人が支払った運賃の合計は何円か。';}});}});
B4.real.push({id:'g-hyo4-r6',make:function r6(R){var p=PC(R,4,1,12),t=PC(R,3,5,15),x=k(p[2]*t[2]/100,2),ans=k(x,1),dn=['W','X','Y','Z'];if(HALF(p[2]*t[2]/100,1))return r6(R);LV={k:'r6',p:p[2],t:t[2]};
 return Q({q:'次の表は、ある旅行のアンケートで、行き先と、行き先Yを選んだ人の交通手段を調べたものである。'+o1(dn,p)+TB(['Yの交通手段','車','バス','電車'],[['割合'].concat(t.map(function(v){return v+'%';}))])+'Yを選んで「電車」と答えた人は、回答者全体の何%か。'+RD2,
  inw:IW.two,fig:{rows:[[{n:'回答者',r:'1',v:'',w:1}],dn.map(function(m,i){return {n:m,r:s(p[i]/100),v:'',w:p[i]/100};}),[{n:'',r:'',v:'',w:(p[0]+p[1])/100},{n:'車・バス',r:s(1-t[2]/100),v:'',w:k(p[2]*(100-t[2])/10000,3)},{n:'電車',r:s(t[2]/100),v:'?',w:k(p[2]*t[2]/10000,3),ask:1},{n:'',r:'',v:'',w:p[3]/100}]]},
  calc:s(p[2]/100)+' × '+s(t[2]/100)+' ＝ '+s(x/100)+' ＝ '+(ans===x?f1(x):s(x)+' → '+f1(ans))+'%'},CH(ans,[p[3]*t[2]/100,p[2]*t[1]/100,p[2]*t[0]/100,ans*1.5],function(v){return f1(v)+'%';},1.4,1));}});
B4.real.push({id:'g-hyo4-r7',make:function(R){return tGas(R,{nm:['メタン','エタン','プロパン'],r:1,p:function(R){var m=R.pick([70,75,80]),e=R.pick([10,12,15]);return [m,e,100-m-e];},sg:function(R){return [1.0,R.pick([1.8,1.9]),R.pick([2.6,2.8,3.2])];},g:function(R){return R.pick([30,36,40,45,48,54]);},st:4.2});}});
B4.real.push({id:'g-hyo4-r8',make:function(R){return tTwoInv(R,{dn:['W','X','Y','Z'],di:3,tn:['乗用車','バス','電車','その他'],ti:3,st:300,tb1:tb1(['W','X','Y','Z']),
 p:function(R){return PC(R,4,5,10);},t:function(R){return PC(R,4,2,8);},cnt:function(R){return R.int(2,9)*6;}});}});
B4.real.push({id:'g-hyo4-r9',make:function(R){return tWavg(R,{n:function(R){return [R.pick([15,20,25]),R.pick([15,20,25]),R.pick([15,20,25])];},a:function(R){return R.shuffle([64.8,66.0,67.2,68.4,69.5,70.7,71.6]).slice(0,3);},d:1,u:'点',st:0.4,nm:['P','Q','R'],fa:f1,
 q:function(n,a){return '次の表は、ある試験の化学のクラス別の受験者数と平均点を示したものである。'+TB(['クラス','受験者数','平均点'],[['P',n[0]+'人',f1(a[0])+'点'],['Q',n[1]+'人',f1(a[1])+'点'],['R',n[2]+'人',f1(a[2])+'点']])+'化学の3クラス全体の平均点は何点か。'+RD2;}});}});

/* ---------- 指標5の型 ---------- */
/* 化合物QとR：窒素の数が「同じ」「1/2」 */
function tComp(R,o){for(;;){var cq=o.c(R),nq=o.n(R),cr=o.c(R),nr=o.n(R);if(nq===nr)continue;var y=k(nq*o.f/nr,6);if(o.nice&&k(y,2)!==y)continue;if(HALF(cr*nq*o.f/(cq*nr),2))continue;y=y,cx=k(cr*y/100,6),ans=k(cx/(cq/100),o.d);
 if(o.nice&&k(ans,6)!==k(ans,2))continue;if(o.nice&&!(ans*4===Math.round(ans*4)||ans*100===Math.round(ans*100)))continue;if(ans<=0)continue;
 var fm=function(v){return (o.d===2?k(v,2).toFixed(2):s(v))+'倍';};
 LV={k:'comp',cq:cq,nq:nq,cr:cr,nr:nr,f:o.f,d:o.d};
 return Q({q:'次の表は、化合物QとRに含まれる原子の個数の割合を示したものである。'+TB(['化合物','炭素','窒素'],[['Q',cq+'%',nq+'%'],['R',cr+'%',nr+'%']])+'化合物Rに含まれる窒素原子の数が、化合物Qに含まれる窒素原子の数'+o.t+'とき、化合物Rに含まれる炭素原子の数は、化合物Qに含まれる炭素原子の数の何倍か。'+(o.d===2?RD3:''),
  inw:'2つの全体をそれぞれ表の項目で分ける（図が2本）。値のない全体を x と置き、問題文の「同じ」「〜分の1」で2本をつなぐ',sec:o.sec,
  fig:{rows:[[{n:'Q',r:'1',v:'x',w:1},{n:'R',r:'1',v:'y',w:1}],[{n:'炭素',r:s(cq/100),v:s(cq/100)+'x',w:0.5},{n:'窒素',r:s(nq/100),v:s(nq/100)+'x',w:0.5},{n:'炭素',r:s(cr/100),v:'?',w:0.5,ask:1},{n:'窒素',r:s(nr/100),v:s(nr/100)+'y',w:0.5}]]},
  calc:'Qの原子を x、Rの原子を y と置く<br>'+s(nr/100)+'y ＝ '+s(nq/100)+'x'+(o.f===1?'':' × 1/2')+' → y ＝ '+s(y)+'x<br>Rの炭素 '+s(cr/100)+' × '+s(y)+'x ＝ '+s(cx)+'x、Qの炭素 '+s(cq/100)+'x<br>'+s(cx)+'x ÷ '+s(cq/100)+'x ＝ '+(o.d===2?k(ans,2).toFixed(2):s(ans))},
  CH(ans,[cr/cq,nq/nr,nr/nq,cq/cr,ans*2],fm,o.d===2?0.05:0.5,2));}}
/* 混ぜて同じ濃度に */
function gcd(a,b){return b?gcd(b,a%b):a;}
function tMix(R,o){for(;;){var x=o.x(R),y=o.y(R),z=o.z(R);if(!(x<z&&z<y))continue;var A=k((y-z)*10,6),Bv=k((z-x)*10,6),g=gcd(Math.round(A),Math.round(Bv)),a=Math.round(A)/g,b=Math.round(Bv)/g;if(a>3||b>3)continue;
 var pool=[[1,3],[1,2],[2,3],[1,1],[3,2],[2,1],[3,1]],ans=a+':'+b,c=pool.filter(function(p){return p[0]+':'+p[1]!==ans;});c=R.shuffle(c).slice(0,4).concat([[a,b]]);c.sort(function(p,q){return p[0]/p[1]-q[0]/q[1];});
 c=c.map(function(p){return 'X:Y='+p[0]+':'+p[1];});
 LV={k:'mix',x:x,y:y,z:z};
 return {q:'次の表は、水溶液X、Y、Zに含まれる薬品dの重量百分率を示したものである。'+TB(['水溶液','X','Y','Z'],[['薬品dの重量百分率',x+'%',y+'%',z+'%']])+'水溶液XとYを混ぜて、薬品dの重量百分率を水溶液Zと同じにしたい。XとYを重さで何対何の割合で混ぜればよいか。',
  c:c,a:c.indexOf('X:Y='+ans),inw:'XとYを混ぜた全体を、Xの分とYの分に分ける（加重平均）。重さを x、y と置いて方程式にする',
  fig:{rows:[[{n:'混ぜた水溶液',r:z+'%',v:'x＋y',w:1}],[{n:'X',r:x+'%',v:'x',w:0.5},{n:'Y',r:y+'%',v:'y',w:0.5}]]},
  calc:(x===1?'':x)+'x ＋ '+y+'y ＝ '+z+'(x ＋ y)<br>'+s(z-x)+'x ＝ '+s(y-z)+'y<br>x:y ＝ '+ans+'<br>（%の数字のまま計算してよい）'};}}
/* 分からない人数（加重平均の逆算） */
function tMiss(R,o){for(;;){var N=o.N(R),n1=o.n1(R),x=o.x(R),a=o.a(R);if(N-n1-x<5||a[1]===a[2])continue;var sum=n1*a[0]+a[1]*(N-n1-x)+a[2]*x,A=sum/N;if(k(A*10,6)!==Math.round(A*10))continue;
 var rest=N-n1,cst=n1*a[0]+a[1]*rest,co=a[2]-a[1];
 LV={k:'miss',N:N,n1:n1,a:a,A:A};
 return Q({q:'次の表は、ある試験の'+o.cl+'クラスの科目別の受験者数と平均点を示したものである。なお、受験者は3科目のうち1科目だけを受験した。'+TB(['科目','受験者数','平均点'],[['物理',n1+'人',f1(a[0])+'点'],['化学','',f1(a[1])+'点'],['生物','ア',f1(a[2])+'点'],['合計',N+'人',f1(A)+'点']])+'アに当てはまる数はいくつか。',
  inw:'全体をグループごとに分け、「人数 × 平均」の合計が全体の合計になる（加重平均）。分からない人数を x と置く',
  fig:{rows:[[{n:o.cl+'クラス '+N+'人',r:'平均'+s(A),v:s(sum)+'点',w:1}],[{n:'物理',r:n1+'人×'+s(a[0]),v:s(n1*a[0])+'点',w:0.3},{n:'化学',r:'('+rest+'−x)人×'+s(a[1]),v:'',w:0.4},{n:'生物',r:'x人×'+s(a[2]),v:'',w:0.3,ask:1}]]},
  calc:s(n1*a[0])+' ＋ '+s(a[1])+'('+rest+' − x) ＋ '+s(a[2])+'x ＝ '+N+' × '+s(A)+' ＝ '+s(sum)+'<br>'+s(cst)+' '+(co>0?'＋ '+s(co):'− '+s(-co))+'x ＝ '+s(sum)+'<br>x ＝ '+x},
  CH(x,[rest-x],function(v){return v+'人';},1,0));}}
/* 1日券・2日券 */
function tTicket(R,o){for(;;){var x=o.x(R),p=o.p(R),O=o.O(R),D=k(O+x*(1+p/100),6);if(D!==Math.round(D))continue;var c=k(1+p/100,4);
 LV={k:'tk',D:D,O:O,p:p};
 return Q({q:'次の表は、2日間開かれるあるイベントの今年の入場者数を示したものである。1日券では1日だけ、2日券では2日とも入場できる。'+TB(['','延べ入場者数','1日券の購入者数','2日券の購入者数'],[['今年',D+'人',O+'人','ウ']])+'今年の2日券の購入者のうち、'+p+'%は2日とも入場し、残りは1日だけ入場した。また、1日券の購入者は全員入場した。ウに当てはまる数はいくつか。',
  inw:'延べ人数を、券の種類ごとに「人数 × 1人あたりの入場回数」に分ける（単位あたりの大きさ）。分からない人数を x と置く',
  fig:{rows:[[{n:'延べ',r:'',v:D+'人',w:1}],[{n:'1日券',r:O+'人×1回',v:O+'人',w:0.45},{n:'2日券 x人',r:s(p/100)+'x×2回 ＋ '+s(1-p/100)+'x×1回',v:s(c)+'x',w:0.55,ask:1}]]},
  calc:'2日券の購入者を x と置く<br>'+O+' ＋ '+s(p/100)+'x × 2 ＋ '+s(1-p/100)+'x × 1 ＝ '+D+'<br>'+s(c)+'x ＝ '+(D-O)+'<br>x ＝ '+x},
  CH(x,[(D-O)/2,D-O,(D-O)/(1+p/100*2)],function(v){return s(v)+'人';},o.st,0));}}
/* 10年前の割合 */
var F1=[['4/5',0.8],['3/4',0.75]],F2=[['2倍',2],['1.25倍',1.25],['1.4倍',1.4],['1.5倍',1.5]];
function tPast(R,o){for(;;){var a=o.a(R),c=o.c(R),b=100-a-c,f=R.pick(F1),g=R.pick(F2),pa=k(a/f[1],4),pc=k(c/g[1],4),T=k(pa+b+pc,4),ans=k(pc/T*100,1);if(HALF(c*f[1]/(a*g[1]+b*f[1]*g[1]+c*f[1])*100,1))continue;
 if(o.nice&&(pa!==Math.round(pa)||pc!==Math.round(pc)))continue;if(b<40)continue;
 LV={k:'past',a:a,b:b,c:c,f:f[1],g:g[1]};
 return Q({q:'次の表は、Y県の現在の年齢層別の人口の割合を示したものである。'+TB(['年齢層','0〜14歳','15〜64歳','65歳以上'],[['人口の割合',a+'%',b+'%',c+'%']])+'10年前と比べると、0〜14歳の人口は10年前の'+f[0]+'、65歳以上の人口は10年前の'+g[0]+'になり、15〜64歳の人口は変わっていない。10年前のY県の人口に占める65歳以上の人の割合は何%か。'+RD2,
  inw:'現在の全体を100と置き、年齢層ごとに10年前の人数を出す。10年前の全体はその合計',
  fig:{table:{head:['年齢層','現在','10年前'],rows:[['0〜14歳',String(a),s(pa)],['15〜64歳',String(b),String(b)],['65歳以上',String(c),'!'+s(pc)],['合計','100',s(T)]]}},
  calc:'現在の人口を100とする<br>0〜14歳 '+a+' ÷ '+s(f[1])+' ＝ '+s(pa)+'、65歳以上 '+c+' ÷ '+s(g[1])+' ＝ '+s(pc)+'<br>10年前の人口 '+s(pa)+' ＋ '+b+' ＋ '+s(pc)+' ＝ '+s(T)+'<br>'+s(pc)+' ÷ '+s(T)+' ＝ '+f1(ans)+'%'},
  CH(ans,[c,pc,k(pc/(a+b+pc)*100,1),k(c/T*100,1)],function(v){return f1(v)+'%';},0.6,1));}}
/* 連立（薬品aとc） */
function tSim(R,o){for(;;){var a1=o.p(R),c1=o.p(R),a2=o.p(R),c2=o.p(R),x=o.x(R),y=o.x(R);if(k(a1*c2-a2*c1,6)===0||x===y)continue;var A=k((a1*x+a2*y)/100,6),C=k((c1*x+c2*y)/100,6);
 if(A!==k(A,1)||C!==k(C,1)||o.nice&&(A!==Math.round(A)||C!==Math.round(C)))continue;
 var t=function(m,v){return (m===1?'':s(m))+v;};
 LV={k:'sim',a1:a1,c1:c1,a2:a2,c2:c2,A:A,C:C};
 return Q({q:'次の表は、水溶液XとYに含まれる薬品aと薬品cの重量百分率を示したものである。'+TB(['水溶液','薬品a','薬品c'],[['X',a1+'%',c1+'%'],['Y',a2+'%',c2+'%']])+'水溶液XとYを混ぜて水溶液Pを作ったところ、Pに含まれる薬品aは'+s(A)+'g、薬品cは'+s(C)+'gであった。混ぜた水溶液Xは何gか。',
  inw:'薬品ごとに、混ぜた全体をXの分とYの分に分ける（図が2本）。x、y が両方の図に共通なので連立方程式にする',sec:90,
  fig:{rows:[[{n:'a '+s(A)+'g',r:'',v:'',w:1},{n:'c '+s(C)+'g',r:'',v:'',w:1}],[{n:'X',r:a1+'%',v:'x',w:0.5,ask:1},{n:'Y',r:a2+'%',v:'y',w:0.5},{n:'X',r:c1+'%',v:'x',w:0.5},{n:'Y',r:c2+'%',v:'y',w:0.5}]]},
  calc:'a：'+t(a1,'x')+' ＋ '+t(a2,'y')+' ＝ '+s(A*100)+'<br>c：'+t(c1,'x')+' ＋ '+t(c2,'y')+' ＝ '+s(C*100)+'<br>（両辺を100倍して%の数字のまま計算）<br>x ＝ '+x+'、y ＝ '+y},
  CH(x,[y,x+y],function(v){return s(v)+'g';},o.st,0));}}
/* 2段の割合の比（何倍か） */
function tRatio(R,o){for(;;){var p=o.p(R),i=o.i,j=o.j,b=[o.b(R),o.b(R)];var u=k(p[i]*b[0]/10000,6),v=k(p[j]*b[1]/10000,6),ans=k(u/v,o.d);if(HALF(p[i]*b[0]/(p[j]*b[1]),o.d))continue;if(ans<=0||ans===1)continue;if(o.nice&&k(u/v,6)!==ans)continue;
 var fm=function(z){return k(z,o.d).toFixed(o.d)+'倍';},dn=o.dn;
 LV={k:'rat',pi:p[i],pj:p[j],b0:b[0],b1:b[1],d:o.d};
 return Q({q:'ある旅行のアンケートで、行き先と交通手段を尋ねた。次の表は、行き先ごとの回答者の割合と、'+dn[i]+'と'+dn[j]+'を選んだ人のうち「'+o.t+'」と答えた人の割合を示したものである。'+o1(dn,p)+TB(['行き先',dn[i],dn[j]],[['「'+o.t+'」と答えた人の割合',b[0]+'%',b[1]+'%']])+dn[i]+'を選んで「'+o.t+'」と答えた人は、'+dn[j]+'を選んで「'+o.t+'」と答えた人の何倍か。'+(o.d===2?RD3:RD2),
  inw:'回答者全体を x と置き、行き先で分け（1回目）、さらに交通手段で分ける（2回目）。x は最後に消える',sec:90,
  fig:{rows:[[{n:'回答者',r:'1',v:'x',w:1}],[{n:dn[i],r:s(p[i]/100),v:'',w:0.5},{n:dn[j],r:s(p[j]/100),v:'',w:0.5}],[{n:o.t,r:s(b[0]/100),v:s(u)+'x',w:0.5,ask:1},{n:o.t,r:s(b[1]/100),v:s(v)+'x',w:0.5}]]},
  calc:'回答者全体を x と置く<br>'+dn[i]+'：'+s(p[i]/100)+' × '+s(b[0]/100)+' ＝ '+s(u)+'x<br>'+dn[j]+'：'+s(p[j]/100)+' × '+s(b[1]/100)+' ＝ '+s(v)+'x<br>'+s(u)+'x ÷ '+s(v)+'x ＝ '+(k(u/v,6)===ans?s(ans):k(u/v,4)+'… → '+fm(ans).replace('倍',''))},
  CH(ans,[b[0]/b[1],p[i]/p[j],v/u],fm,o.d===2?0.25:0.5,o.d));}}
/* 分からない割合（全体の割合から） */
function tRate(R,o){for(;;){var p=o.p(R),r=o.r(R),x=o.x(R),dn=o.dn,T=k((p[0]*x+p.slice(1).reduce(function(s0,v,i){return s0+v*r[i];},0))/100,4);if(T!==k(T,1))continue;if(o.nice&&T!==Math.round(T))continue;
 var parts=p.slice(1).map(function(v,i){return k(v*r[i]/10000,6);}),rest=k(T/100-parts.reduce(function(a,b){return a+b;},0),6);
 LV={k:'rate',p:p,r:r,T:T};
 return Q({q:'ある旅行のアンケートで、行き先と交通手段を尋ねた。次の表は、行き先ごとの回答者の割合と、各行き先を選んだ人のうち「'+o.t+'」と答えた人の割合を示したものである。'+TB(['行き先'].concat(dn,['全体']),[['回答者の割合'].concat(p.map(function(v){return v+'%';}),['100%']),['「'+o.t+'」の割合','ア'].concat(r.map(function(v){return v+'%';}),[s(T)+'%'])])+'アに当てはまる数はいくつか。',
  inw:'全体の割合を、行き先ごとに「行き先の割合 × その中の割合」に分ける（加重平均）。分からない割合を x と置く',
  fig:{rows:[[{n:'全体の「'+o.t+'」',r:s(T/100),v:'',w:1}],dn.map(function(m,i){return {n:m,r:i===0?s(p[0]/100)+'×x':s(p[i]/100)+'×'+s(r[i-1]/100),v:i===0?'?':s(parts[i-1]),w:p[i]/100,ask:i===0?1:0};})]},
  calc:s(p[0]/100)+'x ＋ '+parts.map(s).join(' ＋ ')+' ＝ '+s(T/100)+'<br>'+s(p[0]/100)+'x ＝ '+s(rest)+'<br>x ＝ '+s(x/100)+' ＝ '+x+'%'},
  CH(x,[T,r[0],x*2],function(v){return s(v)+'%';},o.st,0));}}
/* メタンを取り除いた気体 */
function tRem(R,o){for(;;){var p=o.p(R),sg=o.sg(R),u=o.u(R),wt=p.map(function(x,i){return k(x*sg[i],4);}),rest=k(wt.slice(1).reduce(function(a,b){return a+b;},0),4),G=k(rest*u,4),pi=2,ans=k(wt[pi]*u,4);
 if(G!==k(G,1)||HALF(wt[pi]*u,1))continue;
 LV={k:'rem',p:p,sg:sg,G:G,r:o.r};
 return Q({q:'次の表は、混合気体Yに含まれる気体の体積百分率と、各気体の比重（同じ体積の重量の比）を示したものである。'+TB(['気体','体積百分率','比重'],o.nm.map(function(m,i){return [m,(o.r?p[i].toFixed(1):p[i])+'%',sg[i].toFixed(1)];}))+'混合気体Yからメタンを取り除いた気体の重量が'+s(G)+'gのとき、取り除いた後の気体に含まれるプロパンの重量は何gか。'+(o.r?RD2:''),
  inw:'体積の割合 × 比重で重さの比を出し、問題文の重量から「比の1あたり何g」かを出す（単位あたりの大きさ）',
  fig:{rows:[[{n:'メタン以外',r:'比 '+s(rest),v:s(G)+'g',w:1}],o.nm.slice(1).map(function(m,i){return {n:m,r:p[i+1]+'×'+sg[i+1].toFixed(1),v:i+1===pi?'?':s(wt[i+1]),w:k(wt[i+1]/rest,3),ask:i+1===pi?1:0};})]},
  calc:'メタン以外の重量の比 '+wt.slice(1).map(s).join(' ＋ ')+' ＝ '+s(rest)+'<br>比の1あたり '+s(G)+' ÷ '+s(rest)+' ＝ '+s(u)+' g<br>プロパン '+s(wt[pi])+' × '+s(u)+' ＝ '+(o.r?f1(ans):s(ans))},
  CH(ans,[G*p[pi]/(100-p[0]),G*wt[pi]/k(wt.reduce(function(a,b){return a+b;},0),4),wt[1]*u,ans*1.4],function(v){return (o.r?f1(v):s(v))+'g';},o.st,1));}}
/* 2000年の65歳以上の割合（指数） */
function tIdxPct(R){for(;;){var p=PC(R,4,1,12),ix=R.shuffle([55,60,65,70,80,85,90,95,105,110,115,120,125,130]).slice(0,4),v=p.map(function(x,i){return k(x*ix[i]/100,4);}),T=k(v.reduce(function(a,b){return a+b;},0),4),ans=k(v[3]/T*100,1);if(HALF(v[3]/T*100,1))continue;
 if(Math.abs(ans-p[3])<1)continue;
 LV={k:'ip',p:p,ix:ix};
 return Q({q:'次の表は、X県の2020年の年齢層別の人口の割合と、2000年の各年齢層の人口を2020年を100とした指数で示したものである。'+TB(['年齢層','2020年の割合','2000年の指数'],AG.map(function(a,i){return [a,p[i]+'%',String(ix[i])];}))+'2000年のX県の人口に占める65歳以上の人の割合は何%か。'+RD2,
  inw:'2020年の人口を100と置き、年齢層ごとに「2020年の割合 × 指数 ÷ 100」で2000年の人数を出す。2000年の全体はその合計',
  fig:{table:{head:['年齢層','2020年','×指数','2000年'],rows:p.map(function(x,i){return [MARK[i],String(x),s(ix[i]/100),(i===3?'!':'')+s(v[i])];}).concat([['合計','100','',s(T)]])}},
  calc:'2020年の人口を100とする<br>2000年 '+v.map(function(x,i){return MARK[i]+' '+s(x);}).join('、')+'<br>合計 '+s(T)+'<br>'+s(v[3])+' ÷ '+s(T)+' ＝ '+f1(ans)+'%'},
  CH(ans,[p[3],v[3],k(p[3]*ix[3]/100,1)],function(v){return f1(v)+'%';},1.1,1));}}

/* ---------- 指標5 ---------- */
var B5=H[5],P5=function(R){return R.pick([2,3,4,5,6]);};
B5.concept.push({id:'g-hyo5-c0',make:function(R){return tComp(R,{t:'と同じ',f:1,d:6,nice:1,c:function(R){return R.pick([10,20,30,40]);},n:function(R){return R.pick([2,4,6,8]);}});}});
B5.concept.push({id:'g-hyo5-c1',make:function(R){return tMix(R,{x:function(R){return R.int(1,4);},y:function(R){return R.int(4,8);},z:function(R){return R.int(2,6);}});}});
B5.concept.push({id:'g-hyo5-c2',make:function(R){return tMiss(R,{cl:'R',N:function(R){return R.pick([30,40,50]);},n1:function(R){return R.pick([10,15,20]);},x:function(R){return R.int(5,12);},a:function(R){return R.shuffle([50,55,60,65,70,75]).slice(0,3);}});}});
B5.practice.push({id:'g-hyo5-p0',make:function(R){return tTicket(R,{x:function(R){return R.int(5,15)*100;},p:function(R){return R.pick([50,60,70,80,90]);},O:function(R){return R.int(5,15)*100;},st:100});}});
B5.practice.push({id:'g-hyo5-p1',make:function(R){return tPast(R,{nice:1,a:function(R){return R.pick([12,16,20,24]);},c:function(R){return R.pick([14,20,24,28,30]);}});}});
B5.practice.push({id:'g-hyo5-p2',make:function(R){return tSim(R,{nice:1,p:function(R){return R.int(1,4);},x:function(R){return R.int(1,5)*100;},st:100});}});
B5.practice.push({id:'g-hyo5-p3',make:function(R){return tRatio(R,{dn:['W','X','Y'],i:0,j:1,t:'バス',d:1,nice:1,p:function(R){return PC(R,3,10,10);},b:function(R){return R.pick([10,12,15,20,25,30,40,45]);}});}});
B5.practice.push({id:'g-hyo5-p4',make:function(R){return tRate(R,{dn:['W','X','Y'],t:'乗用車',nice:1,st:10,p:function(R){return PC(R,3,10,10);},r:function(R){return [R.pick([10,20,30,40]),R.pick([10,20,30,40])];},x:function(R){return R.pick([10,20,30,40,50,60]);}});}});
B5.practice.push({id:'g-hyo5-p5',make:function(R){return tRem(R,{nm:['メタン','エタン','プロパン'],st:3,p:function(R){var e=R.pick([10,20]),pr=R.pick([10,20]);return [100-e-pr,e,pr];},sg:function(){return [1.0,2.0,3.0];},u:function(R){return R.pick([0.5,1,1.5,2]);}});}});
B5.applied.push({id:'g-hyo5-a0',make:function(R){return tMiss(R,{cl:'P',N:function(R){return R.pick([40,50,60]);},n1:function(R){return R.pick([10,15,20]);},x:function(R){return R.int(6,15);},a:function(R){return R.shuffle([55,60,65,70,75,80]).slice(0,3);}});}});
B5.applied.push({id:'g-hyo5-a1',make:function(R){return tMix(R,{x:function(R){return R.int(1,4);},y:function(R){return R.int(3,8);},z:function(R){return R.int(2,6);}});}});
B5.applied.push({id:'g-hyo5-a2',make:function(R){return tComp(R,{t:'の1/2の',f:0.5,d:2,nice:1,c:function(R){return R.pick([20,25,30,40]);},n:function(R){return R.pick([1,2,4,5]);}});}});
B5.applied.push({id:'g-hyo5-a3',make:function(R){return tTicket(R,{x:function(R){return R.int(6,15)*100;},p:function(R){return R.pick([20,40,50,60]);},O:function(R){return R.int(6,15)*100;},st:100});}});
B5.applied.push({id:'g-hyo5-a4',make:function(R){return tRatio(R,{dn:['W','X','Y','Z'],i:3,j:1,t:'電車',d:1,nice:1,p:function(R){return PC(R,4,5,10);},b:function(R){return R.pick([10,20,30,40,50,60]);}});}});
B5.applied.push({id:'g-hyo5-a5',make:function(R){return tPast(R,{nice:1,a:function(R){return R.pick([9,12,15,18]);},c:function(R){return R.pick([14,21,28,35]);}});}});
B5.applied.push({id:'g-hyo5-a6',make:function(R){return tSim(R,{nice:1,p:function(R){return R.int(1,5);},x:function(R){return R.int(2,8)*50;},st:50});}});
B5.applied.push({id:'g-hyo5-a7',make:function(R){return tRate(R,{dn:['W','X','Y'],t:'電車',nice:1,st:5,p:function(R){return PC(R,3,10,20);},r:function(R){return [R.pick([10,15,20,30]),R.pick([10,15,20,30])];},x:function(R){return R.pick([10,15,20,25,30,40]);}});}});
B5.real.push({id:'g-hyo5-r0',make:function(R){return tComp(R,{t:'の1/2の',f:0.5,d:2,c:function(R){return R.int(18,32);},n:function(R){return R.pick([1.2,1.6,2.4,3.2,4.8]);}});}});
B5.real.push({id:'g-hyo5-r1',make:function(R){return tMix(R,{x:function(R){return k(R.int(4,10)/10,1);},y:function(R){return k(R.int(12,24)/10,1);},z:function(R){return k(R.int(8,16)/10,1);}});}});
B5.real.push({id:'g-hyo5-r2',make:function(R){return tSim(R,{p:function(R){return R.pick([1,1.5,2,2.5,3]);},x:function(R){return R.int(4,12)*25;},st:50});}});
B5.real.push({id:'g-hyo5-r3',make:function(R){return tRem(R,{nm:['メタン','エタン','プロパン','ブタン'],r:1,st:3,p:function(R){var e=R.pick([6,7,8,9]),pr=R.pick([4,5,6]),b=R.pick([1.5,2,2.5]);return [k(100-e-pr-b,1),e,pr,b];},sg:function(R){return [1.0,R.pick([1.8,1.9]),R.pick([2.6,2.8]),R.pick([3.4,3.6])];},u:function(R){return R.pick([1.2,1.5,2,2.5]);}});}});
B5.real.push({id:'g-hyo5-r4',make:function(R){return tPast(R,{a:function(R){return R.int(11,16);},c:function(R){return R.int(20,30);}});}});
B5.real.push({id:'g-hyo5-r5',make:function(R){return tTicket(R,{x:function(R){return R.int(8,16)*100;},p:function(R){return R.pick([65,75,85,95]);},O:function(R){return R.int(100,180)*10;},st:110});}});
B5.real.push({id:'g-hyo5-r6',make:function(R){return tMiss(R,{cl:'R',N:function(R){return R.pick([36,40,45]);},n1:function(R){return R.int(10,14);},x:function(R){return R.int(5,12);},a:function(R){return R.shuffle([62.0,64.0,66.0,69.0,71.0,73.0]).slice(0,3);}});}});
B5.real.push({id:'g-hyo5-r7',make:function(R){return tRatio(R,{dn:['W','X','Y','Z'],i:3,j:1,t:'バス',d:2,p:function(R){return PC(R,4,2,12);},b:function(R){return R.int(12,65);}});}});
B5.real.push({id:'g-hyo5-r8',make:function(R){return tRate(R,{dn:['W','X','Y','Z'],t:'乗用車',st:4,p:function(R){return PC(R,4,5,10);},r:function(R){return [R.int(4,10)*5,R.int(4,10)*5,R.int(4,10)*5];},x:function(R){return R.int(7,13)*4;}});}});
B5.real.push({id:'g-hyo5-r9',make:tIdxPct});
/* ---------- 別の方法で解く（verify） ---------- */
function sum(a){return a.reduce(function(x,y){return x+y;},0);}
function I10(x){return Math.round(x*10);}
var VF={
 share:function(v){for(var n=0;n<=v.T;n++)if(n*100===v.T*v.p)return n+'人';},
 unit:function(v){var t=0;v.u.forEach(function(x,i){for(var j=0;j<v.n[i];j++)t+=x;});return t+v.uu;},
 wavg:function(v){var S=0,N=0;v.n.forEach(function(x,i){S+=x*I10(v.a[i]);N+=x;});var r=Math.round(S/N)/10;return (v.d===0?String(S/N/10):r.toFixed(1))+v.u;},
 inv:function(v){var x=v.g*v.p[v.ai]/v.p[v.gi];return (v.d?k(x,1).toFixed(1):s(x))+v.u;},
 idx:function(v){return s(v.b+v.b*(v.i-100)/100)+'個';},
 tp:function(v){var north=v.pN*100,old=north*v.pa/100;return s(old/100)+'%';},
 atom:function(v){var w=v.p.map(function(x,i){return Math.round(x*10)*v.wt[i];});for(var i=0;i<w.length;i++){var c=0;for(var j=0;j<w.length;j++)if(w[j]>w[i])c++;if(c===v.rank)return v.nm[i];}},
 rank:function(v){var w=v.p.map(function(x,i){return x*v.ix[i];}),o=['','','',''];w.forEach(function(x,i){var c=0;w.forEach(function(y){if(y>x)c++;});o[c]=MARK[i];});return o.join('');},
 diag:function(v){for(var x=1;x<=100000;x++)if(x*v.q===v.T*v.p)return x+'人';},
 gas:function(v){var L=v.p.length-1,x=v.g/v.p[0]*v.p[L]*v.sg[L],r=Math.round(x*10)/10;return (v.r?r.toFixed(1):s(r))+'g';},
 ti:function(v){for(var T=10;T<=1000000;T+=10)if(T*v.p*v.t===v.cnt*10000)return T+'人';},
 diff:function(v){return s(v.T*(v.a-v.b)/100)+'人';},
 ravg:function(v){return s(sum(v.n)/3)+'%';},
 r6:function(v){return (Math.round(v.p*v.t/10)/10).toFixed(1)+'%';},
 comp:function(v){var r=v.cr*v.nq*v.f/(v.cq*v.nr);return v.d===2?(Math.round(r*100)/100).toFixed(2)+'倍':s(r)+'倍';},
 mix:function(v){for(var a=1;a<=3;a++)for(var b=1;b<=3;b++)if(gcd(a,b)===1&&a*I10(v.z-v.x)===b*I10(v.y-v.z))return 'X:Y='+a+':'+b;},
 miss:function(v){var A=v.a.map(I10);for(var x=0;x<=v.N-v.n1;x++)if(v.n1*A[0]+A[1]*(v.N-v.n1-x)+A[2]*x===v.N*I10(v.A))return x+'人';},
 tk:function(v){for(var x=0;x<=v.D;x++)if(v.O*100+x*(100+v.p)===v.D*100)return x+'人';},
 past:function(v){var r=v.c*v.f/(v.a*v.g+v.b*v.f*v.g+v.c*v.f)*100;return (Math.round(r*10)/10).toFixed(1)+'%';},
 sim:function(v){var a1=I10(v.a1),a2=I10(v.a2),c1=I10(v.c1),c2=I10(v.c2),A=Math.round(v.A*1000),C=Math.round(v.C*1000);
  for(var x=0;x<=3000;x++){var r=A-a1*x;if(r<0)break;if(r%a2)continue;var y=r/a2;if(c1*x+c2*y===C)return x+'g';}},
 rat:function(v){var r=v.pi*v.b0/(v.pj*v.b1),m=Math.pow(10,v.d);return (Math.round(r*m)/m).toFixed(v.d)+'倍';},
 rate:function(v){var T=Math.round(v.T*100);for(var x=0;x<=100;x++){var t=v.p[0]*x;v.r.forEach(function(y,i){t+=v.p[i+1]*y;});if(Math.round(t)===T)return x+'%';}},
 rem:function(v){var w=v.p.map(function(x,i){return x*v.sg[i];}),x=v.G*w[2]/sum(w.slice(1)),r=Math.round(x*10)/10;return (v.r?r.toFixed(1):s(k(x,4)))+'g';},
 ip:function(v){var w=v.p.map(function(x,i){return x*v.ix[i];});return (Math.round(w[3]*1000/sum(w))/10).toFixed(1)+'%';}
};
[4,5].forEach(function(l){for(var st in H[l])H[l][st].forEach(function(it){if(!it.make||it.id.indexOf('g-hyo')!==0)return;var m=it.make;
 it.make=function(R){LV=null;var o=m(R);o.v=LV;return o;};it.verify=function(v){return VF[v.k](v);};});});
})();
