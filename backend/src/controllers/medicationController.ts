import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { medicationService } from '../services/medicationService';
import { ApiResponse, Medication } from '../types';

export class MedicationController {
  // Add medication
  async addMedication(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        } as ApiResponse);
        return;
      }

      const medicationData = req.body;
      const medication = {
        ...medicationData,
        userId,
      };

      const id = await medicationService.addMedication(medication);

      res.status(201).json({
        success: true,
        data: { id },
        message: 'Medication added successfully',
      } as ApiResponse);
    } catch (error: any) {
      console.error('[MedicationController] Error adding medication:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to add medication',
      } as ApiResponse);
    }
  }

  // Get all medications for user
  async getUserMedications(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        } as ApiResponse);
        return;
      }

      const medications = await medicationService.getUserMedications(userId);

      res.status(200).json({
        success: true,
        data: medications,
      } as ApiResponse<Medication[]>);
    } catch (error: any) {
      console.error('[MedicationController] Error getting medications:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get medications',
      } as ApiResponse);
    }
  }

  // Get medication by ID
  async getMedicationById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.uid;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        } as ApiResponse);
        return;
      }

      const medication = await medicationService.getMedicationById(id);

      if (!medication) {
        res.status(404).json({
          success: false,
          error: 'Medication not found',
        } as ApiResponse);
        return;
      }

      // Verify ownership
      if (medication.userId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Forbidden',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: medication,
      } as ApiResponse<Medication>);
    } catch (error: any) {
      console.error('[MedicationController] Error getting medication:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get medication',
      } as ApiResponse);
    }
  }

  // Update medication
  async updateMedication(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.uid;
      const { id } = req.params;
      const updates = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        } as ApiResponse);
        return;
      }

      // Verify ownership
      const medication = await medicationService.getMedicationById(id);
      if (!medication) {
        res.status(404).json({
          success: false,
          error: 'Medication not found',
        } as ApiResponse);
        return;
      }

      if (medication.userId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Forbidden',
        } as ApiResponse);
        return;
      }

      await medicationService.updateMedication(id, updates);

      res.status(200).json({
        success: true,
        message: 'Medication updated successfully',
      } as ApiResponse);
    } catch (error: any) {
      console.error('[MedicationController] Error updating medication:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update medication',
      } as ApiResponse);
    }
  }

  // Delete medication
  async deleteMedication(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.uid;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        } as ApiResponse);
        return;
      }

      // Verify ownership
      const medication = await medicationService.getMedicationById(id);
      if (!medication) {
        res.status(404).json({
          success: false,
          error: 'Medication not found',
        } as ApiResponse);
        return;
      }

      if (medication.userId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Forbidden',
        } as ApiResponse);
        return;
      }

      await medicationService.deleteMedication(id);

      res.status(200).json({
        success: true,
        message: 'Medication deleted successfully',
      } as ApiResponse);
    } catch (error: any) {
      console.error('[MedicationController] Error deleting medication:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete medication',
      } as ApiResponse);
    }
  }
}

export const medicationController = new MedicationController();
