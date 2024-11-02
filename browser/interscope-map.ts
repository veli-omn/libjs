const storeName: string = "entries";
let interscopeMapDB: IDBDatabase;

function wrapRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function initDB() {
    const openRequest: IDBOpenDBRequest = indexedDB.open("<interscope-map>");
    openRequest.onupgradeneeded = () => openRequest.result.createObjectStore(storeName);
    interscopeMapDB = await wrapRequest(openRequest);
}

function performOperation(operation: "set" | "get" | "delete" | "clear", key?: IDBValidKey, value?: unknown): Promise<IDBValidKey | undefined | unknown> {
    return new Promise(async (resolve, reject) => {
        try {
            if (!(interscopeMapDB instanceof IDBDatabase)) await initDB();

            const store = interscopeMapDB.transaction(storeName, operation !== "get" ? "readwrite" : "readonly").objectStore(storeName);
            let request: IDBRequest;

            switch (operation) {
                case "set":
                    request = store.put(value, key);
                    break;
                case "get":
                    request = store.get(key as IDBValidKey);
                    break;
                case "delete":
                    request = store.delete(key as IDBValidKey);
                    break;
                case "clear":
                    request = store.clear();
            }

            wrapRequest(request).then((result) => resolve(result)).catch((err) => reject(err));
        } catch (err) {
            reject(err);
        }
    });
}

export const InterscopeMap = {
    set: (key: IDBValidKey, value: unknown) => <Promise<IDBValidKey>> performOperation("set", key, value),
    get: (key: IDBValidKey) => <Promise<unknown>> performOperation("get", key),
    delete: (key: IDBValidKey) => <Promise<undefined>> performOperation("delete", key),
    clear: (): Promise<undefined>  => <Promise<undefined>> performOperation("clear")
};