/* 本番形式（2タブの組問）：推論。担当D。
   問題集（book_suiron1.js・book_suiron2.js）の小問の組をそのまま組問にする。
   小問のテンプレートは数値を別々に選ぶので、1問目の乱数の選び方を記録し、2問目以降はその記録に近い値を選び直して（replay）、
   共通の文章（最後の問いの前まで）が一字一句同じになったものだけを使う。K は共通の文章に含まれる区切り（。・<br>・</div>）の数で、
   これより短い一致（数値が一部だけ同じ）や長すぎる一致（問いまで同じ）は使わない。
   setcore の book（BOOKDEFS）の形で登録する：P の s は毎回新しい値になるだけの番号で、同じ v に対して全小問を1回だけ作る。
   index.html では book_suiron1.js・book_suiron2.js・js/setcore.js より後に読み込む。 */
(function(){
var F='推論',S=window.SETS=window.SETS||{};S[F]=S[F]||{};
var D=window.BOOKDEFS=window.BOOKDEFS||{};
var SEEDS=[];for(var i=0;i<1000;i++)SEEDS.push(i);
function rnd(n){return Math.floor(Math.random()*n);}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=rnd(i+1);var t=a[i];a[i]=a[j];a[j]=t;}return a;}
var TP=null;function tpl(id){if(!TP){TP={};var B=BANK[F];for(var l in B)for(var k in B[l])(B[l][k]||[]).forEach(function(t){if(t.id)TP[t.id]={t:t,l:+l};});}return TP['bk'+id];}
/* 1問目：選んだ値を順に記録する */
function recR(log){return {int:function(a,b){var x=a+rnd(b-a+1);log.push(x);return x;},pick:function(a){var x=a[rnd(a.length)];log.push(x);return x;},shuffle:function(a){var x=shuf(a);log.push(x);return x;}};}
/* 2問目以降：記録と先頭から最も長く一致する値を選ぶ（なければふつうに選ぶ）。L は合わせる長さの上限（問57は3つ目の人数を小問ごとに変える） */
function fl(x){return Array.isArray(x)?x:[x];}
function score(r,c,L){var a=fl(r),b=fl(c),n=0;while(n<a.length&&n<b.length&&n<(L||99)&&JSON.stringify(a[n])===JSON.stringify(b[n]))n++;return n;}
function repR(log,L){var i=0;return {
  int:function(a,b){var r=log[i++];return typeof r==='number'&&r>=a&&r<=b&&r===Math.floor(r)?r:a+rnd(b-a+1);},
  pick:function(a){var r=log[i++];if(r===undefined)return a[rnd(a.length)];var best=0,c=[];a.forEach(function(x){var s=score(r,x,L);if(s>best){best=s;c=[x];}else if(s===best&&s>0)c.push(x);});return c.length?c[rnd(c.length)]:a[rnd(a.length)];},
  shuffle:function(a){var r=log[i++];if(Array.isArray(r)&&r.length===a.length&&JSON.stringify(r.slice().sort())===JSON.stringify(a.slice().sort()))return r.slice();return shuf(a);}};}
function common(qs){var a=qs[0],n=a.length;qs.forEach(function(q){var i=0;while(i<n&&i<q.length&&q.charAt(i)===a.charAt(i))i++;n=i;});
  var s=a.slice(0,n),k=Math.max(s.lastIndexOf('。')+1,s.lastIndexOf('<br>')+4,s.lastIndexOf('</div>')+6);return k>0?a.slice(0,k):'';}
function cnt(s){return (s.match(/。|<br>|<\/div>/g)||[]).length;}
function mk(t,R){var o;for(var j=0;j<30&&!o;j++){try{o=t.make(R);}catch(e){o=null;}}return o;}
/* 小問の組を1つ作る。ids の要素が配列なら、その中から1つ選ぶ（問78の2問目イ・ウ） */
function compose(ids,K,L){var ts=ids.map(function(x){return tpl(Array.isArray(x)?x[rnd(x.length)]:x).t;});
  /* book_suiron1 の小問（_g＝数値を選ぶ、_b＝問題を作る）は、同じ数値 v で全小問を作る（1問目の値を優先して合わせる） */
  if(ts.every(function(t){return t._g&&t._b;})){var R0=recR([]);
    for(var n=0;n<200;n++){var v={};for(var j=ts.length-1;j>=0;j--){var g;try{g=ts[j]._g(R0);}catch(e){g=null;}if(!g){v=null;break;}for(var k in g)v[k]=g[k];}if(!v)continue;
      var os=[],ok=true;for(var j=0;j<ts.length&&ok;j++){var o;try{o=ts[j]._b(v);}catch(e){o=null;}if(!o)ok=false;else{o.v=v;os.push(o);}}
      if(ok&&good(os,K))return os;}
    return null;}
  for(var n=0;n<15;n++){var log=[],o1=mk(ts[0],recR(log));if(!o1)continue;
    for(var m=0;m<40;m++){var os=[o1],ok=true;
      for(var j=1;j<ts.length&&ok;j++){var o=mk(ts[j],repR(log,L));if(!o)ok=false;else os.push(o);}
      if(ok&&good(os,K))return os;}}
  return null;}
/* 共通の文章の区切りがちょうど K 個で、小問の問いがすべて違うか */
function good(os,K){var st=common(os.map(function(o){return o.q;}));if(cnt(st)!==K)return false;
  var rs=os.map(function(o){return o.q.slice(st.length);});return !rs.some(function(r,i){return !r||rs.indexOf(r)!==i;});}
var LAST={v:null,os:null};
function book(n,ids,K,L){var lv=tpl(Array.isArray(ids[0])?ids[0][0]:ids[0]).l,keys=[];
  ids.forEach(function(x,i){var key=F+n+'-'+(i+1),l=tpl(Array.isArray(x)?x[0]:x).l;keys.push(key);
    D[key]={lv:l,d:{P:{s:SEEDS},f:function(v){if(LAST.v!==v){LAST.v=v;LAST.os=compose(ids,K,L);}return LAST.os?LAST.os[i]:null;}}};});
  (S[F][lv]=S[F][lv]||[]).push({id:'set-book-'+n,book:keys,K:K,ids:ids});}
/* 問題集の組（番号, 小問, 共通の文章の区切りの数） */
book(18,['18-1','18-2'],5);book(19,['19-1','19-2'],5);book(20,['20-1','20-2'],6);book(21,['21-1','21-2'],6);
book(22,['22-1','22-2','22-3'],8);book(23,['23-1','23-2'],4);book(24,['24-1','24-2'],5);book(25,['25-1','25-2'],6);
book(26,['26-1','26-2'],6);book(27,['27-1','27-2'],6);book(28,['28-1','28-2'],6);book(29,['29-1','29-2'],5);
book(30,['30-1','30-2'],7);book(37,['37-1','37-2'],3);book(38,['38-1','38-2'],5);book(40,['40-1','40-2'],4);
book(43,['43-1','43-2'],6);book(44,['44-1','44-2'],7);
book(45,['45-1','45-2'],7);book(48,['48-1','48-2'],7);book(49,['49-1','49-2'],6);book(50,['50-1','50-2'],4);
book(51,['51-1','51-2'],7);book(52,['52-1','52-2'],7);book(53,['53-1','53-2'],4);book(54,['54-1','54-2'],7);
book(55,['55-1','55-2'],6);book(56,['56-1','56-2'],4);book(57,['57-1','57-2'],8,2);book(58,['58-1','58-2'],7);
book(59,['59-1','59-2'],7);book(60,['60-1','60-2'],8);book(61,['61-1','61-2'],8);book(62,['62-1','62-2'],6);
book(63,['63-1','63-2'],7);book(64,['64-1','64-2'],8);book(65,['65-1','65-2','65-3'],5);book(67,['67-1','67-2'],8);
book(68,['68-1','68-2'],6);book(69,['69-1','69-2'],6);book(70,['70-1','70-2'],6);book(71,['71-1','71-2'],6);
book(72,['72-1','72-2','72-3'],5);book(78,['78-1',['78-2a','78-2b']],4);book(79,['79-1','79-2'],5);book(82,['82-1','82-2'],7);
book(83,['83-1','83-2'],7);book(84,['84-1','84-2'],9);book(85,['85-1','85-2'],9);book(86,['86-1','86-2'],7);
book(87,['87-1','87-2'],8);
})();
