'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Events = require('../utils/Events');

var _Events2 = _interopRequireDefault(_Events);

var _Dom = require('../utils/Dom');

var _Dom2 = _interopRequireDefault(_Dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Main popover class handles absolute positioning paper relative to an element
 */
var Popover = function (_React$Component) {
  _inherits(Popover, _React$Component);

  /**
   * Class constructor
   * 
   * @param {Object} props Properties to send to the render function
   */
  function Popover(props) {
    _classCallCheck(this, Popover);

    var _this = _possibleConstructorReturn(this, (Popover.__proto__ || Object.getPrototypeOf(Popover)).call(this, props));

    // Call paprent constructor


    _this._checkClickAway = function (e) {
      var el = _reactDom2.default.findDOMNode(_this);
      var anchorEl = _reactDom2.default.findDOMNode(_this.props.anchorEl);

      // Check if the target is inside the current component
      if (_this.props.open && e.target != el && !_Dom2.default.isDescendant(el, e.target) && e.target != anchorEl && !_Dom2.default.isDescendant(anchorEl, e.target) && document.documentElement.contains(e.target)) {
        if (_this.props.onRequestClose) {
          _this.props.onRequestClose();
        }
      }
    };

    return _this;
  }

  /**
   * Set property defaults
   */


  /**
   * Set accepted properties
   */


  /**
   * An alternate theme may be passed down by a provider
   */


  _createClass(Popover, [{
    key: 'componentDidMount',


    /**
     * Popover has entered the dom
     */
    value: function componentDidMount() {
      _Events2.default.on(document, 'click', this._checkClickAway);
    }

    /**
     * Componenent is about to exit the dom
     */

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _Events2.default.off(document, 'click', this._checkClickAway);
    }

    /**
     * Triggered after the component receives updated props
     */

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._setPlacement();
    }

    /**
     * Render into the virtual dom
     */

  }, {
    key: 'render',
    value: function render() {
      // Determine which theme to use
      var theme = this.context.chamelTheme && this.context.chamelTheme.popover ? this.context.chamelTheme.popover : {};

      var classes = theme.popover;
      if (this.props.open) {
        classes += " " + theme.popoverVisible;
      }

      return _react2.default.createElement(
        'div',
        { className: classes },
        this.props.children
      );
    }

    /**
     * Handle when the user clicks away from the popup
     */

  }, {
    key: '_setPlacement',


    /**
     * Reposition the popover on the page
     */
    value: function _setPlacement() {
      if (!this.props.open) {
        return;
      }

      var targetEl = _reactDom2.default.findDOMNode(this);
      var anchorEl = _reactDom2.default.findDOMNode(this.props.anchorEl);

      var _props = this.props;
      var targetOrigin = _props.targetOrigin;
      var anchorOrigin = _props.anchorOrigin;


      var anchorPosition = _Dom2.default.offset(anchorEl);

      /*
       * Determine relative positions based on the anchor element coords
       */
      var relativeAnchorPosition = {
        top: anchorPosition.top,
        middle: anchorPosition.top + anchorPosition.height / 2,
        bottom: anchorPosition.top + anchorPosition.height,
        left: anchorPosition.left,
        center: anchorPosition.left + anchorPosition.width / 2,
        right: anchorPosition.left + anchorPosition.width
      };

      var targetPosition = {
        top: relativeAnchorPosition[anchorOrigin.vertical],
        left: relativeAnchorPosition[anchorOrigin.horizontal]
      };

      targetEl.style.top = Math.max(0, targetPosition.top) + 'px';
      targetEl.style.left = Math.max(0, targetPosition.left) + 'px';
      targetEl.style.maxHeight = window.innerHeight + 'px';
      targetEl.style.maxWidth = window.innerWidth + 'px';

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

  }, {
    key: '_applyAutoPositionIfNeeded',
    value: function _applyAutoPositionIfNeeded(relativeTargetPosition, targetEl) {
      var targetPosition = _Dom2.default.offset(targetEl);

      // Movethe target position up so it is not scrolling past the bottom
      if (targetPosition.top + targetPosition.height > window.innerHeight) {
        // Initialize new top position
        var newTop = relativeTargetPosition.top;

        // Subtract enough pixels to get it inside the bounds of the window
        newTop -= targetPosition.top + targetPosition.height - window.innerHeight;

        // Apply the new position
        targetEl.style.top = newTop + 'px';
      }

      // Move target position just to the left of the right outer bounds
      if (targetPosition.right > window.innerWidth) {
        // Initialize new left position
        var newLeft = relativeTargetPosition.left;

        // Subtract enough pixels to get it inside the bounds of the window
        newLeft -= targetPosition.right - window.innerWidth;

        // Apply the new position
        targetEl.style.left = newLeft + 'px';
      }
    }
  }]);

  return Popover;
}(_react2.default.Component);

Popover.defaultProps = {
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
Popover.propTypes = {
  open: _react2.default.PropTypes.bool,
  anchorEl: _react2.default.PropTypes.object,
  zDepth: _react2.default.PropTypes.number,

  /**
   * This is the point on the anchor where the popover
   * targetOrigin will stick to.
   * Options:
   * vertical: [top, middle, bottom]
   * horizontal: [left, center, right]
   */
  anchorOrigin: _react2.default.PropTypes.shape({
    vertical: _react2.default.PropTypes.oneOf(['top', 'middle', 'bottom']),
    horizontal: _react2.default.PropTypes.oneOf(['left', 'center', 'right'])
  }),

  /**
   * This is the point on the popover which will stick to
   * the anchors origin.
   * Options:
   * vertical: [top, middle, bottom]
   * horizontal: [left, center, right]
   */
  targetOrigin: _react2.default.PropTypes.shape({
    vertical: _react2.default.PropTypes.oneOf(['top', 'middle', 'bottom']),
    horizontal: _react2.default.PropTypes.oneOf(['left', 'center', 'right'])
  })
};
Popover.contextTypes = {
  chamelTheme: _react2.default.PropTypes.object
};
exports.default = Popover;
module.exports = exports['default'];