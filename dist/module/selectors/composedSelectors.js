'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visibleRowCountSelector = exports.visibleRowIdsSelector = exports.columnTitlesSelector = exports.columnIdsSelector = exports.hiddenColumnPropertiesSelector = exports.hiddenColumnsSelector = exports.visibleColumnPropertiesSelector = exports.visibleColumnsSelector = exports.metaDataColumnsSelector = exports.sortedColumnPropertiesSelector = exports.allColumnsSelector = exports.hasNextSelector = exports.maxPageSelector = exports.hasPreviousSelector = undefined;

var _union2 = require('lodash/union');

var _union3 = _interopRequireDefault(_union2);

var _isFinite2 = require('lodash/isFinite');

var _isFinite3 = _interopRequireDefault(_isFinite2);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reselect = require('reselect');

var _maxSafeInteger = require('max-safe-integer');

var _maxSafeInteger2 = _interopRequireDefault(_maxSafeInteger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var griddleCreateSelector = function griddleCreateSelector() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length < 2) {
    throw new Error("Cannot create a selector with fewer than 2 arguments, must have at least on dependency and the selector function");
  }
  var dependencies = args.slice(0, args.length - 1);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var dependency = _step.value;

      if (typeof dependency !== "string") {
        throw new Error("Args 0..n-1 must be strings");
      }
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

  var selector = args[args.length - 1];
  if (typeof selector !== "function") {
    throw new Error("Last argument must be a function");
  }

  return {
    creator: function creator(selectors) {
      var createSelectorFuncs = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = dependencies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var dependency = _step2.value;

          createSelectorFuncs.push(selectors[dependency]);
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

      createSelectorFuncs.push(selector);
      return _reselect.createSelector.apply(undefined, createSelectorFuncs);
    },
    dependencies: dependencies
  };
};

var hasPreviousSelector = exports.hasPreviousSelector = griddleCreateSelector("currentPageSelector", function (currentPage) {
  return currentPage > 1;
});

//export const hasPreviousSelector = {
//  creator: ({currentPageSelector}) => {
//    return createSelector(
//      currentPageSelector,
//      (currentPage) => (currentPage > 1)
//    );
//  },
//  dependencies: ["currentPageSelector"]
//};

var maxPageSelector = exports.maxPageSelector = {
  creator: function creator(_ref) {
    var pageSizeSelector = _ref.pageSizeSelector,
        recordCountSelector = _ref.recordCountSelector;

    return (0, _reselect.createSelector)(pageSizeSelector, recordCountSelector, function (pageSize, recordCount) {
      var calc = recordCount / pageSize;
      var result = calc > Math.floor(calc) ? Math.floor(calc) + 1 : Math.floor(calc);
      return (0, _isFinite3.default)(result) ? result : 1;
    });
  },
  dependencies: ["pageSizeSelector", "recordCountSelector"]
};

var hasNextSelector = exports.hasNextSelector = {
  creator: function creator(_ref2) {
    var currentPageSelector = _ref2.currentPageSelector,
        maxPageSelector = _ref2.maxPageSelector;

    return (0, _reselect.createSelector)(currentPageSelector, maxPageSelector, function (currentPage, maxPage) {
      return currentPage < maxPage;
    });
  },
  dependencies: ["currentPageSelector", "maxPageSelector"]
};

var allColumnsSelector = exports.allColumnsSelector = {
  creator: function creator(_ref3) {
    var dataSelector = _ref3.dataSelector,
        renderPropertiesSelector = _ref3.renderPropertiesSelector;

    return (0, _reselect.createSelector)(dataSelector, renderPropertiesSelector, function (data, renderProperties) {
      var dataColumns = !data || data.size === 0 ? [] : data.get(0).keySeq().toJSON();

      var columnPropertyColumns = renderProperties && renderProperties.size > 0 ?
      // TODO: Make this not so ugly
      Object.keys(renderProperties.get('columnProperties').toJSON()) : [];

      return (0, _union3.default)(dataColumns, columnPropertyColumns);
    });
  },
  dependencies: ["dataSelector", "renderPropertiesSelector"]
};

var sortedColumnPropertiesSelector = exports.sortedColumnPropertiesSelector = {
  creator: function creator(_ref4) {
    var renderPropertiesSelector = _ref4.renderPropertiesSelector;

    return (0, _reselect.createSelector)(renderPropertiesSelector, function (renderProperties) {
      return renderProperties && renderProperties.get('columnProperties') && renderProperties.get('columnProperties').size !== 0 ? renderProperties.get('columnProperties').sortBy(function (col) {
        return col && col.get('order') || _maxSafeInteger2.default;
      }) : null;
    });
  },
  dependencies: ["renderPropertiesSelector"]
};

var metaDataColumnsSelector = exports.metaDataColumnsSelector = {
  creator: function creator(_ref5) {
    var sortedColumnPropertiesSelector = _ref5.sortedColumnPropertiesSelector;

    return (0, _reselect.createSelector)(sortedColumnPropertiesSelector, function (sortedColumnProperties) {
      return sortedColumnProperties ? sortedColumnProperties.filter(function (c) {
        return c.get('isMetadata');
      }).keySeq().toJSON() : [];
    });
  },
  dependencies: ["sortedColumnPropertiesSelector"]
};

var visibleColumnsSelector = exports.visibleColumnsSelector = {
  creator: function creator(_ref6) {
    var sortedColumnPropertiesSelector = _ref6.sortedColumnPropertiesSelector,
        allColumnsSelector = _ref6.allColumnsSelector;

    return (0, _reselect.createSelector)(sortedColumnPropertiesSelector, allColumnsSelector, function (sortedColumnProperties, allColumns) {
      return sortedColumnProperties ? sortedColumnProperties.filter(function (c) {
        var isVisible = c.get('visible') || c.get('visible') === undefined;
        var isMetadata = c.get('isMetadata');
        return isVisible && !isMetadata;
      }).keySeq().toJSON() : allColumns;
    });
  },
  dependencies: ["sortedColumnPropertiesSelector", "allColumnsSelector"]
};

var visibleColumnPropertiesSelector = exports.visibleColumnPropertiesSelector = {
  creator: function creator(_ref7) {
    var visibleColumnsSelector = _ref7.visibleColumnsSelector,
        renderPropertiesSelector = _ref7.renderPropertiesSelector;

    return (0, _reselect.createSelector)(visibleColumnsSelector, renderPropertiesSelector, function () {
      var visibleColumns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var renderProperties = arguments[1];
      return visibleColumns.map(function (c) {
        var columnProperty = renderProperties.getIn(['columnProperties', c]);
        return columnProperty && columnProperty.toJSON() || { id: c };
      });
    });
  },
  dependencies: ["visibleColumnsSelector", "renderPropertiesSelector"]
};

var hiddenColumnsSelector = exports.hiddenColumnsSelector = {
  creator: function creator(_ref8) {
    var visibleColumnsSelector = _ref8.visibleColumnsSelector,
        allColumnsSelector = _ref8.allColumnsSelector,
        metaDataColumnsSelector = _ref8.metaDataColumnsSelector;

    return (0, _reselect.createSelector)(visibleColumnsSelector, allColumnsSelector, metaDataColumnsSelector, function (visibleColumns, allColumns, metaDataColumns) {
      var removeColumns = [].concat(_toConsumableArray(visibleColumns), _toConsumableArray(metaDataColumns));

      return allColumns.filter(function (c) {
        return removeColumns.indexOf(c) === -1;
      });
    });
  },
  dependencies: ["visibleColumnsSelector", "allColumnsSelector", "metaDataColumnsSelector"]
};

var hiddenColumnPropertiesSelector = exports.hiddenColumnPropertiesSelector = {
  creator: function creator(_ref9) {
    var hiddenColumnsSelector = _ref9.hiddenColumnsSelector,
        renderPropertiesSelector = _ref9.renderPropertiesSelector;

    return (0, _reselect.createSelector)(hiddenColumnsSelector, renderPropertiesSelector, function () {
      var hiddenColumns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var renderProperties = arguments[1];
      return hiddenColumns.map(function (c) {
        var columnProperty = renderProperties.getIn(['columnProperties', c]);

        return columnProperty && columnProperty.toJSON() || { id: c };
      });
    });
  },
  dependencies: ["hiddenColumnsSelector", "renderPropertiesSelector"]
};

var columnIdsSelector = exports.columnIdsSelector = {
  creator: function creator(_ref10) {
    var renderPropertiesSelector = _ref10.renderPropertiesSelector,
        visibleColumnsSelector = _ref10.visibleColumnsSelector;

    return (0, _reselect.createSelector)(renderPropertiesSelector, visibleColumnsSelector, function (renderProperties, visibleColumns) {
      var offset = 1000;
      // TODO: Make this better -- This is pretty inefficient
      return visibleColumns.map(function (k, index) {
        return {
          id: renderProperties.getIn(['columnProperties', k, 'id']) || k,
          order: renderProperties.getIn(['columnProperties', k, 'order']) || offset + index
        };
      }).sort(function (first, second) {
        return first.order - second.order;
      }).map(function (item) {
        return item.id;
      });
    });
  },
  dependencies: ["renderPropertiesSelector", "visibleColumnsSelector"]
};

var columnTitlesSelector = exports.columnTitlesSelector = {
  creator: function creator(_ref11) {
    var columnIdsSelector = _ref11.columnIdsSelector,
        renderPropertiesSelector = _ref11.renderPropertiesSelector;

    return (0, _reselect.createSelector)(columnIdsSelector, renderPropertiesSelector, function (columnIds, renderProperties) {
      return columnIds.map(function (k) {
        return renderProperties.getIn(['columnProperties', k, 'title']) || k;
      });
    });
  },
  dependencies: ["columnIdsSelector", "renderPropertiesSelector"]
};

var visibleRowIdsSelector = exports.visibleRowIdsSelector = {
  creator: function creator(_ref12) {
    var dataSelector = _ref12.dataSelector;

    return (0, _reselect.createSelector)(dataSelector, function (currentPageData) {
      return currentPageData ? currentPageData.map(function (c) {
        return c.get('griddleKey');
      }) : new _immutable2.default.List();
    });
  },
  dependencies: ["dataSelector"]
};

var visibleRowCountSelector = exports.visibleRowCountSelector = {
  creator: function creator(_ref13) {
    var visibleRowIdsSelector = _ref13.visibleRowIdsSelector;

    return (0, _reselect.createSelector)(visibleRowIdsSelector, function (visibleRowIds) {
      return visibleRowIds.size;
    });
  },
  dependencies: ["visibleRowIdsSelector"]
};