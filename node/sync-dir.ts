import fs from "node:fs";
import path from "node:path";
import { getFileHash } from "./get-file-hash.js";
import { ANSI } from "../generic/ansi.js";
import { LOG } from "../generic/log.js";


export async function syncDir(src: string, dest: string): Promise<void> {
    const operations = {
        filesToCopy: <Array<{ srcPath: string, destPath: string }>> [],
        filesToDelete: <Array<string>> [],
        dirsToCreate: <Array<string>> []
    };

    // Define a recursive function to populate operations
    const _coreFn = async (src: string, dest: string): Promise<void> => {
        const srcEntries = await fs.promises.readdir(src, { withFileTypes: true });

        // Get a list of files and directories in the destination directory
        const destEntries = await fs.promises.readdir(dest, { withFileTypes: true }).catch(() => []);
        const destFilesDirs: Set<string> = new Set(destEntries.map((entry) => entry.name));

        for (const entry of srcEntries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                // If the directory doesn't exist in dest, mark it for creation
                if (!destFilesDirs.has(entry.name)) {
                    operations.dirsToCreate.push(destPath);
                }
                // Recursively call _coreFn for subdirectories
                await _coreFn(srcPath, destPath);
            } else if (entry.isFile()) {
                const srcHash = await getFileHash(srcPath, "sha512").catch(() => null);
                const destHash = destFilesDirs.has(entry.name) ? await getFileHash(destPath, "sha512").catch(() => null) : null;

                if (srcHash !== destHash) {
                    operations.filesToCopy.push({ srcPath, destPath });
                }
            }
            destFilesDirs.delete(entry.name);
        }

        // Files and directories in dest that are not in src should be deleted
        for (const destEntry of destFilesDirs) {
            const destEntryPath = path.join(dest, destEntry);
            operations.filesToDelete.push(destEntryPath);
        }
    };

    await _coreFn(src, dest);

    // Create directories that don't exist in dest
    for (const dirPath of operations.dirsToCreate) {
        await fs.promises.mkdir(dirPath, { recursive: true }).catch(() => {});
    }

    // Delete files and directories that are not in src
    for (const filePath of operations.filesToDelete) {
        await fs.promises.rm(filePath, { recursive: true, force: true }).catch(() => {});
    }

    // Copy files with hash mismatch
    for (const { srcPath, destPath } of operations.filesToCopy) {
        await fs.promises.copyFile(srcPath, destPath).catch(() => {});
    }

    LOG(`Synchronized folders: ${ANSI.set("cyan", src)} -> ${ANSI.set("cyan", dest)} | copied: ${operations.filesToCopy.length} file${operations.filesToCopy.length !== 1 ? "s" : ""} | deleted: ${operations.filesToDelete.length} file${operations.filesToDelete.length !== 1 ? "s" : ""}`);
}