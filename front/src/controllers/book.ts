import { actor } from "@app/fsm";
import type { EntityController, DetailController } from "./base";

class BookAuthorsController implements DetailController {
    change(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "book.authors.change" });
    }
    edit(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "book.authors.edit", id });
    }
    remove(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "book.authors.remove", id });
    }
    select(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id, selected } = e.detail;
        actor.send({ type: "book.authors.select", id, selected });
    }
    save(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "book.authors.save" });
    }
    cancel(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "book.authors.cancel" });
    }
}

class BookGenresController implements DetailController {
    change(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "book.genres.change" });
    }
    edit(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "book.genres.edit", id });
    }
    remove(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "book.genres.remove", id });
    }
    select(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id, selected } = e.detail;
        actor.send({ type: "book.genres.select", id, selected });
    }
    save(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "book.genres.save" });
    }
    cancel(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "book.genres.cancel" });
    }
}

class BookTagsController implements DetailController {
    change(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "book.tags.change" });
    }
    edit(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "book.tags.edit", id });
    }
    remove(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "book.tags.remove", id });
    }
    select(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id, selected } = e.detail;
        actor.send({ type: "book.tags.select", id, selected });
    }
    save(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "book.tags.save" });
    }
    cancel(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "book.tags.cancel" });
    }
}

class BookController implements EntityController {
    authors = new BookAuthorsController();
    genres = new BookGenresController();
    tags = new BookTagsController();

    list(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "book.list" });
    }

    create(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "book.create" });
    }

    change(e: CustomEvent<any>) {
        e.stopPropagation();
        const { title, originalTitle } = e.detail;
        actor.send({ type: "book.change", title, originalTitle });
    }

    save(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "book.save" });
    }

    cancel(e: CustomEvent<any>) {
        e.stopPropagation();
        actor.send({ type: "book.cancel" });
    }

    filter(e: CustomEvent<any>) {
        e.stopPropagation();
        const { filter } = e.detail;
        actor.send({ type: "book.filter", filter });
    }

    edit(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "book.edit", id });
    }

    remove(e: CustomEvent<any>) {
        e.stopPropagation();
        const { id } = e.detail;
        actor.send({ type: "book.remove", id });
    }
}

export default BookController;
