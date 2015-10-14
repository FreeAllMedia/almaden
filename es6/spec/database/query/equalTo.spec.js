import Database from "../../../lib/database.js";

const databaseConfig = require("../../../../database.json").testing;

describe(".equalTo(query)", () => {

  let database;

  beforeEach(() => {
		database = new Database(databaseConfig);
	});

  it("should compare simple queries that are equal and return true", () => {
    const queryA = database.select("*").from("users");
    const queryB = database.select("*").from("users");

    queryA.equalTo(queryB).should.be.true;
  });
  it("should compare simple queries that are not equal and return false", () => {
    const queryA = database.select("*").from("users");
    const queryB = database.select("*").from("trucks");

    queryA.equalTo(queryB).should.be.false;
  });

  it("should compare complex queries that are equal and return true");
  it("should compare complex queries that are not equal and return false");
});
