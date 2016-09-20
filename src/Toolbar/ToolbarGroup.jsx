import React from 'react';
import classnames from 'classnames';

/**
 * Main popover class handles absolute positioning paper relative to an element
 */
class ToolbarGroup extends React.Component {

  /**
   * Class constructor
   *
   * @param {Object} props Properties to send to the render function
   */
  constructor(props) {
      // Call paprent constructor
      super(props);
  }

  /**
   * Set accepted properties
   */
  static propTypes = {
    float: React.PropTypes.string
  };

  /**
   * An alternate theme may be passed down by a provider
   */
  static contextTypes = {
    chamelTheme: React.PropTypes.object
  };

  render() {
    // Determine which theme to use
    let theme = (this.context.chamelTheme && this.context.chamelTheme.toolbar)
      ? this.context.chamelTheme.toolbar : {};
    
      var classes = classnames(theme.toolbarGroup, {
        [theme.toolbarGroupLeft]: this.props.float === 'left',
        [theme.toolbarGroupRight]: this.props.float === 'right'
      });

      console.log("Toolbar group", theme);

      return (
          <div className={classes}>
              {this.props.children}
          </div>
      );
  }

}

export default ToolbarGroup;
