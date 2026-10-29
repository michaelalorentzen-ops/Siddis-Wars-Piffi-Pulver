const assert=require('node:assert/strict');
require('./dist/engine.js');const G=require('./dist/strategy.js');
let s=G.fresh();assert(G.valid(s));
// A route never hides oversupply, and its preview matches the delivery week.
s.cash=10000000;s.rep=200;s.seed=100;
const route={city:0,good:0,qty:6000,carrier:1,adapt:false};let q=G.quote(s,route);
assert.equal(q.full,q.d);assert.equal(q.discounted,q.q-q.d);
assert.equal(q.gross,Math.round(q.full*q.p+q.discounted*q.p*.6));
assert.equal(q.net,q.gross-q.supply-q.freight);
assert(q.expected<q.net);assert(q.risk>0);
G.act(s,'routeAdd',route);assert.equal(s.routes.length,1);
G.act(s,'routeAdd',route);assert.equal(s.routes.length,1,'Duplicate demand cannot be sold twice');
G.act(s,'week');let row=s.ledger.find(r=>r.route);assert.equal(row.q,q.q);assert.equal(row.demand,q.d);assert.equal(row.supply,q.supply);assert.equal(row.net,(row.gross||0)+(row.refund||0)-row.supply-row.freight);
const originalId=s.routes[0].id;G.act(s,'routeEdit',{...s.routes[0],qty:100,adapt:true});assert.equal(s.routes.length,1);assert.equal(s.routes[0].id,originalId);assert.equal(s.routes[0].qty,100);assert(s.routes[0].adapt);
const beforeWeek=s.cash;G.act(s,'week');assert.equal(s.cash-beforeWeek,s.ledger.filter(r=>r.week===s.week).reduce((n,r)=>n+r.net,0),'All cash movement reconciles to ledger');
// Full-price adaptive route never exceeds demand.
q=G.quote(s,{...route,adapt:true});assert(q.q<=q.d);assert.equal(q.discounted,0);
// Payroll failure cannot make cash negative; work offers a recovery path.
let poor=G.fresh();poor.cash=0;G.act(poor,'week');assert.equal(poor.cash,0);assert(poor.crew.loyalty<70);G.act(poor,'shift');assert(poor.cash>0);
const calm=G.fresh();calm.heat=50;calm.crew.fatigue=50;G.act(calm,'rest');assert.equal(calm.heat,32);assert.equal(calm.crew.fatigue,38);
// Battles cost actual people even when the player has overwhelming strength.
let war=G.fresh();war.crew={members:100,trained:100,loyalty:95,fatigue:0};war.rep=200;war.cash=1e8;war.seed=1;
G.act(war,'scout',0);const initial=war.crew.members;G.act(war,'battle',0);assert(war.crew.members<initial);assert(war.crew.trained<=war.crew.members);assert(war.crew.fatigue>0);const after=war.crew.members;G.act(war,'battle',0);assert.equal(war.crew.members,after,'Cooldown blocks repeated battles');
// Recruiting/training are paced; allies cannot be attacked.
G.act(war,'deal',1);G.act(war,'battle',1);assert.equal(war.crew.members,after);G.act(war,'recruit');let recruited=war.crew.members;G.act(war,'recruit');assert.equal(war.crew.members,recruited);
// Fast-forward stops at a strategic city choice; routine delegation does not skip it.
let city=G.fresh();city.cash=1e8;city.rep=200;city.influence=100;city.managers=5;G.act(city,'city',1);G.advance(city,13);assert.equal(city.week,4);assert.equal(city.event.kind,'city');assert.equal(city.branches[1].level,0);G.act(city,'choice',0);assert.equal(city.branches[1].level,1);
// Full decade simulation: contracts, strategic choices, and valid saves through completion.
let run=G.fresh();run.cash=1e8;run.rep=200;run.influence=150;run.managers=5;run.districts=[0,1,2,3,4];run.businesses=[0,1,2,3];run.crew={members:40,trained:30,loyalty:80,fatigue:0};
for(let i=1;i<5;i++)G.act(run,'city',i);
while(!run.ended){if(run.event){G.act(run,'choice',0);continue;}if(!run.contract&&run.week<560)G.act(run,'contract');if(run.crew.loyalty<75)G.act(run,'crewCare');G.advance(run,13);assert(run.cash>=0);assert(G.valid(run));}
assert.equal(run.week,574);assert(run.completed>=8);assert.equal(run.event,null);assert(G.outcome(run).country);let end=run.cash;G.act(run,'week');assert.equal(run.cash,end);
// Prior saves are migrated without throwing away progress or inventory.
let old=require('./dist/engine.js').fresh();delete old.model;delete old.crew;old.stock=[1,2,3,4];old.cash=123456;assert(G.valid(old));G.upgrade(old);assert.equal(old.cash,123456);assert.deepEqual(old.stock,[1,2,3,4,0,0]);assert(G.valid(old));
console.log('PASS: demand, honest net, route preview, adaptation, losses, crew attrition, cooldowns, allies, payroll recovery, strategic time stops, 574-week completion, all-city outcome, save migration.');
