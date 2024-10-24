import fs from "fs";
import { join } from "path";


export async function getDirSize(dirPath: string): Promise<number> {
    try {
        const dirEntries: Array<fs.Dirent> = await fs.promises.readdir(dirPath, { withFileTypes: true });
        let dirSize: number = 0;

        for (const dirent of dirEntries) {
            const fullPath: string = join(dirPath, dirent.name);
            dirSize += dirent.isDirectory() ? await getDirSize(fullPath) : (await fs.promises.stat(fullPath)).size;
        }

        return dirSize;
    } catch (err) {
        throw new Error(`Failed to get size of directory: ${dirPath}`, { cause: err });
    }
}