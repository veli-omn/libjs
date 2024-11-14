import { debounce } from "../generic/debounce.js";


export class HideCursorHandler {
    node: HTMLElement;
    listenersAC!: AbortController;
    initialCursor: string;
    hideAction!: ReturnType<typeof debounce>;

    static eventsToListen: Array<string> = ["mousemove", "mousedown", "keydown"];

    constructor(node: HTMLElement) {
        this.node = node;
        this.initialCursor = node.style.cursor;
    }

    hide = (time: number = 2000): void => {
        this.listenersAC = new AbortController();
        this.hideAction = debounce((): void => {
            this.node.style.cursor = "none";
        }, time);

        for (const event of HideCursorHandler.eventsToListen) {
            this.node.addEventListener(event, (): void => {
                this.#show();
                this.hideAction.execute();
            }, { signal: this.listenersAC.signal });
        }

        this.hideAction.execute();
    }

    #show = (): void => {
        if ((typeof this.initialCursor === "string") && (this.node.style.cursor === "none")) {
            this.node.style.cursor = this.initialCursor;
        }
    }

    revert = (): void => {
        this.listenersAC?.abort();
        this.hideAction?.clear();
        this.#show();
    }
}