const knex = require("knex");
const async = require("flowsync");

export default class Database {
	constructor(databaseConfig) {
		[
			"_knex",
			"_query",
			"_mockQueries"
		].forEach((privatePropertyName) => {
			Object.defineProperty(this, privatePropertyName, {
				writable: true,
				value: undefined,
				enumerable: false
			});
		});

		this._knex = knex(databaseConfig);
		this._query = this._knex;
		this._mockQueries = undefined;
	}

	close(callback) {
		this._knex.destroy(callback);
	}

	spy(query, returnValue) {
		if(!this._mockQueries) {
			this._mockQueries = {};
		}
		const querySpy = new QuerySpy(query, returnValue);
		this._mockQueries[query] = querySpy;
		return querySpy;
	}

	mock(queryValueMatrix) {
		this._mockQueries = queryValueMatrix;
	}

	unmock() {
		this._mockQueries = undefined;
	}

	select(...columns) {
		const query = new Query(this);
		return query.select(...columns);
	}

	insert(data) {
		const query = new Query(this);
		return query.insert(data);
	}

	update(data) {
		const query = new Query(this);
		return query.update(data);
	}

	delete() {
		const query = new Query(this);
		return query.delete();
	}

	count(...columns) {
		const query = new Query(this);
		return query.count(...columns);
	}

	dropTable(tableName) {
		const query = new Query(this);
		return query.dropTable(tableName);
	}

	createTable(tableName, tableConstructor) {
		const query = new Query(this);
		return query.createTable(tableName, tableConstructor);
	}

	load(fixtures, callback) {
		let databaseSetupSteps = [];
		for(let tableName in fixtures) {
			let fixtureData = fixtures[tableName];

			databaseSetupSteps.push(done => {
				this.dropTable(tableName).results((error, rows) => {
					if (error) { throw error; }
					done();
				});
			});

			databaseSetupSteps.push(done => {
				this.createTable(tableName, table => {
					table.increments();

					let firstFixtureData = fixtureData[0];

					for (let fixtureProperty in firstFixtureData) {
						if (fixtureProperty !== "id") {
							let fixtureValue = firstFixtureData[fixtureProperty];

							if (isNaN(fixtureValue)) {
								table.string(fixtureProperty);
							} else {
								table.integer(fixtureProperty);
							}
						}
					}
				}).results((error, rows) => {
					if (error) { throw error; }
					done();
				});
			});

			databaseSetupSteps.push(done => {
				fixtureData.forEach((rowData) => {
					this.insert(rowData).into(tableName).results((error, rows) => {
						if (error) { throw error; }
						done();
					});
				});
			});
		}

		async.series(databaseSetupSteps, callback);
	}

	results() {
		throw new Error("Cannot perform query without valid query stack. See docs for proper usage.");
	}

}

export class Query {
	constructor(database) {
		this._database = database;
		this._knex = database._knex;
	}

	select(...columns) {
		this._query = this._knex.select(...columns);
		return this;
	}

	count(...columns) {
		this._query = this._knex.count(...columns);
		return this;
	}

	insert(data) {
		this._query = this._knex.insert(data);
		return this;
	}

	update(data) {
		this._query = this._knex.update(data);
		return this;
	}

	delete() {
		this._query = this._knex.delete();
		return this;
	}

	from(tableName) {
		if (this._query) {
			this._query = this._query.from(tableName);
		} else {
			this._query = this._knex(tableName);
		}
		return this;
	}

	where(...options) {
		this._query = this._query.where(...options);
		return this;
	}

	andWhere(...options) {
		this._query = this._query.andWhere(...options);
		return this;
	}

	whereNull(...options) {
		this._query = this._query.whereNull(...options);
		return this;
	}

	whereNotNull(...options) {
		this._query = this._query.whereNotNull(...options);
		return this;
	}

	orWhere(...options) {
		this._query = this._query.orWhere(...options);
		return this;
	}

	groupBy(...columnNames) {
		this._query = this._query.groupBy(...columnNames);
		return this;
	}

	orderBy(column, direction) {
		this._query = this._query.orderBy(column, direction);
		return this;
	}

	limit(number) {
		this._query = this._query.limit(number);
		return this;
	}

	leftJoin(...options) {
		this._query = this._query.leftJoin(...options);
		return this;
	}

	into(tableName) {
		this._query = this._query.into(tableName);
		return this;
	}

	dropTable(tableName) {
		this._query = this._knex.schema.dropTable(tableName);
		return this;
	}

	createTable(tableName, tableConstructor) {
		this._query = this._knex.schema.createTable(tableName, tableConstructor);
		return this;
	}

	toString() {
		return this._query.toString();
	}

	results(callback) {
		if (this._query.exec) {
			const mockQueries = this._database._mockQueries;
			if (mockQueries !== undefined) {
				let query = this._query.toString();
				this._query = null;

				/* Check if string and has results */
				const results = mockQueries[query];

				if (results) {
					if (results instanceof Error) {
						callback(results, null);
					} else if(results instanceof QuerySpy) {
						callback(null, results.call);
					} else {
						callback(null, results);
					}
				} else if((typeof mockQueries) === "function") {
					mockQueries(query, (error, result) => {
						if(!error && !result) {
							throw new Error(`No mock values available for: "${query}"`, null);
						} else {
							callback(error, result);
						}
					});
				} else {
					for(let key in mockQueries) {
						if (key.charAt && key.charAt(0) === "/") {
							const regularExpressionString = key.substr(1).substr(0, key.length-2);
							const regularExpression = new RegExp(regularExpressionString);
							const results = mockQueries[key];

							if (query.match(regularExpression)) {
								if (results instanceof Error) {
									return callback(results, null);
								} else if(results instanceof QuerySpy) {
									return callback(null, results.call);
								} else {
									return callback(null, results);
								}
							}
						}
					}

					throw new Error(`No mock values available for: "${query}"`, null);
				}
			} else {
				this._query.exec((errors, rows) => {
					this._query = null;
					callback(errors, rows);
				});
			}
		} else {
			throw new Error("Cannot perform query without valid query stack. See docs for proper usage.");
		}
	}
}

export class QuerySpy {
	constructor(query, value) {
		Object.defineProperties(this, {
			"_calls": {
				enumerable: false,
				writable: true,
				value: 0
			},
			"callCount": {
				get: () => {
					return this._calls;
				}
			},
			"call": {
				get: () => {
					this._calls += 1;
					return this._value;
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
	}
}
