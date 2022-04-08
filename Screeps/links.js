var links = [];
module.exports = {
    transfer : function()
    {
        var give = null;
        var pick = null;
        for(i in links)
        {
            var link = links[i];
            if(link.store.getUsedCapacity(RESOURCE_ENERGY) == 800)
            {

                give = link;
                continue;
            }
            else
            if(link.store.getUsedCapacity(RESOURCE_ENERGY) <= 400)
            {
                pick = link;
                continue;
            }
        }

        if(give && pick)
        {
            give.transferEnergy(pick, 800 - pick.store.getUsedCapacity(RESOURCE_ENERGY));
        }
    },

    main : function()
    {
        for(i in Game.rooms)
        {
            var room = Game.rooms[i];
            links = room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_LINK}});
            if(links.length != 0)
                this.transfer();
        }


    }
};
