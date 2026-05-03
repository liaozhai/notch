import { FastifyPluginAsync } from "fastify";
import { initORM } from "@app/db";
import { wrap, type EntityData } from "@mikro-orm/core";
import { IBook } from "@app/entities/Book";

const books: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const db = initORM();
    fastify.get(
        "/",
        async () => await db.book.find({}, { orderBy: { title: "ASC" } })
    );
    fastify.get<{ Params: { id: string } }>(
        "/:id",
        async (request) =>
            await db.book.findOne(request.params.id, {
                populate: ["authors", "editions", "genres", "tags"],
            })
    );
    fastify.post<{ Body: IBook }>("/", async (request) => {
        const e = await db.book.create(request.body);
        await db.em.flush();
        return e;
    });
    fastify.patch<{
        Params: { id: string };
    }>("/:id", async (request) => {
        const e = await db.book.findOneOrFail(request.params.id);
        wrap(e).assign(request.body as EntityData<IBook>);
        await db.em.flush();
        return { success: true };
    });
    fastify.delete<{ Params: { id: string } }>("/:id", async (request) => {
        const e = await db.book.findOne(request.params.id);
        if (!e) {
            return { notFound: true };
        }
        await db.em.remove(e).flush();
        return { success: true };
    });
};

export default books;
