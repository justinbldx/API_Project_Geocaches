import bcrypt from 'bcrypt';
import { BadRequestError, ConflictError, NotFoundError } from '../errors/AppError'; // Ajout de ForbiddenError pour les 403
import { User, UserDetailDTO } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDTO, UpdateUserDTO } from '../models/user.schema';

/**
 * Le service contient la logique métier (validations, règles, orchestration).
 * Il ne connaît ni req/res (Express) ni SQL (ça, c'est le rôle du repository).
 * L'injection du repository par constructeur facilite les tests unitaires.
 */
export class UserService {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  /**
   * Récupère la liste de tous les utilisateurs
   */
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  /**
   * Récupère le profil complet d'un utilisateur avec ses réseaux (Exigence GET /users/{id})
   */
  async getUserById(id: number): Promise<UserDetailDTO> {
    const userDetail = await this.userRepository.findDetailWithNetworks(id);
    if (!userDetail) {
      throw new NotFoundError(`Utilisateur ${id} introuvable`);
    }
    return userDetail;
  }

  async getUsersVisits(userId: number, found?: boolean): Promise<any[]> {
    // Vérifier que l'utilisateur existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(`Utilisateur ${userId} introuvable`);
    }

    return this.userRepository.getUsersVisits(userId, found);
  }

  /**
   * Permet de récupérer un utilisateur avec son nom d'utilisateur (pseudo)
   */
  async getByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  /**
   * Permet de récupérer les réseaux associés à un utilisateur
   * @param user L'utilisateur pour lequel on veut récupérer les réseaux
   * @returns L'objet UserDetailDTO contenant les informations de l'utilisateur et ses réseaux
   */
  async getUserNetworks(user: User): Promise<UserDetailDTO> {
    return this.userRepository.getUserNetworks(user);
  }

  /**
   * Logique de création de compte (Register)
   */
  async register(data: CreateUserDTO): Promise<User> {
    // Vérification de l'unicité du pseudo (Renvoie une 409 en cas de doublon)
    const existing = await this.userRepository.findByUsername(data.username);
    if (existing) {
      throw new ConflictError(`Le pseudo "${data.username}" est déjà utilisé`);
    }

    // Hachage du mot de passe avant l'écriture en base de données
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
  }

  /**
   * Logique de modification de compte (PUT /users/{id})
   * Reçoit l'ID de la cible ainsi que les infos de l'utilisateur qui fait la requête (currentUser)
   */
  async updateUser(id: number, data: UpdateUserDTO): Promise<User> {
    // Vérifier que l'utilisateur à modifier existe bel et bien
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`Utilisateur ${id} introuvable`);
    }

    const updatePayload: UpdateUserDTO = { ...data };

    // Si le nom change, on vérifie qu'il n'est pas déjà utilisé par un autre utilisateur
    if (data.username && data.username !== user.username) {
      const existing = await this.userRepository.findByUsername(data.username);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Le pseudo "${data.username}" est déjà utilisé`);
      }
    }

    // Si un nouveau mot de passe est fourni, on le valide et on le hache
    if (data?.password) {      
      updatePayload.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await this.userRepository.update(id, updatePayload);
    if (!updated) {
      throw new NotFoundError(`Utilisateur ${id} introuvable`);
    }

    return updated;
  }

  /**
   * Logique de suppression de compte (DELETE /users/{id})
   */
  async deleteUser(id: number): Promise<void> {
    // Vérifier l'existence de l'utilisateur en base de données
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`Utilisateur ${id} introuvable`);
    }

    await this.userRepository.delete(id);
  }
}