import { concatArrayBuffers } from "../generic/concat-array-buffers.js";
import { encodeIntegrity } from "./encode-integrity.js";


export async function encodeHashIndex(filePathHashPairs: Array<[string, ArrayBuffer]>): Promise<ArrayBufferLike> {
    try {
        if (!(filePathHashPairs instanceof Array)) {
            throw new TypeError("input data must be an Array");
        }

        const textEncoder: TextEncoder = new TextEncoder();
        const buffers: Array<ArrayBufferLike> = [];

        for (const [filePath, hashBuffer] of filePathHashPairs) {
            if (typeof filePath !== "string") {
                throw new TypeError("file path must be a string");
            } else if (!(hashBuffer instanceof ArrayBuffer)) {
                throw new TypeError("hash must be an ArrayBuffer");
            }

            const filePathArray: Uint8Array = textEncoder.encode(filePath);
            const filePathLengthBuffer: ArrayBuffer = new ArrayBuffer(2);
            new DataView(filePathLengthBuffer).setUint16(0, filePathArray.byteLength, false);

            buffers.push(filePathLengthBuffer);
            buffers.push(filePathArray.buffer);
            buffers.push(hashBuffer);
        }

        const hashLengthBuffer: ArrayBuffer = new ArrayBuffer(2);
        new DataView(hashLengthBuffer).setUint16(0, buffers[2].byteLength, false);

        const encodedHashIndex: ArrayBufferLike = concatArrayBuffers(hashLengthBuffer, ...buffers);

        return await encodeIntegrity(encodedHashIndex, "SHA-256");
    } catch (err) {
        throw new Error("Hash Index encoding failure", { cause: err });
    }
}
