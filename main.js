var work = require('workers');
var harv = require('harvesters');
var tran = require('transporters');
var towr = require('towers');
var link = require('links');
var dstr = require('destroyers');
var spcr = require('spawncreater');
var mine = require('miner');
for(var i in Memory.creeps) {
    if(!Game.creeps[i]) {
        delete Memory.creeps[i];
    }
}
// console.log(Game.market.createOrder(ORDER_SELL, RESOURCE_HYDROGEN, 0.1, 300, 'W21S1'));
module.exports.loop = function()
{

      //     for(i in Game.rooms)
    //     {
    //         var ro = Game.rooms[i];
    //         towers = ro.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_TOWER}});
    //         if(towers.length == 0)
    //             continue;
    //         if(this.attack() == 1)
    //             continue;
    //         if(this.heal() == 1)
    //             continue;
    //         this.repair();
    //     }
    // dstr.main();
    // mine.main();
    // link.main();
    work.main();
    tran.main();
    harv.main();
    towr.main();

}
