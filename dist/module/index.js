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

var _forOwn2 = require('lodash/forOwn');

var _forOwn3 = _interopRequireDefault(_forOwn2);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _redux = require('redux');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactRedux = require('react-redux');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _dataReducer = require('./reducers/dataReducer');

var dataReducers = _interopRequireWildcard(_dataReducer);

var _components = require('./components');

var _components2 = _interopRequireDefault(_components);

var _settingsComponentObjects = require('./settingsComponentObjects');

var _settingsComponentObjects2 = _interopRequireDefault(_settingsComponentObjects);

var _dataSelectors = require('./selectors/dataSelectors');

var baseSelectors = _interopRequireWildcard(_dataSelectors);

var _composedSelectors2 = require('./selectors/composedSelectors');

var composedSelectors = _interopRequireWildcard(_composedSelectors2);

var _compositionUtils = require('./utils/compositionUtils');

var _columnUtils = require('./utils/columnUtils');

var _rowUtils = require('./utils/rowUtils');

var _sortUtils = require('./utils/sortUtils');

var _listenerUtils = require('./utils/listenerUtils');

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultEvents = _extends({}, actions, {
  onFilter: actions.setFilter,
  setSortProperties: _sortUtils.setSortProperties
});

var defaultStyleConfig = {
  icons: {
    TableHeadingCell: {
      sortDescendingIcon: '▼',
      sortAscendingIcon: '▲'
    }
  },
  classNames: {
    Cell: 'griddle-cell',
    Filter: 'griddle-filter',
    Loading: 'griddle-loadingResults',
    NextButton: 'griddle-next-button',
    NoResults: 'griddle-noResults',
    PageDropdown: 'griddle-page-select',
    Pagination: 'griddle-pagination',
    PreviousButton: 'griddle-previous-button',
    Row: 'griddle-row',
    RowDefinition: 'griddle-row-definition',
    Settings: 'griddle-settings',
    SettingsToggle: 'griddle-settings-toggle',
    Table: 'griddle-table',
    TableBody: 'griddle-table-body',
    TableHeading: 'griddle-table-heading',
    TableHeadingCell: 'griddle-table-heading-cell',
    TableHeadingCellAscending: 'griddle-heading-ascending',
    TableHeadingCellDescending: 'griddle-heading-descending'
  },
  styles: {}
};

var Griddle = function (_Component) {
  _inherits(Griddle, _Component);

  function Griddle(props) {
    _classCallCheck(this, Griddle);

    var _this = _possibleConstructorReturn(this, (Griddle.__proto__ || Object.getPrototypeOf(Griddle)).call(this, props));

    _this.getStoreKey = function () {
      return _this.props.storeKey || 'store';
    };

    var _props$plugins = props.plugins,
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
        storeKey = _props$storeKey === undefined ? 'store' : _props$storeKey,
        _props$reduxMiddlewar = props.reduxMiddleware,
        reduxMiddleware = _props$reduxMiddlewar === undefined ? [] : _props$reduxMiddlewar,
        _props$listeners = props.listeners,
        listeners = _props$listeners === undefined ? {} : _props$listeners,
        userInitialState = _objectWithoutProperties(props, ['plugins', 'data', 'children', 'events', 'sortProperties', 'styleConfig', 'pageProperties', 'components', 'renderProperties', 'settingsComponentObjects', 'storeKey', 'reduxMiddleware', 'listeners']);

    var rowProperties = (0, _rowUtils.getRowProperties)(rowPropertiesComponent);
    var columnProperties = (0, _columnUtils.getColumnProperties)(rowPropertiesComponent);

    //Combine / compose the reducers to make a single, unified reducer
    var reducers = (0, _compositionUtils.buildGriddleReducer)([dataReducers].concat(_toConsumableArray(plugins.map(function (p) {
      return p.reducer;
    }))));

    //Combine / Compose the components to make a single component for each component type
    _this.components = (0, _compositionUtils.buildGriddleComponents)([_components2.default].concat(_toConsumableArray(plugins.map(function (p) {
      return p.components;
    })), [userComponents]));

    _this.settingsComponentObjects = Object.assign.apply(Object, [{}, _settingsComponentObjects2.default].concat(_toConsumableArray(plugins.map(function (p) {
      return p.settingsComponentObjects;
    })), [userSettingsComponentObjects]));

    _this.events = Object.assign.apply(Object, [{}, events].concat(_toConsumableArray(plugins.map(function (p) {
      return p.events;
    }))));

    // STEP 1
    // ==========
    //
    // Add all of the 'base' selectors to the list of combined selectors.
    // The actuall selector functions are wrapped in an object which is used
    // to keep track of all the data needed to properly build all the
    // selector dependency trees
    console.log("Parsing built-in selectors");
    var combinedSelectors = new Map();
    var _baseSelectors = (0, _reduce3.default)(baseSelectors, function (map, baseSelector, name) {
      var selector = {
        name: name,
        selector: baseSelector,
        dependencies: [],
        rank: 0,
        traversed: false
      };
      combinedSelectors.set(name, selector);
      map.set(name, selector);
      return map;
    }, new Map());

    // STEP 2
    // ==========
    //
    // Add all of the 'composed' selectors to the list of combined selectors.
    // Composed selectors use the 'createSelector' function provided by reselect
    // and depend on other selectors. These new selectors are located in a 
    // new file named 'composedSelectors' and are now an object that looks like this:
    //   {
    //     creator: ({dependency1, dependency2, ...}) => return createSelector(dependency1, dependency2, (...) => (...)),
    //     dependencies: ["dependency1", "dependency2"]
    //   }
    // 'creator' will return the selector when it is run with the dependency selectors
    // 'dependencies' are the string names of the dependency selectors, these will be used to
    // build the tree of selectors
    var _composedSelectors = (0, _reduce3.default)(composedSelectors, function (map, composedSelector, name) {
      var selector = _extends({
        name: name
      }, composedSelector, {
        rank: 0,
        traversed: false
      });
      combinedSelectors.has(name) && console.log('  Overriding existing selector named ' + name);
      combinedSelectors.set(name, selector);
      map.set(name, selector);
      return map;
    }, new Map());

    // STEP 3
    // ==========
    //
    // Once the built-in 'base' and 'composed' selectors are added to the list,
    // repeat the same process for each of the plugins.
    //
    // Plugins can now redefine a single existing selector without having to
    // include the full list of dependency selectors since the dependencies
    // are now created dynamically
    for (var i in plugins) {
      console.log('Parsing selectors for plugin ' + i);
      var plugin = plugins[i];
      (0, _forOwn3.default)(plugin.selectors, function (baseSelector, name) {
        var selector = {
          name: name,
          selector: baseSelector,
          dependencies: [],
          rank: 0,
          traversed: false
        };

        // console log for demonstration purposes
        combinedSelectors.has(name) && console.log('  Overriding existing selector named ' + name + ' with base selector');
        combinedSelectors.set(name, selector);
      });

      (0, _forOwn3.default)(plugin.composedSelectors, function (composedSelector, name) {
        var selector = _extends({
          name: name
        }, composedSelector, {
          rank: 0,
          traversed: false
        });

        // console log for demonstration purposes
        combinedSelectors.has(name) && console.log('  Overriding existing selector named ' + name + ' with composed selector');
        combinedSelectors.set(name, selector);
      });
    }

    // RANKS
    // ==========
    //
    // The ranks array is populated when running getDependencies
    // It stores the selectors based on their 'rank'
    // Rank can be defined recursively as:
    // - if a selector has no dependencies, rank is 0
    // - if a selector has 1 or more dependencies, rank is max(all dependency ranks) + 1
    var ranks = [];

    // GET DEPENDENCIES
    // ==========
    //
    // getDependencies recursively descends through the dependencies
    // of a given selector doing several things:
    // - creates a 'flat' list of dependencies for a given selector,
    // which is a list of all of its dependencies
    // - calculates the rank of each selector and fills out the above ranks list
    // - determines if there are any cycles present in the dependency tree
    //
    // It also memoizes the results in the combinedSelectors Map by setting the
    // 'traversed' flag for a given selector. If a selector has been flagged as
    // 'traversed', it simply returns the previously calculated dependencies
    var getDependencies = function getDependencies(node, parents) {
      // if this node has already been traversed
      // no need to run the get dependencies logic as they
      // have already been computed
      // simply return its list of flattened dependencies
      if (!node.traversed) {

        // if the node has dependencies, add each one to the node's
        // list of flattened dependencies and recursively call
        // getDependencies on each of them
        if (node.dependencies.length > 0) {
          (function () {

            var flattenedDependencies = new Set();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = node.dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var dependency = _step.value;

                if (!combinedSelectors.has(dependency)) {
                  var err = 'Selector ' + node.name + ' has dependency ' + dependency + ' but this is not in the list of dependencies! Did you misspell something?';
                  throw new Error(err);
                }

                // if any dependency in the recursion chain
                // matches one of the parents there is a cycle throw an exception
                // this is an unrecoverable runtime error
                if (parents.has(dependency)) {
                  var _err = "Dependency cycle detected! ";
                  var _iteratorNormalCompletion2 = true;
                  var _didIteratorError2 = false;
                  var _iteratorError2 = undefined;

                  try {
                    for (var _iterator2 = parents[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var e = _step2.value;

                      e === dependency ? _err += '[[' + e + ']] -> ' : _err += e + ' -> ';
                    }
                  } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                      }
                    } finally {
                      if (_didIteratorError2) {
                        throw _iteratorError2;
                      }
                    }
                  }

                  _err += '[[' + dependency + ']]';
                  console.log(_err);
                  throw new Error(_err);
                }
                flattenedDependencies.add(dependency);
                var childParents = new Set(parents);
                childParents.add(dependency);
                var childsDependencies = getDependencies(combinedSelectors.get(dependency), childParents);
                childsDependencies.forEach(function (key) {
                  return flattenedDependencies.add(key);
                });
                var childRank = combinedSelectors.get(dependency).rank;
                childRank >= node.rank && (node.rank = childRank + 1);
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            node.flattenedDependencies = flattenedDependencies;
            node.traversed = true;
          })();
        } else {

          // otherwise, this is a leaf node
          // - set the node's rank to 0
          // - set the nodes flattenedDependencies to an empty set
          node.flattenedDependencies = new Set();
          node.traversed = true;
        }
        ranks[node.rank] || (ranks[node.rank] = new Array());
        ranks[node.rank].push(node);
      }
      return node.flattenedDependencies;
    };

    // STEP 4
    // ==========
    //
    // Run getDependencies on each selector in the 'combinedSelectors' list
    // This fills out the 'ranks' list for use in the next step
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = combinedSelectors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var e = _step3.value;

        var _e = _slicedToArray(e, 2),
            name = _e[0],
            selector = _e[1];

        getDependencies(selector, new Set([name]));
      }

      // STEP 5
      // ==========
      //
      // Create a flat object of just the actual selector functions
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    var flattenedSelectors = {};
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = ranks[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var rank = _step4.value;
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = rank[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var selector = _step5.value;

            if (selector.creator) {
              var childSelectors = {};
              var _iteratorNormalCompletion6 = true;
              var _didIteratorError6 = false;
              var _iteratorError6 = undefined;

              try {
                for (var _iterator6 = selector.dependencies[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                  var childSelector = _step6.value;

                  childSelectors[childSelector] = combinedSelectors.get(childSelector).selector;
                }
              } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion6 && _iterator6.return) {
                    _iterator6.return();
                  }
                } finally {
                  if (_didIteratorError6) {
                    throw _iteratorError6;
                  }
                }
              }

              selector.selector = selector.creator(childSelectors);
            }
            flattenedSelectors[selector.name] = selector.selector;
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      }

      //this.selectors = plugins.reduce((combined, plugin) => ({ ...combined, ...plugin.selectors }), {...selectors});
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    _this.selectors = flattenedSelectors;

    var mergedStyleConfig = _merge3.default.apply(undefined, [{}, defaultStyleConfig].concat(_toConsumableArray(plugins.map(function (p) {
      return p.styleConfig;
    })), [styleConfig]));

    var pageProperties = Object.assign({}, {
      currentPage: 1,
      pageSize: 10
    }, importedPageProperties);

    //TODO: This should also look at the default and plugin initial state objects
    var renderProperties = Object.assign.apply(Object, [{
      rowProperties: rowProperties,
      columnProperties: columnProperties
    }].concat(_toConsumableArray(plugins.map(function (p) {
      return p.renderProperties;
    })), [userRenderProperties]));

    // TODO: Make this its own method
    var initialState = _merge3.default.apply(undefined, [{
      enableSettings: true,
      textProperties: {
        next: 'Next',
        previous: 'Previous',
        settingsToggle: 'Settings'
      }
    }].concat(_toConsumableArray(plugins.map(function (p) {
      return p.initialState;
    })), [userInitialState, {
      data: data,
      pageProperties: pageProperties,
      renderProperties: renderProperties,
      sortProperties: sortProperties,
      styleConfig: mergedStyleConfig
    }]));

    _this.store = (0, _redux.createStore)(reducers, initialState, _redux.applyMiddleware.apply(undefined, _toConsumableArray((0, _compact3.default)((0, _flatten3.default)(plugins.map(function (p) {
      return p.reduxMiddleware;
    })))).concat(_toConsumableArray(reduxMiddleware))));

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
      var data = nextProps.data,
          pageProperties = nextProps.pageProperties,
          sortProperties = nextProps.sortProperties;


      this.store.dispatch(actions.updateState({ data: data, pageProperties: pageProperties, sortProperties: sortProperties }));
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
        storeListener: this.storeListener
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
  storeListener: _propTypes2.default.object
};
exports.default = Griddle;