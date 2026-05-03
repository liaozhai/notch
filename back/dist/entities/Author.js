"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Author = void 0;
const core_1 = require("@mikro-orm/core");
const Book_1 = require("./Book");
exports.Author = (0, core_1.defineEntity)({
    name: "Author",
    properties: {
        id: core_1.p.uuid().primary().defaultRaw("uuid_generate_v4()"),
        firstName: core_1.p.text(),
        middleName: core_1.p.text().nullable(),
        lastName: core_1.p.text(),
        originalName: core_1.p.text().nullable(),
        books: core_1.p.manyToMany(Book_1.Book).mappedBy("authors").cascade(core_1.Cascade.PERSIST),
    },
});
//# sourceMappingURL=Author.js.map