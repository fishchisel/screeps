import * as _ from "lodash";

import * as buildManager from './build.manager';
import * as mineManager  from './mine.manager';
import * as spawnManager from './spawn.manager';

function loop () {

  for (let roomName in Game.rooms) {
    let room = Game.rooms[roomName];

    // - Finds all valid mining positions in a given room.
    // - Sends orders to the spawn manager to fill those mining positions.
    // - Miners harvest energy from a source and deposit it in the source's
    //  container.
    mineManager.run(room);
  }

  // processes all orders for new creeps.
  spawnManager.run();
}

export {loop};
