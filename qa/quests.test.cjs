const test=require('node:test');const assert=require('node:assert/strict');
const {Game:G,create,assertState}=require('./load.cjs');
// Allow this focused suite to run while the shared loader is being integrated.
if(!G.registerSystem)require('../dist/bus.js');
if(!G.storyContacts)require('../dist/content/characters.js');
if(!G.QUEST_LINES)require('../dist/content/quests.js');
if(!G.questList)require('../dist/quests.js');
function mature(){const s=create(71);s.cash=1e7;s.rep=100;s.influence=100;s.managers=4;s.crew.members=8;s.crew.trained=6;s.crew.loyalty=80;s.trips=4;s.sales=8;s.districts=[0,1];s.businesses=[0];s.routes=[{id:1,city:0,good:0,qty:10,carrier:0,origin:0,adapt:true,active:true,last:'Venter'}];G.upgrade(s);G.act(s,'waitDay');return s;}
test('fictional campaign has four substantive seven-step lines and nine distinct contacts',()=>{
 assert.equal(G.storyContacts.length,9);assert.equal(new Set(G.storyContacts.map(c=>c.voice)).size,9);
 assert.equal(G.QUEST_LINES.length,4);for(const q of G.QUEST_LINES){assert.equal(q.steps.length,7);assert(q.steps.every(t=>t.text.length>70&&t.objective.length>10&&t.choices.length>=2));}
 const s=create();assert.equal(G.questInfo(s,'key').status,'active');assert.equal(G.questInfo(s,'table').status,'locked');assertState(s);
});
test('quest choices charge their visible cost, advance a day, and cannot bypass real objectives',()=>{
 const s=create(),q=G.questInfo(s,'key'),c=q.current.choices.find(c=>c.id==='help'),cash=s.cash;
 G.act(s,'questChoice',{quest:'key',choice:'help'});assert.equal(s.day,1);assert.equal(s.cash,cash-c.cost);assert.equal(s.quests.lines.key.step,1);assert.equal(s.story.relationships.raggen,1);
 const before=JSON.stringify(s);G.act(s,'questChoice',{quest:'key',choice:'help'});assert.equal(JSON.stringify(s),before);assert.match(G.questInfo(s,'key').reason,/innkjøpsreiser/);assertState(s);
});
test('relationship changes affect actual quoted costs and rewards cannot be farmed',()=>{
 const s=mature();for(let i=0;i<7;i++){s.event=null;const q=G.questInfo(s,'key');assert(q.ready,q.reason);G.act(s,'questChoice',{quest:'key',choice:'help'});assertState(s);}
 assert.equal(G.questInfo(s,'key').status,'done');assert(s.items.owned.includes('workshopKey'));assert(s.items.owned.includes('crewRadio'));assert.equal(s.quests.lines.key.choices.length,7);
 const before=JSON.stringify(s);G.act(s,'questChoice',{quest:'key',choice:'help'});assert.equal(JSON.stringify(s),before);
 const q=G.questInfo(s,'book');s.story.relationships.nora=5;const cheaper=G.questInfo(s,'book').current.choices[0];assert(cheaper.cost<q.current.choices[0].cost);
});
test('exploit branch has persistent relationship, heat, loyalty and item consequences',()=>{
 const s=mature();for(let i=0;i<7;i++){s.event=null;G.act(s,'questChoice',{quest:'key',choice:'exploit'});}
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
