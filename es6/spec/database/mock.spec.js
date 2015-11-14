import Database from "../../lib/database.js";
import MockQuery from "../../lib/mockQuery.js";

const databaseConfig = require("../../../database.json").testing;

describe(".mock", () => {
  let database;

  beforeEach(() => {
		database = new Database(databaseConfig);
	});

  it("should return an instance of MockQuery", () => {
		database.mock.should.be.instanceOf(MockQuery);
  });
});
