import { LitElement, html, css, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { msg, updateWhenLocaleChanges } from "@lit/localize";
import iconEdit from "@app/images/edit_note_24dp_FFFFFF.svg";
import iconAdd from "@app/images/add_box_24dp_FFFFFF.svg";

@customElement("sx-collection")
export class Collection extends LitElement {
    constructor() {
        super();
        updateWhenLocaleChanges(this);
    }

    static styles = css`
        .sx-collection {
            display: grid;
            grid-template-rows: auto 1fr auto;
            height: calc(100vh - var(--header-height));
        }
        .sx-collection-header {
            background-color: var(--collection-header-background-color);
            color: var(--collection-header-color);
            font-weight: var(--collection-header-font-weight);
            display: flex;
            align-items: center;
            gap: 1em;
            height: var(--collection-header-height);
            padding: 0 1em;
        }
        .sx-collection-header img {
            cursor: pointer;
        }
        .sx-collection-content {
            overflow-y: auto;
            height: 100%;
        }
        .sx-collection-footer {
            font-weight: var(--collection-header-font-weight);
            display: flex;
            gap: 0.5em;
            align-items: center;
            justify-content: center;
            height: var(--collection-footer-height);
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

    @property({ type: Boolean })
    header = true;

    @property({ type: Boolean })
    footer = false;

    @property({ type: Boolean })
    filtered = false;

    @property({ type: Boolean })
    add = false;

    @query("input[type=search]")
    _text!: HTMLInputElement;

    private _save(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("collection:save", {
                bubbles: false,
                composed: true,
            })
        );
    }

    private _add() {
        this.dispatchEvent(
            new CustomEvent("collection:add", {
                bubbles: false,
                composed: true,
            })
        );
    }

    private _cancel(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("collection:cancel", {
                bubbles: false,
                composed: true,
            })
        );
    }

    private _filter(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("collection:filter", {
                bubbles: false,
                detail: this._text.value,
                composed: true,
            })
        );
    }

    protected render() {
        return html`<div class="sx-collection">
            ${this.header
                ? html`<div class="sx-collection-header">
                      ${this.add
                          ? html`<img src="${iconAdd}" @click="${this._add}" />`
                          : nothing}
                      ${this.filtered
                          ? html`<input type="search" @keyup=${this._filter} />`
                          : nothing}
                  </div>`
                : nothing}
            <div class="sx-collection-content">
                <slot></slot>
            </div>
            ${this.footer
                ? html`<div class="sx-collection-footer">
                      <button @click="${this._save}">${msg("OK")}</button>
                      <button @click="${this._cancel}">${msg("Cancel")}</button>
                  </div>`
                : nothing}
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "scr-collection": Collection;
    }
}
