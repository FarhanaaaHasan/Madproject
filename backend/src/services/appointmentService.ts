import { supabase } from '../config/supabase';
import { Appointment } from '../types';

const TABLE_NAME = 'appointments';

export class AppointmentService {
  // Add new appointment
  async addAppointment(
    appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const now = new Date();
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([
          {
            ...appointment,
            created_at: now,
            updated_at: now,
          },
        ])
        .select();

      if (error) throw error;

      const id = data?.[0]?.id;
      console.log('[AppointmentService] Added appointment:', id);
      return id;
    } catch (error) {
      console.error('[AppointmentService] Error adding appointment:', error);
      throw error;
    }
  }

  // Get all appointments for a user
  async getUserAppointments(userId: string): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;

      const appointments: Appointment[] = (data || []).map((doc) => ({
        id: doc.id,
        ...doc,
        createdAt: new Date(doc.created_at),
        updatedAt: new Date(doc.updated_at),
      } as Appointment));

      console.log('[AppointmentService] Retrieved appointments:', appointments.length);
      return appointments;
    } catch (error) {
      console.error('[AppointmentService] Error getting appointments:', error);
      throw error;
    }
  }

  // Get single appointment by ID
  async getAppointmentById(id: string): Promise<Appointment | null> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        return {
          id: data.id,
          ...data,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        } as Appointment;
      }
      return null;
    } catch (error) {
      console.error('[AppointmentService] Error getting appointment:', error);
      throw error;
    }
  }

  // Update appointment
  async updateAppointment(
    id: string,
    updates: Partial<Omit<Appointment, 'id' | 'userId' | 'createdAt'>>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update({
          ...updates,
          updated_at: new Date(),
        })
        .eq('id', id);

      if (error) throw error;

      console.log('[AppointmentService] Updated appointment:', id);
    } catch (error) {
      console.error('[AppointmentService] Error updating appointment:', error);
      throw error;
    }
  }

  // Delete appointment
  async deleteAppointment(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log('[AppointmentService] Deleted appointment:', id);
    } catch (error) {
      console.error('[AppointmentService] Error deleting appointment:', error);
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();
