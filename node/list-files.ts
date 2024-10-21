import fs from "fs";


export async function listFiles(dirPath: string = ".", exclude: Array<string> = []): Promise<{ listed: Array<string>, excluded: Array<string> }> {
    const excluded: Array<string> = [];

    const checkIfInExc = (string: string, array: Array<string>) => {
        for (const element of array) {
            if (string.includes(element)) return true;
        }

        return false;
    };

    const listFilesInDir = async (dirPath: string, exclude: Array<string>): Promise<Array<string>> => {
        let files: Array<string> = [];

        if (fs.existsSync(dirPath)) {
            const items: Array<string> = await fs.promises.readdir(dirPath);

            for (const item of items) {
                if (item !== "." && item !== ".." && !checkIfInExc(item, exclude)) {
                    const path: string = dirPath + "/" + item;

                    if (fs.lstatSync(path).isDirectory()) {
                        const subFiles: Array<string> = await listFilesInDir(path, exclude);

                        for (const subFile of subFiles) {
                            files.push(item + "/" + subFile);
                        }
                    } else {
                        files.push(item);
                    }
                } else if (checkIfInExc(item, exclude)) {
                    excluded.push(item);
                }
            }
        }

        return files;
    };

    const listed: Array<string> = (await listFilesInDir(dirPath, exclude)).map((path) => "/" + path);

    return { listed, excluded };
}