# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `drawer-state-change` Event, which triggers all actual state changes.
- `openDrawer()`, `closeDrawer()` and `toggleDrawer()` functions attached to Drawer elements
  for manipulating them programmatically.
- Greated increased flexibility re: what can go in **site-navigation**, and specifically in a Drawer.

### Changed

- Re-written from the ground up.
- Refactored "menu" language to "drawer" to make it appear less opinionated about content.
- Drawers are now identified by their association w/ Toggles: Not by parse for them directly.
- Drawers are the single source of truth on their state: Toggles take their state from their
  associated Drawer in all cases.
- Updated README.md to reflect all these changes.

### Removed

- All CSS styling except for `[hidden]` "polyfill".
- `Nodelist.forEach()` Polyfill.
- Some element classes added on instantiation.
- `toggle-clicked`, `menu-toggled`, `toggle-state`, and `menu-state` Events.
- Dynamically-generated menu IDs (and associated library).
- Branding and search "sub-elements". They had no unique functionality and served only to clutter up the element.
  Elements that serve these purposes can be added to a **site-navigation** element by a user with no ill effects.
- `aria-controls` attributes: [They have very little useful functionality](http://www.heydonworks.com/article/aria-controls-is-poop) and were unnecessary.

## [1.0.0] - 2018-05-21

### Added

- Initial functionality.
