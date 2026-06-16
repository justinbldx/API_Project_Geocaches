import { Router } from 'express';
import { UserController } from './controllers/user.controller';
import { CacheController } from './controllers/cache.controller';
import { asyncHandler } from './middlewares/asyncHandler';

const router = Router();
const userController = new UserController();
const cacheController = new CacheController();

router.get('/users', asyncHandler(userController.getAll));
router.get('/users/:id', asyncHandler(userController.getById));
router.post('/users', asyncHandler(userController.create));
router.put('/users/:id', asyncHandler(userController.update));
router.delete('/users/:id', asyncHandler(userController.delete));

router.get('/networks/:id/caches', asyncHandler(cacheController.getByNetwork));
router.post('/caches', asyncHandler(cacheController.create));
router.get('/caches/:id', asyncHandler(cacheController.getById));
router.put('/caches/:id', asyncHandler(cacheController.update));
router.delete('/caches/:id', asyncHandler(cacheController.delete));
router.get('/caches/:id/visits', asyncHandler(cacheController.getVisitsByCache));

export default router;