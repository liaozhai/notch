import { defineEntity, InferEntity, p } from "@mikro-orm/core";
import { Book } from "./Book";

export const Tag = defineEntity({
    name: "Tag",
    properties: {
        id: p.uuid().primary().defaultRaw("uuid_generate_v4()"),
        name: p.text(),
        books: () => p.manyToMany(Book).mappedBy("tags"),
    },
});

export type ITag = InferEntity<typeof Tag>;
