import Database from "../../../lib/database.js";

const databaseConfig = require("../../../../database.json").testing;

describe("query.results(callback)", () => {

	let database;
	let query;

	beforeEach(() => {
		database = new Database(databaseConfig);
		query = database.select("*").from("users");
	});

	it("should return the query", () => {
		query.results(() => {}).should.eql(query);
	});
});
