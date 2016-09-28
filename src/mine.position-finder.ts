import { getPositionsInRange } from './utils'
import * as _ from 'lodash'

function findMiningPosForRoom(room: Room) : RoomPosition[] {
  let sources = room.find<Source>(FIND_SOURCES);

  return sources.reduce<RoomPosition[]>(
    (p,c) => p.concat(findMiningPosForSource(c)),
    []);
}

/* Finds valid mining positions for the given source. A valid position is any
 * position that a creep may stand on. */
function findMiningPosForSource(source: Source) : RoomPosition[] {
  return getPositionsInRange(
    source.pos,
    (p) => {
      let tr = p.lookFor<string>(LOOK_TERRAIN)[0];
      return tr === 'plain' || tr === 'swamp'},
    1);
}

export { findMiningPosForRoom, findMiningPosForSource }
