import { NotFoundError } from '../errors/AppError';
import { CreateVisitDTO, Visit } from '../models/visit.model';
import { VisitRepository } from '../repositories/visit.repository';


export class VisitService {
  constructor(private readonly visitRepository: VisitRepository = new VisitRepository()) {}

  async getVisitById(id: number): Promise<Visit> {
    const visit = await this.visitRepository.findById(id);
    if (!visit) {
      throw new NotFoundError(`Visite ${id} introuvable`);
    }
    return visit;
  }

  async createVisit(data: CreateVisitDTO): Promise<Visit> {
    return this.visitRepository.create(data);
  }
}