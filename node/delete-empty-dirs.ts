import fs from "node:fs";
import path from "node:path";
import { ANSI } from "../generic/ansi.js";
import { LOG } from "../generic/log.js";


export async function deleteEmptyDirs(dirPath: string) {
    let deleted: Array<string> = [];

    const performDirDeletion = async (dirPath: string) => {
        const files: Array<string> = await fs.promises.readdir(dirPath);
        // If the directory is empty, delete it.
        if (files.length === 0) {
            await fs.promises.rmdir(dirPath);
            deleted.push(dirPath);
            return;
        }

        // Iterate through the files/directories in the current directory.
        for (const file of files) {
            const filePath: string = path.join(dirPath, file);
            const isDir: boolean = (await fs.promises.stat(filePath)).isDirectory();

            if (isDir) {
                await performDirDeletion(filePath);
            }
        }

        // Check if the directory is empty after deleting subdirectories.
        const remainingFiles: Array<string> = await fs.promises.readdir(dirPath);
        if (remainingFiles.length === 0) {
            await fs.promises.rmdir(dirPath);
            deleted.push(dirPath);
        }
    };

    await performDirDeletion(dirPath);

    if (deleted.length > 0) {
        LOG(`Deleted empty directories inside ${dirPath}: ${ANSI.color.yellow}${deleted}`);
    } else {
        LOG(`No empty directories found inside ${dirPath}`);
    }
}