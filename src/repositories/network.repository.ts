import { pool } from '../config/database';

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
  async getById(id: number) {
    const rows: any = await pool.query(`
      SELECT reseau.id, reseau.id_proprietaire, reseau.nom_reseau, utilisateur.pseudo, utilisateur.admin
      FROM reseau JOIN utilisateur ON reseau.id_proprietaire = utilisateur.id
      WHERE reseau.id = ?
      `,
      [id]
    );
    // Normalize result shape for different mysql libraries: some return [rows, fields], others return rows directly
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

  // 🔹 CREATE NETWORK
  async create(data: any) {
    const { name, owner_id } = data;

    const result: any = await pool.query(
      `
      INSERT INTO reseau (id_proprietaire, nom_reseau)
      VALUES (?, ?)
      `,
      [owner_id, name]
    );

    const ownerRows: any = await pool.query(
      `
      SELECT pseudo, admin
      FROM utilisateur
      WHERE id = ?
      `,
      [owner_id]
    );

    const ownerInfo = ownerRows[0] || {};

    return {
      id: Number(result.insertId),
      name,
      owner: {
        id: Number(owner_id),
        role: ownerInfo.admin === 1 ? 'admin' : 'user',
        username: ownerInfo.pseudo || null
      }
    };
  }

  // 🔹 UPDATE NETWORK
  async update(id: number, data: any) {
    const { name, owner_id } = data;

    const result: any = await pool.query(
      `
      UPDATE reseau
      SET nom_reseau = ?, id_proprietaire = ?
      WHERE id = ?
      `,
      [name, owner_id, id]
    );

    const ownerRows: any = await pool.query(
      `
      SELECT pseudo, admin
      FROM utilisateur
      WHERE id = ?
      `,
      [owner_id]
    );

    const ownerInfo = ownerRows[0] || {};

    return {
      id: Number(id),
      name,
      owner: {
        id: Number(owner_id),
        role: ownerInfo.admin === 1 ? 'admin' : 'user',
        username: ownerInfo.pseudo || null
      }
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

  // 🔹 ADD MEMBER
  async addMember(id: number, data: any) {
    const { user_id } = data;
    await pool.query(
      `
      INSERT INTO affectation (id_utilisateur, id_reseau, date_affectation)
      VALUES (?, ?, NOW())
      `,
      [user_id, id]
    );

    return {
      "message": "Member added successfully",
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
      "message": "Member removed successfully",
      "network_id": network_id,
      "user_id": member_id
    };
  }

  // 🔹 GET CACHES
  async getCaches(network_id: number, type_id?: number, state_id?: number) {
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