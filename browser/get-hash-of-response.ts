import { getHashOfArrayBuffer } from "./get-hash-of-array-buffer.js";


export async function getHashOfResponse(response: Response, algorithm: string = "SHA-256"): Promise<ArrayBuffer> {
    if (!(response instanceof Response)) throw new Error("Failed to get hash of response: invalid response object");

    const responseCloneBuffer: ArrayBuffer = await response.clone().arrayBuffer();
    const hashBuffer: ArrayBuffer = await getHashOfArrayBuffer(responseCloneBuffer, algorithm);

    return hashBuffer;
}