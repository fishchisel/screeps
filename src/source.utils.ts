import * as rputils from './room-position.utils';


// Mining positions for a source are constant, so lets cache them.
const miningPosForSourceCache : { [id: string] : RoomPosition[] } = {}

/** Finds valid mining positions for the given source. A valid position is any
 * position that a creep may stand on. */
export function findMiningPosForSource(source: Source) : RoomPosition[] {
  if (!miningPosForSourceCache[source.id]) {
    miningPosForSourceCache[source.id] = rputils.posInRange(
      source.pos,
      1,
      (p) => {
        let tr = p.lookFor<string>(LOOK_TERRAIN)[0];
        return tr === 'plain' || tr === 'swamp'
      });
  }
  return miningPosForSourceCache[source.id];
}

/** Finds the source closest to the given room position. */
function findSourceForRoomPos(pos: RoomPosition) : Source {
  return <Source>pos.findClosestByRange(FIND_SOURCES);
}
