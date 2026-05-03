"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("@app/db");
const core_1 = require("@mikro-orm/core");
const books = async (fastify, opts) => {
    const db = (0, db_1.initORM)();
    fastify.get("/", async () => await db.book.find({}, { orderBy: { title: "ASC" } }));
    fastify.get("/:id", async (request) => await db.book.findOne(request.params.id, {
        populate: ["authors", "editions", "genres", "tags"],
    }));
    fastify.post("/", async (request) => {
        const e = await db.book.create(request.body);
        await db.em.flush();
        return e;
    });
    fastify.patch("/:id", async (request) => {
        const e = await db.book.findOneOrFail(request.params.id);
        (0, core_1.wrap)(e).assign(request.body);
        await db.em.flush();
        return { success: true };
    });
    fastify.delete("/:id", async (request) => {
        const e = await db.book.findOne(request.params.id);
        if (!e) {
            return { notFound: true };
        }
        await db.em.remove(e).flush();
        return { success: true };
    });
};
exports.default = books;
//# sourceMappingURL=index.js.map