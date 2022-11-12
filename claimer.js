const body650 = [MOVE, CLAIM];
const create_permission = true;

module.exports = {
    createCLM : function(sp, cur_body)
    {
        var creep_name = 'CLM_' + sp.name;
        console.log('create new', creep_name, 'result:',
        sp.spawnCreep(cur_body, creep_name,
        {memory: {role : 'CLM', sp : sp.name}, directions : [LEFT, RIGHT]}));
    },

    creating : function(sp)
    {
        exist = false;
        for(var name in Game.creeps)
        {
          cr = Game.creeps[name];
          if(cr.memory.role == 'CLM')
            exist = true;
        }
        if(exist)
          return;
        var cur_body = null;
        var energy_available = sp.room.energyAvailable;
        if(energy_available >= 650)
            cur_body = body650;
        else
            return;
        this.createCLM(sp, cur_body);
    },

    workCLM : function(cr)
    {

      const flag_claim = Game.flags['new'];
        if(cr.room.name != flag_claim.pos.roomName)
        {
            cr.moveTo(flag_claim)
        }
        else{
          const contr = cr.room.controller;
          if(cr.signController(contr, 'No war!') == ERR_NOT_IN_RANGE)
            cr.moveTo(contr);
        //   console.log(cr.attackController(contr));
        //   if(cr.attackController(contr) == ERR_NOT_IN_RANGE) {
        //         cr.moveTo(contr);
        //         return;
        //     }
           if(cr.claimController(contr) == ERR_NOT_IN_RANGE)
               cr.moveTo(contr);
        }

    },

    working : function()
    {

        for(var name in Game.creeps)
        {
            cr = Game.creeps[name];
            if(cr.memory.role == 'CLM')
                this.workCLM(cr);
        }
    },

    main : function()
    {
        sp = Game.spawns['Spawn1'];
        if(!sp.spawning && create_permission)
            this.creating(sp);
        this.working();
    }
};
