'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _griddleConnect = require('../../utils/griddleConnect');

var _recompose = require('recompose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EnhancedRow = function EnhancedRow(OriginalComponent) {
  return (0, _recompose.compose)((0, _griddleConnect.connect)(function (state, props) {
    return {};
  }))(function (props) {
    return _react2.default.createElement(
      'div',
      null,
      'a',
      _react2.default.createElement(OriginalComponent, props)
    );
  });
};

exports.default = EnhancedRow;