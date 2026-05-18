import { Router } from 'express';
import authRoutes from './auth.routes';
import leadsRoutes from './lead.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/leads', leadsRoutes);

export default router;
