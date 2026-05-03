import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { msg, updateWhenLocaleChanges } from "@lit/localize";
import "@app/components/collection";
import "@app/components/book";
import type { Publisher } from "@app/models";

@customElement("sx-publisher-edit")
export class PublisherEdit extends LitElement implements Publisher {
    constructor() {
        super();
        updateWhenLocaleChanges(this);
    }

    static styles = css`
        .sx-publisher-edit {
            display: grid;
            grid-template-rows: auto 1fr auto;
            height: 100%;
        }
        .sx-publisher-edit-header,
        .sx-publisher-edit-footer {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sx-publisher-edit-header {
            height: var(--view-header-height);
            color: var(--view-header-color);
            background-color: var(--view-header-background-color);
            font-weight: var(--view-header-font-weight);
        }
        .sx-publisher-edit-footer {
            gap: 0.5em;
            height: var(--view-footer-height);
        }
        .sx-publisher-edit-content {
            display: grid;
            grid-template-columns: auto 1fr;
            grid-template-rows: repeat(3, auto) 1fr;
            gap: 1em;
            padding: 1em;
            align-content: start;
        }
        label {
            width: var(--label-width);
        }
        textarea,
        input {
            font-size: 1rem;
            padding: 0.5em;
            border: var(--border);
            font-family: var(--font-family);
            line-height: 1.5;
            font-weight: 400;
        }
        textarea {
            resize: none;
        }
        button {
            background-color: var(--button-background-color);
            color: var(--button-color);
            border: none;
            outline: none;
            padding: var(--button-padding);
            cursor: pointer;
            font-size: 1rem;
            font-weight: bold;
            width: var(--button-width);
        }
    `;

    @query("#name")
    private _name!: HTMLTextAreaElement;

    @property()
    name!: string;

    private _change(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("change", {
                bubbles: true,
                composed: true,
                detail: {
                    name: this._name.value,
                },
            })
        );
    }

    private _save(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("save", {
                bubbles: true,
                composed: true,
            })
        );
    }

    private _cancel(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("cancel", {
                bubbles: true,
                composed: true,
            })
        );
    }

    render() {
        return html`
            <div class="sx-publisher-edit">
                <div class="sx-publisher-edit-header">${msg("Publisher")}</div>
                <div class="sx-publisher-edit-content">
                    <label>${msg("Name")}</label>
                    <textarea
                        id="name"
                        @keyup="${this._change}"
                        .value="${this.name}"
                    >
                    </textarea>
                </div>
                <div class="sx-publisher-edit-footer">
                    <button @click="${this._save}">${msg("OK")}</button>
                    <button @click="${this._cancel}">${msg("Cancel")}</button>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-publisher-edit": PublisherEdit;
    }
}
