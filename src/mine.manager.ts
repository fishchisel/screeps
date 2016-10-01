import { findMiningPosForSource,
         findSourceForRoomPos,
         findContainerPosForSource} from './mine.utils'

interface MinerPosition {
  pos: RoomPosition,
  minerName: string
}

/** Represents a source, the valid mining positions for it, and an optimal
  * position to place a container next to that source. */
interface SourceManager {
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
    positions: findMiningPosForSource(source).map<MinerPosition>((pos) => {
      return {
        minerName: `miner-${source.room.name}-${pos.x}-${pos.y}`,
        pos: pos
      }
    })
  }
}

function run(room: Room) {

  let poses = getPositions(room);
  for (let minerPosition of poses) {
    // TODO
  }
}
