"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var knex = require("knex");
var async = require("flowsync");

var Database = (function () {
	function Database(databaseConfig) {
		var _this = this;

		_classCallCheck(this, Database);

		["_knex", "_query", "_mockQueries"].forEach(function (privatePropertyName) {
			Object.defineProperty(_this, privatePropertyName, {
				writable: true,
				value: undefined,
				enumerable: false
			});
		});

		this._knex = knex(databaseConfig);
		this._query = this._knex;
		this._mockQueries = undefined;
	}

	_createClass(Database, [{
		key: "close",
		value: function close(callback) {
			this._knex.destroy(callback);
		}
	}, {
		key: "spy",
		value: function spy(query, returnValue) {
			if (!this._mockQueries) {
				this._mockQueries = {};
			}
			var querySpy = new QuerySpy(query, returnValue);
			this._mockQueries[query] = querySpy;
			return querySpy;
		}
	}, {
		key: "mock",
		value: function mock(queryValueMatrix) {
			this._mockQueries = queryValueMatrix;
		}
	}, {
		key: "unmock",
		value: function unmock() {
			this._mockQueries = undefined;
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
			var _this2 = this;

			var databaseSetupSteps = [];

			var _loop = function (tableName) {
				var fixtureData = fixtures[tableName];

				databaseSetupSteps.push(function (done) {
					_this2.dropTable(tableName).results(function (error, rows) {
						if (error) {
							throw error;
						}
						done();
					});
				});

				databaseSetupSteps.push(function (done) {
					_this2.createTable(tableName, function (table) {
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
						_this2.insert(rowData).into(tableName).results(function (error, rows) {
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

		this._database = database;
		this._knex = database._knex;
	}

	_createClass(Query, [{
		key: "select",
		value: function select() {
			var _knex;

			this._query = (_knex = this._knex).select.apply(_knex, arguments);
			return this;
		}
	}, {
		key: "count",
		value: function count() {
			var _knex2;

			this._query = (_knex2 = this._knex).count.apply(_knex2, arguments);
			return this;
		}
	}, {
		key: "insert",
		value: function insert(data) {
			this._query = this._knex.insert(data);
			return this;
		}
	}, {
		key: "update",
		value: function update(data) {
			this._query = this._knex.update(data);
			return this;
		}
	}, {
		key: "delete",
		value: function _delete() {
			this._query = this._knex["delete"]();
			return this;
		}
	}, {
		key: "from",
		value: function from(tableName) {
			if (this._query) {
				this._query = this._query.from(tableName);
			} else {
				this._query = this._knex(tableName);
			}
			return this;
		}
	}, {
		key: "where",
		value: function where() {
			var _query;

			this._query = (_query = this._query).where.apply(_query, arguments);
			return this;
		}
	}, {
		key: "andWhere",
		value: function andWhere() {
			var _query2;

			this._query = (_query2 = this._query).andWhere.apply(_query2, arguments);
			return this;
		}
	}, {
		key: "whereNull",
		value: function whereNull() {
			var _query3;

			this._query = (_query3 = this._query).whereNull.apply(_query3, arguments);
			return this;
		}
	}, {
		key: "whereNotNull",
		value: function whereNotNull() {
			var _query4;

			this._query = (_query4 = this._query).whereNotNull.apply(_query4, arguments);
			return this;
		}
	}, {
		key: "orWhere",
		value: function orWhere() {
			var _query5;

			this._query = (_query5 = this._query).orWhere.apply(_query5, arguments);
			return this;
		}
	}, {
		key: "groupBy",
		value: function groupBy() {
			var _query6;

			this._query = (_query6 = this._query).groupBy.apply(_query6, arguments);
			return this;
		}
	}, {
		key: "orderBy",
		value: function orderBy(column, direction) {
			this._query = this._query.orderBy(column, direction);
			return this;
		}
	}, {
		key: "limit",
		value: function limit(number) {
			this._query = this._query.limit(number);
			return this;
		}
	}, {
		key: "leftJoin",
		value: function leftJoin() {
			var _query7;

			this._query = (_query7 = this._query).leftJoin.apply(_query7, arguments);
			return this;
		}
	}, {
		key: "into",
		value: function into(tableName) {
			this._query = this._query.into(tableName);
			return this;
		}
	}, {
		key: "dropTable",
		value: function dropTable(tableName) {
			this._query = this._knex.schema.dropTable(tableName);
			return this;
		}
	}, {
		key: "createTable",
		value: function createTable(tableName, tableConstructor) {
			this._query = this._knex.schema.createTable(tableName, tableConstructor);
			return this;
		}
	}, {
		key: "toString",
		value: function toString() {
			return this._query.toString();
		}
	}, {
		key: "results",
		value: function results(callback) {
			var _this3 = this;

			if (this._query.exec) {
				var mockQueries = this._database._mockQueries;
				if (mockQueries !== undefined) {
					var _ret2 = (function () {
						var query = _this3._query.toString();
						_this3._query = null;

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
					this._query.exec(function (errors, rows) {
						_this3._query = null;
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
	var _this4 = this;

	_classCallCheck(this, QuerySpy);

	Object.defineProperties(this, {
		"_calls": {
			enumerable: false,
			writable: true,
			value: 0
		},
		"callCount": {
			get: function get() {
				return _this4._calls;
			}
		},
		"call": {
			get: function get() {
				_this4._calls += 1;
				return _this4._value;
			}
		},
		"_query": {
			enumerable: true,
			value: query
		},
		"_value": {
			enumerable: true,
			value: value
		}
	});
};

exports.QuerySpy = QuerySpy;