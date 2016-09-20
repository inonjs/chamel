import React from 'react';
import ReactDOM from 'react-dom';
import Events from '../utils/Events';
import Dom from '../utils/Dom';

/**
 * Main popover class handles absolute positioning paper relative to an element
 */
class Popover extends React.Component {

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
   * Set property defaults
   */
  static defaultProps = {
    open: false,
    anchorEl: null,
    zDepth: 1,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left'
    },
    targetOrigin: {
      vertical: 'top',
      horizontal: 'left'
    }
  };


  /**
   * Set accepted properties
   */
  static propTypes = {
    open: React.PropTypes.bool,
    anchorEl: React.PropTypes.object,
    zDepth: React.PropTypes.number,

    /**
     * This is the point on the anchor where the popover
     * targetOrigin will stick to.
     * Options:
     * vertical: [top, middle, bottom]
     * horizontal: [left, center, right]
     */
    anchorOrigin: React.PropTypes.shape({
      vertical: React.PropTypes.oneOf(['top', 'middle', 'bottom']),
      horizontal: React.PropTypes.oneOf(['left', 'center', 'right'])
    }),

    /**
     * This is the point on the popover which will stick to
     * the anchors origin.
     * Options:
     * vertical: [top, middle, bottom]
     * horizontal: [left, center, right]
     */
    targetOrigin: React.PropTypes.shape({
      vertical: React.PropTypes.oneOf(['top', 'middle', 'bottom']),
      horizontal: React.PropTypes.oneOf(['left', 'center', 'right'])
    })
  };

  /**
   * An alternate theme may be passed down by a provider
   */
  static contextTypes = {
    chamelTheme: React.PropTypes.object
  };

  /**
   * Popover has entered the dom
   */
  componentDidMount() {
    Events.on(document, 'click', this._checkClickAway);
  }

  /**
   * Componenent is about to exit the dom
   */
  componentWillUnmount() {
    Events.off(document, 'click', this._checkClickAway);
  }

  /**
   * Triggered after the component receives updated props
   */
  componentDidUpdate() {
    this._setPlacement();
  }

  /**
   * Render into the virtual dom
   */
  render() {
    // Determine which theme to use
    let theme = (this.context.chamelTheme && this.context.chamelTheme.popover)
      ? this.context.chamelTheme.popover : {};

    var classes = theme.popover;
    if (this.props.open) {
      classes += " " + theme.popoverVisible;
    }
    
    return (
      <div className={classes}>
        {this.props.children}
      </div>
    );
  }

  /**
   * Handle when the user clicks away from the popup
   */
  _checkClickAway = (e) => {
    let el = ReactDOM.findDOMNode(this);
    let anchorEl = ReactDOM.findDOMNode(this.props.anchorEl);

    // Check if the target is inside the current component
    if (this.props.open &&
        e.target != el &&
        !Dom.isDescendant(el, e.target) &&
        e.target != anchorEl &&
        !Dom.isDescendant(anchorEl, e.target) &&
        document.documentElement.contains(e.target)) {
      if (this.props.onRequestClose) {
        this.props.onRequestClose();
      }
    }
  }

  /**
   * Reposition the popover on the page
   */
  _setPlacement() {
    if (!this.props.open) {
      return;
    }

    let targetEl = ReactDOM.findDOMNode(this);
    let anchorEl = ReactDOM.findDOMNode(this.props.anchorEl);

    const {targetOrigin, anchorOrigin} = this.props;

    const anchorPosition = Dom.offset(anchorEl);

    /*
     * Determine relative positions based on the anchor element coords
     */
    const relativeAnchorPosition = {
        top: anchorPosition.top,
        middle: anchorPosition.top + (anchorPosition.height / 2),
        bottom: anchorPosition.top + anchorPosition.height,
        left: anchorPosition.left,
        center: anchorPosition.left + (anchorPosition.width / 2),
        right: anchorPosition.left + anchorPosition.width
    };

    let targetPosition = {
      top: relativeAnchorPosition[anchorOrigin.vertical],
      left: relativeAnchorPosition[anchorOrigin.horizontal]
    };

    targetEl.style.top = `${Math.max(0, targetPosition.top)}px`;
    targetEl.style.left = `${Math.max(0, targetPosition.left)}px`;
    targetEl.style.maxHeight = `${window.innerHeight}px`;
    targetEl.style.maxWidth = `${window.innerWidth}px`;

    // Update position if out of viewing bounds
    this._applyAutoPositionIfNeeded(targetPosition, targetEl);
  }

  /**
   * If needed we can reposition based on current viewport bounds
   *
   * Make sure that the popover is not off the viewport to the right or bottom
   * of the page.
   *
   * @private
   * @param {Object} relativeTargetPosition The current relative top and left
   *  props relative to the anchorElement.
   * @param {DOMElement} targetEl Floating popover DOM element being repositioned
   */
  _applyAutoPositionIfNeeded(relativeTargetPosition, targetEl) {
    const targetPosition = Dom.offset(targetEl);

    // Movethe target position up so it is not scrolling past the bottom
    if (targetPosition.top + targetPosition.height > window.innerHeight) {
      // Initialize new top position
      let newTop = relativeTargetPosition.top;

      // Subtract enough pixels to get it inside the bounds of the window
      newTop -= (targetPosition.top + targetPosition.height) - window.innerHeight;

      // Apply the new position
      targetEl.style.top = `${newTop}px`;
    }

    // Move target position just to the left of the right outer bounds
    if (targetPosition.right > window.innerWidth) {
      // Initialize new left position
      let newLeft = relativeTargetPosition.left;

      // Subtract enough pixels to get it inside the bounds of the window
      newLeft -= (targetPosition.right) - window.innerWidth;

      // Apply the new position
      targetEl.style.left = `${newLeft}px`;
    }
  }
}

export default Popover;