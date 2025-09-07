export type GamepadInputChange = {
    buttons?: Map<number, GamepadButton>;
    axes?: Map<number, number>;
};

export type GamepadInputHandler = (gamepad: Gamepad, changed: GamepadInputChange) => boolean | void;

export enum NavigationDirection {
    Up = 'up',
    Down = 'down',
    Left = 'left',
    Right = 'right',
}

export enum ScrollDirection {
    Vertical = 'vertical',
    Horizontal = 'horizontal',
}
