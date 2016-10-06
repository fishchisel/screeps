
/** Represents a creep that should be built. */
export interface CreepPlan {
  /** The target move speed for the creep. Must be one of 'min', 'road', 'full'.
    * - 'min' gets one MOVE part.
    * - 'road' gets enough MOVE parts to move at full speed on roads.
    * - 'full' gets enough move parts to move at full speed on plains. */
  move: string // "min" | "road" | "full";
  [partName: string] : {min? : number, max? : number}
}

/** helps 'getBodyPlan' construct a creep parts array from a CreepPlan.*/
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

    if (this.mustAddMove()) this.parts[MOVE]++;
    this.parts[partName]++;
  }

  /** True if it is necessary to add a MOVE part if a new part is added, false
    * otherwise. */
  mustAddMove() : boolean {
    let pCount = Object.keys(this.parts).reduce((p,c) => this.parts[c] + p, 0);
    let moveCount = this.parts[MOVE] ? this.parts[MOVE] : 0;

    if (this.move === 'min')   return (moveCount === 0);
    if (this.move === 'road')  return (moveCount < (pCount + 1) / 3);
    if (this.move === 'full') return (moveCount < (pCount + 1) / 2);
    throw "Invalid MoveSpeed";
  }
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
export function makeBodyPlan(plan: CreepPlan, maxCost: number) : string[] {
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
