import { readFile } from "./read-file.js";
import { getHashOfArrayBuffer } from "../browser/get-hash-of-array-buffer.js";


export async function getFileHash(filePath: string, algorithm: string = "SHA-256"): Promise<ArrayBuffer> {
    return await getHashOfArrayBuffer(await readFile(filePath) as ArrayBuffer, algorithm);
}