import knex from "knex";
import async from "flowsync";
import privateData from "incognito";

export default class Database {
	constructor(databaseConfig) {
		const _ = privateData(this);

    _.config = databaseConfig;

    _.knex = knex(databaseConfig);

    this.mockQueries = undefined;
	}

  get config() {
    return privateData(this).config;
  }

	close(callback) {
		privateData(this).knex.destroy(callback);
	}

	spy(query, returnValue) {
		if(!this.mockQueries) {
			this.mockQueries = {};
		}
		const querySpy = new QuerySpy(query, returnValue);
		this.mockQueries[query] = querySpy;
		return querySpy;
	}

	mock(queryValueMatrix) {
		this.mockQueries = queryValueMatrix;
	}

	unmock() {
		this.mockQueries = undefined;
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

	createDatabase(databaseName) {
		const query = new Query(this);
		return query.createDatabase(databaseName);
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
		privateData(this).database = database;
		privateData(this).knex = privateData(database).knex;
	}

	select(...columns) {
		privateData(this).query = privateData(this).knex.select(...columns);
		return this;
	}

	count(...columns) {
		privateData(this).query = privateData(this).knex.count(...columns);
		return this;
	}

	insert(data) {
		privateData(this).query = privateData(this).knex.insert(data);
		return this;
	}

	update(data) {
		privateData(this).query = privateData(this).knex.update(data);
		return this;
	}

	delete() {
		privateData(this).query = privateData(this).knex.delete();
		return this;
	}

	from(tableName) {
		if (privateData(this).query) {
			privateData(this).query = privateData(this).query.from(tableName);
		} else {
			privateData(this).query = privateData(this).knex(tableName);
		}
		return this;
	}

	where(...options) {
		privateData(this).query = privateData(this).query.where(...options);
		return this;
	}

	andWhere(...options) {
		privateData(this).query = privateData(this).query.andWhere(...options);
		return this;
	}

	whereNull(...options) {
		privateData(this).query = privateData(this).query.whereNull(...options);
		return this;
	}

	whereNotNull(...options) {
		privateData(this).query = privateData(this).query.whereNotNull(...options);
		return this;
	}

	orWhere(...options) {
		privateData(this).query = privateData(this).query.orWhere(...options);
		return this;
	}

	groupBy(...columnNames) {
		privateData(this).query = privateData(this).query.groupBy(...columnNames);
		return this;
	}

	orderBy(column, direction) {
		privateData(this).query = privateData(this).query.orderBy(column, direction);
		return this;
	}

	limit(number) {
		privateData(this).query = privateData(this).query.limit(number);
		return this;
	}

	leftJoin(...options) {
		privateData(this).query = privateData(this).query.leftJoin(...options);
		return this;
	}

	into(tableName) {
		privateData(this).query = privateData(this).query.into(tableName);
		return this;
	}

	dropTable(tableName) {
		privateData(this).query = privateData(this).knex.schema.dropTable(tableName);
		return this;
	}

	createTable(tableName, tableConstructor) {
		privateData(this).query = privateData(this).knex.schema.createTable(tableName, tableConstructor);
		return this;
	}

	createDatabase(databaseName) {
		privateData(this).query = privateData(this).knex.raw(`create database ${databaseName}`);
		return this;
	}

	toString() {
		return privateData(this).query.toString();
	}

	results(callback) {
		if (privateData(this).query.exec) {
			const mockQueries = privateData(this).database.mockQueries;
			if (mockQueries !== undefined) {
				let query = privateData(this).query.toString();
				privateData(this).query = null;

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
							const regularExpressionString = key.substr(1).substr(0, key.length - 2);
							const regularExpression = new RegExp(regularExpressionString);
							const queryResults = mockQueries[key];

							if (query.match(regularExpression)) {
								if (queryResults instanceof Error) {
									return callback(queryResults, null);
								} else if(queryResults instanceof QuerySpy) {
									return callback(null, queryResults.call);
								} else {
									return callback(null, queryResults);
								}
							}
						}
					}

					throw new Error(`No mock values available for: "${query}"`, null);
				}
			} else {
				privateData(this).query.exec((errors, rows) => {
					privateData(this).query = null;
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
		privateData(this).calls = 0;
		privateData(this).query = query;
		privateData(this).value = value;

		//public properties
		Object.defineProperties(this, {
			"callCount": {
				get: () => {
					return privateData(this).calls;
				}
			},
			"call": {
				get: () => {
					privateData(this).calls += 1;
					return privateData(this).value;
				}
			}
		});
	}
}
