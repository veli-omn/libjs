export class Loop {
    frequencyHz: number;
    timerID: number;
    fn: Function;

    constructor(frequencyHz: number, fn: Function) {
        this.frequencyHz = frequencyHz;
        this.fn = fn;
        this.timerID = 0;
    }

    start(): void {
        if (this.timerID === 0) {
            this.timerID = setInterval(this.fn, 1000 / this.frequencyHz);
        }
    }

    stop(): void {
        if (this.timerID > 0) {
            clearInterval(this.timerID);
            this.timerID = 0;
        }
    }

    changeFrequency(newFrequencyHz: number): void {
        this.frequencyHz = newFrequencyHz;

        if (this.timerID) {
            this.stop();
            this.start();
        }
    }
}