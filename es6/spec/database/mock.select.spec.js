import Database, {Query} from "../../lib/database.js";

const databaseConfig = require("../../../database.json").testing;

describe(".mock.select(...options)", () => {

  let database,
      mockUsers;

  beforeEach(() => {
		database = new Database(databaseConfig);
    mockUsers = [
      {id: 1, name: "Bob"}
    ];
	});

  it("should return an instance of Query", () => {
    database.mock.select("*").should.be.instanceOf(Query);
  });

  it("should be able to set the table name", () => {
    database.mock.select("*").from("users").should.be.instanceOf(Query);
  });

  it("should be able to set mock results", () => {
    database.mock.select("*").from("users").results(mockUsers);
  });

  it("should return mock results on identical subsequent queries", done => {
    database.mock.select("*").from("users").results(mockUsers);

    database.select("*").from("users").results((error, rows) => {
      if (error) { throw error; }
      rows.should.eql(mockUsers);
      done();
    });
  });

  it("should return mock results for pattern-matched queries", done => {
    database.mock.select(/.*/).from(/u.*rs/).where("created_at", ">", /.*/).results(mockUsers);

    database.select("id").from("users").where("created_at", ">", "2015-10-02 21:39:14").results((error, rows) => {
      if (error) { throw error; }
      rows.should.eql(mockUsers);
      done();
    });
  });
});
