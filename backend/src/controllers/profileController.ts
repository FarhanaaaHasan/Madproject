import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { profileService } from '../services/profileService';
import { ApiResponse, UserProfile } from '../types';

export class ProfileController {
  // Create or update profile
  async saveProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        } as ApiResponse);
        return;
      }

      const profileData = req.body;
      
      // Ensure userId matches authenticated user
      const profile = {
        ...profileData,
        userId,
      };

      await profileService.saveProfile(profile);

      res.status(200).json({
        success: true,
        message: 'Profile saved successfully',
      } as ApiResponse);
    } catch (error: any) {
      console.error('[ProfileController] Error saving profile:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to save profile',
      } as ApiResponse);
    }
  }

  // Get user profile
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        } as ApiResponse);
        return;
      }

      const profile = await profileService.getProfile(userId);

      if (!profile) {
        res.status(404).json({
          success: false,
          error: 'Profile not found',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: profile,
      } as ApiResponse<UserProfile>);
    } catch (error: any) {
      console.error('[ProfileController] Error getting profile:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get profile',
      } as ApiResponse);
    }
  }

  // Update profile fields
  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        } as ApiResponse);
        return;
      }

      const updates = req.body;
      await profileService.updateProfileField(userId, updates);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
      } as ApiResponse);
    } catch (error: any) {
      console.error('[ProfileController] Error updating profile:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update profile',
      } as ApiResponse);
    }
  }
}

export const profileController = new ProfileController();
