export const calculateDistanceOfTwoPoints = (
    pointA: { x: number; y: number },
    pointB: { x: number; y: number }
): number => {
    const dx = pointB.x - pointA.x;
    const dy = pointB.y - pointA.y;

    return Math.sqrt(dx * dx + dy * dy);
};

const DISTANCE_BUFFER = 2; // To avoid edge cases where elements are exactly aligned

export const getDistanceOfTwoElements = (
    sourceElementRect: DOMRect,
    targetElementRect: DOMRect,
    side: 'top' | 'bottom' | 'left' | 'right'
): number => {
    switch (side) {
        case 'top': {
            const sourceTopMiddlePoint = {
                x: (sourceElementRect.left + sourceElementRect.right) / 2,
                y: sourceElementRect.top,
            };
            const targetBottomMiddlePoint = {
                x: (targetElementRect.left + targetElementRect.right) / 2,
                y: targetElementRect.bottom,
            };
            let distance = calculateDistanceOfTwoPoints(sourceTopMiddlePoint, targetBottomMiddlePoint);

            if (sourceTopMiddlePoint.y < targetBottomMiddlePoint.y - DISTANCE_BUFFER) {
                distance = Infinity;
            }

            return distance;
        }
        case 'bottom': {
            const sourceBottomMiddlePoint = {
                x: (sourceElementRect.left + sourceElementRect.right) / 2,
                y: sourceElementRect.bottom,
            };
            const targetTopMiddlePoint = {
                x: (targetElementRect.left + targetElementRect.right) / 2,
                y: targetElementRect.top,
            };
            let distance = calculateDistanceOfTwoPoints(sourceBottomMiddlePoint, targetTopMiddlePoint);

            if (sourceBottomMiddlePoint.y > targetTopMiddlePoint.y + DISTANCE_BUFFER) {
                distance = Infinity;
            }

            return distance;
        }
        case 'left': {
            const sourceLeftMiddlePoint = {
                x: sourceElementRect.left,
                y: (sourceElementRect.top + sourceElementRect.bottom) / 2,
            };
            const targetRightMiddlePoint = {
                x: targetElementRect.right,
                y: (targetElementRect.top + targetElementRect.bottom) / 2,
            };
            let distance = calculateDistanceOfTwoPoints(sourceLeftMiddlePoint, targetRightMiddlePoint);

            if (sourceLeftMiddlePoint.x < targetRightMiddlePoint.x - DISTANCE_BUFFER) {
                distance = Infinity;
            }

            return distance;
        }
        case 'right': {
            const sourceRightMiddlePoint = {
                x: sourceElementRect.right,
                y: (sourceElementRect.top + sourceElementRect.bottom) / 2,
            };
            const targetLeftMiddlePoint = {
                x: targetElementRect.left,
                y: (targetElementRect.top + targetElementRect.bottom) / 2,
            };
            let distance = calculateDistanceOfTwoPoints(sourceRightMiddlePoint, targetLeftMiddlePoint);

            if (sourceRightMiddlePoint.x > targetLeftMiddlePoint.x + DISTANCE_BUFFER) {
                distance = Infinity;
            }

            return distance;
        }
    }
};

export const isElementInRect = (elementRect: DOMRect, containerRect: DOMRect): boolean => {
    return (
        elementRect.top >= containerRect.top - DISTANCE_BUFFER &&
        elementRect.bottom <= containerRect.bottom + DISTANCE_BUFFER &&
        elementRect.left >= containerRect.left - DISTANCE_BUFFER &&
        elementRect.right <= containerRect.right + DISTANCE_BUFFER
    );
};
