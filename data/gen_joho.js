/* 情報の読み取り：数値を変える問題（テンプレート）。既存の問題（joho_4.js）の文と構造はそのまま、数値だけ毎回変える。
   joho_4.js の JOHK・JOHT・JOHTB・JOHI を使う。元の問題は残す。 */
(function(){
var B=BANK['情報の読み取り'][4],L=['ア','イ','ウ'],LV=null;
function k(x){return Math.round(x*1e6)/1e6;}
function CH(ans,ws,step,u){u=u||'円';ans=k(ans);var v=[ans];
 ws.forEach(function(w){w=k(w);if(v.length<5&&w>=0&&v.indexOf(w)<0&&w===Math.round(w))v.push(w);});
 for(var i=1;v.length<5;i++)[ans+i*step,ans-i*step].forEach(function(w){w=k(w);if(v.length<5&&w>0&&v.indexOf(w)<0)v.push(w);});
 v.sort(function(a,b){return a-b;});return {c:v.map(function(x){return x+u;}),a:v.indexOf(ans)};}
function hm(m){var h=Math.floor(m/60),r=m%60;return (h?h+'時間':'')+(r?r+'分':'');}
function Q(o,ch){o.c=ch.c;o.a=ch.a;o.inwh='条件';return o;}
/* ア・イ・ウの照合。cd:[{h:列名, ok:fn(r), lab:fn(r)}]、any:「いずれか」 */
function KK(R,o){for(var t=0;;t++){var rows=[o.row(R,0),o.row(R,1),o.row(R,2)];
 var res=rows.map(function(r){var m=o.cd.map(function(c){return c.ok(r);});return {m:m,j:o.judge?o.judge(m,r):o.any?m.some(Boolean):m.every(Boolean)};});
 var n=res.filter(function(x){return x.j;}).length;if(n===0||n===3)continue;
 var txt=rows.map(o.txt);if(new Set(txt).size<3)continue;
 if(o.need&&!o.need(res,rows))continue;
 var tr=rows.map(function(r,i){return [L[i]].concat(o.cd.map(function(c,j){return o.cell?o.cell(c,r,res[i].m[j]):(res[i].m[j]?'○':'×');}),[res[i].j?'○':'×']);});
 var calc=(o.pre?o.pre+'<br>':'')+rows.map(function(r,i){var m=res[i].m,j=res[i].j;
  if(o.line)return L[i]+'：'+o.line(r,m,j);
  if(o.any){if(j){var p=m.indexOf(true);return L[i]+'：'+o.cd[p].lab(r)+'○ → ○';}return L[i]+'：どちらも× → ×';}
  if(j)return L[i]+'：'+o.cd.map(function(c){return c.lab(r)+'○';}).join('、')+' → ○';
  var f=m.indexOf(false);return L[i]+'：'+o.cd[f].lab(r)+'× → ×';}).join('<br>');
 LV={rows:rows,P:o.P||{}};return JOHK(o.q(rows.map(function(r,i){return L[i]+'　'+txt[i];}).join('<br>')),['',].concat(o.cd.map(function(c){return c.h;}),[o.jh||'判定']),tr,calc,o.inw);}}
/* 時間で数える料金（駐車場・レンタサイクル） */
function cnt(m,u){return Math.ceil(m/u);}

/* ---------- 概念 ---------- */
B.concept.push({id:'g-joho-c0',make:function(R){var Y=R.pick([2,3,5]),D=R.pick([12,15,18]);
 return KK(R,{P:{Y:Y,D:D},row:function(R){return {y:R.int(Y-2<1?1:Y-2,Y+3),d:R.int(D-4,D+5)};},txt:function(r){return '勤続年数'+r.y+'年、今月の出勤日数'+r.d+'日';},
  cd:[{h:'勤続'+Y+'年以上',ok:function(r){return r.y>=Y;},lab:function(r){return r.y+'年';}},{h:'出勤'+D+'日以上',ok:function(r){return r.d>=D;},lab:function(r){return r.d+'日';}}],
  pre:'「すべて満たす」なので、○が2つそろったものだけが当てはまる',inw:'勤続'+Y+'年以上・出勤'+D+'日以上',
  q:function(x){return 'ある会社の社員食堂では、次の条件をすべて満たす社員に食事券を配る。<br>・勤続年数が'+Y+'年以上である<br>・今月の出勤日数が'+D+'日以上である<br>次のア、イ、ウのうち、食事券を受け取れる社員はどれか。<br>'+x;}});}});
function museum(R,o){var A=R.pick(o.A),C=A/2,G=R.pick(o.G),d=R.pick(o.d),a=R.int(Math.ceil(G/2),G),c=R.int(Math.max(1,G-a),G-a+6),n=a+c,t=A*a+C*c,x=t*(10-d)/10;LV={k:'mus',A:A,C:C,d:d,a:a,c:c,G:G};
 return Q({q:'ある美術館の入館料は、大人1人'+A+'円、'+o.cn+'1人'+C+'円である。'+G+'人以上の団体は、全員が入館料の'+d+'割引きになる。大人'+a+'人と'+o.cn2+c+'人の団体の入館料は全部で何円か。',inw:JOHI,
  fig:JOHT(['','人数','1人','金額'],[['大人',a+'人',A+'円',A*a+'円'],[o.cn2,c+'人',C+'円',C*c+'円'],['計',n+'人','',t+'円'],[d+'割引き後','','','?']]),
  calc:A+' × '+a+' ＋ '+C+' × '+c+' ＝ '+t+'<br>'+n+'人は'+G+'人以上なので'+d+'割引き<br>'+t+' × '+k(1-d/10)+' ＝ '+x},CH(x,[t,A*a*(10-d)/10+C*c,(A+C)*n*(10-d)/20,t*(10-d-1)/10],A));}
B.concept.push({id:'g-joho-c1',make:function(R){return museum(R,{A:[800,1000,1200,1400],G:[10],d:[1],cn:'子ども',cn2:'子ども'});}});
function park(R,o){for(;;){var F=R.pick(o.F),u=R.pick(o.u),p=R.pick(o.p),T=F+R.int(o.min,o.max);if((T-F)%u===0&&!o.even)continue;var n=cnt(T-F,u),x=n*p,cap=o.cap?R.pick(o.cap):0;
 if(o.cap&&(o.over?x<=cap:x>=cap))continue;if(o.cap&&o.over&&x-cap<p)continue;LV={k:'park',F:F,u:u,p:p,T:T,cap:cap};var ans=o.cap?Math.min(x,cap):x,sh=o.shop?R.pick([2000,2500,3000,3500,4000]):0,FF=F;
 var q=o.q(F,u,p,T,cap,sh);
 var rows=[[o.fl(F),hm(F),'0円'],['その後（'+hm(u)+'ごと）',hm(T-F)+' → '+hm(u)+' × '+n,p+'円 × '+n]];if(o.cap)rows.push(['上限','',cap+'円']);rows.push(['計',hm(T),'?']);
 var c=(o.cpre?o.cpre+'<br>':'')+hm(T)+' − '+hm(F)+' ＝ '+hm(T-F)+((T-F)>=60&&(T-F)%60?' ＝ '+(T-F)+'分':'')+'<br>'+((T-F)%u?(T-F)+' ÷ '+u+' ＝ '+k(Math.round((T-F)/u*100)/100)+' → '+n+'回（端数も'+hm(u)+'とする）':hm(u)+' × '+n+'回')+'<br>'+p+' × '+n+' ＝ '+x+(o.cap?(o.over?'<br>上限の'+cap+'円を超えるので '+cap:'（上限の'+cap+'円より少ない）'):'');
 return Q({q:q,inw:JOHI+(o.cap?'（上限は最後に比べる）':o.shop?'（買い物の額で無料の時間が変わる）':''),fig:JOHT(['','時間','料金'],rows),calc:c},
  CH(ans,[x,(n-1)*p,cnt(T,u)*p,(n+1)*p,o.cap?cap-p:-1],p));}}
B.concept.push({id:'g-joho-c2',make:function(R){return park(R,{F:[60],u:[30],p:[100,200,300],min:31,max:150,fl:function(){return '最初の1時間';},
 q:function(F,u,p,T){return 'ある駐車場の料金は、最初の1時間が無料で、その後は30分ごとに'+p+'円である（30分未満の端数も30分とする）。この駐車場に'+hm(T)+'駐車したときの料金は何円か。';}});}});

/* ---------- 練習 ---------- */
B.practice.push({id:'g-joho-p0',make:function(R){var N=R.pick([8,10,12]),M=R.pick([2,3]),W=2;
 return KK(R,{P:{N:N,M:M},row:function(R){var m=R.int(0,M+2),b=R.int(2,N-m+2);return {b:b,m:m,w:R.pick([1,2,2,3])};},txt:function(r){return '本を'+r.b+'冊'+(r.m?'と雑誌を'+r.m+'冊':'')+'、'+r.w+'週間借りる';},
  cd:[{h:'合計'+N+'冊まで',ok:function(r){return r.b+r.m<=N;},lab:function(r){return '合計'+(r.b+r.m)+'冊';}},{h:'雑誌'+M+'冊まで',ok:function(r){return r.m<=M;},lab:function(r){return '雑誌'+r.m+'冊';}},{h:'2週間以内',ok:function(r){return r.w<=W;},lab:function(r){return r.w+'週間';}}],
  inw:'合計'+N+'冊まで・雑誌'+M+'冊まで・2週間以内',
  q:function(x){return 'ある図書館の貸出規定は次のとおりである。<br>・1人'+N+'冊まで借りられる。ただし、雑誌は1人'+M+'冊までとする。<br>・貸出期間は2週間とする。<br>次のア、イ、ウのうち、この規定どおりに借りられるものはどれか。<br>'+x;}});}});
function rental(R,o){for(;;){var b=R.pick(o.b),bp=R.pick(o.bp),ap=R.pick(o.ap),T=b*60+R.int(o.min,o.max);if(o.int&&T%60)continue;if(!o.int&&T%60===0)continue;var n=cnt(T-b*60,60),t=bp+ap*n,x=o.mem?t*0.9:t;LV={k:'rent',b:b,bp:bp,ap:ap,T:T,mem:o.mem};
 var rows=[['最初の'+b+'時間',b+'時間',bp+'円'],['その後（1時間ごと）',hm(T-b*60)+(o.int?'':' → 1時間 × '+n),ap+'円 × '+n]];
 if(o.mem)rows.push(['合計',hm(T),t+'円'],['会員の1割引き後','','?']);else rows.push(['計',hm(T),'?']);
 return Q({q:'あるレンタサイクルの料金は、最初の'+b+'時間までが'+bp+'円で、その後は1時間ごとに'+ap+'円が加算される（1時間未満の端数も1時間とする）。'+(o.mem?'会員は、料金の合計から1割引きになる。会員が':'')+hm(T)+'借りたときの料金は何円か。',
  inw:JOHI+(o.mem?'（割引は合計を出してから）':''),fig:JOHT(['','時間','料金'],rows),
  calc:o.mem?bp+' ＋ '+ap+' × '+n+' ＝ '+t+'<br>'+t+' × 0.9 ＝ '+x:hm(T)+' − '+b+'時間 ＝ '+hm(T-b*60)+' → '+n+'回（端数の'+(T%60)+'分も1時間とする）<br>'+bp+' ＋ '+ap+' × '+n+' ＝ '+t},
  CH(x,o.mem?[t,bp+ap*n*0.9,bp*0.9+ap*n,t-ap]:[bp+ap*(n-1),ap*Math.ceil(T/60),bp+ap*(n+1),bp+ap*Math.ceil(T/60)],o.mem?ap*0.3:ap));}}
B.practice.push({id:'g-joho-p1',make:function(R){return rental(R,{b:[1,2,3],bp:[500,600,800,1000],ap:[200,300,400],min:20,max:200});}});
B.practice.push({id:'g-joho-p2',make:function(R){var G=R.pick([2,3]),S=R.pick([75,80,85]);
 return KK(R,{P:{G:G,S:S},row:function(R){return {g:R.int(1,4),s:S+R.pick([-7,-5,-2,0,2,5,10]),o:R.pick([0,0,0,1])};},txt:function(r){return r.g+'年生、前年度の平均点'+r.s+'点、ほかの奨学金は'+(r.o?'受けている':'受けていない');},
  cd:[{h:G+'年生以上',ok:function(r){return r.g>=G;},lab:function(r){return r.g+'年生';}},{h:S+'点以上',ok:function(r){return r.s>=S;},lab:function(r){return r.s+'点';}},{h:'ほかの奨学金なし',ok:function(r){return !r.o;},lab:function(r){return r.o?'受けている':'なし';}}],
  inw:G+'年生以上・'+S+'点以上・ほかの奨学金なし',
  q:function(x){return 'ある大学の奨学金に応募できるのは、次の条件をすべて満たす学生である。<br>・'+G+'年生以上である<br>・前年度の成績の平均点が'+S+'点以上である<br>・ほかの奨学金を受けていない<br>次のア、イ、ウのうち、この奨学金に応募できる学生はどれか。<br>'+x;}});}});
B.practice.push({id:'g-joho-p3',make:function(R){return museum(R,{A:[1000,1200,1400,1600],G:[20],d:[2],cn:'中学生以下',cn2:'中学生'});}});
B.practice.push({id:'g-joho-p4',make:function(R){var S=R.pick([60,80,100]),Wt=R.pick([2,5,10]),P=R.pick([800,1000,1200]);
 return KK(R,{P:{S:S,Wt:Wt},row:function(R){var a=R.int(S/5-4,S/5+2)*5/3|0;var d=[R.int(3,8)*5,R.int(3,8)*5,R.int(2,6)*5];return {d:d,s:d[0]+d[1]+d[2],w:Wt+R.pick([-2,-1,0,1,2])};},
  need:function(res,rows){return rows.every(function(r){return r.w>0&&Math.abs(r.s-S)<=15;});},
  txt:function(r){return '縦'+r.d[0]+'cm、横'+r.d[1]+'cm、高さ'+r.d[2]+'cm、重さ'+r.w+'kg';},
  cd:[{h:S+'cm以内',ok:function(r){return r.s<=S;},lab:function(r){return r.d.join(' ＋ ')+' ＝ '+r.s+'cm';}},{h:Wt+'kg以内',ok:function(r){return r.w<=Wt;},lab:function(r){return r.w+'kg';}}],
  cell:function(c,r,ok){return (ok?'○ ':'× ')+(c.h.indexOf('cm')>0?r.s+'cm':r.w+'kg');},
  line:function(r,m,j){return r.d.join(' ＋ ')+' ＝ '+r.s+'cm'+(m[0]?'○':'×')+(m[0]?'、'+r.w+'kg'+(m[1]?'○':'×'):'')+' → '+(j?'○':'×');},inw:S+'cm以内・'+Wt+'kg以内',
  q:function(x){return 'ある宅配便では、荷物の縦・横・高さの合計が'+S+'cm以内で、重さが'+Wt+'kg以内のものを、'+P+'円で送ることができる。次のア、イ、ウのうち、'+P+'円で送ることができる荷物はどれか。<br>'+x;}});}});
B.practice.push({id:'g-joho-p5',make:function(R){return park(R,{F:[60],u:[30],p:[100,200,300],min:200,max:420,even:1,cap:[1000,1200,1500],over:1,fl:function(){return '最初の1時間';},
 q:function(F,u,p,T,cap){return 'ある駐車場の料金は、最初の1時間が無料で、その後は30分ごとに'+p+'円である（30分未満の端数も30分とする）。ただし、1日の料金は'+cap+'円を上限とする。この駐車場に'+hm(T)+'駐車したときの料金は何円か。';}});}});

/* ---------- 実践（単純な数値） ---------- */
B.applied.push({id:'g-joho-a0',make:function(R){var A=R.pick([1000,1200,1500]),G=R.pick([10,20,30]),Gp=A*0.8,Sa=R.pick([65,70]),Sp=A/2;
 return KK(R,{P:{A:A,G:G,Gp:Gp,Sa:Sa,Sp:Sp},row:function(R){return {n:R.pick([1,2,3,4,G-5,G,G+5,G+10].filter(function(v){return v>0;})),a:R.pick([20,30,40,50,Sa-2,Sa,Sa+3,75])};},
  txt:function(r){return (r.n===1?'1人':r.n+'人'+(r.n>=G?'の団体':''))+'で来た'+r.a+'歳の人';},
  cd:[{h:G+'人以上の団体',ok:function(r){return r.n>=G;}},{h:Sa+'歳以上',ok:function(r){return r.a>=Sa;}}],
  judge:function(m){return m[0]&&!m[1];},jh:Gp+'円か',
  cell:function(c,r,ok){return ok?(c.h.indexOf('歳')>0?'○ → '+Sp+'円':'○'):'×';},
  line:function(r,m,j){return m[0]&&m[1]?'両方に当てはまる → 安いほうの'+Sp+'円 → ×':m[0]?'団体だけに当てはまる → '+Gp+'円 → ○':m[1]?Sa+'歳以上だけ → '+Sp+'円 → ×':'どちらにも当てはまらない → '+A+'円 → ×';},
  inw:G+'人以上の団体・'+Sa+'歳以上（両方なら安いほう）',
  q:function(x){return 'ある美術館の入館料は1人'+A+'円である。次のいずれかに当てはまる人は、割引料金で入館できる。<br>・'+G+'人以上の団体で来た人：1人'+Gp+'円<br>・'+Sa+'歳以上の人：1人'+Sp+'円<br>ただし、両方に当てはまる人は、安いほうの料金だけが適用される。<br>次のア、イ、ウのうち、1人あたりの入館料が'+Gp+'円になる人はどれか。<br>'+x;}});}});
B.applied.push({id:'g-joho-a1',make:function(R){return rental(R,{b:[1,2,3],bp:[600,800,1000],ap:[200,300,400],min:60,max:240,int:1,mem:1});}});
B.applied.push({id:'g-joho-a2',make:function(R){var N=R.pick([8,10,12]),M=R.pick([2,3]);
 return KK(R,{P:{N:N,M:M},row:function(R){var n=R.int(0,M+1);return {b:R.int(n+3,N+1),n:n,nw:R.pick([1,1,2])};},
  txt:function(r){return '本を'+r.b+'冊（'+(r.n?'うち新刊'+r.n+'冊':'新刊はない')+'）借り、'+(r.n?(r.nw===1?'新刊は1週間、ほかの本は2週間借りる':'すべて2週間借りる'):'すべて2週間借りる');},
  cd:[{h:'合計'+N+'冊まで',ok:function(r){return r.b<=N;},lab:function(r){return r.b+'冊';}},{h:'新刊'+M+'冊まで',ok:function(r){return r.n<=M;},lab:function(r){return '新刊'+r.n+'冊';}},{h:'期間',ok:function(r){return !r.n||r.nw===1;},lab:function(r){return r.n?(r.nw===1?'新刊1週間':'新刊を2週間借りている'):'2週間';}}],
  cell:function(c,r,ok){return ok?'○':(c.h==='期間'?'× 新刊2週間':'×');},inw:'合計'+N+'冊まで・新刊'+M+'冊まで・期間',
  q:function(x){return 'ある図書館の貸出規定は次のとおりである。<br>・1人'+N+'冊まで借りられる。そのうち新刊は'+M+'冊までとする。<br>・貸出期間は2週間とする。ただし、新刊の貸出期間は1週間とする。<br>次のア、イ、ウのうち、この規定どおりに借りられるものはどれか。<br>'+x;}});}});
var KB=[['S',60,2,800],['M',80,5,1000],['L',100,10,1200]];
function cls(tab,v,i){for(var j=0;j<tab.length;j++)if(v<=tab[j][i])return j;return -1;}
function dims(R){return [R.int(3,8)*5,R.int(3,7)*5,R.int(2,6)*5];}
B.applied.push({id:'g-joho-a3',make:function(R){for(;;){var d=dims(R),s=d[0]+d[1]+d[2],w=R.int(1,9),a=cls(KB,s,1),b=cls(KB,w,2);if(a<0||b<0||a===b)continue;var hi=Math.max(a,b),x=KB[hi][3];LV={k:'box',d:d,w:w,tab:KB,m:0};
 return Q({q:'ある宅配便の料金は、次の表のとおりである。荷物の大きさ（縦・横・高さの合計）と重さが別の区分に当てはまるときは、高いほうの料金になる。縦'+d[0]+'cm、横'+d[1]+'cm、高さ'+d[2]+'cm、重さ'+w+'kgの荷物を送るときの料金は何円か。'+JOHTB(['区分','大きさ','重さ','料金'],KB.map(function(r){return [r[0],r[1]+'cm以内',r[2]+'kg以内',r[3]+'円'];})),
  inw:'大きさと重さを別々に区分に当て、高いほうを選ぶ',fig:JOHT(['','荷物','区分','料金'],[['大きさ',s+'cm',KB[a][0],KB[a][3]+'円'],['重さ',w+'kg',KB[b][0],KB[b][3]+'円'],['料金','','高いほう','?']]),
  calc:'大きさ '+d.join(' ＋ ')+' ＝ '+s+'cm → '+KB[a][0]+'（'+KB[a][3]+'円）<br>重さ '+w+'kg → '+KB[b][0]+'（'+KB[b][3]+'円）<br>高いほうなので '+x},CH(x,[800,1000,1200,KB[a][3]+KB[b][3],1400],200));}}});
B.applied.push({id:'g-joho-a4',make:function(R){var G=R.pick([2,3]),S=R.pick([70,75,80]);
 return KK(R,{P:{G:G,S:S},row:function(R){return {g:R.int(G-1,4),s:S+R.pick([-5,-3,0,0,5,8]),o:0};},txt:function(r){return r.g+'年生、前年度の平均点'+r.s+'点、ほかの奨学金は受けていない';},
  need:function(res,rows){return rows.some(function(r){return r.s===S&&r.g>=G;});},
  cd:[{h:G+'年生以上',ok:function(r){return r.g>=G;},lab:function(r){return r.g+'年生';}},{h:S+'点以上',ok:function(r){return r.s>=S;},lab:function(r){return r.s+'点'+(r.s===S?'（「以上」は'+S+'点を含む）':'');}},{h:'ほかの奨学金なし',ok:function(){return true;},lab:function(){return 'なし';}}],
  line:function(r,m,j){if(j)return r.g+'年生○、'+r.s+'点○'+(r.s===S?'（「以上」は'+S+'点を含む）':'')+'、なし○ → ○';return (m[0]?r.s+'点':r.g+'年生')+'× → ×';},
  inw:G+'年生以上・'+S+'点以上・ほかの奨学金なし',
  q:function(x){return 'ある大学の奨学金に応募できるのは、次の条件をすべて満たす学生である。<br>・'+G+'年生以上である<br>・前年度の成績の平均点が'+S+'点以上である<br>・ほかの奨学金を受けていない<br>次のア、イ、ウのうち、この奨学金に応募できる学生はどれか。<br>'+x;}});}});
B.applied.push({id:'g-joho-a5',make:function(R){for(;;){var th=R.pick([2000,3000,5000]),buy=th+R.pick([0,500,1000,2000]),p=R.pick([100,200,300]),T=120+R.int(31,150);if((T-120)%30===0)continue;var n=cnt(T-120,30),x=n*p;LV={k:'shop',th:th,buy:buy,p:p,T:T};
 return Q({q:'ある商業施設の駐車場の料金は、最初の1時間が無料で、その後は30分ごとに'+p+'円である（30分未満の端数も30分とする）。ただし、施設内で'+th+'円以上の買い物をした人は、最初の2時間が無料になる。施設内で'+buy+'円の買い物をした人が'+hm(T)+'駐車したときの料金は何円か。',
  inw:JOHI+'（買い物の額で無料の時間が変わる）',fig:JOHT(['','時間','料金'],[['無料（'+th+'円以上の買い物）','2時間','0円'],['その後（30分ごと）',hm(T-120)+' → 30分 × '+n,p+'円 × '+n],['計',hm(T),'?']]),
  calc:buy+'円は'+th+'円以上なので、最初の2時間が無料<br>'+hm(T)+' − 2時間 ＝ '+hm(T-120)+' → '+n+'回<br>'+p+' × '+n+' ＝ '+x},CH(x,[cnt(T-60,30)*p,(n-1)*p,(n+1)*p],p));}}});
B.applied.push({id:'g-joho-a6',make:function(R){
 return KK(R,{P:{},row:function(R){var d=dims(R);return {d:d,s:d[0]+d[1]+d[2],w:R.int(1,9)};},need:function(res,rows){return rows.every(function(r){return cls(KB,r.s,1)>=0;})&&rows.some(function(r){return cls(KB,r.s,1)!==cls(KB,r.w,2);});},
  txt:function(r){return '縦'+r.d[0]+'cm、横'+r.d[1]+'cm、高さ'+r.d[2]+'cm、重さ'+r.w+'kg';},
  cd:[{h:'大きさ',ok:function(){return true;}},{h:'重さ',ok:function(){return true;}}],
  judge:function(m,r){return Math.max(cls(KB,r.s,1),cls(KB,r.w,2))===1;},jh:'1000円か',
  cell:function(c,r){return c.h==='大きさ'?r.s+'cm → '+KB[cls(KB,r.s,1)][0]:r.w+'kg → '+KB[cls(KB,r.w,2)][0];},
  line:function(r,m,j){var a=cls(KB,r.s,1),b=cls(KB,r.w,2),h=Math.max(a,b);return r.s+'cm（'+KB[a][0]+'）、'+r.w+'kg（'+KB[b][0]+'） → '+(a===b?'':'高いほうの')+KB[h][3]+'円 → '+(j?'○':'×');},
  inw:'大きさの区分・重さの区分（高いほう）',
  q:function(x){return 'ある宅配便の料金は、次の表のとおりである。荷物の大きさ（縦・横・高さの合計）と重さが別の区分に当てはまるときは、高いほうの料金になる。'+JOHTB(['区分','大きさ','重さ','料金'],KB.map(function(r){return [r[0],r[1]+'cm以内',r[2]+'kg以内',r[3]+'円'];}))+'次のア、イ、ウのうち、料金が1000円になる荷物はどれか。<br>'+x;}});}});
B.applied.push({id:'g-joho-a7',make:function(R){var A=R.pick([1000,1200,1500]),Sp=A/2,Gp=A*0.8,G=R.pick([10,20,30]),n=G+R.int(0,8),s=R.int(1,4),x=Sp*s+Gp*(n-s);LV={k:'sen',A:A,Sp:Sp,Gp:Gp,G:G,n:n,s:s};
 return Q({q:'ある美術館の入館料は、大人1人'+A+'円、65歳以上1人'+Sp+'円である。'+G+'人以上の団体は、1人'+Gp+'円になる。ただし、団体の中の65歳以上の人は'+Sp+'円のままとする。65歳以上の'+s+'人を含む'+n+'人の団体の入館料は全部で何円か。',inw:JOHI,
  fig:JOHT(['','人数','1人','金額'],[['65歳以上',s+'人',Sp+'円',Sp*s+'円'],['ほかの人（団体料金）',(n-s)+'人',Gp+'円',Gp*(n-s)+'円'],['計',n+'人','','?']]),
  calc:n+'人は'+G+'人以上なので団体料金<br>ほかの人 '+n+' − '+s+' ＝ '+(n-s)+'人<br>'+Sp+' × '+s+' ＋ '+Gp+' × '+(n-s)+' ＝ '+Sp*s+' ＋ '+Gp*(n-s)+' ＝ '+x},CH(x,[Gp*n,Gp*(n-s),Sp*s+A*(n-s),A*n],Gp/2));}});

/* ---------- 実践（実際の数値） ---------- */
function eikaiwa(R,o){var E=R.pick([5000,8000,10000,12000]),Lp=R.pick([2800,3000,3500,4000,4500]),th=R.pick([6,8,10]),d=R.pick([10,15,20]),f=k(1-d/100);
 if(!o.two){var n=th+R.int(0,4),t=Lp*n,dt=t*f,x=dt+E;LV={k:'eik',E:E,Lp:Lp,th:th,d:d,ns:[n]};
  return Q({q:'ある英会話教室では、入会金が'+E+'円、授業料が1回'+Lp+'円である。1か月に'+th+'回以上受講した月は、その月の授業料が'+d+'%引きになる。ただし、入会金は割引しない。入会した月に'+n+'回受講したとき、その月に支払う金額は全部で何円か。',inw:JOHI+'（割引は授業料だけ）',
   fig:JOHT(['','回数','金額'],[['授業料',n+'回',t+'円'],[d+'%引き後',th+'回以上',dt+'円'],['入会金','',E+'円'],['計','','?']]),
   calc:Lp+' × '+n+' ＝ '+t+'<br>'+n+'回は'+th+'回以上なので '+t+' × '+f+' ＝ '+dt+'<br>'+dt+' ＋ '+E+' ＝ '+x},CH(x,[(t+E)*f,t+E,dt,t],250));}
 var n1=th-R.int(1,3),n2=th+R.int(0,3),a=Lp*n1,b=Lp*n2*f,x2=E+a+b;LV={k:'eik',E:E,Lp:Lp,th:th,d:d,ns:[n1,n2]};
 return Q({q:'ある英会話教室では、入会金が'+E+'円、授業料が1回'+Lp+'円である。1か月に'+th+'回以上受講した月は、その月の授業料が'+d+'%引きになる。ただし、入会金は割引しない。入会した月に'+n1+'回、翌月に'+n2+'回受講したとき、2か月で支払う金額は全部で何円か。',inw:JOHI+'（割引は月ごとに、授業料だけ）',
  fig:JOHT(['','回数','金額'],[['入会金','',E+'円'],['入会した月',n1+'回',a+'円'],['翌月（'+d+'%引き）',n2+'回',b+'円'],['計',(n1+n2)+'回','?']]),
  calc:'入会した月 '+Lp+' × '+n1+' ＝ '+a+'（'+th+'回未満なので割引なし）<br>翌月 '+Lp+' × '+n2+' × '+f+' ＝ '+b+'<br>'+E+' ＋ '+a+' ＋ '+b+' ＝ '+x2},
  CH(x2,[E+Lp*(n1+n2)*f,E+Lp*(n1+n2),a+b,E+Lp*n2*f+Lp*n1*f],400));}
B.real.push({id:'g-joho-r0',make:function(R){return eikaiwa(R,{});}});
B.real.push({id:'g-joho-r1',make:function(R){var Y=R.pick([1,2,3]),I=R.pick([500,600,800]),KD=['小学生','中学生','高校生','未就学'],ok={小学生:1,中学生:1,未就学:1};
 return KK(R,{P:{Y:Y,I:I},row:function(R){return {y:R.pick([6,8,10,12,24,36,60]).toString(),ym:0,k:R.pick(KD),i:I+R.pick([-150,-80,-20,0,30,100])};},
  txt:function(r){var m=+r.y;return '市内に'+(m%12?m+'か月':m/12+'年')+'住んでいて、'+(r.k==='未就学'?'小学校入学前':r.k)+'の子どもが1人いる。前年の世帯の所得は'+r.i+'万円である';},
  cd:[{h:Y+'年以上',ok:function(r){return +r.y>=Y*12;},lab:function(r){var m=+r.y;return m%12?m+'か月':m/12+'年';}},{h:'中学生以下',ok:function(r){return !!ok[r.k];},lab:function(r){return r.k==='未就学'?'小学校入学前':r.k;}},{h:I+'万円未満',ok:function(r){return r.i<I;},lab:function(r){return r.i+'万円';}}],
  inw:Y+'年以上・中学生以下・'+I+'万円未満',
  q:function(x){return 'ある市の子育て支援金は、次の条件をすべて満たす世帯に支給される。<br>・市内に'+Y+'年以上住んでいる<br>・中学生以下の子どもがいる<br>・前年の世帯の所得が'+I+'万円未満である<br>次のア、イ、ウのうち、支援金が支給される世帯はどれか。<br>'+x;}});}});
var KR=[['60',60,2,930],['80',80,5,1150],['100',100,10,1390],['120',120,15,1610]];
B.real.push({id:'g-joho-r2',make:function(R){for(;;){var d=[R.int(20,45),R.int(15,40),R.int(10,35)],s=d[0]+d[1]+d[2],w=R.int(1,14),a=cls(KR,s,1),b=cls(KR,w,2);if(a<0||b<0||a===b)continue;var hi=Math.max(a,b),x=KR[hi][3]-100;LV={k:'box',d:d,w:w,tab:KR,m:100};
 return Q({q:'ある宅配便の料金は、次の表のとおりである。荷物の大きさ（縦・横・高さの合計）と重さが別の区分に当てはまるときは、高いほうの料金になる。また、営業所に持ち込むと1個につき100円引きになる。縦'+d[0]+'cm、横'+d[1]+'cm、高さ'+d[2]+'cm、重さ'+w+'kgの荷物を営業所に持ち込んで送るときの料金は何円か。'+JOHTB(['区分','大きさ','重さ','料金'],KR.map(function(r){return [r[0],r[1]+'cm以内',r[2]+'kg以内',r[3]+'円'];})),
  inw:'大きさと重さを別々に区分に当て、高いほうを選んでから持ち込みの割引を引く',
  fig:JOHT(['','荷物','区分','料金'],[['大きさ',s+'cm',KR[a][0],KR[a][3]+'円'],['重さ',w+'kg',KR[b][0],KR[b][3]+'円'],['高いほう','',KR[hi][0],KR[hi][3]+'円'],['持ち込み','','','−100円'],['料金','','','?']]),
  calc:'大きさ '+d.join(' ＋ ')+' ＝ '+s+'cm → '+KR[a][0]+'（'+KR[a][3]+'円）<br>重さ '+w+'kg → '+KR[b][0]+'（'+KR[b][3]+'円）<br>高いほうの'+KR[hi][3]+'円から持ち込みの100円を引く<br>'+KR[hi][3]+' − 100 ＝ '+x},
  CH(x,[KR[hi][3],KR[Math.min(a,b)][3]-100,KR[Math.min(a,b)][3],KR[hi][3]+120],120));}}});
B.real.push({id:'g-joho-r3',make:function(R){var DW=['月曜日','火曜日','水曜日','木曜日','金曜日','土曜日','日曜日'],JB=['会社員','市内の大学に通う学生','市外の大学に通う学生'],D=R.pick([1,2]);
 return KK(R,{P:{},row:function(R){return {d:R.int(0,6),m:R.pick([0,1]),j:R.int(0,2)};},
  txt:function(r){return DW[r.d]+'に、会員証を'+(r.m?'提示して':'持たずに')+'借りた'+JB[r.j];},
  cd:[{h:'会員証',ok:function(r){return !!r.m;}},{h:'市内の大学生',ok:function(r){return r.j===1;}},{h:'平日',ok:function(r){return r.d<5;}}],
  judge:function(m){return (m[0]||m[1])&&m[2];},
  line:function(r,m,j){var who=m[0]?'会員証○':m[1]?'市内の大学生○':'会員証も市内の大学生も×';return who+(m[0]||m[1]?(m[2]?'、'+DW[r.d]+'○':'だが'+DW[r.d]+'×'):'')+' → '+(j?'○':'×');},
  pre:'「または」なので、会員証か市内の大学生のどちらかに○があり、さらに平日なら割引',inw:'会員証または市内の大学生・平日',
  q:function(x){return 'あるレンタサイクルでは、会員証を提示した人、または市内の大学に通う学生は、料金が'+D+'割引きになる。ただし、土曜日と日曜日は割引を行わない。<br>次のア、イ、ウのうち、割引を受けられる人はどれか。<br>'+x;}});}});
B.real.push({id:'g-joho-r4',make:function(R){return park(R,{F:[30],u:[20],p:[100,150,200],min:61,max:150,cap:[1200,1500],fl:function(){return '最初の30分';},
 q:function(F,u,p,T,cap){return 'ある駐車場の料金は、最初の30分が無料で、その後は20分ごとに'+p+'円である（20分未満の端数も20分とする）。ただし、1日の料金は'+cap+'円を上限とする。この駐車場に'+hm(T)+'駐車したときの料金は何円か。';}});}});
var CD=[['当日',0],['前日',1],['2日前',2],['3日前',3],['5日前',5],['1週間前',7]];
B.real.push({id:'g-joho-r5',make:function(R){var h=R.pick([50,30]);
 return KK(R,{P:{},row:function(R){return R.pick(CD);},txt:function(r){return '宿泊日'+(r[1]?'の'+r[0]:'の当日')+'に取り消す';},
  cd:[{h:'取り消した日',ok:function(){return true;}},{h:'キャンセル料',ok:function(r){return r[1]>=2;}}],judge:function(m){return m[1];},
  cell:function(c,r){return c.h==='取り消した日'?r[0]:r[1]===0?'100%':r[1]===1?h+'%':'無料';},
  line:function(r,m,j){return (r[1]>=2?'前日より前 → 無料':r[1]===1?'前日 → '+h+'%':'当日 → 100%')+' → '+(j?'○':'×');},inw:'取り消した日・キャンセル料',
  q:function(x){return 'あるホテルの宿泊を取り消すときのキャンセル料は、次のとおりである。<br>・宿泊日の当日に取り消す：宿泊料金の100%<br>・宿泊日の前日に取り消す：宿泊料金の'+h+'%<br>・それより前に取り消す：無料<br>次のア、イ、ウのうち、キャンセル料がかからないものはどれか。<br>'+x;}});}});
B.real.push({id:'g-joho-r6',make:function(R){var P=R.int(8,18)*1000,n=R.int(1,3),h=R.pick([30,50]),day=R.pick(['当日','前日']),t=P*n,r=day==='当日'?100:h,x=t*r/100;LV={k:'can',P:P,n:n,h:h,day:day};
 return Q({q:'あるホテルの宿泊を取り消すときのキャンセル料は、宿泊日の当日に取り消すと宿泊料金の100%、前日に取り消すと宿泊料金の'+h+'%で、それより前は無料である。1泊'+P+'円の部屋に'+n+'泊する予約を、宿泊日の'+day+'に取り消したときのキャンセル料は何円か。',inw:JOHI,
  fig:JOHT(['','計算','金額'],[['宿泊料金',P+'円 × '+n+'泊',t+'円'],[day+'のキャンセル料',r+'%','?']]),
  calc:'宿泊料金 '+P+' × '+n+' ＝ '+t+'<br>'+day+'なので '+r+'%<br>'+t+' × '+k(r/100)+' ＝ '+x},CH(x,[0,P*h/100,P,t,t*h/100,t*(100-h)/100],P/2));}});
B.real.push({id:'g-joho-r7',make:function(R){for(;;){var y=R.int(1000,9999);if(y%100===0)continue;var mul=R.pick([2,3]),rk=mul===2?'ゴールド':'プラチナ',b=Math.floor(y/100),x=b*mul;LV={k:'pt',y:y,mul:mul};
 return Q({q:'ある店では、買い物の金額100円ごとに1ポイントがつく（100円未満は切り捨てる）。会員ランクが'+rk+'の人は、つくポイントが'+mul+'倍になる。'+rk+'の人が'+y+'円の買い物をしたとき、つくポイントは何ポイントか。',inw:JOHI,
  fig:JOHT(['','計算','ポイント'],[['100円ごと',y+' ÷ 100 → '+b,b+'ポイント'],[rk,mul+'倍','?']]),
  calc:y+' ÷ 100 ＝ '+k(y/100)+' → '+b+'（100円未満は切り捨て）<br>'+b+' × '+mul+' ＝ '+x},CH(x,[b,b+1,(b+1)*mul,Math.floor(y/10)],mul,'ポイント'));}}});
B.real.push({id:'g-joho-r8',make:function(R){var Y=R.pick([2,3,5]);
 return KK(R,{P:{Y:Y},row:function(R){return {u:R.pick([0,1,2]),y:R.int(0,Y+3)};},any:1,
  txt:function(r){return (r.u===2?'高校を卒業し':r.u===1?'関連する学科のある大学を卒業し':'関連する学科のない大学を卒業し')+'、関連する仕事の経験が'+r.y+'年ある人';},
  need:function(res,rows){return rows.every(function(r){return r.y>0;});},
  cd:[{h:'関連学科の大学卒',ok:function(r){return r.u===1;},lab:function(){return '関連学科の大学卒';}},{h:'経験'+Y+'年以上',ok:function(r){return r.y>=Y;},lab:function(r){return '経験'+r.y+'年';}}],
  pre:'「いずれか」なので、○が1つでもあれば当てはまる',inw:'関連学科の大学卒・経験'+Y+'年以上',
  q:function(x){return 'ある資格試験を受験できるのは、次のいずれかに当てはまる人である。<br>・関連する学科のある大学を卒業している<br>・関連する仕事の経験が'+Y+'年以上ある<br>次のア、イ、ウのうち、この試験を受験できる人はどれか。<br>'+x;}});}});
B.real.push({id:'g-joho-r9',make:function(R){return eikaiwa(R,{two:1});}});
/* ---------- 別の方法で解く（verify）：規定を1行ずつ当てはめ直す・1分／1人ずつ数える ---------- */
function ANS(js){var t=L.filter(function(x,i){return js[i];});return t.length===1?t[0]+'だけ':t.join('と');}
function boxP(tab,s,w){var a=99,b=99;for(var i=tab.length-1;i>=0;i--){if(s<=tab[i][1])a=i;if(w<=tab[i][2])b=i;}return tab[Math.max(a,b)][3];}
var VJ={
 c0:function(v){return ANS(v.rows.map(function(r){return r.y>=v.P.Y&&r.d>=v.P.D;}));},
 p0:function(v){return ANS(v.rows.map(function(r){return r.b+r.m<=v.P.N&&r.m<=v.P.M&&r.w<=2;}));},
 p2:function(v){return ANS(v.rows.map(function(r){return r.g>=v.P.G&&r.s>=v.P.S&&!r.o;}));},
 p4:function(v){return ANS(v.rows.map(function(r){return r.d[0]+r.d[1]+r.d[2]<=v.P.S&&r.w<=v.P.Wt;}));},
 a0:function(v){var P=v.P;return ANS(v.rows.map(function(r){var pr=P.A;if(r.n>=P.G)pr=Math.min(pr,P.Gp);if(r.a>=P.Sa)pr=Math.min(pr,P.Sp);return pr===P.Gp;}));},
 a2:function(v){return ANS(v.rows.map(function(r){return r.b<=v.P.N&&r.n<=v.P.M&&(r.n===0||r.nw===1);}));},
 a4:function(v){return ANS(v.rows.map(function(r){return r.g>=v.P.G&&r.s>=v.P.S;}));},
 a6:function(v){return ANS(v.rows.map(function(r){return boxP(KB,r.d[0]+r.d[1]+r.d[2],r.w)===1000;}));},
 r1:function(v){return ANS(v.rows.map(function(r){return +r.y>=v.P.Y*12&&['小学生','中学生','未就学'].indexOf(r.k)>=0&&r.i<v.P.I;}));},
 r3:function(v){return ANS(v.rows.map(function(r){return (r.m===1||r.j===1)&&r.d<=4;}));},
 r5:function(v){return ANS(v.rows.map(function(r){return r[1]>1;}));},
 r8:function(v){return ANS(v.rows.map(function(r){return r.u===1||r.y>=v.P.Y;}));},
 mus:function(v){var t=0,i;for(i=0;i<v.a;i++)t+=v.A;for(i=0;i<v.c;i++)t+=v.C;if(v.a+v.c>=v.G)t=t-t*v.d/10;return t+'円';},
 park:function(v){var c=0;for(var t=v.F;t<v.T;t+=v.u)c+=v.p;if(v.cap&&c>v.cap)c=v.cap;return c+'円';},
 rent:function(v){var c=v.bp;for(var t=v.b*60;t<v.T;t+=60)c+=v.ap;if(v.mem)c=c-c/10;return c+'円';},
 box:function(v){return (boxP(v.tab,v.d[0]+v.d[1]+v.d[2],v.w)-v.m)+'円';},
 shop:function(v){var c=0;for(var t=(v.buy>=v.th?120:60);t<v.T;t+=30)c+=v.p;return c+'円';},
 sen:function(v){var t=0;for(var i=0;i<v.n;i++)t+=i<v.s?v.Sp:(v.n>=v.G?v.Gp:v.A);return t+'円';},
 eik:function(v){var t=v.E;v.ns.forEach(function(n){var m=v.Lp*n;if(n>=v.th)m=m*(100-v.d)/100;t+=m;});return t+'円';},
 can:function(v){var t=v.P*v.n;return (v.day==='当日'?t:t*v.h/100)+'円';},
 pt:function(v){var y=v.y,b=0;while(y>=100){y-=100;b++;}return b*v.mul+'ポイント';}
};
B.concept.concat(B.practice,B.applied,B.real).forEach(function(it){if(!it.make||it.id.indexOf('g-joho')!==0)return;var m=it.make,key=it.id.slice(7);
 it.make=function(R){LV=null;var o=m(R);o.v=LV;return o;};it.verify=function(v){return (v.k?VJ[v.k]:VJ[key])(v);};});
})();
