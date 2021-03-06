import React from 'react';
import PropTypes from 'prop-types';
import FontIcon from '../../FontIcon';
import ThemeService from '../../styles/ChamelThemeService';

/**
 * Bold Icon button
 *
 * @param props
 * @param context
 * @returns {ReactDOM}
 * @constructor
 */
const BoldIcon = (props, context) => {
  let theme =
    context.chamelTheme && context.chamelTheme.fontIcon
      ? context.chamelTheme.fontIcon
      : ThemeService.defaultTheme.fontIcon;

  return (
    <FontIcon {...props} className={theme.iconBold}>
      {'format_bold'}
    </FontIcon>
  );
};

/**
 * An alternate theme may be passed down by a provider
 */
BoldIcon.contextTypes = {
  chamelTheme: PropTypes.object,
};

export default BoldIcon;
