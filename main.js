const towr = require('towers');
const link = require('links');
const clmr = require('claimer');
const tank = require('tank');
const spcr = require('spawncreater');
const process_creeps = require('process_creeps');
const rtrp = require('resource_transporters');
const term = require('terminals');
const env = require('env');
const tools = require('tools');
const process_strucures = require('process_structures');

//TODO
/*
Расчет башен.
Поиск ссылок вокруг стораджа и контроллера
Порядок ифов и поисков.
?Лаборант. + варка годиума.
Продажа энергии.
Переписать ордера.
Внешние добытчки.
Фабрика.
*/

module.exports.loop = function()
{
    // spcr.main();
    // clmr.main();
    tank.main();
    
    process_creeps.main();
    process_strucures.main();

    Memory.cpu_used[0] += 1;
    Memory.cpu_used[1] += Game.cpu.getUsed();
    // tools.clear_memory();
    if(Game.cpu.bucket == 10000){
        console.log('generate pixel:', Game.cpu.generatePixel());
        tools.clear_memory();
    }
    
    tools.every_tick();
}
