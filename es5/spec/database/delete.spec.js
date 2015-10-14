"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libDatabaseJs = require("../../lib/database.js");

var _libDatabaseJs2 = _interopRequireDefault(_libDatabaseJs);

var databaseConfig = require("../../../database.json").testing;

var userFixtures = require("../fixtures/users.json");

describe(".delete", function () {

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
      database.mock["delete"].from(tableName).where("id", fixture.id).results();
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
    database["delete"].should.be.instanceOf(_libDatabaseJs.Query);
  });

  it("should be able to set the table name", function () {
    database["delete"].from(tableName).should.be.instanceOf(_libDatabaseJs.Query);
  });

  it("should delete from the designated table", function (done) {
    database["delete"].from(tableName).where("id", fixture.id).results(function (error) {
      if (error) {
        throw error;
      }
      done();
    });
  });
});