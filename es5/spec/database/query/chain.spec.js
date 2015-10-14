"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libDatabaseJs = require("../../../lib/database.js");

var _libDatabaseJs2 = _interopRequireDefault(_libDatabaseJs);

var databaseConfig = require("../../../../database.json").testing;

describe(".chain", function () {

  var database = undefined;

  beforeEach(function () {
    database = new _libDatabaseJs2["default"](databaseConfig);
  });

  it("should return an array of chain links from the query", function () {
    database.select("*").from("users").chain.should.eql([{ name: "select", options: ["*"] }, { name: "from", options: ["users"] }]);
  });
});