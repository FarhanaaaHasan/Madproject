-- ========================================
-- COMPLETE SUPABASE DATABASE SCHEMA
-- ========================================
-- Run these commands in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste and Run

-- ========================================
-- 1. USER PROFILES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  age INT,
  gender TEXT,
  blood_type TEXT,
  allergies TEXT[],
  chronic_conditions TEXT[],
  emergency_contact TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can access their own profile" ON user_profiles;

-- Create RLS policy
CREATE POLICY "Users can access their own profile"
ON user_profiles FOR ALL
USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- ========================================
-- 2. MEDICATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  dosage TEXT NOT NULL,
  duration TEXT,
  frequency TEXT NOT NULL,
  meal_timing TEXT,
  notification_times TEXT[],
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can access their own medications" ON medications;

-- Create RLS policy
CREATE POLICY "Users can access their own medications"
ON medications FOR ALL
USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_medications_user_id ON medications(user_id);

-- ========================================
-- 3. HEALTH LOGS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  date DATE NOT NULL,
  time TIME,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can access their own health logs" ON health_logs;

-- Create RLS policy
CREATE POLICY "Users can access their own health logs"
ON health_logs FOR ALL
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_health_logs_user_id ON health_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_health_logs_user_date ON health_logs(user_id, date);

-- ========================================
-- 4. APPOINTMENTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_name TEXT NOT NULL,
  hospital_name TEXT NOT NULL,
  specialty TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  reason TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled',
  reminder_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can access their own appointments" ON appointments;

-- Create RLS policy
CREATE POLICY "Users can access their own appointments"
ON appointments FOR ALL
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Run these after creating tables to verify:

-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'medications', 'health_logs', 'appointments');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'medications', 'health_logs', 'appointments');
