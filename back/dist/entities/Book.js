"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const core_1 = require("@mikro-orm/core");
const Author_1 = require("./Author");
const Genre_1 = require("./Genre");
const Tag_1 = require("./Tag");
const Edition_1 = require("./Edition");
exports.Book = (0, core_1.defineEntity)({
    name: "Book",
    properties: {
        id: core_1.p.uuid().primary().defaultRaw("uuid_generate_v4()"),
        title: core_1.p.text(),
        originalTitle: core_1.p.text().nullable(),
        authors: () => core_1.p
            .manyToMany(Author_1.Author)
            .joinColumn("book_id")
            .inverseJoinColumn("author_id")
            .cascade(core_1.Cascade.PERSIST),
        genres: () => core_1.p
            .manyToMany(Genre_1.Genre)
            .joinColumn("book_id")
            .inverseJoinColumn("genre_id")
            .cascade(core_1.Cascade.PERSIST),
        tags: () => core_1.p
            .manyToMany(Tag_1.Tag)
            .joinColumn("book_id")
            .inverseJoinColumn("tag_id")
            .cascade(core_1.Cascade.PERSIST),
        editions: () => core_1.p.oneToMany(Edition_1.Edition).mappedBy("book").cascade(core_1.Cascade.PERSIST),
    },
});
//# sourceMappingURL=Book.js.map