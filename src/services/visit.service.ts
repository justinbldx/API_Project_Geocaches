import { NotFoundError } from '../errors/AppError';
import { DetailedVisit, Visit } from '../models/visit.model';
import { CreateVisitDTO } from '../models/visit.schema';
import { VisitRepository } from '../repositories/visit.repository';
import { JWTUser, OwnedEntity } from '../types/types';

export class VisitService {
  constructor(
    private readonly visitRepository: VisitRepository = new VisitRepository()
  ) { }

  /**
   * Permet de récupérer une visite par son identifiant
   * @param id La visite à récupérer
   */
  async getVisitById(id: number): Promise<OwnedEntity<DetailedVisit>> {
    const visit = await this.visitRepository.findById(id);
    if (!visit) {
      throw new NotFoundError(`Visite ${id} introuvable`);
    }
    
    return visit;
  }

  /**
   * Permet de créer une nouvelle visite pour un utilisateur
   * @param user L'utilisateur souhaitant ajouter une visite
   * @param data Les données nécessaires pour ajouter sa visite
   */
  async createVisit(user: JWTUser, data: CreateVisitDTO): Promise<Visit> {
    return this.visitRepository.create(user, data);
  }
}