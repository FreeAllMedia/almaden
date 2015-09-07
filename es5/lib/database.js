"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _knex = require("knex");

var _knex2 = _interopRequireDefault(_knex);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var Database = (function () {
	function Database(databaseConfig) {
		_classCallCheck(this, Database);

		var _ = (0, _incognito2["default"])(this);

		_.config = databaseConfig;

		_.knex = (0, _knex2["default"])(databaseConfig);

		this.mockQueries = undefined;
	}

	_createClass(Database, [{
		key: "close",
		value: function close(callback) {
			(0, _incognito2["default"])(this).knex.destroy(callback);
		}
	}, {
		key: "addMock",
		value: function addMock(query, returnValue) {
			if (!this.mockQueries) {
				this.mockQueries = {};
			}
			this.mockQueries[query] = returnValue;
		}
	}, {
		key: "spy",
		value: function spy(query, returnValue) {
			if (!this.mockQueries) {
				this.mockQueries = {};
			}
			var querySpy = new QuerySpy(query, returnValue);
			this.mockQueries[query] = querySpy;
			return querySpy;
		}
	}, {
		key: "mock",
		value: function mock(queryValueMatrix) {
			this.mockQueries = queryValueMatrix;
		}
	}, {
		key: "unmock",
		value: function unmock() {
			this.mockQueries = undefined;
		}
	}, {
		key: "select",
		value: function select() {
			var query = new Query(this);
			return query.select.apply(query, arguments);
		}
	}, {
		key: "insert",
		value: function insert(data) {
			var query = new Query(this);
			return query.insert(data);
		}
	}, {
		key: "update",
		value: function update(data) {
			var query = new Query(this);
			return query.update(data);
		}
	}, {
		key: "delete",
		value: function _delete() {
			var query = new Query(this);
			return query["delete"]();
		}
	}, {
		key: "count",
		value: function count() {
			var query = new Query(this);
			return query.count.apply(query, arguments);
		}
	}, {
		key: "dropTable",
		value: function dropTable(tableName) {
			var query = new Query(this);
			return query.dropTable(tableName);
		}
	}, {
		key: "createTable",
		value: function createTable(tableName, tableConstructor) {
			var query = new Query(this);
			return query.createTable(tableName, tableConstructor);
		}
	}, {
		key: "createDatabase",
		value: function createDatabase(databaseName) {
			var query = new Query(this);
			return query.createDatabase(databaseName);
		}
	}, {
		key: "load",
		value: function load(fixtures, callback) {
			var _this = this;

			var databaseSetupSteps = [];

			var _loop = function (tableName) {
				var fixtureData = fixtures[tableName];

				databaseSetupSteps.push(function (done) {
					_this.dropTable(tableName).results(function (error, rows) {
						if (error) {
							throw error;
						}
						done();
					});
				});

				databaseSetupSteps.push(function (done) {
					_this.createTable(tableName, function (table) {
						table.increments();

						var firstFixtureData = fixtureData[0];

						for (var fixtureProperty in firstFixtureData) {
							if (fixtureProperty !== "id") {
								var fixtureValue = firstFixtureData[fixtureProperty];

								if (isNaN(fixtureValue)) {
									table.string(fixtureProperty);
								} else {
									table.integer(fixtureProperty);
								}
							}
						}
					}).results(function (error, rows) {
						if (error) {
							throw error;
						}
						done();
					});
				});

				databaseSetupSteps.push(function (done) {
					fixtureData.forEach(function (rowData) {
						_this.insert(rowData).into(tableName).results(function (error, rows) {
							if (error) {
								throw error;
							}
							done();
						});
					});
				});
			};

			for (var tableName in fixtures) {
				_loop(tableName);
			}

			_flowsync2["default"].series(databaseSetupSteps, callback);
		}
	}, {
		key: "results",
		value: function results() {
			throw new Error("Cannot perform query without valid query stack. See docs for proper usage.");
		}
	}, {
		key: "config",
		get: function get() {
			return (0, _incognito2["default"])(this).config;
		}
	}]);

	return Database;
})();

exports["default"] = Database;

var Query = (function () {
	function Query(database) {
		_classCallCheck(this, Query);

		(0, _incognito2["default"])(this).database = database;
		(0, _incognito2["default"])(this).knex = (0, _incognito2["default"])(database).knex;
	}

	_createClass(Query, [{
		key: "select",
		value: function select() {
			var _privateData$knex;

			(0, _incognito2["default"])(this).query = (_privateData$knex = (0, _incognito2["default"])(this).knex).select.apply(_privateData$knex, arguments);
			return this;
		}
	}, {
		key: "count",
		value: function count() {
			var _privateData$knex2;

			(0, _incognito2["default"])(this).query = (_privateData$knex2 = (0, _incognito2["default"])(this).knex).count.apply(_privateData$knex2, arguments);
			return this;
		}
	}, {
		key: "insert",
		value: function insert(data) {
			(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).knex.insert(data);
			return this;
		}
	}, {
		key: "update",
		value: function update(data) {
			(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).knex.update(data);
			return this;
		}
	}, {
		key: "delete",
		value: function _delete() {
			(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).knex["delete"]();
			return this;
		}
	}, {
		key: "from",
		value: function from(tableName) {
			if ((0, _incognito2["default"])(this).query) {
				(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).query.from(tableName);
			} else {
				(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).knex(tableName);
			}
			return this;
		}
	}, {
		key: "where",
		value: function where() {
			var _privateData$query;

			(0, _incognito2["default"])(this).query = (_privateData$query = (0, _incognito2["default"])(this).query).where.apply(_privateData$query, arguments);
			return this;
		}
	}, {
		key: "andWhere",
		value: function andWhere() {
			var _privateData$query2;

			(0, _incognito2["default"])(this).query = (_privateData$query2 = (0, _incognito2["default"])(this).query).andWhere.apply(_privateData$query2, arguments);
			return this;
		}
	}, {
		key: "whereNull",
		value: function whereNull() {
			var _privateData$query3;

			(0, _incognito2["default"])(this).query = (_privateData$query3 = (0, _incognito2["default"])(this).query).whereNull.apply(_privateData$query3, arguments);
			return this;
		}
	}, {
		key: "whereNotNull",
		value: function whereNotNull() {
			var _privateData$query4;

			(0, _incognito2["default"])(this).query = (_privateData$query4 = (0, _incognito2["default"])(this).query).whereNotNull.apply(_privateData$query4, arguments);
			return this;
		}
	}, {
		key: "orWhere",
		value: function orWhere() {
			var _privateData$query5;

			(0, _incognito2["default"])(this).query = (_privateData$query5 = (0, _incognito2["default"])(this).query).orWhere.apply(_privateData$query5, arguments);
			return this;
		}
	}, {
		key: "groupBy",
		value: function groupBy() {
			var _privateData$query6;

			(0, _incognito2["default"])(this).query = (_privateData$query6 = (0, _incognito2["default"])(this).query).groupBy.apply(_privateData$query6, arguments);
			return this;
		}
	}, {
		key: "orderBy",
		value: function orderBy(column, direction) {
			(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).query.orderBy(column, direction);
			return this;
		}
	}, {
		key: "limit",
		value: function limit(number) {
			(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).query.limit(number);
			return this;
		}
	}, {
		key: "leftJoin",
		value: function leftJoin() {
			var _privateData$query7;

			(0, _incognito2["default"])(this).query = (_privateData$query7 = (0, _incognito2["default"])(this).query).leftJoin.apply(_privateData$query7, arguments);
			return this;
		}
	}, {
		key: "into",
		value: function into(tableName) {
			(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).query.into(tableName);
			return this;
		}
	}, {
		key: "dropTable",
		value: function dropTable(tableName) {
			(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).knex.schema.dropTable(tableName);
			return this;
		}
	}, {
		key: "createTable",
		value: function createTable(tableName, tableConstructor) {
			(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).knex.schema.createTable(tableName, tableConstructor);
			return this;
		}
	}, {
		key: "createDatabase",
		value: function createDatabase(databaseName) {
			(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).knex.raw("create database " + databaseName);
			return this;
		}
	}, {
		key: "toString",
		value: function toString() {
			return (0, _incognito2["default"])(this).query.toString();
		}
	}, {
		key: "results",
		value: function results(callback) {
			var _this2 = this;

			if ((0, _incognito2["default"])(this).query.exec) {
				var mockQueries = (0, _incognito2["default"])(this).database.mockQueries;
				if (mockQueries !== undefined) {
					var _ret2 = (function () {
						var query = (0, _incognito2["default"])(_this2).query.toString();
						(0, _incognito2["default"])(_this2).query = null;

						/* Check if string and has results */
						var results = mockQueries[query];

						if (results) {
							if (results instanceof Error) {
								callback(results, null);
							} else if (results instanceof QuerySpy) {
								callback(null, results.call);
							} else {
								callback(null, results);
							}
						} else if (typeof mockQueries === "function") {
							mockQueries(query, function (error, result) {
								if (!error && !result) {
									throw new Error("No mock values available for: \"" + query + "\"", null);
								} else {
									callback(error, result);
								}
							});
						} else {
							for (var key in mockQueries) {
								if (key.charAt && key.charAt(0) === "/") {
									var regularExpressionString = key.substr(1).substr(0, key.length - 2);
									var regularExpression = new RegExp(regularExpressionString);
									var queryResults = mockQueries[key];

									if (query.match(regularExpression)) {
										if (queryResults instanceof Error) {
											return {
												v: callback(queryResults, null)
											};
										} else if (queryResults instanceof QuerySpy) {
											return {
												v: callback(null, queryResults.call)
											};
										} else {
											return {
												v: callback(null, queryResults)
											};
										}
									}
								}
							}

							throw new Error("No mock values available for: \"" + query + "\"", null);
						}
					})();

					if (typeof _ret2 === "object") return _ret2.v;
				} else {
					(0, _incognito2["default"])(this).query.exec(function (errors, rows) {
						(0, _incognito2["default"])(_this2).query = null;
						callback(errors, rows);
					});
				}
			} else {
				throw new Error("Cannot perform query without valid query stack. See docs for proper usage.");
			}
		}
	}]);

	return Query;
})();

exports.Query = Query;

var QuerySpy = function QuerySpy(query, value) {
	var _this3 = this;

	_classCallCheck(this, QuerySpy);

	(0, _incognito2["default"])(this).calls = 0;
	(0, _incognito2["default"])(this).query = query;
	(0, _incognito2["default"])(this).value = value;

	//public properties
	Object.defineProperties(this, {
		"callCount": {
			get: function get() {
				return (0, _incognito2["default"])(_this3).calls;
			}
		},
		"call": {
			get: function get() {
				(0, _incognito2["default"])(_this3).calls += 1;
				return (0, _incognito2["default"])(_this3).value;
			}
		}
	});
};

exports.QuerySpy = QuerySpy;