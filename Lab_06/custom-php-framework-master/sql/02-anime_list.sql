create table anime_list
(
    id      integer not null
        constraint anime_list_pk
            primary key autoincrement,
    name text not null,
    genre text not null,
    description text not null
);
