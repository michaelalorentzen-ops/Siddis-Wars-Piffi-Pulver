const fs=require('node:fs'),path=require('node:path');const {simulate}=require('./simulate.cjs');
const seeds=[1,7,19,42,71,113,257,503,997,1337];
const profiles=['careful','expansion','aggressive'];
const modes=[{id:'standard',mode:'standard',legacy:0},{id:'dynasty1',mode:'dynasty',legacy:1},{id:'dynasty3',mode:'dynasty',legacy:3}];
function percentile(values,p){if(!values.length)return null;const a=[...values].sort((x,y)=>x-y),at=(a.length-1)*p,lo=Math.floor(at),hi=Math.ceil(at);return a[lo]+(a[hi]-a[lo])*(at-lo);}
function distribution(values){return {n:values.length,p10:percentile(values,.1),p25:percentile(values,.25),median:percentile(values,.5),p75:percentile(values,.75),p90:percentile(values,.9)};}
const runs=[];
for(const seed of seeds)for(const profile of profiles)for(const mode of modes){
 const r=simulate(seed,profile,3000,mode.mode,mode.legacy);
 runs.push({seed,profile,condition:mode.id,legacy:mode.legacy,mode:r.score.mode,automationDay:r.automationDay,godfatherDay:r.rankDays[5],imperialValue:r.score.value,areas:r.score.areas,errors:r.errors,stalled:r.stalled,ended:r.ended,days:r.days,actions:r.actions});
}
function comparison(condition,profile){
 const selected=runs.filter(r=>r.condition===condition&&(!profile||r.profile===profile));
 const pairs=selected.map(r=>({baseline:runs.find(b=>b.condition==='standard'&&b.seed===r.seed&&b.profile===r.profile),variant:r}));
 const metrics={};
 for(const metric of ['automationDay','godfatherDay','imperialValue','areas']){
  const reached=x=>typeof x==='number'&&Number.isFinite(x);
  const usable=pairs.filter(p=>!p.baseline.errors.length&&!p.variant.errors.length&&!p.baseline.stalled&&!p.variant.stalled&&reached(p.baseline[metric])&&reached(p.variant[metric]));
  const deltas=usable.map(p=>p.variant[metric]-p.baseline[metric]);
  const ratios=usable.filter(p=>p.baseline[metric]>0).map(p=>p.variant[metric]/p.baseline[metric]);
  const percentChanges=ratios.map(r=>(r-1)*100),timeMetric=metric.endsWith('Day');
  metrics[metric]={eligiblePairs:pairs.length,paired:usable.length,excluded:pairs.length-usable.length,baselineOnlyReached:pairs.filter(p=>reached(p.baseline[metric])&&!reached(p.variant[metric])).length,variantOnlyReached:pairs.filter(p=>!reached(p.baseline[metric])&&reached(p.variant[metric])).length,neitherReached:pairs.filter(p=>!reached(p.baseline[metric])&&!reached(p.variant[metric])).length,delta:distribution(deltas),ratio:distribution(ratios),percentChange:distribution(percentChanges),...(timeMetric?{faster:deltas.filter(d=>d<0).length,equal:deltas.filter(d=>d===0).length,slower:deltas.filter(d=>d>0).length}:{higher:deltas.filter(d=>d>0).length,equal:deltas.filter(d=>d===0).length,lower:deltas.filter(d=>d<0).length})};
 }
 return {condition,profile:profile||'all',pairs:pairs.length,metrics};
}
const pairedComparisons=modes.slice(1).flatMap(m=>[comparison(m.id),...profiles.map(p=>comparison(m.id,p))]);
const summary=modes.flatMap(m=>profiles.map(profile=>{const group=runs.filter(r=>r.condition===m.id&&r.profile===profile);return {condition:m.id,profile,runs:group.length,technicalFailures:group.filter(r=>r.errors.length).length,stalled:group.filter(r=>r.stalled).length,completed:group.filter(r=>r.ended).length,automationReached:group.filter(r=>r.automationDay!==null).length,godfatherReached:group.filter(r=>r.godfatherDay!==null).length,automationDay:distribution(group.map(r=>r.automationDay).filter(Number.isFinite)),godfatherDay:distribution(group.map(r=>r.godfatherDay).filter(Number.isFinite)),imperialValue:distribution(group.map(r=>r.imperialValue))};}));
const report={schema:2,finding:'F13',method:'Ten fixed campaign seeds × three heuristic profiles × three conditions = 90 runs, forming 30 matched triplets and 60 baseline/variant pairs. Each pair uses the same seed and policy; inherited-mode risk and economic changes can alter later trajectories. Standard legacy 0 is compared with dynasty legacy 1 and dynasty legacy 3. Campaign seed creation remains owned by simulate/create.',percentileMethod:'Linear interpolation at (n−1)×p; the median of paired changes is computed directly, not the difference of group medians. Negative day deltas and ratios below 1 mean earlier milestones. Higher final value is not automatically better gameplay.',exclusions:'Missing milestones are censored, not set to zero or campaign end. Paired distributions exclude either-side technical failure, stalled run, or missing metric. Reached-only counts and excluded-pair counts are reported. No requirement forces every seed to improve.',limits:['Heuristic policies do not explore narrative, crime or all player strategies.','Ten seeds per profile are an exploratory robustness check, not a population estimate or balance approval.','Ratios compare days from campaign start; they do not measure player effort, enjoyment or difficulty.','The 60 pairs share 30 baseline campaigns and are not independent observations.','New story/item systems are loaded but are not actively pursued by this simulator.'],seeds,profiles,conditions:modes,runCount:runs.length,tripletCount:seeds.length*profiles.length,baselineVariantPairCount:seeds.length*profiles.length*2,balanceVerdict:'exploratory_only_not_a_balance_approval',summary,pairedComparisons,runs};
const dir=path.join(__dirname,'reports');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'meta.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({runCount:report.runCount,tripletCount:report.tripletCount,baselineVariantPairCount:report.baselineVariantPairCount,summary,pairedComparisons:pairedComparisons.filter(p=>p.profile==='all'),limits:report.limits},null,2));
if(runs.some(r=>r.errors.length||r.stalled))process.exitCode=1;

