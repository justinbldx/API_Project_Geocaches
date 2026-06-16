export type UserRole = 'user' | 'admin';

// Représente un utilisateur complet en Base de Données
export interface User {
    id: number;
    username: string;
    password?: string; // Optionnel car on ne le sélectionne pas toujours dans les requêtes SELECT
    role: UserRole;
}

// Reçu lors de la création (POST /users)
export interface CreateUserDTO {
    username: string;  // Corrigé (name -> username)
    password: string;  // Minimum 8 caractères
    role?: UserRole;   // Optionnel car 'user' par défaut
}

// Reçu lors de la modification (PUT /users/{id})
export interface UpdateUserDTO {
    username?: string; // Corrigé (name -> username)
    password?: string; // Ajouté car modifiable selon OpenAPI
    role?: UserRole;   // Présent
}

// Utilisé pour le détail des réseaux d'un utilisateur
export interface NetworkSummary {
    id: number;
    name: string;
    affectationDate?: string;
}

// Renvoyé lors du GET /users/{id}
export interface UserDetailDTO {
    id: number;
    username: string;
    role: UserRole;
    networks: NetworkSummary[];
}