import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "@app/components/collection/collection";
import { updateWhenLocaleChanges } from "@lit/localize";
import "./book";
import { actor } from "@app/fsm";
import type { Book } from "@app/models";

@customElement("sx-books")
export class BookList extends LitElement {
    constructor() {
        super();
        updateWhenLocaleChanges(this);
    }

    @property({ type: Boolean })
    selectable = false;

    @property({ type: Boolean })
    filtered = false;

    @property({ type: Array })
    books: Book[] = [];

    private _create(e: CustomEvent) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("create", {
                bubbles: false,
                composed: true,
            })
        );
    }

    private _filter(e: CustomEvent) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("filter", {
                bubbles: false,
                detail: { filter: e.detail },
                composed: true,
            })
        );
    }

    private _save(e: CustomEvent) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("save", {
                bubbles: false,
                composed: true,
            })
        );
    }

    private _cancel(e: CustomEvent) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("cancel", {
                bubbles: false,
                composed: true,
            })
        );
    }

    render() {
        return html`<sx-collection
            @collection:add="${this._create}"
            @collection:filter="${this._filter}"
            @collection:save="${this._save}"
            @collection:cancel="${this._cancel}"
            ?add="${!this.selectable}"
            ?filtered="${this.filtered}"
            ?footer="${this.selectable}"
        >
            ${this.books.map(({ id, title, selected }) => {
                return this.selectable
                    ? html`<sx-book-select
                          id="${id!}"
                          title="${title}"
                          ?selected="${selected}"
                      ></sx-book-select>`
                    : html`<sx-book id="${id!}" title="${title}"></sx-book>`;
            })}
        </sx-collection>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-books": BookList;
    }
}
