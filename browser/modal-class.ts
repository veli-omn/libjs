import { reverseAnimations } from "./reverse-animations.js"

// TODO: Refactore this class.

export class Modal {
    isOpen: boolean;
    dialogEl: HTMLElement | null;
    contentEl: HTMLElement;

    static {
        window.modals = [];
    }

    constructor(dialogId, openEls, contentEl, openElIsContent, closeOnBackdropClick, closeSpeed = 2) {
        this.isOpen = false;
        this.dialogEl = document.getElementById(dialogId);
        this.contentEl = contentEl;
        this.closeOnBackdropClick = closeOnBackdropClick;
        this.closeSpeed = closeSpeed;
        window.modals.push(this);

        this.dialogEl.addEventListener("cancel", (ev) => {
            ev.preventDefault();
            this.hide();
        });

        if (this.closeOnBackdropClick) {
            this.dialogEl.addEventListener("mousedown", (ev) => {
                if (ev.target === this.dialogEl) this.hide();
            });
        }

        if (openEls) {
            document.querySelectorAll(openEls).forEach((el) => el.addEventListener("mousedown", () => {
                if (openElIsContent) this.contentEl = el;

                if (!this.isOpen) {
                    this.show();
                } else {
                    this.hide();
                }
            }));
        }
    }

    show() {
        if (this.contentEl) this.dialogEl.appendChild(this.contentEl.cloneNode(true));

        this.dialogEl.showModal();

        this.dialogEl.addEventListener("animationend", () => {
            this.isOpen = true;
            this.dialogEl.dispatchEvent(new Event("opened", { bubbles: false, cancelable: false }));
        }, { once: true });
    }

    hide() {
        [this.dialogEl, this.dialogEl.children[0]].forEach((el) => reverseAnimations(el, this.closeSpeed));

        this.dialogEl.addEventListener("animationend", () => {
            if (this.contentEl) {
                this.dialogEl.replaceChildren();
                this.contentEl = false;
            }

            this.dialogEl.close();
            this.isOpen = false;
            this.dialogEl.dispatchEvent(new Event("closed", { bubbles: false, cancelable: false }));
        }, { once: true });
    }
}