import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import iconDelete from "@app/images/clear_24dp_000000.svg";
import type { Author } from "@app/models";

@customElement("sx-author")
export class AuthorItem extends LitElement implements Partial<Author> {
    static styles = css`
        .sx-author {
            display: grid;
            grid-template-columns: 1fr auto;
            padding: 0 1em;
            gap: 1em;
            height: var(--view-header-height);
            align-items: center;
        }
        .sx-author * {
            cursor: pointer;
        }
        .sx-author:hover {
            background-color: var(--detail-background-color);
            color: var(--detail-color);
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
        return html`<div class="sx-author">
            <div @click="${this._click}">
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
        "sx-author": AuthorItem;
    }
}
