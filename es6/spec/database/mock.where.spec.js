import Database from "../../lib/database.js";

const databaseConfig = require("../../../database.json").testing;

describe(".mock.where(...options)", () => {
	let database,
		mockUsers;

	beforeEach(() => {
		database = new Database(databaseConfig);
		mockUsers = [
			{id: 1, name: "Bob"}
		];
	});

	it("should treat where equals to andWhere", done => {
		const name = "aName";

		database.mock.select("*").from("users").where("created_at", ">", /.*/).where("name", name).results(mockUsers);

		database.select("*").from("users").where("created_at", ">", "2015-10-02 21:39:14").andWhere("name", name).results((error, rows) => {
			if (error) { throw error; }
			rows.should.eql(mockUsers);
			done();
		});
	});

	it("should use equals as the default operator", done => {
		database.mock.select("*").from("users").where("id", 1).results(mockUsers);

		database.select("*").from("users").where("id", "=", 1).results((error, rows) => {
			if (error) { throw error; }
			rows.should.eql(mockUsers);
			done();
		});
	});
});
