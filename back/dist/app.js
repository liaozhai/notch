"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = require("node:path");
const autoload_1 = __importDefault(require("@fastify/autoload"));
const fastify_1 = __importDefault(require("fastify"));
const postgresql_1 = require("@mikro-orm/postgresql");
const db_1 = require("./db");
const fastify = (0, fastify_1.default)({ logger: true });
fastify.register(autoload_1.default, {
    dir: (0, node_path_1.join)(__dirname, "plugins"),
});
fastify.register(autoload_1.default, {
    dir: (0, node_path_1.join)(__dirname, "routes"),
});
const db = (0, db_1.initORM)();
fastify.addHook("onRequest", (request, reply, done) => {
    postgresql_1.RequestContext.create(db.em, done);
});
fastify.addHook("onClose", async () => {
    await db.orm.close();
});
const start = async () => {
    try {
        await fastify.ready();
        await fastify.listen({
            port: 3000,
            host: "0.0.0.0",
        });
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=app.js.map