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
            on delete cascade
);

create table mydatabase.affectation
(
    id_utilisateur   bigint not null,
    id_reseau        bigint not null,
    date_affectation date   not null,
    primary key (id_utilisateur, id_reseau),
    constraint affectation_utilisateur_id_fk
        foreign key (id_utilisateur) references mydatabase.utilisateur (id)
            on delete cascade,
    constraint affectation_reseau_id_fk
        foreign key (id_reseau) references mydatabase.reseau (id)
            on delete cascade
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
        foreign key (id_etat) references mydatabase.etat_cache (id)
            on delete cascade,
    constraint cache_reseau_id_fk
        foreign key (id_reseau) references mydatabase.reseau (id)
            on delete cascade,
    constraint cache_type_cache_id_fk
        foreign key (id_type) references mydatabase.type_cache (id)
            on delete cascade
);

CREATE TABLE mydatabase.visite
(
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,

    id_utilisateur  BIGINT NOT NULL,
    id_cache        BIGINT NOT NULL,

    date_heure      DATETIME NOT NULL,
    commentaire     VARCHAR(255) NULL,
    photo_url       VARCHAR(255) NULL,
    cache_trouve    TINYINT(1) DEFAULT 0 NOT NULL,

    CONSTRAINT visite_cache_id_fk
        FOREIGN KEY (id_cache)
        REFERENCES mydatabase.cache (id)
        ON DELETE CASCADE,

    CONSTRAINT visite_utilisateur_id_fk
        FOREIGN KEY (id_utilisateur)
        REFERENCES mydatabase.utilisateur (id)
        ON DELETE CASCADE
);