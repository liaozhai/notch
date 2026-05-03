import { defineConfig } from "@mikro-orm/postgresql";
import { EntityGenerator } from "@mikro-orm/entity-generator";
import { Author } from "./entities/Author";
import { Book } from "./entities/Book";
import { Edition } from "./entities/Edition";
import { Genre } from "./entities/Genre";
import { Lang } from "./entities/Lang";
import { Publisher } from "./entities/Publisher";
import { Tag } from "./entities/Tag";

export default defineConfig({
    dbName: "notch",
    user: "postgres",
    password: "postgres",
    host: "db",
    port: 5432,
    schema: "library",
    extensions: [EntityGenerator],
    entities: [Author, Book, Edition, Genre, Lang, Publisher, Tag],
});
