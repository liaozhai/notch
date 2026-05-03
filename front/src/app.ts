import "./index.css";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import "@app/components/book";
import "@app/components/author";
import "@app/components/genre";
import "@app/components/lang";
import "@app/components/locale/picker";
import "@app/components/edition";
import "@app/components/publisher";
import "@app/components/tag";

import { msg, updateWhenLocaleChanges } from "./localization";
import { Routes } from "@lit-labs/router";
import { actor } from "./fsm";
import {
    AuthorController,
    BookController,
    EditionController,
    GenreController,
    LangController,
    PublisherController,
    TagController,
} from "./controllers";

@customElement("app-element")
export class App extends LitElement {
    static styles = css`
        :host {
            --app-header-height: var(--header-height);
            --app-header-background-color: #213547;
            --app-header-color: #ffffff;
            --app-sidebar-height: calc(100vh - var(--app-header-height));
            --sidebar-item-height: var(--view-header-height);
        }
        .app {
            display: grid;
            grid-template-columns: auto 1fr;
            height: 100vh;
            width: 100%;
        }
        .app-header {
            grid-column: span 2;
            height: var(--app-header-height);
            background-color: var(--app-header-background-color);
            color: var(--app-header-color);
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 1em;
            align-items: center;
            padding: 0 1em;
        }
        .app-header .title {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .app-sidebar {
            height: var(--app-sidebar-height);
        }
        .app-page {
            height: var(--app-sidebar-height);
        }
        .sidebar-item {
            display: flex;
            cursor: pointer;
            height: var(--sidebar-item-height);
            font-weight: bold;
            align-items: center;
            padding: 0 1em;
        }
        .sidebar-item.selected {
            background-color: var(--selected-item-background-color);
            color: var(--selected-item-color);
        }
        .sidebar-item:hover {
            background-color: var(--highlighted-item-background-color);
            color: var(--highlighted-item-color);
        }
    `;
    private _current = "";
    private _authorController = new AuthorController();
    private _bookController = new BookController();
    private _editionController = new EditionController();
    private _genreController = new GenreController();
    private _langController = new LangController();
    private _publisherController = new PublisherController();
    private _tagController = new TagController();
    constructor() {
        super();
        updateWhenLocaleChanges(this);
        actor.subscribe((state) => {
            switch (state.value) {
                case "authors_ready":
                    this._current = "authors";
                    this._routes.goto("/authors");
                    break;
                case "authors_edit_ready":
                    this._current = "authors";
                    this._routes.goto("/authors/:id");
                    break;
                case "author_books_ready":
                    this._current = "authors";
                    this._routes.goto("/author/books");
                    break;
                case "books_ready":
                    this._current = "books";
                    this._routes.goto("/books");
                    break;
                case "books_edit_ready":
                    this._current = "books";
                    this._routes.goto("/books/:id");
                    break;
                case "book_authors_ready":
                    this._current = "books";
                    this._routes.goto("/book/authors");
                    break;
                case "book_genres_ready":
                    this._current = "books";
                    this._routes.goto("/book/genres");
                    break;
                case "book_tags_ready":
                    this._current = "books";
                    this._routes.goto("/book/tags");
                    break;
                case "edition_ready":
                    this._current = "books";
                    this._routes.goto("/book/editions/:id");
                    break;
                case "genres_ready":
                    this._current = "genres";
                    this._routes.goto("/genres");
                    break;
                case "genres_edit_ready":
                    this._current = "genres";
                    this._routes.goto("/genres/:id");
                    break;
                case "genre_books_ready":
                    this._current = "genres";
                    this._routes.goto("/genre/books");
                    break;
                case "langs_ready":
                    this._current = "langs";
                    this._routes.goto("/langs");
                    break;
                case "langs_edit_ready":
                    this._current = "langs";
                    this._routes.goto("/langs/:id");
                    break;
                case "publishers_ready":
                    this._current = "publishers";
                    this._routes.goto("/publishers");
                    break;
                case "publishers_edit_ready":
                    this._current = "publishers";
                    this._routes.goto("/publishers/:id");
                    break;
                case "tags_ready":
                    this._current = "tags";
                    this._routes.goto("/tags");
                    break;
                case "tags_edit_ready":
                    this._current = "tags";
                    this._routes.goto("/tags/:id");
                    break;
                case "tag_books_ready":
                    this._current = "tags";
                    this._routes.goto("/tag/books");
                    break;
                default:
                    break;
            }
        });
        actor.start();
    }

    private _routes = new Routes(this, [
        {
            path: "/authors",
            render: () => {
                this._current = "authors";
                const {
                    context: {
                        authors: { filtered },
                    },
                } = actor.getSnapshot();
                return html`<sx-authors
                    filtered
                    .authors=${filtered}
                    @create="${this._authorController.create}"
                    @filter="${this._authorController.filter}"
                    @edit="${this._authorController.edit}"
                    @remove="${this._authorController.remove}"
                ></sx-authors>`;
            },
        },
        {
            path: "/authors/:id",
            render: () => {
                const {
                    context: {
                        authors: { one },
                    },
                } = actor.getSnapshot();
                const { id, firstName, middleName, lastName, books } = one!;
                return html`<sx-author-edit
                    id="${id!}"
                    firstName="${firstName}"
                    middleName="${ifDefined(middleName)}"
                    lastName="${lastName}"
                    .books="${books}"
                    details
                    @change="${this._authorController.change}"
                    @save="${this._authorController.save}"
                    @cancel="${this._authorController.cancel}"
                    @books:change="${this._authorController.books.change}"
                    @books:edit="${this._authorController.books.edit}"
                    @books:remove="${this._authorController.books.remove}"
                ></sx-author-edit>`;
            },
        },
        {
            path: "/author/new",
            render: () => {
                return html`<sx-author-edit
                    @change="${this._authorController.change}"
                    @save="${this._authorController.save}"
                    @cancel="${this._authorController.cancel}"
                ></sx-author-edit>`;
            },
        },
        {
            path: "/author/books",
            render: () => {
                const {
                    context: {
                        books: { many },
                    },
                } = actor.getSnapshot();
                return html`<sx-books
                    .books="${many}"
                    selectable
                    @select="${this._authorController.books.select}"
                    @save="${this._authorController.books.save}"
                    @cancel="${this._authorController.books.cancel}"
                ></sx-books>`;
            },
        },
        {
            path: "/books",
            render: () => {
                const {
                    context: {
                        books: { filtered },
                    },
                } = actor.getSnapshot();
                return html`<sx-books
                    filtered
                    .books="${filtered}"
                    @create="${this._bookController.create}"
                    @filter="${this._bookController.filter}"
                    @edit="${this._bookController.edit}"
                    @remove="${this._bookController.remove}"
                ></sx-books>`;
            },
        },
        {
            path: "/books/:id",
            render: () => {
                const {
                    context: {
                        books: { one },
                    },
                } = actor.getSnapshot();
                const {
                    id,
                    title,
                    originalTitle,
                    authors,
                    genres,
                    tags,
                    editions,
                } = one!;
                return html`<sx-book-edit
                    id="${id!}"
                    title="${title}"
                    originalTitle="${ifDefined(originalTitle)}"
                    .authors="${authors}"
                    .genres="${genres}"
                    .tags="${tags}"
                    .editions="${editions}"
                    details
                    @change="${this._bookController.change}"
                    @save="${this._bookController.save}"
                    @cancel="${this._bookController.cancel}"
                    @authors:change="${this._bookController.authors.change}"
                    @authors:edit="${this._bookController.authors.edit}"
                    @authors:remove="${this._bookController.authors.remove}"
                    @genres:change="${this._bookController.genres.change}"
                    @genres:edit="${this._bookController.genres.edit}"
                    @genres:remove="${this._bookController.genres.remove}"
                    @editions:change="${this._editionController.create}"
                    @editions:edit="${this._editionController.edit}"
                    @editions:remove="${this._editionController.remove}"
                    @tags:change="${this._bookController.tags.change}"
                    @tags:edit="${this._bookController.tags.edit}"
                    @tags:remove="${this._bookController.tags.remove}"
                ></sx-book-edit>`;
            },
        },
        {
            path: "/book/new",
            render: () => {
                return html`<sx-book-edit
                    @change="${this._bookController.change}"
                    @save="${this._bookController.save}"
                    @cancel="${this._bookController.cancel}"
                ></sx-book-edit>`;
            },
        },
        {
            path: "/book/authors",
            render: () => {
                const {
                    context: {
                        authors: { many },
                    },
                } = actor.getSnapshot();
                return html`<sx-authors
                    .authors="${many}"
                    selectable
                    @select="${this._bookController.authors.select}"
                    @save="${this._bookController.authors.save}"
                    @cancel="${this._bookController.authors.cancel}"
                ></sx-authors>`;
            },
        },
        {
            path: "/book/genres",
            render: () => {
                const {
                    context: {
                        genres: { many },
                    },
                } = actor.getSnapshot();
                return html`<sx-genres
                    .genres="${many}"
                    selectable
                    @select="${this._bookController.genres.select}"
                    @save="${this._bookController.genres.save}"
                    @cancel="${this._bookController.genres.cancel}"
                ></sx-genres>`;
            },
        },
        {
            path: "/book/tags",
            render: () => {
                const {
                    context: {
                        tags: { many },
                    },
                } = actor.getSnapshot();
                return html`<sx-tags
                    .tags="${many}"
                    selectable
                    @select="${this._bookController.tags.select}"
                    @save="${this._bookController.tags.save}"
                    @cancel="${this._bookController.tags.cancel}"
                ></sx-tags>`;
            },
        },
        {
            path: "/book/editions/:id",
            render: () => {
                const {
                    context: {
                        editions: { one },
                        langs,
                        publishers,
                    },
                } = actor.getSnapshot();
                const { id, isbn, year, pages, lang, publisher } = one!;
                return html`<sx-edition-edit
                    id="${id!}"
                    isbn="${isbn}"
                    year="${ifDefined(year)}"
                    pages="${pages}"
                    .language="${lang?.id}"
                    .languages="${langs.many}"
                    .publisher="${publisher?.id}"
                    .publishers="${publishers.many}"
                    @change="${this._editionController.change}"
                    @save="${this._editionController.save}"
                    @cancel="${this._editionController.cancel}"
                ></sx-edition-edit>`;
            },
        },
        {
            path: "book/edition/new",
            render: () => {
                return html`<sx-edition-edit></sx-edition-edit>`;
            },
        },
        {
            path: "/genres",
            render: () => {
                const {
                    context: {
                        genres: { filtered },
                    },
                } = actor.getSnapshot();
                return html`<sx-genres
                    filtered
                    .genres="${filtered}"
                    @create="${this._genreController.create}"
                    @filter="${this._genreController.filter}"
                    @edit="${this._genreController.edit}"
                    @remove="${this._genreController.remove}"
                ></sx-genres>`;
            },
        },
        {
            path: "/genres/:id",
            render: () => {
                const {
                    context: {
                        genres: { one },
                    },
                } = actor.getSnapshot();
                const { id, name, books } = one!;
                return html`<sx-genre-edit
                    id="${id!}"
                    name="${name}"
                    .books="${books}"
                    details
                    @change="${this._genreController.change}"
                    @save="${this._genreController.save}"
                    @cancel="${this._genreController.cancel}"
                    @books:change="${this._genreController.books.change}"
                    @books:edit="${this._genreController.books.edit}"
                    @books:remove="${this._genreController.books.remove}"
                ></sx-genre-edit>`;
            },
        },
        {
            path: "/genre/new",
            render: () => {
                return html`<sx-genre-edit
                    @change="${this._genreController.change}"
                    @save="${this._genreController.save}"
                    @cancel="${this._genreController.cancel}"
                ></sx-genre-edit>`;
            },
        },
        {
            path: "/genre/books",
            render: () => {
                const {
                    context: {
                        books: { many },
                    },
                } = actor.getSnapshot();
                return html`<sx-books
                    .books="${many}"
                    selectable
                    @select="${this._genreController.books.select}"
                    @save="${this._genreController.books.save}"
                    @cancel="${this._genreController.books.cancel}"
                ></sx-books>`;
            },
        },
        {
            path: "/tags",
            render: () => {
                const {
                    context: {
                        tags: { filtered },
                    },
                } = actor.getSnapshot();
                return html`<sx-tags
                    filtered
                    .tags="${filtered}"
                    @create="${this._tagController.create}"
                    @filter="${this._tagController.filter}"
                    @edit="${this._tagController.edit}"
                    @remove="${this._tagController.remove}"
                ></sx-tags>`;
            },
        },
        {
            path: "/tags/:id",
            render: () => {
                const {
                    context: {
                        tags: { one },
                    },
                } = actor.getSnapshot();
                const { id, name, books } = one!;
                return html`<sx-tag-edit
                    id="${id!}"
                    name="${name}"
                    .books="${books}"
                    details
                    @change="${this._tagController.change}"
                    @save="${this._tagController.save}"
                    @cancel="${this._tagController.cancel}"
                    @books:change="${this._tagController.books.change}"
                    @books:edit="${this._tagController.books.edit}"
                    @books:remove="${this._tagController.books.remove}"
                ></sx-tag-edit>`;
            },
        },
        {
            path: "/tag/new",
            render: () => {
                return html`<sx-tag-edit
                    @change="${this._genreController.change}"
                    @save="${this._genreController.save}"
                    @cancel="${this._genreController.cancel}"
                ></sx-tag-edit>`;
            },
        },
        {
            path: "/tag/books",
            render: () => {
                const {
                    context: {
                        books: { many },
                    },
                } = actor.getSnapshot();
                return html`<sx-books
                    .books="${many}"
                    selectable
                    @select="${this._tagController.books.select}"
                    @save="${this._tagController.books.save}"
                    @cancel="${this._tagController.books.cancel}"
                ></sx-books>`;
            },
        },
        {
            path: "/langs",
            render: () => {
                const {
                    context: {
                        langs: { many },
                    },
                } = actor.getSnapshot();
                return html`<sx-langs
                    .langs="${many}"
                    @create="${this._langController.create}"
                    @filter="${this._langController.filter}"
                    @edit="${this._langController.edit}"
                    @remove="${this._langController.remove}"
                ></sx-langs>`;
            },
        },
        {
            path: "/langs/:id",
            render: () => {
                const {
                    context: {
                        langs: { one },
                    },
                } = actor.getSnapshot();
                const { id, name } = one!;
                return html`<sx-lang-edit
                    id="${id!}"
                    name="${name}"
                    @change="${this._langController.change}"
                    @save="${this._langController.save}"
                    @cancel="${this._langController.cancel}"
                ></sx-lang-edit>`;
            },
        },
        {
            path: "/lang/new",
            render: () => {
                return html`<sx-lang-edit
                    @change="${this._langController.change}"
                    @save="${this._langController.save}"
                    @cancel="${this._langController.cancel}"
                ></sx-lang-edit>`;
            },
        },
        {
            path: "/publishers",
            render: () => {
                const {
                    context: {
                        publishers: { many },
                    },
                } = actor.getSnapshot();
                return html`<sx-publishers
                    .publishers="${many}"
                    @create="${this._publisherController.create}"
                    @filter="${this._publisherController.filter}"
                    @edit="${this._publisherController.edit}"
                    @remove="${this._publisherController.remove}"
                ></sx-publishers>`;
            },
        },
        {
            path: "/publishers/:id",
            render: () => {
                const {
                    context: {
                        publishers: { one },
                    },
                } = actor.getSnapshot();
                const { id, name } = one!;
                return html`<sx-publisher-edit
                    id="${id!}"
                    name="${name}"
                    @change="${this._publisherController.change}"
                    @save="${this._publisherController.save}"
                    @cancel="${this._publisherController.cancel}"
                ></sx-publisher-edit>`;
            },
        },
        {
            path: "/publisher/new",
            render: () => {
                return html`<sx-publisher-edit
                    @change="${this._publisherController.change}"
                    @save="${this._publisherController.save}"
                    @cancel="${this._publisherController.cancel}"
                ></sx-publisher-edit>`;
            },
        },
    ]);

    render() {
        return html`<div class="app">
            <div class="app-header">
                <div class="title">${msg("Digital Library")}</div>
                <locale-picker></locale-picker>
            </div>
            <div class="app-sidebar">
                <div
                    class=${classMap({
                        "sidebar-item": true,
                        selected: this._current === "books",
                    })}
                    @click="${this._bookController.list}"
                >
                    ${msg("Books")}
                </div>
                <div
                    class=${classMap({
                        "sidebar-item": true,
                        selected: this._current === "authors",
                    })}
                    @click=${this._authorController.list}
                >
                    ${msg("Authors")}
                </div>
                <div
                    class=${classMap({
                        "sidebar-item": true,
                        selected: this._current === "genres",
                    })}
                    @click=${this._genreController.list}
                >
                    ${msg("Genres")}
                </div>
                <div
                    class=${classMap({
                        "sidebar-item": true,
                        selected: this._current === "tags",
                    })}
                    @click=${this._tagController.list}
                >
                    ${msg("Tags")}
                </div>
                <div
                    class=${classMap({
                        "sidebar-item": true,
                        selected: this._current === "publishers",
                    })}
                    @click=${this._publisherController.list}
                >
                    ${msg("Publishers")}
                </div>
                <div
                    class=${classMap({
                        "sidebar-item": true,
                        selected: this._current === "langs",
                    })}
                    @click=${this._langController.list}
                >
                    ${msg("Languages")}
                </div>
            </div>
            <div class="app-page">${this._routes.outlet()}</div>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "app-element": App;
    }
}
