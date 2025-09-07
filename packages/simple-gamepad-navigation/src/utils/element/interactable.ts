import type { NavigationDirection } from '../../types';

import { getDialogElementOfTarget } from './dialog';
import { getDistanceOfTwoElements, isElementInRect } from './distance';

const INPUT_ROLES = ['textbox', 'searchbox', 'combobox', 'slider', 'spinbutton'];
const INTERACTABLE_ROLES = ['button', 'link', 'checkbox', 'radio', 'slider', 'tab', ...INPUT_ROLES];

const isContentEditable = (element: Element) => {
    return element.hasAttribute('contenteditable') && element.getAttribute('contenteditable') !== 'false';
};

const hasInputRole = (element: Element) => {
    return element.hasAttribute('role') && INPUT_ROLES.includes(element.getAttribute('role')!);
};

const hasInteractableRole = (element: Element) => {
    return element.hasAttribute('role') && INTERACTABLE_ROLES.includes(element.getAttribute('role')!);
};

const isInputElement = (element: Element) => {
    return (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        hasInputRole(element) ||
        isContentEditable(element)
    );
};

const isVisibleElement = (element: Element) => {
    if (!(element instanceof HTMLElement)) return false;
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0 && rect.x === 0 && rect.y === 0) return false;
    const style = getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
};

export const isInteractableElement = (element: Element) => {
    return (
        element instanceof HTMLButtonElement ||
        element instanceof HTMLAnchorElement ||
        isInputElement(element) ||
        hasInteractableRole(element)
    );
};

export const getInteractableElements = (restriction?: {
    restrictedRootElement?: Element | null;
    restrictedRect?: DOMRect;
}) => {
    const treeWalker = document.createTreeWalker(
        restriction?.restrictedRootElement || document.body,
        NodeFilter.SHOW_ELEMENT
    );
    const interactableElements: Element[] = [];

    while (treeWalker.nextNode()) {
        const currentNode = treeWalker.currentNode;
        if (
            (currentNode instanceof Element || currentNode.nodeType === Node.ELEMENT_NODE) &&
            isInteractableElement(currentNode as Element)
        ) {
            const interactableRect = (currentNode as Element).getBoundingClientRect();
            const inRestrictedRect =
                !restriction?.restrictedRect || isElementInRect(interactableRect, restriction.restrictedRect);

            if (inRestrictedRect && isVisibleElement(currentNode as Element)) {
                interactableElements.push(currentNode as Element);
            }
        }
    }

    return interactableElements;
};

export const findNewInteractableElement = (currentElement: Element, direction: NavigationDirection) => {
    const currentRect = currentElement.getBoundingClientRect();
    const restrictedRootElement = getDialogElementOfTarget(currentElement);
    const allInteractableElements = getInteractableElements({ restrictedRootElement });
    let candidate: Element | undefined = undefined;
    let candidateDistance = Infinity;

    for (const element of allInteractableElements) {
        if (element === currentElement) continue;

        const elementRect = element.getBoundingClientRect();
        let distance = 0;

        switch (direction) {
            case 'up':
                distance = getDistanceOfTwoElements(currentRect, elementRect, 'top');
                break;
            case 'down':
                distance = getDistanceOfTwoElements(currentRect, elementRect, 'bottom');
                break;
            case 'left':
                distance = getDistanceOfTwoElements(currentRect, elementRect, 'left');
                break;
            case 'right':
                distance = getDistanceOfTwoElements(currentRect, elementRect, 'right');
                break;
            default:
                break;
        }

        if (distance >= 0 && distance < candidateDistance) {
            candidate = element;
            candidateDistance = distance;
        }
    }

    return candidate;
};
