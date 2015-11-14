import knex from "knex";
import async from "flowsync";
import privateData from "incognito";

import Query from "./query.js";
import MockQuery from "./mockQuery.js";

export { Query };
export { MockQuery };

const newQuery = Symbol();

export default class Database {
	constructor(databaseConfig) {
		const _ = privateData(this);

		_.config = databaseConfig;
		_.knex = knex(databaseConfig);
		_.mockQueries = [];
	}

	get config() {
		return privateData(this).config;
	}

	close(callback) {
		privateData(this).knex.destroy(callback);
	}

	select(...columns) {
		const query = this[newQuery]();
		return query.select(...columns);
	}

	insert(data) {
		const query = this[newQuery]();
		return query.insert(data);
	}

	update(data) {
		const query = this[newQuery]();
		return query.update(data);
	}

	get delete() {
		const query = this[newQuery]();
		return query.delete;
	}

	count(...columns) {
		const query = this[newQuery]();
		return query.count(...columns);
	}

	dropTable(tableName) {
		const query = this[newQuery]();
		return query.dropTable(tableName);
	}

	createTable(tableName, tableConstructor) {
		const query = this[newQuery]();
		return query.createTable(tableName, tableConstructor);
	}

	createDatabase(databaseName) {
		const query = this[newQuery]();
		return query.createDatabase(databaseName);
	}

	load(fixtures, callback) {
		let databaseSetupSteps = [];

		const setupDeleteTable = tableName => {
			databaseSetupSteps.push(done => {
				this.dropTable(tableName).results(() => {
					done();
				});
			});
		};

		const setupCreateTable = (tableName, fixtureData) => {
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
				}).results((error) => {
					if (error) { throw error; }
					done();
				});
			});
		};

		const setupInsertData = (tableName, fixtureData) => {
			fixtureData.forEach((rowData) => {
				databaseSetupSteps.push(done => {
					this.insert(rowData).into(tableName).results((error) => {
						if (error) { throw error; }
						done();
					});
				});
			});
		};

		for(let tableName in fixtures) {
			let fixtureData = fixtures[tableName];
			setupDeleteTable(tableName);
			setupCreateTable(tableName, fixtureData);
			setupInsertData(tableName, fixtureData);
		}

		async.series(databaseSetupSteps, callback);
	}

	get mock() {
		return new MockQuery(this);
	}

	// unmock() {
	// 	this.mockQueries = undefined;
	// }

	results() {
		throw new Error("Cannot perform query without valid query stack. See docs for proper usage.");
	}

	[newQuery]() {
		return new Query(this);
	}

}
