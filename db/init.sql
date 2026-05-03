SET client_encoding = 'UTF8';

CREATE SCHEMA library;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "library".author (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	first_name text NOT NULL,
	middle_name text NULL,
	last_name text NOT NULL,
	original_name text NULL,
	CONSTRAINT author_pkey PRIMARY KEY (id)
);

CREATE TABLE "library".genre (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT genre_pkey PRIMARY KEY (id)
);

CREATE TABLE "library".lang (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT lang_pkey PRIMARY KEY (id)
);

CREATE TABLE "library".publisher (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT publisher_pkey PRIMARY KEY (id)
);

CREATE TABLE "library".tag (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT tag_pkey PRIMARY KEY (id)
);

CREATE TABLE "library".book (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	title text NOT NULL,
	original_title text NULL,	
	CONSTRAINT book_pkey PRIMARY KEY (id)
);

CREATE TABLE "library".book_authors (
	book_id uuid NOT NULL,
	author_id uuid NOT NULL,
	CONSTRAINT book_authors_pkey PRIMARY KEY (book_id, author_id)
);

ALTER TABLE "library".book_authors ADD CONSTRAINT book_authors_author_id_foreign FOREIGN KEY (author_id) REFERENCES "library".author(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "library".book_authors ADD CONSTRAINT book_authors_book_id_foreign FOREIGN KEY (book_id) REFERENCES "library".book(id) ON DELETE CASCADE ON UPDATE CASCADE;


CREATE TABLE "library".book_genres (
	book_id uuid NOT NULL,
	genre_id uuid NOT NULL,
	CONSTRAINT book_genres_pkey PRIMARY KEY (book_id, genre_id)
);

ALTER TABLE "library".book_genres ADD CONSTRAINT book_genres_book_id_foreign FOREIGN KEY (book_id) REFERENCES "library".book(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "library".book_genres ADD CONSTRAINT book_genres_genre_id_foreign FOREIGN KEY (genre_id) REFERENCES "library".genre(id) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "library".book_tags (
	book_id uuid NOT NULL,
	tag_id uuid NOT NULL,
	CONSTRAINT book_tags_pkey PRIMARY KEY (book_id, tag_id)
);

ALTER TABLE "library".book_tags ADD CONSTRAINT book_tags_book_id_foreign FOREIGN KEY (book_id) REFERENCES "library".book(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "library".book_tags ADD CONSTRAINT book_tags_tag_id_foreign FOREIGN KEY (tag_id) REFERENCES "library".tag(id) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "library".edition (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	isbn bpchar(17) NOT NULL,
	pages int4 NULL,
	"year" int4 NULL,
	book_id uuid NOT NULL,
	lang_id uuid NOT NULL,
	publisher_id uuid NOT NULL,
	CONSTRAINT edition_isbn_unique UNIQUE (isbn),
	CONSTRAINT edition_pkey PRIMARY KEY (id)
);

ALTER TABLE "library".edition ADD CONSTRAINT edition_book_id_foreign FOREIGN KEY (book_id) REFERENCES "library".book(id);
ALTER TABLE "library".edition ADD CONSTRAINT edition_lang_id_foreign FOREIGN KEY (lang_id) REFERENCES "library".lang(id);
ALTER TABLE "library".edition ADD CONSTRAINT edition_publisher_id_foreign FOREIGN KEY (publisher_id) REFERENCES "library".publisher(id);