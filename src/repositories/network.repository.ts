import { pool } from '../config/database';
import { CacheSummary } from '../models/cache.model';
import { AddMemberDTO } from '../models/cache.schema';
import { NetworkDetail, NetworkMemberAssignment } from '../models/network.model';
import { CreateNetworkDTO, UpdateNetworkDTO } from '../models/network.schema';
import { JWTUser } from '../types/types';
import { sanitizeUser } from '../utils/sanitizeUser';

export class NetworkRepository {

  // 🔹 GET ALL NETWORKS
  async getAll() {
    const result = await pool.query(`
      SELECT reseau.id, reseau.id_proprietaire, reseau.nom_reseau, utilisateur.pseudo, utilisateur.admin
      FROM reseau JOIN utilisateur ON reseau.id_proprietaire = utilisateur.id
    `);

    return result.map((row: any) => ({
      id: Number(row.id),
      name: row.nom_reseau,
      owner: {
        id: Number(row.id_proprietaire),
        role: row.admin === 1 ? 'admin' : 'user',
        username: row.pseudo
      }
    }));
  }

  // 🔹 GET BY ID
  async getById(id: number): Promise<NetworkDetail | null> {
    const rows: any = await pool.query(`
      SELECT reseau.id, reseau.id_proprietaire, reseau.nom_reseau, utilisateur.pseudo, utilisateur.admin
      FROM reseau JOIN utilisateur ON reseau.id_proprietaire = utilisateur.id
      WHERE reseau.id = ?
      `,
      [id]
    );

    const row = rows[0];
    if (!row) return null;

    return {
      id: Number(row.id),
      name: row.nom_reseau,
      owner: {
        id: Number(row.id_proprietaire),
        role: row.admin === 1 ? 'admin' : 'user',
        username: row.pseudo
      }
    };
  }

  /**
   * Création d'un réseau
   * @param user L'utilisateur qui crée le réseau
   * @param data Les données nécessaires pour créer le réseau
   */
  async create(user: JWTUser, data: CreateNetworkDTO): Promise<NetworkDetail> {
    const result: any = await pool.query(
      `
      INSERT INTO reseau (id_proprietaire, nom_reseau)
      VALUES (?, ?)
      `,
      [user.id, data.name]
    );

    await pool.query(
      `
      INSERT INTO affectation (id_utilisateur, id_reseau, date_affectation)
      VALUES (?, ?, NOW())
      `,
      [user.id, result.insertId]
    );

    return {
      id: Number(result.insertId),
      name: data.name,
      owner: sanitizeUser(user)
    };
  }

  /**
   * Permet de mettre à jour un réseau
   * @param id L'identifiant du réseau à mettre à jour
   * @param data Les données à mettre à jour
   * @returns 
   */
  async update(id: number, data: UpdateNetworkDTO): Promise<NetworkDetail | null> {
    const { name } = data;

    await pool.query(
      `
      UPDATE reseau
      SET nom_reseau = ?
      WHERE id = ?
      `,
      [name, id]
    );

    const rows: any = await pool.query(
      `
      SELECT
        r.id,
        r.nom_reseau,
        u.id AS owner_id,
        u.pseudo,
        u.admin
      FROM reseau r
      JOIN utilisateur u
        ON u.id = r.id_proprietaire
      WHERE r.id = ?
      `,
      [id]
    );

    const row = rows[0];
    if (!row) return null;

    return {
      id: Number(row.id),
      name: row.nom_reseau,
      owner: {
        id: Number(row.owner_id),
        role: row.admin === 1 ? 'admin' : 'user',
        username: row.pseudo,
      },
    };
  }

  // 🔹 DELETE NETWORK
  async delete(id: number) {
    await pool.query(
      `
      DELETE FROM visite
      WHERE id_cache IN (
        SELECT id FROM cache WHERE id_reseau = ?
      )
      `,
      [id]
    );

    await pool.query(
      `DELETE FROM cache WHERE id_reseau = ?`,
      [id]
    );

    await pool.query(
      `DELETE FROM affectation WHERE id_reseau = ?`,
      [id]
    );

    await pool.query(
      `DELETE FROM reseau WHERE id = ?`,
      [id]
    );

    return { "message": "Network deleted successfully" };
  }

  // 🔹 GET MEMBERS
  async getMembers(id: number) {
    const rows: any = await pool.query(
      `
      SELECT 
        u.id,
        u.pseudo,
        u.admin,
        a.date_affectation
      FROM affectation a
      JOIN utilisateur u ON u.id = a.id_utilisateur
      WHERE a.id_reseau = ?
      `,
      [id]
    );

    return rows.map((row: any) => ({
      id: Number(row.id),
      role: row.admin === 1 ? 'admin' : 'user',
      username: row.pseudo
    }));
  }

  /**
   * Permet d'ajouter un membre à un réseau
   * @param id L'identifiant du réseau
   * @param data Les données nécessaires pour ajouter un membre 
   */
  async addMember(id: number, data: AddMemberDTO): Promise<NetworkMemberAssignment> {
    const { user_id } = data;
    await pool.query(
      `
      INSERT INTO affectation (id_utilisateur, id_reseau, date_affectation)
      VALUES (?, ?, NOW())
      `,
      [user_id, id]
    );

    return {
      "network_id": id,
      "user_id": user_id
    };
  }

  // 🔹 REMOVE MEMBER
  async removeMember(network_id: number, member_id: number) {
    await pool.query(
      `
      DELETE FROM affectation
      WHERE id_reseau = ? AND id_utilisateur = ?
      `,
      [network_id, member_id]
    );

    return {
      "network_id": network_id,
      "user_id": member_id
    };
  }

  async isMember(networkId: number, userId: number): Promise<boolean> {
    const rows: any = await pool.query(
      `
      SELECT EXISTS(
        SELECT 1
        FROM affectation
        WHERE id_reseau = ?
          AND id_utilisateur = ?
      ) AS is_member
      `,
      [networkId, userId]
    );

    return Boolean(rows[0]?.is_member);
  }

  async isOwner(networkId: number, userId: number): Promise<boolean> {
    const rows: any = await pool.query(
      `
      SELECT EXISTS(
        SELECT 1
        FROM reseau
        WHERE id = ?
          AND id_proprietaire = ?
      ) AS is_owner
      `,
      [networkId, userId]
    ); 

    return Boolean(rows[0]?.is_owner);
  }

  /**
   * Permet de récupérer les caches d'un réseau
   * @param network_id L'identifiant du réseau
   * @param type_id L'identifiant du type de cache
   * @param state_id L'identifiant de l'état du cache
   */
  async getCaches(network_id: number, type_id?: number, state_id?: number): Promise<CacheSummary[]> {
    let query = `
      SELECT 
        cache.id,
        ST_X(cache.coordonnees) AS latitude,
        ST_Y(cache.coordonnees) AS longitude,
        cache.description,
        cache.description_libre,
        cache.description_technique,
        type_cache.libelle as type_name,
        etat_cache.libelle as state_name
      FROM cache
      JOIN type_cache ON cache.id_type = type_cache.id
      JOIN etat_cache ON cache.id_etat = etat_cache.id
      WHERE cache.id_reseau = ?
    `;

    const params: any[] = [network_id];

    if (type_id) {
      query += ` AND cache.id_type = ?`;
      params.push(type_id);
    }

    if (state_id) {
      query += ` AND cache.id_etat = ?`;
      params.push(state_id);
    }

    const rows: any = await pool.query(query, params);

    return rows.map((row: any) => ({
      id: Number(row.id),
      coordinates: {
        latitude: row.latitude,
        longitude: row.longitude
      },
      type: row.type_name,
      state: row.state_name,
      description: row.description,
      descriptionLibre: row.description_libre,
      descriptionTechnique: row.description_technique
    }));
  }
}