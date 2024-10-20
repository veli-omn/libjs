import fs from "node:fs";
import path from "node:path";
import { copyFile } from "./copy-file.js";
import { ANSI } from "../generic/ansi.js";
import { LOG } from "../generic/log.js";


export async function copyDir(src: string, dest: string, exclude: Array<string> = [], isRootCall = true): Promise<number> {
    let filesCount: number = 0;

    const entries = await fs.promises.readdir(src, { withFileTypes: true });
    await fs.promises.mkdir(dest, { recursive: true }).catch(() => {});

    for (const entry of entries) {
        const srcPath: string = path.join(src, entry.name);
        const destPath: string = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            // Recursive call for directories with isRootCall set to false.
            const copiedInSubdir: number = await copyDir(srcPath, destPath, exclude, false);
            filesCount += copiedInSubdir; // Add the count from the subdirectory.
        } else if (entry.isFile() && !exclude.includes(path.extname(entry.name))) {
            await copyFile(srcPath, destPath);
            filesCount++;
        }
    }

    if (isRootCall){
        LOG(`Copied ${filesCount} files: ${ANSI.setColor("cyan", src)} -> ${ANSI.setColor("cyan", dest)}`);
    }

    return filesCount; // Return the count for use in recursive calls.
}