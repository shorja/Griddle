'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _forIn2 = require('lodash/forIn');

var _forIn3 = _interopRequireDefault(_forIn2);

var _pickBy2 = require('lodash/pickBy');

var _pickBy3 = _interopRequireDefault(_pickBy2);

var _flatten2 = require('lodash/flatten');

var _flatten3 = _interopRequireDefault(_flatten2);

var _compact2 = require('lodash/compact');

var _compact3 = _interopRequireDefault(_compact2);

var _merge2 = require('lodash/merge');

var _merge3 = _interopRequireDefault(_merge2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _redux = require('redux');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactRedux = require('react-redux');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _settingsComponentObjects = require('./settingsComponentObjects');

var _settingsComponentObjects2 = _interopRequireDefault(_settingsComponentObjects);

var _compositionUtils = require('./utils/compositionUtils');

var _sortUtils = require('./utils/sortUtils');

var _listenerUtils = require('./utils/listenerUtils');

var _selectorUtils = require('./utils/selectorUtils');

var _core = require('./plugins/core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//import * as dataReducers from './reducers/dataReducer';
//import components from './components';

//import * as selectors from './selectors/dataSelectors';

//import { getColumnProperties } from './utils/columnUtils';
//import { getRowProperties } from './utils/rowUtils';

//import * as actions from './actions';

//const defaultEvents = {
//  ...actions,
//  onFilter: actions.setFilter,
//  setSortProperties
//};

var Griddle = function (_Component) {
  _inherits(Griddle, _Component);

  function Griddle(props) {
    _classCallCheck(this, Griddle);

    var _this = _possibleConstructorReturn(this, (Griddle.__proto__ || Object.getPrototypeOf(Griddle)).call(this, props));

    _this.getStoreKey = function () {
      return _this.props.storeKey || Griddle.storeKey || 'store';
    };

    var baselinePlugin = props.baselinePlugin,
        _props$plugins = props.plugins,
        plugins = _props$plugins === undefined ? [] : _props$plugins,
        data = props.data,
        rowPropertiesComponent = props.children,
        _props$events = props.events,
        events = _props$events === undefined ? {} : _props$events,
        _props$sortProperties = props.sortProperties,
        sortProperties = _props$sortProperties === undefined ? {} : _props$sortProperties,
        _props$styleConfig = props.styleConfig,
        styleConfig = _props$styleConfig === undefined ? {} : _props$styleConfig,
        importedPageProperties = props.pageProperties,
        userComponents = props.components,
        _props$renderProperti = props.renderProperties,
        userRenderProperties = _props$renderProperti === undefined ? {} : _props$renderProperti,
        userSettingsComponentObjects = props.settingsComponentObjects,
        _props$storeKey = props.storeKey,
        storeKey = _props$storeKey === undefined ? Griddle.storeKey || 'store' : _props$storeKey,
        _props$reduxMiddlewar = props.reduxMiddleware,
        reduxMiddleware = _props$reduxMiddlewar === undefined ? [] : _props$reduxMiddlewar,
        _props$listeners = props.listeners,
        listeners = _props$listeners === undefined ? {} : _props$listeners,
        userInitialState = _objectWithoutProperties(props, ['baselinePlugin', 'plugins', 'data', 'children', 'events', 'sortProperties', 'styleConfig', 'pageProperties', 'components', 'renderProperties', 'settingsComponentObjects', 'storeKey', 'reduxMiddleware', 'listeners']);

    var blPlugin = void 0;
    if (baselinePlugin) {
      console.log("using user provided baseline plugin");
      blPlugin = baselinePlugin;
    } else {
      console.log("using CorePlugin");
      blPlugin = _core2.default;
    }
    switch (typeof blPlugin === 'undefined' ? 'undefined' : _typeof(blPlugin)) {
      case 'function':
        plugins.unshift(blPlugin(props));
        break;
      case 'object':
        plugins.unshift(blPlugin);
        break;
    };

    _this.plugins = plugins;

    //Combine / compose the reducers to make a single, unified reducer
    //const reducers = buildGriddleReducer([dataReducers, ...plugins.map(p => p.reducer)]);
    var reducers = (0, _compositionUtils.buildGriddleReducer)([].concat(_toConsumableArray(plugins.map(function (p) {
      return p.reducer;
    }))));

    //Combine / Compose the components to make a single component for each component type
    //this.components = buildGriddleComponents([components, ...plugins.map(p => p.components), userComponents]);
    _this.components = (0, _compositionUtils.buildGriddleComponents)([].concat(_toConsumableArray(plugins.map(function (p) {
      return p.components;
    })), [userComponents]));

    // NOTE this goes on the context which for the purposes of breaking out the 
    // 'core' code into a plugin is somewhat of a problem as it should
    // be associated with the core code not general griddle code.
    _this.settingsComponentObjects = Object.assign.apply(Object, [{}].concat(_toConsumableArray(plugins.map(function (p) {
      return p.settingsComponentObjects;
    })), [userSettingsComponentObjects]));

    _this.events = Object.assign.apply(Object, [{}, events].concat(_toConsumableArray(plugins.map(function (p) {
      return p.events;
    }))));

    _this.selectors = (0, _selectorUtils.composeSelectors)(plugins);

    _this.actions = plugins.reduce(function (combined, plugin) {
      return _extends({}, combined, plugin.actions);
    }, {});

    var mergedStyleConfig = _merge3.default.apply(undefined, [{}].concat(_toConsumableArray(plugins.map(function (p) {
      return p.styleConfig;
    })), [styleConfig]));

    // this would be good to move into the core plugin
    // and namespace this state to the core plugin
    var pageProperties = Object.assign({}, {
      currentPage: 1,
      pageSize: 10
    }, importedPageProperties);

    //TODO: This should also look at the default and plugin initial state objects
    var renderProperties = Object.assign.apply(Object, _toConsumableArray(plugins.map(function (p) {
      return p.renderProperties;
    })).concat([userRenderProperties]));

    // TODO: Make this its own method
    // It would be nice if state was namespaced to the plugin
    // it was associated with. For example pageProperties and 
    // sortProperties are specific to the core plugin. We could
    // refactor the selectors to grab this data from a different
    // place but would this affect other users?
    var initialState = _merge3.default.apply(undefined, _toConsumableArray(plugins.map(function (p) {
      return p.initialState;
    })).concat([userInitialState, {
      data: data,
      pageProperties: pageProperties,
      renderProperties: renderProperties,
      sortProperties: sortProperties,
      styleConfig: mergedStyleConfig
    }]));

    var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _redux.compose;
    _this.store = (0, _redux.createStore)(reducers, initialState, composeEnhancers(_redux.applyMiddleware.apply(undefined, _toConsumableArray((0, _compact3.default)((0, _flatten3.default)(plugins.map(function (p) {
      return p.reduxMiddleware;
    })))).concat(_toConsumableArray(reduxMiddleware)))));

    _this.provider = (0, _reactRedux.createProvider)(storeKey);

    var sanitizedListeners = (0, _pickBy3.default)(listeners, function (value, key) {
      return typeof value === "function";
    });
    _this.listeners = plugins.reduce(function (combined, plugin) {
      return _extends({}, combined, (0, _pickBy3.default)(plugin.listeners, function (value, key) {
        return typeof value === "function";
      }));
    }, _extends({}, sanitizedListeners));
    _this.storeListener = new _listenerUtils.StoreListener(_this.store);
    (0, _forIn3.default)(_this.listeners, function (listener, name) {
      _this.storeListener.addListener(listener, name, { events: _this.events, selectors: _this.selectors });
    });
    return _this;
  }

  _createClass(Griddle, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var newState = (0, _pickBy3.default)(nextProps, function (value, key) {
        return _this2.props[key] !== value;
      });

      // Only update the state if something has changed.
      //
      // NOTE the update state reducer in 'core' griddle is only
      // concerned with the data, pageProperties, and sortProperties
      // passing in only changed props breaks the contract it is expecting
      if (Object.keys(newState).length > 0) {
        this.store.dispatch(this.plugins[0].actions.updateState(newState));
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      // As relevant property updates are captured in `componentWillReceiveProps`.
      // return false to prevent the the entire root node from being deleted.
      return false;
    }
  }, {
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        components: this.components,
        settingsComponentObjects: this.settingsComponentObjects,
        events: this.events,
        selectors: this.selectors,
        storeKey: this.getStoreKey(),
        storeListener: this.storeListener,
        actions: this.actions
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        this.provider,
        { store: this.store },
        _react2.default.createElement(this.components.Layout, null)
      );
    }
  }]);

  return Griddle;
}(_react.Component);

Griddle.childContextTypes = {
  components: _propTypes2.default.object.isRequired,
  settingsComponentObjects: _propTypes2.default.object,
  events: _propTypes2.default.object,
  selectors: _propTypes2.default.object,
  storeKey: _propTypes2.default.string,
  storeListener: _propTypes2.default.object,
  actions: _propTypes2.default.object
};


Griddle.storeKey = 'store';

exports.default = Griddle;