'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {Game:G,create,assertState}=require('./load.cjs');
// Privileged fixtures isolate economic contracts. These are technical regression
// tests, not evidence that a normal player can afford or enjoy these positions.
function rich(seed=1){const s=create(seed);s.cash=1e9;s.rankLevel=4;s.rep=250;s.influence=200;s.managers=5;s.cities=[0,1,2,3,4];s.crew={members:40,trained:20,loyalty:90,fatigue:0};G.upgrade(s);for(const b of Object.values(s.branches))b.level=3;s.empire.nextCouncil=10000;return s;}
function own(s,ids){s.scale.territories=Object.fromEntries(ids.map(id=>[id,{pressure:0,since:s.week}]));s.scale.discovered=[...ids];return s;}
function routes(s,cities=[0,1]){s.routes=cities.map((city,i)=>({id:i+1,city,good:cities.every(c=>c===city)?i:0,qty:10,carrier:2,origin:0,adapt:true,active:true}));return s;}
function settle(s){for(let n=0;s.event&&n<20;n++){const e=G.eventInfo(s),i=e.choices.findIndex(c=>s.cash+c.cash>=0);assert(i>=0);G.act(s,'choice',i);}assert(!s.event);}
function advanceWeek(s){settle(s);const week=s.week;G.act(s,'week');assert.equal(s.week,week+1);}
const near=(a,b)=>assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('first ten infrastructure tiers pay back within 156 weeks; costs rise while rent diminishes',()=>{
 const s=rich();for(const infra of G.INFRA){let prev=null;for(let n=0;n<=25;n++){s.scale.levels[infra.id]=n;const q=G.infraQuote(s,infra.id);assert(q.weekly>0);if(n<10)assert(q.payback<=156,`${infra.id} tier ${n}: ${q.payback}`);if(prev){assert(q.cost>prev.cost);assert(q.weekly<prev.weekly);assert(q.payback>prev.payback);}prev=q;}}
});
test('cash-rich late level24/25 infrastructure cannot buy rent far beyond the remaining campaign',()=>{
 for(const level of [24,25]){const s=rich();s.cash=1e13;for(const id of Object.keys(s.scale.levels))s.scale.levels[id]=level;s.day=G.END_DAY-182;s.week=Math.floor(s.day/7);s.scale.lastWeek=s.week;own(s,G.TERRITORIES.slice(0,G.controlLimit(s)).map(t=>t.id));G.upgrade(s);
  assert.equal(Object.keys(s.scale.territories).length,G.controlLimit(s));for(const infra of G.INFRA){const q=G.infraQuote(s,infra.id);assert(q.payback>1000);assert(q.operationalPayback>q.remaining);assert.equal(G.infraAllowed(s,infra.id),false);const before=JSON.stringify(s);assert.match(G.act(s,'invest',infra.id),/2036|tjene/);assert.equal(JSON.stringify(s),before);}
  for(const preference of ['capacity','expansion']){const plan=G.capitalPlan(s,preference);if(plan?.type==='invest')assert(G.infraAllowed(s,plan.arg),`${preference} returned rejected ${plan.arg}`);assert(!(plan?.type==='invest'&&plan.arg==='command'));}
  assertState(s);
 }
});
test('a command search ceiling cannot invent a free control expansion at very high legacy levels',()=>{
 const s=rich();s.cash=1e15;s.rankLevel=5;for(const id of Object.keys(s.scale.levels))s.scale.levels[id]=60;own(s,G.TERRITORIES.slice(0,G.controlLimit(s)).map(t=>t.id));const region=G.TERRITORIES.map(t=>G.territoryQuote(s,t.id)).find(q=>!q.bought&&q.ready&&!q.limit);assert(region);
 const expansion=G.commandExpansionQuote(s,region);assert.equal(expansion.viable,false,'zero purchased levels cannot unlock the pending region');assert.equal(G.infraAllowed(s,'command'),false);const plan=G.capitalPlan(s);assert(!(plan?.type==='invest'&&plan.arg==='command'));
 const before=JSON.stringify(s);G.act(s,'invest','command');assert.equal(JSON.stringify(s),before);assertState(s);
});
test('automatic capital decisions use the same infrastructure guard as manual actions',()=>{
 const s=rich();s.cash=1e13;for(const id of Object.keys(s.scale.levels))s.scale.levels[id]=25;s.day=G.END_DAY-182;s.week=Math.floor(s.day/7);s.scale.lastWeek=s.week;own(s,G.TERRITORIES.slice(0,G.controlLimit(s)).map(t=>t.id));G.upgrade(s);s.scale.reinvestment='capacity';
 const original=G.act,attempts=[];G.act=function(current,type,arg){if(current===s&&type==='invest')attempts.push({id:arg,allowed:G.infraAllowed(current,arg)});return original(current,type,arg);};try{for(let i=0;i<4;i++)advanceWeek(s);}finally{G.act=original;}
 assert(attempts.every(x=>x.allowed));assert(Object.values(s.scale.levels).every(n=>n===25));assertState(s);
});
test('even an injected obsolete automatic recommendation cannot bypass the actual investment guard',()=>{
 const s=rich();s.cash=1e13;for(const id of Object.keys(s.scale.levels))s.scale.levels[id]=25;s.day=G.END_DAY-182;s.week=Math.floor(s.day/7);s.scale.lastWeek=s.week;own(s,G.TERRITORIES.slice(0,G.controlLimit(s)).map(t=>t.id));G.upgrade(s);s.scale.reinvestment='capacity';assert.equal(G.infraAllowed(s,'command'),false);
 // Fault injection represents a stale UI/planner recommendation. The real
 // automatic dispatch still calls the public action and must reject it.
 const original=G.capitalPlan;let calls=0;G.capitalPlan=function(current,preference){if(current!==s)return original(current,preference);calls++;return {type:'invest',arg:'command',cost:G.infraQuote(s,'command').cost};};try{for(let i=0;i<4;i++)advanceWeek(s);}finally{G.capitalPlan=original;}
 assert(calls>0);assert.equal(s.scale.levels.command,25);assert.equal(s.scale.invested,0);assert.equal(s.scale.assetBook,0);assert.equal(s.scale.investmentLog.length,0);assertState(s);
});
test('regional project pays its quoted expense once, preserves reserve and cannot overlap',()=>{
 const s=rich(),q=G.regionalPlanQuote(s,'partners'),cash=s.cash,book=s.scale.assetBook,day=s.day,reserve=G.capitalReserve(s);assert(q.valid,q.reason);G.act(s,'regionalPlan','partners');assert.equal(s.cash,cash-q.cost);assert(s.cash>=reserve);assert.equal(s.day,day);assert.equal(s.scale.assetBook,book);assert.equal(s.regional.model,'direct');assert.equal(s.regional.project.progress,0);assert.equal(s.regional.project.need,8);assert.equal(s.regional.project.cost,q.cost);
 const row=s.ledger.find(r=>r.title.includes('/ oppbygging'));assert.equal(row.cost,q.cost);assert.equal(row.net,-q.cost);const before=JSON.stringify(s);G.act(s,'regionalPlan','professional');assert.equal(JSON.stringify(s),before);assertState(s);
 const poor=rich(),cost=G.regionalPlanQuote(poor,'partners').cost;poor.cash=cost+G.capitalReserve(poor)-1;assert.equal(G.regionalPlanQuote(poor,'partners').valid,false);const unchanged=JSON.stringify(poor);G.act(poor,'regionalPlan','partners');assert.equal(JSON.stringify(poor),unchanged);
});
test('eight elapsed weeks or two routes to one city cannot complete a delivery-based region agreement',()=>{
 for(const routeCities of [[],[0,0]]){const s=routes(rich(),routeCities);G.act(s,'regionalPlan','partners');for(let i=0;i<8;i++)advanceWeek(s);assert.equal(s.week,8);assert.equal(s.regional.project.progress,0);assert.equal(s.regional.model,'direct');assertState(s);}
 const s=routes(rich());s.crew.loyalty=50;G.act(s,'regionalPlan','partners');advanceWeek(s);assert.equal(s.regional.project.progress,0);
});
test('only eight distinct qualifying delivery weeks activate the model; duplicate hooks cannot advance it',()=>{
 const s=routes(rich()),q=G.regionalPlanQuote(s,'partners');G.act(s,'regionalPlan','partners');let qualified=0;for(let n=0;s.regional.project&&n<30;n++){
  advanceWeek(s);const delivered=new Set(s.ledger.filter(r=>r.week===s.week&&r.route&&r.gross>0).map(row=>s.routes.find(r=>r.id===row.route).city));if(delivered.size>=2&&s.crew.loyalty>=55)qualified++;
  if(qualified<8){assert.equal(s.regional.project.progress,qualified);assert.equal(s.regional.model,'direct');const before=s.regional.project.progress;G.onStrategicWeek(s);assert.equal(s.regional.project.progress,before,'same delivery week counted twice');}
 }
 assert.equal(qualified,8);assert.equal(s.regional.project,null);assert.equal(s.regional.model,'partners');assert(s.week>=8);assert.equal(s.regional.history.length,1);assert.equal(s.regional.history[0].progress,8);assert.equal(s.regional.history[0].cost,q.cost);assert.equal(s.regional.history[0].finished,s.week);assertState(s);
});
test('regional control, retained income, actual overhead and operating reserve match the selected model',()=>{
 for(const id of ['direct','partners','professional']){const s=own(rich(),['sandnes','sola','jaeren']);s.regional.model=id;const empty=structuredClone(s);empty.scale.territories={};const m=G.REGIONAL_MODELS.find(m=>m.id===id),gross=Object.keys(s.scale.territories).reduce((n,id)=>n+G.territoryQuote(s,id).gross,0),territoryCost=Object.keys(s.scale.territories).reduce((n,id)=>n+G.territoryQuote(s,id).upkeep,0);
  assert.equal(G.controlLimit(s),3+m.slots);assert.equal(G.income(s)-G.income(empty),Math.round(gross*m.share));assert.equal(G.upkeep(s)-G.upkeep(empty),territoryCost+3*m.overhead);assert.equal(G.capitalReserve(s)-G.capitalReserve(empty),13*(territoryCost+3*m.overhead));
  const upkeep=G.upkeep(s);advanceWeek(s);assert.equal(s.ledger.find(r=>r.title==='Lokaler og laget'&&r.week===s.week).cost,upkeep);assertState(s);
 }
 const s=own(rich(),['sandnes','sola','jaeren','randaberg']);s.regional.model='partners';assert.equal(G.regionalPlanQuote(s,'direct').valid,false);const before=JSON.stringify(s);G.act(s,'regionalPlan','direct');assert.equal(JSON.stringify(s),before);
});
test('economic quotes are deterministic reads with no cash, seed, clock or save mutation',()=>{
 const s=routes(own(rich(),['sandnes','sola'])),before=JSON.stringify(s);for(let n=0;n<3;n++){G.capitalReserve(s);G.capitalPlan(s);G.regionalInfo(s);for(const i of G.INFRA)G.infraQuote(s,i.id);for(const t of G.TERRITORIES)G.territoryQuote(s,t.id);for(const m of G.REGIONAL_MODELS)G.regionalPlanQuote(s,m.id);}assert.equal(JSON.stringify(s),before);
});
test('old regionless saves and old active-project checkpoints remain valid and migrate without free progress',()=>{
 const s=own(rich(),['sandnes']);delete s.regional;assert.equal(G.valid(s),true);const cash=s.cash,seed=s.seed;G.upgrade(s);assert.equal(s.regional.model,'direct');assert.equal(s.cash,cash);assert.equal(s.seed,seed);
 G.act(s,'regionalPlan','partners');s.regional.project.progress=3;delete s.regional.project.lastWeek;assert.equal(G.valid(s),true);G.upgrade(s);assert.equal(s.regional.project.progress,3);assert.equal(s.regional.project.lastWeek,s.week);G.onStrategicWeek(s);assert.equal(s.regional.project.progress,3);assertState(s);
 for(const change of [a=>a.project.progress=8,a=>a.project.lastWeek=s.week+1,a=>a.model='invented']){const bad=structuredClone(s);change(bad.regional);assert.equal(G.valid(bad),false);}
});
test('supply and freight territory traits reach actual route quotes and weekly ledger costs',()=>{
 const base=routes(rich()),s=structuredClone(base),unit=G.sourcePrice(base,0,0);own(s,['aalborg','sola']);assert.equal(G.sourcePrice(s,0,0),Math.round(unit*.97));const before=G.quote(base,base.routes[0],1),q=G.quote(s,s.routes[0],1);assert.equal(q.supply,q.q*G.sourcePrice(s,0,0,7));assert(q.supply<before.supply);assert(q.freight<before.freight);assert(q.risk<before.risk);assert.equal(q.expected,Math.round(q.gross*(1-q.risk)+q.supply*q.refund*q.risk-q.supply-q.freight));advanceWeek(s);const row=s.ledger.find(r=>r.week===s.week&&r.route===1);assert.equal(row.supply,q.supply);assert.equal(row.freight,q.freight);assertState(s);
});
test('training benefit is quoted and actually charged on ordinary and regional-command action paths',()=>{
 for(const command of [0,3]){const s=own(rich(),['sandnes']);s.scale.levels.command=command;s.crew.trained=0;const q=G.trainingQuote(s),cash=s.cash;assert.equal(q.cost,Math.round(q.n*2500*.92));G.act(s,'train');assert.equal(s.cash,cash-q.cost,`command ${command} charged another price`);assert.equal(s.crew.trained,q.n);assertState(s);}
});
test('production territories increase capacity and actual produced stock, not cash',()=>{
 const base=rich(),s=structuredClone(base);base.factories[0]={level:1};s.factories[0]={level:1};own(s,['jaeren']);const before=G.productionQuote(base,0),q=G.productionQuote(s,0);assert.equal(q.capacity,Math.round(G.factoryCapacity(base,0)*1.06));assert(q.qty>before.qty);
 // Production buys on the actual weekly date, whose source prices can differ
 // from today's preview. Predict that date without changing the live fixture.
 const atWeek=structuredClone(s);atWeek.week++;atWeek.day=atWeek.week*7;const expected=G.productionQuote(atWeek,0),initialStock=s.stock[G.FACTORIES[0].good];advanceWeek(s);const row=s.ledger.find(r=>r.title===G.FACTORIES[0].name+' / produksjon'&&r.week===s.week);assert.equal(row.cost,expected.cost);assert.equal(row.net,-expected.cost);assert.equal(s.stock[G.FACTORIES[0].good]-initialStock,expected.qty);assertState(s);
});
