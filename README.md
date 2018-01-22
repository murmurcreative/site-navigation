# 🗺️ Site Navigation

An HTML Custom Element to make site nav a bit easier.

## Usage

To use 🗺️ site-navigation, [include custom element]. When used, it will look at
the content you put inside it to build a menu. An example might look this this:

```html
<site-navigation>
  <div data-branding>
    <a href="/">
      <img src="/images/logo.svg">
    </a>
  </div>
  <nav data-menu>
    <button data-toggle>Open</button>
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
  </nav>
  <form data-search>
    <input type="search">
    <button type="submit">Search</button>
  </form>
</site-navigation>
```

Each section (branding, menu, search) has some rules for how it should must be
formatted in order for 🗺️ site-navigation to pick up on it correctly.

### Branding
The top-level element of this section must have either the attribute
`data-branding` or the class `branding`. `data-branding` is preferred.

### Menu
The top-level element of this section must have either the attribute
`data-menu` or the class `menu`. `data-menu` is preferred. The use of a `nav`
as this top-level element is recommended.

Menus must be `<ul>`s containing `<li>`. Nested menus follow the same
convention. Each `<ul>` must be _immediately_ preceeded by a `<button>` with the
attribute `data-toggle`. Any other content for the list item should come before
the button.

#### Nested Menu Examples
```html
...
<li>
  <a href="/contact">Contact Us</a>
  <button data-toggle>Open</button>
  <ul>...</ul>
</li>
...
```
*👍 Good*


```html
...
<li>
  <button data-toggle>Open</button>
  <a href="/contact">Contact Us</a>
  <ul>...</ul>
</li>
...
```
*👎 Bad*

The `<button>` does not _immediately_ preceed the nested `<ul>`.

```html
...
<li>
  <a href="/contact">Contact Us</a>
  <ul>...</ul>
</li>
...
```
*👎 Bad*

There is no `<button>` for the nested `<ul>`.

You can specify the text that will be used for the buttons when on/off by
adding the attributes `data-opened` or `data-closed`. You can add these to
individual buttons, or to the top-level menu element (the element with
`data-menu` or `class=".menu"` on it). If added to the top-level menu element,
it will apply to all buttons. If added to an individual button, it will apply
only to that button (and override a menu-level setting).

> *Note*: You don't _have_ to include text in the buttons when you initially
> define them, since the text will be replaced as soon as the 🗺️ site-navigation
> is added as a custom element, but adding the text is encourage, so that your
> site will still have descriptive HTML.

#### Toggle Button Text Examples

```html
<nav data-opened="X" data-closed="=">
  ...
  <button data-toggle></button>
  ...
</nav>
```

This button will show `X` when the menu is open, and `=` when it is closed.

```html
<nav data-opened="X" data-closed="=">
  ...
  <button data-toggle></button>
  ...
  <button data-toggle data-opened="Close"></button>
</nav>
```

The first button with behave like the button in the last example. The second
will show `Close` when the menu is open, and `=` when it is closed.

### Search

The top-level element of this section must have either the attribute
`data-search` or the class `search`. `data-search` is preferred.

## Events

🗺️ site-navigation makes use of Custom Events in JavaScript to handle toggling
buttons and opening/closing menus, etc. All of these events bubble up to the
top 🗺️ site-navigation level, but no further. You can add event listeners to
your 🗺️ site-navigation element to react to these events.
