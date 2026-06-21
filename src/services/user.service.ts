import bcrypt from 'bcrypt';
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
    // Validation des champs obligatoires 
    if (
        !data.username 
        || !data.password
      ) {  
      throw new BadRequestError("Le nom d'utilisateur (username) et le mot de passe sont obligatoires");
    }

    // Validation de la contrainte de taille du mot de passe (minLength: 8)
    if (data.password.length < 8) {
      throw new BadRequestError("Le mot de passe doit contenir au moins 8 caractères");
    }

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
    // 3. Vérifier que l'utilisateur à modifier existe bel et bien
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`Utilisateur ${id} introuvable`);
    }

    const updatePayload: UpdateUserDTO = { ...data };

    // 4. Si un nouveau mot de passe est fourni, on le valide et on le hache
    if (data?.password) {
      if (data?.password?.length < 8) {
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
  async deleteUser(id: number): Promise<void> {
    // Vérifier l'existence de l'utilisateur en base de données
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`Utilisateur ${id} introuvable`);
    }

    await this.userRepository.delete(id);
  }
}