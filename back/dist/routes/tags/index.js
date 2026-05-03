"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const db_1 = require("@app/db");
const tags = async (fastify, opts) => {
    const db = (0, db_1.initORM)();
    fastify.get("/", async () => await db.tag.find({}, { orderBy: { name: "ASC" } }));
    fastify.get("/:id", async (request) => await db.tag.findOne({
        id: request.params.id,
    }, { populate: ["books"] }));
    fastify.post("/", async (request) => {
        const e = await db.tag.create(request.body);
        await db.em.flush();
        return e;
    });
    fastify.patch("/:id", async (request) => {
        const e = await db.tag.findOneOrFail(request.params.id);
        (0, core_1.wrap)(e).assign(request.body);
        await db.em.flush();
        return { success: true };
    });
    fastify.delete("/:id", async (request) => {
        const e = await db.tag.findOne(request.params.id);
        if (!e) {
            return { notFound: true };
        }
        await db.em.remove(e).flush();
        return { success: true };
    });
};
exports.default = tags;
//# sourceMappingURL=index.js.map