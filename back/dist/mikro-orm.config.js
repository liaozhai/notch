"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgresql_1 = require("@mikro-orm/postgresql");
const entity_generator_1 = require("@mikro-orm/entity-generator");
const Author_1 = require("./entities/Author");
const Book_1 = require("./entities/Book");
const Edition_1 = require("./entities/Edition");
const Genre_1 = require("./entities/Genre");
const Lang_1 = require("./entities/Lang");
const Publisher_1 = require("./entities/Publisher");
const Tag_1 = require("./entities/Tag");
exports.default = (0, postgresql_1.defineConfig)({
    dbName: "notch",
    user: "postgres",
    password: "postgres",
    host: "db",
    port: 5432,
    schema: "library",
    extensions: [entity_generator_1.EntityGenerator],
    entities: [Author_1.Author, Book_1.Book, Edition_1.Edition, Genre_1.Genre, Lang_1.Lang, Publisher_1.Publisher, Tag_1.Tag],
});
//# sourceMappingURL=mikro-orm.config.js.map