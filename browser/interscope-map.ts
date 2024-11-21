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

async function getStore(mode: IDBTransactionMode = "readwrite"): Promise<IDBObjectStore> {
    if (!interscopeMapDB) await initDB();
    return interscopeMapDB.transaction(storeName, mode).objectStore(storeName);
}

export const InterscopeMap = {
    set: async (key: IDBValidKey, value: any): Promise<IDBValidKey> => wrapRequest((await getStore()).put(value, key)),
    get: async (key: IDBValidKey): Promise<any> => wrapRequest((await getStore("readonly")).get(key)),
    delete: async (key: IDBValidKey): Promise<undefined> => wrapRequest((await getStore()).delete(key)),
    clear: async (): Promise<undefined> => wrapRequest((await getStore()).clear())
};