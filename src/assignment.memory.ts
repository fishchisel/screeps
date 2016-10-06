// Assignments are stored in memory with the following structure:
// Memory['assignments'] = {
//   'ownerId1'   : { 'creepName1': 1, 'creepName2': 1 },
//   'ownerId2'   : { 'creepName3': 1, 'creepName4': 1 },
//   ...
//   'building'   : { ... },
//   'unassigned' : { ... }
// }
// the 'building' and 'unassigned' ownerIds have special meaning to the
// assignment manager and should not be used by external callers.

/** Gets the object containing creepNames for the given ownerId. Updates to
  * this object will be persisted to memory. */
function getMem(ownerId: string) : {[creepName: string] : number} {
  if (!Memory['assignments']) Memory['assignments'] = {}
  if (!Memory['assignments'][ownerId]) Memory['assignments'][ownerId] = {}
  return Memory['assignments'][ownerId];
}

/** Gets an array containing the names of creeps assigned to the given ownerId.
  * */
export function getAssignments(ownerId: string) : string[] {
  let mem = getMem(ownerId)
  return Object.keys(mem);
}

/** Unassigns the creep */
export function unassign(ownerId: string, creep: Creep) {
  let mem = getAssignments(ownerId);
  delete mem[creep.name];
}

/** Assigns the given creep name to the given ownerId */
export function assign(ownerId: string, creep: Creep) {
  let mem = getAssignments(ownerId);
  mem[creep.name] = 1;
}
