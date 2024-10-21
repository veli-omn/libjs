export function concatArrayBuffers(...buffers: Array<ArrayBuffer>): ArrayBuffer {
    let concatedByteLength: number = 0;

    for (const buff of buffers) {
        concatedByteLength += buff.byteLength;
    }

    const concatedUint8Array: Uint8Array = new Uint8Array(concatedByteLength);
    let offset: number = 0;

    for (const buff of buffers) {
        const buffUint8View: Uint8Array = new Uint8Array(buff);

        concatedUint8Array.set(buffUint8View, offset);
        offset += buffUint8View.byteLength;
    }

    return concatedUint8Array.buffer;
}


// TODO: Another variant bellow, do benchmark and export the most performant.

// function concatArrayBuffers(...bufs: Array<ArrayBuffer>): ArrayBuffer {
//     const byteArray: Array<number> = [];

//     for (const buf of bufs) {
//         byteArray.push(...new Uint8Array(buf));
//     }
//     return new Uint8Array(byteArray).buffer;
// }