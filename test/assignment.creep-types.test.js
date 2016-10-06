'use strict'
// import constants into global scope
require('./screeps.constants');

const expect = require('chai').expect;
const assCreepTypes = require('../dist/assignment.creep-types');

describe("Assignment Creep Types", () => {
  function countParts(arr, partName) {
    return arr.filter((val) => val === partName).length;
  }

  describe("get body plan", () => {
    let sut = assCreepTypes.getBodyPlan

    it("Empty Plan -> Empty result", () => {
      let plan = {}

      let result = sut(plan, 300)

      expect(result.length).to.equal(0);
    });

    it("simple 1/1/1 creep -> returns creep", () => {
      let plan = {
        work:  {min: 1},
        carry: {min: 1},
        move:  'min'
      }

      let result = sut(plan, 300)
      let works = result.filter((val) => val === WORK);

      expect(result.length).to.equal(3);
      expect(result).to.contain(MOVE);
      expect(result).to.contain(WORK);
      expect(result).to.contain(CARRY);
    })

    it("simple 1-2/1/1 creep -> returns creep with 2 work", () => {
      let plan = {
        work:  {min: 1, max:2},
        carry: {min: 1},
        move:  'min'
      }

      let result = sut(plan, 300)
      let workCount = countParts(result, WORK);

      expect(result.length).to.equal(4);
      expect(workCount).to.equal(2);
    })

    it("2/2/full creep -> has 4 moves", () => {
      let plan = {
        work:  {min: 2},
        carry: {min: 2},
        move:  'full'
      }

      let result = sut(plan, 1000)
      let moveCount = countParts(result, MOVE);

      expect(result.length).to.equal(8);
      expect(moveCount).to.equal(4);
    });

    it("Can't build creep => returns empty", () => {
      let plan = {
        work:  {min: 2}, //
        carry: {min: 2}, // cost = ~350
        move:  'min'
      }

      let result = sut(plan, 150)

      expect(result.length).to.equal(0);
    });

  });

});
