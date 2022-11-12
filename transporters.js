const tools = require('tools');

const live = 30;
const max_storage_energy = 6e5;
const one_size_energy = 150;
const max_body_size = 6;
const min_body_size = 2;
const min_energy_in_terminal = 1e5;
const bodys = {
  2 : Array(6).fill(CARRY, 0, 4).fill(MOVE, 4, 6),
  3 : Array(9).fill(CARRY, 0, 6).fill(MOVE, 6, 9),
  4 : Array(12).fill(CARRY, 0, 8).fill(MOVE, 8, 12),
  5 : Array(15).fill(CARRY, 0, 10).fill(MOVE, 10, 15),
  6 : Array(18).fill(CARRY, 0, 12).fill(MOVE, 12, 18),
};

function create(sp){
  const energy_available = sp.room.energyAvailable;
  var size = Math.floor(energy_available / one_size_energy)
  if(size < min_body_size)
      return;
  size = Math.min(size, max_body_size);
  
  const cur_body = bodys[size];
  const creep_name = 'TRP_' + sp.name + '_' + Game.time;
  const creep_memory = {role : 'TRP', full : false, rm : sp.room.name, sp : sp.name, type : 'city'}

  tools.spawn_creep(sp, cur_body, creep_name, creep_memory);
}

function mine(cr){
  var total = cr.store.getUsedCapacity();
  var free = cr.store.getFreeCapacity();
  
  if(total == 0)
      cr.memory.full = false;

  if(free == 0) {
    cr.memory.full = true;
    return;
  }
      
  if(cr.ticksToLive < live && !cr.memory.full)
  {
    cr.suicide();
    return;
  }
  
  if(free > 0 && !cr.memory.full)
  {
    //  var dropped = cr.room.find(FIND_DROPPED_RESOURCES,
    //     { filter: function(obj)
    //       {
    //         if(obj.resourceType == RESOURCE_ENERGY)
    //           return obj.amount >= cr.pos.getRangeTo(obj) * 2 + free / 2;
    //         return false;
    //       }
    //     }
    //   );
      
    //   if(dropped.length) {
    //     if(cr.pickup(dropped[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
    //       cr.moveTo(dropped[0]);
    //     return;
    //   }
      
      var conts = cr.room.find(FIND_STRUCTURES, {
        filter: function(obj){
          if(obj.structureType == STRUCTURE_CONTAINER)
            return obj.store[RESOURCE_ENERGY] >= free;
          return false;
          }
        }
      );
      
      if(conts.length){
        if(cr.withdraw(conts[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            cr.moveTo(conts[0]);
        return;
      }
      
      var stor = cr.room.storage;
      var links = cr.room.find(FIND_STRUCTURES, {
        filter: function(obj){
          if(obj.structureType == STRUCTURE_LINK)
            return stor.pos.getRangeTo(obj) < 3 && obj.store[RESOURCE_ENERGY] >= free;
          return false;
          }
        }
      );
      
      if (links.length) {
        if (cr.withdraw(links[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            cr.moveTo(links[0]);
        return;
      }
      
      
      
      if(stor){
          if(cr.withdraw(stor, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
              cr.moveTo(stor);
      }
  }
}

function work(cr){
  if(cr.memory.full){
      var extensions_spawns = cr.room.find(FIND_MY_STRUCTURES,
        { filter: function(obj)
          {
            if(obj.structureType == STRUCTURE_EXTENSION || obj.structureType == STRUCTURE_SPAWN)
              return obj.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            return false;
          }
        }
      );
      var towers = cr.room.find(FIND_MY_STRUCTURES,
        { filter: function(obj)
          {
            if(obj.structureType == STRUCTURE_TOWER)
              return obj.store.getFreeCapacity(RESOURCE_ENERGY) >= 200;
            return false;
          }
        }
      );
      var stor = cr.room.storage;
      var term = cr.room.terminal;
      if(extensions_spawns.length)
      {
        best_obj = null;
        best_range = 1e4;
        for(i in extensions_spawns){
          obj = extensions_spawns[i];
          if(cr.pos.getRangeTo(obj) < best_range){
            best_obj = obj;
            best_range = cr.pos.getRangeTo(obj);
          }
        }
        if(cr.transfer(best_obj, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            cr.moveTo(best_obj);
      }
      else if(towers.length)
      {
          tower = towers[0];
          if(cr.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            cr.moveTo(tower);
      }
      else if(term && term.store[RESOURCE_ENERGY] < min_energy_in_terminal){
        if(cr.transfer(term, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
          cr.moveTo(term);
      }
      else if(stor && stor.store[RESOURCE_ENERGY] < max_storage_energy)
      {
        if(cr.transfer(stor, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
          cr.moveTo(stor);
      } else if(term) {
        if(cr.transfer(term, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
          cr.moveTo(term);
      }
  }
}


module.exports = {
  createTRP : function (sp){
    create(sp);
  },

  workTRP : function(cr){
    mine(cr);
    work(cr);
  },

  main : function()
  {
  }
};
