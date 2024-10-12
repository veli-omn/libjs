export function mapsAreEqual(map0: Map<unknown, unknown>, map1: Map<unknown, unknown>): boolean {
    if (map0.size !== map1.size) {
        return false;
    }

    for (const [key, value] of map0) {
        if (map1.get(key) !== value) {
            return false;
        }
    }

    return true;
}