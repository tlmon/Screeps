const work = require('workers');
const harv = require('harvesters');
const tran = require('transporters');
const atkr = require('attackers');
const minr = require('miner');
const rtrp = require('resource_transporters');
const tank = require('tank');
const rang = require('ranger');
const hea = require('heal');

// var attackers_create_permission = false;

function attackers_create_permission() {
    return true;
   const found = Game.flags.Attack.pos.lookFor(LOOK_STRUCTURES);
   if(found.length)
       return true;
  return false;
}

function miner_create_permissions(sp) {
  var term = sp.room.terminal;
  var mineral = sp.room.find(FIND_MINERALS,
    {
      filter: function (obj) {
        return obj.mineralAmount > 0;
      }
    }
  );
  var extr = sp.room.find(FIND_MY_STRUCTURES,
    {
      filter: function (obj) {
        if (obj.structureType == STRUCTURE_EXTRACTOR)
          return true;
        return false
      }
    }
  );
  if (mineral.length && extr.length && term && term.store.getFreeCapacity() > 0.5e5)
    return true;
  else
    return false;
}

function get_spawn(rm) {
  const cur_rm = Game.rooms[rm];
  const spawns = cur_rm.find(FIND_MY_STRUCTURES,
    {
      filter: function (obj) {
        if (obj.structureType == STRUCTURE_SPAWN)
          return !obj.spawning;
        return false;
      }
    }
  );
  if (spawns.length)
    return spawns[0];
  return false;
}

function working(cr) {
  var role = cr.memory.role;
  if (role == 'HRV0' || role == 'HRV1')
    harv.workHRV(cr);
  else if (role == 'BLD')
    work.workBLD(cr);
  else if (role == 'TRP')
    tran.workTRP(cr);
  else if (role == 'ATK')
    atkr.workATK(cr);
  else if (role == 'MNR')
    minr.workMNR(cr);
  else if (role == 'RTRP')
    rtrp.workRTRP(cr);
  else if (role == 'TNK')
    tank.workTNK(cr);
  else if (role == 'RNG')
    rang.workRNG(cr);
  else if (role == 'HEA')
    hea.workHEA(cr);
}

function creating(role, sp) {
  if (role == 'HRV0')
    harv.createHRV(sp, 0);
  else if (role == 'HRV1')
    harv.createHRV(sp, 1);
  else if (role == 'BLD')
    work.createBLD(sp);
  else if (role == 'TRP')
    tran.createTRP(sp);
  else if (role == 'ATK' && attackers_create_permission())
    atkr.createATK(sp);
  else if (role == 'MNR' && miner_create_permissions(sp))
    minr.createMNR(sp);
  else if (role == 'RTRP' && miner_create_permissions(sp))
    rtrp.createRTRP(sp);
  else if (role == 'TNK')
    tank.createTNK(sp);
  else if (role == 'RNG')
    rang.createRNG(sp);
  else if (role == 'HEA')
    hea.createHEA(sp);
}


function process() {
  var rooms_creeps = {
    'W38N44': { 'TRP': 1, 'BLD': 1, 'HRV0': 1, 'HRV1': 1, 'MNR': 1, 'RTRP': 1, 'ATK': 0, 'TNK' : 0, 'RNG' : 0, 'HEA' : 0}, //H
    'W38N45': { 'TRP': 1, 'BLD': 1, 'HRV0': 1, 'HRV1': 1, 'MNR': 1, 'RTRP': 1, 'ATK': 0, 'TNK' : 0, 'RNG' : 0, 'HEA' : 0}, //O
    'W39N45': { 'TRP': 1, 'BLD': 1, 'HRV0': 1, 'HRV1': 0, 'MNR': 1, 'RTRP': 1, 'ATK': 0}, //U
    'W38N46': { 'TRP': 1, 'BLD': 1, 'HRV0': 1, 'HRV1': 1, 'MNR': 1, 'RTRP': 1, 'ATK': 0}, //L
    'W39N46': { 'TRP': 1, 'BLD': 1, 'HRV0': 1, 'HRV1': 1, 'MNR': 1, 'RTRP': 1, 'ATK': 0}, //K
    'W39N44': { 'TRP': 1, 'BLD': 1, 'HRV0': 1, 'HRV1': 1, 'MNR': 1, 'RTRP': 1, 'ATK': 0}, //Z
  }
  for (i in Game.creeps) {
    var cr = Game.creeps[i];
    working(cr);

    var rm = cr.memory.rm;
    var role = cr.memory.role;
    if (rm)
      rooms_creeps[rm][role] -= 1
  }

  for (rm in rooms_creeps) {
    for (role in rooms_creeps[rm]) {
      if (rooms_creeps[rm][role] > 0) {
        var sp = get_spawn(rm);
        if (sp)
          creating(role, sp);
      }
    }
  }
}


module.exports = {
  main: function () {
    process();
  }
};
