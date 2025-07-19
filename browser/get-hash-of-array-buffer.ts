export async function getHashOfArrayBuffer(
    buffer: ArrayBuffer | Uint8Array<ArrayBufferLike>,
    algorithm: AlgorithmIdentifier = "SHA-256"
): Promise<ArrayBuffer> {
    return crypto.subtle.digest(algorithm, buffer);
}
