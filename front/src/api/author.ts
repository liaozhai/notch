import axios, { type GenericAbortSignal } from "axios";
import type { Author } from "@app/models";

export async function list(signal?: GenericAbortSignal) {
    const { data } = await axios.get("/api/authors", { signal });
    return data as Author[];
}

export async function single(id: string, signal?: GenericAbortSignal) {
    const { data } = await axios.get(`/api/authors/${id}`, { signal });
    return data as Author;
}

export async function save(author: Author, signal?: GenericAbortSignal) {
    const { id, firstName, middleName, lastName, books } = author;
    const a = {
        firstName,
        middleName,
        lastName,
        books: books.map(({ id }) => id),
    };
    if (id) {
        const { data } = await axios.patch(`/api/authors/${id}`, a, { signal });
        return data as Author;
    } else {
        const { data } = await axios.post(`/api/authors`, a, { signal });
        return data as Author;
    }
}

export async function remove(id: string, signal?: GenericAbortSignal) {
    await axios.delete(`/api/authors/${id}`, { signal });
}
