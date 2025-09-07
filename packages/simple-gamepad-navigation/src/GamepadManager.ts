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

        window.removeEventListener('gamepadconnected', this.gamepadConnectedListener);
        window.removeEventListener('gamepaddisconnected', this.gamepadDisconnectedListener);
    }
}
