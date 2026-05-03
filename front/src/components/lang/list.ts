import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "@app/components/collection/collection";
import "./lang";
import type { Lang } from "@app/models";

@customElement("sx-langs")
export class LangList extends LitElement {
    @property({ type: Array })
    langs: Lang[] = [];

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
            ${this.langs.map(({ id, name }) => {
                return html`<sx-lang id="${id!}" name="${name}"></sx-lang>`;
            })}
        </sx-collection>`;
    }
}

declare global {
    interface HTMLElementLangNameMap {
        "sx-langs": LangList;
    }
}
