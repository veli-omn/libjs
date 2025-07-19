export function deepReplaceInArray(
    arr: Array<unknown>,
    searchValue: unknown,
    replaceValue: unknown,
    firstOnly: boolean = false
): number {
    let replaced: number = 0;

    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            replaced += deepReplaceInArray(arr[i] as Array<unknown>, searchValue, replaceValue, firstOnly);

            if (firstOnly && replaced > 0) {
                break;
            }
        } else if (arr[i] === searchValue) {
            arr[i] = replaceValue;
            replaced++;

            if (firstOnly) {
                break;
            }
        }
    }

    return replaced;
}
