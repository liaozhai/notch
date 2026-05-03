import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import iconDelete from "@app/images/clear_24dp_000000.svg";

@customElement("sx-genre")
export class GenreItem extends LitElement {
    static styles = css`
        .sx-genre {
            display: grid;
            grid-template-columns: 1fr auto;
            cursor: pointer;
            padding: 0 1em;
            gap: 1em;
            height: var(--view-header-height);
            align-items: center;
        }
        .sx-genre:hover {
            background-color: var(--detail-background-color);
            color: var(--detail-color);
        }
    `;

    @property()
    id!: string;

    @property()
    name = "";

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
        return html`<div class="sx-genre">
            <label @click="${this._click}">${this.name}</label>
            <img src="${iconDelete}" @click="${this._remove}" />
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-genre": GenreItem;
    }
}
