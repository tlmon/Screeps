function randInt() {
  const min = 100000;
  const max = 999999;
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function generateBody(size){
  const move_count = 2 * size, carry_count = 4 * size;
  var body = Array(move_count + carry_count);
  body.fill(MOVE, 0, move_count);
  body.fill(CARRY, move_count, move_count + carry_count);
  return body;
}


var bodyx = null;
var spawnx = null;
var cr = null;
const live = 30;
module.exports = {
    die : function()
    {
      sp = Game.spawns[cr.memory.sp];
      if(sp.recycleCreep(cr) == ERR_NOT_IN_RANGE)
        cr.moveTo(sp);
      else
        cr.suicide();
    },

    createTRP : function()
    {
        console.log('create new', spawnx.createCreep(bodyx, 'TRP' + randInt(),
        {role : 'TRP', full : false, sp : spawnx.name}));
    },

    creating : function()
    {
        var energ = spawnx.store.getUsedCapacity(RESOURCE_ENERGY);
        var extensions = spawnx.room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
        if(extensions.length > 0)
        {
            for(var i in extensions)
            {
                energ += extensions[i].store.getUsedCapacity(RESOURCE_ENERGY);
            }
        }

        // if(energ >= 1200)
        // {
        //    bodyx = generateBody(4);
        // }
        // else
        if(energ >= 900)
        {
            bodyx = generateBody(3);
        }
        else
        if(energ >= 600)
        {
            bodyx = generateBody(2);
        }
        else
        if(energ >= 300)
        {
            bodyx = generateBody(1);
        }
        else
            return;


        exist = false;

        for(var name in Game.creeps)
        {
            cr = Game.creeps[name];
            if(cr.memory.role == 'TRP' && cr.memory.sp == spawnx.name)
            {
                exist = true;
            }
        }

        if(!exist)
        {
            console.log(spawnx.name, "TRP now", exist);
            this.createTRP();
        }

    },

    mine : function()
    {
        var total = cr.store.getUsedCapacity();
        var free = cr.store.getFreeCapacity();
        var stor = cr.pos.findClosestByRange(FIND_STRUCTURES,
                                                { filter: function(obj)
                                                    {
                                                        if(obj.structureType == STRUCTURE_STORAGE)
                                                        {
                                                            return obj.store.getUsedCapacity() >= free;
                                                        }
                                                        return false;
                                                    }
                                                }
                                            );
        var cont = cr.pos.findClosestByPath(FIND_STRUCTURES,
                                                { filter: function(obj)
                                                    {
                                                        if(obj.structureType == STRUCTURE_CONTAINER)
                                                        {
                                                            return obj.store.getUsedCapacity() >= free;
                                                        }
                                                        return false;
                                                    }
                                                }
                                            );
        var dropped = cr.pos.findClosestByPath(FIND_DROPPED_RESOURCES,
                                        { filter: function(obj)
                                            {
                                                if(obj.resourceType == RESOURCE_ENERGY)
                                                {
                                                    return true;
                                                }
                                                return false;
                                            }
                                        }
                                        );
        if(total == 0)
            cr.memory.full = false;
        if(cr.ticksToLive < live && !cr.memory.full)
        {
          this.die();
          return;
        }
        if(free > 0 && !cr.memory.full && cr.ticksToLive > live)
        {
            if(dropped && cr.pos.getRangeTo(dropped) <= 20) {
                if(cr.pickup(dropped, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    cr.moveTo(dropped);
                }
            }
            else
            if(cont)
            {
                if(cr.withdraw(cont, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    cr.moveTo(cont);
                }
            }
            else
            if(stor)
            {
                if(cr.withdraw(stor, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    cr.moveTo(stor);
                }
            }
        }

        if(free == 0)
            cr.memory.full = true;
    },


    workTRP : function()
    {

        this.mine();

        if(cr.memory.full){
            const sp = Game.spawns[cr.memory.sp]
            var total = cr.store.getUsedCapacity();
            var extens = cr.pos.findClosestByRange(FIND_MY_STRUCTURES,
                                                    { filter: function(obj)
                                                        {
                                                            if(obj.structureType == STRUCTURE_EXTENSION)
                                                            {
                                                                return obj.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                                                            }
                                                            return false;
                                                        }
                                                    });

            var str = cr.pos.findClosestByRange(FIND_STRUCTURES,
                                                    { filter: function(obj)
                                                        {
                                                            if(obj.structureType == STRUCTURE_STORAGE)
                                                            {
                                                                return obj.store.getFreeCapacity(RESOURCE_ENERGY) >= total;
                                                            }
                                                            return false;
                                                        }
                                                    });
            var towers = []
            towers = sp.room.find(FIND_MY_STRUCTURES,
                                                        { filter: function(obj)
                                                        {
                                                            if(obj.structureType == STRUCTURE_TOWER)
                                                            {
                                                                return obj.store.getFreeCapacity(RESOURCE_ENERGY) >= 400;
                                                            }
                                                            return false;
                                                        }
                                                    });
            var link = cr.pos.findClosestByRange(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_LINK}}, 50);
            // console.log(str)

            if(extens)
            {
                if(cr.transfer(extens, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    cr.moveTo(extens);
            }
            else
            if(towers.length > 0)
            {
                for(i in towers)
                {
                    tower = towers[i];
                    if(cr.transfer(tower, RESOURCE_ENERGY, Math.min(total, 400)) == ERR_NOT_IN_RANGE)
                        cr.moveTo(tower);
                }

            }
            else
            if(link && link.store.getUsedCapacity(RESOURCE_ENERGY) < 800)
            {
                if(cr.transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    cr.moveTo(link);
            }
            else
            if(sp.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            {
                if(cr.transfer(sp, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    cr.moveTo(sp);
            }
            else
            if(str)
            {
                if(cr.transfer(str, RESOURCE_ENERGY,) == ERR_NOT_IN_RANGE)
                {
                    cr.moveTo(str);
                }
            }
            else if(spawnx)
            {
              if(cr.transfer(spawnx, RESOURCE_ENERGY,) == ERR_NOT_IN_RANGE)
              {
                  cr.moveTo(spawnx);
              }
            }
        }

    },

    working : function()
    {

        for(var name in Game.creeps)
        {
            cr = Game.creeps[name];
            if(cr.memory.role == 'TRP')
            {
                this.workTRP();
            }
        }
    },

    main : function()
    {
        const spwns = [Game.spawns['Spawn1']]
        for(i in spwns)
        {
            spawnx = spwns[i];
            if(!spawnx.spawning)
                this.creating();
        }
        this.working();
    }
};
