import fs from "node:fs";
import path from "node:path";
import { ANSI } from "../generic/ansi.js";
import { LOG } from "../generic/log.js";


// TODO: Finish this function, and export it.

async function deleteEmptyDirectories(dirPath: string) {
    let deleted: Array<string> = [];

    const _coreFn = async (dirPath: string) => {
        const files = await fs.promises.readdir(dirPath);
        // If the directory is empty, delete it
        if (files.length === 0) {
            await fs.promises.rmdir(dirPath);
            deleted.push(dirPath);
            return;
        }

        // Iterate through the files/directories in the current directory
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const isDir = (await fs.promises.stat(filePath)).isDirectory();

            if (isDir) {
                await _coreFn(filePath, false);
            }
        }

        // Check if the directory is empty after deleting subdirectories
        const remainingFiles = await fs.promises.readdir(dirPath);
        if (remainingFiles.length === 0) {
            await fs.promises.rmdir(dirPath);
            deleted.push(dirPath);
        }
    };

    await _coreFn(dirPath);

    if (deleted.length > 0) {
        LOG(`Deleted empty directories inside ${dirPath}: ${ANSI.color.yellow}${deleted}`);
    } else {
        LOG(`No empty directories found inside ${dirPath}`);
    }
}