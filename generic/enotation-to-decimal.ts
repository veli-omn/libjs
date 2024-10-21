export function eNotationToDecimal(num: number): string {
    const parsedNumber: Array<string> = num.toString().split("e");

    if (parsedNumber.length === 1) {
        return parsedNumber[0];
    }

    const sign: string = parsedNumber[0][0] === "-" ? "-" : "";
    const coefficient: string = parsedNumber[0].replace("-", "").replace(".", "");
    const exponentValue: number = parseInt(parsedNumber[1]);
    const decimalPlaces: number = (parsedNumber[0].split(".")[1] || "").length;

    if (exponentValue >= 0) {
        const zerosToAdd: number = exponentValue - (coefficient.length - decimalPlaces);
        return sign + (zerosToAdd >= 0 ? coefficient + "0".repeat(zerosToAdd) : coefficient.slice(0, exponentValue + 1) + "." + coefficient.slice(exponentValue + 1));
    } else {
        const zerosToAdd: number = Math.abs(exponentValue) - 1;
        const leadingZeros: string = "0".repeat(zerosToAdd);
        return sign + "0." + leadingZeros + coefficient;
    }
}