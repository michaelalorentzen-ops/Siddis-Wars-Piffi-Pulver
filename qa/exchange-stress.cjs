const fs=require('node:fs'),path=require('node:path'),{Game:G,create,assertState}=require('./load.cjs');
// Synthetic isolated market stress, NOT campaign balance evidence or normal-earned wealth.
const profiles=['income','diverse','speculative','trader'],runs=[];
for(const profile of profiles)for(let seed=1;seed<=25;seed++){
 const s=create(seed);s.cash=10000000;s.rankLevel=4;s.managers=2;s.exchange.plan=['income','diverse'].includes(profile)?profile:'manual';let error=null,peak=G.netWorth(s),drawdown=0;
 try{for(let w=1;w<=573;w++){s.week=w;s.day=w*7;G.onStrategicWeek(s);if(s.event)G.act(s,'defer');
 if(profile==='speculative'&&w%13===1){const id='HHA',qty=Math.min(250000,Math.floor(s.cash*.3/(s.exchange.prices[id]/100*1.025)));if(qty>0)G.act(s,'stockBuy',{id,qty});}
 if(profile==='trader'&&w%4===1){for(const c of G.STOCKS){const n=s.exchange.positions[c.id]?.qty||0;if(n)G.act(s,'stockSell',{id:c.id,qty:Math.min(250000,n)});}const c=G.STOCKS[Math.floor(w/4)%G.STOCKS.length],qty=Math.min(100000,Math.floor(s.cash*.25/(s.exchange.prices[c.id]/100*1.025)));if(qty>0&&!s.event)G.act(s,'stockBuy',{id:c.id,qty});}
 const worth=G.netWorth(s);peak=Math.max(peak,worth);drawdown=Math.max(drawdown,peak?1-worth/peak:0);assertState(s);
 }}catch(e){error={day:s.day,week:s.week,message:e.message};}
 runs.push({profile,seed,error,cash:Math.round(s.cash),portfolio:Math.round(G.stockValue(s)),wealth:Math.round(G.netWorth(s)),dividends:s.exchange.dividends,fees:s.exchange.fees,realized:s.exchange.realized,maxDrawdown:drawdown});
}
const median=a=>[...a].sort((a,b)=>a-b)[Math.floor(a.length/2)],summary=Object.fromEntries(profiles.map(p=>{const r=runs.filter(r=>r.profile===p);return [p,{runs:r.length,failures:r.filter(r=>r.error).length,medianWealth:median(r.map(r=>r.wealth)),medianDividends:median(r.map(r=>r.dividends)),medianMaxDrawdown:median(r.map(r=>r.maxDrawdown))}];}));
const report={method:'100 privileged, synthetic market-only portfolios. Direct weekly exchange hooks isolate portfolio mechanics; these are not normal campaign agents or proof of economic balance.',summary,runs};const dir=path.join(__dirname,'reports');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'exchange-stress.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({method:report.method,summary},null,2));if(runs.some(r=>r.error))process.exitCode=1;
