'use strict'
const expect = require('chai').expect;
const sut = require('../dist/room-position.utils');

function RoomPosition(x,y) {
  this.x = x;
  this.y = y;
}

describe("Room Position Utils", () => {

  describe("Find Common Position", () => {

    it("Empty Arrays -> Empty Return", () => {
      let result = sut.findCommonPosition([])

      expect(result).to.be.empty;
    });

    it("Same Arrays -> Returns all", () => {
      let a = [ new RoomPosition(0,0) ];
      let b = [ new RoomPosition(0,0) ];

      let result = sut.findCommonPosition(a,b);

      expect(result.length).to.equal(1)
      expect(result[0].x).to.equal(0)
      expect(result[0].y).to.equal(0)
    });

    it("Different Arrays -> Returns empty", () => {
      let a = [ new RoomPosition(0,0) ];
      let b = [ new RoomPosition(0,1) ];

      let result = sut.findCommonPosition(a,b);

      expect(result).to.be.empty;
    });

    it("Multi Arrays -> Returns half", () => {
      let a = [ new RoomPosition(0,0), new RoomPosition(0,1) ];
      let b = [ new RoomPosition(0,1) ];

      let result = sut.findCommonPosition(a,b);

      expect(result.length).to.equal(1)
      expect(result[0].x).to.equal(0)
      expect(result[0].y).to.equal(1)
    });
  });

});
