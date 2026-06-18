import { Router } from 'express';
import { UserController } from './controllers/user.controller';
import { VisitController } from './controllers/visit.controller';
import { ReferentielController } from './controllers/referentiel.controller';
import { asyncHandler } from './middlewares/asyncHandler';

const router = Router();
const userController = new UserController();
const visitController = new VisitController();
const referentielController = new ReferentielController();

router.get('/users', asyncHandler(userController.getAll));
router.get('/users/:id', asyncHandler(userController.getById));
router.post('/users', asyncHandler(userController.create));
router.put('/users/:id', asyncHandler(userController.update));
router.delete('/users/:id', asyncHandler(userController.delete));


//visits routes
router.post("/visits", asyncHandler(visitController.create));
router.get("/visits/:id", asyncHandler(visitController.getById));


//referentiel routes
router.get("/caches-types", asyncHandler(referentielController.getAllCachesTypes));
router.get("/caches-states", asyncHandler(referentielController.getAllCachesStates));

export default router;