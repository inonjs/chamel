var React = require('react');

module.exports = {

  isDescendant: function(parent, child) {
    var node = child.parentNode;

    while (node != null) {
      if (node == parent) return true;
      node = node.parentNode;
    }

    return false;
  },

  offset: function(el) {
    var rect = el.getBoundingClientRect();
    var documentOffset = this.scrollOffset();

    // Set simple points
    let points = {
      top: rect.top + documentOffset.top,
      left: rect.left + documentOffset.left,
      bottom: rect.bottom + documentOffset.top,
      right: rect.right + documentOffset.left,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top
    }

    // Add a couple computed points from the simple
    points.middle = points.top + (points.height / 2);
    points.center = points.left + (points.width / 2);

    return points;
  },

  scrollOffset: function(el) {
    // If we passed an element, return scroll positions of the element
    if (el) {
      return {
        top: el.scrollTop,
        left: el.scrollLeft
      }
    }

    // Try to get the body
    var doc = document.documentElement;
    var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    return { top: top, left: left }
  },

  addClass: function(el, className) {
    if (el.classList)
      el.classList.add(className);
    else
      el.className += ' ' + className;
  },

  removeClass: function(el, className) {
    if (el.classList)
      el.classList.remove(className);
    else
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  },

  hasClass: function(el, className) {
    if (el.classList)
      return el.classList.contains(className);
    else
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  },

  toggleClass: function(el, className) {
    if (this.hasClass(el, className))
      this.removeClass(el, className);
    else
      this.addClass(el, className);
  },

  forceRedraw: function(el) {
    var originalDisplay = el.style.display;

    el.style.display = 'none';
    el.offsetHeight;
    el.style.display = originalDisplay;
  },

  withoutTransition: function(el, callback) {
    //turn off transition
    el.style.transition = 'none';

    callback();

    //force a redraw
    this.forceRedraw(el);

    //put the transition back
    el.style.transition = '';
  }

}