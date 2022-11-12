const tools = require('tools');

body7500 = [HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE,
    HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE,
    HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE,
    HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE,
    HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE];

function create(sp){
  var cur_body = null;
  const energy_available = sp.room.energyAvailable;
  if (energy_available >= 7500)
      cur_body = body7500;
  else
      return;

  const creep_name = 'HEA_' + sp.name + '_' + Game.time;
  const creep_memory = {role : 'HEA', rm : sp.room.name, sp : sp.name, type : 'out'}
  
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
  
  
   var targetNeedHeal = cr.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: function(object) {
            return object.hits < object.hitsMax;
        }
    });
    
    if(targetNeedHeal && cr.getActiveBodyparts(HEAL)) {
        if (cr.pos.isNearTo(targetNeedHeal)) {
            cr.heal(targetNeedHeal);
        }
        if (cr.pos.getRangeTo(targetNeedHeal) <= 3) {
            cr.rangedHeal(targetNeedHeal);
        }
        cr.moveTo(targetNeedHeal);
        return;
    }
    
    var friend = cr.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: function(object) {
            return object.id != cr.id;
        }
    });
    cr.moveTo(friend);
  
}


module.exports = {

    createHEA : function(sp)
    {
      create(sp)
    },

    workHEA : function(cr)
    {
      work(cr);
      move_back(cr);
    },

    main : function()
    {
    }
};
