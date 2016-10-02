
// Game mock object
global.LOOK_TERRAIN = 'look'
global.Game = {
  rooms: {
    'test-room': {
      getPositionAt: (x,y) => new RoomPosition(x,y)
    }
  }
}

/// Room position mock object
function RoomPosition(x,y) {
  this.x = x;
  this.y = y;
  this.roomName = 'test-room'
  this.terrain = 'plain'
  this.lookFor = (type) => [this.terrain],
  this.isEqualTo = (pos) => this.x === pos.x && this.y === pos.y;
}

// Source mock object
function Source(x,y) {
  this.pos = new RoomPosition(x,y);
  this.pos.terrain = 'wall'
}

module.exports = {
  RoomPosition: RoomPosition,
  Source: Source
}
