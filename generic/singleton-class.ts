export class Singleton {
    static instance: any = null;

    protected constructor() {
        if ((this.constructor as any).instance) {
            throw new Error(`Singleton (class): an instance of "${this.constructor.name}" already exists, cannot create second instance`);
        }

        (this.constructor as any).instance = this;
    }
}