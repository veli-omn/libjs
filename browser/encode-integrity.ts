import { concatArrayBuffers } from "../generic/concat-array-buffers.js";
import { getHashOfArrayBuffer } from "./get-hash-of-array-buffer.js";


export async function encodeIntegrity(data: ArrayBuffer, hashAlgorithm: string = "SHA-256"): Promise<ArrayBuffer> {
    try {
        if (!(data instanceof ArrayBuffer)) {
            throw new TypeError("input data must be an ArrayBuffer");
        } else if (data.byteLength === 0) {
            throw new Error("length of input data can't be zero");
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
                throw new Error("invalid hash algorithm");
        }

        const lengthBuffer: ArrayBuffer = new ArrayBuffer(4);
        new DataView(lengthBuffer).setUint32(0, data.byteLength, false);
        const hashFlagBuffer: Uint8Array = new Uint8Array([hashFlag]);
        const hashBuffer: ArrayBuffer = await getHashOfArrayBuffer(data, hashAlgorithm);

        return concatArrayBuffers(lengthBuffer, hashFlagBuffer, hashBuffer, data);
    } catch (err) {
        throw new Error("Integrity encoding failure", { cause: err });
    }
}