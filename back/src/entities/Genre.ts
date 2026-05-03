import { Cascade, defineEntity, InferEntity, p } from "@mikro-orm/core";
import { Book } from "./Book";

export const Genre = defineEntity({
    name: "Genre",
    properties: {
        id: p.uuid().primary().defaultRaw("uuid_generate_v4()"),
        name: p.text(),
        books: () =>
            p.manyToMany(Book).mappedBy("genres").cascade(Cascade.PERSIST),
    },
});

export type IGenre = InferEntity<typeof Genre>;
