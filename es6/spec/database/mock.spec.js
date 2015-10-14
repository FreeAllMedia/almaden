import Database from "../../lib/database.js";

const databaseConfig = require("../../../database.json").testing;

describe(".mock", () => {

  let database;

  beforeEach(() => {
		database = new Database(databaseConfig);
	});

  it("should return an instance of itself for chaining", () => {
    database.mock.should.eql(database);
  });
});
