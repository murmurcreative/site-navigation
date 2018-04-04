import 'document-register-element'
import 'custom-event-polyfill'
import shortid from 'shortid'
import './index.css'


const elName = `site-navigation`;

/**
 * Polyfill `forEach` on NodeLists for browsers that don't support it.
 */

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

function getElements(navigator) {
  return {
    branding: navigator.querySelector(`[data-branding]`) || navigator.querySelector(`.branding`),
    menu: navigator.querySelector(`[data-menu]`) || navigator.querySelector(`.menu`),
    search: navigator.querySelector(`[data-search]`) || navigator.querySelector(`.search`),
  }
}


function toggleMenu(el) {
  el.hidden = !el.hidden;

  // Create CustomEvent to fire later.
  let menuState = new CustomEvent(`menu-state`, {
    "bubbles": true, "cancelable": true, "detail": {
      el: el,
      state: el.hidden ? `closed` : `opened`,
    },
  });

  // Fire CustomEvent to let everyone know we changed state.
  el.dispatchEvent(menuState)
}


function handleMenuToggle(e) {
  let menu = e.target;
  if (this.getAttribute(`id`) === e.detail.menuid) {
    toggleMenu(menu)
  }
}

/**
 * This changes the state of the button and fires the
 * `toggle-state` event on it.
 * @param {HTMLElement} el The button we want to toggle.
 */
function toggleButton(el) {
  // Determine the current state of this button.
  let expanded = el.getAttribute(`aria-expanded`) === `true` || false;

  // Swap the aria-expanded attributed to the opposite,
  // since we're changing the state.
  el.setAttribute(`aria-expanded`, !expanded);

  // Change the text of the button to the other thing.
  if (el.dataset.opened && el.dataset.closed) {
    el.textContent = expanded ? el.dataset.closed : el.dataset.opened;
  }

  // Create CustomEvent to fire later.
  let toggleState = new CustomEvent(`toggle-state`, {
    "bubbles": true, "cancelable": true, "detail": {
      el: el,
      state: expanded ? `closed` : `opened`,
    },
  });

  // Fire CustomEvent to let everyone know we changed state.
  el.dispatchEvent(toggleState)
}

/**
 * Handles changes to the button when it's toggled.
 * @param e
 */
function handleButtonToggle(e) {
  // Set el.
  let el = e.target;
  let menuid = e.detail.menuid;

  // Toggle button state.
  toggleButton(el);

  // Fire the event on the menu we want to toggle and swap
  // the menu's state.
  // We're doing both in here because we want menu state to be
  // inextricably tied to button state.
  let menuToggled = new CustomEvent(`menu-toggled`, {
    "bubbles": true,
    "cancelable": true,
    "detail": {"menuid": menuid},
  });
  let menu = document.getElementById(el.getAttribute(`aria-controls`));
  menu.dispatchEvent(menuToggled)
}

function setupMenu(navigation) {
  if (navigation === null) {
    return
  }

  let menuEl = navigation.menu;
  let toggleOpened = menuEl.dataset.opened || false;
  let toggleClosed = menuEl.dataset.closed || false;

  let items = menuEl.querySelectorAll(`li`);
  let links = menuEl.querySelectorAll(`li > a`);
  let submenus = menuEl.querySelectorAll(`li > ul`);
  let toggles = menuEl.querySelectorAll(`[data-toggle]`);
  let menus = menuEl.querySelectorAll(`nav ul`);
  let topmenu = menuEl.querySelectorAll(`nav > ul`);

  // Initial parse for menus (all of them).
  menus.forEach(el => {
    el.classList.add(`${elName}__menu`);
    el.setAttribute(`hidden`, ``);
    el.setAttribute(`id`, el.getAttribute(`id`) || shortid.generate());

    // Listen for this menu being toggled.
    el.addEventListener(`menu-toggled`, handleMenuToggle)
  });

  // Initial parse for top menu.
  topmenu.forEach(el => {
    el.classList.add(`${elName}__menuTopmenu`)
  });

  // Initial parse for submenus.
  submenus.forEach(el => {
    el.classList.add(`${elName}__menuSubmenu`)
  });

  // Initial parse for items.
  items.forEach(el => {
    el.classList.add(`${elName}__menuItem`);
    if (el.querySelector(`ul`)) {
      el.classList.add(`${elName}__parent`)
    }
  });

  // Initial parse for links.
  links.forEach(el => {
    el.classList.add(`${elName}__menuLink`)
  });

  // Initial parse for toggles.
  toggles.forEach(el => {
    el.classList.add(`${elName}__menuToggle`);

    // Add an aria-controls attribute to the toggle button.
    let menu = el.nextElementSibling;
    if (menu) {
      el.setAttribute(`aria-controls`, menu.getAttribute(`id`))
    }

    // Store opened/closed glyph info on the element.
    if ((el.dataset.opened && el.dataset.closed) || (toggleOpened && toggleClosed)) {
      el.dataset.opened = el.dataset.opened || toggleOpened;
      el.dataset.closed = el.dataset.closed || toggleClosed;

      // Should always start closed.
      el.textContent = el.dataset.closed;
    }


    el.toggleMenuButton = function () {
      el.dispatchEvent(new CustomEvent(`toggle-clicked`, {
        "bubbles": true,
        "cancelable": true,
        "detail": {"menuid": this.getAttribute(`aria-controls`)},
      }));
    };

    // Set up a click listener.
    el.addEventListener(`toggle-clicked`, handleButtonToggle);
    el.addEventListener(`click`, button => button.target.toggleMenuButton())

  });

  return {
    items: items,
    links: links,
    submenus: submenus,
    topmenu: topmenu,
  }
}

const SiteNavigation = document.registerElement(
  `site-navigation`,
  {
    prototype: Object.create(
      HTMLElement.prototype, {
        createdCallback: {
          value: function () {
            setupMenu(getElements(this));
          },
        },
        attachedCallback: {
          value: function () {
            // Prevent events from leaking out into the wider DOM.
            [`toggle-clicked`, `menu-toggled`, `toggle-state`, `menu-state`]
              .map(event => this.addEventListener(event, e => e.cancelBubble = true))
          },
        },
        detachedCallback: {
          value: function () {
          },
        },
        attributeChangedCallback: {
          value: function (name, previousValue, value) {
            if (previousValue == null) {
              console.log(
                `got a new attribute `, name,
                ` with value `, value
              );
            } else if (value == null) {
              console.log(
                `somebody removed `, name,
                ` its value was `, previousValue
              );
            } else {
              console.log(
                name,
                ` changed from `, previousValue,
                ` to `, value
              );
            }
          },
        },
      }),
  }
);
