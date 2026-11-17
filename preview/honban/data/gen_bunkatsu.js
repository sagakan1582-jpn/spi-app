/* 分割払い：数値替えテンプレート（元の問題ごとに1つ。文はそのまま数値だけ変え、答えは問題文の数値から別の方法で検算） */
/* 数値替えテンプレートの共通部品：元の問題の数値だけを式で置き換える。
   NUMSWAP(分野,指標,段階,番号,{変数:[元の値,候補…]},{'元の数値':'式'},'条件式',検算)
   検算 function(n,v) は、できた問題文から読み取った数値 n（出てくる順）だけで答えを別に計算する（verify）。
   問題文・選択肢・内訳・図・計算の中の数値を、表に書いた元の数値ごとに置き換える（表にない数値はそのまま）。 */
var NUMSWAP=NUMSWAP||(function(){
 var TK=/\d+\/\d+|\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?/g;
 function dec(s){var i=String(s).indexOf('.');return i<0?0:String(s).length-i-1;}
 function fmt(v,cm){var s=String(v);return cm&&v>=1000?s.replace(/^\d+/,function(m){return m.replace(/\B(?=(\d{3})+$)/g,',');}):s;}
 function g(a,b){return b?g(b,a%b):a;}function frac(x,y){var d=g(x,y);return (x/d)+'/'+(y/d);}function lcm(a,b){return a*b/g(a,b);}function fr(x){for(var d=1;d<=100000;d++){var n=Math.round(x*d);if(Math.abs(n/d-x)<1e-9)return frac(n,d);}return 'X';}
 function deep(o,f){if(typeof o==='string')return f(o);if(Array.isArray(o))return o.map(function(x){return deep(x,f);});
  if(o&&typeof o==='object'){var r={};for(var k in o)r[k]=deep(o[k],f);return r;}return o;}
 function num(m){var p=m.split('/');return p.length>1?p[0]/p[1]:+m.replace(/,/g,'');}
 function like(t,r,z,cm){var k=t.match(TK)[0];r=Math.round(r*1e6)/1e6;return t.replace(k,(z||/\.0+$/.test(k))&&dec(k)?r.toFixed(dec(k)):fmt(r,cm||k.indexOf(',')>0));}
 function G(fd,lv,st,ix,P,M,ok,V){var B=BANK[fd][lv][st],O=B[ix];if(!O||O.make)return;
  var nm=Object.keys(P),ks=Object.keys(M),fn={},cm=/\d,\d{3}/.test(O.q),z=/\d\.0(?!\d)/.test(O.c.join());
  ks.forEach(function(k){fn[k]=new Function(nm.join(','),'frac','lcm','fr','return ('+M[k]+');');});
  var okf=ok?new Function(nm.join(','),'return ('+ok+');'):null;
  B.push({id:(O.id||fd+lv+st+ix)+'-g',verify:function(v,o){var r=V((o.q.match(TK)||[]).map(num),v);return typeof r==='string'?r:like(O.c[O.a],r,z,cm);},make:function(R){
   for(var t=0;t<400;t++){var p=nm.map(function(n){return R.pick(P[n]);});if(okf&&!okf.apply(null,p))continue;
    var nv={},bad=0;for(var i=0;i<ks.length&&!bad;i++){var k=ks[i],v=fn[k].apply(null,p.concat([frac,lcm,fr]));
     if(typeof v==='string'){nv[k]=v;continue;}v=Math.round(v*1e6)/1e6;
     if(!(v>0)||dec(v)>dec(k))bad=1;else nv[k]=(z||/\.0+$/.test(k))&&dec(k)?v.toFixed(dec(k)):fmt(v,cm||k.indexOf(',')>0);}
    if(bad)continue;
    var o=deep({q:O.q,c:O.c,inw:O.inw,fig:O.fig,calc:O.calc},function(s){return s.replace(TK,function(m){return m in nv?nv[m]:m;});});
    var nc=o.c.map(function(x){return x.replace(TK,function(m){return m.indexOf('/')<0?String(+m.replace(/,/g,'')):m;});});
    if(nc.some(function(x,j){return nc.indexOf(x)!==j;}))continue;
    var ord=R.shuffle(o.c.map(function(x,j){return j;}));o.c=ord.map(function(j){return o.c[j];});
    o.a=Array.isArray(O.a)?O.a.map(function(j){return ord.indexOf(j);}).sort():ord.indexOf(O.a);
    o.v={};nm.forEach(function(n,i){o.v[n]=p[i];});['inwh','sec'].forEach(function(k){if(O[k]!=null)o[k]=O[k];});return o;}
   throw new Error('gen');}});}
 return G;})();
(function(){
function g(a,b){return b?g(b,a%b):a;}
function FR(x){for(var d=1;d<=100000;d++){var m=Math.round(x*d);if(Math.abs(m/d-x)<1e-9){var c=g(m,d);return (m/c)+'/'+(d/c);}}return 'X';}
function HALF(first,each){var s=first,m=1;while(s<=0.5+1e-9){s+=each;m++;}return m;}
function CNT(first,each){var s=first,m=1;while(s<1-1e-9){s+=each;m++;}return Math.abs(s-1)<1e-9?m:-1;}
var VV={concept0:function(n){return n[0]*(1-n[1])/n[2];},
concept1:function(n){return FR((1-n[0])/n[1]);},
concept2:function(n){var r=1-n[0];return FR((r+r*n[2])/n[1]);},
practice0:function(n){return FR((1-n[0])/n[1]);},
practice1:function(n){return FR(n[0]+(1-n[0])/n[1]);},
practice2:function(n){return n[0]*n[1]+n[3]*n[0]*(1-n[1])/n[2];},
practice3:function(n){var r=1-n[0];return FR(r*(1+n[2])/n[1]);},
practice4:function(n){return CNT(n[1],n[3]);},
practice5:function(n){return FR(1-n[0]-n[2]*(1-n[0])/n[1]);},
applied0:function(n){return FR((1-n[0])/n[1]);},
applied1:function(n){return FR((1-n[0]-n[1])/n[2]);},
applied2:function(n){var r=1-n[0];return FR(r*(1+n[2])/n[1]);},
applied3:function(n){return HALF(n[1],n[3]);},
applied4:function(n){var r=n[0]*(1-n[1]);return (r+r*n[3])/n[2];},
applied5:function(n){return FR(1-n[0]*n[2]);},
applied6:function(n){return HALF(n[1],(1-n[1])/n[2]);},
applied7:function(n){var r=1-n[0];return FR(r*(1+n[2])/n[1]);},
real0:function(n){return FR((1-n[0])/n[1]);},
real1:function(n){return FR((1-n[0]-n[1])/n[2]);},
real2:function(n){var r=1-n[0];return FR(r*(1+n[2])/n[1]);},
real3:function(n){var r=1-n[0];return FR(r*(1+n[2])/n[1]);},
real4:function(n){return FR(n[0]+(1-n[0])/n[1]);},
real5:function(n){return HALF(n[1],n[3]);},
real6:function(n){var r=n[0]*(1-n[1]);return (r+r*n[3])/n[2];},
real7:function(n){return FR(1-n[3]*n[0]/(1+n[1]));},
real8:function(n){return CNT(n[0],n[1])+0;},
real9:function(n){return FR(1-n[0]-n[2]*(1-n[0])/n[1]);}};
function T(s,i,P,M,ok){NUMSWAP('分割払い',4,s,i,P,M,ok,VV[s+i]);}
var R0='(P-P/a)/k';
T('concept',0,{P:[36000,24000,48000,60000,72000,30000],a:[3,4,2,5,6],k:[6,4,5,3,8,10]},{36000:'P','1/3':'frac(1,a)','2/3':'frac(a-1,a)',5:'k-1',6:'k',12000:'P/a',24000:'P-P/a',4000:R0,6000:'P/k',2000:R0+'/2',3000:R0+'*3/4',8000:R0+'*2'});
T('concept',1,{a:[4,5,6,7,8,10]},{'1/4':'frac(1,a)',3:'a-1',2:'a-2','3/4':'frac(a-1,a)','1/12':'frac(1,a*(a-1))','1/6':'frac(2,a*(a-1))','1/3':'frac(1,a-1)'});
var A2='(f+1)/(2*f*k)';
T('concept',2,{f:[5,4,3,6,8,10,7],k:[2]},{2:'k','1/5':'frac(1,f)','1/10':'frac(1,2*f)','3/5':'fr((f+1)/(2*f))','3/10':'fr('+A2+')','1/4':'fr(1/(2*k))','1/3':'fr(1/(k+1))','2/5':'fr(2/(k+3))'},A2+'<1');
var PK='(a-1)/(a*k)';
T('practice',0,{a:[5,4,3,6,7,9],k:[8,6,4,5,3,12]},{'1/5':'frac(1,a)',8:'k',7:'k-1','4/5':'frac(a-1,a)','1/10':'fr('+PK+')','1/40':'fr(1/(a*k))','1/20':'fr(2/(a*k))','1/8':'frac(1,k)'});
T('practice',1,{a:[3,4,5,6],k:[4,3,5,6,8]},{'1/3':'frac(1,a)',4:'k',3:'k-1','2/3':'frac(a-1,a)','1/6':'fr('+PK+')','1/2':'fr(1/a+'+PK+')','5/12':'fr(1/a+'+PK+'/2)','7/12':'fr(1/a+1.5*'+PK+')'});
var Q2='(P-P/a)/k';
T('practice',2,{P:[60000,48000,72000,36000,90000],a:[4,3,6,2],k:[5,4,6,3,8],j:[3,2,4]},{60000:'P','1/4':'frac(1,a)','3/4':'frac(a-1,a)',4:'k-1',5:'k',3:'j',15000:'P/a',9000:Q2,45000:'P-P/a',42000:'P/a+j*'+Q2,27000:'j*'+Q2,36000:'(j+1)*'+Q2,51000:'P/a+(j+1)*'+Q2},'j<k');
T('practice',3,{a:[3,4,5,6,2],f:[4,3,5,2,6]},{'1/3':'frac(1,a)',5:'f+1',4:'f','1/4':'frac(1,f)','2/3':'frac(a-1,a)','1/6':'fr((a-1)/(a*f))','5/6':'fr((a-1)/a*(1+1/f))','2/15':'fr((a-1)/(a*(f+1)))','1/5':'frac(1,f+1)','5/24':'fr((a-1)/(a*f)*5/4)'});
var C4='b*(a-1)/a';
T('practice',4,{a:[6,4,3,5,8],b:[12,8,9,10,15,16,24]},{'1/6':'frac(1,a)','1/12':'frac(1,b)','5/6':'frac(a-1,a)',10:C4,11:C4+'+1',9:C4+'-1',12:C4+'+2',13:C4+'+3'},'b>a&&'+C4+'>2');
T('practice',5,{a:[5,6,7,8,9],j:[2,1,3,4]},{'1/5':'frac(1,a)',4:'a-1',3:'a-2','4/5':'frac(a-1,a)',2:'j','3/5':'frac(1+j,a)','2/5':'frac(a-1-j,a)','3/10':'fr((a-1-j)/a-1/(2*a))','1/2':'fr((a-1-j)/a+1/(2*a))'},'j<a-2');
T('applied',0,{a:[6,5,4,3,8],k:[10,8,6,5,12,4]},{'1/6':'frac(1,a)',10:'k',9:'k-1','5/6':'frac(a-1,a)','1/12':'fr('+PK+')','1/60':'fr(1/(a*k))','1/16':'fr(1/(a+k))','1/10':'frac(1,k)'});
var RB='(1-1/a-1/b)';
T('applied',1,{a:[4,5,6,3],b:[3,4,5,6,8],k:[5,4,6,7,3]},{'1/4':'frac(1,a)','1/3':'frac(1,b)',5:'k',4:'k-1','5/12':'fr'+RB,'1/12':'fr('+RB+'/k)','1/20':'fr(1/(a*k))','1/15':'fr(1/(b*k))','1/10':'fr(1/(2*k))','1/6':'fr(2*'+RB+'/k)'},'a!=b');
var TT='(a-1)/a*(1+1/f)';
T('applied',2,{a:[4,3,5,6],k:[6,4,5,8,10],f:[9,5,4,8,3,6]},{'1/4':'frac(1,a)',6:'k',5:'k-1','1/9':'frac(1,f)','3/4':'frac(a-1,a)','1/12':'fr((a-1)/(a*f))','5/6':'fr('+TT+')','5/36':'fr('+TT+'/k)','1/8':'fr('+PK+')','1/6':'frac(1,k)','5/24':'fr('+TT+'/a)'});
var H3='(1/2-1/a)*b';
T('applied',3,{a:[4,6,3,8,5],b:[12,18,24,6,10,20,30]},{'1/4':'frac(1,a)','1/12':'frac(1,b)',3:H3,4:H3+'+1',5:H3+'+2',6:H3+'+3',7:H3+'+4','7/12':'fr(1/2+1/b)'},'b>a');
var R4='P*(a-1)/a';
T('applied',4,{P:[48000,36000,72000,60000,96000],a:[4,3,2,6],k:[6,4,5,3,8]},{'1/4':'frac(1,a)',6:'k',5:'k-1','1/8':'fr((a-1)/(a*k))',12000:'P/a','1/6':'frac(1,k)','3/4':'frac(a-1,a)',48000:'P',36000:R4,6000:R4+'/k',7000:R4+'*(1+1/k)/k',8000:'P/k',6500:'('+R4+'/k+'+R4+'*(1+1/k)/k)/2',7500:R4+'*(1+1/k)/k+('+R4+'*(1+1/k)/k-'+R4+'/k)/2'});
T('applied',5,{m:[5,4,6,7,8,9,10]},{4:'m-1',3:'m-2','1/5':'frac(1,m)','4/5':'frac(m-1,m)','1/20':'frac(1,m*(m-1))','1/10':'frac(2,m*(m-1))','1/4':'frac(1,m-1)'});
var P6='((a-1)/(a*k))',T6='(1/2-1/a)/'+P6;
T('applied',6,{a:[3,4,5,6],k:[8,6,4,9,10,12]},{'1/3':'frac(1,a)',8:'k','2/3':'frac(a-1,a)','1/12':'fr('+P6+')',2:T6,3:T6+'+1',4:T6+'+2',5:T6+'+3',6:T6+'+4','7/12':'fr(1/2+'+P6+')'});
T('applied',7,{a:[5,4,3,6,7],f:[8,5,4,3,6,9]},{'1/5':'frac(1,a)',9:'f+1',8:'f','1/8':'frac(1,f)','4/5':'frac(a-1,a)','1/10':'fr((a-1)/(a*f))','9/10':'fr('+TT+')','2/45':'fr((a-1)/(a*(f+1))/2)','4/45':'fr((a-1)/(a*(f+1)))','1/9':'frac(1,f+1)'});
T('real',0,{q:[[2,9],[3,10],[2,7],[3,8],[2,5],[3,11],[4,9],[3,7]]},{'2/9':'frac(q[0],q[1])',7:'q[1]-q[0]',6:'q[1]-q[0]-1','7/9':'frac(q[1]-q[0],q[1])','1/9':'frac(1,q[1])','1/63':'frac(1,q[1]*(q[1]-q[0]))','2/63':'frac(q[0],q[1]*(q[1]-q[0]))','1/7':'frac(1,q[1]-q[0])'});
var K1='(a*b-a-b)';
T('real',1,{a:[5,3,4,6],b:[4,5,3,7]},{'1/5':'frac(1,a)','1/4':'frac(1,b)',11:K1,10:K1+'-1','11/20':'frac('+K1+',a*b)','1/20':'frac(1,a*b)','1/40':'frac(1,2*a*b)','1/22':'frac(1,2*'+K1+')','1/11':'frac(1,'+K1+')'},'a!=b&&'+K1+'>2');
T('real',2,{a:[4,3,5,6],k:[8,6,5,10,4],f:[15,5,9,10,4,6]},{'1/4':'frac(1,a)',8:'k',7:'k-1','1/15':'frac(1,f)','3/4':'frac(a-1,a)','1/20':'fr((a-1)/(a*f))','4/5':'fr('+TT+')','1/10':'fr('+TT+'/k)','3/32':'fr('+PK+')','2/15':'fr('+TT+'/k*4/3)','3/20':'fr('+TT+'/k*1.5)'},TT+'/k*1.5<1');
var A3='(a-1)/(a*f)';
T('real',3,{a:[3,4,5,6,2],f:[10,8,5,6,4,9]},{'1/3':'frac(1,a)',11:'f+1',10:'f','1/10':'frac(1,f)','2/3':'frac(a-1,a)','1/15':'fr('+A3+')','11/15':'fr('+TT+')','2/33':'fr((a-1)/(a*(f+1)))','1/12':'fr('+A3+'*5/4)','1/11':'frac(1,f+1)'});
T('real',4,{q:[[3,10],[2,9],[3,8],[2,7],[4,9],[3,11],[5,12]]},{'3/10':'frac(q[0],q[1])',7:'q[1]-q[0]',6:'q[1]-q[0]-1','7/10':'frac(q[1]-q[0],q[1])','1/10':'frac(1,q[1])','2/5':'frac(q[0]+1,q[1])','13/35':'fr(q[0]/q[1]+1/(2*(q[1]-q[0])))','1/2':'frac(q[0]+2,q[1])'});
var H5='(1/2-1/a)*b';
T('real',5,{a:[6,4,3,8,5],b:[18,12,24,30,16,20]},{'1/6':'frac(1,a)','1/18':'frac(1,b)','1/3':'fr(1/2-1/a)','6/18':'Math.round('+H5+')+"/"+b',6:H5,7:H5+'+1',8:H5+'+2',9:H5+'+3',10:H5+'+4'},'b>a&&'+H5+'>1');
var R6='P*(a-1)/a';
T('real',6,{P:[84000,72000,96000,60000,108000],a:[4,3,6,2],f:[9,5,6,8,4]},{84000:'P','3/4':'frac(a-1,a)','1/4':'frac(1,a)',10:'f+1',9:'f','1/9':'frac(1,f)',21000:'P/a','1/12':'fr((a-1)/(a*f))',63000:R6,7000:R6+'/f',6300:R6+'/(f+1)',8400:'P/(f+1)',6750:R6+'/f-250',7700:R6+'/f*1.1'});
T('real',7,{f:[5,4,3,6,7],D:[9,10,12,8,11,14,7]},{6:'f+1','1/5':'frac(1,f)',5:'f','1/9':'frac(1,D)','2/3':'frac(f+1,D)','5/6':'frac(f,f+1)','5/9':'frac(f,D)','4/9':'frac(D-f,D)','1/3':'frac(D-f-1,D)'},'D-f>2');
var C8='(1-1/a)*b';
T('real',8,{a:[6,4,3,5,8],b:[24,12,18,20,30,16]},{'1/6':'frac(1,a)','1/24':'frac(1,b)','5/6':'frac(a-1,a)',20:C8,21:C8+'+1',19:C8+'-1',22:C8+'+2',24:C8+'+4'},'b>a');
T('real',9,{j:[3,2,4,5]},{'1/8':'frac(1,2*j+2)',7:'2*j+1',6:'2*j','7/8':'frac(2*j+1,2*j+2)',3:'j','1/2':'frac(j+1,2*j+2)','3/8':'frac(j,2*j+2)','5/8':'frac(j+2,2*j+2)','7/16':'frac(2*j+1,4*j+4)','9/16':'frac(2*j+3,4*j+4)'});
})();
