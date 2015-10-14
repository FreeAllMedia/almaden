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

  it("should compare simple queries with object parameters that are equal and return true", function () {
    var data = {
      name: "Bob",
      age: 46
    };

    var queryA = database.insert(data).into("users");
    var queryB = database.insert(data).into("users");

    queryA.equalTo(queryB).should.be["true"];
  });
  it("should compare simple queries with object parameters that are not equal and return false", function () {
    var dataA = {
      name: "Bob",
      age: 46
    };

    var dataB = {
      name: "Linda",
      age: 42
    };

    var queryA = database.insert(dataA).into("users");
    var queryB = database.insert(dataB).into("users");

    queryA.equalTo(queryB).should.be["false"];
  });

  it("should compare simple queries with regex object parameters that match and return true", function () {
    var data = {
      name: "Bob",
      age: 46
    };

    var queryA = database.insert(data).into("users");
    var queryB = database.insert({
      name: /B.b/,
      age: /[0-9]*/
    }).into("users");

    queryA.equalTo(queryB).should.be["true"];
  });
  it("should compare simple queries with regex object parameters that do not match and return false", function () {
    var data = {
      name: "Bob",
      age: 46
    };

    var queryA = database.insert(data).into("users");
    var queryB = database.insert({
      name: /L.*a/,
      age: /[a-zA-Z]*/
    }).into("users");

    queryA.equalTo(queryB).should.be["false"];
  });

  it("should compare complex queries that are equal and return true");
  it("should compare complex queries that are not equal and return false");
});