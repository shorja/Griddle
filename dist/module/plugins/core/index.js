'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _components = require('./components');

var _components2 = _interopRequireDefault(_components);

var _dataReducer = require('./reducers/dataReducer');

var reducer = _interopRequireWildcard(_dataReducer);

var _dataSelectors = require('./selectors/dataSelectors');

var selectors = _interopRequireWildcard(_dataSelectors);

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

var _initialState = require('./initialState');

var _initialState2 = _interopRequireDefault(_initialState);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CorePlugin = function CorePlugin(config) {
  return _extends({
    components: _components2.default,
    reducer: reducer,
    selectors: selectors,
    actions: actions
  }, (0, _initialState2.default)(config));
};

exports.default = CorePlugin;