export function factorial(n: number): bigint {
    let result: bigint = 1n;

    for (let i = 2n; i <= n; i++) {
        result *= i;
    }

    return result;
}