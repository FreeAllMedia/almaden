import Database from "../../../lib/database.js";

const databaseConfig = require("../../../../database.json").testing;

describe("query.chain", () => {

  let database;

  beforeEach(() => {
		database = new Database(databaseConfig);
	});

  it("should return an array of chain links from the query", () => {
    database.select("*").from("users").chain.should.eql([
      {name: "select", options: ["*"]},
      {name: "from", options: ["users"]}
    ]);
  });
});
