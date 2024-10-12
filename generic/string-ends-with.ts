export function stringEndsWith(input: string, ...ends: Array<string>): boolean {
    for (const endSting of ends) {
        if (input.endsWith(endSting)) return true;
    }

    return false;
}