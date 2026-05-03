"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("@app/db");
const core_1 = require("@mikro-orm/core");
const editions = async (fastify, opts) => {
    const db = (0, db_1.initORM)();
    fastify.get("/", async function (request, reply) {
        const editions = await db.edition.find({}, { populate: ["book", "lang", "publisher"] });
        return editions;
    });
    fastify.get("/:id", async function (request, reply) {
        const edition = await db.edition.findOne({
            id: request.params.id,
        }, { populate: ["book", "lang", "publisher"] });
        return edition;
    });
    fastify.post("/", async (request) => {
        const e = await db.edition.create(request.body);
        await db.em.flush();
        return e;
    });
    fastify.patch("/:id", async (request) => {
        const e = await db.edition.findOneOrFail(request.params.id);
        (0, core_1.wrap)(e).assign(request.body);
        await db.em.flush();
        return e;
    });
    fastify.delete("/:id", async (request) => {
        const e = await db.edition.findOne(request.params.id);
        if (!e) {
            return { notFound: true };
        }
        await db.em.remove(e).flush();
        return { success: true };
    });
};
exports.default = editions;
//# sourceMappingURL=index.js.map