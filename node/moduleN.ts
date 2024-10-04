// NODE.JS MODULE

import process from "node:process";
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import zlib from "node:zlib";
import crypto from "node:crypto";

import { concatArrayBuffers } from "../moduleA.js";

import type { BinaryToTextEncoding } from "node:crypto";

interface AnsiColor {
    [code: string]: string;
}

class Ansi {
    static ansiEscChar: string = "\x1b[";
    static reset: string = this.ansiEscChar + "0m";

    static color: AnsiColor = {
        cyan: this.ansiEscChar + "36m",
        blue: this.ansiEscChar + "34m",
        green: this.ansiEscChar + "32m",
        yellow: this.ansiEscChar + "33m",
        magenta: this.ansiEscChar + "35m",
        red: this.ansiEscChar + "31m",
        white: this.ansiEscChar + "37m",
        black: this.ansiEscChar + "30m"
    };

    static set(color: string, string: string): string {
        return `${this.color[color]}${string}${this.reset}`
    }
}

function incrementNumInBase(num: string, base = 36): string {
    let number: number = parseInt(num, base);
    number++;
    return number.toString(base);
}

type consoleVariant = "log" | "error" | "warn";

function LOG(message: string | unknown, vars?: any, variant: consoleVariant = "log"): void {
    const now: Date = new Date;
    const timeString: string = Ansi.color.cyan + `|${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}| ` + Ansi.reset;
    let fullString: string = timeString;

    if (message) fullString += message;

    if (vars) {
        var varsString: Array<string> | string = [];
        const varsKeys = Object.keys(vars);

        for (let i = 0; i < varsKeys.length; i++) {
            const varName = varsKeys[i];
            let varValue = vars[varName];
            const varType = typeof varValue;

            if (typeof varValue === "object") {
                varValue = JSON.stringify(varValue);
            } else if (typeof varValue === "function") {
                varValue = varValue.toString();
            }

            varsString.push(`${varName} = ${varValue} > ${varType}`);
        }

        varsString = ` [${varsString.join(" | ")}]`;
        fullString += varsString;
    }

    console[variant](fullString);
}


async function readFileData(filePath: string, encoding?: BufferEncoding): Promise<Buffer | string> {
    const data: Buffer | string = await fs.promises.readFile(filePath, { encoding });
    return data;
}


async function deleteDirectoryContents(dirPath: string): Promise<void> {
    try {
        await fs.promises.readdir(dirPath);
    } catch (error) {
        LOG(`Directory deletion failure: ${error}`, false, "error");
        return;
    }

    const deleteDir = async (dirPath: string): Promise<void> => {
        const files = await fs.promises.readdir(dirPath);

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = await fs.promises.stat(filePath);

            if (stats.isDirectory()) {
                await deleteDir(filePath);
                await fs.promises.rmdir(filePath);
            } else {
                await fs.promises.unlink(filePath);
            }
        }
    };

    await deleteDir(dirPath);
    LOG(`Deleted contents of directory: ${Ansi.set("cyan", dirPath)}`);
}


async function getHashOfArrayBuffer(buffer: ArrayBuffer, algorithm: string = "SHA-256"): Promise<ArrayBuffer> {
    return await crypto.subtle.digest(algorithm, buffer);
}


async function getFileHash(filePath: string, algorithm: string = "SHA-256"): Promise<ArrayBuffer> {
    return await getHashOfArrayBuffer(await readFileData(filePath) as ArrayBuffer, algorithm);
}


async function copyFile(srcPath: string, destPath: string): Promise<void> {
    await fs.promises.copyFile(srcPath, destPath);
}


async function copyDir(src: string, dest: string, exclude: Array<string> = [], isRootCall = true): Promise<number> {
    let filesCount: number = 0;

    const entries = await fs.promises.readdir(src, { withFileTypes: true });
    await fs.promises.mkdir(dest, { recursive: true }).catch(() => {});

    for (const entry of entries) {
        const srcPath: string = path.join(src, entry.name);
        const destPath: string = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            // Recursive call for directories with isRootCall set to false
            const copiedInSubdir: number = await copyDir(srcPath, destPath, exclude, false);
            filesCount += copiedInSubdir; // Add the count from the subdirectory
        } else if (entry.isFile() && !exclude.includes(path.extname(entry.name))) {
            await copyFile(srcPath, destPath);
            filesCount++;
        }
    }

    if (isRootCall){
        LOG(`Copied ${filesCount} files: ${Ansi.set("cyan", src)} -> ${Ansi.set("cyan", dest)}`);
    }

    return filesCount; // Return the count for use in recursive calls
}


async function syncDir(src: string, dest: string): Promise<void> {
    const operations = {
        filesToCopy: <Array<{ srcPath: string, destPath: string }>> [],
        filesToDelete: <Array<string>> [],
        dirsToCreate: <Array<string>> []
    };

    // Define a recursive function to populate operations
    const _coreFn = async (src: string, dest: string): Promise<void> => {
        const srcEntries = await fs.promises.readdir(src, { withFileTypes: true });

        // Get a list of files and directories in the destination directory
        const destEntries = await fs.promises.readdir(dest, { withFileTypes: true }).catch(() => []);
        const destFilesDirs: Set<string> = new Set(destEntries.map((entry) => entry.name));

        for (const entry of srcEntries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                // If the directory doesn't exist in dest, mark it for creation
                if (!destFilesDirs.has(entry.name)) {
                    operations.dirsToCreate.push(destPath);
                }
                // Recursively call _coreFn for subdirectories
                await _coreFn(srcPath, destPath);
            } else if (entry.isFile()) {
                const srcHash = await getFileHash(srcPath, "sha512").catch(() => null);
                const destHash = destFilesDirs.has(entry.name) ? await getFileHash(destPath, "sha512").catch(() => null) : null;

                if (srcHash !== destHash) {
                    operations.filesToCopy.push({ srcPath, destPath });
                }
            }
            destFilesDirs.delete(entry.name);
        }

        // Files and directories in dest that are not in src should be deleted
        for (const destEntry of destFilesDirs) {
            const destEntryPath = path.join(dest, destEntry);
            operations.filesToDelete.push(destEntryPath);
        }
    };

    await _coreFn(src, dest);

    // Create directories that don't exist in dest
    for (const dirPath of operations.dirsToCreate) {
        await fs.promises.mkdir(dirPath, { recursive: true }).catch(() => {});
    }

    // Delete files and directories that are not in src
    for (const filePath of operations.filesToDelete) {
        await fs.promises.rm(filePath, { recursive: true, force: true }).catch(() => {});
    }

    // Copy files with hash mismatch
    for (const { srcPath, destPath } of operations.filesToCopy) {
        await fs.promises.copyFile(srcPath, destPath).catch(() => {});
    }

    LOG(`Synchronized folders: ${Ansi.set("cyan", src)} -> ${Ansi.set("cyan", dest)} | copied: ${operations.filesToCopy.length} file${operations.filesToCopy.length !== 1 ? "s" : ""} | deleted: ${operations.filesToDelete.length} file${operations.filesToDelete.length !== 1 ? "s" : ""}`);
}


async function renameFile(filePath: string, newName: string): Promise<void> {
    try {
        const directory = path.dirname(filePath);
        const newPath = path.join(directory, newName);
        await fs.promises.rename(filePath, newPath);
        LOG(`File renamed: ${path.basename(filePath)} -> ${newName}`);
    } catch (error) {
        LOG(`${Ansi.color.red}Error renaming file: ${error}${Ansi.reset}`);
    }
}

// CLI Runner
async function executeCommands(commands: Array<string>): Promise<void> {
    for (const command of commands) {
        await new Promise<void>((resolve, reject) => {
            LOG(`${Ansi.color.magenta}Executing command: ${command} ${Ansi.reset}`);
            const proc = spawn(command, [], { shell: true, stdio: "inherit" });

            proc.on("close", (code) => {
                LOG(`${Ansi.color.magenta}Execution ended: ${code} ${Ansi.reset}`);
                code !== 0 ? reject(`Failure while executing command`) : resolve();
            });
        });
    }
}


// Ends with checker
// function endsWithMult(inputString, endsArray) {
//     for (const endSting of endsArray) {
//         if (inputString.endsWith(endSting)) return true;
//     }

//     return false;
// }


// Compressor
async function compressDirectory(dirPath: string, exclude: Array<string>, method: string, level: number, minRatio: number): Promise<void> {
    exclude = [".gz", ".br", ".def", ...exclude];

    const ct0: [number, number] = process.hrtime();
    let compressedFilesCount: number = 0;
    let notCompressed: Array<string> = [];

    const _coreFn = async (dirPath: string, exclude: Array<string>, method: string, level: number, minRatio: number) => {
        const files = await fs.promises.readdir(dirPath);

        const compressFile = async (filePath: string, method: string, level: number, minRatio: number) => {
            const fileContents: Buffer = await fs.promises.readFile(filePath);
            let compressedContents: undefined | Buffer;
            let extension: undefined | string;

            switch (method) {
                case "gzip":
                    compressedContents = zlib.gzipSync(fileContents, { level: level });
                    extension = "gz";
                    break;
                case "brotli":
                    compressedContents = zlib.brotliCompressSync(fileContents, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: level } });
                    extension = "br";
                    break;
                case "deflate":
                    compressedContents = zlib.deflateSync(fileContents, { level: level });
                    extension = "def";
                    break;
                default:
                    LOG(Ansi.set("cyan", `${Ansi.color.red}Unsupported compression method: ${method}`), false, "error");
                    return;
            }

            if (!minRatio || (compressedContents.length / fileContents.length) < minRatio) {
                await fs.promises.writeFile(`${filePath}.${extension}`, compressedContents);
                compressedFilesCount++;
            } else {
                notCompressed.push(filePath);
            }
        };

        for (const file of files) {
            const filePath: string = path.join(dirPath, file);
            const stats = await fs.promises.stat(filePath);

            if (stats.isDirectory()) {
                await _coreFn(filePath, exclude, method, level, minRatio);
            } else if (!(exclude.includes(path.extname(file)) || exclude.includes(file))) {
                await compressFile(filePath, method, level, minRatio);
            }
        }
    };

    await _coreFn(dirPath, exclude, method, level, minRatio);
    const cdiff = process.hrtime(ct0);
    LOG(`Compressed files (${method}): ${compressedFilesCount} (${cdiff[0]}.${cdiff[1]}s) | ${notCompressed.length > 0 ? `${Ansi.color.yellow}not compressed files / above min ratio: ${notCompressed.join(", ")}` : ""}`);
}


async function listFiles(dirPath: string = ".", exclude: Array<string> = []): Promise<{ listed: Array<string>, excluded: Array<string> }> {
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
                    const path = dirPath + "/" + item;

                    if (fs.lstatSync(path).isDirectory()) {
                        const subFiles = await listFilesInDir(path, exclude);

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


async function writeObjectToFile(object: object | string | number, filePath: string): Promise<boolean> {
    try {
        await fs.promises.writeFile(filePath, JSON.stringify(object));
        return true;
    } catch(err) {
        LOG(err, null,"error");

        return false;
    }
}


async function generateFileHashPairs(dirPath: string, filesList: Array<string>, algorithm: string = "SHA-256"): Promise<Array<[string, ArrayBuffer]>> {
    const fileHashPairs: Array<[string, ArrayBuffer]> = [];

    for (const file of filesList) {
        fileHashPairs.push([file, await getFileHash(dirPath + file, algorithm)]);
    }

    return fileHashPairs;
}



// async function deleteEmptyDirectories(dirPath) {
//     let deleted = [];

//     const _coreFn = async (dirPath) => {
//         const files = await fs.promises.readdir(dirPath);
//         // If the directory is empty, delete it
//         if (files.length === 0) {
//             await fs.promises.rmdir(dirPath);
//             deleted.push(dirPath);
//             return;
//         }

//         // Iterate through the files/directories in the current directory
//         for (const file of files) {
//             const filePath = path.join(dirPath, file);
//             const isDir = (await fs.promises.stat(filePath)).isDirectory();

//             if (isDir) {
//                 await _coreFn(filePath, false);
//             }
//         }

//         // Check if the directory is empty after deleting subdirectories
//         const remainingFiles = await fs.promises.readdir(dirPath);
//         if (remainingFiles.length === 0) {
//             await fs.promises.rmdir(dirPath);
//             deleted.push(dirPath);
//         }
//     };

//     await _coreFn(dirPath);

//     if (deleted.length > 0) {
//         LOG(`Deleted empty directories inside ${dirPath}: ${Ansi.color.yellow}${deleted}`);
//     } else {
//         LOG(`No empty directories found inside ${dirPath}`);
//     }
// }


// async function rebaseFileNames(dirPath, exclude) {
//     const listOfFiles = await listFiles(dirPath, exclude);
//     const renamedFilesMap = new Map();

//     for (let fileIndex = 0; fileIndex < listOfFiles.length; fileIndex++) {
//         const filePath = `/${listOfFiles[fileIndex]}`;
//         const newFilePath = `${path.dirname(filePath)}/${fileIndex.toString(32)}${path.extname(filePath)}`;

//         await fs.promises.rename("./" + dirPath + filePath, "./" + dirPath + newFilePath);
//         renamedFilesMap.set(filePath, newFilePath);
//     }

//     // if (fileIndex !== countOfFiles - 1) console.error("off by one error");

//     LOG(`Rebased file names: ${Ansi.set("cyan", dirPath)}`);

//     console.log(JSON.stringify(Array.from(renamedFilesMap.entries())))

//     return renamedFilesMap;
// }


// async function rebaseDir(dirPath, exclude) {
//     const maxFilesPerDir = 100;
//     const listOfFiles = await listFiles(dirPath, exclude);
//     const countOfFiles = listOfFiles.length;
//     const countOfDirs = countOfFiles % maxFilesPerDir >= 10 ? ((countOfFiles / maxFilesPerDir) >> 0) + 1 : (countOfFiles / maxFilesPerDir) >> 0;
//     const renamedFilesMap = new Map();

//     let fileIndex = 0;
//     let dirIndex = 0;

//     do {
//         const dirIndex32 = dirIndex.toString(32);
//         await fs.promises.mkdir(`${dirPath}/${dirIndex32}`);

//         for (let nthFile = 1; nthFile < maxFilesPerDir; nthFile++) {
//             const filePath = `/${listOfFiles[fileIndex]}`;
//             const newFilePath = `/${dirIndex32}/${fileIndex.toString(32)}${path.extname(filePath)}`;

//             await fs.promises.rename("./" + dirPath + filePath, "./" + dirPath + newFilePath);
//             renamedFilesMap.set(filePath, newFilePath);

//             if (fileIndex === countOfFiles - 1) break;

//             fileIndex++;
//         }

//         dirIndex++;
//     } while ((dirIndex < countOfDirs ) & (fileIndex < countOfFiles));

//     // if (fileIndex !== countOfFiles - 1) console.error("off by one error");

//     await deleteEmptyDirectories(dirPath);

//     LOG(`Rebased directory: ${Ansi.set("cyan", dirPath)}`);

//     console.log(JSON.stringify(Array.from(renamedFilesMap.entries())))

//     return renamedFilesMap;
// }


function getFilesRecursively(directory: string): Array<string> {
    let files = [];

    try {
        const entries = fs.readdirSync(directory, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                files.push(...getFilesRecursively(fullPath));
            } else {
                files.push(fullPath);
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${directory}:`, error);
    }

    return files;
}


function replaceStringsInFiles(filePaths: Array<string>, replacements: [string, string][]): unknown[] {
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


function trimEndlinesFromFile(filePath: string, keyword: string) {
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


async function generateMerkleRoot(hashes: Array<ArrayBuffer>, algorithm: string = "SHA-256"): Promise<ArrayBuffer> {
    if (hashes.length === 0) {
        throw new Error("Cannot generate Merkle root from zero length array");
    }

    while (hashes.length > 1) {
        const nextLevel: Array<ArrayBuffer> = [];

        for (let i = 0; i < hashes.length; i += 2) {
            const hash0: ArrayBuffer = hashes[i];
            const hash1: ArrayBuffer = hashes[i + 1] || hashes[i]; // If there's no pair for the last hash, duplicate it.
            const combinedHash: ArrayBuffer = await getHashOfArrayBuffer(concatArrayBuffers(hash0, hash1), algorithm);

            nextLevel.push(combinedHash);
        }

        hashes = nextLevel;
    }

    return hashes[0];
}

export {
    Ansi,
    incrementNumInBase,
    LOG,
    readFileData,
    deleteDirectoryContents,
    getFileHash,
    copyFile,
    copyDir,
    syncDir,
    renameFile,
    executeCommands,
    compressDirectory,
    listFiles,
    writeObjectToFile,
    generateFileHashPairs,
    // rebaseFileNames,
    // replaceStringsInFiles,
    trimEndlinesFromFile,
    getFilesRecursively,
    replaceStringsInFiles,
    generateMerkleRoot,
    getHashOfArrayBuffer
};