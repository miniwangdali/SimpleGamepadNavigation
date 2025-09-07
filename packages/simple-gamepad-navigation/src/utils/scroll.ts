import { throttle } from 'es-toolkit';

import { ScrollDirection } from '../types';
import { getNearestScrollContainer } from './element/scrollContainer';

const THROTTLE_DELAY = 250;

const scroll = (
    direction: ScrollDirection,
    speed: number,
    originalPosition: { x: number; y: number },
    immediate?: boolean
) => {
    if (document.activeElement) {
        const scrollContainer = getNearestScrollContainer(document.activeElement);

        if (scrollContainer) {
            originalPosition.x = scrollContainer.scrollLeft;
            originalPosition.y = scrollContainer.scrollTop;

            const style = getComputedStyle(scrollContainer);
            const overflowY = style.overflowY;
            const isScrollableY =
                (overflowY === 'auto' || overflowY === 'scroll' || scrollContainer === document.documentElement) &&
                scrollContainer.scrollHeight > scrollContainer.clientHeight;
            const overflowX = style.overflowX;
            const isScrollableX =
                (overflowX === 'auto' || overflowX === 'scroll' || scrollContainer === document.documentElement) &&
                scrollContainer.scrollWidth > scrollContainer.clientWidth;

            const scrollAmount = scrollContainer.clientHeight * speed;

            switch (direction) {
                case ScrollDirection.Vertical:
                    if (isScrollableY) {
                        scrollContainer.scrollBy({ top: scrollAmount, behavior: immediate ? 'auto' : 'smooth' });
                    }
                    break;
                case ScrollDirection.Horizontal:
                    if (isScrollableX) {
                        scrollContainer.scrollBy({ left: scrollAmount, behavior: immediate ? 'auto' : 'smooth' });
                    }
                    break;
            }

            return true;
        }
    }

    return false;
};

export const throttledScroll = throttle(
    (
        direction: ScrollDirection,
        speed: number,
        state: { result: boolean; originalPosition: { x: number; y: number } },
        immediate?: boolean
    ) => {
        state.result = scroll(direction, speed, state.originalPosition, immediate);
    },
    THROTTLE_DELAY,
    { edges: ['leading'] }
);
