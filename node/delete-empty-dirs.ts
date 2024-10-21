import fs from "fs";
import path from "path";


export async function deleteEmptyDirs(dirPath: string): Promise<Array<string>> {
    const deleted: Array<string> = [];

    const performEmptyDirDeletion = async (dirPath: string) => {
        const files: Array<string> = await fs.promises.readdir(dirPath);

        if (files.length === 0) {
            await fs.promises.rmdir(dirPath);
            deleted.push(dirPath);
            return;
        }

        for (const file of files) {
            const filePath: string = path.join(dirPath, file);

            if ((await fs.promises.stat(filePath)).isDirectory()) {
                await performEmptyDirDeletion(filePath);
            }
        }

        const remainingFiles: Array<string> = await fs.promises.readdir(dirPath);
        if (remainingFiles.length === 0) {
            await fs.promises.rmdir(dirPath);
            deleted.push(dirPath);
        }
    };

    await performEmptyDirDeletion(dirPath);

    return deleted;
}