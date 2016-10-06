
/** The possible creep types that the spawner can spawn. */
type CreepType = "miner" | "hauler" | "worker";

interface CreepParts {
  cost: number,
  parts: string[]
}

/** Represents a creep that should be built. */
interface CreepPlan {
  /** The target move speed for the creep. 'min' gets one MOVE part. 'road' gets
    * enough MOVE parts to move at full speed on roads. 'full' gets enough move
    * parts to move at full speed on plains. */
  move: "min" | "road" | "full";
  [partName: string] : {min? : number, max? : number}
}

// IMPORTANT: Ensure creep type options are sorted by cost (highest first)
const creepTypes : { [s : string ] : CreepParts[] }  = {
  "miner": [
    {cost: 250, parts: [ WORK, WORK, MOVE ]}
  ],
  "hauler": [
    {cost: 100, parts: [ MOVE, CARRY ] }
  ],
  "worker": [
    {cost: 200, parts: [ WORK, MOVE, CARRY ] }
  ]
}

/** True if there are currently less than the minimum number of parts, false
  * otherwise. */
function needsMorePart(cp: CreepPlan, parts: {}, partName: string) : boolean {
  let min = (!!cp[partName] && !!cp[partName].min) ? cp[partName].min : 0;
  return parts[partName] < min;
}

/** True if there are currently less than the maximum number of parts, false
  * otherwise. */
function wantsMorePart(cp: CreepPlan, parts: {}, partName: string) : boolean {
  let max = (!!cp[partName] && !!cp[partName].max) ? cp[partName].max : 1000;
  return parts[partName] < max;
}

/** Adds the part to the parts object if it currently has less than the target
  * number of parts. Returns if a part was added.*/
function conditionalAddPart(parts: {}, partName: string, num: number): boolean {
  if (num && (!parts[partName] || parts[partName] < num)) {
    if (!parts[partName]) parts[partName] = 1;
    else parts[partName]++;
    return true;
  }
  return false;
}

class BodyPlanBuilder {
  parts: { [partName: string]: number } = {};
  cost: number = 0;
  move: string = 'min';

  findAddCost(partName: string) : number {
    let baseCost = BODYPART_COST[partName];
    let needsMove = this.mustAddMove();
    return needsMove ? baseCost + BODYPART_COST[MOVE] : baseCost;
  }

  add(partName: string) {
    this.cost += this.findAddCost(partName);
    if (!this.parts[partName]) this.parts[partName] = 0;
    if (!this.parts[MOVE]) this.parts[MOVE] = 0;

    this.parts[partName]++;
    if (this.mustAddMove()) this.parts[MOVE]++;
  }

  /** True if it is necessary to add a MOVE part if a new part is added, false
    * otherwise. */
  mustAddMove() : boolean {
    let pCount = Object.keys(this.parts).reduce((p,c) => this.parts[c] + p, 0);
    let moveCount = this.parts[MOVE] ? this.parts[MOVE] : 0;

    if (this.move === 'min')   return (moveCount === 0);
    if (this.move === 'road')  return (moveCount < (pCount + 1) / 2);
    if (this.move === 'full') return (moveCount < (pCount + 1));
    throw "Invalid MoveSpeed";
  }
}

/** Tries to add the given part to the builder. */
function addPart(partName: string, builder: BodyPlanBuilder,
                 targetParts: number, maxCost: number) : boolean {
   let pCount = builder.parts[partName] ? builder.parts[partName] : 0;
   if (pCount < targetParts) {
     let cost = builder.findAddCost(partName);
     if (builder.cost + cost <= maxCost) {
       builder.add(partName);
       return true;
     }
   }
   return false;
}

/** Adds up to one of each part from the given plan to the given builder.
   * Returns a string indicating success:
   * 'ok' -> added a part
   * 'nopart' -> no parts needed to add
   * 'nobudget' -> ran out of budget and could not add parts. */
function addParts(plan: CreepPlan, builder: BodyPlanBuilder,
                  selector: 'min' | 'max', maxCost: number) : string {
  let addedPart = false;
  let noBudget = false;

  for (let partName in plan) {
    let neededParts = plan[partName][selector] || 0;
    let currParts = builder.parts[partName] || 0;

    if (currParts < neededParts) {
      let partCost = builder.findAddCost(partName);
      if (builder.cost + partCost <= maxCost) {
        builder.add(partName);
        addedPart = true;
      }
      else {
        noBudget = true;
      }
    }
  }

  if (addedPart) return 'ok';
  if (noBudget)  return 'nobudget'
  return 'nopart';
}

/** Generates a body parts array based on the given body plan. */
function getBodyPlan(plan: CreepPlan, maxCost: number) : string[] {
  let builder = new BodyPlanBuilder();
  if (plan.move) builder.move = plan.move;

  while (true) {
    let result = addParts(plan, builder, 'min', maxCost);
    // We ran out of budget before building all 'min' parts.
    if (result === 'nobudget') return [];
    // We might not have built all 'min' parts yet.
    if (result === 'ok') continue;

    result = addParts(plan, builder, 'max', maxCost);
    if (result !== 'ok') break;
  }

  let output : string[] = []
  for (let partName in builder.parts) {
    let pCount = builder.parts[partName];
    for (let i = 0; i< pCount; i++) {
      output.push(partName);
    }
  }
  return output;
}

/** Returns a body pattern for the given type that must cost at most 'maxCost'
  * energy to build. */
function getBodyPlanOld(creepType: CreepType, maxCost: number) : string[] {
  let options = creepTypes[creepType];

  if (options) {
    for (let entry of options) {
      if (entry.cost <= maxCost) return entry.parts;
    }
  }

  console.log(`assignment.creep-types: No body plan : ${creepType} ${maxCost}`);
  return []
}

export { CreepPlan, CreepType, getBodyPlan }
