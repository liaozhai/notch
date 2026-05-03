"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("@app/db");
const core_1 = require("@mikro-orm/core");
const authors = async (fastify, opts) => {
    const db = (0, db_1.initORM)();
    fastify.get("/", async () => await db.author.find({}, { orderBy: { lastName: "ASC" } }));
    fastify.get("/:id", async (request) => await db.author.findOne({
        id: request.params.id,
    }, { populate: ["books"] }));
    fastify.post("/", async (request) => {
        const e = await db.author.create(request.body);
        await db.em.flush();
        return e;
    });
    fastify.patch("/:id", async (request) => {
        const e = await db.author.findOneOrFail(request.params.id);
        (0, core_1.wrap)(e).assign(request.body);
        await db.em.flush();
        return { success: true };
    });
    fastify.delete("/:id", async (request) => {
        const e = await db.author.findOne(request.params.id);
        if (!e) {
            return { notFound: true };
        }
        await db.em.remove(e).flush();
        return { success: true };
    });
};
exports.default = authors;
//# sourceMappingURL=index.js.map