import 'document-register-element'
import shortid from 'shortid'
import './index.css'


const targetName = `simpleMenu`
const elName = `site-navigation`

function getElements(navigator)
{
  return {
    branding: navigator.querySelector(`${targetName}__branding`),
    menu: navigator.querySelector(`.simpleMenu`),
    search: navigator.querySelector(`${targetName}__search`),
  }
}


function toggleMenu(el)
{
  el.hidden = !el.hidden;

  // Create CustomEvent to fire later.
  let menuState = new CustomEvent(`menu-state`, { "bubbles": true, "cancelable": true,})

  // Fire CustomEvent to let everyone know we changed state.
  el.dispatchEvent(menuState)
}


function handleMenuToggle(e)
{
  let menu = e.target
  if (this.getAttribute(`id`) === e.explicitOriginalTarget.getAttribute(`aria-controls`)) {
    toggleMenu(menu)
  }
}

/**
 * This changes the state of the button and fires the
 * `toggle-state` event on it.
 * @param {HTMLElement} el The button we want to toggle.
 */
function toggleButton(el)
{
  // Determine the current state of this button.
  let expanded = el.getAttribute('aria-expanded') === 'true' || false;

  // Swap the aria-expanded attributed to the opposite,
  // since we're changing the state.
  el.setAttribute('aria-expanded', !expanded);

  // Change the text of the button to the other thing.
  el.textContent = expanded ? el.dataset.closed : el.dataset.opened

  // Create CustomEvent to fire later.
  let toggleState = new CustomEvent(`toggle-state`, { "bubbles": true, "cancelable": true,})

  // Fire CustomEvent to let everyone know we changed state.
  el.dispatchEvent(toggleState)
}

/**
 * Handles changes to the button when it's toggled.
 * @param {HTMLElement} el The button being toggled.
 * @param {Object} settings Any settings for this button.
 */
function handleButtonToggle(e)
{
  // Set el.
  let el = e.target

  // Toggle button state.
  toggleButton(el)

  // Fire the event on the menu we want to toggle and swap
  // the menu's state.
  // We're doing both in here because we want menu state to be
  // inextricably tied to button state.
  let menuToggled = new CustomEvent(`menu-toggled`, { "bubbles": true, "cancelable": true, })
  let menu = document.getElementById(el.getAttribute(`aria-controls`))
  menu.dispatchEvent(menuToggled)
}

function setupMenu(navigation)
{
  if (navigation === null) {
    return
  }

  let menuEl = navigation.menu
  let items = menuEl.querySelectorAll(`li`)
  let links = menuEl.querySelectorAll(`li > a`)
  let submenus = menuEl.querySelectorAll(`li > ul`)
  let toggles = menuEl.querySelectorAll(`button[toggle]`)
  let menus = menuEl.querySelectorAll(`nav ul`)
  let topmenu = menuEl.querySelectorAll(`nav > ul`)

  // Initial parse for menus (all of them).
  menus.forEach(el => {
    el.classList.add(`${elName}__menu`)
    el.setAttribute(`nav-element`, `menu`)
    el.setAttribute(`hidden`, ``)
    el.setAttribute(`id`, el.getAttribute(`id`) || shortid.generate())

    // Listen for this menu being toggled.
    el.addEventListener(`menu-toggled`, handleMenuToggle)
  })

  // Initial parse for top menu.
  topmenu.forEach(el => {el.classList.add(`${elName}__menuTopmenu`)})

  // Initial parse for submenus.
  submenus.forEach(el => {
    el.classList.add(`${elName}__menuSubmenu`)
    el.setAttribute(`nav-element`, `submenu`)
  })

  // Initial parse for items.
  items.forEach(el => {
    el.setAttribute(`nav-element`, `item`)
    el.classList.add(`${elName}__menuItem`)
    if (el.querySelector(`ul`)) {
      el.setAttribute(`nav-parent`, `submenu`)
      el.classList.add(`${elName}__parent`)
    }
  })

  // Initial parse for links.
  links.forEach(el => {
    el.setAttribute(`nav-element`, `link`)
    el.classList.add(`${elName}__menuLink`)
  })

  // Initial parse for toggles.
  toggles.forEach(el => {
    el.setAttribute(`nav-element`, `toggle`)
    el.classList.add(`${elName}__menuToggle`)

    // Add an aria-controls attribute to the toggle button.
    let menu = el.nextElementSibling;
    if (menu) {
      el.setAttribute(`aria-controls`, menu.getAttribute(`id`))
    }

    // Store opened/closed glyph info on the element.
    el.dataset.opened = el.getAttribute(`opened`) || `Close`
    el.dataset.closed = el.getAttribute(`closed`) || `Open`
    // ...then clean up the HTML
    el.removeAttribute('opened')
    el.removeAttribute('closed')

    // Should always start closed.
    el.textContent = el.dataset.closed

    // Create CustomEvent to fire later.
    let toggleClicked = new CustomEvent(`toggle-clicked`, { "bubbles": true, "cancelable": true,})
    el.addEventListener(`toggle-clicked`, handleButtonToggle)

    // Set up a click listener.
    el.addEventListener(`click`, button => el.dispatchEvent(toggleClicked))
  })

  return {
    items: items,
    links: links,
    submenus: submenus,
    topmenu: topmenu,
  }
}

const MyElement = document.registerElement(
  'site-navigation',
  {
    prototype: Object.create(
      HTMLElement.prototype, {
      createdCallback: {value: function() {
        console.log('here I am ^_^ ');
        let navigation = getElements(this)
        let menu = setupMenu(navigation);
        console.log('with content: ', menu);
      }},
      attachedCallback: {value: function() {
        console.log('live on DOM ;-) ');
      }},
      detachedCallback: {value: function() {
        console.log('leaving the DOM :-( )');
      }},
      attributeChangedCallback: {value: function(
        name, previousValue, value
      ) {
        if (previousValue == null) {
          console.log(
            'got a new attribute ', name,
            ' with value ', value
          );
        } else if (value == null) {
          console.log(
            'somebody removed ', name,
            ' its value was ', previousValue
          );
        } else {
          console.log(
            name,
            ' changed from ', previousValue,
            ' to ', value
          );
        }
      }}
    })
  }
);
