import { Cascade, defineEntity, InferEntity, p } from "@mikro-orm/core";
import { Book } from "./Book";

export const Author = defineEntity({
    name: "Author",
    properties: {
        id: p.uuid().primary().defaultRaw("uuid_generate_v4()"),
        firstName: p.text(),
        middleName: p.text().nullable(),
        lastName: p.text(),
        originalName: p.text().nullable(),
        books: p.manyToMany(Book).mappedBy("authors").cascade(Cascade.PERSIST),
    },
});

export type IAuthor = InferEntity<typeof Author>;
