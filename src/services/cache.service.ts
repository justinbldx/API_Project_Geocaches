import { BadRequestError, NotFoundError } from '../errors/AppError';
import { CacheRepository } from '../repositories/cache.repository';
import { CacheDetail, CacheSummary } from '../models/cache.model';
import { CreateCacheDTO, UpdateCacheDTO } from '../models/cache.schema';
import { NetworkRepository } from '../repositories/network.repository';
import { JWTUser } from '../types/types';

export class CacheService {
    constructor(
        private readonly cacheRepository: CacheRepository = new CacheRepository(),
        private readonly networkRepository: NetworkRepository = new NetworkRepository()
    ) { }

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

    async createCache(user: JWTUser, data: CreateCacheDTO): Promise<CacheDetail> {
        if (!await this.cacheRepository.checkTypeExists(data.type_id)) {
            throw new BadRequestError(`Le type de cache ${data.type_id} n'existe pas`);
        }

        const stateId = data.state_id ?? 1;
        if (!await this.cacheRepository.checkStateExists(stateId)) {
            throw new BadRequestError(`L'état de cache ${stateId} n'existe pas`);
        }

        return this.cacheRepository.create(data);
    }

    async updateCache(id: number, data: UpdateCacheDTO): Promise<CacheDetail> {
        if (data.type_id !== undefined && !await this.cacheRepository.checkTypeExists(data.type_id)) {
            throw new BadRequestError(`Le type de cache ${data.type_id} n'existe pas`);
        }

        if (data.state_id !== undefined && !await this.cacheRepository.checkStateExists(data.state_id)) {
            throw new BadRequestError(`L'état de cache ${data.state_id} n'existe pas`);
        }

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
        await this.cacheRepository.delete(id);
    }
}
