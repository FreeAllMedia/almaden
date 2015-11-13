"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libDatabaseJs = require("../../lib/database.js");

var _libDatabaseJs2 = _interopRequireDefault(_libDatabaseJs);

var databaseConfig = require("../../../database.json").testing;

describe(".mock.where(...options)", function () {
	var database = undefined,
	    mockUsers = undefined;

	beforeEach(function () {
		database = new _libDatabaseJs2["default"](databaseConfig);
		mockUsers = [{ id: 1, name: "Bob" }];
	});

	it("should treat where equals to andWhere", function (done) {
		var name = "aName";

		database.mock.select("*").from("users").where("created_at", ">", /.*/).where("name", name).results(mockUsers);

		database.select("*").from("users").where("created_at", ">", "2015-10-02 21:39:14").andWhere("name", name).results(function (error, rows) {
			if (error) {
				throw error;
			}
			rows.should.eql(mockUsers);
			done();
		});
	});

	it("should use equals as the default operator", function (done) {
		database.mock.select("*").from("users").where("id", 1).results(mockUsers);

		database.select("*").from("users").where("id", "=", 1).results(function (error, rows) {
			if (error) {
				throw error;
			}
			rows.should.eql(mockUsers);
			done();
		});
	});
});