function randInt() {
  const min = 100000;
  const max = 999999;
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
const body800 = [
                MOVE, MOVE, WORK, WORK, CARRY, CARRY,
                MOVE, MOVE, WORK, WORK, CARRY, CARRY];
var bodyx = null;
var spawn1 = null;
var wght = null;
var max = 1;
var cr = null;
const flag1 = Game.flags['new'];

module.exports = {
    createSCR : function()
    {
        var log = spawn1.createCreep(bodyx, 'SCR' + randInt(),  {role : 'SCR', full : false, weight : wght});
        if(_.isString(log))
        {
            console.log('create new SCR ' + log);
        }
        else
            console.log('create HRV error ' + log);

    },

    creating : function()
    {

        var energ = spawn1.energy;
        // var capacity = spawn1.energyCapacity;
        var extensions = spawn1.room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
        if(extensions.length > 0)
        {
            for(var i in extensions)
            {
                energ += extensions[i].energy;
                // capacity += extensions[i].energyCapacity;
            }
        }
        if(energ >= 800)
        {
            bodyx = body800;
            wght = 1;
        }
        else
            return;

        var count = 0;


        for(var name in Game.creeps)
        {
            cr = Game.creeps[name];
            if(cr.memory.role == 'SCR')
            {
                count += cr.memory.weight;
            }
        }

        if(count < max)
        {
            console.log("SCR now ", count, 'max', max, 'new: weight', wght);
            this.createSCR();
        }
    },

    mine : function()
    {
        var total = cr.store.getUsedCapacity(RESOURCE_ENERGY);
        var free = cr.store.getFreeCapacity(RESOURCE_ENERGY);
        var sour = cr.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        if(total == 0)
            cr.memory.full = false;

        if(free > 0 && !cr.memory.full)
        {
            if(sour)
            {
                if(cr.harvest(sour) == ERR_NOT_IN_RANGE)
                    cr.moveTo(sour);
            }
        }

        if(free == 0)
            cr.memory.full = true;
    },


    workSCR : function()
    {
        // console.log(cr.room, flag1.room)
        if(cr.room.name != flag1.room.name)
        {
            cr.moveTo(flag1)
        }
        else
        {
            this.mine();
            if(cr.memory.full)
            {
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

        }

    },

    working : function()
    {

        for(var name in Game.creeps)
        {
            cr = Game.creeps[name];
            if(cr.memory.role == 'SCR')
            {
                this.workSCR();
            }
        }
    },

    main : function()
    {
        spawn1 = Game.spawns.Spawn1;

        if(!spawn1.spawning)
            this.creating();
        this.working();
    }
};
