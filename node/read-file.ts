import fs from "fs";


export async function readFile(filePath: string, encoding?: BufferEncoding): Promise<Buffer | string> {
    const data: Buffer | string = await fs.promises.readFile(filePath, { encoding });
    return data;
}
