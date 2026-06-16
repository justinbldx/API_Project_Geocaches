import { BadRequestError, NotFoundError } from '../errors/AppError';
import { CacheRepository } from '../repositories/cache.repository';
import { CacheDetail, CacheSummary, CreateCacheDTO, UpdateCacheDTO } from '../models/cache.model';

export class CacheService {
    constructor(private readonly cacheRepository: CacheRepository = new CacheRepository()) { }

    async getCacheById(id: number): Promise<CacheDetail> {
        const cache = await this.cacheRepository.findById(id);
        if (!cache) {
            throw new NotFoundError(`Cache ${id} introuvable`);
        }
        return cache;
    }

    async getCachesByNetwork(networkId: number, typeId?: number, stateId?: number): Promise<CacheSummary[]> {
        return this.cacheRepository.findByNetwork(networkId, typeId, stateId);
    }

    async createCache(data: CreateCacheDTO): Promise<CacheDetail> {
        if (!data.description || data.latitude === undefined || data.longitude === undefined || data.type_id === undefined || data.network_id === undefined) {
            throw new BadRequestError('description, latitude, longitude, type_id et network_id sont obligatoires');
        }

        if (data.latitude < -90 || data.latitude > 90 || data.longitude < -180 || data.longitude > 180) {
            throw new BadRequestError('Coordonnées invalides');
        }

        return this.cacheRepository.create(data);
    }

    async updateCache(id: number, data: UpdateCacheDTO): Promise<CacheDetail> {
        if ((data.latitude !== undefined && data.longitude === undefined) || (data.longitude !== undefined && data.latitude === undefined)) {
            throw new BadRequestError('Les deux coordonnées latitude et longitude doivent être fournies ensemble');
        }

        await this.getCacheById(id);
        const updated = await this.cacheRepository.update(id, data);
        if (!updated) {
            throw new NotFoundError(`Cache ${id} introuvable`);
        }
        return updated;
    }

    async getCacheVisits(id: number): Promise<import('../models/cache.model').VisitSummaryWithoutCache[]> {
        await this.getCacheById(id);
        return this.cacheRepository.findVisitsByCache(id);
    }

    async deleteCache(id: number): Promise<void> {
        await this.getCacheById(id);
        await this.cacheRepository.delete(id);
    }
}
