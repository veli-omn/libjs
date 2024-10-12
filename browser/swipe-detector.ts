export class SwipeDetector {
    element: HTMLElement;
    callback: (direction: { direction: string }) => void;
    startX: number;
    startY: number;
    deltaMin: number;

    constructor(element: HTMLElement, callback: (direction: { direction: string }) => void, deltaMin: number = 30) {
        this.element = element;
        this.callback = callback;
        this.startX = 0;
        this.startY = 0;
        this.deltaMin = deltaMin;
        this.element.addEventListener("touchstart", this.handleTouchStart, { passive: true });
        this.element.addEventListener("touchend", this.handleTouchEnd, { passive: true });
    }

    handleTouchStart = (event: TouchEvent): void => {
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;
    }

    handleTouchEnd = (event: TouchEvent): void => {
        const endX = event.changedTouches[0].clientX;
        const endY = event.changedTouches[0].clientY;
        const deltaX = endX - this.startX;
        const deltaY = endY - this.startY;
        const deltaXAbs = Math.abs(deltaX);
        const deltaYAbs = Math.abs(deltaY);

        if (deltaXAbs < this.deltaMin && deltaYAbs < this.deltaMin) return;

        const direction: "right" | "left" | "down" | "up" =
            deltaXAbs > deltaYAbs ?
            deltaX > 0 ? "right" : "left" :
            deltaY > 0 ? "down" : "up";

        this.callback({ direction });
    }

    remove(): void {
        this.element.removeEventListener("touchstart", this.handleTouchStart);
        this.element.removeEventListener("touchend", this.handleTouchEnd);
    }
}