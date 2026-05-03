import { FastifyPluginAsync } from "fastify";
import { initORM } from "@app/db";
import { wrap, type EntityData } from "@mikro-orm/core";
import { IGenre } from "@app/entities/Genre";

const genres: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const db = initORM();
    fastify.get(
        "/",
        async () => await db.genre.find({}, { orderBy: { name: "ASC" } })
    );
    fastify.get<{ Params: { id: string } }>(
        "/:id",
        async (request) =>
            await db.genre.findOne(
                {
                    id: request.params.id,
                },
                { populate: ["books"] }
            )
    );
    fastify.post<{
        Body: IGenre;
    }>("/", async (request) => {
        const e = await db.genre.create(request.body);
        await db.em.flush();
        return e;
    });
    fastify.patch<{
        Params: { id: string };
    }>("/:id", async (request) => {
        const e = await db.genre.findOneOrFail(request.params.id);
        wrap(e).assign(request.body as EntityData<IGenre>);
        await db.em.flush();
        return { success: true };
    });
    fastify.delete<{ Params: { id: string } }>("/:id", async (request) => {
        const e = await db.genre.findOne(request.params.id);
        if (!e) {
            return { notFound: true };
        }
        await db.em.remove(e).flush();
        return { success: true };
    });
};

export default genres;
