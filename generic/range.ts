export function range(start: number, end: number, step: number = 1): Array<number> {
    let rangeArray: Array<number> = [];

    for (let i = start; i <= end; i += step) {
        rangeArray.push(i);
    }

    return rangeArray;
}