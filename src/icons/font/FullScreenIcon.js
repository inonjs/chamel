import React, { Component, PropTypes } from 'react';
import FontIcon from '../../FontIcon';

const FullScreenIcon = (props, context) => {
  let theme = (context.chamelTheme && context.chamelTheme.fontIcons)
    ? context.chamelTheme.fontIcons : {};

  return (
    <FontIcon {...props} className={theme.iconFullScreen} />
  );
};

/**
 * An alternate theme may be passed down by a provider
 */
FullScreenIcon.contextTypes = {
  chamelTheme: React.PropTypes.object
};

export default FullScreenIcon;