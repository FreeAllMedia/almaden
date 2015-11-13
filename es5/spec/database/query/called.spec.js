"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _ = require("../../../../");

var _2 = _interopRequireDefault(_);

var _databaseJson = require("../../../../database.json");

describe("query.called", function () {
		var database = undefined,
		    insertData = undefined,
		    tableName = undefined,
		    query = undefined,
		    id = undefined;

		beforeEach(function () {
				database = new _2["default"](_databaseJson.testing);

				id = 1;

				insertData = {
						name: "Bob"
				};

				tableName = "users";

				query = database.insert(insertData).into(tableName);

				database.mock.insert(insertData).into(tableName).results(id);
		});

		it("should return true if the query was executed", function (done) {
				query.results(function (error) {
						query.called.should.be["true"];
						done(error);
				});
		});

		it("should return false if the query was not executed", function () {
				query.called.should.be["false"];
		});
});