import { decodeIntegrity } from "./decode-integrity.js";


export async function decodeHashIndex(encodedHashIndex: ArrayBuffer): Promise<Array<[string, ArrayBuffer]>> {
    try {
        encodedHashIndex = await decodeIntegrity(encodedHashIndex);

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
