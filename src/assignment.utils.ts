import { CreepPlan } from './assignment.body-creator';
import * as _ from 'lodash'

/** Returns boolean indicating whether the given creep matches the given
  * creep plan. */
export function creepMatchesPlan(creep: Creep, plan: CreepPlan) : boolean {
  let parts = creep.body.map((x) => x.type);
  let partGroups = _.groupBy(parts);

  let partCount = parts.length;
  let moveCount = partGroups[MOVE].length;

  // has enough move parts?
  if (plan[MOVE] === 'min' && moveCount < 1) return false;
  if (plan[MOVE] === 'full' && moveCount < partCount / 2) return false;
  if (plan[MOVE] === 'road' && moveCount < partCount / 3) return false;

  // has enough other parts?
  for(let part in plan) {
    if (part === MOVE) continue;

    let interval = plan[part];
    if (interval.min && partGroups[part].length < interval.min) return false;
    if (interval.max && partGroups[part].length > interval.max) return false;
  }

  return true;
}
