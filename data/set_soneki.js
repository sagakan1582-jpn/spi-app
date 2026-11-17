/* 本番形式（2タブの組問）：損益・単位あたりの大きさ・精算・分割払い。担当A（2026-11-17）
   1問目は実践の問題（src のテンプレート）をそのまま使い、同じ数値 v（または1問目の問題文の数値）から2問目を作る。
   two(v,o1) は {q:2問目の問い, ans:正解, wr:[誤答…], u:単位, d:小数の桁, str:1(文字の答え), calc:解説, l:指標} を返す（作れないときは null）。
   最後の一文が「なお、〜ものとする。」「ただし、〜ものとする。」の問題は、共通の文章と問いを分けられないので対象外。 */
(function(){
var S=window.SETS=window.SETS||{};
function pk(a){return a[Math.floor(Math.random()*a.length)];}
function r0(x){return Math.round(x+1e-9);}function r1(x){return Math.round(x*10+1e-9)/10;}
function isInt(x){return Math.abs(x-Math.round(x))<1e-9;}
function gcd(a,b){return b?gcd(b,a%b):a;}
function F(n,d){n=Math.round(n);d=Math.round(d);var g=gcd(Math.abs(n),Math.abs(d));n/=g;d/=g;return d===1?String(n):n+'/'+d;}
var PR1='（必要なときは、最後に小数第1位を四捨五入すること）',PR2='（必要なときは、最後に小数第2位を四捨五入すること）';
/* 2問目の数値の答え・誤答は、浮動小数の誤差を消して答えの桁にそろえる（誤答は正の値だけ使われる）。答えが0になる数値は作り直す */
function add(fd,l,id,two){S[fd]=S[fd]||{};(S[fd][l]=S[fd][l]||[]).push({id:'set-'+id,src:id,two:function(v,o){var r=two(v,o);if(!r||r.str)return r;
  var k=Math.pow(10,r.d||0);r.ans=Math.round(r.ans*1e6)/1e6;if(!(r.ans>0)||!isInt(r.ans*k))return null;r.wr=r.wr.map(function(x){return Math.round(x*k)/k;});return r;}});}
function book(fd,l,n,bks){S[fd]=S[fd]||{};(S[fd][l]=S[fd][l]||[]).push({id:'set-book-'+n,book:bks});}
/* 1問目の問題文に出てくる数値（出てくる順） */
function NU(q){return (String(q).replace(/<[^>]+>/g,'').match(/\d+(?:\.\d+)?/g)||[]).map(Number);}
/* 損益・利益か損失かで言い方を変える */
function PL(x){return x>=0?'利益':'損失';}

/* ===== 問題集の本物の組（最優先） ===== */
book('損益',4,148,['148-1','148-2']);book('損益',5,149,['149-1','149-2']);
book('単位あたりの大きさ',5,154,['154-1','154-2']);book('単位あたりの大きさ',5,155,['155-1','155-2']);
book('単位あたりの大きさ',5,156,['156-1','156-2']);book('単位あたりの大きさ',5,157,['157-1','157-2']);
book('単位あたりの大きさ',5,158,['158-1','158-2']);book('単位あたりの大きさ',5,159,['159-1','159-2']);
book('分割払い',4,160,['160-1','160-2']);book('精算',5,162,['162-1','162-2']);book('精算',5,164,['164-1','164-2']);

/* ======================= 損益 ======================= */
var SN='損益';
/* 定価の w2 割引きで売った場合の利益（1個） */
function waribiki(l,id,C,T,w){var c=[1,2,3,4,5].filter(function(k){var S2=T*(10-k)/10;return k!==w&&isInt(S2)&&S2>C;});if(!c.length)return null;var k=pk(c),S2=T*(10-k)/10,x=S2-C;
  return {q:'定価の'+k+'割引きで売った場合、利益は何円か。',ans:x,wr:[T-C,r0(T*k/10)-C>0?r0(T*k/10)-C:T*k/10,r0(C*k/10)],u:'円',l:l,calc:'定価 '+T+'<br>販売価格 '+T+' × '+(10-k)/10+' ＝ '+S2+'<br>利益 '+S2+' − '+C+' ＝ '+x};}
/* --- 指標3 --- */
add(SN,3,'g-損益3real0',function(v){return waribiki(3,0,v.C,v.T,v.w);});
add(SN,3,'g-損益3real1',function(v){var x=v.ans-v.C;return {q:'このとき、'+PL(x)+'は何円か。',ans:Math.abs(x),wr:[v.T-v.C,v.D,v.T-v.ans],u:'円',l:3,calc:'定価 '+v.C+' × '+v.T/v.C+' ＝ '+v.T+'<br>販売価格 '+v.T+' × '+v.rcw2+' ＝ '+v.ans+'<br>'+v.ans+' − '+v.C+' ＝ '+x+(x<0?'（損失 '+(-x)+'円）':'')};});
add(SN,3,'g-損益3real2',function(v){var x=r0(v.ans/v.t*100);return {q:'1個あたりの値引き額は、定価の何%か'+PR1+'。',ans:x,wr:[r0(v.ans/v.c*100),r0(v.q1/v.t*100),100-x],u:'%',l:3,calc:'値引き '+v.ans+'円（1問目）<br>'+v.ans+' ÷ '+v.t+' ≒ '+r0(v.ans/v.t*1000)/1000+' → '+x+'%'};});
add(SN,3,'g-損益3real3',function(v){var x=v.t*v.N-v.Cc;if(x===v.ans)return null;return {q:'残りの'+v.N2+'個も定価で売れた場合、利益は全部で何円か。',ans:x,wr:[v.ans,v.ans+v.d,v.t*v.N1-v.Cc>0?v.t*v.N1-v.Cc:v.D],u:'円',l:3,calc:'売上 '+v.t+' × '+v.N+' ＝ '+v.t*v.N+'<br>利益 '+v.t*v.N+' − '+v.Cc+' ＝ '+x};});
add(SN,3,'g-損益3real4',function(v){var x=v.t*v.N-v.Cc;return {q:'不良品がなく、すべて定価で売れた場合、利益は全部で何円か。',ans:x,wr:[v.P,v.TT,v.P+v.t],u:'円',l:3,calc:'仕入れ値の総額 '+v.ans+' × '+v.N+' ＝ '+v.Cc+'<br>売上 '+v.t+' × '+v.N+' ＝ '+v.TT+'<br>利益 '+v.TT+' − '+v.Cc+' ＝ '+x};});
add(SN,3,'g-損益3real5',function(v){var c=[5,10,15,20,25].filter(function(q){var y=v.T-v.C*(100+q)/100;return q!==v.pA&&isInt(y)&&y>0&&y!==v.D;});if(!c.length)return null;var q=pk(c),y=v.T-v.C*(100+q)/100;
  return {q:'利益を仕入れ値の'+q+'%にするには、定価から何円値引きして売ればよいか。',ans:y,wr:[v.C*q/100,v.T-v.C,v.T*q/100],u:'円',l:3,calc:'定価 '+v.C+' × '+(1+v.w/10)+' ＝ '+v.T+'<br>販売価格 '+v.C+' × '+(1+q/100)+' ＝ '+v.C*(100+q)/100+'<br>値引き '+v.T+' − '+v.C*(100+q)/100+' ＝ '+y};});
add(SN,3,'g-損益3real6',function(v){var x=r0((v.T-v.ans)/v.ans*100);return {q:'この商品を定価で売った場合、利益は仕入れ値の何%になるか'+PR1+'。',ans:x,wr:[r0((v.T-v.ans)/v.T*100),r0(v.Pr/v.ans*100),v.p],u:'%',l:3,calc:'仕入れ値 '+v.ans+'（1問目）<br>利益 '+v.T+' − '+v.ans+' ＝ '+(v.T-v.ans)+'<br>'+(v.T-v.ans)+' ÷ '+v.ans+' → '+x+'%'};});
add(SN,3,'g-損益3real7',function(v){return waribiki(3,0,v.C,v.T,v.w);});
add(SN,3,'g-損益3real8',function(v){var x=(v.t-v.c)*v.N;return {q:''+v.N+'個すべてが定価で売れた場合、利益は全部で何円か。',ans:x,wr:[v.ans,v.TT,(v.t-v.c)*v.N1],u:'円',l:3,calc:'1個の利益 '+v.t+' − '+v.c+' ＝ '+(v.t-v.c)+'<br>'+(v.t-v.c)+' × '+v.N+' ＝ '+x};});
add(SN,3,'g-損益3real9',function(v){var c=[1,2,3,4,5].filter(function(k){var y=(v.T*(10-k)/10-v.C)/v.C*100;return k!==v.wA&&isInt(y)&&y>0;});if(!c.length)return null;var k=pk(c),S2=v.T*(10-k)/10,y=r0((S2-v.C)/v.C*100);
  return {q:'定価の'+k+'割引きで売った場合、利益は仕入れ値の何%か。',ans:y,wr:[v.w*10-k*10>0?v.w*10-k*10:y+5,r0((S2-v.C)/S2*100),k*10],u:'%',l:3,calc:'定価 '+v.T+'<br>販売価格 '+v.T+' × '+(10-k)/10+' ＝ '+S2+'<br>利益 '+(S2-v.C)+' ÷ '+v.C+' ＝ '+y/100+' → '+y+'%'};});
/* --- 指標4 --- */
add(SN,4,'g-損益4real0',function(v){var x=r0(v.p/(100+v.p)*100);return {q:'利益も損失も出ないのは、定価の何%引きで売ったときか'+PR1+'。',ans:x,wr:[v.p,r0(100/(100+v.p)*100),v.w*10],u:'%',l:4,calc:'定価 '+v.C+' × '+v.rr+' ＝ '+v.T+'<br>値引き額 '+v.T+' − '+v.C+' ＝ '+(v.T-v.C)+'<br>'+(v.T-v.C)+' ÷ '+v.T+' → '+x+'%'};});
add(SN,4,'g-損益4real1',function(v){var x=r0(v.P/v.N/v.c*100);return {q:'1個あたりの利益は、仕入れ値の何%か'+PR1+'。',ans:x,wr:[r0(v.P/v.N/v.t*100),r0(v.ans/v.c*100),r0((v.t-v.c)/v.c*100)],u:'%',l:4,calc:'1個の利益 '+v.P+' ÷ '+v.N+' ＝ '+v.P/v.N+'<br>'+v.P/v.N+' ÷ '+v.c+' → '+x+'%'};});
add(SN,4,'g-損益4real2',function(v){var e=v.t-v.d-v.c,x=e*v.N2;return {q:'値引きして売った'+v.N2+'個の'+PL(x)+'は、全部で何円か。',ans:Math.abs(x),wr:[(v.t-v.c)*v.N2,v.d*v.N2,(v.t-v.c)*v.N1],u:'円',l:4,calc:'1個の販売価格 '+v.t+' − '+v.d+' ＝ '+(v.t-v.d)+'<br>1個の'+PL(x)+' '+Math.abs(e)+'<br>'+Math.abs(e)+' × '+v.N2+' ＝ '+Math.abs(x)};});
add(SN,4,'g-損益4real3',function(v){var c=[];for(var K2=10;K2<v.N;K2+=10){var x=v.t*(v.N-K2)-v.N*v.ans;if(K2!==v.K&&x>0)c.push(K2);}if(!c.length)return null;var K2=pk(c),x=v.t*(v.N-K2)-v.Cc;
  return {q:'不良品が'+K2+'個だった場合、利益は全部で何円になるか。',ans:x,wr:[v.P,v.t*(v.N-K2),v.P+(v.K-K2)*v.ans],u:'円',l:4,calc:'仕入れ値の総額 '+v.ans+' × '+v.N+' ＝ '+v.Cc+'<br>売上 '+v.t+' × '+(v.N-K2)+' ＝ '+v.t*(v.N-K2)+'<br>利益 '+v.t*(v.N-K2)+' − '+v.Cc+' ＝ '+x};});
add(SN,4,'g-損益4real4',function(v){return waribiki(4,0,v.C,v.T,v.w);});
add(SN,4,'g-損益4real5',function(v){var x=(v.t-v.c)*v.N;return {q:'残りの'+v.N2+'個も定価で売れた場合、利益は全部で何円か。',ans:x,wr:[v.ans,v.TT,(v.t-v.c)*v.N1],u:'円',l:4,calc:'定価 '+v.c+' × '+v.rr+' ＝ '+v.t+'<br>1個の利益 '+(v.t-v.c)+'<br>'+(v.t-v.c)+' × '+v.N+' ＝ '+x};});
add(SN,4,'g-損益4real6',function(v){var x=(v.ans-v.c)*v.N;return {q:'すべて定価で売れた場合、利益は全部で何円か。',ans:x,wr:[v.P,v.ans*v.N,v.P+v.d],u:'円',l:4,calc:'定価 '+v.ans+'（1問目）<br>1個の利益 '+v.ans+' − '+v.c+' ＝ '+(v.ans-v.c)+'<br>'+(v.ans-v.c)+' × '+v.N+' ＝ '+x};});
add(SN,4,'g-損益4real7',function(v){var x=(v.t-v.c)*v.N;return {q:'不良品がなく、すべて定価で売れた場合、利益は全部で何円か。',ans:x,wr:[v.P,v.TT,v.P+v.ans],u:'円',l:4,calc:'1個の利益 '+v.t+' − '+v.c+' ＝ '+(v.t-v.c)+'<br>'+(v.t-v.c)+' × '+v.N+' ＝ '+x};});
add(SN,4,'g-損益4real8',function(v){var y=(v.ans-v.C)/v.C*100;if(!isInt(y*10))return null;var x=r1(y);return {q:'利益は仕入れ値の何%か'+PR2+'。',ans:x,d:1,wr:[v.p-v.p2,r1((v.ans-v.C)/v.ans*100),v.p],u:'%',l:4,calc:'販売価格 '+v.ans+'（1問目）<br>利益 '+v.ans+' − '+v.C+' ＝ '+(v.ans-v.C)+'<br>'+(v.ans-v.C)+' ÷ '+v.C+' → '+x+'%'};});
add(SN,4,'g-損益4real9',function(v){var e=v.t/2-v.c,x=e*v.N2;if(!isInt(v.t/2))return null;return {q:'定価の半額で売った'+v.N2+'個の'+PL(x)+'は、全部で何円か。',ans:Math.abs(x),wr:[(v.t-v.c)*v.N2,v.t/2*v.N2,(v.t-v.c)*v.N1],u:'円',l:4,calc:'半額 '+v.t+' ÷ 2 ＝ '+v.t/2+'<br>1個の'+PL(x)+' '+Math.abs(e)+'<br>'+Math.abs(e)+' × '+v.N2+' ＝ '+Math.abs(x)};});
/* --- 指標5 --- */
add(SN,5,'g-損益5real0',function(v){var c=v.ans,t=c*v.rr,s=t*v.rdu,e=s-c,x=e*v.N2;if(!isInt(t)||!isInt(s))return null;return {q:'定価の'+v.w2+'割引きで売った'+v.N2+'個の'+PL(x)+'は、全部で何円か。',ans:Math.abs(x),wr:[(t-c)*v.N2,s*v.N2,(t-c)*v.N1],u:'円',l:5,calc:'仕入れ値 '+c+'（1問目）<br>定価 '+c+' × '+v.rr+' ＝ '+t+'<br>販売価格 '+t+' × '+v.rdu+' ＝ '+s+'<br>1個の'+PL(x)+' '+Math.abs(e)+' × '+v.N2+' ＝ '+Math.abs(x)};});
add(SN,5,'g-損益5real1',function(v){var h=v.B/2,c=[];for(var M=1;M<v.N;M++){var x=(v.t-v.c)*M+(h-v.c)*(v.N-M);if(M!==v.ans&&x>0&&M%5===0)c.push(M);}if(!c.length)return null;var M=pk(c),x=(v.t-v.c)*M+(h-v.c)*(v.N-M);
  return {q:'定価で売れたのが'+M+'個だった場合、利益は全部で何円になるか。',ans:x,wr:[v.P,(v.t-v.c)*M,v.t*M+h*(v.N-M)],u:'円',l:5,calc:'売上 '+v.t+' × '+M+' ＋ '+h+' × '+(v.N-M)+' ＝ '+(v.t*M+h*(v.N-M))+'<br>仕入れ '+v.c+' × '+v.N+' ＝ '+v.c*v.N+'<br>利益 '+x};});
add(SN,5,'g-損益5real2',function(v){var x=(v.t-v.c)*v.N;return {q:'すべて定価で売れた場合、利益は全部で何円か。',ans:x,wr:[v.P,v.TT,(v.t-v.c)*v.ans],u:'円',l:5,calc:'定価 '+v.c+' × '+v.rr+' ＝ '+v.t+'<br>1個の利益 '+(v.t-v.c)+' × '+v.N+' ＝ '+x};});
add(SN,5,'g-損益5real3',function(v){var x=r0((v.ans-v.C)/v.C*100);return {q:'この定価で売った場合、利益は仕入れ値の何%になるか'+PR1+'。',ans:x,wr:[v.p1+v.p2,r0((v.ans-v.C)/v.ans*100),v.p1],u:'%',l:5,calc:'定価 '+v.ans+'（1問目）<br>利益 '+v.ans+' − '+v.C+' ＝ '+(v.ans-v.C)+'<br>'+(v.ans-v.C)+' ÷ '+v.C+' → '+x+'%'};});
add(SN,5,'g-損益5real4',function(v){var x=r0((v.ans-v.C)/v.C*100);return {q:'定価で売ったときの利益は、仕入れ値の何%か'+PR1+'。',ans:x,wr:[r0((v.ans-v.C)/v.ans*100),r0((v.ans*(100-v.p)/100-v.C)/v.C*100),v.p],u:'%',l:5,calc:'定価 '+v.ans+'（1問目）<br>利益 '+v.ans+' − '+v.C+' ＝ '+(v.ans-v.C)+'<br>'+(v.ans-v.C)+' ÷ '+v.C+' → '+x+'%'};});
add(SN,5,'g-損益5real5',function(v){var x=v.ans*(100-v.p1)/100-v.P;if(!isInt(x)||x<=0)return null;return {q:'この商品の仕入れ値は何円か。',ans:x,wr:[v.ans*(100-v.p2)/100+v.L,v.ans*(100-v.p1)/100,v.ans-v.P],u:'円',l:5,calc:'定価 '+v.ans+'（1問目）<br>販売価格 '+v.ans+' × '+v.rcp1+' ＝ '+v.ans*(100-v.p1)/100+'<br>仕入れ値 '+v.ans*(100-v.p1)/100+' − '+v.P+' ＝ '+x};});
function markup(id){add(SN,5,id,function(v){var c=[5,10,15,20,25,30,35,40].filter(function(q){var y=(100+v.pA)*(100-q)/100-100;return q!==v.p1&&isInt(y)&&y>0&&y!==v.p;});if(!c.length)return null;var q=pk(c),y=(100+v.pA)*(100-q)/100-100;
  return {q:'定価の'+q+'%引きで売った場合、利益は仕入れ値の何%になるか。',ans:y,wr:[v.pA-q,v.p+v.p1-q,v.p],u:'%',l:5,calc:'仕入れ値を1とすると定価 '+(1+v.pA/100)+'（1問目）<br>販売価格 '+(1+v.pA/100)+' × '+(1-q/100)+' ＝ '+(1+y/100)+'<br>利益 '+(1+y/100)+' − 1 ＝ '+y/100+' → '+y+'%'};});}
markup('g-損益5real6');markup('g-損益5real7');
add(SN,5,'g-損益5real8',function(v){var x=(v.ans-v.c)*v.N;return {q:'すべて定価で売れた場合、利益は全部で何円か。',ans:x,wr:[v.P,v.ans*v.N,(v.ans-v.c)*v.N1],u:'円',l:5,calc:'定価 '+v.ans+'（1問目）<br>1個の利益 '+(v.ans-v.c)+' × '+v.N+' ＝ '+x};});
add(SN,5,'g-損益5real9',function(v){var x=(v.ans-v.c)*v.N;return {q:'不良品がなく、'+v.N+'個すべてが定価で売れた場合、利益は全部で何円か。',ans:x,wr:[v.P,v.ans*v.N,(v.ans-v.c)*(v.N-v.K)],u:'円',l:5,calc:'定価 '+v.ans+'（1問目）<br>1個の利益 '+(v.ans-v.c)+' × '+v.N+' ＝ '+x};});

/* ======================= 単位あたりの大きさ ======================= */
var TN='単位あたりの大きさ';
function fee3(v,n){return v.p*Math.min(n,v.t)+v.q*Math.max(0,Math.min(n,2*v.t)-v.t)+v.r*Math.max(0,n-2*v.t);}
/* --- 指標3 --- */
add(TN,3,'単位あたりの大きさ3real0-g',function(v){var u=v.p*(10-v.d)/10,c=[];for(var n=v.k+5;n<=v.k+40;n+=5)if(n!==v.n)c.push(n);var n=pk(c),X=v.p*v.k+u*(n-v.k);
  return {q:'別の団体が入館したところ、入館料の合計は'+X+'円であった。この団体は何人か。',ans:n,wr:[r0(X/v.p),Math.floor(X/u),n-v.k],u:'人',l:4,calc:''+v.k+'人までの分 '+v.p+' × '+v.k+' ＝ '+v.p*v.k+'<br>残り '+X+' − '+v.p*v.k+' ＝ '+(X-v.p*v.k)+'<br>'+(X-v.p*v.k)+' ÷ '+u+' ＝ '+(n-v.k)+'<br>'+v.k+' ＋ '+(n-v.k)+' ＝ '+n};});
add(TN,3,'単位あたりの大きさ3real1-g',function(v){var n=2*v.t+v.m,X=fee3(v,n),x=r0(X/n);return {q:''+n+'人の団体で入館したとき、1人あたりの入館料は平均何円か'+PR1+'。',ans:x,wr:[r0((v.p+v.q+v.r)/3),r0((v.q+v.r)/2),v.q],u:'円',l:3,calc:'合計 '+X+'円（1問目）<br>'+X+' ÷ '+n+' ≒ '+x};});
add(TN,3,'単位あたりの大きさ3real2-g',function(v){var c=[];for(var n=v.t+5;n<=3*v.t;n+=5)if(n!==2*v.t+v.m)c.push(n);var n=pk(c),X=fee3(v,n);
  return {q:'別の団体の入館料の合計は'+X+'円であった。この団体は何人か。',ans:n,wr:[r0(X/v.p),r0(X/v.q),Math.floor(X/v.r)],u:'人',l:4,calc:'1〜'+v.t+'人目 '+v.p+' × '+v.t+' ＝ '+v.p*v.t+'<br>'+(X>v.p*v.t+v.q*v.t?(v.t+1)+'〜'+2*v.t+'人目 '+v.q*v.t+'、残り '+(X-v.p*v.t-v.q*v.t)+' ÷ '+v.r+' ＝ '+(n-2*v.t)+'<br>'+2*v.t+' ＋ '+(n-2*v.t)+' ＝ '+n:'残り '+(X-v.p*v.t)+' ÷ '+v.q+' ＝ '+(n-v.t)+'<br>'+v.t+' ＋ '+(n-v.t)+' ＝ '+n)};});
function meat(l,id){add(TN,l,id,function(v){var c=[];for(var Z=v.q+10;Z<v.p;Z+=10){var y=v.x*(v.p-Z)/(Z-v.q);if(isInt(y/10)&&y>0&&y!==v.y)c.push(Z);}if(!c.length)return null;var Z=pk(c),y=v.x*(v.p-Z)/(Z-v.q);
  return {q:'牛肉'+v.x+'gに豚肉を混ぜて、100gあたり'+Z+'円の合いびき肉を作るには、豚肉を何g混ぜればよいか。',ans:y,wr:[v.y,r0(v.x*(Z-v.q)/(v.p-Z)),r0(v.x*v.p/Z)],u:'g',l:l+1,calc:'豚肉を x g とすると<br>'+v.p/100+' × '+v.x+' ＋ '+v.q/100+'x ＝ '+Z/100+'('+v.x+' ＋ x)<br>'+(Z-v.q)/100+'x ＝ '+r0((v.p-Z)*v.x)/100+' → x ＝ '+y};});}
meat(3,'単位あたりの大きさ3real3-g');
add(TN,3,'単位あたりの大きさ3real4-g',function(v,o){var n=NU(o.q),d1=n[0],s1=n[1],d2=n[2],s2=n[3],T=d1/s1+d2/s2,x=r1((d1+d2)/T);if(!isInt(T*60))return null;
  return {q:'駅から到着するまでの平均の速さは時速何kmか'+PR2+'。',ans:x,d:1,wr:[r1((s1+s2)/2),r1((d1+d2)/(T+0.5)),r1(d1+d2)],u:'km',l:4,calc:'時間 '+d1+' ÷ '+s1+' ＋ '+d2+' ÷ '+s2+' ＝ '+T*60+'分<br>'+(d1+d2)+' ÷ '+F(T*60,60)+' ≒ '+x};});
add(TN,3,'単位あたりの大きさ3real6-g',function(v){var N=v.s*v.d,c=[];for(var k=v.s*10;k<=v.s*80;k+=v.s*10)c.push(k);var k=pk(c),y=(N+k)/v.s;
  return {q:'この市の人口が'+k+'人増えた場合、人口密度は1km²あたり何人になるか。',ans:y,wr:[v.d+k,r0(N/(v.s+k/100)),v.d+k/100],u:'人',l:3,calc:'人口 '+v.s+' × '+v.d+' ＝ '+N+'<br>('+N+' ＋ '+k+') ÷ '+v.s+' ＝ '+y};});
add(TN,3,'単位あたりの大きさ3real7-g',function(v){var p=v.s/v.m*100,c=[];[5,8,10,12,15,16,20,25,30,40].forEach(function(t){if(t>p){var x=(t*v.m-100*v.s)/(100-t);if(isInt(x)&&x>0)c.push(t);}});if(!c.length)return null;var t=pk(c),x=(t*v.m-100*v.s)/(100-t);
  return {q:'この食塩水に食塩を加えて、濃度を'+t+'%にしたい。食塩を何g加えればよいか。',ans:x,wr:[v.m*t/100-v.s,r0(v.m*t/100),x+v.s],u:'g',l:4,calc:'加える食塩を x g とすると<br>'+v.s+' ＋ x ＝ '+t/100+'('+v.m+' ＋ x)<br>'+(100-t)/100+'x ＝ '+(t*v.m-100*v.s)/100+' → x ＝ '+x};});
add(TN,3,'単位あたりの大きさ3real8-g',function(v){var s=(v.a*v.x+v.b*v.y)/100,M=v.x+v.y,c=[];for(var w=50;w<=M/2;w+=50){var y=s/(M-w)*100;if(isInt(y*10))c.push(w);}if(!c.length)return null;var w=pk(c),y=r1(s/(M-w)*100);
  return {q:'できた食塩水から水を'+w+'g蒸発させると、濃度は何%になるか'+PR2+'。',ans:y,d:1,wr:[r1(s/(M+w)*100),r1(s/M*100),r1((v.a+v.b)/2)],u:'%',l:4,calc:'食塩 '+v.a*v.x/100+' ＋ '+v.b*v.y/100+' ＝ '+s+'<br>'+s+' ÷ ('+M+' − '+w+') ＝ '+y/100+' → '+y+'%'};});
add(TN,3,'単位あたりの大きさ3real9-g',function(v){var D=v.v*(v.h+v.mm/60),c=[3,4,5,6,8,10,12,15,18,20].filter(function(u){return u!==v.v&&isInt(D/u*60);});if(!c.length)return null;var u=pk(c),x=D/u*60;
  return {q:'同じ道のりを時速'+u+'kmで進むと、何分かかるか。',ans:x,wr:[r0(D*u),r0(v.v*(v.h*60+v.mm)/u/60*60)+10,v.h*60+v.mm],u:'分',l:3,calc:'道のり '+v.v+' × '+F(v.h*60+v.mm,60)+' ＝ '+r1(D*10)/10+'<br>'+r1(D*10)/10+' ÷ '+u+' × 60 ＝ '+x};});
/* --- 指標4 --- */
add(TN,4,'単位あたりの大きさ4real0-g',function(v){var n=2*v.t+v.m,X=fee3(v,n),x=r0(X/n);return {q:''+n+'人の団体で入館したとき、1人あたりの入館料は平均何円か'+PR1+'。',ans:x,wr:[r0((v.p+v.q+v.r)/3),r0((v.q+v.r)/2),v.q],u:'円',l:4,calc:'合計 '+X+'円（1問目）<br>'+X+' ÷ '+n+' ≒ '+x};});
add(TN,4,'単位あたりの大きさ4real1-g',function(v){var c=[];for(var n=v.k+5;n<=v.k+50;n+=5)if(n!==v.n)c.push(n);var n=pk(c),X=v.p*v.k+v.q*(n-v.k);
  return {q:'別の団体の入場料の合計は'+X+'円であった。この団体は何人か。',ans:n,wr:[r0(X/v.p),Math.floor(X/v.q),n-v.k],u:'人',l:4,calc:''+v.k+'人までの分 '+v.p+' × '+v.k+' ＝ '+v.p*v.k+'<br>('+X+' − '+v.p*v.k+') ÷ '+v.q+' ＝ '+(n-v.k)+'<br>'+v.k+' ＋ '+(n-v.k)+' ＝ '+n};});
meat(4,'単位あたりの大きさ4real2-g');
function salt(id){add(TN,4,id,function(v){var s=(v.a*v.x+v.b*v.y)/100,M=v.x+v.y,c=[];for(var w=50;w<=500;w+=50){var y=s/(M+w)*100;if(isInt(y*10))c.push(w);}if(!c.length)return null;var w=pk(c),y=r1(s/(M+w)*100);
  return {q:'できた食塩水に水を'+w+'g加えると、濃度は何%になるか'+PR2+'。',ans:y,d:1,wr:[r1(s/M*100),r1(s/(M-w>0?M-w:M/2)*100),r1((v.a+v.b)/2)],u:'%',l:4,calc:'食塩 '+v.a*v.x/100+' ＋ '+v.b*v.y/100+' ＝ '+s+'<br>'+s+' ÷ ('+M+' ＋ '+w+') ＝ '+r1(y*10)/1000+' → '+y+'%'};});}
salt('単位あたりの大きさ4real4-g');salt('単位あたりの大きさ4real9-g');
add(TN,4,'単位あたりの大きさ4real5-g',function(v){var t=v.D/(v.a+v.b),x=v.a*t;if(!isInt(x))return null;return {q:'2人が出会う地点は、Aが歩き始めた地点から何m離れているか。',ans:x,wr:[v.b*t,v.D/2,v.D-v.a],u:'m',l:4,calc:'出会うまで '+v.D+' ÷ ('+v.a+' ＋ '+v.b+') ＝ '+t+'分<br>'+v.a+' × '+t+' ＝ '+x};});
add(TN,4,'単位あたりの大きさ4real6-g',function(v){var c=[];[5,8,10,12,15,20,25,28,30].forEach(function(z){[50,55,60,62,65,68,70,75,80].forEach(function(s){var y=(v.x*v.p+v.y*v.q+z*s)/(v.x+v.y+z);if(isInt(y))c.push([z,s]);});});if(!c.length)return null;var w=pk(c),z=w[0],s=w[1],y=(v.x*v.p+v.y*v.q+z*s)/(v.x+v.y+z);
  return {q:'さらに、平均点が'+s+'点のC組'+z+'人を加えると、3組を合わせた'+(v.x+v.y+z)+'人の平均点は何点になるか。',ans:y,wr:[r0((v.p+v.q+s)/3),r0(((v.x*v.p+v.y*v.q)/(v.x+v.y)+s)/2),y+1],u:'点',l:4,calc:'合計点 '+v.x*v.p+' ＋ '+v.y*v.q+' ＋ '+z*s+' ＝ '+(v.x*v.p+v.y*v.q+z*s)+'<br>÷ '+(v.x+v.y+z)+' ＝ '+y};});
add(TN,4,'単位あたりの大きさ4real7-g',function(v){var T=v.h+v.mm/60,x=(v.a+v.b)*T;if(!isInt(x*10))return null;return {q:'AとBが同じ地点から反対方向に同時に出発した場合、出発してから'+v.h+'時間'+v.mm+'分後にAとBは何km離れているか。',ans:r1(x),d:isInt(x)?0:1,wr:[r1((v.a-v.b)*T),r1((v.a+v.b)*v.h),r1(v.a*T)],u:'km',l:4,calc:'離れる速さ '+v.a+' ＋ '+v.b+' ＝ '+(v.a+v.b)+'<br>'+(v.a+v.b)+' × '+T+' ＝ '+r1(x)};});
/* --- 指標5 --- */
add(TN,5,'単位あたりの大きさ5real0-g',function(v){var c=[];for(var n=10;n<=50;n+=2)for(var x=2;x<n;x++)if(n!==v.n&&n-x!==x)c.push([n,x]);var w=pk(c),n=w[0],x=w[1],X=v.p*(n-x)+v.q*x;
  return {q:'別の日に、一般と学生を合わせて'+n+'人で入場したところ、入場料の合計は'+X+'円であった。この日に入場した一般は何人か。',ans:n-x,wr:[x,r0(X/v.p),Math.floor(n/2)],u:'人',l:5,calc:'全員が一般なら '+v.p+' × '+n+' ＝ '+v.p*n+'<br>差 '+(v.p*n-X)+' ÷ '+(v.p-v.q)+' ＝ '+x+'（学生）<br>一般 '+n+' − '+x+' ＝ '+(n-x)};});
add(TN,5,'単位あたりの大きさ5real1-g',function(v){var L=v.a*v.b/gcd(v.a,v.b),c=[1,2,3,4,5].map(function(k){return L*k;}).filter(function(D){return D>=600&&D<=4800;});if(!c.length)return null;var D=pk(c),x=D/v.a+D/v.b;
  return {q:'家から図書館までの道のりが'+D+'mのとき、往復にかかった時間は何分か。',ans:x,wr:[D/v.a,r0(2*D/v.b),r0(2*D/((v.a+v.b)/2))===x?x+5:r0(2*D/((v.a+v.b)/2))],u:'分',l:4,calc:'行き '+D+' ÷ '+v.a+' ＝ '+D/v.a+'<br>帰り '+D+' ÷ '+v.b+' ＝ '+D/v.b+'<br>'+D/v.a+' ＋ '+D/v.b+' ＝ '+x};});
add(TN,5,'単位あたりの大きさ5real2-g',function(v){if(v.a===v.b)return null;var x=v.D/Math.abs(v.a-v.b);if(!isInt(x))return null;var A=v.a>v.b?'A':'B',B=v.a>v.b?'B':'A';
  return {q:'AとBが同じ地点から同じ方向に同時に歩き始めた場合、'+A+'が'+B+'に初めて追いつくのは歩き始めてから何分後か。',ans:x,wr:[v.D/(v.a+v.b),2*v.D/(v.a+v.b),2*x],u:'分後',l:5,calc:'差の速さ '+Math.abs(v.a-v.b)+'<br>1周 '+v.D+' ÷ '+Math.abs(v.a-v.b)+' ＝ '+x};});
add(TN,5,'単位あたりの大きさ5real3-g',function(v){var x=v.D/(v.a+v.b)*60;if(!isInt(x))return null;return {q:'AとBが同じ地点から反対方向に同時に走り始めた場合、2人が初めて出会うのは走り始めてから何分後か。',ans:x,wr:[r0(v.D/(v.a-v.b)*60),2*x,r0(v.D/v.a*60)],u:'分後',l:5,calc:'近づく速さ '+v.a+' ＋ '+v.b+' ＝ '+(v.a+v.b)+'<br>'+v.D+' ÷ '+(v.a+v.b)+' × 60 ＝ '+x};});
add(TN,5,'単位あたりの大きさ5real6-g',function(v){var c=[];for(var t=1;t<v.a;t++){var y=t+(1-t/v.a)/(1/v.a-1/v.b);if(isInt(y*1e6)&&Math.abs(y-Math.round(y))<1e-6)c.push(t);}if(!c.length)return null;var t=pk(c),y=r0(t+(1-t/v.a)/(1/v.a-1/v.b));
  return {q:'空の水槽に、はじめの'+t+'分間は給水管Pだけで水を入れ、そのあとは排水管Qも同時に使った。満水になるのは、水を入れ始めてから何分後か。',ans:y,wr:[r0(v.a*v.b/(v.b-v.a)),y-t,r0(v.a*v.b/(v.b-v.a))+t===y?y+t:r0(v.a*v.b/(v.b-v.a))+t],u:'分後',l:5,calc:''+t+'分で 1/'+v.a+' × '+t+' ＝ '+F(t,v.a)+'<br>残り '+F(v.a-t,v.a)+' を 1分に 1/'+v.a+' − 1/'+v.b+' ＝ '+F(v.b-v.a,v.a*v.b)+' ずつ<br>'+F(v.a-t,v.a)+' ÷ '+F(v.b-v.a,v.a*v.b)+' ＝ '+(y-t)+'<br>'+t+' ＋ '+(y-t)+' ＝ '+y};});
add(TN,5,'単位あたりの大きさ5real7-g',function(v,o){var n=NU(o.q),b=n[1],y=(v.k*v.a+b)/(v.k+2)*1;if(!isInt(y*10))return null;y=r1(y);
  return {q:'食塩水Pと食塩水Qを混ぜたものに、食塩水Qと同じ重さの水を加えると、濃度は何%になるか'+PR2+'。',ans:y,d:1,wr:[r1((v.k*v.a+b)/(v.k+1)),r1((v.a+b)/3),r1((v.k*v.a+b)/(v.k+3))],u:'%',l:5,calc:'Qの重さを1とすると、食塩 '+v.a/100+' × '+v.k+' ＋ '+b/100+' ＝ '+(v.k*v.a+b)/100+'<br>重さ '+v.k+' ＋ 1 ＋ 1 ＝ '+(v.k+2)+'<br>'+(v.k*v.a+b)/100+' ÷ '+(v.k+2)+' → '+y+'%'};});
add(TN,5,'単位あたりの大きさ5real8-g',function(v){var y=r1((v.k*v.a+v.m*v.b+v.c)/(v.k+v.m+1));
  return {q:'食塩水X、Y、Zをすべて混ぜると、濃度は何%になるか'+PR2+'。',ans:y,d:1,wr:[r1((v.a+v.b+v.c)/3),r1((v.k*v.a+v.m*v.b)/(v.k+v.m)),r1((v.k*v.a+v.m*v.b+v.c)/(v.k+v.m))],u:'%',l:5,calc:'Zの重さを1とすると、食塩 '+v.a/100+' × '+v.k+' ＋ '+v.b/100+' × '+v.m+' ＋ '+v.c/100+' ＝ '+r1((v.k*v.a+v.m*v.b+v.c)*10)/1000+'<br>重さ '+v.k+' ＋ '+v.m+' ＋ 1 ＝ '+(v.k+v.m+1)+'<br>→ '+y+'%'};});
add(TN,5,'単位あたりの大きさ5real9-g',function(v){var X=v.p*v.k+v.q*(v.x-v.k),y=r0(X/v.x);return {q:'この団体の1人あたりの入場料は平均何円か'+PR1+'。',ans:y,wr:[r0((v.p+v.q)/2),v.q,r0(X/v.k)>v.p?v.p:r0(X/v.k)],u:'円',l:4,calc:'人数 '+v.x+'人（1問目）<br>'+X+' ÷ '+v.x+' ≒ '+y};});

/* ======================= 精算 ======================= */
var SE='精算';
/* --- 指標3 --- */
add(SE,3,'精算3real0-g',function(v){var s=(v.a+v.b+v.c)/3,x=s-v.c;if(x<=0||!isInt(s))return null;return {q:'CはAに何円支払えばよいか。',ans:x,wr:[s-v.b,v.a-s,s],u:'円',l:3,calc:'1人の負担 ('+v.a+' ＋ '+v.b+' ＋ '+v.c+') ÷ 3 ＝ '+s+'<br>'+s+' − '+v.c+' ＝ '+x};});
add(SE,3,'精算3real1-g',function(v){var c=[900,1200,1500,1800,2400,3000].filter(function(X){return X!==3*v.b;});var X=pk(c),x=X/3;
  return {q:'その後、Cがさらに飲み物代'+X+'円を支払った。これも3人で同じ額ずつ負担するとき、AはCに何円支払えばよいか。',ans:x,wr:[v.b+x,X/2,v.b],u:'円',l:4,calc:'合計 '+6*v.b+' ＋ '+X+' ＝ '+(6*v.b+X)+'<br>1人の負担 '+(6*v.b+X)/3+'<br>A '+(6*v.b+X)/3+' − '+2*v.b+' ＝ '+x};});
add(SE,3,'精算3real2-g',function(v){var T=v.p+v.q+v.r,s=T/4,x=v.q-s;if(!isInt(s)||x===0)return null;return {q:x>0?'精算で、Qが受け取る金額は何円か。':'QはPに何円支払えばよいか。',ans:Math.abs(x),wr:[s,Math.abs(v.q-T/3)>0?r0(Math.abs(v.q-T/3)):s+100,Math.abs(s-v.r)],u:'円',l:3,calc:'合計 '+T+'、QとRの負担 '+T+' ÷ 2 ÷ 2 ＝ '+s+'<br>Q '+v.q+' − '+s+' ＝ '+x};});
add(SE,3,'精算3real3-g',function(v){var s=(v.a+v.b+v.c)/3,x=s-v.b;if(x<=0||!isInt(s))return null;return {q:'BはAに何円支払えばよいか。',ans:x,wr:[s-v.c,v.a-s,s],u:'円',l:3,calc:'1人の負担 ('+v.a+' ＋ '+v.b+' ＋ '+v.c+') ÷ 3 ＝ '+s+'<br>'+s+' − '+v.b+' ＝ '+x};});
add(SE,3,'精算3real4-g',function(v){var s=(v.a+v.b+v.c)/4,x=v.a-s;if(!isInt(s))return null;return {q:'精算で、Aが受け取る金額は何円か。',ans:x,wr:[s,r0(v.a-(v.a+v.b+v.c)/3),v.b-s>0?v.b-s:s-v.c],u:'円',l:3,calc:'1人の負担 '+(v.a+v.b+v.c)+' ÷ 4 ＝ '+s+'<br>'+v.a+' − '+s+' ＝ '+x};});
add(SE,3,'精算3real5-g',function(v,o){var A=(v.x+v.y+v.b)/2-v.b,c=[];for(var X=200;X<2*A;X+=200)c.push(X);if(!c.length)return null;var X=pk(c),x=A-X/2;
  return {q:'その後、4回目の代金'+X+'円をBが支払った。これも2人で同じ額ずつ負担するとき、BはAに何円支払えばよいか。',ans:x,wr:[A,A-X,A+X/2],u:'円',l:4,calc:'合計 '+(v.x+v.y+v.b+X)+' ÷ 2 ＝ '+(v.x+v.y+v.b+X)/2+'<br>Bの支払い '+(v.b+X)+'<br>'+(v.x+v.y+v.b+X)/2+' − '+(v.b+X)+' ＝ '+x};});
add(SE,3,'精算3real6-g',function(v){var s=(v.p+v.q+v.r)/3,x=s-v.q;if(!isInt(s)||x<=0)return null;return {q:'QはPに何円支払えばよいか。',ans:x,wr:[s-v.r,v.p-s,s],u:'円',l:3,calc:'1人の負担 '+(v.p+v.q+v.r)+' ÷ 3 ＝ '+s+'<br>'+s+' − '+v.q+' ＝ '+x};});
add(SE,3,'精算3real7-g',function(v,o){var n=NU(o.q),A=n[1],B=n[2],x=(A+B)/2-A;if(x===0)return null;return {q:'費用を2人で同じ額ずつ負担した場合、'+(x>0?'AはBに':'BはAに')+'何円支払えばよいか。',ans:Math.abs(x),wr:[(A+B)/2,Math.abs(B-A),r0((A+B)*v.r1/(v.r1+v.r2))-A>0?r0((A+B)*v.r1/(v.r1+v.r2))-A:A],u:'円',l:3,calc:'1人の負担 ('+A+' ＋ '+B+') ÷ 2 ＝ '+(A+B)/2+'<br>'+(A+B)/2+' − '+A+' ＝ '+x};});
add(SE,3,'精算3real9-g',function(v){var x=v.c;return {q:'精算で、Bが受け取る金額は何円か。',ans:x,wr:[1.5*v.c,2.5*v.c,0.5*v.c],u:'円',l:3,calc:'合計 '+7.5*v.c+' ÷ 5 ＝ '+1.5*v.c+'<br>B '+2.5*v.c+' − '+1.5*v.c+' ＝ '+x};});
/* --- 指標4 --- */
add(SE,4,'精算4real0-g',function(v){var s=(v.a+v.b)/3,x=s-v.b;if(!isInt(s)||x<=0)return null;return {q:'BはAに何円支払えばよいか。',ans:x,wr:[s,s+v.L,v.a-s],u:'円',l:4,calc:'1人の負担 ('+v.a+' ＋ '+v.b+') ÷ 3 ＝ '+s+'<br>'+s+' − '+v.b+' ＝ '+x};});
add(SE,4,'精算4real1-g',function(v){var x=v.b;return {q:'CはAに何円支払えばよいか。',ans:x,wr:[x+v.v,4*v.b/3>0?r0(4*v.b/3):x+100,2*v.b],u:'円',l:4,calc:'1人の負担 ('+3*v.b+' ＋ '+v.b+') ÷ 4 ＝ '+v.b+'<br>Cは何も払っていないので '+x};});
add(SE,4,'精算4real2-g',function(v){var x=v.L/2;return {q:'精算で、Bが支払う金額は合計で何円か。',ans:x,wr:[v.L/4,v.L*3/4,r0(v.L*7/12)],u:'円',l:4,calc:'昼食 '+v.L+' ÷ 4 ＝ '+v.L/4+'<br>チケット '+v.L*3/4+' ÷ 3 ＝ '+v.L/4+'<br>'+v.L/4+' ＋ '+v.L/4+' ＝ '+x};});
add(SE,4,'精算4real3-g',function(v){var x=v.b;return {q:'CはAに何円支払えばよいか。',ans:x,wr:[v.b*1.5,v.b/2,v.b*4.5/3],u:'円',l:4,calc:'合計 '+4.5*v.b+' × 2/9 ＝ '+v.b+'<br>Cは何も払っていないので '+x};});
add(SE,4,'精算4real4-g',function(v){var h=(v.a-v.b)/2;if(h<=0)return null;var ans='BがAに'+h+'円',w=['AがBに'+h+'円','BがAに'+(v.a-v.b)+'円','BがAに'+(h+v.L)+'円','AがBに'+(v.L-h)+'円'];
  if(w.indexOf(ans)>=0)return null;return {q:'貸し借りがなかった場合、どちらがどちらに何円支払えばよいか。',ans:ans,str:1,wr:w,u:'',l:4,calc:'1人の負担 ('+v.a+' ＋ '+v.b+') ÷ 2 ＝ '+(v.a+v.b)/2+'<br>B '+(v.a+v.b)/2+' − '+v.b+' ＝ '+h+' → BがAに'+h+'円'};});
add(SE,4,'精算4real5-g',function(v){var x=v.T/7;return {q:'CはAに何円支払えばよいか。',ans:x,wr:[v.T*2/7,v.T/5,v.T/10],u:'円',l:4,calc:'先輩を2、後輩を1とすると 合計 2 × 2 ＋ 1 × 3 ＝ 7<br>後輩 '+v.T+' × 1/7 ＝ '+x};});
add(SE,4,'精算4real6-g',function(v){var s=(v.a+v.b+v.c)/3,x=v.a-s;if(!isInt(s))return null;return {q:'精算で、Aが受け取る金額は何円か。',ans:x,wr:[s,x+v.v,v.a-(v.a+v.b+v.c+v.v)/3>0?r0(v.a-(v.a+v.b+v.c+v.v)/3):s-v.b],u:'円',l:4,calc:'1人の負担 '+(v.a+v.b+v.c)+' ÷ 3 ＝ '+s+'<br>'+v.a+' − '+s+' ＝ '+x};});
add(SE,4,'精算4real7-g',function(v){var x=v.M/2;return {q:'CはAに何円支払えばよいか。',ans:x,wr:[v.L/3,v.L/3+v.M/2,v.M/3],u:'円',l:4,calc:'入館料 '+v.M+' ÷ 2 ＝ '+x};});
add(SE,4,'精算4real8-g',function(v){var x=v.T*v.r2/(v.r1+v.r2);return {q:'貸し借りがなかった場合、BはAに何円支払えばよいか。',ans:x,wr:[v.T*v.r1/(v.r1+v.r2),x+v.L,v.T/2],u:'円',l:4,calc:''+v.T+' × '+v.r2+'/'+(v.r1+v.r2)+' ＝ '+x};});
add(SE,4,'精算4real9-g',function(v){var s=(v.a+v.b+v.c)/4,x=v.a-s;if(!isInt(s))return null;return {q:'精算で、Aが受け取る金額は何円か。',ans:x,wr:[s,x+v.L,v.a-(v.a+v.b+v.c)/3>0?r0(v.a-(v.a+v.b+v.c)/3):s-v.c],u:'円',l:4,calc:'1人の負担 '+(v.a+v.b+v.c)+' ÷ 4 ＝ '+s+'<br>'+v.a+' − '+s+' ＝ '+x};});
/* --- 指標5 --- */
add(SE,5,'精算5real0-g',function(v){var s=(v.p+v.q)/3,x=v.p-s+v.L;if(!isInt(s))return null;return {q:'RはPに何円支払えばよいか。',ans:x,wr:[v.p-s,s,s+v.L],u:'円',l:5,calc:'1人の負担 ('+v.p+' ＋ '+v.q+') ÷ 3 ＝ '+s+'<br>Pの払いすぎ '+v.p+' − '+s+' ＝ '+(v.p-s)+'<br>借金 '+v.L+' も足して '+x};});
add(SE,5,'精算5real1-g',function(v){var s=(v.a+v.b)/4,x=v.a-s;if(!isInt(s))return null;return {q:'Aが受け取る金額は何円か。',ans:x,wr:[s,v.a-(v.a+v.b)/3>0?r0(v.a-(v.a+v.b)/3):s+v.L,x-v.L],u:'円',l:5,calc:'1人の負担 ('+v.a+' ＋ '+v.b+') ÷ 4 ＝ '+s+'<br>'+v.a+' − '+s+' ＝ '+x};});
add(SE,5,'精算5real2-g',function(v){var x=v.T/3-v.L;return {q:'AはBに何円支払えばよいか。',ans:x,wr:[v.T/3,v.T/3+v.L,v.T*2/3-v.L],u:'円',l:5,calc:'1人の負担 '+v.T+' ÷ 3 ＝ '+v.T/3+'<br>AはCから '+v.L+' 返してもらう分を引いて '+v.T/3+' − '+v.L+' ＝ '+x};});
add(SE,5,'精算5real3-g',function(v){var x=v.s-v.L2;return {q:'Yが支払う金額は何円か。',ans:x,wr:[v.s,v.s+v.L2,v.s-v.L1],u:'円',l:5,calc:'1人の負担 '+3*v.s+' ÷ 3 ＝ '+v.s+'<br>YはZに '+v.L2+' 貸しているので '+v.s+' − '+v.L2+' ＝ '+x};});
add(SE,5,'精算5real4-g',function(v){var s=v.pp+v.pq-v.L,x=2*v.pp+v.pq-2*v.L;return {q:'Pが支払った金額は何円か。',ans:x,wr:[s,s+v.pp,x+v.L],u:'円',l:5,calc:'1人の負担 '+v.pp+' ＋ '+v.pq+' − '+v.L+' ＝ '+s+'<br>Pが払いすぎた分 '+v.pp+' − '+v.L+' ＝ '+(v.pp-v.L)+'<br>'+s+' ＋ '+(v.pp-v.L)+' ＝ '+x};});
add(SE,5,'精算5real5-g',function(v){var x=v.T/5-v.L;return {q:'CはAに何円支払えばよいか。',ans:x,wr:[v.T/5,v.T/5+v.L,r0(v.T/3-v.L)],u:'円',l:5,calc:'Cの負担 '+v.T+' × 1/5 ＝ '+v.T/5+'<br>CはBに '+v.L+' 貸しているので '+v.T/5+' − '+v.L+' ＝ '+x};});
add(SE,5,'精算5real6-g',function(v,o){var n=NU(o.q),L=n[2],h=(v.a-v.b)/2,x=L-h;if(x===0)return null;var ans=(x>0?'SがTに':'TがSに')+Math.abs(x)+'円',w=['TがSに'+v.w+'円','SがTに'+L+'円','TがSに'+h+'円','SがTに'+(L+h)+'円'].filter(function(s){return s!==ans;});
  return {q:'正しく精算するには、どちらがどちらに何円支払えばよいか。',ans:ans,str:1,wr:w,u:'',l:5,calc:'1人の負担 ('+v.a+' ＋ '+v.b+') ÷ 2 ＝ '+(v.a+v.b)/2+' → TはSに '+h+'<br>SはTに借金 '+L+'<br>'+L+' − '+h+' ＝ '+x+' → '+ans};});
add(SE,5,'精算5real7-g',function(v){var x=v.T/4+v.L2;return {q:'Dが支払う金額は何円か。',ans:x,wr:[v.T/4,v.T/4-v.L2,v.T/4+v.L1],u:'円',l:5,calc:'1人の負担 '+v.T+' ÷ 4 ＝ '+v.T/4+'<br>DはBに借金 '+v.L2+'<br>'+v.T/4+' ＋ '+v.L2+' ＝ '+x};});
add(SE,5,'精算5real8-g',function(v){var x=v.a-v.T/3;return {q:'BはAに何円支払えばよいか。',ans:x,wr:[v.T/3,v.T-v.a-v.T/3,v.a],u:'円',l:5,calc:'1人の負担 '+v.T+' ÷ 3 ＝ '+v.T/3+'<br>A '+v.a+' − '+v.T/3+' ＝ '+x};});
add(SE,5,'精算5real9-g',function(v,o){var n=NU(o.q),L=n[n.length-2],x=2*v.s-L;if(x<=0)return null;return {q:'Bが支払った費用は何円か。',ans:x,wr:[v.s,v.s+L,3*v.s-x+v.d===x?x+1000:v.s+v.d],u:'円',l:5,calc:'1人の負担 '+3*v.s+' ÷ 3 ＝ '+v.s+'<br>Aの支払い '+v.s+' ＋ '+L+' ＝ '+(v.s+L)+'<br>B '+3*v.s+' − '+(v.s+L)+' ＝ '+x};});

/* ======================= 分割払い ======================= */
var BK='分割払い';
function feeQ(l,id,frac){add(BK,l,id,function(v,o){var n=NU(o.q),a=v.a,f=v.f,R=(a-1)/a,ans=F(a-1,a*f);
  var w=[F(1,f),F(1,a*f),F((a-1)*(f+1),a*f)].filter(function(x){return x!==ans;});
  return {q:'手数料は購入価格のどれだけにあたるか。',ans:ans,str:1,wr:w.concat([F(a-1,a*(f+1))]),u:'',l:l,calc:'残額 1 − 1/'+a+' ＝ '+F(a-1,a)+'<br>手数料 '+F(a-1,a)+' × 1/'+f+' ＝ '+ans};});}
feeQ(4,'分割払い4real2-g');feeQ(4,'分割払い4real3-g');
add(BK,4,'分割払い4real6-g',function(v,o){var n=NU(o.q),k=n[3],R=v.P-v.P/v.a,x=v.P/v.a+R*(v.f+1)/v.f;if(!isInt(x))return null;
  return {q:'支払総額は何円か。',ans:x,wr:[v.P,R*(v.f+1)/v.f,v.P+v.P/v.f],u:'円',l:4,calc:'頭金 '+v.P+' × 1/'+v.a+' ＝ '+v.P/v.a+'<br>残額＋手数料 '+R+' × '+F(v.f+1,v.f)+' ＝ '+R*(v.f+1)/v.f+'<br>'+v.P/v.a+' ＋ '+R*(v.f+1)/v.f+' ＝ '+x};});
add(BK,4,'分割払い4real7-g',function(v,o){var n=NU(o.q),k=n[0],ans=F(k*v.f,v.D*(v.f+1)),fee=F(k,v.D*(v.f+1));
  var w=[F(k,v.D),F(k*v.f,v.D*(v.f+1))===fee?F(1,v.D):F(1,v.f),F(k,v.D*v.f)].filter(function(x){return x!==fee;});
  return {q:'1回の支払額を購入価格の1/'+v.D+'にするとき、手数料は購入価格のどれだけにあたるか。',ans:fee,str:1,wr:w.concat([ans]),u:'',l:4,calc:'残額＋手数料 1/'+v.D+' × '+k+' ＝ '+F(k,v.D)+'<br>残額 '+F(k,v.D)+' ÷ '+F(v.f+1,v.f)+' ＝ '+ans+'<br>手数料 '+ans+' × 1/'+v.f+' ＝ '+fee};});
})();
