"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libDatabaseJs = require("../../lib/database.js");

var _libDatabaseJs2 = _interopRequireDefault(_libDatabaseJs);

var databaseConfig = require("../../../database.json").testing;

describe(".mock.delete(...options)", function () {

  var database = undefined;

  beforeEach(function () {
    database = new _libDatabaseJs2["default"](databaseConfig);
  });

  it("should return an instance of Query", function () {
    database.mock["delete"].should.be.instanceOf(_libDatabaseJs.Query);
  });

  it("should return mock results on identical subsequent queries", function (done) {
    database.mock["delete"].from("users").where("id", 1).results();

    database["delete"].from("users").where("id", 1).results(function (error) {
      if (error) {
        throw error;
      }
      done();
    });
  });

  it("should return mock results for pattern-matched queries", function (done) {
    database.mock["delete"].from(/u.*rs/).where("id", 1).results();

    database["delete"].from("users").where("id", 1).results(function (error) {
      if (error) {
        throw error;
      }
      done();
    });
  });
});