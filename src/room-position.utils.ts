import * as _ from "lodash";

const ROOM_SIZE = 50

type TerrainType = "plain" | "swamp" | "wall";

/** Returns the positions within the given range of the given position that match
 * the given function. Default range is 1. Function may be undefined. Function
 * receives a room position as an argument. */
export function posInRange(pos: RoomPosition,
                           range = 1,
                           filter?: (pos: RoomPosition) => boolean)
                           : RoomPosition[] {
  let room = Game.rooms[pos.roomName]

  // Find positions around 'pos', skipping positions outside range 0 - 49.
  let positions : RoomPosition[] = []
  for (let px = pos.x - range; px <= pos.x + range; px++) {
    if (px >= 0 && px < ROOM_SIZE) {
      for (let py = pos.y - range; py <= pos.y + range; py++) {
        // skip self
        if (px === pos.x && py === pos.y) continue;

        if (py >= 0 && py < ROOM_SIZE) {
          // if filter exists, add positions that match the filter. else
          // just add the position.
          let newPos = room.getPositionAt(px,py);
          if ( (filter && filter(newPos)) || !filter) {
            positions.push(newPos)
          }
        }
      }
    }
  }

  return positions
}

/** Returns the positions at the given range from the given position that match
 * the given function. Default range is 1. Function may be undefined. Function
 * receives a room position as an argument. */
export function posAtRange(pos: RoomPosition,
                           range = 1,
                           filter?: (pos: RoomPosition) => boolean)
                           : RoomPosition[] {
  let room = Game.rooms[pos.roomName]

  // Find positions around 'pos', skipping positions outside range 0 - 49.
  let positions : RoomPosition[] = []
  for (let px = pos.x - range; px <= pos.x + range; px++) {
    if (px >= 0 && px < ROOM_SIZE) {
      for (let py = pos.y - range; py <= pos.y + range; py++) {
        if (py >= 0 && py < ROOM_SIZE) {
          if (Math.abs(py - pos.y) === range || Math.abs(px - pos.x) === range){
            // if filter exists, add positions that match the filter. else
            // just add the position.
            let newPos = room.getPositionAt(px,py);
            if ( (filter && filter(newPos)) || !filter) {
              positions.push(newPos)
            }
          }
        }
      }
    }
  }

  return positions
}

/** Returns whether the two given positions are within the given range
  * (default 1) of each other. */
export function isPosInRange(posa: RoomPosition,
                             posb: RoomPosition,
                             range = 1) : boolean {
  return Math.abs(posa.x - posb.x) <= range
      && Math.abs(posa.y - posb.y) <= range;
}

/** Returns the intersection of the given RoomPosition[] arrays. */
export function intersect(...posSet: RoomPosition[][]) : RoomPosition[] {
  if (posSet.length === 0) return [];

  let comparator = (a,b) => (a.x === b.x && a.y === b.y)

  let intersection = posSet[0]
  for (let i = 1; i < posSet.length; i++) {
    let positions = posSet[i];
    for (let j = intersection.length - 1; j >= 0; j--) {
      let intersectionPos = intersection[j];
      let intersect = positions.some((val) => comparator(val,intersectionPos));
      if (!intersect) intersection.splice(j, 1);
    }
  }

  return intersection;
}

/** Returns the terrain at the given position. */
export function terrain(pos: RoomPosition) : TerrainType {
  let tr = pos.lookFor<string>(LOOK_TERRAIN);
  return <TerrainType>tr[0];
}

export function terrainWalkable(pos: RoomPosition) : boolean {
  let tr = terrain(pos);
  return tr === 'plain' || tr === 'swamp';
}

/** Returns where 'pos' is contained within 'poses' */
export function contains(pos: RoomPosition, poses: RoomPosition[]) : boolean {
  return poses.some((val) => pos.x === val.x && pos.y === val.y)
}

/** Generates a string representation of the given RoomPosition array */
export function toString(poses: RoomPosition[]) : string {
  let str = poses.reduce((p,c,i) => {
    if (i > 0) return `${p }, [${c.x}, ${c.y}]`
    else return ` [${c.x}, ${c.y}]`
   },"[");
   return str + ' ]'
}
