import Database, {Query} from "../../lib/database.js";

const databaseConfig = require("../../../database.json").testing;

const userFixtures = require("../fixtures/users.json");

describe(".delete", () => {

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
      database.mock.delete.from(tableName).where("id", fixture.id).results();
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
    database.delete.should.be.instanceOf(Query);
  });

  it("should be able to set the table name", () => {
    database.delete.from(tableName).should.be.instanceOf(Query);
  });

  it("should delete from the designated table", done => {
    database.delete.from(tableName).where("id", fixture.id).results((error) => {
      if (error) { throw error; }
      done();
    });
  });
});
