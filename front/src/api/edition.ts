import axios, { type GenericAbortSignal } from "axios";
import type { Edition, Publisher, Lang, Book } from "@app/models";

export async function list(signal?: GenericAbortSignal) {
    const { data } = await axios.get("/api/editions", { signal });
    return data as Edition[];
}

type EditionRead = Omit<Edition, "lang" | "book" | "publisher"> & {
    lang: Lang;
    publisher: Publisher;
    book: Book;
};

export async function single(id: string, signal?: GenericAbortSignal) {
    const { data } = await axios.get(`/api/editions/${id}`, { signal });
    const { lang, publisher, book } = data as EditionRead;
    return {
        ...data,
        book,
        publisher,
        lang,
    } as Edition;
}

export async function save(edition: Edition[], signal?: GenericAbortSignal) {
    const data = await Promise.all(
        edition.map(
            async ({ id, isbn, year, pages, lang, publisher, book }) => {
                const e = { isbn, year, pages, lang, publisher, book };
                if (id) {
                    const { data } = await axios.patch(
                        `/api/editions/${id}`,
                        e,
                        {
                            signal,
                        }
                    );
                    return data as Edition;
                } else {
                    const { data } = await axios.post(`/api/editions`, e, {
                        signal,
                    });
                    return data as Edition;
                }
            }
        )
    );
    return data as Edition[];
}

export async function remove(id: string[], signal?: GenericAbortSignal) {
    await Promise.all(
        id.map((v) => axios.delete(`/api/editions/${v}`, { signal }))
    );
}
