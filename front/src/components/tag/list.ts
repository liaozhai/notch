import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "@app/components/collection/collection";
import "./tag";
import type { Tag } from "@app/models";

@customElement("sx-tags")
export class TagList extends LitElement {
    @property({ type: Boolean })
    selectable = false;

    @property({ type: Boolean })
    filtered = false;

    @property({ type: Array })
    tags: Tag[] = [];

    private _create(e: CustomEvent) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("create", {
                bubbles: true,
                composed: true,
            })
        );
    }

    private _filter(e: CustomEvent) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("filter", {
                bubbles: true,
                detail: { filter: e.detail },
                composed: true,
            })
        );
    }

    private _save(e: CustomEvent) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("save", {
                bubbles: true,
                composed: true,
            })
        );
    }

    private _cancel(e: CustomEvent) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("cancel", {
                bubbles: true,
                composed: true,
            })
        );
    }

    render() {
        return html`<sx-collection
            @collection:add="${this._create}"
            @collection:filter="${this._filter}"
            @collection:save="${this._save}"
            @collection:cancel="${this._cancel}"
            ?add="${!this.selectable}"
            ?filtered="${this.filtered}"
            ?footer="${this.selectable}"
        >
            ${this.tags.map(({ id, name, selected }) => {
                return this.selectable
                    ? html`<sx-tag-select
                          id="${id!}"
                          name="${name}"
                          ?selected=${selected}
                      ></sx-tag-select>`
                    : html`<sx-tag id="${id!}" name="${name}"></sx-tag>`;
            })}
        </sx-collection>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-tags": TagList;
    }
}
