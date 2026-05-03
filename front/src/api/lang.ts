import axios, { type GenericAbortSignal } from "axios";
import type { Lang } from "@app/models";

export async function list(signal?: GenericAbortSignal) {
    const { data } = await axios.get("/api/langs", { signal });
    return data as Lang[];
}

export async function single(id: string, signal?: GenericAbortSignal) {
    const { data } = await axios.get(`/api/langs/${id}`, { signal });
    return data as Lang;
}

export async function save(lang: Lang, signal?: GenericAbortSignal) {
    const { id, name } = lang;
    const v = {
        name,
    };
    if (id) {
        const { data } = await axios.patch(`/api/langs/${id}`, v, { signal });
        return data as Lang;
    } else {
        const { data } = await axios.post(`/api/langs`, v, { signal });
        return data as Lang;
    }
}

export async function remove(id: string, signal?: GenericAbortSignal) {
    await axios.delete(`/api/genres/${id}`, { signal });
}
