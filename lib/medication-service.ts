import { db } from '@/config/firebase';
import {
    Timestamp,
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where
} from 'firebase/firestore';

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
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'medications';

export const medicationService = {
  // Add new medication
  async addMedication(medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...medication,
        createdAt: now,
        updatedAt: now,
      });
      console.log('[MedicationService] Added medication:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('[MedicationService] Error adding medication:', error);
      throw error;
    }
  },

  // Get all medications for a user
  async getUserMedications(userId: string): Promise<Medication[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const medications: Medication[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        medications.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Medication);
      });
      
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
      const medicationRef = doc(db, COLLECTION_NAME, id);
      const snap = await getDoc(medicationRef);
      
      if (snap.exists()) {
        const data = snap.data();
        return {
          id: snap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Medication;
      }
      return null;
    } catch (error) {
      console.error('[MedicationService] Error getting medication:', error);
      throw error;
    }
  },

  // Update medication
  async updateMedication(id: string, updates: Partial<Omit<Medication, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    try {
      const medicationRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(medicationRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      console.log('[MedicationService] Updated medication:', id);
    } catch (error) {
      console.error('[MedicationService] Error updating medication:', error);
      throw error;
    }
  },

  // Delete medication
  async deleteMedication(id: string): Promise<void> {
    try {
      const medicationRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(medicationRef);
      console.log('[MedicationService] Deleted medication:', id);
    } catch (error) {
      console.error('[MedicationService] Error deleting medication:', error);
      throw error;
    }
  },
};
