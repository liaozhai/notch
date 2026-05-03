import { defineEntity, InferEntity, p } from "@mikro-orm/core";
import { Edition } from "./Edition";

export const Lang = defineEntity({
    name: "Lang",
    properties: {
        id: p.uuid().primary().defaultRaw("uuid_generate_v4()"),
        name: p.text(),
        editions: () => p.oneToMany(Edition).mappedBy("lang"),
    },
});

export type ILang = InferEntity<typeof Lang>;
