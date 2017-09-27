'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _getContext = require('recompose/getContext');

var _getContext2 = _interopRequireDefault(_getContext);

var _griddleConnect = require('../utils/griddleConnect');

var _actions = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EnhancedFilter = function EnhancedFilter(OriginalComponent) {
  return (0, _compose2.default)((0, _getContext2.default)({
    selectors: _propTypes2.default.object
  }), (0, _griddleConnect.connect)(function (state, props) {
    return {
      className: props.selectors.classNamesForComponentSelector(state, 'Filter'),
      style: props.selectors.stylesForComponentSelector(state, 'Filter')
    };
  }, { setFilter: _actions.setFilter }))(function (props) {
    return _react2.default.createElement(OriginalComponent, props);
  });
};

//import { classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';
exports.default = EnhancedFilter;