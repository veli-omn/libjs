export function convertENotationToDecimal(num: any): string {
    let [coefficient, exponent] = num.toString().split("e");

    coefficient = coefficient.replace(".", "");
    exponent = parseInt(exponent);

    if (exponent >= 0) {
        const decimalPlaces = coefficient.length - 1;
        const zerosToAdd = exponent - decimalPlaces;

        return zerosToAdd >= 0 ? coefficient + "0".repeat(zerosToAdd) : coefficient.slice(0, zerosToAdd) + "." + coefficient.slice(zerosToAdd);
    } else {
        return "0." + "0".repeat(Math.abs(exponent) - 1) + coefficient;
    }
}