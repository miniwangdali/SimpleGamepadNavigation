export const isDialogElement = (element: Element) => {
    return (
        element instanceof HTMLDialogElement ||
        element.role === 'dialog' ||
        element.getAttribute('aria-modal') === 'true'
    );
};

export const getDialogElementOfTarget = (target: Element) => {
    let el: Element | null = target;
    while (el) {
        if (isDialogElement(el)) {
            return el;
        }
        el = el.parentElement;
    }
    return el;
};
