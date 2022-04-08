function randInt() {
  const min = 100000;
  const max = 999999;
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
const body300 = [MOVE, MOVE, WORK, CARRY, CARRY];
const body400 = [MOVE, MOVE, WORK, WORK, CARRY, CARRY];
const body800 = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
const body1200 = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];

const body1600 = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
const body2000 = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
var bodyx = null;
var wght = null;
const max = [3];

var cr = null;
var spawnx = null;
var num = 0;
const live = 50;
module.exports = {

    createBLD : function()
    {
        var log = spawnx.createCreep(bodyx, 'BLD' + randInt(),  {role : 'BLD', full : false, weight : wght, sp : spawnx.name});
        if(_.isString(log))
            console.log('create new BLD ' + log);
        else
            console.log('create BLD error ' + log);

    },

    creating : function()
    {
        var energ = spawnx.store.getUsedCapacity(RESOURCE_ENERGY);
        // var capacity = spawnx.energyCapacity;
        var extensions = spawnx.room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});

        if(extensions.length > 0)
        {
            for(var i in extensions)
            {
                energ += extensions[i].store.getUsedCapacity(RESOURCE_ENERGY);
                // capacity += extensions[i].energyCapacity;
            }
        }
        // if(energ >= 2000)
        // {
        //     bodyx = body2000;
        //     wght = 5;
        // }
        // else
        // if(energ >= 1600)
        // {
        //     bodyx = body1600;
        //     wght = 4;
        // }
        // else
        if(energ >= 1200)
        {
            bodyx = body1200;
            wght = 3;
        }
        else
        if(energ >= 800)
        {
            bodyx = body800;
            wght = 2;
        }
        else
        if(energ >= 400)
        {
            bodyx = body400;
            wght = 1
        }
        else
        if(energ >= 300)
        {
            bodyx = body300;
            wght = 1;
        }
        else
            return;



        var count = 0;

        for(var name in Game.creeps)
        {
            cr = Game.creeps[name];
            if(cr.memory.role == 'BLD')
            {
                if(cr.memory.sp == spawnx.name)
                    count += cr.memory.weight;
            }
        }
        if(count < max[num])
        {
            console.log(spawnx.name, "BLD now", count, 'max', max[num], 'new: weight', wght)
            this.createBLD();
        }

    },

    mine : function()
    {
        const total = cr.store.getUsedCapacity(RESOURCE_ENERGY);
        const free = cr.store.getFreeCapacity(RESOURCE_ENERGY);
        var sour = cr.pos.findClosestByRange(FIND_SOURCES_ACTIVE);

        var str = cr.pos.findClosestByRange(FIND_STRUCTURES,
                                                    { filter: function(obj)
                                                        {
                                                            if(obj.structureType == STRUCTURE_CONTAINER || obj.structureType == STRUCTURE_STORAGE || obj.structureType == STRUCTURE_LINK)
                                                            {
                                                                return obj.store.getUsedCapacity(RESOURCE_ENERGY) >= free;
                                                            }
                                                            return false;
                                                        }
                                                    });
        var dropped = cr.pos.findClosestByRange(FIND_DROPPED_RESOURCES,
                                                    { filter: function(obj)
                                                        {
                                                            if(obj.resourceType == RESOURCE_ENERGY)
                                                            {
                                                                return true;
                                                            }
                                                            return false;
                                                        }
                                                    });
        console.log(ress);
        if(total == 0)
        {
            cr.memory.full = false;
        }
        if(free > 0 && !cr.memory.full && cr.ticksToLive > live)
        {
          // getRangeTo
          best_res = null;
          if(dropped && str){
            if (cr.pos.getRangeTo(str) < cr.pos.getRangeTo(dropped))
              best_res = dropped;
            else
              best_res = str;
          }
          else if(str)
            best_res = str;
          else if(dropped)
            best_res = dropped;
          if (best_res){
              if(cr.withdraw(best_res, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                  cr.moveTo(best_res);
              }
          }
          else if(sour)
          {
              if(cr.harvest(sour) == ERR_NOT_IN_RANGE)
                  cr.moveTo(sour);
          }
        }

        if(total >= cr.carryCapacity)
            cr.memory.full = true;
    },

    workBLD : function()
    {
        this.mine();
        if(cr.ticksToLive < live)
        {
            sp = Game.spawns[cr.memory.sp];
            if(sp.recycleCreep(cr) == ERR_NOT_IN_RANGE)
                cr.moveTo(sp);
            return;
        }
        else
        if(cr.memory.full){
            var constr = cr.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

            if(constr) {
                if(cr.build(constr) == ERR_NOT_IN_RANGE) {
                    cr.moveTo(constr);
                }
            }
            else
            if(cr.room.controller)
            {

                if(cr.upgradeController(cr.room.controller) == ERR_NOT_IN_RANGE)
                    cr.moveTo(cr.room.controller);

            }
        }

    },

    working : function()
    {

        for(var name in Game.creeps)
        {
            cr = Game.creeps[name];
            if(cr.memory.role == 'BLD')
            {
                this.workBLD();
            }
        }
    },



    main : function()
    {
        num = 0;
        const spwns = [Game.spawns['Spawn1']]
        for(i in spwns)
        {
            spawnx = spwns[i];
            if(!spawnx.spawning)
                this.creating();
            ++num;
        }

        this.working();
    }
};
