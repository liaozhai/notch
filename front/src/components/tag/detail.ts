import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Tag } from "@app/models";
import iconDelete from "@app/images/clear_24dp_000000.svg";

@customElement("sx-tag-detail")
export class TagDetail extends LitElement implements Partial<Tag> {
    static styles = css`
        .sx-tag-detail {
            display: flex;
            align-items: center;
            gap: 0.5em;
            float: left;
            padding: 0.5em;
            margin: 0.5em 0.25em 0.25em;
            background-color: var(--detail-background-color);
            color: var(--detail-color);
        }
        .sx-tag-detail * {
            cursor: pointer;
        }
    `;

    @property()
    id!: string;

    @property()
    name = "";

    private _select(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("edit", {
                bubbles: false,
                composed: false,
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
        return html`<div class="sx-tag-detail" @click="${this._select}">
            <label>${this.name}</label>
            <img src="${iconDelete}" @click="${this._remove}" />
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-tag-detail": TagDetail;
    }
}
