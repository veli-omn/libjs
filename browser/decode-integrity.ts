import { areArraysEqual } from "../generic/are-arrays-equal.js";
import { getHashOfArrayBuffer } from "./get-hash-of-array-buffer.js";


export async function decodeIntegrity(encodedData: ArrayBuffer): Promise<ArrayBuffer> {
    try {
        if (!(encodedData instanceof ArrayBuffer)) {
            throw new TypeError("input must be an ArrayBuffer");
        }

        const encodedDataView: DataView = new DataView(encodedData);
        const lengthOfData: number = encodedDataView.getUint32(0, false);
        const hashFlag: number = encodedDataView.getUint8(4);

        let hashAlgorithm: string | null = null;
        let hashLength: number | null = null;
        switch (hashFlag) {
            case 0:
                hashAlgorithm = "SHA-1";
                hashLength = 20;
                break;
            case 1:
                hashAlgorithm = "SHA-256";
                hashLength = 32;
                break;
            case 2:
                hashAlgorithm = "SHA-384";
                hashLength = 48;
                break;
            case 3:
                hashAlgorithm = "SHA-512";
                hashLength = 64;
                break;
            default:
                throw new Error("invalid hash flag");
        }

        // 4 -> uint32 indicating the byteLength of encoded data | 1 -> uint8 indicating hashFlag | hashLength | 1 -> minimum byteLength data that encoder accepts
        const minimumByteLength = 4 + 1 + hashLength + 1;
        if (encodedData.byteLength < minimumByteLength) {
            throw new Error("invalid length of input");
        }

        const hashOfData: Uint8Array = new Uint8Array(encodedData, 5, hashLength);
        const data: Uint8Array = new Uint8Array(encodedData, 5 + hashLength);

        if (data.byteLength !== lengthOfData) {
            throw new Error("length mismatch");
        }

        const computedHashOfData: Uint8Array = new Uint8Array(await getHashOfArrayBuffer(data, hashAlgorithm));

        if (!areArraysEqual(hashOfData, computedHashOfData)) {
            throw new Error("hash mismatch");
        }

        return new Uint8Array(data).buffer;
    } catch (err) {
        throw new Error("Integrity decoding failure", { cause: err });
    }
}
