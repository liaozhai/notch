import {
    MikroORM,
    type Options,
    EntityManager,
    EntityRepository,
} from "@mikro-orm/postgresql";
import config from "./mikro-orm.config.js";
import { Author, IAuthor } from "./entities/Author";
import { Book, IBook } from "./entities/Book";
import { Edition, IEdition } from "./entities/Edition";
import { Genre, IGenre } from "./entities/Genre";
import { Lang, ILang } from "./entities/Lang";
import { Publisher, IPublisher } from "./entities/Publisher";
import { Tag, ITag } from "./entities/Tag";

export interface Services {
    orm: MikroORM;
    em: EntityManager;
    author: EntityRepository<IAuthor>;
    book: EntityRepository<IBook>;
    edition: EntityRepository<IEdition>;
    genre: EntityRepository<IGenre>;
    lang: EntityRepository<ILang>;
    publisher: EntityRepository<IPublisher>;
    tag: EntityRepository<ITag>;
}

let cache: Services;

export function initORM(options?: Partial<Options>): Services {
    if (cache) {
        return cache;
    }

    const orm = new MikroORM({
        ...config,
        ...options,
    });

    // save to cache before returning
    return (cache = {
        orm,
        em: orm.em,
        author: orm.em.getRepository(Author),
        book: orm.em.getRepository(Book),
        edition: orm.em.getRepository(Edition),
        genre: orm.em.getRepository(Genre),
        lang: orm.em.getRepository(Lang),
        publisher: orm.em.getRepository(Publisher),
        tag: orm.em.getRepository(Tag),
    });
}
