const test=require('node:test');
const assert=require('node:assert/strict');
const {Game:G,create}=require('./load.cjs');
test('legacy import seed is independent of wall clock and existing seeds survive',()=>{const saved=create(42);delete saved.seed;const a=structuredClone(saved),b=structuredClone(saved),now=Date.now;try{Date.now=()=>100;G.upgrade(a);Date.now=()=>999999;G.upgrade(b);}finally{Date.now=now;}assert.equal(a.seed,b.seed);assert(Number.isInteger(a.seed));const explicit=create(42);G.upgrade(explicit);assert.equal(explicit.seed,42);});
test('fixed cost preview matches four weeks of starting upkeep',()=>{const s=create();assert.deepEqual(G.fixedCosts(s,4),{weeks:4,weekly:500,total:2000});assert.equal(G.fixedCosts(s,1).total,500);s.managers=2;s.crew.members=3;s.crew.trained=1;assert.equal(G.fixedCosts(s,4).total,4*(500+1500+450+100));});
test('cost preview has no charge for ended rounds or invalid periods',()=>{const s=create();assert.equal(G.fixedCosts(s,-1).total,0);s.ended=true;assert.equal(G.fixedCosts(s,13).total,0);});
