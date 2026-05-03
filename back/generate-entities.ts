import { MikroORM } from "@mikro-orm/postgresql";
import { EntityGenerator } from "@mikro-orm/entity-generator";

(async () => {
    const orm = await MikroORM.init({
        discovery: {
            // we need to disable validation for no entities
            warnWhenNoEntities: false,
        },
        extensions: [EntityGenerator],
        dbName: "notch-db",
        user: "postgres",
        password: "postgres",
        host: "db",
        port: 5432,
        schema: "library",
        entities: ["dist/entities/*.js"],
        entitiesTs: ["src/entities/*.ts"],
    });
    const dump = await orm.entityGenerator.generate({
        save: true,
        path: "src/entities",
    });
    console.log(dump);
    await orm.close(true);
})();
