import { FastifyPluginAsync } from "fastify";
import { initORM } from "@app/db";
import { wrap, type EntityData } from "@mikro-orm/core";
import { IAuthor } from "@app/entities/Author";

const authors: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const db = initORM();
    fastify.get(
        "/",
        async () => await db.author.find({}, { orderBy: { lastName: "ASC" } })
    );
    fastify.get<{ Params: { id: string } }>(
        "/:id",
        async (request) =>
            await db.author.findOne(
                {
                    id: request.params.id,
                },
                { populate: ["books"] }
            )
    );
    fastify.post<{
        Body: IAuthor;
    }>("/", async (request) => {
        const e = await db.author.create(request.body);
        await db.em.flush();
        return e;
    });
    fastify.patch<{
        Params: { id: string };
    }>("/:id", async (request) => {
        const e = await db.author.findOneOrFail(request.params.id);
        wrap(e).assign(request.body as EntityData<IAuthor>);
        await db.em.flush();
        return { success: true };
    });
    fastify.delete<{ Params: { id: string } }>("/:id", async (request) => {
        const e = await db.author.findOne(request.params.id);
        if (!e) {
            return { notFound: true };
        }
        await db.em.remove(e).flush();
        return { success: true };
    });
};

export default authors;
