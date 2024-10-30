function wrapRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

const openRequest: IDBOpenDBRequest = indexedDB.open("<interscope-map>");
const storeName: string = "entries";
let interscopeMapDB: IDBDatabase;

openRequest.onupgradeneeded = () => openRequest.result.createObjectStore(storeName);
wrapRequest(openRequest).then((db) => interscopeMapDB = db);

function getStore(mode: IDBTransactionMode = "readwrite"): IDBObjectStore {
    return interscopeMapDB.transaction(storeName, mode).objectStore(storeName);
}

export const InterscopeMap = {
    set: (key: IDBValidKey, value: unknown): Promise<IDBValidKey> => wrapRequest(getStore().put(value, key)),
    get: (key: IDBValidKey): Promise<unknown> => wrapRequest(getStore("readonly").get(key)),
    delete: (key: IDBValidKey): Promise<undefined> => wrapRequest(getStore().delete(key)),
    clear: (): Promise<undefined> => wrapRequest(getStore().clear())
};