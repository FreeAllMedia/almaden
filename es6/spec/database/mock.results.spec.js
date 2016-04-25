import Database from "../../lib/database.js";

const databaseConfig = require("../../../database.json").testing;

describe(".mock.results(mockResults)", () => {
  let database;

  beforeEach(() => {
		database = new Database(databaseConfig);
	});

  it("should return the mock query", () => {
		const mockQuery = database.mock;
		mockQuery.select("*").from("users").should.equal(mockQuery);
  });

	it("should increment the call count when subsequent matching queries are executed", done => {
		const user = {
			id: "cigyn1qip0000nxz84cv3bwu6",
			name: "Bob"
		};

		const mockQuery = database.mock
			.select("*")
			.from("users")
			.results(user);

		database
			.select("*")
			.from("users")
			.results(() => {
				mockQuery.called.should.be.true;
				done();
			});
	});

	it("should increment the call count more than once", done => {
		const user = {
			id: "cigyn1qip0000nxz84cv3bwu6",
			name: "Bob"
		};

		let mockQuery = database.mock
			.select("*")
			.from("users")
			.results(user);

		const query = database.select("*").from("users");

		query.results(() => {
				query.results(() => {
						mockQuery.calls.should.eql(2);
						done();
					});
			});
	});
});
