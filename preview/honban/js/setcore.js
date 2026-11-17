/* 本番形式（組問）の共通部品：SETS のテンプレートから1組を作る。node の検査でも使うので画面の処理は入れない。 */
(function(G){
var LT='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
var RND={int:function(a,b){return a+Math.floor(Math.random()*(b-a+1));},pick:function(x){return x[Math.floor(Math.random()*x.length)];},shuffle:shuffle};
/* 問題文を「共通の文章」と「最後の問い」に分ける */
function split(q){var t=q.replace(/（必要なときは[^）]*）$/,''),i=t.slice(0,-1).lastIndexOf('。');if(i<0)return null;return [q.slice(0,i+1),q.slice(i+1)];}
function fmt(x,r){return r.str?String(x):(r.d?Number(x).toFixed(r.d):String(x))+r.u;}
/* 正解と誤答から選択肢5つを作る。足りない誤答は正解の前後の値で補う */
function choices(r){var a=fmt(r.ans,r),out=[a],c=r.wr.slice();
  if(!r.str){var k=r.d?Math.pow(10,r.d):1;[0.8,1.2,0.9,1.1,0.5,1.5].forEach(function(m){c.push(Math.round(r.ans*m*k)/k);});[1,-1,2,-2].forEach(function(s){c.push(Math.round((r.ans+s*(r.d?0.1:1))*k)/k);});}
  c.forEach(function(x){if(out.length>=5)return;if(!r.str&&!(isFinite(x)&&x>0))return;var s=fmt(x,r);if(out.indexOf(s)<0)out.push(s);});
  if(out.length<4)return null;var sh=shuffle(out);return {c:sh,a:sh.indexOf(a)};}
function findSrc(f,id){var B=BANK[f];for(var l in B)for(var k in B[l]){var xs=B[l][k]||[];for(var i=0;i<xs.length;i++)if(xs[i].id===id)return {it:xs[i],l:+l};}return null;}
function make(f,t){var s=findSrc(f,t.src);if(!s)return null;
  for(var n=0;n<40;n++){var o1;try{o1=s.it.make?s.it.make(RND):s.it;}catch(e){continue;}if(!o1||!o1.q||!o1.v)continue;
    var sp=split(o1.q);if(!sp)return null;var r;try{r=t.two(o1.v,o1);}catch(e){r=null;}if(!r)continue;var ch=choices(r);if(!ch)continue;
    return {id:t.id,f:f,stem:sp[0],subs:[{q:sp[1],c:o1.c,a:o1.a,calc:o1.calc,fig:o1.fig,inw:o1.inw,inwh:o1.inwh,l:s.l},{q:r.q,c:ch.c,a:ch.a,calc:r.calc,l:r.l}]};}
  return null;}
function list(f,l){return (G.SETS&&SETS[f]&&SETS[f][l])||[];}
G.SETCORE={make:make,list:list,split:split};
})(typeof window!=='undefined'?window:this);
