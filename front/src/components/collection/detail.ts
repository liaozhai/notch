import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import iconEdit from "@app/images/edit_24dp_FFFFFF.svg";
import { msg } from "@lit/localize";

@customElement("sx-detail")
export class CollectionDetail extends LitElement {
    static styles = css`
        .sx-detail {
            height: 100%;
            position: relative;
        }
        .sx-detail-header {
            background-color: var(--collection-header-background-color);
            color: var(--collection-header-color);
            font-weight: var(--collection-header-font-weight);
            display: flex;
            align-items: center;
            height: var(--detail-header-height);
            padding: 0 0.4em;
        }
        .sx-detail-header img {
            cursor: pointer;
        }
        .sx-detail-content {
            position: absolute;
        }
    `;

    @property({ type: Boolean })
    add = false;

    private _edit(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("detail:edit", {
                bubbles: true,
                composed: true,
            })
        );
    }

    protected render() {
        return html`<div class="sx-detail">
            <div class="sx-detail-header">
                ${this.add
                    ? html`<img
                          title="${msg("Edit")}"
                          src=${iconEdit}
                          @click=${this._edit}
                      />`
                    : nothing}
            </div>
            <div class="sx-detail-content">
                <slot></slot>
            </div>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-detail": CollectionDetail;
    }
}
