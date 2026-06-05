create table mydatabase.etat_cache
(
    id      bigint auto_increment
        primary key,
    libelle varchar(255) not null
);

create table mydatabase.type_cache
(
    id      bigint auto_increment
        primary key,
    libelle varchar(255) not null
);

create table mydatabase.utilisateur
(
    id           bigint auto_increment
        primary key,
    pseudo       varchar(35)          not null,
    mot_de_passe varchar(255)         not null,
    admin        tinyint(1) default 0 not null,
    constraint unique_pseudo
        unique (pseudo)
);

create table mydatabase.reseau
(
    id              bigint auto_increment
        primary key,
    id_proprietaire bigint       not null,
    nom_reseau      varchar(255) not null,
    constraint reseau_utilisateur_id_fk
        foreign key (id_proprietaire) references mydatabase.utilisateur (id)
);

create table mydatabase.affectation
(
    id_utilisateur   bigint not null,
    id_reseau        bigint not null,
    date_affectation date   not null,
    primary key (id_utilisateur, id_reseau),
    constraint affectation___fk
        foreign key (id_utilisateur) references mydatabase.utilisateur (id),
    constraint affectation_reseau_id_fk
        foreign key (id_reseau) references mydatabase.reseau (id)
);

create table mydatabase.cache
(
    id                    bigint auto_increment
        primary key,
    id_reseau             bigint       not null,
    id_type               bigint       not null,
    id_etat               bigint       not null,
    description           varchar(255) not null,
    description_technique varchar(255) not null,
    description_libre     varchar(255) null,
    coordonnees           point        not null,
    spatial index(coordonnees),
    constraint cache_etat_cache_id_fk
        foreign key (id_etat) references mydatabase.etat_cache (id),
    constraint cache_reseau_id_fk
        foreign key (id_reseau) references mydatabase.reseau (id),
    constraint cache_type_cache_id_fk
        foreign key (id_type) references mydatabase.type_cache (id)
);

create table mydatabase.visite
(
    id_utilisateur bigint       not null,
    id_cache       bigint       not null,
    date_heure     datetime     not null,
    commentaire    varchar(255) null,
    photo_url      varchar(255) null,
    primary key (id_utilisateur, id_cache, date_heure),
    constraint visite_cache_id_fk
        foreign key (id_cache) references mydatabase.cache (id),
    constraint visite_utilisateur_id_fk
        foreign key (id_utilisateur) references mydatabase.utilisateur (id)
);

