"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initORM = initORM;
const postgresql_1 = require("@mikro-orm/postgresql");
const mikro_orm_config_js_1 = __importDefault(require("./mikro-orm.config.js"));
const Author_1 = require("./entities/Author");
const Book_1 = require("./entities/Book");
const Edition_1 = require("./entities/Edition");
const Genre_1 = require("./entities/Genre");
const Lang_1 = require("./entities/Lang");
const Publisher_1 = require("./entities/Publisher");
const Tag_1 = require("./entities/Tag");
let cache;
function initORM(options) {
    if (cache) {
        return cache;
    }
    const orm = new postgresql_1.MikroORM({
        ...mikro_orm_config_js_1.default,
        ...options,
    });
    return (cache = {
        orm,
        em: orm.em,
        author: orm.em.getRepository(Author_1.Author),
        book: orm.em.getRepository(Book_1.Book),
        edition: orm.em.getRepository(Edition_1.Edition),
        genre: orm.em.getRepository(Genre_1.Genre),
        lang: orm.em.getRepository(Lang_1.Lang),
        publisher: orm.em.getRepository(Publisher_1.Publisher),
        tag: orm.em.getRepository(Tag_1.Tag),
    });
}
//# sourceMappingURL=db.js.map