'use strict'
const expect = require('chai').expect;
const sut = require('../dist/room-position.utils');
const mocks = require('./screeps-mocks');

let RoomPosition = mocks.RoomPosition;

describe("Room Position Utils", () => {
  let ra = new RoomPosition(0,0)
  let rb = new RoomPosition(0,1)
  let rc = new RoomPosition(1,0);
  let rd = new RoomPosition(1,1)
  let re = new RoomPosition(24,24);

  describe("Pos In Range", () => {

    it("Range 1 at corner -> Returns 3", () => {
      let result = sut.posInRange(ra);

      expect(result.length).to.equal(3);
      expect(result[0].x).to.equal(0);
      expect(result[0].y).to.equal(1);
      expect(result[1].x).to.equal(1);
      expect(result[1].y).to.equal(0);
      expect(result[2].x).to.equal(1);
      expect(result[2].y).to.equal(1);
    });

    it("Range 1 at center -> Returns 8", () => {
      let result = sut.posInRange(re);

      expect(result.length).to.equal(8);
    });

    it("Range 1 at center with gtx filter -> Returns 3", () => {
      let filter = (p) => p.x > re.x;

      let result = sut.posInRange(re,1, filter);

      expect(result.length).to.equal(3);
    });

  });

  describe("Pos At Range", () => {

    it("Range 1 at center -> Returns 8", () => {
      let result = sut.posAtRange(re);

      expect(result.length).to.equal(8);
    });

    it("Range 2 at center -> Returns 16", () => {
      let result = sut.posAtRange(re, 2);

      expect(result.length).to.equal(16);
    });

  });

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
