var roleHarvester = {

  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.carry.energy < creep.carryCapacity) {

      if (creep.memory.target === undefined) {
        var sources = creep.room.find(FIND_SOURCES);
        let source = sources[Math.floor(Math.random() * sources.length)];

        //var closest = creep.pos.findClosestByRange(FIND_SOURCES);
        creep.memory.target = source.id;
      }

      let source = Game.getObjectById(creep.memory.target);
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }

    } else {
      creep.memory.target === undefined;

      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
        }
      });

      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      }

    }
  }
};

export = roleHarvester;
