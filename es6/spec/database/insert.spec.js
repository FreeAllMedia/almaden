import Database, {Query} from "../../lib/database.js";

const databaseConfig = require("../../../database.json").testing;

const userFixtures = require("../fixtures/users.json");

describe(".insert(data)", () => {

  let database,
      tableName,
      fixture,
      fixtures;

  beforeEach(done => {
		database = new Database(databaseConfig);
    tableName = "users";

    fixtures = userFixtures;
    fixture = fixtures[0];

    if (databaseConfig.useMocking) {
      database.mock.insert({
        name: fixture.name,
        age: fixture.age
      }).into(tableName).results([6]);
      done();
    } else {
      database.load({
        users: fixtures
      }, done);
    }
	});

  afterEach(done => {
    database.close(done);
  });

  it("should return an instance of Query", () => {
    database.insert({
      name: fixture.name,
      age: fixture.age
    }).should.be.instanceOf(Query);
  });

  it("should be able to set the table name", () => {
    database.insert({
      name: fixture.name,
      age: fixture.age
    }).into(tableName).should.be.instanceOf(Query);
  });

  it("should insert into the designated table", done => {
    database.insert({
      name: fixture.name,
      age: fixture.age
    }).into(tableName).results((error, newId) => {
      if (error) { throw error; }
      newId.should.eql([fixtures.length + 1]);
      done();
    });
  });
});
