var weightsMax = [3, 1, 3];
var weightMax = {1: [[3], 1, 3], 2: [[3, 3], 1, 5]};

module.exports = {
    main : function()
    {
        num = 0;
        const spwns = [Game.spawns['Spawn1']]
        for(i in spwns)
        {
            spawnx = spwns[i];
            if(!spawnx.spawning)
                this.creating();
            ++num;
        }

        this.working();
    }
};
