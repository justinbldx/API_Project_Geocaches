import { Request, Response } from 'express';
import { BadRequestError, ForbiddenError } from '../errors/AppError';
import { VisitService } from '../services/visit.service';
import { sanitizeUser } from '../utils/sanitizeUser';

export class VisitController {
    constructor(
        private readonly visitService: VisitService = new VisitService()
    ) { }

    /**
     * Permet de récupérer une visite par son identifiant
     * @param req La requête HTTP
     * @param res La réponse HTTP
     */
    getById = async (req: Request, res: Response): Promise<void> => {
        const visitId = parseId(req.params.id as string);
        const visit = await this.visitService.getVisitById(visitId);

        // On vérifie que l'utilisateur connecté est bien le propriétaire de la visite ou un administrateur
        if (visit.owner !== req.user!.id && req.user!.role !== 'admin') {
            throw new ForbiddenError(`Vous n'avez pas la permission d'accéder à cette visite`);
        }       

        res.status(200).json(visit.data);
    };

    /**
     * Permet de créer une nouvelle visite pour un utilisateur
     * @param req La requête HTTP
     * @param res La réponse HTTP
     */
    create = async (req: Request, res: Response): Promise<void> => {
        const visit = await this.visitService.createVisit(req.user!, req.body);
        res.status(201).json({ user: sanitizeUser(req.user!), ...visit});
    };
}

/**
 * Permet de convertir un identifiant de visite depuis la requête HTTP en nombre
 * @param rawId Identifiant de visite brut depuis la requête HTTP
 * @returns 
 */
function parseId(rawId: string): number {
    const id = Number(rawId);
    if (Number.isNaN(id)) {
        throw new BadRequestError(`Identifiant invalide : ${rawId}`);
    }

    return id;
}
