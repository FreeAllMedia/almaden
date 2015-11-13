import privateData from "incognito";

const mockExecute = Symbol();
const addChain = Symbol();
const argumentsEqual = Symbol();

export default class Query {
	constructor(database) {
		const _ = privateData(this);
		_.database = database;
		_.knex = privateData(database).knex;
		_.calls = 0;
		_.chain = [];
	}

	get calls() {
		return privateData(this).calls;
	}

	get called() {
		return this.calls > 0;
	}

	select(...columns) {
		privateData(this).query = privateData(this).knex.select(...columns);
		this[addChain]("select", columns);
		return this;
	}

	count(...columns) {
		privateData(this).query = privateData(this).knex.count(...columns);
		this[addChain]("count", columns);
		return this;
	}

	insert(data) {
		privateData(this).query = privateData(this).knex.insert(data);
		this[addChain]("insert", [data]);
		return this;
	}

	update(data) {
		privateData(this).query = privateData(this).knex.update(data);
		this[addChain]("update", [data]);
		return this;
	}

	get delete() {
		privateData(this).query = privateData(this).knex.delete();
		this[addChain]("delete");
		return this;
	}

	from(tableName) {
		if (privateData(this).query) {
			privateData(this).query = privateData(this).query.from(tableName);
		} else {
			privateData(this).query = privateData(this).knex(tableName);
		}
		this[addChain]("from", [tableName]);
		return this;
	}

	where(...options) {
		privateData(this).query = privateData(this).query.where(...options);
		this[addChain]("where", options);
		return this;
	}

	andWhere(...options) {
		privateData(this).query = privateData(this).query.andWhere(...options);
		this[addChain]("andWhere", options);
		return this;
	}

	orWhere(...options) {
		privateData(this).query = privateData(this).query.orWhere(...options);
		this[addChain]("orWhere", options);
		return this;
	}

	whereNull(...options) {
		privateData(this).query = privateData(this).query.whereNull(...options);
		this[addChain]("whereNull", options);
		return this;
	}

	whereNotNull(...options) {
		privateData(this).query = privateData(this).query.whereNotNull(...options);
		this[addChain]("whereNotNull", options);
		return this;
	}

	groupBy(...columnNames) {
		privateData(this).query = privateData(this).query.groupBy(...columnNames);
		this[addChain]("groupBy", columnNames);
		return this;
	}

	orderBy(column, direction) {
		privateData(this).query = privateData(this).query.orderBy(column, direction);
		this[addChain]("orderBy", [column, direction]);
		return this;
	}

	limit(number) {
		privateData(this).query = privateData(this).query.limit(number);
		this[addChain]("limit", [number]);
		return this;
	}

	leftJoin(...options) {
		privateData(this).query = privateData(this).query.leftJoin(...options);
		this[addChain]("leftJoin", options);
		return this;
	}

	into(tableName) {
		privateData(this).query = privateData(this).query.into(tableName);
		this[addChain]("into", [tableName]);
		return this;
	}

	dropTable(tableName) {
		privateData(this).query = privateData(this).knex.schema.dropTable(tableName);
		this[addChain]("dropTable", [tableName]);
		return this;
	}

	createTable(tableName, tableConstructor) {
		privateData(this).query = privateData(this).knex.schema.createTable(tableName, tableConstructor);
		this[addChain]("createTable", [tableName, tableConstructor]);
		return this;
	}

	createDatabase(databaseName) {
		privateData(this).query = privateData(this).knex.raw(`create database ${databaseName}`);
		this[addChain]("createDatabase", [databaseName]);
		return this;
	}

	toString() {
		return privateData(this).query.toString();
	}

	results(callback) {
		const _ = privateData(this);

		_.calls += 1;

		if (_.query.exec) {
			const mockQueries = privateData(_.database).mockQueries;

			if (mockQueries.length > 0) {
				this[mockExecute](mockQueries, callback);
			} else {
				_.query.exec((errors, rows) => {
					privateData(this).query = null;
					callback(errors, rows);
				});
			}
		} else {
			throw new Error("Cannot perform query without valid query stack. See docs for proper usage.");
		}

		return this;
	}

	equalTo(query) {
		const ourChain = this.chain;
		const theirChain = query.chain;

		let isEqual = true;

		if (ourChain.length === theirChain.length) {

			for (let ourIndex = 0; ourIndex < ourChain.length; ourIndex++) {

				const ourLink = ourChain[ourIndex];
				const ourArguments = ourLink.options;

				let hasMatchingLink = false;

				for (let theirIndex = 0; theirIndex < theirChain.length; theirIndex++) {
					const theirLink = theirChain[theirIndex];
					const theirArguments = theirLink.options;

					//so andWhere and where are treated both as the same
					const theirLinkName = theirLink.name.replace("andWhere", "where");
					const ourLinkName = ourLink.name.replace("andWhere", "where");

					if (ourLinkName === theirLinkName) {
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

	get chain() {
		return privateData(this).chain;
	}

	[addChain](chainName, options) {
		if ((chainName === "where" || chainName === "andWhere") && options.length === 2) {
			options = [options[0], "=", options[1]];
		}
		privateData(this).chain.push({
			name: chainName,
			options: options
		});
	}

	[argumentsEqual](argumentsA, argumentsB) {
		if (argumentsA === argumentsB) {
			return true;
		} else {
			if (argumentsA.length === argumentsB.length) {
				let index = argumentsA.length;
				while (index--) {
					const argumentA = argumentsA[index];
					const argumentB = argumentsB[index];

					if (argumentA !== argumentB) {
						if (argumentB instanceof RegExp) {
							if (argumentA.toString().match(argumentB) === null) {
								return false;
							}
						} else if (argumentA instanceof Object) {
							if (Object.keys(argumentA).length === Object.keys(argumentB).length) {
								for (let subArgument in argumentA) {
									const subArgumentA = argumentA[subArgument];
									const subArgumentB = argumentB[subArgument];

									if (subArgumentA !== subArgumentB) {
										if (subArgumentB instanceof RegExp) {
											if (subArgumentA.toString().match(subArgumentB) === null) {
												return false;
											}
										} else {
											return false;
										}
									}
								}
							} else {
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

	[mockExecute](mockQueries, callback) {
		let mockFound = false;
		let results;

		for (let index in mockQueries) {
			const mockQuery = mockQueries[index];

			const query = mockQuery.query;

			results = mockQuery.results;

			if (this.equalTo(query)) {
				mockFound = true;
				break;
			}
		}

		if (mockFound) {
			callback(undefined, results);
		} else {
			throw new Error(`No mock values available for: "${this.toString()}"`, null);
		}
	}
}
