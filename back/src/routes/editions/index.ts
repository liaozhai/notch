import { FastifyPluginAsync } from "fastify";
import { initORM } from "@app/db";
import { IEdition } from "@app/entities/Edition";
import { wrap, type EntityData } from "@mikro-orm/core";

const editions: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const db = initORM();
    fastify.get("/", async function (request, reply) {
        const editions = await db.edition.find(
            {},
            { populate: ["book", "lang", "publisher"] }
        );
        return editions;
    });
    fastify.get<{ Params: { id: string } }>(
        "/:id",
        async function (request, reply) {
            const edition = await db.edition.findOne(
                {
                    id: request.params.id,
                },
                { populate: ["book", "lang", "publisher"] }
            );
            return edition;
        }
    );
    fastify.post<{
        Body: IEdition;
    }>("/", async (request) => {
        const e = await db.edition.create(request.body);
        await db.em.flush();
        return e;
    });
    fastify.patch<{
        Params: { id: string };
    }>("/:id", async (request) => {
        const e = await db.edition.findOneOrFail(request.params.id);
        wrap(e).assign(request.body as EntityData<IEdition>);
        await db.em.flush();
        return e;
    });
    fastify.delete<{ Params: { id: string } }>("/:id", async (request) => {
        const e = await db.edition.findOne(request.params.id);
        if (!e) {
            return { notFound: true };
        }
        await db.em.remove(e).flush();
        return { success: true };
    });
};

export default editions;
