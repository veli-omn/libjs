import fs from "node:fs";


export function replaceStringsInFiles(filePaths: Array<string>, replacements: Array<[string, string]>): Array<unknown> {
    const modifiedFiles = new Set();

    for (const filePath of filePaths) {
        try {
            let content = fs.readFileSync(filePath, "utf8");

            for (const [oldString, newString] of replacements) {
                const regex = new RegExp(oldString, "g");

                if (content.match(regex)) {
                    content = content.replace(regex, newString);
                    fs.writeFileSync(filePath, content, "utf8");
                    modifiedFiles.add(filePath);
                }
            }
        } catch (error) {
            console.error(`Failure while replacing strings in file ${filePath}:`, error);
        }
    }

    return Array.from(modifiedFiles);
}