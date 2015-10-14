"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libDatabaseJs = require("../../../lib/database.js");

var _libDatabaseJs2 = _interopRequireDefault(_libDatabaseJs);

var databaseConfig = require("../../../../database.json").testing;

describe(".equalTo(query)", function () {

  var database = undefined;

  beforeEach(function () {
    database = new _libDatabaseJs2["default"](databaseConfig);
  });

  it("should compare simple queries that are equal and return true", function () {
    var queryA = database.select("*").from("users");
    var queryB = database.select("*").from("users");

    queryA.equalTo(queryB).should.be["true"];
  });
  it("should compare simple queries that are not equal and return false", function () {
    var queryA = database.select("*").from("users");
    var queryB = database.select("*").from("trucks");

    queryA.equalTo(queryB).should.be["false"];
  });

  it("should compare complex queries that are equal and return true");
  it("should compare complex queries that are not equal and return false");
});