import type { IGamepad } from './gamepads/types';

import { defaultAdapter } from './gamepads/default';

export class GamepadManager {
    private static instance: GamepadManager;

    public static getInstance(): GamepadManager {
        if (!GamepadManager.instance) {
            GamepadManager.instance = new GamepadManager();
        }
        return GamepadManager.instance;
    }

    private gamepads: Map<number, Gamepad> = new Map();
    private pollingHandle: number | null = null;

    constructor() {
        this.initialize();
    }

    private initialize() {
        window.addEventListener('gamepadconnected', this.gamepadConnectedListener);
        window.addEventListener('gamepaddisconnected', this.gamepadDisconnectedListener);
        window.addEventListener('focus', this.windowFocusedListener);
        window.addEventListener('blur', this.windowBlurredListener);

        this.startPolling();
    }

    private gamepadConnectedListener = (e: GamepadEvent) => {
        const gamepad = navigator.getGamepads()[e.gamepad.index];

        if (
            gamepad &&
            (gamepad.mapping === 'standard' || gamepad.mapping === 'xr-standard') &&
            !this.gamepads.has(gamepad.index)
        ) {
            this.addGamepad(gamepad);
        }
    };

    private gamepadDisconnectedListener = (e: GamepadEvent) => {
        if (this.gamepads.has(e.gamepad.index)) {
            this.removeGamepad(e.gamepad);
        }
    };

    private windowFocusedListener = () => {
        this.startPolling();
    };

    private windowBlurredListener = () => {
        this.stopPolling();
    };

    private addGamepad = (gamepad: Gamepad) => {
        this.gamepads.set(gamepad.index, gamepad);
    };

    private removeGamepad = (gamepad: Gamepad) => {
        this.gamepads.delete(gamepad.index);
    };

    private updateGamepad = (gamepad: Gamepad) => {
        this.gamepads.set(gamepad.index, gamepad);
    };

    private startPolling = () => {
        if (this.pollingHandle !== null) {
            this.stopPolling();
        }

        const gamepads = navigator.getGamepads().filter((gp) => this.gamepads.has(gp?.index ?? -1)) as Gamepad[];

        for (const gamepad of gamepads) {
            this.updateGamepad(gamepad);

            // later, we can support multiple adapters for different gamepads
            const adapter: IGamepad = defaultAdapter;

            adapter.checkInput(gamepad);
        }

        this.pollingHandle = requestAnimationFrame(this.startPolling);
    };

    private stopPolling = () => {
        if (this.pollingHandle !== null) {
            cancelAnimationFrame(this.pollingHandle);
            this.pollingHandle = null;
        }
    };

    public getGamepads() {
        return this.gamepads;
    }

    public cleanUp() {
        this.gamepads.clear();
        this.stopPolling();

        window.removeEventListener('focus', this.windowFocusedListener);
        window.removeEventListener('blur', this.windowBlurredListener);
        window.removeEventListener('gamepadconnected', this.gamepadConnectedListener);
        window.removeEventListener('gamepaddisconnected', this.gamepadDisconnectedListener);
    }
}
