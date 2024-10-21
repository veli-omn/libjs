import { spawn } from "child_process";
import { ANSI } from "../generic/ansi.js";


export async function executeCommands(commands: Array<string>): Promise<void> {
    for (const command of commands) {
        await new Promise<void>((resolve, reject) => {
            console.log(ANSI.setColor("magenta", `Executing command: ${command}`));
            spawn(command, [], { shell: true, stdio: "inherit" })
                .on("close", (code) => {
                    console.log(ANSI.setColor("magenta", `Execution ended: ${code}`));
                    code !== 0 ? reject(`Failure while executing command: ${command}`) : resolve();
                });
        });
    }
}