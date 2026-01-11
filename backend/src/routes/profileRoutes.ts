import { Router } from 'express';
import { profileController } from '../controllers/profileController';
import { verifyToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(verifyToken);

// POST /api/profile - Create or update profile
router.post('/', profileController.saveProfile.bind(profileController));

// GET /api/profile - Get user profile
router.get('/', profileController.getProfile.bind(profileController));

// PATCH /api/profile - Update profile fields
router.patch('/', profileController.updateProfile.bind(profileController));

export default router;
