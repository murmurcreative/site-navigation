import 'document-register-element'
import 'custom-event-polyfill'
import './index.css'

/**
 * Polfill `Element.matches`.
 */
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector;
}

/**
 * A function that allows us to set defaults without having to polyfill
 * *actual* function defaults in browsers that don't support them.
 * @param {object} args
 * @param {object} defaults
 * @returns {object}
 */
function getArgsWithDefaults(args, defaults) {
  return Object.assign(
    defaults,
    typeof args === `object` ? args : {}
  );
}

/**
 * Returns the nearest sibling to the passed element.
 *
 * In some browsers, this will be an empty text node, so passing selectors is
 * recommended.
 *
 * @param {HTMLElement} el - The current element
 * @param {object} [options]
 */
function getSibling(el, options) {
  const parsedOptions = getArgsWithDefaults(options, {
      direction: `previous`,
      selector: null,
    });

  let sibling = null;

  if (parsedOptions.direction === `previous`) {
    sibling = el.previousElementSibling;
  } else if (parsedOptions.direction === `next`) {
    sibling = el.nextElementSibling;
  }

  if (parsedOptions.selector !== null) {
    if (!sibling.matches(parsedOptions.selector)) {
      return getSibling(sibling);
    }
  }

  return sibling;
}

/**
 * Get all of the toggles to manipulate in this navigator.
 * @param {HTMLElement} navigation
 */
function getToggleElements(navigation) {
  return navigation.querySelectorAll(`[data-toggle]`);
}

/**
 * Get the toggle for a given drawer.
 * @param {HTMLElement} drawer
 */
function getDrawerToggle(drawer) {
  return getSibling(drawer, { direction: `previous`, selector:`[data-toggle]` });
}

/**
 * Get the drawer for a given toggle.
 * @param {HTMLElement} toggle
 */
function getToggleDrawer(toggle) {
  return getSibling(toggle, { direction: `next`, selector: `[data-drawer], ul` });
}

/**
 * Fire the event that tells us a drawer should change state.
 */
function doDispatchDrawerStateEvent(drawer, open, bubbles) {
  drawer.dispatchEvent(new CustomEvent(`drawer-state-change`, {
    "bubbles": bubbles, "cancelable": true, "detail": {
      el: drawer,
      action: open ? `open` : `close`,
    },
  }));
}

/**
 * Adjust the visibility property for this drawer.
 *
 * @param {HTMLElement} drawer The drawer to take this action on.
 * @param {boolean} open Open this drawer (true) or close it (false).
 */
function doSetDrawerVisibility(drawer, open) {
  open ? drawer.removeAttribute(`hidden`) : drawer.setAttribute(`hidden`, ``);
}

/**
 * This function fires off several others that do the actual work of
 * changing the state of a drawer (as well as the toggle). All actions
 * taken by this function should be functional in the sense that they
 * do not depend on the state of the objects they're targeting. (The
 * exception to this is `doSetToggleState()` which must query the DOM
 * to determine the correct toggle button).
 *
 * @param {HTMLElement} drawer The drawer to take this action on.
 * @param {boolean} open Open this drawer (true) or close it (false).
 * @param bubbles
 */
function doSetDrawerState(drawer, open, bubbles) {
  console.log(bubbles);
  doDispatchDrawerStateEvent(drawer, open, bubbles);
  doSetDrawerVisibility(drawer, open);
  doSetToggleState(getDrawerToggle(drawer), open);
}

/**
 * Change the toggle state of a button.
 * @param {HTMLElement} toggle - The button we want to affect
 * @param {boolean} open - Whether or not this button is pressed
 */
function doSetToggleState(toggle, open) {
  toggle.setAttribute(`aria-expanded`, String(open));
}

/**
 * Reset the `aria-expanded` attribute based on the drawer
 * associated w/ this toggle. Useful if the toggle may have
 * gotten out of sync.
 * @param {HTMLElement} toggle
 */
function doResetToggleState(toggle) {
  toggle.setAttribute(`aria-expanded`, String(!getToggleDrawer(toggle).hasAttribute(`hidden`)));
}

/**
 * Bind an event listener to toggle button to fire when it is clicked.
 * @param {HTMLElement} toggle
 */
function doListenForToggleClick(toggle) {
  toggle.addEventListener(`click`, () => getToggleDrawer(toggle).toggleDrawer());
}

/**
 * Binds the function used to change drawer state to the
 * drawer element itself, so that it can be triggered later.
 * @param {HTMLElement} drawer
 */
function doBindStateChangeToDrawer(drawer) {
  drawer.openDrawer = () => doSetDrawerState(drawer, true, true);
  drawer.closeDrawer = () => doSetDrawerState(drawer, false, true);
  drawer.toggleDrawer = () => doSetDrawerState(drawer, drawer.hasAttribute(`hidden`), true);
  drawer.openDrawerSilently = () => doSetDrawerState(drawer, true, false);
  drawer.closeDrawerSilently = () => doSetDrawerState(drawer, false, false);
  drawer.toggleDrawerSilently = () => doSetDrawerState(drawer, drawer.hasAttribute(`hidden`), false);
}

/**
 * Apply a bunch of classes to parts of the navigation.
 *
 * These classes aren't needed for the operation of the element;
 * they're here to make it a little easier to style.
 *
 * @param {HTMLElement} navigation
 */
function doApplyNavigationClasses(navigation) {
  /** Allow users to set the root class used by all classes. */
  const elName = navigation.getAttribute(`data-class`) || `site-navigation`;

  navigation.classList.add(`${elName}`);

  Array.prototype.forEach.call(getToggleElements(navigation), (toggle) => {
    const drawer = getToggleDrawer(toggle);
    toggle.classList.add(`${elName}__toggle`);
    drawer.classList.add(`${elName}__drawer`);
    Array.prototype.forEach.call(drawer.querySelectorAll(`li`), (item) => {
      item.classList.add(`${elName}__item`);
      if (item.querySelector(`ul`)) {
        item.classList.add(`${elName}__parent`);
      }
    });
  });
}

/**
 * Gets this party started 🎶💃
 * @param {HTMLElement} navigation
 */
function doNavigationSetup(navigation) {
  Array.prototype.forEach.call(getToggleElements(navigation), (toggle) => {
    doBindStateChangeToDrawer(getToggleDrawer(toggle));

    doResetToggleState(toggle);

    doListenForToggleClick(toggle);
  });
}

class SiteNavigation extends HTMLElement {
  constructor(self) {
    /**
     * Using `self` rather than `this` here is because of disappointing support for CustomElements V1
     * @link https://github.com/WebReflection/document-register-element#v1-caveat
     */
    self = super(self);
    doNavigationSetup(self);
    return self;
  }

  connectedCallback() {
    doApplyNavigationClasses(this);
    // Prevent events from leaking out into the wider DOM.
    [`drawer-state-change`]
      .map(event => this.addEventListener(event, e => e.cancelBubble = true))
  }
}

customElements.define(
  `site-navigation`,
  SiteNavigation
);
