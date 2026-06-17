import { Router } from 'express';
import { UserController } from './controllers/user.controller';
import { asyncHandler } from './middlewares/asyncHandler';
import { NetworkController } from './controllers/network.controller';

const router = Router();
const userController = new UserController();
const networkController = new NetworkController();

// router.get('/', asyncHandler(userController.getAll));
// router.get('/:id', asyncHandler(userController.getById));
// router.post('/', asyncHandler(userController.create));
// router.put('/:id', asyncHandler(userController.update));
// router.delete('/:id', asyncHandler(userController.delete));

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