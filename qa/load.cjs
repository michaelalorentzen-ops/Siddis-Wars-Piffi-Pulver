require('../dist/engine.js');
require('../dist/strategy.js');
require('../dist/commerce.js');
require('../dist/calendar.js');
require('../dist/endgame.js');
require('../dist/scaling.js');
require('../dist/exchange.js');
require('../dist/bus.js');
require('../dist/regional.js');
require('../dist/legacy-fund.js');
require('../dist/content/characters.js');
require('../dist/content/quests.js');
require('../dist/quests.js');
require('../dist/content/crimes.js');
require('../dist/crime.js');
require('../dist/arc.js');
require('../dist/content/events.js');
const Game=require('../dist/world.js');
function create(seed=1){const s=Game.fresh();Game.seedCampaign(s,seed);return s;}
function assertState(s){
 if(!Game.valid(s))throw new Error('Invalid state at day '+s.day);
 if(s.cash<0||!Number.isFinite(s.cash))throw new Error('Invalid cash');
 if(s.crew.trained>s.crew.members)throw new Error('More trained members than members');
 if(s.stock.some(n=>n<0)||s.stash.some(n=>n<0))throw new Error('Negative inventory');
}
module.exports={Game,create,assertState};
