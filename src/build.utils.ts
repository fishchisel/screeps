

export function makeCSite(pos: RoomPosition, type: string) : boolean {
  let room = Game.rooms[pos.roomName];
  let err = room.createConstructionSite(pos, STRUCTURE_CONTAINER);
  if (err) console.log(`build.utils: Could not make construction site: ${err}`)
  return ! err;
}
