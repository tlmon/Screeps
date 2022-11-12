const tools = require('tools');

body3250 = [ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE,
    ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE,
    ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE,
    ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE,
    ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE];

function create(sp){
  var cur_body = null;
  const energy_available = sp.room.energyAvailable;
  if (energy_available >= 3250)
      cur_body = body3250;
  else
      return;

  const creep_name = 'TNK_' + sp.name + '_' + Game.time;
  const creep_memory = {role : 'TNK', rm : sp.room.name, sp : sp.name, type : 'out'}
  
  tools.spawn_creep(sp, cur_body, creep_name, creep_memory);
}

function move_back(cr) {
    if (cr.hits <= cr.hitsMax * 0.8) {
      cr.moveTo(Game.flags['back']);
      return;
  }
}

function work(cr){
  const flag_go = Game.flags.Go;
  if(cr.room.name != flag_go.pos.roomName){
    cr.moveTo(flag_go);
    return;
  }
  
  const enemy = cr.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
  if (enemy.length > 0 && cr.getActiveBodyparts(ATTACK)) {
    cr.attack(enemy[0]);
    return;
  }
  
  for (var i = 0; i < 10; i++) {
      var flag_name = 'Attack' + i.toString();
      var fl = Game.flags[flag_name];
      if (!fl) {
        cr.moveTo(flag_go);
        return;
      }
        
      const found = fl.pos.lookFor(LOOK_STRUCTURES);
      var target = null;
      if(found.length)
         target = found[0];
      else
        continue;
    
      if (cr.attack(target) == ERR_NOT_IN_RANGE)
        cr.moveTo(target);
      return;
  }

  
}


module.exports = {

    createTNK : function(sp)
    {
      create(sp)
    },

    workTNK : function(cr)
    {
      work(cr);
      move_back(cr);
    },

    main : function()
    {
    }
};
