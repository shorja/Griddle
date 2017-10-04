'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _griddleConnect = require('../utils/griddleConnect');

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _mapProps = require('recompose/mapProps');

var _mapProps2 = _interopRequireDefault(_mapProps);

var _getContext = require('recompose/getContext');

var _getContext2 = _interopRequireDefault(_getContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

//import { visibleRowIdsSelector, classNamesForComponentSelector, stylesForComponentSelector } from '../selectors/dataSelectors';

var ComposedTableBodyContainer = function ComposedTableBodyContainer(OriginalComponent) {
  return (0, _compose2.default)((0, _getContext2.default)({
    components: _propTypes2.default.object,
    selectors: _propTypes2.default.object
  }), (0, _griddleConnect.connect)(function (state, props) {
    return {
      visibleRowIds: props.selectors.visibleRowIdsSelector(state),
      className: props.selectors.classNamesForComponentSelector(state, 'TableBody'),
      style: props.selectors.stylesForComponentSelector(state, 'TableBody')
    };
  }), (0, _mapProps2.default)(function (props) {
    var components = props.components,
        selectors = props.selectors,
        otherProps = _objectWithoutProperties(props, ['components', 'selectors']);

    return _extends({
      Row: props.components.Row
    }, otherProps);
  }))(function (_ref) {
    var Row = _ref.Row,
        visibleRowIds = _ref.visibleRowIds,
        style = _ref.style,
        className = _ref.className;
    return _react2.default.createElement(OriginalComponent, {
      rowIds: visibleRowIds,
      Row: Row,
      style: style,
      className: className
    });
  });
};

exports.default = ComposedTableBodyContainer;