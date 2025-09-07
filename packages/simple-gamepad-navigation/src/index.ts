import { GamepadManager } from './GamepadManager';

const tag = '[SimpleGamepadNavigation]';

let gamepadManager: GamepadManager;

export const initializeGamepadNavigation = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalThis = window as any;

    if (globalThis.SimpleGamepadNavigation?.initialized) {
        console.info(`${tag} Already initialized.`);
        return;
    }

    window.addEventListener('load', () => {
        gamepadManager = GamepadManager.getInstance();
    });

    window.addEventListener('beforeunload', () => {
        gamepadManager.cleanUp();
    });

    if (!globalThis.SimpleGamepadNavigation) {
        globalThis.SimpleGamepadNavigation = { initialized: true };
    } else {
        globalThis.SimpleGamepadNavigation.initialized = true;
    }
    console.info(`${tag} Initialized.`);
};
