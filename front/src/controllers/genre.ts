import { actor } from "@app/fsm";
import type { DetailController, EntityController } from "./base";

class GenreBooksController implements DetailController {
    change(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "genre.books.change" });
    }
    edit(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "genre.books.edit", id });
    }
    remove(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "genre.books.remove", id });
    }
    select(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id, selected } = e.detail;
        actor.send({ type: "genre.books.select", id, selected });
    }
    save(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "genre.books.save" });
    }
    cancel(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "genre.books.cancel" });
    }
}

class GenreController implements EntityController {
    books = new GenreBooksController();
    list(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "genre.list" });
    }

    create(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "genre.create" });
    }

    change(e: CustomEvent<any>) {
        e.stopPropagation();
        const { name } = e.detail;
        actor.send({ type: "genre.change", name });
    }

    save(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "genre.save" });
    }

    cancel(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "genre.cancel" });
    }

    filter(e: CustomEvent<any>) {
        e.stopPropagation();
        const { filter } = e.detail;
        actor.send({ type: "genre.filter", filter });
    }

    edit(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "genre.edit", id });
    }

    remove(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "genre.remove", id });
    }
}

export default GenreController;
