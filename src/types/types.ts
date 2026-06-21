export type JWTUser = {
    id: number;
    username: string;
    role: 'admin' | 'user';
}

export type ErrorResponse = {
    /**
     * Code d'erreur compréhensible par la machine, par exemple "USER_NOT_FOUND"
     */
    error: string;

    /**
     * Message d'erreur compréhensible par l'humain, par exemple "L'utilisateur n'existe pas"
     */
    message: string;
};

export type OwnedEntity<T> = {
    /**
     * L'identifiant du propriétaire de l'entité, par exemple l'identifiant de l'utilisateur qui a créé la visite
     */
    owner: number;

    /**
     * La donnée de l'entité, par exemple les détails de la visite
     */
    data: T;
}