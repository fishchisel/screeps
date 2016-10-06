
/** Builds the given bodyPlan in the given room. Returns the new creep's name,
    or null. */
function build(room: Room, bodyPlan: string[], memory = {}): string|undefined {
  let spawns = getSpawns(room)
  if (!spawns.length) {
    console.log("spawn.manager: No spawns in room.");
  }

  // TODO: handle multiple spawns
  let spawn = spawns[0];

  let result = spawn.createCreep(bodyPlan, undefined, memory);
  if (typeof(result) !== 'number') {
    return result; // result is the creep's new name.
  }
  // squash busy/not enough energy.
  if (result !== ERR_BUSY && result !== ERR_NOT_ENOUGH_ENERGY) {
    console.log(`spawn.manager: fatal error when spawning: ${result}`);
  }
}

/** Tries to build the given creep in the given room. Returns the name of the
  * creep if construction was queued, or nothing if the creep was not queued.*/
export function order(room: Room, bodyPlan: string[])
                      : string|undefined {
  return build(room, bodyPlan);
}

/** Gets the spawns for a room.
  * TODO: Add caching (with timeout) here. */
export function getSpawns(room: Room) : Spawn[] {
  return <Spawn[]>room.find(FIND_MY_SPAWNS);
}
