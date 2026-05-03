import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import type { Author } from "@app/models";

@customElement("sx-author-select")
export class AuthorSelect extends LitElement implements Partial<Author> {
    static styles = css`
        .sx-author {
            display: grid;
            grid-template-columns: auto 1fr;
            cursor: pointer;
            padding: 0 1em;
            gap: 1em;
            height: var(--view-header-height);
            align-items: center;
        }
    `;

    @property()
    id!: string;

    @property()
    firstName?: string;

    @property()
    middleName?: string;

    @property()
    lastName!: string;

    @property({ type: Boolean })
    selected = false;

    @query("#selector")
    private _selector?: HTMLInputElement;

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

    private _select(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("select", {
                bubbles: true,
                detail: { id: this.id, selected: this._selector?.checked },
                composed: true,
            })
        );
    }

    render() {
        return html`<div class="sx-author">
            <input
                id="selector"
                type="checkbox"
                ?checked="${this.selected}"
                @change="${this._select}"
            />
            <div @click="${this._click}">
                <label>${this.lastName}</label>
                <label>${this.firstName}</label>
                <label>${this.middleName}</label>
            </div>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-author-select": AuthorSelect;
    }
}
