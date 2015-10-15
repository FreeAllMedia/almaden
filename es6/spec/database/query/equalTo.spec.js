import Database from "../../../lib/database.js";

const databaseConfig = require("../../../../database.json").testing;

describe(".equalTo(query)", () => {

  let database,
    mockUsers;

  beforeEach(() => {
		database = new Database(databaseConfig);
    mockUsers = [
      {id: 1, name: "Bob"}
    ];
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

  it("should compare simple queries with object parameters that are equal and return true", () => {
    const data = {
      name: "Bob",
      age: 46
    };

    const queryA = database.insert(data).into("users");
    const queryB = database.insert(data).into("users");

    queryA.equalTo(queryB).should.be.true;
  });
  it("should compare simple queries with object parameters that are not equal and return false", () => {
    const dataA = {
      name: "Bob",
      age: 46
    };

    const dataB = {
      name: "Linda",
      age: 42
    };

    const queryA = database.insert(dataA).into("users");
    const queryB = database.insert(dataB).into("users");

    queryA.equalTo(queryB).should.be.false;
  });

  it("should compare simple queries with regex object parameters that match and return true", () => {
    const data = {
      name: "Bob",
      age: 46
    };

    const queryA = database.insert(data).into("users");
    const queryB = database.insert({
      name: /B.b/,
      age: /[0-9]*/
    }).into("users");

    queryA.equalTo(queryB).should.be.true;
  });

  it("should compare simple queries with regex object parameters that do not match and return false", () => {
    const data = {
      name: "Bob",
      age: 46
    };

    const queryA = database.insert(data).into("users");
    const queryB = database.insert({
      name: /L.*a/,
      age: /[a-zA-Z]*/
    }).into("users");

    queryA.equalTo(queryB).should.be.false;
  });

  describe("(where)", () => {
    it("should treat where equals to andWhere", done => {
      const name = "aName";

      database.mock.select(/.*/).from(/u.*rs/).where("created_at", ">", /.*/).where("name", name).results(mockUsers);

      database.select("id").from("users").where("created_at", ">", "2015-10-02 21:39:14").andWhere("name", name).results((error, rows) => {
        if (error) { throw error; }
        rows.should.eql(mockUsers);
        done();
      });
    });

    it("should use equals as the default operator", done => {
      database.mock.select(/.*/).from(/u.*rs/).where("id", 1).results(mockUsers);

      database.select("id").from("users").where("id", "=", 1).results((error, rows) => {
        if (error) { throw error; }
        rows.should.eql(mockUsers);
        done();
      });
    });
  });

  it("should compare complex queries that are equal and return true");
  it("should compare complex queries that are not equal and return false");
});
