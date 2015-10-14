import Database, {Query} from "../../lib/database.js";

const databaseConfig = require("../../../database.json").testing;

const userFixtures = require("../fixtures/users.json");

describe(".update(data)", () => {

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
      database.mock.update({
        name: fixture.name,
        age: fixture.age
      }).into(tableName).where("id", fixture.id).results(1);
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
    database.update({
      name: fixture.name,
      age: fixture.age
    }).should.be.instanceOf(Query);
  });

  it("should be able to set the table name", () => {
    database.update({
      name: fixture.name,
      age: fixture.age
    }).into(tableName).should.be.instanceOf(Query);
  });

  it("should update into the designated table", done => {
    database.update({
      name: fixture.name,
      age: fixture.age
    }).into(tableName).where("id", fixture.id).results((error, rowsAffected) => {
      if (error) { throw error; }
      rowsAffected.should.eql(1);
      done();
    });
  });
});
