const live = 100;
const one_size_energy = 300;
const max_body_size = 1;
const min_body_size = 1;
const bodys = {
  1 : Array(4).fill(CARRY, 0, 2).fill(MOVE, 2, 4)
};

function create(sp){
  const energy_available = sp.room.energyAvailable;
  var size = Math.floor(energy_available / one_size_energy)
  if(size < min_body_size)
      return;
  size = Math.min(size, max_body_size);
  const cur_body = bodys[size];
  var mineral = sp.room.find(FIND_MINERALS)[0];
  if(!mineral)
    return;
  const creep_name = 'RTRP_' + sp.name + '_' + Game.time;
  console.log('create new', creep_name, 'in room', sp.room.name, 'result:',
    sp.spawnCreep(cur_body, creep_name,
      {memory: {
        role : 'RTRP',
        full : false,
        minType : mineral.mineralType,
        rm : sp.room.name,
        sp : sp.name,
        type : 'city'
        },
        directions : [LEFT, RIGHT]
      }
    )
  );
}

function mine(cr){
  var total = cr.store.getUsedCapacity();
  var free = cr.store.getFreeCapacity();
  if(total == 0)
    cr.memory.full = false;
  if(cr.ticksToLive < live && total == 0)
  {
    cr.suicide();
    return;
  }
  var mineral = cr.room.find(FIND_MINERALS)[0];
  var cont = cr.room.find(FIND_STRUCTURES,
    { filter: function(obj)
      {
        if(obj.structureType == STRUCTURE_CONTAINER)
          return obj.store[cr.memory.minType] > 0;
        return false
      }
    }
  )[0];
  var dropped = cr.room.find(FIND_DROPPED_RESOURCES,
    { filter: function(obj)
        {if(obj.resourceType == cr.memory.minType)
            return true;
          return false;
        }
    }
  )[0];
  if(free > 0 && !cr.memory.full)
  {
    if(dropped && cr.pickup(dropped, cr.memory.minType) == ERR_NOT_IN_RANGE)
      cr.moveTo(dropped);
    if(cont && cr.withdraw(cont, cr.memory.minType) == ERR_NOT_IN_RANGE)
      cr.moveTo(cont);
  }
  if(free == 0)
      cr.memory.full = true;
}

function work(cr){
  if(cr.memory.full)
  {
      var term = cr.room.terminal;
      if(term)
      {
          if(cr.transfer(term, cr.memory.minType) == ERR_NOT_IN_RANGE)
              cr.moveTo(term);
      }
  }
}

module.exports = {
  createRTRP : function(sp)
  {
    create(sp)
  },

  workRTRP : function(cr)
  {
      mine(cr);
      work(cr);
  },

  main : function()
  {
  }
};
