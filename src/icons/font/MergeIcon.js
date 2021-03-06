import React from 'react';
import PropTypes from 'prop-types';
import FontIcon from '../../FontIcon';
import ThemeService from '../../styles/ChamelThemeService';

/**
 * Merge button
 *
 * @param props
 * @param context
 * @returns {ReactDOM}
 * @constructor
 */
const MergeIcon = (props, context) => {
  let theme =
    context.chamelTheme && context.chamelTheme.fontIcon
      ? context.chamelTheme.fontIcon
      : ThemeService.defaultTheme.fontIcon;

  return (
    <FontIcon {...props} className={theme.iconMerge}>
      {'merge'}
    </FontIcon>
  );
};

/**
 * An alternate theme may be passed down by a provider
 */
MergeIcon.contextTypes = {
  chamelTheme: PropTypes.object,
};

export default MergeIcon;
