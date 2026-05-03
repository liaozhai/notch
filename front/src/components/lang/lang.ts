import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import iconDelete from "@app/images/clear_24dp_000000.svg";
import type { Lang } from "@app/models";

@customElement("sx-lang")
export class LangItem extends LitElement implements Partial<Lang> {
    @property()
    id!: string;

    @property()
    name = "";

    static styles = css`
        .sx-lang {
            display: grid;
            grid-template-columns: 1fr auto;
            padding: 0 1em;
            gap: 1em;
            height: var(--view-header-height);
            align-items: center;
        }
        .sx-lang:hover {
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
        return html`<div class="sx-lang">
            <label @click=${this._click}>${this.name}</label>
            <img src="${iconDelete}" @click=${this._remove} />
        </div>`;
    }
}

declare global {
    interface HTMLElementLangNameMap {
        "sx-lang": LangItem;
    }
}
