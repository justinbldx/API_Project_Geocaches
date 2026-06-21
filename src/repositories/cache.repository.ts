import { pool } from '../config/database';
import { CacheDetail, CacheSummary, CreateCacheDTO, UpdateCacheDTO } from '../models/cache.model';

function parseCoordinates(pointText: string | null): { latitude: number; longitude: number } {
    if (!pointText) {
        throw new Error('Coordonnées invalides');
    }

    const match = pointText.match(/^POINT\(([-0-9.]+)\s+([-0-9.]+)\)$/);
    if (!match) {
        throw new Error(`Impossible de parser les coordonnées : ${pointText}`);
    }

    return {
        latitude: Number(match[2]),
        longitude: Number(match[1]),
    };
}

function normalizeInt(value: unknown): number {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'bigint') {
        return Number(value);
    }
    if (typeof value === 'string' && /^\d+$/.test(value)) {
        return Number(value);
    }
    throw new Error(`Valeur entière inattendue : ${String(value)}`);
}

export class CacheRepository {
    async findById(id: number): Promise<CacheDetail | null> {
        const sql = `
            SELECT
                c.id,
                ST_AsText(c.coordonnees) AS coordonnees,
                c.description,
                c.description_technique,
                c.description_libre,
                t.libelle AS type_name,
                e.libelle AS state_name,
                r.id AS network_id,
                r.nom_reseau AS network_name
            FROM cache c
            JOIN type_cache t ON c.id_type = t.id
            JOIN etat_cache e ON c.id_etat = e.id
            JOIN reseau r ON c.id_reseau = r.id
            WHERE c.id = ?
        `;

        const rows = await pool.query<any[]>(sql, [id]);
        const row = rows[0] ?? null;
        if (!row) {
            return null;
        }

        return {
            id: normalizeInt(row.id),
            coordinates: parseCoordinates(row.coordonnees),
            type: row.type_name,
            state: row.state_name,
            description: row.description,
            descriptionTechnique: row.description_technique,
            descriptionLibre: row.description_libre,
            network: {
                id: normalizeInt(row.network_id),
                name: row.network_name,
            },
        };
    }

    async findByNetwork(networkId: number, typeId?: number, stateId?: number): Promise<CacheSummary[]> {
        const values: unknown[] = [networkId];
        let sql = `
            SELECT
                c.id,
                ST_AsText(c.coordonnees) AS coordonnees,
                c.description,
                c.description_technique,
                c.description_libre,
                t.libelle AS type_name,
                e.libelle AS state_name
            FROM cache c
            JOIN type_cache t ON c.id_type = t.id
            JOIN etat_cache e ON c.id_etat = e.id
            WHERE c.id_reseau = ?
        `;

        if (typeId !== undefined) {
            sql += ' AND c.id_type = ?';
            values.push(typeId);
        }

        if (stateId !== undefined) {
            sql += ' AND c.id_etat = ?';
            values.push(stateId);
        }

        sql += ' ORDER BY c.id ASC';

        const rows = await pool.query<any[]>(sql, values);
        return rows.map(row => ({
            id: normalizeInt(row.id),
            coordinates: parseCoordinates(row.coordonnees),
            type: row.type_name,
            state: row.state_name,
            description: row.description,
            descriptionTechnique: row.description_technique,
            descriptionLibre: row.description_libre,
        }));
    }

    async create(data: CreateCacheDTO): Promise<CacheDetail> {
        const sql = `
            INSERT INTO cache (
                id_reseau,
                id_type,
                id_etat,
                description,
                description_technique,
                description_libre,
                coordonnees
            ) VALUES (?, ?, ?, ?, ?, ?, POINT(?, ?))
        `;

        const stateId = data.state_id ?? 1;
        const result = await pool.query<any>(sql, [
            data.network_id,
            data.type_id,
            stateId,
            data.description,
            data.description_technique ?? '',
            data.description_libre ?? null,
            data.longitude,
            data.latitude,
        ]);

        const insertId = result.insertId as number | undefined;
        if (!insertId) {
            throw new Error('Impossible de récupérer l’identifiant de la cache créée');
        }

        const rows = await pool.query<any[]>(
            `
                SELECT
                    c.id,
                    ST_AsText(c.coordonnees) AS coordonnees,
                    c.description,
                    c.description_technique,
                    c.description_libre,
                    t.libelle AS type_name,
                    e.libelle AS state_name,
                    r.id AS network_id,
                    r.nom_reseau AS network_name
                FROM cache c
                JOIN type_cache t ON c.id_type = t.id
                JOIN etat_cache e ON c.id_etat = e.id
                JOIN reseau r ON c.id_reseau = r.id
                WHERE c.id = ?
            `,
            [insertId]
        );

        const row = rows[0];
        return {
            id: normalizeInt(row.id),
            coordinates: parseCoordinates(row.coordonnees),
            type: row.type_name,
            state: row.state_name,
            description: row.description,
            descriptionTechnique: row.description_technique,
            descriptionLibre: row.description_libre,
            network: {
                id: normalizeInt(row.network_id),
                name: row.network_name,
            },
        };
    }

    async update(id: number, data: UpdateCacheDTO): Promise<CacheDetail | null> {
        const fields: string[] = [];
        const values: unknown[] = [];

        if (data.description !== undefined) {
            fields.push('description = ?');
            values.push(data.description);
        }
        if (data.description_technique !== undefined) {
            fields.push('description_technique = ?');
            values.push(data.description_technique);
        }
        if (data.description_libre !== undefined) {
            fields.push('description_libre = ?');
            values.push(data.description_libre);
        }
        if (data.type_id !== undefined) {
            fields.push('id_type = ?');
            values.push(data.type_id);
        }
        if (data.state_id !== undefined) {
            fields.push('id_etat = ?');
            values.push(data.state_id);
        }
        if (data.latitude !== undefined || data.longitude !== undefined) {
            fields.push('coordonnees = POINT(?, ?)');
            values.push(data.longitude, data.latitude);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        const sql = `UPDATE cache SET ${fields.join(', ')} WHERE id = ?`;
        await pool.query(sql, values);
        return this.findById(id);
    }

    async findVisitsByCache(cacheId: number): Promise<import('../models/cache.model').VisitSummaryWithoutCache[]> {
        const sql = `
            SELECT
                v.cache_trouve AS found,
                v.date_heure AS visited_at,
                v.commentaire AS comment,
                v.photo_url AS photo_url,
                u.id AS user_id,
                u.pseudo AS username,
                u.admin AS is_admin
            FROM visite v
            JOIN utilisateur u ON v.id_utilisateur = u.id
            WHERE v.id_cache = ?
            ORDER BY v.date_heure DESC
        `;

        const rows = await pool.query<any[]>(sql, [cacheId]);
        return rows.map(row => ({
            user: {
                id: normalizeInt(row.user_id),
                username: row.username,
                role: row.is_admin ? 'admin' : 'user',
            },
            found: Boolean(row.found),
            visited_at: new Date(row.visited_at).toISOString(),
            comment: row.comment,
            photo_url: row.photo_url,
        }));
    }

    async delete(id: number): Promise<boolean> {
        const result = await pool.query<any>('DELETE FROM cache WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async checkNetworkExists(networkId: number): Promise<boolean> {
        const rows = await pool.query<any[]>('SELECT 1 FROM reseau WHERE id = ?', [networkId]);
        return rows.length > 0;
    }

    async checkTypeExists(typeId: number): Promise<boolean> {
        const rows = await pool.query<any[]>('SELECT 1 FROM type_cache WHERE id = ?', [typeId]);
        return rows.length > 0;
    }

    async checkStateExists(stateId: number): Promise<boolean> {
        const rows = await pool.query<any[]>('SELECT 1 FROM etat_cache WHERE id = ?', [stateId]);
        return rows.length > 0;
    }
}
