import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { updateWhenLocaleChanges } from "@lit/localize";
import type { Author } from "@app/models";
import "./author";

@customElement("sx-authors")
export class AuthorList extends LitElement {
    constructor() {
        super();
        updateWhenLocaleChanges(this);
    }

    @property({ type: Boolean })
    selectable = false;

    @property({ type: Boolean })
    filtered = false;

    @property({ type: Array })
    authors: Author[] = [];

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
            ${this.authors.map(
                ({ id, firstName, middleName, lastName, selected }) => {
                    return this.selectable
                        ? html`<sx-author-select
                              id="${id!}"
                              firstName="${ifDefined(firstName)}"
                              middleName="${ifDefined(middleName)}"
                              lastName="${lastName}"
                              ?selected="${selected}"
                          ></sx-author-select>`
                        : html`<sx-author
                              id="${id!}"
                              firstName="${ifDefined(firstName)}"
                              middleName="${ifDefined(middleName)}"
                              lastName="${lastName}"
                          ></sx-author>`;
                }
            )}
        </sx-collection>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-authors": AuthorList;
    }
}
