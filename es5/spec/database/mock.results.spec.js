"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libDatabaseJs = require("../../lib/database.js");

var _libDatabaseJs2 = _interopRequireDefault(_libDatabaseJs);

var databaseConfig = require("../../../database.json").testing;

describe(".mock.results(mockResults)", function () {
	var database = undefined;

	beforeEach(function () {
		database = new _libDatabaseJs2["default"](databaseConfig);
	});

	it("should return the mock query", function () {
		var mockQuery = database.mock;
		mockQuery.select("*").from("users").should.equal(mockQuery);
	});

	it("should increment the call count when subsequent matching queries are executed", function (done) {
		var user = {
			id: "cigyn1qip0000nxz84cv3bwu6",
			name: "Bob"
		};

		var mockQuery = database.mock.select("*").from("users").results(user);

		database.select("*").from("users").results(function () {
			mockQuery.called.should.be["true"];
			done();
		});
	});
});