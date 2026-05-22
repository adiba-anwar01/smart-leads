import { Router } from 'express';
import authRoutes from './auth.routes';
import leadsRoutes from './lead.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/leads', leadsRoutes);
router.use('/users', userRoutes);

export default router;
