import { Router } from 'express';
import { UserController } from './controllers/user.controller';
import { asyncHandler } from './middlewares/asyncHandler';
//import { authenticateJWT } from './middlewares/authHandler'; // Pense à créer ou importer ton middleware d'authentification

const router = Router();
const userController = new UserController();

/**
 * --- ROUTES PUBLIC ---
 */

// Créer un compte (Inscription / Register) - Public selon l'OpenAPI
router.post('/', asyncHandler(userController.create));


/**
 * --- ROUTES PROTÉGÉES (Nécessitent un Token JWT valide) ---
 */

// Lister les utilisateurs
router.get('/', asyncHandler(userController.getAll));

// Détail d'un utilisateur (avec ses réseaux)
router.get('/:id', asyncHandler(userController.getById));

// Modifier un utilisateur (Sécurité propriétaire/admin gérée dans le Service)
router.put('/:id', asyncHandler(userController.update));

// Supprimer un utilisateur (Sécurité propriétaire/admin gérée dans le Service)
router.delete('/:id', asyncHandler(userController.delete));

export default router;