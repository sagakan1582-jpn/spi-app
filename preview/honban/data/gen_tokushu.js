/* 特殊算：数値替えテンプレート（元の問題ごとに1つ。文はそのまま数値だけ変え、答えは問題文の数値から別の方法で検算） */
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
function FX(lo,hi,f){for(var x=lo;x<=hi;x++)if(f(x))return x;return -1;}
function MAXB(a,b,n,B){var m=-1;for(var x=0;x<=n;x++)if(a*x+b*(n-x)<=B)m=x;return m;}
var VV={concept0:function(n){return FX(0,n[4],function(x){return n[1]*(n[4]-x)+n[3]*x===n[5];});},
concept1:function(n){return FX(0,200,function(x){return n[0]+x===n[2]*(n[1]+x);});},
concept2:function(n){return n[0]/n[1]+1;},
practice0:function(n){return MAXB(n[1],n[3],n[4],n[5]);},
practice1:function(n){return FX(0,200,function(x){return n[0]+x===n[2]*(n[1]+x);});},
practice2:function(n){return n[0]/n[1];},
practice3:function(n){return n[0]/n[1]-1;},
practice4:function(n){return FX(0,n[2],function(x){return n[0]*x+n[1]*(n[2]-x)===n[3];});},
practice5:function(n){return FX(0,200,function(x){return n[2]+n[3]+2*x===n[0]+x;});},
applied0:function(n){return FX(0,n[4],function(x){return n[1]*x+n[3]*(n[4]-x)===n[5];});},
applied1:function(n){return FX(0,n[7],function(x){return n[2]*x+n[4]*(n[7]-x)===n[9]*n[7];});},
applied2:function(n){return FX(0,200,function(y){return n[2]+n[3]+2*y>n[0]+y;});},
applied3:function(n){return (n[0]/n[1]+1)*2;},
applied4:function(n){var R=n[4]-n[6],P=n[0]-6*n[6];return FX(0,R,function(x){return 4*x+5*(R-x)===P;});},
applied5:function(n){return FX(0,n[0],function(x){return x+(x-n[1])===n[0];});},
applied6:function(n){return MAXB(n[1],n[3],n[4],n[5]);},
applied7:function(n){return n[0]/(n[1]-1);},
real0:function(n){return MAXB(n[3],n[1],n[4],n[5]);},
real1:function(n){return FX(0,n[7],function(x){return n[2]*x+n[4]*(n[7]-x)===n[9]*n[7];});},
real2:function(n){return FX(0,200,function(y){return n[2]+n[3]+2*y>n[0]+y;});},
real3:function(n){var R=n[4]-n[6],P=n[0]-6*n[6];return FX(0,R,function(x){return 4*x+5*(R-x)===P;});},
real4:function(n){var x=FX(0,n[4],function(x){return 4*x+5*x+6*(n[4]-2*x)===n[0];});return n[4]-2*x;},
real5:function(n){return FX(0,200,function(x){return n[0]+x===3*(n[1]+x);});},
real6:function(n){return n[0]*1000/n[1];},
real7:function(n){return (n[0]/n[1]-1)*2;},
real8:function(n){return FX(0,n[0],function(x){return x+(x-n[1])===n[0];});},
real9:function(n){return MAXB(n[1],n[3],n[4],n[5]);}};
function T(s,i,P,M,ok){NUMSWAP('特殊算',4,s,i,P,M,ok,VV[s+i]);}
T('concept',0,{a:[50,60,40,70,30],b:[80,100,90,120,70],n:[10,12,8,15,20],x:[5,4,6,3,7,8]},{50:'a',80:'b',10:'n',650:'a*(n-x)+b*x',30:'b-a',150:'(b-a)*x',5:'x',3:'x-2',4:'x-1',6:'x+1',7:'x+2'},'b>a&&x+2<n');
var X1='(F-3*C)/2';
T('concept',1,{F:[40,42,44,38,46,50],C:[10,12,8,11,14,9]},{40:'F',10:'C',30:'3*C',5:X1,2:X1+'-3',4:X1+'-1',6:X1+'+1'},X1+'>3');
T('concept',2,{d:[10,5,6,8,12,15,20]},{100:'d*d',10:'d',9:'d-1',11:'d+1',12:'d+2',20:'2*d'});
var R0='(B-b*n)/(a-b)';
T('practice',0,{a:[100,120,90,80,110],b:[60,80,50,40,70],n:[15,12,20,18,16],B:[1200,1300,1500,1000,1100,1400]},{100:'a',60:'b',15:'n',1200:'B',40:'a-b',300:'B-b*n','7.5':R0,7:'Math.floor('+R0+')',5:'Math.floor('+R0+')-2',6:'Math.floor('+R0+')-1',8:'Math.floor('+R0+')+1',9:'Math.floor('+R0+')+2'},'a>b&&'+R0+'%1!=0&&'+R0+'>3&&'+R0+'<n-2');
var X2='(M-3*C)/2';
T('practice',1,{M:[34,36,40,38,44,42],C:[6,8,10,9,12,7]},{34:'M',6:'C',18:'3*C',8:X2,4:X2+'-4',10:X2+'+2',12:X2+'+4'},X2+'>4');
T('practice',2,{L:[120,180,150,240,200,300],d:[6,5,8,10,12,15]},{120:'L',6:'d',20:'L/d',19:'L/d-1',21:'L/d+1',22:'L/d+2',24:'L/d+4'},'L/d>6');
T('practice',3,{d:[9,5,6,8,10,12,7]},{90:'d*(d+1)',9:'d',10:'d+1',8:'d-1',11:'d+2',12:'d+3'});
T('practice',4,{n:[10,8,12,15,9,20,11]},{10:'n',48:'24+6*(n-6)',60:'6*n'});
var X5='F-k1-k2';
T('practice',5,{F:[42,40,45,38,44,48],k1:[10,12,9,11,8],k2:[8,6,7,5,4]},{42:'F',10:'k1',8:'k2',18:'k1+k2',24:X5,20:X5+'-4',22:X5+'-2',26:X5+'+2'},'k1>k2&&'+X5+'>k1+k2+4');
T('applied',0,{a:[80,90,60,100,70],b:[50,60,40,30,20],n:[20,18,25,16,24],x:[10,8,12,9,11,7]},{80:'a',50:'b',20:'n',1300:'a*x+b*(n-x)',30:'a-b',300:'(a-b)*x',10:'x',6:'x-4',8:'x-2',12:'x+2',14:'x+4'},'a>b&&x+4<n&&x>4');
var X6='1000*(q-A)/(q-p)';
T('applied',1,{p:[200,180,150,240,220],q:[260,240,250,300,280],A:[224,216,210,270,250,230]},{200:'p',260:'q',224:'A',260000:'q*1000',60:'q-p',224000:'A*1000',600:X6,400:X6+'-200',500:X6+'-100',700:X6+'+100',800:X6+'+200'},'p<A&&A<q&&'+X6+'%100==0&&'+X6+'>200&&'+X6+'<800');
var X7='F-k1-k2';
T('applied',2,{F:[45,42,48,40,50,44],k1:[15,14,12,16,13],k2:[10,9,8,11,7]},{45:'F',15:'k1',10:'k2',25:'k1+k2',20:X7,19:X7+'-1',21:X7+'+1',22:X7+'+2'},'k1>k2&&Math.abs('+X7+'-(k1+k2))>2');
T('applied',3,{L:[240,180,300,200,360,150],d:[12,10,15,20,9,6]},{240:'L',12:'d',20:'L/d',21:'L/d+1',40:'2*L/d',42:'2*(L/d+1)',44:'2*(L/d+2)'},'L/d>4');
T('applied',4,{N:[20,18,22,24,25,19,17]},{20:'N',100:'80+5*(N-16)',12:'N-8',52:'32+5*(N-16)',60:'5*(N-8)'});
var X8='(T+d)/2';
T('applied',5,{T:[80,76,90,64,84,100],d:[12,10,14,8,16,6]},{80:'T',12:'d',92:'T+d',46:X8,34:X8+'-d',40:'T/2',44:X8+'-2',52:X8+'+6'},'(T+d)%2==0&&d!=2&&d!=6');
var R6='(B-b*n)/(a-b)';
T('applied',6,{a:[120,100,150,110,130],b:[80,60,90,70,50],n:[25,20,24,30,18],B:[2500,2000,2800,3000,2200]},{120:'a',80:'b',25:'n',2500:'B',40:'a-b',500:'B-b*n','12.5':R6,12:'Math.floor('+R6+')',10:'Math.floor('+R6+')-2',11:'Math.floor('+R6+')-1',13:'Math.floor('+R6+')+1',15:'Math.floor('+R6+')+3'},'a>b&&'+R6+'%1!=0&&'+R6+'>3&&'+R6+'<n-3');
T('applied',7,{L:[150,120,180,200,240,90],t:[16,13,11,21,25,10]},{150:'L',16:'t',15:'t-1',10:'L/(t-1)',8:'L/(t-1)-2',9:'L/(t-1)-1',12:'L/(t-1)+2'},'L/(t-1)>3&&L/(t-1)+2!=t-1');
var R8='(B-b*n)/(a-b)';
T('real',0,{b:[70,60,50,80,40],a:[90,80,100,110,70],n:[12,10,15,14,16],B:[1000,900,1200,1100,1300]},{70:'b',90:'a',12:'n',1000:'B',20:'a-b',160:'B-b*n',8:R8,6:R8+'-2',7:R8+'-1',9:R8+'+1',10:R8+'+2'},'a>b&&'+R8+'%1==0&&'+R8+'>2&&'+R8+'<n-2');
var X9='10000*(q-A)/(q-p)';
T('real',1,{p:[100,120,90,110,80],q:[115,135,105,130,95],A:[109,126,99,118,89,124]},{100:'p',115:'q',109:'A',1150000:'q*10000',15:'q-p',1090000:'A*10000',4000:X9,6000:'10000-'+X9,3000:X9+'-1000',3600:X9+'-400',4500:X9+'+500'},'p<A&&A<q&&'+X9+'%100==0&&'+X9+'>1000&&'+X9+'<9500');
var XA='F-k1-k2';
T('real',2,{F:[40,42,44,38,46,45],k1:[16,15,14,17,18],k2:[12,10,11,13,9]},{40:'F',16:'k1',12:'k2',28:'k1+k2',13:XA+'+1',10:XA+'-2',11:XA+'-1',14:XA+'+2'},'k1>k2&&'+XA+'>2');
T('real',3,{s:[22,20,24,18,26,15]},{22:'s',30:'s+8',165:'6*s+33',132:'6*s'});
T('real',4,{N:[30,25,28,32,35,26,40]},{30:'N',165:'6*N-15',180:'6*N',20:'N-10',16:'N-14',18:'N-12',22:'N-8',24:'N-6'});
var XB='(M-3*C)/2';
T('real',5,{M:[47,45,49,43,51,41],C:[11,13,10,9,14,12]},{47:'M',11:'C',33:'3*C',7:XB,5:XB+'-2',6:XB+'-1',8:XB+'+1',9:XB+'+2'},XB+'>2');
T('real',6,{L:[1200,1500,1800,900,2400,1000],d:[40,30,50,60,25,20]},{'1.2':'L/1000',1200:'L',40:'d',30:'L/d',29:'L/d-1',31:'L/d+1',32:'L/d+2',60:'2*L/d'});
T('real',7,{L:[360,240,300,420,480,270],d:[15,12,20,10,30,18]},{360:'L',15:'d',24:'L/d',23:'L/d-1',46:'2*(L/d-1)',48:'2*L/d',50:'2*(L/d+1)'},'L/d>3');
var XC='(T+d)/2';
T('real',8,{T:[75,81,69,87,93,77],d:[9,7,11,5,13,3]},{75:'T',9:'d',84:'T+d',42:XC,33:XC+'-d',38:XC+'-4',40:XC+'-2',45:XC+'+3'},'d!=4&&d!=2&&d!=7');
var RD='(B-b*n)/(a-b)';
T('real',9,{a:[80,90,70,100,60],b:[20,30,10,40,20],n:[30,25,35,28,32],B:[2000,1800,2200,2400,1900]},{80:'a',20:'b',30:'n',2000:'B',60:'a-b',1400:'B-b*n','23.3':'String(Math.floor('+RD+'*10)/10)',23:'Math.floor('+RD+')',21:'Math.floor('+RD+')-2',22:'Math.floor('+RD+')-1',24:'Math.floor('+RD+')+1',25:'Math.floor('+RD+')+2'},'a>b&&('+RD+'*10)%1!=0&&'+RD+'>3&&'+RD+'<n-2');
})();
