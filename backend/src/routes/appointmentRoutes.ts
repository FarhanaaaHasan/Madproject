import { Router } from 'express';
import { appointmentController } from '../controllers/appointmentController';
import { verifyToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(verifyToken);

// POST /api/appointments - Add new appointment
router.post('/', appointmentController.addAppointment.bind(appointmentController));

// GET /api/appointments - Get all appointments for user
router.get('/', appointmentController.getUserAppointments.bind(appointmentController));

// GET /api/appointments/:id - Get appointment by ID
router.get('/:id', appointmentController.getAppointmentById.bind(appointmentController));

// PATCH /api/appointments/:id - Update appointment
router.patch('/:id', appointmentController.updateAppointment.bind(appointmentController));

// DELETE /api/appointments/:id - Delete appointment
router.delete('/:id', appointmentController.deleteAppointment.bind(appointmentController));

export default router;
