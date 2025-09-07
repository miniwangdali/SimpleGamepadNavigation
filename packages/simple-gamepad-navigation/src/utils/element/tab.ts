export const isTabListElement = (element: Element) => {
    return element.role === 'tablist';
};

export const getTabListElementOfTarget = (target: Element) => {
    let el: Element | null = target;
    while (el) {
        if (el.previousSibling instanceof Element && isTabListElement(el.previousSibling)) {
            return el.previousSibling;
        }

        if (el.nextSibling instanceof Element && isTabListElement(el.nextSibling)) {
            return el.nextSibling;
        }

        if (isTabListElement(el)) {
            return el;
        }

        el = el.parentElement;
    }
    return el;
};

export const getTabItemsOfTabList = (tabList: Element) => {
    return tabList.querySelectorAll('[role="tab"]');
};
