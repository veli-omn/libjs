export function arraysAreEqual(array0: ArrayLike<unknown> | ArrayBuffer, array1: ArrayLike<unknown> | ArrayBuffer): boolean {
    if (array0 instanceof ArrayBuffer) array0 = new Uint8Array(array0);
    if (array1 instanceof ArrayBuffer) array1 = new Uint8Array(array1);

    if ((array0 as ArrayLike<unknown>).length !== (array1 as ArrayLike<unknown>).length) return false;

    for (let i = 0; i < (array0 as ArrayLike<unknown>).length; i++) {
        if ((array0 as ArrayLike<unknown>)[i] !== (array1 as ArrayLike<unknown>)[i]) return false;
    }

    return true;
}