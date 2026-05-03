import { Cascade, defineEntity, InferEntity, p } from "@mikro-orm/core";
import { Author } from "./Author";
import { Genre } from "./Genre";
import { Tag } from "./Tag";
import { Edition } from "./Edition";

export const Book = defineEntity({
    name: "Book",
    properties: {
        id: p.uuid().primary().defaultRaw("uuid_generate_v4()"),
        title: p.text(),
        originalTitle: p.text().nullable(),
        authors: () =>
            p
                .manyToMany(Author)
                .joinColumn("book_id")
                .inverseJoinColumn("author_id")
                .cascade(Cascade.PERSIST),
        genres: () =>
            p
                .manyToMany(Genre)
                .joinColumn("book_id")
                .inverseJoinColumn("genre_id")
                .cascade(Cascade.PERSIST),
        tags: () =>
            p
                .manyToMany(Tag)
                .joinColumn("book_id")
                .inverseJoinColumn("tag_id")
                .cascade(Cascade.PERSIST),
        editions: () =>
            p.oneToMany(Edition).mappedBy("book").cascade(Cascade.PERSIST),
    },
});

export type IBook = InferEntity<typeof Book>;
