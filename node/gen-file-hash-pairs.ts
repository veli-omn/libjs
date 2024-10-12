import { getFileHash } from "./get-file-hash.js";


export async function genFileHashPairs(dirPath: string, filesList: Array<string>, algorithm: string = "SHA-256"): Promise<Array<[string, ArrayBuffer]>> {
    const fileHashPairs: Array<[string, ArrayBuffer]> = [];

    for (const file of filesList) {
        fileHashPairs.push([file, await getFileHash(dirPath + file, algorithm)]);
    }

    return fileHashPairs;
}