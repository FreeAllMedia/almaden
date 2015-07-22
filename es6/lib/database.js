const knex = require("knex");
const async = require("flowsync");

let privateData = new WeakMap();

let internal = function (object) {
    if (!privateData.has(object)) {
			privateData.set(object, {});
		}
    return privateData.get(object);
};

export default class Database {
	constructor(databaseConfig) {
		internal(this)._knex = knex(databaseConfig);

		internal(this)._query = this.getKnex();
		internal(this)._mockQueries = undefined;
	}

	getKnex() {
		return internal(this)._knex;
	}

	getMockQueries() {
		return internal(this)._mockQueries;
	}

	close(callback) {
		internal(this)._knex.destroy(callback);
	}

	spy(query, returnValue) {
		if(!internal(this)._mockQueries) {
			internal(this)._mockQueries = {};
		}
		const querySpy = new QuerySpy(query, returnValue);
		internal(this)._mockQueries[query] = querySpy;
		return querySpy;
	}

	mock(queryValueMatrix) {
		internal(this)._mockQueries = queryValueMatrix;
	}

	unmock() {
		internal(this)._mockQueries = undefined;
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
		internal(this)._database = database;
		internal(this)._knex = database.getKnex();
	}

	select(...columns) {
		internal(this)._query = internal(this)._knex.select(...columns);
		return this;
	}

	count(...columns) {
		internal(this)._query = internal(this)._knex.count(...columns);
		return this;
	}

	insert(data) {
		internal(this)._query = internal(this)._knex.insert(data);
		return this;
	}

	update(data) {
		internal(this)._query = internal(this)._knex.update(data);
		return this;
	}

	delete() {
		internal(this)._query = internal(this)._knex.delete();
		return this;
	}

	from(tableName) {
		if (internal(this)._query) {
			internal(this)._query = internal(this)._query.from(tableName);
		} else {
			internal(this)._query = internal(this)._knex(tableName);
		}
		return this;
	}

	where(...options) {
		internal(this)._query = internal(this)._query.where(...options);
		return this;
	}

	andWhere(...options) {
		internal(this)._query = internal(this)._query.andWhere(...options);
		return this;
	}

	whereNull(...options) {
		internal(this)._query = internal(this)._query.whereNull(...options);
		return this;
	}

	whereNotNull(...options) {
		internal(this)._query = internal(this)._query.whereNotNull(...options);
		return this;
	}

	orWhere(...options) {
		internal(this)._query = internal(this)._query.orWhere(...options);
		return this;
	}

	groupBy(...columnNames) {
		internal(this)._query = internal(this)._query.groupBy(...columnNames);
		return this;
	}

	orderBy(column, direction) {
		internal(this)._query = internal(this)._query.orderBy(column, direction);
		return this;
	}

	limit(number) {
		internal(this)._query = internal(this)._query.limit(number);
		return this;
	}

	leftJoin(...options) {
		internal(this)._query = internal(this)._query.leftJoin(...options);
		return this;
	}

	into(tableName) {
		internal(this)._query = internal(this)._query.into(tableName);
		return this;
	}

	dropTable(tableName) {
		internal(this)._query = internal(this)._knex.schema.dropTable(tableName);
		return this;
	}

	createTable(tableName, tableConstructor) {
		internal(this)._query = internal(this)._knex.schema.createTable(tableName, tableConstructor);
		return this;
	}

	toString() {
		return internal(this)._query.toString();
	}

	results(callback) {
		if (internal(this)._query.exec) {
			const mockQueries = internal(this)._database.getMockQueries();
			if (mockQueries !== undefined) {
				let query = internal(this)._query.toString();
				internal(this)._query = null;

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
				internal(this)._query.exec((errors, rows) => {
					internal(this)._query = null;
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
		internal(this)._calls = 0;
		internal(this)._query = query;
		internal(this)._value = value;

		//public properties
		Object.defineProperties(this, {
			"callCount": {
				get: () => {
					return internal(this)._calls;
				}
			},
			"call": {
				get: () => {
					internal(this)._calls += 1;
					return internal(this)._value;
				}
			}
		});
	}
}
