"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libDatabaseJs = require("../../lib/database.js");

var _libDatabaseJs2 = _interopRequireDefault(_libDatabaseJs);

var databaseConfig = require("../../../database.json").testing;

describe(".mock.select(...options)", function () {

  var database = undefined,
      mockUsers = undefined;

  beforeEach(function () {
    database = new _libDatabaseJs2["default"](databaseConfig);
    mockUsers = [{ id: 1, name: "Bob" }];
  });

  it("should return an instance of Query", function () {
    database.mock.select("*").should.be.instanceOf(_libDatabaseJs.Query);
  });

  it("should be able to set the table name", function () {
    database.mock.select("*").from("users").should.be.instanceOf(_libDatabaseJs.Query);
  });

  it("should be able to set mock results", function () {
    database.mock.select("*").from("users").results(mockUsers);
  });

  it("should return mock results on identical subsequent queries", function (done) {
    database.mock.select("*").from("users").results(mockUsers);

    database.select("*").from("users").results(function (error, rows) {
      if (error) {
        throw error;
      }
      rows.should.eql(mockUsers);
      done();
    });
  });

  it("should return mock results for pattern-matched queries", function (done) {
    database.mock.select(/.*/).from(/u.*rs/).where("created_at", ">", /.*/).results(mockUsers);

    database.select("id").from("users").where("created_at", ">", "2015-10-02 21:39:14").results(function (error, rows) {
      if (error) {
        throw error;
      }
      rows.should.eql(mockUsers);
      done();
    });
  });
});