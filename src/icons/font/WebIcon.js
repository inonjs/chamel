import React from 'react';
import PropTypes from 'prop-types';
import FontIcon from '../../FontIcon';
import ThemeService from '../../styles/ChamelThemeService';

/**
 * Web Icon button
 *
 * @param props
 * @param context
 * @returns {ReactDOM}
 * @constructor
 */
const WebIcon = (props, context) => {
  let theme =
    context.chamelTheme && context.chamelTheme.fontIcon
      ? context.chamelTheme.fontIcon
      : ThemeService.defaultTheme.fontIcon;

  return (
    <FontIcon {...props} className={theme.iconWeb}>
      {'web'}
    </FontIcon>
  );
};

/**
 * An alternate theme may be passed down by a provider
 */
WebIcon.contextTypes = {
  chamelTheme: PropTypes.object,
};

export default WebIcon;
