var bodyx = null;
var spawnx = null;
var cr = null;
var live = 15;

function randInt() {
  const min = 100000;
  const max = 999999;
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function generateBody(size){
  const move_count = 1, work_count = 2 * size, carry_count = 1 * size;
  var body = Array(move_count + work_count + carry_count);
  body.fill(MOVE, 0, move_count);
  body.fill(WORK, move_count, move_count + work_count);
  body.fill(CARRY, move_count + work_count, move_count + work_count + carry_count);
  return body;
}

function createHRV(sour){
  var log = spawnx.createCreep(bodyx, 'HRV_' + sour + '_' + randInt(),
    {role : 'HRV', full : false, sour : sour, sp : spawnx.name});
  if(_.isString(log))
  {
      console.log('create new HRV ' + log);
  }
  else
      console.log('create HRV error ' + log);
}

function creating(){
  var energ = spawnx.store.getUsedCapacity(RESOURCE_ENERGY);
  var extensions = spawnx.room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
  var sources = spawnx.room.find(FIND_SOURCES);
  if(extensions.length > 0)
  {
      for(var i in extensions)
      {
          energ += extensions[i].store.getUsedCapacity(RESOURCE_ENERGY);
      }
  }
  if(energ >= 800)
  {
      bodyx = generateBody(3);
  }
  else if(energ >= 550)
  {
      bodyx = generateBody(2);
  }
  else if(energ >= 300)
  {
      bodyx = generateBody(1);
  }
  else
      return;

  var count0 = false, count1 = false;
  for(var name in Game.creeps)
  {
      cr = Game.creeps[name];
      if(cr.memory.role == 'HRV' && cr.memory.sp == spawnx.name)
      {
          if(cr.memory.sour == 0)
          {
              count0 = true;
          }
          else if(cr.memory.sour == 1)
          {
              count1 = true;
          }
      }
  }
  if(!count0){
      console.log(spawnx.name, "HRV now ", count0, count1, 'sour', sour);
      createHRV(0);
  }
  else if(!count1 && sources.length > 1)
  {
      console.log(spawnx.name, "HRV now ", count0, count1,  'sour', sour);
      createHRV(1);
  }
}

function mine(){
  var total = cr.store.getUsedCapacity(RESOURCE_ENERGY);
  var free = cr.store.getFreeCapacity(RESOURCE_ENERGY);
  const sources = cr.room.find(FIND_SOURCES);
  var sour = sources[cr.memory.sour];
  if(total == 0){
      cr.memory.full = false;
      if(cr.ticksToLive < live)
      {
          sp = Game.spawns[cr.memory.sp];
          if(sp.recycleCreep(cr) == ERR_NOT_IN_RANGE)
            cr.moveTo(sp);
          else
            cr.suicide();
          return;
      }
  }

  if(free > 0 && !cr.memory.full)
  {
      if(sour)
      {
          if(cr.harvest(sour) == ERR_NOT_IN_RANGE)
              cr.moveTo(sour);
      }
  }

  if(free == 0)
      cr.memory.full = true;
}

function workHRV(){
  mine();
  if(cr.memory.full)
  {
      var total = cr.store.getUsedCapacity(RESOURCE_ENERGY);
      var container = cr.pos.findClosestByRange(FIND_STRUCTURES,
                                              { filter: function(obj)
                                                  {
                                                      if(obj.structureType == STRUCTURE_CONTAINER)
                                                      {
                                                          return true;
                                                      }
                                                      return false;
                                                  }
                                              });
      if(container && container.store.getFreeCapacity() > 0)
      {
          if(cr.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
          {
              cr.moveTo(container);
          }
      }
      else
      {
          cr.say('drop');
          cr.drop(RESOURCE_ENERGY, total);
      }
  }
}

function working(){
  for(var name in Game.creeps)
  {
      cr = Game.creeps[name];
      if(cr.memory.role == 'HRV')
      {
          workHRV();
      }
  }
}

function process(){
  const spwns = [Game.spawns['Spawn1']]
  for(i in spwns)
  {
      spawnx = spwns[i];
      if(!spawnx.spawning)
          creating();
  }
  working();
}

module.exports = {
    main : function()
    {
        process();
    }
};
