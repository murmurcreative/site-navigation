# 🗺️ Site Navigation

An HTML Custom Element to make site nav a bit easier.

## Installation

Currently this package is intended to be added to your project with npm/yarn,
and included in your project, likely through webpack. There are other ways you
could include it (running webpack on this repo to generate files in `/dist`,
for instance), but the following is the recommended process (i.e. the one I've
tested):

```bash
$ yarn add https://github.com/alwaysblank/site-navigation.git
```

```javascript
// main.js, or a script that will be run on all pages
import 'site-navigation';
```

If you're using webpack, you'll need to make sure that your loaders for `js`
and `css` aren't ignoring the `site-navigation` directory (often webpack
configuration will ignore `node_modules`, which will prevent `site-navigation`
from getting picked up.) As an example, in the default `webpack.config.js` for
[roots' Sage](https://github.com/roots/sage), make the following changes:

```javascript
// resources/assets/build/webpack.config.js
test: /\.js$/,
exclude: [/node_modules(?![/|\\](bootstrap|foundation-sites))/],

//...to this:

test: /\.css$/,
exclude: [/node_modules(?![/|\\](bootstrap|foundation-sites|site-navigation))/],
```

## Usage

When used, **site-navigation** will look at the content you put inside it to
build a menu. An example might look this this:

```html
<site-navigation>
  <nav>    
    <button data-toggle>Open</button>
    <div data-drawer>
      <ul>
        <li>
          <a href="/home/">Home</a>
        </li>
        <li>
          <a href="/page-1/">Page One</a>
        </li>
        <li>
          <a href="/page-2/">Page Two</a>
          <button data-toggle>Open</button>
          <ul>
            <li>
              <a href="/page-2/page-3/">Page Three</a>
              <button data-toggle>Open</button>
              <ul>
                <li>
                  <a href="/page-2/page-3/page-4/">Page Four</a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</site-navigation>
```

> **Note:** The above reflects a recommended layout: a `<nav>` nested in the master
> `<site-navigation>` element, with `<div>`s as top-level Drawer(s) and `<ul>`s as nested
> Drawers. This is the easiest to understand, and the most accessible. **site-navigation**
> is flexible enough to support many different layouts, however, so long as you follow
> the rules below.

### Drawers

A Drawer is a section of content that will be hidden and shown when its associated Toggle
is clicked. A Drawer can contain whatever you want it to (even other Drawers!) but it will
usually contain a list of navigational links. The rules for setting up a Drawer are as follows:

1. Your Drawer can be any block-level element, but it must meet at least one of the following 
criteria:
   1. Have the attribute `data-drawer`
   2. Directly follow a Toggle
2. Your Drawer must be *directly preceeded* by a Toggle.

Drawers represent the single source of truth about their state: Toggles take their state
from their associated Drawers. This means that if you want to determine or set the state of
a Drawer programmatically, you should do so through the Drawer itself, not a Toggle.
**site-navigation** only recognizes Drawers and Toggles in pairs: If you have only one, it
will simple ignore that element.

#### Opening/Closing Drawers Programatically

There are three functions attached to each Drawer which **site-navigation** uses internally
to handle opening and closing Drawers:

- `toggleDrawer()` - Switches the state of the Drawer.
- `openDrawer()` - Opens the Drawer. Has no effect if the Drawer is already open.
- `closeDrawer()` - Closes the Drawer. Has no effect if the Drawer is already closed.

##### Example

```js
// Let's assume you have a Drawer with the ID `location-list`, which is currently closed.

document.getElementByID(`location-list`).toggleDrawer();
// The Drawer is now open.

document.getElementByID(`location-list`).openDrawer();
// The state of the Drawer has not changed.

document.getElementByID(`location-list`).closeDrawer();
// The Drawer is now closed.
```

### Toggles

Toggles are the buttons used to open and close Drawers. They must obey the following rules:

1. Have the attribute `data-toggle`
2. Directly preceed a Drawer
3. Be a `<button>`

> **Note:** Technically, a toggle can be any element which will dispatch the `click` event
> when clicked, but in practice and for accessibility reasons they should almost always be
> `<button>`s.

#### Examples
```html
...
<li>
  <a href="/contact">Contact Us</a>
  <button data-toggle>Open</button>
  <ul>...</ul>
</li>
...
```
**👍 Good**


```html
...
<li>
  <button data-toggle>Open</button>
  <a href="/contact">Contact Us</a>
  <ul>...</ul>
</li>
...
```
**👎 Bad**

The `<button>` does not _immediately_ preceed the `<ul>`.

```html
...
<li>
  <a href="/contact">Contact Us</a>
  <ul>...</ul>
</li>
...
```
**👎 Bad**

There is no `<button>` for the `<ul>`.

## Events

Drawers dispatch events when their state should change, which all other parts of
**site-navigation** hook into to do their thing. These events bubble up all the way to the
`<site-navigation>` root element, but stop there (to avoid polluting the wider DOM). You can
listen on the root element or to individual Drawers for the `drawer-state-change` event.
The `detail` property on the event includes the element that displatched the event (`el`)
and the state to which the Drawer is being set (`action`).
