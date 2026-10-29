const assert=require('node:assert/strict');
const G=require('./dist/engine.js');
let s=G.fresh();
G.act(s,'buy',0);assert.equal(s.stock[0],10);assert(s.cash<25000);
G.act(s,'sell',0);assert.equal(s.stock[0],0);assert(s.cash>25000);
const before=s.cash;G.act(s,'city',4);assert.equal(s.cash,before);assert.deepEqual(s.cities,[0]);
s.cash=0;G.act(s,'shift');assert(s.cash>0,'Recovery from zero capital');
s=G.fresh();G.act(s,'district',0);assert.equal(G.income(s),1250);G.act(s,'week');assert.equal(s.cash,7750);
for(let turn=0;turn<574;turn++){
 if(s.event){let e=G.EVENTS[s.event.id];let i=e.choices.findIndex(c=>s.cash+c.cash>=0);G.act(s,'choice',i);}
 if(s.managers<5&&s.cash>=15000*(s.managers+1))G.act(s,'manager');
 if(s.managers&&!s.auto)G.act(s,'auto');
 G.DISTRICTS.forEach((d,i)=>{if(s.cash>=d.cost&&!s.districts.includes(i))G.act(s,'district',i)});
 G.BUSINESSES.forEach((d,i)=>{if(s.cash>=d.cost&&!s.businesses.includes(i))G.act(s,'business',i)});
 G.CITIES.forEach((d,i)=>{if(i&&s.cash>=d.cost&&!s.cities.includes(i))G.act(s,'city',i)});
 G.act(s,s.cash<15000?'shift':'week');
 assert(Number.isFinite(s.cash)&&s.cash>=0);assert(s.heat>=0&&s.heat<=100);
}
assert(s.ended);assert.equal(s.week,574);assert.equal(s.event,null);assert.equal(s.cities.length,5);assert(G.outcome(s).coast);assert(G.outcome(s).country);assert(G.outcome(s).exit);
let endCash=s.cash;G.act(s,'shift');assert.equal(s.cash,endCash);
console.log('PASS: trading, unlock guards, recovery, passive income, all cities, 574-week completion and all three objectives.');
console.log(JSON.stringify({week:s.week,cities:s.cities.length,cash:s.cash,rep:s.rep,heat:s.heat}));
