/* 本番形式：表の解釈の4タブの組（模擬テストの1問目用）。担当B（2026-11-17）
   1問目は既存の実践テンプレート（g-hyo4-r*・g-hyo5-r*）をそのまま使い、同じ表・同じ数値から2〜4問目を作る。
   登録は set_shugo_hyo.js の tb と同じ（BOOKDEFS に小問の定義を置き、setcore の makeBook が共通部分を stem にする）。
   各小問の生成 fn(v,o1,T) は {q, ans, wr, u, d, str, keep, l, calc, x(別の計算の答え。検査用)} を返す。作れないときは null。
   T は1問目の表（TBL の結果）。keep:1 なら表と1問目の問いの間の条件文も入れる。 */
(function(){
var S=window.SETS=window.SETS||{},BD=window.BOOKDEFS=window.BOOKDEFS||{};
var RND={int:function(a,b){return a+Math.floor(Math.random()*(b-a+1));},pick:function(x){return x[Math.floor(Math.random()*x.length)];},
 shuffle:function(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}};
function pk(a){return a[Math.floor(Math.random()*a.length)];}
function isInt(x){return Math.abs(x-Math.round(x))<1e-7;}
function rk(x,k){var m=Math.pow(10,k),y=x*m;if(!isFinite(y)||Math.abs(y-Math.floor(y)-0.5)<1e-6)return NaN;return Math.round(y+1e-9)/m;}
function nb(x){return Math.round(x*1e6)/1e6;}
var PR={0:'（必要なときは、最後に小数第1位を四捨五入すること）',1:'（必要なときは、最後に小数第2位を四捨五入すること）',2:'（必要なときは、最後に小数第3位を四捨五入すること）'};
function fmt(x,r){return r.str?String(x):(r.d?Number(x).toFixed(r.d):String(x))+r.u;}
function CH(r){if(!r.str&&!(isFinite(r.ans)&&r.ans>0))return null;var a=fmt(r.ans,r),out=[a],c=r.wr.slice();
 if(!r.str){var k=r.d?Math.pow(10,r.d):1;[0.8,1.2,0.9,1.1,0.5,1.5].forEach(function(m){c.push(Math.round(r.ans*m*k)/k);});[1,-1,2,-2].forEach(function(s){c.push(Math.round((r.ans+s*(r.d?Math.pow(10,-r.d):1))*k)/k);});}
 c.forEach(function(x){if(out.length>=5)return;if(!r.str&&!(isFinite(x)&&x>0))return;var s=fmt(x,r);if(out.indexOf(s)<0)out.push(s);});
 if(out.length<4)return null;var sh=RND.shuffle(out);return {c:sh,a:sh.indexOf(a)};}
function TBL(q){var ts=[];(q.match(/<table[\s\S]*?<\/table>/g)||[]).forEach(function(t){ts.push((t.match(/<tr>[\s\S]*?<\/tr>/g)||[]).map(function(tr){return (tr.match(/<t[hd][^>]*>[\s\S]*?<\/t[hd]>/g)||[]).map(function(c){return c.replace(/<[^>]+>/g,'').trim();});}));});return ts;}
function N(s){return parseFloat(String(s).replace(/[^\d.\-]/g,''));}
function preEnd(q){var i=q.lastIndexOf('</table></div>');return i<0?-1:i+14;}
function lastStart(q){var sp=SETCORE.split(q);return sp?sp[0].length:-1;}
function sub1(q){return q.slice(preEnd(q));}
function cond(o1){var s=sub1(o1.q),i=s.indexOf('とき、');return i<0?'':s.slice(0,i+3);}
function findSrc(f,id){var B=BANK[f];for(var l in B)for(var k in B[l]){var xs=B[l][k]||[];for(var i=0;i<xs.length;i++)if(xs[i].id===id)return {it:xs[i],l:+l};}return null;}
function sum(a){return a.reduce(function(s,x){return s+x;},0);}
var HY='表の解釈';
/* 1組＝1問目＋fns の小問（2〜4問目） */
function tb4(id,fns){var s0=findSrc(HY,id);if(!s0)return;var k='H4-'+id,ks=[k+'#1'];fns.forEach(function(f,i){ks.push(k+'#'+(i+2));});var lv=[s0.l];
 BD[ks[0]]={fd:HY,lv:s0.l,d:{P:{_:[0]},ok:function(v){
  for(var n=0;n<40;n++){var o1;try{o1=s0.it.make(RND);}catch(e){continue;}if(!o1||!o1.v)continue;var e=preEnd(o1.q);if(e<0)continue;var T=TBL(o1.q),os=[o1],rs=[],qs=[sub1(o1.q)],bad=false;
   for(var j=0;j<fns.length&&!bad;j++){var r=null;try{r=fns[j](o1.v,o1,T);}catch(er){r=null;}if(!r){bad=true;break;}var ch=CH(r);if(!ch){bad=true;break;}
    var mid='';if(r.keep){var ls=lastStart(o1.q);if(ls>e)mid=o1.q.slice(e,ls);}var q=o1.q.slice(0,e)+mid+r.q;if(qs.indexOf(q.slice(e))>=0){bad=true;break;}qs.push(q.slice(e));
    os.push({q:q,c:ch.c,a:ch.a,calc:r.calc});rs.push(r);}
   if(bad)continue;v._o=os;v._r=rs;return true;}return false;},f:function(v){return v._o[0];}}};
 fns.forEach(function(f,i){var l=f.l||s0.l;lv.push(l);BD[ks[i+1]]={fd:HY,lv:l,d:{P:{_:[0]},ok:function(v){return !!v._o;},f:function(v){return v._o[i+1];}}};});
 var L=Math.max.apply(null,lv);S[HY]=S[HY]||{};(S[HY][L]=S[HY][L]||[]).push({id:'set4-'+id,book:ks,tb:1,tabs:4});}
function L5(f){f.l=5;return f;}

/* ===== 指標4 ===== */
/* 化合物Pの原子：重量＝個数の割合×1個の重量 */
var ATOM='ただし、原子1個の重量の比は、水素：炭素：酸素：窒素＝1：12：16：14とする。';
function atomW(v){return v.p.map(function(p,i){return p*v.wt[i];});}
function atomNm(v){return v.nm||['水素','炭素','酸素','窒素'];}
tb4('g-hyo4-r0',[
 function(v){var w=atomW(v),nm=atomNm(v),od=[0,1,2,3].sort(function(a,b){return w[b]-w[a];}),k=v.rank===0?3:0;if(Math.abs(w[od[0]]-w[od[1]])<1e-9||Math.abs(w[od[2]]-w[od[3]])<1e-9)return null;var lab=k?'最も小さい':'最も大きい';
  return {q:'化合物Pに含まれる原子のうち、重量の合計が'+lab+'ものはどれか。'+ATOM,ans:nm[od[k]],str:1,wr:nm.filter(function(s,i){return i!==od[k];}),u:'',x:nm[od[k]],calc:nm.map(function(s,i){return s+' '+v.p[i]+' × '+v.wt[i]+' ＝ '+nb(w[i]);}).join('<br>')+'<br>'+lab+'のは '+nm[od[k]]};},
 function(v){var w=atomW(v),nm=atomNm(v),a=rk(w[1]/w[0],1);return {q:'化合物Pに含まれる炭素の重量の合計は、水素の重量の合計の何倍か'+PR[1]+'。'+ATOM,ans:a,d:1,wr:[rk(v.p[1]/v.p[0],1),rk(w[0]/w[1],1),rk(v.p[1]*12/100,1),rk(a+1,1)],u:'倍',x:rk(v.p[1]*12/v.p[0],1),
  calc:'炭素 '+v.p[1]+' × 12 ＝ '+nb(w[1])+'、水素 '+v.p[0]+' × 1 ＝ '+nb(w[0])+'<br>'+nb(w[1])+' ÷ '+nb(w[0])+' ≒ '+a+' 倍'};},
 L5(function(v){var w=atomW(v),s=sum(w),j=pk([2,3]),nm=atomNm(v),a=rk(w[j]/s*100,1);return {q:'化合物Pの重量全体に占める'+nm[j]+'の割合は何%か'+PR[1]+'。'+ATOM,ans:a,d:1,wr:[v.p[j],rk(w[j]/100,1),rk(v.p[j]*v.wt[j]/sum(v.wt),1),rk(a+3,1)],u:'%',x:rk(100/(s/w[j]),1),
  calc:'重量の合計 '+nm.map(function(s2,i){return nb(w[i]);}).join(' ＋ ')+' ＝ '+nb(s)+'<br>'+nm[j]+' '+nb(w[j])+' ÷ '+nb(s)+' ≒ '+a+'%'};})]);
/* 水溶液Yの薬品の重量百分率 */
function solv(o1){return (o1.q.match(/(水溶液\S)に含まれる薬品/)||[])[1];}
tb4('g-hyo4-r1',[
 function(v,o1,T){var nm=T[0][0].slice(1),p=T[0][1].slice(1).map(N),sl=solv(o1),W=v.g*100/p[v.gi];if(!sl)return null;var a=rk(W,0),dd=0;if(!isInt(W)){a=rk(W,1);dd=1;}
  return {q:sl+'に含まれる薬品'+nm[v.gi]+'が'+v.g+'gのとき、'+sl+'全体の重さは何gか'+(dd?PR[1]:'')+'。',ans:a,d:dd,wr:[rk(v.g*p[v.gi],dd),rk(W/10,dd),rk(W*2,dd),rk(W*p[v.ai]/100,dd)],u:'g',x:rk(v.g/(p[v.gi]/100),dd),calc:v.g+' ÷ '+nb(p[v.gi]/100)+(dd?' ≒ ':' ＝ ')+a};},
 function(v,o1,T){var nm=T[0][0].slice(1),p=T[0][1].slice(1).map(N),sl=solv(o1),j=[0,1,2].filter(function(i){return i!==v.gi&&i!==v.ai;})[0],a=rk(v.g*p[j]/p[v.gi],1);if(!sl)return null;
  return {q:sl+'に含まれる薬品'+nm[v.gi]+'が'+v.g+'gのとき、薬品'+nm[j]+'は何gか'+PR[1]+'。',ans:a,d:1,wr:[rk(v.g*p[v.gi]/p[j],1),rk(v.g*p[v.ai]/p[v.gi],1),rk(v.g*p[j]/100,1),rk(a+1,1)],u:'g',x:rk(v.g/p[v.gi]*100*p[j]/100,1),calc:v.g+' × '+p[j]+' ÷ '+p[v.gi]+' ≒ '+a};},
 function(v,o1,T){var nm=T[0][0].slice(1),p=T[0][1].slice(1).map(N),sl=solv(o1),X=pk([30,40,50,60,80,100]),i=v.gi,j=(v.gi+1)%3,W=X*100/(p[i]+p[j]);if(!sl)return null;var a=rk(W,0);
  return {q:sl+'に含まれる薬品'+nm[i]+'と薬品'+nm[j]+'の重さの合計が'+X+'gのとき、'+sl+'全体の重さは何gか'+PR[0]+'。',ans:a,wr:[rk(X*100/p[i],0),rk(X*(p[i]+p[j]),0),rk(X*100/(p[0]+p[1]+p[2]),0),rk(W/2,0)],u:'g',x:rk(X/((p[i]+p[j])/100),0),
   calc:nm[i]+'と'+nm[j]+'で '+p[i]+' ＋ '+p[j]+' ＝ '+nb(p[i]+p[j])+'%<br>'+X+' ÷ '+nb((p[i]+p[j])/100)+' ≒ '+a};}]);
/* X県の年齢層の割合と指数 */
function ageRows(T){var rows=T[0].slice(1);return {nm:rows.map(function(r){return r[0].replace(/^[①②③④]/,'');}),p:rows.map(function(r){return N(r[1]);}),ix:rows.map(function(r){return N(r[2]);})};}
var AGE_SHARE=L5(function(v,o1,T){var z=ageRows(T),w=z.p.map(function(p,i){return p*z.ix[i];}),s=sum(w),cand=[0,1,2,3].filter(function(i){return o1.q.indexOf(z.nm[i]+'の人の割合')<0;}),j=pk(cand),a=rk(w[j]/s*100,1);
 return {q:'2000年のX県の人口に占める'+z.nm[j]+'の人の割合は何%か'+PR[1]+'。',ans:a,d:1,wr:[z.p[j],rk(w[j]/100,1),rk(z.ix[j]/4,1),rk(a+2,1)],u:'%',x:rk(100/(s/w[j]),1),
  calc:'2020年の人口を100とすると2000年は '+w.map(function(x){return nb(x/100);}).join(' ＋ ')+' ＝ '+nb(s/100)+'<br>'+nb(w[j]/100)+' ÷ '+nb(s/100)+' ≒ '+a+'%'};});
var AGE_TOTAL=L5(function(v,o1,T){var z=ageRows(T),s=sum(z.p.map(function(p,i){return p*z.ix[i];})),a=rk(s/10000,2);
 return {q:'2000年のX県の人口は、2020年の人口の何倍か'+PR[2]+'。',ans:a,d:2,wr:[rk(10000/s,2),rk(sum(z.ix)/400,2),rk(a+0.1,2),rk(a-0.1,2)],u:'倍',x:rk(z.p.reduce(function(q,p,i){return q+p/100*z.ix[i]/100;},0),2),
  calc:z.p.map(function(p,i){return nb(p/100)+' × '+nb(z.ix[i]/100);}).join(' ＋ ')+' ＝ '+nb(s/10000)+' ≒ '+a+' 倍'};});
var AGE_RATIO=L5(function(v,o1,T){var z=ageRows(T),ij=pk([[0,3],[3,0],[0,2],[1,3]]),i=ij[0],j=ij[1],a=rk(z.p[i]*z.ix[i]/(z.p[j]*z.ix[j]),2);
 return {q:'2000年の'+z.nm[i]+'の人口は、2000年の'+z.nm[j]+'の人口の何倍か'+PR[2]+'。',ans:a,d:2,wr:[rk(z.p[i]/z.p[j],2),rk(z.ix[i]/z.ix[j],2),rk(z.p[j]*z.ix[j]/(z.p[i]*z.ix[i]),2),rk(a+0.2,2)],u:'倍',x:rk((z.p[i]/z.p[j])*(z.ix[i]/z.ix[j]),2),
  calc:z.nm[i]+' '+z.p[i]+' × '+nb(z.ix[i]/100)+' ＝ '+nb(z.p[i]*z.ix[i]/100)+'<br>'+z.nm[j]+' '+z.p[j]+' × '+nb(z.ix[j]/100)+' ＝ '+nb(z.p[j]*z.ix[j]/100)+'<br>'+nb(z.p[i]*z.ix[i]/100)+' ÷ '+nb(z.p[j]*z.ix[j]/100)+' ≒ '+a+' 倍'};});
tb4('g-hyo4-r2',[AGE_SHARE,AGE_TOTAL,AGE_RATIO]);
tb4('g-hyo5-r9',[AGE_TOTAL,AGE_RATIO,function(v,o1,T){var z=ageRows(T),w=z.p.map(function(p,i){return p*z.ix[i];}),od=[0,1,2,3].sort(function(a,b){return w[b]-w[a];});if(Math.abs(w[od[0]]-w[od[1]])<1e-9)return null;var nm=z.nm,a=nm[od[0]];
 return {q:'2000年のX県の人口が最も多い年齢層はどれか。',ans:a,str:1,wr:nm.filter(function(s){return s!==a;}),u:'',x:nm[w.indexOf(Math.max.apply(null,w))],calc:nm.map(function(s,i){return s+' '+z.p[i]+' × '+nb(z.ix[i]/100)+' ＝ '+nb(w[i]/100);}).join('<br>')+'<br>最も多いのは '+a};}]);
/* 受験者数と平均点（3グループ） */
function grp3(T){var rows=T[0].slice(1,4);return {nm:rows.map(function(r){return r[0];}),n:rows.map(function(r){return N(r[1]);}),a:rows.map(function(r){return N(r[2]);})};}
function pairAvg(lab,ij){return function(v,o1,T){var z=grp3(T),i=ij[0],j=ij[1],x=rk((z.n[i]*z.a[i]+z.n[j]*z.a[j])/(z.n[i]+z.n[j]),1);
 return {q:lab(z.nm[i])+'と'+lab(z.nm[j])+'を合わせた平均点は何点か'+PR[1]+'。',ans:x,d:1,wr:[rk((z.a[i]+z.a[j])/2,1),rk((z.n[i]*z.a[j]+z.n[j]*z.a[i])/(z.n[i]+z.n[j]),1),rk(sum(z.n.map(function(n,k){return n*z.a[k];}))/sum(z.n),1)],u:'点',x:rk(z.a[i]+(z.a[j]-z.a[i])*z.n[j]/(z.n[i]+z.n[j]),1),
  calc:'('+z.n[i]+' × '+z.a[i]+' ＋ '+z.n[j]+' × '+z.a[j]+') ÷ ('+z.n[i]+' ＋ '+z.n[j]+') ≒ '+x};};}
function totPts(lab){return function(v,o1,T){var z=grp3(T),s=nb(sum(z.n.map(function(n,k){return n*z.a[k];}))),d=isInt(s)?0:1;
 return {q:lab+'の得点の合計は何点か。',ans:s,d:d,wr:[nb(sum(z.a)*sum(z.n)/3),nb(sum(z.a)),nb(s+10),nb(s-10)],u:'点',x:nb(z.n[0]*z.a[0]+z.n[1]*z.a[1]+z.n[2]*z.a[2]),
  calc:z.n.map(function(n,k){return n+' × '+z.a[k];}).join(' ＋ ')+' ＝ '+s};};}
function lbS(s){return s+'を受験した人';}function lbC(s){return s+'クラス';}
tb4('g-hyo4-r3',[pairAvg(lbS,[0,1]),pairAvg(lbS,[1,2]),totPts('3科目の受験者全員')]);
tb4('g-hyo4-r9',[pairAvg(lbC,[0,1]),pairAvg(lbC,[0,2]),totPts('3クラスの受験者全員')]);
/* 2日間のイベント：昨年 T（2日目 p%）、一昨年 ア（2日目 q%）、一昨年の2日目＝昨年の2日目 */
tb4('g-hyo4-r4',[
 function(v){var A=v.T*v.p/v.q,a=A*(100-v.q)/100;if(!isInt(A)||!isInt(a))return null;return {keep:1,q:'一昨年の1日目の入場者数は何人か。',ans:a,wr:[A,v.T*(100-v.p)/100,A*v.q/100,a+v.T*v.p/100],u:'人',x:A-v.T*v.p/100,
  calc:'昨年の2日目 '+v.T+' × '+nb(v.p/100)+' ＝ '+v.T*v.p/100+'<br>一昨年の延べ '+v.T*v.p/100+' ÷ '+nb(v.q/100)+' ＝ '+A+'<br>一昨年の1日目 '+A+' × '+nb((100-v.q)/100)+' ＝ '+a};},
 function(v){var a=v.T*(100-v.p)/100;if(!isInt(a))return null;return {q:'昨年の1日目の入場者数は何人か。',ans:a,wr:[v.T*v.p/100,v.T-a/2,r(v.T*(100-v.q)/100),a+100],u:'人',x:v.T-v.T*v.p/100,calc:v.T+' × '+nb((100-v.p)/100)+' ＝ '+a};},
 function(v){var A=v.T*v.p/v.q,a=rk(v.T/A*100,1);if(!isInt(A))return null;return {keep:1,q:'昨年の延べ入場者数は、一昨年の延べ入場者数の何%か'+PR[1]+'。',ans:a,d:1,wr:[rk(A/v.T*100,1),rk(100+v.p-v.q,1),rk(v.p/v.q*100*0.9,1),rk(a+5,1)],u:'%',x:rk(v.q/v.p*100,1),
  calc:'一昨年の延べ '+v.T*v.p/100+' ÷ '+nb(v.q/100)+' ＝ '+A+'<br>'+v.T+' ÷ '+A+' ≒ '+a+'%'};}]);
function r(x){return Math.round(x);}
/* S駅で降りた人の運賃 */
function fare(T){var rows=T[0].slice(1);return {nm:rows.map(function(x){return x[0];}),n:rows.map(function(x){return N(x[1]);}),u:rows.map(function(x){return N(x[2]);})};}
tb4('g-hyo4-r5',[
 function(v,o1,T){var z=fare(T),s=sum(z.n.map(function(n,i){return n*z.u[i];})),c=sum(z.n),a=rk(s/c,0);return {q:'S駅で降りた人が支払った運賃の平均は、1人あたり何円か'+PR[0]+'。',ans:a,wr:[rk(sum(z.u)/3,0),z.u[1],rk(a*0.9,0),a+20],u:'円',x:rk(s/(z.n[0]+z.n[1]+z.n[2]),0),
  calc:'合計 '+z.n.map(function(n,i){return n+' × '+z.u[i];}).join(' ＋ ')+' ＝ '+s+'<br>'+s+' ÷ '+c+' ≒ '+a};},
 function(v,o1,T){var z=fare(T),s=sum(z.n.map(function(n,i){return n*z.u[i];})),j=pk([0,1,2]),a=rk(z.n[j]*z.u[j]/s*100,1);return {q:z.nm[j]+'から乗った人が支払った運賃の合計は、S駅で降りた人が支払った運賃の合計の何%か'+PR[1]+'。',ans:a,d:1,wr:[rk(z.n[j]/sum(z.n)*100,1),rk(z.u[j]/sum(z.u)*100,1),rk(100-a,1),rk(a+5,1)],u:'%',x:rk(100/(s/(z.n[j]*z.u[j])),1),
  calc:z.nm[j]+' '+z.n[j]+' × '+z.u[j]+' ＝ '+z.n[j]*z.u[j]+'<br>'+z.n[j]*z.u[j]+' ÷ '+s+' ≒ '+a+'%'};},
 function(v,o1,T){var z=fare(T),A=z.n[0]*z.u[0],B=z.n[2]*z.u[2],a=Math.abs(A-B);if(!a)return null;return {q:z.nm[0]+'から乗った人が支払った運賃の合計と、'+z.nm[2]+'から乗った人が支払った運賃の合計の差は何円か。',ans:a,wr:[Math.abs(z.u[0]-z.u[2])*z.n[0],Math.abs(z.n[0]-z.n[2])*z.u[2],A,B],u:'円',x:Math.max(A,B)-Math.min(A,B),
  calc:z.nm[0]+' '+z.n[0]+' × '+z.u[0]+' ＝ '+A+'、'+z.nm[2]+' '+z.n[2]+' × '+z.u[2]+' ＝ '+B+'<br>差 '+a};}]);
/* 行き先と、ある行き先を選んだ人の交通手段（表2つ） */
function dest(T){var h=T[0][0],p=T[0][1].map(N),h2=T[1][0],t=T[1][1].map(N),D=h2[0].replace('の交通手段','');return {h:h,p:p,h2:h2,t:t,D:D,pD:p[h.indexOf(D)]};}
function askMode(o1){return (sub1(o1.q).match(/「(.+?)」/)||[])[1];}
tb4('g-hyo4-r6',[
 function(v,o1,T){var z=dest(T),md=askMode(o1),j=z.h2.indexOf(md),cs=[];if(j<0)return null;for(var n=500;n<=5000;n+=100){var c=n*z.pD*z.t[j]/10000;if(isInt(c)&&c>=10)cs.push(n);}if(!cs.length)return null;var n2=pk(cs),c2=n2*z.pD*z.t[j]/10000;
  return {q:z.D+'を選んで「'+md+'」と答えた人が'+c2+'人のとき、回答者全体は何人か。',ans:n2,wr:[c2*100/z.t[j],c2*100/z.pD,r(n2*1.25),n2/2],u:'人',x:c2/(z.pD/100)/(z.t[j]/100),calc:c2+' ÷ ('+nb(z.pD/100)+' × '+nb(z.t[j]/100)+') ＝ '+n2};},
 function(v,o1,T){var z=dest(T),md=askMode(o1),js=[];for(var i=1;i<z.h2.length;i++)if(z.h2[i]!==md)js.push(i);var j=pk(js),a=rk(z.pD*z.t[j]/100,1);
  return {q:z.D+'を選んで「'+z.h2[j]+'」と答えた人は、回答者全体の何%か'+PR[1]+'。',ans:a,d:1,wr:[z.t[j],rk(z.pD+z.t[j],1),rk(z.t[j]/z.pD,1),rk(a*2,1)],u:'%',x:rk(z.t[j]*z.pD/100,1),calc:z.pD+'% × '+nb(z.t[j]/100)+' ≒ '+a+'%'};},
 function(v,o1,T){var z=dest(T),ws=[];for(var i=1;i<z.h.length;i++)if(z.h[i]!==z.D)ws.push(i);var w=pk(ws),j=pk([1,2,3].filter(function(i){return i<z.h2.length;})),a=rk(z.pD*z.t[j]/z.p[w],1);
  return {q:z.D+'を選んで「'+z.h2[j]+'」と答えた人は、'+z.h[w]+'を選んだ人の何%か'+PR[1]+'。',ans:a,d:1,wr:[rk(z.pD*z.t[j]/100,1),rk(z.t[j]*z.p[w]/z.pD,1),z.t[j],rk(a+5,1)],u:'%',x:rk(z.t[j]/100*z.pD/z.p[w]*100,1),
   calc:z.D+'で「'+z.h2[j]+'」は全体の '+nb(z.pD*z.t[j]/100)+'%<br>'+nb(z.pD*z.t[j]/100)+' ÷ '+z.p[w]+' ≒ '+a+'%'};}]);
tb4('g-hyo4-r8',[
 function(v,o1,T){var z=dest(T),io=z.h2.indexOf('その他'),cs=[];for(var j=1;j<z.h2.length;j++){if(j===io)continue;var a=v.cnt*z.t[j]/z.t[io];if(isInt(a))cs.push([j,a]);}if(io<0||!cs.length)return null;var c=pk(cs);
  return {q:z.D+'を選んで「その他」と答えた人が'+v.cnt+'人のとき、'+z.D+'を選んで「'+z.h2[c[0]]+'」と答えた人は何人か。',ans:c[1],wr:[v.cnt*100/z.t[io],r(v.cnt*z.t[io]/z.t[c[0]])||c[1]+3,c[1]+v.cnt,c[1]*2],u:'人',x:v.cnt/(z.t[io]/100)*(z.t[c[0]]/100),calc:z.D+'を選んだ人 '+v.cnt+' ÷ '+nb(z.t[io]/100)+' ＝ '+nb(v.cnt*100/z.t[io])+'<br>× '+nb(z.t[c[0]]/100)+' ＝ '+c[1]};},
 function(v,o1,T){var z=dest(T),io=z.h2.indexOf('その他'),a=v.cnt*100/z.t[io];if(io<0||!isInt(a))return null;
  return {q:z.D+'を選んで「その他」と答えた人が'+v.cnt+'人のとき、'+z.D+'を選んだ人は何人か。',ans:a,wr:[v.cnt*100/z.pD,a*z.pD/100||a+10,r(v.cnt*z.t[io]),a+v.cnt],u:'人',x:v.cnt/(z.t[io]/100),calc:v.cnt+' ÷ '+nb(z.t[io]/100)+' ＝ '+a};},
 function(v,o1,T){var z=dest(T),js=[];for(var i=1;i<z.h2.length;i++)if(z.h2[i]!=='その他')js.push(i);var j=pk(js),a=rk(z.pD*z.t[j]/100,1);
  return {q:z.D+'を選んで「'+z.h2[j]+'」と答えた人は、回答者全体の何%か'+PR[1]+'。',ans:a,d:1,wr:[z.t[j],rk(z.pD+z.t[j],1),rk(z.t[j]/z.pD,1),rk(a*2,1)],u:'%',x:rk(z.t[j]*z.pD/100,1),calc:z.pD+'% × '+nb(z.t[j]/100)+' ≒ '+a+'%'};}]);
/* 混合気体（体積百分率と比重） */
function gas(T){var rows=T[0].slice(1);return {nm:rows.map(function(x){return x[0];}),p:rows.map(function(x){return N(x[1]);}),sg:rows.map(function(x){return N(x[2]);})};}
function askGas(o1,z){var s=sub1(o1.q),k=-1;z.nm.forEach(function(x,i){if(i&&s.indexOf(x+'の重量は何')>=0)k=i;});return k;}
tb4('g-hyo4-r7',[
 function(v,o1,T){var z=gas(T),w=z.p.map(function(p,i){return p*z.sg[i];}),s=sum(w),a=rk(v.g*s/w[0],1);return {q:'混合気体Xに含まれるメタンの重量が'+v.g+'gのとき、混合気体X全体の重量は何gか'+PR[1]+'。',ans:a,d:1,wr:[rk(v.g*100/z.p[0],1),rk(v.g*(s-w[0])/w[0],1),rk(v.g*100/z.p[0]*1.2,1)],u:'g',x:rk(v.g+v.g*(s-w[0])/w[0],1),
  calc:'重量の比 '+z.p.map(function(p,i){return p+' × '+z.sg[i];}).join(' ＋ ')+' ＝ '+nb(s)+'<br>'+v.g+' × '+nb(s)+' ÷ '+nb(w[0])+' ≒ '+a};},
 function(v,o1,T){var z=gas(T),k=askGas(o1,z),js=[];for(var i=1;i<z.nm.length;i++)if(i!==k)js.push(i);if(!js.length)return null;var j=pk(js),a=rk(v.g*z.p[j]*z.sg[j]/(z.p[0]*z.sg[0]),1);
  return {q:'混合気体Xに含まれるメタンの重量が'+v.g+'gのとき、'+z.nm[j]+'の重量は何gか'+PR[1]+'。',ans:a,d:1,wr:[rk(v.g*z.p[j]/z.p[0],1),rk(v.g*z.p[j]*z.sg[j]/100,1),rk(v.g*z.p[0]/(z.p[j]*z.sg[j]),1),rk(a+2,1)],u:'g',x:rk(v.g/(z.p[0]*z.sg[0])*(z.p[j]*z.sg[j]),1),
   calc:'メタン '+z.p[0]+' × '+z.sg[0]+' ＝ '+nb(z.p[0]*z.sg[0])+'、'+z.nm[j]+' '+z.p[j]+' × '+z.sg[j]+' ＝ '+nb(z.p[j]*z.sg[j])+'<br>'+v.g+' × '+nb(z.p[j]*z.sg[j])+' ÷ '+nb(z.p[0]*z.sg[0])+' ≒ '+a};},
 L5(function(v,o1,T){var z=gas(T),w=z.p.map(function(p,i){return p*z.sg[i];}),s=sum(w),j=pk([0,1]),a=rk(w[j]/s*100,1);return {q:'混合気体Xの重量全体に占める'+z.nm[j]+'の割合は何%か'+PR[1]+'。',ans:a,d:1,wr:[z.p[j],rk(z.p[j]*z.sg[j]/100,1),rk(100-a,1),rk(a+3,1)],u:'%',x:rk(100/(s/w[j]),1),
  calc:'重量の比の合計 '+nb(s)+'<br>'+z.nm[j]+' '+nb(w[j])+' ÷ '+nb(s)+' ≒ '+a+'%'};})]);

/* ===== 指標5 ===== */
tb4('g-hyo5-r0',[
 function(v,o1){var c=cond(o1),a=rk(v.f*v.nq/v.nr,2);if(!c)return null;return {q:c+'化合物Rに含まれる原子の総数は、化合物Qに含まれる原子の総数の何倍か'+PR[2]+'。',ans:a,d:2,wr:[rk(v.nr/v.nq*v.f,2),rk(v.nq/v.nr,2),rk(v.f*v.cr/v.cq,2),rk(a*2,2)],u:'倍',x:rk(v.f/(v.nr/v.nq),2),
  calc:'R × '+nb(v.nr/100)+' ＝ '+v.f+' × Q × '+nb(v.nq/100)+'<br>R ＝ Q × '+v.f+' × '+v.nq+' ÷ '+v.nr+' ≒ '+a+' 倍'};},
 function(v){var a=rk(v.cq/v.nq,1);return {q:'化合物Qに含まれる炭素原子の数は、窒素原子の数の何倍か'+PR[1]+'。',ans:a,d:1,wr:[rk(v.nq/v.cq,1),rk(v.cr/v.nr,1),rk(v.cq*v.nq/10,1),rk(a+2,1)],u:'倍',x:rk((v.cq/100)/(v.nq/100),1),calc:v.cq+' ÷ '+v.nq+' ≒ '+a+' 倍'};},
 function(v){var a=rk(v.cr/v.nr,1);return {q:'化合物Rに含まれる炭素原子の数は、窒素原子の数の何倍か'+PR[1]+'。',ans:a,d:1,wr:[rk(v.nr/v.cr,1),rk(v.cq/v.nq,1),rk(v.cr*v.nr/10,1),rk(a+2,1)],u:'倍',x:rk((v.cr/100)/(v.nr/100),1),calc:v.cr+' ÷ '+v.nr+' ≒ '+a+' 倍'};}]);
function mixPct(z){return function(v){var a=rk((z[0]*v.x+z[1]*v.y)/(z[0]+z[1]),1);
 return {q:'水溶液XとYを重さで'+z[0]+'：'+z[1]+'の割合で混ぜたとき、混ぜた水溶液に含まれる薬品dの重量百分率は何%か'+PR[1]+'。',ans:a,d:1,wr:[rk((v.x+v.y)/2,1),rk((z[1]*v.x+z[0]*v.y)/(z[0]+z[1]),1),rk(z[0]*v.x+z[1]*v.y,1),v.z],u:'%',x:rk(v.x+(v.y-v.x)*z[1]/(z[0]+z[1]),1),calc:'('+z[0]+' × '+v.x+' ＋ '+z[1]+' × '+v.y+') ÷ '+(z[0]+z[1])+' ≒ '+a+'%'};};}
tb4('g-hyo5-r1',[mixPct([1,2]),mixPct([3,1]),function(v){var X=pk([100,200,300]),Y=pk([100,200,400]),a=rk((X*v.x+Y*v.y)/100,1);
 return {q:'水溶液X '+X+'gと水溶液Y '+Y+'gを混ぜたとき、混ぜた水溶液に含まれる薬品dは何gか'+PR[1]+'。',ans:a,d:1,wr:[rk((X+Y)*v.z/100,1),rk((X+Y)*(v.x+v.y)/200,1),rk(X*v.y/100+Y*v.x/100,1),rk(a+1,1)],u:'g',x:rk(X*v.x/100+Y*v.y/100,1),calc:X+' × '+nb(v.x/100)+' ＋ '+Y+' × '+nb(v.y/100)+' ≒ '+a+'g'};}]);
function simXY(v){var D=v.a1*v.c2-v.a2*v.c1;if(!D)return null;return {X:100*(v.A*v.c2-v.C*v.a2)/D,Y:100*(v.a1*v.C-v.c1*v.A)/D};}
tb4('g-hyo5-r2',[
 function(v){var z=simXY(v);if(!z||!isInt(z.Y)||z.Y<=0)return null;var Y=Math.round(z.Y);return {keep:1,q:'混ぜた水溶液Yは何gか。',ans:Y,wr:[r(z.X),r(z.X+z.Y),r(v.A*100/v.a2),r(v.C*100/v.c2)],u:'g',x:r((v.A*100-v.a1*z.X)/v.a2),
  calc:nb(v.a1/100)+'x ＋ '+nb(v.a2/100)+'y ＝ '+v.A+'<br>'+nb(v.c1/100)+'x ＋ '+nb(v.c2/100)+'y ＝ '+v.C+'<br>y ＝ '+Y};},
 function(v){var z=simXY(v);if(!z||!isInt(z.X)||!isInt(z.Y))return null;var a=r(z.X+z.Y);return {keep:1,q:'水溶液P全体の重さは何gか。',ans:a,wr:[r(z.X),r(z.Y),r((v.A+v.C)*100/((v.a1+v.c1+v.a2+v.c2)/2)),a+100],u:'g',x:r((v.A*100-v.a2*z.Y)/v.a1+z.Y),calc:'X '+r(z.X)+'g、Y '+r(z.Y)+'g<br>'+r(z.X)+' ＋ '+r(z.Y)+' ＝ '+a};},
 function(v){var z=simXY(v);if(!z)return null;var a=rk(v.A/(z.X+z.Y)*100,1);return {keep:1,q:'水溶液Pに含まれる薬品aの重量百分率は何%か'+PR[1]+'。',ans:a,d:1,wr:[rk((v.a1+v.a2)/2,1),rk(v.C/(z.X+z.Y)*100,1),rk((v.A+v.C)/(z.X+z.Y)*100,1),rk(a+0.5,1)],u:'%',x:rk(100*(v.a1*z.X+v.a2*z.Y)/100/(z.X+z.Y),1),
  calc:'P '+r(z.X)+' ＋ '+r(z.Y)+' ＝ '+r(z.X+z.Y)+'g<br>'+v.A+' ÷ '+r(z.X+z.Y)+' ≒ '+a+'%'};}]);
function remGas(pickFn){return function(v,o1,T){var z=gas(T),c=cond(o1);if(!c)return null;var k=askGas(o1,z),j=pickFn(z,k);if(j==null)return null;var s=0;for(var i=1;i<z.nm.length;i++)s+=z.p[i]*z.sg[i];
 if(j===0){var a0=rk(v.G*(s+z.p[0]*z.sg[0])/s,1);return {q:c+'メタンを取り除く前の混合気体Y全体の重量は何gか'+PR[1]+'。',ans:a0,d:1,wr:[rk(v.G*100/(100-z.p[0]),1),rk(v.G+z.p[0],1),rk(v.G*z.p[0]*z.sg[0]/s,1),rk(a0+10,1)],u:'g',x:rk(v.G+v.G*z.p[0]*z.sg[0]/s,1),calc:'メタン以外の比 '+nb(s)+'、メタン '+nb(z.p[0]*z.sg[0])+'<br>'+v.G+' × '+nb(s+z.p[0]*z.sg[0])+' ÷ '+nb(s)+' ≒ '+a0};}
 var a=rk(v.G*z.p[j]*z.sg[j]/s,1);return {q:c+'取り除いた後の気体に含まれる'+z.nm[j]+'の重量は何gか'+PR[1]+'。',ans:a,d:1,wr:[rk(v.G*z.p[j]/(100-z.p[0]),1),rk(v.G*z.p[j]*z.sg[j]/(s+z.p[0]*z.sg[0]),1),rk(v.G*z.p[j]/100,1)],u:'g',x:rk(v.G/(s/(z.p[j]*z.sg[j])),1),
  calc:'メタン以外の比 '+nb(s)+'<br>'+z.nm[j]+' '+v.G+' × '+nb(z.p[j]*z.sg[j])+' ÷ '+nb(s)+' ≒ '+a};};}
tb4('g-hyo5-r3',[remGas(function(z,k){var js=[];for(var i=1;i<z.nm.length;i++)if(i!==k)js.push(i);return js[0];}),remGas(function(z,k){var js=[];for(var i=1;i<z.nm.length;i++)if(i!==k)js.push(i);return js.length>1?js[1]:null;}),remGas(function(){return 0;})]);
/* 10年前の人口（現在を100） */
function past(v){return [v.a/v.f,v.b,v.c/v.g];}
tb4('g-hyo5-r4',[
 function(v){var P=sum(past(v)),a=rk(100/P,2);return {keep:1,q:'現在のY県の人口は、10年前の人口の何倍か'+PR[2]+'。',ans:a,d:2,wr:[rk(P/100,2),rk((v.a*v.f+v.b+v.c*v.g)/100,2),rk(v.g*v.f,2),rk(a+0.1,2)],u:'倍',x:rk(1/(P/100),2),calc:'10年前 '+nb(v.a)+' ÷ '+nb(v.f)+' ＋ '+v.b+' ＋ '+v.c+' ÷ '+nb(v.g)+' ＝ '+nb(P)+'<br>100 ÷ '+nb(P)+' ≒ '+a+' 倍'};},
 function(v){var q=past(v),P=sum(q),a=rk(q[0]/P*100,1);return {keep:1,q:'10年前のY県の人口に占める0〜14歳の人の割合は何%か'+PR[1]+'。',ans:a,d:1,wr:[v.a,rk(v.a*v.f,1),rk(v.a/v.f,1),rk(a+2,1)],u:'%',x:rk(100/(P/q[0]),1),calc:'0〜14歳 '+v.a+' ÷ '+nb(v.f)+' ＝ '+nb(q[0])+'<br>'+nb(q[0])+' ÷ '+nb(P)+' ≒ '+a+'%'};},
 function(v){var q=past(v),a=rk(q[0]/q[2],2);return {keep:1,q:'10年前の0〜14歳の人口は、10年前の65歳以上の人口の何倍か'+PR[2]+'。',ans:a,d:2,wr:[rk(v.a/v.c,2),rk(q[2]/q[0],2),rk(v.a*v.f/(v.c*v.g),2),rk(a+0.2,2)],u:'倍',x:rk((v.a/v.c)*(v.g/v.f),2),calc:nb(q[0])+' ÷ '+nb(q[2])+' ≒ '+a+' 倍'};}]);
/* 2日券：延べ D、1日券 O、2日券のうち p% が2日とも */
function tkU(v){return (v.D-v.O)/(1+v.p/100);}
tb4('g-hyo5-r5',[
 function(v){var U=tkU(v),a=U*(100-v.p)/100;if(!isInt(U)||!isInt(a)||a<=0)return null;return {keep:1,q:'2日券の購入者のうち、1日だけ入場した人は何人か。',ans:r(a),wr:[r(U),r(U*v.p/100),r(v.D-v.O-U),r((v.D-v.O)*(100-v.p)/100)],u:'人',x:r(U-U*v.p/100),calc:'2日券 '+(v.D-v.O)+' ÷ '+nb(1+v.p/100)+' ＝ '+r(U)+'<br>'+r(U)+' × '+nb((100-v.p)/100)+' ＝ '+r(a)};},
 function(v){var U=tkU(v),a=U*v.p/100;if(!isInt(U)||!isInt(a))return null;return {keep:1,q:'2日券の購入者のうち、2日とも入場した人は何人か。',ans:r(a),wr:[r(U),r(U*(100-v.p)/100)||r(a)+5,r((v.D-v.O)*v.p/100),r(a+v.O/10)],u:'人',x:r(U-U*(100-v.p)/100),calc:r(U)+' × '+nb(v.p/100)+' ＝ '+r(a)};},
 function(v){var a=rk((v.D-v.O)/v.D*100,1);return {keep:1,q:'延べ入場者数のうち、2日券の購入者による入場は何%か'+PR[1]+'。',ans:a,d:1,wr:[rk(v.O/v.D*100,1),rk(tkU(v)/v.D*100,1),v.p,rk(a+5,1)],u:'%',x:rk(100-v.O/v.D*100,1),calc:'('+v.D+' − '+v.O+') ÷ '+v.D+' ≒ '+a+'%'};}]);
/* 受験者数アの逆算 */
function miss(v){var y=(v.N*v.A-v.n1*v.a[0]-(v.N-v.n1)*v.a[1])/(v.a[2]-v.a[1]);if(!isInt(y))return null;y=r(y);return {y:y,c:v.N-v.n1-y};}
tb4('g-hyo5-r6',[
 function(v){var z=miss(v);if(!z||z.c<=0||z.y<=0)return null;return {q:'化学の受験者数は何人か。',ans:z.c,wr:[z.y,v.N-v.n1,r((v.N-v.n1)/2),z.c+2],u:'人',x:r((v.N*v.A-v.n1*v.a[0]-(v.N-v.n1)*v.a[2])/(v.a[1]-v.a[2])),calc:'生物（ア）'+z.y+'人<br>化学 '+v.N+' − '+v.n1+' − '+z.y+' ＝ '+z.c};},
 function(v){var z=miss(v);if(!z||z.c<=0||z.y<=0)return null;var a=nb((v.N*v.A-v.n1*v.a[0]));return {q:'化学と生物の受験者の得点の合計は何点か。',ans:a,d:isInt(a)?0:1,wr:[nb(v.N*v.A),nb((v.N-v.n1)*(v.a[1]+v.a[2])/2),nb(a+v.a[0]),nb(a-50)],u:'点',x:nb(z.c*v.a[1]+z.y*v.a[2]),calc:v.N+' × '+v.A+' − '+v.n1+' × '+v.a[0]+' ＝ '+a};},
 function(v){var z=miss(v);if(!z||z.c<=0||z.y<=0)return null;var a=rk((z.c*v.a[1]+z.y*v.a[2])/(z.c+z.y),1);return {q:'化学と生物を合わせた平均点は何点か'+PR[1]+'。',ans:a,d:1,wr:[rk((v.a[1]+v.a[2])/2,1),v.A,rk((z.y*v.a[1]+z.c*v.a[2])/(z.c+z.y),1),rk(a+0.5,1)],u:'点',x:rk((v.N*v.A-v.n1*v.a[0])/(v.N-v.n1),1),
  calc:'('+v.N+' × '+v.A+' − '+v.n1+' × '+v.a[0]+') ÷ '+(v.N-v.n1)+' ≒ '+a};}]);
/* 行き先ごとの「バス」の割合（表2つ：行き先の割合、2つの行き先のバスの割合） */
function bus(T){var h1=T[0][0],p=T[0][1].map(N),h2=T[1][0],b=T[1][1].map(N);return {D:[h2[1],h2[2]],pD:[p[h1.indexOf(h2[1])],p[h1.indexOf(h2[2])]],b:[b[1],b[2]]};}
function busShare(k){return function(v,o1,T){var z=bus(T),a=rk(z.pD[k]*z.b[k]/100,1);if(!(z.pD[k]>0))return null;return {q:z.D[k]+'を選んで「バス」と答えた人は、回答者全体の何%か'+PR[1]+'。',ans:a,d:1,wr:[z.b[k],rk(z.pD[k]*z.b[1-k]/100,1),rk(z.pD[k]+z.b[k],1),rk(a*10,1)],u:'%',x:rk(z.b[k]*z.pD[k]/100,1),calc:z.pD[k]+'% × '+nb(z.b[k]/100)+' ≒ '+a+'%'};};}
tb4('g-hyo5-r7',[busShare(0),busShare(1),function(v,o1,T){var z=bus(T),a=rk((z.pD[0]*z.b[0]+z.pD[1]*z.b[1])/(z.pD[0]+z.pD[1]),1);
 return {q:z.D[0]+'と'+z.D[1]+'を選んだ人を合わせたうち、「バス」と答えた人の割合は何%か'+PR[1]+'。',ans:a,d:1,wr:[rk((z.b[0]+z.b[1])/2,1),rk((z.pD[0]*z.b[0]+z.pD[1]*z.b[1])/100,1),rk((z.pD[1]*z.b[0]+z.pD[0]*z.b[1])/(z.pD[0]+z.pD[1]),1),rk(a+3,1)],u:'%',x:rk(z.b[0]+(z.b[1]-z.b[0])*z.pD[1]/(z.pD[0]+z.pD[1]),1),
  calc:'('+z.pD[0]+' × '+nb(z.b[0]/100)+' ＋ '+z.pD[1]+' × '+nb(z.b[1]/100)+') ÷ ('+z.pD[0]+' ＋ '+z.pD[1]+') ≒ '+a+'%'};}]);
/* 行き先ごとの「乗用車」の割合（アを含む） */
function car(T){var t=T[0];return {h:t[0],p:t[1].map(N),r:t[2],T:N(t[2][5])};}
function carShare(pickJ){return function(v,o1,T){var z=car(T),j=pickJ(),rj=N(z.r[j]),s=0;for(var i=2;i<=4;i++)s+=z.p[i]*N(z.r[i]);var W=(z.T*100-s)/z.p[1],a=rk(z.p[j]*rj/z.T,0),a2=rk(z.p[j]*rj/(s+z.p[1]*r(W))*100,0);if(a!==a2)return null;
 return {q:'「乗用車」と答えた人のうち、'+z.h[j]+'を選んだ人の割合は何%か'+PR[0]+'。',ans:a,wr:[rj,z.p[j],rk(z.p[j]*rj/100,0),rk(rj/z.T*100,0)],u:'%',x:a2,calc:z.h[j]+'で乗用車 '+nb(z.p[j]/100)+' × '+nb(rj/100)+' ＝ '+nb(z.p[j]*rj/10000)+'<br>'+nb(z.p[j]*rj/10000)+' ÷ '+nb(z.T/100)+' ≒ '+a+'%'};};}
tb4('g-hyo5-r8',[carShare(function(){return pk([2,3]);}),carShare(function(){return 4;}),function(v,o1,T){var z=car(T),j=pk([2,3,4]),rj=N(z.r[j]),a=rk(z.p[j]*(100-rj)/100,1);
 return {q:z.h[j]+'を選んで「乗用車」以外と答えた人は、回答者全体の何%か'+PR[1]+'。',ans:a,d:1,wr:[100-rj,rk(z.p[j]*rj/100,1),rk(100-z.T,1),rk(a+2,1)],u:'%',x:rk(z.p[j]-z.p[j]*rj/100,1),calc:z.p[j]+'% × (1 − '+nb(rj/100)+') ≒ '+a+'%'};}]);
})();
