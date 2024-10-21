import fs from "fs";


export function replaceStringsInFiles(filePaths: Array<string>, replacements: Array<[string, string]>): Array<unknown> {
    const modifiedFiles: Set<string> = new Set();

    for (const filePath of filePaths) {
        try {
            let content: string = fs.readFileSync(filePath, "utf8");

            for (const [oldString, newString] of replacements) {
                const regex: RegExp = new RegExp(oldString, "g");

                if (content.match(regex)) {
                    content = content.replace(regex, newString);
                    fs.writeFileSync(filePath, content, "utf8");
                    modifiedFiles.add(filePath);
                }
            }
        } catch (err) {
            throw new Error(`Failed to replace strings in file: ${filePath}:`, { cause: err });
        }
    }

    return Array.from(modifiedFiles);
}