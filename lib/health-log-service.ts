import { supabase } from './supabase-config';

export interface HealthLog {
  id?: string;
  user_id?: string;
  type: string;
  value: string;
  unit: string;
  date: string;
  time?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const healthLogService = {
  // Add a new health log
  async addHealthLog(log: Omit<HealthLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<{ data: HealthLog | null; error: any }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        return { data: null, error: authError };
      }
      
      if (!user) {
        console.error('No user found');
        return { data: null, error: new Error('User not authenticated') };
      }

      console.log('Adding health log for user:', user.id);

      const { data, error } = await supabase
        .from('health_logs')
        .insert([{
          user_id: user.id,
          type: log.type,
          value: log.value,
          unit: log.unit,
          date: log.date,
          time: log.time || null,
          notes: log.notes || null,
        }])
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
      } else {
        console.log('Health log added successfully:', data);
      }

      return { data, error };
    } catch (error) {
      console.error('Error adding health log:', error);
      return { data: null, error };
    }
  },

  // Get all health logs for the current user
  async getHealthLogs(): Promise<{ data: HealthLog[] | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase
        .from('health_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error fetching health logs:', error);
      return { data: null, error };
    }
  },

  // Get health logs by type
  async getHealthLogsByType(type: string): Promise<{ data: HealthLog[] | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase
        .from('health_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', type)
        .order('date', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error fetching health logs by type:', error);
      return { data: null, error };
    }
  },

  // Get latest log by type
  async getLatestLogByType(type: string): Promise<{ data: HealthLog | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase
        .from('health_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', type)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error fetching latest log:', error);
      return { data: null, error };
    }
  },

  // Update a health log
  async updateHealthLog(id: string, updates: Partial<HealthLog>): Promise<{ data: HealthLog | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('health_logs')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating health log:', error);
      return { data: null, error };
    }
  },

  // Delete a health log
  async deleteHealthLog(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('health_logs')
        .delete()
        .eq('id', id);

      return { error };
    } catch (error) {
      console.error('Error deleting health log:', error);
      return { error };
    }
  },
};
