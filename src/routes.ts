import { Router } from 'express';
import { UserController } from './controllers/user.controller';
import { VisitController } from './controllers/visit.controller';
import { ReferentielController } from './controllers/referentiel.controller';
import { CacheController } from './controllers/cache.controller';
import { NetworkController } from './controllers/network.controller';
import { asyncHandler } from './middlewares/asyncHandler';
import { AuthController } from './controllers/auth.controller';
import { auth } from './middlewares/auth';
import { validate } from './middlewares/validate';
import { createVisitSchema } from './models/visit.schema';
import { createUserSchema, updateUserSchema } from './models/user.schema';
import { addMemberSchema, createCacheSchema, updateCacheSchema } from './models/cache.schema';
import { createNetworkSchema, updateNetworkSchema } from './models/network.schema';

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
router.post("/visits", auth(), validate(createVisitSchema), asyncHandler(visitController.create));
router.get("/visits/:id", auth(), asyncHandler(visitController.getById));

// Routes utilisateurs
router.get('/users', auth(), asyncHandler(userController.getAll));
router.post('/users', auth({ required: false }), validate(createUserSchema), asyncHandler(userController.create));
router.get('/users/:id', auth(), asyncHandler(userController.getById));
router.patch('/users/:id', auth(), validate(updateUserSchema), asyncHandler(userController.update));
router.delete('/users/:id', auth(), asyncHandler(userController.delete));
router.get('/users/:id/visits', auth(), asyncHandler(userController.getUsersVisits));

// Network routes
router.get('/networks', auth(), asyncHandler(networkController.getAll));
router.get('/networks/:id', auth(), asyncHandler(networkController.getById));
router.post('/networks', auth(), validate(createNetworkSchema), asyncHandler(networkController.create));
router.patch('/networks/:id', auth(), validate(updateNetworkSchema), asyncHandler(networkController.update));
router.delete('/networks/:id', auth(), asyncHandler(networkController.delete));
router.get('/networks/:id/members', auth(), asyncHandler(networkController.getMembers));
router.post('/networks/:id/members', auth(), validate(addMemberSchema), asyncHandler(networkController.addMember));
router.delete('/networks/:network_id/members/:member_id', auth(), asyncHandler(networkController.removeMember));
router.get('/networks/:id/caches', auth(), asyncHandler(networkController.getCaches));

// Caches routes
router.post('/caches', auth(), validate(createCacheSchema), asyncHandler(cacheController.create));
router.get('/caches/:id', auth(), asyncHandler(cacheController.getById));
router.patch('/caches/:id', auth(), validate(updateCacheSchema), asyncHandler(cacheController.update));
router.delete('/caches/:id', auth(), asyncHandler(cacheController.delete));
router.get('/caches/:id/visits', auth(), asyncHandler(cacheController.getVisitsByCache));

// Routes de référentiel
router.get("/caches-types", asyncHandler(referentielController.getAllCachesTypes));
router.get("/caches-states", asyncHandler(referentielController.getAllCachesStates));

export default router;