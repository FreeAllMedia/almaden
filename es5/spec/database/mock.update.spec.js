"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libDatabaseJs = require("../../lib/database.js");

var _libDatabaseJs2 = _interopRequireDefault(_libDatabaseJs);

var databaseConfig = require("../../../database.json").testing;

describe(".mock.update(...options)", function () {

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
    database.mock.update(mockData).should.be.instanceOf(_libDatabaseJs.Query);
  });

  it("should return mock results on identical subsequent queries", function (done) {
    var mockRowsAffected = 1;

    database.mock.update(mockData).into("users").where("id", 1).results(mockRowsAffected);

    database.update(mockData).into("users").where("id", 1).results(function (error, newId) {
      if (error) {
        throw error;
      }
      newId.should.eql(mockRowsAffected);
      done();
    });
  });

  it("should return mock results for pattern-matched queries", function (done) {
    var mockRowsAffected = 1;

    database.mock.update(mockData).into(/u.*rs/).where("id", 1).results(mockRowsAffected);

    database.update(mockData).into("users").where("id", 1).results(function (error, newId) {
      if (error) {
        throw error;
      }
      newId.should.eql(mockRowsAffected);
      done();
    });
  });
});