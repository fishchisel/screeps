'use strict'
const expect = require('chai').expect;
const mineUtils = require('../dist/mine.utils');
const mocks = require('./screeps-mocks');

let Source = mocks.Source;

describe("Mine Utils", () => {

  describe("Find Container Pos For Source", () => {
    let sut = mineUtils.findContainerPosForSource;

    it("Middle source -> should find container", () => {
      let src = new Source(24,24);

      let result = sut(src);

      expect(result.x).to.equal(22);
      expect(result.y).to.equal(22);

    });

  });

});
