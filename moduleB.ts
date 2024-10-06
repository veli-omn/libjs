// BROWSER MODULE

import {
    sleep,
    createDebounce,
    concatArrayBuffers
} from "./moduleA.js";

// Funkce na přepínání tříd elementů (inputArray = [[elementy1, [třída1, třída2, ...]], [elementy2, [třída3, třída4, ...]], ...])
// function elementsClassesToggle(inputArray: [][]) : void{
//     for (const elsClsses of inputArray) {
//         for (const element of document.querySelectorAll(elsClsses[0])) {
//             for (const clss of elsClsses[1]) {
//                 element.classList.toggle(clss);
//             }
//         }
//     }
// }


// Přehrát pozpátku animace na elementu
const reverseAnimations = (element: HTMLElement, speed: number): void => {
    for (const animation of element.getAnimations()) {
        animation.updatePlaybackRate(speed);
        animation.reverse();
    }
};


// Modal
// class Modal {
//     static {
//         window.modals = [];
//     }

//     constructor(dialogId, openEls, contentEl, openElIsContent, closeOnBackdropClick, closeSpeed = 2) {
//         this.isOpen = false;
//         this.dialogEl = document.getElementById(dialogId);
//         this.contentEl = contentEl;
//         this.closeOnBackdropClick = closeOnBackdropClick;
//         this.closeSpeed = closeSpeed;
//         window.modals.push(this);

//         this.dialogEl.addEventListener("cancel", (ev) => {
//             ev.preventDefault();
//             this.hide();
//         });

//         if (this.closeOnBackdropClick) {
//             this.dialogEl.addEventListener("mousedown", (ev) => {
//                 if (ev.target === this.dialogEl) this.hide();
//             });
//         }

//         if (openEls) {
//             document.querySelectorAll(openEls).forEach((el) => el.addEventListener("mousedown", () => {
//                 if (openElIsContent) this.contentEl = el;

//                 if (!this.isOpen) {
//                     this.show();
//                 } else {
//                     this.hide();
//                 }
//             }));
//         }
//     }

//     show() {
//         if (this.contentEl) this.dialogEl.appendChild(this.contentEl.cloneNode(true));

//         this.dialogEl.showModal();

//         this.dialogEl.addEventListener("animationend", () => {
//             this.isOpen = true;
//             this.dialogEl.dispatchEvent(new Event("opened", { bubbles: false, cancelable: false }));
//         }, { once: true });
//     }

//     hide() {
//         [this.dialogEl, this.dialogEl.children[0]].forEach((el) => reverseAnimations(el, this.closeSpeed));

//         this.dialogEl.addEventListener("animationend", () => {
//             if (this.contentEl) {
//                 this.dialogEl.replaceChildren();
//                 this.contentEl = false;
//             }

//             this.dialogEl.close();
//             this.isOpen = false;
//             this.dialogEl.dispatchEvent(new Event("closed", { bubbles: false, cancelable: false }));
//         }, { once: true });
//     }
// }


// Třída na vytvoření inline workera
class InlineWorker {
    constructor(code: string) {
        const workerBlobURL = URL.createObjectURL(new Blob([`(${code})();`], { type: "text/javascript" }));
        return new Worker(workerBlobURL);
    }
}


// Navigace
// const navAndOpen = (button, scrolTo, open) => {
//     document.querySelector(button).addEventListener("click", () => {
//         document.getElementById(scrolTo).scrollIntoView({ behavior: "smooth" });
//         if (open && !document.querySelector(open).checked) document.querySelector(open).click();
//     });
// };


// Zavření formůláře pří kliknutí mimo něj
// const clickedOutClose = (exclude, toClose) => {
//     toClose = document.querySelector(toClose);
//     toClose.addEventListener("change", () => {
//         if (toClose.checked) {
//             document.addEventListener("mousedown", (ev) => {
//                 if ([...document.querySelectorAll(exclude)].every((i) => !i.contains(ev.target))) {
//                     toClose.checked = false;
//                 }
//             });
//         }
//     });
// };


// class LocatinHash {
//     static read() {
//         return decodeURI(window.location.hash.substring(1));
//     }

//     static write(content) {
//         window.location.hash = content;
//     }
// }


// class MultipleClicksDetector {
//     constructor(element, clicksToDetect, callback) {
//         this.element = element;
//         this.clicksToDetect = clicksToDetect;
//         this.callback = callback;
//         this.clickCount = 0;
//         this.clickTimer = null;
//         this.listener = this.clickHandler.bind(this); // Bind the clickHandler method to the class instance
//         this.element.addEventListener("click", this.listener);
//     }

//     clickHandler(event) {
//         this.clickCount++;

//         if (this.clickCount === 1) {
//             this.clickTimer = setTimeout(() => this.clickCount = 0, 600);
//         } else if (this.clickCount === this.clicksToDetect) {
//             clearTimeout(this.clickTimer);
//             this.clickCount = 0;
//             this.callback(event); // Call the callback function
//         }
//     }

//     remove() {
//         this.element.removeEventListener("click", this.listener);
//         clearTimeout(this.clickTimer); // Clear any ongoing timeouts
//         this.clickCount = 0; // Reset the click count
//     }
// }

// class FullScreen {
//     static {
//         this.isOn = false;

//         document.addEventListener("fullscreenchange", () => {
//             if (document.fullscreenElement) {
//                 this.isOn = true;
//             } else {
//                 this.isOn = false;
//             }
//         });
//     }

//     static async toggle() {
//         try {
//             if (!document.fullscreenElement) {
//                 await document.documentElement.requestFullscreen("hide");
//             } else if (document.exitFullscreen) {
//                 await document.exitFullscreen();
//             }
//         } catch (err) {
//             console.debug(`Toggle Full Screen: ${err}`);
//         }
//     }
// }


// const fetchAlt = async (url, options) => await fetch(url, { cache: "no-store", ...options });


// class ScreenWakeLock {
//     static {
//         this.wakeLock = null;
//         this.intervalID = null;

//         if (!("wakeLock" in navigator)) {
//             console.debug("Screen Wake Lock is not in navigator");
//             this.wakeLockInNavigator = false;
//         } else {
//             this.wakeLockInNavigator = true;
//         }
//     }

//     static async request() {
//         if (!this.wakeLockInNavigator) return;

//         this.isOn = true;

//         if (this.wakeLock === null || this.wakeLock?.released) {
//             this.intervalID = setInterval(async () => {
//                 try {
//                     await sleep(100);

//                     if (document.visibilityState !== "hidden") {
//                         this.wakeLock = await navigator.wakeLock.request("screen");
//                         clearInterval(this.intervalID);

//                         this.wakeLock.addEventListener("release", () => {
//                             if (this.isOn) this.request();
//                         }, { once: true });
//                     }
//                 } catch (err) {
//                     console.debug(`Failed to acquire Screen Wake Lock: ${err}`);
//                 }
//             }, 4000);
//         }
//     }

//     static async release() {
//         if (!this.wakeLockInNavigator) return;

//         this.isOn = false;

//         if ((this.wakeLock !== null) && !this.wakeLock?.released) {
//             try {
//                 await this.wakeLock.release();
//             } catch (err) {
//                 console.debug(`Failed to release Screen Wake Lock: ${err}`);
//             }
//         }
//     }
// }


// function getTime() {
//     const now = new Date;
//     const time = {
//         hours: now.getHours(),
//         minutes: now.getMinutes(),
//         seconds: now.getSeconds(),
//         miliseconds: now.getMilliseconds()
//     }

//     return time;
// }


class SwipeDetector {
    element: HTMLElement;
    callback: (direction: { direction: string }) => void;
    startX: number;
    startY: number;
    deltaMin: number;

    constructor(element: HTMLElement, callback: (direction: { direction: string }) => void, deltaMin: number = 30) {
        this.element = element;
        this.callback = callback;
        this.startX = 0;
        this.startY = 0;
        this.deltaMin = deltaMin;
        this.element.addEventListener("touchstart", this.handleTouchStart, { passive: true });
        this.element.addEventListener("touchend", this.handleTouchEnd, { passive: true });
    }

    handleTouchStart = (event: TouchEvent): void => {
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;
    }

    handleTouchEnd = (event: TouchEvent): void => {
        const endX = event.changedTouches[0].clientX;
        const endY = event.changedTouches[0].clientY;
        const deltaX = endX - this.startX;
        const deltaY = endY - this.startY;
        const deltaXAbs = Math.abs(deltaX);
        const deltaYAbs = Math.abs(deltaY);

        // console.log(`deltaX: ${deltaX}`)
        // console.log(`deltaY: ${deltaY}`)

        if (deltaXAbs < this.deltaMin && deltaYAbs < this.deltaMin) return;

        const direction: "right" | "left" | "down" | "up" =
            deltaXAbs > deltaYAbs ?
            deltaX > 0 ? "right" : "left" :
            deltaY > 0 ? "down" : "up";

        this.callback({ direction });
    }

    remove(): void {
        this.element.removeEventListener("touchstart", this.handleTouchStart);
        this.element.removeEventListener("touchend", this.handleTouchEnd);
    }
}


class HideCursorHandler {
    node: HTMLElement;
    hideCursor;
    listenersAC: AbortController;
    initialCursor?: string;

    static eventsToListen: string[] = ["mousemove", "mousedown", "keydown"];

    constructor(node: HTMLElement, time: number = 2000) {
        this.node = node;
        this.listenersAC = new AbortController();

        this.hideCursor = createDebounce((): void => {
            this.initialCursor = node.style.cursor;
            this.node.style.cursor = "none";

            for (const event of HideCursorHandler.eventsToListen) {
                this.node?.addEventListener(event, (): void => this.revertCursor(), { once: true, signal: this.listenersAC.signal });
            }
        }, time);

        for (const event of HideCursorHandler.eventsToListen) {
            this.node?.addEventListener(event, (): void => this.hideCursor.debounce(), { signal: this.listenersAC.signal });
        }

        this.hideCursor.debounce();
    }

    revertCursor = (): void => {
        if ((typeof this.initialCursor === "string") && (this.node.style.cursor === "none")) {
            this.node.style.cursor = this.initialCursor;
        }
    }

    remove(): void {
        this.listenersAC.abort();
        this.hideCursor.clear();
        this.revertCursor();
    }
}


class ScreenWakeLock {
    static wakeLock: null | WakeLockSentinel = null;
    static intervalID: undefined | number;
    static wakeLockInNavigator: boolean = false;
    static isOn: boolean = false;

    static {
        if (!("wakeLock" in navigator)) {
            console.debug("Screen Wake Lock: not supported");
        } else {
            this.wakeLockInNavigator = true;
        }
    }

    static async request(): Promise<void> {
        if (!this.wakeLockInNavigator) return;

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
                    console.debug(`Screen Wake Lock: failed to acquire screen wake lock |`, err);
                }
            }, 4000);
        }
    }

    static async release(): Promise<void> {
        if (!this.wakeLockInNavigator) return;

        this.isOn = false;

        if ((this.wakeLock !== null) && !this.wakeLock?.released) {
            try {
                await this.wakeLock.release();
            } catch (err) {
                console.debug(`Screen Wake Lock: failed to release screen wake lock |`, err);
            }
        }
    }
}


const STORAGE = {
    local: {
        get(name: string): unknown {
            const item = localStorage.getItem(name);

            try {
                return item ? JSON.parse(item) : null;
            } catch {
                return item;
            }
        },

        set(name: string, data: any): void {
            try {
                localStorage.setItem(name, JSON.stringify(data));
            } catch {
                localStorage.setItem(name, data);
            }
        },

        remove: (name: string): void => localStorage.removeItem(name)
    },

    session: {
        get(name: string): unknown {
            const item = sessionStorage.getItem(name);

            try {
                return item ? JSON.parse(item) : null;
            } catch {
                return item;
            }
        },

        set(name: string, data: any): void {
            try {
                sessionStorage.setItem(name, JSON.stringify(data));
            } catch {
                sessionStorage.setItem(name, data);
            }
        },

        remove: (name:string): void => sessionStorage.removeItem(name)
    }
}


async function getHashOfArrayBuffer(buffer: ArrayBuffer, algorithm: AlgorithmIdentifier = "SHA-256"): Promise<ArrayBuffer> {
    return await crypto.subtle.digest(algorithm, buffer);
}


async function getResponseHash(response: Response, algorithm: string = "SHA-256"): Promise<ArrayBuffer> {
    if (!(response instanceof Response)) throw new Error("failed to get hash of response: invalid response object");

    const responseCloneBuffer: ArrayBuffer = await response.clone().arrayBuffer();
    const hashBuffer: ArrayBuffer = await getHashOfArrayBuffer(responseCloneBuffer, algorithm);

    return hashBuffer;
}


async function generateMerkleRoot(hashes: Array<ArrayBuffer>, algorithm: AlgorithmIdentifier = "SHA-256"): Promise<ArrayBuffer> {
    if (hashes.length === 0) {
        throw new Error("Cannot generate Merkle root from zero length array");
    }

    while (hashes.length > 1) {
        const nextLevel: Array<ArrayBuffer> = [];

        for (let i = 0; i < hashes.length; i += 2) {
            const hash0: ArrayBuffer = hashes[i];
            const hash1: ArrayBuffer = hashes[i + 1] || hashes[i]; // If there's no pair for the last hash, duplicate it.
            const combinedHash: ArrayBuffer = await getHashOfArrayBuffer(concatArrayBuffers(hash0, hash1), algorithm);

            nextLevel.push(combinedHash);
        }

        hashes = nextLevel;
    }

    return hashes[0];
}


export {
    // elementsClassesToggle,
    reverseAnimations,
    // Modal,
    InlineWorker,
    // navAndOpen,
    // clickedOutClose,
    SwipeDetector,
    ScreenWakeLock,
    STORAGE,
    HideCursorHandler,
    getHashOfArrayBuffer,
    getResponseHash,
    generateMerkleRoot
};