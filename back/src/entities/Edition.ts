import {
    defineEntity,
    InferEntity,
    p,
    Type,
    EntityProperty,
    Platform,
    TransformContext,
} from "@mikro-orm/core";
import { Book } from "./Book";
import { Lang } from "./Lang";
import { Publisher } from "./Publisher";

export class IsbnType extends Type<string, string> {
    convertToDatabaseValue(
        value: string,
        platform: Platform,
        context?: TransformContext
    ): string {
        if (
            !/^(\d{1,5}[- ])?(\d{1,7}[- ])?(\d{1,6}[- ])?\d{1,9}[- ](\d|X)$/i.test(
                value
            ) &&
            !/^(97(8|9))?\d{9}(\d|X)$/.test(value.replace(/[- ]/g, ""))
        ) {
            throw new Error("Invalid ISBN format");
        }
        return value;
    }
    convertToJSValue(value: string): string {
        return value;
    }

    getColumnType(prop: EntityProperty, platform: Platform): string {
        return "char(17)";
    }
}

export const Edition = defineEntity({
    name: "Edition",
    properties: {
        id: p.uuid().primary().defaultRaw("uuid_generate_v4()"),
        isbn: p.type(IsbnType).length(17).unique(),
        pages: p.integer().nullable(),
        year: p.integer().nullable(),
        book: () =>
            p
                .manyToOne(Book)
                .ref()
                .updateRule("no action")
                .deleteRule("no action"),
        lang: () =>
            p
                .manyToOne(Lang)
                .ref()
                .updateRule("no action")
                .deleteRule("no action"),
        publisher: () =>
            p
                .manyToOne(Publisher)
                .ref()
                .updateRule("no action")
                .deleteRule("no action"),
    },
});

export type IEdition = InferEntity<typeof Edition>;
