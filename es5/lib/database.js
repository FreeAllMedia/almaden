"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var knex = require("knex");
var async = require("flowsync");

var privateData = new WeakMap();

var internal = function internal(object) {
	if (!privateData.has(object)) {
		privateData.set(object, {});
	}
	return privateData.get(object);
};

var Database = (function () {
	function Database(databaseConfig) {
		_classCallCheck(this, Database);

		internal(this)._knex = knex(databaseConfig);

		internal(this)._query = this.getKnex();
		internal(this)._mockQueries = undefined;
	}

	_createClass(Database, [{
		key: "getKnex",
		value: function getKnex() {
			return internal(this)._knex;
		}
	}, {
		key: "getMockQueries",
		value: function getMockQueries() {
			return internal(this)._mockQueries;
		}
	}, {
		key: "close",
		value: function close(callback) {
			internal(this)._knex.destroy(callback);
		}
	}, {
		key: "spy",
		value: function spy(query, returnValue) {
			if (!internal(this)._mockQueries) {
				internal(this)._mockQueries = {};
			}
			var querySpy = new QuerySpy(query, returnValue);
			internal(this)._mockQueries[query] = querySpy;
			return querySpy;
		}
	}, {
		key: "mock",
		value: function mock(queryValueMatrix) {
			internal(this)._mockQueries = queryValueMatrix;
		}
	}, {
		key: "unmock",
		value: function unmock() {
			internal(this)._mockQueries = undefined;
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

			async.series(databaseSetupSteps, callback);
		}
	}, {
		key: "results",
		value: function results() {
			throw new Error("Cannot perform query without valid query stack. See docs for proper usage.");
		}
	}]);

	return Database;
})();

exports["default"] = Database;

var Query = (function () {
	function Query(database) {
		_classCallCheck(this, Query);

		internal(this)._database = database;
		internal(this)._knex = database.getKnex();
	}

	_createClass(Query, [{
		key: "select",
		value: function select() {
			var _internal$_knex;

			internal(this)._query = (_internal$_knex = internal(this)._knex).select.apply(_internal$_knex, arguments);
			return this;
		}
	}, {
		key: "count",
		value: function count() {
			var _internal$_knex2;

			internal(this)._query = (_internal$_knex2 = internal(this)._knex).count.apply(_internal$_knex2, arguments);
			return this;
		}
	}, {
		key: "insert",
		value: function insert(data) {
			internal(this)._query = internal(this)._knex.insert(data);
			return this;
		}
	}, {
		key: "update",
		value: function update(data) {
			internal(this)._query = internal(this)._knex.update(data);
			return this;
		}
	}, {
		key: "delete",
		value: function _delete() {
			internal(this)._query = internal(this)._knex["delete"]();
			return this;
		}
	}, {
		key: "from",
		value: function from(tableName) {
			if (internal(this)._query) {
				internal(this)._query = internal(this)._query.from(tableName);
			} else {
				internal(this)._query = internal(this)._knex(tableName);
			}
			return this;
		}
	}, {
		key: "where",
		value: function where() {
			var _internal$_query;

			internal(this)._query = (_internal$_query = internal(this)._query).where.apply(_internal$_query, arguments);
			return this;
		}
	}, {
		key: "andWhere",
		value: function andWhere() {
			var _internal$_query2;

			internal(this)._query = (_internal$_query2 = internal(this)._query).andWhere.apply(_internal$_query2, arguments);
			return this;
		}
	}, {
		key: "whereNull",
		value: function whereNull() {
			var _internal$_query3;

			internal(this)._query = (_internal$_query3 = internal(this)._query).whereNull.apply(_internal$_query3, arguments);
			return this;
		}
	}, {
		key: "whereNotNull",
		value: function whereNotNull() {
			var _internal$_query4;

			internal(this)._query = (_internal$_query4 = internal(this)._query).whereNotNull.apply(_internal$_query4, arguments);
			return this;
		}
	}, {
		key: "orWhere",
		value: function orWhere() {
			var _internal$_query5;

			internal(this)._query = (_internal$_query5 = internal(this)._query).orWhere.apply(_internal$_query5, arguments);
			return this;
		}
	}, {
		key: "groupBy",
		value: function groupBy() {
			var _internal$_query6;

			internal(this)._query = (_internal$_query6 = internal(this)._query).groupBy.apply(_internal$_query6, arguments);
			return this;
		}
	}, {
		key: "orderBy",
		value: function orderBy(column, direction) {
			internal(this)._query = internal(this)._query.orderBy(column, direction);
			return this;
		}
	}, {
		key: "limit",
		value: function limit(number) {
			internal(this)._query = internal(this)._query.limit(number);
			return this;
		}
	}, {
		key: "leftJoin",
		value: function leftJoin() {
			var _internal$_query7;

			internal(this)._query = (_internal$_query7 = internal(this)._query).leftJoin.apply(_internal$_query7, arguments);
			return this;
		}
	}, {
		key: "into",
		value: function into(tableName) {
			internal(this)._query = internal(this)._query.into(tableName);
			return this;
		}
	}, {
		key: "dropTable",
		value: function dropTable(tableName) {
			internal(this)._query = internal(this)._knex.schema.dropTable(tableName);
			return this;
		}
	}, {
		key: "createTable",
		value: function createTable(tableName, tableConstructor) {
			internal(this)._query = internal(this)._knex.schema.createTable(tableName, tableConstructor);
			return this;
		}
	}, {
		key: "toString",
		value: function toString() {
			return internal(this)._query.toString();
		}
	}, {
		key: "results",
		value: function results(callback) {
			var _this2 = this;

			if (internal(this)._query.exec) {
				var mockQueries = internal(this)._database.getMockQueries();
				if (mockQueries !== undefined) {
					var _ret2 = (function () {
						var query = internal(_this2)._query.toString();
						internal(_this2)._query = null;

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
									var _results = mockQueries[key];

									if (query.match(regularExpression)) {
										if (_results instanceof Error) {
											return {
												v: callback(_results, null)
											};
										} else if (_results instanceof QuerySpy) {
											return {
												v: callback(null, _results.call)
											};
										} else {
											return {
												v: callback(null, _results)
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
					internal(this)._query.exec(function (errors, rows) {
						internal(_this2)._query = null;
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

	internal(this)._calls = 0;
	internal(this)._query = query;
	internal(this)._value = value;

	//public properties
	Object.defineProperties(this, {
		"callCount": {
			get: function get() {
				return internal(_this3)._calls;
			}
		},
		"call": {
			get: function get() {
				internal(_this3)._calls += 1;
				return internal(_this3)._value;
			}
		}
	});
};

exports.QuerySpy = QuerySpy;