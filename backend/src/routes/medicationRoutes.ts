import { Router } from 'express';
import { medicationController } from '../controllers/medicationController';
import { verifyToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(verifyToken);

// POST /api/medications - Add new medication
router.post('/', medicationController.addMedication.bind(medicationController));

// GET /api/medications - Get all medications for user
router.get('/', medicationController.getUserMedications.bind(medicationController));

// GET /api/medications/:id - Get medication by ID
router.get('/:id', medicationController.getMedicationById.bind(medicationController));

// PATCH /api/medications/:id - Update medication
router.patch('/:id', medicationController.updateMedication.bind(medicationController));

// DELETE /api/medications/:id - Delete medication
router.delete('/:id', medicationController.deleteMedication.bind(medicationController));

export default router;
