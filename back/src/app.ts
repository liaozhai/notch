import { join } from "node:path";
import AutoLoad from "@fastify/autoload";
import Fastify from "fastify";
import { RequestContext } from "@mikro-orm/postgresql";
import { initORM } from "./db";

const fastify = Fastify({ logger: true });

fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
});

const db = initORM();

// register request context hook
fastify.addHook("onRequest", (request, reply, done) => {
    RequestContext.create(db.em, done);
});

fastify.addHook("onClose", async () => {
    await db.orm.close();
});

const start = async () => {
    try {
        await fastify.ready();
        await fastify.listen({
            port: (process.env.PORT && +process.env.PORT) || 3000,
            host: "0.0.0.0",
        });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
