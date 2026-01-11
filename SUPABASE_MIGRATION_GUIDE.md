# Supabase Migration Guide

This guide will walk you through setting up Supabase for your Medexa health management application and completing the migration from Firebase.

## Table of Contents

1. [Supabase Setup](#supabase-setup)
2. [Database Schema](#database-schema)
3. [Environment Variables](#environment-variables)
4. [Authentication Setup](#authentication-setup)
5. [API Integration](#api-integration)
6. [Testing](#testing)
7. [Deployment](#deployment)

---

## Supabase Setup

### Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com) and click "Start your project"
2. Sign up with your email or GitHub account
3. Create a new organization (or use existing one)
4. Create a new project with:
   - **Project Name**: `medexa` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development

### Step 2: Get Your Supabase Credentials

Once your project is created:

1. Go to **Project Settings** → **API**
2. Copy the following:
   - **Project URL** (Supabase URL)
   - **anon public** (for frontend - EXPO_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role secret** (for backend - SUPABASE_SERVICE_KEY)

### Step 3: Setup Your Environment Variables

Create a `.env` file in your project root (copy from `.env.example`):

```bash
# Frontend (Expo)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Backend (Express)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# Backend Configuration
PORT=3000
CORS_ORIGIN=http://localhost:3000,exp://localhost:8081
```

---

## Database Schema

### Step 1: Create Tables in Supabase

Go to your Supabase dashboard → **SQL Editor** and run the following SQL commands:

#### 1. Create Auth Users Profile Table

```sql
CREATE TABLE user_profiles (
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

-- Create RLS policy: Users can only access their own profile
CREATE POLICY "Users can access their own profile"
ON user_profiles FOR ALL
USING (auth.uid() = user_id);
```

#### 2. Create Medications Table

```sql
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  reason TEXT,
  side_effects TEXT,
  prescription_number TEXT,
  pharmacy_name TEXT,
  refills_remaining INT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can only access their own medications
CREATE POLICY "Users can access their own medications"
ON medications FOR ALL
USING (auth.uid() = user_id);
```

#### 3. Create Health Logs Table

```sql
CREATE TABLE health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL (e.g., 'blood_pressure', 'blood_sugar', 'weight', 'heart_rate'),
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

-- Create RLS policy: Users can only access their own health logs
CREATE POLICY "Users can access their own health logs"
ON health_logs FOR ALL
USING (auth.uid() = user_id);
```

#### 4. Create Appointments Table

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_name TEXT NOT NULL,
  hospital_name TEXT NOT NULL,
  specialty TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  reason TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled' (scheduled, completed, cancelled),
  reminder_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can only access their own appointments
CREATE POLICY "Users can access their own appointments"
ON appointments FOR ALL
USING (auth.uid() = user_id);
```

### Step 2: Create Indexes for Performance

```sql
-- Indexes for faster queries
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_medications_user_id ON medications(user_id);
CREATE INDEX idx_health_logs_user_id ON health_logs(user_id);
CREATE INDEX idx_health_logs_user_date ON health_logs(user_id, date);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(date);
```

---

## Environment Variables

### Frontend (.env)

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (.env)

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

PORT=3000
CORS_ORIGIN=http://localhost:3000,exp://localhost:8081
```

---

## Authentication Setup

### Supabase Auth Configuration

1. Go to **Authentication** → **Providers**
2. Ensure **Email** provider is enabled (default)
3. Configure authentication settings:
   - Go to **Authentication** → **Settings**
   - Set **Site URL** to your app domain
   - Set **Redirect URLs** to your app URLs
   - Enable email confirmation if needed

### User Registration Flow

When users sign up:

1. Supabase Auth handles user creation in `auth.users` table
2. A user profile is automatically created in `user_profiles` table
3. RLS policies ensure users can only access their data

---

## API Integration

### Backend API Endpoints

The following endpoints have been updated to use Supabase:

#### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/user` - Get current user

#### User Profile

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile` - Create user profile

#### Medications

- `POST /api/medications` - Create medication
- `GET /api/medications` - Get all medications
- `GET /api/medications/:id` - Get single medication
- `PUT /api/medications/:id` - Update medication
- `DELETE /api/medications/:id` - Delete medication

#### Health Logs

- `POST /api/health-logs` - Create health log
- `GET /api/health-logs` - Get all health logs
- `GET /api/health-logs/:id` - Get single health log
- `PUT /api/health-logs/:id` - Update health log
- `DELETE /api/health-logs/:id` - Delete health log

#### Appointments

- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get single appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Frontend Integration

The frontend now uses the `@supabase/supabase-js` client:

```typescript
// Using the Supabase client
import { supabase } from "@/config/supabase";

// Authentication
const { data, error } = await supabase.auth.signUp({
  email,
  password,
});

// Database operations
const { data, error } = await supabase
  .from("medications")
  .select("*")
  .eq("user_id", userId);
```

---

## Testing

### Manual Testing Steps

1. **Test Authentication**

   ```bash
   # Sign up
   POST /api/auth/signup
   {
     "email": "test@example.com",
     "password": "Test123!",
     "name": "Test User"
   }

   # Sign in
   POST /api/auth/signin
   {
     "email": "test@example.com",
     "password": "Test123!"
   }
   ```

2. **Test Profile Operations**

   ```bash
   # Create/update profile
   PUT /api/profile
   {
     "name": "John Doe",
     "age": 30,
     "blood_type": "O+",
     "allergies": ["Penicillin"]
   }
   ```

3. **Test Data Operations**
   ```bash
   # Create medication
   POST /api/medications
   {
     "name": "Aspirin",
     "dosage": "100mg",
     "frequency": "Daily"
   }
   ```

---

## Deployment

### Frontend Deployment

#### Expo Go / Managed Workflow

1. Update environment variables in your deployment platform
2. Rebuild the app:
   ```bash
   eas build --platform ios --auto-submit
   ```

#### Web Deployment (Vercel/Netlify)

1. Set environment variables in your deployment platform
2. Deploy using your standard process

### Backend Deployment

#### Deploy to Railway, Render, or Heroku

1. Set environment variables:

   ```bash
   SUPABASE_URL=your-url
   SUPABASE_ANON_KEY=your-key
   SUPABASE_SERVICE_KEY=your-key
   PORT=3000
   CORS_ORIGIN=your-domain
   ```

2. Build and deploy:
   ```bash
   npm run build
   npm run start
   ```

---

## Important Security Notes

⚠️ **Security Best Practices:**

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use different keys for frontend and backend**
   - Frontend: Use `anon` public key only
   - Backend: Use `service_role` key for admin operations
3. **Enable RLS (Row Level Security)** on all tables
4. **Set up proper CORS** on your backend
5. **Use strong passwords** for database
6. **Regularly rotate secrets** in production
7. **Monitor API usage** in Supabase dashboard

---

## Troubleshooting

### Common Issues

**Issue: "Invalid API key"**

- Verify your keys are correct in `.env`
- Check that you're using the right key (anon vs service_role)

**Issue: "RLS policy violation"**

- Ensure user is authenticated
- Check RLS policies allow the operation
- Verify user_id matches auth.uid()

**Issue: "CORS errors"**

- Add your frontend URL to CORS_ORIGIN in backend
- Restart backend server after changes

**Issue: "Table not found"**

- Verify tables were created in Supabase dashboard
- Check table names match exactly (case-sensitive)

---

## Next Steps

1. ✅ Update environment variables with your Supabase credentials
2. ✅ Create all database tables using the SQL scripts above
3. ✅ Install dependencies:
   ```bash
   npm install  # Install @supabase/supabase-js
   cd backend && npm install  # Install backend deps
   ```
4. ✅ Test the authentication flow
5. ✅ Test CRUD operations for each entity
6. ✅ Deploy frontend and backend

---

## Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Database Guide](https://supabase.com/docs/guides/database)

---

**Migration Completed!** Your Medexa app is now ready to use Supabase instead of Firebase. 🎉
