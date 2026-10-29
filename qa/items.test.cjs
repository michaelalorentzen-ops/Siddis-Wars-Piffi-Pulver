const test=require('node:test'),assert=require('node:assert/strict');
const {Game:G,create,assertState}=require('./load.cjs');
const near=(actual,expected)=>assert(Math.abs(actual-expected)<1e-9,`${actual} != ${expected}`);
const cart=(i,n)=>G.GOODS.map((_,j)=>i===j?n:0);
test('income items affect the income quote without minting cash or consuming RNG on reads',()=>{
 const s=create(1);s.districts=[0];s.businesses=[0];const base=G.income(s),cash=s.cash,seed=s.seed;
 s.items.owned=['blueBook','coldContract'];assert.equal(G.income(s),Math.round(base*1.06*1.08));
 assert.equal(s.cash,cash);assert.equal(s.seed,seed);assertState(s);
});
test('the stage pass price is shared by visible markets and manual/automatic sales accounting',()=>{
 const s=create(1);s.stock[0]=50;s.basis[0]=100;s.managers=2;const base=G.market(s,0),source=G.sourcePrice(s,0,0);
 s.items.owned=['stagePass'];const market=G.market(s,0);assert.equal(market.price,Math.round(base.price*1.04));assert.equal(market.demand,base.demand);assert.equal(G.sourcePrice(s,0,0),source);
 for(const automatic of [false,true]){const q=G.saleQuote(s,0,20,automatic);assert.equal(q.price,market.price);assert.equal(q.q,20);assert.equal(q.basis,2000);assert.equal(q.net,q.gross-q.commission);assert.equal(q.profit,q.net-q.basis);near(q.averagePrice,q.gross/q.q);if(!automatic)assert.equal(q.gross,q.q*market.price);else {const network=G.networkDemand(s,0),full=Math.min(q.q,network);assert.equal(q.gross,Math.round((full+.65*network*Math.log1p((q.q-full)/Math.max(1,network)))*market.price));}}
 const q=G.saleQuote(s,0,10),cash=s.cash;G.act(s,'streetSell',cart(0,10));assert.equal(s.lastTrade.gross,q.gross);assert.equal(s.cash,cash+q.gross);assert.equal(s.ledger.find(r=>r.title.startsWith('Eget salg')).gross,q.gross);assertState(s);
});
test('route quote and the actual weekly ledger use item-adjusted risk, freight and sales',()=>{
 const s=create(1);s.cash=2000000;s.rep=100;s.managers=1;G.refreshRank(s);
 const r={city:0,good:0,qty:20,carrier:0,origin:0,adapt:true},base=G.quote(s,r,1);
 s.items.owned=['crewRadio','workshopKey','tideChart','stagePass'];const q=G.quote(s,r,1),m=G.itemModifiers(s);
 assert.equal(q.supply,base.supply);assert.equal(q.gross,Math.round(base.gross*1.04));assert.equal(q.freight,Math.round(base.freight*.94*.94));near(q.risk,base.risk/1.08);near(q.p,base.p*1.04);
 assert.equal(q.net,q.gross-q.supply-q.freight);assert.equal(q.expected,Math.round(q.gross*(1-q.risk)+q.supply*q.refund*q.risk-q.supply-q.freight));assert.equal(m.routeReliability,1.08);
 G.act(s,'routeAdd',r);assert.equal(s.routes.length,1);G.act(s,'week');const row=s.ledger.find(x=>x.route===s.routes[0].id);assert(row);assert.equal(row.supply,q.supply);assert.equal(row.freight,q.freight);assert.equal(row.gross,q.gross);assert.equal(row.net,q.net);assertState(s);
});
test('manual travel charges discounted freight once and records that exact fee',()=>{
 // Seed 1's first Denmark trip is uncaught; there is no weekly boundary on this trip.
 const s=create(1);s.items.owned=['workshopKey','tideChart'];const cash=s.cash,unit=G.sourcePrice(s,0,0),travel=G.travelCost(s,0),value=unit*30;
 assert.equal(travel,Math.round(G.ORIGINS[0].cost*.94*.94));G.act(s,'tripBuy',{origin:0,cart:cart(0,30)});
 assert.equal(s.lastTrade.caught,false);assert.equal(s.day,G.ORIGINS[0].days);assert.equal(s.cash,cash-value-travel);assert.equal(s.stock[0],30);assert.equal(s.basis[0],unit);
 const row=s.ledger.find(r=>r.title.startsWith('Innkjøp /'));assert.equal(row.freight,travel);assert.equal(row.supply,value);assert.equal(row.net,-value-travel);assert.equal(s.summary.net,s.cash-cash);assertState(s);
});
test('heat changes apply item effects immediately to positive gains and preserve reductions',()=>{
 const s=create(1);s.items.owned=['kitchenCard'];s.heat=50;G.addHeat(s,10);near(s.heat,59.2);G.addHeat(s,-10);near(s.heat,49.2);
 s.items.owned=['coldContract'];s.heat=98;G.addHeat(s,3);assert.equal(s.heat,100);G.addHeat(s,-10);assert.equal(s.heat,90);assertState(s);
});
test('quest heat uses the same item helper at the moment of the choice',()=>{
 const s=create(1);s.items.owned=['kitchenCard'];const heat=s.heat;G.act(s,'questChoice',{quest:'key',choice:'exploit'});near(s.heat,heat+4*.92);assert.equal(s.day,1);assert.equal(s.quests.lines.key.step,1);assertState(s);
});
