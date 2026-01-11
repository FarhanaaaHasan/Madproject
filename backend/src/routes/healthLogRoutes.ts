import { Router } from 'express';
import { healthLogController } from '../controllers/healthLogController';
import { verifyToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(verifyToken);

// POST /api/health-logs - Add new health log
router.post('/', healthLogController.addHealthLog.bind(healthLogController));

// GET /api/health-logs - Get all health logs for user (optional ?type= query param)
router.get('/', healthLogController.getUserHealthLogs.bind(healthLogController));

// GET /api/health-logs/:id - Get health log by ID
router.get('/:id', healthLogController.getHealthLogById.bind(healthLogController));

// PATCH /api/health-logs/:id - Update health log
router.patch('/:id', healthLogController.updateHealthLog.bind(healthLogController));

// DELETE /api/health-logs/:id - Delete health log
router.delete('/:id', healthLogController.deleteHealthLog.bind(healthLogController));

export default router;
