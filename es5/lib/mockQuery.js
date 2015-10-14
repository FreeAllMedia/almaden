"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _bind = Function.prototype.bind;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _mockSelectQueryJs = require("./mockSelectQuery.js");

var _mockSelectQueryJs2 = _interopRequireDefault(_mockSelectQueryJs);

var MockQuery = (function () {
  function MockQuery(database) {
    _classCallCheck(this, MockQuery);

    var _ = (0, _incognito2["default"])(this);
    _.database = database;
  }

  _createClass(MockQuery, [{
    key: "select",
    value: function select() {
      for (var _len = arguments.length, columnNames = Array(_len), _key = 0; _key < _len; _key++) {
        columnNames[_key] = arguments[_key];
      }

      return new (_bind.apply(_mockSelectQueryJs2["default"], [null].concat(columnNames, [(0, _incognito2["default"])(this).database])))();
    }
  }]);

  return MockQuery;
})();

exports["default"] = MockQuery;
module.exports = exports["default"];