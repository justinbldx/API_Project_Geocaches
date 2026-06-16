import { Request, Response } from 'express';
import { BadRequestError } from '../errors/AppError';
import { UserService } from '../services/user.service';

/**
 * Le controller ne contient AUCUNE règle métier ni requête SQL.
 * Son seul travail : lire la requête HTTP, appeler le service, renvoyer la réponse.
 * Les méthodes sont déclarées en propriétés fléchées pour garder un `this`
 * correctement lié quand elles sont passées directement à `router.get(...)`.
 */
export class UserController {
    constructor(private readonly userService: UserService = new UserService()) { }

    getAll = async (_req: Request, res: Response): Promise<void> => {
        const users = await this.userService.getAllUsers();
        res.status(200).json({ status: 'success', data: users });
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const id = parseId(req.params.id as string);
        const user = await this.userService.getUserById(id);
        res.status(200).json({ status: 'success', data: user });
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const user = await this.userService.createUser(req.body);
        res.status(201).json({ status: 'success', data: user });
    };

    update = async (req: Request, res: Response): Promise<void> => {
        const id = parseId(req.params.id as string);
        const user = await this.userService.updateUser(id, req.body);
        res.status(200).json({ status: 'success', data: user });
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const id = parseId(req.params.id as string);
        await this.userService.deleteUser(id);
        res.status(204).send();
    };
}

function parseId(rawId: string): number {
    const id = Number(rawId);
    if (Number.isNaN(id)) {
        throw new BadRequestError(`Identifiant invalide : ${rawId}`);
    }
    return id;
}