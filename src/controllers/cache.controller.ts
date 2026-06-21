import { Request, Response } from 'express';
import { BadRequestError, ForbiddenError } from '../errors/AppError';
import { CacheService } from '../services/cache.service';
import { NetworkService } from '../services/network.service';

export class CacheController {
    constructor(
        private readonly cacheService: CacheService = new CacheService(),
        private readonly networkService: NetworkService = new NetworkService()
    ) { }

    getById = async (req: Request, res: Response): Promise<void> => {
        const id = parseId(req.params.id as string);
        const cache = await this.cacheService.getCacheById(id);

        if (
            !await this.networkService.isMember(cache.network.id, req.user!.id)
            && req.user!.role !== 'admin'
        ) {
            throw new ForbiddenError('Vous ne pouvez pas consulter ce cache car vous n\'êtes pas membre du réseau associé');
        }

        res.status(200).json(cache);
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
        res.status(200).json(caches);
    };

    create = async (req: Request, res: Response): Promise<void> => {
        if (
            !await this.networkService.isOwner(req.body.network_id, req.user!.id)
            && req.user!.role !== 'admin'
        ) {
            throw new ForbiddenError('Vous ne pouvez pas créer de cache car vous n\'êtes pas le propriétaire du réseau associé');
        }

        const cache = await this.cacheService.createCache(req.user!, req.body);
        res.status(201).json(cache);
    };

    update = async (req: Request, res: Response): Promise<void> => {
        const id = parseId(req.params.id as string);
        const cache = await this.cacheService.getCacheById(id);

        if (
            !await this.networkService.isOwner(cache.network.id, req.user!.id)
            && req.user!.role !== 'admin'
        ) {
            throw new ForbiddenError('Vous ne pouvez pas mettre à jour ce cache car vous n\'êtes pas le propriétaire du réseau associé');
        }


        const updatedCache = await this.cacheService.updateCache(id, req.body);
        res.status(200).json(updatedCache);
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const id = parseId(req.params.id as string);
        const cache = await this.cacheService.getCacheById(id);

        if (!cache) {
            throw new BadRequestError(`Le cache avec l'identifiant ${id} n'existe pas`);
        }

        if (
            !await this.networkService.isOwner(cache.network.id, req.user!.id)
            && req.user!.role !== 'admin'
        ) {
            throw new ForbiddenError('Vous ne pouvez pas supprimer ce cache car vous n\'êtes pas le propriétaire du réseau associé');
        }

        await this.cacheService.deleteCache(id);
        res.status(200).json({ message: 'Cache supprimé' });
    };

    getVisitsByCache = async (req: Request, res: Response): Promise<void> => {
        const id = parseId(req.params.id as string);
        const cache = await this.cacheService.getCacheById(id);

        if (
            !await this.networkService.isMember(cache.network.id, req.user!.id)
            && req.user!.role !== 'admin'
        ) {
            throw new ForbiddenError('Vous ne pouvez pas accéder aux visites de ce cache car vous n\'êtes pas le propriétaire du réseau associé');
        }

        const visits = await this.cacheService.getCacheVisits(id);
        res.status(200).json(visits);
    };
}

function parseId(rawId: string): number {
    const id = Number(rawId);
    if (Number.isNaN(id)) {
        throw new BadRequestError(`Identifiant invalide : ${rawId}`);
    }
    return id;
}
