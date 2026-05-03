import { actor } from "@app/fsm";
import type { DetailController, EntityController } from "./base";

class TagBooksController implements DetailController {
    change(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "tag.books.change" });
    }
    edit(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "tag.books.edit", id });
    }
    remove(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "tag.books.remove", id });
    }
    select(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id, selected } = e.detail;
        actor.send({ type: "tag.books.select", id, selected });
    }
    save(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "tag.books.save" });
    }
    cancel(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "tag.books.cancel" });
    }
}

class TagController implements EntityController {
    books = new TagBooksController();
    list(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "tag.list" });
    }

    create(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "tag.create" });
    }

    change(e: CustomEvent<any>) {
        e.stopPropagation();
        const { name } = e.detail;
        actor.send({ type: "tag.change", name });
    }

    save(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "tag.save" });
    }

    cancel(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "tag.cancel" });
    }

    filter(e: CustomEvent<any>) {
        e.stopPropagation();
        const { filter } = e.detail;
        actor.send({ type: "tag.filter", filter });
    }

    edit(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "tag.edit", id });
    }

    remove(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "tag.remove", id });
    }
}

export default TagController;
