import 'document-register-element'
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

function parseMenu(menu)
{
  if (menu === null) {
    return
  }

  let items = menu.querySelectorAll(`li`)
  let links = menu.querySelectorAll(`li > a`)
  let submenus = menu.querySelectorAll(`li > ul`)
  let toggles = menu.querySelectorAll(`button[toggle]`)
  let menus = menu.querySelectorAll(`nav ul`)
  let topmenu = menu.querySelectorAll(`nav > ul`)

  // Initial parse for items.
  items.forEach(item => {
    item.classList.add(`${elName}__menuItem`)
    if (item.querySelector(`ul`)) {
      item.classList.add(`${elName}__menuItem--parent`)
    }
  })

  // Initial parse for links.
  links.forEach(el => {el.classList.add(`${elName}__menuLink`)})

  // Initial parse for submenus.
  submenus.forEach(el => {
    el.classList.add(`${elName}__menuSubmenu`)
  })

  // Initial parse for menus (all of them).
  menus.forEach(el => {
    el.classList.add(`${elName}__menu`)
    el.setAttribute(`hidden`, ``)
  })

  // Initial parse for top menu.
  topmenu.forEach(el => {el.classList.add(`${elName}__menuTopmenu`)})

  // Initial parse for toggles.
  toggles.forEach(el => el.addEventListener(`click`, function() {
    let expanded = this.getAttribute('aria-expanded') === 'true' || false;
    this.setAttribute('aria-expanded', !expanded);
    let menu = this.nextElementSibling;
    menu.hidden = !menu.hidden;
  }))
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
        this.open = this.getAttribute(`open`)
        console.log('here I am ^_^ ');
        console.log(this.open)
        let parsed = parseMenu(getElements(this).menu);
        console.log('with content: ', parsed);
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
