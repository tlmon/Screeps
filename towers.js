function randInt(max) {
  const min = 0;
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
var tower = null;
var energyInStorage = 3e5;

module.exports = {

    repair : function()
    {
        var structs = tower.room.find(FIND_STRUCTURES,
                                        {filter: function(obj)
                                            {
                                                if (obj.structureType == STRUCTURE_WALL || obj.structureType == STRUCTURE_CONTROLLER || obj.structureType == STRUCTURE_RAMPART)
                                                    return false;
                                                else
                                                if (obj.hits < obj.hitsMax)
                                                    return true;
                                                else
                                                    return false;
                                            }

                                        }
                                    );
        var minstruct = 1;
        var struct = null;
        for(i in structs)
        {
            if(structs[i].hits / structs[i].hitsMax < minstruct)
            {
                struct = structs[i];
                minstruct = structs[i].hits / structs[i].hitsMax;
            }
        }
        if(struct != null){
            tower.repair(struct);
            return true;
        }
        var stor = tower.room.find(FIND_STRUCTURES,
                            { filter: function(obj)
                                {
                                    if(obj.structureType == STRUCTURE_STORAGE)
                                        {
                                            return obj.store.getUsedCapacity(RESOURCE_ENERGY) >= energyInStorage;
                                        }
                                            return false;
                                        }
                                    }
                                );
        // if(!isNaN(stor))
        // {
        //     return false;
        // }

        var walls = tower.room.find(FIND_STRUCTURES,
                                        {filter: function(obj)
                                                {
                                                    if ((obj.structureType == STRUCTURE_WALL || obj.structureType == STRUCTURE_RAMPART) && (obj.hits < obj.hitsMax))
                                                        return true;
                                                    else
                                                        return false;
                                                }

                                        });
        // search wall with min hits
        var minwall = null;
        var wall = null;
        for(i in walls)
        {
            if(minwall == null){
                wall = walls[i];
                minwall = wall.hits;
            }
            else
            if(walls[i].hits < minwall)
            {
                wall = walls[i];
                minwall = wall.hits;
            }
        }
        if(wall != null){
            tower.repair(wall);
            return true;
        }
        return false;
    },
    attack : function()
    {
        var enemys = tower.room.find(FIND_HOSTILE_CREEPS,
                                     { filter: function(obj)
                                             {
                                                if(obj.hits > 0)
                                                    {
                                                        return true;
                                                    }
                                                    return false;
                                            }
                                    }
                                );
        if(enemys.length == 0)
            return false;
        var enemy = enemys[0];
        tower.attack(enemy);
        return true;
    },

    heal : function()
    {
        var crs = tower.room.find(FIND_MY_CREEPS,
                                    { filter: function(obj)
                                        {
                                            if(obj.hits < obj.hitsMax)
                                            {
                                                return true;
                                            }
                                            return false;
                                        }
                                    }
                                );

        if(crs.length == 0)
            return false;
        var cr = crs[0];
        tower.heal(cr);
        return true;
    },
    main : function()
    {
        for(i in Game.rooms)
        {
            var room = Game.rooms[i];
            var towers = room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_TOWER}});
            for (i in towers){
                tower = towers[i];
                if(this.attack())
                    continue;
                if(this.heal())
                    continue;
                if(this.repair())
                    continue;
            }
        }

    }
};
