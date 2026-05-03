import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "@app/components/collection/collection";
import "./genre";
import type { Genre } from "@app/models";

@customElement("sx-genres")
export class GenreList extends LitElement {
    @property({ type: Boolean })
    selectable = false;

    @property({ type: Boolean })
    filtered = false;

    @property({ type: Array })
    genres: Genre[] = [];

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
            ${this.genres.map(({ id, name, selected }) => {
                return this.selectable
                    ? html`<sx-genre-select
                          id="${id!}"
                          name="${name}"
                          ?selected=${selected}
                      ></sx-genre-select>`
                    : html`<sx-genre id="${id!}" name="${name}"></sx-genre>`;
            })}
        </sx-collection>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-genres": GenreList;
    }
}
