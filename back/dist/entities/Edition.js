"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Edition = exports.IsbnType = void 0;
const core_1 = require("@mikro-orm/core");
const Book_1 = require("./Book");
const Lang_1 = require("./Lang");
const Publisher_1 = require("./Publisher");
class IsbnType extends core_1.Type {
    convertToDatabaseValue(value, platform, context) {
        if (!/^(\d{1,5}[- ])?(\d{1,7}[- ])?(\d{1,6}[- ])?\d{1,9}[- ](\d|X)$/i.test(value) &&
            !/^(97(8|9))?\d{9}(\d|X)$/.test(value.replace(/[- ]/g, ""))) {
            throw new Error("Invalid ISBN format");
        }
        return value;
    }
    convertToJSValue(value) {
        return value;
    }
    getColumnType(prop, platform) {
        return "char(17)";
    }
}
exports.IsbnType = IsbnType;
exports.Edition = (0, core_1.defineEntity)({
    name: "Edition",
    properties: {
        id: core_1.p.uuid().primary().defaultRaw("uuid_generate_v4()"),
        isbn: core_1.p.type(IsbnType).length(17).unique(),
        pages: core_1.p.integer().nullable(),
        year: core_1.p.integer().nullable(),
        book: () => core_1.p
            .manyToOne(Book_1.Book)
            .ref()
            .updateRule("no action")
            .deleteRule("no action"),
        lang: () => core_1.p
            .manyToOne(Lang_1.Lang)
            .ref()
            .updateRule("no action")
            .deleteRule("no action"),
        publisher: () => core_1.p
            .manyToOne(Publisher_1.Publisher)
            .ref()
            .updateRule("no action")
            .deleteRule("no action"),
    },
});
//# sourceMappingURL=Edition.js.map