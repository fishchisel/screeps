import { CreepType, getBodyPlan } from "./spawn.creep-types"

/** Represents a single order. Keys compressed to save memory space. */
interface Order {
  /** Room Name */
  r: string
  /** Body parts for order */
  p: string[],
  /** Target creep name. */
  n: string,
  /** The spawn on which the order is currently being built, if any, or an
    * error code if the order failed to build. */
  s?: string | number
}

/** Tries to build the given order. Returns one of:
  *  - the name of the spawn if construction started
  *  - an error code number if a fatal error occured.
  *  - null if the spawn is busy or does not have sufficient energy. */
function buildOrder(order: Order) : string | number | null {
  // Check presence of room and spawns in room
  let room = Game.rooms[order.r];
  if (!room) {
    console.log("spawn.manager: Invalid room");
    return 0;
  }
  let spawns = <Spawn[]>room.find(FIND_MY_SPAWNS);
  if (spawns.length === 0) {
    console.log("spawn.manager: No spawns in room");
  }

  // try to create a creep. Returns null (non fatal error), error code
  // (fatal error), or spawn name (create success).
  let spawn = spawns[0];
  let result = spawn.createCreep(order.p, order.n);
  if (typeof(result) === 'number') {
    if (result === ERR_BUSY || result === ERR_NOT_ENOUGH_ENERGY) {
      return null;
    }
    console.log(`spawn.manager: fatal error when spawning: ${result}`);
    return result;
  }
  return spawn.name;
}

/** Gets whether the given order is currently being built. */
function orderIsBeingBuilt(order: Order) : boolean {
  if (!order.s) return false;
  let spawn = Game.spawns[order.s];
  return spawn && spawn.spawning && spawn.spawning.name == order.n;
}

/** Returns the order memory object */
function getOrderMemory() : Order[] {
  if (!(<any>Memory).orders) (<any>Memory).orders = [];
  return (<Order[]>(<any>Memory).orders);
}

/** Adds a new order for a creep of the given body plan with the given name to
  * the given room. */
function addOrder(room: Room, bodyPlan: string[], name: string) {
  let orders = getOrderMemory();

  orders.push({
    r: room.name,
    p: bodyPlan,
    n: name
  })
}

/** Processes all orders. */
export function run() {
  let orders = getOrderMemory();

  for (let i = 0; i < orders.length; i++) {
    let order = orders[i];

    // if order not yet sent to spawn, try to send it to spawn.
    if (!order.s) {
      let res = buildOrder(order);
      if (res) {
        order.s = res;
      }
    }
    // if order errored or order is complete, remove it.
    else if (typeof(order.s) === 'number' || !orderIsBeingBuilt(order)) {
      orders.splice(i, 1);
      i--;
    }
  }
}

/** Orders a new creep of the given type in the given room with the given name.
  * Returns nothing if success, or an error message if the order could not be
  * queued. */
export function order(room: Room, creepType: CreepType, name: string) : string | undefined {

  let bodyPlan = getBodyPlan(creepType, room.energyCapacityAvailable);
  if (!bodyPlan) return "No available body plan.";

  addOrder(room, bodyPlan, name);
}

/** Checks whether a creature with the given name has already been ordered */
export function isOrdered(name: string) : boolean {
  let orders = getOrderMemory();
  return orders.some((val) => val.n === name);
}
