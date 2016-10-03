

/** Transfers all energy to the given structure */
export function transfer(stru: Structure, creep: Creep) : boolean {
  let err = creep.transfer(stru, RESOURCE_ENERGY);
  if (err) console.log(`creep.utils: Could not transfer: ${err}`)
  return !err;
}

/** Repairs the given structure if the structure requires repair (at least 100
  * hp less than maximum). If 'force' is true, repairs the structure anyway. */
export function repair(stru: Structure, creep: Creep, force = false) : boolean {
  if (force || (stru.hitsMax - stru.hits > REPAIR_POWER)) {
    let err = creep.repair(stru);
    if (err) console.log(`creep.utils: Could not transfer: ${err}`)
    return !err;
  }
  return true;
}

/** Constructs the given construction site */
export function build(csite: ConstructionSite, creep: Creep) : boolean {
  let err = creep.build(csite);
  if (err) console.log(`creep.utils: Could not build: ${err}`)
  return !err;
}
