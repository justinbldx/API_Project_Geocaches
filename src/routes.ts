import { Router } from 'express';
import { UserController } from './controllers/user.controller';
import { asyncHandler } from './middlewares/asyncHandler';

const router = Router();
const userController = new UserController();

router.get('/users', asyncHandler(userController.getAll));
router.get('/users/:id', asyncHandler(userController.getById));
router.post('/users', asyncHandler(userController.create));
router.put('/users/:id', asyncHandler(userController.update));
router.delete('/users/:id', asyncHandler(userController.delete));

export default router;