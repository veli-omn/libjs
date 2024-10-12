const ansiEscChar: string = "\x1b[";

export const ANSI = {
    ansiEscChar: <string> ansiEscChar,
    reset: <string> ansiEscChar + "0m",

    color: <{ [code: string]: string }> {
        cyan: ansiEscChar + "36m",
        blue: ansiEscChar + "34m",
        green: ansiEscChar + "32m",
        yellow: ansiEscChar + "33m",
        magenta: ansiEscChar + "35m",
        red: ansiEscChar + "31m",
        white: ansiEscChar + "37m",
        black: ansiEscChar + "30m"
    },

    set(color: string, string: string): string {
        return `${this.color[color]}${string}${this.reset}`
    }
}