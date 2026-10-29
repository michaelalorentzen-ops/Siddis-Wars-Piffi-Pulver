'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {Game:G,create,assertState}=require('./load.cjs');
const O=require('../dist/onboarding.js');
function store(value=null,fail=false){return {value,writes:[],getItem(){return this.value;},setItem(key,value){if(fail)throw Error('Quota');this.writes.push({key,value});this.value=value;}};}
test('intact current and raw legacy saves bypass onboarding without being rewritten',()=>{
 const s=create(41),raw=JSON.stringify(s);assert.equal(O.classifyRaw(raw,G).kind,'valid');assert.equal(JSON.stringify(s),raw);
 const old=structuredClone(s);for(const key of ['experience','coast','quests','story','items','crime','arc','world','regional','legacyFund'])delete old[key];const legacy=JSON.stringify(old);assert.equal(O.classifyRaw(legacy,G).kind,'valid');assert.equal(JSON.stringify(old),legacy);
 for(const raw of ['', '{', 'null', '{"cash":8000}'])assert.equal(O.classifyRaw(raw,G).kind,'recovery');assert.equal(O.classifyRaw(null,G).kind,'fresh');
});
test('aliases are bounded, normalized and safely escaped while blank aliases use the default',()=>{
 assert.equal(O.sanitizeAlias('  '),'Skipperen');assert.equal(O.sanitizeAlias('  Kaia\n  Natt '),'Kaia Natt');assert.equal(Array.from(O.sanitizeAlias('ø'.repeat(80))).length,24);assert.equal(Array.from(O.sanitizeAlias('🛶'.repeat(40))).length,24);assert.equal(O.sanitizeAlias('e\u0301'),'é');assert.equal(O.escape('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;');
});
test('a confirmed setup creates one real standard8k save with no free crew, items or automation',()=>{
 const storage=store(),r=O.commitFresh(storage,'vestkyst-save-v1',null,G,{alias:'Regn',goal:'country',seed:37});assert(r.ok);assert.equal(storage.writes.length,1);const s=JSON.parse(storage.value);assert.equal(s.name,'Regn');assert.equal(s.goal,'country');assert.equal(s.cash,8000);assert.equal(s.day,0);assert.equal(s.week,0);assert.equal(s.crew.members,0);assert.equal(s.routes.length,0);assert.deepEqual(s.items.owned,[]);assert.equal(s.autoSell,false);assert.equal(s.scale.mode,'standard');assert.equal(s.scale.legacy,0);assert.equal(s.seed,37);assert.equal(s.exchange.seed,37);assertState(s);
});
test('skip defaults and ambition descriptions match the actual outcome requirements',()=>{
 const s=O.configure(G,{seed:11});assert.equal(s.name,'Skipperen');assert.equal(s.goal,'coast');assert.deepEqual(Object.keys(O.ambitions),['coast','country','exit']);assert.match(O.ambitions.country.requirements,/nasjonalt prosjekt/);assert.match(O.ambitions.exit.requirements,/etterfølgelsesprosjekt/);assert.match(O.ambitions.exit.requirements,/åtte/);assert.equal(G.outcome(s).won,false);
 const winning=create(1);winning.cities=[0,1,2,3,4];winning.districts=[0,1,2];winning.influence=100;winning.crew.loyalty=60;winning.cash=12000000;winning.heat=25;winning.completed=8;G.upgrade(winning);for(const b of Object.values(winning.branches)){b.level=3;b.pressure=59;}assert.equal(G.outcome(winning).coast,true);assert.equal(G.outcome(winning).country,false);assert.equal(G.outcome(winning).exit,false);winning.empire.legacy.national=true;winning.empire.legacy.succession=true;assert.equal(G.outcome(winning).country,true);assert.equal(G.outcome(winning).exit,true);
});
test('corrupt originals are protected until explicit replacement, and failed writes preserve them',()=>{
 const raw='{"damaged":',storage=store(raw),blocked=O.commitFresh(storage,'vestkyst-save-v1',raw,G,{seed:1});assert.equal(blocked.ok,false);assert.equal(blocked.reason,'protected');assert.equal(storage.value,raw);assert.equal(storage.writes.length,0);
 const failed=store(raw,true),r=O.commitFresh(failed,'vestkyst-save-v1',raw,G,{seed:1,allowReplace:true});assert.equal(r.ok,false);assert.equal(failed.value,raw);assert.equal(failed.writes.length,0);
 const allowed=O.commitFresh(storage,'vestkyst-save-v1',raw,G,{seed:1,allowReplace:true});assert(allowed.ok);assert.equal(storage.writes.length,1);assertState(allowed.state);
});
test('a changed save from another tab cannot be overwritten by stale onboarding confirmation',()=>{
 const raw=JSON.stringify(create(73)),storage=store(raw);let creations=0;const wrapped={...G,fresh(){creations++;return G.fresh();}};
 const r=O.commitFresh(storage,'vestkyst-save-v1',null,wrapped,{seed:1});assert.equal(r.ok,false);assert.equal(r.reason,'changed');assert.equal(creations,0);assert.equal(storage.value,raw);assert.equal(storage.writes.length,0);
});
