import { FastifyPluginAsync } from "fastify";
import { initORM } from "@app/db";
import { wrap, type EntityData } from "@mikro-orm/core";
import { IPublisher } from "@app/entities/Publisher";

const publishers: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const db = initORM();
    fastify.get("/", async function (request, reply) {
        const publishers = await db.publisher.find(
            {},
            { orderBy: { name: "ASC" } }
        );
        return publishers;
    });
    fastify.get<{ Params: { id: string } }>(
        "/:id",
        async function (request, reply) {
            const publisher = await db.publisher.findOne(
                {
                    id: request.params.id,
                },
                { populate: ["editions"] }
            );
            return publisher;
        }
    );
    fastify.post<{
        Body: IPublisher;
    }>("/", async (request) => {
        const e = await db.publisher.create(request.body);
        await db.em.flush();
        return e;
    });
    fastify.patch<{
        Params: { id: string };
    }>("/:id", async (request) => {
        const e = await db.publisher.findOneOrFail(request.params.id);
        wrap(e).assign(request.body as EntityData<IPublisher>);
        await db.em.flush();
        return { success: true };
    });
    fastify.delete<{ Params: { id: string } }>("/:id", async (request) => {
        const e = await db.publisher.findOne(request.params.id);
        if (!e) {
            return { notFound: true };
        }
        await db.em.remove(e).flush();
        return { success: true };
    });
};

export default publishers;
