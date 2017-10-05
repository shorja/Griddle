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

var _selectorUtils = require('../utils/selectorUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var hasPreviousSelector = exports.hasPreviousSelector = (0, _selectorUtils.griddleCreateSelector)("currentPageSelector", function (currentPage) {
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

var maxPageSelector = exports.maxPageSelector = (0, _selectorUtils.griddleCreateSelector)("pageSizeSelector", "recordCountSelector", function (pageSize, recordCount) {
  var calc = recordCount / pageSize;
  var result = calc > Math.floor(calc) ? Math.floor(calc) + 1 : Math.floor(calc);
  return (0, _isFinite3.default)(result) ? result : 1;
});

//export const maxPageSelector = {
//  creator: ({pageSizeSelector, recordCountSelector}) => {
//    return createSelector(
//      pageSizeSelector,
//      recordCountSelector,
//      (pageSize, recordCount) => {
//        const calc = recordCount / pageSize;
//        const result =  calc > Math.floor(calc) ? Math.floor(calc) + 1 : Math.floor(calc);
//        return _.isFinite(result) ? result : 1;
//      }
//    );
//  },
//  dependencies: ["pageSizeSelector", "recordCountSelector"]
//};

var hasNextSelector = exports.hasNextSelector = (0, _selectorUtils.griddleCreateSelector)("currentPageSelector", "maxPageSelector", function (currentPage, maxPage) {
  return currentPage < maxPage;
});

//export const hasNextSelector = { 
//  creator: ({currentPageSelector, maxPageSelector}) => {
//    return createSelector(
//      currentPageSelector,
//      maxPageSelector,
//      (currentPage, maxPage) => {
//        return currentPage < maxPage;
//      }
//    );
//  },
//  dependencies: ["currentPageSelector", "maxPageSelector"]
//};

var allColumnsSelector = exports.allColumnsSelector = (0, _selectorUtils.griddleCreateSelector)("dataSelector", "renderPropertiesSelector", function (data, renderProperties) {
  var dataColumns = !data || data.size === 0 ? [] : data.get(0).keySeq().toJSON();

  var columnPropertyColumns = renderProperties && renderProperties.size > 0 ?
  // TODO: Make this not so ugly
  Object.keys(renderProperties.get('columnProperties').toJSON()) : [];

  return (0, _union3.default)(dataColumns, columnPropertyColumns);
});

//export const allColumnsSelector = {
//  creator: ({dataSelector, renderPropertiesSelector}) => {
//    return createSelector(
//      dataSelector,
//      renderPropertiesSelector,
//      (data, renderProperties) => {
//        const dataColumns = !data || data.size === 0 ?
//          [] :
//          data.get(0).keySeq().toJSON();
//
//        const columnPropertyColumns = (renderProperties && renderProperties.size > 0) ?
//          // TODO: Make this not so ugly
//          Object.keys(renderProperties.get('columnProperties').toJSON()) :
//          [];
//
//        return _.union(dataColumns, columnPropertyColumns);
//      }
//    );
//  },
//  dependencies: ["dataSelector", "renderPropertiesSelector"]
//};

var sortedColumnPropertiesSelector = exports.sortedColumnPropertiesSelector = (0, _selectorUtils.griddleCreateSelector)("renderPropertiesSelector", function (renderProperties) {
  return renderProperties && renderProperties.get('columnProperties') && renderProperties.get('columnProperties').size !== 0 ? renderProperties.get('columnProperties').sortBy(function (col) {
    return col && col.get('order') || _maxSafeInteger2.default;
  }) : null;
});

//export const sortedColumnPropertiesSelector = {
//  creator: ({renderPropertiesSelector}) => {
//    return createSelector(
//      renderPropertiesSelector,
//      (renderProperties) => (
//        renderProperties && renderProperties.get('columnProperties') && renderProperties.get('columnProperties').size !== 0 ?
//        renderProperties.get('columnProperties')
//        .sortBy(col => (col && col.get('order'))||MAX_SAFE_INTEGER) :
//        null
//      )
//    );
//  },
//  dependencies: ["renderPropertiesSelector"]
//};

var metaDataColumnsSelector = exports.metaDataColumnsSelector = (0, _selectorUtils.griddleCreateSelector)("sortedColumnPropertiesSelector", function (sortedColumnProperties) {
  return sortedColumnProperties ? sortedColumnProperties.filter(function (c) {
    return c.get('isMetadata');
  }).keySeq().toJSON() : [];
});

//export const metaDataColumnsSelector = {
//  creator: ({sortedColumnPropertiesSelector}) => {
//    return createSelector(
//      sortedColumnPropertiesSelector,
//      (sortedColumnProperties) => (
//        sortedColumnProperties ? sortedColumnProperties
//        .filter(c => c.get('isMetadata'))
//        .keySeq()
//        .toJSON() :
//        []
//      )
//    );
//  },
//  dependencies: ["sortedColumnPropertiesSelector"]
//};

var visibleColumnsSelector = exports.visibleColumnsSelector = (0, _selectorUtils.griddleCreateSelector)("sortedColumnPropertiesSelector", "allColumnsSelector", function (sortedColumnProperties, allColumns) {
  return sortedColumnProperties ? sortedColumnProperties.filter(function (c) {
    var isVisible = c.get('visible') || c.get('visible') === undefined;
    var isMetadata = c.get('isMetadata');
    return isVisible && !isMetadata;
  }).keySeq().toJSON() : allColumns;
});

//export const visibleColumnsSelector = {
//  creator: ({sortedColumnPropertiesSelector, allColumnsSelector}) => {
//    return createSelector(
//      sortedColumnPropertiesSelector,
//      allColumnsSelector,
//      (sortedColumnProperties, allColumns) => (
//        sortedColumnProperties ? sortedColumnProperties
//        .filter(c => {
//          const isVisible = c.get('visible') || c.get('visible') === undefined;
//          const isMetadata = c.get('isMetadata');
//          return isVisible && !isMetadata;
//        })
//        .keySeq()
//        .toJSON() :
//        allColumns
//      )
//    );
//  },
//  dependencies: ["sortedColumnPropertiesSelector", "allColumnsSelector"]
//};

var visibleColumnPropertiesSelector = exports.visibleColumnPropertiesSelector = (0, _selectorUtils.griddleCreateSelector)("visibleColumnsSelector", "renderPropertiesSelector", function () {
  var visibleColumns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var renderProperties = arguments[1];
  return visibleColumns.map(function (c) {
    var columnProperty = renderProperties.getIn(['columnProperties', c]);
    return columnProperty && columnProperty.toJSON() || { id: c };
  });
});

//export const visibleColumnPropertiesSelector = {
//  creator: ({visibleColumnsSelector, renderPropertiesSelector}) => {
//    return createSelector(
//      visibleColumnsSelector,
//      renderPropertiesSelector,
//      (visibleColumns=[], renderProperties) => (
//        visibleColumns.map(c => {
//          const columnProperty = renderProperties.getIn(['columnProperties', c]);
//          return (columnProperty && columnProperty.toJSON()) || { id: c }
//        })
//      )
//    );
//  },
//  dependencies: ["visibleColumnsSelector", "renderPropertiesSelector"]
//};

var hiddenColumnsSelector = exports.hiddenColumnsSelector = (0, _selectorUtils.griddleCreateSelector)("visibleColumnsSelector", "allColumnsSelector", "metaDataColumnsSelector", function (visibleColumns, allColumns, metaDataColumns) {
  var removeColumns = [].concat(_toConsumableArray(visibleColumns), _toConsumableArray(metaDataColumns));

  return allColumns.filter(function (c) {
    return removeColumns.indexOf(c) === -1;
  });
});

//export const hiddenColumnsSelector = {
//  creator: ({visibleColumnsSelector, allColumnsSelector, metaDataColumnsSelector}) => {
//    return createSelector(
//      visibleColumnsSelector,
//      allColumnsSelector,
//      metaDataColumnsSelector,
//      (visibleColumns, allColumns, metaDataColumns) => {
//        const removeColumns = [...visibleColumns, ...metaDataColumns];
//
//        return allColumns.filter(c => removeColumns.indexOf(c) === -1);
//      }
//    );
//  },
//  dependencies: ["visibleColumnsSelector", "allColumnsSelector", "metaDataColumnsSelector"]
//};

var hiddenColumnPropertiesSelector = exports.hiddenColumnPropertiesSelector = (0, _selectorUtils.griddleCreateSelector)("hiddenColumnsSelector", "renderPropertiesSelector", function () {
  var hiddenColumns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var renderProperties = arguments[1];
  return hiddenColumns.map(function (c) {
    var columnProperty = renderProperties.getIn(['columnProperties', c]);

    return columnProperty && columnProperty.toJSON() || { id: c };
  });
});

//export const hiddenColumnPropertiesSelector = {
//  creator: ({hiddenColumnsSelector, renderPropertiesSelector}) => {
//    return createSelector(
//      hiddenColumnsSelector,
//      renderPropertiesSelector,
//      (hiddenColumns=[], renderProperties) => (
//        hiddenColumns.map(c => {
//          const columnProperty = renderProperties.getIn(['columnProperties', c]);
//
//          return (columnProperty && columnProperty.toJSON()) || { id: c }
//        })
//      )
//    );
//  },
//  dependencies: ["hiddenColumnsSelector", "renderPropertiesSelector"]
//};

var columnIdsSelector = exports.columnIdsSelector = (0, _selectorUtils.griddleCreateSelector)("renderPropertiesSelector", "visibleColumnsSelector", function (renderProperties, visibleColumns) {
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

//export const columnIdsSelector = {
//  creator: ({renderPropertiesSelector, visibleColumnsSelector}) => {
//    return createSelector(
//      renderPropertiesSelector,
//      visibleColumnsSelector,
//      (renderProperties, visibleColumns) => {
//        const offset = 1000;
//        // TODO: Make this better -- This is pretty inefficient
//        return visibleColumns
//          .map((k, index) => ({
//            id: renderProperties.getIn(['columnProperties', k, 'id']) || k,
//            order: renderProperties.getIn(['columnProperties', k, 'order']) || offset + index
//          }))
//          .sort((first, second) => first.order - second.order)
//          .map(item => item.id);
//      }
//    );
//  },
//  dependencies: ["renderPropertiesSelector", "visibleColumnsSelector"]
//};

var columnTitlesSelector = exports.columnTitlesSelector = (0, _selectorUtils.griddleCreateSelector)("columnIdsSelector", "renderPropertiesSelector", function (columnIds, renderProperties) {
  return columnIds.map(function (k) {
    return renderProperties.getIn(['columnProperties', k, 'title']) || k;
  });
});

//export const columnTitlesSelector = {
//  creator: ({columnIdsSelector, renderPropertiesSelector}) => {
//    return createSelector(
//      columnIdsSelector,
//      renderPropertiesSelector,
//      (columnIds, renderProperties) => columnIds.map(k => renderProperties.getIn(['columnProperties', k, 'title']) || k)
//    );
//  },
//  dependencies: ["columnIdsSelector", "renderPropertiesSelector"]
//};

var visibleRowIdsSelector = exports.visibleRowIdsSelector = (0, _selectorUtils.griddleCreateSelector)("dataSelector", function (currentPageData) {
  return currentPageData ? currentPageData.map(function (c) {
    return c.get('griddleKey');
  }) : new _immutable2.default.List();
});

//export const visibleRowIdsSelector = {
//  creator: ({dataSelector}) => {
//    return createSelector(
//      dataSelector,
//      currentPageData => currentPageData ? currentPageData.map(c => c.get('griddleKey')) : new Immutable.List()
//    );
//  },
//  dependencies: ["dataSelector"]
//};

var visibleRowCountSelector = exports.visibleRowCountSelector = (0, _selectorUtils.griddleCreateSelector)("visibleRowIdsSelector", function (visibleRowIds) {
  return visibleRowIds.size;
});

//export const visibleRowCountSelector = {
//  creator: ({visibleRowIdsSelector}) => {
//    return createSelector(
//      visibleRowIdsSelector,
//      (visibleRowIds) => visibleRowIds.size
//    );
//  },
//  dependencies: ["visibleRowIdsSelector"]
//};