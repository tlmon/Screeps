const pick_links_id = {'625dbe29ef44a9b3baf0f1b5' : 2, '625eaf711581891bee1ffbde' : 2, '631f599c92e42b47dc0050ff' : 2, 
                        '63285d850d3f3ce97970cb82' : 2, '632855e591704ea986ec5707' : 2, '6328548c70869a24de70ffb3' : 2,
                        '6321f49f645626a7fada60eb' : 1, '6286b26a39dd93ecc5fe1c96' : 1, '628d293d727ba79e21c16ff1' : 1};

module.exports = {
    transfer : function(links)
    {
        var give = null;
        var pick_prioritet = 0;
        var pick = null;
        for(i in links)
        {
            var link = links[i];
            if(link.id in pick_links_id && link.store.getUsedCapacity(RESOURCE_ENERGY) <= 700 && pick_prioritet < pick_links_id[link.id])
            {
                pick = link;
                pick_prioritet = pick_links_id[link.id];
                continue;
            }
            else
            if(!(link.id in pick_links_id) && link.store.getUsedCapacity(RESOURCE_ENERGY) >= 100 && link.cooldown == 0)
            {
                give = link;
                continue;
            }            
        }
        
        if(give && pick)
        {
            var koef = Math.min(Math.floor(pick.store.getFreeCapacity(RESOURCE_ENERGY) / 100), Math.floor(give.store.getUsedCapacity(RESOURCE_ENERGY) / 100));
            give.transferEnergy(pick, 100 * koef);
        }
    },

    main : function()
    {
      
      var main_rooms = [Game.rooms['W38N44'], Game.rooms['W38N45'], Game.rooms['W39N45'], Game.rooms['W38N46'], Game.rooms['W39N46'], Game.rooms['W39N44']];
        for(i in main_rooms)
        {
            var room = main_rooms[i];
            var links = room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_LINK}});
            if(links.length)
                this.transfer(links);
        }


    }
};
