'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {Game:G,create}=require('./load.cjs');
const basic=require('./simulate.cjs'),experience=require('./experience-sim.cjs');
test('financial reporting separates gifts, productive investment and both cash denominators without mutation',()=>{
 const s=create(7);s.scale.assetBook=1000000;s.scale.invested=1500000;s.scale.postInvested=50000;s.legacyFund.paid=20000000;
 const snapshot=JSON.stringify(s),m=basic.financialMetrics(s);
 assert.equal(m.legacyGiven,20000000);assert.equal(m.productiveReinvestment,1500000);assert.equal(m.postGodfatherProductiveReinvestment,50000);
 assert.equal(m.cashNetWorthDenominator,m.netWorth);assert.equal(m.cashNetWorthRatio,Math.round(s.cash)/m.netWorth);
 assert.equal(m.imperialValue,G.empireScore(s).value);assert.equal(m.cashImperialValueDenominator,m.imperialValue);assert.equal(m.cashImperialValueRatio,Math.round(s.cash)/m.imperialValue);
 assert.equal(JSON.stringify(s),snapshot);
});
test('nonpositive denominators stay undefined and ratio medians count only defined runs',()=>{
 const s=create(8),zero=basic.financialMetrics(s);assert.equal(zero.cashImperialValueDenominator,0);assert.equal(zero.cashImperialValueRatio,null);
 s.loan={balance:1000000000,due:100};const debt=basic.financialMetrics(s);assert(debt.cashNetWorthDenominator<=0);assert.equal(debt.cashNetWorthRatio,null);
 const rows=[{...zero,legacyGiven:10,cashNetWorthRatio:.25,cashImperialValueRatio:2},{...zero,legacyGiven:20,cashNetWorthRatio:.75,cashImperialValueRatio:4},{...zero,legacyGiven:90,cashNetWorthRatio:null,cashImperialValueRatio:null}],summary=basic.financialSummary(rows);
 assert.equal(summary.medianLegacyGiven,20);assert.equal(summary.medianCashNetWorthRatio,.75);assert.equal(summary.cashNetWorthRatioDefinedRuns,2);
 assert.equal(summary.medianCashImperialValueRatio,4);assert.equal(summary.cashImperialValueRatioDefinedRuns,2);assert.equal(summary.medianCashImperialValueDenominator,0);
 assert.match(basic.financialDefinitions.cashImperialValueRatio,/distinct from net worth/);
});
test('both simulator row schemas expose separate cash ratios after only one policy step',()=>{
 const rows=[basic.simulate(1,'careful',1),experience.simulate(1,'careful',1,false)];
 for(const row of rows){for(const key of ['legacyGiven','productiveReinvestment','netWorth','cashNetWorthRatio','cashNetWorthDenominator','imperialValue','cashImperialValueRatio','cashImperialValueDenominator'])assert(Object.hasOwn(row,key),key);
 assert.equal(row.cashNetWorthDenominator,row.netWorth);assert.equal(row.cashImperialValueDenominator,row.imperialValue);
 if(row.cashImperialValueDenominator<=0)assert.equal(row.cashImperialValueRatio,null);
 else assert.equal(row.cashImperialValueRatio,Math.round(row.cash)/row.cashImperialValueDenominator);
 }
});

