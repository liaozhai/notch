import { LitElement, html, css, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { msg, updateWhenLocaleChanges } from "@lit/localize";
import "@app/components/collection/detail";
import "@app/components/book/detail";
import type { Lang, Publisher } from "@app/models";

@customElement("sx-edition-edit")
export class EditionEdit extends LitElement {
    constructor() {
        super();
        updateWhenLocaleChanges(this);
    }

    static styles = css`
        .sx-edition-edit {
            display: grid;
            grid-template-rows: auto 1fr auto;
            height: 100%;
        }
        .sx-edition-edit-header,
        .sx-edition-edit-footer {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sx-edition-edit-header {
            height: var(--view-header-height);
            color: var(--view-header-color);
            background-color: var(--view-header-background-color);
            font-weight: var(--view-header-font-weight);
        }
        .sx-edition-edit-footer {
            gap: 0.5em;
            height: var(--view-footer-height);
        }
        .sx-edition-edit-content {
            display: grid;
            grid-template-columns: auto auto;
            gap: 1em;
            padding: 1em;
            align-content: start;
            justify-content: start;
            align-items: center;
        }
        label {
            width: var(--label-width);
        }
        textarea,
        input,
        select {
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

    @property()
    isbn!: string;

    @property({ type: Number })
    year?: number;

    @property({ type: Number })
    pages = 0;

    @property()
    publisher?: string;

    @property()
    language?: string;

    @property({ type: Array })
    languages: Lang[] = [];

    @property({ type: Array })
    publishers: Publisher[] = [];

    @property()
    book!: string;

    @query("#isbn")
    private _isbn!: HTMLInputElement;

    @query("#year")
    private _year!: HTMLInputElement;

    @query("#pages")
    private _pages!: HTMLInputElement;

    @query("#lang")
    private _lang!: HTMLSelectElement;

    @query("#publisher")
    private _publisher!: HTMLSelectElement;

    private _change(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("change", {
                bubbles: true,
                composed: true,
                detail: {
                    isbn: this._isbn.value,
                    year: parseInt(this._year.value, 10),
                    pages: parseInt(this._pages.value, 10),
                    lang: this._lang.value,
                    publisher: this._publisher.value,
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

    protected firstUpdated(_changedProperties: PropertyValues): void {
        if (this.language) {
            this._lang.value = this.language!;
        }
        if (this.publisher) {
            this._publisher.value = this.publisher!;
        }
    }

    render() {
        return html`
            <div class="sx-edition-edit">
                <div class="sx-edition-edit-header">${msg("Edition")}</div>
                <div class="sx-edition-edit-content">
                    <label>ISBN</label>
                    <input
                        type="text"
                        id="isbn"
                        value="${this.isbn}"
                        @keyup="${this._change}"
                    />
                    <label>${msg("Year")}</label>
                    <input
                        type="number"
                        min="1"
                        id="year"
                        value="${ifDefined(this.year)}"
                        @keyup="${this._change}"
                    />
                    <label>${msg("Pages")}</label>
                    <input
                        type="number"
                        id="pages"
                        min="1"
                        value="${this.pages}"
                        @keyup="${this._change}"
                    />
                    <label>${msg("Publisher")}</label>
                    <select id="publisher" @change="${this._change}">
                        ${this.publishers.map(
                            ({ id, name }) =>
                                html`<option value="${id!}">${name}</option>`
                        )}
                    </select>
                    <label>${msg("Language")}</label>
                    <select id="lang" @change="${this._change}">
                        ${this.languages.map(
                            ({ id, name }) =>
                                html`<option value="${id!}">${name}</option>`
                        )}
                    </select>
                </div>
                <div class="sx-edition-edit-footer">
                    <button @click="${this._save}">${msg("OK")}</button>
                    <button @click="${this._cancel}">${msg("Cancel")}</button>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-edition-edit": EditionEdit;
    }
}
