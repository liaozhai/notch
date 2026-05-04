import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { msg, updateWhenLocaleChanges } from "@lit/localize";
import "@app/components/collection";
import "@app/components/book";
import type { Tag, Book } from "@app/models";

@customElement("sx-tag-edit")
export class TagEdit extends LitElement implements Tag {
    constructor() {
        super();
        updateWhenLocaleChanges(this);
    }

    static styles = css`
        .sx-tag-edit {
            display: grid;
            grid-template-rows: auto 1fr auto;
            height: 100%;
        }
        .sx-tag-edit-header,
        .sx-tag-edit-footer {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sx-tag-edit-header {
            height: var(--view-header-height);
            color: var(--view-header-color);
            background-color: var(--view-header-background-color);
            font-weight: var(--view-header-font-weight);
        }
        .sx-tag-edit-footer {
            gap: 0.5em;
            height: var(--view-footer-height);
        }
        .sx-tag-edit-content {
            display: grid;
            grid-template-columns: auto 1fr;
            grid-template-rows: repeat(3, auto) 1fr;
            gap: 1em;
            padding: 1em;
            align-content: start;
        }
        label {
            width: var(--label-width);
        }
        textarea,
        input {
            font-size: 1rem;
            padding: 0.5em;
            border: var(--border);
            font-family: var(--font-family);
            line-height: 1.5;
            font-weight: 400;
        }
        textarea {
            resize: none;
        }
        button {
            background-color: var(--button-background-color);
            color: var(--button-color);
            border: none;
            outline: none;
            padding: var(--button-padding);
            cursor: pointer;
            font-size: 1rem;
            font-weight: bold;
            width: var(--button-width);
        }
    `;

    @query("#name")
    private _name!: HTMLInputElement;

    @property({ type: Boolean })
    details = false;

    @property()
    name!: string;

    @property({ type: Array })
    books: Book[] = [];

    private _bookChange(e: CustomEvent) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("books:change", {
                bubbles: true,
                composed: true,
            })
        );
    }

    private _bookEdit(e: CustomEvent) {
        e.stopPropagation();
        const { id } = e.detail;
        this.dispatchEvent(
            new CustomEvent("books:edit", {
                bubbles: true,
                composed: true,
                detail: { id },
            })
        );
    }

    private _booksRemove(e: CustomEvent) {
        e.stopPropagation();
        const { id } = e.detail;
        this.dispatchEvent(
            new CustomEvent("books:remove", {
                bubbles: true,
                composed: true,
                detail: { id },
            })
        );
    }

    private _change(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("change", {
                bubbles: true,
                composed: true,
                detail: {
                    name: this._name.value,
                },
            })
        );
    }

    private _save(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("save", {
                bubbles: true,
                composed: true,
            })
        );
    }

    private _cancel(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("cancel", {
                bubbles: true,
                composed: true,
            })
        );
    }

    render() {
        return html`
            <div class="sx-tag-edit">
                <div class="sx-tag-edit-header">${msg("Tag")}</div>
                <div class="sx-tag-edit-content">
                    <label>${msg("Name")}</label>
                    <input
                        id="name"
                        type="text"
                        @keyup="${this._change}"
                        value="${this.name}"
                    />
                    <label>${msg("Books")}</label>
                    <sx-detail
                        ?add="${this.details}"
                        @detail:edit=${this._bookChange}
                    >
                        ${this.books.map(
                            ({ id, title: name }) =>
                                html`<sx-book-detail
                                    id="${id!}"
                                    name="${name}"
                                    @edit="${this._bookEdit}"
                                    @remove="${this._booksRemove}"
                                ></sx-book-detail>`
                        )}
                    </sx-detail>
                </div>
                <div class="sx-tag-edit-footer">
                    <button @click="${this._save}">${msg("OK")}</button>
                    <button @click="${this._cancel}">${msg("Cancel")}</button>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-tag-edit": TagEdit;
    }
}
