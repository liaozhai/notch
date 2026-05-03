export interface EntityController {
    list: (e: CustomEvent<any>) => void;
    create: (e: CustomEvent<any>) => void;
    edit: (e: CustomEvent<any>) => void;
    change: (e: CustomEvent<any>) => void;
    save: (e: CustomEvent<any>) => void;
    cancel: (e: CustomEvent<any>) => void;
    filter: (e: CustomEvent<any>) => void;
    remove: (e: CustomEvent<any>) => void;
}

export interface DetailController {
    change: (e: CustomEvent<any>) => void;
    edit: (e: CustomEvent<any>) => void;
    remove: (e: CustomEvent<any>) => void;
    select: (e: CustomEvent<any>) => void;
    save: (e: CustomEvent<any>) => void;
    cancel: (e: CustomEvent<any>) => void;
}
