import { pool } from '../config/database';
import { CreateUserDTO, UpdateUserDTO, User } from '../models/user.model';

/**
 * Le repository est la SEULE couche autorisée à écrire des requêtes SQL.
 * Il ne contient aucune règle métier : juste de la lecture/écriture en base.
 */
export class UserRepository {
    async findAll(): Promise<User[]> {
        const rows = await pool.query(
            'SELECT id, pseudo AS name, "" AS email, NULL AS created_at FROM utilisateur ORDER BY id ASC'
        ) as unknown as User[];
        return rows;
    }

    async findById(id: number): Promise<User | null> {
        const rows = await pool.query(
            'SELECT id, pseudo AS name, "" AS email, NULL AS created_at FROM utilisateur WHERE id = ?',
            [id]
        ) as unknown as User[];
        return rows[0] ?? null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const rows = await pool.query(
            'SELECT id, pseudo AS name, email, created_at FROM utilisateur WHERE email = ?',
            [email]
        ) as unknown as User[];
        return rows[0] ?? null;
    }

    async create(data: CreateUserDTO): Promise<User> {
        await pool.query(
            'INSERT INTO utilisateur (pseudo, mot_de_passe, admin) VALUES (?, ?, 0)',
            [data.name, data.email]
        );

        const inserted = await this.findByEmail(data.email);
        if (!inserted) {
            throw new Error("Impossible d'obtenir l'utilisateur créé");
        }

        return inserted;
    }

    async update(id: number, data: UpdateUserDTO): Promise<User | null> {
        const fields: string[] = [];
        const values: unknown[] = [];
        let index = 1;

        if (data.name !== undefined) {
            fields.push(`name = $${index++}`);
            values.push(data.name);
        }
        if (data.email !== undefined) {
            fields.push(`email = $${index++}`);
            values.push(data.email);
        }

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        const result = await pool.query<User>(
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} RETURNING id, name, email, created_at`,
            values
        ) as unknown as { rows: User[] };
        return result.rows[0] ?? null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM users WHERE id = $1', [id]) as unknown as { rowCount?: number };
        return (result.rowCount ?? 0) > 0;
    }
}