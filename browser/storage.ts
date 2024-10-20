type StorageVariant = "localStorage" | "sessionStorage";

const logError = (variant: StorageVariant, operation: "set" | "get", err: unknown) => console.log(`STORAGE failure: <${variant.slice(0,-7)}/${operation}>`, err);

function storageSet(variant: StorageVariant, key: string, data: string): boolean {
    let setStatus: boolean = true;

    try {
        window[variant].setItem(key, JSON.stringify(data));
    } catch (err) {
        logError(variant, "set", err);
        setStatus = false;
    }

    return setStatus;
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
    set: (key: string, data: string) => storageSet(variant, key, data),
    get: (key: string) => storageGet(variant, key),
    remove: (key: string) => window[variant].removeItem(key)
});

export const STORAGE = {
    local: createStorageMethods("localStorage"),
    session: createStorageMethods("sessionStorage")
};