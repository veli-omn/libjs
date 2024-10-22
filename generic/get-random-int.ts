export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    const randomBuffer: Uint32Array = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);

    // Convert the random value to a decimal between 0 and 1.
    const randomNumber: number = randomBuffer[0] / (0xffffffff + 1);
    const randomRange: number = max - min + 1;
    const randomOffset: number = Math.floor(randomNumber * randomRange);

    return min + randomOffset;
}