import { pool } from '../config/database';
import { DetailedVisit, Visit } from '../models/visit.model';
import { CreateVisitDTO } from '../models/visit.schema';
import { JWTUser, OwnedEntity } from '../types/types';

export class VisitRepository {
    /**
     * Permet de convertir une ligne de la base de données en objet Visit
     * @param row Les données de la ligne à convertir
     */
    convertRowToVisit(row: any): Visit {
        return {
            cache_id: row.id_geocache,
            found: !!row.cache_trouve,
            comment: row.commentaire,
            visited_at: row.date_heure,
            photo_url: row.photo_url
        }
    }

    /**
     * Permet de récupérer une visite par son identifiant
     * @param id Identifiant de la visite à récupérer
     */
    async findById(id: number): Promise<OwnedEntity<DetailedVisit> | null> {
        const rows = await pool.query<any[]>(`
            SELECT
                v.id_utilisateur,
                v.id_cache,
                v.date_heure,
                v.commentaire,
                v.photo_url,
                v.cache_trouve,

                c.id AS cache_id,
                c.description,
                c.description_libre,
                c.description_technique,
                c.coordonnees,

                tc.libelle AS type_libelle,
                ec.libelle AS state_libelle

            FROM visite v
            JOIN cache c ON c.id = v.id_cache
            JOIN type_cache tc ON tc.id = c.id_type
            JOIN etat_cache ec ON ec.id = c.id_etat
            WHERE v.id = ?
            LIMIT 1
        `, [id, id]);

        return rows[0] ? {
            owner: rows[0].id_utilisateur,
            data: {
                "cache": {
                    "id": rows[0].cache_id,
                    "coordinates": {
                        "latitude": rows[0].coordonnees.coordinates[1],
                        "longitude": rows[0].coordonnees.coordinates[0]
                    },
                    "type": rows[0].type_libelle,
                    "state": rows[0].state_libelle,
                    "description": rows[0].description,
                    "descriptionLibre": rows[0].description_libre,
                    "descriptionTechnique": rows[0].description_technique,
                },
                ...this.convertRowToVisit(rows[0]),
            }
        } : null;
    }

    /**
     * Permet de créer une nouvelle visite pour un utilisateur
     * @param user L'utilisateur souhaitant ajouter une visite
     * @param data Les données nécessaires pour ajouter sa visite
     */
    async create(user: JWTUser, data: CreateVisitDTO): Promise<Visit> {
        const result = await pool.query(
            `
            INSERT INTO visite (
                id_utilisateur,
                id_cache,
                date_heure,
                commentaire,
                cache_trouve,
                photo_url
            )
            VALUES (?, ?, ?, ?, ?, ?)
            RETURNING 
                id_utilisateur AS id_user,
                id_cache AS id_geocache,
                date_heure,
                commentaire,
                cache_trouve,
                photo_url
            `,
            [
                user.id,
                data.cache_id,
                data.visited_at,
                data.comment,
                data.found,
                data.photo_url
            ]
        );

        return this.convertRowToVisit(result[0]);
    }
}