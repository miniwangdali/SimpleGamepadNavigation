# Simple Gamepad Navigation

This is a helper library that allows users navigate and interact with standard web pages using a gamepad. The goal is to make any web page gamepad navigable without the website using any special component for gamepad navigation.
Any website can use this library to enable gamepad navigation for their users with a single line of code.
This will require the website to have great accessibility and normal component layout structures.
This library definitely has a lot of limitations, so use it at your own risk.

> [!IMPORTANT]  
> Only support Xbox style controllers for now.

## Installation

```sh
npm install simple-gamepad-navigation
```

## Quick Start

```ts
import { initializeGamepadNavigation } from 'simple-gamepad-navigation';

initializeGamepadNavigation();
```

## What Counts as “Interactable”

Native or ARIA:

- `button`, links (`a`), inputs (`input`, `textarea`, contenteditable)
- Elements with roles: `button`, `link`, `checkbox`, `radio`, `slider`, `textbox`, `searchbox`, `combobox`, `spinbutton`

## Directional Focus Algorithm

Given the currently focused element and a direction (Up/Down/Left/Right), the library:

1. Gets bounding rect of the source.
2. Iterates all interactables.
3. Filters to those lying in the requested directional half‑space.
4. Picks the nearest by Euclidean distance between mid-edge points.

## Button / Axis Mapping (Xbox standard)

| Control                 | Behavior                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------- |
| Left Stick / D‑Pad      | Focus navigation; Increase/Decrease value in slider once entered.                  |
| Right Stick             | Scroll in container of the current focused element. (X → horizontal, Y → vertical) |
| A                       | Dispatch <kbd>Enter</kbd>; Clicks links; Enter slider adjustment;                  |
| B                       | Dispatch <kbd>Escape</kbd>; Exit slider adjustment;                                |
| Left Trigger            | Dispatch <kbd>Shift</kbd>                                                          |
| Right Trigger           | Dispatch <kbd>Control</kbd>                                                        |
| Menu (≡)                | synthesized right‑click                                                            |
| View + Left Trigger     | Attempts to close the current window                                               |
| Bumpers                 | Move to previous/next tab                                                          |
| Bumpers + Right Trigger | Navigate back/forward in history                                                   |

## API

### initializeGamepadNavigation()

Sets up listeners & polling loop. It's safe to call multiple times.

## Contributing

You will need Tampermonkey extension to test the userscript.

1. Fork & clone the repository.
2. Install deps at root (workspace):
    ```sh
    npm install
    ```
3. Run dev at root. This will install a dev userscript in Tampermonkey:
    ```sh
    npm run dev
    ```
4. Build:
    ```sh
    npm run build
    ```
5. Lint / test: (No formal test suite yet—PRs adding one welcome.)
6. Open a PR with a clear description & rationale.

## License

MIT © 2025 miniwangdali
