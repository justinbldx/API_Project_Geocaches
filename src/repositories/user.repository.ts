import { pool } from '../config/database';
import { CreateUserDTO, UpdateUserDTO, User, UserDetailDTO } from '../models/user.model';

/**
 * Le repository est la SEULE couche autorisée à écrire des requêtes SQL.
 * Il ne contient aucune règle métier : juste de la lecture/écriture en base.
 */
export class UserRepository {

    /**
     * Récupère tous les utilisateurs (Correspond à UserSummary dans l'OpenAPI)
     */
    async findAll(): Promise<User[]> {
        const result = await pool.query<User>(
            'SELECT id, username, role FROM users ORDER BY id ASC'
        ) as unknown as { rows: User[] };
        return result.rows;
    }

    /**
     * Récupère un utilisateur par son ID (champs de base)
     */
    async findById(id: number): Promise<User | null> {
        const result = await pool.query<User>(
            'SELECT id, username, role FROM users WHERE id = $1',
            [id]
        ) as unknown as { rows: User[] };
        return result.rows[0] ?? null;
    }

    /**
     * Récupère le profil détaillé avec la liste des réseaux associés
     * (Correspond à UserDetailWithNetworksDetail dans l'OpenAPI)
     */
    async findDetailWithNetworks(id: number): Promise<UserDetailDTO | null> {
        // 1. On récupère d'abord l'utilisateur
        const user = await this.findById(id);
        if (!user) return null;

        // 2. On récupère ses réseaux associés via la table de jointure (user_networks)
        const networksResult = await pool.query(`
            SELECT n.id, n.name, un.affectation_date as "affectationDate"
            FROM networks n
            JOIN user_networks un ON n.id = un.network_id
            WHERE un.user_id = $1
        `, [id]) as unknown as { rows: any[] };

        return {
            id: user.id,
            username: user.username,
            role: user.role,
            networks: networksResult.rows
        };
    }

    /**
     * Récupère un utilisateur par son pseudo (Utile pour le Login et la vérification d'unicité)
     */
    async findByUsername(username: string): Promise<User | null> {
        const result = await pool.query<User>(
            'SELECT id, username, password, role FROM users WHERE username = $1',
            [username]
        ) as unknown as { rows: User[] };
        return result.rows[0] ?? null;
    }

    /**
     * Crée un nouvel utilisateur en base de données
     */
    async create(data: CreateUserDTO): Promise<User> {
        const result = await pool.query<User>(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
            [data.username, data.password, data.role ?? 'user']
        ) as unknown as { rows: User[] };
        return result.rows[0];
    }

    /**
     * Met à jour dynamiquement un utilisateur selon les champs fournis
     */
    async update(id: number, data: UpdateUserDTO): Promise<User | null> {
        const fields: string[] = [];
        const values: unknown[] = [];
        let index = 1;

        if (data.username !== undefined) {
            fields.push(`username = $${index++}`);
            values.push(data.username);
        }
        if (data.password !== undefined) {
            fields.push(`password = $${index++}`);
            values.push(data.password);
        }
        if (data.role !== undefined) {
            fields.push(`role = $${index++}`);
            values.push(data.role);
        }

        // Si aucun champ n'est passé dans le body, on renvoie simplement l'état actuel
        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id); // L'ID pour la clause WHERE

        const result = await pool.query<User>(
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, username, role`,
            values
        ) as unknown as { rows: User[] };
        return result.rows[0] ?? null;
    }

    /**
     * Supprime un utilisateur de la base
     */
    async delete(id: number): Promise<boolean> {
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1',
            [id]
        ) as unknown as { rowCount?: number };
        return (result.rowCount ?? 0) > 0;
    }
}