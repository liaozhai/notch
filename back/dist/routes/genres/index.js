"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("@app/db");
const core_1 = require("@mikro-orm/core");
const genres = async (fastify, opts) => {
    const db = (0, db_1.initORM)();
    fastify.get("/", async () => await db.genre.find({}, { orderBy: { name: "ASC" } }));
    fastify.get("/:id", async (request) => await db.genre.findOne({
        id: request.params.id,
    }, { populate: ["books"] }));
    fastify.post("/", async (request) => {
        const e = await db.genre.create(request.body);
        await db.em.flush();
        return e;
    });
    fastify.patch("/:id", async (request) => {
        const e = await db.genre.findOneOrFail(request.params.id);
        (0, core_1.wrap)(e).assign(request.body);
        await db.em.flush();
        return { success: true };
    });
    fastify.delete("/:id", async (request) => {
        const e = await db.genre.findOne(request.params.id);
        if (!e) {
            return { notFound: true };
        }
        await db.em.remove(e).flush();
        return { success: true };
    });
};
exports.default = genres;
//# sourceMappingURL=index.js.map