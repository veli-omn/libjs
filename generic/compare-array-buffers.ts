export function compareArrayBuffers(buffer0: ArrayBuffer, buffer1: ArrayBuffer): number {
    const array0: Uint8Array = new Uint8Array(buffer0);
    const array1: Uint8Array = new Uint8Array(buffer1);

    for (let i = 0; i < Math.min(array0.length, array1.length); i++) {
        if (array0[i] !== array1[i]) {
            return array0[i] - array1[i];
        }
    }

    return array0.length - array1.length;
}