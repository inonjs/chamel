import React from 'react';
import DateTime from '../utils/DateTime';
import IconButton from '../IconButton/IconButton';
import NavigationChevronLeft from '../svg-icons/navigation-chevron-left';
import NavigationChevronRight from '../svg-icons/navigation-chevron-right';
import SlideInTransitionGroup from '../transition-groups/SlideIn';

var CalendarToolbar = React.createClass({

  propTypes: {
    displayDate: React.PropTypes.object.isRequired,
    onLeftTouchTap: React.PropTypes.func,
    onRightTouchTap: React.PropTypes.func,
    maxDate: React.PropTypes.object,
    minDate: React.PropTypes.object
  },

  getDefaultProps: function () {
      return {
        maxDate: null,
        minDate: null
      };
  },

  getInitialState: function() {
    return {
      transitionDirection: 'up'
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var direction;

    if (nextProps.displayDate !== this.props.displayDate) {
      direction = nextProps.displayDate > this.props.displayDate ? 'up' : 'down';
      this.setState({
        transitionDirection: direction
      });
    }
  },
  _isDisabled: function(direction){
    
    var date = this.props.displayDate;
    var minDate = this.props.minDate;
    var maxDate = this.props.maxDate;

    if(direction == "left" && minDate){      
      if(date.getFullYear() < minDate.getFullYear()) return true;
      if(date.getFullYear() == minDate.getFullYear()){
        return date.getMonth() <= minDate.getMonth();
      }
    }else if(direction == "right" && maxDate){
      if(date.getFullYear() > maxDate.getFullYear()) return true;
      if(date.getFullYear() == maxDate.getFullYear()){
        return date.getMonth() >= maxDate.getMonth();
      }
    }

    return false;
  },
  render: function() {
    var month = DateTime.getFullMonth(this.props.displayDate);
    var year = this.props.displayDate.getFullYear();

    var disableLeft = this._isDisabled("left");
    var disableRight = this._isDisabled("right");

    return (
      <div className="chamel-date-picker-calendar-toolbar">

        <SlideInTransitionGroup
          className="chamel-date-picker-calendar-toolbar-title"
          direction={this.state.transitionDirection}>
          <div key={month + '_' + year}>{month} {year}</div>
        </SlideInTransitionGroup>

        <IconButton
          disabled={disableLeft}
          className="chamel-date-picker-calendar-toolbar-button-left"
          onClick={this.props.onLeftTouchTap}>
            <NavigationChevronLeft/>
        </IconButton>

        <IconButton
          disabled={disableRight}        
          className="chamel-date-picker-calendar-toolbar-button-right"
          onClick={this.props.onRightTouchTap}>
            <NavigationChevronRight/>
        </IconButton>

      </div>
    );
  }

});

module.exports = CalendarToolbar;
