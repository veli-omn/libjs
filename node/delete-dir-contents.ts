import fs from "node:fs";
import path from "node:path";
import { LOG } from "../generic/log.js";
import { ANSI } from "../generic/ansi.js";


export async function deleteDirectoryContents(dirPath: string): Promise<void> {
    try {
        await fs.promises.readdir(dirPath);
    } catch (error) {
        LOG(`Directory deletion failure: ${error}`, false, "error");
        return;
    }

    const deleteDir = async (dirPath: string): Promise<void> => {
        const files = await fs.promises.readdir(dirPath);

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = await fs.promises.stat(filePath);

            if (stats.isDirectory()) {
                await deleteDir(filePath);
                await fs.promises.rmdir(filePath);
            } else {
                await fs.promises.unlink(filePath);
            }
        }
    };

    await deleteDir(dirPath);
    LOG(`Deleted contents of directory: ${ANSI.setColor("cyan", dirPath)}`);
}