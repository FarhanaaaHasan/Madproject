import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { appointmentService } from '../services/appointmentService';
import { ApiResponse, Appointment } from '../types';

export class AppointmentController {
  // Add appointment
  async addAppointment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        } as ApiResponse);
        return;
      }

      const appointmentData = req.body;
      const appointment = {
        ...appointmentData,
        userId,
      };

      const id = await appointmentService.addAppointment(appointment);

      res.status(201).json({
        success: true,
        data: { id },
        message: 'Appointment added successfully',
      } as ApiResponse);
    } catch (error: any) {
      console.error('[AppointmentController] Error adding appointment:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to add appointment',
      } as ApiResponse);
    }
  }

  // Get all appointments for user
  async getUserAppointments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        } as ApiResponse);
        return;
      }

      const appointments = await appointmentService.getUserAppointments(userId);

      res.status(200).json({
        success: true,
        data: appointments,
      } as ApiResponse<Appointment[]>);
    } catch (error: any) {
      console.error('[AppointmentController] Error getting appointments:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get appointments',
      } as ApiResponse);
    }
  }

  // Get appointment by ID
  async getAppointmentById(req: AuthRequest, res: Response): Promise<void> {
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

      const appointment = await appointmentService.getAppointmentById(id);

      if (!appointment) {
        res.status(404).json({
          success: false,
          error: 'Appointment not found',
        } as ApiResponse);
        return;
      }

      if (appointment.userId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Forbidden',
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: appointment,
      } as ApiResponse<Appointment>);
    } catch (error: any) {
      console.error('[AppointmentController] Error getting appointment:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get appointment',
      } as ApiResponse);
    }
  }

  // Update appointment
  async updateAppointment(req: AuthRequest, res: Response): Promise<void> {
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

      const appointment = await appointmentService.getAppointmentById(id);
      if (!appointment) {
        res.status(404).json({
          success: false,
          error: 'Appointment not found',
        } as ApiResponse);
        return;
      }

      if (appointment.userId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Forbidden',
        } as ApiResponse);
        return;
      }

      await appointmentService.updateAppointment(id, updates);

      res.status(200).json({
        success: true,
        message: 'Appointment updated successfully',
      } as ApiResponse);
    } catch (error: any) {
      console.error('[AppointmentController] Error updating appointment:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update appointment',
      } as ApiResponse);
    }
  }

  // Delete appointment
  async deleteAppointment(req: AuthRequest, res: Response): Promise<void> {
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

      const appointment = await appointmentService.getAppointmentById(id);
      if (!appointment) {
        res.status(404).json({
          success: false,
          error: 'Appointment not found',
        } as ApiResponse);
        return;
      }

      if (appointment.userId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Forbidden',
        } as ApiResponse);
        return;
      }

      await appointmentService.deleteAppointment(id);

      res.status(200).json({
        success: true,
        message: 'Appointment deleted successfully',
      } as ApiResponse);
    } catch (error: any) {
      console.error('[AppointmentController] Error deleting appointment:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete appointment',
      } as ApiResponse);
    }
  }
}

export const appointmentController = new AppointmentController();
