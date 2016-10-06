import { CreepPlan, makeBodyPlan } from './assignment.body-creator';
import * as sputils from './spawn.utils'
import * as amem from './assignment.memory'
import * as autils from './assignment.utils'

export enum Priority {
  Critical = 1,
  High = 2,
  Medium = 3,
  Low = 4,
  Extras = 5
}

interface Request{
  creepPlan: CreepPlan;
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
export function request(creepPlan: CreepPlan, ownerId: string, jobId: string,
                        pos: RoomPosition, priority: Priority, fuzzy = true) {
  // has the request queue been cleared since the last game tick?
  if (Game.time > _requestQueueTime) {
    _requestQueueTime = Game.time;
    _requests = [];
  }
  _requests.push({ creepPlan: creepPlan, ownerId: ownerId, jobId: jobId,
                   pos: pos, priority: priority, fuzzy: fuzzy });
}

/** Release the given creep back to the assignnment manager. */
export function release(ownerId: string, creep: Creep) {
  amem.unassign(ownerId, creep);
  amem.assign('unassigned', creep);
}

/** Gets the creeps assigned to the given ownerId. Returns an array of creep
  * names, corresponding to the creeps assigned to the ownerId. */
export function getAssignments(ownerId: string) : Creep[] {
  let creepNames = amem.getAssignments(ownerId)
  return creepNames.map((n) => Game.creeps[n]);
}

/** Returns the first creep in the given creep array to match the given plan.
  * returns undefined if there is no such creep. */
function findCreepForPlan(plan: CreepPlan, creeps: Creep[]) : Creep|undefined {
  for (let creep of creeps) {
    if(autils.creepMatchesPlan(creep,plan)) return creep;
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
    let ucreep = findCreepForPlan(req.creepPlan, unassigned);
    if (ucreep) {
      amem.assign(req.ownerId, ucreep);
      continue;
    }

    // if creep still building, just continue
    let bcreep = findCreepForPlan(req.creepPlan, building);
    if (bcreep) continue;

    // try to build the request and put it in the 'building' assignment group.
    let room = Game.rooms[req.pos.roomName];
    let body = makeBodyPlan(req.creepPlan, room.energyCapacityAvailable);
    let name = sputils.order(room, body);
    if (name) {
       amem.assign('building', Game.creeps[name]);
     }
  }
}
