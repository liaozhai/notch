import { actor } from "@app/fsm";
import type { EntityController } from "./base";

class PublisherController implements EntityController {
    list(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "publisher.list" });
    }

    create(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "publisher.create" });
    }

    change(e: CustomEvent<any>) {
        e.stopPropagation();
        const { name } = e.detail;
        actor.send({ type: "publisher.change", name });
    }

    save(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "publisher.save" });
    }

    cancel(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "publisher.cancel" });
    }

    filter(e: CustomEvent<any>) {
        e.stopPropagation();
        const { filter } = e.detail;
        actor.send({ type: "publisher.filter", filter });
    }

    edit(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "publisher.edit", id });
    }

    remove(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "publisher.remove", id });
    }
}

export default PublisherController;
