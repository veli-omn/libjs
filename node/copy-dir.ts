import fs from "fs";
import path from "path";
import { copyFile } from "./copy-file.js";

export async function copyDir(srcDir: string, destDir: string, exclude: Array<string> = []): Promise<number> {
    let filesCount: number = 0;

    try {
        await fs.promises.mkdir(destDir, { recursive: true }).catch(() => {});
        const entries = await fs.promises.readdir(srcDir, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath: string = path.join(srcDir, entry.name);
            const destPath: string = path.join(destDir, entry.name);

            if (entry.isDirectory()) {
                const copiedInSubdir: number = await copyDir(srcPath, destPath, exclude);
                filesCount += copiedInSubdir;
            } else if (entry.isFile()) {
                const fileExtension: string = path.extname(entry.name);
                const isExcluded = exclude.includes(entry.name) || (fileExtension && exclude.includes(fileExtension));

                if (!isExcluded) {
                    await copyFile(srcPath, destPath);
                    filesCount++;
                }
            }
        }
    } catch (err) {
        throw new Error(`Failed to copy directory from ${srcDir} to ${destDir}`, { cause: err });
    }

    return filesCount;
}
