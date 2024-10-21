import fs from "fs";
import path from "path";
import { copyFile } from "./copy-file.js";


export async function copyDir(srcDir: string, destDir: string, exclude: Array<string> = [], isRootCall = true): Promise<number> {
    let filesCount: number = 0;

    try {
        const entries = await fs.promises.readdir(srcDir, { withFileTypes: true });
        await fs.promises.mkdir(destDir, { recursive: true }).catch(() => {});

        for (const entry of entries) {
            const srcPath: string = path.join(srcDir, entry.name);
            const destPath: string = path.join(destDir, entry.name);

            if (entry.isDirectory()) {
                // Recursive call for directories with isRootCall set to false.
                const copiedInSubdir: number = await copyDir(srcPath, destPath, exclude, false);
                filesCount += copiedInSubdir; // Add the count from the subdirectory.
            } else if (entry.isFile() && !exclude.includes(path.extname(entry.name))) {
                await copyFile(srcPath, destPath);
                filesCount++;
            }
        }
    } catch (err) {
        throw new Error(`Failed to copy directory: ${srcDir}`, { cause: err });
    }

    if (isRootCall){
        return filesCount;
    }

    return filesCount; // Return the count for use in recursive calls.
}