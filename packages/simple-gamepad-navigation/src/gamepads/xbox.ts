import type { IGamepad } from './types';

import { GamepadManager } from '../GamepadManager';
import { NavigationDirection, ScrollDirection } from '../types';
import { isSliderElement } from '../utils/element/slider';
import { getTabListElementOfTarget, getTabItemsOfTabList } from '../utils/element/tab';
import { throttledNavigate } from '../utils/navigation';
import { throttledScroll } from '../utils/scroll';

const LEFT_THUMBSTICK_DEFAULT_THRESHOLD = 0.6;
const RIGHT_THUMBSTICK_DEFAULT_THRESHOLD = 0.4;

export const enum XboxButton {
    A = 0,
    B = 1,
    X = 2,
    Y = 3,
    LeftBumper = 4,
    RightBumper = 5,
    LeftTrigger = 6,
    RightTrigger = 7,
    View = 8,
    Menu = 9,
    LeftThumbStick = 10,
    RightThumbStick = 11,
    DpadUp = 12,
    DpadDown = 13,
    DpadLeft = 14,
    DpadRight = 15,
    Nexus = 16,
}

const buttonKeyMap = {
    [XboxButton.A]: 'Enter',
    [XboxButton.B]: 'Escape',
    [XboxButton.LeftTrigger]: 'Shift',
    [XboxButton.RightTrigger]: 'Control',
    [XboxButton.DpadUp]: 'ArrowUp',
    [XboxButton.DpadDown]: 'ArrowDown',
    [XboxButton.DpadLeft]: 'ArrowLeft',
    [XboxButton.DpadRight]: 'ArrowRight',
};

export class XboxStandardController implements IGamepad {
    private pressedKeys: Set<number> = new Set();
    private workingTabListElement: Element | null = null;
    private workingOnSlider = false;

    private getValidGamepad = (gamepadId: number): Gamepad | null => {
        const gamepads = GamepadManager.getInstance().getGamepads();

        if (!gamepads.has(gamepadId)) {
            return null;
        }

        return gamepads.get(gamepadId)!;
    };

    private checkNavigation = (gamepadId: number) => {
        const gamepad = this.getValidGamepad(gamepadId);

        if (!gamepad) {
            return false;
        }

        const x = gamepad.axes[0];
        const y = gamepad.axes[1];

        const resultState = { result: false };

        if (x > LEFT_THUMBSTICK_DEFAULT_THRESHOLD) {
            throttledNavigate(NavigationDirection.Right, resultState);
        } else if (x < -LEFT_THUMBSTICK_DEFAULT_THRESHOLD) {
            throttledNavigate(NavigationDirection.Left, resultState);
        }

        if (y > RIGHT_THUMBSTICK_DEFAULT_THRESHOLD) {
            throttledNavigate(NavigationDirection.Down, resultState);
        } else if (y < -RIGHT_THUMBSTICK_DEFAULT_THRESHOLD) {
            throttledNavigate(NavigationDirection.Up, resultState);
        }

        const dpadUp = gamepad.buttons[XboxButton.DpadUp];
        const dpadDown = gamepad.buttons[XboxButton.DpadDown];
        const dpadLeft = gamepad.buttons[XboxButton.DpadLeft];
        const dpadRight = gamepad.buttons[XboxButton.DpadRight];

        if (!this.workingOnSlider) {
            if (dpadUp.pressed) {
                throttledNavigate(NavigationDirection.Up, resultState);
            }
            if (dpadDown.pressed) {
                throttledNavigate(NavigationDirection.Down, resultState);
            }
            if (dpadLeft.pressed) {
                throttledNavigate(NavigationDirection.Left, resultState);
            }
            if (dpadRight.pressed) {
                throttledNavigate(NavigationDirection.Right, resultState);
            }
        }

        return resultState.result;
    };

    private checkScrolling = (gamepadId: number) => {
        const gamepad = this.getValidGamepad(gamepadId);

        if (!gamepad) {
            return false;
        }

        const x = gamepad.axes[2];
        const y = gamepad.axes[3];

        const resultState = { result: false, originalPosition: { x: 0, y: 0 } };

        if (x > RIGHT_THUMBSTICK_DEFAULT_THRESHOLD || x < -RIGHT_THUMBSTICK_DEFAULT_THRESHOLD) {
            throttledScroll(ScrollDirection.Horizontal, x, resultState);
        }

        if (y > RIGHT_THUMBSTICK_DEFAULT_THRESHOLD || y < -RIGHT_THUMBSTICK_DEFAULT_THRESHOLD) {
            throttledScroll(ScrollDirection.Vertical, y, resultState);
        }

        return resultState.result;
    };

    private checkButtonKeyEvent = (buttonIndex: keyof typeof buttonKeyMap, gamepad: Gamepad) => {
        const button = gamepad.buttons[buttonIndex];

        if (button.pressed) {
            const hasPressedKey = this.pressedKeys.has(buttonIndex);

            if (!hasPressedKey) {
                this.pressedKeys.add(buttonIndex);
            }

            const eventTarget = document.activeElement || document.body;
            if (!hasPressedKey) {
                if (eventTarget instanceof HTMLAnchorElement && buttonIndex === XboxButton.A) {
                    eventTarget.click();
                }
            }

            const enterKeyDownEvent = new KeyboardEvent('keydown', { key: buttonKeyMap[buttonIndex], bubbles: true });
            eventTarget.dispatchEvent(enterKeyDownEvent);
        } else if (this.pressedKeys.has(buttonIndex)) {
            this.pressedKeys.delete(buttonIndex);

            if (buttonIndex === XboxButton.A && isSliderElement(document.activeElement)) {
                this.workingOnSlider = true;
            }
            if (this.workingOnSlider && buttonIndex === XboxButton.B) {
                this.workingOnSlider = false;
            }

            const eventTarget = document.activeElement || document.body;
            const enterKeyUpEvent = new KeyboardEvent('keyup', { key: buttonKeyMap[buttonIndex], bubbles: true });
            eventTarget.dispatchEvent(enterKeyUpEvent);
        }
    };

    private checkMenuButton = (gamepadId: number) => {
        const gamepad = this.getValidGamepad(gamepadId);

        if (!gamepad) {
            return;
        }

        const menuButton = gamepad.buttons[XboxButton.Menu];

        if (menuButton.pressed) {
            if (!this.pressedKeys.has(XboxButton.Menu)) {
                this.pressedKeys.add(XboxButton.Menu);

                const eventTarget = document.activeElement || document.body;
                const eventInit = {
                    bubbles: true,
                    cancelable: true,
                    button: 2,
                    buttons: 2,
                    view: window,
                };

                eventTarget.dispatchEvent(new MouseEvent('mousedown', eventInit));
                eventTarget.dispatchEvent(new MouseEvent('contextmenu', eventInit));
            }
        } else if (this.pressedKeys.has(XboxButton.Menu)) {
            this.pressedKeys.delete(XboxButton.Menu);

            const eventTarget = document.activeElement || document.body;
            const eventInit = {
                bubbles: true,
                cancelable: true,
                button: 2,
                buttons: 0,
                view: window,
            };
            eventTarget.dispatchEvent(new MouseEvent('mouseup', eventInit));
        }
    };

    private checkViewButton = (gamepadId: number) => {
        const gamepad = this.getValidGamepad(gamepadId);

        if (!gamepad) {
            return;
        }

        const viewButton = gamepad.buttons[XboxButton.View];

        if (viewButton.pressed) {
            if (!this.pressedKeys.has(XboxButton.View)) {
                this.pressedKeys.add(XboxButton.View);
            }
        } else if (this.pressedKeys.has(XboxButton.View)) {
            this.pressedKeys.delete(XboxButton.View);

            if (this.pressedKeys.has(XboxButton.LeftTrigger)) {
                window.close();
            }
        }
    };

    private checkButton = (gamepadId: number) => {
        const gamepad = this.getValidGamepad(gamepadId);

        if (!gamepad) {
            return;
        }

        this.checkButtonKeyEvent(XboxButton.A, gamepad);
        this.checkButtonKeyEvent(XboxButton.B, gamepad);
        this.checkButtonKeyEvent(XboxButton.LeftTrigger, gamepad);
        this.checkButtonKeyEvent(XboxButton.RightTrigger, gamepad);

        if (this.workingOnSlider) {
            this.checkButtonKeyEvent(XboxButton.DpadLeft, gamepad);
            this.checkButtonKeyEvent(XboxButton.DpadRight, gamepad);
            this.checkButtonKeyEvent(XboxButton.DpadUp, gamepad);
            this.checkButtonKeyEvent(XboxButton.DpadDown, gamepad);
        }

        this.checkMenuButton(gamepadId);
        this.checkViewButton(gamepadId);
    };

    private checkBumper = (bumper: XboxButton.LeftBumper | XboxButton.RightBumper, gamepad: Gamepad) => {
        const button = gamepad.buttons[bumper];

        if (button.pressed) {
            if (!this.pressedKeys.has(bumper)) {
                this.pressedKeys.add(bumper);
            }
        } else if (this.pressedKeys.has(bumper)) {
            this.pressedKeys.delete(bumper);

            if (this.pressedKeys.has(XboxButton.RightTrigger)) {
                if (bumper === XboxButton.LeftBumper) {
                    history.back();
                } else {
                    history.forward();
                }

                return true;
            }

            const tabList =
                this.workingTabListElement ||
                (document.activeElement ? getTabListElementOfTarget(document.activeElement) : null);

            if (tabList) {
                this.workingTabListElement = tabList;
                const tabItems = getTabItemsOfTabList(tabList);
                const selectedTabIndex = Array.from(tabItems).findIndex(
                    (tab) => tab.getAttribute('aria-selected') === 'true'
                );

                let nextTabItem = 0;
                if (bumper === XboxButton.LeftBumper) {
                    nextTabItem = Math.max(0, selectedTabIndex - 1);
                } else {
                    nextTabItem = Math.min(tabItems.length - 1, selectedTabIndex + 1);
                }

                (tabItems.item(nextTabItem) as HTMLElement).click();
                (tabItems.item(nextTabItem) as HTMLElement).focus();

                return nextTabItem !== selectedTabIndex;
            }
        }

        return false;
    };

    private checkBumpers = (gamepadId: number) => {
        const gamepad = this.getValidGamepad(gamepadId);

        if (!gamepad) {
            return;
        }

        let result = false;

        result ||= this.checkBumper(XboxButton.LeftBumper, gamepad);
        result ||= this.checkBumper(XboxButton.RightBumper, gamepad);

        return result;
    };

    public checkInput(gamepad: Gamepad): void {
        const navigated = this.checkNavigation(gamepad.index);
        this.checkScrolling(gamepad.index);
        this.checkButton(gamepad.index);

        if (navigated) {
            this.workingTabListElement = null;
            this.workingOnSlider = false;
        }
        this.checkBumpers(gamepad.index);
    }
}
