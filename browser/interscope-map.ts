const DB_NAME = "<im>";
const STORE_NAME = "index";
let databasePromise: Promise<IDBDatabase> | null = null;

function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror   = () => reject(request.error);
    });
}

function openDatabase(): Promise<IDBDatabase> {
    if (!databasePromise) {
        databasePromise = new Promise((resolve, reject) => {
            const openRequest = indexedDB.open(DB_NAME, 1);

            openRequest.onupgradeneeded = () => {
                openRequest.result.createObjectStore(STORE_NAME);
            };

            openRequest.onsuccess = () => {
                const database = openRequest.result;
                database.onversionchange = () => {
                    database.close();
                    databasePromise = null;
                };
                resolve(database);
            };

            openRequest.onerror = () => reject(openRequest.error);
        });
    }
    return databasePromise;
}

async function performStoreOperation<T>(
    mode: IDBTransactionMode,
    requestFactory: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
    const dbRequest = async (): Promise<T> => {
        const database = await openDatabase();
        const transaction = database.transaction(STORE_NAME, mode);
        const objectStore = transaction.objectStore(STORE_NAME);
        return promisifyRequest(requestFactory(objectStore));
    }

    try {
        return await dbRequest();
    } catch {
        // TODO: Might need to be handled in better way
        databasePromise = null;
        return await dbRequest();
    }
}

export const InterscopeMap = {
    set: (key: IDBValidKey, value: any) => performStoreOperation("readwrite", (store) => store.put(value, key)),
    get: (key: IDBValidKey) => performStoreOperation("readonly",  (store) => store.get(key)),
    delete: (key: IDBValidKey) => performStoreOperation("readwrite", (store) => store.delete(key)),
    clear: () => performStoreOperation("readwrite", (store) => store.clear())
};
