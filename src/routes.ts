import { Router } from 'express';
import { UserController } from './controllers/user.controller';
import { VisitController } from './controllers/visit.controller';
import { ReferentielController } from './controllers/referentiel.controller';
import { CacheController } from './controllers/cache.controller';
import { NetworkController } from './controllers/network.controller';
import { asyncHandler } from './middlewares/asyncHandler';
import { AuthController } from './controllers/auth.controller';

const router = Router();
const cacheController = new CacheController();
const networkController = new NetworkController();
const userController = new UserController();
const visitController = new VisitController();
const referentielController = new ReferentielController();
const authController = new AuthController();

// Route pour login
router.post("/login", asyncHandler(authController.login));

// Routes de visites
router.post("/visits", asyncHandler(visitController.create));
router.get("/visits/:id", asyncHandler(visitController.getById));

// Routes de référentiel
router.get("/caches-types", asyncHandler(referentielController.getAllCachesTypes));
router.get("/caches-states", asyncHandler(referentielController.getAllCachesStates));

// Routes utilisateurs
router.get('/users', asyncHandler(userController.getAll));
router.post('/users', asyncHandler(userController.create));
router.get('/users/:id', asyncHandler(userController.getById));
router.put('/users/:id', asyncHandler(userController.update));
router.delete('/users/:id', asyncHandler(userController.delete));
router.get('/users/:id/visits', asyncHandler(userController.getUsersVisits));

// Caches routes
router.post('/caches', asyncHandler(cacheController.create));
router.get('/caches/:id', asyncHandler(cacheController.getById));
router.put('/caches/:id', asyncHandler(cacheController.update));
router.delete('/caches/:id', asyncHandler(cacheController.delete));
router.get('/caches/:id/visits', asyncHandler(cacheController.getVisitsByCache));

// Network routes
router.get('/networks', asyncHandler(networkController.getAll));
router.get('/networks/:id', asyncHandler(networkController.getById));
router.post('/networks', asyncHandler(networkController.create));
router.put('/networks/:id', asyncHandler(networkController.update));
router.delete('/networks/:id', asyncHandler(networkController.delete));
router.get('/networks/:id/members', asyncHandler(networkController.getMembers));
router.post('/networks/:id/members', asyncHandler(networkController.addMember));
router.delete(
  '/networks/:network_id/members/:member_id',
  asyncHandler(networkController.removeMember)
);
router.get('/networks/:id/caches', asyncHandler(networkController.getCaches));

export default router;