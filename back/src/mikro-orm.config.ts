import { defineConfig } from "@mikro-orm/postgresql";
import { EntityGenerator } from "@mikro-orm/entity-generator";
import { Author } from "./entities/Author";
import { Book } from "./entities/Book";
import { Edition } from "./entities/Edition";
import { Genre } from "./entities/Genre";
import { Lang } from "./entities/Lang";
import { Publisher } from "./entities/Publisher";
import { Tag } from "./entities/Tag";
import fs from "node:fs";

function readPassword() {
    try {
        const f = process.env.DB_PASSWORD_FILE;
        if (f) {
            const data = fs.readFileSync(f, "utf-8");
            return data;
        } else {
            throw new Error("Invalid password file path");
        }
    } catch (e) {
        throw new Error("Failed to read password file");
    }
}

export function getConfig() {
    const { DB_USER, DB_PORT, DB_HOST, DB_NAME, DB_SCHEMA } = process.env;
    const password = readPassword();
    return defineConfig({
        dbName: DB_NAME,
        user: DB_USER,
        password,
        host: DB_HOST,
        port: +DB_PORT!,
        schema: DB_SCHEMA,
        extensions: [EntityGenerator],
        entities: [Author, Book, Edition, Genre, Lang, Publisher, Tag],
    });
}
