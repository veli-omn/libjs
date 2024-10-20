const ansiEscChar = "\x1b[";
const ansiColors = {
    cyan: ansiEscChar + "36m",
    blue: ansiEscChar + "34m",
    green: ansiEscChar + "32m",
    yellow: ansiEscChar + "33m",
    magenta: ansiEscChar + "35m",
    red: ansiEscChar + "31m",
    white: ansiEscChar + "37m",
    black: ansiEscChar + "30m"
}

export const ANSI = {
    escChar: ansiEscChar,
    reset: ansiEscChar + "0m",
    color: ansiColors,

    setColor(color: keyof typeof ansiColors, string: string) {
        return `${ANSI.color[color]}${string}${ANSI.reset}`;
    }
};