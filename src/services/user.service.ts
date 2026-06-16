import bcrypt from 'bcrypt'; // npm i bcrypt && npm i --save-dev @types/bcrypt
import { BadRequestError, ConflictError, NotFoundError, ForbiddenError } from '../errors/AppError'; // Ajout de ForbiddenError pour les 403
import { CreateUserDTO, UpdateUserDTO, User, UserDetailDTO } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';

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

  /**
   * Logique de création de compte (Register)
   */
  async createUser(data: CreateUserDTO): Promise<User> {
    // 1. Validation des champs obligatoires selon OpenAPI
    if (!data.username || !data.password) {
      throw new BadRequestError("Le nom d'utilisateur (username) et le mot de passe sont obligatoires");
    }

    // 2. Validation de la contrainte de taille du mot de passe (minLength: 8)
    if (data.password.length < 8) {
      throw new BadRequestError("Le mot de passe doit contenir au moins 8 caractères");
    }

    // 3. Vérification de l'unicité du pseudo (Renvoie une 409 en cas de doublon)
    const existing = await this.userRepository.findByUsername(data.username);
    if (existing) {
      throw new ConflictError(`Le pseudo "${data.username}" est déjà utilisé`);
    }

    // 4. Hachage du mot de passe avant l'écriture en base de données
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
  async updateUser(id: number, currentUser: { id: number; role: string }, data: UpdateUserDTO): Promise<User> {
    // 1. Règle de sécurité : Seul un admin ou le propriétaire du compte peut modifier
    if (currentUser.role !== 'admin' && currentUser.id !== id) {
      throw new ForbiddenError("Vous n'êtes pas autorisé à modifier ce compte");
    }

    // 2. Empêcher un utilisateur standard de tricher en passant son rôle à 'admin'
    if (data.role && data.role === 'admin' && currentUser.role !== 'admin') {
      throw new ForbiddenError("Vous ne pouvez pas vous attribuer le rôle administrateur");
    }

    // 3. Vérifier que l'utilisateur à modifier existe bel et bien
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`Utilisateur ${id} introuvable`);
    }

    const updatePayload: UpdateUserDTO = { ...data };

    // 4. Si un nouveau mot de passe est fourni, on le valide et on le hache
    if (data.password) {
      if (data.password.length < 8) {
        throw new BadRequestError("Le nouveau mot de passe doit contenir au moins 8 caractères");
      }
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
  async deleteUser(id: number, currentUser: { id: number; role: string }): Promise<void> {
    // 1. Règle de sécurité : Seul un admin ou le propriétaire du compte peut le supprimer
    if (currentUser.role !== 'admin' && currentUser.id !== id) {
      throw new ForbiddenError("Vous n'êtes pas autorisé à supprimer ce compte");
    }

    // 2. Vérifier l'existence
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`Utilisateur ${id} introuvable`);
    }

    await this.userRepository.delete(id);
  }
}