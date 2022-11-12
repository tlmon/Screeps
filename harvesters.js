const tools = require('tools');

const min_body_size = 1;
const bodys = {
  1 : Array(4).fill(WORK, 0, 2).fill(CARRY, 2, 3).fill(MOVE, 3, 4),
  2 : Array(8).fill(WORK, 0, 4).fill(CARRY, 4, 6).fill(MOVE, 6, 8),
  3 : Array(12).fill(WORK, 0, 6).fill(CARRY, 6, 9).fill(MOVE, 9, 12),
};

function create(sp, sour){
  var energy_available = sp.room.energyAvailable;
  var size = 0;
  if(energy_available >= 900)
      size = 3;
  else if(energy_available >= 600)
      size = 2;
  else if(energy_available >= 300)
      size = 1;
  if(size < min_body_size)
    return;
  var cur_body = bodys[size];
  var creep_name = 'HRV' + sour + '_' + sp.name + '_' + Game.time;
  var creep_memory = {role : 'HRV' + sour, full : false, sour : sour, rm : sp.room.name, sp : sp.name, type : 'city'};

  tools.spawn_creep(sp, cur_body, creep_name, creep_memory);
}

function mine(cr){
  const total = cr.store.getUsedCapacity(RESOURCE_ENERGY);
  const free = cr.store.getFreeCapacity(RESOURCE_ENERGY);
  if(total == 0)
      cr.memory.full = false;
  const sources = cr.room.find(FIND_SOURCES);
  const sour = sources[cr.memory.sour];
  if(free > 0 && !cr.memory.full)
  {
    if(cr.harvest(sour) == ERR_NOT_IN_RANGE)
      cr.moveTo(sour);
  }
  if(free == 0)
      cr.memory.full = true;
}

function work(cr){
  if(cr.memory.full)
  {
    const total = cr.store.getUsedCapacity(RESOURCE_ENERGY);
    const links = cr.room.find(FIND_MY_STRUCTURES,
      { filter: function(obj)
        {
          if(obj.structureType == STRUCTURE_LINK)
            return cr.pos.inRangeTo(obj, 2);
          return false;
        }
      }
    );
    if(links.length){
      if(cr.transfer(links[0], RESOURCE_ENERGY) == OK)
        return;
    }
    cr.drop(RESOURCE_ENERGY, total);
  }
}


module.exports = {
  createHRV : function(sp, sour){
    create(sp, sour);
  },
  workHRV : function(cr){
    mine(cr);
    work(cr);
  },
  main : function()
  {
  }
};
