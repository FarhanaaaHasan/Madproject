import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { healthLogService } from '../services/healthLogService';
import { ApiResponse, HealthLog } from '../types';

export class HealthLogController {
  // Add health log
  async addHealthLog(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        } as ApiResponse);
        return;
      }

      const healthLogData = req.body;
      const healthLog = {
        ...healthLogData,
        userId,
      };

      const id = await healthLogService.addHealthLog(healthLog);

      res.status(201).json({
        success: true,
        data: { id },
        message: 'Health log added successfully',
      } as ApiResponse);
    } catch (error: any) {
      console.error('[HealthLogController] Error adding health log:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to add health log',
      } as ApiResponse);
    }
  }

  // Get all health logs for user
  async getUserHealthLogs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        } as ApiResponse);
        return;
      }

      const type = req.query.type as string | undefined;
      const healthLogs = await healthLogService.getUserHealthLogs(userId, type);

      res.status(200).json({
        success: true,
        data: healthLogs,
      } as ApiResponse<HealthLog[]>);
    } catch (error: any) {
      console.error('[HealthLogController] Error getting health logs:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get health logs',
      } as ApiResponse);
    }
  }

  // Get health log by ID
  async getHealthLogById(req: AuthRequest, res: Response): Promise<void> {
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

      const healthLog = await healthLogService.getHealthLogById(id);

      if (!healthLog) {
        res.status(404).json({
          success: false,
          error: 'Health log not found',
        } as ApiResponse);
        return;
      }

      if (healthLog.userId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Forbidden',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: healthLog,
      } as ApiResponse<HealthLog>);
    } catch (error: any) {
      console.error('[HealthLogController] Error getting health log:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get health log',
      } as ApiResponse);
    }
  }

  // Update health log
  async updateHealthLog(req: AuthRequest, res: Response): Promise<void> {
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

      const healthLog = await healthLogService.getHealthLogById(id);
      if (!healthLog) {
        res.status(404).json({
          success: false,
          error: 'Health log not found',
        } as ApiResponse);
        return;
      }

      if (healthLog.userId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Forbidden',
        } as ApiResponse);
        return;
      }

      await healthLogService.updateHealthLog(id, updates);

      res.status(200).json({
        success: true,
        message: 'Health log updated successfully',
      } as ApiResponse);
    } catch (error: any) {
      console.error('[HealthLogController] Error updating health log:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update health log',
      } as ApiResponse);
    }
  }

  // Delete health log
  async deleteHealthLog(req: AuthRequest, res: Response): Promise<void> {
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

      const healthLog = await healthLogService.getHealthLogById(id);
      if (!healthLog) {
        res.status(404).json({
          success: false,
          error: 'Health log not found',
        } as ApiResponse);
        return;
      }

      if (healthLog.userId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Forbidden',
        } as ApiResponse);
        return;
      }

      await healthLogService.deleteHealthLog(id);

      res.status(200).json({
        success: true,
        message: 'Health log deleted successfully',
      } as ApiResponse);
    } catch (error: any) {
      console.error('[HealthLogController] Error deleting health log:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete health log',
      } as ApiResponse);
    }
  }
}

export const healthLogController = new HealthLogController();
