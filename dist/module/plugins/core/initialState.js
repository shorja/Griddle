'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _columnUtils = require('../../utils/columnUtils');

var _rowUtils = require('../../utils/rowUtils');

var styleConfig = {
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

var initialState = function initialState(config) {
  var rowPropertiesComponent = config.children;


  var rowProperties = (0, _rowUtils.getRowProperties)(rowPropertiesComponent);
  var columnProperties = (0, _columnUtils.getColumnProperties)(rowPropertiesComponent);

  var renderProperties = {
    rowProperties: rowProperties,
    columnProperties: columnProperties
  };

  //const pageProperties = {
  //  currentPage: 1,
  //  pageSize: 10,
  //  ...externalPageProperties,
  //}

  var localInitialState = {
    enableSettings: true,
    textProperties: {
      next: 'Next',
      previous: 'Previous',
      settingsToggle: 'Settings'
    }
  };

  return {
    styleConfig: styleConfig,
    renderProperties: renderProperties,
    initialState: localInitialState
  };
};

exports.default = initialState;