import { compareArrayBuffers } from "../generic/compare-array-buffers.js";
import { getHashOfArrayBuffer } from "./get-hash-of-array-buffer.js";
import { concatArrayBuffers } from "../generic/concat-array-buffers.js";


export async function genMerkleRoot(hashes: Array<ArrayBuffer>, algorithm: AlgorithmIdentifier = "SHA-256", orderDependant: boolean = false): Promise<ArrayBuffer> {
    if (hashes.length === 0) {
        throw new Error("Cannot generate Merkle root from zero length array");
    }

    if (!orderDependant) {
        hashes.sort(compareArrayBuffers);
    }

    while (hashes.length > 1) {
        const nextLevel: Array<ArrayBuffer> = [];

        for (let i = 0; i < hashes.length; i += 2) {
            const hash0: ArrayBuffer = hashes[i];
            const hash1: ArrayBuffer = hashes[i + 1] || hashes[i]; // If there's no pair for the last hash, duplicate it.
            const combinedHash: ArrayBuffer = await getHashOfArrayBuffer(concatArrayBuffers(hash0, hash1), algorithm);

            nextLevel.push(combinedHash);
        }

        hashes = nextLevel;
    }

    return hashes[0];
}