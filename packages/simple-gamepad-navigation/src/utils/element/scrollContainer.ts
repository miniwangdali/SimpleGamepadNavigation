import { ScrollDirection } from '../../types';

export const getNearestScrollContainer = (element: Element): HTMLElement | null => {
    let el: Element | null = element;
    while (el) {
        if (el instanceof HTMLElement) {
            const style = getComputedStyle(el);
            const overflowY = style.overflowY;
            const isScrollableY = (overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight;
            const overflowX = style.overflowX;
            const isScrollableX = (overflowX === 'auto' || overflowX === 'scroll') && el.scrollWidth > el.clientWidth;
            if (isScrollableY || isScrollableX) {
                return el;
            }
        }
        el = el.parentElement;

        if (el === document.documentElement) {
            break;
        }
    }

    return el instanceof HTMLElement ? el : null;
};

export const canScroll = (scrollContainer: HTMLElement, direction: ScrollDirection, speed: number) => {
    switch (direction) {
        case ScrollDirection.Vertical: {
            const reverse = getComputedStyle(scrollContainer).flexDirection === 'column-reverse';
            if (speed >= 0) {
                return reverse
                    ? scrollContainer.scrollTop < 0
                    : scrollContainer.scrollTop + scrollContainer.clientHeight < scrollContainer.scrollHeight;
            } else if (speed < 0) {
                return reverse
                    ? -scrollContainer.scrollTop + scrollContainer.clientHeight < scrollContainer.scrollHeight
                    : scrollContainer.scrollTop > 0;
            }
            break;
        }
        case ScrollDirection.Horizontal: {
            const reverse = getComputedStyle(scrollContainer).flexDirection === 'row-reverse';
            if (speed >= 0) {
                return reverse
                    ? scrollContainer.scrollLeft < 0
                    : scrollContainer.scrollLeft + scrollContainer.clientWidth < scrollContainer.scrollWidth;
            } else if (speed < 0) {
                return reverse
                    ? -scrollContainer.scrollLeft + scrollContainer.clientWidth < scrollContainer.scrollWidth
                    : scrollContainer.scrollLeft > 0;
            }
            break;
        }
    }

    return false;
};

export const isElementPositionedUnrelatedToScrollContainer = (element: Element, scrollContainer: HTMLElement) => {
    let el = element as HTMLElement | null;
    let unrelatedPosition = false;

    const treeWalker = document.createTreeWalker(scrollContainer, NodeFilter.SHOW_ELEMENT);
    const elementsInScrollContainer = new Set<Node>();
    while (treeWalker.nextNode()) {
        elementsInScrollContainer.add(treeWalker.currentNode);
    }

    while (el && elementsInScrollContainer.has(el)) {
        if (el === scrollContainer) {
            return false;
        }
        const position = getComputedStyle(el).position;
        if (position === 'absolute' || position === 'fixed') {
            unrelatedPosition = true;
        }
        el = el.offsetParent as HTMLElement | null;
    }

    return unrelatedPosition;
};
