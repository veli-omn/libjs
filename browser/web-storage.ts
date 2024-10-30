type StorageVariant = "localStorage" | "sessionStorage";

const logError = (variant: StorageVariant, operation: "set" | "get", err: unknown) => console.log(`STORAGE failure <${variant.slice(0,-7)}/${operation}>`, err);

function storageSet(variant: StorageVariant, key: string, data: unknown): boolean {
    let executionStatus: boolean = false;

    try {
        window[variant].setItem(key, JSON.stringify(data));
        executionStatus = true;
    } catch (err) {
        logError(variant, "set", err);
    }

    return executionStatus;
}

function storageGet(variant: StorageVariant, key: string): unknown {
    const item: string | null = window[variant].getItem(key);

    try {
        const parsed: unknown = item ? JSON.parse(item) : null;
        return parsed;
    } catch (err) {
        logError(variant, "get", err);
        return null;
    }
}

const createStorageMethods = (variant: StorageVariant) => ({
    set: (key: string, data: unknown) => storageSet(variant, key, data),
    get: (key: string) => storageGet(variant, key),
    remove: (key: string) => window[variant].removeItem(key)
});

export const WebStorage = {
    local: createStorageMethods("localStorage"),
    session: createStorageMethods("sessionStorage")
};