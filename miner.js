const bodys = {
  1 : Array(12).fill(WORK, 0, 8).fill(MOVE, 8, 12), //1000
};

const one_size_energy = 1000;
const min_body_size = 1;
const max_body_size = 1;

function create(sp){
  const energy_available = sp.room.energyAvailable;
  var size = Math.floor(energy_available / one_size_energy)
  if(size < min_body_size)
      return;
  size = Math.min(size, max_body_size);
  const cur_body = bodys[size];
  var mineral = sp.room.find(FIND_MINERALS)[0];
  const creep_name = 'MNR_' + sp.name + '_' + Game.time;
  console.log('create new', creep_name, 'in room', sp.room.name, 'result:',
    sp.spawnCreep(cur_body, creep_name,
      {memory: {
        role : 'MNR',
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
  var mineral = cr.room.find(FIND_MINERALS,
    { filter: function(obj)
      {
        return obj.mineralAmount > 0;
      }
    }
  )[0];
  if(mineral)
  {
    if(cr.harvest(mineral) == ERR_NOT_IN_RANGE)
      cr.moveTo(mineral);
  }
}

module.exports = {
    createMNR : function(sp)
    {
      create(sp)
    },

    workMNR : function(cr)
    {
        mine(cr);
    },

    main : function()
    {
    }
};
