import Database, {Query} from "../../lib/database.js";

const databaseConfig = require("../../../database.json").testing;

const userFixtures = require("../fixtures/users.json");

describe(".select(...columnNames)", () => {

  let database,
      columnNames,
      tableName,
      fixtures;

  beforeEach(done => {
		database = new Database(databaseConfig);
    columnNames = "*";
    tableName = "users";

    fixtures = [ // Sorted by id by default
      userFixtures[1],
      userFixtures[2],
      userFixtures[3],
      userFixtures[4],
      userFixtures[0]
    ];

    if (databaseConfig.useMocking) {
      database.mock.select(columnNames).from(tableName).results(fixtures);
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
    database.select(columnNames).should.be.instanceOf(Query);
  });

  it("should be able to set the table name", () => {
    database.select(columnNames).from(tableName).should.be.instanceOf(Query);
  });

  it("should select from the designated table", done => {
    database.select(columnNames).from(tableName).results((error, rows) => {
      if (error) { throw error; }
      rows.should.eql(fixtures);
      done();
    });
  });
});
