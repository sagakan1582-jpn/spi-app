/* 本番形式（組問）：集合・表の解釈・情報の読み取り・特殊算。担当B（2026-11-17）
   ・add(分野,指標,1問目のid,two)：割合と同じ形（共通の文章＝1問目の最後の一文の前まで）。
   ・tb(分野,指標,1問目のid,2問目の指標,two)：表が問いの直前にあるなど、最後の一文で切ると表が1問目に入ってしまう問題用。
     1問目の問題文を「表の終わりまで」で切り、そのあとに2問目の問いをつなぐ（共通の文章は setcore の book と同じく小問の共通部分）。
     two が r.keep を返すと、表と1問目の問いの間の条件文も2問目に入れる。r.full なら r.q をそのまま2問目の問題文にする。
   ・remake(分野,指標,id)：情報の読み取りのア・イ・ウ形式。同じ規則の文で、ア・イ・ウだけ違う2問目をテンプレートから作る。
   ・grp(分野,指標,番号,[小問])：問題集の本物の組（book_calc2.js の小問テンプレートに同じ数値 v を入れる）。
   two(v,o1) は {q, ans, wr:[誤答…], u, d, str, calc, x(別の計算で出した答え。検査用)} を返す。作れないときは null。 */
(function(){
var S=window.SETS=window.SETS||{},BD=window.BOOKDEFS=window.BOOKDEFS||{};
var RND={int:function(a,b){return a+Math.floor(Math.random()*(b-a+1));},pick:function(x){return x[Math.floor(Math.random()*x.length)];},
 shuffle:function(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}};
function pk(a){return a[Math.floor(Math.random()*a.length)];}
function isInt(x){return Math.abs(x-Math.round(x))<1e-7;}
function rk(x,k){var m=Math.pow(10,k),y=x*m;if(Math.abs(y-Math.floor(y)-0.5)<1e-6)return NaN;return Math.round(y+1e-9)/m;}
function r0(x){return rk(x,0);}function r1(x){return rk(x,1);}function r2(x){return rk(x,2);}
function nb(x){return Math.round(x*1e6)/1e6;}
function gcd(a,b){return b?gcd(b,a%b):a;}
function F(n,d){var g=gcd(n,d);return (n/g)+'/'+(d/g);}
var PR={0:'（必要なときは、最後に小数第1位を四捨五入すること）',1:'（必要なときは、最後に小数第2位を四捨五入すること）',2:'（必要なときは、最後に小数第3位を四捨五入すること）'};
function L(f,l){S[f]=S[f]||{};return S[f][l]=S[f][l]||[];}
function add(f,l,id,two){L(f,l).push({id:'set-'+id,src:id,two:two});}
function findSrc(f,id){var B=BANK[f];for(var l in B)for(var k in B[l]){var xs=B[l][k]||[];for(var i=0;i<xs.length;i++)if(xs[i].id===id)return {it:xs[i],l:+l};}return null;}
/* 選択肢（setcore の choices と同じ作り方） */
function fmt(x,r){return r.str?String(x):(r.d?Number(x).toFixed(r.d):String(x))+r.u;}
function CH(r){if(!r.str&&!(isFinite(r.ans)&&r.ans>0))return null;var a=fmt(r.ans,r),out=[a],c=r.wr.slice();
 if(!r.str){var k=r.d?Math.pow(10,r.d):1;[0.8,1.2,0.9,1.1,0.5,1.5].forEach(function(m){c.push(Math.round(r.ans*m*k)/k);});[1,-1,2,-2].forEach(function(s){c.push(Math.round((r.ans+s*(r.d?Math.pow(10,-r.d):1))*k)/k);});}
 c.forEach(function(x){if(out.length>=5)return;if(!r.str&&!(isFinite(x)&&x>0))return;var s=fmt(x,r);if(out.indexOf(s)<0)out.push(s);});
 if(out.length<4)return null;var sh=RND.shuffle(out);return {c:sh,a:sh.indexOf(a)};}
/* 表：問題文の表を読み取る（セルの文字の配列） */
function TBL(q){var ts=[];(q.match(/<table[\s\S]*?<\/table>/g)||[]).forEach(function(t){ts.push((t.match(/<tr>[\s\S]*?<\/tr>/g)||[]).map(function(tr){return (tr.match(/<t[hd][^>]*>[\s\S]*?<\/t[hd]>/g)||[]).map(function(c){return c.replace(/<[^>]+>/g,'').trim();});}));});return ts;}
function N(s){return parseFloat(String(s).replace(/[^\d.\-]/g,''));}
function preEnd(q){var i=q.lastIndexOf('</table></div>');return i<0?-1:i+14;}
function lastStart(q){var sp=SETCORE.split(q);return sp?sp[0].length:-1;}
function sub1(q){var e=preEnd(q);return e<0?SETCORE.split(q)[1]:q.slice(e);}
/* 1問目のあと、条件文「〜のとき、」を取り出す */
function cond(o1){var s=sub1(o1.q),i=s.indexOf('とき、');return i<0?'':s.slice(0,i+3);}
var SEQ=0;
function tb(f,l,id,l2,two){var s0=findSrc(f,id);if(!s0)return;var k='B-'+id,ks=[k+'#1',k+'#2'];
 BD[ks[0]]={fd:f,lv:s0.l,d:{P:{_:[0]},ok:function(v){
   for(var n=0;n<40;n++){var o1;try{o1=s0.it.make(RND);}catch(e){continue;}if(!o1||!o1.v)continue;var r;try{r=two(o1.v,o1);}catch(e){r=null;}if(!r)continue;var ch=CH(r);if(!ch)continue;
    var q2;if(r.full)q2=r.q;else{var e=preEnd(o1.q);if(e<0)e=lastStart(o1.q);if(e<0)continue;var mid='';if(r.keep){var ls=lastStart(o1.q);if(ls>e)mid=o1.q.slice(e,ls);}q2=o1.q.slice(0,e)+mid+r.q;}
    v._o=[o1,{q:q2,c:ch.c,a:ch.a,calc:r.calc,fig:r.fig}];v._r=r;return true;}return false;},f:function(v){return v._o[0];}}};
 BD[ks[1]]={fd:f,lv:l2,d:{P:{_:[0]},ok:function(v){return !!v._o;},f:function(v){return v._o[1];}}};
 L(f,Math.max(s0.l,l2)).push({id:'set-'+id,book:ks,tb:1});}
/* ア・イ・ウ形式：規則の文が同じで、ア・イ・ウが違う2問目 */
function remake(f,l,id){var s0=findSrc(f,id);if(!s0)return;var k='B-'+id,ks=[k+'#1',k+'#2'];
 BD[ks[0]]={fd:f,lv:l,d:{P:{_:[0]},ok:function(v){for(var n=0;n<20;n++){var a=s0.it.make(RND);if(!a)continue;var i=a.q.indexOf('<br>ア　');if(i<0)continue;var p=a.q.slice(0,i+4),b=null,c=null;
   for(var t=0;t<200;t++){var x=s0.it.make(RND);if(!x||x.q===a.q||x.q.indexOf(p)!==0)continue;if(x.c[x.a]!==a.c[a.a]){b=x;break;}if(!c)c=x;}b=b||c;if(!b)continue;v._o=[a,b];return true;}return false;},f:function(v){return v._o[0];}}};
 BD[ks[1]]={fd:f,lv:l,d:{P:{_:[0]},ok:function(v){return !!v._o;},f:function(v){return v._o[1];}}};
 L(f,l).push({id:'set-'+id,book:ks,tb:1});}
/* 問題集の本物の組。K：小問どうしで共通の数値を作る乱数の回数（それ以降は小問ごとの数値） */
function grp(f,l,n,bks,K,pm,ck){var its=bks.map(function(b){var r=null;for(var lv in BANK[f])(BANK[f][lv].real||[]).forEach(function(x){if(x.bk===b&&x._gen)r={it:x,l:+lv};});return r;});
 if(its.some(function(x){return !x;}))return;var ks=bks.map(function(b){return 'G-'+b;});
 function rec(){var log=[],R={int:function(a,b){var x=RND.int(a,b);log.push(x);return x;},pick:function(a){var x=RND.pick(a);log.push(x);return x;},shuffle:function(a){var x=RND.shuffle(a);log.push(x);return x;}};R.log=log;return R;}
 function play(log){var i=0;function nx(fn){return function(a,b){return i<K?log[i++]:fn(a,b);};}return {int:nx(RND.int),pick:nx(RND.pick),shuffle:nx(RND.shuffle)};}
 its.forEach(function(x,i){BD[ks[i]]={fd:f,lv:x.l,d:{P:{_:[0]},ok:i?function(v){return !!v._o;}:function(v){
  for(var t=0;t<60;t++){var m=pm!=null?pm:Math.floor(Math.random()*its.length),R=rec(),v0=null;for(var j=0;j<400&&!v0;j++){R.log.length=0;v0=its[m].it._gen(R);}if(!v0)continue;
   var vv=v0,bad=false;if(K){for(var s=0;s<its.length&&!bad;s++){if(s===m)continue;var w=null;for(var j2=0;j2<200&&!w;j2++)w=its[s].it._gen(play(R.log));if(!w){bad=true;break;}var u={};for(var a in w)u[a]=w[a];for(var a2 in vv)u[a2]=vv[a2];vv=u;}}
   if(bad||(ck&&!ck(vv)))continue;var os=[];for(var s2=0;s2<its.length;s2++){var o=null;try{o=its[s2].it._build(vv,RND);}catch(e){o=null;}if(!o||its[s2].it.verify(vv,o)!==o.c[o.a]||/NaN|undefined|Infinity/.test(o.q+o.c.join()+(o.calc||''))){bad=true;break;}os.push(o);}
   if(bad)continue;v._o=os;return true;}return false;},f:function(v){return v._o[i];}}};});
 L(f,l).push({id:'set-book-'+n,book:ks});}

/* ================= 集合 ================= */
var SG='集合';
/* 2問目は「対象を変える」：カルノー表の別のマスを聞く。calc は表のマスで示す */
function kar(l,id,q,u,a,x,calc){add(SG,l,id,function(v){var ans=a(v);if(!(ans>0)||!isInt(ans))return null;var c=calc(v);
 return {q:q,ans:ans,wr:[v.A,v.B,v.oo,v.xx,v.ox,v.xo].filter(function(y){return y!=null&&y!==ans;}),u:u,l:l,x:x(v),calc:c};});}
kar(3,'g-集合3real0','犬を飼っているが、猫を飼っていない世帯はいくつか。','世帯',function(v){return v.A-(v.A+v.B+v.xx-v.T);},function(v){return v.ox;},function(v){var oo=v.A+v.B+v.xx-v.T;return '両方 '+v.A+' ＋ '+v.B+' ＋ '+v.xx+' − '+v.T+' ＝ '+oo+'<br>犬だけ '+v.A+' − '+oo+' ＝ '+(v.A-oo);});
kar(3,'g-集合3real1','国内旅行の経験はあるが、海外旅行の経験はない学生は何人か。','人',function(v){return v.B-v.oo;},function(v){return v.xo;},function(v){return v.B+' − '+v.oo+' ＝ '+(v.B-v.oo);});
kar(3,'g-集合3real2','新聞は読むが、テレビのニュースは見ない人は全体の何%か。','%',function(v){return v.A-v.oo;},function(v){return v.ox;},function(v){return v.A+' − '+v.oo+' ＝ '+(v.A-v.oo)+'%';});
kar(3,'g-集合3real4','電車は使っているが、車は使っていない人は何人か。','人',function(v){return v.T-v.A-v.xx;},function(v){return v.xo;},function(v){return '車を使っていない人 '+v.T+' − '+v.A+' ＝ '+(v.T-v.A)+'<br>'+(v.T-v.A)+' − '+v.xx+' ＝ '+(v.T-v.A-v.xx);});
kar(3,'g-集合3real5','運転免許は持っているが、英語の資格は持っていない学生は何人か。','人',function(v){return v.T-v.B-v.xx;},function(v){return v.ox;},function(v){return '英語の資格を持っていない学生 '+v.T+' − '+v.B+' ＝ '+(v.T-v.B)+'<br>'+(v.T-v.B)+' − '+v.xx+' ＝ '+(v.T-v.B-v.xx);});
kar(3,'g-集合3real6','映画鑑賞は好きだが、スポーツ観戦は好きではない人は全体の何%か。','%',function(v){return 100-v.A-v.xx;},function(v){return v.xo;},function(v){return 'スポーツ観戦が好きではない人 100 − '+v.A+' ＝ '+(100-v.A)+'<br>'+(100-v.A)+' − '+v.xx+' ＝ '+(100-v.A-v.xx)+'%';});
kar(3,'g-集合3real8','スポーツジムを利用したことはあるが、市民プールを利用したことがない人は何人か。','人',function(v){return v.B-v.oo;},function(v){return v.xo;},function(v){return v.B+' − '+v.oo+' ＝ '+(v.B-v.oo);});
kar(3,'g-集合3real9','社員食堂は利用しているが、コンビニエンスストアは利用していない人は何人か。','人',function(v){return v.A-v.oo;},function(v){return v.ox;},function(v){return v.A+' − '+v.oo+' ＝ '+(v.A-v.oo);});
kar(4,'g-集合4real0','サッカーの経験はあるが、野球の経験はない学生は何人か。','人',function(v){return v.B-v.oo;},function(v){return v.xo;},function(v){return v.B+' − '+v.oo+' ＝ '+(v.B-v.oo);});
kar(4,'g-集合4real1','電車を使っていない女性は何人か。','人',function(v){return v.T-v.A-v.xo;},function(v){return v.xx;},function(v){return '女性 '+v.T+' − '+v.A+' ＝ '+(v.T-v.A)+'<br>'+(v.T-v.A)+' − '+v.xo+' ＝ '+(v.T-v.A-v.xo);});
add(SG,4,'g-集合4real3',function(v){var a=v.N*(100-v.B-v.xx)/100;if(!isInt(a)||a<=0)return null;return {q:'新聞は購読しているが、インターネットでニュースを読まない人は何人か。',ans:a,wr:[v.N*v.A/100,v.N*v.oo/100,v.N*v.xx/100,v.N*(100-v.B)/100],u:'人',l:4,x:v.N*v.ox/100,
 calc:'インターネットでニュースを読まない人 100 − '+v.B+' ＝ '+(100-v.B)+'%<br>'+(100-v.B)+' − '+v.xx+' ＝ '+(100-v.B-v.xx)+'%<br>'+v.N+' × '+nb((100-v.B-v.xx)/100)+' ＝ '+a};});
kar(4,'g-集合4real4','緑茶は好むが、紅茶は好まない人は全体の何%か。','%',function(v){return v.B-v.oo;},function(v){return v.xo;},function(v){return v.B+' − '+v.oo+' ＝ '+(v.B-v.oo)+'%';});
kar(4,'g-集合4real5','部活動に参加していない男子は何人か。','人',function(v){return v.T-v.B-v.xx;},function(v){return v.T-v.Ax-v.oo;},function(v){return '部活動に参加していない生徒 '+v.T+' − '+v.B+' ＝ '+(v.T-v.B)+'<br>'+(v.T-v.B)+' − '+v.xx+' ＝ '+(v.T-v.B-v.xx);});
kar(4,'g-集合4real7','Pは持っているが、Qは持っていない人は何人か。','人',function(v){return v.T-v.B-v.xx;},function(v){return v.ox;},function(v){return 'Qを持っていない人 '+v.T+' − '+v.B+' ＝ '+(v.T-v.B)+'<br>'+(v.T-v.B)+' − '+v.xx+' ＝ '+(v.T-v.B-v.xx);});
kar(4,'g-集合4real8','資格を持っていない女性は社員全体の何%か。','%',function(v){return 100-v.A-v.xo;},function(v){return v.xx;},function(v){return '女性 100 − '+v.A+' ＝ '+(100-v.A)+'%<br>'+(100-v.A)+' − '+v.xo+' ＝ '+(100-v.A-v.xo)+'%';});
add(SG,4,'g-集合4real9',function(v){var oo=v.A+v.B+v.xx-100,a=v.N*oo/100;if(!isInt(a)||a<=0)return null;return {q:'運転免許を持っていて、アルバイトもしている学生は何人か。',ans:a,wr:[v.N*v.ox/100,v.N*v.xx/100,v.N*v.A/100,v.N*v.xo/100],u:'人',l:4,x:v.N*v.oo/100,
 calc:'両方 '+v.A+' ＋ '+v.B+' ＋ '+v.xx+' − 100 ＝ '+oo+'%<br>'+v.N+' × '+nb(oo/100)+' ＝ '+a};});
add(SG,4,'bk170',function(v){var x=2*v.B-v.A,a=v.A+v.B-2*x;if(x<=0||a<=0)return null;return {q:'式典のみに参加した人が、同窓会のみに参加した人の2倍の人数だったとき、式典と同窓会のどちらか一方だけに参加した人は何人か。',ans:a,wr:[v.A+v.B-x,x,v.A-x,v.B-x],u:'人',l:4,x:(v.A-x)+(v.B-x),
 calc:'両方を x 人とすると '+v.A+' − x ＝ 2 × ('+v.B+' − x) → x ＝ '+x+'<br>式典のみ '+(v.A-x)+'、同窓会のみ '+(v.B-x)+'<br>'+(v.A-x)+' ＋ '+(v.B-x)+' ＝ '+a};});
add(SG,4,'bk172',function(v){var a=v.N-v.n-v.s;return {q:'動物園には行かなかったが水族館には行った人が'+v.s+'人、どちらにも行かなかった人が'+v.n+'人だとすると、動物園に行った人は何人か。',ans:a,wr:[v.x,v.x+v.s,v.N-v.n,a-v.d],u:'人',l:4,x:v.x+v.s+v.d,
 calc:'少なくとも一方に行った人 '+v.N+' − '+v.n+' ＝ '+(v.N-v.n)+'<br>動物園に行った人 '+(v.N-v.n)+' − '+v.s+' ＝ '+a};});
add(SG,4,'bk173',function(v){var a=v.N-v.n-v.a;if(a<=0)return null;return {q:'1回目も2回目も正解が10問未満だった人が'+v.n+'人だったとき、1回目は10問未満で、2回目は10問以上正解した人は何人か。',ans:a,wr:[v.a+v.b-(v.N-v.n),v.N-v.b,v.b-v.a,v.N-v.a],u:'人',l:4,x:v.b-(v.a+v.b-(v.N-v.n)),
 calc:'少なくとも1回は10問以上 '+v.N+' − '+v.n+' ＝ '+(v.N-v.n)+'<br>1回目が10問未満で2回目が10問以上 '+(v.N-v.n)+' − '+v.a+' ＝ '+a};});
add(SG,4,'bk174',function(v){var R=v.N*v.p/100,a=v.N-R-v.mm;if(!isInt(R)||a<=0)return null;return {q:'ホテルだけが好きな人は何人か。',ans:a,wr:[R*v.q/100,a+R*v.q/100,v.N-R,R],u:'人',l:4,x:(R*v.q/100+a)-R*v.q/100,
 calc:'旅館が好きな人 '+v.N+' × '+nb(v.p/100)+' ＝ '+R+'<br>旅館が好きではない人 '+v.N+' − '+R+' ＝ '+(v.N-R)+'<br>ホテルだけ '+(v.N-R)+' − '+v.mm+' ＝ '+a};});
add(SG,4,'bk175',function(v){var bo=v.y+v.p+v.n-100,a=v.N*(100-v.p-v.n)/100;if(!isInt(a)||a<=0)return null;return {q:'ヨガとピラティスの両方を体験したことのある人が'+(v.N*bo/100)+'人だったとき、ヨガだけを体験したことがある人は何人か。',ans:a,wr:[v.N*v.y/100,v.N*bo/100,v.N*(100-v.y-v.n)/100,v.N*v.p/100],u:'人',l:4,x:v.N*v.y/100-v.N*bo/100,
 calc:'両方 '+v.y+' ＋ '+v.p+' ＋ '+v.n+' − 100 ＝ '+bo+'% → 利用者 '+(v.N*bo/100)+' ÷ '+nb(bo/100)+' ＝ '+v.N+'<br>ヨガだけ 100 − '+v.p+' − '+v.n+' ＝ '+(100-v.p-v.n)+'%<br>'+v.N+' × '+nb((100-v.p-v.n)/100)+' ＝ '+a};});
/* 指標5 */
function k5(id,q,f,x,calc){add(SG,5,id,function(v){var a=f(v);if(!(a>0)||!isInt(a))return null;return {q:q,ans:a,wr:[v.x,v.kx,v.zA,v.zB,v.zC].filter(function(y){return y!=null&&y!==a;}),u:'人',l:5,x:x(v),calc:calc(v,a)};});}
k5('g-集合5real0','Pは持っているが、Qは持っていない人は何人か。',function(v){return v.A-(v.T-v.A-v.B)/(v.k-1);},function(v){return v.zA;},function(v,a){var x=(v.T-v.A-v.B)/(v.k-1);return '両方を x 人とすると、どちらもない人は '+v.k+'x<br>'+v.A+' ＋ '+v.B+' − x ＋ '+v.k+'x ＝ '+v.T+' → x ＝ '+x+'<br>'+v.A+' − '+x+' ＝ '+a;});
k5('g-集合5real1','図書館は利用したことがあるが、体育館は利用したことがない人は何人か。',function(v){return v.A-v.k*(v.A+v.B-v.T)/(v.k-1);},function(v){return v.zA;},function(v,a){var x=(v.A+v.B-v.T)/(v.k-1);return 'どちらもない人を x 人とすると、両方は '+v.k+'x<br>'+v.A+' ＋ '+v.B+' − '+v.k+'x ＋ x ＝ '+v.T+' → x ＝ '+x+'<br>両方 '+(v.k*x)+'<br>'+v.A+' − '+(v.k*x)+' ＝ '+a;});
k5('g-集合5real2','アルバイトはしているが、サークル活動はしていない学生は何人か。',function(v){return v.A-(v.T-v.A-v.B)/(v.k-1);},function(v){return v.zA;},function(v,a){var x=(v.T-v.A-v.B)/(v.k-1);return '両方を x 人とすると、どちらもしていない人は '+v.k+'x<br>'+v.A+' ＋ '+v.B+' − x ＋ '+v.k+'x ＝ '+v.T+' → x ＝ '+x+'<br>'+v.A+' − '+x+' ＝ '+a;});
k5('g-集合5real8','どちらの研修も受けていない人は何人か。',function(v){return (v.A+v.B-v.T)/(v.k-1);},function(v){return v.x;},function(v,a){return 'どちらも受けていない人を x 人とすると、両方は '+v.k+'x<br>'+v.A+' ＋ '+v.B+' − '+v.k+'x ＋ x ＝ '+v.T+' → x ＝ '+a;});
add(SG,5,'g-集合5real9',function(v){var x=(v.A+v.B-100)/(v.k-1),a=v.N*(v.B-v.k*x)/100;if(!isInt(a)||a<=0)return null;return {q:'Qは使っているが、Pは使っていない人は何人か。',ans:a,wr:[v.ans,v.N*v.k*x/100,v.N*x/100,v.N*v.B/100],u:'人',l:5,x:v.N*v.zB/100,
 calc:'どちらも使っていない人を x% とすると、両方は '+v.k+'x%<br>'+v.A+' ＋ '+v.B+' − '+v.k+'x ＋ x ＝ 100 → x ＝ '+x+'<br>Qだけ '+v.B+' − '+(v.k*x)+' ＝ '+(v.B-v.k*x)+'%<br>'+v.N+' × '+nb((v.B-v.k*x)/100)+' ＝ '+a};});
add(SG,5,'g-集合5real3',function(v){var m=v.p1*v.p2,w=(100-v.p1)*v.p3,a=r0(w/(m+w)*100);if(!(a>0))return null;return {q:'簿記の資格を持っている人のうち、女性の割合は何%か'+PR[0]+'。',ans:a,wr:[v.p3,100-v.p1,r0(m/(m+w)*100),r0((100-v.p1)*v.p3/100)],u:'%',l:5,x:100-r0(m/(m+w)*100),
 calc:'男性で資格あり '+nb(v.p1/100)+' × '+nb(v.p2/100)+' ＝ '+nb(m/10000)+'<br>女性で資格あり '+nb((100-v.p1)/100)+' × '+nb(v.p3/100)+' ＝ '+nb(w/10000)+'<br>'+nb(w/10000)+' ÷ '+nb((m+w)/10000)+' ≒ '+a+'%'};});
add(SG,5,'g-集合5real5',function(v){var m=v.p1*v.p2,w=(100-v.p1)*v.p3,a=r0(m/(m+w)*100);if(!(a>0))return null;return {q:'在宅勤務をしている社員のうち、本社に勤務している社員の割合は何%か'+PR[0]+'。',ans:a,wr:[v.p2,v.p1,r0(w/(m+w)*100),r0(v.p1*v.p2/100)],u:'%',l:5,x:r0(v.N*v.p1*v.p2/10000/v.ans*100),
 calc:'本社で在宅 '+nb(v.p1/100)+' × '+nb(v.p2/100)+' ＝ '+nb(m/10000)+'<br>在宅全体 '+nb(m/10000)+' ＋ '+nb((100-v.p1)/100)+' × '+nb(v.p3/100)+' ＝ '+nb((m+w)/10000)+'<br>'+nb(m/10000)+' ÷ '+nb((m+w)/10000)+' ≒ '+a+'%'};});
add(SG,5,'g-集合5real4',function(v){var t=(v.p1*v.p2+(100-v.p1)*v.p3)/100,a=r0(t);if(!(a>0))return null;return {q:'「はい」と答えた回答者は、回答者全体の何%か'+PR[0]+'。',ans:a,wr:[r0((v.p2+v.p3)/2),r0(v.p1*v.p2/100),v.p2,v.p3],u:'%',l:5,x:r0((v.a+v.b)/(v.Fn+v.Mn)*100),
 calc:nb(v.p1/100)+' × '+nb(v.p2/100)+' ＋ '+nb((100-v.p1)/100)+' × '+nb(v.p3/100)+' ＝ '+nb(t/100)+' → '+a+'%'};});
add(SG,5,'g-集合5real7',function(v){var mg=v.G*v.k/(v.k+1),a=v.A-mg;if(!isInt(mg)||a<=0)return null;return {q:'眼鏡をかけていない男性は何人か。',ans:a,wr:[v.ans,v.A-v.G/(v.k+1),v.T-v.A-v.G,v.A-v.G],u:'人',l:5,x:v.T-v.G-v.ans,
 calc:'眼鏡をかけている女性を x 人とすると、男性は '+v.k+'x<br>x ＋ '+v.k+'x ＝ '+v.G+' → x ＝ '+(v.G/(v.k+1))+'、男性 '+mg+'<br>'+v.A+' − '+mg+' ＝ '+a};});
add(SG,5,'g-集合5real6',function(v){var n=v.g1*v.c*v.f,d=v.g2*v.d*v.e;if(n>=d)return null;var a=F(n,d),w=[F(v.c,v.d),F(v.g1*v.c,v.g2*v.d),F(d-n,d),F(v.e,v.f),F(v.g1,v.g2)].filter(function(s){return s!==a;});
 return {q:'森林のうち、山地にあるものは何分のいくつか。',ans:a,str:1,wr:w,u:'',l:5,x:a,calc:'山地の森林 '+v.g1+'/'+v.g2+' × '+v.c+'/'+v.d+' ＝ '+F(v.g1*v.c,v.g2*v.d)+'<br>'+F(v.g1*v.c,v.g2*v.d)+' ÷ '+v.e+'/'+v.f+' ＝ '+a};});
add(SG,5,'bk171',function(v){var both=(v.t+v.b-v.N)*v.f/(v.f-1),a=v.t-both;if(!isInt(both)||a<=0)return null;return {q:'電車だけを利用する人は何人か。',ans:a,wr:[both,v.b-both,v.n,v.N-v.b],u:'人',l:5,x:v.t-v.f*v.n,
 calc:'どちらも利用しない人を x 人とすると、両方は '+v.f+'x<br>'+v.t+' ＋ '+v.b+' − '+v.f+'x ＋ x ＝ '+v.N+' → x ＝ '+(both/v.f)+'、両方 '+both+'<br>'+v.t+' − '+both+' ＝ '+a};});
/* 問題集の本物の組 */
grp(SG,5,176,['176-1','176-2']);grp(SG,5,177,['177-1','177-2']);grp(SG,5,178,['178-1','178-2']);
grp(SG,4,179,['179-1','179-2','179-3']);grp(SG,4,180,['180-1','180-2']);grp(SG,5,181,['181-1','181-2','181-3']);

/* ================= 特殊算 ================= */
var TK='特殊算';
function maxA(v){return Math.floor((v.B-v.b*v.n)/(v.a-v.b));}
add(TK,4,'特殊算4real0-g',function(v){var m=Math.min(v.n,maxA(v)),a=m*v.a+(v.n-m)*v.b;if(m<1)return null;return {q:v.a+'円の菓子をできるだけ多く買うとき、代金は全部で何円になるか。',ans:a,wr:[v.B,a+v.a-v.b,a-(v.a-v.b),v.n*v.a],u:'円',l:4,x:v.B-((v.B-v.b*v.n)-(v.a-v.b)*m),
 calc:'全部 '+v.b+'円だと '+v.b+' × '+v.n+' ＝ '+v.b*v.n+'<br>1個入れ替えるごとに '+(v.a-v.b)+'円増える → ('+v.B+' − '+v.b*v.n+') ÷ '+(v.a-v.b)+' → '+m+'個<br>'+v.a+' × '+m+' ＋ '+v.b+' × '+(v.n-m)+' ＝ '+a};});
add(TK,4,'特殊算4real9-g',function(v){var m=Math.min(v.n,maxA(v)),a=m*v.a+(v.n-m)*v.b;if(m<1)return null;return {q:v.a+'円切手をできるだけ多く買うとき、代金は全部で何円になるか。',ans:a,wr:[v.B,a+v.a-v.b,a-(v.a-v.b),v.n*v.a],u:'円',l:4,x:v.B-((v.B-v.b*v.n)-(v.a-v.b)*m),
 calc:'全部 '+v.b+'円だと '+v.b+' × '+v.n+' ＝ '+v.b*v.n+'<br>1枚入れ替えるごとに '+(v.a-v.b)+'円増える → ('+v.B+' − '+v.b*v.n+') ÷ '+(v.a-v.b)+' → '+m+'枚<br>'+v.a+' × '+m+' ＋ '+v.b+' × '+(v.n-m)+' ＝ '+a};});
function maxB(v){return Math.floor((v.B-v.a*v.n)/(v.b-v.a));}
add(TK,4,'bk190',function(v){var m=Math.min(v.n,maxB(v)),a=m*v.b+(v.n-m)*v.a;if(m<1)return null;return {q:v.b+'円の菓子をできるだけたくさん買って、合計で'+v.n+'個にするとき、代金は全部で何円になるか。',ans:a,wr:[v.B,a+v.b-v.a,a-(v.b-v.a),v.n*v.b],u:'円',l:4,x:v.B-((v.B-v.a*v.n)-(v.b-v.a)*m),
 calc:'全部 '+v.a+'円だと '+v.a+' × '+v.n+' ＝ '+v.a*v.n+'<br>1個入れ替えるごとに '+(v.b-v.a)+'円増える → ('+v.B+' − '+v.a*v.n+') ÷ '+(v.b-v.a)+' → '+m+'個<br>'+v.b+' × '+m+' ＋ '+v.a+' × '+(v.n-m)+' ＝ '+a};});
add(TK,4,'特殊算4real1-g',function(v){var a=10000*(v.A-v.p)/(v.q-v.p);if(!isInt(a)||a<=0)return null;return {q:'7月につくった製品は何個か。',ans:a,wr:[10000-a+0,r0(10000*v.A/v.q),5000,10000*(v.q-v.A)/(v.q-v.p)+500].filter(function(x){return x!==a;}),u:'個',l:4,x:10000-10000*(v.q-v.A)/(v.q-v.p),
 calc:'7月を x 個とすると '+v.p+' × (10000 − x) ＋ '+v.q+'x ＝ '+v.A+' × 10000<br>'+(v.q-v.p)+'x ＝ '+(v.A-v.p)*10000+' → x ＝ '+a};});
add(TK,4,'bk193',function(v){var a=v.N*(v.av-v.c1)/(v.c2-v.c1);if(!isInt(a)||a<=0)return null;return {q:'7月の生産個数はいくつか。',ans:a,wr:[v.N-a,r0(v.N*v.av/v.c2),v.N/2,a+v.N/10],u:'個',l:4,x:v.N-v.N*(v.c2-v.av)/(v.c2-v.c1),
 calc:'7月を x 個とすると '+v.c1+' × ('+v.N+' − x) ＋ '+v.c2+'x ＝ '+v.av+' × '+v.N+'<br>'+(v.c2-v.c1)+'x ＝ '+(v.av-v.c1)*v.N+' → x ＝ '+a};});
function age2(F,k1){var t=F-2*k1;return t>0?t:null;}
add(TK,4,'特殊算4real2-g',function(v){var t=age2(v.F,v.k1);if(!t)return null;return {q:'上の子の年齢が父の年齢のちょうど半分になるのは何年後か。',ans:t,wr:[v.F-v.k1,r0(v.F/2)-v.k1+1,t+v.k2,Math.abs(t-v.k2)||t+2],u:'年後',l:4,x:(function(){for(var y=1;y<200;y++)if(2*(v.k1+y)===v.F+y)return y;})(),
 calc:'x 年後に 2 × ('+v.k1+' ＋ x) ＝ '+v.F+' ＋ x<br>x ＝ '+v.F+' − 2 × '+v.k1+' ＝ '+t};});
add(TK,4,'bk194',function(v){var t=age2(v.f,v.a);if(!t)return null;return {q:'上の子供の年齢が父親の年齢のちょうど半分になるのは何年後か。',ans:t,wr:[v.f-v.a,r0(v.f/2)-v.a+1,t+v.b,Math.abs(t-v.b)||t+2],u:'年後',l:4,x:(function(){for(var y=1;y<200;y++)if(2*(v.a+y)===v.f+y)return y;})(),
 calc:'x 年後に 2 × ('+v.a+' ＋ x) ＝ '+v.f+' ＋ x<br>x ＝ '+v.f+' − 2 × '+v.a+' ＝ '+t};});
add(TK,4,'特殊算4real5-g',function(v){var t=v.M-2*v.C;if(t<=0)return null;return {q:'母の年齢が子の年齢の2倍になるのは何年後か。',ans:t,wr:[(v.M-3*v.C)/2>0?(v.M-3*v.C)/2:t+3,v.M-v.C,t+v.C,r0(v.M/2)],u:'年後',l:4,x:(function(){for(var y=1;y<200;y++)if(v.M+y===2*(v.C+y))return y;})(),
 calc:'x 年後に '+v.M+' ＋ x ＝ 2 × ('+v.C+' ＋ x)<br>x ＝ '+v.M+' − 2 × '+v.C+' ＝ '+t};});
/* 部屋割り：参加者数・部屋数は問題文から読む */
function room(q){var m=q.match(/(\d+)人(?:の生徒)?が/),r=q.match(/(?:合わせて|合計)(\d+)室/);return m&&r?{P:+m[1],R:+r[1]}:null;}
function eqRoom(P,R){var m=(6*R-P)/3,c=R-2*m;return isInt(m)&&m>0&&c>0?{m:m,c:c}:null;}
add(TK,4,'特殊算4real3-g',function(v,o1){var z=room(o1.q);if(!z)return null;var e=eqRoom(z.P,z.R);if(!e||e.c===v.s)return null;
 return {q:'4人部屋と5人部屋の数が同じとき、6人部屋は何室か。',ans:e.c,wr:[v.s,e.m,z.R-e.c,e.c+2],u:'室',l:4,x:(function(){for(var c=0;c<=z.R;c++){var mm=(z.R-c)/2;if(isInt(mm)&&4*mm+5*mm+6*c===z.P)return c;}})(),
  calc:'4人部屋と5人部屋を x 室ずつとすると、6人部屋は '+z.R+' − 2x<br>4x ＋ 5x ＋ 6('+z.R+' − 2x) ＝ '+z.P+' → x ＝ '+e.m+'<br>6人部屋 '+z.R+' − '+2*e.m+' ＝ '+e.c};});
add(TK,4,'特殊算4real4-g',function(v,o1){var z=room(o1.q);if(!z)return null;var cs=[];for(var s=1;s<z.R;s++){var b=z.P-6*s-4*(z.R-s),a=z.R-s-b;if(b>0&&a>0)cs.push([s,a,b]);}if(!cs.length)return null;var p=pk(cs);
 return {q:'6人部屋が'+p[0]+'室のとき、4人部屋は何室か。',ans:p[1],wr:[p[2],z.R-p[0],p[1]+1,Math.abs(p[1]-p[2])||p[1]+2],u:'室',l:4,x:(function(){for(var a=0;a<=z.R;a++){var b=z.R-p[0]-a;if(b>=0&&4*a+5*b+6*p[0]===z.P)return a;}})(),
  calc:'4人部屋と5人部屋で '+z.R+' − '+p[0]+' ＝ '+(z.R-p[0])+'室、'+z.P+' − 6 × '+p[0]+' ＝ '+(z.P-6*p[0])+'人<br>全部4人部屋なら 4 × '+(z.R-p[0])+' ＝ '+4*(z.R-p[0])+' → 5人部屋 '+(z.P-6*p[0])+' − '+4*(z.R-p[0])+' ＝ '+p[2]+'<br>4人部屋 '+(z.R-p[0])+' − '+p[2]+' ＝ '+p[1]};});
add(TK,4,'特殊算4real6-g',function(v){var n=v.L/v.d;if(!isInt(n))return null;return {q:'さらに、木と木の間に2本ずつつつじを植える。つつじは全部で何本必要か。',ans:2*n,wr:[2*(n-1),2*(n+1),n,n-1],u:'本',l:4,x:2*n,calc:'桜の木 '+v.L+' ÷ '+v.d+' ＝ '+n+'本 → 木と木の間も '+n+'か所<br>2 × '+n+' ＝ '+2*n};});
add(TK,4,'bk196',function(v){var n=v.L/v.d;if(!isInt(n))return null;return {q:'さらに、木と木の間に2本ずつ花を植えたい。花は何本必要か。',ans:2*n,wr:[2*(n-1),2*(n+1),n,n-1],u:'本',l:4,x:2*n,calc:'木 '+v.L+' ÷ '+v.d+' ＝ '+n+'本 → 木と木の間も '+n+'か所<br>2 × '+n+' ＝ '+2*n};});
add(TK,4,'特殊算4real7-g',function(v){var n=v.L/v.d;if(!isInt(n))return null;return {q:'道の両端にも街灯を立てるとき、街灯は全部で何本必要か。',ans:2*(n+1),wr:[2*(n-1),2*n,n+1,n],u:'本',l:4,x:2*(n-1)+4,calc:'片側 '+v.L+' ÷ '+v.d+' ＋ 1 ＝ '+(n+1)+'本<br>両側 2 × '+(n+1)+' ＝ '+2*(n+1)};});
add(TK,4,'特殊算4real8-g',function(v){var w=(v.T-v.d)/2;if(!isInt(w))return null;return {q:'女性は何人か。',ans:w,wr:[w+v.d,v.T-v.d,r0(v.T/2),w-1],u:'人',l:4,x:v.T-(v.T+v.d)/2,calc:'('+v.T+' − '+v.d+') ÷ 2 ＝ '+w};});
tb(TK,4,'bk195',4,function(v,o1){var W=(v.T-v.d)/2,y=(W-v.e)/2;if(!isInt(W)||!isInt(y)||y<=0)return null;var q=o1.q.replace('参加した男性の人数は何人か','参加した女性のうち、Y社の女性は何人か');if(q===o1.q)return null;
 return {full:1,q:q,ans:y,wr:[y+v.e,W,y+1,y-1,v.e],u:'人',l:4,x:W-(W+v.e)/2,calc:'女性 ('+v.T+' − '+v.d+') ÷ 2 ＝ '+W+'<br>Y社の女性 ('+W+' − '+v.e+') ÷ 2 ＝ '+y};});
add(TK,4,'bk192',function(v){var best=1e9,P=[800,1200,1600,1800];for(var d=v.m;d*1800<=v.T;d++)for(var a=2;a*800+d*1800<=v.T;a++)for(var b=2;a*800+b*1200+d*1800<=v.T;b++){var r=v.T-a*800-b*1200-d*1800;if(r%1600===0&&r/1600>=2){var n=a+b+d+r/1600;if(n<best)best=n;}}
 if(best>=1e9)return null;return {q:'1800円のぬいぐるみは'+v.m+'個以上、その他はすべて2個以上は買うとき、全部で最も少なくて何個になるか。',ans:best,wr:[best+1,best+2,best-1,best+3],u:'個',l:4,x:best,calc:'1個あたりが高いものを多くするほど個数は少ない。1800円を多くし、残りを800・1200・1600円で2個以上ずつ割り切れるように調整する<br>最少 '+best+'個'};});
grp(TK,4,197,['197-1','197-2']);grp(TK,4,198,['198-1','198-2']);grp(TK,4,199,['199-1','199-2']);

/* ================= 表の解釈 ================= */
var HY='表の解釈';
tb(HY,4,'g-hyo4-r0',4,function(v,o1){var w=v.p.map(function(p,i){return p*v.wt[i];}),od=[0,1,2,3].sort(function(a,b){return w[b]-w[a];});var ks=[0,1,3].filter(function(k){return k!==v.rank;}),k=pk(ks);
 if(Math.abs(w[od[k]]-w[od[k+(k===3?-1:1)]])<1e-9)return null;var lab=['最も大きい','2番目に大きい','3番目に大きい','最も小さい'][k];var nm=v.nm||['水素','炭素','酸素','窒素'];
 return {q:'化合物Pに含まれる原子のうち、重量の合計が'+lab+'ものはどれか。ただし、原子1個の重量の比は、水素：炭素：酸素：窒素＝1：12：16：14とする。',ans:nm[od[k]],str:1,wr:nm.filter(function(s,i){return i!==od[k];}),u:'',l:4,x:nm[od[k]],
  calc:nm.map(function(s,i){return s+' '+v.p[i]+' × '+v.wt[i]+' ＝ '+nb(w[i]);}).join('<br>')+'<br>'+lab+'のは '+nm[od[k]]};});
tb(HY,4,'g-hyo4-r1',4,function(v,o1){var t=TBL(o1.q)[0],nm=t[0].slice(1),p=t[1].slice(1).map(N),sol=(o1.q.match(/(水溶液\S)に含まれる薬品/)||[])[1];if(!sol)return null;var gi=v.gi,ai=v.ai;
 var W=v.g*100/p[gi];if(isInt(W))return {q:sol+'に含まれる薬品'+nm[gi]+'が'+v.g+'gのとき、'+sol+'全体の重さは何gか。',ans:Math.round(W),wr:[r1(v.g*p[gi]),Math.round(W/10),Math.round(W*p[ai]/100)||W/2,W*2],u:'g',l:4,x:Math.round(v.g/(p[gi]/100)),calc:v.g+' ÷ '+nb(p[gi]/100)+' ＝ '+Math.round(W)};
 var j=[0,1,2].filter(function(i){return i!==gi&&i!==ai;})[0],a=r1(v.g*p[j]/p[gi]);return {q:sol+'に含まれる薬品'+nm[gi]+'が'+v.g+'gのとき、薬品'+nm[j]+'は何gか'+PR[1]+'。',ans:a,d:1,wr:[r1(v.g*p[gi]/p[j]),r1(v.g*p[ai]/p[gi]),r1(v.g*p[j]/100),r1(a+1)],u:'g',l:4,x:r1(v.g/p[gi]*100*p[j]/100),
  calc:'全体 '+v.g+' ÷ '+nb(p[gi]/100)+'<br>× '+nb(p[j]/100)+' → '+v.g+' × '+p[j]+' ÷ '+p[gi]+' ≒ '+a};});
tb(HY,4,'g-hyo4-r2',5,function(v,o1){var t=TBL(o1.q)[0],rows=t.slice(1),p=rows.map(function(r){return N(r[1]);}),ix=rows.map(function(r){return N(r[2]);}),j=RND.int(0,3),s=0;p.forEach(function(x,i){s+=x*ix[i];});var a=r1(p[j]*ix[j]/s*100);
 return {q:'2000年のX県の人口に占める'+rows[j][0].replace(/^[①②③④]/,'')+'の人の割合は何%か'+PR[1]+'。',ans:a,d:1,wr:[p[j],r1(ix[j]/4),r1(p[j]*ix[j]/100),r1(a+2)],u:'%',l:5,x:r1(100/(s/(p[j]*ix[j]))),
  calc:'2000年（2020年の人口を100）：'+rows.map(function(r,i){return nb(p[i]*ix[i]/100);}).join(' ＋ ')+' ＝ '+nb(s/100)+'<br>'+nb(p[j]*ix[j]/100)+' ÷ '+nb(s/100)+' ≒ '+a+'%'};});
function wavg2(id,l,lab){tb(HY,l,id,4,function(v,o1){var t=TBL(o1.q)[0],rows=t.slice(1,4),n=rows.map(function(r){return N(r[1]);}),a=rows.map(function(r){return N(r[2]);});var ij=pk([[0,1],[0,2],[1,2]]),i=ij[0],j=ij[1],x=r1((n[i]*a[i]+n[j]*a[j])/(n[i]+n[j]));
 return {q:rows[i][0]+lab+'と'+rows[j][0]+lab+'を合わせた平均点は何点か'+PR[1]+'。',ans:x,d:1,wr:[r1((a[i]+a[j])/2),r1((n[i]*a[j]+n[j]*a[i])/(n[i]+n[j])),r1((n[0]*a[0]+n[1]*a[1]+n[2]*a[2])/(n[0]+n[1]+n[2]))],u:'点',l:4,x:r1(a[i]+(a[j]-a[i])*n[j]/(n[i]+n[j])),
  calc:'('+n[i]+' × '+a[i]+' ＋ '+n[j]+' × '+a[j]+') ÷ ('+n[i]+' ＋ '+n[j]+') ≒ '+x};});}
wavg2('g-hyo4-r3',4,'を受験した人');wavg2('g-hyo4-r9',4,'クラス');
tb(HY,4,'g-hyo4-r4',4,function(v){var A=v.T*v.p/v.q,a=A*(100-v.q)/100;if(!isInt(A)||!isInt(a))return null;return {keep:1,q:'一昨年の1日目の入場者数は何人か。',ans:a,wr:[A,v.T*(100-v.p)/100,A*v.q/100,a+v.T*v.p/100],u:'人',l:4,x:A-v.T*v.p/100,
 calc:'昨年の2日目 '+v.T+' × '+nb(v.p/100)+' ＝ '+v.T*v.p/100+'<br>一昨年の延べ '+v.T*v.p/100+' ÷ '+nb(v.q/100)+' ＝ '+A+'<br>一昨年の1日目 '+A+' × '+nb((100-v.q)/100)+' ＝ '+a};});
tb(HY,4,'g-hyo4-r5',4,function(v,o1){var t=TBL(o1.q)[0].slice(1),n=t.map(function(r){return N(r[1]);}),u=t.map(function(r){return N(r[2]);}),s=0,c=0;n.forEach(function(x,i){s+=x*u[i];c+=x;});var a=r0(s/c);if(!(a>0))return null;
 return {q:'S駅で降りた人が支払った運賃の平均は、1人あたり何円か'+PR[0]+'。',ans:a,wr:[r0((u[0]+u[1]+u[2])/3),u[1],r0(s/3/c*2),a+20],u:'円',l:4,x:r0(s/(n[0]+n[1]+n[2])),
  calc:'合計 '+t.map(function(r,i){return n[i]+' × '+u[i];}).join(' ＋ ')+' ＝ '+s+'<br>'+s+' ÷ '+c+' ≒ '+a};});
tb(HY,4,'g-hyo4-r6',4,function(v,o1){var cs=[];for(var T=500;T<=5000;T+=100){var c=T*v.p*v.t/10000;if(isInt(c)&&c>=10)cs.push(T);}if(!cs.length)return null;var T=pk(cs),c=T*v.p*v.t/10000,ts=TBL(o1.q),md=ts[1][0][3];
 return {q:'Yを選んで「'+md+'」と答えた人が'+c+'人のとき、回答者全体は何人か。',ans:T,wr:[c*100/v.t,c*100/v.p,r0(T*1.25),T/2],u:'人',l:4,x:c/(v.p/100)/(v.t/100),
  calc:'回答者全体を x 人とすると x × '+nb(v.p/100)+' × '+nb(v.t/100)+' ＝ '+c+'<br>x ＝ '+c+' ÷ '+nb(v.p*v.t/10000)+' ＝ '+T};});
function gasW(id,l){tb(HY,l,id,4,function(v,o1){var t=TBL(o1.q)[0].slice(1),p=t.map(function(r){return N(r[1]);}),sg=t.map(function(r){return N(r[2]);}),s=0;p.forEach(function(x,i){s+=x*sg[i];});var a=r1(v.g*s/(p[0]*sg[0]));
 return {q:'混合気体Xに含まれるメタンの重量が'+v.g+'gのとき、混合気体X全体の重量は何gか'+PR[1]+'。',ans:a,d:1,wr:[r1(v.g*100/p[0]),r1(v.g*(p[1]*sg[1]+p[2]*sg[2])/(p[0]*sg[0])),r1(v.g*(100)/p[0]*1.2)],u:'g',l:4,x:r1(v.g+v.g*(s-p[0]*sg[0])/(p[0]*sg[0])),
  calc:'重量の比 '+t.map(function(r,i){return p[i]+' × '+sg[i];}).join(' ＋ ')+' ＝ '+nb(s)+'<br>メタン '+nb(p[0]*sg[0])+' が '+v.g+'g → 全体 '+v.g+' × '+nb(s)+' ÷ '+nb(p[0]*sg[0])+' ≒ '+a};});}
gasW('g-hyo4-r7',4);
tb(HY,4,'g-hyo4-r8',4,function(v,o1){var ts=TBL(o1.q),h=ts[1][0],r=ts[1][1].map(N),io=h.indexOf('その他'),cs=[];for(var j=1;j<h.length;j++){if(j===io)continue;var a=v.cnt*r[j]/r[io];if(isInt(a))cs.push([j,a]);}if(!cs.length||io<0)return null;var z=pk(cs);
 return {q:'Zを選んで「その他」と答えた人が'+v.cnt+'人のとき、Zを選んで「'+h[z[0]]+'」と答えた人は何人か。',ans:z[1],wr:[r0(v.cnt*100/r[io]*r[z[0]]/100*v.p/100)||z[1]+5,v.cnt*100/r[io],r0(v.cnt*r[io]/r[z[0]]),z[1]+v.cnt],u:'人',l:4,x:v.cnt/(r[io]/100)*(r[z[0]]/100),
  calc:'Zを選んだ人 '+v.cnt+' ÷ '+nb(r[io]/100)+' ＝ '+nb(v.cnt*100/r[io])+'<br>× '+nb(r[z[0]]/100)+' ＝ '+z[1]};});
/* 指標5 */
tb(HY,5,'g-hyo5-r0',5,function(v,o1){var c=cond(o1);if(!c)return null;var a=r2(v.f*v.nq/v.nr);if(!(a>0))return null;
 return {q:c+'化合物Rに含まれる原子の総数は、化合物Qに含まれる原子の総数の何倍か'+PR[2]+'。',ans:a,d:2,wr:[r2(v.nr/v.nq*v.f),r2(v.nq/v.nr),r2(v.f*v.cr/v.cq),r2(a*2)],u:'倍',l:5,x:r2(v.f/(v.nr/v.nq)),
  calc:'窒素の数：Q × '+v.nq/100+' と R × '+v.nr/100+'<br>R × '+nb(v.nr/100)+' ＝ '+v.f+' × Q × '+nb(v.nq/100)+'<br>R ＝ Q × '+v.f+' × '+v.nq+' ÷ '+v.nr+' ≒ '+a+' 倍'};});
tb(HY,5,'g-hyo5-r1',5,function(v){var z=pk([[1,2],[2,1],[1,3],[3,1],[2,3],[3,2]]),a=r1((z[0]*v.x+z[1]*v.y)/(z[0]+z[1]));
 return {q:'水溶液XとYを重さで'+z[0]+'：'+z[1]+'の割合で混ぜたとき、混ぜた水溶液に含まれる薬品dの重量百分率は何%か'+PR[1]+'。',ans:a,d:1,wr:[r1((v.x+v.y)/2),r1((z[1]*v.x+z[0]*v.y)/(z[0]+z[1])),r1(z[0]*v.x+z[1]*v.y),v.z],u:'%',l:5,x:r1(v.x+(v.y-v.x)*z[1]/(z[0]+z[1])),
  calc:'('+z[0]+' × '+v.x+' ＋ '+z[1]+' × '+v.y+') ÷ '+(z[0]+z[1])+' ≒ '+a+'%'};});
tb(HY,5,'g-hyo5-r2',5,function(v){var D=v.a1*v.c2-v.a2*v.c1;if(!D)return null;var X=100*(v.A*v.c2-v.C*v.a2)/D,Y=100*(v.a1*v.C-v.c1*v.A)/D;if(!(Y>0)||!isInt(Y))return null;
 return {keep:1,q:'混ぜた水溶液Yは何gか。',ans:Y,wr:[X,X+Y,r0(v.A*100/v.a2),r0(v.C*100/v.c2)],u:'g',l:5,x:(v.A*100-v.a1*X)/v.a2,
  calc:'X を x g、Y を y g とすると<br>'+nb(v.a1/100)+'x ＋ '+nb(v.a2/100)+'y ＝ '+v.A+'<br>'+nb(v.c1/100)+'x ＋ '+nb(v.c2/100)+'y ＝ '+v.C+'<br>y ＝ '+Y};});
tb(HY,5,'g-hyo5-r3',5,function(v,o1){var t=TBL(o1.q)[0].slice(1),nm=t.map(function(r){return r[0];}),p=t.map(function(r){return N(r[1]);}),sg=t.map(function(r){return N(r[2]);}),s1=o1.q.slice(preEnd(o1.q)),c=cond(o1);if(!c)return null;
 var ask=-1;nm.forEach(function(x,i){if(s1.indexOf(x+'の重量は何')>=0)ask=i;});var js=[1,2,3].filter(function(i){return i!==ask&&i<nm.length;}),j=pk(js),s=0;for(var i=1;i<nm.length;i++)s+=p[i]*sg[i];var a=r1(v.G*p[j]*sg[j]/s);
 return {q:c+'取り除いた後の気体に含まれる'+nm[j]+'の重量は何gか'+PR[1]+'。',ans:a,d:1,wr:[r1(v.G*p[j]/(100-p[0])),r1(v.G*p[j]*sg[j]/(s+p[0]*sg[0])),r1(v.G*p[j]/100)],u:'g',l:5,x:r1(v.G/(s/(p[j]*sg[j]))),
  calc:'メタン以外の重量の比 '+[1,2,3].filter(function(i){return i<nm.length;}).map(function(i){return p[i]+' × '+sg[i];}).join(' ＋ ')+' ＝ '+nb(s)+'<br>'+nm[j]+' '+v.G+' × '+nb(p[j]*sg[j])+' ÷ '+nb(s)+' ≒ '+a};});
tb(HY,5,'g-hyo5-r4',5,function(v){var P=v.a/v.f+v.b+v.c/v.g,a=r2(100/P);if(!(a>0))return null;
 return {keep:1,q:'現在のY県の人口は、10年前の人口の何倍か'+PR[2]+'。',ans:a,d:2,wr:[r2(P/100),r2((v.a*v.f+v.b+v.c*v.g)/100),r2(v.g*v.f),r2(a+0.1)],u:'倍',l:5,x:r2(1/(P/100)),
  calc:'現在を100とすると10年前は '+v.a+' ÷ '+nb(v.f)+' ＋ '+v.b+' ＋ '+v.c+' ÷ '+nb(v.g)+' ＝ '+nb(P)+'<br>100 ÷ '+nb(P)+' ≒ '+a+' 倍'};});
tb(HY,5,'g-hyo5-r5',5,function(v){var U=(v.D-v.O)/(1+v.p/100),a=U*(100-v.p)/100;if(!isInt(U)||!isInt(a)||a<=0)return null;
 return {keep:1,q:'2日券の購入者のうち、1日だけ入場した人は何人か。',ans:a,wr:[U,U*v.p/100,v.D-v.O-U,r0((v.D-v.O)*(100-v.p)/100)],u:'人',l:5,x:U-U*v.p/100,
  calc:'2日券を x 人とすると、延べ入場者 '+v.O+' ＋ '+nb(2*v.p/100)+'x ＋ '+nb((100-v.p)/100)+'x ＝ '+v.D+' → x ＝ '+U+'<br>1日だけ '+U+' × '+nb((100-v.p)/100)+' ＝ '+a};});
tb(HY,5,'g-hyo5-r6',5,function(v){var y=(v.N*v.A-v.n1*v.a[0]-(v.N-v.n1)*v.a[1])/(v.a[2]-v.a[1]);if(!isInt(y))return null;y=Math.round(y);var c=v.N-v.n1-y;if(c<=0||y<=0)return null;
 return {q:'化学の受験者数は何人か。',ans:c,wr:[y,v.N-v.n1,r0((v.N-v.n1)/2),c+2],u:'人',l:5,x:(v.N*v.A-v.n1*v.a[0]-(v.N-v.n1)*v.a[2])/(v.a[1]-v.a[2]),
  calc:'化学を x 人とすると生物は '+(v.N-v.n1)+' − x<br>'+v.n1+' × '+v.a[0]+' ＋ '+v.a[1]+'x ＋ '+v.a[2]+'('+(v.N-v.n1)+' − x) ＝ '+v.N+' × '+v.A+'<br>x ＝ '+c};});
tb(HY,5,'g-hyo5-r7',5,function(v,o1){var ts=TBL(o1.q),h1=ts[0][0],r1v=ts[0][1].map(N),h2=ts[1][0],b=ts[1][1].map(N),j=pk([1,2]),d=h2[j],pi=r1v[h1.indexOf(d)];if(!(pi>0))return null;var a=r1(pi*b[j]/100);
 return {q:d+'を選んで「バス」と答えた人は、回答者全体の何%か'+PR[1]+'。',ans:a,d:1,wr:[r1(b[j]),r1(pi*b[3-j]/100),r1(pi+b[j]),r1(a*10)],u:'%',l:5,x:r1(b[j]*pi/100),calc:pi+'% × '+nb(b[j]/100)+' ＝ '+a+'%'};});
tb(HY,5,'g-hyo5-r8',5,function(v,o1){var t=TBL(o1.q)[0],h=t[0],p=t[1].map(N),r=t[2],T=N(r[5]),s=0,j=pk([2,3,4]);var W=(T*100-[2,3,4].reduce(function(q,i){return q+p[i]*N(r[i]);},0))/p[1];for(var i=2;i<=4;i++)s+=p[i]*N(r[i]);
 var a=r0(p[j]*N(r[j])/T),a2=r0(p[j]*N(r[j])/(s+p[1]*Math.round(W))*100);if(a!==a2)return null;
 return {q:'「乗用車」と答えた人のうち、'+h[j]+'を選んだ人の割合は何%か'+PR[0]+'。',ans:a,wr:[N(r[j]),p[j],r0(p[j]*N(r[j])/100),r0(N(r[j])/T*100)],u:'%',l:5,x:a2,calc:h[j]+'で乗用車 '+nb(p[j]/100)+' × '+nb(N(r[j])/100)+' ＝ '+nb(p[j]*N(r[j])/10000)+'<br>'+nb(p[j]*N(r[j])/10000)+' ÷ '+nb(T/100)+' ≒ '+a+'%'};});
tb(HY,5,'g-hyo5-r9',5,function(v,o1){var t=TBL(o1.q)[0].slice(1),p=t.map(function(r){return N(r[1]);}),ix=t.map(function(r){return N(r[2]);}),s=0;p.forEach(function(x,i){s+=x*ix[i];});var a=r2(s/10000);
 return {q:'2000年のX県の人口は、2020年の人口の何倍か'+PR[2]+'。',ans:a,d:2,wr:[r2(10000/s),r2((ix[0]+ix[1]+ix[2]+ix[3])/400),r2(a+0.1),r2(a-0.1)],u:'倍',l:5,x:r2(t.reduce(function(q,r,i){return q+p[i]/100*ix[i]/100;},0)),
  calc:t.map(function(r,i){return nb(p[i]/100)+' × '+nb(ix[i]/100);}).join(' ＋ ')+' ＝ '+nb(s/10000)+' ≒ '+a+' 倍'};});
/* 問題集の本物の組（185 と 200 は表の数値を共通にして、小問ごとの数値は別に作る） */
grp(HY,5,182,['182-1','182-2']);grp(HY,5,183,['183-1','183-2','183-3']);grp(HY,5,184,['184-1','184-2']);grp(HY,5,185,['185-1','185-2'],13);
grp(HY,5,186,['186-1','186-2','186-3']);grp(HY,4,187,['187-1','187-2','187-3']);function bl(t){return Math.abs(t*10-Math.floor(t*10)-0.5)<1e-6;}
grp(HY,5,188,['188-1','188-2','188-3'],0,2,function(v){var n=v.n[0],a=v.av[0];if(bl((n[0]*a[0]+n[1]*a[1]+n[2]*a[2])/400))return false;var s=0,c=0;for(var i=0;i<4;i++){s+=v.n[i][0]*v.av[i][0];c+=v.n[i][0];}return !bl(s/c/10);});grp(HY,5,189,['189-1','189-2','189-3','189-4']);

/* ================= 情報の読み取り ================= */
var JO='情報の読み取り';
remake(JO,4,'g-joho-r1');remake(JO,4,'g-joho-r3');remake(JO,4,'g-joho-r5');remake(JO,4,'g-joho-r8');
function eik(v,n){return n*v.Lp*(n>=v.th?(100-v.d)/100:1);}
add(JO,4,'g-joho-r0',function(v){var n=pk([v.th-1,v.th,v.th+1].filter(function(x){return x!==v.ns[0];})),a=eik(v,n);if(!isInt(a))return null;
 return {q:'入会した翌月に'+n+'回受講したとき、翌月に支払う金額は全部で何円か。',ans:a,wr:[n*v.Lp,a+v.E,n*v.Lp*(100-v.d)/100===a?n*v.Lp+v.E:n*v.Lp*(100-v.d)/100,a+v.Lp],u:'円',l:4,x:n>=v.th?n*v.Lp-n*v.Lp*v.d/100:n*v.Lp,
  calc:n+'回は'+(n>=v.th?v.th+'回以上なので '+v.d+'%引き<br>'+v.Lp+' × '+n+' × '+nb((100-v.d)/100)+' ＝ '+a:v.th+'回未満なので割引なし<br>'+v.Lp+' × '+n+' ＝ '+a)+'（入会金は入会した月だけ）'};});
add(JO,4,'g-joho-r9',function(v){var n=pk([v.th-1,v.th].filter(function(x){return v.ns.indexOf(x)<0;})),a=eik(v,n);if(!isInt(a))return null;
 return {q:'入会した月から3か月目に'+n+'回受講したとき、その月に支払う金額は全部で何円か。',ans:a,wr:[n*v.Lp,a+v.E,n*v.Lp*(100-v.d)/100===a?n*v.Lp+v.E:n*v.Lp*(100-v.d)/100,a+v.Lp],u:'円',l:4,x:n>=v.th?n*v.Lp-n*v.Lp*v.d/100:n*v.Lp,
  calc:n+'回は'+(n>=v.th?v.th+'回以上なので '+v.d+'%引き<br>'+v.Lp+' × '+n+' × '+nb((100-v.d)/100)+' ＝ '+a:v.th+'回未満なので割引なし<br>'+v.Lp+' × '+n+' ＝ '+a)+'（入会金は入会した月だけ）'};});
tb(JO,4,'g-joho-r2',4,function(v,o1){var i=o1.q.search(/縦\d/),j=o1.q.indexOf('<div class="tbl-wrap">');if(i<0||j<0)return null;var tab=v.tab;
 for(var n=0;n<50;n++){var d=[RND.int(10,45),RND.int(10,45),RND.int(10,45)],w=RND.int(1,15),s=d[0]+d[1]+d[2];if(s>tab[tab.length-1][1])continue;var ks=-1,kw=-1;for(var k=0;k<tab.length;k++){if(ks<0&&s<=tab[k][1])ks=k;if(kw<0&&w<=tab[k][2])kw=k;}if(ks<0||kw<0||ks===kw)continue;var K=Math.max(ks,kw),a=tab[K][3];
  if(d.join()===v.d.join())continue;
  return {full:1,q:o1.q.slice(0,i)+'縦'+d[0]+'cm、横'+d[1]+'cm、高さ'+d[2]+'cm、重さ'+w+'kgの荷物を、営業所に持ち込まずに送るときの料金は何円か。'+o1.q.slice(j),ans:a,wr:[a-v.m,tab[Math.min(ks,kw)][3],tab[Math.min(ks,kw)][3]-v.m],u:'円',l:4,
   x:(function(){for(var k=0;k<tab.length;k++)if(s<=tab[k][1]&&w<=tab[k][2])return tab[k][3];})(),
   calc:'大きさ '+d[0]+' ＋ '+d[1]+' ＋ '+d[2]+' ＝ '+s+'cm → '+tab[ks][0]+'、重さ '+w+'kg → '+tab[kw][0]+'<br>高いほうの '+tab[K][0]+' で '+a+'円（持ち込まないので割引なし）'};}return null;});
function park(v,T){var b=T<=v.F?0:Math.ceil((T-v.F)/v.u)*v.p;return Math.min(b,v.cap);}
add(JO,4,'g-joho-r4',function(v){var T=RND.int(4,9)*60+pk([0,10,15,20,30,40,45]);var a=park(v,T);if(T===v.T)return null;var h=Math.floor(T/60),m=T%60;
 return {q:'この駐車場に'+h+'時間'+(m?m+'分':'')+'駐車したときの料金は何円か。',ans:a,wr:[Math.ceil(T/v.u)*v.p,Math.ceil((T-v.F)/v.u)*v.p,a===v.cap?v.cap-v.p:v.cap,a+v.p],u:'円',l:4,x:(function(){var c=0;for(var t=v.F;t<T;t+=v.u)c+=v.p;return Math.min(c,v.cap);})(),
  calc:'有料の時間 '+T+' − '+v.F+' ＝ '+(T-v.F)+'分 → '+v.u+'分ごとに '+Math.ceil((T-v.F)/v.u)+'回<br>'+v.p+' × '+Math.ceil((T-v.F)/v.u)+' ＝ '+Math.ceil((T-v.F)/v.u)*v.p+(Math.ceil((T-v.F)/v.u)*v.p>v.cap?' → 上限 '+v.cap:'')+'円'};});
add(JO,4,'g-joho-r6',function(v){var dy=v.day==='当日'?'前日':'当日',rt=dy==='当日'?100:v.h,a=v.P*v.n*rt/100;if(!isInt(a)||a<=0)return null;
 return {q:'1泊'+v.P+'円の部屋に'+v.n+'泊する予約を、宿泊日の'+dy+'に取り消したときのキャンセル料は何円か。',ans:a,wr:[v.P*rt/100,v.P*v.n,v.P*v.n*v.h/100,v.P],u:'円',l:4,x:v.P*v.n-v.P*v.n*(100-rt)/100,
  calc:dy+'は宿泊料金の'+rt+'%<br>'+v.P+' × '+v.n+' × '+nb(rt/100)+' ＝ '+a};});
add(JO,4,'g-joho-r7',function(v,o1){var rk=(o1.q.match(/会員ランクが(\S+?)の人は/)||[])[1];if(!rk)return null;var t=pk([100,150,200,250,300].filter(function(x){return x%v.mul===0;}));if(!t)return null;var a=t/v.mul*100;
 return {q:rk+'の人が1回の買い物で'+t+'ポイント以上をもらうには、少なくとも何円の買い物をすればよいか。',ans:a,wr:[t*100,a-100,a+99,t*100/v.mul/2],u:'円',l:4,x:(function(){for(var y=100;;y+=100)if(Math.floor(y/100)*v.mul>=t)return y;})(),
  calc:t+' ÷ '+v.mul+' ＝ '+t/v.mul+'ポイント分 → 100 × '+t/v.mul+' ＝ '+a+'円'};});
grp(JO,4,200,['200-1','200-2'],5);grp(JO,4,201,['201-1','201-2']);
})();
