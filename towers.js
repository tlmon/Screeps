const min_energy_in_storage = 5e5;
const min_energy_in_tower = 700;

module.exports = {
  main : function()
  {
    process();
  }
};

function process() {
  var main_rooms = [Game.rooms['W38N44'], Game.rooms['W38N45'], Game.rooms['W39N45'], Game.rooms['W38N46'], Game.rooms['W39N46'], Game.rooms['W39N44']];
  for(i in main_rooms)
  {
      var room = main_rooms[i];
      var towers = room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_TOWER}});
      for (i in towers){
          var tower = towers[i];
          if(attack(tower))
              continue;
          if(heal(tower))
              continue;
          if(repair(tower))
              break;
          if (upgrade(tower))
              continue;
      }
  }
}

function repair(tower) {
  if(tower.store.getUsedCapacity(RESOURCE_ENERGY) <= min_energy_in_tower)
    return false;
    
  var structs = tower.room.find(FIND_STRUCTURES,
    {filter: function(obj)
      {
        if (obj.structureType != STRUCTURE_WALL && obj.structureType != STRUCTURE_RAMPART)
          return obj.hits <= obj.hitsMax - 800;
        return false;
      }
    }
  );
  
  var struct = structs[0];
  if(struct){
      tower.repair(struct);
      return true;
  }
  return false;
}

function upgrade(tower) {
  if(tower.store.getUsedCapacity(RESOURCE_ENERGY) <= min_energy_in_tower)
    return false;
  
  var storage = tower.room.storage;
  if(storage && storage.store[RESOURCE_ENERGY] < min_energy_in_storage)
    return false;

  var walls = tower.room.find(FIND_STRUCTURES,
    {filter: function(obj)
      {
        if (obj.structureType == STRUCTURE_WALL || obj.structureType == STRUCTURE_RAMPART)
          return obj.hits < obj.hitsMax;
        return false;
      }
    }
  );
  
  var min_hits = 3e8;
  var wall = null;
  for(i in walls)
  {
      if(walls[i].hits < min_hits)
      {
          wall = walls[i];
          min_hits = wall.hits;
      }
  }

  if(wall != null){
      tower.repair(wall);
      return true;
  }
  return false;
}

function attack(tower) {
  var hostile_creeps = tower.room.find(FIND_HOSTILE_CREEPS,
    { filter: function(obj)
      {
        if(obj.hits > 0)
          return true;
        return false;
      }
    }
  );
  if(hostile_creeps.length == 0)
      return false;
  var cr = hostile_creeps[0];
  tower.attack(cr);
  return true;
}

function heal(tower) {
  var my_creeps = tower.room.find(FIND_MY_CREEPS,
    { filter: function(obj)
      {
        if(obj.hits < obj.hitsMax)
          return true;
        return false;
      }
    }
  );

  if(my_creeps.length == 0)
      return false;
  
  var cr = my_creeps[0];
  tower.heal(cr);
  return true;
}
