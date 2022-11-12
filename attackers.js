const body2200 = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,  RANGED_ATTACK, RANGED_ATTACK,
                HEAL, HEAL, HEAL, HEAL];

function create(sp){
  var cur_body = null;
  const energy_available = sp.room.energyAvailable;
  if (energy_available >= 2200)
      cur_body = body2200;
  else
      return;
  var creep_name = 'ATK_' + sp.name + '_' + Game.time;
  console.log('create new', creep_name, 'in room', sp.room.name, 'result:',
    sp.spawnCreep(cur_body, creep_name,
      {memory: {
        role : 'ATK',
        rm : sp.room.name,
        sp : sp.name,
        type : 'out'
        },
        directions : [LEFT, RIGHT]
      }
    )
  );
}

function work(cr){
  if (cr.hits < cr.hitsMax) 
    cr.heal(cr);
    
  const flag_go = Game.flags.Raid;
  if(cr.room.name != flag_go.pos.roomName){
    cr.moveTo(flag_go);
    return;
  }
  
  var enemy = cr.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if (enemy) {
    cr.moveTo(enemy);
    if (!cr.getActiveBodyparts(RANGED_ATTACK))
        return;
    if (cr.rangedAttack(enemy) == ERR_NOT_IN_RANGE)
        cr.rangedMassAttack();
    return;
  }
 
  var constr = cr.pos.findClosestByRange(FIND_STRUCTURES);
  if (constr) {
    cr.moveTo(constr);
    if (!cr.getActiveBodyparts(RANGED_ATTACK))
        return;
    if (cr.rangedAttack(constr) == ERR_NOT_IN_RANGE)
        cr.rangedMassAttack();
    return;
  }
  
  cr.moveTo(Game.flags.Raid);
}


module.exports = {

    createATK : function(sp)
    {
      create(sp)
    },

    workATK : function(cr)
    {
      work(cr);
    },

    main : function()
    {
    }
};
