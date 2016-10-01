import * as buildLocFinder from "./build.location-finder";

/** Queues construction sites for the given number of extensions in the given
  * room. */
function constructExtensions(room: Room, count: number) {
  var curConstrs = room.find(FIND_MY_CONSTRUCTION_SITES, {
    filter: { structureType: STRUCTURE_EXTENSION }
  });
  var curStructs = room.find(FIND_MY_STRUCTURES, {
    filter: { structureType: STRUCTURE_EXTENSION }
  });

  let numExtensions = curConstrs.length + curStructs.length;
  var toBuild = count - numExtensions;

  var pos = buildLocFinder.positionExtension(room);
  if (pos) room.createConstructionSite(pos, STRUCTURE_EXTENSION);
  else console.log("No free constuction site for extension.");
}

export { constructExtensions };
