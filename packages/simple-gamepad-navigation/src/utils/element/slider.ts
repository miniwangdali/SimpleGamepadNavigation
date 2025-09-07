export const isSliderElement = (element?: Element | null) => {
    return !!element && element instanceof HTMLInputElement && (element.type === 'range' || element.role === 'slider');
};
