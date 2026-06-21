import { Request, Response } from 'express';
import { BadRequestError } from '../errors/AppError';
import { UserService } from '../services/user.service';

/**
 * Interface étendue pour récupérer l'utilisateur injecté par le middleware d'authentification
 */
interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        role: 'user' | 'admin';
        username: string;
    };
}

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
        const id = parseId(req.params.id as string);
        const user = await this.userService.getUserById(id);
        // Conforme à l'OpenAPI : renvoie directement le détail de l'utilisateur (UserDetailWithNetworksDetail)
        res.status(200).json(user);
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const user = await this.userService.register(req.body);
        // Conforme à l'OpenAPI : renvoie directement le UserSummary de l'utilisateur créé
        res.status(201).json(user);
    };

    update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const id = parseId(req.params.id as string);

        // On récupère l'utilisateur connecté grâce au middleware d'authentification
        // Le "!" indique à TS qu'on est sûr qu'il existe (garanti par le middleware de route)
        const currentUser = req.user!;

        const user = await this.userService.updateUser(id, req.body);
        res.status(200).json(user);
    };

    delete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const id = parseId(req.params.id as string);

        await this.userService.deleteUser(id);
        // Conforme à l'OpenAPI : renvoie un code 200 avec un message de confirmation
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