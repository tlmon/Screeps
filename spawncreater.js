function randInt() {
  const min = 100000;
  const max = 999999;
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
const body800 = [
  WORK, WORK, CARRY, CARRY, MOVE, MOVE,
  WORK, WORK, CARRY, CARRY, MOVE, MOVE];
var max = 3;
const flag_new = Game.flags['new'];
const create_permission = false;

module.exports = {
    createSCR : function(sp, cur_body)
    {
      var creep_name = 'SCR_' + sp.name + '_' + randInt();
      console.log('create new', creep_name, 'result:',
        sp.spawnCreep(cur_body, creep_name,
          {memory:
            {
              role : 'SCR',
              sp : sp.name
            },
            directions : [LEFT, RIGHT]
          }
        )
      );
    },

    creating : function(sp)
    {
      var count = 0;
      for(var name in Game.creeps)
      {
          cr = Game.creeps[name];
          if(cr.memory.role == 'SCR')
              ++count;
      }
      if(count >= max)
        return;
      var energy_available = sp.room.energyAvailable;
      var cur_body = null;
      if(energy_available >= 800)
        cur_body = body800;
      else
        return;
      this.createSCR(sp, cur_body);
    },

    mine : function(cr)
    {
        var total = cr.store.getUsedCapacity(RESOURCE_ENERGY);
        var free = cr.store.getFreeCapacity(RESOURCE_ENERGY);
        var sour = cr.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        var ruin = cr.pos.findClosestByRange(FIND_RUINS,
          { filter: function(obj)
              {
                  if(obj.store[RESOURCE_ENERGY] > 0)
                      return true;
                  return false;
              }
          }
        );

        if(total == 0)
            cr.memory.full = false;
        if(free > 0 && !cr.memory.full && sour)
        {
            if (ruin && ruin.pos.roomName == cr.pos.roomName){
                if(cr.withdraw(ruin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    cr.moveTo(ruin);
            }
            else
             if(cr.harvest(sour) == ERR_NOT_IN_RANGE)
                    cr.moveTo(sour);
        }
        if(free == 0)
            cr.memory.full = true;
    },


    workSCR : function()
    {
      // if(cr.room.controller) {
      //   if(cr.signController(cr.room.controller, "No war!") == ERR_NOT_IN_RANGE) {
      //     cr.moveTo(cr.room.controller);
      //   }
      // }
        // console.log(cr.room.name, flag_new.pow.roomName);
        if(cr.room.name != flag_new.pos.roomName)
            cr.moveTo(flag_new)
        else
        {
            this.mine(cr);
            if(cr.memory.full)
            {
                var constr = cr.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                var contr = cr.room.controller;
                if(constr) {
                    if(cr.build(constr) == ERR_NOT_IN_RANGE)
                        cr.moveTo(constr);
                }
                else
                if(contr)
                {
                    if(cr.upgradeController(contr) == ERR_NOT_IN_RANGE)
                        cr.moveTo(contr);
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
              this.workSCR(cr);
            }
        }
    },

    main : function()
    {
        sp = Game.spawns['Spawn1'];
        if(!sp.spawning && create_permission)
            this.creating(sp);
        this.working();
    }
};
