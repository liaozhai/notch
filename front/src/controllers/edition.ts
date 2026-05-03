import type { EntityController } from "./base";
import { actor } from "@app/fsm";

class EditionController implements EntityController {
    list(_: CustomEvent<any>) {
        throw "Not implemented";
    }
    create(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "edition.create" });
    }
    edit(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "edition.edit", id });
    }
    change(e: CustomEvent<any>) {
        e.stopPropagation();
        const { isbn, pages, year, lang, publisher } = e.detail;
        actor.send({
            type: "edition.change",
            isbn,
            pages,
            year,
            lang,
            publisher,
        });
    }
    save(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "edition.save" });
    }
    cancel(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "edition.cancel" });
    }
    filter(_: CustomEvent<any>) {
        throw "Not implemented";
    }
    remove(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "edition.remove", id });
    }
}

export default EditionController;
