export function incNumInBase(num: string, base = 32): string {
    let number: number = parseInt(num, base);
    number++;
    return number.toString(base);
}
