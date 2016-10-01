import { getPositionsInRange } from './room-position.utils';
import * as _ from 'lodash'

/** Finds valid mining positions for the given room. A valid position is any
 * position a creep may stand on. */
function findMiningPosForRoom(room: Room) : RoomPosition[] {
  let sources = room.find<Source>(FIND_SOURCES);

  return sources.reduce<RoomPosition[]>(
    (p,c) => p.concat(findMiningPosForSource(c)),
    []);
}

/** Finds valid mining positions for the given source. A valid position is any
 * position that a creep may stand on. */
function findMiningPosForSource(source: Source) : RoomPosition[] {
  return getPositionsInRange(
    source.pos,
    (p) => {
      let tr = p.lookFor<string>(LOOK_TERRAIN)[0];
      return tr === 'plain' || tr === 'swamp'},
    1);
}

/** Finds the source closest to the given room position. */
function findSourceForRoomPos(pos: RoomPosition) : Source {
  return <Source>pos.findClosestByRange(FIND_SOURCES);
}

/** Given a source, finds the optimal container position for it. */
function findContainerPosForSource(source: Source) : RoomPosition {
  let miningPositions = findMiningPosForSource(source);
  return new RoomPosition(0,0,"sim");
}

export {
  findMiningPosForRoom,
  findMiningPosForSource,
  findSourceForRoomPos,
  findContainerPosForSource
}
