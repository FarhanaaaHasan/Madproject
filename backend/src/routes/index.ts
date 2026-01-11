import { Router } from 'express';
import appointmentRoutes from './appointmentRoutes';
import healthLogRoutes from './healthLogRoutes';
import medicationRoutes from './medicationRoutes';
import profileRoutes from './profileRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Medexa API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/profile', profileRoutes);
router.use('/medications', medicationRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/health-logs', healthLogRoutes);

export default router;
