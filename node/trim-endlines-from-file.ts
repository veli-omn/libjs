import fs from "node:fs";
import path from "node:path";
import { LOG } from "../generic/log.js";


export function trimEndlinesFromFile(filePath: string, keyword: string) {
    const inputText = fs.readFileSync(filePath, "utf8");
    let result = "";

    const lines = inputText.split("\n");

    for (const line of lines) {
        // If the line contains the keyword, remove the part from the keyword to the end
        // and check if the resulting line is not empty before adding to the result
        const trimmedLine = line.includes(keyword) ? line.substring(0, line.indexOf(keyword)) : line;

        if (trimmedLine.trim() !== "") {
            result += trimmedLine + "\n";
        }
    }

    // Remove the last newline character from the result
    result = result.trimEnd();

    fs.writeFileSync(filePath, result, "utf8");

    LOG(`Trimmed endlines from file: ${path.basename(filePath)} [keyword: ${keyword}]`);
}