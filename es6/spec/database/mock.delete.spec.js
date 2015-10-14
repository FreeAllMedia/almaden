import Database, {Query} from "../../lib/database.js";

const databaseConfig = require("../../../database.json").testing;

describe(".mock.delete(...options)", () => {

  let database;

  beforeEach(() => {
		database = new Database(databaseConfig);
	});

  it("should return an instance of Query", () => {
    database.mock.delete.should.be.instanceOf(Query);
  });

  it("should return mock results on identical subsequent queries", done => {
    database.mock.delete.from("users").where("id", 1).results();

    database.delete.from("users").where("id", 1).results((error) => {
      if (error) { throw error; }
      done();
    });
  });

  it("should return mock results for pattern-matched queries", done => {
    database.mock.delete.from(/u.*rs/).where("id", 1).results();

    database.delete.from("users").where("id", 1).results((error) => {
      if (error) { throw error; }
      done();
    });
  });
});
