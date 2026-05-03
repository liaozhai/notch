import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Genre } from "@app/models";
import iconDelete from "@app/images/clear_24dp_000000.svg";

@customElement("sx-genre-detail")
export class GenreDetail extends LitElement implements Partial<Genre> {
    static styles = css`
        .sx-genre-detail {
            display: flex;
            align-items: center;
            gap: 0.5em;
            float: left;
            padding: 0.5em;
            margin: 0.5em 0.25em 0.25em;
            background-color: var(--detail-background-color);
            color: var(--detail-color);
        }
        .sx-genre-detail * {
            cursor: pointer;
        }
    `;

    @property()
    id!: string;

    @property()
    name!: string;

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
        return html`<div class="sx-genre-detail" @click="${this._select}">
            <label>${this.name}</label>
            <img src="${iconDelete}" @click="${this._remove}" />
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-genre-detail": GenreDetail;
    }
}
