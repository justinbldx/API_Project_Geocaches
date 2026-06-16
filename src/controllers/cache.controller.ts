import { Request, Response } from 'express';
import { BadRequestError } from '../errors/AppError';
import { CacheService } from '../services/cache.service';

export class CacheController {
    constructor(private readonly cacheService: CacheService = new CacheService()) { }

    getById = async (req: Request, res: Response): Promise<void> => {
        const id = parseId(req.params.id as string);
        const cache = await this.cacheService.getCacheById(id);
        res.status(200).json({ status: 'success', data: cache });
    };

    getByNetwork = async (req: Request, res: Response): Promise<void> => {
        const networkId = parseId(req.params.id as string);
        const typeId = req.query.type_id ? Number(req.query.type_id) : undefined;
        const stateId = req.query.state_id ? Number(req.query.state_id) : undefined;

        if (req.query.type_id !== undefined && Number.isNaN(typeId)) {
            throw new BadRequestError('type_id doit être un entier');
        }
        if (req.query.state_id !== undefined && Number.isNaN(stateId)) {
            throw new BadRequestError('state_id doit être un entier');
        }

        const caches = await this.cacheService.getCachesByNetwork(networkId, typeId, stateId);
        res.status(200).json({ status: 'success', data: caches });
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const cache = await this.cacheService.createCache(req.body);
        res.status(201).json({ status: 'success', data: cache });
    };

    update = async (req: Request, res: Response): Promise<void> => {
        const id = parseId(req.params.id as string);
        const cache = await this.cacheService.updateCache(id, req.body);
        res.status(200).json({ status: 'success', data: cache });
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const id = parseId(req.params.id as string);
        await this.cacheService.deleteCache(id);
        res.status(204).send();
    };

    getVisitsByCache = async (req: Request, res: Response): Promise<void> => {
        const id = parseId(req.params.id as string);
        const visits = await this.cacheService.getCacheVisits(id);
        res.status(200).json({ status: 'success', data: visits });
    };
}

function parseId(rawId: string): number {
    const id = Number(rawId);
    if (Number.isNaN(id)) {
        throw new BadRequestError(`Identifiant invalide : ${rawId}`);
    }
    return id;
}
