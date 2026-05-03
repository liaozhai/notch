import axios, { type GenericAbortSignal } from "axios";
import type { Book } from "@app/models";

export async function list(signal?: GenericAbortSignal) {
    const { data } = await axios.get("/api/books", { signal });
    return data as Book[];
}

export async function single(id: string, signal?: GenericAbortSignal) {
    const { data } = await axios.get(`/api/books/${id}`, { signal });
    return data as Book;
}

export async function save(book: Book, signal?: GenericAbortSignal) {
    const { id, title, originalTitle, authors, genres, tags, editions } = book;
    const b = {
        title,
        originalTitle,
        authors: authors.map(({ id }) => id),
        genres: genres.map(({ id }) => id),
        tags: tags.map(({ id }) => id),
        editions: editions.map(({ id }) => id),
    };
    if (id) {
        const { data } = await axios.patch(`/api/books/${id}`, b, { signal });
        return data as Book;
    } else {
        const { data } = await axios.post(`/api/books`, b, { signal });
        return data as Book;
    }
}

export async function remove(id: string, signal?: GenericAbortSignal) {
    await axios.delete(`/api/books/${id}`, { signal });
}
