import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Book } from "@app/models";
import iconDelete from "@app/images/clear_24dp_000000.svg";

@customElement("sx-book-detail")
export class BookDetail extends LitElement implements Partial<Book> {
    static styles = css`
        .sx-book-detail {
            display: flex;
            align-items: center;
            gap: 0.5em;
            float: left;
            padding: 0.5em;
            margin: 0.5em 0.25em 0.25em;
            background-color: var(--detail-background-color);
            color: var(--detail-color);
        }
        .sx-book-detail * {
            cursor: pointer;
        }
    `;

    @property()
    id = "";

    @property()
    name = "";

    private _select(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("edit", {
                bubbles: false,
                composed: true,
                detail: {
                    id: this.id,
                },
            })
        );
    }

    private _remove(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("remove", {
                bubbles: false,
                detail: { id: this.id },
                composed: true,
            })
        );
    }

    render() {
        return html`<div class="sx-book-detail" @click="${this._select}">
            <label>${this.name}</label>
            <img src="${iconDelete}" @click="${this._remove}" />
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-book-detail": BookDetail;
    }
}
