
/** The possible creep types that the spawner can spawn. */
type CreepType = "miner" | "hauler" | "worker";

interface CreepParts {
  cost: number,
  parts: string[]
}

// IMPORTANT: Ensure creep type options are sorted by cost (highest first)
const creepTypes : { [s : string ] : CreepParts[] }  = {
  "miner": [
    {cost: 300, parts: [ WORK, WORK, CARRY, MOVE ]}
  ],
  "hauler": [
    {cost: 100, parts: [ MOVE, CARRY ] }
  ],
  "worker": [
    {cost: 200, parts: [ WORK, MOVE, CARRY ] }
  ]
}

/** Returns a body pattern for the given type that must cost at most 'maxCost'
  * energy to build. */
function getBodyPlan(creepType: CreepType, maxCost: number) : string[] | null {
  let options = creepTypes[creepType];

  if (options) {
    for (let entry of options) {
      if (entry.cost < maxCost) return entry.parts;
    }
  }

  return null;
}

export { CreepType, getBodyPlan }
