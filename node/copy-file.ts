import fs from "node:fs";


export async function copyFile(srcPath: string, destPath: string): Promise<void> {
    await fs.promises.copyFile(srcPath, destPath);
}