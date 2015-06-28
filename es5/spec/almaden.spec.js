"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _libAlmadenJs = require("../lib/almaden.js");

var _libAlmadenJs2 = _interopRequireDefault(_libAlmadenJs);

describe("Almaden", function () {
	var component = undefined;

	before(function () {
		component = new _libAlmadenJs2["default"]();
	});

	it("should say something", function () {
		component.saySomething().should.equal("Something");
	});
});