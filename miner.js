function randInt() {
  const min = 100000;
  const max = 999999;
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
const body1700 = [MOVE, MOVE, WORK, WORK, WORK, WORK,
                MOVE, MOVE, WORK, WORK, WORK, WORK,
                MOVE, MOVE, WORK, WORK, CARRY, CARRY,
                MOVE, MOVE, CARRY, CARRY, CARRY, CARRY];
var bodyx = null;
var spawnx = null;
var wght = null;
const max = [0]
var cr = null;
var num = 0;
const live = 300;

module.exports = {
    createMNR : function()
    {
        var log = spawnx.createCreep(bodyx, 'MNR' + randInt(),  {role : 'MNR', full : false, weight : wght, sp : spawnx.name, minType : null});
        if(_.isString(log))
        {
            console.log('create new MNR ' + log);
        }
        else
            console.log('create MNR error ' + log);

    },

    creating : function()
    {

        var min = spawnx.room.find(FIND_MINERALS,
                                                    { filter: function(obj)
                                                        {
                                                            return obj.mineralAmount > 0;
                                                        }
                                                    });
        var term = spawnx.room.find(FIND_MY_STRUCTURES,
                                                { filter: function(obj)
                                                    {
                                                        if(obj.structureType == STRUCTURE_TERMINAL)
                                                        {
                                                            return obj.store.getFreeCapacity() > 2e3;
                                                        }
                                                        return false;
                                                    }
                                                }
                                            );
        // console.log(min)
        if(min.length == 0)
            return;
        if(!term)
            return;


        var energ = spawnx.store.getUsedCapacity(RESOURCE_ENERGY);
        var extensions = spawnx.room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
        if(extensions.length > 0)
        {
            for(var i in extensions)
            {
                energ += extensions[i].store.getUsedCapacity(RESOURCE_ENERGY);
            }
        }
        if(energ >= 1700)
        {
            bodyx = body1700;
            wght = 1;
        }
        else
            return;

        var count = 0;



        for(var name in Game.creeps)
        {
            cr = Game.creeps[name];
            if(cr.memory.role == 'MNR' && cr.memory.sp == spawnx.name)
            {
                count += cr.weight;
            }
        }
        // console.log(count, spawnx)
        if(count < max[num]){
            console.log(spawnx.name, "MNR now ", count, 'max', max[num], 'new: weight', wght);
            this.createMNR();
        }
    },

    mine : function()
    {
        var total = cr.store.getUsedCapacity();
        var free = cr.store.getFreeCapacity();
        const mineral = cr.pos.findClosestByRange(FIND_MINERALS);
        if(total == 0)
        {
            cr.memory.full = false;
            if(cr.ticksToLive < live || mineral.mineralAmount == 0)
            {
                sp = Game.spawns[cr.memory.sp];
                if(sp.recycleCreep(cr) == ERR_NOT_IN_RANGE)
                    cr.moveTo(sp);
                return;
            }
        }
        if(free > 0 && !cr.memory.full)
        {
            if(mineral.mineralAmount > 0)
            {
                cr.memory.minType = mineral.mineralType;
                if(cr.harvest(mineral) == ERR_NOT_IN_RANGE)
                    cr.moveTo(mineral);
            }
            else
            {
                cr.memory.full = true;
            }
        }

        if(free == 0)
            cr.memory.full = true;
    },



    workMNR : function()
    {
        // console.log(cr.ticksToLive)
        this.mine();
        if(cr.memory.full)
        {
            var total = cr.store.getUsedCapacity();
            var put = cr.pos.findClosestByRange(FIND_STRUCTURES,
                                                    { filter: function(obj)
                                                        {
                                                            if(obj.structureType == STRUCTURE_TERMINAL)
                                                            {
                                                                return obj.store.getFreeCapacity() >= total;
                                                            }
                                                            return false;
                                                        }
                                                    });
            if(put)
            {
                if(cr.transfer(put, cr.memory.minType) == ERR_NOT_IN_RANGE)
                {
                    cr.moveTo(put);
                }
            }
        }

    },

    working : function()
    {

        for(var name in Game.creeps)
        {
            cr = Game.creeps[name];
            if(cr.memory.role == 'MNR')
            {
                this.workMNR();
            }
        }
    },

    main : function()
    {
        num = 0;
        const spwns = [Game.spawns['Spawn1']];
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
