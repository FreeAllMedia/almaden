"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libDatabaseJs = require("../../lib/database.js");

var _libDatabaseJs2 = _interopRequireDefault(_libDatabaseJs);

var databaseConfig = require("../../../database.json").testing;

var userFixtures = require("../fixtures/users.json");

describe(".select(...columnNames)", function () {

  var database = undefined,
      columnNames = undefined,
      tableName = undefined,
      fixtures = undefined;

  beforeEach(function (done) {
    database = new _libDatabaseJs2["default"](databaseConfig);
    columnNames = "*";
    tableName = "users";

    fixtures = [// Sorted by id by default
    userFixtures[1], userFixtures[2], userFixtures[3], userFixtures[4], userFixtures[0]];

    if (databaseConfig.useMocking) {
      database.mock.select(columnNames).from(tableName).results(fixtures);
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
    database.select(columnNames).should.be.instanceOf(_libDatabaseJs.Query);
  });

  it("should be able to set the table name", function () {
    database.select(columnNames).from(tableName).should.be.instanceOf(_libDatabaseJs.Query);
  });

  it("should select from the designated table", function (done) {
    database.select(columnNames).from(tableName).results(function (error, rows) {
      if (error) {
        throw error;
      }
      rows.should.eql(fixtures);
      done();
    });
  });
});