import * as _ from "lodash";

import * as roleHarvester from './role.harvester';
import * as roleUpgrader from './role.upgrader';
import * as roleBuilder from './role.builder';

import buildManager = require('./build.manager');

var TARGET_CREEPS = 16;
var TARGET_ROLES = {
  'harvester': 4,
  'upgrader': 12
}

function generateRoleCounts() {
  var output = {}
  for (let targetRole in TARGET_ROLES) {
    output[targetRole] = {
      current: _.filter(Game.creeps, (creep) => creep.memory.role == targetRole).length,
      target: TARGET_ROLES[targetRole]
    }
    console.log(targetRole, output[targetRole].current, output[targetRole].target)
    output[targetRole].needsMore = output[targetRole].current < output[targetRole].target;
  }
  return output;
}

function loop () {

  for (let roomName in Game.rooms) {
    let room = Game.rooms[roomName];
    buildManager.constructExtensions(room, 10);
  }

  if (Object.keys(Game.creeps).length < TARGET_CREEPS) {
    Game.spawns['Spawn1'].createCreep([MOVE, WORK, CARRY])
  }

  var unassigned = _.filter(Game.creeps, (creep) => !creep.memory.role)
  if (unassigned) {
    for (creep of unassigned) {
      var targets = generateRoleCounts();
      for (let target in targets) {
        if (targets[target].needsMore) {
          creep.memory.role = target;
          break;
        }
      }

      creep.say("unassigned")
    }
  }

  for(var i in Memory.creeps) {
    if(!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }


  for(var name in Game.creeps) {
    var creep = Game.creeps[name];
    if(creep.memory.role == 'harvester') {
      roleHarvester.run(creep);
    }
    if(creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
    if(creep.memory.role == 'builder') {
      roleBuilder.run(creep);
    }
  }
}

export {loop};
