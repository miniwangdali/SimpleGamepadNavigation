# Simple Gamepad Navigation

A small monorepo that contains a lightweight gamepad navigation library and a companion userscript build. It provides predictable focus/navigation behavior for gamepads (D-pad/joystick) on web apps and a small example script target.

## Packages

- [`packages/simple-gamepad-navigation`](./packages/simple-gamepad-navigation) — the core library that allows users to navigate any web page using a controller.
- [`packages/monkey-script`](./packages/monkey-script) — a monkey userscript that bundles the library for use in browser userscript managers (Tampermonkey/Greasemonkey) or for local development.
