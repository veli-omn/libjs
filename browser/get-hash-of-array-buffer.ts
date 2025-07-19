export async function getHashOfArrayBuffer(
    buffer: ArrayBufferLike | Uint8Array<ArrayBufferLike>,
    algorithm: AlgorithmIdentifier = "SHA-256"
): Promise<ArrayBuffer> {
    return crypto.subtle.digest(algorithm, buffer as BufferSource);
}
