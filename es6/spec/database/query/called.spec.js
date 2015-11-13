import Database from "../../../../";
import {testing as databaseCredentials} from "../../../../database.json";

describe("query.called", () => {
		let database,
				insertData,
				tableName,
				query,
				id;

		beforeEach(() => {
				database = new Database(databaseCredentials);

				id = 1;

				insertData = {
						name: "Bob"
				};

				tableName = "users";

				query = database
						.insert(insertData)
						.into(tableName);

				database.mock
						.insert(insertData)
						.into(tableName)
						.results(id);
		});

		it("should return true if the query was executed", done => {
				query.results((error) => {
					query.called.should.be.true;
					done(error);
				});
		});

		it("should return false if the query was not executed", () => {
				query.called.should.be.false;
		});
});
