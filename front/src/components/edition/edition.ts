import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { msg, updateWhenLocaleChanges } from "@lit/localize";
import { actor } from "@app/fsm";

@customElement("sx-edition")
export class EditionItem extends LitElement {
    constructor() {
        super();
        updateWhenLocaleChanges(this);
    }

    static styles = css`
        .sx-edition {
            display: grid;
            grid-template-columns: 1fr auto;
            cursor: pointer;
            padding: 0 1em;
            height: var(--view-header-height);
            align-items: center;
        }
        .sx-edition:hover {
            background-color: var(--detail-background-color);
            color: var(--detail-color);
        }
    `;

    @property()
    id!: string;

    @property()
    isbn: string | null = null;

    @property({ type: Number })
    pages!: number;

    @property({ type: Number })
    year?: number;

    private _select(e: Event) {
        e.stopPropagation();
    }

    render() {
        return html`<div class="sx-edition">
            <div @click="${this._select}">
                <label>ISBN ${this.isbn}</label>
                ${this.year ? html`<label>,${this.year}</label>` : nothing}
                <label>,${this.pages} ${msg("pages")}</label>
            </div>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-edition": EditionItem;
    }
}
