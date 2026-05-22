import { Router } from 'express';
import { getUsers, deleteUser, updateUserStatus } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { restrictTo } from '../middleware/rbac.middleware';
import { validateObjectId } from '../middleware/validate.middleware';

const router = Router();

router.use(protect);
router.use(restrictTo('admin'));

router.get('/', getUsers);
router.patch('/:id/status', validateObjectId, updateUserStatus);
router.delete('/:id', validateObjectId, deleteUser);

export default router;
