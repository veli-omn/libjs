import fs from "fs";


export async function deleteDir(dirPath: string): Promise<boolean> {
    let executionStatus: boolean = false;

    try {
        await fs.promises.rm(dirPath, { recursive: true });
        executionStatus = true;
    } catch (err) {
        console.error(err);
    }

    return executionStatus;
}