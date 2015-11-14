"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libDatabaseJs = require("../../lib/database.js");

var _libDatabaseJs2 = _interopRequireDefault(_libDatabaseJs);

var _libMockQueryJs = require("../../lib/mockQuery.js");

var _libMockQueryJs2 = _interopRequireDefault(_libMockQueryJs);

var databaseConfig = require("../../../database.json").testing;

describe(".mock", function () {
  var database = undefined;

  beforeEach(function () {
    database = new _libDatabaseJs2["default"](databaseConfig);
  });

  it("should return an instance of MockQuery", function () {
    database.mock.should.be.instanceOf(_libMockQueryJs2["default"]);
  });
});