import { findMiningPosForSource,
         findSourceForRoomPos,
         findContainerPosForSource} from './mine.utils'

import * as rputils from './room-position.utils'
import * as spawnManager from './spawn.manager'
import * as cutils from './creep.utils'
import * as butils from './build.utils'


interface MinerPosition {
  pos: RoomPosition,
  minerName: string
}

/** Represents a source, the valid mining positions for it, and an optimal
  * position to place a container next to that source. */
interface SourceManager {
  roomName: string,
  positions: MinerPosition[],
  sourceId: string,
  containerPos: RoomPosition,
}

// Cache of source managers. Source managers are created deterministically, so
// it's valid to generate them once for each room then keep hold of them.
let sourceManagerCache: {[roomName: string]: SourceManager[]} = {}

/** Gets SourceManagers for the given room, retrieving it from the
  * cache if possible. */
function getPositions(room: Room) : SourceManager[] {
  if (!sourceManagerCache[room.name]) {
    let sources = <Source[]>room.find(FIND_SOURCES);
    let roomSourceManagers = <SourceManager[]>sources.map((s) => {
      return sourceManagerFromSource(s);
    });
    sourceManagerCache[room.name] = roomSourceManagers;
  }

  return sourceManagerCache[room.name];
}

/** Creates a SourceManager for the given source. */
function sourceManagerFromSource(source: Source) : SourceManager {
  return {
    sourceId: source.id,
    containerPos: findContainerPosForSource(source),
    roomName: source.room.name,
    positions: findMiningPosForSource(source).map<MinerPosition>((pos) => {
      return {
        minerName: `miner-${source.room.name}-${pos.x}-${pos.y}`,
        pos: pos
      }
    })
  }
}

/** Tries to queue for building a miner for the given position. Returns whether
  * the attempt to queue succeeded. */
function buildMiner(mngr: SourceManager, pos: MinerPosition) : boolean {
  if (!spawnManager.isOrdered(pos.minerName)) {
    let room = Game.rooms[mngr.roomName];
    let err = spawnManager.order(room, "miner", pos.minerName);
    if (err) console.log(`miner.mananger: could not queue miner: ${err}`);
    return !err;
  }
  return false;
}

/** Tries to deposit at the target container. IF the container doesn't exist,
  * builds it. */
function depositAtContainer(mngr: SourceManager, creep: Creep) {
  let cpos = mngr.containerPos;
  let structures = cpos.lookFor<Structure>(LOOK_STRUCTURES)

  if (structures.length) {
    cutils.repair(structures[0], creep);
    cutils.transfer(structures[0], creep);
  }
  else {
    let csites = <ConstructionSite[]>cpos.lookFor(LOOK_CONSTRUCTION_SITES);
    if (!csites.length) {
      butils.makeCSite(cpos, STRUCTURE_CONTAINER);
    }
    else {
      cutils.build(csites[0], creep);
    }
  }
}

/** Handles moving miner to mining position, mining, and sending resources to
  * container. */
function moveMiner(mngr: SourceManager, mpos: MinerPosition, creep: Creep) {
  let source = <Source>Game.getObjectById(mngr.sourceId);

  // is miner full?
  if (creep.carry.energy >= creep.carryCapacity) {
    if (rputils.isPosInRange(creep.pos, mngr.containerPos)) {
      depositAtContainer(mngr, creep);
    }
    else {
      creep.moveTo(mngr.containerPos);
    }
  }
  else {
    // is creep at mining position?
    if (creep.pos.isEqualTo(mpos.pos)) {
      let err = creep.harvest(source)
      if (err) console.log(`mine.mananger: Could not harvest: ${err}`);
    }
    else {
      creep.moveTo(mpos.pos);
    }
  }
}

/** Runs logic for all source managers in the given room. */
export function run(room: Room) {
  const MAX_BUILD_PER_TICK = 1;

  let sourceManagers = getPositions(room);
  let built = 0;

  for (let mngr of sourceManagers) {
    for (let pos of mngr.positions) {
      let creep = Game.creeps[pos.minerName];

      // if creep does not exist, try to build it.
      if (!creep && built < MAX_BUILD_PER_TICK) {
        if (buildMiner(mngr, pos)) built++;
      }

      // if creep exists, handle its move/work orders.
      if (creep) {
        moveMiner(mngr, pos, creep);
      }
    }
  }
}
