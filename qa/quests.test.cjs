const test=require('node:test');const assert=require('node:assert/strict');
const {Game:G,create,assertState}=require('./load.cjs');
// Allow this focused suite to run while the shared loader is being integrated.
if(!G.registerSystem)require('../dist/bus.js');
if(!G.storyContacts)require('../dist/content/characters.js');
if(!G.QUEST_LINES)require('../dist/content/quests.js');
if(!G.questList)require('../dist/quests.js');
function mature(){const s=create(71);s.cash=1e7;s.rep=100;s.influence=100;s.managers=4;s.crew.members=8;s.crew.trained=6;s.crew.loyalty=80;s.trips=4;s.sales=8;s.districts=[0,1];s.businesses=[0];s.routes=[0,1].map((good,i)=>({id:i+1,city:0,good,qty:10,carrier:0,origin:0,adapt:true,active:true,last:'Venter'}));G.upgrade(s);G.act(s,'waitDay');return s;}
test('campaign has four substantive eleven-step lines and nine distinct contacts',()=>{
 assert.equal(G.storyContacts.length,9);assert.equal(new Set(G.storyContacts.map(c=>c.voice)).size,9);
 assert.equal(G.QUEST_LINES.length,4);for(const q of G.QUEST_LINES){assert.equal(q.steps.length,11);assert(q.steps.every(t=>t.text.length>70&&t.objective.length>10&&t.choices.length>=2));assert(q.steps.slice(0,-1).every(t=>t.choices.every(c=>!c.item)));assert(q.steps.at(-1).choices.some(c=>c.item));}
 const s=create();assert.equal(G.questInfo(s,'key').status,'active');assert.equal(G.questInfo(s,'table').status,'locked');assertState(s);
});
test('quest choices charge their visible cost, advance a day, and cannot bypass real objectives',()=>{
 const s=create(),q=G.questInfo(s,'key'),c=q.current.choices.find(c=>c.id==='help'),cash=s.cash;
 G.act(s,'questChoice',{quest:'key',choice:'help'});assert.equal(s.day,1);assert.equal(s.cash,cash-c.cost);assert.equal(s.quests.lines.key.step,1);assert.equal(s.story.relationships.raggen,1);
 const before=JSON.stringify(s);G.act(s,'questChoice',{quest:'key',choice:'help'});assert.equal(JSON.stringify(s),before);assert.match(G.questInfo(s,'key').reason,/innkjøpsreiser/);assertState(s);
});
test('relationship changes affect actual quoted costs and rewards cannot be farmed',()=>{
 const s=mature();for(let i=0;i<11;i++){s.event=null;const q=G.questInfo(s,'key');assert(q.ready,q.reason);G.act(s,'questChoice',{quest:'key',choice:'help'});assertState(s);}
 assert.equal(G.questInfo(s,'key').status,'done');assert.deepEqual(s.items.owned,['workshopKey']);assert.equal(s.quests.lines.key.choices.length,11);
 const before=JSON.stringify(s);G.act(s,'questChoice',{quest:'key',choice:'help'});assert.equal(JSON.stringify(s),before);
 const q=G.questInfo(s,'book');s.story.relationships.nora=5;const cheaper=G.questInfo(s,'book').current.choices[0];assert(cheaper.cost<q.current.choices[0].cost);
});
test('exploit branch has persistent relationship, heat, loyalty and item consequences',()=>{
 const s=mature();for(let i=0;i<11;i++){s.event=null;G.act(s,'questChoice',{quest:'key',choice:'exploit'});}
 assert.equal(s.story.flags.workshopSold,true);assert.equal(s.story.flags.soldWorkshopNight,true);assert(s.story.relationships.raggen<0);assert(s.items.owned.includes('coldContract'));assert(G.itemModifiers(s).heatGain>1);assertState(s);
});
test('waiting never expires a quest and migration is idempotent',()=>{
 const s=create();G.act(s,'questChoice',{quest:'key',choice:'pass'});const progress=JSON.stringify(s.quests.lines.key.choices);for(let i=0;i<20;i++){s.event=null;G.act(s,'waitDay');}assert.equal(JSON.stringify(s.quests.lines.key.choices),progress);assert.equal(s.quests.lines.key.status,'active');
 G.upgrade(s);const before=JSON.stringify(s);G.upgrade(s);assert.equal(JSON.stringify(s),before);assertState(s);
});
test('all branch item multipliers are bounded and malformed quest saves are rejected',()=>{
 const s=create();s.items.owned=Object.keys(G.QUEST_ITEMS);assert(Object.values(G.itemModifiers(s)).every(v=>v>=.65&&v<=1.5));assertState(s);
 for(const mutate of [x=>x.items.owned.push('unknown'),x=>x.story.relationships.raggen=6,x=>x.quests.lines.key.step=9,x=>x.quests.lines.key.choices=[{id:'madeUp',day:0,cost:0}],x=>x.quests.lines.key.status='done']){const bad=structuredClone(s);mutate(bad);assert.equal(G.valid(bad),false);}
});
test('unaffordable or invalid answers do not mutate a save',()=>{
 const s=create();s.cash=0;for(const arg of [{quest:'key',choice:'help'},{quest:'key',choice:'constructor'},{quest:'unknown',choice:'help'},null]){const before=JSON.stringify(s);G.act(s,'questChoice',arg);assert.equal(JSON.stringify(s),before);}
});
test('quest choices require their full duration before the campaign ends',()=>{
 const late=create();late.day=G.END_DAY-1;late.week=Math.floor(late.day/7);G.upgrade(late);
 const choices=G.questInfo(late,'key').current.choices;
 assert.equal(choices.find(c=>c.id==='pass').allowed,false);assert.match(choices.find(c=>c.id==='pass').reason,/dager/);
 assert.equal(choices.find(c=>c.id==='help').allowed,true);
 const before=JSON.stringify(late);assert.match(G.act(late,'questChoice',{quest:'key',choice:'pass'}),/dager/);assert.equal(JSON.stringify(late),before);
 // A three-day branch is also blocked when only two days remain.
 const long=mature();G.act(long,'questChoice',{quest:'table',choice:'help'});assert.equal(long.quests.lines.table.step,1);
 long.day=G.END_DAY-2;long.week=Math.floor(long.day/7);long.event=null;G.upgrade(long);
 assert.equal(G.questInfo(long,'table').current.choices.find(c=>c.id==='help').allowed,false);
 const longBefore=JSON.stringify(long);G.act(long,'questChoice',{quest:'table',choice:'help'});assert.equal(JSON.stringify(long),longBefore);
 // Finishing exactly on END_DAY remains permitted and consumes every quoted day.
 const exact=create();exact.day=G.END_DAY-2;exact.week=Math.floor(exact.day/7);G.upgrade(exact);
 assert.equal(G.questInfo(exact,'key').current.choices.find(c=>c.id==='pass').allowed,true);
 G.act(exact,'questChoice',{quest:'key',choice:'pass'});assert.equal(exact.day,G.END_DAY);assert.equal(exact.summary.days,2);assert.equal(exact.quests.lines.key.step,1);assert.equal(exact.ended,true);assertState(exact);
});
function oldSave(step=0,done=false){
 const s=mature();s.quests.version=1;for(const a of Object.values(s.quests.lines))delete a.legacyComplete;
 const a=s.quests.lines.key;a.step=done?7:step;a.status=done?'done':'active';a.announced=Math.min(a.step,6);a.choices=Array.from({length:a.step},(_,i)=>({id:G.QUEST_LINES[0].steps[i].choices[0].id,day:0,cost:100}));return s;
}
test('raw completed v1 imports remain complete without invented chapters, lost items or replayed rewards',()=>{
 const s=oldSave(7,true);s.quests.lines.key.announced=7;s.items.owned=['crewRadio','workshopKey'];assert.equal(G.valid(s),true);
 const choices=structuredClone(s.quests.lines.key.choices),items=[...s.items.owned],cash=s.cash,day=s.day;G.upgrade(s);
 assert.equal(s.quests.version,2);assert.equal(s.quests.lines.key.step,11);assert.equal(s.quests.lines.key.status,'done');assert.equal(s.quests.lines.key.legacyComplete,true);assert.deepEqual(s.quests.lines.key.choices,choices);assert.equal(s.quests.lines.key.choices.length,7);assert.deepEqual(s.items.owned,items);assert.equal(s.cash,cash);assert.equal(s.day,day);assertState(s);
 const before=JSON.stringify(s);G.upgrade(s);G.act(s,'questChoice',{quest:'key',choice:'help'});assert.equal(JSON.stringify(s),before);
});
test('a v1 campaign with all four lines finished retains every item and all original closing choices',()=>{
 const s=oldSave();s.items.owned=['workshopKey','blueBook','crewRadio','tideChart','kitchenCard','stagePass','signedReceipt','coldContract'];for(const line of G.QUEST_LINES){const a=s.quests.lines[line.id];a.step=7;a.status='done';a.announced=6;a.choices=line.steps.slice(0,7).map(t=>({id:t.choices[0].id,day:0,cost:100}));}
 const histories=Object.fromEntries(Object.entries(s.quests.lines).map(([id,a])=>[id,structuredClone(a.choices)])),mods=G.itemModifiers(s);assert.equal(G.valid(s),true);G.upgrade(s);
 assert.equal(s.items.owned.length,8);assert.deepEqual(G.itemModifiers(s),mods);for(const line of G.QUEST_LINES){const a=s.quests.lines[line.id];assert.equal(a.status,'done');assert.equal(a.legacyComplete,true);assert.deepEqual(a.choices,histories[line.id]);assert.equal(a.choices.length,7);}
 const before=JSON.stringify(s);for(const line of G.QUEST_LINES)G.act(s,'questChoice',{quest:line.id,choice:'help'});assert.equal(JSON.stringify(s),before);assertState(s);
});
test('every active v1 checkpoint migrates to exactly the same chapter and keeps its history',()=>{
 for(const line of G.QUEST_LINES)for(let at=0;at<7;at++){
  const s=oldSave();const a=s.quests.lines[line.id];a.step=at;a.status='active';a.announced=at;a.choices=line.steps.slice(0,at).map(t=>({id:t.choices[0].id,day:0,cost:100}));s.items.owned=at>5?['crewRadio','signedReceipt']:[];
  assert.equal(G.valid(s),true,`${line.id}:${at} raw v1`);const history=structuredClone(a.choices),owned=[...s.items.owned];G.upgrade(s);
  assert.equal(a.step,at);assert.equal(a.status,'active');assert.equal(a.legacyComplete,false);assert.deepEqual(a.choices,history);assert.deepEqual(s.items.owned,owned);assert.equal(G.questInfo(s,line.id).current.title,line.steps[at].title);assertState(s);
 }
 const malformed=oldSave(7,true);malformed.quests.lines.key.choices.pop();assert.equal(G.valid(malformed),false);
});
test('an active legacy player can keep an earned endpoint item or select an alternative without duplicating it',()=>{
 const s=oldSave(6);s.items.owned=['crewRadio'];G.upgrade(s);for(let i=6;i<10;i++){s.event=null;G.act(s,'questChoice',{quest:'key',choice:'help'});assert.equal(s.quests.lines.key.step,i+1);}
 const q=G.questInfo(s,'key'),radio=q.current.choices.find(c=>c.id==='radio'),key=q.current.choices.find(c=>c.id==='help');assert.equal(radio.alreadyOwned,true);assert.match(radio.text,/allerede/);assert.equal(key.alreadyOwned,false);assert.equal(key.item,'workshopKey');
 const owned=[...s.items.owned];G.act(s,'questChoice',{quest:'key',choice:'radio'});assert.deepEqual(s.items.owned,owned);assert.equal(s.quests.lines.key.status,'done');assert.equal(s.quests.lines.key.choices.length,11);assertState(s);
 const before=JSON.stringify(s);G.act(s,'questChoice',{quest:'key',choice:'radio'});assert.equal(JSON.stringify(s),before);
});
test('earlier treatment of Siv changes the later scene and an actual quoted repair charge',()=>{
 const good=mature(),bad=mature();for(let i=0;i<7;i++)for(const s of [good,bad]){s.event=null;G.act(s,'questChoice',{quest:'key',choice:s===bad&&i===2?'exploit':'help'});}
 const g=G.questInfo(good,'key'),b=G.questInfo(bad,'key');assert.equal(g.step,7);assert.equal(b.step,7);assert(!g.current.text.includes('regninga du skjøv'));assert.match(b.current.text,/regninga du skjøv/);assert.equal(b.current.callbackCost,1800);assert.equal(b.current.choices[0].baseCost,g.current.choices[0].baseCost+1800);
 const cash=bad.cash,cost=b.current.choices.find(c=>c.id==='help').cost;G.act(bad,'questChoice',{quest:'key',choice:'help'});assert.equal(bad.cash,cash-cost);assert.equal(bad.story.flags.sivIndependent,true);assertState(bad);
});
function achieved(policy,heat){
 const s=mature();s.policy=policy;s.cash=25000000;s.crew.members=15;s.crew.trained=12;s.crew.loyalty=80;s.cities=[0,1,2,3];s.businesses=[0,1];s.trips=0;s.sales=0;s.routes=s.cities.map((city,i)=>({id:i+1,city,good:0,qty:10,carrier:0,origin:0,adapt:true,active:true,last:'Venter'}));G.upgrade(s);G.act(s,'waitDay');s.heat=heat;return s;
}
test('careful, expansion and aggressive networks can finish all lines through their own achievements',()=>{
 for(const [policy,heat]of [['safe',20],['balanced',60],['growth',90]]){
  const s=achieved(policy,heat);for(const line of G.QUEST_LINES)for(let i=0;i<11;i++){
   while(s.event){const e=G.eventInfo(s),choice=e.choices.findIndex(c=>s.cash+c.cash>=0);assert(choice>=0);G.act(s,'choice',choice);}
   // Persistently high exposure must not be the only way an established network can be blocked.
   s.heat=heat;const q=G.questInfo(s,line.id);assert.equal(q.step,i);assert(q.ready,`${policy} ${line.id}:${i}: ${q.reason}`);const c=q.current.choices.find(c=>c.id==='help');assert(c.allowed,c.reason);G.act(s,'questChoice',{quest:line.id,choice:c.id});assert.equal(s.quests.lines[line.id].step,i+1);assertState(s);
  }
  assert(G.questList(s).every(q=>q.status==='done'));assert.equal(s.items.owned.length,4);assert.equal(s.trips,0);assert.equal(s.sales,0);
 }
});
test('inactive routes cannot satisfy delegated alternatives, and ended campaigns offer no choices',()=>{
 const s=achieved('growth',90);s.routes.forEach(r=>r.active=false);G.act(s,'questChoice',{quest:'key',choice:'help'});const q=G.questInfo(s,'key');assert.equal(q.step,1);assert.equal(q.ready,false);assert.match(q.reason,/aktive ruter/);
 s.ended=true;for(const line of G.questList(s)){assert.equal(line.ready,false);assert.equal(line.current,null);}
});
test('aggressive cash-led choices earn four distinct endpoint objects with paid and persistent tradeoffs',()=>{
 const s=achieved('growth',90),expected={key:'coldContract',book:'debtLedger',harbor:'redManifest',table:'velvetList'},upfront={book:14000,harbor:28000,table:45000},settlement={book:20000,harbor:45000,table:70000};s.empire.nextCouncil=10000;
 for(const line of G.QUEST_LINES){assert.equal(line.steps.length,11);let safety=0;while(s.quests.lines[line.id].status!=='done'&&safety++<40){
  while(s.event)G.act(s,'choice',0);const q=G.questInfo(s,line.id);if(!q.ready&&/lojalitet/.test(q.reason)){if(s.lastCare===s.week)G.act(s,'week');else G.act(s,'crewCare');continue;}assert(q.ready,`${line.id}:${q.step} ${q.reason}`);
  const c=q.current.choices.filter(c=>c.allowed).sort((a,b)=>(b.cash||0)-(a.cash||0))[0];assert(c);if(q.step===10){assert.equal(c.item,expected[line.id]);if(upfront[line.id]){assert(c.baseCost>=upfront[line.id]);assert.equal(c.cash,settlement[line.id]);assert(c.relation<0);assert(c.loyalty<0);}const count=s.items.owned.length;G.act(s,'questChoice',{quest:line.id,choice:c.id});assert.equal(s.items.owned.length,count+1);const row=s.ledger.find(r=>r.title==='Historie / '+q.current.title);assert.equal(row.cost,c.cost);assert.equal(row.gross,c.cash||0);assert.equal(row.net,(c.cash||0)-c.cost);assert.equal(s.quests.lines[line.id].choices.at(-1).cost,c.cost);}else G.act(s,'questChoice',{quest:line.id,choice:c.id});assertState(s);
 }
 assert.equal(s.quests.lines[line.id].step,11);assert.equal(s.quests.lines[line.id].choices.length,11);}
 assert.deepEqual(s.items.owned,Object.values(expected));assert.equal(new Set(s.items.owned).size,4);
 // Existing hooks consume the selected objects: more income and price, cheaper
 // transport, higher failure risk, and more heat. Benefits are not free power.
 const neutral=structuredClone(s);neutral.items.owned=[];s.heat=neutral.heat=40;const m=G.itemModifiers(s);assert.equal(G.income(s),Math.round(G.income(neutral)*m.income));assert(G.income(s)>G.income(neutral));assert.equal(G.market(s,0).price,Math.round(G.market(neutral,0).price*1.07));assert.equal(G.travelCost(s,0),Math.round(G.travelCost(neutral,0)*.90));const r=s.routes[0],route=G.quote(s,r),base=G.quote(neutral,r);assert(route.freight<base.freight);assert(route.risk>base.risk);G.addHeat(s,10);assert.equal(s.heat,40+10*m.heatGain);assert(m.heatGain>1);
 const oldV2=structuredClone(s);oldV2.items.owned=['coldContract'];assert.equal(G.valid(oldV2),true);const before=JSON.stringify(oldV2);G.upgrade(oldV2);for(const line of G.QUEST_LINES)G.act(oldV2,'questChoice',{quest:line.id,choice:'exploit'});assert.equal(JSON.stringify(oldV2),before,'completed old v2 campaigns must not receive retroactive objects');
});
test('dark endpoint objects trade stronger specialist benefits for actual economic drawbacks',()=>{
 const base=achieved('balanced',20),only=id=>{const s=structuredClone(base);s.items.owned=[id];return s;};
 assert(G.income(only('debtLedger'))>G.income(only('blueBook')));const debt=only('debtLedger');G.addHeat(debt,10);assert(Math.abs(debt.heat-(20+11.8))<1e-9);
 const red=only('redManifest'),tide=only('tideChart');assert(G.travelCost(red,0)<G.travelCost(tide,0));assert(G.quote(red,red.routes[0]).risk>G.quote(tide,tide.routes[0]).risk);
 const velvet=only('velvetList'),stage=only('stagePass');assert(G.market(velvet,0).price>G.market(stage,0).price);assert(G.income(velvet)<G.income(stage));G.addHeat(velvet,10);assert(Math.abs(velvet.heat-(20+11.4))<1e-9);
});
