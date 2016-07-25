import buildLocFinder = require("./build.location-finder");

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
  room.createConstructionSite(pos, STRUCTURE_EXTENSION);
}


export = { constructExtensions };
