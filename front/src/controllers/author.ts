import { actor } from "@app/fsm";
import type { DetailController, EntityController } from "./base";

class AuthorBooksController implements DetailController {
    change(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "author.books.change" });
    }
    edit(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "author.books.edit", id });
    }
    remove(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "author.books.remove", id });
    }
    select(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id, selected } = e.detail;
        actor.send({ type: "author.books.select", id, selected });
    }
    save(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "author.books.save" });
    }
    cancel(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "author.books.cancel" });
    }
}

class AuthorController implements EntityController {
    books = new AuthorBooksController();
    list(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "author.list" });
    }

    create(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "author.create" });
    }

    change(e: CustomEvent<any>) {
        e.stopPropagation();
        const { firstName, middleName, lastName } = e.detail;
        actor.send({ type: "author.change", firstName, middleName, lastName });
    }

    save(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "author.save" });
    }

    cancel(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "author.cancel" });
    }

    filter(e: CustomEvent<any>) {
        e.stopPropagation();
        const { filter } = e.detail;
        actor.send({ type: "author.filter", filter });
    }

    edit(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "author.edit", id });
    }

    remove(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "author.remove", id });
    }
}

export default AuthorController;
