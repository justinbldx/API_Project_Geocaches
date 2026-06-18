export interface Visit {
    id: number;
    id_user: number;
    id_geocache: number;
    date_heure: Date;
    commentaire: string;
    cache_trouve: boolean;
}

export interface CreateVisitDTO {
    id_user: number;
    id_geocache: number;
    date_heure: Date;
    commentaire: string;
    cache_trouve: boolean;
}

export interface UpdateVisitDTO {
    date_heure?: Date;
    commentaire?: string;
    cache_trouve?: boolean;
}