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

/* 集合・指標3〜5：元の問題の文はそのまま、数値だけ変える（shugo_3〜5.js より後に読み込む）
   指標3・4はカルノー表を数値から解き直し、表・計算を作り直す。別解は4マスを未知数にした連立方程式（消去法）や1から数える数え上げ */
(function(){
var F='集合',E=GENV.eq,fmt=GENV.fmt;
var KEYS=['T','A','Ax','B','Bx','oo','ox','xo','xx'];
var REL=[['T','A','Ax'],['A','oo','ox'],['Ax','xo','xx'],['T','B','Bx'],['B','oo','xo'],['Bx','ox','xx']];
var POS={oo:[0,1],ox:[0,2],A:[0,3],xo:[1,1],xx:[1,2],Ax:[1,3],B:[2,1],Bx:[2,2],T:[2,3]};
var VEC={T:[1,1,1,1],A:[1,1,0,0],Ax:[0,0,1,1],B:[1,0,1,0],Bx:[0,1,0,1],oo:[1,0,0,0],ox:[0,1,0,0],xo:[0,0,1,0],xx:[0,0,0,1]};
function gcd(a,b){return b?gcd(b,a%b):a;}
function solve(v){var kn={},st=[];KEYS.forEach(function(k){if(typeof v[k]==='number')kn[k]=1;});var ch=true;
  while(ch){ch=false;REL.forEach(function(r){var u=r.filter(function(k){return !kn[k];});if(u.length!==1)return;var k=u[0];
    if(k===r[0]){v[k]=v[r[1]]+v[r[2]];st.push([k,'＋',r[1],r[2]]);}else{var o=k===r[1]?r[2]:r[1];v[k]=v[r[0]]-v[o];st.push([k,'−',r[0],o]);}kn[k]=1;ch=true;});}
  return st;}
function need(st,k){var keep={},out=[];(function go(k){var s=st.filter(function(x){return x[0]===k;})[0];if(!s||keep[k])return;keep[k]=1;go(s[2]);go(s[3]);})(k);
  return st.filter(function(x){return keep[x[0]];});}
/* 表の見出し（元の図から読む） */
function labs(o){var t=o.fig.table,b=t.head[1].replace(/○$/,''),r1=t.rows[0][0],r2=t.rows[1][0],kg=!/○$/.test(r1),a=r1.replace(/○$/,'');
  var ask=null;t.rows.forEach(function(r,i){r.forEach(function(c,j){if(/^!/.test(String(c)))KEYS.forEach(function(k){if(POS[k][0]===i&&POS[k][1]===j)ask=k;});});});
  return {a:a,b:b,r1:r1,r2:r2,kg:kg,ask:ask};}
function nm(L,k){var s=L.kg?'・':'',R1=L.kg?L.r1:L.a+'○',R2=L.kg?L.r2:L.a+'×';
  return {T:'合計',A:R1,Ax:R2,B:L.b+'○',Bx:L.b+'×',oo:R1+s+L.b+'○',ox:R1+s+L.b+'×',xo:R2+s+L.b+'○',xx:R2+s+L.b+'×'}[k];}
function table(L,v){var m=[[],[],[]];KEYS.forEach(function(k){var p=POS[k];m[p[0]][p[1]-1]=(k===L.ask?'!':'')+v[k];});
  var h=['',L.b+'○',L.b+'×','計'];return {table:{head:h,rows:[[L.kg?L.r1:L.a+'○'].concat(m[0]),[L.kg?L.r2:L.a+'×'].concat(m[1]),['計'].concat(m[2])]}};}
/* 4マスを未知数にした連立方程式を消去法で解く（別解） */
function gauss(g){var rows=[];KEYS.forEach(function(k){if(typeof g[k]==='number')rows.push(VEC[k].concat([g[k]]));});
  var n=4,M=rows.map(function(r){return r.slice();}),r=0;for(var c=0;c<n;c++){var p=-1;for(var i=r;i<M.length;i++)if(Math.abs(M[i][c])>1e-9){p=i;break;}if(p<0)return null;
    var t=M[p];M[p]=M[r];M[r]=t;for(i=0;i<M.length;i++)if(i!==r&&Math.abs(M[i][c])>1e-9){var f=M[i][c]/M[r][c];for(var j=c;j<=n;j++)M[i][j]-=f*M[r][j];}r++;}
  var u=[0,1,2,3].map(function(i){return M[i][4]/M[i][i];});if(u.some(function(x){return x<0;}))return null;
  var o={};KEYS.forEach(function(k){o[k]=VEC[k].reduce(function(s,x,i){return s+x*u[i];},0);});return o;}
function K(l,s,i,n,x0){var x={};for(var q in x0||{})x[q]=x0[q];var o=BANK[F][l][s][i],L=labs(o),pct=x.pct,N=n.indexOf('N')>=0;
  x.n=n;x.keep=['1','100'];
  x.d=function(v){if(pct)v.T=100;var st=solve(v);v._st=st;KEYS.forEach(function(k){if(typeof v[k]!=='number')v[k]=NaN;});
    v.ans=N?v.N*v[L.ask]/100:v[L.ask];(n.filter(function(k){return /^X/.test(k);})).forEach(function(k){if(!(v[k]<(x.xa?v.A:v.T)))v[k]=NaN;});return v;};
  x.fig=function(v){return table(L,v);};
  x.calc=function(v){var c=need(v._st,L.ask).map(function(t){return nm(L,t[0])+' ＝ '+v[t[2]]+' '+t[1]+' '+v[t[3]]+' ＝ '+v[t[0]];});
    if(N){c[c.length-1]+='（%）';c.push(v.N+' × '+fmt(v[L.ask]/100)+' ＝ '+v.ans);}return c.join('<br>');};
  x.chk=function(g,y){if(pct)g.T=100;var t=gauss(g);if(!t)return false;return E(y,N?g.N*t[L.ask]/100:t[L.ask]);};
  return GENV(F,l,s,i,x);}
/* 倍数（1から数える） */
function M(l,s,i,n,prob){var o=BANK[F][l][s][i],L0=labs(o),u=prob?'枚':'個';
  var x={n:n,keep:['1'],rg:{m1:[2,7,1],m2:[3,12,1]}};
  x.d=function(v){var lc=v.m1*v.m2/gcd(v.m1,v.m2);v.lc=lc;v.A=Math.floor(v.T/v.m1);v.B=Math.floor(v.T/v.m2);v.oo=Math.floor(v.T/lc);
    var st=solve(v);v._st=st;v.ans=v.xx;if(!(v.m1<v.m2&&v.m2%v.m1!==0&&v.oo>0))v.ans=NaN;if(prob){var f=GENV.frac(v.xx,v.T);v.fn=f[0];v.fd=f[1];}return v;};
  function L(v){return {a:v.m1+'の倍数',b:v.m2+'の倍数',r1:'',r2:'',kg:false,ask:'xx'};}
  x.fig=function(v){return table(L(v),v);};
  x.calc=function(v){var Lv=L(v),c=[v.m1+'の倍数 '+v.A+u+'、'+v.m2+'の倍数 '+v.B+u+'、'+v.lc+'の倍数 '+v.oo+u].concat(need(v._st,'xx').map(function(t){return nm(Lv,t[0])+' ＝ '+v[t[2]]+' '+t[1]+' '+v[t[3]]+' ＝ '+v[t[0]];}));
    if(prob)c.push('確率 ＝ '+v.xx+'/'+v.T+(v.fd!==v.T?' ＝ '+v.fn+'/'+v.fd:''));return c.join('<br>');};
  x.inw=function(v){return KI(v.m1+'の倍数',v.m2+'の倍数')+(/両方○は/.test(o.inw)?'（両方○は'+v.lc+'の倍数）':'');};
  function cnt(g){var c=0;for(var k=1;k<=g.T;k++)if(k%g.m1&&k%g.m2)c++;return c;}
  if(prob){x.c=function(v,O,R){var out=[],seen={};function put(a,b){if(!(a>0&&a<b))return;var f=GENV.frac(a,b),s2=f[0]+'/'+f[1];if(seen[s2])return;seen[s2]=1;out.push(s2);}
      put(v.xx,v.T);put(v.T-v.xx,v.T);put(v.xx+v.oo,v.T);put(v.T-v.A-v.B,v.T);put(v.xx-v.oo,v.T);for(var k=1;out.length<5&&k<30;k++){put(v.xx+k,v.T);put(v.xx-k,v.T);}
      return GENV.sort(out.slice(0,5),0);};
    x.chk=function(g,y){return E(y,cnt(g)/g.T);};}
  else x.chk=function(g,y){return E(y,cnt(g));};
  return GENV(F,l,s,i,x);}
var P={pct:1};
/* 指標3 */
K(3,'concept',0,['T','A','B','oo'],{rg:{T:[10,20,2],A:[2,9,1],B:[2,9,1],oo:[1,4,1]}});
K(3,'concept',1,['T','A','B','xx'],{rg:{T:[10,20,2],A:[2,9,1],B:[2,9,1],xx:[1,4,1]}});
K(3,'concept',2,['T','oo','ox','xo'],{rg:{T:[10,20,2],oo:[1,4,1],ox:[1,5,1],xo:[1,5,1]}});
K(3,'practice',0,['T','A','B','oo']);K(3,'practice',1,['T','A','B','xx']);K(3,'practice',2,['T','A','B','oo']);K(3,'practice',3,['T','A','B','xx']);
K(3,'practice',4,['A','B','oo'],P);K(3,'practice',5,['T','A','B','xx']);
K(3,'applied',0,['T','A','B','oo']);K(3,'applied',1,['T','A','B','xx']);K(3,'applied',2,['A','B','xx'],P);K(3,'applied',3,['T','A','X','B','oo'],{xa:1});
M(3,'applied',4,[0,'T','m1','m2']);K(3,'applied',5,['T','A','B','xx']);K(3,'applied',6,['A','B','xx'],P);K(3,'applied',7,['T','A','B','ox']);
K(3,'real',0,['T','A','B','xx']);K(3,'real',1,['T','A','B','oo']);K(3,'real',2,['A','B','oo'],P);M(3,'real',3,[0,'T','m1','m2']);
K(3,'real',4,['T','A','B','xx']);K(3,'real',5,['T','A','B','xx']);K(3,'real',6,['A','B','xx'],P);M(3,'real',7,[0,'T','m1','m2']);
K(3,'real',8,['T','A','B','oo']);K(3,'real',9,['T','A','X','B','oo'],{xa:1});
/* 指標4 */
K(4,'concept',0,['T','A','B','X','oo']);K(4,'concept',1,['T','A','B','oo']);M(4,'concept',2,[0,'T',0,'T',0,'m1','m2'],1);
K(4,'practice',0,['T','A','B','X','oo']);K(4,'practice',1,['T','Ax','B','xo']);K(4,'practice',2,['N','A','B','oo'],P);M(4,'practice',3,[0,'T',0,'T',0,'m1','m2'],1);
K(4,'practice',4,['T','A','B','X','oo']);K(4,'practice',5,['A','B','oo'],P);
K(4,'applied',0,['T','A','X','B','X2','oo']);K(4,'applied',1,['T','A','B','xo']);M(4,'applied',2,[0,'T',0,'T',0,'m1','m2'],1);K(4,'applied',3,['N','A','B','xx'],P);
K(4,'applied',4,['A','B','X','oo'],P);K(4,'applied',5,['T','Ax','B','xx']);K(4,'applied',6,['T','A','B','X','xx']);M(4,'applied',7,[0,'T',0,'T',0,'m1','m2'],1);
K(4,'real',0,['T','A','X','B','X2','oo']);K(4,'real',1,['T','A','B','xo']);M(4,'real',2,[0,'T',0,'T',0,'m1','m2'],1);K(4,'real',3,['N','A','B','xx'],P);
K(4,'real',4,['A','B','X','oo'],P);K(4,'real',5,['T','Ax','B','xx']);M(4,'real',6,[0,'T',0,'T',0,'m1','m2'],1);K(4,'real',7,['T','A','B','X','xx']);
K(4,'real',8,['A','B','xo'],P);K(4,'real',9,['N','A','B','xx'],P);
})();
/* 指標5（x と置く・割合の組み合わせ・分数） */
(function(){
var F='集合',E=GENV.eq,fmt=GENV.fmt,B5=BANK[F][5];
function tb(o,c){var t=o.fig.table,rows=t.rows.map(function(r,i){return [r[0]].concat(c[i].map(function(x,j){var s=String(r[j+1]);return /^!/.test(s)?'!'+(s==='!?'?'?':x):x;}));});
  return {table:{head:t.head.slice(),rows:rows}};}
function cx(k){return k===1?'x':k+'x';}
function T5(s,i,n,d,chk,x){x=x||{};x.n=n;x.d=d;x.chk=chk;x.keep=x.keep||['1','100','1000'];return GENV(F,5,s,i,x);}
var CK=['zA','zB','zC','zD'];
/* 型1：どちらもない＝k×両方（x＝両方）　型2：両方＝k×どちらもない（x＝どちらもない） */
function t1(v){var T=v.T||100;v.S=v.A+v.B;v.k1=v.k-1;v.x=(T-v.S)/v.k1;v.kx=v.k*v.x;v.zA=v.A-v.x;v.zB=v.B-v.x;v.zC=T-v.A-v.B+v.x;return v;}
function t2(v){var T=v.T||100;v.S=v.A+v.B;v.k1=v.k-1;v.x=(v.S-T)/v.k1;v.kx=v.k*v.x;v.zA=v.A-v.kx;v.zB=v.B-v.kx;v.zC=T-v.A-v.B+v.kx;return v;}
function f1(v,o){return tb(o,[['x',v.A+' − x',v.A],[v.B+' − x',cx(v.k),''],[v.B,'',v.T||100]]);}
function f2(v,o){var k=cx(v.k);return tb(o,[[k,v.A+' − '+k,v.A],[v.B+' − '+k,'x',''],[v.B,'',v.T||100]]);}
/* 総当たり：両方の人数を0から順に試す */
function br(g,typ,ask){var T=g.T||100,hit=[];for(var oo=0;oo<=T;oo++){var ox=g.A-oo,xo=g.B-oo,xx=T-g.A-g.B+oo;if(ox<0||xo<0||xx<0)continue;
  if(typ===1?xx===g.k*oo:oo===g.k*xx)hit.push({oo:oo,ox:ox,xo:xo,xx:xx});}return hit.length===1?hit[0][ask]:NaN;}
function C1(typ,ask,pct){return function(g,y){var r=br(g,typ,ask);return E(y,pct?g.N*r/100:r);};}
var R1={x:CK};function kf(k){var r={x:CK,rg:{k:[k,k,1]}};return r;}
T5('concept',0,['T','A','B','k'],function(v){t1(v);v.ans=v.x;return v;},C1(1,'oo'),o2(kf(3),{fig:f1}));
T5('concept',2,['T','A','B','k'],function(v){t2(v);v.ans=v.x;return v;},C1(2,'xx'),o2(kf(2),{fig:f2}));
T5('practice',0,['T','A','B','k'],function(v){t1(v);v.ans=v.A-v.x;return v;},C1(1,'ox'),o2(kf(3),{fig:f1}));
T5('practice',2,['T','A','B','k'],function(v){t2(v);v.ans=v.kx;return v;},C1(2,'oo'),o2(kf(2),{fig:f2}));
T5('practice',5,['T','A','B','k'],function(v){t1(v);v.ans=v.kx;return v;},C1(1,'xx'),o2(kf(4),{fig:f1}));
T5('applied',0,['T','A','B','k'],function(v){t1(v);v.ans=v.kx;return v;},C1(1,'xx'),o2(kf(3),{fig:f1}));
T5('applied',1,['T','A','B','k'],function(v){t2(v);v.ans=v.A-v.kx;return v;},C1(2,'ox'),o2(kf(3),{fig:f2}));
T5('applied',5,['N','A','B','k'],function(v){t2(v);v.po=v.kx;v.ans=v.N*v.kx/100;return v;},C1(2,'oo',1),o2(kf(2),{fig:f2}));
T5('applied',7,['T','A','B','k'],function(v){t1(v);v.ans=v.B-v.x;return v;},C1(1,'xo'),o2(kf(2),{fig:f1}));
T5('real',0,['T','A','B','k'],function(v){t1(v);v.ans=v.x;return v;},C1(1,'oo'),o2(kf(3),{fig:f1}));
T5('real',1,['T','A','B','k'],function(v){t2(v);v.ans=v.kx;return v;},C1(2,'oo'),o2(kf(5),{fig:f2}));
T5('real',2,['T','A','B','k'],function(v){t1(v);v.ans=v.kx;return v;},C1(1,'xx'),o2(kf(3),{fig:f1}));
T5('real',8,['T','A','B','k'],function(v){t2(v);v.ans=v.B-v.kx;return v;},C1(2,'xo'),o2(kf(2),{fig:f2}));
T5('real',9,['N','A','B','k'],function(v){t2(v);v.pP=v.A-v.kx;v.ans=v.N*v.pP/100;return v;},C1(2,'ox',1),o2(kf(4),{fig:f2}));
/* 男女の割合（%の表） */
function mf(v){v.F=100-v.p1;v.M=v.p1*v.p2/100;v.W=v.F*v.p3/100;v.pA=v.M+v.W;return v;}
function mfig(v,o){return tb(o,[[v.M,v.p1-v.M,v.p1],[v.W,v.F-v.W,v.F],[v.pA,100-v.pA,100]]);}
var cM=function(g,y){return E(y*100,g.p1*g.p2+(100-g.p1)*g.p3);};
T5('concept',1,['p1','p2','p3'],mf,cM,{a:'pA',fig:mfig});
T5('applied',2,['p1','p2','p3'],mf,cM,{a:'pA',fig:mfig});
T5('real',3,['p1','p2','p3'],mf,cM,{a:'pA',fig:mfig});
function nf(v){mf(v);v.ps=v.pA;v.ans=v.N*v.pA/100;return v;}
var cN=function(g,y){return E(y*10000,g.N*(g.p1*g.p2+(100-g.p1)*g.p3));};
T5('practice',3,['N','p1','p2','p3'],nf,cN,{fig:mfig});
T5('real',5,['N','p1','p2','p3'],nf,cN,{fig:mfig,keep:['1','100']});
/* 1,000人と置いて、ある条件の人のうちの割合 */
function sh(v){v.Fn=10*v.p1;v.Mn=1000-v.Fn;v.a=v.Fn*v.p2/100;v.b=v.Mn*v.p3/100;v.sm=v.a+v.b;var r=v.a/v.sm;v.f3=Math.floor(r*1000)/1000;v.pA=v.round?Math.round(r*100):r*100;return v;}
function sfig(v,o){return tb(o,[[v.a,v.Fn-v.a,v.Fn],[v.b,v.Mn-v.b,v.Mn],[v.sm,1000-v.sm,1000]]);}
var cS=function(g,y){return E(y*(g.p1*g.p2+(100-g.p1)*g.p3),100*g.p1*g.p2);},cSr=function(g,y){return Math.abs(y-100*g.p1*g.p2/(g.p1*g.p2+(100-g.p1)*g.p3))<0.5;};
T5('practice',1,['p1','p2','p3'],sh,cS,{a:'pA',fig:sfig});
T5('applied',3,['p1','p2','p3'],sh,cS,{a:'pA',fig:sfig,x:['p1']});
T5('real',4,['p1','p2','p3'],function(v){v.round=1;return sh(v);},cSr,{a:'pA',fig:sfig,x:['p1'],ok:function(v){return !GENV.eq(v.a/v.sm*1000,Math.round(v.a/v.sm*1000));}});
/* 男性は女性の k 倍 */
function gk(v){v.x=v.G/(v.k+1);v.kx=v.k*v.x;v.zA=v.A-v.kx;v.zB=v.T-v.A-v.x;return v;}
function brk(g){var h=[];for(var f=0;f<=g.G;f++)if(g.G-f===g.k*f)h.push(f);return h.length===1?h[0]:NaN;}
T5('applied',6,['T','A','G','k'],function(v){gk(v);v.ans=v.A-v.kx;return v;},function(g,y){return E(y,g.A-(g.G-brk(g)));},o2(kf(2),{fig:function(v,o){return tb(o,[[cx(v.k),'',v.A],['x','',v.T-v.A],[v.G,'',v.T]]);}}));
T5('real',7,['T','A','G','k'],function(v){gk(v);v.Fm=v.T-v.A;v.ans=v.Fm-v.x;return v;},function(g,y){return E(y,g.T-g.A-brk(g));},o2(kf(2),{fig:function(v,o){return tb(o,[[cx(v.k),'',v.A],['x','',v.T-v.A],[v.G,'',v.T]]);}}));
function o2(a,b){var r={};for(var k in a)r[k]=a[k];for(k in b)r[k]=b[k];return r;}
/* 分数：一方のグループの内訳と全体から、もう一方のグループの割合を出す */
function fr(a,b){var g=GENV.frac(a,b);return g;}function fs(f){return f[1]===1?String(f[0]):f[0]+'/'+f[1];}
function mul(x,y){return fr(x[0]*y[0],x[1]*y[1]);}function sub2(x,y){return fr(x[0]*y[1]-y[0]*x[1],x[1]*y[1]);}function dvf(x,y){return fr(x[0]*y[1],x[1]*y[0]);}
function FR5(s,i,n){var o=B5[s][i],Lc=o.calc.split('<br>').map(function(l){return l.split(' ＝ ')[0];}),ar=-1;o.fig.table.rows.forEach(function(r,j){if(r.some(function(c){return /^!/.test(String(c));}))ar=j;});
  var x={n:n,keep:[],rg:{g1:[1,7,1],g2:[3,8,1],c:[1,4,1],d:[2,5,1],e:[1,5,1],f:[2,9,1]}};
  x.d=function(v){var g=[v.g1,v.g2],ok=fr(v.g1,v.g2)[1]===v.g2&&fr(v.c,v.d)[1]===v.d&&fr(v.e,v.f)[1]===v.f&&v.g1<v.g2&&v.c<v.d&&v.e<v.f;
    var oth=sub2([1,1],g);v.o1=oth[0];v.o2=oth[1];var gc=mul(g,[v.c,v.d]),oc=sub2([v.e,v.f],gc),an=oc[0]>0?dvf(oc,oth):[0,1];
    v._g=g;v._gc=gc;v._oc=oc;v._o=oth;v._an=an;v.fn=an[0];v.fd=an[1];if(!(ok&&an[0]>0&&an[0]<an[1]&&an[1]<=12&&gc[1]<=40))v.fn=NaN;return v;};
  x.calc=function(v){return Lc[0]+' ＝ '+fs(v._g)+' × '+v.c+'/'+v.d+' ＝ '+fs(v._gc)+'<br>'+Lc[1]+' ＝ '+v.e+'/'+v.f+' − '+fs(v._gc)+' ＝ '+fs(v._oc)+'<br>'+fs(v._oc)+' ÷ '+fs(v._o)+' ＝ '+fs(v._an);};
  x.fig=function(v,o){var g=v._g,gc=v._gc,oc=v._oc,ot=v._o,e=[v.e,v.f],kn=[fs(gc),fs(sub2(g,gc)),fs(g)],un=[fs(oc),fs(sub2(ot,oc)),fs(ot)];
    return tb(o,[ar===0?un:kn,ar===0?kn:un,[fs(e),fs(sub2([1,1],e)),'1']]);};
  x.c=function(v,O,R){var out=[],seen={};function put(f){if(!(f[0]>0&&f[0]<f[1]))return;f=fr(f[0],f[1]);var s2=fs(f);if(seen[s2])return;seen[s2]=1;out.push(s2);}
    put(v._an);put(v._oc);put([v.e,v.f]);put(v._o);put(v._gc);put([v.c,v.d]);for(var k=1;out.length<5&&k<12;k++){put([v.fn+k,v.fd]);put([v.fn,v.fd+k]);}return GENV.sort(out.slice(0,5),0);};
  /* 別解：全体を分母の最小公倍数の大きさの整数で数える */
  x.chk=function(g,y){var N=g.g2*g.d*g.f*12,G=N*g.g1/g.g2,Gc=G*g.c/g.d,Fo=N*g.e/g.f,O=N-G;return E(y,(Fo-Gc)/O);};
  x.a='fn';return GENV(F,5,s,i,x);}
FR5('practice',4,['o1','o2','g1','g2','c','d','e','f']);
FR5('applied',4,['g1','g2','c','d','e','f']);
FR5('real',6,['g1','g2','c','d','e','f']);
})();
