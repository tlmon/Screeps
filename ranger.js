const tools = require('tools');

body5000 = [RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE,
    RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE,
    RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE,
    RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE,
    RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE];

function create(sp){
  var cur_body = null;
  const energy_available = sp.room.energyAvailable;
  if (energy_available >= 5000)
      cur_body = body5000;
  else
      return;

  const creep_name = 'RNG_' + sp.name + '_' + Game.time;
  const creep_memory = {role : 'RNG', rm : sp.room.name, sp : sp.name, type : 'out'}
  
  tools.spawn_creep(sp, cur_body, creep_name, creep_memory);
}

function move_back(cr) {
    if (cr.hits <= cr.hitsMax / 2) {
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
  
  const enemy = cr.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
  if (enemy.length > 0 && cr.getActiveBodyparts(RANGED_ATTACK)) {
    cr.rangedAttack(enemy[0]);
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
    
      if (cr.rangedAttack(target) == ERR_NOT_IN_RANGE) {
        cr.rangedMassAttack();
        cr.moveTo(target);
      }
      return;
  }
  cr.rangedMassAttack();
}


module.exports = {

    createRNG : function(sp)
    {
      create(sp)
    },

    workRNG : function(cr)
    {
      work(cr);
      move_back(cr);
    },

    main : function()
    {
    }
};
