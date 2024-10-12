import { ANSI } from "./ansi.js";


export function LOG(message: string | unknown, vars?: any, variant:  "log" | "error" | "warn" | "debug" = "log"): void {
    const now: Date = new Date;
    const timeString: string = ANSI.color.cyan + `|${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}| ` + ANSI.reset;
    let fullString: string = timeString;

    if (message) fullString += message;

    if (vars) {
        var varsString: Array<string> | string = [];
        const varsKeys: Array<string> = Object.keys(vars);

        for (let i = 0; i < varsKeys.length; i++) {
            const varName = varsKeys[i];
            let varValue = vars[varName];
            const varType = typeof varValue;

            if (typeof varValue === "object") {
                varValue = JSON.stringify(varValue);
            } else if (typeof varValue === "function") {
                varValue = varValue.toString();
            }

            varsString.push(`${varName} = ${varValue} > ${varType}`);
        }

        varsString = ` [${varsString.join(" | ")}]`;
        fullString += varsString;
    }

    console[variant](fullString);
}