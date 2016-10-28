import React, { Component, PropTypes } from 'react';
import FontIcon from '../../FontIcon';
import ThemeService from '../../styles/ChamelThemeService';

/**
 * Dashboard button
 *
 * @param props
 * @param context
 * @returns {ReactDOM}
 * @constructor
 */
const DashboardIcon = (props, context) => {
    let theme = (context.chamelTheme && context.chamelTheme.fontIcon)
        ? context.chamelTheme.fontIcon : ThemeService.defaultTheme.fontIcon;

    return (
        <FontIcon {...props} className={theme.iconDashboard}>{"dashboard"}</FontIcon>
    );
};

/**
 * An alternate theme may be passed down by a provider
 */
DashboardIcon.contextTypes = {
    chamelTheme: React.PropTypes.object
};

export default DashboardIcon;