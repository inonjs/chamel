import React from 'react';
import PropTypes from 'prop-types';
import FontIcon from '../../FontIcon';
import ThemeService from '../../styles/ChamelThemeService';

/**
 * Underline Icon button
 *
 * @param props
 * @param context
 * @returns {ReactDOM}
 * @constructor
 */
const UnderlinedIcon = (props, context) => {
  let theme =
    context.chamelTheme && context.chamelTheme.fontIcon
      ? context.chamelTheme.fontIcon
      : ThemeService.defaultTheme.fontIcon;

  return (
    <FontIcon {...props} className={theme.iconUnderlined}>
      {'format_underlined'}
    </FontIcon>
  );
};

/**
 * An alternate theme may be passed down by a provider
 */
UnderlinedIcon.contextTypes = {
  chamelTheme: PropTypes.object,
};

export default UnderlinedIcon;
