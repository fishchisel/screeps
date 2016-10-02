import * as rputils from './room-position.utils';
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
  return rputils.posInRange(
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

  // Is the given RoomPosition buildable and not a mining position?
  let validContainerPos = (r: RoomPosition) : boolean => {
    let tr = r.lookFor<string>(LOOK_TERRAIN)[0];
    let isMiningPosition = rputils.contains(r, miningPositions);
    return (tr === 'plain' || tr === 'swamp') && !isMiningPosition;
  }

  // Find a container position that is as close as possible to all mining
  // positions, without actually being a mining position.
  for (let i = 1; i < 5; i++) {
    let inRange = miningPositions.map((val) => {
      return rputils.posInRange(val, validContainerPos, i);
    })
    let intersect = rputils.intersect(...inRange);
    if (intersect.length > 0) return intersect[0];
  }

  console.log("mine.utils: Unexpected inability to find container");
  return source.pos;
}

export {
  findMiningPosForRoom,
  findMiningPosForSource,
  findSourceForRoomPos,
  findContainerPosForSource
}
