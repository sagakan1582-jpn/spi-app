/* 確率：数値を変える問題（テンプレート）。元の問題の文・構造・難易度はそのままで、数値だけ毎回変える。
   図の関数（KT・KTI・KT4・KTI4・KT5・KTI5・PT5）は kakuritsu_3〜5.js のものを使う。 */
(function(){
var F='確率';if(!BANK[F])return;
function gc(a,b){return b?gc(b,a%b):a;}
function Fr(n,d){var k=gc(Math.abs(n),d)||1;return [n/k,d/k];}
function M(){var n=1,d=1;for(var i=0;i<arguments.length;i++){n*=arguments[i][0];d*=arguments[i][1];}return Fr(n,d);}
function A(){var n=0,d=1;for(var i=0;i<arguments.length;i++){var x=arguments[i];n=n*x[1]+x[0]*d;d*=x[1];var k=gc(n,d)||1;n/=k;d/=k;}return [n,d];}
function N1(f){return Fr(f[1]-f[0],f[1]);}
function s(f){return f[0]===0?'0':f[1]===1?String(f[0]):f[0]+'/'+f[1];}
function rw(n,d){return n+'/'+d;}
function pc(f){return Math.round(f[0]/f[1]*1000)/10;}
function dc(f){return String(Math.round(f[0]/f[1]*10000)/10000);}
function cf(n){var x=1;for(var i=2;i<=n;i++)x*=i;return x;}
function C(n,r){if(r<0||r>n)return 0;var x=1;for(var i=0;i<r;i++)x*=n-i;return x/cf(r);}
function vl(f){return f[0]/f[1];}
/* 選択肢（分数） */
function chF(ans,wr){var L=[ans],key=function(f){return f[0]+'/'+f[1];},seen={};seen[key(ans)]=1;
 function put(w){if(!w||L.length>=5)return;w=Fr(w[0],w[1]);if(w[0]>0&&w[0]<=w[1]&&!seen[key(w)]){seen[key(w)]=1;L.push(w);}}
 wr.forEach(put);for(var i=1;L.length<5&&i<40;i++){put([ans[0]+i,ans[1]]);put([ans[0]-i,ans[1]]);put([ans[0],ans[1]+i]);put([ans[0]*2+i,ans[1]*2]);}
 L.sort(function(x,y){return vl(x)-vl(y);});return {c:L.map(s),a:L.indexOf(ans)};}
/* 選択肢（%） */
function chP(ans,wr){var a=pc(ans),L=[a];function put(p){if(L.length<5&&p>0&&p<=100&&L.indexOf(p)<0)L.push(p);}
 wr.forEach(function(w){if(w)put(pc(Fr(w[0],w[1])));});for(var i=1;L.length<5;i++){put(Math.round((a+5*i)*10)/10);put(Math.round((a-5*i)*10)/10);}
 L.sort(function(x,y){return x-y;});var d=L.some(function(x){return x%1!==0;});return {c:L.map(function(x){return (d?x.toFixed(1):String(x))+'%';}),a:L.indexOf(a)};}
var CUR=null;function VV(v){CUR=v;}
function out(q,ans,wr,pct,inw,fig,calc,ex){var o=pct?chP(ans,wr):chF(ans,wr);o.v=CUR;CUR=null;o.q=q;o.inw=inw;o.fig=fig;o.calc=calc;if(ex)for(var k in ex)o[k]=ex[k];return o;}
function add(l,st,id,mk){if(BANK[F][l])BANK[F][l][st].push({id:id,make:mk,verify:VK});}
function BW(v,parts){return {whole:{n:'全ての場合',r:'1',v:v},parts:parts.map(function(p){return {n:p[0],r:p[1],v:p[2],w:p[3],ask:p[4]?1:0};})};}
function wd(x){return Math.max(.15,Math.min(.85,Math.round(x*100)/100));}
/* 掛け算の式。分数は 約分前 ＝ 約分後、%は小数 */
function ml(fs,pct){var V=pct?dc:s,n=1,d=1;fs.forEach(function(f){n*=f[0];d*=f[1];});var r=Fr(n,d);
 return fs.map(V).join(' × ')+' ＝ '+(pct?dc(r):(r[1]!==d?n+'/'+d+' ＝ ':'')+s(r));}
function mlR(fs){var n=1,d=1;fs.forEach(function(f){n*=f[0];d*=f[1];});var r=Fr(n,d);
 return fs.map(function(f){return rw(f[0],f[1]);}).join(' × ')+' ＝ '+(r[1]!==d?n+'/'+d+' ＝ ':'')+s(r);}
function pend(ans,pct){return pct?' ＝ '+pc(ans)+'%':'';}

/* ===== 2つの独立なこと（P・Q、土曜・日曜など） ===== */
/* o:{q,a,b,k(both|none|al|oa|ex),pct,KT,an,bn,inw,t:{xa,xb,none,al,oa,ob,pre},m} */
function ind(o){var a=o.a,b=o.b,na=N1(a),nb=N1(b),both=M(a,b),none=M(na,nb),al=N1(none),oa=M(a,nb),ob=M(na,b),ex=A(oa,ob),V=o.pct?dc:s,t=o.t,m=o.m||'!',ans,v,calc;
 if(o.k==='both'){ans=both;v=['!?','','',''];calc=(t.pre||'')+ml([a,b],o.pct);}
 else if(o.k==='none'){ans=none;v=['','','','!?'];calc=t.xa+' 1 − '+V(a)+' ＝ '+V(na)+'<br>'+t.xb+' 1 − '+V(b)+' ＝ '+V(nb)+'<br>'+ml([na,nb],o.pct);}
 else if(o.k==='al'){ans=al;v=[m,m,m,V(none)];calc=t.none+' '+ml([na,nb],o.pct)+'<br>'+(t.al?t.al+' ':'')+'1 − '+V(none)+' ＝ '+V(al);}
 else if(o.k==='oa'){ans=oa;v=['','!?','',''];calc=(t.oa2||'')+ml([a,nb],o.pct);}
 else {ans=ex;v=['','!'+V(oa),'!'+V(ob),''];calc=t.oa+' '+ml([a,nb],o.pct)+'<br>'+t.ob+' '+ml([na,b],o.pct)+'<br>'+V(oa)+' ＋ '+V(ob)+' ＝ '+V(ex);}
 calc+=pend(ans,o.pct);
 VV({t:'ind',a:a,b:b,k:o.k,p:o.pct});return out(o.q,ans,[both,none,al,oa,ob,ex,a,b,vl(a)+vl(b)<=1?A(a,b):null],o.pct,o.inw,o.KT(o.an,[V(a),V(na)],o.bn,[V(b),V(nb),V(b),V(nb)],v),calc);}
var TP={xa:'Pが不正解',xb:'Qが不正解',none:'2人とも不正解',al:'',oa:'Pだけ正解',ob:'Qだけ正解'};
var TP4={xa:'Pが不正解',xb:'Qが不正解',none:'2人とも不正解',al:'少なくとも1人',oa:'Pだけ',ob:'Qだけ'};
var TG={xa:'Pが不合格',xb:'Qが不合格',none:'2人とも不合格',al:'少なくとも1人',oa:'Pだけ',ob:'Qだけ'};
var FR1=[[1,2],[1,3],[2,3],[1,4],[3,4]],FR2=[[2,3],[3,4],[2,5],[3,5],[1,4],[1,3],[4,5],[1,2]],FR3=[[3,5],[5,8],[2,3],[3,4],[4,5],[3,7],[5,6],[2,5],[3,8]];
function pk2(R,L){var a=R.pick(L),b=R.pick(L);for(var i=0;i<10&&a===b;i++)b=R.pick(L);return [a,b];}
function pq(R,L,k,KT,KTI,t,m,pre){var x=pk2(R,L),a=x[0],b=x[1];
 var tail={both:'PとQの2人とも正解する確率',none:'PとQの2人とも不正解になる確率',al:'PとQの少なくともどちらか1人が正解する確率',oa:'Pだけが正解する確率',ex:'PとQのどちらか一方だけが正解する確率'}[k];
 var o={q:'PとQの2人がある問題を解く。Pが正解する確率は'+s(a)+'、Qが正解する確率は'+s(b)+'である。'+tail+'はどれだけか。',a:a,b:b,k:k,KT:KT,an:'P',bn:'Q',inw:KTI('P','Q','○は正解、×は不正解。'),t:t,m:m};
 if(pre)o.t=Object.assign({},t,{pre:pre});if(k==='oa')o.t=Object.assign({},o.t,{oa2:'Pが正解でQが不正解<br>'});return ind(o);}
function pqP(R,k,KT,KTI,t,m,ex1,ex2){var a=R.pick([50,60,70,80,90]),b=R.pick([30,40,50,60,70]);if(a===b)b-=10;
 var tail={both:'PとQの2人とも正解する確率',al:'PとQの少なくともどちらか1人が正解する確率',ex:'PとQのどちらか1人だけが正解する確率',ex4:'PとQのどちらか一方だけが正解する確率'}[k];
 return ind({q:'PとQの2人がある問題を解く。Pが正解する確率は'+a+'%、Qが正解する確率は'+b+'%である。'+tail+'は何%か。',a:Fr(a,100),b:Fr(b,100),k:k==='ex4'?'ex':k,pct:1,KT:KT,an:'P',bn:'Q',inw:KTI('P','Q','○は正解、×は不正解。'),t:t,m:m});}
/* 1本の割合の図で数える */
function cnt(q,tot,parts,inw,calc,wr){var gd=0,ps=parts.map(function(p){if(p[2])gd=p[1];return [p[0],p[2]?'?':'',p[1]+'通り',wd(p[1]/tot),p[2]];});var ans=Fr(gd,tot);
 return out(q,ans,(wr||[]).concat([[tot-gd,tot],[1,tot],[gd+1,tot],[gd,tot-gd]]),0,inw,BW(tot+'通り',ps),calc+(calc?'<br>':'')+gd+' ÷ '+tot+' ＝ '+s(ans));}
function pairs(t){var a=[];for(var i=1;i<=6;i++){var j=t-i;if(j>=1&&j<=6)a.push('('+i+','+j+')');}return a;}
function sums(list){var tot=0,ln=[],ws=[];list.forEach(function(t){var p=pairs(t);tot+=p.length;ln.push('和'+t+' '+p.join(''));ws.push(p.length);});return {n:tot,line:ln.join('　'),add:ws.join(' ＋ ')+' ＝ '+tot+'（通り）'};}
/* くじ（戻さない） */
function lot(n,k){return {aw:[k,n],al:[n-k,n],ww:[k-1,n-1],wl:[n-k,n-1],lw:[k,n-1],ll:[n-k-1,n-1]};}
function lfig(KT,an,bn,L,v){return KT(an,[rw(L.aw[0],L.aw[1]),rw(L.al[0],L.al[1])],bn,[rw(L.ww[0],L.ww[1]),rw(L.wl[0],L.wl[1]),rw(L.lw[0],L.lw[1]),rw(L.ll[0],L.ll[1])],v);}
/* 赤玉と白玉を同時に（戻さずに）2個 */
function rwo(q,a,b,KT,KTI,mode,kind){var n=a+b,L=lot(n,a),rw1=M(L.aw,L.wl),wr1=M(L.al,L.lw),rr=M(L.aw,L.ww),ww=M(L.al,L.ll),ans,v,calc;
 var pre='同時に取り出すのは、戻さずに1個ずつ取り出すのと同じ<br>';
 if(kind==='same'){ans=A(rr,ww);v=['!'+s(rr),'','','!'+s(ww)];calc='赤・赤 '+mlR([L.aw,L.ww])+'<br>白・白 '+mlR([L.al,L.ll])+'<br>'+s(rr)+' ＋ '+s(ww)+' ＝ '+s(ans);}
 else {ans=A(rw1,wr1);v=['','!'+s(rw1),'!'+s(wr1),''];calc=(mode===4?pre+'赤→白 '+mlR([L.aw,L.wl])+'、白→赤 '+mlR([L.al,L.lw]):'赤・白 '+mlR([L.aw,L.wl])+'<br>白・赤 '+mlR([L.al,L.lw]))+'<br>'+s(rw1)+' ＋ '+s(wr1)+' ＝ '+s(ans);}
 VV({t:'rwo',a:a,b:b,k:kind||'one'});return out(q,ans,[rw1,rr,ww,A(rr,ww),M([a,n],[b,n]),M([a,n],[b,n],[2,1]),[a*b,C(n,2)*2]].filter(function(x){return x[0]!==ans[0]||x[1]!==ans[1];}),0,
  mode===4?KTI('1個目','2個目','○は赤玉、×は白玉。'):KTI('1個目','2個目','同時に取り出すのは、戻さずに続けて取り出すのと同じ。○は赤玉、×は白玉。'),
  lfig(KT,'1個目','2個目',L,v),calc);}
/* 何回かくり返して、ちょうどk回 */
function combos(n,k){var r=[];(function g(st,cur){if(cur.length===k){r.push(cur.slice());return;}for(var i=st;i<n;i++){cur.push(i);g(i+1,cur);cur.pop();}})(0,[]);return r;}

/* ===== 指標3 ===== */
var S3={
 concept:[
  function(R){var m=R.pick([2,3,4,5]),g=Math.floor(6/m);VV({t:'die',f:'m',x:m});return cnt('1から6までの目があるサイコロを1個振る。'+m+'の倍数の目が出る確率はどれだけか。',6,[[m+'の倍数',g,1],['それ以外',6-g]],'全ての目の出方を「'+m+'の倍数の目」「それ以外の目」に分ける','確率 ＝ 当てはまる場合の数 ÷ 全ての場合の数');},
  function(R){var a=R.pick([[1,4],[1,3],[1,5],[2,5],[3,8],[1,6],[2,7],[3,10]]),ans=N1(a);
   VV({t:'cmp',a:a});return out('あるくじを1本引いて当たりが出る確率は'+s(a)+'である。このくじを1本引いて、はずれが出る確率はどれだけか。',ans,[a,[a[0],a[1]*2],[1,2],[a[1]-a[0],a[1]*2]],0,'全ての場合を「当たり」「はずれ」に分ける',
    BW('',[['当たり',s(a),'',wd(vl(a))],['はずれ','?','',wd(vl(ans)),1]]),'確率の和は1<br>1 − '+s(a)+' ＝ '+s(ans));},
  function(R){return pq(R,FR1,'both',KT,KTI,TP,'!','両方 ＝ 1つ目の確率 × 2つ目の確率<br>');}
 ],
 practice:[
  function(R){var k=R.int(2,6),g=7-k;VV({t:'die',f:'ge',x:k});return cnt('1から6までの目があるサイコロを1個振る。'+k+'以上の目が出る確率はどれだけか。',6,[[k+'以上',g,1],['それ以外',6-g]],'全ての目の出方を「'+k+'以上の目」「それ以外の目」に分ける','');},
  function(R){var a=R.int(2,5),b=R.int(2,6);if(a===b)b++;VV({t:'urn',c:[a,b],i:0});return cnt('赤玉'+a+'個と白玉'+b+'個が入った袋から、玉を1個取り出す。赤玉が出る確率はどれだけか。',a+b,[['赤玉',a,1],['白玉',b]],'全ての玉の出方を「赤玉」「白玉」に分ける','',[[a,b]]);},
  function(R){return pq(R,FR1,'both',KT,KTI,TP);},
  function(R){return pq(R,FR1,'none',KT,KTI,TP);},
  function(R){return pq(R,FR1,'al',KT,KTI,Object.assign({},TP,{al:'',none:'2人とも不正解'}),'!',null);},
  function(R){var n=R.int(2,3),h=[1,2],ans=[1,Math.pow(2,n)],hs=[];for(var i=0;i<n;i++)hs.push('1/2');
   VV({t:'coinAll',n:n});return out('1枚の硬貨を'+n+'回投げる。'+n+'回とも表が出る確率はどれだけか。',ans,[[1,2],[1,n],[3,4],[1,Math.pow(2,n+1)],[n,Math.pow(2,n)]],0,KTI('1回目','2回目','○は表、×は裏。')+(n>2?'。'+n+'回続くので、表の確率を'+n+'回掛ける':''),
    KT('1回目',['1/2','1/2'],'2回目',['1/2','1/2','1/2','1/2'],[n>2?'!1/4':'!?','','','']),hs.join(' × ')+' ＝ '+s(ans));}
 ],
 applied:[
  function(R){var e=R.pick(['偶数','奇数']),o=e==='偶数'?'奇数':'偶数';VV({t:'die',f:e==='偶数'?'even':'odd'});return cnt('1から6までの目があるサイコロを1個振る。'+e+'の目が出る確率はどれだけか。',6,[[e,3,1],[o,3]],'全ての目の出方を「'+e+'の目」「'+o+'の目」に分ける','');},
  function(R){var n=R.int(5,12),k=R.int(1,Math.floor(n/2));VV({t:'urn',c:[k,n-k],i:0});return cnt(n+'本のうち'+k+'本が当たりのくじがある。このくじを1本引くとき、当たりが出る確率はどれだけか。',n,[['当たり',k,1],['はずれ',n-k]],'全てのくじの引き方を「当たり」「はずれ」に分ける','',[[k,n-k]]);},
  function(R){return pq(R,FR2,'both',KT,KTI,TP);},
  function(R){return pq(R,FR2,'al',KT,KTI,TP);},
  function(R){return pq(R,FR2,'oa',KT,KTI,TP);},
  function(R){var n=R.int(3,4),ans=[1,Math.pow(2,n)],hs=[];for(var i=0;i<n;i++)hs.push('1/2');
   VV({t:'coinAll',n:n});return out('1枚の硬貨を'+n+'回投げる。'+n+'回とも裏が出る確率はどれだけか。',ans,[[1,6],[1,4],[3,8],[1,2],[1,2*n]],0,'○は裏、×は表。1回ごとに「裏」「表」に分ける。'+n+'回続くので、裏の確率を'+n+'回掛ける',
    KT('1回目',['1/2','1/2'],'2回目',['1/2','1/2','1/2','1/2'],['!1/4','','','']),hs.join(' × ')+' ＝ '+s(ans));},
  function(R){var x=R.pick([10,20,30,40,50,60]),y=R.pick([20,30,40,50,60,70]);
   return ind({q:'ある地域で、土曜日に雨が降る確率は'+x+'%、日曜日に雨が降る確率は'+y+'%である。土曜日と日曜日のどちらにも雨が降らない確率は何%か。',a:Fr(x,100),b:Fr(y,100),k:'none',pct:1,KT:KT,an:'土曜',bn:'日曜',inw:KTI('土曜','日曜','○は雨が降る、×は降らない。'),t:{xa:'土曜に降らない',xb:'日曜に降らない'}});},
  function(R){var x=R.pick([10,20,30,40,50,60]),y=R.pick([20,30,40,50,60,70]);
   return ind({q:'ある地域で、土曜日に雨が降る確率は'+x+'%、日曜日に雨が降る確率は'+y+'%である。土曜日と日曜日の少なくともどちらか1日に雨が降る確率は何%か。',a:Fr(x,100),b:Fr(y,100),k:'al',pct:1,KT:KT,an:'土曜',bn:'日曜',inw:KTI('土曜','日曜','○は雨が降る、×は降らない。'),t:{none:'どちらも降らない',al:''}});}
 ],
 real:[
  function(R){var a=R.int(2,6),b=R.int(2,6),c=R.int(2,5),n=a+b+c,ans=Fr(b,n);
   VV({t:'urn',c:[a,b,c],i:1});return out('赤玉'+a+'個、白玉'+b+'個、青玉'+c+'個が入った袋から、玉を1個取り出す。白玉が出る確率はどれだけか。',ans,[[a,n],[c,n],[b,a+c],[b+1,n],[a+c,n]],0,'全ての玉の出方を「赤玉」「白玉」「青玉」に分ける',
    BW(n+'通り',[['赤','',a+'通り',wd(a/n)],['白','?',b+'通り',wd(b/n),1],['青','',c+'通り',wd(c/n)]]),'全部の玉 '+a+' ＋ '+b+' ＋ '+c+' ＝ '+n+'<br>'+b+' ÷ '+n+' ＝ '+s(ans));},
  function(R){var t=R.int(4,10),p=pairs(t);VV({t:'sum',L:[t]});return cnt('1から6までの目があるサイコロを2個同時に振る。出た目の和が'+t+'になる確率はどれだけか。',36,[['和が'+t,p.length,1],['それ以外',36-p.length]],'全ての目の出方（6 × 6 ＝ 36通り）を「和が'+t+'」「それ以外」に分ける','和が'+t+'は '+p.join('')+' の'+p.length+'通り',[[1,12],[1,9],[7,36],[1,4]]);},
  function(R){return pqP(R,'both',KT,KTI,TP);},
  function(R){return pqP(R,'al',KT,KTI,TP,'!');},
  function(R){return pqP(R,'ex',KT,KTI,TP);},
  function(R){return pq(R,FR3,'none',KT,KTI,TP);},
  function(R){var n=R.int(6,10),k=R.int(2,4),L=lot(n,k),ans=M(L.aw,L.ww);
   VV({t:'lot',n:n,k:k,w:'both'});return out(n+'本のうち'+k+'本が当たりのくじがある。このくじをAが1本引き、引いたくじを戻さずに続けてBが1本引く。AとBの2人とも当たりを引く確率はどれだけか。',ans,[M(L.aw,L.aw),L.aw,M(L.aw,L.wl),M(L.al,L.ll),[k-1,n-1]],0,KTI('A','B','○は当たり、×ははずれ。')+'。Aが引いた後は、残り'+(n-1)+'本で考える',
    lfig(KT,'A','B',L,['!?','','','']),'Aが当たった後は、'+(n-1)+'本のうち当たり'+(k-1)+'本<br>'+mlR([L.aw,L.ww]));},
  function(R){var n=R.int(6,10),k=R.int(2,4),L=lot(n,k),x=M(L.aw,L.ww),y=M(L.al,L.lw),ans=A(x,y);
   VV({t:'lot',n:n,k:k,w:'b'});return out(n+'本のうち'+k+'本が当たりのくじがある。このくじをAが1本引き、引いたくじを戻さずに続けてBが1本引く。Bが当たりを引く確率はどれだけか。',ans,[x,y,M(L.aw,L.aw),[k-1,n-1],[k,n-1]],0,KTI('A','B','○は当たり、×ははずれ。')+'。Aが引いた後は、残り'+(n-1)+'本で考える',
    lfig(KT,'A','B',L,['!'+s(x),'','!'+s(y),'']),'Aが当たり、Bも当たり '+mlR([L.aw,L.ww])+'<br>Aがはずれ、Bが当たり '+mlR([L.al,L.lw])+'<br>'+s(x)+' ＋ '+s(y)+' ＝ '+s(ans));},
  function(R){var n=R.int(3,5),d=Math.pow(2,n),hs=[],ans=[d-1,d];for(var i=0;i<n;i++)hs.push('1/2');
   VV({t:'coinAL',n:n});return out('1枚の硬貨を'+n+'回投げる。少なくとも1回は表が出る確率はどれだけか。',ans,[[1,d],[1,4],[3,4],[d/2-1,d/2],[n,d]],0,'全ての場合を「'+n+'回とも裏」「少なくとも1回は表」に分ける',
    BW('',[[n+'回とも裏','1/'+d,'',.25],['少なくとも1回は表','?','',.75,1]]),n+'回とも裏 '+hs.join(' × ')+' ＝ 1/'+d+'<br>1 − 1/'+d+' ＝ '+s(ans));},
  function(R){var p=R.pick([50,60,70,80]),w=Fr(p,100),l=N1(w),ans=M(l,l);
   VV({t:'ind',a:w,b:w,k:'none',p:1});return out('AとBが試合をする。1回の試合でAが勝つ確率は'+p+'%で、引き分けはないものとする。2回試合をするとき、Aが2回とも負ける確率は何%か。',ans,[l,M(w,w),M(w,l),M(w,l,[2,1]),N1(M(w,w))],1,KTI('1回目','2回目','○はAの勝ち、×はAの負け。'),
    KT('1回目',[dc(w),dc(l)],'2回目',[dc(w),dc(l),dc(w),dc(l)],['','','','!?']),'Aが負ける 1 − '+dc(w)+' ＝ '+dc(l)+'<br>'+ml([l,l],1)+pend(ans,1));}
 ]};

/* ===== 指標4 ===== */
function multOr(q,N,a,b,dice){var A1=[],B1=[],ov=[];for(var i=1;i<=N;i++){var x=i%a===0,y=i%b===0;if(x)A1.push(i);if(y)B1.push(i);if(x&&y)ov.push(i);}
 var g=A1.length+B1.length-ov.length,ans=Fr(g,N),u=dice?'通り':'枚';
 var inw=dice?'全ての目の出方を「'+a+'の倍数または'+b+'の倍数」「それ以外」に分ける。'+(ov.length?ov.join('、')+'は両方に入るので1回だけ数える':'両方に入る目はない')
  :'全てのカードを「'+a+'の倍数または'+b+'の倍数」「それ以外」に分ける。'+(ov.length?(a*b/gc(a,b))+'の倍数は両方に入るので1回だけ数える':'');
 var calc=dice?a+'の倍数 '+A1.join('、')+'　'+b+'の倍数 '+B1.join('、')+'<br>'+(ov.length?ov.join('、')+'が重なるので '+A1.length+' ＋ '+B1.length+' − '+ov.length:A1.length+' ＋ '+B1.length)+' ＝ '+g+'（通り）'
  :a+'の倍数 '+A1.length+'枚、'+b+'の倍数 '+B1.length+'枚、両方（'+(a*b/gc(a,b))+'の倍数）'+ov.length+'枚<br>'+A1.length+' ＋ '+B1.length+' − '+ov.length+' ＝ '+g+'（枚）';
 VV({t:'mo',N:N,a:a,b:b});return out(q,ans,[[A1.length+B1.length,N],[A1.length,N],[B1.length,N],[g-1,N],[N-g,N]],0,inw,BW(N+'通り',[[a+'か'+b+'の倍数','?',g+'通り',wd(g/N),1],['それ以外','',(N-g)+'通り',wd(1-g/N)]]),calc+'<br>'+g+' ÷ '+N+' ＝ '+s(ans));}
function sumQ(q,list,lab,inw){var S=sums(list),ans=Fr(S.n,36);
 VV({t:'sum',L:list});return out(q,ans,[[S.n-1,36],[S.n+1,36],[list.length,36],[S.n,30],[S.n,18]],0,inw,BW('36通り',[[lab,'?',S.n+'通り',wd(S.n/36),1],['それ以外','',(36-S.n)+'通り',wd(1-S.n/36)]]),S.line+'<br>'+S.add+'<br>'+S.n+' ÷ 36 ＝ '+s(ans));}
function coinK(n,ks,lab,inw4){var d=Math.pow(2,n),g=0,parts=[];ks.forEach(function(k){g+=C(n,k);parts.push(k);});var ans=Fr(g,d);
 var calc=ks.length===1?'表が出る'+ks[0]+'回の選び方 '+n+'C'+ks[0]+' ＝ '+g+'（通り）':ks.map(function(k){return '表'+k+'回 '+(k===n?'1':n+'C'+k+' ＝ '+C(n,k));}).join('、')+'<br>'+ks.map(function(k){return C(n,k);}).join(' ＋ ')+' ＝ '+g+'（通り）';
 VV({t:'coinK',n:n,ks:ks});return out('1枚の硬貨を'+n+'回投げる。'+lab+'確率はどれだけか。',ans,[[g-1,d],[g+1,d],[1,2],[ks[0],d],[g,n*2]],0,inw4,
  BW(d+'通り',[[lab.replace(/出る$/,'').replace(/^表が/,'表が').replace('ちょうど',''),'?',g+'通り',wd(g/d),1],['それ以外','',(d-g)+'通り',wd(1-g/d)]]),calc+'<br>'+g+' ÷ '+d+' ＝ '+s(ans));}
function powS(f,n){var a=[];for(var i=0;i<n;i++)a.push(s(f));return a.join(' × ');}
function atLeastDie(R,n,lv){var k=R.int(1,6),nf=[5,6],no=[Math.pow(5,n),Math.pow(6,n)],ans=Fr(no[1]-no[0],no[1]),nn=Fr(no[0],no[1]);
 var q='1から6までの目があるサイコロを'+n+'回振る。少なくとも1回は'+k+'の目が出る確率はどれだけか。';
 var calc=n+'回とも'+k+'以外 '+powS(nf,n)+' ＝ '+s(nn)+'<br>少なくとも1回 1 − '+s(nn)+' ＝ '+s(ans);
 var wr=[nn,Fr(n,6),[1,6],Fr(no[1]-no[0]-1,no[1]),Fr(1,Math.pow(6,n))];
 VV({t:'dieAL',n:n,k:k});if(n===2)return out(q,ans,wr,0,KTI4('1回目','2回目','○は'+k+'の目、×は'+k+'以外の目。'),KT4('1回目',['1/6','5/6'],'2回目',['1/6','5/6','1/6','5/6'],['!?','!?','!?',s(nn)]),calc);
 return out(q,ans,wr,0,'全ての場合を「少なくとも1回は'+k+'の目」「'+n+'回とも'+k+'以外の目」に分ける',BW('',[['少なくとも1回','?','',.42,1],[n+'回とも'+k+'以外',s(nn),'',.58]]),calc);}
function lotAL(n,k){var t=C(n,2),x=C(n-k,2),nn=Fr(x,t),ans=N1(nn);
 VV({t:'lotS',n:n,k:k});return out(n+'本のうち'+k+'本が当たりのくじがある。このくじを同時に2本引く。少なくとも1本が当たりである確率はどれだけか。',ans,[nn,Fr(k,n),Fr(C(k,2),t),Fr(k*(n-k),t),N1(Fr(n-k,n))],0,'全ての引き方（'+n+'C2 ＝ '+t+'通り）を「2本ともはずれ」「それ以外」に分ける',
  BW(t+'通り',[['少なくとも1本当たり','?','',wd(vl(ans)),1],['2本ともはずれ','',x+'通り',wd(vl(nn))]]),'2本ともはずれ '+(n-k)+'C2 ＝ '+x+'（通り）→ '+x+'/'+t+(Fr(x,t)[1]!==t?' ＝ '+s(nn):'')+'<br>少なくとも1本当たり 1 − '+s(nn)+' ＝ '+s(ans));}
var S4={
 concept:[
  function(R){var n=R.int(2,3),d=Math.pow(2,n),ans=[d-1,d],hs=powS([1,2],n);
   var q='1枚の硬貨を'+n+'回投げる。少なくとも1回は表が出る確率はどれだけか。',calc=n+'回とも裏 '+hs+' ＝ 1/'+d+'<br>少なくとも1回表 1 − 1/'+d+' ＝ '+s(ans),wr=[[1,d],[1,2],[1,3],[2,3],[n,d]];
   VV({t:'coinAL',n:n});if(n===2)return out(q,ans,wr,0,KTI4('1回目','2回目','○は表、×は裏。'),KT4('1回目',['1/2','1/2'],'2回目',['1/2','1/2','1/2','1/2'],['!?','!?','!?','1/4']),calc);
   return out(q,ans,wr,0,'全ての場合を「'+n+'回とも裏」「少なくとも1回は表」に分ける',BW(d+'通り',[['少なくとも1回は表','?',(d-1)+'通り',.8,1],[n+'回とも裏','','1通り',.2]]),calc);},
  function(R){var p=R.pick([[2,3],[2,5],[3,4],[3,5],[4,5]]);return multOr('1から6までの目があるサイコロを1個振る。'+p[0]+'の倍数または'+p[1]+'の倍数の目が出る確率はどれだけか。',6,p[0],p[1],1);},
  function(R){return pq(R,FR1,'ex',KT4,KTI4,TP4);}
 ],
 practice:[
  function(R){return pq(R,FR1,'al',KT4,KTI4,TP4,'!?');},
  function(R){var t=R.int(3,6),L=[];for(var i=2;i<=t;i++)L.push(i);return sumQ('1から6までの目があるサイコロを2個同時に振る。出た目の和が'+t+'以下になる確率はどれだけか。',L,'和が'+t+'以下','全ての目の出方（6 × 6 ＝ 36通り）を「和が'+t+'以下」「それ以外」に分ける');},
  function(R){var n=R.pick([5,6,8,10]),k=R.int(1,Math.floor(n/2)),w=[k,n],l=[n-k,n],ans=M(l,l);
   VV({t:'repl',n:n,k:k});return out(n+'本のうち'+k+'本が当たりのくじがある。このくじを1本引いて元に戻し、もう一度1本引く。2回ともはずれる確率はどれだけか。',ans,[M(w,w),M(w,l),N1(ans),Fr(n-k,n),M(l,[n-k-1,n-1])],0,KTI4('1回目','2回目','○は当たり、×ははずれ。'),
    KT4('1回目',[rw(k,n),rw(n-k,n)],'2回目',[rw(k,n),rw(n-k,n),rw(k,n),rw(n-k,n)],['','','','!?']),'元に戻すので2回目も同じ確率<br>'+mlR([l,l]));},
  function(R){var k=R.int(1,2);return coinK(3,[k],'表がちょうど'+k+'回出る','全ての出方（2 × 2 × 2 ＝ 8通り）を「表がちょうど'+k+'回」「それ以外」に分ける');},
  function(R){var a=R.int(2,4),b=R.int(2,3);return rwo('赤玉'+a+'個と白玉'+b+'個が入った袋から、玉を同時に2個取り出す。赤玉と白玉が1個ずつ出る確率はどれだけか。',a,b,KT4,KTI4,4);},
  function(R){return atLeastDie(R,2,4);}
 ],
 applied:[
  function(R){return pq(R,FR2,'al',KT4,KTI4,TP4,'!?');},
  function(R){return pq(R,FR2,'ex',KT4,KTI4,TP4);},
  function(R){var t=R.int(9,11),L=[];for(var i=t;i<=12;i++)L.push(i);return sumQ('1から6までの目があるサイコロを2個同時に振る。出た目の和が'+t+'以上になる確率はどれだけか。',L,'和が'+t+'以上','全ての目の出方（36通り）を「和が'+t+'以上」「それ以外」に分ける');},
  function(R){var n=R.int(4,5);return coinK(n,[n-1,n],'表が'+(n-1)+'回以上出る','全ての出方（'+powS([2,1],n).replace(/\/1/g,'').replace(/2/g,'2')+' ＝ '+Math.pow(2,n)+'通り）を「表が'+(n-1)+'回以上」「それ以外」に分ける');},
  function(R){var n=R.int(5,7);return lotAL(n,2);},
  function(R){var p=R.pick([[4,6],[3,4],[2,5],[3,5],[4,5]]),N=R.pick([20,30]);return multOr('1から'+N+'までの数字が1つずつ書かれた'+N+'枚のカードから、1枚を引く。引いたカードの数字が'+p[0]+'の倍数または'+p[1]+'の倍数である確率はどれだけか。',N,p[0],p[1],0);},
  function(R){var a=R.int(3,5),b=R.int(2,3);return rwo('赤玉'+a+'個と白玉'+b+'個が入った袋から、玉を同時に2個取り出す。赤玉と白玉が1個ずつ出る確率はどれだけか。',a,b,KT4,KTI4,4);},
  function(R){var w=R.pick(['Pが勝つ','Qが勝つ','引き分けになる']),g=w==='引き分けになる'?6:15,ans=Fr(g,36);
   VV({t:'game',w:w});return out('PとQの2人が、1から6までの目があるサイコロを1個ずつ振り、大きい目を出したほうを勝ちとする。同じ目のときは引き分けとする。'+w+'確率はどれだけか。',ans,[[1,6],[1,3],[5,12],[1,2],[7,12]].filter(function(x){return Fr(x[0],x[1])+''!==ans+'';}),0,'全ての目の出方（36通り）を「Pの勝ち」「引き分け」「Qの勝ち」に分ける',
    BW('36通り',[['Pの勝ち',w==='Pが勝つ'?'?':'','15通り',.42,w==='Pが勝つ'],['引き分け',g===6?'?':'','6通り',.16,g===6],['Qの勝ち',w==='Qが勝つ'?'?':'','15通り',.42,w==='Qが勝つ']]),
    '引き分け 6通り<br>'+(g===6?'':'残り30通りをPとQで半分ずつ → 15通り<br>')+g+' ÷ 36 ＝ '+s(ans));}
 ],
 real:[
  function(R){var a=R.pick([50,60,70,80]),b=R.pick([25,50,75]);return ind({q:'PとQの2人がある資格試験を受ける。Pが合格する確率は'+a+'%、Qが合格する確率は'+b+'%である。PとQの少なくともどちらか1人が合格する確率は何%か。',a:Fr(a,100),b:Fr(b,100),k:'al',pct:1,KT:KT4,an:'P',bn:'Q',inw:KTI4('P','Q','○は合格、×は不合格。'),t:TG,m:'!?'});},
  function(R){return pqP(R,'ex4',KT4,KTI4,TP4);},
  function(R){var m=R.pick([3,4,5,6]),L=[];for(var t=m;t<=12;t+=m)if(t>=2)L.push(t);return sumQ('1から6までの目があるサイコロを2個同時に振る。出た目の和が'+m+'の倍数になる確率はどれだけか。',L,'和が'+L.join('か'),'全ての目の出方（36通り）を「和が'+m+'の倍数」「それ以外」に分ける');},
  function(R){var n=R.int(5,6),k=R.int(2,n-2);return coinK(n,[k],'表がちょうど'+k+'回出る','全ての出方（2を'+n+'回掛けて'+Math.pow(2,n)+'通り）を「表がちょうど'+k+'回」「それ以外」に分ける');},
  function(R){var n=R.int(8,12);return lotAL(n,R.int(2,4));},
  function(R){var p=R.pick([[3,5],[2,5],[4,6],[3,4],[2,3]]),N=R.pick([30,40,50,60]);return multOr('1から'+N+'までの数字が1つずつ書かれた'+N+'枚のカードから、1枚を引く。引いたカードの数字が'+p[0]+'の倍数または'+p[1]+'の倍数である確率はどれだけか。',N,p[0],p[1],0);},
  function(R){var a=R.int(4,6),b=R.int(3,5);if(a===b)a++;return rwo('赤玉'+a+'個と白玉'+b+'個が入った袋から、玉を同時に2個取り出す。赤玉と白玉が1個ずつ出る確率はどれだけか。',a,b,KT4,KTI4,4);},
  function(R){var d=R.int(1,4),g=(6-d)*(7-d)/2,ans=Fr(g,36),ln=[];for(var q=1;q<=6-d;q++){var c=6-d-q+1;ln.push('Qが'+q+' → '+(q===1?'Pは'+(q+d)+(q+d<6?'〜6':'')+'の':'')+c+'通り');}
   VV({t:'diff',d:d});return out('PとQの2人が、1から6までの目があるサイコロを1個ずつ振る。Pの出した目がQの出した目より'+d+'以上大きくなる確率はどれだけか。',ans,[[g+1,36],[g-1,36],[(7-d)*(8-d)/2,36],[(5-d)*(6-d)/2||1,36],[5,12]],0,'全ての目の出方（36通り）を「Pの目がQの目より'+d+'以上大きい」「それ以外」に分ける',
    BW('36通り',[[d+'以上大きい','?',g+'通り',wd(g/36),1],['それ以外','',(36-g)+'通り',wd(1-g/36)]]),ln.join('、')+'<br>'+(ln.length>1?ln.map(function(x,i){return 6-d-i;}).join(' ＋ ')+' ＝ ':'')+g+'（通り）<br>'+g+' ÷ 36 ＝ '+s(ans));},
  function(R){var L=R.shuffle([[1,2],[2,3],[3,4],[1,3],[3,5],[2,5],[4,5]]).slice(0,3),a=L[0],b=L[1],c=L[2],nn=M(N1(a),N1(b),N1(c)),ans=N1(nn);
   VV({t:'three',ps:[a,b,c],k:'al',p:0});return out('P、Q、Rの3人がある問題を解く。Pが正解する確率は'+s(a)+'、Qが正解する確率は'+s(b)+'、Rが正解する確率は'+s(c)+'である。3人のうち少なくとも1人が正解する確率はどれだけか。',ans,[nn,M(a,b,c),N1(M(a,b,c)),[1,2],[3,4]],0,'全ての場合を「少なくとも1人が正解」「3人とも不正解」に分ける',
    BW('',[['少なくとも1人正解','?','',.8,1],['3人とも不正解',s(nn),'',.2]]),'3人とも不正解 '+[N1(a),N1(b),N1(c)].map(s).join(' × ')+' ＝ '+s(nn)+'<br>少なくとも1人 1 − '+s(nn)+' ＝ '+s(ans));},
  function(R){return atLeastDie(R,R.int(3,4),4);}
 ]};

/* ===== 指標5 ===== */
function rep(q,n,k,p,lb,inw,pct,ex){var V=pct?dc:s,cs=combos(n,k),one=M.apply(null,Array.apply(null,Array(n)).map(function(_,i){return i<k?p:N1(p);})),ans=M(one,[cs.length,1]),rows=[],hd=[];
 for(var i=0;i<n;i++)hd.push((i+1)+'回目');hd.push('確率');
 cs.forEach(function(c){var r=[];for(var i=0;i<n;i++)r.push(c.indexOf(i)>=0?lb[0]:lb[1]);r.push(V(one));rows.push(r);});rows.push(['計'].concat(Array(n-1).fill('')).concat(['!?']));
 var fl=[];for(var i=0;i<n;i++)fl.push(V(i<k?p:N1(p)));
 VV({t:'rep',n:n,k:k,pr:p,p:pct});return out(q,ans,[one,M(p,[k,1]),M(one,[n,1]),Fr(k,n),N1(ans),M(one,[cs.length+1,1])].filter(function(x){return x[0]<=x[1];}),pct,inw,PT5(hd,rows),'1通りの確率 '+fl.join(' × ')+' ＝ '+V(one)+'<br>'+(ex||'')+V(one)+' × '+cs.length+' ＝ '+V(ans)+pend(ans,pct),{});}
function three(q,ps,kind,pct,inw,lb){var V=pct?dc:s,a=ps[0],b=ps[1],c=ps[2],ns=ps.map(N1),nn=M(ns[0],ns[1],ns[2]),ans,fig,calc,wr;
 if(kind==='al'){ans=N1(nn);fig=PT5(['P','Q','R','確率'],[['×','×','×',ns.map(V).join(' × ')],['計','','','!1 − '+V(nn)]]);calc='3人とも'+lb+' '+ns.map(V).join(' × ')+' ＝ '+V(nn)+'<br>少なくとも1人 1 − '+V(nn)+' ＝ '+V(ans);wr=[nn,M(a,b,c),N1(M(a,b,c)),[1,2],[1,4]];}
 else {var rows=[],vs=[];for(var i=0;i<3;i++){var r=[],f=[];for(var j=0;j<3;j++){var on=kind==='two'?j!==i:j===i;r.push(on?'○':'×');f.push(on?ps[j]:ns[j]);}var pr=M(f[0],f[1],f[2]);vs.push(pr);r.push(f.map(V).join(' × ')+' ＝ '+(pct?V(pr):'')+'');rows.push(r);}
  var D=1;if(!pct){vs.forEach(function(v){D=D*v[1]/gc(D,v[1]);});rows.forEach(function(r,i){r[3]+=rw(vs[i][0]*D/vs[i][1],D);});}
  ans=A(vs[0],vs[1],vs[2]);rows.push(['計','','','!?']);fig=PT5(['P','Q','R','確率'],rows);
  calc=(pct?vs.map(V).join(' ＋ '):vs.map(function(v){return rw(v[0]*D/v[1],D);}).join(' ＋ '))+' ＝ '+V(ans);wr=[vs[0],vs[1],vs[2],A(vs[0],vs[1]),nn,N1(ans)];}
 VV({t:'three',ps:ps,k:kind,p:pct});return out(q,ans,wr,pct,inw,fig,calc+pend(ans,pct),{sec:90});}
function rule(q,a,b,retRed,ask,inw){var n=a+b,R1=[a,n],W1=[b,n],c1,c2,f;
 if(retRed){c1=ask==='w'?[b,n]:[a,n];c2=ask==='w'?[b-1,n-1]:[a,n-1];f=[rw(a,n),rw(b,n),rw(a,n),rw(b-1,n-1)]?[rw(a,n),rw(b,n),rw(a,n-1),rw(b-1,n-1)]:0;f=[rw(a,n),rw(b,n),rw(a,n-1),rw(b-1,n-1)];}
 else {c1=ask==='w'?[b,n-1]:[a-1,n-1];c2=ask==='w'?[b,n]:[a,n];f=[rw(a-1,n-1),rw(b,n-1),rw(a,n),rw(b,n)];}
 var x=M(R1,c1),y=M(W1,c2),ans=A(x,y);
 var v=ask==='w'?['','!'+s(x),'','!'+s(y)]:['!'+s(x),'','!'+s(y),''],cl=ask==='w'?'白':'赤',cnt1=ask==='w'?(retRed?b:b):(retRed?a:a-1),cnt2=ask==='w'?(retRed?b-1:b):(retRed?a:a);
 var calc='赤 → '+(retRed?'戻す → '+n+'個中'+cl+cnt1:'戻さない → '+(n-1)+'個中'+cl+cnt1)+'個　'+mlR([R1,c1])+'<br>白 → '+(retRed?'戻さない → '+(n-1)+'個中'+cl+cnt2:'戻す → '+n+'個中'+cl+cnt2)+'個　'+mlR([W1,c2])+'<br>'+s(x)+' ＋ '+s(y)+' ＝ '+s(ans);
 VV({t:'rule',a:a,b:b,ret:retRed,ask:ask});return out(q,ans,[x,y,ask==='w'?Fr(b,n):Fr(a,n),M(R1,R1),M(W1,W1),A(M(R1,[a,n]),M(W1,[b,n]))].filter(function(z){return z+''!==ans+'';}),0,inw,KT5('1回目',[rw(a,n),rw(b,n)],'2回目',f,v),calc);}
function lot5(q,n,k,kind){var L=lot(n,k),fig,ans,calc,wr,v,inw=KTI5('A','B','○は当たり、×ははずれ。');
 var ww=M(L.aw,L.ww),wl=M(L.aw,L.wl),lw=M(L.al,L.lw),ll=M(L.al,L.ll);
 if(kind==='both'){ans=ww;v=['!?','','',''];calc=mlR([L.aw,L.ww]);}
 else if(kind==='bonly'){ans=lw;v=['','','!?',''];calc=mlR([L.al,L.lw]);}
 else if(kind==='none'){ans=ll;v=['','','','!?'];calc=mlR([L.al,L.ll]);}
 else if(kind==='al'){ans=N1(ll);v=['!?','!?','!?',s(ll)];calc='2人ともはずれ '+mlR([L.al,L.ll])+'<br>少なくとも1人 1 − '+s(ll)+' ＝ '+s(ans);}
 else {ans=A(ww,lw);v=['!'+s(ww),'','!'+s(lw),''];calc=mlR([L.aw,L.ww])+'<br>'+mlR([L.al,L.lw])+'<br>'+s(ww)+' ＋ '+s(lw)+' ＝ '+s(ans);}
 VV({t:'lot',n:n,k:k,w:kind});return out(q,ans,[ww,wl,lw,ll,N1(ll),L.aw,M(L.aw,L.aw)].filter(function(z){return z+''!==ans+'';}),0,kind==='simul'?inw:inw,lfig(KT5,'A','B',L,v),calc);}
var S5={
 concept:[
  function(R){var n=R.int(5,8),k=R.int(2,3);return lot5('当たりが'+k+'本入った'+n+'本のくじがある。このくじを、AとBがこの順に1本ずつ引く。引いたくじは元に戻さない。Bが当たりを引く確率はどれだけか。',n,k,'b');},
  function(R){var k=R.int(1,2);return rep('1枚の硬貨を3回投げる。表がちょうど'+k+'回出る確率はどれだけか。',3,k,[1,2],['表','裏'],'表が出るのが'+(k===1?'1回目・2回目・3回目の3通り':'どの2回かの3通り')+'に分ける',0,'表が出る回の選び方 3C'+k+' ＝ 3<br>');},
  function(R){var L=R.shuffle([[1,2],[1,3],[1,4],[2,3],[1,5]]).slice(0,3);return three('P、Q、Rの3人がある問題を解く。Pが正解する確率は'+s(L[0])+'、Qが正解する確率は'+s(L[1])+'、Rが正解する確率は'+s(L[2])+'である。3人のうち少なくとも1人が正解する確率はどれだけか。',L,'al',0,'1から「3人とも不正解」を引く','不正解');}
 ],
 practice:[
  function(R){var n=R.int(6,10),k=R.int(2,4);return lot5('当たりが'+k+'本入った'+n+'本のくじがある。このくじを、AとBがこの順に1本ずつ引く。引いたくじは元に戻さない。2人とも当たりを引く確率はどれだけか。',n,k,'both');},
  function(R){var a=R.int(2,5),b=R.int(2,4),n=a+b,L=lot(n,a),ans=M(L.al,L.lw);
   VV({t:'wr',a:a,b:b});return out('袋の中に赤玉が'+a+'個、白玉が'+b+'個入っている。この袋から玉を1個ずつ2回取り出す。取り出した玉は袋に戻さない。1回目に白玉、2回目に赤玉を取り出す確率はどれだけか。',ans,[M([b,n],[a,n]),M(L.aw,L.wl),A(M(L.aw,L.wl),ans),Fr(a,n),M(L.al,L.ll)],0,KTI5('1回目','2回目','○は赤玉、×は白玉。'),
    lfig(KT5,'1回目','2回目',L,['','','!?','']),mlR([L.al,L.lw]));},
  function(R){var n=R.int(3,4),L=[];for(var i=1;i<=n;i++)L.push(i+'回目');return rep('AとBの2人がジャンケンを'+n+'回する。1回のジャンケンでAが勝つ確率は1/3である。'+n+'回のうちAがちょうど1回だけ勝つ確率はどれだけか。',n,1,[1,3],['勝','勝以外'],'Aが勝つのが'+L.join('・')+'の'+n+'通りに分ける');},
  function(R){var a=R.int(3,5),b=R.int(2,3);return rule('袋の中に赤玉が'+a+'個、白玉が'+b+'個入っている。この袋から玉を1個取り出し、赤玉なら袋に戻し、白玉なら戻さずに、もう1個取り出す。2回目に白玉を取り出す確率はどれだけか。',a,b,1,'w',KTI5('1回目','2回目','○は赤玉、×は白玉。1回目の色で袋の中が変わる。'));},
  function(R){var L=R.shuffle([[2,3],[1,2],[3,5],[3,4],[2,5],[1,3]]).slice(0,3);return three('P、Q、Rの3人がある試験を受ける。Pが合格する確率は'+s(L[0])+'、Qが合格する確率は'+s(L[1])+'、Rが合格する確率は'+s(L[2])+'である。3人のうち少なくとも1人が合格する確率はどれだけか。',L,'al',0,'1から「3人とも不合格」を引く','不合格');},
  function(R){var n=R.int(5,8),k=R.int(2,3),o=lot5('当たりが'+k+'本入った'+n+'本のくじがある。このくじを、AとBが同時に1本ずつ引く。少なくともどちらか1人が当たりを引く確率はどれだけか。',n,k,'al');o.inw=KTI5('A','B','同時に引くのは、戻さずに続けて引くのと同じ。○は当たり、×ははずれ。');return o;}
 ],
 applied:[
  function(R){var n=R.int(8,12),k=R.int(2,4);return lot5('当たりが'+k+'本入った'+n+'本のくじがある。このくじを、AとBがこの順に1本ずつ引く。引いたくじは元に戻さない。Bだけが当たりを引く確率はどれだけか。',n,k,'bonly');},
  function(R){var n=R.int(7,10),k=R.int(2,4);return lot5('当たりが'+k+'本入った'+n+'本のくじがある。このくじを、AとBがこの順に1本ずつ引く。引いたくじは元に戻さない。Bが当たりを引く確率はどれだけか。',n,k,'b');},
  function(R){var t=R.int(4,6),p=Fr(7-t,6),k=R.int(1,2);return rep('1個のサイコロを3回振る。'+t+'以上の目がちょうど'+k+'回出る確率はどれだけか。',3,k,p,['○','×'],t+'以上の目が出る確率は '+(7-t)+'/6'+(p[1]!==6?' ＝ '+s(p):'')+'。出る'+k+'回の選び方で分ける',0,'選び方 3C'+k+' ＝ 3<br>');},
  function(R){var n=R.int(4,5),d=Math.pow(2,n),g=n+1,ans=Fr(g,d);
   VV({t:'coinK',n:n,ks:[n-1,n]});return out('1枚の硬貨を'+n+'回投げる。表が'+(n-1)+'回以上出る確率はどれだけか。',ans,[[n,d],[1,d],[g+1,d],[1,4],[g,2*d]],0,'「表が'+(n-1)+'回」と「表が'+n+'回」に分けて足す',
    PT5(['表の回数','選び方','確率'],[[(n-1)+'回',n+'C'+(n-1)+' ＝ '+n,n+'/'+d],[n+'回',n+'C'+n+' ＝ 1','1/'+d],['計','','!?']]),'1通りの確率 (1/2)<sup>'+n+'</sup> ＝ 1/'+d+'<br>'+n+'/'+d+' ＋ 1/'+d+' ＝ '+s(ans));},
  function(R){var L=R.shuffle([[1,2],[2,3],[3,4],[1,3],[1,4]]).slice(0,3);return three('P、Q、Rの3人がある問題を解く。Pが正解する確率は'+s(L[0])+'、Qが正解する確率は'+s(L[1])+'、Rが正解する確率は'+s(L[2])+'である。3人のうちちょうど2人が正解する確率はどれだけか。',L,'two',0,'不正解の1人がP・Q・Rの3通りに分けて足す');},
  function(R){var a=R.int(3,5),b=R.int(2,3);return rule('袋の中に赤玉が'+a+'個、白玉が'+b+'個入っている。この袋から玉を1個取り出し、赤玉なら戻さず、白玉なら袋に戻して、もう1個取り出す。2回目に赤玉を取り出す確率はどれだけか。',a,b,0,'r',KTI5('1回目','2回目','○は赤玉、×は白玉。1回目の色で袋の中が変わる。'));},
  function(R){var p=R.pick([[3,5],[2,3],[1,2],[3,4],[2,5]]),w=R.pick([[2,3],[3,4],[3,5]]),l=R.pick([[1,3],[1,4],[2,5]]),x=M(p,N1(w)),y=M(N1(p),l),ans=A(x,y);
   VV({t:'match',pp:p,w:w,l:l});return out('AとBが2回試合をする。1回目にAが勝つ確率は'+s(p)+'である。2回目にAが勝つ確率は、1回目にAが勝ったときは'+s(w)+'、負けたときは'+s(l)+'である。引き分けはないものとする。Aが1勝1敗になる確率はどれだけか。',ans,[x,y,M(p,w),M(N1(p),N1(l)),A(M(p,w),M(N1(p),N1(l)))].filter(function(z){return z+''!==ans+'';}),0,KTI5('1回目','2回目','○はAの勝ち、×はAの負け。'),
    KT5('1回目',[s(p),s(N1(p))],'2回目',[s(w),s(N1(w)),s(l),s(N1(l))],['','!'+s(x),'!'+s(y),'']),'勝ち→負け '+ml([p,N1(w)])+'<br>負け→勝ち '+ml([N1(p),l])+'<br>'+s(x)+' ＋ '+s(y)+' ＝ '+s(ans));},
  function(R){var a=R.int(2,5),b=R.int(2,4);return rwo('袋の中に赤玉が'+a+'個、白玉が'+b+'個入っている。この袋から同時に2個の玉を取り出す。2個とも同じ色である確率はどれだけか。',a,b,KT5,KTI5,5,'same');}
 ],
 real:[
  function(R){var n=R.int(12,20),k=R.int(3,6);return lot5('当たりが'+k+'本入った'+n+'本のくじがある。このくじを、AとBがこの順に1本ずつ引く。引いたくじは元に戻さない。2人ともはずれを引く確率はどれだけか。',n,k,'none');},
  function(R){var n=R.int(10,15),k=R.int(2,4);return lot5('当たりが'+k+'本入った'+n+'本のくじがある。このくじを、AとBがこの順に1本ずつ引く。引いたくじは元に戻さない。少なくともどちらか1人が当たりを引く確率はどれだけか。',n,k,'al');},
  function(R){var p=R.pick([40,60,70,80]);return rep('PとQがある競技で3回対戦する。1回の対戦でPがQに勝つ確率は'+p+'%である。引き分けはないものとする。Pがちょうど2回勝つ確率は何%か。',3,2,Fr(p,100),['勝','負'],'Pが負けるのが1回目・2回目・3回目の3通りに分ける',1);},
  function(R){var n=R.int(3,4),k=R.int(1,6),p=[1,6],one=M.apply(null,[p].concat(Array(n-1).fill([5,6]))),ans=M(one,[n,1]);
   VV({t:'dieOnce',n:n,k:k});return out('1個のサイコロを'+n+'回振る。'+k+'の目がちょうど1回出る確率はどれだけか。',ans,[one,Fr(1,6),M(one,[n-1,1]),N1(ans),Fr(n,6)],0,k+'の目が出るのが何回目かの'+n+'通りに分ける',
    PT5([k+'の目の回','選び方','確率'],[[n+'回のうち1回',n+'C1 ＝ '+n,'1/6 × (5/6)<sup>'+(n-1)+'</sup> ＝ '+s(one)],['計','','!?']]),'1通りの確率 1/6'+' × 5/6'.repeat(n-1)+' ＝ '+s(one)+'<br>'+s(one)+' × '+n+' ＝ '+s(ans));},
  function(R){var L=[R.pick([60,70,80,90]),R.pick([50,60,70]),R.pick([40,50,60])].map(function(x){return Fr(x,100);});
   return three('P、Q、Rの3人がある試験を受ける。Pが合格する確率は'+pc(L[0])+'%、Qが合格する確率は'+pc(L[1])+'%、Rが合格する確率は'+pc(L[2])+'%である。3人のうち少なくとも1人が合格する確率は何%か。',L,'al',1,'1から「3人とも不合格」を引く','不合格');},
  function(R){var L=[R.pick([50,60,70]),R.pick([40,50,60]),R.pick([30,40,50])].map(function(x){return Fr(x,100);});
   return three('P、Q、Rの3人がある問題を解く。Pが正解する確率は'+pc(L[0])+'%、Qが正解する確率は'+pc(L[1])+'%、Rが正解する確率は'+pc(L[2])+'%である。3人のうちちょうど1人だけが正解する確率は何%か。',L,'one',1,'正解の1人がP・Q・Rの3通りに分けて足す');},
  function(R){var a=R.int(3,5),b=R.int(3,4);return rule('袋の中に赤玉が'+a+'個、白玉が'+b+'個入っている。この袋から玉を1個取り出し、赤玉なら袋に戻し、白玉なら戻さずに、もう1個取り出す。2回目に白玉を取り出す確率はどれだけか。',a,b,1,'w',KTI5('1回目','2回目','○は赤玉、×は白玉。1回目の色で袋の中が変わる。'));},
  function(R){var n=R.int(8,12),k=R.int(2,3),f=[[n-k,n],[n-k-1,n-1],[k,n-2]],ans=M(f[0],f[1],f[2]);
   VV({t:'conly',n:n,k:k});return out('当たりが'+k+'本入った'+n+'本のくじがある。このくじを、A、B、Cの3人がこの順に1本ずつ引く。引いたくじは元に戻さない。Cだけが当たりを引く確率はどれだけか。',ans,[Fr(k,n),M([n-k,n],[n-k,n],[k,n]),M([n-k,n],[k,n-1]),Fr(k,n-2),A(ans,ans)],0,'Aがはずれ、Bがはずれ、Cが当たりの順に、残りのくじの本数で掛ける',
    PT5(['A','B','C','確率'],[['×','×','○',f.map(function(x){return rw(x[0],x[1]);}).join(' × ')],['計','','','!?']]),'Aはずれ '+rw(n-k,n)+' → Bはずれ '+rw(n-k-1,n-1)+' → C当たり '+rw(k,n-2)+'<br>'+mlR(f),{sec:90});},
  function(R){var p=R.pick([60,70,80]),q=R.pick([20,30,40,50]),P1=Fr(p,100),Q1=Fr(q,100),x=M(P1,P1),y=M(N1(P1),Q1),ans=A(x,y);
   VV({t:'wx',p:P1,q:Q1,pc:1});return out('ある地域では、晴れた日の翌日が晴れる確率は'+p+'%、晴れでない日の翌日が晴れる確率は'+q+'%である。今日が晴れのとき、あさってが晴れる確率は何%か。',ans,[x,y,P1,Q1,M(P1,Q1)],1,KTI5('明日','あさって','○は晴れ、×は晴れ以外。明日の天気であさっての確率が変わる。'),
    KT5('明日',[dc(P1),dc(N1(P1))],'あさって',[dc(P1),dc(N1(P1)),dc(Q1),dc(N1(Q1))],['!'+dc(x),'','!'+dc(y),'']),'晴れ→晴れ '+ml([P1,P1],1)+'<br>晴れ以外→晴れ '+ml([N1(P1),Q1],1)+'<br>'+dc(x)+' ＋ '+dc(y)+' ＝ '+dc(ans)+pend(ans,1));},
  function(R){var a=R.int(3,5),b=R.int(4,7);return rwo('袋の中に赤玉が'+a+'個、白玉が'+b+'個入っている。この袋から同時に2個の玉を取り出す。赤玉と白玉が1個ずつである確率はどれだけか。',a,b,KT5,KTI5,5);}
 ]};

/* ===== 別の方法で解く（verify）：起こり方を全部書き出し、分数で足し合わせる ===== */
function q_(n,d){var g=gc(n,d)||1;return {n:n/g,d:d/g};}
function qa(x,y){return q_(x.n*y.d+y.n*x.d,x.d*y.d);}
function qm(x,y){return q_(x.n*y.n,x.d*y.d);}
function qf(f){return q_(f[0],f[1]);}
function q1(x){return q_(x.d-x.n,x.d);}
function cntP(c,t){return q_(c,t);}
function seqs(n,b,f){var t=[];(function g(){if(t.length===n){f(t);return;}for(var i=0;i<b;i++){t.push(i);g();t.pop();}})();}
function ord(n,r,f){var u=[],t=[];(function g(){if(t.length===r){f(t);return;}for(var i=0;i<n;i++)if(!u[i]){u[i]=1;t.push(i);g();t.pop();u[i]=0;}})();}
function VK(v,o){var Z=q_(0,1),c=0,tot=0,i;
 function W(ps,pred){var r=q_(0,1);seqs(ps.length,2,function(t){var w=q_(1,1);t.forEach(function(x,j){w=qm(w,x?qf(ps[j]):q1(qf(ps[j])));});if(pred(t))r=qa(r,w);});return r;}
 switch(v.t){
 case 'ind':Z=W([v.a,v.b],function(t){var A=t[0],B=t[1];return v.k==='both'?A&&B:v.k==='none'?!A&&!B:v.k==='al'?A||B:v.k==='oa'?A&&!B:A!==B;});break;
 case 'die':for(i=1;i<=6;i++){tot++;if(v.f==='m'?i%v.x===0:v.f==='ge'?i>=v.x:v.f==='even'?i%2===0:i%2===1)c++;}Z=cntP(c,tot);break;
 case 'urn':v.c.forEach(function(k,j){for(var q=0;q<k;q++){tot++;if(j===v.i)c++;}});Z=cntP(c,tot);break;
 case 'sum':seqs(2,6,function(t){tot++;if(v.L.indexOf(t[0]+t[1]+2)>=0)c++;});Z=cntP(c,tot);break;
 case 'rwo':ord(v.a+v.b,2,function(t){tot++;var x=t[0]<v.a,y=t[1]<v.a;if(v.k==='same'?x===y:x!==y)c++;});Z=cntP(c,tot);break;
 case 'cmp':Z=q1(qf(v.a));break;
 case 'coinAll':seqs(v.n,2,function(t){tot++;if(t.every(function(x){return x===1;}))c++;});Z=cntP(c,tot);break;
 case 'coinAL':seqs(v.n,2,function(t){tot++;if(t.indexOf(1)>=0)c++;});Z=cntP(c,tot);break;
 case 'coinK':seqs(v.n,2,function(t){tot++;if(v.ks.indexOf(t.filter(function(x){return x;}).length)>=0)c++;});Z=cntP(c,tot);break;
 case 'lot':ord(v.n,2,function(t){tot++;var A=t[0]<v.k,B=t[1]<v.k;if(v.w==='both'?A&&B:v.w==='b'?B:v.w==='bonly'?!A&&B:v.w==='none'?!A&&!B:A||B)c++;});Z=cntP(c,tot);break;
 case 'lotS':ord(v.n,2,function(t){if(t[0]>t[1])return;tot++;if(t[0]<v.k||t[1]<v.k)c++;});Z=cntP(c,tot);break;
 case 'repl':seqs(2,v.n,function(t){tot++;if(t[0]>=v.k&&t[1]>=v.k)c++;});Z=cntP(c,tot);break;
 case 'conly':ord(v.n,3,function(t){tot++;if(t[0]>=v.k&&t[1]>=v.k&&t[2]<v.k)c++;});Z=cntP(c,tot);break;
 case 'mo':for(i=1;i<=v.N;i++){tot++;if(i%v.a===0||i%v.b===0)c++;}Z=cntP(c,tot);break;
 case 'dieAL':seqs(v.n,6,function(t){tot++;if(t.indexOf(v.k-1)>=0)c++;});Z=cntP(c,tot);break;
 case 'dieOnce':seqs(v.n,6,function(t){tot++;if(t.filter(function(x){return x===v.k-1;}).length===1)c++;});Z=cntP(c,tot);break;
 case 'game':seqs(2,6,function(t){tot++;if(v.w==='Pが勝つ'?t[0]>t[1]:v.w==='Qが勝つ'?t[0]<t[1]:t[0]===t[1])c++;});Z=cntP(c,tot);break;
 case 'diff':seqs(2,6,function(t){tot++;if(t[0]-t[1]>=v.d)c++;});Z=cntP(c,tot);break;
 case 'three':Z=W(v.ps,function(t){var h=t[0]+t[1]+t[2];return v.k==='al'?h>0:v.k==='two'?h===2:h===1;});break;
 case 'rep':var ps=[];for(i=0;i<v.n;i++)ps.push(v.pr);Z=W(ps,function(t){return t.filter(function(x){return x;}).length===v.k;});break;
 case 'rule':var bag=[];for(i=0;i<v.a+v.b;i++)bag.push(i<v.a?'r':'w');bag.forEach(function(b,j){var red=b==='r',back=v.ret?red:!red,b2=back?bag:bag.filter(function(_,q){return q!==j;});
   var h=b2.filter(function(x){return x===v.ask;}).length;Z=qa(Z,qm(q_(1,bag.length),q_(h,b2.length)));});break;
 case 'wr':ord(v.a+v.b,2,function(t){tot++;if(t[0]>=v.a&&t[1]<v.a)c++;});Z=cntP(c,tot);break;
 case 'match':[1,0].forEach(function(x){var p1=x?qf(v.pp):q1(qf(v.pp)),p2=qf(x?v.w:v.l);Z=qa(Z,qm(p1,x?q1(p2):p2));});break;
 case 'wx':Z=qa(qm(qf(v.p),qf(v.p)),qm(q1(qf(v.p)),qf(v.q)));break;
 }
 if(v.p||v.pc){var x=Math.round(Z.n/Z.d*1000)/10,d=o&&o.c.some(function(y){return y.indexOf('.')>=0;});return (d?x.toFixed(1):String(x))+'%';}
 return Z.d===1?String(Z.n):Z.n+'/'+Z.d;}

[[3,S3,'kk3'],[4,S4,'kk4'],[5,S5,'kk5']].forEach(function(L){for(var st in L[1])L[1][st].forEach(function(mk,i){add(L[0],st,L[2]+st.charAt(0)+'-g'+(i+1),mk);});});
})();
