import React from 'react';
import PropTypes from 'prop-types';
import FontIcon from '../../FontIcon';
import ThemeService from '../../styles/ChamelThemeService';

/**
 * Italic Icon button
 *
 * @param props
 * @param context
 * @returns {ReactDOM}
 * @constructor
 */
const ItalicIcon = (props, context) => {
  let theme =
    context.chamelTheme && context.chamelTheme.fontIcon
      ? context.chamelTheme.fontIcon
      : ThemeService.defaultTheme.fontIcon;

  return (
    <FontIcon {...props} className={theme.iconItalic}>
      {'format_italic'}
    </FontIcon>
  );
};

/**
 * An alternate theme may be passed down by a provider
 */
ItalicIcon.contextTypes = {
  chamelTheme: PropTypes.object,
};

export default ItalicIcon;
