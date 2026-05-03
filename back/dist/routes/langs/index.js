"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("@app/db");
const core_1 = require("@mikro-orm/core");
const langs = async (fastify, opts) => {
    const db = (0, db_1.initORM)();
    fastify.get("/", async function (request, reply) {
        const langs = await db.lang.find({}, { orderBy: { name: "ASC" } });
        return langs;
    });
    fastify.get("/:id", async function (request, reply) {
        const lang = await db.lang.findOne({
            id: request.params.id,
        }, { populate: ["editions"] });
        return lang;
    });
    fastify.post("/", async (request) => {
        const e = await db.lang.create(request.body);
        await db.em.flush();
        return e;
    });
    fastify.patch("/:id", async (request) => {
        const e = await db.lang.findOneOrFail(request.params.id);
        (0, core_1.wrap)(e).assign(request.body);
        await db.em.flush();
        return { success: true };
    });
    fastify.delete("/:id", async (request) => {
        const e = await db.lang.findOne(request.params.id);
        if (!e) {
            return { notFound: true };
        }
        await db.em.remove(e).flush();
        return { success: true };
    });
};
exports.default = langs;
//# sourceMappingURL=index.js.map