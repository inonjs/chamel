var React = require('react');
var ReactDOM = require('react-dom');
var CssEvent = require('../utils/CssEvent');
var Dom = require('../utils/Dom');
var KeyLine = require('../utils/KeyLine');
var Classable = require('../mixins/classable');
var ClickAwayable = require('../mixins/ClickAwayable');
var Paper = require('../Paper');
var MenuItem = require('./MenuItem');
var LinkMenuItem = require('./LinkMenuItem');
var SubheaderMenuItem = require('./SubheaderMenuItem');

var Menu = React.createClass({

    mixins: [Classable],

    propTypes: {
        autoWidth: React.PropTypes.bool,
        onItemTap: React.PropTypes.func,
        onItemClick: React.PropTypes.func,
        onToggleClick: React.PropTypes.func,
        menuItems: React.PropTypes.array,
        selectedIndex: React.PropTypes.number,
        hideable: React.PropTypes.bool,
        visible: React.PropTypes.bool,
        zDepth: React.PropTypes.number,

        /**
         * The index that is currently being focused.
         *
         * This is used when moving the list up/down using the keyboard instead of hovering using the mouse
         *
         * @param {int}
         */
        focusedIndex: React.PropTypes.number,

        /**
         * Custom classes that will be applied to the paper container
         *
         * @param {string}
         */
        classes: React.PropTypes.string
    },

    getInitialState: function () {
        return {
            nestedMenuShown: false,
            focusedIndex: this.props.focusedIndex
        }
    },

    getDefaultProps: function () {
        return {
            focusedIndex: null,
            autoWidth: true,
            hideable: false,
            visible: true,
            zDepth: 1,
            menuItems: []
        };
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({focusedIndex: nextProps.focusedIndex})
    },

    componentDidMount: function () {
        var el = ReactDOM.findDOMNode(this);

        //Set the menu with
        this._setKeyWidth(el);

        //Save the initial menu height for later
        this._initialMenuHeight = el.offsetHeight + KeyLine.Desktop.GUTTER_LESS;

        //Show or Hide the menu according to visibility
        this._renderVisibility();
    },

    componentDidUpdate: function (prevProps, prevState) {

        if (this.props.visible !== prevProps.visible) this._renderVisibility();
    },

    render: function () {
        var classes = this.getClasses('chamel-menu', {
            'chamel-menu-hideable': this.props.hideable,
            'chamel-visible': this.props.visible
        });

        // If we have custom classes in the props, then let's include it
        if (this.props.classes) {
            classes += " " + this.props.classes;
        }

        let children = (this.props.menuItems.length) ? this._getChildren() : this.props.children;

        return (
            <Paper ref="paperContainer" onMouseEnter={this._handleMouseEnter} onMouseLeave={this._handleMouseLeave}
                   zDepth={this.props.zDepth} className={classes}>
                {children}
            </Paper>
        );
    },

    /**
     * Callback used to handle the hovering of mouse into the menu list
     *
     * @private
     */
    _handleMouseEnter: function () {
        this.setState({focusedIndex: null})
    },

    _getChildren: function () {
        var children = [],
            menuItem,
            itemComponent,
            isSelected,
            isDisabled,
            isFocused;

        //This array is used to keep track of all nested menu refs
        this._nestedChildren = [];

        for (var i = 0; i < this.props.menuItems.length; i++) {
            menuItem = this.props.menuItems[i];
            isSelected = i === this.props.selectedIndex;
            isDisabled = (menuItem.disabled === undefined) ? false : menuItem.disabled;

            if (this.state.focusedIndex == null) {
                isFocused = false;
            } else {
                isFocused = i === this.props.focusedIndex;
            }

            var {
                icon,
                data,
                attribute,
                number,
                toggle,
                onClick,
                ...other
                } = menuItem;

            switch (menuItem.type) {

                case MenuItem.Types.LINK:
                    itemComponent = (
                        <LinkMenuItem
                            key={i}
                            index={i}
                            payload={menuItem.payload}
                            target={menuItem.target}
                            text={menuItem.text}
                            disabled={isDisabled}/>
                    );
                    break;

                case MenuItem.Types.SUBHEADER:
                    itemComponent = (
                        <SubheaderMenuItem
                            key={i}
                            index={i}
                            text={menuItem.text}/>
                    );
                    break;

                case MenuItem.Types.NESTED:
                    let NestedMenuItem = require("./NestedMenuItem");
                    itemComponent = (
                        <NestedMenuItem
                            ref={i}
                            key={i}
                            index={i}
                            text={menuItem.text}
                            disabled={isDisabled}
                            menuItems={menuItem.items}
                            zDepth={this.props.zDepth}
                            onItemClick={this._onNestedItemClick}
                            onItemTap={this._onNestedItemClick}/>
                    );
                    this._nestedChildren.push(i);
                    break;

                default:
                    itemComponent = (
                        <MenuItem
                            {...other}
                            selected={isSelected}
                            focused={isFocused}
                            key={i}
                            index={i}
                            icon={menuItem.icon}
                            data={menuItem.data}
                            attribute={menuItem.attribute}
                            number={menuItem.number}
                            toggle={menuItem.toggle}
                            disabled={isDisabled}
                            onClick={this._onItemClick}>
                            {menuItem.text}
                        </MenuItem>
                    );
            }
            children.push(itemComponent);
        }

        return children;
    },

    _setKeyWidth: function (el) {
        var menuWidth = this.props.autoWidth ?
        KeyLine.getIncrementalDim(el.offsetWidth) + 'px' :
            '100%';

        //Update the menu width
        Dom.withoutTransition(el, function () {
            // Changed the below to use auto width because
            // it was causing text to extnd beyond the menu
            // if items were added after the fact.
            // - Sky Stebnicki
            // el.style.width = menuWidth;
            el.style.width = "auto";
        });
    },

    _renderVisibility: function () {
        var el;

        if (this.props.hideable) {
            el = ReactDOM.findDOMNode(this);
            var innerContainer = ReactDOM.findDOMNode(this.refs.paperContainer.getInnerContainer());

            if (this.props.visible) {
                // Update the width
                this._setKeyWidth(el);

                //Open the menu
                /*
                 This was not dealing with added menu items well at all. Changed the height
                 to auto to fix the problems.
                 - Sky Stebnicki
                 */
                el.style.height = "auto"; //this._initialMenuHeight + 'px';

                //Set the overflow to visible after the animation is done so
                //that other nested menus can be shown
                CssEvent.onTransitionEnd(el, function () {
                    //Make sure the menu is open before setting the overflow.
                    //This is to accout for fast clicks
                    if (this.props.visible) innerContainer.style.overflow = 'visible';
                }.bind(this));

            } else {

                //Close the menu
                el.style.height = '0px';

                //Set the overflow to hidden so that animation works properly
                innerContainer.style.overflow = 'hidden';
            }
        }
    },

    _onNestedItemClick: function (e, index, menuItem) {
        if (this.props.onItemClick) this.props.onItemClick(e, index, menuItem);
    },

    _onNestedItemTap: function (e, index, menuItem) {
        if (this.props.onItemTap) this.props.onItemTap(e, index, menuItem);
    },

    _onItemClick: function (e, index) {
        if (this.props.onItemClick) this.props.onItemClick(e, index, this.props.menuItems[index]);
    },

    _onItemTap: function (e, index) {
        if (this.props.onItemTap) this.props.onItemTap(e, index, this.props.menuItems[index]);
    },

    _onItemToggle: function (e, index, toggled) {
        if (this.props.onItemToggle) this.props.onItemToggle(e, index, this.props.menuItems[index], toggled);
    }

});

module.exports = Menu;
