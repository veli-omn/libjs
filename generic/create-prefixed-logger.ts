export function createPrefixedLogger(...prefixes: Array<unknown | (() => unknown)>) {
    return (type: "log" | "error" | "debug" |  "warn" | "info", ...args: Array<unknown>): void => {
        const evaluatedPrefixes = prefixes.map((prefix) => typeof prefix === "function" ? prefix() : prefix);
        console[type](...evaluatedPrefixes, ...args);
    };
}
