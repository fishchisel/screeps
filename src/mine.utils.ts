import * as rputils from './room-position.utils';
import * as _ from 'lodash'

// Mining positions for a source are constant, so lets cache them.
const miningPosForSourceCache : { [id: string] : RoomPosition[] } = {}

// CostMatrix for finding container for source are constant, so lets cache them.
const containerPosCostMatrixCache : { [roomName: string] : CostMatrix } = {}

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

/** Get the cost matrix for finding possible container positions. The cost
  * matrix has mining position costs set to be unwalkable. */
function getContainerPosCostMatrix(room: Room) : CostMatrix {
  if(!containerPosCostMatrixCache[room.name]) {
    let costs = new PathFinder.CostMatrix
    let mposes = findMiningPosForRoom(room);
    for (let pos of mposes) costs.set(pos.x, pos.y, 255);
    containerPosCostMatrixCache[room.name] = costs;
  }
  return containerPosCostMatrixCache[room.name];
}

/** Given a source, finds the optimal container position for it. */
function findContainerPosForSource(source: Source) : RoomPosition {
  let miningPositions = findMiningPosForSource(source);

  // valid container positions are 2 tiles from source
  let potentialCPoses = rputils.posAtRange(source.pos, 2, (pos) => {
    let isMiningPos = rputils.contains(pos, miningPositions);
    return !isMiningPos && rputils.terrainWalkable(pos);
  })

  // find the 'best' container position, determined by average distance of each
  // mining position from the container position.
  let bestCPos : RoomPosition = potentialCPoses[0];
  let bestCPosAverage : number = 10000; // a high number
  for (let cpos of potentialCPoses) {
    let dists = miningPositions.map((mpos) => {
      return PathFinder.search(mpos, cpos, {
        roomCallback: (rn) => getContainerPosCostMatrix(Game.rooms[rn]);
      }).cost;
    });
    let average = dists.reduce((c,p) => c + p, 0) / dists.length;
    if (average < bestCPosAverage) {
      bestCPos = cpos;
      bestCPosAverage = average;
    }
  }
  return bestCPos;
}

export {
  findMiningPosForRoom,
  findMiningPosForSource,
  findSourceForRoomPos,
  findContainerPosForSource
}
