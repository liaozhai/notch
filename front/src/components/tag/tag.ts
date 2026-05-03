import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import iconDelete from "@app/images/clear_24dp_000000.svg";
import type { Tag } from "@app/models";

@customElement("sx-tag")
export class TagItem extends LitElement implements Partial<Tag> {
    @property()
    id!: string;

    @property()
    name = "";

    static styles = css`
        .sx-tag {
            display: grid;
            grid-template-columns: 1fr auto;
            padding: 0 1em;
            gap: 1em;
            height: var(--view-header-height);
            align-items: center;
        }
        .sx-tag:hover {
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
        return html`<div class="sx-tag">
            <label @click=${this._click}>${this.name}</label>
            <img src="${iconDelete}" @click=${this._remove} />
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-tag": TagItem;
    }
}
