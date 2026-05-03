import { FastifyPluginAsync } from "fastify";
import { initORM } from "@app/db";
import { wrap, type EntityData } from "@mikro-orm/core";
import { ILang } from "@app/entities/Lang";

const langs: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const db = initORM();
    fastify.get("/", async function (request, reply) {
        const langs = await db.lang.find({}, { orderBy: { name: "ASC" } });
        return langs;
    });
    fastify.get<{ Params: { id: string } }>(
        "/:id",
        async function (request, reply) {
            const lang = await db.lang.findOne(
                {
                    id: request.params.id,
                },
                { populate: ["editions"] }
            );
            return lang;
        }
    );
    fastify.post<{
        Body: ILang;
    }>("/", async (request) => {
        const e = await db.lang.create(request.body);
        await db.em.flush();
        return e;
    });
    fastify.patch<{
        Params: { id: string };
    }>("/:id", async (request) => {
        const e = await db.lang.findOneOrFail(request.params.id);
        wrap(e).assign(request.body as EntityData<ILang>);
        await db.em.flush();
        return { success: true };
    });
    fastify.delete<{ Params: { id: string } }>("/:id", async (request) => {
        const e = await db.lang.findOne(request.params.id);
        if (!e) {
            return { notFound: true };
        }
        await db.em.remove(e).flush();
        return { success: true };
    });
};

export default langs;
