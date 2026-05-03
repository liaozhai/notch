import axios, { type GenericAbortSignal } from "axios";
import type { Tag } from "@app/models";

export async function list(signal?: GenericAbortSignal) {
    const { data } = await axios.get("/api/tags", { signal });
    return data as Tag[];
}

export async function single(id: string, signal?: GenericAbortSignal) {
    const { data } = await axios.get(`/api/tags/${id}`, { signal });
    return data as Tag;
}

export async function save(tag: Tag, signal?: GenericAbortSignal) {
    const { id, name, books } = tag;
    const t = {
        name,
        books: books.map(({ id }) => id),
    };
    if (id) {
        const { data } = await axios.patch(`/api/tags/${id}`, t, { signal });
        return data as Tag;
    } else {
        const { data } = await axios.post(`/api/tags`, t, { signal });
        return data as Tag;
    }
}

export async function remove(id: string, signal?: GenericAbortSignal) {
    await axios.delete(`/api/genres/${id}`, { signal });
}
