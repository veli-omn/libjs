import fs from "node:fs";
import path from "node:path";
import { ANSI } from "../generic/ansi.js";
import { LOG } from "../generic/log.js";


export async function renameFile(filePath: string, newName: string): Promise<void> {
    try {
        const directory: string = path.dirname(filePath);
        const newPath: string = path.join(directory, newName);
        await fs.promises.rename(filePath, newPath);
        LOG(`File renamed: ${path.basename(filePath)} -> ${newName}`);
    } catch (err) {
        LOG(`${ANSI.color.red}Error renaming file: ${err}${ANSI.reset}`);
    }
}