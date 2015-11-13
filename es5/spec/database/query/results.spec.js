"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libDatabaseJs = require("../../../lib/database.js");

var _libDatabaseJs2 = _interopRequireDefault(_libDatabaseJs);

var databaseConfig = require("../../../../database.json").testing;

describe("query.results(callback)", function () {

	var database = undefined;
	var query = undefined;

	beforeEach(function () {
		database = new _libDatabaseJs2["default"](databaseConfig);
		query = database.select("*").from("users");
	});

	it("should return the query", function () {
		query.results(function () {}).should.eql(query);
	});
});