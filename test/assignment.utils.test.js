'use strict'
// import constants into global scope
require('./screeps.constants');

const expect = require('chai').expect;
const autils = require('../dist/assignment.utils');

describe("Assignment Utils", () => {
  describe("get body plan", () => {
    function makeCreep(body) {
      return {
        body: body.map((x) => ({type: x}))
      }
    }

    let sut = autils.creepMatchesPlan

    it("1/1/1 Creep and 1/1/min -> Matches", () => {
      let plan = { work: {min:1}, carry: {min:1}, move:'min'}
      let creep = makeCreep([WORK, CARRY, MOVE]);

      let result = sut(creep, plan);

      expect(result).to.be.true;
    });

    it("2/1/1 Creep and 1-1/1/min -> Doesnt Match", () => {
      let plan = { work: {min:1, max:1}, carry: {min:1}, move:'min'}
      let creep = makeCreep([WORK, WORK, CARRY, MOVE]);

      let result = sut(creep, plan);

      expect(result).to.be.false;
    });

    it("2/2/2 Creep and 2/2/road -> Matches", () => {
      let plan = { work: {min:2}, carry: {min:2}, move:'road'}
      let creep = makeCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE]);

      let result = sut(creep, plan);

      expect(result).to.be.true;
    });

  });

});
