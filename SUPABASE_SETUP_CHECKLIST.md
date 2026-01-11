# Supabase Setup Checklist

Follow these steps to complete your Supabase migration:

## 1. Create Supabase Project

- [ ] Go to https://supabase.com
- [ ] Sign up and create a new project
- [ ] Save your database password
- [ ] Wait for project to be provisioned

## 2. Get API Credentials

- [ ] Go to Project Settings → API
- [ ] Copy **Project URL** → `SUPABASE_URL`
- [ ] Copy **anon public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_ANON_KEY`
- [ ] Copy **service_role secret** → `SUPABASE_SERVICE_KEY`

## 3. Setup Environment Variables

- [ ] Copy `.env.example` to `.env`
- [ ] Fill in all Supabase credentials
- [ ] Verify `.env` is in `.gitignore`

## 4. Create Database Tables

- [ ] Go to Supabase Dashboard → SQL Editor
- [ ] Create `user_profiles` table (with RLS)
- [ ] Create `medications` table (with RLS)
- [ ] Create `health_logs` table (with RLS)
- [ ] Create `appointments` table (with RLS)
- [ ] Create indexes for better performance

## 5. Configure Authentication

- [ ] Go to Authentication → Providers
- [ ] Ensure Email provider is enabled
- [ ] Go to Settings and configure:
  - [ ] Site URL: your app domain
  - [ ] Redirect URLs: your app URLs

## 6. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

## 7. Test Backend

```bash
cd backend
npm run dev
```

Test these endpoints:

- [ ] POST /api/auth/signup - Sign up user
- [ ] POST /api/auth/signin - Sign in user
- [ ] GET /api/profile - Get user profile
- [ ] POST /medications - Create medication
- [ ] GET /medications - Get all medications
- [ ] POST /health-logs - Create health log
- [ ] GET /health-logs - Get all health logs
- [ ] POST /appointments - Create appointment
- [ ] GET /appointments - Get all appointments

## 8. Test Frontend

```bash
npm start
```

Test these features:

- [ ] Sign up with email
- [ ] Sign in with email
- [ ] View/Edit Profile
- [ ] Add Medication
- [ ] View Medications
- [ ] Add Health Log
- [ ] View Health Logs
- [ ] Add Appointment
- [ ] View Appointments

## 9. Deployment Preparation

- [ ] Update environment variables in your deployment platform
- [ ] Set up proper CORS settings
- [ ] Enable HTTPS
- [ ] Configure database backups in Supabase

## 10. Post-Deployment

- [ ] Test all features in production
- [ ] Monitor logs for errors
- [ ] Verify user data is being stored correctly
- [ ] Set up monitoring/alerts

---

## Important Notes

⚠️ **Before Going Live:**

1. Never commit `.env` file
2. Use environment variables for all sensitive data
3. Enable Row Level Security (RLS) on all tables
4. Test thoroughly with real data
5. Set up proper error logging
6. Configure email verification if needed
7. Test authentication flows

---

## Need Help?

- Read [SUPABASE_MIGRATION_GUIDE.md](./SUPABASE_MIGRATION_GUIDE.md) for detailed setup
- Check [Supabase Docs](https://supabase.com/docs)
- Review your backend logs: `npm run dev` in `/backend`
- Check frontend console for errors

---

**Status**: Ready for Supabase Setup ✅
