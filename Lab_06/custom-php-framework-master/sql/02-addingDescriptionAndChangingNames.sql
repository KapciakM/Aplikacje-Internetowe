create table post
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    name text not null,
    genre text not null,
    description text not null
);
