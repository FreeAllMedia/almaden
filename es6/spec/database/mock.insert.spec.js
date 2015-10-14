import Database, {Query} from "../../lib/database.js";

const databaseConfig = require("../../../database.json").testing;

describe(".mock.insert(...options)", () => {

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
    database.mock.insert(mockData).should.be.instanceOf(Query);
  });

  it("should return mock results on identical subsequent queries", done => {
    const mockNewId = 1;

    database.mock.insert(mockData).into("users").results(mockNewId);

    database.insert(mockData).into("users").results((error, newId) => {
      if (error) { throw error; }
      newId.should.eql(mockNewId);
      done();
    });
  });

  it("should return mock results for pattern-matched queries", done => {
    const mockNewId = 1;

    database.mock.insert(mockData).into(/u.*rs/).results(mockNewId);

    database.insert(mockData).into("users").results((error, newId) => {
      if (error) { throw error; }
      newId.should.eql(mockNewId);
      done();
    });
  });
});
