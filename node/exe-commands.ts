import { spawn } from "node:child_process";
import { ANSI } from "../generic/ansi.js";
import { LOG } from "../generic/log.js";


export async function executeCommands(commands: Array<string>): Promise<void> {
    for (const command of commands) {
        await new Promise<void>((resolve, reject) => {
            LOG(`${ANSI.color.magenta}Executing command: ${command} ${ANSI.reset}`);
            const proc = spawn(command, [], { shell: true, stdio: "inherit" });

            proc.on("close", (code) => {
                LOG(`${ANSI.color.magenta}Execution ended: ${code} ${ANSI.reset}`);
                code !== 0 ? reject(`Failure while executing command`) : resolve();
            });
        });
    }
}