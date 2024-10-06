import { arraysAreEqual } from "./moduleA.js";
import { getHashOfArrayBuffer } from "./moduleB.js";
import { hashOutputLengths } from "./constants.js";


async function decodeDataWithIntegrity(encodedData: ArrayBuffer): Promise<ArrayBuffer> {
    try {
        if (!(encodedData instanceof ArrayBuffer)) {
            throw new TypeError("input must be an ArrayBuffer");
        }

        const encodedDataView: DataView = new DataView(encodedData);
        const lengthOfData: number = encodedDataView.getUint32(0, false);
        const hashFlag: number = encodedDataView.getUint8(4);

        let hashAlgorithm: string | null = null;
        switch (hashFlag) {
            case 0:
                hashAlgorithm = "SHA-1";
                break;
            case 1:
                hashAlgorithm = "SHA-256";
                break;
            case 2:
                hashAlgorithm = "SHA-384";
                break;
            case 3:
                hashAlgorithm = "SHA-512";
                break;
            default:
                throw new Error("invalid hash flag");
        }

        const hashLength: number = hashOutputLengths[hashAlgorithm];

        // 4 -> uint32 indicating the byteLength of encoded data | 1 -> uint8 indicating hashFlag | hashLength | 1 -> minimum byteLength data that encoder accepts
        const minimumByteLength = 4 + 1 + hashLength + 1;
        if (encodedData.byteLength < minimumByteLength) {
            throw new Error("invalid length of input");
        }

        const hashOfData: Uint8Array = new Uint8Array(encodedData, 5, hashLength);
        const data: Uint8Array = new Uint8Array(encodedData, 5 + hashLength);
        const decodedBuffer: ArrayBuffer = new ArrayBuffer(data.byteLength);
        new Uint8Array(decodedBuffer).set(data);

        if (data.byteLength !== lengthOfData) {
            throw new Error("length mismatch");
        }

        const computedHashOfData: Uint8Array = new Uint8Array(await getHashOfArrayBuffer(data, hashAlgorithm));

        if (!arraysAreEqual(hashOfData, computedHashOfData)) {
            throw new Error("hash mismatch");
        }

        return decodedBuffer;
    } catch (err) {
        throw new Error("Data decoding failure (integrity)", { cause: err });
    }
}


async function decodeHashIndex(encodedHashIndex: ArrayBuffer): Promise<Array<[string, ArrayBuffer]>> {
    try {
        encodedHashIndex = await decodeDataWithIntegrity(encodedHashIndex);

        const encodedHashIndexView: DataView = new DataView(encodedHashIndex);
        const textDecoder: TextDecoder = new TextDecoder("UTF-8", { fatal: true });
        const decodedData: Array<[string, ArrayBuffer]> = [];
        const hashLength: number = encodedHashIndexView.getUint16(0, false);
        let offset: number = 2;


        while (offset < encodedHashIndex.byteLength) {
            const filePathLength: number = encodedHashIndexView.getUint16(offset, false);
            offset += 2;

            const filePathBuffer: Uint8Array = new Uint8Array(encodedHashIndex, offset, filePathLength);
            const filePath: string = textDecoder.decode(filePathBuffer);
            offset += filePathLength;

            const hash: Uint8Array = new Uint8Array(encodedHashIndex, offset, hashLength);
            const hashBuffer = new ArrayBuffer(hash.byteLength);
            new Uint8Array(hashBuffer).set(hash);
            offset += hashLength;

            decodedData.push([filePath, hashBuffer]);
        }

        return decodedData;
    } catch (err) {
        throw new Error("Hash Index decoding failure", { cause: err });
    }
}



export {
    decodeDataWithIntegrity,
    decodeHashIndex
}