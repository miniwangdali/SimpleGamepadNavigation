# Simple Gamepad Navigation (Userscript)

Navigate (almost) any accessible website with a controller.

This userscript injects the Simple Gamepad Navigation engine into every page you visit (`*://*/*`). Once installed in Tampermonkey (or another compatible userscript manager) you can move focus, scroll, activate links & buttons, open context menus, and perform basic keyboard actions using your controller.

> [!IMPORTANT]  
> Only support Xbox style controllers for now.

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

## Library

This userscript uses the [simple-gamepad-navigation](../simple-gamepad-navigation/README.md) library under the hood. See that package for more details.

## License

MIT (see root repository license)

## Disclaimer

Experimental. Behavior may change. Some sites may conflict with synthesized events. Use at your own discretion.

Enjoy browsing with your controller.
