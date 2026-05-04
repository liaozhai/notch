import { assign, createActor, fromPromise, setup } from "xstate";
import * as API from "@app/api";
import type {
    Author,
    Book,
    Edition,
    Genre,
    Lang,
    Publisher,
    Tag,
} from "@app/models";

type Entity<
    T extends Author | Book | Edition | Genre | Lang | Publisher | Tag,
> = { many: T[]; one?: T; filtered: T[] };

export type EntityName =
    | "author"
    | "book"
    | "edition"
    | "genre"
    | "lang"
    | "publisher"
    | "tag";

type EntityMap = {
    author: Pick<Author, "firstName" | "middleName" | "lastName">;
    book: Pick<Book, "title" | "originalTitle">;
    edition: Pick<Edition, "isbn" | "pages" | "year" | "lang" | "publisher">;
    genre: Pick<Genre, "name">;
    lang: Pick<Lang, "name">;
    publisher: Pick<Publisher, "name">;
    tag: Pick<Tag, "name">;
};

export type Detail =
    | "author.books"
    | "book.authors"
    | "book.genres"
    | "book.tags"
    | "genre.books"
    | "tag.books";

export type EntityEvent =
    | { type: `${EntityName}.list` }
    | { type: `${EntityName}.filter`; filter: string }
    | { type: `${EntityName}.create` }
    | { type: `${EntityName}.edit`; id: string }
    | ({ type: `${EntityName}.change` } & EntityMap[EntityName])
    | { type: `${EntityName}.save` }
    | { type: `${EntityName}.remove`; id: string }
    | { type: `${EntityName}.cancel` }
    | { type: `${Detail}.change` }
    | { type: `${Detail}.edit`; id: string }
    | { type: `${Detail}.remove`; id: string }
    | { type: `${Detail}.select`; id: string; selected: boolean }
    | { type: `${Detail}.save` }
    | { type: `${Detail}.cancel` };

const fsm = setup({
    types: {
        context: {} as {
            authors: Entity<Author>;
            books: Entity<Book>;
            genres: Entity<Genre>;
            langs: Entity<Lang>;
            publishers: Entity<Publisher>;
            tags: Entity<Tag>;
            editions: Entity<Edition>;
        },
        events: {} as EntityEvent,
    },
    actors: {
        author_list: fromPromise(async () => await API.Author.list()),
        author_get: fromPromise(
            async ({ input }: { input: { id: string } }) =>
                await API.Author.single(input.id)
        ),
        author_save: fromPromise(
            async ({ input }: { input: { author: Author } }) =>
                await API.Author.save(input.author)
        ),
        author_remove: fromPromise(
            async ({ input }: { input: { id: string } }) =>
                await API.Author.remove(input.id)
        ),
        book_list: fromPromise(async () => await API.Book.list()),
        book_get: fromPromise(
            async ({ input }: { input: { id: string } }) =>
                await API.Book.single(input.id)
        ),
        book_save: fromPromise(
            async ({ input }: { input: { book: Book } }) =>
                await API.Book.save(input.book)
        ),
        book_remove: fromPromise(
            async ({ input }: { input: { id: string } }) =>
                await API.Book.remove(input.id)
        ),
        lang_list: fromPromise(async () => await API.Lang.list()),
        lang_get: fromPromise(
            async ({ input }: { input: { id: string } }) =>
                await API.Lang.single(input.id)
        ),
        lang_save: fromPromise(
            async ({ input }: { input: { lang: Lang } }) =>
                await API.Lang.save(input.lang)
        ),
        lang_remove: fromPromise(
            async ({ input }: { input: { id: string } }) =>
                await API.Lang.remove(input.id)
        ),
        genre_list: fromPromise(async () => await API.Genre.list()),
        genre_get: fromPromise(
            async ({ input }: { input: { id: string } }) =>
                await API.Genre.single(input.id)
        ),
        genre_save: fromPromise(
            async ({ input }: { input: { genre: Genre } }) =>
                await API.Genre.save(input.genre)
        ),
        genre_remove: fromPromise(
            async ({ input }: { input: { id: string } }) =>
                await API.Genre.remove(input.id)
        ),
        publisher_list: fromPromise(async () => await API.Publisher.list()),
        publisher_get: fromPromise(
            async ({ input }: { input: { id: string } }) =>
                await API.Publisher.single(input.id)
        ),
        publisher_save: fromPromise(
            async ({ input }: { input: { publisher: Publisher } }) =>
                await API.Publisher.save(input.publisher)
        ),
        publisher_remove: fromPromise(
            async ({ input }: { input: { id: string } }) =>
                await API.Publisher.remove(input.id)
        ),
        tag_list: fromPromise(async () => await API.Tag.list()),
        tag_get: fromPromise(
            async ({ input }: { input: { id: string } }) =>
                await API.Tag.single(input.id)
        ),
        tag_save: fromPromise(
            async ({ input }: { input: { tag: Tag } }) =>
                await API.Tag.save(input.tag)
        ),
        tag_remove: fromPromise(
            async ({ input }: { input: { id: string } }) =>
                await API.Tag.remove(input.id)
        ),
        edition_get: fromPromise(
            async ({ input }: { input: { id: string } }) =>
                await API.Edition.single(input.id)
        ),
        edition_save: fromPromise(
            async ({ input }: { input: { editions: Edition[] } }) =>
                await API.Edition.save(input.editions)
        ),
        edition_remove: fromPromise(
            async ({ input }: { input: { ids: string[] } }) => {
                await API.Edition.remove(input.ids);
            }
        ),
    },
}).createMachine({
    initial: "books",
    context: {
        authors: { many: [], filtered: [] },
        books: { many: [], filtered: [] },
        editions: { many: [], filtered: [] },
        genres: { many: [], filtered: [] },
        langs: { many: [], filtered: [] },
        publishers: { many: [], filtered: [] },
        tags: { many: [], filtered: [] },
    },
    on: {
        "author.list": { target: ".authors" },
        "book.list": { target: ".books" },
        "genre.list": { target: ".genres" },
        "lang.list": { target: ".langs" },
        "publisher.list": { target: ".publishers" },
        "tag.list": { target: ".tags" },
    },
    states: {
        authors: {
            description: "Show authors' list",
            invoke: {
                src: "author_list",
                onDone: {
                    target: "authors_ready",
                    actions: assign({
                        authors: ({ event }) => {
                            return {
                                many: event.output,
                                filtered: event.output,
                            };
                        },
                    }),
                },
            },
        },
        authors_ready: {
            description: "Authors' list loaded",
            on: {
                "author.create": {
                    target: "authors_edit_ready",
                    actions: assign({
                        authors: ({ context: { authors } }) => {
                            return {
                                ...authors,
                                one: {
                                    firstName: "",
                                    middleName: "",
                                    lastName: "",
                                    books: [],
                                },
                            };
                        },
                    }),
                },
                "author.filter": {
                    target: "authors_ready",
                    actions: assign({
                        authors: ({ event, context: { authors } }) => {
                            const { many } = authors;
                            const { filter } = event;
                            return {
                                ...authors,
                                filtered: many.filter(
                                    ({ lastName }) =>
                                        !filter ||
                                        lastName
                                            .toLocaleLowerCase()
                                            .startsWith(
                                                filter.toLocaleLowerCase()
                                            )
                                ),
                            };
                        },
                    }),
                },
                "author.edit": { target: "authors_edit" },
                "author.remove": { target: "authors_remove" },
            },
        },
        authors_edit: {
            description: "View selected Author",
            invoke: {
                src: "author_get",
                input: ({ event }) => {
                    const { id } = event as Extract<
                        EntityEvent,
                        { type: "author.edit" }
                    >;
                    return { id };
                },
                onDone: {
                    target: "authors_edit_ready",
                    actions: assign({
                        authors: ({ event, context: { authors } }) => {
                            return { ...authors, one: event.output };
                        },
                    }),
                },
            },
        },
        authors_edit_ready: {
            description: "Selected Author loaded",
            on: {
                "author.change": {
                    target: "authors_edit_ready",
                    actions: assign({
                        authors: ({ event, context: { authors } }) => {
                            const { firstName, middleName, lastName } =
                                event as Extract<
                                    EntityEvent,
                                    { type: "author.change" }
                                >;
                            const { one } = authors;
                            return {
                                ...authors,
                                one: {
                                    ...one!,
                                    firstName,
                                    middleName,
                                    lastName,
                                },
                            };
                        },
                    }),
                },
                "author.save": { target: "authors_save" },
                "author.cancel": {
                    target: "authors",
                    actions: assign({
                        authors: ({ context: { authors } }) => {
                            return { ...authors, one: undefined };
                        },
                    }),
                },
                "author.books.change": {
                    target: "author_books",
                },
                "author.books.edit": {
                    target: "books_edit",
                },
                "author.books.remove": {
                    target: "authors_edit_ready",
                    actions: assign({
                        authors: ({ event, context: { authors } }) => {
                            const { id } = event as Extract<
                                EntityEvent,
                                { type: "author.books.remove" }
                            >;
                            const { one } = authors;
                            return {
                                ...authors,
                                one: {
                                    ...one!,
                                    books: one!.books.filter(
                                        (v) => v.id !== id
                                    ),
                                },
                            };
                        },
                    }),
                },
            },
        },
        authors_remove: {
            description: "Delete selected Author",
            invoke: {
                src: "author_remove",
                input: ({ event }) => {
                    const { id } = event as Extract<
                        EntityEvent,
                        { type: "author.remove" }
                    >;
                    return { id };
                },
                onDone: {
                    target: "authors",
                },
            },
        },
        authors_save: {
            description: "Apply Author changes to server",
            invoke: {
                src: "author_save",
                input: ({
                    context: {
                        authors: { one },
                    },
                }) => {
                    return {
                        author: one as Author,
                    };
                },
                onDone: {
                    target: "authors",
                },
            },
        },
        author_books: {
            description: "Retrieve books list from server",
            invoke: {
                src: "book_list",
                onDone: {
                    target: "author_books_ready",
                    actions: assign({
                        books: ({
                            event,
                            context: {
                                authors: { one },
                            },
                        }) => {
                            const books = event.output;
                            books.forEach(
                                (b) =>
                                    (b.selected =
                                        one?.books.findIndex(
                                            ({ id }) => b.id === id
                                        ) !== -1)
                            );
                            return {
                                many: books,
                                filtered: event.output,
                            };
                        },
                    }),
                },
            },
        },
        author_books_ready: {
            description: "Show current Author's books",
            on: {
                "author.list": { target: "authors" },
                "author.books.cancel": { target: "authors_edit_ready" },
                "author.books.select": {
                    target: "author_books_ready",
                    actions: assign({
                        books: ({ event, context: { books } }) => {
                            const { many } = books;
                            const { id, selected } = event;
                            return {
                                ...books,
                                many: many.map((b) => {
                                    if (b.id === id) {
                                        b.selected = selected;
                                    }
                                    return b;
                                }),
                            };
                        },
                    }),
                },
                "author.books.save": {
                    target: "authors_edit_ready",
                    actions: assign({
                        authors: ({
                            context: {
                                authors,
                                books: { many },
                            },
                        }) => {
                            const { one } = authors;
                            return {
                                ...authors,
                                one: {
                                    ...one!,
                                    books: many.filter(
                                        ({ selected }) => selected
                                    ),
                                },
                            };
                        },
                    }),
                },
            },
        },
        books: {
            description: "Show books list",
            invoke: {
                src: "book_list",
                onDone: {
                    target: "books_ready",
                    actions: assign({
                        books: ({ event }) => {
                            return {
                                many: event.output,
                                filtered: event.output,
                            };
                        },
                    }),
                },
            },
        },
        books_ready: {
            description: "Books' list loaded",
            on: {
                "book.create": {
                    target: "books_edit_ready",
                    actions: assign({
                        books: ({ context: { books } }) => {
                            return {
                                ...books,
                                one: {
                                    title: "",
                                    originalTitle: "",
                                    authors: [],
                                    genres: [],
                                    editions: [],
                                    tags: [],
                                },
                            };
                        },
                    }),
                },
                "book.filter": {
                    target: "books_ready",
                    actions: assign({
                        books: ({ event, context: { books } }) => {
                            const { many } = books;
                            const { filter } = event;
                            return {
                                ...books,
                                filtered: many.filter(
                                    ({ title }) =>
                                        !filter ||
                                        title
                                            .toLocaleLowerCase()
                                            .startsWith(
                                                filter.toLocaleLowerCase()
                                            )
                                ),
                            };
                        },
                    }),
                },
                "book.edit": { target: "books_edit" },
                "book.remove": { target: "books_remove" },
            },
        },
        books_edit: {
            description: "View selected Book",
            invoke: {
                src: "book_get",
                input: ({ event }) => {
                    const { id } = event as Extract<
                        EntityEvent,
                        { type: "book.edit" }
                    >;
                    return { id };
                },
                onDone: {
                    target: "books_edit_ready",
                    actions: assign({
                        books: ({ event, context: { books } }) => {
                            return { ...books, one: event.output };
                        },
                    }),
                },
            },
        },
        books_edit_ready: {
            description: "Selected Book loaded",
            on: {
                "book.change": {
                    target: "books_edit_ready",
                    actions: assign({
                        books: ({ event, context: { books } }) => {
                            const { title, originalTitle } = event as Extract<
                                EntityEvent,
                                { type: "book.change" }
                            >;
                            const { one } = books;
                            return {
                                ...books,
                                one: {
                                    ...one!,
                                    title,
                                    originalTitle,
                                } as Book,
                            };
                        },
                    }),
                },
                "book.save": { target: "editions_save" },
                "book.cancel": {
                    target: "books",
                    actions: assign({
                        books: ({ context: { books } }) => {
                            return { ...books, one: undefined };
                        },
                    }),
                },
                "book.authors.change": {
                    target: "book_authors",
                },
                "book.authors.edit": {
                    target: "authors_edit",
                },
                "book.authors.remove": {
                    target: "books_edit_ready",
                    actions: assign({
                        books: ({ event, context: { books } }) => {
                            const { id } = event as Extract<
                                EntityEvent,
                                { type: "book.authors.remove" }
                            >;
                            const { one } = books;
                            return {
                                ...books,
                                one: {
                                    ...one!,
                                    authors: one!.authors.filter(
                                        (v) => v.id !== id
                                    ),
                                },
                            };
                        },
                    }),
                },
                "book.genres.change": {
                    target: "book_genres",
                },
                "book.genres.edit": {
                    target: "genres_edit",
                },
                "book.genres.remove": {
                    target: "books_edit_ready",
                    actions: assign({
                        books: ({ event, context: { books } }) => {
                            const { id } = event as Extract<
                                EntityEvent,
                                { type: "book.genres.remove" }
                            >;
                            const { one } = books;
                            return {
                                ...books,
                                one: {
                                    ...one!,
                                    genres: one!.genres.filter(
                                        (v) => v.id !== id
                                    ),
                                },
                            };
                        },
                    }),
                },
                "book.tags.change": {
                    target: "book_tags",
                },
                "book.tags.edit": {
                    target: "tags_edit",
                },
                "book.tags.remove": {
                    target: "books_edit_ready",
                    actions: assign({
                        books: ({ event, context: { books } }) => {
                            const { id } = event as Extract<
                                EntityEvent,
                                { type: "book.tags.remove" }
                            >;
                            const { one } = books;
                            return {
                                ...books,
                                one: {
                                    ...one!,
                                    tags: one!.tags.filter((v) => v.id !== id),
                                },
                            };
                        },
                    }),
                },
                "edition.create": {
                    target: "edition_langs",
                    actions: assign({
                        editions: ({ context: { books, editions } }) => {
                            const { one } = books;
                            return {
                                ...editions,
                                one: {
                                    isbn: "",
                                    pages: 0,
                                    year: new Date().getFullYear(),
                                    book: one!.id!,
                                },
                            };
                        },
                    }),
                },
                "edition.edit": {
                    target: "edition_langs",
                    actions: assign({
                        editions: ({ event, context: { editions, books } }) => {
                            const { id } = event as Extract<
                                EntityEvent,
                                { type: "edition.edit" }
                            >;
                            const { one } = books;
                            const i = one!.editions.findIndex(
                                (v) => v.id === id
                            );
                            return {
                                ...editions,
                                one: one!.editions[i],
                                many: [],
                            };
                        },
                    }),
                },
                "edition.remove": {
                    target: "books_edit_ready",
                    actions: assign({
                        books: ({ event, context: { books } }) => {
                            const { id } = event as Extract<
                                EntityEvent,
                                { type: "edition.remove" }
                            >;
                            const { one } = books;
                            return {
                                ...books,
                                one: {
                                    ...one!,
                                    editions: one!.editions.filter(
                                        (v) => v.id !== id
                                    ),
                                },
                            };
                        },
                        editions: ({ event, context: { books, editions } }) => {
                            const { id } = event as Extract<
                                EntityEvent,
                                { type: "edition.remove" }
                            >;
                            const { one } = books;
                            const i = one!.editions.findIndex(
                                (v) => v.id === id
                            );
                            const e = one!.editions[i];
                            return {
                                ...editions,
                                many: editions.many.concat(e),
                            };
                        },
                    }),
                },
            },
        },
        edition_langs: {
            invoke: {
                src: "lang_list",
                onDone: {
                    target: "edition_publishers",
                    actions: assign({
                        langs: ({ event, context: { langs } }) => {
                            return {
                                ...langs,
                                many: event.output,
                            };
                        },
                    }),
                },
            },
        },
        edition_publishers: {
            invoke: {
                src: "publisher_list",
                onDone: {
                    target: "edition_ready",
                    actions: assign({
                        publishers: ({ event, context: { publishers } }) => {
                            return {
                                ...publishers,
                                many: event.output,
                            };
                        },
                    }),
                },
            },
        },
        edition_ready: {
            on: {
                "edition.change": {
                    target: "edition_ready",
                    actions: assign({
                        editions: ({ event, context: { editions } }) => {
                            const { isbn, pages, year, lang, publisher } =
                                event as Extract<
                                    EntityEvent,
                                    { type: "edition.change" }
                                >;
                            const { one } = editions;
                            return {
                                ...editions,
                                one: {
                                    ...one!,
                                    isbn,
                                    pages,
                                    year,
                                    lang,
                                    publisher,
                                },
                            };
                        },
                    }),
                },
                "edition.save": {
                    target: "books_edit_ready",
                    actions: assign({
                        books: ({ context: { books, editions } }) => {
                            const { one } = editions;
                            const i = books.one!.editions.findIndex(
                                (v) => v.id === one?.id
                            );
                            if (i !== -1) {
                                books.one!.editions[i] = one!;
                            } else {
                                books.one!.editions.push(one!);
                            }
                            return { ...books };
                        },
                    }),
                },

                "edition.cancel": {
                    target: "books_edit_ready",
                },
            },
        },
        editions_save: {
            invoke: {
                src: "edition_save",
                input: ({
                    context: {
                        books: { one },
                    },
                }) => {
                    const { editions } = one!;
                    return { editions };
                },
                onDone: {
                    target: "editions_remove",
                    actions: assign({
                        books: ({ event, context: { books } }) => {
                            const { one } = books;
                            return {
                                ...books,
                                one: {
                                    ...one!,
                                    editions: event.output as Edition[],
                                },
                            };
                        },
                    }),
                },
            },
        },
        editions_remove: {
            invoke: {
                src: "edition_remove",
                input: ({
                    context: {
                        editions: { many },
                    },
                }) => {
                    return { ids: many.map(({ id }) => id!) };
                },
                onDone: {
                    target: "books_save",
                    actions: assign({
                        editions: ({ context: { editions } }) => {
                            return { ...editions, many: [], one: undefined };
                        },
                    }),
                },
            },
        },
        books_remove: {
            description: "Delete selected Book",
            invoke: {
                src: "book_remove",
                input: ({ event }) => {
                    const { id } = event as Extract<
                        EntityEvent,
                        { type: "book.remove" }
                    >;
                    return { id };
                },
                onDone: {
                    target: "books",
                },
            },
        },
        books_save: {
            description: "Apply Book changes to server",
            invoke: {
                src: "book_save",
                input: ({
                    context: {
                        books: { one },
                    },
                }) => {
                    return {
                        book: one! as Book,
                    };
                },
                onDone: {
                    target: "books",
                },
            },
        },
        book_authors: {
            description: "Retrieve authors list from server",
            invoke: {
                src: "author_list",
                onDone: {
                    target: "book_authors_ready",
                    actions: assign({
                        authors: ({
                            event,
                            context: {
                                books: { one },
                            },
                        }) => {
                            const authors = event.output;
                            authors.forEach(
                                (v) =>
                                    (v.selected =
                                        one?.authors.findIndex(
                                            ({ id }) => v.id === id
                                        ) !== -1)
                            );
                            return {
                                many: authors,
                                filtered: event.output,
                            };
                        },
                    }),
                },
            },
        },
        book_authors_ready: {
            description: "Show current Book authors",
            on: {
                "book.list": { target: "books" },
                "book.authors.cancel": { target: "books_edit_ready" },
                "book.authors.select": {
                    target: "book_authors_ready",
                    actions: assign({
                        authors: ({ event, context: { authors } }) => {
                            const { many } = authors;
                            const { id, selected } = event;
                            return {
                                ...authors,
                                many: many.map((v) => {
                                    if (v.id === id) {
                                        v.selected = selected;
                                    }
                                    return v;
                                }),
                            };
                        },
                    }),
                },
                "book.authors.save": {
                    target: "books_edit_ready",
                    actions: assign({
                        books: ({
                            context: {
                                authors: { many },
                                books,
                            },
                        }) => {
                            const { one } = books;
                            return {
                                ...books,
                                one: {
                                    ...one!,
                                    authors: many.filter(
                                        ({ selected }) => selected
                                    ),
                                },
                            };
                        },
                    }),
                },
            },
        },
        book_genres: {
            description: "Retrieve genres list from server",
            invoke: {
                src: "genre_list",
                onDone: {
                    target: "book_genres_ready",
                    actions: assign({
                        genres: ({
                            event,
                            context: {
                                books: { one },
                            },
                        }) => {
                            const genres = event.output;
                            genres.forEach(
                                (v) =>
                                    (v.selected =
                                        one?.genres.findIndex(
                                            ({ id }) => v.id === id
                                        ) !== -1)
                            );
                            return {
                                many: genres,
                                filtered: event.output,
                            };
                        },
                    }),
                },
            },
        },
        book_genres_ready: {
            description: "Show current Book genres",
            on: {
                "book.list": { target: "books" },
                "book.genres.cancel": { target: "books_edit_ready" },
                "book.genres.select": {
                    target: "book_genres_ready",
                    actions: assign({
                        genres: ({ event, context: { genres } }) => {
                            const { many } = genres;
                            const { id, selected } = event;
                            return {
                                ...genres,
                                many: many.map((v) => {
                                    if (v.id === id) {
                                        v.selected = selected;
                                    }
                                    return v;
                                }),
                            };
                        },
                    }),
                },
                "book.genres.save": {
                    target: "books_edit_ready",
                    actions: assign({
                        books: ({
                            context: {
                                genres: { many },
                                books,
                            },
                        }) => {
                            const { one } = books;
                            return {
                                ...books,
                                one: {
                                    ...one!,
                                    genres: many.filter(
                                        ({ selected }) => selected
                                    ),
                                },
                            };
                        },
                    }),
                },
            },
        },
        book_tags: {
            description: "Retrieve tags list from server",
            invoke: {
                src: "tag_list",
                onDone: {
                    target: "book_tags_ready",
                    actions: assign({
                        tags: ({
                            event,
                            context: {
                                books: { one },
                            },
                        }) => {
                            const tags = event.output;
                            tags.forEach(
                                (v) =>
                                    (v.selected =
                                        one?.tags.findIndex(
                                            ({ id }) => v.id === id
                                        ) !== -1)
                            );
                            return {
                                many: tags,
                                filtered: event.output,
                            };
                        },
                    }),
                },
            },
        },
        book_tags_ready: {
            description: "Show current Book tags",
            on: {
                "book.list": { target: "books" },
                "book.tags.cancel": { target: "books_edit_ready" },
                "book.tags.select": {
                    target: "book_tags_ready",
                    actions: assign({
                        tags: ({ event, context: { tags } }) => {
                            const { many } = tags;
                            const { id, selected } = event;
                            return {
                                ...tags,
                                many: many.map((v) => {
                                    if (v.id === id) {
                                        v.selected = selected;
                                    }
                                    return v;
                                }),
                            };
                        },
                    }),
                },
                "book.tags.save": {
                    target: "books_edit_ready",
                    actions: assign({
                        books: ({
                            context: {
                                tags: { many },
                                books,
                            },
                        }) => {
                            const { one } = books;
                            return {
                                ...books,
                                one: {
                                    ...one!,
                                    tags: many.filter(
                                        ({ selected }) => selected
                                    ),
                                },
                            };
                        },
                    }),
                },
            },
        },
        genres: {
            description: "Show genres' list",
            invoke: {
                src: "genre_list",
                onDone: {
                    target: "genres_ready",
                    actions: assign({
                        genres: ({ event }) => {
                            return {
                                many: event.output,
                                filtered: event.output,
                            };
                        },
                    }),
                },
            },
        },
        genres_ready: {
            description: "Genres' list loaded",
            on: {
                "genre.create": {
                    target: "genres_edit_ready",
                    actions: assign({
                        genres: ({ context: { genres } }) => {
                            return {
                                ...genres,
                                one: {
                                    name: "",
                                    books: [],
                                },
                            };
                        },
                    }),
                },
                "genre.filter": {
                    target: "genres_ready",
                    actions: assign({
                        genres: ({ event, context: { genres } }) => {
                            const { many } = genres;
                            const { filter } = event;
                            return {
                                ...genres,
                                filtered: many.filter(
                                    ({ name }) =>
                                        !filter ||
                                        name
                                            .toLocaleLowerCase()
                                            .startsWith(
                                                filter.toLocaleLowerCase()
                                            )
                                ),
                            };
                        },
                    }),
                },
                "genre.edit": { target: "genres_edit" },
                "genre.remove": { target: "genres_remove" },
            },
        },
        genres_edit: {
            description: "View selected Genre",
            invoke: {
                src: "genre_get",
                input: ({ event }) => {
                    const { id } = event as Extract<
                        EntityEvent,
                        { type: "genre.edit" }
                    >;
                    return { id };
                },
                onDone: {
                    target: "genres_edit_ready",
                    actions: assign({
                        genres: ({ event, context: { genres } }) => {
                            return { ...genres, one: event.output };
                        },
                    }),
                },
            },
        },
        genres_edit_ready: {
            description: "Selected Genre loaded",
            on: {
                "genre.change": {
                    target: "genres_edit_ready",
                    actions: assign({
                        genres: ({ event, context: { genres } }) => {
                            const { name } = event as Extract<
                                EntityEvent,
                                { type: "genre.change" }
                            >;
                            const { one } = genres;
                            return {
                                ...genres,
                                one: {
                                    ...one!,
                                    name,
                                },
                            };
                        },
                    }),
                },
                "genre.save": { target: "genres_save" },
                "genre.cancel": {
                    target: "genres",
                    actions: assign({
                        genres: ({ context: { genres } }) => {
                            return { ...genres, one: undefined };
                        },
                    }),
                },
                "genre.books.change": {
                    target: "genre_books",
                },
                "genre.books.edit": {
                    target: "books_edit",
                },
                "genre.books.remove": {
                    target: "genres_edit_ready",
                    actions: assign({
                        genres: ({ event, context: { genres } }) => {
                            const { id } = event as Extract<
                                EntityEvent,
                                { type: "genre.books.remove" }
                            >;
                            const { one } = genres;
                            return {
                                ...genres,
                                one: {
                                    ...one!,
                                    books: one!.books.filter(
                                        (v) => v.id !== id
                                    ),
                                },
                            };
                        },
                    }),
                },
            },
        },
        genres_remove: {
            description: "Delete selected Genre",
            invoke: {
                src: "genre_remove",
                input: ({ event }) => {
                    const { id } = event as Extract<
                        EntityEvent,
                        { type: "genre.remove" }
                    >;
                    return { id };
                },
                onDone: {
                    target: "genres",
                },
            },
        },
        genres_save: {
            description: "Apply Genre changes to server",
            invoke: {
                src: "genre_save",
                input: ({
                    context: {
                        genres: { one },
                    },
                }) => {
                    return {
                        genre: one as Genre,
                    };
                },
                onDone: {
                    target: "genres",
                },
            },
        },
        genre_books: {
            description: "Retrieve books list from server",
            invoke: {
                src: "book_list",
                onDone: {
                    target: "genre_books_ready",
                    actions: assign({
                        books: ({
                            event,
                            context: {
                                genres: { one },
                            },
                        }) => {
                            const books = event.output;
                            books.forEach(
                                (b) =>
                                    (b.selected =
                                        one?.books.findIndex(
                                            ({ id }) => b.id === id
                                        ) !== -1)
                            );
                            return {
                                many: books,
                                filtered: event.output,
                            };
                        },
                    }),
                },
            },
        },
        genre_books_ready: {
            description: "Show current Genre's books",
            on: {
                "genre.list": { target: "genres" },
                "genre.books.cancel": { target: "genres_edit_ready" },
                "genre.books.select": {
                    target: "genre_books_ready",
                    actions: assign({
                        books: ({ event, context: { books } }) => {
                            const { many } = books;
                            const { id, selected } = event;
                            return {
                                ...books,
                                many: many.map((b) => {
                                    if (b.id === id) {
                                        b.selected = selected;
                                    }
                                    return b;
                                }),
                            };
                        },
                    }),
                },
                "genre.books.save": {
                    target: "genres_edit_ready",
                    actions: assign({
                        genres: ({
                            context: {
                                genres,
                                books: { many },
                            },
                        }) => {
                            const { one } = genres;
                            return {
                                ...genres,
                                one: {
                                    ...one!,
                                    books: many.filter(
                                        ({ selected }) => selected
                                    ),
                                },
                            };
                        },
                    }),
                },
            },
        },
        langs: {
            description: "Show langs' list",
            invoke: {
                src: "lang_list",
                onDone: {
                    target: "langs_ready",
                    actions: assign({
                        langs: ({ event }) => {
                            return {
                                many: event.output,
                                filtered: event.output,
                            };
                        },
                    }),
                },
            },
        },
        langs_ready: {
            description: "Langs' list loaded",
            on: {
                "lang.create": {
                    target: "langs_edit_ready",
                    actions: assign({
                        langs: ({ context: { langs } }) => {
                            return {
                                ...langs,
                                one: {
                                    name: "",
                                    books: [],
                                },
                            };
                        },
                    }),
                },
                "lang.filter": {
                    target: "langs_ready",
                    actions: assign({
                        langs: ({ event, context: { langs } }) => {
                            const { many } = langs;
                            const { filter } = event;
                            return {
                                ...langs,
                                filtered: many.filter(
                                    ({ name }) =>
                                        !filter ||
                                        name
                                            .toLocaleLowerCase()
                                            .startsWith(
                                                filter.toLocaleLowerCase()
                                            )
                                ),
                            };
                        },
                    }),
                },
                "lang.edit": { target: "langs_edit" },
                "lang.remove": { target: "langs_remove" },
            },
        },
        langs_edit: {
            description: "View selected Lang",
            invoke: {
                src: "lang_get",
                input: ({ event }) => {
                    const { id } = event as Extract<
                        EntityEvent,
                        { type: "lang.edit" }
                    >;
                    return { id };
                },
                onDone: {
                    target: "langs_edit_ready",
                    actions: assign({
                        langs: ({ event, context: { langs } }) => {
                            return { ...langs, one: event.output };
                        },
                    }),
                },
            },
        },
        langs_edit_ready: {
            description: "Selected Lang loaded",
            on: {
                "lang.change": {
                    target: "langs_edit_ready",
                    actions: assign({
                        langs: ({ event, context: { langs } }) => {
                            const { name } = event as Extract<
                                EntityEvent,
                                { type: "lang.change" }
                            >;
                            const { one } = langs;
                            return {
                                ...langs,
                                one: {
                                    ...one!,
                                    name,
                                },
                            };
                        },
                    }),
                },
                "lang.save": { target: "langs_save" },
                "lang.cancel": {
                    target: "langs",
                    actions: assign({
                        langs: ({ context: { langs } }) => {
                            return { ...langs, one: undefined };
                        },
                    }),
                },
            },
        },
        langs_remove: {
            description: "Delete selected Lang",
            invoke: {
                src: "lang_remove",
                input: ({ event }) => {
                    const { id } = event as Extract<
                        EntityEvent,
                        { type: "lang.remove" }
                    >;
                    return { id };
                },
                onDone: {
                    target: "langs",
                },
            },
        },
        langs_save: {
            description: "Apply Lang changes to server",
            invoke: {
                src: "lang_save",
                input: ({
                    context: {
                        langs: { one },
                    },
                }) => {
                    return {
                        lang: one as Lang,
                    };
                },
                onDone: {
                    target: "langs",
                },
            },
        },
        publishers: {
            description: "Show publishers' list",
            invoke: {
                src: "publisher_list",
                onDone: {
                    target: "publishers_ready",
                    actions: assign({
                        publishers: ({ event }) => {
                            return {
                                many: event.output,
                                filtered: event.output,
                            };
                        },
                    }),
                },
            },
        },
        publishers_ready: {
            description: "Publishers' list loaded",
            on: {
                "publisher.create": {
                    target: "publishers_edit_ready",
                    actions: assign({
                        publishers: ({ context: { publishers } }) => {
                            return {
                                ...publishers,
                                one: {
                                    name: "",
                                    books: [],
                                },
                            };
                        },
                    }),
                },
                "publisher.filter": {
                    target: "publishers_ready",
                    actions: assign({
                        publishers: ({ event, context: { publishers } }) => {
                            const { many } = publishers;
                            const { filter } = event;
                            return {
                                ...publishers,
                                filtered: many.filter(
                                    ({ name }) =>
                                        !filter ||
                                        name
                                            .toLocaleLowerCase()
                                            .startsWith(
                                                filter.toLocaleLowerCase()
                                            )
                                ),
                            };
                        },
                    }),
                },
                "publisher.edit": { target: "publishers_edit" },
                "publisher.remove": { target: "publishers_remove" },
            },
        },
        publishers_edit: {
            description: "View selected Publisher",
            invoke: {
                src: "publisher_get",
                input: ({ event }) => {
                    const { id } = event as Extract<
                        EntityEvent,
                        { type: "publisher.edit" }
                    >;
                    return { id };
                },
                onDone: {
                    target: "publishers_edit_ready",
                    actions: assign({
                        publishers: ({ event, context: { publishers } }) => {
                            return { ...publishers, one: event.output };
                        },
                    }),
                },
            },
        },
        publishers_edit_ready: {
            description: "Selected Publisher loaded",
            on: {
                "publisher.change": {
                    target: "publishers_edit_ready",
                    actions: assign({
                        publishers: ({ event, context: { publishers } }) => {
                            const { name } = event as Extract<
                                EntityEvent,
                                { type: "publisher.change" }
                            >;
                            const { one } = publishers;
                            return {
                                ...publishers,
                                one: {
                                    ...one!,
                                    name,
                                },
                            };
                        },
                    }),
                },
                "publisher.save": { target: "publishers_save" },
                "publisher.cancel": {
                    target: "publishers",
                    actions: assign({
                        publishers: ({ context: { publishers } }) => {
                            return { ...publishers, one: undefined };
                        },
                    }),
                },
            },
        },
        publishers_remove: {
            description: "Delete selected Publisher",
            invoke: {
                src: "publisher_remove",
                input: ({ event }) => {
                    const { id } = event as Extract<
                        EntityEvent,
                        { type: "publisher.remove" }
                    >;
                    return { id };
                },
                onDone: {
                    target: "publishers",
                },
            },
        },
        publishers_save: {
            description: "Apply Publisher changes to server",
            invoke: {
                src: "publisher_save",
                input: ({
                    context: {
                        publishers: { one },
                    },
                }) => {
                    return {
                        publisher: one as Publisher,
                    };
                },
                onDone: {
                    target: "publishers",
                },
            },
        },
        tags: {
            description: "Show tags' list",
            invoke: {
                src: "tag_list",
                onDone: {
                    target: "tags_ready",
                    actions: assign({
                        tags: ({ event }) => {
                            return {
                                many: event.output,
                                filtered: event.output,
                            };
                        },
                    }),
                },
            },
        },
        tags_ready: {
            description: "Tags' list loaded",
            on: {
                "tag.create": {
                    target: "tags_edit_ready",
                    actions: assign({
                        tags: ({ context: { tags } }) => {
                            return {
                                ...tags,
                                one: {
                                    name: "",
                                    books: [],
                                },
                            };
                        },
                    }),
                },
                "tag.filter": {
                    target: "tags_ready",
                    actions: assign({
                        tags: ({ event, context: { tags } }) => {
                            const { many } = tags;
                            const { filter } = event;
                            return {
                                ...tags,
                                filtered: many.filter(
                                    ({ name }) =>
                                        !filter ||
                                        name
                                            .toLocaleLowerCase()
                                            .startsWith(
                                                filter.toLocaleLowerCase()
                                            )
                                ),
                            };
                        },
                    }),
                },
                "tag.edit": { target: "tags_edit" },
                "tag.remove": { target: "tags_remove" },
            },
        },
        tags_edit: {
            description: "View selected Tag",
            invoke: {
                src: "tag_get",
                input: ({ event }) => {
                    const { id } = event as Extract<
                        EntityEvent,
                        { type: "tag.edit" }
                    >;
                    return { id };
                },
                onDone: {
                    target: "tags_edit_ready",
                    actions: assign({
                        tags: ({ event, context: { tags } }) => {
                            return { ...tags, one: event.output };
                        },
                    }),
                },
            },
        },
        tags_edit_ready: {
            description: "Selected Tag loaded",
            on: {
                "tag.change": {
                    target: "tags_edit_ready",
                    actions: assign({
                        tags: ({ event, context: { tags } }) => {
                            const { name } = event as Extract<
                                EntityEvent,
                                { type: "tag.change" }
                            >;
                            const { one } = tags;
                            return {
                                ...tags,
                                one: {
                                    ...one!,
                                    name,
                                },
                            };
                        },
                    }),
                },
                "tag.save": { target: "tags_save" },
                "tag.cancel": {
                    target: "tags",
                    actions: assign({
                        tags: ({ context: { tags } }) => {
                            return { ...tags, one: undefined };
                        },
                    }),
                },
                "tag.books.change": {
                    target: "tag_books",
                },
                "tag.books.edit": {
                    target: "books_edit",
                },
                "tag.books.remove": {
                    target: "tags_edit_ready",
                    actions: assign({
                        tags: ({ event, context: { tags } }) => {
                            const { id } = event as Extract<
                                EntityEvent,
                                { type: "tag.books.remove" }
                            >;
                            const { one } = tags;
                            return {
                                ...tags,
                                one: {
                                    ...one!,
                                    books: one!.books.filter(
                                        (v) => v.id !== id
                                    ),
                                },
                            };
                        },
                    }),
                },
            },
        },
        tags_remove: {
            description: "Delete selected Tag",
            invoke: {
                src: "tag_remove",
                input: ({ event }) => {
                    const { id } = event as Extract<
                        EntityEvent,
                        { type: "tag.remove" }
                    >;
                    return { id };
                },
                onDone: {
                    target: "tags",
                },
            },
        },
        tags_save: {
            description: "Apply Tag changes to server",
            invoke: {
                src: "tag_save",
                input: ({
                    context: {
                        tags: { one },
                    },
                }) => {
                    return {
                        tag: one as Tag,
                    };
                },
                onDone: {
                    target: "tags",
                },
            },
        },
        tag_books: {
            description: "Retrieve books list from server",
            invoke: {
                src: "book_list",
                onDone: {
                    target: "tag_books_ready",
                    actions: assign({
                        books: ({
                            event,
                            context: {
                                tags: { one },
                            },
                        }) => {
                            const books = event.output;
                            books.forEach(
                                (b) =>
                                    (b.selected =
                                        one?.books.findIndex(
                                            ({ id }) => b.id === id
                                        ) !== -1)
                            );
                            return {
                                many: books,
                                filtered: event.output,
                            };
                        },
                    }),
                },
            },
        },
        tag_books_ready: {
            description: "Show current Tag's books",
            on: {
                "tag.list": { target: "tags" },
                "tag.books.cancel": { target: "tags_edit_ready" },
                "tag.books.select": {
                    target: "tag_books_ready",
                    actions: assign({
                        books: ({ event, context: { books } }) => {
                            const { many } = books;
                            const { id, selected } = event;
                            return {
                                ...books,
                                many: many.map((b) => {
                                    if (b.id === id) {
                                        b.selected = selected;
                                    }
                                    return b;
                                }),
                            };
                        },
                    }),
                },
                "tag.books.save": {
                    target: "tags_edit_ready",
                    actions: assign({
                        tags: ({
                            context: {
                                tags,
                                books: { many },
                            },
                        }) => {
                            const { one } = tags;
                            return {
                                ...tags,
                                one: {
                                    ...one!,
                                    books: many.filter(
                                        ({ selected }) => selected
                                    ),
                                },
                            };
                        },
                    }),
                },
            },
        },
    },
});

export const actor = createActor(fsm);
