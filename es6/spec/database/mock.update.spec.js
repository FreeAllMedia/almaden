import Database, {Query} from "../../lib/database.js";

const databaseConfig = require("../../../database.json").testing;

describe(".mock.update(...options)", () => {

  let database,
      mockData;

  beforeEach(() => {
		database = new Database(databaseConfig);
    mockData = {
      name: "Bob",
      age: 46
    };
	});

  it("should return an instance of Query", () => {
    database.mock.update(mockData).should.be.instanceOf(Query);
  });

  it("should return mock results on identical subsequent queries", done => {
    const mockRowsAffected = 1;

    database.mock.update(mockData).into("users").where("id", 1).results(mockRowsAffected);

    database.update(mockData).into("users").where("id", 1).results((error, newId) => {
      if (error) { throw error; }
      newId.should.eql(mockRowsAffected);
      done();
    });
  });

  it("should return mock results for pattern-matched queries", done => {
    const mockRowsAffected = 1;

    database.mock.update(mockData).into(/u.*rs/).where("id", 1).results(mockRowsAffected);

    database.update(mockData).into("users").where("id", 1).results((error, newId) => {
      if (error) { throw error; }
      newId.should.eql(mockRowsAffected);
      done();
    });
  });
});
