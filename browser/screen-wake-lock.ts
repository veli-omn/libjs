import { sleep } from "../generic/sleep.js"


export const ScreenWakeLock = {
    wakeLock: <WakeLockSentinel | null> null,
    intervalID: <number> 0,
    inNavigator: <boolean> ("wakeLock" in navigator),
    isOn: <boolean> false,

    async request(): Promise<void> {
        if (!this.inNavigator) return;

        this.isOn = true;

        if (this.wakeLock === null || this.wakeLock?.released) {
            this.intervalID = setInterval(async () => {
                try {
                    await sleep(100);

                    if (document.visibilityState !== "hidden") {
                        this.wakeLock = await navigator.wakeLock.request("screen");
                        clearInterval(this.intervalID);

                        this.wakeLock.addEventListener("release", () => {
                            if (this.isOn) {
                                this.request();
                            }
                        }, { once: true });
                    }
                } catch (err) {
                    console.debug(`Screen Wake Lock: failed to acquire |`, err);
                }
            }, 4000);
        }
    },

    async release(): Promise<void> {
        if (!this.inNavigator) return;

        this.isOn = false;

        if ((this.wakeLock !== null) && !this.wakeLock?.released) {
            try {
                await this.wakeLock?.release();
            } catch (err) {
                console.debug(`Screen Wake Lock: failed to release |`, err);
            }
        }
    }
}

if (!ScreenWakeLock.inNavigator) {
    console.debug("Screen Wake Lock: not supported");
}