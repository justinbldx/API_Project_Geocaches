import { pool } from '../config/database';
import { CreateVisitDTO, Visit } from '../models/visit.model';

export class VisitRepository {
    async findById(id: number): Promise<Visit | null> {
        const rows = await pool.query(
            'SELECT id_utilisateur, id_cache, date_heure, commentaire, photo_url, cache_trouve FROM visite WHERE id_utilisateur = ? or id_cache = ?',
            [id, id]
        ) as unknown as Visit[];
        return rows[0] ?? null;
    }

    async create(data: CreateVisitDTO): Promise<Visit> {
        await pool.query(
            'INSERT INTO visite (id_utilisateur, id_cache, date_heure, commentaire, cache_trouve) VALUES (?, ?, ?, ?, ?)',
            [data.id_user, data.id_geocache, data.date_heure, data.commentaire, data.cache_trouve]
        );

        const rows = await pool.query(
            'SELECT id_utilisateur AS id_user, id_cache AS id_geocache, date_heure, commentaire, cache_trouve FROM visite WHERE id_utilisateur = ? AND id_cache = ? AND date_heure = ?',
            [data.id_user, data.id_geocache, data.date_heure]
        ) as unknown as Visit[];
        return rows[0];
    }
}