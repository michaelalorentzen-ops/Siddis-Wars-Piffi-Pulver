const test=require('node:test'),assert=require('node:assert/strict');
const {Game:G,create,assertState}=require('./load.cjs');
test('rejected legacy actions do not create scenes, announce quests or mutate saves',()=>{
 const s=create(1);assert.equal(s.experience.scenes.length,0);
 for(const [type,arg]of [['buy',0],['streetSell',G.GOODS.map((_,i)=>i?0:1)],['routeAdd',{city:99,good:0,qty:10,carrier:0,origin:0}]]){const before=JSON.stringify(s);G.act(s,type,arg);assert.equal(JSON.stringify(s),before,`${type} mutated an invalid action`);}
 assert.equal(s.quests.lines.key.announced,-1);assertState(s);
});
test('dismissing a scene changes only the bounded message queue and seen list',()=>{
 const s=create(42);G.notifyScene(s,{id:'qa-dismiss',title:'En beskjed',speaker:'Raggen',text:'Les og gå videre.',kind:'story'});
 const before=structuredClone(s),day=s.day,cash=s.cash,seed=s.seed;G.act(s,'dismissScene','qa-dismiss');assert.equal(s.day,day);assert.equal(s.cash,cash);assert.equal(s.seed,seed);assert.equal(s.experience.scenes.length,0);assert(s.experience.seen.includes('qa-dismiss'));
 before.experience=structuredClone(s.experience);assert.deepEqual(s,before);const after=JSON.stringify(s);G.act(s,'dismissScene','missing');assert.equal(JSON.stringify(s),after);assertState(s);
});
test('a registered quest choice emits the campaign ending once and persists it',()=>{
 const s=create(1);s.day=G.END_DAY-1;s.week=Math.floor(s.day/7);s.arc.lastWeek=s.week;G.upgrade(s);
 let endings=0;const off=G.on('ending',x=>{if(x===s)endings++;});try{
  G.act(s,'questChoice',{quest:'key',choice:'help'});assert.equal(s.ended,true);assert.equal(s.day,G.END_DAY);assert.equal(s.quests.lines.key.step,1);assert.equal(endings,1);assert.equal(s.experience.endingShown,true);assert(s.arc.ending);
  const ending=structuredClone(s.arc.ending);for(let i=0;i<3;i++){G.act(s,'questChoice',{quest:'key',choice:'help'});const scene=G.pendingScene(s);if(scene)G.act(s,'dismissScene',scene.id);G.act(s,'waitDay');}
  assert.equal(endings,1);assert.deepEqual(s.arc.ending,ending);assertState(s);
 }finally{off();}
});
test('promotion across a weekly boundary emits one rank hook and one scene per rank',()=>{
 const s=create(1);s.day=6;s.week=0;s.cash=G.LEVELS[1].worth-100;s.businesses=[0];G.upgrade(s);assert.equal(s.rankLevel,0);
 const events=[];const off=G.on('rank',(x,ctx)=>{if(x===s)events.push(ctx);});try{
  G.act(s,'waitDay');assert.equal(s.rankLevel,1);assert.equal(events.length,1);assert.equal(events[0].from,0);assert.equal(events[0].to,1);assert.equal(s.experience.scenes.filter(x=>x.id==='rank-1').length,1);
  G.act(s,'waitDay');G.act(s,'buy',0);assert.equal(events.length,1);assert.equal(s.experience.scenes.filter(x=>x.id==='rank-1').length,1);assertState(s);
 }finally{off();}
});
