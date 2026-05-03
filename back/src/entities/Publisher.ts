import { defineEntity, InferEntity, p } from "@mikro-orm/core";
import { Edition } from "./Edition";

export const Publisher = defineEntity({
    name: "Publisher",
    properties: {
        id: p.uuid().primary().defaultRaw("uuid_generate_v4()"),
        name: p.text(),
        editions: () => p.oneToMany(Edition).mappedBy("publisher"),
    },
});

export type IPublisher = InferEntity<typeof Publisher>;
