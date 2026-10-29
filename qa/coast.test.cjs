'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {Game:G,create,assertState}=require('./load.cjs');
if(!G.COAST_STORIES)require('../dist/content/coast.js');
if(!G.coastList)require('../dist/coast.js');
// Synthetic achievements isolate story gates/effects, not affordability or balance.
function established(){const s=create(1);s.cash=2000000;s.managers=2;s.rep=100;s.influence=30;s.crew={members:8,trained:4,loyalty:70,fatigue:30};s.sales=1;s.trips=1;s.businesses=[0,1];s.cities=[0,1];s.routes=[0,1].map((city,i)=>({id:i+1,city,good:0,qty:10,carrier:2,origin:0,adapt:true,active:true}));G.upgrade(s);return s;}
function clearEvent(s){for(let n=0;s.event&&n<20;n++){const e=G.eventInfo(s),choice=e.choices.findIndex(c=>s.cash+c.cash>=0);assert(choice>=0);G.act(s,'choice',choice);}assert(!s.event);}
function choose(s,line,id){clearEvent(s);const info=G.coastInfo(s,line),q=id?info.current.choices.find(c=>c.id===id):info.current.choices.find(c=>c.allowed&&c.mode==='community')||info.current.choices.find(c=>c.allowed);assert(q&&q.allowed,q?.reason||line+' has no choice');G.act(s,'coastChoice',q.arg);assertState(s);return q;}
function to(s,line,n,first){while(s.coast.lines[line].step<n)choose(s,line,s.coast.lines[line].step===0?first:undefined);}
const count=s=>Object.values(s.coast.lines).reduce((n,l)=>n+l.step,0);
test('two eight-chapter stories expose concrete locations, effects and milestone gates',()=>{
 const s=create(1);assert.equal(G.COAST_STORIES.length,2);for(const l of G.COAST_STORIES){assert.equal(l.steps.length,8);assert(l.steps.every(t=>t.placeId&&t.place&&t.text.length>80&&t.choices.length>=2));}
 for(const q of G.coastList(s)){assert.equal(q.step,0);assert.equal(q.total,8);assert.equal(q.status,'active');assert(q.ready);for(const c of q.current.choices){assert(Number.isInteger(c.cost));assert(Number.isInteger(c.cash));assert(c.days>=1&&c.days<=3);assert.equal(c.arg.step,0);assert.equal(Object.keys(c.effects).length,7);}}
 choose(s,'islands','fund');assert.equal(G.coastInfo(s,'islands').ready,false);assert.match(G.coastInfo(s,'islands').reason,/salg|innkjøpsreiser|ruter/);assertState(s);
});
test('manual side work pays once, consumes its quoted days and applies actual fatigue/respect',()=>{
 const s=create(1),q=G.coastQuote(s,{line:'islands',choice:'work',step:0}),cash=s.cash,rep=s.rep,fatigue=s.crew.fatigue;G.act(s,'coastChoice',q.arg);assert.equal(s.day,q.days);assert.equal(s.cash,cash+q.cash-q.cost);assert.equal(s.rep,rep+q.effects.rep);assert.equal(s.crew.fatigue,fatigue+q.effects.fatigue);assert.equal(s.coast.lines.islands.choices.length,1);assert.equal(s.ledger.find(r=>r.title.startsWith('Kysten /')).net,q.cash-q.cost);
 const before=JSON.stringify(s);G.act(s,'coastChoice',q.arg);assert.equal(JSON.stringify(s),before);assertState(s);
});
test('crew recruitment and teaching in the stories change actual members and training',()=>{
 const s=established();choose(s,'islands','fund');const members=s.crew.members,apprentice=choose(s,'islands','apprentice');assert.equal(s.crew.members,members+apprentice.effects.crew);const trained=s.crew.trained,q=choose(s,'islands','learn');assert.equal(s.crew.trained,trained+q.effects.trained);assert.equal(q.effects.trained,1);assert(s.coast.flags.runaJoined);assertState(s);
});
test('branch promises appear later and their quoted settlement is actually charged',()=>{
 const s=established();choose(s,'islands','brand');choose(s,'islands','apprentice');choose(s,'islands','learn');choose(s,'islands','publish');const info=G.coastInfo(s,'islands');assert.match(info.current.text,/1 500/);const q=info.current.choices.find(c=>c.id==='open');assert.equal(q.cost,2700);assert.equal(info.current.choices.find(c=>c.id==='tickets').cost,0,'honoring the original sponsor promise does not charge cancellation');const cash=s.cash;G.act(s,'coastChoice',q.arg);assert.equal(s.cash,cash-q.cost);assert.equal(s.coast.lines.islands.choices.at(-1).cost,q.cost);assertState(s);
});
test('the two arcs unlock collaborations without making either normal route depend on the other',()=>{
 const s=established();to(s,'islands',4,'fund');let q=G.coastInfo(s,'islands').current.choices.find(c=>c.id==='archive');assert.equal(q.allowed,false);assert.match(q.reason,/Byen som skiftet arbeid/);assert(G.coastInfo(s,'islands').current.choices.some(c=>c.allowed));
 to(s,'heritage',3,'voices');q=G.coastInfo(s,'islands').current.choices.find(c=>c.id==='archive');assert(q.allowed);choose(s,'islands','archive');to(s,'heritage',5);assert(G.coastInfo(s,'heritage').current.choices.find(c=>c.id==='islands').allowed);choose(s,'heritage','islands');assertState(s);
});
test('complete arcs have distinct persisted endings and no final reward can be replayed',()=>{
 for(const [line,ending]of [['islands','community'],['islands','private'],['heritage','public'],['heritage','sell']]){const s=established();to(s,line,7);choose(s,line,ending);const q=G.coastInfo(s,line);assert.equal(q.status,'done');assert.equal(q.current,null);assert.equal(q.ready,false);assert.equal(q.ending.choice,ending);assert(q.ending.title);const before=JSON.stringify(s);G.act(s,'coastChoice',{line,choice:ending,step:7});assert.equal(JSON.stringify(s),before);const restored=G.upgrade(JSON.parse(before));assert.deepEqual(G.coastInfo(restored,line).ending,q.ending);assertState(restored);}
});
test('dates, events, trips, stale modal steps and invalid mandates are guarded without mutation',()=>{
 const s=create(1);for(const arg of [null,{line:'islands',choice:'work'},{line:'fake',choice:'work',step:0},{line:'islands',choice:'work',step:1}]){const before=JSON.stringify(s);G.act(s,'coastChoice',arg);assert.equal(JSON.stringify(s),before);}
 for(const id of ['__proto__','constructor','wrong','community']){const before=JSON.stringify(s);G.act(s,'coastPolicy',id);assert.equal(JSON.stringify(s),before);}
 s.event={kind:'routine',id:0};const event=JSON.stringify(s);G.act(s,'coastChoice',{line:'islands',choice:'work',step:0});assert.equal(JSON.stringify(s),event);s.event=null;
 const off=G.on('week',current=>{if(current===s)current.event={kind:'routine',id:0};});try{G.act(s,'tripBuy',{origin:1,cart:G.GOODS.map((_,i)=>i===0?1:0)});}finally{off();}assert(s.trip,'fixture must hold an actual interrupted trip');G.act(s,'defer');assert.equal(s.event,null);const trip=JSON.stringify(s);G.act(s,'coastChoice',{line:'islands',choice:'work',step:0});assert.equal(JSON.stringify(s),trip);
 const late=create();late.day=G.END_DAY-1;late.week=Math.floor(late.day/7);assert.equal(G.coastQuote(late,{line:'islands',choice:'work',step:0}).allowed,false);assert.equal(G.coastQuote(late,{line:'islands',choice:'fund',step:0}).allowed,true);const before=JSON.stringify(late);G.act(late,'coastChoice',{line:'islands',choice:'work',step:0});assert.equal(JSON.stringify(late),before);
 G.act(late,'coastChoice',{line:'islands',choice:'fund',step:0});assert.equal(late.day,G.END_DAY);assert.equal(late.ended,true);for(const info of G.coastList(late)){assert.equal(info.current,null);assert.equal(info.ready,false);}const ended=JSON.stringify(late);G.act(late,'coastPolicy','personal');assert.equal(JSON.stringify(late),ended);
});
test('personal is the default; explicit mandates resolve one task per actual week with no extra clock',()=>{
 const s=established();to(s,'islands',2,'fund');to(s,'heritage',2,'voices');assert.equal(s.coast.policy,'personal');clearEvent(s);const initial=count(s);G.act(s,'week');assert.equal(count(s),initial);
 G.act(s,'coastPolicy','community');const before=count(s),day=s.day;clearEvent(s);G.act(s,'week');assert.equal(s.day,day+7);assert.equal(count(s),before+1);const histories=Object.values(s.coast.lines).flatMap(l=>l.choices),automatic=histories.filter(h=>h.automatic);assert.equal(automatic.length,1);assert.equal(automatic[0].days,0);const saved=count(s);G.onStrategicWeek(s);assert.equal(count(s),saved);
 clearEvent(s);G.act(s,'week');assert.equal(Object.values(s.coast.lines).flatMap(l=>l.choices).filter(h=>h.automatic).length,2);assertState(s);
});
test('delegation protects the reserve, requires achievements and leaves final moral choices personal',()=>{
 const poor=established();to(poor,'islands',2,'fund');G.act(poor,'coastPolicy','community');poor.cash=0;poor.businesses=[];poor.cities=[0];poor.routes=[];const before=count(poor);G.act(poor,'week');assert.equal(count(poor),before);
 const blocked=established();to(blocked,'islands',2,'fund');G.act(blocked,'coastPolicy','community');blocked.crew.members=1;blocked.crew.trained=1;G.act(blocked,'week');assert.equal(blocked.coast.lines.islands.step,2);
 const final=established();to(final,'islands',7,'fund');G.act(final,'coastPolicy','community');for(let n=0;n<3;n++){clearEvent(final);G.act(final,'week');}assert.equal(final.coast.lines.islands.step,7);assert.equal(G.coastInfo(final,'islands').current.choices.length,3);assertState(final);
});
test('reads and absent-namespace migration are pure; malformed partial saves remain rejected',()=>{
 const s=established();choose(s,'heritage','voices');const before=JSON.stringify(s);for(let n=0;n<3;n++){G.coastList(s);G.coastInfo(s,'heritage');G.coastPolicyQuote(s,'community');for(const c of G.coastInfo(s,'heritage').current.choices)G.coastQuote(s,c.arg);}assert.equal(JSON.stringify(s),before);const restored=G.upgrade(JSON.parse(before));assert.deepEqual(restored.coast,s.coast);assertState(restored);
 const old=create();delete old.coast;assert.equal(G.valid(old),true);const raw=JSON.stringify(old);G.coastList(old);assert.equal(JSON.stringify(old),raw);G.upgrade(old);assert.equal(old.coast.policy,'personal');assert.equal(old.coast.lines.islands.step,0);assertState(old);
 for(const change of [a=>a.policy='constructor',a=>a.trust.islands=6,a=>a.flags.unknown=true,a=>a.lines.islands.step=8,a=>a.lines.heritage.choices[0].effects.trained=NaN,a=>a.lastWeek=s.week+1]){const bad=structuredClone(s);change(bad.coast);assert.equal(G.valid(bad),false);}
});
