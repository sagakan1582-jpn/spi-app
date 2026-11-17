/* 本番形式（2タブの組問）：割合。
   1問目は実践の問題（src のテンプレート）をそのまま使い、同じ数値 v から2問目を作る。
   two(v,o1) は {q:2問目の問い, ans:正解, wr:[誤答…], u:単位, d:小数の桁, calc:解説, l:指標} を返す（作れないときは null）。
   2問目の作り方の型：①逆算 ②条件を足してx ③対象を変える ④続きの場面。 */
(function(){
var S=window.SETS=window.SETS||{};S['割合']=S['割合']||{};
function pk(a){return a[Math.floor(Math.random()*a.length)];}
function r0(x){return Math.round(x+1e-9);}function r1(x){return Math.round(x*10+1e-9)/10;}
function isInt(x){return Math.abs(x-Math.round(x))<1e-9;}
var PR1='（必要なときは、最後に小数点以下第1位を四捨五入すること）',PR2='（必要なときは、最後に小数点以下第2位を四捨五入すること）';
function gcd(a,b){return b?gcd(b,a%b):a;}
function fr(n,d){var g=gcd(n,d);return [n/g,d/g];}
function add(l,id,two){(S['割合'][l]=S['割合'][l]||[]).push({id:'set-'+id,src:id,two:two});}
/* ===== 指標3 ===== */
add(3,'g-割合3real0',function(v){var c=[5,10,12,15,20,30].filter(function(r){return r!==v.p1&&r!==v.p2&&v.p1+v.p2+r<100&&isInt(v.W*r/100);});if(!c.length)return null;var r=pk(c),X=v.W*r/100;
  return {q:'丙小学校の出身者は'+X+'人である。丙小学校の出身者は全校生徒の何%か。',ans:r,wr:[r0(X/v.P*100),r*2,r+v.p2],u:'%',l:3,calc:'全校生徒 '+v.P+' ÷ '+v.p1/100+' ＝ '+v.W+'<br>'+X+' ÷ '+v.W+' ＝ '+r/100+' → '+r+'%'};});
add(3,'g-割合3real1',function(v){var R=v.W*(100-v.p)/100,c=[10,20,25,30,40,50].filter(function(t){return t<100-v.p&&isInt(v.W*t/100);});if(!c.length)return null;var t=pk(c),D=R-v.W*t/100;
  return {q:'翌日、残っている商品のうち何個かを出荷したところ、倉庫に残っている商品は最初の商品の'+t+'%になった。翌日に出荷した商品は何個か。',ans:D,wr:[v.W*t/100,r0(R*t/100),v.W-v.W*t/100],u:'個',l:3,calc:'1日目の残り '+v.W+' × '+(100-v.p)/100+' ＝ '+R+'<br>翌日の残り '+v.W+' × '+t/100+' ＝ '+v.W*t/100+'<br>'+R+' − '+v.W*t/100+' ＝ '+D};});
add(3,'g-割合3real2',function(v){if(v.p1===v.p2)return null;var d=Math.abs(v.p1-v.p2),x=v.W*d/100;if(!isInt(x))return null;
  return {q:'「はい」と答えた人と「いいえ」と答えた人の人数の差は何人か。',ans:x,wr:[v.W*(v.p1+v.p2)/100,v.W*v.p1/100,v.W*v.p2/100],u:'人',l:3,calc:v.W+' × ('+v.p1+'% − '+v.p2+'%) ＝ '+v.W+' × '+d/100+' ＝ '+x};});
add(3,'g-割合3real3',function(v){var x=r1(v.Q/v.P);
  return {q:'本を借りなかった人は、本を借りた人の何倍か'+PR2+'。',ans:x,d:1,wr:[r1(v.P/v.Q),r1(v.Q/v.W*10)/10+1,r1(v.W/v.P)],u:'倍',l:3,calc:'借りなかった人 '+v.W+' − '+v.P+' ＝ '+v.Q+'<br>'+v.Q+' ÷ '+v.P+' ≒ '+x};});
function addTo(l,id,word,whole){add(l,id,function(v){var N=v[whole],p=v.p,c=[];for(var t=p+5;t<100;t+=5){var x=N*(t-p)/(100-t);if(isInt(x)&&x>0&&x<N)c.push(t);}if(!c.length)return null;var t=pk(c),x=N*(t-p)/(100-t);
  return {q:'正社員の割合を'+word+'の'+t+'%にするには、正社員だけを今より何人増やせばよいか。',ans:x,wr:[N*(t-p)/100,r0(N*t/100),x+N*(t-p)/100],u:'人',l:4,
    calc:'増やす人数を x 人とすると<br>'+N*p/100+' ＋ x ＝ ('+N+' ＋ x) × '+t/100+'<br>x ＝ '+x};});}
addTo(3,'g-割合3real4','社員全体','W');
add(3,'g-割合3real5',function(v){var c=[];[2,2.5,4,5,8].forEach(function(t){[12,15,18,20,24,30].forEach(function(n){var N=n*100/t;if(isInt(N)&&N!==v.W)c.push([t,n]);});});var z=pk(c),t=z[0],n=z[1],N=n*100/t;
  return {q:'翌日は、作った製品のうち'+t+'%が不良品で、その個数は'+n+'個であった。翌日に作った製品は何個か。',ans:N,wr:[r0(n*t),r0(n*100/(100-t)),N/2],u:'個',l:3,calc:n+' ÷ '+t/100+' ＝ '+N};});
add(3,'g-割合3real6',function(v){var x=v.ans-v.P;return {q:'30歳以上の社員は何人か。',ans:x,wr:[v.ans,v.ans+v.P,r0(v.P*(100-v.p)/100)],u:'人',l:3,calc:'社員全体 '+v.P+' ÷ '+v.p/100+' ＝ '+v.ans+'<br>'+v.ans+' − '+v.P+' ＝ '+x};});
add(3,'g-割合3real7',function(v){var x=v.ans*v.p2/100;if(!isInt(x))return null;return {q:'15歳以上65歳未満の人口は何人か。',ans:x,wr:[v.ans*v.p1/100,r0(v.P*v.p2/100),v.ans*(v.p1+v.p2)/100],u:'人',l:3,calc:'人口 '+v.P+' ÷ '+(100-v.p1-v.p2)/100+' ＝ '+v.ans+'<br>'+v.ans+' × '+v.p2/100+' ＝ '+x};});
add(3,'g-割合3real8',function(v){var x=v.W*(100-v.p1-v.p2)/100;if(!isInt(x))return null;return {q:'「満足」とも「不満」とも答えなかった人は何人か。',ans:x,wr:[v.W-v.P,v.W-v.ans,v.P-v.ans],u:'人',l:3,calc:'回答者全体 '+v.P+' ÷ '+v.p1/100+' ＝ '+v.W+'<br>'+v.W+' × (1 − '+v.p1/100+' − '+v.p2/100+') ＝ '+x};});
add(3,'g-割合3real9',function(v){var d=pk([20,30,40,50,60,80,100]),x=r0((v.P+d)/(v.W+d)*100);
  return {q:'翌年、女性の会員だけが'+d+'人増えた。女性は会員全体の何%になったか'+PR1+'。',ans:x,wr:[r0((v.P+d)/v.W*100),v.pA+r0(d/v.W*100),r0(v.P/(v.W+d)*100)],u:'%',l:4,calc:'女性 '+v.P+' ＋ '+d+' ＝ '+(v.P+d)+'、全体 '+v.W+' ＋ '+d+' ＝ '+(v.W+d)+'<br>'+(v.P+d)+' ÷ '+(v.W+d)+' ≒ '+x+'%'};});
addTo(3,'book-134','従業員数','N');
/* ===== 指標4 ===== */
add(4,'g-割合4real0',function(v){var x=r1(v.p1*(100-v.p2)/100);return {q:'Q大学の学生で、自転車以外で通学している学生は、地域の大学生全体の何%か'+PR2+'。',ans:x,d:1,wr:[r1(v.p1*v.p2/100),100-v.p2,r1(v.p1-v.p2/10)],u:'%',l:4,calc:v.p1/100+' × (1 − '+v.p2/100+') ＝ '+r1(v.p1*(100-v.p2))/10000+' → '+x+'%'};});
add(4,'g-割合4real1',function(v){var x=v.A-v.P;return {q:'営業部の男性社員は何人か。',ans:x,wr:[v.ans-v.P,v.A,r0(v.ans*(100-v.p2)/100)],u:'人',l:4,calc:'営業部 '+v.P+' ÷ '+v.p2/100+' ＝ '+v.A+'<br>'+v.A+' − '+v.P+' ＝ '+x};});
add(4,'g-割合4real2',function(v){var x=r0(v.p1*v.p2/100);return {q:'持ち家に住んでいる世帯のうち一戸建てではない世帯は、市の全世帯の何%か'+PR1+'。',ans:x,wr:[v.p2,100-v.p1,r0(v.p2*(100-v.p1)/100)],u:'%',l:4,calc:v.p1/100+' × '+v.p2/100+' ＝ '+(v.p1*v.p2/10000)+' → '+x+'%'};});
add(4,'g-割合4real3',function(v){var x=v.ans*v.p1/100;if(!isInt(x))return null;return {q:'食料品の売上は何万円か。',ans:x,wr:[v.ans*v.p2/100,r0(v.A*v.p1/100),r0(v.P*v.p1/v.p3)],u:'万円',l:4,calc:'売上全体 '+v.ans+'（1問目）<br>'+v.ans+' × '+v.p1/100+' ＝ '+x};});
add(4,'g-割合4real4',function(v){var t=pk([10,15,20,25]),x=r0((100+v.p)*(100+t)/100);return {q:'来年の売上を今年より'+t+'%増やすと、来年の売上は昨年の売上の何%になるか'+PR1+'。',ans:x,wr:[100+v.p+t,100+t,r0((100+v.p)*(100-t)/100)],u:'%',l:4,calc:(1+v.p/100)+' × '+(1+t/100)+' ＝ '+((100+v.p)*(100+t)/10000)+' → '+x+'%'};});
add(4,'g-割合4real5',function(v){var x=r0((v.A*v.p1+v.B*v.p2)/(v.A+v.B));return {q:'A中学校とB中学校を合わせると、電車で通学している生徒は2校の生徒全体の何%か'+PR1+'。',ans:x,wr:[r0((v.p1+v.p2)/2),r0(v.A*v.p1/(v.A+v.B)),r0(v.B*v.p2/(v.A+v.B))],u:'%',l:4,calc:'電車 '+v.A*v.p1/100+' ＋ '+v.Y+' ＝ '+(v.A*v.p1/100+v.Y)+'<br>÷ ('+v.A+' ＋ '+v.B+') ≒ '+x+'%'};});
add(4,'g-割合4real6',function(v){var x=r0((v.A-v.P)/v.W*100);return {q:'技術職の男性は、社員全体の何%か'+PR1+'。',ans:x,wr:[100-v.pA,r0(v.P/v.W*100),v.p],u:'%',l:4,calc:'技術職 '+v.W+' × '+v.p/100+' ＝ '+v.A+'<br>男性 '+v.A+' − '+v.P+' ＝ '+(v.A-v.P)+'<br>'+(v.A-v.P)+' ÷ '+v.W+' ≒ '+x+'%'};});
add(4,'g-割合4real7',function(v){var x=r0(v.p1*(100-v.p2)/100);return {q:'大学への進学を希望していない3年生は、高校の生徒全体の何%か'+PR1+'。',ans:x,wr:[100-v.p2,r0(v.p1*v.p2/100),100-v.p1],u:'%',l:4,calc:v.p1/100+' × (1 − '+v.p2/100+') ＝ '+(v.p1*(100-v.p2)/10000)+' → '+x+'%'};});
add(4,'g-割合4real8',function(v){var t=pk([5,10,15,20]),x=r0(100-(100-v.p)*(100-t)/100);return {q:'今年から10年後に、人口が今年よりさらに'+t+'%減ったとする。10年後の人口は、10年前の人口より何%減ったことになるか'+PR1+'。',ans:x,wr:[v.p+t,r0(v.p*t/100),Math.abs(v.p-t)||x+5],u:'%',l:4,calc:(1-v.p/100)+' × '+(1-t/100)+' ＝ '+((100-v.p)*(100-t)/10000)+'<br>1 − '+((100-v.p)*(100-t)/10000)+' → '+x+'%減'};});
add(4,'g-割合4real9',function(v){var x=r0(v.p1*(100-v.p2)/100);return {q:'65歳以上の男性は、市の住民全体の何%か'+PR1+'。',ans:x,wr:[100-v.p2,v.pA===x?x+3:v.pA,v.p1],u:'%',l:4,calc:v.p1/100+' × (1 − '+v.p2/100+') ＝ '+(v.p1*(100-v.p2)/10000)+' → '+x+'%'};});
add(4,'book-127',function(v){var x=r1(100-10000/(100+v.a));return {q:'入場料金を'+v.a+'%アップしたとき、入場料金の売上額を変えないためには、入場者数を何%減らせばよいか（必要なときは、最後に小数第2位を四捨五入すること）。',ans:x,d:1,wr:[v.a,r1(v.a*0.9),r1(10000/(100+v.a))],u:'%',l:4,calc:'入場者数を 1 − x にすると (1 ＋ '+v.a/100+') × (1 − x) ＝ 1<br>1 − x ＝ 1 ÷ '+(1+v.a/100)+' ≒ '+r1(10000/(100+v.a))/100+' → '+x+'%'};});
add(4,'book-128',function(v){var x=r0(v.p/v.k);return {q:'2日目の客数は3日間合計の何%か（必要なときは、最後に小数第1位を四捨五入すること）。',ans:x,wr:[r0(v.p*v.k),r0(100-v.p-v.p/v.k),r0((100-v.p)/2)],u:'%',l:4,calc:v.p+'% ÷ '+v.k+' ≒ '+x+'%'};});
add(4,'book-129',function(v){var w=(v.M+v.W+v.n)*v.p/100-v.W,m=v.n-w;if(!isInt(w)||m<0)return null;return {q:'新たに入った人のうち、男性は何人か。',ans:m,wr:[w,r0(v.M*v.n/(v.M+v.W)),r0(v.n*(100-v.p)/100)],u:'人',l:4,calc:'女性 ('+v.M+' ＋ '+v.W+' ＋ '+v.n+') × '+v.p/100+' ＝ '+(v.M+v.W+v.n)*v.p/100+'<br>新しい女性 '+(v.M+v.W+v.n)*v.p/100+' − '+v.W+' ＝ '+w+'<br>男性 '+v.n+' − '+w+' ＝ '+m};});
add(4,'book-131',function(v){var f=v.f.split('/').map(Number),s=v.s.split('/').map(Number),a=fr((f[1]-f[0])*s[0],f[1]*s[1]);
  function F(x){return x[0]+'/'+x[1];}var w1=fr(f[0]*s[0],f[1]*s[1]),w2=fr(s[0],s[1]),w3=fr((f[1]-f[0])*(s[1]-s[0]),f[1]*s[1]);
  return {q:'土曜日に読んだページ数は、全体の何分のいくつか。',ans:F(a),wr:[F(w1),F(w2),F(w3)],u:'',str:1,l:4,calc:'金曜日の残り 1 − '+v.f+' ＝ '+F(fr(f[1]-f[0],f[1]))+'<br>'+F(fr(f[1]-f[0],f[1]))+' × '+v.s+' ＝ '+F(a)};});
add(4,'book-133',function(v){var x=r0(v.n1*v.q/((v.n1+v.n2)*v.p)*100);return {q:'購入者のうち、東日本の回答者は何%か（必要なときは、最後に小数第1位を四捨五入すること）。',ans:x,wr:[r0(v.n1/(v.n1+v.n2)*100),v.q,100-x],u:'%',l:4,calc:'購入者全体 '+(v.n1+v.n2)+' × '+v.p/100+' ＝ '+(v.n1+v.n2)*v.p/100+'<br>東日本 '+v.n1+' × '+v.q/100+' ＝ '+v.n1*v.q/100+'<br>'+v.n1*v.q/100+' ÷ '+(v.n1+v.n2)*v.p/100+' ≒ '+x+'%'};});
add(4,'book-135',function(v){var m=v.N*v.mr/(v.mr+v.wr),w=v.N-m,M=m*v.a/100+w*v.b/100,x=r0(w*v.b/100/M*100);return {q:'会員のうち、女性は何%か（必要なときは、最後に小数第1位を四捨五入すること）。',ans:x,wr:[r0(v.wr/(v.mr+v.wr)*100),v.b,100-x],u:'%',l:4,calc:'男性 '+m+'人、女性 '+w+'人<br>会員 '+m*v.a/100+' ＋ '+w*v.b/100+' ＝ '+M+'<br>'+w*v.b/100+' ÷ '+M+' ≒ '+x+'%'};});
/* ===== 指標5 ===== */
add(5,'g-割合5real0',function(v){var x=r1(v.p1*v.p3/(v.p2*v.p4));return {q:'電車を利用しているP大学の学生は、電車を利用しているQ大学の学生の何倍か'+PR2+'。',ans:x,d:1,wr:[r1(v.p3/v.p4),r1(v.p1/v.p2),r1(v.p2*v.p4/(v.p1*v.p3))],u:'倍',l:5,calc:'P '+v.p1/100+' × '+v.p3/100+' ＝ '+v.p1*v.p3/10000+'<br>Q '+v.p2/100+' × '+v.p4/100+' ＝ '+v.p2*v.p4/10000+'<br>'+v.p1*v.p3/10000+' ÷ '+v.p2*v.p4/10000+' ≒ '+x};});
add(5,'g-割合5real1',function(v){var x=r1((v.p1*v.p3+v.p2*v.p4)/100);return {q:'バスを利用しているR大学とS大学の学生は、合わせて対象者全体の何%か'+PR2+'。',ans:x,d:1,wr:[v.p3+v.p4,r1((v.p3+v.p4)/2),r1(v.p1*v.p3/100)],u:'%',l:5,calc:v.p1/100+' × '+v.p3/100+' ＋ '+v.p2/100+' × '+v.p4/100+' ＝ '+((v.p1*v.p3+v.p2*v.p4)/10000)+' → '+x+'%'};});
add(5,'g-割合5real2',function(v){var x=r0(v.p2*v.p6/v.p4);return {q:'英語の資格を持っている人のうち、開発部の社員は何%か'+PR1+'。',ans:x,wr:[v.p2,v.p6,r0(v.p1*v.p5/v.p4)],u:'%',l:5,calc:'開発部で資格あり '+v.p2/100+' × '+v.p6/100+' ＝ '+v.p2*v.p6/10000+'<br>'+v.p2*v.p6/10000+' ÷ '+v.p4/100+' ≒ '+x+'%'};});
add(5,'g-割合5real3',function(v){var x=r0(v.p3/(100-v.p1-v.p2)*100);return {q:'森林と農地を除いた土地のうち、住宅地は何%か'+PR1+'。',ans:x,wr:[v.p3,r0(v.p3/(100-v.p1)*100),r0(v.p3/(100-v.p2)*100)],u:'%',l:5,calc:'森林と農地を除いた土地 1 − '+v.p1/100+' − '+v.p2/100+' ＝ '+(100-v.p1-v.p2)/100+'<br>'+v.p3/100+' ÷ '+(100-v.p1-v.p2)/100+' ≒ '+x+'%'};});
add(5,'g-割合5real4',function(v){var x=2*(v.P+v.ans);return {q:'この石炭200gに含まれる成分Xと成分Yをすべて燃やすと、合わせて何kcalの熱量が出るか。',ans:x,wr:[v.P+v.ans,2*v.ans,2*v.P+v.ans],u:'kcal',l:5,calc:'100gで '+v.P+' ＋ '+v.ans+' ＝ '+(v.P+v.ans)+'<br>200gは2倍で '+x};});
add(5,'g-割合5real5',function(v){var z=pk([[1,3],[3,1],[1,4],[2,3],[3,2]]),m=z[0],n=z[1],x=r1((m*v.p1+n*v.p3)/(m+n));return {q:'液体Xと液体Yを、重さの比が'+m+'：'+n+'になるように混ぜた。この液体のうち、薬品Pは何%か'+PR2+'。',ans:x,d:1,wr:[r1((v.p1+v.p3)/2),r1((n*v.p1+m*v.p3)/(m+n)),r1((m*v.p2+n*v.p4)/(m+n))],u:'%',l:5,calc:'('+m+' × '+v.p1+' ＋ '+n+' × '+v.p3+') ÷ '+(m+n)+' ≒ '+x+'%'};});
add(5,'g-割合5real6',function(v){var lo=Math.min(v.p1,v.p2),hi=Math.max(v.p1,v.p2),c=[];for(var t=lo+1;t<hi;t++){var a=fr(v.p2-t,t-v.p1);if(a[0]>0&&a[1]>0&&a[0]<=9&&a[1]<=9&&!(a[0]===v.m&&a[1]===v.n))c.push(t);}if(!c.length)return null;var t=pk(c),a=fr(v.p2-t,t-v.p1);
  return {q:'液体Xと液体Yの重さの比を変えて混ぜ、薬品Pが'+t+'%の液体を作りたい。液体Xと液体Yの重さの比を何対何にすればよいか。',ans:a[0]+'：'+a[1],str:1,wr:[a[1]+'：'+a[0],v.m+'：'+v.n,(a[0]+1)+'：'+a[1]],u:'',l:5,calc:'X を x、Y を y とすると<br>'+v.p1/100+'x ＋ '+v.p2/100+'y ＝ '+t/100+'(x ＋ y)<br>'+(t-v.p1)+'x ＝ '+(v.p2-t)+'y → x：y ＝ '+a[0]+'：'+a[1]};});
add(5,'g-割合5real7',function(v){function F(n,d){var z=fr(n,d);return z[1]===1?z[0]+'倍':z[1]+'分の'+z[0]+'倍';}var x=F(1,v.d2-1);
  return {q:'最後に飲んだ水の量は、最初の水の量の何倍か。',ans:x,str:1,wr:[F(1,v.d2),F(1,v.d1),F(v.d2,(v.d2-1)*v.d1)],u:'',l:5,calc:'最後に飲む前の量を A とすると A × (1 − 1/'+v.d2+') ＝ 1 → A ＝ '+F(v.d2,v.d2-1).replace('倍','')+'<br>飲んだ量 A × 1/'+v.d2+' ＝ '+x.replace('倍','')};});
add(5,'g-割合5real8',function(v){var T=(v.p1*v.p4+v.p2*v.p5+v.p3*v.p6)/100,x=r0(v.p2*v.p5/T);return {q:'自宅から通学している学生のうち、経済学部の学生は何%か'+PR1+'。',ans:x,wr:[v.p2,v.p5,r0(v.p1*v.p4/T)],u:'%',l:5,calc:'自宅通学 '+T+'%（1問目）<br>経済学部で自宅通学 '+v.p2/100+' × '+v.p5/100+' ＝ '+v.p2*v.p5/10000+'<br>'+v.p2*v.p5/10000+' ÷ '+T/100+' ≒ '+x+'%'};});
add(5,'g-割合5real9',function(v){var M=v.p1*(100-v.p3),W=v.p2*(100-v.p4),x=r0(W/(M+W)*100);return {q:'自動車で来なかった来客のうち、女性は何%か'+PR1+'。',ans:x,wr:[v.p2,100-v.p4,100-v.pA],u:'%',l:5,calc:'男性で自動車以外 '+v.p1/100+' × '+(100-v.p3)/100+' ＝ '+M/10000+'<br>女性で自動車以外 '+v.p2/100+' × '+(100-v.p4)/100+' ＝ '+W/10000+'<br>'+W/10000+' ÷ '+(M+W)/10000+' ≒ '+x+'%'};});
add(5,'book-130',function(v){var s=v.T*(v.b-v.c)/(v.a+v.b);if(!isInt(s))return null;return {q:'先週の土曜日の来場者は何人だったか。',ans:s,wr:[v.T-s,r0(s*(100-v.a)/100),v.T/2],u:'人',l:5,calc:'先週の土曜日を x 人とすると<br>'+(1-v.a/100)+'x ＋ '+(1+v.b/100)+'('+v.T+' − x) ＝ '+v.T+' × '+(1+v.c/100)+'<br>x ＝ '+s};});
})();
