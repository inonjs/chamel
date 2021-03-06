import React from 'react';
import PropTypes from 'prop-types';
import TouchRipple from '../ripples/TouchRipple';
import classnames from 'classnames';
import ThemeService from '../styles/ChamelThemeService';
import Checkbox from '../Toggle/Checkbox';

/**
 * Functional component for any button
 *
 * @param props
 * @param context
 * @returns {ReactDOM}
 * @constructor
 */
const ListItem = (props, context) => {
  let theme =
    context.chamelTheme && context.chamelTheme.list
      ? context.chamelTheme.list
      : ThemeService.defaultTheme.list;

  let classes = classnames(theme.listItem, {
    [theme.listItemSelected]: props.selected,
    [theme.listItemEmphasized]: props.emphasized,
  });

  // Set ontap functions
  const onTap = props.onTap ? props.onTap : e => {};
  const onLeftElementTap = props.onLeftElementTap || onTap;

  // If we have a left element add it
  let leftElement = null;
  if (props.leftElement) {
    const leftIcon =
      props.selected && props.selectedShowCheckbox ? (
        <Checkbox checked={true} />
      ) : (
        props.leftElement
      );

    leftElement = (
      <div onClick={onLeftElementTap} className={theme.listItemLeft}>
        {leftIcon}
      </div>
    );
  }

  // If we have a right element add it
  const rightElement = props.rightElement ? (
    <div className={theme.listItemRight}>{props.rightElement}</div>
  ) : null;

  return (
    <div className={classes}>
      <TouchRipple>
        <div className={theme.listItemContent}>
          {leftElement}
          <div className={theme.listItemData} onClick={onTap}>
            <div className={theme.listItemPrimary}>{props.primaryText}</div>
            <div className={theme.listItemSecondary}>{props.secondaryText}</div>
          </div>
          {rightElement}
        </div>
      </TouchRipple>
    </div>
  );
};

/**
 * Set accepted properties
 */
ListItem.propTypes = {
  /**
   * Primary text/title of the item
   */
  primaryText: PropTypes.string,

  /**
   * Secondary text for the item - often a snippet of the body
   */
  secondaryText: PropTypes.string,

  /**
   * Optional children to render into the item
   */
  children: PropTypes.node,

  /**
   * Optional flag that can be set to indicate this item is selected
   */
  selected: PropTypes.bool,

  /**
   * Show a checkbox if this item is slected (or on mouse hover to indicate it can be)
   */
  selectedShowCheckbox: PropTypes.bool,

  /**
   * Used to highlight an entry - often used to mark a new entry
   */
  emphasized: PropTypes.bool,

  /**
   * Node element to render on the left side
   */
  leftElement: PropTypes.node,

  /**
   * Node element to render on the right side
   */
  rightElement: PropTypes.node,

  /**
   * Event called when the primary action is tapped or Clicked
   */
  onTap: PropTypes.func,

  /**
   * Event called when the left element is tapped or Clicked
   */
  onLeftElementTap: PropTypes.func,
};

/**
 * Set property defaults
 */
ListItem.defaultProps = {
  primaryText: null,
  secondaryText: null,
  leftElement: null,
  rightElement: null,
  selected: false,
  emphasized: false,
};

/**
 * An alternate theme may be passed down by a provider
 */
ListItem.contextTypes = {
  chamelTheme: PropTypes.object,
};

export default ListItem;
