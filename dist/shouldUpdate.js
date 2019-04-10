'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var lastKnownScrollY = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
  var currentScrollY = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  var props = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var state = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
  var scrollerHeight = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0;
  var scrollerPhysicalHeight = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : 0;

  var scrollDirection = currentScrollY >= lastKnownScrollY ? 'down' : 'up';
  var distanceScrolled = Math.abs(currentScrollY - lastKnownScrollY);

  // We're disabled
  if (props.disable) {
    return {
      action: 'none',
      scrollDirection: scrollDirection,
      distanceScrolled: distanceScrolled
    };
  } else if (props.isFooter && currentScrollY <= props.pinStart && state.state !== 'pinned') {
    // We're a footer and at the top so should be pinned
    return {
      action: 'pin',
      scrollDirection: scrollDirection,
      distanceScrolled: distanceScrolled
      // We're at the top and not fixed yet.
    };
  } else if (!props.isFooter && currentScrollY <= 0 && state.state !== 'unfixed') {
    return {
      action: 'unfix',
      scrollDirection: scrollDirection,
      distanceScrolled: distanceScrolled
      // We're unfixed and headed down. Carry on.
    };
  } else if (currentScrollY <= state.height && scrollDirection === 'down' && state.state === 'unfixed') {
    return {
      action: 'none',
      scrollDirection: scrollDirection,
      distanceScrolled: distanceScrolled
    };
  } else if (currentScrollY > state.height + props.pinStart && scrollDirection === 'down' && state.state === 'unfixed') {
    return {
      action: 'unpin-snap',
      scrollDirection: scrollDirection,
      distanceScrolled: distanceScrolled
    };
  } else if (scrollDirection === 'down' && state.state !== 'fixed' && currentScrollY > state.height + props.pinStart && distanceScrolled > props.downTolerance && props.sticky) {
    return {
      action: 'fix',
      scrollDirection: scrollDirection,
      distanceScrolled: distanceScrolled
      // We're past the header and scrolling down.
      // We transition to "unpinned" if necessary.
    };
  } else if (scrollDirection === 'down' && ['pinned', 'unfixed'].indexOf(state.state) >= 0 && currentScrollY > state.height && distanceScrolled > props.downTolerance && (
  // Don't unpin if we are a footer and at the bottom
  !props.isFooter || currentScrollY + scrollerPhysicalHeight < scrollerHeight - state.height)) {
    return {
      action: props.sticky ? 'fix' : 'unpin',
      scrollDirection: scrollDirection,
      distanceScrolled: distanceScrolled
      // We're a footer and have reached the bottom
    };
  } else if (props.isFooter && currentScrollY + scrollerPhysicalHeight >= scrollerHeight - state.height && state.state !== 'pinned') {
    return {
      action: 'pin',
      scrollDirection: scrollDirection,
      distanceScrolled: distanceScrolled
      // We're scrolling up, we transition to "pinned"
    };
  } else if (scrollDirection === 'up' && distanceScrolled > props.upTolerance && ['pinned', 'unfixed'].indexOf(state.state) < 0) {
    return {
      action: 'pin',
      scrollDirection: scrollDirection,
      distanceScrolled: distanceScrolled
      // We're scrolling up, and inside the header.
      // We transition to pin regardless of upTolerance
    };
  } else if (scrollDirection === 'up' && currentScrollY <= state.height && ['pinned', 'unfixed'].indexOf(state.state) < 0) {
    return {
      action: 'pin',
      scrollDirection: scrollDirection,
      distanceScrolled: distanceScrolled
    };
  } else {
    return {
      action: 'none',
      scrollDirection: scrollDirection,
      distanceScrolled: distanceScrolled
    };
  }
};