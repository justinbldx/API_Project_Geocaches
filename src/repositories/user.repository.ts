import { pool } from '../config/database';
import { CreateUserDTO, UpdateUserDTO, User, UserDetailDTO } from '../models/user.model';

/**
 * Le repository est la SEULE couche autorisée à écrire des requêtes SQL.
 * Il ne contient aucune règle métier : juste de la lecture/écriture en base.
 */
export class UserRepository {

    /**
     * Permet de convertir une ligne SQL en objet User (DTO)
     * @param row La ligne à traiter
     */
    public convertUser(row: any): User {
        return {
            id: row.id?.toString(), // Nécesaire car l'ID est un bigint
            username: row.pseudo,
            password: row.mot_de_passe,
            role: row.role === 1 ? 'admin' : 'user',
        }
    }

    /**
     * Récupère tous les utilisateurs (Correspond à UserSummary dans l'OpenAPI)
     */
    async findAll(): Promise<User[]> {
        const result = await pool.query<any[]>(
            'SELECT id, pseudo, admin FROM utilisateur ORDER BY id ASC'
        )

        return result.map(this.convertUser);
    }

    /**
     * Récupère un utilisateur par son ID (champs de base)
     */
    async findById(id: number): Promise<User | null> {
        const result = await pool.query<any[]>(
            'SELECT id, pseudo, admin FROM utilisateur WHERE id = ?',
            [id]
        );

        return result[0] ? this.convertUser(result[0]) : null;
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
            SELECT n.id, n.nom_reseau, un.date_affectation as "affectationDate"
            FROM reseau n
            JOIN affectation un ON n.id = un.id_reseau
            WHERE un.id_utilisateur = ?
        `, [id]);

        return {
            ...user,
            networks: networksResult.map((row: any) => ({
                id: row.id.toString(), // Nécessaire car l'ID est un bigint
                name: row.nom_reseau,
                affectationDate: row.affectationDate,
            })),
        };
    }

    /**
     * Récupère un utilisateur par son pseudo (Utile pour le Login et la vérification d'unicité)
     */
    async findByUsername(username: string): Promise<User | null> {
        const result = await pool.query<User>(
            'SELECT id, pseudo, mot_de_passe, admin FROM utilisateur WHERE pseudo = ?',
            [username]
        ) as unknown as { rows: User[] };
        return result.rows[0] ?? null;
    }

    /**
     * Crée un nouvel utilisateur en base de données
     */
    async create(data: CreateUserDTO): Promise<User> {
        const result = await pool.query<User>(
            'INSERT INTO utilisateur (pseudo, mot_de_passe, admin) VALUES (?, ?, ?) RETURNING id, pseudo, admin',
            [data.username, data.password, data.role === 'admin']
        ) as unknown as { rows: User[] };
        return result.rows[0];
    }

    /**
     * Met à jour dynamiquement un utilisateur selon les champs fournis
     */
    async update(id: number, data: UpdateUserDTO): Promise<User | null> {
        const current = await this.findById(id);
        if (!current) return null;

        const fields: string[] = [];
        const values: unknown[] = [];

        if (data.username !== undefined) {
            fields.push(`pseudo = ?`);
            values.push(data.username);
        }
        if (data.password !== undefined) {
            fields.push(`mot_de_passe = ?`);
            values.push(data.password);
        }
        if (data.role !== undefined) {
            fields.push(`admin = ?`);
            values.push(data.role === "admin");
        }

        if (fields.length === 0) {
            return current;
        }

        values.push(id);
        await pool.query(
            `UPDATE utilisateur SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        // On reconstruit l'objet à partir de ce qu'on sait déjà avoir écrit
        return {
            id: current.id,
            username: data.username ?? current.username,
            role: data.role !== undefined ? data.role : current.role,
        };
    }

    /**
     * Supprime un utilisateur de la base
     */
    async delete(id: number): Promise<boolean> {
        const result = await pool.query(
            'DELETE FROM utilisateur WHERE id = ?',
            [id]
        ) as { affectedRows: number };

        return result.affectedRows > 0;
    }
}