import { Request, Response } from 'express';
import { ReferentielService } from '../services/referentiel.service';


export class ReferentielController {
    constructor(private readonly referentielService: ReferentielService = new ReferentielService()) { }

    getAllCachesTypes = async (_req: Request, res: Response): Promise<void> => {
        const types = await this.referentielService.getAllCachesTypes();
        res.status(200).json({ types });
    };

    getAllCachesStates = async (_req: Request, res: Response): Promise<void> => {
        const states = await this.referentielService.getAllCachesStates();
        res.status(200).json({ states });
    };
}