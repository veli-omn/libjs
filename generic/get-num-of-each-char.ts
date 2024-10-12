export function getNumOfEachChar(string: string): Map<string, number> {
    const result: Map<string, number> = new Map();

    for (const char of string) {
        result.set(char, (result.get(char) || 0) + 1);
    }

    return result;
}