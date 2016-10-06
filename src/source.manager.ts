import * as sutils from './source.utils'
import * as rputils from './room-position.utils'
import * as assignMngr from './assignment.manager'

interface SourceManager {
  sourceId: string;
  roomName: string;
  miningPos: RoomPosition;
}

const sourceManagerCache: {[sourceId: string] : SourceManager} = {}

/** Creates a SourceManager for the given source. */
function createSourceManager(source: Source) : SourceManager {
  let possiblePositions = sutils.findMiningPosForSource(source);
  let center = new RoomPosition(25, 25, source.room.name);
  let bestPos = rputils.closestTo(center, possiblePositions);
  return {
    sourceId: source.id,
    roomName: source.room.name,
    miningPos: bestPos
  }
}

/** Gets a source manager for the given source. Uses a cache. */
function getSourceManager(source: Source) : SourceManager {
  if (!sourceManagerCache[source.id]) {
    sourceManagerCache[source.id] = createSourceManager(source);
  }
  return sourceManagerCache[source.id];
}

/** Gets the assignment id for the source. */
function getAssignmentId(source: Source) : string {
  return `${source.room.name}-source-${source.pos.x}-${source.pos.y}`
}

/** Gets the miner assigned to the given source, or null. For now we're
  * assuming any assigned creep is the miner */
function getMiner(source: Source) : Creep | null {
  let creeps = assignMngr.getAssignments(getAssignmentId(source));
  if (creeps.length) return creeps[0];
  return null;
}

function moveMiner(source: Source, creep: Creep) {
  let manager = getSourceManager(source);
  if (!creep.pos.isEqualTo(manager.miningPos)) {
    creep.moveTo(manager.miningPos);
  }
  else {
    creep.harvest(source);
  }
}

export function run(source: Source) {
  // if miner, control its movements. Else, request a miner.
  let miner = getMiner(source);
  if (miner) {
    moveMiner(source, miner);
  }
  else {
    let plan = {move: 'min'}
    plan[WORK] = 1;
    plan[CARRY] = 1;

    assignMngr.request(plan,  getAssignmentId(source), "", source.pos,
                       assignMngr.Priority.Medium);
  }
}
