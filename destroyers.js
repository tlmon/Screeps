function randInt() {
  const min = 100000;
  const max = 999999;
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
const body650 = [MOVE, CLAIM]
var bodyx = null;
var spawn1 = null;
var count = 0;
const max = 1;
next = 1000;
const flag1 = Game.flags['new']
var wght = null;
var cr = null;
const live = 0;
module.exports = {
    createDTR : function()
    {
        var log = spawn1.createCreep(bodyx, 'DTR' + randInt(),  {role : 'DTR', weight : wght, full : false});
        if(_.isString(log))
        {
            console.log('create new DTR ' + log);
            // next = 0;
        }
        else
            console.log('create DTR error ' + log);

    },

    creating : function()
    {

        var energ = spawn1.store.getUsedCapacity(RESOURCE_ENERGY);
        var extensions = spawn1.room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
        if(extensions.length > 0)
        {
            for(var i in extensions)
            {
                energ += extensions[i].store.getUsedCapacity(RESOURCE_ENERGY);
            }
        }
        if(energ >= 650)
        {
            bodyx = body650;
            wght = 1;
        }
        else
            return;


        count = 0;

        for(var name in Game.creeps)
        {
            cr = Game.creeps[name];
            if(cr.memory.role == 'DTR')
            {
                count += cr.memory.weight;
            }
        }
        if(count < max)
        {
            console.log("DTR now " + count + ' max ' + max, 'new: weight', wght);
            this.createDTR();
        }
    },

    workDTR : function()
    {
        const contr = cr.room.controller;
        if(cr.claimController(contr) == ERR_NOT_IN_RANGE)
        {
            // cr.moveTo(flag1);
        }
    },

    working : function()
    {

        for(var name in Game.creeps)
        {
            cr = Game.creeps[name];
            if(cr.memory.role == 'DTR')
            {
                this.workDTR();
            }
        }
    },

    main : function()
    {
        spawn1 = Game.spawns.Spawn1;
        ++next;
        if(!spawn1.spawning && next >= 1000)
            this.creating();
        this.working();
    }
};
