require('../dist/engine.js');
require('../dist/strategy.js');
require('../dist/commerce.js');
const Game=require('../dist/calendar.js');
function create(seed=1){const s=Game.fresh();s.seed=seed>>>0;return s;}
function assertState(s){
 if(!Game.valid(s))throw new Error('Invalid state at day '+s.day);
 if(s.cash<0||!Number.isFinite(s.cash))throw new Error('Invalid cash');
 if(s.crew.trained>s.crew.members)throw new Error('More trained members than members');
 if(s.stock.some(n=>n<0)||s.stash.some(n=>n<0))throw new Error('Negative inventory');
}
module.exports={Game,create,assertState};
