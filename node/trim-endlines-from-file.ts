import fs from "fs";


export function trimEndlinesFromFile(filePath: string, keyword: string): boolean {
    let executionStatus: boolean = false;
    let result: string = "";

    try {
        const inputText: string = fs.readFileSync(filePath, "utf8");
        const lines: Array<string> = inputText.split("\n");

        for (const line of lines) {
            // If the line contains the keyword, remove the part from the keyword to the end
            // and check if the resulting line is not empty before adding to the result
            const trimmedLine : string= line.includes(keyword) ? line.substring(0, line.indexOf(keyword)) : line;

            if (trimmedLine.trim() !== "") {
                result += trimmedLine + "\n";
            }
        }

        // Remove the last newline character from the result
        result = result.trimEnd();

        fs.writeFileSync(filePath, result, "utf8");
        executionStatus = true;
    } catch (err) {
        console.error(err);
    }

    return executionStatus;
}