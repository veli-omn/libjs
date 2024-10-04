// GENERIC MODULE

interface AnsiColor {
    [code: string]: string;
}

// ANSI
class Ansi {
    static ansiEscChar: string = "\x1b[";
    static reset: string = this.ansiEscChar + "0m";

    static color: AnsiColor = {
        cyan: this.ansiEscChar + "36m",
        blue: this.ansiEscChar + "34m",
        green: this.ansiEscChar + "32m",
        yellow: this.ansiEscChar + "33m",
        magenta: this.ansiEscChar + "35m",
        red: this.ansiEscChar + "31m",
        white: this.ansiEscChar + "37m",
        black: this.ansiEscChar + "30m"
    };

    static set(color: string, string: string): string {
        return `${this.color[color]}${string}${this.reset}`
    }
}


const deExpo = (num: number): string => {
    const numeral: string = num.toString();
    const eIX: number = numeral.indexOf("e");

    if (eIX !== -1) {
        const expo: number = parseInt(numeral.substring(eIX + 1));
        let base: string = numeral.substring(0, eIX);
        let decimalIX: number = base.indexOf(".");

        decimalIX !== -1 ? base = base.replace(".", "") : decimalIX = 0;

        if (expo > 0) {
            return base + "0".repeat(expo + decimalIX - base.length);
        } else {
            return "0." + "0".repeat(-expo - decimalIX) + base;
        }
    }

    return numeral;
};

function convertENotationToDecimal(num: any) {
    let [coefficient, exponent] = num.toString().split("e");
    coefficient = coefficient.replace(".", "");
    exponent = parseInt(exponent);
    if (exponent >= 0) {
        let decimalPlaces = coefficient.length - 1;
        let zerosToAdd = exponent - decimalPlaces;
        return zerosToAdd >= 0 ? coefficient + "0".repeat(zerosToAdd) : coefficient.slice(0, zerosToAdd) + "." + coefficient.slice(zerosToAdd);
    } else {
        return "0." + "0".repeat(Math.abs(exponent) - 1) + coefficient;
    }
}


function createDebounce(fn: Function, delay: number): { debounce: (...args: Array<any>) => void, clear: () => void } {
    let timer: number;

    const debounce = (...args: Array<any>): void => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };

    const clear = (): void => clearTimeout(timer);

    return { debounce, clear };
}


function nthFibonacci(n: number): BigInt {
    let a: bigint = 0n;
    let b: bigint = 1n;
    let c: bigint;

    if (n <= 0) return 0n;

    for (let i = 2; i <= n; i++) {
      c = a + b;
      a = b;
      b = c;
    }

    return b;
}


function factorial(n: number): bigint {
    let result: bigint = 1n;

    for (let i = 2n; i <= n; i++) {
        result *= i;
    }

    return result;
}


function getNumOfEachChar(string: string): Map<string, number> {
    const result: Map<string, number> = new Map();

    for (const char of string) {
        result.set(char, (result.get(char) || 0) + 1);
    }

    return result;
}



function endsWithMult(inputString: string, endsArray: Array<string>): boolean {
    for (const endSting of endsArray) {
        if (inputString.endsWith(endSting)) return true;
    }

    return false;
}



function incrementNumInBase(num: string, base = 32): string {
    let number: number = parseInt(num, base);
    number++;
    return number.toString(base);
}


const sleep = (duration: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, duration));


// class Loop {
//     constructor(frequencyHz, fn) {
//         this.frequencyHz = frequencyHz;
//         this.fn = fn;
//         this.loopID = null;
//     }

//     start() {
//         if (!this.loopID) this.loopID = setInterval(this.fn, 1000 / this.frequencyHz);
//     }

//     stop() {
//         if (this.loopID) {
//             clearInterval(this.loopID);
//             this.loopID = null;
//         }
//     }

//     changeFrequency(newFrequencyHz) {
//         this.frequencyHz = newFrequencyHz;

//         if (!!this.loopID) {
//             this.stop();
//             this.start()
//         }
//     }
// }


const getRandomBit = (): number => crypto.getRandomValues(new Uint8Array(1))[0] & 1;


function getRandomInt(min: number, max: number): number {
    const randomBuffer: Uint32Array = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);

    // Convert the random value to a decimal between 0 and 1
    let randomNumber: number = randomBuffer[0] / (0xffffffff + 1);

    // Adjust the range
    const adjustedMin: number = Math.ceil(min);
    const adjustedMax: number = Math.floor(max);

    // Calculate the final random number within the specified range
    const randomRange: number = adjustedMax - adjustedMin + 1;
    const randomOffset: number = Math.floor(randomNumber * randomRange);

    return adjustedMin + randomOffset;
}


// function divideArrayLengthToOffsets(arrayLen, n) {
//     const subarrayLength = Math.floor(arrayLen / n);
//     const remainder = arrayLen % n;

//     const result = [];
//     let start = 0;

//     for (let i = 0; i < n; i++) {
//         const end = start + subarrayLength + (i < remainder ? 1 : 0);
//         result.push([start, end]);
//         start = end;
//     }

//     return result;
// }


const getTwoPointsDist = (x1:number, y1:number, x2:number, y2:number): number => Math.hypot(x2 - x1, y2 - y1);


function* range(start: number, end: number, step: number = 1): Generator<number> {
    for (let i = start; i <= end; i += step) {
        yield i;
    }
}


class Singleton {
    static instance: any = null;

    protected constructor() {
        if ((this.constructor as any).instance) {
            throw new Error(`Singleton (class): an instance of "${this.constructor.name}" already exists, cannot create second instance`);
        }

        (this.constructor as any).instance = this;
    }
}

function createLogger(name: string) {
    return (type: "log" | "error" | "debug" |  "warn" | "info", ...args: Array<unknown>): void => console[type](`${name}:`, ...args);
}


function daysSince(formattedDate: string): number {
    const [day, month, year]: number[] = formattedDate.split("/").map((el) => parseInt(el));
    const date: Date = new Date(year, month - 1, day);
    const today: Date = new Date();
    const diff: number = today.valueOf() - date.valueOf();
    const daysPassed = Math.floor(diff / (1000 * 60 * 60 * 24));

    return daysPassed;
}


function timestampToTime(timestamp: number) {
    const time: Date = new Date(timestamp);

    return {
        day: time.getDate(),
        month: time.getMonth() + 1,
        year: time.getFullYear(),
        hour: time.getHours(),
        minutes: time.getMinutes(),
        seconds: time.getSeconds(),
        miliseconds: time.getMilliseconds()
    };
}


function roundUpToMultiple(number: number, multiple: number): number {
    return Math.ceil(number / multiple) * multiple;
}


function deepReplaceInArray(arr: Array<unknown>, searchValue: unknown, replaceValue: unknown, firstOnly: boolean = false): number {
    let replaced: number = 0;

    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            replaced += deepReplaceInArray(arr[i] as Array<unknown>, searchValue, replaceValue, firstOnly);

            if (firstOnly && replaced > 0) break;
        } else if (arr[i] === searchValue) {
            arr[i] = replaceValue;
            replaced++;

            if (firstOnly) break;
        }
    }

    return replaced;
}


function concatArrayBuffers(...bufs: Array<ArrayBuffer>): ArrayBuffer {
    let concatedLength: number = 0;

    for (const buf of bufs) {
        concatedLength += buf.byteLength;
    }

    const concatedUint8Array: Uint8Array = new Uint8Array(concatedLength);
    let offset: number = 0;

    for (const buf of bufs) {
        const buffersUint8View: Uint8Array = new Uint8Array(buf);

        concatedUint8Array.set(buffersUint8View, offset);
        offset += buffersUint8View.byteLength;
    }

    return concatedUint8Array.buffer;
}


function arraysAreEqual(array0: ArrayLike<unknown>, array1: ArrayLike<unknown>): boolean {
    if (array0.length !== array1.length) return false;

    for (let i = 0; i < array0.length; i++) {
        if (array0[i] !== array1[i]) return false;
    }

    return true;
}


function mapsAreEqual(map0: any, map1: any): boolean {
    if (map0.size !== map1.size) {
        return false;
    }

    for (const [file, hash] of map0) {
        if (map1.get(file) !== hash) {
            return false;
        }
    }

    return true;
}


function arrayBufferToHex(buffer: ArrayBuffer): string {
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, "0"))
        .join("");
}


export {
    Ansi,
    deExpo,
    createDebounce,
    nthFibonacci,
    factorial,
    getNumOfEachChar,
    incrementNumInBase,
    getRandomBit,
    getRandomInt,
    // Loop,
    sleep,
    // divideArrayLengthToOffsets,
    getTwoPointsDist,
    range,
    Singleton,
    createLogger,
    daysSince,
    timestampToTime,
    roundUpToMultiple,
    deepReplaceInArray,
    concatArrayBuffers,
    arraysAreEqual,
    arrayBufferToHex
};