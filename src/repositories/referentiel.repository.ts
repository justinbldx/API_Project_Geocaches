import { pool } from '../config/database';
import { CachesTypes, CachesStates } from '../models/referentiel.model';

export class ReferentielRepository {
    async findAllCachesTypes(): Promise<CachesTypes[]> {
        const rows = await pool.query(
            'SELECT id, libelle FROM type_cache ORDER BY id ASC'
        ) as unknown as CachesTypes[];
        return rows;
    }

    async findAllCachesStates(): Promise<CachesStates[]> {
        const rows = await pool.query(
            'SELECT id, libelle FROM etat_cache ORDER BY id ASC'
        ) as unknown as CachesStates[];
        return rows;
    }
}