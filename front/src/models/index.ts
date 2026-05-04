export interface Selectable {
    selected?: boolean;
}

export interface Author extends Selectable {
    id?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    books: Book[];
}

export interface Genre extends Selectable {
    id?: string;
    name: string;
    books: Book[];
}

export interface Tag extends Selectable {
    id?: string;
    name: string;
    books: Book[];
}

export interface Lang {
    id?: string;
    name: string;
}

export interface Publisher {
    id?: string;
    name: string;
}

export interface Edition extends Selectable {
    id?: string;
    isbn: string;
    pages: number;
    year?: number;
    book: string;
    lang?: string;
    publisher?: string;
}

export interface Book extends Selectable {
    id?: string;
    title: string;
    originalTitle?: string;
    authors: Author[];
    genres: Genre[];
    tags: Tag[];
    editions: Edition[];
}
