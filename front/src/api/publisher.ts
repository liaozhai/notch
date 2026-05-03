import axios, { type GenericAbortSignal } from "axios";
import type { Publisher } from "@app/models";

export async function list(signal?: GenericAbortSignal) {
    const { data } = await axios.get("/api/publishers", { signal });
    return data as Publisher[];
}

export async function single(id: string, signal?: GenericAbortSignal) {
    const { data } = await axios.get(`/api/publishers/${id}`, { signal });
    return data as Publisher;
}

export async function save(publisher: Publisher, signal?: GenericAbortSignal) {
    const { id, name } = publisher;
    const v = {
        name,
    };
    if (id) {
        const { data } = await axios.patch(`/api/publishers/${id}`, v, {
            signal,
        });
        return data as Publisher;
    } else {
        const { data } = await axios.post(`/api/publishers`, v, { signal });
        return data as Publisher;
    }
}

export async function remove(id: string, signal?: GenericAbortSignal) {
    await axios.delete(`/api/genres/${id}`, { signal });
}
