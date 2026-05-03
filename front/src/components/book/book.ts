import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import iconDelete from "@app/images/clear_24dp_000000.svg";
import type { Book } from "@app/models";

@customElement("sx-book")
export class BookItem extends LitElement implements Partial<Book> {
    static styles = css`
        .sx-book {
            display: grid;
            grid-template-columns: 1fr auto;
            padding: 0 1em;
            height: var(--view-header-height);
            align-items: center;
        }
        .sx-book * {
            cursor: pointer;
        }
        .sx-book:hover {
            background-color: var(--detail-background-color);
            color: var(--detail-color);
        }
    `;

    @property()
    id!: string;

    @property()
    title = "";

    private _click(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("edit", {
                bubbles: true,
                detail: { id: this.id },
                composed: true,
            })
        );
    }

    private _remove(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("remove", {
                bubbles: true,
                detail: { id: this.id },
                composed: true,
            })
        );
    }

    render() {
        return html`<div class="sx-book">
            <label @click="${this._click}">${this.title}</label>
            <img src="${iconDelete}" @click="${this._remove}" />
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-book": BookItem;
    }
}
