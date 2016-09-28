import * as _ from "lodash";

/** Possible offset positions that extensions may be placed in. */
const positions = [
  {x:1, y:2},
  {x:2, y:1},
  {x:2, y:2},
  {x:2, y:3},
  {x:3, y:2}
];
let allPositions = _.flatten(positions.map((v) => {
  return [v, {x:v.x, y: -v.y}, {x:-v.x, y:v.y}, {x:-v.x, y:-v.y}]
}));

const nonBuildableTypes = [
  LOOK_SOURCES,
  LOOK_MINERALS,
  LOOK_STRUCTURES,
  LOOK_CONSTRUCTION_SITES,
  LOOK_NUKES
];

/** Determines whether the given RoomPosition is buildable. */
function isBuildable(pos: RoomPosition) : boolean {
  let look = pos.look();
  for (let item of look) {
    if (nonBuildableTypes.indexOf(item.type) > -1) {
      return false;
    }
    if (item.terrain == 'wall') {
      return false;
    }
  }
  return true;
}

/**
 * Finds the next free location in which an extension can be placed in the
 * given room.
 */
function positionExtension(room: Room) : RoomPosition {
  let spawns = room.find(FIND_MY_SPAWNS).sort() as StructureSpawn[];

  if (spawns.length === 0 ) {
    return null;
  }

  // loops through every spawn, and every possible offset position around it.
  // Returns the first free position.
  for (let spawn of spawns) {
    for (let off of allPositions) {
      let pos = room.getPositionAt(spawn.pos.x + off.x, spawn.pos.y + off.y);

      if (pos && isBuildable(pos)) {
        return pos;
      }
    }
  }

  return null;
}

export {isBuildable, positionExtension};
