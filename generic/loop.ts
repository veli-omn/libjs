export class Loop {
    frequencyHz: number;
    fn: Function;
    loopID: number | null;

    constructor(frequencyHz: number, fn: Function) {
        this.frequencyHz = frequencyHz;
        this.fn = fn;
        this.loopID = null;
    }

    start(): void {
        if (!this.loopID) this.loopID = setInterval(this.fn, 1000 / this.frequencyHz);
    }

    stop(): void {
        if (this.loopID) {
            clearInterval(this.loopID);
            this.loopID = null;
        }
    }

    changeFrequency(newFrequencyHz: number): void {
        this.frequencyHz = newFrequencyHz;

        if (this.loopID) {
            this.stop();
            this.start();
        }
    }
}