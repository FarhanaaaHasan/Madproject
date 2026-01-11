import { supabase } from '@/config/supabase';

export interface Medication {
  id?: string;
  userId: string;
  name: string;
  type: string; // Tablet, Capsule, Syrup, Drop
  dosage: string;
  duration: string;
  frequency: string; // Daily, Weekly, Monthly
  mealTiming: string; // Before/After Breakfast/Lunch/Dinner
  notificationTimes: string[];
  startDate?: string; // YYYY-MM-DD format
  endDate?: string; // YYYY-MM-DD format
  createdAt: Date;
  updatedAt: Date;
}

const TABLE_NAME = 'medications';

export const medicationService = {
  // Add new medication
  async addMedication(medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Validate required fields match database NOT NULL constraints
      if (!medication.startDate) {
        throw new Error('Start date is required');
      }
      if (!medication.notificationTimes || medication.notificationTimes.length === 0) {
        throw new Error('At least one notification time is required');
      }

      const now = new Date();
      const insertData = {
        user_id: medication.userId,
        name: medication.name,
        type: medication.type,
        dosage: medication.dosage,
        duration: medication.duration || 'Ongoing',
        frequency: medication.frequency,
        meal_timing: medication.mealTiming,
        notification_times: medication.notificationTimes,
        start_date: medication.startDate,
        end_date: medication.endDate || null,
        created_at: now,
        updated_at: now,
      };

      console.log('[MedicationService] Inserting medication:', insertData);

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([insertData])
        .select();

      if (error) {
        console.error('[MedicationService] Supabase error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from insert');
      }

      const id = data[0].id as string;
      console.log('[MedicationService] Added medication successfully:', id);
      return id;
    } catch (error) {
      console.error('[MedicationService] Error adding medication:', error);
      throw error;
    }
  },

  // Get all medications for a user
  async getUserMedications(userId: string): Promise<Medication[]> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const medications: Medication[] = (data || []).map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        name: row.name,
        type: row.type,
        dosage: row.dosage,
        duration: row.duration,
        frequency: row.frequency,
        mealTiming: row.meal_timing,
        notificationTimes: row.notification_times || [],
        startDate: row.start_date || undefined,
        endDate: row.end_date || undefined,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }));

      console.log('[MedicationService] Retrieved medications:', medications.length);
      return medications;
    } catch (error) {
      console.error('[MedicationService] Error getting medications:', error);
      throw error;
    }
  },

  // Get single medication by ID
  async getMedicationById(id: string): Promise<Medication | null> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error && (error as any).code !== 'PGRST116') throw error;

      if (!data) return null;

      return {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        type: data.type,
        dosage: data.dosage,
        duration: data.duration,
        frequency: data.frequency,
        mealTiming: data.meal_timing,
        notificationTimes: data.notification_times || [],
        startDate: data.start_date || undefined,
        endDate: data.end_date || undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      } as Medication;
    } catch (error) {
      console.error('[MedicationService] Error getting medication:', error);
      throw error;
    }
  },

  // Update medication
  async updateMedication(id: string, updates: Partial<Omit<Medication, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update({
          name: updates.name,
          type: updates.type,
          dosage: updates.dosage,
          duration: updates.duration,
          frequency: updates.frequency,
          meal_timing: updates.mealTiming,
          notification_times: updates.notificationTimes,
          start_date: updates.startDate ?? null,
          end_date: updates.endDate ?? null,
          updated_at: new Date(),
        })
        .eq('id', id);

      if (error) throw error;
      console.log('[MedicationService] Updated medication:', id);
    } catch (error) {
      console.error('[MedicationService] Error updating medication:', error);
      throw error;
    }
  },

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
  },
};
