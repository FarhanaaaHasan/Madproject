# Quick Command Reference

Copy and paste these commands to set up your Supabase project quickly.

## 1️⃣ Initial Setup

### Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

### Create Environment File

```bash
# Copy template
cp .env.example .env

# Edit .env with your Supabase credentials
# (Open .env in your editor and fill in the values)
```

---

## 2️⃣ Testing Backend

### Start Backend Development Server

```bash
cd backend
npm run dev
```

Backend should start at `http://localhost:3000`

### Test Authentication Endpoints

```bash
# Sign up (in another terminal)
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "name": "Test User"
  }'

# Sign in
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'

# Copy the token from response and use in next requests as:
# -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Data Endpoints

```bash
# Create medication
curl -X POST http://localhost:3000/api/medications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Aspirin",
    "dosage": "100mg",
    "frequency": "Once daily"
  }'

# Get medications
curl -X GET http://localhost:3000/api/medications \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create health log
curl -X POST http://localhost:3000/api/health-logs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "blood_pressure",
    "value": "120/80",
    "unit": "mmHg",
    "date": "2026-01-07"
  }'

# Get health logs
curl -X GET http://localhost:3000/api/health-logs \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create appointment
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "doctor_name": "Dr. Smith",
    "hospital_name": "City Hospital",
    "specialty": "Cardiology",
    "date": "2026-02-01",
    "time": "10:00",
    "reason": "Checkup"
  }'

# Get appointments
curl -X GET http://localhost:3000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 3️⃣ Testing Frontend

### Start Frontend Development

```bash
npm start
```

Choose your testing option:

- `i` - Open in iOS simulator
- `a` - Open in Android emulator
- `w` - Open in web browser
- `r` - Reload the app

### Test in App

1. Sign up with email/password
2. Check if user appears in Supabase auth
3. View profile
4. Add medication
5. View medications
6. Add health log
7. View health logs
8. Add appointment
9. View appointments

---

## 4️⃣ Building for Production

### Build Backend

```bash
cd backend
npm run build
npm run start
```

### Build Frontend for Web

```bash
npm run build  # or expo build:web
```

### Build for Native (iOS)

```bash
eas build --platform ios --auto-submit
```

### Build for Native (Android)

```bash
eas build --platform android --auto-submit
```

---

## 5️⃣ Linting & Testing

### Lint Code

```bash
# Frontend
npm run lint

# Backend
cd backend && npm run lint
```

---

## 6️⃣ Database Management

### Connect to Supabase Database

```bash
# Using psql (if installed)
psql -h db.REFERENCE_ID.supabase.co \
     -U postgres \
     -d postgres
```

### View Tables in Supabase CLI

```bash
# If you have supabase-cli installed
supabase db list
```

---

## 7️⃣ Debugging

### Check Backend Logs

```bash
# Logs are shown in terminal when running:
cd backend
npm run dev
```

### Check Frontend Logs

```bash
# Open browser developer tools (F12)
# Mobile app logs appear in:
# - Expo dev server console
# - Android Studio logcat
# - Xcode console
```

### Verify Environment Variables

```bash
# Check frontend sees env vars (backend console)
console.log(process.env.EXPO_PUBLIC_SUPABASE_URL)

# Check backend sees env vars
cd backend
node -e "console.log(process.env.SUPABASE_URL)"
```

---

## 8️⃣ Reset Everything

### Clear Backend

```bash
cd backend
npm run build:clean  # if script exists
rm -rf node_modules dist
npm install
npm run dev
```

### Clear Frontend

```bash
npm run reset-project  # if script exists
rm -rf node_modules
npm install
npm start
```

### Clear Database (⚠️ DANGEROUS)

```
Go to Supabase Dashboard → SQL Editor
Run: DROP TABLE IF EXISTS table_name CASCADE;
Then recreate tables from SUPABASE_MIGRATION_GUIDE.md
```

---

## 9️⃣ Environment Variables Reference

### Print Current Env Vars (Backend)

```bash
cd backend
node -e "console.log('SUPABASE_URL:', process.env.SUPABASE_URL); console.log('PORT:', process.env.PORT);"
```

### Print Current Env Vars (Frontend)

```bash
node -e "console.log('EXPO_PUBLIC_SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);"
```

---

## 🔟 Useful Supabase Commands

### Create New Migration

```bash
supabase migration new table_name
```

### Push to Supabase

```bash
supabase push
```

### Pull from Supabase

```bash
supabase pull
```

### Start Local Supabase

```bash
supabase start
```

### Stop Local Supabase

```bash
supabase stop
```

---

## 📋 One-Time Setup Checklist

Run these commands once:

```bash
# 1. Install dependencies
npm install
cd backend && npm install && cd ..

# 2. Create .env file
cp .env.example .env
# Edit .env with your credentials

# 3. Verify backend starts
cd backend
npm run dev
# Press Ctrl+C after seeing "Server running on port 3000"

# 4. Verify frontend starts
cd ..
npm start
# Press Ctrl+C after seeing startup messages

# You're ready to test!
```

---

## 🚀 Full Setup in One Go

```bash
#!/bin/bash

echo "Installing dependencies..."
npm install
cd backend && npm install && cd ..

echo "Creating .env file..."
cp .env.example .env
echo "⚠️  Edit .env with your Supabase credentials"

echo "Testing backend..."
cd backend
timeout 5 npm run dev || true

echo "✅ Setup complete!"
echo "Next steps:"
echo "1. Edit .env with your Supabase credentials"
echo "2. Create database tables (see SUPABASE_MIGRATION_GUIDE.md)"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: npm start"
```

---

## 📱 Testing on Different Platforms

### Web

```bash
npm start
# Select 'w' option
# Opens http://localhost:8081
```

### iOS Simulator

```bash
npm start
# Select 'i' option
# or: expo start --ios
```

### Android Emulator

```bash
npm start
# Select 'a' option
# or: expo start --android
```

### Physical Device

```bash
npm start
# Scan QR code with Expo Go app
```

---

## 🔗 Useful Links

```bash
# Local development
http://localhost:3000          # Backend API
http://localhost:8081         # Frontend (web)
http://localhost:54321        # Supabase local (if using local)

# Supabase Cloud
https://app.supabase.com       # Dashboard
https://your-project.supabase.co/rest/v1  # API endpoint
```

---

## ⚠️ Common Mistakes

```bash
# ❌ DON'T commit .env
git add .env  # WRONG!

# ✅ DO add to .gitignore (already done)
echo ".env" >> .gitignore

# ❌ DON'T use .env.example in production
# ✅ DO create real .env with actual values

# ❌ DON'T share your keys
cat .env | mail to:friend@example.com  # WRONG!

# ✅ DO keep keys secret and rotate regularly
```

---

## 🎯 Next Steps

1. **Setup**: Run commands in section 1️⃣
2. **Create Supabase Project**: Go to https://supabase.com
3. **Create Database Tables**: Use SQL from SUPABASE_MIGRATION_GUIDE.md
4. **Test Backend**: Run commands in section 2️⃣
5. **Test Frontend**: Run commands in section 3️⃣
6. **Deploy**: Use commands in section 4️⃣

Happy coding! 🚀
