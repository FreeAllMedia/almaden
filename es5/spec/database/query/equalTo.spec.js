"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libDatabaseJs = require("../../../lib/database.js");

var _libDatabaseJs2 = _interopRequireDefault(_libDatabaseJs);

var databaseConfig = require("../../../../database.json").testing;

describe(".equalTo(query)", function () {

  var database = undefined,
      mockUsers = undefined;

  beforeEach(function () {
    database = new _libDatabaseJs2["default"](databaseConfig);
    mockUsers = [{ id: 1, name: "Bob" }];
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

  describe("(where)", function () {
    it("should treat where equals to andWhere", function (done) {
      var name = "aName";

      database.mock.select(/.*/).from(/u.*rs/).where("created_at", ">", /.*/).where("name", name).results(mockUsers);

      database.select("id").from("users").where("created_at", ">", "2015-10-02 21:39:14").andWhere("name", name).results(function (error, rows) {
        if (error) {
          throw error;
        }
        rows.should.eql(mockUsers);
        done();
      });
    });

    it("should use equals as the default operator", function (done) {
      database.mock.select(/.*/).from(/u.*rs/).where("id", 1).results(mockUsers);

      database.select("id").from("users").where("id", "=", 1).results(function (error, rows) {
        if (error) {
          throw error;
        }
        rows.should.eql(mockUsers);
        done();
      });
    });
  });

  it("should compare complex queries that are equal and return true");
  it("should compare complex queries that are not equal and return false");
});