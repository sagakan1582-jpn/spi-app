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
 /* 図の割合の段を直す（2026-11-17 不具合：元の問題で女子0.5・男子0.5のように同じ数字が別の意味で出ると、両方とも同じ値に置き換わり合計が1にならなかった）。
    元の図で割合の合計が1の段は、置き換え候補（その数字の置き換え先すべて）から合計が1になる組を選ぶ。なければ null（作り直し） */
 function rsum(row){var sg=(row||[]).filter(function(x){return x&&x.n!==undefined&&x.n!=='';});if(sg.length<2)return null;
   var ok=sg.every(function(x){return /^0?\.\d+$|^1$/.test(String(x.r===undefined?'':x.r).trim());});if(!ok)return null;
   var t=0;sg.forEach(function(x){t+=num(x.r);});return {sg:sg,t:t};}
 function fixRows(fg,of,m){if(!fg||!fg.rows||!of||!of.rows)return true;var good=true;
   of.rows.forEach(function(orow,ri){if(!ri)return;var o=rsum(orow);if(!o||Math.abs(o.t-1)>1e-6)return;var nrow=fg.rows[ri];if(!nrow)return;
     var ns=(nrow||[]).filter(function(x){return x&&x.n!==undefined&&x.n!=='';});if(ns.length!==o.sg.length)return;
     var opts=o.sg.map(function(x,i){var t=String(x.r).trim(),k=fmt(num(t));if(m[t])k=t;var L=(m[k]&&m[k].all)||[t],cur=String(ns[i].r);
       var a=[cur];L.forEach(function(s){if(a.indexOf(s)<0)a.push(s);});return a;});
     var tot=1;opts.forEach(function(a){tot*=a.length;});if(tot>5000){good=false;return;}var best=null,bc=1e9;
     for(var c=0;c<tot;c++){var r=c,pick=[],s=0,ch=0;opts.forEach(function(a){var j=r%a.length;r=Math.floor(r/a.length);pick.push(a[j]);s+=num(a[j]);if(j)ch++;});
       if(Math.abs(s-1)<1e-6&&ch<bc){bc=ch;best=pick;}}
     if(!best){var rs=0;ns.slice(0,-1).forEach(function(x){rs+=num(x.r);});var lr=+(1-rs).toFixed(9);
       if(lr>0&&lr<1){ns[ns.length-1].r=fmt(lr);return;}good=false;return;}/* 組が見つからないときは最後の区間を残りにする（3つに分ける問題の3つ目は残り） */
     ns.forEach(function(x,i){x.r=best[i];});});
   return good;}
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
     var fg=spec.fig?spec.fig(N,o):walk(o.fig,m);if(fg&&!spec.fig){if(!fixRows(fg,o.fig,m))return null;widths(fg);}r.fig=fg;
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

/* 損益・指標3〜5：元の問題の文はそのまま、数値だけ変える（soneki_3〜5.js より後に読み込む）
   各テンプレートに別解（選択肢を問題文の条件に当てはめて確かめる逆算）をつける */
(function(){
var F='損益',E=GENV.eq;
function T(l,s,i,n,d,chk,x){x=x||{};x.n=n;x.d=d;x.chk=chk;x.keep=x.keep||['1'];return GENV(F,l,s,i,x);}
function SF(keys){return function(v,o){var f=JSON.parse(JSON.stringify(o.fig)),r=f.rows,pos=[[0,0],[1,0],[1,1],[2,0],[2,1]];
  keys.forEach(function(k,i){if(k)r[pos[i][0]][pos[i][1]].v=v[k]+'円';});return f;};}
/* 型 */
function plus(v){v.ans=v.C+v.Pr;return v;}
function mk(v){v.ans=v.T-v.D;return v;}
function pr(v){v.ans=v.S-v.C;return v;}
function pRate(v){v.Pr=v.C*v.p/100;v.T=v.C+v.Pr;v.ans=v.T;return v;}
function wOff(v){v.D=v.T*v.w/10;v.ans=v.T-v.D;return v;}
function cnt(v){v.S=v.s*v.N;v.Cc=v.c*v.N;v.ans=v.S-v.Cc;return v;}
function fail(v){v.TT=v.t*v.N;v.D=v.t*v.K;v.S=v.TT-v.D;v.Cc=v.c*v.N;v.ans=v.S-v.Cc;return v;}          /* 不良品 */
function failC(v){v.TT=v.t*v.N;v.D=v.t*v.K;v.S=v.TT-v.D;v.Cc=v.S-v.P;v.ans=v.Cc/v.N;return v;}       /* 不良品から仕入れ値 */
function rest(v){v.N2=v.N-v.N1;v.TT=v.t*v.N;v.D=v.d*v.N2;v.S=v.TT-v.D;v.Cc=v.Cc||v.c*v.N;v.ans=v.S-v.Cc;return v;}
function same(v){v.q1=v.P/v.N;v.S1=v.c+v.q1;v.ans=v.t-v.S1;return v;}                                  /* 同じ額だけ値引き */
function pw(v){v.rr=1+v.p/100;v.T=v.C*v.rr;v.D=v.T*v.w/10;v.S=v.T-v.D;v.ans=v.S-v.C;return v;}           /* %増しの定価→割引 → 利益 */
function pwS(v){pw(v);v.ans=v.S;return v;}
var cPlus=function(g,x){return E(x-g.Pr,g.C);},cMk=function(g,x){return E(x+g.D,g.T);},cPr=function(g,x){return E(x+g.C,g.S);},
 cFail=function(g,x){return E(x,g.t*(g.N-g.K)-g.c*g.N);},cFailC=function(g,x){return E(x*g.N,g.t*(g.N-g.K)-g.P);},
 cRest=function(g,x){return E(x,g.t*g.N1+(g.t-g.d)*(g.N-g.N1)-(g.Cc||g.c*g.N));},cSame=function(g,x){return E((g.t-x-g.c)*g.N,g.P);},
 cPw=function(g,x){return E(x,g.C*(100+g.p)/100*(10-g.w)/10-g.C);},cPwS=function(g,x){return E(x,g.C*(100+g.p)/100*(10-g.w)/10);};
/* 指標3 */
T(3,'concept',0,['C','Pr'],plus,cPlus);
T(3,'concept',1,['T','D'],mk,cMk);
T(3,'concept',2,['C','S'],pr,cPr,{ok:function(v){return v.S>v.C;}});
T(3,'practice',0,['C','p'],pRate,function(g,x){return E(x*100,g.C*(100+g.p));});
T(3,'practice',1,['T','w'],wOff,function(g,x){return E(x*10,g.T*(10-g.w));});
T(3,'practice',2,['C','T','D'],function(v){v.S=v.T-v.D;v.ans=v.S-v.C;return v;},function(g,x){return E(x+g.C+g.D,g.T);});
T(3,'practice',3,['T','w','Pr'],function(v){v.D=v.T*v.w/10;v.S=v.T-v.D;v.ans=v.S-v.Pr;return v;},function(g,x){return E(x+g.Pr,g.T*(10-g.w)/10);},{fig:SF(['T','S','D',0,'Pr'])});
T(3,'practice',4,['c','N','s'],cnt,function(g,x){return E(x,(g.s-g.c)*g.N);});
T(3,'practice',5,['C','S'],function(v){v.Pr=v.S-v.C;v.pA=v.Pr/v.C*100;return v;},function(g,x){return E(x*g.C,(g.S-g.C)*100);},{a:'pA'});
T(3,'applied',0,['C','w1','w2'],function(v){v.T=v.C+v.C*v.w1/10;v.D=v.T*v.w2/10;v.S=v.T-v.D;v.ans=v.S-v.C;return v;},function(g,x){return E(x,g.C*(10+g.w1)/10*(10-g.w2)/10-g.C);});
T(3,'applied',1,['c','N','t','P'],function(v){v.q1=v.P/v.N;v.S1=v.c+v.q1;v.ans=v.t-v.c-v.q1;return v;},cSame);
T(3,'applied',2,['t','N','Cc','N1','N2','d'],rest,cRest,{ok:function(v){return v.N1<v.N;}});
T(3,'applied',3,['c','N','t','K'],fail,cFail,{ok:function(v){return v.K<v.N;}});
T(3,'applied',4,['C','w','p'],function(v){v.rr=1+v.w/10;v.T=v.C*v.rr;v.D=v.T*v.p/100;v.S=v.T-v.D;v.ans=v.S-v.C;return v;},function(g,x){return E(x,g.C*(10+g.w)/10*(100-g.p)/100-g.C);});
T(3,'applied',5,['T','p','Pr'],function(v){v.D=v.T*v.p/100;v.S=v.T-v.D;v.ans=v.S-v.Pr;return v;},function(g,x){return E(x+g.Pr,g.T*(100-g.p)/100);},{fig:SF(['T','S','D',0,'Pr'])});
T(3,'applied',6,['C','w','D'],function(v){v.T=v.C*(10+v.w)/10;v.S=v.T-v.D;v.ans=v.S-v.C;return v;},function(g,x){return E(x+g.C+g.D,g.C*(10+g.w)/10);});
T(3,'applied',7,['c','N','t','N1','N2'],function(v){v.N2=v.N-v.N1;v.K=v.N2;return fail(v);},function(g,x){return E(x,g.t*g.N1-g.c*g.N);});
T(3,'real',0,['C','p','w'],function(v){v.T=v.C+v.C*v.p/100;v.D=v.T*v.w/10;v.S=v.T-v.D;v.ans=v.S-v.C;return v;},cPw);
T(3,'real',1,['C','w1','w2'],function(v){v.T=v.C+v.C*v.w1/10;v.D=v.T*v.w2/10;v.ans=v.T-v.D;return v;},function(g,x){return E(x,g.C*(10+g.w1)/10*(10-g.w2)/10);});
T(3,'real',2,['c','N','t','P'],function(v){v.q1=v.P/v.N;v.S1=v.c+v.q1;v.ans=v.t-v.c-v.q1;return v;},cSame,{fig:SF(['t','S1',0,'c','q1'])});
T(3,'real',3,['t','N','Cc','N1','N2','d'],rest,cRest,{ok:function(v){return v.N1<v.N;}});
T(3,'real',4,['N','t','K','P'],failC,cFailC,{ok:function(v){return v.K<v.N;}});
T(3,'real',5,['C','w','D'],function(v){v.T=v.C+v.C*v.w/10;v.S=v.T-v.D;v.Pr=v.S-v.C;v.pA=v.Pr/v.C*100;return v;},function(g,x){return E(x*g.C,(g.C*(10+g.w)/10-g.D-g.C)*100);},{a:'pA'});
T(3,'real',6,['T','p','Pr'],function(v){v.D=v.T*v.p/100;v.S=v.T-v.D;v.ans=v.S-v.Pr;return v;},function(g,x){return E(x+g.Pr,g.T*(100-g.p)/100);});
T(3,'real',7,['C','p','w'],function(v){v.rr=1+v.p/100;v.T=v.C*v.rr;v.D=v.T*v.w/10;v.S=v.T-v.D;v.ans=v.S-v.C;return v;},cPw);
T(3,'real',8,['c','N','w1','N1','N2','w2'],function(v){v.N2=v.N-v.N1;v.rr=1+v.w1/10;v.t=v.c*v.rr;v.TT=v.t*v.N;v.D=v.t*v.w2/10*v.N2;v.S=v.TT-v.D;v.Cc=v.c*v.N;v.ans=v.S-v.Cc;return v;},
 function(g,x){var t=g.c*(10+g.w1)/10;return E(x,t*g.N1+t*(10-g.w2)/10*(g.N-g.N1)-g.c*g.N);},{x:['w1'],ok:function(v){return v.N1<v.N;}});
T(3,'real',9,['C','w','p'],function(v){v.rr=1+v.w/10;v.T=v.C*v.rr;v.Pr=v.C*v.p/100;v.D=v.T-v.C-v.Pr;v.S=v.T-v.D;v.wA=v.D/v.T*10;return v;},function(g,x){return E(g.C*(10+g.w)/10*(10-x)/10-g.C,g.C*g.p/100);},{a:'wA'});
/* 指標4 */
T(4,'concept',0,['C','p','w'],function(v){v.Pr=v.C*v.p/100;v.T=v.C+v.Pr;v.D=v.T*v.w/10;v.ans=v.T-v.D;return v;},cPwS);
T(4,'concept',1,['c','N','P'],function(v){v.q1=v.P/v.N;v.ans=v.c+v.q1;return v;},function(g,x){return E((x-g.c)*g.N,g.P);});
T(4,'concept',2,['c','N','t','K'],fail,cFail,{ok:function(v){return v.K<v.N;}});
T(4,'practice',0,['C','p','D'],function(v){v.rr=1+v.p/100;v.T=v.C*v.rr;v.S=v.T-v.D;v.ans=v.S-v.C;return v;},function(g,x){return E(x+g.C+g.D,g.C*(100+g.p)/100);});
T(4,'practice',1,['c','N','t','N1','N2'],function(v){v.N2=v.N-v.N1;v.d=v.t/2;return rest(v);},function(g,x){return E(x,g.t*g.N1+g.t/2*(g.N-g.N1)-g.c*g.N);},{ok:function(v){return v.N1<v.N;}});
T(4,'practice',2,['N','t','K','P'],failC,cFailC,{ok:function(v){return v.K<v.N;}});
T(4,'practice',3,['N','t','c','P'],same,cSame);
T(4,'practice',4,['C','p','w'],pw,cPw);
T(4,'practice',5,['c','N','t','K'],fail,cFail,{ok:function(v){return v.K<v.N;}});
T(4,'applied',0,['p','w','C'],pwS,cPwS);
T(4,'applied',1,['c','N','t','P'],same,cSame);
T(4,'applied',2,['c','N','t','N1','N2','d'],rest,cRest,{ok:function(v){return v.N1<v.N;}});
T(4,'applied',3,['N','t','K','P'],failC,cFailC,{ok:function(v){return v.K<v.N;}});
T(4,'applied',4,['C','p','w'],pw,cPw);
T(4,'applied',5,['c','N','p','N1','N2','w'],function(v){v.N2=v.N-v.N1;v.rr=1+v.p/100;v.t=v.c*v.rr;v.d=v.t*v.w/10;return rest(v);},
 function(g,x){var t=g.c*(100+g.p)/100;return E(x,t*g.N1+t*(10-g.w)/10*(g.N-g.N1)-g.c*g.N);},{ok:function(v){return v.N1<v.N;}});
T(4,'applied',6,['c','N','d','P'],function(v){v.q1=v.P/v.N;v.S1=v.c+v.q1;v.ans=v.S1+v.d;return v;},function(g,x){return E((x-g.d-g.c)*g.N,g.P);});
T(4,'applied',7,['c','N','t','P'],function(v){v.TT=v.t*v.N;v.Cc=v.c*v.N;v.S=v.Cc+v.P;v.D=v.TT-v.S;v.ans=v.D/v.t;return v;},function(g,x){return E(g.t*(g.N-x)-g.c*g.N,g.P);},{ok:function(v){return v.ans<v.N;}});
T(4,'real',0,['p','w','C'],pw,cPw);
T(4,'real',1,['c','N','t','P'],same,cSame);
T(4,'real',2,['c','N','t','N1','N2','d'],rest,cRest,{ok:function(v){return v.N1<v.N;}});
T(4,'real',3,['N','t','K','P'],failC,cFailC,{ok:function(v){return v.K<v.N;}});
T(4,'real',4,['C','p','w'],pw,cPw);
T(4,'real',5,['c','N','p','N1','N2','p2'],function(v){v.N2=v.N-v.N1;v.rr=1+v.p/100;v.t=v.c*v.rr;v.d=v.t*v.p2/100;return rest(v);},
 function(g,x){var t=g.c*(100+g.p)/100;return E(x,t*g.N1+t*(100-g.p2)/100*(g.N-g.N1)-g.c*g.N);},{ok:function(v){return v.N1<v.N;}});
T(4,'real',6,['c','N','d','P'],function(v){v.q1=v.P/v.N;v.S1=v.c+v.q1;v.ans=v.S1+v.d;return v;},function(g,x){return E((x-g.d-g.c)*g.N,g.P);});
T(4,'real',7,['c','N','t','P'],function(v){v.TT=v.t*v.N;v.Cc=v.c*v.N;v.S=v.Cc+v.P;v.D=v.TT-v.S;v.ans=v.D/v.t;return v;},function(g,x){return E(g.t*(g.N-x)-g.c*g.N,g.P);},{ok:function(v){return v.ans<v.N;}});
T(4,'real',8,['p','p2','C'],function(v){v.rr=1+v.p/100;v.T=v.C*v.rr;v.D=v.T*v.p2/100;v.ans=v.T-v.D;return v;},function(g,x){return E(x,g.C*(100+g.p)/100*(100-g.p2)/100);});
T(4,'real',9,['c','N','t','N1'],function(v){v.N2=v.N-v.N1;v.d=v.t/2;return rest(v);},function(g,x){return E(x,g.t*g.N1+g.t/2*(g.N-g.N1)-g.c*g.N);},{ok:function(v){return v.N1<v.N;}});
/* 指標5（x と置く一次方程式） */
function setT(v){v.S=v.C+v.P;v.ans=v.S/(1-v.w/10);return v;}
function kk(v){v.rb=v.rr*v.rk;v.rD=v.rr-v.rb;v.ans=v.P/(v.rb-1);return v;}
function up(v){v.rb=1+v.p/100;v.ry=v.rb/v.rk;v.pA=(v.ry-1)*100;return v;}
function half(v){v.fc1=v.rk*v.m;v.Cm=v.C*v.m;v.fc2=v.fc1-1;v.diff=v.Cm-v.C;v.ans=v.diff/v.fc2;return v;}
function cntx(v){v.TT=v.t*v.N;v.Cc=v.c*v.N;v.D=v.TT-v.Cc-v.P;v.M=v.D/v.d;v.ans=v.N-v.M;return v;}
function mixc(v){v.N2=v.N-v.N1;v.rr=1+v.w1/10;v.rdu=v.rr*v.w2/10;v.fTT=v.rr*v.N;v.fDk=v.rr*v.w2/10*v.N2;v.fK=v.fTT-v.N-v.fDk;v.ans=v.P/v.fK;return v;}
var ok1=function(v){return v.rb>1;},cUp=function(g,x){return E((100+x)*(1-(g.w!==undefined?g.w/10:g.p1/100)),100+(g.p!==undefined?g.p:g.p2));};
T(5,'concept',0,['w','P','C'],setT,function(g,x){return E(x*(10-g.w)/10,g.C+g.P);});
T(5,'concept',1,['p','w','P'],function(v){v.rr=1+v.p/100;v.rk=1-v.w/10;return kk(v);},function(g,x){return E(x*(100+g.p)/100*(10-g.w)/10-x,g.P);},{ok:ok1});
T(5,'concept',2,['w','p'],function(v){v.rk=1-v.w/10;return up(v);},cUp,{a:'pA',rg:{w:[1,4,1],p:[5,60,1]}});
T(5,'practice',0,['C','w1','w2'],function(v){v.Pr=v.C*v.w1/10;v.S=v.C+v.Pr;v.ans=v.S/(1-v.w2/10);return v;},function(g,x){return E(x*(10-g.w2),g.C*(10+g.w1));});
T(5,'practice',1,['N','w1','N1','N2','w2','P'],mixc,function(g,x){var t=x*(10+g.w1)/10;return E(t*g.N1+t*(10-g.w2)/10*(g.N-g.N1)-x*g.N,g.P);},{ok:function(v){return v.N1<v.N&&v.fK>0;}});
T(5,'practice',2,['c','N','t','d','P'],cntx,function(g,x){return E(g.t*x+(g.t-g.d)*(g.N-x)-g.c*g.N,g.P);},{ok:function(v){return v.M<v.N&&v.d<v.t;}});
T(5,'practice',3,['w1','P1','w2','P2'],function(v){v.rd=(v.w2-v.w1)/10;v.diff=v.P1-v.P2;v.ans=v.diff/v.rd;return v;},function(g,x){return E(x*(10-g.w1)/10-g.P1,x*(10-g.w2)/10-g.P2);},{x:['w1','w2'],ok:function(v){return v.w2>v.w1&&v.ans*(1-v.w2/10)>v.P2;}});
T(5,'practice',4,['p1','p2'],function(v){v.rk=1-v.p1/100;v.p=v.p2;return up(v);},cUp,{a:'pA',rg:{p1:[10,40,5],p2:[5,50,5]}});
T(5,'practice',5,['C','w','m',0],function(v){v.rk=1-v.w/10;return half(v);},function(g,x){return E(x*(10-g.w)/10-g.C,(x-g.C)/g.m);},{rg:{m:[2,4,1]},ok:function(v){return v.fc2>0;}});
T(5,'applied',0,['C','w1','w2'],function(v){v.Pr=v.C*v.w1/10;v.S=v.C+v.Pr;v.ans=v.S/(1-v.w2/10);return v;},function(g,x){return E(x*(10-g.w2),g.C*(10+g.w1));});
T(5,'applied',1,['p1','p2','P'],function(v){v.rr=1+v.p1/100;v.rk=1-v.p2/100;return kk(v);},function(g,x){return E(x*(100+g.p1)/100*(100-g.p2)/100-x,g.P);},{ok:ok1});
T(5,'applied',2,['c','N','t','d','P'],cntx,function(g,x){return E(g.t*x+(g.t-g.d)*(g.N-x)-g.c*g.N,g.P);},{ok:function(v){return v.M<v.N&&v.d<v.t;}});
T(5,'applied',3,['N','w','N1','N2','P'],function(v){v.N2=v.N-v.N1;v.rr=1+v.w/10;v.fTT=v.rr*v.N;v.rdu=v.rr/2;v.fDk=v.rr/2*v.N2;v.fK=v.fTT-v.N-v.fDk;v.ans=v.P/v.fK;return v;},
 function(g,x){var t=x*(10+g.w)/10;return E(t*g.N1+t/2*(g.N-g.N1)-x*g.N,g.P);},{ok:function(v){return v.N1<v.N&&v.fK>0;}});
T(5,'applied',4,['P1','w','P2'],function(v){v.diff=v.P1-v.P2;v.T=v.diff/(v.w/10);v.ans=v.T-v.P1;return v;},function(g,x){return E((x+g.P1)*(10-g.w),(x+g.P2)*10);},{ok:function(v){return v.P1>v.P2;}});
T(5,'applied',5,['w','p'],function(v){v.rk=1-v.w/10;return up(v);},cUp,{a:'pA'});
T(5,'applied',6,['C','w','m','kk'],function(v){v.rk=1-v.w/10;v.rq=v.kk/v.m;v.Ck=v.C*v.rq;v.rd=v.rk-v.rq;v.diff=v.C-v.Ck;v.ans=v.diff/v.rd;return v;},
 function(g,x){return E(x*(10-g.w)/10-g.C,(x-g.C)*g.kk/g.m);},{rg:{m:[3,5,1],kk:[1,4,1]},ok:function(v){return v.kk<v.m&&GENV.frac(v.kk,v.m)[0]===v.kk&&v.kk>1&&v.rd>0;}});
T(5,'applied',7,['N','w','K','P'],function(v){v.rr=1+v.w/10;v.fTT=v.rr*v.N;v.fD=v.rr*v.K;v.fK=v.fTT-v.N-v.fD;v.ans=v.P/v.fK;return v;},function(g,x){return E(x*(10+g.w)/10*(g.N-g.K)-x*g.N,g.P);},{ok:function(v){return v.K<v.N&&v.fK>0;}});
T(5,'real',0,['N','w1','N1','N2','w2','P'],mixc,function(g,x){var t=x*(10+g.w1)/10;return E(t*g.N1+t*(10-g.w2)/10*(g.N-g.N1)-x*g.N,g.P);},{ok:function(v){return v.N1<v.N&&v.fK>0;}});
T(5,'real',1,['c','N','t',0,'B','P'],function(v){v.h=v.B/2;v.d=v.t-v.h;return cntx(v);},function(g,x){return E(g.t*x+g.B/2*(g.N-x)-g.c*g.N,g.P);},{keep:[],ok:function(v){return v.M<v.N&&v.d>0;}});
T(5,'real',2,['c','N','w1','w2','P'],function(v){v.rr=1+v.w1/10;v.t=v.c*v.rr;v.d=v.t*v.w2/10;return cntx(v);},function(g,x){var t=g.c*(10+g.w1)/10;return E(t*x+t*(10-g.w2)/10*(g.N-x)-g.c*g.N,g.P);},{x:['w1'],ok:function(v){return v.M<v.N;}});
T(5,'real',3,['C','p1','p2'],function(v){v.Pr=v.C*v.p1/100;v.S=v.C+v.Pr;v.ans=v.S/(1-v.p2/100);return v;},function(g,x){return E(x*(100-g.p2),g.C*(100+g.p1));});
T(5,'real',4,['C','p','m',0],function(v){v.rk=1-v.p/100;return half(v);},function(g,x){return E(x*(100-g.p)/100-g.C,(x-g.C)/g.m);},{rg:{m:[2,5,1]},ok:function(v){return v.fc2>0;}});
T(5,'real',5,['p1','P','p2','L'],function(v){v.rd=(v.p2-v.p1)/100;v.sum=v.P+v.L;v.ans=v.sum/v.rd;return v;},function(g,x){return E(x*(100-g.p1)/100-g.P,x*(100-g.p2)/100+g.L);},{x:['p1','p2'],ok:function(v){return v.p2>v.p1;}});
T(5,'real',6,['p1','p2'],function(v){v.rk=1-v.p1/100;v.p=v.p2;return up(v);},cUp,{a:'pA',big:1});
T(5,'real',7,['p1','p2'],function(v){v.rk=1-v.p1/100;v.p=v.p2;return up(v);},cUp,{a:'pA'});
T(5,'real',8,['c','N','N1','N2','w','P'],function(v){v.N2=v.N-v.N1;v.Cc=v.c*v.N;v.fDk=v.N2*v.w/10;v.fK=v.N-v.fDk;v.sum=v.Cc+v.P;v.ans=v.sum/v.fK;return v;},
 function(g,x){return E(x*g.N1+x*(10-g.w)/10*(g.N-g.N1)-g.c*g.N,g.P);},{ok:function(v){return v.N1<v.N;}});
T(5,'real',9,['c','N','K','N1','N2','P'],function(v){v.N2=v.N-v.K-v.N1;v.H=v.N2/2;v.Dk=v.K+v.H;v.Cc=v.c*v.N;v.K2=v.N-v.Dk;v.sum=v.Cc+v.P;v.ans=v.sum/v.K2;return v;},
 function(g,x){return E(x*g.N1+x/2*(g.N-g.K-g.N1)-g.c*g.N,g.P);},{ok:function(v){return v.N2>0;}});
})();
