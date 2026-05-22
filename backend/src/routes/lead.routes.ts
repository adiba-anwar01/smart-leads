import { Router } from 'express';
import {
  createLead,
  deleteLead,
  exportLeadsCSV,
  getLeadById,
  getLeads,
  updateLead,
  getDashboardStats,
} from '../controllers/lead.controller';
import { protect } from '../middleware/auth.middleware';
import {
  createLeadValidation,
  updateLeadValidation,
  validate,
  validateObjectId,
} from '../middleware/validate.middleware';

const router = Router();

router.use(protect);

router.get('/export/csv', exportLeadsCSV);
router.get('/dashboard/stats', getDashboardStats);

router.get('/', getLeads);

router.post('/', createLeadValidation, validate, createLead);

router.get('/:id', validateObjectId, getLeadById);

router.put('/:id', validateObjectId, updateLeadValidation, validate, updateLead);

router.delete('/:id', validateObjectId, deleteLead);

export default router;
