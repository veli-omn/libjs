import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { ANSI } from "../generic/ansi.js";
import { LOG } from "../generic/log.js";


export async function compressDir(dirPath: string, exclude: Array<string>, method: string, level: number, minRatio: number): Promise<void> {
    exclude = [".gz", ".br", ".def", ...exclude];

    const ct0: [number, number] = process.hrtime();
    let compressedFilesCount: number = 0;
    let notCompressed: Array<string> = [];

    const performDirCompression = async (dirPath: string, exclude: Array<string>, method: string, level: number, minRatio: number) => {
        const files = await fs.promises.readdir(dirPath);

        const compressFile = async (filePath: string, method: string, level: number, minRatio: number) => {
            const fileContents: Buffer = await fs.promises.readFile(filePath);
            let compressedContents: undefined | Buffer;
            let extension: undefined | string;

            switch (method) {
                case "gzip":
                    compressedContents = zlib.gzipSync(fileContents, { level: level });
                    extension = "gz";
                    break;
                case "brotli":
                    compressedContents = zlib.brotliCompressSync(fileContents, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: level } });
                    extension = "br";
                    break;
                case "deflate":
                    compressedContents = zlib.deflateSync(fileContents, { level: level });
                    extension = "def";
                    break;
                default:
                    LOG(`Unsupported compression method: ${method}`, false, "error");
                    return;
            }

            if (!minRatio || (compressedContents.length / fileContents.length) < minRatio) {
                await fs.promises.writeFile(`${filePath}.${extension}`, compressedContents);
                compressedFilesCount++;
            } else {
                notCompressed.push(filePath);
            }
        };

        for (const file of files) {
            const filePath: string = path.join(dirPath, file);
            const stats = await fs.promises.stat(filePath);

            if (stats.isDirectory()) {
                await performDirCompression(filePath, exclude, method, level, minRatio);
            } else if (!(exclude.includes(path.extname(file)) || exclude.includes(file))) {
                await compressFile(filePath, method, level, minRatio);
            }
        }
    };

    await performDirCompression(dirPath, exclude, method, level, minRatio);
    const cdiff = process.hrtime(ct0);
    LOG(`Compressed files (${method}): ${compressedFilesCount} (${cdiff[0]}.${cdiff[1]}s) | ${notCompressed.length > 0 ? `${ANSI.color.yellow}not compressed files / above min ratio: ${notCompressed.join(", ")}` : ""}`);
}