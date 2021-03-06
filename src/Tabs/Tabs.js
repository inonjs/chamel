import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ThemeService from '../styles/ChamelThemeService';
import classnames from 'classnames';

/**
 * Outer container for tabs
 */
class Tabs extends Component {
  static propTypes = {
    /**
     * Which index to select first after render is done
     *
     * Defaults to 0. This is good for thins like saving the
     * state of the UI re-opening a page back to the selected tab
     */
    initialSelectedIndex: PropTypes.number,

    /**
     * Callback to notify listener when the selected index changes
     */
    onChange: PropTypes.func,

    /**
     * Set a static tab width.
     *
     * If not set all tabs will be automatically computed to evenly fill
     * 100% of the container width
     */
    tabWidth: PropTypes.number,

    /**
     * Used for inline body tabs rather than at the top of the page
     */
    secondary: PropTypes.bool,
  };

  /**
   * An alternate theme may be passed down by a provider
   */
  static contextTypes = {
    chamelTheme: PropTypes.object,
  };

  /**
   * Class constructor
   *
   * @param {Object} props Properties to send to the render function
   */
  constructor(props) {
    // Call parent constructor
    super(props);

    let selectedIndex = 0;
    if (
      this.props.initialSelectedIndex &&
      this.props.initialSelectedIndex < this.props.children.length
    ) {
      selectedIndex = this.props.initialSelectedIndex;
    }

    this.state = {
      selectedIndex: selectedIndex,
    };
  }

  getEvenWidth() {
    return parseInt(
      window.getComputedStyle(ReactDOM.findDOMNode(this)).getPropertyValue('width'),
      10,
    );
  }

  getTabCount() {
    return React.Children.count(this.props.children);
  }

  componentDidMount() {
    if (this.props.tabWidth) {
      if (!(this.props.children.length * this.props.tabWidth > this.getEvenWidth())) {
        this.setState({
          width: this.props.tabWidth,
          fixed: false,
        });
        return;
      }
    }

    this.setState({
      width: this.getEvenWidth(),
      fixed: true,
    });
  }

  /**
   * Handle touch or click
   *
   * @param tabIndex
   * @param tab
   */
  handleTouchTap = (tabIndex, tab) => {
    if (this.props.onChange && this.state.selectedIndex !== tabIndex) {
      this.props.onChange(tabIndex, tab);
    }

    this.setState({ selectedIndex: tabIndex });
    //default CB is _onActive. Can be updated in tab
    if (tab.props.onActive) tab.props.onActive(tab);
  };

  render() {
    // Determine which theme to use
    let theme =
      this.context.chamelTheme && this.context.chamelTheme.tabs
        ? this.context.chamelTheme.tabs
        : ThemeService.defaultTheme.tabs;

    const _this = this;
    let width = 100 / this.getTabCount() + '%';

    // Get classes for the tab item container
    const tabItemContainerClasses = this.props.secondary
      ? theme.tabItemContainerSecondary
      : theme.tabItemContainer;
    const tabUnderlineBar = this.props.secondary ? theme.tabInkBarSecondary : theme.tabInkBar;

    /*
     var width = this.state.fixed ?
     this.state.width/this.props.children.length :
     this.props.tabWidth;*/
    let left = 'calc(' + width + '*' + this.state.selectedIndex + ')';
    //var left = width * this.state.selectedIndex || 0;
    let currentTemplate = null;
    const tabs = React.Children.map(this.props.children, function(tab, index) {
      // Generic UI implementation
      if (_this.state.selectedIndex === index) currentTemplate = tab.props.children;
      return React.cloneElement(tab, {
        key: index,
        selected: _this.state.selectedIndex === index,
        tabIndex: index,
        width: width,
        secondary: _this.props.secondary,
        handleTouchTap: _this.handleTouchTap,
      });
    });

    return (
      <div className={theme.tabsContainer}>
        <div className={tabItemContainerClasses}>{tabs}</div>
        <div className={tabUnderlineBar} style={{ left: left, width: width }} />
        <div className={theme.tabTemplate}>{currentTemplate}</div>
      </div>
    );
  }
}

export default Tabs;
