export async function getHashOfArrayBuffer(buffer: ArrayBuffer, algorithm: AlgorithmIdentifier = "SHA-256"): Promise<ArrayBuffer> {
    return crypto.subtle.digest(algorithm, buffer);
}