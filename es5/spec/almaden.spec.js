/* jshint camelcase: false */

/**
 * Test Dependencies
 */

/**
 * Get fixtures from files
 */
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _libAlmadenJs = require("../lib/almaden.js");

var _libAlmadenJs2 = _interopRequireDefault(_libAlmadenJs);

var userFixtures = require("./fixtures/users.json");
var addressFixtures = require("./fixtures/addresses.json");

/**
 * Get database config from file
 */
var databaseConfig = require("../../database.json").testing;

/**
 * Check integration with actual database (slow)
 * or
 * Mock database with fixed values (fast)
 */
var useMockDatabase = true;

describe("Database(databaseConfig)", function () {

	var database = undefined;

	beforeEach(function () {
		database = new _libAlmadenJs2["default"](databaseConfig);
		if (useMockDatabase) {
			mockDatabase(database);
		}
	});

	describe("(instance functions)", function () {
		describe(".close(callback)", function () {
			var callback = undefined;
			it("should close connections to the database and callback", function (done) {
				callback = function () {
					// TODO: Figure out a way to check if the database is disconnected.
					// database
					// 	.select("*")
					// 	.from("users")
					// 	.where("id",1)
					// 	.results((error, rows) => {
					// 		done(error);
					// 	});
					done();
				};
				database.close(callback);
			});
		});

		describe("(fixtures)", function () {
			describe(".load(fixtures)", function () {
				it("should load fixtures into the database", function (done) {
					database.load({
						"api_keys": [{
							"id": 1,
							"token": "SOMETOKEN"
						}]
					}, done);
				});
			});
		});

		describe("(mocking)", function () {
			var mockRows = undefined;

			beforeEach(function () {
				mockRows = [userFixtures[0]];

				database.mock({
					"select * from `users` where `id` = 1": mockRows
				});
			});

			describe(".unmock()", function () {
				it("should remove all mock queries", function (done) {
					database.unmock();
					database.select("*").from("* something ### BOGUS").results(function (error) {
						(error === null).should.be["false"];
						done();
					});
				});
			});

			describe(".mock(queryValueMatrix)", function () {
				it("should allow regex keys for lookup", function (done) {
					var regexKey = /select \* from `users` where `id` = [0-9]/;
					mockRows = [1, 2, 3];
					database.mock(_defineProperty({}, regexKey, mockRows));
					database.select("*").from("users").where("id", 5).results(function (error, rows) {
						rows.should.eql(mockRows);
						done();
					});
				});

				it("should throw an error for undesignated queries", function () {
					(function () {
						database.select("*").from("users").where("id", 3).results();
					}).should["throw"]("No mock values available for: \"select * from `users` where `id` = 3\"");
				});

				it("should return mock values for the designated queries", function (done) {
					database.select("*").from("users").where("id", 1).results(function (error, rows) {
						rows.should.eql(mockRows);
						done();
					});
				});

				it("should throw a designated error in place of results", function (done) {
					var expectedError = new Error("Bogus Error");

					database.mock({
						"select * from `users` where `id` = 3": expectedError
					});

					database.select("*").from("users").where("id", 3).results(function (error) {
						error.should.equal(expectedError);
						done();
					});
				});
			});
		});

		describe("(query chaining)", function () {
			var query = undefined;

			beforeEach(function () {
				query = database.select("*");
			});

			describe(".select(...columns) ", function () {
				it("should return itself to enable function chaining", function () {
					query.should.be.instanceOf(_libAlmadenJs.Query);
				});
			});

			describe(".from(tableName)", function () {
				it("should return itself to enable function chaining", function () {
					query.from("users").should.be.instanceOf(_libAlmadenJs.Query);
				});
			});

			describe(".where(...options)", function () {
				it("should return itself to enable function chaining", function () {
					query.where("id=1").should.be.instanceOf(_libAlmadenJs.Query);
				});
			});

			describe(".andWhere(...options)", function () {
				it("should return itself to enable function chaining", function () {
					query.andWhere("id=1").should.be.instanceOf(_libAlmadenJs.Query);
				});
			});

			describe(".orWhere(...options)", function () {
				it("should return itself to enable function chaining", function () {
					query.orWhere("id=1").should.be.instanceOf(_libAlmadenJs.Query);
				});
			});

			describe(".groupBy(...columnNames)", function () {
				it("should return itself to enable function chaining", function () {
					query.groupBy("age").should.be.instanceOf(_libAlmadenJs.Query);
				});
			});

			describe(".orderBy(column, [direction]) ", function () {
				it("should return itself to enable function chaining", function () {
					query.orderBy("age", "desc").should.be.instanceOf(_libAlmadenJs.Query);
				});
			});

			describe(".limit(number)", function () {
				it("should return itself to enable function chaining", function () {
					query.orderBy(1).should.be.instanceOf(_libAlmadenJs.Query);
				});
			});

			describe("leftJoin(tableName, optionOne, optionTwo)", function () {
				it("should return itself to enable function chaining", function () {
					query.leftJoin("accounts", "users.id", "accounts.user_id").should.be.instanceOf(_libAlmadenJs.Query);
				});
			});
		});

		describe(".results(callback)", function () {
			it("should return an error if not a valid query stack has been build", function () {
				(function () {
					database.results();
				}).should["throw"]("Cannot perform query without valid query stack. See docs for proper usage.");
			});
		});

		describe(".toString()", function () {
			it("should return a string of the query", function () {
				database.select("*").from("users").toString().should.eql("select * from `users`");
			});
		});

		describe(".count([column], callback)", function () {
			it("should return itself to enable function chaining", function () {
				database.count().should.be.instanceOf(_libAlmadenJs.Query);
			});
		});

		describe(".raw(sqlString, callback)", function () {
			it("should execute a raw query and return an error if the database is not set");
			it("should execute a raw query and return results");
			it("should execute a raw query and return an empty array if no results");
		});

		describe(".dropTable(tableName)", function () {
			it("should return itself to enable function chaining", function () {
				database.dropTable().should.be.instanceOf(_libAlmadenJs.Query);
			});

			it("should drop the table from the database", function (done) {
				database.dropTable("users").results(function (errors) {
					(errors === null).should.be["true"];
					done();
				});
			});
		});

		describe(".insert(data)", function () {
			it("should return itself to enable function chaining", function () {
				database.insert().should.be.instanceOf(_libAlmadenJs.Query);
			});

			it("should insert a row into the table", function (done) {
				database.insert({
					"id": 6,
					"name": "Bob Builder",
					"age": 34
				}).into("users").results(function (errors) {
					database.select("*").from("users").where("id", 6).results(function (errors, rows) {
						rows[0].name.should.eql("Bob Builder");
						done();
					});
				});
			});
		});

		describe(".update(data)", function () {
			var newPerson = undefined;

			beforeEach(function () {
				newPerson = {
					id: 1,
					name: "Linda Kirsten",
					age: 35
				};
				database.mock({
					"select * from `users` where `id` = 1": [newPerson],
					"update `users` set `age` = 25, `name` = 'Linda Kirsten' where `id` = 1": [1]
				});
			});

			it("should return itself to enable function chaining", function () {
				database.update().should.be.instanceOf(_libAlmadenJs.Query);
			});

			it("should update a row into the table", function (done) {
				database.update({
					"name": "Linda Kirsten",
					"age": 25
				}).into("users").where("id", "=", 1).results(function () {
					database.select("*").from("users").where("id", 1).results(function (errors, rows) {
						rows[0].name.should.eql("Linda Kirsten");
						done();
					});
				});
			});
		});

		describe(".delete()", function () {

			beforeEach(function () {
				database.mock({
					"select * from `users` where `id` = 1": [],
					"delete from `users` where `id` = 1": [1]
				});
			});

			it("should return itself to enable function chaining", function () {
				database["delete"]().should.be.instanceOf(_libAlmadenJs.Query);
			});

			it("should delete a row into the table", function (done) {
				database["delete"]().from("users").where("id", "=", 1).results(function () {
					database.select("*").from("users").where("id", 1).results(function (errors, rows) {
						rows.length.should.equal(0);
						done();
					});
				});
			});
		});

		describe(".into(tableName)", function () {
			it("should return itself to enable function chaining", function () {
				database.insert({}).into().should.be.instanceOf(_libAlmadenJs.Query);
			});
		});

		describe(".createTable(tableName, tableConstructor)", function () {
			it("should return itself to enable function chaining", function () {
				database.createTable().should.be.instanceOf(_libAlmadenJs.Query);
			});

			xit("should insert a row into the table", function (done) {
				database.createTable("users", function (table) {
					table.increments();
					table.string("name");
					table.integer("age");
				}).results(function () {
					// TODO: Check if table exists
					done();
				});
			});
		});

		describe("(multiple querying)", function () {
			it("should allow to execute two count queries withouth getting the query chain messed up", function (done) {
				database.count("*").from("users").results(function () {
					database.count("*").from("users").results(function () {
						done();
					});
				});
			});
		});

		//Test scenarios for combinations will be hughe with many complex data mocked up
		//so we may want to do this as we go just for what we need to, by TDD
		//find,where,limit,groupBy,orderBy,leftJoin,rightJoin, innerJoing and results x count
		describe("(when chaining)", function () {
			describe("(chaining .select.from.results)", function () {
				it("should return all results", function (done) {
					database.select("*").from("users").results(function (error, rows) {
						rows.should.eql([userFixtures[1], userFixtures[2], userFixtures[3], userFixtures[4], userFixtures[0]]);
						done();
					});
				});
			});

			describe("(chaining .select.from.where.results)", function () {
				it("should have the ability to return a specific record", function (done) {
					database.select("*").from("users").where("id", 2).results(function (error, rows) {
						rows.should.eql([userFixtures[2]]);
						done();
					});
				});
				it("should return a range of specific records", function (done) {
					database.select("*").from("users").where("id", ">", 2).results(function (error, rows) {
						rows.should.eql([userFixtures[3], userFixtures[4], userFixtures[0]]);
						done();
					});
				});
			});

			describe("(chaining .select.from.where.andWhere.results)", function () {
				it("should have the ability to return a specific record", function (done) {
					database.mock({
						"select * from `users` where `id` = 2 and `name` = 'Gene Belcher'": [userFixtures[2]]
					});

					database.select("*").from("users").where("id", 2).andWhere("name", "Gene Belcher").results(function (error, rows) {
						rows.should.eql([userFixtures[2]]);
						done();
					});
				});
			});

			describe("(chaining .select.from.where.orWhere.results)", function () {
				it("should have the ability to return a specific record", function (done) {
					database.mock({
						"select * from `users` where `id` = 2 or `name` = 'Gene Belcher'": [userFixtures[2]]
					});

					database.select("*").from("users").where("id", 2).orWhere("name", "Gene Belcher").results(function (error, rows) {
						rows.should.eql([userFixtures[2]]);
						done();
					});
				});
			});

			describe("(chained with a .select.from.limit(1))", function () {
				it("should return the designated number of results", function (done) {
					database.select("*").from("users").limit(3).results(function (error, rows) {
						rows.should.eql([userFixtures[1], userFixtures[2], userFixtures[3]]);
						done();
					});
				});
			});

			describe("(chained with a .select.from.groupBy)", function () {
				it("should group results by the designated column", function (done) {
					database.select("*").from("users").groupBy("name").results(function (error, rows) {
						rows.should.eql([userFixtures[0], userFixtures[2], userFixtures[1], userFixtures[4], userFixtures[3]]);
						done();
					});
				});
			});

			describe("(chained with a .select.from.leftJoin)", function () {
				/* eslint-disable camelcase */
				it("should join results from another table", function (done) {
					database.select("*").from("users").leftJoin("user_addresses", "users.id", "user_addresses.user_id").results(function (error, rows) {
						rows[0].should.eql({
							id: userFixtures[1].id,
							age: userFixtures[1].age,
							name: userFixtures[1].name,
							address_id: addressFixtures[0].id,
							user_id: userFixtures[1].id
						});
						done();
					});
				});

				it("should join results from more than one table", function (done) {
					database.select("*").from("users").leftJoin("user_addresses", "users.id", "user_addresses.user_id").leftJoin("addresses", "addresses.id", "user_addresses.address_id").results(function (error, rows) {
						rows[0].should.eql({
							id: userFixtures[1].id,
							age: userFixtures[1].age,
							name: userFixtures[1].name,
							street_address: addressFixtures[0].street_address,
							city: addressFixtures[0].city,
							address_id: addressFixtures[0].id,
							user_id: userFixtures[1].id
						});
						done();
					});
				});
			});

			describe("(chained with a .select.from.orderBy)", function () {
				it("should order the results in ascending order by the designated column", function (done) {
					database.select("*").from("users").orderBy("name").results(function (error, rows) {
						rows.should.eql([userFixtures[0], userFixtures[2], userFixtures[1], userFixtures[4], userFixtures[3]]);
						done();
					});
				});

				it("should order the results in descending order by the designated column", function (done) {
					database.select("*").from("users").orderBy("name", "desc").results(function (error, rows) {
						rows.should.eql([userFixtures[3], userFixtures[4], userFixtures[1], userFixtures[2], userFixtures[0]]);
						done();
					});
				});
			});
		});
	});
});

function mockDatabase(database) {
	var naturalOrderUserFixtures = [userFixtures[1], userFixtures[2], userFixtures[3], userFixtures[4], userFixtures[0]];

	var bobBuilder = {
		"id": 6,
		"name": "Bob Builder",
		"age": 34
	};

	database.mock({
		"select * from `users`": naturalOrderUserFixtures,
		"select * from `users` where `id` = 2": [userFixtures[2]],
		"select * from `users` where `id` > 2": [userFixtures[3], userFixtures[4], userFixtures[0]],
		"select * from `users` group by `name`": [userFixtures[0], userFixtures[2], userFixtures[1], userFixtures[4], userFixtures[3]],
		"select * from `users` limit 3": [userFixtures[1], userFixtures[2], userFixtures[3]],
		"select * from `users` left join `user_addresses` on `users`.`id` = `user_addresses`.`user_id`": [{
			id: userFixtures[1].id,
			age: userFixtures[1].age,
			name: userFixtures[1].name,
			user_id: userFixtures[1].id,
			address_id: addressFixtures[0].id
		}, {
			id: userFixtures[2].id,
			age: userFixtures[2].age,
			name: userFixtures[2].name,
			user_id: userFixtures[2].id,
			address_id: addressFixtures[0].id
		}, {
			id: userFixtures[3].id,
			age: userFixtures[3].age,
			name: userFixtures[3].name,
			user_id: userFixtures[3].id,
			address_id: addressFixtures[0].id
		}, {
			id: userFixtures[4].id,
			age: userFixtures[4].age,
			name: userFixtures[4].name,
			user_id: userFixtures[4].id,
			address_id: addressFixtures[0].id
		}, {
			id: userFixtures[0].id,
			age: userFixtures[0].age,
			name: userFixtures[0].name,
			user_id: userFixtures[0].id,
			address_id: addressFixtures[0].id
		}],
		"select * from `users` left join `user_addresses` on `users`.`id` = `user_addresses`.`user_id` left join `addresses` on `addresses`.`id` = `user_addresses`.`address_id`": [{
			id: userFixtures[1].id,
			age: userFixtures[1].age,
			name: userFixtures[1].name,
			user_id: userFixtures[1].id,
			address_id: addressFixtures[0].id,
			street_address: addressFixtures[0].street_address,
			city: addressFixtures[0].city
		}, {
			id: userFixtures[2].id,
			age: userFixtures[2].age,
			name: userFixtures[2].name,
			user_id: userFixtures[2].id,
			address_id: addressFixtures[0].id,
			street_address: addressFixtures[0].street_address,
			city: addressFixtures[0].city
		}, {
			id: userFixtures[3].id,
			age: userFixtures[3].age,
			name: userFixtures[3].name,
			user_id: userFixtures[3].id,
			address_id: addressFixtures[0].id,
			street_address: addressFixtures[0].street_address,
			city: addressFixtures[0].city
		}, {
			id: userFixtures[4].id,
			age: userFixtures[4].age,
			name: userFixtures[4].name,
			user_id: userFixtures[4].id,
			address_id: addressFixtures[0].id,
			street_address: addressFixtures[0].street_address,
			city: addressFixtures[0].city
		}, {
			id: userFixtures[0].id,
			age: userFixtures[0].age,
			name: userFixtures[0].name,
			user_id: userFixtures[0].id,
			address_id: addressFixtures[0].id,
			street_address: addressFixtures[0].street_address,
			city: addressFixtures[0].city
		}],
		"select * from `users` order by `name` asc": [userFixtures[0], userFixtures[2], userFixtures[1], userFixtures[4], userFixtures[3]],
		"select * from `users` order by `name` desc": [userFixtures[3], userFixtures[4], userFixtures[1], userFixtures[2], userFixtures[0]],
		"drop table `api_keys`": [],
		"drop table `users`": [],
		"select count(*)": [{ "count": 5 }],
		"select count(*) from `users`": [{ "count": 5 }],
		"insert into `users` (`age`, `id`, `name`) values (34, 6, 'Bob Builder')": [bobBuilder],
		"select * from `users` where `id` = 6": [bobBuilder],
		"create table `users` (`id` int unsigned not null auto_increment primary key, `name` varchar(255), `age` int)": [],
		"create table `api_keys` (`id` int unsigned not null auto_increment primary key, `token` varchar(255))": [],
		"insert into `api_keys` (`id`, `token`) values (1, 'SOMETOKEN')": []
	});
}