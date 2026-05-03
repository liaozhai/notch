import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "@app/components/collection/collection";
import "./publisher";
import type { Publisher } from "@app/models";

@customElement("sx-publishers")
export class PublisherList extends LitElement {
    @property({ type: Boolean })
    selectable = false;

    @property({ type: Boolean })
    filter = false;

    @property({ type: Array })
    publishers: Publisher[] = [];

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
            add
        >
            ${this.publishers.map(({ id, name }) => {
                return html`<sx-publisher
                    id="${id!}"
                    name="${name}"
                ></sx-publisher>`;
            })}
        </sx-collection>`;
    }
}

declare global {
    interface HTMLElementPublisherNameMap {
        "sx-publishers": PublisherList;
    }
}
