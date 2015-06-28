import Almaden from "../lib/almaden.js";

describe("Almaden", () => {
	let component;

	before(() => {
		component = new Almaden();
	});

	it("should say something", () => {
		component.saySomething().should.equal("Something");
	});
});
