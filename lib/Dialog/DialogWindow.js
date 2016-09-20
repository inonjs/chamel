'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _WindowListenable = require('../mixins/WindowListenable');

var _WindowListenable2 = _interopRequireDefault(_WindowListenable);

var _CssEvent = require('../utils/CssEvent');

var _CssEvent2 = _interopRequireDefault(_CssEvent);

var _KeyCode = require('../utils/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _classable = require('../mixins/classable');

var _classable2 = _interopRequireDefault(_classable);

var _FlatButton = require('../FlatButton/FlatButton');

var _FlatButton2 = _interopRequireDefault(_FlatButton);

var _Overlay = require('../Overlay/Overlay');

var _Overlay2 = _interopRequireDefault(_Overlay);

var _Paper = require('../Paper/Paper');

var _Paper2 = _interopRequireDefault(_Paper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DialogWindow = _react2.default.createClass({
  displayName: 'DialogWindow',


  mixins: [_classable2.default, _WindowListenable2.default],

  propTypes: {
    actions: _react2.default.PropTypes.array,
    actionFocus: _react2.default.PropTypes.string,
    autoDetectWindowHeight: _react2.default.PropTypes.bool,
    autoScrollBodyContent: _react2.default.PropTypes.bool,
    contentClassName: _react2.default.PropTypes.string,
    openImmediately: _react2.default.PropTypes.bool,
    onClickAway: _react2.default.PropTypes.func,
    onDismiss: _react2.default.PropTypes.func,
    onShow: _react2.default.PropTypes.func,
    repositionOnUpdate: _react2.default.PropTypes.bool,
    modal: _react2.default.PropTypes.bool,
    title: _react2.default.PropTypes.node
  },

  windowListeners: {
    'keyup': '_handleWindowKeyUp'
  },

  getDefaultProps: function getDefaultProps() {
    return {
      autoDetectWindowHeight: false,
      autoScrollBodyContent: false,
      actions: [],
      repositionOnUpdate: true,
      modal: false
    };
  },

  getInitialState: function getInitialState() {
    return {
      open: this.props.openImmediately || false
    };
  },

  componentDidMount: function componentDidMount() {
    this._positionDialog();
    if (this.props.openImmediately) {
      this.refs.dialogOverlay.preventScrolling();
      this._onShow();
      this._focusOnAction();
    }
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    this._positionDialog();
    this._focusOnAction();
  },

  render: function render() {
    var classes = this.getClasses('chamel-dialog-window', {
      'chamel-is-shown': this.state.open
    });
    var contentClasses = 'chamel-dialog-window-contents';
    var actions = this._getActionsContainer(this.props.actions);

    if (this.props.contentClassName) {
      contentClasses += ' ' + this.props.contentClassName;
    }

    // Add title
    var title;
    if (this.props.title) {
      // If the title is a string, wrap in an h3 tag.
      // If not, just use it as a node.
      title = Object.prototype.toString.call(this.props.title) === '[object String]' ? _react2.default.createElement(
        'h3',
        { className: 'chamel-dialog-title' },
        this.props.title
      ) : this.props.title;
    }

    return _react2.default.createElement(
      'div',
      { className: classes },
      _react2.default.createElement(
        _Paper2.default,
        { ref: 'dialogWindow', className: contentClasses, zDepth: 4 },
        title,
        _react2.default.createElement(
          'div',
          { ref: 'dialogContent', className: 'chamel-dialog-window-contents-body' },
          this.props.children
        ),
        actions
      ),
      _react2.default.createElement(_Overlay2.default, { ref: 'dialogOverlay', show: this.state.open, autoLockScrolling: false, onClick: this._handleOverlayTouchTap })
    );
  },

  isOpen: function isOpen() {
    return this.state.open;
  },

  dismiss: function dismiss() {
    _CssEvent2.default.onTransitionEnd(_reactDom2.default.findDOMNode(this), function () {
      this.refs.dialogOverlay.allowScrolling();
    }.bind(this));

    this.setState({ open: false });
    this._onDismiss();
  },

  show: function show() {
    this.refs.dialogOverlay.preventScrolling();
    this._focusOnAction();

    this.setState({ open: true });
    this._onShow();
  },

  /**
   * Reposition the dialog - usually means dynamic content changed
   */
  reposition: function reposition() {
    this._positionDialog();
  },

  _addClassName: function _addClassName(reactObject, className) {
    var originalClassName = reactObject.props.className;
    var newClassname = originalClassName ? originalClassName + ' ' + className : className;

    return _react2.default.cloneElement(reactObject, { className: newClassname });
  },

  _getAction: function _getAction(actionJSON, key) {
    var props = {
      key: key,
      secondary: true,
      onClick: actionJSON.onClick ? actionJSON.onClick : this.dismiss,
      label: actionJSON.text
    };
    if (actionJSON.ref) {
      props.ref = actionJSON.ref;
      props.keyboardFocused = actionJSON.ref === this.props.actionFocus;
    }

    return _react2.default.createElement(_FlatButton2.default, props);
  },

  _getActionsContainer: function _getActionsContainer(actions) {
    var actionContainer;
    var actionObjects = [];

    if (actions.length) {
      for (var i = 0; i < actions.length; i++) {
        var currentAction = actions[i];

        //if the current action isn't a react object, create one
        if (!_react2.default.isValidElement(currentAction)) {
          currentAction = this._getAction(currentAction, i);
        }

        currentAction = this._addClassName(currentAction, 'chamel-dialog-window-action');
        actionObjects.push(currentAction);
      };

      actionContainer = _react2.default.createElement(
        'div',
        { className: 'chamel-dialog-window-actions' },
        actionObjects
      );
    }

    return actionContainer;
  },

  _positionDialog: function _positionDialog() {

    if (this.state.open) {
      var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      var container = _reactDom2.default.findDOMNode(this);
      var dialogWindow = _reactDom2.default.findDOMNode(this.refs.dialogWindow);
      var dialogContent = _reactDom2.default.findDOMNode(this.refs.dialogContent);
      var minPaddingTop = 0;

      //Reset the height in case the window was resized.
      dialogWindow.style.height = '';
      dialogContent.style.height = '';

      var dialogWindowHeight = dialogWindow.offsetHeight;
      var paddingTop = (clientHeight - dialogWindowHeight) / 2 - 2 * 64;

      // Set to full-height if we are in auto-detect
      if (this.props.autoDetectWindowHeight || this.props.autoScrollBodyContent) {
        paddingTop = 0;
      } else if (paddingTop < minPaddingTop) {
        paddingTop = minPaddingTop;
      }

      //Vertically center the dialog window, but make sure it doesn't
      //transition to that position.
      if (this.props.repositionOnUpdate || !container.style.paddingTop) {
        container.style.paddingTop = paddingTop + 'px';
      }

      // Force a height if the dialog is taller than clientHeight
      if (this.props.autoDetectWindowHeight || this.props.autoScrollBodyContent) {
        var maxDialogContentHeight = clientHeight - 2 * 64;

        if (this.props.title) {
          maxDialogContentHeight -= dialogContent.previousSibling.offsetHeight;
        }

        if (this.props.actions.length) {
          maxDialogContentHeight -= dialogContent.nextSibling.offsetHeight;
        }

        dialogContent.style.maxHeight = maxDialogContentHeight + 'px';
      }
    }
  },

  _focusOnAction: function _focusOnAction() {
    if (this.props.actionFocus) {
      _reactDom2.default.findDOMNode(this.refs[this.props.actionFocus]).focus();
    }
  },

  _onShow: function _onShow() {
    if (this.props.onShow) this.props.onShow();
  },

  _onDismiss: function _onDismiss() {
    if (this.props.onDismiss) this.props.onDismiss();
  },

  _handleOverlayTouchTap: function _handleOverlayTouchTap() {
    if (!this.props.modal) {
      this.dismiss();
      if (this.props.onClickAway) this.props.onClickAway();
    }
  },

  _handleWindowKeyUp: function _handleWindowKeyUp(e) {
    if (!this.props.modal && e.keyCode == _KeyCode2.default.ESC) {
      this.dismiss();
    }
  }

});

module.exports = DialogWindow;