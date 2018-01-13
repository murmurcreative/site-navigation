import 'document-register-element'
import { el, mount, text } from 'redom'
import './index.css'

const targetName = `simpleMenu`
const elName = `site-navigation`

class Toggle {
  constructor () {
    let attrs = {}
    attrs[`aria-expanded`] = `false`

    this.el = el(`button.${elName}__menuToggle`, `toggle`, attrs)
    this.el.onclick = click => {
      click.target.setAttribute(`aria-expanded`, `true`)
    }
  }
}

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
  let topmenu = menu.querySelectorAll(`nav > ul`)

  items.forEach(item => {
    item.classList.add(`${elName}__menuItem`)
    if (item.querySelector(`ul`)) {
      item.classList.add(`${elName}__menuItem--parent`)
      mount(item, new Toggle())
    }
  })
  links.forEach(el => {el.classList.add(`${elName}__menuLink`)})
  submenus.forEach(el => {
    el.classList.add(`${elName}__menuSubmenu`)
  })
  topmenu.forEach(el => {el.classList.add(`${elName}__menuTopmenu`)})

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
