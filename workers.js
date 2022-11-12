const tools = require('tools');

const min_body_size = 0.5;
const bodys = {
  0.5: Array(3).fill(WORK, 0, 1).fill(CARRY, 1, 2).fill(MOVE, 2, 3),
  1 : Array(6).fill(WORK, 0, 2).fill(CARRY, 2, 4).fill(MOVE, 4, 6),
  2 : Array(12).fill(WORK, 0, 4).fill(CARRY, 4, 8).fill(MOVE, 8, 12),
  3 : Array(18).fill(WORK, 0, 6).fill(CARRY, 6, 12).fill(MOVE, 12, 18),
  4 : Array(24).fill(WORK, 0, 8).fill(CARRY, 8, 16).fill(MOVE, 16, 24),
  5 : Array(30).fill(WORK, 0, 10).fill(CARRY, 10, 20).fill(MOVE, 20, 30),
};

const live = 50;

function create(sp){
  var energy_available = sp.room.energyAvailable;
  var size = 0;
  if(energy_available >= 200 && sp.room.controller.level == 8)
    size = 0.5;
  else if(energy_available >= 1600)
    size = 4;
  else if(energy_available >= 1200)
    size = 3;
  else if(energy_available >= 800)
    size = 2;
  else if(energy_available >= 400)
    size = 1;
  else if(energy_available >= 200)
    size = 0.5;
  
  if(size < min_body_size)
    return;
  
  var cur_body = bodys[size];
  var creep_name = 'BLD_' + sp.name + '_' + Game.time;
  var creep_memory = {role : 'BLD', full : false, rm : sp.room.name, sp : sp.name, type : 'city'};

  tools.spawn_creep(sp, cur_body, creep_name, creep_memory);
}

function mine(cr){
    const total = cr.store.getUsedCapacity(RESOURCE_ENERGY);
    const free = cr.store.getFreeCapacity(RESOURCE_ENERGY);
    

    if(total == 0)
        cr.memory.full = false;
        
    if (cr.memory.full)
        return;
    
    if(cr.ticksToLive < live)
    {
      cr.suicide();
      return;
    }
    
    if(free == 0) {
        cr.memory.full = true;
        return;
    }
    
    if(free > 0)
    {
        
        var str = cr.pos.findClosestByRange(FIND_STRUCTURES,
            { filter: function(obj)
                {
                    if(obj.structureType == STRUCTURE_CONTAINER || obj.structureType == STRUCTURE_STORAGE || obj.structureType == STRUCTURE_LINK)
                        return obj.room = cr.room && obj.store.getUsedCapacity(RESOURCE_ENERGY) >= free;
                    return false;
                }
            }
        );
    
        if (str){
            if(cr.withdraw(str, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                cr.moveTo(str);
            }
            return;
        }
        
        var sour = cr.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        if(sour)
        {
            if(cr.harvest(sour) == ERR_NOT_IN_RANGE)
                cr.moveTo(sour);
            return;
        }
    }
}

function work(cr){
    if(cr.memory.full){
        const constr = cr.pos.findClosestByRange(FIND_CONSTRUCTION_SITES,
          { filter: function(obj)
              {
                  if(obj.room == cr.room)
                      return true;
                  return false;
              }
            });
        const contr = cr.room.controller;
        if(constr) {
            if(cr.build(constr) == ERR_NOT_IN_RANGE)
                cr.moveTo(constr);
        }
        else
        if(contr)
        {
            if(cr.upgradeController(cr.room.controller) == ERR_NOT_IN_RANGE)
                cr.moveTo(cr.room.controller);
        }
    }

}


module.exports = {
    createBLD : function(sp)
    {
      create(sp);
    },


    workBLD : function(cr)
    {
      mine(cr);
      work(cr);
    },
    
    main : function()
    {
    }
};
