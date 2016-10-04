import * as _ from "lodash";

//import * as buildMngr from './build.manager';
import * as assignMngr from './assignment.manager'
import * as sourceMngr from './source.manager'

function loop () {
  for (let roomName in Game.rooms) {
    let room = Game.rooms[roomName];

    let sources = <Source[]>room.find(FIND_SOURCES);

    sourceMngr.run(sources[0]);
  }

  assignMngr.run();

}

export {loop};
