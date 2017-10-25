'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// TODO: refactor this onto the context. We need to handle factories as well


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _getContext = require('recompose/getContext');

var _getContext2 = _interopRequireDefault(_getContext);

var _mapProps = require('recompose/mapProps');

var _mapProps2 = _interopRequireDefault(_mapProps);

var _compose = require('recompose/compose');

var _compose2 = _interopRequireDefault(_compose);

var _dataSelectors = require('../selectors/dataSelectors');

var _griddleConnect = require('../../../utils/griddleConnect');

var _valueUtils = require('../../../utils/valueUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hasWidthOrStyles(cellProperties) {
  return cellProperties.hasOwnProperty('width') || cellProperties.hasOwnProperty('styles');
}

function getCellStyles(cellProperties, originalStyles) {
  if (!hasWidthOrStyles(cellProperties)) {
    return originalStyles;
  }

  var styles = originalStyles;

  // we want to take griddle style object styles, cell specific styles
  if (cellProperties.hasOwnProperty('style')) {
    styles = Object.assign({}, styles, originalStyles, cellProperties.style);
  }

  if (cellProperties.hasOwnProperty('width')) {
    styles = Object.assign({}, styles, { width: cellProperties.width });
  }

  return styles;
}

var mapStateToProps = function mapStateToProps() {
  // TODO: selector factories on the context
  var cellPropertiesSelector = (0, _dataSelectors.cellPropertiesSelectorFactory)();
  return function (state, props) {
    return {
      value: props.selectors.cellValueSelector(state, props),
      customComponent: props.selectors.customComponentSelector(state, props),
      cellProperties: props.selectors.cellPropertiesSelector(state, props),
      className: props.selectors.classNamesForComponentSelector(state, 'Cell'),
      style: props.selectors.stylesForComponentSelector(state, 'Cell')
    };
  };
};

var ComposedCellContainer = function ComposedCellContainer(OriginalComponent) {
  return (0, _compose2.default)((0, _getContext2.default)({
    selectors: _propTypes2.default.object
  }), (0, _griddleConnect.connect)(mapStateToProps), (0, _mapProps2.default)(function (props) {
    return _extends({}, props.cellProperties.extraData, props, {
      className: (0, _valueUtils.valueOrResult)(props.cellProperties.cssClassName, props) || props.className,
      style: getCellStyles(props.cellProperties, props.style),
      value: props.customComponent ? _react2.default.createElement(props.customComponent, _extends({}, props.cellProperties.extraData, props)) : props.value
    });
  }))(function (props) {
    return _react2.default.createElement(OriginalComponent, props);
  });
};

exports.default = ComposedCellContainer;