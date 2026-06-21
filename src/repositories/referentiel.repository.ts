import { pool } from '../config/database';
import { CachesTypes, CachesStates } from '../models/referentiel.model';

export class ReferentielRepository {
    convertRowToCachesTypes(row: any): CachesTypes {
        return {
            id: row.id,
            name: row.libelle
        }
    }
    
    async findAllCachesTypes(): Promise<CachesTypes[]> {
        const rows = await pool.query(
            'SELECT id, libelle FROM type_cache ORDER BY id ASC'
        );

        return rows.map((row: any) => this.convertRowToCachesTypes(row));
    }

    convertRowToCachesStates(row: any): CachesStates {
        return {
            id: row.id,
            name: row.libelle
        }
    }

    async findAllCachesStates(): Promise<CachesStates[]> {
        const rows = await pool.query(
            'SELECT id, libelle FROM etat_cache ORDER BY id ASC'
        );
        
        return rows.map((row: any) => this.convertRowToCachesStates(row));
    }
}