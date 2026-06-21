export type UserRole = 'user' | 'admin';

// Représente un utilisateur complet en Base de Données
export interface User {
    id: number;
    username: string;
    password?: string; // Optionnel car on ne le sélectionne pas toujours dans les requêtes SELECT
    role: UserRole;
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