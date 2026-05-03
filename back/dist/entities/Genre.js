"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Genre = void 0;
const core_1 = require("@mikro-orm/core");
const Book_1 = require("./Book");
exports.Genre = (0, core_1.defineEntity)({
    name: "Genre",
    properties: {
        id: core_1.p.uuid().primary().defaultRaw("uuid_generate_v4()"),
        name: core_1.p.text(),
        books: () => core_1.p.manyToMany(Book_1.Book).mappedBy("genres").cascade(core_1.Cascade.PERSIST),
    },
});
//# sourceMappingURL=Genre.js.map