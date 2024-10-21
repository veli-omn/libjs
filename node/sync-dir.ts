import fs from "fs";
import path from "path";
import { getFileHash } from "./get-file-hash.js";


export async function syncDir(srcDir: string, destDir: string): Promise<void> {
    const operations = {
        filesToCopy: <Array<{ srcPath: string, destPath: string }>> [],
        filesToDelete: <Array<string>> [],
        dirsToCreate: <Array<string>> []
    };

    try {
        const performDirSynchronization = async (srcDir: string, destDir: string): Promise<void> => {
            const srcEntries: Array<fs.Dirent> = await fs.promises.readdir(srcDir, { withFileTypes: true });

            // Get a list of files and directories in the destination directory.
            const destEntries: Array<never> | Array<fs.Dirent>= await fs.promises.readdir(destDir, { withFileTypes: true }).catch(() => []);
            const destFilesDirs: Set<string> = new Set(destEntries.map((entry) => entry.name));

            for (const entry of srcEntries) {
                const srcPath: string = path.join(srcDir, entry.name);
                const destPath: string = path.join(destDir, entry.name);

                if (entry.isDirectory()) {
                    // If the directory doesn't exist in dest, mark it for creation.
                    if (!destFilesDirs.has(entry.name)) {
                        operations.dirsToCreate.push(destPath);
                    }

                    // Recursively call performDirSynchronization for subdirectories.
                    await performDirSynchronization(srcPath, destPath);
                } else if (entry.isFile()) {
                    const srcHash: ArrayBuffer | null = await getFileHash(srcPath, "sha512").catch(() => null);
                    const destHash: ArrayBuffer | null = destFilesDirs.has(entry.name) ? await getFileHash(destPath, "sha512").catch(() => null) : null;

                    if (srcHash !== destHash) {
                        operations.filesToCopy.push({ srcPath, destPath });
                    }
                }
                destFilesDirs.delete(entry.name);
            }

            // Files and directories in dest that are not in src should be deleted.
            for (const destEntry of destFilesDirs) {
                const destEntryPath: string = path.join(destDir, destEntry);
                operations.filesToDelete.push(destEntryPath);
            }
        };

        await performDirSynchronization(srcDir, destDir);

        // Create directories that don't exist in dest.
        for (const dirPath of operations.dirsToCreate) {
            await fs.promises.mkdir(dirPath, { recursive: true });
        }

        // Delete files and directories that are not in src.
        for (const filePath of operations.filesToDelete) {
            await fs.promises.rm(filePath, { recursive: true, force: true });
        }

        // Copy files with hash mismatch.
        for (const { srcPath, destPath } of operations.filesToCopy) {
            await fs.promises.copyFile(srcPath, destPath);
        }
    } catch (err) {
        throw new Error(`Failed to synchronize directories: ${srcDir} -> ${destDir}`, { cause: err });
    }
}