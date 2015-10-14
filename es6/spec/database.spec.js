// /* jshint camelcase: false */
//
// /**
//  * Test Dependencies
//  */
//
// /**
//  * Get fixtures from files
//  */
// const userFixtures = require("./fixtures/users.json");
// const addressFixtures = require("./fixtures/addresses.json");
//
// /**
//  * Get database config from file
//  */
// const databaseConfig = require("../../database.json").testing;
//
// /**
//  * Check integration with actual database (slow)
//  * or
//  * Mock database with fixed values (fast)
//  */
// const useMockDatabase = false;
//
// import Database, {Query, QuerySpy} from "../lib/database.js";
//
// describe("Database(databaseConfig)", () => {
//
// 	let database;
//
// 	beforeEach(() => {
// 		database = new Database(databaseConfig);
// 		if (useMockDatabase) {
// 			mockDatabase(database);
// 		}
// 	});
//
// 	describe(".config", () => {
// 		it("should return the config provided to the instance", () => {
// 				database.config.should.eql(databaseConfig);
// 		});
//
// 		it("should be read-only", () => {
// 			() => {
// 				database.config = {};
// 			}.should.throw("Cannot set property config of [object Object] which has only a getter");
// 		});
// 	});
//
// 	describe("(instance functions)", () => {
// 		describe(".close(callback)", () => {
// 			let callback;
// 			it("should close connections to the database and callback", done => {
// 				callback = () => {
// 					// TODO: Figure out a way to check if the database is disconnected.
// 					// database
// 					// 	.select("*")
// 					// 	.from("users")
// 					// 	.where("id",1)
// 					// 	.results((error, rows) => {
// 					// 		done(error);
// 					// 	});
// 					done();
// 				};
// 				database.close(callback);
// 			});
// 		});
//
// 		describe("(fixtures)", () => {
// 			describe(".load(fixtures)", () => {
// 				it("should load fixtures into the database", done => {
// 					database.load({
// 						"api_keys": [
// 							{
// 								"id": 1,
// 								"token": "SOMETOKEN"
// 							}
// 						]
// 					}, done);
// 				});
// 			});
// 		});
//
// 		describe("(spying)", () => {
// 			describe("QuerySpy", () => {
// 				let querySpy,
// 					value;
//
// 				beforeEach(() => {
// 					value = {age: 24};
// 					querySpy = new QuerySpy("somekey", value);
// 				});
//
// 				it("should have a callCount property", () => {
// 					querySpy.should.have.property("callCount");
// 				});
//
// 				it("should increase callCount when call is called", () => {
// 					querySpy.call;
// 					querySpy.callCount.should.equal(1);
// 				});
//
// 				it("should return value when call is called", () => {
// 					querySpy.call.should.equal(value);
// 				});
// 			});
//
// 			describe(".spy", () => {
// 				it("should return a QuerySpy object", () => {
// 					database.spy("somequery", [{}]).should.be.instanceOf(QuerySpy);
// 				});
//
// 				describe("(with QuerySpy object)", () => {
// 					beforeEach(() => {
// 						database.mock({});
// 					});
//
// 					it("it should allow to count how many calls where made to the string query", done => {
// 						let spy = database.spy("select * from `users`", [{}, {}]);
// 						database.select("*")
// 							.from("users")
// 							.results(() => {
// 								spy.callCount.should.equal(1);
// 								done();
// 							});
// 					});
//
// 					it("it should allow to count how many calls where made to the regex query", done => {
// 						let spy = database.spy(/select \* from `[a-z]*`/, [{}, {}]);
// 						database.select("*")
// 							.from("users")
// 							.results(() => {
// 								spy.callCount.should.equal(1);
// 								done();
// 							});
// 					});
// 				});
// 			});
// 		});
//
// 		describe("(query chaining)", () => {
// 			let query;
//
// 			beforeEach(() => {
// 				query = database.select("*");
// 			});
//
// 			describe(".select(...columns) ", () => {
// 				it("should return itself to enable function chaining", () => {
// 					query.should.be.instanceOf(Query);
// 				});
// 			});
//
// 			describe(".from(tableName)", () => {
// 				it("should return itself to enable function chaining", () => {
// 					query.from("users").should.be.instanceOf(Query);
// 				});
// 			});
//
// 			describe(".where(...options)", () => {
// 				it("should return itself to enable function chaining", () => {
// 					query.where("id=1").should.be.instanceOf(Query);
// 				});
// 			});
//
// 			describe(".andWhere(...options)", () => {
// 				it("should return itself to enable function chaining", () => {
// 					query.andWhere("id=1").should.be.instanceOf(Query);
// 				});
// 			});
//
// 			describe(".whereNull(...options)", () => {
// 				it("should return itself to enable function chaining", () => {
// 					query.whereNull("id=1").should.be.instanceOf(Query);
// 				});
// 			});
//
// 			describe(".whereNotNull(...options)", () => {
// 				it("should return itself to enable function chaining", () => {
// 					query.whereNotNull("id=1").should.be.instanceOf(Query);
// 				});
// 			});
//
// 			describe(".orWhere(...options)", () => {
// 				it("should return itself to enable function chaining", () => {
// 					query.orWhere("id=1").should.be.instanceOf(Query);
// 				});
// 			});
//
// 			describe(".groupBy(...columnNames)", () => {
// 				it("should return itself to enable function chaining", () => {
// 					query.groupBy("age").should.be.instanceOf(Query);
// 				});
// 			});
//
// 			describe(".orderBy(column, [direction]) ", () => {
// 				it("should return itself to enable function chaining", () => {
// 					query.orderBy("age", "desc").should.be.instanceOf(Query);
// 				});
// 			});
//
// 			describe(".limit(number)", () => {
// 				it("should return itself to enable function chaining", () => {
// 					query.orderBy(1).should.be.instanceOf(Query);
// 				});
// 			});
//
// 			describe("leftJoin(tableName, optionOne, optionTwo)", () => {
// 				it("should return itself to enable function chaining", () => {
// 					query.leftJoin("accounts", "users.id", "accounts.user_id").should.be.instanceOf(Query);
// 				});
// 			});
//
// 		});
//
// 		describe(".results(callback)", () => {
// 			it("should return an error if not a valid query stack has been build", () => {
// 				() => {
// 					database.results();
// 				}.should.throw("Cannot perform query without valid query stack. See docs for proper usage.");
// 			});
// 		});
//
// 		describe(".toString()", () => {
// 			it("should return a string of the query", () => {
// 				database
// 					.select("*")
// 					.from("users")
// 					.toString()
// 					.should.eql("select * from `users`");
// 			});
// 		});
//
// 		describe(".count([column], callback)", () => {
// 			it("should return itself to enable function chaining", () => {
// 				database.count().should.be.instanceOf(Query);
// 			});
// 		});
//
// 		describe(".raw(sqlString, callback)", () => {
// 			it("should execute a raw query and return an error if the database is not set");
// 			it("should execute a raw query and return results");
// 			it("should execute a raw query and return an empty array if no results");
// 		});
//
// 		describe(".dropTable(tableName)", () => {
// 			it("should return itself to enable function chaining", () => {
// 				database.dropTable().should.be.instanceOf(Query);
// 			});
//
// 			it("should drop the table from the database", done => {
// 				database
// 					.dropTable("users")
// 					.results((errors) => {
// 						(errors === null).should.be.true;
// 						done();
// 					});
// 			});
// 		});
//
// 		describe(".insert(data)", () => {
// 			it("should return itself to enable function chaining", () => {
// 				database.insert().should.be.instanceOf(Query);
// 			});
//
// 			it("should insert a row into the table", done => {
// 				database
// 					.insert({
// 						"id": 6,
// 						"name": "Bob Builder",
// 						"age": 34
// 					})
// 					.into("users")
// 					.results((errors) => {
// 						database
// 							.select("*")
// 							.from("users")
// 							.where("id",6)
// 							.results((errors, rows) => {
// 								rows[0].name.should.eql("Bob Builder");
// 								done();
// 							});
// 					});
// 			});
// 		});
//
// 		describe(".update(data)", () => {
// 			let newPerson;
//
// 			beforeEach(() => {
// 				newPerson = {
// 					id: 1,
// 					name: "Linda Kirsten",
// 					age: 35
// 				};
// 				database.mock({
// 					"select * from `users` where `id` = 1": [newPerson],
// 					"update `users` set `age` = 25, `name` = 'Linda Kirsten' where `id` = 1": [1]
// 				});
// 			});
//
// 			it("should return itself to enable function chaining", () => {
// 				database.update().should.be.instanceOf(Query);
// 			});
//
// 			it("should update a row into the table", done => {
// 				database
// 					.update({
// 						"name": "Linda Kirsten",
// 						"age": 25
// 					})
// 					.into("users")
// 					.where("id", "=", 1)
// 					.results(() => {
// 						database
// 							.select("*")
// 							.from("users")
// 							.where("id", 1)
// 							.results((errors, rows) => {
// 								rows[0].name.should.eql("Linda Kirsten");
// 								done();
// 							});
// 					});
// 			});
// 		});
//
// 		describe(".delete()", () => {
//
// 			beforeEach(() => {
// 				database.mock({
// 					"select * from `users` where `id` = 1": [],
// 					"delete from `users` where `id` = 1": [1]
// 				});
// 			});
//
// 			it("should return itself to enable function chaining", () => {
// 				database.delete().should.be.instanceOf(Query);
// 			});
//
// 			it("should delete a row into the table", done => {
// 				database
// 					.delete()
// 					.from("users")
// 					.where("id", "=", 1)
// 					.results(() => {
// 						database
// 							.select("*")
// 							.from("users")
// 							.where("id", 1)
// 							.results((errors, rows) => {
// 								rows.length.should.equal(0);
// 								done();
// 							});
// 					});
// 			});
// 		});
//
// 		describe(".into(tableName)", () => {
// 			it("should return itself to enable function chaining", () => {
// 				database.insert({}).into().should.be.instanceOf(Query);
// 			});
// 		});
//
// 		describe(".createTable(tableName, tableConstructor)", () => {
// 			it("should return itself to enable function chaining", () => {
// 				database.createTable().should.be.instanceOf(Query);
// 			});
//
// 			xit("should insert a row into the table", done => {
// 				database
// 					.createTable("users", (table) => {
// 						table.increments();
// 						table.string("name");
// 						table.integer("age");
// 					})
// 					.results(() => {
// 						// TODO: Check if table exists
// 						done();
// 					});
// 			});
// 		});
//
// 		describe(".createDatabase(databaseName)", () => {
// 			it("should create a new database of the designated name", done => {
// 				database.mock({
// 					"create database some_database": [{}]
// 				});
//
// 				const databaseName = "some_database";
//
// 				database
// 					.createDatabase(databaseName)
// 					.results(() => {
// 						done();
// 					});
// 			});
// 		});
//
// 		describe("(multiple querying)", () => {
// 			it("should allow to execute two count queries withouth getting the query chain messed up", done => {
// 				database
// 					.count("*")
// 					.from("users")
// 					.results(() => {
// 						database
// 							.count("*")
// 							.from("users")
// 							.results(() => {
// 								done();
// 							});
// 					});
// 			});
// 		});
//
// 		//Test scenarios for combinations will be hughe with many complex data mocked up
// 		//so we may want to do this as we go just for what we need to, by TDD
// 		//find,where,limit,groupBy,orderBy,leftJoin,rightJoin, innerJoing and results x count
// 		describe("(when chaining)", () => {
// 			describe("(chaining .select.from.results)", () => {
// 				it("should return all results", done => {
// 					database.select("*").from("users").results((error, rows) => {
// 						rows.should.eql([
// 							userFixtures[1],
// 							userFixtures[2],
// 							userFixtures[3],
// 							userFixtures[4],
// 							userFixtures[0]
// 						]);
// 						done();
// 					});
// 				});
// 			});
//
// 			describe("(chaining .select.from.where.results)", () => {
// 				it("should have the ability to return a specific record", done => {
// 					database
// 						.select("*")
// 						.from("users")
// 						.where("id", 2)
// 						.results((error, rows) => {
// 							rows.should.eql([
// 								userFixtures[2]
// 							]);
// 							done();
// 						});
// 				});
// 				it("should return a range of specific records", done => {
// 					database
// 						.select("*")
// 						.from("users")
// 						.where("id", ">", 2)
// 						.results((error, rows) => {
// 							rows.should.eql([
// 								userFixtures[3],
// 								userFixtures[4],
// 								userFixtures[0]
// 							]);
// 							done();
// 						});
// 				});
// 			});
//
// 			describe("(chaining .select.from.where.andWhere.results)", () => {
// 				it("should have the ability to return a specific record", done => {
// 					database.mock({
// 						"select * from `users` where `id` = 2 and `name` = 'Gene Belcher'":
// 							[userFixtures[2]]
// 					});
//
// 					database
// 						.select("*")
// 						.from("users")
// 						.where("id", 2)
// 						.andWhere("name", "Gene Belcher")
// 						.results((error, rows) => {
// 							rows.should.eql([
// 								userFixtures[2]
// 							]);
// 							done();
// 						});
// 				});
// 			});
//
// 			describe("(chaining .select.from.where.orWhere.results)", () => {
// 				it("should have the ability to return a specific record", done => {
// 					database.mock({
// 						"select * from `users` where `id` = 2 or `name` = 'Gene Belcher'":
// 							[userFixtures[2]]
// 					});
//
// 					database
// 						.select("*")
// 						.from("users")
// 						.where("id", 2)
// 						.orWhere("name", "Gene Belcher")
// 						.results((error, rows) => {
// 							rows.should.eql([
// 								userFixtures[2]
// 							]);
// 							done();
// 						});
// 				});
// 			});
//
// 			describe("(chained with a .select.from.limit(1))", () => {
// 				it("should return the designated number of results", done => {
// 					database
// 						.select("*")
// 						.from("users")
// 						.limit(3)
// 						.results((error, rows) => {
// 						rows.should.eql([
// 							userFixtures[1],
// 							userFixtures[2],
// 							userFixtures[3]
// 						]);
// 						done();
// 					});
// 				});
// 			});
//
// 			describe("(chained with a .select.from.groupBy)", () => {
// 				it("should group results by the designated column", done => {
// 					database
// 						.select("*")
// 						.from("users")
// 						.groupBy("name")
// 						.results((error, rows) => {
// 							rows.should.eql([
// 								userFixtures[0],
// 								userFixtures[2],
// 								userFixtures[1],
// 								userFixtures[4],
// 								userFixtures[3]
// 							]);
// 							done();
// 						});
// 				});
// 			});
//
// 			describe("(chained with a .select.from.leftJoin)", () => {
// 				/* eslint-disable camelcase */
// 				it("should join results from another table", done => {
// 					database
// 						.select("*")
// 						.from("users")
// 						.leftJoin("user_addresses", "users.id", "user_addresses.user_id")
// 						.results((error, rows) => {
// 							rows[0].should.eql({
// 								id: userFixtures[1].id,
// 								age: userFixtures[1].age,
// 								name: userFixtures[1].name,
// 								address_id: addressFixtures[0].id,
// 								user_id: userFixtures[1].id
// 							});
// 							done();
// 						});
// 				});
//
// 				it("should join results from more than one table", done => {
// 					database
// 						.select("*")
// 						.from("users")
// 						.leftJoin("user_addresses", "users.id", "user_addresses.user_id")
// 						.leftJoin("addresses", "addresses.id", "user_addresses.address_id")
// 						.results((error, rows) => {
// 							rows[0].should.eql({
// 								id: userFixtures[1].id,
// 								age: userFixtures[1].age,
// 								name: userFixtures[1].name,
// 								street_address: addressFixtures[0].street_address,
// 								city: addressFixtures[0].city,
// 								address_id: addressFixtures[0].id,
// 								user_id: userFixtures[1].id
// 							});
// 							done();
// 						});
// 				});
// 			});
//
// 			describe("(chained with a .select.from.orderBy)", () => {
// 				it("should order the results in ascending order by the designated column", done => {
// 					database
// 						.select("*")
// 						.from("users")
// 						.orderBy("name")
// 						.results((error, rows) => {
// 							rows.should.eql([
// 								userFixtures[0],
// 								userFixtures[2],
// 								userFixtures[1],
// 								userFixtures[4],
// 								userFixtures[3]
// 							]);
// 							done();
// 						});
// 				});
//
// 				it("should order the results in descending order by the designated column", done => {
// 					database
// 						.select("*")
// 						.from("users")
// 						.orderBy("name", "desc")
// 						.results((error, rows) => {
// 							rows.should.eql([
// 								userFixtures[3],
// 								userFixtures[4],
// 								userFixtures[1],
// 								userFixtures[2],
// 								userFixtures[0]
// 							]);
// 							done();
// 						});
// 				});
// 			});
// 		});
// 	});
// });
//
// function mockDatabase(database) {
// 	const naturalOrderUserFixtures = [
// 		userFixtures[1],
// 		userFixtures[2],
// 		userFixtures[3],
// 		userFixtures[4],
// 		userFixtures[0]
// 	];
//
// 	const bobBuilder = {
// 		"id": 6,
// 		"name": "Bob Builder",
// 		"age": 34
// 	};
//
// 	database.mock({
// 		"select * from `users`": naturalOrderUserFixtures,
// 		"select * from `users` where `id` = 2": [
// 			userFixtures[2]
// 		],
// 		"select * from `users` where `id` > 2": [
// 			userFixtures[3],
// 			userFixtures[4],
// 			userFixtures[0]
// 		],
// 		"select * from `users` group by `name`": [
// 			userFixtures[0],
// 			userFixtures[2],
// 			userFixtures[1],
// 			userFixtures[4],
// 			userFixtures[3]
// 		],
// 		"select * from `users` limit 3": [
// 			userFixtures[1],
// 			userFixtures[2],
// 			userFixtures[3]
// 		],
// 		"select * from `users` left join `user_addresses` on `users`.`id` = `user_addresses`.`user_id`": [
// 			{
// 				id: userFixtures[1].id,
// 				age: userFixtures[1].age,
// 				name: userFixtures[1].name,
// 				user_id: userFixtures[1].id,
// 				address_id: addressFixtures[0].id
// 			},
// 			{
// 				id: userFixtures[2].id,
// 				age: userFixtures[2].age,
// 				name: userFixtures[2].name,
// 				user_id: userFixtures[2].id,
// 				address_id: addressFixtures[0].id
// 			},
// 			{
// 				id: userFixtures[3].id,
// 				age: userFixtures[3].age,
// 				name: userFixtures[3].name,
// 				user_id: userFixtures[3].id,
// 				address_id: addressFixtures[0].id
// 			},
// 			{
// 				id: userFixtures[4].id,
// 				age: userFixtures[4].age,
// 				name: userFixtures[4].name,
// 				user_id: userFixtures[4].id,
// 				address_id: addressFixtures[0].id
// 			},
// 			{
// 				id: userFixtures[0].id,
// 				age: userFixtures[0].age,
// 				name: userFixtures[0].name,
// 				user_id: userFixtures[0].id,
// 				address_id: addressFixtures[0].id
// 			}
// 		],
// 		"select * from `users` left join `user_addresses` on `users`.`id` = `user_addresses`.`user_id` left join `addresses` on `addresses`.`id` = `user_addresses`.`address_id`": [
// 			{
// 				id: userFixtures[1].id,
// 				age: userFixtures[1].age,
// 				name: userFixtures[1].name,
// 				user_id: userFixtures[1].id,
// 				address_id: addressFixtures[0].id,
// 				street_address: addressFixtures[0].street_address,
// 				city: addressFixtures[0].city
// 			},
// 			{
// 				id: userFixtures[2].id,
// 				age: userFixtures[2].age,
// 				name: userFixtures[2].name,
// 				user_id: userFixtures[2].id,
// 				address_id: addressFixtures[0].id,
// 				street_address: addressFixtures[0].street_address,
// 				city: addressFixtures[0].city
// 			},
// 			{
// 				id: userFixtures[3].id,
// 				age: userFixtures[3].age,
// 				name: userFixtures[3].name,
// 				user_id: userFixtures[3].id,
// 				address_id: addressFixtures[0].id,
// 				street_address: addressFixtures[0].street_address,
// 				city: addressFixtures[0].city
// 			},
// 			{
// 				id: userFixtures[4].id,
// 				age: userFixtures[4].age,
// 				name: userFixtures[4].name,
// 				user_id: userFixtures[4].id,
// 				address_id: addressFixtures[0].id,
// 				street_address: addressFixtures[0].street_address,
// 				city: addressFixtures[0].city
// 			},
// 			{
// 				id: userFixtures[0].id,
// 				age: userFixtures[0].age,
// 				name: userFixtures[0].name,
// 				user_id: userFixtures[0].id,
// 				address_id: addressFixtures[0].id,
// 				street_address: addressFixtures[0].street_address,
// 				city: addressFixtures[0].city
// 			}
// 		],
// 		"select * from `users` order by `name` asc": [
// 			userFixtures[0],
// 			userFixtures[2],
// 			userFixtures[1],
// 			userFixtures[4],
// 			userFixtures[3]
// 		],
// 		"select * from `users` order by `name` desc": [
// 			userFixtures[3],
// 			userFixtures[4],
// 			userFixtures[1],
// 			userFixtures[2],
// 			userFixtures[0]
// 		],
// 		"drop table `api_keys`": [],
// 		"drop table `users`": [],
// 		"select count(*)": [
// 			{"count": 5}
// 		],
// 		"select count(*) from `users`": [
// 			{"count": 5}
// 		],
// 		"insert into `users` (`age`, `id`, `name`) values (34, 6, 'Bob Builder')": [
// 			bobBuilder
// 		],
// 		"select * from `users` where `id` = 6": [
// 			bobBuilder
// 		],
// 		"create table `users` (`id` int unsigned not null auto_increment primary key, `name` varchar(255), `age` int)": [],
// 		"create table `api_keys` (`id` int unsigned not null auto_increment primary key, `token` varchar(255))": [],
// 		"insert into `api_keys` (`id`, `token`) values (1, 'SOMETOKEN')": []
// 	});
// }
