import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { msg, updateWhenLocaleChanges } from "@lit/localize";
import iconDelete from "@app/images/clear_24dp_000000.svg";
import type { Lang, Publisher } from "@app/models";

@customElement("sx-edition-detail")
export class EditionDetail extends LitElement {
    constructor() {
        super();
        updateWhenLocaleChanges(this);
    }

    static styles = css`
        .sx-edition-detail {
            display: flex;
            align-items: center;
            gap: 0.5em;
            float: left;
            padding: 0.5em;
            margin: 0.5em 0.25em 0.25em;
            background-color: var(--detail-background-color);
            color: var(--detail-color);
        }
        .sx-edition-detail * {
            cursor: pointer;
        }
    `;

    @property()
    id!: string;

    @property()
    isbn?: string;

    @property({ type: Number })
    pages!: number;

    @property({ type: Number })
    year?: number;

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
        return html`<div class="sx-edition-detail">
            <div @click="${this._select}">
                <label>ISBN ${this.isbn}</label>
                ${this.year ? html`<label>, ${this.year}</label>` : nothing}
                <label>, ${this.pages} ${msg("pages")}</label>
            </div>
            <img src="${iconDelete}" @click="${this._remove}" />
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-edition-detail": EditionDetail;
    }
}
