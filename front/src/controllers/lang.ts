import { actor } from "@app/fsm";
import type { EntityController } from "./base";

class LangController implements EntityController {
    list(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "lang.list" });
    }

    create(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "lang.create" });
    }

    change(e: CustomEvent<any>) {
        e.stopPropagation();
        const { name } = e.detail;
        actor.send({ type: "lang.change", name });
    }

    save(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "lang.save" });
    }

    cancel(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "lang.cancel" });
    }

    filter(e: CustomEvent<any>) {
        e.stopPropagation();
        const { filter } = e.detail;
        actor.send({ type: "lang.filter", filter });
    }

    edit(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "lang.edit", id });
    }

    remove(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "lang.remove", id });
    }
}

export default LangController;
