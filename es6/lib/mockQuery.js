import privateData from "incognito";
import Query from "./query.js";

export default class MockQuery extends Query {
    results(mockResults) {
        const _ = privateData(this);
        const mockQueries = privateData(_.database).mockQueries;

        mockQueries.push({
            query: this,
            results: mockResults
        });

        return this;
    }
}
