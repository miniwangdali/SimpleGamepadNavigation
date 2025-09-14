import { throttle } from 'es-toolkit';

import { NavigationDirection, ScrollDirection } from '../types';
import { isElementInRect } from './element/distance';
import { findNewInteractableElement, getInteractableElements } from './element/interactable';
import {
    canScroll,
    getNearestScrollContainer,
    isElementPositionedUnrelatedToScrollContainer,
} from './element/scrollContainer';
import { throttledScroll } from './scroll';

const THROTTLE_DELAY = 250;

export const focusInteractableElement = (target: Element) => {
    if (target instanceof HTMLElement) {
        (document.activeElement as HTMLElement).blur();
        target.focus();
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });

        return true;
    }

    return false;
};

export const focusNextInteractableElement = (current: Element, direction: NavigationDirection) => {
    let nextElement = findNewInteractableElement(current, direction);
    const scrollContainer = getNearestScrollContainer(current);
    const scrollDirection =
        direction === NavigationDirection.Up || direction === NavigationDirection.Down
            ? ScrollDirection.Vertical
            : ScrollDirection.Horizontal;
    const speed = direction === NavigationDirection.Up || direction === NavigationDirection.Left ? -0.5 : 0.5;

    while (true) {
        if (
            scrollContainer &&
            nextElement &&
            canScroll(scrollContainer, scrollDirection, speed) &&
            isElementPositionedUnrelatedToScrollContainer(nextElement, scrollContainer)
        ) {
            const originalPosition = { x: 0, y: 0 };
            throttledScroll(scrollDirection, speed, { result: false, originalPosition }, true);
            const newNextElement = findNewInteractableElement(current, direction);
            if (newNextElement === nextElement) {
                // cannot find a new element after scroll, stop here
                scrollContainer.scrollTo(originalPosition.x, originalPosition.y);
                break;
            }
            nextElement = newNextElement;
            continue;
        }
        break;
    }

    if (nextElement instanceof HTMLElement) {
        return focusInteractableElement(nextElement);
    }
    return false;
};

const navigate = (direction: NavigationDirection) => {
    const viewportRect = new DOMRect(0, 0, window.innerWidth, window.innerHeight);
    if (
        document.activeElement &&
        document.activeElement !== document.body &&
        isElementInRect(document.activeElement.getBoundingClientRect(), viewportRect)
    ) {
        return focusNextInteractableElement(document.activeElement, direction);
    } else {
        const allInteractableElements = getInteractableElements({ restrictedRect: viewportRect });
        let candidate: Element | undefined;
        let candidateRect: DOMRect;

        switch (direction) {
            case NavigationDirection.Up:
                candidateRect = new DOMRect(Infinity, 0, 0, 0);
                break;
            case NavigationDirection.Right:
            case NavigationDirection.Down:
                candidateRect = new DOMRect(Infinity, Infinity, 0, 0);
                break;
            case NavigationDirection.Left:
                candidateRect = new DOMRect(0, Infinity, 0, 0);
                break;
        }

        // find the most top left element
        for (const element of allInteractableElements) {
            const elementRect = element.getBoundingClientRect();

            switch (direction) {
                case NavigationDirection.Up:
                    if (
                        elementRect.bottom > candidateRect.bottom ||
                        (elementRect.bottom === candidateRect.bottom && elementRect.left < candidateRect.left)
                    ) {
                        candidate = element;
                        candidateRect = elementRect;
                    }
                    break;
                case NavigationDirection.Right:
                    if (
                        elementRect.left < candidateRect.left ||
                        (elementRect.left === candidateRect.left && elementRect.top < candidateRect.top)
                    ) {
                        candidate = element;
                        candidateRect = elementRect;
                    }
                    break;
                case NavigationDirection.Down:
                    if (
                        elementRect.top < candidateRect.top ||
                        (elementRect.top === candidateRect.top && elementRect.left < candidateRect.left)
                    ) {
                        candidate = element;
                        candidateRect = elementRect;
                    }
                    break;
                case NavigationDirection.Left:
                    if (
                        elementRect.right > candidateRect.right ||
                        (elementRect.right === candidateRect.right && elementRect.top < candidateRect.top)
                    ) {
                        candidate = element;
                        candidateRect = elementRect;
                    }
                    break;
            }
        }

        if (candidate) {
            return focusInteractableElement(candidate);
        }
    }

    return false;
};

export const throttledNavigate = throttle(
    (direction: NavigationDirection, state: { result: boolean }) => {
        state.result = navigate(direction);
    },
    THROTTLE_DELAY,
    { edges: ['leading'] }
);
