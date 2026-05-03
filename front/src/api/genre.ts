import axios, { type GenericAbortSignal } from "axios";
import type { Genre } from "@app/models";

export async function list(signal?: GenericAbortSignal) {
    const { data } = await axios.get("/api/genres", { signal });
    return data as Genre[];
}

export async function single(id: string, signal?: GenericAbortSignal) {
    const { data } = await axios.get(`/api/genres/${id}`, { signal });
    return data as Genre;
}

export async function save(genre: Genre, signal?: GenericAbortSignal) {
    const { id, name, books } = genre;
    const g = {
        name,
        books: books.map(({ id }) => id),
    };
    if (id) {
        const { data } = await axios.patch(`/api/genres/${id}`, g, { signal });
        return data as Genre;
    } else {
        const { data } = await axios.post(`/api/genres`, g, { signal });
        return data as Genre;
    }
}

export async function remove(id: string, signal?: GenericAbortSignal) {
    await axios.delete(`/api/genres/${id}`, { signal });
}
