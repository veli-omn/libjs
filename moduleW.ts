// WORKER MODULE

// class InlineWorker {
//     constructor(code) {
//         const workerBlobURL = URL.createObjectURL(new Blob([`(${code})();`], { type: "text/javascript" }));
//         return new Worker(workerBlobURL);
//     }
// }


// async function genCacheKeysNamesHash(cacheName) {
//     const stringOfURLs = (await (await caches.open(cacheName)).keys()).reduce((string, key) => string + key.url, "");
//     let hash = 0;

//     for (let i = 0; i < stringOfURLs.length; i++) {
//         hash = (hash << 5) - hash + stringOfURLs.charCodeAt(i);
//         hash |= 0;
//     }

//     return hash.toString(32);
// }




// class Loop {
//     constructor(frequencyHz, fn) {
//         this.frequencyHz = frequencyHz;
//         this.fn = fn;
//         this.timeoutId = null;
//         this.running = false;
//     }

//     start() {
//         if (!this.running) {
//             this.running = true;
//             const loop = () => {
//                 if (this.running) {
//                     this.fn();
//                     this.timeoutId = setTimeout(loop, 1000 / this.frequencyHz);
//                 }
//             };
//             loop();
//         }
//     }

//     stop() {
//         if (this.running) {
//             clearTimeout(this.timeoutId);
//             this.running = false;
//             this.timeoutId = null;
//         }
//     }

//     changeFrequency(newFrequencyHz) {
//         this.frequencyHz = newFrequencyHz;
//         if (this.running) {
//             this.stop();
//             this.start();
//         }
//     }
// }


export {
    // InlineWorker,
    // genCacheKeysNamesHash
};