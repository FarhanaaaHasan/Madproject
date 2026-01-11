import { supabase } from '../config/supabase';
import { Medication } from '../types';

const TABLE_NAME = 'medications';

export class MedicationService {
  // Add new medication
  async addMedication(
    medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const now = new Date();
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([
          {
            ...medication,
            created_at: now,
            updated_at: now,
          },
        ])
        .select();

      if (error) throw error;

      const id = data?.[0]?.id;
      console.log('[MedicationService] Added medication:', id);
      return id;
    } catch (error) {
      console.error('[MedicationService] Error adding medication:', error);
      throw error;
    }
  }

  // Get all medications for a user
  async getUserMedications(userId: string): Promise<Medication[]> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const medications: Medication[] = (data || []).map((doc) => ({
        id: doc.id,
        ...doc,
        createdAt: new Date(doc.created_at),
        updatedAt: new Date(doc.updated_at),
      } as Medication));

      console.log('[MedicationService] Retrieved medications:', medications.length);
      return medications;
    } catch (error) {
      console.error('[MedicationService] Error getting medications:', error);
      throw error;
    }
  }

  // Get single medication by ID
  async getMedicationById(id: string): Promise<Medication | null> {
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
        } as Medication;
      }
      return null;
    } catch (error) {
      console.error('[MedicationService] Error getting medication:', error);
      throw error;
    }
  }

  // Update medication
  async updateMedication(
    id: string,
    updates: Partial<Omit<Medication, 'id' | 'userId' | 'createdAt'>>
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

      console.log('[MedicationService] Updated medication:', id);
    } catch (error) {
      console.error('[MedicationService] Error updating medication:', error);
      throw error;
    }
  }

  // Delete medication
  async deleteMedication(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log('[MedicationService] Deleted medication:', id);
    } catch (error) {
      console.error('[MedicationService] Error deleting medication:', error);
      throw error;
    }
  }
}

export const medicationService = new MedicationService();
