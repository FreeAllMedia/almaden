"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var mockExecute = Symbol();
var addChain = Symbol();
var argumentsEqual = Symbol();

var Query = (function () {
	function Query(database) {
		var defineMock = arguments[1] === undefined ? false : arguments[1];

		_classCallCheck(this, Query);

		(0, _incognito2["default"])(this).defineMock = defineMock;
		(0, _incognito2["default"])(this).database = database;
		(0, _incognito2["default"])(this).knex = (0, _incognito2["default"])(database).knex;
		(0, _incognito2["default"])(this).chain = [];
	}

	_createClass(Query, [{
		key: "select",
		value: function select() {
			var _privateData$knex;

			for (var _len = arguments.length, columns = Array(_len), _key = 0; _key < _len; _key++) {
				columns[_key] = arguments[_key];
			}

			(0, _incognito2["default"])(this).query = (_privateData$knex = (0, _incognito2["default"])(this).knex).select.apply(_privateData$knex, columns);
			this[addChain]("select", columns);
			return this;
		}
	}, {
		key: "count",
		value: function count() {
			var _privateData$knex2;

			for (var _len2 = arguments.length, columns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				columns[_key2] = arguments[_key2];
			}

			(0, _incognito2["default"])(this).query = (_privateData$knex2 = (0, _incognito2["default"])(this).knex).count.apply(_privateData$knex2, columns);
			this[addChain]("count", columns);
			return this;
		}
	}, {
		key: "insert",
		value: function insert(data) {
			(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).knex.insert(data);
			this[addChain]("insert", [data]);
			return this;
		}
	}, {
		key: "update",
		value: function update(data) {
			(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).knex.update(data);
			this[addChain]("update", [data]);
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
			this[addChain]("from", [tableName]);
			return this;
		}
	}, {
		key: "where",
		value: function where() {
			var _privateData$query;

			for (var _len3 = arguments.length, options = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
				options[_key3] = arguments[_key3];
			}

			(0, _incognito2["default"])(this).query = (_privateData$query = (0, _incognito2["default"])(this).query).where.apply(_privateData$query, options);
			this[addChain]("where", options);
			return this;
		}
	}, {
		key: "andWhere",
		value: function andWhere() {
			var _privateData$query2;

			for (var _len4 = arguments.length, options = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
				options[_key4] = arguments[_key4];
			}

			(0, _incognito2["default"])(this).query = (_privateData$query2 = (0, _incognito2["default"])(this).query).andWhere.apply(_privateData$query2, options);
			this[addChain]("andWhere", options);
			return this;
		}
	}, {
		key: "orWhere",
		value: function orWhere() {
			var _privateData$query3;

			for (var _len5 = arguments.length, options = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
				options[_key5] = arguments[_key5];
			}

			(0, _incognito2["default"])(this).query = (_privateData$query3 = (0, _incognito2["default"])(this).query).orWhere.apply(_privateData$query3, options);
			this[addChain]("orWhere", options);
			return this;
		}
	}, {
		key: "whereNull",
		value: function whereNull() {
			var _privateData$query4;

			for (var _len6 = arguments.length, options = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
				options[_key6] = arguments[_key6];
			}

			(0, _incognito2["default"])(this).query = (_privateData$query4 = (0, _incognito2["default"])(this).query).whereNull.apply(_privateData$query4, options);
			this[addChain]("whereNull", options);
			return this;
		}
	}, {
		key: "whereNotNull",
		value: function whereNotNull() {
			var _privateData$query5;

			for (var _len7 = arguments.length, options = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
				options[_key7] = arguments[_key7];
			}

			(0, _incognito2["default"])(this).query = (_privateData$query5 = (0, _incognito2["default"])(this).query).whereNotNull.apply(_privateData$query5, options);
			this[addChain]("whereNotNull", options);
			return this;
		}
	}, {
		key: "groupBy",
		value: function groupBy() {
			var _privateData$query6;

			for (var _len8 = arguments.length, columnNames = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
				columnNames[_key8] = arguments[_key8];
			}

			(0, _incognito2["default"])(this).query = (_privateData$query6 = (0, _incognito2["default"])(this).query).groupBy.apply(_privateData$query6, columnNames);
			this[addChain]("groupBy", columnNames);
			return this;
		}
	}, {
		key: "orderBy",
		value: function orderBy(column, direction) {
			(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).query.orderBy(column, direction);
			this[addChain]("orderBy", [column, direction]);
			return this;
		}
	}, {
		key: "limit",
		value: function limit(number) {
			(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).query.limit(number);
			this[addChain]("limit", [number]);
			return this;
		}
	}, {
		key: "leftJoin",
		value: function leftJoin() {
			var _privateData$query7;

			for (var _len9 = arguments.length, options = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
				options[_key9] = arguments[_key9];
			}

			(0, _incognito2["default"])(this).query = (_privateData$query7 = (0, _incognito2["default"])(this).query).leftJoin.apply(_privateData$query7, options);
			this[addChain]("leftJoin", options);
			return this;
		}
	}, {
		key: "into",
		value: function into(tableName) {
			(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).query.into(tableName);
			this[addChain]("into", [tableName]);
			return this;
		}
	}, {
		key: "dropTable",
		value: function dropTable(tableName) {
			(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).knex.schema.dropTable(tableName);
			this[addChain]("dropTable", [tableName]);
			return this;
		}
	}, {
		key: "createTable",
		value: function createTable(tableName, tableConstructor) {
			(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).knex.schema.createTable(tableName, tableConstructor);
			this[addChain]("createTable", [tableName, tableConstructor]);
			return this;
		}
	}, {
		key: "createDatabase",
		value: function createDatabase(databaseName) {
			(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).knex.raw("create database " + databaseName);
			this[addChain]("createDatabase", [databaseName]);
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
			var _this = this;

			var _ = (0, _incognito2["default"])(this);

			if (_.query.exec) {

				var mockQueries = (0, _incognito2["default"])(_.database).mockQueries;

				if (_.defineMock) {
					var mockResults = callback;
					mockQueries.push({
						query: this,
						results: mockResults
					});
				} else {
					if (mockQueries.length > 0) {
						this[mockExecute](mockQueries, callback);
					} else {
						_.query.exec(function (errors, rows) {
							(0, _incognito2["default"])(_this).query = null;
							callback(errors, rows);
						});
					}
				}
			} else {
				throw new Error("Cannot perform query without valid query stack. See docs for proper usage.");
			}
		}
	}, {
		key: "equalTo",
		value: function equalTo(query) {
			var ourChain = this.chain;
			var theirChain = query.chain;

			var isEqual = true;

			if (ourChain.length === theirChain.length) {

				for (var ourIndex = 0; ourIndex < ourChain.length; ourIndex++) {

					var ourLink = ourChain[ourIndex];
					var ourArguments = ourLink.options;

					var hasMatchingLink = false;

					for (var theirIndex = 0; theirIndex < theirChain.length; theirIndex++) {
						var theirLink = theirChain[theirIndex];
						var theirArguments = theirLink.options;

						if (ourLink.name === theirLink.name) {
							if (this[argumentsEqual](ourArguments, theirArguments)) {
								hasMatchingLink = true;
								break;
							}
						}
					}

					if (!hasMatchingLink) {
						isEqual = false;
						break;
					}
				}
			} else {
				isEqual = false;
			}

			return isEqual;
		}
	}, {
		key: addChain,
		value: function value(chainName, options) {
			(0, _incognito2["default"])(this).chain.push({
				name: chainName,
				options: options
			});
		}
	}, {
		key: argumentsEqual,
		value: function value(argumentsA, argumentsB) {
			if (argumentsA === argumentsB) {
				return true;
			} else {
				if (argumentsA.length === argumentsB.length) {
					var index = argumentsA.length;
					while (index--) {
						var argumentA = argumentsA[index];
						var argumentB = argumentsB[index];

						if (argumentA !== argumentB) {
							if (argumentA instanceof RegExp) {
								if (argumentB.toString().match(argumentA) === null) {
									return false;
								}
							} else if (argumentB instanceof RegExp) {
								if (argumentA.toString().match(argumentB) === null) {
									return false;
								}
							} else {
								return false;
							}
						}
					}
					return true;
				} else {
					return false;
				}
			}
		}
	}, {
		key: mockExecute,
		value: function value(mockQueries, callback) {
			var mockFound = false;
			var results = undefined;

			for (var index in mockQueries) {
				var mockQuery = mockQueries[index];

				var query = mockQuery.query;

				results = mockQuery.results;

				if (this.equalTo(query)) {
					mockFound = true;
					break;
				}
			}

			if (mockFound) {
				callback(undefined, results);
			} else {
				throw new Error("No mock values available for: \"" + this.toString() + "\"", null);
			}
		}
	}, {
		key: "delete",
		get: function get() {
			(0, _incognito2["default"])(this).query = (0, _incognito2["default"])(this).knex["delete"]();
			this[addChain]("delete");
			return this;
		}
	}, {
		key: "chain",
		get: function get() {
			return (0, _incognito2["default"])(this).chain;
		}
	}]);

	return Query;
})();

exports["default"] = Query;
module.exports = exports["default"];