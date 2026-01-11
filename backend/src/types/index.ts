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

export interface Appointment {
  id?: string;
  userId: string;
  doctorName: string;
  hospitalName: string;
  date: string;
  time: string;
  reason: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthLog {
  id?: string;
  userId: string;
  type: string; // blood_pressure, blood_sugar, weight, temperature, etc.
  value: string;
  unit: string;
  date: string;
  time: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
