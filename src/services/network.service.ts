import { BadRequestError } from '../errors/AppError';
import { CacheSummary } from '../models/cache.model';
import { AddMemberDTO } from '../models/cache.schema';
import { NetworkDetail, NetworkMemberAssignment } from '../models/network.model';
import { CreateNetworkDTO, UpdateNetworkDTO } from '../models/network.schema';
import { NetworkRepository } from '../repositories/network.repository';
import { UserRepository } from '../repositories/user.repository';
import { JWTUser } from '../types/types';

export class NetworkService {
  private networkRepository = new NetworkRepository();
  private userRepository = new UserRepository();

  getAll() {
    return this.networkRepository.getAll();
  }

  getById(id: number) {
    return this.networkRepository.getById(id);
  }

  create(user: JWTUser, data: CreateNetworkDTO): Promise<NetworkDetail> {
    return this.networkRepository.create(user, data);
  }

  update(id: number, data: UpdateNetworkDTO): Promise<NetworkDetail | null> {
    return this.networkRepository.update(id, data);
  }

  delete(id: number) {
    return this.networkRepository.delete(id);
  }

  isMember(networkId: number, userId: number): Promise<boolean> {
    return this.networkRepository.isMember(networkId, userId);
  }

  isOwner(networkId: number, userId: number): Promise<boolean> {
    return this.networkRepository.isOwner(networkId, userId);
  }

  getMembers(id: number) {
    return this.networkRepository.getMembers(id);
  }

  async addMember(id: number, data: AddMemberDTO): Promise<NetworkMemberAssignment> {
    if (!await this.userRepository.findById(data.user_id)) {
      throw new BadRequestError(`L'utilisateur avec l'identifiant ${data.user_id} n'existe pas`);
    }
    
    if (await this.networkRepository.isMember(id, data.user_id)) {
      throw new BadRequestError('Cet utilisateur est déjà membre de ce réseau');
    }

    return this.networkRepository.addMember(id, data);
  }

  async removeMember(network_id: number, member_id: number) {
    if (!await this.networkRepository.isMember(network_id, member_id)) {
      throw new BadRequestError('Cet utilisateur n\'existe pas ou n\'est pas membre de ce réseau');
    }

    return this.networkRepository.removeMember(
      network_id,
      member_id
    );
  }

  getCaches(
    networkId: number,
    typeId?: number,
    stateId?: number
  ): Promise<CacheSummary[]> {
    return this.networkRepository.getCaches(
      networkId,
      typeId,
      stateId
    );
  }
}