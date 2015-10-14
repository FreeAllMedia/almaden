"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libDatabaseJs = require("../../lib/database.js");

var _libDatabaseJs2 = _interopRequireDefault(_libDatabaseJs);

var databaseConfig = require("../../../database.json").testing;

var userFixtures = require("../fixtures/users.json");

describe(".update(data)", function () {

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
      database.mock.update({
        name: fixture.name,
        age: fixture.age
      }).into(tableName).where("id", fixture.id).results(1);
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
    database.update({
      name: fixture.name,
      age: fixture.age
    }).should.be.instanceOf(_libDatabaseJs.Query);
  });

  it("should be able to set the table name", function () {
    database.update({
      name: fixture.name,
      age: fixture.age
    }).into(tableName).should.be.instanceOf(_libDatabaseJs.Query);
  });

  it("should update into the designated table", function (done) {
    database.update({
      name: fixture.name,
      age: fixture.age
    }).into(tableName).where("id", fixture.id).results(function (error, rowsAffected) {
      if (error) {
        throw error;
      }
      rowsAffected.should.eql(1);
      done();
    });
  });
});