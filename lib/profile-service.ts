import { supabase } from '@/config/supabase';

export interface UserProfile {
  id?: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  age: string;
  bloodType: string;
  allergies: string;
  emergencyContact: string;
  createdAt: Date;
  updatedAt: Date;
}

const TABLE_NAME = 'user_profiles';

export const profileService = {
  // Create or update user profile
  async saveProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const now = new Date();

      // Check if profile exists
      const { data: existingProfile, error: selectError } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('user_id', profile.userId)
        .single();

      if (selectError && (selectError as any).code !== 'PGRST116') throw selectError;

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from(TABLE_NAME)
          .update({
            user_id: profile.userId,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            age: profile.age,
            blood_type: profile.bloodType,
            allergies: profile.allergies,
            emergency_contact: profile.emergencyContact,
            updated_at: now,
          })
          .eq('user_id', profile.userId);

        if (error) throw error;
        console.log('[ProfileService] Updated profile:', profile.userId);
      } else {
        // Create new profile
        const { error } = await supabase
          .from(TABLE_NAME)
          .insert([
            {
              user_id: profile.userId,
              name: profile.name,
              email: profile.email,
              phone: profile.phone,
              age: profile.age,
              blood_type: profile.bloodType,
              allergies: profile.allergies,
              emergency_contact: profile.emergencyContact,
              created_at: now,
              updated_at: now,
            },
          ]);

        if (error) throw error;
        console.log('[ProfileService] Created new profile:', profile.userId);
      }
    } catch (error) {
      console.error('[ProfileService] Error saving profile:', error);
      throw error;
    }
  },

  // Get user profile by userId
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && (error as any).code !== 'PGRST116') throw error;

      if (data) {
        console.log('[ProfileService] Retrieved profile data');
        return {
          id: data.id,
          userId: data.user_id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          age: data.age,
          bloodType: data.blood_type,
          allergies: data.allergies,
          emergencyContact: data.emergency_contact,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        } as UserProfile;
      }
      console.log('[ProfileService] No profile found for userId:', userId);
      return null;
    } catch (error) {
      console.error('[ProfileService] Error getting profile:', error);
      throw error;
    }
  },

  // Update specific profile fields
  async updateProfileField(
    userId: string,
    updates: Partial<Omit<UserProfile, 'id' | 'userId' | 'createdAt'>>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update({
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          age: updates.age,
          blood_type: updates.bloodType,
          allergies: updates.allergies,
          emergency_contact: updates.emergencyContact,
          updated_at: new Date(),
        })
        .eq('user_id', userId);

      if (error) throw error;
      console.log('[ProfileService] Updated profile fields:', userId);
    } catch (error) {
      console.error('[ProfileService] Error updating profile fields:', error);
      throw error;
    }
  },
};
