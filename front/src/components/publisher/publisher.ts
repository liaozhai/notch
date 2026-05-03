import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import iconDelete from "@app/images/clear_24dp_000000.svg";
import type { Publisher } from "@app/models";

@customElement("sx-publisher")
export class PublisherItem extends LitElement implements Partial<Publisher> {
    @property()
    id!: string;

    @property()
    name = "";

    static styles = css`
        .sx-publisher {
            display: grid;
            grid-template-columns: 1fr auto;
            padding: 0 1em;
            gap: 1em;
            height: var(--view-header-height);
            align-items: center;
        }
        .sx-publisher:hover {
            background-color: var(--detail-background-color);
            color: var(--detail-color);
            cursor: pointer;
        }
    `;

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
        return html`<div class="sx-publisher">
            <label @click=${this._click}>${this.name}</label>
            <img src="${iconDelete}" @click=${this._remove} />
        </div>`;
    }
}

declare global {
    interface HTMLElementPublisherNameMap {
        "sx-publisher": PublisherItem;
    }
}
