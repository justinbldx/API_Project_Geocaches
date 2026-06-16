import { BadRequestError, ConflictError, NotFoundError } from '../errors/AppError';
import { CreateUserDTO, UpdateUserDTO, User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';

/**
 * Le service contient la logique métier (validations, règles, orchestration).
 * Il ne connaît ni req/res (Express) ni SQL (ça, c'est le rôle du repository).
 * L'injection du repository par constructeur facilite les tests unitaires
 * (on peut passer un faux repository en mock).
 */
export class UserService {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`Utilisateur ${id} introuvable`);
    }
    return user;
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    if (!data.name || !data.email) {
      throw new BadRequestError("Le nom et l'email sont obligatoires");
    }

    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictError(`Un utilisateur avec l'email ${data.email} existe déjà`);
    }

    return this.userRepository.create(data);
  }

  async updateUser(id: number, data: UpdateUserDTO): Promise<User> {
    await this.getUserById(id); // lève NotFoundError si absent
    const updated = await this.userRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Utilisateur ${id} introuvable`);
    }
    return updated;
  }

  async deleteUser(id: number): Promise<void> {
    await this.getUserById(id);
    await this.userRepository.delete(id);
  }
}