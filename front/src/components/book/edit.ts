import { LitElement, html, css, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { msg, updateWhenLocaleChanges } from "@lit/localize";
import "@app/components/collection";
import "@app/components/author";
import "@app/components/genre";
import "@app/components/tag";
import "@app/components/edition";
import type { Author, Book, Edition, Genre, Tag } from "@app/models";

@customElement("sx-book-edit")
export class BookEdit extends LitElement implements Book {
    constructor() {
        super();
        updateWhenLocaleChanges(this);
    }

    static styles = css`
        .sx-book-edit {
            display: grid;
            grid-template-rows: auto 1fr auto;
            height: 100%;
        }
        .sx-book-edit-header,
        .sx-book-edit-footer {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sx-book-edit-header {
            height: var(--view-header-height);
            color: var(--view-header-color);
            background-color: var(--view-header-background-color);
            font-weight: var(--view-header-font-weight);
        }
        .sx-book-edit-footer {
            gap: 0.5em;
            height: var(--view-footer-height);
        }
        .sx-book-edit-content {
            display: grid;
            grid-template-columns: auto 1fr;
            grid-template-rows: auto repeat(6, 1fr);
            gap: 1em;
            padding: 1em;
            align-content: start;
        }
        label {
            width: var(--label-width);
        }
        textarea,
        input,
        select {
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

    @query(".title")
    private _title!: HTMLTextAreaElement;

    @query(".original-title")
    private _originalTitle!: HTMLTextAreaElement;

    @property({ type: Boolean })
    details = false;

    @property()
    title!: string;

    @property()
    originalTitle = "";

    @property({ type: Array })
    authors: Author[] = [];

    @property({ type: Array })
    books: Book[] = [];

    @property({ type: Array })
    genres: Genre[] = [];

    @property({ type: Array })
    tags: Tag[] = [];

    @property({ type: Array })
    editions: Edition[] = [];

    private _authorChange(e: CustomEvent) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("authors:change", {
                bubbles: true,
                composed: true,
            })
        );
    }

    private _authorEdit(e: CustomEvent) {
        e.stopPropagation();
        const { id } = e.detail;
        this.dispatchEvent(
            new CustomEvent("authors:edit", {
                bubbles: true,
                composed: true,
                detail: { id },
            })
        );
    }

    private _authorRemove(e: CustomEvent) {
        e.stopPropagation();
        const { id } = e.detail;
        this.dispatchEvent(
            new CustomEvent("authors:remove", {
                bubbles: true,
                composed: true,
                detail: { id },
            })
        );
    }

    private _genreChange(e: CustomEvent) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("genres:change", {
                bubbles: true,
                composed: true,
            })
        );
    }

    private _genreEdit(e: CustomEvent) {
        e.stopPropagation();
        const { id } = e.detail;
        this.dispatchEvent(
            new CustomEvent("genres:edit", {
                bubbles: true,
                composed: true,
                detail: { id },
            })
        );
    }

    private _genreRemove(e: CustomEvent) {
        e.stopPropagation();
        const { id } = e.detail;
        this.dispatchEvent(
            new CustomEvent("genres:remove", {
                bubbles: true,
                composed: true,
                detail: { id },
            })
        );
    }

    private _tagChange(e: CustomEvent) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("tags:change", {
                bubbles: true,
                composed: true,
            })
        );
    }

    private _tagEdit(e: CustomEvent) {
        e.stopPropagation();
        const { id } = e.detail;
        this.dispatchEvent(
            new CustomEvent("tags:edit", {
                bubbles: true,
                composed: true,
                detail: { id },
            })
        );
    }

    private _tagRemove(e: CustomEvent) {
        e.stopPropagation();
        const { id } = e.detail;
        this.dispatchEvent(
            new CustomEvent("tags:remove", {
                bubbles: true,
                composed: true,
                detail: { id },
            })
        );
    }

    private _editionChange(e: CustomEvent) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("editions:change", {
                bubbles: true,
                composed: true,
            })
        );
    }

    private _editionEdit(e: CustomEvent) {
        e.stopPropagation();
        const { id } = e.detail;
        this.dispatchEvent(
            new CustomEvent("editions:edit", {
                bubbles: true,
                composed: true,
                detail: { id },
            })
        );
    }

    private _editionRemove(e: CustomEvent) {
        e.stopPropagation();
        const { id } = e.detail;
        this.dispatchEvent(
            new CustomEvent("editions:remove", {
                bubbles: true,
                composed: true,
                detail: { id },
            })
        );
    }

    private _change(e: Event) {
        e.stopPropagation();
        this.dispatchEvent(
            new CustomEvent("change", {
                bubbles: true,
                composed: true,
                detail: {
                    title: this._title.value,
                    originalTitle: this._originalTitle.value,
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
            <div class="sx-book-edit">
                <div class="sx-book-edit-header">${msg("Book")}</div>
                <div class="sx-book-edit-content">
                    <label>${msg("Title")}</label>
                    <textarea
                        class="title"
                        @keyup="${this._change}"
                        .value="${this.title}"
                    ></textarea>
                    <label>${msg("Original title")}</label>
                    <textarea
                        class="original-title"
                        @keyup="${this._change}"
                        .value="${this.originalTitle}"
                    ></textarea>
                    <label>${msg("Authors")}</label>
                    <sx-detail
                        ?add="${this.details}"
                        @detail:edit=${this._authorChange}
                    >
                        ${this.authors.map(
                            ({ id, firstName, lastName, middleName }) =>
                                html`<sx-author-detail
                                    id="${id!}"
                                    firstName="${ifDefined(firstName)}"
                                    middleName="${ifDefined(middleName)}"
                                    lastName="${lastName}"
                                    @edit="${this._authorEdit}"
                                    @remove="${this._authorRemove}"
                                ></sx-author-detail>`
                        )}
                    </sx-detail>
                    <label>${msg("Genres")}</label>
                    <sx-detail
                        ?add="${this.details}"
                        @detail:edit=${this._genreChange}
                    >
                        ${this.genres.map(
                            ({ id, name }) =>
                                html`<sx-genre-detail
                                    id="${id!}"
                                    name="${ifDefined(name)}"
                                    @edit="${this._genreEdit}"
                                    @remove="${this._genreRemove}"
                                ></sx-genre-detail>`
                        )}
                    </sx-detail>
                    <label>${msg("Tags")}</label>
                    <sx-detail
                        ?add="${this.details}"
                        @detail:edit=${this._tagChange}
                    >
                        ${this.tags.map(
                            ({ id, name }) =>
                                html`<sx-tag-detail
                                    id="${id!}"
                                    name="${ifDefined(name)}"
                                    @edit="${this._tagEdit}"
                                    @remove="${this._tagRemove}"
                                ></sx-tag-detail>`
                        )}
                    </sx-detail>
                    ${this.id
                        ? html`<label>${msg("Editions")}</label>
                              <sx-detail
                                  ?add="${this.details}"
                                  @detail:edit=${this._editionChange}
                              >
                                  ${this.editions.map(
                                      ({ id, isbn, pages, year }) =>
                                          html`<sx-edition-detail
                                              id="${id!}"
                                              isbn="${ifDefined(isbn)}"
                                              pages="${pages}"
                                              year="${ifDefined(year)}"
                                              @edit="${this._editionEdit}"
                                              @remove="${this._editionRemove}"
                                          ></sx-edition-detail>`
                                  )}
                              </sx-detail>`
                        : nothing}
                </div>
                <div class="sx-book-edit-footer">
                    <button @click="${this._save}">${msg("OK")}</button>
                    <button @click="${this._cancel}">${msg("Cancel")}</button>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sx-book-edit": BookEdit;
    }
}
