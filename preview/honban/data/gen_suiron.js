/* 推論：数値・並びを変える問題（テンプレート）。既存の問題（suiron_6.js・suiron_7.js）の文の形と条件の数はそのまま、
   人の役割（だれがどの条件か）と数値を毎回変える。答えは総当たりで決め、「答えが1つに決まる」「すべて選ぶの個数が元と同じくらい」になる数値だけを使う。
   verify は条件をデータ（v.C）から読み直し、別の数え上げ（後ろから決める深さ優先）で解き直す。元の問題は残す。 */
(function(){
var LT=['P','Q','R','S','T','U','V'],CI='①②③④⑤⑥⑦⑧⑨⑩⑪⑫'.split(''),MK6=['ア','イ','ウ','エ','オ','カ'],MK7=['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ'];
function rg(a,b){var r=[];for(var i=a;i<=b;i++)r.push(i);return r;}
/* ---------- 並べ方の候補をすべて作る（make 用：前から決める） ---------- */
var CA={};
function VALS(d,i){var r=d.r&&d.r[i];var lo=r?r[0]:d.lo,hi=r?r[1]:d.hi,st=d.st||1,a=[];for(var x=lo;x<=hi;x+=st)a.push(x);return a;}
function PAIRS(n){var a=[];for(var i=0;i<n;i++)for(var j=i+1;j<n;j++)a.push([i,j]);return a;}
function ENUM(d){var key=JSON.stringify(d);if(CA[key])return CA[key];var out=[];
 if(d.t==='perm'){(function rec(a){if(a.length===d.n){out.push(a.slice());return;}for(var v=0;v<d.m;v++)if(a.indexOf(v)<0){a.push(v);rec(a);a.pop();}})([]);}
 else if(d.t==='tup'){(function rec(a,s){var i=a.length;if(i===d.n){if(d.sum==null||s===d.sum)out.push(a.slice());return;}
   VALS(d,i).forEach(function(x){if(d.dis&&a.indexOf(x)>=0)return;if(d.sum!=null&&s+x>d.sum)return;a.push(x);rec(a,s+x);a.pop();});})([],0);}
 else{var P=PAIRS(d.n).length,b=d.dr?3:2,tot=Math.pow(b,P);for(var c=0;c<tot;c++){var a=[],x=c;for(var i=0;i<P;i++){a.push(x%b);x=Math.floor(x/b);}out.push(a);}}
 return CA[key]=out;}
/* ---------- 位置の形（席・部屋） ---------- */
var GEO={
 c6:{adj:function(x,y){var d=(x-y+6)%6;return d===1||d===5;},opp:function(x,y){return (x+3)%6===y;}},
 tb:{adj:function(x,y){return Math.floor(x/3)===Math.floor(y/3)&&Math.abs(x-y)===1;},opp:function(x,y){return Math.abs(x-y)===3;},end:function(x){return x%3!==1;},row:function(x){return Math.floor(x/3);}},
 a23:{fl:function(x){return Math.floor(x/3)+1;},above:function(x,y){return x===y+3;},adj:function(x,y){return Math.floor(x/3)===Math.floor(y/3)&&Math.abs(x-y)===1;},lab:['101','102','103','201','202','203']},
 a32:{fl:function(x){return Math.floor(x/2)+1;},above:function(x,y){return x===y+2;},adj:function(x,y){return Math.floor(x/2)===Math.floor(y/2)&&Math.abs(x-y)===1;},lab:['101','102','201','202','301','302']}};
/* ---------- 条件（make 用の関数 f と、verify 用のデータ d） ---------- */
function W(p,a,n){var w=0;PAIRS(n).forEach(function(q,k){if(q[0]===a&&p[k]===0||q[1]===a&&p[k]===1)w++;});return w;}
function PT(p,a,n){var w=0;PAIRS(n).forEach(function(q,k){if(q[0]!==a&&q[1]!==a)return;if(p[k]===2)w+=1;else if(q[0]===a&&p[k]===0||q[1]===a&&p[k]===1)w+=3;});return w;}
function DR(p,a,n){var w=0;PAIRS(n).forEach(function(q,k){if((q[0]===a||q[1]===a)&&p[k]===2)w++;});return w;}
function PK(n,a,b){var k=-1;PAIRS(n).forEach(function(q,i){if(q[0]===a&&q[1]===b||q[0]===b&&q[1]===a)k=i;});return k;}
var C={
 lt:function(a,b){return {f:function(p){return p[a]<p[b];},d:['lt',a,b]};},
 eqd:function(a,b,x){return {f:function(p){return p[a]===p[b]+x;},d:['eqd',a,b,x]};},
 gap:function(a,b,g){return {f:function(p){return Math.abs(p[a]-p[b])===g;},d:['gap',a,b,g]};},
 at:function(a,k){return {f:function(p){return p[a]===k;},d:['at',a,k]};},
 nat:function(a,k){return {f:function(p){return p[a]!==k;},d:['nat',a,k]};},
 rng:function(a,lo,hi){return {f:function(p){return p[a]>=lo&&p[a]<=hi;},d:['rng',a,lo,hi]};},
 eqm:function(a,b,m){return {f:function(p){return p[a]===m*p[b];},d:['eqm',a,b,m]};},
 eq:function(a,b){return {f:function(p){return p[a]===p[b];},d:['eqd',a,b,0]};},
 ne:function(a,b){return {f:function(p){return p[a]!==p[b];},d:['ne',a,b]};},
 ge:function(a,k){return {f:function(p){return p[a]>=k;},d:['rng',a,k,1e9]};},
 le:function(a,k){return {f:function(p){return p[a]<=k;},d:['rng',a,-1e9,k]};},
 mx:function(a){return {f:function(p){return p.every(function(x,i){return i===a||x<p[a];});},d:['mx',a]};},
 par:function(a,o){return {f:function(p){return p[a]%2===o;},d:['par',a,o]};},
 ws:function(w,T){return {f:function(p){var s=0;w.forEach(function(x,i){s+=x*p[i];});return s===T;},d:['ws',w,T]};},
 prod:function(M){return {f:function(p){return p.reduce(function(a,b){return a*b;},1)===M;},d:['prod',M]};},
 sle:function(T){return {f:function(p){return p.reduce(function(a,b){return a+b;},0)<=T;},d:['sle',T]};},
 cnt:function(v,k){return {f:function(p){return p.filter(function(x){return x===v;}).length===k;},d:['cnt',v,k]};},
 cge:function(v,k){return {f:function(p){return p.filter(function(x){return x===v;}).length>=k;},d:['cge',v,k]};},
 difadj:function(){return {f:function(p){for(var i=1;i<p.length;i++)if(p[i]===p[i-1])return false;return true;},d:['difadj']};},
 allv:function(K){return {f:function(p){for(var v=0;v<K;v++)if(p.indexOf(v)<0)return false;return true;},d:['allv',K]};},
 psum:function(a,b,x){return {f:function(p){return p[a]+p[b]===x;},d:['psum',a,b,x]};},
 pprod:function(a,b,x){return {f:function(p){return p[a]*p[b]===x;},d:['pprod',a,b,x]};},
 imod:function(a,num,den){return {f:function(p){return p[a]*num%den===0;},d:['imod',a,num,den]};},
 mle:function(a,num,den,L){return {f:function(p){return p[a]*num<=L*den;},d:['mle',a,num,den,L]};},
 g:function(t,a,b,g){return {f:function(p){return GEO[g][t](p[a],p[b]);},d:['g',t,a,b,g]};},
 ng:function(t,a,b,g){return {f:function(p){return !GEO[g][t](p[a],p[b]);},d:['ng',t,a,b,g]};},
 end:function(a,g){return {f:function(p){return GEO[g].end(p[a]);},d:['end',a,g]};},
 drow:function(a,b,g){return {f:function(p){return GEO[g].row(p[a])!==GEO[g].row(p[b]);},d:['drow',a,b,g]};},
 fl:function(a,f,g){return {f:function(p){return GEO[g].fl(p[a])===f;},d:['fl',a,f,g]};},
 nfl:function(a,f,g){return {f:function(p){return GEO[g].fl(p[a])!==f;},d:['nfl',a,f,g]};},
 sfl:function(a,b,g){return {f:function(p){return GEO[g].fl(p[a])===GEO[g].fl(p[b]);},d:['sfl',a,b,g]};},
 /* 対戦 */
 wins:function(a,w,n){return {f:function(p){return W(p,a,n)===w;},d:['wins',a,w,n]};},
 beat:function(a,b,n){var k=PK(n,a,b),v=a<b?0:1;return {f:function(p){return p[k]===v;},d:['beat',a,b,n]};},
 eqw:function(a,b,n){return {f:function(p){return W(p,a,n)===W(p,b,n);},d:['eqw',a,b,n]};},
 pts:function(a,x,n){return {f:function(p){return PT(p,a,n)===x;},d:['pts',a,x,n]};},
 ptge:function(a,x,n){return {f:function(p){return PT(p,a,n)>=x;},d:['ptge',a,x,n]};},
 eqp:function(a,b,n){return {f:function(p){return PT(p,a,n)===PT(p,b,n);},d:['eqp',a,b,n]};},
 nodr:function(a,n){return {f:function(p){return DR(p,a,n)===0;},d:['nodr',a,n]};},
 draw:function(a,b,n){var k=PK(n,a,b);return {f:function(p){return p[k]===2;},d:['draw',a,b,n]};},
 nodrw:function(L,n){var ks=[];L.forEach(function(a,i){L.forEach(function(b,j){if(i<j)ks.push(PK(n,a,b));});});return {f:function(p){return ks.every(function(k){return p[k]!==2;});},d:['nodrw',L,n]};},
 imp:function(x,y){return {f:function(p){return !x.f(p)||y.f(p);},d:['imp',x.d,y.d]};}
};
/* 聞くもの（make 用） */
function QF(q,p){var t=q[0];if(t==='val')return p[q[1]];if(t==='who')return p.indexOf(q[1]);if(t==='opp')return p.indexOf((p[q[1]]+(q[2]==='c6'?3:p[q[1]]<3?3:-3))%6);
 if(t==='wins')return W(p,q[1],q[2]);if(t==='pts')return PT(p,q[1],q[2]);if(t==='rec'){var w=W(p,q[1],q[2]);return w+'勝'+(q[2]-1-w)+'敗';}
 if(t==='psum')return p[q[1]]+p[q[2]];if(t==='lin'){var s=0;q[1].forEach(function(x,i){s+=x*p[i];});return s/q[2];}}

/* ---------- verify：条件をデータから読み直して、後ろから決める深さ優先で解き直す ---------- */
function EV(d,p){var t=d[0];
 switch(t){case 'lt':return p[d[1]]<p[d[2]];case 'eqd':return p[d[1]]-p[d[2]]===d[3];case 'gap':return p[d[1]]-p[d[2]]===d[3]||p[d[2]]-p[d[1]]===d[3];
 case 'at':return p[d[1]]===d[2];case 'nat':return p[d[1]]!==d[2];case 'rng':return d[2]<=p[d[1]]&&p[d[1]]<=d[3];case 'eqm':return p[d[1]]===p[d[2]]*d[3];
 case 'ne':return p[d[1]]!==p[d[2]];case 'mx':return Math.max.apply(null,p)===p[d[1]]&&p.filter(function(x){return x===p[d[1]];}).length===1;
 case 'par':return (p[d[1]]-d[2])%2===0;case 'ws':return d[1].reduce(function(s,x,i){return s+x*p[i];},0)===d[2];
 case 'prod':var m=1;for(var i=0;i<p.length;i++)m*=p[i];return m===d[1];case 'sle':var s=0;for(i=0;i<p.length;i++)s+=p[i];return s<=d[1];
 case 'cnt':case 'cge':var c=0;for(i=0;i<p.length;i++)if(p[i]===d[1])c++;return t==='cnt'?c===d[2]:c>=d[2];
 case 'difadj':return p.every(function(x,i){return i===0||x!==p[i-1];});case 'allv':for(i=0;i<d[1];i++)if(p.indexOf(i)===-1)return false;return true;
 case 'psum':return p[d[1]]+p[d[2]]===d[3];case 'pprod':return p[d[1]]*p[d[2]]===d[3];case 'imod':return Number.isInteger(p[d[1]]*d[2]/d[3]);case 'mle':return p[d[1]]*d[2]/d[3]<=d[4];
 case 'g':case 'ng':var r=G2(d[1],p[d[2]],p[d[3]],d[4]);return t==='g'?r:!r;
 case 'end':return d[2]==='tb'&&[0,2,3,5].indexOf(p[d[1]])>=0;case 'drow':return (p[d[1]]<3)!==(p[d[2]]<3);
 case 'fl':return FL(p[d[1]],d[3])===d[2];case 'nfl':return FL(p[d[1]],d[3])!==d[2];case 'sfl':return FL(p[d[1]],d[3])===FL(p[d[2]],d[3]);
 case 'wins':return MW(p,d[3])[d[1]].w===d[2];case 'beat':return MW(p,d[3])[d[1]].b[d[2]]===1;case 'eqw':var M=MW(p,d[3]);return M[d[1]].w===M[d[2]].w;
 case 'pts':return MW(p,d[3])[d[1]].pt===d[2];case 'ptge':return MW(p,d[3])[d[1]].pt>=d[2];case 'eqp':M=MW(p,d[3]);return M[d[1]].pt===M[d[2]].pt;
 case 'nodr':return MW(p,d[2])[d[1]].dr===0;case 'draw':return MW(p,d[3])[d[1]].b[d[2]]===0.5;
 case 'nodrw':M=MW(p,d[2]);return d[1].every(function(a){return d[1].every(function(b){return a===b||M[a].b[b]!==0.5;});});
 case 'imp':return !EV(d[1],p)||EV(d[2],p);}
 throw new Error('未知の条件 '+t);}
function FL(x,g){return g==='a23'?(x<3?1:2):(x<2?1:x<4?2:3);}
function G2(t,x,y,g){var row=g==='a23'?3:g==='a32'?2:3;
 if(t==='opp')return g==='c6'?Math.abs(x-y)===3:Math.abs(x-y)===3;
 if(t==='adj')return g==='c6'?[1,5].indexOf(Math.abs(x-y))>=0:(Math.floor(x/row)===Math.floor(y/row)&&(x-y===1||y-x===1));
 if(t==='above')return x-y===row;}
/* 対戦表：勝ち・引き分けを表にしてから数える */
function MW(p,n){var M=[];for(var i=0;i<n;i++)M.push({b:{},w:0,pt:0,dr:0});var k=0;
 for(i=0;i<n;i++)for(var j=i+1;j<n;j++){var o=p[k++];if(o===2){M[i].b[j]=M[j].b[i]=0.5;M[i].pt++;M[j].pt++;M[i].dr++;M[j].dr++;}
  else{var a=o===0?i:j,b=o===0?j:i;M[a].b[b]=1;M[b].b[a]=0;M[a].w++;M[a].pt+=3;}}return M;}
function QV(q,p){var t=q[0];if(t==='val')return p[q[1]];if(t==='who'){for(var i=0;i<p.length;i++)if(p[i]===q[1])return i;}
 if(t==='opp'){var s=p[q[1]];for(i=0;i<p.length;i++)if(i!==q[1]&&Math.abs(p[i]-s)===3)return i;}
 if(t==='wins')return MW(p,q[2])[q[1]].w;if(t==='pts')return MW(p,q[2])[q[1]].pt;if(t==='rec'){var w=MW(p,q[2])[q[1]].w;return w+'勝'+(q[2]-1-w)+'敗';}
 if(t==='psum')return p[q[1]]+p[q[2]];if(t==='lin'){var s2=0;for(i=0;i<p.length;i++)s2+=q[1][i]*p[i];return s2/q[2];}}
function ENUM2(d){var out=[];
 if(d.t==='league'){var P=d.n*(d.n-1)/2,b=d.dr?3:2,a=[];(function rec(i){if(i<0){out.push(a.slice());return;}for(var v=b-1;v>=0;v--){a[i]=v;rec(i-1);}})(P-1);return out;}
 var n=d.n,a2=new Array(n);
 function vals(i){if(d.t==='perm')return rg(0,d.m-1).reverse();return VALS(d,i).reverse();}
 (function rec(i){if(i<0){if(d.t==='tup'&&d.sum!=null&&a2.reduce(function(x,y){return x+y;},0)!==d.sum)return;out.push(a2.slice());return;}
  vals(i).forEach(function(x){for(var j=i+1;j<n;j++)if((d.t==='perm'||d.dis)&&a2[j]===x)return;a2[i]=x;rec(i-1);});})(n-1);return out;}
function VERIFY(v){var sols=ENUM2(v.dom).filter(function(p){return v.C.every(function(d){return EV(d,p);});});
 if(v.mode==='must'||v.mode==='mall'){var tr=v.st.filter(function(s){return sols.every(function(p){return EV(s.d,p);});}).map(function(s){return s.s;});return v.mode==='must'?tr[0]+(tr.length>1?'（ほかにも）':''):tr;}
 var set=[];sols.forEach(function(p){var x=QV(v.q,p);if(set.indexOf(x)<0)set.push(x);});
 if(v.mode==='all')return v.opts.filter(function(o){return set.indexOf(o.x)>=0;}).map(function(o){return o.s;});
 if(set.length!==1)return 'このことだけではわからない';var f=v.opts.filter(function(o){return o.x===set[0];});return f.length?f[0].s:'(選択肢にない)';}

/* ---------- 問題を組み立てる ---------- */
function NUMO(ans,lo,u,n){n=n||5;var st=ans-Math.floor(Math.random()*n);if(st<lo)st=lo;return rg(st,st+n-1).map(function(x){return {s:x+u,x:x};});}
function SYM(d,N){var A=N[d[1]],B=N[d[2]];switch(d[0]){
 case 'lt':return A+'＜'+B;case 'eqd':return d[3]===0?A+'＝'+B:A+'＝'+B+(d[3]>0?'＋'+d[3]:'−'+(-d[3]));case 'gap':return '|'+A+'−'+B+'|＝'+d[3];
 case 'at':return A+'＝'+(d.base!=null?d[2]:d[2]+1);case 'nat':return A+'≠'+(d[2]+1);case 'rng':return d[3]>=1e9?A+'≧'+d[2]:d[2]<=-1e9?A+'≦'+d[3]:d[2]+'≦'+A+'≦'+d[3];
 case 'eqm':return A+'＝'+d[3]+'×'+B;case 'ne':return A+'≠'+B;case 'mx':return A+'が最大';case 'par':return A+'は'+(d[2]?'奇数':'偶数');
 case 'g':A=N[d[2]];B=N[d[3]];return A+(d[1]==='opp'?'↔':d[1]==='adj'?'−':'＝')+B+(d[1]==='opp'?'（向かい）':d[1]==='adj'?'（隣）':'の真上');case 'ng':A=N[d[2]];B=N[d[3]];return A+'≠'+B+'の'+(d[1]==='adj'?'隣':'向かい');
 case 'end':return A+'＝端';case 'drow':return A+'と'+B+'は反対の列';case 'fl':return A+'＝'+d[2]+'階';case 'nfl':return A+'≠'+d[2]+'階';case 'sfl':return A+'と'+B+'は同じ階';
 case 'wins':return A+'＝'+d[2]+'勝';case 'beat':return A+'＞'+B;case 'eqw':return A+'と'+B+'の勝ち数が同じ';case 'pts':return A+'＝'+d[2]+'点';case 'ptge':return A+'≧'+d[2]+'点';
 case 'eqp':return A+'＝'+B+'（勝ち点）';case 'nodr':return A+'は引き分けなし';case 'draw':return A+'−'+B+'は引き分け';case 'nodrw':return d[1].map(function(i){return N[i];}).join('・')+'どうしは引き分けなし';
 case 'prod':return '積＝'+d[1];case 'sle':return '和≦'+d[1];case 'ws':return d[1].map(function(w,i){return w+'×'+N[i];}).join('＋')+'＝'+d[2];
 case 'cnt':return '各'+d[2];case 'difadj':return '隣どうしは違う';case 'allv':return 'どれも1以上';
 case 'psum':return N[d[1]]+'の和＝'+d[3];case 'pprod':return N[d[1]]+'の積＝'+d[3];default:return '';}}
/* cfg.gen(R) が返すもの：{dom, C:[{f,d,t(文),h(隠す)}], q:聞くもの, mode:'one'|'all'|'must'|'mall', opts|st, q1:問題文の前半, qa:問いの文, mk, N, ok(答えの個数)} */
function BUILD(R,cfg){for(var tr=0;tr<400;tr++){var g=cfg.gen(R);if(!g)continue;var C1=g.C,sols=ENUM(g.dom).filter(function(p){return C1.every(function(c){return c.f(p);});});
 if(!sols.length||sols.length>(g.maxs||40))continue;var res=ANS(R,g,sols);if(!res)continue;
 var mk=g.mk||MK6,lines=[],k=0;C1.forEach(function(c){if(c.t)lines.push('<br>'+mk[k++]+'　'+c.t);});
 var q=g.q1+(lines.length?'次のことがわかっている。'+lines.join('')+'<br>':'')+g.qa+(g.mode==='all'||g.mode==='mall'?'当てはまるものをすべて選びなさい。':'');
 if(g.q2)q=g.q2(lines.join(''));
 var sy=C1.filter(function(c){return !c.h;}).map(function(c){return SYM(c.d,g.N);}).filter(Boolean);
 var o={q:q,c:res.c,a:res.a,inwh:'記号',inw:g.inw||(mk===MK6?sy.join('<br>'):sy.join('、')),fig:g.fig?g.fig(sols,res):FIG(g,sols,res),
  calc:(g.cpre?g.cpre+'<br>':'')+'条件をすべて満たす'+(g.unit||'並び方')+'を書き出すと '+sols.length+'通り'+(sols.length>8?'（表は8通りまで）':'')+'<br>'+res.line,
  v:{dom:g.dom,C:C1.map(function(c){return c.d;}),q:g.q,mode:g.mode,opts:g.opts,st:res.st}};
 if(g.sec)o.sec=g.sec;return o;}
 throw new Error('数値が決まらない');}
function ANS(R,g,sols){
 if(g.mode==='must'||g.mode==='mall'){var given=g.C.map(function(c){return JSON.stringify(c.d);});g.st=g.st.filter(function(x){return given.indexOf(JSON.stringify(x.d))<0;});var st=g.st.map(function(s){var all=sols.every(function(p){return s.f(p);});return {s:s.s,d:s.d,tr:all};}),seen={};
  st=st.filter(function(s){if(seen[s.s])return false;seen[s.s]=1;return true;});var T=R.shuffle(st.filter(function(s){return s.tr;})),F=R.shuffle(st.filter(function(s){return !s.tr;}));
  if(g.mode==='must'){if(!T.length||F.length<4)return null;var ch=R.shuffle([T[0]].concat(F.slice(0,4)));return {c:ch.map(function(s){return s.s;}),a:ch.indexOf(T[0]),st:ch.map(function(s){return {s:s.s,d:s.d};}),line:'どの並び方でも成り立つのは「'+T[0].s+'」'};}
  var nt=R.int(g.ok[0],g.ok[1]),NN=g.nst;if(T.length<nt||F.length<NN-nt)return null;ch=R.shuffle(T.slice(0,nt).concat(F.slice(0,NN-nt)));
  return {c:ch.map(function(s){return s.s;}),a:ch.map(function(s,i){return s.tr?i:-1;}).filter(function(i){return i>=0;}),st:ch.map(function(s){return {s:s.s,d:s.d};}),line:'どの場合でも成り立つのは '+ch.filter(function(s){return s.tr;}).map(function(s){return s.s.replace(/である$|だった$/,'');}).join('、')};}
 var set=[];sols.forEach(function(p){var x=QF(g.q,p);if(set.indexOf(x)<0)set.push(x);});
 var opts=typeof g.opts==='function'?g.opts(set):g.opts;g.opts=opts;if(!opts)return null;
 if(g.mode==='one'){if(set.length!==1)return null;var i=-1;opts.forEach(function(o,j){if(o.x===set[0])i=j;});if(i<0)return null;return {c:opts.map(function(o){return o.s;}),a:i,line:g.al?g.al(opts[i].s):'答えは '+opts[i].s};}
 var a=[];opts.forEach(function(o,j){if(set.indexOf(o.x)>=0)a.push(j);});if(a.length!==set.length)return null;if(a.length<g.ok[0]||a.length>g.ok[1]||a.length>=opts.length)return null;
 return {c:opts.map(function(o){return o.s;}),a:a,line:(g.al?g.al(a.map(function(j){return opts[j].s;})):'当てはまるのは '+a.map(function(j){return opts[j].s;}).join('、'))};}
function FIG(g,sols,res){var S=sols.slice(0,8),N=g.N;
 if(g.dom.t==='perm'){var hd=g.sl;return {table:{head:[''].concat(hd),rows:S.map(function(p,i){return [CI[i]].concat(hd.map(function(_,s){var w=p.indexOf(s);return w<0?'':((g.q&&g.q[0]==='val'&&w===g.q[1]||g.q&&g.q[0]==='who'&&s===g.q[1])?'!':'')+N[w];}));})}};}
 if(g.dom.t==='tup'){var nm=g.cols||N;return {table:{head:[''].concat(nm),rows:S.map(function(p,i){return [CI[i]].concat(p.map(function(x,j){return ((g.q&&g.q[0]==='val'&&g.q[1]===j)?'!':'')+(g.vf?g.vf(x,j):x);}));})}};}
 var n=g.dom.n,p=S[0],M=MW(p,n);return {table:{head:[''].concat(N.slice(0,n),[g.dom.dr?'勝ち点':'勝']),rows:N.slice(0,n).map(function(a,i){return [a].concat(N.slice(0,n).map(function(_,j){return i===j?'—':M[i].b[j]===1?'○':M[i].b[j]===0?'×':'△';}),[(g.q&&g.q[1]===i?'!':'')+(g.dom.dr?M[i].pt:M[i].w)]);})}};}
function T(c,t,h){c.t=t;if(h)c.h=1;return c;}
function OPT(list,u){return list.map(function(x,i){return {s:(typeof u==='function'?u(x,i):x+(u||'')),x:x};});}
var UNK={s:'このことだけではわからない',x:'?'};

var S6=BANK['推論'][6],S7=BANK['推論'][7];
function add(st,id,cfg){st.push({id:id,make:function(R){return BUILD(R,cfg);},verify:function(v){return VERIFY(v);}});}
function NM(R,n){var X=R.shuffle(rg(0,n-1));return X;}

/* ======================= 指標6 ======================= */
add(S6.concept,'g-sui6-c0',{gen:function(R){var X=NM(R,4),N=LT.slice(0,4),k=R.int(0,3),pr=R.shuffle([[0,1],[1,2],[2,3]]);
 var C1=pr.map(function(q){var a=X[q[0]],b=X[q[1]];return T(C.lt(a,b),N[a]+'は'+N[b]+'より先にゴールした。');});
 return {dom:{t:'perm',n:4,m:4},C:C1,N:N,sl:['1位','2位','3位','4位'],q:['who',k],mode:'one',opts:OPT(rg(0,3),function(x){return N[x];}).concat([UNK]),
  q1:'P、Q、R、Sの4人が100m走をした。同着の者はいなかった。',qa:(k+1)+'位になったのはだれか。'};}});
add(S6.concept,'g-sui6-c1',{gen:function(R){var T0=R.int(6,12),X=R.shuffle([0,1,2]),N=['赤い玉','青い玉','白い玉'];
 return {dom:{t:'tup',n:3,lo:1,hi:T0,sum:T0},N:N,C:[T(C.ge(0,1),'どの色の玉も1個以上ある。'),T(C.lt(X[1],X[0]),N[X[0]]+'は'+N[X[1]]+'より多い。'),T(C.lt(X[2],X[1]),N[X[1]]+'は'+N[X[2]]+'より多い。')],
  q:['val',X[0]],mode:'one',opts:function(s){return NUMO(s[0],1,'個');},unit:'個数の組',
  q1:'赤、青、白の3色の玉が合わせて'+T0+'個ある。',qa:N[X[0]].replace('い玉','い玉')+'は何個か。'};}});
add(S6.concept,'g-sui6-c2',{gen:function(R){var X=NM(R,5),N=LT.slice(0,5),L=R.pick([0,1]),e=L?4:0,o=L?0:4,d=L?-1:1,k=R.int(0,4),sd=['左端','右端'];
 return {dom:{t:'perm',n:5,m:5},N:N,sl:['1','2','3','4','5'],q:['who',k],mode:'one',opts:OPT(rg(0,4),function(x){return N[x];}),
  C:[T(C.at(X[0],e),N[X[0]]+'は'+sd[L]+'の席に座った。'),T(C.gap(X[1],X[0],1),N[X[1]]+'は'+N[X[0]]+'の隣に座った。'),T(C.gap(X[2],X[1],1),N[X[2]]+'は'+N[X[1]]+'の隣に座った。'),T(C.at(X[3],o),N[X[3]]+'は'+sd[1-L]+'の席に座った。')],
  q1:'横一列に並んだ5つの席に、P、Q、R、S、Tの5人が1人ずつ座った。',qa:'左から'+(k+1)+'番目の席に座ったのはだれか。'};}});
/* 練習 */
add(S6.practice,'g-sui6-p0',{gen:function(R){var X=NM(R,5),N=LT.slice(0,5),k=R.int(1,3),A=X[0],B=X[1],Cc=X[2],D=X[3],E=X[4];
 return {dom:{t:'perm',n:5,m:5},N:N,sl:['1','2','3','4','5'],q:['val',B],mode:'one',opts:OPT(rg(0,4).filter(function(x){return x!==k;}),function(x){return (x+1)+'番目';}).concat([UNK]),
  C:[T(C.at(A,k),N[A]+'は'+(k+1)+'番目に到着した。'),T(C.eqd(Cc,B,1),N[Cc]+'は'+N[B]+'のすぐ後に到着した。'),T(C.lt(E,D),N[D]+'は'+N[E]+'より後に到着した。'),T(C.lt(E,B),N[E]+'は'+N[B]+'より先に到着した。')],
  q1:'P、Q、R、S、Tの5人が待ち合わせ場所に1人ずつ到着した。',qa:N[B]+'は何番目に到着したか。'};}});
add(S6.practice,'g-sui6-p1',{gen:function(R){var X=NM(R,4),N=LT.slice(0,4),d=R.int(1,3);
 return {dom:{t:'tup',n:4,lo:1,hi:7,sum:10,dis:1},N:N,q:['val',X[3]],mode:'one',opts:OPT([1,2,3,4],'個').concat([UNK]),unit:'個数の組',
  C:[T(C.eqd(X[0],X[1],d),N[X[0]]+'は'+N[X[1]]+'より'+d+'個多くもらった。'),T(C.lt(X[0],X[2]),N[X[2]]+'は'+N[X[0]]+'より多くもらった。')],
  q1:'P、Q、R、Sの4人で、みかん10個を分けた。全員が1個以上もらい、もらった個数は4人とも異なっていた。',qa:N[X[3]]+'は何個もらったか。'};}});
add(S6.practice,'g-sui6-p2',{gen:function(R){var X=NM(R,4),N=LT.slice(0,4);
 return {dom:{t:'league',n:4},N:N,q:['wins',X[2],4],mode:'one',opts:OPT([0,1,2,3],'勝').concat([UNK]),unit:'勝敗の組',
  C:[T(C.wins(X[0],3,4),N[X[0]]+'は全勝した。'),T(C.wins(X[3],0,4),N[X[3]]+'は全敗した。'),T(C.beat(X[1],X[2],4),N[X[1]]+'は'+N[X[2]]+'に勝った。')],
  inw:'1チーム3試合。1試合で勝ちと負けが1つずつできる',q1:'P、Q、R、Sの4チームがサッカーの総当たり戦を行った。引き分けの試合はなかった。',qa:N[X[2]]+'は何勝したか。'};}});
add(S6.practice,'g-sui6-p3',{gen:function(R){var A=R.pick([50,60,65,70,75,80]),d=R.pick([6,8,10,12,15]),e=R.pick([3,6,9,10,12]);if((d-e)%3)return null;var Q=A-(d-e)/3;
 return {dom:{t:'tup',n:3,r:[[Q+d-1,Q+d+1],[Q-2,Q+2],[Q-e-1,Q-e+1]],sum:3*A},N:['P','Q','R'],q:['val',0],mode:'one',opts:function(s){return NUMO(s[0],0,'点');},unit:'点数の組',
  C:[T(C.eqd(0,1,d),'PはQより'+d+'点高かった。'),T(C.eqd(2,1,-e),'RはQより'+e+'点低かった。')],inw:'Qを基準にする<br>ア　P＝Q＋'+d+'<br>イ　R＝Q − '+e,
  q1:'P、Q、Rの3人がテストを受けた。3人の平均点は'+A+'点であった。',qa:'Pは何点だったか。',cpre:'合計 '+A+' × 3 ＝ '+3*A+'、Q ＋ '+d+' ＋ Q ＋ Q − '+e+' ＝ '+3*A+' → Q ＝ '+Q};}});
add(S6.practice,'g-sui6-p4',{gen:function(R){var S=R.int(12,20),m=R.pick([2,3]);
 return {dom:{t:'tup',n:3,lo:1,hi:9,dis:1,sum:S},N:['X','Y','Z'],q:['val',2],mode:'one',opts:function(s){return NUMO(s[0],1,'');},unit:'数の組',
  C:[T(C.ws([1,1,1],S),'X＋Y＋Z＝'+S),T(C.eqm(0,1,m),'XはYの'+m+'倍である。'),T(C.lt(0,2),'ZはXより大きい。')],
  q1:'1から9までの整数のうち、異なる3つの数X、Y、Zがある。',qa:'Zはいくつか。'};}});
function HT(R,n,N){var X=NM(R,n),pr=[],tru=R.shuffle(rg(0,n-1));/* tru[i]＝i番目に背が高い人 */
 return {X:X,tru:tru};}
add(S6.practice,'g-sui6-p5',{gen:function(R){var N=LT.slice(0,4),tr=R.shuffle(rg(0,3)),pairs=R.shuffle([[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]).slice(0,3);
 var C1=pairs.map(function(q){var a=tr[q[0]],b=tr[q[1]];return R.pick([0,1])?T(C.lt(a,b),N[a]+'は'+N[b]+'より背が高い。'):T(C.lt(a,b),N[b]+'は'+N[a]+'より背が低い。');});
 var st=[];N.forEach(function(x,i){st.push({s:x+'は4人の中で最も背が高い',f:C.at(i,0).f,d:['at',i,0]},{s:x+'は2番目に背が高い',f:C.at(i,1).f,d:['at',i,1]},{s:x+'は3番目に背が高い',f:C.at(i,2).f,d:['at',i,2]},{s:x+'は4人の中で最も背が低い',f:C.at(i,3).f,d:['at',i,3]});});
 return {dom:{t:'perm',n:4,m:4},N:N,sl:['1','2','3','4'],C:C1,mode:'must',st:st,inw:'背が高い人を前（小さい番号）にする<br>'+C1.map(function(c,i){return MK6[i]+'　'+N[c.d[1]]+' → '+N[c.d[2]];}).join('<br>'),
  q1:'P、Q、R、Sの4人の身長について、次のことがわかっている。同じ身長の者はいない。',q2:function(L){return 'P、Q、R、Sの4人の身長について、次のことがわかっている。同じ身長の者はいない。'+L+'<br>次のうち、必ず正しいものはどれか。';},qa:''};}});
/* 実践（単純な数値） */
add(S6.applied,'g-sui6-a0',{gen:function(R){var X=NM(R,5),N=LT.slice(0,5),dd=R.pick([2,3]);var st=[];
 N.forEach(function(x,i){st.push({s:x+'は先頭である',f:C.at(i,0).f,d:['at',i,0]},{s:x+'は最後尾である',f:C.at(i,4).f,d:['at',i,4]},{s:x+'は'+R.int(2,4)+'番目である',f:null,d:null});
  N.forEach(function(y,j){if(i!==j)st.push({s:x+'は'+y+'より前に並んだ',f:C.lt(i,j).f,d:['lt',i,j]});});});
 st.forEach(function(s){if(!s.f){var k=+s.s.match(/は(\d)番目/)[1]-1,i=N.indexOf(s.s[0]);s.f=C.at(i,k).f;s.d=['at',i,k];}});
 return {dom:{t:'perm',n:5,m:5},N:N,sl:['1','2','3','4','5'],mode:'must',st:st,
  C:[T(C.eqd(X[1],X[0],dd),N[X[0]]+'は'+N[X[1]]+'の'+dd+'人前に並んだ。'),T(C.eqd(X[0],X[2],1),N[X[2]]+'は'+N[X[0]]+'のすぐ前に並んだ。'),T(C.nat(X[3],4),N[X[3]]+'は最後尾ではない。')],
  q1:'P、Q、R、S、Tの5人が縦一列に並んだ。',qa:'次のうち、必ず正しいものはどれか。'};}});
add(S6.applied,'g-sui6-a1',{gen:function(R){var T0=R.int(9,15),m=R.pick([2,3]);
 return {dom:{t:'tup',n:3,lo:1,hi:T0,sum:T0},N:['赤','青','黄'],q:['val',2],mode:'one',opts:function(s){return NUMO(s[0],1,'本');},unit:'本数の組',
  C:[T(C.eqm(0,1,m),'赤い花の本数は青い花の本数の'+m+'倍である。'),T(C.lt(2,0),'黄色い花は赤い花より少ない。')],
  q1:'赤、青、黄の3色の花が合わせて'+T0+'本ある。どの色の花も1本以上ある。',qa:'黄色い花は何本か。'};}});
add(S6.applied,'g-sui6-a2',{gen:function(R){var X=NM(R,6),N=LT.slice(0,6);
 return {dom:{t:'perm',n:6,m:6},N:N,sl:['1','2','3','4','5','6'],q:['opp',X[4],'c6'],mode:'one',opts:OPT(N.filter(function(_,i){return i!==X[4];}).map(function(x){return N.indexOf(x);}),function(x){return N[x];}),
  C:[T(C.at(X[0],0),'',1),T(C.g('opp',X[0],X[1],'c6'),N[X[0]]+'と'+N[X[1]]+'は向かい合って座った。'),T(C.g('adj',X[2],X[0],'c6'),N[X[2]]+'は'+N[X[0]]+'の隣に座った。'),
   T(C.g('adj',X[3],X[1],'c6'),N[X[3]]+'は'+N[X[1]]+'の隣に座り、'+N[X[2]]+'と向かい合っていた。'),T(C.g('opp',X[3],X[2],'c6'),'',1)],
  q1:'円形のテーブルに6つの席が等間隔に並んでおり、P、Q、R、S、T、Uの6人が1人ずつ座った。',qa:N[X[4]]+'と向かい合って座ったのはだれか。'};}});
add(S6.applied,'g-sui6-a3',{gen:function(R){var X=NM(R,4),N=LT.slice(0,4),w=R.pick([1,2]);
 return {dom:{t:'league',n:4},N:N,q:['rec',X[3],4],mode:'one',opts:OPT(['3勝0敗','2勝1敗','1勝2敗','0勝3敗']).concat([UNK]),unit:'勝敗の組',
  C:[T(C.wins(X[0],w,4),N[X[0]]+'は'+w+'勝'+(3-w)+'敗だった。'),T(C.wins(X[1],0,4),N[X[1]]+'は全敗した。'),T(C.beat(X[2],X[0],4),N[X[2]]+'は'+N[X[0]]+'に勝った。'),T(C.beat(X[3],X[2],4),N[X[3]]+'は'+N[X[2]]+'に勝った。')],
  inw:'1チーム3試合。1試合で勝ちと負けが1つずつできる',q1:'P、Q、R、Sの4チームが野球の総当たり戦を行った。引き分けの試合はなかった。',qa:N[X[3]]+'の成績はどれか。'};}});
add(S6.applied,'g-sui6-a4',{gen:function(R){var A=R.pick([50,55,60,65,70]),d1=R.pick([4,6,8,10,12,14]),d2=R.pick([2,4,6,8]);if((d1-d2)%2)return null;var r=A-(d1-d2)/2;
 return {dom:{t:'tup',n:4,r:[[A+d1,A+d1],[A-d2,A-d2],[r-6,r+6],[r-6,r+6]],sum:4*A},N:['P','Q','R','S'],q:['val',2],mode:'one',opts:function(s){return NUMO(s[0],0,'点').map(function(o,i,a){return {s:(a[0].x+2*i)+'点',x:a[0].x+2*i};}).map(function(o){return o;});},
  unit:'点数の組',C:[T(C.eqd(0,0,0),'Pの点数は平均点より'+d1+'点高かった。'),T(C.eqd(1,1,0),'Qの点数は平均点より'+d2+'点低かった。'),T(C.eq(2,3),'RとSは同じ点数だった。')],
  inw:'平均からの差で書く<br>ア　P＝＋'+d1+'<br>イ　Q＝−'+d2+'<br>ウ　R＝S',cpre:'差の合計は0なので、R＋S＝'+(d2-d1)+'、R＝S＝'+(d2-d1)/2,
  q1:'P、Q、R、Sの4人がテストを受けた。4人の平均点は'+A+'点であった。',qa:'Rは何点だったか。'};}});
add(S6.applied,'g-sui6-a6',{gen:function(R){var S=R.int(8,14);
 return {dom:{t:'tup',n:3,lo:1,hi:S,sum:S},N:['X','Y','Z'],q:['val',0],mode:'all',ok:[2,5],opts:function(s){var lo=Math.max(1,Math.min.apply(null,s)-R.int(0,1));return OPT(rg(lo,lo+5));},unit:'数の組',
  C:[T(C.ws([1,1,1],S),'X＋Y＋Z＝'+S),T(C.lt(1,0),'XはYより大きい。'),T(C.lt(2,1),'YはZより大きい。')],
  q1:'1以上の整数X、Y、Zがある。',qa:'Xとしてありうる数はどれか。'};}});
add(S6.applied,'g-sui6-a7',{gen:function(R){var X=NM(R,4),N=LT.slice(0,4),k=R.int(0,3);
 return {dom:{t:'perm',n:4,m:4},N:N,sl:['1','2','3','4'],q:['val',X[3]],mode:'all',ok:[1,3],opts:OPT([0,1,2,3],function(x){return (x+1)+'番目';}),
  C:[T(C.lt(X[0],X[1]),N[X[0]]+'は'+N[X[1]]+'より先に到着した。'),T(C.eqd(X[3],X[2],1),N[X[2]]+'は'+N[X[3]]+'のすぐ前に到着した。'),T(C.nat(X[1],k),N[X[1]]+'は'+(k+1)+'番目ではなかった。')],
  q1:'P、Q、R、Sの4人が受付に1人ずつ到着した。',qa:N[X[3]]+'としてありうる到着順はどれか。'};}});
/* 町の人口（%の内訳）：数値だけ変える */
function PCT(R,o){for(;;){var a=R.pick(o.a),b=R.pick(o.b),c=o.c?R.pick(o.c):0;var r=o.mk(a,b,c);if(r)return r;}}
S6.applied.push({id:'g-sui6-a5',make:function(R){return PCT(R,{a:[20,30,40,60],b:[10,20,25,30,40,50],mk:function(m,u){var um=m*u/100,om=m-um,f=100-m;if(um!==Math.round(um))return null;
 var wf=f+R.pick([-10,10]),wom=om+R.pick([-5,5,10]),cu=um+R.pick([5,10]),fu=R.pick([10,15,20]);
 var st=[{s:u+'%',k:'um',x:um,t:'20歳未満の男性は、町の人口の'+um+'%である'},{k:'f',x:wf,t:'女性は、町の人口の'+wf+'%である'},{k:'u',x:cu,t:'20歳未満の人は、町の人口の'+cu+'%である'},{k:'om',x:wom,t:'20歳以上の男性は、町の人口の'+wom+'%である'},{k:'uf',x:fu,t:'20歳未満の女性は、町の人口の'+fu+'%である'}];
 if(wf<=0||wom<=0||wf===f||wom===om)return null;
 return {q:'ある町の人口のうち、'+m+'%が男性である。また、男性のうち'+u+'%が20歳未満である。次のうち、必ず正しいものはどれか。',c:st.map(function(s){return s.t;}),a:0,inwh:'内訳',
  inw:'町の人口 → 男性・女性 → 男性を20歳未満・20歳以上',fig:{rows:[[{n:'町の人口',r:'1',w:1}],[{n:'男性',r:String(m/100),w:m},{n:'女性',r:String(f/100),w:f}],[{n:'20歳未満',r:String(um/100),w:um,ask:1},{n:'20歳以上',r:String(om/100),w:om},{w:f}]]},
  calc:'20歳未満の男性＝'+m/100+' × '+u/100+'＝'+um/100+'（'+um+'%）<br>女性は'+f+'%、20歳以上の男性は'+om+'%<br>女性の年齢はわからないので、20歳未満の人・20歳未満の女性は決まらない',v:{m:m,u:u,st:st}};}});},
 verify:function(v){var pop=10000,men=pop*v.m/100,um=men*v.u/100,om=men-um,f=pop-men;var ok=v.st.filter(function(s){var pc=function(x){return x*100/pop;};
  if(s.k==='um')return pc(um)===s.x;if(s.k==='f')return pc(f)===s.x;if(s.k==='om')return pc(om)===s.x;return false;});return ok.map(function(s){return s.t;})[0];}});
/* 実践（実際の数値） */
add(S6.real,'g-sui6-r0',{gen:function(R){var X=NM(R,5),N=LT.slice(0,5),dd=R.pick([2,3]),k0=R.int(0,1),k=R.int(1,3);
 return {dom:{t:'perm',n:5,m:5},N:N,sl:['1位','2位','3位','4位','5位'],q:['who',k],mode:'all',ok:[2,3],opts:OPT(rg(0,4),function(x){return N[x];}),
  C:[T(C.eqd(X[1],X[0],dd),N[X[0]]+'は'+N[X[1]]+'より'+dd+'つ上の順位だった。'),T(C.eqd(X[2],X[3],1),N[X[2]]+'は'+N[X[3]]+'のすぐ下の順位だった。'),T(C.nat(X[4],k0),N[X[4]]+'は'+(k0+1)+'位ではなかった。')],
  q1:'P、Q、R、S、Tの5人が50m走をした。同着の者はいなかった。',qa:(k+1)+'位になった可能性がある人はだれか。'};}});
add(S6.real,'g-sui6-r1',{gen:function(R){var T0=R.int(13,20),m=R.pick([2,3]),e=R.pick([1,2]);
 return {dom:{t:'tup',n:4,lo:1,hi:T0,sum:T0,dis:1},N:['P','Q','R','S'],q:['val',3],mode:'one',opts:function(s){return NUMO(s[0],1,'本');},unit:'本数の組',
  C:[T(C.eqm(0,1,m),'Pの本数はQの本数の'+m+'倍だった。'),T(C.eqd(2,0,e),'Rの本数はPの本数より'+e+'本多かった。'),T(C.lt(2,3),'Sの本数はRの本数より多かった。')],
  q1:'P、Q、R、Sの4種類のジュースを、合わせて'+T0+'本買った。どの種類も1本以上買い、本数は4種類とも異なっていた。',qa:'Sは何本買ったか。'};}});
add(S6.real,'g-sui6-r2',{gen:function(R){var N0=R.int(8,15),c=[R.int(1,N0-2)],b=R.int(1,4),a=N0-c[0]-b;if(a<1)return null;var Y=100*c[0]+50*b+10*a;
 return {dom:{t:'tup',n:3,lo:1,hi:N0,sum:N0},N:['100円','50円','10円'],cols:['100円','50円','10円'],q:['val',1],mode:'one',opts:OPT([1,2,3,4,5],'枚'),unit:'枚数の組',
  C:[T(C.ws([100,50,10],Y),'',1)],inw:'10円＋50円＋100円＝'+N0+'（枚）<br>10 × 10円＋50 × 50円＋100 × 100円＝'+Y,
  q1:'ある箱に、10円玉、50円玉、100円玉が合わせて'+N0+'枚入っており、合計金額は'+Y+'円である。どの硬貨も1枚以上入っている。',qa:'50円玉は何枚入っているか。'};}});
add(S6.real,'g-sui6-r3',{gen:function(R){var X=NM(R,6),N=LT.slice(0,6),m=R.pick([1,2,3]),L=R.pick([0,1]),k=R.int(1,4);
 return {dom:{t:'perm',n:6,m:6},N:N,sl:['1','2','3','4','5','6'],q:['who',k],mode:'all',ok:[2,4],opts:OPT(rg(0,5),function(x){return N[x];}),
  C:[T(C.gap(X[0],X[1],m+1),N[X[0]]+'と'+N[X[1]]+'の間には'+m+'人が並んだ。'),T(C.at(X[2],L?5:0),N[X[2]]+'は'+(L?'右端':'左端')+'に並んだ。'),T(C.eqd(X[3],X[0],1),N[X[3]]+'は'+N[X[0]]+'のすぐ右に並んだ。'),T(C.lt(X[4],X[5]),N[X[4]]+'は'+N[X[5]]+'より左に並んだ。')],
  q1:'P、Q、R、S、T、Uの6人が横一列に並んだ。',qa:'左から'+(k+1)+'番目に並んだ可能性がある人はだれか。'};}});
add(S6.real,'g-sui6-r4',{gen:function(R){var X=NM(R,5),N=LT.slice(0,5);
 return {dom:{t:'league',n:5},N:N,q:['wins',X[4],5],mode:'one',opts:OPT([0,1,2,3],'勝').concat([UNK]),unit:'勝敗の組',
  C:[T(C.wins(X[0],4,5),N[X[0]]+'は全勝した。'),T(C.wins(X[1],3,5),N[X[1]]+'は3勝1敗だった。'),T(C.eqw(X[2],X[3],5),N[X[2]]+'と'+N[X[3]]+'の勝ち数は同じだった。'),T(C.beat(X[4],X[2],5),N[X[4]]+'は'+N[X[2]]+'に勝った。')],
  inw:'1チーム4試合。全部で10試合なので勝ちの合計は10',q1:'P、Q、R、S、Tの5チームがバレーボールの総当たり戦を行った。引き分けの試合はなかった。',qa:N[X[4]]+'は何勝したか。'};}});
add(S6.real,'g-sui6-r5',{gen:function(R){var A=R.pick([50,60,70]),a=R.pick([70,80,90]),b=R.pick([30,40,50]);if(a<=A||b>=A)return null;
 return {dom:{t:'tup',n:5,r:[[a,a],[b,b],[0,100],[0,100],[0,100]],st:10,sum:5*A,dis:1},N:['P','Q','R','S','T'],q:['val',4],mode:'all',ok:[2,5],maxs:40,
  opts:function(s){var lo=Math.max(0,Math.min.apply(null,s)-10*R.int(0,1));return OPT(rg(0,5).map(function(i){return lo+10*i;}).filter(function(x){return x<=100;}),'点');},unit:'点数の組',
  C:[T(C.at(0,a),'',1),T(C.lt(3,2),'',1),T(C.lt(4,3),'',1)],inw:'合計＝'+A+' × 5＝'+5*A+'<br>R＋S＋T＝'+5*A+' − '+a+' − '+b+'＝'+(5*A-a-b)+'<br>R ＞ S ＞ T、'+a+'点と'+b+'点は使えない',
  q2:function(){return 'P、Q、R、S、Tの5人がテストを受けた。点数はすべて10点刻み（0点〜100点）で、5人とも異なっていた。5人の平均点は'+A+'点であった。次のことがわかっている。<br>ア　Pは'+a+'点、Qは'+b+'点だった。<br>イ　RはSより高く、SはTより高かった。<br>Tの点数としてありうるものはどれか。当てはまるものをすべて選びなさい。';},q1:'',qa:''};}});
S6.real.push({id:'g-sui6-r6',make:function(R){return PCT(R,{a:[20,30,40,60],b:[20,30,40,50],c:[30,40,50,60],mk:function(s,f1,f2){var sf=s*f1/100,sm=s-sf,o=100-s,of=o*f2/100,om=o-of,F=sf+of,M=100-F;
 if(sf!==Math.round(sf)||of!==Math.round(of)||F>=50||f1===f2)return null;var tk=R.pick(['sm','om','m']),w=function(x){return x+R.pick([-6,-4,4,6]);};
 var fsr=sf/F*100,fsv=Math.ceil(fsr/10)*10+10;
 var st=[{k:'fge',t:'女性は、社員全体の半数以上である'},{k:'sm',x:tk==='sm'?sm:w(sm)},{k:'om',x:tk==='om'?om:w(om)},{k:'m',x:tk==='m'?M:w(M)},{k:'fs',x:fsv,t:'女性のうち、営業部の社員は'+fsv+'%以上である'}];
 st[1].t='営業部の男性は、社員全体の'+st[1].x+'%である';st[2].t='営業部以外の男性は、社員全体の'+st[2].x+'%である';st[3].t='男性は、社員全体の'+st[3].x+'%である';
 if(st.some(function(x){return x.x!=null&&x.x<=0;}))return null;var c=st.map(function(x){return x.t;});
 return {q:'ある会社の社員のうち、'+s+'%が営業部に所属している。また、営業部の社員のうち'+f1+'%が女性であり、営業部以外の社員のうち'+f2+'%が女性である。次のうち、必ず正しいものはどれか。',c:c,a:st.map(function(x){return x.k;}).indexOf(tk),inwh:'内訳',
  inw:'社員 → 営業部・営業部以外 → それぞれを女性・男性',fig:{rows:[[{n:'社員',r:'1',w:1}],[{n:'営業部',r:String(s/100),w:s},{n:'営業部以外',r:String(o/100),w:o}],[{n:'女性',r:String(sf/100),w:sf},{n:'男性',r:String(sm/100),w:sm},{n:'女性',r:String(of/100),w:of},{n:'男性',r:String(om/100),w:om}]]},
  calc:'営業部の女性＝'+s/100+' × '+f1/100+'＝'+sf/100+'、男性＝'+s/100+' − '+sf/100+'＝'+sm/100+'<br>営業部以外の女性＝'+o/100+' × '+f2/100+'＝'+of/100+'、男性＝'+om/100+'<br>女性＝'+F/100+'、男性＝'+M/100+'、営業部の女性は女性の '+sf/100+' ÷ '+F/100+' ≒ '+Math.round(fsr)+'%',v:{s:s,f1:f1,f2:f2,st:st}};}});},
 verify:function(v){var P=1000,S=P*v.s/100,sf=S*v.f1/100,of=(P-S)*v.f2/100,F=sf+of,pc=function(x){return x*100/P;};
  return v.st.filter(function(x){if(x.k==='fge')return F*2>=P;if(x.k==='sm')return pc(S-sf)===x.x;if(x.k==='om')return pc(P-S-of)===x.x;if(x.k==='m')return pc(P-F)===x.x;return sf*100>=x.x*F;}).map(function(x){return x.t;})[0];}});
add(S6.real,'g-sui6-r7',{gen:function(R){var T0=R.int(7,10),N=['赤玉','白玉','青玉'],st=[],XX=R.shuffle([0,1,2]),hi=XX[0],lo=XX[1];
 for(var i=0;i<3;i++){for(var k=1;k<=T0-2;k++){st.push({s:N[i]+'は'+k+'個以上である',f:C.ge(i,k).f,d:['rng',i,k,1e9]},{s:N[i]+'は'+k+'個以下である',f:C.le(i,k).f,d:['rng',i,-1e9,k]});
  for(var j=0;j<3;j++)if(j!==i)for(var m=1;m<=T0-2;m++){var I=C.imp(C.at(i,k),C.at(j,m)),I2=C.imp(C.at(i,k),C.le(j,m));st.push({s:N[i]+'が'+k+'個ならば、'+N[j]+'は'+m+'個である',f:I.f,d:I.d,pre:C.at(i,k).f},{s:N[i]+'が'+k+'個ならば、'+N[j]+'は'+m+'個以下である',f:I2.f,d:I2.d,pre:C.at(i,k).f});}}
  for(j=0;j<3;j++)if(j!==i)st.push({s:N[i]+'は'+N[j]+'より多い',f:C.lt(j,i).f,d:['lt',j,i]});}
 var dom={t:'tup',n:3,lo:1,hi:T0,sum:T0},C1=[T(C.lt(lo,hi),'',1)],sols=ENUM(dom).filter(function(p){return p[hi]>p[lo];});
 var base=ENUM(dom);st=R.shuffle(st.filter(function(s){if(base.every(s.f))return false;if(!s.pre)return true;var ps=sols.filter(s.pre);return ps.length>0&&ps.length<sols.length;})).slice(0,60);
 return {dom:dom,N:N,C:C1,mode:'mall',nst:7,ok:[3,5],st:st,unit:'個数の組',inw:'赤＋白＋青＝'+T0+'<br>'+N[hi][0]+' ＞ '+N[lo][0]+'、どれも1以上',
  q1:'',qa:'',q2:function(){return '袋の中に、赤玉、白玉、青玉が合わせて'+T0+'個入っている。どの色の玉も1個以上入っており、'+N[hi]+'は'+N[lo]+'より多い。次のうち、必ず正しいものはどれか。当てはまるものをすべて選びなさい。';}};}});
add(S6.real,'g-sui6-r8',{gen:function(R){var X=NM(R,6),N=LT.slice(0,6),rr=R.pick([3,4,5]),tf=R.pick([1,2]),G='a23';
 return {dom:{t:'perm',n:6,m:6},N:N,sl:GEO.a23.lab,q:['val',X[5]],mode:'all',ok:[2,3],opts:OPT(rg(0,5),function(x){return GEO.a23.lab[x]+'号室';}),
  C:[T(C.g('above',X[1],X[0],G),N[X[0]]+'の部屋の真上は'+N[X[1]]+'の部屋である。'),T(C.at(X[2],rr),N[X[2]]+'は'+GEO.a23.lab[rr]+'号室に住んでいる。'),
   T({f:function(p){return GEO.a23.adj(p[X[3]],p[X[0]]);},d:['g','adj',X[3],X[0],G]},N[X[3]]+'は'+N[X[0]]+'と同じ階で、隣の部屋に住んでいる。'),T(C.fl(X[4],tf,G),N[X[4]]+'は'+tf+'階に住んでいる。')],
  q1:'2階建てのアパートがあり、1階は左から101、102、103号室、2階は左から201、202、203号室で、201号室は101号室の真上にある。P、Q、R、S、T、Uの6人が1部屋に1人ずつ住んでいる。',qa:N[X[5]]+'の部屋としてありうるものはどれか。'};}});
add(S6.real,'g-sui6-r9',{gen:function(R){var a=R.int(1,3),b=R.int(1,3),par=R.pick([0,1]);
 return {dom:{t:'tup',n:5,lo:1,hi:5,dis:1,sum:15},N:['P','Q','R','S','T'],q:['val',0],mode:'all',ok:[2,3],opts:OPT([1,2,3,4,5],'枚'),unit:'枚数の組',
  C:[T(C.eqd(0,1,a),'PはQより'+a+'枚多く食べた。'),T(C.eqd(2,3,b),'RはSより'+b+'枚多く食べた。'),T(C.par(4,par),'Tが食べた枚数は'+(par?'奇数':'偶数')+'だった。')],
  q1:'P、Q、R、S、Tの5人が、クッキーを合わせて15枚食べた。全員が1枚以上食べ、食べた枚数は5人とも異なっていた。',qa:'Pが食べた枚数としてありうるものはどれか。'};}});

/* ======================= 指標7 ======================= */
var RK=function(n){return rg(1,n).map(function(i){return i+'位';});},BN=function(n){return rg(1,n).map(function(i){return i+'番目';});};
add(S7.concept,'g-sui7-c0',{gen:function(R){var X=NM(R,5),N=LT.slice(0,5),k=R.int(0,4);
 return {dom:{t:'perm',n:5,m:5},N:N,sl:RK(5),mk:MK7,q:['val',X[0]],mode:'all',ok:[2,3],opts:OPT(rg(0,4),function(x){return (x+1)+'位';}),
  C:[T(C.lt(X[0],X[1]),N[X[0]]+'は'+N[X[1]]+'より先にゴールした。'),T(C.eqd(X[2],X[3],1),N[X[2]]+'は'+N[X[3]]+'のすぐ後にゴールした。'),T(C.at(X[4],k),N[X[4]]+'は'+(k+1)+'位だった。')],
  q1:'P、Q、R、S、Tの5人が100m走をした。同着の人はいなかった。順位について、',qa:N[X[0]]+'の順位として考えられるものはどれか。'};}});
add(S7.concept,'g-sui7-c1',{gen:function(R){var T0=R.int(8,14),d=R.int(1,3);
 return {dom:{t:'tup',n:3,lo:1,hi:T0,sum:T0},N:['X','Y','Z'],mk:MK7,q:['val',0],mode:'all',ok:[1,3],opts:function(s){var lo=Math.max(2,Math.min.apply(null,s)-R.int(1,3));return OPT(rg(lo,lo+5),'個');},unit:'個数の組',
  C:[T(C.lt(1,0),'Xに入れた個数は、YとZのどちらよりも多い。'),T(C.lt(2,0),'',1),T(C.eqd(1,2,d),'Yに入れた個数は、Zより'+d+'個多い。')],
  q1:'X、Y、Zの3つの箱に、玉を合わせて'+T0+'個入れた。どの箱にも1個以上入れた。入れた個数について、',qa:'Xに入れた個数として考えられるものはどれか。'};}});
add(S7.concept,'g-sui7-c2',{gen:function(R){var X=NM(R,4),N=LT.slice(0,4);
 return {dom:{t:'league',n:4},N:N,mk:MK7,q:['wins',X[1],4],mode:'all',ok:[2,3],opts:OPT([0,1,2,3],'勝'),unit:'勝敗の組',
  C:[T(C.wins(X[0],2,4),N[X[0]]+'は2勝1敗だった。'),T(C.beat(X[3],X[0],4),N[X[3]]+'は'+N[X[0]]+'に勝った。'),T(C.wins(X[2],0,4),N[X[2]]+'は1試合も勝てなかった。')],
  inw:'全6試合',q1:'P、Q、R、Sの4チームが、総当たりのリーグ戦を行った。引き分けはなかった。結果について、',qa:N[X[1]]+'の勝ち数として考えられるものはどれか。'};}});
add(S7.practice,'g-sui7-p0',{gen:function(R){var X=NM(R,6),N=LT.slice(0,6),m=R.pick([1,2,3]),k=R.int(0,5);
 return {dom:{t:'perm',n:6,m:6},N:N,sl:RK(6),mk:MK7,q:['val',X[1]],mode:'all',ok:[2,4],opts:OPT(rg(0,5),function(x){return (x+1)+'位';}),
  C:[T(C.gap(X[0],X[1],m+1),N[X[0]]+'と'+N[X[1]]+'の間には'+m+'人がゴールした。'),T(C.lt(X[2],X[0]),N[X[2]]+'は'+N[X[0]]+'より先にゴールした。'),T(C.at(X[3],k),N[X[3]]+'は'+(k+1)+'位だった。'),T(C.lt(X[4],X[5]),N[X[4]]+'は'+N[X[5]]+'より先にゴールした。')],
  q1:'P、Q、R、S、T、Uの6人がマラソンをした。同着の人はいなかった。順位について、',qa:N[X[1]]+'の順位として考えられるものはどれか。'};}});
add(S7.practice,'g-sui7-p1',{gen:function(R){var X=NM(R,6),N=LT.slice(0,6);
 return {dom:{t:'perm',n:6,m:6},N:N,sl:['1','2','3','4','5','6'],mk:MK7,q:['opp',X[5],'c6'],mode:'all',ok:[1,2],opts:OPT(X.slice(0,5).slice().sort(),function(x){return N[x];}),
  C:[T(C.at(X[0],0),'',1),T(C.g('opp',X[0],X[1],'c6'),N[X[0]]+'と'+N[X[1]]+'は向かい合って座った。'),T(C.g('adj',X[2],X[0],'c6'),N[X[2]]+'は'+N[X[0]]+'の隣に座った。'),T(C.ng('adj',X[3],X[1],'c6'),N[X[3]]+'は'+N[X[1]]+'の隣に座らなかった。'),T(C.ng('adj',X[4],X[2],'c6'),N[X[4]]+'は'+N[X[2]]+'の隣に座らなかった。')],
  cpre:N[X[0]]+'の席を1に固定する',q1:'P、Q、R、S、T、Uの6人が、円形のテーブルに等間隔で座った。座り方について、',qa:N[X[5]]+'の向かいに座った人として考えられるものはどれか。'};}});
add(S7.practice,'g-sui7-p2',{gen:function(R){var S=R.int(12,20),m=R.pick([2,3]),par=1;
 return {dom:{t:'tup',n:3,lo:1,hi:9,dis:1,sum:S},N:['X','Y','Z'],mk:MK7,q:['val',2],mode:'all',ok:[1,3],opts:OPT([1,3,5,7,9]),unit:'数の組',
  C:[T(C.ws([1,1,1],S),'3人のカードの数の和は'+S+'だった。'),T(C.eqm(0,1,m),'Xのカードの数は、Yのカードの数の'+m+'倍だった。'),T(C.par(2,1),'Zのカードの数は奇数で、Yのカードの数より大きかった。'),T(C.lt(1,2),'',1)],
  q1:'1から9までの数字が1つずつ書かれた9枚のカードがある。X、Y、Zの3人がこの中から1枚ずつ引いた。引いたカードについて、',qa:'Zのカードの数として考えられるものはどれか。'};}});
add(S7.practice,'g-sui7-p3',{gen:function(R){var A=R.pick([50,60,70]),d=R.pick([10,20]),e=R.pick([20,30]),L=R.pick([30,40,50]),P=A+d,Q=P-e;if(Q<0||P>100)return null;
 return {dom:{t:'tup',n:4,r:[[P,P],[Q,Q],[0,100],[0,100]],st:10,sum:4*A},N:['P','Q','R','S'],mk:MK7,q:['val',2],mode:'all',ok:[2,3],opts:function(s){var lo=Math.max(0,Math.min.apply(null,s)-10*R.int(0,2));return OPT(rg(0,5).map(function(i){return lo+10*i;}).filter(function(x){return x<=100;}),'点');},unit:'点数の組',
  C:[T(C.at(0,P),'Pの点数は、平均点より'+d+'点高かった。'),T(C.at(1,Q),'Qの点数は、Pより'+e+'点低かった。'),T(C.lt(3,2),'Rの点数は、Sより高かった。'),T(C.ge(3,L),'Sの点数は'+L+'点以上だった。')],
  q1:'P、Q、R、Sの4人が100点満点のテストを受けた。4人の点数はすべて10の倍数で、4人の平均点は'+A+'点だった。点数について、',qa:'Rの点数として考えられるものはどれか。'};}});
add(S7.practice,'g-sui7-p4',{gen:function(R){var X=NM(R,5),N=LT.slice(0,5);
 return {dom:{t:'league',n:5},N:N,mk:MK7,q:['wins',X[4],5],mode:'all',ok:[1,2],opts:OPT([0,1,2,3,4],'勝'),unit:'勝敗の組',
  C:[T(C.wins(X[0],4,5),N[X[0]]+'は全勝した。'),T(C.wins(X[1],3,5),N[X[1]]+'は3勝1敗だった。'),T(C.eqw(X[2],X[3],5),N[X[2]]+'と'+N[X[3]]+'の勝ち数は同じだった。'),T(C.beat(X[2],X[3],5),N[X[2]]+'は'+N[X[3]]+'に勝った。')],
  inw:'全10試合 → 勝ち数の合計は10',q1:'P、Q、R、S、Tの5チームが、総当たりのリーグ戦を行った。引き分けはなかった。結果について、',qa:N[X[4]]+'の勝ち数として考えられるものはどれか。'};}});
add(S7.practice,'g-sui7-p5',{gen:function(R){var T0=R.int(9,12),s=R.pick([2,3]);
 return {dom:{t:'tup',n:4,lo:1,hi:T0,sum:T0},N:['P','Q','R','S'],mk:MK7,q:['val',0],mode:'all',ok:[2,4],opts:function(x){var lo=Math.max(2,Math.min.apply(null,x)-R.int(0,1));return OPT(rg(lo,lo+4),'個');},unit:'個数の組',
  C:[T(C.mx(0),'Pが受け取った個数は、ほかの3人のだれよりも多い。'),T(C.eq(1,2),'QとRが受け取った個数は同じだった。'),T(C.ge(3,s),'Sは'+s+'個以上受け取った。')],
  q1:'P、Q、R、Sの4人で、みかん'+T0+'個を分けた。どの人も1個以上受け取った。受け取った個数について、',qa:'Pが受け取った個数として考えられるものはどれか。'};}});
add(S7.applied,'g-sui7-a0',{gen:function(R){var X=NM(R,6),N=LT.slice(0,6),m=R.pick([1,2]),k=R.int(0,5);
 return {dom:{t:'perm',n:6,m:6},N:N,sl:RK(6),mk:MK7,q:['val',X[3]],mode:'all',ok:[2,3],opts:OPT(rg(0,5),function(x){return (x+1)+'位';}),
  C:[T(C.eqd(X[1],X[0],1),N[X[1]]+'は'+N[X[0]]+'のすぐ後にゴールした。'),T(C.gap(X[2],X[3],m+1),N[X[2]]+'と'+N[X[3]]+'の間には'+m+'人がゴールした。'),T(C.at(X[4],k),N[X[4]]+'は'+(k+1)+'位だった。'),T(C.lt(X[2],X[5]),N[X[5]]+'は'+N[X[2]]+'より後にゴールした。')],
  q1:'P、Q、R、S、T、Uの6人が水泳の競技をした。同着の人はいなかった。順位について、',qa:N[X[3]]+'の順位として考えられるものはどれか。'};}});
add(S7.applied,'g-sui7-a1',{gen:function(R){var X=NM(R,6),N=LT.slice(0,6),tf=R.pick([1,2,3]),uf=R.pick([1,2,3]),G='a32';
 return {dom:{t:'perm',n:6,m:6},N:N,sl:GEO.a32.lab,mk:MK7,q:['val',X[5]],mode:'all',ok:[2,3],opts:OPT(rg(0,5),function(x){return GEO.a32.lab[x];}),
  C:[T(C.g('above',X[0],X[1],G),N[X[0]]+'は'+N[X[1]]+'の真上の部屋に住んでいる。'),T(C.sfl(X[2],X[3],G),N[X[2]]+'と'+N[X[3]]+'は同じ階に住んでいる。'),T(C.fl(X[4],tf,G),N[X[4]]+'は'+tf+'階に住んでいる。'),T(C.nfl(X[5],uf,G),N[X[5]]+'は'+uf+'階には住んでいない。')],
  q1:'3階建てのアパートがあり、各階に2部屋ずつ、101・102・201・202・301・302の6部屋がある。102は101の右隣、202は201の真上である。この6部屋に、P、Q、R、S、T、Uの6人が1人ずつ住んでいる。住んでいる部屋について、',qa:N[X[5]]+'が住んでいる部屋として考えられるものはどれか。'};}});
add(S7.applied,'g-sui7-a2',{gen:function(R){var X=NM(R,4),N=LT.slice(0,4),pp=R.pick([5,6,7]);
 return {dom:{t:'league',n:4,dr:1},N:N,mk:MK7,q:['pts',X[3],4],mode:'all',ok:[2,5],opts:OPT(rg(0,7),'点'),unit:'結果の組',maxs:60,
  C:[T(C.pts(X[0],pp,4),N[X[0]]+'の勝ち点は'+pp+'点だった。'),T(C.nodr(X[1],4),N[X[1]]+'は引き分けの試合がなかった。'),T(C.beat(X[1],X[2],4),N[X[1]]+'は'+N[X[2]]+'に勝った。'),T(C.draw(X[2],X[3],4),N[X[2]]+'と'+N[X[3]]+'の試合は引き分けだった。')],
  inw:'勝ち3点・引き分け1点・負け0点',q1:'P、Q、R、Sの4チームが、総当たりのリーグ戦を行った。勝ちは3点、引き分けは1点、負けは0点の勝ち点が与えられる。結果について、',qa:N[X[3]]+'の勝ち点として考えられるものはどれか。'};}});
add(S7.applied,'g-sui7-a3',{gen:function(R){var a=R.pick([8,9,10,11,12]),b=R.pick([6,8,12,18,24]),c=R.pick([3,4,5,6]);
 return {dom:{t:'tup',n:6,lo:1,hi:9,dis:1},N:['X','X','Y','Y','Z','Z'],cols:['X','X','Y','Y','Z','Z'],mk:MK7,q:['psum',4,5],mode:'all',ok:[2,5],maxs:200,
  opts:function(s){var lo=Math.max(2,Math.min.apply(null,s)-R.int(0,1));return OPT(rg(lo,lo+7));},unit:'カードの組',
  C:[T(C.lt(0,1),'',1),T(C.lt(2,3),'',1),T(C.lt(4,5),'',1),T(C.psum(0,1,a),'Xの2枚の数の和は'+a+'だった。'),T(C.pprod(2,3,b),'Yの2枚の数の積は'+b+'だった。'),T(C.eqd(5,4,c),'Zの2枚の数の差は'+c+'だった。')],
  inw:'Xの和＝'+a+'、Yの積＝'+b+'、Zの差＝'+c+'、同じカードはない',
  q1:'1から9までの数字が1つずつ書かれた9枚のカードがある。X、Y、Zの3人がこの中から2枚ずつ引いた。引いたカードについて、',qa:'Zの2枚の数の和として考えられるものはどれか。'};}});
add(S7.applied,'g-sui7-a4',{gen:function(R){var A=R.pick([60,65,70,75]),a=A+R.pick([5,10,15]),e=R.pick([10,15,20]),f=R.pick([5,10,15]),Q=a-e;if(Q<A-20)return null;
 return {dom:{t:'tup',n:5,r:[[a,a],[Q,Q],[A-20,A+20],[A-20,A+20],[A-20,A+20]],st:5,sum:5*A},N:['P','Q','R','S','T'],mk:MK7,q:['val',2],mode:'all',ok:[2,3],opts:OPT(rg(0,5).map(function(i){return A+5*i;}),'点'),unit:'点数の組',
  C:[T(C.at(0,a),'Pの点数は'+a+'点だった。'),T(C.at(1,Q),'Qの点数は、Pより'+e+'点低かった。'),T(C.ge(2,A+1),'Rの点数は、平均点より高かった。'),T(C.eqd(3,4,f),'Sの点数は、Tより'+f+'点高かった。'),T(C.lt(4,1),'Tの点数は、Qより低かった。'),T(C.ge(0,0),'5人の点数は、すべて平均点との差が20点以内だった。')],
  q1:'P、Q、R、S、Tの5人が100点満点のテストを受けた。5人の点数はすべて5の倍数で、5人の平均点は'+A+'点だった。点数について、',qa:'Rの点数として考えられるものはどれか。'};}});
add(S7.applied,'g-sui7-a5',{gen:function(R){var N0=R.pick([60,70,80]),lo=N0/2-R.pick([5,10]),hi=N0-lo,px=R.pick([20,40,60]),py=R.pick([20,40,60,80]);if(px===py)return null;
 return {dom:{t:'tup',n:2,lo:lo,hi:hi,sum:N0},N:['X','Y'],cols:['Xクラス','Yクラス'],q:['lin',[px,py],100],mode:'all',ok:[2,4],opts:function(s){var m=Math.min.apply(null,s)-R.int(0,2);return OPT(rg(m,m+5),'人');},unit:'人数の組',
  C:[T(C.imod(0,px,100),'',1),T(C.imod(1,py,100),'',1)],inw:'X＋Y＝'+N0+'、'+lo+'≦X≦'+hi+'、X×'+px/100+'とY×'+py/100+'が整数',
  q2:function(){return 'ある学年はXクラスとYクラスの2クラスで、生徒は合わせて'+N0+'人である。どちらのクラスも'+lo+'人以上'+hi+'人以下である。Xクラスの生徒のうち'+px+'%が男子、Yクラスの生徒のうち'+py+'%が男子である。この学年の男子の人数として考えられるものはどれか。当てはまるものをすべて選びなさい。';},q1:'',qa:''};}});
add(S7.applied,'g-sui7-a6',{gen:function(R){var B=R.shuffle(['から揚げ弁当','焼き魚弁当','ハンバーグ弁当']),s1=0,s2=R.pick([2,3,4]),t2=R.pick([1,2]),k=R.pick([1,2,3,4,5].filter(function(x){return x!==s2;}));
 return {dom:{t:'tup',n:6,lo:0,hi:2},N:['1','2','3','4','5','6'],cols:['1','2','3','4','5','6'],vf:function(x){return B[x];},mk:MK7,q:['val',k],mode:'all',ok:[1,2],opts:OPT([0,1,2],function(x){return B[x];}),unit:'並び方',
  C:[T(C.cnt(0,2),'',1),T(C.cnt(1,2),'',1),T(C.cnt(2,2),'',1),T(C.difadj(),'隣り合って座った人は、違う種類の弁当を食べた。'),T(C.at(s1,0),'左から1番目の人は、'+B[0]+'を食べた。'),T(C.at(s2,t2),'左から'+(s2+1)+'番目の人は、'+B[t2]+'を食べた。')],
  inw:'各2個。隣どうしは違う。1番目＝'+B[0].replace('弁当','')+'、'+(s2+1)+'番目＝'+B[t2].replace('弁当',''),
  q1:'6人が横一列に並んで座り、'+B.join('、').replace(/、([^、]*)$/,'、$1')+'を2個ずつ食べた。弁当について、',qa:'左から'+(k+1)+'番目の人が食べた弁当として考えられるものはどれか。'};}});
add(S7.applied,'g-sui7-a7',{gen:function(R){var X=NM(R,5),N=LT.slice(0,5),dd=R.pick([2,3]),k0=0,st=[];
 N.forEach(function(x,i){rg(0,4).forEach(function(k){st.push({s:x+'は'+(k+1)+'番目だった',f:C.at(i,k).f,d:['at',i,k]});});});
 return {dom:{t:'perm',n:5,m:5},N:N,sl:BN(5),mk:MK7,mode:'must',st:st,
  C:[T(C.lt(X[0],X[1]),N[X[0]]+'は'+N[X[1]]+'より先に面接を受けた。'),T(C.eqd(X[2],X[0],dd),N[X[2]]+'は、'+N[X[0]]+'の'+dd+'人後に面接を受けた。'),T(C.nat(X[3],k0),N[X[3]]+'は1番目ではなかった。'),T(C.lt(X[3],X[4]),N[X[4]]+'は'+N[X[3]]+'より後に面接を受けた。')],
  q1:'P、Q、R、S、Tの5人が、1人ずつ順番に面接を受けた。面接の順番について、',qa:'次のうち、必ず正しいといえるものはどれか。'};}});
add(S7.real,'g-sui7-r0',{gen:function(R){var X=NM(R,7),N=LT.slice(0,7),m=R.pick([2,3,4]),lo=R.int(1,3);
 return {dom:{t:'perm',n:7,m:7},N:N,sl:BN(7),mk:MK7,q:['val',X[6]],mode:'all',ok:[2,4],opts:OPT(rg(0,6),function(x){return (x+1)+'番目';}),maxs:60,
  C:[T(C.gap(X[0],X[1],m+1),N[X[0]]+'と'+N[X[1]]+'の間には'+m+'人が走った。'),T(C.eqd(X[2],X[3],1),N[X[2]]+'は'+N[X[3]]+'のすぐ後に走った。'),T(C.lt(X[4],X[0]),N[X[4]]+'は'+N[X[0]]+'より先に走った。'),T(C.rng(X[5],lo,lo+2),N[X[5]]+'は'+(lo+1)+'番目から'+(lo+3)+'番目のいずれかに走った。'),
   T(C.nat(X[6],6),N[X[6]]+'は最後ではなく、'+N[X[2]]+'より後に走った。'),T(C.lt(X[2],X[6]),'',1)],
  q1:'P、Q、R、S、T、U、Vの7人が、リレーで1人1回ずつ走った。走った順番について、',qa:N[X[6]]+'が走った順番として考えられるものはどれか。'};}});
add(S7.real,'g-sui7-r1',{gen:function(R){var H=R.int(158,172),a=R.pick([2,4,6]),b=R.pick([4,6,8]),c=R.pick([4,6,8]),Q=H+a,P=Q+b;
 return {dom:{t:'tup',n:5,r:[[P,P],[Q,Q],[H-20,H+20],[H,Q-1],[H-30,H+20]],sum:5*H},N:['P','Q','R','S','T'],mk:MK7,q:['val',4],mode:'all',ok:[2,3],maxs:40,opts:function(s){var lo=Math.min.apply(null,s)-R.int(0,3);return OPT(rg(lo,lo+7),'cm');},unit:'身長の組',
  C:[T(C.at(1,Q),'Qは平均より'+a+'cm高かった。'),T(C.at(0,P),'PはQより'+b+'cm高かった。'),T(C.eqd(4,2,-c),'TはRより'+c+'cm低かった。'),T(C.ge(3,H),'Sは平均以上で、Qより低かった。')],
  q1:'P、Q、R、S、Tの5人の身長を測った。身長はすべてcm単位の整数で、5人の平均は'+H+'cmだった。身長について、',qa:'Tの身長として考えられるものはどれか。'};}});
add(S7.real,'g-sui7-r2',{gen:function(R){var X=NM(R,6),N=LT.slice(0,6),G='tb';
 return {dom:{t:'perm',n:6,m:6},N:N,sl:['北1','北2','北3','南1','南2','南3'],mk:MK7,q:['opp',X[3],'tb'],mode:'all',ok:[2,4],opts:OPT(X.filter(function(x){return x!==X[3];}).slice().sort(),function(x){return N[x];}),maxs:60,
  C:[T(C.g('opp',X[0],X[1],G),N[X[0]]+'と'+N[X[1]]+'は向かい合って座った。'),T(C.g('adj',X[2],X[0],G),N[X[2]]+'は'+N[X[0]]+'の隣に座った。'),T(C.end(X[3],G),N[X[3]]+'は端の席に座り、'+N[X[2]]+'とは反対側の列に座った。'),T(C.drow(X[3],X[2],G),'',1),T(C.ng('adj',X[4],X[3],G),N[X[4]]+'は'+N[X[3]]+'の隣に座らなかった。')],
  q1:'テーブルをはさんで、北側に3席、南側に3席が向かい合って並んでいる。この6席に、P、Q、R、S、T、Uの6人が1人ずつ座った。座り方について、',qa:N[X[3]]+'の向かいに座った人として考えられるものはどれか。'};}});
add(S7.real,'g-sui7-r3',{gen:function(R){var X=NM(R,5),N=LT.slice(0,5);
 return {dom:{t:'league',n:5,dr:1},N:N,mk:MK7,q:['pts',X[4],5],mode:'one',opts:OPT([3,4,5,6,7],'点'),unit:'結果の組',maxs:200,
  C:[T(C.pts(X[0],10,5),N[X[0]]+'の勝ち点は10点、'+N[X[1]]+'の勝ち点は8点だった。'),T(C.pts(X[1],8,5),'',1),T(C.draw(X[0],X[1],5),N[X[0]]+'と'+N[X[1]]+'の試合は引き分けだった。'),
   T(C.nodrw([X[2],X[3],X[4]],5),N[X[2]]+'、'+N[X[3]]+'、'+N[X[4]]+'の3チームどうしの試合に、引き分けはなかった。'),T(C.eqp(X[2],X[3],5),N[X[2]]+'と'+N[X[3]]+'の勝ち点は同じだった。'),T(C.ptge(X[4],3,5),N[X[4]]+'の勝ち点は3点以上だった。')],
  inw:'勝ち3点・引き分け1点・負け0点',q1:'P、Q、R、S、Tの5チームが、総当たりのリーグ戦を行った。勝ちは3点、引き分けは1点、負けは0点の勝ち点が与えられる。結果について、',qa:N[X[4]]+'の勝ち点は何点か。'};}});
add(S7.real,'g-sui7-r4',{gen:function(R){var pa=R.pick([120,150,180]),pb=R.pick([40,50,60]),pc=R.pick([70,80,90]),N0=R.int(10,15),Y=R.int(Math.ceil(N0*pb/100),Math.floor(N0*pa/10))*10;
 return {dom:{t:'tup',n:3,lo:1,hi:N0,sum:N0},N:['りんご','みかん','かき'],mk:MK7,q:['val',0],mode:'all',ok:[2,4],opts:function(s){var lo=Math.max(1,Math.min.apply(null,s)-R.int(0,2));return OPT(rg(lo,lo+7),'個');},unit:'個数の組',
  C:[T(C.ws([pa,pb,pc],Y),'',1)],inw:'りんご＋みかん＋かき＝'+N0+'、'+pa+'×りんご＋'+pb+'×みかん＋'+pc+'×かき＝'+Y,
  q2:function(){return 'ある店で、1個'+pa+'円のりんご、1個'+pb+'円のみかん、1個'+pc+'円のかきを、合わせて'+N0+'個買ったところ、代金の合計は'+Y.toLocaleString('en-US')+'円だった。どの果物も1個以上買った。りんごを買った個数として考えられるものはどれか。当てはまるものをすべて選びなさい。';},q1:'',qa:''};}});
add(S7.real,'g-sui7-r5',{gen:function(R){var lo=R.pick([100,150,200]),hi=lo+R.pick([200,250]),L=R.pick([30,40,50,60]);
 return {dom:{t:'tup',n:1,lo:lo,hi:hi,st:10},N:['社員'],cols:['社員数'],q:['val',0],mode:'all',ok:[2,4],opts:function(s){var a=[];for(var x=Math.ceil(lo/40)*40;x<=hi&&a.length<7;x+=40)a.push(x);return a.length>=s.length+1?OPT(a,'人'):null;},unit:'社員数',
  C:[T(C.imod(0,45*1,300),'',1),T(C.imod(0,55*25,10000),'',1),T(C.mle(0,55*25,10000,L),'',1)],inw:'男性・電車＝社員×0.15、女性・電車＝社員×0.1375、人数はすべて整数',
  q2:function(){return 'ある会社の社員数は'+lo+'人以上'+hi+'人以下である。社員のうち45%が男性で、男性のうち3分の1が電車で通勤している。また、女性のうち25%が電車で通勤しており、電車で通勤している女性は'+L+'人以下である。この会社の社員数として考えられるものはどれか。当てはまるものをすべて選びなさい。';},q1:'',qa:''};}});
add(S7.real,'g-sui7-r6',{gen:function(R){var X=NM(R,5),N=LT.slice(0,5),K=R.shuffle(['受付','案内','会計']),st=[];
 N.forEach(function(x,i){K.forEach(function(g,j){st.push({s:x+'は'+g+'に入った',f:C.at(i,j).f,d:['at',i,j]});});});
 K.forEach(function(g,j){st.push({s:g+'に入ったのは2人以上だった',f:C.cge(j,2).f,d:['cge',j,2]},{s:g+'に入ったのは2人だった',f:C.cnt(j,2).f,d:['cnt',j,2]});});
 return {dom:{t:'tup',n:5,lo:0,hi:2},N:N,cols:N,vf:function(x){return K[x];},mk:MK7,mode:'must',st:st,unit:'分け方',
  C:[T(C.allv(3),'',1),T(C.eq(X[0],X[1]),N[X[0]]+'と'+N[X[1]]+'は同じ係に入った。'),T(C.ne(X[2],X[0]),N[X[2]]+'は'+N[X[0]]+'と違う係に入った。'),T(C.cnt(0,1),K[0]+'に入ったのは1人だけだった。'),T(C.at(X[3],1),N[X[3]]+'は'+K[1]+'に入った。'),T(C.nat(X[4],2),N[X[4]]+'は'+K[2]+'に入らなかった。')],
  q1:'P、Q、R、S、Tの5人が、'+K.join('、')+'の3つの係に分かれた。どの係にも1人以上が入った。係について、',qa:'次のうち、必ず正しいといえるものはどれか。'};}});
add(S7.real,'g-sui7-r7',{gen:function(R){var X=NM(R,6),N=LT.slice(0,6),k=R.int(0,5);
 return {dom:{t:'perm',n:6,m:6},N:N,sl:RK(6),mk:MK7,q:['val',X[1]],mode:'all',ok:[2,3],opts:OPT(rg(0,5),function(x){return (x+1)+'位';}),
  C:[T(C.gap(X[0],X[1],2),N[X[0]]+'と'+N[X[1]]+'の間には1人がゴールした。'),T(C.eqd(X[2],X[3],1),N[X[2]]+'は'+N[X[3]]+'のすぐ後にゴールした。'),T(C.at(X[4],k),N[X[4]]+'は'+(k+1)+'位だった。'),T(C.lt(X[5],X[0]),N[X[5]]+'は'+N[X[0]]+'より先にゴールした。'),T(C.nat(X[1],5),N[X[1]]+'は最下位ではなかった。')],
  q1:'P、Q、R、S、T、Uの6人が、マラソン大会に出場した。同着の人はいなかった。順位について、',qa:N[X[1]]+'の順位として考えられるものはどれか。'};}});
add(S7.real,'g-sui7-r8',{gen:function(R){var X=NM(R,6),N=LT.slice(0,6),G='c6',st=[];
 N.forEach(function(x,i){N.forEach(function(y,j){if(i<j){st.push({s:x+'は'+y+'の隣に座った',f:C.g('adj',i,j,G).f,d:['g','adj',i,j,G]},{s:x+'と'+y+'は隣り合わなかった',f:C.ng('adj',i,j,G).f,d:['ng','adj',i,j,G]},{s:x+'と'+y+'は向かい合って座った',f:C.g('opp',i,j,G).f,d:['g','opp',i,j,G]});}});});
 return {dom:{t:'perm',n:6,m:6},N:N,sl:['1','2','3','4','5','6'],mk:MK7,mode:'must',st:st,
  C:[T(C.at(X[0],0),'',1),T(C.g('adj',X[0],X[1],G),N[X[0]]+'と'+N[X[1]]+'は隣り合って座った。'),T(C.g('opp',X[2],X[1],G),N[X[2]]+'は'+N[X[1]]+'の向かいに座った。'),T(C.ng('adj',X[3],X[0],G),N[X[3]]+'は'+N[X[0]]+'の隣に座らなかった。'),T(C.g('adj',X[4],X[2],G),N[X[4]]+'は'+N[X[2]]+'の隣に座った。')],
  cpre:N[X[0]]+'の席を1に固定する',q1:'P、Q、R、S、T、Uの6人が、円形のテーブルに等間隔で座った。座り方について、',qa:'次のうち、必ず正しいといえるものはどれか。'};}});
add(S7.real,'g-sui7-r9',{gen:function(R){var M=R.pick([24,36,48,60,72,90]),L=R.int(10,16);
 return {dom:{t:'tup',n:3,lo:1,hi:M},N:['P','Q','R'],mk:MK7,q:['val',1],mode:'one',opts:function(s){return NUMO(s[0],1,'歳');},unit:'年齢の組',
  C:[T(C.lt(1,0),'',1),T(C.lt(2,1),'',1),T(C.prod(M),'3人の年齢をかけ合わせると'+M+'になる。'),T(C.sle(L),'3人の年齢の和は'+L+'以下である。'),T(C.ne(0,1),'同じ年齢の人はいない。')],
  q1:'P、Q、Rの3人きょうだいがいる。Pが最も年上で、Rが最も年下である。3人の年齢について、',qa:'Qの年齢は何歳か。'};}});
})();
