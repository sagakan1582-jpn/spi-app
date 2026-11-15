/* 数値替えテンプレートの共通部（gen_shugo.js・gen_wariai.js・gen_soneki.js で共有。先に読まれた1回だけ定義）
   元の問題（BANK[分野][指標][段階][番号]）の問題文の数字だけを差し替え、答え・選択肢・図・計算を新しい数値から作り直す。
   spec = {n:[問題文の数字の役割（先頭から順。0は変えない）], d:function(v){派生値を計算し v.ans を入れて返す},
     a:答えの名前（省略時 'ans'）, rg:{名前:[最小,最大,刻み]}（省略時は元の値の±40%・元の値と同じ細かさ）,
     ok:function(v){追加の条件}, c/calc/fig/inw:function(v,o){独自に作るとき}, keep:[置き換えない数字] }
   名前の頭文字：p＝%（図・計算では0.35の形も置き換え）、w＝割（0.3の形も）、r＝小数の割合、f＝小数可。それ以外は正の整数。 */
if(typeof GENV==='undefined'){GENV=(function(){
 var NUM=/\d+(?:,\d{3})*(?:\.\d+)?/g;
 function lab(all,pos,t){return all[pos-1]==='第'||(t==='1'&&/^(個|g)/.test(all.slice(pos+1)))||/^(年生|年前|年|歳|代|つの|位|月|日|号|番)/.test(all.slice(pos+t.length));}
 function qt(q){var r=[];q.replace(NUM,function(t,pos,all){if(!lab(all,pos,t))r.push({t:t});return t;});return r;}
 function num(s){return parseFloat(String(s).replace(/,/g,''));}
 function fmt(x){var s=String(+(+x).toFixed(6));return s;}
 function com(s){return s.replace(/^(\d+)(\d{3})(\.|$)/,function(m,a,b,c){return com(a)+','+b+c;});}
 function same(t,s){return /,/.test(t)?com(s):s;}
 function gran(x){var g=[1000,500,100,50,25,10,5,1,0.5,0.1,0.05,0.01];for(var i=0;i<g.length;i++){var q=x/g[i];if(Math.abs(q-Math.round(q))<1e-9)return g[i];}return 0.001;}
 function isInt(x){return Math.abs(x-Math.round(x))<1e-9;}
 function forms(k,v){var f=[k==='f3'?(+v).toFixed(3):fmt(v)];if(k[0]==='p')f.push(fmt(v/100));if(k[0]==='w')f.push(fmt(v/10));return f;}
 function comp(v){Object.keys(v).forEach(function(k){if(k[0]==='p'&&typeof v[k]==='number')v['rc'+k]=+(1-v[k]/100).toFixed(9);if(k[0]==='w'&&typeof v[k]==='number')v['rc'+k]=+(1-v[k]/10).toFixed(9);});return v;}
 function buildMap(O,N,spec){O=comp(O);N=comp(N);var m={},keep=spec.keep||[],ex=spec.x||[],late=[];Object.keys(O).forEach(function(k){
   if(typeof O[k]!=='number'||typeof N[k]!=='number'||ex.indexOf(k)>=0||k.slice(0,2)==='rc')return;var a=forms(k,O[k]),b=forms(k,N[k]);
   a.forEach(function(s,i){if((k[0]==='p'||k[0]==='w')&&i===0&&a.length>1){late.push([s,b[i]]);return;}add(s,b[i]);});});
   function add(s,t,lt){if(keep.indexOf(s)>=0)return;var e=m[s]=m[s]||{p:[],l:[]},L=lt?e.l:e.p;if(L.indexOf(t)<0)L.push(t);}
   Object.keys(O).forEach(function(k){if(k.slice(0,2)==='rc'&&typeof N[k]==='number')late.push([fmt(O[k]),fmt(N[k])]);});
   late.forEach(function(x){add(x[0],x[1],1);});for(var s in m){var e=m[s],L=e.p.length?e.p.slice():e.l.slice();L.all=e.p.concat(e.l.filter(function(t){return e.p.indexOf(t)<0;}));m[s]=L;}return m;}
 function sub(str,m,cnt){if(typeof str!=='string')return str;cnt=cnt||{};
   return str.replace(NUM,function(t,pos,all){var key=fmt(num(t));
     if(all[pos-1]==='第'||/^[^\d]?[位]/.test(all.slice(pos+t.length)))return t;
     if(m[t])key=t;var L=m[key];if(!L)return t;var i=cnt[key]||0;cnt[key]=i+1;return same(t,L[Math.min(i,L.length-1)]);});}
 function ev(s){s=s.replace(/,/g,'').replace(/×/g,'*').replace(/÷/g,'/').replace(/＋/g,'+').replace(/−/g,'-');if(!/^[\d\.\s\*\/\+\-\(\)]+$/.test(s))return NaN;try{return Function('return ('+s+')')();}catch(e){return NaN;}}
 function score(c){var sc=0;c.split('<br>').forEach(function(L){if(/≒|x|y|\//.test(L))return;var P=L.replace(/<[^>]+>/g,'').split('＝');
   for(var i=0;i+1<P.length;i++){var m=/[\d\(][\d\.,\s×÷＋−\(\)]*$/.exec(P[i]),n=/^\s*([\d\.,]+)/.exec(P[i+1]);if(!m||!n||!/[×÷＋−]/.test(m[0]))continue;
     var e=m[0];if((e.match(/\)/g)||[]).length>(e.match(/\(/g)||[]).length)continue;if((e.match(/\(/g)||[]).length>(e.match(/\)/g)||[]).length)e=e.replace(/^[^\(]*/,'');
     var rx=/^[\d\.,\s×÷＋−\(\)]+$/.test(P[i+1])&&/[×÷＋−]/.test(P[i+1])?ev(P[i+1]):num(n[1]),a=ev(e);sc+=Math.abs(a-rx)<1e-6*Math.max(1,Math.abs(rx))?1:-1;}});return sc;}
 function subC(str,m){if(typeof str!=='string')return str;var T=[];str.replace(NUM,function(t,pos){var k=fmt(num(t));if(m[t])k=t;var L=m[k];T.push({t:t,pos:pos,L:L&&L.all});return t;});
   var amb=T.filter(function(x){return x.L&&x.L.length>1;});var def=sub(str,m);if(!amb.length||amb.length>9)return def;
   function build(ch){var out='',last=0;T.forEach(function(x){out+=str.slice(last,x.pos);last=x.pos+x.t.length;var L=x.L;out+=L?same(x.t,L[ch.has(x)?ch.get(x):0]):x.t;});return out+str.slice(last);}
   var best=def,bs=score(def),tot=1;amb.forEach(function(x){tot*=x.L.length;});if(tot>3000)return def;
   for(var i=0;i<tot;i++){var r=i,ch=new Map();amb.forEach(function(x){ch.set(x,r%x.L.length);r=Math.floor(r/x.L.length);});var s2=build(ch),sc=score(s2);if(sc>bs){bs=sc;best=s2;}}
   return best;}
 function walk(o,m,c){c=c||{};if(Array.isArray(o))return o.map(function(x){return walk(x,m,c);});
   if(o&&typeof o==='object'){var r={};for(var k in o)r[k]=k==='n'?o[k]:walk(o[k],m,c);return r;}return sub(o,m,c);}
 function widths(o){if(Array.isArray(o)){o.forEach(widths);
     var ps=o.filter(function(x){return x&&typeof x==='object'&&typeof x.w==='number';});
     if(ps.length>1&&ps.length===o.length&&ps.every(function(x){return x.v&&/^\d/.test(x.v);})){var tv=0,tw=0;ps.forEach(function(x){tv+=num(x.v.replace(/[^\d,\.].*$/,''));tw+=x.w;});ps.forEach(function(x){x.w=+(tw*num(x.v.replace(/[^\d,\.].*$/,''))/tv).toFixed(3);});}
     else if(ps.length>1&&ps.length===o.length){var kn=ps.filter(function(x){var r=num(x.r);return x.r!==undefined&&x.r!==''&&r>0&&r<1;});
       if(kn.length){var tot=0,rest=0,ow=0;ps.forEach(function(x){tot+=x.w;});kn.forEach(function(x){rest+=num(x.r);});
         var un=ps.filter(function(x){return kn.indexOf(x)<0;});un.forEach(function(x){ow+=x.w;});
         if(rest<tot){kn.forEach(function(x){x.w=num(x.r);});un.forEach(function(x){x.w=ow?+((tot-rest)*x.w/ow).toFixed(3):0;});}}}}
   else if(o&&typeof o==='object')for(var k in o)widths(o[k]);}
 function valid(v,spec){for(var k in v){var x=v[k];if(typeof x!=='number')continue;if(!isFinite(x))return false;
     if(x<0||(x===0&&!(spec.z&&spec.z.indexOf(k)>=0)))return false;if('prwf'.indexOf(k[0])<0&&!isInt(x))return false;
     if(k[0]==='p'&&(!isInt(x*10)||(x>=100&&!spec.big)))return false;if(k[0]==='w'&&(!isInt(x)||x>=10))return false;}
   return !spec.ok||spec.ok(v);}
 function choices(o,O,N,spec,R){var an=spec.a||'ans',oc=o.c,ca=oc[o.a],mm=/^([\d,\.]+)(.*)$/.exec(ca);
   var unit=mm[2],oa=num(mm[1]),na=N[an],dec=Math.max.apply(null,oc.map(function(s){var m=/\.(\d+)/.exec(s);return m?m[1].length:0;}));
   var add=/%|倍|割/.test(unit),out=[],seen={},fix=oc.every(function(s){return /\./.test(s);});
   function show(x){var s=fix?(+x).toFixed(dec):fmt(x);return same(mm[1],s)+unit;}
   function put(x){if(!(x>=0)||!isFinite(x)||(unit==='%'&&x>=100&&na<100))return;x=dec?+(+x).toFixed(dec):Math.round(x);var s=show(x);if(seen[s])return;seen[s]=1;out.push(s);}
   put(na);
   oc.forEach(function(s,i){if(i===o.a)return;var m=/^([\d,\.]+)/.exec(s);if(!m)return;var w=num(m[1]),hit=null;
     Object.keys(O).forEach(function(k){if(hit===null&&k!==an&&typeof O[k]==='number'&&Math.abs(O[k]-w)<1e-9&&Math.abs(N[k]-na)>1e-9)hit=N[k];});
     if(hit!==null&&!seen[show(hit)])put(hit);else if(add)put(na+(w-oa));else{var x=w*na/oa,g=gran(na)>=10&&gran(w)>=10?10:1;put(Math.round(x/g)*g);}});
   var st=add?(dec?Math.pow(10,-dec)*5:(gran(oa)>=5?5:1)):Math.max(1,Math.min(gran(na),Math.pow(10,Math.floor(Math.log(na)/Math.LN10)))),k=1;
   while(out.length<5&&k<40){put(na+st*k);if(out.length<5)put(na-st*k);k++;}
   return G.sort(out.slice(0,5),0);}
 function G(field,lv,stage,idx,spec){
   var o=BANK[field][lv][stage][idx];if(!o)return;var an=spec.a||'ans';var toks=qt(o.q).map(function(x){return x.t;}),O={};
   (spec.n||[]).forEach(function(k,i){if(k)O[k]=num(toks[i]);});
   var base={};for(var k in O)base[k]=O[k];O=spec.d(O);
   var t={id:'g-'+(o.id||field+lv+stage+idx),make:function(R,force){var N=null,tries=0;
     while(tries++<4000){var v={};for(var k in base){var rg=spec.rg&&spec.rg[k],x=base[k];
         if(force)v[k]=x;else if(rg){var n=Math.floor((rg[1]-rg[0])/rg[2]+1e-9);v[k]=+(rg[0]+rg[2]*Math.floor(Math.random()*(n+1))).toFixed(6);}
         else{var g=gran(x);if(k[0]==='p'&&g>5)g=5;if(g>=x)g=gran(x/2);var lo=Math.max(g,Math.floor(x*0.5/g)*g),hi=Math.ceil(x*1.6/g)*g,n2=Math.round((hi-lo)/g);v[k]=+(lo+g*Math.floor(Math.random()*(n2+1))).toFixed(6);}}
       v=spec.d(v);var one=false;(spec.n||[]).forEach(function(kb){if(kb&&v[kb]===1&&O[kb]!==1)one=true;});if(one&&!force)continue;for(var kk in v)if(typeof v[kk]==='number')v[kk]=+v[kk].toFixed(9);if(valid(v,spec)&&(!isInt(O[an])||isInt(v[an]))&&(force||!(O[an]>0)||(v[an]>=O[an]*0.3&&v[an]<=O[an]*3))){N=v;break;}if(force)break;}
     if(!N)N=O;var m=buildMap(O,N,spec),i=0,cnt=0;
     var q=o.q.replace(NUM,function(tk,pos,all){if(lab(all,pos,tk))return tk;var k=(spec.n||[])[i++];return k?same(tk,fmt(N[k])):tk;});
     var r={q:q,inwh:o.inwh,sec:o.sec,inw:spec.inw?spec.inw(N,o):sub(o.inw,m)};
     var fg=spec.fig?spec.fig(N,o):walk(o.fig,m);if(fg&&!spec.fig)widths(fg);r.fig=fg;
     r.calc=spec.calc?spec.calc(N,o):subC(o.calc,m);
     var ch=spec.c?spec.c(N,O,R,o):choices(o,O,N,spec,R);r.c=ch.c;r.a=ch.a;r.v=N;return r;}};
   t.verify=function(v,r){if(!spec.chk)return 'verifyなし';var g={},tk=qt(r.q);(spec.n||[]).forEach(function(k,i){if(k&&tk[i])g[k]=num(tk[i].t);});
     var ok=r.c.filter(function(s){var m=/(\d+)分の(\d+)/.exec(s),m2=/^(\d+)\/(\d+)/.exec(s),x=m?m[2]/m[1]:m2?m2[1]/m2[2]:num((/[\d,\.]+/.exec(s)||['NaN'])[0]);return spec.chk(g,x);});
     return ok.length===1?ok[0]:'NG（当てはまる選択肢'+ok.length+'個）';};
   t._O=O;t._o=o;t._spec=spec;BANK[field][lv][stage].push(t);return t;}
 G.sort=function(out,ai){var v=out.map(function(s,i){var m=/(\d+)分の(\d+)/.exec(s),m2=/^(\d+)\/(\d+)/.exec(s);return {s:s,i:i,x:m?m[2]/m[1]:m2?m2[1]/m2[2]:num((/[\d,\.]+/.exec(s)||['0'])[0])};});
   v.sort(function(a,b){return a.x-b.x;});return {c:v.map(function(o){return o.s;}),a:v.map(function(o){return o.i;}).indexOf(ai)};};
 G.eq=function(a,b){return Math.abs(a-b)<1e-6*Math.max(1,Math.abs(b));};
 G.num=num;G.fmt=fmt;G.com=com;G.sub=sub;G.gran=gran;
 G.frac=function(a,b){function gc(x,y){return y?gc(y,x%y):x;}var g=gc(a,b);return [a/g,b/g];};
 return G;})();}

/* 割合・指標3〜5：元の問題の文はそのまま、数値だけ変える（wariai_3〜5.js より後に読み込む） */
(function(){
var F='割合',I=function(x){return Math.abs(x-Math.round(x))<1e-9;};
function T(l,s,i,n,d,x){x=x||{};x.n=n;x.d=d;x.keep=x.keep||(l==5?['1','1000']:['1']);return GENV(F,l,s,i,x);}
/* 型 */
function mul(v){v.r2=1-v.p/100;v.ans=v.W*v.p/100;return v;}            /* 量＝割合×全体 */
function dv(v){v.r2=1-v.p/100;v.ans=v.P/(v.p/100);return v;}            /* 全体＝量÷割合 */
function pc(v){v.Q=v.W-v.P;v.pA=v.P/v.W*100;return v;}                   /* 割合＝量÷全体 */
function rest(v){v.rC=1-v.p1/100-v.p2/100;v.ans=v.W*v.rC;return v;}     /* 残りの量 */
function restd(v){v.rC=1-v.p1/100-v.p2/100;v.ans=v.P/v.rC;return v;}    /* 残りから全体 */
function two(v){v.W=v.P/(v.p1/100);v.ans=v.W*v.p2/100;return v;}         /* 全体を出して別の内訳 */
function ch(v){v.A=v.W*v.p1/100;v.ans=v.A*v.p2/100;return v;}            /* 割合の割合（量） */
function chp(v){v.pA=v.p1*v.p2/100;return v;}                            /* 割合の割合（%） */
function chd(v){v.A=v.P/(v.p2/100);v.ans=v.A/(v.p1/100);return v;}      /* 内訳の内訳から全体 */
function up(v){v.r=1+v.p/100;v.ans=v.P/v.r;return v;}
function dn(v){v.r=1-v.p/100;v.ans=v.P/v.r;return v;}
var P='pA';
/* 指標3 */
T(3,'concept',0,['W','p'],mul,{rg:{W:[10,40,10],p:[10,90,10]}});
T(3,'concept',1,['p','P'],dv,{rg:{p:[10,50,10],P:[2,9,1]}});
T(3,'concept',2,['W','P'],pc,{a:P,rg:{W:[10,20,10],P:[1,9,1]}});
T(3,'practice',0,['W','p'],mul);
T(3,'practice',1,['p','P'],dv);
T(3,'practice',2,['W','P'],function(v){v.pB=100-v.P/v.W*100;return pc(v);},{a:P});
T(3,'practice',3,['p1','p2'],function(v){v.pA=100-v.p1-v.p2;return v;},{a:P});
T(3,'practice',4,['W','p1','p2'],rest);
T(3,'practice',5,['p','P'],dv);
T(3,'applied',0,['p1','P','p2'],two);
T(3,'applied',1,['p','P'],dv);
T(3,'applied',2,['W','p1','p2'],rest);
T(3,'applied',3,['W','p1','p2'],rest);
T(3,'applied',4,['W','P'],function(v){v.E=v.W-v.P;v.pA=v.E/v.W*100;v.pB=v.P/v.W*100;return v;},{a:P});
T(3,'applied',5,['p1','p2','P'],restd);
T(3,'applied',6,['W','p','X'],function(v){v.S=v.W*v.p/100;v.T=v.S-v.X;v.U=v.W-v.T;v.pA=v.T/v.W*100;return v;},{a:P});
T(3,'applied',7,['p','P'],function(v){v.W=v.P/(v.p/100);v.ans=v.W-v.P;return v;});
T(3,'real',0,['p1','P','p2'],two);
T(3,'real',1,['W','p'],function(v){v.r2=1-v.p/100;v.ans=v.W*v.r2;return v;});
T(3,'real',2,['W','p1','p2'],rest);
T(3,'real',3,['W','P'],pc,{a:P});
T(3,'real',4,['W','p','X'],function(v){v.S=v.W*v.p/100+v.X;v.T=v.W+v.X;v.U=v.T-v.S;var x=v.S/v.T;v.f3=Math.round(x*1000)/1000;v.pA=Math.round(x*100);return v;},{a:P,ok:function(v){var x=v.S/v.T*100;return Math.abs(x-Math.floor(x)-0.5)>0.01;}});
T(3,'real',5,['W','p'],mul);
T(3,'real',6,['p','P'],dv);
T(3,'real',7,['p1','p2','P'],restd);
T(3,'real',8,['P','p1','p2'],two);
T(3,'real',9,['W','P'],pc,{a:P});
/* 指標4 */
T(4,'concept',0,['W','p1','p2'],ch);
T(4,'concept',1,['W','p1','p2'],function(v){v.rO=1-v.p1/100-v.p2/100;v.ans=v.W*v.p2/100;return v;},{ok:function(v){return v.p1+v.p2<100;}});
T(4,'concept',2,['p1','p2'],chp,{a:P});
T(4,'practice',0,['W','p1','p2'],ch);
T(4,'practice',1,['p1','p2','P'],chd);
T(4,'practice',2,['p1','p2'],chp,{a:P});
T(4,'practice',3,['W','p1','p2','p3'],function(v){v.p2=100-v.p1;v.ans=v.W*v.p3/100;return v;});
T(4,'practice',4,['W','p1','p2'],function(v){v.A=v.W*v.p1/100;v.r2=1-v.p2/100;v.ans=v.A*v.r2;return v;});
T(4,'practice',5,['p','P'],up);
T(4,'applied',0,['W','W','p1','p2'],ch);
T(4,'applied',1,['A','B','p1','p2'],function(v){v.Y=v.B*v.p2/100;v.ans=v.A*v.p1/100;return v;});
T(4,'applied',2,['p1','p2','P'],chd);
T(4,'applied',3,['p1','p2'],chp,{a:P});
T(4,'applied',4,['p1','p2','p3','P'],function(v){v.rC=1-v.p1/100-v.p2/100;v.A=v.P/(v.p3/100);v.ans=v.A/v.rC;return v;});
T(4,'applied',5,['p','P'],dn);
T(4,'applied',6,['W','p1','p2','p3','p4'],function(v){v.p3=100-v.p1-v.p2;v.A=v.W*v.p1/100;v.ans=v.A*v.p4/100;return v;});
T(4,'applied',7,['W','p','P'],function(v){v.A=v.W*v.p/100;v.pA=v.P/v.A*100;return v;},{a:P});
T(4,'real',0,['W','p1','p2'],ch);
T(4,'real',1,['p1','p2','P'],chd);
T(4,'real',2,['p1','p2'],function(v){v.r2=1-v.p2/100;v.f3=v.p1/100*v.r2;v.pA=Math.round(v.f3*100);return v;},{a:P,ok:function(v){return I(v.f3*1000)&&!I(v.f3*200);}});
T(4,'real',3,['p1','p2','p3','P'],function(v){v.rC=1-v.p1/100-v.p2/100;v.A=v.P/(v.p3/100);v.ans=v.A/v.rC;return v;});
T(4,'real',4,['p','P'],up);
T(4,'real',5,['A','B','p1','p2'],function(v){v.Y=v.A*v.p1/100;v.ans=v.B*v.p2/100;return v;});
T(4,'real',6,['W','p','P'],function(v){v.A=v.W*v.p/100;v.pA=v.P/v.A*100;return v;},{a:P});
T(4,'real',7,['W','p1','p2'],ch);
T(4,'real',8,['p','P'],dn);
T(4,'real',9,['p1','p2'],function(v){v.f3=v.p1*v.p2/10000;v.pA=Math.round(v.f3*100);return v;},{a:P,keep:['1','65'],ok:function(v){return I(v.f3*1000)&&!I(v.f3*200);}});
/* 指標5（全体を1000と置く） */
var X2={x:['p1','p2']},X3={x:['p1','p2','p3']};
function ab(v){if(v.p2===undefined||v.fix2)v.p2=100-v.p1;v.A=10*v.p1;v.B=10*v.p2;return v;}
function mix2(v){ab(v);v.X=v.A*v.p3/100;v.Y=v.B*v.p4/100;return v;}
function o(x,y){var r={};for(var k in x)r[k]=x[k];for(k in y)r[k]=y[k];return r;}
T(5,'concept',0,['p1','p2','p3','p4'],function(v){v.p2=100-v.p1;mix2(v);v.f=(v.X+v.Y)/1000;v.pA=v.f*100;return v;},o(X2,{a:P}));
T(5,'concept',1,['p1','p2'],function(v){ab(v);v.Rm=1000-v.A;v.C=v.Rm-v.B;v.rC=v.C/1000;v.f=v.B/v.Rm;v.pA=v.f*100;return v;},{a:P});
FR(5,'concept',2,['d1',0,'d2',0],function(v){return {n:v.d1-1,d:v.d1*v.d2};},
 function(v,a){return '最初のお金を x と置く<br>残り x − x/'+v.d1+' ＝ '+FX(v.d1-1,v.d1)+'<br>文房具 '+FX(v.d1-1,v.d1)+' × 1/'+v.d2+' ＝ '+FX(a[0],a[1])+' → '+FJ(a[0],a[1]);},
 function(v){return [[1,v.d1*v.d2],[1,v.d2],[1,v.d1],[v.d1-1,v.d1],[2,v.d1*v.d2],[1,2],[1,3]];},{rg:{d1:[3,6,1],d2:[2,5,1]}});
T(5,'practice',0,['p1','p2','p3','p4'],function(v){v.p2=100-v.p1;mix2(v);v.fT=v.X/v.Y;return v;},o(X2,{a:'fT',ok:function(v){return I(v.fT*10);}}));
T(5,'practice',1,['p1','p2','p3','p4'],function(v){v.p2=100-v.p1;ab(v);v.S=10*v.p3;v.X=v.A*v.p4/100;v.Y=v.S-v.X;v.pA=v.Y/v.B*100;return v;},o(X2,{a:P}));
T(5,'practice',2,['p1','p2'],function(v){ab(v);v.Rm=1000-v.B;v.C=v.Rm-v.A;v.rC=v.C/1000;var x=v.A/v.Rm;v.f3=Math.floor(x*1000)/1000;v.pA=Math.round(x*100);return v;},{a:P,ok:function(v){return !I(v.A/v.Rm*1000);}});
T(5,'practice',3,['p1','p2'],function(v){v.rS=(v.p1+v.p2)/100;v.pA=(v.p1+v.p2)/2;return v;},{keep:['1','2','1000'],a:P,ok:function(v){return v.p1!==v.p2;}});
FR(5,'practice',4,['d',0,'d2','m'],function(v){v.d2=v.d;return {n:v.m-v.d+1,d:v.d};},
 function(v,a){return '最初の水を x、足した水を y と置く<br>x − x/'+v.d+' ＋ y ＝ '+FX(v.m,v.d)+'<br>y ＝ '+FX(v.m,v.d)+' − '+FX(v.d-1,v.d)+' ＝ '+FX(a[0],a[1])+' → '+FJ(a[0],a[1])+'倍';},
 function(v){return [[1,v.d],[1,2],[v.d-1,v.d],[1,1],[v.m,v.d],[v.m-v.d,v.d],[2,v.d]];},{u:'倍',rg:{d:[3,5,1],m:[4,9,1]},ok:function(v){return v.m>v.d&&v.m<2*v.d;}});
T(5,'practice',5,['p1','p2','k'],function(v){v.p2=100-v.p1;ab(v);v.WB=v.B*v.k;v.T=v.A+v.WB;var x=v.WB/v.T;v.f3=Math.floor(x*1000)/1000;v.pA=Math.round(x*100);return v;},o(X2,{a:P,rg:{k:[2,4,1]},ok:function(v){return !I(v.WB/v.T*1000);}}));
T(5,'applied',0,['p1','p2'],function(v){v.A=10*v.p1;v.X=v.A*v.p2/100;v.f=v.X/1000;v.pA=v.f*100;return v;},{a:P});
T(5,'applied',1,['p1','p2','p3','p4'],function(v){mix2(v);v.fT=v.Y/v.X;return v;},o(X2,{a:'fT',ok:function(v){return I(v.fT*10)&&v.p1+v.p2<100;}}));
T(5,'applied',2,['p1','p2','p3','p4'],function(v){v.p2=100-v.p1;mix2(v);v.f=(v.X+v.Y)/1000;v.pA=v.f*100;return v;},o(X2,{a:P}));
T(5,'applied',3,['p1','p2','p3','p4','p5','p6'],function(v){v.p3=100-v.p1-v.p2;ab(v);v.C=10*v.p3;v.S=10*v.p4;v.X=v.A*v.p5/100;v.Y=v.B*v.p6/100;v.Z=v.S-v.X-v.Y;v.pA=v.Z/v.C*100;return v;},o(X3,{a:P,ok:function(v){return v.pA<100;}}));
T(5,'applied',4,['p1','p2'],function(v){ab(v);v.Rm=1000-v.A;v.C=v.Rm-v.B;v.rC=v.C/1000;v.f=v.B/v.Rm;v.pA=v.f*100;return v;},{a:P});
T(5,'applied',5,['p1','p2','k'],function(v){v.p2=100-v.p1;ab(v);v.WA=v.A*v.k;v.T=v.WA+v.B;var x=v.WA/v.T;v.f3=Math.floor(x*1000)/1000;v.pA=Math.round(x*100);return v;},o(X2,{a:P,keep:['1','1000'],rg:{k:[2,4,1]},ok:function(v){return !I(v.WA/v.T*1000);}}));
T(5,'applied',6,['p1','p2'],function(v){v.rS=(v.p1+v.p2)/100;v.pA=(v.p1+v.p2)/2;return v;},{keep:['1','2','1000'],a:P,ok:function(v){return v.p1!==v.p2;}});
FR(5,'applied',7,['d',0,'m'],function(v){return {n:v.m*v.d-v.d+1,d:v.d};},
 function(v,a){return '最初のお金を x、アルバイト代を y と置く<br>x − x/'+v.d+' ＋ y ＝ '+v.m+'x<br>y ＝ '+v.m+'x − '+FX(v.d-1,v.d)+' ＝ '+FX(a[0],a[1])+' → '+FJ(a[0],a[1])+'倍';},
 function(v){return [[1,v.d],[v.d-1,v.d],[1,1],[v.m*v.d-v.d-1,v.d],[v.m*v.d+v.d-1,v.d],[v.m*v.d-v.d+1,v.d]];},{u:'倍',rg:{d:[3,6,1],m:[2,3,1]}});
T(5,'real',0,['p1','p2','p3','p4'],function(v){mix2(v);v.f=(v.X+v.Y)/1000;v.pA=v.f*100;return v;},o(X2,{a:P,ok:function(v){return v.p1+v.p2<100&&!I(v.pA);}}));
T(5,'real',1,['p1','p2','p3','p4'],function(v){mix2(v);v.fT=v.X/v.Y;return v;},o(X2,{a:'fT',ok:function(v){return I(v.fT*10)&&v.p1+v.p2<100;}}));
T(5,'real',2,['p1','p2','p3','p4','p5','p6'],function(v){v.p3=100-v.p1-v.p2;ab(v);v.C=10*v.p3;v.S=10*v.p4;v.X=v.A*v.p5/100;v.Y=v.B*v.p6/100;v.Z=v.S-v.X-v.Y;v.pA=v.Z/v.C*100;return v;},o(X3,{a:P,ok:function(v){return v.pA<100;}}));
T(5,'real',3,['p1','p2','p3'],function(v){ab(v);v.Cc=10*v.p3;v.Rm=1000-v.A;v.E=v.Rm-v.B-v.Cc;v.rE=v.E/1000;v.Q=v.Rm-v.B;var x=v.B/v.Rm;v.f3=Math.floor(x*1000)/1000;v.pA=Math.round(x*100);return v;},{a:P,ok:function(v){return !I(v.B/v.Rm*1000);}});
T(5,'real',4,['p1','p2',0,'P',0],function(v){v.yv=v.P/v.p1;v.ans=v.p2*v.yv;return v;},{keep:['1','100'],ok:function(v){return v.p1<v.p2;}});
T(5,'real',5,['p1','p2','p3','p4'],function(v){v.rX=(v.p1+v.p2)/100;v.rY=(v.p3+v.p4)/100;v.rS=v.rX+v.rY;v.pA=v.rS*50;return v;},{keep:['1','2','1000'],a:P});
T(5,'real',6,['m','n','p1','p2'],function(v){v.mn=v.m+v.n;v.rX=v.m/v.mn;v.rY=v.n/v.mn;v.X=1000*v.m/v.mn;v.Y=1000*v.n/v.mn;v.PX=v.X*v.p1/100;v.PY=v.Y*v.p2/100;v.S=v.PX+v.PY;v.f=v.S/1000;v.pA=v.f*100;return v;},{a:P,keep:['1000'],rg:{m:[1,4,1],n:[2,7,1]},ok:function(v){var g=GENV.frac(v.m,v.n);return g[0]===v.m&&v.m<v.n&&v.p1<v.p2;}});
FR(5,'real',7,['d1',0,'d2',0],function(v){var n=v.d2*v.d1-(v.d1-1)*(v.d2-1),d=(v.d2-1)*v.d1;return {n:n,d:d};},
 function(v,a){var L=(v.d2-1)*v.d1;return '最初の水を x、足した水を y と置く<br>足したあと x ÷ '+(v.d2-1)+'/'+v.d2+' ＝ '+FX(v.d2,v.d2-1)+'<br>'+FX(v.d1-1,v.d1)+' ＋ y ＝ '+FX(v.d2,v.d2-1)+'<br>y ＝ '+FX(v.d2*v.d1,L)+' − '+FX((v.d1-1)*(v.d2-1),L)+' ＝ '+FX(a[0],a[1])+' → '+FJ(a[0],a[1])+'倍';},
 function(v){return [[1,v.d1],[1,v.d2-1],[v.d1-1,v.d1],[1,v.d2],[2,3],[1,2]];},{u:'倍',rg:{d1:[3,6,1],d2:[3,5,1]},ok:function(v){return v.d1!==v.d2;}});
T(5,'real',8,['p1','p2','p3','p4','p5','p6'],function(v){v.p3=100-v.p1-v.p2;ab(v);v.C=10*v.p3;v.X=v.A*v.p4/100;v.Y=v.B*v.p5/100;v.Z=v.C*v.p6/100;v.f=(v.X+v.Y+v.Z)/1000;v.pA=v.f*100;return v;},o(X3,{a:P}));
T(5,'real',9,['p1','p2','p3','p4'],function(v){v.p2=100-v.p1;mix2(v);v.S=v.X+v.Y;var x=v.X/v.S;v.f3=Math.floor(x*1000)/1000;v.pA=Math.round(x*100);return v;},o(X2,{a:P,ok:function(v){return !I(v.X/v.S*1000);}}));
/* 分数の答え */
function FJ(n,d){return d===1?String(n):d+'分の'+n;}
function FX(n,d){return (n===1?'':n)+'x'+(d===1?'':'/'+d);}
function FR(l,s,i,n,fa,calc,cands,x){x=x||{};var u=x.u||'';x.d=function(v){var a=GENV.frac((fa(v)).n,fa(v).d);v.fn=a[0];v.fd=a[1];return v;};
 x.calc=function(v){return calc(v,[v.fn,v.fd]);};
 x.c=function(v,O,R){var out=[],seen={};function put(f){if(!(f[0]>0&&f[1]>0))return;var a=GENV.frac(f[0],f[1]),s=FJ(a[0],a[1])+u;if(seen[s])return;seen[s]=1;out.push(s);}
   put([v.fn,v.fd]);cands(v).forEach(put);var k=1;while(out.length<5){put([v.fn+k,v.fd]);put([v.fn,v.fd+k]);k++;}return GENV.sort(out.slice(0,5),0);};
 var ok0=x.ok;x.ok=function(v){return (!ok0||ok0(v))&&v.fn>0;};return T(l,s,i,n,x.d,x);}
})();
/* 別の方法（逆算・選択肢を当てはめる）で答えを確かめる */
(function(){var E=GENV.eq,A=function(a,b){return Math.abs(a-b)<0.5;};
var mul=function(g,x){return E(x*100,g.W*g.p);},dv=function(g,x){return E(x*g.p,g.P*100);},pc=function(g,x){return E(x*g.W,g.P*100);},
 rest=function(g,x){return E(x*100,g.W*(100-g.p1-g.p2));},restd=function(g,x){return E(x*(100-g.p1-g.p2),g.P*100);},two=function(g,x){return E(x*g.p1,g.P*g.p2);},
 ch=function(g,x){return E(x*10000,g.W*g.p1*g.p2);},chp=function(g,x){return E(x*100,g.p1*g.p2);},chd=function(g,x){return E(x*g.p1*g.p2,g.P*10000);},
 up=function(g,x){return E(x*(100+g.p),g.P*100);},dn=function(g,x){return E(x*(100-g.p),g.P*100);},
 a4=function(g,x){return E(x*(100-g.p1-g.p2)*g.p3,g.P*10000);},a7=function(g,x){return E(x*g.W*g.p,g.P*10000);},
 mix=function(g,x){return E(x*100,g.p1*g.p3+g.p2*g.p4);},sel=function(g,x){return E(x*(100-g.p1),g.p2*100);},sel3=function(g,x){return E(x*g.p3,100*g.p4-g.p1*g.p5-g.p2*g.p6);},
 half=function(g,x){return E(2*x,g.p1+g.p2);};
var V={
'3concept':[mul,dv,pc],'3practice':[mul,dv,pc,function(g,x){return E(x+g.p1+g.p2,100);},rest,dv],
'3applied':[two,dv,rest,rest,function(g,x){return E(x*g.W,(g.W-g.P)*100);},restd,function(g,x){return E(x*g.W,(g.W*g.p/100-g.X)*100);},function(g,x){return E((x+g.P)*g.p,g.P*100);}],
'3real':[two,function(g,x){return E(x*100,g.W*(100-g.p));},rest,pc,function(g,x){return A(x,100*(g.W*g.p/100+g.X)/(g.W+g.X));},mul,dv,restd,two,pc],
'4concept':[ch,function(g,x){return E(x*100,g.W*g.p2);},chp],
'4practice':[ch,chd,chp,function(g,x){return E(x*100,g.W*g.p3);},function(g,x){return E(x*10000,g.W*g.p1*(100-g.p2));},up],
'4applied':[ch,function(g,x){return E(x*100,g.A*g.p1);},chd,chp,a4,dn,function(g,x){return E(x*10000,g.W*g.p1*g.p4);},a7],
'4real':[ch,chd,function(g,x){return A(x,g.p1*(100-g.p2)/100);},a4,up,function(g,x){return E(x*100,g.B*g.p2);},a7,ch,dn,function(g,x){return A(x,g.p1*g.p2/100);}],
'5concept':[mix,sel,function(g,x){return E(x*g.d1*g.d2,g.d1-1);}],
'5practice':[function(g,x){return E(x*g.p2*g.p4,g.p1*g.p3);},function(g,x){return E(x*g.p2,g.p3*100-g.p1*g.p4);},function(g,x){return A(x,100*g.p1/(100-g.p2));},half,
 function(g,x){return E(x*g.d,g.m-g.d+1);},function(g,x){return A(x,100*g.p2*g.k/(g.p1+g.p2*g.k));}],
'5applied':[function(g,x){return E(x*100,g.p1*g.p2);},function(g,x){return E(x*g.p1*g.p3,g.p2*g.p4);},mix,sel3,sel,function(g,x){return A(x,100*g.p1*g.k/(g.p1*g.k+g.p2));},half,function(g,x){return E(x*g.d,g.m*g.d-g.d+1);}],
'5real':[mix,function(g,x){return E(x*g.p2*g.p4,g.p1*g.p3);},sel3,function(g,x){return A(x,100*g.p2/(100-g.p1));},function(g,x){return E(x*g.p1,g.P*g.p2);},
 function(g,x){return E(2*x,g.p1+g.p2+g.p3+g.p4);},function(g,x){return E(x*(g.m+g.n),g.m*g.p1+g.n*g.p2);},function(g,x){return E(((g.d1-1)/g.d1+x)*(g.d2-1),g.d2);},
 function(g,x){return E(x*100,g.p1*g.p4+g.p2*g.p5+g.p3*g.p6);},function(g,x){return A(x,100*g.p1*g.p3/(g.p1*g.p3+g.p2*g.p4));}]};
var B=BANK['割合'];for(var l in B)for(var s in B[l])B[l][s].forEach(function(t){if(!t._spec)return;var i=B[l][s].indexOf(t._o),f=(V[l+s]||[])[i];
  if(f)t._spec.chk=f;});})();
