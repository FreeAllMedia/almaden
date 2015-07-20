#!/usr/bin/env node
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _liftoff = require("liftoff");

var _liftoff2 = _interopRequireDefault(_liftoff);

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _packageJson = require("../../package.json");

var _packageJson2 = _interopRequireDefault(_packageJson);

var _interpret = require("interpret");

var _interpret2 = _interopRequireDefault(_interpret);

var _v8flags = require("v8flags");

var _v8flags2 = _interopRequireDefault(_v8flags);

var liftoff = new _liftoff2["default"]({
  name: "almaden",
  extensions: _interpret2["default"].jsVariants,
  v8flags: _v8flags2["default"]
});

liftoff.launch({ cwd: __dirname }, function invoke() {
  _commander2["default"].version(_chalk2["default"].blue("Almaden CLI Version " + _packageJson2["default"].version + "\n")).option("--debug", "Run with debugging");
  _commander2["default"].parse(process.argv);
  _commander2["default"].help();
});