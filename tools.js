module.exports = {
    clear_memory: function () {
        clear_creeps_memory();
        calculate_memory_spawns();
    },

    every_tick: function () {
        mean_cpu_used();
        calculate_active_room();
    },

    spawn_creep: function (spawn, creep_body, creep_name, creep_memory) {
        spawn_creep(spawn, creep_body, creep_name, creep_memory);
    },
};

function clear_creeps_memory() {
    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
    console.log('memory cleared');
}

function mean_cpu_used() {
    if (Memory.cpu_used[0] >= 10000) {
        Memory.cpu_stat.push(Memory.cpu_used[1] / Memory.cpu_used[0]);
        Memory.cpu_used[0] = 0;
        Memory.cpu_used[1] = 0;

        if (Memory.cpu_stat.length > 10) {
            Memory.cpu_stat.shift();
        }
    }

    if (Game.time % 30 == 0) {
        Memory.cpu_used[2] = Memory.cpu_used[1] / Memory.cpu_used[0];
    }
}

function spawn_creep(spawn, creep_body, creep_name, creep_memory) {
    var energy_structures = [];
    var spwan_directions =  [LEFT, RIGHT, BOTTOM, TOP, TOP_RIGHT, BOTTOM_LEFT, TOP_LEFT, BOTTOM_RIGHT];

    try {
        room_energy_structures = Memory.rooms_energy_structures[spawn.room.name];
        if (room_energy_structures.length == 0)
            throw 'Exception';
        for (i in room_energy_structures) {
            var obj = Game.getObjectById(room_energy_structures[i]['id']);
            if (obj == null)
                throw 'Exception';
            energy_structures.push(obj);
        }
        
        
        var result = spawn.spawnCreep(creep_body, creep_name, {
            memory: creep_memory,
            energyStructures: energy_structures,
            directions: spwan_directions
        });
        
        if (result != 0)
            throw 'Exception';
    }
    catch (e) {
        var result = spawn.spawnCreep(creep_body, creep_name, {
            memory: creep_memory,
            directions: spwan_directions
        });
    }
    finally {
        console.log('create new', creep_name, 'in room', spawn.room.name, 'result:', result);
    }

    
}

function calculate_spawn_exstensions(my_room) {
    var extensions = my_room.find(FIND_MY_STRUCTURES,
        {
            filter: function (obj) {
                if (obj.structureType == STRUCTURE_SPAWN || obj.structureType == STRUCTURE_EXTENSION)
                    return true;
                return false;
            }
        }
    );
    var sorted = [];
    var target = my_room.storage;
    
    if (target == null)
        return;
    
    var target2 = my_room.terminal;
    if (target2 == null)
        target2 = target;
    
    for (i in extensions) {
        sorted.push({ 'id': extensions[i].id, 'range': extensions[i].pos.getRangeTo(target) + extensions[i].pos.getRangeTo(target2)});
    }

    sorted.sort(custom_compare_by_range).reverse();
    Memory.rooms_energy_structures[my_room.name] = sorted;
}

function calculate_active_room() {
    Memory.my_rooms = [];

    for (i in Game.rooms) {
        if (Game.rooms[i].controller && Game.rooms[i].controller.my) {
            Memory.my_rooms.push(Game.rooms[i].name);
        }
    }
}

function calculate_memory_spawns() {
    for (i in Memory.my_rooms) {
        calculate_spawn_exstensions(Game.rooms[Memory.my_rooms[i]]);
    }
}

function custom_compare_by_range(a, b) {
    return b.range - a.range;
}