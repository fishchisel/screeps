import * as _ from "lodash";

const ROOM_SIZE = 50

/** Returns the positions within the given range of the given position that match
 * the given function. Default range is 1. Function may be undefined. Function
 * receives a room position as an argument. */
function getPositionsInRange(pos: RoomPosition,
                             filter?: (pos: RoomPosition) => boolean,
                             range = 1) : RoomPosition[] {
  let room = Game.rooms[pos.roomName]

  // Find positions around 'pos', skipping positions outside range 0 - 49.
  let positions : RoomPosition[] = []
  for (let px = pos.x - range; px <= pos.x + range; px++) {
    if (px >= 0 && px < ROOM_SIZE) {
      for (let py = pos.y - range; py <= pos.y + range; py++) {
        if (py >= 0 && py < ROOM_SIZE) {
          // if filter exists, add positions that match the filter. else
          // just add the position.
          if ( (filter && filter(pos)) || !filter) {
            positions.push(room.getPositionAt(px,py))
          }
        }
      }
    }
  }

  return positions
}

/** Given an array of arrays containing room positions, finds all room positions
  * that appears in all arrays. */
function findCommonPosition(...posSet: RoomPosition[][]) : RoomPosition[] {
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

export { getPositionsInRange, findCommonPosition }