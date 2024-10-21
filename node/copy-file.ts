import fs from "fs";


export async function copyFile(srcPath: fs.PathLike, destPath: fs.PathLike): Promise<void> {
    await fs.promises.copyFile(srcPath, destPath);
}