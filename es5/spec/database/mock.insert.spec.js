"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libDatabaseJs = require("../../lib/database.js");

var _libDatabaseJs2 = _interopRequireDefault(_libDatabaseJs);

var databaseConfig = require("../../../database.json").testing;

describe(".mock.insert(...options)", function () {

  var database = undefined,
      mockData = undefined;

  beforeEach(function () {
    database = new _libDatabaseJs2["default"](databaseConfig);
    mockData = {
      name: "Bob",
      age: 46
    };
  });

  it("should return an instance of Query", function () {
    database.mock.insert(mockData).should.be.instanceOf(_libDatabaseJs.Query);
  });

  it("should return mock results on identical subsequent queries", function (done) {
    var mockNewId = 1;

    database.mock.insert(mockData).into("users").results(mockNewId);

    database.insert(mockData).into("users").results(function (error, newId) {
      if (error) {
        throw error;
      }
      newId.should.eql(mockNewId);
      done();
    });
  });

  it("should return mock results for pattern-matched queries", function (done) {
    var mockNewId = 1;

    database.mock.insert(mockData).into(/u.*rs/).results(mockNewId);

    database.insert(mockData).into("users").results(function (error, newId) {
      if (error) {
        throw error;
      }
      newId.should.eql(mockNewId);
      done();
    });
  });
});