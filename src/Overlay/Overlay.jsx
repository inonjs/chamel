import React from 'react';
import Classable from '../mixins/classable';

var Overlay = React.createClass({

  mixins: [Classable],

  propTypes: {
    show: React.PropTypes.bool,
    autoLockScrolling: React.PropTypes.bool
  },
  
  getDefaultProps: function() {
    return {
      autoLockScrolling: true
    };
  },
  
  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.autoLockScrolling) (this.props.show) ? this._preventScrolling() : this._allowScrolling();
  },

  render: function() {
    var 
      {
        className,
        ...other
      } = this.props,
      classes = this.getClasses('chamel-overlay', {
        'chamel-is-shown': this.props.show
      });

    return (
      <div className={classes} />
    );
  },
  
  preventScrolling: function() {
    if (!this.props.autoLockScrolling) this._preventScrolling();
  },
  
  allowScrolling: function() {
    if (!this.props.autoLockScrolling) this._allowScrolling();
  },
  
  _preventScrolling: function() {
    var body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'hidden';
  },
  
  _allowScrolling: function() {
    var body = document.getElementsByTagName('body')[0];
    body.style.overflow = '';
  }

});

// Check for commonjs
if (module) {
  module.exports = Overlay;
}

export default Overlay;
