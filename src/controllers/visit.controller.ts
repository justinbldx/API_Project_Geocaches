import { Request, Response } from 'express';
import { BadRequestError } from '../errors/AppError';
import { VisitService } from '../services/visit.service';

export class VisitController {
    constructor(private readonly visitService: VisitService = new VisitService()) { }

    getById = async (req: Request, res: Response): Promise<void> => {
        const id = parseId(req.params.id as string);
        const visit = await this.visitService.getVisitById(id);
        res.status(200).json({ status: 'success', data: visit });
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const payload = {
            id_user: req.body.id_user ?? req.body.id_utilisateur,
            id_geocache: req.body.id_geocache ?? req.body.id_cache,
            date_heure: req.body.date_heure,
            commentaire: req.body.commentaire ?? req.body.comment,
            cache_trouve: req.body.cache_trouve ?? req.body.found,
        };

        const visit = await this.visitService.createVisit(payload);
        res.status(201).json({ status: 'success', data: visit });
    };
}

function parseId(rawId: string): number {
    const id = Number(rawId);
    if (Number.isNaN(id)) {
        throw new BadRequestError(`Identifiant invalide : ${rawId}`);
    }
    return id;
}
