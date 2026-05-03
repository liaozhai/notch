import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { actor } from "@app/fsm";

@customElement("sx-tag-select")
export class TagSelect extends LitElement {
    @property()
    id!: string;

    @property()
    name = "";

    @property({ type: Boolean })
    selected = false;

    @query("#selector")
    private _selector?: HTMLInputElement;

    static styles = css`
        .sx-tag {
            display: grid;
            grid-template-columns: auto 1fr;
            cursor: pointer;
            padding: 0 1em;
            gap: 1em;
            height: var(--view-header-height);
            align-items: center;
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
        return html`<div class="sx-tag">
            <input
                id="selector"
                type="checkbox"
                ?checked="${this.selected}"
                @change="${this._select}"
            />
            <label @click=${this._click}>${this.name}</label>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-tag-select": TagSelect;
    }
}
