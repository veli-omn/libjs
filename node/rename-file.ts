import fs from "fs";
import path from "path";


export async function renameFile(filePath: string, newName: string): Promise<boolean> {
    let executionStatus: boolean = false;

    try {
        const directory: string = path.dirname(filePath);
        const newPath: string = path.join(directory, newName);
        await fs.promises.rename(filePath, newPath);
        executionStatus = true;
    } catch (err) {
        console.error(err);
    }

    return executionStatus;
}