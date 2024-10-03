import crypto from "crypto";


export function encodeDataWithIntegrity(data: Buffer, hashFunction: string = "sha256"): Buffer {
    const logPrefix: string = "Failure while encoding data with integrity:";

    if (!(data instanceof Buffer)) {
        throw new TypeError(`${logPrefix} input data must be a Buffer`);
    } else if (data.length === 0) {
        throw new Error(`${logPrefix} length of input data can't be zero`);
    }

    const hash: Buffer = crypto.createHash(hashFunction).update(data).digest();
    const length: Buffer = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);

    return Buffer.concat([length, hash, data]);
}