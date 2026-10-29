'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {Game:G,create}=require('./load.cjs');
const basic=require('./simulate.cjs'),experience=require('./experience-sim.cjs');
test('first-rank tracker keeps actual action order, source counts and a frozen first crossing',()=>{
 const tracker=basic.progressionTracker(),before={rankLevel:0,day:3},crossing={rankLevel:1,day:8};Object.freeze(before);Object.freeze(crossing);
 tracker.record(before,'tripBuy');tracker.record(before,'questChoice','injected');tracker.record(crossing,'crimeAttempt','injected');
 const result=tracker.snapshot();assert.deepEqual(result,{firstRankDay:8,firstRankActions:3,firstRankBusinessActions:1,firstRankInjectedActions:2,firstRankActionsByType:{tripBuy:1,questChoice:1,crimeAttempt:1},firstRankClicks:null,firstRankWithin60Actions:true});
 result.firstRankActionsByType.tripBuy=99;tracker.record({rankLevel:2,day:70},'advance');assert.equal(tracker.snapshot().firstRankActions,3);assert.equal(tracker.snapshot().firstRankActionsByType.tripBuy,1);assert.equal(crossing.day,8);
});
test('unreached first rank has null time/actions/clicks and is not silently excluded from the summary',()=>{
 const tracker=basic.progressionTracker();tracker.record({rankLevel:0,day:20},'shift');const missing=tracker.snapshot();assert.equal(missing.firstRankDay,null);assert.equal(missing.firstRankActions,null);assert.equal(missing.firstRankWithin60Actions,null);
 const reached={firstRankActions:61,firstRankDay:100,firstRankBusinessActions:40,firstRankInjectedActions:21,firstRankActionsByType:{tripBuy:5,streetSell:35,crimeAttempt:21},firstRankWithin60Actions:false};const summary=basic.progressionSummary([missing,reached]);assert.equal(summary.firstRankReached,1);assert.equal(summary.firstRankUnreached,1);assert.equal(summary.firstRankWithin60Actions,0);assert.equal(summary.medianFirstRankActions,61);assert.equal(summary.firstRankClicks,null);
});
test('normal-start integrated early actions count business and injected choices once and restore the public action function',()=>{
 const original=G.act;for(const profile of ['careful','expansion','aggressive']){const r=experience.simulate(1,profile,60,false,{stopAtFirstRank:true});assert.equal(r.normalStartCash,8000);assert.deepEqual(r.errors,[]);assert.deepEqual(r.economy.errors,[]);assert.equal(r.economy.measurementStop,'first_rank');assert.equal(r.economy.stalled,false);assert.equal(r.firstRankActions,r.firstRankBusinessActions+r.firstRankInjectedActions);assert.equal(r.firstRankActions,Object.values(r.firstRankActionsByType).reduce((n,v)=>n+v,0));assert(r.firstRankBusinessActions<=r.economy.actions);assert(r.firstRankInjectedActions<=r.injectedActions);assert.equal(r.firstRankClicks,null);assert.equal(G.act,original);}
});
test('real-start business early measurement stops on earned rank without replacing its ordinary policy',()=>{
 const early=basic.simulate(1,'careful',60,'standard',0,{stopAtFirstRank:true}),normalPrefix=basic.simulate(1,'careful',early.actions);
 assert.equal(early.measurementStop,'first_rank');assert.equal(early.firstRankDay,normalPrefix.firstRankDay);assert.equal(early.firstRankActions,normalPrefix.firstRankActions);assert.deepEqual(early.firstRankActionsByType,normalPrefix.firstRankActionsByType);assert.equal(early.cash,normalPrefix.cash);assert.equal(early.firstRankInjectedActions,0);assert.equal(early.firstRankActions,early.actions);assert(early.firstRankActions<=60);
});
test('owned item paths require matching recorded quest reward evidence, with unknown legacy ownership explicit',()=>{
 const s=create(4),line=G.QUEST_LINES.find(q=>q.id==='key'),itemStep=line.steps.findIndex(step=>step.choices.some(c=>c.item&&c.id==='exploit')),reward=line.steps[itemStep].choices.find(c=>c.item&&c.id==='exploit');assert(itemStep>=0);
 s.items.owned=[reward.item,'blueBook'];s.quests.lines.key.choices=line.steps.slice(0,itemStep+1).map((step,i)=>({id:i===itemStep?reward.id:step.choices[0].id,day:i,cost:0}));
 const before=JSON.stringify(s),r=basic.itemMetrics(s);assert.equal(r.itemsOwned,2);assert.equal(r.itemPathCounts.dark,1);assert.equal(r.itemPathCounts.unknown,1);assert.equal(r.itemPathEvidence.find(x=>x.item===reward.item).choices[0].step,itemStep);assert.equal(JSON.stringify(s),before);
 const summary=basic.itemSummary([r]);assert.equal(summary.medianItemsOwned,2);assert.equal(summary.medianItemsByPath.dark,1);assert.equal(summary.medianItemsByPath.unknown,1);
});
test('coastal invitation image URL resolves to the actual packaged WebP asset',()=>{
 const fs=require('node:fs'),path=require('node:path'),css=fs.readFileSync(path.join(__dirname,'../dist/coast.css'),'utf8');assert(!css.includes('coast-islands.png'));assert(css.includes('coast-islands.webp'));assert(fs.existsSync(path.join(__dirname,'../dist/assets/coast-islands.webp')));
});

test('early benchmark preserves every seed, real starts and source provenance without inventing browser clicks',()=>{
 const report=require('./early-progress.cjs').run(1);assert.equal(report.rows.length,6);assert.equal(report.jobs.length,1);assert(report.rows.every(row=>row.normalStartCash===8000&&row.firstRankClicks===null));assert.equal(report.sourceBefore.sha256,report.sourceAfter.sha256);assert.deepEqual(report.agentsBefore,report.agentsAfter);assert(report.rows.every(row=>row.errors.length===0));assert.equal(report.jobsOnly.firstRankUnreached,1);assert.equal(report.jobs[0].day,90);
});

test('ownership reporting keeps productive capital, negotiation expense, construction and completed paths separate',()=>{
 const synthetic={ownership:{mandate:'control',invested:100,firms:{0:{level:1,path:'control',paid:60,project:null,pending:{revision:1},history:[{kind:'invest',cost:60},{kind:'buyout',cost:7}]},1:{level:0,path:'partners',paid:40,project:{level:1},pending:null,history:[{kind:'invest',cost:40}]}}}};const before=JSON.stringify(synthetic),row=basic.ownershipMetrics(synthetic);assert.equal(row.ownershipInvested,100);assert.equal(row.ownershipNegotiationExpenseRecorded,7);assert.equal(row.ownershipCompletedFirms,1);assert.equal(row.ownershipCompletedStages,1);assert.equal(row.ownershipActiveProjects,1);assert.deepEqual(row.ownershipPendingCities,[0]);assert.deepEqual(row.ownershipCompletedPaths,{partners:0,control:1});assert.deepEqual(row.ownershipCommittedPaths,{partners:1,control:1});assert.equal(JSON.stringify(synthetic),before);const summary=basic.ownershipSummary([row]);assert.equal(summary.medianOwnershipInvested,100);assert.equal(summary.medianOwnershipNegotiationExpenseRecorded,7);assert.equal(summary.ownershipMandates.control,1);
});
test('paired ownership control leaves the unchanged early public-action policy identical',()=>{
 const opts={stopAtFirstRank:true},a=basic.simulate(1,'careful',60,'standard',0,opts),b=basic.simulate(1,'careful',60,'standard',0,{...opts,disableOwnership:true});assert.deepEqual(a,b);assert.equal(a.ownershipInvested,0);assert.equal(a.ownershipMandate,'manual');assert.equal(basic.ownershipPolicyDefinition.mandates.careful,'partners');assert.match(basic.ownershipPolicyDefinition.scope,/post-Godfather/);
});
