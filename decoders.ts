import  { buffersAreEqual } from "./moduleA.js";

export async function decodeDataWithIntegrity(encodedBuffer: ArrayBuffer, hashFunction: string = "SHA-256") {
    const logPrefix: string = "Failure while decoding data with integrity:";

    const hashLengths: { [key: string]: number } = {
        "SHA-1": 20,
        "SHA-256": 32,
        "SHA-384": 48,
        "SHA-512": 64
    };

    const hashLength = hashLengths[hashFunction];
    if (!hashLength) {
        throw new Error(`${logPrefix} unsupported hash function < ${hashFunction} >`);
    }

    const minimumLength = 4 + hashLength + 1; // Bytes explain: 4 -> uint32 indicating the length of encoded data, 1 -> minimum data that encoder accepts.

    if (!(encodedBuffer instanceof ArrayBuffer) || encodedBuffer.byteLength < minimumLength) {
        throw new TypeError(`${logPrefix} encoded data must be an ArrayBuffer and at least ${minimumLength} bytes long`);
    }

    const encodedData: Uint8Array = new Uint8Array(encodedBuffer);
    const length: number = new DataView(encodedBuffer).getUint32(0, false);
    const hash: ArrayBuffer = encodedData.subarray(4, 4 + hashLength).buffer;
    const data: ArrayBuffer = encodedData.subarray(4 + hashLength).buffer;

    if (data.byteLength !== length) {
        throw new Error(`${logPrefix} data length mismatch`);
    }

    const computedHash = new Uint8Array(await crypto.subtle.digest(hashFunction, data));

    if (!buffersAreEqual(hash, computedHash)) {
        throw new Error(`${logPrefix} data integrity check failed`);
    }

    return data;
}
