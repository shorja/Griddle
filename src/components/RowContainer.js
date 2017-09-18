import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../utils/griddleConnect';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';
import pure from 'recompose/pure';

import {
  columnIdsSelector,
  rowDataSelector,
  rowPropertiesSelector,
  classNamesForComponentSelector,
  stylesForComponentSelector,
  doesRowNeedUpdate
} from '../selectors/dataSelectors';
import { valueOrResult } from '../utils/valueUtils';

const ComposedRowContainer = OriginalComponent => compose(
  pure,
  getContext({
    components: PropTypes.object,
    selectors: PropTypes.object
  }),
  connect((state, props) => ({
    columnIds: props.selectors.columnIdsSelector(state),
    rowProperties: props.selectors.rowPropertiesSelector(state),
    rowData: props.selectors.rowDataSelector(state, props),
    className: props.selectors.classNamesForComponentSelector(state, 'Row'),
    style: props.selectors.stylesForComponentSelector(state, 'Row'),
  }),
    null,
    null,
    {
      pure: true, 
      areStatesEqual: (prevState, nextState) => doesRowNeedUpdate(prevState, nextState)
    }
  ),
  mapProps(props => {
    const { components, rowProperties, className, ...otherProps } = props;
    return {
      Cell: components.Cell,
      className: valueOrResult(rowProperties.cssClassName, props) || props.className,
      ...otherProps,
    };
  }),
)(props => (
  <OriginalComponent
  {...props}
  />
));

export default ComposedRowContainer;
