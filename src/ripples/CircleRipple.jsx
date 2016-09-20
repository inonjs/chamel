import React from 'react';
import classnames from 'classnames';

class CircleRipple extends React.Component {

  /**
   * Set accepted properties
   */
  static propTypes = {
    className: React.PropTypes.string,
    started: React.PropTypes.bool,
    ending: React.PropTypes.bool,
    style: React.PropTypes.object
  };

  /**
   * An alternate theme may be passed down by a provider
   */
  static contextTypes = {
    chamelTheme: React.PropTypes.object
  };

  render() {

    let theme = (this.context.chamelTheme && this.context.chamelTheme.ripple)
      ? this.context.chamelTheme.ripple : {};

    let classes = classnames(theme.rippleCircle, {
      [theme.rippleCircleIsStarted]: this.props.started,
      [theme.rippleCircleIsEnding]: this.props.ending
    });

    let innerClasses = classnames(theme.rippleCircleInner, {
      [theme.rippleCircleIsStartedInner]: this.props.started
    });

    return (
      <div className={classes} style={this.props.style}>
        <div className={innerClasses} />
      </div>
    );
  }
}

export default CircleRipple;