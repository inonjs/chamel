import React, { Component, PropTypes } from 'react';
import FontIcon from '../../FontIcon';

const MoreVertIcon = (props, context) => {
  let theme = (context.chamelTheme && context.chamelTheme.fontIcons)
    ? context.chamelTheme.fontIcons : {};

  return (
    <FontIcon {...props} className={theme.iconMoreVert} />
  );
};

/**
 * An alternate theme may be passed down by a provider
 */
MoreVertIcon.contextTypes = {
  chamelTheme: React.PropTypes.object
};

export default MoreVertIcon;