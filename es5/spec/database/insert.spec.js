"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libDatabaseJs = require("../../lib/database.js");

var _libDatabaseJs2 = _interopRequireDefault(_libDatabaseJs);

var databaseConfig = require("../../../database.json").testing;

var userFixtures = require("../fixtures/users.json");

describe(".insert(data)", function () {

  var database = undefined,
      tableName = undefined,
      fixture = undefined,
      fixtures = undefined;

  beforeEach(function (done) {
    database = new _libDatabaseJs2["default"](databaseConfig);
    tableName = "users";

    fixtures = userFixtures;
    fixture = fixtures[0];

    if (databaseConfig.useMocking) {
      database.mock.insert({
        name: fixture.name,
        age: fixture.age
      }).into(tableName).results(fixture.id);
      done();
    } else {
      database.load({
        users: fixtures
      }, done);
    }
  });

  afterEach(function (done) {
    database.close(done);
  });

  it("should return an instance of Query", function () {
    database.insert({
      name: fixture.name,
      age: fixture.age
    }).should.be.instanceOf(_libDatabaseJs.Query);
  });

  it("should be able to set the table name", function () {
    database.insert({
      name: fixture.name,
      age: fixture.age
    }).into(tableName).should.be.instanceOf(_libDatabaseJs.Query);
  });

  it("should insert into the designated table", function (done) {
    database.insert({
      name: fixture.name,
      age: fixture.age
    }).into(tableName).results(function (error, newId) {
      if (error) {
        throw error;
      }
      newId.should.eql([fixtures.length + 1]);
      done();
    });
  });
});