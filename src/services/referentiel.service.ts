import { CachesTypes, CachesStates} from '../models/referentiel.model';
import { ReferentielRepository } from '../repositories/referentiel.repository';

export class ReferentielService {
  constructor(private readonly referentielRepository: ReferentielRepository = new ReferentielRepository()) {}

  async getAllCachesTypes(): Promise<CachesTypes[]> {
    return this.referentielRepository.findAllCachesTypes();
  }

  async getAllCachesStates(): Promise<CachesStates[]> {
    return this.referentielRepository.findAllCachesStates();
  }

}