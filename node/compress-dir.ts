import fs from "fs";
import path from "path";
import zlib from "zlib";

export type CompressAlgorithms = "gzip" | "brotli" | "deflate"


export async function compressDir(dirPath: string, exclude: Array<string>, algorithm: CompressAlgorithms, level: number, minRatio: number) {
    const defaultExlude: Array<string> = [".gz", ".br", ".def"];
    exclude = [...defaultExlude, ...exclude];

    const compressed: Array<string> = [];
    const aboveMinRatio: Array<string> = [];
    const excluded: Array<string> = [];

    const performDirCompression = async (dirPath: string, exclude: Array<string>, algorithm: string, level: number, minRatio: number) => {
        const files: Array<string> = await fs.promises.readdir(dirPath);

        const compressFile = async (filePath: string, algorithm: string, level: number, minRatio: number) => {
            const fileContents: Buffer = await fs.promises.readFile(filePath);
            let compressedContents: Buffer | undefined;
            let extension: string | null = null;

            switch (algorithm) {
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
                    throw new Error(`invalid compression algorithm: ${algorithm}`);
            }

            if (!minRatio || (compressedContents.length / fileContents.length) < minRatio) {
                await fs.promises.writeFile(`${filePath}.${extension}`, compressedContents);
                compressed.push(path.basename(filePath));
            } else {
                aboveMinRatio.push(path.basename(filePath));
            }
        };

        for (const file of files) {
            const filePath: string = path.join(dirPath, file);
            const stats = await fs.promises.stat(filePath);

            if (stats.isDirectory()) {
                await performDirCompression(filePath, exclude, algorithm, level, minRatio);
            } else if (!(exclude.includes(path.extname(file)) || exclude.includes(file))) {
                await compressFile(filePath, algorithm, level, minRatio);
            } else if (!defaultExlude.includes(path.extname(file))) {
                excluded.push(path.basename(filePath));
            }
        }
    };

    try {
        await performDirCompression(dirPath, exclude, algorithm, level, minRatio);
    } catch (err) {
        throw new Error("Directory compression failure", { cause: err });
    }

    return { compressed, aboveMinRatio, excluded };
}