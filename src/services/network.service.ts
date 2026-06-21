import { NetworkRepository } from '../repositories/network.repository';

export class NetworkService {
  private networkRepository = new NetworkRepository();

  getAll() {
    return this.networkRepository.getAll();
  }

  getById(id: number) {
    return this.networkRepository.getById(id);
  }

  create(data: any) {
    return this.networkRepository.create(data);
  }

  update(id: number, data: any) {
    return this.networkRepository.update(id, data);
  }

  delete(id: number) {
    return this.networkRepository.delete(id);
  }

  getMembers(id: number) {
    return this.networkRepository.getMembers(id);
  }

  addMember(id: number, data: any) {
    return this.networkRepository.addMember(id, data);
  }

  removeMember(network_id: number, member_id: number) {
    return this.networkRepository.removeMember(
      network_id,
      member_id
    );
  }

  getCaches(
    networkId: number,
    typeId?: number,
    stateId?: number
  ) {
    return this.networkRepository.getCaches(
      networkId,
      typeId,
      stateId
    );
  }
}