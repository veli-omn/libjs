import { concatArrayBuffers } from "../moduleA.js";
import { getHashOfArrayBuffer } from "./moduleN.js";
import { TextEncoder } from "util";


async function encodeDataWithIntegrity(data: ArrayBuffer, hashAlgorithm: string = "SHA-256"): Promise<ArrayBuffer> {
    const logPrefix: string = "Integrity Encoder:";

    if (!(data instanceof ArrayBuffer)) {
        throw new TypeError(`${logPrefix} input data must be an ArrayBuffer`);
    } else if (data.byteLength === 0) {
        throw new Error(`${logPrefix} length of input data can't be zero`);
    }

    let hashFlag: number | null = null;
    switch (hashAlgorithm) {
        case "SHA-1":
            hashFlag = 0;
            break;
        case "SHA-256":
            hashFlag = 1;
            break;
        case "SHA-384":
            hashFlag = 2;
            break;
        case "SHA-512":
            hashFlag = 3;
            break;
        default:
            throw new Error(`${logPrefix} invalid hash algorithm`);
    }

    const lengthBuffer: ArrayBuffer = new ArrayBuffer(4);
    new DataView(lengthBuffer).setUint32(0, data.byteLength, false);
    const hashFlagBuffer: Uint8Array = new Uint8Array([hashFlag]);
    const hashBuffer: ArrayBuffer = await getHashOfArrayBuffer(data, hashAlgorithm);

    return concatArrayBuffers(lengthBuffer, hashFlagBuffer, hashBuffer, data);
}


async function encodeHashIndex(filePathHashes: Array<[string, ArrayBuffer]>): Promise<ArrayBuffer> {
    const logPrefix: string = "Hash Index Encoder:";

    if (!(filePathHashes instanceof Array)) {
        throw new TypeError(`${logPrefix} input data must be an Array`);
    }

    const textEncoder: TextEncoder = new TextEncoder();
    const buffers: Array<ArrayBuffer> = [];

    for (const [filePath, hashBuffer] of filePathHashes) {
        if (typeof filePath !== "string") {
            throw new TypeError(`${logPrefix} file path must be a string`);
        } else if (!(hashBuffer instanceof ArrayBuffer)) {
            throw new TypeError(`${logPrefix} hash must be an ArrayBuffer`);
        }

        const filePathBuffer: Uint8Array = textEncoder.encode(filePath);
        const filePathLengthBuffer: ArrayBuffer = new ArrayBuffer(2);
        new DataView(filePathLengthBuffer).setUint16(0, filePathBuffer.byteLength, false);

        buffers.push(filePathLengthBuffer);
        buffers.push(filePathBuffer);
        buffers.push(hashBuffer);
    }

    const hashLengthBuffer: ArrayBuffer = new ArrayBuffer(2);
    new DataView(hashLengthBuffer).setUint16(0, buffers[2].byteLength, false);

    const encodedHashIndex: ArrayBuffer = concatArrayBuffers(hashLengthBuffer, ...buffers);

    return await encodeDataWithIntegrity(encodedHashIndex, "SHA-256");
}


export {
    encodeDataWithIntegrity,
    encodeHashIndex
}