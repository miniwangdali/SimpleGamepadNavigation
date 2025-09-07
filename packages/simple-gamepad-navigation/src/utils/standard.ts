import type { GamepadInputChange } from '../types';

export const getInputChange = (previousGamepadState: Gamepad, currentGamepadState: Gamepad) => {
    const inputChanges: GamepadInputChange = {};

    for (let i = 0; i < currentGamepadState.buttons.length; i++) {
        if (currentGamepadState.buttons[i].pressed !== previousGamepadState.buttons[i].pressed) {
            inputChanges.buttons = inputChanges.buttons || new Map();
            inputChanges.buttons.set(i, currentGamepadState.buttons[i]);
        }
    }

    for (let i = 0; i < currentGamepadState.axes.length; i++) {
        if (currentGamepadState.axes[i] !== previousGamepadState.axes[i]) {
            inputChanges.axes = inputChanges.axes || new Map();
            inputChanges.axes.set(i, currentGamepadState.axes[i]);
        }
    }

    if (!inputChanges.buttons && !inputChanges.axes) {
        return null;
    }

    return inputChanges;
};
