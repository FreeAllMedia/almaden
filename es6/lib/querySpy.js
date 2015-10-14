import privateData from "incognito";

export default class QuerySpy {
	constructor(query, value) {
		privateData(this).calls = 0;
		privateData(this).query = query;
		privateData(this).value = value;
	}

	get called() {
		return privateData(this).calls > 0;
	}

	get callCount() {
		return privateData(this).calls;
	}

	get call() {
		privateData(this).calls += 1;
		return privateData(this).value;
	}
}
