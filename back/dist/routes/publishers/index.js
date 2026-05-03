"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("@app/db");
const core_1 = require("@mikro-orm/core");
const publishers = async (fastify, opts) => {
    const db = (0, db_1.initORM)();
    fastify.get("/", async function (request, reply) {
        const publishers = await db.publisher.find({}, { orderBy: { name: "ASC" } });
        return publishers;
    });
    fastify.get("/:id", async function (request, reply) {
        const publisher = await db.publisher.findOne({
            id: request.params.id,
        }, { populate: ["editions"] });
        return publisher;
    });
    fastify.post("/", async (request) => {
        const e = await db.publisher.create(request.body);
        await db.em.flush();
        return e;
    });
    fastify.patch("/:id", async (request) => {
        const e = await db.publisher.findOneOrFail(request.params.id);
        (0, core_1.wrap)(e).assign(request.body);
        await db.em.flush();
        return { success: true };
    });
    fastify.delete("/:id", async (request) => {
        const e = await db.publisher.findOne(request.params.id);
        if (!e) {
            return { notFound: true };
        }
        await db.em.remove(e).flush();
        return { success: true };
    });
};
exports.default = publishers;
//# sourceMappingURL=index.js.map