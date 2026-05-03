import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Author } from "@app/models";
import iconDelete from "@app/images/clear_24dp_000000.svg";

@customElement("sx-author-detail")
export class AuthorDetail extends LitElement implements Partial<Author> {
    static styles = css`
        .sx-author-detail {
            display: flex;
            align-items: center;
            gap: 0.5em;
            float: left;
            padding: 0.5em;
            margin: 0.5em 0.25em 0.25em;
            background-color: var(--detail-background-color);
            color: var(--detail-color);
        }
        .sx-author-detail * {
            cursor: pointer;
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
        return html`<div class="sx-author-detail">
            <div @click="${this._select}">
                <label>${this.lastName}</label>
                <label>${this.firstName}</label>
                <label>${this.middleName}</label>
            </div>
            <img src="${iconDelete}" @click="${this._remove}" />
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-author-detail": AuthorDetail;
    }
}
