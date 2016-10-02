'use strict'
const expect = require('chai').expect;
const sut = require('../dist/room-position.utils');

function RoomPosition(x,y) {
  this.x = x;
  this.y = y;
}

describe("Room Position Utils", () => {
  let ra = new RoomPosition(0,0)
  let rb = new RoomPosition(0,1)
  let rc = new RoomPosition(1,0);
  let rd = new RoomPosition(1,1)

  describe("intersect", () => {

    it("Empty Arrays -> Empty Return", () => {
      let result = sut.intersect([])

      expect(result).to.be.empty;
    });

    it("Same Arrays -> Returns all", () => {
      let a = [ ra ];
      let b = [ ra ];

      let result = sut.intersect(a,b);

      expect(result.length).to.equal(1)
      expect(result[0].x).to.equal(ra.x)
      expect(result[0].y).to.equal(ra.y)
    });

    it("Different Arrays -> Returns empty", () => {
      let a = [ ra ];
      let b = [ rb ];

      let result = sut.intersect(a,b);

      expect(result).to.be.empty;
    });

    it("Multi Arrays -> Returns half", () => {
      let a = [ ra, rb ];
      let b = [ rb ];

      let result = sut.intersect(a,b);

      expect(result.length).to.equal(1)
      expect(result[0].x).to.equal(rb.x)
      expect(result[0].y).to.equal(rb.y)
    });
  });

  describe("contains", () => {

    it("Empty container -> false", () => {
      let a = ra;
      let b = []

      let result = sut.contains(a, b);

      expect(result).to.be.false;
    });

    it("Not in container -> false", () => {
      let a = ra;
      let b = [rb];

      let result = sut.contains(a, b);

      expect(result).to.be.false;
    });

    it("In container -> true", () => {
      let a = ra;
      let b = [ra];

      let result = sut.contains(a,b);

      expect(result).to.be.true;
    });

  });


});
