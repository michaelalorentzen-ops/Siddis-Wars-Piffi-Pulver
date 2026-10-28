const test=require('node:test');const assert=require('node:assert/strict');const {Game:G,create,assertState}=require('./load.cjs');
const cart=(i,n)=>G.GOODS.map((_,j)=>j===i?n:0);
test('new player must procure and own goods before selling; automation is earned',()=>{
 const s=create();assert.equal(s.cash,8000);assert.equal(s.rankLevel,0);assert.equal(s.routes.length,0);assert.equal(s.crew.members,0);
 G.act(s,'autoSell');assert.equal(s.autoSell,false);G.act(s,'routeAdd',{city:0,good:0,qty:20,carrier:0,origin:0,adapt:true});assert.equal(s.routes.length,0);
 G.act(s,'buy',0);assert.equal(s.stock[0],0);G.act(s,'streetSell',cart(0,1));assert.equal(s.cash,8000);assertState(s);
});
test('round trip charges actual procurement and travel, advances days, and delivers stock separately from sales',()=>{
 const s=create(1),price=G.sourcePrice(s,0,0),start=s.cash;G.act(s,'tripBuy',{origin:0,cart:cart(0,30)});
 assert.equal(s.day,5);assert.equal(s.week,0);assert.equal(s.cash,start-price*30-G.ORIGINS[0].cost);assert.equal(s.stock[0],30);assert.equal(s.sales,0);assert.equal(s.basis[0],price);assertState(s);
 assert.equal(s.summary.net,s.cash-start);assert.equal(s.summary.days,5);
});
test('unaffordable or unavailable foreign orders cannot mutate cash or inventory',()=>{
 const s=create(),start=JSON.stringify(s);G.act(s,'tripBuy',{origin:0,cart:cart(0,1000000)});assert.equal(JSON.stringify(s),start);
 s.cash=1e6;s.rankLevel=3;G.act(s,'tripBuy',{origin:0,cart:cart(5,1)});assert.equal(s.stock[5],0);assert.equal(s.trips,0);
});
test('daily market cannot be rerolled and limits manual sales to owned stock and visible demand',()=>{
 const s=create();s.stock[0]=10000;const a=G.market(s,0);assert.deepEqual(G.market(s,0),a);
 G.act(s,'streetSell',cart(0,a.demand+1));assert.equal(s.stock[0],10000);assert.equal(s.day,0);
 G.act(s,'streetSell',cart(0,a.demand));assert.equal(s.stock[0],10000-a.demand);assert(s.day>=4&&s.day<=7);assert.equal(s.lastTrade.gross,a.demand*a.price);assertState(s);
});
test('a sale reports historical procurement cost without charging the cash twice',()=>{
 const s=create();s.stock[0]=20;s.basis[0]=100;const q=G.saleQuote(s,0,20),before=s.cash;G.act(s,'streetSell',cart(0,20));
 assert.equal(s.lastTrade.basis,2000);assert.equal(s.lastTrade.profit,q.gross-2000);const row=s.ledger.find(r=>r.title.startsWith('Eget salg'));assert.equal(row.net,q.gross);assert.equal(row.profit,q.gross-2000);
 assert.equal(s.summary.net,s.cash-before);assert.equal(s.summary.days,s.lastTrade.days);
});
test('debt does not buy a rank and has a visible premium and due date',()=>{
 const s=create();G.act(s,'borrow');assert.equal(s.cash,18000);assert.equal(s.loan.balance,12000);assert.equal(s.loan.due,28);assert.equal(G.netWorth(s),6000);assert.equal(s.rankLevel,0);assertState(s);
});
test('warehousing preserves cost basis and automatic distribution sells all stock without a monthly cash cap',()=>{
 const s=create();s.cash=1e6;G.refreshRank(s);s.managers=20;s.cities=[0,1,2,3,4];G.upgrade(s);s.autoSell=true;s.stock[0]=1000000;s.basis[0]=100;
 G.act(s,'stash',{good:0,to:'stash'});assert.equal(s.stock[0],0);assert.equal(s.stash[0],1000000);G.act(s,'week');
 assert.equal(s.stock[0]+s.stash[0],0);const row=s.ledger.find(r=>r.title.startsWith('Salgsapparat'));assert.equal(row.q,1000000);assert(row.gross>3000000);assert(row.cost>0);assertState(s);
});
test('production fills inventory rather than manufacturing cash, and remains expandable',()=>{
 const s=create();s.cash=2e6;G.refreshRank(s);G.act(s,'factory',0);const before=s.cash;G.act(s,'week');assert(s.stock[6]>=700);assert(s.cash<before);G.act(s,'factory',0);assert.equal(s.factories[0].level,2);assertState(s);
});
test('customs risk grows with exposure and never becomes a free monthly pass',()=>{
 const s=create(),low=G.customs(s,1000,0);assert(low>0);assert(G.customs(s,1000000,0)>low);s.heat=80;assert(G.customs(s,1000000,0)>.25);
});
test('waiting a day reduces heat and fatigue without accidentally consuming a week',()=>{
 const s=create();s.heat=40;s.crew.fatigue=30;G.act(s,'waitDay');assert.equal(s.day,1);assert.equal(s.week,0);assert.equal(s.heat,38);assert.equal(s.crew.fatigue,28);assertState(s);
});
test('journey interrupted by a strategic decision cannot deliver cargo early',()=>{
 const s=create();s.day=25;s.week=3;s.cash=2e6;s.rankLevel=3;s.cities.push(1);G.upgrade(s);s.branches[1].since=0;
 G.act(s,'tripBuy',{origin:4,cart:cart(5,2)});assert.equal(s.day,28);assert.equal(s.event.kind,'city');assert(s.trip);assert.equal(s.stock[5],0);
 G.act(s,'choice',0);G.act(s,'continueTrip');assert.equal(s.day,40);assert.equal(s.trip,null);assert.equal(s.stock[5],2);assertState(s);
});
test('trade and route flow conserve state throughout the complete calendar',()=>{
 const s=create(500);s.cash=1e7;G.refreshRank(s);s.managers=4;s.influence=100;s.districts=[0,1,2];
 G.act(s,'routeAdd',{city:0,good:0,qty:200,carrier:0,origin:0,adapt:true});assert.equal(s.routes.length,1);
 while(!s.ended){if(s.event)G.act(s,'choice',0);else G.act(s,'advance',13);assertState(s);}
 assert.equal(s.day,G.END_DAY);assert.equal(s.week,Math.floor(G.END_DAY/7));const cash=s.cash;G.act(s,'advance',13);assert.equal(s.cash,cash);
});
test('classic six-item alpha saves migrate without dropping inventory',()=>{
 const s=create();delete s.commerce;delete s.stash;delete s.basis;delete s.saturation;s.stock=[1,2,3,4,5,6];assert(G.valid(s));G.upgrade(s);assert.deepEqual(s.stock,[1,2,3,4,5,6,0,0,0,0]);assertState(s);
});
