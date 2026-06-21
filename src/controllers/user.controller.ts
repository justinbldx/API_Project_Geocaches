import { Request, Response } from 'express';
import { BadRequestError, ForbiddenError } from '../errors/AppError';
import { UserService } from '../services/user.service';

/**
 * Le controller ne contient AUCUNE règle métier ni requête SQL.
 * Son seul travail : lire la requête HTTP, appeler le service, renvoyer la réponse.
 */
export class UserController {
    constructor(private readonly userService: UserService = new UserService()) { }

    getAll = async (_req: Request, res: Response): Promise<void> => {
        const users = await this.userService.getAllUsers();
        // Conforme à l'OpenAPI : renvoie un objet avec la propriété 'users'
        res.status(200).json({ users });
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const user = await this.userService.getUserById(parseId(req.params.id as string));
        res.status(200).json(user);
    };

    create = async (req: Request, res: Response): Promise<void> => {
        if (req.body.role === 'admin' && req.user?.role !== 'admin') {
            throw new ForbiddenError("Seul un administrateur peut créer un utilisateur avec le rôle 'admin'");
        }

        const user = await this.userService.register(req.body);
        res.status(201).json(user);
    };

    getUsersVisits = async (req: Request, res: Response): Promise<void> => {
        const id = parseId(req.params.id as string);

        if (req.user!.role !== 'admin' && req.user!.id !== id) {
            throw new ForbiddenError("Vous n'avez pas la permission de consulter les visites de cet utilisateur");
        }

        const visits = await this.userService.getUsersVisits(id, req.query.found === 'true' ? true : req.query.found === 'false' ? false : undefined);
        res.status(200).json({ visits });
    };

    update = async (req: Request, res: Response): Promise<void> => {
        const id = parseId(req.params.id as string);

        if (req.user!.role !== 'admin' && req.user!.id !== id) {
            throw new ForbiddenError("Vous n'avez pas la permission de modifier cet utilisateur");
        }

        if (req.body.role === 'admin' && req.user!.role !== 'admin') {
            throw new ForbiddenError("Seul un administrateur peut attribuer le rôle 'admin'");
        }

        const user = await this.userService.updateUser(id, req.body);
        res.status(200).json(user);
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const id = parseId(req.params.id as string);

        if (req.user!.role !== 'admin' && req.user!.id !== id) {
            throw new ForbiddenError("Vous n'avez pas la permission de supprimer cet utilisateur");
        }

        await this.userService.deleteUser(id);
        res.status(200).json({ message: 'Utilisateur supprimé' });
    };
}

function parseId(rawId: string): number {
    const id = Number(rawId);
    if (Number.isNaN(id) || rawId.trim() === '') {
        throw new BadRequestError(`Identifiant invalide : ${rawId}`);
    }
    return id;
}