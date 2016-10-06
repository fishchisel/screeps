import { CreepType, getBodyPlan } from './assignment.creep-types'
import * as sputils from './spawn.utils'

export enum Priority {
  Critical = 1,
  High = 2,
  Medium = 3,
  Low = 4,
  Extras = 5
}

interface Request{
  creepType: CreepType;
  pos: RoomPosition
  ownerId: string;
  jobId: string;
  priority: Priority;
  fuzzy: boolean
}

let _requestQueueTime = 0;
let _requests : Request[] = [];

/** Makes a request for a creep with the given body type.
  * creepType: valid creep type
  * ownerId: id of the process requesting the creep
  * jobId: can be used by the process to track the request
  * pos: A location where the assignment should try to be close to.
  * priority: priority of the request
  * fuzzy: if true, bodyTypes similar to the request may be assigned. */
export function request(creepType: CreepType, ownerId: string, jobId: string,
                        pos: RoomPosition, priority: Priority, fuzzy = true) {

  if (Game.time > _requestQueueTime) {
    _requestQueueTime = Game.time;
    _requests = [];
  }
  _requests.push({ creepType: creepType, ownerId: ownerId, jobId: jobId,
                   pos: pos, priority: priority, fuzzy: fuzzy });
}

/** Gets the assignments memory obj for the given owner. Changes to the obj are
  * persisted. */
function getAssignmentsMemory(ownerId: string) : {[cname: string] : boolean } {
  if (!Memory['assignments']) Memory['assignments'] = {}
  if (!Memory['assignments'][ownerId]) Memory['assignments'][ownerId] = {}
  return Memory['assignments'][ownerId];
}

/** Unassigns the creep */
function unassign(ownerId: string, creep: Creep) {
  let mem = getAssignmentsMemory(ownerId);
  delete mem[creep.name];
}

/** Assigns the given creep name to the given ownerId */
function assign(ownerId: string, creep: Creep) {
  let mem = getAssignmentsMemory(ownerId);
  mem[creep.name] = true;
}

/** Release the given creep back to the assignnment manager. */
export function release(ownerId: string, creep: Creep) {
  unassign(ownerId, creep);
  assign('unassigned', creep);
}

/** Gets the creeps assigned to the given ownerId. Returns an array of creep
  * names, corresponding to the creeps assigned to the ownerId. */
export function getAssignments(ownerId: string) : Creep[] {
  let mem = getAssignmentsMemory(ownerId)
  return Object.keys(mem).map((n) => Game.creeps[n]);
}

function findCreepForType(type: string, creeps: Creep[]) : Creep|undefined {
  //TODO: Room awareness
  for (let creep of creeps) {
    if (creep.memory['type'] === type) return creep;
  }
}

/** Runs the assignment mananger.
  * Note that the assignment ownerIds 'unassigned' and 'building' are used
  * internally and should not be used as an ownerId by external callers. */
export function run() {
  if (!_requests.length) return;

  // move creeps from 'building' to 'unassigned'
  let building = getAssignments('building');
  for (let b of building) {
    if (!b.spawning) release('building', b);
  }

  // process assignments
  let unassigned = getAssignments('unassigned');
  building   = getAssignments('building');
  for (let req of _requests) {
    // if valid unassigned creep, assign it.
    let ucreep = findCreepForType(req.creepType, unassigned);
    if (ucreep) {
      assign(req.ownerId, ucreep);
      continue;
    }

    // if creep still building, just continue
    let bcreep = findCreepForType(req.creepType, building);
    if (bcreep) continue;

    // try to queue the request
    let room = Game.rooms[req.pos.roomName];
    let body = []//getBodyPlan(req.creepType, room.energyCapacityAvailable);
    let name = sputils.order(room, body, req.creepType);
    if (name) {
       assign('building', Game.creeps[name]);
     }
  }
}
