export default function (
  lastKnownScrollY = 0,
  currentScrollY = 0,
  props = {},
  state = {},
  scrollerHeight = 0,
  scrollerPhysicalHeight = 0,
) {
  const scrollDirection = currentScrollY >= lastKnownScrollY ? 'down' : 'up'
  const distanceScrolled = Math.abs(currentScrollY - lastKnownScrollY)

  // We're disabled
  if (props.disable) {
    return {
      action: 'none',
      scrollDirection,
      distanceScrolled,
    }
  } else if (props.isFooter && currentScrollY <= props.pinStart && state.state !== 'pinned') {
    // We're a footer and at the top so should be pinned
    return {
      action: 'pin',
      scrollDirection,
      distanceScrolled,
    }
    // We're at the top and not fixed yet.
  } else if (!props.isFooter && currentScrollY <= props.pinStart && state.state !== 'unfixed') {
    return {
      action: 'unfix',
      scrollDirection,
      distanceScrolled,
    }
  // We're unfixed and headed down. Carry on.
  } else if (
    currentScrollY <= state.height &&
    scrollDirection === 'down' &&
    state.state === 'unfixed'
  ) {
    return {
      action: 'none',
      scrollDirection,
      distanceScrolled,
    }
  } else if (
    currentScrollY > (state.height + props.pinStart) &&
    scrollDirection === 'down' &&
    state.state === 'unfixed'
  ) {
    return {
      action: 'unpin-snap',
      scrollDirection,
      distanceScrolled,
    }
  // We're past the header and scrolling down.
  // We transition to "unpinned" if necessary.
  } else if (
    scrollDirection === 'down' &&
    ['pinned', 'unfixed'].indexOf(state.state) >= 0 &&
    currentScrollY > (state.height + props.pinStart) && distanceScrolled > props.downTolerance &&
    // Don't unpin if we are a footer and at the bottom
    (!props.isFooter || currentScrollY + scrollerPhysicalHeight < scrollerHeight - state.height)
  ) {
    return {
      action: 'unpin',
      scrollDirection,
      distanceScrolled,
    }
    // We're a footer and have reached the bottom
  } else if (
    props.isFooter &&
    currentScrollY + scrollerPhysicalHeight >= scrollerHeight - state.height &&
    state.state !== 'pinned'
  ) {
    return {
      action: 'pin',
      scrollDirection,
      distanceScrolled,
    }
  // We're scrolling up, we transition to "pinned"
  } else if (
    scrollDirection === 'up' &&
    distanceScrolled > props.upTolerance &&
    ['pinned', 'unfixed'].indexOf(state.state) < 0
  ) {
    return {
      action: 'pin',
      scrollDirection,
      distanceScrolled,
    }
  // We're scrolling up, and inside the header.
  // We transition to pin regardless of upTolerance
  } else if (
    scrollDirection === 'up' &&
    currentScrollY <= state.height &&
    ['pinned', 'unfixed'].indexOf(state.state) < 0
  ) {
    return {
      action: 'pin',
      scrollDirection,
      distanceScrolled,
    }
  } else {
    return {
      action: 'none',
      scrollDirection,
      distanceScrolled,
    }
  }
}
