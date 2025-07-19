export function getNthFibonacci(n: number): bigint {
    let a: bigint = 0n;
    let b: bigint = 1n;
    let c: bigint;

    if (n <= 0) {
        return 0n;
    }

    for (let i = 2n; i <= n; i++) {
        c = a + b;
        a = b;
        b = c;
    }

    return b;
}
