export function reverseAnimations(element: HTMLElement, speed: number): void {
    for (const animation of element.getAnimations()) {
        animation.updatePlaybackRate(speed);
        animation.reverse();
    }
}