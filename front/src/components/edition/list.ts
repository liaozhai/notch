import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "@app/components/collection/collection";
import "./edition";
import type { Edition } from "@app/models";
import { ifDefined } from "lit/directives/if-defined.js";

@customElement("sx-editions")
export class EditionList extends LitElement {
    @property({ type: Boolean })
    selectable = false;

    @property({ type: Boolean })
    filter = false;

    @property({ type: Array })
    editions: Edition[] = [];

    private _edit(e: CustomEvent) {
        e.stopPropagation();
    }

    render() {
        return html`<sx-collection @edit="${this._edit}" add footer>
            ${this.editions.map(
                ({ id, isbn, year, pages, lang, publisher }) => {
                    return html`<sx-edition
                        id="${id!}"
                        isbn="${isbn}"
                        year="${ifDefined(year)}"
                        pages="${pages}"
                        lang="${ifDefined(lang)}"
                        publisher="${ifDefined(publisher)}"
                    ></sx-edition>`;
                }
            )}
        </sx-collection>`;
    }
}

declare global {
    interface HTMLElementEditionNameMap {
        "sx-editions": EditionList;
    }
}
