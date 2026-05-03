import { FastifyPluginAsync } from "fastify";
import { wrap, type EntityData } from "@mikro-orm/core";
import { initORM } from "@app/db";
import { ITag } from "@app/entities/Tag";

const tags: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const db = initORM();
    fastify.get(
        "/",
        async () => await db.tag.find({}, { orderBy: { name: "ASC" } })
    );
    fastify.get<{ Params: { id: string } }>(
        "/:id",
        async (request) =>
            await db.tag.findOne(
                {
                    id: request.params.id,
                },
                { populate: ["books"] }
            )
    );
    fastify.post<{
        Body: ITag;
    }>("/", async (request) => {
        const e = await db.tag.create(request.body);
        await db.em.flush();
        return e;
    });
    fastify.patch<{
        Params: { id: string };
    }>("/:id", async (request) => {
        const e = await db.tag.findOneOrFail(request.params.id);
        wrap(e).assign(request.body as EntityData<ITag>);
        await db.em.flush();
        return { success: true };
    });
    fastify.delete<{ Params: { id: string } }>("/:id", async (request) => {
        const e = await db.tag.findOne(request.params.id);
        if (!e) {
            return { notFound: true };
        }
        await db.em.remove(e).flush();
        return { success: true };
    });
};

export default tags;
